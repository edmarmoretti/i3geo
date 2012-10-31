/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Login

Abre di&aacute;logo de login

Arquivo:

i3geo/ferramentas/loginusuario/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA��O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n�o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.loginusuario
*/
i3GEOF.loginusuario = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.loginusuario.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.loginusuario.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/loginusuario/dicionario.js",
				"i3GEOF.loginusuario.iniciaJanelaFlutuante()",
				"i3GEOF.loginusuario.dicionario_script"
			);
		}
		else{
			i3GEOF.loginusuario.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.loginusuario.html();
			new YAHOO.widget.Button(
				"i3GEOFloginusuario",
				{onclick:{fn: i3GEOF.loginusuario.enviar}}
			);
			new YAHOO.widget.Button(
				"i3GEOFlogoutusuario",
				{onclick:{fn: i3GEO.login.dialogo.abreLogout}}
			);
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;�o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var usuario = i3GEO.util.pegaCookie("i3geousuariologin"),
			u = "",
			ins = "";
		if(!usuario || !i3GEO.util.pegaCookie("i3GeoLogin") || i3GEO.util.pegaCookie("i3geousuariologin") == "" || i3GEO.util.pegaCookie("i3GeoLogin") == ""){
			u = "-";
		}
		else{
			u = usuario+" - "+i3GEO.util.pegaCookie("i3geousuariologin");
		}
		if(!usuario || usuario == "null"){
			usuario = "";
		}
		ins = '<p class="paragrafo" >'+$trad("x30")+': <b><i>'+u+"</i></b>" +
		'<p class="paragrafo" >'+$trad("x27")+':<br>' +
		'<input id=i3geousuario type=text style="width:250px;" value="'+usuario+'"/>' +
		'<p class="paragrafo" >'+$trad("x28")+':<br>' +
		'<input id=i3geosenha type=password style="width:250px;" value=""/><br>' +
		'<p class="paragrafo" ><input id=i3GEOFloginusuario size=20  type=button value="'+$trad("x29")+'" />&nbsp;<input id=i3GEOFlogoutusuario size=20  type=button value="Logout" />' +
		'<p class="paragrafo" onclick="i3GEOF.loginusuario.recuperarSenha()" style="cursor:pointer;color:blue;">'+$trad("x32")+'</p>' +
		'<p class="paragrafo" onclick="i3GEOF.loginusuario.alterarSenha()" style="cursor:pointer;color:blue;">'+$trad("x52")+'</p><br><br><br>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,titulo;
		//cria a janela flutuante
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.loginusuario");
		};
		titulo = "Login &nbsp;&nbsp;&nbsp;";
		janela = i3GEO.janela.cria(
			"260px",
			"220px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.loginusuario",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.loginusuario.aguarde = $i("i3GEOF.loginusuario_imagemCabecalho").style;
		$i("i3GEOF.loginusuario_corpo").style.backgroundColor = "white";
		i3GEOF.loginusuario.inicia(divid);
	},
	/*
	Function: enviar

	Envia os dados de login
	*/
	enviar: function(){
		var u = $i("i3geousuario").value,
			s = $i("i3geosenha").value,
			temp,p,cp;
		if(i3GEOF.loginusuario.aguarde.visibility === "visible")
		{return;}
		i3GEOF.loginusuario.aguarde.visibility = "visible";
		if(u == "" || s == ""){
			i3GEOF.loginusuario.aguarde.visibility = "hidden";
			return;
		}
		temp = function(retorno){
			i3GEOF.loginusuario.aguarde.visibility = "hidden";
			if(!retorno || !retorno.data || retorno.data == "erro" || retorno.data == "logout"){
				if(i3GEO.login.funcaoLoginErro){
					i3GEO.login.funcaoLoginErro.call();
				}
				else{
					alert($trad("x31"));
				}
			}
			else{
				i3GEO.util.insereCookie("i3geocodigologin",retorno.data.id,1);
				i3GEO.util.insereCookie("i3geousuariologin",u,1);
				i3GEO.util.insereCookie("i3geousuarionome",retorno.data.nome,1);
				i3GEO.janela.destroi("i3GEOF.loginusuario");
				if(i3GEO.login.recarrega === true){
					document.location.reload();
					return;
				}
				if($i(i3GEO.login.divnomelogin)){
					$i(i3GEO.login.divnomelogin).innerHTML = retorno.data.nome;
				}
				if(i3GEO.login.funcaoLoginOk){
					i3GEO.login.funcaoLoginOk.call();
				}
				else{
					alert("Login OK -> "+retorno.data.nome);
				}
			}
		};
		p = i3GEO.configura.locaplic+"/admin/php/login.php?funcao=login";
		cp = new cpaint();
		cp.set_transfer_mode("POST");
		cp.set_response_type("JSON");
		cp.call(p,"login",temp,"&usuario="+u+"&senha="+s);
	},
	recuperarSenha: function(){
		var u = $i("i3geousuario").value,
		temp,cp;
		if(u == ""){
			alert($trad("x27"));
			return;
		}
		temp = function(retorno){
			if(retorno.data == true ){
				alert("ok");
			}
			else{
				alert($trad("x31"));
			}
		};
		p = i3GEO.configura.locaplic+"/admin/php/login.php?funcao=recuperarSenha";
		cp = new cpaint();
		cp.set_transfer_mode("POST");
		cp.set_response_type("JSON");
		cp.call(p,"login",temp,"&usuario="+u);
	},
	alterarSenha: function(){
		var u = $i("i3geousuario").value,
		temp,cp,novaSenha;
		novaSenha = window.prompt("Nova senha");
		if(u == ""){
			alert($trad("x27"));
			return;
		}
		temp = function(retorno){
			if(retorno.data == true ){
				alert("ok");
			}
			else{
				alert($trad("x31"));
			}
		};
		if(novaSenha != ""){
			p = i3GEO.configura.locaplic+"/admin/php/login.php?funcao=alterarSenha";
			cp = new cpaint();
			cp.set_transfer_mode("POST");
			cp.set_response_type("JSON");
			cp.call(p,"login",temp,"&usuario="+u+"&novaSenha="+novaSenha);
		}
	}
};
