<?php
/*
Gera o arquivo rss servicoswms lendo os dados do banco
*/
$pgpar = "host=10.1.1.36 port=5432 dbname=geodados user=pgsql password=pgsql";
$pgconn = pg_connect($pgpar);
$sql = "SELECT * FROM public.enderecos_ws AS tab where wms = 't' and ativo = 't' order by ordem asc,titulo asc,chamadas_ok desc ";
$result=pg_query($pgconn, $sql);
$numrows = pg_num_rows($result);
pg_close($pgconn);
echo '<?xml version="1.0" encoding="UTF-8"?>';
echo '<rss version="2.0">';
echo "<channel>";
echo "<title>Mapas interativos</title>";
echo "<description>Links para mapas interativos do MMA</description>";
echo "<link>http://www.mma.gov.br</link>";
echo "<docs></docs>";
echo "<copyright>Ministerio do Meio Ambiente</copyright>";
echo "<language>pt-br</language>";
echo "<webmaster>webmaster@mma.gov.br</webmaster>";
for ($i = 0; $i < $numrows; $i++)
{
	$data = pg_fetch_array($result, $i);
	echo "<item>";
	echo "<category/>";
	echo "<title>".mb_convert_encoding($data["titulo"],"UTF-8","ISO-8859-1")."</title>";
	echo "<description>".mb_convert_encoding($data["descricao"],"UTF-8","ISO-8859-1")."</description>";
	echo "<link>".(str_replace("&","&amp;",$data["link"]))."</link>";
	echo "<linkwfs/>";
	echo "<pubDate/>";
	echo "<author>".$data["autor"]."</author>";
	echo "<ranking>".($data["chamadas_ok"] * 100 / $data["chamadas"])."</ranking>";
	echo "<tempo>".(round($data["chamadas"] / 2))."</tempo>";
	echo "</item>";
}
echo "</channel></rss>";
?>
