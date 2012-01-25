<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Opções de filtro de imagem

Abre janela de opções para definição do tipo de filtro de imagem que será aplicado ao mapa. 

Veja:

<i3GEO.mapa.dialogo.tipoimagem>

Arquivo:

i3geo/ferramentas/tipoimagem/index.js.php

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
Classe: i3GEOF.tipoimagem
*/
i3GEOF.tipoimagem = {
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
			var temp,f;
			
			$i(iddiv).innerHTML += i3GEOF.tipoimagem.html();
			new YAHOO.widget.Button(
				"i3GEOFtipoImagemListaDeFiltrosOk",
				{onclick:{fn: i3GEOF.tipoimagem.aplicar}}
			);
			temp = $i("i3GEOFtipoImagemListaDeFiltrosOk-button").style;
			temp.minHeight = "1.5em";
			temp.padding = "0px 5px";
			
			f = i3GEO.configura.tipoimagem;
			if(f == 'nenhum')
			{f = "";}
			$i("i3GEOFtipoImagemListaDeFiltros").value = f;
			
			var temp = function(retorno){
				g_legendaHTML = retorno.data.legenda
			}
			i3GEO.php.criaLegendaHTML(temp,"","legendaseminput.htm")
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
		var ins = '<p class=paragrafo >Escolha um ou mais filtros de cores. Vc pode editar manualmente a lista de filtros.</p>' +
			'<input type=text size=29 value="" id="i3GEOFtipoImagemListaDeFiltros" style="position:relative;top:-2px" /> ' +
			'<input id=i3GEOFtipoImagemListaDeFiltrosOk type=button value="Aplicar" size=20 /><br><br>' +
			'<table class=lista6 width="200px">' +
			'	<tr>' +
			'		<td><input onclick="javascript:$i(\'i3GEOFtipoImagemListaDeFiltros\').value = \'\'" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOtipoimagemtipo value=nenhum ></td>' +
			'		<td>nenhum</td>' +
			'		<td><img onclick="javascript:$i(\'i3GEOFtipoImagemListaDeFiltros\').value = \'\'" src="'+i3GEO.configura.locaplic+'/imagens/filtro_nenhum.png" /></td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.tipoimagem.adicionar(\'cinza\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOtipoimagemtipo value=cinza ></td>' +
			'		<td>tons de cinza</td>' +
			'		<td><img onclick="i3GEOF.tipoimagem.adicionar(\'cinza\')" src="'+i3GEO.configura.locaplic+'/imagens/filtro_cinza.png" /></td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.tipoimagem.adicionar(\'sepiaclara\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOtipoimagemtipo value=sepiaclara ></td>' +
			'		<td>s&eacute;pia clara (funciona apenas com o tipo de imagem png1) </td>' +
			'		<td><img onclick="i3GEOF.tipoimagem.adicionar(\'sepiaclara\')" src="'+i3GEO.configura.locaplic+'/imagens/filtro_sepiaclara.png" /></td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.tipoimagem.adicionar(\'sepianormal\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOtipoimagemtipo value=sepianormal ></td>' +
			'		<td>s&eacute;pia normal (funciona apenas com o tipo de imagem png1)</td>' +
			'		<td><img onclick="i3GEOF.tipoimagem.adicionar(\'sepianormal\')" src="'+i3GEO.configura.locaplic+'/imagens/filtro_sepianormal.png" /></td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.tipoimagem.adicionar(\'negativo\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOtipoimagemtipo value=negativo ></td>' +
			'		<td>negativo</td>' +
			'		<td><img onclick="i3GEOF.tipoimagem.adicionar(\'negativo\')" src="'+i3GEO.configura.locaplic+'/imagens/filtro_negativo.png" /></td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.tipoimagem.adicionar(\'detectaBordas\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOtipoimagemtipo value=detectaBordas ></td>' +
			'		<td>detecta bordas</td>' +
			'		<td><img onclick="i3GEOF.tipoimagem.adicionar(\'detectaBordas\')" src="'+i3GEO.configura.locaplic+'/imagens/filtro_detectabordas.png" /></td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.tipoimagem.adicionar(\'embassa\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOtipoimagemtipo value=embassa ></td>' +
			'		<td>emboss</td>' +
			'		<td><img onclick="i3GEOF.tipoimagem.adicionar(\'embassa\')" src="'+i3GEO.configura.locaplic+'/imagens/filtro_embassa.png" /></td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.tipoimagem.adicionar(\'gaussian_blur\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOtipoimagemtipo value=gaussian_blur ></td>' +
			'		<td>gaussian blur</td>' +
			'		<td><img onclick="i3GEOF.tipoimagem.adicionar(\'gaussian_blur\')" src="'+i3GEO.configura.locaplic+'/imagens/filtro_gaussianblur.png" /></td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.tipoimagem.adicionar(\'selective_blur\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOtipoimagemtipo value=selective_blur ></td>' +
			'		<td>selective blur</td>' +
			'		<td><img onclick="i3GEOF.tipoimagem.adicionar(\'selective_blur\')" src="'+i3GEO.configura.locaplic+'/imagens/filtro_selectiveblur.png" /></td>' +
			'	</tr>' +
			'	<tr>' +
			'		<td><input onclick="i3GEOF.tipoimagem.adicionar(\'mean_removal\')" style="cursor:pointer;border:0px solid white;" type=radio name=i3GEOtipoimagemtipo value=mean_removal ></td>' +
			'		<td>mean removal</td>' +
			'		<td><img onclick="i3GEOF.tipoimagem.adicionar(\'mean_removal\')" src="'+i3GEO.configura.locaplic+'/imagens/filtro_meanremoval.png" /></td>' +
			'	</tr>' +
			'</table>';
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
			i3GEO.janela.minimiza("i3GEOF.tipoimagem");
		};
		//cria a janela flutuante
		titulo = "Filtro de cores <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=1' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"310px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.tipoimagem",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.tipoimagem_corpo").style.backgroundColor = "white";
		$i("i3GEOF.tipoimagem_corpo").style.textAlign = "left";
		i3GEOF.tipoimagem.aguarde = $i("i3GEOF.tipoimagem_imagemCabecalho").style;
		i3GEOF.tipoimagem.inicia(divid);
	},
	/*
	Function: aplicar
	
	Aplica o filtro de imagem escolhido
	*/
	aplicar: function(){
		var filtro = $i("i3GEOFtipoImagemListaDeFiltros").value;
		if(filtro == "")
		{filtro = 'nenhum';}
		i3GEO.configura.tipoimagem = filtro;
		g_operacao = "outras";
		//i3GEO.atualiza();
		i3GEO.Interface.alteraParametroLayers("TIPOIMAGEM",filtro);
	},
	/*
	Function: adicionar
	
	Adiciona um filtro na lista de filtros que serão aplicados
	*/
	adicionar: function(filtro){
		$i("i3GEOFtipoImagemListaDeFiltros").value = $i("i3GEOFtipoImagemListaDeFiltros").value+" "+filtro;
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>