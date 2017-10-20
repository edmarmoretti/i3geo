<?php
define ( "ONDEI3GEO", "../../.." );

/****************************************************************/
//
//checa login
//valida _GET e _POST, juntando em _GET
//pega algumas variaveis de uso mais comum
//session_start
//
include ("../../php/checaLogin.php");
\admin\php\login\checaLogin();
//funcoes de administracao
include ($_SESSION["locaplic"]."/admin/php/funcoesAdmin.php");
//
//carrega outras funcoes e extensoes do PHP
//
include ($_SESSION["locaplic"]."/classesphp/carrega_ext.php");
//
//conexao com o banco de administracao
//cria as variaveis $dbh e $dbhw alem de conexaoadmin
//
include ($_SESSION["locaplic"]."/admin/php/conexao.php");
/***************************************************************/
if (\admin\php\funcoesAdmin\verificaOperacaoSessao ( "admin/html/arvore" ) === false) {
	header ( "HTTP/1.1 403 Vc nao pode realizar essa operacao" );
	exit ();
}
include "../../head.php";
?>
<div class="container-fluid migalha" >
	<div class="row">
		<div class="btn-group btn-breadcrumb">
			<a class="btn btn-default" href="../../../init/index.php"><span>i3Geo</span></a>
			<a class="btn btn-default" href="../../index.php"><span>Admin</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Ferramentas</span></a>
			<a class="btn btn-default" style="pointer-events: none"><span>Miniaturas</span></a>
		</div>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-sm-12 template hidden">
			<div class="row">
				<div class="col-md-12">
					<div class="well">
						<h3>Gera imagens miniaturas de cada tema para abastecer a pasta <samp>i3geo/temas/miniaturas</samp></h3>
						<h4>O usu&aacute;rio e a senha devem estar cadastrados em <samp>i3geo/ms_configura.php</samp></h4>
					</div>
					<div class="well">
						<form class="form" role="form" method="post" action="index.php">
							<div class="form-group">
								<div class="radio">
									<label> <input name="tipo" value="todos" type="radio" required>todas as miniaturas
									</label>
								</div>
								<div class="radio">
									<label> <input name="tipo" value="mini" type="radio" required>apenas as pequenas
									</label>
								</div>
								<div class="radio">
									<label> <input name="tipo" value="grande" type="radio" required>apenas as grandes
									</label>
								</div>
							</div>
							<button type="submit" class="btn btn-primary">{{{enviar}}}</button>
						</form>
					</div>
					<div class="alert alert-info">
					As miniaturas s&atilde;o geradas na pasta tempor&aacute;ria do servidor (<samp>ms_tmp</samp>). Depois de criadas, &eacute; necess&aacute;rio copi&aacute;-las para a pasta <samp>i3geo/temas/miniaturas</samp>. Apenas s&atilde;o processados os temas cujas miniaturas ainda n&atilde;o existirem.
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
<script>
	$(document).ready(function(){
		//vem de admin/index.js
		iniciaMenuPrincipal();
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
		//traducao
		var t = $(".template");
		t.html(
			Mustache.to_html(
				t.html(),
				i3GEO.idioma.objetoIdioma(i3GEOadmin.core.dicionario)
			)
		);
		t.removeClass('hidden');
		$.material.init();
	});
</script>
<?php
//
//no caso do programa ser utilizado via URL
//
if(empty($_POST["tipo"])){
	echo "</body></html>";
	exit;
}
?>
<div class="container">
	<div class="row center-block">
		<div class="col-sm-12">
			<div class="row">
				<div class="col-md-12">
					<div class="well">
					<?php
					//error_reporting (E_ALL);
					$versao = \admin\php\funcoesAdmin\versao();
					$versao = $versao["principal"];

					$tipo = $_POST["tipo"];
					if($tipo == "mini" || $tipo == "todos" || $tipo == "grande"){
						ms_ResetErrorList();
						if (ob_get_level() == 0){
							ob_start();
						}
						//error_reporting (E_ALL);
						$arqs = listaArquivos("../../../temas",true,array("map"));
						$arqs = $arqs["arquivos"];
						sort($arqs);
						foreach ($arqs as $arq){
							$arq = str_replace(" ","xxxx",$arq);
							$temp = explode(".",$arq);
							if(file_exists($_SESSION["locaplic"].'/temas/'.$arq) && $temp[(count($temp) - 1)] == "map" ){
								echo "<div 'class=well'><h4>$arq</h4>";
								if($tipo == "mini" || $tipo == "todos"){
									if(!file_exists($_SESSION["locaplic"].'/temas/miniaturas/'.$arq.'.mini.png')){
										verificaMiniatura($arq,"mini");
									}
								}
								if($tipo == "grande"  || $tipo == "todos"){
									if(!file_exists($_SESSION["locaplic"].'/temas/miniaturas/'.$arq.'.grande.png')){
										verificaMiniatura($arq,"grande");
									}
								}
								echo "</div>";
							}
							ob_flush(); flush(); sleep(1);
						}
						ob_end_flush();
					}
					?>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
