if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.loginusuario = {
	_parameters : {
	    "mustache": "",
	    "namespace": "loginusuario",
	    "idContainer": "i3GEOF_loginusuario" //esse elemento div ja deve ter sido carregado no html
	},
	aguarde: "",
	start: function(){
	    var p = this._parameters,
	    i3f = this,
	    t1 = i3GEO.configura.locaplic + "/ferramentas/"+p.namespace+"/template_mst.html";
	    if(p.mustache === ""){
		i3GEO.janela.abreAguarde();
		$.when( $.get(t1)).done(function(r1) {
		    i3GEO.janela.fechaAguarde();
		    p.mustache = r1;
		    i3f.html();
		}).fail(function(data) {
		    i3GEO.janela.fechaAguarde();
		    i3GEO.janela.snackBar({content: "Erro. " + data.status, style:'red'});
		    i3f.destroy();
		});
	    } else {
		i3f.html();
	    }
	},
	destroy: function(){
	    //nao use this aqui
	    i3GEOF.loginusuario._parameters.mustache = "";
	    $("#modalLogin").modal("hide");//modalLogin ja existe no html
	},
	html: function(){
	    var p = this._parameters,
	    usuario = i3GEO.util.pegaCookie("i3geousuariologin"),
	    i3f = this,
	    u = "",
	    hash;

	    if(!usuario || !i3GEO.util.pegaCookie("i3GeoLogin") || i3GEO.util.pegaCookie("i3geousuariologin") == "" || i3GEO.util.pegaCookie("i3GeoLogin") == ""){
		u = "-";
	    }
	    else{
		u = i3GEO.util.pegaCookie("i3geousuarionome") + " - " + i3GEO.util.pegaCookie("i3geousuariologin");
	    }
	    hash = {
		    locaplic: i3GEO.configura.locaplic,
		    namespace: p.namespace,
		    ativo: $trad('x30'),
		    usuario: $trad('x27'),
		    senha: $trad('x28'),
		    enviar: $trad('x29'),
		    recuperar: $trad('x32'),
		    alterar: $trad('x52'),
		    user: i3GEO.util.pegaCookie("i3geousuariologin"),
		    usuarioLogado: u,
		    ...i3GEO.idioma.objetoIdioma(i3f.dicionario)
	    };
	    $i(p.idContainer).innerHTML = Mustache.render(p.mustache, hash);
	},
	getFormData: function(){
	    var data = i3GEO.util.getFormData("#" + this._parameters.idContainer + " form");
	    return data;
	},
	/*
	Function: enviar

	Envia os dados de login
	 */
	enviar: function(){
	    var par = this.getFormData(),
	    i3f = this;

	    if(par.usuario == "" || par.senha == ""){
		return;
	    }
	    par.funcao = "login";
	    i3GEO.janela.abreAguarde();
	    $.post(
		    i3GEO.configura.locaplic+"/admin/php/login.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela.fechaAguarde();
			i3f.destroy();
			if(!data || data == "erro" || data == "logout"){
			    if(i3GEO.login.funcaoLoginErro){
				i3GEO.login.funcaoLoginErro.call();
			    }
			    else{
				i3GEO.janela.snackBar({content: $trad("x31"), style:'red'});
			    }
			    if(i3GEO.parametros){
				i3GEO.parametros.editor = "nao";
				i3GEO.catalogoMenus.listaMenus();
			    }
			}
			else{
			    i3GEO.util.insereCookie("i3geocodigologin",data.id,1);
			    i3GEO.util.insereCookie("i3geousuariologin",par.usuario,1);
			    i3GEO.util.insereCookie("i3geousuarionome",data.nome,1);
			    i3GEOF.loginusuario.destroy();
			    if(i3GEO.login.recarrega === true){
				document.location.reload();
				return;
			    }
			    if($i(i3GEO.login.divnomelogin)){
				$i(i3GEO.login.divnomelogin).innerHTML = data.nome;
			    }
			    if(i3GEO.login.funcaoLoginOk){
				i3GEO.login.funcaoLoginOk.call();
			    }
			    else{
				i3GEO.janela.snackBar({content: "Login OK -> "+data.nome});
			    }
			    if(i3GEO.parametros){
				i3GEO.parametros.editor = data.editor;
				i3GEO.catalogoMenus.listaMenus();
			    }
			}
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
			i3f.destroy();
		    }
	    );
	},
	alterarSenha: function(){
	    var par = this.getFormData(),
	    i3f = this,
	    novaSenha = "";
	    if(par.usuario == ""){
		i3GEO.janela.snackBar({content: "Digite o nome de usu&aacute;rio", style:'red'});
		return;
	    }
	    par.novaSenha = window.prompt("Nova senha");
	    if(par.novaSenha == ""){
		return;
	    }
	    par.funcao = "alterarSenha";
	    i3GEO.janela.abreAguarde();
	    $.post(
		    i3GEO.configura.locaplic+"/admin/php/login.php",
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.login.anulaCookie();
			if(i3GEO.parametros){
			    i3GEO.parametros.editor = "nao";
			    i3GEO.catalogoMenus.listaMenus();
			}
			i3GEO.janela.fechaAguarde();
			i3f.destroy();
			if(!data || data == "erro"){
			    i3GEO.janela.snackBar({content: $trad("loginnecessario",i3f.dicionario), style:'red'});
			    i3GEO.janela.snackBar({content: $trad("errotroca",i3f.dicionario), style:'red'});
			    return;
			}
			i3GEOF.loginusuario.destroy();
			if(i3GEO.login.recarrega === true){
			    document.location.reload();
			    return;
			}
			if($i(i3GEO.login.divnomelogin)){
			    $i(i3GEO.login.divnomelogin).innerHTML = "";
			}
			i3GEO.janela.snackBar({content: $trad("loginnecessario",i3f.dicionario)});
			i3GEO.janela.snackBar({content: $trad("senhatrocada",i3f.dicionario)});

		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela.fechaAguarde();
			i3GEO.janela.snackBar({content: data.status, style:'red'});
			i3f.destroy();
		    }
	    );
	}
};
