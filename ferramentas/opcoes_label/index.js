/*
Title: Opções de labels

Abre uma janela flutuante que permite definir as propriedades de elementos do tipo texto (LABELS)

Arquivo:

i3geo/ferramentas/opcoes_label/index.js.php

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
Classe: i3GEOF.proplabel
*/
i3GEOF.proplabel = {
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
	inicia: function(iddiv,conector){
		$i(iddiv).innerHTML += i3GEOF.proplabel.html(conector);
		i3GEO.util.comboFontes("i3GEOproplabelListaFonte","i3GEOproplabelDivListaFonte");
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Parametros:
	
	conector - {boolean} insere ou não as opções de conector de textos
	
	Retorno:
	
	String com o código html
	*/
	html:function(conector){
		var ins = '' +
		'		<table summary="" class=lista width="98%">' +
		'			<tr><td>Fonte:</td><td><span id="i3GEOproplabelDivListaFonte">Aguarde...</span></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Tamanho:</td><td>' +
		$inputText("","","i3GEOproplabeltamanho_i","",2,"8") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>';
		if(conector === true){
			ins += '	<tr><td>Largura do conector:</td><td>' +
			$inputText("","","i3GEOproplabeltamanho_c","",2,"2") +
			'			</td></tr>' +
			'			<tr><td>&nbsp;</td><td></td></tr>' +
			'			<tr><td>Cor do conector:</td><td>'+
			$inputText("","","i3GEOproplabelfrente_c","",11,"0 0 0") +
			'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelfrente_c\')" /></td></tr>' +
			'			<tr><td>&nbsp;</td><td></td></tr>';
		}
		ins += '	<tr><td>&Acirc;ngulo (no caso de linhas pode ser utilizado AUTO ou FOLLOW (segue a linha), nesses casos, a fonte n&atilde;o pode ser do tipo bitmap):</td><td>' +
		$inputText("","","i3GEOproplabelangulo_i","",4,"0") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr>' +
		'				<td>Deslocamento do texto em rela&ccedil;&atilde;o ao ponto de inclus&atilde;o:</td>' +
		'				<td>x ' +
		$inputText("","","i3GEOproplabeloffsetx_i","",2,"0") +
		'					y ' +
		$inputText("","","i3GEOproplabeloffsety_i","",2,"0") +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor do texto:</td><td>'+
		$inputText("","","i3GEOproplabelfrente_i","",11,"0 0 0") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelfrente_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor da m&aacute;scara de um pixel de entorno:</td><td>' +
		$inputText("","","i3GEOproplabelmascara_i","",11,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelmascara_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr>' +
		'				<td>Posicionamento:</td>' +
		'				<td>' +
		'					<select id=i3GEOproplabelposition_i >' +
		'						<option value="MS_AUTO" >autom&aacute;tico</option>' +
		'						<option value="MS_UL" >superior esquerdo</option>' +
		'						<option value="MS_UC" >superior centro</option>' +
		'						<option value="MS_UR" selected >superior direito</option>' +
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
		$inputText("","","i3GEOproplabelfundoc_i","",9,"") +
		'				<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelfundoc_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor da sombra do fundo:</td><td>'+
		$inputText("","","i3GEOproplabelsombra_i","",9,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelsombra_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Deslocamento da sombra do fundo:</td><td>x ' +
		$inputText("","","i3GEOproplabelsombrax_i","",1,"1") +
		'			 y' +
		$inputText("","","i3GEOproplabelsombray_i","",1,"1") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor do texto de fundo (duplicado)):</td><td>' +
		$inputText("","","i3GEOproplabelfrentes_i","",9,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelfrentes_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Deslocamento do texto de fundo (duplicado):</td><td>x '+
		$inputText("","","i3GEOproplabelfrentex_i","",1,"1") +
		'			 y '+
		$inputText("","","i3GEOproplabelfrentey_i","",1,"1") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>For&ccedil;a colis&otilde;es entre textos?:</td>' +
		'				<td>' +
		'					<select id=i3GEOproplabelforce_i >' +
		'						<option value="0" >n&atilde;o</option>' +
		'						<option value="1" >sim</option>' +
		'					</select>' +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Dist&acirc;ncia m&iacute;nima entre textos duplicados (em pixel):</td><td>' +
		$inputText("","","i3GEOproplabelmindistance_i","",4,"auto") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Tamanho m&iacute;nimo do elemento cartogr&aacute;fico(em pixel):</td><td>' +
		$inputText("","","i3GEOproplabelminfeaturesize_i","",4,"auto") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>O texto pode ultrapassar o mapa?:</td>' +
		'				<td>' +
		'					<select id=i3GEOproplabelpartials_i >' +
		'						<option value="1" >sim</option>' +
		'						<option value="0" >n&atilde;o</option>' +
		'					</select>' +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Caractere usado para indicar uma quebra de texto:</td><td>' +
		$inputText("","","i3GEOproplabelwrap_i","",5,"") +
		'			</td></tr>' +
		'		</table>';
		return ins;		
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(conector){
		var minimiza,cabecalho,janela,divid,titulo;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.proplabel.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.proplabel");
		};
		titulo = "Propriedades do texto";
		janela = i3GEO.janela.cria(
			"360px",
			"230px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.proplabel",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.proplabel.aguarde = $i("i3GEOF.proplabel_imagemCabecalho").style;
		$i("i3GEOF.proplabel_corpo").style.backgroundColor = "white";
		i3GEOF.proplabel.inicia(divid,conector);
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
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
		if($i("i3GEOproplabelfundoc_i").value === "")
		{$i("i3GEOproplabelfundoc_i").value = "off";}
		if($i("i3GEOproplabelsombra_i").value === "")
		{$i("i3GEOproplabelsombra_i").value = "off";}
		if($i("i3GEOproplabelmascara_i").value === "")
		{$i("i3GEOproplabelmascara_i").value = "off";}				
		if($i("i3GEOproplabelfrentes_i").value === "")
		{$i("i3GEOproplabelfrentes_i").value = "off";}
		var par = "&position="+$i("i3GEOproplabelposition_i").value +
			"&partials="+$i("i3GEOproplabelpartials_i").value+
			"&offsetx="+$i("i3GEOproplabeloffsetx_i").value+
			"&offsety="+$i("i3GEOproplabeloffsety_i").value+
			"&minfeaturesize="+$i("i3GEOproplabelminfeaturesize_i").value+
			"&mindistance="+$i("i3GEOproplabelmindistance_i").value+
			"&force="+$i("i3GEOproplabelforce_i").value+
			"&shadowsizex="+$i("i3GEOproplabelfrentex_i").value+
			"&shadowsizey="+$i("i3GEOproplabelfrentey_i").value+
			"&cor="+$i("i3GEOproplabelfrente_i").value+
			"&sombray="+$i("i3GEOproplabelsombray_i").value+
			"&sombrax="+$i("i3GEOproplabelsombrax_i").value+
			"&angulo="+$i("i3GEOproplabelangulo_i").value+
			"&tamanho="+$i("i3GEOproplabeltamanho_i").value+
			"&fonte="+$i("i3GEOproplabelListaFonte").value+
			"&fundo="+$i("i3GEOproplabelfundoc_i").value+
			"&sombra="+$i("i3GEOproplabelsombra_i").value+
			"&outlinecolor="+$i("i3GEOproplabelmascara_i").value+
			"&shadowcolor="+$i("i3GEOproplabelfrentes_i").value+
			"&wrap="+$i("i3GEOproplabelwrap_i").value;
		return par;
	}
};