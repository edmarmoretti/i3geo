<?php
/**
 * Manipula um arquivo GVP (projeto gvSIG) para construção de layers Mapserver
 * @author Edmar Moretti
 * @license GPL2
 */
class gvsig2mapfile{
	var $arquivoGvp;
	var $xml;
	var $nomesLayersAdicionados = array();
	/**
	 * Construtor da classe
	 * @param string $gvp arquivo de projeto gvsig
	 * @example $gm = new gvsig2mapfile($gvsiggvp);
	 * @throws Exception
	 */
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
	/**
	 * Lista de vistas existentes no projeto gvsig
	 * @return array
	 **/
	function getViewsNames(){
		$names = array();
		$this->xml->registerXPathNamespace("tag", "http://www.gvsig.gva.es");
		$results = $this->xml->xpath("/tag:xml-tag/tag:xml-tag/tag:property[@value='ProjectView']/parent::*/tag:property[@key='name']");
		foreach($results as $result){
			$names[] = $this->findAttribute($result,"value");
		}
		return $names;
	}

	/**
	 * Retorna uma vista
	 * @param string $nome
	 * @return $xml
	 */
	function getViewByName($nome){
		$this->xml->registerXPathNamespace("tag", "http://www.gvsig.gva.es");
		$result = $this->xml->xpath("/tag:xml-tag/tag:xml-tag/tag:property[@value='ProjectView']/parent::*/tag:property[@value='".$nome."']/parent::*");
		return $result;
	}

