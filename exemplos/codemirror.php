<?php
$p = strip_tags($_GET["pagina"]);
if($_GET["nopage"] != "sim"){
	include ($p);
	echo "
		<script>
		i3GEO.janela.cria(
		'950px',
		'390px',
		'codemirror.php?pagina={$p}&nopage=sim',
		'',
		'',
		'C&oacute;digo',
		'codigoPagina',
		false,
		'hd',
		function(){},
		function(){
			i3GEO.janela.minimiza('codigoPagina');
		}
		);
		</script>
	";
	exit;
}
?>
<!doctype html>
<head>
<title>CodeMirror: HTML completion demo</title>
<meta charset="utf-8" />
<link rel=stylesheet href="../pacotes/codemirror/doc/docs.css">

<link rel="stylesheet" href="../pacotes/codemirror/lib/codemirror.css">
<link rel="stylesheet" href="../pacotes/codemirror/addon/hint/show-hint.css">
<script src="../pacotes/codemirror/lib/codemirror.js"></script>
<script src="../pacotes/codemirror/addon/hint/show-hint.js"></script>
<script src="../pacotes/codemirror/addon/hint/xml-hint.js"></script>
<script src="../pacotes/codemirror/addon/hint/html-hint.js"></script>
<script src="../pacotes/codemirror/mode/xml/xml.js"></script>
<script src="../pacotes/codemirror/mode/javascript/javascript.js"></script>
<script src="../pacotes/codemirror/mode/css/css.js"></script>
<script src="../pacotes/codemirror/mode/htmlmixed/htmlmixed.js"></script>
<style type="text/css">
.CodeMirror {
	border-top: 1px solid #888;
	border-bottom: 1px solid #888;
}
</style>
</head>
<body>
	<textarea id="codeArea" style="text-align: left; width: 90%; height: 95%">
<?php include ($p); ?>
</textarea>
	<script>
CodeMirror.fromTextArea(document.getElementById("codeArea"), {
	mode: "text/html",
	lineNumbers: true
});
</script>
</body>
