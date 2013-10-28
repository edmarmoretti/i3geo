/*
Title: Mapa

i3GEO.mapa

Executa opera&ccedil;&otilde;es obre o mapa principal

Em i3GEO.mapa.dialogo estao as funcoes de abertura dos dialogos para alteracao das propriedades do mapa,
como cor de fundo, tipo de imagem, legenda etc.


Arquivo:

i3geo/classesjs/classe_mapa.js

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

*/
if(typeof(i3GEO) === 'undefined'){
	var i3GEO = {};
}
i3GEO.mapa = {
	/*
	Propriedade: AUTORESIZE

	Indica se o tamanho do mapa sera ajustado toda vez que o navegador for redimensionado

	Type:
	{boolean}

	Default:
	{false}
	*/
	AUTORESIZE: false,
	/*
	Armazena o nome dos objetos geoXml adicionados ao mapa pela API do google maps

	Tipo:
	{Array}
	*/
	GEOXML: [],
	/*
	Function: insereDobraPagina

	Insere o icone do tipo "dobra de pagina" que permite alterar o renderizador do mapa

	Parametros:

	tipo {string} - tipo de icone googlemaps|openlayers

	imagem {string} - endereco da imagem que sera utilizada no icone
	*/
	insereDobraPagina: function(tipo,imagem){
		var novoel = $i("i3GEOdobraPagina");
		if(!novoel){
			novoel = document.createElement("img");
		}
		novoel.src = imagem;
		novoel.id = "i3GEOdobraPagina";
		YAHOO.util.Event.addListener(novoel, "click", YAHOO.util.Event.stopPropagation);
		if(tipo === "googlemaps"){
			novoel.onclick = function(evt){
				i3GEO.Interface.atual2gm.inicia();
			};
		}
		if(tipo === "openlayers"){
			novoel.onclick = function(evt){
				i3GEO.Interface.atual2ol.inicia();
			};
		}
		novoel.style.cursor = "pointer";
		novoel.style.position = "absolute";
		novoel.style.top = i3GEO.parametros.h - 35 + "px";
		novoel.style.zIndex = "50000";
		novoel.style.left = i3GEO.parametros.w - 35 + "px";
		YAHOO.util.Event.addListener(novoel, "click", YAHOO.util.Event.stopPropagation);
		$i(i3GEO.Interface.IDMAPA).appendChild(novoel);
	},
	/*
	Reposiciona o icone do tipo "dobra de pagina"
	*/
	reposicionaDobraPagina: function(){
		var novoel = $i("i3GEOdobraPagina");
		if(!novoel){
			return;
		}
		novoel.style.top = i3GEO.parametros.h - 35 + "px";
		novoel.style.left = i3GEO.parametros.w - 35 + "px";
	},
	/*
	Ativa o redimensionamento automatico do mapa sempre que o navegador for redimensionado

	e definido como um evento do elemento window
	*/
	ativaAutoResize: function(){
		window.onresize = function(){
			var Dw,Dh, r = false;
			Dw = YAHOO.util.Dom.getViewportWidth();
			Dh = YAHOO.util.Dom.getViewportHeight();
			if(Math.abs(Dw - i3GEO.tamanhodoc[0]) > 50){
				r = true;
			}
			if(Math.abs(Dh - i3GEO.tamanhodoc[1]) > 50){
				r = true;
			}
			if(r === false)
			{return;}
			i3GEO.tamanhodoc = [Dw,Dh];
			setTimeout(function(){
				i3GEO.reCalculaTamanho();
				i3GEO.barraDeBotoes.recria("i3geo_barra2");
				if(i3GEO.Interface.TABLET === true)
				{i3GEO.guias.escondeGuias();return;}
				if(i3GEO.guias.TIPO === "movel")
				{i3GEO.guias.guiaMovel.reposiciona();}
				else
				{i3GEO.guias.ajustaAltura();}
				i3GEO.mapa.reposicionaDobraPagina();
			},2000);
		};
	},
	/*
	Ajusta o posicionamento do corpo do mapa

	Esse ajuste e necessario na inicializacao, uma vez que o mapa utiliza style.position='absolute'

	Parameters:

	elemento {String} - id do elemento HTML que devera ser ajustado e que contem o mapa
	*/
	ajustaPosicao: function(elemento){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.ajustaPosicao()");}
		if(arguments.length === 0){return;}
		var imagemxi = 0,
			imagemyi = 0,
			dc = $i(elemento),
			c;
		if(!dc){return;}
		try{
			while ((dc.offsetParent) && (dc.offsetParent.id !== "i3geo")){
				dc = dc.offsetParent;
				imagemxi += dc.offsetLeft;
				imagemyi += dc.offsetTop;
			}
			c = $i(i3GEO.Interface.IDCORPO);
			if (c){
				c.style.position="absolute";
				if(navm)
				{$left(i3GEO.Interface.IDCORPO,imagemxi - 1);}
				else
				{$left(i3GEO.Interface.IDCORPO,imagemxi);}
				$top(i3GEO.Interface.IDCORPO,imagemyi);
			}
		}
		catch(e){i3GEO.janela.tempoMsg("Ocorreu um erro. i3GEO.mapa.ajustaPosicao "+e);}
	},
	/*
	Function: ativaTema

	Altera a variavel i3GEO.temaAtivo e atualiza a interface em funcao do novo tema que for ativado

	O tema anteriormente ativo tem sua cor alterada para a cor normal e o novo tema e destacado com uma cor diferente

	Executa tambem as funcoes armazenadas em i3GEO.eventos.ATIVATEMA

	Parametros:

	codigo {string} - codigo da camada
	*/
	ativaTema: function(codigo){
		if(codigo){
			if(codigo === "")
			{return;}
			if(i3GEO.temaAtivo !== "")
			{i3GEO.util.defineValor("ArvoreTituloTema"+i3GEO.temaAtivo,"style.color","");}
			i3GEO.temaAtivo = codigo;
			i3GEO.util.defineValor("ArvoreTituloTema"+codigo,"style.color","brown");
		}
	},
	/*
	Function: ativaLogo

	Ativa ou desativa a logo marca.
	*/
	ativaLogo: function(){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.ativaLogo()");}
		if(i3GEO.Interface.ATUAL === "googlemaps")
		{alert($trad("x21"));return;}
		i3GEO.php.ativalogo(i3GEO.atualiza);
		var cr = $i("i3GEOcopyright");
		if(cr){
			if(cr.style.display === "block")
			{cr.style.display = "none";}
			else
			{cr.style.display = "block";}
		}
	},
	/*
	Verifica se ocorreu algum problema na atualizacao do corpo do mapa e inicia o processo de tentativa de recuperacao

	Parametro:

	retorno {string} - objeto recebido da funcao PHP de atualizacao do mapa
	*/
	verifica:function(retorno){
		if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.verifica()");}
		try{
			if(retorno.data)
			{retorno = retorno.data;}
			if (retorno.variaveis)
			{retorno = retorno.variaveis;}
			if ((retorno === "erro") || (typeof(retorno) === 'undefined')){
				i3GEO.mapa.ajustaPosicao();
				i3GEO.janela.fechaAguarde();
				i3GEO.mapa.recupera.inicia();
			}
			i3GEO.mapa.recupera.TENTATIVA = 0;
		}
		catch(e){
			if(i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps"){
				i3GEO.janela.fechaAguarde();
				return;
			}
			if(this.recupera.TENTATIVA === 0){
				i3GEO.janela.tempoMsg("Erro no mapa. Sera feita uma tentativa de recuperacao.");
				i3GEO.mapa.recupera.inicia();
			}
			else{
				i3GEO.janela.tempoMsg("Recuperacao impossivel. Sera feita uma tentativa de reiniciar o mapa.");
				if (this.recupera.TENTATIVA === 1){
					this.recupera.TENTATIVA = 2;
					i3GEO.php.reiniciaMapa(i3GEO.atualiza);
				}
			}
			if(typeof(console) !== 'undefined'){console.error("i3GEO.mapa.verifica "+e);}
		}
	},
	/*
	Tenta recuperar o mapa caso ocorra algum problema

	O i3Geo mantem sempre uma copia do arquivo mapfile em uso. Essa funcao tenta
	usar essa copia para restaurar o funcionamento do mapa
	*/
	recupera:{
		/*
		Armazena a quantidade de tentativas de recuperacao que foram feitas

		Tipo:
		{Integer}
		*/
		TENTATIVA: 0,
		/*
		Inicia a tentativa de recuperacao
		*/
		inicia: function(){
			i3GEO.mapa.ajustaPosicao();
			i3GEO.janela.fechaAguarde();
			if(this.recupera.TENTATIVA === 0){
				this.recupera.TENTATIVA++;
				this.recupera.restaura();
			}
		},
		/*
		Restaura o mapa para a copia de seguranca existente no servidor
		*/
		restaura: function(){
			i3GEO.php.recuperamapa(i3GEO.atualiza);
		}
	},
	/*
	Classe: i3GEO.mapa.legendaHTML

	Controla a obtencao da legenda do mapa formatada em HTML.

	util para mostrar a legenda na tela
	*/
	legendaHTML:{
		/*
		Propriedade: incluiBotaoLibera

		Define se na legenda sera incluido o botao para liberar a legenda e inclui-la em uma janela flutuante

		Tipo:
		{boolean}

		Default:
		{true}
		*/
		incluiBotaoLibera: false,
		/*
		Armazena o id definido na criacao da legenda
		*/
		ID: "",
		/*
		 * Armazena a lista de camadas que devem ficar escondidas na legenda
		 */
		CAMADASSEMLEGENDA: [],
		/*
		Function: cria

		Cria a legenda HTML

		O elemento HTML definido em ID deve ter style=display:block

		A legenda e incluida no id definido. Se id for igual a "", sera apenas definido o evento de atualizacao,
		permitindo que seja criada a janela flutuante, por exemplo:

		i3GEO.mapa.legendaHTML.cria("");
		i3GEO.mapa.legendaHTML.libera();

		Parametros:

		id {String} - id do elemento que recebera a legenda
		*/
		cria: function(id){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.legendaHTML.cria()");}
			if(arguments.length === 0)
			{id = "";}
			i3GEO.mapa.legendaHTML.ID = id;
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.mapa.legendaHTML.atualiza()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.mapa.legendaHTML.atualiza()");}
			i3GEO.mapa.legendaHTML.atualiza();
		},
		/*
		Function: atualiza

		Atualiza o elemento HTML do mapa utilizado para mostrar a legenda
		*/
		atualiza: function(){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.legendaHTML.atualiza()");}
			var idleg = $i("wlegenda_corpo"),
				temp = function(retorno){
					var legenda = "",ins,re;
					re = new RegExp("<img src='' />", "g");
					if (retorno.data !== "erro" && retorno.data !== undefined ){
						legenda = "<div onclick='i3GEO.mapa.legendaHTML.mostraTodosOsTemas()' style=cursor:pointer;font-size:10px;text-align:left; >Mostra tudo</div><br>"+retorno.data.legenda;
					}
					if(legenda != "" && idleg){
						ins = "";
						if(i3GEO.mapa.legendaHTML.incluiBotaoLibera === true){
							ins += '<div style="cursor: pointer; text-align: left; font-size: 10px; display: block; height: 35px;" onclick="i3GEO.mapa.legendaHTML.libera()"><img id="soltaLeg" src="../imagens/branco.gif" title="clique para liberar" style="margin: 5px; position: relative;"> <p style="position: relative; left: -35px; top: -22px;">'+$trad("x11")+'</p></div>';
						}
						legenda = legenda.replace(re,"");
						ins += "<div id='corpoLegi' >"+ legenda + "</div>";

						idleg.innerHTML = legenda;
					}
					i3GEO.mapa.legendaHTML.escondeTemasMarcados();
				};
			if (idleg && idleg.style.display === "block"){
				//para o caso da legenda ja estar aberta
				if(i3GEO.mapa.legendaHTML.ID !== ""){
					idleg = $i(i3GEO.mapa.legendaHTML.ID);
					if(idleg){
						idleg.innerHTML = "";
					}
				}
				idleg = $i("wlegenda_corpo");
				i3GEO.mapa.legendaHTML.obtem(temp);
			}
			else{
				if(idleg){
					idleg.innerHTML = "";
				}
				if(i3GEO.mapa.legendaHTML.ID !== ""){
					idleg = $i(i3GEO.mapa.legendaHTML.ID);
					if(idleg && idleg.style.display === "block"){
						i3GEO.mapa.legendaHTML.obtem(temp);
					}
				}
			}
		},
		/*
		Faz a chamada em AJAX que gera a legenda

		O resultado e processado pela funcao passada como parametro

		Parametro:

		funcao {function} - funcao que recebera o resultado da chamada AJAX. O objeto CPAINT e enviado como parametro.
		*/
		obtem: function(funcao){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.legendaHTML.obtem()");}
			i3GEO.php.criaLegendaHTML(funcao,"",i3GEO.configura.templateLegenda);
		},
		/*
		Liga ou desliga um unico tema. Utilizado pela legenda HTML, permitindo que um tema seja processado diretamente na legenda.

		Parametro:

		inputbox {object) - objeto do tipo input checkbox com a propriedade value indicando o codigo do tema que sera processado
		*/
		ativaDesativaTema: function(inputbox){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.legendaHTML.ativaDesativaTema()");}
			var temp = function(){
				//i3GEO.contadorAtualiza++;
				i3GEO.php.corpo(i3GEO.atualiza,i3GEO.configura.tipoimagem);
				i3GEO.arvoreDeCamadas.atualiza("");
				i3GEO.janela.fechaAguarde("redesenha");
			};
			if(!inputbox.checked)
			{i3GEO.php.ligatemas(temp,inputbox.value,"");}
			else
			{i3GEO.php.ligatemas(temp,"",inputbox.value);}
		},
		escondeTema: function(tema){
			var d = $i("legendaLayer_"+tema);
			if(d){
				d.style.display = "none";
				i3GEO.mapa.legendaHTML.CAMADASSEMLEGENDA.push(tema);
			}
		},
		escondeTemasMarcados: function(){
			var temas = i3GEO.mapa.legendaHTML.CAMADASSEMLEGENDA,
				n = temas.length,
				i,temp;
			for(i=0;i<n;i++){
				temp = $i(temas[i]);
				if(temp){
					temp.style.display = "none";
				}
			}
		},
		mostraTodosOsTemas: function(){
			i3GEO.mapa.legendaHTML.CAMADASSEMLEGENDA = [];
			i3GEO.mapa.legendaHTML.atualiza();
		},
		/*
		Function: libera

		Libera a legenda criando uma janela flutuante sobre o mapa

		Parametros:

		ck - sim|nao - (opcional) inclui ou nao o checkbox que permitem desligar a camada
		*/
		libera: function(ck){
			if(!ck){
				ck = "nao";
			}
			if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.legendaHTML.libera()");}
			var cabecalho,minimiza,janela;
			if (!$i("wlegenda")){
				cabecalho = function(){
				};
				minimiza = function(){
					i3GEO.janela.minimiza("wlegenda");
				};
				janela = i3GEO.janela.cria(
						"302px",
						"300px",
						"",
						"",
						"",
						$trad("p3"),
						"wlegenda",
						false,
						"hd",
						cabecalho,
						minimiza
				);
			}
			else{
				janela = YAHOO.i3GEO.janela.manager.find("wlegenda");
				janela.show();
			}
			$i("wlegenda_corpo").style.backgroundColor = "white";

			if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.mapa.legendaHTML.atualiza()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.mapa.legendaHTML.atualiza()");}
			i3GEO.mapa.legendaHTML.atualiza();
		}
	},
	/*
	Controla a obtencao da legenda do mapa na forma de uma imagem

	e utilizado principalmente para armazenar as imagens para a funcao de
	obtencao do historico do mapa
	*/
	legendaIMAGEM:{
		/*
		Faz a chamada em AJAX que gera a legenda

		O resultado e processado pela funcao passada como parametro

		Parametro:

		funcao {function} - funcao que recebera o resultado da chamada AJAX. O objeto CPAINT e enviado como parametro.
		*/
		obtem: function(funcao){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.legendaIMAGEML.obtem()");}
			i3GEO.php.criaLegendaImagem(funcao);
		}
	},
	/*
	Classe: i3GEO.mapa.dialogo

	Abre as telas de dialogo das opcoes de manipulacao do mapa atual
	*/
	dialogo:{
		/*
		Function: listaDeMapasBanco

		Lista os mapas cadastrados no sistema de administracao do i3geo
		*/
		listaDeMapasBanco: function(){
			if(i3GEO.guias.CONFIGURA["mapas"]){
				var janela,divid;
				janela = i3GEO.janela.cria(
					"200px",
					"450px",
					"",
					"",
					"",
					"",
					"i3GEOFsalvaMapaLista",
					false,
					"hd"
				);
				divid = janela[2].id;
				i3GEO.guias.CONFIGURA["mapas"].click.call(this,divid);
			}
			else{
				window.open(i3GEO.configura.locaplic+"/admin/xmlmapas.php","_blank");
			}
		},
		/*
		Function: congelaMapa

		Congela a visão atual do mapa mostrando-o em uma janela flutuante
		*/
		congelaMapa: function(){
			var url="",
				idjanela = YAHOO.util.Dom.generateId(),
				cabecalho = function(){
				},
				minimiza = function(){
					i3GEO.janela.minimiza(idjanela);
				};
			if(i3GEO.Interface.ATUAL === "openlayers" || i3GEO.Interface.ATUAL === "googlemaps"){
				url = i3GEO.configura.locaplic+"/ferramentas/congelamapa/openlayers.php?g_sid="+i3GEO.configura.sid+"&ext="+i3GEO.parametros.mapexten;
				i3GEO.janela.cria(
					"500px",
					"350px",
					url,
					"",
					"",
					$trad("x64"),
					idjanela,
					false,
					"hd",
					cabecalho,
					minimiza
				);
			}
		},
		/*
		Function: metaestat

		Abre a janela de dialogo da ferramenta de cartogramas estatisticos METAESTAT
		*/
		metaestat: function(){
			var temp = function(){
				i3GEOF.metaestat.MULTIPARAMETROS = true;
				i3GEOF.metaestat.inicia();
			};
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.metaestat()","metaestat","metaestat","index.js",temp);
		},
		/*
		Function: metaestatListaMapas

		Lista os mapas publicados no METAESTAT
		*/
		metaestatListaMapas: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.metaestatListaMapas()","metaestat","listamapas","listamapas.js","i3GEOF.listamapas.iniciaJanelaFlutuante()");
		},
		/*
		Function: preferencias

		Preferencias do usuario
		*/
		preferencias: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.preferencias()","preferencias","preferencias");
		},
		/*
		Function: locregiao

		Abre a janela de dialogo da ferramenta de busca de regiao cadastrada no METAESTAT
		*/
		locregiao: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.locregiao()","metaestat","locregiao","locregiao.js");
		},
		/*
		Function: filtraregiao

		Abre a janela de dialogo da ferramenta de busca de regioes cadastradas no METAESTAT com opcao de filtrar a regiao escolhida
		*/
		filtraregiao: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.filtraregiao()","metaestat","locregiao","locregiao.js","i3GEOF.locregiao.abreComFiltro()");
		},
		/*
		Function: animacao

		Abre a janela de dialogo da ferramenta que permite animar o mapa atual
		*/
		animacao: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.animacao()","animacao","animacao");
		},
		/*
		Function: opacidade

		Abre a janela de dialogo da ferramenta de definicao da transparencia das camadas principais do mapa
		*/
		opacidade: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.opacidade()","opacidademapa","opacidademapa");
		},
		/*
		Function: telaRemota

		Abre a janela de dialogo da ferramenta de configuracao de uma tela remota
		*/
		telaRemota: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.telaremota()","telaremota","telaremota");
		},
		/*
		Function: t3d

		Abre a janela de dialogo da ferramenta de geracao da visualizacao em 3d
		*/
		t3d: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.t3d()","3d","t3d");
		},
		/*
		Function: imprimir

		Abre a janela de dialogo da ferramenta que permite imprimir o mapa atual
		*/
		imprimir: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.imprimir()","imprimir","imprimir");
		},
		/*
		Function: mostraExten

		Abre a janela de dialogo da ferramenta que mostra a extensao geografica atual do mapa
		*/
		mostraExten: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.mostraExten()","mostraexten","mostraExten");
		},
		/*
		Function: outputformat

		Abre a janela de dialogo da ferramenta outputformat
		*/
		outputformat: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.outputformat()","outputformat","outputformat");
		},
		/*
		Function: autoredesenha

		Abre a janela de dialogo da ferramenta opcoes_autoredesenha
		*/
		autoredesenha: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.autoredesenha()","opcoes_autoredesenha","opcoesTempo");
		},
		/*
		Function: salvaMapa

		Abre a janela de dialogo da ferramenta salvamapa
		*/
		salvaMapa: function(){
			if(i3GEO.parametros === "")
			{i3GEO.janela.tempoMsg("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.salvaMapa()","salvamapa","salvaMapa");
		},
		/*
		Function: carregaMapa

		Abre a janela de dialogo da ferramenta carregamapa
		*/
		carregaMapa: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.carregaMapa()","carregamapa","carregaMapa");
		},
		/*
		Function: convertews

		Abre a janela de dialogo da ferramenta convertews
		*/
		convertews: function(){
			if(i3GEO.parametros.mapfile === "")
			{i3GEO.janela.tempoMsg("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.convertews()","convertews","converteMapaWS");
		},
		/*
		Function: convertekml

		Abre a janela de dialogo da ferramenta convertemapakml
		*/
		convertekml: function(){
			if(i3GEO.parametros.mapfile === "")
			{alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.convertekml()","convertemapakml","converteMapaKml");
		},
		/*
		Function: queryMap

		Abre a janela de dialogo da ferramenta opcoes_querymap
		*/
		queryMap: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.queryMap()","opcoes_querymap","opcoesQuery");
		},
		/*
		Function: template

		Abre a janela de dialogo da ferramenta template
		*/
		template: function()
		{i3GEO.janela.cria("300px","400px",i3GEO.configura.locaplic+"/ferramentas/template/index.htm","","","Template <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=8' >&nbsp;&nbsp;&nbsp;</a>");},
		/*
		Function: tamanho

		Abre a janela de dialogo da ferramenta opcoes_tamanho
		*/
		tamanho: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.tamanho()","opcoes_tamanho","opcoesTamanho");
		},
		/*
		Function: tipoimagem

		Abre a janela de dialogo da ferramenta tipoimagem
		*/
		tipoimagem: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.tipoimagem()","tipoimagem","tipoimagem");
		},
		/*
		Function: corFundo

		Abre a janela de dialogo da ferramenta opcoes_fundo
		*/
		corFundo: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.corFundo()","opcoes_fundo","opcoesFundo");
		},
		/*
		Function: opcoesEscala

		Abre a janela de dialogo da ferramenta opcoes_escala
		*/
		opcoesEscala: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.opcoesEscala()","opcoes_escala","opcoesEscala");
		},
		/*
		Function: opcoesLegenda

		Abre a janela de dialogo da ferramenta opcoes_legenda
		*/
		opcoesLegenda: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.opcoesLegenda()","opcoes_legenda","opcoesLegenda");
		},
		/*
		Function: gradeCoord

		Abre a janela de dialogo da ferramenta gradecoord
		*/
		gradeCoord: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.gradeCoord()","gradecoord","gradeCoord");
		},
		/*
		Function: cliqueTexto

		Abre a janela de dialogo da ferramenta inseretxt
		*/
		cliqueTexto: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.cliqueTexto()","inseretxt","inseretxt");
		},
		/*
		Function: selecao

		Abre a janela de dialogo da ferramenta selecao
		*/
		selecao: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.selecao()","selecao","selecao");
		},
		/*
		Function: cliquePonto

		Abre a janela de dialogo da ferramenta inserexy2
		*/
		cliquePonto: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.cliquePonto()","inserexy2","inserexy");
		},
		/*
		Function: cliqueGrafico

		Abre a janela de dialogo da ferramenta inseregrafico
		*/
		cliqueGrafico: function(){
			i3GEO.util.dialogoFerramenta("i3GEO.mapa.dialogo.cliqueGrafico()","inseregrafico","insereGrafico");
		},
		/*
		Function: cliqueIdentificaDefault

		Abre a janela de dialogo da ferramenta identifica
		*/
		cliqueIdentificaDefault: function(e){
			if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.dialogo.cliqueIdentificaDefault()");}
			//@FIXIT nada elegante
			//evita clicar sobre a barra do googlemaps
			if(objposicaocursor.imgx < 70){
				return;
			}

			//evita ativar a ferramenta se o botao nao estiver ativo
			//e estiver no modo de clique permanente
			if(i3GEO.barraDeBotoes.BOTAOCLICADO !== "identifica" && i3GEO.eventos.cliquePerm.ativo === false){
				return;
			}
			i3GEO.eventos.MOUSEPARADO.remove("verificaTip()");
			//na interface googleearth verifica se existe mais eventos no mouseclick
			if(i3GEO.Interface.ATUAL === "googleearth" && i3GEO.eventos.MOUSECLIQUE.length > 1){
				return;
			}
			if(typeof(i3GEOF.identifica) === 'undefined'){
				//javascript que sera carregado
				var js = i3GEO.configura.locaplic+"/ferramentas/identifica/index.js";
				//carrega o script
				i3GEO.util.scriptTag(js,"i3GEOF.identifica.criaJanelaFlutuante()","i3GEOF.identifica_script");
			}
			else{
				i3GEOF.identifica.x = objposicaocursor.ddx;
				i3GEOF.identifica.y = objposicaocursor.ddy;
				i3GEOF.identifica.buscaDadosTema(i3GEO.temaAtivo);
				return;
			}
		},
		/*
		Mostra etiquetas no mapa com informacoes sobre os temas com etiquetas ativas

		Essa e a funcao padrao definida em i3GEO.configura
		*/
		verificaTipDefault: function(){
			//evita clicar sobre a barra do googlemaps
			//@FIXIT nada elegante
			//console.warn(objposicaocursor.imgx)
			if(objposicaocursor.imgx < 70){
				return;
			}
			if(typeof(console) !== 'undefined'){console.info("i3GEO.mapa.dialogo.verificaTipDefault()");}
			if(i3GEO.barraDeBotoes.BOTAOCLICADO !== "identificaBalao" && i3GEO.eventos.cliquePerm.ativo === false){
				return;
			}
			//na interface googleearth verifica se existe mais eventos no mouseclick
			if(i3GEO.Interface.ATUAL === "googleearth" && i3GEO.eventos.MOUSECLIQUE.length > 1){
				return;
			}
			var ntemas,etiquetas,j,retorna;
			ntemas = i3GEO.arvoreDeCamadas.CAMADAS.length;
			etiquetas = false;
			for(j=0;j<ntemas;j += 1)
			{if(i3GEO.arvoreDeCamadas.CAMADAS[j].etiquetas !== "")
			{etiquetas = true;}}
			if(etiquetas === false)
			{return;}
			if(i3GEO.Interface.ATUAL === "googleearth")
			{i3GEO.Interface.googleearth.aguarde.visibility = "visible";}
			retorna = function(retorno){
				var classeCor,pos,temp,n,i,mostra,res,temas,ntemas,titulo,tips,j,ntips,ins,r,ds,nds,s,balloon,
					configura = i3GEO.configura,
					tipotip = configura.tipotip;
				i = $i("i3geo_rosa");
				if(i)
				{i.style.display="none";}
				mostra = false;
				//try{
					retorno = retorno.data;
					if (retorno !== "")
					{
						res = "";
						temas = retorno;
						if(!temas){return;}
						ntemas = temas.length;
						for(j=0;j<ntemas;j += 1){
							titulo = temas[j].nome;
							if (tipotip === "completo" || tipotip === "balao")
							{titulo = "<span class='toolTipBalaoTitulo'><b>"+titulo+"</b></span><br>";}
							else
							{titulo = "";}
							tips = (temas[j].resultado.tips).split(",");
							ntips = tips.length;
							ins = "";
							ds = temas[j].resultado.dados;
							if(ds !== " " && ds[0] && ds[0] != " "){
								try{
									nds = ds.length;
									classeCor = "toolTipBalaoTexto";
									for(s=0;s<nds;s += 1){
										ins += "<div class='"+classeCor+"'>";
										for(r=0;r<ntips;r += 1){
											try{
												eval("var alias = ds[s]."+tips[r]+".alias");
												eval("var valor = ds[s]."+tips[r]+".valor");
												eval("var link = ds[s]."+tips[r]+".link");
												eval("var img = ds[s]."+tips[r]+".img");
												if (tipotip === "completo" || tipotip === "balao"){
													if(valor !== "" && link === "")
													{ins += "<span>" + alias + " :" + valor + "</span><br>";}
													if(valor !== "" && link !== "")
													{ins += "<span>" + alias + " : <a style='color:blue;cursor:pointer' target=_blanck href='"+link+"' >" + valor + "</a></span><br>";}
													if(img !== "")
													{ins += img+"<br>";}
													mostra = true;
												}
												else{
													ins += "<span>" + valor + "</span><br>";
													mostra = true;
												}
											}
											catch(e){}
										}
										if(classeCor === "toolTipBalaoTexto"){
											classeCor = "toolTipBalaoTexto1";
										}
										else{
											classeCor = "toolTipBalaoTexto";
										}
										ins += "</div>";
									}


								}
								catch(e){
									if(typeof(console) !== 'undefined'){console.error(e);}
								}
							}
							if(ins !== "")
							{res += titulo + ins;}
						}
						if(!mostra){
							if($i("tip"))
							{$i("tip").style.display="none";}
						}
						else{
							if(tipotip !== "balao"){
								n = i3GEO.janela.tip();
								$i(n).style.textAlign="left";
								$i(n).innerHTML += res;
							}
							else{
								if(i3GEO.Interface.ATUAL === "googleearth"){
									i3GEO.Interface.googleearth.balao(res,objposicaocursor.ddx,objposicaocursor.ddy);
									i3GEO.Interface.googleearth.aguarde.visibility = "hidden";
								}
								else{
									i3GEO.util.criaPin('marcaIdentifica',configura.locaplic+"/imagens/grabber.gif","12px","12px");
									i3GEO.janela.TIPS.push('marcaIdentifica');
									pos = i3GEO.util.posicionaImagemNoMapa("marcaIdentifica");
									balloon = new Balloon();
									BalloonConfig(balloon,'GBox');
									balloon.delayTime = 0;
									res = "<div style=text-align:left;overflow:auto;height:"+configura.alturatip+";width:"+configura.larguratip+"; >"+res+"</div>";
									temp = $i('marcaIdentifica');
									if(temp){
										balloon.showTooltip(temp,res,null,null,null,pos[1],pos[0]);
										balloon.addCloseButton();
										temp.onclick = function(e){
											if (!e){e = window.event;}
											document.body.removeChild(balloon.getEventTarget(e));
											balloon.hideTooltip();
										};

									}
								}
							}
						}
					}
					if($i(i3GEO.Interface.IDMAPA)){
						$i(i3GEO.Interface.IDMAPA).title = "";
						temp = "identifica";
						if(i3GEO.Interface.ATIVAMENUCONTEXTO)
						{temp = "identifica_contexto";}
						i3GEO.util.mudaCursor(configura.cursores,temp,i3GEO.Interface.IDMAPA,configura.locaplic);
					}
			};
			xy = i3GEO.navega.centroDoMapa();
			i3GEO.php.identifica3(retorna,objposicaocursor.ddx,objposicaocursor.ddy,"5","tip",i3GEO.configura.locaplic,i3GEO.configura.sid,"ligados",i3GEO.parametros.mapexten);
		}
	}
};
//YAHOO.log("carregou classe mapa", "Classes i3geo");
