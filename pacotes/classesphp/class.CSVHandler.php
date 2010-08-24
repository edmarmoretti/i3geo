<?php
# This program is free software; you can redistribute it and/or modify
# it under the terms of the GNU Library General Public License as published by
# the Free Software Foundation either version 2 of the License, or

//=====================================================================================================================
//classdef  CSVHandler 0.91 :: CSV Handling Wrapper
//=====================================================================================================================
#
#
# Copyright (C) 2005 by Andreas M?ller

class CSVHandler {
	var $Separator;		//
	var $DataFile;
	var $DataKey;
	var $HeaderData;	//
	var $ItemsList;	//
	var $Items_Count;
	var $color;
	var $RecordsList;

// Standard User functions
	function CSVHandler($Filename, $Separator, $KeyFieldName) {		//Constructor
		$this->DataFile=$Filename;
		$this->DataKey=$KeyFieldName;
		$this->Separator=$Separator;
		$this->color="#FFFFFF";
	}
	function ReadCSV() {			//read data into this->ItemsList and return it in an array 
		$this->Items_Count=0;
		$this->ItemsList=array();
		$Item=array();
		$fp = fopen ($this->DataFile,"r");
		$this->HeaderData = fgetcsv ($fp, 3000, $this->Separator);
		while ($DataLine = fgetcsv ($fp, 3000, $this->Separator)) {
			for($i=0;$i<count($this->HeaderData);$i++){
				$Item[$this->HeaderData[$i]]=$DataLine[$i];
			}
			array_push($this->ItemsList,$Item);
			$this->Items_Count++;
		}
		fclose($fp);
		return ($this->ItemsList);
	}
	function Select($needle,$column="all")	{			//get items in a sort of SQL Select query and return them in an array
		$this->ReadCSV();
		if($needle=="*") {
			$result=$this->ItemsList;
		} else {
			$result=array();
			if($column=="all") {
				while(list($key,$line)=each($this->ItemsList)) {
     				if (stristr(implode("",$line),$needle)) array_push($result,$line);
				}
			} else {
				while(list($key,$line)=each($this->ItemsList)) {
     				if (stristr($line[$column],$needle)) array_push($result,$line);
				}
			}
		}
		return ($result);
	}
	function ListAll() {					//prints a list of all Data
		$Data=$this->ReadCSV();
		reset ($this->ItemsList);
		reset ($this->HeaderData);
		$HHeaders="";
		$HData="";
		while(list($HKey,$HVal)=each($this->HeaderData)) {			//Create Headers Line
			$HHeaders.=$this->HTTD($HVal);
		}
		$HHeaders=$this->HTTR($HHeaders);
		while(list($LineKey,$LineVal)=each($this->ItemsList)) {	//Read Data Lines
			$HDataLine="";
			while(list($DataKey,$DataVal)=each($LineVal)) {			//Dissect one Data Line
				$HDataLine.=$this->HTTD($DataVal);
			}
			$HData.=$this->HTTR($HDataLine);	//and add HTML to Data
		}
		print ($this->HTPage($this->HTTable($HHeaders.$HData)));
	}
	function GetValues($field) {		//Fetch all values of a specified field and return values in array
		$Data=$this->ReadCSV();
		$values=array();
		while(list($key,$val)=each($this->ItemsList)) {
    		if(!in_array($val[$field],$values)) array_push($values,$val[$field]);
		}
		sort($values);
		return $values;
	}
	function Edit() {						//All edit function in one Table
		$Data=$this->ReadCSV();
		if(isset($_POST['commit'])) {
			$this->Update($_POST[$this->DataKey],$_POST);
			$Data=$this->ReadCSV();
		}	
		if(isset($_POST['add'])) {
			$this->Add($_POST[$this->DataKey],$_POST);
			$Data=$this->ReadCSV();
		}	
		if(isset($_POST['delete'])) {
			$this->Delete($_POST[$this->DataKey]);
			$Data=$this->ReadCSV();
		}	
		$PAGE=$this->EditList();
		print $PAGE;	
	}
	
//	Administration Area
	function Update($key,$data) {		//Updating Item "key" with "data" named array
		$this->ReadCSV();
		for($i=0;$i<count($this->ItemsList);$i++) {
			If($this->ItemsList[$i][$this->DataKey]==$key){
				while(list($key,$val)=each($this->HeaderData)) {
					if(isset($data[$val])) $this->ItemsList[$i][$val]=$data[$val];
				}
			}	
		}
		$this->WriteData();
		return($this->ItemsList);
	}
	function Add($key,$data) {			//add an Item "key" with "data" named array
		$this->ReadCSV();
		$NewLine=array();
		$NewItem=array($this->DataKey=>$key);
		while(list($key,$val)=each($this->HeaderData)) {
			if(isset($data[$val])) {
				$NewItem[$val]=$data[$val];
			} else {
				$NewItem[$val]=$data[$val]="";
			}
		}
		array_push($this->ItemsList,$NewItem);
		$this->WriteData();
		return($this->ItemsList);
	}
	function EditList() {		//returns Editor's List of Items
		reset ($this->ItemsList);
		reset ($this->HeaderData);
		$HHeaders=$this->HTTD(" ");
		$HData="";
		while(list($HKey,$HVal)=each($this->HeaderData)) {			//Create Headers Line
			$HHeaders.=$this->HTTD($HVal);
		}
		$HHeaders=$this->HTTR($HHeaders);
		while(list($LineKey,$LineVal)=each($this->ItemsList)) {	//Read Data Lines
			$HDataLine="";
			while(list($DataKey,$DataVal)=each($LineVal)) {			//Dissect one Data Line
				$HDataLine.=$this->HTInput($DataKey,$DataVal);
			}
			$HData.=$this->HTForm($LineVal[$this->DataKey],$this->HTTR($this->HTButton("commit").$HDataLine.$this->HTButton("delete")));	//and add HTML to Data
		}
		$HDataLine="";
		reset($this->HeaderData);
		while(list($DataKey,$DataVal)=each($this->HeaderData)) {			// Add an extra Line for Adding a record
			$HDataLine.=$this->HTInput($DataVal,"");
		}
		$HData.=$this->HTForm($LineVal[$this->DataKey],$this->HTTR($this->HTButton("add").$HDataLine));	//and add HTML to Data
		return($this->HTPage($this->HTTable($HHeaders.$HData)));
	}
	function Delete($DeleteKey) {		//Remove Item "Key" from the file
		$inter=array();
		while(list($key,$val)=each($this->ItemsList)) {
			If($val[$this->DataKey]!=$DeleteKey)	array_push($inter,$val);
		}
		$this->ItemsList=$inter;
		$this->WriteData();
		return($this->ItemsList);
	}
	function WriteData() {		//writing contents of ItemList to Datafile
		reset($this->ItemsList);
		$Output=implode($this->Separator, $this->HeaderData)."\n";
		while(list($key,$val)=each($this->ItemsList)) {
			for($i=0;$i<count($this->HeaderData);$i++){
				$writekey=$this->HeaderData[$i];
				$writeitem[$writekey]=$val[$writekey];
			}
			$Output.=implode($this->Separator, $writeitem)."\n";
		}
		$fp = fopen ($this->DataFile,"w");
		flock($fp,2);
		fputs($fp,$Output);
		flock($fp,3);
		fclose($fp);
	}

//	Accessory HTML output functions
	function HTPage($value) {	// Places $value into BODY of HTML Page
		$result = "<!DOCTYPE HTML PUBLIC \"-//W3C//DTD HTML 4.01 Transitional//EN\">\n";
		$result.="<html><head><title>".$this->DataFile." Editor</title>\n";
		$result.="<meta http-equiv=\"Content-Type\" content=\"text/html; charset=iso-8859-1\">\n";
		$result.="<style type=\"text/css\">";
		$result.="<!--  td { margin: 0px; padding: 0px; border: 1px solid #003399; } --></style></head>\n";
		$result.="<body>\n".$value."</body>\n</html>";
		return $result;
	}
	function HTForm($item,$data) {	//places $data into form $item
		return "<form name=\"".$item."\" method=\"post\">\n".$data."</form>\n";
	}
	function HTTable($value) {		//places $value into TABLE
		return "<table width=\"96%\" border=\"0\" cellspacing=\"0\" cellpadding=\"0\">\n".$value."</table>\n";
	}
	function HTTR($value) {			//places $value into TR
		$this->SRotate();
		return "<tr>\n".$value."</tr>\n";
	}
	function HTTD($value) {	// places $value into TD
		return "<td bgcolor=\"".$this->color."\">".$value."</td>\n";
	}
	function HTInput($field,$value) {	//returns TD input field
		$Olen=strlen($value);
		if($Olen<3) {
			$Ilen=12;
		} else {
			$Ilen=$Olen;
		}
		return "<td bgcolor=\"".$this->color."\"><input name=\"".$field."\" type=\"text\" id=\"".$field."\" value=\"".$value."\" size=\"".$Ilen."\"></td>\n";
	}	
	function HTButton($value) {	// returns "$value" button
		return "<td><input name=\"".$value."\" type=\"submit\" id=\"".$value."\" value=\"".$value."\"></td>\n";
	}
	function SRotate() {		//rotating colors for more readability of tables
		if($this->color=="#FFFFFF") {
			$this->color="#CCEEFF";
		} else {
			$this->color="#FFFFFF";
		}
	}
}
?>
