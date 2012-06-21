
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Legenda gráfica do mapa

Edita a legenda que é mostrada no corpo do mapa, controlando o tamanho, posição, fontes, etc.

Veja:

<i3GEO.mapa.dialogo.opcoesLegenda>

Arquivo:

i3geo/ferramentas/opcoes_legenda/index.js.php

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
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Classe: i3GEOF.opcoesLegenda

*/
i3GEOF.opcoesLegenda = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML = i3GEOF.opcoesLegenda.html();
			new YAHOO.widget.Button(
				"i3GEOopcoesLegendabotao1",
				{onclick:{fn: i3GEOF.opcoesLegenda.executa}}
			);
			new YAHOO.widget.Button(
				"i3GEOopcoesLegendabotao2",
				{onclick:{fn: i3GEOF.opcoesLegenda.testa}}
			);
			i3GEO.util.comboFontes("i3GEOopcoesLegendafonte","i3GEOopcoesLegendafontef");
			i3GEOF.opcoesLegenda.parametrosAtuais();
		}
		catch(erro){if(typeof(console) !== 'undefined'){console.error(erro);}}
		if(i3GEO.Interface.ATUAL !== "padrao")
		{alert("Essa operacao afeta apenas a legenda utilizada na ferramenta de impressao do mapa");}
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var ins = '<table summary="" class=lista >' +
			'<tr><td>Inclui no corpo do mapa?:</td><td>' +
			'	<select id=i3GEOopcoesLegendastatus >' +
			'		<option value=3 >sim</option>' +
			'		<option value=1 >nao</option>' +
			'		<option value=0 >---</option>' +
			'	</select>' +
			'<td></tr>' +
			'<tr><td>&nbsp;</td><td></td></tr>' +
			'<tr><td>Cor do fundo:</td><td>' +
			$inputText("","","i3GEOopcoesLegendaimagecolor","",12,"") +
			'<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.opcoesLegenda.corj(\'i3GEOopcoesLegendaimagecolor\')" />' +
			'</td></tr>' +
			'<tr><td>&nbsp;</td><td></td></tr>' +
			'<tr><td>Contorno dos símbolos:</td><td>' +
			$inputText("","","i3GEOopcoesLegendaoutlinecolor","",12,"") +
			'<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.opcoesLegenda.corj(\'i3GEOopcoesLegendaoutlinecolor\')" />' +
			'</td></tr>' +
			'<tr><td>&nbsp;</td><td></td></tr>' +
			'<tr><td>Posição:</td><td>' +
			'	<select id=i3GEOopcoesLegendaposition >' +
			'		<option value=101 >sup. esquerdo</option>' +
			'		<option value=107 >sup. centro</option>' +
			'		<option value=103 selected >sup. direito</option>' +
			'		<option value=104 >inf. esquerdo</option>' +
			'		<option value=108 >inf. centro</option>' +
			'		<option value=102 >inf. direito</option>' +
			'	</select>' +
			'<td></tr>' +
			'<tr><td>&nbsp;</td><td></td></tr>' +
			'<tr><td>Espaçamento em Y:</td><td>' +
			$inputText("","","i3GEOopcoesLegendakeyspacingy","",4,"") +
			'<td></tr>' +
			'<tr><td>&nbsp;</td><td></td></tr>' +
			'<tr><td>Espaçamento em X:</td><td>' +
			$inputText("","","i3GEOopcoesLegendakeyspacingx","",4,"") +
			'</td></tr>' +
			'<tr><td>&nbsp;</td><td></td></tr>' +
			'<tr><td>Tamanho do símb. Y:</td><td>' +
			$inputText("","","i3GEOopcoesLegendakeysizey","",4,"") +
			'<td></tr>' +
			'<tr><td>&nbsp;</td><td></td></tr>' +
			'<tr><td>Tamanho do símb. X:</td><td>' +
			$inputText("","","i3GEOopcoesLegendakeysizex","",4,"") +
			'<td></tr>' +
			'<tr><td>&nbsp;</td><td></td></tr>' +			
			'<tr><td>Tamanho do texto:</td><td>' +
			$inputText("","","i3GEOopcoesLegendalabelsize","",4,"") +
			'<td></tr>' +
			'<tr><td>&nbsp;</td><td></td></tr>' +			
			'<tr><td>Fonte: (teste a fonte mais adequada para apresentação correta da acentuação)</td>' +
			'	<td id=i3GEOopcoesLegendafontef >aguarde...</td>' +
			'</tr></table><br>'+
			'<p class=paragrafo >' +
			'<input id=i3GEOopcoesLegendabotao1 size=20  type=button value="Aplicar" />' +
			'<input id=i3GEOopcoesLegendabotao2 size=20 type=button value="Testar" />' +
			'</p><br><img alt="teste" src="" id=i3GEOopcoesLegendatesteLegenda style="display:none"/>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.opcoesLegenda");
		};
		//cria a janela flutuante
		titulo = "Legenda <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=2' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"320px",
			"390px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.opcoesLegenda",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.opcoesLegenda_corpo").style.backgroundColor = "white";
		$i("i3GEOF.opcoesLegenda_corpo").style.textAlign = "left";
		i3GEOF.opcoesLegenda.aguarde = $i("i3GEOF.opcoesLegenda_imagemCabecalho").style;
		i3GEOF.opcoesLegenda.inicia(divid);
	},
	/*
	Function: corj
	
	Abre a janela para o usuário selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: executa
	
	Altera a legenda
	
	Veja:
	
	<APLICAPARAMETROSLEGIMG>
	*/
	executa: function(){
		if(i3GEOF.opcoesLegenda.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesLegenda.aguarde.visibility = "visible";
		var temp = function(){
				i3GEOF.opcoesLegenda.aguarde.visibility = "hidden";
				if(i3GEO.Interface.ATUAL === "padrao")
				{i3GEO.atualiza();}
			},
			par = i3GEOF.opcoesLegenda.parametrosFormulario(),
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=aplicaParametrosLegImg"+par,
			cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"void",temp);
	},
	/*
	Function: parametrosAtuais
	
	Pega os parâmetros atuais da legenda
	
	Veja:
	
	<PEGAPARAMETROSLEGIMG>
	*/
	parametrosAtuais: function(){
		i3GEOF.opcoesLegenda.aguarde.visibility = "visible";
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=pegaParametrosLegImg",
			cp = new cpaint(),
			temp = function(retorno){
				try{
					if(retorno.data !== ""){
						$i("i3GEOopcoesLegendaimagecolor").value = retorno.data.imagecolor;
						$i("i3GEOopcoesLegendaposition").value = retorno.data.position;
						$i("i3GEOopcoesLegendastatus").value = retorno.data.status;
						$i("i3GEOopcoesLegendaoutlinecolor").value = retorno.data.outlinecolor;
						$i("i3GEOopcoesLegendakeyspacingy").value = retorno.data.keyspacingy;
						$i("i3GEOopcoesLegendakeyspacingx").value = retorno.data.keyspacingx;
						$i("i3GEOopcoesLegendakeysizey").value = retorno.data.keysizey;
						$i("i3GEOopcoesLegendakeysizex").value = retorno.data.keysizex;
						$i("i3GEOopcoesLegendalabelsize").value = retorno.data.labelsize;
					}
					i3GEOF.opcoesLegenda.aguarde.visibility = "hidden";
					//i3GEOF.opcoesLegenda.testa();
				}catch(e){
					alert("Erro. "+e);
					i3GEOF.opcoesLegenda.aguarde.visibility = "hidden";
				}
			};
		cp.set_response_type("JSON");
		cp.call(p,"pegaParametrosLegImg",temp);
	},
	/*
	Function: parametrosFormulario
	
	Pega os valores do formulário atual
	*/
	parametrosFormulario: function(){
		var par = "",
			v = $i("i3GEOopcoesLegendaimagecolor").value;
		if (v === "")
		{v = "-1,-1,-1";}
		par += "&imagecolor="+v;
		par += "&position="+$i("i3GEOopcoesLegendaposition").value;
		par += "&status="+$i("i3GEOopcoesLegendastatus").value;
		v = $i("i3GEOopcoesLegendaoutlinecolor").value;
		if (v === "")
		{v = "-1,-1,-1";}
		par += "&outlinecolor="+v;
		par += "&keyspacingy="+$i("i3GEOopcoesLegendakeyspacingy").value;
		par += "&keyspacingx="+$i("i3GEOopcoesLegendakeyspacingx").value;
		par += "&keysizey="+$i("i3GEOopcoesLegendakeysizey").value;
		par += "&keysizex="+$i("i3GEOopcoesLegendakeysizex").value;
		par += "&height=0";
		par += "&width=0";
		par += "&labelsize="+$i("i3GEOopcoesLegendalabelsize").value;
		par += "&fonte="+$i("i3GEOopcoesLegendafonte").value;
		return(par);
	},
	/*
	Function: testa
	
	Testa a legenda, mostrando uma imagem temporária
	
	Veja:
	
	<TESTALEGENDA>
	*/
	testa: function(){
		if(i3GEOF.opcoesLegenda.aguarde.visibility === "visible")
		{return;}
		i3GEOF.opcoesLegenda.aguarde.visibility = "visible";
		var temp = function(retorno){
				i3GEOF.opcoesLegenda.aguarde.visibility = "hidden";
				eval(retorno.data);
				$i("i3GEOopcoesLegendatesteLegenda").src = legimagem;
				$i("i3GEOopcoesLegendatesteLegenda").style.display = "block";
			},
			par = i3GEOF.opcoesLegenda.parametrosFormulario(),
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=testaLegenda"+par,
			cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"testaLegenda",temp);
	}
};
