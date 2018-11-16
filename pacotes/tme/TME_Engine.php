<?php
//
// SOFTWARE NAME: Thematic Mapping Engine
// SOFTWARE RELEASE: 1.6
// COPYRIGHT NOTICE: Copyright (C) 2008 Bjorn Sandvik,
//                   bjorn@thematicmapping.org
// SOFTWARE LICENSE: GNU General Public License version 3 (GPLv3)
// NOTICE: >
//  This program is free software; you can redistribute it and/or
//  modify it under the terms of version 3 of the GNU General
//  Public License as published by the Free Software Foundation.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
//  GNU General Public License for more details.
//  http://www.gnu.org/licenses/
//
//


class ThematicMap
{
	public $dataStore;
	public $coordDecimals = 2;
	public $engine = "";
	public $logoline = "files/balloonlogo.png";
	public $logo = 'files/logo.png';

	// Parameters
	public $mapType = 'choropleth';     // choropleth / prism / symbol
	public $symbolType;                 // image / polygon // collada
	public $symbolShape;
	public $mapTitle;
	public $mapDescription;
	public $mapSource;
	public $showTitle = true;
	public $showLegend = true;
	public $showValues = false;
	public $showNames = false;
	public $timeType = 'year';              // year / series / slider
	public $maxHeight = 2000000;        // Prism / Bar
	public $symbolMaxSize;                    // Symbol$imgBrand
	public $barSize = 50000;
	public $maxValue;
	public $minValue;

	public $indicatorID;
	public $indicator;
	public $year;
	private $yearArray;

	// Colour parameters
	public $colourType = 'scale';         // scale / single
	public $startColour = 'FFFF99';
	public $endColour = 'FF6600';
	public $noDataColour = 'CCCCCC';
	public $colour = 'FF6600';
	public $opacity = 90;

	public $classification = 'unclassed'; // unclassed / equal / quantile
	public $numClasses = 5;
	public $nomeArquivo = "";
	public $nomeTemp = ""; //prefixo para as imagens
	public $outlinecolor = "";
	public $numvertices = "";

	private $myColourScale;               // Only choropleth/prism
	private $startColourRGB;            // Array
	private $endColourRGB;              // Array
	private $deltaColour;               // Array
	private $kmlAlphaColour = 220;
	private $colourLegendHeight = 350;
	private $colourLegendWidth = 30;

	private $symbolVertices = 30;       // Circle
	private $showLabel = false;

	private $classBreaks;               // Array
	private $classColours;              // Array


	private $precision = 0;             // Number of decimals

