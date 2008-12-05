/*
Class:: i3GEO.janela

Abre janelas flutuantes

As janelas são criadas por meio da biblioteca YUI

File: i3geo/classesjs/classe_janela.js

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
if(typeof(i3GEO) == 'undefined'){
	i3GEO = new Array();
}
i3GEO.janela = {
	/*
	Property: ANTESCRIA
	
	Lista com os nomes das funções que serão executadas antes de abrir a janela.
	
	Este é um array que pode ser modificado utilizando-se as funções javascript de
	manipulação de arrays.
	
	Por default, ao criar uma janela é executada a função i3GEO.janela.prepara

	Type:
	{Array}
	*/
	ANTESCRIA: new Array(
		"i3GEO.janela.prepara()"
	),
	/*
	Property: ANTESFECHA
	
	Lista com os nomes das funções que serão executadas após fechar a janela.
	
	Este é um array que pode ser modificado utilizando-se as funções javascript de
	manipulação de arrays.
	
	Por default, ao fechar uma janela é executada a função i3GEO.janela.fecha

	Type:
	{Array}
	*/
	ANTESFECHA: new Array(),
	/*
	Function: prepara
	
	Executa funções default antes de abrir a janela
	*/
	prepara: function(){
		//
		//esconde o mapa na interface flamingo se estiver ativa
		//isso é necessário pq em flash as janelas não ficam por cima
		//
		if($i("flamingoi")){$i("flamingoi").style.display="none";}
		//
		//esconde o box de zoom e outros objetos temporários se estiverem visíveis
		//
		if($i("boxg"))
		{$i("boxg").style.display = "none";}
		if($i("boxpin"))
		{$i("boxpin").style.display = "none";}		
	},
	/*
	Function: cria
	
	Cria uma janela flutuante.
	
	Vc pode obter o elemento HTML interno da janela por meio de:
	
	{retorno}[2].innerHTML
	
	Parameters:
	
	wlargura {integer} - largura da janela em pixels
	
	waltura {integer} - altura da janela em pixels
	
	wsrc {String} - URL que será incluída no SRC do iframe interno da janela. Se for "", o iframe não será criado
	
	nx {Integer} - posição x da janela em pixels. Se for "" será fixada no centro
	
	ny {Integer} - posição y da janela em pixels. Se for "" será fixada no centro

	id {String} - (opcional) nome que será dado ao id que conterá a janela. Se não for definido, será usado o id="wdoca". O
		id do iframe interno é sempre igual ao id + a letra i. Por default, será "wdocai".
		O id do cabçalho será igual a id+"_cabecalho" e o id do corpo será id+"_corpo"
	
	modal {Boolean} - (opcional) indica se a janela bloqueará as inferiores ou não. Por default é false
	
	Return:
	
	{Array} Array contendo: objeto YAHOO.panel criado,elemento HTML com o cabecalho, elemento HTML com o corpo
	*/
	cria: function(wlargura,waltura,wsrc,nx,ny,texto,id,modal){
		//executa as funções de preparação
		if(i3GEO.janela.ANTESCRIA){
			for(i=0;i<i3GEO.janela.ANTESCRIA.length;i++)
			{eval(i3GEO.janela.ANTESCRIA[i]);}
		}
		//
		//por default o id será 'wdoca'
		//
		if (arguments.length < 7 || id == ""){
			var id = "wdoca";
			var modal = false;
		}
		if (arguments.length == 7){
			var modal = false;
		}
		var wlargura_ = parseInt(wlargura)+0+"px";
		YAHOO.namespace("janelaDoca.xp");
		if ($i(id))
		{YAHOO.janelaDoca.xp.panel.destroy();}
		
		var ins = '<div id="'+id+'_cabecalho" class="hd">'+texto+'</div><div id="'+id+'_corpo" class="bd">';
		if(wsrc != "")
		ins += '<iframe name="'+id+'i" id="'+id+'i" valign="top" style="border:0px white solid"></iframe>';
		ins += '</div>';
		var novoel = document.createElement("div");
		novoel.id = id;
		novoel.style.display="block";
		novoel.innerHTML = ins;
		
		if($i("i3geo"))
		{$i("i3geo").appendChild(novoel);}
		else
		{document.body.appendChild(novoel);}
		
		var wdocaiframe = $i(id+"i");
		if (wdocaiframe)
		{
			with (wdocaiframe.style){width = "100%";height=waltura;};
			wdocaiframe.style.display = "block";
			wdocaiframe.src = wsrc;
		}
		
		var fix = false;
		if(nx == ""){var fix = true;}
		YAHOO.janelaDoca.xp.panel = new YAHOO.widget.ResizePanel(id, { modal:modal, width: wlargura_, fixedcenter: fix, constraintoviewport: false, visible: true, iframe:false} );
		if(nx != ""){
			var pos = new Array(nx,ny);
			YAHOO.janelaDoca.xp.panel.moveTo(pos[0],pos[1]+50);
		}
		YAHOO.janelaDoca.xp.panel.render();
		YAHOO.util.Event.addListener(YAHOO.janelaDoca.xp.panel.close, "click", i3GEO.janela.fecha);
		return(new Array(YAHOO.janelaDoca.xp.panel,$i(id+"_cabecalho"),$i(id+"_corpo")));
	},
	fecha: function(){
		/*
		$i(id).style.display = "none";
		$i(id).src = "";
		YAHOO.util.Event.removeListener(YAHOO.janelaDoca.xp.panel.close, "click");
		YAHOO.janelaDoca.xp.panel.destroy();
		*/
		if ((g_tipoacao == "selecaobox") || (g_tipoacao == "inseregrafico") || (g_tipoacao == "selecao") || (g_tipoacao == "inserexy") || (g_tipoacao == "textofid"))
		{mudaiconf("pan");}
		//esconde o box do google
		if ($i("boxg"))
		{$i("boxg").style.display = "none";}
		if ($i("boxpin"))
		{$i("boxpin").style.display = "none";}
		//fecha o container de desenho de elementos na tela
		if($i("divGeometriasTemp"))
		{richdraw.fecha();}
		limpacontainerf();
		if($i("flamingoi")){$i("flamingoi").style.display="block";}
		//executa as funções de fechamento
		if(i3GEO.janela.ANTESFECHA){
			for(i=0;i<i3GEO.janela.ANTESFECHA.length;i++)
			{eval(i3GEO.janela.ANTESFECHA[i]);}
		}
	},
	/*
	Function: alteraTamanho
	
	Altera o tamanho de uma janela aberta
	
	Parameters:
	
	w {Integer} - nova largura
	
	h {Integer} - nova altura
	
	id {String} - (opcional) id que identifica a janela aberta, por padrão utiliza "wdoca"
	*/
	alteraTamanho: function(w,h,id){
		if(arguments.length == 3)
		{var i = $i(id);}
		else
		{var i = $i("wdoca");}
		if(i){
			i.style.width = w;
			i.style.height = h;
		}
	}
}