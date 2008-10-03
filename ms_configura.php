<?php
/*
Title: Variáveis de inicialização ms_configura.php

Nesse programa PHP são definidas as variáveis globais principais necessárias ao funcionamento do I3Geo do lado do servidor web.

O ms_configura é incluído em vários programas do i3Geo e os valores das variáveis devem ser editados 
caso a instalação do i3geo tenha sido feita em um diretório diferente do padrão.
No windows o diretório padrão é c:\ms4w\apache\htdocs\i3geo e no linux é /opt/www/html/i3geo

Para verificar a instalação do i3geo utilize o programa i3geo/testainstal.php, que pode fornecer algumas dicas
caso estejam ocorrendo problemas na iniciallização.

As variáveis de configuração são definidas em blocos diferentes conforme o sistema operacional (linux ou windows).

O ms_criamapa.php carrega o ms_configura.php e armazena a maior parte das variáveis na seção. Algumas variáveis
são também fornecidas para o cliente (navegador) na inicialização do mapa e ficam disponíveis em variáveis javascript.

File: i3geo/ms_configura.php

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
	Variable: $mensagemInicia
	
	Mensagem de inicialização mostrada pelo programa ms_criamapa.php
*/
$mensagemInicia = "I3Geo versão 4.1";
/*
	Variable: $tituloInstituicao
	
	Nome que será utilizado em alguns cabçalhos e títulos de páginas
*/
$tituloInstituicao = "MMA - Ministerio do Meio Ambiente";
if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN'))
{
	/*
	Variable: $navegadoresLocais
	
	Ip dos usuarios que podem navegar no servidor para acessar arquivos de dados geográficos.
	
	O i3geo possibilita que os usuários acessem dados geográficos no servidor diretamente, navegando pelo sistema de arquivos.
	Isso possibilita o acesso aos dados mesmo que não constem na árvore de temas definida em menutemas/menutemas.xml
	Por segurança, essa funcionalidade só é ativada para números IP específicos, definidos nessa variável.
	
	Para cada IP registrado, deve-se definir os diretórios que serão acessíveis, conforme mostrado abaixo.
	
	A validação do IP é feita com javascript, na inicialização do mapa, a variável javascript objmapa.navegacaoDir é definida como sim (caso $navegadoresLocais for diferente de "") ou nao.
	
	Se objmapa.navegacaoDir for igual a "sim", ou seja, $navegadoresLocais é diferente de "", na guia de adição de temas da interface HTML, será mostrada a opção de navegação. Portanto, se vc não quiser que essa opção seja ativada, mantenha essa variável igual a
	
	$navegadoresLocais = "";
	
	Com a opção ativa na interface do mapa, o ip do cliente é verificado e caso estiver registrado no array, a navegação pelos diretórios do servidor será permitida. Para mais detalhes, veja a ferramenta i3geo/ferramentas/navegacaodir
	  
	*/
	$navegadoresLocais = array(
							array(
							"ip"=>"127.0.0.1",
							"drives"=>array(
										array("caminho"=>"c:/","nome"=>"c"),
										array("caminho"=>"d:/","nome"=>"d")
										)
							)
						);
	/*
	Variable: $editores
	
	Ip dos usuarios que podem administrar o i3geo via navegador.
	
	Separe os ips por vírgula. Os usuários que tiverem seus ips listados, poderão editar o diretório i3geo/temas, desde que os mesmos tenham direito de leitura e escrita nesse diretório.
	*/
	$editores = array("127.0.0.1");
	/*
	Variable: $dir_tmp
	
	Caminho completo do diretório temporário utilizado pelo mapserver.
	*/
	$dir_tmp = "c:/ms4w/tmp/ms_tmp";
	/*
	Variable: $locaplic
	
	Caminho completo onde fica o I3Geo
	*/
	$locaplic = "c:/ms4w/apache/htdocs/i3geo";
	/*
	Variable: $temasdir
	
	Caminho completo do diretório onde ficam os arquivos .map correspondentes aos temas disponíveis
	*/
	$temasdir = $locaplic."/temas"; //"c:/ms4w/apache/htdocs/i3geo/temas";
	/*
	Variable: $temasaplic
	
	Caminho completo onde ficam os arquivos .map específicos do I3Geo
	*/
	$temasaplic = $locaplic."/aplicmap";//"c:\ms4w\apache\htdocs\i3geo\aplicmap";
	/*
	Variable: $locmapserv
	
	Localização do executável do Mapserver conforme deve ser acrescentado a URL após o nome do host.
	
	Essa variável é necessária em processos que utilizam o mapserver no modo CGI.
	
	Por exemplo, se o endereço for http://localhost/cgi-bin/mapserv.exe, a variável deverá conter apenas /cgi-bin/mapserv.exe
	*/
	$locmapserv = "/cgi-bin/mapserv.exe";
	/*
	Variable: $locsistemas
	
	Onde fica o xml que será utilizado para complementar a lista de temas disponíveis na árvore de adição de temas.
	
	Se for "" não será feita nenhuma inclusão.
	
	Com base no arquivo xml é montada uma árvore de opções que é adicionada à arvore de temas mostrada na guia "Adiciona" do i3geo.
	
	Por meio dessa nova árvore pode-se disparar programas PHP que executam operações especiais para a montagem de uma nova camada a ser adicionada ao mapa.
	
	Veja a documentação específica do arquivo sistemas.xml para maiores detalhes.
	*/
	$locsistemas = "";
	/*
	Variable: $locidentifica 
	
	Onde fica o xml que será utilizado para complementar a lista de temas dispponíveis na ferramenta de identificação.
	
	Se for "" não será feita nenhuma inclusão.
	
	Com base no arquivo xml é montada uma lista de opções que é adicionada à lista de temas mostrada ferramenta de identificação de elementos no mapa.
	
	Por meio dessa lista pode-se disparar programas PHP que executam operações especiais para a obtenção de dados com base em um par de coordenadas xy.
	
	Veja a documentação específica do arquivo identifica.xml para maiores detalhes.

	Para usar as funções default, utilize apenas $menutemas = ""; nesse caso, as funções serão obtidas do banco de dados de administração.

	*/
	$locidentifica = "";
	/*
	Variable: $locmapas 
	
	Onde fica o xml, para preencher a guia mapas.
	
	Se for vazio a guia não será mostrada no mapa.
	
	A guia "Mapas" mostra uma lista de links que permitem abrir mapas específicos. Essa lista é utilizada também pela versão mobile do i3geo.
	
	Veja a documentação específica do arquivo mapas.xml para maiores detalhes.

	Para usar as funções default, utilize apenas $menutemas = ""; nesse caso, as funções serão obtidas do banco de dados de administração.
	*/
	$locmapas = "";
	/*
	Variable: $R_path
	
	Onde esta o executavel do software R
	
	O R é um pacote estatístico utilizado pelo I3Geo para geração de gráficos e análises estatísticas
	Se vc não possui o R instalado, comente a linha abaixo
	*/
	$R_path = "c:/r/win/bin/R.exe";
	/*
	Variable: $postgis_con
	
	Depreciado - não é mais necessário na versão 5.x do Mapserver
	
	string de conexão com o banco de dados postgis utilizada para reallização de cálculos
	
	se não existir, deixe em branco
	*/
	$postgis_con = "";
	/*
	Variable: $srid_area
	
	Depreciado - não é mais necessário na versão 5.x do Mapserver
	
	srid utilizado nos cálculos que exigem projeção equivalente
	*/
	$srid_area = 1;
	/*
	Variable: $postgis_mapa
	
	String|array de conexão para acesso aos dados (opcional).
	
	Com o uso opcional dessa variável é possível esconder a string de conexão com o banco de dados. O Mapserver
	não permite esconder essa string, por isso, no i3geo, foi implementado um esquema de substituição.
	Toda vez que um objeto "map" é criado via PHP Mapscript, a string de conexão é substituída de " " para o valor de $postgis_mapa.
	Se não for desejado a substituição, deixe essa variável em branco.
	Se vc especificar essa variável, o mapa será forçado a recusar o modo de operação CGI.
	
	Até a versão 4.0, é possível definir apenas uma string como parâmetro de substituição.
	Da versão 4.1 em diante, pode-se definir um array onde a chave do array é a palavra
	que será utilizada no item CONNECTION do mapfile.
	
	Para mais detalhes veja a função substituiCon em classesphp/funcoes_gerais.php
	*/
	$postgis_mapa["geodados"] = "user=geodados password=geodados dbname=geodados host=pgsql1.mma.gov.br port=5432";
	/*
	Variable: $menutemas
	
	Array com a lista de arquivos xml que serão incluidos na guia de adição de temas. Se for "", será utilizado o arquivo default menutemas/menutemas.xml.
	
	Esse xml define a lista de temas que serão mostrados na guia "Adiciona".
	
	Para mais detalhes veja a documentação específica do arquivo menutemas/menutemas.xml
	
	Utilize o caminho completo no servidor para o nome dos wml, assim vc evita problemas em serviços do tipo kml e ogc
	
	Example:

	$menutemas = array(
		array("nomemenu"=>"","idmenu"=>"GEOPR","arquivo"=>"http://localhost/i3geo/admin/xmlmenutemas.php?id_menu=2","status"=>"fechado"),
		array("nomemenu"=>"","idmenu"=>"i3Geo","arquivo"=>"http://localhost/i3geo/admin/xmlmenutemas.php?id_menu=1","status"=>"aberto")
		);
		
	Para usar o menu default, utilize apenas $menutemas = "";, nesse caso, os menus serão obtidos do banco de dados de administração.
	*/
	$menutemas = "";

	/*
	Variable: $utilizacgi
	
	Variável indicando se o desenho do corpo do mapa será baseado no modo cgi.
	
	Por default, o mapserver desenha o mapa via php, porém, pode-se alterar o modo de desenho.
	
	No modo normal, a imagem do mapa é gerada e armazenada no diretório ms_tmp. Após a geração da imagem 
	o endereço do arquivo é retornado ao mapa (retorno via Ajax) e o javascript se encarrega de alterar o
	endereço da imagem no navegador. Com o uso do CGI a imagem não é gerada, sendo repassado ao navegador
	o endereço do cgi acrescentado do nome do mapfile, fazendo com que a imagem seja retornada diretamente.
	
	Em alguns casos o uso do cgi torna a aplicação mais rápida.
	*/
	$utilizacgi = "nao";
	/*
	 Variable: $atlasxml
	 
	 Indica o nome do arquivo xml que será utilizado na interface Atlas do i3geo.
	 
	Para usar o menu default, utilize apenas $atlasxml = "";, nesse caso, os Atlas serão obtidos do banco de dados de administração.
	*/
	$atlasxml = "../menutemas/atlas.xml";
	/*
	 Variable: $expoeMapfile
	 
	 Essa variável controla se o nome do mapfile atual será ou não retornado para a aplicação via ajax.
	 
	 Quando essa variável for definida como "nao" algumas das funcionalidades do i3geo poderão ficar prejudicadas, mas sem comprometimento das funções principais.
	*/
	$expoeMapfile = "";
	/*
	 Variable: $conexaoadmin
	 
	 Arquivo PHP que define a string de conexão (PDO) com o banco de dados administrativo.
	 
	 Esse arquivo é incluído no programa i3geo/admin/conexao.php e deve ser definido com o caminho completo.
	 
	 O banco de dados administrativo é utilizado para definir coisas como a árvore de temas, árvore de mapas, etc.
	 
	 O banco de dados, originalmente, é montado em SQLITE, porém, em ambientes corporativos, sugere-se o uso de bancos de daods mais robustos.
	 
	 Se você quiser utilizar a conexão default, baseado no SQLITE, mantenha essa variável vazia.
	 
	 O uso do banco de dados não é obrigatório, uma vez que os arquivos podem ser mantidos em disco (arquivos XML).
	
	 O programa PHP que estabelece a conexão deve retornar objetos com nomes padronizados. Veja o arquivo i3geo/admin/conexao.php para maiores detalhes.
	
	*/
	$conexaoadmin = "";
}
else //se for linux
{
	$editores = array("");
	$dir_tmp = "/var/tmp/ms_tmp";
	$temasdir = "/opt/www/html/i3geo/temas";
	$temasaplic = "/opt/www/html/i3geo/aplicmap";
	$locmapserv = "/cgi-bin/mapserv";
	$locaplic = "/opt/www/html/i3geo";
	$locsistemas= "";//"http://mapas.mma.gov.br/i3geo/menutemas/sistemas.xml";
	$locidentifica = "";//"http://mapas.mma.gov.br/i3geo/menutemas/identifica.xml";
	$locmapas = "";//"http://mapas.mma.gov.br/abremapa.php?id=xml";
	$R_path = "R";//se vc não instalou o R no seu servidor, tente o endereço $R_path = $locaplic."/pacotes/r/linux/r";
	$postgis_con = "";
	$srid_area = 1;
	$postgis_mapa["cnuc"] = "port=5432 dbname=adsi user=cnuc password=cnuc";
	$menutemas = "";
	$utilizacgi = "nao";
	$atlasxml = "";//"../menutemas/atlas.xml";
	$expoeMapfile = "sim";
	$conexaoadmin = "";//$locaplic."/admin/conexaomma.php";
}
?>
