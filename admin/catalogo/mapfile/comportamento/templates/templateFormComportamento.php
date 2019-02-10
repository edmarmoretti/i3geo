<script id="templateFormComportamento" type="x-tmpl-mustache">
<form id="form-edicao-comportamento" style="" action="#" onsubmit="{{onSalvar}}('{{codigo}}','{{id_tema}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="aplicaextensao">
					{{{aplicaExtensaoTitulo}}}
				</label>
				<p class="small">
					{{{aplicaExtensao}}} (metadata: APLICAEXTENSAO)
				</p>
			</div>
			<div class="col-md-6">
				<select name="aplicaextensao" class="form-control" required >
					{{{aplicaextensao}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="permitecomentario">
					{{{comentarioTitulo}}}
				</label>
				<p class="small">
					{{{comentario}}} (metadata: PERMITECOMENTARIO)
				</p>
			</div>
			<div class="col-md-6">
				<select name="permitecomentario" class="form-control" required >
					{{{permitecomentario}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="escondido">
					{{{escondidoTitulo}}}
				</label>
				<p class="small">
					{{{esconDido}}} (metadata: ESCONDIDO)
				</p>
			</div>
			<div class="col-md-6">
				<select name="escondido" class="form-control" required >
					{{{escondido}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="transitioneffect">
					{{{transitionTitulo}}}
				</label>
				<p class="small">
					{{{transition}}} (metadata: TRANSITIONEFFECT)
				</p>
			</div>
			<div class="col-md-6">
				<select name="transitioneffect" class="form-control" required >
					{{{transitioneffect}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="status">
					Status
				</label>
				<p class="small">
					{{{statusTitulo}}}
				</p>
			</div>
			<div class="col-md-6">
				<select name="status" class="form-control" required >
					{{{status}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="temporizador">
					{{{temporizadorTitulo}}}
				</label>
				<p class="small">
					{{{temporiZador}}} (metadata: TEMPORIZADOR)
				</p>
			</div>
			<div class="col-md-6">
				<input type="text" value="{{{temporizador}}}" class="form-control" name="temporizador" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="iconetema">
					{{{iconetemaTitulo}}}
				</label>
				<p class="small">
					{{{iconeTema}}} (metadata: ICONETEMA)
				</p>
			</div>
			<div class="col-md-6">
				<input type="text" value="{{{iconetema}}}" class="form-control" name="iconetema" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="mensagem">
					{{{mensagemTitulo}}}
				</label>
				<p class="small">
					{{{Mensagem}}} (metadata: MENSAGEM)
				</p>
			</div>
			<div class="col-md-6">
				<input type="text" value="{{{mensagem}}}" class="form-control" name="mensagem" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="wkttip">
					{{{WkttipTitulo}}}
				</label>
				<p class="small">
					{{{Wkttip}}} (metadata: WKTTIP)
				</p>
			</div>
			<div class="col-md-6">
				<select name="wkttip" class="form-control" >
					{{{wkttip}}}
				</select>
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#FF6F61;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>