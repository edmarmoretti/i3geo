g_traducao_ajuda = {
	ferramentas: {
		"1": {
			titulo: "Filtro de cores",
			diretorio:"i3geo/ferramentas/tipoimagem",
			categoria:"1",
			pt:"O filtro possibilita gerar efeitos de coloração no mapa. É aplicado sobre a imagem gerada toda vez que o mapa é alterado. No caso de temas baseados em dados RASTER, os níveis de cores obtidos com a ferramenta de identificação não são alterados.",
			complemento:"Os filtros podem provocar um tempo maior de desenho do mapa, devendo ser utilizados com cuidado. As opções sépia e tons de cinza utilizam algorítmos próprios do i3Geo, já as demais, utilizam a opção de filtro disponível com o PHP 5. Mais detalhes <a href='http://www.php.net/manual/pt_BR/function.imagefilter.php' >aqui</a>."
		},
		"2": {
			titulo: "Legenda",
			diretorio:"i3geo/ferramentas/opcoes_legenda",
			categoria:"1",
			pt:"A legenda do mapa é utilizada em várias opções do i3Geo e pode também ficar inserida na própria imagem do mapa. A legenda mostra os símbolos utilizados no desenho de cada tema, podendo-se alterar características como fonte, tamanho dos textos, tamanho dos retângulos com os símbolos, etc.",
			complemento:"Antes de aplicar uma alteração, você pode testar os parâmetros escolhidos para avaliar o resultado. No caso dos parâmetros que definem cores, utilize -1,-1,-1 para anular seu efeito."
		},
		"3": {
			titulo: "Barra de escala",
			diretorio:"i3geo/ferramentas/opcoes_escala",
			categoria:"1",
			pt:"A barra de escala é uma imagem inserida no mapa que mostra a relação entre uma medida feita no mapa e no mundo real. A barra pode ser modificada especificando-se seu tamanho, número de divisões e cores.",
			complemento:"Existem dois modelos básicos para a escala: linear e bloco. Para não mostrar a escala no mapa, escolha a 'sem escala' na opção estilo."
		},
		"4": {
			titulo: "Tamanho do mapa",
			diretorio:"i3geo/ferramentas/opcoes_tamanho",
			categoria:"1",
			pt:"O tamanho do mapa é definido automaticamente quando o i3Geo é aberto, buscando-se otimizar o uso do espaço disponível no monitor. A opção de modificação do tamanho altera apenas o corpo do mapa, forçando o ajuste dos outros elementos, o que nem sempre provoca bons resultados.",
			complemento:"O ajuste do tamanho do mapa pode ser utilizado para gerar imagens em tamanhos específicos, principalmente para efeitos de impressão. A medida do tamanho utilizado é pixel, que corresponde ao tamanho mínimo de uma célula da imagem do mapa. Para calcular o tamanho do mapa em outra unidade de medida, necessário nos casos em que se deseja imprimir o mapa, deve ser feito considerando-se a resolução de impressão desejada."
		},
		"5": {
			titulo: "Cor da seleção",
			diretorio:"i3geo/ferramentas/opcoes_querymap",
			categoria:"1",
			pt:"A cor da seleção é utilizada para mostrar no mapa os elementos de um determinado tema que estão selecionados. A seleção consiste em destacar elementos para uso em determinadas operações, como por exemplo o cálculo de entorno (buffer). A definição da cor é baseada no modelo R,G,B, sendo que cada componente varia de 0 a 255.",
			complemento:"Ao definir os valores de RGB, separe-os com ','. Quando um tema possuir elementos selecionados, é incluída uma marca antes do nome do tema na lista de camadas disponíveis no mapa."
		},
		"6": {
			titulo: "Cor do fundo",
			diretorio:"i3geo/ferramentas/opcoes_fundo",
			categoria:"1",
			pt:"O corpo do mapa é constituído por uma imagem gerada com tamanho fixo. Essa imagem possuí uma cor padrão, sobre a qual são sobrepostas as camadas. Por padrão, a cor do fundo é definida como azul. A definição da cor é baseada no modelo R,G,B, sendo que cada componente varia de 0 a 255.",
			complemento:"Ao definir os valores de RGB, separe-os com ','. Ao utilizar as opções de conversão do mapa atual para kml ou WMS, a alteração da cor do fundo para 255,255,255 oferece melhores resultados na visualização dos dados."
		},
		"7": {
			titulo: "Grade de coordenadas",
			diretorio:"i3geo/ferramentas/gradecoord",
			categoria:"1",
			pt:"A grade de coordenadas é formada por linhas verticais e horizontais representando determinadas latitudes e longitudes. A grade é um dos elementos principais na definição de um mapa, sendo utilizada na impressão ou geração de figuras.",
			complemento:"Ao adicionar uma grade, é criado uma nova camada no mapa, possibilitando que mais de uma grade seja criada. Uma grade pode ou não conter os textos indicando os valores de lat long, permitindo que se crie uma grade com espaçamento de linhas diferente do espaçamento dos textos."
		},
		"8": {
			titulo: "Templates",
			diretorio:"i3geo/ferramentas/template",
			categoria:"1",
			pt:"Um template define como os componentes de um mapa são organizados no navegador. O administrador do i3Geo pode criar templates diferentes conforme as necessidades do usuário, sendo que alguns templates são fornecidos com o próprio i3Geo.",
			complemento:"A criação de templates é uma tarefa do administrador do i3Geo. Para abrir um template específico diretamente, utilize a URL que é mostrada no navegador quando um template é escolhido."
		},
		"9": {
			titulo: "Temporizador",
			diretorio:"i3geo/ferramentas/opcoes_autoredesenha",
			categoria:"1",
			pt:"O temporizador permite definir um intervalo de tempo em segundos que irá disparar o redesenho do mapa.",
			complemento:"Quando o mapa é redesenhado, as camadas existentes são lidas novamente para compor o novo mapa. Essa opção é útil quando existirem camadas no mapa que sofrem atualizações frequentes, como por exemplo o deslocamento de aeronaves, carros ou navios."
		},
		"10": {
			titulo: "Salvar mapa",
			diretorio:"i3geo/ferramentas/salvamapa",
			categoria:"2",
			pt:"O mapa que o usuário está utilizando pode ser salvo localmente (na máquina do usuário) para ser aberto posteriormente. Isso permite que um trabalho seja continuado em outro momento, uma vez que o mapa em uso é sempre perdido quando o usuário fecha o navegador.",
			complemento:"Os dados locais que foram criados não são salvos, sendo necessário o seu download quando desejado. Isso afeta as opções de inclusão de pontos ou conversão de elementos selecionados em camadas."
		},
		"11": {
			titulo: "Carregar mapa",
			diretorio:"i3geo/ferramentas/carregamapa",
			categoria:"2",
			pt:"O mapa que o usuário está utilizando pode ser salvo localmente (na máquina do usuário) para ser aberto posteriormente. Isso permite que um trabalho seja continuado em outro momento, uma vez que o mapa em uso é sempre perdido quando o usuário fecha o navegador.",
			complemento:"A opção de carregar um mapa permite enviar para o servidor, onde o i3Geo está instalado, o mapa que foi salvo anteriormente."
		},
		"12": {
			titulo: "Converter em WMS",
			diretorio:"i3geo/ferramentas/convertews",
			categoria:"2",
			pt:"",
			complemento:""
		}
	}
};

g_traducao_ajuda_categorias = {
	"1":{titulo:"Propriedades do mapa"},
	"2":{titulo:"Arquivos"}
};
