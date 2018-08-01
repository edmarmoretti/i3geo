
<!-- busca
                Funcoes de busca por registros. Pode ser feita nos temas existentes no mapa, em um servico de busca e no google
                No botao que dispara a busca, ficam os parametros de configuracao
                Esses parametros indicam qual o checkbox que define o tipo de busca, o local onde os dados serao mostrados e o template para formatar o resultado
                -->
<div data-traduzir="true" id='guia7obj' style='display: none; text-align: left; height: 100%'>
    <div class="i3GEOfechaGuia" onclick="i3GEO.guias.abreFecha('fecha');">
        <button>
            <span class="pull-left">{{{t23}}}</span> <span class="pull-right material-icons">cancel</span>
        </button>
    </div>
    <div class="separadorCabecalhoGuias">&nbsp;</div>
    <div class="container-fluid guiaOverflow" style="height: calc(100% - 45px); width: calc(100% - 12px);">
        <form onSubmit="return false;">
            <div class="form-group label-floating">
                <label class="control-label" for="valorBuscaRapida">{{{x36}}}</label>
                <div class="input-group">
                    <input class="form-control" type="text" value="" name="valorBuscaRapida">
                    <span class="input-group-btn"> <a onclick="i3GEO.busca.inicia(this);return false;" data-templateGoogle="<?php echo $configInc["pathtemplates"];?>/buscaEmTemas.html"
                            data-inputGoogle="[name=google]" data-ondeGoogle=".i3GEOresultadoBuscaGoogle" data-templateTemasMapa="<?php echo $configInc["pathtemplates"];?>/buscaEmTemas.html"
                            data-inputTemasMapa="[name=temasMapa]" data-ondeTemasMapa=".i3GEOresultadoBuscaTemasMapa"
                            data-templateServico="<?php echo $configInc["pathtemplates"];?>/buscaEmServico.html" data-ondeConteiner="#guia7obj" data-inputOndePalavra="[name=valorBuscaRapida]"
                            data-inputServicosExternos="[name=servicosExternos]" data-ondeServicosExternos=".i3GEOresultadoBuscaServicos" role="button" type="button"
                            class="btn btn-default btn-fab btn-fab-max" href="javascript:void(0)">
                            <span class="material-icons ">search</span>
                        </a>
                    </span>
                </div>
            </div>
            <h4>{{{x37}}}:</h4>
            <div class="form-inline" style="width: 100%;">
                <div class="list-group condensed">
                    <div class="checkbox text-left">
                        <label>
                            <input checked class="noprint" value="on" type="checkbox" value="" name="servicosExternos">
                            {{{x38}}}
                        </label>
                    </div>
                </div>
                <div class="list-group condensed">
                    <div class="checkbox text-left">
                        <label>
                            <input class="noprint" value="on" type="checkbox" name="temasMapa">
                            {{{x39}}}
                        </label>
                    </div>
                </div>
                <!-- Apenas para a interface google maps
                            <div class="list-group condensed">
                                <div class="checkbox text-left">
                                <label>
                                    <input class="noprint" value="on" type="checkbox" name="google">
                                    <span class="checkbox-material noprint"><span class="check"></span></span> Google
                                </label>
                                </div>
                            </div>
                             -->
            </div>
        </form>
        <hr>
        <div class="i3GEOresultadoBuscaServicos"></div>
        <div class="i3GEOresultadoBuscaTemasMapa"></div>
        <div class="i3GEOresultadoBuscaGoogle"></div>
        <div class="alert alert-info" role="alert">{{{x40}}}</div>
    </div>
</div>