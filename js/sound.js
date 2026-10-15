// 岐阜統一戦記 効果音
// 音のファイルは使わず、Web Audio でその場で音を作る。メニューの「効果音」がオンのときだけ鳴らす（最初はオフ）。
// iPhone などは、画面に触れるまで音を出せないので、最初に触れたときに音の準備をする。
// 使い方: Sfx.play('up')  鳴らせる音は SOUNDS を参照。Sfx.set(true) でオン
(function (root) {
  'use strict';
  let ctx = null, master = null, enabled = false;
  function ac() {
    if (!ctx) {
      const C = root.AudioContext || root.webkitAudioContext;
      if (!C) return null;
      ctx = new C();
      master = ctx.createGain(); master.gain.value = 0.5; master.connect(ctx.destination);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  }
  // 音の部品：高さ（Hz）、始まり（秒後）、長さ、波の形、大きさ。to を渡すと高さをすべらせる
  function tone(t, freq, at, dur, type, vol, to) {
    const o = ctx.createOscillator(), g = ctx.createGain(), s = t + at;
    o.type = type || 'sine'; o.frequency.setValueAtTime(freq, s);
    if (to) o.frequency.exponentialRampToValueAtTime(to, s + dur);
    g.gain.setValueAtTime(0.0001, s);
    g.gain.exponentialRampToValueAtTime(vol || 0.2, s + Math.min(0.012, dur / 4));
    g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
    o.connect(g); g.connect(master); o.start(s); o.stop(s + dur + 0.02);
  }
  // ざっという音（紙をめくる・雨・判を押す音の芯）。freq で帯域をしぼる
  function noise(t, at, dur, vol, freq, q) {
    const n = Math.floor(ctx.sampleRate * dur), buf = ctx.createBuffer(1, n, ctx.sampleRate), d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), s = t + at;
    src.buffer = buf; f.type = 'bandpass'; f.frequency.value = freq || 1200; f.Q.value = q || 0.8;
    g.gain.setValueAtTime(vol || 0.2, s); g.gain.exponentialRampToValueAtTime(0.0001, s + dur);
    src.connect(f); f.connect(g); g.connect(master); src.start(s); src.stop(s + dur + 0.02);
  }
  const chord = (t, at, fs, dur, type, vol) => fs.forEach((f, i) => tone(t, f, at + i * 0.04, dur, type, vol));
  const SOUNDS = {
    tap: t => tone(t, 880, 0, 0.05, 'sine', 0.06),
    nope: t => tone(t, 220, 0, 0.12, 'square', 0.04, 180),
    up: t => { tone(t, 587, 0, 0.09, 'triangle', 0.14); tone(t, 880, 0.07, 0.14, 'triangle', 0.14); },
    month: t => { noise(t, 0, 0.22, 0.12, 2400, 0.6); tone(t, 392, 0.12, 0.18, 'sine', 0.08); },
    pass: t => { chord(t, 0, [523, 659, 784], 0.5, 'triangle', 0.1); tone(t, 1047, 0.18, 0.5, 'sine', 0.06); },
    fail: t => { chord(t, 0, [220, 262, 330], 0.6, 'sine', 0.1); tone(t, 165, 0.1, 0.6, 'triangle', 0.08); },
    stamp: t => { tone(t, 140, 0, 0.18, 'sine', 0.35, 60); noise(t, 0, 0.08, 0.2, 600, 1); },
    warn: t => { tone(t, 880, 0, 0.14, 'square', 0.05); tone(t, 660, 0.18, 0.18, 'square', 0.05); },
    hurt: t => { noise(t, 0, 0.5, 0.18, 300, 0.7); tone(t, 110, 0, 0.45, 'sine', 0.15, 70); },
    saved: t => { tone(t, 659, 0, 0.1, 'triangle', 0.1); tone(t, 988, 0.08, 0.22, 'triangle', 0.1); },
    drum: t => { tone(t, 120, 0, 0.35, 'sine', 0.45, 55); noise(t, 0, 0.06, 0.15, 400, 1); tone(t, 120, 0.22, 0.3, 'sine', 0.3, 55); },
    send: t => tone(t, 520, 0, 0.08, 'triangle', 0.08, 780),
    capture: t => { tone(t, 660, 0, 0.08, 'square', 0.06); tone(t, 990, 0.07, 0.16, 'square', 0.06); },
    lost: t => { tone(t, 330, 0, 0.1, 'sawtooth', 0.05); tone(t, 220, 0.09, 0.2, 'sawtooth', 0.05); },
    skill: t => { tone(t, 784, 0, 0.12, 'sine', 0.1, 1175); tone(t, 1175, 0.08, 0.2, 'sine', 0.06); },
    tick: t => tone(t, 1320, 0, 0.04, 'square', 0.035),
    gong: t => { chord(t, 0, [196, 294, 392], 1.2, 'sine', 0.12); noise(t, 0, 0.12, 0.08, 800, 1); }
  };
  function play(name) {
    if (!enabled || !SOUNDS[name] || !ac()) return;
    try { SOUNDS[name](ctx.currentTime + 0.01); } catch (e) { /* 鳴らなくても遊べる */ }
  }
  // 画面に触れたときに、止まっている音の準備を動かす（iPhone は触れたときでないと音を出せない）
  for (const ev of ['pointerdown', 'touchend', 'keydown']) root.addEventListener(ev, () => { if (enabled) ac(); }, { capture: true, passive: true });
  root.Sfx = { play, set(on) { enabled = !!on; if (enabled) ac(); }, get on() { return enabled; } };
})(window);
