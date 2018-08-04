<?php
/*
 * Title: wmswfs.php
 *
 * Fun&ccedil;&otilde;es de uso geral para realizar a leitura e o processamento de Web Services nos padr&otilde;es OGC.
 * Atualmente, processa apenas servi&ccedil;os no padr&atilde;o WMS.
 *
 * Licenca:
 *
 * GPL2
 *
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
 * Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com
 *
 * Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
 * e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
 * GNU conforme publicada pela Free Software Foundation;
 *
 * Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
 * por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
 * de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
 * Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
 * Voc&ecirc; deve ter recebido uma c�pia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 *
 * Arquivo:
 *
 * i3geo/classesphp/wmswfs.php
 */
/*
 * Function: gravaCacheWMS
 *
 * L&ecirc; o getcapabilities de um WMS e salva em disco se o mesmo n&atilde;o tiver sido salvo antes
 *
 * O arquivo &eacute; gravado no diret&oacute;rio tempor&aacute;rio
 *
 * Parametros:
 *
 * $servico {string} - endere&ccedil;o do WMS
 *
 * Global:
 *
 * $dir_tmp {string} - (opcional) endere&ccedil;o do diret&oacute;rio tempor&aacute;rio onde o cache ser&aacute; armazenado. Se n&atilde;o for definido, tenta obter das vari&aacute;veis de configura&ccedil;&atilde;o existentes em i3geo/ms_configura.php
 *
 * Return:
 *
 * {string} - Nome do arquivo criado. Retorna a palavra "erro" se tiver ocorrido um erro.
 */

function gravaCacheWMS($servico) {
	global $dir_tmp, $i3geo_proxy_server;
	if ($dir_tmp == "" || $i3geo_proxy_server == "") {
		include (dirname ( __FILE__ ) . "/../ms_configura.php");
	}
	// error_reporting(0);
	try {
		$teste = explode ( "=", $servico );
		if (count ( $teste ) > 1) {
			$servico = $servico . "&";
		} else {
			$teste = explode ( "?", $servico );
			if (count ( $teste ) == 1) {
				$servico = $servico . "?";
			}
		}
		$wms_service_request = $servico . "REQUEST=GetCapabilities&SERVICE=WMS";
		$teste = explode ( "version", strtolower ( $wms_service_request ) );
		if (count ( $teste ) == 1) {
			$wms_service_request .= "&VERSION=1.1.1";
		}
		$nome = $dir_tmp . "/wms" . md5 ( $servico ) . ".xml";
		if (! file_exists ( $nome )) {
			$curl = curl_init ();
			curl_setopt ( $curl, CURLOPT_URL, $wms_service_request );
			curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, 1 );
			curl_setopt ( $curl, CURLOPT_HEADER, 0 );
			if (isset ( $i3geo_proxy_server ) && $i3geo_proxy_server != "") {
				curl_setopt ( $curl, CURLOPT_PROXY, $i3geo_proxy_server );
			}
			$wms_capabilities = curl_exec ( $curl );
			curl_close ( $curl );
			if (! $wms_capabilities || $wms_capabilities == "") {
				return "erro";
			} else {
				$fp = fopen ( $nome, 'w' );
				fwrite ( $fp, $wms_capabilities );
				fclose ( $fp );
			}
		}
		return $nome;
	} catch ( Exception $e ) {
		return "erro";
	}
}
/*
 * Function: existeTemaWFS
 *
 * Verifica se existe um tema em um servico WFS.
 *
 * Globais:
 *
 * $wfs {string} - endere&ccedil;o do servi&ccedil;o
 *
 * $tema {string} - tema (layer) que ser&aacute; verificado
 *
 * Retorno:
 *
 * {string} - sim|nao
 */
function existeTemaWFS() {
	global $wfs, $tema;
	$capabilities = implode ( "", $wfs );
	$dom = new DomDocument ();
	$dom->loadXML ( $capabilities );
	$xpath = new DOMXPath ( $dom );
	$query = '//WFS_Capabilities/FeatureTypeList/FeatureType';
	$entries = $xpath->query ( $query );
	foreach ( $entries as $e ) {
		$e->getElementsByTagName ( "Name" );
		$n = $e->nodeValue;
		if ($n == $tema) {
			return "sim";
		}
	}
	return "nao";
}
/*
 * Function: existeWFS
 *
 * Verifica se existe um servico WFS invocando o getcapabilities.
 *
 * Global:
 *
 * $servico {string} - endere&ccedil;o do servi&ccedil;o
 *
 * Retorno:
 *
 * {string} - nao|true
 */
function existeWFS() {
	global $servico;
	$teste = explode ( "=", $servico );
	if (count ( $teste ) > 1) {
		$servico = $servico . "&";
	}
	$wms_service_request = $servico . "REQUEST=GetCapabilities&SERVICE=WFS";
	// -------------------------------------------------------------
	// Test that the capabilites file has successfully downloaded.
	//
	if (! ($wfs_capabilities = file ( $wms_service_request ))) {
		// Cannot download the capabilities file.
		return "nao";
	} else {
		return $wfs_capabilities;
	}
}
/*
 * Function: getcapabilities
 *
 * Chama a fun&ccedil;&atilde;o getcapabilities e retorna o resultado.
 *
 * Global:
 *
 * $servico {string} - Endere&ccedil;o do web service.
 *
 * Retorno:
 *
 * {string}
 */
