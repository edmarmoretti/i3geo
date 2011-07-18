<?php
/*
Title: editormapfile.php

Funções utilizadas pelo editor de arquivos mapfile.

É utilizado nas funções em AJAX da interface de edição de mapfiles

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/admin/php/editormapfile.php

Parametros:

O parâmetro principal é "funcao", que define qual operação será executada, por exemplo, editormapfile.php?funcao=pegaMapfiles

Cada operação possuí seus próprios parâmetros, que devem ser enviados também na requisição da operação.

*/
include_once("admin.php");
error_reporting(0);
//faz a busca da função que deve ser executada
switch (strtoupper($funcao))
{
	/*
	Note:
	
	Valores que o parâmetro &funcao pode receber. Os parâmetros devem ser enviados na requisição em AJAX.
	*/
	/*
	Valor: CRIARNOVOMAP
	
	Cria um novo mapfile
	
	Parametros:
	
	nome - título do novo tema
	
	codigo - texto que será usado como nome do arquivo mapfile
	
	it - {opcional} título em italiano
	
	en - {opcional} título em inglês
	
	es - {opcional} título em espanhol
	
	Retorno:
	
	{JSON}
	*/
	case "CRIARNOVOMAP":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(criarNovoMap());
		exit;
	break;
	/*
	Valor: EDITASIMBOLO
	
	Lista os símbolos de um determinado tipo
	
	Parametros:
	
	tipo {string} - tipo de layer
	
	onclick {string} - função javascript que será executada ao se clicar no símbilo
	
	Retorno:
	
	{JSON}
	*/	
	case "EDITASIMBOLO":
		include_once("$locaplic/classesphp/classe_legenda.php");
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$map_file = $locaplic."/aplicmap/geral1windows.map";}
		else{
			if(file_exists('/var/www/i3geo/aplicmap/geral1debian.map')){
				$map_file = ms_newMapObj("aplicmap/geral1debian.map");
			}
			else
			{$map_file = ms_newMapObj("aplicmap/geral1.map");}		
		}
		$m = new Legenda($map_file,$locaplic);
		retornaJSON($m->listaSimbolos($tipo,$dir_tmp,"",$onclick));
		exit;
	break;	
	/*
	Valor: PEGALAYERS
	
	Lista os layers existentes em um mapfile
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	Retorno:
	
	{JSON}
	*/
	case "PEGALAYERS":
		retornaJSON(pegaLayers());
		exit;
	break;
	/*
	Valor: PEGAITENSLAYER
	
	Lista os itens da tabela de atributos de um layer
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	Retorno:
	
	{JSON}
	*/	
	case "PEGAITENSLAYER":
		retornaJSON(pegaItensLayer());
		exit;
	break;
	/*
	Valor: LIMPARCACHEMAPFILE
	
	Apaga o diretório contendo o cache de um tema (mapfile)
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	Retorno:
	
	{JSON}
	*/	
	case "LIMPARCACHEMAPFILE":
		error_reporting(E_ALL);
		$mapfile = $locaplic."/temas/".$codigoMap.".map";
		$mapa = ms_newMapObj($mapfile);
		$nomes = $mapa->getalllayernames();
		foreach($nomes as $nome)
		{
			$dir = $dir_tmp."/cache/".$nome;
			if (is_dir($dir)) {
				$objects = scandir($dir);
				foreach ($objects as $object) {
					if ($object != "." && $object != "..") {
						if (filetype($dir."/".$object) == "dir") rrmdir($dir."/".$object); else unlink($dir."/".$object);
					}
				}
				reset($objects);
				rmdir($dir);
			} 
		}
		retornaJSON("ok");
		exit;
	break;
	/*
	Valor: EXCLUIRMAPFILE
	
	Exclui um mapfile.
	
	Só é possível excluir se o mapfile não estiver vinculado a nenhum tema ou nó da árvore de temas
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	Retorno:
	
	{JSON}
	*/	
	case "EXCLUIRMAPFILE":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		//pega oid do tema
		$dados = pegaDados("SELECT id_tema from i3geoadmin_temas WHERE codigo_tema = '".$codigoMap."'");
		if(count($dados) > 0)
		{$id = $dados[0]["id_tema"];}
		$tabela = "mapfiles";
		$coluna = "id_tema";
		$f = verificaFilhos();
		if($f)
		{
			retornaJSON("erro");
			exit;
		}
		else
		{
			if(file_exists("$locaplic/temas/".$codigoMap.".map"))
			{unlink("$locaplic/temas/".$codigoMap.".map");}
			$tabela = "i3geoadmin_temas";
			if($id)
			{exclui();}
			retornaJSON("ok");
			exit;
		}
	break;
	/*
	Valor: REFAZERLAYER
	
	Altera um layer existente em um mapfile com base em um layer existente em outro mapfile
	
	Parametros:
	
	codigomap {string} - nome do mapfile existente em i3geo/temas que será atualizado (sem .map)
	
	maporigem {string} - nome completo do arquivo mapfile que contem o layer que será utilizado para alterar o original
	
	nomelayer {string} - código do layer em mapfile que será utilizado para atualizar codigoMap
	
	Retorno:
	
	{JSON}
	*/	
	case "REFAZERLAYER":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(refazerLayer());
		exit;
	break;
	/*
	Valor: CLONARMAPFILE
	
	Copia um mapfile existente
	
	Parametros:
	
	codigomap {string} - nome do mapfile existente em i3geo/temas que será clonado (sem .map)
	
	novomap {string} - nome do mapfile que será criado
	
	Retorno:
	
	{JSON}
	*/	
	case "CLONARMAPFILE":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(clonarMapfile());
		exit;
	break;
	/*
	Valor: CRIARNOVOLAYER
	
	Cria um novo layer em um mapfile
	
	O novo layer receberá um nome aleatório, que pode ser modificado posteriormente. Por default, esse novo layer será do tipo linear
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	Retorno:
	
	{JSON}
	*/	
	case "CRIARNOVOLAYER":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(criarNovoLayer());
		exit;
	break;
	/*
	Valor: EXCLUIRLAYER
	
	Exclui um layer de um mapfile
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	Retorno:
	
	{JSON}
	*/
	case "EXCLUIRLAYER":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(excluirLayer());
		exit;
	break;
	/*
	Valor: LISTACLASSES
	
	Lista as classes da legenda de um layer em um mapfile
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	Retorno:
	
	{JSON}
	*/	
	case "LISTACLASSES":
		retornaJSON(listaClasses());
		exit;
	break;
	/*
	Valor: AUTOCLASSESLAYER
	
	Cria classes em um layer com base na tabela de atributos
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	itemExpressao - item da tabela de atributos que contém os valores únicos para as classes
	
	itemNome - item da tabela de atributos que contém os nomes de cada classe
	
	Retorno:
	
	{JSON}
	*/	
	case "AUTOCLASSESLAYER":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		autoClassesLayer();
		retornaJSON(listaClasses());
		exit;
	break;
	/*
	Valor: CRIARNOVACLASSE
	
	Cria uma nova classe em um layer
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
		
	Retorno:
	
	{JSON}
	*/	
	case "CRIARNOVACLASSE":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(criarNovaClasse());
		exit;
	break;
	/*
	Valor: EXCLUIRCLASSE
	
	Cria uma nova classe em um layer
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	indiceClasse {numerico} - índice da classe (de 0 até número de classes-1)
		
	Retorno:
	
	{JSON}
	*/	
	case "EXCLUIRCLASSE":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		excluirClasse();
		retornaJSON(listaClasses());
		exit;
	break;
	/*
	Valor: LISTAESTILOS
	
	Lista de estilos existentes em uma classe de um layer
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	indiceClasse {numerico} - índice da classe (de 0 até número de classes-1)
		
	Retorno:
	
	{JSON}
	*/	
	case "LISTAESTILOS":
		retornaJSON(listaEstilos());
		exit;
	break;
	/*
	Valor: CRIARNOVOESTILO
	
	Adiciona um novo estilo em uma classe
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	indiceClasse {numerico} - índice da classe (de 0 até número de classes-1)
		
	Retorno:
	
	{JSON}
	*/	
	case "CRIARNOVOESTILO":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(criarNovoEstilo());
		exit;
	break;
	/*
	Valor: EXCLUIRESTILO
	
	Exclui um estilo de uma classe
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	indiceClasse {numerico} - índice da classe (de 0 até número de classes-1)
	
	indiceEstilo {numerico} - índice do estilo (de 0 até número de estilos-1)
		
	Retorno:
	
	{JSON}
	*/	
	case "EXCLUIRESTILO":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		excluirEstilo();
		retornaJSON(listaEstilos());
		exit;
	break;
	/*
	Valor: PEGAESTILO
	
	Obtém os dados de um estilo de uma classe
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	indiceClasse {numerico} - índice da classe (de 0 até número de classes-1)
	
	indiceEstilo {numerico} - índice do estilo (de 0 até número de estilos-1)
		
	Retorno:
	
	{JSON}
	*/	
	case "PEGAESTILO":
		retornaJSON(pegaEstilo());
		exit;
	break;
	/*
	Valor: ALTERARESTILO
	
	Altera um estilo de uma classe
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	indiceClasse {numerico} - índice da classe (de 0 até número de classes-1)
	
	indiceEstilo {numerico} - índice do estilo (de 0 até número de estilos-1)
	
	angle
	
	maxwidth
	
	minwidth
	
	width
	
	outlinecolor
	
	backgroundcolor
	
	antialias
	
	offsety
	
	offsetx
	
	maxsize
	
	minsize
	
	size
	
	color
	
	symbolname
	
	Retorno:
	
	{JSON}
	*/
	case "ALTERARESTILO":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		alterarEstilo();
		retornaJSON(pegaEstilo());
		exit;
	break;
	/*
	Valor: PEGACONEXAO
	
	Obtém os valores dos elementos de conexão com uma base de dados de um layer
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	Retorno:
	
	{JSON}
	*/
	case "PEGACONEXAO":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		retornaJSON(pegaConexao());
		exit;
	break;
	/*
	Valor: ALTERARCONEXAO
	
	Altera os valores dos elementos de conexão com uma base de dados de um layer
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	connection
	
	connectiontype
	
	data
	
	tileitem
	
	tileindex
	
	type
	
	Retorno:
	
	{JSON}
	*/	
	case "ALTERARCONEXAO":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$retorno = alterarConexao();
		if($testar == "false")
		retornaJSON(pegaConexao());
		else
		retornaJSON(array("url"=>$retorno));
		exit;
	break;
	/*
	Valor: PEGAMETADADOS
	
	Obtém os valores dos elementos de metadados de um layer
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	Retorno:
	
	{JSON}
	*/	
	case "PEGAMETADADOS":
		retornaJSON(pegaMetadados());
		exit;
	break;
	/*
	Valor: ALTERARMETADADOS
	
	Altera os valores dos elementos de metadados de um layer
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	iconetema
	
	ltempoformatodata
	
	ltempoiteminicio
	
	ltempoitemfim
	
	ltempoitemtitulo
	
	ltempoitemdescricao
	
	ltempoitemtip
	
	ltempoitemimagem
	
	ltempoitemicone
	
	ltempoitemlink
	
	description_template
	
	palletestep
	
	palletefile
	
	arquivodownload
	
	aplicaextensao
	
	classestamanho
	
	classessimbolo
	
	classescor
	
	classesnome
	
	classesitem
	
	mensagem
	
	identifica
	
	transitioneffect
	
	extensao
	
	escondido
	
	download
	
	escala
	
	tema
	
	classe
	
	tip
	
	itenslink
	
	itens
	
	itensdesc
	
	editorsql
	
	cache
	
	permitecomentario
	
	itembuscarapida
	
	Retorno:
	
	{JSON}
	*/	
	case "ALTERARMETADADOS":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		alterarMetadados();
		retornaJSON(pegaMetadados());
		exit;
	break;
	/*
	Valor: PEGAGERAL
	
	Obtém os valores dos elementos de configuração geral de um layer
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	Retorno:
	
	{JSON}
	*/	
	case "PEGAGERAL":
		retornaJSON(pegaGeral());
		exit;
	break;
	/*
	Valor: ALTERARGERAL
	
	Modifica os valores dos elementos de configuração geral de um layer
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	testar
	
	name
	
	projection
	
	sizeunits
	
	status
	
	toleranceunits
	
	tolerance
	
	symbolscale
	
	opacity
	
	offsite
	
	minscale
	
	maxscale
	
	labelsizeitem
	
	labelminscale
	
	labelmaxscale
	
	labelitem
	
	group
	
	filteritem
	
	type
	
	filter
	
	Retorno:
	
	{JSON}
	*/	
	case "ALTERARGERAL":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		
		$retorno = alterarGeral();
		
		if($testar == "false")
		{
			$codigoLayer = $name;
			retornaJSON(pegaGeral());
		}
		else
		retornaJSON(array("url"=>$retorno));		
		exit;
	break;
	/*
	Valor: PEGACLASSEGERAL
	
	Obtém os valores dos elementos de configuração geral de uma classe
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	indiceClasse {numerico} - índice da classe (de 0 até número de classes-1)
	
	Retorno:
	
	{JSON}
	*/	
	case "PEGACLASSEGERAL":
		retornaJSON(pegaClasseGeral());
		exit;
	break;
	/*
	Valor: ALTERARCLASSEGERAL
	
	Altera os valores dos elementos de configuração geral de uma classe
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	indiceClasse {numerico} - índice da classe (de 0 até número de classes-1)
	
	status
	
	minscale
	
	maxscale
	
	name
	
	expression
	
	keyimage
	
	title
	
	Retorno:
	
	{JSON}
	*/	
	case "ALTERARCLASSEGERAL":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		alterarClasseGeral();
		retornaJSON(pegaClasseGeral());
		exit;
	break;
	/*
	Valor: PEGACLASSELABEL
	
	Obtém os valores dos elementos de configuração da toponímia de uma classe
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	indiceClasse {numerico} - índice da classe (de 0 até número de classes-1)
	
	Retorno:
	
	{JSON}
	*/	
	case "PEGACLASSELABEL":
		retornaJSON(pegaClasseLabel());
		exit;
	break;
	/*
	Valor: ALTERARCLASSELABEL
	
	Altera os valores dos elementos de configuração da toponímia de uma classe
	
	Parametros:
	
	codigoMap {string} - nome do mapfile (sem .map)
	
	codigoLayer {string} - 'name' do layer existente no mapfile
	
	indiceClasse {numerico} - índice da classe (de 0 até número de classes-1)
	
	autoangle
	
	encoding
	
	force
	
	partials
	
	mindistance
	
	minfeaturesize
	
	wrap
	
	antialias
	
	buffer
	
	angle
	
	offsety
	
	offsetx
	
	position
	
	maxsize
	
	minsize
	
	size
	
	backgroundshadowsizey
	
	backgroundshadowsizex
	
	shadowsizey
	
	shadowsizex
	
	shadowcolor
	
	outlinecolor
	
	color
	
	backgroundshadowcolor
	
	backgroundcolor
	
	type
	
	font
	
	Retorno:
	
	{JSON}
	*/	
	case "ALTERARCLASSELABEL":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		alterarClasseLabel();
		retornaJSON(pegaClasseLabel());
		exit;
	break;
	case "MOVIMENTANO":
		if(verificaEditores($editores) == "nao")
		{echo "Vc nao e um editor cadastrado. Apenas os editores definidos em i3geo/ms_configura.php podem acessar o sistema de administracao.";exit;}
		$res = sobeDesce();
		retornaJSON($res);
		exit;
	break;
}
function clonarMapfile()
{
	global $novomap, $codigomap, $locaplic;
	error_reporting(E_ALL);
	$arqtema = $locaplic."/temas/".$codigomap.".map";
	$novotema = $locaplic."/temas/".$novomap.".map";
	copy($arqtema,$novotema);
	$mapa = ms_newMapObj($novotema);
	$layer = @$mapa->getlayerbyname($codigomap);
	$layer->set("name",$novomap);
	$mapa->save($novotema);
	removeCabecalho($novotema);
	return array("data"=>"ok");		
}
function refazerLayer()
{
	global $nomelayer, $codigomap, $maporigem, $locaplic;
	error_reporting(E_ALL);
	$mapa = ms_newMapObj($maporigem);
	$arqtema = $locaplic."/temas/".$codigomap.".map";
	$mapatema = ms_newMapObj($arqtema);
	$layeroriginal = @$mapatema->getlayerbyname($codigomap);
	$layernovo = @$mapa->getlayerbyname($nomelayer);
	if($layeroriginal != "" && $layernovo != "")
	{
		$layeroriginal->set("status",MS_DELETE);
		$nl = ms_newLayerObj($mapatema,$layernovo);
		$nl->set("name",$codigomap);
		$nl->setmetadata("nomeoriginal","");
		$nl->setmetadata("cache","");
		$numclasses = $nl->numclasses;
		if ($numclasses > 0)
		{
			for ($i=0; $i < $numclasses; $i++)
			{
				$classe = $nl->getClass($i);
				$classe->set("title","");
			}
		}
		$mapatema->save($arqtema);
		removeCabecalho($arqtema);
		return array("data"=>"ok");		
	}
	return "erro";
}
function sobeDesce()
{
	global $movimento,$tipo,$codigoMap,$codigoLayer,$indiceClasse,$indiceEstilo,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	if($movimento == "sobe")
	{
		if($tipo == "layer")
		{		
			$indice = $layer->index;
			$mapa->moveLayerUp($indice);
		}	
		if($tipo == "classe")
		{
			$layer->moveclassup($indiceClasse);
		}	
		if($tipo == "estilo")
		{
			$classe = $layer->getclass($indiceClasse);
			$classe->movestyleup($indiceEstilo);
		}	

	}
	if($movimento == "desce")
	{
		if($tipo == "layer")
		{
			$indice = $layer->index;
			$mapa->moveLayerDown($indice);
		}
		if($tipo == "classe")
		{
			$layer->moveclassdown($indiceClasse);
		}
		if($tipo == "estilo")
		{
			$classe = $layer->getclass($indiceClasse);
			$classe->movestyledown($indiceEstilo);
		}
	}
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function criarNovoMap()
{
	global $nome,$codigo,$locaplic,$it,$en,$es;
	$arq = $locaplic."/temas/".$codigo.".map";
	if(!file_exists($arq))
	{
		$dados[] = "MAP";
		$dados[] = "SYMBOLSET ../symbols/simbolos.sym";
		$dados[] = 'FONTSET   "../symbols/fontes.txt"';
		$dados[] = "LAYER";
		$dados[] = "	NAME $codigo";
		$dados[] = "	TYPE line";
		$dados[] = '	DATA ""';
		$dados[] = '	METADATA';
		$dados[] = '		TEMA "'.$nome.'"';
		$dados[] = '		CLASSE "SIM"';
		$dados[] = '	END';
		$dados[] = '    CLASS';
		$dados[] = '        NAME ""';
		$dados[] = '        STYLE';
		$dados[] = '        	COLOR 0 0 0';
		$dados[] = '        END';
		$dados[] = '    END';
		$dados[] = "END";
		$dados[] = "END";
		$fp = fopen($arq,"w");
		foreach ($dados as $dado)
		{
			fwrite($fp,$dado."\n");
		}
    	require_once("conexao.php");
    	$dbhw->query("INSERT INTO i3geoadmin_temas (link_tema,kml_tema,kmz_tema,ogc_tema,download_tema,desc_tema,tipoa_tema,tags_tema,nome_tema,codigo_tema,it,es,en) VALUES ('','','', '','','','','','$nome','$codigo','$it','$es','$en')");
    	$dbh = null;
    	$dbhw = null;
		return "ok";
	}
	return "erro";
}
function criarNovoLayer()
{
	global $locaplic,$codigoMap;
	include_once("$locaplic/classesphp/funcoes_gerais.php");
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = ms_newLayerObj($mapa);
	$nl->set("name",nomeRandomico());
	$nl->set("type",MS_LAYER_LINE);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return array("layers"=>(array($nl->name)));
}
function autoClassesLayer()
{
	global $codigoMap,$codigoLayer,$itemExpressao,$itemNome,$locaplic,$dir_tmp;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	include_once("$locaplic/classesphp/classe_alteraclasse.php");
	error_reporting(0);
	$nometemp = $dir_tmp."/".nomerandomico().".map";
	if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
	{$geral = $locaplic."/aplicmap/geral1windows.map";}
	else
	{$geral = $locaplic."/aplicmap/geral1.map";}
	$mapageral = ms_newMapObj($geral);
	$nomestemp = $mapageral->getalllayernames();
	foreach($nomestemp as $l)
	{
		$layertemp = $mapageral->getlayerbyname($l);
		$layertemp->set("status",MS_DELETE);
	}
	$mapatemp = ms_newMapObj($mapfile);
	$nomestemp = $mapatemp->getalllayernames();
	foreach($nomestemp as $l)
	{
		$layertemp = $mapatemp->getlayerbyname($l);
		ms_newLayerObj($mapageral, $layertemp);
	}
	$mapageral->save($nometemp);
	$m = new Alteraclasse($nometemp,$codigoLayer);
	$m->valorunico($itemExpressao,"",$itemNome);
	$m->salva();
	$mapatemp = ms_newMapObj($nometemp);
	$mapatemp->save($mapfile);
	removeCabecalho($mapfile);
}
function criarNovaClasse()
{
	global $codigoMap,$codigoLayer,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$nclasses = $nl->numclasses;
	$classe = ms_newClassObj($nl);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	$dados[] = array("indice"=>($nclasses),"nome"=>(""));
	return $dados;
}
function criarNovoEstilo()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$classObj = $nl->getclass($indiceClasse);
	$numestilos = $classObj->numstyles;
	$nestilo = ms_newStyleObj($classObj);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	$dados[] = array("estilo"=>$numestilos);
	return $dados;
}
function pegaItensLayer()
{
	global $codigoMap,$locaplic,$codigoLayer;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$layer->open();
	$itens = $layer->getitems();
	$layer->close();
	$dados["itens"] = $itens;
	return $dados;
}
function pegaLayers()
{
	global $codigoMap,$locaplic;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layers = $mapa->getalllayernames();
	$dados["layers"] = $layers;
	return $dados;
}
function listaClasses()
{
	global $codigoMap,$codigoLayer,$locaplic;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$nclasses = $layer->numclasses;
	for($i=0;$i<$nclasses;++$i)
	{
		$classe = $layer->getclass($i);
		$dados[] = array("indice"=>$i,"nome"=>(mb_convert_encoding($classe->name,"UTF-8","ISO-8859-1")));
	}
	return $dados;
}
function listaEstilos()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$locaplic;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$classe = $layer->getclass($indiceClasse);
	$numestilos = $classe->numstyles;
	for($i=0;$i<$numestilos;++$i)
	{
		$dados[] = array("estilo"=>$i);
	}
	return $dados;
}

