<?php if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
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
Class: i3GEOF.buffer

Cria e adiciona um novo tema ao mapa contendo o polígono de entorno (buffer).
*/
i3GEOF.buffer = {
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
			$i(iddiv).innerHTML += i3GEOF.buffer.html();
			i3GEOF.buffer.t0();
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
		ins +=	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEObufferresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEObufferfim" >';
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
		titulo = "Entorno <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=3&idajuda=24' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			var temp = $i("i3GEOF.buffer_corpo");
			if(temp){
				if(temp.style.display === "block")
				{temp.style.display = "none";}
				else
				{temp.style.display = "block";}
			}
		};
		janela = i3GEO.janela.cria(
			"400px",
			"180px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.buffer",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.buffer.aguarde = $i("i3GEOF.buffer_imagemCabecalho").style;
		i3GEOF.buffer.inicia(divid);
	},
	t0: function()
	{
		var ins = "<p class='paragrafo' >O entorno, ou buffer, &eacute; um pol&iacute;gono que circunda um elemento geogr&aacute;fico em uma dist&acirc;ncia fixa.";
		ins += "<p class='paragrafo' >Para gerar o entorno, voc&ecirc; precisa selecionar alguns elementos de um tema. Utilize para isso a op&ccedil;&atilde;o de sele&ccedil;&atilde;o ou a tabela de atributos do tema desejado.";
		i3GEO.util.proximoAnterior("","i3GEOF.buffer.t1()",ins,"i3GEOFgradeDePontost0","i3GEObufferresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo'>Tema, com sele&ccedil;&atilde;o, que ser&aacute; utilizado:";
		ins += "<div id='i3GEObufferSelTemas' style='text-align:left;font-size:11px'></div>";
		i3GEO.util.proximoAnterior("i3GEOF.buffer.t0()","i3GEOF.buffer.t2()",ins,"i3GEOF.buffer.t1","i3GEObufferresultado");
		i3GEOF.buffer.comboTemasSel();
	},
	t2: function(){
		var ins = "<p class='paragrafo'>Dist&acirc;ncia do entorno em metros";
		ins += "<br><br><input onclick='javascript:this.select();' class=digitar id='i3GEObufferd' type=text size=10 value='0'/><br>";
		ins += "<p class='paragrafo'>Considerar os elementos selecionados como se fossem um s&oacute;?";
		ins += "<br><br><select id=i3GEObufferunir ><option value=nao selected >n&atilde;o</option><option value=sim >sim</option></select>";
		i3GEO.util.proximoAnterior("i3GEOF.buffer.t1()","i3GEOF.buffer.t3()",ins,"i3GEOF.buffer.t2","i3GEObufferresultado");	
	},
	t3: function(){
		var ins = "<p class='paragrafo'>O tema com o entorno ser&aacute; adicionado ao mapa atual.";
		ins += "<br><br><input id=i3GEObufferbotao1 type='buttom' value='Criar entorno' />";
		i3GEO.util.proximoAnterior("i3GEOF.buffer.t2()","",ins,"i3GEOF.buffer.t3","i3GEObufferresultado");
		new YAHOO.widget.Button(
			"i3GEObufferbotao1",
			{onclick:{fn: i3GEOF.buffer.criaBuffer}}
		);		
	},
	/*
	Function: criaBuffer
	
	Cria a grade e adiciona um novo tema ao mapa
	*/
	criaBuffer: function(){
		try{
			if(i3GEOF.buffer.aguarde.visibility === "visible")
			{return;}
			var distancia = $i("i3GEObufferd").value,
				tema = $i("i3GEObuffertemasComSel").value,
				p,
				fim,
				cp;
			if (distancia*1 !== 0)
			{
				i3GEOF.buffer.aguarde.visibility = "visible";
				fim = function(retorno){
					i3GEOF.buffer.aguarde.visibility = "hidden";
					if (retorno.data === undefined )
					{$i("i3GEObufferfim").innerHTML = "Erro. A operação demorou muito.";}
					else
					{i3GEO.atualiza();}
				};
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=criabuffer&tema="+tema+"&distancia="+distancia+"&unir="+$i("i3GEObufferunir").value;
				cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"criaBuffer",fim);
			}
			else
			{alert("Distancia invalida");}
		}
		catch(e){$i("i3GEObufferfim").innerHTML = "<p class='paragrafo' >Erro. "+e;i3GEO.janela.fechaAguarde();i3GEOF.buffer.aguarde.visibility = "hidden";}
	},
	/*
	Function: comboTemasSel
	
	Cria um combo com a lista de temas com elementos selecionados
	*/
	comboTemasSel: function(){
		i3GEO.util.comboTemas(
			"i3GEObuffertemasComSel",
			function(retorno){
		 		$i("i3GEObufferSelTemas").innerHTML = retorno.dados;
		 		$i("i3GEObufferSelTemas").style.display = "block";
		 		if ($i("i3GEObuffertemasComSel")){
		 			$i("i3GEObuffertemasComSel").onchange = function(){
		 				i3GEO.temaAtivo = $i("i3GEObuffertemasComSel").value;
		 			};
				}
				if(i3GEO.temaAtivo !== ""){
					$i("i3GEObuffertemasComSel").value = i3GEO.temaAtivo;
					$i("i3GEObuffertemasComSel").onchange.call();
				}
			},
			"i3GEObufferSelTemas",
			"",
			false,
			"selecionados"
		);	
	}
};
<?php if(extension_loaded('zlib')){ob_end_flush();}?>