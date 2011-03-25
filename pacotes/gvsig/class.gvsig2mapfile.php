<?php
class gvsig2mapfile{

	var $arquivoGvp;
	var $xml;
	
	function __construct($gvp)
	{
  		if(!file_exists($gvp))
  		{throw new Exception("Arquivo $gvp nуo existe");}
		else{
			$this->arquivoGvp = $gvp;
			if(function_exists("dl")){
				if (!function_exists('simplexml_load_file'))
				{dl( 'php_simplexml.'.PHP_SHLIB_SUFFIX );}
			}
			if (!function_exists('simplexml_load_file'))
			{throw new Exception("Funчуo PHP simplexml_load_file nуo existe");}
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
	function findAttribute($object, $attribute) {
		foreach($object->attributes() as $a => $b) {
			if ($a == $attribute) {
				$return = $b;
			}
		}
		if($return) {
			return $return;
		}
	} 	
}
?>