function excluirLayer()
{
	global $codigoMap,$codigoLayer,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$nl->set("status",MS_DELETE);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function excluirClasse()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$classObj = $nl->getclass($indiceClasse);
	$classObj->set("status",MS_DELETE);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function excluirEstilo()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$indiceEstilo,$locaplic;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$nl = $mapa->getlayerbyname($codigoLayer);
	$classObj = $nl->getclass($indiceClasse);
	$classObj->deletestyle($indiceEstilo);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function pegaConexao()
{
	global $codigoMap,$codigoLayer,$locaplic,$postgis_mapa;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$dados["connection"] = $layer->connection;
	$dados["connectiontype"] = $layer->connectiontype;
	$dados["data"] = $layer->data;
	$dados["tileindex"] = $layer->tileindex;
	$dados["tileitem"] = $layer->tileitem;
	if($dados["tileindex"] == ""){$dados["tileitem"] = "";}
	if(is_array($postgis_mapa))
	$dados["postgis_mapa"] = array_keys($postgis_mapa);
	else
	$dados["postgis_mapa"] = $postgis_mapa;
	$dados["codigoMap"] = $codigoMap;
	$dados["codigoLayer"] = $codigoLayer;
	$dados["type"] = $layer->type;
	return $dados;
}
function alterarConexao()
{
	global $type,$dir_tmp,$testar,$codigoMap,$codigoLayer,$locaplic,$connection,$connectiontype,$data,$tileitem,$tileindex;
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$layer->set("connection",$connection);
	if(ms_GetVersionInt() > 50201)
	{$layer->setconnectiontype($connectiontype);}
	else
	{$layer->set("connectiontype",$connectiontype);}
	$layer->set("data",$data);
	$layer->set("tileitem",$tileitem);
	$layer->set("tileindex",$tileindex);
	$layer->set("type",$type);
	if($testar == "true")
	{
		$nome = $dir_tmp."/".$codigoMap.".map";
		$mapa->save($nome);
		removeCabecalho($nome,false);
		return $nome;
	}
	else
	{
		$mapa->save($mapfile);
		removeCabecalho($mapfile);
		return "ok";
	}
}
function pegaMetadados()
{
	global $codigoMap,$codigoLayer,$locaplic,$postgis_mapa;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$dados["type"] = $layer->type;
	$dados["connectiontype"] = $layer->connectiontype;
	$dados["itens"] = $layer->getmetadata("itens");
	$dados["itensdesc"] = mb_convert_encoding($layer->getmetadata("itensdesc"),"UTF-8","ISO-8859-1"); //$layer->getmetadata("itensdesc");
	$dados["itenslink"] = $layer->getmetadata("itenslink");
	$dados["tip"] = $layer->getmetadata("tip");
	$dados["tema"] = mb_convert_encoding($layer->getmetadata("tema"),"UTF-8","ISO-8859-1");//$layer->getmetadata("tema");
	$dados["classe"] = $layer->getmetadata("classe");
	$dados["escala"] = $layer->getmetadata("escala");
	$dados["download"] = $layer->getmetadata("download");
	$dados["escondido"] = $layer->getmetadata("escondido");
	$dados["extensao"] = $layer->getmetadata("extensao");
	$dados["identifica"] = $layer->getmetadata("identifica");
	$dados["transitioneffect"] = $layer->getmetadata("transitioneffect");
	$dados["mensagem"] = mb_convert_encoding($layer->getmetadata("mensagem"),"UTF-8","ISO-8859-1");//$layer->getmetadata("mensagem");
	$dados["classesitem"] = $layer->getmetadata("classesitem");
	$dados["classesnome"] = $layer->getmetadata("classesnome");
	$dados["classescor"] = $layer->getmetadata("classescor");
	$dados["classessimbolo"] = $layer->getmetadata("classessimbolo");
	$dados["classestamanho"] = $layer->getmetadata("classestamanho");
	$dados["aplicaextensao"] = $layer->getmetadata("aplicaextensao");
	$dados["arquivodownload"] = $layer->getmetadata("arquivodownload");
	$dados["temporizador"] = $layer->getmetadata("temporizador");
	$dados["arquivokmz"] = $layer->getmetadata("arquivokmz");
	$dados["palletefile"] = $layer->getmetadata("palletefile");
	$dados["palletestep"] = $layer->getmetadata("palletestep");
	$dados["description_template"] = $layer->getmetadata("description_template");
	$dados["editorsql"] = $layer->getmetadata("editorsql");
	$dados["cache"] = $layer->getmetadata("cache");
	$dados["codigoMap"] = $codigoMap;
	$dados["codigoLayer"] = $codigoLayer;
	$dados["colunas"] = implode(" ,",pegaItens($layer));
	$dados["ltempoformatodata"] = $layer->getmetadata("ltempoformatodata");
	$dados["ltempoiteminicio"] = $layer->getmetadata("ltempoiteminicio");
	$dados["ltempoitemfim"] = $layer->getmetadata("ltempoitemfim");
	$dados["ltempoitemtitulo"] = $layer->getmetadata("ltempoitemtitulo");
	$dados["ltempoitemdescricao"] = $layer->getmetadata("ltempoitemdescricao");
	$dados["ltempoitemtip"] = $layer->getmetadata("ltempoitemtip");
	$dados["ltempoitemimagem"] = $layer->getmetadata("ltempoitemimagem");
	$dados["ltempoitemicone"] = $layer->getmetadata("ltempoitemicone");
	$dados["ltempoitemlink"] = $layer->getmetadata("ltempoitemlink");
	$dados["iconetema"] = $layer->getmetadata("iconetema");
	$dados["permitecomentario"] = $layer->getmetadata("permitecomentario");
	$dados["itembuscarapida"] = $layer->getmetadata("itembuscarapida");
	$dados["legendaimg"] = $layer->getmetadata("legendaimg");
	if($layer->connectiontype == 7 || $layer->connectiontype== 9){
		$dados["wms_srs"] = $layer->getmetadata("wms_srs");
		$dados["wms_name"] = $layer->getmetadata("wms_name");
		$dados["wms_server_version"] = $layer->getmetadata("wms_server_version");
		$dados["wms_format"] = $layer->getmetadata("wms_format");
		$dados["wms_auth_username"] = $layer->getmetadata("wms_auth_username");
		$dados["wms_auth_password"] = $layer->getmetadata("wms_auth_password");
		$dados["wms_auth_type"] = $layer->getmetadata("wms_auth_type");
		$dados["wms_connectiontimeout"] = $layer->getmetadata("wms_connectiontimeout");
		$dados["wms_latlonboundingbox"] = $layer->getmetadata("wms_latlonboundingbox");
		$dados["wms_proxy_auth_type"] = $layer->getmetadata("wms_proxy_auth_type");

		$dados["wms_proxy_host"] = $layer->getmetadata("wms_proxy_host");
		$dados["wms_proxy_port"] = $layer->getmetadata("wms_proxy_port");
		$dados["wms_proxy_type"] = $layer->getmetadata("wms_proxy_type");
		$dados["wms_proxy_username"] = $layer->getmetadata("wms_proxy_username");
		$dados["wms_proxy_password"] = $layer->getmetadata("wms_proxy_password");
		$dados["wms_sld_body"] = $layer->getmetadata("wms_sld_body");
		$dados["wms_sld_url"] = $layer->getmetadata("wms_sld_url");
		$dados["wms_style"] = $layer->getmetadata("wms_style");
		$dados["wms_bgcolor"] = $layer->getmetadata("wms_bgcolor");
		$dados["wms_transparent"] = $layer->getmetadata("wms_transparent");
		$dados["wms_time"] = $layer->getmetadata("wms_time");
		$dados["tipooriginal"] = $layer->getmetadata("tipooriginal");
	}
	return $dados;
}
function alterarMetadados()
{
	global $tipooriginal,$legendaimg,$wms_srs,$wms_name,$wms_server_version,$wms_format,$wms_auth_username,$wms_auth_password,$wms_auth_type,$wms_connectiontimeout,$wms_latlonboundingbox,$wms_proxy_auth_type,$wms_proxy_host,$wms_proxy_port,$wms_proxy_type,$wms_proxy_username,$wms_proxy_password,$wms_sld_body,$wms_sld_url,$wms_style,$wms_bgcolor,$wms_transparent,$wms_time,$permitecomentario,$itembuscarapida,$iconetema,$ltempoformatodata,$ltempoiteminicio,$ltempoitemfim,$ltempoitemtitulo,$ltempoitemdescricao,$ltempoitemtip,$ltempoitemimagem,$ltempoitemicone,$ltempoitemlink,$description_template,$palletestep,$palletefile,$arquivodownload,$temporizador,$arquivokmz,$codigoMap,$codigoLayer,$locaplic,$aplicaextensao,$classestamanho,$classessimbolo,$classescor,$classesnome,$classesitem,$mensagem,$identifica,$transitioneffect,$extensao,$escondido,$download,$escala,$tema,$classe,$tip,$itenslink,$itens,$itensdesc,$editorsql,$cache;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$layer->setmetadata("itens",$itens);
	$layer->setmetadata("itensdesc",$itensdesc);
	$layer->setmetadata("itenslink",$itenslink);
	$layer->setmetadata("tip",$tip);
	$layer->setmetadata("tema",$tema);
	$layer->setmetadata("classe",$classe);
	$layer->setmetadata("escala",$escala);
	$layer->setmetadata("download",$download);
	$layer->setmetadata("escondido",$escondido);
	$layer->setmetadata("extensao",$extensao);
	$layer->setmetadata("identifica",$identifica);
	$layer->setmetadata("transitioneffect",$transitioneffect);
	$layer->setmetadata("mensagem",$mensagem);
	$layer->setmetadata("classesitem",$classesitem);
	$layer->setmetadata("classesnome",$classesnome);
	$layer->setmetadata("classescor",$classescor);
	$layer->setmetadata("classessimbolo",$classessimbolo);
	$layer->setmetadata("classestamanho",$classestamanho);
	$layer->setmetadata("aplicaextensao",$aplicaextensao);
	$layer->setmetadata("arquivodownload",$arquivodownload);
	$layer->setmetadata("temporizador",$temporizador);
	$layer->setmetadata("arquivokmz",$arquivokmz);
	$layer->setmetadata("palletefile",$palletefile);
	$layer->setmetadata("palletestep",$palletestep);
	$layer->setmetadata("description_template",$description_template);
	$layer->setmetadata("editorsql",$editorsql);
	$layer->setmetadata("cache",$cache);

	$layer->setmetadata("ltempoformatodata",$ltempoformatodata);
	$layer->setmetadata("ltempoiteminicio",$ltempoiteminicio);
	$layer->setmetadata("ltempoitemfim",$ltempoitemfim);
	$layer->setmetadata("ltempoitemtitulo",$ltempoitemtitulo);
	$layer->setmetadata("ltempoitemdescricao",$ltempoitemdescricao);
	$layer->setmetadata("ltempoitemtip",$ltempoitemtip);
	$layer->setmetadata("ltempoitemimagem",$ltempoitemimagem);
	$layer->setmetadata("ltempoitemicone",$ltempoitemicone);
	$layer->setmetadata("ltempoitemlink",$ltempoitemlink);
	$layer->setmetadata("iconetema",$iconetema);
	$layer->setmetadata("permitecomentario",$permitecomentario);
	$layer->setmetadata("itembuscarapida",$itembuscarapida);
	$layer->setmetadata("legendaimg",$legendaimg);
	if($layer->connectiontype == 7 || $layer->connectiontype== 9){
		$layer->setmetadata("wms_srs",$wms_srs);
		$layer->setmetadata("wms_name",$wms_name);
		$layer->setmetadata("wms_server_version",$wms_server_version);
		$layer->setmetadata("wms_format",$wms_format);
		if($wms_auth_username != ""){
			$layer->setmetadata("wms_auth_username",$wms_auth_username);
			$layer->setmetadata("wms_auth_password",$wms_auth_password);
			$layer->setmetadata("wms_auth_type",$wms_auth_type);
		}
		$layer->setmetadata("wms_connectiontimeout",$wms_connectiontimeout);
		if($wms_latlonboundingbox != "")
		{$layer->setmetadata("wms_latlonboundingbox",$wms_latlonboundingbox);}
		if($wms_proxy_host != ""){
			$layer->setmetadata("wms_proxy_auth_type",$wms_proxy_auth_type);
			$layer->setmetadata("wms_proxy_host",$wms_proxy_host);
			$layer->setmetadata("wms_proxy_port",$wms_proxy_port);
			$layer->setmetadata("wms_proxy_type",$wms_proxy_type);
			$layer->setmetadata("wms_proxy_username",$wms_proxy_username);
			$layer->setmetadata("wms_proxy_password",$wms_proxy_password);
		}
		if($wms_sld_body != "")
		{$layer->setmetadata("wms_sld_body",$wms_sld_body);}
		if($wms_sld_url != "")
		{$layer->setmetadata("wms_sld_url",$wms_sld_url);}
		$layer->setmetadata("wms_style",$wms_style);
		if($wms_bgcolor != "")
		$layer->setmetadata("wms_bgcolor",$wms_bgcolor);
		if($wms_transparent != "")
		$layer->setmetadata("wms_transparent",$wms_transparent);
		if($wms_time != "")
		$layer->setmetadata("wms_time",$wms_time);
		$layer->setmetadata("tipooriginal",$tipooriginal);
	}	
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function pegaGeral()
{
	global $codigoMap,$codigoLayer,$locaplic;
	$v = versao();
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$dados["type"] = $layer->type;
	$dados["filter"] = $layer->getfilterstring();
	if($dados["filter"]== ""){$dados["filter"] = "";}
	$dados["filteritem"] = $layer->filteritem;
	$dados["group"] = $layer->group;
	//$dados["labelangleitem"] = $layer->labelangleitem;
	$dados["labelitem"] = $layer->labelitem;
	$dados["labelmaxscale"] = $layer->labelmaxscaledenom;
	$dados["labelmaxscale"] = $layer->labelmaxscaledenom;
	$dados["labelminscale"] = $layer->labelminscaledenom;
	//$dados["labelsizeitem"] = $layer->labelsizeitem;
	$dados["maxscale"] = $layer->maxscaledenom;
	$dados["minscale"] = $layer->minscaledenom;
	$dados["offsite"] = $layer->offsite->red.",".$layer->offsite->green.",".$layer->offsite->blue;
	$v["principal"] == "4" ? $dados["opacity"] = $layer->transparency : $dados["opacity"] = $layer->opacity;
	$dados["symbolscale"] = $layer->symbolscaledenom;
	$dados["tolerance"] = $layer->tolerance;
	$dados["toleranceunits"] = $layer->toleranceunits;
	$dados["status"] = $layer->status;
	$dados["sizeunits"] = $layer->sizeunits;
	$dados["projection"] = $layer->getProjection();
	$dados["name"] = $layer->name;
	if($dados["projection"] == "null")
	{$dados["projection"] = "";}
	$dados["projection"] = str_replace("+i","i",$dados["projection"]);
	$dados["codigoMap"] = $codigoMap;
	$dados["codigoLayer"] = $codigoLayer;
	$dados["colunas"] = implode(" ,",pegaItens($layer));
	return $dados;	
}
function alterarGeral()
{
	global $dir_tmp,$testar,$codigoMap,$codigoLayer,$locaplic,$name,$projection,$sizeunits,$status,$toleranceunits,$tolerance,$symbolscale,$opacity,$offsite,$minscale,$maxscale,$labelsizeitem,$labelminscale,$labelmaxscale,$labelitem,$group,$filteritem,$type,$filter;
	error_reporting(0);
	$v = versao();
	$dados = array();
	
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	
	if($offsite == -1 || $offsite == "null")
	{$offsite = "-1,-1,-1";}
	$layer->set("name",$name);
	$layer->set("type",$type);
	$layer->setfilter($filter);
	$layer->set("filteritem",$filteritem);
	$layer->set("group",$group);
	//$layer->set("labelangleitem",$labelangleitem);
	$layer->set("labelitem",$labelitem);
	$layer->set("labelmaxscaledenom",$labelmaxscale);
	$layer->set("labelminscaledenom",$labelminscale);
	//$layer->set("labelsizeitem",$labelsizeitem);
	$layer->set("maxscaledenom",$maxscale);
	$layer->set("minscaledenom",$minscale);
	$cor = $layer->offsite;
	$c = explode(",",$offsite);
	if(count($c) < 3)
	$c = explode(" ",$offsite);
	$cor->setrgb($c[0],$c[1],$c[2]);
	$layer->offsite->red.",".$layer->offsite->green.",".$layer->offsite->blue;
	$v["principal"] == "4" ? $layer->set("transparency",$opacity) : $layer->set("opacity",$opacity);

	$layer->set("symbolscaledenom",$symbolscale);
	$layer->set("tolerance",$tolerance);
	$layer->set("toleranceunits",$toleranceunits);
	$layer->set("status",$status);
	$layer->set("sizeunits",$sizeunits);
	
	if($layer->getprojection() == MS_TRUE)
	$layer->setprojection($projection);
	if($layer->getprojection() == MS_FALSE && $projection != "")
	$layer->setprojection($projection);

	if($testar == "true")
	{
		$nome = $dir_tmp."/".$codigoMap.".map";
		$mapa->save($nome);
		removeCabecalho($nome,false);
		return $nome;
	}
	else
	{
		$mapa->save($mapfile);
		removeCabecalho($mapfile);
		return "ok";	
	}
}
function pegaClasseGeral()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$locaplic;
	
	error_reporting(E_ALL);
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$classe = $layer->getclass($indiceClasse);
	$dados["name"] = $classe->name;
	$dados["title"] = $classe->title;
	$temp = $classe->getExpressionString();
	$temp = str_replace("[","_C",$temp);
	$temp = str_replace("]","C_",$temp);
	$temp = str_replace("'","_A_",$temp);
	//substitui caracteres que dão problemas
	$dados["expression"] = $temp;
	$dados["keyimage"] = $classe->keyimage;
	$dados["maxscale"] = $classe->maxscaledenom;
	$dados["minscale"] = $classe->minscaledenom;
	$dados["status"] = $classe->status;
	//$dados["text"] = $classe->getTextString();
	$dados["codigoMap"] = $codigoMap;
	$dados["codigoLayer"] = $codigoLayer;
	$dados["indiceClasse"] = $indiceClasse;
	$dados["colunas"] = implode(" ,",pegaItens($layer));
	return $dados;
}
function alterarClasseGeral()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$locaplic,$status,$minscale,$maxscale,$name,$expression,$keyimage,$title;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$classe = $layer->getclass($indiceClasse);
	$classe->set("name",$name);
	$classe->set("title",$title);
	$temp = str_replace("_C","[",$expression);
	$temp = str_replace("C_","]",$temp);
	$temp = str_replace("_A_","'",$temp);	
	$classe->setexpression($temp);
	$classe->set("keyimage",$keyimage);
	$classe->set("maxscaledenom",$maxscale);
	$classe->set("minscaledenom",$minscale);
	$classe->set("status",$status);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function pegaClasseLabel()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$locaplic;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$classe = $layer->getclass($indiceClasse);
	$label = $classe->label;
	if ($label != "")
	{
		$dados["font"] = $label->font;
		$dados["type"] = $label->type;
		$dados["backgroundcolor"] = $label->backgroundcolor->red.",".$label->backgroundcolor->green.",".$label->backgroundcolor->blue;
		$dados["backgroundshadowcolor"] = $label->backgroundshadowcolor->red.",".$label->backgroundshadowcolor->green.",".$label->backgroundshadowcolor->blue;
		$dados["color"] = $label->color->red.",".$label->color->green.",".$label->color->blue;
		$dados["outlinecolor"] = $label->outlinecolor->red.",".$label->outlinecolor->green.",".$label->outlinecolor->blue;
		$dados["shadowcolor"] = $label->shadowcolor->red.",".$label->shadowcolor->green.",".$label->shadowcolor->blue;
		$dados["shadowsizex"] = $label->shadowsizex;
		$dados["shadowsizey"] = $label->shadowsizey;
		$dados["backgroundshadowsizex"] = $label->backgroundshadowsizex;
		$dados["backgroundshadowsizey"] = $label->backgroundshadowsizey;
		$dados["size"] = $label->size;
		$dados["minsize"] = $label->minsize;
		$dados["maxsize"] = $label->maxsize;
		$dados["position"] = $label->position;
		$dados["offsetx"] = $label->offsetx;
		$dados["offsety"] = $label->offsety;
		$dados["angle"] = $label->angle;
		$dados["autoangle"] = $label->autoangle;
		$dados["buffer"] = $label->buffer;
		$dados["antialias"] = $label->antialias;
		$dados["wrap"] = $label->wrap;
		$dados["minfeaturesize"] = $label->minfeaturesize;
		$dados["autominfeaturesize"] = $label->autominfeaturesize;
		$dados["mindistance"] = $label->mindistance;
		$dados["partials"] = $label->partials;
		$dados["force"] = $label->force;
		$dados["encoding"] = $label->encoding;		
	}
	$dados["codigoMap"] = $codigoMap;
	$dados["codigoLayer"] = $codigoLayer;
	$dados["indiceClasse"] = $indiceClasse;
	$dados["colunas"] = implode(" ,",pegaItens($layer));
	$arq = $locaplic."/symbols/fontes.txt";
	$h = fopen ($arq,"r");
	while ($i = fscanf ($h, "%s\t%s\t"))
	{
		list ($f,$g) = $i;
		$nome[] = $f;
	}
	$dados["fontes"] = $nome;
	return $dados;
}
function alterarClasseLabel()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$locaplic,$autoangle,$encoding,$force,$partials,$mindistance,$minfeaturesize,$wrap,$antialias,$buffer,$angle,$offsety,$offsetx,$position,$maxsize,$minsize,$size,$backgroundshadowsizey,$backgroundshadowsizex,$shadowsizey,$shadowsizex,$shadowcolor,$outlinecolor,$color,$backgroundshadowcolor,$backgroundcolor,$type,$font;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$classe = $layer->getclass($indiceClasse);
	$label = $classe->label;
	if ($label != "")
	{
		$label->set("font",$font);
		$label->set("type",$type);
		corE($label,$backgroundcolor,"backgroundcolor");
		corE($label,$backgroundshadowcolor,"backgroundshadowcolor");
		corE($label,$color,"color");
		corE($label,$outlinecolor,"outlinecolor");
		corE($label,$shadowcolor,"shadowcolor");
		$label->set("shadowsizex",$shadowsizex);
		$label->set("shadowsizey",$shadowsizey);
		$label->set("backgroundshadowsizex",$backgroundshadowsizex);
		$label->set("backgroundshadowsizey",$backgroundshadowsizey);
		$label->set("size",$size);
		$label->set("minsize",$minsize);
		$label->set("maxsize",$maxsize);
		$label->set("position",$position);
		$label->set("offsetx",$offsetx);
		$label->set("offsety",$offsety);
		$label->set("angle",$angle);
		$label->set("autoangle",$autoangle);
		$label->set("buffer",$buffer);
		$label->set("antialias",$antialias);
		$label->set("wrap",$wrap);
		$label->set("minfeaturesize",$minfeaturesize);
		//$label->set("autominfeaturesize",$autominfeaturesize);
		$label->set("mindistance",$mindistance);
		$label->set("partials",$partials);
		$label->set("force",$force);
		$label->set("encoding",$encoding);	
		$label->set("autoangle",$autoangle);	
	}
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}
function pegaEstilo()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$indiceEstilo,$locaplic;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$nclasses = $layer->numclasses;
	$classe = $layer->getclass($indiceClasse);
	$estilo = $classe->getstyle($indiceEstilo);
	$dados["symbolname"] = $estilo->symbolname;
	$dados["color"] = $estilo->color->red.",".$estilo->color->green.",".$estilo->color->blue;
	$dados["size"] = $estilo->size;
	$dados["minsize"] = $estilo->minsize;
	$dados["maxsize"] = $estilo->maxsize;
	$dados["offsetx"] = $estilo->offsetx;
	$dados["offsety"] = $estilo->offsety;
	$dados["antialias"] = $estilo->antialias;
	$dados["backgroundcolor"] = $estilo->backgroundcolor->red.",".$estilo->backgroundcolor->green.",".$estilo->backgroundcolor->blue;
	$dados["outlinecolor"] = $estilo->outlinecolor->red.",".$estilo->outlinecolor->green.",".$estilo->outlinecolor->blue;
	$dados["width"] = $estilo->width;
	$dados["minwidth"] = $estilo->minwidth;
	$dados["maxwidth"] = $estilo->maxwidth;
	$dados["angle"] = $estilo->angle;
	$dados["codigoMap"] = $codigoMap;
	$dados["codigoLayer"] = $codigoLayer;
	$dados["indiceClasse"] = $indiceClasse;
	$dados["indiceEstilo"] = $indiceEstilo;
	//$dados["opacity"] = $estilo->opacity;
	$dados["type"] = $layer->type;
	return $dados;
}
function alterarEstilo()
{
	global $codigoMap,$codigoLayer,$indiceClasse,$indiceEstilo,$locaplic,$angle,$maxwidth,$minwidth,$width,$outlinecolor,$backgroundcolor,$antialias,$offsety,$offsetx,$maxsize,$minsize,$size,$color,$symbolname;
	$dados = array();
	$mapfile = $locaplic."/temas/".$codigoMap.".map";
	$mapa = ms_newMapObj($mapfile);
	$layer = $mapa->getlayerbyname($codigoLayer);
	$nclasses = $layer->numclasses;
	$classe = $layer->getclass($indiceClasse);
	$estilo = $classe->getstyle($indiceEstilo);
	$estilo->set("symbolname",$symbolname);
	corE($estilo,$color,"color");
	$estilo->set("size",$size);
	$estilo->set("minsize",$minsize);
	$estilo->set("maxsize",$maxsize);
	$estilo->set("offsetx",$offsetx);
	$estilo->set("offsety",$offsety);
	$estilo->set("antialias",$antialias);
	corE($estilo,$backgroundcolor,"backgroundcolor");
	corE($estilo,$outlinecolor,"outlinecolor");
	$estilo->set("width",$width);
	$estilo->set("minwidth",$minwidth);
	$estilo->set("maxwidth",$maxwidth);
	$estilo->set("angle",$angle);
	//$estilo->set("opacity",$opacity);
	$mapa->save($mapfile);
	removeCabecalho($mapfile);
	return "ok";
}

