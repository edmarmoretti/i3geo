if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.listaDeFerramentas = {
	menu : [{
	    nome : $trad("s1"),
	    descricao: $trad("descMenuAjuda"),
	    id : "ajudaMenu"
	},
	{
	    nome : $trad("s2"),
	    descricao: $trad("descMenuAnalise"),
	    id : "analise"
	},
	{
	    nome : $trad("operacoesMapa"),
	    descricao:  $trad("descOperacoesMapa"),
	    id : "ferramentasmapa"
	},
	{
	    nome : $trad("x57"),
	    descricao:  "",
	    id : "cartogramas"
	},
	{
	    nome : $trad("x105"),
	    descricao:  "",
	    id : "navegacao"
	}],
	submenus : {
	    "ajudaMenu" : [{
		id : "omenudataAjudamenu9",
		text : $trad("x68"),
		url : "javascript:i3GEO.janela.tempoMsg(i3GEO.parametros.mensageminicia)"
	    },
	    {
		id : "omenudataAjudamenu4",
		text : "Youtube",
		url : "https://www.youtube.com/results?search_query=i3geo",
		target : "_blank"
	    },
	    {
		id : "omenudataAjudamenu5",
		text : $trad("u5a"),
		url : "http://www.softwarepublico.gov.br",
		target : "_blank"
	    },
	    {
		id : "omenudataAjudamenu1",
		text : $trad("x67"),
		url : "https://softwarepublico.gov.br/social/i3geo",
		target : "_blank"
	    },
	    {
		id : "omenudataAjudamenu7",
		text : "Git",
		url : "https://softwarepublico.gov.br/gitlab/groups/i3geo",
		target : "_blank"
	    }],
	    "analise" : [{
		id : "omenudataAnalise1",
		text : $trad("u22"),
		submenu : {
		    id : "subAnalise1",
		    itemdata : [[{
			id : "omenudataAnalise2",
			text : $trad("u7"),
			url : "javascript:i3GEO.analise.dialogo.gradepol()"
		    },
		    {
			id : "omenudataAnalise3",
			text : $trad("u8"),
			url : "javascript:i3GEO.analise.dialogo.gradepontos()"
		    },
		    {
			id : "omenudataAnalise4",
			text : $trad("u9"),
			url : "javascript:i3GEO.analise.dialogo.gradehex()"
		    }]]
		}
	    },
	    {
		id : "omenudataAnalise14",
		text : $trad("u10"),
		url : "javascript:i3GEO.analise.dialogo.buffer()"
	    },
	    {
		id : "omenudataAnalise15",
		text : $trad("u26"),
		url : "javascript:i3GEO.analise.dialogo.agrupaelementos()"
	    },
	    {
		id : "omenudataAnalise16",
		text : $trad("u11"),
		url : "javascript:i3GEO.analise.dialogo.centroide()"
	    },
	    {
		id : "omenudataAnalise20",
		text : $trad("saikuAba"),
		url : "javascript:i3GEO.analise.dialogo.saiku()"
	    },
	    {
		id : "omenudataAnalise21",
		text : $trad("x102"),
		url : "javascript:i3GEO.analise.dialogo.heatmap()"
	    },
	    {
		id : "omenudataAnalise22",
		text : $trad("x104"),
		url : "javascript:i3GEO.analise.dialogo.markercluster()"
	    },
	    {
		id : "omenudataAnalise24",
		text : $trad("melhorcaminho"),
		url : "javascript:i3GEO.analise.dialogo.melhorcaminho()"
	    },
	    {
		id : "omenudataAnalise17",
		text : $trad("t37b"),
		url : "javascript:i3GEO.analise.dialogo.graficointerativo()"
	    },
	    {
		id : "omenudataMedirArea",
		text : $trad("d21at"),
		show: "hidden",
		url : "javascript:i3GEO.analise.dialogo.area()"
	    },
	    {
		id : "omenudataMedirDist",
		text : $trad("d21t"),
		show: "hidden",
		url : "javascript:i3GEO.analise.dialogo.distancia()"
	    },
	    {
		id : "omenudataFerramentas3e",
		text : $trad("t49"),
		url : "javascript:i3GEO.tema.dialogo.tme()"
	    },
	    {
		id : "omenudataFerramentasStoryMap",
		text : "StoryMap",
		url : "javascript:i3GEO.tema.dialogo.storymap()"
	    },
	    {
		id : "omenudataFerramentasAnimagif",
		text : "Anima Gif",
		url : "javascript:i3GEO.tema.dialogo.animagif()"
	    },
	    {
		id : "omenudatalinhadotempo",
		text : $trad("d30"),
		url : "javascript:i3GEO.analise.dialogo.linhadotempo()"
	    },
	    {
		id : "omenudataAnalise5",
		text : $trad("u23"),
		submenu : {
		    id : "subAnalise2",
		    itemdata : [[{
			id : "omenudataAnalise6",
			text : $trad("u11a"),
			url : "javascript:i3GEO.analise.dialogo.distanciaptpt()"
		    },
		    {
			id : "omenudataAnalise7",
			text : $trad("u12"),
			url : "javascript:i3GEO.analise.dialogo.nptpol()"
		    },
		    {
			id : "omenudataAnalise8",
			text : $trad("u13"),
			url : "javascript:i3GEO.analise.dialogo.pontoempoligono()"
		    },
		    {
			id : "omenudataAnalise9",
			text : $trad("u14"),
			url : "javascript:i3GEO.analise.dialogo.pontosdistri()"
		    },
		    {
			id : "omenudataAnalise9a",
			text : $trad("u28"),
			url : "javascript:i3GEO.analise.dialogo.centromassa()"
		    }]]
		}
	    },
	    {
		id : "omenudataAnalise10",
		text : $trad("u24"),
		submenu : {
		    id : "subAnalise3",
		    itemdata : [[{
			id : "omenudataAnalise11",
			text : $trad("u25"),
			url : "javascript:i3GEO.analise.dialogo.dissolve()"
		    }]]
		}
	    }],
	    "cartogramas" :[{
		id : "omenudataFerramentas1e",
		text : $trad("addcamada"),
		url : "javascript:i3GEO.mapa.dialogo.cartograma()"
	    },
	    {
		id : "omenudataFerramentas6a",
		text : $trad("x61"),
		url : "javascript:i3GEO.mapa.dialogo.filtraregiao()"
	    }],
	    "navegacao" :[{
		id : "omenudataFerramentas5a",
		text : $trad("x59"),
		url : "javascript:i3GEO.mapa.dialogo.locregiao()"
	    },
	    {
		id : "omenudataAnalise18",
		text : $trad("d30"),
		url : "javascript:i3GEO.analise.dialogo.linhadotempo()"
	    },
	    {
		id : "omenudataNavegacao2",
		text : $trad("d15t"),
		url : "javascript:i3GEO.navega.dialogo.google()"
	    },
	    {
		id : "omenudataNavegacao4",
		text : $trad("d8t"),
		url : "javascript:i3GEO.mapa.dialogo.mostraExten()"
	    },
	    {
		id : "omenudataNavegacaoWiki",
		text : $trad("d11t"),
		url : "javascript:i3GEO.navega.dialogo.wiki()"
	    },
	    {
		id : "omenudataNavegacaoMetar",
		text : $trad("d29"),
		url : "javascript:i3GEO.navega.dialogo.metar()"
	    },
	    {
		id : "omenudataNavegacaoFotos",
		text : "Fotos",
		url : "javascript:i3GEO.navega.dialogo.buscaFotos()"
	    },
	    {
		id : "omenudataNavegacaoConfluence",
		text : $trad("d17t"),
		url : "javascript:i3GEO.navega.dialogo.confluence()"
	    },
	    {
		id : "omenudataFerramentas7a",
		text : $trad("x64a"),
		url : "javascript:i3GEO.mapa.dialogo.congelaMapa();"
	    },
	    {
		id : "omenudataFerramentas8a",
		text : $trad("p12"),
		url : "javascript:i3GEO.mapa.dialogo.autoredesenha()"
	    },
	    {
		id : "omenudataFerramentas10",
		text : $trad("x93"),
		url : "javascript:i3GEO.mapa.dialogo.geolocal()"
	    }],
	    "ferramentasmapa" : [{
		id : "omenudataFerramentas1a",
		text : $trad("t20"),
		show : "hidden",
		url : "javascript:i3GEO.mapa.dialogo.opacidade()"
	    },
	    {
		id : "omenudataFerramentas2a",
		text : $trad("p21"),
		show : "hidden",
		url : "javascript:i3GEO.mapa.dialogo.animacao()"
	    },
	    {
		id : "omenudataFerramentas11",
		text : $trad("d22t"),
		url : "javascript:i3GEO.mapa.dialogo.inserexy2()"
	    },
	    {
		id : "omenudataFerramentas12",
		text : $trad("d25t"),
		url : "javascript:i3GEO.mapa.dialogo.inseretxt()"
	    },
	    {
		id : "omenudataImprimir",
		text : $trad("d12"),
		show : "hidden",
		url : "javascript:i3GEO.mapa.dialogo.imprimir()"
	    },
	    {
		id : "omenudataTipoImg",
		text : $trad("p2"),
		url : "javascript:i3GEO.mapa.dialogo.tipoimagem()"
	    },
	    {
		id : "omenudataCorFundo",
		text : $trad("p9"),
		url : "javascript:i3GEO.mapa.dialogo.opcoesfundo()"
	    },
	    {
		id : "gradeCoordenadas",
		text : $trad("p10"),
		url : "javascript:i3GEO.mapa.dialogo.gradecoord()"
	    },
	    {
		id : "mascara",
		text : $trad("mascara"),
		url : "javascript:i3GEO.mapa.dialogo.mascara()"
	    },
	    {
		id : "wkt2layer",
		text : $trad("wkt2layer"),
		url : "javascript:i3GEO.mapa.dialogo.wkt2layer()"
	    },
	    {
		id : "omenudataFerramentasCliqueGrafico",
		text : $trad("d23t"),
		url : "javascript:i3GEO.mapa.dialogo.inseregrafico()"
	    }]
	}
};