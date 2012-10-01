<?php
$colunasarquivo = "";
$nomearquivoserv = "";
//var_dump($_FILES);
if (isset($_FILES['i3GEOuploadArquivo']['name']))
{
	require_once (__DIR__."/../../ms_configura.php");
	$Arquivoup = $_FILES['i3GEOuploadArquivo']['tmp_name'];
	$nomearquivoserv = $dir_tmp."/upload".basename($Arquivoup);
	if(file_exists($nomearquivoserv)){
		unlink($nomearquivoserv);
	}
	$status =  move_uploaded_file($Arquivoup,$nomearquivoserv);
	if($status == 1){
		$handle = fopen ($nomearquivoserv, "r");
		$buffer = fgets($handle);
		$buffer = str_replace('"','',$buffer);
		$buffer = str_replace("'",'',$buffer);
		$buffer = str_replace("\n",'',$buffer);
		$colunas = explode(";",$buffer);
		if(count($colunas) == 1){
			$colunas = explode(",",$buffer);
		}
		$colunasarquivo = implode(";",$colunas);
	}
}
?>
<script>
window.parent.i3GEOadmin.uploaddados.COLUNASARQUIVO = "<?php echo $colunasarquivo;?>";
window.parent.i3GEOadmin.uploaddados.NOMEARQUIVOSERV = "<?php echo $nomearquivoserv;?>";
window.parent.i3GEOadmin.uploaddados.upload.fimsubmit();
</script>