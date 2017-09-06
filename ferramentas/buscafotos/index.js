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
	MARCA : false,
	/*
	Variavel: aguarde

	Objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.buscaFotos.dicionario);
		return dicionario;
	},
	/*
	Propriedade: chaveFlicker

	C&oacute;digo de acesso aos web services do Flicker
	*/
	chaveFlicker: "b170cde3c3064ca44b1ae0fbe747575d",
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta

	pagina {integer} - (opcional) p&aacute;gina que ser&aacute; mostrada. Se for definida a janela de busca ser&aacute; mostrada j&aacute; de in&iacute;cio por meio do servi&ccedil;o do panoramio
	*/
	inicia: function(iddiv,busca){
		if(i3GEOF.buscaFotos.MUSTACHE == ""){
			$.get(i3GEO.configura.locaplic + "/ferramentas/buscafotos/template_mst.html", function(template) {
				i3GEOF.buscaFotos.MUSTACHE = template;
				i3GEOF.buscaFotos.inicia(iddiv,busca);
			});
			return;
		}
		$i(iddiv).innerHTML = i3GEOF.buscaFotos.html();

		i3GEO.guias.mostraGuiaFerramenta("i3GEObuscafotosguia2", "i3GEObuscafotosguia");
		// eventos das guias
		$i("i3GEObuscafotosguia2").onclick = function() {
			i3GEO.guias.mostraGuiaFerramenta("i3GEObuscafotosguia2", "i3GEObuscafotosguia");
		};
		$i("i3GEObuscafotosguia1").onclick = function() {
			i3GEO.guias.mostraGuiaFerramenta("i3GEObuscafotosguia1", "i3GEObuscafotosguia");
		};
		i3GEOF.buscaFotos.ativaFoco();
		i3GEO.eventos.NAVEGAMAPA.push("i3GEOF.buscaFotos.busca('1')");
		if(busca){
			$i("i3GEObuscafotosbuscapanoramio").checked = true;
			i3GEOF.buscaFotos.busca(busca);
		}

	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = Mustache.render(i3GEOF.buscaFotos.MUSTACHE, i3GEOF.buscaFotos.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		if($i("i3GEOF.buscaFotos")){
			return;
		}
		//funcao que sera executada ao ser clicado no cabe&ccedil;alho da janela
		cabecalho = function(){
			i3GEOF.buscaFotos.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.buscaFotos",200);
		};
		//cria a janela flutuante
		titulo = "<span class='i3GeoTituloJanelaBsNolink' >Fotos</span></div>";
		janela = i3GEO.janela.cria(
			"430px",
			"350px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.buscaFotos",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			true,
			"",
			"",
			"",
			"",
			"74"
		);
		divid = janela[2].id;
		i3GEOF.buscaFotos.aguarde = $i("i3GEOF.buscaFotos_imagemCabecalho").style;
		i3GEOF.buscaFotos.inicia(divid);
		temp = function(){
			i3GEOF.buscaFotos.escondexy();
			i3GEO.eventos.removeEventos("NAVEGAMAPA",["i3GEOF.buscaFotos.busca('1')"]);
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){

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
		if(i3GEO.parametros.googleApiKey == ""){
            i3GEO.janela.tempoMsg($trad("precisaApiGM"));
            return;
        }
        if(i3GEO.parametros.mapscale > 3000000){
			i3GEO.janela.tempoMsg($trad('msgZoom',i3GEOF.buscaFotos.dicionario));
			return;
		}
		i3GEOF.buscaFotos.aguarde.visibility = "visible";
		$i("i3GEObuscafotosresultadofotos").innerHTML = $trad('msgAguarde',i3GEOF.buscaFotos.dicionario);
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
			p = i3GEO.configura.locaplic+"/ferramentas/buscafotos/funcoes.php?funcao=listafotosflickr&ret="+m+"&key="+i3GEOF.buscaFotos.chaveFlicker+"&texto="+texto+"&ai="+ai+"&af="+af+"&page="+pagina;
			cp.call(p,"listafotosflickr",i3GEOF.buscaFotos.listafotosflickr);
		}
		if($i("i3GEObuscafotosbuscapanoramio").checked){
			$i("i3GEObuscafotospaginas").innerHTML = parseInt(pagina,10)+15;
			ai = pagina;
			af = parseInt(pagina,10)+15;
			p = i3GEO.configura.locaplic+"/ferramentas/buscafotos/funcoes.php?funcao=listafotospanoramio&ret="+m+"&ai="+ai+"&af="+af;
			cp.call(p,"listafotospanoramio",i3GEOF.buscaFotos.listafotospanoramio);
		}
	},
	/*
	Function: escondexy

	Esconde a imagem de localiza&ccedil;&atilde;o da foto no mapa
	*/
	escondexy: function(){
		i3GEO.desenho.removePins("foto");
		i3GEOF.buscaFotos.MARCA = false;
	},
	/*
	Function: mostraxy

	Mostra a imagem que localiza a foto no mapa
	*/
	mostraxy: function(xy){
		xy = xy.split(",");
		if(i3GEOF.buscaFotos.MARCA === false){
			i3GEOF.buscaFotos.MARCA = i3GEO.desenho.addPin(xy[1]*1,xy[0]*1,"","",i3GEO.configura.locaplic+'/imagens/google/foto.png',"foto");
		}
		else{
			i3GEO.desenho.movePin(i3GEOF.buscaFotos.MARCA,xy[1]*1,xy[0]*1);
		}
	},
	/*
	Function: listafotospanoramio

	Monta a apresenta&ccedil;&atilde;o das fotos obtidas do servidor Panoramio
	*/
	listafotospanoramio: function(retorno){
		if(i3GEO.parametros.mapscale > 3000000){
			i3GEO.janela.tempoMsg($trad('msgZoom',i3GEOF.buscaFotos.dicionario));
			return;
		}
		i3GEOF.buscaFotos.aguarde.visibility = "hidden";
		if (retorno.data===undefined ){
			i3GEO.janela.tempoMsg($trad('erroTempo',i3GEOF.buscaFotos.dicionario));
			return;
		}
		eval("var data = "+retorno.data);
		var ins = "",res,i,t,p,j,f;
		if(!retorno.data){
			i3GEO.janela.tempoMsg($trad('erroAcessoDados',i3GEOF.buscaFotos.dicionario));
			return;
		}
		data = data.results;
		res = data.length;
		ins = "";
		if (res === 1){
			i3GEO.janela.tempoMsg($trad('erroNadaEncontrado',i3GEOF.buscaFotos.dicionario));
		}
		else{
			ins += "<h5>"+$trad('fotosEncontradas',i3GEOF.buscaFotos.dicionario)+"</h5>";
			for (i=0;i<res;i++)	{
				if(data[i].photos){
					f = data[i].photos.length;
					for(j=0;j<f;j++){
						ins += "<img class='img-rounded' src='https://maps.googleapis.com/maps/api/place/photo?maxwidth=200&photoreference="+data[i].photos[j].photo_reference+"&key=" + i3GEO.parametros.googleApiKey+"'";
						ins += " onmouseout='i3GEOF.buscaFotos.escondexy()' ";
						ins += " onmouseover='i3GEOF.buscaFotos.mostraxy(\"" + data[i].geometry.location.lat + "," + data[i].geometry.location.lng + "\")'";
						//ins += " onclick='javascript:window.open(\""+data[i].photos[j].html_attributions[0]+"\")' ";
						t = data[i].name;
						ins += " title='"+t+"' style='margin:3px;cursor:pointer;' />";
                        ins += "<h5>" + data[i].photos[j].html_attributions[0] + "</h5><hr>";
					}
				}
			}
		}
		$i("i3GEObuscafotospaginas").innerHTML = "";
		$i("i3GEObuscafotosresultadofotos").innerHTML = ins;

	},
	/*
	Function: listafotosflickr

	Monta a apresenta&ccedil;&atilde;o das fotos obtidas do servidor Flickr
	*/
	listafotosflickr: function(retorno){
		if(i3GEO.parametros.mapscale > 3000000){
			i3GEO.janela.tempoMsg($trad('msgZoom',i3GEOF.buscaFotos.dicionario));
			return;
		}
		i3GEOF.buscaFotos.aguarde.visibility = "hidden";
		var data,
			res,
			ins,
			i,
			t,
			p;
		if (retorno.data===undefined ){
			i3GEO.janela.tempoMsg($trad('erroTempo',i3GEOF.buscaFotos.dicionario));
			return;
		}
		if((!retorno.data) || (retorno.data === "")){
			i3GEO.janela.tempoMsg($trad('erroAcessoDados',i3GEOF.buscaFotos.dicionario));
			return;
		}
		data = retorno.data.photo;
		res = data.length;
		ins = "";
		ins += "<h5>"+$trad('fotosEncontradas',i3GEOF.buscaFotos.dicionario)+"</h5>";
		if (res === 0){
			i3GEO.janela.tempoMsg($trad('erroNadaEncontrado2',i3GEOF.buscaFotos.dicionario));
			return;
		}
		for (i=0;i<res;i++){
			ins += "<img class='img-rounded' src='http://farm"+data[i].farm+".static.flickr.com/"+data[i].server+"/"+data[i].id+"_"+data[i].secret+"_s.jpg' ";
			ins += " onmouseout='i3GEOF.buscaFotos.escondexy()' ";
			ins += " onmouseover='i3GEOF.buscaFotos.mostraxy(\""+data[i].latitude+","+data[i].longitude+"\")'";
			ins += " onclick='javascript:window.open(\"http://www.flickr.com/photos/"+data[i].owner+"/"+data[i].id+"\")' ";
			t = data[i].title;
			ins += "title='"+t+"' style='margin:3px;cursor:pointer;' />";
		}
		$i("i3GEObuscafotosresultadofotos").innerHTML = ins;
		p = retorno.data.pages;
		ins = "";
		for (i=0;i<p;i++){
			ins += "<li><a onclick='i3GEOF.buscaFotos.busca(\""+i+"\")' href='javascript:void(0)'>" + i + "</a></li>";
		}
		$i("i3GEObuscafotospaginas").innerHTML = "<nav><ul class='pagination pagination-sm'>" + ins + "</ul></nav>";
	}
};
