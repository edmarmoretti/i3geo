/*
Title: Ferramentas

Abre ou executa determinadas operações de manipulação do mapa.

Normalmente, as funções abrem uma janela interna no i3geo

File: ferramentas.js

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
/*
Section: propriedades do mapa
*/
/*
Function: temporizador

Define o intervalo de tempo para redesenho automático do mapa.
*/
function autoredesenha()
{wdocaf("300px","180px",g_locaplic+"/ferramentas/opcoes_autoredesenha/index.htm","","","Temporizador");}
/*
Function: salvaMapa

Salva o map file localmente
*/
function salvaMapa()
{wdocaf("300px","180px",g_locaplic+"/ferramentas/salvamapa/index.htm","","","Salva mapa");}
/*
Function: carregaMapa

Carrega um map file salvo
*/
function carregaMapa()
{wdocaf("300px","150px",g_locaplic+"/ferramentas/carregamapa/index.htm?urlatual="+window.location,"","","Carrega mapa");}
/*
Function: convertews

Converte mapa em web service
*/
function convertews()
{wdocaf("440px","280px",g_locaplic+"/ferramentas/convertews/index.htm","","","Web service");}
/*
Function: queryMap

Altera as propriedades da exibição dos elementos selecionados.
*/
function queryMap()
{wdocaf("210px","170px",g_locaplic+"/ferramentas/opcoes_querymap/index.htm","","","Querymap");}
/*
Function: template

Muda o template do mapa atual.
*/
function template()
{wdocaf("300px","400px",g_locaplic+"/ferramentas/template/index.htm","","","Template");}
/*
Function: ativaLogo

Ativa ou desativa a logo marca.

*/
function ativaLogo()
{
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=ativalogo&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"ativalogo",ajaxredesenha);
}
/*
Function: tamanho

Muda o tamanho do mapa
*/
function tamanho()
{wdocaf("150px","170px",g_locaplic+"/ferramentas/opcoes_tamanho/index.htm","","","Tamanho");}
/*
Function: tipoimagem

Define um filtro sobre a imagem gerada alterando susas características
*/
function tipoimagem()
{wdocaf("300px","200px",g_locaplic+"/ferramentas/tipoimagem/index.htm","","","Tipo de imagem");}
/*
Function: corFundo

Altera a cor do fundo atual.
*/
function corFundo()
{wdocaf("210px","170px",g_locaplic+"/ferramentas/opcoes_fundo/index.htm","","","Fundo");}
/*
Section: propriedades de um tema
*/
/*
Function: destacaTema

Cria imagem de destaque

Parameters:

tema - id ue identifica o tema no map file.
*/
function destacaTema(tema)
{
	if ($i("img_d"))
	{$i("img_d").src = "";}
	if ($i(objmapa.guiaTemas+"obj"))
	{
		var iguias = $i(objmapa.guiaTemas+"obj").getElementsByTagName("input");
		for (i=0;i<iguias.length; i++)
		{
			if ((iguias[i].type == "checkbox") && (iguias[i].value == tema) && (iguias[i].checked == true))
			{alert("Desligue o tema antes de destacar");return;}
		}
	}
	objaguarde.abre("ajaxdestaca","Aguarde...gerando imagem");
	g_destaca = tema;
	var p =g_locaplic+"/classesphp/mapa_controle.php?funcao=geradestaque&tema="+tema+"&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"geraDestaque",ajaxdestaca);
	if ($i("img"))
	{$i("img").title = "utilize as teclas +- para mudar o tamanho do destaque";}
}
/*
Function: excluitemaf

Exclui um tema do mapa

Parameters:

celula - objeto que foi clicado nas opções de um tema.
*/
function excluitemaf(tema)
{
	g_operacao = "excluitema";
	//remove o tema do DOM e seus filhos
	var p = document.getElementById("idx"+tema).parentNode.parentNode.parentNode;
	do
	{
		p.removeChild(p.childNodes[0]);
	} while (p.childNodes.length > 0);
	p.parentNode.removeChild(p);
	objaguarde.abre("ajaxredesenha","Aguarde...");
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=excluitema&temas="+tema+"&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"excluiTemas",ajaxredesenha);
	objmapa.temaAtivo = "";
}
/*
Function: sobetemaf

Sobe um tema na ordem de desenho

Parameters:

celula - objeto que foi clicado nas opções de um tema.
*/
function sobetemaf(tema)
{
	objaguarde.abre("ajaxredesenha","Aguarde...");
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=sobetema&tema="+tema+"&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"sobeTema",ajaxredesenha);
}
/*
Function: descetemaf

Desce um tema na ordem de desenho

Parameters:

celula - objeto que foi clicado nas opções de um tema.
*/
function descetemaf(tema)
{
	objaguarde.abre("ajaxredesenha","Aguarde...");
	var p = g_locaplic+"/classesphp/mapa_controle.php?&funcao=descetema&tema="+tema+"&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2)
	cp.set_response_type("JSON");
	cp.call(p,"desceTema",ajaxredesenha);
}
/*
Function: zoomtemaf

Zoom para o tema

Parameters:

celula - objeto que foi clicado nas opções de um tema.
*/
function zoomtemaf(tema)
{
	objaguarde.abre("ajaxredesenha","Aguarde...");
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=zoomtema&tema="+tema+"&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2);
	cp.set_response_type("JSON");
	cp.call(p,"zoomTema",ajaxredesenha);
}
/*
Function: limpaseltemaf

Limpa a selecao do tema

Parameters:

celula - objeto que foi clicado nas opções de um tema. Passado para a função pegatema.
*/
function limpaseltemaf(celula)
{
	g_operacao = "limpasel";
	objaguarde.abre("ajaxredesenha","Aguarde...");
	var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=limpasel&tema="+pegaTema(celula)+"&g_sid="+g_sid;
	var cp = new cpaint();
	//cp.set_debug(2);
	cp.set_response_type("JSON");
	cp.call(p,"selecaoLimpa",ajaxredesenha);
}
/*
Function: mudatranspf

Muda a transparencia de um tema

Parameters:

celula - objeto que foi clicado nas opções de um tema. Passado para a função pegatema.
*/
function mudatranspf(idtema)
{
	g_operacao = "transparencia";
	//o campo input com o valor possui o prefixo 'tr' seguido pelo código do tema
	if ($i("tr"+idtema))
	{var valor = $i("tr"+idtema).value;}
	else
	{alert("Ocorreu um erro");}
	if (valor != "")
	{
		objaguarde.abre("ajaxredesenha","Aguarde...");
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudatransp&tema="+idtema+"&valor="+valor+"&g_sid="+g_sid;
		var cp = new cpaint();
		//cp.set_debug(2)
		cp.set_response_type("JSON");
		cp.call(p,"mudaTransparencia",ajaxredesenha);
	}
	else
	{alert("Valor não definido.");}
}
/*
Function: mudanomef

Muda o nome de um tema

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function mudanomef(idtema)
{
	g_operacao = "mudanome";
	if($i("nn"+idtema))
	{var valor = $i("nn"+idtema).value;}
	else
	{alert("Ocorreu um erro");}
	if (valor != "")
	{
		var p = $i("nometema"+idtema);
		$i("nometema"+idtema).innerHTML = valor;
		//valor = htmlAcentos(valor);
		objaguarde.abre("ajaxredesenha","Aguarde...");
		var p = g_locaplic+"/classesphp/mapa_controle.php?funcao=mudanome&tema="+idtema+"&valor="+valor+"&g_sid="+g_sid;
		var cp = new cpaint();
		//cp.set_debug(2);
		cp.set_response_type("JSON");
		cp.call(p,"mudaNome",ajaxredesenha);
	}
	else
	{alert("Nome não definido");}
}
/*
Function: toponimiaf

Opções de toponímia de um tema.

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function toponimiaf(idtema)
{wdocaf("350px","340px",g_locaplic+"/ferramentas/toponimia/index.htm?tema="+idtema,"","","Topon&iacute;mia");}
/*
Function: filtrof

Opções de filtragem de um tema.

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function filtrof(idtema)
{wdocaf("480px","250px",g_locaplic+"/ferramentas/filtro/index.htm?tema="+idtema,"","","Filtro");}
/*
Section: análise geográfica
*/
/*
Function: pontosdistri

Análises de distribuição de pontos
*/
function pontosdistri()
{
	//a variável g_r indica se o R está instalado no servidor e é definida na inicialização do I3Geo
	if (g_r == "nao")
	{alert("Opção não disponível");}
	else
	{wdocaf("400px","300px",g_locaplic+"/ferramentas/pontosdistri/index.htm","","","Distribui&ccedil;&atilde;o de pontos");}
}

