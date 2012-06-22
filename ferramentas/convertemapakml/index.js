
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Converte um mapa em kml

Converte o mapa atual em KML. A conversão é baseada na geração de um KML com a imagem do mapa sendo mostrada como um WMS.
O Kml contém o elemento GroundOverlay.

Veja:

<i3GEO.mapa.convertekml>

Arquivo:

i3geo/ferramentas/convertemapakml/index.js.php

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
Classe: i3GEOF.converteMapaKml
*/
i3GEOF.converteMapaKml = {
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta

	Parametros:
	
	divid {String} - id do div que receberá o conteudo HTML da ferramenta

	*/
	html:function(divid){
		var ins = "",lista,tema;
		lista = i3GEO.arvoreDeCamadas.CAMADAS;
		tema = lista[0].name;	
		ins = '<p class="paragrafo" >Voc&ecirc; pode utilizar os endere&ccedil;os para visualizar o mapa atual em softwares que aceitam o formato kml,' +
		'como o <a href="http://earth.google.com/intl/pt/" target="_blank" > Google Earth</a>. O endereço de acesso é temporário, ficando disponível por determinado período de tempo conforme definido pelo administrador do i3Geo.' +
		'<p class="paragrafo" >Clique <a href="'+i3GEO.configura.locaplic+'/documentacao/ajuda/googleearth.htm" target="blank" >aqui</a> para mais detalhes sobre como usar o link kml no Google Earth.' +
		'<p class="paragrafo" ><b>Kml baseado em um servico WMS: </b></p>' +
		'<p class="paragrafo" > <textarea cols="65" rows="3" style=cursor:pointer onclick="javascript:this.select()">' + 
		i3GEO.configura.locaplic + '/pacotes/kmlmapserver/kmlservice.php?map='+i3GEO.parametros.mapfile+'&typename='+tema+'&request=kml</textarea></p>';
		ins += '<p class="paragrafo" >Voc&ecirc; pode também utilizar o link abaixo para mostrar a &aacute;rvore completa de temas no GoogleEarth (incluindo dados vetoriais)' +
		'<p class="paragrafo" ><textarea cols="65" rows="2" style=cursor:pointer onclick="javascript:this.select()">' + i3GEO.configura.locaplic + '/kml.php </textarea></p>';
		$i(divid).innerHTML += ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,titulo;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.converteMapaKml");
		};
		titulo = "Kml <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=2&idajuda=13' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"440px",
			"325px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.converteMapaKml",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.converteMapaKml.html(divid);
	}
};
