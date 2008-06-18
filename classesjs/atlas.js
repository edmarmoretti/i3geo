/*
Title: atlas.js

Executa as operações da interface Atlas.

Para abrir os atlas utilize http://localhost/i3geo/atlas

A definição dos atlas é feita em i3geo/menutemas/menutemas.xml ou no sistema de administração do i3geo.

File: i3geo/classesjs/atlas.js

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
/*
Variable: listaAtlas

Objeto com as informações básicas sobre os Atlas existentes.

Essa lista é obtida lendo-se o arquivo xml definido em atlasxml
*/
listaAtlas = "";
/*
Variable: atlasxml

Endereço do arquivo xml com a lista de atlas.
*/
atlasxml = "";
/*
Function: iniciaAtlas

Inicializa o Atlas.

Pega o título e monta as pranchas
*/
function iniciaAtlas()
{
	cpObjAtlas = new cpaint();
	cpObjAtlas.set_async("true");
	cpObjAtlas.set_response_type("JSON");
	var localTitulo = document.getElementById("tituloAtlas");
	var monta = function (retorno)
	{
		var ins = '<ul class="yui-nav" style="border-width:0pt 0pt 2px;border-color:rgb(240,240,240)">';
		//coloca as guias com barra de rolagem
		if (retorno.data.tipoguias == "expandida")
		{
			var ins = '<ul class="yui-nav" style="width:2000px;border-width:0pt 0pt 2px;border-color:rgb(240,240,240)">';
			//if(navm)
			//{
				document.getElementById("guiasAtlas").style.width=objmapa.w;
			//}
			document.getElementById("guiasAtlas").style.height="35px";
		}
		var texto = "";
		var pranchas = retorno.data.pranchas;
		var pai = document.getElementById("guiasAtlas");
		if (pai)
		{
			pai.className = "yui-navset";
			var i = 0;
			do
			{
				if (pranchas[i])
				{
					//monta as guias das pranchas
					ins += '<li><a href="#"><em><div onclick="abrePrancha(\''+pranchas[i].id+'\')" id=guiaAtlas'+i+' style=text-align:center;font-size:10px;left:0px; >';
					var icone = g_locaplic+"/imagens/branco.gif";
					if(pranchas[i].icone != "")
					{
						var icone = pranchas[i].icone;
					}
					ins += "<img src='"+icone+"'/>&nbsp;";
					ins += pranchas[i].titulo+'</div></em></a></li>';
				}
				var i = i + 1;
			}
			while(pranchas[i])
			ins += "</ul>";
			pai.innerHTML = ins;
		}
		if (localTitulo)
		{
			var icone = g_locaplic+"/imagens/branco.gif";
			if (retorno.data.icone != "")
			{var icone = retorno.data.icone;}
			localTitulo.innerHTML = retorno.data.titulo;

		}
		if (retorno.data.link != "")
		{wdocaf(retorno.data.w+"px",retorno.data.h+"px",retorno.data.link,"center","","Info");}
		if(retorno.data.pranchadefault != "")
		{abrePrancha(retorno.data.pranchadefault)}
		calcposf();
	}
	var p = g_locaplic+"/classesphp/atlas_controle.php?funcao=pegaListaDePranchas&g_sid="+g_sid;
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
			atlasxml = retorno.data.atlasxml;
			var i = 0;
			do
			{
				if (listaAtlas[i].ID)
				{
					var inicia = g_locaplic+"/classesphp/atlas_controle.php?atlasxml= "+atlasxml+"&atlasId_="+listaAtlas[i].ID+"&funcao=criaAtlas";
					texto += "<tr><td >";
					if (listaAtlas[i].ICONE != "")
					{
						texto += "<img src='"+listaAtlas[i].ICONE+"' />";
					}
					texto += "</td>";				
					texto += "<td><div class='titulo' style='cursor:pointer' onclick='abreatlas(\""+listaAtlas[i].ID+"\")' >";
					texto += "<input style='cursor:pointer' type='radio' name='atlas' value='"+listaAtlas[i].ID+"'/>&nbsp;";
					texto += listaAtlas[i].TITULO+"</div>";
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
		var p = g_locaplic+"/classesphp/atlas_controle.php?funcao=pegaListaDeAtlas";
		cpObjAtlas.call(p,"pegaListaDeAtlas",monta);
	}
	else
	{alert("Div listaAtlas nao existe");}
}
/*
Function: abreatlas

Abre um Atlas específico escolhido pelo usuário

Parameters:

id - id do atlas que será aberto
*/
function abreatlas(id)
{
	var inicia = g_locaplic+"/classesphp/atlas_controle.php?atlasxml="+atlasxml+"&atlasId_="+id+"&funcao=criaAtlas";
	//document.body.innerHTML = "<center>Aguarde...<br>Iniciando</center>";
	window.location = inicia;
}
/*
Function: abrePrancha

Ativa uma prancha, adicionando e ativando as camadas específicas.

Parameters:

id - id da prancha que será aberta
*/
function abrePrancha(id)
{
	objaguarde.abre("Atlas","Atlas");
	var monta = function(retorno)
	{
		objaguarde.fecha("Atlas");
		if(retorno.data.link != "")
		{
			wdocaf(retorno.data.w+"px",retorno.data.h+"px",retorno.data.link,"center","","Info");
		}
		remapaf();
	}
	var p = g_locaplic+"/classesphp/atlas_controle.php?g_sid="+g_sid+"&funcao=abrePrancha&pranchaId="+id;
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