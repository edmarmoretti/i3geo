<?php
namespace restmapserver;

use PDO;

class MetaestatInfo
{

    function __construct()
    {
        include_once (I3GEOPATH . "/restmapserver/classes/admin.php");
        $this->admin = new \restmapserver\Admin();
        include_once (I3GEOPATH . "/restmapserver/classes/statistics.php");
        $this->statistics = new \restmapserver\Statistics();
    }

    function execSQL($sql)
    {
        $c = $this->listaConexaoMetaestat();
        $dbh = new PDO('pgsql:dbname=' . $c["bancodedados"] . ';user=' . $c["usuario"] . ';password=' . $c["senha"] . ';host=' . $c["host"] . ';port=' . $c["porta"]);
        error_reporting(0);
        $q = $dbh->query($sql, PDO::FETCH_ASSOC);
        if ($q) {
            $resultado = $q->fetchAll();
            return $resultado;
        } else {
            return false;
        }
    }

    function valorUnicoMedidaVariavel($id_medida_variavel = "", $coluna = "", $filtro = "")
    {
        if (empty($id_medida_variavel) || empty($coluna)) {
            return false;
        }
        $sqlf = $this->sqlMedidaVariavel($id_medida_variavel * 1, $coluna, "polygon", "", false, $filtro);
        $sqlf = $sqlf["sqlagrupamento"];
        $metaVariavel = $this->admin->i3geoestat_medida_variavel($id_medida_variavel);
        if (! empty($metaVariavel["codigo_estat_conexao"])) {
            $c = $this->listaConexaoMetaestat();
            $dbhold = $this->dbh;
            $dbh = new PDO('pgsql:dbname=' . $c["bancodedados"] . ';user=' . $c["usuario"] . ';password=' . $c["senha"] . ';host=' . $c["host"] . ';port=' . $c["porta"]);
            error_reporting(0);
            $q = $dbh->query($sqlf, PDO::FETCH_ASSOC);
            if ($q) {
                $resultado = $q->fetchAll();
                return $resultado;
            } else {
                return false;
            }
        }
        return false;
    }

