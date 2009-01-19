/*
Class:: i3GEO.mapa

Cria e processa o mapa principal

Em i3GEO.mapa.dialogo estão as funções de abertura dos diálogos para alteração das propriedades do mapa,
como cor de fundo, tipo de imagem, legenda etc.

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
i3GEO.mapa = {
	/*
	Function: ajustaPosicao
	
	Ajusta o posicionamento do corpo do mapa
	
	Esse ajuste é necessário na inicialização, uma vez que o mapa utiliza style.position='absolute'
	*/
	ajustaPosicao: function(){
		try{
			imagemxi = 0;
			imagemyi = 0;
			imagemxref = 0;
			imagemyref = 0;
			var dc = $i("i3geo");
			if(!dc){return;}
			if (dc.style.left){imagemxi += parseInt(dc.style.left);}
			if (dc.style.top){imagemyi += parseInt(dc.style.top);}	
			if ($i("contemImg"))
			{var dc = $i("contemImg");}
			else
			{var dc = $i("img");}
			if ($i("openlayers"))
			{var dc = $i("openlayers");}
			if ($i("flamingo"))
			{var dc = $i("flamingo");}
			while ((dc.offsetParent) && (dc.offsetParent.id != "i3geo")){
				dc = dc.offsetParent;
				imagemxi = imagemxi + dc.offsetLeft;
				imagemyi = imagemyi + dc.offsetTop;
			}
			var c = $i("corpoMapa");
			if (c){
				c.style.position="absolute";
				$left("corpoMapa",imagemxi);
				$top("corpoMapa",imagemyi);
				if ($i("i3geo").style.left){$left("corpoMapa",imagemxi - parseInt($i("i3geo").style.left));}
				if ($i("i3geo").style.top){$top("corpoMapa",imagemyi - parseInt($i("i3geo").style.top));}
			}
			if ($i("ref")){
				var dc = $i("ref");
				while (dc.offsetParent.id != "i3geo"){
					dc = dc.offsetParent;
					imagemxref = imagemxref + dc.offsetLeft;
					imagemyref = imagemyref + dc.offsetTop;
				}
			}
			if ($i("aguarde")){
				$top("aguarde",imagemyi);
				$left("aguarde",imagemxi);
			}
		}
		catch(e){alert("Ocorreu um erro. i3GEO.mapa.ajustaPosicao"+e);}
	},
	/*
	Function: recupera
	
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
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=recuperamapa&g_sid="+i3GEO.configura.sid;
			var cp = new cpaint();
			//cp.set_debug(2)
			cp.set_response_type("JSON");
			cp.call(p,"recuperamapa",ajaxredesenha);
		}
	},
	/*
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
			var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&templateLegenda="+g_templateLegenda+"&g_sid="+i3GEO.configura.sid;
			var cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"criaLegenda",funcao);
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
	Function: legendaIMAGEM
	
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
			var p =i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaImagem&g_sid="+i3GEO.configura.sid;
			var cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"legendaGrafica",funcao);
		}
	},
	/*
	Function: dialogo
	
	Abre as telas de diálogo das opções de manipulação do mapa atual
	*/
	dialogo:{
		/*
		Function: autoredesenha

		Abre a janela para definição do intervalo de tempo para redesenho automático do mapa.
		*/
		autoredesenha: function()
		{i3GEO.janela.cria("300px","180px",i3GEO.configura.locaplic+"/ferramentas/opcoes_autoredesenha/index.htm","","","Temporizador");},
		/*
		Function: salvaMapa

		Abre a janela para salvar localmente o mapfile utilizado no mapa atual
		*/
		salvaMapa: function(){
			if(objmapa.mapfile == "")
			{alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			i3GEO.janela.cria("300px","180px",i3GEO.configura.locaplic+"/ferramentas/salvamapa/index.htm","","","Salva mapa");
		},
		/*
		Function: carregaMapa

		Abre a janela para a carga de um mapfile salvo localmente na máquina dousuário.
		*/
		carregaMapa: function()
		{i3GEO.janela.cria("300px","150px",i3GEO.configura.locaplic+"/ferramentas/carregamapa/index.htm?urlatual="+window.location,"","","Carrega mapa");},
		/*
		Function: convertews

		Abre a janela para converter o mapa atual em web service WMS
		*/
		convertews: function(){
			if(objmapa.mapfile == "")
			{alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return;}
			i3GEO.janela.cria("440px","280px",i3GEO.configura.locaplic+"/ferramentas/convertews/index.htm","","","Web service");
		},
		/*
		Function: queryMap

		Abre a janela que altera as propriedades da exibição dos elementos selecionados.
		*/
		queryMap: function()
		{i3GEO.janela.cria("210px","170px",i3GEO.configura.locaplic+"/ferramentas/opcoes_querymap/index.htm","","","Querymap");},
		/*
		Function: template

		Abre a janela que muda o template do mapa atual.
		*/
		template: function()
		{i3GEO.janela.cria("300px","400px",i3GEO.configura.locaplic+"/ferramentas/template/index.htm","","","Template");},
		/*
		Function: tamanho

		Abre a janela que muda o tamanho do mapa
		*/
		tamanho: function()
		{i3GEO.janela.cria("150px","170px",i3GEO.configura.locaplic+"/ferramentas/opcoes_tamanho/index.htm","","","Tamanho");},
		/*
		Function: tipoimagem

		Abre a janela que define um filtro gráfico (sépia por exemplo) sobre a imagem gerada alterando suas características
		*/
		tipoimagem: function()
		{i3GEO.janela.cria("300px","220px",i3GEO.configura.locaplic+"/ferramentas/tipoimagem/index.htm","","","Tipo de imagem");},
		/*
		Function: corFundo

		Abre a janela que altera a cor do fundo do mapa atual.
		*/
		corFundo: function()
		{i3GEO.janela.cria("210px","170px",i3GEO.configura.locaplic+"/ferramentas/opcoes_fundo/index.htm","","","Fundo");},
		/*
		Function: opcoesEscala

		Abre a janela para definição das opções da barra de escala.
		*/
		opcoesEscala: function()
		{i3GEO.janela.cria("250px","300px",i3GEO.configura.locaplic+"/ferramentas/opcoes_escala/index.htm","center","center","Escala");},
		/*
		Function: opcoesLegenda

		Abre a janela de configuração da legenda do mapa
		*/
		opcoesLegenda: function()
		{i3GEO.janela.cria("300px","280px",i3GEO.configura.locaplic+"/ferramentas/opcoes_legenda/index.htm","","","Legenda");},
		/*
		Function: gradeCoord

		Abre a janela que gera grade de coordenadas
		*/
		gradeCoord: function()
		{i3GEO.janela.cria("350px","280px",i3GEO.configura.locaplic+"/ferramentas/gradecoord/index.htm","","","Grade de coordenadas");}

	},
	/*
	Function: ativaLogo

	Ativa ou desativa a logo marca.

	*/
	ativaLogo: function(){
		var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=ativalogo&g_sid="+i3GEO.configura.sid;
		var cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"ativalogo",ajaxredesenha);
	}
	
};