//
//Utilizado por editormapfile.js
//

/*
Function: editorComport

Abre o editor das op&ccedil;&otilde;es que controlam o comportamento do layer no mapa

<PEGACOMPORT>
*/
function editorComport(codigoMap,codigoLayer)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaComport&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorComport");
}
function montaEditorComport(dados)
{
	var temp = function(){
		salvarDadosEditor('comport',dados.codigoMap,dados.codigoLayer,false);
	};
	core_montaEditor(temp,"450px","650px","","Comportamento",true,true,false);
	var param = {
		"linhas":[
			{ajuda:"Define o estado atual da camada. Geralmente modificado pelo pr&oacute;prio MapServer. Default ativa a camada permanentemente.",
			titulo:"Status",id:"",value:dados.status,tipo:"text",div:"<div id=cStatus ></div>"},
			{ajuda:"Indica se o tema ir&aacute; ser mostrado na ferramenta de identifica&ccedil;&atilde;o",
			titulo:"Identifica (IDENTIFICA)",id:"",value:dados.identifica,tipo:"text",div:"<div id=cIdentifica ></div>"},
			{ajuda:"Define o n&iacute;vel de opacidade (ou a inabilidade de ver atrav&eacute;s da camada) de todos os pixeis classificados para uma dada camada. O valor pode ser um n&uacute;mero inteiro entre 0 e 100 ou o s&iacute;mbolo nomeado  ALPHA . Um valor de 100 &eacute; opaco e 0 &eacute; completamente transparente. O s&iacute;mbolo  ALPHA  direciona o MapServer para honrar a transpar&ecirc;ncia dos s&iacute;mbolos utilizados como pixmap no estilo de uma camada. Isso s&oacute; &eacute; necess&aacute;rio no caso de formatos de sa&iacute;da RGB, e deve ser usado somente quando necess&aacute;rio pois &eacute; dispendioso renderizar s&iacute;mbolos transparentes como pixmap em um mapa de imagem RGB.",
			titulo:"Opacity",id:"opacity",value:dados.opacity,tipo:"text"},
			{ajuda:"Indica se a extens&atilde;o geogr&aacute;fica do mapa deve ser alterada quando o tema for adicionado ao mapa",
			titulo:"Aplica extensao (APLICAEXTENSAO)",id:"",value:dados.aplicaextensao,tipo:"text",div:"<div id=cAplicaextensao ></div>"},
			{ajuda:"Indica se o usu&aacute;rio pode incluir coment&aacute;rios no tema",
			titulo:"Permite comentar (PERMITECOMENTARIO)",id:"",value:dados.permitecomentario,tipo:"text",div:"<div id=cPermitecomentario ></div>"},
			{ajuda:"Temporizador (em segundos) para atualiza&ccedil;&atilde;o autom&aacute;tica da camada. A camada ser&aacute; redesenhada continuamente a cada intervalo de tempo definido",
			titulo:"Temporizador em segundos (METADATA: TEMPORIZADOR)",id:"temporizador",value:dados.temporizador,tipo:"text"},
			{ajuda:"Indica se as classes ser&atilde;o mostradas ou n&atilde;o na legenda. Por padr&atilde;o &eacute; SIM. ",
			titulo:"Classe (CLASSE)",id:"",value:dados.classe,tipo:"text",div:"<div id=cClasse ></div>"},
			{ajuda:"URL de uma imagem que ser&aacute; utilizada em substitui&ccedil;&atilde;o à gera&ccedil;&atilde;o normal da legenda ",
			titulo:"URL da legenda (opcional) (LEGENDAIMG)",id:"legendaimg",value:dados.legendaimg,tipo:"text"},
			{ajuda:"Indica se o tema &eacute; mostrado no mapa mas n&atilde;o nas listas da legenda e na guia 'temas'",
			titulo:"Escondido (ESCONDIDO)",id:"",value:dados.escondido,tipo:"text",div:"<div id=cEscondido ></div>"},
			{ajuda:"Aplica efeitos de transi&ccedil;&atilde;o nas opera&ccedil;&otilde;es de zoom e pan na interface Openlayers",
			titulo:"Efeitos de transi&ccedil;&atilde;o zoom (TRANSITIONEFFECT)",id:"",value:dados.transitioneffect,tipo:"text",div:"<div id=cTransitioneffect ></div>"},
			{ajuda:"Define o padr&atilde;o de cores RGB para tratar como transparente em camadas raster.",
			titulo:"Offsite (R,G,B) (utilize -1,-1,-1 para anular o valor)",id:"offsite",value:dados.offsite,tipo:"text"},
			{ajuda:"Escala m&aacute;xima na qual o LAYER &eacute; desenhado. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
			titulo:"Maxscale (utilize -1 para anular o valor)",id:"maxscale",value:dados.maxscale,tipo:"text"},
			{ajuda:"Escala m&iacute;nima na qual o LAYER &eacute; desenhado. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
			titulo:"Minscale (utilize -1 para anular o valor)",id:"minscale",value:dados.minscale,tipo:"text"},
			{ajuda:"Nome do item na tabela de atributos para utilizar como etiqueta (label).",
			titulo:"Labelitem",id:"labelitem",value:dados.labelitem,tipo:"text"},
			{ajuda:"Escala m&aacute;xima na qual a LABEL &eacute; desenhada. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
			titulo:"Labelmaxscale (utilize -1 para anular o valor)",id:"labelmaxscale",value:dados.labelmaxscale,tipo:"text"},
			{ajuda:"Escala m&iacute;nima na qual a LABEL &eacute; desenhada. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
			titulo:"Labelminscale (utilize -1 para anular o valor)",id:"labelminscale",value:dados.labelminscale,tipo:"text"},
			{ajuda:"A escala na qual s&iacute;mbolos e/ou textos aparecem em tamanho total. Isso permite alterar dinamicamente a escala de objetos de acordo com a escala do mapa. Se n&atilde;o for definido, ent&atilde;o o objeto sempre aparecer&aacute; no mesmo tamanho. Essa opera&ccedil;&atilde;o s&oacute; ocorre dentro dos limites de MINSIZE e MAXSIZE como descrito acima. A escala &eacute; dada como o denominador da fra&ccedil;&atilde;o da escala. Por exemplo, para uma mapa na escala 1:24,000 use 24000.",
			titulo:"Symbolscale (utilize -1 para anular o valor)",id:"symbolscale",value:dados.symbolscale,tipo:"text"},
			{ajuda:"Sensibilidade para consultas baseadas em pontos (por exemplo, via mouse e/ou coordenadas do mapa). Dada em TOLERANCEUNITS. Se a camada for um ponto ou uma linha, o padr&atilde;o &eacute; 3. Para todos os outros tipos de camada, o padr&atilde;o &eacute; 0. Para restringir pesquisas por pol&iacute;gonos para que o ponto ocorra dentro do pol&iacute;gono defina a toler&acirc;ncia como 0.",
			titulo:"Tolerance",id:"tolerance",value:dados.tolerance,tipo:"text"},
			{ajuda:" ",
			titulo:"Tolerance units",id:"",value:dados.toleranceunits,tipo:"text",div:"<div id=cToleranceunits ></div>"},
			{ajuda:"Define as unidades de valores do par&acirc;metro SIZE do objeto CLASS (padr&atilde;o &eacute; pixeis). &Uacute;til para simular um buffer.",
			titulo:"Sizeunits",id:"",value:dados.sizeunits,tipo:"text",div:"<div id=cSizeunits ></div>"}
		]
	};
	var ins = "";
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	if($i("cAplicaextensao")){
		temp = "<select id='aplicaextensao' >";
		temp += core_combosimnao(dados.aplicaextensao);
		temp += "</select>";
		$i("cAplicaextensao").innerHTML = temp;
	}
	if($i("cPermitecomentario")){
		temp = "<select id='permitecomentario' >";
		temp += core_combosimnao(dados.permitecomentario);
		temp += "</select>";
		$i("cPermitecomentario").innerHTML = temp;
	}
	if($i("cClasse")){
		temp = "<p><select id='classe' >";
		temp += core_combosimnao(dados.classe);
		temp += "</select>";
		$i("cClasse").innerHTML = temp;
	}
	if($i("cEscondido")){
		temp = "<select id='escondido' >";
		temp += core_combosimnao(dados.escondido);
		temp += "</select>";
		$i("cEscondido").innerHTML = temp;
	}
	if($i("cIdentifica")){
		temp = "<select id='identifica' >";
		temp += core_combosimnao(dados.identifica);
		temp += "</select>";
		$i("cIdentifica").innerHTML = temp;
	}
	if($i("cTransitioneffect")){
		temp = "<select id='transitioneffect' >";
		temp += core_combosimnao(dados.transitioneffect);
		temp += "</select>";
		$i("cTransitioneffect").innerHTML = temp;
	}
	temp = "<select id='status' >";
	temp += core_comboObjeto(objstatus,"valor","texto",dados.status);
	temp += "</select>";
	$i("cStatus").innerHTML = temp;

	temp = "<select id='sizeunits' >";
	temp += core_comboObjeto(objmapunits,"valor","texto",dados.sizeunits);
	temp += "</select>";
	$i("cSizeunits").innerHTML = temp;
	temp = "<select id='toleranceunits' >";
	temp += core_comboObjeto(objmapunits,"valor","texto",dados.toleranceunits);
	temp += "</select>";
	$i("cToleranceunits").innerHTML = temp;
}

