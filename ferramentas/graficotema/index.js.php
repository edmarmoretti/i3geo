<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

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
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}

/*
Class: i3GEOF.graficoTema

Inclui gráficos em cada elemento de um tema tendo como fonte a tabela de atributos.

Abre uma janela com várias opções e lista de itens para os gráficos.

O tema que será utilizado é o que estiver armazenado na variável global i3GEO.temaAtivo
*/
i3GEOF.graficoTema = {
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
			$i(iddiv).innerHTML += i3GEOF.graficoTema.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficotemaguia1","i3GEOgraficotemaguia");
			//eventos das guias
			$i("i3GEOgraficotemaguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficotemaguia1","i3GEOgraficotemaguia");};
			$i("i3GEOgraficotemaguia2").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOgraficotemaguia2","i3GEOgraficotemaguia");};
			new YAHOO.widget.Button(
				"i3GEOgraficotemabotao1",
				{onclick:{fn: i3GEOF.graficoTema.criaNovoTema}}
			);
			i3GEO.util.mensagemAjuda("i3GEOgraficotemamen1",$i("i3GEOgraficotemamen1").innerHTML);
			//
			//pega a lista de itens e chama a função de montagem das opções de escolha
			//
			i3GEO.php.listaItensTema(i3GEOF.graficoTema.montaListaItens,i3GEO.temaAtivo);
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var ins = '';
		ins += '<div id=i3GEOgraficotemaguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">';
		ins += '	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOgraficotemaguia1" style="text-align:center;left:0px;" >Fonte dos dados</div></em></a></li>';
		ins += '		<li><a href="#ancora"><em><div id="i3GEOgraficotemaguia2" style="text-align:center;left:0px;" >Propriedades</div></em></a></li>';
		ins += '	</ul>';
		ins += '</div><br>';
		ins += '	<div class=guiaobj id="i3GEOgraficotemaguia1obj" style="left:1px;90%;display:none;">';
		ins += '			<div id=i3GEOgraficotemacombot style="display:none;position:relative;top:5px;left:0px;">';
		ins += '			</div>';
		ins += '			<p class="paragrafo" >Escolha os itens to tipo num&eacute;rico que compor&atilde;o cada parte do gr&aacute;fico<br><br>';	
		ins += '			<div id=i3GEOgraficotemalistai class=digitar style="left:0px;top:0px;330px;height:80px;overflow:auto;display:block;">Escolha o tema para ver a lista de itens</div>';
		ins += '			<br><br>';
		ins += '			<p class="paragrafo" ><input id=i3GEOgraficotemabotao1 size=35  type=button value="Criar gráficos" />';
		ins += '		<div id=i3GEOgraficotemamen1 style=top:10px;left:1px ><p class="paragrafo">Marque os itens para compor as partes do gr&aacute;fico. Edite os valores de cor (R,G,B) conforme o desejado. Ap&oacute;s escolher os itens, clique em criar gr&aacute;ficos para inserir um novo tema com os gr&aacute;ficos.</div>';
		ins += '	</div>';
		ins += '	<div class=guiaobj id="i3GEOgraficotemaguia2obj" style="left:1px;display:none;">';
		ins += '		<table summary="" class=lista width="90%">';
		ins += '			<tr>';
		ins += '				<td>Tipo:</td>';
		ins += '				<td>';
		ins += '				<select id=i3GEOgraficotematipo >';
		ins += '				<option value="PIE">Pizza</option>';
		ins += '				<option value="BAR">Barras</option>';
		ins += '				</select>';
		ins += '				</td>';
		ins += '			</tr><tr><td>&nbsp;</td><td></td></tr>';
		ins += '			<tr>';
		ins += '				<td>Largura (em pixels):</td>';
		ins += '				<td>';
		ins += $inputText("","","i3GEOgraficotemalargura","",4,"50")+'</td>';
		ins += '			</tr><tr><td>&nbsp;</td><td></td></tr>';
		ins += '			<tr>';
		ins += '				<td>Altura (em pixels) - relevante apenas para o tipo Barras:</td>';
		ins += '				<td>';
		ins += $inputText("","","i3GEOgraficotemaaltura","",4,"50")+'</td>';
		ins += '			</tr><tr><td>&nbsp;</td><td></td></tr>';
		ins += '			<tr>';
		ins += '				<td>Deslocamento das fatias (em pixels) - relevante apenas para o tipo Pizza:</td>';
		ins += '				<td>';
		ins += $inputText("","","i3GEOgraficotemaoffset","",4,"0")+'</td>';
		ins += '			</tr><tr><td>&nbsp;</td><td></td></tr>';
		ins += '			<tr>';
		ins += '				<td>Cor do contorno:</td>';
		ins += '				<td style=width:40% >';
		ins += $inputText("","","i3GEOgraficotemaoutlinecolor","",12,"0,0,0")+'</td>';
		ins += '			</tr><tr><td>&nbsp;</td><td></td></tr>';
		ins += '		</table>';			
		ins += '	</div>';
		ins += '</div>	';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		titulo = "Graficos <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=8&idajuda=40' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"400px",
			"320px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.graficoTema",
			true,
			"hd"
		);
		divid = janela[2].id;
		i3GEOF.graficoTema.aguarde = $i("i3GEOF.graficoTema_imagemCabecalho").style;
		$i("i3GEOF.graficoTema_corpo").style.backgroundColor = "white";
		i3GEOF.graficoTema.inicia(divid);
	},
	/*
	Function: montaListaItens
	
	Monta a lista de itens que poderão ser escolhidos para compor o mapa.
	
	A lista é inserida no elemento html com id "i3GEOgraficotemalistai"
	*/
	montaListaItens: function(retorno){
		var ins,i,n;
		try{
			ins = [];
			ins.push("<table class=lista >");
			n = retorno.data.valores.length;
			for (i=0;i<n; i++){
				ins.push("<tr><td><input size=2 style='cursor:pointer' name="+retorno.data.valores[i].item+" type=checkbox id=i3GEOgraficotema"+retorno.data.valores[i].item+" /></td>");
				ins.push("<td>&nbsp;"+retorno.data.valores[i].item+"</td>");
				ins.push("<td>&nbsp;<input onclick='javascript:this.select();' id=i3GEOgraficotema"+retorno.data.valores[i].item+"cor type=text size=13 value="+i3GEO.util.randomRGB()+" /></td>");
				ins.push("<td>&nbsp;<img style=cursor:pointer src='"+i3GEO.configura.locaplic+"/imagens/aquarela.gif' onclick=\"i3GEOF.graficoTema.corj('i3GEOgraficotemacor"+retorno.data.valores[i].item+"')\" /></td></tr>");
			}
			ins.push("</table>");
			$i("i3GEOgraficotemalistai").innerHTML = ins.join("");
		}
		catch(e)
		{$i("i3GEOgraficotemalistai").innerHTML = "<p style=color:red >Ocorreu um erro<br>"+e;}	
	},
	/*
	Function: corj
	
	Abre a janela para o usuário selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: pegaItensMarcados
	
	Recupera os itens que foram marcados e monta uma lista para enviar como parâmetro para a função de geração dos gráficos
	*/
	pegaItensMarcados: function(){
		var listadeitens = [],
			inputs = $i("i3GEOgraficotemalistai").getElementsByTagName("input"),
			i,
			it,
			c,
			n;
		n = inputs.length;
		for (i=0;i<n; i++)
		{
			if (inputs[i].checked === true)
			{
				it = inputs[i].id;
				c = $i(it+"cor").value;
				listadeitens.push(it.replace("i3GEOgraficotema","")+","+c);
			}
		}
		return(listadeitens.join("*"));
	},
	/*
	Function: criaNovoTema
	
	Cria um novo tema que irá conter os gráficos e adiciona ao mapa.
	*/
	criaNovoTema: function(){
		try{
			if(i3GEOF.graficoTema.aguarde.visibility === "visible")
			{return;}
			var lista = i3GEOF.graficoTema.pegaItensMarcados(),
				outlinecolor = $i("i3GEOgraficotemaoutlinecolor").value,
				offset = $i("i3GEOgraficotemaoffset").value,
				tipo = $i("i3GEOgraficotematipo").value,
				tamanho,
				temp,
				cp = new cpaint(),
				p;
			if (tipo === "PIE")
			{tamanho = $i("i3GEOgraficotemalargura").value;}
			else
			{tamanho = $i("i3GEOgraficotemalargura").value+" "+$i("i3GEOgraficotemaaltura").value;}
			if(lista === "")
			{alert("selecione um item");return;}
			i3GEOF.graficoTema.aguarde.visibility = "visible";
			temp = function(retorno){
				i3GEOF.graficoTema.aguarde.visibility = "hidden";
				i3GEO.atualiza(retorno);
			};
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=graficotema&tema="+i3GEO.temaAtivo+"&lista="+lista+"&tamanho="+tamanho+"&tipo="+tipo+"&outlinecolor="+outlinecolor+"&offset="+offset;
			cp.set_response_type("JSON");
			cp.call(p,"graficotema",temp);
		}catch(e){alert("Erro: "+e);i3GEOF.graficoTema.aguarde.visibility = "hidden";}
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>