<?xml version="1.0"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0" 
 xmlns:dc="http://purl.org/dc/elements/1.1/"
 xmlns:dct="http://purl.org/dc/terms/">
<!--xsl:output method="html" encoding="ISO-8859-1"/-->


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
  <ol>
    <xsl:attribute name="start">
      <xsl:value-of select="$start"/>
    </xsl:attribute>
    <xsl:for-each select="./*[local-name()='SummaryRecord']|./*[local-name()='BriefRecord']|./*[local-name()='Record']">
     <li>
      <strong><xsl:text>Title: </xsl:text></strong>
      <a>
      <xsl:attribute name="href">
        <xsl:text>javascript:(csw_client.getRecordById</xsl:text>
        <xsl:text>('</xsl:text> 
        <xsl:value-of select="./dc:identifier"/>
        <xsl:text>'))</xsl:text> 
      </xsl:attribute>
      <xsl:choose>
        <xsl:when test="./dc:title">
    	  <xsl:apply-templates select="./dc:title"/>
        </xsl:when>
        <xsl:otherwise>
    	  <xsl:text> ...</xsl:text>
        </xsl:otherwise>
      </xsl:choose>
      </a>
      <br/>
      <xsl:apply-templates select="./dct:abstract"/>
      <br/>
      <strong><xsl:text>Keywords: </xsl:text></strong>
      <xsl:for-each select="./dc:subject">
        <xsl:if test=".!=''">
            <xsl:if test="position() &gt; 1">, </xsl:if>
            <i><xsl:value-of select="."/></i>
        </xsl:if>
      </xsl:for-each>
      <hr/>
      </li>
  </xsl:for-each> 
  </ol> 
</div>
</xsl:template>

<xsl:template match="dc:title">
  <xsl:choose>
    <xsl:when test=".!=''">
      <xsl:value-of select="."/>
    </xsl:when>
    <xsl:otherwise>
      <xsl:text> ...</xsl:text>
    </xsl:otherwise>
  </xsl:choose>
</xsl:template>

<xsl:template match="dct:abstract">
    <strong><xsl:text>Abstract: </xsl:text></strong>
    <xsl:value-of select="substring(.,1,250)"/>
    <xsl:text> ...</xsl:text>
    <a>
      <xsl:attribute name="href">
        <xsl:text>javascript:(csw_client.getRecordById</xsl:text>
	    <xsl:text>('</xsl:text>
        <xsl:value-of select="../dc:identifier"/>
        <xsl:text>'))</xsl:text> 
      </xsl:attribute>
      <xsl:text> more</xsl:text>
    </a>
</xsl:template>

</xsl:stylesheet>
