/*
Title: Navegador de tabelas no Postgis

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
Classe: i3GEOF.navegarquivos

*/
i3GEOF.navegarquivos = {
	//ao concluir, o nome do arquivo sera retornado para esse objeto atribuindo o resultado ao atributo value
	retornarPara: "",
	//guarda o objeto TV
	arvore: "",
	listaShp: true,
	listaImg: true,
	listaFig: true,
	retornaDir: false,
	/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
		Para efeitos de compatibilidade antes da vers&atilde;o 4.7 que n&atilde;o tinha dicion&aacute;rio
	*/
	criaJanelaFlutuante: function(obj){
		i3GEOF.navegarquivos.iniciaDicionario(obj);
	},
	/*
	Function: iniciaDicionario

	Carrega o dicion&aacute;rio e chama a fun&ccedil;&atilde;o que inicia a ferramenta

	O Javascript &eacute; carregado com o id i3GEOF.nomedaferramenta.dicionario_script
	*/
	iniciaDicionario: function(obj,listaShp,listaImg,listaFig,retornaDir){
		if(!obj){
			listaShp = true;
			listaImg = true;
			listaFig = true;
			retornaDir = false;
		}
		i3GEOF.navegarquivos.retornarPara = obj;
		i3GEOF.navegarquivos.listaShp = listaShp;
		i3GEOF.navegarquivos.listaImg = listaImg;
		i3GEOF.navegarquivos.listaFig = listaFig;
		i3GEOF.navegarquivos.retornaDir = retornaDir;
		if(typeof(i3GEOF.navegarquivos.dicionario) === 'undefined'){
			i3GEO.util.scriptTag(
				i3GEO.configura.locaplic+"/ferramentas/navegarquivos/dicionario.js",
				"i3GEOF.navegarquivos.iniciaJanelaFlutuante()",
				"i3GEOF.navegarquivos.dicionario_script"
			);
		}
		else{
			i3GEOF.navegarquivos.iniciaJanelaFlutuante();
		}
	},
	/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
	*/
	inicia: function(){
		i3GEOF.navegarquivos.ARVORE = new YAHOO.widget.TreeView($i("i3GEOF.navegarquivos_corpo"));
		var root = i3GEOF.navegarquivos.ARVORE.getRoot();
		new YAHOO.widget.HTMLNode(
			{html:$trad('pastas',i3GEOF.navegarquivos.dicionario),enableHighlight:false,expanded:false,hasIcon:false},
			root
		);
		i3GEOF.navegarquivos.ARVORE.draw();
		i3GEOF.navegarquivos.adicionaNoNavegacaoDir(i3GEOF.navegarquivos.listaShp,i3GEOF.navegarquivos.listaImg,i3GEOF.navegarquivos.listaFig);
	},
	/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
	*/
	html:function(){
		return "";
	},
	/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
	*/
	iniciaJanelaFlutuante: function(){
		var janela,divid,titulo,cabecalho,minimiza;
		if ($i("i3GEOF.navegarquivos")) {
			return;
		}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.navegarquivos");
		};
		//cria a janela flutuante
		titulo = "<div class='i3GeoTituloJanela'>" + $trad('arquivos',i3GEOF.navegarquivos.dicionario) + "</div>";
		janela = i3GEO.janela.cria(
			"400px",
			"300px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.navegarquivos",
			false,
			"hd",
			cabecalho,
			minimiza,
			"",
			"",
			"",
			"",
			"nao"
		);
		divid = janela[2].id;
		$i("i3GEOF.navegarquivos_corpo").style.backgroundColor = "white";
		$i("i3GEOF.navegarquivos_corpo").style.textAlign = "left";
		i3GEOF.navegarquivos.aguarde = $i("i3GEOF.navegarquivos_imagemCabecalho").style;
		i3GEOF.navegarquivos.inicia(divid);
	},
	//essa funcao e definida como uma propriedade do no da arvore
	//i3GEO.arvoreDeTemas processa isso e inclui no onclick do no
	retorna: function(arquivo){
		var onde = $i(i3GEOF.navegarquivos.retornarPara);
		if(onde){
			onde.value = arquivo;
		}
		i3GEOF.navegarquivos.ARVORE.destroy();
		i3GEO.janela.destroi("i3GEOF.navegarquivos");
		return null;
	},
	//parametros listaShp:true,listaImg:true,listaFig:true
	adicionaNoNavegacaoDir: function(listaShp,listaImg,listaFig,retornaDir){
		if(i3GEO.arvoreDeTemas.LOCAPLIC == ""){
			i3GEO.arvoreDeTemas.LOCAPLIC = i3GEO.configura.locaplic;
		}
		var temp = function(retorno){
			var drives,iglt,ig,drive,tempNode;
			drives = i3GEO.arvoreDeTemas.DRIVES;
			if(drives == undefined || drives == "" || drives.length === 0){
				drives = retorno.data.drives;
			}
			i3GEO.arvoreDeTemas.DRIVES = drives;
			iglt = drives.length;
			tempNode = i3GEOF.navegarquivos.ARVORE.getRoot();
			ig=0;
			do{
				drive = new YAHOO.widget.HTMLNode(
					{
						listaShp:i3GEOF.navegarquivos.listaShp,
						listaImg:i3GEOF.navegarquivos.listaImg,
						listaFig:i3GEOF.navegarquivos.listaFig,
						retornaDir: i3GEOF.navegarquivos.retornaDir,
						html:drives[ig].nome,
						caminho:drives[ig].caminho,
						enableHighlight:true,
						expanded:false,
						funcaoClick: "i3GEOF.navegarquivos.retorna"
					},
					tempNode
				);
				drive.setDynamicLoad(i3GEO.arvoreDeTemas.montaDir, 1);
				ig+=1;
			}
			while(ig<iglt);
			i3GEOF.navegarquivos.ARVORE.draw();
		};
		i3GEO.catalogoDir.getDrives(temp);
	}
};
