<script id="templateFormConexaoLocal" type="x-tmpl-mustache">
<form id="form-edicao-conexaolocal" style="" action="#" onsubmit="{{onSalvar}}('{{codigo}}','{{id_tema}}');return false;"   class="form-horizontal" role="form"
	method="post"  >

	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					{{{typeTitulo}}}
				</label>
				<p class="small">
					{{{Type}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{typeTitulo}}}" type="text" value="{{{type}}}" class="form-control" name="type" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="projection">
					{{{projecao}}}
				</label>
				<p class="small">
					{{{projecaoTitulo}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{projecao}}}" type="text" value="{{{projection}}}" class="form-control" name="projection" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="connectiontype">
					{{{connectiontypeTitulo}}}
				</label>
				<p class="small">
					{{{Connectiontype}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{connectiontypeTitulo}}}" type="text" value="{{{connectiontype}}}" class="form-control" name="connectiontype" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="connection">
					{{{connectionTitulo}}}
				</label>
				<p class="small">
					{{{Connection}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{connectionTitulo}}}" type="text" value="{{{connection}}}" class="form-control" name="connection" >
			</div>
		</div>
	</div>

	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="data">
					{{{dataTitulo}}}
				</label>
				<p class="small">
					{{{Data}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{dataTitulo}}}" type="text" value="{{{data}}}" class="form-control" name="data" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label text-left" for="metaestat">
					{{{metaestatTitulo}}}
				</label>
				<p class="small">
					{{{Metaestat}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{metaestatTitulo}}}" type="text" value="{{{metaestat}}}" class="form-control" name="metaestat" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label text-left" for="metaestat_id_medida_variavel">
					{{{medidaVariavelTitulo}}}
				</label>
				<p class="small">
					{{{medidaVariavel}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{medidaVariavelTitulo}}}" type="text" value="{{{metaestat_id_medida_variavel}}}" class="form-control" name="metaestat_id_medida_variavel" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="tileindex">
					tileIndex
				</label>
				<p class="small">
					{{{tileIndex}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="tileIndex" type="text" value="{{{tileindex}}}" class="form-control" name="tileindex" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="tileitem">
					tileItem
				</label>
				<p class="small">
					{{{tileItem}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="tileItem" type="text" value="{{{tileitem}}}" class="form-control" name="tileitem" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="convcaracter">
					{{{convCaracterTitulo}}}
				</label>
				<p class="small">
					{{{convCaracter}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{convCaracterTitulo}}}" type="text" value="{{{convcaracter}}}" class="form-control" name="convcaracter" >
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#008579;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>