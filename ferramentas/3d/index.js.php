<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
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
Class: i3GEOF.t3d

Gera um arquivo para visualização em 3d com o mapa atual.
*/
i3GEOF.t3d = {
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
			$i(iddiv).innerHTML += i3GEOF.t3d.html();
			i3GEOF.t3d.t0();
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
		var ins =	'<div style="top:0px;left:0px;display:block;width:98%;" id="i3GEO3dresultado" >';
		ins +=	'</div>';
		ins +=	'<div style="top:10px;left:0px;display:block;width:98%;color:red" id="i3GEO3dfim" >';
		ins +=	'</div>';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		titulo = "3d <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=7&idajuda=69' >&nbsp;&nbsp;&nbsp;</a>";
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.t3d");
		};
		janela = i3GEO.janela.cria(
			"300px",
			"190px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.t3d",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.t3d.aguarde = $i("i3GEOF.t3d_imagemCabecalho").style;
		i3GEOF.t3d.inicia(divid);
	},
	t0: function()
	{
		var ins = "<p class='paragrafo' >O modelo 3d do mapa ser&aacute; gerado em WRML. Ap&oacute;s o processamento, o arquivo ficar&aacute; dispon&iacute;vel para download.";
		ins += "<p class='paragrafo' > Para ver o arquivo em 3d vc precisar&aacute; de um software espec&iacute;fico.";
		ins += "<p class='paragrafo' > Experimente utilizar o <a href='http://www.parallelgraphics.com/products/cortona/' target=blank >Cortona</a> ou <a href=http://sourceforge.net/projects/flux target=blank >FLUX</a>";
		i3GEO.util.proximoAnterior("","i3GEOF.t3d.t1()",ins,"i3GEOFgradeDePontost0","i3GEO3dresultado");
	},
	t1: function(){
		var ins = "<p class='paragrafo' >O tempo de processamento pode variar em fun&ccedil;&atilde;o do tamanho da imagem do mapa.";
		ins += "<p class='paragrafo' >Para obter um melhor resultado, o mapa é sempre reduzido para 400x400 pixels'.";
		i3GEO.util.proximoAnterior("i3GEOF.t3d.t0()","i3GEOF.t3d.t2()",ins,"i3GEOF.t3d.t1","i3GEO3dresultado");
	},
	t2: function(){
		var ins = "<p class='paragrafo'>Diminuir o exagero vertical em:<br>";
		ins += "<input onclick='javascript:this.select();' id=i3GEO3dfz size=2 class=digitar type=text value=10 /> x ";
	 	ins += "<p class='paragrafo'>Escolha o tema (opcional) com os valores de Z (se existir no mapa):<br>";
	 	ins += "<div id=i3GEO3ddest style=text-align:left ></div><br>";
		ins += "<p class='paragrafo'><input id=i3GEO3dbotao1 size=20 type='buttom' value='Criar modelo 3d' />";
		i3GEO.util.proximoAnterior("i3GEOF.t3d.t1()","",ins,"i3GEOF.t3d.t2","i3GEO3dresultado");
		new YAHOO.widget.Button(
			"i3GEO3dbotao1",
			{onclick:{fn: i3GEOF.t3d.criar3d}}
		);	
		i3GEO.util.comboTemas(
			"i3GEO3dlistaRaster",
			function(retorno){
				$i("i3GEO3ddest").innerHTML = retorno.dados;
				if ($i("i3GEO3dlistaRaster")){
					$i("i3GEO3ddest").style.display="block";
				}
	 		},
	 		"i3GEO3ddest",
	 		"",
	 		false,
	 		"raster"
	 	);
	},
	/*
	Function: criar3d
	
	Abre uma nova janela no navegador para criar o arquivo 3d
	*/
	criar3d: function(){
	    var raster = "",
	    	p;
	    if ($i("i3GEO3dlistaRaster"))
	    {raster = $i("i3GEO3dlistaRaster").value;}
		p = i3GEO.configura.locaplic+"/ferramentas/3d/3d.php?map3d="+g_3dmap+"&fz="+$i("i3GEO3dfz").value+"&temaz="+raster;
	    window.open(p);
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>