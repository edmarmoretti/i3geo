<div data-traduzir="true" id='guia7obj' style='display: none; text-align: left; height: 100%'>
    <div class="i3GeoBgc2 i3GEOfechaGuia" onclick="i3GEO.guias.abreFecha('fecha');">
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
                    <span class="input-group-btn"> <a onclick="i3GEO.busca.inicia(this);return false;"
                            data-templateTemasMapa="<?php echo $configInc["pathtemplates"];?>/buscaEmTemas.html"
                            data-inputTemasMapa="[name=temasMapa]" data-ondeTemasMapa=".i3GEOresultadoBuscaTemasMapa"
                            data-ondeConteiner="#guia7obj" data-inputOndePalavra="[name=valorBuscaRapida]"
                            role="button" type="button"
                            class="btn btn-default btn-fab btn-fab-max" href="javascript:void(0)">
                            <span class="material-icons ">search</span>
                        </a>
                    </span>
                </div>
            </div>
        </form>
        <hr>
        <div class="i3GEOresultadoBuscaTemasMapa"></div>
        <div class="alert alert-info" role="alert">{{{x40}}}</div>
    </div>
</div>