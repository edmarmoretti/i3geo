
/*jslint plusplus:false,white:false,undef: false, rhino: true, onevar: true, evil: true */
/*
Title: Download de um tema

Faz o download de um tema existente na árvore de camadas.

Veja:

<i3GEO.tema.dialogo.download>

Arquivo:

i3geo/ferramentas/download/index.js.php

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
Classe: i3GEOF.download
*/
i3GEOF.download = {
	/*
	Function: html
	
	Gera o código html para apresentação das opções da ferramenta
	
	Veja:
	
	<DOWNLOAD2>

	Parametros:
	
	divid {String} - id do div que receberá o conteudo HTML da ferramenta

	tema {String} - código do tema
	*/
	html:function(divid,tema){
		var cp,p,ins,mostraDownload;
		ins = '<p class="paragrafo" >Clique com o botão da direita do mouse sobre o(s) arquivo(s) abaixo para fazer o download.</p>';
		ins += '<p class="paragrafo" ><div id=i3GEOdownloadResultado ></div>';
		$i(divid).innerHTML += ins;
		mostraDownload = function(retorno){
			var ins = "",
				arqs,n,arq;
			if (retorno.data != undefined){
				retorno = retorno.data;
				arqs = retorno.arquivos.split(",");
				n = arqs.length;
				if(retorno == "erro")
				{ins = "<p style=color:red >Ocorreu um erro. O tema não foi encontrado. Pode ser que o código do tema não existe na definição do mapfile. Informe o administrador do sistema.<br>";}
				else{
					for (arq=0;arq<n;arq++){
						ins += "<a href='"+window.location.protocol+"//"+window.location.host+"/"+arqs[arq]+"'>"+arqs[arq]+"</a><br>";
					}
				}
				if(retorno.nreg)
				{ins += "<br><br>N&uacute;mero de registros ="+retorno.nreg;}
			}
			else
			{ins = "<p style=color:red >Ocorreu um erro<br>";}
			$i("i3GEOdownloadResultado").innerHTML = ins;
			i3GEOF.download.aguarde.visibility = "hidden";
		};
		p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=download2&tema="+tema;
		cp = new cpaint();
		cp.set_response_type("JSON");
		cp.call(p,"downloadTema",mostraDownload);		
	},
	/*
	Function: criaJanelaFlutuante
	
	Cria a janela flutuante para controle da ferramenta.
	
	Parametros:
	
	tema {String} - código do tema
	*/	
	criaJanelaFlutuante: function(tema){
		var janela,divid,titulo;
		if(arguments.length == 0)
		{tema = i3GEO.temaAtivo;}
		cabecalho = function(){};
		minimiza = function(){
			i3GEO.janela.minimiza("i3GEOF.download");
		};
		titulo = "Download <a class=ajuda_usuario target=_blank href='" + i3GEO.configura.locaplic + "/ajuda_usuario.php?idcategoria=2&idajuda=82' >&nbsp;&nbsp;&nbsp;</a>";
		janela = i3GEO.janela.cria(
			"300px",
			"150px",
			"",
			"",
			"",
			titulo,
			"i3GEOF.download",
			false,
			"hd",
			cabecalho,
			minimiza
		);
		divid = janela[2].id;
		i3GEOF.download.aguarde = $i("i3GEOF.download_imagemCabecalho").style;
		i3GEOF.download.aguarde.visibility = "visible";
		i3GEOF.download.html(divid,tema);
	}
};
