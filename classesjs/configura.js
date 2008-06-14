/*
Title: classesjs/configura.js

Definição das variáveis de configuração da interface.

Aqui é feita a definição dos têrmos utilizados nos vários idiomas suportados pelo i3geo, definição dos
valores padrão das variáveis de configuração, definição do conteúdo do menu suspenso, definição das funções
que são executadas quando determinados eventos ocorrem, definição das funcionalidades dos botões, etc. 

O I3Geo utiliza variáveis (veja o item específico na documentação) globais que possibilitam 
alterar algumas das características da interface.
Essas variáveis recebem valores default quando o I3Geo é iniciado mas podem ser alterados 
antes da inicialização do mapa (método objmapa.inicializa()).
No arquivo aplicmapa/geral.htm existem exemplos de como fazer isso.
As variáveis globais podem também ser alteradas em tempo de execução.

Pode-se criar interfaces específicas com o i3geo onde essas variáveis são modificadas para atender
uma necessidade específica. Uma interface é um arquivo HTML que pode ser inicializado diretamente no navegador.
Veja o diretório i3geo/exemplos onde podem ser encontradas algumas interfaces.

Exemplo:

g_janelaMen = "nao"

objmapa = new Mapa()

objmapa.inicializa()

File: i3geo/classesjs/configura.js

About: Licença

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
/*
Section: internacionalização
*/
/*
Variable: g_traducao

Palavras ou frases utilizados na interface e utilizadas conforme a linguagem escolhida, permitindo a
tradução do i3geo para outros idiomas. Para utilizar uma palavra ou frase, utilize a função $trad, por exemplo:

<script>
objeto.innerHTML = $trad("p1");
</script>
*/
g_traducao = {
//texto da janela de mensagens
"p1": [
{
pt:"O I3Geo &eacute; software livre! Para download clique <a href='http://mapas.mma.gov.br/download' target=blank >aqui</a>. <b><a href='http://"+window.location.host+"/i3geo/mobile/qrcode.htm' target=blank >Qrcode mobile</a></b>",
en:"I3geo is a open source software! <a href='http://mapas.mma.gov.br/download' target=blank >Click</a> to download.",
es:"I3Geo es software libre. <a href='http://mapas.mma.gov.br/download' target=blank > Download</a>"
}],
//lista de propriedades do mapa
"p2": [
{
pt:"Tipo de imagem",
en:"Image type",
es:"Tipo de imagen"
}],
"p3": [
{
pt: "Legenda",
en: "Legend",
es:"Subt&iacute;tulo"
}],
"p4": [
{
pt:"Escala",
en:"Scale",
es:"Escala"
}],
"p5": [
{
pt: "Tamanho",
en:"Size",
es:"Tama&ntilde;o"
}],
"p6": [
{
pt: "Ativa/desativa entorno",
en:"Enable/Disable surrounding",
es:"Activar/desactivar entorno"
}],
"p7": [
{
pt: "Ativa/desativa logo",
en:"Enable/Disable logo",
es:"Activar/desactivar logomarca"
}],
"p8": [
{
pt: "Cor da selecao",
en:"Selection color",
es:"Color de la selecci&oacute;n"
}],
"p9": [
{
pt: "Cor do fundo",
en:"Background color",
es:"Color del fondo"
}],
"p10": [
{
pt: "Grade de coordenadas",
en:"Graticule",
es:"Grado de coordenadas"
}],
"p11": [
{
pt: "Template",
en:"Template",
es:"Template"
}],
"p12": [
{
pt: "Temporizador",
en:"Timer",
es:"Temporizador"
}],
"p13": [
{
pt: "Propriedades do mapa",
en:"Map properties",
es:"Propiedades del mapa"
}],
//itens do menu suspenso
"s1": [
{
pt: "Ajuda?",
en:"Help",
es:"Ayuda"
}],
"s2": [
{
pt: "An&aacute;lise",
en:"Analysis",
es:"An&aacute;lisis"
}],
"s3": [
{
pt: "Janelas",
en:"Windows",
es:"Ventanas"
}],
"s4": [
{
pt: "Arquivo",
en:"Files",
es:"Archivo"
}],
"s5": [
{
pt: "Propriedades",
en:"Properties",
es:"Propiedades"
}],
//submenus
"u1": [
{
pt: "Sobre o I3Geo",
en:"About",
es:"Sobre I3Geo"
}],
"u2": [
{
pt: "Sistema",
en:"System",
es:"Sistema"
}],
"u3": [
{
pt: "WikiBook",
en:"WikiBook",
es:"WikiBook"
}],
"u4": [
{
pt: "Tutoriais",
en:"Tutorials",
es:"Tutoriales"
}],
"u5": [
{
pt: "Blog",
en:"Blog",
es:"Blog"
}],
"u5a": [
{
pt: "Portal do software p&uacute;blico",
en:"Portal do software p&uacute;blico",
es:"Portal do software p&uacute;blico"
}],
"u6": [
{
pt: "Geometrias",
en:"Geometries",
es:"Geometr&iacute;as"
}],
"u7": [
{
pt: "Grade de poligonos",
en:"Polygon grid",
es:"Grado de pol&iacute;gonos"
}],
"u8": [
{
pt: "Grade de pontos",
en:"Grid of Points",
es:"Grado de puntos"
}],
"u9": [
{
pt: "Grade de hex&aacute;gonos",
en:"Grid of Hexagons",
es:"Grado de hex&aacute;gonos"
}],
"u10": [
{
pt: "Entorno(Buffer)",
en:"Buffer",
es:"Entorno (Buffer)"
}],
"u11": [
{
pt: "Centr&oacute;ide",
en:"Centroid",
es:"Centro geométrico"
}],
"u11a": [
{
pt: "Dist&acirc;ncia entre pontos",
en:"Point distance",
es:"Distancia de puntos"
}],
"u12": [
{
pt: "N pontos em poligono",
en:"N point in polygon",
es:"N puntos en pol&iacute;gono"
}],
"u13": [
{
pt: "Ponto em poligono/raster",
en:"Point in polygon/raster",
es:"Punto en pol&iacute;gono/matriz"
}],
"u14": [
{
pt: "Distribui&ccedil;&atilde;o de pontos",
en:"Point distribution",
es:"Distribuci&oacute;n de puntos"
}],
"u15": [
{
pt: "Barras de ferramentas",
en:"Toolbars",
es:"Barras de herramientas"
}],
"u16": [
{
pt: "Janela de mensagens",
en:"Message window",
es:"Ventana de mensajes"
}],
"u17": [
{
pt: "Salvar mapa",
en:"Save map",
es:"Guardar mapa"
}],
"u18": [
{
pt: "Carregar mapa",
en:"Load map",
es:"Cargar mapa"
}],
"u19": [
{
pt: "Pegar imagens",
en:"Get pictures",
es:"Tomar im&aacute;genes"
}],
"u20": [
{
pt: "Converter em WMS",
en:"Convert to WMS",
es:"Convertir en WMS"
}],
"u20a": [
{
pt: "Converter em KML",
en:"Convert to KML",
es:"Convertir en KML"
}],
"u21": [
{
pt: "Gerador de links",
en:"Link generator",
es:"Generador de enlaces"
}],
"u22": [
{
pt: "Grade",
en:"Graticule",
es:"Grado"
}],
"u23": [
{
pt: "Ponto",
en:"Point",
es:"Punto"
}],
"u24": [
{
pt: "Pol&iacute;gono",
en:"Polygon",
es:"Poligonos"
}],
"u25": [
{
pt: "Dissolve",
en:"Dissolv",
es:"Dissolve"
}],
"u26": [
{
pt: "Agrupa",
en:"Group",
es:"Agrupa"
}],
//arvore com a lista de temas
"t1": [
{
pt: "Camadas",
en:"Layers",
es:"Capas"
}],
"t2":[
{
pt:"arraste o tema aqui para excluir",
en:"Drag the layer here to remove",
es:"Arrastre el tema aqui para excluirlo"
}],
"t3":[
{
pt:"Clique para ligar ou desligar esse tema, mostrando-o ou n&atilde;o no mapa. Ap&oacute;s alterar o estado do tema, aguarde alguns instantes para o mapa ser redesenhado, ou clique no bot&atilde;o aplicar que ser&aacute; mostrado.",
en:"Turn the layer on/off on the map. Wait a few moments to get the map redesigned or press the button to apply it.",
es:"Haga clic para conectar o desconectar este tema, mostr&aacute;ndolo o no en el mapa. Despu&eacute;s de alterar el estado del tema, espere algunos instantes para que el mapa sea redise&ntilde;ado, o haga clic en el bot&oacute;n aplicar que se mostrar&aacute;."
}],
"t4":[
{
pt:"limpa sele&ccedil;&atilde;o",
en:"Clear selection",
es:"Limpia la selecci&oacute;n"
}],
"t5":[
{
pt:"Limpa sele&ccedil;&atilde;o existente nesse tema",
en:"Clear selection",
es:"Limpia la selecci&oacute;n existente en este tema"
}],
"t6":[
{
pt:"Clique para fazer o download desse tema no formato shapefile",
en:"Click to download in shapefile format",
es:"Haga clic para hacer el download"
}],
"t7":[
{
pt:"clique e arraste",
en:"dragging",
es:"Haga clic y arrastre"
}],
"t8":[
{
pt:"arraste para mudar a ordem",
en:"drag to change the draw order",
es:"Arrastre para cambiar la orden"
}],

"t9":[
{
pt:"A escala do tema &eacute; compat&iacute;vel com a escala do mapa",
en:"The scale of the layer is compatible with the scale of the map",
es:"La escala del tema es compatible con la escala del mapa"
}],
"t10":[
{
pt:"A escala do tema &eacute incompat&iacute;vel com a escala do mapa",
en:"The scale of the layer is incompatible with the scale of the map",
es:"La escala del tema es incompatible con la escala del mapa"
}],
"t11":[
{
pt:"A escala do tema n&atilde;o &eacute conhecida",
en:"The scale of the layer is not known",
es:"La escala del tema no es conocida"
}],
"t12":[
{
pt:"excluir",
en:"delete",
es:"Excluir"
}],
"t12a":[
{
pt:"Clique para excluir esse tema do mapa.",
en:"Delete layer of the map.",
es:"Haga clic para excluir este tema del mapa"
}],
"t13":[
{
pt:"sobe",
en:"up",
es:"Sube"
}],
"t14":[
{
pt:"Clique para subir esse tema na ordem de desenho",
en:"Drag the layer up",
es:"Haga clic para subir ese tema en la orden de dise&ntilde;o"
}],
"t15":[
{
pt:"desce",
en:"down",
es:"Baja"
}],
"t16":[
{
pt:"Clique para descer esse tema na ordem de desenho",
en:"Drag the layer down",
es:"Haga clic para bajar este tema en la orden de dise&ntilde;o"
}],
"t17":[
{
pt:"zoom para o tema",
en:"zoom to a layer",
es:"Zoom para el tema"
}],
"t18":[
{
pt:"Clique para ajustar o mapa de forma a mostrar todo o tema",
en:"Click to adjust the map in order to show the whole layer",
es:"Haga clic para ajustar el mapa de forma para que muestre todo el tema"
}],
"t18a":[
{
pt:"Op&ccedil;&otilde;es",
en:"Options",
es:"Opciones"
}],
"t18b":[
{
pt:"Legenda",
en:"Legend",
es:"Subtitulo"
}],
"t19":[
{
pt:"Altera a transparência do tema, possibilitando que as camadas inferiores possam ser vistas.",
en:"Change the layer transparency.",
es:"Altera la transparencia del tema, haciendo posible que las capas inferiores puedan verse"
}],
"t20":[
{
pt:"opacidade:",
en:"opacity",
es:"Opacidad"
}],
"t21a":[
{
pt:"Muda o nome atual do tema. Utilize para melhorar a legenda do mapa.",
en:"Change layer name.",
es:"Cambia el nombre actual del tema. Utilice para mejorar el subtitulo del mapa."
}],
"t21":[
{
pt:"novo nome:",
en:"new name",
es:"Nuevo nombre"
}],
"t22":[
{
pt:"Localize elementos no tema com base em seus atributos descritivos.",
en:"Find elements on the layer based on their descriptive attributes.",
es:"Ubique elementos en el tema con base en sus atributos descriptivos"
}],
"t23":[
{
pt:"procurar...",
en:"Search...",
es:"Buscar..."
}],
"t24":[
{
pt:"Crie uma nova camada no mapa para apresentar textos descritivos sobre esse tema, tendo como base a tabela de atributos.",
en:"Create a new layer to display descriptive texts on the subject, based on table of attributes.",
es:"Crear una nueva capa en el mapa para presentar textos descriptivos sobre este tema, teniendo como base la tabla de atributos"
}],
"t25":[
{
pt:"texto...",
en:"label...",
es:"texto..."
}],
"t26":[
{
pt:"Defina as etiquetas que ser&atilde;o mostradas quando o mouse &eacute; estacionado sobre um elemento desse tema.",
en:"Set the tooltips that will be shown when the mouse is over the element of that layer.",
es:"Defina las etiquetas que se mostrar&aacute;n cuando el rat&oacute;n se estaciona sobre un elemento de este tema"
}],
"t27":[
{
pt:"etiquetas...",
en:"tooltip...",
es:"Etiquetas..."
}],
"t28":[
{
pt:"Insira um filtro nesse tema para mostrar apenas determinadas informa&ccedil;&otilde;es, com base na tabela de atributos.",
en:"Filter based on the table of attributes.",
es:"Inserte un filtro en este tema para mostrar solo determinadas informaciones, con base en la tabla de atributos"
}],
"t29":[
{
pt:"filtro...",
en:"filter...",
es:"Filtro..."
}],
"t30":[
{
pt:"Veja a tabela de atributos relacionada a esse tema.",
en:"See the table of attributes related to that layer.",
es:"Vea la tabla de atributos relacionada con este tema"
}],
"t31":[
{
pt:"tabela...",
en:"table...",
es:"Tabla..."
}],
"t32":[
{
pt:"Abre o editor de legenda, permitindo a alteração da forma de representação desse tema.",
en:"Opens the editor of legend, allowing the modification of the form of representation of this theme.",
es:"Abre el editor de subtítulo, permitiendo la alteraci&oacute;n de la forma de representaci&oacute;n de este tema"
}],
"t33":[
{
pt:"editar legenda...",
en:"legend edit...",
es:"Editar subtítulo..."
}],
"t34":[
{
pt:"Mostra os dados desse tema em uma janela que acompanha o mouse.",
en:"The data shows that layer in a window that tracks the mouse.",
es:"Muestra los datos de este tema en una ventana que acompa&ntilde;a el rat&oacute;n"
}],
"t35":[
{
pt:"mostra em janela...",
en:"show in window",
es:"Muestra en la ventana..."
}],
"t36":[
{
pt:"tema vis&iacute;vel apenas em determinadas escalas",
en:"the layer is visible in specific scales",
es:"capa visible en ciertas escalas"
}],
"t37":[
{
pt:"gr&aacute;fico",
en:"graphic",
es:"gr&aacute;fico"
}],
//guia adiciona
"a1":[
{
pt:"procurar tema:",
en:"search layer:",
es:"Buscar datos:"
}],
"a2":[
{
pt:"Upload de shape file",
en:"Upload shape file",
es:"Upload de shape file"
}],
"a2b":[
{
pt:"Upload de arquivo dbf",
en:"Upload dbf file",
es:"Upload de archivo dbf"
}],
"a3":[
{
pt:"Download de dados",
en:"Data download",
es:"Download de datos"
}],
"a4":[
{
pt:"Conectar com servidor WMS",
en:"WMS server connection",
es:"Conectar con el servidor WMS"
}],
"a5":[
{
pt:"Conectar com GeoRss",
en:"GeoRss connection",
es:"Conectar con GeoRss"
}],
"a5a":[
{
pt:"Nuvem de tags",
en:"Tags cloud",
es:"Tags"
}],
"a6":[
{
pt:"Acesso aos arquivos do servidor",
en:"Access files in server directory",
es:"Acceso a los archivos del servidor"
}],
"a7":[
{
pt:"Temas",
en:"Layers",
es:"Temas"
}],
"a8":[
{
pt:"Clique no box ao lado do tema para ligar ou desligar, mostrando-o ou não no mapa. Após alterar o estado do tema, aguarde alguns instantes para o mapa ser redesenhado, ou clique no botão aplicar que será mostrado.",
en:"Click to connect or disconnect layer, showing it or not on the map. After changing the layer status, wait a few moments to be redesigned the map, or click in the button apply that will be shown.",
es:"Haga clic para conectar o desconectar este tema, mostr&aacute;ndolo o no en el mapa. Despu&eacute;s de alterar el estado del tema, espere algunos instantes para que el mapa sea redise&ntilde;ado, o haga clic en el bot&oacute;n aplicar que aparecer&aacute;"
}],
"a9":[
{
pt:"fonte",
en:"font",
es:"Fuente"
}],
"a10":[
{
pt:"c&oacute;digo:",
en:"code",
es:"C&oacute;digo"
}],
"a11":[
{
pt:"Sistemas",
en:"Systems",
es:"Sistemas"
}],
"a12":[
{
pt:"Abrir sistema",
en:"Open system",
es:"Abrir sistema"
}],
//guias principais
"g1":[
{
pt:"Temas",
en:"Layer",
es:"Temas"
}],
"g2":[
{
pt:"Adiciona",
en:"Add",
es:"Agrega"
}],
"g3":[
{
pt:"Legenda",
en:"Legend",
es:"Subtítulo"
}],
"g4":[
{
pt:"Mapas",
en:"Maps",
es:"Mapas"
}],
//outros
"o1":[
{
pt:"Aguarde...",
en:"Wait...",
es:"Espere..."
}],
"o2":[
{
pt:"busca r&aacute;pida...",
en:"quick search...",
es:"B&uacute;squeda r&aacute;pida..."
}],
"o3":[
{
pt:"Lendo imagem...",
en:"Loading images...",
es:"Leyendo imagen..."
}],
"o4":[
{
pt:"Aguarde...abrindo lente",
en:"Wait...Opening lens...",
es:"Espere...abriendo lente"
}],
"o5":[
{
pt:"Aguarde...iniciando",
en:"Wait...initializing",
es:"Espere...iniciando"
}],
"o6":[
{
pt:"din&acirc;mico",
en:"dynamic",
es:"Din&aacute;mico"
}],
//dicas das ferramentas
"d1":[
{
pt:"Digite as coordenadas de um ponto (X=longitude e Y=latitude) para localiz&acute;-lo no mapa. O centro do mapa ser&acute; deslocado para o ponto digitado.",
en:"Enter the coordinates of a point (X=longitude and Y=latitude) to localize it on the map. The center of the map is move to the point entered.",
es:"Digite las coordenadas de un punto (X=longitud e Y=latitud) para ubicarlas en el mapa. El centro del mapa se desplazar&aacute; para el punto digitado."
}],
"d2":[
{
pt:"Altera a escala do mapa ajustando-a para mostrar a mesma abrang&circ;ncia geogr&aacute;fica da inicializa&ccedil;&atilde;o.",
en:"Change the scale of the map adjusting it to show the same initial geographical cover.",
es:"Modifica la escala del mapa ajust&aacute;ndola para mostrar la misma &aacute;rea geogr&aacute;fica inicial"
}],
"d3":[
{
pt:"Amplia o mapa - coloca o ponto clicado no centro da tela ou amplia a regi&atilde;o indicada por um ret&acirc;ngulo.Ap&oacute;s ativada, clique e arraste o mouse sobre o mapa na &aacute;rea de zoom desejada.",
en:"Extends the map - place the clicked point in the center of the screen or extends the region indicated by a rectangular.After enabled, click and drag the mouse over the map in the area of zoom desired.",
es:"Ampl&iacute;a el mapa - coloca el punto donde se hizo clic en el centro de la pantalla o ampl&iacute;a la regi&oacute;n indicada por un rect&aacute;ngulo. Despu&eacute;s de activarla, haga clic y arrastre el rat&oacute;n sobre el mapa en el &aacute;rea de zoom deseada"
}],
"d4":[
{
pt:"Desloca a regi&atilde;o vis&iacute;vel no mapa. Ap&oacute;s ativada, clique e arraste o mouse sobre o mapa para deslocar a regi&atilde;o vis&iacute;vel.",
en:"Shifts the region visible on the map. Once activated, click and drag the mouse over the map to move the visible region.",
es:"Desloca la regi&oacute;n visible en el mapa"
}],
"d5":[
{
pt:"Amplia o mapa tendo como refer&ecirc;cia o centro atual.",
en:"Magnify the map with the reference the current center.",
es:"Ampl&iacute;a el mapa teniendo como referencia el centro actual"
}],
"d6":[
{
pt:"Reduz o mapa tendo como refer&ecirccia o centro atual.",
en:"Reduces the map as having reference the current center.",
es:"Reduce el mapa teniendo como referencia el centro actual"
}],
"d7":[
{
pt:"Mostra informa&ccedil;&otilde;es sobre um ponto no mapa. Ap&oacute;s ativada, pare o mouse por alguns instantes no ponto desejado ou clique sobre o mesmo.",
en:"Displays information about a point on the map. Once activated, stop the mouse for a few moments at the desired point or click on it.",
es:"Muestra informaci&oacute;n sobre un punto en el mapa. Despu&eacute;s de activarla, pare el rat&oacute;n por algunos instantes en el punto deseado o haga clic sobre el mismo."
}],
"d8":[
{
pt:"Mostra a extens&atilde;o geogr&aacute;fica atual em coordenadas geogr&aacute;ficas",
en:"It shows the extent of current geographic coordinates",
es:"Muestra la extensi&oacute;n geográfica actual en coordenadas geogr&aacute;ficas"
}],
"d9":[
{
pt:"Abre-fecha o mapa de refer&ecirc;ncia",
en:"Open-close the reference map ",
es:"Abre/cierra el mapa de referencia"
}],
"d10":[
{
pt:"Digite o novo valor de escala e clique no bot&atilde;o aplicar para alterar a escala do mapa",
en:"Enter the new value of scale and click the button Apply to change the scale of the map",
es:"Digite el nuevo valor de escala y haga clic en el bot&oacute;n aplicar para modificar la escala del mapa"
}],
"d11":[
{
pt:"Busca dados na Wikipedia na abrang&ecirc;ncia atual do mapa. Fa&ccedil;a um zoom no mapa antes de abrir essa op&ccedil;&atilde;o. Regi&ocirc;es muito extensas podem tornar a busca muito demorada",
en:"Search data on Wikipedia in the current scope of the map. Make a zoom on the map before opening this option. Regions very extensive can make a very long search ",
es:"Busca datos en Wikipedia en el alcance actual del mapa. Haga zoom en el mapa antes de abrir esta opci&oacute;n. Regiones muy extensas pueden ocasionar una b&uacute;squeda muy lenta"
}],
"d12":[
{
pt:"Imprime o mapa",
en:"Print the map",
es:"Imprime el mapa"
}],
"d13":[
{
pt:"Localiza o IP do usu&aacute;rio no mapa",
en:"Locates the user's IP on the map",
es:"Ubica el IP del usuario en el mapa"
}],
"d14":[
{
pt:"Gera arquivo para 3d",
en:"Generates file for 3d",
es:"Genera archivo para 3d"
}],
"d15":[
{
pt:"Abre o Google Maps, mostrando uma imagem de sat&eacute;lite da regi&atilde;o vista no mapa principal",
en:"Open Google Maps, showing a satellite image of the region's main views on the map",
es:"Abre Google Maps, mostrando una imagen de sat&eacute;lite de la regi&oacute;n en el mapa principal"
}],
"d16":[
{
pt:"Pesquisa documentos na base de dados Scielo (dados preliminares)",
en:"Search documents in the database Scielo (preliminary data)",
es:"Busca documentos en la base de datos Scielo (datos preliminares)"
}],
"d17":[
{
pt:"Projeto Confluence. Pontos de intersec&ccedil;&atilde;o de coordenadas observadas em campo",
en:"Confluence Project. Points of intersection of coordinates observed in field",
es:"Proyecto Confluence. Puntos de intersecci&oacute;n de coordenadas observadas en campo"
}],
"d18":[
{
pt:"Abre lente de amplia&ccedil;&atilde;o",
en:"Opens lens to expansion",
es:"Abre lente de ampliaci&oacute;n"
}],
"d19":[
{
pt:"Coloca as guias em uma janela m&oacute;vel",
en:"Open the tabs in a window mobile",
es:"Coloca las gu&iacute;as en una ventana m&oacute;vil"
}],
"d20":[
{
pt:"Redesenha o mapa com as configura&ccedil;&ocirc;es iniciais.",
en:"Reload the map with the initial configurations.",
es:"Redise&ntilde;a el mapa con las configuraciones iniciales"
}],
"d21":[
{
pt:"Mede a dist&acirc;ncia entre dois ou mais pontos clicados no mapa (menor dist&acirc;ncia). O c&aacute;lculo de dist&acirc;ncia &eacute; aproximado e sua precis&atilde;o depende da escala do mapa.",
en:"It measures the distance between two or more clicked points on the map (less distance). The calculation of distance is approximate and their accuracy depends on the scale of the map.",
es:"Mide la distancia entre dos o m&aacute;s puntos marcados en el mapa (menor distancia). El c&aacute;lculo de distancia es aproximado y su precisi&oacute;n depende de la escala del mapa"
}],
"d21a":[
{
pt:"Mede a &aacute;rea de um pol&iacute;gono desenhado na tela. O c&aacute;lculo de &aacute;ria &eacute; aproximado e sua precis&atilde;o depende da escala do mapa.",
en:"It measures the area on the map. The calculation of area is approximate and their accuracy depends on the scale of the map.",
es:"Mede a &aacute;rea de um pol&iacute;gono desenhado na tela. O c&aacute;lculo de &aacute;ria &eacute; aproximado e sua precis&atilde;o depende da escala do mapa."
}],
"d22":[
{
pt:"Insere pontos no mapa em coordenadas geogr&aacute;ficas. Ospontos inclu&iacute;dos podem ser transformados em linhas ou pol&iacute;gonos. Os pontos s&atilde;o armazenados em um tema tempor&aacute;rio, podendo-se fazer o download do arquivo shapefile.",
en:"Insert points on the map in geographical coordinates. Items included can be converted into lines or polygons. Items are stored in a temporary layer, can be to download shapefile.",
es:"Inserte puntos en el mapa en coordenadas geogr&aacute;ficas. Los puntos incluidos pueden transformarse en l&iacute;neas o pol&iacute;gonos. Los puntos se almacenan en un tema temporal, pudiendo hacerse el download del archivo shapefile."
}],
"d23":[
{
pt:"Insere um gr&aacute;fico no ponto clicado conforme os atributos existentes no tema escolhido. O tema deve possuir itens com valores num&eacute;ricos na tabela de atributos.",
en:"Insert a graphic in the clicked point as the exist attributes in the chosen layer. The layer must have items with numerical values in the table of attributes.",
es:"Inserte un gr&aacute;fico en el punto marcado seg&uacute;n los atributos existentes en el tema elejido. El tema debe tener puntos con valores num&eacute;ricos en la tabla de atributos"
}],
"d24":[
{
pt:"Abre as ferramentas para sele&ccedil;&atilde;o de elementos de um tema. Os elementos selecionados podem ser utilizados em outras opera&ccedil;&ocirc;es, como buffer e sele&ccedil;&atilde;o por tema.",
en:"Opens the tools to select elements of a layer. The elements selected can be used in other buffer or selection operation by layer  .",
es:"Abre las herramientas para selecci&oacute;n de elementos de un tema. Los elementos seleccionados pueden utilizarse en otras "
}],
"d25":[
{
pt:"Insere texto no mapa clicando em um ponto. Utilize essa op&ccedil;&atilde;o para adicionar informa&ccedil;&ocirc;es ao mapa.",
en:"Insert text on the map by clicking on a point. Use this option to add information on the map.",
es:"Inserte texto en el mapa haciendo clic en un punto. Utilice esta opci&oacute;n para agregar informaci&oacute;n al mapa"
}],
"d26":[
{
pt:"Escolha o visual para os botões e outras caracter&iacute;sticas visuais do mapa",
en:"Choose look for the buttons and other map's visual characteristics",
es:"Elija la vista para los botones y otras caracter&iacute;sticas visuales del mapa"
}]
};
/*
Variable: g_linguagem

Idioma utilizado na interface.

Ao utilizar a função $trad, o i3geo verifica essa variável para selecionar o texto que será utilizado.
A lista com os textos é definida na variável g_traducao.
A linguagem escolhida é também registrada no cookie i3geolingua, permitindo a persistência da escolha do usuário.
*/
g_linguagem = "pt";
var temp = pCookie("i3geolingua");
if(temp != undefined)
{g_linguagem = temp;}
/*
Section: Variáveis de configuração
*/
/*
Variable: g_templateLegenda

Template HTML que será utilizado na geração da legenda HTML.

A sintaxe utilizada na montagem do template é baseado na sintaxe do próprio Mapserver.
O HTML pode ser armazenado em i3geo/aplicmap ou em um outro endereço no servidor.
O template serve para definir o layout da legenda que é mostrada quando a guia legenda é ativada.
Se for definido como "", é utilizado o template i3geo/aplicmapa/legenda.htm.
*/
g_templateLegenda = "";
/*
Variable: g_kml

Indica se ao lado de cada tema, no menu de adição de temas, será mostrada a opção de geração do 
link para acesso aos dados via kml.

Veja:

<kml.php>, <funcoes.js>, <ferramentas.js>

Parâmetros:

sim|nao
*/
g_kml = "sim";
/*
Variable: g_qrcode

Indica se ao lado de cada tema, no menu de adição de temas, será mostrada a opção de geração do 
link para acesso ao código de barras no formato qrcode.

Veja:

<funcoes.js>, <qr_html.php>
 
Parâmetros:

sim|nao
*/
g_qrcode = "sim";
/*
Variable: g_posicaoLenteX

Define o posicionamento da lente de aumento em relação ao corpo do mapa.

Veja:

<redesenho.js>
*/
g_posicaoLenteX = 0;
/*
Variable: g_posicaoLenteY

Define o posicionamento da lente de aumento em relação ao corpo do mapa.

Veja:

<redesenho.js>

*/
g_posicaoLenteY = 0;
/*
Variable: g_autoRedesenho

Ativa o auto redesenho do mapa conforme o intervalo de tempo definido em segundos.

Após decorrido o tempo definido, o mapa é redesenhado. Se for 0 o temporizador não é ativado.

Veja:

<funcoes.js>
*/
g_autoRedesenho = 0;
/*
Variable: g_tempo_aplicar

Tempo, em segundos, que o botão 'aplicar' fica aguardando o usuário antes de redesenhar o mapa automaticamente.

Veja:

<funcoes.js>
*/
g_tempo_aplicar = 4000;
/*
Variable: g_embedLegenda

Indica se a legenda deve ser incluida no corpo do mapa.

Veja:

<iniciamma.js>

Values:

sim|nao

*/
g_embedLegenda = "nao";
/*
Variable: g_3dmap

Variável que define o nome do map_file que possuí o layer para uso na função 3d.
Pode ser utilizado o caminho completo, se não, busca no diretório aplicmap.

O mapfile deve conter um layer para cálculo dos valores de Z para compor o modelo do relevo
sobre o qual o mapa será desenhado.

Por padrão, o i3geo utiliza o mapfile aplicmpa/3dmap.map

Veja:

<ferramentas/3d/index.js>

*/
g_3dmap = "";
/*
Variable: g_opcoesTemas

Variável que define se as opções adicionais de cada tema serão mostradas.

As opções são aquelas apresentadas na lista de temas do mapa, quando um tema é expandido.

Veja:

<funcoes.js>

Values:

sim|nao

*/
g_opcoesTemas = "sim";
/*
Variable: g_mostraRosa

Variável que define se a rosa dos ventos deve ser mostrada junto ao mouse.

A rosa dos ventos permite a navegação pelo mapa sem a necessidade de alterar a opção atual.
Por exemplo, pode-se navegar pelo mapa mesmo estando na opção de identificação.

O aparecimento da rosa é temporizada.

Veja:

<funcoes.js>

Values:

sim|nao
*/
g_mostraRosa = "sim";
/*
Variable: g_visual

Indica qual o tipo de visual para abertura do mapa.

Os visuais disponíveis são obtidos do diretório i3geo/imagens/visual.

Veja:

<funcoes.js>, <iniciamma.js>
*/
g_visual = "default";

