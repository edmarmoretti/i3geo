<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Centróide

Arquivo:

i3geo/ferramentas/centroide/index.js.php

Licenca:

GPL2

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
Class: i3GEOF.centroide

Cria e adiciona um novo tema ao mapa contendo o centróide dos elementos de uma outra camada.
*/
i3GEOF.centroide = {
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
			$i(iddiv).innerHTML += i3GEOF.centroide.html();
			i3GEOF.centroide.t0();
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
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEOcentroideresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEOcentroidefim" >';
		ins +=	'</div>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		titulo = "Centróide <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=21' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.centroide");
		};
		janela = i3GEO.janela.cria(
			"400px",
			"180px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.centroide",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.centroide.aguarde = $i("i3GEOF.centroide_imagemCabecalho").style;
		i3GEOF.centroide.inicia(divid);
	},
	t0: function()
	{
		var ins = "<p class='paragrafo' >Os centr&oacute;ides s&atilde;o pontos localizados no centro de massa de uma forma.";
		ins += "<p class='paragrafo'> Para gerar os centr&oacute;ides, voc&ecirc; precisa selecionar alguns elementos de um tema. Utilize para isso a op&ccedil;&atilde;o de sele&ccedil;&atilde;o ou a tabela de atributos do tema desejado.";
		i3GEO.util.proximoAnterior("","i3GEOF.centroide.t1()",ins,"i3GEOFgradeDePontost0","i3GEOcentroideresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>Tema, com sele&ccedil;&atilde;o, que ser&aacute; utilizado:";
		ins += "<div id='i3GEOcentroideSelTemas' style='text-align:left;font-size:11px'></div>";
		i3GEO.util.proximoAnterior("i3GEOF.centroide.t0()","i3GEOF.centroide.t2()",ins,"i3GEOF.centroide.t1","i3GEOcentroideresultado");
		i3GEOF.centroide.comboTemasSel();
	},
	t2: function(){
		var ins = "<p class='paragrafo'>O tema com os pontos ser&aacute; adicionado ao mapa atual.";
		ins += "<br><br><input id=i3GEOcentroidebotao1 type='buttom' value='Criar centróides' />";
		i3GEO.util.proximoAnterior("i3GEOF.centroide.t2()","",ins,"i3GEOF.centroide.t3","i3GEOcentroideresultado");
		new YAHOO.widget.Button(
			"i3GEOcentroidebotao1",
			{onclick:{fn: i3GEOF.centroide.criacentroide}}
		);		
	},
	/*
	Function: criacentroide
	
	Cria a grade e adiciona um novo tema ao mapa
	*/
	criacentroide: function(){
		try{
			if(i3GEOF.centroide.aguarde.visibility === "visible")
			{return;}
			var tema = $i("i3GEOcentroidetemasComSel").value,
				p,
				fim,
				cp;
			i3GEOF.centroide.aguarde.visibility = "visible";
			fim = function(retorno){
				i3GEOF.centroide.aguarde.visibility = "hidden";
				if (retorno.data === undefined )
				{$i("i3GEOcentroidefim").innerHTML = "Erro. A operação demorou muito.";}
				else
				{i3GEO.atualiza();}
			};
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=criaCentroide&tema="+tema;
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"criaCentroide",fim);
		}
		catch(e){$i("i3GEOcentroidefim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.centroide.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasSel
	
	Cria um combo com a lista de temas com elementos selecionados
	*/
	comboTemasSel: function(){
		i3GEO.util.comboTemas(
			"i3GEOcentroidetemasComSel",
			function(retorno){
		 		$i("i3GEOcentroideSelTemas").innerHTML = retorno.dados;
		 		$i("i3GEOcentroideSelTemas").style.display = "block";
		 		if ($i("i3GEOcentroidetemasComSel")){
		 			$i("i3GEOcentroidetemasComSel").onchange = function(){
		 				i3GEO.mapa.ativaTema($i("i3GEOcentroidetemasComSel").value);
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEOcentroidetemasComSel").value = i3GEO.temaAtivo;
					$i("i3GEOcentroidetemasComSel").onchange.call();
				}
			},
			"i3GEOcentroideSelTemas",
			"",
			false,
			"selecionados"
		);	
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>