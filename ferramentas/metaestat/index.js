/*
Title: Cartogramas estat&iacute;sticos

Arquivo:

i3geo/ferramentas/metaestat/index.js

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
/*
Classe: i3GEOF.metaestat

Gerencia os componentes do m&oacute;dulo de gera&ccedil;&atilde;o de cartogramas estat&iacute;sticos utilizados no mapa interativo.
 */
i3GEOF.metaestat = {
        /**
         * Tipo de interface utilizada para construcao dos parametros
         *
         * flutuante - uma janela flutuante sera criada e os componentes da ferramenta serao inseridos nessa janela
         *
         * flutuanteSimples -interface qd a medida da variavel ja tiver sido definida. Utilizada ao adicionar uma camada via catalogo de temas
         *
         * inline - nao abre a janela flutuante. O HTML sera inserido em um container que ja deve existir no mapa. Utiliza o template templatesimplesinline_mst.html
         *
         * "" - os componentes serao inseridos em um div qualquer definido em i3GEOF.metaestat.inicia
         */
        INTERFACE: "flutuante",
        /**
         * guarda o valor do codigo da ultima variavel escolhida ou passada como parametro na inicializacao
         */
        CODIGO_VARIAVEL: "",
        /**
         * guarda o valor do codigo da ultima medidda da variavel escolhida ou passada como parametro na inicializacao
         */
        ID_MEDIDA_VARIAVEL: "",
        NOME_MEDIDA_VARIAVEL: "",
        /**
         * codigo da conexao com o banco de dados que sera utilizada como default
         * e utilizado em customizacoes da interface, como o geosaude, permitindo acessar as listas de esquemas e tabelas
         */
        CONEXAODEFAULT: 0,
        /**
         * Posicao em pixels da janela flutuante com os componentes da ferramenta
         */
        TOP: 50,
        /**
         * Posicao em pixels da janela flutuante com os componentes da ferramenta
         */
        LEFT: 100,
        /**
         * Largura em pixels da janela flutuante com os componentes da ferramenta
         */
        LARGURA: 350,
        /**
         * Altura em pixels da janela flutuante com os componentes da ferramenta
         */
        ALTURA: 280,
        /**
         * guarda a lista de camadas que foram adicionadas ao mapa
         */
        CAMADAS: [],
        /**
         * guarda os dados das medidas obtidos para a ultima variavel escolhida
         */
        DADOSMEDIDASVARIAVEL: [],
        /**
         * ativa o modo de selecao de multiplos valores nos combos de parametros
         */
        MULTIPARAMETROS: true,
        //para efeitos de compatibilidade com i3GEO.mapa.dialogo
        criaJanelaFlutuante: function(){
            i3GEOF.metaestat.inicia();
        },
        //TODO desabilitar em producao
        log: function(t){
            //if (typeof (console) !== 'undefined')
            //    console.info(t);
        },
        /**
         * Inicia a ferramenta
         * Carrega o dicionario de traducao com i3GEOF.metaestat.comum.iniciaDicionario() que por sua vez inicia a ferramenta com i3GEOF.metaestat.principal.inicia()
         * @param tipo de interface veja i3GEOF.metaestat.INTERFACE. Para usar o default, utilize ""
         * @param codigo da variavel que aparecera como selecionada no combo de selecao de variaveis. Default ""
         * @param codigo da medida da variavel que aparecera como selecionada no combo de selecao de medidas. Default ""
         */
        inicia: function(Interface,codigo_variavel,id_medida_variavel,nome_medida_variavel){
            i3GEOF.metaestat.log("i3GEOF.metaestat.inicia()");
            if(nome_medida_variavel){
                i3GEOF.metaestat.NOME_MEDIDA_VARIAVEL = nome_medida_variavel;
            }
            if(Interface && Interface != ""){
                i3GEOF.metaestat.INTERFACE = Interface;
            }
            i3GEOF.metaestat.CODIGO_VARIAVEL = "";
            i3GEOF.metaestat.ID_MEDIDA_VARIAVEL = "";
            if(codigo_variavel && codigo_variavel != ""){
                i3GEOF.metaestat.CODIGO_VARIAVEL = codigo_variavel;
            }
            if(id_medida_variavel && id_medida_variavel != ""){
                i3GEOF.metaestat.ID_MEDIDA_VARIAVEL = id_medida_variavel;
            }
            i3GEOF.metaestat.principal.inicia();
        },
        /**
         * Funcoes e variaveis que controlam as opcoes de analise (botoes da janela de analise)
         */
        analise: {
            MUSTACHE : "",
            mustacheHash : function() {
                var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.metaestat.dicionario);
                dicionario["locaplic"] = i3GEO.configura.locaplic;
                dicionario["t42"] = $trad("t42");
                dicionario["t49"] = $trad("t49");
                return dicionario;
            },
            /**
             * Inicia a ferramenta ativando os componentes da interface
             * Executa as funcoes i3GEOF.metaestat.analise.abreJanela() e i3GEOF.metaestat.analise.comboCamadas()
             * @param id do div que recebera os componentes HTML da ferramenta
             */
            inicia: function(iddiv){
                i3GEOF.metaestat.log("i3GEOF.metaestat.analise.inicia()");

                if(i3GEOF.metaestat.analise.MUSTACHE == ""){
                    $.get(i3GEO.configura.locaplic + "/ferramentas/metaestat/template_analise_mst.html", function(template) {
                        i3GEOF.metaestat.analise.MUSTACHE = template;
                        i3GEOF.metaestat.analise.inicia(iddiv);
                    });
                    return;
                }

                var ics,n,i;
                if(!iddiv || !$i(iddiv)){
                    iddiv = "i3geoCartoAnalise_corpo";
                }
                if(i3GEOF.metaestat.INTERFACE == "flutuante"){
                    i3GEOF.metaestat.analise.abreJanela();
                }
                $i(iddiv).innerHTML = i3GEOF.metaestat.analise.html();
                ics = $i(iddiv).getElementsByTagName("button");
                n = ics.length;
                for(i=0;i<n;i++){
                    ics[i].style.backgroundColor = "white";
                    ics[i].className = "iconeGuiaMovel";
                    ics[i].onmouseout = function(){this.className = "iconeGuiaMovel iconeGuiaMovelMouseOut";};
                    ics[i].onmouseover = function(){this.className = "iconeGuiaMovel iconeGuiaMovelMouseOver";};
                    ics[i].style.backgroundImage = "none";
                    ics[i].style.height = "32px";
                    ics[i].style.width = "32px";
                    ics[i].style.border = "1px solid gray";
                    ics[i].style.margin = "0px";
                    ics[i].style.position = "relative";
                }
                i3GEOF.metaestat.analise.comboCamadas();
            },
            /**
             * Abre a janela flutuante com os componentes da ferramenta
             * Para recuperar o objeto YUI utilize janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoAnalise")
             */
            abreJanela: function(){
                var cabecalho,minimiza,imagemxy,janela;
                if (!$i("i3geoCartoAnalise")){
                    cabecalho = function(){
                    };
                    minimiza = function(){
                        i3GEO.janela.minimiza("i3geoCartoAnalise",200);
                    };
                    janela = i3GEO.janela.cria(
                            "320px",
                            "350px",
                            "",
                            "",
                            "",
                            "<span class='i3GeoTituloJanelaBsNolink' >" + $trad('analise',i3GEOF.metaestat.dicionario) + "</span></div>",
                            "i3geoCartoAnalise",
                            false,
                            "hd",
                            cabecalho,
                            minimiza,
                            "",
                            false,
                            "",
                            "",
                            "",
                            ""
                    );
                    janela = janela[0];
                    YAHOO.i3GEO.janela.manager.register(janela);
                    janela.render();
                }
                else{
                    janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoAnalise");
                }
                janela.show();
                imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
                janela.moveTo(imagemxy[0]+(i3GEOF.metaestat.LEFT*2)+i3GEOF.metaestat.LARGURA+10,i3GEOF.metaestat.TOP);
            },
            /**
             * Monta o HTML contendo os elementos DIV que receberao os principais componentes da ferramenta
             * Utilizado para criar a janela da ferramenta
             * @return HTML
             */
            html: function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.html()");
                var ins = Mustache.render(i3GEOF.metaestat.analise.MUSTACHE, i3GEOF.metaestat.analise.mustacheHash());
                return ins;
            },
            /**
             * Monta um combo contendo a lista de camadas originadas do sistema de metadados estatisticos
             * A lista de camadas e obtida com i3GEO.php.listaCamadasMetaestat()
             * O combo e utilizado para o usuario escolher qual a camada que sera alvo de determinado porcesso de analise
             * O combo e inserido no elemento DOM com ID i3geoCartoAnaliseCamadas
             */
            comboCamadas: function(){
                if(!$i("i3geoCartoAnaliseCamadas")){
                    return;
                }
                var temp = function(retorno){
                    var temas = retorno.data,
                    n = temas.length,
                    i,t,ins;
                    ins = "<p class=paragrafo style='position:relative;top:5px;'>Ativar a camada:</p><select id='i3geoCartoAnaliseCamadasCombo' onchange='i3GEOF.metaestat.comum.ativaCamada(this.value)' style='width:250px;' ><option value=''>---</option>";
                    for(i=0;i<n;i++){
                        t = i3GEO.arvoreDeCamadas.pegaTema(temas[i]);
                        if(t != ""){
                            ins += "<option value='"+temas[i]+"'>"+t.tema+"</option>";
                        }
                    }
                    $i("i3geoCartoAnaliseCamadas").innerHTML = ins+"</select>";
                    if(i3GEO.temaAtivo != ""){
                        $i("i3geoCartoAnaliseCamadasCombo").value = i3GEO.temaAtivo;
                    }
                    $i("i3geoCartoAnaliseCamadas").style.display = "block";
                    i3GEOF.metaestat.comum.aguarde("hidden");
                };
                i3GEO.php.listaCamadasMetaestat(temp);
            }
        },
        /**
         * Funcoes que controlam a janela de parametros
         * Os parametros permitem que o usuario modifique as opcoes default
         * aplicadas quando uma camada e adicionada ao mapa
         */
        classes:{
            /**
             * Inicia a ferramenta
             * Preenche os componetes da interface conforme o tipo definido em i3GEOF.metaestat.INTERFACE
             * Executa as funcoes que constroem os combos
             * Executa i3GEOF.metaestat.classes.abreJanela(); e i3GEOF.metaestat.classes.html();
             * @param ID do div que recebera os componentes da ferramenta
             */
            inicia: function(iddiv){
                if(!$i("i3geoCartoComboMedidasVariavel")){
                    i3GEO.janela.tempoMsg("erro: i3geoCartoComboMedidasVariavel???");
                    return;
                }
                if($i("i3geoCartoComboMedidasVariavel").value === ""){
                    i3GEO.janela.tempoMsg("erro: i3geoCartoComboMedidasVariavel???");
                    return;
                }
                if(!iddiv || !$i(iddiv)){
                    iddiv = "i3geoCartoClasses_corpo";
                }
                if(i3GEOF.metaestat.INTERFACE == "flutuante"){
                    i3GEOF.metaestat.classes.abreJanela();
                    $i(iddiv).innerHTML = i3GEOF.metaestat.classes.html();
                    i3GEOF.metaestat.classes.comboTipoRep();
                    i3GEOF.metaestat.classes.comboTipoClassificacao();
                    i3GEOF.metaestat.classes.comboRegiao();
                }
                if(i3GEOF.metaestat.INTERFACE == "flutuanteSimples"){
                    i3GEOF.metaestat.classes.abreJanela();
                    $i(iddiv).innerHTML = i3GEOF.metaestat.classes.html();
                    i3GEOF.metaestat.classes.comboTipoClassificacao();
                }
                if(i3GEOF.metaestat.INTERFACE == "inline"){
                    $i(iddiv).innerHTML = i3GEOF.metaestat.classes.html();
                    i3GEOF.metaestat.classes.comboTipoClassificacao();
                }
            },
            /**
             * Abre a janela flutuante da ferramenta
             */
            abreJanela: function(){
                var cabecalho,minimiza,janela;
                if (!$i("i3geoCartoClasses")){
                    cabecalho = function(){
                    };
                    minimiza = function(){
                    };
                    janela = i3GEO.janela.cria(
                            i3GEOF.metaestat.LARGURA+10+"px",
                            i3GEOF.metaestat.ALTURA - 50 +"px",
                            "",
                            "",
                            "",
                            "<span class='i3GeoTituloJanelaBsNolink' >" + $trad('classes',i3GEOF.metaestat.dicionario) + "</span></div>",
                            "i3geoCartoClasses",
                            true,
                            "hd",
                            cabecalho,
                            minimiza,
                            "",
                            false,
                            "",
                            "",
                            "",
                            ""
                    );
                    janela = janela[0];
                    YAHOO.i3GEO.janela.manager.register(janela);
                    janela.render();
                }
                else{
                    janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoClasses");
                }
                janela.show();
                i3GEOF.metaestat.classes.botaoAplicar();
            },
            /**
             * Ativa o botao que aplica e guarda os parametros escolhidos
             * O botao e o elemento com ID i3GEOcartoClassesBotaoAaplicar
             * A funcao a ser executada e i3GEOF.metaestat.classes.aplicar()
             */
            botaoAplicar: function(){
                YAHOO.i3GEO.janela.manager.find("i3geoCartoClasses").setFooter('<input type="button" id="i3GEOcartoClassesBotaoAaplicar" value="Aplicar" class="paragrafo" style="width:200px;cursor:pointer;color:blue" />');
                new YAHOO.widget.Button(
                        "i3GEOcartoClassesBotaoAaplicar",
                        {onclick:{fn: i3GEOF.metaestat.classes.aplicar}}
                );
                $i("i3GEOcartoClassesBotaoAaplicar-button").style.width = i3GEOF.metaestat.LARGURA - 15 + "px";
            },
            /**
             * Aplica os parametros
             * Os valores sao armazenados nas variaveis
             * i3GEOF.metaestat.comum.tipoRep
             * i3GEOF.metaestat.comum.tipoClassificacao
             * i3GEOF.metaestat.comum.tipoRegiao
             */
            aplicar: function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.classes.aplicar()");

                if($i("i3geoCartoComboTipoRep") && $i("i3geoCartoComboTipoRep").options){
                    i3GEOF.metaestat.comum.tipoRep = [$i("i3geoCartoComboTipoRep").value,$i("i3geoCartoComboTipoRep").options[$i("i3geoCartoComboTipoRep").selectedIndex].label];
                }
                else{
                    i3GEOF.metaestat.comum.tipoRep = [$i("i3geoCartoComboTipoRep").value,""];
                }
                i3GEOF.metaestat.comum.tipoClassificacao = [$i("i3geoCartoComboTipoClassificacao").value,$i("i3geoCartoComboTipoClassificacao").options[$i("i3geoCartoComboTipoClassificacao").selectedIndex].label];
                i3GEOF.metaestat.comum.tipoRegiao = [$i("i3geoCartoComboRegioesMedidasVariavel").value,$i("i3geoCartoComboRegioesMedidasVariavel").options[$i("i3geoCartoComboRegioesMedidasVariavel").selectedIndex].label];

                i3GEOF.metaestat.classes.destroiJanela();
            },
            /**
             * Zera os parametros escolhidos alterando as variaveis
             * i3GEOF.metaestat.comum.tipoRep
             * i3GEOF.metaestat.comum.tipoClassificacao
             * i3GEOF.metaestat.comum.tipoRegiao
             */
            zeraParametros: function(){
                i3GEOF.metaestat.comum.tipoRep = ["",""];
                i3GEOF.metaestat.comum.tipoClassificacao = ["",""];
                i3GEOF.metaestat.comum.tipoRegiao = ["",""];
            },
            /**
             * Destroi a janela com os parameros
             */
            destroiJanela: function(){
                var janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoClasses");
                if(janela){
                    janela.destroy();
                }
            },
            /**
             * Constroi o HtmL que recera os componentes da interface
             * Usado pela funcao que abre a janela flutuante
             * @return HTML
             */
            html: function(){
                var ins = '<div id="i3geoCartoClassesContainer" style="margin-left:5px;">' +
                '<div class="paragrafo" id="i3geoCartoTipoRep" >' +
                '</div>' +
                '<div class="paragrafo" id="i3geoCartoTipoClassificacao" >' +
                '</div>' +
                '<div class="paragrafo" id="i3geoCartoRegioesMedidasVariavel" >' +
                '</div>' +
                '</div>';
                return ins;
            },
            /**
             * Monta o combo com as opcoes de tipo de representacao
             * @return HTML
             */
            comboTipoRep: function(){
                var onde = $i("i3geoCartoTipoRep"),
                ins,i,
                dados = [
                    {"codigo":"polygon","nome":"pol&iacute;gonos"},
                    {"codigo":"point","nome":"pontos"}
                    ],
                    n = dados.length;
                ins = '' +
                '<h5>'+$trad('tipoRepresentaDados',i3GEOF.metaestat.dicionario)+'</h5>' +
                //"<div class=styled-select style='"+(i3GEOF.metaestat.LARGURA - 30)+"px;'>" +
                "<select class='form-control' id='i3geoCartoComboTipoRep' onchange=''>";
                for(i=0;i<n;i++){
                    ins += "<option value='"+dados[i].codigo+"'>"+dados[i].nome+"</option>";
                }
                ins += "</select></div>";
                if(onde){
                    onde.innerHTML = ins;
                    //i3GEOF.metaestat.classes.botaoAdicionarCamada();
                }
                return ins;
            },
            /**
             * Monta o combo com as opcoes de tipo de classificacao
             * Obtem a lista de i3GEO.php.listaClassificacaoMedida()
             * @retrun HTML
             */
            comboTipoClassificacao: function(){
                var onde = $i("i3geoCartoTipoClassificacao"),
                combo = $i("i3geoCartoComboMedidasVariavel"),
                temp = function(dados){
                    var n = dados.length,
                    ins = '<h5>'+$trad('selecionaTipoClassificacao',i3GEOF.metaestat.dicionario)+'</h5>',
                    i;
                    ins += "<div style='width: 100%;' class='input-group'>";
                    ins += "<select class='form-control' id='i3geoCartoComboTipoClassificacao' onchange='i3GEOF.metaestat.classes.comboTipoClassificacaoOnchange(this)'>";
                    for(i=0;i<n;i++){
                        ins += "<option title='"+dados[i].observacao+"' value='"+dados[i].id_classificacao+"'>"+dados[i].nome+"</option>";
                    }
                    ins += "</select><b class='caret careti'></b></div>";
                    //{"id_classificacao":"1","nome":"Pela media","id_medida_variavel":"1","observacao":""}
                    if(onde){
                        onde.innerHTML = ins;
                    }
                    i3GEOF.metaestat.comum.aguarde("hidden");
                    return ins;
                };
                if(combo.value != ""){
                    i3GEOF.metaestat.comum.aguarde();
                    i3GEO.php.listaClassificacaoMedida(combo.value,temp);
                }
                else{
                    onde.innerHTML = "";
                }
            },
            comboTipoClassificacaoOnchange: function(){

            },
            /**
             * Monta o combo com as opcoes de tipo de regiao
             * Obtem a lista de i3GEO.php.listaRegioesMedidaVariavel()
             * @retrun HTML
             */
            comboRegiao: function(id_medida_variavel){
                i3GEOF.metaestat.comum.aguarde();
                var onde = $i("i3geoCartoRegioesMedidasVariavel"),
                combo = $i("i3geoCartoComboMedidasVariavel"),
                temp = function(dados){
                    var n = dados.length,
                    ins = '<h5>'+$trad('selecionaTipoLimiteGeog',i3GEOF.metaestat.dicionario)+'</h5>',
                    i;
                    ins += "<div style='width: 100%;' class='input-group'>";
                    ins += "<select class='form-control' id='i3geoCartoComboRegioesMedidasVariavel' >";
                    for(i=0;i<n;i++){
                        ins += "<option title='"+dados[i].observacao+"' value='"+dados[i].codigo_tipo_regiao+"'>"+dados[i].nome_tipo_regiao+"</option>";
                    }
                    ins += "</select><b class='caret careti'></b></div>";
                    if(onde){
                        onde.innerHTML = ins;
                    }
                    i3GEOF.metaestat.comum.aguarde("hidden");
                    return ins;
                };
                if(combo.value != ""){
                    i3GEOF.metaestat.comum.aguarde();
                    i3GEO.php.listaRegioesMedidaVariavel(combo.value,temp);
                }
            }
        },
        /**
         * Funcoes de uso comum das demais funcoes
         */
        comum:{
            CONTADORAGUARDE: 0,
            /**
             * Faz a carga do dicionario de traducao e na sequencia inicia a ferramenta com i3GEOF.metaestat.principal.inicia()
             */
            iniciaDicionario: function(iddiv,largura, altura, topo, esquerda){
                if(typeof(i3GEOF.metaestat.dicionario) === 'undefined'){
                    var temp = function(){
                        i3GEOF.metaestat.principal.inicia(iddiv,largura, altura, topo, esquerda);
                    };
                    i3GEO.util.scriptTag(
                            i3GEO.configura.locaplic+"/ferramentas/metaestat/dicionario.js",
                            temp,
                            "i3GEOF.metaestat.dicionario_script"
                    );
                }
                else{
                    i3GEOF.metaestat.principal.inicia(iddiv,largura, altura, topo, esquerda);
                }
            },
            /**
             * Aplica ao mapa o status de ligado/desligado de cada camada
             * O status das camadas e mantido em i3GEOF.metaestat.CAMADAS
             * Utiliza a funcao i3GEO.arvoreDeCamadas.ligaDesligaTemas
             */
            desligaCamadas: function(){
                if(i3GEOF.metaestat.CAMADAS.length > 0){
                    i3GEO.arvoreDeCamadas.ligaDesligaTemas(i3GEOF.metaestat.CAMADAS.join(","),false);
                }
            },
            /**
             * Armazena o tipo de representacao que o usuario escolheu pela ultima vez
             * O tipo de representacao corresponde ao tipo de geometria que sera utilizada para desenhar os componentes da camada
             * E definida pelo onchange do combo criado por i3GEOF.metaestat.classes.comboTipoRep();
             * Armazena o valor de [value,texto]
             */
            tipoRep: [],
            /**
             * Armazena o tipo de regiao que o usuario escolheu pela ultima vez
             * O tipo de regiao corresponde ao tipo de limite geografico utilizado para desenhar a camada a ser escolhida
             * E definida pelo onchange do combo criado por i3GEOF.metaestat.classes.comboRegiao();
             * Armazena o valor de [value,texto]
             */
            tipoRegiao: [],
            /**
             * Armazena o tipo de classificacao que o usuario escolheu pela ultima vez
             * E definida pelo onchange do combo criado por i3GEOF.metaestat.classes.comboTipoClassificacao();
             * A classificacao define os intervalos de classe e simbologia utilizadas pela camada
             * Armazena o valor de [value,texto]
             */
            tipoClassificacao: [],
            /**
             * Adiciona uma nova camada ao mapa conforme as opcoes escolhidas pelo usuario
             * O usuario deve ter escolhido antes a variavel, medida e demais parametros
             * Os parametros sao obtidos dos componentes de formulario ou variaveis ja definidas em
             * funcao das escolhas feitas pelo usuario
             * Ao executar, primeiro cria um mapfile temporario com i3GEO.php.mapfileMedidaVariavel() e
             * depois adiciona com i3GEO.php.adtema()
             * Atualiza o combo da janela de analise com i3GEOF.metaestat.analise.comboCamadas();
             */
            adicionaCamada: function(botao){
        	i3GEOF.metaestat.comum.aguarde("visible");
        	if(botao){
                    $(botao).prop("disabled",true);

                }
                i3GEOF.metaestat.log("i3GEOF.metaestat.comum.adicionaCamada()");
                //function mapfileMedidaVariavel($id_medida_variavel,$filtro="",$todasascolunas = 0,$tipolayer="polygon",$titulolayer="",$id_classificacao="",$agruparpor=""){
                var v = i3GEOF.metaestat.comum.verificaParametros(),
                temp = function(retorno){
                    if(i3GEO.arvoreDeCamadas.pegaTema(retorno.layer) == ""){
                        i3GEOF.metaestat.comum.desligaCamadas();
                        var atualiza = function(){
                            i3GEOF.metaestat.comum.aguarde("hidden");
                            i3GEO.atualiza();
                            if(botao){
                                $(botao).removeAttr('disabled');
                            }
                            i3GEOF.metaestat.CAMADAS.push(retorno.layer);
                            i3GEO.mapa.ativaTema(retorno.layer);
                            i3GEOF.metaestat.analise.comboCamadas();
                        };
                        i3GEOF.metaestat.comum.aguarde();
                        i3GEO.php.adtema(atualiza,retorno.mapfile);
                    }
                };
                if(v != true){
                    i3GEOF.metaestat.comum.aguarde("hidden");
                    i3GEO.janela.tempoMsg("erro: "+v);
                    return;
                }
                //e necessario obter os parametros nessa interface
                if(i3GEOF.metaestat.INTERFACE == "flutuanteSimples"){
                    i3GEOF.metaestat.classes.aplicar();
                }
                if(i3GEOF.metaestat.INTERFACE == "inline"){
                    i3GEOF.metaestat.classes.aplicar();
                }
                if(i3GEO.Interface.ATUAL === "googlemaps"){
                    opacidade = 70;
                }
                else{
                    opacidade = "";
                }
                i3GEO.php.mapfileMedidaVariavel(
                        temp,
                        $i("i3geoCartoComboMedidasVariavel").value,
                        i3GEOF.metaestat.comum.defineFiltro(),
                        0,
                        i3GEOF.metaestat.comum.tipoRep[0],
                        i3GEOF.metaestat.comum.defineTitulo(),
                        i3GEOF.metaestat.comum.tipoClassificacao[0],
                        i3GEOF.metaestat.comum.defineAgruparPor(),
                        i3GEOF.metaestat.comum.tipoRegiao[0],
                        opacidade
                );
            },
            /**
             * Mostra no mapa uma camada escolhida
             * E usado quando uma nova camada e adicionada ao mapa
             * Primeiro todas as camadas guardadas em i3GEOF.metaestat.CAMADAS sao desligadas
             * @param identificador da camada que sera ligada. Correpsonde ao item "name" do mapfile atual do mapa
             */
            ativaCamada: function(camada){
                i3GEOF.metaestat.log("i3GEOF.metaestat.comum.ativaCamada()");
                if(i3GEOF.metaestat.CAMADAS.length > 0){
                    i3GEO.arvoreDeCamadas.ligaDesligaTemas(i3GEOF.metaestat.CAMADAS.join(","),false);
                    i3GEO.arvoreDeCamadas.ligaDesligaTemas(camada,true);
                    i3GEO.mapa.ativaTema(camada);
                }
            },
            /**
             * Avalia os parametros escolhidos pelo usuario e define qual sera o titulo da camada escolhida
             * E usado quando uma camada e adicionada ao mapa
             * @return string
             */
            defineTitulo: function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.comum.defineTitulo()");
                //se nao tiver parametros, filtro e vazio
                if(i3GEOF.metaestat.parametros.dados.length == 0){
                    return "";
                }
                //deixa vazio para que o titulo seja definido pelo PHP que monta o mapfile
                if(i3GEOF.metaestat.comum.tipoRep[0] == ""){
                    return "";
                }
                var i,n,c,titulo="",
                t=[],
                dados = i3GEOF.metaestat.parametros.dados;
                if($i("i3geoCartoComboVariavel") && $i("i3geoCartoComboVariavel").options){
                    titulo = $i("i3geoCartoComboVariavel").options[$i("i3geoCartoComboVariavel").selectedIndex].label +" - ";
                } else {
                    titulo = i3GEOF.metaestat.parametros.dados[0].nomemedida;
                }
                if($i("i3geoCartoComboRegioesMedidasVariavel")){
                    t.push($i("i3geoCartoComboRegioesMedidasVariavel").options[$i("i3geoCartoComboRegioesMedidasVariavel").selectedIndex].label);
                } else {
                    t.push(i3GEOF.metaestat.comum.tipoRegiao[1]);
                }
                if($i("i3geoCartoComboTipoClassificacao")){
                    t.push($i("i3geoCartoComboTipoClassificacao").options[$i("i3geoCartoComboTipoClassificacao").selectedIndex].label);
                } else {
                    t.push(i3GEOF.metaestat.comum.tipoClassificacao[1]);
                }
                if(i3GEOF.metaestat.comum.tipoRep && i3GEOF.metaestat.comum.tipoRep[1] != ""){
                    t.push(i3GEOF.metaestat.comum.tipoRep[1]);
                }
                dados = $i("i3geoCartoParametrosMedidasVariavel").getElementsByTagName("input");
                n = dados.length;
                for(i=0;i<n;i++){
                    if(dados[i].checked){
                        t.push(dados[i].value);
                    }
                }
                if(t.length > 0){
                    return titulo +" (" + t.join("/") + ")";
                }
                else{
                    return titulo;
                }
            },
            /**
             * Avalia os parametros escolhidos pelo usuario e define qual sera o filtro para a camada escolhida
             * E usado quando uma camada e adicionada ao mapa
             * @return string
             */
            defineFiltro: function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.comum.defineFiltro()");
                //se nao tiver parametros, filtro e vazio
                if(i3GEOF.metaestat.parametros.dados.length == 0){
                    return "";
                }
                //se tiver parametro e todos estiverem vazios, aborta
                var i,n,c,val,
                t=[],
                dados = i3GEOF.metaestat.parametros.dados;
                n = dados.length;
                for(i=0;i<n;i++){
                    c = $i("comboparametro_"+dados[i].id_parametro_medida+"_"+dados[i].id_pai);
                    if(c){
                        if(c.value != "" && i3GEOF.metaestat.MULTIPARAMETROS === false){
                            //t.push(dados[i].coluna+'="'+c.value+'"');
                            t.push(dados[i].coluna+'*"'+c.value+'"');
                        }
                        else{
                            val = i3GEO.util.valoresCheckCombo(c.id);
                            if(val.length > 0){
                                //t.push(dados[i].coluna+' IN ("'+val.join('","')+'")');
                                t.push(dados[i].coluna+' * "'+val.join('","')+'"');
                            }
                        }
                    }
                }
                if(t.length > 0){
                    return t.join("|");
                }
                else{
                    return "";
                }
            },
            /**
             * Avalia os parametros escolhidos pelo usuario e define qual o nivel de agregacao dos dados para a camada escolhida
             * E usado quando uma camada e adicionada ao mapa
             * @return string
             */
            defineAgruparPor: function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.comum.defineAgruparPor()");
                //se nao tiver parametros, filtro e vazio
                if(i3GEOF.metaestat.parametros.dados.length == 0){
                    return "";
                }
                //se tiver parametro e todos estiverem vazios, aborta
                var i,n,c,
                t=[],
                dados = i3GEOF.metaestat.parametros.dados;
                n = dados.length;
                for(i=0;i<n;i++){
                    c = $i("comboparametro_"+dados[i].id_parametro_medida+"_"+dados[i].id_pai);
                    if(c && c.value != ""){
                        t.push(dados[i].coluna);
                    }
                }
                if(t.length > 0){
                    return t.join(",");
                }
                else{
                    return "";
                }
            },
            /**
             * Verifica se os parametros obrigatorios foram escolhidos
             * Utilizado quando uma nova camada e adicionada ao mapa
             */
            verificaParametros: function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.comum.verificaParametros()");
                var ok = true,
                combos = ["i3geoCartoComboMedidasVariavel"],
                n = combos.length,
                i,temp;
                for(i=0;i<n;i++){
                    temp = $i(combos[i]);
                    if(!temp){
                        return combos[i];
                    }
                    if(temp.value == ""){
                        return combos[i];
                    }
                }
                return ok;
            },
            /**
             * Torna visivel/invisivel a imagem com o sinal de aguarde
             * @param objeto DOM que contem a imagem
             * @return objeto DOM com a imagem caso nao exista
             */
            aguarde: function(v){
                var cont = i3GEOF.metaestat.comum.CONTADORAGUARDE;
                var a = $i("i3geoCartoParametros_imagemCabecalho");
                if(!a){
                    return;
                }
                if(!v){
                    v = "visible";
                }
                //acrescenta um no contador
                if(v == "visible"){
                    cont = cont + 1;
                    a.style.visibility = "visible";
                } else {
                    cont = cont - 1;
                }
                if(cont <= 0){
                    a.style.visibility = "hidden";
                }
            }
        },
        /**
         * Funcoes que controlam o ajudante de edicao do cadastro de variaveis
         */
        editor: {
            /**
             * Inicia o editor carregando as dependencias de javascript necessarias
             * Como as dependencias sao carregadas em paralelo, a carga e definida em funcoes em cascata
             * Carrega ferramentas/metaestat/dicionario1.js
             * Executa i3GEOF.metaestat.editor.dependenciasjs0()
             */
            inicia: function(){
                YAHOO.namespace("admin.container");
                if(typeof(i3GEOF.metaestat.dicionario1) === 'undefined'){
                    i3GEO.util.scriptTag(
                            i3GEO.configura.locaplic+"/ferramentas/metaestat/dicionario1.js",
                            "i3GEOF.metaestat.editor.dependenciasjs0()",
                            "i3GEOF.metaestat.dicionario1_script"
                    );
                }
                else{
                    i3GEOF.metaestat.editor.dependenciasjs0();
                }
            },
            /**
             * Carrega os javascripts do sistema de administracao do i3Geo e que tbm sao usados aqui
             * Carrega admin/js/core.js
             * Executa i3GEOF.metaestat.editor.dependenciasjs1()
             */
            dependenciasjs0: function(){
                i3GEO.util.scriptTag(
                        i3GEO.configura.locaplic+"/admin/js/core.js",
                        "i3GEOF.metaestat.editor.dependenciasjs1()",
                        "i3GEOF.metaestat.dependenciasjs0_script"
                );
            },
            /**
             * Carrega os javascripts do sistema de administracao do i3Geo e que tbm sao usados aqui
             * Carrega admin/js/estat_variavel.js
             * Executa i3GEOF.metaestat.editor.ativa()
             */
            dependenciasjs1: function(){
                i3GEO.util.scriptTag(
                        i3GEO.configura.locaplic+"/admin/js/estat_variavel.js",
                        "i3GEOF.metaestat.editor.ativa()",
                        "i3GEOF.metaestat.dependenciasjs1_script"
                );
            },
            /**
             * Inicia a ferramenta
             * Verifica se o usuario esta logado
             * Se estiver, chama a funcao para montagem da interface
             * Executa i3GEOF.metaestat.editor.t0();
             */
            ativa: function(iddiv){
                var loginok = function(){
                    i3GEOadmin.variaveis.inicia();
                    if(!iddiv){
                        iddiv = "i3geoCartoEditor_corpo";
                    }
                    if(i3GEOF.metaestat.INTERFACE == "flutuante"){
                        i3GEOF.metaestat.editor.abreJanela();
                    }
                    $i(iddiv).innerHTML = i3GEOF.metaestat.editor.html();
                    i3GEOF.metaestat.editor.t0();
                },
                loginNok = function(){
                    i3GEO.janela.tempoMsg("Voc&ecirc; precisa fazer login para usar essa op&ccedil;&atilde;o");
                    i3GEO.login.dialogo.abreLogin();
                };
                //verifica login
                i3GEO.login.verificaOperacao("admin/metaestat/geral",i3GEO.configura.locaplic, loginok, "sessao",loginNok);
            },
            /**
             * Funcao que abre a janela flutuante se i3GEOF.metaestat.INTERFACE == "flutuante"
             */
            abreJanela: function(){
                var cabecalho,minimiza,imagemxy,janela;
                if (!$i("i3geoCartoEditor")){
                    cabecalho = function(){};
                    minimiza = function(){
                        i3GEO.janela.minimiza("i3geoCartoEditor");
                    };
                    janela = i3GEO.janela.cria(
                            "400px",
                            "320px",
                            "",
                            "",
                            "",
                            "</div><div class='i3GeoTituloJanelaBs'>" + $trad('ajudanteEditor',i3GEOF.metaestat.dicionario1) + "</div>",
                            "i3geoCartoEditor",
                            false,
                            "hd",
                            cabecalho,
                            minimiza,
                            "",
                            false
                    );
                    janela = janela[0];
                    YAHOO.i3GEO.janela.manager.register(janela);
                    janela.render();
                }
                else{
                    janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoEditor");
                }
                janela.show();
                imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
                janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT+i3GEOF.metaestat.LARGURA+20,i3GEOF.metaestat.TOP+20);
            },
            /**
             * Retorna o HTML com os elementos DIV, com id i3GEOFmetaestatEditor, onde os conteudos da interface serao inseridos
             * @return HTML
             */
            html: function(){
                var ins = '';
                ins +=  '<div style="background-color:#F2F2F2;top:0px;left:0px;display:block;width:98%;margin-left:5px;" id="i3GEOFmetaestatEditor" >';
                ins +=  '</div>';
                return ins;
            },
            /**
             * Abre o formulario para criacao de uma variavel
             */
            criaVariavel: function(){
                i3GEOadmin.variaveis.aposGravar = function(){
                    core_carregando("desativa");
                    //refaz o conteudo para mostrar a nova adicao
                    i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t1");
                    // Enome e o id do input onde o usuario escolheu o nome da nova variavel
                    i3GEOF.metaestat.editor.t1(true,$i("Enome").value);
                    i3GEOF.metaestat.principal.inicia();
                };
                i3GEOadmin.variaveis.editar("variavel","");
            },
            /**
             * Abre o formulario para edicao de uma variavel
             */
            editaVariavel: function(){
                i3GEOadmin.variaveis.aposGravar = function(){
                    core_carregando("desativa");
                    //refaz o conteudo para mostrar a nova adicao
                    i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t1");
                    // Enome e o id do input onde o usuario escolheu o nome da nova variavel
                    i3GEOF.metaestat.editor.t1(true,$i("Enome").value);
                    i3GEOF.metaestat.principal.inicia();
                };
                var codigo_variavel = $i("i3geoCartoComboVariavelEditor").value;
                if(codigo_variavel !== ""){
                    i3GEOadmin.variaveis.editar("variavel",codigo_variavel);
                }
            },
            /**
             * Abre o formulario para criacao de uma medida de variavel
             * Os valores default sao definidos em i3GEOF.metaestat.inicia
             */
            criaMedidaVariavel: function(){
                i3GEOadmin.variaveis.aposGravar = function(){
                    core_carregando("desativa");
                    //refaz o conteudo para mostrar a nova adicao
                    i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t2");
                    // Enomemedida e o id do input onde o usuario escolheu o nome da nova variavel
                    i3GEOF.metaestat.editor.t2(true,$i("Enomemedida").value);
                    i3GEOF.metaestat.principal.inicia();
                };
                i3GEOadmin.variaveis.editar("medidaVariavel","");
                //insere uma opcao para ativar as opcoes adicionais que sao usadas quando o usuario quer
                //usar dados ja existentes em um banco de dados
                var temp,botoesdiv = $i("okcancel_checkbox"),
                btn = document.createElement("div"),
                oclick = '$i(\"editorMedidaDefault\").style.display = \"block\";$i(\"Eesquemadb\").style.display = \"block\";$i(\"Etabela\").style.display = \"block\";';
                btn.innerHTML = "<br><input type=checkbox style='position:relative;top:3px;cursor:pointer;' onclick='javascript:"+oclick+"'/> Quero usar uma tabela j&aacute; existente ou alterar os par&acirc;metros adicionais";
                botoesdiv.appendChild(btn);

                $i("editorMedidaDefault").style.display = "none";
                $i("Eesquemadb").style.display = "none";
                $i("Etabela").style.display = "none";

                //passa o codigo da variavel
                $i("Ecodigo_variavel").value = $i("i3geoCartoComboVariavelEditor").value;
                //define os valores que sao padrao
                //a conexao e com o default
                $i("Ecodigo_estat_conexao").value = i3GEOF.metaestat.CONEXAODEFAULT;
                $i("Ecodigo_estat_conexao").style.width = "90%";
                //o esquema e o public
                $i("Eesquemadb").value = "i3geo_metaestat";
                //a tabela onde ficarao os dados
                $i("Etabela").value = "dados_medidas";
                //coluna com os valores
                $i("Ecolunavalor").value = "valor_num";
                //id que liga com o geo
                $i("Ecolunaidgeo").value = "codigoregiao";
                //id unico
                $i("Ecolunaidunico").value = "gid";
                //unidade de medida
                $i("Ecodigo_unidade_medida").value = 1;
                $i("Ecodigo_unidade_medida").style.width = "90%";
                //periodo
                temp = $i("Ecodigo_tipo_periodo");
                temp.value = 0;
                temp.style.width = "90%";
                //mostra os campos para definir os parametros de tempo
                temp.onchange = function(){
                    $i("EparametrosTempo").style.display = "block";
                    if($i("editorMedidaDefault").style.display == "block"){
                        i3GEO.janela.tempoMsg("Especifique as colunas que cont&eacute;m os dados temporais no final do formul&aacute;rio");
                    }
                    if($i("EparametrosTempo").value == ""){
                        $i("EcolunaAno").value = "";
                        $i("EcolunaMes").value = "";
                        $i("EcolunaDia").value = "";
                        $i("EcolunaHora").value = "";
                    }
                };
                //impede a alteracao do filtro
                $i("Efiltro").disabled = "disabled";
                //altera a tabela quando escolher
                $i("Ecodigo_tipo_regiao").style.width = "90%";

            },
            /**
             * Abre o formulario para edicao de uma medida de variavel
             */
            editaMedidaVariavel: function(){
                i3GEOadmin.variaveis.aposGravar = function(){
                    core_carregando("desativa");
                    //refaz o conteudo para mostrar a nova adicao
                    i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t2");
                    // Enome e o id do input onde o usuario escolheu o nome da nova variavel
                    i3GEOF.metaestat.editor.t2(true,$i("Enomemedida").value);
                    i3GEOF.metaestat.principal.inicia();
                };
                var id_medida_variavel = $i("i3geoCartoComboMedidaVariavelEditor").value;
                if(id_medida_variavel !== ""){
                    i3GEOadmin.variaveis.editar("medidaVariavel",id_medida_variavel);
                }
            },
            /**
             * Abre o formulario para criacao de uma classificacao
             */
            criaClassificacao: function(){
                i3GEOadmin.variaveis.aposGravar = function(){
                    core_carregando("desativa");
                    //refaz o conteudo para mostrar a nova adicao
                    i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3");
                    // Enome e o id do input onde o usuario escolheu o nome da nova variavel
                    i3GEOF.metaestat.editor.t3(true,$i("Enome").value);
                };
                i3GEOadmin.variaveis.editar("classificacaoMedida","");
                $i("Eid_medida_variavel").value = $i("i3geoCartoComboMedidaVariavelEditor").value;
            },
            /**
             * Abre o formulario para edicao de uma classificacao
             */
            editaClassificacao: function(){
                i3GEOadmin.variaveis.aposGravar = function(){
                    core_carregando("desativa");
                    //refaz o conteudo para mostrar a nova adicao
                    i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3");
                    // Enome e o id do input onde o usuario escolheu o nome da nova variavel
                    i3GEOF.metaestat.editor.t3(true,$i("Enome").value);
                };
                var id_classificacao = $i("i3geoCartoComboClassificacoesEditor").value;
                if(id_classificacao !== ""){
                    i3GEOadmin.variaveis.editar("classificacaoMedida",id_classificacao);
                }
            },
            /**
             * Remove um elemento do DOM
             * @param id do elemento que sera removido
             */
            removeEl:function(id){
                var no = $i(id);
                if(no){
                    no.parentNode.removeChild(no);
                }
            },
            /**
             * Define a selecao ativa de um combo com base no texto
             * @param id do combo
             * @param texto valor do texto
             */
            selComboPorTexto: function(idcombo,texto){
                var c = $i(idcombo),n,i;
                if(c){
                    n = c.options.length;
                    for(i=0;i<n;i++){
                        if(c.options[i].label === texto){
                            c.options[i].selected = true;
                            return;
                        }
                    }
                }
            },
            /**
             * Obtem um parametro da medida variavel escolhida. Os parametros sao obtidos da chamada em ajax que pega a lista de medidas de uma variavel
             * @param nome do parametro
             */
            dadoMedidaSelecionada: function(parametro){
                var c = $i("i3geoCartoComboMedidaVariavelEditor"),n,i;
                if(c){
                    n = c.options.length;
                    for(i=0;i<n;i++){
                        if(c.options[i].selected === true){
                            if(i3GEOF.metaestat.DADOSMEDIDASVARIAVEL[i-1]){
                                return i3GEOF.metaestat.DADOSMEDIDASVARIAVEL[i-1][parametro];
                            }
                            else{
                                return "";
                            }
                        }
                    }
                }
                else{
                    return "";
                }
            },
            /**
             * Funcao executada quando o usuario escolhe uma variavel
             * Define a variavel i3GEOF.metaestat.CODIGO_VARIAVEL
             */
            comboVariaveisOnchange: function(){
                i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t2");
                i3GEOF.metaestat.CODIGO_VARIAVEL = $i("i3geoCartoComboVariavelEditor").value;
            },
            /**
             * Funcao executada quando o usuario escolhe uma medida de variavel
             * Define a variavel i3GEOF.metaestat.ID_MEDIDA_VARIAVEL
             */
            comboMedidaVariavelOnchange: function(combo){
                i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3");
                i3GEOF.metaestat.ID_MEDIDA_VARIAVEL = $i("i3geoCartoComboMedidaVariavelEditor").value;
            },
            /**
             * Ativa o botao de upload
             * Ao ser clicado, abre uma janela flutuante com as opcoes de download
             * @param id do elemento DOM utilizado para compor o botao
             */
            botaoUpload: function(id){
                new YAHOO.widget.Button(
                        id,
                        {onclick:{fn: function(){
                            var cabecalho,minimiza,janela;
                            if (!$i("i3geoCartoUpload")){
                                cabecalho = function(){
                                };
                                minimiza = function(){
                                    i3GEO.janela.minimiza("i3geoCartoUpload");
                                };
                                janela = i3GEO.janela.cria(
                                        "500px",
                                        "450px",
                                        i3GEO.configura.locaplic+"/ferramentas/metaestat/upload.html",//abre em um iframe
                                        "",
                                        "",
                                        "</div><div class='i3GeoTituloJanelaBs'>Upload</div>",
                                        "i3geoCartoUpload",
                                        false,
                                        "hd",
                                        cabecalho,
                                        minimiza
                                );
                                janela = janela[0];
                                YAHOO.i3GEO.janela.manager.register(janela);
                                janela.render();
                            }
                            else{
                                janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoUpload");
                            }
                            janela.show();
                        }}}
                );
            },
            /**
             * Abertura do ajudante
             * Primeira tela da ferramenta
             * Oferece opcoes na forma de botoes e um botao do tipo "continua"
             * O botao de id i3GEOFmetaestatEditorBotaot01 abre o editor de variaveis do sistema de administracao
             * O botao de id i3GEOFmetaestatEditorBotaot02 abre o editor de limites geograficos
             * O botao de id i3GEOFmetaestatEditorBotaot03 abre a interface para upload de um arquivo CSV
             * Na sequencia, executa i3GEOF.metaestat.editor.t1()
             *
             **/
            t0: function(){
                var ins = "<p class='paragrafo' >" + $trad('descricaoAjudanteEditor',i3GEOF.metaestat.dicionario1) +
                "<br><br><p><input id=i3GEOFmetaestatEditorBotaot01 type='button' value='"+$trad('editorAvancado',i3GEOF.metaestat.dicionario1)+"' />" +
                "&nbsp<input id=i3GEOFmetaestatEditorBotaot02 type='button' value='"+$trad('editorLimites',i3GEOF.metaestat.dicionario1)+"' />" +
                "&nbsp<input id=i3GEOFmetaestatEditorBotaotUp type='button' value='Gerenciador BD/Upload' />";
                i3GEO.util.proximoAnterior("","i3GEOF.metaestat.editor.t1()",ins,"i3GEOF.metaestat.editor.t0","i3GEOFmetaestatEditor");
                new YAHOO.widget.Button(
                        "i3GEOFmetaestatEditorBotaot01",
                        {onclick:{fn: function(){window.open(i3GEO.configura.locaplic+"/admin/html/estat_variavel.html");}}}
                );
                new YAHOO.widget.Button(
                        "i3GEOFmetaestatEditorBotaot02",
                        {onclick:{fn: function(){
                            i3GEO.janela.tempoMsg($trad('msgEditorLimites',i3GEOF.metaestat.dicionario1));
                            window.open(i3GEO.configura.locaplic+"/ferramentas/metaestat/editorlimites.php");
                        }}}
                );
                new YAHOO.widget.Button(
                        "i3GEOFmetaestatEditorBotaotUp",
                        {onclick:{fn: function(){
                            i3GEO.janela.tempoMsg($trad('msgEditorLimites',i3GEOF.metaestat.dicionario1));
                            window.open(i3GEO.configura.locaplic+"/admin/html/estat_editor.html");
                        }}}
                );
                //i3GEOF.metaestat.editor.botaoUpload("i3GEOFmetaestatEditorBotaot03");
            },
            /**
             * Opcoes para escolha ou edicao/criacao de uma variavel
             * Feita a escolha e definida a variavel i3GEOF.metaestat.CODIGO_VARIAVEL
             * Na sequencia executa i3GEOF.metaestat.editor.t1()
             */
            t1: function(remove,textoSelecionado){
                if(remove == true){
                    //remove o conteudo anteriormente construido
                    i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t1");
                }
                var temp = function(dados){
                    var ins = "<p class='paragrafo' >" + $trad('selecionaVariavel',i3GEOF.metaestat.dicionario) + "<br><br>" +
                    "<span>" + i3GEOF.metaestat.principal.comboVariaveis(dados,"i3geoCartoComboVariavelEditor","i3GEOF.metaestat.editor.comboVariaveisOnchange(this)","","nao") + "</span>" +
                    "<br><br><p><input id=i3GEOFmetaestatEditorBotao3 type='button' value='"+$trad('edite',i3GEOF.metaestat.dicionario1)+"' />" +
                    "&nbsp;<input id=i3GEOFmetaestatEditorBotao3a type='button' value='"+$trad('criaNova',i3GEOF.metaestat.dicionario1)+"' /><br>";
                    i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t0()","i3GEOF.metaestat.editor.t2()",ins,"i3GEOF.metaestat.editor.t1","i3GEOFmetaestatEditor",true);
                    new YAHOO.widget.Button(
                            "i3GEOFmetaestatEditorBotao3",
                            {onclick:{fn: i3GEOF.metaestat.editor.editaVariavel}}
                    );
                    $i("i3GEOFmetaestatEditorBotao3-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
                    new YAHOO.widget.Button(
                            "i3GEOFmetaestatEditorBotao3a",
                            {onclick:{fn: i3GEOF.metaestat.editor.criaVariavel}}
                    );
                    $i("i3GEOFmetaestatEditorBotao3a-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
                    if(textoSelecionado){
                        i3GEOF.metaestat.editor.selComboPorTexto("i3geoCartoComboVariavelEditor",textoSelecionado);
                        i3GEOF.metaestat.CODIGO_VARIAVEL = $i("i3geoCartoComboVariavelEditor").value;
                    }
                };
                i3GEO.php.listaVariavel(temp);
            },
            /**
             * Opcoes para escolha ou edicao/criacao de uma medida
             * Feita a escolha e definida a variavel i3GEOF.metaestat.ID_MEDIDA_VARIAVEL
             * Na sequencia executa i3GEOF.metaestat.editor.t3a()
             */
            t2: function(remove,textoSelecionado){
                if(remove == true){
                    //remove o conteudo anteriormente construido
                    i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t2");
                }
                if($i("i3geoCartoComboVariavelEditor").value === ""){
                    i3GEO.janela.tempoMsg($trad('msgSelecionaVariavel',i3GEOF.metaestat.dicionario));
                    i3GEOF.metaestat.editor.t1(false);
                }
                else{
                    var temp = function(dados){
                        var ins = "<p class='paragrafo' >" + $trad('selecionaMedidaVariavel',i3GEOF.metaestat.dicionario) + "<br><br>" +
                        "<span>" + i3GEOF.metaestat.principal.comboMedidasVariavel(dados,"i3geoCartoComboMedidaVariavelEditor","i3GEOF.metaestat.editor.comboMedidaVariavelOnchange(this)","","","nao") + "</span>" +
                        "<br><br><p><input id=i3GEOFmetaestatEditorBotao4 type='button' value='"+$trad('edite',i3GEOF.metaestat.dicionario1)+"' />" +
                        "&nbsp;<input id=i3GEOFmetaestatEditorBotao4a type='button' value='"+$trad('criaNova',i3GEOF.metaestat.dicionario1)+"' /><br>";
                        i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t1()","i3GEOF.metaestat.editor.t3a()",ins,"i3GEOF.metaestat.editor.t2","i3GEOFmetaestatEditor",true);
                        //edita existente
                        new YAHOO.widget.Button(
                                "i3GEOFmetaestatEditorBotao4",
                                {onclick:{fn: i3GEOF.metaestat.editor.editaMedidaVariavel}}
                        );
                        $i("i3GEOFmetaestatEditorBotao4-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
                        //cria nova
                        new YAHOO.widget.Button(
                                "i3GEOFmetaestatEditorBotao4a",
                                {onclick:{fn: i3GEOF.metaestat.editor.criaMedidaVariavel}}
                        );
                        $i("i3GEOFmetaestatEditorBotao4a-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
                        if(textoSelecionado){
                            i3GEOF.metaestat.editor.selComboPorTexto("i3geoCartoComboMedidaVariavelEditor",textoSelecionado);
                            i3GEOF.metaestat.ID_MEDIDA_VARIAVEL = $i("i3geoCartoComboMedidaVariavelEditor").value;
                        }
                    },
                    codigo_variavel = $i("i3geoCartoComboVariavelEditor").value;
                    if(codigo_variavel == ""){
                        i3GEO.janela.tempoMsg($trad('msgSelecionaVariavel',i3GEOF.metaestat.dicionario));
                        i3GEOF.metaestat.editor.t1(false);
                        return;
                    }
                    i3GEO.php.listaMedidaVariavel(codigo_variavel,temp);
                }
            },
            /**
             * Mostra a opcao de upload
             * Ativa o botao de upload com i3GEOF.metaestat.editor.botaoUpload
             * Na sequencia executa i3GEOF.metaestat.editor.t3()
             */
            t3a: function(remove,textoSelecionado){
                if(remove == true){
                    //remove o conteudo anteriormente construido
                    i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3a");
                }
                if(i3GEOF.metaestat.DADOSMEDIDASVARIAVEL[0].esquemadb !== "i3geo_metaestat"){
                    i3GEOF.metaestat.editor.t3(true,textoSelecionado);
                }
                else{
                    if($i("i3geoCartoComboMedidaVariavelEditor").value === ""){
                        i3GEO.janela.tempoMsg($trad('selecionaMedidaVariavel',i3GEOF.metaestat.dicionario));
                        i3GEOF.metaestat.editor.t2(false);
                    }
                    else{
                        var ins = "<p class='paragrafo' >" + $trad('msgUploadCSV',i3GEOF.metaestat.dicionario1) +
                        "<br><br><p><input id=i3GEOFmetaestatEditorBotaot3a type='button' value='Upload CSV' />";
                        i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t2()","i3GEOF.metaestat.editor.t3()",ins,"i3GEOF.metaestat.editor.t3a","i3GEOFmetaestatEditor",true);
                        i3GEOF.metaestat.editor.botaoUpload("i3GEOFmetaestatEditorBotaot3a");
                        $i("i3GEOFmetaestatEditorBotaot3a-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
                    }
                }
            },
            /**
             * Opcoes para escolha ou edicao/criacao de uma classificacao
             * Na sequencia executa i3GEOF.metaestat.editor.t4()
             */
            t3: function(remove,textoSelecionado){
                if(remove == true){
                    //remove o conteudo anteriormente construido
                    i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t3");
                }
                if($i("i3geoCartoComboMedidaVariavelEditor").value === ""){
                    i3GEO.janela.tempoMsg($trad('selecionaMedidaVariavel',i3GEOF.metaestat.dicionario));
                    i3GEOF.metaestat.editor.t2(false);
                }
                else{
                    var temp = function(dados){
                        var ins = "<p class='paragrafo' >" + $trad('msgClassifica',i3GEOF.metaestat.dicionario1) + "<br><br>" +
                        "<span>" + i3GEOF.metaestat.principal.comboClassificacoesMedidaVariavel(dados,"i3geoCartoComboClassificacoesEditor","") + "</span>" +
                        "<br><br>"+$trad('unidadeMedida',i3GEOF.metaestat.dicionario1)+": " + i3GEOF.metaestat.editor.dadoMedidaSelecionada("unidade_medida") +
                        "<br><br><p><input id=i3GEOFmetaestatEditorBotao5 type='button' value='"+$trad('edite',i3GEOF.metaestat.dicionario1)+"' />" +
                        "&nbsp;<input id=i3GEOFmetaestatEditorBotao5a type='button' value='"+$trad('criaNova',i3GEOF.metaestat.dicionario1)+"' /><br>";
                        i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t3a()","i3GEOF.metaestat.editor.t4()",ins,"i3GEOF.metaestat.editor.t3","i3GEOFmetaestatEditor",true);

                        new YAHOO.widget.Button(
                                "i3GEOFmetaestatEditorBotao5",
                                {onclick:{fn: i3GEOF.metaestat.editor.editaClassificacao}}
                        );
                        $i("i3GEOFmetaestatEditorBotao5-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
                        new YAHOO.widget.Button(
                                "i3GEOFmetaestatEditorBotao5a",
                                {onclick:{fn: i3GEOF.metaestat.editor.criaClassificacao}}
                        );
                        $i("i3GEOFmetaestatEditorBotao5a-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
                        if(textoSelecionado){
                            i3GEOF.metaestat.editor.selComboPorTexto("i3geoCartoComboClassificacoesEditor",textoSelecionado);
                        }

                    };
                    i3GEO.php.listaClassificacaoMedida($i("i3geoCartoComboMedidaVariavelEditor").value,temp);
                }
            },
            /**
             * Opcoes para definicao dos intervalos e cores de uma classificacao
             */
            t4: function(){
                //remove o conteudo anteriormente construido
                i3GEOF.metaestat.editor.removeEl("i3GEOF.metaestat.editor.t4");
                if($i("i3geoCartoComboMedidaVariavelEditor").value === ""){
                    i3GEO.janela.tempoMsg($trad('selecionaTipoClassificacao',i3GEOF.metaestat.dicionario));
                    i3GEOF.metaestat.editor.t3(false);
                }
                else{
                    //formulario semelhante existe em i3geo/admin/js/estat_variavel.js (classesAuto)
                    var temp = function(dados){
                        var soma = i3GEOF.metaestat.editor.dadoMedidaSelecionada("permitesoma"),
                        media = i3GEOF.metaestat.editor.dadoMedidaSelecionada("permitemedia"),
                        ins = "<p class='paragrafo' >" + $trad('msgAtualizaMapa',i3GEOF.metaestat.dicionario1) + "</p>"+
                        "&nbsp;<input id=i3GEOFmetaestatEditorBotao8 type='button' value='"+$trad('selecionaCor',i3GEOF.metaestat.dicionario1)+"' />" +
                        "<br><p class='paragrafo' >" + $trad('msgMetodoClassificacao',i3GEOF.metaestat.dicionario1) + "</p>";
                        if(soma == 1 || media == 1){
                            ins += "&nbsp;<input id=i3GEOFmetaestatEditorBotao6 type='button' value='"+$trad('quartis',i3GEOF.metaestat.dicionario1)+"' />" +
                            "&nbsp;<input id=i3GEOFmetaestatEditorBotao7 type='button' value='"+$trad('intervalosIguais',i3GEOF.metaestat.dicionario1)+"' />" +
                            "<div style='display:inline-block;position:relative;left:2px;top:2px;width:200px;' >&nbsp;intervalos: <input type=text value=5 id=i3GEOFmetaestatEditorNumInt size=5 /></div>";

                        }
                        ins += '<input type=hidden  value="" id="listaColourRampEditor"  />' + //utilizado pelo seletor de colourramp;
                        "<br><p class='paragrafo' >" + $trad('msgCriaClasses',i3GEOF.metaestat.dicionario1) + "</p>" +
                        "<p class='paragrafo' >" + $trad('menorValor',i3GEOF.metaestat.dicionario1) +
                        "&nbsp;<input type=text class=digitar size=5 value=0 id=i3GEOFmetaestatEditorVmin />&nbsp;&nbsp;" +
                        $trad('maiorValor',i3GEOF.metaestat.dicionario1) +
                        "&nbsp;<input type=text class=digitar size=5 value=100 id=i3GEOFmetaestatEditorVmax /></p>" +
                        "<input id='i3GEOFmetaestatEditorBotao9' type='button' value='"+$trad('intervalosIguais',i3GEOF.metaestat.dicionario1)+"' />";

                        i3GEO.util.proximoAnterior("i3GEOF.metaestat.editor.t3()","",ins,"i3GEOF.metaestat.editor.t4","i3GEOFmetaestatEditor",true);
                        new YAHOO.widget.Button(
                                "i3GEOFmetaestatEditorBotao8",
                                {onclick:{fn: function(){
                                    i3GEO.util.abreColourRamp("","listaColourRampEditor",$i("i3GEOFmetaestatEditorNumInt").value);
                                }}}
                        );
                        $i("i3GEOFmetaestatEditorBotao8-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
                        if($i("i3GEOFmetaestatEditorBotao6")){
                            new YAHOO.widget.Button(
                                    "i3GEOFmetaestatEditorBotao6",
                                    {onclick:{fn: i3GEOF.metaestat.editor.quartis}}
                            );
                            $i("i3GEOFmetaestatEditorBotao6-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";

                            new YAHOO.widget.Button(
                                    "i3GEOFmetaestatEditorBotao7",
                                    {onclick:{fn: i3GEOF.metaestat.editor.intervalosIguais}}
                            );
                            $i("i3GEOFmetaestatEditorBotao7-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";

                            new YAHOO.widget.Button(
                                    "i3GEOFmetaestatEditorBotao9",
                                    {onclick:{fn: i3GEOF.metaestat.editor.intervalosIguaisMM}}
                            );
                            $i("i3GEOFmetaestatEditorBotao9-button").style.width = (i3GEOF.metaestat.LARGURA / 2) + "px";
                        }
                    };
                    i3GEO.php.listaClasseClassificacao($i("i3geoCartoComboClassificacoesEditor").value,temp);
                }
            }
        },
        /**
         * Funcoes que controlam a exibicao e escolha dos parametros cadastrados para uma medida de variavel
         * Parametros podem ter filhos
         */
        parametros: {
            /**
             * Guarda a lista de parametros que foram obtidos na inicializacao
             */
            dados: [],
            /**
             * Obtem a lista com os parametros da medida
             * Cria os combos para os parametros que sao pai de todos
             * Executa i3GEO.php.listaParametrosMedidaVariavel()
             */
            lista: function(id_medida_variavel){
                i3GEOF.metaestat.comum.aguarde();
                var temp = function(dados){
                    i3GEOF.metaestat.comum.aguarde("hidden");
                    i3GEOF.metaestat.parametros.dados = dados;
                    i3GEOF.metaestat.parametros.combos("0");
                };
                i3GEO.php.listaParametrosMedidaVariavel(id_medida_variavel,temp);
            },
            /**
             * Cria os elementos que receberao so combos para escolher os valores de um parametro
             * Para criar os combos, executa i3GEOF.metaestat.parametros.valoresCombo()
             * O combo e inserido no elemento com ID i3geoCartoParametrosMedidasVariavel
             * Cada combo recebe um ID cujo valor e definido em funcao do id do parametro e do nivel na hierarquia
             * O combo e inserido dentro de um div ja existente ou e criado um novo se o nivel for 0
             * @param nivel do parametro na hierarquia, sendo 0 para o pai de todos
             */
            combos: function(nivel){
                var dados = i3GEOF.metaestat.parametros.dados,
                n = dados.length,
                onde = $i("i3geoCartoParametrosMedidasVariavel"),
                idpar,idcombo,i,novoel,teste;
                if(n === 0){
                    i3GEOF.metaestat.comum.adicionaCamada();
                }
                //cria o combo para o parametro cujo id_pai for do nivel escolhido
                for(i=0;i<n;i++){
                    if(dados[i].id_pai == nivel){
                        idpar = "parametro_"+dados[i].id_parametro_medida;
                        idcombo = "parametro_"+dados[i].id_parametro_medida+"_"+nivel;
                        teste = i3GEOF.metaestat.parametros.retornaIdPai(dados[i].id_parametro_medida);
                        if(teste != false){
                            idpar = "parametro_"+teste;
                        }
                        if(!$i(idpar)){
                            novoel = document.createElement("div");
                            novoel.id = idpar;
                            novoel.className = "paragrafo";
                            onde.appendChild(novoel);
                        }
                        onde = $i(idpar);
                        //if($i(idcombo)){
                        //  $i(idcombo).parentNode.innerHTML = "";
                        //}
                        if(!$i(idcombo)){
                            i3GEOF.metaestat.comum.aguarde("hidden");
                            novoel = document.createElement("div");
                            novoel.id = idcombo;
                            novoel.className = "paragrafo";
                            onde.appendChild(novoel);
                            i3GEOF.metaestat.parametros.valoresCombo(dados[i].id_parametro_medida,dados[i].nome,nivel,onde,idcombo);
                        }
                    }
                }
            },
            /**
             * Cria um combo com os valores de um determinado parametro
             * Executa i3GEO.php.listaValoresParametroMedidaVariavel() para obter os dados
             * @param id da medida da variavel
             * @param titulo do combo
             * @param nivel na hierarquia de parametros
             * @param onde o combo sera inserido
             * @param id que o combo recebera
             */
            valoresCombo: function(id_parametro_medida,titulo,nivel,onde,idcombo){
                i3GEOF.metaestat.comum.aguarde("visible");
                var temp = function(dados){
                    var n = dados.length,
                    ins = "",
                    oc = "'i3GEOF.metaestat.parametros.antesCombo();i3GEOF.metaestat.parametros.combos(\""+id_parametro_medida+"\")'",
                    filho = i3GEOF.metaestat.parametros.retornaIdFilho(id_parametro_medida),
                    i,novoel;
                    if(filho === false && i3GEOF.metaestat.MULTIPARAMETROS === false){
                        oc = "i3GEOF.metaestat.comum.adicionaCamada()";
                    }
                    ins = "<br><p class=paragrafo >"+titulo+"</p>";
                    if(i3GEOF.metaestat.MULTIPARAMETROS === false){
                        ins += "<select id='combo"+idcombo+"' style='background:beige;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange="+oc+" ><option value=''>---</option>";
                        for(i=0;i<n;i++){
                            ins += "<option value='"+dados[i]+"'>"+dados[i]+"</option>";
                        }
                        ins += "</select>";
                    }
                    else{
                        ins += i3GEO.util.checkCombo(
                                "combo"+idcombo,
                                dados,
                                dados,
                                "",  // "overflow:auto;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px;height:150px;border:1px solid gray;background-color:white",
                                oc
                        );
                    }
                    novoel = document.createElement("div");
                    novoel.className = "paragrafo";
                    novoel.innerHTML = ins;

                    onde.appendChild(novoel);
                    i3GEOF.metaestat.comum.aguarde("hidden");
                };
                i3GEO.php.listaValoresParametroMedidaVariavel(id_parametro_medida,temp);
            },
            antesCombo: function(){
                //if(!$i("i3geoCartoClasses_corpo")){
                //i3GEOF.metaestat.classes.inicia();
                //}
            },
            /**
             * Retorna o id do parametro que e filho de um outro parametro
             * Varre a variavel i3GEOF.metaestat.parametros.dados para pegar o filho
             * @param id pai
             * @return id do parametro ou false
             */
            retornaIdFilho:function(pai){
                var dados = i3GEOF.metaestat.parametros.dados,
                n = dados.length,
                i;
                for(i=0;i<n;i++){
                    if(dados[i].id_pai == pai){
                        return dados[i].id_parametro_medida;
                    }
                }
                return false;
            },
            /**
             * Retorna o id do parametro que e pai de um outro parametro
             * Varre a variavel i3GEOF.metaestat.parametros.dados para pegar o pai
             * @param id filho
             * @return id do parametro ou false
             */
            retornaIdPai:function(filho){
                var dados = i3GEOF.metaestat.parametros.dados,
                n = dados.length,
                i;
                for(i=0;i<n;i++){
                    if(dados[i].id_parametro_medida == filho){
                        return dados[i].id_pai;
                    }
                }
                return false;
            }
        },
        /**
         * Funcoes utilizadas pelos componentes principais da ferramenta (janela inicial)
         */
        principal: {
            MUSTACHE : "",
            MUSTACHECOMBO : "",
            mustacheHash : function() {
                var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.metaestat.dicionario);
                dicionario["locaplic"] = i3GEO.configura.locaplic;
                dicionario["ID_MEDIDA_VARIAVEL"] = i3GEOF.metaestat.ID_MEDIDA_VARIAVEL;
                dicionario["aguarde"] = $trad("o1");
                return dicionario;
            },
            /**
             * Inicia a ferramenta principal com as opcoes de escolha de variaveis, medidas e parametros
             *
             * Cria a janela flutuante com i3GEOF.metaestat.principal.abreJanela();
             * Preenche o conteudo da janela com i3GEOF.metaestat.principal.html();
             * Ativa as opcoes da janela com i3GEOF.metaestat.principal.opcoesVariaveis();
             *
             * @param id do div onde os componentes serao inseridos. Se nao for definido, utiliza "i3geoCartoParametros_corpo"
             *
             */
            inicia: function(iddiv, largura, altura, topo, esquerda){
                var template = "template_mst.html";
                if(i3GEOF.metaestat.INTERFACE == "flutuanteSimples"){
                    template = "templatesimples_mst.html";
                }
                if(i3GEOF.metaestat.INTERFACE == "inline"){
                    template = "templatesimplesinline_mst.html";
                }
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.inicia()");
                if(!iddiv || !$i(iddiv)){
                    iddiv = "i3geoCartoParametros_corpo";
                }
                if(i3GEOF.metaestat.principal.MUSTACHE == ""){
                    $.get(i3GEO.configura.locaplic + "/ferramentas/metaestat/" + template, function(template) {
                        i3GEOF.metaestat.principal.MUSTACHE = template;
                        i3GEOF.metaestat.principal.inicia(iddiv, largura, altura, topo, esquerda);
                    });
                    return;
                }
                //interface default
                if(i3GEOF.metaestat.INTERFACE == "flutuante"){
                    i3GEOF.metaestat.principal.abreJanela(largura, altura, topo, esquerda);
                    $i(iddiv).innerHTML = i3GEOF.metaestat.principal.html();
                    i3GEOF.metaestat.principal.opcoesVariaveis();
                }

                //interface qd a medida da variavel ja tiver sido definida. Utilizada ao adicionar uma camada via catalogo de temas
                //TODO incluir via template mustache
                if(i3GEOF.metaestat.INTERFACE == "flutuanteSimples"){
                    i3GEOF.metaestat.principal.abreJanela();
                    $i(iddiv).innerHTML = i3GEOF.metaestat.principal.html();

                    i3GEOF.metaestat.classes.comboRegiao(i3GEOF.metaestat.ID_MEDIDA_VARIAVEL);
                    i3GEOF.metaestat.classes.comboTipoClassificacao();
                    i3GEOF.metaestat.parametros.lista(i3GEOF.metaestat.ID_MEDIDA_VARIAVEL);
                }

                if(i3GEOF.metaestat.INTERFACE == "inline"){
                    $i(iddiv).innerHTML = i3GEOF.metaestat.principal.html();
                    if(i3GEOF.metaestat.ID_MEDIDA_VARIAVEL == ""){
                	$i(iddiv).innerHTML = "ID_MEDIDA_VARIAVEL nao definido";
                	return;
                    }
                    i3GEOF.metaestat.classes.comboRegiao(i3GEOF.metaestat.ID_MEDIDA_VARIAVEL);
                    i3GEOF.metaestat.classes.comboTipoClassificacao();
                    i3GEOF.metaestat.parametros.lista(i3GEOF.metaestat.ID_MEDIDA_VARIAVEL);
                }
                i3GEOF.metaestat.principal.MUSTACHE = "";
            },
            /**
             * Atualiza os componentes da interface
             * Remove os combos e adiciona novamente
             */
            atualiza:function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.atualiza()");
                $i("i3geoCartoVariaveis").innerHTML = "";
                $i("i3geoCartoMedidasVariavel").innerHTML = "";
                $i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
                YAHOO.i3GEO.janela.manager.find("i3geoCartoParametros").setFooter("");
                i3GEOF.metaestat.principal.opcoesVariaveis();
            },
            /**
             * Cria uma janela flutuante para inserir os componetes da interface
             *
             * Para capturar o objeto janela utilize janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoParametros");
             */
            abreJanela: function(largura, altura, topo, esquerda){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.abreJanela()");
                var cabecalho,minimiza,imagemxy,janela,modal = false,titulo = false;
                if (largura) {
                    i3GEOF.metaestat.LARGURA = largura;
                }
                if (altura) {
                    i3GEOF.metaestat.ALTURA = altura;
                }
                if (esquerda) {
                    i3GEOF.metaestat.LEFT = esquerda;
                }
                if (topo) {
                    i3GEOF.metaestat.TOP = topo;
                }
                if (!$i("i3geoCartoParametros")){
                    cabecalho = function(){
                    };
                    minimiza = function(){
                        i3GEO.janela.minimiza("i3geoCartoParametros");
                    };
                    if(i3GEOF.metaestat.INTERFACE == "flutuanteSimples"){
                        modal = false;
                    }
                    if(i3GEOF.metaestat.INTERFACE == "inline"){
                        modal = false;
                    }
                    titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("x57") + "</span></div>";
                    janela = i3GEO.janela.cria(
                            i3GEOF.metaestat.LARGURA+50+"px",
                            i3GEOF.metaestat.ALTURA+"px",
                            "",
                            "",
                            "",
                            titulo,
                            "i3geoCartoParametros",
                            modal,
                            "hd",
                            cabecalho,
                            minimiza,
                            "",
                            false,
                            "",
                            "",
                            "",
                            "",
                            "124"
                    );
                    janela = janela[0];
                    if(!YAHOO.i3GEO.janela.manager.find("i3geoCartoParametros")){
                        YAHOO.i3GEO.janela.manager.register(janela);
                    }
                    janela.render();
                }
                else{
                    janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoParametros");
                }
                janela.show();
                imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
                janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT,i3GEOF.metaestat.TOP);
                return janela;
            },
            /**
             * Conteudo HTML que sera inerido na janela ou div com os elementos principais que receberao os objetos HTMML:
             * @return HTML
             */
            html: function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.html()");
                var ins = Mustache.render(i3GEOF.metaestat.principal.MUSTACHE, i3GEOF.metaestat.principal.mustacheHash());
                return ins;
            },
            /**
             * Abre uma janela flutuante com um relatorio contendo os metadados da variavel escolhida
             *
             * Verifica o combo com id "i3geoCartoComboVariavel" para verificar se a variavel foi escolhida
             *
             * O relatorio e montado com i3GEO.php.relatorioVariavel
             */
            maisInfo: function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.maisInfo()");
                var temp = "",
                v = $i("i3geoCartoComboVariavel");
                if(!v || v.value === ""){
                    i3GEO.janela.tempoMsg($trad('msgSelecionaVariavel',i3GEOF.metaestat.dicionario));
                }
                else{
                    var cabecalho,minimiza,janela;
                    if (!$i("i3geoCartoMaisInfo")){
                        cabecalho = function(){
                        };
                        minimiza = function(){
                            i3GEO.janela.minimiza("i3geoCartoMaisInfo");
                        };
                        janela = i3GEO.janela.cria(
                                "400px",
                                "300px",
                                "",
                                "",
                                "",
                                "</div><div class='i3GeoTituloJanelaBs'>" + $trad('relatorio',i3GEOF.metaestat.dicionario) + "</div>",
                                "i3geoCartoMaisInfo",
                                false,
                                "hd",
                                cabecalho,
                                minimiza
                        );
                        janela = janela[0];
                        YAHOO.i3GEO.janela.manager.register(janela);
                        janela.render();
                        //YAHOO.util.Event.addListener(janela.close, "click", i3GEOF.metaestat.fechaJanelaParametros);
                    }
                    else{
                        janela = YAHOO.i3GEO.janela.manager.find("i3geoCartoMaisInfo");
                    }
                    janela.setBody("");
                    temp = function(retorno){
                        janela.setBody(retorno);
                        janela.show();
                        //imagemxy = i3GEO.util.pegaPosicaoObjeto($i(i3GEO.Interface.IDCORPO));
                        //janela.moveTo(imagemxy[0]+i3GEOF.metaestat.LEFT,imagemxy[1]+i3GEOF.metaestat.TOP);
                    };
                    i3GEO.php.relatorioVariavel(v.value,temp);
                }
            },
            /**
             * Monta um combo com a lista de variaveis cadastradas
             * Retorna o HTML do combo
             *
             * @param objeto contendo a lista de variaveis e demais parametros de cada uma. Veja i3GEOF.metaestat.principal.opcoesVariaveis
             * @param id que sera atribuido ao combo
             * @param string que sera inserida no evento onchange
             * @param largura em pixel
             * @param sim|nao indicando se o icone da opcao 'mais info' sera mostrado ou nao
             *
             * @return HTML
             */
            comboVariaveis: function(dados,idcombo,stronchange,largura,mostraIconeinfo){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.comboVariaveis()");
                var ins,i,n = dados.length,selecionado = "";
                if(!largura || largura === ""){
                    largura = i3GEOF.metaestat.LARGURA - 40;
                }
                if(!mostraIconeinfo || mostraIconeinfo === ""){
                    mostraIconeinfo = "sim";
                }
                ins = "<select class='form-control pull-left' style='width:"+largura+"px;' id='"+idcombo+"' onchange='"+stronchange+"'><option value=''>---</option>";
                for(i=0;i<n;i++){
                    if(dados[i].codigo_variavel === i3GEOF.metaestat.CODIGO_VARIAVEL){
                        selecionado = "SELECTED";
                    }
                    else{
                        selecionado = "";
                    }
                    ins += "<option "+selecionado+" title='"+dados[i].descricao+"' value='"+dados[i].codigo_variavel+"'>"+dados[i].nome+"</option>";
                }
                ins += "</select>";
                if(mostraIconeinfo == "sim"){
                    ins += "<a style='left:7px;' title='"+$trad('maisInfo',i3GEOF.metaestat.dicionario)+"' href='javascript:void(0)' onclick='i3GEOF.metaestat.principal.maisInfo()' class='btn btn-primary btn-fab btn-fab-mini'><span class='material-icons md-18'>help_outline</span></a>";
                }
                return ins;
            },
            /**
             * Formata o botao de mais informacoes e define a funcao que sera executada
             * Procura pelo id "i3GEOcartoBotaoInfo"
             * Define como funcao de onclick i3GEOF.metaestat.principal.maisInfo()
             */
            botaoInfo: function(){
                //new YAHOO.widget.Button(
                //      "i3GEOcartoBotaoInfo",
                //      {onclick:{fn: i3GEOF.metaestat.principal.maisInfo}}
                //);
                //$i("i3GEOcartoBotaoInfo-button").style.width = (i3GEOF.metaestat.LARGURA / 2) - 15 + "px";
            },
            /**
             * Formata o botao de abertura do editor de limites geograficos e define a funcao que sera executada
             * Procura pelo id "i3GEOcartoBotaoEditor"
             * Define como funcao de onclick i3GEOF.metaestat.editor.inicia()
             */
            botaoJanelaEditor: function(){
                /*
            var b = new YAHOO.widget.Button(
                    "i3GEOcartoBotaoEditor",
                    {onclick:{fn: i3GEOF.metaestat.editor.inicia}}
            );
            b.addClass("abrir100");
                 */
            },
            /**
             * Formata o botao que adiciona uma nova camada ao mapa e define a funcao que sera executada
             * Procura pelo id "i3GEOcartoBotaoAdicionaCamada"
             * Define como funcao de onclick i3GEOF.metaestat.comum.adicionaCamada()
             */
            botaoAdicionaCamada: function(largura){

            },
            /**
             * Formata o botao que abre a janela de opcoes de analis e define a funcao que sera executada
             * Procura pelo id "i3GEOcartoBotaoAnalise"
             * Define como funcao de onclick i3GEOF.metaestat.analise.inicia()
             */
            botaoJanelaAnalise: function(){
                /*
            b = new YAHOO.widget.Button(
                    "i3GEOcartoBotaoAnalise",
                    {onclick:{fn: i3GEOF.metaestat.analise.inicia}}
            );
            b.addClass("abrir100");
                 */
            },
            /**
             * Obtem a lista de variaveis cadastradas e monta as opcoes correspondentes
             * A lista de variaveis e obtida com i3GEO.php.listaVariavel
             * Verifica se existe o id "i3geoCartoVariaveis". Se existir insere o HTML, caso contrario retorna o HTML
             */
            opcoesVariaveis: function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.opcoesVariaveis()");
                var onde = $i("i3geoCartoVariaveis"),
                temp = function(dados){
                    var ins = '';
                    //botao para obter mais info
                    ins = i3GEOF.metaestat.principal.comboVariaveis(dados,"i3geoCartoComboVariavel","i3GEOF.metaestat.principal.comboVariaveisOnchange(this)");
                    if(onde){
                        onde.innerHTML = ins;
                        //i3GEOF.metaestat.principal.botaoInfo();
                        //i3GEOF.metaestat.principal.botaoJanelaEditor();
                        //i3GEOF.metaestat.principal.botaoJanelaClasses();
                        //i3GEOF.metaestat.principal.botaoJanelaAnalise();
                    }
                    i3GEOF.metaestat.comum.aguarde("hidden");
                    return ins;
                };
                i3GEOF.metaestat.comum.aguarde();
                i3GEO.php.listaVariavel(temp);
            },
            /**
             * Executado quando o usuario escolhe uma variavel
             * Monta as opcoes de escolha de uma medida com i3GEOF.metaestat.principal.opcoesMedidasVariavel
             */
            comboVariaveisOnchange: function(combo){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.comboVariaveisOnchange()");
                i3GEOF.metaestat.CODIGO_VARIAVEL = combo.value;
                i3GEOF.metaestat.ID_MEDIDA_VARIAVEL = "";
                if(combo.value != ""){
                    i3GEOF.metaestat.principal.opcoesMedidasVariavel(combo.value);
                }
                else{
                    $i("i3geoCartoMedidasVariavel").innerHTML = "";
                }
                $i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
                i3GEOF.metaestat.classes.zeraParametros();
            },
            /**
             * Gera o HTML correspondente a um combo para escolha de uma medida de uma variavel
             * Define o valor de i3GEOF.metaestat.DADOSMEDIDASVARIAVEL
             *
             * @param objeto contendo os dados referentes as medidas de uma determinada variavel
             * @param id que sera atribuido ao combo criado
             * @param string que sera atribuida ao evento onchange
             * @param nome de um esquema que sera barrado. Apenas medidas cujos dados nao estiverem nesse esquema serao consideradas
             * @param largura em pixels
             * @param sim|nao mostra ou nao o icone que permite ver mais informacoes sobre a medida
             * @param sim|nao mostra ou nao o botao que permite o download dos dados
             */
            comboMedidasVariavel: function(dados,idcombo,stronchange,filtroesquema,largura,mostraIconeprop,mostraIconedown){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.comboMedidasVariavel()");
                i3GEOF.metaestat.DADOSMEDIDASVARIAVEL = dados;
                var n = dados.length,
                selecionado = "",
                ins = '',
                i;
                if(!largura || largura === ""){
                    largura = i3GEOF.metaestat.LARGURA;
                }
                if(!mostraIconeprop || mostraIconeprop === ""){
                    mostraIconeprop = "sim";
                }
                if(!mostraIconedown || mostraIconedown === ""){
                    mostraIconedown = "sim";
                }
                if(mostraIconeprop == "sim"){
                    largura = largura - 19;
                }
                if(mostraIconedown == "sim"){
                    largura = largura - 19;
                }
                ins += "<div class='form-group' style='width:"+largura+"px;margin: 0px;'><select class='form-control pull-left' id='"+idcombo+"' onchange='"+stronchange+"'><option value=''>---</option>";
                for(i=0;i<n;i++){
                    if(!filtroesquema || (filtroesquema != "" && dados[i].esquemadb != filtroesquema)){
                        if(i3GEOF.metaestat.ID_MEDIDA_VARIAVEL === dados[i].id_medida_variavel){
                            selecionado = "selected";
                        }
                        else{
                            selecionado = "";
                        }
                        ins += "<option "+selecionado+" value='"+dados[i].id_medida_variavel+"'>"+dados[i].nomemedida+"</option>";
                    }
                }
                ins += "</select></div>";
                if(mostraIconeprop == "sim"){
                    ins += "<img class='ticPropriedades2' src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' style='height:14px;position:relative;cursor:pointer;left:5px;top:4px;' onclick='i3GEOF.metaestat.classes.inicia()' title='"+$trad('propriedadesCamada',i3GEOF.metaestat.dicionario)+"'/>";
                }
                if(mostraIconedown == "sim"){
                    ins += "<img class='ticDownload' src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' style='position:relative;cursor:pointer;left:8px;top:5px;' onclick='i3GEOF.metaestat.principal.downloadMedida()' title='"+$trad("a3")+"'/>";
                }
                return ins;
            },
            /**
             * Obtem a lista de medidas de uma variavel cadastradas e monta as opcoes correspondentes
             * A lista de variaveis e obtida com i3GEO.php.listaMedidaVariavel
             * Verifica se existe o id "i3geoCartoMedidasVariavel". Se existir insere o HTML, caso contrario retorna o HTML
             *
             * @param codigo da variavel que sera pesquisada para obter as medidas
             */
            opcoesMedidasVariavel: function(codigo_variavel){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.opcoesMedidasVariavel()");
                var onde = $i("i3geoCartoMedidasVariavel"),
                temp = function(dados){
                    var ins = '<br><p class="paragrafo" >'+$trad('selecionaMedidaVariavel',i3GEOF.metaestat.dicionario)+'</p>';
                    ins += i3GEOF.metaestat.principal.comboMedidasVariavel(dados,"i3geoCartoComboMedidasVariavel","i3GEOF.metaestat.principal.comboMedidaVariavelOnchange(this)");
                    if(onde){
                        onde.innerHTML = ins;
                    }
                    i3GEOF.metaestat.comum.aguarde("hidden");
                    return ins;
                };
                i3GEOF.metaestat.comum.aguarde();
                i3GEO.php.listaMedidaVariavel(codigo_variavel,temp);
            },
            /**
             * Executado quando o usuario escolhe uma medida de uma variavel
             * Monta os parametros de uma medida com i3GEOF.metaestat.parametros.lista
             * Ativa o botao de adicionar camadas com i3GEOF.metaestat.principal.botaoAdicionaCamada
             * Define a variavel i3GEOF.metaestat.ID_MEDIDA_VARIAVEL
             *
             * @param objeto combo utilizado para escolher a variavel
             */
            comboMedidaVariavelOnchange: function(combo){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.comboMedidaVariavelOnchange()");
                i3GEOF.metaestat.ID_MEDIDA_VARIAVEL = combo.value;
                $i("i3geoCartoParametrosMedidasVariavel").innerHTML = "";
                if(combo.value != ""){
                    //i3GEOF.metaestat.classes.inicia();
                    i3GEOF.metaestat.parametros.lista(combo.value);
                    //i3GEOF.metaestat.principal.botaoAdicionaCamada();
                }
                i3GEOF.metaestat.classes.zeraParametros();
            },
            /**
             * Executado quando o usuário opta por alterar a classificacao default utilizada (sempre a primeira cadastrada)
             * Monta o combo com a lista de classificacoes
             *
             * @param objeto contendo os dados que farao parte do combo
             * @param string que sera atribuida como ID do combo
             * @return string HTML (select)
             */
            comboClassificacoesMedidaVariavel: function(dados,idcombo){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.comboClassificacoesMedidaVariavel()");
                var ins,i,n = dados.length;
                ins = "<select id='"+idcombo+"' style='box-shadow:0 1px 5px gray;width:"+(i3GEOF.metaestat.LARGURA - 20)+"px' onchange='i3GEOF.metaestat.principal.comboClassificacoesMedidaVariavelOnchange(this)'><option value=''>---</option>";
                for(i=0;i<n;i++){
                    ins += "<option title='"+dados[i].observacao+"' value='"+dados[i].id_classificacao+"'>"+dados[i].nome+"</option>";
                }
                ins += "</select>";
                return ins;
            },
            comboClassificacoesMedidaVariavelOnchange: function(combo){

            },
            /**
             * Abre uma nova janela do navegador para download dos dados de uma medida de uma variavel
             * Executa ?funcao=dadosMedidaVariavel que retorna os dados em CSV
             */
            downloadMedida: function(){
                i3GEOF.metaestat.log("i3GEOF.metaestat.principal.downloadMedida()");
                if(!$i("i3geoCartoComboMedidasVariavel")){
                    i3GEO.janela.tempoMsg("erro: i3geoCartoComboMedidasVariavel???");
                    return;
                }
                if(window.confirm("Confirma o download dos dados")){
                    var p = i3GEO.configura.locaplic+"/classesphp/metaestat_controle.php?funcao=dadosMedidaVariavel" +
                    "&todasascolunas=1&formato=csv&id_medida_variavel="+$i("i3geoCartoComboMedidasVariavel").value;
                    window.open(p);
                }
            }
        },
        //funcoes utilizadas quando o mapa esta cadastrado e e utilizado um template para publicar o mapa
        publicador: {
            IDMAPA: "",
            montaGrupos: function(onde){
                var grupos = function(dados){
                    var n = dados.length,
                    ins = '<input type=hidden id=i3geoCartoComboMedidasVariavel value=""/>',
                    i;
                    for(i=0;i<n;i++){
                        ins += '<div class="divGrupo">';
                        ins += '<p class="tituloGrupo" >'+dados[i].titulo+'</p>';
                        ins += '<div class="divComboMedidas" id="comboTemasMapa_'+dados[i].id_mapa_grupo+'"></div>';
                        ins += '</div>';
                    }
                    $i(onde).innerHTML = ins;
                    for(i=0;i<n;i++){
                        i3GEOF.metaestat.publicador.comboTemas(dados[i].id_mapa_grupo,"comboTemasMapa_"+dados[i].id_mapa_grupo);
                    }
                };
                i3GEO.php.listaGruposMapaMetaestat(grupos,i3GEOF.metaestat.publicador.IDMAPA);
            },
            comboTemas: function(id_mapa_grupo,onde){
                temas = function(dados){
                    var n = dados.length,
                    ins = '',
                    i;

                    ins = "<select style='width:"+(i3GEOF.metaestat.LARGURA - 60)+"px' onchange='i3GEOF.metaestat.publicador.comboMedidaVariavelOnchange(this)'><option value=''>---</option>";
                    for(i=0;i<n;i++){
                        ins += "<option value='"+dados[i].id_medida_variavel+"'>"+dados[i].titulo+"</option>";
                    }
                    ins += "</select>";
                    ins += "<img class='ticPropriedades2' src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' style='height:14px;position:relative;cursor:pointer;left:5px;top:4px;' onclick='i3GEOF.metaestat.classes.inicia()' title='"+$trad('propriedadesCamada',i3GEOF.metaestat.dicionario)+"'/>";
                    ins += "<img class='ticDownload' src='"+i3GEO.configura.locaplic+"/imagens/branco.gif' style='position:relative;cursor:pointer;left:8px;top:5px;' onclick='i3GEOF.metaestat.principal.downloadMedida()' title='"+$trad("a3")+"'/>";

                    $i(onde).innerHTML = ins;
                };
                i3GEO.php.listaTemasMapaMetaestat(temas,id_mapa_grupo);
            },
            comboMedidaVariavelOnchange: function(obj){
                //contorna o problema da funcao de definicao do titulo da camada tentar obter um objeto select
                $i("i3geoCartoComboMedidasVariavel").value = obj.value;
                $i("i3geoCartoComboMedidasVariavel").options = [{"label":""}];
                $i("i3geoCartoComboMedidasVariavel").selectedIndex = 0;
                i3GEOF.metaestat.classes.zeraParametros();
                i3GEOF.metaestat.principal.comboMedidaVariavelOnchange(obj);
            }
        }
};
//aplica ao codigo i3GEOF definicoes feitas na interface do mapa
//isso permite a substituicao de funcoes e parametros
if(i3GEO.configura.ferramentas.hasOwnProperty("metaestat")){
    jQuery.each( i3GEO.configura.ferramentas.metaestat, function(index, value) {
        i3GEOF.metaestat[index] = i3GEO.configura.ferramentas.metaestat[index];
    });
}
