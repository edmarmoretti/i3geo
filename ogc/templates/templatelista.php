<script id="templateLista" type="x-tmpl-mustache">
<div class="list-group-item" style="background-color: #f2f2f2;">
	<div style="cursor:pointer;" class="row-content" onclick="{{{onclick}}}('{{id}}','{{{nome}}}')">
		<h4 class="list-group-item-heading">
			<span class="pull-right">&nbsp;&nbsp;</span>
			<a href="javascript:void(0)"  class="btn btn-danger btn-fab btn-fab-mini pull-right" role="button">
				<i class="material-icons md-18">folder_open</i>
			</a>
			{{{nome}}}
		</h4>
	</div>
	<div class="list-group-separator"></div>
</div>
</script>