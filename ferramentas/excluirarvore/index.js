
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Excluir camadas em lote

Veja:

<i3GEO.arvoreDeCamadas.dialogo.excluir>

Arquivo:

i3geo/ferramentas/excluirarvore/index.js.php

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
Classe: i3GEOF.excluirarvore

*/
i3GEOF.excluirarvore = {
	/*
	Variavel: aguarde
	
	Estilo do objeto DOM com a imagem de aguarde existente no cabeçalho da janela.
	*/
	aguarde: "",
	/*
	Variavel: iddiv
	
	Guarda o id do div definido na função "inicia".
	*/	
	iddiv: "",
	/*
	Function: inicia
	
	Inicia a ferramenta. É chamado por criaJanelaFlutuante
	
	Parametro:
	
	iddiv {String} - id do div que receberá o conteudo HTML da ferramenta
	*/
	inicia: function(iddiv){
		var camadas = i3GEO.arvoreDeCamadas.CAMADASINICIAIS,
			n = camadas.length,
			temp;
		i3GEOF.excluirarvore.iddiv = iddiv;	
		try{
			$i(iddiv).innerHTML = i3GEOF.excluirarvore.html();
			new YAHOO.widget.Button(
				"i3GEOexcluirbotao1",
				{onclick:{fn: i3GEOF.excluirarvore.lote}}
			);				
		}
		catch(erro){
			i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.excluirarvore.inicia(i3GEOF.excluirarvore.iddiv)");
		}
		while(n > 0){
			n -= 1;
			temp = $i("excluirC_"+camadas[n].name);
			if(temp)
			{temp.checked = false;}
		}
	},
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Retorno:
	
	String com o código html
	*/
	html:function(){
		var camadas = i3GEO.arvoreDeCamadas.CAMADAS,
			n = camadas.length,
			temp,
			ins = "";
			
		ins = "<p class=paragrafo ><input id=i3GEOexcluirbotao1 type='buttom' value='Remover do mapa os marcados' /></p>" +			
			"<table id='i3GEOFexcluirarvoreLista' style='width:95%' class='lista8'>";
		while(n > 0){
			n -= 1;
			if(camadas[n].tema !== "")
			{ins += "<tr><td><input id='excluirC_"+camadas[n].name+"' CHECKED class=inputsb style='cursor:pointer' type=checkbox value='"+camadas[n].name+"' /></td><td><span style=background:white id='i3GEOanima"+camadas[n].name+"'>"+camadas[n].tema+"</span></td></tr>";}
		}
		ins += "</table><br>";
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var janela,divid,temp,titulo,cabecalho,minimiza;
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.excluirarvore");
		};
		//cria a janela flutuante
		titulo = "Excluir <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=6&idajuda=110' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"300px",
			"350px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.excluirarvore",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		i3GEOF.excluirarvore.aguarde = $i("i3GEOF.excluirarvore_imagemCabecalho").style;
		divid = janela[2].id;
		$i("i3GEOF.excluirarvore_corpo").style.backgroundColor = "white";
		$i("i3GEOF.excluirarvore_corpo").style.textAlign = "left";
		temp = function(){
			if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.excluirarvore.inicia(i3GEOF.excluirarvore.iddiv)") > 0)
			{i3GEO.eventos.ATUALIZAARVORECAMADAS.remove("i3GEOF.excluirarvore.inicia(i3GEOF.excluirarvore.iddiv)");}
		};
		YAHOO.util.Event.addListener(janela[0].close, "click", temp);
		if(i3GEO.eventos.ATUALIZAARVORECAMADAS.toString().search("i3GEOF.excluirarvore.inicia(i3GEOF.excluirarvore.iddiv)") < 0)
		{i3GEO.eventos.ATUALIZAARVORECAMADAS.push("i3GEOF.excluirarvore.inicia(i3GEOF.excluirarvore.iddiv)");}



		i3GEOF.excluirarvore.inicia(divid);
	},
	/*
	Function: lote
	
	Executa uma operação em lote sobre as camadas mostradas no mapa
	
	*/
	lote: function(objeto){
		var lista = [],
			temp,
			camadas = i3GEO.arvoreDeCamadas.CAMADAS,
			n = camadas.length;
		if(i3GEOF.excluirarvore.aguarde.visibility === "visible")
		{return;}
		i3GEOF.excluirarvore.aguarde.visibility = "visible";
		while(n > 0){
			n -= 1;
			temp = $i("excluirC_"+camadas[n].name);
			if(temp && temp.checked === true)
			{lista.push(temp.value);}
		}		
		temp = function(){
			i3GEOF.excluirarvore.aguarde.visibility = "hidden";
			i3GEO.atualiza();
		};
		if(lista.length > 0)
		{i3GEO.php.excluitema(temp,lista);}
		else{
			alert("Escolha uma camada pelo menos");
			i3GEOF.excluirarvore.aguarde.visibility = "hidden";
		}
	}
};
