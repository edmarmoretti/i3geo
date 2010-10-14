<?php error_reporting(0);if(extension_loaded('zlib')){ob_start('ob_gzhandler');} header("Content-type: text/javascript"); ?>
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */

/*
Title: Etiqueta

Ativa um determinado campo na tabela de atributos para ser utilizado na ferramenta de identificação do tipo "balão".

<i3GEO.tema.dialogo.etiquetas>

Arquivo:

i3geo/ferramentas/etiqueta/index.js.php

Licenca:

GPL2

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
Classe: i3GEOF.etiqueta
*/
i3GEOF.etiqueta = {
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
			$i(iddiv).innerHTML += i3GEOF.etiqueta.html();
			new YAHOO.widget.Button(
				"i3GEOetiquetabotao1",
				{onclick:{fn: i3GEOF.etiqueta.ativa}}
			);
			new YAHOO.widget.Button(
				"i3GEOetiquetabotao2",
				{onclick:{fn: i3GEOF.etiqueta.desativa}}
			);
			i3GEOF.etiqueta.ativaFoco();
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
		ins += '<p class="paragrafo" >Escolha o item que ser&aacute; utilizado como fonte de dados para incluir a etiqueta:<br>';	
		ins += '<div id=i3GEOetiquetalistai class=digitar style="text-align:left;left:0px;top:0px;330px;height:80px;overflow:auto;display:block;"></div>';
		ins += '<br><br>';
		ins += '<p class="paragrafo" >';
		ins += '<input id=i3GEOetiquetabotao1 size=35  type=button value="Ativar" />';
		ins += '<input id=i3GEOetiquetabotao2 size=35  type=button value="Desativar todas as etiquetas" />';
		return ins;
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	*/	
	criaJanelaFlutuante: function(){
		var minimiza,cabecalho,janela,divid,temp,titulo,cabecalho,minimiza;
		cabecalho = function(){
			i3GEOF.etiqueta.ativaFoco();
		};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.etiqueta");
		};
		//cria a janela flutuante
		titulo = "Etiquetas <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=5&idajuda=37' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"300px",
			"210px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.etiqueta",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.etiqueta.aguarde = $i("i3GEOF.etiqueta_imagemCabecalho").style;
		$i("i3GEOF.etiqueta_corpo").style.backgroundColor = "white";
		i3GEOF.etiqueta.inicia(divid);
	},
	/*
	Function: ativaFoco
	
	Refaz a interface da ferramenta quando a janela flutuante tem seu foco ativado
	*/
	ativaFoco: function(){
		i3GEO.php.listaItensTema(i3GEOF.etiqueta.montaListaItens,i3GEO.temaAtivo);
		var i = $i("i3GEOF.etiqueta_c").style;
		i3GEO.janela.ULTIMOZINDEX++;
		i.zIndex = 10000 + i3GEO.janela.ULTIMOZINDEX;
	},
	/*
	Function: montaListaItens
	
	Monta a lista de itens que poderão ser escolhidos para compor o mapa.
	
	A lista é inserida no elemento html com id "i3GEOetiquetalistai"
	*/
	montaListaItens: function(retorno){
		var ins,i,n,itensatuais,item,checado;
		try{
			itensatuais = i3GEO.arvoreDeCamadas.pegaTema(i3GEO.temaAtivo);
			itensatuais = itensatuais.etiquetas.split(",");
			ins = [];
			ins.push("<table class=lista >");
			n = retorno.data.valores.length;
			for (i=0;i<n; i++){
				item = retorno.data.valores[i].item;
				ins.push("<tr><td><input size=2 style='cursor:pointer' "+checado+" type=checkbox id=i3GEOetiqueta"+item+" /></td>");
				ins.push("<td>&nbsp;"+item+"</td>");
			}
			$i("i3GEOetiquetalistai").innerHTML = ins.join("");
			n = itensatuais.length;
			for (i=0;i<n; i++){
				item = $i("i3GEOetiqueta"+itensatuais[i]);
				if(item)
				{item.checked = true;}
			}
			ins.push("</table>");
		}
		catch(e)
		{$i("i3GEOetiquetalistai").innerHTML = "<p style=color:red >Ocorreu um erro<br>"+e;}	
	},
	/*
	Function: pegaItensMarcados
	
	Recupera os itens que foram marcados e monta uma lista para enviar como parâmetro para a função de geração dos gráficos
	*/
	pegaItensMarcados: function(){
		var listadeitens = [],
			inputs = $i("i3GEOetiquetalistai").getElementsByTagName("input"),
			i,
			it,
			c,
			n;
		n = inputs.length;
		for (i=0;i<n; i++){
			if (inputs[i].checked === true){
				it = inputs[i].id;
				listadeitens.push(it.replace("i3GEOetiqueta",""));
			}
		}
		return(listadeitens);
	},
	/*
	Function: ativa
	
	Ativa a etiqueta com os itens marcados
	
	Veja:
	
	<ATIVAETIQUETAS>
	*/
	ativa: function(){
		try{
			if(i3GEOF.etiqueta.aguarde.visibility === "visible")
			{return;}
			var lista = i3GEOF.etiqueta.pegaItensMarcados(),
				cp = new cpaint(),
				temp,
				p;
			if(lista.length === 0)
			{alert("selecione um item");return;}
			i3GEOF.etiqueta.aguarde.visibility = "visible";
			temp = function(retorno){
				i3GEOF.etiqueta.aguarde.visibility = "hidden";
				i3GEO.atualiza(retorno);
			};
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=ativaEtiquetas&tema="+i3GEO.temaAtivo+"&item="+lista.toString(",");
			cp.set_response_type("JSON");
			cp.call(p,"etiqueta",temp);
		}catch(e){alert("Erro: "+e);i3GEOF.etiqueta.aguarde.visibility = "hidden";}
	},
	/*
	Function: desativa
	
	Desativa as etiqueta do tema ativo
	
	Veja:
	
	<REMOVEETIQUETAS>
	*/
	desativa: function(){
		try{
			if(i3GEOF.etiqueta.aguarde.visibility === "visible")
			{return;}
			var cp = new cpaint(),
				temp,
				p;
			i3GEOF.etiqueta.aguarde.visibility = "visible";
			temp = function(retorno){
				i3GEOF.etiqueta.aguarde.visibility = "hidden";
				i3GEO.atualiza(retorno);
			};
			p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=removeEtiquetas&tema="+i3GEO.temaAtivo;
			cp.set_response_type("JSON");
			cp.call(p,"etiqueta",temp);
		}catch(e){alert("Erro: "+e);i3GEOF.etiqueta.aguarde.visibility = "hidden";}
	}
};
<?php error_reporting(0);if(extension_loaded('zlib')){ob_end_flush();}?>