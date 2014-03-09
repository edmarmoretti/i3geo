		<?php
			include(dirname(__FILE__)."/../../ms_configura.php");
			include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
			//parser do arquivo para envio como imagem diretamente ao navegador
			if(!empty($_GET)){
				//echo $_GET["nomeimg"];exit;
				ob_clean();
				echoimg($_GET["nomeimg"],$_GET["tipo"]);
				exit;
			}
		?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<title>Lista de templates</title>
<style type="text/css">
body {
	margin: 20;
	padding: 20;
	font-size: 14px;
}
</style>
<link rel="stylesheet" type="text/css" href="../html/admin.css">
</head>
<body class=" yui-skin-sam fundoPonto">
	<div class="bordaSuperior">&nbsp;</div>
	<div class="mascaraPrincipal" id="divGeral" style="width: 100%;max-width:95%">
		<div id=cabecalhoPrincipal></div>
		<h1>Lista de templates para uso em aplica&ccedil;&otilde;es do sistema de metadados estat&iacute;sticos</h1>
		<?php
			$arqs = listaArquivos($locaplic.$metaestatTemplates);
			$arqs = $arqs["arquivos"];
			foreach($arqs as $arq){
				$nome = explode(".",$arq);
				$nome = $nome[0];
				$ext = explode(".",$arq);
				$ext = $ext[1];
				if($ext == "php"){
					echo "<p>Nome do template: <i>$arq</i></p>";
					$nomeimg = $locaplic.$metaestatTemplates."/".$nome.".png";
					if(file_exists($nomeimg)){
						echo "<img style='border:1px solid gray' src='";
						echo "metaestat_templates.php?&nomeimg=$nomeimg&tipo=png";
						echo "' />";
					}
				}
			}
		?>
	</div>
</body>