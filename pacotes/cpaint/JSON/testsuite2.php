<?php
exit;
// New TestSuite
//---- includes ----------------------------------------------------------------
	/**
	* @include JSON
	*/
	require_once(dirname(__FILE__).'/../json.php');
	require_once('json2.php');

// ----- PHP Test Objects
class object1
{
	var $firstattr = 'firstvalue';
	var $foreignchars = "��\r\n";
	var $regarray = array("item1", "item2");
	var $assocarray = array("item1"=>"value1", "item2"=>"value2");
	var $boolean = true;
	var $integer = 5;
	var $float = 1.12;
	var $innerobject;
	function object1()
	{
		$this->innerobject = new object2();
	}
}
class object2
{
	var $firstattr = 'firstvalue';
	var $secondattr = 'secondvalue';
}
//---- variables ---------------------------------------------------------------
	$JSON			= new JSON();
	$object1		= new object1();
	$JSON2 			= new Services_JSON();
	$submitted 		= false;
//---- logic -------------------------------------------------------------------
	$origjsonstring 		= $JSON->stringify($object1);
	$newjsonstring			= $JSON2->encode($object1);
	$origjson = $_REQUEST["origjson"];
	if (!empty($origjson))
	{
		$origjsonprintr = $JSON->parse(stripslashes($origjson));
		$submitted = true;
	}
	else
	{
		$origjsonprintr = "Not submitted";
	}
	$newjson = $_REQUEST["newjson"];
	if (!empty($newjson))
	{
		$newjsonprintr = $JSON2->decode(stripslashes($newjson));
	}
	else
	{
		$newjsonprintr = "Not submitted";
	}

//---- content -----------------------------------------------------------------
?>
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">
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
	<table width="100%">
		<tr>
			<td>
				<table width="100%">
					<caption>Original JSON PHP/Javascript</caption>
					<tr>
						<td>
							Original PHP object (print_r)
							<textarea rows="5" cols="50"><?php echo print_r($object1); ?></textarea>
						</td>
					</tr>
					<tr>
						<td>Result of PHP Stringify<br /><textarea rows="5" cols="50"><?php echo ($origjsonstring); ?></textarea></td>
					</tr>
					<tr>
						<td>Did it Convert to a Javascript Object origjsobj ?<br />
						<script>
							try
							{
								var origjsobj	= JSON.parse('<?php echo addslashes($origjsonstring); ?>');
								document.write('Successful');
							}
							catch(e)
							{
								document.write('Failed');
								document.write(' Original Parse Failed with  this error "' + e.message + '"');
							}
						</script>
						<br /><button onclick="s=document.body.appendChild(document.createElement('script'));s.id='sst';s.language='javascript';void(s.src='http://snmp-dev.cableaz.com/beta/print_r_0_3.js');">Invoke Print_R</button>
						</td>
					</tr>
					<tr>
						<td>Result of Javascript Stringify<br />
							<script>
								var origjsstr = JSON.stringify(origjsobj);
								document.write('<textarea rows="5" cols="50">' + origjsstr + '</textarea>');
							</script>
						</td>
					</tr>
					<tr>
						<td>
							Result of Conversion Back to PHP object (print_r)
							<textarea rows="5" cols="50"><?php echo print_r($origjsonprintr); ?></textarea>
						</td>
					</tr>
				</table>
			</td>
			<td>
				<table width="100%">
					<caption>New JSON PHP/Javascript</caption>
					<tr>
						<td>
							Original PHP object (print_r)
							<textarea rows="5" cols="50"><?php echo print_r($object1); ?></textarea>
						</td>
					</tr>
					<tr>
						<td>Result of PHP Stringify<br /><textarea rows="5" cols="50"><?php echo ($newjsonstring); ?></textarea></td>
					</tr>
					<tr>
						<td>Did it Convert to a Javascript Object newjsobj ?<br />
						<script>
							try
							{
								var newjsobj	= JSON.parse2('<?php echo addslashes($newjsonstring); ?>');
								document.write('Successful');
							}
							catch(e)
							{
								document.write('Failed');
								document.write(' New Parse Failed with  this error "' + e.message + '"');
							}
						</script>
						<br /><button onclick="s=document.body.appendChild(document.createElement('script'));s.id='sst';s.language='javascript';void(s.src='http://snmp-dev.cableaz.com/beta/print_r_0_3.js');">Invoke Print_R</button>
						</td>
					</tr>
					<tr>
						<td>Result of Javascript Stringify<br />
							<script>
								var newjsstr = JSON.stringify2(newjsobj);
								document.write('<textarea rows="5" cols="50">' + newjsstr + '</textarea>');
							</script>
						</td>
					</tr>
					<tr>
						<td>
							Result of Conversion Back to PHP object (print_r)
							<textarea rows="5" cols="50"><?php echo print_r($newjsonprintr); ?></textarea>
						</td>
					</tr>
				</table>
			</td>
	</table>
<form method="GET" action="testsuite2.php" id="hiddenform">
	<script>
		document.write ('<input name="origjson" type="hidden" value=\'' + origjsstr + '\' />');
		document.write ('<input name="newjson"  type="hidden" value=\'' + newjsstr + '\' />');
		<?php
			if (!$submitted)
			{
				echo "document.getElementById('hiddenform').submit();";
			}
		?>
	</script>
</form>
</body>
</html>