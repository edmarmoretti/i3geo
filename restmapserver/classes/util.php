<?php
namespace restmapserver;

class Util
{
    function __construct()
    {}

    /**
     * Valida se a SECTION correspondente ao idsection foi criada por um navegador
     * semelhante ao que esta fazendo uma requisicao
     *
     * @param string $idsection
     * @return boolean
     */
    function checkFingerPrint($idsection = "")
    {
        $f = explode(",", $_SESSION["fingerprint"]);
        if ($f[0] != md5('I3GEOSEC' . $_SERVER['HTTP_USER_AGENT'] . $idsection)) {
            header("Content-type: application/json");
            echo json_encode(array(
                "errorMsg" => "Tentativa de acesso nao permitida. Inicie um novo mapa."
            ));
            exit();
        }
        return true;
    }

    /**
     * Sanitiza as strings de um um array
     *
     * @param array $strings
     * @return array
     */
    function sanitizestrings($strings = [])
    {
        $bl = array(
            "exec ",
            "exec(",
            "password",
            "_decode",
            "passthru",
            "shell_exec",
            "escapeshellarg",
            "escapeshellcmd",
            "proc_close",
            "proc_open",
            ";"
        );
        foreach (array_keys($strings) as $k) {
            $k = str_ireplace($bl, "", $k);
            $k = filter_var($k, FILTER_SANITIZE_STRING);
            if ($strings[$k] != "''") {
                $v = strip_tags($strings[$k]);
                $v = str_ireplace($bl, "", $v);
                $strings[$k] = trim($v);
            }
        }
        return $strings;
    }

    /**
     * Carrega as variaveis de uma SECTION PHP
     *
     * @param string $idsection
     */
    function readSection($idsection = "")
    {
        ini_set("session.use_cookies", 0);
        session_name("i3GeoPHP");
        session_id($idsection);
        session_start([
            'read_and_close' => true
        ]);
    }

    /**
     * Obtem os dados de um mapa salvo no sistema de administracao
     *
     * @param number $id_mapa
     * @return array|boolean
     */
    function getSavedMap($id_mapa = 0)
    {
        include_once (I3GEOPATH . "/restmapserver/classes/admin.php");
        $admin = new \restmapserver\Admin();
        $maps = $admin->i3geoadmin_mapas($id_mapa);
        return $maps;
    }
    /**
     * Lista os grupos ao qual pertence o usuario atualmente logado
     */
    function getGruposUsrLogin()
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
    /**
     * Retorna a vers&atilde;o do Mapserver.
     *
     * @return array("completa"=>,"principal"=>,"inteiro"=>)
     */
    function mapserverversion()
    {
        $v = "5.0.0";
        $vs = explode(" ", ms_GetVersion());
        $cvs = count($vs);
        for ($i = 0; $i < $cvs; ++ $i) {
            if (trim(strtolower($vs[$i])) == "version") {
                $v = $vs[$i + 1];
            }
        }
        $versao["completa"] = $v;
        $v = explode(".", $v);
        $versao["principal"] = $v[0];
        $versao["inteiro"] = ms_GetVersionInt();
        return $versao;
    }

    /**
     * Define qual seria o mapfile base para criar um mapa
     *
     * @return string|boolean
     */
    function getBaseMapfile()
    {
        if ($_SESSION["base"] != "" && file_exists($_SESSION["base"])) {
            return $_SESSION["base"];
        }
        $versao = $this->mapserverversion();
        $versao = $versao["principal"];
        if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
            $base = I3GEOPATH . "/aplicmap/geral1windowsv" . $versao . ".map";
        } else {
            if ($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv' . $versao . '.map')) {
                $base = "/var/www/i3geo/aplicmap/geral1debianv" . $versao . ".map";
            }
            if ($base == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav' . $versao . '.map')) {
                $base = "/var/www/html/i3geo/aplicmap/geral1fedorav" . $versao . ".map";
            }
            if ($base == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav' . $versao . '.map')) {
                $base = "/opt/www/html/i3geo/aplicmap/geral1v" . $versao . ".map";
            }
            if ($base == "") {
                $base = I3GEOPATH . "/aplicmap/geral1v" . $versao . ".map";
            }
        }
        if (file_exists($base)) {
            return $base;
        } else {
            return false;
        }
    }
    /**
     * Retorna o array $i3GeoProjDefault definido em i3geo/ms_configura.php
     * Se essa variavel nao existir, retorna o valor default baseado em EPSG:4326
     * @param string $tipo
     * @return string[]|string
     */
    function getDefaultProjection($tipo = "")
    {
        if (empty($_SESSION["i3GeoProjDefault"]) || ! isset($_SESSION["i3GeoProjDefault"])) {
            $i3GeoProjDefault = array(
                'proj4' => '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs ',
                'epsg' => '4326',
                'prj' => 'GEOGCS["GCS_WGS_1984",DATUM["D_WGS_1984",SPHEROID["WGS_1984",6378137,298.257223563]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]]'
            );
        }
        if ($tipo == "") {
            return $i3GeoProjDefault;
        } else {
            return $i3GeoProjDefault[$tipo];
        }
    }
    function utf2iso($texto)
    {
        if (function_exists("mb_convert_encoding")) {
            if (! mb_detect_encoding($texto, "UTF-8", true)) {
                $texto = mb_convert_encoding($texto, "UTF-8", "ISO-8859-1");
            }
        }
        return $texto;
    }
    function txt2utf($texto)
    {
        if (function_exists("mb_convert_encoding")) {
            if (! mb_detect_encoding($texto, "UTF-8", true)) {
                $texto = mb_convert_encoding($texto, "UTF-8", "ISO-8859-1");
            }
        }
        return $texto;
    }
    function objColor2RGB($objColor)
    {
        $r = $objColor->red;
        $g = $objColor->green;
        $b = $objColor->blue;
        return ($r . "," . $g . "," . $b);
    }
    function jsonError(){
        switch (json_last_error()) {
            case JSON_ERROR_NONE:
                return false;
                break;
            case JSON_ERROR_DEPTH:
                return 'Maximum stack depth exceeded';
                break;
            case JSON_ERROR_STATE_MISMATCH:
                return 'Underflow or the modes mismatch';
                break;
            case JSON_ERROR_CTRL_CHAR:
                return 'Unexpected control character found';
                break;
            case JSON_ERROR_SYNTAX:
                return 'Syntax error, malformed JSON';
                break;
            case JSON_ERROR_UTF8:
                return 'Malformed UTF-8 characters, possibly incorrectly encoded';
                break;
            default:
                return 'Unknown error';
                break;
        }
    }
}