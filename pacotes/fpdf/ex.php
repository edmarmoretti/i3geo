<?php
define('FPDF_FONTPATH','font/');
require('WriteHTML.php');

$pdf=new PDF_HTML();
$pdf->Open();
$pdf->AddPage();
$pdf->SetFont('Arial');
$pdf->WriteHTML('You can<BR><P ALIGN="center">center a line</P>and add a horizontal rule:<BR><HR>');
$pdf->Output();
?>
