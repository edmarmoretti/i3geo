<?php
include (dirname(__FILE__) . "/../safe2.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $_SESSION["i3geoBlFerramentas"], false);
switch (strtoupper($_GET["funcao"]))
{
    case "COPY":
        $dir = dirname($_SESSION["map_file"]);
        $novo_mapfile = $dir."/".nomeRandomico(5).".map";
        $_SESSION["mapfilecopia"] = $novo_mapfile;
        $oMap = ms_newMapobj($_SESSION["map_file"]);
        $oMap->setmetadata("ows_enable_request","*");
        $ts = $oMap->getalllayernames();
        $proj4 = pegaProjecaoDefault("proj4");
        foreach ($ts as $t){
            $l = $oMap->getlayerbyname($t);
            $l->setmetadata("ows_enable_request","*");
            if($l->status != MS_DEFAULT){
                $l->set("status",MS_DELETE);
            } else {
                $l->setProjection($proj4);
            }

        }
        $oMap->save($novo_mapfile);
    break;
}
ob_clean();
header("Content-type: application/json");
echo json_encode(true);
