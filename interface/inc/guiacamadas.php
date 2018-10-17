
<!-- camadas existentes no mapa -->
<div id='guia1obj' data-traduzir="true" style='display: none; height: 100%;'>
    <div class="i3GEOfechaGuia" style="display: flex;">
        <button class="pull-left text-left" onclick="i3GEO.guias.abreFecha('fecha');">
            <span style="vertical-align: middle">{{{iconeMapa}}}</span>
        </button>
        <div class="dropdown">
            <button title="{{{opcoes}}}" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span style="vertical-align: middle" class="material-icons">playlist_add_check</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
                <li><a onclick="i3GEO.arvoreDeCamadas.atualiza(i3GEO.arvoreDeCamadas.CAMADAS,true)" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-refresh"></span> Refresh
                    </a></li>
                <li><a onclick="i3GEO.arvoreDeCamadas.aplicaTemas('ligartodos')" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-eye-open"></span> {{{t3a}}}
                    </a></li>
                <li><a onclick="i3GEO.arvoreDeCamadas.aplicaTemas('desligartodos')" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-eye-close"></span> {{{t3b}}}
                    </a></li>
                <li><a onclick="i3GEO.arvoreDeCamadas.dialogo.excluir()" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-trash"></span> {{{t12}}}
                    </a></li>
                <li><a onclick="i3GEO.arvoreDeCamadas.dialogo.filtro()" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-filter"></span> {{{t2a}}}
                    </a></li>
                <li role="separator" class="divider"></li>
                <li><a onclick="i3GEO.temaAtivo='';i3GEO.mapa.dialogo.opacidade()" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-adjust"></span> {{{t20}}}
                    </a></li>
                <li><a onclick="i3GEO.mapa.dialogo.animacao()" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-film"></span> {{{p21}}}
                    </a></li>
                <li><a onclick="i3GEO.mapa.dialogo.imprimir()" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-print"></span> {{{d12}}}
                    </a></li>
                <li><a onclick="i3GEO.mapa.limpasel({verifica:true})" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-erase"></span> {{{t4}}}
                    </a></li>
                <li role="separator" class="divider"></li>
                <li><a onclick="i3GEO.mapa.dialogo.salvamapa()" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-floppy-save"></span> {{{u17}}}
                    </a></li>
                <li><a onclick="i3GEO.mapa.dialogo.carregamapa()" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-floppy-open"></span> {{{u18}}}
                    </a></li>
                <li><a onclick="i3GEO.mapa.dialogo.convertews()" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-globe"></span> {{{u20}}}
                    </a></li>
                <li><a onclick="i3GEO.mapa.dialogo.convertemapakml()" href="javascript:void(0)">
                        <span class="glyphicon glyphicon-globe"></span> {{{u20a}}}
                    </a></li>
            </ul>
        </div>
        <button title="{{{iconeCatalogo}}}" style="width: unset; height: 3rem;" class="text-right" onclick="i3GEO.guias.ativa('adiciona',this)" data-idconteudo="guia2obj"
            data-idMigalha="catalogoMigalha" data-idNavegacao="catalogoNavegacao" data-idCatalogo="catalogoPrincipal" data-idMenus="catalogoMenus">
            <span style="vertical-align: middle" class="material-icons">layers</span>
        </button>
        <button title="{{{iconeLegenda}}}" style="width: unset; height: 3rem;" class="text-right" onclick="i3GEO.guias.ativa('legenda',this)" data-idconteudo="guia4obj" data-idLegenda="legendaHtml">
            <span style="vertical-align: middle" class="material-icons">view_list</span>
        </button>
        <button style="width: unset; height: 3rem;" class="text-right" onclick="i3GEO.guias.abreFecha('fecha');">
            <span style="vertical-align: middle" class="material-icons">cancel</span>
        </button>
    </div>
    <div class="separadorCabecalhoGuias">&nbsp;</div>
    <div style="overflow-y: scroll; height: calc(100% - 45px);">
        <!-- Esta div acrescenta a lista de layers graficos -->
        <div id="listaLayersGr" style="width: calc(100% - 12px);overflow: none;" data-template="<?php echo $configInc["pathtemplates"];?>/camadaGr.html"></div>
        <!-- Esta div acrescenta a lista de camadas disponiveis no mapa atual -->
        <div id="listaTemas" style="width: calc(100% - 12px);overflow: none;" data-template="<?php echo $configInc["pathtemplates"];?>/camada.html"></div>
        <!-- Esta div acrescenta a lista de de camadas de fundo
                    A lista de camadas de fundo e obtida da variavel i3GEO.Interface.openlayers.LAYERSADICIONAIS
                    Essa variavel e definida via javascript, e no caso das interfaces padrao do i3Geo, e definida
                    no programa interface/config.php
                    -->
        <div style="width: calc(100% - 22px);overflow: none;" data-toggle="collapse" data-target="#collapseFundo" class="list-group condensed collapsed">
            <label>{{{camadasDeFundo}}}</label>
        </div>
        <div style="width: calc(100% - 22px);overflow: none;margin-left: 0px;" class="collapse text-left" id="collapseFundo">
            <form>
                <div id="listaFundo" class="form-group condensed" data-template="<?php echo $configInc["pathtemplates"];?>/camadaFundo.html"></div>
            </form>
        </div>
    </div>
</div>