	//
	// Constructor
	// @access protected
	//
	function __construct($dataStore, $paramArray, $nomeTemp = "")
	{
		$this->dataStore = $dataStore;
		if($nomeTemp == ""){
			$this->nomeTemp = time();
		}else{
			$this->nomeTemp = $nomeTemp;
		}

		// Mandatory parameters
		$this->mapType     = $paramArray['mapType'];   // Mapping technique
		$this->indicatorID = $paramArray['indicator']; // Main indicator
		$this->year        = $paramArray['year'];      // Year
		if(!isset($paramArray['outlinecolor']) || $paramArray['outlinecolor'] == "" || $paramArray['outlinecolor'] == "-1,-1,-1"){
			$this->outlinecolor = "";
		}
		else{
			$this->outlinecolor = $this->RGB2hex(explode(",",$paramArray['outlinecolor']));
		}
		$this->numvertices     = $paramArray['numvertices'];
		$this->dirtmp        = $paramArray['dirtmp'];
		// Extract indicator metadata and values from dataStore
		if($dataStore != ""){
			$this->indicator = $this->dataStore['indicators'][$this->indicatorID];
		}
		$this->minValue  = $this->indicator['min'];
		$this->maxValue  = $this->indicator['max'];
		$this->precision = $this->indicator['decimals'];

		// Optional parameters: mapTitle, mapDescription and source
		if (isset($paramArray['mapTitle'])) $this->mapTitle = $paramArray['mapTitle'];
		else $this->mapTitle = $this->indicator['name']; // Use default from indicator

		if (isset($paramArray['mapDescription'])) $this->mapDescription = $paramArray['mapDescription'];
		else $this->mapDescription = $this->indicator['description']; // Use default from indicator

		if (isset($paramArray['mapSource'])) $this->mapSource = $paramArray['mapSource'];
		else {
			//$this->mapSource = 'Statistics from ' . $this->indicator['source']; // Use default from indicator
		}

		// Other optional parameters
		if (isset($paramArray['timeType']))       $this->timeType       = $paramArray['timeType'];
		if (isset($paramArray['showTitle']))      $this->showTitle      = $paramArray['showTitle'];
		if (isset($paramArray['showLegend']))     $this->showLegend     = $paramArray['showLegend'];
		if (isset($paramArray['colourType']))     $this->colourType     = $paramArray['colourType'];
		if (isset($paramArray['colour']))         $this->colour         = $paramArray['colour'];
		if (isset($paramArray['startColour']))    $this->startColour    = $paramArray['startColour'];
		if (isset($paramArray['endColour']))      $this->endColour      = $paramArray['endColour'];
		if (isset($paramArray['noDataColour']))   $this->noDataColour   = $paramArray['noDataColour'];
		if (isset($paramArray['showValues']))     $this->showValues     = $paramArray['showValues'];
		if (isset($paramArray['showNames']))      $this->showNames      = $paramArray['showNames'];
		if (isset($paramArray['symbolType']))     $this->symbolType     = $paramArray['symbolType'];
		if (isset($paramArray['symbolShape']))    $this->symbolShape    = $paramArray['symbolShape'];
		if (isset($paramArray['symbolMaxSize']))  $this->symbolMaxSize  = $paramArray['symbolMaxSize'];
		if (isset($paramArray['maxHeight']))      $this->maxHeight      = $paramArray['maxHeight'];
		if (isset($paramArray['barSize']))        $this->barSize        = $paramArray['barSize'];
		if (isset($paramArray['classification'])) $this->classification = $paramArray['classification'];
		if (isset($paramArray['numClasses']))     $this->numClasses     = $paramArray['numClasses'];

		if ($this->showValues || $this->showNames) {
			$this->showLabel = true;
		}

		if (isset($paramArray['opacity'])) {
			$this->opacity = $paramArray['opacity'];
			$this->kmlAlphaColour = 255 * $this->opacity / 100;
		}

		// Make an array of available years
		if ($this->timeType != 'year') $this->yearArray = $this->indicator['years'];
		else $this->yearArray = array($this->year); // Only one year
	}
	//
	// Constructor
	// @access protected
	//
	function __deconstruct()
	{
		// What goes here?
	}
	//
	// Function
	// @access protected
	//
	public function getKML($url,$download = false, $file = "")
	{
		// Create KMZ archieve
		if($file == ""){
			$file = $this->dirtmp."/tme". $this->nomeTemp. ".kmz";
		}
		$this->nomeArquivo = $file;
		if(!file_exists($file)){
			include(dirname(__FILE__)."/../kmlmapserver/classes/zip.class.php");
			$zip = new zipfile();
			// Add balloon logo to archieve (300 x 30 px)
			$zip->addFile($this->logoline, 'files/balloonlogo.png');

			// KML header
			$kml = "<?xml version='1.0' encoding='UTF-8'?>" . PHP_EOL
			. "<kml xmlns='http://www.opengis.net/kml/2.2' xmlns:atom='http://www.w3.org/2005/Atom'>" . PHP_EOL
			. "  <Document>" . PHP_EOL
			. "    <atom:author>" . PHP_EOL
			. "      <atom:name>Thematic Mapping Engine</atom:name>" . PHP_EOL
			. "    </atom:author>" . PHP_EOL
			. "    <atom:link href='http://thematicmapping.org' rel='related' />" . PHP_EOL
			. "    <name>$this->mapTitle</name>" . PHP_EOL
			. "    <open>1</open>" . PHP_EOL
			. "    <Snippet maxLines='1'>$this->mapSource</Snippet>" . PHP_EOL
			. "    <description><![CDATA[ $this->mapDescription <p>$this->mapSource</p>$this->engine ]]></description>" . PHP_EOL;
			// Add style for indicator balloon
			$kmlStyles = "    <Style id='balloonStyle'>" . PHP_EOL
			. "      <BalloonStyle>" . PHP_EOL
			. "        <text><![CDATA[" . PHP_EOL
			. "          <a href='http://thematicmapping.org'><img src='http://thematicmapping.org/engine/files/balloonlogo.png'></a>" . PHP_EOL
			. "          <p><b><font size='+2'>$[name]</font></b></p>" . PHP_EOL
			. "          <p>$[description]</p>" . PHP_EOL
			. "        ]]></text>" . PHP_EOL
			. "      </BalloonStyle>" . PHP_EOL
			. "    </Style>" . PHP_EOL
			. "    <styleUrl>#balloonStyle</styleUrl>" . PHP_EOL;


			if ($this->colourType == 'scale') {
				// Need to run before getColourValue / getColourLegend / makeClasses
				self::makeColourScale();

				if ($this->classification != 'unclassed') {
					self::makeClasses($this->classification, $this->numClasses);
				}

				// Add colour legend to KMZ archieve
				if ($this->showLegend) {
					$imgLegenda = self::getColourLegend();
					$zip->addFile($imgLegenda,'files/legend.png');
				}
				$kmlSingleColour = ''; // Colours needs to be defined for each feature
				//$kmlColour = self::rgb2bgr($this->noDataColour); // Not in use, only so the variable has a value
			}
			else {
				$kmlSingleColour = '<color>' . self::rgb2bgr($this->colour) . '</color>';
				//$kmlColour = self::rgb2bgr($this->colour);
			}


			// Add style for value placemarks
			if ($this->showLabel) {
				$kmlStyles .= "    <Style id='labelPlacemark'>" . PHP_EOL
				. "      <IconStyle>" . PHP_EOL
				. "        <scale>0.0</scale>" . PHP_EOL
				. "      </IconStyle>" . PHP_EOL
				. "      <LabelStyle>" . PHP_EOL
				. "        <scale>1</scale>" . PHP_EOL
				. "      </LabelStyle>" . PHP_EOL
				. "    </Style>" . PHP_EOL;
			}

			// Define shared styles and legend
			$kmlStyles .= "    <Style id='sharedStyle'>" . PHP_EOL;
			switch ($this->mapType) {

				case "choropleth":
				case "prism":

					$kmlStyles .= "      <PolyStyle>" . PHP_EOL
					. "        <fill>1</fill>" . PHP_EOL
					. "        <outline>1</outline>" . PHP_EOL
					. "        $kmlSingleColour" . PHP_EOL
					. "      </PolyStyle>" . PHP_EOL
					. "      <LineStyle>" . PHP_EOL
					. "        <color>cc000000</color>" . PHP_EOL
					. "      </LineStyle>" . PHP_EOL;
					break;

				case "bar":
					if($this->outlinecolor == ""){
						$outline = 0;
					} else {
						$outline = 1;
					}
					$kmlStyles .= "      <PolyStyle>" . PHP_EOL
					. "        <fill>1</fill>" . PHP_EOL
					. "        <outline>".$outline."</outline>" . PHP_EOL
					. "        $kmlSingleColour" . PHP_EOL
					. "      </PolyStyle>" . PHP_EOL;
					if($this->outlinecolor != ""){
						$kmlStyles .= "<LineStyle>" . PHP_EOL
							. "        <color>".$this->outlinecolor."</color>" . PHP_EOL
							. "      </LineStyle>" . PHP_EOL;
					}
					break;
					// Proportional symbol
				case "symbol":

					switch($this->symbolType){

						case 'image':
							$zip->addFile("files/$this->symbolShape.png", 'files/symbol.png');
							$kmlStyles .= "      <IconStyle>" . PHP_EOL
							. "        $kmlSingleColour" . PHP_EOL
							. "        <Icon>" . PHP_EOL
							. "          <href>".$url."/symbol.png</href>" . PHP_EOL
							. "        </Icon>" . PHP_EOL
							. "      </IconStyle>" . PHP_EOL;
							break;

						case 'polygon':
							if ($this->symbolShape == 'square') {
								$this->symbolVertices = 4;
							}
							$kmlStyles .= "      <PolyStyle>" . PHP_EOL
							. "        $kmlSingleColour" . PHP_EOL
							. "        <fill>1</fill>" . PHP_EOL
							. "        <outline>1</outline>" . PHP_EOL
							. "      </PolyStyle>" . PHP_EOL
							. "      <LineStyle>" . PHP_EOL
							. "        <color>cc000000</color>" . PHP_EOL
							. "      </LineStyle>" . PHP_EOL;
							break;

						case 'collada':
							if ($this->colourType == 'scale') {
								// Limit number of collada objects (one for each colour)
								if ($this->classification == 'unclassed') {
									self::makeClasses('equal', 12);
								}

								foreach($this->classColours as $class => $classColour){
									$colladaColour = self::rgb2collada($classColour);

									// Read collada model
									$filename = "files/$this->symbolShape.dae";
									$handle = fopen($filename, "r");
									$collada = fread($handle, filesize($filename));
									fclose($handle);

									// Search and replace colour
									$pos = strpos($collada, '<effect id="material0-effect" name="material0-effect">');
									$pos = strpos($collada, "<diffuse>", $pos);
									$pos = strpos($collada, "<color>", $pos);
									$collada = substr_replace($collada, $colladaColour, $pos+7, 28);

									// Add collada object to kmz archieve
									$zip->addFromString("files/object$class.dae", $collada);
								}
							}

							// Single colour
							else {
								$colladaColour = self::rgb2collada($this->colour);

								// Read collada model
								$filename = "files/$this->symbolShape.dae";
								$handle = fopen($filename, "r");
								$collada = fread($handle, filesize($filename));
								fclose($handle);

								// Search and replace colour
								$pos = strpos($collada, '<effect id="material0-effect" name="material0-effect">');
								$pos = strpos($collada, "<diffuse>", $pos);
								$pos = strpos($collada, "<color>", $pos);
								$collada = substr_replace($collada, $colladaColour, $pos+7, 28);

								// Add collada object to kmz archieve
								$zip->addFromString("files/object.dae", $collada);
							}

							$kmlstyle = ''; // Not possible to define style for collada objects

					} // switch symbol
			} // switch type

			$kmlStyles .= "      <BalloonStyle>" . PHP_EOL
			. "        <text><![CDATA[" . PHP_EOL
			. "          <a href='http://thematicmapping.org'><img src='http://thematicmapping.org/engine/files/balloonlogo.png'></a>" . PHP_EOL
			. "          <p><b><font size='+2'>$[name]</font></b></p>" . PHP_EOL
			. "          <p>$this->mapTitle: $[Snippet]</p>" . PHP_EOL
			. "          <p>$this->mapDescription</p>" . PHP_EOL
			. "          <p>$this->mapSource</p>" . PHP_EOL
			. "          <p>$this->engine</p>" . PHP_EOL
			. "        ]]></text>" . PHP_EOL
			. "      </BalloonStyle>" . PHP_EOL
			. "    </Style>" . PHP_EOL;  // End of shared style

			$kmlFolder = "    <Folder>" . PHP_EOL
			. "      <name>Colunas</name>" . PHP_EOL
			. "      <open>1</open>" . PHP_EOL;

			if ($this->timeType == 'series') {
				$kmlFolder .= "      <Style>" . PHP_EOL
				. "        <ListStyle>" . PHP_EOL
				. "          <listItemType>radioFolder</listItemType>" . PHP_EOL
				. "        </ListStyle>" . PHP_EOL
				. "      </Style>" . PHP_EOL;
			}

			// Loop thorough all years
			foreach ($this->yearArray as $key => $year) {

				$kmlFeatures = '';

				if (($this->timeType == 'slider') OR ($year == $this->year)) $visibility = 1;
				else $visibility = 0;

				$kmlFolder .= "      <Folder>" . PHP_EOL
				. "        <name>$year</name>" . PHP_EOL
				. "        <visibility>$visibility</visibility>" . PHP_EOL;

				if ($this->showLabel) {
					$kmlLabels = "        <Folder>" . PHP_EOL
					. "          <name>Show/hide labels</name>" . PHP_EOL
					. "          <visibility>$visibility</visibility>" . PHP_EOL
					. "          <Style>" . PHP_EOL
					. "            <ListStyle>" . PHP_EOL
					. "              <listItemType>checkHideChildren</listItemType>" . PHP_EOL
					. "            </ListStyle>" . PHP_EOL
					. "          </Style>" . PHP_EOL;
				}

				// Add timespan if time animation
				if ($this->timeType == 'slider') {

					$end = '';
					// Check if there is more years
					if (array_key_exists($key+1, $this->yearArray)) {
						$end = '<end>' . intval($this->yearArray[$key+1]-1) . '-12-31</end>';
					}
					$kmlFolder .= "        <TimeSpan>" . PHP_EOL
					. "          <begin>$year-01-01</begin>$end" . PHP_EOL
					. "        </TimeSpan>" . PHP_EOL;

				}
				// Loop thorough all features (values without features will not be shown)
				foreach ($this->dataStore['features'] as $featureID => $feature)
				{
					$name = $feature['name'];
					//if (!mb_detect_encoding($name,"UTF-8",true))
					//{$name = mb_convert_encoding($name,"UTF-8","ISO-8859-1");}
					$name = "<![CDATA[ ".$name." ]]>";
					$value = ''; // use null?
					$valueText = 'no data';
					$valueLabel = '';
					$kmlFeature = '';
					$altitude = 0;
					$symbolSize = 0;
					$colladaCount = 0;
					//$kmlColour = self::rgb2bgr($this->noDataColour);
					$kmlColour = '';

					$longitude = $feature['lon'];
					$latitude = $feature['lat'];

					// Check if value exists for this feature
					if (isset($this->indicator['values'][$year][$featureID])) {
						// Extract value from dataStore
						$value = $this->indicator['values'][$year][$featureID];
						$valueText = $valueLabel = number_format($value, 2, ',', '.');
						// Colour scale
						if ($this->colourType == 'scale') {
							if ($this->classification != 'unclassed') {
								$class = self::getClass($value);
								$kmlColour = self::rgb2bgr($this->classColours[$class]);
							}
							else {
								$kmlColour = self::getColourValue($value, 'kml');
							}
						}
						// Single colour
						//else {
						//    $kmlColour = self::rgb2bgr($this->colour);
						//}
					}
					else {
						$kmlColour = self::rgb2bgr($this->noDataColour);
					}
					if($this->outlinecolor == ""){
						$outline = 0;
					} else {
						$outline = 1;
					}

					switch ($this->mapType) {

						case "choropleth":

							$kmlFeature = "          <Style>" . PHP_EOL
							. "            <PolyStyle>" . PHP_EOL
							. "              <color>$kmlColour</color>" . PHP_EOL
							. "            </PolyStyle>" . PHP_EOL
							. "          </Style>" . PHP_EOL;
							$kmlFeature .= self::wkt2kml($feature['wkt'], 0);
							break;

						case "prism":
							$altitude = intval($value * ($this->maxHeight / $this->maxValue));

							if ($this->colourType == 'scale') {
								$kmlFeature = "          <Style>" . PHP_EOL
								. "            <PolyStyle>" . PHP_EOL
								. "              <color>$kmlColour</color>" . PHP_EOL
								. "            </PolyStyle>" . PHP_EOL
								. "          </Style>" . PHP_EOL;
							}

							$kmlFeature .= self::wkt2kml($feature['wkt'], $altitude) . PHP_EOL;
							break;

						case "bar":
							if ($value != null) {
								$altitude = intval($value * ($this->maxHeight / $this->maxValue));

								if ($this->colourType == 'scale') {
									$kmlFeature = "          <Style>" . PHP_EOL
									. "            <PolyStyle>" . PHP_EOL
									. "              <color>$kmlColour</color>" . PHP_EOL
									. "              <outline>".$outline."</outline>" . PHP_EOL
									. "            </PolyStyle>" . PHP_EOL;
									if($this->outlinecolor != ""){
										$kmlFeature .= "<LineStyle>" . PHP_EOL
										. "        <color>".$this->outlinecolor."</color>" . PHP_EOL
										. "      </LineStyle>" . PHP_EOL;
									}
									$kmlFeature .= "          </Style>" . PHP_EOL;
								}

								$kmlFeature .= self::kmlSymbolCalculator($longitude, $latitude, $this->barSize, $this->numvertices, $altitude);
							}
							break;

						case "symbol":
							if ($value != null) {

								switch($this->symbolType){

									case 'im$z = new ZipArchive();
									$z->open("test.zip", ZIPARCHIVE::CREATE);
									folderToZip("storeThisFolder", $z);
									$z->close();age':
									//$symbolSize = round(self::getSymbolSize($value, $this->symbolShape),2);
									$symbolSize = round($this->symbolMaxSize * sqrt($value/$this->maxValue), 2);

									$kmlFeature = "          <Style>" . PHP_EOL
									. "            <IconStyle>" . PHP_EOL
									. "              <scale>$symbolSize</scale>" . PHP_EOL
									. "              <color>$kmlColour</color>" . PHP_EOL
									. "            </IconStyle>" . PHP_EOL
									. "          </Style>" . PHP_EOL;

									$kmlFeature .= "          <LookAt>" . PHP_EOL
									. "            <longitude>$longitude</longitude>" . PHP_EOL
									. "            <latitude>$latitude</latitude>" . PHP_EOL
									. "            <altitude>0</altitude>" . PHP_EOL
									. "            <range>3200000</range>" . PHP_EOL
									. "            <altitudeMode>clampToGround</altitudeMode>" . PHP_EOL
									. "          </LookAt>" . PHP_EOL
									. "          <Point>" . PHP_EOL
									. "            <coordinates>$longitude,$latitude,0</coordinates>" . PHP_EOL
									. "          </Point>" . PHP_EOL;
									break;

									case 'polygon':
										//$symbolSize = intval(self::getSymbolSize($value, $this->symbolShape));
										$symbolSize = intval($this->symbolMaxSize * sqrt($value/$this->maxValue) * 70000);
										if ($this->colourType == 'scale') {
											$kmlFeature = "          <Style>" . PHP_EOL
											. "            <PolyStyle>" . PHP_EOL
											. "              <color>$kmlColour</color>" . PHP_EOL
											. "            </PolyStyle>" . PHP_EOL
											. "          </Style>" . PHP_EOL;
										}
										$kmlFeature .= self::kmlSymbolCalculator($longitude, $latitude, $symbolSize, $this->symbolVertices, 0);
										break;

									case 'collada':

										//$symbolSize = intval(self::getSymbolSize($value, $this->symbolShape));
										$symbolSize = intval($this->symbolMaxSize * pow($value/$this->maxValue, 1/3) * 20000);

										$class = ''; // Single colour
										if ($this->colourType == 'scale') $class = self::getClass($value);

										$altitude = $symbolSize; // Used for label placement
										$kmlFeature = "          <Model>" . PHP_EOL
										. "            <altitudeMode>absolute</altitudeMode>" . PHP_EOL
										. "            <Location>" . PHP_EOL
										. "              <longitude>$longitude</longitude>" . PHP_EOL
										. "              <latitude>$latitude</latitude>" . PHP_EOL
										. "              <altitude>0</altitude>" . PHP_EOL
										. "            </Location>" . PHP_EOL
										. "            <Scale>" . PHP_EOL
										. "              <x>$symbolSize</x>" . PHP_EOL
										. "              <y>$symbolSize</y>" . PHP_EOL
										. "              <z>$symbolSize</z>" . PHP_EOL
										. "            </Scale>" . PHP_EOL
										. "            <Link>" . PHP_EOL
										. "              <href>files/object$class.dae</href>" . PHP_EOL
										. "            </Link>" . PHP_EOL
										. "          </Model>" . PHP_EOL;
								} // switch
							} // if
					} // switch


					$kmlFeatures .= "        <Placemark>" . PHP_EOL
					. "          <name>$name</name>" . PHP_EOL
					. "          <visibility>$visibility</visibility>" . PHP_EOL
					. "          <Snippet>$valueText ($year)</Snippet>" . PHP_EOL
					. "          <styleUrl>#sharedStyle</styleUrl>" . PHP_EOL
					. $kmlFeature
					. "        </Placemark>" . PHP_EOL;

					if ($this->showLabel) {
						$label = '';
						if ($this->showNames) $label = $name;
						if ($this->showValues) $label .= ' ' . $valueLabel;
						$kmlLabels .= "          <Placemark>" . PHP_EOL
						. "            <name>$label</name>" . PHP_EOL
						. "            <visibility>$visibility</visibility>" . PHP_EOL
						. "            <styleUrl>#labelPlacemark</styleUrl>" . PHP_EOL
						. "            <Point>" . PHP_EOL
						. "              <altitudeMode>absolute</altitudeMode>" . PHP_EOL
						. "              <coordinates>$longitude, $latitude, $altitude</coordinates>" . PHP_EOL
						. "            </Point>" . PHP_EOL
						. "          </Placemark>" . PHP_EOL;
					}

				} // foreach features

				if ($this->showLabel) {
					$kmlLabels .= "        </Folder>";
					$kmlFolder .= $kmlLabels;
				}

				$kmlFolder .= $kmlFeatures;

				$kmlFolder .= "      </Folder>" . PHP_EOL;
			} // foreach years



			// Close Years folder
			$kmlFolder .= "    </Folder>" . PHP_EOL;

			// Create logo with title and source and add to archieve
			if ($this->showTitle) {
				$imgBrand = self::mapTitleImage();
				$zip->addFile($imgBrand, 'files/brand.png');
			}
			else {
				$zip->addFile($this->logo, 'files/brand.png');
			}
			// Add title
			$kml .= "    <ScreenOverlay>" . PHP_EOL
			. "      <name>Titulo</name>" . PHP_EOL
			. "      <Icon>" . PHP_EOL
			. "        <href>".$url."/".basename($imgBrand)."</href>" . PHP_EOL
			. "      </Icon>" . PHP_EOL
			. "      <overlayXY x='0.01' y='0.99' xunits='fraction' yunits='fraction'/>" . PHP_EOL
			. "      <screenXY x='0.01' y='0.99' xunits='fraction' yunits='fraction'/>" . PHP_EOL
			. "      <size x='-1' y='-1' xunits='pixels' yunits='pixels'/>" . PHP_EOL
			. "    </ScreenOverlay>" . PHP_EOL;

			// Add legend
			if ($this->showLegend && $this->colourType == 'scale') {
				$kml .= "    <ScreenOverlay>" . PHP_EOL
				. "      <name>Legenda</name>" . PHP_EOL
				. "      <Icon>" . PHP_EOL
				. "        <href>".$url."/".basename($imgLegenda)."</href>" . PHP_EOL
				. "      </Icon>" . PHP_EOL
				. "      <overlayXY x='0.01' y='0.14' xunits='fraction' yunits='fraction'/>" . PHP_EOL
				. "      <screenXY x='0.01' y='0.14' xunits='fraction' yunits='fraction'/>" . PHP_EOL
				. "      <size x='-1' y='-1' xunits='pixels' yunits='pixels'/>" . PHP_EOL
				. "    </ScreenOverlay>" . PHP_EOL;
			}

			$kml .= $kmlStyles . $kmlFolder;
			$kml .= "  </Document>" . PHP_EOL
			. "</kml>" . PHP_EOL;

			// Add kml to archieve
			//$zip->addFromString("doc.kml", $kml);
			$zip->addFile($kml, 'doc.kml');//edmar
			$zip->output($file);//edmar
			//echo $this->nomeArquivo;exit;
			file_put_contents(str_replace(".kmz",".kml",$file),$kml);
		}

		if($download){
			ob_end_clean();
			//header('Content-Type: application/vnd.google-earth.kml+xml');
			header('Content-Disposition: attachment; filename='.basename($file));
			print $file;
			exit;
		}
		else{
			return $url.basename($file);
		}
	}




