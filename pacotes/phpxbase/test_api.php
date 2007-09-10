<?
/**
* ----------------------------------------------------------------
*			XBase
*			test_api.php	
* 
*  Developer        : Erwin Kooi
*  released at      : Jan 2005
*  last modified by : Erwin Kooi
*  date modified    : Jan 2005
*                                                               
*  Info? Mail to info@cyane.nl
* 
* --------------------------------------------------------------
*
* R/W with api demonstration / compare with PHP integrated dbase functions
*
**/

	require_once "api_conversion.php";

	$fields = array(
		array("bool" , DBFFIELD_TYPE_LOGICAL),
		array("memo" , DBFFIELD_TYPE_MEMO),
		array("date" , DBFFIELD_TYPE_DATE),
		array("number" , DBFFIELD_TYPE_NUMERIC, 3, 0),
		array("string" , DBFFIELD_TYPE_CHAR, 50),
	);

	$di = dbase_create("test/dbase.dbf",$fields);
	$xi = xbase_create("test/xbase.dbf",$fields);
	

	dbase_add_record($di,array("T","abc","20060120",123,"string one"));
	dbase_add_record($di,array("F","def","20060121",321,"string two"));
	dbase_add_record($di,array("F","ghi","20060121",111,"string trio"));
	xbase_add_record($xi,array("T","abc","20060120",123,"string one"));
	xbase_add_record($xi,array("F","def","20060121",321,"string two"));
	xbase_add_record($xi,array("F","ghi","20060121",111,"string trio"));
	
	dbase_close($di);
	xbase_close($xi);
	$di = dbase_open("test/dbase.dbf",2);
	$xi = xbase_open("test/xbase.dbf",2);

	dbase_delete_record($di,2);
	xbase_delete_record($xi,2);
	dbase_pack($di);
	xbase_pack($xi);
	
	dbase_close($di);
	xbase_close($xi);
	$di = dbase_open("test/dbase.dbf",2);
	$xi = xbase_open("test/xbase.dbf",2);

	
	echo "dbase<br>";
	echo "index = $di <br>";
	
	echo "<br>";
	echo "xbase<br>";
	echo "index = $xi <br>";
	echo "header info: "; print_r(xbase_get_header_info($xi));
	
	dbase_close($di);
	xbase_close($xi);
	
	echo "<br><br>";
	
	$di = dbase_open("test/xbase.dbf",0);
	$xi = xbase_open("test/dbase.dbf",0);

	echo "dbase<br>";
	echo "index = $di <br>";
	echo "column count = ".dbase_numfields($di)." <br>";
	echo "record count = ".dbase_numrecords($di)." <br>";
    echo "<table>";
    for ($i=0;$i<dbase_numrecords($di);$i++) { echo "<tr>"; $r = dbase_get_record_with_names($di,$i+1); foreach ($r as $c=>$v) { echo "<td> $c=$v </td>"; } echo "</tr>"; }
	echo "</table>";

	
	echo "<br>";
	echo "xbase<br>";
	echo "index = $xi <br>";
	echo "column count = ".xbase_numfields($xi)." <br>";
	echo "record count = ".xbase_numrecords($xi)." <br>";
    echo "<table>";
    for ($i=0;$i<xbase_numrecords($xi);$i++) { echo "<tr>"; $r = xbase_get_record_with_names($xi,$i+1); foreach ($r as $c=>$v) { echo "<td> $c=$v </td>"; } echo "</tr>"; }
	echo "</table>";
	
	dbase_close($di);
	xbase_close($xi);
	
	echo "<br><br>";
	$table =& new XBaseTable("test/dbase.dbf");
	$table->open();
	echo "name: ".$table->name."<br />";
    echo "version: ".$table->version."<br />";
    echo "foxpro: ".($table->foxpro?"yes":"no")."<br />";
    echo "modifyDate: ".date("r",$table->modifyDate)."<br />";
    echo "recordCount: ".$table->recordCount."<br />";
    echo "headerLength: ".$table->headerLength."<br />";
    echo "recordByteLength: ".$table->recordByteLength."<br />";
    echo "inTransaction: ".($table->inTransaction?"yes":"no")."<br />";
    echo "encrypted: ".($table->encrypted?"yes":"no")."<br />";
    echo "mdxFlag: ".ord($table->mdxFlag)."<br />";
    echo "languageCode: ".ord($table->languageCode)."<br />";
    echo $table->toHTML();
    $table->close();
    echo "<br>";
    
	$table =& new XBaseTable("test/xbase.dbf");
	$table->open();
    echo "name: ".$table->name."<br />";
    echo "version: ".$table->version."<br />";
    echo "foxpro: ".($table->foxpro?"yes":"no")."<br />";
    echo "modifyDate: ".date("r",$table->modifyDate)."<br />";
    echo "recordCount: ".$table->recordCount."<br />";
    echo "headerLength: ".$table->headerLength."<br />";
    echo "recordByteLength: ".$table->recordByteLength."<br />";
    echo "inTransaction: ".($table->inTransaction?"yes":"no")."<br />";
    echo "encrypted: ".($table->encrypted?"yes":"no")."<br />";
    echo "mdxFlag: ".ord($table->mdxFlag)."<br />";
    echo "languageCode: ".ord($table->languageCode)."<br />";
    echo $table->toHTML();
    $table->close();
    
?>