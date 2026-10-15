// 岐阜統一戦記 効果音
// 音のファイルは使わず、Web Audio でその場で作る。メニューの「効果音」がオンのときだけ鳴らす（最初はオフ）。
// iPhone などは、画面に触れるまで音を出せないので、最初に触れたときに音の準備をする。
// 音は聴き比べページで選んだもの：木琴・オルゴールの「やわらか」を中心に、残り10秒だけ控えめな「落ち着き」。
// わるい結果・被害・防いだ・決着は、やわらかな音色で個別に作った音。
// 使い方: Sfx.play('up')  鳴らせる音は SOUNDS を参照。Sfx.set(true) でオン
(function (root) {
  'use strict';
  let ctx = null, master = null, enabled = false;
  function ac() {
    if (!ctx) {
      const C = root.AudioContext || root.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain(); master.gain.value = 0.6; master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  // 波：高さ f、始まり at（秒後）、長さ dur、大きさ vol。to で高さをすべらせる、atk で立ち上がりをゆっくりに
  function osc(t, o) {
    const s = t + (o.at || 0), d = o.dur;
    const n = ctx.createOscillator(); n.type = o.type || 'sine'; n.frequency.setValueAtTime(o.f, s);
    if (o.to) n.frequency.exponentialRampToValueAtTime(o.to, s + (o.glide || d));
    const g = ctx.createGain(); g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(o.vol || 0.2, s + (o.atk || Math.min(0.008, d / 4)));
    g.gain.exponentialRampToValueAtTime(0.0001, s + d);
    n.connect(g); g.connect(master); n.start(s); n.stop(s + d + 0.05);
  }
  // ざっという音（紙をめくる音の芯）。f から fTo へ帯域を動かせる
  function noise(t, o) {
    const s = t + (o.at || 0), d = o.dur, len = Math.max(1, Math.floor(ctx.sampleRate * d));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate), ch = buf.getChannelData(0);
    for (let i = 0; i < len; i++) ch[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const f = ctx.createBiquadFilter(); f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 1200, s);
    if (o.fTo) f.frequency.exponentialRampToValueAtTime(o.fTo, s + d);
    f.Q.value = o.q || 0.8;
    const g = ctx.createGain();
    if (o.atk) { g.gain.setValueAtTime(0.0001, s); g.gain.exponentialRampToValueAtTime(o.vol || 0.2, s + o.atk); } else g.gain.setValueAtTime(o.vol || 0.2, s);
    g.gain.exponentialRampToValueAtTime(0.0001, s + d);
    src.connect(f); f.connect(g); g.connect(master); src.start(s); src.stop(s + d + 0.05);
  }

  // ---------- 楽器と音階 ----------
  // deg は音階の何番目か（音階の長さを超えると1オクターブ上、負なら下）。m を付けると短調
  const SCALE = { major: [0, 2, 4, 5, 7, 9, 11], minor: [0, 2, 3, 5, 7, 8, 10] };
  const freqOf = (base, sc, d) => { const n = sc.length, o = Math.floor(d / n), k = ((d % n) + n) % n; return base * Math.pow(2, (sc[k] + 12 * o) / 12); };
  const INSTR = {
    // やわらか：木琴・オルゴール・木の音
    soft: { base: 523.25,
      note: (t, f, at, dur, v) => { osc(t, { f, at, dur: dur + 0.25, vol: v * 0.42 }); osc(t, { f: f * 4, at, dur: 0.09, vol: v * 0.12 }); },
      hit: (t, at, v) => { osc(t, { f: 880, at, dur: 0.06, vol: v * 0.35 }); osc(t, { f: 880 * 2.9, at, dur: 0.03, vol: v * 0.1 }); },
      low: (t, at, v) => osc(t, { f: 90, to: 62, at, dur: 0.45, vol: v * 0.6 }),
      swish: (t, at, d, v) => noise(t, { at, dur: d, vol: v * 0.18, type: 'lowpass', f: 1400, fTo: 500 }),
      bell: (t, f, at, dur, v) => { osc(t, { f: f * 2, at, dur: dur + 0.6, vol: v * 0.3 }); osc(t, { f: f * 6.02, at, dur: 0.25, vol: v * 0.06 }); } },
    // 落ち着き：控えめなチャイム
    calm: { base: 392,
      note: (t, f, at, dur, v) => { osc(t, { f, at, dur: dur + 0.5, vol: v * 0.3, atk: 0.02 }); osc(t, { f: f * 2, at, dur: dur + 0.2, vol: v * 0.06, atk: 0.02 }); } }
  };
  // 場面ごとの鳴り方の型。v.n(deg, 始まり, 長さ, 大きさ, 短調か) / v.bell(deg, …) / v.hit(始まり, 大きさ) / v.low(…) / v.swish(始まり, 長さ, 大きさ)
  const PATTERNS = {
    tap: v => v.hit(0, 0.5),
    up: v => { v.n(2, 0, 0.09, 0.7); v.n(4, 0.08, 0.16, 0.7); },
    nope: v => { v.n(-2, 0, 0.08, 0.5, true); v.n(-4, 0.08, 0.12, 0.5, true); },
    month: v => { v.swish(0, 0.26, 0.8); v.n(0, 0.14, 0.2, 0.45); },
    stamp: v => { v.low(0, 0.9); v.hit(0, 0.8); },
    pass: v => { v.n(0, 0, 0.14, 0.6); v.n(2, 0.09, 0.14, 0.6); v.n(4, 0.18, 0.18, 0.6); v.bell(7, 0.27, 0.6, 0.7); },
    warn: v => { v.bell(5, 0, 0.18, 0.7); v.bell(3, 0.2, 0.25, 0.7); },
    drum: v => { v.low(0, 1); v.hit(0, 0.4); v.low(0.24, 0.75); },
    send: v => { v.n(3, 0, 0.05, 0.5); v.n(5, 0.05, 0.07, 0.5); },
    capture: v => { v.n(4, 0, 0.07, 0.6); v.n(7, 0.06, 0.07, 0.6); v.n(9, 0.12, 0.14, 0.6); },
    lost: v => { v.n(4, 0, 0.09, 0.55, true); v.n(1, 0.09, 0.2, 0.55, true); },
    skill: v => { v.bell(7, 0, 0.25, 0.6); v.n(9, 0.08, 0.15, 0.4); },
    tick: v => v.n(9, 0, 0.03, 0.35)
  };
  const SCALE_OF = m => m ? SCALE.minor : SCALE.major;
  function voice(fam, t) {
    const I = INSTR[fam], deg = (d, m) => freqOf(I.base, SCALE_OF(m), d);
    return {
      n: (d, at, dur, v, m) => I.note(t, deg(d, m), at, dur, v),
      bell: (d, at, dur, v) => I.bell(t, deg(d), at, dur, v),
      hit: (at, v) => I.hit(t, at, v),
      low: (at, v) => I.low(t, at, v),
      swish: (at, d, v) => I.swish(t, at, d, v)
    };
  }

  // ---------- 個別に作った音（わるい結果・被害・防いだ・決着） ----------
  const mar = (t, f, at, dur, v) => { osc(t, { f, at, dur: dur + 0.25, vol: v * 0.42 }); osc(t, { f: f * 4, at, dur: 0.09, vol: v * 0.12 }); }; // 木琴
  const box = (t, f, at, dur, v) => { osc(t, { f, at, dur: dur + 0.5, vol: v * 0.3 }); osc(t, { f: f * 3.01, at, dur: 0.22, vol: v * 0.05 }); }; // オルゴール
  const sbell = (t, f, at, dur, v) => { for (const [k, w] of [[1, 1], [2.0, 0.35], [2.76, 0.25], [4.07, 0.1]]) osc(t, { f: f * k, at, dur: dur * (1.3 - k / 8), vol: v * 0.3 * w, atk: 0.005 }); }; // やわらかい鐘
  const pad = (t, f, at, dur, v) => osc(t, { f, at, dur, vol: v * 0.28, atk: Math.min(0.08, dur / 3) }); // のばす音
  const N = { E4: 329.63, G4: 392, Bb4: 466.16, B4: 493.88, C5: 523.25, Cs5: 554.37, E5: 659.25, G5: 783.99, A5: 880, C6: 1046.5, Fs6: 1479.98 };
  const OWN = {
    // 宙ぶらりん：落ち着かない音で止まる（まだ次がある）
    fail: t => { mar(t, N.C5, 0, 0.18, 0.55); mar(t, N.Bb4, 0.22, 0.2, 0.55); pad(t, N.Bb4, 0.22, 1.1, 0.6); pad(t, N.E4, 0.22, 1.1, 0.35); },
    // 半鐘：G5（半拍）→ C#5（1拍）→ G4（1拍）。1拍0.28秒
    hurt: t => { sbell(t, N.G5, 0, 0.35, 0.6); sbell(t, N.Cs5, 0.14, 0.5, 0.55); sbell(t, N.G4, 0.42, 1.1, 0.55); },
    // きらり：オルゴールが B4・G5・A5・F#6 と駆け上がる
    saved: t => { [N.B4, N.G5, N.A5, N.Fs6].forEach((f, i) => box(t, f, i * 0.06, 0.15, 0.45)); },
    // 小さなファンファーレ：木琴が転がって、和音でのばす
    gong: t => { [N.C5, N.E5, N.G5].forEach((f, i) => mar(t, f, i * 0.08, 0.15, 0.5)); [N.C5, N.E5, N.G5, N.C6].forEach(f => pad(t, f, 0.32, 1.2, 0.45)); }
  };
  // どの音をどの楽器で鳴らすか（残り10秒だけ落ち着き、ほかはやわらか）
  const FAM_OF = { tick: 'calm' };
  const SOUNDS = {};
  for (const k in PATTERNS) SOUNDS[k] = t => PATTERNS[k](voice(FAM_OF[k] || 'soft', t));
  Object.assign(SOUNDS, OWN);

  function play(name) {
    if (!enabled || !SOUNDS[name] || !ac()) return;
    try { SOUNDS[name](ctx.currentTime + 0.02); } catch (e) { /* 鳴らなくても遊べる */ }
  }
  // 画面に触れたときに、止まっている音の準備を動かす（iPhone は触れたときでないと音を出せない）
  for (const ev of ['pointerdown', 'touchend', 'keydown']) root.addEventListener(ev, () => { if (enabled) ac(); }, { capture: true, passive: true });
  root.Sfx = { play, set(on) { enabled = !!on; if (enabled) ac(); }, get on() { return enabled; } };
})(window);
