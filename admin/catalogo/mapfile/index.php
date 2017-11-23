<?php
// TODO incluir novamente ou nao a ativacao do metadata editorsql?
define("ONDEI3GEO", "../../..");
include ("exec.php");
include "../../head.php";
if (! isset($_COOKIE["palavraFiltro"])) {
    $_COOKIE["palavraFiltro"] = "";
}
?>
<div class="container-fluid migalha">
    <div class="row">
        <div class="btn-group btn-breadcrumb">
            <a class="btn btn-default" href="../../../init/index.php">
                <span>i3Geo</span>
            </a>
            <a class="btn btn-default" href="../../index.php">
                <span>Admin</span>
            </a>
            <a class="btn btn-default" style="pointer-events: none">
                <span>Cat&aacute;logo</span>
            </a>
            <a class="btn btn-default" style="pointer-events: none">
                <span>Mapfiles</span>
            </a>
        </div>
    </div>
</div>
<div class="container">
    <div class="row center-block">
        <div class="col-md-12" id="titulo">
            <div class="well hidden">
                <span class="pull-right">&nbsp;&nbsp;</span>
                <button data-toggle="modal" data-target="#modalFiltro" class="btn btn-primary btn-fab btn-fab-mini pull-right">
                    <i class="material-icons">search</i>
                </button>
                <h2>
                    <small>{{{txtTitulo}}}</small>
                </h2>
                <blockquote>
                    {{{txtDesc}}}<br>
                    <a href="#expandeTxt" data-toggle="collapse" class="collapsed">
                        <span class="text-primary readMore">
                            <i class="material-icons">keyboard_arrow_down</i>
                        </span>
                        <span class="text-primary readLess">
                            <i class="material-icons">keyboard_arrow_up</i>
                        </span>
                    </a>
                    <div id="expandeTxt" class="collapse">{{{txtAjuda}}} {{{txtDesc1}}} {{{txtCompatibilidade}}}</div>
                </blockquote>
                <div class="col-md-6">
                    <div class="form-group">
                        <label class="control-label">{{{validar}}}</label> <select title="{{{validar}}}" onchange="i3GEOadmin.mapfile.lista('',this.value);" id="" class="form-control input-lg">
                            <option value=''></option>
                            <option value=1>Sem fonte</option>
                            <option value=12>T&iacute;tulos diferentes no mapfile e no banco de dados</option>
                            <option value=13>LAYER com NAME diferente do nome do arquivo mapfile</option>
                            <option value=2>Nome n&atilde;o definido no banco de dados</option>
                            <option value=3>Nome definido no banco de dados</option>
                            <option value=4>Permite download</option>
                            <option value=5>N&atilde;o permite download</option>
                            <option value=6>Permite WMS</option>
                            <option value=7>N&atilde;o permite WMS</option>
                            <option value=8>Permite KML</option>
                            <option value=9>N&atilde;o permite KML</option>
                            <option value=10>Permite KMZ</option>
                            <option value=11>N&atilde;o permite KMZ</option>
                        </select>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="form-group">
                        <div class="input-group ">
                            <label class="control-label">{{{filtroPrefixo}}}</label> <input class="form-control input-lg" type="text" value="<?php echo $_COOKIE["palavraFiltro"];?>" id="filtroPrefixo">
                            <a onclick="i3GEOadmin.mapfile.aplicaFiltroPalavra();return false;" role="button" type="button" class="pull-right btn btn-danger btn-fab btn-fab-mini"
                                href="javascript:void(0)">
                                <i class="material-icons  md-18">send</i>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
                <div id="ajudaPrincipal" class="modal fade" tabindex="-1">
                    <div class="modal-dialog">
                        <div class="modal-content">
                            <div class="modal-body">
                                <p>{{{txtAjuda}}}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="well hidden">

                <div class="panel panel-default" id="favoritos">
                    <div class="panel-heading icon" role="tab">
                        <h4 class="panel-title">
                            <a class="collapsed in" role="button" data-toggle="collapse" href="#body-favoritos" aria-expanded="false">
                                <i class="material-icons">star_border</i> {{{favoritos}}}
                            </a>
                        </h4>
                    </div>
                    <div class="panel-body panel-collapse collapse" id="body-favoritos"></div>
                </div>
                <div class="panel-heading">
                    <p class="lead" style="margin: 0px;">
                        &nbsp;
                        <a title="{{{adicionar}}}" onclick="i3GEOadmin.mapfile.adicionaDialogo();" href="javascript:void(0)" class="pull-right btn btn-danger btn-fab btn-fab-mini" role="button">
                            <i class="material-icons ">add</i>
                        </a>
                    </p>
                </div>
                <div class="clearfix"></div>
                <div id="corpo"></div>
            </div>
        </div>
    </div>
</div>
<?php
include ("templates/templateManterTema.php");
include ("templates/templateLista.php");
include ("templates/templateFiltro.php");
include ("templates/templateClonarTema.php");
?>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="teste/index.js"></script>
<script type="text/javascript" src="../../dicionario/editormapfile.js"></script>
<script>
	$(document).ready(function(){
		//vem de admin/index.js
		iniciaMenuPrincipal();
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
		//traducao
		var t = $("#titulo");
		//complementa dicionario
		i3GEOadmin.mapfile.dicionario = $.extend(
			{},
			i3GEOadmin.mapfile.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.mapfile.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.mapfile.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.mapfile.dicionario
			)
		);
		$.material.init();
			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
			i3GEOadmin.mapfile.init($("#corpo"),"<?php echo $_COOKIE["palavraFiltro"];?>");
	});
</script>
</body>
</html>
