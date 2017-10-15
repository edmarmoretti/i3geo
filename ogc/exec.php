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
include (dirname(__FILE__)."/../classesphp/sani_request.php");
include (dirname(__FILE__)."/../classesphp/conexao.php");
include (dirname(__FILE__)."/../classesphp/funcoes_gerais.php");

if(!isset($idioma) || $idioma == ""){
	$idioma = "pt";
}
$funcao = strtoupper ( $_POST["funcao"] );
switch ($funcao) {
	case "LISTA" :
		$sql = "
SELECT n0.nome_menu AS nome,n0.id_menu AS id FROM {$esquemaadmin}i3geoadmin_menus AS n0
JOIN (
	SELECT r.id_menu AS id_menu, 0 AS id_n1
		FROM {$esquemaadmin}i3geoadmin_raiz AS r, {$esquemaadmin}i3geoadmin_temas AS t
		WHERE nivel = 0  AND r.id_tema = t.id_tema AND (t.ogc_tema != 'NAO' OR t.download_tema != 'NAO')
		AND (r.perfil = '' OR r.perfil isnull )
		GROUP BY id_menu,id_n1
	UNION
	SELECT id_menu, id_n1 FROM {$esquemaadmin}i3geoadmin_n1 WHERE publicado != 'NAO'
	AND (n1_perfil = '' OR n1_perfil isnull )
	GROUP BY id_menu, id_n1
	)
	AS n1 ON n1.id_menu = n0.id_menu
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
 AS n2 ON  n2.id_n1 = n1.id_n1 OR n1.id_n1 = 0
JOIN (
	SELECT  r.id_n2
	FROM  {$esquemaadmin}i3geoadmin_n3 AS r, {$esquemaadmin}i3geoadmin_temas AS t
	WHERE r.id_tema = t.id_tema AND t.ogc_tema != 'NAO' AND r.publicado != 'NAO' AND (n3_perfil = '' OR n3_perfil isnull )
	) AS n3 ON  (n3.id_n2 = n2.id_n2 OR n2.id_n2 = 0 )

WHERE n0.publicado_menu != 'NAO' AND (n0.perfil_menu = '' OR n0.perfil_menu isnull )
GROUP BY n0.nome_menu,n0.id_menu
ORDER BY lower(n0.nome_menu)
";
		$dados = pegaDadosAdmin ( $sql, $dbh );
		$dbhw = null;
		$dbh = null;
		if ($dados === false) {
			header ( "HTTP/1.1 500 erro ao consultar banco de dados" );
			exit ();
		}
		retornaJSONutf8 ( array("dados"=>$dados) );
		break;

	case "LISTATODAS":
		$sqlCamadas = "
		SELECT * FROM (SELECT n3.id_tema AS id_tema,t.codigo_tema AS codigo_tema,t.nome_tema AS nome_tema,t.link_tema AS link_tema,
		lower(t.ogc_tema) AS ogc_tema,lower(t.download_tema) AS download_tema
		FROM {$esquemaadmin}i3geoadmin_n3 AS n3, {$esquemaadmin}i3geoadmin_temas AS t
		WHERE n3.id_tema = t.id_tema AND t.ogc_tema != 'NAO' AND n3.publicado != 'NAO' AND (n3_perfil = '' OR n3_perfil isnull )
		UNION
		SELECT r.id_tema AS id_tema,t.codigo_tema AS codigo_tema,t.nome_tema AS nome_tema,t.link_tema AS link_tema,
		lower(t.ogc_tema) AS ogc_tema,lower(t.download_tema) AS download_tema
		FROM {$esquemaadmin}i3geoadmin_raiz AS r, {$esquemaadmin}i3geoadmin_temas AS t
		WHERE r.id_tema = t.id_tema AND (t.ogc_tema != 'NAO' OR t.download_tema != 'NAO')) AS u
		GROUP BY id_tema,codigo_tema,nome_tema,link_tema,ogc_tema,download_tema
		ORDER BY lower(u.nome_tema)
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