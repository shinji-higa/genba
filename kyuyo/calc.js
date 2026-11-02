/* 給与の計算。画面でもテストでも同じものを使う（金額はすべて円）。
   決まり（ユーザー指示 2026-11-02）
   ・時間単価＝基本給÷月平均所定時間（年間所定時間÷12）。日額＝時間単価×8
   ・時間外は30分刻み。平日の時間外1.25、所定・法定休日の出勤は日額×1.6、休日の時間外は時間単価×2.0
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
    const { emp, att = {}, adj = {}, cfg, ym, taxTable } = ctx;
    const n = k => Number(att[k]) || 0, a = k => Number(adj[k]) || 0, warns = [];
    const base = Number(emp.base) || 0, hourly = cfg.monthHours > 0 ? base / cfg.monthHours : 0, daily = hourly * 8;
    const o = {};
    o.base = base;
    o.ot = yen(hourly * cfg.ot * n('otH'));
    o.shoDay = yen(daily * cfg.hol * n('shoDays'));
    o.shoOt = yen(hourly * cfg.holOt * n('shoOtH'));
    o.houDay = yen(daily * cfg.hol * n('houDays'));
    o.houOt = yen(hourly * cfg.holOt * n('houOtH'));
    o.night = yen(daily * (cfg.night - 1) * (n('nightDays') + n('nightShoDays') + n('nightHouDays')));
    o.family = Number(emp.family) || 0;
    o.commute = Number(emp.commute) || 0;
    o.trip = yen(cfg.tripNight * n('tripNights'));
    o.absent = -yen(daily * n('absentDays'));
    o.early = -yen(hourly * n('earlyH'));
    o.retro = a('retro');
    o.leave = a('leave');
    o.other = a('other');
    const payTotal = o.base + o.ot + o.shoDay + o.shoOt + o.houDay + o.houOt + o.night + o.family + o.commute + o.trip + o.absent + o.early + o.retro + o.leave + o.other;
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
    d.otherDed = a('otherDed');
    const dedTotal = d.health + d.pension + d.emp + d.tax + d.resident + d.yearEnd + d.otherDed;
    if (base <= 0) warns.push('基本給が入っていません');
    if (ins && !std) warns.push('標準報酬月額が入っていません');
    return { hourly, daily, pay: o, payTotal, ded: d, dedTotal, net: payTotal - dedTotal, taxable, taxAuto: t.tax, taxManual: manual, warns };
  }

  /** 賞与 */
  function calcBonus(ctx) {
    const { emp, amount, prevNet, cfg, ym, taxTable, taxManual } = ctx;
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
  /** 時間外の端数：30分刻み（切り捨て）。刻みは設定で変える */
  const stepH = (h, step) => { const s = (step || 30) / 60; return Math.floor((Number(h) || 0) / s + 1e-9) * s; };

  const api = { jpHolidays, workYear, calcMonth, calcBonus, monthlyTax, bonusRate, careTarget, payDay, period, rateAt, half, ymAdd, stepH };
  if (typeof module !== 'undefined') module.exports = api; else root.KY = api;
})(typeof window !== 'undefined' ? window : globalThis);
