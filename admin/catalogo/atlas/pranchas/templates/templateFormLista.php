<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_prancha}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_prancha}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="titulo_prancha" >{{{titulo}}}</label>
				<div class="col-md-8">
					<input title="{{{titulo}}}" type="text" value="{{{titulo_prancha}}}" class="form-control" name="titulo_prancha" required>
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="desc_prancha" >{{{descricao}}}</label>
				<div class="col-md-8">
					<input title="{{{descricao}}}" type="text" value="{{{desc_prancha}}}" class="form-control" name="desc_prancha" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="link_prancha" >{{{linkTxt}}}</label>
				<div class="col-md-8">
					<input title="{{{linkTxt}}}" type="text" value="{{{link_prancha}}}" class="form-control" name="link_prancha" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="ordem_prancha" >{{{ordem}}}</label>
				<div class="col-md-8">
					<input title="{{{ordem}}}" type="text" value="{{{ordem_prancha}}}" class="form-control" name="ordem_prancha" required >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="h_prancha" >{{{altura}}}</label>
				<div class="col-md-8">
					<input title="{{{altura}}}" type="text" value="{{{h_prancha}}}" class="form-control" name="h_prancha" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="w_prancha" >{{{largura}}}</label>
				<div class="col-md-8">
					<input title="{{{largura}}}" type="text" value="{{{w_prancha}}}" class="form-control" name="w_prancha" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="icone_prancha" >{{{icone}}}</label>
				<div class="col-md-8">
					<input title="{{{icone}}}" type="text" value="{{{icone_prancha}}}" class="form-control" name="icone_prancha" >
				</div>
			</div>
		</div>
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-4 control-label" for="mapext_prancha" >{{{extGeo}}}</label>
				<div class="col-md-8">
					<input title="{{{extGeo}}}" type="text" value="{{{mapext_prancha}}}" class="form-control" name="mapext_prancha" >
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