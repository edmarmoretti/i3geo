<?php
error_reporting(0);
require_once("../classesphp/funcoes_gerais.php");
include_once ("../classesphp/pega_variaveis.php");
include_once("../classesphp/carrega_ext.php");
include_once("../classesphp/funcoes_gerais.php");
include_once("../classesphp/classe_mapa.php");
include_once("../ms_configura.php");
if (!isset($texto))
{$texto = "digite o texto";}
?>
<html>
<style>
body
{
	font:14pt arial,helvetica,clean,sans-serif;
	color:rgb(100,100,100);
}
p
{
	font:12pt arial,helvetica,clean,sans-serif;
	color:black;
}
input
{
	font:14pt arial,helvetica,clean,sans-serif;
	color:black;
	cursor:pointer;
	background-color:white;
}
</style>
<body>
<input type='button' value='retorna' style='cursor:pointer;' onclick='retorno()' /><br><br>
<form id='f' action='localizar.php?' method='get'>
	<input type='hidden' id='wkt' name='wkt' value='' />
	<input type='hidden' id='layer' name='layer' value='' />
	<input type='hidden' id='gid' name='gid' value='' />
	<input type='hidden' id='nome' name='nome' value='' />
	<input type='hidden' name='tmpfname' value='<?php echo $tmpfname; ?>' />
	<input id='tipo' type=hidden name='tipo' value='retorno' />
	<input type='text' name='texto' value='<?php echo $texto;?>' style='cursor:text;' /><br>
</form>
<input type='button' id='localizar' value='localizar' style='cursor:pointer;' onclick='localizar()' /><br><br>

<?php
if ($tipo == 'executa')
{
	$r = buscaRapida("http://mapas.mma.gov.br/webservices/geonames.php",$texto);
	
	foreach($r["geonames"] as $linha)
	{
		$lugares = $linha["lugares"];
		echo $linha["tema"]."<br>";
		$layer = $linha["layer"];
		foreach ($lugares as $lugar)
		{
			$wkt = $lugar["limite"];
			$wkt = str_replace("POLYGON","",$wkt);
			$wkt = explode("(",$wkt);
			$wkt = explode(")",$wkt[2]);
			$wkt = explode(",",$wkt[0]);
			for($w=0;$w<count($wkt); $w++)
			{
 				$temp = explode(" ",$wkt[$w]);
 				$x[] = $temp[0];
 				$y[] = $temp[1];
			}
			$xMin = min($x);
			$xMax = max($x);
			$yMin = min($y);
			$yMax = max($y);
			$wkt = $xMin.",".$yMin.",".$xMax.",".$yMax;
			$gid = $lugar["gid"];
			$nome = mb_convert_encoding($lugar["nome"],"ISO-8859-1","UTF-8");
			echo "<input type='radio' onclick=\"zoom('".$wkt."','".$layer."','".$gid."','".$nome."')\" />".$nome."<br>";
		}
		
	}
}
if($tipo == "zoom")
{
	$mapa = ms_newMapObj($tmpfname);
	$ext = $mapa->extent;
	$wkt = explode(",",$wkt);
	$ext->setextent($wkt[0],$wkt[1],$wkt[2],$wkt[3]);
	$mapa->save($tmpfname);
	$servico = "http://mapas.mma.gov.br/webservices/geonameswms.php?gid=".$gid;
	$nomecamada = $nome." - ".$layer;
	$nome = "default";
	$proj = "EPSG:4291";
	$formato = "image/png";
	$suportasld = "nao";
	$versao = "1.1.0";
	$m = new Mapa($tmpfname);
	$m->adicionatemawms($layer,$servico,$nome,$proj,$formato,$locaplic,$tipo,$versao,$nomecamada,$dir_tmp,$imgdir,$imgurl,$tiporep,$suportasld,$formatosinfo);
	$m->salva();
	//echo $tmpfname;exit;
	$urln = "mobile.php?tmpfname=".$tmpfname;
	echo "<meta http-equiv='refresh' content='0;url=$urln'>";

/*
	var re = new RegExp("POLYGON", "g")
	wkt = wkt.replace(re,"")
	wkt = wkt.split("(")[2].split(")")[0]
	wkt = wkt.split(",");
	x = new Array();
	y = new Array();
	for (w=0;w<wkt.length; w++)
	{
 		temp = wkt[w].split(" ");
 		x.push(temp[0])
 		y.push(temp[1])
	}
	x.sort(sortNumber)
	xMin = x[0]
	xMax = x[(x.length)-1]
	y.sort(sortNumber)
	yMin = y[0]
	yMax = y[(y.length)-1]
	var ext = xMin+" "+yMin+" "+xMax+" "+yMax
	window.parent.objaguarde.abre("ajaxredesenha","Aguarde...");
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&ext="+ext+"&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"mudaExtensao",adicionaCamada(layer,gid,nm));
    var adicionaCamada = function(layer,gid,nm)
    {
	 	var s = "&tema="+layer
	 	s += "&servico=http://mapas.mma.gov.br/webservices/geonameswms.php?gid="+gid+"&";
	 	s += "&nome=default"
	 	s += "&proj=EPSG:4291&formato=image/png&nomecamada="+nm+" - "+layer
	 	s += "&suportasld=nao&versao=1.1.0"
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=adicionatemawms&g_sid="+g_sid+s;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"mudaExtensao",window.parent.ajaxredesenha);
    }
*/
}
?>
</body>
<script>
function retorno()
{
	document.getElementById('tipo').value='retorno';
	document.getElementById('f').action = 'mobile.php';
	document.getElementById('f').submit();
}
function localizar()
{
	document.getElementById('tipo').value='executa';
	document.getElementById('f').submit();
}
function zoom(wkt,layer,gid,nome)
{
    document.getElementById('tipo').value='zoom';
    document.getElementById('wkt').value=wkt;
    document.getElementById('layer').value=layer;
    document.getElementById('gid').value=gid;
    document.getElementById('nome').value=nome;
    document.getElementById('f').submit();
}

</script>
</html>