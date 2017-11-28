//Instance the tour
var tutorial = new Tour({
	storage: false,
	debug: false,
	backdrop: false,
	name: "tutorial",
	template: "<div class='popover tour' style='color: black;background-color: white;border:1px solid rgba(0,0,0,.25)'><div class='arrow' style='display:block'></div><h3 class='popover-title'></h3><div class='popover-content' style='line-height: 16px;'></div><div class='popover-navigation' style='padding:2px 2px'><button class='btn btn-default btn-xs' data-role='prev'><i class='material-icons'>arrow_back</i></button><button class='btn btn-default btn-xs' style='float:none;' data-role='end'><i class='material-icons'>stop</i></button><button class='btn btn-default btn-xs' data-role='next'><i class='material-icons'>arrow_forward</i></button></div></div>",
	steps: [
		{
			element: "[data-tutorial='barranavegacao']",
			placement: 'auto',
			title: "Barra de navega&ccedil;&atilde;o",
			content: "Voc&ecirc; pode navegar pelo mapa utilizando os bot&otilde;es do mouse e a roda. A barra permite que as opera&ccedil;&otilde;es de aproximar/afastar sejam feitas com o clique do mouse, al&eacute;m de restaurar a extens&atilde;o geogr&aacute;fica inicial e voltar para o zoom anterior."
		},
		{
			element: "[data-tutorial='grade']",
			placement: 'auto',
			title: "Grade de coordenadas",
			content: "Ative a apresenta&ccedil;&atilde;o das linhas referentes aos paralelos e meridianos, com as indica&ccedil;&otilde;es de grau minuto e segundo. A grade &eacute; importante para demonstrar visualmente os efeitos da proje&ccedil;&atilde;o cartogr&aacute;fico sobre o mapa e tamb&eacute;m como refer&ecirc;ncia de localiza&ccedil;&atilde;o, principalmente quando se faz a impress&atilde;o do mapa ou exporta&ccedil;&atilde;o como uma imagem."
		},
		{
			element: "[data-tutorial='marcador']",
			placement: 'auto',
			title: "Marcador de regi&atilde;o",
			content: "Registre em mem&oacute;ria a abrang&ecirc;ncia geogr&aacute;fica atual do mapa para poder recuper&aacute;-la quando quiser."
		},
		{
			element: "[data-tutorial='referencia']",
			placement: 'auto',
			title: "Mapa de refer&ecirc;ncia",
			content: "Com o mapa de refer&ecirc;ncia voc&ecirc; pode se localizar em um contexto mais amplo que o mostrado no mapa, facilitando a percep&ccedil;&atilde;o de sua localiza&ccedil;&atilde;o."
		},
		{
			element: "[data-tutorial='escalas']",
			placement: 'auto',
			title: "Escalas",
			content: "As escalas s&atilde;o uma refer&ecirc;ncia num&eacute;rica e/ou gr&aacute;fica da rela&ccedil;&atilde;o entre as dimens&otilde;es vistas e medidas no mapa e as que existem de fato na realidade. A escala num&eacute;rica &eacute; uma raz&atilde;o de 1/valor, quanto maior o denominador menor &eacute; a escala, ou seja, mais 'afastado' se est&aacute; do terreno. A escala gr&aacute;fica permite, de forma aproximada, comparar medidas feitas no mapa com o valor no terreno, uma vez que apresenta uma barra com comprimento conhecido."
		},
		{
			element: "[data-tutorial='coordenadas']",
			placement: 'auto',
			title: "Coordenadas",
			content: "A posi&ccedil;&atilde;o do mouse sobre o mapa possui coordenadas conhecidas, calculadas em fun&ccedil;&atilde;o da escala, tamanho da tela e da proje&ccedil;&atilde;o cartogr&aacute;fica. Essas coordenadas s&atilde;o mostradas neste formul&aacute;rio, que tamb&eacute;m pode ser utilizado para localizar uma coordenada inserida manualmente. Normalmente as coordenadas s&atilde;o mostradas em graus-minutos-segundos, esse padr&atilde;o pode ser modificado conforme a sua necessidade. &Eacute; importante observar que o valor das coordeandas se torna mais preciso a medida que se 'aproxima' o mapa (escala menor)."
		},
		{
			element: ".ol-attribution",
			placement: 'auto',
			title: "Atribui&ccedil;&atilde;o",
			content: "As informa&ccedil;&otilde;es sobre autoria das camadas vistas no mapa s&atilde;o mostradas aqui."
		},
		{
			element: "[data-tutorial='ferramentas']",
			placement: 'auto left',
			title: "Ferramentas",
			content: "Al&eacute;m de navegar pelo mapa voc&ecirc; pode realizar opera&ccedil;&otilde;es mais avan&ccedil;adas, o que lhe permite explorar melhor os dados. Essas ferramentas, cujo uso &eacute; menos frequente, s&atilde;o organizadas em grupos e mostradas aqui. Clique no &iacute;cone para abrir a listagem."
		},
		{
			element: "[data-tutorial='camadas']",
			placement: 'auto left',
			title: "Camadas",
			content: "O mapa &eacute; uma composi&ccedil;&atilde;o de dados cartogr&aacute;ficos organizados em camadas (layers), umas sobre as outras. A 'pilha' de camadas &eacute; mostrada aqui, e permite que voc&ecirc; manipule o mapa ao ligar/desligar as camadas ou mesmo modificando a ordem delas na pilha."
		},
		{
			element: "[data-tutorial='catalogo']",
			placement: 'auto left',
			title: "Cat&aacute;logo",
			content: "Quando voc&ecirc; abrir um mapa ele pode j&aacute; ter sido configurado com algumas camadas, que voc&ecirc; poder&aacute; ligar/desligar. Voc&ecirc; n&atilde;o est&aacute; restrito a ver no mapa apenas as camadas que foram inicilamnte configuradas. Aqui voc&ecirc; poder&aacute; acessar um cat&aacute;logo com um conjunto bem maior de dados, que poder&atilde;o ser adicionados ao seu mapa quando voc&ecirc; quiser. Essas camadas adicionais s&atilde;o configuradas pelo administrador do sistema, mas voc&ecirc; poder&aacute; incluir camadas a partir da conex&atilde;o com diferentes fontes de dados abertos."
		},
		{
			element: "[data-tutorial='legenda']",
			placement: 'auto left',
			title: "Legenda",
			content: "As camadas do mapa cont&eacute;m diferentes tipos de dados que s&atilde;o representados em cores e s&iacute;mbolos os mais diversos. O conte&uacute;do de cada camada &eacute; organizado em 'classes', podendo existir uma ou mais. A legenda mostra essas classes e suas diferentes formas de representa&ccedil;&atilde;o, o que &eacute; fundamental para o correto entendimento daquilo que est&aacute; representado no mapa."
		},
		{
			element: "[data-tutorial='troca']",
			placement: 'auto left',
			title: "Altera entre GoogleMaps e mapa normal",
			content: "O Google Maps &eacute; uma das mais completas fontes de dados cartogr&aacute;ficos para mapas interativos. Esta op&ccedil;&atilde;o permite alternar o 'motor' de renderiza&ccedil;&atilde;o do mapa ativando/desativando o Google Maps. No 'modo' Google Maps as funcionalidades s&atilde;o um pouco diferentes do padr&atilde;o, permitindo por exemplo, o uso do StreetView."
		},
		{
			element: "[data-tutorial='busca']",
			placement: 'auto left',
			title: "Pesquisa",
			content: "Esta op&ccedil;&atilde;o oferece um sistema pesquisa de dados para que o mapa possa focar em um determinado lugar. A busca pode ser feita em servi&ccedil;os externos existentes na web ou em camadas, o que depende da configura&ccedil;&atilde;o do mapa interativo feita pelo administrador."
		},
		{
			element: "[data-tutorial='info']",
			placement: 'auto left',
			title: "Info",
			content: "Ao clicar sobre o mapa o sistema far&aacute; uma pesquisa nas camadas que estiverem ativas. Se no ponto clicado forem encontrados dados ser&aacute; aberto um bal&atilde;o com as informa&ccedil;&otilde;es. A a&ccedil;&atilde;o 'clicar e pesquisar' &eacute; ativada por padr&atilde;o, no entanto, algumas funcionalidades podem desativar essa a&ccedil;&atilde;o. Caso isso ocorra basta clicar novamente neste &iacute;cone."
		}
	]});