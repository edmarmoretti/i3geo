
<div data-tutorial="coordenadas" class="localizarxy fundoRodape hidden-xs hidden-sm">
    <div class="dropdown dropup">
        <a style="color: white;" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
            <span style="vertical-align: middle" class="material-icons">playlist_add_check</span>
        </a>
        <ul class="dropdown-menu dropdown-menu">
            <li><a onclick="i3GEO.coordenadas.mudaTipo({value:'geoProj'},'localizarxy')" href="javascript:void(0)"> DMS </a></li>
            <li><a onclick="i3GEO.coordenadas.mudaTipo({value:'janela'},'localizarxy')" href="javascript:void(0)"> Janela </a></li>
            <li><a onclick="i3GEO.coordenadas.mudaTipo({value:'dd'},'localizarxy')" href="javascript:void(0)"> Dec. de grau </a></li>
            <li><a onclick="i3GEO.coordenadas.mudaTipo({value:'geohash'},'localizarxy')" href="javascript:void(0)"> GeoHash </a></li>
            <li><a onclick="i3GEO.coordenadas.mudaTipo({value:'utmSirgas2000Proj'},'localizarxy')" href="javascript:void(0)"> UTM Sirgas </a></li>
            <!--
                <li><a onclick="i3GEO.coordenadas.mudaTipo({value:'utmSad69Proj'},'localizarxy')" href="javascript:void(0)">
                        UTM Sad-69
                    </a></li>
                <li><a onclick="i3GEO.coordenadas.mudaTipo({value:'policonicaSad69'},'localizarxy')" href="javascript:void(0)">
                        Polic SAD-69
                    </a></li>
                 -->
        </ul>
    </div>
    <div class="i3GeoMascaraCoord" id="localizarxygeoProj" style="display: block; position: absolute; top: 0px; left: 30px;">
        X:
        <input name="" value="-00" size="3" title="grau" id="localizarxygeoProjxg" type="text">
        <input name="" value="00" size="2" title="minuto" id="localizarxygeoProjxm" type="text">
        <input name="" value="00.00" size="5" title="segundo" id="localizarxygeoProjxs" type="text">
        Y:
        <input name="" value="-00" size="3" title="grau" id="localizarxygeoProjyg" type="text">
        <input name="" value="00" size="2" title="minuto" id="localizarxygeoProjym" type="text">
        <input name="" value="00.00" size="5" title="segundo" id="localizarxygeoProjys" type="text">
        <img class="ticfind" style="margin-left: 0px;" title="zoom" onclick="i3GEO.coordenadas.zoomPontoGeo()" src="../imagens/branco.gif">
    </div>
    <div id="localizarxydd" class="i3GeoMascaraCoord" style="display: none; position: absolute; top: 0px; left: 60px;">
        X:
        <input name="" value="00" size="12" title="X" id="localizarxyddX" type="text">
        Y:
        <input name="" value="00" size="12" title="Y" id="localizarxyddY" type="text">
    </div>
    <div id="localizarxygeohash" class="i3GeoMascaraCoord" style="display: none; position: absolute; top: 0px; left: 60px;">
        GeoHash
        <input name="" value="00" size="12" title="Cod" id="localizarxygeohashCodigo" type="text">
        <img class="ticfind" style="margin-left: 8px;" title="zoom" onclick="i3GEO.coordenadas.geohash.zoomCodigo('localizarxygeohashCodigo')" src="../imagens/branco.gif">
    </div>
    <div id="localizarxypoliconicaSad69" class="i3GeoMascaraCoord" style="display: none; position: absolute; top: 0px; left: 60px;">
        X:
        <input name="" value="00" size="12" title="X" id="localizarxypoliconicaSad69X" type="text">
        Y:
        <input name="" value="00" size="12" title="Y" id="localizarxypoliconicaSad69Y" type="text">
    </div>
    <div id="localizarxyutmSad69Proj" class="i3GeoMascaraCoord" style="display: none; position: absolute; top: 0px; left: 60px;">
        X:
        <input name="" value="00" size="12" title="X" id="localizarxyutmSad69ProjX" type="text">
        Y:
        <input name="" value="00" size="12" title="Y" id="localizarxyutmSad69ProjY" type="text">
        Zn:
        <input name="" value="--" size="2" title="Zona" id="localizarxyutmSad69ProjZN" type="text">
    </div>
    <div id="localizarxyutmSirgas2000Proj" class="i3GeoMascaraCoord" style="display: none; position: absolute; top: 0px; left: 60px;">
        X:
        <input name="" value="00" size="12" title="X" id="localizarxyutmSirgas2000ProjX" type="text">
        Y:
        <input name="" value="00" size="12" title="Y" id="localizarxyutmSirgas2000ProjY" type="text">
        Zn:
        <input name="" value="--" size="2" title="Zona" id="localizarxyutmSirgas2000ProjZN" type="text">
    </div>
</div>