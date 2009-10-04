<html>
<script>
try
{var objhttp1 = new XMLHttpRequest();}
catch(ee)
{
	try{var objhttp1 = new ActiveXObject("Msxml2.XMLHTTP");}
	catch(e)
	{
		try{var objhttp1 = new ActiveXObject("Microsoft.XMLHTTP");}
		catch(E)
		{document.write("<H1>Seu navegador não aceita AJAX. O mapa nao vai funcionar!!!</H1><br>");}
	}
}
</script>
<?php
/*
Title: Testa a instalação do I3Geo

Executa testes e aponta erros na instalação.

Link:

http://localhost/i3geo/testainstal.php

Arquivo:

i3geo/testainstal.php

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
error_reporting(E_ALL);
echo "<pre>\n";
echo "<b>TESTE DE INSTALACAO DO i3Geo</b><br>\n";
echo getcwd();
//echo "<br>SERVER_SOFTWARE: ".$SERVER_SOFTWARE."<br>";
echo "<br><br>PHP (a versão deve ser a 5x e menor que 5.3): ";
echo "<br>".phpversion()."<br>\n";
include("classesphp/carrega_ext.php");
$exts = get_loaded_extensions();
echo ms_GetVersion()."<br><br>";
echo "---";
echo "<br><pre>Extensoes:<br>";
if (array_search( "libxml", $exts) != TRUE){echo "<span style=color:red >Problema: não está instalado a libxml<br></span>";}
if (array_search( "PDO", $exts) != TRUE){echo "<span style=color:red >Problema: não está instalado a PDO<br></span>";}
if (array_search( "pdo_sqlite", $exts) != TRUE){echo "<span style=color:red >Problema: não está instalado a pdo_sqlite<br></span>";}
if (array_search( "SQLite", $exts) != TRUE){echo "<span style=color:red >Problema: não está instalado a SQLite<br></span>";}

if (array_search( "PDO", $exts) != TRUE){echo "<span style=color:red >Problema: não está instalado a PDO<br></span>";}
if (array_search( "SimpleXML", $exts) != TRUE){echo "<span style=color:red >Problema: não está instalado a SimpleXML<br></span>";}
if (array_search( "dom", $exts) != TRUE){echo "<span style=color:red >Problema: não está instalado a dom<br></span>";}
if (array_search( "xml", $exts) != TRUE){echo "<span style=color:red >Problema: não está instalado a xml<br></span>";}
if (array_search( "gd", $exts) != TRUE){echo "<span style=color:red >Problema: não está instalado a gd<br></span>";}
if (array_search( "gd2", $exts) != TRUE){echo "<span style=color:red >Obs: não está instalado a gd2 - o que não é muito crítico....<br></span>";}


var_dump( $exts );

echo "Existe o ms_configura.php? ";
if(file_exists("ms_configura.php")) echo "Sim\n"; else {echo "Nao";saindo("ms_configura não encontrado");}
echo "Incluindo...\n<br>";
include ("ms_configura.php");
echo "dir_tmp = $dir_tmp \n";
echo "temasdir = $temasdir \n";
echo "temasaplic = $temasaplic \n";
echo "locmapserv = $locmapserv \n";
echo "locaplic = $locaplic \n";
echo "locsistemas = $locsistemas \n";
echo "locidentifica = $locidentifica \n";
echo "\n<br>";
echo "editores: \n";
var_dump($editores);

$ip = "UNKNOWN";
if (getenv("HTTP_CLIENT_IP")) $ip = getenv("HTTP_CLIENT_IP");
else if(getenv("HTTP_X_FORWARDED_FOR")) $ip = getenv("HTTP_X_FORWARDED_FOR");
else if(getenv("REMOTE_ADDR")) $ip = getenv("REMOTE_ADDR");
else $ip = "UNKNOWN";

echo "IP do cliente = $ip \n";
echo "\n<br>";
echo "localizando o cgi...\n";
$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
$enderecocgi = $proto.$server.$locmapserv;
/*
if(!file_exists($locmapserv))
{
	echo "<span style=color:red >O arquivo cgi $locmapserv do mapserver nao foi encontrado</span> \n";
}
else
{echo "O arquivo cgi $enderecocgi do mapserver foi encontrado \n";}
*/
echo "Você pode testar o CGI clicando <a href='".$enderecocgi."' target='_blank'>aqui</a>, se o programa responder corretamente, deverá aparecer na tela algo como 'No query information to decode. QUERY_STRING is set, but empty.'\n" ;

