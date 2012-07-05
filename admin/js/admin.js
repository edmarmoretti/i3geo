//
//usado apenas no importador de xml
//
//vari&aacute;veis globais
navn = false;
navm = false;
//seta as vari&aacute;veis navn e navm
app = navigator.appName.substring(0,1);
if (app==='N'){navn=true;}else{navm=true;}

$mensagemAguarde = "<img src='../../imagens/aguarde.gif' />";//"<span style=color:red ><p>Aguarde...</p></span>"
$i = function(i)
{return document.getElementById(i);};
cPaint = new cpaint();
cPaint.set_async("true");
cPaint.set_response_type("JSON");
function ativaIndice(onde)
{
	var f = document.getElementsByTagName("fieldset");
	for(var t = 0;t < f.length;t++)
	{}
	var etrs = document.getElementsByTagName("legend");
	var ins = "<fieldset><legend><a name='indice' ><b>&Iacute;ndice</b></a></legend>";
	for(t = 0;t < etrs.length;t++)
	{
		ins += "<a href='#"+etrs[t].innerHTML+"'><p>"+etrs[t].innerHTML+"</p></a>";
		etrs[t].innerHTML = "<a name='"+etrs[t].innerHTML+"'>"+etrs[t].innerHTML+"</a>";

	}
	document.getElementById(onde).innerHTML = ins+"</fieldset>";
}
function ativaTR()
{
	var etrs = document.getElementsByTagName("tr");
	for(var t = 0;t < etrs.length;t++)
	{
		etrs[t].onmouseover = function()
		{this.style.backgroundColor = "beige";};
		etrs[t].onmouseout = function()
		{this.style.backgroundColor = "";};
	}
}
function ativaLegenda()
{
	var etrs = document.getElementsByTagName("legend");
	for(var t = 0;t < etrs.length;t++)
	{
		etrs[t].innerHTML = "<img src='../imagens/desce.gif' id='img_"+t+"' >&nbsp;" + etrs[t].innerHTML;
		etrs[t].onclick = function()
		{
			var c = this.parentNode.childNodes;
			for(var h = 0;h < c.length;h++)
			{
				if(c[h].style && c[h].tagName != "LEGEND")
				{
					var i = this.getElementsByTagName("img");
					if(c[h].style.display=="none"){
						c[h].style.display="block";
						i[0].src = '../imagens/sobe.gif';
					}
					else{
						c[h].style.display="none";
						i[0].src = '../imagens/desce.gif';
					}
				}
			}
		};
	}
}
function abre(url)
{
	window.location.href = url;
}
function verificaEditores()
{
	var retorna = function(retorno)
	{
		if(retorno.data=="nao")
		{document.body.innerHTML += "<p style=color:red >Voc&ecirc; n&atilde;o est&aacute; cadastrado como um editor";return;}
		montaParametros();
	};
	var p = "../php/mapfiles.php?funcao=verificaEditores";
	cPaint.call(p,"",retorna);
}
function combosimnao(marcar)
{
	var ins = "<option value='' ";
	if (marcar == ""){ins += "selected";}
	ins += ">---</option>";
	ins += "<option value='SIM' ";
	if (marcar == "sim" || marcar == "SIM"){ins += "selected";}
	ins += ">sim</option>";
	ins += "<option value='NAO' ";
	if (marcar == "nao" || marcar == "NAO"){ins += "selected";}
	ins += ">nao</option>";
	return(ins);
}
function combolista(lista,marcar)
{
	var ins = "<option value='' ";
	if (marcar == ""){ins += "selected";}
	ins += ">---</option>";
	for (var k=0;k<lista.length;k++)
	{
		ins += "<option value='"+lista[k]+"' ";
		if (marcar == lista[k] || marcar == lista[k].toLowerCase()){ins += "selected";}
		ins += ">"+lista[k]+"</option>";
	}
	return(ins);
}
function comboObjeto(obj,valor,texto,marcar)
{
	var ins = "<option value='' ";
	//if (marcar == ""){ins += "selected"}
	ins += ">---</option>";
	for (var k=0;k<obj.length;k++)
	{
		var v = eval("obj[k]."+valor);
		var t = eval("obj[k]."+texto);
		ins += "<option value='"+v+"' ";
		if (marcar == v){ins += "selected";}
		ins += ">"+t+"</option>";
	}
	return(ins);
}
function montaCampos()
{
	var ins = "";
	for (var i=0;i<$parametros.simples.length;i++)
	{
		ins += "<fieldset><legend><b>"+$parametros.simples[i].cabeca+"</b></legend>";
		ins += "<p class=mensagem >"+$parametros.simples[i].mensagem+"</p>";
		ins += "<table><tr><td><img style=cursor:pointer src=../imagens/02.png title='aplicar' onclick='salva(\""+$parametros.simples[i].variavel+"\")' /></td>";
		ins += "<td><input type=text size=70 id='"+$parametros.simples[i].variavel+"' /></td></tr></table>";
		ins += "</fieldset><br>";
	}
	document.body.innerHTML += ins;
}
function geraLinhas(dados,param,ncolunas)
{
	var nparam = param.linhas.length;
	var contaParam = 0;
	var resultado = "";
	do
	{
		var p = param.linhas[contaParam];
		var idd = eval("dados."+p.id);
		var id;
		var texto;
		if(idd != undefined)
		id = p.prefixoid+idd;
		else
		id = p.prefixoid+p.id;
		var valor = eval("dados."+p.valor);
		var titulo = p.titulo;
		if(p.texto)
		{texto = p.texto;}
		else
		{texto = "";}
		resultado += "<tr colspan='"+ncolunas+"' ><td style='background-color:rgb(250,250,250);'  ><b>"+texto+"</b></td></tr>";
		resultado += "<tr>";
		resultado += "<td>"+titulo+": </td>";
		resultado += "<td><input size=60 onchange='this.style.color=\"blue\"' type=text id='"+id+"' value='"+valor+"' /></td>";
		if(ncolunas = 3)
		resultado += "<td></td>";
		resultado += "</tr>";
		contaParam++;
	}
	while(contaParam < nparam)
	return(resultado);
}
function geraLinhas2(dados,param,funcao)
{
	var nparam = param.linhas.length;
	var contaParam = 0;
	var resultado = "";
	do
	{
		var p = param.linhas[contaParam];
		var id;
		var idd = eval("dados."+p.id);
		if(idd != undefined)
		id = p.prefixoid+idd;
		else
		id = p.prefixoid+p.id;
		var valor = eval("dados."+p.valor);
		var titulo = p.titulo;
		var texto;
		if(p.texto)
		{texto = p.texto;}
		else
		{texto = "";}
		resultado += "<br><fieldset><legend>+- "+titulo+"</legend><div style=display:none >";
		resultado += "<p class=textoAjuda style='background-color:rgb(250,250,250);' >"+texto+"</p>";
		resultado += "<p>";
		resultado += "<input size=65 onchange='this.style.color=\"blue\"' type=text id='"+id+"' value='"+valor+"' />";
		resultado += "<img src=../imagens/02.png style=cursor:pointer title='Aplicar' onclick='"+funcao+"(\""+p.id+"\",\""+p.valor+"\",this)'/>";
		resultado += "</p></div></fieldset>";
		contaParam++;
	}
	while(contaParam < nparam)
	return(resultado);
}
function registraPerfil(id,perfil)
{
	if(perfil == "")
	$i(id).value = perfil;
	else
	$i(id).value = $i(id).value+" "+perfil;
}