/*
Title: Admin

Funções javascript utilizadas no sistema de administração

File: i3geo/admin/admin.js

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
//variáveis globais
/*
Variable: $mensagemAguarde
*/
$mensagemAguarde = "<span style=color:red ><p>Aguarde...</p></span>"

$i = function(i)
{return document.getElementById(i);};

/*
Variable: cPaint
Objeto cpaint para chamada ajax
*/
cPaint = new cpaint();
cPaint.set_async("true");
cPaint.set_response_type("JSON");

function ativaIndice(onde)
{
	var f = document.getElementsByTagName("fieldset")
	for(t = 0;t < f.length;t++)
	{
		f[t].innerHTML += "<p><a href='#indice'>índice</a></p>"
	}
	var etrs = document.getElementsByTagName("legend")
	var ins = "<fieldset><legend><a name='indice' ><b>Índice</b></a></legend>"
	for(t = 0;t < etrs.length;t++)
	{
		ins += "<a href='#"+etrs[t].innerHTML+"'><p>"+etrs[t].innerHTML+"</p></a>"
		etrs[t].innerHTML = "<a name='"+etrs[t].innerHTML+"'>"+etrs[t].innerHTML+"</a>";
		
	}
	document.getElementById(onde).innerHTML = ins+"</fieldset>"
}
function ativaTR()
{
	var etrs = document.getElementsByTagName("tr")
	for(t = 0;t < etrs.length;t++)
	{
		etrs[t].onmouseover = function()
		{this.style.backgroundColor = "beige"}
		etrs[t].onmouseout = function()
		{this.style.backgroundColor = ""}
	}
}

function ativaLegenda()
{
	var etrs = document.getElementsByTagName("legend")
	for(t = 0;t < etrs.length;t++)
	{
		etrs[t].onclick = function()
		{
			var c = this.parentNode.childNodes;
			for(h = 0;h < c.length;h++)
			{
				if(c[h].style && c[h].tagName != "LEGEND")
				{
					if(c[h].style.display=="none")
					c[h].style.display="block"
					else
					c[h].style.display="none"
				}
			}
		}
	}
}

/*
Function: abre

Abre uma url específica no lugar da página atual

Parameters:

url - nome do programa que será aberto
*/
function abre(url)
{
	window.location.href = url
}
/*
Function: verificaEditores

Verifica se o usuário está cadastrado como um editor do i3geo

*/
function verificaEditores()
{
	var retorna = function(retorno)
	{
		if(retorno.data=="nao")
		{document.body.innerHTML += "<p style=color:red >Você não está cadastrado como um editor";return}
		montaParametros()
	}
	var p = "../php/mapfiles.php?funcao=verificaEditores";
	cPaint.call(p,"",retorna);
}
/*
Function: combosimnao

Retorna os itens option de um combo sim nao
*/
function combosimnao(marcar)
{
	var ins = "<option value='' "
	if (marcar == ""){ins += "selected"}
	ins += ">---</option>";
	ins += "<option value='SIM' "
	if (marcar == "sim" || marcar == "SIM"){ins += "selected"}
	ins += ">sim</option>";
	ins += "<option value='NAO' "
	if (marcar == "nao" || marcar == "NAO"){ins += "selected"}
	ins += ">nao</option>";
	return(ins)
}
/*
Function: combolista

Retorna os itens option de um combo baseado em uma lista (array)
*/
function combolista(lista,marcar)
{
	var ins = "<option value='' "
	if (marcar == ""){ins += "selected"}
	ins += ">---</option>";
	for (var k=0;k<lista.length;k++)
	{
		ins += "<option value='"+lista[k]+"' "
		if (marcar == lista[k] || marcar == lista[k].toLowerCase()){ins += "selected"}
		ins += ">"+lista[k]+"</option>";
	}
	return(ins)
}
/*
Function: comboObjeto

Retorna os itens option de um combo baseado em um objeto json
*/
function comboObjeto(obj,valor,texto,marcar)
{
	var ins = "<option value='' "
	if (marcar == ""){ins += "selected"}
	ins += ">---</option>";
	for (var k=0;k<obj.length;k++)
	{
		var v = eval("obj[k]."+valor)
		var t = eval("obj[k]."+texto)
		ins += "<option value='"+v+"' "
		if (marcar == v || marcar == v.toLowerCase()){ins += "selected"}
		ins += ">"+t+"</option>";
	}
	return(ins)
}
/*
Function: montaCampos

Monta o html com os parametros

Parameters?

$parametros - array com os parâmetros
*/
function montaCampos()
{
	var ins = ""
	for (i=0;i<$parametros.simples.length;i++)
	{
		ins += "<fieldset><legend><b>"+$parametros.simples[i].cabeca+"</b></legend>"
		ins += "<p class=mensagem >"+$parametros.simples[i].mensagem+"</p>"
		ins += "<table><tr><td><img style=cursor:pointer src=../imagens/02.png title='aplicar' onclick='salva(\""+$parametros.simples[i].variavel+"\")' /></td>"
		ins += "<td><input type=text size=70 id='"+$parametros.simples[i].variavel+"' /></td></tr></table>"
		ins += "</fieldset><br>"	
	}
	document.body.innerHTML += ins
}
function geraLinhas(dados,param,ncolunas)
{
	var nparam = param.linhas.length;
	var contaParam = 0
	var resultado = "";
	do
	{
		var p = param.linhas[contaParam];
		var idd = eval("dados."+p.id)
		if(idd != undefined)
		var id = p.prefixoid+idd;
		else
		var id = p.prefixoid+p.id;
		var valor = eval("dados."+p.valor);
		var titulo = p.titulo;
		if(p.texto)
		{var texto = p.texto}
		else
		{var texto = ""}
		resultado += "<tr colspan='"+ncolunas+"' ><td style='background-color:rgb(250,250,250);'  ><b>"+texto+"</b></td></tr>"
		resultado += "<tr>"
		resultado += "<td>"+titulo+": </td>"
		resultado += "<td><input size=60 onchange='this.style.color=\"blue\"' type=text id='"+id+"' value='"+valor+"' /></td>"
		if(ncolunas = 3)
		resultado += "<td></td>"
		resultado += "</tr>"
		contaParam++
	}
	while(contaParam < nparam)
	return(resultado)
}
function geraLinhas2(dados,param,funcao)
{
	var nparam = param.linhas.length;
	var contaParam = 0
	var resultado = "";
	do
	{
		var p = param.linhas[contaParam];
		var idd = eval("dados."+p.id)
		if(idd != undefined)
		var id = p.prefixoid+idd;
		else
		var id = p.prefixoid+p.id;
		var valor = eval("dados."+p.valor);
		var titulo = p.titulo;
		if(p.texto)
		{var texto = p.texto}
		else
		{var texto = ""}
		resultado += "<br><fieldset><legend>+- "+titulo+"</legend><div style=display:none >"
		resultado += "<p class=textoAjuda style='background-color:rgb(250,250,250);' >"+texto+"</p>"
		resultado += "<p>"
		resultado += "<input size=65 onchange='this.style.color=\"blue\"' type=text id='"+id+"' value='"+valor+"' />"
		resultado += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='"+funcao+"(\""+p.id+"\",\""+p.valor+"\",this)'/>"
		resultado += "</p></div></fieldset>"		
		contaParam++
	}
	while(contaParam < nparam)
	return(resultado)
}