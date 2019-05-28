<?php
/**
 * Classe metaestatInfo
 * O construtor da classe faz o include do programa conexao.php que por sua vez faz o include
 * de i3geo/ms_configura.php. Com base nesses programas sao definidas algumas das variaveis globais
 */
class MetaestatInfo{
    /**
     * Nome do esquema no banco de dados utilizado para armazenar as tabelas
     * do sistema de admnistracao. Obtido de ms_configura.php
     */
    protected $esquemaadmin;
    /**
     * Objeto PDO obtido com new PDO com direito de leitura no banco de dados de administracao
     */
    public $dbh;
    /**
     * Indica se e necessario converter para UTF strings obtidas do banco de administracao
     */
    public $convUTF;
    /**
     * Pasta temporaria utilizada pelo mapserver
     */
    public $dir_tmp;
    /**
     * Pasta onde e feito o cache de imagens do i3Geo
     */
    public $nomecache;
    /**
     * Grava ou nao o log de transacoes
     */
    public $logTransacoes;
    /**
     * Construtor
     * Faz o include de conexao.php que por sua vez faz o include de i3geo/ms_configura.php
     */
    function __construct(){
        include(dirname(__FILE__)."/conexao.php");
        error_reporting(0);
        //vem do include
        $this->dir_tmp = $dir_tmp;
        $this->logTransacoes = $logTransacoes;
        $this->locaplic = $locaplic;
        $this->base = $base;
        if(!isset($convUTF)){
            $convUTF = true;
        }
        $this->convUTF = $convUTF;
        $this->dbh = $dbh;
        $this->esquemaadmin = "";
        if(!empty($esquemaadmin)){
            $this->esquemaadmin = str_replace(".","",$esquemaadmin).".";
        }
        $this->nomecache = $this->nomeCache();
    }
    function __destruct(){
        $this->fechaConexao();
    }
    /**
     * Cria um nome de arquivo concatenando $_request
     * @return string
     */
    function nomeCache(){
        return "AAAA".md5(implode("x",$_REQUEST));
    }
    /**
     * Cria um nome aleatorio
     * @param numero de caracteres
     * @return string
     */
    function nomeRandomico($n=10){
        $nomes = "";
        $a = 'azertyuiopqsdfghjklmwxcvbnABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $max = 51;
        for($i=0; $i < $n; ++$i)
        {
            $nomes .= $a{mt_rand(0, $max)};
        }
        return $nomes;
    }
    /**
     * Fecha a conexao com o banco de dados de administracao
     */
    function fechaConexao(){
        //$this->dbh = null;
    }
    /**
     * Aplica a conversao de caracteres em um array ou string conforme o padrao do banco de administracao
     * Verifica se o parametro e um array ou um texto e executa converteTexto()
     * @param string|array
     * @return string|array
     */
    function converteTextoArray($texto){
        try	{
            if(empty($texto) || (!is_array($texto) && strtoupper($texto) == "NULL")){
                return "";
            }
            if(!is_array($texto)){
                return $this->converteTexto($texto);
            }
            $chaves = array_keys($texto);
            if($chaves[0] != "0"){
                foreach($chaves as $chave){
                    $texto[$chave] = $this->converteTexto($texto[$chave]);
                }
            }
            else{
                $n = count($texto);
                for($i=0;$i<$n;$i++){
                    $chaves = array_keys($texto[$i]);
                    foreach($chaves as $chave){
                        if(is_string($texto[$i][$chave])){
                            $t = $this->converteTexto($texto[$i][$chave]);
                            $texto[$i][$chave] = $t;
                        }
                    }
                }
            }
            return $texto;
        }
        catch (Exception $e)	{
            return $texto;
        }
    }
    /**
     * Converte a codificacao de caracteres de uma string conforme o padrao do banco de admnistracao
     * @param string
     * @return string
     */
    function converteTexto($texto){
        if($texto == "0"){
            return "0";
        }
        if(empty($texto)){
            return "";
        }
        if($this->convUTF == true){
            $texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"UTF-8");
        }
        else{
            $texto = mb_convert_encoding($texto,mb_detect_encoding($texto),"ISO-8859-1");
        }
        return $texto;
    }
    /**
     * Executa um SQL no banco de administracao
     * Utiliza fetchAll() para obter os dados
     * O resultado e processado por converteTextoArray se for desejado
     * @param string sql
     * @param se for vazio retorna todos os registros, caso contrario, retorna apenas o primeiro
     * @param indica se deve ser feita a conversao de caracteres
     * @return Array
     */
    function execSQL($sql,$id="",$convTexto=true){
        $sql = str_ireplace(array("update","delete","insert","--","drop",";"),"",$sql);
        //error_log("--                        ");
        //error_log("--xxxxxxxxxxx---- SQL: ".$sql);
        try	{
            $q = $this->dbh->query($sql,PDO::FETCH_ASSOC);
        }
        catch (PDOException $e)	{
            //error_log("--                        ");
            //error_log("--erro i3geo-- classe_metaestatinfo execSQL: ".$sql);
            return "Error!: ";
        }
        if($q){
            //error_log("--xxxxxxxxxxx---- Executando o SQL ");
            $r = $q->fetchAll();
            //error_log("--xxxxxxxxxxx---- Executado ");
            if($convTexto == false){
                return $r;
            }
            if($r){
                if($id != ""){
                    if(count($r) == 1){
                        $r = $r[0];
                    }
                    else{
                        $r = array();
                    }
                }
                if($r != false && count($r) > 0){
                    $r = $this->converteTextoArray($r);
                }
                return $r;
            }
            else{
                return array();
            }
        }
        else{
            //error_log("--");
            //error_log("--erro i3geo-- classe_metaestatinfo execSQL");
            return false;
        }
    }
    /**
     * Executa um SQL no banco de dados definido em uma conexao cadastrada no sistema de admnistracao
     * @param codigo da conexao
     * @param tring sql
     * @return string
     */
    function execSQLDB($codigo_estat_conexao,$sql){
        $buscar = array("drop","update","insert","delete");
        $sql = str_ireplace($buscar,"",$sql);
        //$c = $this->listaConexao($codigo_estat_conexao,true);
        $c = $this->listaConexaoMetaestat();
        $dbhold = $this->dbh;
        $dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
        $this->dbh = $dbh;
        $res = $this->execSQL($sql,"",false);
        $this->dbh = $dbhold;
        return $res;
    }
    /**
     * Monta o sql que permite acessar os dados de uma media de uma variavel
     * @param id da medida da variavel
     * @param inclui todas as colunas da tabela com os dados ou nao
     * @param coluna que sera usada para agrupar os dados
     * @param tipo de layer. Usado para escolher qual coluna com as geometrias sera incluida no sql
     * @param codigo do tipo de regiao. Se nao for definido, utiliza-se o default da variavel
     * @param le os dados diretamente da tabela sem nenhum tipo de agrupamento, seja por data ou outro parametro
     * @return array("sqlagrupamento"=>,"sql"=>,"sqlmapserver"=>,"filtro"=>,"colunas"=>,"alias"=>,"colunavalor"=>,"titulo"=>,"nomeregiao"=>)
     */
    function sqlMedidaVariavel($id_medida_variavel,$todasascolunas,$agruparpor="",$tipolayer="polygon",$codigo_tipo_regiao = "",$suportaWMST = false,$filtro = "",$direto=false){
        //
        //o sql que faz acesso aos dados e marcado com /*SE*//*SE*/ na string que sera usada nos mapfiles
        //a parte que contem referencias a coluna com a geometria e marcada com /*SG*//*SG*/
        //
        //registros da medida da variavel
        $dados = $this->listaTabelaMedidaVariavel($id_medida_variavel);
        $dadosUnidadeDeMedida = $this->listaUnidadeMedida($dados["codigo_unidade_medida"]);
        if(!empty($dados["filtro"])){
            if($filtro == ""){
                $filtro = $dados["filtro"];
            }
            else{
                $filtro = $filtro." AND (".$dados["filtro"].")";
            }
        }

        //parametros da medida da variavel
        $parametrosMedida = array();
        $pp = $this->listaParametro($id_medida_variavel,"",0);
        foreach($pp as $p){
            $parametrosMedida[] = $p["coluna"];
        }

        //titulo da medida de variavel
        $titulo = $dados["nomemedida"];
        //indica se os dados devem ser agregados a uma regiao de nivel superior
        $agregaregiao = false;
        //nome da coluna que contem os limites geograficos da regiao desejada pelo usuario
        $colunageo = "";

        //se a regiao definida para a medida da variavel for diferente da regiao indicada pelo usuario
        //significa que a regiao indicada pelo usuario e uma agragacao
        if($codigo_tipo_regiao != "" && $dados["codigo_tipo_regiao"] != $codigo_tipo_regiao){
            $agregaregiao = true;
            //guarda os dados da regiao que agrega a regiao original da medida variavel
            $dadosgeo = $this->listaTipoRegiao($codigo_tipo_regiao);
        }
        else{
            $dadosgeo = $this->listaTipoRegiao($dados["codigo_tipo_regiao"]);
        }
        if(empty($dadosgeo)){
            echo "Erro ao obter os dados do tipo de regiao";
            exit;
        }
        if($tipolayer != "point"){
            $colunageo = $dadosgeo["colunageo"];
            $titulo .= " (pol) ";
        }
        else{
            $colunageo = $dadosgeo["colunacentroide"];
            $titulo .= " (pt) ";
        }
        $titulo .= $dadosgeo["nome_tipo_regiao"];

        $vis = $dadosgeo["colunasvisiveis"];
        if(!empty($vis) && $suportaWMST == false){
            $vis = $vis.",".$dadosgeo["identificador"];
            $vis = str_replace(" ",",",$vis);
            $vis = str_replace(",,",",",$vis);
            $vis = str_replace(";",",",$vis);

            $colunasSemGeo = explode(",",$vis);
            $colunasSemGeo = array_unique($colunasSemGeo);

            if($dadosgeo["apelidos"] != ""){
                $alias = "Valor,".$dadosgeo["apelidos"].",".$dadosgeo["identificador"];
                $alias = mb_convert_encoding($alias,"ISO-8859-1",mb_detect_encoding($alias));
                $alias = str_replace(";",",",$alias);
                $alias = str_replace(",,",",",$alias);
                $alias = explode(",",$alias);
                $alias = array_unique($alias);
            }
            else{
                $alias = $colunasSemGeo;
            }
            if(count($alias)-1 != count($colunasSemGeo)){
                $alias = array();
            }
        }
        else{
            //colunas da tabela geometria sem as colunas GEOMETRY
            $colunasSemGeo = $this->colunasTabela($dadosgeo["codigo_estat_conexao"], $dadosgeo["esquemadb"], $dadosgeo["tabela"],"geometry","!=");
            $alias = array();
            if($suportaWMST == true){
                $sqlWMST = $this->listaParametroTempo2CampoData($id_medida_variavel);
                $colunasSemGeo[] = "dimtempo";
            }
        }
        //verifica o tipo de calculo para agragacao de valores
        $tipoconta = "";
        if($dadosUnidadeDeMedida["permitesoma"] == 1 && $direto == false){
            $tipoconta = "sum";
            if($agregaregiao == true){
                $titulo .= " - soma";
            }
        }
        elseif($dadosUnidadeDeMedida["permitemedia"] == 1 && $direto == false){
            $tipoconta = "avg";
            if($agregaregiao == true){
                $titulo .= " - media";
            }
        }

        //obtem o SQL que faz o acesso aos dados da media da variavel
        if($dados["colunavalor"] == ""){
            $nomevalorcalculado = "'1'::numeric";
        }
        else{
            $nomevalorcalculado = $dados["colunavalor"];
        }

        $sqlDadosMedidaVariavel = "SELECT ".$dados["colunaidgeo"]." AS cod_regiao,$tipoconta(".$nomevalorcalculado.") AS valorcalculado FROM ".$dados["esquemadb"].".".$dados["tabela"];
        if($suportaWMST == true && $direto == false){
            $sqlDadosMedidaVariavel = "SELECT $sqlWMST as dimtempo,".$dados["colunaidgeo"]." AS cod_regiao,".$nomevalorcalculado." AS valorcalculado FROM ".$dados["esquemadb"].".".$dados["tabela"];
        }
        if(!empty ($filtro)){
            $sqlDadosMedidaVariavel .=	" WHERE ".$filtro . " AND ".$nomevalorcalculado." IS NOT NULL ";
        }
        else{
            $sqlDadosMedidaVariavel .=	" WHERE ".$nomevalorcalculado." IS NOT NULL ";
        }
        if($suportaWMST != true && $direto == false && $tipoconta != ""){
            $sqlDadosMedidaVariavel .= " /*FA*//*FA*/ /*FAT*//*FAT*/ GROUP BY cod_regiao ";
        }
        $sqlagrupamento = "";
        //sql que retorna a lista de ocorrencias agrupados de uma coluna especifica
        if(!empty($agruparpor) && $direto == false){
            $sqlagrupamento = " SELECT $agruparpor FROM ".$dados["esquemadb"].".".$dados["tabela"];
            if(!empty ($filtro)){
                $sqlagrupamento .= " WHERE ".$filtro;
            }
            $sqlagrupamento .= " /*FA*//*FA*/ /*FAT*//*FAT*/ GROUP BY ".$agruparpor." ORDER BY ".$agruparpor;
        }
        if($dados["colunavalor"] == ""){
            $nomeColunaValor = "contagem";
        }
        else{
            $nomeColunaValor = $dados["colunavalor"];
        }
        //pega o tipo das coluna regiao.".$dadosgeo["identificador"]
        $propColuna1 = $this->descreveColunasTabela(
            $dadosgeo["codigo_estat_conexao"],
            $dados["esquemadb"],
            $dados["tabela"],
            $dados["colunaidgeo"]
            );
        $propColuna2 = $this->descreveColunasTabela(
            $dadosgeo["codigo_estat_conexao"],
            $dadosgeo["esquemadb"],
            $dadosgeo["tabela"],
            $dadosgeo["identificador"]
            );
        if(in_array(array('oid','float4','float8','int2','int4','int8','int16','smallint','integer','real','double precision','bigint','numeric'),$propColuna1["type"])){
            $propColuna1 = 'numeric';
        } else {
            $propColuna1 = 'text';
        }
        if(in_array(array('oid','float4','float8','int2','int4','int8','int16','smallint','integer','real','double precision','bigint','numeric'),$propColuna2["type"])){
            $propColuna2 = 'numeric';
        } else {
            $propColuna2 = 'text';
        }
        if($propColuna1 == $propColuna2){
            $propColuna1 = "";
            $propColuna2 = "";
        } else {
            if($propColuna1 == 'numeric'){
                $propColuna1 = 'text';
            }
            if($propColuna2 == 'numeric'){
                $propColuna2 = 'text';
            }
            if($propColuna1 != ''){
                $propColuna1 = '::'.$propColuna1;
            }
            if($propColuna2 != ''){
                $propColuna2 = '::'.$propColuna2;
            }
        }
        $sqlIntermediario = "SELECT (j.valorcalculado) AS ".$nomeColunaValor.", __COLUNASSEMGEO__".
            " FROM ".$dadosgeo["esquemadb"].".".$dadosgeo["tabela"]." AS regiao ".
            " INNER JOIN ( __SQLDADOS__ ) ".
            " AS j ON j.cod_regiao" . $propColuna1 . " = regiao.".$dadosgeo["identificador"] . $propColuna2;
        //inclui os sqls de regioes de niveis inferiores
        if($agregaregiao == true && $direto == false){
            $hierarquia = $this->regiaoFilhaAoPai($dados["codigo_tipo_regiao"],$codigo_tipo_regiao);
            $caminho = $hierarquia["caminho"];
            $dadosColunas = $hierarquia["colunas"];
            //var_dump($hierarquia);exit;
            if(count($caminho) > 0){
                $caminho = array_reverse($caminho);
                foreach($caminho as $idregiao){
                    if($idregiao != $codigo_tipo_regiao){//a regiao pai ja esta no sql
                        $tempDadosRegiao = $this->listaTipoRegiao($idregiao);
                        //para contador forcado
                        if($dados["colunavalor"] == ""){
                            $nomevalorcalculado = "'1'::numeric";
                        }
                        else{
                            $nomevalorcalculado = "j.valorcalculado";
                        }
                        $temp = "SELECT regiao.".$dadosColunas[$idregiao]["colunaligacao_regiaopai"]." AS cod_regiao,sum(".$nomevalorcalculado.") AS valorcalculado ".
                            "FROM ".$tempDadosRegiao["esquemadb"].".".$tempDadosRegiao["tabela"]." AS regiao ".
                            "INNER JOIN ".
                            "( __SQLDADOS__ )".
                            " AS j ON j.cod_regiao::text = regiao.".$tempDadosRegiao["identificador"]."::text GROUP BY regiao.".$dadosColunas[$idregiao]["colunaligacao_regiaopai"];
                        $sqlIntermediario = str_replace("__SQLDADOS__",$temp,$sqlIntermediario);
                    }
                }
            }
        }
        //sql final que retorna os dados
        //contem todas as colunas da tabela regiao, menos as que contem geometria
        $sql = 	str_replace("__SQLDADOS__",$sqlDadosMedidaVariavel,$sqlIntermediario);
        $sql = 	str_replace("__COLUNASSEMGEO__",implode(",",$colunasSemGeo),$sql);

        //sql para o mapserver
        $sqlgeo = 	str_replace("__SQLDADOS__",$sqlDadosMedidaVariavel,$sqlIntermediario);
        $colunasComGeo = $colunasSemGeo;
        //$colunasComGeo[] = "/*SG*/st_setsrid(".$colunageo.",".$dadosgeo["srid"].") as ".$colunageo." /*SG*/";
        $colunasComGeo[] = "/*SG*/".$colunageo." as ".$colunageo." /*SG*/";
        $sqlgeo = str_replace("__COLUNASSEMGEO__",implode(",",$colunasComGeo),$sqlgeo);
        $sqlgeo = $colunageo." from /*SE*/(".$sqlgeo." /*FR*//*FR*/ )/*SE*/ as foo using unique ".$dadosgeo["identificador"]." using srid=".$dadosgeo["srid"];

        //o SQL com os dados contem um filtro ou nao?
        $contemfiltro = false;
        if(!empty($filtro) && $direto == false){
            $contemfiltro = true;
            $titulo .= " ".$filtro;
        }
        //adiciona a coluna com os valores no inicio do array()
        $colunasSemGeo = array_merge(array($dados["colunavalor"]),$colunasSemGeo);
        $buscar = array("drop","update","insert","create","alter","delete");
        $sql = str_ireplace($buscar,"",$sql);
        $sqlagrupamento = str_ireplace($buscar,"",$sqlagrupamento);
        $sqlgeo = str_ireplace($buscar,"",$sqlgeo);
        return array(
            "nomeregiao"=>$dadosgeo["colunanomeregiao"],
            "titulo"=>$titulo,
            "colunavalor"=>$dados["colunavalor"],
            "sqlagrupamento"=>$sqlagrupamento,
            "sql"=>$sql,
            "sqlmapserver"=>$sqlgeo,
            "filtro"=>$contemfiltro,
            "colunas"=>$colunasSemGeo,
            "alias"=>$alias,
            "srid"=>$dadosgeo["srid"]
        );
    }
    /**
     * Retorna o sql de uma string obtida do elemento data de um layer mapserver
     * Remove a referencia a coluna geo
     * @param string obtida de DATA de um LAYER mapserver
     */
    function dataLayer2sql ($data){
        //remove marcadores geo
        $sqlf = explode("/*SE*/",$data);
        $sqlf = explode("/*SG*/",$sqlf[1]);
        $sqlf = $sqlf[0]." ".$sqlf[2];
        $sqlf = str_replace(",  FROM"," FROM",$sqlf);
        return $sqlf;
    }
    /**
     * Retorna os ids das regioes que permitem partir de uma regiao filha chegar a uma regiao pai
     * Usado para descobrir que regioes devem ser sequencialmente agregadas
     * @param partir da regiao
     * @param chegar na regiao
     * @return array lista de ids de regioes sequenciais do filho ate chegar ao pai indicado
     */
    function regiaoFilhaAoPai($codigo_tipo_regiao,$codigo_tipo_regiao_pai=""){
        $pais = $this->listaAgregaRegiao($codigo_tipo_regiao);
        $caminho = array($codigo_tipo_regiao);
        $colunas = array();
        if(count($pais) == 0){
            return $caminho;
        }
        foreach($pais as $pai){
            $caminho[] = $pai["codigo_tipo_regiao_pai"];
            $colunas[$pai["codigo_tipo_regiao"]] = $pai;
            if($pai["codigo_tipo_regiao_pai"] == $codigo_tipo_regiao_pai){
                return array("caminho"=>$caminho,"colunas"=>$colunas);
            }
        }
        return array("caminho"=>$caminho,"colunas"=>$colunas);
    }
    function hierarquiaPath($node){
        $query="select codigo_tipo_regiao_pai as parent from ".$this->esquemaadmin."i3geoestat_agregaregiao WHERE codigo_tipo_regiao = $node";
        $result=$this->execSQL($query,"",false);
        $row = $result[0];
        // save the path in this array
        $path = array();
        // only continue if this $node isn't the root node
        // (that's the node with no parent)
        if ($row['parent']!='') {
            // the last part of the path to $node, is the name
            // of the parent of $node
            $path[] = $row['parent'];
            // we should add the path to the parent of this node
            // to the path
            $path = array_merge($this->hierarquiaPath($row['parent']), $path);
        }
        // return the path
        sort($path);
        return $path;
    }
    /**
     * Cria um arquivo mapfile para uma medida de variavel
     * Inclui no arquivo o layer de acesso aos dados
     * O mapfile contem apenas o layer
     * O arquivo e armazenado em uma pasta temporaria
     * O sql e obtido com o metodo sqlMedidaVariavel
     * @param id da medida da variavel
     * @param filtro que sera concatenado ao sql padrao da medida
     * @param 0|1 indica se todas as colunas da tabela original dos dados sera incluida no sql
     * @param tipo de layer
     * @param titulo do layer
     * @param id da classificacao cadastrada,se for vazio usa o primeiro
     * @param coluna que sera usada como agrupamento no sql
     * @param codigo do tipo de regiao cadastrada
     * @param valor de opacidade do layer
     * @param o layer deve suportar WMS-T ou nao
     * @param faz o cache do mapfile
     * @return array("mapfile"=>,"layer"=>,"titulolayer"=>)
     */
    function mapfileMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$tipolayer="polygon",$titulolayer="",$id_classificacao="",$agruparpor="",$codigo_tipo_regiao="",$opacidade="",$suportaWMST=false,$cachemapfile=true,$nomeTemp=""){
        //para permitir a inclusao de filtros, o fim do sql e marcado com /*FW*//*FW*/
        //indicando onde deve comecar e terminar uma possivel clausula where
        //ou com /*FA*//*FA*/
        //para marcar que deve ser utilizado AND ao adicionar o filtro
        //utiliza-se da mesma forma /*FAT*//*FAT*/ e /*FWT*//*FWT*/ para os filtros de tempo
        //Layers adicionados aqui sao marcados com o metadata METAESTAT "SIM"
        //O codigo_tipo_regiao e marcado com o metadata METAESTAT_CODIGO_TIPO_REGIAO
        //O id da medida da variavel e marcado com o metadata METAESTAT_ID_MEDIDA_VARIAVEL
        if($cachemapfile == false){
            $this->nomecache = $this->nomecache . $this->nomeRandomico(5);
        }
        if($nomeTemp == ""){
            $arq = $this->dir_tmp."/".$this->nomecache.".map";
            $nomeDoLayer = $this->nomecache;
        } else {
            $arq = $nomeTemp;
            $nomeDoLayer = str_replace(".map","",basename($nomeTemp));
        }
        //error_log("--                        ");
        //error_log("--xxxxxxxxxxx---- nomecache: ".$arq);
        if(!file_exists($arq)){
//error_log("----- m->listaTabelaMedidaVariavel");
            $meta = $this->listaTabelaMedidaVariavel($id_medida_variavel);
            //evita agregar regioes qd nao e necessario
            if($meta["codigo_tipo_regiao"] == $codigo_tipo_regiao || empty($codigo_tipo_regiao) ){
                $agruparpor = "";
            }
            //$dconexao = $this->listaConexao($meta["codigo_estat_conexao"],true);
//error_log("----- m->listaConexaoMetaestat");
            $dconexao = $this->listaConexaoMetaestat();
            $conexao = "user=".$dconexao["usuario"]." password=".$dconexao["senha"]." dbname=".$dconexao["bancodedados"]." host=".$dconexao["host"]." port=".$dconexao["porta"]."";
//error_log("----- m->sqlMedidaVariavel");
            $sql = $this->sqlMedidaVariavel(
                $id_medida_variavel,
                $todasascolunas,
                $agruparpor,
                $tipolayer,
                $codigo_tipo_regiao,
                $suportaWMST,
                $filtro
                );
            //error_log("--                        ");
            //error_log("--xxxxxxxxxxx---- sqlMedidaVariavel: ".$sql);
            if(empty($codigo_tipo_regiao)){
                //$d = $this->listaMedidaVariavel("",$id_medida_variavel);
                $codigo_tipo_regiao = $meta["codigo_tipo_regiao"];
            }
            if(empty($codigo_tipo_regiao)){
                return false;
            }
//error_log("----- m->listaDadosGeometriaRegiao");
            //define o tipo correto de layer
            $dg = $this->listaDadosGeometriaRegiao($codigo_tipo_regiao);
            if(empty($tipolayer) || !isset($dg["dimension"]) || $dg == false || empty($dg) || $dg["dimension"] == ""){
                $tipolayer = "polygon";
            } else {
                if($dg["dimension"] == 0){
                    $tipolayer = "point";
                }
                if($dg["dimension"] == 1){
                    $tipolayer = "line";
                }
            }
            error_log("++++++ mapfileMedidaVariavel ");
            error_log("++++++ dg['dimension'] ".$dg["dimension"]);
            error_log("++++++ codigo_tipo_regiao ".$codigo_tipo_regiao);
            error_log("++++++ tipolayer ".$tipolayer);
            error_log("++++++ dimension ".$dg["dimension"]);
            error_log("++++++ id_medida_variavel ".$id_medida_variavel);
            //$tipolayer = "polygon";
            $sqlf = $sql["sqlmapserver"];
            $classes = "";
            if(!empty($id_classificacao)){
                $classes = $this->listaClasseClassificacao($id_classificacao);
            }
            else{
                $classificacoes = $this->listaClassificacaoMedida($id_medida_variavel);
                $classes = $this->listaClasseClassificacao($classificacoes[0]["id_classificacao"]);
            }
            if($classes == false){
                //error_log("--                        ");
                //error_log("--xxxxxxxxxxx---- dadosMedidaVariavel: ".$sql);
                $valores = $this->dadosMedidaVariavel($id_medida_variavel,$filtro." AND ".$meta["colunavalor"]." > 0 ");
                //error_log("--                        ");
                //error_log("--xxxxxxxxxxx---- dadosMedidaVariavel obtidos ");
                $valores = array_column($valores,$meta["colunavalor"]);
                $item = $meta["colunavalor"];
                $classes = array();
                $cores = array();
                //cores baseadas em colorbrewer
                $cores[] = array(array(179,205,227),array(140,150,198),array(136,86,167),array(129,15,124));
                $cores[] = array(array(178,226,226),array(102,194,164),array(44,162,95),array(0,109,44));
                $cores[] = array(array(186,228,188),array(123,204,196),array(67,162,202),array(8,104,172));
                $cores[] = array(array(253,204,138),array(252,141,89),array(227,74,51),array(179,0,0));
                $cores[] = array(array(189,201,225),array(116,169,207),array(43,140,190),array(4,90,141));
                $cores[] = array(array(189,201,225),array(103,169,207),array(28,144,153),array(1,108,89));
                $cores[] = array(array(215,181,216),array(223,101,176),array(221,28,119),array(152,0,67));
                $cores[] = array(array(251,180,185),array(247,104,161),array(197,27,138),array(122,1,119));
                $cores[] = array(array(194,230,153),array(120,198,121),array(49,163,84),array(0,104,55));
                $cores[] = array(array(255,255,178),array(254,204,92),array(253,141,60),array(240,59,32));
                $cores = $cores[mt_rand(0,9)];
                include_once("classe_estatistica.php");
                $estat = new estatistica();
                $estat->calcula($valores);
                $calc = $estat->resultado;
                $titulo = array();
                //adiciona as classes novas
                $expressao[] = "([".$item."]<=".($calc["quartil1"]).")";
                $titulo[] = "<=".round($calc["quartil1"],3);
                $expressao[] = "(([".$item."]>".($calc["quartil1"]).")and([".$item."]<=".($calc["quartil2"])."))";
                $titulo[] = "> ".round($calc["quartil1"],3)." e <= ".round($calc["quartil2"],3);
                if($calc["quartil3"] != 0){
                    $expressao[] = "(([".$item."]>".($calc["quartil2"]).")and([".$item."]<=".($calc["quartil3"])."))";
                    $titulo[] = "> ".round($calc["quartil2"],3)." e <= ".round($calc["quartil3"],3);
                    $expressao[] = "([".$item."]>".($calc["quartil3"]).")";
                    $titulo[] = "> ".round($calc["quartil3"],3);
                }
                if($calc["quartil1"] > 0){
                    $classes[] = array(
                        "expressao"=>"([".$item."] = 0)",
                        "titulo"=>"0",
                        "verde"=>100,
                        "vermelho"=>100,
                        "azul"=>100
                    );
                }
                for ($i=0;$i < count($expressao);++$i){
                    $classes[] = array(
                        "expressao"=>$expressao[$i],
                        "titulo"=>$titulo[$i],
                        "verde"=>$cores[$i][1],
                        "vermelho"=>$cores[$i][0],
                        "azul"=>$cores[$i][2]
                    );
                }
            }
            if(!empty($titulolayer)){
                //$titulolayer = mb_convert_encoding($titulolayer,"ISO-8859-1",mb_detect_encoding($titulolayer));
            }
            else{
                $titulolayer = mb_convert_encoding($sql["titulo"],"ISO-8859-1",mb_detect_encoding($sql["titulo"]));
            }
            //necessario para evitar problemas com ITENSDESC
            $titulolayer = str_replace(","," ",$titulolayer);
            $titulolayer = str_replace("=",": ",$titulolayer);
            //pega os parametros caso seja um mapfile para WMS-time
            if($suportaWMST == true){
                $sqlMinMax = "select min(dimtempo) as min,max(dimtempo) as max from(".$sql["sql"].") as x";
                $minmaxdata = $this->execSQLDB($meta["codigo_estat_conexao"],$sqlMinMax );
                $fontemeta = $this->listaFonteinfoMedida($id_medida_variavel);
                if(count($fontemeta) > 0){
                    $fontemeta = $fontemeta[0]["link"];
                }
                else{
                    $fontemeta = "";
                }
            }
            $dados[] = "MAP";
            $dados[] = 'SYMBOLSET "'.$this->locaplic.'/symbols/simbolosv6.sym"';
            $dados[] = 'FONTSET   "'.$this->locaplic.'/symbols/fontes.txt"';
            //inclui os simbolos que podem ser definidos como imagens
            foreach($classes as $classe){
                if(!empty($classe["simbolo"])){
                    if(file_exists($classe["simbolo"])){
                        $dados[] = "SYMBOL";
                        $dados[] = '	NAME "'.$classe["simbolo"].'"';
                        $dados[] = '			TYPE pixmap';
                        $dados[] = '	IMAGE "'.$classe["simbolo"].'"';
                        $dados[] = "END";
                    }
                }
            }
            $dados[] = "LAYER";
            $dados[] = '	NAME "'.$nomeDoLayer.'"';
            $dados[] = "	TYPE $tipolayer";
            $dados[] = '	DATA "'.$sqlf.'"';
            //$dados[] = '	CONNECTION "'.$conexao.'"';
            $dados[] = '	CONNECTION "metaestat"';
            $dados[] = '	CONNECTIONTYPE POSTGIS';
            $dados[] = '	STATUS OFF';
            $dados[] = '	TEMPLATE "none.htm"';
            if($opacidade != ""){
                $dados[] = '	OPACITY '.$opacidade;
            }
            $dados[] = '	METADATA';
            $dados[] = '		TEMA "'.$titulolayer.'"';
            $dados[] = '		tme	"{\"titulo\":\"'.$titulolayer.'\",\"colnome\":\"'.$sql["nomeregiao"].'\",\"colsdata\":[\"'.$sql["colunavalor"].'\"],\"lmax\":\"8000\",\"amax\":\"500000\",\"outlinecolor\":\"-1,-1,-1\",\"numvertices\":\"4\",\"auto\":\"nao\",\"exec\":\"nao\"}"';

            $dados[] = '		TIP "'.$sql["colunavalor"].','.$sql["nomeregiao"].'"';
            //$dados[] = '        "UTFDATA" "'.$sql["colunavalor"].'"';
            $dados[] = '		CLASSE "SIM"';
            $dados[] = '		permitedownload "SIM"';
            $dados[] = '		METAESTAT "SIM"';
            $dados[] = '		METAESTAT_CODIGO_TIPO_REGIAO "'.$codigo_tipo_regiao.'"';
            $dados[] = '		METAESTAT_ID_MEDIDA_VARIAVEL "'.$id_medida_variavel.'"';
            //marca se a tabela e editavel, verificando se esta no esquema padrao
            if($meta["esquemadb"] == "i3geo_metaestat"){
                $dados[] = '		EDITAVEL "SIM"';
                $dados[] = '		COLUNAIDUNICO "'.$meta["colunaidunico"].'"';
                $dados[] = '		TABELAEDITAVEL "'.$meta["tabela"].'"';
                $dados[] = '		ESQUEMATABELAEDITAVEL "'.$meta["esquemadb"].'"';
            }
            if(count($sql["alias"]) > 0){
                $dados[] = '	ITENS "'.implode(",",$sql["colunas"]).'"';
                $dados[] = '	ITENSDESC "'.implode(",",$sql["alias"]).'"';
            }
            if($suportaWMST == true){
                $dados[] = '	"wms_timeitem"	"dimtempo"';
                $dados[] = '	"wms_timeextent" "'.$minmaxdata[0]["min"]."/".$minmaxdata[0]["max"].'"';
                $dados[] = '	"wms_timedefault" "'.$minmaxdata[0]["max"].'"';
                $dados[] = '	"ows_metadataurl_href" "'.$fontemeta.'"';
                $dados[] = ' 	"ows_metadataurl_type" "TC211" ';
                $dados[] = '	"ows_metadataurl_format" "text/html" ';
            }
            $dados[] = '	END';
            if($classes == ""){
                $dados[] = '    CLASS';
                $dados[] = '        NAME ""';
                $dados[] = '        STYLE';
                $dados[] = '        	COLOR 200 0 0';
                if(strtolower($tipolayer) == "point"){
                    $dados[] = '        SYMBOL "ponto"';
                    $dados[] = '        SIZE 5';
                }
                $dados[] = '        END';
                $dados[] = '    END';
            }
            else{
                foreach($classes as $classe){
                    //var_dump($classe);exit;
                    $dados[] = '    CLASS';
                    $dados[] = '        NAME "'.mb_convert_encoding($classe["titulo"],"ISO-8859-1",mb_detect_encoding($classe["titulo"])).'"';
                    if($classe["expressao"] != ""){
                        $expressao = str_replace('"',"'",$classe["expressao"]);
                        $dados[] = "        EXPRESSION ".$expressao;
                    }
                    $dados[] = '        STYLE';
                    $dados[] = '        	COLOR '.$classe["vermelho"].' '.$classe["verde"].' '.$classe["azul"];
                    if(!empty($classe["tamanho"])){
                        $dados[] = '        SIZE '.$classe["tamanho"];
                    }
                    elseif(strtolower($tipolayer) == "point"){
                        $dados[] = '        SIZE 5';
                    }
                    if(!empty($classe["simbolo"])){
                        $dados[] = '        SYMBOL '.$classe["simbolo"];
                    }
                    elseif(strtolower($tipolayer) == "point"){
                        $dados[] = '        SYMBOL ponto';
                    }
                    if(!empty($classe["otamanho"])){
                        $dados[] = '        OUTLINEWIDTH '.$classe["otamanho"];
                    }
                    if(!empty($classe["overmelho"]) || $classe["overmelho"] == "0"){
                        $dados[] = '        OUTLINECOLOR '.$classe["overmelho"].' '.$classe["overde"].' '.$classe["oazul"];
                    }
                    $dados[] = '        END';
                    $dados[] = '    END';
                }
            }
            $dados[] = "END";
            $dados[] = "END";
            $fp = fopen($arq,"w");
            foreach ($dados as $dado){
                fwrite($fp,$dado."\n");
            }
        }

        return array("mapfile"=>$arq,"layer"=>$nomeDoLayer,"titulolayer"=>$titulolayer);
    }
    /**
     * Cria um mapfile para visualizacao de regioes
     * Inclui no arquivo o layer de acesso aos dados
     * O mapfile contem apenas o layer
     * O arquivo e armazenado em uma pasta temporaria
     * Se o arquivo para a mesma regiao ja existir, tenta usa-lo ao inves de criar um novo
     * @param codigo da regiao
     * @param cor do outline do simbolo de desenho
     * @param largura do simbolo
     * @param sim|nao inclui ou nao os labels
     * @param boolean remove o arquivo em cache e cria um novo
     * @return array("mapfile"=>,"layer"=>,"titulolayer"=>,"codigo_tipo_regiao"=>)
     */
    function mapfileTipoRegiao($codigo_tipo_regiao,$outlinecolor="255,0,0",$width=1,$nomes="nao",$forcaArquivo=false){
        //para permitir a inclusao de filtros, o fim do sql e marcado com /*FW*//*FW*/
        //indicando onde deve comecar e terminar uma possivel clausula where
        //Layers adicionados aqui sao marcados com o metadata METAESTAT "SIM"
        //O codigo_tipo_regiao e marcado com o metadata METAESTAT_CODIGO_TIPO_REGIAO
        if($forcaArquivo == false){
            $arq = $this->dir_tmp."/".$this->nomecache.".map";
        }
        else{
            $arq = $this->dir_tmp."/".$this->nomecache . $this->nomeRandomico(3) . ".map";
        }

        if(!file_exists($arq)){

            $tipolayer = "polygon";
            //define o tipo correto de layer
            $dg = $this->listaDadosGeometriaRegiao($codigo_tipo_regiao);

            if(empty($tipolayer)){
                $tipolayer = "polygon";
            }
            if($dg["dimension"] == 0){
                $tipolayer = "point";
            }
            if($dg["dimension"] == 1){
                $tipolayer = "line";
            }

            $meta = $this->listaTipoRegiao($codigo_tipo_regiao);
            $titulolayer = $meta["nome_tipo_regiao"];
            $titulolayer = mb_convert_encoding($titulolayer,"ISO-8859-1",mb_detect_encoding($titulolayer));
            //$conexao = $this->listaConexao($meta["codigo_estat_conexao"],true);
            $conexao = $this->listaConexaoMetaestat();
            $conexao = "user=".$conexao["usuario"]." password=".$conexao["senha"]." dbname=".$conexao["bancodedados"]." host=".$conexao["host"]." port=".$conexao["porta"]."";
            $colunageo = $meta["colunageo"];
            $srid = $meta["srid"];
            //pega as colunas menos as do tipo geometry
            $colunastabela = $this->colunasTabela($meta["codigo_estat_conexao"],$meta["esquemadb"],$meta["tabela"],"geometry","!=");
            //define as colunas que serao mostradas no sql
            $vis = $meta["colunasvisiveis"];
            $colunaSerial = $this->listaTipoRegiaoSerial($codigo_tipo_regiao);
            if($vis != ""){
                $vis = str_replace(";",",",$vis);
                $vis = str_replace(",,",",",$vis);
                $vis = explode(",",$vis);
                $itens = $vis;//array
                $vis[] = $meta["identificador"];
                if(!empty($colunaSerial)){
                    $vis[] = $colunaSerial;
                }
                $vis = array_unique($vis);
                $visiveis = array();
                //verifica se as colunas existem mesmo
                foreach($vis as $v){
                    if(in_array($v,$colunastabela)){
                        $visiveis[] = $v;
                    }
                }
                $vis = implode(",",$visiveis);
                //apelidos
                $apelidos = $meta["apelidos"];
                if($apelidos == ""){
                    $apelidos = "Nome";
                }
                $apelidos = str_replace(";",",",$apelidos);
                $apelidos = str_replace(",,",",",$apelidos);
                $apelidos = mb_convert_encoding($apelidos,"ISO-8859-1",mb_detect_encoding($apelidos));
                $apelidos = explode(",",$apelidos);
                if(!empty($colunaSerial)){
                    $apelidos[] = $colunaSerial." (serial)";
                }
                $apelidos = array_unique($apelidos);
            }
            else{
                $itens = array();
                $apelidos = array();
                if(!empty($colunaSerial)){
                    $colunastabela[] = $colunaSerial;
                    $colunastabela = array_unique($colunastabela);
                }
                $vis = implode(",",$colunastabela);
            }
            $sqlf = $colunageo." from (select st_setsrid(".$colunageo.",".$srid.") as $colunageo,$vis from ".$meta["esquemadb"].".".$meta["tabela"]." /*FW*//*FW*/) as foo using unique ".$meta["identificador"]." using srid=".$srid;
            $sqlf = str_replace(",,",",",$sqlf);
            $outlinecolor = str_replace(","," ",$outlinecolor);
            $dados[] = "MAP";
            $dados[] = 'SYMBOLSET "'.$this->locaplic.'/symbols/simbolosv6.sym"';
            $dados[] = 'FONTSET   "'.$this->locaplic.'/symbols/fontes.txt"';
            $dados[] = "LAYER";
            $dados[] = '	NAME "'.$this->nomecache.'"';
            $dados[] = "	TYPE $tipolayer";
            $dados[] = '	DATA "'.$sqlf.'"';
            $dados[] = '	CONNECTION "metaestat"';
            $dados[] = '	CONNECTIONTYPE POSTGIS';
            $dados[] = '	TEMPLATE "none.htm"';
            $dados[] = '	STATUS OFF';
            $dados[] = '	METADATA';
            $dados[] = '		TEMA "'.$titulolayer.'"';
            $dados[] = '		CLASSE "SIM"';
            $dados[] = '		METAESTAT "SIM"';
            $dados[] = '		METAESTAT_CODIGO_TIPO_REGIAO "'.$codigo_tipo_regiao.'"';
            if(!empty($colunaSerial)){
                $dados[] = '		EDITAVEL "SIM"';
                $dados[] = '		COLUNAIDUNICO "'.$colunaSerial.'"';
                $dados[] = '		TABELAEDITAVEL "'.$meta["tabela"].'"';
                $dados[] = '		ESQUEMATABELAEDITAVEL "'.$meta["esquemadb"].'"';
                $dados[] = '		COLUNAGEOMETRIA "'.$colunageo.'"';
            }
            $dados[] = '		TIP "'.$meta["colunanomeregiao"].'"';
            if(count($itens) == count($apelidos)){
                $dados[] = '		ITENS "'.implode(",",$itens).'"';
                $dados[] = '		ITENSDESC "'.implode(",",$apelidos).'"';
            }

            $dados[] = '	END';
            $dados[] = '    CLASS';
            $dados[] = '        NAME ""';
            $dados[] = '        STYLE';
            $dados[] = '        	OUTLINECOLOR '.$outlinecolor;

            $dados[] = '        	WIDTH '.$width;
            if(strtolower($tipolayer) == "point"){
                $dados[] = '        SYMBOL "ponto"';
                $dados[] = '        SIZE 5';
                $dados[] = '        COLOR 0 0 0 ';
            }
            else{
                $dados[] = '        	COLOR -1 -1 -1';
            }
            $dados[] = '        END';
            //$dados[] = '        STYLE';
            //$dados[] = '        	OUTLINECOLOR -1 -1 -1';
            //$dados[] = '        	COLOR 255 255 255';
            //$dados[] = '        	OPACITY 20';
            //$dados[] = '        END';
            $dados[] = '    END';
            $dados[] = "END";
            //toponimia
            if($nomes == "sim"){
                $dados[] = "LAYER";
                $dados[] = '	NAME "'.$this->nomecache.'_anno"';
                $dados[] = "	TYPE ANNOTATION";
                $dados[] = '	DATA "'.$sqlf.'"';
                $dados[] = '	CONNECTION "metaestat"';
                $dados[] = '	CONNECTIONTYPE POSTGIS';
                $dados[] = '	TEMPLATE "none.htm"';
                $dados[] = '	STATUS OFF';
                $dados[] = '    LABELITEM "'.$meta["colunanomeregiao"].'"';
                $dados[] = '	METADATA';
                $dados[] = '		TEMA "'.$titulolayer.' (nomes)"';
                $dados[] = '		CLASSE "SIM"';
                $dados[] = '		METAESTAT "SIM"';
                $dados[] = '		METAESTAT_CODIGO_TIPO_REGIAO "'.$codigo_tipo_regiao.'"';
                $dados[] = '	END';
                $dados[] = '    CLASS';
                $dados[] = '        NAME ""';
                $dados[] = '        LABEL';
                $dados[] = '           FONT "arial"';
                $dados[] = '           SIZE 10';
                $dados[] = '           COLOR 0 0 0';
                $dados[] = '           MINDISTANCE 0';
                $dados[] = '           MINFEATURESIZE 0';
                $dados[] = '           OFFSET 0 0';
                $dados[] = '           OUTLINECOLOR 255 255 255';
                $dados[] = '           PARTIALS FALSE';
                $dados[] = '           POSITION AUTO';
                $dados[] = '           SHADOWSIZE 1 1';
                $dados[] = '           TYPE TRUETYPE';
                $dados[] = '        END';
                $dados[] = '    END';
                $dados[] = "END";
            }
            $dados[] = "END";
            $fp = fopen($arq,"w");
            foreach ($dados as $dado){
                fwrite($fp,$dado."\n");
            }
        }
        return array("mapfile"=>$arq,"layer"=>$this->nomecache,"titulolayer"=>$titulolayer,"codigo_tipo_regiao"=>$codigo_tipo_regiao);
    }
    /**
     * Complementa um mapfile resumido inserindo seus layers em um mapfile completo, contendo todos os elementos necessarios para uso
     * Usado na geracao de WMS e outros servicos
     * @param mapfile resumido
     * @return string
     */
    function mapfileCompleto($mapfile){
        $f = $this->base;
        if($f == ""){
            include_once($this->locaplic."/classesphp/funcoes_gerais.php");
            $versao = versao();
            $versao = $versao["principal"];
            $f = "";
            if (strtoupper(substr(PHP_OS, 0, 3) == 'WIN')){
                $f = $this->locaplic."/aplicmap/geral1windowsv".$versao.".map";
            }
            else{
                if($f == "" && file_exists('/var/www/i3geo/aplicmap/geral1debianv'.$versao.'.map')){
                    $f = "/var/www/i3geo/aplicmap/geral1debianv".$versao.".map";
                }
                if($f == "" && file_exists('/var/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
                    $f = "/var/www/html/i3geo/aplicmap/geral1fedorav".$versao.".map";
                }
                if($f == "" && file_exists('/opt/www/html/i3geo/aplicmap/geral1fedorav'.$versao.'.map')){
                    $f = "/opt/www/html/i3geo/aplicmap/geral1v".$versao.".map";
                }
                if($f == "")				{
                    $f = $this->locaplic."/aplicmap/geral1v".$versao.".map";
                }
            }
        }
        $mapa = ms_newMapObj($f);
        $n = $mapa->numlayers;
        for($i=0;$i<$n;$i++){
            $l = $mapa->getlayer($i);
            $l->set("status",MS_DELETE);
        }
        $mapatemp = ms_newMapObj($mapfile);
        $l = $mapatemp->getlayer(0);

        $l->set("status",MS_DEFAULT);
        $novonome = str_replace(".map","completo.map",$mapfile);
        //necessario para o kml
        $mapa->setmetadata("ows_enable_request","*");
        $listaepsg = "EPSG:4618 EPSG:4291 EPSG:4326 EPSG:22521 EPSG:22522 EPSG:22523 EPSG:22524 EPSG:22525 EPSG:29101 EPSG:29119 EPSG:29120 EPSG:29121 EPSG:29122 EPSG:29177 EPSG:29178 EPSG:29179 EPSG:29180 EPSG:29181 EPSG:29182 EPSG:29183 EPSG:29184 EPSG:29185";
        $l->setmetadata("ows_srs",$listaepsg);
        $temp = ms_newLayerObj($mapa,$l);
        $mapa->save($novonome);
        return $novonome;
    }
    /**
     * Obtem os dados de uma medida de variavel
     * @param id da medida
     * @param filtro que sera concatenado ao sql
     * @param 0|1 mostra ou nao todas as colunas da tabela com os dados
     * @param coluna de agrupamento
     * @param limite do numero de registros
     * @param le os dados diretamente da tabela sem nenhum tipo de agrupamento, seja por data ou outro parametro
     * @return string
     */
    function dadosMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$agruparpor = "",$limite="",$direto=false){
        set_time_limit(0);
        $sql = $this->sqlMedidaVariavel($id_medida_variavel,$todasascolunas,$agruparpor,"polygon","",false,$filtro,$direto);
        $sqlf = $sql["sqlmapserver"];
        //remove marcadores geo
        $sqlf = explode("/*SE*/",$sqlf);
        $sqlf = explode("/*SG*/",$sqlf[1]);
        $sqlf = $sqlf[0]." ".$sqlf[2];
        if($limite != ""){
            $sqlf .= " limit ".$limite;
        }
        $sqlf = str_replace(",  FROM"," FROM",$sqlf);
        //echo $sqlf;exit;
        $metaVariavel = $this->listaMedidaVariavel("",$id_medida_variavel);
        if(!empty($metaVariavel["codigo_estat_conexao"])){
            //$c = $this->listaConexao($metaVariavel["codigo_estat_conexao"],true);
            $c = $this->listaConexaoMetaestat();
            $dbhold = $this->dbh;
            $dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
            $this->dbh = $dbh;
            $res = $this->execSQL($sqlf);
            $this->dbh = $dbhold;
            return $res;
        }
        return false;
    }
    /**
     * Lista as ocorrencias de valores em uma coluna de uma medida de variavel
     * @param id da medida de variavel
     * @param coluna
     * @return array
     */
    function valorUnicoMedidaVariavel($id_medida_variavel,$coluna,$filtro=""){
        $sqlf = $this->sqlMedidaVariavel($id_medida_variavel,0,$coluna,"polygon","",false,$filtro);
        $sqlf = $sqlf["sqlagrupamento"];
        $metaVariavel = $this->listaTabelaMedidaVariavel($id_medida_variavel);
        if(!empty($metaVariavel["codigo_estat_conexao"])){
            //$c = $this->listaConexao($metaVariavel["codigo_estat_conexao"],true);
            $c = $this->listaConexaoMetaestat();
            $dbhold = $this->dbh;
            $dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
            $this->dbh = $dbh;
            $res = $this->execSQL($sqlf);
            $this->dbh = $dbhold;
            return $res;
        }
        return false;
    }
    /**
     * Sumario estatistico de uma medida de variavel
     * @param id da medida
     * @param filtro a ser concatenado ao sql
     * @param coluna de agrupamento
     * @param limite numero maximo de registros que serao lidos do banco
     * @param le os dados diretamente da tabela sem nenhum tipo de agrupamento, seja por data ou outro parametro
     * @return array("colunavalor"=>,"soma"=>,"media"=>,"menor"=>,"maior"=>,"quantidade"=>,"histograma"=>,"grupos"=>,"unidademedida"=>,"quartis"=>)
     */
    function sumarioMedidaVariavel($id_medida_variavel,$filtro="",$agruparpor="",$limite="",$direto=false){
        if(!empty($agruparpor)){
            $dados = $this->dadosMedidaVariavel($id_medida_variavel,$filtro,1,"",$limite,$direto);
        }
        else{
            $dados = $this->dadosMedidaVariavel($id_medida_variavel,$filtro,0,"",$limite,$direto);
        }
        if($dados){
            $metaVariavel = $this->listaMedidaVariavel("",$id_medida_variavel);
            $un = $this->listaUnidadeMedida($metaVariavel["codigo_unidade_medida"]);
            $agrupamento = "";
            $colunavalor = $metaVariavel["colunavalor"];
            foreach($dados as $d){
                if($d[$colunavalor]){
                    $valores[] = $d[$colunavalor];
                }
            }
            if(!empty($agruparpor)){
                $agrupamento = array();
                foreach($dados as $d){
                    $g = $d[$agruparpor];
                    //var_dump($d);exit;
                    if(!empty($agrupamento[$g])){
                        $agrupamento[$g] += $d[$colunavalor];
                    }
                    else{
                        $agrupamento[$g] = $d[$colunavalor];
                    }
                }
                natsort($agrupamento);
            }
            $soma = "";
            $media = "";
            $min = "";
            $max = "";
            $quantidade = count($valores);
            $sturges = 1 + (3.322 * (log10($quantidade)));
            $quartis = array();
            if($un["permitesoma"] == "1"){
                $soma = array_sum($valores);
            }
            if($un["permitemedia"] == "1"){
                $media = $soma / $quantidade;
            }
            if($un["permitesoma"] == "1" || $un["permitemedia"] == "1"){
                sort($valores);
                //var_dump($valores);exit;
                $min = $valores[0];
                $max = $valores[$quantidade - 1];
                include_once(dirname(__FILE__)."/classesphp/classe_estatistica.php");
                $calc = new estatistica();
                $calc->calcula($valores);
                $v = $calc->resultado;
                //expressao para o mapfile
                $expressao[] = "([".$colunavalor."]<=".($v["quartil1"]).")";
                $expressao[] = "(([".$colunavalor."]>".($v["quartil1"]).")and([".$colunavalor."]<=".($v["quartil2"])."))";
                if($v["quartil3"] != 0){
                    $expressao[] = "(([".$colunavalor."]>".($v["quartil2"]).")and([".$colunavalor."]<=".($v["quartil3"])."))";
                    $expressao[] = "([".$colunavalor."]>".($v["quartil3"]).")";
                }
                $nomes[] = "<= ".($v["quartil1"]);
                $nomes[] = "> ".($v["quartil1"])." e <= ".($v["quartil2"]);
                if($v["quartil3"] != 0){
                    $nomes[] = "> ".($v["quartil2"])." e <= ".($v["quartil3"]);
                    $nomes[] = "> ".($v["quartil3"]);
                }
                $quartis = array(
                    "cortes"=>array(
                        "q1"=>$v['quartil1'],
                        "q2"=>$v['quartil2'],
                        "q3"=>$v['quartil3']
                    ),
                    "expressoes"=>$expressao,
                    "nomes"=>$nomes
                );
            }
            $histograma = array_count_values($valores);
            //echo "<pre>".var_dump($quartis);exit;
            return array(
                "colunavalor"=>$colunavalor,
                "soma"=>$soma,
                "media"=>$media,
                "menor"=>$min,
                "maior"=>$max,
                "quantidade"=>$quantidade,
                "histograma"=>$histograma,
                "grupos"=>$agrupamento,
                "unidademedida"=>$un,
                "quartis"=>$quartis,
                "sturges"=>$sturges
            );
        }
        return false;
    }


    /**
     * Lista os dados de um ou de todos os mapas cadastrados
     * @param id do mapa
     */
    function listaMapas($id_mapa=""){
        $sql = "select * from ".$this->esquemaadmin."i3geoestat_mapa ";
        if($id_mapa != ""){
            $sql .= "WHERE id_mapa = $id_mapa ";
        }
        $sql .= "ORDER BY titulo";
        return $this->execSQL($sql,$id_mapa);
    }
    /**
     * Lista os dados de um ou de todos os mapas grupos de um mapa
     * @param id do mapa
     * @param id do grupo
     */
    function listaGruposMapa($id_mapa,$id_mapa_grupo){
        if(!empty($id_mapa)){
            $sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_mapa_grupo WHERE id_mapa = $id_mapa";
        }
        if(!empty($id_mapa_grupo)){
            $sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_mapa_grupo WHERE id_mapa_grupo = $id_mapa_grupo";
        }
        $sql .= " ORDER BY titulo";
        return $this->execSQL($sql,$id_mapa_grupo);
    }
    /**
     * Lista os dados de um ou de todos os temas de um grupo de um mapa
     * @param id do mapa
     * @param id do grupo
     * @param id do tema
     */
    function listaTemasMapa($id_mapa_grupo,$id_mapa_tema){
        if(!empty($id_mapa_grupo)){
            $sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_mapa_tema WHERE id_mapa_grupo = $id_mapa_grupo";
        }
        if(!empty($id_mapa_tema)){
            $sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_mapa_tema WHERE id_mapa_tema = $id_mapa_tema";
        }
        $sql .= " ORDER BY titulo";
        return $this->execSQL($sql,$id_mapa_tema);
    }
    /**
     * Lista os dados de uma ou todas as unidades de medida cadastradas
     * @param codigo da unidade
     */
    function listaUnidadeMedida($codigo_unidade_medida=""){
        $sql = "select * from ".$this->esquemaadmin."i3geoestat_unidade_medida ";
        if($codigo_unidade_medida != ""){
            $sql .= "WHERE codigo_unidade_medida = $codigo_unidade_medida ";
        }
        $sql .= "ORDER BY nome";
        return $this->execSQL($sql,$codigo_unidade_medida);
    }
    /**
     * Lista os dados de uma ou todas as fontes cadastradas
     * @param id da fonte
     */
    function listaFonteinfo($id_fonteinfo=""){
        $sql = "select * from ".$this->esquemaadmin."i3geoestat_fonteinfo ";
        if($id_fonteinfo != ""){
            $sql .= "WHERE id_fonteinfo = $id_fonteinfo ";
        }
        $sql .= "ORDER BY titulo";
        return $this->execSQL($sql,$id_fonteinfo);
    }
    /**
     * Lista as fontes vinculadas a uma medida de variavel
     * @param id da medida de variavel
     */
    function listaFonteinfoMedida($id_medida_variavel){
        $sql = "SELECT i3geoestat_fonteinfo.* ";
        $sql .= "FROM ".$this->esquemaadmin."i3geoestat_fonteinfo ";
        $sql .= "INNER JOIN ".$this->esquemaadmin."i3geoestat_fonteinfo_medida ";
        $sql .= "ON i3geoestat_fonteinfo.id_fonteinfo = i3geoestat_fonteinfo_medida.id_fonteinfo ";
        $sql .= "WHERE i3geoestat_fonteinfo_medida.id_medida_variavel = $id_medida_variavel ";
        $sql .= "ORDER BY titulo";
        //echo $sql;exit;
        return $this->execSQL($sql,$id_fonteinfo);
    }
    /**
     * Lista os dados de uma ou todas as variaveis cadastradas
     * @param codigo da variavel
     * @param mostra apenas as variaveis cujas tabelas ficam nesse esquema
     */
    function listaVariavel($codigo_variavel="",$filtro_esquema=""){
        $sql = "select DISTINCT a.* from ".$this->esquemaadmin."i3geoestat_variavel as a ";
        if($codigo_variavel != ""){
            $sql .= "WHERE a.codigo_variavel = " . $codigo_variavel;
        }
        if($filtro_esquema != ""){
            $sql .= ", ".$this->esquemaadmin."i3geoestat_medida_variavel as b WHERE a.codigo_variavel = b.codigo_variavel and b.esquemadb = '$filtro_esquema' ";
        }
        $sql .= "ORDER BY a.nome";
        //echo $sql;exit;
        return $this->execSQL($sql,$codigo_variavel);
    }
    /**
     * Lista os dados de uma ou todas as classificacoes de uma medida de variavel
     * @param id da medida de variavel
     * @param id da classificacao
     */
    function listaClassificacaoMedida($id_medida_variavel,$id_classificacao=""){
        if(!empty($id_medida_variavel)){
            $sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_classificacao WHERE id_medida_variavel = $id_medida_variavel";
        }
        if(!empty($id_classificacao)){
            $sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_classificacao WHERE id_classificacao = $id_classificacao";
        }
        return $this->execSQL($sql,$id_classificacao);
    }
    /**
     * Lista os dados de um ou todos os links de uma medida
     * @param id da medida
     * @param id do link
     */
    function listaLinkMedida($id_medida_variavel,$id_link=""){
        if(!empty($id_medida_variavel)){
            $sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_medida_variavel_link WHERE id_medida_variavel = $id_medida_variavel";
        }
        if(!empty($id_link)){
            $sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_medida_variavel_link WHERE id_link = $id_link";
        }
        return $this->execSQL($sql,$id_link);
    }
    /**
     * Lista os dados de uma ou todas as classes de uma classificacao
     * @param id da classificacao
     * @param id da classe
     */
    function listaClasseClassificacao($id_classificacao,$id_classe=""){
        if(!empty($id_classificacao)){
            $sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_classes WHERE id_classificacao = $id_classificacao";
        }
        if(!empty($id_classe)){
            $sql = "SELECT * from ".$this->esquemaadmin."i3geoestat_classes WHERE id_classe = $id_classe";
        }
        return $this->execSQL($sql,$id_classe);
    }
    /**
     * Lista os dados de uma ou todas as medidas de variavel de uma variavel
     * @param codigo da variavel
     * @param id da medida de variavel
     */
    function listaMedidaVariavel($codigo_variavel="",$id_medida_variavel=""){
        $sql = "SELECT i3geoestat_medida_variavel.*,i3geoestat_variavel.nome as nome_variavel,i3geoestat_unidade_medida.permitemedia,i3geoestat_unidade_medida.permitesoma,i3geoestat_unidade_medida.nome as unidade_medida ";
        $sql .= "FROM ".$this->esquemaadmin."i3geoestat_variavel ";
        $sql .= "JOIN ".$this->esquemaadmin."i3geoestat_medida_variavel ";
        $sql .= "ON i3geoestat_variavel.codigo_variavel = i3geoestat_medida_variavel.codigo_variavel ";
        $sql .= "LEFT JOIN ".$this->esquemaadmin."i3geoestat_unidade_medida ";
        $sql .= "ON i3geoestat_unidade_medida.codigo_unidade_medida = i3geoestat_medida_variavel.codigo_unidade_medida ";
        if($codigo_variavel != ""){
            $sql .= "WHERE i3geoestat_variavel.codigo_variavel = $codigo_variavel ";
            if($id_medida_variavel != ""){
                $sql .= "AND i3geoestat_medida_variavel.id_medida_variavel = $id_medida_variavel ";
            }
        }
        elseif($id_medida_variavel != "") {
            $sql .= "WHERE i3geoestat_medida_variavel.id_medida_variavel = $id_medida_variavel ";
        }
        $sql .= "ORDER BY i3geoestat_medida_variavel.nomemedida";
        $res = $this->execSQL($sql,$id_medida_variavel);
        $res = str_replace('"',"'",$res);
        return $res;
    }
    function listaTabelaMedidaVariavel($id_medida_variavel=""){
        $sql = "SELECT * ";
        $sql .= "FROM ".$this->esquemaadmin."i3geoestat_medida_variavel ";
        if($id_medida_variavel != "") {
            $sql .= " WHERE id_medida_variavel = $id_medida_variavel ";
        }
        $res = $this->execSQL($sql,$id_medida_variavel);
        $res = str_replace('"',"'",$res);
        return $res;
    }
    /**
     * Lista as regioes vinculadas a uma medida de variavel
     * @param id da medida de vriavel
     */
    function listaRegioesMedida($id_medida_variavel){
        $variavel = $this->listaMedidaVariavel("",$id_medida_variavel);
        $codigo_tipo_regiao = $variavel["codigo_tipo_regiao"];
        $regioes[] = $this->listaTipoRegiao($codigo_tipo_regiao);
        //var_dump($regioes);exit;
        $agregacoes = $this->listaAgregaRegiao($codigo_tipo_regiao);
        foreach($agregacoes as $a){
            $regioes[] = $this->listaTipoRegiao($a["codigo_tipo_regiao_pai"]);
        }
        return $regioes;
    }
    function listaConexaoMetaestat(){
        if(!isset($_SESSION["postgis_mapa"])){
            include(dirname(__FILE__)."/../ms_configura.php");
        } else {
            $postgis_mapa = $_SESSION["postgis_mapa"];
        }
        if(isset($postgis_mapa["metaestat"])){
            $m = $postgis_mapa["metaestat"];
            if($m == ""){
                return false;
            }
            $lista = explode(" ",$m);
            $con = array();
            foreach($lista as $l){
                $teste = explode("=",$l);
                $con[trim($teste[0])] = trim($teste[1]);
            }
            $c = array(
                "codigo_estat_conexao" => "metaestat",
                "bancodedados" => $con["dbname"],
                "host" => $con["host"],
                "porta" => $con["port"],
                "usuario" => $con["user"],
                "senha" => $con["password"],
                "options" => $con["options"],
                "fonte" => "ms_configura"
            );
            return $c;
        } else {
            return false;
        }
    }
    /**
     * Lista os dados de uma conexao ou de todas
     * @param id da conexao
     * @param boolean inclui na lista a senha ou nao
     * @param boolean inclui as conexoes definidas em postgis_mapa (ms_configura.php)
     */
    function listaConexao($codigo_estat_conexao="",$senha=false,$incluiPostgisMapa=true){
        if($senha == true){
            $colunas = "codigo_estat_conexao, bancodedados, host, porta, usuario, senha";
        }
        else{
            $colunas = "codigo_estat_conexao, bancodedados, host, porta, usuario";
        }
        $sql = "select $colunas from ".$this->esquemaadmin."i3geoestat_conexao ";
        if($codigo_estat_conexao != ""){
            $sql .= "WHERE codigo_estat_conexao = $codigo_estat_conexao ";
        }
        $sql .= "ORDER BY bancodedados,host,usuario";
        $res = $this->execSQL($sql,$codigo_estat_conexao);
        //se achou e a requisico e para listar uma conexao, retorna o que for encontrado
        $cres = count($res);
        if($cres > 0 && $codigo_estat_conexao != "" && !empty($cres[0]["dbname"])){
            return $res;
        }
        //caso contrario, e deve retornar todas as conexoes, inclui a fonte
        if($codigo_estat_conexao == ""){
            for($i=0; $i<$cres;$i++){
                $res[$i]["fonte"] = "metaestat";
            }
        }
        //obtem as conexoes definidas em ms_configgura.php
        if($incluiPostgisMapa == true){
            if(!isset($postgis_mapa)){
                include(dirname(__FILE__)."/../ms_configura.php");
            }
            if(!empty($postgis_mapa)){
                foreach(array_keys($postgis_mapa) as $key){
                    $lista = explode(" ",$postgis_mapa[$key]);
                    $con = array();
                    foreach($lista as $l){
                        $teste = explode("=",$l);
                        $con[trim($teste[0])] = trim($teste[1]);
                    }
                    $c = array(
                        "codigo_estat_conexao" => $key,
                        "bancodedados" => $con["dbname"],
                        "host" => $con["host"],
                        "porta" => $con["port"],
                        "usuario" => $con["user"],
                        "fonte" => "ms_configura"
                    );
                    if($senha == true){
                        $c["senha"] = $con["password"];
                    }
                    $res[] = $c;
                    if($codigo_estat_conexao != "" && $codigo_estat_conexao == $key){
                        return $c;
                    }
                }
            }
        }
        //echo "<pre>";
        //var_dump($res);exit;
        return $res;
    }
    function listaParametroTempo2CampoData($id_medida_variavel,$prefixoAlias = ""){
        //lista os parametros temporais
        $parametros = $this->listaParametro($id_medida_variavel,"","",true,true);
        echo "<pre>";
        //var_dump($parametros);exit;
        //faz o sql para pegar os valores e definir a resolucao
        //o tempo deve comecar sempre pelo ano
        $data = array();
        if($parametros[0]["tipo"] == 1){
            //ano
            $data[] = $prefixoAlias.$parametros[0]["coluna"];
            $tipodata = "YYYY";
            //mes
            if(!empty($parametros[1])){
                $data[] = "'-'".$prefixoAlias.$parametros[1]["coluna"];
                $tipodata = "YYYYMM";
            }
            else{
                $data[] = "'-01'";
            }
            //dia
            if(!empty($parametros[2])){
                $data[] = "'-'".$prefixoAlias.$parametros[2]["coluna"];
                $tipodata = "YYYYMMDD";
            }
            else{
                $data[] = "'-01'";
            }
            $data = implode("||",$data);
            return "to_date($data,'$tipodata')";
        }
    }
    /**
     * Lista os dados de um ou de todos os parametros relacionados a uma medida de variavel
     * @param id da medida de variavel
     * @param id do parametro
     * @param id do pai (se definido, lista apenas os filhos deste)
     * @param bool indica se apenas parametros do tipo temporal serao retornados
     */
    function listaParametro($id_medida_variavel,$id_parametro_medida="",$id_pai="",$apenasTempo=false,$ordenaPeloPai=false){
        $sql = "SELECT i3geoestat_parametro_medida.*,i3geoestat_medida_variavel.* ";
        $sql .= "FROM ".$this->esquemaadmin."i3geoestat_parametro_medida ";
        $sql .= "INNER JOIN ".$this->esquemaadmin."i3geoestat_medida_variavel ";
        $sql .= "ON i3geoestat_parametro_medida.id_medida_variavel = i3geoestat_medida_variavel.id_medida_variavel ";
        if($id_medida_variavel != ""){
            $sql .= "WHERE i3geoestat_parametro_medida.id_medida_variavel = $id_medida_variavel ";
            if($id_parametro_medida != ""){
                $sql .= "AND i3geoestat_parametro_medida.id_parametro_medida = $id_parametro_medida ";
            }
        }
        elseif ($id_parametro_medida != ""){
            $sql .= "WHERE i3geoestat_parametro_medida.id_parametro_medida = $id_parametro_medida ";
        }
        if($id_pai != ""){
            $sql .= " AND id_pai = $id_pai";
        }
        if($apenasTempo == true){
            $tempo = " AND i3geoestat_parametro_medida.tipo > 0 AND i3geoestat_parametro_medida.tipo < 5 ";
            $sql .= $tempo;
        }
        if($ordenaPeloPai == true){
            $sql .= " ORDER BY id_pai";
        }
        //echo $sql;exit;
        return $this->execSQL($sql,$id_parametro_medida);
    }
    /**
     * Lista todos os parametros cadastrados
     */
    function listaTodosParametros(){
        $sql = "SELECT i3geoestat_parametro_medida.*,i3geoestat_medida_variavel.* ";
        $sql .= "FROM ".$this->esquemaadmin."i3geoestat_parametro_medida ";
        $sql .= "INNER JOIN ".$this->esquemaadmin."i3geoestat_medida_variavel ";
        $sql .= "ON i3geoestat_parametro_medida.id_medida_variavel = i3geoestat_medida_variavel.id_medida_variavel ";
        $sql .= " ORDER BY nome";
        return $this->execSQL($sql);
    }
    /**
     * Lista os valores (unicos) que ocorrem em um parametro de uma medida de variavel
     * @param id do parametro
     * @return array com os valores
     */
    function listaValoresParametro($id_parametro_medida){
        $parametro = $this->listaParametro("",$id_parametro_medida);
        //$medida = $this->listaMedidaVariavel("",$parametro["id_medida_variavel"]);
        $sm = $this->valorUnicoMedidaVariavel($parametro["id_medida_variavel"],$parametro["coluna"]);
        $nsm = array();
        foreach($sm as $s){
            $nsm[] = $s[$parametro["coluna"]];
        }
        return $nsm;
    }
    /**
     * Lista os dados de um ou todos os tipos de periodo cadastrados
     * @param id
     */
    function listaTipoPeriodo($codigo_tipo_periodo=""){
        $sql = "select * from ".$this->esquemaadmin."i3geoestat_tipo_periodo ";
        if($codigo_tipo_periodo != ""){
            $sql .= "WHERE codigo_tipo_periodo = $codigo_tipo_periodo ";
        }
        $sql .= "ORDER BY nome";
        return $this->execSQL($sql,$codigo_tipo_periodo);
    }
    /**
     * Lista as propriedades da coluna com as geometrias de uma regiao geografica
     * @param codigo do tipo de regiao
     * @return array com os parametros, inclusive a dimensao (st_dimension)
     */
    function listaPropGeoRegiao($codigo_tipo_regiao){
        //st_dimension returns 0 for POINT, 1 for LINESTRING, 2 for POLYGON
        $regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
        //$c = $this->listaConexao($regiao["codigo_estat_conexao"],true);
        $c = $this->listaConexaoMetaestat();
        $dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
        $c = $regiao["colunageo"];
        $sql = "select st_dimension(".$regiao["colunageo"].") as st_dimension from ".$regiao["esquemadb"].".".$regiao["tabela"]." limit 1";
        $q = $dbh->query($sql,PDO::FETCH_ASSOC);
        $r = array();
        if($q){
            $r = $q->fetchAll();
            $r = $r[0];
        }
        return $r;
    }
    /**
     * Lista os dados de uma ou todas as regioes cadastradas
     * @param codigo do tipo de regiao
     */
    function listaTipoRegiao($codigo_tipo_regiao="",$completo=true){
        if($completo == true){
            $colunas = "*";
        } else {
            $colunas = "codigo_tipo_regiao,nome_tipo_regiao,descricao_tipo_regiao";
        }
        $sql = "select $colunas from ".$this->esquemaadmin."i3geoestat_tipo_regiao ";
        if($codigo_tipo_regiao != ""){
            $sql .= "WHERE codigo_tipo_regiao = $codigo_tipo_regiao ";
        }
        $sql .= "ORDER BY nome_tipo_regiao";
        return $this->execSQL($sql,$codigo_tipo_regiao);
    }
    /**
     * Obtem de um tipo de regiao a coluna do tipo serial
     * @param codigo do tipo de regiao
     */
    function listaTipoRegiaoSerial($codigo_tipo_regiao){
        $sql = "select * from ".$this->esquemaadmin."i3geoestat_tipo_regiao WHERE codigo_tipo_regiao = $codigo_tipo_regiao ";
        $regiao = $this->execSQL($sql,$codigo_tipo_regiao);
        $nome_esquema = $regiao["esquemadb"];
        $nome_tabela = $regiao["tabela"];
        $sql = "SELECT a.attname as coluna FROM pg_class s JOIN pg_depend d ON d.objid = s.oid JOIN pg_class t ON d.objid = s.oid AND d.refobjid = t.oid JOIN pg_attribute a ON (d.refobjid, d.refobjsubid) = (a.attrelid, a.attnum) JOIN pg_namespace n ON n.oid = s.relnamespace WHERE s.relkind = 'S' AND n.nspname = '$nome_esquema' AND t.relname = '$nome_tabela'";
        $colunas = $this->execSQLDB($regiao["codigo_estat_conexao"],$sql);
        $colunas = $colunas[0];
        return $colunas["coluna"];
    }
    /**
     * Obtem de uma tabela a coluna do tipo serial
     * @param codigo do tipo de regiao
     */
    function listaTabelaSerial($codigo_estat_conexao,$nome_esquema,$nome_tabela){
        $sql = "SELECT a.attname as coluna FROM pg_class s JOIN pg_depend d ON d.objid = s.oid JOIN pg_class t ON d.objid = s.oid AND d.refobjid = t.oid JOIN pg_attribute a ON (d.refobjid, d.refobjsubid) = (a.attrelid, a.attnum) JOIN pg_namespace n ON n.oid = s.relnamespace WHERE s.relkind = 'S' AND n.nspname = '$nome_esquema' AND t.relname = '$nome_tabela'";
        $colunas = $this->execSQLDB($codigo_estat_conexao,$sql);
        $colunas = $colunas[0];
        return $colunas["coluna"];
    }
    /**
     * Lista os dados de agregacao de uma regiao pai
     * @param codigo da regiao
     */
    function listaHierarquiaRegioes($codigoregiaopai=""){
        $sql = "select i3geoestat_agregaregiao.id_agregaregiao,i3geoestat_agregaregiao.colunaligacao_regiaopai,i3geoestat_tipo_regiao.codigo_tipo_regiao,i3geoestat_tipo_regiao.nome_tipo_regiao from ".$this->esquemaadmin."i3geoestat_tipo_regiao ";
        $sql .= "LEFT JOIN ".$this->esquemaadmin."i3geoestat_agregaregiao ";
        $sql .= "ON i3geoestat_tipo_regiao.codigo_tipo_regiao = i3geoestat_agregaregiao.codigo_tipo_regiao ";
        if($codigoregiaopai != ""){
            $sql .= " WHERE ".$this->esquemaadmin."i3geoestat_agregaregiao.codigo_tipo_regiao_pai = $codigoregiaopai";
        }
        else{
            $sql .= "WHERE ".$this->esquemaadmin."i3geoestat_agregaregiao.codigo_tipo_regiao IS NULL";
        }
        return $this->execSQL($sql,"");
    }
    function listaHierarquia($codigoregiaopai=""){
        $sql = "select * from ".$this->esquemaadmin."i3geoestat_agregaregiao order by codigo_tipo_regiao";
        return $this->execSQL($sql,"");
    }
    /**
     * Lista os registros de um tipo de regiao
     * Se for definido o pai, lista os valores da regiao que e filha
     * Nesse caso e necessario definir o identificador da regiao pai para obter os registros na regiao filha
     * @param codigo do tipo de regiao
     * @param codigo do tipo de regiao pai
     * @param identificador da regiao (registro) pai
     */
    function listaDadosRegiao($codigo_tipo_regiao,$codigo_tipo_regiaopai="",$valorregiaopai=""){
        //pega a tabela, esquema e conexao para acessar os dados da regiao
        $regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
        //$c = $this->listaConexao($regiao["codigo_estat_conexao"],true);
        $c = $this->listaConexaoMetaestat();
        $dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
        $c = $regiao["colunageo"];
        $bbox = "ST_XMin($c)||' '||ST_YMin($c)||' '||ST_XMax($c)||' '||ST_YMax($c) as ext ";
        $sql = "select $bbox,".$regiao["colunanomeregiao"]." as nome_regiao,".$regiao["identificador"]." as identificador_regiao from ".$regiao["esquemadb"].".".$regiao["tabela"];
        if($valorregiaopai != ""){
            $r = $this->listaAgregaRegiaoFilho($codigo_tipo_regiao,$codigo_tipo_regiaopai);
            $sql .= " WHERE ".$r["colunaligacao_regiaopai"]."::text = '$valorregiaopai'";
        }
        $sql .= " order by ".$regiao["colunanomeregiao"];

        $q = $dbh->query($sql,PDO::FETCH_ASSOC);
        $r = array();
        if($q){
            $r = $q->fetchAll();
        }
        return $r;
    }
    /**
     * Lista os registros de uma tabela que e uma regiao
     * @param codigo do tipo de regiao
     */
    function listaDadosGeometriaRegiao($codigo_tipo_regiao){
        //pega a tabela, esquema e conexao para acessar os dados da regiao
        $regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
        //$c = $this->listaConexao($regiao["codigo_estat_conexao"],true);
        $c = $this->listaConexaoMetaestat();
        $dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
        $c = $regiao["colunageo"];
        $s = "ST_dimension($c) as dimension ";
        $sql = "select $s,".$regiao["colunanomeregiao"]." as nome_regiao,".$regiao["identificador"]." as identificador_regiao from ".$regiao["esquemadb"].".".$regiao["tabela"];
        $sql .= " limit 1";
        $q = $dbh->query($sql,PDO::FETCH_ASSOC);
        $r = array();
        if($q){
            $r = $q->fetchAll();
            return $r[0];
        } else {
            return false;
        }
    }
    /**
     * Lista uma ou todas as agregacoes de regioes existentes para um tipo de regiao
     * @param codigo do tipo de regiao
     * @param id da agregacao
     */
    function listaAgregaRegiao($codigo_tipo_regiao="",$id_agregaregiao=""){
        $sql = "select * from ".$this->esquemaadmin."i3geoestat_agregaregiao ";
        if($id_agregaregiao != ""){
            $sql .= "WHERE id_agregaregiao = $id_agregaregiao ";
        }
        else{
            if($codigo_tipo_regiao != ""){
                $sql .= "WHERE codigo_tipo_regiao = $codigo_tipo_regiao";
            }
        }
        $sql .= " ORDER BY colunaligacao_regiaopai";
        //echo $sql;exit;
        return $this->execSQL($sql,$id_agregaregiao);
    }
    /**
     * Lista uma ou todas as agregacoes de regioes filhas de um tipo de regiao
     * @param codigo do tipo de regiao
     * @param codigo do tipo de regiao que e pai
     */
    function listaAgregaRegiaoFilho($codigo_tipo_regiao,$codigo_tipo_regiao_pai){
        $sql = "select * from ".$this->esquemaadmin."i3geoestat_agregaregiao ";
        $sql .= "WHERE codigo_tipo_regiao_pai = $codigo_tipo_regiao_pai ";
        if($codigo_tipo_regiao != ""){
            $sql .= "AND codigo_tipo_regiao = $codigo_tipo_regiao";
        }
        return $this->execSQL($sql,$codigo_tipo_regiao_pai);
    }
    /**
     * Lista os esquemas em um banco de dados
     * @param codigo da conexao
     * @return array
     */
    function esquemasConexao($codigo_estat_conexao){
        return $this->execSQLDB($codigo_estat_conexao,"SELECT oid,nspname as esquema FROM pg_namespace WHERE nspname NOT LIKE 'pg_%' AND nspname NOT LIKE '%_schema%' group by nspname,oid order by nspname");
    }
    /**
     * Lista as tabelas de um esquema
     * @param codigo da conexao
     * @param nome do esquema
     * @param sim|nao exclui da lista as tabelas que contem geometria
     * @return string
     */
    function tabelasEsquema($codigo_estat_conexao,$nome_esquema,$excluigeom=""){
        $sql = "SELECT table_name as tabela FROM information_schema.tables where table_schema = '$nome_esquema' AND table_schema NOT LIKE 'i3geo%' AND table_schema NOT LIKE 'pg_%' AND table_schema NOT LIKE '%_schema%'";
        if(strtolower($excluigeom) == "sim"){
            $sql = "SELECT c.table_name as tabela FROM information_schema.tables as c left join (SELECT distinct a.table_name FROM information_schema.tables as a left join information_schema.columns as b	on	a.table_name = b.table_name	where a.table_schema = '$nome_esquema' and	udt_name = 'geometry' ) as d on c.table_name = d.table_name where c.table_schema = '$nome_esquema'  AND c.table_schema NOT LIKE 'i3geo%' AND c.table_schema NOT LIKE 'pg_%' AND c.table_schema NOT LIKE '%_schema%' and d.table_name is null";
        }
        return $this->execSQLDB($codigo_estat_conexao,$sql);
    }
    /**
     * Lista as colunas de uma tabela
     * @param codigo da conexao
     * @param nome do esquema
     * @param nome da tabela
     * @param tipo de coluna (opcional)
     * @param tipo de tratamento do parametro tipo, pode ser =|!=
     * @return string
     */
    function colunasTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela,$tipo="",$tipotratamento="="){
        $colunas = array();
        $res = $this->execSQLDB($codigo_estat_conexao,"SELECT column_name as coluna,udt_name, data_type FROM information_schema.columns where table_schema = '$nome_esquema' and table_name = '$nome_tabela'");
        if($tipo != ""){
            $res = $this->execSQLDB($codigo_estat_conexao,"SELECT column_name as coluna,udt_name, data_type FROM information_schema.columns where table_schema = '$nome_esquema' and udt_name $tipotratamento '$tipo' and table_name = '$nome_tabela'");
        }
        foreach($res as $c){
            $colunas[] = $c["coluna"];
        }
        return $colunas;
    }
    /**
     * Lista o comentario de uma tabela
     * @param codigo da conexao
     * @param nome do esquema
     * @param nome da tabela
     * @return string
     */
    function comentarioTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela){
        $colunas = array();
        $sql = "SELECT  pg_catalog.obj_description(c.oid, 'pg_class') AS comments FROM pg_catalog.pg_class c LEFT JOIN pg_catalog.pg_namespace n ON (n.oid = c.relnamespace) WHERE n.nspname = '".$nome_esquema."' AND c.relname = '".$nome_tabela."'";
        $res = $this->execSQLDB($codigo_estat_conexao,$sql);
        if(count($res) > 0){
            $res = $res[0];
            $res = $res["comments"];
        }
        else{
            $res = "";
        }
        if($res == null){
            $res = "";
        }
        return $res;
    }
    /**
     * Lista os metadados de uma coluna
     * Os metadados sao obtidos do proprio PostgreSQL
     * @param codigo da conexao
     * @param nome do esquema
     * @param nome da tabela
     * @param nome da coluna (opcional)
     * @return string
     */
    function descreveColunasTabela($codigo_estat_conexao,$nome_esquema,$nome_tabela,$nome_coluna=""){
        if($nome_coluna == ""){
            return $this->execSQLDB($codigo_estat_conexao,"SELECT a.attnum,a.attname AS field,t.typname AS type,a.attlen AS length,a.atttypmod AS lengthvar,a.attnotnull AS notnull,p.nspname as esquema FROM pg_class c,pg_attribute a,pg_type t,pg_namespace p WHERE c.relname = '$nome_tabela' and p.nspname = '$nome_esquema' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid and c.relnamespace = p.oid ORDER BY a.attname");
        }
        else{
            $res = $this->execSQLDB($codigo_estat_conexao,"SELECT a.attnum,a.attname AS field,t.typname AS type,a.attlen AS length,a.atttypmod AS lengthvar,a.attnotnull AS notnull,p.nspname as esquema FROM pg_class c,pg_attribute a,pg_type t,pg_namespace p WHERE a.attname = '$nome_coluna' AND c.relname = '$nome_tabela' and p.nspname = '$nome_esquema' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid and c.relnamespace = p.oid ORDER BY a.attname");
            return $res[0];
        }
    }
    /**
     * Lista os dados de uma tabela
     * @param codigo da conexao
     * @param nome do esquema
     * @param nome da tabela
     * @param sim|nao inclui o WKT da geometria de colunas geo
     * @param (opcional) numero de registros que serao listados
     * @return array
     */
    function obtemDadosTabelaDB($codigo_estat_conexao,$nome_esquema,$nome_tabela,$geo="nao",$nreg=""){
        $desccolunas = $this->descreveColunasTabela($codigo_estat_conexao, $nome_esquema, $nome_tabela);
        $colunas = array();
        $colsql = array();
        foreach($desccolunas as $d){
            if($d["type"] != "geometry" && $d["type"] != "geography"){
                $colunas[] = $d["field"];
                $colsql[] = $d["field"];
            }
            elseif($geo == "sim"){
                $colunas[] = $d["field"];
                $colsql[] = "ST_AsText(".$d["field"].") as ".$d["field"];
            }
        }
        $sql = "SELECT ".implode(",",$colsql)." from ".$nome_esquema.".".$nome_tabela;
        if($nreg != ""){
            $sql = "SELECT ".implode(",",$colsql)." from ".$nome_esquema.".".$nome_tabela." limit $nreg";
        }
        $dados = $this->execSQLDB($codigo_estat_conexao,$sql );
        $linhas = array();
        foreach($dados as $d){
            $l = array();
            foreach($colunas as $c){
                $l[] = $d[$c];
            }
            $linhas[] = $l;
        }
        return array("nomescolunas"=>$colunas,"colunas"=>$desccolunas,"linhas"=>$linhas);
    }
    /**
     * Relatorio completo com a lista de variaveis e medidas
     * @param codigo da variavel
     * @param sim|nao inclui dados detalhados
     * @return Array
     */
    function relatorioCompleto($codigo_variavel="",$dadosGerenciais="nao"){
        $dados = array();
        if($codigo_variavel != "" || !empty($codigo_variavel)){
            $vs[] = $this->listaVariavel($codigo_variavel);
        }
        else{
            $vs = $this->listaVariavel();
        }

        $lista = $this->listaMedidaVariavel();
        $lista = array_group_by($lista, "codigo_variavel");

        foreach($vs as $v){
            $nivel1["id"] = $v["codigo_variavel"];
            $nivel1["titulo"] = $v["nome"];
            $nivel1["descricao"] = $v["descricao"];
            //$ms = $this->listaMedidaVariavel($v["codigo_variavel"]);

            $ms = $lista[$v["codigo_variavel"]];

            $nivel1["filhos"] = array();
            foreach($ms as $m){
                $nivel2["id"] = $m["id_medida_variavel"];
                $nivel2["titulo"] = $m["nomemedida"];
                //$unidade = $this->listaUnidadeMedida($m["codigo_unidade_medida"]);

                $unidade = $lista[$m["codigo_unidade_medida"]];
                $unidade = "Unidade de medida: ".$unidade["nome"];
                $periodo = $this->listaTipoPeriodo($m["codigo_tipo_periodo"]);
                $periodo = "Per&iacute;odo de tempo: ".$periodo["nome"];
                $regiao = $this->listaTipoRegiao($m["codigo_tipo_regiao"]);
                $regiao = "Regi&atilde;o: ".$regiao["nome_tipo_regiao"];
                $nivel2["descricao"] = $unidade.", ".$periodo.", ".$regiao;
                $nivel2["fontes"] = $this->listaFonteinfoMedida($m["id_medida_variavel"]);
                $nivel2["links"] = $this->listaLinkMedida($m["id_medida_variavel"]);
                $nivel2["dadosgerenciais"] = "";
                if($dadosGerenciais == "sim"){
                    $nivel2["dadosgerenciais"] = $m;
                }
                $nivel1["filhos"][] = $nivel2;
            }
            $dados[] = $nivel1;
        }
        return $dados;
    }
    /**
     * Cria um raltorio formatado em HTML
     * @param dados obtidos com relatorioCompleto
     * @param sim|nao inclui os dados detalhados
     * @return string
     */
    function formataRelatorioHtml($dados,$detalhes="sim"){
        $html[] = "<div class='var_div_relatorio'>";
        $var_cor = "var_cor1";
        foreach($dados as $variavel){
            $html[] = "<div class='".$var_cor."'>";
            $html[] = "<h1 style=padding:3px; ><b>".$variavel["titulo"];
            $html[] = "</b><br><span style='color:rgb(100,100,100)'>".$variavel["descricao"]."</span></h1>";
            $filhos = $variavel["filhos"];
            foreach($filhos as $f){
                $html[] = "<h2 style='position:relative;left:10px;'>ID: <u>".$f["id"]."</u> - ".$f["titulo"]."</h2>";
                $html[] = "<div style='position:relative;padding-left:20px;'>";
                $html[] = "<p>".$f["descricao"]."</p>";
                if($detalhes == "sim"){
                    $html[] = "<p><b>Fontes:</b></p>";
                    foreach($f["fontes"] as $fonte){
                        $html[] = "<p><a href='".$fonte["link"]."' >".$fonte["titulo"]."</a></p>";
                    }
                    $html[] = "<p><b>Links:</b></p>";
                    foreach($f["links"] as $link){
                        $html[] = "<p><a href='".$link["link"]."' >".$link["nome"]."</a></p>";
                    }
                    if($f["dadosgerenciais"] != ""){
                        $html[] = "<span style='color:gray'>";
                        $html[] = "esquemadb = ".$f["dadosgerenciais"][esquemadb].", ";
                        $html[] = "tabela = ".$f["dadosgerenciais"][tabela].", ";
                        $html[] = "colunavalor = ".$f["dadosgerenciais"][colunavalor].", ";
                        $html[] = "colunaidgeo = ".$f["dadosgerenciais"][colunaidgeo].", ";
                        $html[] = "filtro = ".$f["dadosgerenciais"][filtro].", ";
                        $html[] = "colunaidunico = ".$f["dadosgerenciais"][colunaidunico];
                        $html[] = "</span>";
                    }
                }
                $html[] = "</div>";
            }
            $html[] = "</div>";
            if($var_cor == "var_cor1"){
                $var_cor = "var_cor2";
            }
            else{
                $var_cor = "var_cor1";
            }
        }
        $html[] = "</div><br><br>";
        return implode("",$html);
    }
    /**
     * Cria um relatorio no formato XML
     * @param dados obtidos com relatorioCompleto
     * @return string
     */
    function formataXML($dados){
        $chaves = array_keys($dados[0]);
        if(count($chaves) == 0){
            $chaves = false;
        }
        $xml = "<"."\x3F"."xml version='1.0' encoding='UTF-8' "."\x3F".">" . PHP_EOL;
        $xml .= '<result-set>' . PHP_EOL;
        //tenta descobrir o tipo de coluna
        //$xml .= '<!--java.lang.String,java.lang.Integer-->' . PHP_EOL;
        $xmldados = "";
        if($chaves){
            foreach($dados as $d){
                $xmldados .= "<row>" . PHP_EOL;
                foreach($chaves as $c){
                    $xmldados .= "<".$c.">".$d[$c]."</".$c.">" . PHP_EOL;
                }
                $xmldados .= "</row>" . PHP_EOL;
            }
            $tipos = array();
            $d = $dados[0];
            foreach($chaves as $c){
                if(is_numeric($d[$c])){
                    $tipos[] = "java.lang.Integer";
                }
                else{
                    $tipos[] = "java.lang.String";
                }
            }
            $xml .= '<!--'.implode($tipos,",").'-->' . PHP_EOL;
        }
        else{
            while (list($key, $val) = each($dados)) {
                $xmldados .= "<row>" . PHP_EOL;
                $xmldados .= "<nome>".$key."</nome>" . PHP_EOL;
                $xmldados .= "<valor>".$val."</valor>" . PHP_EOL;
                $xmldados .= "</row>" . PHP_EOL;
            }
            reset($dados);
            $tipos = array();
            while (list($key, $val) = each($dados)) {
                if(is_numeric($val)){
                    $tipos[] = "java.lang.Integer";
                }
                else{
                    $tipos[] = "java.lang.String";
                }
                if(is_numeric($key)){
                    $tipos[] = "java.lang.Integer";
                }
                else{
                    $tipos[] = "java.lang.String";
                }
                break;
            }
            $xml .= '<!--'.implode($tipos,",").'-->' . PHP_EOL;
        }
        $xml .= $xmldados;
        $xml .= '</result-set>' . PHP_EOL;
        return $xml;
    }
    /**
     * Verifica se em um array existe uma chave com determinado valor
     * @param Array
     * @param nome da chave
     * @param valor a ser buscado
     * @return boolean
     */
    function buscaNoArray($lista,$chave,$valor){
        foreach($lista as $l){
            if($l[$chave] == $valor){
                return true;
            }
        }
        return false;
    }
    /**
     * Obtem o valor de um registro de uma tabela de regiao com base na coordenada de longitude e latitude
     * @param codigo do tipo de regiao
     * @param longitude
     * @param latitude
     * @return array
     */
    function xy2regiao($codigo_tipo_regiao,$x,$y){
        //pega a tabela, esquema e conexao para acessar os dados da regiao
        $regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
        //$c = $this->listaConexao($regiao["codigo_estat_conexao"],true);
        $c = $this->listaConexaoMetaestat();
        $dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
        $sql = "select ".$regiao["identificador"]." as identificador_regiao,".$regiao["colunanomeregiao"]." as nomeregiao from i3geo_metaestat.".$regiao["tabela"]." WHERE ST_within(ST_GeomFromText('POINT($x $y)',".$regiao["srid"]."),".$regiao["colunageo"].")";
        $q = $dbh->query($sql,PDO::FETCH_ASSOC);
        $r = $q->fetchAll();
        if(count($r) > 0){
            return $r[0];
        }
        else{
            return "";
        }
    }
    /**
     * Busca os dados de uma medida de variavel para uma regiao
     * Identificador da regiao e o valor a ser encontrado na coluna de
     * ligacao da tabela da medida da variavel com a tabela com as localidades (tipo de regiao)
     * @param identificador da regiao
     * @param id da medida da variavel
     * @return multitype:unknown multitype: string
     */
    function listaAtributosMedidaVariavelRegiao ($identificador_regiao,$id_medida_variavel){
        $medida = $this->listaMedidaVariavel("",$id_medida_variavel);
        //$c = $this->listaConexao($medida["codigo_estat_conexao"],true);
        $c = $this->listaConexaoMetaestat();
        if($medida["colunavalor"] == ""){
            return "";
        }
        $dbh = new PDO('pgsql:dbname='.$c["bancodedados"].';user='.$c["usuario"].';password='.$c["senha"].';host='.$c["host"].';port='.$c["porta"]);
        $colunassql[] = $medida["colunavalor"].",".$medida["colunaidunico"];

        $alias[] = $medida["nomemedida"];
        $colunas[] = $medida["colunavalor"];
        $alias[] = "idunico";
        $colunas[] = $medida["colunaidunico"];
        $descricao[] = $medida["unidade_medida"];
        $parametros = $this->listaParametro($id_medida_variavel);
        foreach($parametros as $p){
            $colunassql[] = $p["coluna"];
            $alias[] = $p["nome"];
            $descricao[] = $p["descricao"];
            $colunas[] = $p["coluna"];
        }

        $sql = "select ".implode(",",$colunassql)." from ".$medida["esquemadb"].".".$medida["tabela"]." WHERE ".$medida["colunaidgeo"]."::text = ".$identificador_regiao."::text ";
        if($medida["filtro"] != ""){
            $sql .= " and ".$medida["filtro"];
        }
        $q = $dbh->query($sql,PDO::FETCH_ASSOC);
        $r = $q->fetchAll();
        return array("dados"=>$r,"aliascolunas"=>$alias,"colunas"=>$colunas,"descricao"=>$descricao);
    }
    /**
     * Converte um tipo de regiao em shapefile e retorna o nome do arquivo
     * @param codigo do tipo de regiao
     * @return string
     */
    function regiao2shp($codigo_tipo_regiao){
        $regiao = $this->listaTipoRegiao($codigo_tipo_regiao);
        $dados = $this->obtemDadosTabelaDB($regiao["codigo_estat_conexao"],$regiao["esquemadb"],$regiao["tabela"],"sim");
        $tipol = $this->listaPropGeoRegiao($codigo_tipo_regiao);
        include_once(dirname(__FILE__)."/classesphp/classe_shp.php");
        $s = new SHP();
        //st_dimension returns 0 for POINT, 1 for LINESTRING, 2 for POLYGON
        //echo MS_SHP_POINT.", ".MS_SHP_ARC.", ".MS_SHP_POLYGON.", ".MS_SHP_MULTIPOINT;
        //1, 3, 5, 8
        $conv[0] = 1;
        $conv[1] = 3;
        $conv[2] = 5;
        //cria as colunas
        $cni = 0;
        foreach($dados["colunas"] as $t){
            $temp = strtoupper($t["field"]);
            if(strlen($temp) > 10){
                $temp = substr($temp,0,8).($cni++);
            }
            if($t["type"] == "varchar" || $t["type"] == "char" || $t["type"] == "character varying" || $t["type"] == "character" || $t["type"] == "text"){
                $def[] = array($temp,"C","254");
            }
            else{
                if($t["lengthvar"] < 0){
                    $t["lengthvar"] = 0;
                }
                $def[] = array($temp,"N", $t["length"],$t["lengthvar"]);
            }
        }
        $nomeshp = $this->dir_tmp."/regiao$codigo_tipo_regiao"."_".$this->nomeRandomico();
        $dbaseExiste = false;
        if(function_exists("dbase_create")){
            $dbaseExiste = true;
        }
        //para manipular dbf
        if($dbaseExiste == false){
            include_once (dirname(__FILE__)."/../pacotes/phpxbase/api_conversion.php");
            $db = xbase_create($nomeshp.".dbf", $def);
        }
        else
        {$db = dbase_create($nomeshp.".dbf", $def);}
        $dbname = $nomeshp.".dbf";
        $reg = array();
        $novoshpf = ms_newShapefileObj($nomeshp.".shp", $conv[$tipol["st_dimension"]]);
        $cols = $dados["colunas"];
        $nc = count($dados["colunas"]);
        foreach($dados["linhas"] as $l){
            $reg = array();
            for($i=0;$i<$nc;$i++){
                if($cols[$i]["type"] != "geometry" && $cols[$i]["type"] != "geography"){
                    $reg[] = $l[$i];
                }
                else{
                    $reg[] = 0;
                    if($cols[$i]["field"] == $regiao["colunageo"]){
                        $shape = ms_shapeObjFromWkt($l[$i]);
                    }
                }
            }
            $novoshpf->addShape($shape);
            if($dbaseExiste == false){
                xbase_add_record($db,$reg);
            }
            else{
                dbase_add_record($db,$reg);
            }
        }
        if($this->dbaseExiste == false){
            xbase_close($db);
        }
        else{
            dbase_close($db);
        }
        return $nomeshp;
    }
    /*
     * Testa se os elementos de um array sao numericos
     */
    function testaNumerico($valores){
        foreach ($valores as $valor) {
            if(!empty($valor) && !is_numeric($valor)) {
                echo "valor nao numerico";
                exit;
            }
        }
    }
    function adicionaLimiteRegiao($map_file,$codigo_tipo_regiao,$outlinecolor="50,50,50",$width=2){
        $res = $this->mapfileTipoRegiao($codigo_tipo_regiao,$outlinecolor,$width);
        $mapaNovo = ms_newMapObj($res["mapfile"]);
        $layerNovo = $mapaNovo->getlayerbyname($res["layer"]);
        $layerNovo->set("status",MS_DEFAULT);
        $dataNovo = $layerNovo->data;
        $mapa = ms_newMapObj($map_file);
        $c = $mapa->numlayers;
        for($i=0;$i < $c;++$i){
            $l = $mapa->getlayer($i);
            if($l->data == $dataNovo){
                $l->set("status",MS_DELETE);
            }
        }
        ms_newLayerObj($mapa, $layerNovo);
        $mapa->save($map_file);
        return true;
    }
}
?>
