<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_agregaregiao}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_agregaregiao}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="codigo_tipo_regiao_pai" >{{{nome_tipo_regiaoPaiTxt}}}</label>
				<div class="col-md-7">
					<select title="{{{nome_tipo_regiaoPaiTxt}}}" class="form-control" name="codigo_tipo_regiao_pai" required>
						{{{opcoesRegiao}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="colunaligacao_regiaopai" >{{{coluna_ligacaoTxt}}}</label>
				<div class="col-md-7">
					<select class="form-control" name="colunaligacao_regiaopai" required>
						{{{opcoesColuna}}}
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
