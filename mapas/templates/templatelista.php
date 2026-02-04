<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" >
	<div class="row-content" >
		<h4 class="list-group-item-heading">

			<a href="link.php?id={{{ID_MAPA}}}" target="_blank"><img class="img-rounded hidden-xs" style="width:80px;" src="{{{IMAGEM}}}" />&nbsp;{{{NOME}}} <small>{{{DESCRICAO}}}</small></a>

		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
<!-- dados para o modal -->
<div style="display:none" id="detalhe_{{ID_MAPA}}">
<h4>{{{tituloModal}}}</h4>
{{{subtitulo}}}
</div>
</script>