/*
Function: pontoempoligono

Cruza um tema de pontos com um ou mais temas poligonais e gera um novo tema
*/
function pontoempoligono()
{wdocaf("400px","250px",g_locaplic+"/ferramentas/pontoempoligono/index.htm","","","Ponto em pol&iacute;gono");}
/*
Function: nptPol

Cruza um tema de pontos com um ou tema poligona e gera um novo tema com o número de pontos em cada polígono
*/
function nptPol()
{wdocaf("400px","200px",g_locaplic+"/ferramentas/nptpol/index.htm","","","Pontos por pol&iacute;gono");}
/*
Function: buffer

Gera um buffer em elementos selecionados
*/
function buffer()
{wdocaf("400px","180px",g_locaplic+"/ferramentas/buffer/index.htm","","","Entorno");}
/*
Function: centroide

Gera um tema com os centroides dos elementos selecionados
*/
function centroide()
{wdocaf("400px","180px",g_locaplic+"/ferramentas/centroide/index.htm","","","Centróide");}
/*
Function: analisaGeometrias

Sistema de análise de geometrias
*/
function analisaGeometrias()
{
	g_tipoacao = "selecao";
	mudaiconf("selecao");
	pontosdistobj = new pontosdist();
	objmapa.temaAtivo = "";
	wdocaf("500px","400px",g_locaplic+'/ferramentas/analisageometrias/index.htm',"","","Sele&ccedil;&atilde;o");
}
/*
Section: grades
*/
/*
Function: gradePontos

Gera grade de pontos
*/
function gradePontos()
{wdocaf("400px","250px",g_locaplic+"/ferramentas/gradepontos/index.htm","","","Grade de pontos");}
/*
Function: gradePoligonos

Gera grade de poligonos
*/
function gradePol()
{wdocaf("400px","250px",g_locaplic+"/ferramentas/gradepol/index.htm","","","Grade de pol&iacute;gonos");}
/*
Function: gradeHex

Gera grade de hexágonos
*/
function gradeHex()
{wdocaf("400px","250px",g_locaplic+"/ferramentas/gradehex/index.htm","","","Grade de hex&aacute;gonos");}

