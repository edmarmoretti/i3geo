<?php
namespace mapserverapi;
use PDO;
use PDOException;
class Catalog
{

    function __construct()
    {
        $this->util = new \mapserverapi\Util();
        include ("../../classesphp/conexao.php");
        $this->locaplic = $locaplic;
        $this->esquemaadmin = $esquemaadmin;
        $this->dbh = $dbh;
        $this->groupsUser = $this->getGroupsUser();
    }
    //grupos do usuario logado
    function getGroupsUser()
    {
        if (empty($_COOKIE["i3geocodigologin"])) {
            return array();
        }
        $nameatual = session_name();
        $idatual = session_id();
        session_write_close();
        session_name("i3GeoLogin");
        session_id($_COOKIE["i3geocodigologin"]);
        session_start();
        $res = $_SESSION["gruposusr"];
        session_write_close();
        session_name("$nameatual");
        session_id($idatual);
        session_start();
        return $res;
    }

    function getData($sql = "")
    {
        $resultado = array();
        //error_reporting(0);
        $q = $this->dbh->query($sql, PDO::FETCH_ASSOC);
        if ($q) {
            $resultado = $q->fetchAll();
            return $resultado;
        } else {
            return false;
        }
    }

    function getMenus($lang)
    {
        $perfis = [];
        if(isset($_SESSION["perfil"])){
            $perfil = $_SESSION["perfil"];
            $perfis = @explode(",",str_replace(" ",",",$perfil));
        }
        $coluna = $lang;
        if ($lang == "pt") {
            $coluna = "nome_menu";
        }
        $sql = "SELECT publicado_menu,perfil_menu,aberto,desc_menu,id_menu,CASE $coluna WHEN '' THEN nome_menu ELSE $coluna END as nome_menu from " . $this->esquemaadmin . "i3geoadmin_menus where publicado_menu != 'NAO' or publicado_menu is null order by nome_menu";
        $menus = $this->getData($sql);
        $rootLayers = $this->getRootMenusLayers($lang);
        $rootLayers = $this->util->array_group_by($rootLayers,"id_menu");
        $resultado = array();
        foreach ($menus as $menu) {
            $perfisMenu = @explode(",",str_replace(" ",",",$menu["perfil_menu"]));
            if($menu["perfil_menu"] == "" || is_null($menu["perfil_menu"]) || in_array($perfis,$perfisMenu)){
                $status = "fechado";
                if (strtolower($menu["aberto"]) == "sim") {
                    $status = "aberto";
                }

                $resultado[] = array(
                    "desc" => $this->util->txt2utf($menu["desc_menu"]),
                    "publicado" => $menu["publicado_menu"],
                    "nomemenu" => $this->util->txt2utf($menu["nome_menu"]),
                    "idmenu" => $menu["id_menu"],
                    "arquivo" => "",
                    "status" => $status,
                    "url" => "",
                    "temas" => isset($rootLayers[$menu["id_menu"]]) ? @$rootLayers[$menu["id_menu"]] : []
                );
            }
        }
        return $resultado;
    }

    function getMenuGroups($id_menu,$lang)
    {
    }
    function getRootMenusLayers($lang){
        $coluna = $lang;
        if ($lang == "pt") {
            $coluna = "nome_tema";
        }
        $sql = "select i3geoadmin_raiz.id_menu, id_nivel,ordem,codigo_tema,id_raiz,i3geoadmin_raiz.id_tema,CASE $coluna WHEN '' THEN nome_tema ELSE $coluna END as nome_tema,tipoa_tema,perfil, ogc_tema, download_tema, link_tema FROM ".$this->esquemaadmin."i3geoadmin_raiz LEFT JOIN ".$this->esquemaadmin."i3geoadmin_temas ON i3geoadmin_temas.id_tema = i3geoadmin_raiz.id_tema ";
        $sql .= " where i3geoadmin_raiz.nivel = 0 order by ordem";
        $layers = $this->getData($sql);
        $layers = $this->validateLayers($layers);
        foreach ($layers as &$layer){
            $layer["nome_tema"] = $this->util->txt2utf($layer["nome_tema"]);
        }
        return $layers;
    }
    function validateLayers($layers){
        $sql = "select id_grupo,codigo_tema from " . $this->esquemaadmin . "i3geousr_grupotema as gt," . $this->esquemaadmin . "i3geoadmin_temas as te where gt.id_tema = te.id_tema";
        $res = $this->getData($sql);
        $restritos = array();
        foreach ($res as $r) {
            if (in_array($r["codigo_tema"], $restritos)) {
                array_push($restritos[$r["codigo_tema"]], $r["id_grupo"]);
            } else {
                $restritos[$r["codigo_tema"]] = array(
                    $r["id_grupo"]
                );
            }
        }
        $indevidos = array();
        if (count($restritos) > 0) {
            $gruposusr = $this->groupsUser;
            $c = count($gruposusr);
            while (list ($key, $val) = each($restritos)) {
                if (array_search($gruposusr, $val) === true || $c == 0) {
                    array_push($indevidos, $key);
                }
            }
        } else {
            return $layers;
        }
        if (count($indevidos) > 0){
            $res = array();
            foreach($layers as $l){
                if(!in_array($l["codigo_tema"],$indevidos)){
                    array_push($res,$l);
                }
            }
            return $res;
        }
        else {
            return $layers;
        }
    }
}