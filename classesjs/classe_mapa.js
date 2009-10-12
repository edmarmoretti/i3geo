/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: false */
/*
Title: Mapa

Arquivo:

i3geo/classesjs/classe_mapa.js

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
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
}
/*
Classe: i3GEO.mapa

Cria e processa o mapa principal

Em i3GEO.mapa.dialogo estão as funções de abertura dos diálogos para alteração das propriedades do mapa,
como cor de fundo, tipo de imagem, legenda etc.
*/
i3GEO.mapa = {
	/*
	Variavel: GEOXML
	Armazena o nome dos objetos geoXml adicionados ao mapa pela API do google maps
	
	Tipo:
	{Array}
	*/
	GEOXML: [],
	/*
	Function: ajustaPosicao
	
	Ajusta o posicionamento do corpo do mapa
	
	Esse ajuste é necessário na inicialização, uma vez que o mapa utiliza style.position='absolute'
	
	Parameters:
	
	elemento {String} - id do elemento HTML que deverá ser ajustado e que contém o mapa
	*/
	ajustaPosicao: function(elemento){
		if(arguments.length === 0){return;}
		var imagemxi,imagemyi,imagemxref,imagemyref,dc,c;
		try{
			imagemxi = 0;
			imagemyi = 0;
			imagemxref = 0;
			imagemyref = 0;
			dc = $i(elemento);
			while ((dc.offsetParent) && (dc.offsetParent.id !== "i3geo")){
				dc = dc.offsetParent;
				imagemxi = imagemxi + dc.offsetLeft;
				imagemyi = imagemyi + dc.offsetTop;
			}	
			c = $i(i3GEO.Interface.IDCORPO);
			if (c){
				c.style.position="absolute";
				$left(i3GEO.Interface.IDCORPO,imagemxi);
				$top(i3GEO.Interface.IDCORPO,imagemyi);
			}
		}
		catch(e){alert("Ocorreu um erro. i3GEO.mapa.ajustaPosicao"+e);}
	},
	/*
	Function: ativaLogo

	Ativa ou desativa a logo marca.
	*/
	ativaLogo: function(){
		i3GEO.contadorAtualiza++;
		i3GEO.php.ativalogo(i3GEO.atualiza);
	},
	/*
	Function: verifica
	
	Verifica se ocorreu algum problema na atualização do corpo do mapa e inicia o processo de tentativa de recuperação
	
	Parametro:
	
	retorno {string} - objeto recebido da função PHP de atualização do mapa
	*/
	verifica:function(retorno){
		try{
			i3GEO.janela.abreAguarde("ajaxCorpoMapa",$trad("o3"));
			if(retorno.data)
			{retorno = retorno.data;}
			if (retorno.variaveis)
			{retorno = retorno.variaveis;}
			if ((retorno === "erro") || (retorno === undefined)){
				i3GEO.mapa.ajustaPosicao();
				i3GEO.janela.fechaAguarde();
				i3GEO.mapa.recupera.inicia();
			}
			i3GEO.mapa.recupera.TENTATIVA = 0;
		}
		catch(e){
			if(i3GEO.Interface.ATUAL === "openlayers"){
				i3GEO.janela.fechaAguarde();
				return;
			}
			if(i3GEO.mapa.recupera.TENTATIVA === 0){
				alert("Erro no mapa. Sera feita uma tentativa de recuperacao.");
				i3GEO.mapa.recupera.inicia();
			}
			else{
				alert("Recuperacao impossivel. Sera feita uma tentativa de reiniciar o mapa.");
				if (i3GEO.mapa.recupera.TENTATIVA === 1){
					i3GEO.mapa.recupera.TENTATIVA = 2;
					i3GEO.contadorAtualiza++;
					i3GEO.php.reiniciaMapa(i3GEO.atualiza);
				}		
			}
		}
	},
	/*
	Function: insereToponimo
	
	Insere um texto no mapa na posição clicada

	O ponto é obtido do objeto objposicaocursor e os demais parâmetros da janela interna aberta no iframe "wdocai"
	*/
	insereToponimo: function(){
		if (g_tipoacao === "textofid"){
			//
			//pega os parâmetros da janela flutuante aberta
			//
			var tema,item,pos,digi,doc,texto,f,t,a,cf,cs,xs,ys,c,m,fcs,fxs,fys,forca,md,mf,ox,oy,pl;
			doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			f = doc.getElementById("fonte").value;
			t = doc.getElementById("tamanho").value;
			a = doc.getElementById("angulo").value;
			cf = doc.getElementById("fundoc").value;
			if (cf === "")
			{cf = "off";}
			cs = doc.getElementById("sombra").value;
			if (cs === "")
			{cs = "off";}
			xs = doc.getElementById("sombrax").value;
			ys = doc.getElementById("sombray").value;
			c = doc.getElementById("frente").value;
			m = doc.getElementById("mascara").value;
			if (m === "")
			{m = "off";}
			fcs = doc.getElementById("frentes").value;
			if (fcs === "")
			{fcs = "off";}
			fxs = doc.getElementById("frentex").value;
			fys = doc.getElementById("frentey").value;
			forca = doc.getElementById("force").value;
			md = doc.getElementById("mindistance").value;
			mf = doc.getElementById("minfeaturesize").value;
			ox = doc.getElementById("offsetx").value;
			oy = doc.getElementById("offsety").value;
			pl = doc.getElementById("partials").value;
			pos = doc.getElementById("position").value;
			//o texto será digitado
			digi = function(retorno){
				//se texto for igual a vazio é pq o valor foi pego de um atributo
				texto = doc.getElementById("texto").value;
				if(texto === ""){
					i3GEO.janela.fechaAguarde("i3GEO.atualiza");
					texto = retorno.data;
				}
				if (texto !== " "){
					i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
					i3GEO.contadorAtualiza++;
					i3GEO.php.insereAnnotation(i3GEO.atualiza,g_nomepin+"topo",objposicaocursor.ddx+" "+objposicaocursor.ddy,texto,pos,pl,ox,oy,mf,md,forca,fcs,fxs,fys,m,c,ys,xs,cs,cf,a,t,f);
				}
			};
			if (doc.getElementById("tipoInsere").value === "digitando")
			{digi.call();}
			else{
				//o texto será capturado de um atributo do elemento
				texto = "";
				if ((doc.getElementById("temasLigados")) && (doc.getElementById("itemsel"))){
					tema = doc.getElementById("temasLigados").value;
					item = doc.getElementById("itemsel").value;
					i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
					i3GEO.php.identificaunico(digi,objposicaocursor.ddx+","+objposicaocursor.ddy,tema,item);
				}			
			}
		}
		else{i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.mapa.insereToponimo()");}
	},
	/*
	Function: inserePonto
	
	Insere um ponto no mapa na posição clicada

	O ponto é obtidos do objeto objposicaocursor e os demais parâmetros da janela interna aberta no iframe "wdocai"
	*/
	inserePonto: function(){
		if (g_tipoacao === "inserexy"){
			var doc,ins,item,valoritem;
			doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			if(doc.getElementById("resultado")){
				ins = doc.getElementById("resultado").innerHTML;
				ins = ins + "<div style='font-size:12px' >" + objposicaocursor.ddx +" " + objposicaocursor.ddy + "</div><br>";
				doc.getElementById("resultado").innerHTML = ins;
			}
			item = "";
			valoritem = "";
			if((doc.getElementById("valorItem")) && (doc.getElementById("itemtema"))){
				item = doc.getElementById("itemtema").value;
				valoritem = doc.getElementById("valorItem").value;
			}
			if (g_nomepin === "")
			{alert("Nenhum tema definido para editar");}
			else{
				i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
				i3GEO.contadorAtualiza++;
				i3GEO.php.insereSHP(i3GEO.atualiza,g_nomepin,item,valoritem,objposicaocursor.ddx+" "+objposicaocursor.ddy);
			}
		}
	},
	/*
	Classe: i3GEO.mapa.recupera
	
	Tenta recuperar o mapa caso ocorra algum problema
	
	O i3Geo mantém sempre uma cópia do arquivo mapfile em uso. Essa função tenta
	usar essa cópia para restaurar o funcionamento do mapa
	*/
	recupera:{
		/*
		Variavel: TENTATIVA
		
		Armazena a quantidade de tentativas de recuperação que foram feitas
		
		Tipo:
		{Integer}
		*/
		TENTATIVA: 0,
		/*
		Function: inicia
		
		Inicia a tentativa de recuperação
		*/
		inicia: function(){
			i3GEO.mapa.ajustaPosicao();
			i3GEO.janela.fechaAguarde();
			if(i3GEO.mapa.recupera.TENTATIVA === 0){
				i3GEO.mapa.recupera.TENTATIVA++;
				i3GEO.mapa.recupera.restaura();
			}
		},
		/*
		Function: restaura
		
		Restaura o mapa para a cópia de segurança existente no servidor
		*/
		restaura: function(){
			i3GEO.php.recuperamapa(i3GEO.atualiza);
		}
	},
	/*
	Classe: i3GEO.mapa.legendaHTML
	
	Controla a obtenção da legenda do mapa formatada em HTML.
	
	Útil para mostrar a legenda na tela
	*/
	legendaHTML:{
		/*
		Propriedade: incluiBotaoLibera
		
		Define se na legenda será incluido o botão para liberar a legenda e incluí-la em uma janela flutuante
		
		Tipo:
		{boolean}
		
		Default:
		{true}
		*/
		incluiBotaoLibera: true,
		/*
		Variavel:  ID
		
		Armazena o id definido na criação da legenda
		*/
		ID: "",
		/*
		Function: cria
		
		Cria a legenda HTML
		
		A legenda é incluida no id definido. Se id for igual a "", será apenas definido o evento de atualização
		permitindo que seja criada a janela flutuante apenas, por exemplo:
		
		i3GEO.mapa.legendaHTML.cria("");
		i3GEO.mapa.legendaHTML.libera();		
		
		Parametros:
		
		id {String} - id do elemento que receberá a legenda
		*/
		cria: function(id){
			if(arguments.length === 0)
			{id = "";}
			i3GEO.mapa.legendaHTML.ID = id;
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.mapa.legendaHTML.atualiza()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.mapa.legendaHTML.atualiza()");}					
			i3GEO.mapa.legendaHTML.atualiza();			
		},
		/*
		Function: atualiza
		
		Atualiza a legenda do mapa que são utilizados para mostrar a legenda
		*/
		atualiza: function(){
			var temp = function(retorno){
				var s,ins,elementos,i;
				if(i3GEO.mapa.legendaHTML.ID !== "" && $i(i3GEO.mapa.legendaHTML.ID)){
					if ((retorno.data !== "erro") && (retorno.data !== undefined)){
						s = i3GEO.configura.locaplic+"/imagens/solta.gif";
						ins = "";
						if(i3GEO.mapa.legendaHTML.incluiBotaoLibera === true)
						{ins += "<img onclick='i3GEO.mapa.legendaHTML.libera()' id=soltaLeg src="+s+" title='clique para liberar'/><br>";}
						ins += "<div id='corpoLegi' >"+ retorno.data.legenda + "</div>";
						$i(i3GEO.mapa.legendaHTML.ID).innerHTML = ins;
					}
				}
				if ($i("wlegenda")){
					$i("wlegenda").innerHTML = retorno.data.legenda;
					elementos = $i("wlegenda").getElementsByTagName("input");
					for(i=0;i<elementos.length;i++)
					{elementos[i].style.display="none";}
				}
			};
			i3GEO.mapa.legendaHTML.obtem(temp);
		},
		/*
		Function: obtem
		
		Faz a chamada em AJAX que gera a legenda
		
		O resultado é processado pela função passada como parâmetro
		
		Parametro:
		
		funcao {function} - função que receberá o resultado da chamada AJAX. O objeto CPAINT é enviado como parâmetro.
		*/
		obtem: function(funcao){
			i3GEO.php.criaLegendaHTML(funcao,"",i3GEO.configura.templateLegenda);
		},
		/*
		Function: ativaDesativaTema
		
		Liga ou desliga um único tema. Utilizado pela legenda HTML, permitindo que um tema seja processado diretamente na legenda.
		
		Parametro:
		
		inputbox {object) - objeto do tipo input checkbox com a propriedade value indicando o código do tema que será processado
		*/
		ativaDesativaTema: function(inputbox){
			var temp = function(){
				i3GEO.contadorAtualiza++;
				i3GEO.php.corpo(i3GEO.atualiza,i3GEO.configura.tipoimagem);
				i3GEO.arvoreDeCamadas.atualiza("");
				i3GEO.janela.fechaAguarde("redesenha");
			};
			i3GEO.janela.abreAguarde("redesenha",$trad("o1"));
			if(!inputbox.checked)
			{i3GEO.php.ligatemas(temp,inputbox.value,"");}
			else
			{i3GEO.php.ligatemas(temp,"",inputbox.value);}		
		},
		/*
		Function: libera
		
		Libera a legenda criando uma janela flutuante sobre o mapa
		*/
		libera: function(){
			var temp = function(retorno){
				var novoel,temp,n,i;
				if (!$i("moveLegi")){
					novoel = document.createElement("div");
					novoel.id = "moveLegi";
					novoel.style.display="block";
					temp = '<div class="hd">Legenda</div>';
					temp += '<div id="wlegenda" style="text-align:left;background-color:white" ></div>';
					novoel.innerHTML = temp;
					document.body.appendChild(novoel);
					YAHOO.namespace("moveLegi.xp");
					YAHOO.moveLegi.xp.panel = new YAHOO.widget.Panel("moveLegi", {width:"300px", fixedcenter: true, constraintoviewport: false, underlay:"none", close:true, visible:true, draggable:true, modal:false,iframe:false } );
					YAHOO.moveLegi.xp.panel.render();
				}
				$i("wlegenda").innerHTML = retorno.data.legenda;
				temp = $i("wlegenda").getElementsByTagName("input");
				n = temp.length;
				for(i=0;i<n;i++){
					temp[i].style.display = "none";
				}
				YAHOO.moveLegi.xp.panel.show();				
			};
			i3GEO.mapa.legendaHTML.obtem(temp);
		}
	},
	/*
	Classe: i3GEO.mapa.legendaIMAGEM
	
	Controla a obtenção da legenda do mapa na forma de uma imagem
	
	É utilizado principalmente para armazenar as imagens para a função de 
	obtenção do histórico do mapa
	*/
	legendaIMAGEM:{
		/*
		Function: obtem
		
		Faz a chamada em AJAX que gera a legenda
		
		O resultado é processado pela função passada como parâmetro
		
		Parametro:
		
		funcao {function} - função que receberá o resultado da chamada AJAX. O objeto CPAINT é enviado como parâmetro.
		*/
		obtem: function(funcao){
			i3GEO.php.criaLegendaImagem(funcao);
		}
	},
	/*
	Classe: i3GEO.mapa.dialogo
	
	Abre as telas de diálogo das opções de manipulação do mapa atual
	*/
	dialogo:{
		/*
		Function: autoredesenha

		Abre a janela para definição do intervalo de tempo para redesenho automático do mapa.
		*/
		autoredesenha: function()
		{i3GEO.janela.cria("300px","110px",i3GEO.configura.locaplic+"/ferramentas/opcoes_autoredesenha/index.htm","","","Temporizador <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=9' >&nbsp;&nbsp;&nbsp;</a>");},
		/*
		Function: salvaMapa

		Abre a janela para salvar localmente o mapfile utilizado no mapa atual
		*/
		salvaMapa: function(){
			if(i3GEO.parametros === "")
			{alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			if(typeof(i3GEOF.salvaMapa) === 'undefined'){
				var js = i3GEO.configura.locaplic+"/ferramentas/salvamapa/index.js.php";
				i3GEO.util.scriptTag(js,"i3GEOF.salvaMapa.criaJanelaFlutuante()","i3GEOF.salvaMapa_script");
			}
		},
		/*
		Function: carregaMapa

		Abre a janela para a carga de um mapfile salvo localmente na máquina dousuário.
		*/
		carregaMapa: function(){
			if(typeof(i3GEOF.carregaMapa) === 'undefined'){
				var js = i3GEO.configura.locaplic+"/ferramentas/carregamapa/index.js.php";
				i3GEO.util.scriptTag(js,"i3GEOF.carregaMapa.criaJanelaFlutuante()","i3GEOF.carregaMapa_script");
			}
		},
		/*
		Function: convertews

		Abre a janela para converter o mapa atual em web service WMS
		*/
		convertews: function(){
			if(i3GEO.parametros.mapfile === "")
			{alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			i3GEO.janela.cria("440px","280px",i3GEO.configura.locaplic+"/ferramentas/convertews/index.htm","","","WMS <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=2&idajuda=12' >&nbsp;&nbsp;&nbsp;</a>");
		},
		/*
		Function: convertekml

		Abre a janela para converter o mapa atual em KML
		*/
		convertekml: function(){
			if(i3GEO.parametros.mapfile === "")
			{alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			i3GEO.janela.cria("440px","280px",i3GEO.configura.locaplic+"/ferramentas/convertemapakml/index.htm","","","Kml <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=2&idajuda=13' >&nbsp;&nbsp;&nbsp;</a>");
		},
		/*
		Function: queryMap

		Abre a janela que altera as propriedades da exibição dos elementos selecionados.
		*/
		queryMap: function()
		{i3GEO.janela.cria("210px","80px",i3GEO.configura.locaplic+"/ferramentas/opcoes_querymap/index.htm","","","Cor da seleção <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=5' >&nbsp;&nbsp;&nbsp;</a>");},
		/*
		Function: template

		Abre a janela que muda o template do mapa atual.
		*/
		template: function()
		{i3GEO.janela.cria("300px","400px",i3GEO.configura.locaplic+"/ferramentas/template/index.htm","","","Template <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=8' >&nbsp;&nbsp;&nbsp;</a>");},
		/*
		Function: tamanho

		Abre a janela que muda o tamanho do mapa
		*/
		tamanho: function()
		{i3GEO.janela.cria("150px","170px",i3GEO.configura.locaplic+"/ferramentas/opcoes_tamanho/index.htm","","","Tamanho <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=4' >&nbsp;&nbsp;&nbsp;</a>");},
		/*
		Function: tipoimagem

		Abre a janela que define um filtro gráfico (sépia por exemplo) sobre a imagem gerada alterando suas características
		*/
		tipoimagem: function()
		{i3GEO.janela.cria("300px","260px",i3GEO.configura.locaplic+"/ferramentas/tipoimagem/index.htm","","","Tipo de imagem <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=1' >&nbsp;&nbsp;&nbsp;</a>");},
		/*
		Function: corFundo

		Abre a janela que altera a cor do fundo do mapa atual.
		*/
		corFundo: function(){
			if(typeof(i3GEOF.gradeCoord) === 'undefined'){
				var js = i3GEO.configura.locaplic+"/ferramentas/opcoes_fundo/index.js.php";
				i3GEO.util.scriptTag(js,"i3GEOF.opcoesFundo.criaJanelaFlutuante()","i3GEOF.opcoesFundo_script");
			}
		},
		/*
		Function: opcoesEscala

		Abre a janela para definição das opções da barra de escala.
		*/
		opcoesEscala: function()
		{i3GEO.janela.cria("250px","300px",i3GEO.configura.locaplic+"/ferramentas/opcoes_escala/index.htm","center","center","Escala <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=3' >&nbsp;&nbsp;&nbsp;</a>");},
		/*
		Function: opcoesLegenda

		Abre a janela de configuração da legenda do mapa
		*/
		opcoesLegenda: function(){
			if(typeof(i3GEOF.opcoesLegenda) === 'undefined'){
				var js = i3GEO.configura.locaplic+"/ferramentas/opcoes_legenda/index.js.php";
				i3GEO.util.scriptTag(js,"i3GEOF.opcoesLegenda.criaJanelaFlutuante()","i3GEOF.opcoesLegenda_script");
			}
		},
		/*
		Function: gradeCoord

		Abre a janela que gera grade de coordenadas
		*/
		gradeCoord: function(){
			if(typeof(i3GEOF.gradeCoord) === 'undefined'){
				var js = i3GEO.configura.locaplic+"/ferramentas/gradecoord/index.js.php";
				i3GEO.util.scriptTag(js,"i3GEOF.gradeCoord.criaJanelaFlutuante()","i3GEOF.gradeCoord_script");
			}
		},
		/*
		Function: cliqueTexto
		
		Abre o diálogo para inclusão de textos diretamente no mapa
		
		Registra os eventos que controlam o clique sobre o mapa
		*/
		cliqueTexto: function(){
			if (g_tipoacao !== "textofid"){
				var temp,janela;
				temp = Math.random() + "b";
				temp = temp.split(".");
				g_nomepin = "pin"+temp[1];
				g_tipoacao = "textofid";
				janela = i3GEO.janela.cria("360px","250px",i3GEO.configura.locaplic+"/ferramentas/inseretxt/index.htm","","","Texto");
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.mapa.insereToponimo()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.mapa.insereToponimo()");}
				temp = function(){
					i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.mapa.insereToponimo()");
					i3GEO.barraDeBotoes.ativaBotoes();
				};
				YAHOO.util.Event.addListener(janela[0].close, "click", temp);
			}
		},
		/*
		Function: cliquePonto
		
		Abre o diálogo para inclusão de pontos diretamente no mapa
		
		Registra os eventos que controlam o clique sobre o mapa
		*/
		cliquePonto: function(){
			if (g_tipoacao !== "inserexy"){
				g_tipoacao = "inserexy";
				var temp,janela;
				temp = Math.random() + "a";
				temp = temp.split(".");
				g_nomepin = "pin"+temp[1];
				janela = i3GEO.janela.cria("500px","300px",i3GEO.configura.locaplic+'/ferramentas/inserexy2/index.htm',"","","Insere");
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.mapa.inserePonto()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.mapa.inserePonto()");}
				temp = function(){
					i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.mapa.inserePonto()");
					i3GEO.barraDeBotoes.ativaBotoes();
				};
				YAHOO.util.Event.addListener(janela[0].close, "click", temp);
			}
		},
		/*
		Function: cliqueGrafico
		
		Abre o diálogo para inclusão de gráficos diretamente no mapa
		
		Registra os eventos que controlam o clique sobre o mapa
		*/
		cliqueGrafico: function(){
			if(typeof(i3GEOF.insereGrafico) === 'undefined'){
				var js = i3GEO.configura.locaplic+"/ferramentas/inseregrafico/index.js.php";
				i3GEO.util.scriptTag(js,"i3GEOF.insereGrafico.criaJanelaFlutuante()","i3GEOF.insereGrafico_script");
			}
		},
		/*
		Function: cliqueIdentificaDefault
		
		Abre o diálogo para obtenção de informações quando o usuário clica no mapa.
		
		Essa é a função padrão definida em i3GEO.configura		
		*/
		cliqueIdentificaDefault: function(){
			if (g_tipoacao === "identifica"){
				i3GEO.eventos.MOUSEPARADO.remove("verificaTip()");
				if(typeof(i3GEOF.identifica) === 'undefined'){
					//javascript que será carregado
					var js = i3GEO.configura.locaplic+"/ferramentas/identifica/index.js.php";
					//carrega o script
					i3GEO.util.scriptTag(js,"i3GEOF.identifica.criaJanelaFlutuante()","i3GEOF.identifica_script");
				}
				else{
					i3GEOF.identifica.x = objposicaocursor.ddx;
					i3GEOF.identifica.y = objposicaocursor.ddy;
					i3GEOF.identifica.buscaDadosTema(i3GEO.temaAtivo);
					return;
				}
			}
		},
		/*
		Function: verificaTipDefault
		
		Mostra etiquetas no mapa com informações sobre os temas com etiquetas ativas
		
		Essa é a função padrão definida em i3GEO.configura		
		*/
		verificaTipDefault: function(){
			var ntemas,etiquetas,j,retorna;
			ntemas = i3GEO.arvoreDeCamadas.CAMADAS.length;
			etiquetas = false;
			for(j=0;j<ntemas;j++)
			{if(i3GEO.arvoreDeCamadas.CAMADAS[j].etiquetas !== "")
			{etiquetas = true;}}
			if(etiquetas === false)
			{return;}
			if(i3GEO.Interface.ATUAL==="padrao")
			{$i("img").style.cursor = "wait";}
			retorna = function(retorno){
				var temp,rfes,n,balloon,i,mostra,res,temas,ntemas,titulo,tips,j,ntips,ins,r,ds,nds,s;
				i = $i("i3geo_rosa");
				if(i)
				{i.style.display="none";}			
				mostra = false;
				try{
					retorno = retorno.data;
					if (retorno !== "")
					{
						res = "";
						temas = retorno;
						ntemas = temas.length;
						for(j=0;j<ntemas;j++){
							titulo = temas[j].nome;
							if (i3GEO.configura.tipotip === "completo" || i3GEO.configura.tipotip === "balao")
							{titulo = "<span style='text-decoration:underline;text-align:left;font-size:9pt'><b>"+titulo+"</b></span><br>";}
							else
							{titulo = "";}
							tips = (temas[j].resultado.tips).split(",");
							ntips = tips.length;
							ins = "";
							for(r=0;r<ntips;r++){
								ds = temas[j].resultado.dados;
								if(ds !== " "){
									nds = ds.length;	
									for(s=0;s<nds;s++){
										eval("var alias = ds[s]."+tips[r]+".alias");
										eval("var valor = ds[s]."+tips[r]+".valor");
										eval("var link = ds[s]."+tips[r]+".link");
										eval("var img = ds[s]."+tips[r]+".img");
										if (i3GEO.configura.tipotip === "completo" || i3GEO.configura.tipotip === "balao"){
											if(valor !== "" && link === "") 
											{ins += "<span class='tiptexto' style='text-align:left;font-size:8pt'>" + alias + " :" + valor + "</span><br>";}
											if(valor !== "" && link !== "") 
											{ins += "<span class='tiptexto' style='text-align:left;font-size:8pt'>" + alias + " : <a style='color:blue;cursor:pointer' target=_blanck href='"+link+"' >" + valor + "</a></span><br>";}

											if(img !== "")
											{ins += img+"<br>";}
											
											mostra = true;
										}
										else{
											ins += "<span class='tiptexto' style='text-align:left;font-size:8pt'>" + valor + "</span><br>";
											mostra = true;
										}
									}
								}
							}
							if(ins !== "")
							{res = res + titulo + ins;}
						}
						if(!mostra){
							if($i("tip"))
							{$i("tip").style.display="none";}
							return;
						}
						else{		
							if(i3GEO.configura.tipotip !== "balao"){
								n = i3GEO.janela.tip();
								$i(n).style.textAlign="left";
								$i(n).innerHTML += res;
							}
							else{
								i3GEO.util.criaPin('marcaIdentifica',i3GEO.configura.locaplic+"/imagens/grabber.gif","12px","12px");
								i3GEO.util.posicionaImagemNoMapa("marcaIdentifica");
								balloon = new Balloon();
								balloon.delayTime = 0;
								res = "<div style=text-align:left >"+res+"</div>";
								balloon.showTooltip($i("marcaIdentifica"),res);
								$i('marcaIdentifica').onclick = $i("closeButton").onclick;
							}
						}
					}
					if(i3GEO.Interface.ATUAL==="padrao"){
						temp = "zoom";
						if(i3GEO.Interface.ATIVAMENUCONTEXTO)
						{temp = "identifica_contexto";}
						i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,"img",i3GEO.configura.locaplic);
					}
				}
				catch(e){
					if(i3GEO.Interface.ATUAL==="padrao"){
						temp = "identifica";
						if(i3GEO.Interface.ATIVAMENUCONTEXTO)
						{temp = "identifica_contexto";}
						i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,"img",i3GEO.configura.locaplic);
					}
				}
			};
			i3GEO.php.identifica2(retorna,objposicaocursor.ddx,objposicaocursor.ddy,"5");
		}
	}
};
//YAHOO.log("carregou classe mapa", "Classes i3geo");