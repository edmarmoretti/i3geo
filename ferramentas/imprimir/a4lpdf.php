<?php
require('../../pacotes/fpdf/WriteHTML.php');
//define('FPDF_FONTPATH','../../pacotes/fpdf/font/');
include("geraimagens.php");
$pdf=new PDF_HTML("L","pt","A4");
$pdf->Open();
$pdf->AddPage();
$pdf->Image($nomemapa,0,0,($w-50),($h-50),'PNG');
$nomepdf = $dir_tmp.'/'.$imgdir.'/'.$nomes.'.pdf';
//$protocolo = explode("/",$_SERVER['SERVER_PROTOCOL']);
//$nomeurl = $protocolo[0]."://".$_SERVER['HTTP_HOST'].($imgo->imageurl).$nomes.'.pdf';
$pdf->Output("mapa.pdf",true);
/*
echo "<a style=font-family:Verdana,Arial,Helvetica,sans-serif; href='$nomeurl' >Arquivo gerado! Clique para ver.</a>";
echo "<p style=font-family:Verdana,Arial,Helvetica,sans-serif;> Se a imagem não couber no papel, talvez vc precise diminuir o tamano da imagem do mapa. Utilize para isso, o menu 'Propriedades' do I3Geo";
echo "<p style=font-family:Verdana,Arial,Helvetica,sans-serif;>Você pode também utilizar a opção 'Insere txt', existente na barra de ferramentas, para incluir textos no mapa, como o título, por exemplo.";
*/
?>