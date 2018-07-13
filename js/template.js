if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}

//utilizado para armazenar templates HTML
//alguns templates sao carregados sob demanda, por isso sao definidos aqui como false
//nesses casos, o HTML do template sao estruturados de outras formas, como em arquivos
//que sao lidos quando necessario

//exemplo de uso:
//var html = Mustache.render(i3GEO.template.janela.aguarde, {id: "1234"});
//var html = Mustache.render("{{#data}}<option value='{{{img}}}'>{{{name}}}</option>{{/data}}", {data: [{name: 'xx',img:'yy'}]})

i3GEO.template = {
	botoes: {
	    //lista de botoes na forma de icones
	    listaDeIcones: '<button title="{{{title}}}" onclick="{{{onclick}}}" class="btn btn-xs" style="margin: 2px; padding: 2px;"><span class="material-icons {{{classe}}}" style="{{{estiloicon}}}">{{{icone}}}</span></button>',
	    padrao: '<button title="{{{title}}}" onclick="{{{onclick}}}" class="btn btn-primary btn-sm btn-raised" style="{{{style}}}">{{{text}}}</button>'
	},
	//utilizados nas janelas flutuantes
	janela : {
	    aguarde: "<div id='{{id}}_imagemCabecalho' class='i3GeoAguardeJanela progress' style='visibility:hidden; '><span class='progress-bar progress-bar-striped active' role='progressbar' style='width: 100%'></span></div>",
	    msg: "<div class='modal fade' data-keyboard='false' tabindex='-1' role='dialog' aria-hidden='true' style='z-index:500000;overflow-y:visible;'><div class='modal-dialog'><div class='modal-content'><div class='modal-header' style='padding-top: 5px;'><button type='button' class='closeModal close pull-right' data-dismiss='modal' aria-label='Close'><i class='material-icons'>highlight_off</i></button></div><div class='modal-body' style='padding-top: 0px;'><div id='i3GEOMensagemTempoModal' > {{{texto}}} </div></div></div></div></div>",
	    closemsg: "<div class='modal fade' data-keyboard='false' tabindex='-1' role='dialog' aria-hidden='true' style='z-index:500000;overflow-y:visible;'><div class='modal-dialog'><div class='modal-content'><div class='modal-header' style='padding-top: 5px;'><button type='button' class='closeModal close pull-right' data-dismiss='modal' aria-label='Close'><i class='material-icons'>highlight_off</i></button></div><div class='modal-body' style='padding-top: 0px;'><div id='i3GEOMensagemCloseModal' > {{{texto}}} </div></div></div></div></div>",
	    formModal: "<div class='modal-dialog' style='z-Index:100;'><div class='modal-content' style='max-height: 99vh;'><div class='modal-header handleDraggable' style='padding-top: 5px;height:30px;'><button type='button' class='closeModal close pull-right' data-dismiss='modal' aria-label='Close'><i class='material-icons'>highlight_off</i></button></div><div class='modal-body' style='padding-top: 0px;cursor:default;'><div id='i3GEOToolFormModal' > {{{texto}}} </div></div></div></div>"
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
	searchInput: false,
	//balao de informacoes da ferramenta identifica
	infotooltip: false
};