	//
	// Function
	// @access protected
	//
	// This function is based on code developed by "TJ":
	// http://bbs.keyhole.com/ubb/showflat.php?Cat=&Board=SupportKML&Number=166379&Searchpage=1&Main=166379&Words=calculate+TJ1&topic=&Search=true
	//
	function kmlSymbolCalculator( $longitude, $latitude, $distance, $points, $altitude )
	{
		$EARTH_RADIUS_EQUATOR = 6378140.0;
		$RADIAN = 180 / pi();

		$long = $longitude;
		$lat = $latitude;

		$long = $long / $RADIAN;
		$lat = $lat / $RADIAN;
		$f = 1/298.257;
		$e = 0.08181922;

		$kml = '          <Polygon>' . PHP_EOL
		. '            <outerBoundaryIs>' . PHP_EOL
		. '              <LinearRing>' . PHP_EOL
		. '                <coordinates>';

		//for ( $bearing = 0; $bearing <= 360; $bearing += 360/$points) {
		// Changed start bearing beacuse of square orientation
		for ( $bearing = 45; $bearing <= 405; $bearing += 360/$points) {

			$b = $bearing / $RADIAN;

			$R = $EARTH_RADIUS_EQUATOR * (1 - $e * $e) / pow( (1 - $e*$e * pow(sin($lat),2)), 1.5);
			$psi = $distance/$R;
			$phi = pi()/2 - $lat;
			$arccos = cos($psi) * cos($phi) + sin($psi) * sin($phi) * cos($b);
			$latA = (pi()/2 - acos($arccos)) * $RADIAN;

			$arcsin = sin($b) * sin($psi) / sin($phi);
			$longA = ($long - asin($arcsin)) * $RADIAN;

			$kml .= " ".round($longA,$this->coordDecimals).",".round($latA,$this->coordDecimals);
			if ($altitude) $kml .= ",".$altitude;
		}

		$kml .= '                </coordinates>' . PHP_EOL
		. '              </LinearRing>' . PHP_EOL
		. '            </outerBoundaryIs>' . PHP_EOL;

		if ($altitude)
		{
			$kml .= '            <extrude>1</extrude>' . PHP_EOL
			. '            <altitudeMode>absolute</altitudeMode>' . PHP_EOL;
		}

		$kml .= '          </Polygon>' . PHP_EOL;

		return $kml;
	}


