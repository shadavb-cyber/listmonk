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
    ['שם פרטי', '.Subscriber.FirstName'],
    ['שם משפחה', '.Subscriber.LastName'],
    ['שם מלא', '.Subscriber.Name'],
    ['אימייל', '.Subscriber.Email']
  ];
  // Text used when the subscriber has no value (e.g. no name). Remembered between sessions.
  var varDefault = '';
  try { varDefault = localStorage.getItem('tfVarDefault') || ''; } catch (e) { /* ignore */ }
  function setVarDefault(v) {
    varDefault = String(v || '').replace(/["{}|\\]/g, '').trim();
    try { localStorage.setItem('tfVarDefault', varDefault); } catch (e) { /* ignore */ }
  }
  function varToken(path) {
    return varDefault ? '{{ ' + path + ' | default "' + varDefault + '" }}' : '{{ ' + path + ' }}';
  }
  var VAR_RE = /\{\{\s*\.Subscriber\.(FirstName|LastName|Name|Email)\s*(?:\|\s*default\s+(?:"|&quot;)([^"&]*)(?:"|&quot;)\s*)?\}\}/g;
  var VAR_LABEL = { FirstName: 'שם פרטי', LastName: 'שם משפחה', Name: 'שם מלא', Email: 'אימייל' };
  var CHIP_RE = /«(?:שם פרטי|שם משפחה|שם מלא|אימייל)(?: \/ [^»]*)?»/g;

  // UTM tagging: the campaign name is filled in automatically when the campaign is saved.
  var UTM_MARK = 'UTM_CAMPAIGN';
  var UTM_QS = 'utm_source=newsletter&utm_medium=email&utm_campaign=' + UTM_MARK;
  function addUtm(url) {
    url = String(url || '').trim();
    var track = /@TrackLink$/.test(url);
    if (track) url = url.replace(/@TrackLink$/, '');
    var hash = '', hi = url.indexOf('#');
    if (hi > -1) { hash = url.slice(hi); url = url.slice(0, hi); }
    url = url.replace(/([?&])utm_[a-z]+=[^&]*/g, '$1').replace(/[?&]+$/, '').replace(/\?&+/, '?').replace(/&&+/g, '&');
    url += (url.indexOf('?') > -1 ? '&' : '?') + UTM_QS;
    return url + hash + (track ? '@TrackLink' : '');
  }
  function utmName(name) {
    return encodeURIComponent(String(name || 'newsletter').trim().replace(/\s+/g, '-'));
  }
  function fillUtm(body, name) {
    return typeof body === 'string' ? body.split(UTM_MARK).join(utmName(name)) : body;
  }
  var VAR_CSS = '.tf-vars{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin:4px 0 8px;direction:rtl;font-family:Heebo,Arial,sans-serif}' +
    '.tf-vars span{font-size:12px;color:#666}' +
    '.tf-vars button{border:1px solid #C9A043;background:#FBF4E2;color:#13404B;border-radius:999px;padding:2px 10px;font-size:12px;cursor:pointer;font-family:inherit}' +
    '.tf-vars button:hover{background:#F3E3B5}' +
    '.tf-def{display:flex;align-items:center;gap:6px;flex-basis:100%;margin-top:2px}' +
    '.tf-def input{flex:1;min-width:0;border:1px solid #ddd;border-radius:6px;padding:3px 8px;font-size:12px;font-family:inherit;direction:rtl}';

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
      b.addEventListener('click', function (e) { e.preventDefault(); insertAtCaret(bar.__field || field, varToken(v[1])); });
      bar.appendChild(b);
    });
    var dl = doc.createElement('label');
    dl.className = 'tf-def';
    dl.innerHTML = '<span>אם חסר, להציג:</span>';
    var di = doc.createElement('input');
    di.type = 'text'; di.value = varDefault; di.placeholder = 'למשל: ידיד יקר (ריק = כלום)';
    di.title = 'הטקסט שיופיע לנמען שאין לו ערך בשדה. חל על המשתנים שתוסיף מעכשיו.';
    di.addEventListener('input', function () { setVarDefault(di.value); });
    dl.appendChild(di);
    bar.appendChild(dl);
    bar.__field = field;
    return bar;
  }

  function utmBar(doc, field) {
    var bar = doc.createElement('div');
    bar.className = 'tf-vars tf-utm';
    var b = doc.createElement('button');
    b.type = 'button'; b.textContent = '+ תיוג UTM עם שם הקמפיין';
    b.title = 'מוסיף לקישור utm_source, utm_medium ו-utm_campaign. שם הקמפיין נכנס אוטומטית בשמירת הקמפיין.';
    b.addEventListener('mousedown', function (e) { e.preventDefault(); });
    b.addEventListener('click', function (e) {
      e.preventDefault();
      var f = bar.__field || field, w = f.ownerDocument.defaultView;
      var proto = f.tagName === 'TEXTAREA' ? w.HTMLTextAreaElement.prototype : w.HTMLInputElement.prototype;
      Object.getOwnPropertyDescriptor(proto, 'value').set.call(f, addUtm(f.value));
      f.dispatchEvent(new w.Event('input', { bubbles: true }));
    });
    bar.appendChild(b);
    bar.__field = field;
    return bar;
  }

  // Visual editor sidebar: chips above the Content / Text fields of Text, Heading and Button blocks.
  var VAR_FIELDS = { 'Content': 1, 'תוכן': 1, 'Text': 1, 'טקסט': 1 };
  var URL_FIELDS = { 'Url': 1, 'קישור': 1, 'Click through URL': 1, 'קישור בלחיצה': 1 };
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
      var lt = (lb.textContent || '').trim(), isUrl = !!URL_FIELDS[lt];
      if (!VAR_FIELDS[lt] && !isUrl) continue;
      var fc = lb.closest('.MuiFormControl-root, .MuiTextField-root');
      if (!fc || inCanvas(fc)) continue;
      var field = fc.querySelector('textarea:not([aria-hidden]), input[type="text"], input:not([type])');
      if (!field) continue;
      var prev = fc.previousElementSibling;
      if (prev && prev.classList && prev.classList.contains('tf-vars')) { prev.__field = field; continue; }
      var bar = isUrl ? utmBar(doc, field) : varBar(doc, field);
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
        n.nodeValue = n.nodeValue.replace(VAR_RE, function (m, k, def) { return '«' + VAR_LABEL[k] + (def ? ' / ' + def : '') + '»'; });
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
    try { filterUI(); } catch (e) { /* ignore */ }
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
      if (i && /^(POST|PUT)$/i.test(i.m) && /\/api\/(templates|campaigns)(\/\d+)?(\/test)?$/.test(i.u.split('?')[0]) &&
          typeof d === 'string' && d.indexOf('"body"') > -1) {
        var o = JSON.parse(d), ch = false;
        if (o && typeof o.body === 'string' && (o.type === 'campaign_visual' || o.content_type === 'visual')) {
          o.body = rtl(o.body); ch = true;
        }
        if (o && /\/api\/campaigns/.test(i.u) && typeof o.body === 'string' && o.body.indexOf(UTM_MARK) > -1) {
          o.body = fillUtm(o.body, o.name); ch = true;
        }
        if (ch) d = JSON.stringify(o);
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
                  ed.insertContent('<span class="tf-var" data-label="' + v[0] + (varDefault ? ' / ' + varDefault : '') + '" contenteditable="false">' + varToken(v[1]) + '</span>&nbsp;');
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

  // ---- Subscriber filter builder (no SQL) + campaign list exclusion / recipient count ----
  var SEG_CSS =
    '#tf-filter,#tf-camp{direction:rtl;background:#FBF8F1;border:1px solid #E6E0D2;border-radius:8px;padding:12px 14px;margin:10px 0 14px;font-size:14px}' +
    '#tf-filter h4,#tf-camp h4{font-weight:600;margin:0 0 8px;color:#13404B}' +
    '.tf-row{display:flex;flex-wrap:wrap;gap:6px;align-items:center;margin-bottom:6px}' +
    '.tf-row select,.tf-row input,#tf-camp select{border:1px solid #d6d0c2;border-radius:6px;padding:4px 8px;font-size:13px;background:#fff;font-family:inherit;max-width:100%}' +
    '.tf-row input{min-width:160px}' +
    '.tf-x{border:0;background:none;color:#a33;cursor:pointer;font-size:16px;padding:0 6px}' +
    '.tf-btns{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:8px}' +
    '.tf-btn{border:1px solid #C9A043;background:#FBF4E2;color:#13404B;border-radius:6px;padding:4px 12px;cursor:pointer;font-family:inherit;font-size:13px}' +
    '.tf-btn.pri{background:#13404B;border-color:#13404B;color:#fff}' +
    '.tf-btn:disabled{opacity:.5;cursor:default}' +
    '.tf-note{color:#777;font-size:12px}' +
    '.tf-chip{display:inline-flex;align-items:center;gap:4px;background:#F3E3B5;color:#13404B;border-radius:999px;padding:2px 4px 2px 10px;margin:2px;font-size:13px}' +
    '.tf-sum{width:100%;max-width:520px;margin-top:8px;border-collapse:collapse}' +
    '.tf-sum td{padding:3px 6px;border-bottom:1px solid #eee5d3}.tf-sum td:last-child{text-align:left;font-weight:600}' +
    '.tf-sum tr.tot td{border-top:2px solid #C9A043;font-size:15px;color:#13404B}' +
    '#tf-filter pre{direction:ltr;text-align:left;white-space:pre-wrap;font-size:11px;background:#fff;padding:6px;margin-top:6px}';

  function sq(v) { return "'" + String(v).replace(/'/g, "''") + "'"; }
  function likeEsc(v) { return String(v).replace(/[\\%_]/g, '\\$&'); }
  function apiJ(path, opt) {
    opt = opt || {};
    if (opt.body && typeof opt.body !== 'string') {
      opt.headers = { 'Content-Type': 'application/json' };
      opt.body = JSON.stringify(opt.body);
    }
    return fetch(path, opt).then(function (r) {
      return r.json().then(function (j) {
        if (!r.ok) throw new Error((j && j.message) || ('HTTP ' + r.status));
        return j.data;
      });
    });
  }
  function countExp(exp) {
    return apiJ('/api/subscribers?per_page=1&page=1&query=' + encodeURIComponent(exp)).then(function (d) { return d.total || 0; });
  }
  var listsCache = null, listsAt = 0;
  function getLists(force) {
    if (!force && listsCache && Date.now() - listsAt < 60000) return Promise.resolve(listsCache);
    return apiJ('/api/lists?per_page=all').then(function (d) {
      listsCache = (d.results || d || []).slice().sort(function (a, b) { return a.name.localeCompare(b.name, 'he'); });
      listsAt = Date.now();
      return listsCache;
    });
  }
  var campsCache = null;
  function getCamps() {
    if (campsCache) return Promise.resolve(campsCache);
    return apiJ('/api/campaigns?per_page=all&no_body=true').then(function (d) {
      campsCache = (d.results || []).filter(function (c) { return c.status !== 'draft'; });
      return campsCache;
    });
  }
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'on') Object.keys(attrs.on).forEach(function (ev) { e.addEventListener(ev, attrs.on[ev]); });
      else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  function opts(sel, list, cur) {
    sel.innerHTML = '';
    list.forEach(function (o) {
      var op = el('option', { value: o[0], text: o[1] });
      if (String(o[0]) === String(cur)) op.selected = true;
      sel.appendChild(op);
    });
  }

  // Field definitions for the filter builder.
  var TEXT_OPS = [['contains', 'מכיל'], ['not_contains', 'לא מכיל'], ['equals', 'שווה ל'], ['starts', 'מתחיל ב'], ['ends', 'מסתיים ב'], ['empty', 'ריק'], ['not_empty', 'לא ריק']];
  var FIELDS = {
    name: { label: 'שם', kind: 'text', col: 'subscribers.name' },
    email: { label: 'אימייל', kind: 'text', col: 'subscribers.email' },
    phone: { label: 'טלפון', kind: 'text', col: "subscribers.attribs->>'phone'" },
    source: { label: 'מקור', kind: 'text', col: "subscribers.attribs->>'source'" },
    attr: { label: 'שדה נוסף (לפי שם)', kind: 'attr' },
    status: { label: 'סטטוס', kind: 'enum', ops: [['is', 'הוא'], ['not', 'אינו']], values: [['enabled', 'פעיל'], ['blocklisted', 'חסום']] },
    list: { label: 'רשימה', kind: 'list', ops: [['in', 'רשום לרשימה'], ['not_in', 'לא רשום לרשימה'], ['unsub', 'הסיר את עצמו מהרשימה']] },
    created: { label: 'תאריך הצטרפות', kind: 'date', ops: [['after', 'מתאריך'], ['before', 'עד תאריך']] },
    opened: { label: 'פתיחת מייל', kind: 'camp', ops: [['yes', 'פתח'], ['no', 'לא פתח']] },
    clicked: { label: 'לחיצה על קישור', kind: 'camp', ops: [['yes', 'לחץ'], ['no', 'לא לחץ']] },
    bounced: { label: 'החזרות', kind: 'flag', ops: [['any', 'יש החזרות'], ['hard', 'יש החזרה קשה'], ['none', 'אין החזרות']] }
  };

  function textSql(col, op, v) {
    var e = likeEsc(v);
    switch (op) {
      case 'contains': return col + ' ILIKE ' + sq('%' + e + '%');
      case 'not_contains': return 'COALESCE(' + col + ", '') NOT ILIKE " + sq('%' + e + '%');
      case 'equals': return 'LOWER(' + col + ') = LOWER(' + sq(v) + ')';
      case 'starts': return col + ' ILIKE ' + sq(e + '%');
      case 'ends': return col + ' ILIKE ' + sq('%' + e);
      case 'empty': return 'COALESCE(' + col + ", '') = ''";
      case 'not_empty': return 'COALESCE(' + col + ", '') <> ''";
    }
    return '';
  }
  function condSql(c) {
    var f = FIELDS[c.field];
    if (!f) return '';
    var needV = !(c.op === 'empty' || c.op === 'not_empty');
    if (f.kind === 'text') return (needV && !c.value) ? '' : textSql(f.col, c.op, c.value || '');
    if (f.kind === 'attr') {
      var key = String(c.key || '').replace(/[^\w֐-׿-]/g, '');
      if (!key || (needV && !c.value)) return '';
      return textSql('subscribers.attribs->>' + sq(key), c.op, c.value || '');
    }
    if (f.kind === 'enum') return 'subscribers.status ' + (c.op === 'not' ? '<>' : '=') + ' ' + sq(c.value || 'enabled');
    if (f.kind === 'list') {
      var id = parseInt(c.value, 10);
      if (!id) return '';
      if (c.op === 'unsub') return 'subscribers.id IN (SELECT subscriber_id FROM subscriber_lists WHERE list_id = ' + id + " AND status = 'unsubscribed')";
      return 'subscribers.id ' + (c.op === 'not_in' ? 'NOT IN' : 'IN') +
        ' (SELECT subscriber_id FROM subscriber_lists WHERE list_id = ' + id + " AND status <> 'unsubscribed')";
    }
    if (f.kind === 'date') {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(c.value || '')) return '';
      return c.op === 'before' ? "subscribers.created_at < (DATE " + sq(c.value) + " + 1)" : "subscribers.created_at >= DATE " + sq(c.value);
    }
    if (f.kind === 'camp') {
      var tbl = c.field === 'opened' ? 'campaign_views' : 'link_clicks';
      var cid = parseInt(c.value, 10);
      var where = 'subscriber_id IS NOT NULL' + (cid ? ' AND campaign_id = ' + cid : '');
      return 'subscribers.id ' + (c.op === 'no' ? 'NOT IN' : 'IN') + ' (SELECT subscriber_id FROM ' + tbl + ' WHERE ' + where + ')';
    }
    if (f.kind === 'flag') {
      if (c.op === 'none') return 'subscribers.id NOT IN (SELECT subscriber_id FROM bounces)';
      return 'subscribers.id IN (SELECT subscriber_id FROM bounces' + (c.op === 'hard' ? " WHERE type = 'hard'" : '') + ')';
    }
    return '';
  }

  var filt = { rows: [{ field: 'name', op: 'contains', value: '' }], match: 'AND', showSql: false, active: false };
  function filterSql() {
    var parts = filt.rows.map(condSql).filter(Boolean);
    if (!parts.length) return '';
    return parts.length === 1 ? parts[0] : parts.map(function (p) { return '(' + p + ')'; }).join('\n' + filt.match + ' ');
  }

  function renderFilter(box) {
    box.innerHTML = '';
    box.appendChild(el('h4', { text: 'סינון מנויים' }));
    var rowsWrap = el('div');
    box.appendChild(rowsWrap);
    filt.rows.forEach(function (c, i) {
      var f = FIELDS[c.field];
      var row = el('div', { class: 'tf-row' });
      var fs = el('select');
      opts(fs, Object.keys(FIELDS).map(function (k) { return [k, FIELDS[k].label]; }), c.field);
      fs.addEventListener('change', function () {
        var nf = FIELDS[fs.value];
        filt.rows[i] = { field: fs.value, op: (nf.ops || TEXT_OPS)[0][0], value: '' };
        renderFilter(box);
      });
      row.appendChild(fs);
      if (f.kind === 'attr') {
        var ki = el('input', { type: 'text', placeholder: 'שם השדה, למשל city' });
        ki.value = c.key || '';
        ki.addEventListener('input', function () { c.key = ki.value; });
        row.appendChild(ki);
      }
      var os = el('select');
      opts(os, f.ops || TEXT_OPS, c.op);
      os.addEventListener('change', function () { c.op = os.value; renderFilter(box); });
      row.appendChild(os);

      if (f.kind === 'text' || f.kind === 'attr') {
        if (c.op !== 'empty' && c.op !== 'not_empty') {
          var vi = el('input', { type: 'text', placeholder: 'ערך' });
          vi.value = c.value || '';
          vi.addEventListener('input', function () { c.value = vi.value; });
          vi.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); applyFilter(); } });
          row.appendChild(vi);
        }
      } else if (f.kind === 'enum') {
        var es = el('select');
        if (!c.value) c.value = f.values[0][0];
        opts(es, f.values, c.value);
        es.addEventListener('change', function () { c.value = es.value; });
        row.appendChild(es);
      } else if (f.kind === 'date') {
        var di = el('input', { type: 'date' });
        di.value = c.value || '';
        di.addEventListener('change', function () { c.value = di.value; });
        row.appendChild(di);
      } else if (f.kind === 'list' || f.kind === 'camp') {
        var ls = el('select');
        ls.appendChild(el('option', { value: '', text: 'טוען...' }));
        row.appendChild(ls);
        (f.kind === 'list' ? getLists() : getCamps()).then(function (items) {
          var o = items.map(function (x) { return [x.id, x.name + (f.kind === 'list' && x.subscriber_count != null ? ' (' + x.subscriber_count + ')' : '')]; });
          o.unshift(['', f.kind === 'list' ? 'בחר רשימה' : 'כל קמפיין']);
          opts(ls, o, c.value || '');
        });
        ls.addEventListener('change', function () { c.value = ls.value; });
      }
      if (filt.rows.length > 1) {
        row.appendChild(el('button', { class: 'tf-x', type: 'button', title: 'הסרת תנאי', text: '×', on: { click: function () { filt.rows.splice(i, 1); renderFilter(box); } } }));
      }
      rowsWrap.appendChild(row);
    });

    var btns = el('div', { class: 'tf-btns' });
    btns.appendChild(el('button', { class: 'tf-btn', type: 'button', text: '+ הוספת תנאי', on: { click: function () { filt.rows.push({ field: 'name', op: 'contains', value: '' }); renderFilter(box); } } }));
    var ms = el('select');
    opts(ms, [['AND', 'כל התנאים מתקיימים'], ['OR', 'לפחות תנאי אחד מתקיים']], filt.match);
    ms.addEventListener('change', function () { filt.match = ms.value; });
    if (filt.rows.length > 1) btns.appendChild(ms);
    btns.appendChild(el('button', { class: 'tf-btn pri', type: 'button', text: 'סינון', on: { click: applyFilter } }));
    btns.appendChild(el('button', { class: 'tf-btn', type: 'button', text: 'ניקוי', on: { click: clearFilter } }));
    btns.appendChild(el('a', { href: '#', class: 'tf-note', text: filt.showSql ? 'הסתרת השאילתה' : 'הצגת השאילתה',
      on: { click: function (e) { e.preventDefault(); filt.showSql = !filt.showSql; renderFilter(box); } } }));
    box.appendChild(btns);
    var msg = el('div', { class: 'tf-note', id: 'tf-filter-msg' });
    if (filt.active) msg.textContent = 'הסינון פעיל. המספר בכותרת הוא מספר המנויים שעונים לתנאים. אפשר לסמן את כולם ולבצע פעולה (הוספה לרשימה, חסימה וכו\').';
    box.appendChild(msg);
    if (filt.showSql) box.appendChild(el('pre', { text: filterSql() || '(אין תנאים)' }));
  }

  function subsVm() {
    var s = document.querySelector('section.subscribers');
    return s && s.__vue__;
  }
  function applyFilter() {
    var vm = subsVm(), exp = filterSql();
    var m = document.getElementById('tf-filter-msg');
    if (!vm) return;
    if (!exp) { if (m) m.textContent = 'חסר ערך באחד התנאים.'; return; }
    filt.active = true;
    vm.queryInput = '';
    vm.queryParams.search = '';
    vm.queryParams.queryExp = exp;
    vm.querySubscribers({ page: 1 });
    renderFilter(document.getElementById('tf-filter'));
  }
  function clearFilter() {
    var vm = subsVm();
    filt = { rows: [{ field: 'name', op: 'contains', value: '' }], match: 'AND', showSql: false, active: false };
    if (vm) {
      vm.isSearchAdvanced = false;
      vm.queryParams.queryExp = '';
      vm.querySubscribers({ page: 1 });
    }
    renderFilter(document.getElementById('tf-filter'));
  }
  function filterUI() {
    var sec = document.querySelector('section.subscribers');
    if (!sec) return;
    if (document.getElementById('tf-filter')) return;
    var ctl = sec.querySelector('.subscribers-controls');
    if (!ctl) return;
    var box = el('div', { id: 'tf-filter' });
    ctl.parentNode.insertBefore(box, ctl.nextSibling);
    renderFilter(box);
  }

  // ---- Campaign: exclude lists, unique recipient count, build a filtered send list ----
  var camp = { key: '', excl: [], last: '', busy: false, confirm: false, msg: '' };
  function campVm() {
    var s = document.querySelector('section.campaign');
    return s && s.__vue__;
  }
  function eligExp(ids) {
    return "subscribers.status <> 'blocklisted' AND subscribers.id IN (SELECT sl.subscriber_id FROM subscriber_lists sl " +
      'JOIN lists l ON l.id = sl.list_id WHERE sl.list_id IN (' + ids.join(',') + ") AND sl.status <> 'unsubscribed' " +
      "AND (l.optin <> 'double' OR sl.status = 'confirmed'))";
  }
  function exclExp(ids) {
    return 'subscribers.id NOT IN (SELECT subscriber_id FROM subscriber_lists WHERE list_id IN (' + ids.join(',') + '))';
  }
  function finalExp(inc, exc) {
    var e = eligExp(inc);
    return exc.length ? e + ' AND ' + exclExp(exc) : e;
  }
  function nf2(n) { return Number(n || 0).toLocaleString('he-IL'); }

  function renderCamp(box, vm) {
    var inc = (vm.form.lists || []).map(function (l) { return l.id; });
    box.innerHTML = '';
    box.appendChild(el('h4', { text: 'נמענים והחרגות' }));

    // Exclusion picker.
    var row = el('div', { class: 'tf-row' });
    row.appendChild(el('span', { text: 'החרגת רשימות (מי שנמצא בהן לא יקבל):' }));
    camp.excl.forEach(function (l) {
      row.appendChild(el('span', { class: 'tf-chip' }, [document.createTextNode(l.name),
        el('button', { class: 'tf-x', type: 'button', text: '×', on: { click: function () {
          camp.excl = camp.excl.filter(function (x) { return x.id !== l.id; }); camp.last = ''; renderCamp(box, vm); } } })]));
    });
    var sel = el('select');
    sel.appendChild(el('option', { value: '', text: '+ הוספת רשימה להחרגה' }));
    row.appendChild(sel);
    getLists().then(function (ls) {
      ls.forEach(function (l) {
        if (inc.indexOf(l.id) > -1 || camp.excl.some(function (x) { return x.id === l.id; })) return;
        sel.appendChild(el('option', { value: l.id, text: l.name + ' (' + nf2(l.subscriber_count) + ')' }));
      });
    });
    sel.addEventListener('change', function () {
      var id = parseInt(sel.value, 10);
      var l = (listsCache || []).filter(function (x) { return x.id === id; })[0];
      if (l) { camp.excl.push({ id: l.id, name: l.name }); camp.last = ''; renderCamp(box, vm); }
    });
    box.appendChild(row);

    var sum = el('div', { id: 'tf-camp-sum', class: 'tf-note', text: inc.length ? 'מחשב...' : 'בחר רשימות כדי לראות את מספר הנמענים.' });
    box.appendChild(sum);
    var act = el('div', { class: 'tf-btns' });
    box.appendChild(act);
    if (camp.msg) box.appendChild(el('div', { class: 'tf-note', text: camp.msg }));
    if (!inc.length) return;

    var key = inc.join(',') + '|' + camp.excl.map(function (x) { return x.id; }).join(',');
    var run = key;
    camp.last = key;
    var exc = camp.excl.map(function (x) { return x.id; });
    Promise.all([
      Promise.all(inc.map(function (id) { return countExp(eligExp([id])); })),
      countExp(eligExp(inc)),
      exc.length ? countExp(finalExp(inc, exc)) : null
    ]).then(function (r) {
      if (camp.last !== run) return;
      var per = r[0], total = per.reduce(function (a, b) { return a + b; }, 0), uniq = r[1];
      var fin = exc.length ? r[2] : uniq;
      var t = el('table', { class: 'tf-sum' });
      var add = function (a, b, cls) { t.appendChild(el('tr', cls ? { class: cls } : null, [el('td', { text: a }), el('td', { text: b })])); };
      (vm.form.lists || []).forEach(function (l, i) { add('ברשימה "' + l.name + '"', nf2(per[i])); });
      if (inc.length > 1) add('פחות מי שנמצא ביותר מרשימה אחת (מקבל פעם אחת)', '-' + nf2(total - uniq));
      if (exc.length) add('פחות מי שנמצא ברשימות ההחרגה', '-' + nf2(uniq - fin));
      add('סה"כ יקבלו את הקמפיין', nf2(fin), 'tot');
      sum.innerHTML = '';
      sum.appendChild(t);
      sum.appendChild(el('div', { class: 'tf-note', text: 'לא כולל מנויים חסומים ומי שהסיר את עצמו מהרשימה.' }));
      if (exc.length) {
        sum.appendChild(el('div', { class: 'tf-note', text: 'listmonk לא יודע להחריג רשימות בזמן השליחה, לכן צריך ליצור רשימת שליחה מסוננת ולשלוח אליה.' }));
        var b = el('button', { class: 'tf-btn pri', type: 'button',
          text: camp.confirm ? 'לאשר? תיווצר רשימה חדשה עם ' + nf2(fin) + ' נמענים' : 'יצירת רשימת שליחה מסוננת ובחירתה לקמפיין' });
        b.disabled = camp.busy || !vm.canEdit;
        b.addEventListener('click', function () {
          if (!camp.confirm) { camp.confirm = true; renderCamp(box, vm); return; }
          buildSendList(box, vm, inc, exc, fin);
        });
        act.appendChild(b);
        if (camp.confirm) act.appendChild(el('button', { class: 'tf-btn', type: 'button', text: 'ביטול', on: { click: function () { camp.confirm = false; renderCamp(box, vm); } } }));
      }
    }).catch(function (e) {
      if (camp.last === run) sum.textContent = 'שגיאה בחישוב: ' + e.message;
    });
  }

  function buildSendList(box, vm, inc, exc, expected) {
    camp.busy = true; camp.confirm = false;
    camp.msg = 'יוצר רשימה...';
    renderCamp(box, vm);
    var d = new Date();
    var name = 'שליחה: ' + (vm.form.name || 'קמפיין') + ' (' + d.toLocaleDateString('he-IL') + ')';
    var exNames = camp.excl.map(function (x) { return x.name; }).join(', ');
    var incNames = (vm.form.lists || []).map(function (x) { return x.name; }).join(', ');
    var newId;
    apiJ('/api/lists', { method: 'POST', body: { name: name, type: 'private', optin: 'single', status: 'active', tags: ['רשימת-שליחה'],
      description: 'נוצרה אוטומטית: ' + incNames + ' פחות ' + exNames } })
      .then(function (l) {
        newId = l.id;
        return apiJ('/api/subscribers/query/lists', { method: 'PUT', body: { query: finalExp(inc, exc), action: 'add', target_list_ids: [newId], status: 'confirmed' } });
      })
      .then(function () { return getLists(true); })
      .then(function () { return vm.$api.getLists({ minimal: true, per_page: 'all' }); })
      .then(function () {
        var all = (vm.lists && vm.lists.results) || [];
        var l = all.filter(function (x) { return x.id === newId; })[0] || { id: newId, name: name };
        vm.form.lists = [l];
        camp.excl = [];
        camp.busy = false;
        camp.msg = 'נוצרה הרשימה "' + name + '" ונבחרה לקמפיין במקום הרשימות הקודמות. זכור לשמור את הקמפיין.';
        camp.last = '';
        renderCamp(box, vm);
      })
      .catch(function (e) {
        camp.busy = false;
        camp.msg = 'שגיאה ביצירת הרשימה: ' + e.message + (newId ? ' (הרשימה נוצרה חלקית, מספר ' + newId + ')' : '');
        renderCamp(box, vm);
      });
  }

  function campUI() {
    var sec = document.querySelector('section.campaign');
    var box = document.getElementById('tf-camp');
    if (!sec) { camp.key = ''; return; }
    var vm = campVm();
    if (!vm || !vm.form) return;
    var ls = sec.querySelector('.list-selector');
    if (!ls) return;
    var pageKey = location.pathname;
    if (camp.key !== pageKey) { camp = { key: pageKey, excl: [], last: '', busy: false, confirm: false, msg: '' }; if (box) box.remove(); box = null; }
    if (!box || !box.isConnected) {
      box = el('div', { id: 'tf-camp' });
      ls.parentNode.insertBefore(box, ls.nextSibling);
      box.__inc = null;
    }
    var inc = (vm.form.lists || []).map(function (l) { return l.id; }).join(',');
    if (box.__inc !== inc) { box.__inc = inc; renderCamp(box, vm); }
  }

  (function () {
    var st = document.createElement('style');
    st.textContent = SEG_CSS;
    (document.head || document.documentElement).appendChild(st);
  })();
  setInterval(function () { try { campUI(); } catch (e) { /* ignore */ } }, 800);

  (function () {
    var st = document.createElement('style');
    st.textContent = VAR_CSS;
    (document.head || document.documentElement).appendChild(st);
  })();

  new MutationObserver(scan).observe(document.documentElement, { childList: true, subtree: true });
  scan();
})();
