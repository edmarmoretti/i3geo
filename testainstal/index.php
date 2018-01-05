<?php
/**
 * Pagina inicial do i3Geo
 * Voce pode utilizar o parametro customDir para indicar a pasta onde
 * as interfaces de mapa estao. Nesse caso, os links utilizarao esse parametro
 * Exemplo: localhost/i3geo/init/index.php?customDir=minhaPasta
 *
 * minhaPasta deve estar dentor da pasta i3geo.
 *
 * Se dentro da pasta $customDir existir um arquivo chamado index.php sera feito o include
 * na pagina.
 */
/**
 * Cria as pastas temporarias que o i3Geo precisa, caso nao existam
 */
define("ONDEI3GEO", "..");
include ("../ms_configura.php");
include ($locaplic . "/classesphp/carrega_ext.php");
include ($locaplic . "/classesphp/funcoes_gerais.php");
//aqui e feito o include de admin. Poderia ser feito de classesphp
//mas caso a pasta admin nao existir, o programa nao roda, o que e desejado que ocorra
include ("../admin/php/funcoesAdmin.php");
include ("../init/head.php");

?>
<body style="padding-top: 60px;" id="topo">
    <nav id="navbar" class="navbar navbar-default navbar-fixed-top">
        <div class="container-fluid">
            <div class="navbar-header">
                <a class="navbar-brand" href="../init/index.php?home=">
				<?php echo $mensagemInicia;?> <i class="fa fa-home fa-1x"></i>
                </a>
            </div>
        </div>
    </nav>
    <div class="container-fluid migalha">
        <div class="row">
            <div class="btn-group btn-breadcrumb">
                <a class="btn btn-default" href="../init/index.php?home=">i3Geo</a>
                <a class="btn btn-default" style="pointer-events: none">Teste de instala&ccedil;&atilde;o</a>
            </div>
        </div>
    </div>
    <nav class="navbar-fixed-bottom">
        <div class="container-fluid" id="mensagemLogin"></div>
    </nav>
    <div class="container-fluid">
		<?php
// TODO Incluir opcoes para carregar as listas default do i3Geo como sistemas de identificacao e WMS
// verifica se o login pode ser realizado
if (isset($i3geoPermiteLogin) && $i3geoPermiteLogin == false) {
    header("HTTP/1.1 403 Login desativado");
    exit();
}
// $i3geoPermiteLoginIp vem de ms_configura.php
if (isset($i3geoPermiteLoginIp)) {
    checaLoginIp($i3geoPermiteLoginIp);
}
?>
        <script src='../js/compactados/mustache.js'></script>
        <script src='../js/compactados/dicionario_compacto.js'></script>
        <script src='../js/compactados/util_compacto.js'></script>
        <script src='../js/compactados/idioma_compacto.js'></script>
        <script src='../init/dicionario.js'></script>
        <script>
		//menu
		var html = Mustache.to_html(
				$("#menuTpl").html(),
				i3GEO.idioma.objetoIdioma(g_traducao_init)
		);
		$("#menuTpl").html(html);
		$('.hidden').removeClass('hidden');
		<?php
if ($i3geomaster[0]["usuario"] == "admin" && $i3geomaster[0]["senha"] == "admin") {
    echo "var men = '<div class=\'alert alert-danger\' style=\'margin-bottom:0px;\' >' + $" . "trad(19,g_traducao_init) + '</div>';";
} else {
    echo "var men = '';";
}
?>
		$("#mensagemLogin").html(men);
		</script>
		<?php
