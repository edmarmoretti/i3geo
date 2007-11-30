<?php
//
//
//
//error_reporting(E_ALL);
if (file_exists("classesphp/pega_variaveis.php"))
{
	include_once ("classesphp/pega_variaveis.php");
}
else
{
	include_once("../classesphp/pega_variaveis.php");
	include_once("../classesphp/carrega_ext.php");
	require_once("../classesphp/funcoes_gerais.php");
}
//
//executado quando o mapa é inicializado
//
if (!isset($tipo))
{
	include("classesphp/classe_menutemas.php");
	include("ms_configura.php");
	$m = new Menutemas($tmpfname,"");
	$mapas = $m->pegaListaDeMapas($locmapas);
	echo
	"
		<html><body>
		<center>
		
			<img src='imagens/i3geo1.jpg' /><br>
	";	
	foreach($mapas["mapas"] as $obj)
	{
		echo "<br><div onclick='ligar(\"".$obj["TEMAS"]."\")' style='font:16px arial,helvetica,clean,sans-serif;color:blue;text-decoration:underline;cursor:pointer'>".$obj["NOME"]."</div><br>";
		$i = $obj["IMAGEM"];
		echo "<img src='$i' /><br>";
	}
	echo "		 
			<form id=f action='mobile/mobile.php' method='get' >
			<input id='w' type=hidden name='w' value='' />
			<input id='h' type=hidden name='h' value='' />
			<input type=hidden name='tmpfname' value='$tmpfname' />
			<input type=hidden name='tipo' value='' />
			<input type=hidden id=ligar name=ligar value='' />
		</form>
		</body>
		<script>
			document.getElementById('w').value = screen.availWidth;
			document.getElementById('h').value = screen.availHeight;
			function ligar(temas)
			{
				document.getElementById('ligar').value = temas;
				document.getElementById('f').submit();
			}
		</script>
	";
}
else
{
	include("../ms_configura.php");
	if (isset($opcoes) && $opcoes != "")
	{
		echo "ok";
		exit;
	}
	if (isset($ligar))
	{
		$temasa = $ligar;
		incluiTemasIniciais2();
	}
	$mapa = ms_newMapObj($tmpfname);
	if ($tipo=="")
	{
		$mapa->setsize($w-5,$h-5);
		$mapa->save($tmpfname);
	}
	if ($tipo=="zoommais")
	{
		include("../classesphp/classe_navegacao.php");
		$m = new Navegacao($tmpfname);
		$m->aproxima(2);
		$m->salva();		
	}
	if ($tipo=="zoommenos")
	{
		include("../classesphp/classe_navegacao.php");
		$m = new Navegacao($tmpfname);
		$m->afasta(2);
		$m->salva();		
	}
	if ($tipo=="norte")
	{
		include("../classesphp/classe_navegacao.php");
		$m = new Navegacao($tmpfname);
		$x = $mapa->width;
		$x = $x/2;
		$y = 0;
		$m->pan($x,$y,"","");
		$m->salva();		
	}
	if ($tipo=="sul")
	{
		include("../classesphp/classe_navegacao.php");
		$m = new Navegacao($tmpfname);
		$x = $mapa->width;
		$x = $x/2;
		$y = $mapa->height;
		$m->pan($x,$y,"","");
		$m->salva();		
	}
	if ($tipo=="leste")
	{
		include("../classesphp/classe_navegacao.php");
		$m = new Navegacao($tmpfname);
		$x = $mapa->width;
		$y = $mapa->height/2;
		$m->pan($x,$y,"","");
		$m->salva();		
	}
	if ($tipo=="oeste")
	{
		include("../classesphp/classe_navegacao.php");
		$m = new Navegacao($tmpfname);
		$x = 0;
		$y = $mapa->height/2;
		$m->pan($x,$y,"","");
		$m->salva();		
	}
	$nomeimagem = desenhaImagem();
	retornaMapa();
}

