<?php
/*
 * Licenca:
 *
 * GPL2
 *
 * i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet
 *
 * Direitos Autorais Reservados (c) 2006 Edmar Moretti
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
 * Voc&ecirc; deve ter recebido uma copia da Licen&ccedil;a P&uacute;blica Geral do
 * GNU junto com este programa; se n&atilde;o, escreva para a
 * Free Software Foundation, Inc., no endere&ccedil;o
 * 59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
 */
//error_reporting ( 0 );
 include (dirname(__FILE__)."/../../../../classesphp/sani_request.php");
 include (dirname(__FILE__)."/../../../../classesphp/conexao.php");
 include (dirname(__FILE__)."/../../../../classesphp/funcoes_gerais.php");

if(!isset($idioma) || $idioma == ""){
	$idioma = "pt";
}
$id_n2 = (int)$_POST["id_subgrupo"];

$funcao = strtoupper ( $_POST["funcao"] );
switch ($funcao) {
	case "LISTA" :
		$sqlCamadas = "
SELECT n3.id_tema,t.codigo_tema,t.nome_tema,t.link_tema,lower(t.ogc_tema) AS ogc_tema,lower(t.download_tema) AS download_tema
FROM {$esquemaadmin}i3geoadmin_n3 AS n3
JOIN {$esquemaadmin}i3geoadmin_temas AS t ON n3.id_tema = t.id_tema AND n3.id_n2 = $id_n2
WHERE n3.publicado != 'NAO' AND (n3.n3_perfil = '' OR n3.n3_perfil isnull )
AND (t.ogc_tema != 'NAO' OR t.download_tema != 'NAO')
ORDER BY lower(t.nome_tema)
";

		$camadas = pegaDadosAdmin ( $sqlCamadas, $dbh );
		if ($camadas === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}

		retornaJSONutf8 ( array("dados"=>"","camadas"=>$camadas) );
		break;
}
?>