if (empty($_POST["senha"]) || empty($_POST["usuario"])) {
    $d = dirname(dirname(__FILE__));
    echo <<<HTML
		<div class="alert alert-danger" role="alert">
 			Essa conex„o pode n„o ser segura e os dados de usu·rio/senha podem ser descobertos
 		</div>
 		<div class="col-lg-2 col-md-0">
 		</div>
 		<div class="well bs-component col-lg-8 col-md-12">
			<form action="index.php" method="post" id="formularioLoginMaster">
		 		<div class="form-group">
		 			<label for="inputUsuario" >Digite o nome do usu·rio master cadastrado em ms_configura.php</label>
		 			<input type="text" class="form-control" id="inputUsuario" placeholder="usu&aacute;rio" name="usuario">
		 		</div>
		 		<div class="form-group">
		 			<label for="inputSenha" >Digite a senha</label>
		 			<input type="password" class="form-control" id="inputSenha" placeholder="senha" name="senha">
		 		</div>
		 		<button type="submit" class="btn btn-primary">Enviar</button>
		 		<div class="checkbox">
		 			<label>
		 				<input type=checkbox name="criaPastaMstmp" > Cria a pasta $dir_tmp
		 			</label>
		 		</div>
		  		<div class="checkbox">
		 			<label>
		 				<input type=checkbox name=criaLink /> Cria o link simbolico $d/../ms_tmp
		 			</label>
		 		</div>
		 		<div class="checkbox">
		 			<label>
		 				<input type=checkbox name=permPastaI3geo /> Altera as permissoes da pasta $locaplic <br>
					</label>
		 		</div>
			</form>
		</div>
		<div class="col-lg-2 col-md-0">
 		</div>
		<script>
		$.material.init();
		</script>
HTML;
    // }
    exit();
} else {
    $continua = \admin\php\funcoesAdmin\verificaMaster($_POST["usuario"], $_POST["senha"], $i3geomaster);
    if ($continua == false) {
        echo <<<HTML
				<div class="alert alert-danger" role="alert">
				Usu&aacute;rio n&atilde;o registrado em i3geo/ms_configura.php na vari&aacute;vel i3geomaster
				</div>
HTML;
        exit();
    }
}
error_reporting(E_ALL);
$ip = "UNKNOWN";
if (getenv("HTTP_CLIENT_IP"))
    $ip = getenv("HTTP_CLIENT_IP");
else if (getenv("HTTP_X_FORWARDED_FOR"))
    $ip = getenv("HTTP_X_FORWARDED_FOR");
else if (getenv("REMOTE_ADDR"))
    $ip = getenv("REMOTE_ADDR");
else
    $ip = "UNKNOWN";
$os = PHP_OS;
$phpversion = phpversion();
echo <<<HTML
		<div class="page-header">
			<h1>TESTE DE INSTALA&Ccedil;&Atilde;O DO i3Geo</h1>
			<h2>$mensagemInicia</h2>
		</div>

		<div class="alert alert-warning" role="alert">
		Observa&ccedil;&atilde;o: se voc&ecirc; estiver usando Linux e a biblioteca CAIRO estiver
		instalada corretamente no Mapserver, edite os arquivos i3geo/aplicmap/geral1fedorav6.map e
		geral1debianv6.map para remover os coment&aacute;rios do OUTPUTFORMAT que utiliza SVG com o drive Cairo
		</div>
		<div class="alert alert-info" role="alert">
		Para mais informa&ccedil;&otilde;es sobre a instala&ccedil;&atilde;o de pacotes complementares,
		como o SAIKU e ferramentas que precisam de softwares espec&iacute;ficos</div>
		<div class="alert alert-success" role="alert">
			<li>Seu endere&ccedil;o IP <span class="label label-default">$ip</span></li>
			<li>Sistema operacional <span class="label label-default">$os</span></li>
			<li>PHP (a vers&atilde;o deve ser a 5x) <span class="label label-default">$phpversion</span></li>
		</div>
HTML;

$versao = versao();
$versao = $versao["principal"];
$exts = get_loaded_extensions();
if (! function_exists("ms_GetVersion")) {
    echo '<div class="alert alert-danger" role="alert">Verifique se PHP-Mapscript est· instalado</div>';
}
echo "<h3>MapServer:</h3><pre>";
echo ms_GetVersion();
echo "</pre>";
echo "<h3>Array que armazena os par&acirc;metros da vers&atilde;o:</h3><pre>";
var_dump(versao());
echo "</pre>";
echo "<h3>Configura&ccedil;&atilde;o da proje&ccedil;&atilde;o default: (<a href='http://moodle.gvsig-training.com/mod/book/view.php?id=5090&chapterid=114'>saiba mais</a>)</h3>";
if (! isset($i3GeoProjDefault)) {
    echo '<div class="alert alert-warning" role="alert">A vari&aacute;vel de configura&ccedil;&atilde;o i3GeoProjDefault n&atilde;o existe no ms_configura.php. Ser&aacute; utilizada a proje&ccedil;&atilde;o 4326</div>';
}
echo "<pre>";
var_dump(pegaProjecaoDefault());
echo "</pre>";
if (! function_exists("ms_GetVersion")) {
    echo '<div class="alert alert-warning" role="alert">PARECE QUE O MAPSERVER NAO ESTA INSTALADO!!!</div>';
}
if (get_cfg_var("safe_mode") == 1) {
    echo '<div class="alert alert-warning" role="alert">Problema: safe_mode no php.ini deveria estar como Off. O i3Geo n&atilde;o ir&aacute; funcionar!!!</div>';
}
echo <<<HTML
		<h3>Acentua&ccedil;&atilde;o</h3>
		<pre>
