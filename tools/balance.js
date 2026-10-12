// 岐阜統一戦記 バランス確認
// 人に近い考え方で自陣営を動かすボットに何度も遊ばせ、スタート地点と遊び方ごとの勝率を測る。
// ボットは画面と同じ GameLogic の公開関数だけを使う（ゲーム本体には手を入れない）。
//
// 使い方: node tools/balance.js [回数] [市町村コード...] [--mode=unify|region|both] [--years=20] [--set=名前=値,...]
//   例: node tools/balance.js 100 21507 --mode=region
//   --labels：42市町村すべてを両方の遊び方で測り（CPUの数だけ並列）、難易度の表を logic.js の DIFFICULTY の形で出す
//     例: node tools/balance.js 60 --labels
//   --set は logic.js の定数をその場だけ差し替えて試す（例: --set=AI_IDLE=0.25,AI_GUARD=0）
//   市町村を省くと、タイトル画面のおすすめ（難易度ごと）を全部測る
'use strict';
const fs = require('fs'), path = require('path'), vm = require('vm');
// --set があれば、logic.js の定数を書き換えて読み込む
const SET = (process.argv.find(a => a.startsWith('--set=')) || '').slice(6).split(',').filter(Boolean).map(kv => kv.split('='));
function loadLogic() {
  if (!SET.length) return require('../js/logic.js');
  let src = fs.readFileSync(path.join(__dirname, '../js/logic.js'), 'utf8');
  for (const [k, v] of SET) {
    const re = new RegExp('\\b' + k + ' = [^,;]+');
    if (!re.test(src)) throw new Error(`logic.js に定数 ${k} が見つかりません`);
    src = src.replace(re, `${k} = ${v}`);
  }
  const mod = { exports: {} };
  vm.runInNewContext(src, { module: mod, globalThis: {}, Math, Object, JSON, Set, Number, Array });
  return mod.exports;
}
const L = loadLogic();
const ctx = {};
vm.runInNewContext(fs.readFileSync(path.join(__dirname, '../js/map-data.js'), 'utf8') + ';this.MAP = MAP;', ctx);
const MAP = ctx.MAP;
const NAMES = {}, ADJ = {};
for (const m of MAP.muni) { NAMES[m.code] = m.name; ADJ[m.code] = m.adj; }
// タイトル画面のおすすめと同じ
const PICKS = ['21201', '21202', '21213', '21203', '21204', '21604', '21505', '21403', '21507', '21521'];
// 難易度の分け方。勝率は圏域制覇と県内統一の平均、期間は県内統一で勝つまでの中央値
const LABEL_RULE = { hard2: 65, hard: 98, easy: 99, easyMonths: 60 };
function labelOf(avg, unifyT) {
  if (avg < LABEL_RULE.hard2) return '超むずかしい';
  if (avg < LABEL_RULE.hard) return 'むずかしい';
  if (avg >= LABEL_RULE.easy && unifyT && unifyT <= LABEL_RULE.easyMonths) return 'やさしい';
  return 'ふつう';
}

// ---------- ボット ----------
// 住民投票の賛成率の見込み（乱数の分を除く）
const expYes = (st, f, c) => L.voteExpect(st, f, c);
// 自陣営と隣り合うライバル陣営の、いちばん高い平均満足度
function rivalSat(st, f, c) {
  let best = 0;
  for (const fac of st.factions) if (fac.id !== f && fac.alive && L.adjacentTo(st, ADJ, c, fac.id)) best = Math.max(best, L.avgSat(st, fac.id));
  return best;
}

