if(typeof(i3GEOF) === 'undefined'){
	var i3GEOF = {};
}

/*
Classe: i3GEOF.conectarwmsi3GEOF.conectarwms
 */
i3GEOF.conectarwms = {
		IDWS: "",
		TIPO: "",
		TIPOWS: "WMS",
		TEMA: "",
		LEGENDA: "",
		NOMETEMA: "",
		/*
	Variavel: aguarde

	Estilo do objeto DOM com a imagem de aguarde existente no cabe&ccedil;alho da janela.
		 */
		aguarde: "",
		/**
		 * Template no formato mustache. E preenchido na carga do javascript com o programa dependencias.php
		 */
		MUSTACHE : "",
		/**
		 * Susbtitutos para o template
		 */
		mustacheHash : function() {
			var dicionario = i3GEO.idioma.objetoIdioma(i3GEOF.conectarwms.dicionario);
			return dicionario;
		},
		/*
	Function: inicia

	Inicia a ferramenta. &Eacute; chamado por criaJanelaFlutuante

	Parametro:

	iddiv {String} - id do div que receber&aacute; o conteudo HTML da ferramenta
		 */
		inicia: function(iddiv){
			if(i3GEOF.conectarwms.MUSTACHE == ""){
				$.get(i3GEO.configura.locaplic + "/ferramentas/conectarwms/template_mst.html", function(template) {
					i3GEOF.conectarwms.MUSTACHE = template;
					i3GEOF.conectarwms.inicia(iddiv);
				});
				return;
			}
			$i(iddiv).innerHTML = i3GEOF.conectarwms.html();
			var b, monta = function(retorno){
				if (retorno.data.rss.search(/Erro/gi) != -1){
					i3GEO.janela.tempoMsg("OOps! Ocorreu um erro\n"+retorno.data);
					return;
				}
				var canais = retorno.data.canais;
				var ncanais = canais.length;
				var i, ins = "";
				ins += "<select class='form-control' onchange='i3GEOF.conectarwms.registraws(this.value)' style='width:100%;' >";
				ins += "<option value='' >---</option>";
				for (i = 0; i < ncanais; i++) {
					var caso = canais[i];
					var valor = "'" + caso.link + "','"	+ caso.id_ws + "'";
					ins += "<option value=" + valor + " >"+caso.title+"</option>";
				}
				ins += "</select>";
				document.getElementById("RSSgeo").innerHTML = ins;
			};

			var p = i3GEO.configura.locaplic + "/classesphp/wscliente.php?funcao=listaRSSwsARRAY&rss=&tipo=WMS";
			var cp = new cpaint();
			cp.set_response_type("JSON");
			cp.call(p,"listaRSSwsARRAY",monta);
		},
		/*
	Function: html

	Gera o c&oacute;digo html para apresenta&ccedil;&atilde;o das op&ccedil;&otilde;es da ferramenta

	Retorno:

	String com o c&oacute;digo html
		 */
		html:function() {
			var ins = Mustache.render(i3GEOF.conectarwms.MUSTACHE, i3GEOF.conectarwms.mustacheHash());
			return ins;
		},
		/*
	Function: iniciaJanelaFlutuante

	Cria a janela flutuante para controle da ferramenta.
		 */
		iniciaJanelaFlutuante: function(){
			var minimiza,cabecalho,janela,divid,titulo;
			if($i("i3GEOF.conectarwms")){
				return;
			}
			//cria a janela flutuante
			minimiza = function(){
				i3GEO.janela.minimiza("i3GEOF.conectarwms",200);
			};
			titulo = "<span class='i3GeoTituloJanelaBsNolink' >" + $trad("a4") + "</span></div>";
			janela = i3GEO.janela.cria(
					"600px",
					"500px",
					"",
					"",
					"",
					titulo,
					"i3GEOF.conectarwms",
					false,
					"hd",
					"",
					minimiza,
					"",
					true,
					"",
					"",
					"",
					"",
					"28"
			);
			divid = janela[2].id;
			i3GEOF.conectarwms.aguarde = $i("i3GEOF.conectarwms_imagemCabecalho").style;
			$i("i3GEOF.conectarwms_corpo").style.backgroundColor = "white";
			i3GEOF.conectarwms.inicia(divid);
		},
		adiciona: function(id){
			var url, temp, cp, p;
			if(i3GEOF.conectarwms.aguarde.visibility === "visible"){
				return;
			}
			if($i("servicoWms").value !== ""){
				i3GEOF.conectarwms.aguarde.visibility = "visible";
				temp = function(retorno){
					i3GEOF.conectarwms.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				};
				cp = new cpaint();
				cp.set_response_type("JSON");
				p = i3GEO.configura.locaplic+"/ferramentas/conectarwms/exec.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaGeoRSS&canal="+id+"&servico="+$i("servicoWms").value;
				cp.call(p,"foo",temp);
			}
		},
		listaLayers: function(codLayer){
			if(i3GEOF.conectarwms.aguarde.visibility === "visible"){
				return;
			}
			var listatemas = function(retorno){
				i3GEOF.conectarwms.aguarde.visibility = "hidden";
				i3GEOF.conectarwms.IDWS = "";
				if ((retorno.data != "erro") && (retorno.data != undefined)){
					$i("resultadoget").innerHTML = retorno.data;
					i3GEOF.conectarwms.TIPO = ""; //tipo de tema
					i3GEOF.conectarwms.TEMA = ""; //tema selecionado do ws
					i3GEOF.conectarwms.LEGENDA = ""; //legenda do tema
					i3GEOF.conectarwms.NOMETEMA = ""; //nome do tema
					g_sld = "";
					if ($i("suportasld")){
						if ($i("suportasld").value != "nao")				{
							if ($i("textoSLD"))
								$i("textoSLD").style.display = "block";
						}
					}
					//ativa um layer caso tenha sido enviado como um parametro no inicio da ferramenta
					i3GEOF.conectarwms.ativaAutoLayer(codLayer);
				}
				else{
					$i("resultadoget").innerHTML = "<h5 class='alert alert-danger'>"+$trad('erro',i3GEOF.conectarwms.dicionario)+"</h5>";
				}
			};
			if ($i("servicoWms").value == ""){
				i3GEO.janela.tempoMsg($trad('servico',i3GEOF.conectarwms.dicionario));
			}
			else{
				$i("resultadoget").innerHTML = "";
				i3GEOF.conectarwms.aguarde.visibility = "visible";
				var p = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=temaswms&id_ws="+i3GEOF.conectarwms.IDWS+"&servico="+$i("servicoWms").value;
				var cp = new cpaint();
				cp.set_response_type("JSON");
				cp.call(p,"temaswms",listatemas);
			}
		},
		registraws: function(nome,id_ws,tipo){
			$i("servicoWms").value = nome;
			if(arguments.length == 2){
				i3GEOF.conectarwms.IDWS = id_ws;
			}
			else {
				i3GEOF.conectarwms.IDWS = "";
			}
			i3GEOF.conectarwms.listaLayers();

			i3GEOF.conectarwms.TIPO = ""; //tipo de tema
			i3GEOF.conectarwms.TIPOWS = "WMS"; //tipo de servico
			i3GEOF.conectarwms.TEMA = ""; //tema selecionado do ws
			i3GEOF.conectarwms.LEGENDA = ""; //legenda do tema
			i3GEOF.conectarwms.NOMETEMA = ""; //nome do tema
			if(tipo){
				i3GEOF.conectarwms.TIPOWS = tipo;
			}
			i3GEOF.conectarwms.listaLayers();
		},
		montaCanais: function(retorno){
			var i,ins = "<h5>"+ $trad('selecionaItem',i3GEOF.conectarwms.dicionario)+"</h5>";
			i3GEOF.conectarwms.aguarde.visibility = "hidden";
			if (retorno.data != undefined){
				retorno = retorno.data;
				for (i=0;i<retorno.length; i++){
					ins += "<div class='list-group condensed'><div class='row-content text-left'>" +
					"<label class='nomeTema'><a onclick='i3GEOF.conectarwms.adiciona(\""+i+"\");return false;' href='javascript:void(0)'><h4>" + retorno[i].title + "</h4></a></label></div></div>";
				}
				$i("resultadoget").innerHTML = ins;
			}
			else{
				$i("resultadoget").innerHTML = "<h5 class='alert alert-danger'>"+$trad('erro',i3GEOF.conectarwms.dicionario)+"</h5>";
			}
		},
		ativaAutoLayer: function (codLayer){
			if(codLayer && codLayer != ""){
				var container, rs, nrs, i, r, codLayer1;
				codLayer1 = codLayer.split(":");
				if(codLayer1.length > 0){
					codLayer1 = codLayer1[1];
				}
				else{
					codLayer1 = codLayer1[0];
				}
				container = $i("resultadoget");
				if(container){
					rs = container.getElementsByTagName("input");
					nrs = rs.length;

					for(i = 0; i < nrs; i++){
						r = rs[i];
						if(r.type === "radio" && (r.value === codLayer || r.value === codLayer1)){
							r.onclick.call();
							r.checked = true;
							r.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.scrollIntoView(true);
						}
					}
				}
			}
		},
		seltema: function(tipo,tema,legenda,nometema,nomecamada,sldflag){
			i3GEOF.conectarwms.TIPO = tipo; //tipo de tema
			i3GEOF.conectarwms.TIPOWS = "WMS"; //tipo de servico
			i3GEOF.conectarwms.TEMA = tema; //tema selecionado do ws
			i3GEOF.conectarwms.LEGENDA = legenda; //legenda do tema

			if (tema != ""){
				var retorno = function(retorno){
					i3GEOF.conectarwms.aguarde.visibility = "hidden";
					i3GEO.atualiza();
				};
				i3GEOF.conectarwms.tema = tema;
				i3GEOF.conectarwms.aguarde.visibility = "visible";
				var tiporep = "";
				if($i("tiporep")){
					tiporep = $i("tiporep").value;
				}
				var url = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid;
				if($i("servicoWms").value.split("?").length === 1){
					$i("servicoWms").value = $i("servicoWms").value+"?";
				}
				if($i("proj").value === ""){
					$i("proj").value = "EPSG:4326";
				}
				var p = "&funcao=adicionatemawms&servico="+$i("servicoWms").value+"&tema="+i3GEOF.conectarwms.tema+"&nome="+nometema+"&proj="+$i("proj").value+"&formato="+$i("formatos").value+"&tipo="+tipo+"&versao="+$i("versao").value+"&nomecamada="+nomecamada+"&tiporep="+tiporep+"&suportasld="+sldflag+"&formatosinfo="+$i("formatosinfo").value;
				//if(g_tipows && g_tipows == "WMS-Tile"){
				//	p += "&tile=1";
				//}
				//else{
					p += "&tile=0";
				//}
				var cp = new cpaint();
				cp.set_transfer_mode("POST");
				cp.set_response_type("JSON");
				cp.call(url,"adicionatemawms",retorno,p);
			}
		}
};
function seltema (tipo,tema,legenda,nometema,nomecamada,sldflag){
	i3GEOF.conectarwms.TIPO = tipo; //tipo de tema
	i3GEOF.conectarwms.TEMA = tema; //tema selecionado do ws
	i3GEOF.conectarwms.LEGENDA = legenda; //legenda do tema

	if (tema != ""){
		var retorno = function(retorno)	{
			if(retorno.data != "ok"){
				i3GEO.janela.tempoMsg($trad('erro2',i3GEOF.conectarwms.dicionario));
			}
			else{
				i3GEO.atualiza();
			}
		};

		var tiporep = "";
		if($i("tiporep")){
			tiporep = $i("tiporep").value;
		}
		var url = i3GEO.configura.locaplic + "/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid;
		if($i("servicoWms").value.split("?").length === 1){
			$i("servicoWms").value = $i("servicoWms").value+"?";
		}
		if($i("proj").value === ""){
			$i("proj").value = "EPSG:4326";
		}
		var p = "&funcao=adicionatemawms&servico="+$i("servicoWms").value+"&tema="+tema+"&nome="+nometema
		+"&proj="+$i("proj").value+"&formato="+$i("formatos").value
		+"&tipo="+tipo+"&versao="+$i("versao").value
		+"&nomecamada="+nomecamada+"&tiporep="+tiporep+"&suportasld="+sldflag+"&formatosinfo="+$i("formatosinfo").value;
		if(i3GEOF.conectarwms.TIPOWS == "WMS-Tile"){
			p += "&tile=1";
		}
		else{
			p += "&tile=0";
		}
		var cp = new cpaint();
		cp.set_transfer_mode("POST");
		cp.set_response_type("JSON");
		cp.call(url,"adicionatemawms",retorno,p);
	}
};