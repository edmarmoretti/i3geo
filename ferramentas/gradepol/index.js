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
parametrosURL()
ins = "" 
t0()

function t0()
{
	ins = "<p>A grade &eacute; formada por pol&iacute;gonos espa&ccedil;ados conforme os par&acirc;metros de dx e dy."
	ins += "<p>A grade criada &eacute; adicionada como um novo tema no mapa, podendo ser utilizada em opera&ccedil;&otilde;es como o cruzamento entre pontos e pol&iacute;gonos."
	ins += "<p>O ponto inicial da grade deve ser definido pelo usu&aacute;rio e o ponto final (inferior direito) &eacute; definido em fun&ccedil;&atilde;o da abran&ecirc;ncia do mapa ou quantidade de c&eacute;lulas."
	mostraOpcao("","t1()",ins,"t0")
}
function t1()
{
	ins = "Dist&acirc;ncia entre c&eacute;lulas"
	ins += "<p>em X: "
	ins += "Grau <input onclick='javascript:this.select();' class=digitar id='xg' title='grau' type=text size=3 value='1'/>"
	ins += "Minuto <input onclick='javascript:this.select();' class=digitar id='xm' title='minuto' type=text size=5 value='00'/>"
	ins += "Segundo <input onclick='javascript:this.select();' class=digitar id='xs' title='segundo' type=text size=5 value='00.00'/>"
	ins += "<p>em Y: "
	ins += "Grau <input onclick='javascript:this.select();' class=digitar id='yg' title='grau' type=text size=3 value='1'/>"
	ins += "Minuto <input onclick='javascript:this.select();' class=digitar id='ym' title='minuto' type=text size=5 value='00'/>"
	ins += "Segundo <input onclick='javascript:this.select();' class=digitar id='ys' title='segundo' type=text size=5 value='00.00'/>"
	window.parent.g_tipoacao = "capturaponto"
	mostraOpcao("t0()","t2()",ins,"t1")
}
function t2()
{
	ins = "Coordenadas do ponto inicial superior esquerdo (utilize o sinal negativo no grau quando ao sul do equador e a oeste). <b>Voc&ecirc; pode clicar no mapa para pegar o ponto.</b>"
	ins += "<p>em X: "
	ins += "Grau<input onclick='javascript:this.select();' class=digitar id='ixg' title='grau'  type=text size=3 value='-00'/>"
	ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='ixm' title='minuto'  type=text size=5 value='00'/>"
	ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='ixs' title='segundo'  type=text size=5 value='00.00'/>"
	ins += "<p>em Y: "
	ins += "Grau<input onclick='javascript:this.select();' class=digitar id='iyg' title='grau'  type=text size=3 value='-00'/>"
	ins += "Minuto<input onclick='javascript:this.select();' class=digitar id='iym' title='minuto'  type=text size=5 value='00'/>"
	ins += "Segundo<input onclick='javascript:this.select();' class=digitar id='iys' title='segundo'  type=text size=5 value='00.00'/>"
	mostraOpcao("t1()","t3()",ins,"t2")
}
function t3()
{
	window.parent.mudaiconf("pan")
	ins = "Número de c&eacute;lulas. Máximo de 10.000."
	ins += "<p>em X: "
	ins += "<input onclick='javascript:this.select();' class=digitar id='nptx' title='em x'  type=text size=3 value='10'/>"
	ins += "<p>em Y: "
	ins += "<input onclick='javascript:this.select();' class=digitar id='npty' title='em y'  type=text size=3 value='10'/>"
	mostraOpcao("t2()","t4()",ins,"t3")
}
function t4()
{
	ins = "A grade ser&aacute; acrescentada como um novo tema no mapa"
	ins += "<br><br><input id=botaoExec size=18 class=executar type='button' value='Criar grade' />"
	mostraOpcao("t3()","",ins,"t4")
	new YAHOO.widget.Button("botaoExec",{onclick:{fn: function(){
		criargrade();
	}}});
}
function criargrade()
{
	var dx = convdmsddf("xg","xm","xs")
	var dy = convdmsddf("yg","ym","ys")
	var ix = convdmsddf("ixg","ixm","ixs")
	var iy = convdmsddf("iyg","iym","iys")
	var nptx = $i("nptx").value
	var npty = $i("npty").value
	if ((dx == 0) || (dy == 0))
	{alert("Distância entre os pontos não pode ser 0");return;}
	if ((nptx == 0) || (npty == 0))
	{alert("Número de células não pode ser 0");return;}
	if (nptx * npty > 10000)
	{alert("Número de células não pode ser maior que 10.000");return;}
	aguarde("block")
	var fim = function(retorno)
	{
		aguarde("none");
		if (retorno.data==undefined )
		{$i("fim").innerHTML = "Erro. A operação demorou muito.";}
		else
		{window.parent.i3GEO.atualiza("");}
	}
	var p = g_locaplic+"/classesphp/mapa_controle.php?g_sid="+g_sid+"&funcao=gradedepol&xdd="+dx+"&ydd="+dy+"&px="+ix+"&py="+iy+"&nptx="+nptx+"&npty="+npty
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"gradeDePol",fim);
}
