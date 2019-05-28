<?php
include_once (dirname(__FILE__) . "/../../classesphp/sani_request.php");
$_GET = array_merge($_GET, $_POST);
include_once (dirname(__FILE__) . "/../../classesphp/class.palette.php");
$m = new palette();
$lista = implode(",", ($m->listaColourRamps(dirname(__FILE__) . "/../..")));
if (! isset($_GET["ncores"])) {
    $_GET["ncores"] = 10;
}
if (empty($_GET["locaplic"])) {
    $_GET["locaplic"] = "../..";
}

$locaplic = $_GET["locaplic"];
$elemento = $_GET["elemento"];
$doc = $_GET["doc"];
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=ISO-8859-1" />
<script src="<?php echo $locaplic;?>/pacotes/ol4/ol.js"></script>
<script src="<?php echo $locaplic;?>/js/i3geo.js"></script>
<script src="<?php echo $locaplic;?>/pacotes/yui290/build/slider/slider-min.js"></script>
<link rel='stylesheet' type='text/css' href='<?php echo $locaplic;?>/css/i3geo6.css' />
<style>
body {
	padding: 0;
	background-color: white;
}

#imagens {
	border: 1px solid #EBEBEB;
	height: 80px;
	overflow: auto;
	position: relative;
	text-align: center;
	width: 250px;
	left: 8px;
}

#cores {
	border: 1px solid #EBEBEB;
	height: 80px;
	overflow: auto;
	position: relative;
	text-align: center;
	width: 250px;
	left: 8px;
}

#imagens img {
	width: 236px;
	cursor: pointer;
	left: 10px;
	height: 20px;
}

#demo_bg {
	position: relative;
	background:
		url(<?php echo $locaplic;?>/pacotes/yui290/build/slider/assets/dual_thumb_bg.gif)
		0 5px no-repeat;
	height: 28px;
	width: 238px;
	left: 8px;
}

#demo_bg div {
	position: absolute;
	cursor: default;
	top: 4px;
}

/* Here's the highlight element */
#demo_bg span {
	position: absolute;
	background:
		url(<?php echo $locaplic;?>/pacotes/yui290/build/slider/assets/dual_thumb_highlight.gif)
		0 0 repeat-x;
	top: 10px;
	left: 12px;
	height: 13px;
	width: 226px;
}

#demo_bg .caution {
	background-position: 0 -13px;
}

#demo_bg .boom, #demo_bg .danger {
	background-position: 0 -26px;
}

/* We'll use the same class names for the status report region */
p .ok {
	color: #3a3;
	font-weight: bold;
	text-transform: uppercase;
}

p .caution {
	background: #ff3;
	color: #770;
	font-weight: bold;
	font-style: italic;
	padding: 0 1ex;
	text-transform: uppercase;
}

p .danger {
	color: #f33;
	font-weight: bold;
	text-decoration: blink;
	text-transform: uppercase;
}

p .boom {
	color: #fff;
	background: #000;
	padding: 0 1ex;
}
</style>
<title></title>
</head>
<body class=" yui-skin-sam" style="margin: 0px; width: 253px; text-align: left;">
    <p class=paragrafo style="position: relative; left: 6px; width: 100%;">
        Quantas cores voc&ecirc; quer gerar?
        <input id=ncores type=text size=3 value=<?php echo $_GET["ncores"]; ?> />
        <br> Clique para escolher o modelo de cores
    </p>
    <div id="imagens"></div>
    <div id="demo_bg" title="Range slider">
        <span id="demo_highlight"></span>
        <div id="demo_min_thumb">
            <img src="<?php echo $locaplic;?>/pacotes/yui290/build/slider/assets/l-thumb-round.gif">
        </div>
        <div id="demo_max_thumb">
            <img src="<?php echo $locaplic;?>/pacotes/yui290/build/slider/assets/r-thumb-round.gif">
        </div>
    </div>
    <p style="text-align: center; width: 250px">
        <span id="demo_range">0-255</span>
    </p>
    <div id=cores></div>
    <p style="position: relative; left: 6px; top: 5px; text-align: left;">
        <input id=voltar size="22" type="button" onclick="aplicarCores()" value="Aplicar cores">
        &nbsp;
    </p>
    <br>
    <p>Para atualizar a lista de cores geradas, clique novamente sobre a barra de cor. Voc&ecirc; pode tamb&eacute;m definir os limites inicial e final (use a barra deslizante) e alterar os valores
        obtidos editando diretamente o RGB</p>
    <script>
var lista = "<?php echo $lista;?>";
lista = lista.split(",");
var n = lista.length;
var ins = "";
for(var i=0; i<n; i++){
	ins += "<img title='"+lista[i]+" 'onclick='geracores(\""+lista[i]+"\")' src='<?php echo $locaplic;?>/symbols/colourramp/"+lista[i]+".gif' />";
}
$i("imagens").innerHTML = ins;

