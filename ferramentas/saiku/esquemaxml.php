<?php
include(dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");
include(dirname(__FILE__)."/../../classesphp/classe_metaestatinfo.php");
if(!isset($dir_tmp)){
    include(dirname(__FILE__)."/../../ms_configura.php");
}
if(isset($statusFerramentas) && $statusFerramentas["saiku"] != true){
    exit;
}
//testa pra ver se a requisicao esta vindo de um local autorizado
if(parse_url($saikuUrl)["host"] != gethostbyaddr($_SERVER['REMOTE_ADDR'])){
    echo "Servidor requisitante nao permitido";
}
$urlXmlEsquema = "";
/*
if(empty($_GET["output"])){
    $map_file = $_SESSION["map_file"];
    $arquivoXmlEsquema = dirname($map_file)."/".str_replace(".txt","",$nomeConexao).".xml";
}
gravaDataSource();
if(!empty($_GET["output"])){
    imprimeEsquema();
}
*/
$m = new MetaestatInfo();

//
//obtem do mapfile em uso os layers que sao do sistema metaestat, sao regioes e que possuem selecao
//

if(empty($_GET["regiao"])){
    $s = pegaSelecaoRegioes();
    $selecaoRegiao = $s["selecaoRegiao"];
    $codigo_tipo_regiao = $s["codigo_tipo_regiao"];
}
else{
    $codigo_tipo_regiao = $_GET["regiao"];
}
if($codigo_tipo_regiao == ""){
    $regioes = $m->listaTipoRegiao();
}
else{
    $regioes = array($m->listaTipoRegiao($codigo_tipo_regiao));
}
$s = "";


$medidas = $m->listaMedidaVariavel();

//
//formata o array de regioes colocando na chave o codigo da regiao
//
$chavesRegiao = array();
$todasAsRegioes = $m->listaTipoRegiao();
foreach($todasAsRegioes as $R){
    $chavesRegiao[$R["codigo_tipo_regiao"]] = $R;
}
//inicia montagem do XML
//
//cria as dimensoes de tipo temporal
//
$xmlTempo = dimensoesTemporais();

//
//dimensoes geograficas
//as dimensoes sao duplicadas
//uma delas contem o geocodigo que permite a geracao do mapa
//
//guarda as regioes filhas de uma determinada regiao (chave)
$filhosDaRegiao = array();
$VirtualCubeDimensionDaRegiao = array();
$VirtualCubeMeasureDaRegiao = array();
$nivelDaDimensao = array();

$VirtualCubeDimensionDaMedida = array();
$CubosPorMedida = array();

$dimRegioes = dimensoesGeo();

$xmlRegioes = array_map(function($element){
    return $element['xml'];
}, $dimRegioes);
$xmlRegioes = implode(" ",$xmlRegioes);
//
//outras dimensoes definidas nos parametros e que nao sejam do tipo tempo
//
$xmlOutrasDim = dimensoesOutras();

//
//cria as dimensoes das medidas conforme o nome da tabela utilizada
//
$VirtualCubeDimension = array();
$VirtualCubeMeasure = array();
$xmlDimensoesTabelas = dimensoesTabelas();
//
//cubo geral, com todas as dimensoes e medidas
//
$xmlCuboTodas = cuboTodas();
//
//cubos por regiao
//
$xmlCuboRegioes = cuboRegioes();//$VirtualCubeDimensionDaRegiao, $VirtualCubeMeasureDaRegiao

$xmlCuboVariaveis = cuboVariaveis();

$xml = "<Schema name='i3Geo Metaestat'>";
$xml .= $xmlTempo.$xmlRegioes.$xmlOutrasDim.$xmlDimensoesTabelas.$xmlCuboRegioes.$xmlCuboTodas.$xmlCuboVariaveis;
$xml .= "</Schema>";

//xml pronto!!!!!

//error_reporting(0);
ob_end_clean();
//
//grava os dados em um arquivo. O usuario pode evitar isso e imprimir direto na tela
//usando output "xml"
//
/*
if(empty($_GET["output"]) || (!empty($_GET["output"]) && $_GET["output"] != "xml")){
    gravaDados(array($xml),$arquivoXmlEsquema);
}
*/
imprimeEsquema();


//////////////////////////////////////////////////////////////////////////////////////////
function caminhoRegiao($hs,$chavesRegiao,$h,$regiaoInicial,$caminho=array())
{
    foreach($hs as $n){
        if($n["codigo_tipo_regiao"] == $regiaoInicial){
            $caminho[] = array("a"=>$regiaoInicial,"join"=>$n["codigo_tipo_regiao_pai"],"ligacao"=>$n["colunaligacao_regiaopai"]);
            $caminho = caminhoRegiao($hs,$chavesRegiao,$h, $n["codigo_tipo_regiao_pai"],$caminho);
        }
        else{
            //$caminho = caminhoRegiao($hs,$chavesRegiao,$h, $n["codigo_tipo_regiao_pai"],$caminho);
        }
    }
    return $caminho;
}
function converte($texto){
    $texto = str_replace("&","&amp;",htmlentities($texto,ENT_NOQUOTES,'UTF-8'));
    return $texto;
}
function imprimeEsquema(){
    global $saikuUrl,$nomeConexao,$xml;
    @ob_end_clean();
    header("Content-type: application/xml");
    if(!empty($_GET["xmlesquema"])){
        header("Location:".$_GET["xmlesquema"]);
    }
    else{
        echo $xml;
    }
}
function criaMapfileInicial(){
    global $mapext;
    if(empty($_GET["g_sid"])){
        include(dirname(__FILE__)."/../../ms_configura.php");
        $interface = "mashup";
        include(dirname(__FILE__)."/../../ms_criamapa.php");

        //reinicia a url
        $urln = "?g_sid=".session_id()."&locaplic=".$_GET["locaplic"]."&mapext=".$mapext."&origem=".$_GET["origem"]."&output=".$_GET["output"]."&xmlesquema=".$_GET["xmlesquema"]."&regiao=".$_GET["regiao"];
        header("Location:".$urln);
        exit;
    }
}
function criaConexaoEsquema(){
    global $dir_tmp, $urlXmlEsquema;
    $nomeConexao = nomeRandomico();
    //pega a sessao PHP aberta pelo i3Geo ou ms_criamapa.php
    if(!empty($_GET["g_sid"])){
        session_name("i3GeoPHP");
        session_id($_GET["g_sid"]);
        session_start();
        $map_file = $_SESSION["map_file"];
        if(empty($_GET["xmlesquema"])){
            $urlXmlEsquema = $_SESSION["tmpurl"].basename(dirname($map_file))."/".$nomeConexao.".xml";
        }
        else{
            $urlXmlEsquema = $_GET["xmlesquema"];
            //cria um nome de arquivo reaproveitável
            $nomeConexao = md5($_GET["xmlesquema"]);
        }
    }
    //$arquivoXmlEsquema = dirname($map_file)."/".$nomeConexao.".xml";
    return $nomeConexao.".txt";
}
function gravaDataSource(){
    /*
     $saikuConfigDataSource vem do ms_configura.php

    Exemplo de arquivo de fonte:
    type=OLAP
    name=i3geo
    driver=mondrian.olap4j.MondrianOlap4jDriver
    location=jdbc:mondrian:Jdbc=jdbc:postgresql://localhost:5432/i3geosaude;Catalog=http://localhost/i3geo/ferramentas/saiku/esquemaxml.php;JdbcDrivers=org.postgresql.Driver;
    username=postgres
    password=postgres

    Array com os parametros definidos em ms_configura:

    $saikuConfigDataSource = array(
            "type"=>"OLAP",
            "driver"=>"mondrian.olap4j.MondrianOlap4jDriver",
            "location"=>"jdbc:mondrian:Jdbc=jdbc:postgresql",
            "serverdb"=>"localhost",
            "port"=>"5432",
            "database"=>"i3geosaude",
            "JdbcDrivers"=>"org.postgresql.Driver",
            "username"=>"postgres",
            "password"=>"postgres"
    );
    */
    global $arquivoXmlEsquema,$saikuConfigDataSource,$nomeConexao,$urlXmlEsquema,$dir_tmp;

    $nomeDatasource = $dir_tmp."/saiku-datasources/".$nomeConexao;
    //nao funciona como url
    //error_reporting(E_ALL);
    $urlXmlEsquema = "http//localhost/i3geo/ferramentas/saiku/esquemaxml.php?output=xml";
    if(!file_exists($arquivoXmlEsquema)){
        $stringDatasource = "
        type={$saikuConfigDataSource["type"]}
        name={$nomeConexao}
        driver={$saikuConfigDataSource["driver"]}
        location={$saikuConfigDataSource["location"]}://{$saikuConfigDataSource["serverdb"]}:{$saikuConfigDataSource["port"]}/{$saikuConfigDataSource["database"]};Catalog={$urlXmlEsquema};JdbcDrivers={$saikuConfigDataSource["JdbcDrivers"]};
        username={$saikuConfigDataSource["username"]}
        password={$saikuConfigDataSource["password"]}
        ";
        //salva o arquivo com a fonte
        gravaDados(array($stringDatasource),$nomeDatasource);
    }
}
function pegaSelecaoRegioes(){
    global $m,$map_file,$postgis_mapa;
    $codigo_tipo_regiao = "";
    $selecaoRegiao = array();
    $regiao = "";
    $item = "";
    $registros = "";
    if($map_file != ""){
        $mapa = ms_newMapObj($map_file);
        $c = $mapa->numlayers;
        for ($i=0;$i < $c;++$i){
            $l = $mapa->getlayer($i);
            //verifica o alias na conexao
            if (!empty($postgis_mapa)){
                if ($l->connectiontype == MS_POSTGIS){
                    $lcon = $l->connection;
                    if (($lcon == " ") || ($lcon == "") || (in_array($lcon,array_keys($postgis_mapa)))){
                        if(($lcon == " ") || ($lcon == "")) //para efeitos de compatibilidade
                        {$l->set("connection",$postgis_mapa);
                        }
                        else{
                            $l->set("connection",$postgis_mapa[$lcon]);
                        }
                    }
                }
            }
            //
            $registros = array();
            if($l->status == MS_DEFAULT && $l->getmetadata("METAESTAT_CODIGO_TIPO_REGIAO") != ""){
                //verifica se tem selecao
                $qyfile = dirname($map_file)."/".$l->name.".php";
                if(file_exists($qyfile)){
                    $codigo_tipo_regiao = $l->getmetadata("METAESTAT_CODIGO_TIPO_REGIAO");
                    //pega os registros
                    $shapes = retornaShapesSelecionados($l,$map_file,$mapa);
                    //pega o nome da coluna que identifica cada registro
                    $regiao = $m->listaTipoRegiao($codigo_tipo_regiao);
                    $item = $regiao["identificador"];
                    foreach($shapes as $shape){
                        $registros[] = $shape->values[$item];
                    }
                    $reg = $item." IN ('".implode("','",$registros)."') ";
                    $selecaoRegiao[$codigo_tipo_regiao] = array(
                            "item" => $item,
                            "sql" => $reg
                    );
                    break; //mantem a primeira ocorrencia de regiao que possui selecao
                }
                else{
                    $selecaoRegiao[$codigo_tipo_regiao] = "";
                }
            }
        }
        return array(
                "selecaoRegiao"=>$selecaoRegiao,
                "codigo_tipo_regiao"=>$codigo_tipo_regiao
        );
    }
}
function dimensoesTemporais(){
    global $saikuConfigDataSource;
    $sqlAno = "select nu_ano from ".$saikuConfigDataSource['tabelaDimensaoTempo']." group by nu_ano order by nu_ano";
    $sqlMes = "select nu_ano::text,nu_mes::text,ds_mes_abreviado as mes,COALESCE (nu_ano::text||'-'||nu_mes::text,nu_ano::text) as nu_anomes from ".$saikuConfigDataSource['tabelaDimensaoTempo']." group by nu_ano,nu_mes,mes,nu_anomes order by nu_ano,nu_mes";
    //dimensoes temporais
    $xml = "
    <Dimension name='Anual' type='TimeDimension' caption='Tempo: Anual'>
    <Hierarchy hasAll='true' primaryKey='nu_ano'>
    <view alias='tempo_ano' ><SQL dialect='generic' >$sqlAno</SQL></view>
    <Level name='Ano' column='nu_ano' type='Numeric' uniqueMembers='true' levelType='TimeYears'/>
    </Hierarchy>
    </Dimension>
    <Dimension name='Mensal' type='TimeDimension' caption='Tempo: Mensal'>
    <Hierarchy hasAll='true' primaryKey='nu_anomes'>
    <view alias='tempo_ano' ><SQL dialect='generic' >$sqlMes</SQL></view>
    <Level name='Ano' column='nu_ano' type='Numeric' uniqueMembers='true' levelType='TimeYears'/>
    <Level nameColumn='mes' name='Mes' column='nu_mes' type='Numeric' uniqueMembers='false' levelType='TimeMonths'/>
    </Hierarchy>
    </Dimension>
    <Dimension name='Tempo' type='TimeDimension' caption='Tempo'>
    <Hierarchy hasAll='true' primaryKey='nu_anomes'>
    <view alias='tempo' ><SQL dialect='generic' >$sqlMes</SQL></view>
    <Level name='Ano' column='nu_ano' type='String' uniqueMembers='true' levelType='TimeYears'/>
    <Level nameColumn='mes' name='Mes' column='nu_mes' type='String' uniqueMembers='false' levelType='TimeMonths'/>
    </Hierarchy>
    </Dimension>
    ";
    return $xml;
}
function sqlDasRegioes($regiao,$caminho,$chavesRegiao){
    $select = "SELECT tabela{$regiao["codigo_tipo_regiao"]}.{$regiao["identificador"]}::text as codigo, __COLUNAS__ FROM {$regiao['esquemadb']}.{$regiao['tabela']} as tabela{$regiao["codigo_tipo_regiao"]} \n";
    $selectPrincipal = "";
    $juncoes = "";
    $colunas = array();
    $nomesColunas = array();
    $codRegioes = array();
    $ncaminhos = count($caminho);
    if($ncaminhos > 0){
        foreach($caminho as $c){
            $regiaoAnterior = $chavesRegiao[$c["a"]];
            $tabelaAnterior = "tabela".$regiaoAnterior["codigo_tipo_regiao"];
            $colunaLigacaoAnterior = $c["ligacao"];

            $colunas[] = $tabelaAnterior.".".$regiaoAnterior["identificador"]. "::text AS codigo".$regiaoAnterior["codigo_tipo_regiao"];
            $colunas[] = $tabelaAnterior.".".$regiaoAnterior["colunanomeregiao"]. "::text AS nome".$regiaoAnterior["codigo_tipo_regiao"];

            $regiaoJoin = $chavesRegiao[$c["join"]];
            $tabelaAtual = "tabela".$regiaoJoin["codigo_tipo_regiao"];
            $colunaLigacaoAtual = $regiaoJoin["identificador"];

            $colunas[] = $tabelaAtual.".".$regiaoJoin["identificador"]. "::text AS codigo".$regiaoJoin["codigo_tipo_regiao"];
            $colunas[] = $tabelaAtual.".".$regiaoJoin["colunanomeregiao"]. "::text AS nome".$regiaoJoin["codigo_tipo_regiao"];

            $nomesColunas[] = " codigo".$regiaoJoin["codigo_tipo_regiao"];
            $nomesColunas[] = " nome".$regiaoJoin["codigo_tipo_regiao"];

            $juncoes .= " JOIN {$regiaoJoin['esquemadb']}.{$regiaoJoin['tabela']} as $tabelaAtual ON
            $tabelaAtual.$colunaLigacaoAtual::text = $tabelaAnterior.$colunaLigacaoAnterior::text
            ";
            $codRegioes[] = $regiaoJoin["codigo_tipo_regiao"];
        }
        $colunas = array_unique($colunas);
    }
    else{
        $colunas[] = "tabela".$regiao["codigo_tipo_regiao"].".".$regiao["identificador"]. "::text AS codigo".$regiao["codigo_tipo_regiao"];
        $colunas[] = "tabela".$regiao["codigo_tipo_regiao"].".".$regiao["colunanomeregiao"]. "::text AS nome".$regiao["codigo_tipo_regiao"];

        $nomesColunas[] = " codigo".$regiao["codigo_tipo_regiao"];
        $nomesColunas[] = " nome".$regiao["codigo_tipo_regiao"];

        $codRegioes[] = $regiao["codigo_tipo_regiao"];
    }
    $mascara = $select;
    $select = str_replace("__COLUNAS__",implode(",",$colunas),$select);
    $selectPricipal = $select;
    $select .= $juncoes;
    return array("codRegioes"=>$codRegioes,"juncoes"=>$juncoes,"mascara"=>$mascara,"principal"=>$selectPricipal,"select"=>$select,"colunas"=>$colunas,"nomesColunas"=>$nomesColunas);
}

function dimensoesGeo(){
    global $chavesRegiao, $m, $selecaoRegiao, $regioes, $filhosDaRegiao, $VirtualCubeDimensionDaRegiao, $VirtualCubeMeasureDaRegiao;
    //essas variaveis sao globais e usadas em outras funcoes
    if(!empty($regioes)){
        foreach($regioes as $regiao){
            $filhosDaRegiao[$regiao["codigo_tipo_regiao"]] = array();
            $VirtualCubeDimensionDaRegiao[$regiao["codigo_tipo_regiao"]] = array();
            $VirtualCubeMeasureDaRegiao[$regiao["codigo_tipo_regiao"]] = array();
        }
    }
    //xml normal
    $xml1 = "";
    //xml geocodigo
    $xml2 = "";
    //
    //sera que e todas mesmo ou so a escolhida?????
    //
    $todasRegioes = $m->listaTipoRegiao();
    $xmlRegioes = array();
    foreach($todasRegioes as $regiao){
        $sqls = array();
        $temp = converte($regiao["nome_tipo_regiao"]);
        $xml1 = "
        <Dimension name='codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."' caption='Onde:".$temp."'>
        <Hierarchy hasAll='true'  primaryKey='codigo{$regiao["codigo_tipo_regiao"]}'>
        ";
        $xml2 = "
        <Dimension name='codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."_geocod' caption='GeoCod:".$temp."'>
        <Hierarchy hasAll='true'  primaryKey='codigo{$regiao["codigo_tipo_regiao"]}'>
        ";
        //
        //cria uma view juntando as tabelas da hierarquia de regioes
        //
        $hs = $m->listaHierarquia();
        //$regiao["codigo_tipo_regiao"] = 2;
        $caminho = array();
        foreach($hs as $h){
            if($h["codigo_tipo_regiao"] == $regiao["codigo_tipo_regiao"]){
                $caminho = caminhoRegiao($hs,$chavesRegiao,$h,$regiao["codigo_tipo_regiao"]);
            }
        }
        //
        //sql da tabela principal da regiao
        //
        $dadosSelect = sqlDasRegioes($regiao,$caminho,$chavesRegiao);
        //
        //pega os dados das demais tabelas associadas, menos da primeira
        //para unir os dados
        //
        $niveisXml1 = array();
        $niveisXml2 = array();

        $temp = converte($regiao["nome_tipo_regiao"]);
        $niveisXml1[] = "
        <Level name='".$temp."' column='codigo{$regiao["codigo_tipo_regiao"]}' nameColumn='nome".$regiao["codigo_tipo_regiao"]."'
        uniqueMembers='false' />
        ";
        $niveisXml2[] = "
        <Level name='".$temp." - GeoCod #".$regiao["codigo_tipo_regiao"]."' column='codigo{$regiao["codigo_tipo_regiao"]}' nameColumn='codigo".$regiao["codigo_tipo_regiao"]."'
        uniqueMembers='false' />
        ";
        //juncoes
        while($caminho){
            $a = array_shift($caminho);
            $u = sqlDasRegioes($chavesRegiao[$a["join"]],array(),$chavesRegiao);
            //substitui as colunas para obter dados vazios
            $colunasVazias = array();
            foreach($dadosSelect["nomesColunas"] as $nomesPrincipais){
                $colunasVazias[$nomesPrincipais] = "'' AS $nomesPrincipais";
            }
            $n = count($u["colunas"]);
            for($q = 0; $q < $n; $q++){
                $colunasVazias[$u["nomesColunas"][$q]] = $u["colunas"][$q];
            }
            //
            //inclui as colunas da primeira tabela
            //
            $colunasPrimeiraTabela = "'' as codigo".$regiao["codigo_tipo_regiao"].","."'' as nome".$regiao["codigo_tipo_regiao"].",";

            $mascara = str_replace("__COLUNAS__",$colunasPrimeiraTabela."__COLUNAS__",$u["mascara"]);

            $u["select"] = str_replace("__COLUNAS__",implode(",",$colunasVazias),$mascara);

            $temp = converte($chavesRegiao[$a["join"]]["nome_tipo_regiao"]);

            $niveisXml1[] = "
            <Level name='".$temp."' column='codigo{$a["join"]}' nameColumn='nome".$a["join"]."'
            uniqueMembers='false' />
            ";
            $niveisXml2[] = "
            <Level name='".$temp." - GeoCod #".$a["join"]."' column='codigo{$a["join"]}' nameColumn='codigo".$a["join"]."'
            uniqueMembers='false' />
            ";
            $unico = "false";
        }

        //inclui a selecao se houver
        $sqlreg = "";
        if(!empty($selecaoRegiao[$regiao["codigo_tipo_regiao"]])){
            $rs = $selecaoRegiao[$regiao["codigo_tipo_regiao"]];
            $sqlreg = " WHERE tabela{$regiao["codigo_tipo_regiao"]}.".$rs["sql"];
        }
        $xml1 .= "
        <view alias='view_codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."' >
        <SQL dialect='generic' >".$dadosSelect["select"].$sqlreg."</SQL>
        </view>
        ";
        $xml2 .= "
        <view alias='view_codigo_tipo_regiao_".$regiao["codigo_tipo_regiao"]."_GeoCod' >
        <SQL dialect='generic' >".$dadosSelect["select"].$sqlreg."</SQL>
        </view>
        ";
        $niveisXml1 = array_reverse($niveisXml1);
        $niveisXml2 = array_reverse($niveisXml2);
        $xml1 .= implode(" ",$niveisXml1);
        $xml2 .= implode(" ",$niveisXml2);
        $xml1 .= "
        </Hierarchy>
        </Dimension>
        ";
        $xml2 .= "
        </Hierarchy>
        </Dimension>
        ";
        $xmlRegioes[$regiao["codigo_tipo_regiao"]] = array(
                "xml" => $xml1.$xml2,
                "juncoes" => $dadosSelect["juncoes"],
                "codigo_tipo_regiao"=> $regiao["codigo_tipo_regiao"],
                "colunas" => $dadosSelect["colunas"],
                "nomesColunas"=> $dadosSelect["nomesColunas"],
                "codRegioes"=>$dadosSelect["codRegioes"]
        );
    }
    return $xmlRegioes;
}
function dimensoesOutras(){
    global $m,$nivelDaDimensao;
    $parametros = $m->listaTodosParametros();
    $dimOutras = array();
    foreach($parametros as $p){
        //apenas as nao tempo
        if($p["tipo"] < 1 || $p["tipo"] > 5){
            $k = $p["esquema"]."_".$p["tabela"]."_".$p["coluna"];
            if(empty($tbs[$k])){
                $dimOutras[$k] = $p;
            }
            else{
                array_push($dimOutras[$k],$p);
            }
        }
    }
    $xml3 = "";
    foreach($dimOutras as $d){
        $k = $d["esquemadb"]."_".$d["tabela"]."_".$d["coluna"];
        $xml3 .= "
        <Dimension name='".$k."' caption='".converte($d["nome"])."'>
        <Hierarchy hasAll='true'  primaryKey='codigo'>
        ";
        //cria uma view juntando as tabelas da hierarquia de regioes
        $colunas = "dim.{$d['coluna']}::text as codigo, ";
        $colunas .= "dim.{$d['coluna']} AS nome";
        $sql = "SELECT {$colunas} FROM ".$d['esquemadb'].".".$d['tabela']." as dim group by codigo,nome";
        $xml3 .= "<view alias='".$k."' ><SQL dialect='generic' >$sql</SQL></view>";
        $xml3 .= "<Level name='".converte($d["nome"])."'
        column='codigo'
        nameColumn='nome' uniqueMembers='false' />
        ";
        $nivelDaDimensao[$k] = converte($d["nome"]);
        $xml3 .= "</Hierarchy>
        </Dimension>";
    }
    return $xml3;
}
function dimensoesTabelas(){
    global $VirtualCubeDimensionDaMedida, $CubosPorMedida, $nivelDaDimensao, $dimRegioes, $filhosDaRegiao, $m, $VirtualCubeDimension, $VirtualCubeMeasure, $chavesRegiao, $medidas, $codigo_tipo_regiao, $VirtualCubeDimensionDaRegiao, $VirtualCubeMeasureDaRegiao;

    $xml = "";
    $tbs = array();
    foreach($medidas as $medida){
        if($medida["codigo_tipo_regiao"] > 0 && ($codigo_tipo_regiao == "" || $medida["codigo_tipo_regiao"] == $codigo_tipo_regiao)){
            $k = $medida["esquemadb"].$medida["tabela"]." ".$medida["filtro"];
            if(!isset($tbs[$k])){
                $tbs[$k] = array($medida);
            }
            else{
                array_push($tbs[$k],$medida);
            }
            $CubosPorMedida[$medida["nome_variavel"]] = array();
            $VirtualCubeDimensionDaMedida[$medida["nome_variavel"]] = array();
        }
    }
    //monta os cubos para cada esquema.tabela diferente
    foreach($tbs as $tb){
        //cabecalho de cada cubo obtido da primeira medida
        $c = $tb[0];
        $VirtualCubeDimension[] = "
        <VirtualCubeDimension name='codigo_tipo_regiao_{$c["codigo_tipo_regiao"]}' />
        ";
        $VirtualCubeDimension[] = "
        <VirtualCubeDimension name='codigo_tipo_regiao_{$c["codigo_tipo_regiao"]}_geocod' />
        ";
        if(array_key_exists($c["codigo_tipo_regiao"],$VirtualCubeDimensionDaRegiao)){
            array_push(
                    $VirtualCubeDimensionDaRegiao[$c["codigo_tipo_regiao"]],
                    "<VirtualCubeDimension name='codigo_tipo_regiao_{$c["codigo_tipo_regiao"]}' />"
                    );
            array_push(
                    $VirtualCubeDimensionDaRegiao[$c["codigo_tipo_regiao"]],
                    "<VirtualCubeDimension name='codigo_tipo_regiao_{$c["codigo_tipo_regiao"]}_geocod' />"
                    );
        }
        if(array_key_exists($c["nome_variavel"],$VirtualCubeDimensionDaMedida)){
            array_push(
                    $VirtualCubeDimensionDaMedida[$c["nome_variavel"]],
                    "<VirtualCubeDimension name='codigo_tipo_regiao_{$c["codigo_tipo_regiao"]}' />"
                    );
            array_push(
                    $VirtualCubeDimensionDaMedida[$c["nome_variavel"]],
                    "<VirtualCubeDimension name='codigo_tipo_regiao_{$c["codigo_tipo_regiao"]}_geocod' />"
                    );
        }

        //verifica as dimensoes do tipo tempo
        $dimEnsoes = array();

        foreach($tb as $medida){
            $parametros = $m->listaParametro($medida["id_medida_variavel"],"","",false,false);
            $parComposto = array(); //guarda a composicao da chave que liga com a dimensao
            $colunaAdicionais = array();
            //parametro do tipo tempo
            if(count($parametros) > 0){
                foreach($parametros as $parametro){
                    if($parametro["tipo"] < 5 && $parametro["tipo"] > 0){
                        $parComposto[] = $parametro["coluna"];
                    }
                }
                $VirtualCubeDimension[] = "
                <VirtualCubeDimension name='Tempo' />
                ";
                $u = "
                <DimensionUsage foreignKey='".implode("_",$parComposto)."_' name='Tempo' source='Tempo'/>
                ";
                $dimEnsoes[] = $u;
                if(array_key_exists($c["codigo_tipo_regiao"],$VirtualCubeDimensionDaRegiao)){
                    array_push($VirtualCubeDimensionDaRegiao[$c["codigo_tipo_regiao"]],"<VirtualCubeDimension name='Tempo' />");
                }
            }
            //outros parametros
            $outrosParametros = array();
            foreach($parametros as $parametro){
                $k = $parametro["esquemadb"]."_".$parametro["tabela"]."_".$parametro["coluna"];
                if($parametro["tipo"] > 5 || $parametro["tipo"] == 0){
                    $outrosParametros[] = $k;
                    $VirtualCubeDimension[] = "<VirtualCubeDimension name='{$k}' />";
                    $u = "<DimensionUsage foreignKey='".$parametro["coluna"]."' name='{$k}' source='{$k}'/>";
                    $dimEnsoes[] = $u;
                    if(array_key_exists($c["codigo_tipo_regiao"],$VirtualCubeDimensionDaRegiao)){
                        array_push($VirtualCubeDimensionDaRegiao[$c["codigo_tipo_regiao"]],"<VirtualCubeDimension name='{$k}' />");
                    }
                }
            }

        }
        //$dimEnsoes[] = '<DimensionUsage foreignKey="coduf" name="codigo_tipo_regiao_2" source="codigo_tipo_regiao_2"/>';

        $xml .= "<Cube cache='false' name='Tabela: {$c["esquemadb"]}{$c["tabela"]} {$c["filtro"]}'>";

        $incluirChaves = array("tabelamedida{$c["id_medida_variavel"]}.*");
        //colunas quando o nome da coluna com os valores for vazia
        foreach($tb as $mdd){
            if($mdd["colunavalor"] == "" && $mdd["filtro"] == ""){
                $incluirChaves[] = "'1'::numeric as contagem".$mdd["id_medida_variavel"];
            }
            if($mdd["colunavalor"] == "" && $mdd["filtro"] != ""){
                $mdd["filtro"] = str_replace('"',"'",$mdd["filtro"]);
                $incluirChaves[] = "CASE WHEN {$mdd["filtro"]} THEN 1 ELSE 0 END as contagem".$mdd["id_medida_variavel"];
            }
        }
        if(count($parComposto) > 0){
            //$sql = "select *,".implode("||'-'||",$parComposto)."::text as ".implode("_",$parComposto)."_ from {$c["esquemadb"]}.{$c["tabela"]}";
            $incluirChaves[] = implode("||'-'||",$parComposto)."::text as ".implode("_",$parComposto)."_";
        }
        if(count($outrosParametros) > 0){
            foreach($outrosParametros as $o){
                //$incluirChaves[] = $o."::text as ".$o."_";
            }
        }
        $r = $chavesRegiao[$c["codigo_tipo_regiao"]];
        $sql = "
        select ".implode(",",$incluirChaves).", tabelamedida{$c["id_medida_variavel"]}.{$c["colunaidgeo"]}::text as codigoreg
        ";
        if(count($dimRegioes[$c["codigo_tipo_regiao"]]["colunas"]) > 0){
            $sql .= ",".implode(",",$dimRegioes[$c["codigo_tipo_regiao"]]["colunas"]);
            //$sql .= ",tabela{$r["codigo_tipo_regiao"]}.".implode(",tabela{$r["codigo_tipo_regiao"]}.",$dimRegioes[$c["codigo_tipo_regiao"]]["colunas"]);
        }

        $sql .= "
        from {$c["esquemadb"]}.{$c["tabela"]} as tabelamedida{$c["id_medida_variavel"]}
        JOIN {$r["esquemadb"]}.{$r["tabela"]} as tabela{$r["codigo_tipo_regiao"]}
        ON  tabela{$r["codigo_tipo_regiao"]}.{$r["identificador"]}::text = tabelamedida{$c["id_medida_variavel"]}.{$c["colunaidgeo"]}::text
        ";
        $sql .= $dimRegioes[$c["codigo_tipo_regiao"]]["juncoes"];
        $f = array();
        foreach($tb as $mdd){
            if($mdd["filtro"] != ""){
                $f[] = str_replace('"',"'",$mdd["filtro"]);
            }
        }
        if(count($f) > 0){
            $sql .= " WHERE ".implode(" OR ",$f);
        }

        $xml .= "
        <view alias='view_{$c["esquemadb"]}{$c["tabela"]}' ><SQL dialect='generic' >$sql</SQL></view>
        ";
        //dimensoes vinculadas
        /*
        $temp = $dimRegioes[$c["codigo_tipo_regiao"]]["codRegioes"];
        $temp[] = $c["codigo_tipo_regiao"];
        foreach($temp as $cod){
            $xml .= "
            <DimensionUsage foreignKey='codigo{$cod}' name='codigo_tipo_regiao_{$cod}' source='codigo_tipo_regiao_{$cod}'/>
            <DimensionUsage foreignKey='codigo{$cod}' name='codigo_tipo_regiao_{$cod}_geocod' source='codigo_tipo_regiao_{$cod}_geocod'/>
            ";
        }
        */
        foreach(array_keys($dimRegioes) as $cod){
            $xml .= "
            <DimensionUsage foreignKey='codigo{$cod}' name='codigo_tipo_regiao_{$cod}' source='codigo_tipo_regiao_{$cod}'/>
            <DimensionUsage foreignKey='codigo{$cod}' name='codigo_tipo_regiao_{$cod}_geocod' source='codigo_tipo_regiao_{$cod}_geocod'/>
            ";
        }
        //inclui as dimensoes filhas
        if(array_key_exists($c["codigo_tipo_regiao"],$filhosDaRegiao)){
            foreach($filhosDaRegiao[$c["codigo_tipo_regiao"]] as $fr){
                $xml .= "
                <DimensionUsage foreignKey='codigoreg' name='codigo_tipo_regiao_".$fr."' source='codigo_tipo_regiao_".$fr."'/>
                <DimensionUsage foreignKey='codigoreg' name='codigo_tipo_regiao_".$fr."_geocod' source='codigo_tipo_regiao_".$fr."_geocod'/>
                ";
            }
        }
        $xml .= implode(" ",array_unique($dimEnsoes));

        //inclui cada elemento em medida
        foreach($tb as $medida){
            $agregador = "sum";
            if($medida["permitesoma"] == 0 && $medida["permitemedia"] == 1){
                $agregador = "avg";
            }
            if($medida["permitesoma"] == 0 && $medida["permitemedia"] == 0){
                $agregador = "count";
            }
            if($medida["colunavalor"] == ""){
                $nomeColunaValor = "contagem".$medida["id_medida_variavel"];
            }
            else{
                $nomeColunaValor = $medida["colunavalor"];
            }
            $xml .= "
            <Measure name='id_medida_variavel_".$medida["id_medida_variavel"]."' caption='".converte($medida["nomemedida"])."' column='".$nomeColunaValor."' aggregator='".$agregador."' />
            ";
            $u = "
            <VirtualCubeMeasure cubeName='Tabela: {$c["esquemadb"]}{$c["tabela"]} {$c["filtro"]}' name='[Measures].[id_medida_variavel_".$medida["id_medida_variavel"]."]'/>
            ";
            $VirtualCubeMeasure[] = $u;
            if(!array_key_exists($c["codigo_tipo_regiao"],$VirtualCubeMeasureDaRegiao)){
                array_push($VirtualCubeMeasureDaRegiao[$c["codigo_tipo_regiao"]],$u);
            }
            //verifica em qual variavel entra
            //<VirtualCubeMeasure cubeName='Tabela: idsustb_indicador' name='[Measures].[id_medida_variavel_12]'/>
            $u = "<VirtualCubeMeasure cubeName='Tabela: {$c["esquemadb"]}{$c["tabela"]} {$c["filtro"]}' name='[Measures].[id_medida_variavel_".$medida["id_medida_variavel"]."]'/>";
            array_push($CubosPorMedida[$c["nome_variavel"]],$u);
        }
        $xml .= "
        </Cube>
        ";
    }
    return $xml;
}
function cuboTodas(){
    global $VirtualCubeDimension, $VirtualCubeMeasure;
    $xml = '<VirtualCube name="Todas as medidas" >';
    $VirtualCubeDimension = array_unique($VirtualCubeDimension);
    $VirtualCubeMeasure = array_unique($VirtualCubeMeasure);
    $xml .= implode(" ",$VirtualCubeDimension);
    $xml .= implode(" ",$VirtualCubeMeasure);
    $xml .= '</VirtualCube>';
    return $xml;
}
function cuboRegioes(){
    global $regioes, $VirtualCubeDimensionDaRegiao, $VirtualCubeMeasureDaRegiao, $filhosDaRegiao;
    $xml = "";
    if(!empty($regioes)){
        foreach($regioes as $regiao){
            //inclui os parametros para a regiao de acordo com os filhos que possui
            $d = $VirtualCubeDimensionDaRegiao[$regiao["codigo_tipo_regiao"]];
            $mm = $VirtualCubeMeasureDaRegiao[$regiao["codigo_tipo_regiao"]];
            foreach($filhosDaRegiao[$regiao["codigo_tipo_regiao"]] as $f){
                $mm = array_merge($mm,$VirtualCubeMeasureDaRegiao[$f]);
            }
            if(count(array_unique($mm)) > 0){
                $xml .= '<VirtualCube name="Regi&amp;atilde;o: '.converte($regiao["nome_tipo_regiao"]).'" >';
                $xml .= implode(" ",array_unique($d));
                $xml .= implode(" ",array_unique($mm));
                $xml .= '</VirtualCube>';
            }
        }
    }
    return $xml;
}

function cuboVariaveis(){
    global $CubosPorMedida, $VirtualCubeDimensionDaMedida;
    //var_dump($VirtualCubeDimensionDaMedida);exit;
    $xml = "";
    $chaves = array_keys($CubosPorMedida);
    foreach ($chaves as $c){
        $xml .= '<VirtualCube name="'.converte($c).'" >';
        $xml .= '<VirtualCubeDimension name="Tempo" />';
        $xml .= implode(" ",$VirtualCubeDimensionDaMedida[$c]);
        $xml .= implode(" ",$CubosPorMedida[$c]);
        $xml .= '</VirtualCube>';
    }
    return $xml;
}
?>