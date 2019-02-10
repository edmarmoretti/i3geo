<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_medida_variavel}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_medida_variavel}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="nomemedida" >{{{nomemedidaTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{nomemedidaTxt}}}" type="text" value="{{{nomemedida}}}" class="form-control" name="nomemedida" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="codigo_unidade_medida" >{{{codigo_unidade_medidaTxt}}}</label>
				<div class="col-md-7">
					<select class="form-control" name="codigo_unidade_medida" required>
						{{{opcoesUnidade}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="codigo_tipo_periodo" >{{{codigo_tipo_periodoTxt}}}</label>
				<div class="col-md-7">
					<select class="form-control" name="codigo_tipo_periodo" required>
						{{{opcoesPeriodo}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="codigo_tipo_regiao" >{{{codigo_tipo_regiaoTxt}}}</label>
				<div class="col-md-7">
					<select class="form-control" name="codigo_tipo_regiao" required>
						{{{opcoesRegiao}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="codigo_estat_conexao" >{{{codigo_estat_conexaoTxt}}}</label>
				<div class="col-md-7">
					<select class="form-control" name="codigo_estat_conexao" required>
						{{{opcoesConexao}}}
					</select>
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="esquemadb" >{{{esquemadbTxt}}}</label>
				<div class="col-md-7">
					<div class="input-group">
						<input title="{{{esquemadbTxt}}}" type="text" value="{{{esquemadb}}}" class="form-control" name="esquemadb" required >
						<div class="input-group-btn">
							<a role="button" class="btn btn-danger btn-fab btn-fab-mini" style="height: 20px;min-width: 20px;width: 20px;" onclick="i3GEOadmin.medidas.listaEsquemas('esquemadb')" href="javascript:void(0)">
								<i class="material-icons md-18">list</i>
							</a>
						</div>
					</div>
 				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="tabela" >{{{tabelaTxt}}}</label>
				<div class="col-md-7">
					<div class="input-group">
						<input title="{{{tabelaTxt}}}" type="text" value="{{{tabela}}}" class="form-control" name="tabela" required >
						<div class="input-group-btn">
							<a role="button" class="btn btn-danger btn-fab btn-fab-mini" style="height: 20px;min-width: 20px;width: 20px;" onclick="i3GEOadmin.medidas.listaTabelas('tabela')" href="javascript:void(0)">
								<i class="material-icons md-18">list</i>
							</a>
						</div>
					</div>
 				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="colunavalor" >{{{colunavalorTxt}}}</label>
				<div class="col-md-7">
					<div class="input-group">
						<input title="{{{colunavalorTxt}}}" type="text" value="{{{colunavalor}}}" class="form-control" name="colunavalor" required >
						<div class="input-group-btn">
							<a role="button" class="btn btn-danger btn-fab btn-fab-mini" style="height: 20px;min-width: 20px;width: 20px;" onclick="i3GEOadmin.medidas.listaColunas('colunavalor')" href="javascript:void(0)">
								<i class="material-icons md-18">list</i>
							</a>
						</div>
					</div>
 				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="colunaidunico" >{{{colunaidunicoTxt}}}</label>
				<div class="col-md-7">
					<div class="input-group">
						<input title="{{{colunaidunicoTxt}}}" type="text" value="{{{colunaidunico}}}" class="form-control" name="colunaidunico" required >
						<div class="input-group-btn">
							<a role="button" class="btn btn-danger btn-fab btn-fab-mini" style="height: 20px;min-width: 20px;width: 20px;" onclick="i3GEOadmin.medidas.listaColunas('colunaidunico')" href="javascript:void(0)">
								<i class="material-icons md-18">list</i>
							</a>
						</div>
					</div>
 				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="colunaidgeo" >{{{colunaidgeoTxt}}}</label>
				<div class="col-md-7">
					<div class="input-group">
						<input title="{{{colunaidgeoTxt}}}" type="text" value="{{{colunaidgeo}}}" class="form-control" name="colunaidgeo" required >
						<div class="input-group-btn">
							<a role="button" class="btn btn-danger btn-fab btn-fab-mini" style="height: 20px;min-width: 20px;width: 20px;" onclick="i3GEOadmin.medidas.listaColunas('colunaidgeo')" href="javascript:void(0)">
								<i class="material-icons md-18">list</i>
							</a>
						</div>
					</div>
 				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="filtro" >{{{filtroTxt1}}}</label>
				<div class="col-md-7">
					<input title="{{{filtroTxt}}}" type="text" value="{{{filtro}}}" class="form-control" name="filtro" >
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