	//
	// Function
	// @access protected
	//
	public function wkt2kml($wkt, $altitude)
	{

		// Change coordinate format
		$wkt = preg_replace("/([0-9\.\-]+) ([0-9\.\-]+),*/e", "round('$1',2).','.round('$2',2).',$altitude '", $wkt);

		$wkt = substr($wkt, 15); // Remove 'MULTIPOLYGON(((' at the beginning
		$wkt = substr($wkt, 0, -3); // Remove ')))' at the end
		$polygons = explode(')),((', $wkt); // Find all polygons
		$kml = '          <MultiGeometry>' . PHP_EOL;

		foreach ($polygons as $polygon) {
			$kml .= '            <Polygon>' . PHP_EOL;
			$boundary = explode('),(', $polygon); // Find all polygon boundaries
			$kml .= '              <outerBoundaryIs>' . PHP_EOL
			. '                <LinearRing>' . PHP_EOL
			. '                  <coordinates>' . self::kmlReverseCoordinates($boundary[0]) . ' </coordinates>' . PHP_EOL
			. '                </LinearRing>' . PHP_EOL
			. '              </outerBoundaryIs>' . PHP_EOL;

			for ($i=1; $i < count($boundary); $i++) { // If inner boundaries
				$kml .= '              <innerBoundaryIs>' . PHP_EOL
				. '                <LinearRing>' . PHP_EOL
				. '                  <coordinates>' . self::kmlReverseCoordinates($boundary[$i]) . ' </coordinates>' . PHP_EOL
				. '                </LinearRing>' . PHP_EOL
				. '              </innerBoundaryIs>' . PHP_EOL;
			}
			$kml .= '            </Polygon>' . PHP_EOL;
		}
		$kml .= '          </MultiGeometry>' . PHP_EOL;

		if ($altitude)
		{
			$kml = str_replace('<Polygon>', '<Polygon><extrude>1</extrude><tessellate>1</tessellate><altitudeMode>absolute</altitudeMode>', $kml);
		}

		return $kml;
	}

