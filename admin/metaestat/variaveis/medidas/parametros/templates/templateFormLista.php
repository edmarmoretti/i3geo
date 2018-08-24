<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_parametro_medida}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_parametro_medida}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="nome" >{{{nomeParametro}}}</label>
				<div class="col-md-8">
					<input title="{{{nomeParametro}}}" type="text" value="{{{nome}}}" class="form-control" name="nome" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="descricao" >{{{descricaoTxt}}}</label>
				<div class="col-md-8">
					<input title="{{{descricaoTxt}}}" type="text" value="{{{descricao}}}" class="form-control" name="descricao" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="coluna" >{{{colunaPar}}}</label>
				<div class="col-md-8">
					<select class="form-control" name="coluna">
						{{{opcoesColuna}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="tipo" >{{{tipoColunaPar}}}</label>
				<div class="col-md-8">
					<select class="form-control" name="tipo">
						<option {{0-sel}} value="0">{{{NonDef}}}</option>
						<option {{1-sel}} value="1">{{{Ano}}}</option>
						<option {{2-sel}} value="2">{{{Mes}}}</option>
						<option {{3-sel}} value="3">{{{Dia}}}</option>
						<option {{4-sel}} value="4">{{{Hora}}}</option>
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="id_pai" >{{{id_paiTxt}}}</label>
				<div class="col-md-8">
					<select class="form-control" name="id_pai">
						<option value=""></option>
						{{{opcoesParametroPai}}}
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
