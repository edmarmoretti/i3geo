<HTML>
<HEAD>
<LINK REL='stylesheet' TYPE='text/css' HREF='wms_style.css'>
</HEAD>
<SCRIPT LANGUAGE='JavaScript'>
function doClick(mode) {
  // 
  // Ensure that buttons behave the way we want. When we 
  // get graphical buttons, this behavior will still exist,
  // but the javascript will be more complex with rollovers
  // and so on.
  //
  if( mode == "all" ) {
    // 
    // If zooming to all, set the mode back to the default
    // mode (pan) right away, then initiate the action.
    //
    top.mapframe.setMode(mode);
    mode = "pan";
  } 
  //
  // Blank all modes then set the mode to the current one. 
  //
  for ( var i = 0; i < document.controls.elements.length; i++ ) {
    document.controls.elements[i].checked = false;
  }
  eval("document.controls." + mode + ".checked = true");
  //
  // Pass the mode on through.
  //
  top.mapframe.setMode(mode);
  return false;
}
</SCRIPT>
<BODY>
<FORM NAME=controls>

<TABLE WIDTH=100% BORDER=0>
<TR>
<TD ALIGN=LEFT><A HREF="index.php" TARGET="_top">Home</A></TD>
<TD ALIGN=RIGHT>
<INPUT 
  TYPE=radio 
  NAME=all 
  onClick='doClick("all")'
  > ALL
<INPUT 
  TYPE=radio 
  NAME=pan 
  CHECKED
  onClick='doClick("pan")'
  > PAN
<INPUT 
  TYPE=radio 
  NAME=zin 
  onClick='doClick("zin")'
  > ZIN
<INPUT 
  TYPE=radio 
  NAME=zout 
  onClick='doClick("zout")'
  > ZOUT
<INPUT 
  TYPE=radio 
  NAME=qry
  onClick='doClick("qry")'
  > QRY
</TD>
</TR>
</TABLE>

</FORM>

</BODY>
</HTML>
