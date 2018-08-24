<script id="templateLinksDownload" type="x-tmpl-mustache">
<h3>Download</h3>
<p>{{{linkpagina}}}: <a href="{{{url}}}?temaDownload={{{tema}}}">{{{url}}}?temaDownload={{{tema}}}</a>
<p>{{{sld}}}: <a href="{{{sldurl}}}" target="_blank" >{{{sldurl}}}</a>
<p><a href="{{{urli3geo}}}/fontetema.php?tema={{{tema}}}" target="_blank" >Metadata</a></p>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=shape-zip&bbox={{mapext}}&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}&typeName={{{tema}}}" >Shape File</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=csv&bbox={{mapext}}&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}&typeName={{{tema}}}&ows_geomtype=AS_WKT" >{{{downCgeo}}}</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=csv&bbox={{mapext}}&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}&typeName={{{tema}}}&ows_geomtype=none" >{{{downSgeo}}}</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=kmz&bbox={{mapext}}&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}&typeName={{{tema}}}" >{{{kmz}}}</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=kmlwms&bbox={{mapext}}&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}&typeName={{{tema}}}" >{{{kmlwms}}}</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=kml&bbox={{mapext}}&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}&typeName={{{tema}}}" >{{{kml}}}</a>
<p><a target=blank href="{{{servico}}}OUTPUTFORMAT=geojson&bbox={{mapext}}&service=wfs&version=1.1.0&request=getfeature&layers={{{tema}}}&typeName={{{tema}}}" >GeoJson</a>
<p><a target=blank href="{{{urli3geo}}}/ferramentas/recline/default.php?tema={{{tema}}}" >{{{explore}}}</a>
</script>