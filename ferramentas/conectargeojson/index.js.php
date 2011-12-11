<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Adiciona um tema ao mapa com base em um arquivo GeoJson existente na Web

O usuário pode escolher o arquivo de uma lista. A lista é obtida do sistema de administração do i3Geo

Veja:

<i3GEO.arvoreDeTemas.dialogo.conectarGeoJson>

Arquivo:

i3geo/ferramentas/conectargeojson/index.js.php

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

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
Classe: i3GEOF.conectargeojson
*/
i3GEOF.conectargeojson = {
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
		if(navm)
		{alert("Não funciona coretamente no Internet Explorer. Use o Firefox ou outro navegador");}
		try{
			$i(iddiv).innerHTML = i3GEOF.conectargeojson.html();
			var monta = function(retorno){
				var raiz,nraiz,i,combo;
				raiz = retorno.data.canais;
				nraiz = raiz.length;
				combo = "<select onchange='javascript:$i(\"i3GEOconectargeojsonurl\").value = this.value;'>";
				combo += "<option value=''>---</option>";
				for (i=0;i<nraiz; i++){
					combo += "<option value='"+raiz[i].link+"'>"+raiz[i].title+"</option>";
				}
				combo += "</select>";
				$i("i3GEOconectargeojsonCombo").innerHTML = combo;
			};
			i3GEO.php.listaRSSwsARRAY(monta,"GEOJSON");
			new YAHOO.widget.Button(
				"i3GEOconectargeojsonbotao1",
				{onclick:{fn: i3GEOF.conectargeojson.adiciona}}
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
		var ins = '' +
		'<p class="paragrafo" >Endereço (URL) do GeoJson (ou escolha da lista):<br><br>' +	
		$inputText("","","i3GEOconectargeojsonurl","",45,"") +
		'<br><br>' +
		'<div id="i3GEOconectargeojsonCombo" style="left:1px;display:block;width:315px;text-align:left;">Aguarde...' +
		'</div>' +
		'<br><br><input id=i3GEOconectargeojsonbotao1 type="buttom" value="Aplicar" />';
		return ins;		
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo;
		//cria a janela flutuante
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.conectargeojson");
		};
		titulo = "GeoJson <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=4&idajuda=106' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"360px",
			"150px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.conectargeojson",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.conectargeojson.aguarde = $i("i3GEOF.conectargeojson_imagemCabecalho").style;
		$i("i3GEOF.conectargeojson_corpo").style.backgroundColor = "white";
		i3GEOF.conectargeojson.inicia(divid);
	},
	/*
	Function: adiciona
	
	Adiciona a URL ao mapa
	*/
	adiciona: function(){
		if(i3GEOF.conectargeojson.aguarde.visibility === "visible")
		{return;}
		var reg,p,cp,funcao,
			url = $i("i3GEOconectargeojsonurl").value;
		if(url !== ""){
			reg = new RegExp("\\?", "g");
			url = url.replace(reg,'|');
			reg = new RegExp("&", "g");
			url = url.replace(reg,'#');
			i3GEOF.conectargeojson.aguarde.visibility = "visible";
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaGeoJson";
			cp = new cpaint();
			funcao = function(retorno){
				i3GEOF.conectargeojson.aguarde.visibility = "hidden";
				i3GEO.atualiza();
			};
			cp.set_transfer_mode('POST');
			cp.set_response_type("JSON");
			cp.call(p,"foo",funcao,"servico="+url);			
			i3GEOF.conectargeojson.aguarde.visibility = "hidden";
		}
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>