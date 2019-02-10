<script id="templateFormLista" type="x-tmpl-mustache">
		<form id="form-edicao-{{id_i}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_i}}');return false;"   class="form-horizontal" role="form" method="post"   >
			<div class="row">
				<div class="col-md-12">
					<h4>{{{nome_i}}}</h4>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="nome_i" >{{{nomeTxt}}}</label>
						<div class="col-md-10">
							<input title="{{{nomeTxt}}}" type="text" value="{{{nome_i}}}" class="form-control" name="nome_i" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="login">{{{programa}}}</label>
						<div class="col-md-10">
							<input title="{{{programa}}}" type="text" value="{{{abrir_i}}}" class="form-control" name="abrir_i" >
							<p>{{{programaDesc}}}</p>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="target_i">{{{abreComo}}}</label>
						<div class="col-md-10">
							<select title="{{{abreComo}}}" class="form-control" name="target_i">
								{{{opcoesTarget}}}
							</select>

						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-2 control-label" for="publicado_i">{{{publicado}}}?</label>
						<div class="col-md-10">
							<select title="{{{publicado}}}" class="form-control" name="publicado_i" required >
								{{{opcoesPublicado}}}
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
