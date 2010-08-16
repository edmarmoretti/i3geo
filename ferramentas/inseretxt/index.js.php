<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Insere textos

Inclui um texto no mapa no ponto clicado pelo usuário

Veja:

<i3GEO.mapa.dialogo.cliqueTexto>

Arquivo:

i3geo/ferramentas/inseretxt/index.js.php

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
Classe: i3GEOF.inseretxt
*/
i3GEOF.inseretxt = {
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
			$i(iddiv).innerHTML += i3GEOF.inseretxt.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia1","i3GEOinseretxtguia");
			//eventos das guias
			$i("i3GEOinseretxtguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia1","i3GEOinseretxtguia");};
			$i("i3GEOinseretxtguia2").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia2","i3GEOinseretxtguia");
				i3GEO.util.comboTemas(
					"i3GEOinseretxtComboTemas",
					function(retorno){
				 		$i("i3GEOinseretxtDivComboTemas").innerHTML = retorno.dados;
				 		$i("i3GEOinseretxtDivComboTemas").style.display = "block";
				 		if ($i("i3GEOinseretxtComboTemas")){
				 			$i("i3GEOinseretxtComboTemas").onchange = function(){
				 				i3GEO.mapa.ativaTema($i("i3GEOinseretxtComboTemas").value);
				 				//combodeitens
								i3GEO.util.comboItens(
									"i3GEOinseretxtComboItens",
									i3GEO.temaAtivo,
									function(retorno){
							 			$i("i3GEOinseretxtDivComboItens").innerHTML = "<p class=paragrafo >"+retorno.dados+"</p>";
									}
								);				 				
				 			};
						}
						if(i3GEO.temaAtivo !== ""){
							$i("i3GEOinseretxtComboTemas").value = i3GEO.temaAtivo;
							$i("i3GEOinseretxtComboTemas").onchange.call();
						}
					},
					"i3GEOinseretxtDivComboTemas",
					"",
					false,
					"ligados"
				);	
			};
			$i("i3GEOinseretxtguia3").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOinseretxtguia3","i3GEOinseretxtguia");};
			i3GEO.util.mensagemAjuda("i3GEOinseretxtmen1",$i("i3GEOinseretxtmen1").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOinseretxtmen2",$i("i3GEOinseretxtmen2").innerHTML);
			i3GEO.util.comboFontes("i3GEOinseretxtListaFonte","i3GEOinseretxtDivListaFonte");
			i3GEOF.inseretxt.ativaFoco();
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
		'<div id=i3GEOinseretxtguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">' +
		'	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">' +
		'		<li><a href="#ancora"><em><div id="i3GEOinseretxtguia1" style="text-align:center;left:0px;" >Digitar</div></em></a></li>' +
		'		<li><a href="#ancora"><em><div id="i3GEOinseretxtguia2" style="text-align:center;left:0px;" >Capturar</div></em></a></li>' +
		'		<li><a href="#ancora"><em><div id="i3GEOinseretxtguia3" style="text-align:center;left:0px;" >Propriedades</div></em></a></li>' +
		'	</ul>' +
		'</div><br>' +
		'	<div class=guiaobj id="i3GEOinseretxtguia1obj" style="left:1px;display:none;">' +
		'		<p class="paragrafo" >Texto que será inserido:<br><br>' +	
		$inputText("","","i3GEOinseretxttexto","",60,"") +
		'		<br><br>' +
		'		<div id=i3GEOinseretxtmen1 style="text-align:left;" >'+
		'			<p class="paragrafo" >Digite o texto e clique no mapa no ponto de inclus&atilde;o. Para definir os par&acirc;metros de fonte, tamanho, etc, utilize a guia de propriedades. Se o texto contiver acentuação, não use a fonte padrão (bitmap).' +
		'		</div>' +
		'	</div>' +
		'	<div class=guiaobj id="i3GEOinseretxtguia2obj" style="left:1px;display:none;">' +
		'		<p class=paragrafo >Escolha o tema:' +
		'		<div id=i3GEOinseretxtDivComboTemas style="text-align:left;">Aguarde...' +
		'		</div><br>' +
		'		<p class=paragrafo >Escolha o item:' +
		'		<div id=i3GEOinseretxtDivComboItens style="text-align:left;">'+
		'		</div>' +
		'		<br><br>' +
		'		<div id=i3GEOinseretxtmen2 style="text-align:left;" >' +
		'			<p class=paragrafo >Após escolher o tema e o item da tabela de atributos, clique no mapa no lugar desejado para incluir o texto.</p>' +
		'		</div>' +
		'	</div>' +
		'	<div class=guiaobj id="i3GEOinseretxtguia3obj" style="left:1px;display:none;">' +
		'		<table summary="" class=lista width="98%">' +
		'			<tr><td>Fonte:</td><td><span id="i3GEOinseretxtDivListaFonte">Aguarde...</span></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Tamanho:</td><td>' +
		$inputText("","","i3GEOinseretxttamanho_i","",2,"8") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>&Acirc;ngulo (no caso de linhas pode ser utilizado AUTO ou FOLLOW (segue a linha), nesses casos, a fonte n&atilde;o pode ser do tipo bitmap):</td><td>' +
		$inputText("","","i3GEOinseretxtangulo_i","",4,"0") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr>' +
		'				<td>Deslocamento do texto em rela&ccedil;&atilde;o ao ponto de inclus&atilde;o:</td>' +
		'				<td>x ' +
		$inputText("","","i3GEOinseretxtoffsetx_i","",2,"0") +
		'					y ' +
		$inputText("","","i3GEOinseretxtoffsety_i","",2,"0") +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor do texto:</td><td>'+
		$inputText("","","i3GEOinseretxtfrente_i","",11,"0 0 0") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.inseretxt.corj(\'i3GEOinseretxtfrente_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor da m&aacute;scara de um pixel de entorno:</td><td>' +
		$inputText("","","i3GEOinseretxtmascara_i","",11,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.inseretxt.corj(\'i3GEOinseretxtmascara_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr>' +
		'				<td>Posicionamento:</td>' +
		'				<td>' +
		'					<select id=i3GEOinseretxtposition_i >' +
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
		$inputText("","","i3GEOinseretxtfundoc_i","",9,"") +
		'				<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.inseretxt.corj(\'i3GEOinseretxtfundoc_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor da sombra do fundo:</td><td>'+
		$inputText("","","i3GEOinseretxtsombra_i","",9,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.inseretxt.corj(\'i3GEOinseretxtsombra_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Deslocamento da sombra do fundo:</td><td>x ' +
		$inputText("","","i3GEOinseretxtsombrax_i","",1,"1") +
		'			 y' +
		$inputText("","","i3GEOinseretxtsombray_i","",1,"1") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Cor da sombra:</td><td>' +
		$inputText("","","i3GEOinseretxtfrentes_i","",9,"") +
		'			<img alt="aquarela.gif" style=cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.inseretxt.corj(\'i3GEOinseretxtfrentes_i\')" /></td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Deslocamento da sombra:</td><td>x '+
		$inputText("","","i3GEOinseretxtfrentex_i","",1,"1") +
		'			 y '+
		$inputText("","","i3GEOinseretxtfrentey_i","",1,"1") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>For&ccedil;a colis&otilde;es entre textos?:</td>' +
		'				<td>' +
		'					<select id=i3GEOinseretxtforce_i >' +
		'						<option value="0" >n&atilde;o</option>' +
		'						<option value="1" >sim</option>' +
		'					</select>' +
		'				</td>' +
		'			</tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Dist&acirc;ncia m&iacute;nima entre textos duplicados (em pixel):</td><td>' +
		$inputText("","","i3GEOinseretxtmindistance_i","",4,"auto") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>Tamanho m&iacute;nimo do elemento cartogr&aacute;fico(em pixel):</td><td>' +
		$inputText("","","i3GEOinseretxtminfeaturesize_i","",4,"auto") +
		'			</td></tr>' +
		'			<tr><td>&nbsp;</td><td></td></tr>' +
		'			<tr><td>O texto pode ultrapassar o mapa?:</td>' +
		'				<td>' +
		'					<select id=i3GEOinseretxtpartials_i >' +
		'						<option value="1" >sim</option>' +
		'						<option value="0" >n&atilde;o</option>' +
		'					</select>' +
		'				</td>' +
		'			</tr>' +
		'		</table>' +			
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
		cabecalho = function(){
			i3GEOF.inseretxt.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.inseretxt");
		};
		titulo = "Texto <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=83' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"360px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.inseretxt",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.inseretxt.aguarde = $i("i3GEOF.inseretxt_imagemCabecalho").style;
		$i("i3GEOF.inseretxt_corpo").style.backgroundColor = "white";
		i3GEOF.inseretxt.inicia(divid);
		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.inseretxt.cria()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.inseretxt.cria()");}
		temp = function(){
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.inseretxt.cria()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.barraDeBotoes.ativaIcone("textofid");
		g_tipoacao='';
		g_operacao='';
		if($i("img")){
			$i("img").style.cursor="pointer";
		}
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
		if($i("i3GEOinseretxtfundoc_i").value === "")
		{$i("i3GEOinseretxtfundoc_i").value = "off";}
		if($i("i3GEOinseretxtsombra_i").value === "")
		{$i("i3GEOinseretxtsombra_i").value = "off";}
		if($i("i3GEOinseretxtmascara_i").value === "")
		{$i("i3GEOinseretxtmascara_i").value = "off";}				
		if($i("i3GEOinseretxtfrentes_i").value === "")
		{$i("i3GEOinseretxtfrentes_i").value = "off";}
		var par = "&position="+$i("i3GEOinseretxtposition_i").value +
			"&partials="+$i("i3GEOinseretxtpartials_i").value+
			"&offsetx="+$i("i3GEOinseretxtoffsetx_i").value+
			"&offsety="+$i("i3GEOinseretxtoffsety_i").value+
			"&minfeaturesize="+$i("i3GEOinseretxtminfeaturesize_i").value+
			"&mindistance="+$i("i3GEOinseretxtmindistance_i").value+
			"&force="+$i("i3GEOinseretxtforce_i").value+
			"&shadowsizex="+$i("i3GEOinseretxtfrentex_i").value+
			"&shadowsizey="+$i("i3GEOinseretxtfrentey_i").value+
			"&cor="+$i("i3GEOinseretxtfrente_i").value+
			"&sombray="+$i("i3GEOinseretxtsombray_i").value+
			"&sombrax="+$i("i3GEOinseretxtsombrax_i").value+
			"&angulo="+$i("i3GEOinseretxtangulo_i").value+
			"&tamanho="+$i("i3GEOinseretxttamanho_i").value+
			"&fonte="+$i("i3GEOinseretxtListaFonte").value+
			"&fundo="+$i("i3GEOinseretxtfundoc_i").value+
			"&sombra="+$i("i3GEOinseretxtsombra_i").value+
			"&outlinecolor="+$i("i3GEOinseretxtmascara_i").value+
			"&shadowcolor="+$i("i3GEOinseretxtfrentes_i").value;
		return par;
	},
	/*
	Function: cria
	
	Cria um tema e insere o texto
	
	Veja:
	
	<i3GEO.php.identificaunico>
	*/
	cria: function(){
		try{
			if(i3GEOF.inseretxt.aguarde.visibility === "visible")
			{return;}
			if($i("i3GEOinseretxtguia3obj").style.display === "block"){
				alert("Ative a guia 1 ou 2 para definir o texto");
				return;
			}
			i3GEOF.inseretxt.aguarde.visibility = "visible";
			var texto,temp,tema,item;
			//
			//de onde vem o texto
			//
			if($i("i3GEOinseretxtguia1obj").style.display === "block"){
				texto = $i("i3GEOinseretxttexto").value;
				if(texto === ""){
					i3GEOF.inseretxt.aguarde.visibility = "hidden";
					return;
				}
				else{
					i3GEOF.inseretxt.insere(texto);
				}			
			}
			else{
				temp = function(retorno){
					i3GEOF.inseretxt.insere(retorno.data);
				};
				tema = $i("i3GEOinseretxtComboTemas").value;
				item = $i("i3GEOinseretxtComboItens").value;
				i3GEO.php.identificaunico(temp,objposicaocursor.ddx+","+objposicaocursor.ddy,tema,item);
			}
		}catch(e){alert("Erro: "+e);i3GEOF.inseretxt.aguarde.visibility = "hidden";}
	},
	/*
	Function: insere
	
	Insere um texto no mapa
	
	Veja:
	
	<INSEREFEATURE>
	
	Parametro:
	
	texto {String}
	*/
	insere: function(texto){
		var monta,par,p,nometema,temp;
		monta = function(){
		 	i3GEOF.inseretxt.aguarde.visibility = "hidden";
		 	i3GEO.atualiza();
		};
		temp = Math.random() + "b";
		temp = temp.split(".");
		nometema = "pin"+temp[1];
		par = i3GEOF.inseretxt.pegaPar();
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+
				"&funcao=inserefeature&"+par+"&pin="+nometema+"&tipo=ANNOTATION&texto="+texto+"&xy="+objposicaocursor.ddx+" "+objposicaocursor.ddy;
		if(par === false){
			i3GEOF.inseretxt.aguarde.visibility = "hidden";
			return;
		}
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"inserefeature",monta);
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>