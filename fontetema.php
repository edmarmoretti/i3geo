<?php
/*
Title: fontetema.php

Busca o registro da fonte de um tema e abre o link.

Utilizado em ogc.php

Licenca

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

Arquivo: i3geo/fontetema.php

Parametros:

tema - nome do tema do serviço. Se for definido, o web service conterá apenas o tema.

Exemplos:

fontetema.php?tema=bioma

*/
include("ms_configura.php");
include("classesphp/pega_variaveis.php");
include("classesphp/classe_temas.php");
include("classesphp/carrega_ext.php");

$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
$protocolo = $protocolo[0];
$protocolo1 = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'];
$protocolo = strtolower($protocolo) . '://'.$_SERVER['SERVER_NAME'] .":". $_SERVER['SERVER_PORT'];
$urli3geo = str_replace("/ogc.php","",$protocolo.$_SERVER["PHP_SELF"]);

$m = new Temas("",null,$locaplic);
$retorno = $m->fonteTema($tema);
if(!headers_sent())
{header("Location:".$retorno);}
else
{echo "<meta http-equiv='refresh' content='0;url=$retorno'>";}
?>



