<?php 
include_once(dirname(__FILE__)."/login.php");
$funcoesEdicao = array(
		"OBTEMDADOSTABELADB"
);
if(in_array(strtoupper($funcao),$funcoesEdicao)){
	if(verificaOperacaoSessao("admin/metaestat/geral") == false){
		exit;
	}
}
?>
<html>
<head>
<meta http-equiv="content-type" content="text/html; charset=ISO-8859-1">
<style type="text/css">
body {
	margin: 0;
	padding: 0;
}
</style>
<script type="text/javascript" src="../js/core.js"></script>
<script type="text/javascript" src="../js/estat_editor.js"></script>
<link rel="stylesheet" type="text/css" href="admin.css">
</head>
<body>
	<script>
		//necessario para a ferramenta login e outras
		i3GEO.configura = {
			locaplic : "../.."
		};
		temp = function() {
			<?php echo "i3GEOadmin.editor.tabela.mostrar($nreg, '$nome_tabela', '$nomeEsquema', '$codigo_estat_conexao', window);\n"; ?>
		};
		i3GEO.login.verificaOperacao("admin/metaestat/geral",i3GEO.configura.locaplic, temp, "sessao",i3GEO.login.dialogo.abreLogin);
	</script>
</body>
