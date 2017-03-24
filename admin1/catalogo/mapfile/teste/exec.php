<?php
/****************************************************************/
//include (dirname ( __FILE__ ) . "/../../../../ms_configura.php");
//
//checa login
//valida _GET e _POST, juntando em _GET
//pega algumas variaveis de uso mais comum
//session_start
//
include ("../../../php/checaLogin.php");
\admin\php\login\checaLogin();
//funcoes de administracao
include ($_SESSION["locaplic"]."/admin1/php/funcoesAdmin.php");
//
//carrega outras funcoes e extensoes do PHP
//
include ($_SESSION["locaplic"]."/classesphp/carrega_ext.php");
//
//carrega as funcoes locais
//depende de funcoesAdmin.php
//
include ("funcoes.php");
//
//conexao com o banco de administracao
//cria as variaveis $dbh e $dbhw alem de conexaoadmin
//
include ($_SESSION["locaplic"]."/admin1/php/conexao.php");
/***************************************************************/
if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/html/editormapfile" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}

$codigo = str_replace(" ","",$_POST["codigo"]);
if(empty($codigo)){
	header ( "HTTP/1.1 500 erro parametro invalido" );
	exit ();
}
$tema = $_SESSION["locaplic"]."/temas/".$codigo.".map";
if(!file_exists($tema)){
	header ( "HTTP/1.1 500 erro mapfile nao encontrado" );
	exit ();
}