	//
	// Function
	// @access protected
	//
	function kmlReverseCoordinates($coordinates)
	{
		$coordinates = explode(" ", $coordinates);
		$coordinates = array_reverse($coordinates);
		$coordinates = implode(" ", $coordinates);
		return $coordinates;
	}

	// Generates KML colour
	function rgb2bgr($rgb)
	{
		$colour = dechex($this->kmlAlphaColour) . substr($rgb, -2) . substr($rgb, 2, 2) . substr($rgb, 0, 2);
		return $colour;
	}

	// Generates COLLADA colour
	function rgb2collada($rgb)
	{
		$red   = number_format(hexdec(substr($rgb, 0, 2)) / 255, 6);
		$green = number_format(hexdec(substr($rgb, 2, 2)) / 255, 6);
		$blue  = number_format(hexdec(substr($rgb, -2)) / 255, 6);

		$colour = "$red $green $blue 1"; // Transparency not supported in GE?
		return $colour;
	}


	// Generates a colour scale
	function makeColourScale(){

		// Extract red/green/blue decimal values from hexadecimal colours
		$this->startColourRGB = array(hexdec(substr($this->startColour, 0, 2)),
				hexdec(substr($this->startColour, 2, 2)),
				hexdec(substr($this->startColour, 4, 2)));

		$this->endColourRGB = array(hexdec(substr($this->endColour, 0, 2)),
				hexdec(substr($this->endColour, 2, 2)),
				hexdec(substr($this->endColour, 4, 2)));

		// Calculate the change value for red/green/blue
		$this->deltaColourRGB = array($this->endColourRGB[0] - $this->startColourRGB[0],
				$this->endColourRGB[1] - $this->startColourRGB[1],
				$this->endColourRGB[2] - $this->startColourRGB[2]);
	}

