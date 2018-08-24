<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao-{{id_usuario}}" style="" action="#" onsubmit="{{onSalvar}}('{{id_usuario}}');return false;"   class="form-horizontal" role="form" method="post"   >
	<div class="row">
		<div class="col-md-4" >
			<h4> {{{papeisv}}}</h4>
			<div class="form-group form-group-lg" style="padding-left:5px;">{{{inputPapeis}}}</div>
		</div>
		<div class="col-md-8">
			<h4>{{{usuarioTxt}}}</h4>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="nome_usuario" >{{{nome}}}</label>
				<div class="col-md-10">
					<input title="{{{nome}}}" type="text" value="{{{nome_usuario}}}" class="form-control" name="nome_usuario" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="login">Login</label>
				<div class="col-md-10">
					<input title="Login" type="text" value="{{{login}}}" class="form-control" name="login" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="novasenha">{{{labelNovaSenha}}}</label>
				<div class="col-md-10">
					<input title="password" type="password" value="" class="form-control" name="senha" >
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="email">e-mail</label>
				<div class="col-md-10">
					<input title="e-mail" type="email" value="{{{email}}}" class="form-control" name="email" required>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="data_cadastro">{{{labelDataCadastro}}}</label>
				<div class="col-md-10">
					<input title="{{{labelDataCadastro}}}" disabled="" type="text" value="{{{data_cadastro}}}" class="form-control" name="data_cadastro">
				</div>
			</div>
			<div class="form-group form-group-lg">
				<label class="col-md-2 control-label" for="ativo">{{{labelAtivo}}}</label>
				<div class="col-md-10">
					<select title="{{{labelAtivo}}}" name="ativo" class="form-control">
						<option value="1" {{selAtivoSim}} >{{sim}}</option>
						<option value="0" {{selAtivoNao}} >{{{nao}}}</option>
					</select>
				</div>
			</div>
			<div class="form-group form-group-lg">
				<div class="col-md-2"></div>
				<div class="checkbox col-md-10">
					<label>
						<input title="{{{enviaSenha}}}" type="checkbox" name="enviaSenha" /> {{{enviaSenha}}}
					</label>
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
