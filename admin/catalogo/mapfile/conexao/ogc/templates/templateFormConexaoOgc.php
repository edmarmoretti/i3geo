<script>
function formConexaoOgcSelCon(valor){
	$("[name='connection']").val(valor);
}
</script>
<script id="templateFormConexaoOgc" type="x-tmpl-mustache">
<form id="form-edicao-conexaoogc" style="" action="#" onsubmit="{{onSalvar}}('{{codigo}}','{{id_tema}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="connectiontype">
					{{{connectiontypeTitulo}}}
				</label>
               	<p class="small" >{{{Connectiontype}}}</p>
			</div>
			<div class="col-md-6">
				<select title="{{{connectiontypeTitulo}}}" name="connectiontype" class="form-control">
					{{{connectiontype}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					{{{connectionTitulo}}}
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{connectionTitulo}}}" type="text" value="{{{connection}}}" class="form-control" name="connection" id="connection">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_srs
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_srs}}}" type="text" value="{{{ows_srs}}}" class="form-control" name="ows_srs" id="ows_srs">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_name
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_name}}}" type="text" value="{{{ows_name}}}" class="form-control" name="ows_name" id="ows_name">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_server_version
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_server_version}}}" type="text" value="{{{ows_server_version}}}" class="form-control" name="ows_server_version" id="ows_server_version">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_format
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_format}}}" type="text" value="{{{ows_format}}}" class="form-control" name="ows_format" id="ows_format">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_auth_username
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_auth_username}}}" type="text" value="{{{ows_auth_username}}}" class="form-control" name="ows_auth_username" id="ows_auth_username">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_auth_password
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_auth_password}}}" type="text" value="{{{ows_auth_password}}}" class="form-control" name="ows_auth_password" id="ows_auth_password">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_auth_type
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_auth_type}}}" type="text" value="{{{ows_auth_type}}}" class="form-control" name="ows_auth_type" id="ows_auth_type">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_connectiontimeout
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_connectiontimeout}}}" type="text" value="{{{ows_connectiontimeout}}}" class="form-control" name="ows_connectiontimeout" id="ows_connectiontimeout">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_latlonboundingbox
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_latlonboundingbox}}}" type="text" value="{{{ows_latlonboundingbox}}}" class="form-control" name="ows_latlonboundingbox" id="ows_latlonboundingbox">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_proxy_auth_type
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_proxy_auth_type}}}" type="text" value="{{{ows_proxy_auth_type}}}" class="form-control" name="ows_proxy_auth_type" id="ows_proxy_auth_type">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_proxy_host
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_proxy_host}}}" type="text" value="{{{ows_proxy_host}}}" class="form-control" name="ows_proxy_host" id="ows_proxy_host">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_proxy_port
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_proxy_port}}}" type="text" value="{{{ows_proxy_port}}}" class="form-control" name="ows_proxy_port" id="ows_proxy_port">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_proxy_type
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_proxy_type}}}" type="text" value="{{{ows_proxy_type}}}" class="form-control" name="ows_proxy_type" id="ows_proxy_type">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_proxy_username
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_proxy_username}}}" type="text" value="{{{ows_proxy_username}}}" class="form-control" name="ows_proxy_username" id="ows_proxy_username">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_proxy_password
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_proxy_password}}}" type="text" value="{{{ows_proxy_password}}}" class="form-control" name="ows_proxy_password" id="ows_proxy_password">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_sld_body
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_sld_body}}}" type="text" value="{{{ows_sld_body}}}" class="form-control" name="ows_sld_body" id="ows_sld_body">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_sld_url
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_sld_url}}}" type="text" value="{{{ows_sld_url}}}" class="form-control" name="ows_sld_url" id="ows_sld_url">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_style
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_style}}}" type="text" value="{{{ows_style}}}" class="form-control" name="ows_style" id="ows_style">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_bgcolor
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_bgcolor}}}" type="text" value="{{{ows_bgcolor}}}" class="form-control" name="ows_bgcolor" id="ows_bgcolor">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_transparent
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_transparent}}}" type="text" value="{{{ows_transparent}}}" class="form-control" name="ows_transparent" id="ows_transparent">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_time
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_time}}}" type="text" value="{{{ows_time}}}" class="form-control" name="ows_time" id="ows_time">
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					ows_tile
				</label>
			</div>
			<div class="col-md-6">
				<input title="{{{ows_tile}}}" type="text" value="{{{ows_tile}}}" class="form-control" name="ows_tile" id="ows_tile">
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#FF6F61;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>