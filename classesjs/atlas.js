/*
Title: Atlas

Executa as operações da interface Atlas.

Para abrir os atlas utilize http://localhost/i3geo/atlas

A definição dos atlas é feita em i3geo/menutemas/menutemas.xml ou no sistema de administração do i3geo.

Arquivo: i3geo/classesjs/atlas.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
/*
Variavel: listaAtlas

Objeto com as informações básicas sobre os Atlas existentes.

Essa lista é obtida lendo-se o arquivo xml definido em atlasxml ou no sistema de administração
*/
listaAtlas = "";
/*
Variavel: atlasxml

Endereço do arquivo xml com a lista de atlas.
*/
atlasxml = "";
/*
Function: iniciaAtlas

Inicializa o Atlas.

Pega o título e monta as pranchas

Parametros:

combow {numerico} - largura do combo. Para escapar, utilize 0

atlasId {numerico} id do atlas que será utilizado para carregar as pranchas. Se não for definido, o i3Geo usará a seção PHP
*/
function iniciaAtlas(combow,atlasId)
{
	if(!combow)
	{combow = 0;}
	document.body.style.width = "100%";
	document.body.style.height = parseInt(document.body.style.height)+20  + "px";
	cpObjAtlas = new cpaint();
	cpObjAtlas.set_async("true");
	cpObjAtlas.set_response_type("JSON");
	var localTitulo = document.getElementById("tituloAtlas");
	var monta = function (retorno)
	{
		if(retorno.data == undefined)
		{return;}
		if(retorno.data.tipoguias == "")
		{retorno.data.tipoguias = "combo"}
		
		var pai = document.getElementById("guiasAtlas");
		if(pai){
			var ins = '<ul class="yui-nav" style="border-width:0pt 0pt 2px;border-color:rgb(240,240,240)">';
			//coloca as guias com barra de rolagem
			if (retorno.data.tipoguias == "expandida")
			{
				var ins = '<ul class="yui-nav" style="width:2000px;border-width:0pt 0pt 2px;border-color:rgb(240,240,240)">';
				pai.style.width=i3GEO.parametros.w;
				pai.style.height="35px";
				//pai.style.overflow="";
			}
			var texto = "";
			var pranchas = retorno.data.pranchas;
			if (retorno.data.tipoguias == "combo")
			{
				pai.style.textAlign="left"
				ins = "Escolha a prancha: <select onchange='abrePrancha(this.value)' ";
				if(combow > 0)
				{ins += "style=width:"+combow+"px ";}
				ins += ">";
				ins += "<option value=''>---</option>"
			}
			if (pai)
			{
				if(pai.className == "")
				{pai.className = "yui-navset";}
				var i = 0;
				do
				{
					if (pranchas[i])
					{
						//monta as guias das pranchas
						if (retorno.data.tipoguias == "combo")
						{
							ins += "<option value='"+pranchas[i].id+"'>"+pranchas[i].titulo+"</option>"
						}
						else
						{
							ins += '<li><a href="#"><em><div onclick="abrePrancha(\''+pranchas[i].id+'\')" id=guiaAtlas'+i+' style=text-align:center;font-size:10px;left:0px; >';
							var icone = i3GEO.configura.locaplic+"/imagens/branco.gif";
							if(pranchas[i].icone != "")
							{
								var icone = pranchas[i].icone;
							}
							ins += "<img src='"+icone+"'/>&nbsp;";
							ins += pranchas[i].titulo+'</div></em></a></li>';
						}
					}
					var i = i + 1;
				}
				while(pranchas[i])
				if (retorno.data.tipoguias == "combo"){ins += "</select>"}
				else
				{ins += "</ul>";}
				pai.innerHTML = ins;
			}
		}
		if (localTitulo)
		{
			var icone = i3GEO.configura.locaplic+"/imagens/branco.gif";
			if (retorno.data.icone != "")
			{var icone = retorno.data.icone;}
			localTitulo.innerHTML = retorno.data.titulo;
		}
		if (retorno.data.link != "")
		{wdocaf(retorno.data.w+"px",retorno.data.h+"px",retorno.data.link,"center","","Info");}
		if(retorno.data.pranchadefault != "")
		{abrePrancha(retorno.data.pranchadefault)}
		i3GEO.mapa.ajustaPosicao();
	}
	var p = i3GEO.configura.locaplic+"/classesphp/atlas_controle.php?funcao=pegaListaDePranchas&g_sid="+i3GEO.configura.sid;
	if(atlasId)
	{p += "&atlasId="+atlasId;}
	cpObjAtlas.call(p,"pegaListaDePranchas",monta);
}
/*
Function: iniciaListaAtlas

Mostra a lista de Atlas disponíveis para que o usuário possa escolher qual abrir.
*/
function iniciaListaAtlas()
{
	cpObjAtlas = new cpaint();
	cpObjAtlas.set_async("true");
	cpObjAtlas.set_response_type("JSON");
	pegaListaDeAtlas();
}
/*
Function: pegaListaDeAtlas

Pega a lista de Atlas e características principais de cada um.
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
				local.innerHTML = retorno.data.tituloinstituicao+"<br><p><b>Nenhum atlas encontrado";
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
				var i = i + 1;
			}
			while(listaAtlas[i])
			local.innerHTML = texto+"</table>";
			document.getElementById("tituloinstituicao").innerHTML = retorno.data.tituloinstituicao
		}
		var p = i3GEO.configura.locaplic+"/classesphp/atlas_controle.php?funcao=pegaListaDeAtlas";
		cpObjAtlas.call(p,"pegaListaDeAtlas",monta);
	}
	else
	{alert("Div listaAtlas nao existe");}
}
/*
Function: abreatlas

Abre um Atlas específico escolhido pelo usuário

Parametros:

id - id do atlas que será aberto
*/
function abreatlas(id)
{
	var inicia = i3GEO.configura.locaplic+"/classesphp/atlas_controle.php?atlasxml="+atlasxml+"&atlasId_="+id+"&funcao=criaAtlas";
	//document.body.innerHTML = "<center>Aguarde...<br>Iniciando</center>";
	window.location = inicia;
}
/*
Function: abrePrancha

Ativa uma prancha, adicionando e ativando as camadas específicas.

Parametros:

id - id da prancha que será aberta
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
			wdocaf(retorno.data.w+"px",retorno.data.h+"px",retorno.data.link,"center","","Info");
		}
		try{
			if(i3GEO.Interface.ATUAL == "googlemaps")
			{i3GEO.Interface.googlemaps.removeTodosLayers();}
			if(i3GEO.Interface.ATUAL == "openlayers")
			{i3GEO.Interface.openlayers.removeTodosOsLayers();}
		}
		catch(e){}
		i3GEO.arvoreDeCamadas.CAMADAS = [];
		if(retorno.data.mapexten != "")
		{i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"nenhum",retorno.data.mapexten);}
		i3GEO.atualiza();
	}
	var p = i3GEO.configura.locaplic+"/classesphp/atlas_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=abrePrancha&pranchaId="+id;
	cpObjAtlas.call(p,"abrePrancha",monta);
}
/*
Function: atlas2i3geo

Abre o mapa atualmente aberto no i3geo utilizando a interface padrão.
*/
function atlas2i3geo()
{
	var atual = window.location.href;
	var nova = atual.replace("atlas",'aplicmap');
	var nova = nova.replace("#",'');
	window.location=nova;
}