function getcapabilities() {
	global $servico;
	$teste = explode ( "=", $servico );
	if (count ( $teste ) > 1) {
		$servico = $servico . "&";
	}
	$wms_service_request = $servico . "REQUEST=GetCapabilities&SERVICE=WMS&version=1.1.0";
	// -------------------------------------------------------------
	// Test that the capabilites file has successfully downloaded.
	//
	if (! ($wms_capabilities = file ( $wms_service_request ))) {
		// Cannot download the capabilities file.
		$cp->set_data ( "Erro de acesso" );
		return;
	}
	$wms_capabilities = implode ( "", $wms_capabilities );
	return (xml2html ( $wms_capabilities ));
}
/*
 * function: getcapabilities2
 *
 * Chama a fun&ccedil;&atilde;o getcapabilities e retorna o resultado pr&eacute;-formatado (WMS).
 *
 * Global:
 *
 * $servico {string} - Endere&ccedil;o do web service.
 *
 * Retorno:
 *
 * {string}
 */
function getcapabilities2() {
	global $servico;
	$teste = explode ( "=", $servico );
	if (count ( $teste ) > 1) {
		$servico = $servico . "&";
	}
	$wms_service_request = $servico . "REQUEST=GetCapabilities&SERVICE=WMS";
	$teste = explode ( "version", strtolower ( $wms_service_request ) );
	if (count ( $teste ) == 1) {
		$wms_service_request .= "&VERSION=1.1.1";
	}
	// -------------------------------------------------------------
	// Test that the capabilites file has successfully downloaded.
	//
	if (! ($wms_capabilities = file ( $wms_service_request ))) {
		// Cannot download the capabilities file.
		$cp->set_data ( "Erro de acesso" );
		return;
	}
	$wms_capabilities = implode ( "", $wms_capabilities );
	$dom = new DomDocument ();
	$dom->loadXML ( $wms_capabilities );
	$xpath = new DOMXPath ( $dom );
	$retorno = "";
	$query = '//WMT_MS_Capabilities/Service/Name';
	$entries = $xpath->query ( $query );
	if ($entries == FALSE || $entries->length == 0) {
		$rn = $xpath->registerNamespace ( "tag", "http://www.opengis.net/wms" );
		$entries = $xpath->query ( '/tag:WMS_Capabilities/tag:Service/tag:Name' );
	}

	$temp = "";
	foreach ( $entries as $entry ) {
		$temp .= $entry->nodeValue;
	}
	$retorno .= "<b>Nome: </b>" . $temp;

	$query = '//WMT_MS_Capabilities/Service/Title';
	$entries = $xpath->query ( $query );
	if ($entries == FALSE || $entries->length == 0) {
		$entries = $xpath->query ( '/tag:WMS_Capabilities/tag:Service/tag:Title' );
	}
	$temp = "";
	foreach ( $entries as $entry ) {
		$temp .= $entry->nodeValue;
	}
	$retorno .= "<br><br><b>T&iacute;tulo: </b>" . $temp;

	$query = '//WMT_MS_Capabilities/Service/Abstract';
	$entries = $xpath->query ( $query );
	if ($entries == FALSE || $entries->length == 0) {
		$entries = $xpath->query ( '/tag:WMS_Capabilities/tag:Service/tag:Abstract' );
	}
	$temp = "";
	foreach ( $entries as $entry ) {
		$temp .= $entry->nodeValue;
	}
	$retorno .= "<br><br><b>Resumo: </b>" . $temp;

	$query = '//WMT_MS_Capabilities/Service/KeywordList';
	$entries = $xpath->query ( $query );
	if ($entries == FALSE || $entries->length == 0) {
		$entries = $xpath->query ( '/tag:WMS_Capabilities/tag:Service/tag:KeywordList' );
	}
	$temp = "";
	foreach ( $entries as $entry ) {
		$temp .= $entry->nodeValue . ".";
	}
	$retorno .= "<br><br><b>Palavras-chave: </b>" . $temp;

	$query = '//WMT_MS_Capabilities/Service/ContactInformation';
	$entries = $xpath->query ( $query );
	if ($entries == FALSE || $entries->length == 0) {
		$entries = $xpath->query ( '/tag:WMS_Capabilities/tag:Service/tag:ContactInformation' );
	}
	$temp = "";
	foreach ( $entries as $entry ) {
		$temp .= $entry->nodeValue . ".";
	}
	$retorno .= "<br><br><b>Contato: </b>" . $temp;

	return ($retorno);
}
/*
 * getcapabilities3
 *
 * Chama a fun&ccedil;&atilde;o getcapabilities e retorna o resultado formatado (WFS).
 *
 * Global:
 *
 * $servico {string} - Endere&ccedil;o do web service.
 *
 *
 */
function getcapabilities3() {
	global $servico;
	$teste = explode ( "=", $servico );
	if (count ( $teste ) > 1) {
		$servico = $servico . "&";
	}
	$wms_service_request = $servico . "request=getcapabilities&service=wfs&version=1.0.0";
	// -------------------------------------------------------------
	// Test that the capabilites file has successfully downloaded.
	//
	if (! ($wms_capabilities = file ( $wms_service_request ))) {
		// Cannot download the capabilities file.
		$cp->set_data ( "Erro de acesso" );
		return;
	}
	$wms_capabilities = implode ( "", $wms_capabilities );
	$dom = new DomDocument ();
	$dom->loadXML ( $wms_capabilities );
	$retorno = "";
	$services = $dom->getElementsByTagName ( "Service" );
	foreach ( $services as $service ) {
		$vs = $service->getElementsByTagName ( "Name" );
		$temp = "";
		foreach ( $vs as $v ) {
			$temp .= $v->nodeValue;
		}
		$retorno .= "<b>Nome: </b>" . $temp;
		$vs = $service->getElementsByTagName ( "Title" );
		$temp = "";
		foreach ( $vs as $v ) {
			$temp .= $v->nodeValue;
		}
		$retorno .= "<br><br><b>T&iacute;tulo: </b>" . $temp;
	}
	return ($retorno);
}
/*
 * Function: temaswms
 *
 * Lista os temas de um web service WMS.
 *
 * Globais:
 *
 * $servico {string} - Endere&ccedil;o do web service.
 *
 * $id_ws {string} - (opcional) id do servi&ccedil;o registrado no sistema de administra&ccedil;&atilde;o do i3geo. Se definido, &eacute; feito o registro de tentativa de acesso ao servi&ccedil;o no sistema de administra&ccedil;&atilde;o
 *
 * Retorno:
 *
 * {html} - htaml formatado para permitir a escolha de uma camada
 */
