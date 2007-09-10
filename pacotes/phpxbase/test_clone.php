<?
/**
* ----------------------------------------------------------------
*			XBase
*			test_clone.php	
* 
*  Developer        : Erwin Kooi
*  released at      : Jan 2006
*  last modified by : Erwin Kooi
*  date modified    : Jan 2006
*                                                               
*  Info? Mail to info@cyane.nl
* 
* --------------------------------------------------------------
*
* Demonstration how to clone table meta-data to another and copy records
*
**/

	/* load the required classes */
	require_once "Column.class.php";
	require_once "Record.class.php";
	require_once "Table.class.php";
	require_once "WritableTable.class.php";
	
	/* open a template table object and read it */
	$tableParent = new XBaseTable("test/bond.DBF");
	$tableParent->open();
	
	/* create a new table */
	$tableNew = XBaseWritableTable::cloneFrom($tableParent);
	$tableNew->openWrite("test/created.dbf",true);
	while ($record=$tableParent->nextRecord()) {
		$tableNew->appendRecord();
		$tableNew->record->copyFrom($record);
		$tableNew->writeRecord();
	}
	$tableNew->close();
	$tableParent->close();
	
	/* open created file*/
	$table = new XBaseTable("test/created.dbf");
	$table->open();

    /* xml output */
    echo "<pre>\n";
    echo htmlspecialchars($table->toXML());
    echo "</pre>\n";

	/* close the table */
	$table->close();
?>