<script id="templateFormRaiz" type="x-tmpl-mustache">
<form id="form-edicao-raiz-{{id_raiz}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_raiz}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="id_tema">{{{tema}}}</label>
				<div class="col-md-8">
					<select title="{{{tema}}}" class="form-control" name="id_tema">
						{{{opcoesTema}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ordem">{{{ordemTxt}}}</label>
				<div class="col-md-8">
					<input title="{{{ordemTxt}}}" type="text" value="{{{ordem}}}" class="form-control" name="ordem" required >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="perfil">{{{perfis}}}</label>
				<div class="col-md-4">
					<input title="{{{perfis}}}" id="perfil_tema-{{id_raiz}}" type="text" value="{{{perfil}}}" class="form-control" name="perfil">
				</div>
				<div class="col-md-4">
					<select title="{{{perfis}}}" class="form-control" onchange="i3GEOadmin.subgrupos.addInput('perfil_tema-{{id_raiz}}',this.value)">
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