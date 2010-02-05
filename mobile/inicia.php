<?php
/*
Title: inicia.php

Cria o mapa e abre a interface.

Esse programa inclui o arquivo i3geo/ms_criamapa.php ativando alguns parâmetros especiais para a versão mobile.

Cria os arquivos temporários do mapa e faz o include de <mobile.php>

Licenca:

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.


Arquivo: i3geo/mobile/inicia.php

*/
include_once("../classesphp/pega_variaveis.php");
$caminho = "../";
if(!isset($layers))
$layers = $temasa;
$executa = "iniciamobile";
if(!isset($tipo)){$tipo = "inicia";}
include("../ms_criamapa.php");

/*
Function: iniciamobile

Função que será executada pelo ms_criamapa.php

Faz o include do programa mobile.php.

As variáveis wmobile e hmobile, que especificam o tamanho da tela do dispositivo, são definidas por index.php.

A variável tmpfname é definida no processo de criação do mapa, feito pelo ms_criamapa.php, e guarda o nome do mapfile criado.

Globais:

$wmobile

$hmobile

$tmpfname

$postgis_mapa
*/
function iniciamobile()
{
	global $wmobile,$hmobile,$tmpfname,$tipo,$postgis_mapa;
	substituiCon($tmpfname,$postgis_mapa);
	$mapa = ms_newMapObj($tmpfname);
	$mapa->setsize($wmobile,$hmobile);
	$eb = $mapa->scalebar;
	$eb->set("style",0);
	$eb->set("position",MS_LL);
	$cornb = $eb->backgroundcolor;
	//$n = explode(",",$bcor);
	$cornb->setrgb(255,0,0);
	$mapa->save($tmpfname);
	include("mobile.php");
	exit;
}	
?>