As seguintes letras devem aparecer corretamente acentuadas:
<b>Á«„‚·¡Û”</b>
Caso contr&aacute;rio, verifique os par&acirc;metros de configura&ccedil;&atilde;o do Apache
<b>AddDefaultCharset (httpd.conf) e default_charset (php.ini)</b>
(default_charset='' no php.ini geralmente funciona)
		</pre>
HTML;
// executa as opcoes linux definidas no formulario
echo "<h3>Aplicando as opera&ccedil;&otilde;es opcionais</h3><pre>";
if (! empty($_POST["criaPastaMstmp"]) && $_POST["criaPastaMstmp"] == "on") {
    echo "Criando a pasta $dir_tmp";
    if (! file_exists($dir_tmp)) {
        @mkdir($dir_tmp, 0744);
        chmod($dir_tmp, 0744);
    }
    if (! file_exists($dir_tmp)) {
        echo "<span style=color:red >Arquivo $dir_tmp n&atilde;o pode ser criado";
    } else {
        echo "...OK";
    }
} else {
    echo "Cria&ccedil;&atilde;o de pastas n&atilde;o solicitada\n";
}
if (! empty($_POST["criaPastaMstmp"]) && $_POST["criaLink"] == "on") {
    $d = dirname(dirname(__FILE__)) . "/../ms_tmp";
    echo "Criando o link simb&oacute;lico $d\n";
    if (! file_exists($d)) {
        @symlink($dir_tmp, $d);
        chmod($d, 0744);
    }
    if (! file_exists($d)) {
        echo "<span style=color:red >Link $d n&atilde;o pode ser criado\n";
    } else {
        echo "...OK\n";
    }
} else {
    echo "Cria&ccedil;&atilde;o de link simb&oacute;lico n&atilde;o solicitada\n";
}
if (! empty($_POST["criaPastaMstmp"]) && $_POST["permPastaI3geo"] == "on") {
    echo "Alterando permiss&otilde;es i3geo i3geo/temas i3geo/admin i3geo/admin/admin.db\n";
    if (file_exists($locaplic)) {
        chmod($locaplic, 0744);
        chmod($locaplic . "/temas", 0744);
        chmod($locaplic . "/admin", 0744);
        chmod($locaplic . "/admin/admin.db", 0744);
        echo "...OK\n";
    }
} else {
    echo "Altera&ccedil;&otilde;es de permiss&atilde;o n&atilde;o solicitada\n";
}
echo "</pre>";
echo "<h3>Extens&otilde;es PHP</h3><pre>";
if (! extension_loaded("curl")) {
    echo "<div class='alert alert-danger' role='alert'>Problema: n&atilde;o est&aacute; instalado a curl que pode afetar algumas funcionalidades do i3Geo</div>";
}
if (! extension_loaded("json")) {
    echo "<div class='alert alert-danger' role='alert'>Problema: n&atilde;o est&aacute; instalado a json</div>";
}
if (! extension_loaded("libxml")) {
    echo "<div class='alert alert-danger' role='alert'>Problema: n&atilde;o est&aacute; instalado a libxml</div>";
}
if (! extension_loaded("PDO")) {
    echo "<div class='alert alert-danger' role='alert'>Problema: n&atilde;o est&aacute; instalado a PDO</div>";
}
if (! extension_loaded("pdo_sqlite")) {
    echo "<div class='alert alert-danger' role='alert'>>Problema: n&atilde;o est&aacute; instalado a pdo_sqlite</div>";
}
if (! extension_loaded("SQLite") && ! extension_loaded("sqlite3")) {
    echo "<div class='alert alert-danger' role='alert'>Problema: n&atilde;o est&aacute; instalado a SQLite</div>";
}
if (! extension_loaded("SimpleXML")) {
    echo "<div class='alert alert-danger' role='alert'>Problema: n&atilde;o est&aacute; instalado a SimpleXML</div>";
}
if (! extension_loaded("dom")) {
    echo "<div class='alert alert-danger' role='alert'>Problema: n&atilde;o est&aacute; instalado a dom</div>";
}
if (! extension_loaded("xml")) {
    echo "<div class='alert alert-danger' role='alert'>Problema: n&atilde;o est&aacute; instalado a xml</div>";
}
if (! extension_loaded("zlib")) {
    echo "<div class='alert alert-danger' role='alert'>Problema: n&atilde;o est&aacute; instalado a zlib </div>";
}
if (! extension_loaded("mbstring")) {
    echo "<div class='alert alert-danger' role='alert'>Obs: n&atilde;o est&aacute; instalado a mbstring</div>";
}
if (! extension_loaded("yaml")) {
    echo "<div class='alert alert-warning' role='alert'>Obs: n&atilde;o est&aacute; instalado a YAML.\nA ferramenta de melhor tra&ccedil;ado raster precisa dessa extens&atilde;o.</div>";
}

