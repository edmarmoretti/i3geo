/*
Title: Ferramenta que permite mostrar os limites de um tipo de regi&atilde;o baseada no cadastro do m&oacute;dulo METAESTAT

A regiao e mostrada como uma nova camada no mapa

Arquivo:

i3geo/ferramentas/metaestat/mostraregiao.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Esse programa utiliza parcialmente os codigos da aplicacao calculadora de carbono desenvolvido pelo
IPAM - Instituto de Pesquisa Ambiental da Amazonia

Este programa e software livre; voce pode redistribui-lo
e/ou modifica-lo sob os termos da Licenca Publica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa e distribuido na expectativa de que seja util,
porem, SEM NENHUMA GARANTIA; nem mesmo a garantia implicita
de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE ESPECIFICA.
Consulte a Licenca Publica Geral do GNU para mais detalhes.
Voce deve ter recebido uma copia da Licenca Publica Geral do
GNU junto com este programa; se nao, escreva para a
Free Software Foundation, Inc., no endereco
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
/*
Classe: i3GEOF.mostraregiao

Permite que o usu&aacute;rio escolha um tipo de regi&atilde;o para incluir no mapa
 */
i3GEOF.mostraregiao = {
	/**
	 * Ativa/desativa o indicador de aguarde
	 */
	aguarde: function(obj){
		if(!obj){
			return "<img style='display:block;z-index:2' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' />";
		}
		var i = $i(obj.id+"_imagem");
		if(!i){
			obj.innerHTML = "<img id='"+obj.id+"_imagem' style='display:block;z-index:2' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' />";
		}
		else{
			if(i.style.display == "block"){
				i.style.display = "none";
			}
			else{
				i.style.display = "block";
			}
		}
	},
	//para efeitos de compatibilidade
	criaJanelaFlutuante: function(){
		i3GEOF.mostraregiao.iniciaDicionario();
	},
	/**
	 * Inicia a ferramenta ativando as opcoes
	 * Executa i3GEOF.mostraregiao.comboRegioes
	 */
	inicia: function(divid){
		$i(divid).innerHTML = i3GEOF.mostraregiao.html();
		i3GEOF.mostraregiao.comboRegioes($i("i3geomostraregiaoTipoRegiao"));
		YAHOO.i3GEO.janela.manager.find("i3GEOF.mostraregiao").setFooter('<input id=i3geomostraregiaoAplica type="button" value="'+$trad("p14")+'" />');
		new YAHOO.widget.Button(
			"i3geomostraregiaoAplica",
			{onclick:{fn: function(){i3GEOF.mostraregiao.aplica();}}}
		);
		$i("i3geomostraregiaoAplica-button").style.width = "180px";
	},
	/**
	 * Carrega o dicionario com a traducao
	 * Executa i3GEOF.mostraregiao.iniciaJanelaFlutuante();
	 */
	iniciaDicionario: function(){
		if(!i3GEOF.metaestat || typeof(i3GEOF.metaestat.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/metaestat/dicionario.js",
				"i3GEOF.mostraregiao.iniciaJanelaFlutuante()",
				"i3GEOF.metaestat.dicionario_script"
			);
		}
		else{
			i3GEOF.mostraregiao.iniciaJanelaFlutuante();
		}
	},
	/**
	 * Abre a janela flutuante com o conteudo da ferramenta
	 * Executa i3GEOF.mostraregiao.inicia
	 */
	iniciaJanelaFlutuante: function(){
		if($i("i3GEOF.mostraregiao_corpo")){
			return;
		}
		var minimiza,cabecalho,janela,divid,titulo;
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.mostraregiao");
		};
		//cria a janela flutuante
		titulo = "Limites &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
		janela = i3GEO.janela.cria(
			"210px",
			"",
			"",
			"",
			"",
			titulo,
			"i3GEOF.mostraregiao",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.mostraregiao_corpo").style.backgroundColor = "white";
		i3GEOF.mostraregiao.inicia(divid);
		i3GEO.janela.tempoMsg("Utilize a guia lateral para ligar/desligar camadas que j&aacute; estejam no mapa");
	},
	/**
	 * HTML com o conteudo da ferramenta
	 *
	 * @return HTML
	 */
	html: function(){
		var ins = "" +
		'<div class="paragrafo" id="i3geomostraregiaoTipoRegiao" >' +
		'</div>' +
		'<p class=paragrafo ><input type=checkbox id="i3geomostraregiaoNomes" style="cursor:pointer;position:relative;top:2px;" /> Inclui nomes</p>' +
		'<p class=paragrafo >Contorno:</p>' +
		'Cor: &nbsp;' + $inputText("","","i3geomostraregiaoOutlinecolor","",12,"255,0,0") +
		'&nbsp;<img alt="aquarela.gif" style=position:relative;top:2px;cursor:pointer src="'+i3GEO.configura.locaplic+'/imagens/aquarela.gif" onclick="i3GEOF.mostraregiao.corj(\'i3geomostraregiaoOutlinecolor\')" /> ' +
		'<br><br>Largura: &nbsp;' + $inputText("","","i3geomostraregiaoWidth","",3,"1") +
		'<br><br>' ;
		return ins;
	},
	/**
	 * Monta o combo com as regioes cadastradas
	 * Executa i3GEO.php.listaTipoRegiao
	 */
	comboRegioes: function(objonde){
		if(objonde){
			i3GEOF.mostraregiao.aguarde(objonde);
		}
		var temp = function(regioes){
			var ins = '',
			i,n;
			n = regioes.length;
			ins += "<select id='i3geomostraregiaoComboTipoRegiao' style='width:90%' ><option value=''>---</option>";
			for(i=0;i<n;i++){
				ins += "<option value='"+regioes[i].codigo_tipo_regiao+"'>"+regioes[i].nome_tipo_regiao+"</option>";
			}
			ins += "</select><br>";
			if(objonde){
				objonde.innerHTML = ins;
			}
			return ins;
		};
		i3GEO.php.listaTipoRegiao(temp);
	},
	/**
	 * Obtem os parametros necessarios e adiciona ao mapa uma nova camada com a regiao
	 * Executa ferramentas/metaestat/analise.php?funcao=adicionaLimiteRegiao
	 */
	aplica: function(){
		var combo = $i("i3geomostraregiaoComboTipoRegiao"),
			nomes = $i("i3geomostraregiaoNomes");
		if (combo.value === ""){
			i3GEO.janela.tempoMsg("Escolha um limite geogr&aacute;fico");
			return;
		}
		i3GEO.janela.abreAguarde("aguardeMostraRegiao","Aguarde...");
		var temp = function(retorno){
			i3GEO.janela.fechaAguarde("aguardeMostraRegiao");
			i3GEO.atualiza();

		};
		if(nomes.checked == true){
			nomes = "sim";
		}
		else{
			nomes = "nao";
		}
		i3GEO.janela.AGUARDEMODAL = true;
		i3GEO.janela.abreAguarde("aguardeMostraRegiao","Aplicando...");
		i3GEO.janela.AGUARDEMODAL = false;
		p = i3GEO.configura.locaplic+"/ferramentas/metaestat/analise.php?funcao=adicionaLimiteRegiao"+
			"&codigo_tipo_regiao="+combo.value+
			"&g_sid="+i3GEO.configura.sid+
			"&outlinecolor="+$i("i3geomostraregiaoOutlinecolor").value+
			"&width="+$i("i3geomostraregiaoWidth").value+
			"&nomes="+nomes;
		i3GEO.util.ajaxGet(p,temp);
		//i3GEO.php.mapfileTipoRegiao(temp,combo.value,$i("i3geomostraregiaoOutlinecolor").value,$i("i3geomostraregiaoWidth").value,nomes);
	},
	/**
	 * Abre a janela de dialogo para escolha da cor que sera usada para desenhar a regiao
	 */
	corj: function(obj){
		i3GEO.util.abreCor("",obj);
	}
};