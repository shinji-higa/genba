/* 請求管理アプリの計算（画面・移行・試験で同じものを使う）。2026-11-05 作成
   税は今後変わることがある（ユーザー指示 2026-11-05）ので、税率は「区分・税率・いつから」の表で持つ。
   変わったときは設定の税率の表に1行足すだけで、その日以降の請求書から新しい税率になる。前の請求書は変わらない。 */
(function (root) {
  const SK = {};

  // 税の区分。std 標準税率・red 軽減税率は税率の表から、free 非課税・out 対象外（不課税）は税なし
  SK.KINDS = [['std', '標準税率'], ['red', '軽減税率'], ['free', '非課税'], ['out', '対象外']];
  SK.kindName = k => (SK.KINDS.find(x => x[0] === k) || [k, k])[1];
  SK.DEF_RATES = [
    { kind: 'std', rate: 3, from: '1989-04-01' }, { kind: 'std', rate: 5, from: '1997-04-01' },
    { kind: 'std', rate: 8, from: '2014-04-01' }, { kind: 'std', rate: 10, from: '2019-10-01' },
    { kind: 'red', rate: 8, from: '2019-10-01' }
  ];
  // その日に使う税率（無ければ null = 表に無い。画面で赤く知らせて保存させない）
  SK.rateOf = (kind, date, rates) => {
    if (kind === 'free' || kind === 'out') return 0;
    const r = (rates && rates.length ? rates : SK.DEF_RATES).filter(x => x.kind === kind && String(x.from) <= String(date)).sort((a, b) => a.from < b.from ? -1 : a.from > b.from ? 1 : 0).pop();
    return r ? Number(r.rate) : null;
  };
  // 端数：down 切り捨て・half 四捨五入・up 切り上げ。マイナス（値引き）も0から見て同じ向きに丸める
  SK.round = (v, how) => {
    const s = v < 0 ? -1 : 1, a = Math.abs(v), e = 1e-7;
    const r = how === 'up' ? Math.ceil(a - e) : how === 'half' ? Math.floor(a + 0.5 + e) : Math.floor(a + e);
    return s * r || 0;
  };
  SK.lineAmount = (l, cfg) => {
    if (l.type === 'text') return 0;
    if (l.amountFix != null && l.amountFix !== '') return Number(l.amountFix) || 0;   // 金額を手で入れた行（数量・単価なし）
    return SK.round((Number(l.qty) || 0) * (Number(l.price) || 0), (cfg && cfg.amtRound) || 'down');
  };

  /* 請求書の合計。適格請求書（インボイス）の決まりどおり、税率ごとに合計してから1回だけ消費税を丸める。
     inv.taxMode：'out' 外税（金額は税抜）・'in' 内税（金額は税込）。行ごとに税の区分（l.tax）を選ぶ。
     移行した古い請求書（inv.fixed）は販売らくだの合計をそのまま使い、計算し直さない */
  SK.calc = (inv, cfg) => {
    cfg = cfg || {};
    if (inv.fixed) return { groups: inv.fixed.groups || [], sub: inv.fixed.sub, tax: inv.fixed.tax, total: inv.fixed.total, missing: [] };
    const g = {}, missing = [], how = cfg.taxRound || 'down', inMode = inv.taxMode === 'in';
    (inv.lines || []).forEach(l => {
      if (l.type === 'text') return;
      const kind = l.tax || 'std', rate = SK.rateOf(kind, inv.date, cfg.rates);
      if (rate == null) { if (!missing.includes(kind)) missing.push(kind); return; }
      const key = kind + ':' + rate;
      (g[key] = g[key] || { kind, rate, amt: 0 }).amt += SK.lineAmount(l, cfg);
    });
    let sub = 0, tax = 0, total = 0;
    const order = k => SK.KINDS.findIndex(x => x[0] === k);
    const groups = Object.values(g).sort((a, b) => order(a.kind) - order(b.kind) || b.rate - a.rate).map(x => {
      let t, base, incl;
      if (inMode) { incl = x.amt; t = x.rate ? SK.round(incl * x.rate / (100 + x.rate), how) : 0; base = incl - t; }
      else { base = x.amt; t = x.rate ? SK.round(base * x.rate / 100, how) : 0; incl = base + t; }
      sub += base; tax += t; total += incl;
      return { kind: x.kind, rate: x.rate, base, tax: t, incl };
    });
    return { groups, sub, tax, total, missing };
  };
  SK.groupLabel = g => g.kind === 'free' ? '非課税' : g.kind === 'out' ? '対象外' : (g.rate + '%' + (g.kind === 'red' ? '（軽減税率）' : ''));

  /* 日付 'YYYY-MM-DD' */
  const pad = n => ('0' + n).slice(-2);
  SK.ymd = d => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  SK.parse = s => { const m = String(s || '').match(/^(\d{4})-(\d{2})-(\d{2})/); return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null; };
  SK.lastDay = (y, m0) => new Date(y, m0 + 1, 0).getDate();

  /* 入金予定日。得意先の支払いの決まり t = { close: 締め日（31以上は月末）, months: 何か月後（0 当月・1 翌月・2 翌々月）, day: 支払日（31以上は月末） }
     締め日より後に出した請求書は、次の締めに入る。休みの日でもずらさない（ずらし方は得意先ごとに違うため） */
  SK.dueOf = (date, t) => {
    const d = SK.parse(date);
    if (!d || !t || t.close == null || t.close === '') return '';
    const cl = Number(t.close), y = d.getFullYear(), m = d.getMonth();
    const closeDay = mm => Math.min(cl >= 31 ? 31 : cl, SK.lastDay(y, mm));
    let cm = m;
    if (d.getDate() > closeDay(m)) cm = m + 1;
    const pm = cm + (Number(t.months) || 0), py = y + Math.floor(pm / 12), pmm = ((pm % 12) + 12) % 12;
    const day = Math.min(Number(t.day) >= 31 ? 31 : (Number(t.day) || 31), SK.lastDay(py, pmm));
    return SK.ymd(new Date(py, pmm, day));
  };
  SK.termsLabel = t => {
    if (!t || t.close == null || t.close === '') return '未設定';
    const c = Number(t.close) >= 31 ? '月末' : t.close + '日', mo = ['当月', '翌月', '翌々月'][Number(t.months) || 0] || (t.months + 'か月後'), dd = Number(t.day) >= 31 ? '末' : t.day + '日';
    return c + '締め・' + mo + dd + '払い';
  };

  /* 入金の状態。入金は「入金額＋振込手数料（先方が差し引いた分）＋相殺」で合計を満たしたら入金済み */
  SK.paid = inv => (inv.payments || []).reduce((s, p) => s + (Number(p.amount) || 0) + (Number(p.fee) || 0), 0);
  SK.payState = (inv, today, total) => {
    if (inv.status === '取消') return '取消';
    const tot = total != null ? total : SK.calc(inv, {}).total, paid = SK.paid(inv);
    if (tot <= 0) return '入金なし';
    if (paid >= tot) return '入金済み';
    if (inv.due && today && String(today) > String(inv.due)) return '期日超え';
    return paid > 0 ? '一部入金' : '未入金';
  };
  SK.lastPayDate = inv => (inv.payments || []).map(p => p.date || '').filter(Boolean).sort().pop() || '';

  /* 領収書の収入印紙（売上代金の受取書・第17号の1文書）。国税庁 No.7105（令和8年4月1日現在法令等）を 2026-11-05 に確認。
     1,000万円を超える分は No.7141 の表なので、ここでは出さずに「確かめてください」と知らせる（null） */
  SK.STAMP = [[50000, 0], [1000000, 200], [2000000, 400], [3000000, 600], [5000000, 1000], [10000000, 2000]];
  SK.stampDuty = amount => {
    const a = Number(amount) || 0;
    if (a < 50000) return 0;
    for (let i = 1; i < SK.STAMP.length; i++) if (a <= SK.STAMP[i][0]) return SK.STAMP[i][1];
    return null;
  };

  /* 販売らくだの税区分（tblTaxClass）→ このアプリの区分。in = 内税 */
  SK.RAKU_TAX = { 6: ['std', 10, 1], 7: ['std', 10, 0], 104: ['red', 8, 1], 105: ['red', 8, 0], 4: ['std', 8, 1], 5: ['std', 8, 0], 0: ['std', 5, 1], 1: ['std', 5, 0], 2: ['free', 0, 0], 3: ['out', 0, 0], 9: ['out', 0, 0] };
  /* 付箋メモ「★11/10 入金済み」「★1/25 相殺」から入金日を読む。年は請求書の発行日から決める（発行日より60日以上前になるなら翌年） */
  SK.parseMemo = (memo, issue) => {
    const m = String(memo || '').replace(/[０-９]/g, c => String.fromCharCode(c.charCodeAt(0) - 0xFEE0)).match(/★\s*(\d{1,2})\s*[\/／]\s*(\d{1,2})\s*([^\s　]*)/);
    const d = SK.parse(issue);
    if (!m || !d) return null;
    let y = d.getFullYear(), c = new Date(y, +m[1] - 1, +m[2]);
    if (c.getMonth() !== +m[1] - 1) return null;
    if ((d - c) / 86400000 > 60) c = new Date(y + 1, +m[1] - 1, +m[2]);
    return { date: SK.ymd(c), how: /相殺/.test(m[3] || memo) ? '相殺' : '振込' };
  };

  /* 宛名の行（窓付き封筒・請求書の左上）。会社名の次の行に 部署・担当者＋敬称。担当者が無ければ会社名に敬称 */
  SK.addrLines = to => {
    to = to || {};
    const honor = to.honor || '様', person = [to.dept, to.person].filter(Boolean).join('　');
    return { zip: to.zip || '', addr1: to.addr1 || '', addr2: to.addr2 || '', name: (to.name || '') + (person ? '' : '　' + honor), person: person ? person + '　' + honor : '' };
  };

  // 金額の表示
  SK.yen = n => (Number(n) || 0).toLocaleString('ja-JP');
  if (typeof module !== 'undefined' && module.exports) module.exports = SK; else root.SK = SK;
})(this);
