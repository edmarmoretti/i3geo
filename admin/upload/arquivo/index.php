<?php
define ( "ONDEI3GEO", "../../.." );
include ("exec.php");
include "../../head.php";
// monta o combo com a lista de pastas para armazenar os arquivos
if(is_array($_SESSION ["i3geoUploadDataWL"]["arquivos"])){
	$chaves = array_keys ( $_SESSION ["i3geoUploadDataWL"]["arquivos"] );
} else {
	$chaves = array();
}
$comboPastas = '<select name="dirDestino" class="form-control" required><option value=""></option>';
foreach ( $chaves as $c ) {
	$comboPastas .= "<option value='$c'>$c</option>";
}
$comboPastas .= "</select>";
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
				<span>Arquivo shapefile</span>
			</a>
		</div>
	</div>
</div>
<div class="container">
	<div class="row center-block">
		<div class="col-md-12">
			<div class="well hidden" id="titulo">
				<h2>
					<small>{{{txtTitulo}}}</small>
				</h2>
				<blockquote>{{{txtDesc}}}<br>
                    <a href="#expandeTxt" data-toggle="collapse" class="collapsed">
                        <span class="text-primary readMore">
                            <i class="material-icons">keyboard_arrow_down</i>
                        </span>
                        <span class="text-primary readLess">
                            <i class="material-icons">keyboard_arrow_up</i>
                        </span>
                    </a>
                    <div id="expandeTxt" class="collapse">{{{txtAjuda}}}</div>
                </blockquote>
			</div>
			<form style="" target="i3GEOuploadiframe" action="exec.php" method="post" ENCTYPE="multipart/form-data" onsubmit="javascript:$('#modalUpload').modal('show');" class="form-horizontal" role="form"
				method="post">
				<div class="row center-block well hidden" id="corpo">
					<div class="col-md-12">
						<div class="form-group form-group-lg">
							<label class="col-md-5 control-label">{{{txtArquivos}}}</label>
							<div class="col-md-7">
								<div class="form-group form-group-lg col-md-12">
									<div class="input-group-btn">
										<button type="button" class="btn btn-primary pull-left" onclick="$(this).parent().find('input[type=file]').click();">SHP</button>
										<input name="i3GEOuploadshp" onchange="$(this).parent().parent().find('.form-control').html($(this).val().split(/[\\|/]/).pop());" style="display: none;" type="file">
										<span class="form-control"></span>
									</div>
								</div>
								<div class="form-group form-group-lg col-md-12">
									<div class="input-group-btn">
										<button type="button" class="btn btn-primary pull-left" onclick="$(this).parent().find('input[type=file]').click();">SHX</button>
										<input name="i3GEOuploadshx" onchange="$(this).parent().parent().find('.form-control').html($(this).val().split(/[\\|/]/).pop());" style="display: none;" type="file">
										<span class="form-control"></span>
									</div>
								</div>
								<div class="form-group form-group-lg col-md-12">
									<div class="input-group-btn">
										<button type="button" class="btn btn-primary pull-left" onclick="$(this).parent().find('input[type=file]').click();">DBF</button>
										<input name="i3GEOuploaddbf" onchange="$(this).parent().parent().find('.form-control').html($(this).val().split(/[\\|/]/).pop());" style="display: none;" type="file">
										<span class="form-control"></span>
									</div>
								</div>
								<div class="form-group form-group-lg col-md-12">
									<div class="input-group-btn">
										<button type="button" class="btn btn-primary pull-left" onclick="$(this).parent().find('input[type=file]').click();">PRJ</button>
										<input name="i3GEOuploadprj" onchange="$(this).parent().parent().find('.form-control').html($(this).val().split(/[\\|/]/).pop());" style="display: none;" type="file">
										<span class="form-control"></span>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div class="col-md-12">
						<div class="form-group form-group-lg">
							<label class="col-md-5 control-label" for="dirDestino">{{{pastaArmazenamento}}}</label>
							<div class="col-md-7">
									<?php echo $comboPastas; ?>
								</div>
						</div>
						<div class="form-group form-group-lg">
							<label class="col-md-5 control-label" for="uploadEPSG">{{{projecao}}}</label>
							<div class="col-md-7">
								<select title="{{{projecao}}}" id="uploadEPSG" name="uploadEPSG" class="form-control">

								</select>
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
					</div>
					<div class="col-md-12">
						<div class="pull-right">
							<button type="submit" class="btn btn-primary" role="button" style="color: #5F4B8B;">{{envia}}</button>
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
<?php
if (empty ( $_SESSION ["i3geoUploadDataWL"] ) || (is_array($_SESSION ["i3geoUploadDataWL"]) && count($_SESSION ["i3geoUploadDataWL"]) == 0)) {
	echo "<script>iniciaMenuPrincipal();i3GEOadmin.core.mostraErro('Nenhuma pasta cadastrada para upload nas configura&ccedil;&otilde;es do i3Geo (vari&aacute;vel <code>i3geoUploadDataWL</code> do arquivo <samp>ms_configura</samp>)');</script>";
	exit ();
}
?>
<script id="templateProj" type="x-tmpl-mustache">
	<option value="{{{codigo}}}">{{{nome}}}</option>
</script>
<script type="text/javascript" src="index.js"></script>
<script type="text/javascript" src="../../dicionario/uploadshp.js"></script>
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
		i3GEOadmin.uploadshp.dicionario = $.extend(
			{},
			i3GEOadmin.uploadshp.dicionario,
			i3GEOadmin.core.dicionario
		);

		i3GEOadmin.core.dicionario = null;

		i3GEOadmin.uploadshp.dicionario = i3GEO.idioma.objetoIdioma(i3GEOadmin.uploadshp.dicionario);

		t.html(
			Mustache.to_html(
				t.html(),
				i3GEOadmin.uploadshp.dicionario
			)
		);
		$.material.init();
			i3GEOadmin.core.loginOn();
			$(".hidden").removeClass('hidden');
			var t = $("#corpo");
			t.html(
				Mustache.to_html(
					t.html(),
					i3GEOadmin.uploadshp.dicionario
				)
			);
			i3GEOadmin.uploadshp.listaEpsg();
	});
</script>
</body>
</html>
