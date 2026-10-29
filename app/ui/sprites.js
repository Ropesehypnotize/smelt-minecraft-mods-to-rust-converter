// Pixel sprites drawn as crisp SVG. Each sprite is a 16x16 grid of palette keys.
(function () {
  const SPRITES = {
    // The app mark: a smelted ingot with a gleam.
    ingot: {
      colors: { o: '#2a120a', h: '#ffb67a', e: '#ffe0bf', f: '#e2763a', s: '#b04d26', d: '#6e2c12', w: '#fff3e2' },
      rows: [
        '................',
        '.............w..',
        '............www.',
        '.............w..',
        '................',
        '....oooooooo....',
        '...ohhhhhhhho...',
        '..ohhhhhhhhhho..',
        '..oeeeeeeeeeeo..',
        '.oefffffffffsso.',
        '.offfffffffssso.',
        'oeffffffffffssso',
        'offfffffffffssso',
        'oddddddddddddddo',
        '.oooooooooooooo.',
        '................',
      ],
    },
    // A .jar, drawn as an actual jar.
    jar: {
      colors: { o: '#121a24', l: '#9aa7b6', L: '#647181', g: '#5d86ad', h: '#b4d0ec', s: '#3c5d7e', W: '#ece4d6', c: '#b5653a' },
      rows: [
        '................',
        '....oooooooo....',
        '....ollllllo....',
        '....oLLLLLLo....',
        '.....oggggo.....',
        '...ooggggggoo...',
        '..ohggggggggso..',
        '..ohgWWWWWWgso..',
        '..ohgWccccWgso..',
        '..ohgWWWWWWgso..',
        '..ohggggggggso..',
        '..ogggggggggso..',
        '...ogggggggso...',
        '....oooooooo....',
        '................',
        '................',
      ],
    },
    // A content-only mod: a block.
    block: {
      colors: { o: '#1d140f', h: '#e8b07a', t: '#c98a52', f: '#a86a3a', s: '#7d4b27' },
      rows: [
        '................',
        '................',
        '.......oo.......',
        '.....oohhoo.....',
        '...oohhtthhoo...',
        '.oohhtttttthhoo.',
        '.offhhtttthhsso.',
        '.offffhhhhsssso.',
        '.offfffhhssssso.',
        '.offffffsssssso.',
        '.offffffsssssso.',
        '.offffffsssssso.',
        '..ooffffssssoo..',
        '....ooffssoo....',
        '......oooo......',
        '................',
      ],
    },
    // Slag: what is left when something cannot come over.
    slag: {
      colors: { o: '#151312', a: '#5b534d', b: '#433d39', c: '#7a716a' },
      rows: [
        '................',
        '................',
        '................',
        '................',
        '................',
        '.......ooo......',
        '.....oocaaoo....',
        '....ocaabaaao...',
        '...ocabbaabaao..',
        '..oaabbaaabbao..',
        '..oabbaabbbbao..',
        '.oaabbbbbbbbbao.',
        '.oooooooooooooo.',
        '................',
        '................',
        '................',
      ],
    },
  };

  function pad(row) {
    return (row + '................').slice(0, 16);
  }

  function svg(name, size) {
    const sp = SPRITES[name];
    const u = size / 16;
    let rects = '';
    sp.rows.map(pad).forEach((row, y) => {
      for (let x = 0; x < 16; x++) {
        const c = sp.colors[row[x]];
        if (c) rects += `<rect x="${x * u}" y="${y * u}" width="${u}" height="${u}" fill="${c}"/>`;
      }
    });
    return `<svg class="sprite sprite-${name}" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges" aria-hidden="true">${rects}</svg>`;
  }

  window.Sprites = { svg };
})();