function botTurn(st, f) {
  const me = st.factions[f], month = L.dateOf(st.turn).month;
  const net = () => L.factionIncome(st, f, month) - L.upkeep(st, f);
  // 蓄え：維持費2か月ぶん（3〜8億円）と、赤字なら3か月ぶん
  const reserve = () => Math.max(3, Math.min(8, L.upkeep(st, f) * 2)) + Math.max(0, -net()) * 3;
  // 申し入れの準備ができていてお金だけ足りない合併協議があれば、その費用を貯めておく
  const saving = () => {
    let need = 0;
    for (const c of Object.keys(st.m)) {
      if (st.m[c].owner === f || !L.adjacentTo(st, ADJ, c, f)) continue;
      // お金が費用に届かないときだけでなく、費用は払えても蓄えが残らないときも貯める
      const r = L.canDo(st, ADJ, f, 'talk', c, 99), cost = L.cmdCost(st, 'talk', c, undefined, f);
      const short = r.ok ? me.money - cost < reserve() : r.reason.startsWith('財源');
      if (short && expYes(st, f, c) >= (st.m[c].owner === -1 ? 52 : 56)) need = need ? Math.min(need, cost) : cost;
    }
    return need;
  };
  const scale = () => me.money > 400 ? 3 : me.money > 150 ? 2 : 1;
  const mine = () => L.owned(st, f);
  const goal = st.mode === 'region' ? new Set(L.goalOf(st).codes) : null;
  // urgent：守りのときは蓄えを割ってでも使う。extra：急がない内政などは、合併協議のための貯金に手を付けない
  const act = (cmd, c, urgent, extra) => {
    let s = L.SCALABLE.includes(cmd) ? scale() : undefined;
    let r = L.canDo(st, ADJ, f, cmd, c, st.ap, s);
    while (!r.ok && s > 0) { s--; r = L.canDo(st, ADJ, f, cmd, c, st.ap, s); }
    if (!r.ok || me.money - r.cost < (urgent ? 0 : reserve() + (extra ? saving() : 0))) return false;
    L.doCmd(st, NAMES, f, cmd, c, s); st.ap -= L.CMDS[cmd].ap;
    return true;
  };

  // 人材：空いた役職があれば、いちばん良い人を登用する
  if (st.ap > 0 && L.staffOf(st, f).filter(p => p.role).length < 4) {
    const p = L.hireCandidates(st, ADJ, f).sort((a, b) => (b.pol + b.neg + b.plan + b.pop) - (a.pol + a.neg + a.plan + a.pop))[0];
    if (p && net() > 2 && L.canHire(st, ADJ, f, p.id, st.ap).ok && me.money - L.hireCost(p) > reserve() + saving() + 10) { L.hire(st, NAMES, f, p.id); st.ap--; }
  }
  L.autoAssign(st, f);
  // 赤字なら、給与の高い人から役職を外す
  for (const p of L.staffOf(st, f).filter(p => p.role).sort((a, b) => L.GRADE_PAY[L.gradeOf(b)] - L.GRADE_PAY[L.gradeOf(a)])) {
    if (net() >= 0) break;
    L.assignRole(st, f, p.id, null);
  }
  // 偉人：招けるなら招く
  if (st.ap > 0) {
    const a = L.ADVISORS.find(a => L.canInviteAdv(st, f, a.id, st.ap).ok && me.money - a.cost > reserve() + saving() + 10);
    if (a) { L.inviteAdv(st, f, a.id); st.ap--; }
  }

  for (let guard = 0; st.ap > 0 && guard < 20; guard++) {
    const own = mine();
    // 1. 狙われている市町村：引き留めと子育て支援（本拠地を優先）
    const attacked = own.filter(c => { const t = st.m[c].talk; return t && !L.inTalk(t, f); })
      .sort((a, b) => (b === me.capital) - (a === me.capital) || st.m[b].pop - st.m[a].pop);
    if (attacked.some(c => act('keep', c, true))) continue;
    if (attacked.some(c => st.m[c].sat < rivalSat(st, f, c) + 5 && st.m[c].sat < 95 && act('care', c, true))) continue;
    // 2. 切り崩されそうな境目の市町村の満足度を先に上げる（本拠地は市町村が4つ以下のときに特に）
    const weak = own.filter(c => {
      const rs = rivalSat(st, f, c);
      if (!rs) return false;
      if (c === me.capital && own.length > 3) return false;
      return st.m[c].sat < 47 || rs - st.m[c].sat >= 5;
    }).sort((a, b) => (b === me.capital) - (a === me.capital) || st.m[a].sat - st.m[b].sat);
    if (weak.some(c => act('care', c, c === me.capital, true))) continue;
    // 3. 条件の競り合いで負けていれば上乗せ
    const contest = Object.keys(st.m).find(c => { const t = st.m[c].talk; return t && t.rival !== undefined && L.inTalk(t, f) && t.bids[f] <= t.bids[t.f === f ? t.rival : t.f]; });
    if (contest && act('raise', contest)) continue;
    // 4. 誘致合戦：ライバルが動かない最後の月に、見合う額まで上乗せして逆転する
    const site = L.lureSite(st, ADJ, f);
    if (site && st.lure.left === 1) {
      const best = Math.max(-1, ...L.lureParts(st, ADJ).filter(k => k !== f).map(k => L.lureScore(st, ADJ, k)));
      const cap = Math.floor(st.lure.inc * 20 / st.lure.step);
      if (L.lureScore(st, ADJ, f) <= best + 8 && L.lureBid(st, f) < cap && act('lure', site, false, true)) continue;
    }
    // 5. 合併協議：賛成の見込みが十分な相手に申し入れる（人口の多い順）
    const near = Object.keys(st.m).filter(c => st.m[c].owner !== f && L.adjacentTo(st, ADJ, c, f));
    const pref = c => (goal && goal.has(c) ? 1000 : 0) + st.m[c].pop;
    const talkable = near.filter(c => L.canDo(st, ADJ, f, 'talk', c, st.ap).ok && expYes(st, f, c) >= (st.m[c].owner === -1 ? 52 : 56)).sort((a, b) => pref(b) - pref(a));
    if (talkable.some(c => act('talk', c))) continue;
    // ほかの陣営の協議には、こちらの関係度が負けていなければ対抗提案
    const counter = near.find(c => { const t = st.m[c].talk; return t && t.rival === undefined && t.f !== f && st.m[c].owner === -1 && st.rel[f][c] >= st.rel[t.f][c] - 5; });
    if (counter && act('counter', counter)) continue;
    // 6. 連携協定
    if (near.some(c => act('pact', c))) continue;
    // 7. 交流事業：協議中で見込みが低い相手 → 協議・協定まであと少しの相手 → 切り崩せそうなライバルの市町村
    const myTalks = near.filter(c => st.m[c].talk && st.m[c].talk.f === f && expYes(st, f, c) < 62 && st.rel[f][c] < 100);
    if (myTalks.some(c => act('visit', c))) continue;
    const gap = c => { const r = st.rel[f][c]; return (st.m[c].pact.includes(f) ? 70 : 50) - r; };
    const indep = near.filter(c => st.m[c].owner === -1 && !st.m[c].talk && st.rel[f][c] < 100 && (gap(c) > 0 || expYes(st, f, c) < 52))
      .sort((a, b) => (goal ? (goal.has(b) - goal.has(a)) * 30 : 0) + gap(a) - gap(b));
    if (indep.slice(0, 2).some(c => act('visit', c, false, true))) continue;
    const steal = near.filter(c => st.m[c].owner >= 0 && (st.m[c].sat < 45 || L.avgSat(st, f) - st.m[c].sat >= 8) && st.rel[f][c] < 75);
    if (steal.some(c => act('visit', c, false, true))) continue;
    // 8. 稼ぎと魅力：収支が細いか魅力が低ければ、いちばん大きな市町村で産業振興（観光の町は観光PR）
    const big = own.slice().sort((a, b) => st.m[b].pop - st.m[a].pop)[0];
    const x = st.m[big];
    if ((net() < 4 || L.appeal(st, f) < 60) && act(x.tour > x.ind + 10 && x.tour < 95 ? 'tour' : 'ind', big, false, true)) continue;
    // 9. 満足度：いちばん低い市町村で子育て支援
    const low = own.slice().sort((a, b) => st.m[a].sat - st.m[b].sat)[0];
    if (st.m[low].sat < 60 && act('care', low, false, true)) continue;
    // 10. 余裕があれば、満足度を上げて切り崩しやすくする（ライバルの市町村は平均満足度の差で切り崩せる）
    if (me.money > 200 && st.m[low].sat < 90 && act('care', low, false, true)) continue;
    // 11. まだ余裕があれば産業振興
    if (me.money > 80 && act('ind', big, false, true)) continue;
    break;
  }
}

