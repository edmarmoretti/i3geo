/*
Title: Nuvem de tags

Mostra uma nuvem de tags baseado nos tags de cada tema, definido no sistema de administra&ccedil;&atilde;o do i3Geo.
Ao escolher um tag, &eacute; feita a busca dos temas que os cont&eacute;m, sendo mostrados na &aacute;rvore de temas. Opcionalmente, o
usu&aacute;rio pode escolher um RSS para que seja feito o cruzamento entre os tags encontrados. Dessa forma, s&atilde;o apresentadas as not&iacute;cias
referentes aos tags de cada tema.

Veja:

<i3GEO.arvoreDeTemas.dialogo.nuvemTags>

Arquivo:

i3geo/ferramentas/nuvemtags/index.js.php

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
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/

if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.nuvemtags
*/
i3GEOF.nuvemtags = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Variavel: tags

	Objeto JSON com a lista de tags
	*/
	tags: "",
	/*
	Variavel: inicio

	Valor inicial referente ao n&uacute;mero de ocorr&ecirc;ncias de cada tag que deve ser considerado na montagem da nuvem
	*/
	inicio: 0,
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.nuvemtags.dicionario);
		return dicionario;
	},
	/*
	Propriedade: listaRSS

	Lista de RSS com not&iacute;cias para fazer o cruzamento com a nuvem
	*/
	listaRSS: ["http://www.mma.gov.br/webservice/noticias/rss_noticias.php",
	    "http://www.estadao.com.br/rss/ultimas.xml",
	    "http://www.estadao.com.br/rss/vidae.xml",
	    "http://feeds.folha.uol.com.br/folha/emcimadahora/rss091.xml"],
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametros:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	dados {JSON} - dados para o gr&aacute;fico (opcional)
	*/
	inicia: function(iddiv){
		if(i3GEOF.nuvemtags.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/nuvemtags/template_mst.html", function(template) {
				i3GEOF.nuvemtags.MUSTACHE = template;
				i3GEOF.nuvemtags.inicia(iddiv);
			});
			return;
		}
		try{
			$i(iddiv).innerHTML = i3GEOF.nuvemtags.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOnuvemtagsguia1","i3GEOnuvemtagsguia");
			//eventos das guias
			$i("i3GEOnuvemtagsguia1").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOnuvemtagsguia1","i3GEOnuvemtagsguia");
			};
			$i("i3GEOnuvemtagsguia2").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOnuvemtagsguia2","i3GEOnuvemtagsguia");

				var i,ins = "<p class=paragrafo >"+$trad('ajuda',i3GEOF.nuvemtags.dicionario)+"</p>",
					n = i3GEOF.nuvemtags.listaRSS.length;
				ins += $inputText("","","i3GEOnuvemtagsRSS","",65,"");
				ins += "<br><br><p class=paragrafo ><select onchange='javascript:$i(\"i3GEOnuvemtagsRSS\").value = this.value' >";
				ins += "<option value='' >---</option>";
				for (i=0;i<n;i++){
					ins += "<option value='"+i3GEOF.nuvemtags.listaRSS[i]+"' >"+i3GEOF.nuvemtags.listaRSS[i]+"</option>";
				}
				ins += "</select>";
				ins += "<br><p class=paragrafo ><input type=buttom value="+$trad('cruza',i3GEOF.nuvemtags.dicionario)+" id=i3GEOnuvemtagsbotao3 />";
				$i("i3GEOnuvemtagsguia2obj").innerHTML = ins;

				new YAHOO.widget.Button(
					"i3GEOnuvemtagsbotao3",
					{onclick:{fn: function(){
							if(i3GEOF.nuvemtags.aguarde.visibility === "visible")
							{return;}
							var rss = $i("i3GEOnuvemtagsRSS").value,
								cp = new cpaint(),
								p = i3GEO.configura.locaplic+"/ferramentas/nuvemtags/exec.php?funcao=listaTags&g_sid="+i3GEO.configura.sid+"&rss="+rss+"&nrss=20",
								temp = function(retorno){
									i3GEOF.nuvemtags.aguarde.visibility = "hidden";
									i3GEOF.nuvemtags.tags = retorno;
									i3GEOF.nuvemtags.montaNuvem();
									i3GEO.guias.mostraGuiaFerramenta("i3GEOnuvemtagsguia1","i3GEOnuvemtagsguia");
								};
							if (rss == ""){i3GEO.janela.tempoMsg($trad('digitaRSS',i3GEOF.nuvemtags.dicionario));return;}
							i3GEOF.nuvemtags.aguarde.visibility = "visible";
							cp.set_response_type("JSON");
							cp.call(p,"listaTags",temp);
						}
					}}
				);
			};
			i3GEOF.nuvemtags.ativaFoco();
			i3GEOF.nuvemtags.pegaDados();
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.nuvemtags.MUSTACHE, i3GEOF.nuvemtags.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.

	Parametro

	dados {JSON} - dados para o gr&aacute;fico
	*/
	iniciaJanelaFlutuante: function(dados){
		var minimiza,cabecalho,janela,divid,titulo;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.nuvemtags.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.nuvemtags");
		};
		titulo = "</div><a class='i3GeoTituloJanelaBs' href='javascript:void(0)' onclick='i3GEO.ajuda.ferramenta(30)' >" + $trad("a5a")+"</a>";
		janela = i3GEO.janela.cria(
			"370px",
			"180px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.nuvemtags",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.nuvemtags.aguarde = $i("i3GEOF.nuvemtags_imagemCabecalho").style;
		$i("i3GEOF.nuvemtags_corpo").style.backgroundColor = "white";
		i3GEOF.nuvemtags.inicia(divid);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){

	},
	/*
	Function: montaNuvem

	Monta a nuvem de tags convencional, com lista de tags

	Parameter:

	r {JSON} - lista de tags
	*/
	montaNuvem: function(){
		if(i3GEOF.nuvemtags.aguarde.visibility === "visible")
		{return;}
		var retorno = i3GEOF.nuvemtags.tags,
			tags = "",
			i,
			cor,
			h,
			linkrss,
			r,
			n;
		if(retorno.data){
			tags = "<p class=paragrafo >"+$trad('ajuda2',i3GEOF.nuvemtags.dicionario)+"</p>";
			tags += "<p class=paragrafo ><input type=buttom id=i3GEOnuvemtagsbotao1 value='"+$trad('menosTags',i3GEOF.nuvemtags.dicionario)+"' />&nbsp;";
			tags +="<input type=buttom id=i3GEOnuvemtagsbotao2 value='"+$trad('maisTags',i3GEOF.nuvemtags.dicionario)+"' /></p>";
			//tags +="<span onmouseout='this.style.textDecoration=\"none\"' onmouseover='this.style.textDecoration=\"underline\"' onclick='javascript:flash();' style='cursor:pointer;vertical-align:middle;color:navy;font-size:'12'pt;'>animar</span><br><br>"
			if((i3GEOF.nuvemtags.inicio < 0) || (i3GEOF.nuvemtags.inicio > retorno.data.length))
			{return;}
			i3GEOF.nuvemtags.aguarde.visibility = "visible";
			n = retorno.data.length;
			for (i=0;i<n;i++){
				if(retorno.data[i].temas.length*1 >= i3GEOF.nuvemtags.inicio){
					cor = "98,186,192";
					h = retorno.data[i].temas.length*1 + 6;
					if(h > 23)
					{h = 23;}
					linkrss = "";
					if(retorno.data[i].noticias.length > 0){
						cor = "255,0,0";
						for (r=0;r<retorno.data[i].noticias.length;r++){
							linkrss += "<span><a href='"+retorno.data[i].noticias[r].link+"' target=blanck ><img style=cursor:pointer src='"+i3GEO.configura.locaplic+"/imagens/mais.png' title='"+retorno.data[i].noticias[r].titulo+"'/></a></span>" ;
						}
					}
					tags += "<span> </span> <span onmouseout='this.style.textDecoration=\"none\"' onmouseover='this.style.textDecoration=\"underline\"' onclick='i3GEOF.nuvemtags.procurar(\""+retorno.data[i].tag+"\")' style='cursor:pointer;vertical-align:middle;color:rgb("+cor+");font-size:"+h+"pt;'>"+retorno.data[i].tag+"</span>"+linkrss;
				}
			}
		}
		else
		{tags = $trad('nenhumaTagEncontrada',i3GEOF.nuvemtags.dicionario);}
		$i("i3GEOnuvemtagsguia1obj").innerHTML = tags;
		new YAHOO.widget.Button(
			"i3GEOnuvemtagsbotao1",
			{onclick:{fn: function(){
					i3GEOF.nuvemtags.inicio = i3GEOF.nuvemtags.inicio+2;
					i3GEOF.nuvemtags.montaNuvem();
				}
			}}
		);
		new YAHOO.widget.Button(
			"i3GEOnuvemtagsbotao2",
			{onclick:{fn: function(){
					i3GEOF.nuvemtags.inicio = i3GEOF.nuvemtags.inicio-2;
					i3GEOF.nuvemtags.montaNuvem();
				}
			}}
		);
		/*
		$i("i3GEOnuvemtagsbotao1-button").style.minHeight = "1em";
		$i("i3GEOnuvemtagsbotao1-button").style.padding = "0px 15px";
		$i("i3GEOnuvemtagsbotao2-button").style.minHeight = "1em";
		$i("i3GEOnuvemtagsbotao2-button").style.padding = "0px 15px";
		*/
		i3GEOF.nuvemtags.aguarde.visibility = "hidden";
	},
	/*
	Function: pegaDados

	Pega a lista de tags existentes

	Veja:

	<LISTATAGS>
	*/
	pegaDados: function(){
		var cp = new cpaint(),
			p = i3GEO.configura.locaplic+"/ferramentas/nuvemtags/exec.php?funcao=listaTags&rss=&nrss=&g_sid="+i3GEO.configura.sid,
			temp = function(retorno){
				i3GEOF.nuvemtags.tags = retorno;
				i3GEOF.nuvemtags.montaNuvem();
			};
		cp.set_response_type("JSON");
		cp.call(p,"listaTags",temp);
	},
	/*
	Function: procurar

	Faz a busca de temas

	Veja:

	<i3GEO.arvoreDeTemas.buscaTema>
	*/
	procurar: function(texto){
		i3GEO.arvoreDeTemas.buscaTema(texto);
	}
};