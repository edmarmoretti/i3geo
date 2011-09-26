<?xml version="1.0" encoding="ISO-8859-1"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0"
 xmlns:gco="http://www.isotc211.org/2005/gco"
 xmlns:gmd="http://www.isotc211.org/2005/gmd"
 xmlns:dc="http://purl.org/dc/elements/1.1/"
 xmlns:dct="http://purl.org/dc/terms/"
 xmlns:ows="http://www.opengis.net/ows"
 xmlns:cat="http://www.esri.com/metadata/csw/">

<xsl:output method="xml" encoding="ISO-8859-1"/>



<xsl:variable name="pageUrl">
  <xsl:text>javascript:(csw_client.getRecords</xsl:text>
  <xsl:text>('</xsl:text>
</xsl:variable>


<xsl:template match="/results/*[local-name()='GetRecordsResponse']">
  <xsl:apply-templates select="./*[local-name()='SearchResults']"/>
</xsl:template>


<xsl:template match="*[local-name()='SearchResults']">


<xsl:variable name="start">
    <xsl:value-of select="../../request/@start"/>
</xsl:variable>

<!-- because GeoNetwork does not return nextRecord we have to do some calculation -->
<xsl:variable name="next">
  <xsl:choose>
    <xsl:when test="@nextRecord">
      <xsl:value-of select="@nextRecord"/>
    </xsl:when>
    <xsl:otherwise>
      <xsl:choose>
        <xsl:when test="number(@numberOfRecordsMatched) >= (number($start) + number(@numberOfRecordsReturned))">
          <xsl:value-of select="number($start) + number(@numberOfRecordsReturned)"/>
        </xsl:when>
    	<xsl:otherwise>
    	  <xsl:value-of select="0"/>
    	</xsl:otherwise>
      </xsl:choose>
    </xsl:otherwise>
  </xsl:choose>
</xsl:variable>

<div class="captioneddiv">

<!--xsl:if test="number(@numberOfRecordsMatched) > number(@numberOfRecordsReturned)"-->
<!-- because ESRI GPT returns always numberOfRecordsMatched = 0 -->
<xsl:if test="number(@numberOfRecordsReturned) > 0 and ($start > 1 or number($next) > 0)">
  <h3 style="float:right;top: -2.5em;">
    <xsl:if test="$start > 1">
      <a>
        <xsl:attribute name="href">
	    <xsl:value-of select="$pageUrl"/>
    	  <xsl:value-of select="number($start)-number(../../request/@maxrecords)"/>
          <xsl:text>'))</xsl:text> 
	    </xsl:attribute>
        <xsl:text>&lt;&lt; previous</xsl:text>
      </a>
    </xsl:if>
    <xsl:text>  || </xsl:text> 
    <xsl:if test="number($next) > 0">
      <a>
        <xsl:attribute name="href">
     	  <xsl:value-of select="$pageUrl"/>
	  <xsl:value-of select="$next"/>
          <xsl:text>'))</xsl:text> 
	</xsl:attribute>
        <xsl:text>next &gt;&gt;</xsl:text>
      </a>
    </xsl:if>
  </h3>
</xsl:if>

<h3>Total: <xsl:value-of select="@numberOfRecordsReturned"/>
(of <xsl:value-of select="@numberOfRecordsMatched"/>)
</h3>
    
<br/>
</div>
  <div>
    <xsl:apply-templates/>
  </div>
</xsl:template>

<xsl:template match="/*[local-name()='GetRecordByIdResponse']">
    <xsl:apply-templates select="cat:FullRecord"/>
    <xsl:apply-templates select="*[local-name()='Record']"/>
    <xsl:apply-templates select="*[local-name()='SummaryRecord']"/>
    <xsl:apply-templates select="*[local-name()='BriefRecord']"/>
    <xsl:apply-templates select="gmd:MD_Metadata"/>

</xsl:template>

<xsl:template match="cat:FullRecord">
    <xsl:apply-templates select="metadata"/>
</xsl:template>


<!-- Start Metadata ISO19139 -->
<xsl:template match="gmd:MD_Metadata">
    <!-- First the Identification block -->
    <xsl:apply-templates select="./gmd:identificationInfo/gmd:MD_DataIdentification"/>
    <xsl:apply-templates select="./gmd:distributionInfo/gmd:MD_Distribution"/>

	<table class="meta">
		<tr>
			<td class="meta-param">Mais info:</td>
			<td class="meta-value">
				<a>
				<xsl:attribute name="href">
				<xsl:text>javascript:csw_client.abreINDE</xsl:text>
				<xsl:text>('</xsl:text> 
				<xsl:value-of select="./gmd:fileIdentifier/gco:CharacterString"/>
				<xsl:text>')</xsl:text> 
				</xsl:attribute>
				<xsl:value-of select="./gmd:fileIdentifier/gco:CharacterString"/>
				<xsl:text> (abre em nova janela)</xsl:text>
				</a>
			</td>
		</tr>		  		  
	</table>
</xsl:template>

<!-- 'Identification' block -->
<xsl:template match="gmd:MD_DataIdentification">
<div class="captioneddiv">
<!--<h3>Identification info</h3>-->
<table class="meta"><tr></tr>
      <tr><td></td><td><hr></hr></td></tr>
	  <xsl:call-template name="tablerowBold">
		<xsl:with-param name="cname" select="'Título'"/>
		<xsl:with-param name="cvalue" select="./gmd:citation/gmd:CI_Citation/gmd:title/gco:CharacterString"/>
      </xsl:call-template>
      <tr>
      <td class="meta-param">Resumo:</td>
      <td class="meta-value">
		<xsl:apply-templates select="./gmd:abstract"/>
      </td>
      </tr>
	  <xsl:apply-templates select="./gmd:pointOfContact"/>
</table>
</div>
</xsl:template>

<!-- 'Identification->Point of Contact' block -->
<xsl:template match="gmd:pointOfContact">
      <tr>
		<td class="meta-param">Organização:</td>
		<td class="meta-value">
			<xsl:apply-templates select="./gmd:CI_ResponsibleParty/gmd:organisationName/gco:CharacterString"/>
		</td>
      </tr>
      <tr>
		<td class="meta-param">e-mail:</td>
		<td class="meta-value">
			<xsl:apply-templates select="./gmd:CI_ResponsibleParty/gmd:contactInfo/gmd:CI_Contact/gmd:address/gmd:CI_Address/gmd:electronicMailAddress/gco:CharacterString"/>
		</td>
      </tr>
	  
</xsl:template>

<!-- 'Distribution Info' block -->
<xsl:template match="gmd:MD_Distribution">
    <table class="meta">
	<xsl:for-each select="gmd:transferOptions/gmd:MD_DigitalTransferOptions/gmd:onLine/gmd:CI_OnlineResource">
  	    <xsl:choose>
  		    <xsl:when test="starts-with(./gmd:protocol/gco:CharacterString,'WWW:DOWNLOAD-') and contains(./gmd:protocol/gco:CharacterString,'http--download') and ./gmd:name/gco:CharacterString">
			    <tr>
			      <td class="meta-param">Download:</td>
			      <td class="meta-value">
			        <a><xsl:attribute name="href">
				     <xsl:value-of select="gmd:linkage/gmd:URL"/>
				   </xsl:attribute>
			           <xsl:value-of select="gmd:linkage/gmd:URL"/>
					</a>
			      </td>
			    </tr>
  		    </xsl:when>
  		    <xsl:when test="starts-with(./gmd:protocol/gco:CharacterString,'ESRI:AIMS-') and contains(./gmd:protocol/gco:CharacterString,'-get-image') and ./gmd:name/gco:CharacterString">
			    <tr>
			      <td class="meta-param">Esri ArcIms:</td>
			      <td class="meta-value">
			        <a><xsl:attribute name="href">
				     <xsl:value-of select="gmd:linkage/gmd:URL"/>
				   </xsl:attribute>
			           <xsl:value-of select="gmd:name/gco:CharacterString"/>
				</a>
			      </td>
			    </tr>
  		    </xsl:when>
  		    <xsl:when test="starts-with(./gmd:protocol/gco:CharacterString,'OGC:WMS-') and contains(./gmd:protocol/gco:CharacterString,'-get-map') and ./gmd:name/gco:CharacterString">
			    <tr>
			      <td class="meta-param">OGC-WMS:</td>
			      <td class="meta-value">
			        <a><xsl:attribute name="href">
				     <xsl:text>javascript:void(window.open('</xsl:text>
				     <xsl:value-of select="gmd:linkage/gmd:URL"/>
			         <xsl:text>'))</xsl:text>
					 </xsl:attribute>
			           <xsl:value-of select="gmd:name/gco:CharacterString"/>
				</a>
			      </td>
			    </tr>
  		    </xsl:when>
  		    <xsl:when test="starts-with(./gmd:protocol/gco:CharacterString,'OGC:WMS-') and contains(./gmd:protocol/gco:CharacterString,'-get-capabilities') and ./gmd:name/gco:CharacterString">
			    <tr>
			      <td class="meta-param">OGC-WMS Capabilities:</td>
			      <td class="meta-value">
			        <a><xsl:attribute name="href">
				     <xsl:value-of select="gmd:linkage/gmd:URL"/>
				   </xsl:attribute>
			           <xsl:value-of select="gmd:name/gco:CharacterString"/>
				</a>
			      </td>
			    </tr>
  		    </xsl:when>
  		    <!--xsl:when test="linkage[text()]">
  			    <link type="url"><xsl:value-of select="linkage[text()]"/></link>
  		    </xsl:when-->
  	    </xsl:choose>
    </xsl:for-each>
	</table>
</xsl:template>

<!-- 'Identification->Abstract -->
<xsl:template match="gmd:abstract">
	<xsl:apply-templates select="./gco:CharacterString/text()"/>
</xsl:template>


<!-- 'Identification' block -->
<xsl:template match="*[local-name()='Record']|*[local-name()='SummaryRecord']|*[local-name()='BriefRecord']">
      <xsl:call-template name="tablerow">
      <xsl:with-param name="cname" select="'Identifier'"/>
      <xsl:with-param name="cvalue" select="./dc:identifier"/>
      </xsl:call-template>
</xsl:template>


<xsl:template match="dct:abstract">
<!--xsl:value-of select="."/-->
<xsl:apply-templates select="text()"/>
</xsl:template>


<!-- Start Utills -->
<xsl:template  match="text()">
  <xsl:call-template name="to-para">
    <xsl:with-param name="from" select="'&#10;&#10;'"/>
    <xsl:with-param name="string" select="."/>
  </xsl:call-template>
</xsl:template> 

<!-- replace all occurences of the character(s) `from'
                   by  <p/> in the string `string'.-->
<xsl:template name="to-para" >
  <xsl:param name="string"/>
  <xsl:param name="from"/>
  <xsl:choose>
    <xsl:when test="contains($string,$from)">
      <xsl:value-of select="substring-before($string,$from)"/>
      <!-- output a <p/> tag instead of `from' -->
      <p/>
      <xsl:call-template name="to-para">
      <xsl:with-param name="string" select="substring-after($string,$from)"/>
      <xsl:with-param name="from" select="$from"/>
      </xsl:call-template>
    </xsl:when>
    <xsl:otherwise>
      <xsl:value-of select="$string"/>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>


<xsl:template name="tablerow" >
  <xsl:param name="cname"/>
  <xsl:param name="cvalue"/>
  <xsl:choose>
    <xsl:when test="string($cvalue)">
	<tr>
    <td class="meta-param"><xsl:value-of select="$cname"/><xsl:text>: </xsl:text></td>
    <td class="meta-value"><xsl:value-of select="$cvalue"/></td>
	</tr>
    </xsl:when>
    <xsl:otherwise>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

<xsl:template name="tablerowBold" >
  <xsl:param name="cname"/>
  <xsl:param name="cvalue"/>
  <xsl:choose>
    <xsl:when test="string($cvalue)">
	<tr>
    <td class="meta-param"><xsl:value-of select="$cname"/><xsl:text>: </xsl:text></td>
    <td class="meta-value"><b><xsl:value-of select="$cvalue"/></b></td>
	</tr>
    </xsl:when>
    <xsl:otherwise>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>
<!-- End Utills -->

</xsl:stylesheet>
