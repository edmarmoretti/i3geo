<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_mapa}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_mapa}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="nome_mapa" >{{{nomeMapa}}}</label>
				<div class="col-md-8">
					<input title="{{{nomeMapa}}}" type="text" value="{{{nome_mapa}}}" class="form-control" name="nome_mapa" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="desc_mapa">{{{descricao}}}</label>
				<div class="col-md-8">
					<input title="{{{descricao}}}" type="text" value="{{{desc_mapa}}}" class="form-control" name="desc_mapa" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="contemmapfile" >{{{contemMapfile}}}</label>
				<div class="col-md-8">
					<input title="{{{contemMapfile}}}" type="text" value="{{{contemmapfile}}}" disabled="" class="form-control" name="contemmapfile" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ordem_mapa">{{{ordemMapa}}}</label>
				<div class="col-md-8">
					<input title="{{{ordemMapa}}}" type="text" value="{{{ordem_mapa}}}" class="form-control" name="ordem_mapa" required >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="temas_mapa">{{{temas}}}</label>
				<div class="col-md-4">
					<input title="{{{temas}}}" type="text" value="{{{temas_mapa}}}" class="form-control" name="temas_mapa" id="temas_mapa-{{id_mapa}}">
				</div>
				<div class="col-md-4">
					<select title="{{{temas}}}" class="form-control" onchange="i3GEOadmin.mapas.addInput('temas_mapa-{{id_mapa}}',this.value)">
						{{{opcoesTema}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ligados_mapa">{{{temasLigados}}}</label>
				<div class="col-md-4">
					<input title="{{{temasLigados}}}" type="text" value="{{{ligados_mapa}}}" class="form-control" name="ligados_mapa" id="ligados_mapa-{{id_mapa}}">
				</div>
				<div class="col-md-4">
					<select title="{{{temasLigados}}}" class="form-control" onchange="i3GEOadmin.mapas.addInput('ligados_mapa-{{id_mapa}}',this.value)">
						{{{opcoesTema}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="perfil_mapa">{{{perfis}}}</label>
				<div class="col-md-4">
					<input title="{{{perfis}}}" id="perfil_mapa-{{id_mapa}}" type="text" value="{{{perfil_mapa}}}" class="form-control" name="perfil_mapa">
				</div>
				<div class="col-md-4">
					<select title="{{{perfis}}}" class="form-control" onchange="i3GEOadmin.mapas.addInput('perfil_mapa-{{id_mapa}}',this.value)">
						{{{opcoesPerfil}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="publicado_mapa">{{{publicado}}}</label>
				<div class="col-md-8">
					<select title="{{{publicado}}}" name="publicado_mapa" class="form-control" required >
						{{{opcoesPublicado}}}
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ext_mapa">{{{extensao}}}</label>
				<div class="col-md-8">
					<input title="{{{extensao}}}" type="text" value="{{{ext_mapa}}}" class="form-control" name="ext_mapa">
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="imagem_mapa">{{{img}}}</label>
				<div class="col-md-4">
					<input title="{{{img}}}" type="text" value="{{{imagem_mapa}}}" class="form-control" name="imagem_mapa">
				</div>
				<div class="col-md-4">
					<a href="#" class="thumbnail">
						<img src="{{{imagem_mapa}}}">
					</a>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="linkdireto_mapa">{{{linkDireto}}}</label>
				<div class="col-md-8">
					<input title="{{{linkDireto}}}" type="text" value="{{{linkdireto_mapa}}}" class="form-control" name="linkdireto_mapa">
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="outros_mapa">{{{parametros}}}</label>
				<div class="col-md-8">
					<input title="{{{parametros}}}" type="text" value="{{{outros_mapa}}}" class="form-control" name="outros_mapa">
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