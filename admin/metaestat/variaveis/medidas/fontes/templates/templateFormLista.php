<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-modal" style="" action="#" onsubmit="{{onSalvar}}();return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="control-label" for="id_fonteinfo" >{{{escolhaFonte}}}</label>
				<div>
					<select class="form-control" name="id_fonteinfo" required >
						{{{listaDeFontes}}}
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