function temaswms() {
    global $servico, $id_ws, $i3geo_proxy_server;
	// para admin/cadastros/servicos/exec.php
	$_GET ["funcao"] = "lista";
	$wms_service_request = gravaCacheWMS ( $servico );
	// -------------------------------------------------------------
	// Test that the capabilites file has successfully downloaded.
	//
	// $wms_service_request = "c://temp//teste.xml";

	// error_reporting(0);
	if ($wms_service_request == "erro") {
		// Cannot download the capabilities file.
		$cp->set_data ( "Erro de acesso" );
		return;
	}
	$handle = fopen ( $wms_service_request, "r" );
	$wms_capabilities = fread ( $handle, filesize ( $wms_service_request ) );
	fclose ( $handle );
	$dom = new DomDocument ();
	$dom->loadXML ( $wms_capabilities );

	// var_dump($dom);exit;
	// $layers = wms_layers($dom);
	$xpath = new DOMXPath ( $dom );
	// verifica sld
	$suporta = "nao";
	$query = '//WMT_MS_Capabilities/Capability/UserDefinedSymbolization';
	$entries = $xpath->query ( $query );
	if ($entries->length == 0) {
		$suporta = "sim";
	} else {
		foreach ( $entries as $e ) {
			$n = $e->getAttribute ( "SupportSLD" );
		}
		if ($n == 1) {
			$suporta = "sim";
		}
	}
	$xpath = new DOMXPath ( $dom );
	// var_dump($xpath);exit;
	$q = '//WMT_MS_Capabilities/Capability';
	$query = $q . '/Layer';
	$layers = $xpath->query ( $query );
	if ($layers == FALSE || $layers->length == 0) {
		$teste = $xpath->registerNamespace ( "tag", "http://www.opengis.net/wms" );
		$q = '/tag:WMS_Capabilities/tag:Capability';
		$query = $q . '/tag:Layer';
		$layers = $xpath->query ( $query );
	}
	// var_dump($layers);exit;
	$retorna = array ();
	foreach ( $layers as $layer ) {
		$layers1 = $xpath->query ( '/Layer', $layer );
		if ($layers1->length == 0) // v 1.3.0
{
			$layers1 = $layers;
		} else {
			$r = pegaTag ( $layer );
			$retorna = imprimeTag ( $r, $retorna );
		}
		foreach ( $layers1 as $layer1 ) {
			$layers2 = $xpath->query ( 'Layer', $layer1 );
			$r1 = pegaTag ( $layer1 );
			$camada1 = $r1 ["nome"];
			$titulocamada1 = $r1 ["titulo"];
			$retorna = imprimeTag ( $r1, $retorna );
			if ($r1 ["estilos"]) {
				$retorna = imprimeEstilos ( $r1 ["estilos"], $suporta, $retorna, $camada1, $titulocamada1 );
			} else {
				if ($layers2->length == 0){
					$retorna [] = imprimeEstilos2 ($camada1, $titulocamada1, $suporta);
					//$retorna [] = "<input style='cursor:pointer' type=radio NAME='checks' onClick='seltema(\"tema\",\"" . $camada1 . "\",\"\",\"default\",\"" . $camada1 . " " . $titulocamada1 . "\",\"" . $suporta . "\")' value='" . $camada1 . "'/> default<i>" . $titulocamada1 . "</i></span><br>";
				}
			}
			foreach ( $layers2 as $layer2 ) {
				$layers3 = $xpath->query ( 'Layer', $layer2 );
				$r2 = pegaTag ( $layer2 );
				$camada2 = $r2 ["nome"];
				$titulocamada2 = $r2 ["titulo"];
				$retorna = imprimeTag ( $r2, $retorna );
				if ($r2 ["estilos"]) {
					$retorna = imprimeEstilos ( $r2 ["estilos"], $suporta, $retorna, $camada2, $titulocamada2 );
				} else {
					if ($layers3->length == 0)
						$retorna [] = imprimeEstilos2 ($camada2, $titulocamada2, $suporta);
						//$retorna [] = "<input style='cursor:pointer' type=radio NAME='checks' onClick='seltema(\"tema\",\"" . $camada2 . "\",\"\",\"default\",\"" . $camada2 . " " . $titulocamada2 . "\",\"" . $suporta . "\")' value='" . $camada2 . "'/> default <i>" . $titulocamada2 . "</i></span><br>";
				}
				foreach ( $layers3 as $layer3 ) {
					$r3 = pegaTag ( $layer3 );
					$camada3 = $r3 ["nome"];
					$titulocamada3 = $r3 ["titulo"];
					$retorna = imprimeTag ( $r3, $retorna );
					if ($r3 ["estilos"]) {
						$retorna = imprimeEstilos ( $r3 ["estilos"], $suporta, $retorna, $camada3, $titulocamada3 );
					} else {
						$retorna [] = imprimeEstilos2 ($camada3, $titulocamada3, $suporta);
						//$retorna [] = "<input style='cursor:pointer' type=radio NAME='checks' onClick='seltema(\"tema\",\"" . $camada3 . "\",\"\",\"default\",\"" . $camada3 . " " . $titulocamada3 . "\",\"" . $suporta . "\")' value='" . $camada3 . "'/> default <i>" . $titulocamada3 . "</i></span><br>";
					}
				}
			}
			if (count ( $layers2 ) == 1) {
				$retorna [] = "<hr>";
			}
		}
	}

	$retorna [] = "<div class='form-group label-fixed condensed' ><label class='control-label' for='proj'>Proje&ccedil;&atilde;o</label><input class='form-control input-lg' type='text' id='proj' value='" . implode ( ",", wms_srs ( $dom ) ) . "' /></div>";
	$retorna [] = "<div class='form-group label-fixed condensed' ><label class='control-label' for='formatos'>Formatos imagem</label><input class='form-control input-lg' type='text' id='formatos' value='" . implode ( ",", wms_formats ( $dom ) ) . "' /></div>";
	$retorna [] = "<div class='form-group label-fixed condensed' ><label class='control-label' for='formatosinfo'>Formatos de informa&ccedil;&atilde;o</label><input class='form-control input-lg' type='text' id='formatosinfo' value='" . implode ( ",", wms_formatsinfo ( $dom ) ) . "' /></div>";
	$retorna [] = "<div class='form-group label-fixed condensed' ><label class='control-label' for='versao'>Vers&atilde;o</label><input class='form-control input-lg' type='text' id='versao' value='" . implode ( ",", wms_version ( $dom ) ) . "' /></div>";
	$retorna [] = "<div class='form-group label-fixed condensed' ><label class='control-label' for='suportasld'>Suporta SLD</label><input class='form-control input-lg' type='text' id='suportasld' value='" . $suporta . "' /></div>";

	//$retorna [] = "<h5>Proje&ccedil;&atilde;o:</h5><div class='styled-select'><input type='text' id='proj' value='" . implode ( ",", wms_srs ( $dom ) ) . "' /></div>";
	//$retorna [] = "<br><p class='paragrafo'>Formatos imagem:</p><div class='styled-select'><input type='text' id='formatos' value='" . implode ( ",", wms_formats ( $dom ) ) . "' /></div>";
	//$retorna [] = "<br><p class='paragrafo'>Formatos de informa&ccedil;&atilde;o:</p><div class='styled-select'><input type='text' id='formatosinfo' value='" . implode ( ",", wms_formatsinfo ( $dom ) ) . "' /></div>";
	//$retorna [] = "<br><p class='paragrafo'>Vers&atilde;o:</p><div class='styled-select'><input type='text' id='versao' value='" . implode ( ",", wms_version ( $dom ) ) . "' /></div>";
	//$retorna [] = "<br><p class='paragrafo'>Suporta SLD:</p><div class='styled-select'><input type='text' id='suportasld' value='" . $suporta . "' /></div>";
	return (implode ( $retorna ));
}
function listaLayersARCGISREST(){
    global $servico, $i3geo_proxy_server;
    //echo $i3geo_proxy_server;exit;
    $curl = curl_init ();
    curl_setopt ( $curl, CURLOPT_URL, $servico."?f=json" );
    curl_setopt ( $curl, CURLOPT_RETURNTRANSFER, 1 );
    curl_setopt ( $curl, CURLOPT_HEADER, 0 );
    if (isset ( $i3geo_proxy_server ) && $i3geo_proxy_server != "") {
        curl_setopt ( $curl, CURLOPT_PROXY, $i3geo_proxy_server );
    }
    $list = curl_exec ( $curl );
    curl_close ( $curl );
    return $list;
}
/*
 * Function: listaLayersWMS
 *
 * Lista os temas de um web service WMS e retorna o resultado como um array.
 *
 * Globais:
 *
 * $servico {string} - Endere&ccedil;o do web service.
 *
 * $nivel - n&iacute;vel do layer na hierarquia existente no getcapabilities
 *
 * $nomelayer - nome do layer que cont&eacute;m os pr�ximos layers
 *
 * Retorno:
 *
 * {array}
 */
