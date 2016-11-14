<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" >
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<div class="hidden-xs">
				<span class="pull-right">&nbsp;&nbsp;</span>
				<a title="{{{outrosLinks}}}" onclick="mostraLinks('detalhe_{{ID_MAPA}}')" href="javascript:void(0)" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
					<i class="material-icons md-18">more_horiz</i>
				</a>
				<span class="pull-right">&nbsp;&nbsp;</span>
				<a title="{{{linkDefault}}}" href="{{{LINK}}}" class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
					<i class="material-icons md-18">launch</i>
				</a>
				<span class="pull-right">&nbsp;&nbsp;</span>
				<a title="link" role="button" href="javascript:void(0)" data-toggle="quadroQrcode" data-url="{{{LINK}}}" class="btn btn-danger btn-fab btn-fab-mini pull-right">
					<span class="glyphicon glyphicon-qrcode" aria-hidden="true"></span>
				</a>
			</div>
			<a href="{{{LINK}}}" ><img class="img-rounded hidden-xs" src="{{{IMAGEM}}}" />&nbsp;{{{NOME}}}</a>
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