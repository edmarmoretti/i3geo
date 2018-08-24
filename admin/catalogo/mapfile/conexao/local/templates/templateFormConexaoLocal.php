<?php
//combo com os alias de conexao
if(!isset($postgis_mapa)){
	include (dirname ( __FILE__ ) . "/../../../../../../ms_configura.php");
}
$_chaves = array_keys($postgis_mapa);
$_combo = "";
foreach ($_chaves as $_chave){
	$_combo .= "<li><a href='javascript:formConexaoLocalSelCon(\"".$_chave."\");void(0);'>$_chave</a></li>";
}
?>
<script>
function formConexaoLocalSelCon(valor){
	$("[name='connection']").val(valor);
}
</script>
<script id="templateFormConexaoLocal" type="x-tmpl-mustache">
<form id="form-edicao-conexaolocal" style="" action="#" onsubmit="{{onSalvar}}('{{codigo}}','{{id_tema}}');return false;"   class="form-horizontal" role="form"
	method="post"  >
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="type">
					{{{typeTitulo}}}
				</label>
				<div id="typeAjuda" class="collapse leiaMais">
                	<p class="small" >{{{Type}}}</p>
            	</div>
            	<a href="#typeAjuda" data-toggle="collapse" class="collapsed">
                	<span class="text-primary readMore"><i class="material-icons">keyboard_arrow_down</i></span>
                	<span class="text-primary readLess"><i class="material-icons">keyboard_arrow_up</i></span>
            	</a>
			</div>
			<div class="col-md-6">
				<select title="{{{typeTitulo}}}" name="type" class="form-control">
					{{{type}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="projection">
					{{{projecao}}}
				</label>
				<div id="projectionAjuda" class="collapse leiaMais">
                	<p class="small" >{{{projecaoTitulo}}}</p>
            	</div>
            	<a href="#projectionAjuda" data-toggle="collapse" class="collapsed">
                	<span class="text-primary readMore"><i class="material-icons">keyboard_arrow_down</i></span>
                	<span class="text-primary readLess"><i class="material-icons">keyboard_arrow_up</i></span>
            	</a>
			</div>
			<div class="col-md-6">
				<input title="{{{projecao}}}" type="text" value="{{{projection}}}" class="form-control" name="projection" >
			</div>
		</div>
	</div>
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
				<label class="control-label" for="connection">
					{{{connectionTitulo}}}
				</label>
				<div id="connectionAjuda" class="collapse leiaMais">
                	<p class="small" >{{{Connection}}}</p>
            	</div>
            	<a href="#connectionAjuda" data-toggle="collapse" class="collapsed">
                	<span class="text-primary readMore"><i class="material-icons">keyboard_arrow_down</i></span>
                	<span class="text-primary readLess"><i class="material-icons">keyboard_arrow_up</i></span>
            	</a>
			</div>
			<div class="col-md-6">
				<input title="{{{connectionTitulo}}}" type="text" value="{{{connection}}}" class="form-control" name="connection" id="connection">
			</div>
			<div class="col-md-6">
				<label class="control-label" for="listaConnection"></label>
				<div class="btn-group">
					<a href="javascript:void(0)" class="btn btn-primary dropdown-toggle" data-toggle="dropdown">{{{escolhaDalista}}} <span class="caret"></span></a>
					<ul class="dropdown-menu">
					<?php echo $_combo;?>
					</ul>
				</div>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="data">
					{{{dataTitulo}}}
				</label>
				<div id="dataAjuda" class="collapse leiaMais">
                	<p class="small" >{{{Data}}}</p>
            	</div>
            	<a href="#dataAjuda" data-toggle="collapse" class="collapsed">
                	<span class="text-primary readMore"><i class="material-icons">keyboard_arrow_down</i></span>
                	<span class="text-primary readLess"><i class="material-icons">keyboard_arrow_up</i></span>
            	</a>
			</div>
			<div class="col-md-6">
				<textarea style="resize: both;" title="{{{dataTitulo}}}" rows="8" class="form-control" name="data" >{{{data}}}</textarea>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label text-left" for="metaestat">
					{{{metaestatTitulo}}}
				</label>
               	<p class="small" >{{{Metaestat}}}</p>
			</div>
			<div class="col-md-6">
				<select title="{{{metaestatTitulo}}}" name="metaestat" class="form-control">
					{{{metaestat}}}
				</select>
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label text-left" for="metaestat_id_medida_variavel">
					{{{medidaVariavelTitulo}}}
				</label>
               	<p class="small" >{{{medidaVariavel}}}</p>
			</div>
			<div class="col-md-6">
				<input title="{{{medidaVariavelTitulo}}}" type="text" value="{{{metaestat_id_medida_variavel}}}" class="form-control" name="metaestat_id_medida_variavel" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="tileindex">
					tileIndex
				</label>
				<div id="tileindexAjuda" class="collapse leiaMais">
                	<p class="small" >{{{tileIndex}}}</p>
            	</div>
            	<a href="#tileindexAjuda" data-toggle="collapse" class="collapsed">
                	<span class="text-primary readMore"><i class="material-icons">keyboard_arrow_down</i></span>
                	<span class="text-primary readLess"><i class="material-icons">keyboard_arrow_up</i></span>
            	</a>
			</div>
			<div class="col-md-6">
				<input title="tileIndex" type="text" value="{{{tileindex}}}" class="form-control" name="tileindex" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="tileitem">
					tileItem
				</label>
                	<p class="small" >{{{tileItem}}}</p>
			</div>
			<div class="col-md-6">
				<input title="tileItem" type="text" value="{{{tileitem}}}" class="form-control" name="tileitem" >
			</div>
		</div>
	</div>
	<div class="col-md-12">
		<div class="form-group form-group-lg">
			<div class="col-md-6">
				<label class="control-label" for="convcaracter">
					{{{convCaracterTitulo}}}
				</label>
				<div id="convcaracterAjuda" class="collapse leiaMais">
                	<p class="small" >{{{convCaracter}}}</p>
            	</div>
            	<a href="#convcaracterAjuda" data-toggle="collapse" class="collapsed">
                	<span class="text-primary readMore"><i class="material-icons">keyboard_arrow_down</i></span>
                	<span class="text-primary readLess"><i class="material-icons">keyboard_arrow_up</i></span>
            	</a>
			</div>
			<div class="col-md-6">
				<select title="{{{convCaracterTitulo}}}" name="convcaracter" class="form-control">
					{{{convcaracter}}}
				</select>
			</div>
		</div>
	</div>
	<div class="pull-right">
		<button type="submit" class="btn btn-primary" role="button" style="color:#5F4B8B;">{{salvar}}</button>
	</div>
	<div class="clearfix"></div>
</form>
</script>