function removeCabecalho($arq,$symbolset=true)
{
	$handle = fopen($arq, "r");
	if ($handle)
	{
    	$cabeca = array();
    	if($symbolset)
    	{
    		$cabeca[] = "MAP\n";
    		//$final[] = "SYMBOLSET ../symbols/simbolos.sym\n";
    		//$final[] = "FONTSET   ".'"'."../symbols/fontes.txt".'"'."\n";
    	}
    	$grava = false;
    	while (!feof($handle)) 
    	{
        	$linha = fgets($handle);
        	if($symbolset)
        	{
        		if(strpos(strtoupper($linha),"SYMBOLSET") !== false)
        		{$cabeca[] = $linha;}
        		if(strpos(strtoupper($linha),"FONTSET") !== false)
        		{$cabeca[] = $linha;}
        	}
        	if(strtoupper(trim($linha)) == "LAYER")
        	{$grava = true;}
        	if($grava)
        	{$final[] = rtrim($linha, "\r\n") . PHP_EOL;}
    	}
    	fclose($handle);
	}
	$final = array_merge($cabeca,$final);
	$handle = fopen($arq, "w+");
	foreach ($final as $f)
	{
		//
		//remove resultados em branco
		//e grava a linha
		//
		$teste = strtoupper($f);
		$teste = trim($teste);
		$teste = str_replace(" ","",$teste);
		$teste = str_replace("'","",$teste);
		$teste = str_replace('"',"",$teste);
		$teste = preg_replace('/[\n\r\t ]*/', '', $teste);
      	$testar = array("KEYIMAGE","TILEINDEX","TILEITEM","SYMBOL","LABELITEM","FILTERITEM","GROUP","ENCODING","TIP","CLASSE","ITENSDESC","CLASSESNOME","ITENSLINK","ESCALA","CLASSESSIMBOLO","MENSAGEM","EXTENSAO","CLASSESITEM","ESCONDIDO","CLASSESCOR","DOWNLOAD","CLASSESTAMANHO","ITENS","TEMA","APLICAEXTENSAO","IDENTIFICA","TRANSITIONEFFECT");
		$passou = true;
		foreach ($testar as $t)
		{if($teste == $t){$passou = false;}}
		if($passou)
		fwrite($handle,$f);
	}
	fclose($handle);
	chmod($arq, 0666);
}
?>