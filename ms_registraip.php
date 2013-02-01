<?php
/*
Com esta op&ccedil;&atilde;o ativada, toda vez que um usu&aacute;rio abre o i3geo seu IP &eacute; identificado e a coordenada geogr&aacute;fica &eacute; pesquisada 
no banco de dados pacotes/geoip/GeoLiteCity.dat. A coordenada &eacute; ent&atilde;o registrada em um banco de dados cuja conex&atilde;o &eacute; definida 
na vari&aacute;vel $conexao.
Com base nesses registros, &eacute; poss&iacute;vel criar um tema que mostra a localiza&ccedil;&atilde;o dos visitantes registrados.

Se vc n&atilde;o quiser que essa opera&ccedil;&atilde;o seja executada, basta comentar o código todo ou retirar o include existente em 
ms_criamapa.php. Se n&atilde;o existir o arquivo pacotes/geoip/GeoLiteCity.dat, o programa tamb&eacute;m n&atilde;o funcionar&aacute;.

&Eacute; preciso tamb&eacute;m que exista o arquivo pacotes/geoip/GeoLiteCity.dat, que pode ser obtido em http://www.maxmind.com/


Para mostrar os visitantes, basta usar o tema temas/visitantes.map. Exemplo

http://host/i3geo/ms_criamapa.php?temasa=visitantes&layers=visitantes

Esse mapfile deve ser editado para refletir a conex&atilde;o correta ao banco de dados.

Para o funcionamento correto dessa fun&ccedil;&atilde;o, deve-se ter o pacote geoip instalado em i3geo/pacotes.

&Eacute; necess&aacute;rio tamb&eacute;m alterar os par&acirc;metros de query no banco de dados e conex&atilde;o para refletir as configura&ccedil;&otilde;es locais do banco de dados.

As informa&ccedil;&otilde;es sobre o IP do cliente s&atilde;o armazenados em uma tabela em seu banco de dados. Essa tabela deve ser criada e estar acess&iacute;vel para leitura e escrita.

Exemplo de script para cria&ccedil;&atilde;o da tabela:

CREATE TABLE visitantes_i3geo
(
  gid serial NOT NULL,
  latitude numeric,
  longitude numeric,
  n integer,
  CONSTRAINT i3geo_visitantes_pkey PRIMARY KEY (gid)
) 
WITHOUT OIDS;
ALTER TABLE visitantes_i3geo OWNER TO pgsql;
GRANT ALL ON TABLE visitantes_i3geo TO pgsql;
GRANT SELECT ON TABLE visitantes_i3geo TO geodados;
GRANT SELECT, UPDATE, INSERT, DELETE ON TABLE visitantes_i3geo TO geoeditor;
COMMENT ON TABLE visitantes_i3geo IS 'Registra as coordenadas dos usu&aacute;rios que acessam o I3Geo. &Eacute; mantido pelo i3geo/ms_criamapa.php.';


Licenca:

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa &eacute; software livre; voc&ecirc; pode redistribu&iacute;-lo
e/ou modific&aacute;-lo sob os termos da Licen&ccedil;a P&uacute;blica Geral
GNU conforme publicada pela Free Software Foundation;

Este programa &eacute; distribu&iacute;do na expectativa de que seja &uacute;til,
por&eacute;m, SEM NENHUMA GARANTIA; nem mesmo a garantia impl&iacute;cita
de COMERCIABILIDADE OU ADEQUA&Ccedil;&Atilde;O A UMA FINALIDADE ESPEC&Iacute;FICA.
Consulte a Licen&ccedil;a P&uacute;blica Geral do GNU para mais detalhes.
Voc&ecirc; deve ter recebido uma cópia da Licen&ccedil;a P&uacute;blica Geral do
GNU junto com este programa; se n&atilde;o, escreva para a
Free Software Foundation, Inc., no endere&ccedil;o
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo: i3geo/ms_registraip.php
*/
if (file_exists($locaplic."/pacotes/geoip") && file_exists($locaplic."/pacotes/geoip/GeoLiteCity.dat"))
{
	$r["latitude"] = "";
	require_once($locaplic."/classesphp/funcoes_gerais.php");
	$conexao = "host=pgsql1.mma.gov.br port=5432 dbname=geodados user=pgsql password=pgsql";
	//identifica o IP do usu&aacute;rio
	$ip = pegaIPcliente();
	//$ip="200.252.111.1";
	$r = ip2geo($ip,$locaplic);
	if($r["latitude"] == null)
	{
		$ip = pegaIPcliente2();
		$r = ip2geo($ip);
	}
	//registra no banco o IP
	if(($r["latitude"] != null) && ($r["latitude"] != ""))
	{
		$pgconn = pg_connect($conexao);
		if($pgconn)
		{
			//
			$sqlVerificaExistencia = "select * from visitantes_i3geo where latitude = ".$r["latitude"]." and longitude = ".$r["longitude"];
			//
			$result = pg_query($pgconn, $sqlVerificaExistencia);
			$numrows = pg_num_rows($result);
			if ($numrows != 0)
			{
				//
				$sqlGravaMaisUm = "update visitantes_i3geo set n = n+1 where (latitude = ".$r["latitude"]." and longitude = ".$r["longitude"].")";
				//
				$result = pg_query($pgconn, $sqlGravaMaisUm);
			}
			else
			{
				//
				$sqlGravaNovo = "insert into visitantes_i3geo (gid,latitude,longitude,n) values(default,".$r["latitude"].",".$r["longitude"].",1)";
				//
				$result = pg_query($pgconn, $sqlGravaNovo);		
			}
			pg_close($pgconn);
		}
	}
}
?>