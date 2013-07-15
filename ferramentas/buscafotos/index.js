
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Busca fotos

Busca fotos em servi&ccedil;os como Panoramio e Flicker na regi&atilde;o mostrada no mapa.

As fotos obtidas s&atilde;o mostradas e o usu&aacute;rio pode passar o mouse sobre elas para ver a posi&ccedil;&atilde;o no mapa.
O c&oacute;digo para realizar a busca depende das APIs de cada servi&ccedil;o. Quando necess&aacute;rio, utiliza-se
buscafotos/funcoes.php para realizar a busca.

Veja:

<i3GEO.navega.dialogo.buscaFotos>

Arquivo:

i3geo/ferramentas/buscafotos/index.js.php

About: Licen&ccedil;a

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
Class: i3GEOF.buscaFotos
*/
i3GEOF.buscaFotos = {
	/*
	Variavel: aguarde

	Objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Propriedade: chaveFlicker

	C&oacute;digo de acesso aos web services do Flicker
	*/
	chaveFlicker: "b170cde3c3064ca44b1ae0fbe747575d",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.buscaFotos.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.buscaFotos.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/buscafotos/dicionario.js",
				"i3GEOF.buscaFotos.iniciaJanelaFlutuante()",
				"i3GEOF.buscaFotos.dicionario_script"
			);
		}
		else{
			i3GEOF.buscaFotos.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	pagina {integer} - (opcional) p&aacute;gina que ser&aacute; mostrada. Se for definida a janela de busca ser&aacute; mostrada j&aacute; de in&iacute;cio por meio do servi&ccedil;o do panoramio
	*/
	inicia: function(iddiv,busca){
		try{
			$i(iddiv).innerHTML += i3GEOF.buscaFotos.html();
			new YAHOO.widget.Button("i3GEObuscafotosbotao1",{onclick:{fn: function(){
				i3GEOF.buscaFotos.busca("1");
			}}});
			new YAHOO.widget.Button("i3GEObuscafotosbotao2",{onclick:{fn: function(){
				i3GEOF.buscaFotos.mostraMenu();
			}}});
			new YAHOO.widget.Button("i3GEObuscafotosbotao3",{onclick:{fn: function(){
				i3GEO.parametros.mapscale=300000;
				i3GEO.navega.aplicaEscala(i3GEO.configura.locaplic,i3GEO.configura.sid,300000);
				i3GEOF.buscaFotos.mostraMenu();
			}}});

			i3GEOF.buscaFotos.ativaFoco();
			i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.buscaFotos.busca('1')");
			if(busca){
				i3GEOF.buscaFotos.mostraMenu();
				$i("i3GEObuscafotosbuscapanoramio").checked = true;
				i3GEOF.buscaFotos.busca(busca);
			}
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '';
		ins += '<div id=i3GEObuscafotosaviso style=display:block >';
		ins += '<p class="paragrafo" >'+$trad(1,i3GEOF.buscaFotos.dicionario);
		ins += '<p class="paragrafo" >'+$trad(2,i3GEOF.buscaFotos.dicionario);
		ins += '<p class="paragrafo" >'+$trad(3,i3GEOF.buscaFotos.dicionario);
    	if(i3GEO.parametros.mapscale > 30000001){
    		ins += '<p class="paragrafo" >'+$trad(4,i3GEOF.buscaFotos.dicionario);
    		ins += '<p class="paragrafo" ><input id=i3GEObuscafotosbotao3 size=20  type=button value="'+$trad(5,i3GEOF.buscaFotos.dicionario)+'" />';
    	}
    	else{
    		ins += '<p><input  id=i3GEObuscafotosbotao2 size=20  type=button value="'+$trad(6,i3GEOF.buscaFotos.dicionario)+'" />';
    	}
		ins += '</div>';
		ins += '<div id=i3GEObuscafotosbusca style=display:none >';
		ins += '	<div id="i3GEObuscafotosf" style="display:none">';
		ins += '		<p class="paragrafo" ><i>'+$trad(7,i3GEOF.buscaFotos.dicionario)+'</i>';
		ins += '		<p class="paragrafo" >'+$trad(8,i3GEOF.buscaFotos.dicionario);
		ins += $trad(9,i3GEOF.buscaFotos.dicionario);
		ins += $trad(10,i3GEOF.buscaFotos.dicionario);
		ins += '		<p class="paragrafo" >'+$trad(11,i3GEOF.buscaFotos.dicionario)+': <input onclick="javascript:this.select();" style="cursor:text" class=digitar type=text size=30 value="" id="i3GEObuscafotostexto" />';
		ins += '		<p class="paragrafo" >'+$trad(12,i3GEOF.buscaFotos.dicionario)+': <input onclick="javascript:this.select();" style="cursor:text" class=digitar type=text size=10 value="2009" id="i3GEObuscafotosai" />';
		ins += '		&nbsp;'+$trad(13,i3GEOF.buscaFotos.dicionario)+': <input onclick="javascript:this.select();" style="cursor:text" class=digitar type=text size=10 value="2009" id="i3GEObuscafotosaf" /><br><br>';
		ins += '		<input  id=i3GEObuscafotosbotao1 size=20  type=button value="'+$trad(14,i3GEOF.buscaFotos.dicionario)+'" />';
		ins += '	</div>';
		ins += '	<div>';
		ins += '	<p class="paragrafo" >'+$trad(15,i3GEOF.buscaFotos.dicionario)+':';
		ins += '	<input type=radio style="top:2px;background-color:#f2f2f2;none;border:0px solid white;cursor:pointer;position:relative;" onclick="i3GEOF.buscaFotos.esconde(this)" name=buscador value=flickr id=i3GEObuscafotosbuscaflickr  /><a href="http://www.flickr.com" target="_blank" >Flickr</a>';
		ins += '	<input type=radio style="top:2px;background-color:#f2f2f2;border:0px solid white;cursor:pointer;position:relative;" onclick="i3GEOF.buscaFotos.esconde(this)" name=buscador value=panoramio id=i3GEObuscafotosbuscapanoramio /><a href="http://www.panoramio.com" target="_blank" >Panoramio</a>';
		ins += '	<input type=radio style="top:2px;background-color:#f2f2f2;border:0px solid white;cursor:pointer;position:relative;" onclick="i3GEOF.buscaFotos.esconde(this)" name=buscador value=locr id=i3GEObuscafotosbuscalocr /><a href="http://www.locr.com" target="_blank" >Locr</a>';
		ins += '	</div>';
		ins += '	<div id="i3GEObuscafotospaginas" style="top:10px;"></div><br>';
		ins += '	<div style="top:0px;left:5px;display:block;width:95%;overflow:auto"  id="i3GEObuscafotosresultadofotos" ></div>';
		ins += '</div>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		cabecalho = function(){
			i3GEOF.buscaFotos.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.buscaFotos");
		};
		//cria a janela flutuante
		titulo = "Fotos <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=74' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"430px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.buscaFotos",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.buscaFotos.aguarde = $i("i3GEOF.buscaFotos_imagemCabecalho").style;
		i3GEOF.buscaFotos.inicia(divid);
		temp = function(){
			i3GEO.eventos.NAVEGAMAPA.remove("i3GEOF.buscaFotos.busca('1')");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		g_operacao = "navega";
		i3GEO.util.criaPin("pinfoto",i3GEO.configura.locaplic+'/imagens/google/foto.png');
		if(!$i("i3GEOF.buscaFotos_c"))
		{return;}
		var i = $i("i3GEOF.buscaFotos_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: mostraMenu

	Mostra o menu de escolha do provedor de fotos e esconde o aviso inicial
	*/
	mostraMenu: function(){
		$i("i3GEObuscafotosbusca").style.display = "block";
		$i("i3GEObuscafotosaviso").style.display = "none";
	},
	/*
	Function: esconde

	Esconde as op&ccedil;&otilde;es de busca dos servidores de fotos e mostra as op&ccedil;&otilde;es do objeto especificado

	Parametro:

	obj - objeto que ter&aacute; o estilo modificado para display = none
	*/
	esconde: function (obj){
		$i("i3GEObuscafotosf").style.display="none";
		$i("i3GEObuscafotosresultadofotos").innerHTML = "";
		$i("i3GEObuscafotospaginas").innerHTML = "";
		if(obj.value === "flickr")
		{$i("i3GEObuscafotosf").style.display="block";}
		else
		{i3GEOF.buscaFotos.busca("1");}
	},
	/*
	Function: busca

	Procura as fotos no servidor escolhido e chama a fun&ccedil;&atilde;o correta de apresenta&ccedil;&atilde;o das fotos.

	*/
	busca: function(pagina){
		i3GEOF.buscaFotos.aguarde.visibility = "visible";
		$i("i3GEObuscafotosresultadofotos").innerHTML = $trad(16,i3GEOF.buscaFotos.dicionario);
		$i("i3GEObuscafotospaginas").innerHTML = "";
		var texto = $i("i3GEObuscafotostexto").value,
			ai = $i("i3GEObuscafotosai").value,
			af = $i("i3GEObuscafotosaf").value,
			m,
			cp,
			p;
		i3GEOF.buscaFotos.escondexy();
		if(i3GEO.parametros.mapexten)
		{m = i3GEO.parametros.mapexten;}
		else
		{m = "-43.5680912209 -23.1679922593 -42.6162372815 -22.4685575305";}
		cp = new cpaint();
		cp.set_response_type("JSON");
		if($i("i3GEObuscafotosbuscaflickr").checked){
			$i("i3GEObuscafotosf").style.display="block";
			p = i3GEO.configura.locaplic+"/ferramentas/buscafotos/funcoes.php?funcao=listafotosflickr&ret="+m+"&key="+i3GEOF.buscaFotos.chaveFlicker+"&texto="+texto+"&ai="+ai+"&af="+af+"&page="+pagina;
			cp.call(p,"listafotosflickr",i3GEOF.buscaFotos.listafotosflickr);
		}
		if($i("i3GEObuscafotosbuscapanoramio").checked){
			$i("i3GEObuscafotosf").style.display="none";
			$i("i3GEObuscafotospaginas").innerHTML = parseInt(pagina,10)+15;
			ai = pagina;
			af = parseInt(pagina,10)+15;
			p = i3GEO.configura.locaplic+"/ferramentas/buscafotos/funcoes.php?funcao=listafotospanoramio&ret="+m+"&ai="+ai+"&af="+af;
			cp.call(p,"listafotospanoramio",i3GEOF.buscaFotos.listafotospanoramio);
		}
		if($i("i3GEObuscafotosbuscalocr").checked){
			$i("i3GEObuscafotosf").style.display="none";
			$i("i3GEObuscafotospaginas").innerHTML = parseInt(pagina,10)+15;
			ai = pagina;
			af = parseInt(pagina,10)+15;
			p = i3GEO.configura.locaplic+"/ferramentas/buscafotos/funcoes.php?funcao=listafotoslocr&ret="+m+"&ai="+ai+"&af="+af;
			cp.call(p,"listafotoslocr",i3GEOF.buscaFotos.listafotoslocr);
		}
	},
	/*
	Function: escondexy

	Esconde a imagem de localiza&ccedil;&atilde;o da foto no mapa
	*/
	escondexy: function(){
		if($i("pinfoto")){
			var box = $i("pinfoto");
			box.style.display = "none";
			box.style.top = "0px";
			box.style.left = "0px";
		}
	},
	/*
	Function: mostraxy

	Mostra a imagem que localiza a foto no mapa
	*/
	mostraxy: function(xy){
		if(i3GEO.Interface.ATUAL === "googleearth")
		{return;}
		xy = xy.split(",");
	 	xy = i3GEO.calculo.dd2tela(xy[1]*1,xy[0]*1,$i(i3GEO.Interface.IDMAPA),i3GEO.parametros.mapexten,i3GEO.parametros.pixelsize);
		var box = $i("pinfoto");
		box.style.display = "block";
		box.style.width = "27px";
		box.style.height = "27px";
		box.style.top = parseInt(xy[1],10) - 27 + "px";
		box.style.left = parseInt(xy[0],10) - 13 +"px";
	},
	/*
	Function: listafotospanoramio

	Monta a apresenta&ccedil;&atilde;o das fotos obtidas do servidor Panoramio
	*/
	listafotospanoramio: function(retorno){
		i3GEOF.buscaFotos.aguarde.visibility = "hidden";
		if (retorno.data===undefined )
		{$i("i3GEObuscafotosresultadofotos").innerHTML = $trad(17,i3GEOF.buscaFotos.dicionario);return;}
		eval("var data = "+retorno.data);
		var ins = "",res,i,t,p;
		if(!retorno.data)
		{ins += "<br><span style=color:red>"+$trad(18,i3GEOF.buscaFotos.dicionario)+"</span><br><br>";return;}
		res = data.count;
		ins = "";
		if (res === 1)
		{ins += "<br><span style=color:red>"+$trad(19,i3GEOF.buscaFotos.dicionario)+"</span><br><br>";}
		else
		{
			for (i=0;i<res;i++)	{
				if(data.photos[i]){
					ins += "<img src='"+data.photos[i].photo_file_url+"' ";
					ins += " onmouseout='i3GEOF.buscaFotos.escondexy()' ";
					ins += " onmouseover='i3GEOF.buscaFotos.mostraxy(\""+data.photos[i].latitude+","+data.photos[i].longitude+"\")'";
					ins += " onclick='javascript:window.open(\""+data.photos[i].owner_url+"\")' ";
					t = data.photos[i].owner_name+" - "+data.photos[i].photo_title;
					ins += "title='"+t+"' style='margin:3px;cursor:pointer;' />";
				}
			}
		}
		$i("i3GEObuscafotosresultadofotos").innerHTML = ins+"<br><br>";
		p = parseInt($i("i3GEObuscafotospaginas").innerHTML,10);
		if(res > 15){
			ins = "<span onclick='i3GEOF.buscaFotos.busca(\""+p+"\")' style='cursor:pointer;text-decoration:underline' >"+$trad(20,i3GEOF.buscaFotos.dicionario)+"&nbsp;</span>";
			$i("i3GEObuscafotospaginas").innerHTML = ins;
		}
		else
		{$i("i3GEObuscafotospaginas").innerHTML = "";}
	},
	/*
	Function: listafotosflickr

	Monta a apresenta&ccedil;&atilde;o das fotos obtidas do servidor Flickr
	*/
	listafotosflickr: function(retorno){
		i3GEOF.buscaFotos.aguarde.visibility = "hidden";
		var data,
			res,
			ins,
			i,
			t,
			p;
		if (retorno.data===undefined )
		{$i("i3GEObuscafotosresultadofotos").innerHTML = $trad(17,i3GEOF.buscaFotos.dicionario);return;}
		if((!retorno.data) || (retorno.data === ""))
		{ins = "<br><span style=color:red>"+$trad(18,i3GEOF.buscaFotos.dicionario)+"</span><br><br>";$i("i3GEObuscafotosresultadofotos").innerHTML = ins;return;}
		data = retorno.data.photo;
		res = data.length;
		ins = "";
		ins += "<span><b>"+$trad(21,i3GEOF.buscaFotos.dicionario)+":</span><br><br>";
		if (res === 0)
		{ins += "<br><span style=color:red>"+$trad(22,i3GEOF.buscaFotos.dicionario)+"</span><br><br>";}
		else
		{
			for (i=0;i<res;i++){
				ins += "<img src='http://farm"+data[i].farm+".static.flickr.com/"+data[i].server+"/"+data[i].id+"_"+data[i].secret+"_s.jpg' ";
				ins += " onmouseout='i3GEOF.buscaFotos.escondexy()' ";
				ins += " onmouseover='i3GEOF.buscaFotos.mostraxy(\""+data[i].latitude+","+data[i].longitude+"\")'";
				ins += " onclick='javascript:window.open(\"http://www.flickr.com/photos/"+data[i].owner+"/"+data[i].id+"\")' ";
				t = data[i].title;
				ins += "title='"+t+"' style='margin:3px;cursor:pointer;' />";
			}
		}
		$i("i3GEObuscafotosresultadofotos").innerHTML = ins;
		p = retorno.data.pages;
		ins = "";
		for (i=0;i<p;i++){
			ins += "<span onclick='i3GEOF.buscaFotos.busca(\""+i+"\")' style='cursor:pointer;text-decoration:underline' >"+i+"&nbsp;</span>";
		}
		$i("i3GEObuscafotospaginas").innerHTML = ins;
	},
	/*
	Function: listafotoslocr

	Monta a apresenta&ccedil;&atilde;o das fotos obtidas do servidor Locr
	*/
	listafotoslocr: function(retorno){
		i3GEOF.buscaFotos.aguarde.visibility = "hidden";
		var ins = "",
			res,
			i,
			t,
			p;
		if (retorno.data === undefined )
		{$i("i3GEObuscafotosresultadofotos").innerHTML = $trad(17,i3GEOF.buscaFotos.dicionario);return;}
		eval("var data = "+retorno.data);
		if(!retorno.data)
		{ins += "<br><span style=color:red>"+$trad(18,i3GEOF.buscaFotos.dicionario)+"</span><br><br>";return;}
		res = data.photos.length;
		ins = "";
		ins += "<span><b>"+$trad(21,i3GEOF.buscaFotos.dicionario)+":</span><br><br>";
		if (res === 0)
		{ins += "<br><span style=color:red>"+$trad(19,i3GEOF.buscaFotos.dicionario)+"</span><br><br>";}
		else{
			for (i=0;i<res;i++){
				if(data.photos[i]){
					ins += "<img src='"+data.photos[i].photo_file_url+"' ";
					ins += " onmouseout='i3GEOF.buscaFotos.escondexy()' ";
					ins += " onmouseover='i3GEOF.buscaFotos.mostraxy(\""+data.photos[i].latitude+","+data.photos[i].longitude+"\")'";
					ins += " onclick='javascript:window.open(\""+data.photos[i].owner_url+"\")' "	;
					t = data.photos[i].owner_name+" - "+data.photos[i].photo_title;
					ins += "title='"+t+"' style='margin:3px;cursor:pointer;' />";
				}
			}
		}
		$i("i3GEObuscafotosresultadofotos").innerHTML = ins;
		p = parseInt($i("i3GEObuscafotospaginas").innerHTML,10);
		if(res > 15)
		{
			ins = "<span onclick='busca(\""+p+"\")' style='cursor:pointer;text-decoration:underline' >"+$trad(20,i3GEOF.buscaFotos.dicionario)+"&nbsp;</span>";
			$i("i3GEObuscafotospaginas").innerHTML = ins;
		}
		else
		{$i("i3GEObuscafotospaginas").innerHTML = "";}
	}
};