var_dump($exts);
echo "</pre>";
echo "<h3>ms_configura.php</h3>";
if (! file_exists("../ms_configura.php")) {
    echo "<div class='alert alert-danger' role='alert'>O arquivo ms_configura.php n&atilde;o foi encontrado. Teste abortado.</div>";
}
include ("../ms_configura.php");
$loceste = getcwd();
$spath = session_save_path();
echo <<<HTML
		<div class="alert alert-success" role="alert">
		<li>Mensagem de inicializa&ccedil;&atilde;o <span class="label label-default">$mensagemInicia</span></li>
		<li>dir_tmp <span class="label label-default">$dir_tmp</span></li>
		<li>locmapserv <span class="label label-default">$locmapserv</span></li>
		<li>Localiza&ccedil;&atilde;o deste PHP <span class="label label-default">$loceste</span></li>
		</div>
HTML;
echo "<h3>Banco de administra&ccedil;&atilde;o</h3>";
if ($conexaoadmin == "" && file_exists($locaplic . "/admin/admin.db")) {
    echo "<div class='alert alert-info' role='alert'>As permiss&otilde;es do banco de dados $locaplic/admin/admin.db s&atilde;o (se o arquivo estiver bloqueado, o sistema de administra&ccedil;&atilde;o n&atilde;o ir&aacute; funcionar):<br>";
    echo '<span class="label label-default">';
    echo permissoesarquivo($locaplic . "/admin/admin.db");
    echo "</span></div>";
}
include_once ("../classesphp/conexao.php");
echo "<h4>Verificando banco de dados de administra&ccedil;&atilde;o</h4>";
echo "<pre>";
// TODO Verificar ao fechar versao - verificar tabelas
$tabelas = array(
    "i3geoadmin_sistemasf" => "abrir_funcao,h_funcao,id_funcao,id_sistema,nome_funcao,perfil_funcao,w_funcao",
    "i3geoadmin_tags" => "id_tag,nome",
    "i3geoadmin_perfis" => "id_perfil,perfil",
    "i3geoadmin_atlasp" => "ordem_prancha,desc_prancha,h_prancha,icone_prancha,id_atlas,id_prancha,link_prancha,mapext_prancha,titulo_prancha,w_prancha",
    "i3geoadmin_atlast" => "ordem_tema,codigo_tema,id_prancha,id_tema,ligado_tema",
    "i3geoadmin_mapas" => "publicado_mapa,ordem_mapa,perfil_mapa,ligados_mapa,temas_mapa,desc_mapa,ext_mapa,id_mapa,imagem_mapa,linkdireto_mapa,nome_mapa,outros_mapa,mapfile",
    "i3geoadmin_atlas" => "publicado_atlas,ordem_atlas,basemapfile_atlas,desc_atlas,h_atlas,icone_atlas,id_atlas,link_atlas,pranchadefault_atlas,template_atlas,tipoguias_atlas,titulo_atlas,w_atlas",
    "i3geoadmin_sistemas" => "publicado_sistema,id_sistema,nome_sistema,perfil_sistema",
    "i3geoadmin_identifica" => "publicado_i,abrir_i,id_i,nome_i,target_i",
    "i3geoadmin_raiz" => "ordem,id_tema,id_menu,id_nivel,id_raiz,nivel,perfil",
    "i3geoadmin_n1" => "publicado,ordem,id_menu,id_grupo,id_n1,n1_perfil",
    "i3geoadmin_n2" => "publicado,ordem,id_n1,id_n2,id_subgrupo,n2_perfil",
    "i3geoadmin_n3" => "publicado,ordem,id_n2,id_n3,id_tema,n3_perfil",
    "i3geoadmin_ws" => "nacessosok,nacessos,autor_ws,desc_ws,id_ws,link_ws,nome_ws,tipo_ws",
    "i3geoadmin_grupos" => "it,es,en,desc_grupo,id_grupo,nome_grupo",
    "i3geoadmin_subgrupos" => "it,es,en,desc_subgrupo,id_subgrupo,nome_subgrupo",
    "i3geoadmin_temas" => "it,es,en,kmz_tema,id_tema,kml_tema,ogc_tema,download_tema,tags_tema,tipoa_tema,link_tema,desc_tema,nome_tema,codigo_tema",
    "i3geoadmin_menus" => "it,es,en,publicado_menu,perfil_menu,aberto,desc_menu,id_menu,nome_menu",
    "i3geoadmin_comentarios" => "comentario,data,openidnome,openidimagem,openidservico,openidusuario,openidurl,id_tema",
    "i3geoadmin_acessostema" => "codigo_tema,nacessos,dia,mes,ano",
    "i3geoadmin_log" => "id_log,sql,serializedata,usuario,ip,timestamp,outros",
    "i3geousr_usuarios" => "id_usuario,ativo,data_cadastro,email,login,nome_usuario,senha",
    "i3geousr_papeis" => "id_papel,nome,descricao",
    "i3geousr_papelusuario" => "id_usuario,id_papel",
    "i3geousr_operacoes" => "id_operacao,codigo,descricao",
    "i3geousr_operacoespapeis" => "id_operacao,id_papel",
    "i3geousr_grupos" => "id_grupo,nome,descricao",
    "i3geousr_grupotema" => "id_grupo,id_tema",
    "i3geousr_grupousuario" => "id_usuario,id_grupo",
    "i3geoestat_conexao" => "codigo_estat_conexao,bancodedados,host,porta,usuario,senha",
    "i3geoestat_tipo_regiao" => "codigo_tipo_regiao,nome_tipo_regiao,descricao_tipo_regiao,codigo_estat_conexao,esquemadb,tabela,colunageo,data,identificador,colunanomeregiao,srid,colunacentroide,colunasvisiveis,apelidos",
    "i3geoestat_agregaregiao" => "id_agregaregiao,codigo_tipo_regiao,codigo_tipo_regiao_pai,colunaligacao_regiaopai",
    "i3geoestat_tipo_periodo" => "codigo_tipo_periodo,nome,descricao",
    "i3geoestat_unidade_medida" => "codigo_unidade_medida,nome,sigla,permitesoma,permitemedia",
    "i3geoestat_variavel" => "codigo_variavel,nome,descricao",
    "i3geoestat_medida_variavel" => "id_medida_variavel,codigo_unidade_medida,codigo_tipo_periodo,codigo_variavel,codigo_tipo_regiao,codigo_estat_conexao,esquemadb,tabela,colunavalor,colunaidgeo,filtro,nomemedida,colunaidunico",
    "i3geoestat_classificacao" => "id_classificacao,nome,id_medida_variavel,observacao",
    "i3geoestat_classes" => "id_classe,expressao,titulo,vermelho,verde,azul,id_classificacao,tamanho,simbolo,overmelho,overde,oazul,otamanho",
    "i3geoestat_fonteinfo" => "id_fonteinfo,titulo,link",
    "i3geoestat_fonteinfo_medida" => "id_medida_variavel,id_fonteinfo",
    "i3geoestat_medida_variavel_link" => "link,id_medida_variavel,nome,id_link",
    "i3geoestat_parametro_medida" => "id_parametro_medida,coluna,nome,descricao,id_pai,id_medida_variavel,tipo"
);
include_once ("../classesphp/conexao.php");
if (! empty($esquemaadmin)) {
    $esquemaadmin = str_replace(".", "", $esquemaadmin) . ".";
}

