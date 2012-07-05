/*jslint white:false,undef: false, rhino: true, onevar: true, evil: false */

/*
Title: Ajuda

Arquivo:

i3geo/classesjs/classe_ajuda.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇ&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) === 'undefined'){
	var i3GEO = {};
}
/*
Classe: i3GEO.ajuda

Manipula&ccedil;&atilde;o das mensagens de ajuda.

Permite definir a mensagem padr&atilde;o da janela de mensagens. Abrir a janela e definir seu conte&uacute;do.
Controla tamb&eacute;m o letreiro m&oacute;vel que mostra mensagens especiais definidas em cada layer adicionado ao mapa.

Exemplos:

	Se vc n&atilde;o quiser que a janela de ajuda seja aberta, inclua em seu HTML ou javascript

	i3GEO.ajuda.ATIVAJANELA = false;

	Para enviar uma mensagem para a janela, utilize

	i3GEO.ajuda.mostraJanela("texto");
*/
i3GEO.ajuda = {
	/*
	Propriedade: ATIVAJANELA

	Define se a janela de mensagens pode ou n&atilde;o ser aberta.

	Default:

	{true}

	Tipo:
	{Boolean}
	*/
	ATIVAJANELA: true,
	/*
	Propriedade: DIVAJUDA

	Nome do elemento HTML, do tipo DIV, que ir&aacute; conter os textos de ajuda.

	Se esse DIV for encontrado no mapa, os textos ser&atilde;o mostrados em seu interior.

	Default:

	{"i3geo_ajuda"}

	Tipo:
	{String}
	*/
	DIVAJUDA: "i3geo_ajuda",
	/*
	Propriedade: DIVLETREIRO

	Id do elemento HTML onde ser&aacute; inclu&iacute;do o banner (letreiro) de mensagens.

	Esse tipo de mensagem &eacute; obtida do METADATA "MENSAGEM" que pode ser inclu&iacute;do em um layer.

	Default:

	{"i3geo_letreiro"}

	Tipo:
	{String}
	*/
	DIVLETREIRO: "i3geo_letreiro",
	/*
	Propriedade: MENSAGEMPADRAO

	Mensagem que ser&aacute; inclu&iacute;da ao iniciar a janela de mensagens ou quando n&atilde;o houver
	mensagem definida para o elemento sobre o qual o mouse estaciona.

	Default:
	{$trad("p1")}

	Tipo:
	{String}
	*/
	MENSAGEMPADRAO: $trad("p1"),
	/*
	Propriedade: TRANSICAOSUAVE

	Altera a transpar&ecirc;ncia quando o mouse sobrep&otilde;e à janela e quando sai

	Tipo:
	{boolean}

	Default:
	{true}
	*/
	TRANSICAOSUAVE: true,
	/*
	Propriedade: OPACIDADE

	Valor da opacidade m&iacute;nima utilizada quando TRANSICAOSUAVE for igual a true.

	Varia de 0 a 100

	Tipo:
	{numeric}

	Default:
	{20}
	*/
	OPACIDADE: 20,
	/*
	Function: abreDoc

	Abre a documentacao do i3geo em uma nova janela do navegador

	Parametro:

	url - url que ser&aacute; adicionada a i3GEO.configura.locaplic
	*/
	abreDoc: function(url){
		if(!url)
		{url = "/documentacao/index.html";}
		window.open(i3GEO.configura.locaplic+url);
	},
	/*
	Function: abreJanela

	Abre a janela flutuante para mostrar as mensagens de ajuda.

	Essa fun&ccedil;&atilde;o &eacute; executada na inicializa&ccedil;&atilde;o do i3GEO
	*/
	abreJanela: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.ajuda.abreJanela()");}
		try	{
			var nx,ny,corpo,texto,janela,temp,
				largura=262,
				YU = YAHOO.util,
				pos = [20,i3GEO.parametros.h / 2];
			if(this.ATIVAJANELA === false){return;}
			temp = $i("contemFerramentas");
			if(temp){
				largura = parseInt(temp.style.width,10) - 5;
			}
			if(!$i("janelaMenTexto")){
				corpo = $i(i3GEO.Interface.IDCORPO);
				if(corpo){pos = YU.Dom.getXY(corpo);}
				else{
					corpo = $i(i3GEO.Interface.IDMAPA);
					if(corpo){pos = YU.Dom.getXY(corpo);}
				}
				nx = pos[0] - largura - 3;
				ny = i3GEO.parametros.h - 78;
				texto = '<div id="janelaMenTexto" style="text-align:left;font-size:10px;color:rgb(80,80,80)">'+i3GEO.ajuda.MENSAGEMPADRAO+'</div>';
				if(nx < 0)
				{nx = 10;ny = ny - 50;}
				janela = i3GEO.janela.cria(largura - 3,"auto","",nx,ny,"&nbsp;","i3geo_janelaMensagens",false,"hd","","",true);
				janela[2].innerHTML = texto;
				YU.Event.addListener(janela[0].close, "click", i3GEO.ajuda.fechaJanela);
				this.ativaCookie();

			}
		}
		catch(e){
			if(typeof(console) !== 'undefined'){console.error("i3GEO.ajuda.abreJanela "+e);}
		}
	},
	/*
	Function: ativaCookie

	Ativa o cookie g_janelaMen e inclui o valor "sim".

	Toda a vez que a janela &eacute; aberta, o cookie &eacute; ativado.

	Ativando-se o cookie, a janela de mensagens ser&aacute; aberta automaticamente a pr&oacute;xima vez que o i3geo for iniciado
	*/
	ativaCookie: function(){
		var i = i3GEO.util.insereCookie;
		i("g_janelaMen","sim");
		i("botoesAjuda","sim");
	},
	/*
	Function: ativaLetreiro

	Busca mensagens no metadata "MENSAGEM" existentes nos layers do mapa.

	Se existirem mensagens, as mesmas s&atilde;o inclu&iacute;das no letreiro.

	O letreiro deve ser um elemento do tipo INPUT (text).

	Parametro:

	mensagem {String} - (opcional) texto que ser&aacute; mostrado no letreiro. Se n&atilde;o for informado
	ser&aacute; utilizado a vari&aacute;vel i3GEO.parametros.mensagens
	*/
	ativaLetreiro: function(mensagem){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.ajuda.ativaLetreiro()");}
		var l;
		if($i(i3GEO.ajuda.DIVLETREIRO))
		{
			if(arguments.length === 0)
			{mensagem = i3GEO.parametros.mensagens;}
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.ajuda.ativaLetreiro()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.ajuda.ativaLetreiro()");}
			try
			{clearTimeout(i3GEO.ajuda.tempoLetreiro);}
			catch(e){i3GEO.ajuda.tempoLetreiro = "";}
			l = $i(i3GEO.ajuda.DIVLETREIRO);
			if(l.style.display==="none"){return;}
			l.style.cursor="pointer";
			if(mensagem === ""){
				l.value = "";
				return;
			}
			if (l.size === 1)
			{l.size = i3GEO.parametros.w / 8;}
			BMessage = mensagem + " ---Clique para parar--- ";
			l.onclick = function()
			{l.style.display = "none";};
			if (BMessage !== " ---Clique para parar--- "){
				BQuantas = 0;
				BSize = l.size;
				BPos=BSize;
				BSpeed = 1;
				BSpaces = "";
				i3GEO.ajuda.mostraLetreiro();
			}
			i3GEO.ajuda.mostraLetreiro(mensagem);
		}
	},
	/*
	Function: desativaCookie

	Desativa o cookie g_janelaMen.

	Toda a vez que a janela &eacute; fechada, o cookie &eacute; desativado.

	Desativando-se o cookie, a janela de mensagens n&atilde;o ser&aacute; aberta automaticamente a pr&oacute;xima vez que o i3geo for iniciado
	*/
	desativaCookie: function(){
		i3GEO.util.insereCookie("g_janelaMen","nao");
	},
	/*
	Function: fechaJanela.

	Fecha a janela de ajuda.
	*/
	fechaJanela: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.ajuda.fechaJanela()");}
		i3GEO.ajuda.desativaCookie();
		i3GEO.util.removeChild("i3geo_janelaMensagens_c",document.body);
	},
	/*
	Function: mostraJanela

	Mostra um texto dentro da janela de mensagens padr&atilde;o.

	Parametro:

	texto {String} - texto a ser mostrado
	*/
	mostraJanela: function(texto){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.ajuda.mostraJanela()");}
		var j = $i(this.DIVAJUDA),
			k = $i("janelaMenTexto"),
			jm = $i("i3geo_janelaMensagens"),
			Dom = YAHOO.util.Dom,
			h = parseInt(Dom.getStyle(jm,"height"),10);
		if(j){
			j.innerHTML = texto === "" ? "-" : texto;
		}
		else{
			if(h)
			{Dom.setY("i3geo_janelaMensagens",Dom.getY(jm) + h);}
			if(k)
			{k.innerHTML = texto;}
			if(this.TRANSICAOSUAVE){
				texto !== "" ? Dom.setStyle(jm,"opacity","1") : Dom.setStyle(jm,"opacity",(this.OPACIDADE / 100));
			}
			h = parseInt(Dom.getStyle(jm,"height"),10);
			if(h)
			{Dom.setY(jm,Dom.getY(jm) - h);}
		}
	},
	/*
	Function: mostraLetreiro

	Preenche o elemento INPUT com a mensagem de texto e faz a movimenta&ccedil;&atilde;o das letras.

	O aparecimento das letras &eacute; controlado por um temporizador e asmensagens s&atilde;o mostradas apenas duas vezes,
	desde o in&iacute;cio do redesenho do mapa.
	*/
	mostraLetreiro: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.ajuda.mostraLetreiro()");}
		for (var count=0; count<BPos; count += 1)
		{BSpaces+= " ";}
		if (BPos < 1){
			$i(i3GEO.ajuda.DIVLETREIRO).value = BMessage.substring(Math.abs(BPos), BMessage.length);
			if (BPos+BMessage.length < 1)
			{BPos = BSize;BQuantas = BQuantas + 1;}
		}
		else
		{$i(i3GEO.ajuda.DIVLETREIRO).value = BSpaces + BMessage;}
		BPos-=BSpeed;
		if (BQuantas < 2)
		{i3GEO.ajuda.tempoLetreiro = setTimeout(function(){i3GEO.ajuda.mostraLetreiro();}, 140);}
	},
	/*
	Function: redesSociais

	Abre uma janela com informa&ccedil;&otilde;es sobre a presen&ccedil;a do i3Geo em redes sociais
	*/
	redesSociais: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.ajuda.redesSociais()");}
		i3GEO.janela.cria("400px","400px",i3GEO.configura.locaplic+"/ferramentas/redessociais/index.php","","",$trad("u5c"),YAHOO.util.Dom.generateId(null,"redes"));
	}
};