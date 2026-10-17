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
    '21502': ['中濃', 6, ''], '21503': ['中濃', 10, ''], '21504': ['中濃', 3, ''],
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
    if (tag === '古戦場') parts.push('毎年9月、この町を持つ陣営に関ケ原ゆかりの偉人が助言に来る');
    return parts.join('。');
  }
  const RIVAL_CANDIDATES = ['21201', '21202', '21204', '21203', '21214', '21205', '21206'];
  // 主要都市だけでは離して置けないときに使う、次に大きな市
  const RIVAL_EXTRA = ['21213', '21209', '21212', '21211', '21210', '21219', '21220', '21208', '21217'];
  // ライバルの本拠地は、プレイヤーからこの数だけ離す（3 なら、あいだに市町村を2つ挟む）。置けないときだけ2まで縮める
  const RIVAL_GAP = 3;
  // ライバル同士は、あいだに市町村をこの数−1だけ挟めるまで離す。そこまで離せたら、あとは大きな都市を選ぶ
  const RIVAL_SPREAD = 4;
  const FACTION_COLORS = ['me', 'r1', 'r2', 'r3'];
  // 災害：季節ごとに1か月前に予報が出て、翌月に圏域を襲う。襲われた市町村ごとに、防災力の％で被害を防ぐ
  // HIT：圏域の市町村それぞれが襲われる確率。SAT：被害の満足度。SAVE：防いだときの満足度。被害を受けた市町村には、隣の陣営が AID_MONTHS か月のあいだ災害支援できる
  const DISASTERS = { 豪雨: { months: [6, 7, 8, 9], p: 0.45 }, 豪雪: { months: [12, 1, 2], p: 0.5 } };
  const DIS_HIT = 0.4, DIS_SAT = 8, DIS_SAVE = 3, AID_REL = 18, AID_SAT = 5, AID_MONTHS = 2;
  // 満足度が低い市町村：FLOW 未満で人口が流れ出し（月 0.4〜1％）、INDEP 未満で独立の動きが起きる。
  // 独立の動きは、INDEP_MONTHS か月のうちに満足度を CALM 以上に戻せば収まり、戻せなければ住民投票。本拠地では起きない
  const FLOW_SAT = 40, INDEP_SAT = 30, CALM_SAT = 50, INDEP_MONTHS = 3, INDEP_REST = 6;
  function outflow(x) { return x.sat < FLOW_SAT ? Math.min(0.01, 0.004 + (FLOW_SAT - x.sat) * 0.0002) : 0; }

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

  // 難易度：tools/balance.js のボットで測った勝率（圏域制覇と県内統一の平均）で分ける。
  // 65％未満は超むずかしい、98％未満はむずかしい、99％以上で県内統一が60か月以内ならやさしい、ほかはふつう。
  // バランスを変えたら `node tools/balance.js 60 --labels` で測り直して貼り替える
  const DIFFICULTY = {
    やさしい: ['21201', '21202', '21213', '21219'],
    ふつう: ['21203', '21204', '21205', '21206', '21207', '21208', '21209', '21211', '21212', '21216', '21217', '21218', '21220', '21221', '21303', '21341', '21361', '21362', '21382', '21401', '21404', '21421', '21604'],
    むずかしい: ['21210', '21214', '21215', '21302', '21381', '21383', '21403', '21501', '21503', '21505', '21506', '21521'],
    超むずかしい: ['21502', '21504', '21507']
  };
  const DIFF_OF = {};
  for (const lv in DIFFICULTY) for (const c of DIFFICULTY[lv]) DIFF_OF[c] = lv;
  function difficultyOf(code) { return DIFF_OF[code] || 'ふつう'; }

  // 遊び方：県内統一（42市町村）か、圏域制覇（スタート地点の圏域だけ）
  const MODES = {
    unify: { label: '県内統一', note: '県内42市町村をすべて自陣営にすると勝ち。1〜3時間（やさしい町は約1時間）' },
    region: { label: '圏域制覇', note: 'スタート地点の圏域をすべて自陣営にすると勝ち。飛騨・東濃は短め、中濃は長め' }
  };
  // 圏域制覇の長さの目安（市町村の数で決まる）
  function regionLength(r) { const n = regionCodes(r).length; return n <= 5 ? '短め' : n <= 11 ? 'ふつう' : '長め'; }
  function regionCodes(r) { return Object.keys(INFO).filter(c => INFO[c][0] === r); }
  // 予報の災害が襲う範囲。豪雨は圏域、豪雪は飛騨圏域と郡上市
  function disArea(fc) { return fc.kind === '豪雪' ? Object.keys(INFO).filter(c => INFO[c][0] === '飛騨' || c === '21219') : regionCodes(fc.region); }
  function disLabel(fc) { return fc.kind === '豪雪' ? '飛騨圏域と郡上市' : `${fc.region}圏域`; }
  // 災害支援できるのは、被害から AID_MONTHS か月のあいだ
  function aidable(st, c) { const x = st.m[c]; return x.hurt !== undefined && st.turn - x.hurt < AID_MONTHS; }
  // いまの目標：対象の市町村と、その名前
  function goalOf(st) {
    if (st.mode === 'region') { const codes = regionCodes(st.goal); return { codes, label: `${st.goal}圏域`, region: st.goal }; }
    return { codes: Object.keys(st.m), label: '県内', region: null };
  }

  function newGame(map, startCode, seed, mode) {
    const names = {}; const adj = {};
    for (const m of map.muni) { names[m.code] = m.name; adj[m.code] = m.adj; }
    const st = { ver: 1, seed: seed | 0, turn: 0, player: 0, over: null, log: [], talksMax: 2 };
    st.mode = mode === 'region' ? 'region' : 'unify';
    if (st.mode === 'region') st.goal = INFO[startCode][0];
    // ライバルは主要都市から3つ。プレイヤーから RIVAL_GAP 以上離し、ライバル同士も隣り合わせない
    const hopFrom = s => { const h = { [s]: 0 }, q = [s]; while (q.length) { const c = q.shift(); for (const n of adj[c]) if (h[n] === undefined) { h[n] = h[c] + 1; q.push(n); } } return h; };
    const hop = hopFrom(startCode), hops = {};
    const rivals = [];
    const free = (c, gap) => hop[c] >= gap && !rivals.includes(c) && !rivals.some(r => adj[r].includes(c));
    let cands = RIVAL_CANDIDATES, extra = RIVAL_EXTRA;
    if (st.mode === 'region') {
      // 圏域制覇では、目標の圏域の中には置かず、圏域の外で接するいちばん大きな市町村に1陣営を置いて境目で取り合う。
      // 離して置けないときは、あいだに1つ挟む市町村のうち、人口がこちらの2倍までのいちばん大きなところ（なければいちばん小さなところ）
      const goal = regionCodes(st.goal);
      const border = [...new Set(goal.flatMap(c => adj[c]))].filter(c => !goal.includes(c)).sort((a, b) => INFO[b][1] - INFO[a][1]);
      const close = border.filter(c => free(c, 2));
      const b = border.find(c => free(c, RIVAL_GAP)) || close.find(c => INFO[c][1] <= INFO[startCode][1] * 2) || close[close.length - 1];
      if (b) rivals.push(b);
      cands = cands.filter(c => INFO[c][0] !== st.goal);
      extra = extra.filter(c => INFO[c][0] !== st.goal);
    }
    // 1つは、ちょうど RIVAL_GAP の距離の都市に置く（遠い相手ばかりだと張り合いがない）
    const first = [...cands, ...extra].find(c => hop[c] === RIVAL_GAP && free(c, RIVAL_GAP));
    if (first && rivals.length < 3 && !rivals.some(r => hop[r] === RIVAL_GAP)) rivals.push(first);
    // 残りは、ほかのライバルからいちばん離れた都市（同じなら主要都市の順）。固まって置かれないように。
    // 離れた主要都市があれば、こちらの隣の隣（あいだに1つ）でも1陣営までは置く（そのぶん1つ離れた扱いにする）
    const spread = c => Math.min(RIVAL_SPREAD, ...rivals.map(r => (hops[r] || (hops[r] = hopFrom(r)))[c])) - (hop[c] < RIVAL_GAP ? 1 : 0);
    const near = () => rivals.some(r => hop[r] < RIVAL_GAP);
    while (rivals.length < 3) {
      let best = null, bs = -Infinity;
      for (const c of [...cands, ...extra]) {
        if (!free(c, cands.includes(c) && !near() ? 2 : RIVAL_GAP)) continue;
        const v = spread(c); if (v > bs) { bs = v; best = c; }
      }
      if (!best) best = cands.find(c => free(c, 2));
      if (!best) break;
      rivals.push(best);
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
    ensureAdv(st);
    ensureElect(st);
    st.ap = apMax(st, 0);
    st.aiAp = st.factions.map(f => apMax(st, f.id));
    const goal = st.mode === 'region' ? `${st.goal}圏域${regionCodes(st.goal).length}市町村の制覇` : '県内42市町村の統一';
    addLog(st, `${dateOf(0).label}、${names[startCode]}の首長に就任。目標は${goal}。`, 'info');
    return st;
  }

  function addLog(st, text, kind) { st.log.push({ t: st.turn, text, kind: kind || 'info' }); if (st.log.length > 300) st.log.shift(); }

  function owned(st, f) { return Object.keys(st.m).filter(c => st.m[c].owner === f); }
  // 行動力は市町村が増えるほど増えるが、AP_CAP まで（後半にタップが増えすぎないように。内政は圏域の方針に任せられる）
  const AP_CAP = 8;
  function apMax(st, f) { return Math.min(AP_CAP, 3 + Math.floor((owned(st, f).length - 1) / 4)) + advBonus(st, f, 'ap'); }
  function totalPop(st, f) { return owned(st, f).reduce((s, c) => s + st.m[c].pop, 0); }
  function avgSat(st, f) {
    const cs = owned(st, f); const p = totalPop(st, f) || 1;
    return cs.reduce((s, c) => s + st.m[c].sat * st.m[c].pop, 0) / p;
  }
  // 魅力：産業力と観光力の平均。陣営の魅力は人口で重みをつけた平均
  function appealOf(st, c) { return (st.m[c].ind + st.m[c].tour) / 2; }
  function appeal(st, f) {
    const cs = owned(st, f); const p = totalPop(st, f) || 1;
    return cs.reduce((s, c) => s + appealOf(st, c) * st.m[c].pop, 0) / p;
  }
  // 相手より魅力が10以上高いと隣り合う市町村との関係度が毎月自然に上がる。住民投票は相手より魅力が高いほど賛成が増える
  const APPEAL_GAP = 10, APPEAL_REL = 0.1, APPEAL_REL_MAX = 3, APPEAL_VOTE = 0.2, APPEAL_VOTE_MIN = -5, APPEAL_VOTE_MAX = 8;
  function appealRel(st, f, c) { return clamp((appeal(st, f) - appealOf(st, c) - APPEAL_GAP) * APPEAL_REL, 0, APPEAL_REL_MAX); }
  function appealVote(st, f, c) { return clamp((appeal(st, f) - appealOf(st, c)) * APPEAL_VOTE, APPEAL_VOTE_MIN, APPEAL_VOTE_MAX); }
  // 陣営の魅力が高いと、同時に進められる合併協議が増える
  const APPEAL_TALKS = [50, 60];
  function talksMax(st, f) { const a = appeal(st, f); return st.talksMax + APPEAL_TALKS.filter(v => a >= v).length; }
  // 何もしないと産業力・観光力は少しずつ下がる（特産の分は残る）
  const DECAY = 0.01;
  function floorInd(c) { return 25 + (IND_TAG[INFO[c][2]] || 0); }
  function floorTour(c) { return 10 + (TOUR_TAG[INFO[c][2]] || 0) * 0.8; }


  // ---------- 人材 ----------
  // 市町村ゆかりの人材（人口5万人以上の市は2人）
  const LOCAL_NAMES = {
    '21201': ['金華 城子', '鵜飼 長良'], '21209': ['羽島 ひかり', '竹鼻 藤乃'], '21213': ['空野 翔', '境川 桜'],
    '21215': ['伊自良 柿乃'], '21216': ['富有 実', '美江 宿'], '21218': ['根尾 淡墨'],
    '21302': ['根木 葱太'], '21303': ['小栗 駿'], '21421': ['安藤 守'],
    '21202': ['水野 枡美', '清水 湧'], '21221': ['平田 靱乃'], '21341': ['滝口 孝'],
    '21361': ['南宮 垂水'], '21362': ['不破 関太'], '21381': ['日吉 ばら奈'],
    '21382': ['輪中 堤'], '21383': ['結城 縁'], '21401': ['谷汲 巡'],
    '21403': ['柿野 薔子'], '21404': ['池田 霞'],
    '21205': ['兼元 研', '根道 萌音'], '21207': ['卯建 紙子'], '21211': ['坪内 逍', '蜂屋 柿之介'],
    '21214': ['兼山 湊', '森 蘭'], '21219': ['八幡 踊'], '21501': ['坂口 祝'],
    '21502': ['半布 里子'], '21503': ['舟木 漕'], '21504': ['上麻生 礫'],
    '21505': ['丸山 湖'], '21506': ['檜山 茶々'], '21507': ['槌乃 小太郎'],
    '21521': ['中山 道子'],
    '21204': ['暑井 夏樹', '笠原 彩'], '21206': ['馬籠 坂子', '栗山 きん'], '21208': ['土岐 源'],
    '21210': ['岩村 艶'], '21212': ['下石 徳利', '窯元 志野'],
    '21203': ['飛騨 匠', '宮川 朝子'], '21217': ['古川 起'], '21220': ['湯之島 泉'],
    '21604': ['荻町 結']
  };
  // 偉人アドバイザーと紛らわしかった古い名前 → 今の名前
  const RENAMED = { '織田 信': '金華 城子', '竹中 半太': '南宮 垂水', '明智 光': '兼山 湊', '石田 光成': '不破 関太', '金森 宗': '宮川 朝子', '松尾 芭奈': '水野 枡美', '島崎 夜明': '馬籠 坂子', '杉原 千歩': '丸山 湖', '織部 翠': '下石 徳利' };
  // 県外から招へいする人材：出身県の名物にちなむ。3つめは顔の画像名（docs/images.md）
  const OUTSIDERS = [
    ['北海道', '十勝 牧', 'hokkaido'], ['青森県', '津軽 林檎', 'aomori'], ['宮城県', '伊達 政子', 'miyagi'], ['秋田県', '比内 小町', 'akita'],
    ['山形県', '佐藤 錦', 'yamagata'], ['茨城県', '水戸 納', 'ibaraki'], ['栃木県', '宇都宮 餃太', 'tochigi'], ['群馬県', '上州 空風', 'gunma'],
    ['東京都', '江戸川 粋', 'tokyo'], ['新潟県', '越後 米蔵', 'niigata'], ['富山県', '黒部 鱒子', 'toyama'], ['石川県', '金沢 箔子', 'ishikawa'],
    ['福井県', '鯖江 鏡子', 'fukui'], ['長野県', '信濃 蕎麦子', 'nagano'], ['静岡県', '駿河 富士子', 'shizuoka'], ['愛知県', '味噌川 赤音', 'aichi'],
    ['三重県', '鈴鹿 走', 'mie'], ['滋賀県', '琵琶 湖太郎', 'shiga'], ['京都府', '祇園 雅', 'kyoto'], ['大阪府', '浪速 商人', 'osaka'],
    ['兵庫県', '明石 焼太', 'hyogo'], ['奈良県', '春日 鹿之助', 'nara'], ['広島県', '宮島 紅葉', 'hiroshima'], ['香川県', '讃岐 麺太', 'kagawa'],
    ['愛媛県', '伊予 柑太', 'ehime'], ['高知県', '坂本 竜真', 'kochi'], ['福岡県', '博多 明太', 'fukuoka'], ['熊本県', '肥後 熊太', 'kumamoto'],
    ['鹿児島県', '西郷 隆子', 'kagoshima'], ['沖縄県', '琉球 美海', 'okinawa']
  ];
  // まだ陣営にいない県外人材から選ぶ（全員いれば重複を許す）
  function pickOutsider(st, r) {
    const used = new Set((st.staff || []).filter(p => p.ext).map(p => p.name));
    const free = OUTSIDERS.filter(o => !used.has(o[1]));
    const pool = free.length ? free : OUTSIDERS;
    return pool[Math.floor(r * pool.length)];
  }
  // 人材の顔の画像名（docs/images.md）。ゆかりの人材は「市町村コード-番号」、県外の人材は「ext-都道府県」
  function faceOf(p) {
    if (p.ext) { const o = OUTSIDERS.find(o => o[1] === p.name); return o ? 'ext-' + o[2] : null; }
    const i = (LOCAL_NAMES[p.home] || []).indexOf(p.name);
    return i < 0 ? null : `${p.home}-${i}`;
  }
  const ROLES = {
    deputy: { label: '副市長', key: 'pol', what: '全体の税収が上がる' },
    planning: { label: '企画課長', key: 'plan', what: '内政コマンドの効果が上がる' },
    nego: { label: '交渉担当', key: 'neg', what: '交流事業と住民投票の賛成が上がる' },
    tourism: { label: '観光大使', key: 'pop', what: '観光収入が上がる' }
  };
  const ABIL = { pol: '政策', neg: '交渉', plan: '企画', pop: '人望' };
  function ensureStaff(st) {
    if (st.staff) {
      // 古い版の名前を、ゆかりの名前に付け替える
      if (!st.namesV) {
        const k = {};
        for (const p of st.staff) {
          if (p.ext) { const o = OUTSIDERS[hash('ext' + p.id) % OUTSIDERS.length]; p.pref = o[0]; p.name = o[1]; continue; }
          const i = k[p.home] = (k[p.home] || 0); k[p.home]++;
          const list = LOCAL_NAMES[p.home];
          if (list && list[i]) p.name = list[i];
        }
        st.namesV = 1;
      }
      // 偉人アドバイザーと紛らわしい名前を付け替える
      if (st.namesV < 2) {
        for (const p of st.staff) if (RENAMED[p.name]) p.name = RENAMED[p.name];
        st.namesV = 2;
      }
      return;
    }
    st.namesV = 2;
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
        st.staff.push({ id: id++, name: LOCAL_NAMES[c][k], home: c, f: -1, role: null, ...ab });
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
    if (staffOf(st, f).length >= staffMax(st, f)) return { ok: false, reason: `人材は${staffMax(st, f)}人までです（解雇すると枠が空きます）` };
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
    const [pref, name] = pickOutsider(st, rnd(st));
    const p = { id, name, pref, home: st.factions[f].capital, ext: true, f, role: null, ...ab };
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
    if (staffOf(st, f).length >= staffMax(st, f)) return { ok: false, reason: `人材は${staffMax(st, f)}人までです（市町村が増えると増えます。解雇すると枠が空きます）` };
    if (apLeft < 1) return { ok: false, reason: '今月の行動力が足りません（1必要）' };
    if (st.factions[f].money < hireCost(p)) return { ok: false, reason: `財源が足りません（${hireCost(p)}億円必要）` };
    return { ok: true, cost: hireCost(p) };
  }
  function hire(st, names, f, id) {
    const p = st.staff.find(q => q.id === id);
    st.factions[f].money -= hireCost(p); p.f = f; p.role = null;
    return `${names[p.home]}出身の${p.name}を登用`;
  }
  // 解雇：地元出身の人は独立の人材として地元に戻り（あとで登用し直せる）、県外から招へいした人は県外へ帰って戻らない
  function dismiss(st, names, f, id) {
    const p = st.staff.find(q => q.id === id && q.f === f);
    if (!p) return '';
    p.role = null;
    if (p.ext) { p.f = -2; return `${p.name}を解雇しました（${p.pref || '県外'}へ帰りました）`; }
    p.f = -1;
    return `${p.name}を解雇しました（地元の${names[p.home]}に戻りました）`;
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
      if (g && canScout(st, f, g, apRef.ap).ok) { apRef.ap--; const p = scout(st, f, g); out.push({ text: `${fac.name}が${p.pref}から${g}ランクの${p.name}を招へい`, code: fac.capital, cmd: 'hire', f }); }
    }
    // ゆかりの地があり、財源に余裕があれば偉人を招く
    if (apRef.ap > 0 && rnd(st) < 0.25) {
      const a = ADVISORS.find(a => fac.money > (a.cost || 0) * 3 && canInviteAdv(st, f, a.id, apRef.ap).ok);
      if (a) { apRef.ap--; out.push({ text: `${fac.name}が${inviteAdv(st, f, a.id)}`, code: a.home, cmd: 'adv', f }); }
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

  // ---------- 偉人アドバイザー ----------
  // 岐阜ゆかりの歴史人物。ゆかりの地を自陣営に持つと招けて、期間限定で助言し効果をくれる
  const ADV_MONTHS = 6, ADV_COOL = 12, ADV_SEKI = '21362', ADV_SLOT2 = 8;
  const ADV_FX = {
    tax: v => `税収 +${v}％`,
    tourInc: v => `観光収入 +${v}％`,
    cash: v => `毎月 財源 +${v}億円`,
    cost: v => `コマンドの費用 −${v}％`,
    ap: v => `行動力 +${v}`,
    plan: v => `内政コマンドの効果 +${v}`,
    ind: v => `産業振興の効果 +${v}`,
    tour: v => `観光PRの効果 +${v}`,
    care: v => `子育て支援の効果 +${v}`,
    visit: v => `交流事業の効果 +${v}`,
    vote: v => `住民投票の賛成 +${v}`,
    steal: v => `ほかの陣営の市町村での住民投票の賛成 +${v}`,
    sat: v => `自陣営の満足度が毎月 +${v}`,
    rel: v => `隣り合う市町村との関係度が毎月 +${v}`
  };
  // cond: [何を数えるか, 必要な値, 説明]。ゆかりの地を持ち、この条件を一度満たすと招ける
  // seki: 関ケ原の偉人。招くことはできず、毎年9月に関ケ原町を持つ陣営に訪れる
  const ADVISORS = [
    { id: 'dosan', name: '斎藤道三', home: '21215', title: '美濃の蝮', fx: 'steal', v: 10, cost: 30, cond: ['steal', 1, 'ほかの陣営の市町村を1つ切り崩す'], say: '国は待っていても手に入らぬ。隙を見せた町から切り取れ' },
    { id: 'nobunaga', name: '織田信長', home: '21201', title: '楽市楽座', fx: 'tax', v: 15, cost: 35, cond: ['towns', 8, '市町村を8つにする'], say: '古い決まりはいらぬ。市を開けば銭はおのずと集まる' },
    { id: 'hanbei', name: '竹中半兵衛', home: '21361', title: '今孔明', fx: 'vote', v: 8, cost: 20, cond: ['merge', 1, '住民投票で合併を1回可決させる'], say: '戦わずに勝つには、先に住民の心を得ることです' },
    { id: 'mitsuhide', name: '明智光秀', home: '21214', title: '文武の才', fx: 'plan', v: 3, cost: 25, cond: ['roles', 4, '4つの役職をすべて埋める'], say: '政も戦も、段取りが八割にございます' },
    { id: 'nagachika', name: '金森長近', home: '21203', title: '高山の町割り', fx: 'tourInc', v: 25, cost: 25, cond: ['maxTour', 70, '観光力70の市町村を持つ'], say: '町並みを整えれば、人は遠くからでも訪ねてくる' },
    { id: 'basho', name: '松尾芭蕉', home: '21202', title: 'むすびの地', fx: 'tour', v: 5, cost: 20, cond: ['tour60', 2, '観光力60以上の市町村を2つ持つ'], say: '旅人の心に残る景色を、ひとつ磨きなされ' },
    { id: 'oribe', name: '古田織部', home: '21218', title: '織部好み', fx: 'ind', v: 4, cost: 20, cond: ['maxInd', 70, '産業力70の市町村を持つ'], say: 'ゆがみもまた味わい。ものづくりに遊び心を' },
    { id: 'toson', name: '島崎藤村', home: '21206', title: '夜明け前', fx: 'care', v: 5, cost: 20, cond: ['sat', 65, '平均満足度を65にする'], say: '子らが学べる町にこそ、夜明けは来る' },
    { id: 'enku', name: '円空', home: '21209', title: '旅の仏師', fx: 'sat', v: 1, cost: 20, cond: ['towns', 5, '市町村を5つにする'], say: '一刀ごとに、人の心を彫るのです' },
    { id: 'chiune', name: '杉原千畝', home: '21505', title: '命のビザ', fx: 'visit', v: 8, cost: 15, cond: ['pact', 3, '連携協定を3回結ぶ'], say: '扉は閉ざすより、開くほうが道は広がります' },
    { id: 'chiyo', name: '千代', home: '21219', title: '内助の功', fx: 'cost', v: 20, cost: 15, cond: ['money', 100, '財源を100億円貯める'], say: '蓄えは、いざというときのために。むだを省きましょう' },
    { id: 'ieyasu', name: '徳川家康', home: ADV_SEKI, title: '天下分け目', fx: 'ap', v: 1, seki: true, say: '勝負は一日で決まる。動ける手を増やしておけ' },
    { id: 'mitsunari', name: '石田三成', home: ADV_SEKI, title: '五奉行の才', fx: 'cash', v: 5, seki: true, say: '帳簿を整えれば、財はおのずと増えまする' },
    { id: 'yoshitsugu', name: '大谷吉継', home: ADV_SEKI, title: '友との義', fx: 'rel', v: 2, seki: true, say: '信義を重ねれば、隣人はおのずと味方になる' }
  ];
  const ADV_BY_ID = {}; for (const a of ADVISORS) ADV_BY_ID[a.id] = a;
  function ensureAdv(st) {
    if (!st.adv) st.adv = st.factions.map(() => []);
    if (!st.advCool) st.advCool = {};
    if (!st.advOpen) st.advOpen = st.factions.map(() => []);
    // 実績（合併・切り崩し・協定の回数）。古いセーブは今の領地から見積もる
    if (!st.feat) st.feat = st.factions.map(f => ({ merge: Math.max(0, owned(st, f.id).length - 1), steal: 0, pact: Object.values(st.m).filter(x => x.pact.includes(f.id)).length }));
  }
  function addFeat(st, f, key) { ensureAdv(st); st.feat[f][key]++; }
  // 条件の今の値
  function advMeasure(st, f, key) {
    const cs = owned(st, f);
    switch (key) {
      case 'steal': case 'merge': case 'pact': return st.feat ? st.feat[f][key] : 0;
      case 'towns': return cs.length;
      case 'roles': return staffOf(st, f).filter(p => p.role).length;
      case 'maxTour': return Math.round(Math.max(0, ...cs.map(c => st.m[c].tour)));
      case 'maxInd': return Math.round(Math.max(0, ...cs.map(c => st.m[c].ind)));
      case 'tour60': return cs.filter(c => st.m[c].tour >= 60).length;
      case 'sat': return Math.round(avgSat(st, f));
      case 'money': return st.factions[f].money;
    }
    return 0;
  }
  // 条件を満たしたか（一度満たせば、あとで下がっても招ける）
  function advCond(st, f, id) {
    const a = ADV_BY_ID[id];
    if (!a.cond) return { ok: true, now: 0, need: 0, text: '' };
    const [key, need, text] = a.cond, now = advMeasure(st, f, key);
    const done = !!(st.advOpen && st.advOpen[f] && st.advOpen[f].includes(id));
    return { ok: done || now >= need, done, now: Math.min(now, need), need, text };
  }
  function advOf(st, f) { return (st.adv && st.adv[f]) || []; }
  function advFx(a) { return ADV_FX[a.fx](a.v); }
  function advBonus(st, f, fx) { return advOf(st, f).reduce((s, a) => s + (ADV_BY_ID[a.id].fx === fx ? ADV_BY_ID[a.id].v : 0), 0); }
  // 招ける人数：1人、市町村が8つ以上で2人（関ケ原の偉人は数えない）
  function advMax(st, f) { return 1 + (owned(st, f).length >= ADV_SLOT2 ? 1 : 0); }
  function advUsed(st, f) { return advOf(st, f).filter(a => !ADV_BY_ID[a.id].seki).length; }
  function advHolder(st, id) { return st.adv ? st.adv.findIndex(l => l.some(a => a.id === id)) : -1; }
  function canInviteAdv(st, f, id, apLeft) {
    const a = ADV_BY_ID[id];
    if (!a) return { ok: false, reason: '' };
    const h = advHolder(st, id);
    if (h >= 0) return { ok: false, reason: h === f ? '助言中です' : `${st.factions[h].name}に助言中です` };
    if (a.seki) return { ok: false, reason: '毎年9月、関ケ原町を持つ陣営に訪れます' };
    if (st.advCool && st.advCool[id] > 0) return { ok: false, reason: `あと${st.advCool[id]}か月は招けません` };
    if (st.m[a.home].owner !== f) return { ok: false, reason: 'ゆかりの地を自陣営にすると招けます' };
    const cd = advCond(st, f, id);
    if (!cd.ok) return { ok: false, cond: true, reason: `条件：${cd.text}（${cd.now}/${cd.need}）` };
    if (advUsed(st, f) >= advMax(st, f)) return { ok: false, reason: `同時に${advMax(st, f)}人までです${advMax(st, f) < 2 ? `（市町村が${ADV_SLOT2}つで2人）` : ''}` };
    if (apLeft < 1) return { ok: false, reason: '今月の行動力が足りません（1必要）' };
    if (st.factions[f].money < a.cost) return { ok: false, reason: `財源が足りません（${a.cost}億円必要）` };
    return { ok: true, cost: a.cost };
  }
  function inviteAdv(st, f, id) {
    const a = ADV_BY_ID[id];
    ensureAdv(st);
    st.factions[f].money -= a.cost;
    st.adv[f].push({ id, left: ADV_MONTHS });
    return `${a.name}を偉人アドバイザーに招く（${advFx(a)}・${ADV_MONTHS}か月）`;
  }
  // 月末：期間が過ぎるか、ゆかりの地を失うと去る。毎年9月は関ケ原の偉人が訪れる
  function tickAdvisors(st, names, d, res) {
    ensureAdv(st);
    for (const k in st.advCool) if (st.advCool[k] > 0) st.advCool[k]--;
    for (const fac of st.factions) {
      const list = st.adv[fac.id];
      for (const a of list.slice()) {
        const def = ADV_BY_ID[a.id], lost = st.m[def.home].owner !== fac.id;
        a.left--;
        if (a.left > 0 && !lost && fac.alive) continue;
        list.splice(list.indexOf(a), 1); st.advCool[a.id] = ADV_COOL;
        const text = `${lost ? `ゆかりの${names[def.home]}を失い、` : ''}${def.name}の助言が終わりました`;
        addLog(st, fac.id === 0 ? text : `${fac.name}：${text}`, fac.id === 0 ? 'bad' : 'rival');
        if (fac.id === 0) res.news.push(`${def.name}が去る`);
      }
    }
    // 条件を満たした偉人を記録する
    for (const fac of st.factions) {
      if (!fac.alive) continue;
      for (const a of ADVISORS) {
        if (!a.cond || st.advOpen[fac.id].includes(a.id) || advMeasure(st, fac.id, a.cond[0]) < a.cond[1]) continue;
        st.advOpen[fac.id].push(a.id);
        if (fac.id !== 0) continue;
        addLog(st, `「${a.cond[2]}」を達成。${st.m[a.home].owner === 0 ? `人材の画面から${a.name}を` : `${names[a.home]}を自陣営にすると、${a.name}を`}偉人アドバイザーに招けます`, 'good');
        res.news.push(`${a.name}を招ける`);
      }
    }
    if (d.month !== 9) return;
    const o = st.m[ADV_SEKI].owner;
    if (o < 0) { addLog(st, '関ケ原の戦いの月。関ケ原町を持つ陣営には、毎年ゆかりの偉人が助言に訪れます', 'season'); return; }
    const seki = ADVISORS.filter(a => a.seki), y = d.year - 2026;
    const pick = [0, 1, 2].map(i => seki[(y + i) % seki.length]).find(a => advHolder(st, a.id) < 0 && !(st.advCool[a.id] > 0));
    if (!pick) return;
    st.adv[o].push({ id: pick.id, left: ADV_MONTHS });
    const who = o === 0 ? 'あなたの陣営' : st.factions[o].name;
    addLog(st, `関ケ原の戦いの月。${pick.name}が${who}の偉人アドバイザーに加わりました（${advFx(pick)}・${ADV_MONTHS}か月）`, o === 0 ? 'good' : 'rival');
    res.steps.push({ kind: 'event', code: ADV_SEKI, text: `関ケ原の戦いの月。${pick.name}が${who}に助言`, tone: o === 0 ? 'good' : 'bad' });
    if (o === 0) res.news.push(`${pick.name}が助言に`);
  }
  // 偉人からのひとこと：効果に合わせて、いま手を打つとよい市町村を挙げる
  function advise(st, adj, names, f, id) {
    const a = ADV_BY_ID[id], mine = owned(st, f);
    const near = Object.keys(st.m).filter(c => st.m[c].owner !== f && adjacentTo(st, adj, c, f));
    const low = key => mine.slice().sort((p, q) => st.m[p][key] - st.m[q][key])[0];
    const r = c => Math.round(st.rel[f][c]);
    switch (a.fx) {
      case 'vote': {
        const c = near.filter(c => st.m[c].owner === -1 && !st.m[c].talk).sort((p, q) => st.rel[f][q] - st.rel[f][p])[0];
        if (!c) return '合併協議を進めて、住民投票で賛成を集めましょう';
        return r(c) >= 70 && st.m[c].pact.includes(f) ? `${names[c]}は関係度${r(c)}。合併協議を申し入れる好機です` : `${names[c]}は関係度${r(c)}。協定と交流で、協議に進める70を目指しましょう`;
      }
      case 'steal': {
        const c = near.filter(c => st.m[c].owner >= 0).sort((p, q) => st.m[p].sat - st.m[q].sat)[0];
        return c ? `${names[c]}（${st.factions[st.m[c].owner].name}）は満足度${Math.round(st.m[c].sat)}。切り崩しを狙えます` : 'ほかの陣営と隣り合ったら、満足度の低い町を狙いましょう';
      }
      case 'visit': case 'rel': {
        const gap = c => (r(c) < 50 ? 50 : 70) - r(c);
        const c = near.filter(c => st.m[c].owner === -1 && r(c) < 70).sort((p, q) => gap(p) - gap(q))[0];
        if (!c) return '隣り合う市町村と交流を重ねましょう';
        const goal = r(c) < 50 ? 50 : 70;
        return `${names[c]}はあと${goal - r(c)}で${goal === 50 ? '連携協定' : '合併協議'}に届きます`;
      }
      case 'plan': case 'ind': { const c = low('ind'); return `${names[c]}の産業力は${Math.round(st.m[c].ind)}。産業振興で底上げを`; }
      case 'tour': case 'tourInc': { const c = low('tour'); return `${names[c]}の観光力は${Math.round(st.m[c].tour)}。観光PRで磨きましょう`; }
      case 'care': case 'sat': { const c = low('sat'); return `${names[c]}の満足度は${Math.round(st.m[c].sat)}。住民の声に耳を傾けましょう`; }
    }
    const month = dateOf(st.turn).month, net = factionIncome(st, f, month) - upkeep(st, f);
    return `月の収支は${net >= 0 ? '+' : '−'}${Math.abs(net)}億円。${net < 0 ? '支出を見直しましょう' : '余裕のあるうちに内政と外交へ'}`;
  }

  // ---------- 誘致合戦 ----------
  // 大型の企業進出の話が圏域に来ると、圏域とその隣に市町村を持つ陣営同士が補助金を出し合って奪い合う。
  // 補助金は上乗せのたびに払い、負けたら戻る。決まった候補地に企業が立地し、その市町村を持つ陣営に毎月の税収が入る
  const LURE_MONTHS = 3, LURE_PT = 6, LURE_MAX = 6, LURE_P = 0.2, LURE_REST = 3, LURE_NOISE = 4, LURE_IN = 5, LURE_LIKE = 10;
  // inc：毎月の税収（億円）、ind：産業力、pop：人口の伸び、step：補助金1段の額、likes：好む特産
  const FIRMS = [
    { name: '半導体工場', inc: 4, ind: 14, pop: 0.03, step: 15 },
    { name: 'EV電池工場', inc: 3, ind: 12, pop: 0.025, step: 12 },
    { name: 'データセンター', inc: 3, ind: 10, pop: 0.005, step: 10 },
    { name: '物流センター', inc: 2, ind: 8, pop: 0.015, step: 8 },
    { name: '食品工場', inc: 2, ind: 8, pop: 0.02, step: 8 },
    { name: '航空機部品工場', inc: 3, ind: 12, pop: 0.02, step: 12, likes: '航空宇宙' },
    { name: '精密刃物工場', inc: 2, ind: 10, pop: 0.015, step: 8, likes: '刃物' },
    { name: 'ファインセラミックス工場', inc: 3, ind: 12, pop: 0.02, step: 10, likes: '美濃焼' }
  ];
  function firmInc(x) { return (x.firms || []).reduce((s, k) => s + k.inc, 0); }
  // 候補地になれるのは、圏域の市町村と、圏域に隣り合う市町村
  function lureArea(adj, r) { const cs = regionCodes(r); return new Set([...cs, ...cs.flatMap(c => adj[c])]); }
  function lureTowns(st, adj, f, r) { const a = lureArea(adj, r); return owned(st, f).filter(c => a.has(c)); }
  // 立地点：企業から見た候補地の良さ。産業力・防災力・人口と、圏域の中か、好む特産か
  function sitePoint(st, c, lure) {
    const x = st.m[c];
    return Math.round(x.ind * 0.4 + x.dis * 0.1 + Math.min(15, Math.sqrt(x.pop) * 1.5) + (INFO[c][0] === lure.region ? LURE_IN : 0) + (lure.likes && INFO[c][2] === lure.likes ? LURE_LIKE : 0));
  }
  // 陣営の候補地：最初に決めた市町村。失ったら残りでいちばん立地点の高い市町村
  function lureSite(st, adj, f) {
    const L = st.lure;
    if (!L || !st.factions[f].alive) return null;
    const towns = lureTowns(st, adj, f, L.region), b = L.bids[f];
    if (b && towns.includes(b.site)) return b.site;
    return towns.sort((p, q) => sitePoint(st, q, L) - sitePoint(st, p, L))[0] || null;
  }
  function lureBid(st, f) { const b = st.lure && st.lure.bids[f]; return b ? b.n : 0; }
  function lureScore(st, adj, f) { const c = lureSite(st, adj, f); return c ? sitePoint(st, c, st.lure) + lureBid(st, f) * LURE_PT : -1; }
  function lureParts(st, adj) { return st.lure ? Object.keys(st.lure.bids).map(Number).filter(f => lureSite(st, adj, f)) : []; }
  function lureRows(st, adj) {
    return lureParts(st, adj).map(f => { const site = lureSite(st, adj, f), b = st.lure.bids[f], pt = sitePoint(st, site, st.lure); return { f, site, n: b.n, paid: b.paid, pt, total: pt + b.n * LURE_PT }; }).sort((a, b) => b.total - a.total);
  }
  // 月初：候補地を持つ陣営が2つ以上ある圏域に、ときどき進出の話が来る
  function startLure(st, adj, names, res) {
    const regs = REGIONS.map(r => ({ r, fs: st.factions.filter(fa => fa.alive && lureTowns(st, adj, fa.id, r).length).map(fa => fa.id) })).filter(o => o.fs.length >= 2);
    if (!regs.length) return;
    // あなたの陣営が候補地を持つ圏域と、圏域制覇の目標の圏域に来やすい
    const w = o => (o.fs.includes(0) ? 3 : 1) * (st.mode === 'region' && o.r === st.goal ? 2 : 1);
    let k = rnd(st) * regs.reduce((s, o) => s + w(o), 0);
    const pick = regs.find(o => (k -= w(o)) < 0) || regs[regs.length - 1];
    const area = lureArea(adj, pick.r);
    const firms = FIRMS.filter(fm => !fm.likes || [...area].some(c => INFO[c][2] === fm.likes));
    const fm = firms[Math.floor(rnd(st) * firms.length)];
    st.lure = { ...fm, region: pick.r, left: LURE_MONTHS, bids: {} };
    for (const f of pick.fs) st.lure.bids[f] = { site: lureSite(st, adj, f), n: 0, paid: 0 };
    const rows = lureRows(st, adj), mine = pick.fs.includes(0);
    const who = rows.map(r => `${r.f === 0 ? 'あなたの陣営' : st.factions[r.f].name}（${names[r.site]}）`).join('・');
    addLog(st, `${pick.r}圏域に${fm.name}の進出話。${who}による誘致合戦が始まりました（${LURE_MONTHS}か月後に決定）`, mine ? 'good' : 'info');
    const step = { kind: 'lure', phase: 'start', code: mine ? st.lure.bids[0].site : rows[0].site, name: fm.name, region: pick.r, inc: fm.inc, ind: fm.ind, pop: fm.pop, stepAmt: fm.step, rows, mine };
    res.steps.push(step);
    if (mine) { res.lures.push(step); res.news.push(`${fm.name}の誘致合戦`); }
  }
  // 月末：期限が来たら、立地点＋補助金のいちばん高い候補地に決まる（差が小さいと運で入れ替わる）
  function tickLure(st, adj, names, res) {
    const L = st.lure;
    if (!L) return;
    L.left--;
    if (L.left > 0) return;
    const rows = lureRows(st, adj).map(r => ({ ...r, score: r.total + (rnd(st) * 2 - 1) * LURE_NOISE })).sort((a, b) => b.score - a.score);
    // 候補地を失った陣営と、負けた陣営の補助金は戻る
    for (const k of Object.keys(L.bids)) { const f = Number(k); if (!rows.length || rows[0].f !== f) st.factions[f].money += L.bids[f].paid; }
    st.lure = null; st.lureNext = st.turn + 1 + LURE_REST;
    const mine = Object.keys(L.bids).map(Number).includes(0);
    if (!rows.length) { addLog(st, `${L.region}圏域への${L.name}の進出は見送られました`, 'info'); return; }
    const win = rows[0], x = st.m[win.site];
    x.firms = [...(x.firms || []), { name: L.name, inc: L.inc }];
    x.ind = clamp(x.ind + L.ind, 0, 100); x.pop += x.pop * L.pop + 0.3; x.sat = clamp(x.sat + 3, 0, 100);
    const nm = k => k === 0 ? 'あなたの陣営' : st.factions[k].name;
    addLog(st, `誘致合戦：${L.name}は${nm(win.f)}の${names[win.site]}に立地が決定（補助金${win.n}段・${win.paid}億円）。税収が毎月+${L.inc}億円`, win.f === 0 ? 'good' : (mine ? 'bad' : 'rival'));
    const step = { kind: 'lure', phase: 'result', code: win.site, f: win.f, name: L.name, region: L.region, inc: L.inc, ind: L.ind, pop: L.pop, rows: rows.map(({ score, ...r }) => r), mine };
    res.steps.push(step);
    if (mine) { res.lures.push(step); res.news.push(win.f === 0 ? `${L.name}を誘致` : `${L.name}の誘致に敗れる`); }
  }

  // ---------- 合流 ----------
  // 市町村を減らして少なくなったライバルは、人口がずっと多い隣の陣営に合流を申し出る（戦国SLGの臣従）。
  // 伸び盛りの陣営は申し出ない（いちばん多かったときより市町村が減っていることが条件）。
  // 市町村・財源・人材が受け入れた陣営に移る。あなたの陣営は合流を申し出ない
  const JOIN_TOWNS = 5, JOIN_RATIO = 3, JOIN_P = 0.2, JOIN_SAT = 5;
  function bordering(st, adj, g, h) { return owned(st, g).some(c => adj[c].some(n => st.m[n].owner === h)); }
  function tickJoin(st, adj, names, res) {
    for (const G of st.factions) {
      const n = owned(st, G.id).length;
      G.peak = Math.max(G.peak || 0, n);
      if (!G.ai || !G.alive || n > JOIN_TOWNS || n >= G.peak) continue;
      const pg = totalPop(st, G.id);
      const H = st.factions.filter(o => o.alive && o.id !== G.id && bordering(st, adj, G.id, o.id) && totalPop(st, o.id) >= pg * JOIN_RATIO)
        .sort((a, b) => totalPop(st, b.id) - totalPop(st, a.id))[0];
      if (H && rnd(st) < JOIN_P) joinFaction(st, names, G.id, H.id, res);
    }
  }
  function joinFaction(st, names, g, h, res) {
    const G = st.factions[g], H = st.factions[h], towns = owned(st, g);
    for (const c of towns) { const x = st.m[c]; x.owner = h; x.sat = clamp(x.sat - JOIN_SAT, 0, 100); st.rel[h][c] = Math.max(st.rel[h][c], 60); }
    // g の協定・協議はなくなる。受け入れた陣営が自分の市町村にかけていた協議もなくなる
    for (const c in st.m) {
      const x = st.m[c], t = x.talk;
      x.pact = x.pact.filter(k => k !== g);
      if (!t) continue;
      const left = [t.f, t.rival].filter(k => k !== undefined && k !== g && k !== x.owner);
      if (left.length === (t.rival === undefined ? 1 : 2)) continue;
      x.talk = left.length ? { f: left[0], left: t.left, keep: t.keep } : null;
    }
    if (st.lure && st.lure.bids[g]) { G.money += st.lure.bids[g].paid; delete st.lure.bids[g]; }
    const gain = Math.max(0, G.money);
    H.money += gain; G.money = 0;
    const joined = [];
    for (const p of staffOf(st, g)) {
      p.role = null;
      if (staffOf(st, h).length < staffMax(st, h)) { p.f = h; joined.push(p.name); } else p.f = -1;
    }
    if (H.ai) autoAssign(st, h);
    ensureAdv(st);
    for (const a of st.adv[g]) st.advCool[a.id] = ADV_COOL;
    st.adv[g] = [];
    G.alive = false;
    const who = h === 0 ? 'あなたの陣営' : H.name;
    addLog(st, `${G.name}が${who}への合流を申し出て、${towns.map(c => names[c]).join('・')}が加わりました${joined.length ? `（人材：${joined.join('・')}）` : ''}`, h === 0 ? 'good' : 'rival');
    const step = { kind: 'join', code: G.capital, f: h, g, gname: G.name, towns, joined, money: gain, mine: h === 0 };
    res.steps.push(step);
    if (h === 0) { res.joins.push(step); res.news.push(`${G.name}が合流`); }
  }

  // ---------- 首長選挙 ----------
  // 各市町村で4年ごとに首長選挙がある。ほかの陣営の市町村には、投票日の3か月前から、隣り合う陣営が候補を立てられる。
  // 立てた陣営と現職の陣営が演説会を重ねて得票を伸ばし、投票日の月末に開票する。候補が当選すると、その市町村は候補を立てた陣営に移る。
  // 合併協議（満足度の差か45未満が必要）とちがい、選挙の時期を待てば、満足度の高い市町村でも狙える。現職は少し有利。
  // 本拠地の首長は陣営の首長本人なので、本拠地には候補を立てられない（本拠地を失うのは合併だけ）
  // ELECT_INC：現職の強み、ELECT_SAT・ELECT_REL：満足度の差と関係度の効き（選挙は住民の満足度で決まり、関係度は合併ほど効かない）
  // RALLY_STEP：演説会1回で動く得票（％）、AI_ELECT：ライバルが候補を立てる見込み、AI_RALLY：ライバルが演説会を開く確率
  const ELECT_TERM = 48, ELECT_WINDOW = 3, ELECT_INC = 12, ELECT_SAT = 0.5, ELECT_REL = 0.3, RALLY_STEP = 5, RALLY_MAX = 4, AI_ELECT = 44, AI_RALLY = 0.3;
  // 投票日（その月末に開票する月）を市町村ごとにずらして決める。古いセーブにもここで付ける
  function ensureElect(st) {
    for (const c in st.m) {
      const x = st.m[c];
      if (x.elect !== undefined) continue;
      let e = 3 + hash('elect' + c) % ELECT_TERM;
      while (e < st.turn) e += ELECT_TERM;
      x.elect = e;
    }
  }
  // 投票日まであと何か月か（0 ならこの月末に開票）
  function electLeft(st, c) { return st.m[c].elect - st.turn; }
  // この月末に開票する、あなたの陣営が関わる選挙
  function raceDue(st, c) { const r = st.m[c].race; return !!r && electLeft(st, c) === 0 && (r.ch === 0 || r.inc === 0); }
  // 候補を立てた（立てようとする）陣営 f の得票の見込み（乱数の分を除く）
  function electExpect(st, f, code) {
    const x = st.m[code], r = x.race && x.race.ch === f ? x.race : null;
    const rally = r ? (r.rally[f] - r.rally[r.inc]) * RALLY_STEP : 0;
    return 50 - ELECT_INC + (avgSat(st, f) - x.sat) * ELECT_SAT + (st.rel[f][code] - 70) * ELECT_REL + roleVal(st, f, 'nego') / 12 + appealVote(st, f, code) + advVote(st, f, code) + rally;
  }
  // あなたの陣営から見た得票の見込み（現職なら守る側）
  function electMine(st, code) { const r = st.m[code].race; const e = electExpect(st, r.ch, code); return r.ch === 0 ? e : 100 - e; }
  // 開票：yes が候補を立てた陣営、no が現職の得票。決戦の結果があればそれを使う
  function electVote(st, code) {
    const x = st.m[code], r = x.race, b = r.battle;
    if (b) return r.ch === 0 ? { yes: b.yes, no: b.no, turnout: b.turnout, battle: true } : { yes: b.no, no: b.yes, turnout: b.turnout, battle: true };
    const share = clamp(electExpect(st, r.ch, code) + (rnd(st) * 20 - 10), 4, 96);
    const turnout = 0.38 + rnd(st) * 0.25;
    const cast = Math.round(x.pop * 1000 * 0.82 * turnout), y = Math.round(cast * share / 100);
    return { yes: y, no: cast - y, turnout };
  }
  // 月末：投票日を迎えた市町村で開票する。候補のいない選挙は現職がそのまま続ける
  function tickElections(st, names, res) {
    const nm = k => k === 0 ? 'あなたの陣営' : st.factions[k].name;
    for (const c in st.m) {
      const x = st.m[c], r = x.race;
      // 投票日までに持ち主が変わったり、候補を立てた陣営がなくなったら取りやめ
      if (r && (x.owner !== r.inc || !st.factions[r.ch].alive)) x.race = null;
      if (electLeft(st, c) !== 0) continue;
      x.elect += ELECT_TERM;
      if (!x.race) continue;
      const v = electVote(st, c), ch = x.race.ch, prev = x.owner, rally = x.race.rally;
      v.pass = v.yes > v.no;
      x.race = null;
      if (v.pass) {
        addFeat(st, ch, 'steal');
        x.owner = ch; x.pact = []; x.sat = clamp(x.sat + 3, 0, 100);
        st.rel[ch][c] = Math.max(st.rel[ch][c], 60);
        const joined = staffOnMerge(st, names, c, ch, prev);
        if (joined.length) { v.joined = joined; addLog(st, `${names[c]}ゆかりの${joined.join('・')}が${nm(ch)}に加わりました`, ch === 0 ? 'good' : 'rival'); }
        addLog(st, `${names[c]}の首長選挙は${nm(ch)}の候補が当選。${names[c]}は${nm(ch)}に移りました`, ch === 0 ? 'good' : (prev === 0 ? 'bad' : 'rival'));
        loseTown(st, names, prev);
      } else {
        st.rel[ch][c] = clamp(st.rel[ch][c] - 10, 0, 100); x.sat = clamp(x.sat + 2, 0, 100);
        addLog(st, `${names[c]}の首長選挙は現職（${nm(prev)}）が再選。${nm(ch)}の候補は落選`, prev === 0 ? 'good' : (ch === 0 ? 'bad' : 'rival'));
      }
      const step = { kind: 'elect', code: c, f: v.pass ? ch : prev, ch, prev, rally, ...v };
      res.steps.push(step);
      if (ch === 0 || prev === 0) {
        res.elects.push(step);
        res.news.push(`${names[c]}の首長選挙で${(ch === 0) === v.pass ? '勝利' : '敗北'}`);
      }
    }
  }
  // 市町村を失った陣営：本拠地だったら移し、ひとつもなくなったら退場
  function loseTown(st, names, prev) {
    if (prev < 0) return;
    const P = st.factions[prev], left = owned(st, prev);
    if (prev > 0 && left.length && st.m[P.capital].owner !== prev) {
      P.capital = left.sort((a, b) => st.m[b].pop - st.m[a].pop)[0];
      addLog(st, `${P.name}は本拠地を${names[P.capital]}に移しました`, 'rival');
    }
    if (!left.length) { P.alive = false; addLog(st, `${P.name}はすべての市町村を失いました`, 'info'); }
  }

  function upkeep(st, f) { return Math.round(owned(st, f).reduce((s, c) => s + 0.8 + st.m[c].pop * 0.012, 0) + staffUpkeep(st, f)); }
  // 特産タグのほかに季節の観光だけを持つ市町村（関市の小瀬鵜飼）。産業や魅力の強みは特産タグのまま
  const SEASON_EXTRA = { '21205': ['鵜飼'] };
  function seasonTags(code) { return [INFO[code][2], ...(SEASON_EXTRA[code] || [])].filter(Boolean); }
  // 観光収入の季節の倍率。季節が重なる月（関市の10月：刃物と鵜飼）は重ねず、高いほうを使う
  function seasonX(code, month) {
    return seasonTags(code).reduce((m, t) => { const s = SEASON[t]; return s && s.months.includes(month) ? Math.max(m, s.x) : m; }, 1);
  }
  function incomeOf(st, code, month) {
    const x = st.m[code];
    const base = x.pop * 0.05 * (0.6 + x.ind / 100);
    const tour = x.tour * 0.05 * seasonX(code, month);
    return base + tour + firmInc(x) + projInc(st, code);
  }
  // 地方交付税：人口の少ない市町村ほど多く交付される
  function grantOf(st, f) { return owned(st, f).reduce((s, c) => s + Math.max(0.3, 2.4 - st.m[c].pop * 0.02), 0); }
  function factionIncome(st, f, month) {
    let base = 0, tour = 0, pact = 0, firm = 0;
    for (const c in st.m) {
      const x = st.m[c];
      if (x.owner === f) { base += x.pop * 0.05 * (0.6 + x.ind / 100); tour += x.tour * 0.05 * seasonX(c, month); firm += firmInc(x) + projInc(st, c); }
      else if (x.owner === -1 && x.pact.includes(f)) pact += incomeOf(st, c, month) * 0.15;
    }
    base *= (1 + roleVal(st, f, 'deputy') / 500) * (1 + advBonus(st, f, 'tax') / 100);
    base += grantOf(st, f);
    tour *= (1 + roleVal(st, f, 'tourism') / 250) * (1 + advBonus(st, f, 'tourInc') / 100);
    return Math.round(base + tour + pact + firm + advBonus(st, f, 'cash'));
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
    keep: { label: '引き留め', ap: 1, own: false, note: '住民投票の賛成 −5・満足度 +3' },
    lure: { label: '誘致合戦に補助金', ap: 1, own: false, note: '誘致合戦で選ばれやすくなる。負けたら戻る' },
    run: { label: '候補を擁立', ap: 2, own: false, note: '首長選挙で当選すれば、この市町村が自陣営に移る' },
    rally: { label: '演説会', ap: 1, own: false, note: `首長選挙の得票 +${RALLY_STEP}` },
    aid: { label: '災害支援', ap: 1, own: false, note: `関係度 +${AID_REL}・満足度 +${AID_SAT}` },
    build: { label: '大型事業に着工', ap: 2, own: true, note: '完成すると圏域の自陣営の市町村が伸び、毎月の収入も増える' }
  };

  // ---------- 大型事業 ----------
  // 圏域ごとに1つ。中心の市町村を持ち、圏域に自陣営の市町村が PROJ_TOWNS 以上あれば着工できる（陣営ごとに同時に1つ）。
  // 完成すると、その圏域の自陣営の市町村の数値が上がり、中心の市町村を持つ陣営に毎月の収入が入る。1回のゲームで1度だけ
  const PROJECTS = [
    { id: 'gifu', region: '岐阜', code: '21201', name: '岐阜駅前の再開発', cost: 300, months: 4, fx: { ind: 8, tour: 6 }, inc: 6 },
    { id: 'seino', region: '西濃', code: '21202', name: '揖斐川・長良川の治水', cost: 240, months: 4, fx: { dis: 25, sat: 6 }, inc: 2 },
    { id: 'chuno', region: '中濃', code: '21211', name: '東海環状自動車道の全線開通', cost: 320, months: 5, fx: { ind: 10 }, inc: 6 },
    { id: 'tono', region: '東濃', code: '21206', name: 'リニア新駅の周辺整備', cost: 400, months: 6, fx: { ind: 8, tour: 6 }, pop: 0.02, inc: 8 },
    { id: 'hida', region: '飛騨', code: '21203', name: '飛騨の広域観光ルート', cost: 260, months: 4, fx: { tour: 12 }, inc: 5 }
  ];
  const PROJ_TOWNS = 3;
  const PROJ_FX = { ind: '産業力', tour: '観光力', sat: '満足度', dis: '防災力' };
  const projAt = code => PROJECTS.find(p => p.code === code);
  function projState(st, id) { return (st.proj || {})[id]; }
  function projOf(st, f) { return PROJECTS.find(p => { const s = projState(st, p.id); return s && !s.done && s.f === f; }); }
  function projInc(st, code) { const p = projAt(code), s = p && projState(st, p.id); return s && s.done ? p.inc : 0; }
  function projNeed(p) { return Math.min(PROJ_TOWNS, regionCodes(p.region).length); }
  function projFx(p) { return Object.entries(p.fx).map(([k, v]) => `${PROJ_FX[k]} +${v}`).join('・') + (p.pop ? `・人口 +${p.pop * 100}％` : ''); }
  function tickProjects(st, names, res) {
    for (const p of PROJECTS) {
      const s = projState(st, p.id);
      if (!s || s.done) continue;
      const nm = s.f === 0 ? 'あなたの陣営' : st.factions[s.f].name;
      if (st.m[p.code].owner !== s.f) {
        delete st.proj[p.id];
        addLog(st, `${names[p.code]}が${nm}を離れたため、大型事業「${p.name}」は中止になりました`, s.f === 0 ? 'bad' : 'rival');
        if (s.f === 0) res.news.push(`${p.name}が中止`);
        continue;
      }
      if (--s.left > 0) continue;
      st.proj[p.id] = { f: s.f, done: true };
      for (const c of regionCodes(p.region).filter(c => st.m[c].owner === s.f)) {
        const x = st.m[c];
        for (const [k, v] of Object.entries(p.fx)) x[k] = clamp(x[k] + v, 0, 100);
        if (p.pop) x.pop *= 1 + p.pop;
      }
      addLog(st, `大型事業「${p.name}」が完成。${p.region}圏域の${nm}の市町村で${projFx(p)}、${names[p.code]}の収入が毎月+${p.inc}億円`, s.f === 0 ? 'good' : 'rival');
      if (s.f === 0) res.news.push(`${p.name}が完成`);
      res.steps.push({ kind: 'event', code: p.code, text: `${p.name}が完成（${nm}）`, tone: s.f === 0 ? 'good' : 'bad' });
    }
  }

  // ---------- 圏域ごとの方針（あなたの陣営だけ） ----------
  // 月末に、方針のコマンドを、その圏域で値の低い自陣営の市町村から POLICY_TOWNS まで、標準の規模で自動で行う。
  // 行動力は使わない。財源が POLICY_RESERVE を切るときは行わない。今月すでに同じコマンドをした市町村は飛ばす
  const POLICIES = { ind: { label: '産業', cmd: 'ind', key: 'ind' }, tour: { label: '観光', cmd: 'tour', key: 'tour' }, care: { label: '暮らし', cmd: 'care', key: 'sat' }, dis: { label: '防災', cmd: 'dis', key: 'dis' } };
  // 方針は、その圏域に自陣営の市町村が POLICY_MIN 以上あるときだけ動く（序盤の小さな陣営には効かせない）
  const POLICY_TOWNS = 2, POLICY_RESERVE = 30, POLICY_MIN = 3;
  function policyReady(st, r) { return regionCodes(r).filter(c => st.m[c].owner === 0).length >= Math.min(POLICY_MIN, regionCodes(r).length); }
  function policyTowns(st, r) {
    const p = POLICIES[(st.policy || {})[r]];
    if (!p || !policyReady(st, r)) return [];
    return regionCodes(r).filter(c => st.m[c].owner === 0 && st.m[c][p.key] < 100 && !usedThisMonth(st, 0, c, p.cmd))
      .sort((a, b) => st.m[a][p.key] - st.m[b][p.key]).slice(0, POLICY_TOWNS);
  }
  function setPolicy(st, r, k) { st.policy = { ...(st.policy || {}), [r]: POLICIES[k] ? k : null }; }
  function runPolicies(st, names) {
    const fac = st.factions[0];
    let stopped = false;
    for (const r of REGIONS) {
      const p = POLICIES[(st.policy || {})[r]];
      if (!p) continue;
      const done = [];
      let paid = 0;
      for (const c of policyTowns(st, r)) {
        const cost = cmdCost(st, p.cmd, c, 1, 0);
        if (fac.money - cost < POLICY_RESERVE) { stopped = true; break; }
        fac.money -= cost; paid += cost; done.push(c);
        const x = st.m[c];
        x[p.key] = clamp(x[p.key] + gainOf(x[p.key], cmdEffect(st, 0, p.cmd, 1)), 0, 100);
      }
      if (done.length) addLog(st, `方針（${r}圏域・${p.label}）：${done.map(c => names[c]).join('・')}で${CMDS[p.cmd].label}（${paid}億円）`, 'good');
    }
    if (stopped) addLog(st, `財源が${POLICY_RESERVE}億円を切るため、圏域の方針の内政を一部止めました`, 'bad');
  }

  // ---------- ライバルの包囲網 ----------
  // あなたの陣営が県の人口の SIEGE_ON 以上を持つと、ライバル同士が手を組む。SIEGE_OFF を下回るか、ライバルが1陣営になると解ける。
  // 包囲網のあいだ、ライバルは行動力+1、ライバル同士では争わず、あなたの陣営の隣の市町村との関係度が毎月 SIEGE_REL ずつ上がる
  const SIEGE_ON = 0.4, SIEGE_OFF = 0.33, SIEGE_REL = 2;
  function popShare(st, f) { let all = 0, mine = 0; for (const c in st.m) { all += st.m[c].pop; if (st.m[c].owner === f) mine += st.m[c].pop; } return all ? mine / all : 0; }
  function tickSiege(st, adj, names, res) {
    const share = popShare(st, 0), rivals = st.factions.filter(x => x.ai && x.alive);
    if (!st.siege && share >= SIEGE_ON && rivals.length >= 2) {
      st.siege = true;
      addLog(st, `あなたの陣営が県の人口の${Math.round(share * 100)}％を持ったため、${rivals.map(x => x.name).join('・')}が包囲網を結成しました。ライバル同士の争いをやめ、あなたの陣営を集中して狙ってきます`, 'bad');
      res.news.push('ライバルが包囲網を結成');
      res.siege = true;
      res.steps.push({ kind: 'event', code: st.factions[0].capital, text: 'ライバル陣営が包囲網を結成', tone: 'bad' });
    } else if (st.siege && (share < SIEGE_OFF || rivals.length < 2)) {
      st.siege = false;
      addLog(st, 'ライバルの包囲網が解けました', 'good');
      res.news.push('包囲網が解ける');
    }
    if (!st.siege) return;
    for (const x of rivals) for (const c of owned(st, 0)) if (adjacentTo(st, adj, c, x.id)) st.rel[x.id][c] = clamp(st.rel[x.id][c] + SIEGE_REL, 0, 100);
  }

  // ---------- 選択肢のある出来事（あなたの陣営だけ） ----------
  // ときどき、自陣営の市町村で、どちらかを選ぶ出来事が起きる。財源の増減は、市町村が多いほど大きくなる
  const CHOICE_P = 0.2, CHOICE_GAP = 4;
  const CHOICES = {
    office: { topic: '庁舎', pick: (st, c) => st.m[c].mergedAt !== undefined && st.turn - st.m[c].mergedAt <= 3 && st.factions[0].capital !== c,
      title: '庁舎をどうする？', lead: n => `合併した${n}の役所の仕事を、本庁にまとめる話が出ています。`,
      opts: [{ label: '支所として残す', fx: { money: -25, sat: 12 } }, { label: '本庁にまとめる', fx: { money: 15, sat: -8 } }] },
    rail: { topic: 'ローカル線', pick: (st, c) => st.m[c].pop < 40 && st.factions[0].capital !== c,
      title: 'ローカル線をどうする？', lead: n => `${n}を走るローカル線の赤字が続き、残すかどうかが議論になっています。`,
      opts: [{ label: '支援して残す', fx: { money: -30, sat: 6, near: 3 } }, { label: 'バスに切り替える', fx: { money: 15, sat: -10 } }] },
    mall: { topic: '大型商業施設', pick: (st, c) => st.m[c].ind >= 50,
      title: '大型商業施設の進出', lead: n => `${n}の郊外に、大型商業施設の進出が打診されています。`,
      opts: [{ label: '受け入れる', fx: { ind: 10, near: -4 } }, { label: '商店街を守る', fx: { sat: 4, tour: 4 } }] },
    fest: { topic: '祭りの予算', pick: (st, c) => st.m[c].tour >= 40,
      title: '祭りの予算', lead: n => `${n}の祭りの担い手が減り、予算の見直しが求められています。`,
      opts: [{ label: '予算を増やす', fx: { money: -20, tour: 8, sat: 4 } }, { label: '規模を縮める', fx: { money: 10, sat: -5 } }] },
    move: { topic: '移住の支援', pick: (st, c) => st.m[c].sat < 58,
      title: '移住の支援', lead: n => `${n}の人口減少を止めるため、移住者向けの住宅補助が提案されています。`,
      opts: [{ label: '住宅補助を出す', fx: { money: -35, pop: 0.02, sat: 5 } }, { label: '空き家の紹介にとどめる', fx: { money: -5, sat: 1 } }] },
    waste: { topic: '処分場の計画', pick: (st, c) => st.m[c].pop < 30 && st.factions[0].capital !== c,
      title: '処分場の計画', lead: n => `${n}の山あいに、広域のごみ処分場をつくる計画が持ち込まれました。`,
      opts: [{ label: '受け入れる', fx: { money: 40, sat: -12 } }, { label: '断る', fx: { sat: 3 } }] }
  };
  const CHOICE_FX = { ind: '産業力', tour: '観光力', sat: '満足度' };
  const choiceMoney = (st, v) => Math.round(v * (1 + owned(st, 0).length / 8));
  function choiceNote(st, fx) {
    const out = [];
    if (fx.money) out.push(`財源 ${fx.money > 0 ? '+' : '−'}${Math.abs(choiceMoney(st, fx.money))}億円`);
    for (const k in CHOICE_FX) if (fx[k]) out.push(`${CHOICE_FX[k]} ${fx[k] > 0 ? '+' : '−'}${Math.abs(fx[k])}`);
    if (fx.pop) out.push(`人口 +${fx.pop * 100}％`);
    if (fx.near) out.push(`隣の自陣営の市町村の満足度 ${fx.near > 0 ? '+' : '−'}${Math.abs(fx.near)}`);
    return out.join('・') || '変化なし';
  }
  function pickChoice(st) {
    const ids = Object.keys(CHOICES).map(id => [id, rnd(st)]).sort((a, b) => a[1] - b[1]).map(a => a[0]);
    for (const id of ids) {
      const cs = owned(st, 0).filter(c => CHOICES[id].pick(st, c));
      if (cs.length) return { id, code: cs[Math.floor(rnd(st) * cs.length)] };
    }
    return null;
  }
  function choiceView(st, names) {
    const ch = st.choice; if (!ch) return null;
    const d = CHOICES[ch.id], n = names[ch.code];
    return { code: ch.code, title: `${n}：${d.title}`, lead: d.lead(n), opts: d.opts.map(o => ({ label: o.label, note: choiceNote(st, o.fx) })) };
  }
  function applyChoice(st, adj, names, i) {
    const ch = st.choice; if (!ch) return '';
    const d = CHOICES[ch.id], o = d.opts[i], x = st.m[ch.code], fx = o.fx;
    st.choice = null;
    if (x.owner !== 0) return '';
    if (fx.money) st.factions[0].money += choiceMoney(st, fx.money);
    for (const k in CHOICE_FX) if (fx[k]) x[k] = clamp(x[k] + fx[k], 0, 100);
    if (fx.pop) x.pop *= 1 + fx.pop;
    if (fx.near) for (const c of adj[ch.code]) if (st.m[c].owner === 0) st.m[c].sat = clamp(st.m[c].sat + fx.near, 0, 100);
    const text = `${names[ch.code]}の${d.topic}は「${o.label}」に決めました（${choiceNote(st, fx)}）`;
    addLog(st, text, 'info');
    return text;
  }

  // 企業誘致の成功率。不調でも企業とのつながりが残り、次は成功しやすくなる（重ねて2回分まで）
  const INVITE_FAIL_IND = 4, INVITE_LEAD = 0.2, INVITE_LEAD_MAX = 0.4;
  function inviteChance(st, code) { const x = st.m[code]; return Math.min(0.95, 0.55 + x.ind / 400 + (x.inviteLead || 0)); }

  // 予算規模：お金を多く使うほど効果が大きい（ただし割高）
  const SCALES = [
    { label: '小規模', cost: 0.5, eff: 0.6 },
    { label: '標準', cost: 1, eff: 1 },
    { label: '大規模', cost: 2.5, eff: 1.8 },
    { label: '特大', cost: 5, eff: 2.8 }
  ];
  const SCALABLE = ['ind', 'tour', 'care', 'dis', 'visit'];
  // 同じ市町村には、同じコマンドを月1回まで（特大の連発で一気に上げないように）
  const ONCE = [...SCALABLE, 'invite'];
  function usedThisMonth(st, f, code, cmd) { return !!(st.used && st.used[`${f}:${code}:${cmd}`]); }
  function markUsed(st, f, code, cmd) { st.used = st.used || {}; st.used[`${f}:${code}:${cmd}`] = true; }
  // 上がりにくさ：SOFT を超えた分は、効果が半分になる（関係度・満足度・産業力・観光力・防災力）
  const SOFT = 70;
  function gainOf(cur, e) { if (e <= 0) return e; const a = clamp(SOFT - cur, 0, e); return Math.round(a + (e - a) / 2); }
  function scaleOf(cmd, scale) { return SCALABLE.includes(cmd) ? SCALES[scale === undefined ? 1 : scale] : SCALES[1]; }
  function cmdEffect(st, f, cmd, scale) {
    const pb = Math.floor(roleVal(st, f, 'planning') / 25) + advBonus(st, f, 'plan'), nb = Math.floor(roleVal(st, f, 'nego') / 15);
    const B = fx => advBonus(st, f, fx);
    const base = { ind: 6 + pb + B('ind'), tour: 7 + pb + B('tour'), care: 8 + pb + B('care'), dis: 8 + pb, visit: 15 + nb + B('visit') }[cmd];
    return base === undefined ? 0 : Math.round(base * scaleOf(cmd, scale).eff);
  }
  // f を渡すと、偉人アドバイザーの値引きが入る
  function cmdCost(st, cmd, code, scale, f) { return Math.round(cmdCostBase(st, cmd, code) * scaleOf(cmd, scale).cost * (1 - (f === undefined ? 0 : advBonus(st, f, 'cost')) / 100)); }
  function cmdCostBase(st, cmd, code) {
    const p = st.m[code].pop;
    switch (cmd) {
      case 'ind': case 'care': return Math.round(3 + p * 0.05);
      case 'tour': return Math.round(2 + p * 0.035);
      case 'dis': return Math.round(2 + p * 0.04);
      case 'aid': return Math.round(3 + p * 0.03);
      case 'invite': return Math.round(20 + p * 0.08);
      case 'visit': return 4;
      case 'pact': return 0;
      case 'talk': case 'counter': return Math.round(6 + p * 0.1);
      case 'raise': return Math.round(4 + p * 0.06);
      case 'keep': return Math.round(3 + p * 0.04);
      case 'lure': return st.lure ? st.lure.step : 0;
      case 'run': return Math.round(6 + p * 0.08);
      case 'rally': return Math.round(3 + p * 0.04);
      case 'build': return projAt(code) ? projAt(code).cost : 0;
    }
    return 0;
  }

  function adjacentTo(st, adj, code, f) { return adj[code].some(n => st.m[n].owner === f); }
  function inTalk(t, f) { return !!t && (t.f === f || t.rival === f); }
  function talksOf(st, f) { return Object.keys(st.m).filter(c => inTalk(st.m[c].talk, f)).length; }
  const BID_MAX = 5;
  // ライバルAI：様子見する確率、合併協議を申し入れる賛成の見込み、境目の満足度を守る確率
  const AI_IDLE = 0.1, AI_VOTE = 52, AI_GUARD = 0.5;
  const KEEP_MAX = 3, KEEP_STEP = 5, KEEP_AI = 0.8;

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
    if (ONCE.includes(cmd) && usedThisMonth(st, f, code, cmd)) return { ok: false, reason: `${def.label}は、この市町村では今月もう行いました（同じ市町村には月1回まで）` };
    const cost = cmdCost(st, cmd, code, scale, f);
    if (cmd === 'lure') {
      const L = st.lure;
      if (!L) return { ok: false, reason: '誘致合戦は起きていません' };
      const site = lureSite(st, adj, f);
      if (!site) return { ok: false, reason: `${L.region}圏域とその隣に自陣営の市町村がありません` };
      if (site !== code) return { ok: false, reason: `候補地は${x.owner === f ? 'ほかの市町村' : '自陣営の市町村'}です` };
      if (lureBid(st, f) >= LURE_MAX) return { ok: false, reason: `補助金は${LURE_MAX}段までです` };
      return { ok: true, cost };
    }
    if (cmd === 'aid') {
      if (x.owner === f) return { ok: false, reason: '自陣営です' };
      if (!adjacentTo(st, adj, code, f)) return { ok: false, reason: '自陣営と隣り合っていません' };
      if (!aidable(st, code)) return { ok: false, reason: '災害の被害を受けていません' };
      if (x.aided && x.aided[f] === x.hurt) return { ok: false, reason: 'この被害には支援済みです' };
      return { ok: true, cost };
    }
    if (cmd === 'rally') {
      const r = x.race;
      if (!r || (r.ch !== f && r.inc !== f)) return { ok: false, reason: 'この市町村の首長選挙に候補を立てていません' };
      if (r.rally[f] >= RALLY_MAX) return { ok: false, reason: `演説会は${RALLY_MAX}回までです` };
      return { ok: true, cost };
    }
    if (cmd === 'build') {
      const p = projAt(code), s = p && projState(st, p.id);
      if (!p) return { ok: false, reason: 'この市町村には大型事業の計画がありません' };
      if (x.owner !== f) return { ok: false, reason: '自陣営の市町村だけで着工できます' };
      if (s && s.done) return { ok: false, reason: '完成しています' };
      if (s) return { ok: false, reason: `工事中です（あと${s.left}か月）` };
      const mine = regionCodes(p.region).filter(c => st.m[c].owner === f).length;
      if (mine < projNeed(p)) return { ok: false, reason: `${p.region}圏域に自陣営の市町村が${projNeed(p)}つ以上必要です（いま${mine}）` };
      const busy = projOf(st, f);
      if (busy) return { ok: false, reason: `大型事業は同時に1つまでです（${busy.name}を工事中）` };
      return { ok: true, cost };
    }
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
    if (cmd === 'run') {
      if (x.owner === -1) return { ok: false, reason: '独立の市町村には候補を立てられません（合併協議で迎えます）' };
      const left = electLeft(st, code);
      if (left >= ELECT_WINDOW) return { ok: false, reason: `首長選挙は${dateOf(x.elect).label}。投票日の${ELECT_WINDOW}か月前から候補を立てられます` };
      if (x.race) return { ok: false, reason: x.race.ch === f ? 'すでに候補を立てています' : `${st.factions[x.race.ch].name}が候補を立てています` };
      if (t) return { ok: false, reason: '合併協議の最中は候補を立てられません' };
      if (st.factions[x.owner].capital === code) return { ok: false, reason: '本拠地の首長は陣営の首長本人なので、候補を立てられません' };
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
      if (x.race) return { ok: false, reason: '首長選挙の最中です。投票日のあとに申し入れできます' };
      if (cmd === 'counter') {
        if (!t) return { ok: false, reason: 'ほかの陣営の協議が進んでいません' };
        if (inTalk(t, f)) return { ok: false, reason: '自陣営の協議です' };
        if (t.rival !== undefined) return { ok: false, reason: 'すでに2陣営が競り合っています' };
      }
      if (x.cool[f] > 0) return { ok: false, reason: `否決のため、あと${x.cool[f]}か月は申し入れできません` };
      if (talksOf(st, f) >= talksMax(st, f)) return { ok: false, reason: `同時に進められる協議は${talksMax(st, f)}件までです（陣営の魅力${APPEAL_TALKS[0]}・${APPEAL_TALKS[1]}でそれぞれ1件増えます）` };
      if (x.owner === -1) {
        if (!x.pact.includes(f)) return { ok: false, reason: '先に連携協定を結ぶ必要があります' };
        if (rel < 70) return { ok: false, reason: `関係度が70に届いていません（現在${Math.round(rel)}）` };
      } else {
        if (st.factions[x.owner].capital === code && owned(st, x.owner).length > 3) return { ok: false, reason: '本拠地は、相手陣営の市町村が3つ以下になるまで切り崩せません' };
        const gap = avgSat(st, f) - x.sat;
        if (x.sat >= 45 && gap < 8) return { ok: false, reason: `相手の満足度が45未満に落ちているか、自陣営の平均満足度が相手より8以上高いと切り崩せます（現在 ${Math.round(x.sat)}、差 ${Math.round(gap)}）` };
        if (rel < 60) return { ok: false, reason: `関係度が60に届いていません（現在${Math.round(rel)}）` };
      }
      return { ok: true, cost };
    }
    return { ok: false, reason: '' };
  }

  function doCmd(st, names, f, cmd, code, scale) {
    const x = st.m[code]; const fac = st.factions[f];
    const cost = cmdCost(st, cmd, code, scale, f);
    fac.money -= cost;
    const e = cmdEffect(st, f, cmd, scale), sl = SCALABLE.includes(cmd) && scale !== undefined && scale !== 1 ? `・${SCALES[scale].label}` : '';
    const n = names[code]; const who = f === 0 ? '' : fac.name + 'が';
    if (ONCE.includes(cmd)) markUsed(st, f, code, cmd);
    switch (cmd) {
      case 'ind': x.ind = clamp(x.ind + gainOf(x.ind, e), 0, 100); return `${who}${n}で産業振興（産業力 ${Math.round(x.ind)}${sl}）`;
      case 'tour': x.tour = clamp(x.tour + gainOf(x.tour, e), 0, 100); return `${who}${n}の観光PR（観光力 ${Math.round(x.tour)}${sl}）`;
      case 'care': x.sat = clamp(x.sat + gainOf(x.sat, e), 0, 100); return `${who}${n}で子育て支援（満足度 ${Math.round(x.sat)}${sl}）`;
      case 'dis': x.dis = clamp(x.dis + gainOf(x.dis, e), 0, 100); return `${who}${n}の防災対策（防災力 ${x.dis}${sl}）`;
      case 'invite':
        if (rnd(st) < inviteChance(st, code)) { x.inviteLead = 0; x.ind = clamp(x.ind + 12, 0, 100); x.pop += 1 + x.pop * 0.01; return `${who}${n}への企業誘致に成功（産業力 ${Math.round(x.ind)}）`; }
        x.ind = clamp(x.ind + INVITE_FAIL_IND, 0, 100); x.inviteLead = Math.min(INVITE_LEAD_MAX, (x.inviteLead || 0) + INVITE_LEAD);
        return `${who}${n}への企業誘致は不調（つながりが残り、産業力 ${Math.round(x.ind)}・次は成功しやすい）`;
      case 'aid': {
        st.rel[f][code] = clamp(st.rel[f][code] + AID_REL, 0, 100); x.sat = clamp(x.sat + AID_SAT, 0, 100); x.aided = { ...x.aided, [f]: x.hurt };
        return `${who}${n}に${x.hurtKind || '災害'}の災害支援（関係度 ${Math.round(st.rel[f][code])}）`;
      }
      case 'build': { const p = projAt(code); st.proj = { ...(st.proj || {}), [p.id]: { f, left: p.months } }; return `${who}${n}で大型事業「${p.name}」に着工（${p.months}か月で完成）`; }
      case 'visit': st.rel[f][code] = clamp(st.rel[f][code] + gainOf(st.rel[f][code], e), 0, 100); return `${who}${n}と交流事業（関係度 ${Math.round(st.rel[f][code])}${sl}）`;
      case 'pact': x.pact.push(f); addFeat(st, f, 'pact'); st.rel[f][code] = clamp(st.rel[f][code] + 5, 0, 100); return `${who}${n}と連携協定を締結`;
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
      case 'run': x.race = { ch: f, inc: x.owner, rally: { [f]: 0, [x.owner]: 0 } }; return `${who}${n}の首長選挙に候補を擁立（${dateOf(x.elect).label}投票）`;
      case 'rally': { const r = x.race; r.rally[f]++; return `${who}${n}で${r.ch === f ? '候補の' : '現職の'}演説会（${r.rally[f]}回目）`; }
      case 'lure': {
        const L = st.lure, b = L.bids[f] || (L.bids[f] = { site: code, n: 0, paid: 0 });
        b.site = code; b.n++; b.paid += cost;
        return `${who}${n}への${L.name}の誘致に補助金を上乗せ（${b.n}段・計${b.paid}億円）`;
      }
    }
    return '';
  }

  // AI 1陣営ぶんの行動
  function aiAct(st, adj, names, f) {
    let ap = apMax(st, f) + (st.siege ? 1 : 0);
    // 包囲網のあいだは、ライバル同士では争わない（狙うのは、あなたの陣営と独立の市町村）
    const foe = c => !st.siege || st.m[c].owner <= 0;
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
      const vsMe = (['counter', 'raise', 'keep'].includes(cmd) && !!t0 && (t0.f === 0 || t0.rival === 0)) || (cmd === 'lure' && !!st.lure.bids[0])
        || ((cmd === 'run' || cmd === 'rally') && !!st.m[code].race && (st.m[code].race.ch === 0 || st.m[code].race.inc === 0));
      out.push({ text: doCmd(st, names, f, cmd, code, sc), code, cmd, f, vsMe });
      return true;
    };
    const apRef = { ap };
    for (const t of aiStaff(st, adj, names, f, apRef)) out.push(t);
    ap = apRef.ap;
    // 大型事業：着工できて、お金に余裕があれば、ときどき着工する
    const pj = PROJECTS.find(p => st.m[p.code].owner === f && canDo(st, adj, f, 'build', p.code, ap).ok && fac.money - p.cost > 150);
    if (pj && rnd(st) < 0.3) tryDo('build', pj.code);
    // 誘致合戦：負けていて、見合う額のうちは補助金を上乗せする（決まる月は動かない）
    const lu = st.lure, site = lureSite(st, adj, f);
    if (lu && lu.left >= 2 && site) {
      const cap = Math.min(LURE_MAX, Math.floor(lu.inc * 14 / lu.step));
      for (let i = 0; i < 3 && ap > 0; i++) {
        const best = Math.max(-1, ...lureParts(st, adj).filter(k => k !== f).map(k => lureScore(st, adj, k)));
        if (lureScore(st, adj, f) > best + LURE_PT / 2 || lureBid(st, f) >= cap) break;
        if (fac.money - cmdCost(st, 'lure', site, undefined, f) < 25 || rnd(st) < 0.15 || !tryDo('lure', site)) break;
      }
    }
    // 首長選挙：関わっている選挙で負けそうなら演説会。隣の陣営の市町村は、見込みが立てば候補を立てる
    for (const c in st.m) {
      const r = st.m[c].race;
      if (ap <= 0) break;
      if (!r || (r.ch !== f && r.inc !== f) || r.rally[f] >= RALLY_MAX) continue;
      const e = electExpect(st, r.ch, c), mine = r.ch === f ? e : 100 - e;
      if (mine < 56 && fac.money > cmdCost(st, 'rally', c, undefined, f) * 2 && rnd(st) < AI_RALLY) tryDo('rally', c);
    }
    if (ap >= CMDS.run.ap && rnd(st) < 0.5) {
      const cand = Object.keys(st.m).filter(c => st.m[c].owner >= 0 && st.m[c].owner !== f && foe(c) && electLeft(st, c) < ELECT_WINDOW && electExpect(st, f, c) >= AI_ELECT
        && fac.money > cmdCost(st, 'run', c, undefined, f) * 3 && canDo(st, adj, f, 'run', c, ap).ok).sort((a, b) => electExpect(st, f, b) - electExpect(st, f, a));
      if (cand.length) tryDo('run', cand[0]);
    }
    // 隣り合うほかの陣営の、いちばん高い平均満足度（切り崩されやすさを見る）
    const rivalSat = c => st.factions.reduce((m, o) => o.id !== f && o.alive && adjacentTo(st, adj, c, o.id) ? Math.max(m, avgSat(st, o.id)) : m, 0);
    let guard = 12;
    while (ap > 0 && guard-- > 0) {
      if (rnd(st) < AI_IDLE) { ap--; continue; } // ときどき様子見
      const near = Object.keys(st.m).filter(c => st.m[c].owner !== f && adjacentTo(st, adj, c, f));
      near.sort((a, b) => st.rel[f][b] - st.rel[f][a]);
      const border = near.filter(c => !st.m[c].talk && foe(c));
      if (st.siege) border.sort((a, b) => (st.m[b].owner === 0) - (st.m[a].owner === 0));
      // 合併協議の準備ができていて、お金だけ足りないときは貯める
      const saving = border.some(c => { const r = canDo(st, adj, f, 'talk', c, 99); return !r.ok && r.reason.startsWith('財源') && voteExpect(st, f, c) >= AI_VOTE; });
      let done = false;
      // 災害の予報が出ていれば、ときどき備える（予報の範囲で防災力の低い、人口の多い市町村から）
      if (!saving && st.fc && fac.money > 30 && rnd(st) < 0.5) {
        const area = disArea(st.fc), t = owned(st, f).filter(c => area.includes(c) && st.m[c].dis < 60 && !usedThisMonth(st, f, c, 'dis')).sort((a, b) => st.m[b].pop - st.m[a].pop)[0];
        if (t && tryDo('dis', t)) continue;
      }
      // ときどき、いちばん大きな市町村の魅力を上げる
      if (!saving && fac.money > 40 && rnd(st) < 0.2) {
        const big = owned(st, f).sort((a, b) => st.m[b].pop - st.m[a].pop).find(c => !usedThisMonth(st, f, c, 'ind') || !usedThisMonth(st, f, c, 'tour'));
        if (big && tryDo(st.m[big].ind <= st.m[big].tour + 15 ? 'ind' : 'tour', big)) continue;
      }
      if (fac.money > 0) {
        // 自分の市町村が狙われていれば引き留め
        for (const c of owned(st, f)) {
          const t = st.m[c].talk;
          if (t && !inTalk(t, f) && (t.keep || 0) < KEEP_MAX && fac.money > cmdCost(st, 'keep', c, undefined, f) * 2 && rnd(st) < KEEP_AI && tryDo('keep', c)) { done = true; break; }
        }
        if (done) continue;
        // 切り崩されそうな境目の市町村は、先に満足度を上げる（本拠地を優先）
        const own = owned(st, f);
        const weak = own.filter(c => { const rs = rivalSat(c); return rs && !(c === fac.capital && own.length > 3) && (st.m[c].sat < 47 || rs - st.m[c].sat >= 5); })
          .sort((a, b) => (b === fac.capital) - (a === fac.capital) || st.m[a].sat - st.m[b].sat);
        const weak1 = weak.find(c => !usedThisMonth(st, f, c, 'care'));
        if (weak1 && rnd(st) < AI_GUARD && tryDo('care', weak1)) continue;
        // 独立の動きがあれば、満足度を上げて収める
        const rebel = own.find(c => st.m[c].indep && !usedThisMonth(st, f, c, 'care'));
        if (rebel && rnd(st) < 0.8 && tryDo('care', rebel)) continue;
        // 競り合いで負けていれば上乗せ
        for (const c of near) {
          const t = st.m[c].talk;
          if (t && t.rival !== undefined && inTalk(t, f)) {
            const other = t.f === f ? t.rival : t.f;
            if (t.bids[f] <= t.bids[other] && fac.money > cmdCost(st, 'raise', c, undefined, f) * 2 && rnd(st) < 0.75 && tryDo('raise', c)) { done = true; break; }
          }
        }
        if (!done) for (const c of near) { const t = st.m[c].talk; if (t && t.rival === undefined && t.f !== f && (!st.siege || t.f === 0) && rnd(st) < 0.5 && tryDo('counter', c)) { done = true; break; } }
        // 合併協議は、賛成の見込みが立つ相手にだけ申し入れる
        if (!done) for (const c of border) { if (voteExpect(st, f, c) >= AI_VOTE && tryDo('talk', c)) { done = true; break; } }
        if (!done) for (const c of near) { if (st.m[c].owner === -1 && tryDo('pact', c)) { done = true; break; } }
        if (!done && fac.money > 12) {
          // 自陣営の協議で見込みが低ければ、まずそこと交流する
          const free = c => !usedThisMonth(st, f, c, 'visit');
          const t = near.find(c => free(c) && st.m[c].talk && st.m[c].talk.f === f && voteExpect(st, f, c) < 60 && st.rel[f][c] < 100)
            || near.find(c => free(c) && st.m[c].owner === -1 && st.rel[f][c] < 95) || near.find(c => free(c) && st.m[c].owner !== -1 && foe(c) && st.rel[f][c] < 80);
          if (t && tryDo('visit', t)) done = true;
        }
      }
      if (!done) {
        const careFree = c => !usedThisMonth(st, f, c, 'care');
        const mine = owned(st, f).filter(careFree).sort((a, b) => st.m[a].sat - st.m[b].sat);
        const big = owned(st, f).filter(careFree).sort((a, b) => st.m[b].pop - st.m[a].pop);
        if (mine.length && st.m[mine[0]].sat < 48 && tryDo('care', mine[0])) done = true;
        else if (fac.money > 60 && big.length && st.m[big[0]].sat < 66 && tryDo('care', big[0])) done = true;
        else if (!saving && fac.money > 80 && tryDo('invite', fac.capital)) done = true;
        else if (!saving && fac.money > 30 && tryDo('ind', fac.capital)) done = true;
      }
      if (!done) break;
    }
    return out;
  }

  function offerScore(st, f, code, bid) {
    return st.rel[f][code] + (avgSat(st, f) - st.m[code].sat) * 0.5 + appealVote(st, f, code) + advVote(st, f, code) + bid * 8 + rnd(st) * 6;
  }
  // 偉人アドバイザーによる住民投票の賛成の上乗せ
  function advVote(st, f, code) { const o = st.m[code].owner; return advBonus(st, f, 'vote') + (o >= 0 && o !== f ? advBonus(st, f, 'steal') : 0); }
  // 住民投票の賛成率の見込み（乱数の分を除く）
  function voteExpect(st, f, code, bonus) {
    const x = st.m[code];
    let yes = 50 + (avgSat(st, f) - x.sat) * 0.4 + (st.rel[f][code] - 70) * 0.6 + (bonus || 0) + roleVal(st, f, 'nego') / 12 + appealVote(st, f, code) + advVote(st, f, code);
    if (x.pop > totalPop(st, f) * 0.7) yes -= 15;
    if (x.owner !== -1) yes -= 8;
    return yes;
  }
  function voteFor(st, f, code, bonus) {
    const x = st.m[code];
    const yes = clamp(voteExpect(st, f, code, bonus) + (rnd(st) * 20 - 10), 4, 96);
    const turnout = 0.42 + rnd(st) * 0.25;
    const voters = Math.round(x.pop * 1000 * 0.82);
    const cast = Math.round(voters * turnout);
    const y = Math.round(cast * yes / 100);
    return { yes: y, no: cast - y, turnout, pass: y > cast - y };
  }

  // 住民投票の決戦：見込みが30〜70％の自陣営の住民投票は、月を終える前に画面の陣取りで決める
  // （ボットで測ると圏域制覇で約10回・県内統一で約22回。80％まで広げるとほぼ毎回になる）
  // 決戦の結果は協議に書いておき、月末の住民投票は乱数の代わりにそれを使う。書いていなければ今まで通り（おまかせ・ボット）
  const BATTLE_MIN = 30, BATTLE_MAX = 70;
  function battleExpect(st, code) {
    if (raceDue(st, code)) return electMine(st, code);
    const x = st.m[code], t = x.talk;
    const keep = x.owner >= 0 && x.owner !== 0 ? (t.keep || 0) : 0;
    return voteExpect(st, 0, code, -keep * KEEP_STEP);
  }
  // この月末に住民投票になる自陣営の協議のうち、決戦にするもの（競り合いは除く）
  function battlesDue(st) {
    return Object.keys(st.m).filter(c => {
      if (raceDue(st, c)) { const e = electMine(st, c); return !st.m[c].race.battle && e >= BATTLE_MIN && e <= BATTLE_MAX; }
      const t = st.m[c].talk;
      if (!t || t.f !== 0 || t.left !== 1 || t.rival !== undefined || t.battle) return false;
      const e = battleExpect(st, c);
      return e >= BATTLE_MIN && e <= BATTLE_MAX;
    });
  }
  function setBattle(st, code, r) {
    if (raceDue(st, code)) { st.m[code].race.battle = { yes: r.yes, no: r.no, turnout: r.turnout }; return; }
    const t = st.m[code].talk;
    if (t && t.f === 0) t.battle = { yes: r.yes, no: r.no, turnout: r.turnout };
  }

  // 月を終える
  function endTurn(st, adj, names) {
    const res = { votes: [], news: [], steps: [], lures: [], joins: [], elects: [] };
    if (st.over) return res;
    ensureStaff(st);
    ensureAdv(st);
    ensureElect(st);
    // 圏域の方針で、自陣営の内政を自動で行う
    runPolicies(st, names);
    // ライバルの行動
    for (const fac of st.factions) {
      if (!fac.ai || !fac.alive) continue;
      for (const t of aiAct(st, adj, names, fac.id)) {
        const vsMine = t.cmd === 'run' && st.m[t.code].owner === 0;
        addLog(st, t.text, vsMine ? 'bad' : 'rival');
        if (vsMine) res.news.push(`${names[t.code]}に対立候補`);
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
      const b = !contest && f === 0 ? t.battle : null;
      const v = b ? { yes: b.yes, no: b.no, turnout: b.turnout, pass: b.yes > b.no, battle: true } : voteFor(st, f, c, (contest ? contest.bids[f] * 3 : 0) - keep * KEEP_STEP);
      if (contest) v.contest = contest;
      if (keep) v.keep = keep;
      const prev = x.owner;
      x.talk = null;
      const fac = st.factions[f];
      if (v.pass) {
        addFeat(st, f, 'merge'); if (prev >= 0) addFeat(st, f, 'steal');
        x.owner = f; x.pact = []; x.sat = clamp(x.sat - 8, 0, 100); x.mergedAt = st.turn;
        for (const k of owned(st, f)) if (k !== c) st.m[k].sat = clamp(st.m[k].sat - 1, 0, 100);
        st.rel[f][c] = 60;
        const joined = staffOnMerge(st, names, c, f, prev);
        if (joined.length) { v.joined = joined; addLog(st, `${names[c]}ゆかりの${joined.join('・')}が${f === 0 ? 'あなたの陣営' : fac.name}に加わりました`, f === 0 ? 'good' : 'rival'); }
        addLog(st, `住民投票で${names[c]}が${f === 0 ? 'あなたの陣営' : fac.name}への編入を可決`, f === 0 ? 'good' : (prev === 0 ? 'bad' : 'rival'));
        loseTown(st, names, prev);
      } else {
        x.cool[f] = 2; st.rel[f][c] = clamp(st.rel[f][c] - 20, 0, 100);
        addLog(st, `${names[c]}の住民投票は否決（${f === 0 ? 'あなたの陣営' : fac.name}との合併）`, f === 0 ? 'bad' : 'rival');
      }
      if (f === 0 || prev === 0 || (contest && contest.loser === 0)) res.votes.push({ code: c, f, prev, ...v });
      res.steps.push({ kind: 'vote', code: c, f, prev, ...v });
    }
    // 首長選挙の開票
    tickElections(st, names, res);
    // 誘致合戦の決着
    tickLure(st, adj, names, res);
    // 小さくなったライバルの合流
    tickJoin(st, adj, names, res);
    // 月を進める
    st.turn++;
    const d = dateOf(st.turn);
    // 季節・ランダムのイベント
    events(st, names, d.month, res);
    tickProjects(st, names, res);
    tickSiege(st, adj, names, res);
    if (!st.choice && st.turn >= 4 && !(st.choiceNext > st.turn) && rnd(st) < CHOICE_P) {
      st.choice = pickChoice(st);
      if (st.choice) { st.choiceNext = st.turn + CHOICE_GAP; res.choice = true; }
    }
    if (!st.lure && st.turn >= (st.lureNext || 3) && rnd(st) < LURE_P) startLure(st, adj, names, res);
    // 収入と住民の変化
    for (const fac of st.factions) {
      if (!fac.alive) continue;
      const inc = factionIncome(st, fac.id, d.month) - upkeep(st, fac.id);
      fac.money += inc;
      if (fac.id === 0) res.income = inc;
      // 赤字で、このままだと3か月以内に財源が尽きそうなら知らせる
      if (fac.id === 0 && inc < 0 && fac.money + inc * 3 < 0) {
        const pay = staffUpkeep(st, 0);
        addLog(st, `収支が赤字です（月−${-inc}億円）。${pay ? `役職の給与が月${pay}億円かかっています。人材の画面で役職を外すと給与が減ります。` : ''}財源のマイナスが3か月続くと財政破綻です`, 'bad');
        res.news.push('赤字に注意');
      }
      fac.negMonths = fac.money < 0 ? fac.negMonths + 1 : 0;
    }
    for (const c in st.m) {
      const x = st.m[c];
      const target = x.owner === -1 ? 54 : 50;
      x.sat += (target - x.sat) * 0.04;
      if (x.owner >= 0 && st.factions[x.owner].money < 0) x.sat -= 3;
      if (x.owner >= 0) x.sat += advBonus(st, x.owner, 'sat');
      x.sat = clamp(x.sat, 0, 100);
      // 人口はゆるやかに減る。満足度と産業力が高いと減り方が小さく、十分高ければ増える
      x.pop = Math.max(0.3, x.pop * (1 + (x.sat - 60 + (x.ind - 50) * 0.2) * 0.00004));
      if (x.owner >= 0) x.pop = Math.max(0.3, x.pop * (1 - outflow(x)));
      const fi = floorInd(c), ft = floorTour(c);
      if (x.ind > fi) x.ind -= (x.ind - fi) * DECAY;
      if (x.tour > ft) x.tour -= (x.tour - ft) * DECAY;
      for (const k in x.cool) if (x.cool[k] > 0) x.cool[k]--;
      for (let f = 0; f < st.factions.length; f++) {
        if (x.owner === f) continue;
        if (st.factions[f].alive && adjacentTo(st, adj, c, f)) st.rel[f][c] = clamp(st.rel[f][c] + appealRel(st, f, c) + advBonus(st, f, 'rel'), 0, 100);
        if (x.pact.includes(f)) st.rel[f][c] = clamp(st.rel[f][c] + 3, 0, 100);
        else if (st.rel[f][c] > 35) st.rel[f][c] -= 0.5;
      }
    }
    // 満足度の低い市町村の独立の動き
    independence(st, names, res);
    // 偉人アドバイザーの入れ替わり
    tickAdvisors(st, names, d, res);
    // 勝敗
    const me = st.factions[0];
    const mine = owned(st, 0);
    if (st.m[me.capital].owner !== 0) st.over = { win: false, text: `本拠地の${names[me.capital]}がほかの陣営に移りました。` };
    else if (me.negMonths >= 3) st.over = { win: false, text: '財源のマイナスが3か月続き、財政破綻となりました。' };
    else if (avgSat(st, 0) < 20) st.over = { win: false, text: '住民満足度が20を下回り、リコールが成立しました。' };
    else if (mine.length === Object.keys(st.m).length) st.over = { win: true, text: `${d.label}、岐阜県42市町村の統一を達成しました。` };
    else if (st.mode === 'region' && goalOf(st).codes.every(c => st.m[c].owner === 0)) {
      const n = goalOf(st).codes.length;
      st.over = { win: true, region: st.goal, text: `${d.label}、${st.goal}圏域${n}市町村の制覇を達成しました（${st.turn}か月）。` };
    }
    // 圏域制覇の知らせ
    st.regionsDone = st.regionsDone || [];
    for (const r of REGIONS) {
      if (st.regionsDone.includes(r)) continue;
      const cs = Object.keys(st.m).filter(c => INFO[c][0] === r);
      if (cs.every(c => st.m[c].owner === 0)) { st.regionsDone.push(r); addLog(st, `${r}圏域をすべて自陣営にしました`, 'good'); res.news.push(`${r}圏域を制覇`); }
    }
    st.used = {};
    st.ap = apMax(st, 0);
    return res;
  }

  // 独立の動き：満足度が INDEP_SAT を下回ると始まり、CALM_SAT 以上に戻れば収まる。期限が来たら独立を問う住民投票
  function independence(st, names, res) {
    const nm = f => f === 0 ? 'あなたの陣営' : st.factions[f].name;
    for (const c in st.m) {
      const x = st.m[c], f = x.owner;
      if (f < 0 || st.factions[f].capital === c) { delete x.indep; continue; }
      if (!x.indep) {
        if (x.sat < INDEP_SAT && !(x.indepRest > st.turn)) {
          x.indep = { left: INDEP_MONTHS };
          addLog(st, `${names[c]}で独立を求める声が上がりました。${INDEP_MONTHS}か月のうちに満足度を${CALM_SAT}以上に戻さないと、独立を問う住民投票になります（${nm(f)}）`, f === 0 ? 'bad' : 'info');
          if (f === 0) { res.news.push(`${names[c]}で独立の動き`); res.steps.push({ kind: 'event', code: c, text: `${names[c]}で独立を求める声`, tone: 'warn' }); }
        }
        continue;
      }
      if (x.sat >= CALM_SAT) {
        delete x.indep; x.indepRest = st.turn + INDEP_REST;
        addLog(st, `${names[c]}の独立の動きは収まりました`, f === 0 ? 'good' : 'info');
        if (f === 0) res.news.push(`${names[c]}の独立の動きが収まる`);
        continue;
      }
      if (--x.indep.left > 0) continue;
      // 住民投票：満足度が低いほど賛成が多い
      const yes = clamp(55 + (INDEP_SAT - x.sat) + (rnd(st) * 10 - 5), 20, 90), pass = yes > 50;
      delete x.indep; x.indepRest = st.turn + INDEP_REST;
      if (pass) {
        x.owner = -1; x.talk = null; x.race = null; x.pact = x.pact.filter(k => k !== f);
        st.rel[f][c] = Math.min(st.rel[f][c], 30); x.sat = clamp(x.sat + 10, 0, 100);
        addLog(st, `${names[c]}の住民投票で独立が決まりました（賛成${yes.toFixed(1)}％）。${nm(f)}を離れ、独立した市町村に戻りました`, f === 0 ? 'bad' : 'rival');
        if (f === 0) res.news.push(`${names[c]}が独立`);
        res.steps.push({ kind: 'event', code: c, text: `${names[c]}が${nm(f)}から独立（賛成${Math.round(yes)}％）`, tone: f === 0 ? 'bad' : 'warn' });
      } else {
        addLog(st, `${names[c]}の独立を問う住民投票は否決されました（賛成${yes.toFixed(1)}％）`, f === 0 ? 'good' : 'info');
        if (f === 0) res.news.push(`${names[c]}の独立は否決`);
      }
    }
  }

  // 圏域を制覇したあと、そのまま県内統一を目指して続ける
  function continueToUnify(st) {
    if (!st.over || !st.over.win || st.mode !== 'region') return;
    st.mode = 'unify'; st.over = null;
    addLog(st, `${st.goal}圏域の制覇に続き、県内42市町村の統一を目指します`, 'info');
  }

  function events(st, names, month, res) {
    const codes = Object.keys(st.m);
    const ownerName = c => st.m[c].owner === 0 ? '（自陣営）' : '';
    // 季節の行事（観光収入は収入計算で反映）
    const fest = { 4: '高山祭（春）でにぎわっています', 10: '高山祭（秋）でにぎわっています' };
    if (fest[month]) addLog(st, `高山市は${fest[month]}`, 'season');
    if (month === 5) addLog(st, '長良川鵜飼が開幕。岐阜市・関市の観光収入が伸びます', 'season');
    if (month === 8) { st.m['21219'].sat = clamp(st.m['21219'].sat + 5, 0, 100); addLog(st, '郡上おどりが最高潮。郡上市の満足度が上がりました', 'season'); }
    // 災害：予報の出ていた災害が来る。そのあと、来月の分の予報を出す
    if (st.fc && st.fc.turn <= st.turn) { disaster(st, names, st.fc, res); st.fc = null; }
    forecast(st, names, res);
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

  // 来月が災害の季節なら、ときどき予報を出す。豪雨は、あなたの陣営の市町村がある圏域に出やすい
  function forecast(st, names, res) {
    const next = dateOf(st.turn + 1);
    for (const kind in DISASTERS) {
      const D = DISASTERS[kind];
      if (st.fc || !D.months.includes(next.month) || rnd(st) >= D.p) continue;
      let region = null;
      if (kind === '豪雨') {
        const regs = REGIONS.filter(r => r !== '飛騨'), w = r => regionCodes(r).some(c => st.m[c].owner === 0) ? 3 : 1;
        let k = rnd(st) * regs.reduce((a, r) => a + w(r), 0);
        region = regs.find(r => (k -= w(r)) < 0) || regs[regs.length - 1];
      }
      st.fc = { kind, region, turn: st.turn + 1 };
      const mine = disArea(st.fc).filter(c => st.m[c].owner === 0), where = disLabel(st.fc);
      addLog(st, `予報：${next.label}、${where}で${kind}の恐れ。${mine.length ? `自陣営の${mine.map(c => names[c]).join('・')}は、今月のうちに防災対策で備えられます` : ''}`, mine.length ? 'bad' : 'info');
      if (mine.length) { res.news.push(`来月 ${where}で${kind}の恐れ`); res.steps.push({ kind: 'event', code: mine[0], text: `来月、${where}で${kind}の恐れ`, tone: 'warn' }); }
    }
  }
  // 予報の範囲の市町村を、それぞれ DIS_HIT の確率で襲う。防災力の％で被害を防ぐ
  function disaster(st, names, fc, res) {
    const area = disArea(fc), kind = fc.kind;
    let hits = area.filter(() => rnd(st) < DIS_HIT);
    if (!hits.length) hits = [area[Math.floor(rnd(st) * area.length)]];
    const lost = [], saved = [];
    for (const c of hits) {
      const x = st.m[c];
      if (rnd(st) * 100 > x.dis) {
        x.sat = clamp(x.sat - DIS_SAT, 0, 100);
        if (x.owner >= 0) st.factions[x.owner].money -= Math.round(2 + x.pop * 0.02);
        x.hurt = st.turn; x.hurtKind = kind;
        lost.push(c);
        res.steps.push({ kind: 'event', code: c, text: `${kind}で${names[c]}に被害`, tone: 'bad' });
      } else {
        x.sat = clamp(x.sat + DIS_SAVE, 0, 100);
        saved.push(c);
        res.steps.push({ kind: 'event', code: c, text: `${kind}が${names[c]}を襲うも、備えで被害なし`, tone: 'good' });
      }
    }
    const nm = cs => cs.map(c => names[c] + (st.m[c].owner === 0 ? '（自陣営）' : '')).join('・');
    const myLost = lost.filter(c => st.m[c].owner === 0), mySaved = saved.filter(c => st.m[c].owner === 0);
    addLog(st, `${kind}が${disLabel(fc)}を襲いました。${lost.length ? `被害：${nm(lost)}（満足度と財源が下がりました）。` : ''}${saved.length ? `備えで防いだ：${nm(saved)}` : ''}`, myLost.length ? 'bad' : mySaved.length ? 'good' : 'info');
    if (myLost.length) res.news.push(`${myLost.map(c => names[c]).join('・')}で${kind}の被害`);
    else if (mySaved.length) res.news.push(`${kind}の被害を防いだ`);
  }


  const api = { seasonTags, FLOW_SAT, INDEP_SAT, CALM_SAT, INDEP_MONTHS, outflow, DISASTERS, DIS_SAT, AID_REL, AID_SAT, AID_MONTHS, disArea, disLabel, aidable, INVITE_FAIL_IND, INVITE_LEAD, inviteChance, ELECT_TERM, ELECT_WINDOW, RALLY_STEP, RALLY_MAX, ensureElect, electLeft, electExpect, electMine, raceDue, BATTLE_MIN, BATTLE_MAX, battleExpect, battlesDue, setBattle, JOIN_TOWNS, JOIN_RATIO, JOIN_SAT, AI_GUARD, voteExpect, AI_IDLE, FIRMS, LURE_MONTHS, LURE_PT, LURE_MAX, firmInc, sitePoint, lureSite, lureBid, lureScore, lureParts, lureRows, ADVISORS, ADV_BY_ID, ADV_MONTHS, ADV_COOL, ADV_SLOT2, ensureAdv, advCond, advMeasure, advOf, advFx, advBonus, advMax, advUsed, advHolder, canInviteAdv, inviteAdv, advise, advVote, regionLength, talksMax, APPEAL_TALKS, appeal, appealOf, appealRel, appealVote, INFO, REGIONS, MODES, regionCodes, goalOf, continueToUnify, CMDS, dateOf, difficultyOf, newGame, owned, apMax, totalPop, avgSat, incomeOf,
    factionIncome, grantOf, tagInfo, upkeep, cmdCost, cmdEffect, SCALES, SCALABLE, gradeOf, GRADE_PAY, faceOf, SCOUT, canScout, scout, ROLES, ABIL, ensureStaff, staffOf, staffMax, abil, roleVal, hireCandidates, hireCost, canHire, hire, dismiss, assignRole, autoAssign, staffUpkeep, aiStaff, inTalk, BID_MAX, KEEP_MAX, KEEP_STEP, canDo, doCmd, endTurn, adjacentTo, talksOf, seasonX, clamp,
    ONCE, SOFT, gainOf, usedThisMonth, AP_CAP, PROJECTS, PROJ_TOWNS, projAt, projState, projOf, projNeed, projFx, POLICIES, POLICY_TOWNS, POLICY_RESERVE, POLICY_MIN, policyReady, policyTowns, setPolicy,
    SIEGE_ON, SIEGE_OFF, SIEGE_REL, popShare, choiceView, applyChoice };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.GameLogic = api;
})(typeof window !== 'undefined' ? window : globalThis);
