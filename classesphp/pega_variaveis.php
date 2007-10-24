<?php
/*
Title: A - Carrega as variáveis passadas como POST ou GET

Processa os array $_GET e $_POST, transformando-as em variáveis conforme as chaves.
Deve ser incluído sempre nos programas em PHP, evitando que o parâmetro "REGISTER_GLOBALS" do PHP precise ser definido como "On".

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

About: Exemplo

include("pega_variaveis.php");

File: pega_variaveis.php

19/6/2007
*/
if (isset($_GET))
{
	foreach(array_keys($_GET) as $k)
	{
		if ($_GET[$k] != "''")
		eval("\$".$k."='".$_GET[$k]."';");
	}
}
if (isset($_POST))
{
	foreach(array_keys($_POST) as $k)
	{
		if ($_POST[$k] != "''")
		eval("\$".$k."='".$_POST[$k]."';");
	}
}
?>