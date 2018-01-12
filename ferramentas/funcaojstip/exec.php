<?php
include (dirname(__FILE__) . "/../safe.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $i3geoBlFerramentas, false);
//
// faz a busca da fun&ccedil;&atilde;o que deve ser executada
//
$retorno = ""; // string que ser&aacute; retornada ao browser via JSON
switch (strtoupper($funcao)) {
    /*
     * Valor: PEGAFILTRO
     *
     * Pega a string do filtro de um tema.
     *
     * <Temas->pegaFiltro>
     */
    case "PEGAFUNCOESJS":
        include_once (dirname(__FILE__) . "/../../classesphp/classe_temas.php");
        $m = new Temas($map_file, $tema);
        $retorno = base64_encode($m->pegaFuncoesJs());
        break;
    /*
     * Valor: INSEREFILTRO
     *
     * Inclui um filtro no tema.
     *
     * <Temas->insereFiltro>
     */
    case "INSEREFUNCOESJS":
        include_once(dirname(__FILE__)."/../../classesphp/classe_temas.php");
        $m = new Temas($map_file,$tema);
        $m->insereFuncoesJs(($_GET["texto"]));
        $m->salva();
        $retorno = base64_encode($m->pegaFuncoesJs());
        break;
    case "LIMPAFUNCOESJS":
        include_once(dirname(__FILE__)."/../../classesphp/classe_temas.php");
        $m = new Temas($map_file,$tema);
        $m->limpaFuncoesJs();
        $m->salva();
        $retorno = base64_encode($m->pegaFuncoesJs());
        break;
}

if(isset($map_file) && isset($postgis_mapa) && $map_file != ""){
	restauraCon($map_file,$postgis_mapa);
}
cpjson($retorno);
?>