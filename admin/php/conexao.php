<?php
/*
Title: Conexão

Define a conexão com o banco de dados com as tabelas de administração dos menus do i3geo.

Verifique se sua instalação do PHP suporta o uso da biblioteca PDO com sqlite

Você pode alterar a conexão PDO modificando a variável de configuaração $conexaoadmin no i3geo/ms_configura.php

Return:

$dbh - objeto PDO com a conexão para leitura e escrita

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
include("../ms_configura.php");
if($conexaoadmin == "")
{
	//leitura e escrita
	$dbh = new PDO('sqlite:../menutemas/admin.db');
}
else
include($conexaoadmin);
?>