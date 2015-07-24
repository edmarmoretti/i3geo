/**
 * Title: Coordenadas
 *
 * Inclui elementos HTML especiais no mapa para apresenta&ccedil;&atilde;o de
 * coordenadas.
 *
 * Cont&eacute;m fun&ccedil;&otilde;es que permitem a convers&atilde;o de
 * coordenadas, entre sistemas de proje&ccedil;&atilde;o deiferentes, com base
 * na biblioteca Proj4js. Cria tamb&eacute;m o bloco de
 * apresenta&ccedil;&atilde;o de coordenadas com base na posi&ccedil;&atilde;o
 * do mouse sobre o mapa. Mais informa&ccedil;&otilde;es em
 * http://trac.osgeo.org/proj4js/ Para adicionar novas proje&ccedil;&otilde;es
 * ou modificar as atuais, edit a vari&aacute;vel i3GEO.coordenadas.config e
 * defOrigem
 *
 * Namespace:
 *
 * i3GEO.coordenadas
 *
 * Veja:
 *
 * <http://localhost/i3geo/classesjs/classe_coordenadas.js>
 */
/**
 *
 * Licen&ccedil;a
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a
 * P&uacute;blica Geral GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til, por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a
 * garantia impl&iacute;cita de COMERCIABILIDADE OU ADEQUAC&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA. Consulte a Licen&ccedil;a
 * P&uacute;blica Geral do GNU para mais detalhes. Voc&ecirc; deve ter recebido uma c&oacute;pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a Free Software Foundation, Inc., no endere&ccedil;o 59 Temple Street, Suite
 * 330, Boston, MA 02111-1307 USA.
 */
