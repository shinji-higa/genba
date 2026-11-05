/* 給与の計算。画面でもテストでも同じものを使う（金額はすべて円）。
   決まり（ユーザー指示 2026-11-02）
   ・時間単価＝基本給÷月平均所定時間（年間所定時間÷12）。日額＝時間単価×8
   ・時間外は1か月の合計で丸める（平日・所定休日・法定休日ごと。30分未満は切り捨て、30分以上は1時間に切り上げ。ユーザー指示 2026-11-03）
   ・平日の時間外1.25、所定・法定休日の出勤は日額×1.6、休日の時間外は時間単価×2.0
   ・家族手当＝（扶養親族等の数＋16歳未満の家族）×1万円、上限3万円（ユーザー指示 2026-11-03。金額は設定で変えられる）。役員など「家族手当なし」にチェックの人は0
   ・月60時間超：平日＋土曜の時間外が60時間を超えたら、超えた平日の時間に（1.5−1.25）を上乗せ（2026-11-04）
   ・夜間作業：日報の夜間チェックの日は昼の1日分×1.6。平日は基本給に入っているので上乗せ分（0.6）を足す。休日は休日の掛率＋上乗せ分
   ・出張手当は1泊3,500円。明細に載せて振込に足す。税金と社会保険の計算には入れない
   ・社会保険は前月分を今月の給与から引く（率は「その保険月」のものを使う） */
