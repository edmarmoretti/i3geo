<?php
include "index.php";
?>
<div class="container">
	<div class="row center-block">
		<div class="col-sm-12">
			<div class="row">
				<div class="col-md-12">
					<div class="well">
					<?php
					error_reporting(0);
					//
					//carrega o phpmapscript
					//
					if (!function_exists('ms_GetVersion')){
						if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
							if(!@dl('php_mapscript_48.dll'))
								dl('php_mapscript.dll');
						}
						else{
							dl('php_mapscript.so');
						}
					}
					include_once (dirname(__FILE__)."/../../../admin/php/admin.php");
					$versao = versao();
					$versao = $versao["principal"];
					//
					//no caso do programa ser utilizado via URL
					//
					if(empty($tipo)){
						exit;
					}
					if($tipo == "mini" || $tipo == "todos" || $tipo == "grande"){
						ms_ResetErrorList();
						//verifica login
						if(empty($_POST["senha"]) || empty($_POST["usuario"])){
							exit;
						}
						else{
							$continua = verificaMaster($_POST["usuario"],$_POST["senha"],$i3geomaster);
							if($continua === false){
								echo "<div class='alert alert-warning'>Usu&aacute;rio n&atilde;o registrado em i3geo/ms_configura.php na vari&aacute;vel i3geomaster</div>";
								exit;
							}
						}
						if (ob_get_level() == 0){
							ob_start();
						}
						error_reporting(0);
						$arqs = listaArquivos("../../../temas",true,array("map","gvp"));
						$arqs = $arqs["arquivos"];
						sort($arqs);
						foreach ($arqs as $arq){
							$arq = str_replace(" ","xxxx",$arq);
							$temp = explode(".",$arq);
							if(file_exists($locaplic.'/temas/'.$arq) && $temp[(count($temp) - 1)] == "map" && !(strpos($temp[0],"_") === 0) ){
								echo "<div 'class=well'><h4>$arq</h4>";
								if($tipo == "mini" || $tipo == "todos"){
									if(!file_exists($locaplic.'/temas/miniaturas/'.$arq.'.mini.png')){
										verificaMiniatura($arq,"mini");
									}
								}
								if($tipo == "grande"  || $tipo == "todos"){
									if(!file_exists($locaplic.'/temas/miniaturas/'.$arq.'.grande.png')){
										verificaMiniatura($arq,"grande");
									}
								}
								echo "</div>";
							}
							ob_flush();
							flush();
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
	global $locaplic,$versao,$base,$postgis_mapa;
	if($versao == ""){
		$versao = versao();
		$versao = $versao["principal"];
	}
	ms_ResetErrorList();
	$tema = "";
	$map = str_replace("\\","/",$map);
	$map = basename($map);
	$extensao = ".map";
	if (file_exists($locaplic.'/temas/'.$map)){
		$tema = $locaplic.'/temas/'.$map;
	}
	else{
		if (file_exists($locaplic.'/temas/'.$map.'.gvp')){
			$extensao = ".gvp";
		}
		$tema = $locaplic.'/temas/'.$map.$extensao;
	}
	if ($tema != ""){
		if(isset($base) && $base != ""){
			if(file_exists($base))
			{$f = $base;}
			else
			{$f = $locaplic."/aplicmap/".$base.".map";}
			if(!file_exists($base)){
				echo "<div class='alert alert-danger'>ARQUIVO $base N&Acirc;O FOI ENCONTRADO. CORRIJA ISSO EM ms_configura.php";
				exit;
			}
		}
		else{
			$f = "";
			if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
				$f = $locaplic."/aplicmap/geral1windowsv".$versao.".map";
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
					$f = $locaplic."/aplicmap/geral1v".$versao.".map";
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
				autoClasses($layern,$mapa,$locaplic);
				if ($layern->data == ""){
					$dados = $layern->connection;
				}
				else{
					$dados = $layern->data;
				}
				$pegarext = $teman->name;
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
			zoomTemaMiniatura($pegarext,$mapa);
		}
		if($extensao == ".gvp"){
			include_once($locaplic."/pacotes/gvsig/gvsig2mapfile/class.gvsig2mapfile.php");
			$gm = new gvsig2mapfile($tema);
			$gvsigview = $gm->getViewsNames();
			foreach($gvsigview as $v){
				$dataView = $gm->getViewData($v);
				$mapa = $gm->addLayers($mapa,$v,$dataView["layerNames"]);
			}
			$next = $dataView["extent"];
			$ext = $mapa->extent;
			$ext->setextent($next[0],$next[1],$next[2],$next[3]);
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
			//if ($objImagemG == "" || $objImagemG == MS_FAILURE)
			//{echo "Problemas ao gerar o mapa<br>";return;}
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
			$dir = $locaplic."/temas/miniaturas";
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

?>
