/*
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
//inicializa
new YAHOO.widget.Button("botao1",{onclick:{fn: function(){
	executa();
}}});
new YAHOO.widget.Button("botao2",{onclick:{fn: function(){
	testa();
}}});

aguarde("block")
parametrosURL()

//preenche a lista de fontes
var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=listatruetype"
var cp = new cpaint();
//cp.set_debug(2)
cp.set_response_type("JSON");
cp.call(p,"listaTrueType",listafontesf);
//monta a lista de fontes
function listafontesf(retorno)
{
	if(retorno.data.erro){aguarde("none");return;}
	var retorno = retorno.data
	var lista = retorno.split(",")
	var ins = "<select id=fonte_i >"
	ins = ins + "<option value=bitmap >bitmap</option>"
	for (i=0;i<lista.length;i++)
	{ins = ins + "<option value="+lista[i]+" >"+lista[i]+"</option>"}
	ins = ins + "</select>"
	$i("listaf").innerHTML = ins
	
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=pegaParametrosLegImg"
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"pegaParametrosLegImg",inicia);

}
function inicia(retorno)
{
	if(retorno.data != "")
	{
		$i("imagecolor").value = retorno.data.imagecolor;
		$i("position").value = retorno.data.position
		$i("status").value = retorno.data.status
		$i("outlinecolor").value = retorno.data.outlinecolor
		$i("keyspacingy").value = retorno.data.keyspacingy
		$i("keyspacingx").value = retorno.data.keyspacingx
		$i("keysizey").value = retorno.data.keysizey
		$i("keysizex").value = retorno.data.keysizex
		$i("labelsize").value = retorno.data.labelsize
		if(retorno.data.tipofonte == 1)
		{$i("fonte_i").value = "bitmap"}
		else
		{$i("fonte_i").value = retorno.data.font}
	}
	aguarde("none")
	testa()
}
function pegaParametros()
{
	var par = ""
	var v = $i("imagecolor").value
	if (v == ""){v = "-1,-1,-1"}
	par += "&imagecolor="+v
	par += "&position="+$i("position").value
	par += "&status="+$i("status").value
	var v = $i("outlinecolor").value
	if (v == ""){v = "-1,-1,-1"}
	par += "&outlinecolor="+v
	par += "&keyspacingy="+$i("keyspacingy").value
	par += "&keyspacingx="+$i("keyspacingx").value
	par += "&keysizey="+$i("keysizey").value
	par += "&keysizex="+$i("keysizex").value
	par += "&height=0"
	par += "&width=0"
	par += "&labelsize="+$i("labelsize").value
	par += "&fonte="+$i("fonte_i").value
	return(par)
}
function executa()
{
	aguarde("block")
	var temp = function()
	{
		aguarde("none")
		window.parent.i3GEO.atualiza("")
	}
	var par = pegaParametros()
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=aplicaParametrosLegImg"+par
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"mudaEscalaGrafica",temp);
}
function testa()
{
	aguarde("block")
	var temp = function(retorno)
	{
		aguarde("none")
		eval(retorno.data)
		$i("testeLegenda").src = legimagem
	}
	var par = pegaParametros()
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=testaLegenda"+par
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"testaLegenda",temp);
}
//abre a paleta de cores
function corj(obj)
{window.parent.i3GEO.util.abreCor("wdocai",obj)}
