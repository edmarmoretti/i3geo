<?php
/*
 Title: Exemplo de arquivo de conex&atilde;o alternativo

Esse programa pode ser inclu&iacute;do em ms_configura.php caso se queira alterar o banco de dados default e usar um banco Postgres

dbhw - objeto PDO com a conex&atilde;o para leitura e escrita

dbh - objeto PDO com a conex&atilde;o para leitura

Licen&ccedil;a:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Minist&eacute;rio do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

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

Arquivo: i3geo/admin/php/conexaomma.php

*/
try
{
	$dbh = new PDO('pgsql:dbname=geodados;user=geodados;password=geodados;host=pgsql1.mma.gov.br');
	$dbhw = new PDO('pgsql:dbname=geodados;user=pgsql;password=pgsql;host=pgsql1.mma.gov.br');
}
catch (PDOException $e)
{
	print "Erro ao criar o objeto PDO!: " . $e->getMessage() . "<br/> Talvez exista alguma incompatibilidade entre o PHP e o banco admin.db. Vc pode apagar o arquivo menutemas/admin.db e recria-lo com admin/php/criasqlite.php";
	die();
}
$convUTF = false;
?>
