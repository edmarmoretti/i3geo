<?php
include ("../../ms_configura.php");
include ("../blacklist.php");
verificaBlFerramentas(basename(dirname(__FILE__)), $i3geoBlFerramentas, false);
?>
<html>
<head>
<script type="text/javascript" src="https://maps.google.com/maps/api/js?key=<?php echo $googleApiKey; ?>"></script>
<script src="index.js" type="text/javascript"></script>

</head>
<body onload="inicializa();">
    <div id="mapa" style="width: calc(100% - 20); height: calc(100% - 20)"></div>
</body>
<script>
const i3GEO = window.parent.i3GEO;
MARCA = false;
ATUALIZABOX = false;
$i = function(id){
    return window.parent.document.getElementById(id);
};
function inicializa(){
    window.parent.console.log("inicializando o googlemaps");
    if(i3GEO.parametros.googleApiKey == ""){
        i3GEO.janela.tempoMsg("Essa instala&ccedil;&atilde;o do i3Geo n&atilde;o possu&iacute; uma chave da API do GoogleMaps. Algumas opera&ccedil;&otilde;es podem ficar bloqueadas.");
    }
    counterClick = 0;
    var m = document.getElementById("mapa"),
        nz = 8,
        coordenadas = false,
        pol,ret,pt1,pt2,centro;

    m.style.width = i3GEO.parametros.w - 40 + "px";
    m.style.height = (i3GEO.parametros.h / 2) - 110 + "px";
    i3geoOverlay = false;
    try{
        coordenadas = i3GEO.navega.dialogo.google.coordenadas;
    }
    catch(e){}
    pol = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
    ret = pol.split(" ");
    pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1;
    pt2 = ((((ret[1] - ret[3]) / 2)* -1)*1.5) + (ret[1] *1);

    centro = new google.maps.LatLng(pt2,pt1);
    nz = window.parent.i3geoOL.getZoom() + 2;
    map = new google.maps.Map(m,{zoom:nz,center:centro,scaleControl:true,mapTypeControl:true,streetViewControl:true,zoomControl:true,mapTypeId:google.maps.MapTypeId.SATELLITE});
    if(coordenadas != false){
        adicionaMarcasMapa(coordenadas);
    }
    google.maps.event.addListener(map, "moveend", function() {
        ondegoogle(map);
    });
    google.maps.event.addListener(map, "bounds_changed", function() {
            //evita loop entre os eventos do i3geo e do googlemaps
            if(ATUALIZABOX === true){
                var bd = map.getBounds();
                var centro = bd.getCenter();
                //i3GEO.Interface[i3GEO.Interface.ATUAL].pan2ponto(centro.lng(),centro.lat());
            }
            ATUALIZABOX = true;
            ondegoogle();
    });
    google.maps.event.addListener(map, "mousemove", function(ponto) {
        var teladms,temp,
            mapexten = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten),
            x = ponto.latLng.lng(),
            y = ponto.latLng.lat();
        teladms = i3GEO.calculo.dd2dms(x,y);
        window.parent.objposicaocursor = {
            ddx: x,
            ddy: y,
            dmsx: teladms[0],
            dmsy: teladms[1],
            imgx:0,
            imgy:0,
            telax: 0,
            telay: 0
        };
        i3GEO.eventos.mousemoveMapa();
        temp = mapexten.split(" ");
        if(x < temp[2] && y < temp[3]){
            if(MARCA === false){
                MARCA = i3GEO.desenho.addPin({
        		    x: x,
        		    y: y,
        		    namespace: "googlemaps"
        		});
            }
            else{
                i3GEO.desenho.movePin(MARCA,x,y);
            }
        }
    });
    ondegoogle(map);
    botaoRota();
    if(coordenadas){
        adicionaMarcasMapa(coordenadas);
    }
}
function botaoRota(){
    var controlDiv = document.createElement('div');
    controlDiv.index = 1;
    controlDiv.style.padding = '5px';
    // Set CSS for the control border
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = 'white';
    controlUI.style.borderStyle = 'solid';
    controlUI.style.borderWidth = '2px';
    controlUI.style.cursor = 'pointer';
    controlUI.style.textAlign = 'center';
    controlUI.title = '';
    controlDiv.appendChild(controlUI);
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Arial,sans-serif';
    controlText.style.fontSize = '12px';
    controlText.style.paddingLeft = '4px';
    controlText.style.paddingRight = '4px';
    controlText.innerHTML = '<b>Rota</b>';
    controlUI.appendChild(controlText);
    google.maps.event.addDomListener(controlUI, 'click', function() {
        ativaI3geoRota();
    });
    map.controls[google.maps.ControlPosition.TOP_RIGHT].push(controlDiv);
}
/*
Function: ondegoogle

Mostra, no mapa principal, um retangulo indicando a extens&atilde;o geogr&aacute;fica do mapa mostrado na janela do GM
*/
function ondegoogle(){
    var b = bbox();
    b = b.split(" ");
    i3GEO.desenho.removePins("boxOndeGoogle");
    i3GEO.desenho.addBox(b[0], b[1], b[2], b[3], "boxOndeGoogle");
}
/*
Function: panTogoogle

Desloca o mapa do google quando o mapa principal e deslocado
*/
function panTogoogle(){
    window.parent.console.log("-- panTogoogle()");
    ATUALIZABOX = false;
    var pol = i3GEO.util.extOSM2Geo(i3GEO.parametros.mapexten);
    var ret = pol.split(" ");
    var pt1 = (( (ret[0] * -1) - (ret[2] * -1) ) / 2) + ret[0] *1;
    var pt2 = ((((ret[1] - ret[3]) / 2)* -1)*1.5) + (ret[1] *1);

    map.panTo(new google.maps.LatLng(pt2,pt1));
}
/*
Function: bbox

Obt&eacute;m os valores de extens&atilde;o geogr&aacute;fica do GM e converte para uma string no formato aceito pelo i3Geo

Return:

{String} - xmin ymin xmax ymax
*/
function bbox(){
    var bd = map.getBounds();
    var so = bd.getSouthWest();
    var ne = bd.getNorthEast();
    var bbox = so.lng()+" "+so.lat()+" "+ne.lng()+" "+ne.lat();
    return (bbox);
}
/*
Function: ativaI3geoRota

Inicia a fun&ccedil;&atilde;o de cria&ccedil;&atilde;o de rotas, solicitando a indica&ccedil;&atilde;o do primeiro ponto
*/
function ativaI3geoRota(){
    rotaEvento = google.maps.event.addListener(map, "click", parametrosRota);
    i3GEO.janela.tempoMsg("Clique o ponto de origem da rota");
    counterClick++;
}
/*
Function: parametrosRota

Obt&eacute;m os parametros para cria&ccedil;&atilde;o da rota, inclusive o ponto de destino
*/
function parametrosRota(overlay){
    if(counterClick == 1){
        counterClick++;
        i3GEO.janela.tempoMsg("Clique o ponto de destino da rota");
        pontoRota1 = overlay.latLng;
        return;
    }
    if(counterClick == 2){
        pontoRota2 = overlay.latLng;
        counterClick = 0;
        google.maps.event.removeListener(rotaEvento);
        constroiRota();
    }
}
/*
Function: constroiRota

Cria a rota do ponto de origem ao ponto de destino
*/
function constroiRota(){
    var pt2 = function(response,status){
        if (status == google.maps.GeocoderStatus.OK) {
            var place = response[0];
            endereco2 = place.formatted_address;
            endereco2 = i3GEO.janela.prompt(
                "Confirme o endereco do final",
                function(){
                    montaRota();
                },
                endereco2
            );
        }
        else{
            i3GEO.janela.tempoMsg("Ocorreu um erro");
        }
    };
    var pt1 = function(response,status){
        //map.clearOverlays();
        if (status == google.maps.GeocoderStatus.OK) {
            var place = response[0];
            endereco1 = place.formatted_address;
            endereco1 = i3GEO.janela.prompt(
                "Confirme o endereco do inicio",
                function(){
                    geocoder.geocode(
                        {'location':pontoRota2},
                        pt2
                    );
                },
                endereco1
            );
        }
        else{
            i3GEO.janela.tempoMsg("Ocorreu um erro");
        }
    };
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode(
        {'location':pontoRota1},
        pt1
    );
}

/*
Function: adicionaMarcasMapa

Adiciona marcas no mapa conforme um array de coordenadas

Parametro:

coordenadas {array} - array de pares separados por ' ' contendo x e y
*/
function adicionaMarcasMapa(coordenadas){
    if(coordenadas){
        var n = coordenadas.length,i,pt,point,marker;
        for(i=0;i<n;i++){
            pt = coordenadas[i].split(" ");
            point = new google.maps.LatLng(pt[1],pt[0]);
            marker = new google.maps.Marker({
                    position : point
                });
            //marker = new GMarker(point);
            marker.setMap(map);
        }
    }
}
</script>
</html>