function listaLayersWMS() {
    global $servico, $nivel, $id_ws, $nomelayer, $tipo_ws, $i3geo_proxy_server;
	if (! isset ( $nomelayer )) {
		$nomelayer = "undefined";
	}
	// para o caso do sistema de metadados estatisticos
	$wms_service_request = gravaCacheWMS ( $servico );
	if ($tipo_ws != "WMSMETAESTAT" && $nivel < 2) {
		if ($wms_service_request == "erro") {
			$cp->set_data ( "Erro de acesso" );
			return;
		}
	}
	$handle = fopen ( $wms_service_request, "r" );
	$wms_capabilities = fread ( $handle, filesize ( $wms_service_request ) );
	fclose ( $handle );

	$dom = new DomDocument ();
	$dom->loadXML ( $wms_capabilities );
	$xpath = new DOMXPath ( $dom );
	$q = '//WMT_MS_Capabilities/Capability';
	$res = array ();
	if ($nomelayer != "undefined") {
		for($i = 0; $i < $nivel - 1; ++ $i) {
			$q .= "/Layer";
		}
		$layersanteriores = $xpath->query ( $q );
		foreach ( $layersanteriores as $layeranterior ) {
			$r1 = pegaTag ( $layeranterior );
			// echo "<pre>";var_dump($layeranterior);
			if ($r1 ["nome"] == $nomelayer || $r1 ["titulo"] == $nomelayer) {
				$layers = $xpath->query ( 'Layer', $layeranterior );
				foreach ( $layers as $layer ) {
					$r = pegaTag ( $layer );
					if (! $r ["nome"]) {
						$r ["nome"] = $r ["titulo"];
					}
					$res [] = array (
							"nome" => $r ["nome"],
							"titulo" => $r ["titulo"],
							"estilos" => $r ["estilos"],
							"srs" => wms_srs ( $dom ),
							"formats" => wms_formats ( $dom ),
							"version" => wms_version ( $dom ),
							"formatsinfo" => wms_formatsinfo ( $dom )
					);
				}
				if ($layers->length == 0) {
					$res [] = array (
							"nome" => $r1 ["nome"],
							"titulo" => $r1 ["titulo"],
							"estilos" => (array (
									array (
											"nome" => "default",
											"titulo" => "default"
									)
							)),
							"srs" => wms_srs ( $dom ),
							"formats" => wms_formats ( $dom ),
							"version" => wms_version ( $dom ),
							"formatsinfo" => wms_formatsinfo ( $dom )
					);
				}
			}
		}
	} else {
		//
		// pega os layers no primeiro n&iacute;vel
		//
		$q .= "/Layer";
		$layers = $xpath->query ( $q );
		$res = array ();
		foreach ( $layers as $layer ) {
			$r = pegaTag ( $layer );
			// var_dump($r);
			if (! $r ["nome"]) {
				$r ["nome"] = $r ["titulo"];
			}
			if (array_search ( "Style", $r ["tags"] ) || array_search ( "Layer", $r ["tags"] )) {
				$res [] = array (
						"nome" => $r ["nome"],
						"titulo" => $r ["titulo"],
						"estilos" => $r ["estilos"],
						"srs" => wms_srs ( $dom ),
						"formats" => wms_formats ( $dom ),
						"version" => wms_version ( $dom ),
						"formatsinfo" => wms_formatsinfo ( $dom )
				)
				;
			}
		}
	}
	// exit;
	return ($res);
}
function imprimeEstilos($es, $suporta, $retorna, $tval, $tituloalternativo) {
	foreach ( $es as $e ) {
		$nomeestilo = $e ["nome"];
		$nomecamada = $e ["titulo"];
		$tituloestilo = $e ["titulo"];
		$onclick = "i3GEOF.conectarwms.seltema(\"estilo\",\"" . $tval . "\",\"\",\"" . $nomeestilo . "\",\"" . $tituloalternativo . " " . $nomecamada . " " . $tituloestilo . "\",\"" . $suporta . "\")";

		$retorna [] = <<<EOT
<div class="list-group condensed">
<div class="row-content text-left">
<a onclick='$onclick' role="button" class="btn btn-default btn-fab btn-fab-max" href="javascript:void(0)">
<span class="material-icons">visibility</span>
</a>
<label class="nomeTema" >
<a onclick='$onclick' href="javascript:void(0)"><h4>
$nomeestilo
</h4></a>
<h6>$tituloestilo</h6>
</label>
</div>
</div>
EOT;

		// $retorna[] = "<button class='btn btn-primary btn-sm btn-raised' onClick='".onclick."' value='" . $nomeestilo . "'/>" . $nomeestilo." <i>".$tituloestilo."</i></span><br>";
	}
	return $retorna;
}
function imprimeEstilos2($camada1, $titulocamada1, $suporta) {
		$onclick = "i3GEOF.conectarwms.seltema(\"tema\",\"" . $camada1 . "\",\"\",\"default\",\"" . $camada1 . " " . $titulocamada1 . "\",\"" . $suporta . "\")";
		$retorna = <<<EOT
<div class="list-group condensed">
<div class="row-content text-left">
<a onclick='$onclick' role="button" class="btn btn-default btn-fab btn-fab-max" href="javascript:void(0)">
<span class="material-icons">visibility</span>
</a>
<label class="nomeTema" >
<a onclick='$onclick' href="javascript:void(0)"><h4>
default
</h4></a>
<h6>$titulocamada1</h6>
</label>
</div>
</div>
EOT;

	return $retorna;
}

