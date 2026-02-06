<?php
namespace mapserverapi;

use PDO;

class Admin
{

    function __construct()
    {}

    /**
     * Obtem dados do sistema de administracao
     *
     * @param string $sql
     * @return array|false
     */
    function getData($sql = "")
    {
        $resultado = array();
        include (I3GEOPATH . "/classesphp/conexao.php");
        error_reporting(0);
        $q = $dbh->query($sql, PDO::FETCH_ASSOC);
        if ($q) {
            $resultado = $q->fetchAll();
            return $resultado;
        } else {
            return false;
        }
    }
    /**
     * Obtem os dados da tabela i3geousr_grupotema
     *
     * @return array|boolean
     */
    function i3geousr_grupotema()
    {
        $data = $this->getData("select id_grupo,codigo_tema from " . $_SESSION["esquemaadmin"] . "i3geousr_grupotema as gt," . $_SESSION["esquemaadmin"] . "i3geoadmin_temas as te where gt.id_tema = te.id_tema");
        return $data;
    }

    /**
     * Obtem os dados publicados da tabela i3geoadmin_mapas para um id ou todos
     *
     * @param string $id_mapa
     * @return array|boolean
     */
    function i3geoadmin_mapas($id_mapa = "")
    {
        if ($id_mapa != "") {
            $sql = "select * from " . $_SESSION["esquemaadmin"] . "i3geoadmin_mapas where publicado_mapa = 'sim' OR publicado_mapa = 'SIM' AND id_mapa='" . $id_mapa * 1 . "'";
            $data = $this->getData($sql)[0];
        } else {
            $sql = "select * from " . $_SESSION["esquemaadmin"] . "i3geoadmin_mapas where publicado_mapa = 'sim' OR publicado_mapa = 'SIM'";
            $data = $this->getData($sql);
        }
        return $data;
    }
}
