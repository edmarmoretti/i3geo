/*
Function: editorClasseLabel

Abre o editor dos labels de um layer

<PEGACLASSELABEL>
*/
function editorClasseLabel(codigoMap,codigoLayer,indiceClasse)
{
	var sUrl = "../php/editormapfile.php?funcao=pegaClasseLabel&codigoMap="+codigoMap+"&codigoLayer="+codigoLayer+"&indiceClasse="+indiceClasse;
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorClasseLabel");
}

function montaEditorClasseLabel(dados)
{
	var temp = function(){
		salvarDadosEditor('classeLabel',dados.codigoMap,dados.codigoLayer,dados.indiceClasse);
	};
	core_montaEditor(temp,"450px","500px","","Label",true,true,false);
	var param = {
		"linhas":[
		{ajuda:"Cor com a qual o texto ser&aacute; desenhado. [ATRIBUTO] especifica o nome do item na tabela de atributos para usar como valores de cor. Os colchetes [] s&atilde;o necess&aacute;rios. Por exemplo, se o DBF do seu shapefile tem um campo chamado &#8220;MYCOLOR&#8221; o objeto LABEL deve conter: LABEL &#8594; COLOR [MYCOLOR].",
		titulo:"Color",id:"color",value:dados.color,tipo:"cor"},
		{ajuda:"Tamanho do texto. Use um n&uacute;mero inteiro para dar o tamanho e pixeis da sua fonte TrueType, ou qualquer outra das 5 palavras para fontes bitmap. Quando a escala de s&iacute;mbolos e utilizada, SIZE representa o tamanho da fonte a ser usada com o mapa na escala 1:SYMBOLSCALEDENOM. [ATRIBUTO] especifica o nome do item na tabela de atributos para usar como valores de tamanho. Os colchetes [] s&atilde;o necess&aacute;rios. Por exemplo, se o DBF do seu shapefile tem um campo chamado &#8220;MYSIZE&#8221; o objeto LABEL deve conter: LABEL &#8594; SIZE [MYSIZE].",
		titulo:"Size",id:"size",value:dados.size,tipo:"text"},
		{ajuda:"Posi&ccedil;&atilde;o da label relativa ao ponto de etiquetagem (somente para camadas). A primeira letra &eacute; a posi&ccedil;&atilde;o Y, a segunda letra &eacute; a posi&ccedil;&atilde;o X. Auto diz ao MapServer para calcular a posi&ccedil;&atilde;o que n&atilde;o vai interferir com as outras labels. Com pontos e pol&iacute;gonos, o MapServer seleciona uma das 8 posi&ccedil;&otilde;es exteriores (ou seja, exclui a op&ccedil;&atilde;o cc). Com linhas, s&oacute; &eacute; utilazando lc ou uc, at&eacute; que ele use uma posi&ccedil;&atilde;o que n&atilde;o colida com labels que j&aacute; tenham sido desenhadas. Se todas as posi&ccedil;&otilde;es causarem conflitos, ent&atilde;o a label n&atilde;o &eacute; desenhada (a n&atilde;o ser que o par&acirc;metro FORCE esteja habilitado). O posicionamento AUTO s&oacute; &eacute; permitido com labels em cache.",
		titulo:"Position",id:"position",value:dados.position,tipo:"text"},
		{ajuda:"Espa&ccedil;o livre, em pixeis, ao redor das labels. &Uacute;til para manter um espa&ccedil;o ao redor do texto para melhorar a leitura. S&oacute; &eacute; permitido com labels em cache. Padr&atilde;o &eacute; 0.",
		titulo:"Buffer",id:"buffer",value:dados.buffer,tipo:"text"},
		{ajuda:"Apelido da fonte (como definido em FONTSET) para usar nas labels. [ATRIBUTO] especifica o campo para o apelido da fonte. Pode conter uma lista de fontes para ser usada como recupera&ccedil;&atilde;o para fontes que n&atilde;o suportam grifos, sendo o m&aacute;ximo de fontes de reserva definido em MS_MAX_LABEL_FONTS (geralmente 5). Se especificada diretamente, n&atilde;o se esque&ccedil;a de incluir a lista citada entre aspas.",
		titulo:"Font",id:"",value:dados.font,tipo:"text",div:"<div id=cFont ></div>"},
		{ajuda:"Tipo de fonte a ser usado. Geralmente fontes bitmap s&atilde;o mais r&aacute;pidas de se desenhar do que fontes TrueType. No entanto, fontes TrueType s&atilde;o pass&iacute;veis de serem usadas com escala e dispon&iacute;veis em uma variedade de tipos. N&atilde;o se esque&ccedil;a de acionar o par&acirc;metro FONT se voc&ecirc; selecionar TrueType.",
		titulo:"Type",id:"",value:dados.type,tipo:"text",div:"<div id=cType ></div>"},
		{ajuda:"O texto pode cruzar o limite do mapa? Padr&atilde;o &eacute; true.",
		titulo:"Partials",id:"",value:dados.partials,tipo:"text",div:"<div id=cPartials ></div>"},
		{ajuda:"For&ccedil;a as labels para uma classe em particular ativada, independente de colis&otilde;es. Dispon&iacute;vel somente para labels em cache. Padr&atilde;o &eacute; false. Se FORCE est&aacute; ligado e PARTIALS desligado, FORCE toma prefer&ecirc;ncia e labels parciais s&atilde;o desenhadas.",
		titulo:"Force",id:"",value:dados.force,tipo:"text",div:"<div id=cForce ></div>"},
		{ajuda:"Cor a ser desenhado o ret&acirc;ngulo de fundo. Desligado por padr&atilde;o.",
		titulo:"Backgroundcolor",id:"backgroundcolor",value:dados.backgroundcolor,tipo:"cor"},
		{ajuda:"Cor a ser desenhada a sombra do ret&acirc;ngulo de fundo. Desligado por padr&atilde;o.",
		titulo:"Backgroundshadowcolor",id:"backgroundshadowcolor",value:dados.backgroundshadowcolor,tipo:"cor"},
		{ajuda:"Cor a ser desenhado o contorno de 1 pixel ao redor dos caracteres no texto.[ATRIBUTO] especifica o nome do item na tabela de atributos para usar como valores de cor de contorno. Os colchetes [] s&atilde;o necess&aacute;rios. Por exemplo, se o DBF do seu shapefile tem um campo chamado &#8220;MYOUTCOLOR&#8221; o objeto LABEL deve conter: LABEL &#8594; OUTLINECOLOR [MYOUTCOLOR].",
		titulo:"Outlinecolor",id:"outlinecolor",value:dados.outlinecolor,tipo:"cor"},
		{ajuda:"Cor da sombra. Uma label com o mesmo texto ser&aacute; desenhada nesta cor antes da label principal, resultando num efeito de sombra nos caracteres da label. O deslocamento da sombra desenhada &eacute; definido em SHADOWSIZE.",
		titulo:"Shadowcolor",id:"shadowcolor",value:dados.shadowcolor,tipo:"text"},
		{ajuda:"Deslocamento da sombra no eixo x em pixeis.",
		titulo:"Shadowsizex",id:"shadowsizex",value:dados.shadowsizex,tipo:"text"},
		{ajuda:"Deslocamento da sombra no eixo y em pixeis.",
		titulo:"Shadowsizey",id:"shadowsizey",value:dados.shadowsizey,tipo:"text"},
		{ajuda:"Valor do deslocamento do ret&acirc;ngulo de fundo da sombra no eixo x. Padr&atilde;o &eacute; 1.",
		titulo:"Backgroundshadowsizex",id:"backgroundshadowsizex",value:dados.backgroundshadowsizex,tipo:"text"},
		{ajuda:"Valor do deslocamento do ret&acirc;ngulo de fundo da sombra no eixo y. Padr&atilde;o &eacute; 1.",
		titulo:"Backgroundshadowsizey",id:"backgroundshadowsizey",value:dados.backgroundshadowsizey,tipo:"text"},
		{ajuda:"Tamanho m&iacute;nimo da fonte (pixeis) para usar quando desenhando textos conforme a escala. Padr&atilde;o &eacute; 4.",
		titulo:"Minsize",id:"minsize",value:dados.minsize,tipo:"text"},
		{ajuda:"Tamanho m&aacute;ximo da fonte (pixeis) para usar quando desenhando textos conforme a escala. Padr&atilde;o &eacute; 256.",
		titulo:"Maxsize",id:"maxsize",value:dados.maxsize,tipo:"text"},
		{ajuda:"Valor de deslocamento no eixo X para labels, relativo ao canto inferior esquerdo da label e do ponto de etiquetagem. Dado em pixeis. No caso de testo rotacionado, especificar os valores como se todas as labels fossem horizontais e qualquer rota&ccedil;&atilde;o ser&aacute; compensada.",
		titulo:"Offsetx",id:"offsetx",value:dados.offsetx,tipo:"text"},
		{ajuda:"Valor de deslocamento no eixo X para labels, relativo ao canto inferior esquerdo da label e do ponto de etiquetagem. Dado em pixeis. No caso de testo rotacionado, especificar os valores como se todas as labels fossem horizontais e qualquer rota&ccedil;&atilde;o ser&aacute; compensada.",
		titulo:"Offsety",id:"offsety",value:dados.offsety,tipo:"text"},
		{ajuda:"&Acirc;ngulo, em graus, para desenhar as labels. AUTO permite ao MapServer computar o &acirc;ngulo. V&aacute;lido somente para camadas do tipo linha. AUTO2 &eacute; igual ao AUTO, exceto que nenhuma l&oacute;gica &eacute; aplicada para tentar manter o texto numa orienta&ccedil;&atilde;o de leitura (ou seja, o texto pode ser desenhado de cabe&ccedil;a para baixo). &Uacute;til quando se adiciona textos de seta para indicar a dire&ccedil;&atilde;o da linha. FOLLOW diz ao MapServer para computar uma label curva para fei&ccedil;&otilde;es lineares apropriadas.[ATRIBUTO] especifica o nome do item na tabela de atributos para se usar como valores de &acirc;gulo. Os colchetes [] s&atilde;o necess&aacute;rios. Por exemplo, se o DBF do seu shapefile tem um campo chamado &#8220;MYANGLE&#8221; o objeto LABEL deve conter: LABEL &#8594; ANGLE [MYANGLE].",
		titulo:"Angle (utilize MS_FOLLOW para textos curvos)",id:"angle",value:dados.angle,tipo:"text"},
		{ajuda:"C&aacute;lculo autom&aacute;tico do &acirc;ngulo quando os elementos forem lineares",
		titulo:"Autoangle",id:"",value:dados.angle,tipo:"text",div:"<div id=cAutoangle ></div>"},
		{ajuda:"Ativa ou desativa o antialias. Note que isto requere mais cores dispon&iacute;veis, diminui a performance e resulta em imagens de sa&iacute;da bem maiores. S&oacute; &eacute; &uacute;til para desenhos em gif. Padr&atilde;o &eacute; falso. N&atilde;o tem efeito para outros processamentos (nos quais o antialias n&atilde;o pode ser desligado).",
		titulo:"Antialias",id:"antialias",value:dados.antialias,tipo:"text"},
		{ajuda:"Caractere que define a condi&ccedil;&atilde;o de fim de linha num texto de label, resultando numa label de m&uacute;ltiplas linhas. Interage com MAXLENGHT para defini&ccedil;&atilde;o condicional de quebra de linha ap&oacute;s um dado n&uacute;mero de caracteres.",
		titulo:"Wrap",id:"wrap",value:dados.wrap,tipo:"text"},
		{ajuda:"Tamanho m&iacute;nimo que uma fei&ccedil;&atilde;o deve ter para ser etiquetada. Dado em pixeis. Para dados do tipo linha o comprimento geral da linha exibida &eacute; usada. Para pol&iacute;gonos, a menor dimens&atilde;o da caixa circundante &eacute; usada. AUTO diz ao MapServer s&oacute; etiquetar fei&ccedil;&otilde;es que s&atilde;o maiores do que sua respectiva label. Dispon&iacute;vel somente para labels em cache.",
		titulo:"Minfeaturesize",id:"minfeaturesize",value:dados.minfeaturesize,tipo:"text"},
		{ajuda:"Dist&acirc;ncia m&iacute;nima entre labels duplicadas. Dada em pixeis.",
		titulo:"Mindistance",id:"mindistance",value:dados.mindistance,tipo:"text"},
		{ajuda:"Formato de codifica&ccedil;&atilde;o suportado para ser usado para as labels. Se o formato n&atilde;o for suprotado, a label n&atilde;o ser&aacute; desenhada. Requer a biblioteca iconv (presente na maior parte dos sistemas). A biblioteca &eacute; sempre detectada se estiver presente no sistema, mas, se n&atilde;o for, a label n&atilde;o ser&aacute; desenhada. Necess&aacute;rio para exibi&ccedil;&atilde;o de caracteres internacionais. Mais informa&ccedil;&otilde;es podem ser encontradas em: http://www.foss4g.org/FOSS4G/MAPSERVER/mpsnf-i18n-en.html.",
		titulo:"Encoding",id:"encoding",value:dados.encoding,tipo:"text"}
		]
	};
	var ins = "";
	if(dados.colunas != "")
	{
		//ins += "<p>O layer possu&iacute; as seguintes colunas na tabela de atributos: ";
		//ins += dados.colunas+"</p>";
	}
	ins += core_geraLinhas(param);
	ins += "<br><br><br>";
	$i("editor_bd").innerHTML = ins;

	temp = "<select id='font' >";
	temp += core_comboObjeto(dados.fontes,"","",dados.font);
	temp += "</select>";
	$i("cFont").innerHTML = temp;

	temp = "<select id='type' >";
	temp += core_comboObjeto(objfonttypes,"valor","texto",dados.type);
	temp += "</select>";
	$i("cType").innerHTML = temp;

	temp = "<select id='partials' >";
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.partials);
	temp += "</select>";
	$i("cPartials").innerHTML = temp;

	temp = "<select id='force' >";
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.force);
	temp += "</select>";
	$i("cForce").innerHTML = temp;

	temp = "<select id='autoangle' >";
	temp += core_comboObjeto(objbool_tf,"valor","texto",dados.autoangle);
	temp += "</select>";
	$i("cAutoangle").innerHTML = temp;
}
