/*
About: Licença

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
parametrosURL()
var endereco = window.location.protocol+"//"+window.location.host
var tema = window.location.href.split("=")
var tema = tema[1].split(",");
var tipo = tema[1]
var tema = tema[0]
var endereco = "<p><b>Kml com 'GroundOverlay' baseado em um servico WMS: </b></p><p>"+g_locaplic+"/pacotes/kmlmapserver/kmlservice.php?map="+tema+"&typename="+tema+"&request=kml"
if(tipo == "kmz")
endereco += "<p><b>Kmz que gera um arquivo kml vetorial: </b></p><p>"+g_locaplic+"/pacotes/kmlmapserver/kmlservice.php?map="+tema+"&typename="+tema+"&request=kmz"
$i("resultado").innerHTML = endereco
$i("men1").innerHTML += "<br><br><b>Voc&ecirc; pode também utilizar o link <span style=color:red >"+g_locaplic+"/kml.php </span><br>para mostrar a &aacute;rvore completa de temas no GoogleEarth"