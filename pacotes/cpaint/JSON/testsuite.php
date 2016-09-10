<?php
exit;
/**
* The content of this file is (c) 2003-2005 digital media center GmbH
* All rights reserved
*
* JSON parser / generator test
*
* @package		JSON
* @access		public
* @copyright	(c) 2003-2005 digital media center GmbH, all rights reserved
* @author		Dominique Stender <dst@dmc.de>
*/

//---- includes ----------------------------------------------------------------
	/**
	* @include JSON
	*/
	require_once(dirname(__FILE__).'/../json.php');

//---- class -------------------------------------------------------------------
	class MyObj {
		var $id			= '';
		var $name		= '';
		var $attribs	= array("first",'4');

		function setId($id) {
			$this->id = $id;
		}

		function getId() {
			return $this->id;
		}

		function setName($name) {
			$this->name = $name;
		}

		function getName() {
			return $this->name;
		}
	}

//---- variables ---------------------------------------------------------------
	$JSON			= new JSON();
	$myObj			= new MyObj();

//---- logic -------------------------------------------------------------------
	/* initialize object */
	$myObj->setId('�l' . chr(18) . "ie\nn");
	$myObj->setName('objectName');
	array_push($myObj->attribs, '�first');
	array_push($myObj->attribs, 'second');
	array_push($myObj->attribs, 3);

	/* create JSON representation */
	$jsonStr	= $JSON->stringify($myObj);

//---- clean-up ----------------------------------------------------------------
//---- content -----------------------------------------------------------------

?><html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
<head>
	<title>JSON parser test</title>
	<meta http-equiv="content-type" content="text/html; charset=iso-8859-1" />
	<script type="text/javascript" src="json.js"></script>
	<script type="text/javascript">
JSON.arrayObj = new Array();
JSON.parse2 = function (text)
{
				var p = /^\s*(([,:{}\[\]])|"(\\.|[^\x00-\x1f"\\])*"|-?\d+(\.\d*)?([eE][+-]?\d+)?|true|false|null|\/\*Array\*\/)\s*/,
						token,
						operator;

				function error(m, t) {
						throw {
								name: 'JSONError',
								message: m,
								text: t || operator || token
						};
				}

				function next() {
						if (text) {
								var t = p.exec(text);
								if (t) {

										if (t[2]) {
												token = null;
												operator = t[2];
										} else {
												operator = null;
												if(t[1].search (/^\/\*Array\*\/$/g) > -1)
												{
													token = function(){};
												}
												else
												{
													try {
															token = eval(t[1]);
													} catch (e) {
															error("Bad token", t[1]);
													 }
												}
										}
										text = text.substring(t[0].length);
								} else {
										error("Unrecognized token", text);
								}
						} else {
								token = operator = undefined;
						}
			 }


				function arr() {
						var a = [];

						next();
						if (operator == ']') {
								next();
								return a;
						}
						for (;;) {
								a.push(val());
								switch (operator) {
								case ']':
										next();
										return a;
								case ',':
										next();
										break;
								default:
										error("Missing ']'");
								}
						}
				}

				function obj() {
						var k, o = {};

						next();
						if (operator == '}') {
								next();
								return o;
						}
						if (typeof(token) == 'function')
						{
							o = [];
							next();
						}
						for (;;)
						{


								if (operator ||typeof token != 'string') {
										error("Missing key");
								}
								k = token;
								next();

								if (operator != ':') {
										error("Missing ':'");
								}

								next();
								o[k] = val();

								switch (operator) {
								case '}':
										next();
										return o;
								case ',':
										next();
										break;
								case '#':
										next();
										break;
								default:
										error("Missing '}'");
								}
						}
				}

				function val() {
						switch (operator) {
						case '{':
								return obj();
						case '[':
								return arr();
						default:
								if (operator !== null) {
										error("Missing value");
								}
								var t = token;
								next();
								return t;
						}
				}
				next();
				return val();
};

JSON.stringify2 = function(arg)
{
	var jsonstring = [];
	var b = this;
	function add(str)
	{
			 jsonstring[jsonstring.length] = str;
	 }
	 function validObj(obj)
	 {
		 if (typeof(obj) != 'undefined' && typeof(obj) != 'function')
		 {
			 return true;
		 }
		 return false;
	 }
	function recurse(obj, prefix)
	{
		switch (typeof(obj))
		{
			case 'object':
				if (obj)
				{
					var first = true;
					if (obj.constructor == b.arrayObj.constructor)
					{
						add('{/*Array*/');
						//add ('{');
					}
					else
					{
						add ('{');
					}
					for (prop in obj)
					{
						if (validObj(obj[prop]))
						{
							if (!first)
							{
								add(',');
							}
							recurse(prop);
							add(':');
							recurse (obj[prop]);
							first =false;
						}
					}
					return add ('}');
				}
				return add('null');
				break;
			case 'number':
				return add(isFinite(obj) ? String(obj) : 'null');
				break;
			case 'string':
				l = obj.length;
								add('"');
								for (i = 0; i < l; i += 1) {
										c = obj.charAt(i);
										if (c >= ' ') {
												if (c == '\\' || c == '"') {
														add('\\');
												}
												add(c);
										} else {
												switch (c) {
														case '\b':
																add('\\b');
																break;
														case '\f':
																add('\\f');
																break;
														case '\n':
																add('\\n');
																break;
														case '\r':
																add('\\r');
																break;
														case '\t':
																add('\\t');
																break;
														default:
																c = c.charCodeAt();
																add('\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16));
												}
										}
								}
								return add('"');
				break;
			case 'boolean':
				return add(String(obj));
				break;
			default:
				return add('null');
				break;
		}
	}
	recurse(arg);
	return jsonstring.join('');
};
	</script>
</head>
<body>
	<?php echo 'php JSONstr: ' . $jsonStr . "<br />\n"; ?>
	<script type="text/javascript">
		<!--
		/* print JSON representation */
		var jsonStr	= '<?php echo addslashes($jsonStr); ?>';

		document.write('JavaScript JSONstr: ' + jsonStr);

		/* create another object from jsonStr */
		try
		{
		var myObj2	= JSON.parse(jsonStr);

			var myObj3 = JSON.parse2(jsonStr);


		/* test the clone */
		document.write('<br /><br />Original JSON implementation');
		document.write('<br />id: ' + myObj2.id);
		document.write('<br />name: ' + myObj2.name);

		for (var i = 0; i < myObj2.attribs.length; i++) {
			document.write('<br />attrib[' + i + ']: ' + myObj2.attribs[i]);
		}
		document.write('<br /><br />new JSON implementation');
		document.write('<br />id: ' + myObj3.id);
		document.write('<br />name: ' + myObj3.name);

		for (var i = 0; i < myObj3.attribs.length; i++) {
			document.write('<br />attrib[' + i + ']: ' + myObj3.attribs[i]);
		}

		/* convert newline to JSON */
		var nl = "\n" + String.fromCharCode(18);
		document.write('<br /><br /> Original JSON <br />newline as JSON: ' + JSON.stringify(nl));
		document.write('<br /><br /> New JSON <br />newline as JSON: ' + JSON.stringify2(nl));

		//-->
}
		catch(e)
		{
			alert(e.message);
		}
	</script>
</body>
</html>