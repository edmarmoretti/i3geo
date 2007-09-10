<?
/**
* ----------------------------------------------------------------
*			XBase
*			test.php	
* 
*  Developer        : Erwin Kooi
*  released at      : Nov 2005
*  last modified by : Erwin Kooi
*  date modified    : Jan 2005
*                                                               
*  Info? Mail to info@cyane.nl
* 
* --------------------------------------------------------------
*
* Basic demonstration
* download the sample tables from:
* http://www.cyane.nl/phpxbase.zip
*
**/

	/* load the required classes */
	require_once "Column.class.php";
	require_once "Record.class.php";
	require_once "Table.class.php";
	
	/* create a table object and open it */
	$table = new XBaseTable("test/bond.DBF");
	$table->open();

	/* print some header info */
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

    /* html output */
    echo "<br /><table border=1>";
    
    /* print column names */
    echo "<tr>";
    foreach ($table->getColumns() as $i=>$c) {
	    echo "<td>".$c->getName()." (".$c->getType()." ".$c->getLength().")</td>";
    }
    echo "</tr>";
    
    /* print records */
    while ($record=$table->nextRecord()) {
	    echo "<tr>";
	    foreach ($table->getColumns() as $i=>$c) {
		    echo "<td>".$record->getString($c)."</td>";
	    }
	    echo "</tr>";
    }
	echo "</table>";

	/* close the table */
	$table->close();
?>