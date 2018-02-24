if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
//
//utilizado para armazenar templates
//alguns templates sao carregados sob demanda, por isso sao definidos aqui como false
//
//exemplo de uso:
// var html = Mustache.render(i3GEO.template.janela.aguarde, {id: "1234"});
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
        //tooltip utilizado quando o LAYER for do tipo utfGrid
        utfGridInfo: '<div><div id="i3GEOoverlayInfo"></div></div>'
};
