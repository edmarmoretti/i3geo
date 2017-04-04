botoesIni = [
             {
            	 "link": "../admin/xmlmetaestatogc.php",
            	 "corpo": $trad("xmlWmsMetaestat",g_traducao_rss)
             },{
            	 "link": "../admin/rssmapas.php",
            	 "corpo": $trad("verRss",g_traducao_rss)
             },{
            	 "link": "../admin/rssgrupos.php?output=xml",
            	 "corpo": $trad("rssArvore",g_traducao_rss)
             },{
            	 "link": "../admin/rssgrupos.php?output=json",
            	 "corpo": $trad("rssArvoreJson",g_traducao_rss)
             },{
            	 "link": "../admin/rsscomentariostemas.php",
            	 "corpo": $trad("rssComentarios",g_traducao_rss)
             },{
            	 "link": "../admin/xmlservicosws.php",
            	 "corpo": $trad("xmlWebServ",g_traducao_rss)
             },{
            	 "link": "../admin/xmlservicosws.php?output=json",
            	 "corpo": $trad("xmlWebServJson",g_traducao_rss)
             },{
            	 "link": "../admin/xmlservicoswms.php",
            	 "corpo": $trad("xmlWms",g_traducao_rss)
             },{
            	 "link": "../admin/xmlservicoswms.php?output=json",
            	 "corpo": $trad("xmlWmsJson",g_traducao_rss)
             },{
            	 "link": "../admin/xmlgeorss.php?output=json",
            	 "corpo": $trad("xmlGeoRssJson",g_traducao_rss)
             },{
            	 "link": "../admin/xmlmapas.php",
            	 "corpo": $trad("xmlMapas",g_traducao_rss)
             },{
            	 "link": "../admin/rssmapas.php",
            	 "corpo": $trad("rssMapas",g_traducao_rss)
             },{
            	 "link": "../admin/rssmapas.php?output=json",
            	 "corpo": $trad("rssMapasJson",g_traducao_rss)
             },{
            	 "link": "../admin/xmlsistemas.php",
            	 "corpo": $trad("xmlSistAdiciona",g_traducao_rss)
             },{
            	 "link": "../admin/xmlgeorss.php",
            	 "corpo": $trad("xmlGeoRss",g_traducao_rss)
             }
             ];

function mostraBotoesBT(){
	//
	//essa funcao obtem a lista unica de tags para montar o indice
	//
	var html = "", novalista = [], n, nc, i, j, chaves = [], nchaves = [];

	n = botoesIni.length;
	for(i=0; i<n; i++){
		chaves.push(botoesIni[i].tag);
	}
	chaves = chaves.getUnique();
	chaves.sort();
	nc = chaves.length;
	for(j=0;j<nc;j++){
		for(i=0; i<n; i++){
			if(botoesIni[i].tag == chaves[j]){
				botoesIni[i]["id"] = "a"+j;
				novalista.push(botoesIni[i]);
			}
		}
	}
	html = Mustache.to_html(
			"{{#d}}" + $("#botoesTpl").html() + "{{/d}}",
			{"d":novalista}
	);
	$("#botoesTpl").html(html);

	for(j=0;j<nc;j++){
		nchaves.push({"tag":chaves[j],"id":"a"+j});
	}
	html = Mustache.to_html(
			"{{#d}}" + $("#tplLista").html() + "{{/d}}",
			{"d":nchaves}
	);
	var r = new RegExp("&amp;","g");
	$("#tplLista").html(html.replace(r,"&"));
}
