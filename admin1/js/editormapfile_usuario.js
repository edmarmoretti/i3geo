//
//Dependencias: Este programa necessita do arquivo "../dicionario/editormapfile.js"
//
function montaNoGruposUsrTema(dados){
	var conteudo = "&nbsp;<img style=\"position:relative;cursor:pointer;top:0px\" onclick=\"excluirGrupoUsrTema('"+dados.id_tema+"','"+dados.id_grupo+"','"+dados.codigo_tema+"')\" title=excluir width='10px' heigth='10px' src=\"../imagens/01.png\" />&nbsp;<span>"+dados.nome+"</span>";
	var d = {html:conteudo,id:"usr_"+dados.id_tema+"_"+dados.id_grupo};
	return d;
}
function excluirGrupoUsrTema(id_tema,id_grupo,codigo_mapa){
	var handleYes = function()
	{
		this.hide();
		core_carregando("ativa");
		var mensagem = " excluindo ";
		core_carregando(mensagem);
		var sUrl = "../php/editormapfile.php?funcao=excluirGrupoUsrTema&id_tema="+id_tema+"&id_grupo="+id_grupo;
		var callback =
		{
			success:function(o)
			{
				try
				{
					core_carregando("desativa");
					var no = tree.getNodeByProperty("id",codigo_mapa);
					tree.removeChildren(no) ;
					no.expand();
				}
				catch(e){core_handleFailure(e,o.responseText);}
			},
			failure:core_handleFailure,
			argument: { foo:"foo", bar:"bar" }
		};
		core_makeRequest(sUrl,callback);
	};
	var handleNo = function()
	{this.hide();};
	var mensagem = "Exclui restri&ccedil;&atilde;o?";
	var largura = "300";
	core_dialogoContinua(handleYes,handleNo,mensagem,largura);
}
function editorGrupousr(id_tema,codigo_mapa)
{
	var temp = function(){
		salvarDadosEditor('grupousr');
	};
	core_montaEditor(temp,"350px","200px","","Grupo usuario",true,true,false);
	$i("editor_bd").innerHTML = "<input type=hidden value='"+codigo_mapa+"' id='Ecodigo_mapa_usr'/><input type=hidden value='"+id_tema+"' id='Eid_tema_usr'/>";
	var sUrl = "../php/gruposusuarios.php?funcao=pegaGrupos";
	core_pegaDados("Obtendo dados...",sUrl,"montaEditorGrupousr");
}
function montaEditorGrupousr(dados){
	var temp = "";
	temp += "<p>Escolha o grupo de usu&aacute;rios:</p><div class='styled-select'><select id='Eid_grupousr' >";
	temp += core_comboObjeto(dados,"id_grupo","nome");
	temp += "</select></div>";
	$i("editor_bd").innerHTML += temp;

}
