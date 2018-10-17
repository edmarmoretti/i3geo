<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" >
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<div class="hidden-xs">
				<span class="pull-right">&nbsp;&nbsp;</span>
				<a title="link" role="button" href="javascript:void(0)" data-toggle="quadroQrcode" data-url="{{{LINK}}}" class="btn btn-danger btn-fab btn-fab-mini pull-right">
					<span class="glyphicon glyphicon-qrcode" aria-hidden="true"></span>
				</a>
			</div>
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