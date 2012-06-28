<html>
<style>
body {
	font: 14pt arial, helvetica, clean, sans-serif;
	color: rgb(100, 100, 100);
}
</style>
<body>
	<?php
	/*
	 Title: abrefontemapfile

	Abre no navegador a p&aacute;gina com os metadados sobre um tema.

	O link para os metadados &eacute; obtido do banco de administra&ccedil;&atilde;o.

	Para usar esse programa digite <http://localhost/i3geo/admin/abrefontemapfile.php?tema=codigo>

	Parametro:

	tema {string} - codigo do tema (nome do mapfile existente em i3geo/temas)

	Licenca:

	GPL2

	i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

	Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
	Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

	Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
	e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
	GNU conforme publicada pela Free Software Foundation;

	Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
	por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
	de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
	Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
	Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
		GNU junto com este programa; se n&atilde;o, escreva para a
	Free Software Foundation, Inc., no endere&ccedil;o
	59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

	Arquivo:

	i3geo/admin/abrefontemapfile.php
	*/
	error_reporting(0);
	if(!isset($locaplic))
	{
		$locaplic = "";
		include(__DIR__."/../ms_configura.php");
	}
	include_once($locaplic."/classesphp/pega_variaveis.php");
	include_once($locaplic."/admin/php/admin.php");
	if(!isset($tema))
	{
		echo "Nenhum tema definido.";exit;
	}
	$editor = verificaEditores($editores);
	$dbh = "";
	include($locaplic."/admin/php/conexao.php");
	$r = pegaDados("select * from ".$esquemaadmin."i3geoadmin_temas where codigo_tema = '$tema'");
	error_reporting(0);
	$link = $r[0]["link_tema"];
	if($link == "")
	{
		echo "O link para a fonte n&atilde;o est&aacute; cadastrado. Entre em contato com o administrador do sistema.";
	}
	else
	{echo "<meta http-equiv='refresh' content='0;url=$link'>";}
?>