<?php
/*
Title: Monotor remoto

Monitora as mudanças em um mapa original. Obtém os dados necessários para atualizar o mapa clonado.

Veja:

<i3GEO.tema.dialogo.telaremota>

Arquivo:

i3geo/ferramentas/telaremota/openlayers1.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
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