/*
Function: gradeCoord

Gera grade de coordenadas
*/
function gradeCoord()
{wdocaf("300px","180px",g_locaplic+"/ferramentas/gradecoord/index.htm","","","Grade de coordenadas");}
/*
Section: atributos
*/
/*
Function: procuraratribf

Procurar atributos na tabela do tema

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function procuraratribf(idtema)
{wdocaf("550px","340px",g_locaplic+"/ferramentas/busca/index.htm?tema="+idtema,"","","Procurar");}
/*
Function: tabelaf

Abre a tabela de atributos de um tema.

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function tabelaf(idtema)
{wdocaf("500px","400px",g_locaplic+"/ferramentas/tabela/index.htm?tema="+idtema,"","","Tabela");}
/*
Function: etiquetas

Abre a tabela de atributos de um tema.

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function etiquetas(idtema)
{wdocaf("400px","300px",g_locaplic+"/ferramentas/etiqueta/index.htm?tema="+idtema,"","","Etiquetas");}
/*
Section: legenda
*/
/*
Function: opcoesLegenda

Ativa ou desativa a legenda incluida na imagem do mapa e define seus parâmetros.

*/
function opcoesLegenda()
{wdocaf("300px","280px",g_locaplic+"/ferramentas/opcoes_legenda/index.htm","","","Legenda");}
/*
Function: abreCor

Abre a paleta de cores

Parameters:

janela - id da janela que disparou a janela de cores

elemento - elemento da janela que receberá os valores de cor selecionada
*/
function abreCor(janela,elemento)
{wdocaf2("380px","220px",g_locaplic+"/ferramentas/colorpicker/index.htm?doc="+janela+"&elemento="+elemento,"","","Cor");}
/*
Function: editaLegenda

Editor de legenda de um tema

Parameters:

idtema - id que identifica o tema conforme definido no map file
*/
function editaLegenda(idtema)
{wdocaf("490px","340px",g_locaplic+"/ferramentas/legenda/index.htm?tema="+idtema,"","","Legenda");}
/*
Section: adição de temas
*/
/*
Function: navegacaoDir

Adiciona temas navegando pelos diretórios do servidor
*/
function navegacaoDir()
{wdocaf("550px","350px",g_locaplic+"/ferramentas/navegacaodir/index.htm","","","Diret&oacute;rios");}
/*
Function: conectarwms

Adiciona temas tendo como fonte um web service do tipo wms
*/
function conectarwms()
{wdocaf("400px","300px",g_locaplic+"/ferramentas/conectarwms/index.htm","","","WMS");}
/*
Function: conectarwfs

Adiciona temas tendo como fonte um web service do tipo wfs
*/
function conectarwfs()
{wdocaf("400px","300px",g_locaplic+"/ferramentas/conectarwfs/index.htm","","","WFS");}
/*
Function: conectargeorss

Adiciona temas tendo como fonte um georss
*/
function conectargeorss()
{wdocaf("400px","300px",g_locaplic+"/ferramentas/conectargeorss/index.htm","","","GeoRSS");}
/*
Function: abreSistema

Abre um programa definido no menu de sistemas.

A lista de sistemas é lida de um arquivo xml definido no ms_configura.php

Parameters:

endereco - programa que será executado.
w - largura da janela.
h - altura da janela.
*/
function abreSistema(endereco,w,h)
{
	if(endereco != "")
	{wdocaf(w+"px",h+"px",endereco,"","","Sistemas");}
	else
	{alert("Endereço não definido");}
}
/*
Function: upload

Faz o upload de shape file
*/
function upload()
{wdocaf("300px","200px",g_locaplic+"/ferramentas/upload/index.htm","","","Upload");}
/*
Section: outros
*/
/*
Function: pegaimagens

Pega as imagens armazenadas nos quadros e mostra em uma nova janela
*/
function pegaimagens()
{
	if ($i("lugarquadros"))
	{
		//abre uma nova janela do navegador
		if (navm) {var wi = window.open("",null,"width=550,height=650,resizable=yes,scrollbars=yes");}
		if (navn) {var wi = window.open("","Cor","width=550,height=650,resizable,scrollbars");}
		wi.document.write("<p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Click com o bot&atilde;o da direita do mouse sobre a imagem para fazer o download<br>");
		//pega os dados do objeto quadrosfilme e escreve na nova janela
		var mensagem = "<br><b>N&atilde;o existem imagens guardadas.";
		for (i = 1; i < (quadrosfilme.length); i++)
		{
			if (quadrosfilme[i].imagem != " ")
			{
				wi.document.write("<p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Imagem: "+i+"<br>");
				wi.document.write("<p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Abrang&eacute;ncia: "+quadrosfilme[i].extensao+"<br>");
				wi.document.write("<img src="+quadrosfilme[i].imagem+">");
				wi.document.write("<img src="+quadrosfilme[i].referencia+">");
				//wi.document.write("<img src="+quadrosfilme[i].legenda+">");
				//wi.document.write("<img src="+quadrosfilme[i].escala+"><br>");
				mensagem = "<br>Fim"
			}
		}
		wi.document.write(mensagem);
	}
}

/*
Function: abreDoc

Abre a documentacao do sistema.
*/
function abreDoc()
{window.open(g_locaplic+"/documentacao/index.html");}

/*
Function: downloadbase

Lista temas para download
*/
function downloadbase()
{window.open(g_locaplic+"/datadownload.htm");}
/*
Function: download

Faz o download de um tema

Parameters:

idtema - id ue identifica o tema no map file.
*/
function download(idtema)
{wdocaf("300px","150px",g_locaplic+"/ferramentas/download/index.htm?tema="+idtema,"","","Download");}

/*
Function: opcoesQuadros

Opções de animação dos quadros de armazenamento de imagens.
*/
function opcoesQuadros()
{wdocaf("150px","150px",g_locaplic+"/ferramentas/opcoes_quadros/index.htm",objposicaomouse.x - 75,objposicaomouse.y - 160,"Quadros");}
/*
Function: opcoesEscala

Opções da barra de escala.
*/
function opcoesEscala()
{wdocaf("250px","300px",g_locaplic+"/ferramentas/opcoes_escala/index.htm",objposicaomouse.x - 75,objposicaomouse.y - 260,"Escala");}

//testa se esse script foi carregado
function testaferramentas()
{}
