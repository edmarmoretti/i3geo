if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
//
//utilizado para armazenar templates
//alguns templates sao carregados sob demanda, por isso sao definidos aqui como false
//
i3GEO.template = {
        botoes: {
            //lista de botoes na forma de icones
            listaDeIcones: '<button title="{{{title}}}" onclick="{{{onclick}}}" class="btn btn-xs" style="margin: 2px; padding: 2px;"><span class="material-icons {{{classe}}}" style="{{{estiloicon}}}">{{{icone}}}</span></button>'
        },
        //formatacao da lista de camadas
        camada: false,
        //tooltip utilizado quando o LAYER for do tipo utfGrid
        utfGridInfo: '<div><div id="i3GEOoverlayInfo"></div></div>'
};
