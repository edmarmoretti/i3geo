
<!-- Ferramentas -->
<div data-traduzir="true" id='guia8obj' style='display: none; text-align: left; height: 100%'>
    <div class="i3GEOfechaGuia" onclick="i3GEO.guias.abreFecha('fecha');">
        <button>
            <span class="pull-left">{{{iconeFerramentas}}}</span> <span class="pull-right material-icons">cancel</span>
        </button>
    </div>
    <div class="separadorCabecalhoGuias">&nbsp;</div>
    <div style="overflow-y: scroll; height: calc(100% - 45px);">
        <div class="form-inline" style="width: 100%;">
            <div class="text-center form-group" style="margin: 4px; display: inline-block">
                <a onclick="i3GEO.guias.abreFecha('fecha');i3GEO.analise.dialogo.area();" role="button" class="btn btn-success btn-fab btn-fab-max" href="javascript:void(0)">
                    <img style="margin-top: 4px;" src="../imagens/gisicons/area-measure.png">
                </a>
                <h6>{{{d21at}}}</h6>
            </div>
            <div class="text-center form-group" style="margin: 4px; display: inline-block">
                <a onclick="i3GEO.guias.abreFecha('fecha');i3GEO.analise.dialogo.distancia();" role="button" class="btn btn-success btn-fab btn-fab-max" href="javascript:void(0)">
                    <img style="margin-top: 4px;" src="../imagens/gisicons/length-measure.png">
                </a>
                <h6>{{{d21t}}}</h6>
            </div>
            <div class="text-center form-group" style="margin: 4px; display: inline-block">
                <a onclick="i3GEO.guias.abreFecha('fecha');i3GEO.mapa.dialogo.geolocal();" role="button" class="btn btn-success btn-fab btn-fab-max" href="javascript:void(0)">
                    <img style="margin-top: 4px;" src="../imagens/gisicons/layer-gps.png">
                </a>
                <h6>{{{localiza}}}</h6>
            </div>
        </div>
        <div class="clearfix"></div>
        <div id="searchInputFerramentas" data-template="<?php echo $configInc["pathtemplates"];?>/searchInput.html" style='display: block; text-align: center; width: 100%; padding-left: 1rem; padding-right: 1rem;'></div>
        <div id="migalhaFerramentas" data-template="<?php echo $configInc["pathtemplates"];?>/ferramentasMigalha.html" style='display: block; text-align: left;'></div>
        <div id="listaFerramentasLinks" data-template="<?php echo $configInc["pathtemplates"];?>/ferramentasLink.html" style='display: block; text-align: left'></div>
        <div id="listaFerramentas" data-template="<?php echo $configInc["pathtemplates"];?>/ferramentasFolder.html" style='display: block; text-align: left'></div>
    </div>
</div>