<?php
/*
Title: Variáveis de inicialização ms_configura.php

Armazena as variáveis de inicialização necessárias ao funcionamento do I3Geo.

O ms_configura é incluído em vários programas do I3Geo.

As variáveis de configuração devem ser definidas para linux e windows.

File: i3geo/ms_configura.php

About: Licença

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
$mensagemInicia = "I3Geo versão 3.8";
if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{
	/*
	Variable: $navegadoresLocais
	
	Ip dos usuarios que podem navegar no servidor para acessar arquivos de dados geográficos 
	*/
	$navegadoresLocais = array(
							array(
							"ip"=>"127.0.0.1",
							"drives"=>array(
										array("caminho"=>"c:/","nome"=>"c"),
										array("caminho"=>"d:/","nome"=>"d")
										)
							)
						);
	/*
	Variable: $editores
	
	Ip dos usuarios que podem administrar via navegador. Separe os ips por vírgula
	*/
	$editores = array("127.0.0.1");
	/*
	Variable: $dir_tmp
	
	Caminho completo do diretório temporário utilizado pelo mapserver
	*/
	$dir_tmp = "c:/ms4w/tmp/ms_tmp";
	/*
	Variable: $locaplic
	
	Caminho completo onde fica o I3Geo
	*/
	$locaplic = "c:/ms4w/apache/htdocs/i3geo";
	/*
	Variable: $temasdir
	
	caminho completo do diretório onde ficam os arquivos .map correspondentes aos temas disponíveis
	*/
	$temasdir = $locaplic."/temas"; //"c:/ms4w/apache/htdocs/i3geo/temas";
	/*
	Variable: $temasaplic
	
	caminho completo onde ficam os arquivos .map específicos do I3Geo
	*/
	$temasaplic = $locaplic."/aplicmap";//"c:\ms4w\apache\htdocs\i3geo\aplicmap";
	/*
	Variable: $locmapserv
	
	localização do executável do Mapserver conforme deve ser acrescentado a URL após o nome do host
	*/
	$locmapserv = "/cgi-bin/mapserv.exe";
	/*
	Variable: $locsistemas
	
	onde fica o xml, relativo ao diretório i3geo, que será embutido na lista de temas com sistemas locais, se for "" não será feita nenhuma inclusão
	*/
	$locsistemas = "http://localhost/i3geo/menutemas/sistemas.xml";
	/*
	Variable: $locidentifica 
	
	onde fica o xml, relativo ao diretório i3geo, que será embutido na lista de identificacao, se for "" não será feita nenhuma inclusão
	*/
	$locidentifica = "http://localhost/i3geo/menutemas/identifica.xml";
	/*
	Variable: $locmapas 
	
	onde fica o xml, para preencher a guia mapas. Se for vazio a guia não será mostrada no mapa
	*/
	$locmapas = "http://localhost/i3geo/menutemas/mapas.xml";
	/*
	Variable: $R_path
	
	onde esta o executavel do pacote R
	
	o R é um pacote estatístico utilizado pelo I3Geo para geração de gráficos e análises estatísticas
	se vc não possui o R instalado, comente a linha abaixo
	*/
	$R_path = "c:/r/win/bin/R.exe";
	/*
	Variable: $postgis_con
	
	string de conexão com o banco de dados postgis utilizada para reallização de cálculos
	
	se não existir, deixe em branco
	*/
	$postgis_con = "";
	/*
	Variable: $srid_area
	
	srid utilizado nos cálculos que exigem projeção equivalente
	*/
	$srid_area = 1;
	/*
	Variable: $postgis_mapa
	
	string de conexão para acesso aos dados
	
	os mapfiles do diretório temas que tiverem CONNECTION " ", terão a string de conexão substituída por esse valor
	se não for desejado a substituição, deixe essa variável em branco
	*/
	$postgis_mapa = "";
	/*
	Variable: $menutemas
	
	array com a lista de arquivos xml que serão incluidos na guia de adição de temas
	
	Example:
	
	$menutemas = array(
		array("idmenu"=>1,"arquivo"=>"http://localhost/i3geo/menutemas/menutemas.xml"),
		array("idmenu"=>2,"arquivo"=>"http://localhost/i3geo/menutemas/menutemas.xml")
		);
	*/
	$menutemas = "";
	/*
	Variable: $utilizacgi
	
	variável indicando se o desenho do corpo do mapa será baseado no cgi
	
	Por default, o mapserver desenha o mapa via php.
	Em alguns casos o uso do cgi torna a aplicação mais rápida
	*/
	$utilizacgi = "sim";
}
else //se for linux
{
	$editores = array("");
	$dir_tmp = "/var/tmp/ms_tmp";
	$temasdir = "/opt/www/html/i3geo/temas";
	$temasaplic = "/opt/www/html/i3geo/aplicmap";
	$locmapserv = "/cgi-bin/mapserv";
	$locaplic = "/opt/www/html/i3geo";
	$locsistemas= "http://mapas.mma.gov.br/i3geo/menutemas/sistemas.xml";
	$locidentifica = "http://mapas.mma.gov.br/i3geo/menutemas/identifica.xml";
	$locmapas = "http://mapas.mma.gov.br/abremapa.php?id=xml";
	$R_path = "R";//se vc não instalou o R no seu servidor, tente o endereço $R_path = $locaplic."/pacotes/r/linux/r";
	$postgis_con = "";
	$srid_area = 1;
	$postgis_mapa = "";
	/*
	$menutemas = array(
		array("idmenu"=>1,"arquivo"=>"http://mapas.mma.gov.br/i3geo/menutemas/menutemas.xml")
		);
	*/
	$menutemas = "";
	$utilizacgi = "sim";
}
?>