$funcao = strtoupper ( $funcao );
switch ($funcao) {
	case "TESTAIMG" :
		$versao = \admin\php\funcoesAdmin\versao();
		$versao = $versao["principal"];
		ms_ResetErrorList();
		$tempo = microtime(true);
		$retorno = testaMapaImg($tema);
		\admin\php\funcoesAdmin\retornaJSON ( $retorno );
		break;
	case "TESTATABELA" :
		$versao = \admin\php\funcoesAdmin\versao();
		$versao = $versao["principal"];
		ms_ResetErrorList();
		$tempo = microtime(true);
		$retorno = testaTabela($tema);
		\admin\php\funcoesAdmin\retornaJSON ( $retorno );
		break;
}
function mapaBase($locaplic,$versao,$base){
	if($base == "" || !isset($base)){
		$base = "";
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
			$base = $_SESSION["locaplic"]."/aplicmap/geral1windowsv".$versao.".map";
		}
		else{
			if($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
				$base = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
			}
			if($base == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
				$base = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
			}
			if($base == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
				$base = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
			}
			if($base == ""){
				$base = $_SESSION["locaplic"]."/aplicmap/geral1v".$versao.".map";
			}
		}
	}
	return $base;
}
function testaTabela($tema){
	global $versao,$base,$tempo;
	$dir_tmp = $_SESSION["dir_tmp"];
	$postgis_mapa = $_SESSION["postgis_mapa"];
	$locaplic = $_SESSION["locaplic"];
	$base = mapaBase($locaplic,$versao,$base);

	$mapa = ms_newMapObj($base);
	$nmapa = ms_newMapObj($tema);
	error_reporting (E_ALL);
	ms_ResetErrorList();

	$numlayers = $nmapa->numlayers;
	$dados = "";
	for ($i=0;$i < $numlayers;$i++){
		$layern = $nmapa->getlayer($i);
		$layern->set("status",MS_DEFAULT);
		error_reporting (E_ALL);
		if($layern->classitem != "" && $layern->connectiontype == 7 && $layern->numclasses > 0 && $layern->getmetadata("wms_sld_body") == ""){
			$tipotemp = $layern->type;
			$tiporep = $layern->getmetadata("tipooriginal");
			$layern->set("type",MS_LAYER_POLYGON);
			if ($tiporep == "linear"){
				$layern->set("type",MS_LAYER_LINE);
			}
			if ($tiporep == "pontual"){
				$layern->set("type",MS_LAYER_POINT);
			}
			$sld = $layern->generateSLD();
			if($sld != ""){
				$layern->setmetadata("wms_sld_body",str_replace('"',"'",$sld));
			}
			$layern->set("type",$tipotemp);
		}
		$layerAdicionado = ms_newLayerObj($mapa, $layern);
		$pegarext = $layern->name;
	}

	zoomTema($pegarext,$mapa);
	include_once($_SESSION["locaplic"]."/classesphp/classe_atributos.php");

	$t = new Atributos($mapa,$layern->name);

	$r = $t->itensTexto();
	$colunas = explode(";",$r["itens"]);

	$ncolunas = count($colunas);
	$registros = $r["valores"];
	$nregistros = count($registros);
	$error = "";
	$error = ms_GetErrorObj();
	$tab = "";
	while($error && $error->code != MS_NOERR){
		$tab .= "<br>Error in %s: %s<br>";
		$tab .= $error->routine;
		$tab .= $error->message;
		$error = $error->next();
	}
	$tab .= "Registros em ISO-8859-1 s&atilde;o convertidos para UTF8<br>";
	$tab .= "Registros: ".$nregistros;"<br>";
	$tab .= "<br><b>Tempo leitura (s): ";
	$tab .= microtime(true) - $tempo;
	$tab .= "</b>";
	$tab .= "<table>";
	$tab .= "<tr>";
	foreach($colunas as $co){
		$tab .= "<td><b>".$co."</b></td>";
	}
	$tab .= "</tr>";
	foreach($registros as $reg){
		$tab .= "<tr>";
		$cc = explode(";",$reg);
		foreach($cc as $c){
			if (mb_detect_encoding ( $c, 'UTF-8, ISO-8859-1' ) == "ISO-8859-1") {
				$c = utf8_encode ( $c );
			}
			$tab .= "<td>".$c."</td>";
		}
		$tab .= "</tr>";
	}
	$tab .= "</table>";
	$tab .= "<br><b>Tempo total (montagem da tabela) (s): ";
	$tab .= microtime(true) - $tempo;
	$tab .= "</b>";
	return $tab;
}
function testaMapaImg($tema){
	global $versao,$base,$tempo;
	$dir_tmp = $_SESSION["dir_tmp"];
	$postgis_mapa = $_SESSION["postgis_mapa"];
	$locaplic = $_SESSION["locaplic"];
	$base = mapaBase($_SESSION["locaplic"],$versao,$base);
	$mapa = ms_newMapObj($base);
	error_reporting (E_ALL);
	ms_ResetErrorList();
	try {
		ms_newMapObj ( $tema );
	} catch ( Exception $e ) {
		return array("imgMapa"=>"","imgLegenda"=>"","tempo"=> (microtime(true) - $tempo),"erro"=>"Objeto map nao pode ser criado. Erro fatal.");
	}
	if(@ms_newMapObj($tema)){
		$nmapa = ms_newMapObj($tema);
	}
	else{
		$erro = "";
		$error = ms_GetErrorObj();
		while($error && $error->code != MS_NOERR){
			$erro .= "<br>Error in %s: %s<br>\n";
			$erro .= "<br>".$error->routine;
			$erro .= "<br>".$error->message;
			$error = $error->next();
		}
		return array("imgMapa"=>"","imgLegenda"=>"","tempo"=> (microtime(true) - $tempo),"erro"=>$erro);
	}
	\admin\php\funcoesAdmin\substituiConObj($mapa,$postgis_mapa);
	\admin\php\funcoesAdmin\substituiConObj($nmapa,$postgis_mapa);

	$numlayers = $nmapa->numlayers;
	$dados = "";
	$simbolos = array();
	for ($i=0;$i < $numlayers;$i++){
		$layern = $nmapa->getlayer($i);
		$layern->set("status",MS_DEFAULT);
		autoClasses($layern,$nmapa);
		error_reporting (E_ALL);
		if($layern->classitem != "" && $layern->connectiontype == 7 && $layern->numclasses > 0 && $layern->getmetadata("wms_sld_body") == ""){
			$tipotemp = $layern->type;
			$tiporep = $layern->getmetadata("tipooriginal");
			$layern->set("type",MS_LAYER_POLYGON);
			if ($tiporep == "linear"){
				$layern->set("type",MS_LAYER_LINE);
			}
			if ($tiporep == "pontual"){
				$layern->set("type",MS_LAYER_POINT);
			}
			$sld = $layern->generateSLD();
			if($sld != ""){
				$layern->setmetadata("wms_sld_body",str_replace('"',"'",$sld));
			}
			$layern->set("type",$tipotemp);
		}
		//pega simbolos locais e aplica no novo mapa
		cloneInlineSymbol($layern,$nmapa,$mapa);

		$layerAdicionado = ms_newLayerObj($mapa, $layern);

		corrigeLayerGrid($layern,$layerAdicionado);
		$pegarext = $layern->name;
	}
	zoomTema($pegarext,$mapa);
	$mapa->setsize(500,500);
	$sca = $mapa->scalebar;
	$sca->set("status",MS_OFF);
	$objImagem = @$mapa->draw();
	//corrige o titulo da legenda
	$numlayers = $mapa->numlayers;
	for ($j=0;$j < $numlayers;$j++){
		$l = $mapa->getlayer($j);
		if($l->type != 3 && $l->type != 4){
			$nclass = $l->numclasses;
			for($i=0;$i<$nclass;$i++){
				$classe = $l->getclass($i);
				if($classe->title === ""){
					$classe->title = $classe->name;
				}
			}
		}
	}
	$objImagemLegenda = @$mapa->drawLegend();
	if (!$objImagem){
		$error = "";
		$erro = "";
		$error = ms_GetErrorObj();
		while($error && $error->code != MS_NOERR){
			$erro .=  "<br>Error in %s: %s<br>";
			$erro .= "<br>" . $error->routine;
			$erro .= "<br>" . $error->message;
			$error = $error->next();
		}
		return array("imgMapa"=>"","imgLegenda"=>"","tempo"=> (microtime(true) - $tempo),"erro"=>$erro);
	}
	if($objImagem->imagepath == ""){
		return array("imgMapa"=>"","imgLegenda"=>"","tempo"=> (microtime(true) - $tempo),"erro"=>"Erro IMAGEPATH vazio");
	}
	$nomec = ($objImagem->imagepath).\admin\php\funcoesAdmin\nomeRandomico()."teste.png";
	$objImagem->saveImage($nomec);

	$nomel = ($objImagemLegenda->imagepath).\admin\php\funcoesAdmin\nomeRandomico()."testel.png";
	$objImagemLegenda->saveImage($nomel);

	$erro = "";
	$error = "";
	$error = ms_GetErrorObj();
	while($error && $error->code != MS_NOERR){
		$erro .= "<br>Error in %s: %s<br>";
		$erro .= "<br>" . $error->routine;
		$erro .= "<br>" . $error->message;
		$error = $error->next();
	}
	return array("imgMapa"=>($objImagem->imageurl).basename($nomec),"imgLegenda"=>($objImagemLegenda->imageurl).basename($nomel),"tempo"=> (microtime(true) - $tempo),"erro"=>$erro);
}
function zoomTema($nomelayer,&$mapa){
	$layer = $mapa->getlayerbyname($nomelayer);
	if($layer->data == "" && $layer->connection == "")
	{return;}
	$prjMapa = $mapa->getProjection();
	$prjTema = $layer->getProjection();
	$extatual = $mapa->extent;
	$ret = $layer->getmetadata("extensao");
	if($layer->type > 2 && $ret == "")
	{return;}
	$ct = $layer->connectiontype;
	if(($ret == "") && ($ct != 1))
	{return;}
	if ($ret == ""){
		$ret = $layer->getextent();
		//reprojeta o retangulo
		if (($prjTema != "") && ($prjMapa != $prjTema)){
			$projInObj = ms_newprojectionobj($prjTema);
			$projOutObj = ms_newprojectionobj($prjMapa);
			$ret->project($projInObj, $projOutObj);
		}
		$extatual->setextent($ret->minx,$ret->miny,$ret->maxx,$ret->maxy);
	}
	else{
		$ret = explode(" ",$ret);
		$extatual->setextent($ret[0],$ret[1],$ret[2],$ret[3]);
	}
}

?>