foreach (array_keys($tabelas) as $tabela) {
    echo "     Tabela: <b>" . $tabela . "</b>";
    $sql = "select * from " . $esquemaadmin . $tabela;
    $q = $dbh->query($sql, PDO::FETCH_ASSOC);
    if ($q !== false) {
        $resultado = $q->fetchAll();
        if (count($resultado) > 0) {
            echo " <span class='label label-success'>ok</span>\n";
            foreach (explode(",", $tabelas[$tabela]) as $coluna) {
                echo "         coluna: " . $coluna;
                if (in_array($coluna, array_keys($resultado[0]))) {
                    echo " <span class='label label-success'>ok</span>\n";
                } else {
                    echo " <span class='label label-info'>n&atilde;o encontrada. Consulte o i3geo/guia_de_migracao.txt</span>\n";
                }
            }
        } else {
            echo " <span class='label label-info'>n&atilde;o existem registros cadastrados</span>\n";
        }
    } else {
        echo " <span class='label label-danger'>n&atilde;o encontrada. Consulte o i3geo/guia_de_migracao.txt</span>\n";
    }
}
echo "</pre>";
echo "<h3>CGI</h3>";
$proto = "http" . ((isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == "on") ? "s" : "") . "://";
$server = isset($_SERVER['HTTP_HOST']) ? $_SERVER['HTTP_HOST'] : $_SERVER['SERVER_NAME'];
$enderecocgi = $proto . $server . $locmapserv;
echo "<div class='alert alert-info' role='alert'>Voc&ecirc; pode testar o CGI clicando <a href='" . $enderecocgi . "' target='_blank'>aqui</a>, se o programa responder corretamente, dever&aacute; aparecer na tela algo como 'No query information to decode. QUERY_STRING is set, but empty.'</div>";
echo "<div class='alert alert-info' role='alert'>Em ambientes com SO Windows, algumas op&ccedil;&otilde;es de gera&ccedil;&atilde;o de servi&ccedil;os OGC apenas funcionam se a vari&aacute;vel ms_configura.php 'ogrOutput' estiver definida como 0 (false). <br>Valor da vari&aacute;vel ogrOutput: $ogrOutput </div>";