	/**
	 * Obtem os dados descritivos de uma visao
	 * @param string $nome Nome da vista
	 * @return array (
			"extent"=>array(xmin,ymin,xmax,ymax),
			"proj"=>string projecao,
			"layerNames"=>string lista de layers separados por virgula
		)
	 */
	function getViewData($nome){
		$this->xml->registerXPathNamespace("tag", "http://www.gvsig.gva.es");
		$path = "/tag:xml-tag/tag:xml-tag/tag:property[@value='ProjectView']/parent::*/tag:property[@value='".$nome."']/parent::*/tag:xml-tag/tag:xml-tag";

		$xmin = (float) $this->getValue($path,"adjustedExtentX");
		$ymin = (float) $this->getValue($path,"adjustedExtentY");
		$xmax = $xmin + (float) $this->getValue($path,"adjustedExtentW");
		$ymax = $ymin + (float) $this->getValue($path,"adjustedExtentH");

		$proj = $this->getValue($path,"proj");
		$nomes = $this->getValue($path,"LayerNames");
		return array(
			"extent"=>array($xmin,$ymin,$xmax,$ymax),
			"proj"=>(string) $proj,
			"layerNames"=>explode(",",str_replace(" ,",",",$nomes))
		);
	}
	/**
	 * Obtem os dados de um layer
	 * @param string $viewNome
	 * @param string $layerNome
	 * @return array(
			"minScale"=> string,
			"maxScale"=>string,
			"visible"=>string,
			"proj"=>string,
			"transparency"=>string,
			"type"=>string,
			"data"=>string,
			"connection"=>string,
			"connectiontype"=>string,
			"driverName"=>string,
			"isLabeled"=>string,
			"legenda"=>array(
				"tipoLegenda"=>string,
				"classes"=>string
			)
		)
	 *
	 */
	function getLayerData($viewNome,$layerNome){
		$this->xml->registerXPathNamespace("tag", "http://www.gvsig.gva.es");
		$path = "/tag:xml-tag/tag:xml-tag/tag:property[@value='ProjectView']/parent::*/tag:property[@value='".$viewNome."']/parent::*/tag:xml-tag/tag:xml-tag/tag:xml-tag/tag:xml-tag/parent::*/tag:property[@value='".$layerNome."']/parent::*";
		$classes = array();
		$render = 'com.iver.cit.gvsig.fmap.rendering';

		$path1 = $path."/tag:xml-tag/tag:property[@value='".$render.".VectorialUniqueValueLegend']/parent::*/tag:xml-tag";
		$result = $this->xml->xpath($path1);
		if($result != FALSE){
			$coluna = (string) $this->getValue($path."/tag:xml-tag","fieldNames");
			$valores = (string) $this->getValue($path."/tag:xml-tag","values");
			$tipocoluna = (string) $this->getValue($path."/tag:xml-tag","fieldTypes");
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
			$data = (string) $this->getValue($path,"file");
			$connection = "";
			$connectiontype = "";
		}
		if($driverName == "PostGIS JDBC Driver"){
			$path1 = $path."/tag:xml-tag/tag:property[@value='org.postgresql.Driver']/parent::*";
			$tabela = "";
			if($this->getValue($path1,"schema") != "")
			{$tabela = (string) $this->getValue($path1,"schema").".";}
			$tabela .= (string) $this->getValue($path1,"tablename");
			$data = (string) $this->getValue($path1,"THE_GEOM")." FROM (select ".(string) $this->getValue($path1,"THE_GEOM").",".(string) $this->getValue($path1,"fields")." FROM ".$tabela.") as foo USING UNIQUE ".(string) $this->getValue($path1,"FID")." USING SRID=".(string) $this->getValue($path1,"SRID");
			$connection = "user=".(string) $this->getValue($path1,"username")." password=".(string) $this->getValue($path1,"username")." dbname=".(string) $this->getValue($path1,"dbName")." host=".(string) $this->getValue($path1,"host")." port=".(string) $this->getValue($path1,"port");
			$connectiontype = MS_POSTGIS;
		}
		return array(
			"minScale"=>(string) $this->getValue($path,"minScale"),
			"maxScale"=>(string) $this->getValue($path,"maxScale"),
			"visible"=>(string) $this->getValue($path,"visible"),
			"proj"=>(string) $this->getValue($path,"proj"),
			"transparency"=>(string) $this->getValue($path,"transparency"),
			"type"=>(string) $this->getValue($path,"type"),
			"data"=>$data,
			"connection"=>$connection,
			"connectiontype"=>$connectiontype,
			"driverName"=>(string) $this->getValue($path,"driverName"),
			"isLabeled"=>(string) $this->getValue($path,"isLabeled"),
			"legenda"=>array(
				"tipoLegenda"=>(string) $this->getValue($path."/tag:xml-tag","className"),
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
			$classe["className"] = (string) $this->getValue($path1,"className",$c);
			$classe["desc"] = (string) $this->getValue($path1,"desc",$c);
			$classe["color"] = (string) $this->getValue($path1,"color",$c);
			$classe["rotation"] = (string) $this->getValue($path1,"rotation",$c);
			$classe["offsetX"] = (string) $this->getValue($path1,"offsetX",$c);
			$classe["offsetY"] = (string) $this->getValue($path1,"offsetY",$c);
			$classe["size"] = (string) $this->getValue($path1,"size",$c);
			$classe["outline"] = (string) $this->getValue($path1,"outline",$c);
			$classe["markerStyle"] = (string) $this->getValue($path1,"markerStyle",$c);
			$classe["hasFill"] = (string) $this->getValue($path1,"hasFill",$c);
			$classe["hasOutline"] = (string) $this->getValue($path1,"hasOutline",$c);
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
			$classe["className"] = (string) $this->getValue($path,"className",$c);
			$classe["desc"] = (string) $this->getValue($path,"desc",$c);
			$classe["color"] = (string) $this->getValue($path,"color",$c);
			$classe["rotation"] = (string) $this->getValue($path,"rotation",$c);
			$classe["offsetX"] = (string) $this->getValue($path,"offsetX",$c);
			$classe["offsetY"] = (string) $this->getValue($path,"offsetY",$c);
			$classe["size"] = (string) $this->getValue($path,"size",$c);
			$classe["outline"] = (string) $this->getValue($path,"outline",$c);
			$classe["markerStyle"] = (string) $this->getValue($path,"markerStyle",$c);
			$classe["hasFill"] = (string) $this->getValue($path,"hasFill",$c);
			$classe["hasOutline"] = (string) $this->getValue($path,"hasOutline",$c);
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
		$this->nomesLayersAdicionados[] = $oLayer->name;
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