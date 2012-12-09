<?php
require_once("../../../classesphp/pega_variaveis.php");
require_once("../../../classesphp/funcoes_gerais.php");
$versao = versao();
$versao = $versao["principal"];
error_reporting(E_ALL);
if (isset($_FILES['i3GEOuploadfile']['name']))
{
	require_once ("../../../ms_configura.php");
	include_once("class.gvsig2mapfile.php");
	if($base == "" or !isset($base)){
		$base = "";
		if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
		{$base = $locaplic."/aplicmap/geral1windowsv".$versao.".map";}
		else
		{
			if($base == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
				$base = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
			}
			if($base == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
				$base = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
			}
			if($base == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
				$base = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
			}
			if($base == "")
			{$base = $locaplic."/aplicmap/geral1v".$versao.".map";}
		}
	}
	else{
		if(!file_exists($base))
		{$base = $locaplic."/aplicmap/".$base;}
	}
	$mapn = ms_newMapObj($base);

	//echo "<p>Carregando o arquivo...</p>";
	//verifica nomes
	verificaNome($_FILES['i3GEOuploadfile']['name']);
	//sobe arquivo
	$Arquivo = $_FILES['i3GEOuploadfile']['tmp_name'];
	$Arquivon = $dir_tmp."/".$_FILES['i3GEOuploadfile']['name'];
	$status =  move_uploaded_file($Arquivo,$Arquivon);
	if($status != 1)
	{ob_clean();echo "Ocorreu um erro no envio do arquivo";exit;}

	if($status == 1){
		//echo $Arquivon;
		$nomefim = str_replace(".gvp",".map",$Arquivon);
		echo "#arquivo final: $nomefim <br>";
		$gm = new gvsig2mapfile($Arquivon);
		$numlayers = $mapn->numlayers;
		for ($i=0;$i < $numlayers;$i++){
			$layer = $mapn->getlayer($i);
			$layer->set("status",MS_DELETE);
		}
		$views = $gm->getViewsNames();
		foreach($views as $v){
			echo "#vista: ".$v;
			$dataView = $gm->getViewData($v);
			$layernames = $dataView["layerNames"];
			echo "<br>#layers: ".implode(", ",$layernames)."<br>";
			$mapn = $gm->addLayers($mapn,$v,$layernames);
			$mapn->save($nomefim);
		}
		$next = $dataView["extent"];
		$ext = $mapn->extent;
		$ext->setextent($next[0],$next[1],$next[2],$next[3]);

		$mapn->save($nomefim);
		$handle = fopen(str_replace(".gvp",".map",$Arquivon), "r");
		echo "<html>#mapfile: <br>";
		while (!feof($handle))
    	{
        	$linha = fgets($handle);
			echo $linha."<br>";
		}
		fclose($handle);
	}
	else
	{
		echo "<p>Erro ao enviar o arquivo.</p>";
	}
}
function verificaNome($nome)
{
	$nome = strtolower($nome);
	$lista = explode(".",$nome);
	$extensao = $lista[count($lista) - 1];
	if($extensao != "gvp")
	{
		echo "Nome de arquivo inválido";
		exit;
	}
}
?>
</body>
</html>