echo "<h3>Testes de escrita</h3><pre>";
if (file_exists("../temas/teste.txt")) {
    echo "<div class='alert alert-info' role='alert'><h4>Removendo arquivo de testes temas/teste.txt</h4>";
    unlink("../temas/teste.txt");
}
if (file_exists("../temas/teste.txt")) {
    echo "<div class='alert alert-danger' role='alert'>N&atilde;o foi possivel escrever na pasta temas. O sistema de administracao pode nao funcionar corretamente</div>";
} else {
    echo "<h4>Testando criar arquivo temas/teste.txt</h4>";
    $f = @fopen("../temas/teste.txt", w);
    @fclose($f);
    if (! file_exists("../temas/teste.txt")) {
        echo "<div class='alert alert-danger' role='alert'>N&atilde;o foi possivel escrever na pasta temas. O sistema de administracao pode nao funcionar corretamente</div>";
    } else {
        unlink("../temas/teste.txt");
        echo "<span class='label label-success'>ok</span>";
    }
}
echo "<h4>Escrevendo nos diret&oacute;rios tempor&aacute;rios</h4>";
if (file_exists($dir_tmp . "/teste.txt")) {
    unlink($dir_tmp . "/teste.txt");
}
if (file_exists($dir_tmp . "/teste.txt")) {
    saindo("<div class='alert alert-danger' role='alert'>N&atilde;o foi poss&iacute;vel testar o diret&oacute;rio tempor&aacute;rio $dir_tmp</div>");
} else {
    echo "<span class='label label-success'>ok</span>";
}
$f = @fopen($dir_tmp . "/teste.txt", w);
@fclose($f);
if (file_exists($dir_tmp . "/teste.txt")) {
    echo "<h4>Escrevendo nos diret&oacute;rios tempor&aacute;rios do Mapserver</h4>";
    echo "<span class='label label-success'>ok</span>";
} else {
    saindo("<div class='alert alert-danger' role='alert'>N&atilde;o foi poss&iacute;vel gravar no diret&oacute;rio tempor&aacute;rio $dir_tmp");
}
$f = @fopen(session_save_path() . "/teste.txt", w);
@fclose($f);
if (file_exists(session_save_path() . "/teste.txt")) {
    echo "<h4>Escrevendo nos diret&oacute;rios tempor&aacute;rios SESSION PHP</h4>";
    echo "<span class='label label-success'>ok</span>";
} else {
    saindo("<div class='alert alert-danger' role='alert'>N&atilde;o foi poss&iacute;vel gravar no diret&oacute;rio tempor&aacute;rio da SESSION</div>");
}
echo "</pre>";
echo "<h3>Carregando o map_file base</h3>";
$versao = versao();
$versao = $versao["principal"];
if (isset($base) && $base != "") {
    if (file_exists($base)) {
        $f = $base;
    } else {
        $f = $locaplic . "/aplicmap/" . $base . ".map";
    }
    if (! file_exists($base)) {
        echo "<div class='alert alert-danger' role='alert'>ARQUIVO $base N&Acirc;O FOI ENCONTRADO. CORRIJA ISSO EM ms_configura.php</div>";
        exit();
    }
} else {
    $f = "";
    if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
        $f = $locaplic . "/aplicmap/geral1windowsv" . $versao . ".map";
    } else {
        if ($f == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv' . $versao . '.map')) {
            $f = "/var/www/i3geo/aplicmap/geral1debianv" . $versao . ".map";
        }
        if ($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav' . $versao . '.map')) {
            $f = "/var/www/html/i3geo/aplicmap/geral1fedorav" . $versao . ".map";
        }
        if ($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav' . $versao . '.map')) {
            $f = "/opt/www/html/i3geo/aplicmap/geral1v" . $versao . ".map";
        }
        if ($f == "") {
            $f = $locaplic . "/aplicmap/geral1v" . $versao . ".map";
        }
    }
}
echo "<div class='alert alert-success' role='alert'><h4>O arquivo mapfile de iniciliza&ccedil;&atilde;o &eacute;: <strong>$f</strong></h4></div>";
echo "<pre>";
echo "<h4>Criando o objeto com ms_newMapObj...";
echo "<h4>Desenhando o mapa (se o mapa n&atilde;o aparecer \nverifique os caminhos no ms_configura.php e no $f)</h4>";