function geracores(codigo){
	var onde = $i("cores");
	if(onde.innerHTML == "Aguarde...")
	{return;}
	onde.innerHTML = "Aguarde..."
	var temp = function(data){
		onde.innerHTML = "";
		var ins = "<table class=lista6 >",
			n = data.length,
			i,
			cor;
		for(i in data){
			try{
				if(data[i].r != undefined){
					cor = data[i].r+","+data[i].g+","+data[i].b;
					ins += "<tr><td style='width:10px'><img src='<?php echo $locaplic;?>/imagens/x.png' style='cursor:pointer;' title='excluir' onclick='javascript:$i(\"cor_"+cor+"\").style.display=\"none\";this.style.display=\"none\"' </td><td style='width:100%' ><p id='cor_"+cor+"' style='width:100%;heigth:10px;background-color:rgb("+cor+")'><input onchange='javascript:$i(\"cor_"+cor+"\").style.backgroundColor=this.value;' type=text size=17 value=\"rgb("+cor+")\"/></p></td></tr>";
				}
			}catch(e){}
		}
		onde.innerHTML = ins+"</table>";
	};
	var nobj = $i("ncores");
	if(nobj.value > 255)
	{nobj.value = 255;}
	if(nobj.value > (slider.maxVal - slider.minVal))
	{nobj.value = slider.maxVal - slider.minVal;}
	i3GEO.configura.sid = window.parent.i3GEO.configura.sid;
    i3GEO.request.get({
        snackbar: false,
        snackbarmsg: false,
        btn: false,
        par: {
            funcao: "getColourRamp",
            id: codigo,
            start: slider.minVal,
            end: slider.maxVal,
            numcolors: nobj.value
        },
        prog: "<?php echo $locaplic;?>/serverapi/class/",
        fn: function(data){
            temp(data);
        }
    });
}

//
//utilize tipo para definir o tipo de cor de retorno
//
function aplicarCores()
{
	navm = false; // IE
	navn = false; // netscape
	var app = navigator.appName.substring(0,1);
	if (app=='N') navn=true; else navm=true;
	try{
		var doc = "<?php echo $doc; ?>";
		if(doc != "")
		{var doc = (navm) ? window.parent.frames(doc).document : window.parent.document.getElementById(doc).contentDocument;}
		else
		{var doc = window.parent.document;}
	}
	catch(e){var doc = window.parent.document;}
	var elemento = "<?php echo $elemento; ?>";
	var inputs = $i("cores").getElementsByTagName("input");
	var n = inputs.length;
	var i;
	var listaRGB = [];
	for(i=0;i<n;i++){
		if(inputs[i].parentNode.style.display !== "none")
		{listaRGB.push(inputs[i].value);}
	}

	doc.getElementById(elemento).value = listaRGB.join("|");
	try{
		doc.getElementById(elemento).onchange.call();
	}
	catch(e){}
	window.parent.YAHOO.i3GEO.janela.manager.find("i3geo_janelaCorRamp").destroy();
}

(function () {
    YAHOO.namespace('example');

    var Dom = YAHOO.util.Dom;

    // Slider has a range of 300 pixels
    var range = 235;

    // Set up 12 pixel ticks
    var tickSize = 1;

    // Some arbitrary ranges to cue status changes
    var caution_range = 10,
        danger_range  = 5,
        boom_range    = 0;

    YAHOO.util.Event.onDOMReady(function () {
        var reportSpan     = Dom.get("demo_range");
        var calculatedSpan = Dom.get("demo_value");

        // Create the DualSlider
        slider = YAHOO.widget.Slider.getHorizDualSlider("demo_bg",
            "demo_min_thumb", "demo_max_thumb",
            range, tickSize);

        // Decorate the DualSlider instance with some new properties and
        // methods to maintain the highlight element
        YAHOO.lang.augmentObject(slider, {

            // The current status
            _status : 'ok',

            // The highlight element
            _highlight : Dom.get("demo_highlight"),

            // A simple getter method for the status
            getStatus : function () { return this._status; },

            // A method to update the status and update the highlight
            updateHighlight : function () {
                var delta = this.maxVal - this.minVal,
                    newStatus = 'ok';

                if (delta < boom_range) {
                    newStatus = 'boom';
                } else if (delta < danger_range) {
                    newStatus = 'danger';
                } else if (delta < caution_range) {
                    newStatus = 'caution';
                }

                if (this._status !== newStatus) {
                    // Update the highlight class if status is changed
                    Dom.replaceClass(this._highlight,this._status,newStatus);
                    this._status = newStatus;
                }
                if (this.activeSlider === this.minSlider) {
                    // If the min thumb moved, move the highlight's left edge
                    Dom.setStyle(this._highlight,'left', (this.minVal + 12) + 'px');
                }
                // Adjust the width of the highlight to match inner boundary
                Dom.setStyle(this._highlight,'width', Math.max(delta - 12,0) + 'px');
            }
        },true);

        // Attach the highlight method to the slider's change event
        slider.subscribe('change',slider.updateHighlight,slider,true);

        // Create an event callback to update some display fields
        var report = function () {
            reportSpan.innerHTML = slider.minVal + ' - ' + slider.maxVal;
            // Call our conversion function
            calculatedSpan.innerHTML =
            calculatedSpan.className = slider.getStatus();
        };

        // Subscribe to the slider's change event to report the status.
        slider.subscribe('change',report);

        // Attach the slider to the YAHOO.example namespace for public probing
        YAHOO.example.slider = slider;
    });
})();

</script>
</body>
</html>