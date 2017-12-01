/*
Gerador de links

Classe javascript da aplica&ccedil;&atilde;o de gera&ccedil;&atilde;o de links.

L&ecirc; o conjunto de javascripts para o funcionamento da interface geradordelinks.htm

Arquivo

i3geo/classesjs/geradordelinks.js

Esse programa possu&iacute; as seguintes depend&ecirc;ncias:

i3geo/pacotes/cpaint/cpaint2.inc.compressed.js

i3geo/pacotes/openlayers/OpenLayers.js

i3geo/classesjs/compactados/funcoes_compacto.js

As depend&ecirc;ncias s&atilde;o carregadas pelo pr&oacute;prio geradordelinks.js, n&atilde;o sendo necess&aacute;rio incluir no HTML.

Licen&ccedil;a

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Veja

<i3geo/geradordelinks.htm>

<i3geo/classesjs/funcoes.js>
 */

//carrega as depend&ecirc;ncias


/*
Classe i3geo_gl_configura

Cria o objeto javascript com os parametros de configura&ccedil;&atilde;o da api e com as fun&ccedil;&otilde;es de manipula&ccedil;&atilde;o.

Example

var i3geo_gl_configura = new i3geo_gl_configura("http://localhost/i3geo","estadosl","temasa","link")

Parameters

loc_i3geo - endere&ccedil;o web onde est&aacute; instalado o i3geo.

nomeseltema - identificador do tema inicial que ser&aacute; incluido no link, normalmente estadosl

temasa - Id do elemento HTML onde a lista de temas adicionados, ou seja, os que forem escolhidos pelo usu&aacute;rio, ser&aacute; inclu&iacute;da.

link - Id do elemento HTML do tipo <a> onde ser&aacute; mostrado o link criado para o mapa.

grupo - Id do elemento HTML que receber&aacute; o combo com os grupos

subgrupo - Id do elemento HTML que receber&aacute; o combo com os subgrupos

tema - Id do elemento HTML que receber&aacute; o combo com a lista de temas

buscageo - Id do elemento HTML onde ser&aacute; inclu&iacute;da a op&ccedil;&atilde;o de busca de coordenadas geogr&aacute;ficas

menu - id do elemento HTML onde ser&aacute; incluido a lista de menus
 */