// ---------- 計測 ----------
function run(code, mode, seed, months) {
  const st = L.newGame(MAP, code, seed, mode);
  let peak = 1;
  while (!st.over && st.turn < months) {
    botTurn(st, 0);
    L.endTurn(st, ADJ, NAMES);
    peak = Math.max(peak, L.owned(st, 0).length);
  }
  const g = L.goalOf(st);
  return { over: st.over, turn: st.turn, peak, towns: g.codes.filter(c => st.m[c].owner === 0).length, goal: g.codes.length };
}
const median = a => { if (!a.length) return null; const s = a.slice().sort((p, q) => p - q); return s[s.length >> 1]; };
// 負けの理由を短く
const LOSS = [['本拠地', '本拠地を合併された'], ['財源', '財政破綻'], ['住民満足度', 'リコール']];
function measure(code, mode, n, months) {
  const r = { win: 0, winT: [], loss: {}, lossT: [], open: 0, openTowns: [], peak: [], goal: 0 };
  for (let i = 1; i <= n; i++) {
    const o = run(code, mode, i * 7919, months);
    r.goal = o.goal; r.peak.push(o.peak);
    if (!o.over) { r.open++; r.openTowns.push(o.towns); }
    else if (o.over.win) { r.win++; r.winT.push(o.turn); }
    else { const k = (LOSS.find(([w]) => o.over.text.includes(w)) || [, 'その他'])[1]; r.loss[k] = (r.loss[k] || 0) + 1; r.lossT.push(o.turn); }
  }
  return r;
}

