<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Busca de dados nos atributos de um tema

O tema alvo é o definido na variável i3GEO.temaAtivo

Veja:

<i3GEO.tema.dialogo.procuraratrib>

Arquivo:

i3geo/ferramentas/busca/index.js.php

About: Licença

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
Class: i3GEOF.busca
*/
i3GEOF.busca = {
	/*
	Variavel: nbuscas
	
	Número de buscas já feitas. Utilizado para posicionar as janelas de resultados.
	*/
	nbuscas: 0,
	/*
	Variavel: aguarde
	
	Objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Variavel: tema
	
	Código do tema utilizado na busca
	*/
	tema: i3GEO.temaAtivo,
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		i3GEO.janela.comboCabecalhoTemas("i3GEOFbuscaComboCabeca","i3GEOFbuscaComboCabecaSel","busca","ligadosComTabela");
		if(i3GEO.temaAtivo === ""){
			$i(iddiv).innerHTML = '<img src="../imagens/opcoes.gif" ><p style="position: relative; top: -35px; width: 180px; font-size: 15px; text-align: left; left: 35px;">Escolha um tema da lista</p>';
			return;
		}
		try{
			$i(iddiv).innerHTML += i3GEOF.busca.html();
			i3GEO.php.listaItensTema(i3GEOF.busca.montaListaItens,i3GEOF.busca.tema);
			new YAHOO.widget.Button(
				"i3GEObuscabotao1",
				{onclick:{fn: i3GEOF.busca.procurar}}
			);
		i3GEO.janela.comboCabecalhoTemas("i3GEOFbuscaComboCabeca","i3GEOFbuscaComboCabecaSel","busca","ligadosComTabela");		
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
		ins += '<p class="paragrafo" >';
		ins += $inputText("","","i3GEObuscapalavra","",47,"digite aqui o texto...");
		ins += '<p class="paragrafo" ><input id=i3GEObuscabotao1 size=20  type=button value="Procurar" />';
		ins += '<br><br><table summary="Lista de opcoes" class=lista3 width="250px">';
		ins += '	<tr>';
		ins += '		<td><input style="cursor:pointer;border:0px solid white;" type=radio id=i3GEObuscaqualquer name=i3GEObuscatipo checked /></td>';
		ins += '		<td>qualquer lugar do item, ou</td>';
		ins += '	</tr>';
		ins += '	<tr>';
		ins += '		<td><input style="cursor:pointer;border:0px solid white;" type=radio id=i3GEObuscaexata name=i3GEObuscatipo /></td>';
		ins += '		<td>a frase exata</td>';
		ins += '	</tr><tr><td></td><td>&nbsp;</td></tr>';
		ins += '	<tr>';
		ins += '		<td><input style="cursor:pointer;border:0px solid white;" type=radio id=i3GEObuscamapa name=i3GEObuscaonde checked /></td>';
		ins += '		<td>procurar no mapa todo, ou</td>';
		ins += '	</tr>';
		ins += '	<tr>';
		ins += '		<td><input style="cursor:pointer;border:0px solid white;" type=radio id=i3GEObuscaregiao name=i3GEObuscaonde /></td>';
		ins += '		<td>na regi&atilde;o atual</td>';
		ins += '	</tr>';
		ins += '</table>';
		ins += '<p class="paragrafo" ><b>Buscar nos itens:</b>';
		ins += '<div id=i3GEObuscalistai class=digitar style="text-align:left;width:250px;overflow:auto;height:115px">';
		ins += '</div>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		if($i("i3GEOF.busca")){
			i3GEOF.busca.tema = i3GEO.temaAtivo;
			i3GEOF.busca.inicia("i3GEOF.busca_corpo");
			return;
		}
		//funcao que sera executada ao ser clicado no cabeçalho da janela
		cabecalho = function(){
			i3GEOF.busca.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.busca");
		};
		//cria a janela flutuante
		titulo = "<div style='z-index:1;position:absolute' id='i3GEOFbuscaComboCabeca' >------</div>&nbsp;Buscar <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=35' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"290px",
			"330px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.busca",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.busca.aguarde = $i("i3GEOF.busca_imagemCabecalho").style;
		//i3GEOF.analisaGeometrias.aguarde.visibility = "visible";
		i3GEOF.busca.inicia(divid);
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search('i3GEO.janela.comboCabecalhoTemas("i3GEOFbuscaComboCabeca","i3GEOFbuscaComboCabecaSel","busca","ligadosComTabela")') > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove('i3GEO.janela.comboCabecalhoTemas("i3GEOFbuscaComboCabeca","i3GEOFbuscaComboCabecaSel","busca","ligadosComTabela")');}			
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);		
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		if(i3GEOF.busca.tema !== "" && i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.busca.tema) === "")
		{alert("O tema ja nao existe mais no mapa");}
		var i = $i("i3GEOF.busca_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: montaListaItens
	
	Monta a lista de itens que poderão ser escolhidos.
	
	A lista é inserida no elemento html com id "i3GEObuscalistai"
	*/
	montaListaItens: function(retorno){
		var ins = "",
			i,
			n;
		try{
			ins += ("<table class=lista >");
			n = retorno.data.valores.length;
			for (i=0;i<n; i++){
				ins += "<tr><td><input size=2 style='cursor:pointer;border:0px solid white;' name='"+retorno.data.valores[i].item+";"+retorno.data.valores[i].tema+"' type=checkbox /></td>";
				ins += "<td>&nbsp;"+retorno.data.valores[i].item+" - "+retorno.data.valores[i].tema+"</td></tr>";
			}
			ins += "</table>";
			$i("i3GEObuscalistai").innerHTML = ins;
		}
		catch(e)
		{$i("i3GEObuscalistai").innerHTML = "<p style=color:red >Ocorreu um erro<br>"+e;}	
	},
	/*
	Function: procurar
	
	Executa a operação de busca
	
	Veja:
	
	<LISTAVALORESITENS>
	*/
	procurar: function(){
		if(i3GEOF.busca.aguarde.visibility === "visible")
		{return;}
		if(i3GEO.arvoreDeCamadas.pegaTema(i3GEOF.busca.tema) === "")
		{alert("O tema ja nao existe mais no mapa");return;}
		var inputs = $i("i3GEObuscalistai").getElementsByTagName("input"),
			n = inputs.length,
			listai = [],
			i,
			tipo = "exata",
			onde = "mapa",
			palavra = $i("i3GEObuscapalavra").value,
			p,
			cp;
		for (i=0;i<n; i++)
		{
			if (inputs[i].checked === true)
			{listai.push(inputs[i].name);}
		}
		if (listai.length === 0)
		{alert("Selecione um item");}
		else{
			if ($i("i3GEObuscapalavra").value === "")
			{alert("Digite uma palavra");}
			else
			{
				i3GEOF.busca.aguarde.visibility = "visible";
				if ($i("i3GEObuscaqualquer").checked === true)
				{tipo = "qualquer";}
				if ($i("i3GEObuscaregiao").checked === true)
				{onde = "regiao";}
				palavra = i3GEO.util.removeAcentos(palavra);
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listavaloresitens&palavra="+palavra+"&lista="+listai.toString()+"&tipo="+tipo+"&onde="+onde+"&ext="+i3GEO.parametros.mapexten;
				cp = new cpaint();
				cp.set_response_type("json");
				cp.call(p,"listavaloresitens",i3GEOF.busca.mostraBusca);
			}
		}	
	},
	/*
	Function: mostraBusca
	
	Monta uma nova janela com os resultados da busca.
	*/
	mostraBusca: function(retorno){
		i3GEOF.busca.aguarde.visibility = "hidden";
		var palavra = $i("i3GEObuscapalavra").value,
			idJanela = YAHOO.util.Dom.generateId(),
			naoEncontrado = "<p style=color:red >Nenhum registro encontrado<br>",
			ins = [],
			linhas,
			nlinhas,
			linha,
			nlinha,
			valores,
			x,
			y,
			i,
			er,
			tr,
			tema
			posicaoleft = parseInt($i("i3GEOF.busca_c").style.left,10)+(i3GEOF.busca.nbuscas*10),
			posicaotop  = parseInt($i("i3GEOF.busca_c").style.top,10)+(i3GEOF.busca.nbuscas*10);
		
		i3GEOF.busca.nbuscas++;
		i3GEO.janela.cria("200px","200px","",posicaoleft+290,posicaotop,palavra,idJanela);
		if (retorno.data !== undefined)
		{
			nlinhas = retorno.data.length;
			for (tema=0;tema<nlinhas; tema++){
				linhas = retorno.data[tema].resultado;
				nlinha = linhas.length;
				for (linha=0;linha<nlinha; linha++){
					valores = (linhas[linha].box).split(" ");
					x = (valores[0] * 1) + ((((valores[0] * -1) - (valores[2] * -1)) / 2) * 1);
					y = (valores[1] * 1) + ((((valores[1] * -1) - (valores[3] * -1)) / 2) * 1);			
					ins.push("<table><tr><td onclick='i3GEO.navega.zoomExt(\"\",\"\",\"\",\""+linhas[linha].box+"\")' style='cursor:pointer;color:navy'>zoom&nbsp;</td><td onclick='i3GEO.navega.zoomponto(\"\",\"\","+x+","+y+")' style='color:navy;cursor:pointer;'>&nbsp;localiza</td></tr></table>");
					for (i=0;i<linhas[linha].valores.length; i++){
						er = new RegExp(palavra, "gi");
						tr = (linhas[linha].valores[i].valor).replace(er,"<span style=color:red;text-align:left >"+palavra+"</span>");
						ins.push("<div style=width:150px;text-align:left;left:5px; >"+ linhas[linha].valores[i].item + ": " + tr + "</div><br>");
						naoEncontrado = "";
					}
			 	}
			}
			$i(idJanela+"_corpo").innerHTML = "<div style='position:relative;top:0px;left:0px;width:160;overflow:auto;'>"+naoEncontrado+ins.join("")+"</div>";
		}
		else
		{$i(idJanela+"_corpo").innerHTML = "<p style=color:red >Ocorreu um erro<br>";}
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>