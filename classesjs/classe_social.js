/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Social

Arquivo:

i3geo/classesjs/classe_social.js

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
if(typeof(i3GEO) === 'undefined'){
	i3GEO = [];
}
/*
Classe: i3GEO.social

Opções de compartilhamento e uso de redes sociais.
*/
i3GEO.social = {
	curtirFacebook: function(url,tipo){
		if(tipo == "comtotal")
		{return "<iframe src='http://www.facebook.com/plugins/like.php?href="+url+"&amp;layout=button_count&amp;show_faces=false&amp;width=160&amp;action=like&amp;colorscheme=light&amp;height=21' scrolling='no' frameborder='0' style='border:none; overflow:hidden; width:160px; height:21px;' allowTransparency='true'></iframe>";}
		if(tipo == "semtotal")
		{return "<iframe src='http://www.facebook.com/plugins/like.php?href="+url+"&amp;layout=button_count&amp;show_faces=false&amp;width=55&amp;action=like&amp;colorscheme=light&amp;height=21' scrolling='no' frameborder='0' style='border:none; overflow:hidden; width:55px; height:21px;' allowTransparency='true'></iframe>";}
	},
	publicarTwitter: function(url,tipo){
		if(tipo == "comtotal")
		{return '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?count=horizontal&via=i3geo&url='+url+'" style="width:100px; height:21px;"></iframe>';}
		if(tipo == "semtotal")
		{return '<iframe allowtransparency="true" frameborder="0" scrolling="no" src="http://platform.twitter.com/widgets/tweet_button.html?count=none&via=i3geo&url='+url+'" style="width:55px; height:21px;"></iframe>';}
	},
	/*
	Function: compartilhar
	
	Cria os botões de publicar no Twitter e curtir/compartilhar no Facebook
	
	Gera o HTML contendo as tags IMG com os links
	
	Parametro:
	
	id {string} - id do elemento HTML que receberá os links
	
	urlcf {string} - url para o Facebook
	
	urlpt {string} - url para o Twitter
	
	tipo {string} - tipo de botão comtotal|semtotal
	
	
	locaplic {string} - url onde está o i3Geo. Se não for especificada, será obtida de i3GEO.configura.locaplic
	
	Return:
	
	HTML com os botões
	*/
	compartilhar: function(id,urlcf,urlpt,tipo,locaplic){
		if(!locaplic)
		{locaplic = i3GEO.configura.locaplic;}		
		if(!tipo)
		{tipo = "comtotal";}
		var onde = $i(id),
			tabela = "";
		if(tipo == "comtotal")
		{tabela += "<table style='width:250px' ><tr>";}
		if(tipo == "semtotal")
		{tabela += "<table style='width:115px' ><tr>";}
		if(onde || id == ""){
			if(urlpt !== ""){
				tabela += "<td>"+i3GEO.social.publicarTwitter(urlpt,tipo)+"</td>";
			}
			if(urlcf !== ""){
				tabela += "<td><img style='cursor:pointer' src='"+locaplic+"/imagens/facebook.gif' onclick='javascript:window.open(\"http://www.facebook.com/sharer.php?u="+urlcf+"\")' title='Compartilhar'/></td>";
				tabela += "<td>"+i3GEO.social.curtirFacebook(urlcf,tipo)+"</td>";
			}
			tabela += "</tr></table>";
			if(id !== "")
			{onde.innerHTML = tabela;}
			return tabela;
		}
		else
		{return false;}
	},
	/*
	Function: bookmark
	
	Cria os botões de bookmark em redes sociais
	
	Gera o HTML contendo as tags IMG com os links
	
	Parametro:
	
	link {string} - link que será marcado
	
	locaplic {string} - url onde está o i3Geo. Se não for especificada, será obtida de i3GEO.configura.locaplic
	
	Return:
	
	HTML com os botões
	*/
	bookmark: function(link,locaplic){
		if(!locaplic)
		{locaplic = i3GEO.configura.locaplic;}
		var ins = "<img style='cursor:pointer' src='"+locaplic+"/imagens/delicious.gif' onclick='javascript:window.open(\"http://del.icio.us/post?url="+link+"\")' title='Delicious'/> ";
		ins += "<img style='cursor:pointer' src='"+locaplic+"/imagens/digg.gif' onclick='javascript:window.open(\"http://digg.com/submit/post?url="+link+"\")' title='Digg'/> ";
		ins += "<img style='cursor:pointer' src='"+locaplic+"/imagens/facebook.gif' onclick='javascript:window.open(\"http://www.facebook.com/sharer.php?u="+link+"\")' title='Facebook'/> ";
		ins += "<img style='cursor:pointer' src='"+locaplic+"/imagens/stumbleupon.gif' onclick='javascript:window.open(\"http://www.stumbleupon.com/submit?url="+link+"\")' title='StumbleUpon'/>";
		return ins;
	}
};