echo "<br>Escrevendo no diretorio temporario...";
$f = @fopen($dir_tmp."/teste.txt",w);
@fclose($f);
if (file_exists($dir_tmp."/teste.txt")) echo "ok\n"; else saindo("Não foi possível gravar no diretório temporário");
echo "Existe o geral1.map? ";
if(file_exists("$locaplic/aplicmap/geral1.map")) echo "Sim\n"; else {echo "Nao";saindo("geral1.map não encontrado");}
if ($locsistemas != "")
{
	echo "Existe o $locsistemas? ";
	if (file_exists("menutemas/sistemas.xml")) echo "ok\n"; else saindo();
	echo "Lendo sistemas.xml \n";
	simplexml_load_file("menutemas/sistemas.xml");
}
if ($locidentifica != "")
{
	echo "Existe o $locidentifica? ";
	if (file_exists("menutemas/identifica.xml")) echo "ok\n"; else saindo();
	echo "Lendo locidentifica.xml \n";
	simplexml_load_file("menutemas/identifica.xml");
}
echo "Existe o menutemas.xml? ";
if (file_exists($locaplic."/menutemas/menutemas.xml")) echo "ok\n"; else saindo("menutemas.xml não encontrado");
echo "Lendo $locaplic/menutemas/menutemas.xml \n";
simplexml_load_file($locaplic."/menutemas/menutemas.xml");
echo " \n";
echo "Carregando o map_file geral1...\n";
if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{$mapa = ms_newMapObj($temasaplic."/geral1windows.map");}
else
{$mapa = ms_newMapObj($temasaplic."/geral1.map");}
echo "<b>E agora..desenhando o mapa (se o mapa não aparecer é um problema...\nverifique os caminhos no ms_configura.php e no geral1.map ou geral1windows.map):</b>\n";
$imgo = $mapa->draw();
$nome = ($imgo->imagepath)."teste.png";
echo "<p>Nome da imagem gerada: $nome </p>";
$imgo->saveImage($nome);
$nome = ($imgo->imageurl).basename($nome);
echo "<p><img src=$nome /></p>";

echo " \n";
$error = "";
ms_ResetErrorList();
echo "Carregando o map_file geral1... e acrescentando o estadosl.map \n";
if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{$maptemp = ms_newMapObj($temasaplic."/estadoslwindows.map");}
else
{$maptemp = ms_newMapObj($temasaplic."/estadosl.map");}
while($error && $error->code != MS_NOERR)
{
	printf("<br>Error in %s: %s<br>\n", $error->routine, $error->message);
	$error = $error->next();
}
echo "<b>E agora..desenhando o mapa (se o mapa não aparecer é um problema...\nverifique os caminhos no ms_configura.php e no estadosl.map ou estadoslwindows.map):</b>\n";
echo "Um problema bastante comum é o não reconhecimento do diretório ms_tmp pelo Apache. \nO diretório ms_tmp é utilizado pelo Mapserver e pelo i3geo para armazenar dados temporários. \nÉ nesse diretório que ficam as imagens do mapa.\n";
echo "Quando o Apache não consegue utilizar esse diretório, a imagem não será mostrada,\n apesar de ser gerada dentro do ms_tmp (vc pode verificar se as imagens do \nmapa estão sendo criadas no ms_tmp após rodar o testainstal.php).\n";
echo "Para solucionar esse problema, vc pode criar um link simbólico (nos sistemas linux),\n no mesmo local onde está instalado o i3geo, apontando para o local \nfísico onde está o ms_tmp.\n";
echo "No wiki do portal do software público vc poderá encontrar mais detalhes sobre isso.\n";

for($i=0;$i<($maptemp->numlayers);$i++)
{
	$layern = $maptemp->getLayer($i);
	if ($layern->name == "estadosl")
	{$layern->set("data",$temasaplic."/dados/estados.shp");}
	ms_newLayerObj($mapa, $layern);
}

$imgo = $mapa->draw();
$nome = ($imgo->imagepath)."teste1.png";
echo "<p>Nome da imagem gerada: $nome </p>";
$imgo->saveImage($nome);
$nome = ($imgo->imageurl).basename($nome);
echo "<p><img src=$nome /></p></body></html>";

function saindo($men){echo "<span style=color:red ><br><b>Erro. Saindo...".$men;}
?>
