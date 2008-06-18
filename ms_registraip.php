<?php
/*
Title: ms_registraip.php

Com esta opção ativada, toda vez que um usuário abre o i3geo seu IP é identificado e a coordenada geográfica é pesquisada 
no banco de dados pacotes/geoip/GeoLiteCity.dat. A coordenada é então registrada em um banco de dados cuja conexão é definida 
na variável $conexao.
Com base nesses registros, é possível criar um tema que mostra a localização dos visitantes registrados.

Se vc não quiser que essa operação seja executada, basta comentar o código todo ou retirar o include existente em 
ms_criamapa.php. Se não existir o arquivo pacotes/geoip/GeoLiteCity.dat, o programa também não funcionará.

É preciso também que exista o arquivo pacotes/geoip/GeoLiteCity.dat, que pode ser obtido em http://www.maxmind.com/


Para mostrar os visitantes, basta usar o tema temas/visitantes.map. Exemplo

http://host/i3geo/ms_criamapa.php?temasa=visitantes&layers=visitantes

Esse mapfile deve ser editado para refletir a conexão correta ao banco de dados.

Para o funcionamento correto dessa função, deve-se ter o pacote geoip instalado em i3geo/pacotes.

É necessário também alterar os parâmetros de query no banco de dados e conexão para refletir as configurações locais do banco de dados.

As informações sobre o IP do cliente são armazenados em uma tabela em seu banco de dados. Essa tabela deve ser criada e estar acessível para leitura e escrita.

Exemplo de script para criação da tabela:

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
COMMENT ON TABLE visitantes_i3geo IS 'Registra as coordenadas dos usuários que acessam o I3Geo. É mantido pelo i3geo/ms_criamapa.php.';

File: i3geo/ms_registraip.php

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
if (file_exists($locaplic."/pacotes/geoip") && file_exists($locaplic."/pacotes/geoip/GeoLiteCity.dat"))
{
	$r["latitude"] = "";
	require_once($locaplic."/classesphp/funcoes_gerais.php");
	$conexao = "host=10.1.1.36 port=5432 dbname=geodados user=pgsql password=pgsql";
	//identifica o IP do usuário
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