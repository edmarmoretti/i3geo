
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Grade de coordenadas

Cria um tema contendo a grade de coordenadas

Veja:

<i3GEO.mapa.dialogo.gradeCoord>

Arquivo:

i3geo/ferramentas/gradecoord/index.js.php

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
Classe: i3GEOF.gradeCoord
*/
i3GEOF.gradeCoord = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/**
	 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
	 */
	MUSTACHE : "",
	/**
	 * Susbtitutos para o template
	 */
	mustacheHash : function() {
		var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.gradeCoord.dicionario);
		dicionario["gradeCoordIntervalo"] = $inputText('','','i3GEOgradeCoordintervalo','',4,'2');
		dicionario["locaplic"] = i3GEO.configura.locaplic;
		dicionario["nao"] = $trad("x15");
		dicionario["sim"] = $trad("x14");
		dicionario["gradeCoordtamanhotexto"] = $inputText('','','i3GEOgradeCoordtamanhotexto','',3,'10');
		dicionario["gradeCoordmascara"] = $inputText('','','i3GEOgradeCoordmascara_i','',11,'-1,-1,-1');
		dicionario["gradeCoordshadowsizex"] = $inputText('','','i3GEOgradeCoordshadowsizex','',3,'0');
		dicionario["gradeCoordshadowsizey"] = $inputText('','','i3GEOgradeCoordshadowsizey','',3,'0');
		dicionario["asp"] = '"';
		return dicionario;
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.gradeCoord.html();
			i3GEO.util.comboFontes("i3GEOgradeCoordfonte","i3GEOgradeCoordfontef");
			new YAHOO.widget.Button(
				"i3GEOgradeCoordbotao1",
				{onclick:{fn: i3GEOF.gradeCoord.executa}}
			);
			i3GEO.util.aplicaAquarela("i3GEOF.gradeCoord_corpo");
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function() {
		var ins = Mustache.render(i3GEOF.gradeCoord.MUSTACHE, i3GEOF.gradeCoord.mustacheHash());
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo;
		//cria a janela flutuante
		titulo = $trad("ge6")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=1&idajuda=7' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"350px",
			"440px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.gradeCoord",
			true,
			"hd"
		);
		divid = janela[2].id;
		$i("i3GEOF.gradeCoord_corpo").style.backgroundColor = "white";
		i3GEOF.gradeCoord.aguarde = $i("i3GEOF.gradeCoord_imagemCabecalho").style;
		i3GEOF.gradeCoord.inicia(divid);
	},
	/*
	Function: corj

	Abre a janela para o usu&aacute;rio selecionar uma cor interativamente
	*/
	corj: function(obj)
	{i3GEO.util.abreCor("",obj);},
	/*
	Function: executa

	Insere a grade no mapa

	Veja:

	<GRADECOORD>
	*/
	executa: function(){
		if (($i("i3GEOgradeCoordintervalo").value == 0) || ($i("i3GEOgradeCoordintervalo").value == ""))
		{i3GEO.janela.tempoMsg($trad('distLinhas',i3GEOF.gradeCoord.dicionario));}
		else
		{
			if(i3GEOF.gradeCoord.aguarde.visibility === "visible")
			{return;}
			i3GEOF.gradeCoord.aguarde.visibility = "visible";
			var temp = function(){
				i3GEO.atualiza();
				i3GEOF.gradeCoord.aguarde.visibility = "hidden";
			},
			p,
			cp;
			p = i3GEO.configura.locaplic+"/ferramentas/gradecoord/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=gradeCoord";
			p += "&intervalo="+$i("i3GEOgradeCoordintervalo").value;
			p += "&corlinha="+$i("i3GEOgradeCoordcorlinha").value;
			p += "&larguralinha="+$i("i3GEOgradeCoordlarguralinha").value;
			p += "&tipolinha="+$i("i3GEOgradeCoordtipolinha").value;
			p += "&tamanhotexto="+$i("i3GEOgradeCoordtamanhotexto").value;
			p += "&cortexto="+$i("i3GEOgradeCoordcortexto").value;
			p += "&incluitexto="+$i("i3GEOgradeCoordincluitexto").value;
			p += "&mascara="+$i("i3GEOgradeCoordmascara_i").value;
			p += "&shadowcolor="+$i("i3GEOgradeCoordshadowcolor").value;
			p += "&shadowsizex="+$i("i3GEOgradeCoordshadowsizex").value;
			p += "&shadowsizey="+$i("i3GEOgradeCoordshadowsizey").value;
			p += "&fonte="+$i("i3GEOgradeCoordfonte").value;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"gradeCoord",temp);
		}
	}
};