/*
Variable: g_janelaMen

Define se a janela de mensagens começará aberta ao iniciar o mapa.

Veja:

<funcoes.js>, <iniciamma.js>

Values:

sim|nao
*/
g_janelaMen = "sim";
/*
Variable: g_downloadbase

Define se na árvore de adição de temas, será mostrada a opção de download dos dados.

Veja:

<funcoes.js>

Values:

sim|nao
*/
g_downloadbase = "sim";
/*
Variable: g_conectargeorss

Define se na árvore de adição de temas, será mostrada a opção de conexão com GeoRSS.

Veja:

<funcoes.js>

Values:

sim|nao
*/
g_conectargeorss = "sim";
/*
Variable: g_nuvemTags

Define se na árvore de adição de temas, será mostrada a opção de busca de temas por tags.

Veja:

<funcoes.js>

Values:

sim|nao;
*/
g_nuvemTags = "sim";
/*
Variable: g_uploadlocal

Define se na árvore de adição de temas, será mostrada a opção de upload.

Veja:

<funcoes.js>

Values:

sim|nao
*/
g_uploadlocal = "sim";
/*
Variable: g_uploaddbf

Define se na árvore de adição de temas, será mostrada a opção de upload de arquivo dbf.

Veja:

<funcoes.js>

Values:

sim|nao
*/
g_uploaddbf = "sim";
/*
Variable: g_conectarwms

Define se na árvore de adição de temas, será mostrada a opção de conexão com WMS.

Veja:

<funcoes.js>

Values:

sim|nao
*/
g_conectarwms = "sim";
/*
Variable: g_docaguias

Variável que define se o mapa deve iniciar com as guias em janela ou não. As guias em janela causam o desenho de um mapa com tamanho extendido.

Veja:

<iniciamma.js>

Values:

sim|nao
*/
g_docaguias = "nao";
/*
Variable: g_barraFerramentas1

Define se a barra de ferramentas 1 será aberta ou não no mapa.

Veja:

<iniciamma.js>

Values:

sim|nao
*/
g_barraFerramentas1 = "sim";
/*
Variable: g_barraFerramentas2

Define se a barra de ferramentas 2 será aberta ou não no mapa.

Veja:

<iniciamma.js>

Values:

sim|nao
*/
g_barraFerramentas2 = "sim";
/*
Variable: g_fatordezoom

Variável interna para a barra de zoom.

*/
g_fatordezoom = 0;
/*
Variable: g_diminuixM

Diminui a largura do mapa em pixels no caso do navegador ser o IE.
Valores definidos em pixel.

Veja:

<iniciamma.js>
*/
g_diminuixM = 20;
/*
Variable: g_diminuixN

Diminui a largura do mapa em pixels no caso do navegador ser o FF.
Valores definidos em pixel.

Veja:

<iniciamma.js>
*/
g_diminuixN = 25;
/*
Variable: g_diminuiyM

Diminui a altura do mapa em pixels no caso do navegador ser o IE.
Valores definidos em pixel.

Veja:

<iniciamma.js>
*/
g_diminuiyM = 106;
/*
Variable: g_diminuiyN

Diminui a altura do mapa em pixels no caso do navegador ser o FF.
Valores definidos em pixel.

Veja:

<iniciamma.js>
*/
g_diminuiyN = 103;
/*
Variable: g_mapaRefDisplay

Indica a visibilidade do mapa de referência na inicialização

Veja:

<iniciamma.js>

Values:

block|none

*/
g_mapaRefDisplay = "block";
/*
Variable: g_funcaoTip

Função ajax que será executada para mostrar informações em etiquetas.

A função é executada pelo CPAINT e avaliada com "eval".

Por padrão a função é a verificaTipDefault. Vc pode especificar uma outra função se for desejado.

Veja:

<funcoes.js>
*/
g_funcaoTip = "verificaTipDefault()";
/*
Variable: g_tempotip

Tempo utilizado para verificar se o mouse está parado.

Se o mouse estiver parado, a função de mostrar tip é ativada.

Veja:

<funcoes.js>
*/
g_tempotip = 2500;
/*
Variable: g_tipotip

Define como o tip será mostrado. O tipo simples mostra apenas os dados, sem o cabeçalho.

Veja:

<funcoes.js>

Values:

simples|completo
*/
g_tipotip = "completo";
/*
Variable: g_tipoimagem

Indica o tipo de filtro de imagem que está ativo.
O filtro ativo é aplicado sobre a imagem toda a vez que o mapa é refeito.

Veja:

<funcoes.js>, <iniciamma.js>, <redesenho.js>
*/
g_tipoimagem = "nenhum";
/*
Variable: g_sistemas

Nome do arquivo xml com a lista de sistemas que serão mostrados na guia de adição de temas.
O valor dessa variável é definido no arquivo "ms_configura.php" e é preenchida utilizando o ajax logo na inicialização do i3geo.
*/
g_sistemas = "";
/*
Variable: destacaTamanho

Valor em pixel do retângulo de destaque de temas utilizado na ferramenta destacatema.

Veja:

<funcoes.js>
*/
destacaTamanho = 75;
/*
Variable: g_mensagempadrao

Mensagem padrão que será mostrada na janela de mensagens.

Veja:

<funcoes.js>
*/
g_mensagempadrao = $trad("p1");
/*
Variable: g_entorno

Indica se o preenchimento do entorno do mapa está ou não ativo.
Utilizado para criar o efeito de auto-preenchimento do mapa quando é executada a função pan.
É alterada em uma opção específica no menu suspenso.

Veja:

<funcoes.js>, <iniciamma.js>, <redesenho.js>

Values:

sim|nao
*/
g_entorno = "nao";
/*
Variable: g_guiaativa

Indica qual guia do mapa iniciará ativa.

Veja:

<funcoes.js>, iniciamma.js>
*/
g_guiaativa = "guia1";
/*
Section: Eventos
*/
/*
Variable: g_funcoesMouseParado

Nome das funções padrão que serão executadas quando o usuário estaciona o mouse sobre o mapa por alguns instantes.

Veja:

<iniciamma.js>
*/
g_funcoesMouseParado = new Array(
	"pegaCoordenadaUTM()",
	"verificaTip()",
	"mostraRosaDosVentos()"
);
/*
Variable: g_funcoesClickMapaDefault

Nome das funções padrão que serão executadas quando o usuário clicar no mapa.

As funções padrão podem ser alteradas, porém, pode-se acrescentar outras funções, além das padrão, utilizando-se o objeto objmapa.funcoesClickMapa

Quando o usuário clica em um botão para ativar uma ferramenta, pode-se definir a variável g_tipoacao e depois criticá-la na função para saber qual operação deve ser executada.

Veja:

<iniciamma.js>
*/
g_funcoesClickMapaDefault = new Array(
	"cliqueIdentifica()",
	"cliqueInserexy()",
	"cliqueInseregrafico()",
	"cliqueInseretoponimo()",
	"cliqueSelecao()",
	"cliqueMede()",
	"cliqueArea()",
	"cliqueSelecaoPoli()",
	"cliqueCapturaPt()"
);
/*
Variable: g_funcoesMousemoveMapaDefault

Nome das funções padrão que serão executadas quando o usuário mover o mouse sobre o mapa.

As funções padrão podem ser alteradas, porém, pode-se acrescentar outras funções

Quando o usuário clica em um botão para ativar uma ferramenta, pode-se definir a variável g_tipoacao e depois criticá-la na função para saber qual operação deve ser executada.

Veja:

<iniciamma.js>
*/
g_funcoesMousemoveMapaDefault = new Array(
	"movecursor()",
	"movePan()",
	"moveMede()",
	"movelentef()",
	"moveLonglat()",
	"moveSelecaoPoli()",
	"moveArea()"
);
/*
Variable: g_funcoesNevegaMapaDefault

Nome das funções padrão que serão executadas quando o usuário navegar pelo mapa.

Veja:

<iniciamma.js>
*/
g_funcoesNevegaMapaDefault = new Array(
	"atualizagoogle()",
	"atualizascielo()",
	"atualizawiki()",
	"atualizaconfluence()"
);
/*
Variable: g_listaPropriedades

Objeto com as funções que são incluidas no item propriedades do mapa

Veja:

<iniciamma.js>

Parâmetros:

text - texto que será mostrado na tela

url - função que será executada
*/
g_listaPropriedades = {
	"propriedades": [
	{ text: "p2", url: "javascript:tipoimagem()" },
	{ text: "p3", url: "javascript:opcoesLegenda()" },
	{ text: "p4", url: "javascript:opcoesEscala()" },
	{ text: "p5", url: "javascript:tamanho()" },
	{ text: "p6", url: "javascript:ativaEntorno()" },
	{ text: "p7", url: "javascript:ativaLogo()" },
	{ text: "p8", url: "javascript:queryMap()" },
	{ text: "p9", url: "javascript:corFundo()" },
	{ text: "p10", url: "javascript:gradeCoord()" },
	{ text: "p11", url: "javascript:template()" },
	{ text: "p12", url: "javascript:autoredesenha()" }
]};
/*
Section: Funcionalidades
*/
/*
Variable: oMenuData

Itens incluídos no menu suspenso

Veja:

<iniciamma.js>, <menususpenso.js>

Parâmetros:

text - texto que serámostrado na tela

url - função que será executada
*/
oMenuData = {
	"ajudas": [ 
	{ text: $trad("u1"), url: "http://www.softwarepublico.gov.br/spb/ver-comunidade?community_id=1444332" },
	{ text: $trad("u2"), url: "javascript:abreDoc()" },
	{ text: $trad("u3"), url: "http://pt.wikibooks.org/wiki/I3geo" },
	{ text: $trad("u4"), url: "http://mapas.mma.gov.br/wikibooki3geo" },
	{ text: $trad("u5"), url: "http://sistemas.mma.gov.br/blogs/index.php?blog=6" },
	{ text: $trad("u5a"), url: "http://www.softwarepublico.gov.br" }
	],
	"analise": [
    { text: $trad("u22"),url: "#", 
		submenu:
		{
			id: "menugrade", 
			itemdata: 
			[
				{text: $trad("u7"), url: "javascript:gradePol()"},
				{ text: $trad("u8"), url: "javascript:gradePontos()" },
				{ text: $trad("u9"), url: "javascript:gradeHex()" }
			] 
		}	
	},
    { text: $trad("u23"),url: "#", 
		submenu:
		{
			id: "menupontos", 
			itemdata: 
			[
				{ text: $trad("u11a"), url: "javascript:distanciaptpt()" },
				{ text: $trad("u12"), url: "javascript:nptPol()" },
				{ text: $trad("u13"), url: "javascript:pontoempoligono()" },
				{ text: $trad("u14"), url: "javascript:pontosdistri()" }
			] 
		}	
	},
    { text: $trad("u24"),url: "#", 
		submenu:
		{
			id: "menupoligonos", 
			itemdata: 
			[
				{ text: $trad("u11"), url: "javascript:centroide()" },
				{ text: $trad("u25"), url: "javascript:dissolve()" }
			] 
		}	
	},
	{ text: $trad("u6"), url: "javascript:analisaGeometrias()" },
	{ text: $trad("u10"), url: "javascript:buffer()" },
	{ text: $trad("u26"), url: "javascript:agrupaElementos()" }
	]
};
oMenuData.janelas = [
	{ text: $trad("u15"), url: "javascript:initJanelaZoom('1');initJanelaZoom('2')" },
	{ text: $trad("u16"), url: "javascript:initJanelaMen()" }        
	];
