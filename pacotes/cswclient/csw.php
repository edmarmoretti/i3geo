<?php
define("I3GEO", true);
include ("../validaacesso.php");
include ("../../ms_configura.php");
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Buscar metadados na INDE</title>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">
<link rel='stylesheet' type='text/css' href='//fonts.googleapis.com/css?family=Roboto:300,400,500,700'>

<link rel="stylesheet" type="text/css" href="../bootstrap/css/bootstrap.min.css" />
<link rel="stylesheet" type="text/css" href="../../css/default.css" />
<script type="text/javascript" src="./lib/scripts/sarissa.js"></script>
<script type="text/javascript" src="./lib/scripts/sarissa_ieemu_xpath.js"></script>
<script type="text/javascript" src="./lib/scripts/cswclient.js"></script>
<script type="text/javascript" src="../../bootstrap/js/bootstrap.min.js"></script>

</head>
<body style="background-color: white;">
    <div id="query-container" class="container">
        <form class="form-inline" name="theForm" method="post" action="javascript:void(csw_client.getRecords())">
            <div class=''>
                <select style="width:120px;float:left;" class='form-control' id="schema" name="schema">
                    <option value="http://www.opengis.net/cat/csw/2.0.2">csw:Record</option>
                    <option value="http://www.isotc211.org/2005/gmd">ISO19139</option>
                </select> <select style="width:120px;float:left;" class='form-control' id="dislaymode" name="displaymode">
                    <option value="html">HTML</option>
                    <option value="xml">XML</option>
                </select> <select style="width:120px;float:left;" class='form-control' id="sortby" name="sortby">
                    <option value="none">N&atilde;o ordena</option>
                    <option value="title">Ordena pelo t&iacute;tulo</option>
                </select>
            </div>
            <div class="clearfix"></div>
            <div class='form-group'>
                <select class='form-control' name="queryable">
                    <option value="anytext">Qualquer lugar</option>
                    <option value="title">T&iacute;tulo</option>
                    <option value="subject">Descri&ccedil;&atilde;o</option>
                </select> <select class='form-control' name="operator">

                    <option value="equals">cont&eacute;m</option>
                    <option value="contains">igual</option>
                </select>
                <input name="query" class='form-control' placeholder="digite aqui" type='text' value='' />
            </div>
            <div class="clearfix"></div>
            <br>
            <button class='btn btn-primary btn-sm btn-raised' type="button" onClick="javascript:void(csw_client.clearPage())">Limpar</button>
            <button class='btn btn-primary btn-sm btn-raised' type="button" onClick="javascript:void(csw_client.clearResposta());void(csw_client.getRecords())">Pesquisar</button>
            <input type="hidden" name="bbox" value="180 90 -180 -90" size="24" />
        </form>
        <div class="clearfix"></div>
        <div id="results-container" style="font-size: 1rem;">
            <div class="csw-main2" id="results">
                <div class="csw-contents">
                    <div id="csw-output"></div>
                </div>
            </div>
        </div>
    </div>
    <!-- query-container -->
    <div id="overlay" style="visibility: hidden"></div>
    <script type="text/javascript">
        var csw = "http://www.metadados.inde.gov.br/geonetwork/srv/br/csw";
	    var csw_client = new CSWClient("http://www.metadados.inde.gov.br/geonetwork/srv/br/csw");
        csw_client.writeClient("csw-wrapper");
	 </script>

</body>
</html>
