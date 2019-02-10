<script id="templateManterTema" type="x-tmpl-mustache">
		<!-- o titulo e a descricao sao diferentes para a edicao e para a criacao, por isso utiliza-se essas chaves controladas no javascript-->
		<h4>{{{criaMapfileTxt}}}</h4>
		<blockquote>{{{criaMapfileDescTxt}}}</blockquote>
		<form id="form-edicao-{{codigo}}" style="" action="#" onsubmit="{{onSalvar}}('{{codigo}}','{{id_tema}}');"   class="form-horizontal" role="form" method="post"   >
			<div class="row">
				<div class="col-md-12">
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="codigo" >{{{nomeMap}}}</label>
						<div class="col-md-6">
							<input title="{{{nomeMap}}}" type="text" value="{{{codigo}}}" class="form-control" name="codigo" required>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="titulolegenda" >{{{tituloLegenda}}}</label>
						<div class="col-md-6">
							<input title="{{{tituloLegenda}}}" type="text" value="{{{titulolegenda}}}" class="form-control" name="titulolegenda" required >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="nome_tema" >{{{tituloTema}}}</label>
						<div class="col-md-6">
							<input placeholder="{{{tituloPt}}}" title="{{{tituloTema}}}" type="text" value="{{{nome_tema}}}" class="form-control" name="nome_tema" required >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="es" >{{{tituloEs}}}</label>
						<div class="col-md-6">
							<input title="{{{tituloEs}}}" type="text" value="{{{es}}}" class="form-control" name="es" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="en" >{{{tituloEn}}}</label>
						<div class="col-md-6">
							<input title="{{{tituloEn}}}" type="text" value="{{{en}}}" class="form-control" name="en" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="desc_tema" >{{{descricaoTxt}}}</label>
						<div class="col-md-6">
							<input title="{{{descricaoTxt}}}" type="text" value="{{{desc_tema}}}" class="form-control" name="desc_tema" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="link_tema" >{{{fonteTema}}}</label>
						<div class="col-md-6">
							<input title="{{{fonteTema}}}" type="text" value="{{{link_tema}}}" class="form-control" name="link_tema" >
						</div>
					</div>
					<div class="form-group form-group-lg">
						<label class="col-md-6 control-label" for="metaestat">{{{metaestatTxt}}}</label>
						<div class="col-md-6">
							<select title="{{{Metaestat}}}" class="form-control" name="metaestat">
								<option value="SIM" {{{metaestatsim}}} >{{{sim}}}</option>
								<option value="NAO" {{{metaestatnao}}} >{{{nao}}}</option>
							</select>
						</div>
					</div>
					<div class="form-group form-group-lg">
						<div class="checkbox col-md-12">
							<label>
								<input title="{{{permiteOgc}}}" type="checkbox" {{acessopublico}} name="acessopublico" /> {{{permiteOgc}}}
							</label>
						</div>
					</div>
				</div>
			<div class="pull-right">
				<button type="submit" class="btn btn-primary" role="button" style="color:#FF6F61;">{{salva}}</button>
			</div>
			</div>
		</form>
</script>