$mapa = ms_newMapObj($f);
// para evitar erros que possam ser originados da conexao com o banco
for ($i = 0; $i < ($mapa->numlayers); $i ++) {
    $layern = $mapa->getLayer($i);
    if ($layern->connectiontype == MS_POSTGIS) {
        $layern->set("status", MS_OFF);
    }
}
$l = $mapa->getLayerByname("mundo");
if ($l != "") {
    $l->set("status", MS_DEFAULT);
}
$imgo = @$mapa->draw();
$nome = ($imgo->imagepath) . "teste.png";
echo "<h5>Nome da imagem gerada: $nome </h5>";

if (! $imgo) {
    echo "<div class='alert alert-danger' role='alert'><h5>Problemas ao gerar o mapa</h5>";
    $error = "";
    $error = ms_GetErrorObj();
    while ($error && $error->code != MS_NOERR) {
        echo "<h5>Error in %s: %s</h5>", $error->routine, $error->message;
        $error = $error->next();
    }
    echo "</div>";
}
if ($imgo->imagepath == "") {
    echo "<div class='alert alert-danger' role='alert'>Erro IMAGEPATH vazio</div>";
}
$imgo->saveImage($nome);
$nome = ($imgo->imageurl) . basename($nome);
echo "<img src=$nome />";
echo " \n";
$error = "";
ms_ResetErrorList();
echo "<h4>Carregando o map_file geral1... e acrescentando os limites estaduais (aplicmap/estadosl...) </h4>";
if (isset($estadosl)) {
    $maptemp = ms_newMapObj($locaplic . "/aplicmap/" . $estadosl . ".map");
} else {
    if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')) {
        $maptemp = ms_newMapObj($locaplic . "/aplicmap/estadoslwindows.map");
    } else {
        $maptemp = ms_newMapObj($locaplic . "/aplicmap/estadosl.map");
    }
}
while ($error && $error->code != MS_NOERR) {
    printf("<div class='alert alert-danger' role='alert'>Error in %s: %s<br></div>", $error->routine, $error->message);
    $error = $error->next();
}
echo <<<HTML
<h4>Se o mapa n&atilde;o aparecer verifique os caminhos no ms_configura.php e no estadosl.map ou estadoslwindows.map\n
Um problema bastante comum &eacute; o n&atilde;o reconhecimento do diret&oacute;rio ms_tmp pelo Apache. \n
O diretorio ms_tmp &eacute; utilizado pelo Mapserver e pelo i3geo para armazenar dados tempor&aacute;rios. &Eacute; nesse diretorio\n
que ficam as imagens do mapa. Quando o Apache n&atilde;o consegue utilizar esse diret&oacute;rio, a imagem n&atilde;o ser&aacute; mostrada,\n
apesar de ser gerada dentro do ms_tmp (vc pode verificar se as imagens do mapa est&atilde;o sendo criadas no ms_tmp apos \n
rodar o testainstal.php).Para solucionar esse problema, vc pode criar um link simb&oacute;lico (nos sistemas linux),\n
no mesmo local onde est&aacute; instalado o i3geo, apontando para o local f&iacute;sico onde est&aacute; o ms_tmp.\n
O nome do link simbolico deve ser o mesmo que estiver definido em aplicmap/geral1.map ou geral1debian.map na linha IMAGEURL. \n
Esse nome por default &eacute; definido como ms_tmp. No wiki do portal do software p&uacute;blico vc poder&aacute; encontrar mais detalhes sobre isso.</h4>
HTML;
for ($i = 0; $i < ($maptemp->numlayers); $i ++) {
    $layern = $maptemp->getLayer($i);
    if ($layern->name == "estadosl") {
        $layern->set("data", $locaplic . "/aplicmap/dados/estados.shp");
    }
    ms_newLayerObj($mapa, $layern);
}
$imgo = @$mapa->draw();

