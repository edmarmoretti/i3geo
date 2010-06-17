<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Carrega mapa salvo

Envia um mapfile armazenado localmente para o servidor do i3Geo. O mapa deve ter sido salvo com a ferramenta
de salvar mapa.
Ao enviar o arquivo, um novo diretório temporário é criado e o mapa é iniciado. Ao reiniciar o mapa, os layers locais são eliminados.
O envio e processamento do mapa é feito pelo programa i3geo/ferramentas/carregamapa/upload.php

Veja:

<i3GEO.mapa.dialogo.carregaMapa>

Arquivo: i3geo/ferramentas/carregamapa/index.js.php

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
if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Classe: i3GEOF.carregaMapa
*/
i3GEOF.carregaMapa = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		try{
			$i(iddiv).innerHTML += i3GEOF.carregaMapa.html();
			new YAHOO.widget.Button(
				"i3GEOcarregamapabotao1",
				{onclick:{fn: i3GEOF.carregaMapa.submete}}
			);
		}
		catch(erro){alert(erro);}
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var ins = '';
		ins += '<p class="paragrafo" >Digite o nome do arquivo .map (não utilize espaço em branco ou caracteres acentuados) ou busque com o navegador de arquivos:';
		ins += '<br><br>';
		ins += '<form id=i3GEOcarregamapaf target="i3GEOcarregamaiframe" action="'+i3GEO.configura.locaplic+'/ferramentas/carregamapa/upload.php" method="post" ENCTYPE="multipart/form-data">';
		ins += '<p class="paragrafo" ><input id="i3GEOcarregamapafilemap" class=digitar type="file" size=42 name="i3GEOcarregamapafilemap" style="top:0px;left:0px">';
		ins += '<br><br>';
		ins += '<p class="paragrafo" ><input id=i3GEOcarregamapabotao1 type="button" value="Carregar arquivo" size=12 name="submit">';
		ins += '<input type=hidden name=g_sid value="'+i3GEO.configura.sid+'" >';
		ins += '<input type="hidden" name="MAX_FILE_SIZE" value="10000">';
		ins += '<input type=hidden id=i3GEOcarregamapanomearq name=i3GEOcarregamapanomearq value="" >';
		ins += '</form>';
		ins += '<iframe name=i3GEOcarregamaiframe width="280px" height="60px"></iframe>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo;
		titulo = "Carrega mapa <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=2&idajuda=11' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"340px",
			"240px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.carregaMapa",
			true,
			"hd"
		);
		divid = janela[2].id;
		i3GEOF.carregaMapa.aguarde = $i("i3GEOF.carregaMapa_imagemCabecalho").style;
		i3GEOF.carregaMapa.inicia(divid);
	},
	/*
	Function: submete
	
	Envia o arquivo para o servidor
	*/
	submete: function(){
		i3GEOF.carregaMapa.aguarde.visibility="visible";
		$i("i3GEOcarregamapanomearq").value = $i("i3GEOcarregamapafilemap").value;
		$i("i3GEOcarregamapaf").submit();
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>