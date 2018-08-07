
<!-- Catalogo de temas -->
<div id='guia2obj' data-traduzir="true" style='display: none; text-align: left; height: 100%;'>
    <div class="i3GEOfechaGuia" style="display: flex;">
        <button class="pull-left text-left" onclick="i3GEO.guias.abreFecha('fecha');i3GEO.catalogoMenus.mostraCatalogoPrincipal();">
            <span style="vertical-align: middle">{{{iconeCatalogo}}}</span>
        </button>
        <div class="dropdown">
            <button title="{{{opcoes}}}" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                <span style="vertical-align: middle" class="material-icons">playlist_add_check</span>
            </button>
            <ul class="dropdown-menu dropdown-menu-right">
                <li><a onclick="i3GEO.login.recarrega = false; i3GEO.login.dialogo.abreLogin();" href="javascript:void(0)" data-toggle="modal" data-target="#modalLogin">
                        <span class="glyphicon glyphicon-log-in"></span> Login/Logout
                    </a></li>
                <li><a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.dialogo.downloadbase()">
                        <span class="glyphicon glyphicon-cloud-download"></span> {{{a3}}}
                    </a></li>
                <li><a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.dialogo.importarwmc()">
                        <span class="glyphicon glyphicon-import"></span> {{{a3a}}}
                    </a></li>
                <li><a href="javascript:void(0)" onclick="i3GEO.arvoreDeTemas.dialogo.buscaInde()">
                        <span class="glyphicon glyphicon-search"></span> Busca na INDE
                    </a></li>
                <li><a href="http://localhost/i3geo/kml.php?tipoxml=kml" target="_blank">
                        <span class="glyphicon glyphicon-import"></span> {{{a13}}}
                    </a></li>
            </ul>
        </div>
        <button title="{{{iconeMapa}}}" style="width: unset; height: 3rem;" class="text-right" onclick="i3GEO.guias.ativa('temas',this)" data-verificaAbrangencia="" data-idconteudo="guia1obj"
            data-idListaFundo="listaFundo" data-idListaDeCamadas="listaTemas" data-idListaLayersGr="listaLayersGr" data-idBtnLayersGr="listaLayersGrBtn">
            <span style="vertical-align: middle" class="material-icons">visibility</span>
        </button>
        <button title="{{{iconeLegenda}}}" style="width: unset; height: 3rem;" class="text-right" onclick="i3GEO.guias.ativa('legenda',this)" data-idconteudo="guia4obj" data-idLegenda="legendaHtml">
            <span style="vertical-align: middle" class="material-icons">view_list</span>
        </button>
        <button style="width: unset; height: 3rem;" class="text-right" onclick="i3GEO.guias.abreFecha('fecha');i3GEO.catalogoMenus.mostraCatalogoPrincipal();">
            <span style="vertical-align: middle" class="material-icons">cancel</span>
        </button>
    </div>
    <div class="separadorCabecalhoGuias">&nbsp;</div>

    <div style="overflow-y: scroll; height: calc(100% - 45px);">
        <div id="catalogoMigalha" style="display: block;" data-template="<?php echo $configInc["pathtemplates"];?>/catalogoMigalha.html"></div>
        <!-- aqui entra a lista de elementos quando uma das opcoes e clicada -->
        <div id="catalogoNavegacao"></div>
        <!-- Opcoes -->
        <div id="catalogoPrincipal">
            <hr>
            <!-- busca tema no catalogo
                        <div class="form-group label-floating">
                            <label class="control-label" for="i3GEObuscatema">{{{a1}}}</label>
                            <div class="input-group">
                                <input id="i3GEObuscatema" class="form-control" type="text" value="">
                                <span class="input-group-btn">
                                    <a onclick="i3GEO.arvoreDeTemas.buscaTema2($i('i3GEObuscatema').value);return false;" role="button" type="button" class="btn btn-warning btn-fab btn-fab-max" href="javascript:void(0)">
                                        <span class="material-icons ">send</span>
                                    </a>
                                </span>
                            </div>
                        </div>
                         -->
            <!-- A lista de menus e uma funcao de i3GEO.guias.CONFIGURA.adiciona
                            Nessa funcao ficam tambem os parametros:
                            "idOndeMenus": "catalogoMenus",
                            "idCatalogoPrincipal": "catalogoPrincipal",
                            "idCatalogoNavegacao": "catalogoNavegacao",
                            "idOndeMigalha": "catalogoMigalha"
                        -->
            <div id="catalogoMenus" data-templateDir="<?php echo $configInc["pathtemplates"];?>/dir.html" data-templateTema="<?php echo $configInc["pathtemplates"];?>/tema.html"></div>

            <div id="arvoreAdicionaTema"></div>

            <!--
                        As funcoes de inicializacao recebem um objeto com parametros. Que por padrao sao:
                        config: {
                            'templateDir': '<?php echo $configInc["pathtemplates"];?>/dir.html',
                            'templateTema': '<?php echo $configInc["pathtemplates"];?>/tema.html',
                            'idCatalogoPrincipal': 'catalogoPrincipal',
                            'idCatalogoNavegacao': 'catalogoNavegacao',
                            'idOndeMigalha': 'catalogoMigalha'
                        }

                        exemplo:

                        onclick="i3GEO.catalogoInde.inicia({'templateDir': '<?php echo $configInc["pathtemplates"];?>/dir.html','templateTema': '<?php echo $configInc["pathtemplates"];?>/tema.html','idCatalogoPrincipal':'catalogoPrincipal','idCatalogoNavegacao':'catalogoNavegacao','idOndeMigalha':'catalogoMigalha'})"
                        -->

            <!-- servicos da INDE brasileira -->
            <div class="list-group condensed">
                <div class="row-content text-left" style="opacity: 0.8;">
                    <label style="width: 300px; vertical-align: middle;">
                        <a onclick="i3GEO.catalogoInde.inicia()" role="button" href="javascript:void(0)">
                            <h4>
                                <i class="material-icons" style="vertical-align: text-bottom;">cloud_queue</i> INDE-Br
                            </h4>
                        </a>
                        <h6>Infraestrutura Nacional de Dados Espaciais do Brasil</h6>
                    </label>
                    <a onclick="i3GEO.catalogoInde.inicia()" role="button" class="" href="javascript:void(0)">
                        <i style="margin-bottom: 10px; margin-top: 10px;" class="pull-right material-icons">navigate_next</i>
                    </a>
                </div>
            </div>
            <hr>
            <!-- lista de wms cadastrados no sistema de administracao -->
            <div class="list-group condensed">
                <div class="row-content text-left" style="opacity: 0.8;">
                    <label style="width: 300px; vertical-align: middle;">
                        <a onclick="i3GEO.catalogoOgc.inicia()" role="button" href="javascript:void(0)">
                            <h4>
                                <i class="material-icons" style="vertical-align: text-bottom;">cloud_queue</i> Webservices
                            </h4>
                        </a>
                        <h6>{{{descws}}}</h6>
                    </label>
                    <a onclick="i3GEO.catalogoOgc.inicia();return false;" role="button" class="" href="javascript:void(0)">
                        <i style="margin-bottom: 10px; margin-top: 10px;" class="pull-right material-icons">navigate_next</i>
                    </a>
                </div>
            </div>
            <hr>
            <!--  regioes cadastradas no sistema de metadados -->
            <div class="list-group condensed">
                <div class="row-content text-left">
                    <label style="width: 300px; vertical-align: middle;">
                        <a onclick="i3GEO.catalogoRegioes.inicia()" role="button" href="javascript:void(0)">
                            <h4>
                                <i class="material-icons" style="vertical-align: text-bottom;">domain</i> {{{x87}}}
                            </h4>
                        </a>
                        <h6>{{{descLimLoc}}}</h6>
                    </label>
                    <a onclick="i3GEO.catalogoRegioes.inicia();" role="button" class="" href="javascript:void(0)">
                        <i style="opacity: 0.8; margin-bottom: 10px; margin-top: 10px;" class="pull-right material-icons">navigate_next</i>
                    </a>
                </div>
            </div>
            <hr>
            <!--  camadas que vem do sistema de metadados estatisticos -->
            <div class="list-group condensed">
                <div class="row-content text-left" style="opacity: 0.8;">
                    <label style="width: 300px; vertical-align: middle;">
                        <a onclick="i3GEO.catalogoMetaestat.inicia()" role="button" href="javascript:void(0)">
                            <h4>
                                <i class="material-icons" style="vertical-align: text-bottom;">trending_up</i> {{{x57}}}
                            </h4>
                        </a>
                        <h6>{{{descMeta}}}</h6>
                    </label>
                    <a onclick="i3GEO.catalogoMetaestat.inicia()" role="button" class="" href="javascript:void(0)">
                        <i style="margin-bottom: 10px; margin-top: 10px;" class="pull-right material-icons">navigate_next</i>
                    </a>
                </div>
            </div>
            <hr>
            <!--  camadas por estrelas -->
            <div class="list-group condensed">
                <div class="row-content text-left" style="opacity: 0.8;">
                    <label style="width: 300px; vertical-align: middle;">
                        <a onclick="i3GEO.catalogoEstrelas.inicia({'valorEstrela':5,'numEstrelas':1})" role="button" href="javascript:void(0)">
                            <h4>
                                <i class="material-icons" style="vertical-align: text-bottom;">star_border</i> {{{t46}}}
                            </h4>
                        </a>
                        <h6>{{{descEstrelas}}}</h6>
                    </label>
                    <a onclick="i3GEO.catalogoEstrelas.inicia({'valorEstrela':5,'numEstrelas':1})" role="button" class="" href="javascript:void(0)">
                        <i style="margin-bottom: 10px; margin-top: 10px;" class="pull-right material-icons">navigate_next</i>
                    </a>
                </div>
            </div>
            <hr>
            <!--  sistemas que adicionam camadas -->
            <div class="list-group condensed">
                <div class="row-content text-left" style="opacity: 0.8;">
                    <label style="width: 300px; vertical-align: middle;">
                        <a onclick="i3GEO.catalogoSistemas.inicia()" role="button" href="javascript:void(0)">
                            <h4>
                                <i class="material-icons" style="vertical-align: text-bottom;">widgets</i> {{{a11}}}
                            </h4>
                        </a>
                        <h6>{{{descSistemas}}}</h6>
                    </label>
                    <a onclick="i3GEO.catalogoSistemas.inicia()" role="button" class="" href="javascript:void(0)">
                        <i style="margin-bottom: 10px; margin-top: 10px;" class="pull-right material-icons">navigate_next</i>
                    </a>

                </div>
            </div>
            <hr>
            <!--  navegacao em diretorios -->
            <div class="list-group condensed">
                <div class="row-content text-left" style="opacity: 0.8;">
                    <label style="width: 300px; vertical-align: middle;">
                        <a onclick="i3GEO.catalogoDir.inicia()" role="button" href="javascript:void(0)">
                            <h4>
                                <i class="material-icons" style="vertical-align: text-bottom;">storage</i> {{{a6}}}
                            </h4>
                        </a>
                        <h6>{{{descDir}}}</h6>
                    </label>
                    <a onclick="i3GEO.catalogoDir.inicia()" role="button" class="" href="javascript:void(0)">
                        <i style="margin-bottom: 10px; margin-top: 10px;" class="pull-right material-icons">navigate_next</i>
                    </a>
                </div>
            </div>
            <hr>
        </div>
    </div>
</div>