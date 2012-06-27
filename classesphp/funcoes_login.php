<?php
/*
Title: funcoes_login.php

Controle das requisições em Ajax utilizadas para gerenciar login de usuário e controle de acesso

Recebe as requisições feitas em JavaScript (AJAX) e retorna o resultado para a interface.

O parâmetro "funcao" define qual a operação que será executada. Esse parâmetro é verificado em um bloco "switch ($funcao)".

Licenca:

GPL2

i3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Edmar Moretti
Desenvolvedor: Edmar Moretti edmar.moretti@gmail.com

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;

Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.

Arquivo:

i3geo/classesphp/funcoes_login.php

Parametros:

funcao - opção que será executada (veja abaixo a lista de Valores que esse parâmetro pode assumir).

Retorno:

O resultado da operação será retornado em um objeto CPAINT.

A construção da string JSON é feita preferencialmente pelas funções nativas do PHP.
Para efeitos de compatibilidade, uma vez que até a versão 4.2 a string JSON era construida pelo CPAINT,
o objeto CPAINT ainda é definido, porém, a função cpjson verifica se as funções nativas do PHPO (json)
estão instaladas, se estiverem, utiliza-se a função nativa, se não, utiliza-se o CPAINT para gerar o JSON.

Exemplo de chamada CPAINT (Ajax) do lado do cliente (javascript):

var p = "classesphp/mapa_controle.php?funcao=crialente&resolucao=1.5&g_sid="+g_sid

var cp = new cpaint()

cp.set_response_type("JSON")

cp.call(p,"lente",ajaxabrelente)

*/
error_reporting(0);
//
//pega as variaveis passadas com get ou post
//
include_once("/pega_variaveis.php");
session_name("i3GeoLogin");
if(!empty($_POST["login"]) && !empty($_POST["usuario"])){
	session_regenerate_id();
	$_SESSION = array();
	session_start();
}
else{
	if(!empty($_COOKIE["i3geocodigologin"]){
		session_id($_COOKIE["i3geocodigologin"]);
		session_start();
	}
	else{
		$retorno = "erro";
	}
}

$retorno = ""; //string que será retornada ao browser via JSON
switch (strtoupper($funcao))
{
	/*
	Valor: LOGIN
	
	Verifica usuário e senha e registra id da sessao que guarda o resultado.
	
	<iniciaMapa>
	*/
	case "LOGIN":
		$_SESSION["usuario"] = $_POST["usuario"];
		$retorno = session_id();
	break;
}
cpjson($retorno);
?>