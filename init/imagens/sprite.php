<?php
exit;
include('../../pacotes/picStylizer/picStylizer.php');

// initialize
$pS = new picStylizer();

// define folder configuration
$config = array(
		// set the origin folder
		"origin" => array(
				"images" => "." // folder from where the script will take the images
		),
		// set destiny folder
		"destiny" => array(
				"styles" => "sprites.css", // define css style of sprites
				"sprites" => "sprites.png", // define the sprite image result
				"example" => "sprites.html", // define the html example
				"ini_path" => "" // define the path
		)
);
$pS->setFoldersConfig($config);

// define minization [true/false] (default: true)
$pS->setMinization();

// define css style by default (it will add to the sprites.css file)
$css = '';
$pS->setCssInit($css);

// gen sprites, styles and html example
$pS->getSprite();
?>