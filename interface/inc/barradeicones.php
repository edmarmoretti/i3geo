    <div class="ol-i3GEOcontrols ol-control" data-traduzir="true">
        <button onclick="$('.ol-i3GEOcontrols .toggle').toggle();" style="float: left;">
            <i class="material-icons">menu</i>
        </button>
        <!-- Para o botao de fullscreen e necessario uma funcao. Veja abaixo nas configuracoes o item afterStart -->
        <span id="i3GEOFullscreen" style="cursor: pointer;" title="{{{d9}}}"> </span>
        <button class="toggle" data-tutorial="referencia" title="{{{d9}}}" onclick="i3GEO.maparef.inicia()" style="float: left; cursor: pointer; display: none;">
            <i class="material-icons">picture_in_picture</i>
        </button>
        <br>
        <div class="clearfix"></div>
        <span id="i3GEOzoomInOut" style="cursor: pointer;"></span>
        <button class="toggle" data-tutorial="marcador" title="{{{x79}}}" data-template="templates/ferramentasSend.html" onclick="i3GEO.marcador.inicia(this)" style="float: left; display: none;">
            <i class="material-icons">bookmark_border</i>
        </button>
        <br>
        <button title="{{{d2t}}}" onclick="i3GEO.Interface.zoom2ext(i3GEO.parametros.extentTotal)" style="float: left;">
            <i class="material-icons">public</i>
        </button>
        <button onclick="i3GEO.Interface.zoomli()" data-tutorial="barranavegacao" style="float: left;">
            <i class="material-icons">zoom_in</i>
        </button>
        <button class="toggle" title="{{{graticule}}}" onclick="i3GEO.Interface.grade()" data-tutorial='grade' style="float: left; display: none;">
            <i class="material-icons">grid_on</i>
        </button>
        <br>
        <button title="{{{volta}}}" onclick="i3GEO.navega.extensaoAnterior()" style="float: left;">
            <i class="material-icons">undo</i>
        </button>
        <button title="{{{avanca}}}" onclick="i3GEO.navega.extensaoProximo()" style="float: left;">
            <i class="material-icons">redo</i>
        </button>
        <button class="toggle" title="Spy" onclick="i3GEO.navega.basemapSpy.start()" style="float: left; cursor: pointer; display: none;">
            <i class="material-icons">highlight</i>
        </button>
        <br>
        <button class="toggle" title="GPS" onclick="i3GEO.navega.geolocal.start()" style="float: left; cursor: pointer; display: none;">
            <i class="material-icons">gps_fixed</i>
        </button>
        <button class="<?php echo $configInc["tipo"] == "OL" ? "hidden":""; ?> toggle" title="{{{d18t}}}" onclick="i3GEO.navega.lente.start()" style="float: left; cursor: pointer; display: none;">
            <i class="material-icons">loupe</i>
        </button>
    </div>