    /**
     * Monta o sql que permite acessar os dados de uma media de uma variavel
     *
     * @param
     *            id da medida da variavel
     * @param
     *            coluna que sera usada para agrupar os dados
     * @param
     *            tipo de layer. Usado para escolher qual coluna com as geometrias sera incluida no sql
     * @param
     *            codigo do tipo de regiao. Se nao for definido, utiliza-se o default da variavel
     * @param
     *            le os dados diretamente da tabela sem nenhum tipo de agrupamento, seja por data ou outro parametro
     * @return array("sqlagrupamento"=>,"sql"=>,"sqlmapserver"=>,"filtro"=>,"colunas"=>,"alias"=>,"colunavalor"=>,"titulo"=>,"nomeregiao"=>)
     */
    function sqlMedidaVariavel($id_medida_variavel = "", $agruparpor = "", $tipolayer = "polygon", $codigo_tipo_regiao = "", $suportaWMST = false, $filtro = "", $direto = false)
    {
        //
        // o sql que faz acesso aos dados e marcado com /*SE*//*SE*/ na string que sera usada nos mapfiles
        // a parte que contem referencias a coluna com a geometria e marcada com /*SG*//*SG*/
        //
        // registros da medida da variavel
        $dados = $this->admin->i3geoestat_medida_variavel($id_medida_variavel);
        $dadosUnidadeDeMedida = $this->admin->i3geoestat_unidade_medida($dados["codigo_unidade_medida"]);
        if (! empty($dados["filtro"])) {
            if ($filtro == "") {
                $filtro = $dados["filtro"];
            } else {
                $filtro = $filtro . " AND (" . $dados["filtro"] . ")";
            }
        }
        // parametros da medida da variavel
        $parametrosMedida = array();
        $pp = $this->admin->i3geoestat_parametro_medida($id_medida_variavel, "", 0);
        foreach ($pp as $p) {
            $parametrosMedida[] = $p["coluna"];
        }
        // titulo da medida de variavel
        $titulo = $dados["nomemedida"];
        // indica se os dados devem ser agregados a uma regiao de nivel superior
        $agregaregiao = false;
        // nome da coluna que contem os limites geograficos da regiao desejada pelo usuario
        $colunageo = "";
        // se a regiao definida para a medida da variavel for diferente da regiao indicada pelo usuario
        // significa que a regiao indicada pelo usuario e uma agragacao
        if ($codigo_tipo_regiao != "" && $dados["codigo_tipo_regiao"] != $codigo_tipo_regiao) {
            $agregaregiao = true;
            // guarda os dados da regiao que agrega a regiao original da medida variavel
            $dadosgeo = $this->admin->i3geoestat_tipo_regiao($codigo_tipo_regiao);
        } else {
            $dadosgeo = $this->admin->i3geoestat_tipo_regiao($dados["codigo_tipo_regiao"]);
        }
        if ($tipolayer != "point") {
            $colunageo = $dadosgeo["colunageo"];
            $titulo .= " (pol) ";
        } else {
            $colunageo = $dadosgeo["colunacentroide"];
            $titulo .= " (pt) ";
        }
        $titulo .= $dadosgeo["nome_tipo_regiao"];
        $vis = $dadosgeo["colunasvisiveis"];
        if (! empty($vis) && $suportaWMST == false) {
            $vis = $vis . "," . $dadosgeo["identificador"];
            $vis = str_replace(" ", ",", $vis);
            $vis = str_replace(",,", ",", $vis);
            $vis = str_replace(";", ",", $vis);
            $colunasSemGeo = explode(",", $vis);
            $colunasSemGeo = array_unique($colunasSemGeo);
            if ($dadosgeo["apelidos"] != "") {
                $alias = "Valor," . $dadosgeo["apelidos"] . "," . $dadosgeo["identificador"];
                $alias = mb_convert_encoding($alias, "ISO-8859-1", mb_detect_encoding($alias));
                $alias = str_replace(";", ",", $alias);
                $alias = str_replace(",,", ",", $alias);
                $alias = explode(",", $alias);
                $alias = array_unique($alias);
            } else {
                $alias = $colunasSemGeo;
            }
            if (count($alias) - 1 != count($colunasSemGeo)) {
                $alias = array();
            }
        } else {
            // colunas da tabela geometria sem as colunas GEOMETRY
            $colunasSemGeo = $this->colunasTabela($dadosgeo["codigo_estat_conexao"], $dadosgeo["esquemadb"], $dadosgeo["tabela"], "geometry", "!=");
            $alias = array();
            if ($suportaWMST == true) {
                $sqlWMST = $this->listaParametroTempo2CampoData($id_medida_variavel);
                $colunasSemGeo[] = "dimtempo";
            }
        }
        // verifica o tipo de calculo para agragacao de valores
        $tipoconta = "";
        if ($dadosUnidadeDeMedida["permitesoma"] == 1 && $direto == false) {
            $tipoconta = "sum";
            if ($agregaregiao == true) {
                $titulo .= " - soma";
            }
        } elseif ($dadosUnidadeDeMedida["permitemedia"] == 1 && $direto == false) {
            $tipoconta = "avg";
            if ($agregaregiao == true) {
                $titulo .= " - media";
            }
        }

        // obtem o SQL que faz o acesso aos dados da media da variavel
        if ($dados["colunavalor"] == "") {
            $nomevalorcalculado = "'1'::numeric";
        } else {
            $nomevalorcalculado = $dados["colunavalor"];
        }

        $sqlDadosMedidaVariavel = "SELECT " . $dados["colunaidgeo"] . " AS cod_regiao,$tipoconta(" . $nomevalorcalculado . ") AS valorcalculado FROM " . $dados["esquemadb"] . "." . $dados["tabela"];
        if ($suportaWMST == true && $direto == false) {
            $sqlDadosMedidaVariavel = "SELECT $sqlWMST as dimtempo," . $dados["colunaidgeo"] . " AS cod_regiao," . $nomevalorcalculado . " AS valorcalculado FROM " . $dados["esquemadb"] . "." . $dados["tabela"];
        }
        if (! empty($filtro)) {
            $sqlDadosMedidaVariavel .= " WHERE " . $filtro . " AND " . $nomevalorcalculado . " IS NOT NULL ";
        } else {
            $sqlDadosMedidaVariavel .= " WHERE " . $nomevalorcalculado . " IS NOT NULL ";
        }
        if ($suportaWMST != true && $direto == false && $tipoconta != "") {
            $sqlDadosMedidaVariavel .= " /*FA*//*FA*/ /*FAT*//*FAT*/ GROUP BY cod_regiao ";
        }
        $sqlagrupamento = "";
        // sql que retorna a lista de ocorrencias agrupados de uma coluna especifica
        if (! empty($agruparpor) && $direto == false) {
            $sqlagrupamento = " SELECT $agruparpor FROM " . $dados["esquemadb"] . "." . $dados["tabela"];
            if (! empty($filtro)) {
                $sqlagrupamento .= " WHERE " . $filtro;
            }
            $sqlagrupamento .= " /*FA*//*FA*/ /*FAT*//*FAT*/ GROUP BY " . $agruparpor . " ORDER BY " . $agruparpor;
        }
        if ($dados["colunavalor"] == "") {
            $nomeColunaValor = "contagem";
        } else {
            $nomeColunaValor = $dados["colunavalor"];
        }
        // pega o tipo das coluna regiao.".$dadosgeo["identificador"]
        $propColuna1 = $this->descreveColunasTabela($dadosgeo["codigo_estat_conexao"], $dados["esquemadb"], $dados["tabela"], $dados["colunaidgeo"]);
        $propColuna2 = $this->descreveColunasTabela($dadosgeo["codigo_estat_conexao"], $dadosgeo["esquemadb"], $dadosgeo["tabela"], $dadosgeo["identificador"]);
        if (in_array(array(
            'oid',
            'float4',
            'float8',
            'int2',
            'int4',
            'int8',
            'int16',
            'smallint',
            'integer',
            'real',
            'double precision',
            'bigint',
            'numeric'
        ), $propColuna1["type"])) {
            $propColuna1 = 'numeric';
        } else {
            $propColuna1 = 'text';
        }
        if (in_array(array(
            'oid',
            'float4',
            'float8',
            'int2',
            'int4',
            'int8',
            'int16',
            'smallint',
            'integer',
            'real',
            'double precision',
            'bigint',
            'numeric'
        ), $propColuna2["type"])) {
            $propColuna2 = 'numeric';
        } else {
            $propColuna2 = 'text';
        }
        if ($propColuna1 == $propColuna2) {
            $propColuna1 = "";
            $propColuna2 = "";
        } else {
            if ($propColuna1 == 'numeric') {
                $propColuna1 = 'text';
            }
            if ($propColuna2 == 'numeric') {
                $propColuna2 = 'text';
            }
            if ($propColuna1 != '') {
                $propColuna1 = '::' . $propColuna1;
            }
            if ($propColuna2 != '') {
                $propColuna2 = '::' . $propColuna2;
            }
        }
        $sqlIntermediario = "SELECT (j.valorcalculado) AS " . $nomeColunaValor . ", __COLUNASSEMGEO__" . " FROM " . $dadosgeo["esquemadb"] . "." . $dadosgeo["tabela"] . " AS regiao " . " INNER JOIN ( __SQLDADOS__ ) " . " AS j ON j.cod_regiao" . $propColuna1 . " = regiao." . $dadosgeo["identificador"] . $propColuna2;
        // inclui os sqls de regioes de niveis inferiores
        if ($agregaregiao == true && $direto == false) {
            $hierarquia = $this->regiaoFilhaAoPai($dados["codigo_tipo_regiao"], $codigo_tipo_regiao);
            $caminho = $hierarquia["caminho"];
            $dadosColunas = $hierarquia["colunas"];
            // var_dump($hierarquia);exit;
            if (count($caminho) > 0) {
                $caminho = array_reverse($caminho);
                foreach ($caminho as $idregiao) {
                    if ($idregiao != $codigo_tipo_regiao) { // a regiao pai ja esta no sql
                        $tempDadosRegiao = $this->admin->i3geoestat_tipo_regiao($idregiao);
                        // para contador forcado
                        if ($dados["colunavalor"] == "") {
                            $nomevalorcalculado = "'1'::numeric";
                        } else {
                            $nomevalorcalculado = "j.valorcalculado";
                        }
                        $temp = "SELECT regiao." . $dadosColunas[$idregiao]["colunaligacao_regiaopai"] . " AS cod_regiao,sum(" . $nomevalorcalculado . ") AS valorcalculado " . "FROM " . $tempDadosRegiao["esquemadb"] . "." . $tempDadosRegiao["tabela"] . " AS regiao " . "INNER JOIN " . "( __SQLDADOS__ )" . " AS j ON j.cod_regiao::text = regiao." . $tempDadosRegiao["identificador"] . "::text GROUP BY regiao." . $dadosColunas[$idregiao]["colunaligacao_regiaopai"];
                        $sqlIntermediario = str_replace("__SQLDADOS__", $temp, $sqlIntermediario);
                    }
                }
            }
        }
        // sql final que retorna os dados
        // contem todas as colunas da tabela regiao, menos as que contem geometria
        $sql = str_replace("__SQLDADOS__", $sqlDadosMedidaVariavel, $sqlIntermediario);
        $sql = str_replace("__COLUNASSEMGEO__", implode(",", $colunasSemGeo), $sql);
        // sql para o mapserver
        $sqlgeo = str_replace("__SQLDADOS__", $sqlDadosMedidaVariavel, $sqlIntermediario);
        $colunasComGeo = $colunasSemGeo;
        // $colunasComGeo[] = "/*SG*/st_setsrid(".$colunageo.",".$dadosgeo["srid"].") as ".$colunageo." /*SG*/";
        $colunasComGeo[] = "/*SG*/" . $colunageo . " as " . $colunageo . " /*SG*/";
        $sqlgeo = str_replace("__COLUNASSEMGEO__", implode(",", $colunasComGeo), $sqlgeo);
        $sqlgeo = $colunageo . " from /*SE*/(" . $sqlgeo . " /*FR*//*FR*/ )/*SE*/ as foo using unique " . $dadosgeo["identificador"] . " using srid=" . $dadosgeo["srid"];

        // o SQL com os dados contem um filtro ou nao?
        $contemfiltro = false;
        if (! empty($filtro) && $direto == false) {
            $contemfiltro = true;
            $titulo .= " " . $filtro;
        }
        // adiciona a coluna com os valores no inicio do array()
        $colunasSemGeo = array_merge(array(
            $dados["colunavalor"]
        ), $colunasSemGeo);
        $buscar = array(
            "drop",
            "update",
            "insert",
            "create",
            "alter",
            "delete"
        );
        $sql = str_ireplace($buscar, "", $sql);
        $sqlagrupamento = str_ireplace($buscar, "", $sqlagrupamento);
        $sqlgeo = str_ireplace($buscar, "", $sqlgeo);
        return array(
            "nomeregiao" => $dadosgeo["colunanomeregiao"],
            "titulo" => $titulo,
            "colunavalor" => $dados["colunavalor"],
            "sqlagrupamento" => $sqlagrupamento,
            "sql" => $sql,
            "sqlmapserver" => $sqlgeo,
            "filtro" => $contemfiltro,
            "colunas" => $colunasSemGeo,
            "alias" => $alias,
            "srid" => $dadosgeo["srid"]
        );
    }

