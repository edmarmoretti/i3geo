
if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
/*
Classe: i3GEOF.opcoesMaparef

 */
i3GEOF.opcoesMaparef = {
        /*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
         */
        aguarde: "",
        /**
         * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
         */
        MUSTACHE : "",
        CONFIG : {},
        /**
         * Susbtitutos para o template
         */
        mustacheHash : function() {
            var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.opcoesMaparef.dicionario);
            dicionario["Tamanhol"] = i3GEOF.opcoesMaparef.CONFIG.width;
            dicionario["Tamanhoa"] = i3GEOF.opcoesMaparef.CONFIG.height;
            return dicionario;
        },
        /*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
         */
        inicia: function(iddiv){
            if(i3GEOF.opcoesMaparef.MUSTACHE == ""){
                var t1 = i3GEO.configura.locaplic + "/ferramentas/opcoes_maparef/template_mst.html",
                t2 = i3GEO.configura.locaplic + "/ferramentas/opcoes_maparef/exec.php?funcao=getref";
                $.when( $.get(t1),$.get(t2) ).done(function(r1,r2) {
                    i3GEOF.opcoesMaparef.MUSTACHE = r1[0];
                    i3GEOF.opcoesMaparef.CONFIG = r2[0];
                    i3GEOF.opcoesMaparef.inicia(iddiv);
                });
                return;
            }
            var b,box;
            try{
                $i(iddiv).innerHTML = i3GEOF.opcoesMaparef.html();
                i3GEO.util.aplicaAquarela('form-opcoesMaparef');
                i3GEO.janela.tempoMsg($trad('msg',i3GEOF.opcoesMaparef.dicionario));
            }
            catch(erro){i3GEO.janela.tempoMsg(erro);}
        },
        /*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
         */
        html:function() {
            var ins = Mustache.render(i3GEOF.opcoesMaparef.MUSTACHE, i3GEOF.opcoesMaparef.mustacheHash());
            return ins;
        },
        /*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
         */
        iniciaJanelaFlutuante: function(){
            var janela,divid,temp,titulo,cabecalho,minimiza;
            if ($i("i3GEOF.opcoesMaparef")) {
                return;
            }
            cabecalho = function(){};
            minimiza = function(){
                i3GEO.janela.minimiza("i3GEOF.opcoesMaparef",200);
            };
            //cria a janela flutuante
            titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("d9t") + "</span></div>";
            janela = i3GEO.janela.cria(
                    "250px",
                    "270px",
                    "",
                    "",
                    "",
                    titulo,
                    "i3GEOF.opcoesMaparef",
                    false,
                    "hd",
                    cabecalho,
                    minimiza,
                    "",
                    true,
                    "",
                    "",
                    "",
                    ""
            );
            divid = janela[2].id;
            $i("i3GEOF.opcoesMaparef_corpo").style.backgroundColor = "white";
            $i("i3GEOF.opcoesMaparef_corpo").style.textAlign = "left";
            i3GEOF.opcoesMaparef.aguarde = $i("i3GEOF.opcoesMaparef_imagemCabecalho").style;
            i3GEOF.opcoesMaparef.inicia(divid);
        },
        /*
	Function: executa
         */
        executa: function(){
            if(i3GEOF.opcoesMaparef.aguarde.visibility === "visible"){
                return;
            }
            i3GEOF.opcoesMaparef.aguarde.visibility = "visible";
            $.post(
                    i3GEO.configura.locaplic+"/ferramentas/opcoes_maparef/exec.php?g_sid=" + i3GEO.configura.sid + "&funcao=altera&",
                    $("#form-opcoesMaparef").serialize()
            )
            .done(
                    function(data, status){
                        i3GEOF.opcoesMaparef.aguarde.visibility = "hidden";
                    }
            )
            .fail(
                    function(data){
                        i3GEOF.opcoesMaparef.aguarde.visibility = "hidden";
                    }
            );
        }
};