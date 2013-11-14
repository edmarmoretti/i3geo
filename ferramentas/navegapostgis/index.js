/*
Title: Navegador de tabelas do banco de dados postgis

Para testar i3GEO.util.navegadorPostgis()

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
Classe: i3GEOF.navegapostgis

*/
i3GEOF.navegapostgis = {
	//ao concluir, o nome do arquivo será retornado para esse objeto atribuindo o resultado ao atributo value
	retornarPara: "",
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	conexao: "",
	esquema: "",
	tabela: "",
	ARVORE: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(obj,conexao){
		i3GEOF.navegapostgis.iniciaDicionario(obj,conexao);
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(obj,conexao){
		if(!obj || !conexao){
			conexao = "";
		}
		i3GEOF.navegapostgis.conexao = conexao;
		i3GEOF.navegapostgis.retornarPara = obj;
		if(typeof(i3GEOF.navegapostgis.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/navegapostgis/dicionario.js",
				"i3GEOF.navegapostgis.iniciaJanelaFlutuante()",
				"i3GEOF.navegapostgis.dicionario_script"
			);
		}
		else{
			i3GEOF.navegapostgis.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		$i(iddiv).innerHTML = i3GEOF.navegapostgis.html();
		new YAHOO.widget.Button(
			"i3GEOFnavegapostgisAplicar",
			{onclick:{fn: function(){
				if($i(i3GEOF.navegapostgis.retornarPara)){
					$i(i3GEOF.navegapostgis.retornarPara).value = $i("i3GEOFnavegapostgisSql").value;
				}
				i3GEOF.navegapostgis.ARVORE.destroy();
				i3GEO.janela.destroi("i3GEOF.navegapostgis");
				return null;
			}}}
		);
		var conexao = function(retorno){
				var ins = "<select onchange='i3GEOF.navegapostgis.montaArvore(this.value)'>",
					n = retorno.length,
					i = 0;
				for (i=0;i<n; i++){
					ins += "<option value='"+retorno[i].codigo_estat_conexao+"' >"+retorno[i].bancodedados+"</option>";
				}
				ins += "</select>";
				$i("i3GEOFnavegapostgisConexao").innerHTML = ins;
				if(i3GEOF.navegapostgis.conexao != ""){
					$i("i3GEOFnavegapostgisConexao").value = i3GEOF.navegapostgis.conexao;
					i3GEOF.navegapostgis.montaArvore(i3GEOF.navegapostgis.conexao);
				}
			},
			p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaConexao&formato=json",
			botao = $i("i3GEOFnavegapostgisAplicar");
		botao.style.position = "absolute";
		botao.style.top = "230px";
		botao.style.left = "70px";

		cpJSON.call(p,"foo",conexao);
		/*
		i3GEOF.navegapostgis.ARVORE = new YAHOO.widget.TreeView($i("i3GEOF.navegapostgis_corpo"));
		var root = i3GEOF.navegapostgis.ARVORE.getRoot();
		new YAHOO.widget.HTMLNode(
			{html:$trad(2,i3GEOF.navegapostgis.dicionario),enableHighlight:false,expanded:false,hasIcon:false},
			root
		);
		i3GEOF.navegapostgis.ARVORE.draw();
		i3GEOF.navegapostgis.adicionaNoNavegacaoDir(i3GEOF.navegapostgis.listaShp,i3GEOF.navegapostgis.listaImg,i3GEOF.navegapostgis.listaFig);
		*/
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		var ins = "" +
			"<span class=paragrafo style=width:50px; >"+$trad(2,i3GEOF.navegapostgis.dicionario) + "</span>" +
			"<div class=paragrafo id=i3GEOFnavegapostgisConexao style='display:block;margin:5px;position:relative;left:125px;top:-22px;width:100px;' >" +
			"</div>" +
			"<div id='i3GEOFnavegapostgispar' style='padding:2px;position:relative;top:-15px;display:none;' ><div id=i3GEOFnavegapostgisArvore style='width: 215px;overflow: auto;height: 210px;border: 1px solid lightgray;position: absolute;top: 0px;'> "+
			"</div>" +
			"<div id=i3GEOFnavegapostgisColunas style='padding:2px;width: 230px;overflow: auto;height: 184px;border: 1px solid lightgray;position: absolute;left:223px;top: 0px;'> "+
			"</div>" +
			"<textarea id=i3GEOFnavegapostgisSql style='width: 233px;overflow: auto;height: 84px;border: 1px solid lightgray;position: absolute;left:223px;top: 190px;'> "+
			"</textarea>" +
			"<input style='position:absolute;top:235px;left:70px;' id=i3GEOFnavegapostgisAplicar type='button' value='"+$trad(10,i3GEOF.navegapostgis.dicionario)+"' />";
			"</div>";
		return ins;
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.navegapostgis");
		};
		//cria a janela flutuante
		titulo = $trad(1,i3GEOF.navegapostgis.dicionario);
		janela = i3GEO.janela.cria(
			"470px",
			"315px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.navegapostgis",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		$i("i3GEOF.navegapostgis_corpo").style.backgroundColor = "white";
		$i("i3GEOF.navegapostgis_corpo").style.textAlign = "left";
		i3GEOF.navegapostgis.aguarde = $i("i3GEOF.navegapostgis_imagemCabecalho").style;
		i3GEOF.navegapostgis.inicia(divid);
	},
	montaArvore: function(conexao){
		if(conexao == ""){
			return;
		}
		i3GEOF.navegapostgis.aguarde.display = "block";
		i3GEOF.navegapostgis.ARVORE = null;
		i3GEOF.navegapostgis.ARVORE = new YAHOO.widget.TreeView($i("i3GEOFnavegapostgisArvore"));
		var root = i3GEOF.navegapostgis.ARVORE.getRoot();
		new YAHOO.widget.HTMLNode(
			{
				html:$trad(3,i3GEOF.navegapostgis.dicionario),
				enableHighlight:false,
				expanded:false,
				hasIcon:false
			},
			root
		);
		i3GEOF.navegapostgis.ARVORE.draw();
		i3GEOF.navegapostgis.listaEsquemas(conexao);
	},
	listaEsquemas: function(conexao){
		$i("i3GEOFnavegapostgispar").style.display = "block";
		i3GEOF.navegapostgis.conexao = conexao;
		var funcao = function(retorno){
			i3GEOF.navegapostgis.aguarde.display = "none";
			var n,i,no,tempNode;
			n = retorno.length;
			tempNode = i3GEOF.navegapostgis.ARVORE.getRoot();
			for(i=0;i<n;i++){
				no = new YAHOO.widget.HTMLNode(
					{
						html:retorno[i].esquema,
						enableHighlight:true,
						expanded:false,
						esquema: retorno[i].esquema
					},
					tempNode
				);
				no.setDynamicLoad(i3GEOF.navegapostgis.listaTabelas, 1);
			}
			i3GEOF.navegapostgis.ARVORE.draw();

		},
		p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=esquemasConexao&formato=json&codigo_estat_conexao="+conexao;
		cpJSON.call(p,"foo",funcao);
	},
	listaTabelas: function(node){
		var esquema = node.data.esquema,
			conexao = i3GEOF.navegapostgis.conexao,
			funcao = function(retorno){
				i3GEOF.navegapostgis.aguarde.display = "none";
				var n,i,conteudo;
				n = retorno.length;
				for(i=0;i<n;i++){
					conteudo = "<a href='#' onclick='i3GEOF.navegapostgis.listaColunas(\""+retorno[i].tabela+"\")' >"+retorno[i].tabela+"</a>";
					new YAHOO.widget.HTMLNode({
							html:conteudo,
							enableHighlight:false,
							expanded:false,
							isLeaf:true
						},
						node
					);
				}
				node.loadComplete();
			},
			p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=tabelasEsquema&formato=json&nome_esquema="+esquema+"&codigo_estat_conexao="+conexao;
		i3GEOF.navegapostgis.esquema = esquema;
		cpJSON.call(p,"foo",funcao);
	},
	listaColunas: function(tabela){
		i3GEOF.navegapostgis.tabela = tabela;
		var funcao = function(retorno){
				var ins,n,i,
					gid = "ID",
					the_geom = "GEOM",
					nome = $trad(4,i3GEOF.navegapostgis.dicionario),
					mostra = $trad(6,i3GEOF.navegapostgis.dicionario);
				n = retorno.length;
				ins = "<table class=lista4 ><tr><td title='"+$trad(7,i3GEOF.navegapostgis.dicionario)+"'>"+gid+"</td><td title='"+$trad(8,i3GEOF.navegapostgis.dicionario)+"'>"+the_geom+"</td><td title='"+$trad(9,i3GEOF.navegapostgis.dicionario)+"'>"+mostra+"</td><td>"+nome+"</td></tr>";
				for(i=0;i<n;i++){
					gid = "<input onclick='i3GEOF.navegapostgis.geraSql()' style=cursor:pointer type=radio name='i3GEOFnavegapostgisGid' value='"+retorno[i].field+"' />";
					if(retorno[i].type == "line" || retorno[i].type == "polygon" || retorno[i].type == "point" || retorno[i].type == "geometry"){
						the_geom = "<input onclick='i3GEOF.navegapostgis.geraSql()' style=cursor:pointer type=radio name='i3GEOFnavegapostgisTheGeom' value='"+retorno[i].field+"' />";
					}
					else{
						the_geom = "";
					}
					mostra = "<input onclick='i3GEOF.navegapostgis.geraSql()' style=cursor:pointer type=checkbox name='i3GEOFnavegapostgisMostra' value='"+retorno[i].field+"' />";
					ins += "<tr><td>"+gid+"</td><td>"+the_geom+"</td><td>"+mostra+"</td><td title='"+retorno[i].type+"' >"+retorno[i].field+"</td></tr>";
				}
				ins += "</table>";
				$i("i3GEOFnavegapostgisColunas").innerHTML = ins;
			},
			p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=descreveColunasTabela&formato=json&nome_tabela="+tabela+"&nome_esquema="+i3GEOF.navegapostgis.esquema+"&codigo_estat_conexao="+i3GEOF.navegapostgis.conexao;
		cpJSON.call(p,"foo",funcao);
	},
	geraSql: function(){
		//pega a lista de inputs
		var inputs = $i("i3GEOFnavegapostgisColunas").getElementsByTagName("input"),
			n = inputs.length,
			i,sql,
			the_geom = "",
			gid = "",
			colunas = [];

		for(i=0;i<n;i++){
			if(inputs[i].name == "i3GEOFnavegapostgisGid" && inputs[i].checked == true){
				gid = inputs[i].value;
			}
			if(inputs[i].name == "i3GEOFnavegapostgisTheGeom" && inputs[i].checked == true){
				the_geom = inputs[i].value;
			}
		}
		for(i=0;i<n;i++){
			if(inputs[i].name == "i3GEOFnavegapostgisMostra" && inputs[i].checked == true && inputs[i].name != gid && inputs[i].name != the_geom){
				colunas.push(inputs[i].value);
			}
		}
		colunas.push(gid);
		colunas.push(the_geom);
		sql = the_geom+" from (select "+colunas.join(",")+" from "+i3GEOF.navegapostgis.esquema+"."+i3GEOF.navegapostgis.tabela+") as foo using unique "+gid+" using srid=4326";
		$i("i3GEOFnavegapostgisSql").value = sql;
	}
};