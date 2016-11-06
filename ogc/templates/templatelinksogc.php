<script id="templateLinksOgc" type="x-tmpl-mustache">
<h3>OGC</h3>
<p>{{{linkpagina}}}: <a href="{{{urli3geo}}}/ogc/index.php?temaOgc={{{tema}}}">{{{urli3geo}}}/ogc/index.php?temaOgc={{{tema}}}</a>
<p>{{{wstodas}}}: <a href="{{{servico}}}" target="_blank" >{{{servico}}}</a>
<p>{{{wscamada}}}: <a href="{{{servico}}}tema={{{tema}}}&" target="_blank" >{{{servico}}}tema={{{tema}}}&</a>
<p><a href="{{{urli3geo}}}/fontetema.php?tema={{{tema}}}" target="_blank" >Metadata</a></p>
<p><a target=blank href="{{{servico}}}service=wms&version=1.1.1&request=getcapabilities&layers={{{tema}}}{{{id_medida_variavel}}}" >GetCapabilities</a>
<p><a target=blank href="{{{servico}}}SRS=EPSG:4618&WIDTH=500&HEIGHT=500&BBOX={{mapext}}&FORMAT=image/png&service=wms&version=1.1.0&request=getmap&layers={{{tema}}}" >{{{getmap}}}</a>
<p><a target=blank href="{{{servico}}}SRS=EPSG:4618&WIDTH=500&HEIGHT=500&BBOX={{mapext}}&FORMAT=image/png&service=wms&version=1.1.0&request=getlegendgraphic&layers={{{tema}}}" >{{{legenda}}}</a>
<p><a target=blank href="{{{servico}}}format=application/openlayers&bbox={{mapext}}&layers={{{tema}}}" >{{{vOl}}}</a>
</script>