function retornaMapa()
{
	global $nomeimagem,$tmpfname,$tipo;
	echo
	"
		<html><body style='margin: 0px;'>
		<div style='z-index:100;background-color:white;position:relative;top:1px;left:1px;border:solid 1px white;'>
		<img src='in.png' style='position:relative;top:2px;cursor:pointer' onclick='zoommais()' />&nbsp;
		<img src='out.png' style='position:relative;top:2px;cursor:pointer' onclick='zoommenos()' />&nbsp;
		<img src='o.png' style='position:relative;top:2px;cursor:pointer' onclick='oeste()' />&nbsp;
		<img src='n.png' style='position:relative;top:2px;cursor:pointer' onclick='norte()' />&nbsp;
		<img src='s.png' style='position:relative;top:2px;cursor:pointer' onclick='sul()' />&nbsp;
		<img src='l.png' style='position:relative;top:2px;cursor:pointer' onclick='leste()' />&nbsp;
		<select id='opcao' onchange='opcoes()' style='style='position:relative;top:0px;'>
			<option >opções</option>
			<option value=liga >liga temas</option>
			<option value=desliga >desliga</option>
			<option value=adiciona >adiciona</option>
		</select>
		</div>
		<img style='position:relative;top:0px;left:0px' src='$nomeimagem' />		
		<form id='f' action='mobile.php?' method='get'>
			<input type=hidden name='tmpfname' value='$tmpfname' />
			<input id='tipo' type=hidden name='tipo' value='$tipo' />
			<input id=opcoes type=hidden name=opcoes value=''/>
		</form>

		</body>
		<script>
		function zoommais()
		{
			document.getElementById('tipo').value = 'zoommais';
			document.getElementById('f').submit();
		}
		function zoommenos()
		{
			document.getElementById('tipo').value = 'zoommenos';
			document.getElementById('f').submit();
		}
		function norte()
		{
			document.getElementById('tipo').value = 'norte';
			document.getElementById('f').submit();
		}
		function sul()
		{
			document.getElementById('tipo').value = 'sul';
			document.getElementById('f').submit();
		}
		function leste()
		{
			document.getElementById('tipo').value = 'leste';
			document.getElementById('f').submit();
		}
		function oeste()
		{
			document.getElementById('tipo').value = 'oeste';
			document.getElementById('f').submit();
		}
		function opcoes()
		{
			document.getElementById('opcoes').value = document.getElementById('opcao').value;
			document.getElementById('f').submit();
		}
		</script>
		</html>
	";
}
function desenhaImagem()
{
	global $tmpfname;
	$mapa = ms_newMapObj($tmpfname);
	$imgo = $mapa->draw();
	$nome = ($imgo->imagepath).nomeRandomico().".png";
	$imgo->saveImage($nome);
	$nome = ($imgo->imageurl).basename($nome);
	$imgo->free();
	return $nome;
}
function incluiTemasIniciais2()
{
	global $temasa,$temasaplic,$temasdir,$tmpfname;
	$mapa = ms_newMapObj($tmpfname);
	$estadosl = "estadosl";
	if (!isset($temasa)){$temasa = $estadosl;}
	$temasa = str_replace(','," ",$temasa);
	$alayers = explode(" ",$temasa);
	foreach ($alayers as $arqt)
	{
		$arqtemp = "";
		$arqt = trim($arqt);
		if ($arqt == "")
		{continue;}
		if (file_exists($arqt))
		{$arqtemp = $arqt;}
		if ((strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) && (file_exists($temasaplic."\\".$arqt.".map")))
		{$arqtemp = $temasaplic."\\".$arqt.".map";}
		elseif (file_exists($temasaplic."/".$arqt.".map"))
		{$arqtemp = $temasaplic."/".$arqt.".map";}
		if ((strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) && (file_exists($temasdir."\\".$arqt.".map")))
		{$arqtemp = $temasdir."\\".$arqt.".map";}
		elseif (file_exists($temasdir."/".$arqt.".map"))
		{$arqtemp = $temasdir."/".$arqt.".map";}
		if (($arqtemp != "") && (file_exists($arqtemp)))
		{
			$maptemp = @ms_newMapObj($arqtemp);
			for($i=0;$i<($maptemp->numlayers);$i++)
			{
				$layern = $maptemp->getLayer($i);
				$layern->setmetadata("NOMEORIGINAL",$layern->name);
				if ($layern->name == "estadosl")
				{$layern->set("data",$temasaplic."/dados/estados.shp");}
				$layern->set("status",MS_DEFAULT);
				ms_newLayerObj($mapa, $layern);
			}	
		}
	}
	$mapa->save($tmpfname);
}

?>