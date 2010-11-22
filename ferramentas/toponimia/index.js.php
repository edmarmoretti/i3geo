<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Toponímia de um tema

Ativa a apresentação da toponímia de um tema.
A toponímia é definida em função das colunas existentes na tabela de atributos.

Veja:

<i3GEO.tema.dialogo.toponimia>

Arquivo:

i3geo/ferramentas/toponimia/index.js.php

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

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
Classe: i3GEOF.toponimia

*/
i3GEOF.toponimia = {
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
			$i(iddiv).innerHTML += i3GEOF.toponimia.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia1","i3GEOtoponimiaguia");
			//eventos das guias
			$i("i3GEOtoponimiaguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia1","i3GEOtoponimiaguia");};
			$i("i3GEOtoponimiaguia2").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia2","i3GEOtoponimiaguia");};
			$i("i3GEOtoponimiaguia3").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOtoponimiaguia3","i3GEOtoponimiaguia");
				i3GEOF.toponimia.testa();
			};
			new YAHOO.widget.Button(
				"i3GEOtoponimiabotao1",
				{onclick:{fn: i3GEOF.toponimia.cria}}
			);
			//
			//pega a lista de itens e chama a função de montagem das opções de escolha
			//
			i3GEO.util.comboItens(
				"i3GEOtoponimiaListaItens",
				i3GEO.temaAtivo,
				function(retorno){
		 			$i("i3GEOtoponimiaDivListaItens").innerHTML = '<p class="paragrafo" >'+retorno.dados;
		 			$i("i3GEOtoponimiaDivListaItens").style.display = "block";
				},
				"i3GEOtoponimiaDivListaItens",
				""
			);
			i3GEO.util.comboFontes("i3GEOtoponimiaListaFonte","i3GEOtoponimiaDivListaFonte");
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
		var ins = '' +
		'<div id=i3GEOtoponimiaguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">' +
		'	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">' +
		'		<li><a href="#ancora"><em><div id="i3GEOtoponimiaguia1" style="text-align:center;left:0px;" >Fonte dos dados</div></em></a></li>' +
		'		<li><a href="#ancora"><em><div id="i3GEOtoponimiaguia2" style="text-align:center;left:0px;" >Propriedades</div></em></a></li>' +
		'		<li><a href="#ancora"><em><div id="i3GEOtoponimiaguia3" style="text-align:center;left:0px;" >Testar</div></em></a></li>' +
		'	</ul>' +
		'</div><br>' +
		'	<div class=guiaobj id="i3GEOtoponimiaguia1obj" style="left:1px;90%;display:none;">' +
		'			<p class="paragrafo" >Escolha o item que contém os textos que serão mostrados no mapa<br><br>' +	
		'			<div id=i3GEOtoponimiaDivListaItens ></div>' +
		'			<br><br>' +
		'			<p class="paragrafo" ><input id=i3GEOtoponimiabotao1 size=35  type=button value="Criar toponímia" />' +
		'	</div>' +
		'	<div class=guiaobj id="i3GEOtoponimiaguia2obj" style="left:1px;display:none;">' +
		'		<table summary="" class=lista width="98%">' +
		'			<tr><td>Fonte:</td><td><span id="i3GEOtoponimiaDivListaFonte">Aguarde...</span></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Tamanho:</td><td>' +
		$inputText("","","i3GEOtoponimiatamanho_i","",2,"8") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>&Acirc;ngulo (no caso de linhas pode ser utilizado AUTO ou FOLLOW (segue a linha), nesses casos, a fonte n&atilde;o pode ser do tipo bitmap):</td><td>' +
		$inputText("","","i3GEOtoponimiaangulo_i","",4,"0") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr>' +
		'				<td>Deslocamento do texto em rela&ccedil;&atilde;o ao ponto de inclus&atilde;o:</td>' +
		'				<td>x ' +
		$inputText("","","i3GEOtoponimiaoffsetx_i","",2,"0") +
		'					y ' +
		$inputText("","","i3GEOtoponimiaoffsety_i","",2,"0") +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor do texto:</td><td>'+
		$inputText("","","i3GEOtoponimiafrente_i","",11,"0 0 0") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.toponimia.corj(\'i3GEOtoponimiafrente_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor da m&aacute;scara de um pixel de entorno:</td><td>' +
		$inputText("","","i3GEOtoponimiamascara_i","",11,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.toponimia.corj(\'i3GEOtoponimiamascara_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr>' +
		'				<td>Posicionamento:</td>' +
		'				<td>' +
		'					<select id=i3GEOtoponimiaposition_i >' +
		'						<option value="MS_AUTO" >autom&aacute;tico</option>' +
		'						<option value="MS_UL" >superior esquerdo</option>' +
		'						<option value="MS_UC" >superior centro</option>' +
		'						<option value="MS_UR" >superior direito</option>' +
		'						<option value="MS_CL" >centro esquerdo</option>' +
		'						<option value="MS_CC" >centro</option>' +
		'						<option value="MS_CR" >centro direito</option>' +
		'						<option value="MS_LL" >inferior esquerdo</option>' +
		'						<option value="MS_LC" >inferior centro</option>' +
		'						<option value="MS_LR" >inferior direito</option>' +
		'					</select>' +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor do fundo:</td><td>' +
		$inputText("","","i3GEOtoponimiafundoc_i","",9,"") +
		'				<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.toponimia.corj(\'i3GEOtoponimiafundoc_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor da sombra do fundo:</td><td>'+
		$inputText("","","i3GEOtoponimiasombra_i","",9,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.toponimia.corj(\'i3GEOtoponimiasombra_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Deslocamento da sombra do fundo:</td><td>x ' +
		$inputText("","","i3GEOtoponimiasombrax_i","",1,"1") +
		'			 y' +
		$inputText("","","i3GEOtoponimiasombray_i","",1,"1") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor da sombra:</td><td>' +
		$inputText("","","i3GEOtoponimiafrentes_i","",9,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.toponimia.corj(\'i3GEOtoponimiafrentes_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Deslocamento da sombra:</td><td>x '+
		$inputText("","","i3GEOtoponimiafrentex_i","",1,"1") +
		'			 y '+
		$inputText("","","i3GEOtoponimiafrentey_i","",1,"1") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>For&ccedil;a colis&otilde;es entre textos?:</td>' +
		'				<td>' +
		'					<select id=i3GEOtoponimiaforce_i >' +
		'						<option value="0" >n&atilde;o</option>' +
		'						<option value="1" >sim</option>' +
		'					</select>' +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Dist&acirc;ncia m&iacute;nima entre textos duplicados (em pixel):</td><td>' +
		$inputText("","","i3GEOtoponimiamindistance_i","",4,"auto") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Tamanho m&iacute;nimo do elemento cartogr&aacute;fico(em pixel):</td><td>' +
		$inputText("","","i3GEOtoponimiaminfeaturesize_i","",4,"auto") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>O texto pode ultrapassar o mapa?:</td>' +
		'				<td>' +
		'					<select id=i3GEOtoponimiapartials_i >' +
		'						<option value="1" >sim</option>' +
		'						<option value="0" >n&atilde;o</option>' +
		'					</select>' +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Caractere usado para indicar uma quebra de texto:</td><td>' +
		$inputText("","","i3GEOtoponimiawrap_i","",5,"") +
		'			</td></tr>' +
		'		</table>' +			
		'	</div>' +
		'	<div class=guiaobj id="i3GEOtoponimiaguia3obj" style="left:1px;90%;display:none;">' +
		'		<div id=i3GEOtoponimiaTeste style="width:98%;top:15px;left:0px;" ></div>' +
		'	</div>' +
		'</div>	';
		return ins;		
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		titulo = "Topon&iacute;mia <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=36' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"350px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.toponimia",
			true,
			"hd"
		);
		divid = janela[2].id;
		i3GEOF.toponimia.aguarde = $i("i3GEOF.toponimia_imagemCabecalho").style;
		$i("i3GEOF.toponimia_corpo").style.backgroundColor = "white";
		i3GEOF.toponimia.inicia(divid);
	},
	/*
	Function: corj
	
	Abre a janela para o usuário selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: pegaPar
	
	Pega os parâmetros para montar a chamada ajax que cria ou testa a toponímia
	*/
	pegaPar: function(){
		if($i("i3GEOtoponimiaListaItens").value == "")
		{alert("Escolha um item");return false;}
		if($i("i3GEOtoponimiafundoc_i").value === "")
		{$i("i3GEOtoponimiafundoc_i").value = "off";}
		if($i("i3GEOtoponimiasombra_i").value === "")
		{$i("i3GEOtoponimiasombra_i").value = "off";}
		if($i("i3GEOtoponimiamascara_i").value === "")
		{$i("i3GEOtoponimiamascara_i").value = "off";}				
		if($i("i3GEOtoponimiafrentes_i").value === "")
		{$i("i3GEOtoponimiafrentes_i").value = "off";}
		var par = "&position="+$i("i3GEOtoponimiaposition_i").value +
			"&partials="+$i("i3GEOtoponimiapartials_i").value+
			"&offsetx="+$i("i3GEOtoponimiaoffsetx_i").value+
			"&offsety="+$i("i3GEOtoponimiaoffsety_i").value+
			"&minfeaturesize="+$i("i3GEOtoponimiaminfeaturesize_i").value+
			"&mindistance="+$i("i3GEOtoponimiamindistance_i").value+
			"&force="+$i("i3GEOtoponimiaforce_i").value+
			"&shadowsizex="+$i("i3GEOtoponimiafrentex_i").value+
			"&shadowsizey="+$i("i3GEOtoponimiafrentey_i").value+
			"&cor="+$i("i3GEOtoponimiafrente_i").value+
			"&sombray="+$i("i3GEOtoponimiasombray_i").value+
			"&sombrax="+$i("i3GEOtoponimiasombrax_i").value+
			"&angulo="+$i("i3GEOtoponimiaangulo_i").value+
			"&tamanho="+$i("i3GEOtoponimiatamanho_i").value+
			"&fonte="+$i("i3GEOtoponimiaListaFonte").value+
			"&fundo="+$i("i3GEOtoponimiafundoc_i").value+
			"&sombra="+$i("i3GEOtoponimiasombra_i").value+
			"&outlinecolor="+$i("i3GEOtoponimiamascara_i").value+
			"&shadowcolor="+$i("i3GEOtoponimiafrentes_i").value+
			"&item="+$i("i3GEOtoponimiaListaItens").value+
			"&wrap="+$i("i3GEOtoponimiawrap_i").value+
			"&tema="+i3GEO.temaAtivo;
		return par;
	},
	/*
	Function: cria
	
	Cria a toponímia no tema selecionado
	
	Veja:
	
	<CRIATOPONIMIA>
	*/
	cria: function(){
		try{
			if(i3GEOF.toponimia.aguarde.visibility === "visible")
			{return;}
			i3GEOF.toponimia.aguarde.visibility = "visible";
			var monta = function(){
			 		i3GEOF.toponimia.aguarde.visibility = "hidden";
			 		i3GEO.atualiza();
				},
				par = i3GEOF.toponimia.pegaPar(),
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+
					"&funcao=criatoponimia&"+par;
			if(par === false){
				i3GEOF.toponimia.aguarde.visibility = "hidden";
				return;
			}
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"criaToponimia",monta);
		}catch(e){alert("Erro: "+e);i3GEOF.toponimia.aguarde.visibility = "hidden";}
	},
	/*
	Function:
	
	Testa a criação da toponímia gerando uma imagem temporária
	
	Veja:
	
	<CRIATOPONIMIA>
	*/
	testa: function(){
		if(i3GEOF.toponimia.aguarde.visibility === "visible")
		{return;}
		i3GEOF.toponimia.aguarde.visibility = "visible";
		var monta = function(retorno){
		 		$i("i3GEOtoponimiaTeste").innerHTML= "<img src='"+retorno.data+"' >";
		 		i3GEOF.toponimia.aguarde.visibility = "hidden";
			},
			par = i3GEOF.toponimia.pegaPar(),
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+
				"&funcao=criatoponimia&tipo=teste&"+par;
		if(par === false){
			i3GEOF.toponimia.aguarde.visibility = "hidden";
			return;
		}
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"criaToponimia",monta);
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>