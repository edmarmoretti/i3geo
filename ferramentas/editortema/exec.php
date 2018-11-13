<?php
session_name("i3GeoLogin");
session_id();
session_start([
    'read_and_close' => true
]);
session_write_close();
if ($_SESSION["usuario"] == "" || ($_SESSION["usuario"] != $_COOKIE["i3geousuariologin"])) {
    header("HTTP/1.1 403 Voce deve fazer login");
    exit();
}
if (verificaOperacaoSessao("admin/html/editormapfile") == false) {
    header("HTTP/1.1 403 Vc nao pode realizar essa operacao. Tente fazer login novamente.");
    exit();
}
ini_set("session.use_cookies", 0);
session_name("i3GeoPHP");
session_id($_POST["g_sid"]);
session_start([
    'read_and_close' => true
]);
include_once (dirname(__FILE__) . "../../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)), "", false);

$retorno = "";
// faz a busca da fun&ccedil;&atilde;o que deve ser executada
switch (strtoupper($_POST["funcao"])) {
    case "SALVAR":
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = $mapa->getlayerbyname($_POST["_tema"]);
        if (strtolower($layer->getmetadata("EDITAVEL")) != "sim") {
            header("HTTP/1.1 403 Camada nao editavel.");
            exit();
        } else {

            $tabela = $layer->getmetadata("TABELAEDITAVEL");

            $esquema = $layer->getmetadata("ESQUEMATABELAEDITAVEL");
            $colunaidunico = $layer->getmetadata("COLUNAIDUNICO");
            $colunageometria = $layer->getmetadata("COLUNAGEOMETRIA");

            if ($tabela == "" || $colunageometria == "" || $colunaidunico == "") {
                header("HTTP/1.1 403 Metadados insuficientes");
                exit();
            }

            $itens = explode(",", $_POST["_itens"]);
            $set = "";
            foreach ($itens as $i) {
                if ($i != $colunaidunico) {
                    $set = $set . " " . $i . " = '" . $_POST[$i] . "',";
                }
            }
            $set = $set . " $colunageometria = ST_Transform(ST_GeomFromText('" . $_POST['wkt'] . "','" . $_POST["srid"] . "'),ST_SRID( $colunageometria ))";
            $c = stringCon2Array($_SESSION["postgis_mapa"][$layer->connection]);
            try {
                $dbh = new PDO('pgsql:dbname=' . $c["dbname"] . ';user=' . $c["user"] . ';password=' . $c["password"] . ';host=' . $c["host"] . ';port=' . $c["port"]);
                $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $dbh->beginTransaction();
                $sql = "UPDATE " . $esquema . "." . $tabela . " SET " . $set . " where " . $colunaidunico . "::text = '" . $_POST[$colunaidunico] . "' ";
                //echo $sql;exit;
                $sth = $dbh->exec($sql);
                $dbh->commit();
                $retorno = true;
            } catch (Exception $e) {
                $dbh->rollBack();
                header("HTTP/1.1 403 Nao foi possivel atualizar os dados");
                exit();
            }
        }
        break;
    case "EXCLUIR":
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = $mapa->getlayerbyname($_POST["_tema"]);
        if (strtolower($layer->getmetadata("EDITAVEL")) != "sim") {
            header("HTTP/1.1 403 Camada nao editavel.");
            exit();
        } else {
            $tabela = $layer->getmetadata("TABELAEDITAVEL");
            $esquema = $layer->getmetadata("ESQUEMATABELAEDITAVEL");
            $colunaidunico = $layer->getmetadata("COLUNAIDUNICO");
            $colunageometria = $layer->getmetadata("COLUNAGEOMETRIA");
            if ($tabela == "" || $colunageometria == "" || $colunaidunico == "") {
                header("HTTP/1.1 403 Metadados insuficientes");
                exit();
            }
            $c = stringCon2Array($_SESSION["postgis_mapa"][$layer->connection]);
            try {
                $dbh = new PDO('pgsql:dbname=' . $c["dbname"] . ';user=' . $c["user"] . ';password=' . $c["password"] . ';host=' . $c["host"] . ';port=' . $c["port"]);
                $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $dbh->beginTransaction();
                $sql = "DELETE FROM " . $esquema . "." . $tabela . " where " . $colunaidunico . "::text = '" . $_POST[$colunaidunico] . "' ";
                $sth = $dbh->exec($sql);
                $dbh->commit();
                $retorno = true;
            } catch (Exception $e) {
                $dbh->rollBack();
                header("HTTP/1.1 403 Nao foi possivel excluir");
                exit();
            }
        }
        break;
    case "INSERIR":
        $mapa = ms_newMapObj($_SESSION["map_file"]);
        $layer = $mapa->getlayerbyname($_POST["_tema"]);
        if (strtolower($layer->getmetadata("EDITAVEL")) != "sim") {
            header("HTTP/1.1 403 Camada nao editavel.");
            exit();
        } else {
            $tabela = $layer->getmetadata("TABELAEDITAVEL");
            $esquema = $layer->getmetadata("ESQUEMATABELAEDITAVEL");
            $colunaidunico = $layer->getmetadata("COLUNAIDUNICO");
            $colunageometria = $layer->getmetadata("COLUNAGEOMETRIA");
            if ($tabela == "" || $colunageometria == "" || $colunaidunico == "") {
                header("HTTP/1.1 403 Metadados insuficientes");
                exit();
            }
            $c = stringCon2Array($_SESSION["postgis_mapa"][$layer->connection]);
            try {
                $dbh = new PDO('pgsql:dbname=' . $c["dbname"] . ';user=' . $c["user"] . ';password=' . $c["password"] . ';host=' . $c["host"] . ';port=' . $c["port"]);
                $dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
                $dbh->beginTransaction();

                $sql = "INSERT INTO " . $esquema . "." . $tabela . "(" . $colunageometria . " ) VALUES (ST_Transform(ST_GeomFromText('" . $_POST['wkt'] . "','" . $_POST['srid'] . "'),Find_SRID('$esquema', '$tabela', '$colunageometria'))) ";

                $sth = $dbh->exec($sql);
                $dbh->commit();
                $retorno = true;
            } catch (Exception $e) {
                $dbh->rollBack();
                header("HTTP/1.1 403 Nao foi possivel atualizar os dados");
                exit();
            }
        }
        break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode($retorno);

function verificaOperacaoSessao($operacao)
{
    $resultado = false;

    // verifica se e administrador, caso positivo, permite qq operacao
    foreach ($_SESSION["papeis"] as $p) {
        if ($p == 1) {
            return true;
        }
    }
    if (! empty($_SESSION["operacoes"][$operacao])) {
        $resultado = true;
    }

    return $resultado;
}
function stringCon2Array($stringCon)
{
    $lista = explode(" ", $stringCon);
    $con = array();
    foreach ($lista as $l) {
        $teste = explode("=", $l);
        $con[trim($teste[0])] = trim($teste[1]);
    }
    $c = array(
        "dbname" => $con["dbname"],
        "host" => $con["host"],
        "port" => $con["port"],
        "user" => $con["user"],
        "password" => $con["password"]
    );
    return $c;
}