</body>
</html>
<?php
//
//se tipo for igual a "admin", as imagens s&atilde;o gravadas em i3geo/temas/miniaturas
//
function verificaMiniatura($map,$tipo,$admin=false)
{
	global $versao,$base;
	$postgis_mapa = $_SESSION["postgis_mapa"];
	$locaplic = $_SESSION["locaplic"];
	if($versao == ""){
		$versao = \admin\php\funcoesAdmin\versao();
		$versao = $versao["principal"];
	}
	ms_ResetErrorList();
	$tema = "";
	$map = str_replace("\\","/",$map);
	$map = basename($map);
	$extensao = ".map";
	if (file_exists($_SESSION["locaplic"].'/temas/'.$map)){
		$tema = $_SESSION["locaplic"].'/temas/'.$map;
	}
	else{
		if (file_exists($_SESSION["locaplic"].'/temas/'.$map.'.gvp')){
			$extensao = ".gvp";
		}
		$tema = $_SESSION["locaplic"].'/temas/'.$map.$extensao;
	}
	if ($tema != ""){
		if(isset($base) && $base != ""){
			if(file_exists($base))
			{$f = $base;}
			else
			{$f = $_SESSION["locaplic"]."/aplicmap/".$base.".map";}
			if(!file_exists($base)){
				echo "<div class='alert alert-danger'>ARQUIVO $base N&Acirc;O FOI ENCONTRADO. CORRIJA ISSO EM ms_configura.php";
				exit;
			}
		}
		else{
			$f = "";
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
				$f = $_SESSION["locaplic"]."/aplicmap/geral1windowsv".$versao.".map";
			}
			else{
				if($f == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
					$f = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
				}
				if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
					$f = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
				}
				if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
					$f = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
				}
				if($f == ""){
					$f = $_SESSION["locaplic"]."/aplicmap/geral1v".$versao.".map";
				}
			}
		}
		$mapa = ms_newMapObj($f);
		if($extensao == ".map"){
			if(@ms_newMapObj($tema)){
				$nmapa = ms_newMapObj($tema);
			}
			else{
				echo "<div class='alert alert-danger'>erro no arquivo $tema </div>";
				return;
			}
			$dados = "";
			$numlayers = $nmapa->numlayers;
			for ($i=0;$i < $numlayers;$i++){
				$layern = $nmapa->getlayer($i);
				$layern->set("status",MS_DEFAULT);
				cloneInlineSymbol($layern,$nmapa,$mapa);
				ms_newLayerObj($mapa, $layern);
				autoClasses($layern,$mapa,$_SESSION["locaplic"]);
				if ($layern->data == ""){
					$dados = $layern->connection;
				}
				else{
					$dados = $layern->data;
				}
				$pegarext = $layern->name;
			}
			if (isset($postgis_mapa)){
				if ($postgis_mapa != ""){
					$numlayers = $mapa->numlayers;
					for ($i=0;$i < $numlayers;$i++){
						$layern = $mapa->getlayer($i);
						if (!empty($postgis_mapa)){
							if ($layern->connectiontype == MS_POSTGIS){
								$lcon = $layern->connection;
								if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
									if(($lcon == " ") || ($lcon == "")) //para efeitos de compatibilidade
									{$layern->set("connection",$postgis_mapa);}
									else{
										$layern->set("connection",$postgis_mapa[$lcon]);
									}
								}
							}
						}
					}
				}
			}
			//zoomTemaMiniatura($pegarext,$mapa);
		}
		if ($tipo == "mini"  || $tipo == "todos"){
			$mapa->setsize(50,50);
			$sca = $mapa->scalebar;
			$sca->set("status",MS_OFF);
			$objImagemM = @$mapa->draw();
			//if ($objImagemM == "" || $objImagemM == MS_FAILURE)
			//{echo "Problemas ao gerar o mapa<br>";return;}
			$weboM = $mapa->web;
			$urlM = $weboM->imageurl."/".$map;
		}
		if ($tipo == "grande"  || $tipo == "todos"){
			$mapa->setsize(300,300);
			$sca = $mapa->scalebar;
			$sca->set("status",MS_OFF);
			$objImagemG = @$mapa->draw();
			$weboG = $mapa->web;
			$urlG = $weboG->imageurl."/".$map;
		}
		if($tipo=="mini" || $tipo == "todos"){
			if (!$objImagemM){
				echo "Problemas ao gerar o mapa<br>";
				$error = "";
				$error = ms_GetErrorObj();
				while($error && $error->code != MS_NOERR){
					echo "<div class='alert alert-danger'>Error in %s: %s</div>", $error->routine, $error->message;
					$error = $error->next();
				}
				return;
			}
			if($objImagemM->imagepath == ""){
				echo "<div class='alert alert-danger'>Erro IMAGEPATH vazio</div>";return;
			}
			$nomecM = ($objImagemM->imagepath).$map.".mini.png";
			$objImagemM->saveImage($nomecM);
		}
		if($tipo=="grande" || $tipo == "todos"){
			if (!$objImagemG){
				echo "<div class='alert alert-danger'>Problemas ao gerar o mapa</div>";
				$error = "";
				$error = ms_GetErrorObj();
				while($error && $error->code != MS_NOERR){
					echo "<div class='alert alert-danger'>Error in %s: %s</div>", $error->routine, $error->message;
					$error = $error->next();
				}
				return;
			}
			if($objImagemG->imagepath == ""){
				echo "<div class='alert alert-danger'>Erro IMAGEPATH vazio</div>";return;
			}
			$nomecG = ($objImagemG->imagepath).$map.".grande.png";
			$objImagemG->saveImage($nomecG);
		}
		if($admin === false){
			if($tipo=="mini" || $tipo == "todos")
			{echo "<img class='img-thumbnail' src='".$urlM.".mini.png' />";}
			if($tipo=="grande" || $tipo == "todos")
			{echo "<img class='img-thumbnail' src='".$urlG.".grande.png' />";}
		}
		//
		//copia a imagem
		//
		if($admin === true){
			$dir = $_SESSION["locaplic"]."/temas/miniaturas";
			$mini = $dir."/".$map.".map.mini.png";
			$grande = $dir."/".$map.".map.grande.png";
			if(file_exists($mini))
			{unlink($mini);}
			if(file_exists($grande))
			{unlink($grande);}
			copy(($objImagemG->imagepath).$map.".grande.png",$grande);
			copy(($objImagemM->imagepath).$map.".mini.png",$mini);
		}
	}
}
function zoomTemaMiniatura($nomelayer,&$mapa)
{
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
function listaArquivos($diretorio,$seguro=false,$permitido="")
{
	$docroot = $_SERVER["DOCUMENT_ROOT"];
	if (!is_dir($diretorio)){
		$diretorio = "../".$diretorio;
	}
	if (is_dir($diretorio)){
		$dirs = array();
		$arqs = array();
		$nomes = array();
		$urls = array();
		$exts = array();
		$d = dir($diretorio);
		while (($nd = $d->read()) != FALSE)
		{
			if ($nd != "." && $nd != ".."){
				$ext = explode(".",$nd);
				if (count($ext)>1){
					if($seguro == true){
						$buscar = $ext[1];
						//$permitido = array("png","PNG","jpg","JPG","tif","tiff","TIF","TIFF","shp","SHP","img");
						if(in_array($buscar,$permitido)){
							$arqs[] = $nd;
							$nomes[] = basename($nd);
							$exts[] = $ext[1];
							$url = "";

							if(strpos($diretorio,$docroot) === true || strpos($diretorio,$docroot) === 0){
								$url = str_replace($docroot,"",$diretorio."/".$nd);
							}
							$urls[] = $url;
						}
					}
					else{
						$arqs[] = $nd;
						$nomes[] = basename($nd);
						$urls = "";
						$exts[] = $ext[1];
					}
				}
				if (count($ext)==1){
					$dirs[] = $nd;
				}
			}
		}
		sort($dirs);
		return array("diretorios"=>$dirs,"arquivos"=>$arqs,"nomes"=>$nomes,"urls"=>$urls,"extensoes"=>$exts);
	}
	else
	{return "erro";}
}
function cloneInlineSymbol($layern, $nmapa, $mapa) {
	$numclasses = $layern->numclasses;
	for($ci = 0; $ci < $numclasses; $ci ++) {
		$classe = $layern->getclass ( $ci );
		$numestilos = $classe->numstyles;
		for($ei = 0; $ei < $numestilos; $ei ++) {
			$estilo = $classe->getstyle ( $ei );
			if ($estilo->symbolname != "") {
				$nomesimbolo = $estilo->symbolname;
				$simbolo = $nmapa->getSymbolObjectById ( $nmapa->getSymbolByName ( $nomesimbolo ) );
				if ($simbolo->inmapfile == MS_TRUE || file_exists ( $nomesimbolo )) {
					$simbolon = new symbolObj ( $mapa, $nomesimbolo );
					$simbolon->set ( "inmapfile", MS_TRUE );

					$simbolon->setImagePath ( $simbolo->imagepath );
					$simbolon->setPoints ( $simbolo->getPointsArray () );
					// $simbolon->setPattern($simbolo->getPatternArray());
					$simbolon->set ( "type", $simbolo->type );
					// $simbolon->set("antialias",$simbolo->antialias);
					$simbolon->set ( "character", $simbolo->character );
					$simbolon->set ( "filled", $simbolo->filled );

					// $simbolon->set("font",$simbolo->font);
					// $simbolon->set("position",$simbolo->position);
					$simbolon->set ( "sizex", $simbolo->sizex );
					$simbolon->set ( "sizey", $simbolo->sizey );
					$simbolon->set ( "transparent", $simbolo->transparent );
					$simbolon->set ( "transparentcolor", $simbolo->transparentcolor );
					// $simbolon->set("anchorpoint",$simbolo->anchorpoint);
				}
			}
		}
	}
}
function autoClasses(&$nlayer, $mapa, $locaplic = null) {
	$postgis_mapa = $_SESSION ["postgis_mapa"];
	;
	$substituicon = "nao";
	if ($nlayer->connectiontype == MS_POSTGIS) {
		if ($nlayer->connection == " ") {
			$nlayer->set ( "connection", $postgis_mapa );
			$substituicon = "sim";
		}
	}
	//
	// gera classes automaticamente (temas vetoriais)
	if ($nlayer->getmetadata ( "classesitem" ) != "") {
		$itemnome = $nlayer->getmetadata ( "classesnome" );
		$itemid = $nlayer->getmetadata ( "classesitem" );
		$itemcor = $nlayer->getmetadata ( "classescor" );
		$itemsimbolo = $nlayer->getmetadata ( "classesimbolo" );
		$itemtamanho = $nlayer->getmetadata ( "classestamanho" );
		$classeoriginal = $nlayer->getclass ( 0 );
		//
		// pega a extensao geografica que devera ser utilizada
		//
		$prjMapa = $mapa->getProjection ();
		$prjTema = $nlayer->getProjection ();
		$ret = $nlayer->getmetadata ( "extensao" );
		if ($ret == "") {
			$ret = $nlayer->getextent ();
			// reprojeta o retangulo
			if (($prjTema != "") && ($prjMapa != $prjTema)) {
				$projInObj = ms_newprojectionobj ( $prjTema );
				$projOutObj = ms_newprojectionobj ( $prjMapa );
				$ret->project ( $projInObj, $projOutObj );
			}
		} else {
			$temp = explode ( " ", $ret );
			$ret = ms_newRectObj ();
			$ret->setextent ( $temp [0], $temp [1], $temp [2], $temp [3] );
		}
		//
		$sopen = $nlayer->open ();
		if ($sopen == MS_FAILURE) {
			return "erro";
		}

		$status = $nlayer->whichShapes ( $ret );
		$parametrosClasses = array ();
		if ($status == 0) {
			while ( $shape = $nlayer->nextShape () ) {
				$id = trim ( $shape->values [$itemid] );
				if (! $parametrosClasses [$id]) {
					$nome = "";
					if ($itemnome != "")
						$nome = trim ( $shape->values [$itemnome] );
						$cor = "";
						if ($itemcor != "")
							$cor = explode ( ",", trim ( $shape->values [$itemcor] ) );
							if (count ( $cor ) != 3)
								$cor = explode ( " ", trim ( $shape->values [$itemcor] ) );
								$tamanho = "";
								if ($itemtamanho != "")
									$tamanho = trim ( $shape->values [$itemtamanho] );
									$simbolo = "";
									if ($itemsimbolo != "")
										$simbolo = trim ( $shape->values [$itemsimbolo] );
										$parametrosClasses [$id] = array (
												"nome" => $nome,
												"cor" => $cor,
												"tamanho" => $tamanho,
												"simbolo" => $simbolo
										);
				}
			}
			$fechou = $nlayer->close ();
			// echo "<pre>";var_dump($parametrosClasses);
			if (count ( $parametrosClasses ) > 0) {
				$ids = array_keys ( $parametrosClasses );
				for($i = 0; $i < count ( $parametrosClasses ); ++ $i) {
					$p = $parametrosClasses [$ids [$i]];
					// echo "<pre>";var_dump($p);
					$nclasse = ms_newClassObj ( $nlayer, $classeoriginal );
					if ($p ["nome"] != "")
						$nclasse->set ( "name", $p ["nome"] );
						$estilo = $nclasse->getstyle ( 0 );
						if ($p ["cor"] != "") {
							$cor = $p ["cor"];
							$ncor = $estilo->color;
							if ($ncor == "")
								$ncor = $estilo->outlinecolor;
								$ncor->setrgb ( $cor [0], $cor [1], $cor [2] );
						}
						if ($p ["tamanho"] != "")
							$estilo->set ( "size", $p ["tamanho"] );
							if ($p ["simbolo"] != "")
								$estilo->set ( "symbolname", $p ["simbolo"] );
								$strE = "('[" . $itemid . "]'eq'" . $ids [$i] . "')";
								$nclasse->setexpression ( $strE );
				}
				$classeoriginal->set ( "status", MS_DELETE );
			}
		}
		if ($substituicon == "sim") {
			$nlayer->set ( "connection", " " );
		}
	}
	$pf = $nlayer->getmetadata ( "palletefile" );
	if ($pf != "") {
		if (! file_exists ( $pf )) {
			return;
		}
		$ps = $nlayer->getmetadata ( "palletesteps" );
		if ($ps == "")
			$ps = 8;
			//
			// pega os valores do arquivo
			//
			$rules = array ();
			$abre = fopen ( $pf, "r" );
			$paletteRules = array ();
			while ( ! feof ( $abre ) ) {
				$line = trim ( fgets ( $abre ) );
				$pos = strpos ( $line, "#" );
				if ($pos === false || $pos > 0) {
					$paletteEntry = explode ( " ", $line );
					$rules [] = array (
							"v0" => $paletteEntry [0],
							"v1" => $paletteEntry [1],
							"r0" => $paletteEntry [2],
							"g0" => $paletteEntry [3],
							"b0" => $paletteEntry [4],
							"r1" => $paletteEntry [5],
							"g1" => $paletteEntry [6],
							"b1" => $paletteEntry [7]
					);
				}
			}
			fclose ( $abre );
			foreach ( $rules as $rule ) {
				$delta = ceil ( ($rule ["v1"] - $rule ["v0"]) / $ps );
				$legenda = true;
				for($value = $rule ["v0"]; $value < $rule ["v1"]; $value += $delta) {
					$class = ms_newClassObj ( $nlayer );
					$style = ms_newStyleObj ( $class );
					if ($legenda) {
						$class->set ( name, round ( $value, 0 ) );
						$legenda = true;
					}
					$expression = "([pixel] > " . round ( $value, 0 ) . " AND [pixel] <= " . round ( $value + $delta, 0 ) . ")";
					$class->setExpression ( $expression );
					$rgb = getRGBpallete ( $rule, $value );
					$style->color->setRGB ( $rgb [0], $rgb [1], $rgb [2] );
				}
			}
	}
	return;
}
?>

