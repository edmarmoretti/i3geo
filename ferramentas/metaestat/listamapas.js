/*
 Title: Ferramenta que permite listar os mapas publicados

 Arquivo:

 i3geo/ferramentas/metaestat/listamapas.js

Licenca:

GPL2

 i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

 Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
 Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Esse programa utiliza parcialmente os codigos da aplicacao calculadora de carbono desenvolvido pelo
IPAM - Instituto de Pesquisa Ambiental da Amazonia

Este programa e software livre; voce pode redistribui-lo
e/ou modifica-lo sob os termos da Licenca Publica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa e distribuido na expectativa de que seja util,
porem, SEM NENHUMA GARANTIA; nem mesmo a garantia implicita
de COMERCIABILIDADE OU ADEQUACAO A UMA FINALIDADE ESPECIFICA.
Consulte a Licenca Publica Geral do GNU para mais detalhes.
Voce deve ter recebido uma copia da Licenca Publica Geral do
GNU junto com este programa; se nao, escreva para a
Free Software Foundation, Inc., no endereco
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}
i3GEOF.listamapas = {
	iniciaJanelaFlutuante: function(){
		if($i("i3GEOF.listamapas_corpo")){
			return;
		}
		var minimiza,cabecalho,janela,divid;
		cabecalho = function(){
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.listamapas");
		};
		janela = i3GEO.janela.cria(
			"350px",
			"300px",
			"",
			"",
			"",
			$trad("x71"),
			"i3GEOF.listamapas",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.listamapas.html(divid);
	},
	html: function(divid){
		var ins = "",
			listaTemplates = function(templates){
				var m = templates.nomes.length,
					listaMapas = function(mapas){
						var n = mapas.length,
							i,j,url="";
						for(i=0;i<n;i++){
							ins += "<div style=background-color:white;padding:5px;margin:5px ><p class=paragrafo style=font-size:16px ><b>";
							if(mapas[i].template == ""){
								ins += mapas[i].titulo;
							}
							else{
								url = i3GEO.configura.locaplic+templates.metaestatTemplates+"/"+mapas[i].template+"?id="+mapas[i].id_mapa;
								ins += "<a class=paragrafo target='_blank' style='text-decoration:none;' href='"+url+"' >"+mapas[i].titulo+"</a>";
							}
							ins += "</b></p>";
							ins += "<p class=paragrafo >Templates: ";
							for(j=0;j<m;j++){
								url = i3GEO.configura.locaplic+templates.metaestatTemplates+"/"+templates.nomes[j]+"?id="+mapas[i].id_mapa;
								ins += "<a href='"+url+"' class=paragrafo target='_blank' style='text-decoration:none;' >"+templates.nomes[j].replace(".php","")+"</a> - ";
							}
							ins += "</p></div>";
						}
						$i(divid).innerHTML = ins;
					},
					p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaMapas";
				i3GEO.util.ajaxGet(p,listaMapas);
			},
			p = i3GEO.configura.locaplic+"/admin/php/metaestat.php?funcao=listaTemplatesMapa";
		i3GEO.util.ajaxGet(p,listaTemplates);
	}
};