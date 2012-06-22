
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Converte um tema em kml

Mostra os endereços que permitem acessar o tema no formato KML. Essa ferramenta não processa os dados, apenas constrói
os links para os programas que fazem a conversão ou visualização dos dados em KML vetorial ou do tipo GroundOverlay (via WMS)

Veja:

<i3GEO.tema.dialogo.abreKml>

Arquivo:

i3geo/ferramentas/convertekml/index.js.php

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
Classe: i3GEOF.converteKml
*/
i3GEOF.converteKml = {
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta

	Parametros:
	
	divid {String} - id do div que receberá o conteudo HTML da ferramenta

	tema {String} - código do tema
	
	tipo {String} - kml|kmz "kml" gera um link para acesso a um WMS e "kmz" gera um link que permite o acesso a um WMS e ao arquivo kmz vetorial
	
	*/
	html:function(divid,tema,tipo){
		var ins = '<p class="paragrafo" >Voc&ecirc; pode utilizar os endere&ccedil;os para visualizar dados em softwares que aceitam o formato kml,' +
		'como o <a href="http://earth.google.com/intl/pt/" target="_blank" > Google Earth</a>.' +
		'<p class="paragrafo" >Clique <a href="'+i3GEO.configura.locaplic+'/documentacao/ajuda/googleearth.htm" target="blank" >aqui</a> para mais detalhes sobre como usar o link kml no Google Earth.' +
		'<p class="paragrafo" ><b>Kml com "GroundOverlay" baseado em um servico WMS: </b></p>' +
		'<p class="paragrafo" > <textarea cols="65" rows="3" style=cursor:pointer onclick="javascript:this.select()">' + i3GEO.configura.locaplic + '/pacotes/kmlmapserver/kmlservice.php?map='+tema+'&typename='+tema+'&request=kml</textarea></p>';
		if(tipo == "kmz"){
			ins += '<p class="paragrafo" ><b>Kmz que gera um arquivo kml vetorial: </b></p>' +
			'<p class="paragrafo" ><textarea cols="65" rows="3" style=cursor:pointer onclick="javascript:this.select()">' + i3GEO.configura.locaplic + '/pacotes/kmlmapserver/kmlservice.php?map='+tema+'&typename='+tema+'&request=kmz</textarea></p>';
		}
		ins += '<p class="paragrafo" >Voc&ecirc; pode também utilizar o link abaixo para mostrar a &aacute;rvore completa de temas no GoogleEarth' +
		'<p class="paragrafo" ><textarea cols="65" rows="2" style=cursor:pointer onclick="javascript:this.select()">' + i3GEO.configura.locaplic + '/kml.php </textarea></p>';
		$i(divid).innerHTML += ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	
	Parametros:
	
	tema {String} - código do tema
	
	tipo {String} - kml|kmz "kml" gera um link para acesso a um WMS e "kmz" gera um link que permite o acesso a um WMS e ao arquivo kmz vetorial
	*/	
	criaJanelaFlutuante: function(tema,tipo){
		var janela,divid,titulo;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.converteKml");
		};
		titulo = "Kml <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=81' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"450px",
			"260px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.converteKml",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.converteKml.html(divid,tema,tipo);
	}
};