oMenuData.arquivo = [
	{ text: $trad("u17"), url: "javascript:salvaMapa()" },
	{ text: $trad("u18"), url: "javascript:carregaMapa()" },
	{ text: $trad("u19"), url: "javascript:pegaimagens()" },
	{ text: $trad("u20"), url: "javascript:convertews()" },
	//{ text: $trad("u20a"), url: "javascript:abreKml('mapfile')" },
	{ text: $trad("u21"), url: "../geradordelinks.htm" }
	];
/*
Variable: g_listaFuncoesBotoes

Objeto com a lista de funcionalidades que serão adicionadas ao mapa.

Essa lista pode ser modificada antes da inicialização do mapa.

A montagem das operações é feita no iniciamma.js.

As funcionalidades apenas são incluídas se o elemento HTML indicado em iddiv existir. Por isso, caso uma função não seja desejada, basta excluir o div do HTML utilizado no mapa.


Veja:

<iniciamma.js>

Parâmetros:

iddiv - id do elemento onde a ferramenta será incluída

dica - dica de tela que será acrescentada ao evento onmouseover

conteudo - conteudo de iddiv que será acrescentado como innerHTML

funcaoonclick - funcao que será incluida no onclick

constroiconteudo - função que ativará a opção. Essa opção atua como a opção conteúdo, porém, executa uma função para preenchimento do div.

*/
g_listaFuncoesBotoes = {
	"botoes": [
	{
		//Insere a opção de zoom anterior e posterior.
		iddiv:"historicozoom",
		dica:$trad("d1"),
		constroiconteudo:'ativaHistoricoZoom("historicozoom")'
	},
	{
		//Insere a opção de localização de coordenadas.
		iddiv:"localizarxy",
		dica:$trad("d1"),
		constroiconteudo:'ativaLocalizarxy("localizarxy")'
	},
	{
		//Ativa o botão que realiza a operação de zoom para a extensão total do mapa.
		iddiv:"zoomtot",
		dica:$trad("d2"),
		funcaoonclick:function(){zoomtot();}
	},
	{
		//Ativa o botão que realiza a operação de zoom interativo.
		iddiv:"zoomli",
		dica:$trad("d3"),
		funcaoonclick:function()
		{mudaiconf('zoomli');g_operacao='navega';}
	},
	{
		//Ativa o botão que realiza a operação de deslocamento (pan).
		iddiv:"pan",
		dica:$trad("d4"),
		funcaoonclick:function()
		{mudaiconf('pan');g_tipoacao='pan';g_operacao='navega';}
	},
	{
		//botão que realiza a operação de zoom in.
		iddiv:"zoomiauto",
		dica:$trad("d5"),
		funcaoonclick:function()
		{zoomiauto();}
	},
	{
		//botão que realiza a operação de zoom out
		iddiv:"zoomoauto",
		dica:$trad("d6"),
		funcaoonclick:function()
		{zoomoauto();}
	},
	{
		//botão que abre a função de identificação.
		iddiv:"identifica",
		dica:$trad("d7"),
		funcaoonclick:function()
		{mudaiconf('identifica');g_operacao='identifica';}
	},
	{
		//botão que abre a janela com o valor da extensão geográfica do mapa atual
		iddiv:"exten",
		dica:$trad("d8"),
		funcaoonclick:function()
		{mostraExten();}
	},
	{
		//botão que abre a janela com o mapa de referência
		iddiv:"referencia",
		dica:$trad("d9"),
		funcaoonclick:function()
		{initJanelaRef();}
	},
	{
		//apresentação da escala numérica
		iddiv:"escala",
		dica:$trad("d10"),
		constroiconteudo:'ativaEscalaNumerica("escala")'
	},
	{
		//botão de busca na wikipedia
		iddiv:"wiki",
		dica:$trad("d11"),
		funcaoonclick:function()
		{wiki();}
	},
	{
		//botão de busca de fotos
		iddiv:"buscafotos",
		dica:"Fotos",
		funcaoonclick:function()
		{buscafotos();}
	},
	{
		//botão de impressão
		iddiv:"imprimir",
		dica:$trad("d12"),
		funcaoonclick:function()
		{imprimir();}
	},
	{
		//botão de localização do usuário pelo IP
		iddiv:"ondeestou",
		dica:$trad("d13"),
		funcaoonclick:function()
		{zoomIP();}
	},
	{
		//abre a opção de geração de um modelo virtual de elevação
		iddiv:"v3d",
		dica:$trad("d14"),
		funcaoonclick:function()
		{wdocaf("400px","200px",g_locaplic+"/ferramentas/3d/index.htm","","","3d");}
	},
	{
		//Ativa o botão que realiza a operação de de busca no Google
		iddiv:"google",
		dica:$trad("d15"),
		funcaoonclick:function()
		{google();}
	},
	{
		//Ativa o botão que realiza a operação de de busca no site Scielo
		iddiv:"scielo",
		dica:$trad("d16"),
		funcaoonclick:function()
		{scielo();}
	},
	{
		//Ativa o botão que realiza a operação de de busca no site confluence
		iddiv:"confluence",
		dica:$trad("d17"),
		funcaoonclick:function()
		{confluence();}
	},
	{
		//Ativa o botão que abre a lente de aumento
		iddiv:"lentei",
		dica:$trad("d18"),
		funcaoonclick:function()
		{lenteDeAumento();}
	},
	{
		//Coloca as guias em uma janela móvel
		iddiv:"encolheFerramentas",
		dica:$trad("d19"),
		funcaoonclick:function()
		{docaguias();}
	},
	{
		//botão de reinicialização do mapa que restaura as condições iniciais do mapa
		iddiv:"reinicia",
		dica:$trad("d20"),
		funcaoonclick:function()
		{reiniciaMapa();}
	},
	{
		//botão de medição de distâncias
		iddiv:"mede",
		dica:$trad("d21"),
		funcaoonclick:function()
		{mede();}
	},
	{
		//botão de medição de área
		iddiv:"area",
		dica:$trad("d21a"),
		funcaoonclick:function()
		{area();}
	},
	{
		//botão de digitalização
		iddiv:"inserexy",
		dica:$trad("d22"),
		funcaoonclick:function()
		{inserexy();}
	},
	{
		//botão de inclusão de gráficos
		iddiv:"inseregrafico",
		dica:$trad("d23"),
		funcaoonclick:function()
		{inseregrafico();}
	},
	{
		//botão de seleção
		iddiv:"selecao",
		dica:$trad("d24"),
		funcaoonclick:function()
		{selecao();}
	},
	{
		//botão de inserção de toponímia
		iddiv:"textofid",
		dica:$trad("d25"),
		funcaoonclick:function()
		{textofid();}
	},
	{
		//opções de alteração do visual do mapa
		iddiv:"visual",
		dica:$trad("d26"),
		funcaoonclick:"",
		constroiconteudo:'visual("visual")'
	},
	{
		//monta o menu suspenso
		iddiv:"menus",
		constroiconteudo:'montaMenuSuspenso("menus")'
	},
	{
		//ativa as opções de busca rápida
		iddiv:"buscaRapida",
		constroiconteudo:'ativaBuscaRapida("buscaRapida")'
	},
	{
		//sobe os botoes da barra de ferramentas
		iddiv:"sobeferramentas",
		funcaoonclick:function()
		{sobeferramentas();}
	},
	{
		//desce os botoes da barra de ferramentas
		iddiv:"desceferramentas",
		funcaoonclick:function()
		{desceferramentas();}
	}	
]};
