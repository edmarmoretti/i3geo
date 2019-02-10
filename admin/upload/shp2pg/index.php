<?php
define("ONDEI3GEO", "../../..");
include ("exec.php");
include "../../head.php";
// monta o combo com a lista de pastas para armazenar os arquivos

$comboEsquemas = '<select name="i3GEOuploadEsquemaDestino" class="form-control" required ><option value=""></option>';
if (! empty($_SESSION["i3geoUploadDataWL"])) {
    foreach ($_SESSION["i3geoUploadDataWL"]["postgis"]["esquemas"] as $c) {
        $comboEsquemas .= "<option value='$c'>$c</option>";
    }
}
$comboEsquemas .= "</select>";
// monta o combo com a lista de alias para conexao com o banco de dados
$comboAliasConexao = '<select name="i3GEOuploadAliasConexao" class="form-control" ><option value=""></option>';
foreach (array_keys($_SESSION["postgis_mapa"]) as $c) {
    $comboAliasConexao .= "<option value='$c'>$c</option>";
}
$comboAliasConexao .= "</select>";
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
                <span>Upload</span>
            </a>
            <a class="btn btn-default" style="pointer-events: none">
                <span>SHP->Postgis</span>
            </a>
        </div>
    </div>
</div>
<div class="container">
    <div class="row center-block">
        <div class="col-md-12">
            <div class="well hidden" id="titulo">
                <h2>
                    <small>{{{txtTituloShp2Pg}}}</small>
                </h2>
                <blockquote>
                    {{{txtDescShp2Pg}}}<br>
                    <a href="#expandeTxt" data-toggle="collapse" class="collapsed">
                        <span class="text-primary readMore">
                            <i class="material-icons">keyboard_arrow_down</i>
                        </span>
                        <span class="text-primary readLess">
                            <i class="material-icons">keyboard_arrow_up</i>
                        </span>
                    </a>
                    <div id="expandeTxt" class="collapse">{{{txtAjudaShp2Pg}}}</div>
                </blockquote>
            </div>

            <form style="" target="i3GEOuploadiframe" action="exec.php" method="post" ENCTYPE="multipart/form-data" onsubmit="javascript:$('#modalUpload').modal('show');" class="form-horizontal"
                role="form" method="post">
                <div class="row center-block well hidden" id="corpo">
                    <div class="col-md-12">
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label">{{{txtArquivos}}}</label>
                            <div class="col-md-7">
                                <div class="form-group form-group-lg col-md-12">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-primary pull-left" onclick="$(this).parent().find('input[type=file]').click();">SHP</button>
                                        <input name="i3GEOuploadshp" onchange="$(this).parent().parent().find('.form-control').html($(this).val().split(/[\\|/]/).pop());" style="display: none;"
                                            type="file">
                                        <span class="form-control"></span>
                                    </div>
                                </div>
                                <div class="form-group form-group-lg col-md-12">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-primary pull-left" onclick="$(this).parent().find('input[type=file]').click();">SHX</button>
                                        <input name="i3GEOuploadshx" onchange="$(this).parent().parent().find('.form-control').html($(this).val().split(/[\\|/]/).pop());" style="display: none;"
                                            type="file">
                                        <span class="form-control"></span>
                                    </div>
                                </div>
                                <div class="form-group form-group-lg col-md-12">
                                    <div class="input-group-btn">
                                        <button type="button" class="btn btn-primary pull-left" onclick="$(this).parent().find('input[type=file]').click();">DBF</button>
                                        <input name="i3GEOuploaddbf" onchange="$(this).parent().parent().find('.form-control').html($(this).val().split(/[\\|/]/).pop());" style="display: none;"
                                            type="file">
                                        <span class="form-control"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-12">
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label" for="i3GEOuploadEsquemaDestino">{{{esquemaArmazenamento}}}</label>
                            <div class="col-md-7">
							<?php echo $comboEsquemas; ?>
							</div>
                        </div>
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label" for="i3GEOuploadNomeTabela">{{{nomeTabela}}}</label>
                            <div class="col-md-7">
                                <input type="text" value="" class="form-control" name="i3GEOuploadNomeTabela" required>
                                <div class="input-group-btn">
                                    <a role="button" class="btn btn-danger btn-fab btn-fab-mini" style="height: 20px; min-width: 20px; width: 20px;"
                                        onclick="listaTabelasUpload('i3GEOuploadNomeTabela')" href="javascript:void(0)">
                                        <i class="material-icons md-18">list</i>
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label" for="i3GEOuploadSridOrigem">{{{sridOrigem}}}</label>
                            <div class="col-md-7">
                                <input type="text" value="<?php echo $_SESSION["i3GeoProjDefault"]["epsg"]; ?>" class="form-control" name="i3GEOuploadSridOrigem" required>
                            </div>
                        </div>
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label" for="i3GEOuploadSridDestino">{{{sridDestino}}}</label>
                            <div class="col-md-7">
                                <input type="text" value="<?php echo $_SESSION["i3GeoProjDefault"]["epsg"]; ?>" class="form-control" name="i3GEOuploadSridDestino" required>
                            </div>
                        </div>
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label" for="i3GEOuploadComentario">{{{comentarioTabela}}}</label>
                            <div class="col-md-7">
                                <input type="text" value="" class="form-control" name="i3GEOuploadComentario">
                            </div>
                        </div>
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label" for="i3GEOuploadTipoOperacao">{{{tipoOperacao}}}</label>
                            <div class="col-md-7">
                                <select title="{{{tipoOperacao}}}" name="i3GEOuploadTipoOperacao" class="form-control">
                                    <option value="criar">{{{tabelaNova}}}</option>
                                    <option value="inserir">{{{tabelaInsert}}}</option>
                                    <option value="atualizar">{{{tabelaUpdate}}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label" style="margin-top: 0px;" for="i3GEOuploadColunaGid">{{{colunaGid}}}</label>
                            <div class="col-md-7">
                                <input type="text" value="" class="form-control" name="i3GEOuploadColunaGid" required>
                            </div>
                        </div>
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label" for="i3GEOuploadAliasConexao">{{{comboAliasConexao}}}</label>
                            <div class="col-md-7">
							<?php echo $comboAliasConexao; ?>
							</div>
                        </div>
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label" style="margin-top: 0px;" for="i3GEOuploadApenasScript">{{{apenasScript}}}</label>
                            <div class="col-md-7">
                                <div class=" checkbox">
                                    <label> <input title="{{{apenasScript}}}" name="i3GEOuploadApenasScript" type="checkbox">
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="form-group form-group-lg">
                            <label class="col-md-5 control-label" style="margin-top: 0px;" for="i3GEOuploadCriaMapfile">{{{criaMapfile}}}</label>
                            <div class="col-md-7">
                                <div class=" checkbox">
                                    <label> <input title="{{{criaMapfile}}}" name="i3GEOuploadCriaMapfile" type="checkbox">
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-12">
                            <div class="pull-right">
                                <button type="submit" class="btn btn-primary" role="button" style="color: #FF6F61;">{{envia}}</button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
        <div id="modalUpload" class="modal fade" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-content">
                        <div class="modal-body modal-lg">
                            <iframe name=i3GEOuploadiframe style="text-align: left; border: 0px solid gray;" width="100%" height="500px"></iframe>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
<script id="templateProj" type="x-tmpl-mustache">
	<option value="{{{codigo}}}">{{{nome}}}</option>
</script>
<?php
if (empty ( $_SESSION ["i3geoUploadDataWL"] )) {
	echo "<script>iniciaMenuPrincipal();i3GEOadmin.core.mostraErro('Nenhum esquema cadastrado para armazenar a tabela nas configura&ccedil;&otilde;es do i3Geo (ms_configura)');</script>";
	exit ();
}
?>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/uploadshp.js"></script>
<script type="text/javascript" src="../../js/bdexplorer.js"></script>
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
		i3GEOadmin.shp2pg.dicionario = $.extend(
			{},
			i3GEOadmin.uploadshp.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.shp2pg.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.shp2pg.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.shp2pg.dicionario
			)
		);
		$.material.init();
			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
			var t = $("#corpo");
			t.html(
				Mustache.to_html(
					t.html(),
					i3GEOadmin.shp2pg.dicionario
				)
			);
	});
	function listaTabelasUpload(destino){
		var esquema = $("form select[name='i3GEOuploadEsquemaDestino']").val();
		if(esquema != ""){
			i3GEOadmin.bdExplorer.listaTabelasUpload(esquema,destino);
		}
	}
</script>
</body>
</html>