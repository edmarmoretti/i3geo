<script id="templateFormNos" type="x-tmpl-mustache">
<form id="form-edicao-no-{{id_n1}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_n1}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="id_grupo">{{{nomeTxt}}}</label>
				<div class="col-md-6">
					<select title="{{{nomeTxt}}}" class="form-control" name="id_grupo">
						{{{opcoesNo}}}
					</select>
				</div>
				<div class="col-md-2">
					<a onclick="i3GEOadmin.grupos.editarListaDeGrupos('{{id_n1}}','{{{nome_grupo}}}');" href="javascript:void(0)"
					class="btn btn-primary btn-xs" role="button">{{{editarLista}}}</a>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ordem">{{{ordemTxt}}}</label>
				<div class="col-md-8">
					<input title="{{{ordemTxt}}}" type="text" value="{{{ordem}}}" class="form-control" name="ordem" required >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="publicado">{{{publicadoTxt}}}</label>
				<div class="col-md-8">
					<select title="{{{publicadoTxt}}}" name="publicado" class="form-control" required >
						{{{opcoesPublicado}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="perfil">{{{perfis}}}</label>
				<div class="col-md-4">
					<input title="{{{perfis}}}" id="perfil_no-{{id_n1}}" type="text" value="{{{n1_perfil}}}" class="form-control" name="n1_perfil">
				</div>
				<div class="col-md-4">
					<select title="{{{perfis}}}" class="form-control" onchange="i3GEOadmin.grupos.addInput('perfil_no-{{id_n1}}',this.value)">
						{{{opcoesPerfil}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#5F4B8B;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>