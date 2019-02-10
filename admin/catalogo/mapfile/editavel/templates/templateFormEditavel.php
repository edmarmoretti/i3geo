<script id="templateFormEditavel" type="x-tmpl-mustache">
<form id="form-edicao-editavel" style="" action="#" onsubmit="{{onSalvar}}('{{codigo}}','{{id_tema}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="editavel">
					{{{editavelLayer}}}
				</label>
			</div>
			<div class="col-md-6">
				<select title="{{{editavelLayer}}}" name="editavel" class="form-control" required >
					{{{editavel}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="esquema">
					{{{esquemaBdTitulo}}}
				</label>
				<p class="small">
					{{{esquemaBd}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{esquemaBdTitulo}}}" type="text" value="{{{esquematabelaeditavel}}}" class="form-control" name="esquematabelaeditavel" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="tabelaeditavel">
					{{{tabela}}}
				</label>
				<p class="small">
					{{{tabelaBd}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{tabela}}}" type="text" value="{{{tabelaeditavel}}}" class="form-control" name="tabelaeditavel" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="colunaidunico">
					{{{colunaBdTitulo}}}
				</label>
				<p class="small">
					{{{colunaBd}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{colunaBdTitulo}}}" type="text" value="{{{colunaidunico}}}" class="form-control" name="colunaidunico" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="colunageometria">
					{{{bdGeomTitulo}}}
				</label>
				<p class="small">
					{{{bdGeom}}}
				</p>
			</div>
			<div class="col-md-6">
				<input title="{{{colunaBdTitulo}}}" type="text" value="{{{colunageometria}}}" class="form-control" name="colunageometria" >
			</div>
		</div>
	</div>

	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#FF6F61;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>