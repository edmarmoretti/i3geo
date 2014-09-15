
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Insere ponto

Inclui pontos no mapa no local clicado pelo usu&aacute;rio

Veja:

<i3GEO.mapa.dialogo.cliquePonto>

Arquivo:

i3geo/ferramentas/inserexy2/index.js.php

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
Classe: i3GEOF.inserexy

*/
i3GEOF.inserexy = {
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(){
		i3GEOF.inserexy.iniciaDicionario();
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(){
		if(typeof(i3GEOF.inserexy.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/inserexy2/dicionario.js",
				"i3GEOF.inserexy.iniciaJanelaFlutuante()",
				"i3GEOF.inserexy.dicionario_script"
			);
		}
		else{
			i3GEOF.inserexy.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.inserexy.html();
			i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia0","i3GEOinserexyguia");
			//eventos das guias
			$i("i3GEOinserexyguia0").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia0","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "none";
			};
			$i("i3GEOinserexyguia1").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia1","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "none";
			};
			$i("i3GEOinserexyguia2").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia2","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "none";
			};
			$i("i3GEOinserexyguia3").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia3","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "block";
			};
			$i("i3GEOinserexyguia4").onclick = function()
			{i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia4","i3GEOinserexyguia");};
			$i("i3GEOinserexyguia5").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia5","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "none";
			};
			$i("i3GEOinserexyguia6").onclick = function(){
				i3GEO.guias.mostraGuiaFerramenta("i3GEOinserexyguia6","i3GEOinserexyguia");
				$i("i3GEOinserexyprojecao").style.display = "none";
			};
			i3GEO.util.mensagemAjuda("i3GEOinserexymen1",$i("i3GEOinserexymen1").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOinserexymendd",$i("i3GEOinserexymendd").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOinserexymen2",$i("i3GEOinserexymen2").innerHTML);
			i3GEO.util.mensagemAjuda("i3GEOinserexymen3",$i("i3GEOinserexymen3").innerHTML);

			new YAHOO.widget.Button(
				"i3GEOinserexybotaodd",
				{onclick:{fn: i3GEOF.inserexy.inserirdd}}
			);
			new YAHOO.widget.Button(
				"i3GEOinserexybotaocriatema",
				{onclick:{fn: i3GEOF.inserexy.criatemaeditavel}}
			);
			new YAHOO.widget.Button(
				"i3GEOinserexybotaoperfil",
				{onclick:{fn: i3GEOF.inserexy.graficoPerfil}}
			);

			new YAHOO.widget.Button(
				"i3GEOinserexybotao2",
				{onclick:{fn: i3GEOF.inserexy.inserir}}
			);
			new YAHOO.widget.Button(
				"i3GEOinserexybotao6",
				{onclick:{fn: i3GEOF.inserexy.colar}}
			);
			new YAHOO.widget.Button(
				"i3GEOinserexybotao3",
				{onclick:{fn: i3GEOF.inserexy.wkt}}
			);
			new YAHOO.widget.Button(
				"i3GEOinserexybotao4",
				{onclick:{fn: i3GEOF.inserexy.criaPol}}
			);
			new YAHOO.widget.Button(
				"i3GEOinserexybotao5",
				{onclick:{fn: i3GEOF.inserexy.criaLin}}
			);
			i3GEOF.inserexy.ativaFoco();
			i3GEOF.inserexy.montaComboLocal();
			i3GEO.util.radioEpsg(
				function(retorno){
					$i("i3GEOinserexylistaepsg").innerHTML = retorno.dados;
				},
				"i3GEOinserexylistaepsg",
				"i3GEOinserexy"
			);
		}
		catch(erro){i3GEO.janela.tempoMsg(erro);}
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = '' +
		'<div id=i3GEOinserexyguiasYUI class="yui-navset" style="top:0px;cursor:pointer;left:0px;">' +
		'	<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">' +
		'		<li><a  ><em><div id="i3GEOinserexyguia0" style="text-align:center;left:0px;" ><img style="height:14px" src="'+i3GEO.configura.locaplic+'/imagens/oxygen/16x16/help-about.png"></div></em></a></li>' +
		'		<li><a  ><em><div id="i3GEOinserexyguia1" style="text-align:center;left:0px;" >'+$trad(1,i3GEOF.inserexy.dicionario)+'</div></em></a></li>' +
		'		<li><a  ><em><div id="i3GEOinserexyguia2" style="text-align:center;left:0px;" >Direc/dist</div></em></a></li>' +
		'		<li><a  ><em><div id="i3GEOinserexyguia3" style="text-align:center;left:0px;" >'+$trad(2,i3GEOF.inserexy.dicionario)+'</div></em></a></li>' +
		'		<li><a  ><em><div id="i3GEOinserexyguia4" style="text-align:center;left:0px;" >'+$trad(3,i3GEOF.inserexy.dicionario)+'</div></em></a></li>' +
		'		<li><a  ><em><div id="i3GEOinserexyguia5" style="text-align:center;left:0px;" >'+$trad(4,i3GEOF.inserexy.dicionario)+'</div></em></a></li>' +
		'		<li><a  ><em><div id="i3GEOinserexyguia6" style="text-align:center;left:0px;" >'+$trad(5,i3GEOF.inserexy.dicionario)+'</div></em></a></li>' +
		'	</ul>' +
		'</div><br>' +
		'<div id=i3GEOinserexyprojecao style="text-align:left;left:0px;display:none">' +
		'   <p class=paragrafo >'+$trad(6,i3GEOF.inserexy.dicionario)+':</p>' +
		'	<div id="i3GEOinserexylistaepsg" style="text-align:left;border:1px solid gray;width:300px;overflow:auto;height:60px;display:block;left:1px" >' +
		'	</div>' +
		'</div>' +
		'<div class=guiaobj id="i3GEOinserexyguia0obj" style="left:1px;display:none;top:10px"><p class=paragrafo >'+$trad(35,i3GEOF.inserexy.dicionario)+'</p></div>' +
		'<div class=guiaobj id="i3GEOinserexyguia1obj" style="left:1px;display:none;top:10px">' +
		'	<p class=paragrafo >'+$trad(7,i3GEOF.inserexy.dicionario)+':</p>' +
		'	<div class="styled-select" id=i3GEOinserexyshapefile >' +
		'	</div><br>' +
		'	<p class=paragrafo ><input id=i3GEOinserexybotaocriatema type="button" size=18 value="'+$trad(8,i3GEOF.inserexy.dicionario)+'" />' +
		'	<input id=i3GEOinserexybotaoperfil type="button" size=18 value="'+$trad(9,i3GEOF.inserexy.dicionario)+'" /></p>' +

		'	<div id=i3GEOinserexyopcitens style=display:none;left:0px;text-align:left; >' +
		'		<p class=paragrafo >'+$trad(10,i3GEOF.inserexy.dicionario)+':</p>' +
		'		<div class="styled-select" id=i3GEOinserexyshapefileitem >' +
		'		</div>' +
		'		<br><p class=paragrafo >Valor: </p>'+
		'		<div class="styled-select" ><input type=text value="" id="i3GEOinserexyvalorItem" /></div>' +
		'	<br></div>' +
		'	<div id=i3GEOinserexymen1 style="display:block;left:0px;">' +
		'		<p class=paragrafo >'+$trad(11,i3GEOF.inserexy.dicionario)+'</p>' +
		'		<p class=paragrafo >'+$trad(12,i3GEOF.inserexy.dicionario)+'</p>' +
		'		<p class=paragrafo >'+$trad(13,i3GEOF.inserexy.dicionario)+'</p>' +
		'	</div>' +
		'</div>' +

		'<div class=guiaobj id="i3GEOinserexyguia2obj" style="left:1px;display:none;">' +
		'	<p class=paragrafo >'+$trad(14,i3GEOF.inserexy.dicionario)+':</p>' +
		$inputText("","","i3GEOinserexyxgdd","grau",3,"00") +
		$inputText("","","i3GEOinserexyxmdd","minuto",3,"00") +
		$inputText("","","i3GEOinserexyxsdd","segundo",3,"0.0") +
		'	<br><br><p class=paragrafo >'+$trad(15,i3GEOF.inserexy.dicionario)+':</p>' +
		$inputText("","","i3GEOinserexydistdd","km",5,"0.0") +
		'	<div id=opcdd style="top:15px;left:0px">' +
		'		<p class=paragrafo ><input id=i3GEOinserexybotaodd type="button" size=14 value="'+$trad(16,i3GEOF.inserexy.dicionario)+'"  /></p>' +
		'	</div>' +
		'	<div id=i3GEOinserexymendd style="position:relative;left:0px;top:20px">' +
		'		<p class=paragrafo >'+$trad(17,i3GEOF.inserexy.dicionario)+'</p>' +
		'		<p class=paragrafo >'+$trad(18,i3GEOF.inserexy.dicionario)+'</p>' +
		'	</div>' +
		'</div> '+
		'<div class=guiaobj id="i3GEOinserexyguia3obj" style="left:1px;display:none;">' +
		'	<div id=i3GEOinserexytipodig style="text-align:left;left:0px">' +
		'		<p class=paragrafo >'+$trad(19,i3GEOF.inserexy.dicionario)+':</p>' +
		'		<table class=lista6 >' +
		'		<tr>' +
		'			<td><input style="border:0px solid white;cursor:pointer" title="DMS" onclick="i3GEOF.inserexy.escolhedig(\'i3GEOinserexydigmascara\')" name=i3GEOinserexytipodig type=radio id="i3GEOinserexytipodigmascara" checked /></td>' +
		'			<td>'+$trad(20,i3GEOF.inserexy.dicionario)+'</td>' +
		'			<td><input style="border:0px solid white;cursor:pointer" title="DMS" onclick="i3GEOF.inserexy.escolhedig(\'i3GEOinserexydigcampo\')" name=i3GEOinserexytipodig type=radio id="i3GEOinserexytipodigcampo" /></td>' +
		'			<td>'+$trad(21,i3GEOF.inserexy.dicionario)+'</td>' +
		'		</tr>' +
		'		</table><br>' +
		'	</div>' +
		'	<div id=i3GEOinserexydigmascara style="left:0px">' +
		'		<p class=paragrafo >X:'+
		$inputText("","","i3GEOinserexyxg","grau",3,"-00") +
		$inputText("","","i3GEOinserexyxm","minuto",3,"00") +
		$inputText("","","i3GEOinserexyxs","segundo",3,"0.0") +
		'		</p><p class=paragrafo >Y:'+
		$inputText("","","i3GEOinserexyyg","grau",3,"-00") +
		$inputText("","","i3GEOinserexyym","minuto",3,"00") +
		$inputText("","","i3GEOinserexyys","segundo",3,"0.0") +
		'	</p></div>' +
		'	<div id=i3GEOinserexydigcampo style="display:none;left:0px">' +
		'		<p class=paragrafo >X: '+
		$inputText("","","i3GEOinserexylongitude","dms",16,"") +
		'		</p><p class=paragrafo >Y: '+
		$inputText("","","i3GEOinserexylatitude","dms",16,"") +
		'	</p></div>' +
		'	<br><p class=paragrafo ><input id=i3GEOinserexybotao2 type="button" size=14 value="'+$trad(16,i3GEOF.inserexy.dicionario)+'"  />' +
		'	<div id=i3GEOinserexymen2 style="left:0px;">' +
		'		<p class=paragrafo >'+$trad(22,i3GEOF.inserexy.dicionario)+
		'		<p class=paragrafo >'+$trad(23,i3GEOF.inserexy.dicionario)+
		'		<p class=paragrafo >'+$trad(24,i3GEOF.inserexy.dicionario)+
		'		<p class=paragrafo >'+$trad(25,i3GEOF.inserexy.dicionario)+'<br><br><br>' +
		'	</div>' +
		'</div>' +
		'<div class=guiaobj id="i3GEOinserexyguia4obj" style="left:1px;display:none;">' +
		'	<br><p class=paragrafo >'+$trad(26,i3GEOF.inserexy.dicionario)+':</p>' +
		$inputText("","","i3GEOinserexycolar","pares",50,"") +
		'	<br><br><p class=paragrafo ><input id=i3GEOinserexybotao6 type="button" size=14 value="'+$trad(16,i3GEOF.inserexy.dicionario)+'"  /></p>' +
		'	<div id=i3GEOinserexymen3 style="display:block;left:0px;">' +
		'		<p class=paragrafo >'+$trad(27,i3GEOF.inserexy.dicionario)+'<br> -54.23 -12.5 -50 -5.33<br>' +
		'	</div>' +
		'</div>' +
		'<div class=guiaobj id="i3GEOinserexyguia5obj" style="left:1px;display:none;">' +
		'	<p class=paragrafo ><input id=i3GEOinserexybotao3 type="button" size=25 value="'+$trad(28,i3GEOF.inserexy.dicionario)+'" /></p>' +
		'	<p class=paragrafo ><input id=i3GEOinserexybotao4 type="button" size=25 value="'+$trad(29,i3GEOF.inserexy.dicionario)+'" /></p>' +
		'	<p class=paragrafo ><input id=i3GEOinserexybotao5 type="button" size=25 value="'+$trad(30,i3GEOF.inserexy.dicionario)+'" /></p>' +
		'	<div id=i3GEOinserexywktres style="display:block;left:0px">' +
		'	</div>'+
		'</div>' +
		'<div class=guiaobj id="i3GEOinserexyguia6obj" style="left:1px;display:none;">' +
		'</div>';
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		cabecalho = function(){
			i3GEOF.inserexy.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.inserexy");
		};
		titulo = $trad("d22t")+" <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=83' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"500px",
			"300px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.inserexy",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.inserexy.aguarde = $i("i3GEOF.inserexy_imagemCabecalho").style;
		$i("i3GEOF.inserexy_corpo").style.backgroundColor = "white";
		i3GEOF.inserexy.inicia(divid);

		if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEOF.inserexy.adicionaClique()") < 0)
		{i3GEO.eventos.MOUSECLIQUE.push("i3GEOF.inserexy.adicionaClique()");}
		i3GEO.eventos.cliquePerm.desativa();
		temp = function(){
			i3GEO.eventos.cliquePerm.ativa();
			i3GEO.barraDeBotoes.ativaPadrao();
			i3GEO.eventos.MOUSECLIQUE.remove("i3GEOF.inserexy.adicionaClique()");
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"crosshair",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
	},
	/*
	Function: ativaFoco

	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.eventos.cliquePerm.desativa();
		i3GEO.util.mudaCursor(i3GEO.configura.cursores,"crosshair",i3GEO.Interface.IDMAPA,i3GEO.configura.locaplic);
		i3GEO.barraDeBotoes.ativaIcone("inserexy");
		g_tipoacao='inserexy';
		g_operacao='';
		var i = $i("i3GEOF.inserexy_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 21000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: montaComboLocal

	Monta o combo com a lista de temas que podem ser editados (temas armazenados no diret&oacute;rio tempor&aacute;rio do i3Geo)

	Veja:

	<i3GEO.util.comboTemas>
	*/
	montaComboLocal: function(){
		i3GEO.util.comboTemas(
			"i3GEOinserexytemasLocais",
			function(retorno){
				$i("i3GEOinserexyshapefile").innerHTML = retorno.dados;
				if ($i("i3GEOinserexytemasLocais")){
					$i("i3GEOinserexytemasLocais").onchange = function(){
						i3GEO.mapa.ativaTema($i("i3GEOinserexytemasLocais").value);
						i3GEOF.inserexy.listaItens();
						i3GEOF.inserexy.listaPontos();
					};
				}
				if(i3GEO.temaAtivo !== ""){
					var temp = $i("i3GEOinserexytemasLocais");
					if(temp){
						temp.value = i3GEO.temaAtivo;
						temp.onchange.call();
					}
				}
			},
			"i3GEOinserexyshapefile",
			"",
			false,
			"locais",
			"display:block"
		);
	},
	/*
	Function: criatemaeditavel

	Cria um novo tema local para receber os pontos

	Veja:

	<CRIASHPVAZIO>
	*/
	criatemaeditavel: function(){
		if(i3GEOF.inserexy.aguarde.visibility === "visible")
		{return;}
		var funcaoOK = function(){
			try{
				var tituloTema,cp,p;
				tituloTema = $i("i3GEOjanelaprompt").value;
				if(tituloTema === "")
				{tituloTema = "Pontos inseridos "+Math.random();}
				i3GEOF.inserexy.aguarde.visibility = "visible";
				temp = function(retorno){
					i3GEOF.inserexy.aguarde.visibility = "hidden";
					i3GEO.temaAtivo = retorno.data;
					i3GEO.atualiza();
					i3GEOF.inserexy.montaComboLocal();
				};
				cp = new cpaint();
				cp.set_response_type("JSON");
				p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=criashpvazio&tituloTema="+tituloTema;
				cp.call(p,"criaSHPvazio",temp);
			}
			catch(e){
				i3GEO.janela.tempoMsg("Erro: "+e);
				i3GEOF.inserexy.aguarde.visibility = "hidden";
			}
		};
		i3GEO.janela.prompt($trad(31,i3GEOF.inserexy.dicionario),funcaoOK,$trad(32,i3GEOF.inserexy.dicionario)+parseInt((Math.random() * 100),10));
	},
	/*
	Function: listaPontos

	Lista os pontos existentes no tema escolhido

	Veja:

	<LISTAPONTOSSHAPE>
	*/
	listaPontos: function(){
		var cp,p,temp;
		temp = function(retorno){
			if (retorno.data != undefined){
				var ins = [],i;
				for (i=0;i<retorno.data.length; i++)
				{ins.push("<div style='font-size:12px'>"+retorno.data[i].x+" "+retorno.data[i].y+"</div><br>");}
				$i("i3GEOinserexyguia6obj").innerHTML = ins.join("");
			}
			else
			{$i("i3GEOinserexyguia6obj").innerHTML = "<p style=color:red >Erro<br>";}
		};
		cp = new cpaint();
		cp.set_response_type("JSON");
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaPontosShape&tema="+$i("i3GEOinserexytemasLocais").value;
		cp.call(p,"listaPontosShape",temp);
	},
	/*
	Function: listaItens

	Lista os itens do tema escolhido para receber os pontos

	Veja:

	<i3GEO.util.comboItens>
	*/
	listaItens: function(){
		i3GEO.util.comboItens(
			"i3GEOinserexyItem",
			$i("i3GEOinserexytemasLocais").value,
			function(retorno){
				$i("i3GEOinserexyshapefileitem").innerHTML = "<p class=paragrafo>"+retorno.dados+"</p>";
				$i("i3GEOinserexyopcitens").style.display = "block";
			},
			"i3GEOinserexyshapefileitem",
			"display:block "
		);
	},
	/*
	Function: adicionaClique

	Adiciona um ponto no mapa no local onde o usu&aacute;rio clicar com o mouse

	As coordenadas s&atilde;o obtidas do objeto objposicaocursor
	*/
	adicionaClique: function(){
		i3GEOF.inserexy.adiciona(objposicaocursor.ddx+" "+objposicaocursor.ddy,"cliqueMapa");
	},
	/*
	Function: inserirdd

	Insere um ponto com base na dire&ccedil;&atilde;o e dist�ncia
	*/
	inserirdd: function(){
		try{
			var regv,xgv,xmv,xsv,direcao,divs,x,y,xy;
			regv = new RegExp(",", "g");
			xgv = $i("i3GEOinserexyxgdd").value;
			xmv = $i("i3GEOinserexyxmdd").value;
			xsv = $i("i3GEOinserexyxsdd").value;
			xsv = xsv.replace(regv,".");
			direcao = i3GEO.calculo.dms2dd(xgv,xmv,xsv);
			//pega o &uacute;ltimo ponto
			divs = $i("i3GEOinserexyguia6obj").getElementsByTagName("div");
			divs = divs[divs.length - 1];
			divs = divs.innerHTML.split(" ");
			x = divs[0];
			y = divs[1];
			xy = i3GEO.calculo.destinoDD(x,y,$i("i3GEOinserexydistdd").value,direcao);
			i3GEOF.inserexy.adiciona(xy[0]+" "+xy[1]);
		}catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	},
	/*
	Function: inserir

	Insere pontos digitando-se as coordenadas
	*/
	inserir: function(){
		try{
			var reg = new RegExp("w|W|l|L|o|O|'|G|r", "g"),
				regv = new RegExp(",", "g"),
				v,xgv = 0,xmv = 0,xsv = 0,vv,ygv = 0,ymv = 0,ysv = 0,x,y;
			if($i("i3GEOinserexytipodigcampo").checked){
				if (!$i("i3GEOinserexylongitude").value == ""){
					v = $i("i3GEOinserexylongitude").value + " 0" + " 0";
					v = v.replace(reg,"");
					v = v.replace(regv,".");
					v = v.split(" ");
					xgv = v[0];
					xmv = v[1];
					xsv = v[2];
					xsv = xsv.replace(",",".");
				}
				if (!$i("i3GEOinserexylatitude").value == ""){
					vv = $i("i3GEOinserexylatitude").value  + " 0" + " 0";
					vv = vv.replace(reg,"");
					vv = vv.replace(regv,".");
					vv = vv.split(" ");
					ygv = vv[0];
					ymv = vv[1];
					ysv = vv[2];
					ysv = ysv.replace(regv,".");
				}
			}
			if($i("i3GEOinserexytipodigmascara").checked){
				xgv = $i("i3GEOinserexyxg").value;
				xmv = $i("i3GEOinserexyxm").value;
				xsv = $i("i3GEOinserexyxs").value;
				xsv = xsv.replace(regv,".");
				ygv = $i("i3GEOinserexyyg").value;
				ymv = $i("i3GEOinserexyym").value;
				ysv = $i("i3GEOinserexyys").value;
				ysv = ysv.replace(regv,".");
			}
			x = i3GEO.calculo.dms2dd(xgv,xmv,xsv);
			y = i3GEO.calculo.dms2dd(ygv,ymv,ysv);
			g_tipoacao = "inserexy";
			i3GEOF.inserexy.adiciona(x+" "+y);
		}
		catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	},
	/*
	Functin: colar

	Captura as coordenadas coladas pelo usu&aacute;rio e insere os pontos
	*/
	colar: function(){
		var regv = new RegExp(",", "g"),
			valores = $i("i3GEOinserexycolar").value;
		valores = valores.replace(regv,".");
		i3GEOF.inserexy.adiciona(valores);
	},
	/*
	Function: escolhedig

	Define o tipo de entrada de coordenadas (dms ou dd)
	*/
	escolhedig: function(q){
		$i("i3GEOinserexydigmascara").style.display="none";
		$i("i3GEOinserexydigcampo").style.display="none";
		$i(q).style.display="block";
	},
	/*
	Function: pegaProjecao

	Obt&eacute;m o c&oacute;digo da proje&ccedil;&atilde;o escolhida
	*/
	pegaProjecao: function(){
		var inputs = $i("i3GEOinserexylistaepsg").getElementsByTagName("input"),
			i,
			projecao = "";
		for (i=0;i<inputs.length; i++){
			if (inputs[i].checked == true)
			{projecao = inputs[i].value;}
		}
		return(projecao);
	},
	/*
	Function: adiciona

	Adiciona um ponto no mapa

	Parametros:

	xy {string} - coordenadas x e y separadas por espa&ccedil;o

	fonte {string} - (opcional) como a coordenada foi obtida. Se for "cliqueMapa" o parametro proje&ccedil;&atilde;o ser&aacute; enviado como vazio para o servidor

	Veja:

	<i3GEO.php.insereSHP>
	*/
	adiciona: function(xy,fonte){
		if(i3GEOF.inserexy.aguarde.visibility === "visible")
		{return;}
		if(g_tipoacao === "inserexy"){
			i3GEOF.inserexy.aguarde.visibility = "visible";
			var tema = $i("i3GEOinserexytemasLocais").value,
				item = "",
				valoritem = "",
				temp,
				n,
				i,
				xyn,
				projecao = i3GEOF.inserexy.pegaProjecao();

			xyn = xy.split(" ");
			n = xyn.length;
			temp = "";
			for(i=0;i<n;i = i + 2){
				temp += "<div style='font-size:12px' >" + xyn[i]+" "+xyn[i+1] + "</div><br>";
			}
			$i("i3GEOinserexyguia6obj").innerHTML += temp;
			if($i("i3GEOinserexyItem") && $i("i3GEOinserexyvalorItem")){
				item = $i("i3GEOinserexyItem").value;
				valoritem = $i("i3GEOinserexyvalorItem").value;
			}
			if (tema === "")
			{i3GEO.janela.tempoMsg($trad(33,i3GEOF.inserexy.dicionario));}
			else{
				temp = function(retorno){
					if(i3GEO.Interface.ATUAL === "padrao")
					{i3GEO.atualiza();}
					i3GEO.Interface.atualizaTema(retorno,tema);
					i3GEOF.inserexy.aguarde.visibility = "hidden";
				};
				if(fonte !== undefined){
					projecao = "";
				}
				i3GEO.php.insereSHP(temp,tema,item,valoritem,xy,projecao);
			}
		}
	},
	/*
	Function: criaLin

	Converte os pontos de um tema em linhas

	Veja:

	<SPHPT2SHP>
	*/
	criaLin: function(){
		if(i3GEOF.inserexy.aguarde.visibility === "visible")
		{return;}
		i3GEOF.inserexy.aguarde.visibility = "visible";
		var cp = new cpaint(),
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=sphPT2shp&para=linha&tema="+$i("i3GEOinserexytemasLocais").value+"&ext="+i3GEO.parametros.mapexten,
			temp = function(){
				i3GEOF.inserexy.aguarde.visibility = "hidden";
				i3GEO.atualiza();
			};
		cp.set_response_type("JSON");
		cp.call(p,"sphPT2shp",temp);
	},
	/*
	Function: criaPol

	Converte os pontos de um tema em poligonos

	Veja:

	<SPHPT2SHP>
	*/
	criaPol: function(){
		if(i3GEOF.inserexy.aguarde.visibility === "visible")
		{return;}
		i3GEOF.inserexy.aguarde.visibility = "visible";
		var cp = new cpaint(),
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=sphPT2shp&para=poligono&tema="+$i("i3GEOinserexytemasLocais").value+"&ext="+i3GEO.parametros.mapexten,
			temp = function(){
				i3GEOF.inserexy.aguarde.visibility = "hidden";
				i3GEO.atualiza();
			};
		cp.set_response_type("JSON");
		cp.call(p,"sphPT2shp",temp);
	},
	/*
	Function: wkt

	Converte os pontos em WKT

	Veja:

	<MOSTRAWKT>
	*/
	wkt: function(){
		if(i3GEOF.inserexy.aguarde.visibility === "visible")
		{return;}
		i3GEOF.inserexy.aguarde.visibility = "visible";
		try{
			var divs = $i("i3GEOinserexyguia6obj").getElementsByTagName("div"),
				n = divs.length,
				xy = [],
				cp = new cpaint(),
				i,
				mostra = function(retorno){
					i3GEOF.inserexy.aguarde.visibility = "hidden";
					if (retorno.data !== undefined){
						var ins = "<textarea style=width:470px;height:80px >"+retorno.data[0]+"</textarea><br>";
						ins += "<textarea style=width:470px;height:80px >"+retorno.data[1]+"</textarea><br>";
						ins += "<textarea style=width:470px;height:80px >"+retorno.data[2]+"</textarea><br>";
						$i("i3GEOinserexywktres").innerHTML = "<p class=paragrafo >"+ins+"</p>";
					}
					else
					{$i("i3GEOinserexywktres").innerHTML = "<p style=color:red >Erro<br>";}
				};
			for (i=0;i<n;i++)
			{xy.push(divs[i].innerHTML);}
			xy = xy.join(" ");
			cp.set_response_type("JSON");
			cp.call(i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=mostrawkt&xy="+xy,"xy2wkt",mostra);
		}
		catch(e){i3GEO.janela.tempoMsg("Erro: "+e);i3GEOF.inserexy.aguarde.visibility = "hidden";}
	},
	/*
	Function: graficoPerfil

	Cria um gr&aacute;fico de perfil com base nos dados inseridos
	*/
	graficoPerfil: function(){
		try{
			var divs = $i("i3GEOinserexyguia6obj").getElementsByTagName("div"),
				js = i3GEO.configura.locaplic+"/ferramentas/perfil/index.js.php",
				n = divs.length,
				x = [],
				y = [],
				xy,
				i;
			for (i=0;i<n;i++){
				xy = divs[i].innerHTML.split(" ");
				x.push(xy[0]);
				y.push(xy[1]);
			}
			if(x.length == 0)
			{i3GEO.janela.tempoMsg($trad(34,i3GEOF.inserexy.dicionario));return;}
			pontosdistobj = {
				xpt: x,
				ypt: y
			};
			i3GEO.util.scriptTag(js,"i3GEOF.perfil.criaJanelaFlutuante(pontosdistobj)","i3GEOF.perfil_script");

		}
		catch(e){i3GEO.janela.tempoMsg("Erro: "+e);}
	}
};