if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.coordenadas =
	{
		/**
		 * Propriedade: formato
		 *
		 * Formato de apresenta&ccedil;&atilde;o das coordenadas
		 *
		 * Type:
		 *
		 * {string}
		 *
		 * Default:
		 *
		 * lista
		 *
		 * Valores:
		 *
		 * bloco - mostra apenas um dos tipos e uma caixa de sele&ccedil;&atilde;o
		 *
		 * separado - mostra todos os tipos em lugares diferentes conforme o valor de idhtml
		 *
		 * lista - mostra cada tipo em um lugar diferente conforme o valor de idhtml
		 *
		 * janela - cria uma janela flutuante para mostrar os dados
		 *
		 */
		formato : "bloco",
		/**
		 * Propriedade: padrao
		 *
		 * Indica qual tipo de coordenada &eacute; mostrado como padr&atilde;o quando formato for igual a "bloco".
		 *
		 * Deve existir em i3GEO.coordenadas.config
		 *
		 * Type:
		 *
		 * {String}
		 *
		 * Default:
		 *
		 * geoProj
		 */
		padrao : "geoProj", // so faz sentido se formato for bloco
		/**
		 * Propriedade: defOrigem
		 *
		 * CRS que define a proje&ccedil;&atilde;o original das coordenadas capturadas na tela. Deve ser o mesmo parametro definido no
		 * mapfile de inicializa&ccedil;&atilde;o do mapa (veja em i3geo/aplicmap/geral1.map ou geral1windows.map)
		 *
		 * Type:
		 *
		 * {String}
		 *
		 * Default:
		 *
		 * "+proj=longlat +ellps=GRS67 +no_defs"
		 */
		defOrigem : "+proj=longlat +ellps=GRS67 +no_defs", // sad69 geo
		/**
		 * Propriedade: config
		 *
		 * Define as configura&ccedil;&otilde;es de cada tipo de coordenada que ser&aacute; utilizada e/ou mostrada no mapa
		 *
		 * Para alterar os parametros ou acrescentar novas proje&ccedil;&otilde;es, altere esse objeto
		 *
		 * Para mais detalhes, veja i3geo/classesjs/classe_coordenada.js
		 *
		 * Para desativar a apresenta&ccedil;&atilde;o de uma proje&ccedil;&atilde;o altere o valor de "ativo".
		 *
		 * Exemplo:
		 *
		 * (start code) i3GEO.coordenadas.config = { "geoProj" : { idhtml : "localizarxy", tipo : "geo", //geo|codigo|utm|metrica titulo :
		 * "Geo", ativo : true, defepsg : "", zona: { "19N" : "+proj=utm +zone=19 +ellps=aust_SA +units=m +no_defs", "20N" : "+proj=utm
		 * +zone=20 +ellps=aust_SA +units=m +no_defs" } } } (end)
		 *
		 * Type:
		 *
		 * {Objeto}
		 */
		config : {
			"geoProj" : {
				idhtml : "localizarxy",
				tipo : "geo",
				titulo : "Geo",
				ativo : true,
				defepsg : ""
			},
			"dd" : {
				idhtml : "localizarxy",
				tipo : "metrica",
				titulo : "D&eacute;c. de grau",
				ativo : true,
				defepsg : ""
			},
			"geohash" : {
				idhtml : "localizarxy",
				tipo : "codigo",
				tipoCodigo : "geohash",
				titulo : "GeoHash",
				ativo : true
			},
			"policonicaSad69" : {
				idhtml : "localizarxy",
				tipo : "metrica",
				titulo : "Polic SAD-69",
				ativo : true,
				defepsg : "+proj=poly +lat_0=0 +lon_0=-54 +x_0=5000000 +y_0=10000000 +ellps=aust_SA +units=m +no_defs"
			},
			"utmSad69Proj" : {
				idhtml : "localizarxy",
				tipo : "utm",
				titulo : "UTM Sad-69",
				ativo : true,
				defepsg : "",
				zona : {
					"19N" : "+proj=utm +zone=19 +ellps=aust_SA +units=m +no_defs",
					"20N" : "+proj=utm +zone=20 +ellps=aust_SA +units=m +no_defs",
					"21N" : "+proj=utm +zone=21 +ellps=aust_SA +units=m +no_defs",
					"22N" : "+proj=utm +zone=22 +ellps=aust_SA +units=m +no_defs",
					"17S" : "+proj=utm +zone=17 +south +ellps=aust_SA +units=m +no_defs",
					"18S" : "+proj=utm +zone=18 +south +ellps=aust_SA +units=m +no_defs",
					"19S" : "+proj=utm +zone=19 +south +ellps=aust_SA +units=m +no_defs",
					"20S" : "+proj=utm +zone=20 +south +ellps=aust_SA +units=m +no_defs",
					"21S" : "+proj=utm +zone=21 +south +ellps=aust_SA +units=m +no_defs",
					"22S" : "+proj=utm +zone=22 +south +ellps=aust_SA +units=m +no_defs",
					"23S" : "+proj=utm +zone=23 +south +ellps=aust_SA +units=m +no_defs",
					"24S" : "+proj=utm +zone=24 +south +ellps=aust_SA +units=m +no_defs",
					"25S" : "+proj=utm +zone=25 +south +ellps=aust_SA +units=m +no_defs"
				}
			},
			"utmSirgas2000Proj" : {
				idhtml : "localizarxy",
				tipo : "utm",
				titulo : "UTM Sirgas",
				ativo : true,
				defepsg : "",
				zona : {
					"11N" : "+proj=utm +zone=11 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"12N" : "+proj=utm +zone=12 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"13N" : "+proj=utm +zone=13 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"14N" : "+proj=utm +zone=14 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"15N" : "+proj=utm +zone=15 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"16N" : "+proj=utm +zone=16 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"17N" : "+proj=utm +zone=17 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"18N" : "+proj=utm +zone=18 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"19N" : "+proj=utm +zone=19 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"20N" : "+proj=utm +zone=20 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"21N" : "+proj=utm +zone=21 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"22N" : "+proj=utm +zone=22 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"17S" : "+proj=utm +zone=17 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"18S" : "+proj=utm +zone=18 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"19S" : "+proj=utm +zone=19 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"20S" : "+proj=utm +zone=20 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"21S" : "+proj=utm +zone=21 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"22S" : "+proj=utm +zone=22 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"23S" : "+proj=utm +zone=23 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"24S" : "+proj=utm +zone=24 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs",
					"25S" : "+proj=utm +zone=25 +south +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs"
				}
			}
		},
		/**
		 * Parametros de inicializa&ccedil;&atilde;o dos componentes.
		 *
		 * Essa vari&aacute;vel define os parametros individuais de cada componente que pode ser utilizado no mapa.
		 *
		 * Voc&ecirc; pode acessar os parametros da seguinte forma:
		 *
		 * i3GEO.coordenadas.PARAMETROS.mostraCoordenadas.idhtml = "";
		 *
		 *
		 * Default:
		 *
		 * i3GEO.coordenadas.PARAMETROS = {
		 *
		 * "mostraCoordenadasUTM":
		 *
		 * {idhtml:"mostraUTM"},
		 *
		 * "mostraCoordenadasGEO":
		 *
		 * {idhtml:"localizarxy"} }
		 *
		 * Tipo: {objeto}
		 */
		PARAMETROS : {
			"mostraCoordenadasUTM" : {
				idhtml : "localizarxy"
			},
			"mostraCoordenadasGEO" : {
				idhtml : "localizarxy"
			},
			"mostraCoordenadasGeohash" : {
				idhtml : "localizarxy"
			}
		},
		/**
		 * Variavel: MODOTEXTO
		 *
		 * Armazena a representa&ccedil;&atilde;o das coordenadas no modo texto conforme a posi&ccedil;&atilde;o do mouse
		 *
		 * Type:
		 *
		 * {String}
		 */
		MODOTEXTO : "",
		/**
		 * Function: mostraCoordenadasGEO
		 *
		 * Obt&eacute;m e mostra as coordenadas Geogr&aacute;ficas da posi&ccedil;&atilde;o do mouse sobre o mapa.
		 *
		 * Se voc&ecirc; n&atilde;o quer essa fun&ccedil;&atilde;o no mapa, elimine o elemento HTML que contenha o id definido em
		 * i3GEO.coordenadas.PARAMETROS, por default &eacute; "localizarxy"
		 *
		 * Parametro:
		 *
		 * {String} - id do elemento HTML que receber&aacute; o resultado. Esse id por default &eacute; obtido de
		 * i3GEO.coordenadas.PARAMETROS
		 */
		mostraCoordenadasGEO : function(id) {
			if (typeof (console) !== 'undefined')
				console.info("i3GEO.coordenadas.mostraCoordenadasGEO()");

			try {
				if (arguments.length === 0 || id === "" || typeof (id) === 'undefined') {
					id = this.PARAMETROS.mostraCoordenadasGEO.idhtml;
				} else {
					this.PARAMETROS.mostraCoordenadasGEO.idhtml = id;
				}
				if ($i(id)) {
					if (!$i("coordgeotabela")) {
						$i(id).innerHTML = i3GEO.coordenadas.criaMascaraDMS("coordgeotabela");
						if (i3GEO.Interface.TABLET === true) {
							i3GEO.eventos.adicionaEventos("MOUSECLIQUE", [
								"i3GEO.coordenadas.atualizaLocalizarGeo()"
							]);
						} else {
							i3GEO.eventos.adicionaEventos("MOUSEMOVE", [
								"i3GEO.coordenadas.atualizaLocalizarGeo()"
							]);
						}
					}
				}
			} catch (e) {
				i3GEO.janela.tempoMsg("mostraCoordenadasGeo: " + e.description);
			}
		},
		/**
		 * Function: atualizaLocalizarGeo
		 *
		 * Atualiza os valores do componente que mostra as coordenadas do mouse em GEO
		 *
		 * Parametros:
		 *
		 * {string} - (opcional) id do componente. Se nao for definido assume como "coordgeotabela"
		 *
		 * {string} - (opcional) se nao for definido sera utilizado objposicaocursor.dmsx
		 *
		 * {string} - (opcional) se nao for definido sera utilizado objposicaocursor.dmsy
		 */
		atualizaLocalizarGeo : function(id, x, y) {
			if (!id) {
				id = "coordgeotabela";
			}
			if (typeof (x) === 'undefined') {
				x = objposicaocursor.dmsx;
			}
			if (typeof (y) === 'undefined') {
				y = objposicaocursor.dmsy;
			}
			var temp = $i(id);
			if (temp && temp.style.display === "block") {
				i3GEO.coordenadas.atualizaGeo(x, y, id);
			}
		},
		/**
		 * Function: geo2zonaUtm
		 *
		 * Determina qual &eacute; a zona UTM de um par de coordenadas geogr&aacute;ficas
		 *
		 * Parametros:
		 *
		 * {Numeric} - longitude em d&eacute;cimos de grau
		 *
		 * Return:
		 *
		 * {number} - zona UTM
		 */
		geo2zonaUtm : function(l) {
			l = (l * 1) + 180;
			l = l / 6;
			return parseInt(l, 10) + 1;
		},
		/**
		 * Function: criaMascaraDMS
		 *
		 * Cria uma tabela para mostrar as coordenadas no padr&atilde;o grau minuto e segundo
		 *
		 * A tabela criada receber&aacute; o id = prefixo
		 *
		 * Parametro:
		 *
		 * {String} - prefixo para batizar os ids dos elementos que ser&atilde;o criados
		 *
		 * Retorno:
		 *
		 * {string} - html com a tabela
		 */
		criaMascaraDMS : function(prefixo, titulo, caixa) {
			var ins =
				'<table class="i3GeoMascaraCoord" id=' + prefixo
					+ ' ><tr>'
					+ "<td class='contemCaixaTipoCoord' >"
					+ caixa
					+ "&nbsp;</td>"
					+ '<td style=width:10px;text-align:right >&nbsp;X:&nbsp;</td>'
					+ '<td>'
					+ $inputText('', '', prefixo + 'xg', 'grau', '3', '-00')
					+ '</td>'
					+ '<td>'
					+ $inputText('', '', prefixo + 'xm', 'minuto', '2', '00')
					+ '</td>'
					+ '<td>'
					+ $inputText('', '', prefixo + 'xs', 'segundo', '5', '00.00')
					+ '</td>'
					+ '<td>&nbsp;Y:&nbsp;'
					+ $inputText('', '', prefixo + 'yg', 'grau', '3', '-00')
					+ '</td>'
					+ '<td>'
					+ $inputText('', '', prefixo + 'ym', 'minuto', '2', '00')
					+ '</td>'
					+ '<td>'
					+ $inputText('', '', prefixo + 'ys', 'segundo', '5', '00.00')
					+ '</td>', temp =
				'var ' + prefixo
					+ 'xxx = i3GEO.calculo.dms2dd($i(\''
					+ prefixo
					+ 'xg\').value,$i(\''
					+ prefixo
					+ 'xm\').value,$i(\''
					+ prefixo
					+ 'xs\').value);'
					+ 'var '
					+ prefixo
					+ 'yyy = i3GEO.calculo.dms2dd($i(\''
					+ prefixo
					+ 'yg\').value,$i(\''
					+ prefixo
					+ 'ym\').value,$i(\''
					+ prefixo
					+ 'ys\').value);'
					+ 'i3GEO.navega.zoomponto(i3GEO.configura.locaplic,i3GEO.configura.sid,'
					+ prefixo
					+ 'xxx,'
					+ prefixo
					+ 'yyy);';
			ins +=
				'<td><img class=ticfind style="margin-left:8px;" title=zoom onclick="' + temp
					+ '" src="'
					+ i3GEO.configura.locaplic
					+ "/imagens/branco.gif"
					+ '" /></td>'
					+ "</tr></table>";
			return ins;
		},
		/**
		 * Function: atualizaGeo
		 *
		 * Atualiza os valores em uma tabela do tipo DMS
		 *
		 * Caso o elemento HTML com id igual a prefixo + "xg" n&atilde;o existir, apenas i3GEO.coordenadas.MODOTEXTO ser&aacute; atualizado
		 *
		 * Parametros:
		 *
		 * {string} - valors de longitude em "d m s"
		 *
		 * {string} - valors de latitude em "d m s"
		 *
		 * {string} - prefixo da tabela (veja criaMascaraDMS)
		 *
		 */
		atualizaGeo : function(dmsx, dmsy, prefixo) {
			var x = dmsx.split(" "), y = dmsy.split(" ");
			if ($i(prefixo + "xg")) {
				$i(prefixo + "xg").value = x[0];
				$i(prefixo + "xm").value = x[1];
				$i(prefixo + "xs").value = x[2];
				$i(prefixo + "yg").value = y[0];
				$i(prefixo + "ym").value = y[1];
				$i(prefixo + "ys").value = y[2];
			}
			i3GEO.coordenadas.MODOTEXTO +=
				"DMS - Latitude: " + y[0] + " " + y[1] + " " + y[2] + " Longitude: " + x[0] + " " + x[1] + " " + x[2] + "<br><br>";
		},
		/**
		 * Function: criaMascaraMetrica
		 *
		 * Cria uma tabela para mostrar as coordenadas no padr&atilde;o m&eacute;trico (x e y)
		 *
		 * A tabela criada receber&aacute; o id prefixo+"tabela"
		 *
		 * Parametro:
		 *
		 * {string} - prefixo para batizar os ids dos elementos que ser&atilde;o criados
		 *
		 * {string} - (opcional) caixa de sele&ccedil;&atilde;o de tipos
		 *
		 * Retorno:
		 *
		 * {string} - html com a tabela
		 */
		criaMascaraMetrica : function(prefixo, titulo, caixa) {
			var ins =
				"<table id=" + prefixo
					+ " class='i3GeoMascaraCoord' ><tr>"
					+ "<td class='contemCaixaTipoCoord'>"
					+ caixa
					+ "&nbsp;<td>"
					+ "<td style=width:100px;text-align:right >"
					+ titulo
					+ " X:&nbsp;</td>"
					+ "<td>"
					+ $inputText("", "", prefixo + "X", "X", "12", "00")
					+ "&nbsp;</td>"
					+ "<td>Y:"
					+ $inputText("", "", prefixo + "Y", "Y", "12", "00")
					+ "&nbsp;</td>"
					+ "<td>Zn:"
					+ $inputText("", "", prefixo + "ZN", "Zona", "2", "--")
					+ "&nbsp;</td>"
					+ "</tr></table>";
			return ins;
		},
		/**
		 * Function: criaMascaraCodigo
		 *
		 * Cria uma tabela para mostrar as coordenadas no padr&atilde;o de codigo, como no caso de geohash
		 *
		 * A tabela criada receber&aacute; o id prefixo+"tabela"
		 *
		 * Parametro:
		 *
		 * {string} - prefixo para batizar os ids dos elementos que ser&atilde;o criados
		 *
		 * {string} - (opcional) caixa de sele&ccedil;&atilde;o de tipos
		 *
		 * Retorno:
		 *
		 * {string} - html com a tabela
		 */
		criaMascaraCodigo : function(prefixo, titulo, caixa, tipoCodigo) {
			var funcao = "", ins = "";

			if (tipoCodigo === "geohash") {
				funcao = "i3GEO.coordenadas.geohash.zoomCodigo(\'" + prefixo + "Codigo\')";
			}
			ins =
				"<table id=" + prefixo
					+ " class='i3GeoMascaraCoord' ><tr>"
					+ "<td class='contemCaixaTipoCoord'>"
					+ caixa
					+ "&nbsp;<td>"
					+ "<td style=width:100px;text-align:right >"
					+ titulo
					+ " :&nbsp;</td>"
					+ "<td>"
					+ $inputText("", "", prefixo + "Codigo", "Cod", "12", "00")
					+ "&nbsp;</td>"
					+ '<td><img class=tic title=zoom onclick="'
					+ funcao
					+ '" src="'
					+ i3GEO.configura.locaplic
					+ "/imagens/branco.gif"
					+ '" /></td>'
					+ "</tr></table>";
			return ins;
		},
		/**
		 * Atualiza os valores em uma tabela do tipo codigo
		 *
		 */
		atualizaCodigo : function(onde, configProj, x, y) {
			var ondeValor = $i(onde + configProj + "Codigo");
			onde = $i(onde), temp = i3GEO.coordenadas.config[configProj], codigo = "";
			if (onde && onde.style.display === "none") {
				return;
			}
			if (typeof (x) === 'undefined') {
				x = objposicaocursor.ddx;
			}
			if (typeof (y) === 'undefined') {
				y = objposicaocursor.ddy;
			}
			if (temp.tipoCodigo === "geohash") {
				codigo = i3GEO.coordenadas.geohash.encodeGeoHash(y, x);
			}
			i3GEO.coordenadas.MODOTEXTO += temp.titulo + " : " + codigo + "<br><br>";
			if (ondeValor) {
				ondeValor.value = codigo;
			}
		},
		/**
		 * Atualiza os valores em uma tabela do tipo x e y com base na biblioteca Proj4
		 *
		 * http://trac.osgeo.org/proj4js/wiki/UserGuide
		 *
		 * Parametros:
		 *
		 * configProj {string}
		 *
		 */
		atualizaProj4 : function(onde, configProj, x, y) {
			if (i3GEO.coordenadas.formato === "bloco" && i3GEO.coordenadas.padrao !== configProj) {
				return;
			}
			var zona, temp, p, destino = "", iu = i3GEO.util;
			try {
				if (!$i(onde + configProj + "ZN")) {
					return;
				}
			} catch (e) {
				return;
			}
			temp = i3GEO.coordenadas.config[configProj];
			try {
				if ($i(onde + configProj).style.display === "none") {
					return;
				}
			} catch (men) {
			}
			if (temp.tipo === "metrica") {
				destino = temp.defepsg;
			}
			if (typeof (x) === 'undefined') {
				x = objposicaocursor.ddx;
			}
			if (typeof (y) === 'undefined') {
				y = objposicaocursor.ddy;
			}
			if (temp.tipo === "utm") {
				zona = i3GEO.coordenadas.geo2zonaUtm(x);
				$i(onde + configProj + "ZN").value = zona;
				if (objposicaocursor.ddy * 1 > 0) {
					destino = temp.zona[zona + "N"];
				} else {
					destino = temp.zona[zona + "S"];
				}
				if (typeof (destino) === 'undefined') {
					iu.defineValor(onde + configProj + "X", "value", "?");
					iu.defineValor(onde + configProj + "Y", "value", "?");
					return;
				}
			}
			//
			// no caso de dd
			//
			if (temp.defepsg === "" && temp.tipo === "metrica") {
				p = {
					x : x,
					y : y
				};
			} else {
				p = i3GEO.coordenadas.calculaProj4(i3GEO.coordenadas.defOrigem, destino, x, y);
			}
			iu.defineValor(onde + configProj + "X", "value", p.x);
			iu.defineValor(onde + configProj + "Y", "value", p.y);
			i3GEO.coordenadas.MODOTEXTO += temp.titulo + " - X: " + p.x + " Y: " + p.y + "<br><br>";
		},
		/**
		 * Function: calculaProj4
		 *
		 * Faz a proje&ccedil;&atilde;o de x e y da origem para o destino
		 *
		 * Parametros:
		 *
		 * {string} - CRS contendo o c&oacute;digo da proje&ccedil;&atilde;o de origem
		 *
		 * {string} - CRS contendo o c&oacute;digo da proje&ccedil;&atilde;o de destino
		 *
		 * {numerico} - coordenada x ou longitude
		 *
		 * {numerico} - coordenada y ou latitude
		 *
		 * Retorno:
		 *
		 * {Proj4js.transform}
		 */
		calculaProj4 : function(origem, destino, x, y) {
			Proj4js.defs = {
				'ORIGEM' : origem,
				'DESTINO' : destino
			};
			// para corrigir o path do proj4js
			// var url = Proj4js.getScriptLocation() + 'defs/' +
			// this.srsAuth.toUpperCase() + this.srsProjNumber + '.js';
			Proj4js.getScriptLocation = function() {
				return i3GEO.configura.locaplic + "/pacotes/proj4js/lib/";
			};
			var source = new Proj4js.Proj("ORIGEM"), dest = new Proj4js.Proj("DESTINO"), p = new Proj4js.Point(x, y);
			Proj4js.transform(source, dest, p);
			return p;
		},
		/**
		 * Mostra um tipo de coordenada e esconde os outros.
		 *
		 * Mostra o que estiver definido em i3GEO.coordenadas.padrao
		 */
		ativaBloco : function(prefixo) {
			var tipos = i3GEO.util.listaChaves(i3GEO.coordenadas.config), n = tipos.length, temp, i = 0;
			//
			// cria o HTML e a caixa de sele&ccedil;&atilde;o
			//
			for (i = 0; i < n; i++) {
				temp = i3GEO.coordenadas.config[tipos[i]];
				if (temp.ativo === true) {
					if (tipos[i] === this.padrao) {
						$i(prefixo + tipos[i]).style.display = "block";
					} else {
						$i(prefixo + tipos[i]).style.display = "none";
					}
				}
			}
		},
		/**
		 * Muda o tipo de coordenada que est&aacute; sendo mostrada no formato "bloco".
		 *
		 * Parametro:
		 *
		 * tipo {string} - tipo de coordenada
		 */
		mudaTipo : function(obj, onde) {
			if (obj.value === "janela") {
				this.formato = "janela";
				this.mostraCoordenadas();
				return;
			}
			this.padrao = obj.value;
			obj.selectedIndex = 0;
			i3GEO.coordenadas.ativaBloco(onde);
		},
		/**
		 * Constr&oacute;i o conjunto de elementos HTML para mostrar as coordenadas e define as fun&ccedil;&otilde;es de
		 * atualiza&ccedil;&atilde;o.
		 *
		 * Parametro:
		 *
		 * {boolean} - (opcional) aplica ou n&atilde;o as fun&ccedil;&otilde;es ligadas a movimenta&ccedil;&atilde;o do mouse
		 *
		 * {string} - (opcional) id onde o resultado ser&aacute; mostrado (ir&aacute; ignorar os ids definidos em coordenadas.config)
		 */
		mostraCoordenadas : function(ativaMovimento, onde, x, y) {
			//FIXME As coordenadas metricas nao funcionam em OSM
			if(i3GEO.parametros.w < 700){
				return;
			}
			if (i3GEO.Interface.openlayers.googleLike === true) {
				i3GEO.coordenadas.config = {
					"geoProj" : {
						idhtml : "localizarxy",
						tipo : "geo",
						titulo : "Geo",
						ativo : true,
						defepsg : ""
					},
					"dd" : {
						idhtml : "localizarxy",
						tipo : "metrica",
						titulo : "D&eacute;c. de grau",
						ativo : true,
						defepsg : ""
					}
				};
			}
			try {
				var tipos = i3GEO.util.listaChaves(i3GEO.coordenadas.config), n = tipos.length, temp, ins = "", i = 0, caixa, janela, nomeFunc;
				i3GEO.coordenadas.MODOTEXTO = "";
				if (arguments.length === 0) {
					ativaMovimento = true;
					onde = "";
				}
				//
				// cria o HTML
				//
				if (onde === "") {
					onde = i3GEO.coordenadas.config[tipos[0]].idhtml;
				}
				caixa =
					"<select onchange='javascript:i3GEO.coordenadas.mudaTipo(this,\"" + onde
						+ "\");' class='i3geoCoordenadasComboTipo' ><option>DMS</option><option value='janela' >janela</option>";
				//
				// cria a caixa de sele&ccedil;&atilde;o
				//
				for (i = 0; i < n; i += 1) {
					temp = i3GEO.coordenadas.config[tipos[i]];
					if (temp.ativo === true) {
						caixa += "<option value='" + tipos[i] + "'>" + temp.titulo + "</option>";
					}
				}
				caixa += "</select>";
				if (i3GEO.coordenadas.formato !== "bloco") {
					caixa = "";
				}
				for (i = 0; i < n; i += 1) {
					temp = i3GEO.coordenadas.config[tipos[i]];
					if (temp.ativo === true) {
						if (temp.tipo === "geo") {
							ins += i3GEO.coordenadas.criaMascaraDMS(onde + tipos[i], temp.titulo, caixa);
							if (i3GEO.coordenadas.formato === "separado") {
								try {
									$i(temp.idhtml).innerHTML = ins;
								} catch (e) {
								}
								ins = "";
							}
						} else {
							if (temp.tipo === "codigo") {
								ins += i3GEO.coordenadas.criaMascaraCodigo(onde + tipos[i], temp.titulo, caixa, temp.tipoCodigo);
							} else {
								ins += i3GEO.coordenadas.criaMascaraMetrica(onde + tipos[i], temp.titulo, caixa);
							}
						}
					}
				}
				if (this.formato === "janela") {
					janela = i3GEO.janela.cria("450px", "120px", "", "", "", "<div class='i3GeoTituloJanela'>"+$trad("x49")+"</div>", "i3GEOJanelaCoordenadas", false, "hd", "", "");
					YAHOO.util.Event.addListener(janela[0].close, "click", function() {
						i3GEO.coordenadas.formato = "bloco", i3GEO.coordenadas.mostraCoordenadas();
					});
					temp = $i("i3GEOJanelaCoordenadas_corpo");
					temp.style.backgroundColor = "white";
					temp.style.textAlign = "left";
					temp = $i("i3GEOJanelaCoordenadas");
					temp.onmouseover = "";
					temp.onmouseout = "";
					if ($i(onde)) {
						$i(onde).innerHTML = "";
					}
					onde = "i3GEOJanelaCoordenadas_corpo";

					ins +=
						"<br><a href='#' style='cursor:pointer;color:blue' onclick='new YAHOO.util.KeyListener(document.body,{alt:true,keys:67},{fn: function(type, args, obj){i3GEO.janela.tempoMsg(i3GEO.coordenadas.MODOTEXTO);}}).enable();' >" + "Clique aqui para ativar Alt+C para poder capturar as coordenadas</a>";
				}
				if (onde !== "" && $i(onde)) {
					$i(onde).innerHTML = ins;
				}
				for (i = 0; i < n; i += 1) {
					temp = i3GEO.coordenadas.config[tipos[i]];
					if (temp.ativo === true) {
						if (temp.tipo === "geo") {
							if (ativaMovimento === true) {
								if (i3GEO.Interface.TABLET === true) {
									i3GEO.eventos.adicionaEventos("MOUSECLIQUE", [
										"i3GEO.coordenadas.atualizaLocalizarGeo('" + onde + tipos[i] + "')"
									]);
								} else {
									i3GEO.eventos.adicionaEventos("MOUSEMOVE", [
										"i3GEO.coordenadas.atualizaLocalizarGeo('" + onde + tipos[i] + "')"
									]);
								}
							}
							if (typeof (x) !== 'undefined') {
								i3GEO.coordenadas.atualizaLocalizarGeo(
									onde + tipos[i],
									i3GEO.calculo.dd2dms(x)[0],
									i3GEO.calculo.dd2dms(y)[0]);
							}
						} else {
							nomeFunc = "i3GEO.coordenadas.atualizaProj4";
							if (temp.tipo === "codigo") {
								nomeFunc = "i3GEO.coordenadas.atualizaCodigo";
							}
							if (ativaMovimento === true) {
								if (i3GEO.Interface.TABLET === true) {
									i3GEO.eventos.adicionaEventos("MOUSECLIQUE", [
										nomeFunc + "('" + onde + "','" + tipos[i] + "')"
									]);
								} else {
									i3GEO.eventos.adicionaEventos("MOUSEMOVE", [
										nomeFunc + "('" + onde + "','" + tipos[i] + "')"
									]);
								}
							}
							if (typeof (x) !== 'undefined') {
								eval(nomeFunc + "(onde,tipos[i],x,y);");
							}
						}
					}
				}
				if (ativaMovimento === true) {
					if (i3GEO.Interface.TABLET === true) {
						i3GEO.eventos.adicionaEventos("MOUSECLIQUE", [
							"i3GEO.coordenadas.limpaModoTexto()"
						]);
					} else {
						i3GEO.eventos.adicionaEventos("MOUSEMOVE", [
							"i3GEO.coordenadas.limpaModoTexto()"
						]);
					}
				}
				if (i3GEO.coordenadas.formato === "bloco") {
					i3GEO.coordenadas.ativaBloco(onde);
				}
			} catch (men) {
			}
		},
		limpaModoTexto : function() {
			i3GEO.coordenadas.MODOTEXTO = "";
		},
		// geohash.js
		// Geohash library for Javascript
		// (c) 2008 David Troy
		// Distributed under the MIT License
		// ver pacotes/geohash-js-master
		/**
		 * Section: i3GEO.coordenadas.geohash
		 *
		 * Fun&ccedil;&otilde;es espec&iacute;ficas da biblioteca Geohash library for Javascript
		 *
		 * Veja:
		 *
		 * http://localhost/i3geo/pacotes/geohash-js-master
		 */
		geohash : {
			BITS : [
				16, 8, 4, 2, 1
			],
			BASE32 : "0123456789bcdefghjkmnpqrstuvwxyz",
			refine_interval : function(interval, cd, mask) {
				if (cd & mask)
					interval[0] = (interval[0] + interval[1]) / 2;
				else
					interval[1] = (interval[0] + interval[1]) / 2;
			},
			/*******************************************************************************************************************************
			 * Converte um geohash em coordenadas lat long
			 */
			decodeGeoHash : function(geohash) {
				var is_even = 1, lat = [], lon = [], i, j, x, y;
				lat[0] = -90.0;
				lat[1] = 90.0;
				lon[0] = -180.0;
				lon[1] = 180.0;
				lat_err = 90.0;
				lon_err = 180.0;
				for (i = 0; i < geohash.length; i++) {
					c = geohash[i];
					cd = i3GEO.coordenadas.geohash.BASE32.indexOf(c);
					for (j = 0; j < 5; j++) {
						mask = i3GEO.coordenadas.geohash.BITS[j];
						if (is_even) {
							lon_err /= 2;
							i3GEO.coordenadas.geohash.refine_interval(lon, cd, mask);
						} else {
							lat_err /= 2;
							i3GEO.coordenadas.geohash.refine_interval(lat, cd, mask);
						}
						is_even = !is_even;
					}
				}
				lat[2] = (lat[0] + lat[1]) / 2;
				lon[2] = (lon[0] + lon[1]) / 2;

				y = (lat[0] + lat[1]) / 2;
				x = (lon[0] + lon[1]) / 2;

				return {
					latitude : y,
					longitude : x
				};
			},
			/**
			 * Converte coordeanadas lat long em geohash
			 */
			encodeGeoHash : function(latitude, longitude) {
				var is_even = 1, lat = [], lon = [], bit = 0, ch = 0, precision = 12, geohash = "";
				lat[0] = -90.0;
				lat[1] = 90.0;
				lon[0] = -180.0;
				lon[1] = 180.0;
				while (geohash.length < precision) {
					if (is_even) {
						mid = (lon[0] + lon[1]) / 2;
						if (longitude > mid) {
							ch |= i3GEO.coordenadas.geohash.BITS[bit];
							lon[0] = mid;
						} else
							lon[1] = mid;
					} else {
						mid = (lat[0] + lat[1]) / 2;
						if (latitude > mid) {
							ch |= i3GEO.coordenadas.geohash.BITS[bit];
							lat[0] = mid;
						} else
							lat[1] = mid;
					}
					is_even = !is_even;
					if (bit < 4)
						bit++;
					else {
						geohash += i3GEO.coordenadas.geohash.BASE32[ch];
						bit = 0;
						ch = 0;
					}
				}
				return geohash;
			},
			zoomCodigo : function(idobj) {
				var codigo;
				if ($i(idobj)) {
					codigo = $i(idobj).value;
				} else {
					codigo = idobj;
				}
				codigo = i3GEO.coordenadas.geohash.decodeGeoHash(codigo);
				i3GEO.navega.zoomponto(i3GEO.configura.locaplic, i3GEO.configura.sid, codigo.longitude, codigo.latitude);
			}
		}
	};