	function getColourValue($value, $format){
		$red   = $this->startColourRGB[0] + ($this->deltaColourRGB[0] / ($this->maxValue - $this->minValue)) * ($value - $this->minValue);
		$green = $this->startColourRGB[1] + ($this->deltaColourRGB[1] / ($this->maxValue - $this->minValue)) * ($value - $this->minValue);
		$blue  = $this->startColourRGB[2] + ($this->deltaColourRGB[2] / ($this->maxValue - $this->minValue)) * ($value - $this->minValue);

		if ($format == 'kml') {
			$colour = sprintf('%02X%02X%02X%02X', $this->kmlAlphaColour, $blue, $green, $red);
		}
		else { // Hex colour
			$colour = sprintf('%02X%02X%02X', $red, $green, $blue);
		}

		return $colour;
	}

	function getColourLegend(){
		$height = $this->colourLegendHeight;
		$width = $this->colourLegendWidth;

		// Create colour scale canvas
		$legend = imagecreatetruecolor(150, $height+6);

		// Allocate colours
		$bgColour = imagecolorallocatealpha($legend, 255, 255, 255, 127);
		$white = $fontColour = imagecolorallocate($legend, 255, 255, 255);
		imageSaveAlpha($legend, true);

		// Set background colour
		imagefill($legend, 0, 0, $bgColour);

		switch ($this->classification) {

			case 'unclassed':
				for ($i = 0; $i <= $height; $i++) {
					$red   = intval($this->endColourRGB[0] - (($this->deltaColourRGB[0] / $height) * $i));
					$green = intval($this->endColourRGB[1] - (($this->deltaColourRGB[1] / $height) * $i));
					$blue  = intval($this->endColourRGB[2] - (($this->deltaColourRGB[2] / $height) * $i));
					$myColourScale[] = imagecolorallocate($legend, $red, $green, $blue);
				}
				// Draw colour scale
				imagesetstyle($legend, $myColourScale);

				for ($i = 0; $i < $width; $i++) {
					imageline($legend, 21+$i, 2, 21+$i, $height+2, IMG_COLOR_STYLED);
				}

				// print min and max values
				//number_format(($s / $ocorrencias),2,",",".")
				//imagestring($legend, 3, $width+29, $height-6, number_format($this->minValue, $this->precision), $fontColour);
				//imagestring($legend, 3, $width+29, -3, number_format($this->maxValue, $this->precision), $fontColour);
				imagestring($legend, 3, $width+29, $height-6, number_format($this->minValue, 2,",","."), $fontColour);
				imagestring($legend, 3, $width+29, -3, number_format($this->maxValue, 2,",","."), $fontColour);

				break;

				// classed (equal intervals / quantiles)
			default:
				$ypos = 0;
				$interval = $height / $this->numClasses;
				$v = $this->classColours;
				foreach($v as $key => $colour){
					$red   = hexdec(substr($colour, 0, 2));
					$green = hexdec(substr($colour, 2, 2));
					$blue  = hexdec(substr($colour, 4, 2));

					$classColour = imagecolorallocate($legend, $red, $green, $blue);
					imagefilledrectangle($legend, 21, $height-$ypos+2, $width+20, $height-$ypos-$interval, $classColour);

					//imagestring($legend, 3, $width+29, $height-$ypos-5, number_format($this->classBreaks[$key], $this->precision), $fontColour);
					imagestring($legend, 3, $width+29, $height-$ypos-5, number_format($this->classBreaks[$key], 2,",","."), $fontColour);

					$ypos += $interval;
				}
				//imagestring($legend, 3, $width+29, -3, number_format($this->classBreaks[$key+1], $this->precision), $fontColour);
				imagestring($legend, 3, $width+29, -3, number_format($this->classBreaks[$key+1], 2,",","."), $fontColour);

		}

		// Border around colour scale
		imagerectangle($legend, 19, 0, $width+22, $height+4, $white);
		imagerectangle($legend, 20, 1, $width+21, $height+3, $white);

		// Legend title
		//imagestringup($legend, 3, 0, ($height/2)+(strlen($this->mapTitle)/2)*7, $this->mapTitle, $white);

		// Save legend
		$file = $this->dirtmp.'/legend'. $this->nomeTemp .'.png';
		imagepng($legend, $file);

		return $file;
	}


