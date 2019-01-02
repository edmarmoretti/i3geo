    <div class="ol-i3GEOcontrols ol-control" data-traduzir="true">
        <button class="i3GeoBgc1 hidden-xs" onclick="$('.ol-i3GEOcontrols .toggle').toggle();" style="float: left;">
            <i class="material-icons">menu</i>
        </button>
        <!-- Para o botao de fullscreen e necessario uma funcao. Veja abaixo nas configuracoes o item afterStart -->
        <span class="hidden-xs" id="i3GEOFullscreen" style="cursor: pointer;" title="{{{d9}}}"> </span>
        <button class="i3GeoBgc2 hidden-xs toggle" data-tutorial="referencia" title="{{{d9}}}" onclick="i3GEO.maparef.inicia()" style="float: left; cursor: pointer; display: none;">
            <i class="material-icons">picture_in_picture</i>
        </button>
        <button class="i3GeoBgc2 hidden-xs toggle" title="{{{d11t}}}" onclick="i3GEO.navega.dialogo.wiki()" style="float: left; cursor: pointer; display: none;">
            <img style="width:20px;" src="{{{locaplic}}}/imagens/wwikipedia.png">
        </button>

        <br class="hidden-xs">
        <div class="clearfix"></div>
        <span class="hidden-xs" id="i3GEOzoomInOut" style="cursor: pointer;"></span>
        <button class="i3GeoBgc2 hidden-xs toggle" data-tutorial="marcador" title="{{{x79}}}" onclick="i3GEO.marcador.start(this)" style="float: left; display: none;">
            <i class="material-icons">bookmark_border</i>
        </button>
        <button class="i3GeoBgc2 hidden-xs toggle" title="{{{d15t}}}" onclick="i3GEO.navega.dialogo.googlemaps()" style="float: left; cursor: pointer; display: none;">
            <img style="width:20px;" src="{{{locaplic}}}/imagens/googlemaps.png">
        </button>

        <br class="hidden-xs">
        <button class="i3GeoBgc1 hidden-xs" title="{{{d2t}}}" onclick="i3GEO.Interface.zoom2ext(i3GEO.parametros.extentTotal)" style="float: left;">
            <i class="material-icons">public</i>
        </button>
        <button class="i3GeoBgc1 hidden-xs" onclick="i3GEO.Interface.zoomli()" data-tutorial="barranavegacao" style="float: left;">
            <i class="material-icons">zoom_in</i>
        </button>
        <button class="i3GeoBgc2 hidden-xs toggle" title="{{{graticule}}}" onclick="i3GEO.Interface.grade()" data-tutorial='grade' style="float: left; display: none;">
            <i class="material-icons">grid_on</i>
        </button>
        <button class="i3GeoBgc2 hidden-xs toggle" title="{{{d17}}}" onclick="i3GEO.navega.dialogo.confluence()" style="float: left; cursor: pointer; display: none;">
            <img style="width:20px;" src="{{{locaplic}}}/imagens/confluence.png">
        </button>

        <br class="hidden-xs">
        <button class="i3GeoBgc1 hidden-xs" title="{{{volta}}}" onclick="i3GEO.navega.extensaoAnterior()" style="float: left;">
            <i class="material-icons">undo</i>
        </button>
        <button class="i3GeoBgc1 hidden-xs" title="{{{avanca}}}" onclick="i3GEO.navega.extensaoProximo()" style="float: left;">
            <i class="material-icons">redo</i>
        </button>
        <button class="i3GeoBgc2 hidden-xs toggle" title="Spy" onclick="i3GEO.navega.basemapSpy.start()" style="float: left; cursor: pointer; display: none;">
            <i class="material-icons">highlight</i>
        </button>
        <button class="i3GeoBgc2 hidden-xs toggle"  style="visibility: hidden; float: left; display: none;">
        </button>

        <br class="hidden-xs">
        <button class="i3GeoBgc1" title="GPS" onclick="i3GEO.geolocal.start()" style="float: left; cursor: pointer;">
            <i class="material-icons">gps_fixed</i>
        </button>
        <button class="i3GeoBgc1" title="{{{itensvisib}}}" onclick="i3GEO.mapa.itensvisib(['.check','.ol-i3GEOcontrols','.iconesGuiaMovel','.ol-attribution button','.escalanumerica','.localizarxy','.i3GEOfechaGuia'])" style="float: left; cursor: pointer;">
            <i class="material-icons">wallpaper</i>
        </button>
        <button class="i3GeoBgc2 hidden-xs toggle" title="{{{d18t}}}" onclick="i3GEO.navega.lente.start()" style="float: left; cursor: pointer; display: none;">
            <i class="material-icons">loupe</i>
        </button>
    </div>