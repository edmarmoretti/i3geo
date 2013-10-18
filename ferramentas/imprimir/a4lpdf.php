<?php
require(dirname(__FILE__).'/../../pacotes/fpdf/fpdf.php');
include("geraimagens.php");
$pdf=new FPDF("L","mm","A4");
$pdf->Open();
$pdf->AddPage();
$pdf->Image($nomemapa,0,0,($w-50),($h-50),'PNG');
$pdf->Close();
//$nomepdf = $dir_tmp.'/'.$imgdir.'/'.$nomes.'.pdf';
$pdf->Output("mapa.pdf",true);
?>