    /**
     * Lista as colunas de uma tabela
     *
     * @param
     *            codigo da conexao
     * @param
     *            nome do esquema
     * @param
     *            nome da tabela
     * @param
     *            tipo de coluna (opcional)
     * @param
     *            tipo de tratamento do parametro tipo, pode ser =|!=
     * @return string
     */
    function colunasTabela($codigo_estat_conexao, $nome_esquema, $nome_tabela, $tipo = "", $tipotratamento = "=")
    {
        $colunas = array();
        $res = $this->execSQL("SELECT column_name as coluna,udt_name, data_type FROM information_schema.columns where table_schema = '$nome_esquema' and table_name = '$nome_tabela'");
        if ($tipo != "") {
            $res = $this->execSQL("SELECT column_name as coluna,udt_name, data_type FROM information_schema.columns where table_schema = '$nome_esquema' and udt_name $tipotratamento '$tipo' and table_name = '$nome_tabela'");
        }
        foreach ($res as $c) {
            $colunas[] = $c["coluna"];
        }
        return $colunas;
    }

    function listaConexaoMetaestat()
    {
        $postgis_mapa = $_SESSION["postgis_mapa"];
        if (isset($postgis_mapa["metaestat"])) {
            $m = $postgis_mapa["metaestat"];
            if ($m == "") {
                return false;
            }
            $lista = explode(" ", $m);
            $con = array();
            foreach ($lista as $l) {
                $teste = explode("=", $l);
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

    function listaParametroTempo2CampoData($id_medida_variavel, $prefixoAlias = "")
    {
        // lista os parametros temporais
        $parametros = $this->admin->i3geoestat_parametro_medida($id_medida_variavel, "", "", true, true);
        echo "<pre>";
        // var_dump($parametros);exit;
        // faz o sql para pegar os valores e definir a resolucao
        // o tempo deve comecar sempre pelo ano
        $data = array();
        if ($parametros[0]["tipo"] == 1) {
            // ano
            $data[] = $prefixoAlias . $parametros[0]["coluna"];
            $tipodata = "YYYY";
            // mes
            if (! empty($parametros[1])) {
                $data[] = "'-'" . $prefixoAlias . $parametros[1]["coluna"];
                $tipodata = "YYYYMM";
            } else {
                $data[] = "'-01'";
            }
            // dia
            if (! empty($parametros[2])) {
                $data[] = "'-'" . $prefixoAlias . $parametros[2]["coluna"];
                $tipodata = "YYYYMMDD";
            } else {
                $data[] = "'-01'";
            }
            $data = implode("||", $data);
            return "to_date($data,'$tipodata')";
        }
    }

    /**
     * Lista os metadados de uma coluna
     * Os metadados sao obtidos do proprio PostgreSQL
     *
     * @param
     *            codigo da conexao
     * @param
     *            nome do esquema
     * @param
     *            nome da tabela
     * @param
     *            nome da coluna (opcional)
     * @return string
     */
    function descreveColunasTabela($codigo_estat_conexao, $nome_esquema, $nome_tabela, $nome_coluna = "")
    {
        if ($nome_coluna == "") {
            return $this->execSQL("SELECT a.attnum,a.attname AS field,t.typname AS type,a.attlen AS length,a.atttypmod AS lengthvar,a.attnotnull AS notnull,p.nspname as esquema FROM pg_class c,pg_attribute a,pg_type t,pg_namespace p WHERE c.relname = '$nome_tabela' and p.nspname = '$nome_esquema' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid and c.relnamespace = p.oid ORDER BY a.attname");
        } else {
            $res = $this->execSQL("SELECT a.attnum,a.attname AS field,t.typname AS type,a.attlen AS length,a.atttypmod AS lengthvar,a.attnotnull AS notnull,p.nspname as esquema FROM pg_class c,pg_attribute a,pg_type t,pg_namespace p WHERE a.attname = '$nome_coluna' AND c.relname = '$nome_tabela' and p.nspname = '$nome_esquema' and a.attnum > 0 and a.attrelid = c.oid and a.atttypid = t.oid and c.relnamespace = p.oid ORDER BY a.attname");
            return $res[0];
        }
    }

    /**
     * Retorna os ids das regioes que permitem partir de uma regiao filha chegar a uma regiao pai
     * Usado para descobrir que regioes devem ser sequencialmente agregadas
     *
     * @param
     *            partir da regiao
     * @param
     *            chegar na regiao
     * @return array lista de ids de regioes sequenciais do filho ate chegar ao pai indicado
     */
    function regiaoFilhaAoPai($codigo_tipo_regiao, $codigo_tipo_regiao_pai = "")
    {
        $pais = $this->admin->i3geoestat_agregaregiao($codigo_tipo_regiao);
        $caminho = array(
            $codigo_tipo_regiao
        );
        $colunas = array();
        if (count($pais) == 0) {
            return $caminho;
        }
        foreach ($pais as $pai) {
            $caminho[] = $pai["codigo_tipo_regiao_pai"];
            $colunas[$pai["codigo_tipo_regiao"]] = $pai;
            if ($pai["codigo_tipo_regiao_pai"] == $codigo_tipo_regiao_pai) {
                return array(
                    "caminho" => $caminho,
                    "colunas" => $colunas
                );
            }
        }
        return array(
            "caminho" => $caminho,
            "colunas" => $colunas
        );
    }
    /**
     * Lista os registros de uma tabela que e uma regiao
     * @param codigo do tipo de regiao
     */
    function listaDadosGeometriaRegiao($codigo_tipo_regiao){
        //pega a tabela, esquema e conexao para acessar os dados da regiao
        $regiao = $this->admin->i3geoestat_tipo_regiao($codigo_tipo_regiao);
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
     * Cria um arquivo mapfile para uma medida de variavel
     * Inclui no arquivo o layer de acesso aos dados
     * O mapfile contem apenas o layer
     * O arquivo e armazenado em uma pasta temporaria
     * O sql e obtido com o metodo sqlMedidaVariavel
     *
     * @param
     *            id da medida da variavel
     * @param
     *            filtro que sera concatenado ao sql padrao da medida
     * @param
     *            0|1 indica se todas as colunas da tabela original dos dados sera incluida no sql
     * @param
     *            tipo de layer
     * @param
     *            titulo do layer
     * @param
     *            id da classificacao cadastrada,se for vazio usa o primeiro
     * @param
     *            coluna que sera usada como agrupamento no sql
     * @param
     *            codigo do tipo de regiao cadastrada
     * @param
     *            valor de opacidade do layer
     * @param
     *            o layer deve suportar WMS-T ou nao
     * @param
     *            faz o cache do mapfile
     * @return array("mapfile"=>,"layer"=>,"titulolayer"=>)
     */
    function mapfileMedidaVariavel($id_medida_variavel, $filtro = "", $todasascolunas = 0, $tipolayer = "polygon", $titulolayer = "", $id_classificacao = "", $agruparpor = "", $codigo_tipo_regiao = "", $opacidade = "", $suportaWMST = false)
    {
        // para permitir a inclusao de filtros, o fim do sql e marcado com /*FW*//*FW*/
        // indicando onde deve comecar e terminar uma possivel clausula where
        // ou com /*FA*//*FA*/
        // para marcar que deve ser utilizado AND ao adicionar o filtro
        // utiliza-se da mesma forma /*FAT*//*FAT*/ e /*FWT*//*FWT*/ para os filtros de tempo
        // Layers adicionados aqui sao marcados com o metadata METAESTAT "SIM"
        // O codigo_tipo_regiao e marcado com o metadata METAESTAT_CODIGO_TIPO_REGIAO
        // O id da medida da variavel e marcado com o metadata METAESTAT_ID_MEDIDA_VARIAVEL
        $nomeDoLayer = uniqid("metaestat");

        $meta = $this->admin->i3geoestat_medida_variavel($id_medida_variavel);
        // evita agregar regioes qd nao e necessario
        if ($meta["codigo_tipo_regiao"] == $codigo_tipo_regiao || empty($codigo_tipo_regiao)) {
            $agruparpor = "";
        }
        $dconexao = $this->listaConexaoMetaestat();
        $conexao = "user=" . $dconexao["usuario"] . " password=" . $dconexao["senha"] . " dbname=" . $dconexao["bancodedados"] . " host=" . $dconexao["host"] . " port=" . $dconexao["porta"] . "";
        $sql = $this->sqlMedidaVariavel($id_medida_variavel, $agruparpor, $tipolayer, $codigo_tipo_regiao, $suportaWMST, $filtro);
        if (empty($codigo_tipo_regiao)) {
            $codigo_tipo_regiao = $meta["codigo_tipo_regiao"];
        }
        if (empty($codigo_tipo_regiao)) {
            return false;
        }
        // define o tipo correto de layer
        $dg = $this->listaDadosGeometriaRegiao($codigo_tipo_regiao);
        if (empty($tipolayer) || ! isset($dg["dimension"]) || $dg == false || empty($dg) || $dg["dimension"] == "") {
            $tipolayer = "polygon";
        } else {
            if ($dg["dimension"] == 0) {
                $tipolayer = "point";
            }
            if ($dg["dimension"] == 1) {
                $tipolayer = "line";
            }
        }
        $sqlf = $sql["sqlmapserver"];
        $classes = "";
        if (! empty($id_classificacao)) {
            $classes = $this->admin->i3geoestat_classes($id_classificacao);
        } else {
            $classificacoes = $this->admin->i3geoestat_classificacao($id_medida_variavel);
            $classes = $this->admin->i3geoestat_classes($classificacoes[0]["id_classificacao"]);
        }
        if ($classes == false) {
            $valores = $this->dadosMedidaVariavel($id_medida_variavel, $filtro . " AND " . $meta["colunavalor"] . " > 0 ");
            $valores = array_column($valores, $meta["colunavalor"]);
            $item = $meta["colunavalor"];
            $classes = array();
            $cores = array();
            // cores baseadas em colorbrewer
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

            $cores = $cores[mt_rand(0, 9)];
            $estat = $this->statistics->basic($valores);
            $calc = $estat->results;
            $titulo = array();
            // adiciona as classes novas
            $expressao[] = "([" . $item . "]<=" . ($calc["quartil1"]) . ")";
            $titulo[] = "<=" . round($calc["quartil1"], 3);
            $expressao[] = "(([" . $item . "]>" . ($calc["quartil1"]) . ")and([" . $item . "]<=" . ($calc["quartil2"]) . "))";
            $titulo[] = "> " . round($calc["quartil1"], 3) . " e <= " . round($calc["quartil2"], 3);
            if ($calc["quartil3"] != 0) {
                $expressao[] = "(([" . $item . "]>" . ($calc["quartil2"]) . ")and([" . $item . "]<=" . ($calc["quartil3"]) . "))";
                $titulo[] = "> " . round($calc["quartil2"], 3) . " e <= " . round($calc["quartil3"], 3);
                $expressao[] = "([" . $item . "]>" . ($calc["quartil3"]) . ")";
                $titulo[] = "> " . round($calc["quartil3"], 3);
            }
            if ($calc["quartil1"] > 0) {
                $classes[] = array(
                    "expressao" => "([" . $item . "] = 0)",
                    "titulo" => "0",
                    "verde" => 100,
                    "vermelho" => 100,
                    "azul" => 100
                );
            }
            for ($i = 0; $i < count($expressao); ++ $i) {
                $classes[] = array(
                    "expressao" => $expressao[$i],
                    "titulo" => $titulo[$i],
                    "verde" => $cores[$i][1],
                    "vermelho" => $cores[$i][0],
                    "azul" => $cores[$i][2]
                );
            }
        }
        if (! empty($titulolayer)) {
            // $titulolayer = mb_convert_encoding($titulolayer,"ISO-8859-1",mb_detect_encoding($titulolayer));
        } else {
            $titulolayer = mb_convert_encoding($sql["titulo"], "ISO-8859-1", mb_detect_encoding($sql["titulo"]));
        }
        // necessario para evitar problemas com ITENSDESC
        $titulolayer = str_replace(",", " ", $titulolayer);
        $titulolayer = str_replace("=", ": ", $titulolayer);
        // pega os parametros caso seja um mapfile para WMS-time

        if ($suportaWMST == true) {
            $sqlMinMax = "select min(dimtempo) as min,max(dimtempo) as max from(" . $sql["sql"] . ") as x";
            $minmaxdata = $this->execSQL($sqlMinMax);
            $fontemeta = $this->listaFonteinfoMedida($id_medida_variavel);
            if (count($fontemeta) > 0) {
                $fontemeta = $fontemeta[0]["link"];
            } else {
                $fontemeta = "";
            }
        }
        $dados[] = "MAP";
        $dados[] = 'SYMBOLSET "' . I3GEOPATH . 'symbols/simbolosv7.sym"';
        $dados[] = 'FONTSET   "' . I3GEOPATH . 'symbols/fontes.txt"';
        // inclui os simbolos que podem ser definidos como imagens
        foreach ($classes as $classe) {
            if (! empty($classe["simbolo"])) {
                if (file_exists($classe["simbolo"])) {
                    $dados[] = "SYMBOL";
                    $dados[] = '	NAME "' . $classe["simbolo"] . '"';
                    $dados[] = '			TYPE pixmap';
                    $dados[] = '	IMAGE "' . $classe["simbolo"] . '"';
                    $dados[] = "END";
                }
            }
        }
        $dados[] = "LAYER";
        $dados[] = '	NAME "' . $nomeDoLayer . '"';
        $dados[] = "	TYPE $tipolayer";
        $dados[] = '	DATA "' . $sqlf . '"';
        // $dados[] = ' CONNECTION "'.$conexao.'"';
        $dados[] = '	CONNECTION "metaestat"';
        $dados[] = '	CONNECTIONTYPE POSTGIS';
        $dados[] = '	STATUS OFF';
        $dados[] = '	TEMPLATE "none.htm"';
        if ($opacidade != "") {
            $dados[] = '	OPACITY ' . $opacidade;
        }
        $dados[] = '	METADATA';
        $dados[] = '		TEMA "' . $titulolayer . '"';
        $dados[] = '		tme	"{\"titulo\":\"' . $titulolayer . '\",\"colnome\":\"' . $sql["nomeregiao"] . '\",\"colsdata\":[\"' . $sql["colunavalor"] . '\"],\"lmax\":\"8000\",\"amax\":\"500000\",\"outlinecolor\":\"-1,-1,-1\",\"numvertices\":\"4\",\"auto\":\"nao\",\"exec\":\"nao\"}"';

        $dados[] = '		TIP "' . $sql["colunavalor"] . ',' . $sql["nomeregiao"] . '"';
        // $dados[] = ' "UTFDATA" "'.$sql["colunavalor"].'"';
        $dados[] = '		CLASSE "SIM"';
        $dados[] = '		CACHE "NAO"';
        $dados[] = '		permitedownload "SIM"';
        $dados[] = '		METAESTAT "SIM"';
        $dados[] = '		METAESTAT_CODIGO_TIPO_REGIAO "' . $codigo_tipo_regiao . '"';
        $dados[] = '		METAESTAT_ID_MEDIDA_VARIAVEL "' . $id_medida_variavel . '"';
        // marca se a tabela e editavel, verificando se esta no esquema padrao
        if ($meta["esquemadb"] == "i3geo_metaestat") {
            $dados[] = '		EDITAVEL "SIM"';
            $dados[] = '		COLUNAIDUNICO "' . $meta["colunaidunico"] . '"';
            $dados[] = '		TABELAEDITAVEL "' . $meta["tabela"] . '"';
            $dados[] = '		ESQUEMATABELAEDITAVEL "' . $meta["esquemadb"] . '"';
        }
        if (count($sql["alias"]) > 0) {
            $dados[] = '	ITENS "' . implode(",", $sql["colunas"]) . '"';
            $dados[] = '	ITENSDESC "' . implode(",", $sql["alias"]) . '"';
        }
        if ($suportaWMST == true) {
            $dados[] = '	"wms_timeitem"	"dimtempo"';
            $dados[] = '	"wms_timeextent" "' . $minmaxdata[0]["min"] . "/" . $minmaxdata[0]["max"] . '"';
            $dados[] = '	"wms_timedefault" "' . $minmaxdata[0]["max"] . '"';
            $dados[] = '	"ows_metadataurl_href" "' . $fontemeta . '"';
            $dados[] = ' 	"ows_metadataurl_type" "TC211" ';
            $dados[] = '	"ows_metadataurl_format" "text/html" ';
        }
        $dados[] = '	END';
        if ($classes == "") {
            $dados[] = '    CLASS';
            $dados[] = '        NAME ""';
            $dados[] = '        STYLE';
            $dados[] = '        	COLOR 200 0 0';
            if (strtolower($tipolayer) == "point") {
                $dados[] = '        SYMBOL "ponto"';
                $dados[] = '        SIZE 5';
            }
            $dados[] = '        END';
            $dados[] = '    END';
        } else {
            foreach ($classes as $classe) {
                // var_dump($classe);exit;
                $dados[] = '    CLASS';
                $dados[] = '        NAME "' . mb_convert_encoding($classe["titulo"], "ISO-8859-1", mb_detect_encoding($classe["titulo"])) . '"';
                if ($classe["expressao"] != "") {
                    $expressao = str_replace('"', "'", $classe["expressao"]);
                    $dados[] = "        EXPRESSION " . $expressao;
                }
                $dados[] = '        STYLE';
                $dados[] = '        	COLOR ' . $classe["vermelho"] . ' ' . $classe["verde"] . ' ' . $classe["azul"];
                if (! empty($classe["tamanho"])) {
                    $dados[] = '        SIZE ' . $classe["tamanho"];
                } elseif (strtolower($tipolayer) == "point") {
                    $dados[] = '        SIZE 5';
                }
                if (! empty($classe["simbolo"])) {
                    $dados[] = '        SYMBOL ' . $classe["simbolo"];
                } elseif (strtolower($tipolayer) == "point") {
                    $dados[] = '        SYMBOL ponto';
                }
                if (! empty($classe["otamanho"])) {
                    $dados[] = '        OUTLINEWIDTH ' . $classe["otamanho"];
                }
                if (! empty($classe["overmelho"]) || $classe["overmelho"] == "0") {
                    $dados[] = '        OUTLINECOLOR ' . $classe["overmelho"] . ' ' . $classe["overde"] . ' ' . $classe["oazul"];
                }
                $dados[] = '        END';
                $dados[] = '    END';
            }
        }
        $dados[] = "END";
        $dados[] = "END";
        return array(
            "mapfile" => implode("\n", $dados),
            "layer" => $nomeDoLayer,
            "titulolayer" => $titulolayer
        );
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
        $sql = $this->sqlMedidaVariavel($id_medida_variavel,$agruparpor,"polygon","",false,$filtro,$direto);
        $sqlf = $sql["sqlmapserver"];
        //remove marcadores geo
        $sqlf = explode("/*SE*/",$sqlf);
        $sqlf = explode("/*SG*/",$sqlf[1]);
        $sqlf = $sqlf[0]." ".$sqlf[2];
        if($limite != ""){
            $sqlf .= " limit ".$limite;
        }
        $sqlf = str_replace(",  FROM"," FROM",$sqlf);
        $metaVariavel = $this->admin->i3geoestat_medida_variavel_variavel("",$id_medida_variavel);
        if(!empty($metaVariavel["codigo_estat_conexao"])){
            $res = $this->execSQL($sqlf);
            return $res;
        }
        return false;
    }
}