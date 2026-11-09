/* Tiferet: Hebrew + RTL for the listmonk visual email editor.
   1. Every email saved from the visual editor gets dir="rtl".
   2. The editor canvas shows RTL.
   3. The editor's English UI labels are translated to Hebrew. */
(function () {
  var HE = {
    'Inspect': 'עריכת בלוק', 'Styles': 'עיצוב כללי', 'Global': 'כללי',
    'Avatar': 'אווטאר', 'Button': 'כפתור', 'Columns': 'עמודות (קולאז\')', 'Container': 'מיכל',
    'Divider': 'קו מפריד', 'Heading': 'כותרת', 'Html': 'HTML', 'Image': 'תמונה',
    'Spacer': 'רווח', 'Text': 'טקסט', 'LoopContainer': 'לולאה', 'ProgressBar': 'פס התקדמות',
    'Avatar block': 'בלוק אווטאר', 'Button block': 'בלוק כפתור', 'Columns block': 'בלוק עמודות',
    'Container block': 'בלוק מיכל', 'Divider block': 'בלוק קו מפריד', 'Heading block': 'בלוק כותרת',
    'Html block': 'בלוק HTML', 'Image block': 'בלוק תמונה', 'Spacer block': 'בלוק רווח', 'Text block': 'בלוק טקסט',
    'Alignment': 'יישור', 'Alt text': 'טקסט חלופי', 'Backdrop color': 'צבע רקע חיצוני',
    'Background color': 'צבע רקע', 'Border color': 'צבע מסגרת', 'Border radius': 'עיגול פינות',
    'Button color': 'צבע כפתור', 'Canvas border color': 'צבע מסגרת המייל',
    'Canvas border radius': 'עיגול פינות המייל', 'Canvas color': 'צבע רקע המייל',
    'Click through URL': 'קישור בלחיצה', 'Color': 'צבע', 'Column 1': 'עמודה 1', 'Column 2': 'עמודה 2',
    'Column 3': 'עמודה 3', 'Columns gap': 'רווח בין עמודות', 'Content': 'תוכן',
    'Embed inline (CID)': 'הטמעה בתוך המייל (CID)', 'Font family': 'גופן', 'Font size': 'גודל גופן',
    'Font weight': 'עובי גופן', 'Height': 'גובה', 'Image URL': 'כתובת תמונה', 'Level': 'רמה',
    'Number of columns': 'מספר עמודות', 'Outlook compatibility': 'תאימות ל-Outlook',
    'Padding': 'ריווח פנימי', 'Shape': 'צורה', 'Size': 'גודל', 'Source URL': 'כתובת תמונה',
    'Style': 'סגנון', 'Text color': 'צבע טקסט', 'Url': 'קישור', 'Width': 'רוחב',
    'Delete': 'מחיקה', 'Duplicate': 'שכפול', 'Move up': 'הזזה למעלה', 'Move down': 'הזזה למטה',
    'Edit': 'עריכה', 'Preview': 'תצוגה מקדימה', 'Desktop view': 'תצוגת מחשב', 'Mobile view': 'תצוגת נייד',
    'HTML output': 'קוד HTML', 'JSON output': 'קוד JSON', 'Import JSON': 'ייבוא JSON',
    'Download JSON file': 'הורדת קובץ JSON', 'Share current template': 'שיתוף התבנית',
    'This will override your current template.': 'פעולה זו תחליף את התבנית הנוכחית.',
    'Auto': 'אוטומטי', 'Bold': 'מודגש', 'Regular': 'רגיל', 'Circle': 'עיגול', 'Full': 'מלא',
    'Pill': 'גלולה', 'Rectangle': 'מלבן', 'Rounded': 'מעוגל', 'Square': 'ריבוע',
    'Match email settings': 'לפי הגדרות המייל', 'Block not found': 'הבלוק לא נמצא',
    'Select media': 'בחירה מספריית המדיה', 'Top': 'למעלה', 'Bottom': 'למטה', 'Left': 'שמאל', 'Right': 'ימין',
    'Middle': 'אמצע', 'Center': 'מרכז'
  };

  var FONT_CSS = 'https://lists.tiferet-ly.com/public/static/fonts/fonts.css';
  // [Hebrew name, CSS family stack]
  var FONTS = [
    ['היבו', "Heebo,Arial,sans-serif"], ['אסיסטנט', "Assistant,Arial,sans-serif"],
    ['רוביק', "Rubik,Arial,sans-serif"], ['אלף', "Alef,Arial,sans-serif"],
    ['ורלה עגול', "Varela Round,Arial,sans-serif"], ['סקולר', "Secular One,Arial,sans-serif"],
    ['סואץ', "Suez One,Georgia,serif"], ['פרנק רוהל', "Frank Ruhl Libre,Georgia,serif"],
    ['דוד', "David Libre,Georgia,serif"], ['נוטו סריף', "Noto Serif Hebrew,Georgia,serif"],
    ['מרים', "Miriam Libre,Arial,sans-serif"], ['בלפייר', "Bellefair,Georgia,serif"],
    ['פרדוקה', "Fredoka,Arial,sans-serif"], ['פלייפן', "Playpen Sans Hebrew,Arial,sans-serif"],
    ['קרנטינה', "Karantina,Arial,sans-serif"], ['אמטיק', "Amatic SC,Arial,sans-serif"],
    ['גברת לוין', "Gveret Levin,Arial,sans-serif"], ['סוליטריאו', "Solitreo,Arial,sans-serif"],
    ['כתב רש״י', "Noto Rashi Hebrew,Georgia,serif"], ['Arial', "Arial,Helvetica,sans-serif"]
  ];
  // Visual editor has 9 fixed font slots: map each to a Hebrew font.
  // [original stack emitted by the builder, its English label, Hebrew label, Hebrew stack]
  var VSLOTS = [
    ['"Helvetica Neue", "Arial Nova", "Nimbus Sans", Arial, sans-serif', 'Modern sans', 'היבו', "Heebo,Arial,sans-serif", 'Helvetica Neue'],
    ['Optima, Candara, "Noto Sans", source-sans-pro, sans-serif', 'Book sans', 'אסיסטנט', "Assistant,Arial,sans-serif", 'Optima'],
    ['Seravek, "Gill Sans Nova", Ubuntu, Calibri, "DejaVu Sans", source-sans-pro, sans-serif', 'Organic sans', 'רוביק', "Rubik,Arial,sans-serif", 'Seravek'],
    ['Avenir, "Avenir Next LT Pro", Montserrat, Corbel, "URW Gothic", source-sans-pro, sans-serif', 'Geometric sans', 'אלף', "Alef,Arial,sans-serif", 'Avenir'],
    ['Bahnschrift, "DIN Alternate", "Franklin Gothic Medium", "Nimbus Sans Narrow", sans-serif-condensed, sans-serif', 'Heavy sans', 'סקולר', "Secular One,Arial,sans-serif", 'Bahnschrift'],
    ['ui-rounded, "Hiragino Maru Gothic ProN", Quicksand, Comfortaa, Manjari, "Arial Rounded MT Bold", Calibri, source-sans-pro, sans-serif', 'Rounded sans', 'ורלה עגול', "Varela Round,Arial,sans-serif", 'ui-rounded'],
    ['Charter, "Bitstream Charter", "Sitka Text", Cambria, serif', 'Modern serif', 'פרנק רוהל', "Frank Ruhl Libre,Georgia,serif", 'Charter'],
    ['"Iowan Old Style", "Palatino Linotype", "URW Palladio L", P052, serif', 'Book serif', 'דוד', "David Libre,Georgia,serif", 'Iowan Old Style'],
    ['"Nimbus Mono PS", "Courier New", "Cutive Mono", monospace', 'Monospace', 'סואץ', "Suez One,Georgia,serif", 'Nimbus Mono PS']
  ];
  function reEsc(x) { return x.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }
  VSLOTS.forEach(function (v) { HE[v[1]] = v[2]; });
  var ATTRS = ['title', 'aria-label', 'placeholder'];

  function rtl(body) {
    if (!body) return body;
    body = body.replace(/<html(?![^>]*\bdir=)([^>]*)>/i, '<html dir="rtl" lang="he"$1>');
    body = body.replace(/<body(?![^>]*\bdir=)([^>]*)>/i, '<body dir="rtl"$1>');
    body = body.replace(/(<body[^>]*>\s*<div)(?![^>]*\bdir=)/i, '$1 dir="rtl"');
    VSLOTS.forEach(function (v) {
      var re = new RegExp(reEsc(v[0]).replace(/"/g, '(?:"|&quot;|&#34;)'), 'g');
      body = body.replace(re, v[3]);
    });
    // Paragraphs: no outer margin, so block spacing is controlled only by the block padding.
    body = body.replace(/<p>/g, '<p style="margin:0">');
    body = body.replace(/<\/p>(\s*)<p style="margin:0">/g, '</p>$1<p style="margin:0.8em 0 0">');
    if (body.indexOf(FONT_CSS) < 0) {
      var link = '<link rel="stylesheet" href="' + FONT_CSS + '">';
      if (/<head[^>]*>/i.test(body)) body = body.replace(/(<head[^>]*>)/i, '$1' + link);
      else body = body.replace(/(<html[^>]*>)/i, '$1<head>' + link + '</head>');
    }
    // Open-tracking pixel is added automatically, so the design needs no code block for it.
    if (!/\{\{\s*TrackView\s*\}\}/.test(body)) body = body.replace(/<\/body>/i, '{{ TrackView }}</body>');
    return body;
  }

  // ---- Personalisation variables (subscriber name etc.) ----
  var VARS = [
    ['שם פרטי', '{{ .Subscriber.FirstName }}'],
    ['שם משפחה', '{{ .Subscriber.LastName }}'],
    ['שם מלא', '{{ .Subscriber.Name }}'],
    ['אימייל', '{{ .Subscriber.Email }}']
  ];
  var VAR_RE = /\{\{\s*\.Subscriber\.(FirstName|LastName|Name|Email)\s*\}\}/g;
  var VAR_LABEL = { FirstName: 'שם פרטי', LastName: 'שם משפחה', Name: 'שם מלא', Email: 'אימייל' };
  var CHIP_RE = /«(שם פרטי|שם משפחה|שם מלא|אימייל)»/g;
  var VAR_CSS = '.tf-vars{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:4px 0 8px;direction:rtl;font-family:Heebo,Arial,sans-serif}' +
    '.tf-vars span{font-size:12px;color:#666}' +
    '.tf-vars button{border:1px solid #C9A043;background:#FBF4E2;color:#13404B;border-radius:999px;padding:2px 10px;font-size:12px;cursor:pointer;font-family:inherit}' +
    '.tf-vars button:hover{background:#F3E3B5}';

  // Insert text at the caret of a React/Vue controlled input so the framework sees the change.
  function insertAtCaret(el, text) {
    var w = el.ownerDocument.defaultView;
    var start = el.selectionStart == null ? el.value.length : el.selectionStart;
    var end = el.selectionEnd == null ? start : el.selectionEnd;
    var val = el.value.slice(0, start) + text + el.value.slice(end);
    var proto = el.tagName === 'TEXTAREA' ? w.HTMLTextAreaElement.prototype : w.HTMLInputElement.prototype;
    Object.getOwnPropertyDescriptor(proto, 'value').set.call(el, val);
    el.dispatchEvent(new w.Event('input', { bubbles: true }));
    try { el.focus(); el.setSelectionRange(start + text.length, start + text.length); } catch (e) { /* ignore */ }
  }

  function varBar(doc, field) {
    var bar = doc.createElement('div');
    bar.className = 'tf-vars';
    bar.innerHTML = '<span>הוספת משתנה:</span>';
    VARS.forEach(function (v) {
      var b = doc.createElement('button');
      b.type = 'button'; b.textContent = '+ ' + v[0]; b.title = 'יוחלף בפרטי הנמען בזמן השליחה';
      b.addEventListener('mousedown', function (e) { e.preventDefault(); });
      b.addEventListener('click', function (e) { e.preventDefault(); insertAtCaret(bar.__field || field, v[1]); });
      bar.appendChild(b);
    });
    bar.__field = field;
    return bar;
  }

  // Visual editor sidebar: chips above the Content / Text fields of Text, Heading and Button blocks.
  var VAR_FIELDS = { 'Content': 1, 'תוכן': 1, 'Text': 1, 'טקסט': 1 };
  function addVarBars(doc) {
    // Drop bars left behind when the sidebar switched to another block.
    var old = doc.querySelectorAll('.tf-vars');
    for (var j = 0; j < old.length; j++) {
      var nx = old[j].nextElementSibling, fl = old[j].__field;
      if (!fl || !fl.isConnected || !nx || !nx.contains(fl)) old[j].remove();
    }
    var labels = doc.querySelectorAll('label.MuiInputLabel-root, label.MuiFormLabel-root');
    for (var i = 0; i < labels.length; i++) {
      var lb = labels[i];
      if (!VAR_FIELDS[(lb.textContent || '').trim()]) continue;
      var fc = lb.closest('.MuiFormControl-root, .MuiTextField-root');
      if (!fc || inCanvas(fc)) continue;
      var field = fc.querySelector('textarea:not([aria-hidden]), input[type="text"], input:not([type])');
      if (!field) continue;
      var prev = fc.previousElementSibling;
      if (prev && prev.classList && prev.classList.contains('tf-vars')) { prev.__field = field; continue; }
      var bar = varBar(doc, field);
      fc.parentNode.insertBefore(bar, fc);
    }
  }

  // Canvas: show variables as gold chips with a Hebrew name instead of template code.
  function showVarChips(doc) {
    var w = doc.defaultView, ranges = [];
    var tw = doc.createTreeWalker(doc.body, 4, null), n, list = [];
    while ((n = tw.nextNode())) {
      if (!n.nodeValue || !inCanvas(n)) continue;
      if (n.nodeValue.indexOf('{{') > -1 && VAR_RE.test(n.nodeValue)) {
        VAR_RE.lastIndex = 0;
        n.nodeValue = n.nodeValue.replace(VAR_RE, function (m, k) { return '«' + VAR_LABEL[k] + '»'; });
      }
      VAR_RE.lastIndex = 0;
      if (n.nodeValue.indexOf('«') > -1) list.push(n);
    }
    if (!w.CSS || !w.CSS.highlights || !w.Highlight) return;
    list.forEach(function (t) {
      var m; CHIP_RE.lastIndex = 0;
      while ((m = CHIP_RE.exec(t.nodeValue))) {
        var r = doc.createRange(); r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length); ranges.push(r);
      }
    });
    w.CSS.highlights.set('tfvar', new w.Highlight(...ranges));
  }

  // Campaign subject line: same chips under the subject field.
  function subjectVars() {
    var inp = document.querySelector('input[name="subject"]');
    if (!inp || inp.disabled) return;
    var f = inp.closest('.field');
    if (!f || (f.nextElementSibling && f.nextElementSibling.classList.contains('tf-vars'))) return;
    var bar = varBar(document, inp);
    bar.style.margin = '-4px 0 16px';
    f.parentNode.insertBefore(bar, f.nextSibling);
  }

  // Preview window: the preview frame is sandboxed, so we load the preview ourselves and show
  // the demo subscriber as a highlighted Hebrew sample.
  var DEMO = { 'Demo Subscriber': 'ישראל ישראלי', 'demo@listmonk.app': 'israel@example.com', 'Demo': 'ישראל', 'Subscriber': 'ישראלי' };
  function demoize(html) {
    return html.replace(/>([^<]+)</g, function (m, t) {
      return '>' + t.replace(/Demo Subscriber|demo@listmonk\.app|\bDemo\b|\bSubscriber\b/g, function (x) {
        return '<span style="background:#FFF1C1;border-radius:3px;padding:0 2px" title="דוגמה: כאן יופיעו פרטי הנמען">' + DEMO[x] + '</span>';
      }) + '<';
    });
  }
  function setPreview(ifr, html) { ifr.srcdoc = demoize(html); }
  var oSubmit = HTMLFormElement.prototype.submit;
  HTMLFormElement.prototype.submit = function () {
    var form = this, tgt = form.getAttribute('target');
    var ifr = tgt && document.querySelector('iframe[name="' + tgt + '"]');
    if (ifr && ifr.closest('.modal') && (form.method || '').toLowerCase() === 'post') {
      try {
        var fd = new URLSearchParams(new FormData(form));
        fetch(form.action, { method: 'POST', body: fd, credentials: 'same-origin' })
          .then(function (r) { return r.text(); })
          .then(function (h) { setPreview(ifr, h); })
          .catch(function () { ifr.removeAttribute('srcdoc'); oSubmit.call(form); });
        return;
      } catch (e) { /* fall through */ }
    }
    return oSubmit.call(form);
  };
  function hookPreview() {
    var f = document.querySelectorAll('.modal iframe');
    for (var i = 0; i < f.length; i++) {
      var ifr = f[i], src = ifr.getAttribute('src') || '';
      if (ifr.id === 'visual-editor' || !src || src === 'about:blank' || ifr.__tfSrc === src) continue;
      ifr.__tfSrc = src;
      (function (x, u) {
        fetch(u, { credentials: 'same-origin' }).then(function (r) { return r.text(); })
          .then(function (h) { if (x.__tfSrc === u) setPreview(x, h); }).catch(function () { /* keep default */ });
      })(ifr, src);
    }
  }

  function inCanvas(node) {
    var el = node.nodeType === 1 ? node : node.parentElement;
    return !!(el && el.closest && el.closest('table[role="presentation"]'));
  }

  function translate(doc, root) {
    if (!root) return;
    try {
      var w = doc.createTreeWalker(root, 4, null), n, t;
      while ((n = w.nextNode())) {
        t = n.nodeValue && n.nodeValue.trim();
        if (t && HE[t] && HE[t] !== t && !inCanvas(n)) n.nodeValue = n.nodeValue.replace(t, HE[t]);
      }
      if (root.querySelectorAll) {
        root.querySelectorAll('[title],[aria-label],[placeholder]').forEach(function (el) {
          ATTRS.forEach(function (a) {
            var v = el.getAttribute(a);
            if (v && HE[v]) el.setAttribute(a, HE[v]);
          });
        });
      }
    } catch (e) { /* ignore */ }
  }

  function wrapBuilder(eb) {
    if (!eb || eb.__heWrapped) return eb;
    return new Proxy(eb, {
      get: function (t, k) {
        if (k === '__heWrapped') return true;
        if (k === 'render') {
          return function (id, opts) {
            if (opts && typeof opts.onChange === 'function') {
              var oc = opts.onChange;
              opts = Object.assign({}, opts, {
                onChange: function (data, body) { return oc(data, rtl(body)); }
              });
            }
            return t.render(id, opts);
          };
        }
        return t[k];
      }
    });
  }

  function onFrameLoad(ifr) {
    var w = ifr.contentWindow, doc = ifr.contentDocument;
    if (!w || !doc || w.__heHooked) return;
    w.__heHooked = true;

    var real = w.EmailBuilder;
    try {
      Object.defineProperty(w, 'EmailBuilder', {
        configurable: true,
        get: function () { return wrapBuilder(real); },
        set: function (v) { real = v; }
      });
    } catch (e) { /* ignore */ }

    var fl = doc.createElement('link');
    fl.rel = 'stylesheet'; fl.href = FONT_CSS;
    (doc.head || doc.documentElement).appendChild(fl);
    var fontRules = VSLOTS.map(function (v) {
      return '[style*="' + v[4] + '"]{font-family:' + v[3] + ' !important;}';
    }).join('');
    var st = doc.createElement('style');
    st.textContent = fontRules +
      'table[role="presentation"]{direction:rtl;}' +
      'table[role="presentation"] p{margin:0;}table[role="presentation"] p+p{margin-top:0.8em;}' +
      'textarea,input[type="text"],input:not([type]){unicode-bidi:plaintext;}' +
      '::highlight(tfvar){background-color:#F3E3B5;color:#13404B;}' + VAR_CSS;
    (doc.head || doc.documentElement).appendChild(st);

    var pending = false;
    var mo = new MutationObserver(function () {
      if (pending) return;
      pending = true;
      w.requestAnimationFrame(function () {
        pending = false;
        translate(doc, doc.body);
        try { addVarBars(doc); } catch (e) { /* ignore */ }
        try { showVarChips(doc); } catch (e) { /* ignore */ }
      });
    });
    mo.observe(doc.documentElement, { childList: true, subtree: true, characterData: true });
  }

  function hook(ifr) {
    if (ifr.__heHook) return;
    ifr.__heHook = true;
    ifr.addEventListener('load', function () { onFrameLoad(ifr); });
    if (ifr.contentDocument && ifr.contentDocument.readyState === 'complete' &&
        ifr.contentDocument.getElementById('visual-editor-container')) {
      onFrameLoad(ifr);
    }
  }

  function scan() {
    try { sesCard(); } catch (e) { /* ignore */ }
    try { subjectVars(); } catch (e) { /* ignore */ }
    try { hookPreview(); } catch (e) { /* ignore */ }
    var f = document.querySelectorAll('iframe#visual-editor');
    for (var i = 0; i < f.length; i++) hook(f[i]);
  }

  // Safety net: make sure visual email bodies are saved with RTL.
  var oOpen = XMLHttpRequest.prototype.open, oSend = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (m, u) {
    this.__he = { m: m, u: String(u) };
    return oOpen.apply(this, arguments);
  };
  XMLHttpRequest.prototype.send = function (d) {
    try {
      var i = this.__he;
      if (i && /^(POST|PUT)$/i.test(i.m) && /\/api\/(templates|campaigns)(\/\d+)?$/.test(i.u.split('?')[0]) &&
          typeof d === 'string' && d.indexOf('"body"') > -1) {
        var o = JSON.parse(d);
        if (o && typeof o.body === 'string' && (o.type === 'campaign_visual' || o.content_type === 'visual')) {
          o.body = rtl(o.body);
          d = JSON.stringify(o);
        }
      }
    } catch (e) { /* ignore */ }
    return oSend.call(this, d);
  };

  // Rich-text (TinyMCE) editor: Hebrew font menu, RTL, fonts in the editing area.
  var HE_PACK = 'https://lists.tiferet-ly.com/public/static/tinymce/he_IL.js';
  function hookTiny() {
    var tm = window.tinymce;
    if (!tm || !tm.init || tm.__heHooked) return !!(tm && tm.__heHooked);
    var orig = tm.init;
    tm.init = function (conf) {
      try {
        conf = Object.assign({}, conf);
        if (conf.toolbar && conf.toolbar.indexOf('fontselect') < 0) {
          conf.toolbar = conf.toolbar.replace('fontsizeselect', 'fontselect fontsizeselect');
        }
        conf.font_formats = FONTS.map(function (f) { return f[0] + '=' + f[1]; }).join(';');
        conf.directionality = 'rtl';
        if (conf.toolbar && conf.toolbar.indexOf('tfvars') < 0) conf.toolbar = 'tfvars | ' + conf.toolbar;
        var oSetup = conf.setup;
        conf.setup = function (ed) {
          if (oSetup) oSetup(ed);
          ed.ui.registry.addMenuButton('tfvars', {
            text: 'משתנים',
            tooltip: 'הוספת שם הנמען ופרטים נוספים',
            fetch: function (cb) {
              cb(VARS.map(function (v) {
                return { type: 'menuitem', text: v[0], onAction: function () {
                  ed.insertContent('<span class="tf-var" data-label="' + v[0] + '" contenteditable="false">' + v[1] + '</span>&nbsp;');
                } };
              }));
            }
          });
        };
        conf.language = 'he_IL';
        conf.content_style = '@import url("' + FONT_CSS + '");\n' + (conf.content_style || '') +
          '\nbody{font-family:Heebo,Arial,sans-serif;direction:rtl;text-align:right;}' +
          '\n.tf-var{font-size:0;}.tf-var::before{content:"«" attr(data-label) "»";font-size:14px;background:#F3E3B5;color:#13404B;border-radius:4px;padding:0 3px;}';
      } catch (e) { /* ignore */ }
      // Load the Hebrew language pack ourselves, then start the editor.
      if (tm.__hePack) { return orig.call(tm, conf); }
      return new Promise(function (resolve) {
        var sc = document.createElement('script');
        sc.src = HE_PACK;
        sc.onload = function () {
          tm.__hePack = true;
          try {
            tm.addI18n('he_IL', {
              'Insert HTML': 'הוספת HTML', 'Source code': 'קוד מקור',
              'None': 'ללא', 'Float left': 'צף לשמאל', 'Float right': 'צף לימין'
            });
          } catch (e2) { /* ignore */ }
          resolve(orig.call(tm, conf));
        };
        sc.onerror = function () { delete conf.language; resolve(orig.call(tm, conf)); };
        document.head.appendChild(sc);
      });
    };
    tm.__heHooked = true;
    return true;
  }
  if (!hookTiny()) {
    var tries = 0, ti = setInterval(function () { if (hookTiny() || ++tries > 200) clearInterval(ti); }, 50);
  }

  // Dashboard card: Amazon SES sending quota + AWS credit balance.
  var SES_STATUS_URL = 'https://sesstatus-weat6lvwhbmkpojyybok3ovw.tiferet-ly.com/status';
  var sesData = null, sesAt = 0, sesBusy = false;
  function nf(n) { return (n == null || isNaN(n)) ? '-' : Math.round(n).toLocaleString('he-IL'); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sesHtml(d) {
    if (!d) return 'טוען נתונים מאמזון...';
    if (d.error) return 'לא ניתן לקבל נתונים מאמזון: ' + esc(d.error);
    var col = 'flex:1;min-width:220px';
    var h = '';
    if (d.ses) {
      var left = (d.ses.max24h || 0) - (d.ses.sent24h || 0);
      h += '<div style="' + col + '"><p class="is-size-7 has-text-grey">מכסת שליחה באמזון (24 שעות)</p>' +
        '<p class="title is-4" style="margin:.2em 0">' + nf(left) + ' <span class="is-size-6 has-text-grey">נשארו</span></p>' +
        '<p class="is-size-7">נשלחו ' + nf(d.ses.sent24h) + ' מתוך ' + nf(d.ses.max24h) + ' · עד ' + nf(d.ses.maxRate) + ' בשנייה' +
        (d.ses.sendingEnabled === false ? ' · <b style="color:#c0392b">השליחה מושבתת!</b>' : '') + '</p></div>';
    } else if (d.sesError) {
      h += '<div style="' + col + '"><p class="is-size-7 has-text-grey">מכסת שליחה</p><p class="is-size-7">שגיאה: ' + esc(d.sesError) + '</p></div>';
    }
    if (d.plan && d.plan.credits) {
      var amt = d.plan.credits.amount, unit = d.plan.credits.unit || 'USD';
      var exp = d.plan.expires;
      if (typeof exp === 'number') exp = new Date(exp < 1e12 ? exp * 1000 : exp);
      else if (exp) exp = new Date(exp);
      var expTxt = (exp && !isNaN(exp)) ? exp.toLocaleDateString('he-IL') : '-';
      h += '<div style="' + col + '"><p class="is-size-7 has-text-grey">קרדיט בחשבון אמזון</p>' +
        '<p class="title is-4" style="margin:.2em 0">' + (unit === 'USD' ? '$' : '') + (Math.round(amt * 100) / 100).toLocaleString('he-IL') + (unit !== 'USD' ? ' ' + esc(unit) : '') + '</p>' +
        '<p class="is-size-7">מספיק לכ-' + nf(amt / 0.0001) + ' מיילים · בתוקף עד ' + expTxt + '</p></div>';
    } else if (d.plan) {
      h += '<div style="' + col + '"><p class="is-size-7 has-text-grey">חשבון אמזון</p><p class="is-size-7">תוכנית ' + esc(d.plan.type || '') + ', ללא קרדיט. החיוב לפי שימוש: כ-0.10$ ל-1,000 מיילים.</p></div>';
    } else if (d.planError) {
      h += '<div style="' + col + '"><p class="is-size-7 has-text-grey">קרדיט בחשבון אמזון</p><p class="is-size-7">שגיאה: ' + esc(d.planError) + '</p></div>';
    }
    if (d.updated) h += '<p class="is-size-7 has-text-grey" style="flex-basis:100%;margin:0">עודכן ' + new Date(d.updated).toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' }) + '</p>';
    return h;
  }
  function sesCard() {
    var dash = document.querySelector('section.dashboard');
    if (!dash) return;
    var box = dash.querySelector('#tiferet-ses');
    if (!box) {
      box = document.createElement('div');
      box.id = 'tiferet-ses';
      box.className = 'notification';
      box.style.cssText = 'margin-bottom:1.5rem;display:flex;gap:2rem;flex-wrap:wrap;align-items:flex-start;direction:rtl';
      var hdr = dash.querySelector('header');
      if (hdr && hdr.nextSibling) dash.insertBefore(box, hdr.nextSibling); else dash.prepend(box);
      box.innerHTML = sesHtml(sesData);
    }
    if (sesBusy || (sesData && Date.now() - sesAt < 5 * 60 * 1000)) return;
    sesBusy = true;
    fetch(SES_STATUS_URL).then(function (r) {
      return r.text().then(function (t) {
        try { return JSON.parse(t); } catch (e) { return { error: r.status === 503 ? 'עדיין לא הוגדר מפתח גישה' : ('HTTP ' + r.status) }; }
      });
    }).catch(function () { return { error: 'השירות לא זמין' }; }).then(function (d) {
      sesData = d; sesAt = Date.now(); sesBusy = false;
      var b = document.getElementById('tiferet-ses');
      if (b) b.innerHTML = sesHtml(d);
    });
  }

  (function () {
    var st = document.createElement('style');
    st.textContent = VAR_CSS;
    (document.head || document.documentElement).appendChild(st);
  })();

  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
