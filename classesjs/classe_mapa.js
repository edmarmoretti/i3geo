/*
Title: Mapa

File: i3geo/classesjs/classe_mapa.js

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
if(typeof(i3GEO) == 'undefined'){
	i3GEO = new Array();
}
/*
Class: i3GEO.mapa

Cria e processa o mapa principal

Em i3GEO.mapa.dialogo estão as funções de abertura dos diálogos para alteração das propriedades do mapa,
como cor de fundo, tipo de imagem, legenda etc.
*/
i3GEO.mapa = {
	/*
	Variable: GEOXML
	
	Armazena o nome dos objetos geoXml adicionados ao mapa pela API do google maps
	
	Type:
	{Array}
	*/
	GEOXML: new Array(),
	/*
	Function: ajustaPosicao
	
	Ajusta o posicionamento do corpo do mapa
	
	Esse ajuste é necessário na inicialização, uma vez que o mapa utiliza style.position='absolute'
	
	Parameters:
	
	elemento {String} - id do elemento HTML que deverá ser ajustado e que contém o mapa
	*/
	ajustaPosicao: function(elemento){
		if(arguments.length == 0){return;}
		try{
			imagemxi = 0;
			imagemyi = 0;
			imagemxref = 0;
			imagemyref = 0;
			var dc = $i("i3geo");
			if(!dc){return;}
			if (dc.style.left){imagemxi += parseInt(dc.style.left);}
			if (dc.style.top){imagemyi += parseInt(dc.style.top);}	
			var dc = $i(elemento);
			while ((dc.offsetParent) && (dc.offsetParent.id != "i3geo")){
				dc = dc.offsetParent;
				imagemxi = imagemxi + dc.offsetLeft;
				imagemyi = imagemyi + dc.offsetTop;
			}	
			var c = $i(i3GEO.interface.IDCORPO);
			if (c){
				c.style.position="absolute";
				$left(i3GEO.interface.IDCORPO,imagemxi);
				$top(i3GEO.interface.IDCORPO,imagemyi);
				if ($i("i3geo").style.left){$left(i3GEO.interface.IDCORPO,imagemxi - parseInt($i("i3geo").style.left));}
				if ($i("i3geo").style.top){$top(i3GEO.interface.IDCORPO,imagemyi - parseInt($i("i3geo").style.top));}
			}
		}
		catch(e){alert("Ocorreu um erro. i3GEO.mapa.ajustaPosicao"+e);}
	},
	/*
	Function: ativaLogo

	Ativa ou desativa a logo marca.
	*/
	ativaLogo: function(){
		i3GEO.php.ativalogo(i3GEO.atualiza);
	},
	/*
	Function: insereToponimo
	
	Insere um texto no mapa na posição clicada

	O ponto é obtido do objeto objposicaocursor e os demais parâmetros da janela interna aberta no iframe "wdocai"
	*/
	insereToponimo: function(){
		if (g_tipoacao == "textofid"){
			//
			//pega os parâmetros da janela flutuante aberta
			//
			var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			texto = doc.getElementById("texto").value;
			var f = doc.getElementById("fonte").value;
			var t = doc.getElementById("tamanho").value;
			var a = doc.getElementById("angulo").value;
			var cf = doc.getElementById("fundoc").value;
			if (cf == ""){cf = "off";}
			var cs = doc.getElementById("sombra").value;
			if (cs == ""){cs = "off";}
			var xs = doc.getElementById("sombrax").value;
			var ys = doc.getElementById("sombray").value;
			var c = doc.getElementById("frente").value;
			var m = doc.getElementById("mascara").value;
			if (m == ""){m = "off";}
			var fcs = doc.getElementById("frentes").value;
			if (fcs == ""){fcs = "off";}
			var fxs = doc.getElementById("frentex").value;
			var fys = doc.getElementById("frentey").value;
			var forca = doc.getElementById("force").value;
			var md = doc.getElementById("mindistance").value;
			var mf = doc.getElementById("minfeaturesize").value;
			var ox = doc.getElementById("offsetx").value;
			var oy = doc.getElementById("offsety").value;
			var pl = doc.getElementById("partials").value;
			var pos = doc.getElementById("position").value;
			//o texto será digitado
			var digi = function(retorno){
				//se texto for igual a vazio é pq o valor foi pego de um atributo
				if(texto == ""){
					i3GEO.janela.fechaAguarde("i3GEO.atualiza");
					texto = retorno.data;
				}
				if (texto != " "){
					i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
					i3GEO.php.insereAnnotation(i3GEO.atualiza,g_nomepin+"topo",objposicaocursor.ddx+" "+objposicaocursor.ddy,texto,pos,pl,ox,oy,mf,md,forca,fcs,fxs,fys,m,c,ys,xs,cs,cf,a,t,f);
				}
			};
			if (doc.getElementById("tipoInsere").value == "digitando")
			{digi.call();}
			else{
				//o texto será capturado de um atributo do elemento
				texto = "";
				if ((doc.getElementById("temasLigados")) && (doc.getElementById("itemsel"))){
					var tema = doc.getElementById("temasLigados").value;
					var item = doc.getElementById("itemsel").value;
					i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
					i3GEO.php.identificaunico(digi,objposicaocursor.ddx+","+objposicaocursor.ddy,tema,item);
				}			
			}
		}
		else{i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.mapa.insereToponimo()");}
	},
	/*
	Function: insereKml
	
	Insere no mapa uma camada KML com base na API do Google Maps
	
	As camadas adicionadas são crescentadas na árvore de camadas
	
	A lista de nomes dos objetos geoXml criados é mantida em i3GEO.mapas.GEOXML
	
	Parameters:
	
	pan {Boolean} - define se o mapa será deslocado para encaixar o KML
	
	url {String} - URL do arquivo KML. Se não for definido, a URL será obtida do INPUT com id = i3geo_urlkml (veja i3GEO.gadgets)
	
	*/
	insereKml: function(pan,url){
		if(arguments.length == 1){
			var i = $i("i3geo_urlkml");
			if(i){var url = i.value;}
			else{var url = "";}
		}
		if(url == ""){return;}
		//"http://api.flickr.com/services/feeds/geo/?g=322338@N20&lang=en-us&format=feed-georss"
		var ngeoxml = "geoXml_"+i3GEO.mapa.GEOXML.length;
		i3GEO.mapa.GEOXML.push(ngeoxml);
		var zoom = function(){
			if(pan){
				eval("var ll = "+ngeoxml+".getDefaultCenter()");
				eval(ngeoxml+".gotoDefaultViewport(i3GeoMap)");
				//i3GeoMap.setCenter(ll);
			}
		};
		eval(ngeoxml+" = new GGeoXml(url,zoom)");
		eval("i3GeoMap.addOverlay("+ngeoxml+")");
		i3GEO.mapa.criaNoArvoreGoogle(ngeoxml,ngeoxml);
	},
	criaNoArvoreGoogle: function(url,nomeOverlay){
		var root = i3GEO.arvoreDeCamadas.ARVORE.getRoot();
		var node = i3GEO.arvoreDeCamadas.ARVORE.getNodeByProperty("idkml","raiz");
		if(!node){
			var titulo = "<table><tr><td><b>Google Maps</b></td></tr></table>";
			var d = {html:titulo,idkml:"raiz"};
			var node = new YAHOO.widget.HTMLNode(d, root, true,true);
		}
		html = "<input onclick='i3GEO.mapa.ativaDesativaOverlayGoogle(this)' class=inputsb style='cursor:pointer;' type='checkbox' value='"+nomeOverlay+"' checked />";
		html += "&nbsp;<span style='cursor:move'>"+url+"</span>";
		var d = {html:html};
		var nodekml = new YAHOO.widget.HTMLNode(d, node, true,true);    			
		nodekml.isleaf = true;
		i3GEO.arvoreDeCamadas.ARVORE.draw();
		i3GEO.arvoreDeCamadas.ARVORE.collapseAll();
		node.expand();
	},
	ativaDesativaOverlayGoogle: function(obj){	
		if(!obj.checked){
			eval("i3GeoMap.removeOverlay("+obj.value+")");
		}
		else
		eval("i3GeoMap.addOverlay("+obj.value+")");
	},
	/*
	Function: inserePonto
	
	Insere um ponto no mapa na posição clicada

	O ponto é obtidos do objeto objposicaocursor e os demais parâmetros da janela interna aberta no iframe "wdocai"
	*/
	inserePonto: function(){
		if (g_tipoacao == "inserexy"){
			var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			if(doc.getElementById("resultado")){
				var ins = doc.getElementById("resultado").innerHTML;
				ins = ins + "<div style='font-size:12px' >" + objposicaocursor.ddx +" " + objposicaocursor.ddy + "</div><br>";
				doc.getElementById("resultado").innerHTML = ins;
			}
			var item = "";
			var valoritem = "";
			if((doc.getElementById("valorItem")) && (doc.getElementById("itemtema"))){
				var item = doc.getElementById("itemtema").value;
				var valoritem = doc.getElementById("valorItem").value;
			}
			if (g_nomepin == ""){alert("Nenhum tema definido para editar");}
			else{
				i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
				i3GEO.php.insereSHP(i3GEO.atualiza,g_nomepin,item,valoritem,objposicaocursor.ddx+" "+objposicaocursor.ddy);
			}
		}
	},
	/*
	Function: insereGrafico
	
	Insere um grafico no mapa na posição clicada

	O ponto é obtidos do objeto objposicaocursor e os demais parâmetros da janela interna aberta no iframe "wdocai"
	*/
	insereGrafico: function(){
		if (g_tipoacao == "inseregrafico"){
			var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
			var tema = doc.getElementById("temasLigados").value;
			var width = doc.getElementById("w").value;
			var inclinacao = doc.getElementById("inclinacao").value;
			var shadow_height = doc.getElementById("sombra").value;
			if (tema == ""){alert("Nenhum tema definido para pegar os dados");}
			else{
				//pega os itens e as cores definidas
				var listadeitens = new Array();
				var g = doc.getElementById("listai");
				var iguias = g.getElementsByTagName("input");
				var i = iguias.length-1;
				if (i >= 0){
					do{
						if (iguias[i].checked == true){
							var it = iguias[i].id;
							var c = doc.getElementById("cor"+it).value;
							listadeitens.push(it+","+c);
						}
					}
					while(i--)
				}
				var itens = listadeitens.join("*");
				if (itens == "")
				{alert("Nenhum item foi escolhido");}
				else{
					i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
					i3GEO.php.insereSHPgrafico(i3GEO.atualiza,tema,objposicaocursor.ddx,objposicaocursor.ddy,itens,shadow_height,width,inclinacao);
				}
			}
		}
	},
	/*
	Class: i3GEO.mapa.recupera
	
	Tenta recuperar o mapa de backup caso ocorra algum problema
	
	O i3Geo mantém sempre uma cópia do arquivo mapfile em uso. Essa função tenta
	usar essa cópia para restaurar o funcionamento do mapa
	*/
	recupera:{
		/*
		Variable: TENTATIVA
		
		Armazena a quantidade de tentativas de recuperação que foram feitas
		
		Type:
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
			if(i3GEO.mapa.recupera.TENTATIVA == 0){
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
	Class: i3GEO.mapa.legendaHTML
	
	Controla a obtenção da legenda do mapa formatada em HTML.
	
	Útil para mostrar a legenda na tela
	*/
	legendaHTML:{
		/*
		Variable: ID
		
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
		
		Parameters:
		
		id {String} - id do elemento que receberá a legenda
		*/
		cria: function(id){
			if(arguments.length == 0){var id = "";}
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
				if(i3GEO.mapa.legendaHTML.ID != "" && $i(i3GEO.mapa.legendaHTML.ID))
				{
					if ((retorno.data != "erro") && (retorno.data != undefined)){
						var s = i3GEO.configura.locaplic+"/imagens/solta.gif";
						$i(i3GEO.mapa.legendaHTML.ID).innerHTML = "<img onclick='i3GEO.mapa.legendaHTML.libera()' id=soltaLeg src="+s+" title='clique para liberar'/><br><div id='corpoLegi' >"+ retorno.data.legenda + "</div>";
					}
				}
				if ($i("wlegenda")){
					$i("wlegenda").innerHTML = retorno.data.legenda;
					var elementos = $i("wlegenda").getElementsByTagName("input");
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
		
		Parameters:
		
			funcao {function} - função que receberá o resultado da chamada AJAX. O objeto CPAINT é enviado como parâmetro.
		*/
		obtem: function(funcao){
			i3GEO.php.criaLegendaHTML(funcao,"",i3GEO.configura.templateLegenda)
		},
		/*
		Function: ativaDesativaTema
		
		Liga ou desliga um único tema. Utilizado pela legenda HTML, permitindo que um tema seja processado diretamente na legenda.
		
		Parameters:
		
			inputbox {object) - objeto do tipo input checkbox com a propriedade value indicando o código do tema que será processado
		*/
		ativaDesativaTema: function(inputbox){
			var temp = function(){
				i3GEO.php.corpo(i3GEO.atualiza,i3GEO.configura.tipoimagem);
				i3GEO.arvoreDeCamadas.atualiza("");
				i3GEO.janela.fechaAguarde("redesenha");
			};
			i3GEO.janela.abreAguarde("redesenha",$trad("o1"));
			if(!inputbox.checked)
			i3GEO.php.ligatemas(temp,inputbox.value,"");
			else
			i3GEO.php.ligatemas(temp,"",inputbox.value);		
		},
		/*
		Function: libera
		
		Libera a legenda criando uma janela flutuante sobre o mapa
		*/
		libera: function(){
			var temp = function(retorno){
				if (!$i("moveLegi")){
					var novoel = document.createElement("div");
					novoel.id = "moveLegi";
					novoel.style.display="block";
					var temp = '<div class="hd">Legenda</div>';
					temp += '<div id="wlegenda" style="text-align:left;background-color:white" ></div>';
					novoel.innerHTML = temp;
					document.body.appendChild(novoel);
					YAHOO.namespace("moveLegi.xp");
					YAHOO.moveLegi.xp.panel = new YAHOO.widget.Panel("moveLegi", {width:"300px", fixedcenter: true, constraintoviewport: false, underlay:"none", close:true, visible:true, draggable:true, modal:false } );
					YAHOO.moveLegi.xp.panel.render();
				}
				$i("wlegenda").innerHTML = retorno.data.legenda;
				var temp = $i("wlegenda").getElementsByTagName("input");
				var n = temp.length;
				for(i=0;i<n;i++){
					temp[i].style.display = "none";
				}
				YAHOO.moveLegi.xp.panel.show();				
			}
			i3GEO.mapa.legendaHTML.obtem(temp);
		}
	},
	/*
	Class: i3GEO.mapa.legendaIMAGEM
	
	Controla a obtenção da legenda do mapa na forma de uma imagem
	
	É utilizado principalmente para armazenar as imagens para a função de 
	obtenção do histórico do mapa
	*/
	legendaIMAGEM:{
		/*
		Function: obtem
		
		Faz a chamada em AJAX que gera a legenda
		
		O resultado é processado pela função passada como parâmetro
		
		Parameters:
		
			funcao {function} - função que receberá o resultado da chamada AJAX. O objeto CPAINT é enviado como parâmetro.
		*/
		obtem: function(funcao){
			i3GEO.php.criaLegendaImagem(funcao);
		}
	},
	/*
	Class: i3GEO.mapa.dialogo
	
	Abre as telas de diálogo das opções de manipulação do mapa atual
	*/
	dialogo:{
		/*
		Function: autoredesenha

		Abre a janela para definição do intervalo de tempo para redesenho automático do mapa.
		*/
		autoredesenha: function()
		{i3GEO.janela.cria("300px","110px",i3GEO.configura.locaplic+"/ferramentas/opcoes_autoredesenha/index.htm","","","Temporizador<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=9' ><b>?</b></a>");},
		/*
		Function: salvaMapa

		Abre a janela para salvar localmente o mapfile utilizado no mapa atual
		*/
		salvaMapa: function(){
			if(i3GEO.parametros == "")
			{alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			i3GEO.janela.cria("300px","180px",i3GEO.configura.locaplic+"/ferramentas/salvamapa/index.htm","","","Salva mapa<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=2&idajuda=10' ><b>?</b></a>");
		},
		/*
		Function: carregaMapa

		Abre a janela para a carga de um mapfile salvo localmente na máquina dousuário.
		*/
		carregaMapa: function()
		{i3GEO.janela.cria("300px","150px",i3GEO.configura.locaplic+"/ferramentas/carregamapa/index.htm?urlatual="+window.location,"","","Carrega mapa<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=2&idajuda=11' ><b>?</b></a>");},
		/*
		Function: convertews

		Abre a janela para converter o mapa atual em web service WMS
		*/
		convertews: function(){
			if(i3GEO.parametros.mapfile == "")
			{alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			i3GEO.janela.cria("440px","280px",i3GEO.configura.locaplic+"/ferramentas/convertews/index.htm","","","Web service");
		},
		/*
		Function: convertekml

		Abre a janela para converter o mapa atual em KML
		*/
		convertekml: function(){
			if(i3GEO.parametros.mapfile == "")
			{alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			i3GEO.janela.cria("440px","280px",i3GEO.configura.locaplic+"/ferramentas/convertemapakml/index.htm","","","Kml");
		},
		/*
		Function: queryMap

		Abre a janela que altera as propriedades da exibição dos elementos selecionados.
		*/
		queryMap: function()
		{i3GEO.janela.cria("210px","80px",i3GEO.configura.locaplic+"/ferramentas/opcoes_querymap/index.htm","","","Cor da seleção<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=5' ><b>?</b></a>");},
		/*
		Function: template

		Abre a janela que muda o template do mapa atual.
		*/
		template: function()
		{i3GEO.janela.cria("300px","400px",i3GEO.configura.locaplic+"/ferramentas/template/index.htm","","","Template<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=8' ><b>?</b></a>");},
		/*
		Function: tamanho

		Abre a janela que muda o tamanho do mapa
		*/
		tamanho: function()
		{i3GEO.janela.cria("150px","170px",i3GEO.configura.locaplic+"/ferramentas/opcoes_tamanho/index.htm","","","Tamanho<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=4' ><b>?</b></a>");},
		/*
		Function: tipoimagem

		Abre a janela que define um filtro gráfico (sépia por exemplo) sobre a imagem gerada alterando suas características
		*/
		tipoimagem: function()
		{i3GEO.janela.cria("300px","260px",i3GEO.configura.locaplic+"/ferramentas/tipoimagem/index.htm","","","Tipo de imagem<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=1' ><b>?</b></a>");},
		/*
		Function: corFundo

		Abre a janela que altera a cor do fundo do mapa atual.
		*/
		corFundo: function()
		{i3GEO.janela.cria("210px","80px",i3GEO.configura.locaplic+"/ferramentas/opcoes_fundo/index.htm","","","Cor do fundo<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=6' ><b>?</b></a>");},
		/*
		Function: opcoesEscala

		Abre a janela para definição das opções da barra de escala.
		*/
		opcoesEscala: function()
		{i3GEO.janela.cria("250px","300px",i3GEO.configura.locaplic+"/ferramentas/opcoes_escala/index.htm","center","center","Escala<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=3' ><b>?</b></a>");},
		/*
		Function: opcoesLegenda

		Abre a janela de configuração da legenda do mapa
		*/
		opcoesLegenda: function()
		{i3GEO.janela.cria("320px","300px",i3GEO.configura.locaplic+"/ferramentas/opcoes_legenda/index.htm","","","Legenda<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=2' ><b>?</b></a>");},
		/*
		Function: gradeCoord

		Abre a janela que gera grade de coordenadas
		*/
		gradeCoord: function()
		{i3GEO.janela.cria("350px","330px",i3GEO.configura.locaplic+"/ferramentas/gradecoord/index.htm","","","Grade de coordenadas<a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=7' ><b>?</b></a>");},
		/*
		Function: cliqueTexto
		
		Abre o diálogo para inclusão de textos diretamente no mapa
		
		Registra os eventos que controlam o clique sobre o mapa
		*/
		cliqueTexto: function(){
			if (g_tipoacao != "textofid"){
				var temp = Math.random() + "b";
				temp = temp.split(".");
				g_nomepin = "pin"+temp[1];
				//pontosdistobj = new pontosdist();
				g_tipoacao = "textofid";
				var janela = i3GEO.janela.cria("360px","250px",i3GEO.configura.locaplic+"/ferramentas/inseretxt/index.htm","","","Texto");
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.mapa.insereToponimo()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.mapa.insereToponimo()");}
				var temp = function(){
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
			if (g_tipoacao != "inserexy"){
				g_tipoacao = "inserexy";
				var temp = Math.random() + "a";
				temp = temp.split(".");
				g_nomepin = "pin"+temp[1];
				var janela = i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+'/ferramentas/inserexy2/index.htm',"","","Insere");
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.mapa.inserePonto()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.mapa.inserePonto()");}
				var temp = function(){
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
			if (g_tipoacao != "inseregrafico"){
				g_tipoacao = "inseregrafico";
				var temp = Math.random() + "a";
				temp = temp.split(".");
				g_nomepin = "pin"+temp[1];
				var janela = i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+'/ferramentas/inseregrafico/index.htm',"","","Insere");
				if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.mapa.insereGrafico()") < 0)
				{i3GEO.eventos.MOUSECLIQUE.push("i3GEO.mapa.insereGrafico()");}
				var temp = function(){
					i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.mapa.insereGrafico()");
					i3GEO.barraDeBotoes.ativaBotoes();
				};
				YAHOO.util.Event.addListener(janela[0].close, "click", temp);
			}
		}
	},
	corpo:{
		verifica:function(retorno){
			try{
				i3GEO.janela.abreAguarde("ajaxCorpoMapa",$trad("o3"));
				if(retorno.data){var retorno = retorno.data;}
				if (retorno.variaveis){var retorno = retorno.variaveis;}
				if ((retorno == "erro") || (retorno == undefined)){
					i3GEO.mapa.ajustaPosicao();
					i3GEO.janela.fechaAguarde();
					i3GEO.mapa.recupera.inicia();
				}
				i3GEO.mapa.recupera.TENTATIVA = 0;
			}
			catch(e){
				if(i3GEO.interface.ATUAL == "openlayers"){
					i3GEO.janela.fechaAguarde();
					return;
				}
				if(i3GEO.mapa.recupera.TENTATIVA == 0){
					alert("Erro no mapa. Sera feita uma tentativa de recuperacao.");
					i3GEO.mapa.recupera.inicia();
				}
				else{
					alert("Recuperacao impossivel. Sera feita uma tentativa de reiniciar o mapa.");
					if (i3GEO.mapa.recupera.TENTATIVA == 1){
						i3GEO.mapa.recupera.TENTATIVA = 2;
						i3GEO.php.reiniciaMapa(i3GEO.atualiza);
					}		
				}
			}
		}
	}
};
//YAHOO.log("carregou classe mapa", "Classes i3geo");