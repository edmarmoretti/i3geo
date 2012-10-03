<?php
/*
Title: Monotor remoto

Monitora as mudan&ccedil;as em um mapa original. Obt&eacute;m os dados necess&aacute;rios para atualizar o mapa clonado.

Veja:

<i3GEO.tema.dialogo.telaremota>

Arquivo:

i3geo/ferramentas/telaremota/openlayers1.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAวรO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se nใo, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
session_name("i3GeoPHP");
session_id($_GET["g_sid"]);
session_start();
if($_GET["funcao"] == "registra"){
	$_SESSION["extenttelaremota"] = $_GET["ext"];
	ob_clean();
	echo header("Content-type: text/html \n\n");	
	echo json_encode(array("data"=>"ok"));
	return;
}
if($_GET["funcao"] == "recupera"){
	ob_clean();
	echo header("Content-type: text/html \n\n");	
	echo json_encode(array("data"=>array("extent"=>$_SESSION["extenttelaremota"],"contadorsalva"=>$_SESSION["contadorsalva"])));
	return;
}
?>