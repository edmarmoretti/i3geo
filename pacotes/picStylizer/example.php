<?php
exit;
include('picStylizer.php');

// initialize
$pS = new picStylizer();

// define folder configuration
$config = array(
			// set the origin folder
			"origin" => array(
				"images" => "origin/images" // folder from where the script will take the images
			),
			// set destiny folder
			"destiny" => array(
				"styles" => "destiny/css/sprites.css", // define css style of sprites
				"sprites" => "destiny/sprites/sprites.png", // define the sprite image result
				"example" => "destiny/example/sprites.html", // define the html example
				"ini_path" => "../../" // define the path
			)
		);
$pS->setFoldersConfig($config);

// define minization [true/false] (default: true)
$pS->setMinization();

// define css style by default (it will add to the sprites.css file)
$css = 'body {background-color:#000;font-family:courier;color:#fff;font-size:14px;}';
$pS->setCssInit($css);

// gen sprites, styles and html example
$pS->getSprite();
