<?php
define("I3GEOPATH", explode("serverapi",__FILE__)[0]);
if (! @empty($_GET["g_sid"])) {
    include (I3GEOPATH."/serverapi/safe.php");
    $map_file = $_SESSION["map_file"];
    $perfil = $_SESSION["perfil"];
    $locaplic = $_SESSION["locaplic"];
    $urli3geo = $_SESSION["urli3geo"];
    $editores = $_SESSION["editores"];
} else {
    include (I3GEOPATH."/classesphp/funcoes_gerais.php");
    include (I3GEOPATH."/ms_configura.php");
    $map_file = "";
    $perfil = "";
    $urli3geo = "";
    $editores = "";
}
switch (strtoupper($_GET["funcao"])) {
    case "PEGALISTADEMENUS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->pegaListaDeMenus($_GET["filtraOgc"], $_GET["filtraDown"]);
        break;
    case "PEGALISTADEGRUPOS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"], $_GET["filtro"]);
        $retorno = array(
            "idmenu" => $_GET["idmenu"] * 1,
            "grupos" => $m->pegaListaDeGrupos($_GET["idmenu"] * 1, "nao", "nao", $_GET["ordenaNome"], $_GET["filtraOgc"], $_GET["filtraDown"])
        );
        break;
    case "PEGALISTADESUBGRUPOS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"], $_GET["filtro"]);
        $retorno = $m->pegaListaDeSubGrupos($_GET["grupo"], $_GET["idmenu"]);
        break;
    case "PEGALISTADETEMAS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->pegaListaDeTemas($_GET["grupo"], $_GET["subgrupo"], $_GET["idmenu"]);
        break;
    case "PEGALISTADESISTEMAS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->pegaSistemas();
        break;
    case "PROCURARTEMASESTRELA":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $perfil, $locaplic, $urli3geo, $editores, $_GET["idioma"]);
        $retorno = $m->procurartemasestrela($_GET["nivel"], $_GET["fatorestrela"]);
        break;
    case "GETLAYERSWMS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_ows.php");
        $m = new Ows($_GET["servico"]);
        $retorno = $m->getLayersWMS($_GET["nivel"], $_GET["id_ws"], $_GET["tipo_ws"], $_GET["nomelayer"]);
        break;
    case "GETLAYERSARCGISREST":
        verifySql();
        include (I3GEOPATH."/classesphp/conexao.php");
        $sql = "SELECT link_ws from {$esquemaadmin}i3geoadmin_ws WHERE id_ws = '" . $_GET["id_ws"] * 1 . "'";
        $q = $dbh->query($sql, PDO::FETCH_ASSOC)->fetchAll();
        $servico = $q[0]["link_ws"];
        include (I3GEOPATH."/classesphp/classe_ows.php");
        if (! empty($_GET["nomelayer"])) {
            $m = new Ows($servico . "/" . $_GET["nomelayer"]);
        } else {
            $m = new Ows($servico);
        }
        $retorno = json_decode($m->getLayersARCGISREST());
        break;
    case "EPSGLIST":
        $retorno = listaEpsg();
        break;
    case "GETVARIABLES":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        $retorno = $m->listaVariavel("", $_GET["filtro_esquema"]);
        break;
    case "GETMEASURESVARIABLE":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        $data = $m->listaMedidaVariavel($_GET["variable"]);
        $retorno = array();
        foreach ($data as $d) {
            $retorno[] = array(
                "id_medida_variavel" => $d["id_medida_variavel"],
                "nomemedida" => $d["nomemedida"],
                "nome_variavel" => $d["nome_variavel"]
            );
        }
        break;
    case "GETREGIONSMEASURE":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        $data = $m->listaRegioesMedida($_GET["measure"]);
        $retorno = array();
        foreach ($data as $d) {
            $retorno[] = array(
                "nome_tipo_regiao" => $d["nome_tipo_regiao"],
                "codigo_tipo_regiao" => $d["codigo_tipo_regiao"]
            );
        }
        break;
    case "GETCLASSIFICATIONSMEASURE":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        $retorno = $m->listaClassificacaoMedida($_GET["measure"]);
        $retorno[] = array(
            "id_classificacao" => "",
            "nome" => "default (recalcula as classes com base em quartil)",
            "observacao" => ""
        );
        break;
    case "GETPARAMETERSMEASURE":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        $data = $m->listaParametro($_GET["measure"]);
        $retorno = array();
        foreach ($data as $d) {
            $retorno[] = array(
                "id_medida_variavel" => $d["id_medida_variavel"],
                "id_parametro_medida" => $d["id_parametro_medida"],
                "nome" => $d["nome"],
                "id_pai" => $d["id_pai"],
                "coluna" => $d["coluna"]
            );
        }
        break;
    case "GETPARAMETERSMEASUREVALUES":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        $retorno = $m->listaValoresParametro($_GET["parameter"]);
        break;
    case "GETREGIONS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        $retorno = $m->listaTipoRegiao("", false);
        break;
    case "GETREGIONSTREE":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_metaestatinfo.php");
        $m = new MetaestatInfo();
        $regioes = $m->listaHierarquiaRegioes($_GET["region"]);
        $valores = "";
        // se achou apenas uma regiao, pega os valores
        if (count($regioes) < 2 && $_GET["region"] != "") {
            $valores = $m->listaDadosRegiao($_GET["region"], $_GET["regionpai"], $_GET["regionpaivalue"]);
        }
        $retorno = (array(
            "regiaopai" => $_GET["region"],
            "regioes" => $regioes,
            "valores" => $valores
        ));
        break;

    case "GETINTERFACES":
        include (I3GEOPATH."/classesphp/funcoes_gerais.php");
        $pesquisarEm = array(
            $locaplic . "/interface"
        );
        if (isset($customDir) && $customDir != "" && $customDir != "interface") {
            $pesquisarEm[] = $locaplic . "/" . $customDir;
        }
        $retorno = array();
        foreach ($pesquisarEm as $p) {
            $r = listaArquivos($p);
            // var_dump($r);exit;
            $arqs = $r["arquivos"];
            $ext = $r["extensoes"];
            $nomes = $r["nomes"];
            $n = count($arqs);
            for ($i = 0; $i < $n; $i ++) {
                if (in_array($ext[$i], array(
                    "php",
                    "phtml",
                    "htm",
                    "html"
                ))) {
                    // verifica se tem a carga do js i3geo.js
                    $a = $p . "/" . $nomes[$i];
                    if(file_exists($a)){
                        $handle = fopen($a, "r");
                        $conteudo = fread($handle, filesize($a));
                        fclose($handle);
                        if (strstr($conteudo, "i3geo.js")) {
                            $retorno[] = "../" . basename($p) . "/" . $nomes[$i];
                        }
                    }
                }
            }
        }
        break;
    case "GETMAPS":
        verifySql();
        include (I3GEOPATH."/classesphp/classe_menutemas.php");
        $m = new Menutemas($map_file, $_GET["perfil"]);
        $retorno = $m->pegaListaDeMapas();
        break;
    case "DOWNLOADLAYER":
        session_name("i3GeoPHP");
        session_start();
        $retorno = downloadTema2("", $_GET["tema"], $locaplic, $dir_tmp, $postgis_mapa);
        $retorno["arquivos"] = "";
        $retorno["datas"] = "";
        $_SESSION["downloadZipTema"] = $retorno["shape-zip"];
        $retorno["shape-zip"] = basename($retorno["shape-zip"]);
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);
function verifySql(){
    $bl = array(
        "exec ",
        "exec(",
        "password",
        "select",
        "_decode",
        "passthru",
        "shell_exec",
        "escapeshellarg",
        "escapeshellcmd",
        "proc_close",
        "proc_open",
        "popen",
        "delete",
        "drop",
        "update",
        "insert",
        "system",
        ";"
    );
    foreach (array_keys($_GET) as $k) {
        $k = str_ireplace($bl, "", $k);
        $k = filter_var($k, FILTER_SANITIZE_STRING);
        if ($_GET[$k] != "''") {
            $v = strip_tags($_GET[$k]);
            $v = str_ireplace($bl, "", $v);
            $_GET[$k] = trim($v);
        }
    }
}