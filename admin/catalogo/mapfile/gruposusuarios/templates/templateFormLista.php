<script id="templateFormLista" type="x-tmpl-mustache">
<form id="form-edicao" style="" action="#" onsubmit="{{onSalvar}}('{{codigo}}','{{id_tema}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	{{{grupos}}}
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#0f4c81;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>