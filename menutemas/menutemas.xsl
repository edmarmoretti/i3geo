<?xml version="1.0"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
 <xsl:output method="html"/>
 <xsl:template match="/">
 <html>
 <link rel="stylesheet" type="text/css" href="../geral.css" />
      <script language="JavaScript" type="text/javascript" src="menutemas.js">
      </script>
   <script>
    var navm = false // IE
    var navn = false // netscape
    app = navigator.appName.substring(0,1)
    if (app=='N') navn=true; else navm=true        
   </script>
   <body id="corpo" onmousemove="javascript:this.onmousemove=cap" style="background-color:white;cursor:pointer">
     <table width="100%" cellspacing='0' cellpadding="0">
       <tr>
         <td style="text-align:left">
         <xsl:for-each select="TEMASGEO/GRUPO">
         <xsl:sort select="GTIPO"/>
           <table style="margin:0px;" cellspacing='1' cellpadding="0">
             <tr>
               <td width="100%" title="{DTIPO}" onmouseover="script:this.style.color='gray'" onmouseout="script:this.style.color='black'" style="text-decoration:none">
	               <table cellspacing='1' onclick="muda1(&quot;{ITIPO}&quot;)" style="text-align:left">
		               <tr>
		                 <td style="text-align:left">
		                   <img src="../imagens/pasta.gif"/>
		                 </td>
		                 <td style="text-align:left">
		                   <xsl:value-of select="GTIPO"/>
		                 </td>
		               </tr>
		             </table>
							 </td>
						 </tr>
					 </table>
					 <table style="margin:0px;" cellspacing='1' cellpadding="0">
						 <tr>
						   <td style="text-align:left">
                 <table id="{ITIPO}" style="display:none;text-align:left">
                 <xsl:for-each select="SGRUPO">
                   <tr>
		                 <td style="text-align:left"><img src="../imagens/branco.gif" /></td>
		                 <td onclick="muda(&quot;{SITIPO}&quot;)" style="text-align:left"><img src="../imagens/arquivos.gif" /></td>
		                 <td class="tdbranca" onmouseover="script:this.style.color='gray'" onmouseout="script:this.style.color='#2F4632'" style="text-align:left;" title="{SDTIPO}" onclick="muda(&quot;{SITIPO}&quot;)">
		                 <xsl:value-of select="SDTIPO"/>
		                 </td>
                     <td width="150" id="f{SITIPO}" style="display:none">
                       <table width="100%">
                         <xsl:for-each select="TEMA">
                         <tr>
                           <xsl:if test="string-length(EXEC)='0'">
                           <td onclick="propverf()" onmouseout="propescf()" >
			                       <input type="checkbox" name="layer" value="{TID}" onclick="mudaboxf(this)"/>
			                     </td>
                           <td>
			                       <p title="{TDESC} - {TESC}"><xsl:value-of select="TNOME"/></p>
			                     </td>
                           <td  onclick="previaf('{TID}')">
			                       <p style="cursor:pointer; text-decoration:underline;color:gray">Ver...</p>
			                     </td>
                           <td>
			                       <p title="{TFONTE}"><a href="{TLINK}" target="_blank">Fonte...</a></p>
		                  	   </td>
                           </xsl:if>
                           <xsl:if test="string-length(EXEC)!='0'">
                           <td>
			                     <input type="checkbox" onclick="{EXEC}" />
			                     </td>
                           <td>
			                       <p title="{TDESC} - {TESC}"><xsl:value-of select="TNOME"/></p>
			                     </td>
                           <td></td>
                           <td></td>                       
                           </xsl:if>
                         </tr>
                         </xsl:for-each>
                      </table>
                    </td>
                  </tr>
		  
                  </xsl:for-each>
                </table>
              </td>
            </tr>
          </table>
          </xsl:for-each> 
        </td>
      </tr>
    </table>
  </body>
</html>
</xsl:template>
</xsl:stylesheet>
