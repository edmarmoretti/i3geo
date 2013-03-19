<?php
$colunasarquivo = "";
$nomearquivoserv = "";
error_reporting(0);
if (isset($_FILES['i3GEOuploadArquivo']['name']))
{
	require_once (dirname(__FILE__)."/../../ms_configura.php");
	$Arquivoup = $_FILES['i3GEOuploadArquivo']['tmp_name'];
	$nomearquivoserv = $dir_tmp."/upload".basename($Arquivoup);
	//echo $nomearquivoserv;
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
		$buffer = str_replace("\r",'',$buffer);
		$colunas = explode(";",$buffer);
		if(count($colunas) == 1){
			$colunas = explode(",",$buffer);
		}
		//var_dump($colunas);
		$colunasarquivo = implode(",",$colunas);
	}
}
//echo $colunasarquivo;
//$colunasarquivo = "ano,codigoregiao,dia,gid,hora,id_medida_variavel,mes,valor_int,valor_num,valor_txt ";
?>
<html>
<script>

<?php echo "c = '$colunasarquivo';";?>
<?php echo "d = '$nomearquivoserv';";?>
window.parent.i3GEOadmin.uploaddados.COLUNASARQUIVO = c;
window.parent.i3GEOadmin.uploaddados.NOMEARQUIVOSERV = d;
window.parent.i3GEOadmin.uploaddados.upload.fimsubmit();

</script>
</html>