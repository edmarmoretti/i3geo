<?php
/*
Title: wscliente.php

Executa requisi&ccedil;&otilde;es a Web Services convencionais ou nos padr&otilde;es OGC.

Possibilita a leitura dos metadados dos servi&ccedil;os e tamb&eacute;m a execu&ccedil;&atilde;o das fun&ccedil;&otilde;es existentes.

&Eacute; utilizado apenas pela aplica&ccedil;&atilde;o wscliente .

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
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/wscliente.php

Parametros:

$funcao {string} - nome da fun&ccedil;&atilde;o que ser&aacute; executada


As vari&aacute;veis globais de cada fun&ccedil;&atilde;o devem ser enviadas como pr&acirc;metros ao ser feita a requisi&ccedil;&atilde;o

*/
include_once (dirname(__FILE__)."/sani_request.php");
$_GET = array_merge($_GET,$_POST);
include_once("lews/wms_functions.php");
include_once("carrega_ext.php");
include(dirname(__FILE__)."/../ms_configura.php");

$onlineresource = $_GET["onlineresource"];
$tipo = $_GET["tipo"];
$servico = $_GET["servico"];
$param = $_GET["param"];
$funcaows = $_GET["funcaows"];
$rss = $_GET["rss"];
//
//busca o getcapabilities de um wms
//
$funcao = $_GET["funcao"];

if ($funcao == "listaRSSwsARRAY")
{
    $tipos = explode(",",$tipo);
    if(count($tipos) > 1){
        $r = array();
        foreach($tipos as $tipo){
            $d = listaRSSwsARRAY();
            $r = array_merge($r,$d["canais"]);
        }
        ob_clean();
        header('Content-Type: application/json');
        echo json_encode(["data"=>$r]);
    } else {
        //para efeitos de compatibilidade
        ob_clean();
        header('Content-Type: application/json');
        echo json_encode(["data"=>listaRSSwsARRAY()]);
    }
    exit;
}

function listaRSSwsARRAY()
{
    global $rss,$locaplic,$tipo,$esquemaadmin;
    if(!isset($tipo)){$tipo = "GEORSS";}
    include_once("$locaplic/classesphp/funcoes_gerais.php");
    include_once("$locaplic/classesphp/xml.php");
    include("$locaplic/ms_configura.php");
    if($esquemaadmin != ""){
        $esquemaadmin = $esquemaadmin.".";
    }
    $rsss = explode("|",$rss);
    if(count($rsss) == 0){
        $rsss = array(" ");
    }
    $erro = "Erro. Nao foi possivel ler o arquivo";
    $protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
    $urli3geo = strtolower($protocolo[0])."://".$_SERVER['HTTP_HOST']."/".basename($locaplic);
    foreach ($rsss as $r){
        if($r == "" || $r == " "){
            if($tipo == "KML"){
                $canali = simplexml_load_string(geraXmlKmlrss($locaplic));
                $linkrss = $urli3geo."/rss/xmlkml.php";
            }
            if($tipo == "GEORSS"){
                $canali = simplexml_load_string(geraXmlGeorss($locaplic));
                $linkrss = $urli3geo."/rss/xmlgeorss.php";
            }
            if($tipo == "GEOJSON"){
                $canali = simplexml_load_string(geraXmlGeojson($locaplic));
                $linkrss = $urli3geo."/rss/xmlgeorss.php";
            }
            if($tipo == "WMS" || $tipo == "WMS-Tile" || $tipo == "WMS-Time"){
                $canali = simplexml_load_string(geraXmlWMS($locaplic));
                $linkrss = $urli3geo."/rss/xmlservicoswms.php";
            }
            if($tipo == "WMSMETAESTAT") {
                $canali = simplexml_load_string(geraXmlWMSmetaestat($locaplic));
                $linkrss = $urli3geo."/rss/xmlservicoswms.php";
            }
            if($tipo == "WS"){
                $canali = simplexml_load_string(geraXmlWS($locaplic));
                $linkrss = $urli3geo."/rss/xmlservicosws.php";
            }

            if($tipo == "ARCGISREST"){
                $canali = simplexml_load_string(geraXmlARCGISREST($locaplic));
                $linkrss = "";
            }
        } else {
            $canali = simplexml_load_file($rss);
        }
        if($r != "")
        $linhas["rss"] = "<a href='".$r."' target=blank ><img style='border:0px solid white;' src='../../imagens/rss.gif' /></a>";
        else{
            $linhas["rss"] = "<a href='".$linkrss."' target=blank ><img style='border:0px solid white;' src='../../imagens/rss.gif' /></a>";
        }
        //var_dump($canali);
        $canais = array();
        foreach ($canali->channel->item as $item){
            $urlservice = ixml($item,"link");
            $title = ixml($item,"title");
            $canais[] = array("id_ws"=>(ixml($item,"id")),"title"=>$title,"description"=>(ixml($item,"description")),"link"=>$urlservice,"author"=>(ixml($item,"author")),"nacessos"=>(ixml($item,"nacessos")),"nacessosok"=>(ixml($item,"nacessosok")),"tipo_ws"=>(ixml($item,"tipo")));
        }
        $linhas["canais"] = $canais;
    }
    //$cp->set_data($linhas);
    return $linhas;
}

?>
