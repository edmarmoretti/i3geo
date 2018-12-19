<!-- Legenda -->
<div data-traduzir="true" id='guia4obj' style='display: none; text-align: left; height: 100%;'>
    <div class="i3GeoBgc2 i3GEOfechaGuia" style="display: flex;">
        <button class="pull-left text-left" onclick="i3GEO.legenda.off('legendaHtml');i3GEO.guias.abreFecha('fecha');">
            <span style="vertical-align: middle">{{{iconeLegenda}}}</span>
        </button>
        <button type="button" title="{{{x11}}}" style="width: 3.5rem; height: 3rem;" class="text-right" onclick="i3GEO.legenda.inicia({'janela':true})">
            <span style="vertical-align: middle" class="material-icons">list_alt</span>
        </button>
        <button title="{{{iconeMapa}}}" style="width: unset; height: 3rem;" class="text-right" onclick="i3GEO.guias.ativa('temas',this)" data-verificaAbrangencia="" data-idconteudo="guia1obj"
            data-idListaFundo="listaFundo" data-idListaDeCamadas="listaTemas">
            <span style="vertical-align: middle" class="material-icons">visibility</span>
        </button>
        <button title="{{{iconeCatalogo}}}" style="width: unset; height: 3rem;" class="text-right" onclick="i3GEO.guias.ativa('adiciona',this)" data-idconteudo="guia2obj"
            data-idMigalha="catalogoMigalha" data-idNavegacao="catalogoNavegacao" data-idCatalogo="catalogoPrincipal" data-idMenus="catalogoMenus">
            <span style="vertical-align: middle" class="material-icons">layers</span>
        </button>
        <button style="width: unset; height: 3rem;" class="text-right" onclick="i3GEO.legenda.off('legendaHtml');i3GEO.guias.abreFecha('fecha');">
            <span style="vertical-align: middle" class="material-icons">cancel</span>
        </button>
    </div>

    <div class="separadorCabecalhoGuias">&nbsp;</div>
    <div style="overflow-y: scroll; height: calc(100% - 45px);">
        <div id="legendaHtml" data-template="<?php echo $configInc["pathtemplates"];?>/legenda.html" data-size="35,25" style='display: none; text-align: left'></div>
    </div>
</div>