	function getSymbolSize($value, $geometry)
	{
		switch ($geometry) {
			case 'circle': // Returns radius of the circle
			case 'square': // Returns length of a side
				return sqrt($value/$this->maxValue)*$this->symbolMaxSize;
			case 'column': // Returns height of the column
				return ($value/$this->maxValue)*$this->symbolMaxSize;
			case 'sphere': // Returns radius of the sphere
			case 'cube': // Returns length of a side
				return pow($value/$this->maxValue, 1/3)*$this->symbolMaxSize;
		}
	}

	function makeClasses($classification, $numClasses){
		$this->classBreaks = array();

		switch ($classification) {

			case 'equal':
				$interval = ($this->maxValue - $this->minValue) / $numClasses;
				for ($i = 0; $i < $numClasses; $i++) {
					$position = $this->minValue + ($interval * $i);
					$this->classBreaks[] = round($position, $this->precision);
				}
				$this->classBreaks[] = $this->maxValue; // Last class break = biggest value
				break;

			case 'quantile':
				$values = array_values($this->indicator['values'][$this->year]);
				sort($values);
				$numValues = count($values);
				$classNum = $numValues / $numClasses; // Number in each class
				for ($i = 0; $i < $numClasses; $i++) {
					$position = (int)($classNum * $i);
					$this->classBreaks[] = $values[$position];
				}
				$this->classBreaks[] = $values[$numValues-1]; // Last class break = biggest value
		}

		// Make class colours (could be separate function)
		for ($i = 0; $i < $numClasses; $i++) {
			$red   = (int)($this->startColourRGB[0] + ($this->deltaColourRGB[0] / ($numClasses - 1)) * $i);
			$green = (int)($this->startColourRGB[1] + ($this->deltaColourRGB[1] / ($numClasses - 1)) * $i);
			$blue  = (int)($this->startColourRGB[2] + ($this->deltaColourRGB[2] / ($numClasses - 1)) * $i);

			$this->classColours[$i] = sprintf('%02X%02X%02X', $red, $green, $blue);
		}
	}


