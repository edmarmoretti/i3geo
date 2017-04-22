<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{codigo_tipo_regiao}}" style="" action="#" onsubmit="{{onSalvar}}('{{codigo_tipo_regiao}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="nome_tipo_regiao" >{{{nome_tipo_regiaoTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{nome_tipo_regiaoTxt}}}" type="text" value="{{{nome_tipo_regiao}}}" class="form-control" name="nome_tipo_regiao" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="descricao_tipo_regiao" >{{{descricao_tipo_regiaoTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{descricao_tipo_regiaoTxt}}}" type="text" value="{{{descricao_tipo_regiao}}}" class="form-control" name="descricao_tipo_regiao" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="codigo_estat_conexao" >{{{codigo_estat_conexaoTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{codigo_estat_conexaoTxt}}}" type="text" value="{{{codigo_estat_conexao}}}" class="form-control" name="codigo_estat_conexao" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="esquemadb" >{{{esquemadbTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{esquemadbTxt}}}" type="text" value="{{{esquemadb}}}" class="form-control" name="esquemadb" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="tabela" >{{{tabelaTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{tabelaTxt}}}" type="text" value="{{{tabela}}}" class="form-control" name="tabela" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="colunageo" >{{{colunageoTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{colunageoTxt}}}" type="text" value="{{{colunageo}}}" class="form-control" name="colunageo" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="data" >{{{dataTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{dataTxt}}}" type="text" value="{{{data}}}" class="form-control" name="data" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="identificador" >{{{identificadorTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{identificadorTxt}}}" type="text" value="{{{identificador}}}" class="form-control" name="identificador" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="colunanomeregiao" >{{{colunanomeregiaoTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{colunanomeregiaoTxt}}}" type="text" value="{{{colunanomeregiao}}}" class="form-control" name="colunanomeregiao" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="srid" >{{{sridTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{sridTxt}}}" type="text" value="{{{srid}}}" class="form-control" name="srid" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="colunacentroide" >{{{colunacentroideTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{colunacentroideTxt}}}" type="text" value="{{{colunacentroide}}}" class="form-control" name="colunacentroide" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="colunasvisiveis" >{{{colunasvisiveisTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{colunasvisiveisTxt}}}" type="text" value="{{{colunasvisiveis}}}" class="form-control" name="colunasvisiveis" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-5 control-label" for="apelidos" >{{{apelidosTxt}}}</label>
				<div class="col-md-7">
					<input title="{{{apelidosTxt}}}" type="text" value="{{{apelidos}}}" class="form-control" name="apelidos" >
				</div>
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#008579;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>