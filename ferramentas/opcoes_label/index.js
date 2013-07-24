/*
Title: Op&ccedil;&otilde;es de labels

Abre uma janela flutuante que permite definir as propriedades de elementos do tipo texto (LABELS)

Arquivo:

i3geo/ferramentas/opcoes_label/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}

/*
Classe: i3GEOF.proplabel
*/
i3GEOF.proplabel = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.proplabel.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.proplabel.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/opcoes_label/dicionario.js",
				"i3GEOF.proplabel.iniciaJanelaFlutuante()",
				"i3GEOF.proplabel.dicionario_script"
			);
		}
		else{
			i3GEOF.proplabel.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv,conector){
		$i(iddiv).innerHTML += i3GEOF.proplabel.html(conector);
		i3GEO.util.comboFontes("i3GEOproplabelListaFonte","i3GEOproplabelDivListaFonte");
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Parametros:

	conector - {boolean} insere ou n&atilde;o as op&ccedil;&otilde;es de conector de textos

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(conector){
		var ins = '' +
		'		<table summary="" class=lista width="98%">' +
		'			<tr><td>'+$trad(2,i3GEOF.proplabel.dicionario)+':</td><td><span id="i3GEOproplabelDivListaFonte">'+$trad(1,i3GEOF.proplabel.dicionario)+'...</span></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(3,i3GEOF.proplabel.dicionario)+':</td><td>' +
		$inputText("","","i3GEOproplabeltamanho_i","",2,"8") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>';
		if(conector === true){
			ins += '	<tr><td>'+$trad(4,i3GEOF.proplabel.dicionario)+':</td><td>' +
			$inputText("","","i3GEOproplabeltamanho_c","",2,"2") +
			'			</td></tr>' +
			'			<tr><td>&nbsp;</td><td></td></tr>' +
			'			<tr><td>'+$trad(5,i3GEOF.proplabel.dicionario)+':</td><td>'+
			$inputText("","","i3GEOproplabelfrente_c","",11,"0 0 0") +
			'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelfrente_c\')" /></td></tr>' +
			'			<tr><td>&nbsp;</td><td></td></tr>';
		}
		ins += '	<tr><td>'+$trad(6,i3GEOF.proplabel.dicionario)+':</td><td>' +
		$inputText("","","i3GEOproplabelangulo_i","",4,"0") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr>' +
		'				<td>'+$trad(7,i3GEOF.proplabel.dicionario)+':</td>' +
		'				<td>x ' +
		$inputText("","","i3GEOproplabeloffsetx_i","",2,"0") +
		'					y ' +
		$inputText("","","i3GEOproplabeloffsety_i","",2,"0") +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(8,i3GEOF.proplabel.dicionario)+':</td><td>'+
		$inputText("","","i3GEOproplabelfrente_i","",11,"0 0 0") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelfrente_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(9,i3GEOF.proplabel.dicionario)+':</td><td>' +
		$inputText("","","i3GEOproplabelmascara_i","",11,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelmascara_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr>' +
		'				<td>'+$trad(10,i3GEOF.proplabel.dicionario)+':</td>' +
		'				<td>' +
		'					<select id=i3GEOproplabelposition_i >' +
		'						<option value="MS_AUTO" >'+$trad(11,i3GEOF.proplabel.dicionario)+'</option>' +
		'						<option value="MS_UL" >'+$trad(12,i3GEOF.proplabel.dicionario)+'</option>' +
		'						<option value="MS_UC" >'+$trad(13,i3GEOF.proplabel.dicionario)+'</option>' +
		'						<option value="MS_UR" selected >'+$trad(14,i3GEOF.proplabel.dicionario)+'</option>' +
		'						<option value="MS_CL" >'+$trad(15,i3GEOF.proplabel.dicionario)+'</option>' +
		'						<option value="MS_CC" >'+$trad(16,i3GEOF.proplabel.dicionario)+'</option>' +
		'						<option value="MS_CR" >'+$trad(17,i3GEOF.proplabel.dicionario)+'</option>' +
		'						<option value="MS_LL" >'+$trad(18,i3GEOF.proplabel.dicionario)+'</option>' +
		'						<option value="MS_LC" >'+$trad(19,i3GEOF.proplabel.dicionario)+'inferior centro</option>' +
		'						<option value="MS_LR" >'+$trad(20,i3GEOF.proplabel.dicionario)+'inferior direito</option>' +
		'					</select>' +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(21,i3GEOF.proplabel.dicionario)+':</td><td>' +
		$inputText("","","i3GEOproplabelfundoc_i","",9,"") +
		'				<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelfundoc_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(22,i3GEOF.proplabel.dicionario)+':</td><td>'+
		$inputText("","","i3GEOproplabelsombra_i","",9,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelsombra_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(23,i3GEOF.proplabel.dicionario)+':</td><td>x ' +
		$inputText("","","i3GEOproplabelsombrax_i","",1,"1") +
		'			 y' +
		$inputText("","","i3GEOproplabelsombray_i","",1,"1") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(24,i3GEOF.proplabel.dicionario)+':</td><td>' +
		$inputText("","","i3GEOproplabelfrentes_i","",9,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.proplabel.corj(\'i3GEOproplabelfrentes_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(25,i3GEOF.proplabel.dicionario)+':</td><td>x '+
		$inputText("","","i3GEOproplabelfrentex_i","",1,"1") +
		'			 y '+
		$inputText("","","i3GEOproplabelfrentey_i","",1,"1") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(26,i3GEOF.proplabel.dicionario)+':</td>' +
		'				<td>' +
		'					<select id=i3GEOproplabelforce_i >' +
		'						<option value="0" >'+$trad("x15")+'</option>' +
		'						<option value="1" >'+$trad("x14")+'</option>' +
		'					</select>' +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(27,i3GEOF.proplabel.dicionario)+':</td><td>' +
		$inputText("","","i3GEOproplabelmindistance_i","",4,"auto") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(28,i3GEOF.proplabel.dicionario)+':</td><td>' +
		$inputText("","","i3GEOproplabelminfeaturesize_i","",4,"auto") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(29,i3GEOF.proplabel.dicionario)+':</td>' +
		'				<td>' +
		'					<select id=i3GEOproplabelpartials_i >' +
		'						<option value="1" >'+$trad("x14")+'</option>' +
		'						<option value="0" >'+$trad("x15")+'</option>' +
		'					</select>' +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>'+$trad(30,i3GEOF.proplabel.dicionario)+':</td><td>' +
		$inputText("","","i3GEOproplabelwrap_i","",5,"") +
		'			</td></tr>' +
		'		</table>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(conector){
		var minimiza,cabecalho,janela,divid,titulo;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.proplabel.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.proplabel");
		};
		titulo = $trad(31,i3GEOF.proplabel.dicionario);
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

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: pegaPar

	Pega os parâmetros para montar a chamada ajax que cria ou testa a topon&iacute;mia
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