function imprimeTag($r, $retorna) {
	if (! $r ["nome"]) {
		$retorna [] = "<h4>" . $r ["titulo"] . "</h4>";
	} else {
		$retorna [] = "<hr>";
		$retorna [] = "<h3>" . $r ["nome"] . "</h3>";
		//$retorna [] = "<h4>" . $r ["titulo"] . "</h4>";
		$retorna [] = "<h5>" . $r ["resumo"] . "</h5>";
	}
	return $retorna;
}
function pegaTag($layer) {
	error_reporting(0);
	$noslayer = $layer->childNodes;
	$resultado = array (
			"estiloas" => array (),
			"tags" => array ()
	);
	for($i = 0; $i < $noslayer->length; ++ $i) {
		$tnome = $noslayer->item ( $i )->tagName;
		$tvalor = $noslayer->item ( $i )->nodeValue;
		if ($tnome) {
			// echo "<br>".$tnome;
			if ($tnome == "Title") {
				$resultado ["titulo"] = $tvalor;
			}
			if ($tnome == "Name") {
				$resultado ["nome"] = $tvalor;
			}
			if ($tnome == "Abstract") {
				$resultado ["resumo"] = $tvalor;
			}

			if ($tnome == "Style") {
				$ss = $noslayer->item ( $i )->childNodes;
				$ssl = $ss->length;
				$n = "";
				$t = "";
				for($s = 0; $s < $ssl; $s ++) {
					$snome = $ss->item ( $s )->tagName;
					$svalor = $ss->item ( $s )->nodeValue;
					if ($snome) {
						if ($snome == "Title") {
							$t = $svalor;
						}
						if ($snome == "Name") {
							$n = $svalor;
						}
					}
				}
				// echo "<pre>";echo $n;
				if ($n != "") {
					array_push ( $resultado ["estilos"], array (
							"nome" => $n,
							"titulo" => $t
					) );
				}
			}
			array_push ( $resultado ["tags"], $tnome );
			// echo "<pre>";var_dump($resultado);
		}
	}
	return $resultado;
}

