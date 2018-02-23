botoesIni = [
	{
		"link":"../pacotes/utils/rgbcolors.html",
		"corpo": $trad("rgbcolors",g_traducao_util)
	},
	{
		"link":"http://colorbrewer2.com/",
		"corpo": $trad("Colorbrewer",g_traducao_util)
	},
    {
        "link":"http://tristen.ca/hcl-picker/#/hlc/4/1/302A0C/5FAD71",
        "corpo": "Colorpicker for data"
    },
	{
		"link":"http://tools.wmflabs.org/geohack/",
		"corpo": "GeoHack"
	},
	{
		"link":"http://stevemorse.org/jcal/latlon.php",
		"corpo": $trad("end",g_traducao_util)
	},
	{
		"link":"https://maptools.info/tools/converter/",
		"corpo": $trad("coord",g_traducao_util)
	},
	{
		"link":"http://codebeautify.org/",
		"corpo": "Free Online Tools For Developers - To Beautify, Validate, Minify, Analyse and Convert"
	},
	{
		"link":"http://www.dasplankton.de/ContrastA/",
		"corpo": "Contrast-A - find accessible color combinations"
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
