// 岐阜統一戦記 ゲームロジック（画面に依存しない部分）
(function (root) {
  'use strict';

  // code: [圏域, 人口(千人・概数), 特産タグ]
  const INFO = {
    '21201': ['岐阜', 403, '鵜飼'], '21209': ['岐阜', 66, ''], '21213': ['岐阜', 145, '航空宇宙'],
    '21215': ['岐阜', 25, ''], '21216': ['岐阜', 56, ''], '21218': ['岐阜', 33, ''],
    '21302': ['岐阜', 26, ''], '21303': ['岐阜', 22, ''], '21421': ['岐阜', 18, ''],
    '21202': ['西濃', 158, ''], '21221': ['西濃', 33, ''], '21341': ['西濃', 27, ''],
    '21361': ['西濃', 26, ''], '21362': ['西濃', 7, '古戦場'], '21381': ['西濃', 19, ''],
    '21382': ['西濃', 10, ''], '21383': ['西濃', 14, ''], '21401': ['西濃', 20, ''],
    '21403': ['西濃', 22, ''], '21404': ['西濃', 23, ''],
    '21205': ['中濃', 85, '刃物'], '21207': ['中濃', 19, '美濃和紙'], '21211': ['中濃', 57, ''],
    '21214': ['中濃', 100, ''], '21219': ['中濃', 39, '郡上おどり'], '21501': ['中濃', 8, ''],
    '21502': ['中濃', 6, ''], '21503': ['中濃', 10, ''], '21504': ['中濃', 4, ''],
    '21505': ['中濃', 10, ''], '21506': ['中濃', 7, ''], '21507': ['中濃', 2, ''],
    '21521': ['中濃', 18, ''],
    '21204': ['東濃', 107, '美濃焼'], '21206': ['東濃', 77, '栗きんとん'], '21208': ['東濃', 37, '美濃焼'],
    '21210': ['東濃', 48, '栗きんとん'], '21212': ['東濃', 55, '美濃焼'],
    '21203': ['飛騨', 84, '高山祭'], '21217': ['飛騨', 23, '飛騨牛'], '21220': ['飛騨', 30, '温泉'],
    '21604': ['飛騨', 1.5, '合掌造り']
  };
  const REGIONS = ['岐阜', '西濃', '中濃', '東濃', '飛騨'];

  // 季節で観光収入が伸びる月
  const SEASON = {
    '鵜飼': { months: [5, 6, 7, 8, 9, 10], x: 1.6 },
    '高山祭': { months: [4, 10], x: 2.2 },
    '郡上おどり': { months: [7, 8, 9], x: 1.8 },
    '栗きんとん': { months: [9, 10, 11], x: 1.6 },
    '温泉': { months: [12, 1, 2, 3], x: 1.5 },
    '合掌造り': { months: [1, 2, 8], x: 1.4 },
    '美濃焼': { months: [5], x: 1.8 },
    '刃物': { months: [10], x: 1.6 }
  };
  const TOUR_TAG = { '鵜飼': 30, '高山祭': 45, '郡上おどり': 30, '栗きんとん': 18, '温泉': 40,
    '合掌造り': 55, '美濃焼': 15, '刃物': 10, '美濃和紙': 20, '古戦場': 30, '飛騨牛': 20, '航空宇宙': 10 };
  const IND_TAG = { '刃物': 15, '美濃焼': 12, '航空宇宙': 22, '美濃和紙': 6 };

  const MONTHS_TXT = ms => ms.length >= 3 && ms.every((m, i) => i === 0 || m === (ms[i - 1] % 12) + 1) ? `${ms[0]}〜${ms[ms.length - 1]}月` : ms.map(m => m + '月').join('・');
  function tagInfo(tag) {
    if (!tag) return '';
    const parts = [];
    const sn = SEASON[tag];
    if (sn) parts.push(`${MONTHS_TXT(sn.months)}は観光収入が${sn.x}倍`);
    if (IND_TAG[tag]) parts.push(`産業力が高め（+${IND_TAG[tag]}）`);
    if (TOUR_TAG[tag] && !sn) parts.push(`観光力が高め（+${TOUR_TAG[tag]}）`);
    if (tag === '合掌造り') parts.unshift('観光力がとても高い');
    if (tag === '郡上おどり') parts.push('8月に満足度+5');
    if (tag === '美濃和紙') parts.push('この市を持つ陣営の人材は企画+8');
    return parts.join('。');
  }
  const RIVAL_CANDIDATES = ['21201', '21202', '21204', '21203', '21214', '21205', '21206'];
  const FACTION_COLORS = ['me', 'r1', 'r2', 'r3'];

  function hash(s) { let h = 2166136261; for (const ch of s) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rnd(st) {
    st.seed = (st.seed + 0x6D2B79F5) | 0;
    let t = st.seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  function dateOf(turn) {
    const idx = 3 + turn; // 令和8年4月スタート
    const month = (idx % 12) + 1;
    const year = 2026 + Math.floor(idx / 12);
    return { month, year, reiwa: year - 2018, label: `令和${year - 2018}年${month}月` };
  }

  function difficultyOf(code) {
    const p = INFO[code][1];
    if (p >= 150) return 'やさしい';
    if (p >= 35) return 'ふつう';
    if (p >= 5) return 'むずかしい';
    return '超むずかしい';
  }

  function newGame(map, startCode, seed) {
    const names = {}; const adj = {};
    for (const m of map.muni) { names[m.code] = m.name; adj[m.code] = m.adj; }
    const st = { ver: 1, seed: seed | 0, turn: 0, player: 0, over: null, log: [], talksMax: 2 };
    // ライバルは、プレイヤーと隣り合わない主要都市から3つ
    const rivals = [];
    for (const c of RIVAL_CANDIDATES) {
      if (rivals.length >= 3) break;
      if (c === startCode || adj[startCode].includes(c)) continue;
      if (rivals.some(r => adj[r].includes(c))) continue;
      rivals.push(c);
    }
    const caps = [startCode, ...rivals];
    st.factions = caps.map((c, i) => ({
      id: i, capital: c, color: FACTION_COLORS[i], name: i === 0 ? 'あなた' : names[c].replace(/(市|町|村)$/, '') + '陣営',
      money: 20 + Math.round(INFO[c][1] * 0.05), alive: true, negMonths: 0, ai: i !== 0
    }));
    st.m = {};
    for (const m of map.muni) {
      const [region, pop, tag] = INFO[m.code];
      const h = hash(m.code);
      const isCity = /市$/.test(m.name);
      st.m[m.code] = {
        owner: -1, pop,
        ind: clamp(Math.round((isCity ? 44 : 32) + Math.log10(pop + 1) * 8 + (IND_TAG[tag] || 0) + (h % 9) - 4), 15, 90),
        tour: clamp(Math.round(18 + (TOUR_TAG[tag] || 0) + ((h >>> 4) % 11) - 5), 8, 95),
        sat: 50 + ((h >>> 8) % 13) - 4,
        dis: 42 + ((h >>> 12) % 17),
        pact: [], talk: null, cool: {}
      };
    }
    caps.forEach((c, i) => { st.m[c].owner = i; st.m[c].sat = Math.max(st.m[c].sat, 56); });
    st.rel = st.factions.map(f => {
      const r = {};
      const capRegion = INFO[f.capital][0];
      for (const c in st.m) r[c] = 22 + (INFO[c][0] === capRegion ? 14 : 0) + (hash(c + f.id) % 12);
      return r;
    });
    ensureStaff(st);
    st.ap = apMax(st, 0);
    st.aiAp = st.factions.map(f => apMax(st, f.id));
    addLog(st, `${dateOf(0).label}、${names[startCode]}の首長に就任。目標は県内42市町村の統一。`, 'info');
    return st;
  }

  function addLog(st, text, kind) { st.log.push({ t: st.turn, text, kind: kind || 'info' }); if (st.log.length > 300) st.log.shift(); }

  function owned(st, f) { return Object.keys(st.m).filter(c => st.m[c].owner === f); }
  function apMax(st, f) { return 3 + Math.floor((owned(st, f).length - 1) / 4); }
  function totalPop(st, f) { return owned(st, f).reduce((s, c) => s + st.m[c].pop, 0); }
  function avgSat(st, f) {
    const cs = owned(st, f); const p = totalPop(st, f) || 1;
    return cs.reduce((s, c) => s + st.m[c].sat * st.m[c].pop, 0) / p;
  }


  // ---------- 人材 ----------
  const SURNAMES = ['加藤', '伊藤', '林', '山田', '渡辺', '小川', '長尾', '堀', '河合', '安藤', '大野', '早川', '松井', '杉山', '野村', '古田', '水野', '坂井', '土屋', '森', '日比野', '各務', '纐纈', '可知', '棚橋', '国枝', '後藤', '酒井', '牧野', '服部'];
  const GIVEN = ['健一', '真理子', '浩二', '由美', '隆', '恵子', '翔太', '彩', '誠', '千尋', '大輔', '美穂', '拓也', '香織', '修', '葵', '直樹', '智子', '亮', '陽菜', '慎吾', '明美', '悠真', '紀子', '和也', '玲奈', '剛', '咲', '康弘', '里美'];
  const ROLES = {
    deputy: { label: '副市長', key: 'pol', what: '全体の税収が上がる' },
    planning: { label: '企画課長', key: 'plan', what: '内政コマンドの効果が上がる' },
    nego: { label: '交渉担当', key: 'neg', what: '交流事業と住民投票の賛成が上がる' },
    tourism: { label: '観光大使', key: 'pop', what: '観光収入が上がる' }
  };
  const ABIL = { pol: '政策', neg: '交渉', plan: '企画', pop: '人望' };
  function ensureStaff(st) {
    if (st.staff) {
      // 古い版で名前が欠けた人材を直す
      for (const p of st.staff) if (/undefined/.test(p.name)) p.name = p.name.replace('undefined', GIVEN[hash(p.name + p.id) % GIVEN.length]);
      return;
    }
    st.staff = [];
    let id = 0;
    for (const c in st.m) {
      const n = INFO[c][1] >= 50 ? 2 : 1;
      for (let k = 0; k < n; k++) {
        const h = hash(c + ':' + k);
        const ab = {};
        for (const a of Object.keys(ABIL)) ab[a] = 30 + (hash(c + a + k) % 41);
        const keys = Object.keys(ABIL), best = keys[(h >>> 3) % 4];
        ab[best] = 72 + (h % 21);
        st.staff.push({ id: id++, name: SURNAMES[h % SURNAMES.length] + ' ' + GIVEN[(h >>> 7) % GIVEN.length], home: c, f: -1, role: null, ...ab });
      }
    }
    for (const fac of st.factions) for (const p of st.staff) if (p.home === fac.capital) p.f = fac.id;
    for (const fac of st.factions) autoAssign(st, fac.id);
  }
  function gradeOf(p) { const b = Math.max(p.pol, p.neg, p.plan, p.pop); return b >= 97 ? 'S' : b >= 90 ? 'A' : b >= 80 ? 'B' : 'C'; }
  const GRADE_PAY = { C: 0.5, B: 1, A: 2, S: 3 };
  // 県外からの招へい：お金で高いグレードの人材を迎える
  const SCOUT = {
    B: { cost: 40, lo: 55, hi: 78, best: [80, 89] },
    A: { cost: 90, lo: 65, hi: 85, best: [90, 96] },
    S: { cost: 180, lo: 75, hi: 92, best: [97, 100] }
  };
  function canScout(st, f, grade, apLeft) {
    if (staffOf(st, f).length >= staffMax(st, f)) return { ok: false, reason: `人材は${staffMax(st, f)}人までです` };
    if (apLeft < 1) return { ok: false, reason: '今月の行動力が足りません（1必要）' };
    if (st.factions[f].money < SCOUT[grade].cost) return { ok: false, reason: `財源が足りません（${SCOUT[grade].cost}億円必要）` };
    return { ok: true, cost: SCOUT[grade].cost };
  }
  function scout(st, f, grade) {
    const g = SCOUT[grade]; st.factions[f].money -= g.cost;
    const ab = {}, keys = Object.keys(ABIL);
    for (const a of keys) ab[a] = g.lo + Math.floor(rnd(st) * (g.hi - g.lo + 1));
    const best = keys[Math.floor(rnd(st) * 4)];
    ab[best] = g.best[0] + Math.floor(rnd(st) * (g.best[1] - g.best[0] + 1));
    const id = st.staff.reduce((m, q) => Math.max(m, q.id), -1) + 1;
    const p = { id, name: SURNAMES[Math.floor(rnd(st) * SURNAMES.length)] + ' ' + GIVEN[Math.floor(rnd(st) * GIVEN.length)], home: st.factions[f].capital, ext: true, f, role: null, ...ab };
    st.staff.push(p);
    return p;
  }
  function staffOf(st, f) { return (st.staff || []).filter(p => p.f === f); }
  function staffMax(st, f) { return 3 + Math.floor(owned(st, f).length / 3); }
  function abil(st, f, p, key) {
    let v = p[key];
    if (key === 'plan' && st.m['21207'] && st.m['21207'].owner === f) v += 8; // 美濃和紙
    return Math.min(100, v);
  }
  function roleVal(st, f, role) {
    const p = (st.staff || []).find(q => q.f === f && q.role === role);
    return p ? abil(st, f, p, ROLES[role].key) : 0;
  }
  function hireCandidates(st, adj, f) {
    return (st.staff || []).filter(p => p.f === -1 && (st.m[p.home].owner === f || (st.m[p.home].owner === -1 && adjacentTo(st, adj, p.home, f))));
  }
  function hireCost(p) { return Math.round(4 + (p.pol + p.neg + p.plan + p.pop) / 40); }
  function canHire(st, adj, f, id, apLeft) {
    const p = st.staff.find(q => q.id === id);
    if (!p || p.f !== -1) return { ok: false, reason: 'この人材は登用できません' };
    if (!hireCandidates(st, adj, f).includes(p)) return { ok: false, reason: '自陣営か、隣り合う独立市町村の人材だけ登用できます' };
    if (staffOf(st, f).length >= staffMax(st, f)) return { ok: false, reason: `人材は${staffMax(st, f)}人までです（市町村が増えると増えます）` };
    if (apLeft < 1) return { ok: false, reason: '今月の行動力が足りません（1必要）' };
    if (st.factions[f].money < hireCost(p)) return { ok: false, reason: `財源が足りません（${hireCost(p)}億円必要）` };
    return { ok: true, cost: hireCost(p) };
  }
  function hire(st, names, f, id) {
    const p = st.staff.find(q => q.id === id);
    st.factions[f].money -= hireCost(p); p.f = f; p.role = null;
    return `${names[p.home]}出身の${p.name}を登用`;
  }
  function assignRole(st, f, id, role) {
    for (const q of st.staff) if (q.f === f && q.role === role && role) q.role = null;
    const p = st.staff.find(q => q.id === id && q.f === f);
    if (p) p.role = role || null;
  }
  function aiStaff(st, adj, names, f, apRef) {
    const out = [];
    const fac = st.factions[f];
    if (apRef.ap > 0 && fac.money > 50 && factionIncome(st, f, 4) - upkeep(st, f) > 8 && staffOf(st, f).length < staffMax(st, f) && rnd(st) < 0.3) {
      const cands = hireCandidates(st, adj, f).sort((a, b) => (b.pol + b.neg + b.plan + b.pop) - (a.pol + a.neg + a.plan + a.pop));
      if (cands.length && canHire(st, adj, f, cands[0].id, apRef.ap).ok) { apRef.ap--; out.push({ text: `${fac.name}が${hire(st, names, f, cands[0].id)}`, code: cands[0].home, cmd: 'hire', f }); }
    }
    // お金に余裕があれば県外から招へい
    if (apRef.ap > 0 && staffOf(st, f).length < staffMax(st, f) && rnd(st) < 0.15) {
      const g = fac.money > 700 ? 'S' : fac.money > 350 ? 'A' : fac.money > 160 ? 'B' : null;
      if (g && canScout(st, f, g, apRef.ap).ok) { apRef.ap--; const p = scout(st, f, g); out.push({ text: `${fac.name}が県外から${g}ランクの${p.name}を招へい`, code: fac.capital, cmd: 'hire', f }); }
    }
    autoAssign(st, f);
    return out;
  }
  // 役職は、得意な能力の高い組み合わせから順に割り当てる
  function autoAssign(st, f) {
    const mine = staffOf(st, f);
    for (const q of mine) q.role = null;
    const pairs = [];
    for (const q of mine) for (const r of Object.keys(ROLES)) pairs.push({ q, r, v: abil(st, f, q, ROLES[r].key) });
    pairs.sort((a, b) => b.v - a.v);
    const usedQ = new Set(), usedR = new Set();
    for (const { q, r } of pairs) { if (usedQ.has(q.id) || usedR.has(r)) continue; q.role = r; usedQ.add(q.id); usedR.add(r); }
  }
  function staffUpkeep(st, f) { return staffOf(st, f).filter(p => p.role).reduce((s, p) => s + GRADE_PAY[gradeOf(p)], 0); }
  // 合併で、その市町村ゆかりの人材が加わる
  function staffOnMerge(st, names, c, f, prev) {
    const joined = [];
    for (const p of st.staff || []) {
      if (p.home !== c || p.ext) continue;
      if (staffOf(st, f).length >= staffMax(st, f)) break;
      if (p.f === -1 || (p.f === prev && prev >= 0 && !p.role && rnd(st) < 0.5)) { p.f = f; p.role = null; joined.push(p.name); }
    }
    return joined;
  }

  function upkeep(st, f) { return Math.round(owned(st, f).reduce((s, c) => s + 0.8 + st.m[c].pop * 0.012, 0) + staffUpkeep(st, f)); }
  function seasonX(code, month) {
    const s = SEASON[INFO[code][2]];
    return s && s.months.includes(month) ? s.x : 1;
  }
  function incomeOf(st, code, month) {
    const x = st.m[code];
    const base = x.pop * 0.05 * (0.6 + x.ind / 100);
    const tour = x.tour * 0.05 * seasonX(code, month);
    return base + tour;
  }
  // 地方交付税：人口の少ない市町村ほど多く交付される
  function grantOf(st, f) { return owned(st, f).reduce((s, c) => s + Math.max(0.3, 2.4 - st.m[c].pop * 0.02), 0); }
  function factionIncome(st, f, month) {
    let base = 0, tour = 0, pact = 0;
    for (const c in st.m) {
      const x = st.m[c];
      if (x.owner === f) { base += x.pop * 0.05 * (0.6 + x.ind / 100); tour += x.tour * 0.05 * seasonX(c, month); }
      else if (x.owner === -1 && x.pact.includes(f)) pact += incomeOf(st, c, month) * 0.15;
    }
    base *= 1 + roleVal(st, f, 'deputy') / 500;
    base += grantOf(st, f);
    tour *= 1 + roleVal(st, f, 'tourism') / 250;
    return Math.round(base + tour + pact);
  }

  const CMDS = {
    ind: { label: '産業振興', ap: 1, own: true, note: '産業力 +6' },
    tour: { label: '観光PR', ap: 1, own: true, note: '観光力 +7' },
    care: { label: '子育て支援', ap: 1, own: true, note: '満足度 +8' },
    dis: { label: '防災対策', ap: 1, own: true, note: '防災力 +8' },
    invite: { label: '企業誘致', ap: 2, own: true, note: '成功すると産業力 +12・人口増' },
    visit: { label: '交流事業', ap: 1, own: false, note: '関係度 +15' },
    pact: { label: '連携協定', ap: 1, own: false, note: '関係度50以上で締結' },
    talk: { label: '合併協議', ap: 2, own: false, note: '3か月後に住民投票' },
    counter: { label: '対抗提案', ap: 2, own: false, note: 'ほかの陣営の協議に割り込み、条件を競う' },
    raise: { label: '条件を上乗せ', ap: 1, own: false, note: '競り合いで選ばれやすくなる' },
    keep: { label: '引き留め', ap: 1, own: false, note: '住民投票の賛成 −5・満足度 +3' }
  };

  // 予算規模：お金を多く使うほど効果が大きい（ただし割高）
  const SCALES = [
    { label: '小規模', cost: 0.5, eff: 0.6 },
    { label: '標準', cost: 1, eff: 1 },
    { label: '大規模', cost: 2.5, eff: 1.8 },
    { label: '特大', cost: 5, eff: 2.8 }
  ];
  const SCALABLE = ['ind', 'tour', 'care', 'dis', 'visit'];
  function scaleOf(cmd, scale) { return SCALABLE.includes(cmd) ? SCALES[scale === undefined ? 1 : scale] : SCALES[1]; }
  function cmdEffect(st, f, cmd, scale) {
    const pb = Math.floor(roleVal(st, f, 'planning') / 25), nb = Math.floor(roleVal(st, f, 'nego') / 15);
    const base = { ind: 6 + pb, tour: 7 + pb, care: 8 + pb, dis: 8 + pb, visit: 15 + nb }[cmd];
    return base === undefined ? 0 : Math.round(base * scaleOf(cmd, scale).eff);
  }
  function cmdCost(st, cmd, code, scale) { return Math.round(cmdCostBase(st, cmd, code) * scaleOf(cmd, scale).cost); }
  function cmdCostBase(st, cmd, code) {
    const p = st.m[code].pop;
    switch (cmd) {
      case 'ind': case 'care': return Math.round(3 + p * 0.05);
      case 'tour': return Math.round(2 + p * 0.035);
      case 'dis': return Math.round(2 + p * 0.04);
      case 'invite': return Math.round(20 + p * 0.08);
      case 'visit': return 4;
      case 'pact': return 0;
      case 'talk': case 'counter': return Math.round(6 + p * 0.1);
      case 'raise': return Math.round(4 + p * 0.06);
      case 'keep': return Math.round(3 + p * 0.04);
    }
    return 0;
  }

  function adjacentTo(st, adj, code, f) { return adj[code].some(n => st.m[n].owner === f); }
  function inTalk(t, f) { return !!t && (t.f === f || t.rival === f); }
  function talksOf(st, f) { return Object.keys(st.m).filter(c => inTalk(st.m[c].talk, f)).length; }
  const BID_MAX = 5;
  const KEEP_MAX = 3, KEEP_STEP = 5, KEEP_AI = 0.5;

  function canDo(st, adj, f, cmd, code, apLeft, scale) {
    const r = canDoBase(st, adj, f, cmd, code, scale);
    if (!r.ok) return r;
    if (apLeft < CMDS[cmd].ap) return { ok: false, reason: `今月の行動力が足りません（${CMDS[cmd].ap}必要）` };
    if (st.factions[f].money < r.cost) return { ok: false, reason: `財源が足りません（${r.cost}億円必要）` };
    return r;
  }
  function canDoBase(st, adj, f, cmd, code, scale) {
    const x = st.m[code]; const def = CMDS[cmd];
    if (st.over) return { ok: false, reason: 'ゲームは終了しています' };
    const cost = cmdCost(st, cmd, code, scale);
    if (cmd === 'keep') {
      if (x.owner !== f) return { ok: false, reason: '自陣営の市町村だけで使えます' };
      if (!x.talk || inTalk(x.talk, f)) return { ok: false, reason: 'ほかの陣営から合併協議をかけられていません' };
      if ((x.talk.keep || 0) >= KEEP_MAX) return { ok: false, reason: `引き留めは${KEEP_MAX}段までです` };
      return { ok: true, cost };
    }
    if (def.own) {
      if (x.owner !== f) return { ok: false, reason: '自陣営の市町村だけで実行できます' };
      const key = { ind: 'ind', tour: 'tour', care: 'sat', dis: 'dis', invite: 'ind' }[cmd];
      if (x[key] >= 100) return { ok: false, reason: 'これ以上は上がりません' };
      return { ok: true, cost };
    }
    if (x.owner === f) return { ok: false, reason: '自陣営です' };
    if (!adjacentTo(st, adj, code, f)) return { ok: false, reason: '自陣営と隣り合っていません' };
    const rel = st.rel[f][code];
    const t = x.talk;
    if (cmd === 'visit') {
      if (rel >= 100) return { ok: false, reason: '関係度は最大です' };
      return { ok: true, cost };
    }
    if (cmd === 'pact') {
      if (x.owner !== -1) return { ok: false, reason: 'ほかの陣営の市町村とは協定を結べません' };
      if (x.pact.includes(f)) return { ok: false, reason: 'すでに協定を結んでいます' };
      if (rel < 50) return { ok: false, reason: `関係度が50に届いていません（現在${Math.round(rel)}）` };
      return { ok: true, cost };
    }
    if (cmd === 'raise') {
      if (!t || t.rival === undefined) return { ok: false, reason: '条件の競り合いが起きていません' };
      if (!inTalk(t, f)) return { ok: false, reason: 'この競り合いには参加していません' };
      if (t.bids[f] >= BID_MAX) return { ok: false, reason: `上乗せは${BID_MAX}段までです` };
      return { ok: true, cost };
    }
    if (cmd === 'talk' || cmd === 'counter') {
      if (cmd === 'talk' && t) return { ok: false, reason: inTalk(t, f) ? '合併協議の最中です' : 'ほかの陣営と協議中です。対抗提案で割り込めます' };
      if (cmd === 'counter') {
        if (!t) return { ok: false, reason: 'ほかの陣営の協議が進んでいません' };
        if (inTalk(t, f)) return { ok: false, reason: '自陣営の協議です' };
        if (t.rival !== undefined) return { ok: false, reason: 'すでに2陣営が競り合っています' };
      }
      if (x.cool[f] > 0) return { ok: false, reason: `否決のため、あと${x.cool[f]}か月は申し入れできません` };
      if (talksOf(st, f) >= st.talksMax) return { ok: false, reason: `同時に進められる協議は${st.talksMax}件までです` };
      if (x.owner === -1) {
        if (!x.pact.includes(f)) return { ok: false, reason: '先に連携協定を結ぶ必要があります' };
        if (rel < 70) return { ok: false, reason: `関係度が70に届いていません（現在${Math.round(rel)}）` };
      } else {
        if (st.factions[x.owner].capital === code && owned(st, x.owner).length > 3) return { ok: false, reason: '本拠地は、相手陣営の市町村が3つ以下になるまで切り崩せません' };
        const gap = avgSat(st, f) - x.sat;
        if (x.sat >= 45 && gap < 8) return { ok: false, reason: `切り崩すには、相手の満足度を45未満にするか、自陣営の平均満足度を相手より8以上高くします（現在 ${Math.round(x.sat)}、差 ${Math.round(gap)}）` };
        if (rel < 60) return { ok: false, reason: `関係度が60に届いていません（現在${Math.round(rel)}）` };
      }
      return { ok: true, cost };
    }
    return { ok: false, reason: '' };
  }

  function doCmd(st, names, f, cmd, code, scale) {
    const x = st.m[code]; const fac = st.factions[f];
    const cost = cmdCost(st, cmd, code, scale);
    fac.money -= cost;
    const e = cmdEffect(st, f, cmd, scale), sl = SCALABLE.includes(cmd) && scale !== undefined && scale !== 1 ? `・${SCALES[scale].label}` : '';
    const n = names[code]; const who = f === 0 ? '' : fac.name + 'が';
    const pb = Math.floor(roleVal(st, f, 'planning') / 25), nb = Math.floor(roleVal(st, f, 'nego') / 15);
    switch (cmd) {
      case 'ind': x.ind = clamp(x.ind + e, 0, 100); return `${who}${n}で産業振興（産業力 ${x.ind}${sl}）`;
      case 'tour': x.tour = clamp(x.tour + e, 0, 100); return `${who}${n}の観光PR（観光力 ${x.tour}${sl}）`;
      case 'care': x.sat = clamp(x.sat + e, 0, 100); return `${who}${n}で子育て支援（満足度 ${Math.round(x.sat)}${sl}）`;
      case 'dis': x.dis = clamp(x.dis + e, 0, 100); return `${who}${n}の防災対策（防災力 ${x.dis}${sl}）`;
      case 'invite':
        if (rnd(st) < 0.55 + x.ind / 400) { x.ind = clamp(x.ind + 12, 0, 100); x.pop += 1 + x.pop * 0.01; return `${who}${n}への企業誘致に成功（産業力 ${x.ind}）`; }
        return `${who}${n}への企業誘致は不調に終わりました`;
      case 'visit': st.rel[f][code] = clamp(st.rel[f][code] + e, 0, 100); return `${who}${n}と交流事業（関係度 ${Math.round(st.rel[f][code])}${sl}）`;
      case 'pact': x.pact.push(f); st.rel[f][code] = clamp(st.rel[f][code] + 5, 0, 100); return `${who}${n}と連携協定を締結`;
      case 'talk': x.talk = { f, left: 3 }; return `${who}${n}に合併協議を申し入れ`;
      case 'counter': {
        const t = x.talk; t.rival = f; t.bids = { [t.f]: 0, [f]: 0 }; t.left = Math.max(t.left, 2);
        const other = t.f === 0 ? 'あなたの陣営' : st.factions[t.f].name;
        return `${who}${n}に対抗提案（${other}と条件の競り合い）`;
      }
      case 'keep': {
        const t = x.talk; t.keep = (t.keep || 0) + 1; x.sat = clamp(x.sat + 3, 0, 100);
        return `${who}${n}で住民への引き留め（${t.keep}段目）`;
      }
      case 'raise': {
        const t = x.talk; t.bids[f]++;
        return `${who}${n}への条件を上乗せ（${t.bids[f]}段目）`;
      }
    }
    return '';
  }

  // AI 1陣営ぶんの行動
  function aiAct(st, adj, names, f) {
    let ap = apMax(st, f);
    const fac = st.factions[f];
    const out = [];
    const aiScale = () => fac.money > 600 ? 3 : fac.money > 220 ? 2 : 1;
    const tryDo = (cmd, code) => {
      let sc = SCALABLE.includes(cmd) ? aiScale() : undefined;
      let r = canDo(st, adj, f, cmd, code, ap, sc);
      while (!r.ok && sc > 1) { sc--; r = canDo(st, adj, f, cmd, code, ap, sc); }
      if (!r.ok) return false;
      ap -= CMDS[cmd].ap;
      const t0 = st.m[code].talk;
      const vsMe = ['counter', 'raise', 'keep'].includes(cmd) && !!t0 && (t0.f === 0 || t0.rival === 0);
      out.push({ text: doCmd(st, names, f, cmd, code, sc), code, cmd, f, vsMe });
      return true;
    };
    const apRef = { ap };
    for (const t of aiStaff(st, adj, names, f, apRef)) out.push(t);
    ap = apRef.ap;
    let guard = 12;
    while (ap > 0 && guard-- > 0) {
      if (rnd(st) < 0.25) { ap--; continue; } // ときどき様子見
      const near = Object.keys(st.m).filter(c => st.m[c].owner !== f && adjacentTo(st, adj, c, f));
      near.sort((a, b) => st.rel[f][b] - st.rel[f][a]);
      const border = near.filter(c => !st.m[c].talk);
      let done = false;
      if (fac.money > 0) {
        // 自分の市町村が狙われていれば引き留め
        for (const c of owned(st, f)) {
          const t = st.m[c].talk;
          if (t && !inTalk(t, f) && (t.keep || 0) < KEEP_MAX && fac.money > cmdCost(st, 'keep', c) * 2 && rnd(st) < KEEP_AI && tryDo('keep', c)) { done = true; break; }
        }
        if (done) continue;
        // 競り合いで負けていれば上乗せ
        for (const c of near) {
          const t = st.m[c].talk;
          if (t && t.rival !== undefined && inTalk(t, f)) {
            const other = t.f === f ? t.rival : t.f;
            if (t.bids[f] <= t.bids[other] && fac.money > cmdCost(st, 'raise', c) * 2 && rnd(st) < 0.75 && tryDo('raise', c)) { done = true; break; }
          }
        }
        if (!done) for (const c of near) { const t = st.m[c].talk; if (t && t.rival === undefined && t.f !== f && rnd(st) < 0.5 && tryDo('counter', c)) { done = true; break; } }
        if (!done) for (const c of border) { if (tryDo('talk', c)) { done = true; break; } }
        if (!done) for (const c of near) { if (st.m[c].owner === -1 && tryDo('pact', c)) { done = true; break; } }
        if (!done && fac.money > 12) {
          const t = near.find(c => st.m[c].owner === -1 && st.rel[f][c] < 95) || near.find(c => st.m[c].owner !== -1 && st.rel[f][c] < 80);
          if (t && tryDo('visit', t)) done = true;
        }
      }
      if (!done) {
        const mine = owned(st, f).sort((a, b) => st.m[a].sat - st.m[b].sat);
        const big = owned(st, f).sort((a, b) => st.m[b].pop - st.m[a].pop);
        if (mine.length && st.m[mine[0]].sat < 48 && tryDo('care', mine[0])) done = true;
        else if (fac.money > 60 && big.length && st.m[big[0]].sat < 66 && tryDo('care', big[0])) done = true;
        else if (fac.money > 80 && tryDo('invite', fac.capital)) done = true;
        else if (fac.money > 30 && tryDo('ind', fac.capital)) done = true;
      }
      if (!done) break;
    }
    return out;
  }

  function offerScore(st, f, code, bid) {
    return st.rel[f][code] + (avgSat(st, f) - st.m[code].sat) * 0.5 + bid * 8 + rnd(st) * 6;
  }
  function voteFor(st, f, code, bonus) {
    const x = st.m[code]; const rel = st.rel[f][code];
    let yes = 50 + (avgSat(st, f) - x.sat) * 0.4 + (rel - 70) * 0.6 + (rnd(st) * 20 - 10) + (bonus || 0) + roleVal(st, f, 'nego') / 12;
    if (x.pop > totalPop(st, f) * 0.7) yes -= 15;
    if (x.owner !== -1) yes -= 8;
    yes = clamp(yes, 4, 96);
    const turnout = 0.42 + rnd(st) * 0.25;
    const voters = Math.round(x.pop * 1000 * 0.82);
    const cast = Math.round(voters * turnout);
    const y = Math.round(cast * yes / 100);
    return { yes: y, no: cast - y, turnout, pass: y > cast - y };
  }

  // 月を終える
  function endTurn(st, adj, names) {
    const res = { votes: [], news: [], steps: [] };
    if (st.over) return res;
    ensureStaff(st);
    // ライバルの行動
    for (const fac of st.factions) {
      if (!fac.ai || !fac.alive) continue;
      for (const t of aiAct(st, adj, names, fac.id)) {
        addLog(st, t.text, 'rival');
        res.steps.push({ kind: 'rival', ...t, mine: st.m[t.code].owner === 0 });
      }
    }
    // 協議の進行と住民投票
    for (const c in st.m) {
      const x = st.m[c];
      if (!x.talk) continue;
      const t = x.talk;
      for (const k of [t.f, t.rival]) if (k !== undefined) st.rel[k][c] = clamp(st.rel[k][c] + 2, 0, 100);
      t.left--;
      if (t.left > 0) continue;
      let f = t.f, contest = null;
      if (t.rival !== undefined) {
        const a = t.f, b = t.rival;
        const sa = offerScore(st, a, c, t.bids[a]), sb = offerScore(st, b, c, t.bids[b]);
        const win = sa >= sb ? a : b, lose = win === a ? b : a;
        contest = { winner: win, loser: lose, bids: { [a]: t.bids[a], [b]: t.bids[b] } };
        f = win;
        st.rel[lose][c] = clamp(st.rel[lose][c] - 10, 0, 100); x.cool[lose] = 2;
        const nm = k => k === 0 ? 'あなたの陣営' : st.factions[k].name;
        addLog(st, `${names[c]}をめぐる条件の競り合いは${nm(win)}に決定（上乗せ ${t.bids[win]}段 対 ${t.bids[lose]}段）`, win === 0 ? 'good' : (lose === 0 ? 'bad' : 'rival'));
        res.steps.push({ kind: 'contest', code: c, ...contest, f: win });
      }
      const keep = x.owner >= 0 && x.owner !== f ? (t.keep || 0) : 0;
      const v = voteFor(st, f, c, (contest ? contest.bids[f] * 3 : 0) - keep * KEEP_STEP);
      if (contest) v.contest = contest;
      if (keep) v.keep = keep;
      const prev = x.owner;
      x.talk = null;
      const fac = st.factions[f];
      if (v.pass) {
        x.owner = f; x.pact = []; x.sat = clamp(x.sat - 8, 0, 100);
        for (const k of owned(st, f)) if (k !== c) st.m[k].sat = clamp(st.m[k].sat - 1, 0, 100);
        st.rel[f][c] = 60;
        const joined = staffOnMerge(st, names, c, f, prev);
        if (joined.length) { v.joined = joined; addLog(st, `${names[c]}ゆかりの${joined.join('・')}が${f === 0 ? 'あなたの陣営' : fac.name}に加わりました`, f === 0 ? 'good' : 'rival'); }
        addLog(st, `住民投票で${names[c]}が${f === 0 ? 'あなたの陣営' : fac.name}への編入を可決`, f === 0 ? 'good' : (prev === 0 ? 'bad' : 'rival'));
        if (prev > 0 && st.factions[prev].capital === c && owned(st, prev).length > 0) {
          const nc = owned(st, prev).sort((a, b) => st.m[b].pop - st.m[a].pop)[0];
          st.factions[prev].capital = nc;
          addLog(st, `${st.factions[prev].name}は本拠地を${names[nc]}に移しました`, 'rival');
        }
        if (prev >= 0 && owned(st, prev).length === 0) {
          st.factions[prev].alive = false;
          addLog(st, `${st.factions[prev].name}はすべての市町村を失いました`, 'info');
        }
      } else {
        x.cool[f] = 2; st.rel[f][c] = clamp(st.rel[f][c] - 20, 0, 100);
        addLog(st, `${names[c]}の住民投票は否決（${f === 0 ? 'あなたの陣営' : fac.name}との合併）`, f === 0 ? 'bad' : 'rival');
      }
      if (f === 0 || prev === 0 || (contest && contest.loser === 0)) res.votes.push({ code: c, f, prev, ...v });
      res.steps.push({ kind: 'vote', code: c, f, prev, ...v });
    }
    // 月を進める
    st.turn++;
    const d = dateOf(st.turn);
    // 季節・ランダムのイベント
    events(st, names, d.month, res);
    // 収入と住民の変化
    for (const fac of st.factions) {
      if (!fac.alive) continue;
      const inc = factionIncome(st, fac.id, d.month) - upkeep(st, fac.id);
      fac.money += inc;
      if (fac.id === 0) res.income = inc;
      fac.negMonths = fac.money < 0 ? fac.negMonths + 1 : 0;
    }
    for (const c in st.m) {
      const x = st.m[c];
      const target = x.owner === -1 ? 54 : 50;
      x.sat += (target - x.sat) * 0.04;
      if (x.owner >= 0 && st.factions[x.owner].money < 0) x.sat -= 3;
      x.sat = clamp(x.sat, 0, 100);
      x.pop = Math.max(0.3, x.pop * (1 + (x.sat - 55) * 0.00004));
      for (const k in x.cool) if (x.cool[k] > 0) x.cool[k]--;
      for (let f = 0; f < st.factions.length; f++) {
        if (x.owner === f) continue;
        if (x.pact.includes(f)) st.rel[f][c] = clamp(st.rel[f][c] + 3, 0, 100);
        else if (st.rel[f][c] > 35) st.rel[f][c] -= 0.5;
      }
    }
    // 勝敗
    const me = st.factions[0];
    const mine = owned(st, 0);
    if (st.m[me.capital].owner !== 0) st.over = { win: false, text: `本拠地の${names[me.capital]}がほかの陣営に編入されました。` };
    else if (me.negMonths >= 3) st.over = { win: false, text: '財源のマイナスが3か月続き、財政破綻となりました。' };
    else if (avgSat(st, 0) < 20) st.over = { win: false, text: '住民満足度が20を下回り、リコールが成立しました。' };
    else if (mine.length === Object.keys(st.m).length) st.over = { win: true, text: `${d.label}、岐阜県42市町村の統一を達成しました。` };
    // 圏域制覇の知らせ
    st.regionsDone = st.regionsDone || [];
    for (const r of REGIONS) {
      if (st.regionsDone.includes(r)) continue;
      const cs = Object.keys(st.m).filter(c => INFO[c][0] === r);
      if (cs.every(c => st.m[c].owner === 0)) { st.regionsDone.push(r); addLog(st, `${r}圏域をすべて自陣営にしました`, 'good'); res.news.push(`${r}圏域を制覇`); }
    }
    st.ap = apMax(st, 0);
    return res;
  }

  function events(st, names, month, res) {
    const codes = Object.keys(st.m);
    const ownerName = c => st.m[c].owner === 0 ? '（自陣営）' : '';
    // 季節の行事（観光収入は収入計算で反映）
    const fest = { 4: '高山祭（春）でにぎわっています', 10: '高山祭（秋）でにぎわっています' };
    if (fest[month]) addLog(st, `高山市は${fest[month]}`, 'season');
    if (month === 5) addLog(st, '長良川鵜飼が開幕。岐阜市・関市の観光収入が伸びます', 'season');
    if (month === 8) { st.m['21219'].sat = clamp(st.m['21219'].sat + 5, 0, 100); addLog(st, '郡上おどりが最高潮。郡上市の満足度が上がりました', 'season'); }
    // 豪雨（6〜9月）
    if ([6, 7, 8, 9].includes(month) && rnd(st) < 0.3) {
      const south = codes.filter(c => INFO[c][0] !== '飛騨');
      const c = south[Math.floor(rnd(st) * south.length)];
      disaster(st, names, c, '豪雨', ownerName, res);
    }
    // 豪雪（12〜2月）
    if ([12, 1, 2].includes(month) && rnd(st) < 0.4) {
      const north = codes.filter(c => INFO[c][0] === '飛騨' || c === '21219');
      const c = north[Math.floor(rnd(st) * north.length)];
      disaster(st, names, c, '豪雪', ownerName, res);
    }
    // 企業進出
    if (rnd(st) < 0.12) {
      const cand = codes.filter(c => st.m[c].ind >= 55);
      if (cand.length) {
        const c = cand[Math.floor(rnd(st) * cand.length)];
        st.m[c].ind = clamp(st.m[c].ind + 6, 0, 100); st.m[c].pop += 0.5;
        addLog(st, `${names[c]}${ownerName(c)}に企業が進出。産業力が上がりました`, st.m[c].owner === 0 ? 'good' : 'info');
        res.steps.push({ kind: 'event', code: c, text: `${names[c]}に企業が進出`, tone: 'good' });
      }
    }
  }

  function disaster(st, names, c, kind, ownerName, res) {
    const x = st.m[c];
    const hit = rnd(st) * 100 > x.dis;
    if (hit) {
      x.sat = clamp(x.sat - 9, 0, 100);
      if (x.owner >= 0) st.factions[x.owner].money -= Math.round(3 + x.pop * 0.03);
      addLog(st, `${kind}で${names[c]}${ownerName(c)}に被害。満足度と財源が下がりました`, x.owner === 0 ? 'bad' : 'info');
      res.steps.push({ kind: 'event', code: c, text: `${kind}で${names[c]}に被害`, tone: 'bad' });
      if (x.owner === 0) res.news.push(`${names[c]}で${kind}の被害`);
    } else {
      x.sat = clamp(x.sat + 2, 0, 100);
      addLog(st, `${kind}が${names[c]}${ownerName(c)}を襲いましたが、備えで被害を防ぎました`, x.owner === 0 ? 'good' : 'info');
      res.steps.push({ kind: 'event', code: c, text: `${kind}が${names[c]}を襲うも被害なし`, tone: 'good' });
    }
  }

  const api = { INFO, REGIONS, CMDS, dateOf, difficultyOf, newGame, owned, apMax, totalPop, avgSat, incomeOf,
    factionIncome, grantOf, tagInfo, upkeep, cmdCost, cmdEffect, SCALES, SCALABLE, gradeOf, GRADE_PAY, SCOUT, canScout, scout, ROLES, ABIL, ensureStaff, staffOf, staffMax, abil, roleVal, hireCandidates, hireCost, canHire, hire, assignRole, autoAssign, staffUpkeep, aiStaff, inTalk, BID_MAX, KEEP_MAX, KEEP_STEP, canDo, doCmd, endTurn, adjacentTo, talksOf, seasonX, clamp };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.GameLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
