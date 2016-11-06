<script id="templateCamadas" type="x-tmpl-mustache">
<div class="list-group-item" >
	<div class="row-content" >
		<h4 class="list-group-item-heading">
			<span class="{{disabledogc}} pull-right">&nbsp;&nbsp;</span>
			<a data-toggle="modal" data-target="#modal" title="links OWS" onclick="{{dominio}}.mostraLinksServico('{{codigo_tema}}')" href="javascript:void(0)" class="{{disabledogc}} btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">cloud</i>
			</a>
			<span class="pull-right {{disableddown}}">&nbsp;&nbsp;</span>
			<a data-toggle="modal" data-target="#modal" title="download" onclick="{{dominio}}.mostraLinksDownload('{{codigo_tema}}')" href="javascript:void(0)"  class="{{disableddown}} btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">file_download</i>
			</a>
			<span class="{{disabledlink}} pull-right">&nbsp;&nbsp;</span>
			<a title="metadata" href="{{link_tema}}" target="_blank" class="{{disabledlink}} btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">description</i>
			</a>
			{{{nome_tema}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>
