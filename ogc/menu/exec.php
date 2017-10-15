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
include (dirname(__FILE__)."/../../classesphp/sani_request.php");
include (dirname(__FILE__)."/../../classesphp/conexao.php");
include (dirname(__FILE__)."/../../classesphp/funcoes_gerais.php");

if(!isset($idioma) || $idioma == ""){
	$idioma = "pt";
}
$id_menu = (int)$_POST["id_menu"];

$funcao = strtoupper ( $_POST["funcao"] );
switch ($funcao) {
	case "LISTA" :
		$sql = "
SELECT grupo.nome_grupo AS nome,n1.id_n1 AS id FROM {$esquemaadmin}i3geoadmin_n1 AS n1
JOIN {$esquemaadmin}i3geoadmin_grupos AS grupo ON n1.id_grupo = grupo.id_grupo AND n1.id_menu = $id_menu
JOIN (
	SELECT id_nivel AS id_n1, 0 AS id_n2
		FROM {$esquemaadmin}i3geoadmin_raiz AS r, {$esquemaadmin}i3geoadmin_temas AS t
		WHERE r.nivel = 1 AND r.id_tema = t.id_tema AND (t.ogc_tema != 'NAO' OR t.download_tema != 'NAO')
		AND (r.perfil = '' OR r.perfil isnull )
		GROUP BY id_n1,id_n2
	UNION
	SELECT id_n1,id_n2 FROM {$esquemaadmin}i3geoadmin_n2 WHERE
	publicado != 'NAO'
	AND (n2_perfil = '' OR n2_perfil isnull )
	GROUP BY id_n1,id_n2
	)
 AS n2 ON n2.id_n1 = n1.id_n1 OR n1.id_n1 = 0
JOIN (
	SELECT r.id_n2
	FROM  {$esquemaadmin}i3geoadmin_n3 AS r, {$esquemaadmin}i3geoadmin_temas AS t
	WHERE r.id_tema = t.id_tema AND t.ogc_tema != 'NAO' AND r.publicado != 'NAO' AND (n3_perfil = '' OR n3_perfil isnull )
	) AS n3 ON  (n3.id_n2 = n2.id_n2 OR n2.id_n2 = 0 )

WHERE n1.publicado != 'NAO' AND (n1.n1_perfil = '' OR n1.n1_perfil isnull )
GROUP BY grupo.nome_grupo,n1.id_n1
ORDER BY lower(grupo.nome_grupo)
";
		$dados = pegaDadosAdmin ( $sql, $dbh );
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		$sqlCamadas = "
			SELECT r.id_tema,t.codigo_tema,t.nome_tema,t.link_tema,lower(t.ogc_tema) AS ogc_tema,lower(t.download_tema) AS download_tema
			FROM {$esquemaadmin}i3geoadmin_raiz AS r, {$esquemaadmin}i3geoadmin_temas AS t
			WHERE r.nivel = 0 AND r.id_tema = t.id_tema AND (t.ogc_tema != 'NAO' OR t.download_tema != 'NAO') AND r.id_menu = $id_menu AND
			(r.perfil = '' OR r.perfil isnull )
			ORDER BY lower(t.nome_tema)
		";
		$camadas = pegaDadosAdmin ( $sqlCamadas, $dbh );
		$dbhw = null;
		$dbh = null;
		retornaJSONutf8 ( array("dados"=>$dados,"camadas"=>$camadas) );
		break;
}
?>