<?php
define ( I3GEO, true );
include ("validaacesso.php");
include ("../ms_configura.php");
$csw = "http://www.metadados.inde.gov.br/geonetwork/srv/br";
if (isset ( $configFerramentas )) {
	$csw = $configFerramentas ["buscainde"] ["csw"];
}
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<title>Buscar metadados na INDE</title>
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=ISO-8859-1">

<link rel="stylesheet" type="text/css" href="lib/css/cswclient.css" />

<script type="text/javascript" src="./lib/scripts/sarissa.js"></script>
<script type="text/javascript" src="./lib/scripts/sarissa_ieemu_xpath.js"></script>
<script type="text/javascript" src="./lib/scripts/cswclient.js"></script>

</head>
<body class="clearfix" style="font-family: Verdana, Arial, Tahoma, Helvetica, sans-serif; font-size: 11px">
	<div id="query-container">
		<div class="csw-main">
			<div class="csw-content">
				<div class="captioneddiv">
					<form name="theForm" method="post" action="javascript:void(csw_client.getRecords())">
						<select name="queryable">
							<option value="anytext">Qualquer lugar</option>
							<option value="title">T&iacute;tulo</option>
							<option value="subject">Descri&ccedil;&atilde;o</option>
						</select> <select name="operator">
							<option value="contains">cont&eacute;m</option>
							<option value="equals">igual</option>
						</select> <input type="text" name="query" value="" size="24" />
						<p />
						Regi&atilde;o (xmin ymin xmax ymax): <input disabled type="text" name="bbox" value="180 90 -180 -90" size="24"/>
			   <p/>
               <span id="csw-hosts"></span>
		<select id="schema" name="schema">
				 <option value="http://www.opengis.net/cat/csw/2.0.2">csw:Record</option>
				 <option value="http://www.isotc211.org/2005/gmd">ISO19139</option>
               </select>
		<select id="dislaymode" name="displaymode">
				 <option value="html">HTML</option>
				 <option value="xml">XML</option>
               </select>
		<select id="sortby" name="sortby">
				 <option value="none">N&atilde;o ordena</option>
				 <option value="title">Ordena pelo t&iacute;tulo</option>
               </select>
               <p/>
               <!--input type="hidden" name="schema" value="http://www.opengis.net/cat/csw/2.0.2"/-->
               <!--input type="hidden" name="schema" value="http://www.isotc211.org/2005/gmd"/-->
               <!--input type="hidden" name="displaymode" value="html"/-->
               <input type="button" value="limpar" onClick="javascript:void(csw_client.clearPage())"/>
               <input type="button" value="pesquisar" onClick="javascript:void(csw_client.clearResposta());void(csw_client.getRecords())"/>
			 </form>
				</div>

				<div id="results-container">
					<div class="csw-main2" id="results">
						<div class="csw-contents">
							<div id="csw-output"></div>
						</div>
					</div>
				</div>

			</div>
		</div>
		<!-- main -->
	</div>
	<!-- query-container -->
	<p />
	<!--
	 <div id="popup">
	   <div class="close">
	     <a href="javascript:void(csw_client.hideDiv(document.getElementById('popup')))">[close]</a>
       </div>
       <div id="popup2">
         <div class="csw-content2">
	       <div id="metadata"></div>
	     </div>
       </div>
     </div>popup -->
	<div id="overlay" style="visibility: hidden"></div>
	<script type="text/javascript">
     	var csw = "<?php echo $csw; ?>";
	   var csw_client = new CSWClient(csw+"/csw");
       csw_client.writeClient("csw-wrapper");
	 </script>

</body>
</html>