/*
 * temaswfs
 *
 * Lista os temas de um web service WFS.
 *
 * parameters:
 * $servico - Endere&ccedil;o do web service.
 *
 * $cp - Objeto CPAINT.
 */
function temaswfs() {
	global $servico, $cp;
	$teste = explode ( "=", $servico );
	if (count ( $teste ) > 1) {
		$servico = $servico . "&";
	}
	$wms_service_request = $servico . "REQUEST=GetCapabilities&SERVICE=WFS";
	// -------------------------------------------------------------
	// Test that the capabilites file has successfully downloaded.
	//
	if (! ($wms_capabilities = file ( $wms_service_request ))) {
		// Cannot download the capabilities file.
		$cp->set_data ( "Erro de acesso" );
		return;
	}
	$wms_capabilities = implode ( "", $wms_capabilities );
	$dom = new DomDocument ();
	$dom->loadXML ( $wms_capabilities );
	$services = $dom->getElementsByTagName ( "Service" );
	foreach ( $services as $service ) {
		$vs = $service->getElementsByTagName ( "Name" );
		$serv = "";
		foreach ( $vs as $v ) {
			$serv .= $v->nodeValue;
		}
	}
	$layers = $dom->getElementsByTagName ( "FeatureType" );
	foreach ( $layers as $layer ) {
		$vs = $layer->getElementsByTagName ( "Title" );
		$temp1 = "";
		foreach ( $vs as $v ) {
			$temp1 .= $v->nodeValue;
		}

		$vs = $layer->getElementsByTagName ( "Abstract" );
		$temp2 = "";
		foreach ( $vs as $v ) {
			$temp2 .= $v->nodeValue;
		}

		$vs = $layer->getElementsByTagName ( "SRS" );
		$temp3 = array ();
		foreach ( $vs as $v ) {
			$temp3 [] = $v->nodeValue;
		}
		$temp3 = implode ( "#", $temp3 );

		$vs = $layer->getElementsByTagName ( "Name" );
		$temp = "";
		foreach ( $vs as $v ) {
			$temp .= $v->nodeValue;
		}
		$temp = "<input style='cursor:pointer' type=radio NAME='checks' onClick='i3GEOF.conectarwms.seltema(\"" . $temp . "\",\"" . $temp1 . "\",\"" . $temp3 . "\",\"" . $serv . "\")' /><span style=color:red >" . $temp . "</span><br>";
		$retorno .= "<br>" . $temp . $temp1 . "<br>" . $temp2 . "<hr>";
	}
	$cp->set_data ( $retorno );
}
/*
 * Function: xml2html
 *
 * Converte caracteres XML em HTML.
 *
 * Parametro:
 *
 * $str {string} - Xml que ser&aacute; convertido
 *
 * Retorno:
 *
 * {string}
 */
function xml2html($str) {
	$str = ereg_replace ( "&", "&amp;", $str );
	$str = ereg_replace ( "<", "&lt;", $str );
	$str = ereg_replace ( ">", "&gt;<BR>", $str );
	return $str;
}
/*
 * wms_descricao
 *
 * Retorna a descri&ccedil;&atilde;o de um servi&ccedil;o (n�).
 */
function wms_descricao($dom, $xp) {
	$xpath = new DOMXPath ( $dom );
	$query = $xp;
	$entries = $xpath->query ( $query );
	$n = "";
	foreach ( $entries as $entry ) {
		$n = $entry->nodeValue;
	}
	return $n;
}
/*
 * wms_descricaov
 *
 * Retorna a descri&ccedil;&atilde;o de um servi&ccedil;o (atributo).
 */
function wms_descricaov($dom, $xp, $attrib) {
	$xpath = new DOMXPath ( $dom );
	$query = $xp;
	$entries = $xpath->query ( $query );
	$n = "";
	foreach ( $entries as $entry ) {
		$n = $entry->getAttribute ( $attrib );
	}
	return $n;
}
/*
 * wms_descricaon
 *
 * Retorna a descri&ccedil;&atilde;o de um servi&ccedil;o (filho de um n�).
 */
function wms_descricaon($dom, $xp, $n) {
	$ctx = xpath_new_context ( $dom );
	$xpnode = xpath_eval ( $ctx, $xp );
	$dtnode = $xpnode->nodeset [$n]->first_child ();
	return $dtnode->content;
}
/*
 * wms_title
 *
 * Retorna o t&iacute;tulo de um WMS.
 */
function wms_title($dom) {
	//
	// Read the WMS service title and return it as text.
	//
	$xpath = new DOMXPath ( $dom );
	$query = '//WMT_MS_Capabilities/Service/Title';
	$entries = $xpath->query ( $query );
	foreach ( $entries as $entry ) {
		$nomeserv = $entry->nodeValue;
	}
	return $nomeserv;
}
/*
 * wms_onlineresource
 *
 * Retorna o recurso on-line de um WMS.
 */