(function (root) {
  const yen = n => Math.round(n);
  // 給与から引く保険料の端数：50銭以下は切り捨て、50銭を超えると切り上げ
  const half = n => { const f = Math.floor(n), d = n - f; return d > 0.5 + 1e-9 ? f + 1 : f; };
  const ymAdd = (ym, n) => { const [y, m] = String(ym).split('-').map(Number), d = new Date(y, m - 1 + n, 1); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2); };
  // 適用月つきの履歴から、その月に使う行を選ぶ
  const rateAt = (hist, ym) => { let r = null; (hist || []).slice().sort((a, b) => (a.from < b.from ? -1 : 1)).forEach(x => { if (x.from <= ym) r = x; }); return r || {}; };

  /** 介護保険の対象：40歳になる月（誕生日の前日の月）から、65歳になる月の前月まで */
  function careTarget(birth, ym) {
    if (!birth) return false;
    const b = new Date(birth + 'T00:00:00'); if (isNaN(b)) return false;
    const eve = (age) => { const d = new Date(b.getFullYear() + age, b.getMonth(), b.getDate() - 1); return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2); };
    return ym >= eve(40) && ym < eve(65);
  }

  /** 介護保険の対象か。従業員の設定で「対象」「対象外」を選んでいればそちら、空欄なら生年月日から */
  const careOn = (emp, ym) => emp.care === 'yes' ? true : emp.care === 'no' ? false : careTarget(emp.birth, ym);

  /** 日本の祝日（振替休日・国民の休日を含む）{ 'yyyy-mm-dd': 名前 }。現場管理の日報と同じ決まり */
  function jpHolidays(y) {
    const key = d => d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    const base = {}, add = (m, d, n) => { base[key(new Date(y, m - 1, d))] = n; };
    const nthMon = (m, n) => 1 + ((8 - new Date(y, m - 1, 1).getDay()) % 7) + (n - 1) * 7;
    const eq = c => Math.floor(c + 0.242194 * (y - 1980) - Math.floor((y - 1980) / 4));
    add(1, 1, '元日'); add(1, nthMon(1, 2), '成人の日'); add(2, 11, '建国記念の日'); add(2, 23, '天皇誕生日'); add(3, eq(20.8431), '春分の日'); add(4, 29, '昭和の日'); add(5, 3, '憲法記念日'); add(5, 4, 'みどりの日'); add(5, 5, 'こどもの日');
    add(7, nthMon(7, 3), '海の日'); add(8, 11, '山の日'); add(9, nthMon(9, 3), '敬老の日'); add(9, eq(23.2488), '秋分の日'); add(10, nthMon(10, 2), 'スポーツの日'); add(11, 3, '文化の日'); add(11, 23, '勤労感謝の日');
    const out = { ...base };
    for (let d = new Date(y, 0, 2); d.getFullYear() === y; d.setDate(d.getDate() + 1)) {
      const k = key(d), p = new Date(d), n = new Date(d); p.setDate(d.getDate() - 1); n.setDate(d.getDate() + 1);
      if (!base[k] && d.getDay() !== 0 && base[key(p)] && base[key(n)]) out[k] = '国民の休日';
    }
    Object.keys(base).sort().forEach(k => { const [a, b, c] = k.split('-').map(Number), dt = new Date(a, b - 1, c); if (dt.getDay() !== 0) return; const n = new Date(dt); do { n.setDate(n.getDate() + 1); } while (out[key(n)]); out[key(n)] = '振替休日'; });
    return out;
  }
  /** その年の所定労働日数の内訳：平日 − 平日の祝日 − 会社休日 */
  function workYear(y, companyOff) {
    const h = jpHolidays(y); let weekdays = 0, holidays = 0;
    for (let d = new Date(y, 0, 1); d.getFullYear() === y; d.setDate(d.getDate() + 1)) {
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      weekdays++;
      if (h[d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2)]) holidays++;
    }
    return { weekdays, holidays, companyOff: Number(companyOff) || 0, days: weekdays - holidays - (Number(companyOff) || 0) };
  }

  /** 月額表（甲欄）。扶養は7人まで表、超えた分は1人ごとに定額を引く。範囲外は warn を返す */
  function monthlyTax(table, amt, deps) {
    const k = Math.max(0, deps | 0), c = Math.min(7, k), over = Math.max(0, k - 7);
    if (amt < table.under) return { tax: 0 };
    let base = null;
    for (const r of table.m) if (amt >= r[0] && amt < r[1]) { base = r[2 + c]; break; }
    if (base == null) {
      if (amt >= 740000 && amt < 790000) base = yen(table.r740[2 + c] + (amt - 740000) * 0.2042);
      else return { tax: 0, warn: '課税対象額が税額表の範囲外です。税理士さんの計算で入れてください' };
    }
    return { tax: Math.max(0, base - over * 1610) };
  }
  /** 賞与の算出率（甲欄）。前月の社会保険料等控除後の給与（千円）から率を決める */
  function bonusRate(table, prevNet, deps) {
    const list = table.b[Math.min(7, Math.max(0, deps | 0))], th = Math.floor(prevNet / 1000);
    let rate = 0; for (const r of list) if (th >= r[0]) rate = r[1];
    return rate;
  }

  /** 1人1か月の給与 */
  function calcMonth(ctx) {
    const { emp: emp0, att = {}, adj = {}, cfg, ym, taxTable } = ctx, emp = empAt(emp0, ym), hr = histRetro(emp0, ym);   // 基本給などは履歴からその月の値を使う
    const n = k => Number(att[k]) || 0, a = k => Number(adj[k]) || 0, warns = [];
    const base = Number(emp.base) || 0, hourly = cfg.monthHours > 0 ? base / cfg.monthHours : 0, daily = hourly * 8;
    const o = {};
    o.base = base;
    o.ot = yen(hourly * cfg.ot * n('otH'));
    // 月60時間超（ユーザー決定 2026-11-04）：数えるのは平日＋土曜の時間外（設定で土曜を外せる。日祝は法律で数えない）。
    // 超えた時間は平日の時間外から先に当て、平日の分だけ（60時間超の率 − 平日の率）を上乗せする。土曜の時間外はもともと高い率なので足さない
    const h60 = n('otH') + (cfg.noSat60 ? 0 : n('shoOtH')), over60 = Math.max(0, h60 - 60), w60 = Math.min(over60, n('otH'));
    o.ot60 = yen(hourly * Math.max(0, (cfg.ot60 != null ? cfg.ot60 : 1.5) - cfg.ot) * w60);
    o.shoDay = yen(daily * (cfg.holSho != null ? cfg.holSho : cfg.hol) * n('shoDays'));
    o.shoOt = yen(hourly * (cfg.otSho != null ? cfg.otSho : cfg.holOt) * n('shoOtH'));
    o.houDay = yen(daily * (cfg.holHou != null ? cfg.holHou : cfg.hol) * n('houDays'));
    o.houOt = yen(hourly * (cfg.otHou != null ? cfg.otHou : cfg.holOt) * n('houOtH'));
    o.night = yen(daily * (cfg.night - 1) * (n('nightDays') + n('nightShoDays') + n('nightHouDays')));
    o.family = familyPay(emp, cfg);
    o.commute = Number(emp.commute) || 0;
    o.trip = yen(cfg.tripNight * n('tripNights'));
    o.absent = -yen(daily * n('absentDays'));
    const pro = proDays(emp, ym, cfg);   // 入社・退職の月の日割り：在籍していない所定労働日を、欠勤と同じ日額で引く（手当は引かない。ユーザー決定 2026-11-04）
    o.prorate = -yen(daily * pro);
    o.early = -yen(hourly * n('earlyH'));
    o.retro = a('retro') + hr.pay;   // 遡及分＝手入力＋昇給を遡ったときの差額（履歴に控えた分）
    o.leave = a('leave');
    o.other = a('other');
    const payTotal = o.base + o.ot + o.ot60 + o.shoDay + o.shoOt + o.houDay + o.houOt + o.night + o.family + o.commute + o.trip + o.absent + o.prorate + o.early + o.retro + o.leave + o.other;
    const insPay = payTotal - o.trip;   // 雇用保険の対象（出張手当は外す）
    const insYm = ymAdd(ym, -1), r = rateAt(cfg.rates, insYm), ins = emp.insure !== false, emp2 = emp.empIns !== false;
    const std = Number(emp.std) || 0, stdP = Number(emp.stdPen) || std;
    const hRate = (Number(r.health) || 0) + (Number(r.child) || 0) + (careOn(emp, insYm) ? Number(r.care) || 0 : 0);
    const d = {};
    d.health = ins ? half(std * hRate / 100 / 2) : 0;
    d.pension = ins ? half(stdP * (Number(r.pension) || 0) / 100 / 2) : 0;
    d.emp = emp2 ? half(Math.max(0, insPay) * (Number(rateAt(cfg.rates, ym).emp) || 0) / 100) : 0;
    const social = d.health + d.pension + d.emp;
    const taxable = payTotal - o.trip - o.commute - social;
    const t = emp.noTax ? { tax: 0 } : monthlyTax(taxTable, taxable, emp.deps);
    const manual = adj.taxManual !== undefined && adj.taxManual !== '' && adj.taxManual !== null;   // 所得税は手入力もできる（ユーザー指示 2026-11-02）
    if (t.warn && !manual) warns.push(t.warn);
    d.tax = manual ? Number(adj.taxManual) || 0 : t.tax;
    d.resident = Number((emp.resident || {})[ym.slice(5)]) || 0;
    d.yearEnd = a('yearEnd');   // 年末調整：還付はマイナスで入れる
    d.otherDed = a('otherDed') + hr.ded;   // その他の控除＝手入力＋標準報酬を遡ったときの保険料の差額
    const dedTotal = d.health + d.pension + d.emp + d.tax + d.resident + d.yearEnd + d.otherDed;
    if (base <= 0) warns.push('基本給が入っていません');
    if (ins && !std) warns.push('標準報酬月額が入っていません');
    // notes は知らせるだけ（warns と違って確定は止めない）
    const notes = over60 > 0 ? ['時間外が月60時間を超えています（' + h60 + '時間、超えた分 ' + over60 + '時間）。超えた平日の ' + w60 + '時間に割増を足しました。'] : [];
    hr.notes.forEach(x => notes.push(x));
    if (pro > 0) notes.push('入社か退職の月なので、在籍していない所定労働日 ' + pro + '日分を日割りで引きました（日額 ' + yen(daily).toLocaleString('ja-JP') + '円）。');
    return { hourly, daily, pay: o, payTotal, ded: d, dedTotal, net: payTotal - dedTotal, taxable, taxAuto: t.tax, taxManual: manual, warns, notes, h60, over60, proDays: pro };
  }

  /** 賞与 */
  function calcBonus(ctx) {
    const { emp: emp0, amount, prevNet, cfg, ym, taxTable, taxManual } = ctx, emp = empAt(emp0, ym);
    const stdB = Math.floor(amount / 1000) * 1000, r = rateAt(cfg.rates, ym), ins = emp.insure !== false;
    const hRate = (Number(r.health) || 0) + (Number(r.child) || 0) + (careOn(emp, ym) ? Number(r.care) || 0 : 0);
    const d = {};
    d.health = ins ? half(stdB * hRate / 100 / 2) : 0;
    d.pension = ins ? half(Math.min(stdB, 1500000) * (Number(r.pension) || 0) / 100 / 2) : 0;
    d.emp = emp.empIns !== false ? half(amount * (Number(r.emp) || 0) / 100) : 0;
    const social = d.health + d.pension + d.emp, rate = emp.noTax ? 0 : bonusRate(taxTable, prevNet, emp.deps);
    const auto = Math.floor((amount - social) * rate / 100), manual = taxManual !== undefined && taxManual !== '' && taxManual !== null;
    d.tax = manual ? Number(taxManual) || 0 : auto;
    const dedTotal = d.health + d.pension + d.emp + d.tax;
    return { amount, ded: d, dedTotal, net: amount - dedTotal, rate, taxAuto: auto, taxManual: manual };
  }

  /** 支給日：月末。休みなら前の平日 */
  function payDay(ym, isOff) {
    const [y, m] = ym.split('-').map(Number), d = new Date(y, m, 0);
    while (isOff(d)) d.setDate(d.getDate() - 1);
    return d;
  }
  /** 締めの期間：前月21日〜当月20日 */
  function period(ym, closeDay) {
    const [y, m] = ym.split('-').map(Number), c = closeDay || 20;
    return { from: new Date(y, m - 2, c + 1), to: new Date(y, m - 1, c) };
  }
  /** 時間外の端数：1か月の合計で、30分未満は切り捨て、30分以上は1時間に切り上げ */
  const roundH = h => { const v = Number(h) || 0, f = Math.floor(v + 1e-9); return v - f >= 0.5 - 1e-9 ? f + 1 : f; };
  /** 日報の集計（1日ごとは丸めない）の時間外を丸める。丸める前の時間は raw に残す */
  function roundAtt(a) {
    if (!a || a.error) return a;
    const raw = a.raw || { otH: a.otH, shoOtH: a.shoOtH, houOtH: a.houOtH };
    return { ...a, raw, otH: roundH(raw.otH), shoOtH: roundH(raw.shoOtH), houOtH: roundH(raw.houOtH) };
  }
  /** 深夜（22時〜翌5時）に入る時間。日報の時刻は 20 や 5.5 の数。終わりが始まり以下なら翌日。
      夜間作業の日だけ数える。夜勤に休憩はない（ユーザー指示 2026-10-29）ので引かない */
  function lateH(start, end) {
    if (start === '' || start == null || end === '' || end == null) return 0;
    const s = Number(start); let e = Number(end); if (!isFinite(s) || !isFinite(e)) return 0; if (e <= s) e += 24;
    return [[-2, 5], [22, 29], [46, 53]].reduce((n, [a, b]) => n + Math.max(0, Math.min(e, b) - Math.max(s, a)), 0);
  }
  /* ---- 昇給と履歴（ユーザー決定 2026-11-03 案A＋案1）----
     emp.hist = { base: [{ from: 'YYYY-MM', v, why, by, at, retro: { ym, amount, kind, months } }], std: [...], ... }
     基本給・交通費・扶養・16歳未満は「給与の月」、標準報酬月額は「保険の月」で選ぶ。履歴が無い月は従業員の欄の値（最初の値）を使う。
     確定済みの月にかかったときは、足した時点で差額を計算して retro に控え、次の未確定の月に入れる（基本給→遡及分、標準報酬→その他の控除） */
  const HIST = { base: ['基本給', 'pay'], std: ['標準報酬月額（健康保険）', 'ins'], stdPen: ['標準報酬月額（厚生年金）', 'ins'], commute: ['交通費', 'pay'], deps: ['扶養親族等の数', 'pay'], kids16: ['16歳未満の家族', 'pay'] };
  /** その月に使う値。kind が 'ins' の項目は ym に保険の月を渡す */
  function valAt(emp, k, ym) {
    let r = null; ((emp.hist || {})[k] || []).forEach(x => { if (x.from <= ym && (!r || x.from >= r.from)) r = x; });
    return r ? r.v : emp[k];
  }
  /** 給与の月 ym に使う従業員（履歴の値を入れたもの）。標準報酬は前月（保険の月） */
  function empAt(emp, ym) {
    if (!emp || !emp.hist) return emp;
    const i = ymAdd(ym, -1), o = { ...emp };
    ['base', 'commute', 'deps', 'kids16'].forEach(k => { o[k] = valAt(emp, k, ym); });
    ['std', 'stdPen'].forEach(k => { o[k] = valAt(emp, k, i); });
    return o;
  }
  /** その月に入れる、履歴に控えた差額 */
  function histRetro(emp, ym) {
    const out = { pay: 0, ded: 0, notes: [] };
    Object.keys((emp && emp.hist) || {}).forEach(k => (emp.hist[k] || []).forEach(x => {
      if (!x.retro || x.retro.ym !== ym || !x.retro.amount) return;
      out[x.retro.kind] += x.retro.amount;
      out.notes.push((HIST[k] || [k])[0] + 'を ' + x.from + ' から変えた差額 ' + (x.retro.amount > 0 ? '' : '−') + Math.abs(x.retro.amount).toLocaleString('ja-JP') + '円を「' + (x.retro.kind === 'pay' ? '遡及分' : 'その他の控除') + '」に入れました（' + (x.retro.months || []).join('・') + '分）。');
    }));
    return out;
  }
  /** 確定済みの月の差額：前の従業員と新しい従業員で、同じ勤怠の計算をして差を足す。
      基本給は支給合計の差（時間外なども時間単価が変わる）、標準報酬は健康保険＋厚生年金の差 */
  function retroCalc({ oldEmp, newEmp, key, months, cfgOf, taxFor }) {
    let amount = 0; const list = [];
    months.forEach(m => {
      const c = { emp: null, att: m.att || {}, adj: {}, cfg: cfgOf(m.ym), ym: m.ym, taxTable: taxFor(m.ym) };
      const a = calcMonth({ ...c, emp: { ...oldEmp, hist: stripRetro(oldEmp.hist) } }), b = calcMonth({ ...c, emp: { ...newEmp, hist: stripRetro(newEmp.hist) } });
      const v = HIST[key][1] === 'ins' ? (b.ded.health + b.ded.pension) - (a.ded.health + a.ded.pension) : b.payTotal - a.payTotal;
      if (v) { amount += v; list.push(m.ym); }
    });
    return { amount, months: list };
  }
  const stripRetro = h => { const o = {}; Object.keys(h || {}).forEach(k => { o[k] = (h[k] || []).map(x => ({ ...x, retro: null })); }); return o; };   // 差額の計算では、ほかの控えた差額を入れない
  /** 日割りで引く日数：締めの期間の所定労働日（平日−祝日−会社休日 cfg.offDays）のうち、入社日より前と退職日より後の日 */
  function proDays(emp, ym, cfg) {
    const j = emp.joined || '', l = emp.leftDate || '';
    if (!j && !l) return 0;
    const p = period(ym, cfg.close), key = d => d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2), hol = {};
    let n = 0;
    for (const d = new Date(p.from); d <= p.to; d.setDate(d.getDate() + 1)) {
      const k = key(d), y = d.getFullYear(); hol[y] = hol[y] || jpHolidays(y);
      if (d.getDay() === 0 || d.getDay() === 6 || hol[y][k] || (cfg.offDays || []).includes(k)) continue;
      if ((j && k < j) || (l && k > l)) n++;
    }
    return n;
  }
  /** 締めの期間に1日でも在籍しているか。入社日が期間の終わりより後、退職日が期間の始まりより前の月は、明細を作らない
      （日額×所定日数が基本給に届かず、在籍0日でも基本給の残り・手当・雇用保険が出ていた。2026-11-05 運用テストで発見） */
  function inPeriod(emp, ym, cfg) {
    const p = period(ym, (cfg || {}).close), key = d => d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2);
    if (emp.joined && emp.joined > key(p.to)) return false;
    if (emp.leftDate && emp.leftDate < key(p.from)) return false;
    return true;
  }
  /** 家族手当：（扶養親族等の数＋16歳未満の家族）×1人の額、上限あり */
  const familyPay = (emp, cfg) => emp.noFamily ? 0 : Math.min(Number(cfg.familyMax != null ? cfg.familyMax : 30000), ((Number(emp.deps) || 0) + (Number(emp.kids16) || 0)) * Number(cfg.familyPer != null ? cfg.familyPer : 10000));

  const api = { jpHolidays, workYear, calcMonth, calcBonus, monthlyTax, bonusRate, careTarget, payDay, period, rateAt, half, ymAdd, roundH, roundAtt, familyPay, lateH, proDays, inPeriod, HIST, valAt, empAt, histRetro, retroCalc };
  if (typeof module !== 'undefined') module.exports = api; else root.KY = api;
})(typeof window !== 'undefined' ? window : globalThis);