if (! $imgo) {
    echo "Problemas ao gerar o mapa<br>";
    $error = "";
    $error = ms_GetErrorObj();
    while ($error && $error->code != MS_NOERR) {
        echo "<div class='alert alert-danger' role='alert'>Error in %s: %s</div>", $error->routine, $error->message;
        $error = $error->next();
    }
}
if ($imgo->imagepath == "") {
    echo "<div class='alert alert-danger' role='alert'>Erro IMAGEPATH vazio</div>";
}

$nome = ($imgo->imagepath) . "teste1.png";
echo "<h5>Nome da imagem gerada: $nome </h5>";
$imgo->saveImage($nome);
$nome = ($imgo->imageurl) . basename($nome);
echo "<img src=$nome /></pre></body></html>";

function saindo($men)
{
    echo "<div class='alert alert-danger' role='alert'>Erro. Saindo..." . $men . "</div>";
}

/*
 * Retorna as permiss&otilde;es de um arquivo
 *
 * Parametros:
 *
 * $arquivo
 */
function permissoesarquivo($arquivo)
{
    $perms = fileperms($arquivo);

    if (($perms & 0xC000) == 0xC000) {
        // Socket
        $info = 's';
    } elseif (($perms & 0xA000) == 0xA000) {
        // Symbolic Link
        $info = 'l';
    } elseif (($perms & 0x8000) == 0x8000) {
        // Regular
        $info = '-';
    } elseif (($perms & 0x6000) == 0x6000) {
        // Block special
        $info = 'b';
    } elseif (($perms & 0x4000) == 0x4000) {
        // Directory
        $info = 'd';
    } elseif (($perms & 0x2000) == 0x2000) {
        // Character special
        $info = 'c';
    } elseif (($perms & 0x1000) == 0x1000) {
        // FIFO pipe
        $info = 'p';
    } else {
        // Unknown
        $info = 'u';
    }

    // Owner
    $info .= (($perms & 0x0100) ? 'r' : '-');
    $info .= (($perms & 0x0080) ? 'w' : '-');
    $info .= (($perms & 0x0040) ? (($perms & 0x0800) ? 's' : 'x') : (($perms & 0x0800) ? 'S' : '-'));

    // Group
    $info .= (($perms & 0x0020) ? 'r' : '-');
    $info .= (($perms & 0x0010) ? 'w' : '-');
    $info .= (($perms & 0x0008) ? (($perms & 0x0400) ? 's' : 'x') : (($perms & 0x0400) ? 'S' : '-'));

    // World
    $info .= (($perms & 0x0004) ? 'r' : '-');
    $info .= (($perms & 0x0002) ? 'w' : '-');
    $info .= (($perms & 0x0001) ? (($perms & 0x0200) ? 't' : 'x') : (($perms & 0x0200) ? 'T' : '-'));

    return $info;
}

?>
	</div>
    <script>
$.material.init();
</script>
</body>
</html>
