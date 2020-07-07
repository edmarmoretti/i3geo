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
        } else {
            $i3GeoProjDefault = $_SESSION["i3GeoProjDefault"];
        }
        if ($tipo == "") {
            return $i3GeoProjDefault;
        } else {
            return $i3GeoProjDefault[$tipo];
        }
    }
    function iso2utf($texto)
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
    function toJson($data){
        $json = json_encode($data);
        $jsonError = $this->jsonError();
        if ($jsonError != false) {
            $json = $jsonError;
        }
        return $json;
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
    function remove_accents($string)
    {
        if (! preg_match('/[\x80-\xff]/', $string))
            return $string;
            if ($this->seems_utf8($string)) {
                $chars = array(
                    // Decompositions for Latin-1 Supplement
                    chr(195) . chr(128) => 'A',
                    chr(195) . chr(129) => 'A',
                    chr(195) . chr(130) => 'A',
                    chr(195) . chr(131) => 'A',
                    chr(195) . chr(132) => 'A',
                    chr(195) . chr(133) => 'A',
                    chr(195) . chr(135) => 'C',
                    chr(195) . chr(136) => 'E',
                    chr(195) . chr(137) => 'E',
                    chr(195) . chr(138) => 'E',
                    chr(195) . chr(139) => 'E',
                    chr(195) . chr(140) => 'I',
                    chr(195) . chr(141) => 'I',
                    chr(195) . chr(142) => 'I',
                    chr(195) . chr(143) => 'I',
                    chr(195) . chr(145) => 'N',
                    chr(195) . chr(146) => 'O',
                    chr(195) . chr(147) => 'O',
                    chr(195) . chr(148) => 'O',
                    chr(195) . chr(149) => 'O',
                    chr(195) . chr(150) => 'O',
                    chr(195) . chr(153) => 'U',
                    chr(195) . chr(154) => 'U',
                    chr(195) . chr(155) => 'U',
                    chr(195) . chr(156) => 'U',
                    chr(195) . chr(157) => 'Y',
                    chr(195) . chr(159) => 's',
                    chr(195) . chr(160) => 'a',
                    chr(195) . chr(161) => 'a',
                    chr(195) . chr(162) => 'a',
                    chr(195) . chr(163) => 'a',
                    chr(195) . chr(164) => 'a',
                    chr(195) . chr(165) => 'a',
                    chr(195) . chr(167) => 'c',
                    chr(195) . chr(168) => 'e',
                    chr(195) . chr(169) => 'e',
                    chr(195) . chr(170) => 'e',
                    chr(195) . chr(171) => 'e',
                    chr(195) . chr(172) => 'i',
                    chr(195) . chr(173) => 'i',
                    chr(195) . chr(174) => 'i',
                    chr(195) . chr(175) => 'i',
                    chr(195) . chr(177) => 'n',
                    chr(195) . chr(178) => 'o',
                    chr(195) . chr(179) => 'o',
                    chr(195) . chr(180) => 'o',
                    chr(195) . chr(181) => 'o',
                    chr(195) . chr(182) => 'o',
                    chr(195) . chr(182) => 'o',
                    chr(195) . chr(185) => 'u',
                    chr(195) . chr(186) => 'u',
                    chr(195) . chr(187) => 'u',
                    chr(195) . chr(188) => 'u',
                    chr(195) . chr(189) => 'y',
                    chr(195) . chr(191) => 'y',
                    // Decompositions for Latin Extended-A
                    chr(196) . chr(128) => 'A',
                    chr(196) . chr(129) => 'a',
                    chr(196) . chr(130) => 'A',
                    chr(196) . chr(131) => 'a',
                    chr(196) . chr(132) => 'A',
                    chr(196) . chr(133) => 'a',
                    chr(196) . chr(134) => 'C',
                    chr(196) . chr(135) => 'c',
                    chr(196) . chr(136) => 'C',
                    chr(196) . chr(137) => 'c',
                    chr(196) . chr(138) => 'C',
                    chr(196) . chr(139) => 'c',
                    chr(196) . chr(140) => 'C',
                    chr(196) . chr(141) => 'c',
                    chr(196) . chr(142) => 'D',
                    chr(196) . chr(143) => 'd',
                    chr(196) . chr(144) => 'D',
                    chr(196) . chr(145) => 'd',
                    chr(196) . chr(146) => 'E',
                    chr(196) . chr(147) => 'e',
                    chr(196) . chr(148) => 'E',
                    chr(196) . chr(149) => 'e',
                    chr(196) . chr(150) => 'E',
                    chr(196) . chr(151) => 'e',
                    chr(196) . chr(152) => 'E',
                    chr(196) . chr(153) => 'e',
                    chr(196) . chr(154) => 'E',
                    chr(196) . chr(155) => 'e',
                    chr(196) . chr(156) => 'G',
                    chr(196) . chr(157) => 'g',
                    chr(196) . chr(158) => 'G',
                    chr(196) . chr(159) => 'g',
                    chr(196) . chr(160) => 'G',
                    chr(196) . chr(161) => 'g',
                    chr(196) . chr(162) => 'G',
                    chr(196) . chr(163) => 'g',
                    chr(196) . chr(164) => 'H',
                    chr(196) . chr(165) => 'h',
                    chr(196) . chr(166) => 'H',
                    chr(196) . chr(167) => 'h',
                    chr(196) . chr(168) => 'I',
                    chr(196) . chr(169) => 'i',
                    chr(196) . chr(170) => 'I',
                    chr(196) . chr(171) => 'i',
                    chr(196) . chr(172) => 'I',
                    chr(196) . chr(173) => 'i',
                    chr(196) . chr(174) => 'I',
                    chr(196) . chr(175) => 'i',
                    chr(196) . chr(176) => 'I',
                    chr(196) . chr(177) => 'i',
                    chr(196) . chr(178) => 'IJ',
                    chr(196) . chr(179) => 'ij',
                    chr(196) . chr(180) => 'J',
                    chr(196) . chr(181) => 'j',
                    chr(196) . chr(182) => 'K',
                    chr(196) . chr(183) => 'k',
                    chr(196) . chr(184) => 'k',
                    chr(196) . chr(185) => 'L',
                    chr(196) . chr(186) => 'l',
                    chr(196) . chr(187) => 'L',
                    chr(196) . chr(188) => 'l',
                    chr(196) . chr(189) => 'L',
                    chr(196) . chr(190) => 'l',
                    chr(196) . chr(191) => 'L',
                    chr(197) . chr(128) => 'l',
                    chr(197) . chr(129) => 'L',
                    chr(197) . chr(130) => 'l',
                    chr(197) . chr(131) => 'N',
                    chr(197) . chr(132) => 'n',
                    chr(197) . chr(133) => 'N',
                    chr(197) . chr(134) => 'n',
                    chr(197) . chr(135) => 'N',
                    chr(197) . chr(136) => 'n',
                    chr(197) . chr(137) => 'N',
                    chr(197) . chr(138) => 'n',
                    chr(197) . chr(139) => 'N',
                    chr(197) . chr(140) => 'O',
                    chr(197) . chr(141) => 'o',
                    chr(197) . chr(142) => 'O',
                    chr(197) . chr(143) => 'o',
                    chr(197) . chr(144) => 'O',
                    chr(197) . chr(145) => 'o',
                    chr(197) . chr(146) => 'OE',
                    chr(197) . chr(147) => 'oe',
                    chr(197) . chr(148) => 'R',
                    chr(197) . chr(149) => 'r',
                    chr(197) . chr(150) => 'R',
                    chr(197) . chr(151) => 'r',
                    chr(197) . chr(152) => 'R',
                    chr(197) . chr(153) => 'r',
                    chr(197) . chr(154) => 'S',
                    chr(197) . chr(155) => 's',
                    chr(197) . chr(156) => 'S',
                    chr(197) . chr(157) => 's',
                    chr(197) . chr(158) => 'S',
                    chr(197) . chr(159) => 's',
                    chr(197) . chr(160) => 'S',
                    chr(197) . chr(161) => 's',
                    chr(197) . chr(162) => 'T',
                    chr(197) . chr(163) => 't',
                    chr(197) . chr(164) => 'T',
                    chr(197) . chr(165) => 't',
                    chr(197) . chr(166) => 'T',
                    chr(197) . chr(167) => 't',
                    chr(197) . chr(168) => 'U',
                    chr(197) . chr(169) => 'u',
                    chr(197) . chr(170) => 'U',
                    chr(197) . chr(171) => 'u',
                    chr(197) . chr(172) => 'U',
                    chr(197) . chr(173) => 'u',
                    chr(197) . chr(174) => 'U',
                    chr(197) . chr(175) => 'u',
                    chr(197) . chr(176) => 'U',
                    chr(197) . chr(177) => 'u',
                    chr(197) . chr(178) => 'U',
                    chr(197) . chr(179) => 'u',
                    chr(197) . chr(180) => 'W',
                    chr(197) . chr(181) => 'w',
                    chr(197) . chr(182) => 'Y',
                    chr(197) . chr(183) => 'y',
                    chr(197) . chr(184) => 'Y',
                    chr(197) . chr(185) => 'Z',
                    chr(197) . chr(186) => 'z',
                    chr(197) . chr(187) => 'Z',
                    chr(197) . chr(188) => 'z',
                    chr(197) . chr(189) => 'Z',
                    chr(197) . chr(190) => 'z',
                    chr(197) . chr(191) => 's',
                    // Euro Sign
                    chr(226) . chr(130) . chr(172) => 'E',
                    // GBP (Pound) Sign
                    chr(194) . chr(163) => ''
                );
                $string = strtr($string, $chars);
            } else {
                // Assume ISO-8859-1 if not UTF-8
                $chars['in'] = chr(128) . chr(131) . chr(138) . chr(142) . chr(154) . chr(158) . chr(159) . chr(162) . chr(165) . chr(181) . chr(192) . chr(193) . chr(194) . chr(195) . chr(196) . chr(197) . chr(199) . chr(200) . chr(201) . chr(202) . chr(203) . chr(204) . chr(205) . chr(206) . chr(207) . chr(209) . chr(210) . chr(211) . chr(212) . chr(213) . chr(214) . chr(216) . chr(217) . chr(218) . chr(219) . chr(220) . chr(221) . chr(224) . chr(225) . chr(226) . chr(227) . chr(228) . chr(229) . chr(231) . chr(232) . chr(233) . chr(234) . chr(235) . chr(236) . chr(237) . chr(238) . chr(239) . chr(241) . chr(242) . chr(243) . chr(244) . chr(245) . chr(246) . chr(248) . chr(249) . chr(250) . chr(251) . chr(252) . chr(253) . chr(255);
                $chars['out'] = "EfSZszYcYuAAAAAACEEEEIIIINOOOOOOUUUUYaaaaaaceeeeiiiinoooooouuuuyy";
                $string = strtr($string, $chars['in'], $chars['out']);
                $double_chars['in'] = array(
                    chr(140),
                    chr(156),
                    chr(198),
                    chr(208),
                    chr(222),
                    chr(223),
                    chr(230),
                    chr(240),
                    chr(254)
                );
                $double_chars['out'] = array(
                    'OE',
                    'oe',
                    'AE',
                    'DH',
                    'TH',
                    'ss',
                    'ae',
                    'dh',
                    'th'
                );
                $string = str_replace($double_chars['in'], $double_chars['out'], $string);
            }
            return $string;
    }

    function seems_utf8($Str)
    { // by bmorel at ssi dot fr
        $length = strlen($Str);
        for ($i = 0; $i < $length; $i ++) {
            if (ord($Str[$i]) < 0x80)
                continue; // 0bbbbbbb
                elseif ((ord($Str[$i]) & 0xE0) == 0xC0)
                $n = 1; // 110bbbbb
                elseif ((ord($Str[$i]) & 0xF0) == 0xE0)
                $n = 2; // 1110bbbb
                elseif ((ord($Str[$i]) & 0xF8) == 0xF0)
                $n = 3; // 11110bbb
                elseif ((ord($Str[$i]) & 0xFC) == 0xF8)
                $n = 4; // 111110bb
                elseif ((ord($Str[$i]) & 0xFE) == 0xFC)
                $n = 5; // 1111110b
                else
                    return false; // Does not match any model
                    for ($j = 0; $j < $n; $j ++) { // n bytes matching 10bbbbbb follow ?
                        if ((++ $i == $length) || ((ord($Str[$i]) & 0xC0) != 0x80))
                            return false;
                    }
        }
        return true;
    }
    function getIpClient()
    {
        $ipaddress = '';
        if (getenv('HTTP_CLIENT_IP'))
            $ipaddress = getenv('HTTP_CLIENT_IP');
            else if (getenv('HTTP_X_FORWARDED_FOR'))
                $ipaddress = getenv('HTTP_X_FORWARDED_FOR');
                else if (getenv('HTTP_X_FORWARDED'))
                    $ipaddress = getenv('HTTP_X_FORWARDED');
                    else if (getenv('HTTP_FORWARDED_FOR'))
                        $ipaddress = getenv('HTTP_FORWARDED_FOR');
                        else if (getenv('HTTP_FORWARDED'))
                            $ipaddress = getenv('HTTP_FORWARDED');
                            else if (getenv('REMOTE_ADDR'))
                                $ipaddress = getenv('REMOTE_ADDR');
                                else
                                    $ipaddress = 'UNKNOWN';

                                    return $ipaddress;
    }
    /**
     * Groups an array by a given key.
     *
     * Groups an array into arrays by a given key, or set of keys, shared between all array members.
     *
     * Based on {@author Jake Zatecky}'s {@link https://github.com/jakezatecky/array_group_by array_group_by()} function.
     * This variant allows $key to be closures.
     *
     * @param array $array   The array to have grouping performed on.
     * @param mixed $key,... The key to group or split by. Can be a _string_,
     *                       an _integer_, a _float_, or a _callable_.
     *
     *                       If the key is a callback, it must return
     *                       a valid key from the array.
     *
     *                       If the key is _NULL_, the iterated element is skipped.
     *
     *                       ```
     *                       string|int callback ( mixed $item )
     *                       ```
     *
     * @return array|null Returns a multidimensional array or `null` if `$key` is invalid.
     */
    function array_group_by(array $array, $key)
    {
        if (!is_string($key) && !is_int($key) && !is_float($key) && !is_callable($key) ) {
            //trigger_error('array_group_by(): The key should be a string, an integer, or a callback', E_USER_ERROR);
            return null;
        }

        $func = (!is_string($key) && is_callable($key) ? $key : null);
        $_key = $key;

        // Load the new array, splitting by the target key
        $grouped = [];
        foreach ($array as $value) {
            $key = null;

            if (is_callable($func)) {
                $key = call_user_func($func, $value);
            } elseif (is_object($value) && isset($value->{$_key})) {
                $key = $value->{$_key};
            } elseif (isset($value[$_key])) {
                $key = $value[$_key];
            }

            if ($key === null) {
                continue;
            }

            $grouped[$key][] = $value;
        }

        // Recursively build a nested grouping if more parameters are supplied
        // Each grouped array value is grouped according to the next sequential key
        if (func_num_args() > 2) {
            $args = func_get_args();

            foreach ($grouped as $key => $value) {
                $params = array_merge([ $value ], array_slice($args, 2, func_num_args()));
                $grouped[$key] = call_user_func_array('array_group_by', $params);
            }
        }

        return $grouped;
    }
}