function i3geo_gl_configura(loc_i3geo,nomeseltema,temasa,link,grupo,subgrupo,tema,buscageo,menu)
{
	/*
	Id do elemento HTML onde a lista de temas adicionados, ou seja, os que forem escolhidos pelo usu&aacute;rio, ser&aacute; inclu&iacute;da.
	 */
	this.temasa = temasa;
	/*
	Id do elemento HTML do tipo <a> onde ser&aacute; mostrado o link criado para o mapa.
	 */
	this.link = link;
	/*
	Guarda o valor do parametro seltema
	 */
	this.nomeseltema = nomeseltema;
	/*
	Guarda o valor do parametro loc_i3geo
	 */
	this.loc_i3geo = loc_i3geo;
	/*
	Guarda o valor do parametro menu
	 */
	this.menu = menu;
	/*
	Guarda o valor do parametro grupo
	 */
	this.grupo = grupo;
	/*
	Guarda o valor do parametro subgrupo
	 */
	this.subgrupo = subgrupo;
	/*
	Guarda o valor do parametro tema
	 */
	this.tema = tema;
	/*
	Guarda o valor do parametro buscageo
	 */
	this.buscageo = buscageo;
	/*
	Function seltema

	Adiciona na lista de temas escolhidos pelo usu&aacute;rio um novo tema.

	Ativada quando um grupo ou subgrupo &eacute; escolhido.

	Parameters

	idtema = identificador do tema conforme definido em menutemas/menutemas.xml
	 */
	this.seltema = function(idtema){
		var html = Mustache.to_html(
				$("#templateCamada").html(),
				{"idtema": idtema}
		);
		//console.info(html)
		$("#"+$i3geo_gl.temasa).append(html);
		this.crialink();
	};
	/*
	Function crialink

	Pega os parametros especificados pelo usu&aacute;rio e monta o link para mostrar na tela.
	 */
	this.crialink = function()
	{
		var ins = $i3geo_gl.loc_i3geo+"/ms_criamapa.php?";
		var iguias = $i($i3geo_gl.temasa).getElementsByTagName("input");
		var tsl = []; //temas ligados
		var tsd = []; //temas
		var desligar = []; //forca desligar
		for (var i=0;i<iguias.length; i++){
			if (iguias[i].type == "checkbox"){
				tsd.push(iguias[i].value);
				if (iguias[i].checked == true){
					tsl.push(iguias[i].value);
				} else {
					desligar.push(iguias[i].value);
				}
			}
		}
		if(tsd.length > 0){
			ins += "&temasa="+tsd.join(" ");
		}
		if(tsl.length > 0){
			ins += "&layers="+tsl.join(" ");
		}
		if(desligar.length > 0){
			ins += "&desligar="+desligar.join(" ");
		}
		if($i("pontos").value != ""){
			ins += "&pontos="+$i("pontos").value;
			ins += "&nometemapontos="+$i("nometemapontos").value;
		}
		if($i("perfili") && $i("perfili").value != ""){
			ins += "&perfil="+$i("perfili").value;
		}
		if($i("interface").value != ""){
			ins += "&interface="+$i("interface").value;
		}

		if($i("i3geo_gl_xmin").value != "")	{
			ins += "&mapext="+$i("i3geo_gl_xmin").value+" ";
			ins += $i("i3geo_gl_ymin").value+" ";
			ins += $i("i3geo_gl_xmax").value+" ";
			ins += $i("i3geo_gl_ymax").value;
		}

		$i($i3geo_gl.link).href = ins;
		$i($i3geo_gl.link).innerHTML = ins;
	};
	/*
	Function combogrupos

	Chama a fun&ccedil;&atilde;o do i3geo que monta um combo com a lista de grupos de um menu do i3geo

	Parameters

	idMenu - id do menu que ser&aacute; pesquisado
	 */
	this.combogrupos = function(idMenu){
		$("#temas").html("");
		var grupos = function(retorno){
			if(retorno.data){
				var data = retorno.data,
					grupos = data.grupos,
					raiz = grupos[grupos.length-3].temasraiz,
					temas = [];

				//temas na raiz do menu
				temas.push("<option value=''>Escolha um tema</option>");
				$(raiz).each(function(i){
					temas.push("<option value='"+raiz[i].tid+"'>"+raiz[i].nome+"</option>");
				});
				$("#temas").html(temas.join(""));
				temas = [];
				temas.push("<option value=''>Escolha um grupo</option>");
				//grupos
				$(grupos).each(function(i){
					if(grupos[i].id_n1){
						temas.push("<option value='"+grupos[i].id_n1+"'>"+grupos[i].nome+"</option>");
					}
				});
				$("#grupos").html(temas.join(""));
			}
		};
		i3GEO.php.pegalistadegrupos(grupos, idMenu, "sim");
	};
	/*
	Function combosubgrupos

	Chama a fun&ccedil;&atilde;o do i3geo que monta um combo com a lista de subgrupos de um grupo do menu do i3geo

	Parameters

	idGrupo - id do grupo que ser&aacute; pesquisado
	 */
	this.combosubgrupos = function(idGrupo)
	{
		$("#temas").html("");
		var sgrupos = function(retorno){
			if(retorno.data){
				var data = retorno.data,
					sgrupos = data.subgrupo,
					raiz = data.temasgrupo,
					temas = [];

				//temas na raiz do menu
				temas.push("<option value=''>Escolha um tema</option>");
				$(raiz).each(function(i){
					temas.push("<option value='"+raiz[i].tid+"'>"+raiz[i].nome+"</option>");
				});
				$("#temas").html(temas.join(""));
				temas = [];
				temas.push("<option value=''>Escolha um subgrupo</option>");
				//subgrupos
				$(sgrupos).each(function(i){
					temas.push("<option value='"+sgrupos[i].id_n2+"'>"+sgrupos[i].nome+"</option>");
				});
				$("#subgrupos").html(temas.join(""));
			}
		};
		i3GEO.php.pegalistadeSubgrupos(sgrupos, "",idGrupo);

		//i3GEO.arvoreDeTemas.comboSubGruposMenu($i3geo_gl.loc_i3geo,"$i3geo_gl.combotemas",$i3geo_gl.subgrupo,"",idGrupo,"","");
	};
	/*
	Function combotemas

	Monta um combo com a lista de temas vinculados diretamente a um grupo.

	Chamado pela fun&ccedil;&atilde;o combosubgrupos.

	Parameters

	idGrupo - id que identifica o grupo escolhido.

	idSubGrupo - id do sibgrupo
	 */
	this.combotemas = function (idGrupo,idSubGrupo,temas)
	{
		if(temas == undefined)
		{temas = "";}
		$i($i3geo_gl.tema).innerHTML = "<span style=color:red >Aguarde...</span>";
		i3GEO.arvoreDeTemas.comboTemasMenu($i3geo_gl.loc_i3geo,"$i3geo_gl.preseltema",$i3geo_gl.tema,"",idGrupo,idSubGrupo,"","","",temas);
	};
	this.combointerfaces = function(){
		var temp = function(retorno){
			var ins = "<select class='form-control' id=interface onchange='$i3geo_gl.crialink()'><option value=''>Default</option>",
			d = retorno.data,
			n = d.length,
			i;
			for(i=0; i<n; i++){
				ins += "<option value='"+d[i]+"'>"+d[i]+"</option>";
			}
			ins += "</select>";
			$i("comboInterfaces").innerHTML = ins;
		};
		i3GEO.php.listaInterfaces(temp);
	};
	/*
	Function preseltema

	Compatibiliza a chamada da fun&ccedil;&atilde;o i3geo_combotemasMenu com a fun&ccedil;&atilde;o this.seltema em termos de n&uacute;mero de parametros
	 */
	this.preseltema = function(idgrupo,idsubgrupo,idtema)
	{
		$i3geo_gl.seltema(idtema);
	};
	/*
	Function preview

	Mostra um preview do tema clicado.

	Parameters

	e - elemento do DOM do objeto clicado.
	 */
	this.preview = function(e)
	{
		var id = i3GEO.util.pegaElementoPai(e).id;
		window.open("testamapfile.php?map="+id+".map&tipo=grande");
	};
	/*
	Function descer

	Desce um tema na lista de temas selecionados.

	Parameters

	e - elemento do DOM do objeto clicado.
	 */
	this.descer = function(e)
	{
		var el = $("#"+e);
		var p = el.next("ul");
		if(p){
			p.after(el);
		}
		$i3geo_gl.crialink();
		return false;
	};
	/*
	Function subir

	Sobe um tema na lista de temas selecionados

	Parameters

	e - elemento do DOM.
	 */
	this.subir = function(e)
	{
		var el = $("#"+e);
		var p = el.prev("ul");
		if(p){
			p.before(el);
		}
		$i3geo_gl.crialink();
		return false;
	};
	/*
	Function excluir

	Exclui um tema da lista de temas selecionados

	Parameters

	e - elemento do DOM.
	 */
	this.excluir = function(e){
		$("#"+e).remove();
		$i3geo_gl.crialink();
	};
	/*
	Function buscageo_init

	Inicializa o OpenLayers para permitir ao usu&aacute;rio escolher a abrang&ecirc;ncia espacial do link.
	 */
	this.buscageo_init = function(){
		$i3geo_gl.OL = new ol.Map({
			layers: [
			         new ol.layer.Tile({
			        	 source: new ol.source.OSM()
			         })
			         ],
			         target: 'i3geo_gl_mapa1',
			         view: new ol.View({
			        	 center: [0, 0],
			        	 zoom: 2
			         })
		});
		$i3geo_gl.OL.capturageo = function()
		{
			var e = $i3geo_gl.OL.getView().calculateExtent($i3geo_gl.OL.getSize());
			e = ol.proj.transformExtent(e,"EPSG:900913","EPSG:4326");
			$i("i3geo_gl_xmin").value = e[0];
			$i("i3geo_gl_xmax").value = e[2];
			$i("i3geo_gl_ymin").value = e[1];
			$i("i3geo_gl_ymax").value = e[3];
			$(".coord").addClass("is-focused");
			$i3geo_gl.crialink();
		};
	};
}
/*
Function i3geo_gl_inicia

Inicia a interface do gerador de links.

Parameters

objeto_i3geo_gl_configura - objeto com os paramentros de configura&ccedil;&atilde;o criado pela fun&ccedil;&atilde;o i3geo_gl_configura
 */
function i3geo_gl_inicia(objeto_i3geo_gl_configura)
{
	/*
	Propriedade $i3geo_gl

	Cont&eacute;m o objeto $i3geo_gl com todas as propriedades e fun&ccedil;&otilde;es de controle da interface
	 */
	i3GEO.configura.sid = "";
	$i3geo_gl = objeto_i3geo_gl_configura;
	if(document.getElementById($i3geo_gl.buscageo)){
		$i3geo_gl.buscageo_init();
	}
	$i3geo_gl.combointerfaces();
	//pega a lista de menus e as
	i3GEO.arvoreDeTemas.comboMenus($i3geo_gl.loc_i3geo,"$i3geo_gl.combogrupos",$i3geo_gl.menu,"","530","1","");
}
function alerta(texto,d){
	if(!d){
		d = 500;
	}
	var a = $(".alert");
	a.html(texto);
	a.slideDown(d);
	a.delay(d).slideUp(d);
}