function wms_onlineresource($dom) {
	//
	// Read the WMS online resource URL and return it as text.
	//
	$xp = "/WMT_MS_Capabilities/Service/OnlineResource";
	$ctx = xpath_new_context ( $dom );
	$xpnode = xpath_eval ( $ctx, $xp );
	return $xpnode->nodeset [0]->get_attribute ( "href" );
}
/*
 * wms_formats
 *
 * Retorna os formatos de imagem de um WMS.
 */
function wms_formats($dom) {
	$xpath = new DOMXPath ( $dom );
	$query = '//WMT_MS_Capabilities/Capability/Request/GetMap/Format';
	$entries = $xpath->query ( $query );
	if ($entries == FALSE || $entries->length == 0) {
		$teste = $xpath->registerNamespace ( "tag", "http://www.opengis.net/wms" );
		$q = '/tag:WMS_Capabilities/tag:Capability/tag:Request/tag:GetMap/tag:Format';
		$entries = $xpath->query ( $q );
	}
	$arr = array ();
	foreach ( $entries as $entry ) {
		$arr [] = $entry->nodeValue;
	}
	return $arr;
}
/*
 * wms_formatsinfo
 *
 * Retorna os formatos existentes de retorno da op&ccedil;&atilde;o getfeatureinfo.
 */
function wms_formatsinfo($dom) {
	$xpath = new DOMXPath ( $dom );
	$query = '//WMT_MS_Capabilities/Capability/Request/GetFeatureInfo/Format';
	$entries = $xpath->query ( $query );
	if ($entries == FALSE || $entries->length == 0) {
		$teste = $xpath->registerNamespace ( "tag", "http://www.opengis.net/wms" );
		$q = '/tag:WMS_Capabilities/tag:Capability/tag:Request/tag:GetCapabilities/tag:Format';
		$entries = $xpath->query ( $q );
	}
	$arr = array ();
	foreach ( $entries as $entry ) {
		$arr [] = $entry->nodeValue;
	}
	return $arr;
}
/*
 * wms_estilos
 *
 * Retorna os estilos de um WMS.
 */
function wms_estilos($dom) {
	//
	// Read the WMS image formats and return them as an array.
	//
	// $xp = "/Style";
	// $ctx = xpath_new_context($dom);
	// $xpnode = xpath_eval($ctx,$xp);
	// return $xpnode->nodeset;
	$return = $dom->getElementsByTagName ( "Style" );
}
/*
 * wms_exceptions
 *
 * Retorna as exceptions de um WMS.
 */
function wms_exceptions($dom) {
	//
	// Read the WMS exception formats and return them as an array.
	//
	$xp = "/WMT_MS_Capabilities/Capability/Exception/Format";
	$ctx = xpath_new_context ( $dom );
	$xpnode = xpath_eval ( $ctx, $xp );
	$arr = array ();
	for($i = 0; $i < sizeof ( $xpnode->nodeset ); ++ $i) {
		$dtnode = $xpnode->nodeset [0]->first_child ();
		array_push ( $arr, $dtnode->content );
	}
	return $arr;
}
/*
 * wms_version
 *
 * Retorna a versao.
 */
function wms_version($dom) {
	$n = $dom->getElementsByTagName ( 'WMT_MS_Capabilities' );
	$params = $dom->getElementsByTagName ( '*' );

	foreach ( $params as $param ) {
		$v = $param->getAttribute ( 'version' );
		break;
	}
	return $v;
}
/*
 * wms_layers
 *
 * Retorna os layers de um WMS.
 */
function wms_layers($dom) {
	//
	// Read the WMS first level layers and return an
	// array of nodes.
	//
	$xpath = new DOMXPath ( $dom );
	$query = '//WMT_MS_Capabilities/Capability/Layer/Layer/Layer';
	$entries = $xpath->query ( $query );
	if ($entries->length == 0) {
		$query = '//WMT_MS_Capabilities/Capability/Layer';
		$entries = $xpath->query ( $query );
	} else {
		$query = '//WMT_MS_Capabilities/Capability/Layer/Layer';
		$entries = $xpath->query ( $query );
	}
	return $entries;
}
/*
 * wms_xpnode2content
 *
 * Read the content child node of an element tag node WMS.
 */
function wms_xpnode2content($xp_node) {
	//
	// Read the content child node of an element tag
	// node.
	//
	$content = "";
	if ($xp_node->nodeset [0]) {
		$node = $xp_node->nodeset [0]->first_child ();
		$content = $node->content;
	}
	return $content;
}
/*
 * wms_srs
 *
 * Retorna os SRSs WMS.
 */
function wms_srs($dom) {
	$xpath = new DOMXPath ( $dom );
	$query = '//WMT_MS_Capabilities/Capability/Layer/SRS';
	$entries = $xpath->query ( $query );
	if ($entries == FALSE || $entries->length == 0) {
		$teste = $xpath->registerNamespace ( "tag", "http://www.opengis.net/wms" );
		$q = '/tag:WMS_Capabilities/tag:Capability/tag:Layer/tag:CRS';
		$entries = $xpath->query ( $q );
	}

	$srs = "";
	// utiliza apenas os epsg do Brasil
	$single = array ();
	foreach ( $entries as $entry ) {
		$arr [] = $entry->nodeValue;
		if ($entry->nodeValue == "CRS:84") {
			$single [] = "CRS:84";
		}
		if ($entry->nodeValue == "EPSG:4326") {
			$single [] = "EPSG:4326";
		}
		if ($entry->nodeValue == "EPSG:4618") {
			$single [] = "EPSG:4618";
		}
	}
	if (count ( $single ) > 0) {
		$arr = $single;
	}
	return $arr;
}
/*
 * wms_bbox
 *
 * Retorna o BBOX de um WMS.
 */
