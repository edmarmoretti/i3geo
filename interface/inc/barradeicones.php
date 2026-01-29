    <div class="ol-i3GEOcontrols ol-control" data-traduzir="true">
        <!-- Para o botao de fullscreen e necessario uma funcao. Veja abaixo nas configuracoes o item afterStart -->
        <span class="i3GeoBgc2 hidden-xs" id="i3GEOFullscreen" style="cursor: pointer;" title="{{{d9}}}"> </span>
        <button class="i3GeoBgc2 hidden-xs" title='Zoom por box' onclick="i3GEO.Interface.zoomli()" data-tutorial="barranavegacao" style="float: left;">
            <i class="material-icons">zoom_in</i>
        </button>
        <br class="hidden-xs">
        <div class="clearfix"></div>
        <span class="i3GeoBgc2 hidden-xs" id="i3GEOzoomInOut" style="cursor: pointer;"></span>
        <button class="i3GeoBgc2 hidden-xs toggle" data-tutorial="marcador" title="{{{x79}}}" onclick="i3GEO.marcador.start(this)" style="float: left;">
            <i class="material-icons">bookmark_border</i>
        </button>
        <br class="hidden-xs">
        <button class="i3GeoBgc2 hidden-xs" title="{{{d2t}}}" onclick="i3GEO.Interface.zoom2ext(i3GEO.parametros.extentTotal)" style="float: left;">
            <i class="material-icons">public</i>
        </button>

        <br class="hidden-xs">
        <button class="i3GeoBgc2 hidden-xs" title="{{{volta}}}" onclick="i3GEO.navega.extensaoAnterior()" style="float: left;">
            <i class="material-icons">undo</i>
        </button>
        <button class="i3GeoBgc2 hidden-xs" title="{{{avanca}}}" onclick="i3GEO.navega.extensaoProximo()" style="float: left;">
            <i class="material-icons">redo</i>
        </button>
        <br class="hidden-xs">
        <button class="i3GeoBgc2 hidden-xs toggle" title="{{{graticule}}}" onclick="i3GEO.Interface.grade()" data-tutorial='grade' style="float: left;">
            <i class="material-icons">grid_on</i>
        </button>
        <button class="i3GeoBgc2 hidden-xs toggle" title="Spy" onclick="i3GEO.navega.basemapSpy.start()" style="float: left; cursor: pointer;">
            <i class="material-icons">highlight</i>
        </button>
        <br class="hidden-xs">
        <button class="i3GeoBgc2" title="GPS" onclick="i3GEO.geolocal.start()" style="float: left; cursor: pointer;">
            <i class="material-icons">gps_fixed</i>
        </button>
        <button class="i3GeoBgc2" title="{{{itensvisib}}}" onclick="i3GEO.mapa.itensvisib(['.check','.ol-i3GEOcontrols','.iconesGuiaMovel','.ol-attribution button','.escalanumerica','.localizarxy','.i3GEOfechaGuia'])" style="float: left; cursor: pointer;">
            <i class="material-icons">wallpaper</i>
        </button>
        <br class="hidden-xs">
        <button class="i3GeoBgc2 hidden-xs toggle" title="{{{d18t}}}" onclick="i3GEO.navega.lente.start()" style="float: left; cursor: pointer; ">
            <i class="material-icons">loupe</i>
        </button>
        <button class="i3GeoBgc2 hidden-xs toggle" data-tutorial="referencia" title="{{{d9}}}" onclick="i3GEO.maparef.inicia()" style="float: left; cursor: pointer;">
            <i class="material-icons">picture_in_picture</i>
        </button>
    </div>