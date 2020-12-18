var main = 1;

function completeAfter(cm, pred) {
    var cur = cm.getCursor();
    if (!pred || pred()) setTimeout(function() {
        if (!cm.state.completionActive)
            cm.showHint({
                completeSingle: false
            });
    }, 100);
    return CodeMirror.Pass;
}

function minify(editor) {

}
var htmlEditor = CodeMirror.fromTextArea(document.getElementById("html-code"), {
    mode: "text/html",
    lint: true,
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: true,
    autoCloseTags: true,
    gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    extraKeys: {
        "Ctrl-F": function(cm) {
            cm.foldCode(cm.getCursor());
        },
        "'<'": completeAfter,
        "Ctrl-Space": "autocomplete",
        "Alt-F": "findPersistent",
        "Ctrl-J": "toMatchingTag",
        "Ctrl-F": "Find"
    },
    value: document.documentElement.innerHTML,
    matchTags: {
        bothTags: true
    },
    foldGutter: true,
    scrollbarStyle: "simple",
    tabSize: 2,
    showCursorWhenSelecting: true,
    keyMap: "sublime"
});

// htmlEditor.setValue('');

requirejs.config({
    baseUrl: './',
    paths: {
        emmet: 'codemirror/addon/emmet/node_modules/emmet/lib',
        lodash: 'codemirror/addon/emmet/node_modules/emmet/node_modules/lodash/lodash'
    }
});

requirejs(['codemirror/addon/emmet/plugin', 'emmet/emmet'], function(plugin, emmet) {
    var loadJSON = function(url) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, false);
        xhr.send(null);
        return JSON.parse(xhr.responseText);
    };

    emmet.loadUserData({
        snippets: loadJSON('codemirror/addon/emmet/node_modules/emmet/lib/snippets.json'),
        caniuse: loadJSON('codemirror/addon/emmet/node_modules/emmet/lib/caniuse.json')
    });
});

var cssEditor = CodeMirror.fromTextArea(document.getElementById("css-code"), {
    mode: "text/css",
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: true,
    autoCloseBrackets: true,
    gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    extraKeys: {
        "Ctrl-F": function(cm) {
            cm.foldCode(cm.getCursor());
        },
        "';'": completeAfter,
        "Ctrl-Space": "autocomplete",
        "Alt-F": "findPersistent",
        "Ctrl-F": "Find"
    },
    value: document.documentElement.innerHTML,
    matchBrackets: true,
    foldGutter: true,
    scrollbarStyle: "simple",
    lint: true,
    keyMap: "sublime"
});

function getURL(url, c) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.send();
    xhr.onreadystatechange = function() {
        if (xhr.readyState != 4) return;
        if (xhr.status < 400) return c(null, xhr.responseText);
        var e = new Error(xhr.responseText || "No response");
        e.status = xhr.status;
        c(e);
    };
}

var server;
getURL("CodeMirror/addon/tern/defs/ecmascript.json", function(err, code) {
    if (err) throw new Error("Request for ecmascript.json: " + err);
    server = new CodeMirror.TernServer({
        defs: []
    });
    jsEditor.setOption("extraKeys", {
        "Ctrl-Space": "autocomplete",
        "Ctrl-Alt-T": function(cm) {
            server.complete(cm);
        },
        "Ctrl-I": function(cm) {
            server.showType(cm);
        },
        "Ctrl-O": function(cm) {
            server.showDocs(cm);
        },
        "Alt-.": function(cm) {
            server.jumpToDef(cm);
        },
        "Alt-,": function(cm) {
            server.jumpBack(cm);
        },
        "Ctrl-Q": function(cm) {
            server.rename(cm);
        },
        "Ctrl-.": function(cm) {
            server.selectName(cm);
        }
    })
    jsEditor.on("cursorActivity", function(cm) {
        server.updateArgHints(cm);
    });
});

var jsEditor = CodeMirror.fromTextArea(document.getElementById("js-code"), {
    mode: "text/javascript",
    styleActiveLine: true,
    lineNumbers: true,
    lineWrapping: true,
    autoCloseBrackets: true,
    gutters: ["CodeMirror-lint-markers", "CodeMirror-linenumbers", "CodeMirror-foldgutter"],
    extraKeys: {
        "'\n'": completeAfter,
        "Ctrl-Space": "autocomplete",
        "Alt-F": "findPersistent",
        "Ctrl-J": "toMatchingTag",
        "Ctrl-F": "Find"
    },
    value: document.documentElement.innerHTML,
    matchBrackets: true,
    foldGutter: true,
    scrollbarStyle: "simple",
    lint: true,
    keyMap: "sublime"
});

htmlEditor.setOption("theme", "codium-dark");
cssEditor.setOption("theme", "codium-dark");
jsEditor.setOption("theme", "codium-dark");

var delay;
htmlEditor.on("change", function() {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 2000);
});

cssEditor.on("change", function() {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 2000);
});

jsEditor.on("change", function() {
    clearTimeout(delay);
    delay = setTimeout(updatePreview, 2000);
});

var titleOut = $('.config-output .tab .text')[0],
    iconOut = $('.config-output .tab .icon')[0];

function updatePreview() {
    var previewFrame = document.getElementById('preview');
    var preview = previewFrame.contentDocument || previewFrame.contentWindow.document;
    preview.open();
    var value = '<style>' + cssEditor.getValue() + '</style>' + htmlEditor.getValue() + '<script>' + jsEditor.getValue() + '<' + '/script>';
    preview.write(value);
    preview.close();
    var title = String(htmlEditor.getValue()
            .replace(/\n/gi, " ")
            .match(/<title>\s?.{1,}?\s?<\/title>/gi))
        .replace(/<title>/gi, "")
        .replace(/<\/title>/gi, "")
        .replace(/</gi, "&lt;")
        .replace(/</gi, "&gt;")
        .replace(/\n/gi, "");

    var icon = String(htmlEditor.getValue()
            .replace(/\n/gi, "")
            .replace(/\"/gi, "")
            .replace(/\'/gi, "")
            .replace(/\s/gi, "")
            .match(/<link(rel=iconhref=.{1,}?>|href=.{1,}?rel=icon)/gi))
        .replace(/<link/gi, "")
        .replace(/rel=icon/gi, "")
        .replace(/href=/gi, "")
        .replace(/>/gi, "");
    if (title != null) {
        titleOut.innerHTML = title;
    }
    if (title == "null") {
        titleOut.innerHTML = "localhost";
    }
    if (icon != null) {
        iconOut.innerHTML = "<img src='" + icon + "'>";
    }
    if (icon == "null") {
        iconOut.innerHTML = '';
    }
}
setTimeout(updatePreview, 300);