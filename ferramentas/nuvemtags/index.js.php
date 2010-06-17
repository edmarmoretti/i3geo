<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Nuvem de tags

Mostra uma nuvem de tags baseado nos tags de cada tema, definido no sistema de administração do i3Geo.
Ao escolher um tag, é feita a busca dos temas que os contém, sendo mostrados na árvore de temas. Opcionalmente, o
usuário pode escolher um RSS para que seja feito o cruzamento entre os tags encontrados. Dessa forma, são apresentadas as notícias
referentes aos tags de cada tema.

Veja:

<i3GEO.arvoreDeTemas.dialogo.nuvemTags>

Arquivo:

i3geo/ferramentas/nuvemtags/index.js.php

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/

if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Classe: i3GEOF.nuvemtags
*/
i3GEOF.nuvemtags = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Variavel: tags
	
	Objeto JSON com a lista de tags
	*/
	tags: "",
	/*
	Variavel: inicio
	
	Valor inicial referente ao número de ocorrências de cada tag que deve ser considerado na montagem da nuvem
	*/
	inicio: 0,
	/*
	Propriedade: listaRSS
	
	Lista de RSS com notícias para fazer o cruzamento com a nuvem
	*/
	listaRSS: ["http://www.mma.gov.br/webservice/noticias/rss_noticias.php", 
	    "http://www.estadao.com.br/rss/ultimas.xml",
	    "http://www.estadao.com.br/rss/vidae.xml",
	    "http://feeds.folha.uol.com.br/folha/emcimadahora/rss091.xml"],
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametros:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	
	dados {JSON} - dados para o gráfico (opcional)
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.nuvemtags.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOnuvemtagsguia1","i3GEOnuvemtagsguia");
			//eventos das guias
			$i("i3GEOnuvemtagsguia1").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOnuvemtagsguia1","i3GEOnuvemtagsguia");
			};
			$i("i3GEOnuvemtagsguia2").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOnuvemtagsguia2","i3GEOnuvemtagsguia");
				
				var ins = "<p class=paragrafo >Escolha o RSS para cruzar com a lista de tags ou digite um novo valor</p>",
					n = i3GEOF.nuvemtags.listaRSS.length;
				ins += $inputText("","","i3GEOnuvemtagsRSS","",65,"")
				ins += "<br><br><p class=paragrafo ><select onchange='javascript:$i(\"i3GEOnuvemtagsRSS\").value = this.value' >";
				ins += "<option value='' >---</option>";
				for (i=0;i<n;i++){
					ins += "<option value='"+i3GEOF.nuvemtags.listaRSS[i]+"' >"+i3GEOF.nuvemtags.listaRSS[i]+"</option>";
				}
				ins += "</select>";
				ins += "<br><p class=paragrafo ><input type=buttom value=Cruzar id=i3GEOnuvemtagsbotao3 />";
				$i("i3GEOnuvemtagsguia2obj").innerHTML = ins;

				new YAHOO.widget.Button(
					"i3GEOnuvemtagsbotao3",
					{onclick:{fn: function(){
							if(i3GEOF.nuvemtags.aguarde.visibility === "visible")
							{return;}
							var rss = $i("i3GEOnuvemtagsRSS").value,
								cp = new cpaint(),
								p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaTags&g_sid="+i3GEO.configura.sid+"&rss="+rss+"&nrss=20",
								temp = function(retorno){
									i3GEOF.nuvemtags.aguarde.visibility = "hidden";
									i3GEOF.nuvemtags.tags = retorno;
									i3GEOF.nuvemtags.montaNuvem();
									i3GEO.guias.mostraGuiaFerramenta("i3GEOnuvemtagsguia1","i3GEOnuvemtagsguia");
								};
							if (rss == ""){alert("Digite um endereco RSS");return;}
							i3GEOF.nuvemtags.aguarde.visibility = "visible"
							cp.set_response_type("JSON");
							cp.call(p,"listaTags",temp);	
						}
					}}
				);
			};
			i3GEOF.nuvemtags.ativaFoco();
			i3GEOF.nuvemtags.pegaDados();
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var ins = '' +
		'<div id=i3GEOnuvemtagsguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">' +
		'	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">' +
		'		<li><a href="#ancora"><em><div id="i3GEOnuvemtagsguia1" style="text-align:center;left:0px;" >Lista</div></em></a></li>' +
		'		<li><a href="#ancora"><em><div id="i3GEOnuvemtagsguia2" style="text-align:center;left:0px;" >Cruzamento</div></em></a></li>' +
		'	</ul>' +
		'</div><br>' +
		'<div class=guiaobj id="i3GEOnuvemtagsguia1obj" style="left:1px;display:none;">' +
		'</div> ' +
		'<div class=guiaobj id="i3GEOnuvemtagsguia2obj" style="left:1px;display:none;top:-5px">' +
		'</div>';
		return ins;		
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	
	Parametro
	
	dados {JSON} - dados para o gráfico
	*/	
	criaJanelaFlutuante: function(dados){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.nuvemtags.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.nuvemtags");
		};
		titulo = "Nuvem de tags <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=4&idajuda=30' >&nbsp;&nbsp;&nbsp;</a>";
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
		i3GEO.barraDeBotoes.ativaIcone("nuvemtags");
		var i = $i("i3GEOF.nuvemtags_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 10000 + i3GEO.janela.ULTIMOZINDEX;
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
			tags = "<p class=paragrafo >Clique na TAG para localizar temas relacionados</p>";
			tags += "<p class=paragrafo ><input type=buttom id=i3GEOnuvemtagsbotao1 value=menos />&nbsp;";
			tags +="<input type=buttom id=i3GEOnuvemtagsbotao2 value=mais /></p>";
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
					{var h = 23;}
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
		{tags = "Nenhum tag encontrado"}
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
		$i("i3GEOnuvemtagsbotao1-button").style.minHeight = "1em";
		$i("i3GEOnuvemtagsbotao1-button").style.padding = "0px 15px";
		$i("i3GEOnuvemtagsbotao2-button").style.minHeight = "1em";
		$i("i3GEOnuvemtagsbotao2-button").style.padding = "0px 15px";	
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
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaTags&rss=&nrss=&g_sid="+i3GEO.configura.sid,
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
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>