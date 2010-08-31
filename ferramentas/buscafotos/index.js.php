<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Busca fotos

Busca fotos em serviços como Panoramio e Flicker na região mostrada no mapa.

As fotos obtidas são mostradas e o usuário pode passar o mouse sobre elas para ver a posição no mapa.
O código para realizar a busca depende das APIs de cada serviço. Quando necessário, utiliza-se
buscafotos/funcoes.php para realizar a busca.

Veja:

<i3GEO.navega.dialogo.buscaFotos>

Arquivo:

i3geo/ferramentas/buscafotos/index.js.php

About: Licença

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
Class: i3GEOF.buscaFotos
*/
i3GEOF.buscaFotos = {
	/*
	Variavel: aguarde
	
	Objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Propriedade: chaveFlicker
	
	Código de acesso aos web services do Flicker
	*/
	chaveFlicker: "b170cde3c3064ca44b1ae0fbe747575d",
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
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
			if(i3GEO.parametros.mapscale === ""){
				i3GEOF.buscaFotos.mostraMenu();
				$i("i3GEObuscafotosbuscapanoramio").checked = true;
				i3GEOF.buscaFotos.busca("1");
			}
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
		var ins = '';
		ins += '<div id=i3GEObuscafotosaviso style=display:block >';
		ins += '<p class="paragrafo" >As fotos mostradas aqui s&atilde;o de responsabilidade dos servi&ccedil;os de hospedagem utilizados na busca e podem abranger tem&aacute;ticas diversas.';
		ins += '<p class="paragrafo" >A busca &eacute; feita apenas para a regi&atilde;o de abrang&ecirc;ncia do mapa atual.';
		ins += '<p class="paragrafo" >A restrição de escala é necessária para melhorar a performance da busca.';
    	if(i3GEO.parametros.mapscale > 30000001){
    		ins += '<p class="paragrafo" >O mapa atual está fora do limite de escala.';
    		ins += '<p class="paragrafo" ><input id=i3GEObuscafotosbotao3 size=20  type=button value="Ajustar" />';
    	}
    	else{
    		ins += '<p><input  id=i3GEObuscafotosbotao2 size=20  type=button value="Continuar" />';
    	}
		ins += '</div>';
		ins += '<div id=i3GEObuscafotosbusca style=display:none >';
		ins += '	<div id="i3GEObuscafotosf" style="display:none">';
		ins += '		<p class="paragrafo" ><i>Este produto usa a API do Flickr, mas n&atilde;o &eacute; endossado nem certificado pelo Flickr.</i>';
		ins += '		<p class="paragrafo" >Opções: Se nenhum par&acirc;metro for definido, ser&atilde;o consideradas apenas as fotos inclu&iacute;das nas &uacute;ltimas 12 horas.';
		ins += '		De qualquer forma, s&atilde;o mostrados no m&aacute;ximo 250 registros. ';
		ins += '		O ano refere-se a data de inclus&atilde;o da foto no Flickr';
		ins += '		<p class="paragrafo" >Texto: <input onclick="javascript:this.select();" style="cursor:text" class=digitar type=text size=30 value="" id="i3GEObuscafotostexto" />';
		ins += '		<p class="paragrafo" >Ano inicial: <input onclick="javascript:this.select();" style="cursor:text" class=digitar type=text size=10 value="2009" id="i3GEObuscafotosai" />';
		ins += '		&nbsp;Ano final: <input onclick="javascript:this.select();" style="cursor:text" class=digitar type=text size=10 value="2009" id="i3GEObuscafotosaf" /><br><br>';
		ins += '		<input  id=i3GEObuscafotosbotao1 size=20  type=button value="Procurar fotos" />';
		ins += '	</div>';
		ins += '	<div>';
		ins += '	<p class="paragrafo" >Servidores:';
		ins += '	<input type=radio style="top:2px;background-color:#f2f2f2;none;border:0px solid white;cursor:pointer;position:relative;" onclick="i3GEOF.buscaFotos.esconde(this)" name=buscador value=flickr id=i3GEObuscafotosbuscaflickr  /><a href="http://www.flickr.com" target="_blank" >Flickr</a>';
		ins += '	<input type=radio style="top:2px;background-color:#f2f2f2;border:0px solid white;cursor:pointer;position:relative;" onclick="i3GEOF.buscaFotos.esconde(this)" name=buscador value=panoramio id=i3GEObuscafotosbuscapanoramio /><a href="http://www.panoramio.com" target="_blank" >Panoramio</a>';
		ins += '	<input type=radio style="top:2px;background-color:#f2f2f2;border:0px solid white;cursor:pointer;position:relative;" onclick="i3GEOF.buscaFotos.esconde(this)" name=buscador value=locr id=i3GEObuscafotosbuscalocr /><a href="http://www.locr.com" target="_blank" >Locr</a>';
		ins += '	</div>';
		ins += '	<div id="i3GEObuscafotospaginas" style="top:10px;"></div><br>';
		ins += '	<div style="top:0px;left:5px;display:block;width:99%;overflow:auto"  id="i3GEObuscafotosresultadofotos" ></div>';
		ins += '</div>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//funcao que sera executada ao ser clicado no cabeçalho da janela
		cabecalho = function(){
			i3GEOF.buscaFotos.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.buscaFotos");
		};
		//cria a janela flutuante
		titulo = "Fotos <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=74' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"350px",
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
		i3GEO.util.criaPin();
		if(!$i("i3GEOF.buscaFotos_c"))
		{return;}
		var i = $i("i3GEOF.buscaFotos_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 10000 + i3GEO.janela.ULTIMOZINDEX;
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
	
	Esconde as opções de busca dos servidores de fotos e mostra as opções do objeto especificado
	
	Parametro:
	
	obj - objeto que terá o estilo modificado para display = none
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
	
	Procura as fotos no servidor escolhido e chama a função correta de apresentação das fotos.
	
	*/
	busca: function(pagina){
		i3GEOF.buscaFotos.aguarde.visibility = "visible";
		$i("i3GEObuscafotosresultadofotos").innerHTML = "Aguarde...";
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
	
	Esconde a imagem de localização da foto no mapa
	*/
	escondexy: function(){
		if($i("boxpin")){
			var box = $i("boxpin");
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
		xy = xy.split(",");
	 	xy = i3GEO.calculo.dd2tela(xy[1]*1,xy[0]*1,$i(i3GEO.Interface.IDMAPA),i3GEO.parametros.mapexten,i3GEO.parametros.pixelsize);
		var box = $i("boxpin");
		box.style.display = "block";
		box.style.width = "21px";
		box.style.height = "25px";
		box.style.top = parseInt(xy[1],10)+"px";
		box.style.left = parseInt(xy[0],10)+"px";
	},
	/*
	Function: listafotospanoramio
	
	Monta a apresentação das fotos obtidas do servidor Panoramio
	*/
	listafotospanoramio: function(retorno){
		i3GEOF.buscaFotos.aguarde.visibility = "hidden";
		if (retorno.data===undefined )
		{$i("i3GEObuscafotosresultadofotos").innerHTML = "Erro. A operação demorou muito.";return;}
		eval("var data = "+retorno.data);
		var ins,res,i,t,p;
		if(!retorno.data)
		{ins += "<br><span style=color:red>Problemas no acesso aos dados!</span><br><br>";return;}
		res = data.count;
		ins = "";
		if (res === 1)
		{ins += "<br><span style=color:red>Nada encontrado nessa regi&atilde;o!</span><br><br>";}
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
			ins = "<span onclick='i3GEOF.buscaFotos.busca(\""+p+"\")' style='cursor:pointer;text-decoration:underline' >mais 15 fotos...&nbsp;</span>";
			$i("i3GEObuscafotospaginas").innerHTML = ins;
		}
		else
		{$i("i3GEObuscafotospaginas").innerHTML = "";}
	},
	/*
	Function: listafotosflickr
	
	Monta a apresentação das fotos obtidas do servidor Flickr
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
		{$i("i3GEObuscafotosresultadofotos").innerHTML = "Erro. A operação demorou muito.";return;}
		if((!retorno.data) || (retorno.data === ""))
		{ins = "<br><span style=color:red>Problemas no acesso aos dados!</span><br><br>";$i("i3GEObuscafotosresultadofotos").innerHTML = ins;return;}
		data = retorno.data.photo;
		res = data.length;
		ins = "";
		ins += "<span><b>Fotos encontradas na regi&atilde;o vista no mapa:</span><br><br>";
		if (res === 0)
		{ins += "<br><span style=color:red>Nada encontrado nessa regi&atilde;o!</span><br><br>";}
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
	
	Monta a apresentação das fotos obtidas do servidor Locr
	*/
	listafotoslocr: function(retorno){
		i3GEOF.buscaFotos.aguarde.visibility = "hidden";
		var ins,
			res,
			i,
			t,
			p;
		if (retorno.data === undefined )
		{$i("i3GEObuscafotosresultadofotos").innerHTML = "Erro. A operação demorou muito.";return;}
		eval("var data = "+retorno.data);
		if(!retorno.data)
		{ins += "<br><span style=color:red>Problemas no acesso aos dados!</span><br><br>";return;}
		res = data.photos.length;
		ins = "";
		ins += "<span><b>Fotos encontradas na regi&atilde;o vista no mapa:</span><br><br>";
		if (res === 0)
		{ins += "<br><span style=color:red>Nada encontrado nessa regi&atilde;o!</span><br><br>";}
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
			ins = "<span onclick='busca(\""+p+"\")' style='cursor:pointer;text-decoration:underline' >mais 15 fotos...&nbsp;</span>";
			$i("i3GEObuscafotospaginas").innerHTML = ins;
		}
		else
		{$i("i3GEObuscafotospaginas").innerHTML = "";}
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>