function wms_bbox($dom) {
	$xpath = new DOMXPath ( $dom );
	$query = '//WMT_MS_Capabilities/Capability/Layer/LatLonBoundingBox';
	$entries = $xpath->query ( $query );
	foreach ( $entries as $entry ) {
		$bbox = $entry->nodeValue;
	}
	if ($bbox == '-1,-1,-1,-1') {
		return '-180,-90,180,90';
	} else {
		return wms_bbox2txt ( $bbox );
	}
}
/*
 * wms_bbox2txt
 *
 * Convert a BoundingBox node into a text string de um wms.
 */
function wms_bbox2txt($node) {
	//
	// Convert a BoundingBox node into a text string.
	//
	if ($node) {
		$txt .= 1 * $node->get_attribute ( "minx" );
		$txt .= ",";
		$txt .= 1 * $node->get_attribute ( "miny" );
		$txt .= ",";
		$txt .= 1 * $node->get_attribute ( "maxx" );
		$txt .= ",";
		$txt .= 1 * $node->get_attribute ( "maxy" );
	} else {
		$txt = "-180,-90,180,90";
	}
	return $txt;
}
/*
 * wms_layer2html
 *
 * Convert a Layer node into an HTML representation wms.
 */
function wms_layer2html($node, $tipo, $layer) {
	//
	// Convert a Layer node into an HTML representation.
	//
	$ctx = xpath_new_context ( $node );
	$xp_title = xpath_eval ( $ctx, "/Title" );
	$xp_name = xpath_eval ( $ctx, "/Name" );
	if (wms_xpnode2content ( $xp_name ) == "") {
		$xp_name = xpath_eval ( $ctx, "/name" );
	}
	$xp_srs = xpath_eval ( $ctx, "/SRS" );
	$xp_llbbox = xpath_eval ( $ctx, "/LatLonBoundingBox" );
	$xp_bbox = xpath_eval ( $ctx, "/BoundingBox" );
	$txt_title = wms_xpnode2content ( $xp_title );
	$txt_name = wms_xpnode2content ( $xp_name );
	$txt_srs = strtoupper ( wms_xpnode2content ( $xp_srs ) );
	$node_llbbox = $xp_llbbox->nodeset [0];
	$node_bbox = $xp_bbox->nodeset [0];
	$queryable = 0;
	if ($node->get_attribute ( "queryable" )) {
		$queryable = 1;
	}
	$opaque = 0;
	if ($node->get_attribute ( "opaque" )) {
		$opaque = 1;
	}
	// legenda
	$xp_legenda = xpath_eval ( $ctx, "/LegendURL/OnlineResource" );
	$nodelegenda = $xp_legenda->nodeset [0];
	if ($nodelegenda) {
		$legenda = $nodelegenda->get_attribute ( "href" );
	}

	$html = "<INPUT TYPE='radio' NAME='checks' VALUE='$txt_name' onClick='toggle(event,\"$tipo\",\"$layer\",\"$legenda\",\"$txt_title\")'>";
	$html .= "&nbsp;&nbsp;";
	$html .= $txt_title . "\n";
	$html .= wms_hidden ( "bbox_$txt_name", wms_bbox2txt ( $node_bbox ) );
	$html .= wms_hidden ( "llbox_$txt_name", wms_bbox2txt ( $node_llbbox ) );
	$html .= wms_hidden ( "srs_$txt_name", $txt_srs );
	$html .= wms_hidden ( "query_$txt_name", $queryable );
	$html .= wms_hidden ( "opaque_$txt_name", $opaque );
	$html .= "<BR>";
	return $html;
}
/*
 * wms_layer3html
 *
 * Convert a Layer node into an HTML representation sem radio.
 */
function wms_layer3html($node) {
	//
	// Convert a Layer node into an HTML representation sem radio.
	//
	$ctx = xpath_new_context ( $node );
	$xp_title = xpath_eval ( $ctx, "/Title" );
	$xp_abs = xpath_eval ( $ctx, "/Abstract" );
	$txt_title = wms_xpnode2content ( $xp_title );
	$txt_abs = wms_xpnode2content ( $xp_abs );
	$html .= "<b>" . $txt_title . "</b><i style='color:gray'>" . "-" . $txt_abs . "</i>\n";
	$html .= "<BR>";
	return $html;
}
/*
 * wms_layer4html
 *
 * Convert a Layer into an HTML WMS.
 */
function wms_layer4html($layer) {
	$estilos = wms_estilos ( $layer );
	if (count ( $estilos ) > 0) {
		$ctxl = xpath_new_context ( $layer );
		$xp_namel = xpath_eval ( $ctxl, "/Name" );
		if (wms_xpnode2content ( $xp_namel ) == "") {
			$xp_namel = xpath_eval ( $ctxl, "/name" );
		}
		$txt_namel = wms_xpnode2content ( $xp_namel );
		$html .= wms_layer3html ( $layer );
		foreach ( $estilos as $estilo ) {
			$html .= wms_layer2html ( $estilo, "estilo", $txt_namel );
		}
	} else {
		$html .= wms_layer2html ( $layer, "tema", "" );
	}
	return $html;
}

?>
