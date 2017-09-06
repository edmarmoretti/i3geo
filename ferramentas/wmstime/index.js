if(typeof(i3GEOF) === 'undefined'){
    var i3GEOF = {};
}
i3GEOF.wmstime = {
        configura: {
            "1": {
                titulo: "Active Fires (1 month - Terra/MODIS)",
                servico:"http://neowms.sci.gsfc.nasa.gov/wms/wms?",
                layers:"MOD14A1_M_FIRE",
                styles:"rgb",
                srs:"EPSG:4326",
                format:"image/jpeg",
                descricao:"Dados acumulados de um m&ecirc;s mar&ccedil;o de 2000 a mar&ccedil;o de 2009. Fire is a recurring part of nature.  Wildfires can be caused by lightning striking a forest canopy or, in a few isolated cases, by lava or hot rocks ejected from erupting volcanoes.  Most fires worldwide are started by humans, sometimes accidentally and sometimes on purpose.  Not all fires are bad.  Fire clears away dead and dying underbrush, which can help restore forest ecosystems to good health.  Humans use fire as a tool in slash-and-burn agriculture to speed up the process of breaking down unwanted vegetation into the soil.  Humans also use fire to clear away old-growth forests to make room for living spaces, roads, and fields for raising crops and cattle.  But not all fires are good.  Wildfires can destroy natural resources and human structures.  Globally, fire plays a major role in Earth&apos;s carbon cycle by releasing carbon into the air, and by consuming trees that would otherwise absorb carbon from the air during photosynthesis.  These maps show the locations of actively burning fires around the world, detected by instruments aboard NASA satellites.",
                anoInicio: 2006,
                mesInicio: 1,
                diaInicio: 1,
                anoFim: 2006,
                mesFim: 12,
                diaFim: 1,
                tipo: 2
            }
        },
        quadroAtual: 0,
        idServicoEscolhido: "",
        emPausa: true,
        MUSTACHE : "",
        mustacheHash : function() {
            var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.wmstime.dicionario);
            dicionario["locaplic"] = i3GEO.configura.locaplic;
            return dicionario;
        },
        inicia: function(iddiv){
            var ins,key = "";
            if(i3GEOF.wmstime.MUSTACHE == ""){
                $.get(i3GEO.configura.locaplic + "/ferramentas/wmstime/template_mst.html", function(template) {
                    i3GEOF.wmstime.MUSTACHE = template;
                    i3GEOF.wmstime.inicia(iddiv);
                });
                return;
            }
            $i(iddiv).innerHTML = i3GEOF.wmstime.html();

            ins = "<select  class='form-control' onchange='i3GEOF.wmstime.escolheuServico(this.value)'><option value='' >---</option>";
            for(key in i3GEOF.wmstime.configura){
                ins += "<option value='"+key+"'>"+i3GEOF.wmstime.configura[key].titulo+"</option>";
            }
            ins += "</select><b class='caret careti'></b>";
            $i("i3GEOFwmstimelistaDeServicos").innerHTML = ins;
            i3GEO.guias.mostraGuiaFerramenta("i3GEOwmstimeguia1","i3GEOwmstimeguia");
            $i("i3GEOwmstimeguia1").onclick = function(){
                i3GEO.guias.mostraGuiaFerramenta("i3GEOwmstimeguia1","i3GEOwmstimeguia");
            };
            $i("i3GEOwmstimeguia2").onclick = function(){
                if(i3GEOF.wmstime.idServicoEscolhido != ""){
                    i3GEO.guias.mostraGuiaFerramenta("i3GEOwmstimeguia2","i3GEOwmstimeguia");
                }
            };
        },
        html:function() {
            var ins = Mustache.render(i3GEOF.wmstime.MUSTACHE, i3GEOF.wmstime.mustacheHash());
            return ins;
        },
        iniciaJanelaFlutuante: function(){
            var minimiza,cabecalho,janela,divid,temp,titulo;
            if ($i("i3GEOF.wmstime")) {
                return;
            }
            //cria a janela flutuante
            cabecalho = function(){

            };
            minimiza = function(){
                i3GEO.janela.minimiza("i3GEOF.wmstime",200);
            };
            titulo = "<span class='i3GeoTituloJanelaBsNolink' >WMS Time</span></div>";
            janela = i3GEO.janela.cria(
                    "600px",
                    "400px",
                    "",
                    "",
                    "",
                    titulo,
                    "i3GEOF.wmstime",
                    false,
                    "hd",
                    cabecalho,
                    minimiza,
                    "",
                    true,
                    "",
                    "",
                    "",
                    "",
                    "76"
            );
            divid = janela[2].id;
            i3GEOF.wmstime.aguarde = $i("i3GEOF.wmstime_imagemCabecalho").style;
            i3GEOF.wmstime.inicia(divid);
        },
        /*
Function: i3GEOF.wmstime.escolheuServico

Monta a tela de parametros ap&oacute;s um servi&ccedil;o ter sido escolhido

Parametro:

idWMS {String} - id do servi&ccedil;o escolhido
         */
        escolheuServico: function(idWMS){
            i3GEOF.wmstime.idServicoEscolhido = idWMS;
            tipoServico = i3GEOF.wmstime.configura[idWMS].tipo;
            servico = i3GEOF.wmstime.configura[idWMS].servico+"&VERSION=1.1.1&REQUEST=GetMap&layers="+i3GEOF.wmstime.configura[idWMS].layers+"&styles="+i3GEOF.wmstime.configura[idWMS].styles+"&srs="+i3GEOF.wmstime.configura[idWMS].srs+"&format="+i3GEOF.wmstime.configura[idWMS].format;
            $i("i3GEOFwmstimeiServico").value = servico;
            $i("WMS_descricao").innerHTML = i3GEOF.wmstime.configura[idWMS].descricao;

            $i("WMS_anoinicio").value = i3GEOF.wmstime.configura[idWMS].anoInicio;
            //if(tipoServico > 1)
            $i("WMS_mesinicio").value = i3GEOF.wmstime.configura[idWMS].mesInicio;
            //if(tipoServico > 2)
            $i("WMS_diainicio").value = i3GEOF.wmstime.configura[idWMS].diaInicio;
            $i("WMS_anofim").value = i3GEOF.wmstime.configura[idWMS].anoFim;
            //if(tipoServico > 1)
            $i("WMS_mesfim").value = i3GEOF.wmstime.configura[idWMS].mesFim;
            //if(tipoServico > 2)
            $i("WMS_diafim").value = i3GEOF.wmstime.configura[idWMS].diaFim;

            var ins = "<select class='form-control' id='umaImagemPor' >";
            if(tipoServico == 1){
                ins += "<option value='ano' selected >"+$trad(10,i3GEOF.wmstime.dicionario)+"</option></select>";
            }
            if(tipoServico == 2){
                ins += "<option value='ano' >"+$trad(10,i3GEOF.wmstime.dicionario)+"</option>";
                ins += "<option value='mes' selected >"+$trad(11,i3GEOF.wmstime.dicionario)+"</option></select>";
            }
            if(tipoServico == 3){
                ins += "<option value='ano'  >"+$trad(10,i3GEOF.wmstime.dicionario)+"</option>";
                ins += "<option value='mes' >"+$trad(11,i3GEOF.wmstime.dicionario)+"</option>";
                ins += "<option value='dia' selected >"+$trad(12,i3GEOF.wmstime.dicionario)+"</option></select><b class='caret careti'></b>";
            }
            $i("divumaImagemPor").innerHTML = ins;
        },
        /*
Function: i3GEOF.wmstime.iniciaImagens

Inicia a tela de apresenta&ccedil;&atilde;o das imagens
         */
        iniciaImagens: function(){
            if(i3GEOF.wmstime.idServicoEscolhido == ""){
                return;
            }
            i3GEO.guias.mostraGuiaFerramenta("i3GEOwmstimeguia2","i3GEOwmstimeguia");
            $i("i3GEOFwmstimeimagens").innerHTML = "";
            $i("i3GEOFwmstimeimagensLidas").innerHTML = "";
            $i("i3GEOFwmstimemarcaTempo").innerHTML = "";
            if(i3GEO.parametros.mapexten){
                bbox = i3GEO.parametros.mapexten.split(" ");
                bbox = bbox.toString();
            }
            else {
                bbox = "-51.0347433181,-25.2688559441,-43.4155582517,-21.1417973665";
            }
            //var time = "2008-01-01"
            w = i3GEO.parametros.w; //985
            h = i3GEO.parametros.h;
            dw = 540;
            dh = 245;

            anoInicio = $i("WMS_anoinicio").value;
            mesInicio = $i("WMS_mesinicio").value;
            diaInicio = $i("WMS_diainicio").value;

            anoFim = $i("WMS_anofim").value;
            mesFim = $i("WMS_mesfim").value;
            diaFim = $i("WMS_diafim").value;

            intervalo = 1;
            id = 1;

            ids = new Array();
            quantasLidas = 0;
            onde = $i("i3GEOFwmstimeimagens");
            ondeContador = $i("i3GEOFwmstimeimagensLidas");
            ondeContador.style.display="block";
            idsValidos = new Array();
            idsTempo = new Array();
            parouQuantas = 0;
            ondeMarcaTempo = $i("i3GEOFwmstimemarcaTempo");
            ondeData = $i("i3GEOFwmstimemarcaData");
            tempoAnima = 500;

            if($i("umaImagemPor").value == "mes"){
                dataFixa = diaInicio;
                if(dataFixa < 10){dataFixa = "0"+dataFixa;}
                var anoAtual = anoInicio;
                var mesAtual = mesInicio;
                while (anoAtual <= anoFim){
                    while (mesAtual < 13){
                        var mes = mesAtual;
                        if(mes < 10){mes = "0"+mes;}
                        i3GEOF.wmstime.criaImg(anoAtual+"-"+mes+"-"+dataFixa,id);
                        i3GEOF.wmstime.criaImgStatus(anoAtual+"-"+mes+"-"+dataFixa,id);
                        ids.push(id);
                        idsTempo.push(anoAtual+"-"+mes+"-"+dataFixa);
                        id++;
                        mesAtual++;
                        if(anoAtual == anoFim && mesAtual > mesFim){mesAtual = 13;}
                    }
                    mesAtual = 1;
                    anoAtual++;
                }
            }
            if($i("umaImagemPor").value == "dia"){
                var anoAtual = anoInicio;
                var mesAtual = mesInicio;
                var diaAtual = diaInicio;
                while (anoAtual <= anoFim){
                    while (mesAtual < 13){
                        var mes = mesAtual;
                        if(mes < 10){mes = "0"+mes;}
                        while (diaAtual < 31){
                            var dia = diaAtual;
                            if(diaAtual < 10){dia = "0"+dia;}
                            i3GEOF.wmstime.criaImg(anoAtual+"-"+mes+"-"+dia,id);
                            i3GEOF.wmstime.criaImgStatus(anoAtual+"-"+mes+"-"+dia,id);
                            ids.push(id);
                            idsTempo.push(anoAtual+"-"+mes+"-"+dia);
                            id++;
                            diaAtual++;
                            if(mesAtual == mesFim && diaAtual > diaFim){diaAtual = 32;}
                        }
                        mesAtual++;
                        if(anoAtual == anoFim && mesAtual > mesFim){mesAtual = 13;}
                    }
                    mesAtual = 1;
                    anoAtual++;
                }
            }
        },
        /*
function: i3GEOF.wmstime.criaImg

Cria um elemento do tipo IMG com base no servi&ccedil;o escolhido e nos parametros de tempo

Parametros:

tempo {string} - data da imagem que ser&aacute; requisitada

id {string} - id que ser&aacute; definido para a imagem
         */
        criaImg: function(tempo,id){
            var novoel = document.createElement("img");
            var p = "absolute";
            novoel.id = id;
            novoel.style.position = p;
            novoel.style.top = "0px";
            novoel.style.left = "0px";
            novoel.style.width = dw+"px";
            novoel.style.height = dh+"px";
            novoel.style.cursor = "pointer";
            novoel.src = $i("i3GEOFwmstimeiServico").value+"&width="+dw+"&height="+dh+"&bbox="+bbox+"&time="+tempo;
            novoel.title = $trad(13,i3GEOF.wmstime.dicionario);
            novoel.onclick = function(){
                i3GEOF.wmstime.adicionaMapa(i3GEOF.wmstime.idServicoEscolhido);
            };
            novoel.onload = function(){
                $i("status"+this.id).innerHTML = " <span style=color:red >OK</span>";
                idsValidos.push(this.id);
                parouQuantas++;
                if(idsValidos.length == ids.length)
                {i3GEOF.wmstime.pararStatus();}
            };
            onde.appendChild(novoel);
        },
        /*
Function: i3GEOF.wmstime.criaImgStatus

Cria um &iacute;cone que permite parar a apresenta&ccedil;&atilde;o da anima&ccedil;&atilde;o em uma determinada imagem

Parametros:

tempo {string} - data da imagem

id {string} - id da imagem
         */
        criaImgStatus: function(tempo,id){
            var novoel = document.createElement("div");
            novoel.id = "lida"+id;
            novoel.style.width="200px";
            novoel.innerHTML = "Imagem: "+tempo+"...<span style=cursor:pointer;color:blue onclick='i3GEOF.wmstime.pararImagem(\""+id+"\")' id='status"+id+"' >parar</span>";
            ondeContador.appendChild(novoel);
        },
        /*
Function: i3GEOF.wmstime.pararImagem

Parar a apresenta&ccedil;&atilde;o da anima&ccedil;&atilde;o em uma determinada imagem

Parametro:

id {string} - id da imagem
         */
        pararImagem: function(id){
            if($i(id)){
                $i(id).src = "";
                //onde.removeChild(document.getElementById(id))
                idsValidos.push(id);
                $i("status"+id).innerHTML = $trad(14,i3GEOF.wmstime.dicionario);
                parouQuantas++;
                if(parouQuantas == ids.length)
                {i3GEOF.wmstime.pararStatus();}
            }
            else
            {i3GEO.janela.tempoMsg($trad(15,i3GEOF.wmstime.dicionario));}
        },
        /*
Function: i3GEOF.wmstime.pararStatus

Para o gr&aacute;fico que mostra o status das imagens
         */
        pararStatus: function(){
            ondeContador.style.display = "none";
            ondeMarcaTempo.style.display="block";
            ondeMarcaTempo.style.top = "10px";
            ondeData.style.top = dh + 30 + "px";
            ondeData.style.width = dw+"px";
            i3GEOF.wmstime.desativaQuadros();
            i3GEOF.wmstime.criaMarcadorTempo();
            //i3GEOF.wmstime.ajustaIds()
            i3GEOF.wmstime.ativaQuadro(1);
        },
        ajustaIds: function(){

        },
        /*
Function: i3GEOF.wmstime.criaMarcadorTempo

Cria o gr&aacute;fico que mostra as imagens dispon&iacute;veis. Serve de base para indicar qual imagem est&aacute; sendo mostrada
         */
        criaMarcadorTempo: function(){
            var nmarcas = ids.length;
            distanciaMarcas = parseInt(dw / nmarcas);
            var ins = "";
            var ini = parseInt((distanciaMarcas*i - (distanciaMarcas/2)));
            for(var i=1;i<=nmarcas;i++){
                ins += "<img title='"+$trad(16,i3GEOF.wmstime.dicionario)+"' onclick='i3GEOF.wmstime.adicionaMapa(\""+i+"\")' onmouseover='i3GEOF.wmstime.mostraI(\""+i+"\")' onmouseout='i3GEOF.wmstime.escondeI(\""+i+"\")' style='position:absolute;top:"+(dh + 10)+"px;left:"+parseInt((distanciaMarcas*i - (distanciaMarcas/2)))+"px;' src='"+i3GEO.configura.locaplic+"/imagens/dot1.gif' id='i3GEOFwmstimemarcaTempo"+i+"' />";
            }
            ins += "<img style='position:absolute;top:"+(dh - 5)+"px;left:"+parseInt((distanciaMarcas - (distanciaMarcas/2)))+"px;' src='"+i3GEO.configura.locaplic+"/imagens/dot1red.gif' id='marcaDeTempo' />";
            ins += "<img style='position:absolute;top:"+(dh + 10)+"px;left:"+parseInt((distanciaMarcas - (distanciaMarcas/2)))+"px;' src='"+i3GEO.configura.locaplic+"/imagens/dot1cinza.gif' id='marcaGranulo' />";
            ngranulo = nmarcas;
            tgranulo = (parseInt((distanciaMarcas*i - (distanciaMarcas/2))) - ini) / 10;
            tempoGranulo = tempoAnima / 10;
            ondeMarcaTempo.innerHTML = ins;
            marcaVermelha = $i("marcaDeTempo");
            imgGranulo = $i("marcaGranulo");
            i3GEOF.wmstime.pararFilme();
            i3GEOF.wmstime.iniciarFilme();
        },
        /*
Function: i3GEOF.wmstime.mostraI

Mostra uma imagem espec&iacute;fica

Parametro:

obj {dom} - objeto contendo a imagem
         */
        mostraI: function(obj){
            $i(obj).style.display="block";
            ondeData.innerHTML = "YYMMDD: "+idsTempo[obj-1];
            if($i(i3GEOF.wmstime.quadroAtual))
                $i(i3GEOF.wmstime.quadroAtual).style.display = "none";
            else
                $i("1").style.display = "none";
        },
        /*
Function: i3GEOF.wmstime.escondeI

Esconde uma imagem

Parametro:

obj {dom} - objeto contendo a imagem
         */
        escondeI: function(obj){
            $i(obj).style.display="none";
            ondeData.innerHTML = "";
            if($i(i3GEOF.wmstime.quadroAtual))
                $i(i3GEOF.wmstime.quadroAtual).style.display = "block";
            else
                $i("1").style.display = "block";
        },
        /*
Function: i3GEOF.wmstime.adicionaMapa

Adiciona uma camada ao mapa baseado na imagem vista na tela

         */
        adicionaMapa: function(idMarca){
            idMarca = parseInt(idMarca,10);
            var serv = i3GEOF.wmstime.configura[i3GEOF.wmstime.idServicoEscolhido];
            var fim = function(retorno){
               i3GEO.atualiza(retorno);
            };
            var p = i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionatemawms";
            p += "&servico="+serv.servico;
            if(serv.styles == "")
                p += "&nome=";
            else
                p += "&nome="+serv.styles;
            p += "&tema="+serv.layers;
            p += "&proj="+serv.srs;
            p += "&formato="+serv.format;
            p += "&tipo=estilo";
            p += "&versao=1.1.1";
            p += "&nomecamada="+serv.titulo+" "+idsTempo[idMarca-1];
            p += "&tiporep=&suportasld=nao";
            p += "&formatosinfo=text/plain,application/vnd.ogc.gml";
            p += "&time="+idsTempo[idMarca-1];
            var cp = new cpaint();
            cp.set_response_type("JSON");
            cp.call(p,"wmstime",fim);

        },
        desativaQuadros: function(){
            var n = idsValidos.length;
            for(var i=0;i<n;i++){
                $i(idsValidos[i]).style.display = "none";
            }
        },
        ativaQuadro: function(i){
            var q = $i(i);
            if(q){
                q.style.position = "relative";
                q.style.display = "block";
            }
            if($i("i3GEOFwmstimemarcaTempo"+i)){
                $i("i3GEOFwmstimemarcaTempo"+i).style.display = "block";
            }
            if($i("i3GEOFwmstimemarcaTempo"+(i))){
                marcaVermelha.style.left = $i("i3GEOFwmstimemarcaTempo"+(i)).style.left;
            }
        },
        pausarFilme: function(){
            i3GEOF.wmstime.emPausa = !i3GEOF.wmstime.emPausa;
            if(i3GEOF.wmstime.emPausa == false){
                i3GEOF.wmstime.anima();
            }
            else{
                imgGranulo.style.display="none";
                pulaGranulo = 11;
                try{
                    clearTimeout(ganima);
                }catch(e){}
            }
        },
        esconderMarcasTempo: function(){
            var n = idsValidos.length;
            for(var i=0;i<n;i++){
                if($i("i3GEOFwmstimemarcaTempo"+i)){
                    $i("i3GEOFwmstimemarcaTempo"+i).style.display = "none";
                }
            }
        },
        pararFilme: function(){
            i3GEOF.wmstime.emPausa = false;
            imgGranulo.style.left = parseInt((distanciaMarcas - (distanciaMarcas/2)))+"px";
            i3GEOF.wmstime.quadroAtual = 0;
            i3GEOF.wmstime.desativaQuadros();
            i3GEOF.wmstime.ativaQuadro(ids[0]);
            imgGranulo.style.display="none";
            ondeData.innerHTML = "";
            try{
                //clearTimeout(tanima)
                clearTimeout(ganima);
            }catch(e){}
        },
        iniciarFilme: function(){
            i3GEOF.wmstime.emPausa = false;
            i3GEOF.wmstime.esconderMarcasTempo();
            imgGranulo.style.display="block";
            //tanima = setTimeout("anima()",tempoAnima)
            //ganima = setTimeout("i3GEOF.wmstime.animacaoGranulo()",tempoGranulo)
            i3GEOF.wmstime.anima();
        },
        rebobina: function(){
            i3GEOF.wmstime.esconderMarcasTempo();
            i3GEOF.wmstime.pararFilme();
        },
        anima: function(){
            i3GEOF.wmstime.desativaQuadros();
            i3GEOF.wmstime.ativaQuadro(ids[i3GEOF.wmstime.quadroAtual]);
            ondeData.innerHTML = idsTempo[i3GEOF.wmstime.quadroAtual];
            i3GEOF.wmstime.quadroAtual++;
            if(i3GEOF.wmstime.quadroAtual < idsValidos.length){
                //tanima = setTimeout("anima()",tempoAnima)
                pulaGranulo = 0;
                imgGranulo.style.left = $i("i3GEOFwmstimemarcaTempo"+i3GEOF.wmstime.quadroAtual).style.left;
                ganima = setTimeout("i3GEOF.wmstime.animacaoGranulo()",tempoGranulo);
            }
            else{
                imgGranulo.style.display="none";
            }
        },
        animacaoGranulo: function(){
            imgGranulo.style.left = parseInt(imgGranulo.style.left) +  tgranulo + "px";
            pulaGranulo++;
            //if(quadroAtual < idsValidos.length)
            if(pulaGranulo <= 10)
                ganima = setTimeout("i3GEOF.wmstime.animacaoGranulo()",tempoGranulo);
            else
                i3GEOF.wmstime.anima();
        },
        maisrapido: function(){
            tempoGranulo = tempoGranulo - 10;
        },
        maislento: function(){
            tempoGranulo = tempoGranulo + 10;
        }
};