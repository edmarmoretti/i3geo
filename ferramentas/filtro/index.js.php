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
Class: i3GEOF.filtro

Adiciona ou modifica um filtro de um tema.
*/
i3GEOF.filtro = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Variavel: comboTemas
	
	Armazena o combo com os itens do tema
	*/
	comboTemas: "",
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.filtro.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia1","i3GEOfiltroguia");
			//eventos das guias
			$i("i3GEOfiltroguia1").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia1","i3GEOfiltroguia");};
			$i("i3GEOfiltroguia2").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia2","i3GEOfiltroguia");
				i3GEOF.filtro.pegaFiltro();
			};
			$i("i3GEOfiltroguia3").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOfiltroguia3","i3GEOfiltroguia");
				i3GEOF.filtro.aplicaFiltro("sim");
			};
			new YAHOO.widget.Button(
				"i3GEOfiltrobotao1",
				{onclick:{fn: function(){i3GEOF.filtro.aplicaFiltro("nao");}}}
			);
			new YAHOO.widget.Button(
				"i3GEOfiltrobotao2",
				{onclick:{fn: i3GEOF.filtro.limpaFiltro}}
			);
			i3GEO.util.mensagemAjuda("i3GEOfiltromen1",$i("i3GEOfiltromen1").innerHTML);
			//
			//pega a lista de itens e chama a função de montagem das opções de criação do filtro
			//
			i3GEO.util.comboItens(
				"none",
				i3GEO.temaAtivo,
				function(retorno){
		 			i3GEOF.filtro.comboTemas = retorno.dados;
		 			i3GEOF.filtro.adicionaLinhaFiltro();
				}
			);
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
		'<div id=i3GEOfiltroguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">'+
		'	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">'+
		'		<li><a href="#ancora"><em><div id="i3GEOfiltroguia1" style="text-align:center;left:0px;" >Construir</div></em></a></li>'+
		'		<li><a href="#ancora"><em><div id="i3GEOfiltroguia2" style="text-align:center;left:0px;" >Digitar</div></em></a></li>'+
		'		<li><a href="#ancora"><em><div id="i3GEOfiltroguia3" style="text-align:center;left:0px;" >Testar</div></em></a></li>'+
		'	</ul>'+
		'</div><br>'+
		'<p class=paragrafo >'+
		'	<input id=i3GEOfiltrobotao1 size=18  type="button" value="Incluir/aplicar" />'+
		'	<input id=i3GEOfiltrobotao2 size=18 type="button" value="Remover" />'+
		'</p>'+
		'<div class=guiaobj id="i3GEOfiltroguia1obj" style="left:1px;display:none;">'+
		'	<div id=i3GEOfiltropar style="display:block;position:relative;top:5px;left:0px;">'+
		'		<table summary="" id="i3GEOfiltroparametros" >'+
		'			<tr><td></td><td></td>'+
		'				<td style=background-color:yellow >Item</td>'+
		'				<td style=background-color:yellow >Operador</td>'+
		'				<td style=background-color:yellow >Valor</td>'+
		'				<td style=background-color:yellow >Conector</td>'+
		'			</tr>'+
		'			<tr><td>&nbsp;</td><td></td><td></td><td></td><td></td><td></td></tr>'+
		'		</table>'+
		'	</div>'+
		'	<div id=i3GEOfiltroresultado style="position:relative;top:5px;left:0px">'+
		'	</div>'+
		'	<div id=i3GEOfiltrovalores style="position:relative;top:5px;left:0px">'+
		'	</div>'+
		'	<div id=i3GEOfiltromen1 style=top:15px;left:0px; ><p class=paragrafo >O resultado da filtragem ser&aacute; mostrado no mapa. Certifique-se que o tema está v&iacute;sivel. Antes de aplicar, vc pode testar o filtro definido. Na op&ccedil;&atilde;o IN separe os valores com v&iacute;rgula.</div>'+
		'</div>'+
		'<div class=guiaobj id="i3GEOfiltroguia2obj" style="left:1px;display:none;">'+
		'	<p class=paragrafo >Digite o filtro:<br>'+
		$inputText("","","i3GEOfiltrofiltro","",65,"") +
		'</p></div>'+
		'<div class=guiaobj id="i3GEOfiltroguia3obj" style="left:1px;display:none;">'+
		'</div>';		
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo;
		//cria a janela flutuante
		titulo = "Filtro <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=38' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"480px",
			"250px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.filtro",
			true,
			"hd"
		);
		divid = janela[2].id;
		i3GEOF.filtro.aguarde = $i("i3GEOF.filtro_imagemCabecalho").style;
		$i("i3GEOF.filtro_corpo").style.backgroundColor = "white";
		i3GEOF.filtro.inicia(divid);
	},
	/*
	Function: adicionaLinhaFiltro
	
	Adiciona uma nova linha de filtro
	*/
	adicionaLinhaFiltro: function(){
		var add,xis,interrogacao,operador,conector,valor,ntb,ntr,ntad,ntd,ntd1,ntd2,ntd3,ntd4,tabela;
		try{
			add = document.createElement("img");
			add.src = i3GEO.configura.locaplic+'/imagens/plus.gif';
			add.style.cursor="pointer";
			add.onclick = function()
			{i3GEOF.filtro.adicionaLinhaFiltro();};
			
			xis = document.createElement("img");
			xis.src = i3GEO.configura.locaplic+'/imagens/x.gif';
			xis.style.cursor="pointer";
			xis.onclick = function(){
				var p = this.parentNode.parentNode.parentNode,
					i;
				for (i = 0; i < p.childNodes.length;i++)
				{p.removeChild(p.childNodes[i]);}
			};
			
			interrogacao = document.createElement("img");
			interrogacao.src = i3GEO.configura.locaplic+'/imagens/interrogacao.gif';
			interrogacao.title='mostra valores';
			interrogacao.style.cursor="pointer";
			interrogacao.onclick = function(){
				var obj, itemTema;
				obj = (this.parentNode.getElementsByTagName("input"))[0];
				itemTema = (this.parentNode.parentNode.getElementsByTagName("select"))[0].value;
				i3GEO.util.comboValoresItem(
					"i3GEOfiltrocbitens",
					i3GEO.temaAtivo,
					itemTema,
					function(retorno){
						$i("i3GEOfiltrovalores").innerHTML = "<br><p class=paragrafo >Escolha o valor:"+retorno.dados+"</p>";
						if ($i("i3GEOfiltrocbitens")){
							$i("i3GEOfiltrocbitens").onchange = function()
							{obj.value = this.value;};
						}		
					},
					"i3GEOfiltrovalores"
				);
			};
			
			operador = "<select>";
			operador += "<option value='='>igual</option>";
			operador += "<option value='!='>dif</option>";
			operador += "<option value='<'>menor</option>";
			operador += "<option value='>'>maior</option>";
			operador += "<option value='<='><=</option>";
			operador += "<option value='>='>>=</option>";
			operador += "<option value='in'>in</option>";
			operador += "<option value='~='>regExp</option></select>";
			
			conector = "<select>";
			conector += "<option value='and'>e</option>";
			conector += "<option value='or'>ou</option>";
			conector += "<option value='not'>n&atilde;o</option></select>";
			
			valor = document.createElement("input");
			valor.type = "text";
			valor.value = "";
			valor.size = "20";
			
			ntb = document.createElement("tbody");
			ntr = document.createElement("tr");
			ntad = document.createElement("td");
			ntad.appendChild(add);
			ntr.appendChild(ntad);
			
			ntd = document.createElement("td");
			ntd.appendChild(xis);
			ntr.appendChild(ntd);
			
			ntd1 = document.createElement("td");
			ntd1.innerHTML = i3GEOF.filtro.comboTemas;
			ntr.appendChild(ntd1);
			
			ntd2 = document.createElement("td");
			ntd2.innerHTML = operador;
			ntr.appendChild(ntd2);
			
			ntd3 = document.createElement("td");
			ntd3.appendChild(valor);
			ntd3.appendChild(interrogacao);
			ntr.appendChild(ntd3);
			
			ntd4 = document.createElement("td");
			ntd4.innerHTML = conector;
			ntr.appendChild(ntd4);
			ntb.appendChild(ntr);
			
			tabela = $i("i3GEOfiltroparametros");
			tabela.appendChild(ntb);
		}
		catch(e){alert("Erro: "+e);}
	},
	/*
	Function: pegaFiltro
	
	Pega o filtro atual de um tema
	*/
	pegaFiltro: function(){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=pegafiltro&tema="+i3GEO.temaAtivo,
			cp = new cpaint(),
			temp = function(retorno){
				if(retorno.data !== undefined)
				{$i("i3GEOfiltrofiltro").value = retorno.data;}
			};
		cp.set_response_type("JSON");
		cp.call(p,"pegaFiltro",temp);
	},
	/*
	Function: limpaFiltro
	
	Limpa o filtro de um tema
	
	*/
	limpaFiltro: function(){
		try{
			if(i3GEOF.filtro.aguarde.visibility === "visible")
			{return;}
			i3GEOF.filtro.aguarde.visibility = "visible";
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=inserefiltro&tema="+i3GEO.temaAtivo+"&filtro=",
				cp = new cpaint(),
				temp = function(){
					i3GEOF.filtro.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				};
			cp.set_response_type("JSON");
			cp.call(p,"insereFiltro",temp);			
		}
		catch(e){alert("Erro: "+e);}
	},
	/*
	Function: aplicaFiltro
	
	Aplica um filtro ao tema
	
	Parametro:
	
	testa {String} - sim|nao indica a realização de teste ou aplicação final do filtro
	*/
	aplicaFiltro: function(testa){
		if(arguments.length === 0)
		{testa = "nao";}
		if(i3GEOF.filtro.aguarde.visibility === "visible")
		{return;}
		try{
			i3GEOF.filtro.aguarde.visibility = "visible";
			var filtro = "",
				re,g,ipt,i,nos,s,itemsel,valor,operador,conector,p,cp,temp;
			if( ($i("i3GEOfiltrofiltro").value !== "") &&($i("i3GEOfiltroguia2obj").style.display === "block")){
				filtro = $i("i3GEOfiltrofiltro").value;
				re = new RegExp("'","g");
				filtro = filtro.replace(re,"|");
				filtro = filtro.replace(re,"");
				filtro = filtro.replace(re,"");	
			}
			else{
				g = $i("i3GEOfiltroparametros");
				ipt = g.getElementsByTagName("tr");
				if (ipt.length > 1){
					for (i=2;i<ipt.length; i++){
						nos = ipt[i].childNodes;
						s = nos[2].getElementsByTagName("select");
						itemsel = s[0].value;
						s = nos[3].getElementsByTagName("select");
						operador = s[0].value;
						s = nos[4].getElementsByTagName("input");
						valor = s[0].value;
						s = nos[5].getElementsByTagName("select")
						conector = s[0].value;
						if (valor*1)
						{filtro = filtro + "(["+itemsel+"] "+operador+" "+valor+")";}
						else
						{filtro = filtro + "(|["+itemsel+"]| "+operador+" |"+valor+"|)";}
						if ((i + 1) != ipt.length) //tem conector
						{filtro = filtro + conector;}
						else
						{filtro = "("+filtro+")";}
					}
				}
			}
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=inserefiltro";
			cp = new cpaint();
			cp.set_response_type("JSON");
			cp.set_transfer_mode('POST');
			if (testa === "sim"){
			 	temp = function(retorno){
			 		$i("i3GEOfiltroguia3obj").innerHTML = "<img src="+retorno.data+" />";
			 		i3GEOF.filtro.aguarde.visibility = "hidden";
			 	};
			}
			else{
			 	temp = function(retorno){
			 		i3GEO.atualiza();
			 		i3GEOF.filtro.aguarde.visibility = "hidden";
			 	};		
			}
			cp.call(p,"insereFiltro",temp,"tema="+i3GEO.temaAtivo,"filtro="+filtro,"testa="+testa);
		}
		catch(e){
			alert("Erro: "+e);
			i3GEOF.filtro.aguarde.visibility = "hidden";
		}
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>
