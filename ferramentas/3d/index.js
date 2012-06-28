
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: 3d

Gera um arquivo no formato WRL conforme a extensão geogr&aacute;fica do mapa atual. A imagem do mapa atual &eacute; sobreposta ao modelo
3d. Para obter os valores de Z e compor o modelo 3d, utiliza-se por default o LAYER definido no mapfile i3geo/temasaplic/3dmap
O usu&aacute;rio pode escolher um tema existente no mapa atual ao inv&eacute;s do default.
A obten&ccedil;ão do valor de Z &eacute; feita com base no valor de cor do p&iacute;xel do LAYER e não no valor real da altimetria.

Veja:

<i3GEO.mapa.dialogo.t3d>

Arquivo:

i3geo/ferramentas/3d/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/

if(typeof(i3GEOF) === 'undefined'){
	i3GEOF = [];
}
/*
Classe: i3GEOF.t3d

Gera um arquivo para visualiza&ccedil;ão em 3d com o mapa atual.
*/
i3GEOF.t3d = {
	/*
	Variavel: aguarde
	
	Objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
	*/
	aguarde: "",
	/*
	Propriedade: dmap
	
	Arquivo mapfile que cont&eacute;m o layer que ser&aacute; utilizado para a obten&ccedil;ão dos valores  de Z.
	O arquivo deve ficar armazenado em i3geo/aplicmap
	
	Tipo:
	{string}
	
	Default:
	{3dmap.map}
	*/
	dmap: "3dmap.map",

	/*
	Function: inicia
	
	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante.
	
	Parametro:
	
	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
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
	
	Gera o c&oacute;digo html para apresenta&ccedil;ão das op&ccedil;&otilde;es da ferramenta
	
	Retorno:
	
	String com o c&oacute;digo html
	*/
	html:function(){
		var ins =	'<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;" id="i3GEO3dresultado" >';
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
			"220px",
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
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.t3d.t0()") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.t3d.t0()");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.t3d.t0()") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.t3d.t0()");}
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
		ins += "<p class='paragrafo' >Para obter um melhor resultado, o mapa &eacute; sempre reduzido para 400x400 pixels'.";
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
	
	O arquivo &eacute; gerado pelo programa ferramentas/3d/3d.php e o resultado &eacute; mostrado em uma nova janela no navegador.
	*/
	criar3d: function(){
	    var raster = "",
	    	p;
	    if ($i("i3GEO3dlistaRaster"))
	    {raster = $i("i3GEO3dlistaRaster").value;}
		p = i3GEO.configura.locaplic+"/ferramentas/3d/3d.php?map3d="+i3GEOF.t3d.dmap+"&fz="+$i("i3GEO3dfz").value+"&temaz="+raster+"&ext="+i3GEO.parametros.mapexten;
	    window.open(p);
	}
};
