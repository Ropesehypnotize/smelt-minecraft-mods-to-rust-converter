// Smelt window UI. The engine reports progress and a verdict for each mod;
// this file only turns that into the four screens a player ever sees.
(function () {
  const S = window.Sprites;

  const icon = {
    min: '<svg viewBox="0 0 10 10"><path d="M0 5.5h10"/></svg>',
    max: '<svg viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9"/></svg>',
    close: '<svg viewBox="0 0 10 10"><path d="M0 0l10 10M10 0L0 10"/></svg>',
    check: '<svg viewBox="0 0 16 16"><path d="M3 8.5l3 3 7-7"/></svg>',
    plus: '<svg viewBox="0 0 16 16"><path d="M8 3v10M3 8h10"/></svg>',
    folder: '<svg viewBox="0 0 16 16"><path d="M2 4.5h4l1.5 1.5H14v6.5H2z"/></svg>',
  };

  // What the engine reports for each mod it reads.
  const VERDICTS = {
    'spyglass-zoom-2.1.jar': {
      name: 'Spyglass Zoom', verdict: 'works', kind: 'code',
      title: 'Ready for Minecraft on Rust',
      lines: [['ok', 'Zoom key and smooth zoom, rewritten in Rust']],
      out: 'spyglass-zoom.hnmod', size: '52 KB',
      added: 'Horizon asks you to <b>trust new mods</b> the first time it starts them.',
    },
    'corner-clock-1.3.jar': {
      name: 'Corner Clock', verdict: 'partly', kind: 'code',
      title: 'Ready, with one gap',
      lines: [['ok', 'The clock in the corner of your screen'], ['warn', 'Its settings menu doesn’t come over yet']],
      out: 'corner-clock.hnmod', size: '38 KB',
      added: 'Horizon asks you to <b>trust new mods</b> the first time it starts them.',
    },
    'copper-decor-1.0.jar': {
      name: 'Copper Decor', verdict: 'works', kind: 'content',
      title: 'Ready for Minecraft on Rust',
      lines: [['ok', '48 blocks, 31 recipes and all their textures'], ['ok', 'No code inside, so there’s nothing to trust']],
      out: 'copper-decor.hmod', size: '1.4 MB',
      added: 'Restart Horizon to see the <b>new blocks</b>.',
    },
    'shader-tweaks-0.9.jar': {
      name: 'Shader Tweaks', verdict: 'no', kind: 'none',
      title: 'This one can’t come over yet',
      lines: [['off', 'It changes how the game draws the world. Minecraft on Rust can’t load that kind of change yet.']],
    },
  };

  const PILL = { works: 'Works', partly: 'Partly', no: 'Won’t run' };
  const STEPS = ['Reading the mod', 'Rewriting it in Rust', 'Packing it for Horizon'];
  const SEGMENTS = 24;

  const app = document.getElementById('app');
  app.innerHTML = `
    <div class="win">
      <header class="titlebar">
        <div class="brand">${S.svg('ingot', 20)}<span class="wordmark">smelt</span></div>
        <div class="target">Java mods for <b>Minecraft on Rust</b></div>
        <div class="winctl"><span>${icon.min}</span><span>${icon.max}</span><span>${icon.close}</span></div>
      </header>
      <main class="stage"><section class="zone"></section></main>
      <footer class="status">
        <span class="dot"></span><span>Horizon 26.3 found</span>
        <span class="spacer"></span>
        <label class="switch" id="dev"><span>Developer mode</span><span class="track"></span></label>
      </footer>
      <div class="toast" id="toast"></div>
    </div>`;

  const zone = app.querySelector('.zone');
  const stage = app.querySelector('.stage');
  const toast = app.querySelector('#toast');
  const devSwitch = app.querySelector('#dev');
  const dash = '<svg class="dash"><rect width="100%" height="100%" rx="17"/></svg>';
  let current = null;
  let devOn = false;

  function set(cls, html) {
    zone.className = 'zone ' + cls;
    stage.classList.toggle('wide', cls === 'dev');
    zone.innerHTML = html;
  }

  function idle(over) {
    hideToast();
    set(over ? 'over' : 'dashed', `${dash}
      <div class="center enter">
        <div class="pair">
          <div class="tile">${S.svg('jar', 48)}</div>
          <div class="chev"><i></i><i></i><i></i></div>
          <div class="tile hot">${S.svg('ingot', 48)}</div>
        </div>
        <h1>${over ? 'Release to smelt' : 'Drop a mod here'}</h1>
        <p class="sub">A Fabric or NeoForge <span class="kbd">.jar</span>. It comes out as a Rust mod for Minecraft on Rust.</p>
        <div class="actions"><button class="btn" id="pick">${icon.folder}Choose a file</button></div>
        <div class="hint">Works offline. Nothing leaves your PC.</div>
      </div>`);
    const pick = zone.querySelector('#pick');
    if (pick) pick.onclick = () => chooser.click();
  }

  function smelting(file) {
    set('solid', `
      <div class="center enter">
        <div class="morph" style="--p:0">
          <div class="glow"></div>
          <div class="from">${S.svg('jar', 96)}</div>
          <div class="to">${S.svg('ingot', 96)}</div>
        </div>
        <div class="file">${file}</div>
        <div class="bar">${'<i></i>'.repeat(SEGMENTS)}</div>
        <div class="steps">${STEPS.map((s) => `<span>${s}</span>`).join('')}</div>
      </div>`);
  }

  function progress(p, step) {
    const morph = zone.querySelector('.morph');
    if (!morph) return;
    morph.style.setProperty('--p', p.toFixed(3));
    const on = Math.round(p * SEGMENTS);
    zone.querySelectorAll('.bar i').forEach((seg, i) => {
      seg.classList.toggle('on', i < on);
      seg.classList.toggle('tip', i === on - 1 && p < 1);
    });
    zone.querySelectorAll('.steps span').forEach((s, i) => {
      s.className = i < step ? 'past' : i === step ? 'now' : '';
    });
  }

  function result(v) {
    current = v;
    if (devOn && v.verdict !== 'no') return developer(v);
    const art = v.verdict === 'no' ? S.svg('slag', 96) : S.svg(v.kind === 'content' ? 'block' : 'ingot', 96);
    const artCls = v.verdict === 'no' ? 'no' : v.kind === 'content' ? 'content' : '';
    const buttons = v.verdict === 'no'
      ? `<button class="btn" data-act="again">Smelt another</button>`
      : `<button class="btn primary" data-act="add">${icon.plus}Add to Horizon</button><button class="btn" data-act="show">Show file</button>`;
    set('solid', `
      <div class="result enter">
        <div class="art ${artCls} pop">${art}</div>
        <div>
          <span class="pill ${v.verdict}">${PILL[v.verdict]}</span>
          <h1>${v.title}</h1>
          <ul class="lines">${v.lines.map(([k, t]) => `<li class="${k}">${t}</li>`).join('')}</ul>
          ${v.out ? `<div class="out">${S.svg(v.kind === 'content' ? 'block' : 'ingot', 16)}<b>${v.out}</b>${v.size}</div>` : ''}
          <div class="actions">${buttons}</div>
        </div>
      </div>
      ${v.verdict === 'no' ? '' : '<button class="link again" data-act="again">Smelt another</button>'}`);
  }

  // Developer mode: the same result with the code laid open.
  const JAVA = [
    'public class SpyglassZoom',
    '    implements ClientModInitializer {',
    '  static KeyBinding zoom;',
    '  static double fov = 1.0;',
    '',
    '  public void onInitializeClient() {',
    '    zoom = KeyBindingHelper.registerKeyBinding(',
    '      new KeyBinding("key.spyglass.zoom",',
    '        GLFW.GLFW_KEY_C, "Spyglass Zoom"));',
    '',
    '    ClientTickEvents.END_CLIENT_TICK',
    '      .register(client -> {',
    '        double target = zoom.isPressed()',
    '          ? 0.25 : 1.0;',
    '        fov += (target - fov) * 0.4;',
    '      });',
    '  }',
    '}',
  ];
  const RUST = [
    '// mixins/spyglass_zoom/runtime.rs',
    'pub const ID: &str = "spyglass_zoom";',
    '',
    '#[derive(Default)]',
    'pub struct Zoom { held: bool, fov: f64 }',
    '',
    '// hook: native_key',
    'pub fn key(game: &Game, key: &str,',
    '           down: bool, z: &mut Zoom) {',
    '  let bound = game.native_mod_key(',
    '      ID, "zoom", "key.keyboard.c");',
    '  if key == bound { z.held = down; }',
    '}',
    '',
    '// hook: native_tick, 20 times a second',
    'pub fn tick(z: &mut Zoom) {',
    '  let target = if z.held { 0.25 } else { 1.0 };',
    '  z.fov += (target - z.fov) * 0.4;',
    '}',
  ];
  const TOKEN = /(\/\/.*$)|("[^"]*")|(#\[[^\]]*\])|\b(public|class|implements|static|double|void|new|pub|const|struct|fn|let|if|else|mut|bool|f64|str)\b|\b([A-Z][A-Za-z_]+)\b|\b(\d+\.\d+)\b/g;
  const esc = (t) => t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  function highlight(line) {
    let out = '';
    let last = 0;
    line.replace(TOKEN, (m, comment, str, attr, kw, type, num, at) => {
      const cls = comment || attr ? 'tk-c' : str ? 'tk-s' : kw ? 'tk-k' : type ? 'tk-t' : 'tk-n';
      out += esc(line.slice(last, at)) + `<span class="${cls}">${esc(m)}</span>`;
      last = at + m.length;
      return m;
    });
    return out + esc(line.slice(last));
  }

  function code(lines, hl) {
    return lines.map((l, i) => `<span class="l${hl.includes(i + 1) ? ' hl' : ''}"><span class="n">${i + 1}</span>${highlight(l)}</span>`).join('');
  }

  function developer(v) {
    set('dev', `
      <div class="dev enter">
        <div class="dev-head">
          <span class="name">${v.name}</span><span class="pill ${v.verdict}">${PILL[v.verdict]}</span>
          <span class="file">spyglass-zoom-2.1.jar → ${v.out}</span>
          <div class="actions"><button class="btn">Export port plan</button><button class="btn primary">Open Rust project</button></div>
        </div>
        <div class="dev-body">
          <div class="card pieces">
            <div class="grp">Code</div>
            <div class="row sel"><i class="ok-i"></i>SpyglassZoom<em>rewritten</em></div>
            <div class="row"><i class="ember-i"></i>RendererMixin<em>replaced</em></div>
            <div class="row"><i class="ok-i"></i>ZoomConfig<em>rewritten</em></div>
            <div class="grp">Assets</div>
            <div class="row"><i class="ok-i"></i>lang/ · 3<em>copied</em></div>
            <div class="row"><i class="ok-i"></i>textures/ · 2<em>copied</em></div>
            <div class="grp">Hooks used</div>
            <div class="row"><i class="ember-i"></i>native_key</div>
            <div class="row"><i class="ember-i"></i>native_tick</div>
            <div class="row"><i class="ember-i"></i>native_zoom</div>
          </div>
          <div class="card split">
            <div class="code"><header><b class="lang-java">Java</b>SpyglassZoom.java</header><pre>${code(JAVA, [13, 14, 15])}</pre></div>
            <div class="code"><header><b class="lang-rust">Rust</b>runtime.rs</header><pre>${code(RUST, [17, 18])}</pre></div>
          </div>
        </div>
        <div class="card plan">
          <div class="it"><i class="ok-i"></i><div><code>KeyBinding → native_mod_key</code><small>Mapped automatically</small></div></div>
          <div class="it"><i class="ok-i"></i><div><code>END_CLIENT_TICK → native_tick</code><small>Mapped automatically</small></div></div>
          <div class="it"><i class="ember-i"></i><div><code>RendererMixin → native_zoom</code><small>Known pattern. Worth a quick look</small></div></div>
        </div>
      </div>`);
  }

  function showToast(html) {
    toast.innerHTML = html;
    toast.classList.add('show');
  }
  function hideToast() {
    toast.classList.remove('show');
  }

  zone.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'again') idle(false);
    if (act === 'add') add();
  });

  function add() {
    const b = zone.querySelector('[data-act="add"]');
    if (!b || !current) return;
    b.className = 'btn done';
    b.innerHTML = `${icon.check}Added to Horizon`;
    showToast(current.added);
  }

  devSwitch.addEventListener('click', () => dev(!devOn));
  function dev(on) {
    devOn = on;
    devSwitch.classList.toggle('on', on);
    if (current && zone.querySelector('.result, .dev')) result(current);
  }

  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function run(file, pace = 1) {
    const v = VERDICTS[file] || { ...VERDICTS['spyglass-zoom-2.1.jar'], name: file.replace(/\.jar$/, '') };
    smelting(file);
    await wait(300 * pace);
    const per = SEGMENTS / STEPS.length;
    for (let s = 0; s < STEPS.length; s++) {
      for (let k = 1; k <= per; k++) {
        progress((s * per + k) / SEGMENTS, s);
        await wait(((s === 1 ? 70 : 45) + (k % 3) * 12) * pace);
      }
    }
    progress(1, STEPS.length);
    await wait(380 * pace);
    result(v);
  }

  // Real drag and drop.
  let depth = 0;
  const busy = () => zone.classList.contains('solid') && zone.querySelector('.morph');
  window.addEventListener('dragenter', (e) => { e.preventDefault(); if (!busy() && depth++ === 0) idle(true); });
  window.addEventListener('dragover', (e) => e.preventDefault());
  window.addEventListener('dragleave', () => { if (!busy() && --depth === 0) idle(false); });
  window.addEventListener('drop', (e) => {
    e.preventDefault();
    depth = 0;
    const f = e.dataTransfer.files[0];
    if (f && !busy()) run(f.name);
  });
  const chooser = Object.assign(document.createElement('input'), { type: 'file', accept: '.jar' });
  chooser.onchange = () => chooser.files[0] && run(chooser.files[0].name);

  idle(false);
  window.smelt = {
    idle, run, add, dev,
    result: (file) => result(VERDICTS[file]),
    // Freeze the smelting screen at one moment (used for screenshots).
    at: (file, p, step) => { smelting(file); progress(p, step); },
  };
})();
