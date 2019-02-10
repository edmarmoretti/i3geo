<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_atlas}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_atlas}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="nome_atlas" >{{{titulo}}}</label>
				<div class="col-md-8">
					<input title="{{{titulo}}}" type="text" value="{{{titulo_atlas}}}" class="form-control" name="titulo_atlas" required>
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="desc_atlas" >{{{descricao}}}</label>
				<div class="col-md-8">
					<input title="{{{descricao}}}" type="text" value="{{{desc_atlas}}}" class="form-control" name="desc_atlas" required>
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="link_atlas" >{{{linkTxt}}}</label>
				<div class="col-md-8">
					<input title="{{{linkTxt}}}" type="text" value="{{{link_atlas}}}" class="form-control" name="link_atlas" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="publicado_atlas">{{{publicado}}}</label>
				<div class="col-md-8">
					<select title="{{{publicado}}}" name="publicado_atlas" class="form-control" required >
						{{{opcoesPublicado}}}
					</select>
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ordem_atlas" >{{{ordem}}}</label>
				<div class="col-md-8">
					<input title="{{{ordem}}}" type="text" value="{{{ordem_atlas}}}" class="form-control" name="ordem_atlas" required >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="basemapfile_atlas" >{{{mapfileInicia}}}</label>
				<div class="col-md-8">
					<input title="{{{mapfileInicia}}}" type="text" value="{{{basemapfile_atlas}}}" class="form-control" name="basemapfile_atlas" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="h_atlas" >{{{altura}}}</label>
				<div class="col-md-8">
					<input title="{{{altura}}}" type="text" value="{{{h_atlas}}}" class="form-control" name="h_atlas" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="w_atlas" >{{{largura}}}</label>
				<div class="col-md-8">
					<input title="{{{largura}}}" type="text" value="{{{w_atlas}}}" class="form-control" name="w_atlas" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="icone_atlas" >{{{iconeAtlas}}}</label>
				<div class="col-md-8">
					<input title="{{{iconeAtlas}}}" type="text" value="{{{icone_atlas}}}" class="form-control" name="icone_atlas" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="pranchadefault_atlas" >{{{pranchaInicia}}}</label>
				<div class="col-md-8">
					<input title="{{{pranchaInicia}}}" type="text" value="{{{pranchadefault_atlas}}}" class="form-control" name="pranchadefault_atlas" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="template_atlas" >{{{template}}}</label>
				<div class="col-md-8">
					<input title="{{{template}}}" type="text" value="{{{template_atlas}}}" class="form-control" name="template_atlas" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="tipoguias_atlas" >{{{tipoGuia}}}</label>
				<div class="col-md-8">
					<select title="{{{tipoGuia}}}" name="publicado_atlas" class="form-control">
						{{{opcoesTipoGuia}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#FF6F61;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>
