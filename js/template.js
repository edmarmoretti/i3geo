if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
//
//utilizado para armazenar templates HTML
//alguns templates sao carregados sob demanda, por isso sao definidos aqui como false
//
//exemplo de uso:
// var html = Mustache.render(i3GEO.template.janela.aguarde, {id: "1234"});
// var html = Mustache.render("{{#data}}<option value='{{{img}}}'>{{{name}}}</option>{{/data}}", {data: [{name: 'xx',img:'yy'}]})
//
i3GEO.template = {
        botoes: {
            //lista de botoes na forma de icones
            listaDeIcones: '<button title="{{{title}}}" onclick="{{{onclick}}}" class="btn btn-xs" style="margin: 2px; padding: 2px;"><span class="material-icons {{{classe}}}" style="{{{estiloicon}}}">{{{icone}}}</span></button>'
        },
        //utilizados nas janelas flutuantes
        janela : {
            aguarde: "<div id='{{id}}_imagemCabecalho' class='i3GeoAguardeJanela progress' style='visibility:hidden; '><span class='progress-bar progress-bar-striped active' role='progressbar' style='width: 100%'></span></div>"
        },
        //formatacao da lista de camadas
        camada: false,
        //formatacao da lista de camadas de fundo
        camadaFundo: false,
        //formatacao da lista de camadas graficas
        camadaGr: false,
        //tooltip utilizado quando o LAYER for do tipo utfGrid
        utfGridInfo: '<div><div id="i3GEOoverlayInfo"></div></div>',
        //resultado da busca feita em um tema
        buscaEmTemas: false,
        //resultado da busca feita em um servico externo
        buscaEmServico: false,
        //formatacao de itens de listagens que sao folders
        ferramentasFolder: false,
        //formatacao de itens de listagens que sao links
        ferramentasLinks: false,
        //formatacao de listas do tipo migalha mostrada na lista de ferramentas
        ferramentasMigalha: false,
        //formatacao geral utilizada para folders
        dir: false,
        //formatacao geral utilizada para uma camada
        tema: false,
        //formatacao utilizada em listas do tipo migalha mostradas no catalogo
        catalogoMigalha: false,
        //formatacao da legenda (guia principal do mapa)
        legenda: false,
        //formatacao da lista de marcadores salvos pelo usuario
        marcador: false,
        //campo do tipo input para a busca usando typeahead
        searchInput: false
};
