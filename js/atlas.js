/*
Executa as opera&ccedil;&otilde;es da interface Atlas.

Para abrir os atlas utilize http://localhost/i3geo/atlas

A defini&ccedil;&atilde;o dos atlas &eacute; feita em i3geo/menutemas/menutemas.xml ou no sistema de administra&ccedil;&atilde;o do i3geo.

Arquivo: i3geo/classesjs/atlas.js

Licen&ccedil;a:

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
*/
/*
Objeto com as informa&ccedil;&otilde;es b&aacute;sicas sobre os Atlas existentes.

Essa lista &eacute; obtida lendo-se o arquivo xml definido em atlasxml ou no sistema de administra&ccedil;&atilde;o
*/
listaAtlas = "";
/*
Endere&ccedil;o do arquivo xml com a lista de atlas.
*/
atlasxml = "";
/*
Inicializa o Atlas.

Pega o t&iacute;tulo e monta as pranchas

Parametros:

combow {numerico} - largura do combo. Para escapar, utilize 0

atlasId {numerico} id do atlas que ser&aacute; utilizado para carregar as pranchas. Se n&atilde;o for definido, o i3Geo usar&aacute; a se&ccedil;&atilde;o PHP
*/
function iniciaAtlas(combow,atlasId)
{
	var localTitulo, monta;
	if(!combow)
	{combow = 0;}
	//document.body.style.width = "100%";
	//document.body.style.height = parseInt(document.body.style.height)+20  + "px";
	cpObjAtlas = new cpaint();
	cpObjAtlas.set_async("true");
	cpObjAtlas.set_response_type("JSON");
	localTitulo = document.getElementById("tituloAtlas");
	monta = function (retorno)
	{
		var pai,ins,pranchas,i,icone;
		if(retorno.data == undefined)
		{return;}
		if(retorno.data.tipoguias == "")
		{retorno.data.tipoguias = "combo";}

		pai = document.getElementById("guiasAtlas");
		if(pai){
			ins = '<ul class="yui-nav" style="border-width:0pt 0pt 2px;border-color:rgb(240,240,240)">';
			//coloca as guias com barra de rolagem
			if (retorno.data.tipoguias == "expandida")
			{
				ins = '<ul class="yui-nav" style="width:2000px;border-width:0pt 0pt 2px;border-color:rgb(240,240,240)">';
				pai.style.width=i3GEO.parametros.w;
				pai.style.height="35px";
				//pai.style.overflow="";
			}
			pranchas = retorno.data.pranchas;
			if (retorno.data.tipoguias == "combo")
			{
				pai.style.textAlign="left";
				ins = "Escolha a prancha: <select onchange='abrePrancha(this.value)' ";
				if(combow > 0)
				{ins += "style=width:"+combow+"px ";}
				ins += ">";
				ins += "<option value=''>---</option>";
			}
			if (pai)
			{
				if(pai.className == "")
				{pai.className = "yui-navset";}
				i = 0;
				do
				{
					if (pranchas[i])
					{
						//monta as guias das pranchas
						if (retorno.data.tipoguias == "combo")
						{
							ins += "<option value='"+pranchas[i].id+"'>"+pranchas[i].titulo+"</option>";
						}
						else
						{
							ins += '<li><a href="#"><em><div onclick="abrePrancha(\''+pranchas[i].id+'\')" id=guiaAtlas'+i+' style=text-align:center;font-size:10px;left:0px; >';
							icone = i3GEO.configura.locaplic+"/imagens/branco.gif";
							if(pranchas[i].icone != "")
							{
								icone = pranchas[i].icone;
							}
							ins += "<img src='"+icone+"'/>&nbsp;";
							ins += pranchas[i].titulo+'</div></em></a></li>';
						}
					}
					i = i + 1;
				}
				while(pranchas[i]);
				if (retorno.data.tipoguias == "combo"){
					ins += "</select>";
				}
				else{
					ins += "</ul>";
				}
				pai.innerHTML = ins;
			}
		}
		if (localTitulo)
		{
			icone = i3GEO.configura.locaplic+"/imagens/branco.gif";
			if (retorno.data.icone != "")
			{icone = retorno.data.icone;}
			localTitulo.innerHTML = retorno.data.titulo;
		}
		if (retorno.data.link != ""){
			i3GEO.janela.cria(retorno.data.w+"px",retorno.data.h+"px",retorno.data.link,"center","","Info");
		}
		if(retorno.data.pranchadefault != "")
		{abrePrancha(retorno.data.pranchadefault);}
		i3GEO.mapa.ajustaPosicao();
	};
	var p = i3GEO.configura.locaplic+"/classesphp/atlas_controle.php?funcao=pegaListaDePranchas&g_sid="+i3GEO.configura.sid;
	if(atlasId)
	{p += "&atlasId="+atlasId;}
	cpObjAtlas.call(p,"pegaListaDePranchas",monta);
}
/*
Mostra a lista de Atlas dispon&iacute;veis para que o usu&aacute;rio possa escolher qual abrir.
*/
function iniciaListaAtlas()
{
	cpObjAtlas = new cpaint();
	cpObjAtlas.set_async("true");
	cpObjAtlas.set_response_type("JSON");
	pegaListaDeAtlas();
}
/*
Pega a lista de Atlas e caracter&iacute;sticas principais de cada um.
*/
function pegaListaDeAtlas()
{
	var local = document.getElementById("listaAtlas");
	if (local)
	{
		var monta = function (retorno)
		{
			var texto = "<table>";
			listaAtlas = retorno.data.atlas;
			if(listaAtlas.length <= 0)
			{
				local.innerHTML = retorno.data.tituloinstituicao+"<br><p class='paragrafo'><b>Nenhum atlas encontrado";
				return;
			}
			atlasxml = retorno.data.atlasxml;
			var i = 0;
			do
			{
				if (listaAtlas[i].ID)
				{
					var inicia = i3GEO.configura.locaplic+"/classesphp/atlas_controle.php?atlasId_="+listaAtlas[i].ID+"&funcao=criaAtlas";
					texto += "<tr><td >";
					if (listaAtlas[i].ICONE != "")
					{
						texto += "<img src='"+listaAtlas[i].ICONE+"' />";
					}
					texto += "</td>";
					texto += "<td><div class='titulo' style='cursor:pointer' onclick='abreatlas(\""+listaAtlas[i].ID+"\")' >";
					texto += "<input style='cursor:pointer' type='radio' name='atlas' value='"+listaAtlas[i].ID+"'/>&nbsp;";
					if(listaAtlas[i].PUBLICADO)
					{
						if(listaAtlas[i].PUBLICADO == "NAO" || listaAtlas[i].PUBLICADO == "nao")
						{texto += "<s>";}
					}
					texto += listaAtlas[i].TITULO+"</s></div>";
					texto += "<div class='descricao' >"+listaAtlas[i].DESCRICAO+"</div><br>";
					texto += "<div class='descricao' >Link: "+inicia+"</div><br></td>";
					texto += "</tr>";
				}
				i = i + 1;
			}
			while(listaAtlas[i]);
			local.innerHTML = texto+"</table>";
			document.getElementById("tituloinstituicao").innerHTML = retorno.data.tituloinstituicao;
		};
		var p = i3GEO.configura.locaplic+"/classesphp/atlas_controle.php?funcao=pegaListaDeAtlas";
		cpObjAtlas.call(p,"pegaListaDeAtlas",monta);
	}
	else
	{alert("Div listaAtlas nao existe");}
}
/*
Abre um Atlas espec&iacute;fico escolhido pelo usu&aacute;rio

Parametros:

id - id do atlas que ser&aacute; aberto
*/
function abreatlas(id)
{
	var inicia = i3GEO.configura.locaplic+"/classesphp/atlas_controle.php?atlasxml="+atlasxml+"&atlasId_="+id+"&funcao=criaAtlas";
	//document.body.innerHTML = "<center>Aguarde...<br>Iniciando</center>";
	window.location = inicia;
}
/*
Ativa uma prancha, adicionando e ativando as camadas espec&iacute;ficas.

Parametros:

id - id da prancha que ser&aacute; aberta
*/
function abrePrancha(id)
{
	if(id == ""){return;}
	i3GEO.janela.abreAguarde("Atlas","Atlas");
	var monta = function(retorno)
	{
		i3GEO.janela.fechaAguarde("Atlas");
		if(retorno.data.link != "")
		{
			i3GEO.janela.cria(retorno.data.w+"px",retorno.data.h+"px",retorno.data.link,"center","","Info");
		}
		try{
			if(i3GEO.Interface.ATUAL == "googlemaps")
			{i3GEO.Interface.googlemaps.removeTodosLayers();}
			if(i3GEO.Interface.ATUAL == "openlayers")
			{i3GEO.Interface.removeTodosOsLayers();}
		}
		catch(e){}
		i3GEO.arvoreDeCamadas.CAMADAS = [];
		if(retorno.data.mapexten != "")
		{i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"nenhum",retorno.data.mapexten);}
		i3GEO.mapa.refresh();
	};
	var p = i3GEO.configura.locaplic+"/classesphp/atlas_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=abrePrancha&pranchaId="+id;
	cpObjAtlas.call(p,"abrePrancha",monta);
}
/*
Abre o mapa atualmente aberto no i3geo utilizando a interface padr&atilde;o.
*/
function atlas2i3geo()
{
	var atual = window.location.href;
	var nova = atual.replace("atlas",'aplicmap');
	nova = nova.replace("#",'');
	window.location=nova;
}