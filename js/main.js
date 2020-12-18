var wordWrap = 1,
	indentSize = 2,
	inDisplayLang = 1,
	inputLayout = 1;

$('.widget-1').click(function() {
	$('.widgets').removeClass('active');
	$('.widget-active').css({'display':'none'})
	$('#web').css({'display':'none'});
	$('.widget-active-1').css({'display':'block'});
	$('.widget-1').addClass('active');
});

$('.widget-2').click(function() {
	$('.widgets').removeClass('active');
	$('.widget-active').css({'display':'none'})
	$('#web').css({'display':'none'});
	$('.widget-active-2').css({'display':'block'});
	$('.widget-2').addClass('active');
});

$('.widget-3').click(function() {
	$('.widgets').removeClass('active');
	$('.widget-active').css({'display':'none'})
	$('#web').css({'display':'block'});
	$('.widget-3').addClass('active');
});

$('.input .CodeMirror').css({'display':'none'});
$('.input .CodeMirror:nth-of-type(2)').css({'display':'block'});

$('.files-editor .html').click(function() {
	$('.input .CodeMirror').css({'display':'none'});
	$('.input .CodeMirror:nth-of-type(2)').css({'display':'block'});
	$('.files-editor .tab').removeClass('tab-active');
	$('.files-editor .html').addClass('tab-active');
	inDisplayLang = 1;
});

$('.files-editor .css').click(function() {
	$('.input .CodeMirror').css({'display':'none'});
	$('.input .CodeMirror:nth-of-type(3)').css({'display':'block'});
	$('.files-editor .tab').removeClass('tab-active');
	$('.files-editor .css').addClass('tab-active');
	inDisplayLang = 2;
});

$('.files-editor .js').click(function() {
	$('.input .CodeMirror').css({'display':'none'});
	$('.input .CodeMirror:nth-of-type(4)').css({'display':'block'});
	$('.files-editor .tab').removeClass('tab-active');
	$('.files-editor .js').addClass('tab-active');
	inDisplayLang = 3;
});

$('.word-wrap').click(function() {
	if (wordWrap == 1) {
		$('.word-wrap .fa').removeClass('fa-circle');
		$('.word-wrap .fa').addClass('fa-circle-o');
		wordWrap = 0;
		$('.input .CodeMirror').removeClass('CodeMirror-wrap');
	}else if (wordWrap == 0) {
		$('.word-wrap .fa').removeClass('fa-circle-o');
		$('.word-wrap .fa').addClass('fa-circle');
		wordWrap = 1;
		$('.input .CodeMirror').addClass('CodeMirror-wrap');
		$('.CodeMirror-simplescroll-horizontal').css({'display':'none'});
	}
});

$('.indent-size input').change(function() {
	var size = $(this)[0].value;
	if (size > 4) {
		if (inDisplayLang == 1) {
			htmlEditor.setOption("tabSize", 4);
		}else if (inDisplayLang == 2) {
			cssEditor.setOption("tabSize", 4);
		}else {
			jsEditor.setOption("tabSize", 4);
		}
	}
	else if (size < 1) {
		if (inDisplayLang == 1) {
			htmlEditor.setOption("tabSize", 1);
		}else if (inDisplayLang == 2) {
			cssEditor.setOption("tabSize", 1);
		}else {
			jsEditor.setOption("tabSize", 1);
		}
	}
	else {
		if (inDisplayLang == 1) {
			htmlEditor.setOption("tabSize", size);
		}else if (inDisplayLang == 2) {
			cssEditor.setOption("tabSize", size);
		}else {
			jsEditor.setOption("tabSize", size);
		}
	}
});

$(document).keyup(function () {
	if (inDisplayLang == 1) {
		$('.cursor-place .line')[0].innerHTML = htmlEditor.getCursor().line + 1;
		$('.cursor-place .ch')[0].innerHTML = htmlEditor.getCursor().ch + 1;
	} 
	else if (inDisplayLang == 2) {
		$('.cursor-place .line')[0].innerHTML = cssEditor.getCursor().line + 1;
		$('.cursor-place .ch')[0].innerHTML = cssEditor.getCursor().ch + 1;
	}
	else {
		$('.cursor-place .line')[0].innerHTML = jsEditor.getCursor().line + 1;
		$('.cursor-place .ch')[0].innerHTML = jsEditor.getCursor().ch + 1;
	}
});

$('.input .CodeMirror span').hover(function () {
	if (inDisplayLang == 1) {
		$('.cursor-place .line')[0].innerHTML = htmlEditor.getCursor().line + 1;
		$('.cursor-place .ch')[0].innerHTML = htmlEditor.getCursor().ch + 1;
	} 
	else if (inDisplayLang == 2) {
		$('.cursor-place .line')[0].innerHTML = cssEditor.getCursor().line + 1;
		$('.cursor-place .ch')[0].innerHTML = cssEditor.getCursor().ch + 1;
	}
	else {
		$('.cursor-place .line')[0].innerHTML = jsEditor.getCursor().line + 1;
		$('.cursor-place .ch')[0].innerHTML = jsEditor.getCursor().ch + 1;
	}
});

$('.CodeMirror:nth-of-type(2)').click(function () {
	$('.cursor-place .line')[0].innerHTML = htmlEditor.getCursor().line + 1;
	$('.cursor-place .ch')[0].innerHTML = htmlEditor.getCursor().ch + 1;
});

$('.CodeMirror:nth-of-type(3)').click(function () {
	$('.cursor-place .line')[0].innerHTML = cssEditor.getCursor().line + 1;
	$('.cursor-place .ch')[0].innerHTML = cssEditor.getCursor().ch + 1;
});

$('.CodeMirror:nth-of-type(4)').click(function () {
	$('.cursor-place .line')[0].innerHTML = jsEditor.getCursor().line + 1;
	$('.cursor-place .ch')[0].innerHTML = jsEditor.getCursor().ch + 1;
});

$(window).bind('keydown', function(e) {
    if (e.ctrlKey && e.keyCode == 13) {
    	if (inDisplayLang == 1) {
        	beautify(htmlEditor, $('#html-code'));
    	}else if (inDisplayLang == 2) {
        	beautify(cssEditor, $('#css-code'));
    	}else {
        	beautify(jsEditor, $('#js-code'));
    	}
    }
});

$('.widget.fa-save').click(function () {

	writeFile('index.htm', htmlEditor, function(err) {
		if(err) {
			throw err;
		}
	});
});