	function getClass($value){
		$class = 0;
		//var_dump($this->classBreaks);exit;
		for ($i = 1; $i < count($this->classBreaks); $i++) {
			if ($value > $this->classBreaks[$i] && $value <= $this->classBreaks[$i+1]) {
				$class = $i;
			}
		}
		return $class;
	}

	function mapTitleImage(){
		$title = explode('|', wordwrap($this->mapTitle, 25, "|", true));
		$source = explode('|', wordwrap($this->mapSource, 25, "|", true));

		// Calculate text height (15px for each text line)
		$textSize = (count($title) + count($source)) * 15;

		// Create new legend canvas
		$legend = imagecreatetruecolor(200, 56 + $textSize);

		// Allocate colours
		$bgColour = imagecolorallocatealpha($legend, 255, 255, 255, 10);
		$black = $fontColour = imagecolorallocate($legend, 0, 0, 0);
		imageSaveAlpha($legend, true);

		// Set background colour
		imagefill($legend, 0, 0, $bgColour);

		// Add logo
		$legendTop = imagecreatefrompng($this->logo);
		imagecopy($legend, $legendTop, 0, 0, 0, 0, 200, 30);

		// Print title
		$ypos = 37;
		foreach($title as $line){

			imagestring($legend, 3, 100-(strlen($line)*7)/2, $ypos, $line, $fontColour);
			$ypos += 15;
		}

		// Print source
		foreach($source as $line){
			$ypos += 15;
			imagestring($legend, 2, 192-(strlen($line)*6), $ypos, $line, $fontColour);
		}

		// Save legend
		$file = $this->dirtmp.'/logo'. $this->nomeTemp .'.png';
		imagepng($legend, $file);

		return $file;
	}
	function RGB2hex($rgb)
	{
		$r = str_pad(dechex($rgb[0]), 2, '0', STR_PAD_LEFT);
		$g = str_pad(dechex($rgb[1]), 2, '0', STR_PAD_LEFT);
		$b = str_pad(dechex($rgb[2]), 2, '0', STR_PAD_LEFT);
		return("ff" . $b . $g . $r);
	}
} // class ThematicMap


?>