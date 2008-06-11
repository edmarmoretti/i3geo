/*
Title: Arvore

Funções javascript utilizadas no sistema de administração do menu de temas

File: i3geo/admin/arvore.js

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
Function: iniciaAdmin

Inicializa as variáveis globais e checa o cadastro do editor do sistema de administração

Ao retornar, por default, executa a função montaParametros()
*/
function iniciaAdmin()
{
	verificaEditores()
}
function montaParametros()
{
	if(!$i("resultado"))
	{document.body.innerHTML += "<div id=resultado ></div>"}
}
/*
Function: listaRaiz

Monta o html com os parametros e os divs que receberão os dados dos formulários.

Para cada registro na variável $parametrs, é montado um formulário.
*/
function listaRaiz()
{
	$i("resultado").innerHTML = $mensagemAguarde
	var ins = ""
	for (i=0;i<$parametros.simples.length;i++)
	{
		ins += "<fieldset class=fieldsetRaiz ><legend style='background-color:white;'><b>"+$parametros.simples[i].cabeca+"</b></legend>"
		ins += "<p><input style=font-size:10px onclick='alterarGrupo(\"\")' type=button value='Adicionar um grupo' /></p>"
		ins += "<input style=font-size:10px onclick='alterarRaiz(\"\",\"0\",\"0\",\"temasRaiz0\")' type=button value='Adicionar tema na raiz desse n&iacute;vel' /></p>"
		ins += "<div id='temasRaiz0' ></div>"
		ins += "<div id='nivel1' ></div>"
		ins += "<p class=mensagem >"+$parametros.simples[i].mensagem+"</p>"
		ins += "<p><input style=font-size:10px onclick='alterarGrupo(\"\")' type=button value='Adicionar um grupo' /></p>"
		ins += "</fieldset><br>"
	}
	$i("resultado").innerHTML = ins
	pegaNosRaiz()
	pegaTemasRaiz(0,0,"temasRaiz0")
}
function pegaTemasRaiz(nivel,id_nivel,onde)
{
	$i(onde).innerHTML = $mensagemAguarde
	var n = $temasRaiz.length
	var ins = ""
	if(n > 0)
	{
		var ins = "<div ><fieldset style='background-color:white;' ><legend style='background-color:white;color:gray' ><b>Temas na raiz desse nível</b></legend>"
		for (i=0;i<n;i++)
		{
			if (nivel == $temasRaiz[i].nivel && id_nivel == $temasRaiz[i].id_nivel && $i("menusel").value == $temasRaiz[i].id_menu)
			{
				ins += "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td><b>Perfis (separe com v&iacute;rgula)</b></td></tr>";
				ins += "<tr>"
				ins += "<td><div class=excluir title='Excluir' onclick='excluirRaiz(\""+nivel+"\",\""+id_nivel+"\",\""+$temasRaiz[i].id_raiz+"\",\""+onde+"\")'/></td>"
				ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarRaiz(\""+$temasRaiz[i].id_raiz+"\",\""+nivel+"\",\""+id_nivel+"\",\""+onde+"\")'/></td>"
				ins += "<td><select onchange=this.style.color='blue' id='raizTema_"+$temasRaiz[i].id_raiz+"'>"
				ins += comboObjeto($temas,"id_tema","nome_tema",$temasRaiz[i].id_tema)
				ins += "</select>"
				ins += "</td>"
				ins += "<td><input onchange=this.style.color='blue'  id='raizPerfil_"+$temasRaiz[i].id_raiz+"' type=text size=35 value='"+$temasRaiz[i].perfil+"' /></td></tr>"
				ins += "</table>"
			}
		}
		ins += "</fieldset></div><br>"
	}
	$i(onde).innerHTML = ins;
}
function pegaNosRaiz()
{
	$i("nivel1").innerHTML = $mensagemAguarde
	//monta o primeiro nível
	var retorna = function(retorno)
	{
		var r = retorno.data
		var ins = "";
		var rl = r.length;
		for (i=0;i<rl;i++)
		{
			ins += "<div id=n1_"+r[i].id_n1+" ><fieldset style='border:1px solid black;background-color:white' ><legend style='background-color:white;'><b>+- grupo "+r[i].id_n1+"</b></legend>"
			ins += "<div style=display:none >"
		    ins += "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td><b>Perfis (separe com v&iacute;rgula)</b></td></tr>";
			ins += "<tr>"
			ins += "<td><div class=excluir title='Excluir' onclick='excluir(\"n1\",\""+r[i].id_n1+"\",\"id_n1\",\""+r[i].id_n1+"\")'/></td>"
			ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarGrupo(\""+r[i].id_n1+"\")'/></td>"
			ins += "<td><select onchange=this.style.color='blue' id='grupon1_"+r[i].id_n1+"'>"
			ins += comboObjeto($grupos,"id_grupo","nome_grupo",r[i].id_grupo)
			ins += "</select>"
			ins += "</td>"
			ins += "<td><input onchange=this.style.color='blue'  id='perfiln1_"+r[i].id_n1+"' type=text size=35 value='"+r[i].n1_perfil+"' /></td></tr>"
			ins += "</table>"
			ins += "<table><tr><td><input style=font-size:10px onclick='alterarRaiz(\"\",\"1\",\""+r[i].id_n1+"\",\"raizn1_"+r[i].id_n1+"\")' type=button value='Adicionar tema na raiz desse n&iacute;vel' /></td>"
			ins += "<td><input style=font-size:10px; type=button value='Adicionar sub-grupo' onclick='alterarSubGrupo(\""+r[i].id_n1+"\",\"\")'/></td>"
			ins += "<td><div class=mostrar title='Mostrar sub-grupos' onclick='pegaNosGrupo(\""+r[i].id_n1+"\")'/></td>"
			ins += "</tr></table>"
			ins += "<div id=raizn1_"+r[i].id_n1+"></div>"
			ins += "<div id=n2_"+r[i].id_n1+" style=background-color:beige ></div>"
			ins += "</div></fieldset></div><br>"
		}
		$i("nivel1").innerHTML = ins;
		for (t=0;t<rl;t++)
		{pegaTemasRaiz("1",r[t].id_n1,"raizn1_"+r[t].id_n1)}
		ativaLegenda()
	}
	var p = "../php/arvore.php?funcao=pegaN1&menu="+$i("menusel").value;
	cPaint.call(p,"",retorna);
}
function pegaNosGrupo(idn1)
{
	$i("n2_"+idn1).innerHTML = $mensagemAguarde
	var retorna = function(retorno)
	{
		var r = retorno.data
		var ins = "";
		for (i=0;i<r.length;i++)
		{
			ins += "<div id=n2x_"+r[i].id_n2+" ><fieldset><legend style='background-color:white;'><b>subgrupo "+r[i].id_n2+"</b></legend>"
		    ins += "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td><b>Perfis (separe com v&iacute;rgula)</b></td></tr>";
			ins += "<tr>"
			ins += "<td><div class=excluir title='Excluir' onclick='excluir(\"n2\",\""+r[i].id_n2+"\",\"id_n2\",\""+idn1+"\")'/></td>"
			ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarSubGrupo(\""+r[i].id_n2+"\",\""+idn1+"\")'/></td>"
			ins += "<td><select onchange=this.style.color='blue' id='subgrupon2_"+r[i].id_n2+"'>"
			ins += comboObjeto($subGrupos,"id_subgrupo","nome_subgrupo",r[i].id_subgrupo)
			ins += "</select>"
			ins += "</td>"
			ins += "<td><input onchange=this.style.color='blue'  id='perfiln2_"+r[i].id_n2+"' type=text size=35 value='"+r[i].n2_perfil+"' /></td></tr>"
			ins += "</table>"
			ins += "<table><tr>"
			ins += "<td></td>"
			ins += "<td><input style=font-size:10px; type=button value='Adicionar tema' onclick='alterarTema(\"\",\""+r[i].id_n2+"\")'/></td>"
			ins += "<td><div class=mostrar title='Mostrar temas' onclick='pegaNosSubGrupo(\""+r[i].id_n2+"\")'/></td>"
			ins += "</tr></table>"

			ins += "<div id='raizn2_"+idn1+"' ></div>"
			ins += "<div id=n3_"+r[i].id_n2+" style='background-color:rgb(245,245,245)' ></div>"
			ins += "</fieldset></div>"
		}
		$i("n2_"+idn1).innerHTML = ins;
		ativaLegenda()
	}
	var p = "../php/arvore.php?funcao=pegaN2&idn1="+idn1;
	cPaint.call(p,"",retorna);
}
function pegaNosSubGrupo(idn2)
{
	$i("n3_"+idn2).innerHTML = $mensagemAguarde
	var retorna = function(retorno)
	{
		var r = retorno.data
		var ins = "";
		for (i=0;i<r.length;i++)
		{
			ins += "<div  ><fieldset><legend style='background-color:white;'><b>tema "+r[i].id_n3+"</b></legend>"
		    ins += "<table class=lista ><tr><td></td><td></td><td><b>Nome</td><td><b>Perfis (separe com v&iacute;rgula)</b></td></tr>";
			ins += "<tr>"
			ins += "<td><div class=excluir title='Excluir' onclick='excluir(\"n3\",\""+r[i].id_n3+"\",\"id_n3\",\""+idn2+"\")'/></td>"
			ins += "<td><div class=aplicar title='Aplicar alterações' onclick='alterarTema(\""+r[i].id_n3+"\",\""+idn2+"\")'/></td>"
			ins += "<td><select onchange=this.style.color='blue' id='teman3_"+r[i].id_n3+"'>"
			ins += comboObjeto($temas,"id_tema","nome_tema",r[i].id_tema)
			ins += "</select>"
			ins += "</td>"
			ins += "<td><input onchange=this.style.color='blue'  id='perfiln3_"+r[i].id_n3+"' type=text size=35 value='"+r[i].n3_perfil+"' /></td></tr>"
			ins += "</table>"
			//ins += "<div id=n3_"+r[i].id_n2+" ></div>"
			ins += "</fieldset></div>"
		}
		$i("n3_"+idn2).innerHTML = ins;
	}
	var p = "../php/arvore.php?funcao=pegaN3&idn2="+idn2;
	cPaint.call(p,"",retorna);
}
function alterarRaiz(id_raiz,nivel,id_nivel,onde)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function(retorno)
		{
			$temasRaiz = retorno.data;
			pegaTemasRaiz(nivel,id_nivel,onde);
		}
		if (id_raiz != "")
		{
			var id_tema = $i("raizTema_"+id_raiz).value
			var perfil = $i("raizPerfil_"+id_raiz).value
		}
		else
		{
			var id_raiz = "";
			var perfil = "";
			var id_tema = ""
		}
		var p = "../php/arvore.php?funcao=alterarRaiz&id_nivel="+id_nivel+"&nivel="+nivel+"&id_raiz="+id_raiz+"&id_menu="+$i("menusel").value+"&perfil="+perfil+"&id_tema="+id_tema;
		cPaint.call(p,"",retorna);	
	//}
}
function alterarTema(id,idsubgrupo)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function()
		{pegaNosSubGrupo(idsubgrupo);}
		if (id != "")
		{
			var perfil = $i("perfiln3_"+id).value
			if(perfil == "null"){var perfil = "";}
			var idtema = $i("teman3_"+id).value
			//var idsubgrupo = ""
		}
		else
		{
			var id = "";
			var perfil = "";
			var idtema = ""
		}
		if($i("n3_"+idtema))
		$i("n3_"+idtema).innerHTML = $mensagemAguarde
		var p = "../php/arvore.php?funcao=alteraN3&id="+id+"&perfil="+perfil+"&idtema="+idtema+"&idsubgrupo="+idsubgrupo;
		cPaint.call(p,"",retorna);	
	//}

}

function alterarSubGrupo(idgrupo,id)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function()
		{pegaNosGrupo(idgrupo);}
		if (id != "")
		{
			var perfil = $i("perfiln2_"+id).value
			if(perfil == "null"){var perfil = "";}
			var idsubgrupo = $i("subgrupon2_"+id).value
		}
		else
		{
			var id = "";
			var perfil = "";
			var idsubgrupo = ""
		}
		if($i("n2_"+idsubgrupo))
		$i("n2_"+idsubgrupo).innerHTML =$mensagemAguarde
		var p = "../php/arvore.php?funcao=alteraN2&id="+id+"&perfil="+perfil+"&idsubgrupo="+idsubgrupo+"&idgrupo="+idgrupo;
		cPaint.call(p,"",retorna);	
	//}

}
/*
Function: alterarGrupo

Altera o valor de uma variável
*/
function alterarGrupo(id)
{
	//if(confirm("Você realmente quer fazer isso?"))
	//{
		var retorna = function()
		{pegaNosRaiz();}
		if (id != "")
		{
			var n1 = $i("n1_"+id).value
			var perfil = $i("perfiln1_"+id).value
			if(n1 == "null"){var n1 = "";}
			if(perfil == "null"){var perfil = "";}
			var idgrupo = $i("grupon1_"+id).value
		}
		else
		{
			var id = "";
			var perfil = "";
			var idgrupo = "";
		}
		if($i("n1_"+id))
		$i("n1_"+id).innerHTML =$mensagemAguarde
		var idmenu = $i("menusel").value
		var p = "../php/arvore.php?funcao=alteraN1&id="+id+"&perfil="+perfil+"&idgrupo="+idgrupo+"&idmenu="+idmenu;
		cPaint.call(p,"",retorna);	
	//}
}
/*
Function: excluir

Exclui um registro
*/
function excluir(prefixo,id,coluna,idnpai)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		var retorna = function(retorno)
		{
			if(retorno.data == "erro")
			{alert("Não foi possível excluir. Verifique se ainda existem elementos abaixo desse nível")}
			if(prefixo == "raiz")
			{
				$i(idnpai).innerHTML = "";
				pegaTemasRaiz("0",id_nivel,idnpai)		
			}
			if(prefixo == "n1")
			{
				pegaNosRaiz();
			}
			if(prefixo == "n2")
			{
				$i(prefixo+"_"+idnpai).innerHTML = "";
				pegaNosGrupo(idnpai)
			}
			if(prefixo == "n3")
			{
				$i(prefixo+"_"+idnpai).innerHTML = "";
				pegaNosSubGrupo(idnpai)
			}
		}
		if($i(prefixo+"_"+idnpai))
		$i(prefixo+"_"+idnpai).innerHTML = $mensagemAguarde
		
		if(prefixo == "raiz")
		var tabela = "i3geoadmin_raiz"

		if(prefixo == "n1")
		var tabela = "i3geoadmin_n1"
		
		if(prefixo == "n2")
		var tabela = "i3geoadmin_n2"

		if(prefixo == "n3")
		var tabela = "i3geoadmin_n3"
		
		var p = "../php/arvore.php?funcao=excluir&id="+id+"&tabela="+tabela+"&coluna="+coluna;
		cPaint.call(p,"",retorna);	
	}
}
/*
Function: excluirRaiz

Exclui um registro de um tema no nível raiz
*/
function excluirRaiz(nivel,id_nivel,id_raiz,idnpai)
{
	if(confirm("Você realmente quer fazer isso?"))
	{
		$i(idnpai).innerHTML = $mensagemAguarde;
		var retorna = function(retorno)
		{
			$i(idnpai).innerHTML = "";
			$temasRaiz = retorno.data;
			pegaTemasRaiz(nivel,id_nivel,idnpai)		
		}
		var tabela = "i3geoadmin_raiz"
		var p = "../php/arvore.php?funcao=excluir&id="+id_raiz+"&tabela="+tabela+"&coluna=id_raiz";
		cPaint.call(p,"",retorna);	
	}
}