<HTML>
<HEAD>
<TITLE>PHP WMS Client</TITLE>
<LINK REL='stylesheet' TYPE='text/css' HREF='wms_style.css'>
</HEAD>
<BODY BGCOLOR=#FFFFFF>

<H1>PHP WMS Client</H1>

<P>This client uses the XML capabilities of PHP and standard web application 
programming techniques to present an HTML/JavaScript view of 
<A HREF='http://www.opengis.org'>OpenGIS</A> Web Map Server (WMS) internet
mapping servers.</P>

<H2>Test Servers</H2>

<P>Our goal is to "do the right thing" with all these servers. It will be
a long hard road.</P>

<?

$servers = array(

  array("Refractions USA","http://office.refractions.net/ms/cgi-bin/mapserv?map=/home/httpd/mapserver/html/usa/usa.map&","Good"),
  array("Refractions PostGIS","http://mapserver.refractions.net/cgi-bin/mapserv?map=/home/www/mapserv/maps/postgis.map&","OK"),
  array("CubeWerx World","http://www.cubewerx.com/demo/cubeserv/cubeserv.cgi?","Bad"),
  array("DMSolutions GMAP","http://www2.dmsolutions.ca/cgi-bin/mswms_gmap?","Good")
);

print "<TABLE WIDTH=100% BORDER=1 CELLPADDING=5>";
print "<TR BGCOLOR=#EEEEEE><TH>WMS Site</TH><TH>Online Resource URL</TH><TH>Status</TH></TR>";
foreach ( $servers as $s ) {
  $hurl = urlencode($s[1]);
  print "<TR><TH ALIGN=CENTER>$s[0]</TH><TD><A HREF='wms.php?onlineresource=$hurl'>$s[1]</A></TD><TD>$s[2]</TD></TR>";
}

?>

<FORM ACTION='wms.php' METHOD='get'>
<TR>
  <TH ALIGN=RIGHT>Enter a Server</TH>
  <TD COLSPAN=2><INPUT NAME='onlineresource' TYPE='text' SIZE='50'>
  <INPUT TYPE='submit' VALUE=' Try Server '></TD>
</TR>
</FORM>

</TABLE>


<H2>To Do List</H2>

<UL>
<LI>Properly handle heirarchical &lt;Layer&gt; objects and provide a 
tree-based layer list.
<LI>Enable and disable layer entries appropriately based on the 
&lt;ScaleHint&gt; provided for &lt;Layer&gt;s.
<LI>Continue to test against new and unknown WMS servers to obtain maximum
compatibility.
<LI>Aesthetic improvements to the interface. Graphical mode selectors, 
rollovers, highlighting. "Themability" of the interface.
</UL>

</BODY>
</HTML>
