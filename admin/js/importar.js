YAHOO.namespace("example.container");
function fim ()
{
	core_carregando("desativa")
}
function importarXmlMenu()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/menutemas.php?funcao=importarXmlMenu&nomemenu="+$i("nome").value+"&xml="+$i("arquivo").value,"fim()")
}
function importarXmlMapas()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/mapas.php?funcao=importarXmlMapas&xml="+$i("arquivo").value,"fim()")
}
function importarXmlAtlas()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/atlas.php?funcao=importarXmlAtlas&xml="+$i("arquivo").value,"fim()")
}
function importarXmlWS()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/webservices.php?funcao=importarXmlWS&xml="+$i("arquivo").value+"&tipo="+$i("tipo").value,"fim()")
}
function importarXmlI()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/identifica.php?funcao=importarXmlI&xml="+$i("arquivo").value,"fim()")
}
function importarXmlSistemas()
{
	core_carregando("ativa")
	core_pegaDados("importando...","../php/sistemas.php?funcao=importarXmlSistemas&xml="+$i("arquivo").value,"fim()")
}
