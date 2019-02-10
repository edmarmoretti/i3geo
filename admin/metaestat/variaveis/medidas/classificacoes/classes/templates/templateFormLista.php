<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_classe}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_classe}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="titulo" >{{{nomeTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{nomeTxt}}}" type="text" value="{{{titulo}}}" class="form-control" name="titulo" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="expressao" >{{{expressaoTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{expressaoTxt}}}" type="text" value="{{{expressao}}}" class="form-control" name="expressao" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="simbolo" >{{{simboloTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{simboloTxt}}}" type="text" value="{{{simbolo}}}" class="form-control" name="simbolo" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="tamanho" >{{{tamanhoTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{tamanhoTxt}}}" type="text" value="{{{tamanho}}}" class="form-control" name="tamanho" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="azul" >{{{azulTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{azulTxt}}}" type="text" value="{{{azul}}}" class="form-control" name="azul" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="verde" >{{{verdeTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{verdeTxt}}}" type="text" value="{{{verde}}}" class="form-control" name="verde" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="vermelho" >{{{vermelhoTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{vermelhoTxt}}}" type="text" value="{{{vermelho}}}" class="form-control" name="vermelho" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="otamanho" >{{{otamanhoTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{otamanhoTxt}}}" type="text" value="{{{otamanho}}}" class="form-control" name="otamanho" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="oazul" >{{{oazulTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{oazulTxt}}}" type="text" value="{{{oazul}}}" class="form-control" name="oazul" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="overde" >{{{overdeTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{overdeTxt}}}" type="text" value="{{{overde}}}" class="form-control" name="overde" >
				</div>
			</div>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<div class="form-group form-group-lg">
				<label class="col-md-7 control-label" for="overmelho" >{{{overmelhoTxt}}}</label>
				<div class="col-md-5">
					<input title="{{{overmelhoTxt}}}" type="text" value="{{{overmelho}}}" class="form-control" name="overmelho" >
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
