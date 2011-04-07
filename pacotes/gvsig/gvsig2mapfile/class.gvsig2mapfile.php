<?php
class gvsig2mapfile{
	var $arquivoGvp;
	var $xml;
	function __construct($gvp)
	{
  		if(!file_exists($gvp))
  		{throw new Exception("Arquivo $gvp não existe");}
		else{
			$this->arquivoGvp = $gvp;
			if(function_exists("dl")){
				if (!function_exists('simplexml_load_file'))
				{dl( 'php_simplexml.'.PHP_SHLIB_SUFFIX );}
			}
			if (!function_exists('simplexml_load_file'))
			{throw new Exception("Função PHP simplexml_load_file não existe");}
			$this->xml = simplexml_load_file($gvp);			
		}
	}	
	function getViewsNames(){
		$names = array();
		$this->xml->registerXPathNamespace("tag", "http://www.gvsig.gva.es");
		$results = $this->xml->xpath("/tag:xml-tag/tag:xml-tag/tag:property[@value='ProjectView']/parent::*/tag:property[@key='name']");
		foreach($results as $result){
			$names[] = $this->findAttribute($result,"value");
		}
		return $names;
	}
	function getViewByName($nome){
		$this->xml->registerXPathNamespace("tag", "http://www.gvsig.gva.es");
		$result = $this->xml->xpath("/tag:xml-tag/tag:xml-tag/tag:property[@value='ProjectView']/parent::*/tag:property[@value='".$nome."']/parent::*");
		return $result;
	}
	function getViewData($nome){
		$this->xml->registerXPathNamespace("tag", "http://www.gvsig.gva.es");
		$path = "/tag:xml-tag/tag:xml-tag/tag:property[@value='ProjectView']/parent::*/tag:property[@value='".$nome."']/parent::*/tag:xml-tag/tag:xml-tag";
		
		$xmin = $this->getValue($path,"adjustedExtentX");
		$ymin = $this->getValue($path,"adjustedExtentY");
		$xmax = $xmin + $this->getValue($path,"adjustedExtentW");
		$ymax = $ymin + $this->getValue($path,"adjustedExtentH");
		$proj = $this->getValue($path,"proj");
		$nomes = $this->getValue($path,"LayerNames");
		return array(
			"extent"=>array($xmin,$ymin,$xmax,$ymax),
			"proj"=>$proj,
			"layerNames"=>explode(",",str_replace(" ,",",",$nomes))
		);
	}
	function getLayerData($viewNome,$layerNome){
		$this->xml->registerXPathNamespace("tag", "http://www.gvsig.gva.es");
		$path = "/tag:xml-tag/tag:xml-tag/tag:property[@value='ProjectView']/parent::*/tag:property[@value='".$viewNome."']/parent::*/tag:xml-tag/tag:xml-tag/tag:xml-tag/tag:xml-tag/parent::*/tag:property[@value='".$layerNome."']/parent::*";
		$classes = array();
		$render = 'com.iver.cit.gvsig.fmap.rendering';
		
		$path1 = $path."/tag:xml-tag/tag:property[@value='".$render.".VectorialUniqueValueLegend']/parent::*/tag:xml-tag";
		$result = $this->xml->xpath($path1);
		if($result != FALSE){
			$coluna = $this->getValue($path."/tag:xml-tag","fieldNames");
			$valores = $this->getValue($path."/tag:xml-tag","values");
			$tipocoluna = $this->getValue($path."/tag:xml-tag","fieldTypes");
			$classes = $this->VectorialUniqueValueLegend($result,$path1,$coluna,$tipocoluna,$valores);
		}
		
		$path1 = $path."/tag:xml-tag/tag:property[@value='".$render.".SingleSymbolLegend']/parent::*/tag:xml-tag";
		$result = $this->xml->xpath($path1);
		if($result != FALSE)
		{$classes = $this->SingleSymbolLegend($result,$path1);}
		//
		//obtem a conexão
		//a senha não pode ser obtida, então, é usado o mesmo nome de usuário em seu lugar. No i3Geo deve-se prever isso na variável de substituição de string.
		$driverName = $this->getValue($path,"driverName");
		if($driverName == "gvSIG shp driver"){
			$data = $this->getValue($path,"file");
			$connection = "";
			$connectiontype = "";
		}
		if($driverName == "PostGIS JDBC Driver"){
			$path1 = $path."/tag:xml-tag/tag:property[@value='org.postgresql.Driver']/parent::*";
			$tabela = "";
			if($this->getValue($path1,"schema") != "")
			{$tabela = $this->getValue($path1,"schema").".";}
			$tabela .= $this->getValue($path1,"tablename");
			$data = $this->getValue($path1,"THE_GEOM")." FROM (select ".$this->getValue($path1,"THE_GEOM").",".$this->getValue($path1,"fields")." FROM ".$tabela.") as foo USING UNIQUE ".$this->getValue($path1,"FID")." USING SRID=".$this->getValue($path1,"SRID");
			$connection = "user=".$this->getValue($path1,"username")." password=".$this->getValue($path1,"username")." dbname=".$this->getValue($path1,"dbName")." host=".$this->getValue($path1,"host")." port=".$this->getValue($path1,"port");
			$connectiontype = MS_POSTGIS;
		}
		return array(
			"minScale"=>$this->getValue($path,"minScale"),
			"maxScale"=>$this->getValue($path,"maxScale"),
			"visible"=>$this->getValue($path,"visible"),
			"proj"=>$this->getValue($path,"proj"),
			"transparency"=>$this->getValue($path,"transparency"),
			"type"=>$this->getValue($path,"type"),
			"data"=>$data,
			"connection"=>$connection,
			"connectiontype"=>$connectiontype,
			"driverName"=>$this->getValue($path,"driverName"),
			"isLabeled"=>$this->getValue($path,"isLabeled"),
			"legenda"=>array(
				"tipoLegenda"=>$this->getValue($path."/tag:xml-tag","className"),
				"classes"=>$classes
			)
		);
	}
	function VectorialUniqueValueLegend($result,$path1,$coluna,$tipocoluna,$valores){
		$valores = ",".str_replace(" ,",",",$valores);
		$valores = explode(",",$valores);
		$classes = array();
		$c = 0;
		while(list( , $node) = each($result)) {
			$classe = array();
			if($tipocoluna == 12)
			{$classe["exp"] = "('[".$coluna."]'eq'".$valores[$c]."')";}
			else
			{$classe["exp"] = "([".$coluna."] = ".$valores[$c]." )";}
			$classe["className"] = $this->getValue($path1,"className",$c);
			$classe["desc"] = $this->getValue($path1,"desc",$c);
			$classe["color"] = $this->getValue($path1,"color",$c);
			$classe["rotation"] = $this->getValue($path1,"rotation",$c);
			$classe["offsetX"] = $this->getValue($path1,"offsetX",$c);
			$classe["offsetY"] = $this->getValue($path1,"offsetY",$c);
			$classe["size"] = $this->getValue($path1,"size",$c);
			$classe["outline"] = $this->getValue($path1,"outline",$c);
			$classe["markerStyle"] = $this->getValue($path1,"markerStyle",$c);
			$classe["hasFill"] = $this->getValue($path1,"hasFill",$c);
			$classe["hasOutline"] = $this->getValue($path1,"hasOutline",$c);
			if($classe["desc"] != "")
			{$classes[] = $classe;}
			$c = $c + 1;
		}
		return $classes;
	}
	function SingleSymbolLegend($result,$path){
		$classes = array();
		$c = 0;
		//var_dump($result);exit;
		while(list( , $node) = each($result)) {
			$classe = array();
			$classe["className"] = $this->getValue($path,"className",$c);
			$classe["desc"] = $this->getValue($path,"desc",$c);
			$classe["color"] = $this->getValue($path,"color",$c);
			$classe["rotation"] = $this->getValue($path,"rotation",$c);
			$classe["offsetX"] = $this->getValue($path,"offsetX",$c);
			$classe["offsetY"] = $this->getValue($path,"offsetY",$c);
			$classe["size"] = $this->getValue($path,"size",$c);
			$classe["outline"] = $this->getValue($path,"outline",$c);
			$classe["markerStyle"] = $this->getValue($path,"markerStyle",$c);
			$classe["hasFill"] = $this->getValue($path,"hasFill",$c);
			$classe["hasOutline"] = $this->getValue($path,"hasOutline",$c);
			$classe["exp"] = false;
			if($classe["hasOutline"] == "true"){
				$classe["outline"] = $this->getValue($path."/tag:xml-tag","color");
			}
			$classes[] = $classe;
			$c = $c + 1;
		}
		return $classes;
	}
	function getValue($path,$key,$i=0){
		$result = $this->xml->xpath($path."/tag:property[@key='".$key."']");
		if($result)
		{return $this->findAttribute($result[$i],"value");}
		else
		{return false;}
	}
	function addLayers($objMap,$gvsigview,$layerNames){
		foreach($layerNames as $lname){
			$dataLayer = $this->getLayerData($gvsigview,$lname);
			$oLayer = ms_newLayerObj($objMap);
			$oLayer->setmetadata("TEMA",$lname);
			$oLayer = $this->data2layer($oLayer,$dataLayer);
		}
		return $objMap;
	}
	function data2layer($oLayer,$dataLayer){
		$oLayer->set("name",$this->nomeRandomico());
		$oLayer->set("data",$dataLayer["data"]);
		if($dataLayer["connectiontype"] != "")
		{$oLayer->setConnectionType($dataLayer["connectiontype"]);}
		if($dataLayer["connection"] != "")
		{$oLayer->set("connection",$dataLayer["connection"]);}		
		$oLayer->set("status",MS_DEFAULT);
		if($dataLayer["visible"] == "false")
		{$oLayer->set("status",MS_OFF);}
		$opacidade = ($dataLayer["transparency"] * 100) / 255;
		$oLayer->set("opacity",$opacidade);
		if($dataLayer["minScale"] > 0)
		{$oLayer->set("minscaledenom",$dataLayer["minScale"]);}
		if($dataLayer["maxScale"] > 0)
		{$oLayer->set("maxscaledenom",$dataLayer["maxScale"]);}
		
		$tipo = $dataLayer["legenda"]["classes"][0]["className"];
		$oLayer->set("type",1);
		if($tipo == "com.iver.cit.gvsig.fmap.core.symbols.SimpleMarkerSymbol")
		{$oLayer->set("type",0);}
		if($tipo == "com.iver.cit.gvsig.fmap.core.symbols.SimpleFillSymbol")
		{$oLayer->set("type",2);}
		foreach($dataLayer["legenda"]["classes"] as $data){
			$classe = ms_newClassObj($oLayer);
			$estilo = ms_newStyleObj($classe);
			if($oLayer->type == 0){
				$estilo->set("symbolname","ponto");
			}
			$ncor = explode(",",$data["color"]);
			if($data["hasFill"] == "true")
			{$cor = $estilo->color;}
			else
			{$cor = $estilo->outlinecolor;}
			$cor->setrgb($ncor[0],$ncor[1],$ncor[2]);
			if($data["size"] != false)
			{$estilo->set("size",$data["size"]);}
			if($data["exp"] != false)
			{$classe->setExpression($data["exp"]);}
		}
		return $oLayer;
	}
	function findAttribute($object, $attribute) {
		$return = false;
		if(@$object->attributes()){
			foreach($object->attributes() as $a => $b) {
				if ($a == $attribute) {
					$return = $b;
				}
			}
		}
		return $return;
	}
	function nomeRandomico($n=10)
	{
		$nomes = "";
		$a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
		$max = 51;
		for($i=0; $i < $n; ++$i)
		{$nomes .= $a{mt_rand(0, $max)};}
		return $nomes;
	}	
}
?>