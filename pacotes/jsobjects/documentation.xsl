<?xml version="1.0" encoding="UTF-8" ?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform">
	<xsl:template name="JSCRIPT">
		<script>
				<![CDATA[
				var currname = "";
				var currparams = new Array();
				var pcount = 0;
				if (document.all)
					browser = "IE";
				else
					browser = "MOZ";
					
				function getParams(param)
				{
					currparams[pcount] = param;
					pcount=pcount + 1;		
				}
				function getCode(name, obj)
				{
					currname = name.split("(");
					var parampart = currname[1];
					parampart = parampart.replace(")", "")
					parampart = parampart.split(",");
				
					for (i = 0; i < parampart.length; i++) 
					{
						parampart[i] = "<br/><font color='#c0c0c0'>.....</font>" + parampart[i].replace(" ", "") + " <b>" + currparams[i] + "</b>"
					}

					currname = "<b>" + currname[0] + "</b>(" + parampart + "<br/>);";
					if (document.all)						
						document.writeln(currname);
					else
						document.getElementById(obj).innerHTML = currname;
				}
				function getFunction(name, obj)
				{
						if(name.indexOf("(") != "-1")
						{
							currname = name.split("(");
							var parampart = currname[1];
							parampart = parampart.replace(")", "")
							parampart = parampart.split(",");
		
							currname = "<b>" + currname[0] + "</b>(" + parampart + ");";
							if (document.all)
								document.writeln(currname);
							else
								document.getElementById(obj).innerHTML = currname;
						}
						else
						{
							if (document.all)
								document.writeln("");
						}
				}
				function getName(name)
				{
					currname = name.split("(");
					document.writeln (currname[0]);
				}
				function resetCount()
				{
					pcount = 0;
					return "";
				}
				]]>

		</script>
	</xsl:template>
	<xsl:template match="doc">
		
		<html>
			<head>
				<title>
					<xsl:value-of select="assembly/name" /> Library Documentation</title>
				<link rel='stylesheet' type='text/css' href='../documentation.css'></link>
				<LINK REL="shortcut icon" HREF="../images/jsobjects-s.ico" TYPE="image/x-icon"/>
				<xsl:call-template name="JSCRIPT"/>
			</head>
			<body marginheight="0" marginwidth="0" topmargin="0" leftmargin="0" vlink="#0000ff" link="#0000ff" alink="#0000ff">
				<div class="header" width="100%">
					<table border="0" width="98%" cellpadding="0" cellspacing="0">
					<tr><td>
						<b>
							<i>
								<span style="FONT-SIZE: 10pt"><xsl:value-of select="assembly/name" /> Library Documentation</span>
							</i>
						</b>
						<br />
					</td>
					<td align="right">
						<a style="color:white" href="../index.htm">Home</a>
					</td>
				</tr>
			</table>
		</div>
		<xsl:if test="assembly/remarks">
			<blockquote class="details">
				<b>Remarks</b>
				<ul>
					<li>
						<xsl:if test="count(assembly/remarks/para) > 0">
							<xsl:for-each select="assembly/remarks/para">
								<xsl:value-of select="." />
								<br />
							</xsl:for-each>
						</xsl:if>
						<xsl:if test="count(assembly/remarks/para) = 0">
							<xsl:value-of select="assembly/remarks" />
						</xsl:if>
					</li>
				</ul>
			</blockquote>
		</xsl:if>
		<xsl:if test="assembly/requirements">
			<blockquote class="details">
				<b>Requirements</b>
				<ul>
					<li>
						<xsl:if test="count(assembly/requirements/para) > 0">
							<xsl:for-each select="assembly/requirements/para">
								<xsl:value-of select="." />
								<br />
							</xsl:for-each>
						</xsl:if>
						<xsl:if test="count(assembly/requirements/para) = 0">
							<xsl:value-of select="assembly/requirements" />
						</xsl:if>
					</li>
				</ul>
			</blockquote>
		</xsl:if>
		<xsl:if test="assembly/code">
			<blockquote class="details">
				<b>Sample Code</b>
				<br />
				<ul>
					<li class="code">
						<xsl:if test="count(assembly/code/c) > 0">
							<xsl:for-each select="assembly/code/c">
								<xsl:value-of select="." />
								<br />
							</xsl:for-each>
						</xsl:if>
						<xsl:if test="count(assembly/code/c) = 0">
							<xsl:value-of select="assembly/code" />
						</xsl:if>
					</li>
				</ul>
			</blockquote>
		</xsl:if>
		<xsl:if test="assembly/sample">
			<blockquote class="details">
				<b>
					<a>
						<xsl:attribute name="href">
							<xsl:value-of select="assembly/sample"/>
						</xsl:attribute>
						Sample Implementation
					</a>
				</b>
			</blockquote>
		</xsl:if>
		<div class="header" width="100%">
			<table border="0" width="95%" cellpadding="0" cellspacing="0">
				<tr>
					<td>
						<b>
							<span style="font-size: 10pt">
								<a name="members"> Members</a>
							</span>
						</b>
					</td>
				</tr>
			</table>
		</div>
		<!--Table of Contents-->
				<blockquote class="toc">
					<table bgcolor="#A0A0A0" border="0" cellspacing="1" align="center" class="ftable" style="padding:0px">
						<tr>
							<th class="ftable" align="left" bgcolor="#D0D0D0">Type</th>
							<th class="ftable" align="left" bgcolor="#D0D0D0">Member</th>
							<th class="ftable" align="left" bgcolor="#D0D0D0">Description</th>
						</tr>
						<xsl:for-each select="//member">
							<xsl:sort order="ascending" select="name(../.)"/>
							<xsl:sort order="ascending" select="@name" />
							<tr>
								<td class="ftable" bgcolor="#FFFFFF" valign="top">
									<b>
										<xsl:value-of select="name(../.)"/>
									</b>
								</td>
								<td class="ftable" bgcolor="#FFFFFF" width="50%" valign="top">
									<a>
										<xsl:attribute name="href">#<xsl:value-of select="@name" /></xsl:attribute>
										<xsl:value-of select="@name" />
									</a>
									<xsl:if test="@private='true'">
										<i> private</i>
									</xsl:if>
								</td>
								<td class="ftable" bgcolor="#FFFFFF" width="50%" valign="top">
									<xsl:value-of select="summary" />
								</td>
							</tr>
						</xsl:for-each>
					</table>
					<br/>
				</blockquote>
				<hr style="page-break-before: always" size="0" color="#FFFFFF" />
				<!--Each Function-->
				<xsl:for-each select="//member">
					<xsl:sort order="ascending" select="@name" />
					<div class="header" width="100%">
						<table border="0" width="98%" cellpadding="0" cellspacing="0">
							<tr>
								<td>
									<b>
									<a>
										<xsl:attribute name="name">
											<xsl:value-of select="@name" />
										</xsl:attribute>
										<xsl:value-of select="@name" />
									</a>
									</b>
									<xsl:if test="@private='true'">
										<i> Private</i>
									</xsl:if>
									<xsl:value-of select= "concat(' ',name(../.))"/>
								</td>
								<td align="right">
									<a style="color:white" href="#members">Contents</a>
								</td>
							</tr>
						</table>
					</div>
					
						<!--Summary-->
						<ul>
							<li>
								<xsl:if test="count(summary/para) > 0">
									<xsl:for-each select="summary/para">
										<xsl:value-of select="." />
										<br />
									</xsl:for-each>
								</xsl:if>
								<xsl:if test="count(summary/para) = 0">
									<xsl:value-of select="summary" />
								</xsl:if>
							</li>
							<!--Function Code Segment-->
							<xsl:if test="contains(@name, '(')">
							<li></li>
							<li>
								<div class="function">
									<xsl:attribute name="id">
										<xsl:value-of select="@name" />
									</xsl:attribute>
									<script>resetCount()</script>
									<xsl:if test="count(param) > 0">
										<xsl:for-each select="param">
											<script>getParams('<xsl:value-of select="@name" />');</script>
										</xsl:for-each>
										<script>getCode('<xsl:value-of select="@name" />', '<xsl:value-of select="@name"/>');</script>
									</xsl:if>
									<xsl:if test="count(param) = 0">
										<script>getFunction('<xsl:value-of select="@name" />', '<xsl:value-of select="@name"/>')</script>
									</xsl:if>
								</div>
							</li>
							</xsl:if>
						</ul>
					<blockquote class="details">
						<!--Parameters Segment-->
						<xsl:if test="count(param) > 0">
							<b>Parameters</b>
							<ul>
								<xsl:for-each select="param">
									<li>
										<i>
											<xsl:value-of select="@name" />
										</i>
									</li>
									<ul>
										<li>
											<xsl:if test="count(para) > 0">
												<xsl:for-each select="para">
													<xsl:value-of select="." />
													<br />
												</xsl:for-each>
											</xsl:if>
											<xsl:if test="count(para) = 0">
												<xsl:value-of select="." />
											</xsl:if>
										</li>
									</ul>
								</xsl:for-each>
							</ul>
						</xsl:if>
						<!--Returns Segment-->
						<xsl:if test="default">
							<b>Default</b>
							<br />
							<ul>
								<li>
									<xsl:value-of select="default" />
								</li>
							</ul>
						</xsl:if>
						<!--Returns Segment-->
						<xsl:if test="returns">
							<b>Returns</b>
							<br />
							<ul>
								<li>
									<xsl:if test="count(returns/para) > 0">
										<xsl:for-each select="returns/para">
											<xsl:value-of select="." />
											<br />
										</xsl:for-each>
									</xsl:if>
									<xsl:if test="count(returns/para) = 0">
										<xsl:value-of select="returns" />
									</xsl:if>
								</li>
							</ul>
						</xsl:if>
						<!--Sample Code By Itself-->
						<xsl:if test="code">
							<b>Sample Code</b>
							<br />
							<ul>
								<li class="code">
									<xsl:if test="count(code/c) > 0">
										<xsl:for-each select="code/c">
											<xsl:value-of select="." />
											<br />
										</xsl:for-each>
									</xsl:if>
									<xsl:if test="count(code/c) = 0">
										<xsl:value-of select="code" />
									</xsl:if>
								</li>
							</ul>
						</xsl:if>
						<!--Remarks-->
						<xsl:if test="remarks">
							<b>Remarks</b>
							<br />
							<ul>
								<li>
									<xsl:if test="count(remarks/para) > 0">
										<xsl:for-each select="remarks/para">
											<xsl:value-of select="." />
											<br />
										</xsl:for-each>
									</xsl:if>
									<xsl:if test="count(remarks/para) = 0">
										<xsl:value-of select="remarks" />
									</xsl:if>
								</li>
							</ul>
							<!--Example Code within remarks-->
							<xsl:if test="example">
								<b>Example</b>
								<br />
								<ul>
									<li class="code">
										<xsl:if test="count(example/c) > 0">
											<xsl:for-each select="example/c">
												<xsl:value-of select="." />
												<br />
											</xsl:for-each>
										</xsl:if>
										<xsl:if test="count(example/c) = 0">
											<xsl:value-of select="example" />
										</xsl:if>
									</li>
								</ul>
							</xsl:if>
						</xsl:if>
						<!--See Also-->
						<xsl:if test="count(seealso) > 0">
							<b>See Also</b>
							<br />
							<ul>
								<xsl:for-each select="seealso">
									<li>
										<a>
											<xsl:attribute name="href">#<xsl:value-of select="@cref" /></xsl:attribute>
											<xsl:value-of select="@cref" />
										</a>
									</li>
								</xsl:for-each>
							</ul>
						</xsl:if>
					</blockquote>
					<hr style="page-break-before: always" size="0" color="#FFFFFF" />
				</xsl:for-each>
				<br />
				<div class="footer">
					© 2005 Jonathan Wise. <a href="license.txt">Some rights reserved</a>.
				</div>
				<br />
			</body>
		</html>
	</xsl:template>
</xsl:stylesheet>