// 42市町村×2つの遊び方を、子プロセスで並列に測って難易度の表を出す
function labels(n, months) {
  const { execFile } = require('child_process');
  const jobs = [];
  for (const c of Object.keys(L.INFO)) for (const m of ['region', 'unify']) jobs.push([c, m]);
  const out = {}, setArg = SET.length ? [`--set=${SET.map(kv => kv.join('=')).join(',')}`] : [];
  let next = 0, done = 0;
  const work = () => {
    if (next >= jobs.length) return;
    const [c, m] = jobs[next++];
    execFile(process.execPath, [__filename, String(n), c, `--mode=${m}`, `--years=${months / 12}`, '--json', ...setArg], { maxBuffer: 1 << 20 }, (err, stdout) => {
      if (err) throw err;
      (out[c] = out[c] || {})[m] = JSON.parse(stdout);
      process.stderr.write(`\r${++done}/${jobs.length}`);
      if (done === jobs.length) report(); else work();
    });
  };
  const report = () => {
    process.stderr.write('\n');
    const rows = Object.keys(out).map(c => {
      const r = out[c].region, u = out[c].unify, avg = (r.win + u.win) / 2 / n * 100;
      return { c, avg, r: r.win / n * 100, u: u.win / n * 100, rT: median(r.winT), uT: median(u.winT), label: labelOf(avg, median(u.winT)) };
    }).sort((a, b) => b.avg - a.avg || (a.uT || 999) - (b.uT || 999));
    console.log(`各${n}回・最長${months / 12}年。勝率は圏域制覇と県内統一の平均`);
    console.log('| 市町村 | 今の難易度 | 新しい難易度 | 勝率（平均） | 圏域制覇 | 県内統一 |');
    console.log('| --- | --- | --- | --- | --- | --- |');
    for (const x of rows) console.log(`| ${NAMES[x.c]} | ${L.difficultyOf(x.c)} | ${x.label} | ${Math.round(x.avg)}% | ${Math.round(x.r)}%・${x.rT || '-'}か月 | ${Math.round(x.u)}%・${x.uT || '-'}か月 |`);
    const by = {};
    for (const x of rows) (by[x.label] = by[x.label] || []).push(x.c);
    console.log('\n// logic.js の DIFFICULTY に貼る');
    for (const lv of ['やさしい', 'ふつう', 'むずかしい', '超むずかしい']) console.log(`    ${lv}: [${(by[lv] || []).sort().map(c => `'${c}'`).join(', ')}],`);
  };
  for (let i = 0; i < require('os').cpus().length; i++) work();
}

function main() {
  const args = process.argv.slice(2);
  const opt = k => { const a = args.find(x => x.startsWith(`--${k}=`)); return a ? a.split('=')[1] : null; };
  const nums = args.filter(a => /^\d+$/.test(a));
  const n = nums.length && nums[0].length < 5 ? Number(nums.shift()) : 100;
  const codes = nums.length ? nums : PICKS;
  const modes = (opt('mode') || 'both') === 'both' ? ['region', 'unify'] : [opt('mode')];
  const months = Number(opt('years') || 20) * 12;
  if (args.includes('--labels')) return labels(n, months);
  if (args.includes('--json')) { console.log(JSON.stringify(measure(codes[0], modes[0], n, months))); return; }
  if (SET.length) console.log(`差し替え：${SET.map(kv => kv.join('=')).join('、')}`);
  console.log(`各${n}回・最長${months / 12}年。勝ち＝${modes.map(m => L.MODES[m].label).join('／')}の達成`);
  console.log('| スタート | 難易度 | 遊び方 | 勝ち | 勝つまで（中央値） | 負け | 決着つかず | 最大の市町村数（中央値） |');
  console.log('| --- | --- | --- | --- | --- | --- | --- | --- |');
  for (const code of codes) for (const mode of modes) {
    const r = measure(code, mode, n, months);
    const pct = k => `${Math.round(k / n * 100)}%`;
    const loss = Object.entries(r.loss).map(([k, v]) => `${k} ${v}`).join('・');
    const label = mode === 'region' ? `${L.MODES[mode].label}（${L.INFO[code][0]}${r.goal}）` : L.MODES[mode].label;
    const lossTxt = loss ? `${pct(n - r.win - r.open)}（${loss}・中央値${median(r.lossT)}か月）` : '0%';
    console.log(`| ${NAMES[code]} | ${L.difficultyOf(code)} | ${label} | ${pct(r.win)} | ${r.win ? median(r.winT) + 'か月' : '-'} | ${lossTxt} | ${r.open ? `${pct(r.open)}（目標の${median(r.openTowns)}/${r.goal}）` : '0%'} | ${median(r.peak)} |`);
  }
}
// require したときは、ボットと計測の関数だけを渡す
if (require.main === module) main(); else module.exports = { L, botTurn, expYes, run, measure, MAP, NAMES, ADJ };
