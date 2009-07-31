$i = function(id){return document.getElementById(id);};
/**
* CPAINT - Cross-Platform Asynchronous INterface Toolkit
*
* http://sf.net/projects/cpaint
* 
* released under the terms of the LGPL
* see http://www.fsf.org/licensing/licenses/lgpl.txt for details
*
* @package      CPAINT
* @access       public
* @copyright    Copyright (c) 2005-2006 Paul Sullivan, Dominique Stender - http://sf.net/projects/cpaint
* @author       Paul Sullivan <wiley14@gmail.com>
* @author       Dominique Stender <dstender@st-webdevelopment.de>
* @author		Stephan Tijink <stijink@googlemail.com>
* @version      2.0.3
*/
function cpaint() {
  /**
  * CPAINT version
  * 
  * @access     protected
  * @var        string      version
  */
  this.version = '2.0.3';
  
  /**
  * configuration options both for this class but also for  the cpaint_call() objects.
  *
  * @access     protected
  * @var        array       config
  */
  var config                      = new Array();
  config['debugging']             = -1;
  config['proxy_url']             = '';
  config['transfer_mode']         = 'GET';
  config['async']                 = true;
  config['response_type']         = 'OBJECT';
  config['persistent_connection'] = false;
  config['use_cpaint_api']        = true;
  
  /**
  * maintains the next free index in the stack
  *
  * @access   protected
  * @var      integer   stack_count
  */
  var stack_count = 0;

  /**
  * property returns whether or not the browser is AJAX capable
  * 
  * @access		public
  * @return		boolean
  */
  this.capable = test_ajax_capability();
  
  /**
  * switches debug mode on/off.
  *
  * @access   public
  * @param    boolean    debug    debug flag
  * @return   void
  */
  this.set_debug = function() {
    
    if (typeof arguments[0] == 'boolean') {
      if (arguments[0] === true) {
        config['debugging'] = 1;

      } else {
        config['debugging'] = 0;
      }
      
    } else if (typeof arguments[0] == 'number') {
      config['debugging'] = Math.round(arguments[0]);
    }
  }

  /**
  * defines the URL of the proxy script.
  *
  * @access   public
  * @param    string    proxy_url    URL of the proxyscript to connect
  * @return   void
  */
  this.set_proxy_url = function() {
    
    if (typeof arguments[0] == 'string') {

      config['proxy_url'] = arguments[0];
    }
  }

  /**
  * sets the transfer_mode (GET|POST).
  *
  * @access   public
  * @param    string    transfer_mode    transfer_mode
  * @return   void
  */
  this.set_transfer_mode = function() {
    
    if (arguments[0].toUpperCase() == 'GET'
      || arguments[0].toUpperCase() == 'POST') {

      config['transfer_mode'] = arguments[0].toUpperCase();
    }
  }

  /**
  * sets the flag whether or not to use asynchronous calls.
  *
  * @access   public
  * @param    boolean    async    syncronization flag
  * @return   void
  */
  this.set_async = function() {
    
    if (typeof arguments[0] == 'boolean') {
      config['async'] = arguments[0];
    }
  }

  /**
  * defines the response type.
  *
  * allowed values are:
  *   TEXT    = raw text response
  *   XML     = raw XMLHttpObject
  *   OBJECT  = parsed JavaScript object structure from XMLHttpObject
  *
  * the default is OBJECT.
  *
  * @access   public
  * @param    string    response_type    response type
  * @return   void
  */
  this.set_response_type = function() {
    
    if (arguments[0].toUpperCase() == 'TEXT'
      || arguments[0].toUpperCase() == 'XML'
      || arguments[0].toUpperCase() == 'OBJECT'
      || arguments[0].toUpperCase() == 'E4X'
      || arguments[0].toUpperCase() == 'JSON') {

      config['response_type'] = arguments[0].toUpperCase();
    }
  }

  /**
  * sets the flag whether or not to use a persistent connection.
  *
  * @access   public
  * @param    boolean    persistent_connection    persistance flag
  * @return   void
  */
  this.set_persistent_connection = function() {
    
    if (typeof arguments[0] == 'boolean') {
      config['persistent_connection'] = arguments[0];
    }
  }
  
  
  /**
  * sets the flag whether or not to use the cpaint api on the backend.
  *
  * @access    public
  * @param     boolean    cpaint_api      api_flag
  * @return    void
  */
  this.set_use_cpaint_api = function() {
    if (typeof arguments[0] == 'boolean') {
      config['use_cpaint_api'] = arguments[0];
    }
  }
  
  /**
  * tests whether one of the necessary implementations
  * of the XMLHttpRequest class are available
  *
  * @access     protected
  * @return     boolean
  */
  function test_ajax_capability() {
    var cpc = new cpaint_call(0, config, this.version);
    return cpc.test_ajax_capability();
  }

  /**
  * takes the arguments supplied and triggers a call to the CPAINT backend
  * based on the settings.
  *
  * upon response cpaint_call.callback() will automatically be called
  * to perform post-processing operations.
  *
  * @access   public
  * @param    string    url                 remote URL to call
  * @param    string    remote_method       remote method to call
  * @param    object    client_callback     client side callback method to deliver the remote response to. do NOT supply a string!
  * @param    mixed     argN                remote parameters from now on
  * @return   void
  */
  this.call = function() {
    //incluido por edmar
	var sUrl = escape(arguments[0]);
	var re = new RegExp("%3F", "g");
	var sUrl = sUrl.replace(re,'?');
	var re = new RegExp("%3D", "g");
	var sUrl = sUrl.replace(re,'=');
	var re = new RegExp("%26", "g");
	var sUrl = sUrl.replace(re,'&');
	var re = new RegExp("%3A", "g");
	var sUrl = sUrl.replace(re,':');
    //alert(sUrl)
    arguments[0] = sUrl;
    //
    var use_stack = -1;
    
    if (config['persistent_connection'] == true
      && __cpaint_stack[0] != null) {

      switch (__cpaint_stack[0].get_http_state()) {
        case -1:
          // no XMLHttpObject object has already been instanciated
          // create new object and configure it
          use_stack = 0;
          debug('no XMLHttpObject object to re-use for persistence, creating new one later', 2);
          break;
          
        case 4:
          // object is ready for a new request, no need to do anything
          use_stack = 0
          debug('re-using the persistent connection', 2);
          break;
          
        default:
          // connection is currently in use, don't do anything
          debug('the persistent connection is in use - skipping this request', 2);
      }
      
    } else if (config['persistent_connection'] == true) {
      // persistent connection is active, but no object has been instanciated
      use_stack = 0;
      __cpaint_stack[use_stack] = new cpaint_call(use_stack, config, this.version);
      debug('no cpaint_call object available for re-use, created new one', 2);
    
    } else {
      // no connection persistance
      use_stack = stack_count;
      __cpaint_stack[use_stack] = new cpaint_call(use_stack, config, this.version);
      debug('no cpaint_call object created new one', 2);
    }

    // configure cpaint_call if allowed to
    if (use_stack != -1) {
      __cpaint_stack[use_stack].set_client_callback(arguments[2]);
      
      // distribute according to proxy use
      if (config['proxy_url'] != '') {
        __cpaint_stack[use_stack].call_proxy(arguments);
      
      } else {
        __cpaint_stack[use_stack].call_direct(arguments);
      }

      // increase stack counter
      stack_count++;
      debug('stack size: ' + __cpaint_stack.length, 2);
    }
  }

  /**
  * debug method
  *
  * @access  protected
  * @param   string       message         the message to debug
  * @param   integer      debug_level     debug level at which the message appears
  * @return  void
  */
  var debug  = function(message, debug_level) {
    var prefix = '[CPAINT Debug] ';
    
    if (debug_level < 1) {
      prefix = '[CPAINT Error] ';
    }
    
    if (config['debugging'] >= debug_level) {
      alert(prefix + message);
    }
  }
}

/**
* internal FIFO stack of cpaint_call() objects.
*
* @access   protected
* @var      array    __cpaint_stack
*/
var __cpaint_stack = new Array();

/**
* local instance of cpaint_transformer
* MSIE is unable to handle static classes... sheesh.
*
* @access   public
* @var      object    __cpaint_transformer
*/
var __cpaint_transformer = new cpaint_transformer();

/**
* transport agent class
*
* creates the request object, takes care of the response, handles the 
* client callback. Is configured by the cpaint() object.
*
* @package      CPAINT
* @access       public
* @copyright    Copyright (c) 2005-2006 Paul Sullivan, Dominique Stender - http://sf.net/projects/cpaint
* @author       Dominique Stender <dstender@st-webdevelopment.de>
* @author       Paul Sullivan <wiley14@gmail.com>
* @param        integer     stack_id      stack Id in cpaint
* @param        array       config        configuration array for this call
* @param        string      version       CPAINT API version
*/
function cpaint_call() {
  /**
  * CPAINT version
  * 
  * @access     protected
  * @var        string      version
  */
  var version = arguments[2];
  
  /**
  * configuration options both for this class objects.
  *
  * @access     protected
  * @var        array       config
  */
  var config                      = new Array();
  config['debugging']             = arguments[1]['debugging'];
  config['proxy_url']             = arguments[1]['proxy_url'];
  config['transfer_mode']         = arguments[1]['transfer_mode'];
  config['async']                 = arguments[1]['async'];
  config['response_type']         = arguments[1]['response_type'];
  config['persistent_connection'] = arguments[1]['persistent_connection'];
  config['use_cpaint_api']        = arguments[1]['use_cpaint_api'];

  /**
  * XMLHttpObject used for this request.
  *
  * @access   protected
  * @var      object     httpobj
  */
  var httpobj    = false;

  /**
  * client callback function.
  *
  * @access   public
  * @var      function    client_callback
  */
  var client_callback;

  /**
  * stores the stack Id within the cpaint object
  *
  * @access   protected
  * @var      stack_id
  */
  var stack_id = arguments[0];
  
  /**
  * sets the client callback function.
  *
  * @access   public
  * @param    function    client_callback     the client callback function
  * @return   void
  */
  this.set_client_callback = function() {
    
    if (typeof arguments[0] == 'function') {
      client_callback = arguments[0];
    }
  }

  /**
  * returns the ready state of the internal XMLHttpObject
  *
  * if no such object was set up already, -1 is returned
  * 
  * @access     public
  * @return     integer
  */
  this.get_http_state = function() {
    var return_value = -1;
    
    if (typeof httpobj == 'object') {
      return_value = httpobj.readyState;
    }
    
    return return_value;
  }
  
  /**
  * internal method for remote calls to the local server without use of the proxy script.
  *
  * @access   public
  * @param    array    call_arguments    array of arguments initially passed to cpaint.call()
  * @return   void
  */
  this.call_direct = function(call_arguments) {
    var url             = call_arguments[0];
    var remote_method   = call_arguments[1];
    var querystring     = '';
    var i               = 0;
    
    // correct link to self
    if (url == 'SELF') {
      url = document.location.href;
    }
  
    if (config['use_cpaint_api'] == true) {
      // backend uses cpaint api
      // pass parameters to remote method
      for (i = 3; i < call_arguments.length; i++) {

        if ((typeof call_arguments[i] == 'string'
              && call_arguments[i] != ''
              && call_arguments[i].search(/^\s+$/g) == -1)
          && !isNaN(call_arguments[i])
          && isFinite(call_arguments[i])) {
          // numerical value, convert it first
          querystring += '&cpaint_argument[]=' + encodeURIComponent(JSON.stringify(Number(call_arguments[i])));
        
        } else {
          querystring += '&cpaint_argument[]=' + encodeURIComponent(JSON.stringify(call_arguments[i]));
        }
      }
    
      // add response type to querystring
      querystring += '&cpaint_response_type=' + config['response_type'];
    
      // build header
      if (config['transfer_mode'] == 'GET') {
				
        if(url.indexOf('?') != -1) {
					url = url + '&cpaint_function=' + remote_method +	querystring;
				
        } else {
					url = url + '?cpaint_function=' + remote_method +	querystring; 
				}
      
      } else {
        querystring = 'cpaint_function=' + remote_method + querystring;
      }
      
    } else {
      // backend does not use cpaint api
      // pass parameters to remote method
      for (i = 3; i < call_arguments.length; i++) {
        
        if (i == 3) {
          querystring += encodeURIComponent(call_arguments[i]);
        
        } else {
          querystring += '&' + encodeURIComponent(call_arguments[i]);
        }
      }
    
      // build header
      if (config['transfer_mode'] == 'GET') {
        url = url + querystring;
      } 
    }
  
    // open connection 
    get_connection_object();

    // open connection to remote target
    debug('opening connection to "' + url + '"', 1);
    httpobj.open(config['transfer_mode'], url, config['async']);

    // send "urlencoded" header if necessary (if POST)
    if (config['transfer_mode'] == 'POST') {

      try {
        httpobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      } catch (cp_err) {
        debug('POST cannot be completed due to incompatible browser.  Use GET as your request method.', 0);
      }
    }

    // make ourselves known
    httpobj.setRequestHeader('X-Powered-By', 'CPAINT v' + version + ' :: http://sf.net/projects/cpaint');

    // callback handling for asynchronous calls
    httpobj.onreadystatechange = callback;

    // send content
    if (config['transfer_mode'] == 'GET') {
      httpobj.send(null);

    } else {
      debug('sending query: ' + querystring, 1);
      httpobj.send(querystring);
    }

    if (config['async'] == true) {
      // manual callback handling for synchronized calls
      callback();
    }
  }
    
  /**
  * internal method for calls to remote servers through the proxy script.
  *
  * @access   public
  * @param    array    call_arguments    array of arguments passed to cpaint.call()
  * @return   void
  */
  this.call_proxy = function(call_arguments) {
    var proxyscript     = config['proxy_url'];
    var url             = call_arguments[0];
    var remote_method   = call_arguments[1];
    var querystring     = '';
    var i               = 0;
    
    var querystring_argument_prefix = 'cpaint_argument[]=';

    // pass parameters to remote method
    if (config['use_cpaint_api'] == false) {
      // when not talking to a CPAINT backend, don't prefix arguments
      querystring_argument_prefix = '';
    }

    for (i = 3; i < call_arguments.length; i++) {

      if (config['use_cpaint_api'] == true) {
      
        if ((typeof call_arguments[i] == 'string'
              && call_arguments[i] != ''
              && call_arguments[i].search(/^\s+$/g) == -1)
          && !isNaN(call_arguments[i])
          && isFinite(call_arguments[i])) {
          // numerical value, convert it first
          querystring += encodeURIComponent(querystring_argument_prefix + JSON.stringify(Number(call_arguments[i])) + '&');

        } else {
          querystring += encodeURIComponent(querystring_argument_prefix + JSON.stringify(call_arguments[i]) + '&');
        }
        
      } else {
        // no CPAINT in the backend
        querystring += encodeURIComponent(querystring_argument_prefix + call_arguments[i] + '&');
      }
    }

    if (config['use_cpaint_api'] == true) {
      // add remote function name to querystring
      querystring += encodeURIComponent('&cpaint_function=' + remote_method);
  
      // add response type to querystring
      querystring += encodeURIComponent('&cpaint_responsetype=' + config['response_type']);
    }
    
    // build header
    if (config['transfer_mode'] == 'GET') {
      proxyscript += '?cpaint_remote_url=' + encodeURIComponent(url) 
        + '&cpaint_remote_query=' + querystring
        + '&cpaint_remote_method=' + config['transfer_mode'] 
        + '&cpaint_response_type=' + config['response_type'];

    } else {
      querystring = 'cpaint_remote_url=' + encodeURIComponent(url)
        + '&cpaint_remote_query=' + querystring
        + '&cpaint_remote_method=' + config['transfer_mode'] 
        + '&cpaint_response_type=' + config['response_type'];
    }

    // open connection
    get_connection_object();

    // open connection to remote target
    debug('opening connection to proxy "' + proxyscript + '"', 1);
    httpobj.open(config['transfer_mode'], proxyscript, config['async']);

    // send "urlencoded" header if necessary (if POST)
    if (config['transfer_mode'] == 'POST') {

      try {
        httpobj.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

      } catch (cp_err) {
        debug('POST cannot be completed due to incompatible browser.  Use GET as your request method.', 0);
      }
    }

    httpobj.setRequestHeader('X-Powered-By', 'CPAINT v' + version);

    // callback handling for asynchronous calls
    httpobj.onreadystatechange = callback;

    // send content
    if (config['transfer_mode'] == 'GET') {
      httpobj.send(null);

    } else {
      debug('sending query: ' + querystring, 1);
      httpobj.send(querystring);
    }

    if (config['async'] == false) {
      // manual callback handling for synchronized calls
      callback();
    }
  }

  this.test_ajax_capability = function() {
    return get_connection_object();
  }
  
  /**
  * creates a new connection object.
  *
  * @access   protected
  * @return   boolean
  */
  var get_connection_object = function() {
    var return_value    = false;
    var new_connection  = false;

    // open new connection only if necessary
    if (config['persistent_connection'] == false) {
      // no persistance, create a new object every time
      debug('Using new connection object', 1);
      new_connection = true;

    } else {
      // persistent connection object, only open one if no object exists
      debug('Using shared connection object.', 1);

      if (typeof httpobj != 'object') {
        debug('Getting new persistent connection object.', 1);
        new_connection = true;
      }
    }

    if (new_connection == true) {
		
	 try {
        httpobj = new XMLHttpRequest();
      } catch (e1) {

		  try {
			httpobj = new ActiveXObject('Msxml2.XMLHTTP');
	  
		  } catch (e) {
			
			try {  
			  httpobj = new ActiveXObject('Microsoft.XMLHTTP');
 
			} catch (oc) {
			  httpobj = null;
			} 
		 }
	  }
     
  
      if (!httpobj) {
        debug('Could not create connection object', 0);
      
      } else {
        return_value = true;
      }
    }

    if (httpobj.readyState != 4) {
      httpobj.abort();
    }

    return return_value;
  }

  /**
  * internal callback function.
  *
  * will perform some consistency checks (response code, NULL value testing)
  * and if response_type = 'OBJECT' it will automatically call
  * cpaint_call.parse_ajax_xml() to have a JavaScript object structure generated.
  *
  * after all that is done the client side callback function will be called 
  * with the generated response as single value.
  *
  * @access   protected
  * @return   void
  */
  var callback = function() {
    var response = null;
    if (httpobj.readyState == 4
      && httpobj.status == 200) {
      if(httpobj.responseText == ""){
      	alert("O servidor demorou muito - timeout");
		client_callback("", "erro");
		return;
      }
      debug(httpobj.responseText, 1);
      debug('using response type ' + config['response_type'], 2);
      
      // fetch correct response
      switch (config['response_type']) {
        case 'XML':
          debug(httpobj.responseXML, 2);
          response = __cpaint_transformer.xml_conversion(httpobj.responseXML);
          break;
          
        case 'OBJECT':
          response = __cpaint_transformer.object_conversion(httpobj.responseXML);
          break;
        
        case 'TEXT':
          response = __cpaint_transformer.text_conversion(httpobj.responseText);
          break;
          
        case 'E4X':
          response = __cpaint_transformer.e4x_conversion(httpobj.responseText);
          break;
          
        case 'JSON':
          response = __cpaint_transformer.json_conversion(httpobj.responseText);
          break;
          
        default:
          debug('invalid response type \'' + response_type + '\'', 0);
      }
      
      // call client side callback
      if (response != null 
        && typeof client_callback == 'function') {
        try{
        	if(response.data)
        		client_callback(response, httpobj.responseText);
        	else
        		client_callback("", "erro");
        }
        catch(e){
        	client_callback("", "erro");
        }
      }
      // remove ourselves from the stack
      remove_from_stack();
    
    } else
    {       
		if(httpobj.readyState==4&&httpobj.status!=200)
		{
			debug('invalid HTTP response code \''+Number(httpobj.status)+'\'',0);
			if(httpobj.status==500){
				alert("O servidor demorou muito - timeout");
				client_callback("", "erro");	
			}
			else{
				client_callback("", "erro");
			}
		}      
      
    }
  }

  /**
  * removes an entry from the stack
  *
  * @access     protected
  * @return     void
  */
  var remove_from_stack = function() {
    // remove only if everything is okay and we're not configured as persistent connection
    if (typeof stack_id == 'number'
      && __cpaint_stack[stack_id]
      && config['persistent_connection'] == false) {
      
      __cpaint_stack[stack_id] = null;
    }
  }

  /**
  * debug method
  *
  * @access  protected
  * @param   string       message         the message to debug
  * @param   integer      debug_level     debug level at which the message appears
  * @return  void
  */
  var debug  = function(message, debug_level) {
    var prefix = '[CPAINT Debug] ';
    
    if (config['debugging'] < 1) {
      prefix = '[CPAINT Error] ';
    }
    
    if (config['debugging'] >= debug_level) {
      alert(prefix + message);
    }
    if (message.search(" error") > 1){client_callback("", message);}
  }
}

/**
* CPAINT transformation object
*
* @package      CPAINT
* @access       public
* @copyright    Copyright (c) 2005-2006 Paul Sullivan, Dominique Stender - http://sf.net/projects/cpaint
* @author       Paul Sullivan <wiley14@gmail.com>
* @author       Dominique Stender <dstender@st-webdevelopment.de>
*/
function cpaint_transformer() {

  /**
  * will take a XMLHttpObject and generate a JavaScript
  * object structure from it.
  *
  * is internally called by cpaint_call.callback() if necessary.
  * will call cpaint_call.create_object_structure() to create nested object structures.
  *
  * @access   public
  * @param    object    xml_document  a XMLHttpObject
  * @return   object
  */
  this.object_conversion = function(xml_document) {
    var return_value  = new cpaint_result_object();
    var i             = 0;
    var firstNodeName = '';
    
    if (typeof xml_document == 'object'
      && xml_document != null) {

      // find the first element node - for MSIE the <?xml?> node is the very first...
      for (i = 0; i < xml_document.childNodes.length; i++) {

        if (xml_document.childNodes[i].nodeType == 1) {
          firstNodeName = xml_document.childNodes[i].nodeName;
          break;
        }
      }
      
      var ajax_response = xml_document.getElementsByTagName(firstNodeName);

      return_value[firstNodeName] = new Array();
    
      for (i = 0; i < ajax_response.length; i++) {
        var tmp_node = create_object_structure(ajax_response[i]);
        tmp_node.id  = ajax_response[i].getAttribute('id')
        return_value[firstNodeName].push(tmp_node);
      }

    } else {
      debug('received invalid XML response', 0);
    }

    return return_value;
  }

  /**
  * performs the necessary conversions for the XML response type
  *
  * @access   public
  * @param    object    xml_document  a XMLHttpObject
  * @return   object
  */
  this.xml_conversion = function(xml_document) {
    return xml_document;
  }
  
  /**
  * performs the necessary conversions for the TEXT response type
  *
  * @access   public
  * @param    string    text  the response text
  * @return   string
  */
  this.text_conversion = function(text) {
    return decode(text);
  }
  
  /**
  * performs the necessary conversions for the E4X response type
  *
  * @access   public
  * @param    string    text  the response text
  * @return   string
  */
  this.e4x_conversion = function(text) {
    // remove <?xml ?>tag
    text = text.replace(/^\<\?xml[^>]+\>/, '');
    return new XML(text);
  }
  
  /**
  * performs the necessary conversions for the JSON response type
  *
  * @access   public
  * @param    string    text  the response text
  * @return   string
  */
  this.json_conversion = function(text) {
    return JSON.parse(text);
  }
  
  /**
  * this method takes a HTML / XML node object and creates a
  * JavaScript object structure from it.
  *
  * @access   public
  * @param    object    stream    a node in the XML structure
  * @return   object
  */
  var create_object_structure = function(stream) {
    var return_value = new cpaint_result_object();
    var node_name = '';
    var i         = 0;
    var attrib    = 0;
    
    if (stream.hasChildNodes() == true) {
      for (i = 0; i < stream.childNodes.length; i++) {
  
        node_name = stream.childNodes[i].nodeName;
        node_name = node_name.replace(/[^a-zA-Z0-9_]*/g, '');
        
        // reset / create subnode
        if (typeof return_value[node_name] != 'object') {
          return_value[node_name] = new Array();
        }
        
        if (stream.childNodes[i].nodeType == 1) {
          var tmp_node  = create_object_structure(stream.childNodes[i]);

          for (attrib = 0; attrib < stream.childNodes[i].attributes.length; attrib++) {
            tmp_node.set_attribute(stream.childNodes[i].attributes[attrib].nodeName, stream.childNodes[i].attributes[attrib].nodeValue);
          }
          
          return_value[node_name].push(tmp_node);
        
        } else if (stream.childNodes[i].nodeType == 3) {
          return_value.data  = decode(String(stream.firstChild.data));
        }
      }
    }
    
    return return_value;
  }

  /**
  * converts an encoded text back to viewable characters.
  *
  * @access     public
  * @param      string      rawtext     raw text as provided by the backend
  * @return     mixed
  */
  var decode = function(rawtext) {
    var plaintext = ''; 
    var i         = 0; 
    var c1        = 0;
    var c2        = 0;
    var c3        = 0;
    var u         = 0;
    var t         = 0;

    // remove special JavaScript encoded non-printable characters
    while (i < rawtext.length) {
      if (rawtext.charAt(i) == '\\'
        && rawtext.charAt(i + 1) == 'u') {
        
        u = 0;
        
        for (j = 2; j < 6; j += 1) {
          t = parseInt(rawtext.charAt(i + j), 16);
          
          if (!isFinite(t)) {
            break;
          }
          u = u * 16 + t;
        }

        plaintext += String.fromCharCode(u);
        i       += 6;
      
      } else {
        plaintext += rawtext.charAt(i);
        i++;
      }
    }

    // convert numeric data to number type
    if (plaintext != ''
      && plaintext.search(/^\s+$/g) == -1
      && !isNaN(plaintext) 
      && isFinite(plaintext)) {
      
      plaintext = Number(plaintext);
    }
  
    return plaintext;
  }
}

/**
* this is the basic prototype for a cpaint node object
* as used in cpaint_call.parse_ajax_xml()
*
* @package      CPAINT
* @access       public
* @copyright    Copyright (c) 2005-2006 Paul Sullivan, Dominique Stender - http://sf.net/projects/cpaint
* @author       Paul Sullivan <wiley14@gmail.com>
* @author       Dominique Stender <dstender@st-webdevelopment.de>
*/
function cpaint_result_object() {
  this.id           = 0;
  this.data         = '';
  var __attributes  = new Array();
  
  /**
  * Returns a subnode with the given type and id.
  *
  * @access     public
  * @param      string    type    The type of the subnode. Equivalent to the XML tag name.
  * @param      string    id      The id of the subnode. Equivalent to the XML tag names id attribute.
  * @return     object
  */
  this.find_item_by_id = function() {
    var return_value  = null;
    var type    = arguments[0];
    var id      = arguments[1];
    var i       = 0;
    
    if (this[type]) {

      for (i = 0; i < this[type].length; i++) {

        if (this[type][i].get_attribute('id') == id) {
          return_value = this[type][i];
          break;
        }
      }
    }

    return return_value;
  }
  
  /**
  * retrieves the value of an attribute.
  *
  * @access   public
  * @param    string    name    name of the attribute
  * @return   mixed
  */
  this.get_attribute = function() {
    var return_value  = null;
    var id            = arguments[0];
    
    if (typeof __attributes[id] != 'undefined') {
      return_value = __attributes[id];
    }
    
    return return_value;
  }
  
  /**
  * assigns a value to an attribute.
  *
  * if that attribute does not exist it will be created.
  *
  * @access     public
  * @param      string    name    name of the attribute
  * @param      string    value   value of the attribute
  * @return     void
  */
  this.set_attribute = function() {
    __attributes[arguments[0]] = arguments[1];
  }
}


/*
Copyright (c) 2005 JSON.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The Software shall be used for Good, not Evil.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/


Array.prototype.______array = '______array';

var JSON = {
  org: 'http://www.JSON.org',
  copyright: '(c)2005 JSON.org',
  license: 'http://www.crockford.com/JSON/license.html',

  stringify: function (arg) {
    var c, i, l, s = '', v;
    var numeric = true;
    
    switch (typeof arg) {
    case 'object':
      if (arg) {
        if (arg.______array == '______array') {
          // do a test whether all array keys are numeric
          for (i in arg) {
            if (i != '______array'
              && (isNaN(i) 
                || !isFinite(i))) {
              numeric = false;
              break;
            }
          }
          
          if (numeric == true) {
            for (i = 0; i < arg.length; ++i) {
              if (typeof arg[i] != 'undefined') {
                v = this.stringify(arg[i]);
                if (s) {
                  s += ',';
                }
                s += v;
              } else {
                s += ',null';
              }
            }
            return '[' + s + ']';
          } else {
            for (i in arg) {
              if (i != '______array') {
                v = arg[i];
                if (typeof v != 'undefined' && typeof v != 'function') {
                  v = this.stringify(v);
                  if (s) {
                    s += ',';
                  }
                  s += this.stringify(i) + ':' + v;
                }
              }
            }
            // return as object
            return '{' + s + '}';
          }
        } else if (typeof arg.toString != 'undefined') {
          for (i in arg) {
            v = arg[i];
            if (typeof v != 'undefined' && typeof v != 'function') {
              v = this.stringify(v);
              if (s) {
                s += ',';
              }
              s += this.stringify(i) + ':' + v;
            }
          }
          return '{' + s + '}';
        }
      }
      return 'null';
    case 'number':
      return isFinite(arg) ? String(arg) : 'null';
    case 'string':
      l = arg.length;
      s = '"';
      for (i = 0; i < l; i += 1) {
        c = arg.charAt(i);
        if (c >= ' ') {
          if (c == '\\' || c == '"') {
            s += '\\';
          }
          s += c;
        } else {
          switch (c) {
            case '\b':
              s += '\\b';
              break;
            case '\f':
              s += '\\f';
              break;
            case '\n':
              s += '\\n';
              break;
            case '\r':
              s += '\\r';
              break;
            case '\t':
              s += '\\t';
              break;
            default:
              c = c.charCodeAt();
              s += '\\u00' + Math.floor(c / 16).toString(16) +
                (c % 16).toString(16);
          }
        }
      }
      return s + '"';
    case 'boolean':
      return String(arg);
    default:
      return 'null';
    }
  },
  parse: function (text) {
    var at = 0;
    var ch = ' ';

    function error(m) {
      throw {
        name: 'JSONError',
        message: m,
        at: at - 1,
        text: text
      };
    }

    function next() {
      ch = text.charAt(at);
      at += 1;
      return ch;
    }

    function white() {
      while (ch != '' && ch <= ' ') {
        next();
      }
    }

    function str() {
      var i, s = '', t, u;

      if (ch == '"') {
outer:      while (next()) {
          if (ch == '"') {
            next();
            return s;
          } else if (ch == '\\') {
            switch (next()) {
            case 'b':
              s += '\b';
              break;
            case 'f':
              s += '\f';
              break;
            case 'n':
              s += '\n';
              break;
            case 'r':
              s += '\r';
              break;
            case 't':
              s += '\t';
              break;
            case 'u':
              u = 0;
              for (i = 0; i < 4; i += 1) {
                t = parseInt(next(), 16);
                if (!isFinite(t)) {
                  break outer;
                }
                u = u * 16 + t;
              }
              s += String.fromCharCode(u);
              break;
            default:
              s += ch;
            }
          } else {
            s += ch;
          }
        }
      }
      error("Bad string");
    }

    function arr() {
      var a = [];

      if (ch == '[') {
        next();
        white();
        if (ch == ']') {
          next();
          return a;
        }
        while (ch) {
          a.push(val());
          white();
          if (ch == ']') {
            next();
            return a;
          } else if (ch != ',') {
            break;
          }
          next();
          white();
        }
      }
      error("Bad array");
    }

    function obj() {
      var k, o = {};

      if (ch == '{') {
        next();
        white();
        if (ch == '}') {
          next();
          return o;
        }
        while (ch) {
          k = str();
          white();
          if (ch != ':') {
            break;
          }
          next();
          o[k] = val();
          white();
          if (ch == '}') {
            next();
            return o;
          } else if (ch != ',') {
            break;
          }
          next();
          white();
        }
      }
      error("Bad object");
    }

    function assoc() {
      var k, a = [];

      if (ch == '<') {
        next();
        white();
        if (ch == '>') {
          next();
          return a;
        }
        while (ch) {
          k = str();
          white();
          if (ch != ':') {
            break;
          }
          next();
          a[k] = val();
          white();
          if (ch == '>') {
            next();
            return a;
          } else if (ch != ',') {
            break;
          }
          next();
          white();
        }
      }
      error("Bad associative array");
    }

    function num() {
      var n = '', v;
      if (ch == '-') {
        n = '-';
        next();
      }
      while (ch >= '0' && ch <= '9') {
        n += ch;
        next();
      }
      if (ch == '.') {
        n += '.';
        while (next() && ch >= '0' && ch <= '9') {
          n += ch;
        }
      }
      if (ch == 'e' || ch == 'E') {
        n += 'e';
        next();
        if (ch == '-' || ch == '+') {
          n += ch;
          next();
        }
        while (ch >= '0' && ch <= '9') {
          n += ch;
          next();
        }
      }
      v = +n;
      if (!isFinite(v)) {
        error("Bad number");
      } else {
        return v;
      }
    }

    function word() {
      switch (ch) {
        case 't':
          if (next() == 'r' && next() == 'u' && next() == 'e') {
            next();
            return true;
          }
          break;
        case 'f':
          if (next() == 'a' && next() == 'l' && next() == 's' &&
              next() == 'e') {
            next();
            return false;
          }
          break;
        case 'n':
          if (next() == 'u' && next() == 'l' && next() == 'l') {
            next();
            return null;
          }
          break;
      }
      error("Syntax error");
    }

    function val() {
      white();
      switch (ch) {
        case '{':
          return obj();
        case '[':
          return arr();
        case '<':
          return assoc();
        case '"':
          return str();
        case '-':
          return num();
        default:
          return ch >= '0' && ch <= '9' ? num() : word();
      }
    }

    return val();
  }
};


/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=(""+A[C]).split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules,B,H,G,F,C;if(!I[A]){I[A]={versions:[],builds:[]};}B=I[A];H=D.version;G=D.build;F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var C={ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0,caja:0},B=navigator.userAgent,A;if((/KHTML/).test(B)){C.webkit=1;}A=B.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){C.webkit=parseFloat(A[1]);if(/ Mobile\//.test(B)){C.mobile="Apple";}else{A=B.match(/NokiaN[^\/]*/);if(A){C.mobile=A[0];}}A=B.match(/AdobeAIR\/([^\s]*)/);if(A){C.air=A[0];}}if(!C.webkit){A=B.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){C.opera=parseFloat(A[1]);A=B.match(/Opera Mini[^;]*/);if(A){C.mobile=A[0];}}else{A=B.match(/MSIE\s([^;]*)/);if(A&&A[1]){C.ie=parseFloat(A[1]);}else{A=B.match(/Gecko\/([^\s]*)/);if(A){C.gecko=1;A=B.match(/rv:([^\s\)]*)/);if(A&&A[1]){C.gecko=parseFloat(A[1]);}}}}}A=B.match(/Caja\/([^\s]*)/);if(A&&A[1]){C.caja=parseFloat(A[1]);}return C;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C=C+1){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var B=YAHOO.lang,F="[object Array]",C="[object Function]",A=Object.prototype,E=["toString","valueOf"],D={isArray:function(G){return A.toString.apply(G)===F;},isBoolean:function(G){return typeof G==="boolean";},isFunction:function(G){return A.toString.apply(G)===C;},isNull:function(G){return G===null;},isNumber:function(G){return typeof G==="number"&&isFinite(G);},isObject:function(G){return(G&&(typeof G==="object"||B.isFunction(G)))||false;},isString:function(G){return typeof G==="string";},isUndefined:function(G){return typeof G==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(I,H){var G,K,J;for(G=0;G<E.length;G=G+1){K=E[G];J=H[K];if(B.isFunction(J)&&J!=A[K]){I[K]=J;}}}:function(){},extend:function(J,K,I){if(!K||!J){throw new Error("extend failed, please check that "+"all dependencies are included.");}var H=function(){},G;H.prototype=K.prototype;J.prototype=new H();J.prototype.constructor=J;J.superclass=K.prototype;if(K.prototype.constructor==A.constructor){K.prototype.constructor=K;}if(I){for(G in I){if(B.hasOwnProperty(I,G)){J.prototype[G]=I[G];}}B._IEEnumFix(J.prototype,I);}},augmentObject:function(K,J){if(!J||!K){throw new Error("Absorb failed, verify dependencies.");}var G=arguments,I,L,H=G[2];if(H&&H!==true){for(I=2;I<G.length;I=I+1){K[G[I]]=J[G[I]];}}else{for(L in J){if(H||!(L in K)){K[L]=J[L];}}B._IEEnumFix(K,J);}},augmentProto:function(J,I){if(!I||!J){throw new Error("Augment failed, verify dependencies.");}var G=[J.prototype,I.prototype],H;for(H=2;H<arguments.length;H=H+1){G.push(arguments[H]);}B.augmentObject.apply(this,G);},dump:function(G,L){var I,K,N=[],O="{...}",H="f(){...}",M=", ",J=" => ";if(!B.isObject(G)){return G+"";}else{if(G instanceof Date||("nodeType" in G&&"tagName" in G)){return G;}else{if(B.isFunction(G)){return H;}}}L=(B.isNumber(L))?L:3;if(B.isArray(G)){N.push("[");for(I=0,K=G.length;I<K;I=I+1){if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}if(N.length>1){N.pop();}N.push("]");}else{N.push("{");for(I in G){if(B.hasOwnProperty(G,I)){N.push(I+J);if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}}if(N.length>1){N.pop();}N.push("}");}return N.join("");},substitute:function(V,H,O){var L,K,J,R,S,U,Q=[],I,M="dump",P=" ",G="{",T="}",N;for(;;){L=V.lastIndexOf(G);if(L<0){break;}K=V.indexOf(T,L);if(L+1>=K){break;}I=V.substring(L+1,K);R=I;U=null;J=R.indexOf(P);if(J>-1){U=R.substring(J+1);R=R.substring(0,J);}S=H[R];if(O){S=O(R,S,U);}if(B.isObject(S)){if(B.isArray(S)){S=B.dump(S,parseInt(U,10));}else{U=U||"";N=U.indexOf(M);if(N>-1){U=U.substring(4);}if(S.toString===A.toString||N>-1){S=B.dump(S,parseInt(U,10));}else{S=S.toString();}}}else{if(!B.isString(S)&&!B.isNumber(S)){S="~-"+Q.length+"-~";Q[Q.length]=I;}}V=V.substring(0,L)+S+V.substring(K+1);}for(L=Q.length-1;L>=0;L=L-1){V=V.replace(new RegExp("~-"+L+"-~"),"{"+Q[L]+"}","g");}return V;},trim:function(G){try{return G.replace(/^\s+|\s+$/g,"");}catch(H){return G;}},merge:function(){var J={},H=arguments,G=H.length,I;for(I=0;I<G;I=I+1){B.augmentObject(J,H[I],true);}return J;},later:function(N,H,O,J,K){N=N||0;H=H||{};var I=O,M=J,L,G;if(B.isString(O)){I=H[O];}if(!I){throw new TypeError("method undefined");}if(!B.isArray(M)){M=[J];}L=function(){I.apply(H,M);};G=(K)?setInterval(L,N):setTimeout(L,N);return{interval:K,cancel:function(){if(this.interval){clearInterval(G);}else{clearTimeout(G);}}};},isValue:function(G){return(B.isObject(G)||B.isString(G)||B.isNumber(G)||B.isBoolean(G));}};B.hasOwnProperty=(A.hasOwnProperty)?function(G,H){return G&&G.hasOwnProperty(H);}:function(G,H){return !B.isUndefined(G[H])&&G.constructor.prototype[H]!==G[H];};D.augmentObject(B,D,true);YAHOO.util.Lang=B;B.augment=B.augmentProto;YAHOO.augment=B.augmentProto;YAHOO.extend=B.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=(""+A[C]).split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules,B,H,G,F,C;if(!I[A]){I[A]={versions:[],builds:[]};}B=I[A];H=D.version;G=D.build;F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var C={ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0,caja:0},B=navigator.userAgent,A;if((/KHTML/).test(B)){C.webkit=1;}A=B.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){C.webkit=parseFloat(A[1]);if(/ Mobile\//.test(B)){C.mobile="Apple";}else{A=B.match(/NokiaN[^\/]*/);if(A){C.mobile=A[0];}}A=B.match(/AdobeAIR\/([^\s]*)/);if(A){C.air=A[0];}}if(!C.webkit){A=B.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){C.opera=parseFloat(A[1]);A=B.match(/Opera Mini[^;]*/);if(A){C.mobile=A[0];}}else{A=B.match(/MSIE\s([^;]*)/);if(A&&A[1]){C.ie=parseFloat(A[1]);}else{A=B.match(/Gecko\/([^\s]*)/);if(A){C.gecko=1;A=B.match(/rv:([^\s\)]*)/);if(A&&A[1]){C.gecko=parseFloat(A[1]);}}}}}A=B.match(/Caja\/([^\s]*)/);if(A&&A[1]){C.caja=parseFloat(A[1]);}return C;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C=C+1){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var B=YAHOO.lang,F="[object Array]",C="[object Function]",A=Object.prototype,E=["toString","valueOf"],D={isArray:function(G){return A.toString.apply(G)===F;},isBoolean:function(G){return typeof G==="boolean";},isFunction:function(G){return A.toString.apply(G)===C;},isNull:function(G){return G===null;},isNumber:function(G){return typeof G==="number"&&isFinite(G);},isObject:function(G){return(G&&(typeof G==="object"||B.isFunction(G)))||false;},isString:function(G){return typeof G==="string";},isUndefined:function(G){return typeof G==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(I,H){var G,K,J;for(G=0;G<E.length;G=G+1){K=E[G];J=H[K];if(B.isFunction(J)&&J!=A[K]){I[K]=J;}}}:function(){},extend:function(J,K,I){if(!K||!J){throw new Error("extend failed, please check that "+"all dependencies are included.");}var H=function(){},G;H.prototype=K.prototype;J.prototype=new H();J.prototype.constructor=J;J.superclass=K.prototype;if(K.prototype.constructor==A.constructor){K.prototype.constructor=K;}if(I){for(G in I){if(B.hasOwnProperty(I,G)){J.prototype[G]=I[G];}}B._IEEnumFix(J.prototype,I);}},augmentObject:function(K,J){if(!J||!K){throw new Error("Absorb failed, verify dependencies.");}var G=arguments,I,L,H=G[2];if(H&&H!==true){for(I=2;I<G.length;I=I+1){K[G[I]]=J[G[I]];}}else{for(L in J){if(H||!(L in K)){K[L]=J[L];}}B._IEEnumFix(K,J);}},augmentProto:function(J,I){if(!I||!J){throw new Error("Augment failed, verify dependencies.");}var G=[J.prototype,I.prototype],H;for(H=2;H<arguments.length;H=H+1){G.push(arguments[H]);}B.augmentObject.apply(this,G);},dump:function(G,L){var I,K,N=[],O="{...}",H="f(){...}",M=", ",J=" => ";if(!B.isObject(G)){return G+"";}else{if(G instanceof Date||("nodeType" in G&&"tagName" in G)){return G;}else{if(B.isFunction(G)){return H;}}}L=(B.isNumber(L))?L:3;if(B.isArray(G)){N.push("[");for(I=0,K=G.length;I<K;I=I+1){if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}if(N.length>1){N.pop();}N.push("]");}else{N.push("{");for(I in G){if(B.hasOwnProperty(G,I)){N.push(I+J);if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}}if(N.length>1){N.pop();}N.push("}");}return N.join("");},substitute:function(V,H,O){var L,K,J,R,S,U,Q=[],I,M="dump",P=" ",G="{",T="}",N;for(;;){L=V.lastIndexOf(G);if(L<0){break;}K=V.indexOf(T,L);if(L+1>=K){break;}I=V.substring(L+1,K);R=I;U=null;J=R.indexOf(P);if(J>-1){U=R.substring(J+1);R=R.substring(0,J);}S=H[R];if(O){S=O(R,S,U);}if(B.isObject(S)){if(B.isArray(S)){S=B.dump(S,parseInt(U,10));}else{U=U||"";N=U.indexOf(M);if(N>-1){U=U.substring(4);}if(S.toString===A.toString||N>-1){S=B.dump(S,parseInt(U,10));}else{S=S.toString();}}}else{if(!B.isString(S)&&!B.isNumber(S)){S="~-"+Q.length+"-~";Q[Q.length]=I;}}V=V.substring(0,L)+S+V.substring(K+1);}for(L=Q.length-1;L>=0;L=L-1){V=V.replace(new RegExp("~-"+L+"-~"),"{"+Q[L]+"}","g");}return V;},trim:function(G){try{return G.replace(/^\s+|\s+$/g,"");}catch(H){return G;}},merge:function(){var J={},H=arguments,G=H.length,I;for(I=0;I<G;I=I+1){B.augmentObject(J,H[I],true);}return J;},later:function(N,H,O,J,K){N=N||0;H=H||{};var I=O,M=J,L,G;if(B.isString(O)){I=H[O];}if(!I){throw new TypeError("method undefined");}if(!B.isArray(M)){M=[J];}L=function(){I.apply(H,M);};G=(K)?setInterval(L,N):setTimeout(L,N);return{interval:K,cancel:function(){if(this.interval){clearInterval(G);}else{clearTimeout(G);}}};},isValue:function(G){return(B.isObject(G)||B.isString(G)||B.isNumber(G)||B.isBoolean(G));}};B.hasOwnProperty=(A.hasOwnProperty)?function(G,H){return G&&G.hasOwnProperty(H);}:function(G,H){return !B.isUndefined(G[H])&&G.constructor.prototype[H]!==G[H];};D.augmentObject(B,D,true);YAHOO.util.Lang=B;B.augment=B.augmentProto;YAHOO.augment=B.augmentProto;YAHOO.extend=B.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.7.0",build:"1799"});(function(){YAHOO.env._id_counter=YAHOO.env._id_counter||0;var E=YAHOO.util,L=YAHOO.lang,m=YAHOO.env.ua,A=YAHOO.lang.trim,d={},h={},N=/^t(?:able|d|h)$/i,X=/color$/i,K=window.document,W=K.documentElement,e="ownerDocument",n="defaultView",v="documentElement",t="compatMode",b="offsetLeft",P="offsetTop",u="offsetParent",Z="parentNode",l="nodeType",C="tagName",O="scrollLeft",i="scrollTop",Q="getBoundingClientRect",w="getComputedStyle",a="currentStyle",M="CSS1Compat",c="BackCompat",g="class",F="className",J="",B=" ",s="(?:^|\\s)",k="(?= |$)",U="g",p="position",f="fixed",V="relative",j="left",o="top",r="medium",q="borderLeftWidth",R="borderTopWidth",D=m.opera,I=m.webkit,H=m.gecko,T=m.ie;E.Dom={CUSTOM_ATTRIBUTES:(!W.hasAttribute)?{"for":"htmlFor","class":F}:{"htmlFor":"for","className":g},get:function(y){var AA,Y,z,x,G;if(y){if(y[l]||y.item){return y;}if(typeof y==="string"){AA=y;y=K.getElementById(y);if(y&&y.id===AA){return y;}else{if(y&&K.all){y=null;Y=K.all[AA];for(x=0,G=Y.length;x<G;++x){if(Y[x].id===AA){return Y[x];}}}}return y;}if(y.DOM_EVENTS){y=y.get("element");}if("length" in y){z=[];for(x=0,G=y.length;x<G;++x){z[z.length]=E.Dom.get(y[x]);}return z;}return y;}return null;},getComputedStyle:function(G,Y){if(window[w]){return G[e][n][w](G,null)[Y];}else{if(G[a]){return E.Dom.IE_ComputedStyle.get(G,Y);}}},getStyle:function(G,Y){return E.Dom.batch(G,E.Dom._getStyle,Y);},_getStyle:function(){if(window[w]){return function(G,y){y=(y==="float")?y="cssFloat":E.Dom._toCamel(y);var x=G.style[y],Y;if(!x){Y=G[e][n][w](G,null);if(Y){x=Y[y];}}return x;};}else{if(W[a]){return function(G,y){var x;switch(y){case"opacity":x=100;try{x=G.filters["DXImageTransform.Microsoft.Alpha"].opacity;}catch(z){try{x=G.filters("alpha").opacity;}catch(Y){}}return x/100;case"float":y="styleFloat";default:y=E.Dom._toCamel(y);x=G[a]?G[a][y]:null;return(G.style[y]||x);}};}}}(),setStyle:function(G,Y,x){E.Dom.batch(G,E.Dom._setStyle,{prop:Y,val:x});},_setStyle:function(){if(T){return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){switch(x){case"opacity":if(L.isString(Y.style.filter)){Y.style.filter="alpha(opacity="+y*100+")";if(!Y[a]||!Y[a].hasLayout){Y.style.zoom=1;}}break;case"float":x="styleFloat";default:Y.style[x]=y;}}else{}};}else{return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){if(x=="float"){x="cssFloat";}Y.style[x]=y;}else{}};}}(),getXY:function(G){return E.Dom.batch(G,E.Dom._getXY);},_canPosition:function(G){return(E.Dom._getStyle(G,"display")!=="none"&&E.Dom._inDoc(G));},_getXY:function(){if(K[v][Q]){return function(y){var z,Y,AA,AF,AE,AD,AC,G,x,AB=Math.floor,AG=false;if(E.Dom._canPosition(y)){AA=y[Q]();AF=y[e];z=E.Dom.getDocumentScrollLeft(AF);Y=E.Dom.getDocumentScrollTop(AF);AG=[AB(AA[j]),AB(AA[o])];if(T&&m.ie<8){AE=2;AD=2;AC=AF[t];G=S(AF[v],q);x=S(AF[v],R);if(m.ie===6){if(AC!==c){AE=0;AD=0;}}if((AC==c)){if(G!==r){AE=parseInt(G,10);}if(x!==r){AD=parseInt(x,10);}}AG[0]-=AE;AG[1]-=AD;}if((Y||z)){AG[0]+=z;AG[1]+=Y;}AG[0]=AB(AG[0]);AG[1]=AB(AG[1]);}else{}return AG;};}else{return function(y){var x,Y,AA,AB,AC,z=false,G=y;if(E.Dom._canPosition(y)){z=[y[b],y[P]];x=E.Dom.getDocumentScrollLeft(y[e]);Y=E.Dom.getDocumentScrollTop(y[e]);AC=((H||m.webkit>519)?true:false);while((G=G[u])){z[0]+=G[b];z[1]+=G[P];if(AC){z=E.Dom._calcBorders(G,z);}}if(E.Dom._getStyle(y,p)!==f){G=y;while((G=G[Z])&&G[C]){AA=G[i];AB=G[O];if(H&&(E.Dom._getStyle(G,"overflow")!=="visible")){z=E.Dom._calcBorders(G,z);}if(AA||AB){z[0]-=AB;z[1]-=AA;}}z[0]+=x;z[1]+=Y;}else{if(D){z[0]-=x;z[1]-=Y;}else{if(I||H){z[0]+=x;z[1]+=Y;}}}z[0]=Math.floor(z[0]);z[1]=Math.floor(z[1]);}else{}return z;};}}(),getX:function(G){var Y=function(x){return E.Dom.getXY(x)[0];};return E.Dom.batch(G,Y,E.Dom,true);},getY:function(G){var Y=function(x){return E.Dom.getXY(x)[1];};return E.Dom.batch(G,Y,E.Dom,true);},setXY:function(G,x,Y){E.Dom.batch(G,E.Dom._setXY,{pos:x,noRetry:Y});},_setXY:function(G,z){var AA=E.Dom._getStyle(G,p),y=E.Dom.setStyle,AD=z.pos,Y=z.noRetry,AB=[parseInt(E.Dom.getComputedStyle(G,j),10),parseInt(E.Dom.getComputedStyle(G,o),10)],AC,x;if(AA=="static"){AA=V;y(G,p,AA);}AC=E.Dom._getXY(G);if(!AD||AC===false){return false;}if(isNaN(AB[0])){AB[0]=(AA==V)?0:G[b];}if(isNaN(AB[1])){AB[1]=(AA==V)?0:G[P];}if(AD[0]!==null){y(G,j,AD[0]-AC[0]+AB[0]+"px");}if(AD[1]!==null){y(G,o,AD[1]-AC[1]+AB[1]+"px");}if(!Y){x=E.Dom._getXY(G);if((AD[0]!==null&&x[0]!=AD[0])||(AD[1]!==null&&x[1]!=AD[1])){E.Dom._setXY(G,{pos:AD,noRetry:true});}}},setX:function(Y,G){E.Dom.setXY(Y,[G,null]);},setY:function(G,Y){E.Dom.setXY(G,[null,Y]);},getRegion:function(G){var Y=function(x){var y=false;if(E.Dom._canPosition(x)){y=E.Region.getRegion(x);}else{}return y;};return E.Dom.batch(G,Y,E.Dom,true);},getClientWidth:function(){return E.Dom.getViewportWidth();},getClientHeight:function(){return E.Dom.getViewportHeight();},getElementsByClassName:function(AB,AF,AC,AE,x,AD){AB=L.trim(AB);AF=AF||"*";AC=(AC)?E.Dom.get(AC):null||K;if(!AC){return[];}var Y=[],G=AC.getElementsByTagName(AF),z=E.Dom.hasClass;for(var y=0,AA=G.length;y<AA;++y){if(z(G[y],AB)){Y[Y.length]=G[y];}}if(AE){E.Dom.batch(Y,AE,x,AD);}return Y;},hasClass:function(Y,G){return E.Dom.batch(Y,E.Dom._hasClass,G);},_hasClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(Y.exec){G=Y.test(y);}else{G=Y&&(B+y+B).indexOf(B+Y+B)>-1;}}else{}return G;},addClass:function(Y,G){return E.Dom.batch(Y,E.Dom._addClass,G);},_addClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(!E.Dom._hasClass(x,Y)){E.Dom.setAttribute(x,F,A(y+B+Y));G=true;}}else{}return G;},removeClass:function(Y,G){return E.Dom.batch(Y,E.Dom._removeClass,G);},_removeClass:function(y,x){var Y=false,AA,z,G;if(y&&x){AA=E.Dom.getAttribute(y,F)||J;E.Dom.setAttribute(y,F,AA.replace(E.Dom._getClassRegex(x),J));z=E.Dom.getAttribute(y,F);if(AA!==z){E.Dom.setAttribute(y,F,A(z));Y=true;if(E.Dom.getAttribute(y,F)===""){G=(y.hasAttribute&&y.hasAttribute(g))?g:F;y.removeAttribute(G);}}}else{}return Y;},replaceClass:function(x,Y,G){return E.Dom.batch(x,E.Dom._replaceClass,{from:Y,to:G});
},_replaceClass:function(y,x){var Y,AB,AA,G=false,z;if(y&&x){AB=x.from;AA=x.to;if(!AA){G=false;}else{if(!AB){G=E.Dom._addClass(y,x.to);}else{if(AB!==AA){z=E.Dom.getAttribute(y,F)||J;Y=(B+z.replace(E.Dom._getClassRegex(AB),B+AA)).split(E.Dom._getClassRegex(AA));Y.splice(1,0,B+AA);E.Dom.setAttribute(y,F,A(Y.join(J)));G=true;}}}}else{}return G;},generateId:function(G,x){x=x||"yui-gen";var Y=function(y){if(y&&y.id){return y.id;}var z=x+YAHOO.env._id_counter++;if(y){if(y[e].getElementById(z)){return E.Dom.generateId(y,z+x);}y.id=z;}return z;};return E.Dom.batch(G,Y,E.Dom,true)||Y.apply(E.Dom,arguments);},isAncestor:function(Y,x){Y=E.Dom.get(Y);x=E.Dom.get(x);var G=false;if((Y&&x)&&(Y[l]&&x[l])){if(Y.contains&&Y!==x){G=Y.contains(x);}else{if(Y.compareDocumentPosition){G=!!(Y.compareDocumentPosition(x)&16);}}}else{}return G;},inDocument:function(G,Y){return E.Dom._inDoc(E.Dom.get(G),Y);},_inDoc:function(Y,x){var G=false;if(Y&&Y[C]){x=x||Y[e];G=E.Dom.isAncestor(x[v],Y);}else{}return G;},getElementsBy:function(Y,AF,AB,AD,y,AC,AE){AF=AF||"*";AB=(AB)?E.Dom.get(AB):null||K;if(!AB){return[];}var x=[],G=AB.getElementsByTagName(AF);for(var z=0,AA=G.length;z<AA;++z){if(Y(G[z])){if(AE){x=G[z];break;}else{x[x.length]=G[z];}}}if(AD){E.Dom.batch(x,AD,y,AC);}return x;},getElementBy:function(x,G,Y){return E.Dom.getElementsBy(x,G,Y,null,null,null,true);},batch:function(x,AB,AA,z){var y=[],Y=(z)?AA:window;x=(x&&(x[C]||x.item))?x:E.Dom.get(x);if(x&&AB){if(x[C]||x.length===undefined){return AB.call(Y,x,AA);}for(var G=0;G<x.length;++G){y[y.length]=AB.call(Y,x[G],AA);}}else{return false;}return y;},getDocumentHeight:function(){var Y=(K[t]!=M||I)?K.body.scrollHeight:W.scrollHeight,G=Math.max(Y,E.Dom.getViewportHeight());return G;},getDocumentWidth:function(){var Y=(K[t]!=M||I)?K.body.scrollWidth:W.scrollWidth,G=Math.max(Y,E.Dom.getViewportWidth());return G;},getViewportHeight:function(){var G=self.innerHeight,Y=K[t];if((Y||T)&&!D){G=(Y==M)?W.clientHeight:K.body.clientHeight;}return G;},getViewportWidth:function(){var G=self.innerWidth,Y=K[t];if(Y||T){G=(Y==M)?W.clientWidth:K.body.clientWidth;}return G;},getAncestorBy:function(G,Y){while((G=G[Z])){if(E.Dom._testElement(G,Y)){return G;}}return null;},getAncestorByClassName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return E.Dom.hasClass(y,G);};return E.Dom.getAncestorBy(Y,x);},getAncestorByTagName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return y[C]&&y[C].toUpperCase()==G.toUpperCase();};return E.Dom.getAncestorBy(Y,x);},getPreviousSiblingBy:function(G,Y){while(G){G=G.previousSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getPreviousSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getPreviousSiblingBy(G);},getNextSiblingBy:function(G,Y){while(G){G=G.nextSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getNextSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getNextSiblingBy(G);},getFirstChildBy:function(G,x){var Y=(E.Dom._testElement(G.firstChild,x))?G.firstChild:null;return Y||E.Dom.getNextSiblingBy(G.firstChild,x);},getFirstChild:function(G,Y){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getFirstChildBy(G);},getLastChildBy:function(G,x){if(!G){return null;}var Y=(E.Dom._testElement(G.lastChild,x))?G.lastChild:null;return Y||E.Dom.getPreviousSiblingBy(G.lastChild,x);},getLastChild:function(G){G=E.Dom.get(G);return E.Dom.getLastChildBy(G);},getChildrenBy:function(Y,y){var x=E.Dom.getFirstChildBy(Y,y),G=x?[x]:[];E.Dom.getNextSiblingBy(x,function(z){if(!y||y(z)){G[G.length]=z;}return false;});return G;},getChildren:function(G){G=E.Dom.get(G);if(!G){}return E.Dom.getChildrenBy(G);},getDocumentScrollLeft:function(G){G=G||K;return Math.max(G[v].scrollLeft,G.body.scrollLeft);},getDocumentScrollTop:function(G){G=G||K;return Math.max(G[v].scrollTop,G.body.scrollTop);},insertBefore:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}return G[Z].insertBefore(Y,G);},insertAfter:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}if(G.nextSibling){return G[Z].insertBefore(Y,G.nextSibling);}else{return G[Z].appendChild(Y);}},getClientRegion:function(){var x=E.Dom.getDocumentScrollTop(),Y=E.Dom.getDocumentScrollLeft(),y=E.Dom.getViewportWidth()+Y,G=E.Dom.getViewportHeight()+x;return new E.Region(x,y,G,Y);},setAttribute:function(Y,G,x){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;Y.setAttribute(G,x);},getAttribute:function(Y,G){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;return Y.getAttribute(G);},_toCamel:function(Y){var x=d;function G(y,z){return z.toUpperCase();}return x[Y]||(x[Y]=Y.indexOf("-")===-1?Y:Y.replace(/-([a-z])/gi,G));},_getClassRegex:function(Y){var G;if(Y!==undefined){if(Y.exec){G=Y;}else{G=h[Y];if(!G){Y=Y.replace(E.Dom._patterns.CLASS_RE_TOKENS,"\\$1");G=h[Y]=new RegExp(s+Y+k,U);}}}return G;},_patterns:{ROOT_TAG:/^body|html$/i,CLASS_RE_TOKENS:/([\.\(\)\^\$\*\+\?\|\[\]\{\}])/g},_testElement:function(G,Y){return G&&G[l]==1&&(!Y||Y(G));},_calcBorders:function(x,y){var Y=parseInt(E.Dom[w](x,R),10)||0,G=parseInt(E.Dom[w](x,q),10)||0;if(H){if(N.test(x[C])){Y=0;G=0;}}y[0]+=G;y[1]+=Y;return y;}};var S=E.Dom[w];if(m.opera){E.Dom[w]=function(Y,G){var x=S(Y,G);if(X.test(G)){x=E.Dom.Color.toRGB(x);}return x;};}if(m.webkit){E.Dom[w]=function(Y,G){var x=S(Y,G);if(x==="rgba(0, 0, 0, 0)"){x="transparent";}return x;};}})();YAHOO.util.Region=function(C,D,A,B){this.top=C;this.y=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this.x=B;this[0]=B;this.width=this.right-this.left;this.height=this.bottom-this.top;};YAHOO.util.Region.prototype.contains=function(A){return(A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(E){var C=Math.max(this.top,E.top),D=Math.min(this.right,E.right),A=Math.min(this.bottom,E.bottom),B=Math.max(this.left,E.left);if(A>=C&&D>=B){return new YAHOO.util.Region(C,D,A,B);
}else{return null;}};YAHOO.util.Region.prototype.union=function(E){var C=Math.min(this.top,E.top),D=Math.max(this.right,E.right),A=Math.max(this.bottom,E.bottom),B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+", height: "+this.height+", width: "+this.width+"}");};YAHOO.util.Region.getRegion=function(D){var F=YAHOO.util.Dom.getXY(D),C=F[1],E=F[0]+D.offsetWidth,A=F[1]+D.offsetHeight,B=F[0];return new YAHOO.util.Region(C,E,A,B);};YAHOO.util.Point=function(A,B){if(YAHOO.lang.isArray(A)){B=A[1];A=A[0];}YAHOO.util.Point.superclass.constructor.call(this,B,A,B,A);};YAHOO.extend(YAHOO.util.Point,YAHOO.util.Region);(function(){var B=YAHOO.util,A="clientTop",F="clientLeft",J="parentNode",K="right",W="hasLayout",I="px",U="opacity",L="auto",D="borderLeftWidth",G="borderTopWidth",P="borderRightWidth",V="borderBottomWidth",S="visible",Q="transparent",N="height",E="width",H="style",T="currentStyle",R=/^width|height$/,O=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,M={get:function(X,Z){var Y="",a=X[T][Z];if(Z===U){Y=B.Dom.getStyle(X,U);}else{if(!a||(a.indexOf&&a.indexOf(I)>-1)){Y=a;}else{if(B.Dom.IE_COMPUTED[Z]){Y=B.Dom.IE_COMPUTED[Z](X,Z);}else{if(O.test(a)){Y=B.Dom.IE.ComputedStyle.getPixel(X,Z);}else{Y=a;}}}}return Y;},getOffset:function(Z,e){var b=Z[T][e],X=e.charAt(0).toUpperCase()+e.substr(1),c="offset"+X,Y="pixel"+X,a="",d;if(b==L){d=Z[c];if(d===undefined){a=0;}a=d;if(R.test(e)){Z[H][e]=d;if(Z[c]>d){a=d-(Z[c]-d);}Z[H][e]=L;}}else{if(!Z[H][Y]&&!Z[H][e]){Z[H][e]=b;}a=Z[H][Y];}return a+I;},getBorderWidth:function(X,Z){var Y=null;if(!X[T][W]){X[H].zoom=1;}switch(Z){case G:Y=X[A];break;case V:Y=X.offsetHeight-X.clientHeight-X[A];break;case D:Y=X[F];break;case P:Y=X.offsetWidth-X.clientWidth-X[F];break;}return Y+I;},getPixel:function(Y,X){var a=null,b=Y[T][K],Z=Y[T][X];Y[H][K]=Z;a=Y[H].pixelRight;Y[H][K]=b;return a+I;},getMargin:function(Y,X){var Z;if(Y[T][X]==L){Z=0+I;}else{Z=B.Dom.IE.ComputedStyle.getPixel(Y,X);}return Z;},getVisibility:function(Y,X){var Z;while((Z=Y[T])&&Z[X]=="inherit"){Y=Y[J];}return(Z)?Z[X]:S;},getColor:function(Y,X){return B.Dom.Color.toRGB(Y[T][X])||Q;},getBorderColor:function(Y,X){var Z=Y[T],a=Z[X]||Z.color;return B.Dom.Color.toRGB(B.Dom.Color.toHex(a));}},C={};C.top=C.right=C.bottom=C.left=C[E]=C[N]=M.getOffset;C.color=M.getColor;C[G]=C[P]=C[V]=C[D]=M.getBorderWidth;C.marginTop=C.marginRight=C.marginBottom=C.marginLeft=M.getMargin;C.visibility=M.getVisibility;C.borderColor=C.borderTopColor=C.borderRightColor=C.borderBottomColor=C.borderLeftColor=M.getBorderColor;B.Dom.IE_COMPUTED=C;B.Dom.IE_ComputedStyle=M;})();(function(){var C="toString",A=parseInt,B=RegExp,D=YAHOO.util;D.Dom.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(E){if(!D.Dom.Color.re_RGB.test(E)){E=D.Dom.Color.toHex(E);}if(D.Dom.Color.re_hex.exec(E)){E="rgb("+[A(B.$1,16),A(B.$2,16),A(B.$3,16)].join(", ")+")";}return E;},toHex:function(H){H=D.Dom.Color.KEYWORDS[H]||H;if(D.Dom.Color.re_RGB.exec(H)){var G=(B.$1.length===1)?"0"+B.$1:Number(B.$1),F=(B.$2.length===1)?"0"+B.$2:Number(B.$2),E=(B.$3.length===1)?"0"+B.$3:Number(B.$3);H=[G[C](16),F[C](16),E[C](16)].join("");}if(H.length<6){H=H.replace(D.Dom.Color.re_hex3,"$1$1");}if(H!=="transparent"&&H.indexOf("#")<0){H="#"+H;}return H.toLowerCase();}};}());YAHOO.register("dom",YAHOO.util.Dom,{version:"2.7.0",build:"1799"});YAHOO.util.CustomEvent=function(D,C,B,A){this.type=D;this.scope=C||window;this.silent=B;this.signature=A||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}var E="_YUICEOnSubscribe";if(D!==E){this.subscribeEvent=new YAHOO.util.CustomEvent(E,this,true);}this.lastError=null;};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(A,B,C){if(!A){throw new Error("Invalid callback for subscriber to '"+this.type+"'");}if(this.subscribeEvent){this.subscribeEvent.fire(A,B,C);}this.subscribers.push(new YAHOO.util.Subscriber(A,B,C));},unsubscribe:function(D,F){if(!D){return this.unsubscribeAll();}var E=false;for(var B=0,A=this.subscribers.length;B<A;++B){var C=this.subscribers[B];if(C&&C.contains(D,F)){this._delete(B);E=true;}}return E;},fire:function(){this.lastError=null;var K=[],E=this.subscribers.length;if(!E&&this.silent){return true;}var I=[].slice.call(arguments,0),G=true,D,J=false;if(!this.silent){}var C=this.subscribers.slice(),A=YAHOO.util.Event.throwErrors;for(D=0;D<E;++D){var M=C[D];if(!M){J=true;}else{if(!this.silent){}var L=M.getScope(this.scope);if(this.signature==YAHOO.util.CustomEvent.FLAT){var B=null;if(I.length>0){B=I[0];}try{G=M.fn.call(L,B,M.obj);}catch(F){this.lastError=F;if(A){throw F;}}}else{try{G=M.fn.call(L,this.type,I,M.obj);}catch(H){this.lastError=H;if(A){throw H;}}}if(false===G){if(!this.silent){}break;}}}return(G!==false);},unsubscribeAll:function(){var A=this.subscribers.length,B;for(B=A-1;B>-1;B--){this._delete(B);}this.subscribers=[];return A;},_delete:function(A){var B=this.subscribers[A];if(B){delete B.fn;delete B.obj;}this.subscribers.splice(A,1);},toString:function(){return"CustomEvent: "+"'"+this.type+"', "+"context: "+this.scope;}};YAHOO.util.Subscriber=function(A,B,C){this.fn=A;this.obj=YAHOO.lang.isUndefined(B)?null:B;this.overrideContext=C;};YAHOO.util.Subscriber.prototype.getScope=function(A){if(this.overrideContext){if(this.overrideContext===true){return this.obj;}else{return this.overrideContext;}}return A;};YAHOO.util.Subscriber.prototype.contains=function(A,B){if(B){return(this.fn==A&&this.obj==B);}else{return(this.fn==A);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+this.obj+", overrideContext: "+(this.overrideContext||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var H=false;var I=[];var J=[];var G=[];var E=[];var C=0;var F=[];var B=[];var A=0;var D={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9};var K=YAHOO.env.ua.ie?"focusin":"focus";var L=YAHOO.env.ua.ie?"focusout":"blur";return{POLL_RETRYS:2000,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,UNLOAD_OBJ:3,ADJ_SCOPE:4,OBJ:5,OVERRIDE:6,lastError:null,isSafari:YAHOO.env.ua.webkit,webkit:YAHOO.env.ua.webkit,isIE:YAHOO.env.ua.ie,_interval:null,_dri:null,DOMReady:false,throwErrors:false,startInterval:function(){if(!this._interval){var M=this;var N=function(){M._tryPreloadAttach();};this._interval=setInterval(N,this.POLL_INTERVAL);}},onAvailable:function(S,O,Q,R,P){var M=(YAHOO.lang.isString(S))?[S]:S;for(var N=0;N<M.length;N=N+1){F.push({id:M[N],fn:O,obj:Q,overrideContext:R,checkReady:P});}C=this.POLL_RETRYS;this.startInterval();},onContentReady:function(P,M,N,O){this.onAvailable(P,M,N,O,true);},onDOMReady:function(M,N,O){if(this.DOMReady){setTimeout(function(){var P=window;if(O){if(O===true){P=N;}else{P=O;}}M.call(P,"DOMReady",[],N);},0);}else{this.DOMReadyEvent.subscribe(M,N,O);}},_addListener:function(O,M,Y,S,W,b){if(!Y||!Y.call){return false;}if(this._isValidCollection(O)){var Z=true;for(var T=0,V=O.length;T<V;++T){Z=this.on(O[T],M,Y,S,W)&&Z;}return Z;}else{if(YAHOO.lang.isString(O)){var R=this.getEl(O);if(R){O=R;}else{this.onAvailable(O,function(){YAHOO.util.Event.on(O,M,Y,S,W);});return true;}}}if(!O){return false;}if("unload"==M&&S!==this){J[J.length]=[O,M,Y,S,W];return true;}var N=O;if(W){if(W===true){N=S;}else{N=W;}}var P=function(c){return Y.call(N,YAHOO.util.Event.getEvent(c,O),S);};var a=[O,M,Y,P,N,S,W];var U=I.length;I[U]=a;if(this.useLegacyEvent(O,M)){var Q=this.getLegacyIndex(O,M);if(Q==-1||O!=G[Q][0]){Q=G.length;B[O.id+M]=Q;G[Q]=[O,M,O["on"+M]];E[Q]=[];O["on"+M]=function(c){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(c),Q);};}E[Q].push(a);}else{try{this._simpleAdd(O,M,P,b);}catch(X){this.lastError=X;this.removeListener(O,M,Y);return false;}}return true;},addListener:function(N,Q,M,O,P){return this._addListener(N,Q,M,O,P,false);},addFocusListener:function(N,M,O,P){return this._addListener(N,K,M,O,P,true);},removeFocusListener:function(N,M){return this.removeListener(N,K,M);},addBlurListener:function(N,M,O,P){return this._addListener(N,L,M,O,P,true);},removeBlurListener:function(N,M){return this.removeListener(N,L,M);},fireLegacyEvent:function(R,P){var T=true,M,V,U,N,S;V=E[P].slice();for(var O=0,Q=V.length;O<Q;++O){U=V[O];if(U&&U[this.WFN]){N=U[this.ADJ_SCOPE];S=U[this.WFN].call(N,R);T=(T&&S);}}M=G[P];if(M&&M[2]){M[2](R);}return T;},getLegacyIndex:function(N,O){var M=this.generateId(N)+O;if(typeof B[M]=="undefined"){return -1;}else{return B[M];}},useLegacyEvent:function(M,N){return(this.webkit&&this.webkit<419&&("click"==N||"dblclick"==N));},removeListener:function(N,M,V){var Q,T,X;if(typeof N=="string"){N=this.getEl(N);}else{if(this._isValidCollection(N)){var W=true;for(Q=N.length-1;Q>-1;Q--){W=(this.removeListener(N[Q],M,V)&&W);}return W;}}if(!V||!V.call){return this.purgeElement(N,false,M);}if("unload"==M){for(Q=J.length-1;Q>-1;Q--){X=J[Q];if(X&&X[0]==N&&X[1]==M&&X[2]==V){J.splice(Q,1);return true;}}return false;}var R=null;var S=arguments[3];if("undefined"===typeof S){S=this._getCacheIndex(N,M,V);}if(S>=0){R=I[S];}if(!N||!R){return false;}if(this.useLegacyEvent(N,M)){var P=this.getLegacyIndex(N,M);var O=E[P];if(O){for(Q=0,T=O.length;Q<T;++Q){X=O[Q];if(X&&X[this.EL]==N&&X[this.TYPE]==M&&X[this.FN]==V){O.splice(Q,1);break;}}}}else{try{this._simpleRemove(N,M,R[this.WFN],false);}catch(U){this.lastError=U;return false;}}delete I[S][this.WFN];delete I[S][this.FN];
I.splice(S,1);return true;},getTarget:function(O,N){var M=O.target||O.srcElement;return this.resolveTextNode(M);},resolveTextNode:function(N){try{if(N&&3==N.nodeType){return N.parentNode;}}catch(M){}return N;},getPageX:function(N){var M=N.pageX;if(!M&&0!==M){M=N.clientX||0;if(this.isIE){M+=this._getScrollLeft();}}return M;},getPageY:function(M){var N=M.pageY;if(!N&&0!==N){N=M.clientY||0;if(this.isIE){N+=this._getScrollTop();}}return N;},getXY:function(M){return[this.getPageX(M),this.getPageY(M)];},getRelatedTarget:function(N){var M=N.relatedTarget;if(!M){if(N.type=="mouseout"){M=N.toElement;}else{if(N.type=="mouseover"){M=N.fromElement;}}}return this.resolveTextNode(M);},getTime:function(O){if(!O.time){var N=new Date().getTime();try{O.time=N;}catch(M){this.lastError=M;return N;}}return O.time;},stopEvent:function(M){this.stopPropagation(M);this.preventDefault(M);},stopPropagation:function(M){if(M.stopPropagation){M.stopPropagation();}else{M.cancelBubble=true;}},preventDefault:function(M){if(M.preventDefault){M.preventDefault();}else{M.returnValue=false;}},getEvent:function(O,M){var N=O||window.event;if(!N){var P=this.getEvent.caller;while(P){N=P.arguments[0];if(N&&Event==N.constructor){break;}P=P.caller;}}return N;},getCharCode:function(N){var M=N.keyCode||N.charCode||0;if(YAHOO.env.ua.webkit&&(M in D)){M=D[M];}return M;},_getCacheIndex:function(Q,R,P){for(var O=0,N=I.length;O<N;O=O+1){var M=I[O];if(M&&M[this.FN]==P&&M[this.EL]==Q&&M[this.TYPE]==R){return O;}}return -1;},generateId:function(M){var N=M.id;if(!N){N="yuievtautoid-"+A;++A;M.id=N;}return N;},_isValidCollection:function(N){try{return(N&&typeof N!=="string"&&N.length&&!N.tagName&&!N.alert&&typeof N[0]!=="undefined");}catch(M){return false;}},elCache:{},getEl:function(M){return(typeof M==="string")?document.getElementById(M):M;},clearCache:function(){},DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady",this),_load:function(N){if(!H){H=true;var M=YAHOO.util.Event;M._ready();M._tryPreloadAttach();}},_ready:function(N){var M=YAHOO.util.Event;if(!M.DOMReady){M.DOMReady=true;M.DOMReadyEvent.fire();M._simpleRemove(document,"DOMContentLoaded",M._ready);}},_tryPreloadAttach:function(){if(F.length===0){C=0;if(this._interval){clearInterval(this._interval);this._interval=null;}return;}if(this.locked){return;}if(this.isIE){if(!this.DOMReady){this.startInterval();return;}}this.locked=true;var S=!H;if(!S){S=(C>0&&F.length>0);}var R=[];var T=function(V,W){var U=V;if(W.overrideContext){if(W.overrideContext===true){U=W.obj;}else{U=W.overrideContext;}}W.fn.call(U,W.obj);};var N,M,Q,P,O=[];for(N=0,M=F.length;N<M;N=N+1){Q=F[N];if(Q){P=this.getEl(Q.id);if(P){if(Q.checkReady){if(H||P.nextSibling||!S){O.push(Q);F[N]=null;}}else{T(P,Q);F[N]=null;}}else{R.push(Q);}}}for(N=0,M=O.length;N<M;N=N+1){Q=O[N];T(this.getEl(Q.id),Q);}C--;if(S){for(N=F.length-1;N>-1;N--){Q=F[N];if(!Q||!Q.id){F.splice(N,1);}}this.startInterval();}else{if(this._interval){clearInterval(this._interval);this._interval=null;}}this.locked=false;},purgeElement:function(Q,R,T){var O=(YAHOO.lang.isString(Q))?this.getEl(Q):Q;var S=this.getListeners(O,T),P,M;if(S){for(P=S.length-1;P>-1;P--){var N=S[P];this.removeListener(O,N.type,N.fn);}}if(R&&O&&O.childNodes){for(P=0,M=O.childNodes.length;P<M;++P){this.purgeElement(O.childNodes[P],R,T);}}},getListeners:function(O,M){var R=[],N;if(!M){N=[I,J];}else{if(M==="unload"){N=[J];}else{N=[I];}}var T=(YAHOO.lang.isString(O))?this.getEl(O):O;for(var Q=0;Q<N.length;Q=Q+1){var V=N[Q];if(V){for(var S=0,U=V.length;S<U;++S){var P=V[S];if(P&&P[this.EL]===T&&(!M||M===P[this.TYPE])){R.push({type:P[this.TYPE],fn:P[this.FN],obj:P[this.OBJ],adjust:P[this.OVERRIDE],scope:P[this.ADJ_SCOPE],index:S});}}}}return(R.length)?R:null;},_unload:function(T){var N=YAHOO.util.Event,Q,P,O,S,R,U=J.slice(),M;for(Q=0,S=J.length;Q<S;++Q){O=U[Q];if(O){M=window;if(O[N.ADJ_SCOPE]){if(O[N.ADJ_SCOPE]===true){M=O[N.UNLOAD_OBJ];}else{M=O[N.ADJ_SCOPE];}}O[N.FN].call(M,N.getEvent(T,O[N.EL]),O[N.UNLOAD_OBJ]);U[Q]=null;}}O=null;M=null;J=null;if(I){for(P=I.length-1;P>-1;P--){O=I[P];if(O){N.removeListener(O[N.EL],O[N.TYPE],O[N.FN],P);}}O=null;}G=null;N._simpleRemove(window,"unload",N._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var M=document.documentElement,N=document.body;if(M&&(M.scrollTop||M.scrollLeft)){return[M.scrollTop,M.scrollLeft];}else{if(N){return[N.scrollTop,N.scrollLeft];}else{return[0,0];}}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(O,P,N,M){O.addEventListener(P,N,(M));};}else{if(window.attachEvent){return function(O,P,N,M){O.attachEvent("on"+P,N);};}else{return function(){};}}}(),_simpleRemove:function(){if(window.removeEventListener){return function(O,P,N,M){O.removeEventListener(P,N,(M));};}else{if(window.detachEvent){return function(N,O,M){N.detachEvent("on"+O,M);};}else{return function(){};}}}()};}();(function(){var EU=YAHOO.util.Event;EU.on=EU.addListener;EU.onFocus=EU.addFocusListener;EU.onBlur=EU.addBlurListener;
/* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */
if(EU.isIE){YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);var n=document.createElement("p");EU._dri=setInterval(function(){try{n.doScroll("left");clearInterval(EU._dri);EU._dri=null;EU._ready();n=null;}catch(ex){}},EU.POLL_INTERVAL);}else{if(EU.webkit&&EU.webkit<525){EU._dri=setInterval(function(){var rs=document.readyState;if("loaded"==rs||"complete"==rs){clearInterval(EU._dri);EU._dri=null;EU._ready();}},EU.POLL_INTERVAL);}else{EU._simpleAdd(document,"DOMContentLoaded",EU._ready);}}EU._simpleAdd(window,"load",EU._load);EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();})();}YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(A,C,F,E){this.__yui_events=this.__yui_events||{};var D=this.__yui_events[A];if(D){D.subscribe(C,F,E);
}else{this.__yui_subscribers=this.__yui_subscribers||{};var B=this.__yui_subscribers;if(!B[A]){B[A]=[];}B[A].push({fn:C,obj:F,overrideContext:E});}},unsubscribe:function(C,E,G){this.__yui_events=this.__yui_events||{};var A=this.__yui_events;if(C){var F=A[C];if(F){return F.unsubscribe(E,G);}}else{var B=true;for(var D in A){if(YAHOO.lang.hasOwnProperty(A,D)){B=B&&A[D].unsubscribe(E,G);}}return B;}return false;},unsubscribeAll:function(A){return this.unsubscribe(A);},createEvent:function(G,D){this.__yui_events=this.__yui_events||{};var A=D||{};var I=this.__yui_events;if(I[G]){}else{var H=A.scope||this;var E=(A.silent);var B=new YAHOO.util.CustomEvent(G,H,E,YAHOO.util.CustomEvent.FLAT);I[G]=B;if(A.onSubscribeCallback){B.subscribeEvent.subscribe(A.onSubscribeCallback);}this.__yui_subscribers=this.__yui_subscribers||{};var F=this.__yui_subscribers[G];if(F){for(var C=0;C<F.length;++C){B.subscribe(F[C].fn,F[C].obj,F[C].overrideContext);}}}return I[G];},fireEvent:function(E,D,A,C){this.__yui_events=this.__yui_events||{};var G=this.__yui_events[E];if(!G){return null;}var B=[];for(var F=1;F<arguments.length;++F){B.push(arguments[F]);}return G.fire.apply(G,B);},hasEvent:function(A){if(this.__yui_events){if(this.__yui_events[A]){return true;}}return false;}};(function(){var A=YAHOO.util.Event,C=YAHOO.lang;YAHOO.util.KeyListener=function(D,I,E,F){if(!D){}else{if(!I){}else{if(!E){}}}if(!F){F=YAHOO.util.KeyListener.KEYDOWN;}var G=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(C.isString(D)){D=document.getElementById(D);}if(C.isFunction(E)){G.subscribe(E);}else{G.subscribe(E.fn,E.scope,E.correctScope);}function H(O,N){if(!I.shift){I.shift=false;}if(!I.alt){I.alt=false;}if(!I.ctrl){I.ctrl=false;}if(O.shiftKey==I.shift&&O.altKey==I.alt&&O.ctrlKey==I.ctrl){var J,M=I.keys,L;if(YAHOO.lang.isArray(M)){for(var K=0;K<M.length;K++){J=M[K];L=A.getCharCode(O);if(J==L){G.fire(L,O);break;}}}else{L=A.getCharCode(O);if(M==L){G.fire(L,O);}}}}this.enable=function(){if(!this.enabled){A.on(D,F,H);this.enabledEvent.fire(I);}this.enabled=true;};this.disable=function(){if(this.enabled){A.removeListener(D,F,H);this.disabledEvent.fire(I);}this.enabled=false;};this.toString=function(){return"KeyListener ["+I.keys+"] "+D.tagName+(D.id?"["+D.id+"]":"");};};var B=YAHOO.util.KeyListener;B.KEYDOWN="keydown";B.KEYUP="keyup";B.KEY={ALT:18,BACK_SPACE:8,CAPS_LOCK:20,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,META:224,NUM_LOCK:144,PAGE_DOWN:34,PAGE_UP:33,PAUSE:19,PRINTSCREEN:44,RIGHT:39,SCROLL_LOCK:145,SHIFT:16,SPACE:32,TAB:9,UP:38};})();YAHOO.register("event",YAHOO.util.Event,{version:"2.7.0",build:"1799"});YAHOO.register("yahoo-dom-event", YAHOO, {version: "2.7.0", build: "1799"});

/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){YAHOO.env._id_counter=YAHOO.env._id_counter||0;var E=YAHOO.util,L=YAHOO.lang,m=YAHOO.env.ua,A=YAHOO.lang.trim,d={},h={},N=/^t(?:able|d|h)$/i,X=/color$/i,K=window.document,W=K.documentElement,e="ownerDocument",n="defaultView",v="documentElement",t="compatMode",b="offsetLeft",P="offsetTop",u="offsetParent",Z="parentNode",l="nodeType",C="tagName",O="scrollLeft",i="scrollTop",Q="getBoundingClientRect",w="getComputedStyle",a="currentStyle",M="CSS1Compat",c="BackCompat",g="class",F="className",J="",B=" ",s="(?:^|\\s)",k="(?= |$)",U="g",p="position",f="fixed",V="relative",j="left",o="top",r="medium",q="borderLeftWidth",R="borderTopWidth",D=m.opera,I=m.webkit,H=m.gecko,T=m.ie;E.Dom={CUSTOM_ATTRIBUTES:(!W.hasAttribute)?{"for":"htmlFor","class":F}:{"htmlFor":"for","className":g},get:function(y){var AA,Y,z,x,G;if(y){if(y[l]||y.item){return y;}if(typeof y==="string"){AA=y;y=K.getElementById(y);if(y&&y.id===AA){return y;}else{if(y&&K.all){y=null;Y=K.all[AA];for(x=0,G=Y.length;x<G;++x){if(Y[x].id===AA){return Y[x];}}}}return y;}if(y.DOM_EVENTS){y=y.get("element");}if("length" in y){z=[];for(x=0,G=y.length;x<G;++x){z[z.length]=E.Dom.get(y[x]);}return z;}return y;}return null;},getComputedStyle:function(G,Y){if(window[w]){return G[e][n][w](G,null)[Y];}else{if(G[a]){return E.Dom.IE_ComputedStyle.get(G,Y);}}},getStyle:function(G,Y){return E.Dom.batch(G,E.Dom._getStyle,Y);},_getStyle:function(){if(window[w]){return function(G,y){y=(y==="float")?y="cssFloat":E.Dom._toCamel(y);var x=G.style[y],Y;if(!x){Y=G[e][n][w](G,null);if(Y){x=Y[y];}}return x;};}else{if(W[a]){return function(G,y){var x;switch(y){case"opacity":x=100;try{x=G.filters["DXImageTransform.Microsoft.Alpha"].opacity;}catch(z){try{x=G.filters("alpha").opacity;}catch(Y){}}return x/100;case"float":y="styleFloat";default:y=E.Dom._toCamel(y);x=G[a]?G[a][y]:null;return(G.style[y]||x);}};}}}(),setStyle:function(G,Y,x){E.Dom.batch(G,E.Dom._setStyle,{prop:Y,val:x});},_setStyle:function(){if(T){return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){switch(x){case"opacity":if(L.isString(Y.style.filter)){Y.style.filter="alpha(opacity="+y*100+")";if(!Y[a]||!Y[a].hasLayout){Y.style.zoom=1;}}break;case"float":x="styleFloat";default:Y.style[x]=y;}}else{}};}else{return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){if(x=="float"){x="cssFloat";}Y.style[x]=y;}else{}};}}(),getXY:function(G){return E.Dom.batch(G,E.Dom._getXY);},_canPosition:function(G){return(E.Dom._getStyle(G,"display")!=="none"&&E.Dom._inDoc(G));},_getXY:function(){if(K[v][Q]){return function(y){var z,Y,AA,AF,AE,AD,AC,G,x,AB=Math.floor,AG=false;if(E.Dom._canPosition(y)){AA=y[Q]();AF=y[e];z=E.Dom.getDocumentScrollLeft(AF);Y=E.Dom.getDocumentScrollTop(AF);AG=[AB(AA[j]),AB(AA[o])];if(T&&m.ie<8){AE=2;AD=2;AC=AF[t];G=S(AF[v],q);x=S(AF[v],R);if(m.ie===6){if(AC!==c){AE=0;AD=0;}}if((AC==c)){if(G!==r){AE=parseInt(G,10);}if(x!==r){AD=parseInt(x,10);}}AG[0]-=AE;AG[1]-=AD;}if((Y||z)){AG[0]+=z;AG[1]+=Y;}AG[0]=AB(AG[0]);AG[1]=AB(AG[1]);}else{}return AG;};}else{return function(y){var x,Y,AA,AB,AC,z=false,G=y;if(E.Dom._canPosition(y)){z=[y[b],y[P]];x=E.Dom.getDocumentScrollLeft(y[e]);Y=E.Dom.getDocumentScrollTop(y[e]);AC=((H||m.webkit>519)?true:false);while((G=G[u])){z[0]+=G[b];z[1]+=G[P];if(AC){z=E.Dom._calcBorders(G,z);}}if(E.Dom._getStyle(y,p)!==f){G=y;while((G=G[Z])&&G[C]){AA=G[i];AB=G[O];if(H&&(E.Dom._getStyle(G,"overflow")!=="visible")){z=E.Dom._calcBorders(G,z);}if(AA||AB){z[0]-=AB;z[1]-=AA;}}z[0]+=x;z[1]+=Y;}else{if(D){z[0]-=x;z[1]-=Y;}else{if(I||H){z[0]+=x;z[1]+=Y;}}}z[0]=Math.floor(z[0]);z[1]=Math.floor(z[1]);}else{}return z;};}}(),getX:function(G){var Y=function(x){return E.Dom.getXY(x)[0];};return E.Dom.batch(G,Y,E.Dom,true);},getY:function(G){var Y=function(x){return E.Dom.getXY(x)[1];};return E.Dom.batch(G,Y,E.Dom,true);},setXY:function(G,x,Y){E.Dom.batch(G,E.Dom._setXY,{pos:x,noRetry:Y});},_setXY:function(G,z){var AA=E.Dom._getStyle(G,p),y=E.Dom.setStyle,AD=z.pos,Y=z.noRetry,AB=[parseInt(E.Dom.getComputedStyle(G,j),10),parseInt(E.Dom.getComputedStyle(G,o),10)],AC,x;if(AA=="static"){AA=V;y(G,p,AA);}AC=E.Dom._getXY(G);if(!AD||AC===false){return false;}if(isNaN(AB[0])){AB[0]=(AA==V)?0:G[b];}if(isNaN(AB[1])){AB[1]=(AA==V)?0:G[P];}if(AD[0]!==null){y(G,j,AD[0]-AC[0]+AB[0]+"px");}if(AD[1]!==null){y(G,o,AD[1]-AC[1]+AB[1]+"px");}if(!Y){x=E.Dom._getXY(G);if((AD[0]!==null&&x[0]!=AD[0])||(AD[1]!==null&&x[1]!=AD[1])){E.Dom._setXY(G,{pos:AD,noRetry:true});}}},setX:function(Y,G){E.Dom.setXY(Y,[G,null]);},setY:function(G,Y){E.Dom.setXY(G,[null,Y]);},getRegion:function(G){var Y=function(x){var y=false;if(E.Dom._canPosition(x)){y=E.Region.getRegion(x);}else{}return y;};return E.Dom.batch(G,Y,E.Dom,true);},getClientWidth:function(){return E.Dom.getViewportWidth();},getClientHeight:function(){return E.Dom.getViewportHeight();},getElementsByClassName:function(AB,AF,AC,AE,x,AD){AB=L.trim(AB);AF=AF||"*";AC=(AC)?E.Dom.get(AC):null||K;if(!AC){return[];}var Y=[],G=AC.getElementsByTagName(AF),z=E.Dom.hasClass;for(var y=0,AA=G.length;y<AA;++y){if(z(G[y],AB)){Y[Y.length]=G[y];}}if(AE){E.Dom.batch(Y,AE,x,AD);}return Y;},hasClass:function(Y,G){return E.Dom.batch(Y,E.Dom._hasClass,G);},_hasClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(Y.exec){G=Y.test(y);}else{G=Y&&(B+y+B).indexOf(B+Y+B)>-1;}}else{}return G;},addClass:function(Y,G){return E.Dom.batch(Y,E.Dom._addClass,G);},_addClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(!E.Dom._hasClass(x,Y)){E.Dom.setAttribute(x,F,A(y+B+Y));G=true;}}else{}return G;},removeClass:function(Y,G){return E.Dom.batch(Y,E.Dom._removeClass,G);},_removeClass:function(y,x){var Y=false,AA,z,G;if(y&&x){AA=E.Dom.getAttribute(y,F)||J;E.Dom.setAttribute(y,F,AA.replace(E.Dom._getClassRegex(x),J));z=E.Dom.getAttribute(y,F);if(AA!==z){E.Dom.setAttribute(y,F,A(z));Y=true;if(E.Dom.getAttribute(y,F)===""){G=(y.hasAttribute&&y.hasAttribute(g))?g:F;y.removeAttribute(G);}}}else{}return Y;},replaceClass:function(x,Y,G){return E.Dom.batch(x,E.Dom._replaceClass,{from:Y,to:G});
},_replaceClass:function(y,x){var Y,AB,AA,G=false,z;if(y&&x){AB=x.from;AA=x.to;if(!AA){G=false;}else{if(!AB){G=E.Dom._addClass(y,x.to);}else{if(AB!==AA){z=E.Dom.getAttribute(y,F)||J;Y=(B+z.replace(E.Dom._getClassRegex(AB),B+AA)).split(E.Dom._getClassRegex(AA));Y.splice(1,0,B+AA);E.Dom.setAttribute(y,F,A(Y.join(J)));G=true;}}}}else{}return G;},generateId:function(G,x){x=x||"yui-gen";var Y=function(y){if(y&&y.id){return y.id;}var z=x+YAHOO.env._id_counter++;if(y){if(y[e].getElementById(z)){return E.Dom.generateId(y,z+x);}y.id=z;}return z;};return E.Dom.batch(G,Y,E.Dom,true)||Y.apply(E.Dom,arguments);},isAncestor:function(Y,x){Y=E.Dom.get(Y);x=E.Dom.get(x);var G=false;if((Y&&x)&&(Y[l]&&x[l])){if(Y.contains&&Y!==x){G=Y.contains(x);}else{if(Y.compareDocumentPosition){G=!!(Y.compareDocumentPosition(x)&16);}}}else{}return G;},inDocument:function(G,Y){return E.Dom._inDoc(E.Dom.get(G),Y);},_inDoc:function(Y,x){var G=false;if(Y&&Y[C]){x=x||Y[e];G=E.Dom.isAncestor(x[v],Y);}else{}return G;},getElementsBy:function(Y,AF,AB,AD,y,AC,AE){AF=AF||"*";AB=(AB)?E.Dom.get(AB):null||K;if(!AB){return[];}var x=[],G=AB.getElementsByTagName(AF);for(var z=0,AA=G.length;z<AA;++z){if(Y(G[z])){if(AE){x=G[z];break;}else{x[x.length]=G[z];}}}if(AD){E.Dom.batch(x,AD,y,AC);}return x;},getElementBy:function(x,G,Y){return E.Dom.getElementsBy(x,G,Y,null,null,null,true);},batch:function(x,AB,AA,z){var y=[],Y=(z)?AA:window;x=(x&&(x[C]||x.item))?x:E.Dom.get(x);if(x&&AB){if(x[C]||x.length===undefined){return AB.call(Y,x,AA);}for(var G=0;G<x.length;++G){y[y.length]=AB.call(Y,x[G],AA);}}else{return false;}return y;},getDocumentHeight:function(){var Y=(K[t]!=M||I)?K.body.scrollHeight:W.scrollHeight,G=Math.max(Y,E.Dom.getViewportHeight());return G;},getDocumentWidth:function(){var Y=(K[t]!=M||I)?K.body.scrollWidth:W.scrollWidth,G=Math.max(Y,E.Dom.getViewportWidth());return G;},getViewportHeight:function(){var G=self.innerHeight,Y=K[t];if((Y||T)&&!D){G=(Y==M)?W.clientHeight:K.body.clientHeight;}return G;},getViewportWidth:function(){var G=self.innerWidth,Y=K[t];if(Y||T){G=(Y==M)?W.clientWidth:K.body.clientWidth;}return G;},getAncestorBy:function(G,Y){while((G=G[Z])){if(E.Dom._testElement(G,Y)){return G;}}return null;},getAncestorByClassName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return E.Dom.hasClass(y,G);};return E.Dom.getAncestorBy(Y,x);},getAncestorByTagName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return y[C]&&y[C].toUpperCase()==G.toUpperCase();};return E.Dom.getAncestorBy(Y,x);},getPreviousSiblingBy:function(G,Y){while(G){G=G.previousSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getPreviousSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getPreviousSiblingBy(G);},getNextSiblingBy:function(G,Y){while(G){G=G.nextSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getNextSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getNextSiblingBy(G);},getFirstChildBy:function(G,x){var Y=(E.Dom._testElement(G.firstChild,x))?G.firstChild:null;return Y||E.Dom.getNextSiblingBy(G.firstChild,x);},getFirstChild:function(G,Y){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getFirstChildBy(G);},getLastChildBy:function(G,x){if(!G){return null;}var Y=(E.Dom._testElement(G.lastChild,x))?G.lastChild:null;return Y||E.Dom.getPreviousSiblingBy(G.lastChild,x);},getLastChild:function(G){G=E.Dom.get(G);return E.Dom.getLastChildBy(G);},getChildrenBy:function(Y,y){var x=E.Dom.getFirstChildBy(Y,y),G=x?[x]:[];E.Dom.getNextSiblingBy(x,function(z){if(!y||y(z)){G[G.length]=z;}return false;});return G;},getChildren:function(G){G=E.Dom.get(G);if(!G){}return E.Dom.getChildrenBy(G);},getDocumentScrollLeft:function(G){G=G||K;return Math.max(G[v].scrollLeft,G.body.scrollLeft);},getDocumentScrollTop:function(G){G=G||K;return Math.max(G[v].scrollTop,G.body.scrollTop);},insertBefore:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}return G[Z].insertBefore(Y,G);},insertAfter:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}if(G.nextSibling){return G[Z].insertBefore(Y,G.nextSibling);}else{return G[Z].appendChild(Y);}},getClientRegion:function(){var x=E.Dom.getDocumentScrollTop(),Y=E.Dom.getDocumentScrollLeft(),y=E.Dom.getViewportWidth()+Y,G=E.Dom.getViewportHeight()+x;return new E.Region(x,y,G,Y);},setAttribute:function(Y,G,x){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;Y.setAttribute(G,x);},getAttribute:function(Y,G){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;return Y.getAttribute(G);},_toCamel:function(Y){var x=d;function G(y,z){return z.toUpperCase();}return x[Y]||(x[Y]=Y.indexOf("-")===-1?Y:Y.replace(/-([a-z])/gi,G));},_getClassRegex:function(Y){var G;if(Y!==undefined){if(Y.exec){G=Y;}else{G=h[Y];if(!G){Y=Y.replace(E.Dom._patterns.CLASS_RE_TOKENS,"\\$1");G=h[Y]=new RegExp(s+Y+k,U);}}}return G;},_patterns:{ROOT_TAG:/^body|html$/i,CLASS_RE_TOKENS:/([\.\(\)\^\$\*\+\?\|\[\]\{\}])/g},_testElement:function(G,Y){return G&&G[l]==1&&(!Y||Y(G));},_calcBorders:function(x,y){var Y=parseInt(E.Dom[w](x,R),10)||0,G=parseInt(E.Dom[w](x,q),10)||0;if(H){if(N.test(x[C])){Y=0;G=0;}}y[0]+=G;y[1]+=Y;return y;}};var S=E.Dom[w];if(m.opera){E.Dom[w]=function(Y,G){var x=S(Y,G);if(X.test(G)){x=E.Dom.Color.toRGB(x);}return x;};}if(m.webkit){E.Dom[w]=function(Y,G){var x=S(Y,G);if(x==="rgba(0, 0, 0, 0)"){x="transparent";}return x;};}})();YAHOO.util.Region=function(C,D,A,B){this.top=C;this.y=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this.x=B;this[0]=B;this.width=this.right-this.left;this.height=this.bottom-this.top;};YAHOO.util.Region.prototype.contains=function(A){return(A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(E){var C=Math.max(this.top,E.top),D=Math.min(this.right,E.right),A=Math.min(this.bottom,E.bottom),B=Math.max(this.left,E.left);if(A>=C&&D>=B){return new YAHOO.util.Region(C,D,A,B);
}else{return null;}};YAHOO.util.Region.prototype.union=function(E){var C=Math.min(this.top,E.top),D=Math.max(this.right,E.right),A=Math.max(this.bottom,E.bottom),B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+", height: "+this.height+", width: "+this.width+"}");};YAHOO.util.Region.getRegion=function(D){var F=YAHOO.util.Dom.getXY(D),C=F[1],E=F[0]+D.offsetWidth,A=F[1]+D.offsetHeight,B=F[0];return new YAHOO.util.Region(C,E,A,B);};YAHOO.util.Point=function(A,B){if(YAHOO.lang.isArray(A)){B=A[1];A=A[0];}YAHOO.util.Point.superclass.constructor.call(this,B,A,B,A);};YAHOO.extend(YAHOO.util.Point,YAHOO.util.Region);(function(){var B=YAHOO.util,A="clientTop",F="clientLeft",J="parentNode",K="right",W="hasLayout",I="px",U="opacity",L="auto",D="borderLeftWidth",G="borderTopWidth",P="borderRightWidth",V="borderBottomWidth",S="visible",Q="transparent",N="height",E="width",H="style",T="currentStyle",R=/^width|height$/,O=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,M={get:function(X,Z){var Y="",a=X[T][Z];if(Z===U){Y=B.Dom.getStyle(X,U);}else{if(!a||(a.indexOf&&a.indexOf(I)>-1)){Y=a;}else{if(B.Dom.IE_COMPUTED[Z]){Y=B.Dom.IE_COMPUTED[Z](X,Z);}else{if(O.test(a)){Y=B.Dom.IE.ComputedStyle.getPixel(X,Z);}else{Y=a;}}}}return Y;},getOffset:function(Z,e){var b=Z[T][e],X=e.charAt(0).toUpperCase()+e.substr(1),c="offset"+X,Y="pixel"+X,a="",d;if(b==L){d=Z[c];if(d===undefined){a=0;}a=d;if(R.test(e)){Z[H][e]=d;if(Z[c]>d){a=d-(Z[c]-d);}Z[H][e]=L;}}else{if(!Z[H][Y]&&!Z[H][e]){Z[H][e]=b;}a=Z[H][Y];}return a+I;},getBorderWidth:function(X,Z){var Y=null;if(!X[T][W]){X[H].zoom=1;}switch(Z){case G:Y=X[A];break;case V:Y=X.offsetHeight-X.clientHeight-X[A];break;case D:Y=X[F];break;case P:Y=X.offsetWidth-X.clientWidth-X[F];break;}return Y+I;},getPixel:function(Y,X){var a=null,b=Y[T][K],Z=Y[T][X];Y[H][K]=Z;a=Y[H].pixelRight;Y[H][K]=b;return a+I;},getMargin:function(Y,X){var Z;if(Y[T][X]==L){Z=0+I;}else{Z=B.Dom.IE.ComputedStyle.getPixel(Y,X);}return Z;},getVisibility:function(Y,X){var Z;while((Z=Y[T])&&Z[X]=="inherit"){Y=Y[J];}return(Z)?Z[X]:S;},getColor:function(Y,X){return B.Dom.Color.toRGB(Y[T][X])||Q;},getBorderColor:function(Y,X){var Z=Y[T],a=Z[X]||Z.color;return B.Dom.Color.toRGB(B.Dom.Color.toHex(a));}},C={};C.top=C.right=C.bottom=C.left=C[E]=C[N]=M.getOffset;C.color=M.getColor;C[G]=C[P]=C[V]=C[D]=M.getBorderWidth;C.marginTop=C.marginRight=C.marginBottom=C.marginLeft=M.getMargin;C.visibility=M.getVisibility;C.borderColor=C.borderTopColor=C.borderRightColor=C.borderBottomColor=C.borderLeftColor=M.getBorderColor;B.Dom.IE_COMPUTED=C;B.Dom.IE_ComputedStyle=M;})();(function(){var C="toString",A=parseInt,B=RegExp,D=YAHOO.util;D.Dom.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(E){if(!D.Dom.Color.re_RGB.test(E)){E=D.Dom.Color.toHex(E);}if(D.Dom.Color.re_hex.exec(E)){E="rgb("+[A(B.$1,16),A(B.$2,16),A(B.$3,16)].join(", ")+")";}return E;},toHex:function(H){H=D.Dom.Color.KEYWORDS[H]||H;if(D.Dom.Color.re_RGB.exec(H)){var G=(B.$1.length===1)?"0"+B.$1:Number(B.$1),F=(B.$2.length===1)?"0"+B.$2:Number(B.$2),E=(B.$3.length===1)?"0"+B.$3:Number(B.$3);H=[G[C](16),F[C](16),E[C](16)].join("");}if(H.length<6){H=H.replace(D.Dom.Color.re_hex3,"$1$1");}if(H!=="transparent"&&H.indexOf("#")<0){H="#"+H;}return H.toLowerCase();}};}());YAHOO.register("dom",YAHOO.util.Dom,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){YAHOO.util.Config=function(D){if(D){this.init(D);}};var B=YAHOO.lang,C=YAHOO.util.CustomEvent,A=YAHOO.util.Config;A.CONFIG_CHANGED_EVENT="configChanged";A.BOOLEAN_TYPE="boolean";A.prototype={owner:null,queueInProgress:false,config:null,initialConfig:null,eventQueue:null,configChangedEvent:null,init:function(D){this.owner=D;this.configChangedEvent=this.createEvent(A.CONFIG_CHANGED_EVENT);this.configChangedEvent.signature=C.LIST;this.queueInProgress=false;this.config={};this.initialConfig={};this.eventQueue=[];},checkBoolean:function(D){return(typeof D==A.BOOLEAN_TYPE);},checkNumber:function(D){return(!isNaN(D));},fireEvent:function(D,F){var E=this.config[D];if(E&&E.event){E.event.fire(F);}},addProperty:function(E,D){E=E.toLowerCase();this.config[E]=D;D.event=this.createEvent(E,{scope:this.owner});D.event.signature=C.LIST;D.key=E;if(D.handler){D.event.subscribe(D.handler,this.owner);}this.setProperty(E,D.value,true);if(!D.suppressEvent){this.queueProperty(E,D.value);}},getConfig:function(){var D={},F=this.config,G,E;for(G in F){if(B.hasOwnProperty(F,G)){E=F[G];if(E&&E.event){D[G]=E.value;}}}return D;},getProperty:function(D){var E=this.config[D.toLowerCase()];if(E&&E.event){return E.value;}else{return undefined;}},resetProperty:function(D){D=D.toLowerCase();var E=this.config[D];if(E&&E.event){if(this.initialConfig[D]&&!B.isUndefined(this.initialConfig[D])){this.setProperty(D,this.initialConfig[D]);return true;}}else{return false;}},setProperty:function(E,G,D){var F;E=E.toLowerCase();if(this.queueInProgress&&!D){this.queueProperty(E,G);return true;}else{F=this.config[E];if(F&&F.event){if(F.validator&&!F.validator(G)){return false;}else{F.value=G;if(!D){this.fireEvent(E,G);this.configChangedEvent.fire([E,G]);}return true;}}else{return false;}}},queueProperty:function(S,P){S=S.toLowerCase();var R=this.config[S],K=false,J,G,H,I,O,Q,F,M,N,D,L,T,E;if(R&&R.event){if(!B.isUndefined(P)&&R.validator&&!R.validator(P)){return false;}else{if(!B.isUndefined(P)){R.value=P;}else{P=R.value;}K=false;J=this.eventQueue.length;for(L=0;L<J;L++){G=this.eventQueue[L];if(G){H=G[0];I=G[1];if(H==S){this.eventQueue[L]=null;this.eventQueue.push([S,(!B.isUndefined(P)?P:I)]);K=true;break;}}}if(!K&&!B.isUndefined(P)){this.eventQueue.push([S,P]);}}if(R.supercedes){O=R.supercedes.length;for(T=0;T<O;T++){Q=R.supercedes[T];F=this.eventQueue.length;for(E=0;E<F;E++){M=this.eventQueue[E];if(M){N=M[0];D=M[1];if(N==Q.toLowerCase()){this.eventQueue.push([N,D]);this.eventQueue[E]=null;break;}}}}}return true;}else{return false;}},refireEvent:function(D){D=D.toLowerCase();var E=this.config[D];if(E&&E.event&&!B.isUndefined(E.value)){if(this.queueInProgress){this.queueProperty(D);}else{this.fireEvent(D,E.value);}}},applyConfig:function(D,G){var F,E;if(G){E={};for(F in D){if(B.hasOwnProperty(D,F)){E[F.toLowerCase()]=D[F];}}this.initialConfig=E;}for(F in D){if(B.hasOwnProperty(D,F)){this.queueProperty(F,D[F]);}}},refresh:function(){var D;for(D in this.config){if(B.hasOwnProperty(this.config,D)){this.refireEvent(D);}}},fireQueue:function(){var E,H,D,G,F;this.queueInProgress=true;for(E=0;E<this.eventQueue.length;E++){H=this.eventQueue[E];if(H){D=H[0];G=H[1];F=this.config[D];F.value=G;this.eventQueue[E]=null;this.fireEvent(D,G);}}this.queueInProgress=false;this.eventQueue=[];},subscribeToConfigEvent:function(E,F,H,D){var G=this.config[E.toLowerCase()];if(G&&G.event){if(!A.alreadySubscribed(G.event,F,H)){G.event.subscribe(F,H,D);}return true;}else{return false;}},unsubscribeFromConfigEvent:function(D,E,G){var F=this.config[D.toLowerCase()];if(F&&F.event){return F.event.unsubscribe(E,G);}else{return false;}},toString:function(){var D="Config";if(this.owner){D+=" ["+this.owner.toString()+"]";}return D;},outputEventQueue:function(){var D="",G,E,F=this.eventQueue.length;for(E=0;E<F;E++){G=this.eventQueue[E];if(G){D+=G[0]+"="+G[1]+", ";}}return D;},destroy:function(){var E=this.config,D,F;for(D in E){if(B.hasOwnProperty(E,D)){F=E[D];F.event.unsubscribeAll();F.event=null;}}this.configChangedEvent.unsubscribeAll();this.configChangedEvent=null;this.owner=null;this.config=null;this.initialConfig=null;this.eventQueue=null;}};A.alreadySubscribed=function(E,H,I){var F=E.subscribers.length,D,G;if(F>0){G=F-1;do{D=E.subscribers[G];if(D&&D.obj==I&&D.fn==H){return true;}}while(G--);}return false;};YAHOO.lang.augmentProto(A,YAHOO.util.EventProvider);}());(function(){YAHOO.widget.Module=function(R,Q){if(R){this.init(R,Q);}else{}};var F=YAHOO.util.Dom,D=YAHOO.util.Config,N=YAHOO.util.Event,M=YAHOO.util.CustomEvent,G=YAHOO.widget.Module,I=YAHOO.env.ua,H,P,O,E,A={"BEFORE_INIT":"beforeInit","INIT":"init","APPEND":"append","BEFORE_RENDER":"beforeRender","RENDER":"render","CHANGE_HEADER":"changeHeader","CHANGE_BODY":"changeBody","CHANGE_FOOTER":"changeFooter","CHANGE_CONTENT":"changeContent","DESTORY":"destroy","BEFORE_SHOW":"beforeShow","SHOW":"show","BEFORE_HIDE":"beforeHide","HIDE":"hide"},J={"VISIBLE":{key:"visible",value:true,validator:YAHOO.lang.isBoolean},"EFFECT":{key:"effect",suppressEvent:true,supercedes:["visible"]},"MONITOR_RESIZE":{key:"monitorresize",value:true},"APPEND_TO_DOCUMENT_BODY":{key:"appendtodocumentbody",value:false}};G.IMG_ROOT=null;G.IMG_ROOT_SSL=null;G.CSS_MODULE="yui-module";G.CSS_HEADER="hd";G.CSS_BODY="bd";G.CSS_FOOTER="ft";G.RESIZE_MONITOR_SECURE_URL="javascript:false;";G.RESIZE_MONITOR_BUFFER=1;G.textResizeEvent=new M("textResize");G.forceDocumentRedraw=function(){var Q=document.documentElement;if(Q){Q.className+=" ";Q.className=YAHOO.lang.trim(Q.className);}};function L(){if(!H){H=document.createElement("div");H.innerHTML=('<div class="'+G.CSS_HEADER+'"></div>'+'<div class="'+G.CSS_BODY+'"></div><div class="'+G.CSS_FOOTER+'"></div>');P=H.firstChild;O=P.nextSibling;E=O.nextSibling;}return H;}function K(){if(!P){L();}return(P.cloneNode(false));}function B(){if(!O){L();}return(O.cloneNode(false));}function C(){if(!E){L();}return(E.cloneNode(false));}G.prototype={constructor:G,element:null,header:null,body:null,footer:null,id:null,imageRoot:G.IMG_ROOT,initEvents:function(){var Q=M.LIST;
this.beforeInitEvent=this.createEvent(A.BEFORE_INIT);this.beforeInitEvent.signature=Q;this.initEvent=this.createEvent(A.INIT);this.initEvent.signature=Q;this.appendEvent=this.createEvent(A.APPEND);this.appendEvent.signature=Q;this.beforeRenderEvent=this.createEvent(A.BEFORE_RENDER);this.beforeRenderEvent.signature=Q;this.renderEvent=this.createEvent(A.RENDER);this.renderEvent.signature=Q;this.changeHeaderEvent=this.createEvent(A.CHANGE_HEADER);this.changeHeaderEvent.signature=Q;this.changeBodyEvent=this.createEvent(A.CHANGE_BODY);this.changeBodyEvent.signature=Q;this.changeFooterEvent=this.createEvent(A.CHANGE_FOOTER);this.changeFooterEvent.signature=Q;this.changeContentEvent=this.createEvent(A.CHANGE_CONTENT);this.changeContentEvent.signature=Q;this.destroyEvent=this.createEvent(A.DESTORY);this.destroyEvent.signature=Q;this.beforeShowEvent=this.createEvent(A.BEFORE_SHOW);this.beforeShowEvent.signature=Q;this.showEvent=this.createEvent(A.SHOW);this.showEvent.signature=Q;this.beforeHideEvent=this.createEvent(A.BEFORE_HIDE);this.beforeHideEvent.signature=Q;this.hideEvent=this.createEvent(A.HIDE);this.hideEvent.signature=Q;},platform:function(){var Q=navigator.userAgent.toLowerCase();if(Q.indexOf("windows")!=-1||Q.indexOf("win32")!=-1){return"windows";}else{if(Q.indexOf("macintosh")!=-1){return"mac";}else{return false;}}}(),browser:function(){var Q=navigator.userAgent.toLowerCase();if(Q.indexOf("opera")!=-1){return"opera";}else{if(Q.indexOf("msie 7")!=-1){return"ie7";}else{if(Q.indexOf("msie")!=-1){return"ie";}else{if(Q.indexOf("safari")!=-1){return"safari";}else{if(Q.indexOf("gecko")!=-1){return"gecko";}else{return false;}}}}}}(),isSecure:function(){if(window.location.href.toLowerCase().indexOf("https")===0){return true;}else{return false;}}(),initDefaultConfig:function(){this.cfg.addProperty(J.VISIBLE.key,{handler:this.configVisible,value:J.VISIBLE.value,validator:J.VISIBLE.validator});this.cfg.addProperty(J.EFFECT.key,{suppressEvent:J.EFFECT.suppressEvent,supercedes:J.EFFECT.supercedes});this.cfg.addProperty(J.MONITOR_RESIZE.key,{handler:this.configMonitorResize,value:J.MONITOR_RESIZE.value});this.cfg.addProperty(J.APPEND_TO_DOCUMENT_BODY.key,{value:J.APPEND_TO_DOCUMENT_BODY.value});},init:function(V,U){var S,W;this.initEvents();this.beforeInitEvent.fire(G);this.cfg=new D(this);if(this.isSecure){this.imageRoot=G.IMG_ROOT_SSL;}if(typeof V=="string"){S=V;V=document.getElementById(V);if(!V){V=(L()).cloneNode(false);V.id=S;}}this.id=F.generateId(V);this.element=V;W=this.element.firstChild;if(W){var R=false,Q=false,T=false;do{if(1==W.nodeType){if(!R&&F.hasClass(W,G.CSS_HEADER)){this.header=W;R=true;}else{if(!Q&&F.hasClass(W,G.CSS_BODY)){this.body=W;Q=true;}else{if(!T&&F.hasClass(W,G.CSS_FOOTER)){this.footer=W;T=true;}}}}}while((W=W.nextSibling));}this.initDefaultConfig();F.addClass(this.element,G.CSS_MODULE);if(U){this.cfg.applyConfig(U,true);}if(!D.alreadySubscribed(this.renderEvent,this.cfg.fireQueue,this.cfg)){this.renderEvent.subscribe(this.cfg.fireQueue,this.cfg,true);}this.initEvent.fire(G);},initResizeMonitor:function(){var R=(I.gecko&&this.platform=="windows");if(R){var Q=this;setTimeout(function(){Q._initResizeMonitor();},0);}else{this._initResizeMonitor();}},_initResizeMonitor:function(){var Q,S,U;function W(){G.textResizeEvent.fire();}if(!I.opera){S=F.get("_yuiResizeMonitor");var V=this._supportsCWResize();if(!S){S=document.createElement("iframe");if(this.isSecure&&G.RESIZE_MONITOR_SECURE_URL&&I.ie){S.src=G.RESIZE_MONITOR_SECURE_URL;}if(!V){U=["<html><head><script ",'type="text/javascript">',"window.onresize=function(){window.parent.","YAHOO.widget.Module.textResizeEvent.","fire();};<","/script></head>","<body></body></html>"].join("");S.src="data:text/html;charset=utf-8,"+encodeURIComponent(U);}S.id="_yuiResizeMonitor";S.title="Text Resize Monitor";S.style.position="absolute";S.style.visibility="hidden";var R=document.body,T=R.firstChild;if(T){R.insertBefore(S,T);}else{R.appendChild(S);}S.style.width="2em";S.style.height="2em";S.style.top=(-1*(S.offsetHeight+G.RESIZE_MONITOR_BUFFER))+"px";S.style.left="0";S.style.borderWidth="0";S.style.visibility="visible";if(I.webkit){Q=S.contentWindow.document;Q.open();Q.close();}}if(S&&S.contentWindow){G.textResizeEvent.subscribe(this.onDomResize,this,true);if(!G.textResizeInitialized){if(V){if(!N.on(S.contentWindow,"resize",W)){N.on(S,"resize",W);}}G.textResizeInitialized=true;}this.resizeMonitor=S;}}},_supportsCWResize:function(){var Q=true;if(I.gecko&&I.gecko<=1.8){Q=false;}return Q;},onDomResize:function(S,R){var Q=-1*(this.resizeMonitor.offsetHeight+G.RESIZE_MONITOR_BUFFER);this.resizeMonitor.style.top=Q+"px";this.resizeMonitor.style.left="0";},setHeader:function(R){var Q=this.header||(this.header=K());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeHeaderEvent.fire(R);this.changeContentEvent.fire();},appendToHeader:function(R){var Q=this.header||(this.header=K());Q.appendChild(R);this.changeHeaderEvent.fire(R);this.changeContentEvent.fire();},setBody:function(R){var Q=this.body||(this.body=B());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeBodyEvent.fire(R);this.changeContentEvent.fire();},appendToBody:function(R){var Q=this.body||(this.body=B());Q.appendChild(R);this.changeBodyEvent.fire(R);this.changeContentEvent.fire();},setFooter:function(R){var Q=this.footer||(this.footer=C());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeFooterEvent.fire(R);this.changeContentEvent.fire();},appendToFooter:function(R){var Q=this.footer||(this.footer=C());Q.appendChild(R);this.changeFooterEvent.fire(R);this.changeContentEvent.fire();},render:function(S,Q){var T=this,U;function R(V){if(typeof V=="string"){V=document.getElementById(V);}if(V){T._addToParent(V,T.element);T.appendEvent.fire();}}this.beforeRenderEvent.fire();if(!Q){Q=this.element;}if(S){R(S);}else{if(!F.inDocument(this.element)){return false;}}if(this.header&&!F.inDocument(this.header)){U=Q.firstChild;
if(U){Q.insertBefore(this.header,U);}else{Q.appendChild(this.header);}}if(this.body&&!F.inDocument(this.body)){if(this.footer&&F.isAncestor(this.moduleElement,this.footer)){Q.insertBefore(this.body,this.footer);}else{Q.appendChild(this.body);}}if(this.footer&&!F.inDocument(this.footer)){Q.appendChild(this.footer);}this.renderEvent.fire();return true;},destroy:function(){var Q;if(this.element){N.purgeElement(this.element,true);Q=this.element.parentNode;}if(Q){Q.removeChild(this.element);}this.element=null;this.header=null;this.body=null;this.footer=null;G.textResizeEvent.unsubscribe(this.onDomResize,this);this.cfg.destroy();this.cfg=null;this.destroyEvent.fire();},show:function(){this.cfg.setProperty("visible",true);},hide:function(){this.cfg.setProperty("visible",false);},configVisible:function(R,Q,S){var T=Q[0];if(T){this.beforeShowEvent.fire();F.setStyle(this.element,"display","block");this.showEvent.fire();}else{this.beforeHideEvent.fire();F.setStyle(this.element,"display","none");this.hideEvent.fire();}},configMonitorResize:function(S,R,T){var Q=R[0];if(Q){this.initResizeMonitor();}else{G.textResizeEvent.unsubscribe(this.onDomResize,this,true);this.resizeMonitor=null;}},_addToParent:function(Q,R){if(!this.cfg.getProperty("appendtodocumentbody")&&Q===document.body&&Q.firstChild){Q.insertBefore(R,Q.firstChild);}else{Q.appendChild(R);}},toString:function(){return"Module "+this.id;}};YAHOO.lang.augmentProto(G,YAHOO.util.EventProvider);}());(function(){YAHOO.widget.Overlay=function(P,O){YAHOO.widget.Overlay.superclass.constructor.call(this,P,O);};var I=YAHOO.lang,M=YAHOO.util.CustomEvent,G=YAHOO.widget.Module,N=YAHOO.util.Event,F=YAHOO.util.Dom,D=YAHOO.util.Config,K=YAHOO.env.ua,B=YAHOO.widget.Overlay,H="subscribe",E="unsubscribe",C="contained",J,A={"BEFORE_MOVE":"beforeMove","MOVE":"move"},L={"X":{key:"x",validator:I.isNumber,suppressEvent:true,supercedes:["iframe"]},"Y":{key:"y",validator:I.isNumber,suppressEvent:true,supercedes:["iframe"]},"XY":{key:"xy",suppressEvent:true,supercedes:["iframe"]},"CONTEXT":{key:"context",suppressEvent:true,supercedes:["iframe"]},"FIXED_CENTER":{key:"fixedcenter",value:false,supercedes:["iframe","visible"]},"WIDTH":{key:"width",suppressEvent:true,supercedes:["context","fixedcenter","iframe"]},"HEIGHT":{key:"height",suppressEvent:true,supercedes:["context","fixedcenter","iframe"]},"AUTO_FILL_HEIGHT":{key:"autofillheight",supercedes:["height"],value:"body"},"ZINDEX":{key:"zindex",value:null},"CONSTRAIN_TO_VIEWPORT":{key:"constraintoviewport",value:false,validator:I.isBoolean,supercedes:["iframe","x","y","xy"]},"IFRAME":{key:"iframe",value:(K.ie==6?true:false),validator:I.isBoolean,supercedes:["zindex"]},"PREVENT_CONTEXT_OVERLAP":{key:"preventcontextoverlap",value:false,validator:I.isBoolean,supercedes:["constraintoviewport"]}};B.IFRAME_SRC="javascript:false;";B.IFRAME_OFFSET=3;B.VIEWPORT_OFFSET=10;B.TOP_LEFT="tl";B.TOP_RIGHT="tr";B.BOTTOM_LEFT="bl";B.BOTTOM_RIGHT="br";B.CSS_OVERLAY="yui-overlay";B.STD_MOD_RE=/^\s*?(body|footer|header)\s*?$/i;B.windowScrollEvent=new M("windowScroll");B.windowResizeEvent=new M("windowResize");B.windowScrollHandler=function(P){var O=N.getTarget(P);if(!O||O===window||O===window.document){if(K.ie){if(!window.scrollEnd){window.scrollEnd=-1;}clearTimeout(window.scrollEnd);window.scrollEnd=setTimeout(function(){B.windowScrollEvent.fire();},1);}else{B.windowScrollEvent.fire();}}};B.windowResizeHandler=function(O){if(K.ie){if(!window.resizeEnd){window.resizeEnd=-1;}clearTimeout(window.resizeEnd);window.resizeEnd=setTimeout(function(){B.windowResizeEvent.fire();},100);}else{B.windowResizeEvent.fire();}};B._initialized=null;if(B._initialized===null){N.on(window,"scroll",B.windowScrollHandler);N.on(window,"resize",B.windowResizeHandler);B._initialized=true;}B._TRIGGER_MAP={"windowScroll":B.windowScrollEvent,"windowResize":B.windowResizeEvent,"textResize":G.textResizeEvent};YAHOO.extend(B,G,{CONTEXT_TRIGGERS:[],init:function(P,O){B.superclass.init.call(this,P);this.beforeInitEvent.fire(B);F.addClass(this.element,B.CSS_OVERLAY);if(O){this.cfg.applyConfig(O,true);}if(this.platform=="mac"&&K.gecko){if(!D.alreadySubscribed(this.showEvent,this.showMacGeckoScrollbars,this)){this.showEvent.subscribe(this.showMacGeckoScrollbars,this,true);}if(!D.alreadySubscribed(this.hideEvent,this.hideMacGeckoScrollbars,this)){this.hideEvent.subscribe(this.hideMacGeckoScrollbars,this,true);}}this.initEvent.fire(B);},initEvents:function(){B.superclass.initEvents.call(this);var O=M.LIST;this.beforeMoveEvent=this.createEvent(A.BEFORE_MOVE);this.beforeMoveEvent.signature=O;this.moveEvent=this.createEvent(A.MOVE);this.moveEvent.signature=O;},initDefaultConfig:function(){B.superclass.initDefaultConfig.call(this);var O=this.cfg;O.addProperty(L.X.key,{handler:this.configX,validator:L.X.validator,suppressEvent:L.X.suppressEvent,supercedes:L.X.supercedes});O.addProperty(L.Y.key,{handler:this.configY,validator:L.Y.validator,suppressEvent:L.Y.suppressEvent,supercedes:L.Y.supercedes});O.addProperty(L.XY.key,{handler:this.configXY,suppressEvent:L.XY.suppressEvent,supercedes:L.XY.supercedes});O.addProperty(L.CONTEXT.key,{handler:this.configContext,suppressEvent:L.CONTEXT.suppressEvent,supercedes:L.CONTEXT.supercedes});O.addProperty(L.FIXED_CENTER.key,{handler:this.configFixedCenter,value:L.FIXED_CENTER.value,validator:L.FIXED_CENTER.validator,supercedes:L.FIXED_CENTER.supercedes});O.addProperty(L.WIDTH.key,{handler:this.configWidth,suppressEvent:L.WIDTH.suppressEvent,supercedes:L.WIDTH.supercedes});O.addProperty(L.HEIGHT.key,{handler:this.configHeight,suppressEvent:L.HEIGHT.suppressEvent,supercedes:L.HEIGHT.supercedes});O.addProperty(L.AUTO_FILL_HEIGHT.key,{handler:this.configAutoFillHeight,value:L.AUTO_FILL_HEIGHT.value,validator:this._validateAutoFill,supercedes:L.AUTO_FILL_HEIGHT.supercedes});O.addProperty(L.ZINDEX.key,{handler:this.configzIndex,value:L.ZINDEX.value});O.addProperty(L.CONSTRAIN_TO_VIEWPORT.key,{handler:this.configConstrainToViewport,value:L.CONSTRAIN_TO_VIEWPORT.value,validator:L.CONSTRAIN_TO_VIEWPORT.validator,supercedes:L.CONSTRAIN_TO_VIEWPORT.supercedes});
O.addProperty(L.IFRAME.key,{handler:this.configIframe,value:L.IFRAME.value,validator:L.IFRAME.validator,supercedes:L.IFRAME.supercedes});O.addProperty(L.PREVENT_CONTEXT_OVERLAP.key,{value:L.PREVENT_CONTEXT_OVERLAP.value,validator:L.PREVENT_CONTEXT_OVERLAP.validator,supercedes:L.PREVENT_CONTEXT_OVERLAP.supercedes});},moveTo:function(O,P){this.cfg.setProperty("xy",[O,P]);},hideMacGeckoScrollbars:function(){F.replaceClass(this.element,"show-scrollbars","hide-scrollbars");},showMacGeckoScrollbars:function(){F.replaceClass(this.element,"hide-scrollbars","show-scrollbars");},_setDomVisibility:function(O){F.setStyle(this.element,"visibility",(O)?"visible":"hidden");if(O){F.removeClass(this.element,"yui-overlay-hidden");}else{F.addClass(this.element,"yui-overlay-hidden");}},configVisible:function(R,O,X){var Q=O[0],S=F.getStyle(this.element,"visibility"),Y=this.cfg.getProperty("effect"),V=[],U=(this.platform=="mac"&&K.gecko),g=D.alreadySubscribed,W,P,f,c,b,a,d,Z,T;if(S=="inherit"){f=this.element.parentNode;while(f.nodeType!=9&&f.nodeType!=11){S=F.getStyle(f,"visibility");if(S!="inherit"){break;}f=f.parentNode;}if(S=="inherit"){S="visible";}}if(Y){if(Y instanceof Array){Z=Y.length;for(c=0;c<Z;c++){W=Y[c];V[V.length]=W.effect(this,W.duration);}}else{V[V.length]=Y.effect(this,Y.duration);}}if(Q){if(U){this.showMacGeckoScrollbars();}if(Y){if(Q){if(S!="visible"||S===""){this.beforeShowEvent.fire();T=V.length;for(b=0;b<T;b++){P=V[b];if(b===0&&!g(P.animateInCompleteEvent,this.showEvent.fire,this.showEvent)){P.animateInCompleteEvent.subscribe(this.showEvent.fire,this.showEvent,true);}P.animateIn();}}}}else{if(S!="visible"||S===""){this.beforeShowEvent.fire();this._setDomVisibility(true);this.cfg.refireEvent("iframe");this.showEvent.fire();}else{this._setDomVisibility(true);}}}else{if(U){this.hideMacGeckoScrollbars();}if(Y){if(S=="visible"){this.beforeHideEvent.fire();T=V.length;for(a=0;a<T;a++){d=V[a];if(a===0&&!g(d.animateOutCompleteEvent,this.hideEvent.fire,this.hideEvent)){d.animateOutCompleteEvent.subscribe(this.hideEvent.fire,this.hideEvent,true);}d.animateOut();}}else{if(S===""){this._setDomVisibility(false);}}}else{if(S=="visible"||S===""){this.beforeHideEvent.fire();this._setDomVisibility(false);this.hideEvent.fire();}else{this._setDomVisibility(false);}}}},doCenterOnDOMEvent:function(){var O=this.cfg,P=O.getProperty("fixedcenter");if(O.getProperty("visible")){if(P&&(P!==C||this.fitsInViewport())){this.center();}}},fitsInViewport:function(){var S=B.VIEWPORT_OFFSET,Q=this.element,T=Q.offsetWidth,R=Q.offsetHeight,O=F.getViewportWidth(),P=F.getViewportHeight();return((T+S<O)&&(R+S<P));},configFixedCenter:function(S,Q,T){var U=Q[0],P=D.alreadySubscribed,R=B.windowResizeEvent,O=B.windowScrollEvent;if(U){this.center();if(!P(this.beforeShowEvent,this.center)){this.beforeShowEvent.subscribe(this.center);}if(!P(R,this.doCenterOnDOMEvent,this)){R.subscribe(this.doCenterOnDOMEvent,this,true);}if(!P(O,this.doCenterOnDOMEvent,this)){O.subscribe(this.doCenterOnDOMEvent,this,true);}}else{this.beforeShowEvent.unsubscribe(this.center);R.unsubscribe(this.doCenterOnDOMEvent,this);O.unsubscribe(this.doCenterOnDOMEvent,this);}},configHeight:function(R,P,S){var O=P[0],Q=this.element;F.setStyle(Q,"height",O);this.cfg.refireEvent("iframe");},configAutoFillHeight:function(T,S,P){var V=S[0],Q=this.cfg,U="autofillheight",W="height",R=Q.getProperty(U),O=this._autoFillOnHeightChange;Q.unsubscribeFromConfigEvent(W,O);G.textResizeEvent.unsubscribe(O);this.changeContentEvent.unsubscribe(O);if(R&&V!==R&&this[R]){F.setStyle(this[R],W,"");}if(V){V=I.trim(V.toLowerCase());Q.subscribeToConfigEvent(W,O,this[V],this);G.textResizeEvent.subscribe(O,this[V],this);this.changeContentEvent.subscribe(O,this[V],this);Q.setProperty(U,V,true);}},configWidth:function(R,O,S){var Q=O[0],P=this.element;F.setStyle(P,"width",Q);this.cfg.refireEvent("iframe");},configzIndex:function(Q,O,R){var S=O[0],P=this.element;if(!S){S=F.getStyle(P,"zIndex");if(!S||isNaN(S)){S=0;}}if(this.iframe||this.cfg.getProperty("iframe")===true){if(S<=0){S=1;}}F.setStyle(P,"zIndex",S);this.cfg.setProperty("zIndex",S,true);if(this.iframe){this.stackIframe();}},configXY:function(Q,P,R){var T=P[0],O=T[0],S=T[1];this.cfg.setProperty("x",O);this.cfg.setProperty("y",S);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},configX:function(Q,P,R){var O=P[0],S=this.cfg.getProperty("y");this.cfg.setProperty("x",O,true);this.cfg.setProperty("y",S,true);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");F.setX(this.element,O,true);this.cfg.setProperty("xy",[O,S],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},configY:function(Q,P,R){var O=this.cfg.getProperty("x"),S=P[0];this.cfg.setProperty("x",O,true);this.cfg.setProperty("y",S,true);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");F.setY(this.element,S,true);this.cfg.setProperty("xy",[O,S],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},showIframe:function(){var P=this.iframe,O;if(P){O=this.element.parentNode;if(O!=P.parentNode){this._addToParent(O,P);}P.style.display="block";}},hideIframe:function(){if(this.iframe){this.iframe.style.display="none";}},syncIframe:function(){var O=this.iframe,Q=this.element,S=B.IFRAME_OFFSET,P=(S*2),R;if(O){O.style.width=(Q.offsetWidth+P+"px");O.style.height=(Q.offsetHeight+P+"px");R=this.cfg.getProperty("xy");if(!I.isArray(R)||(isNaN(R[0])||isNaN(R[1]))){this.syncPosition();R=this.cfg.getProperty("xy");}F.setXY(O,[(R[0]-S),(R[1]-S)]);}},stackIframe:function(){if(this.iframe){var O=F.getStyle(this.element,"zIndex");if(!YAHOO.lang.isUndefined(O)&&!isNaN(O)){F.setStyle(this.iframe,"zIndex",(O-1));}}},configIframe:function(R,Q,S){var O=Q[0];function T(){var V=this.iframe,W=this.element,X;if(!V){if(!J){J=document.createElement("iframe");if(this.isSecure){J.src=B.IFRAME_SRC;}if(K.ie){J.style.filter="alpha(opacity=0)";
J.frameBorder=0;}else{J.style.opacity="0";}J.style.position="absolute";J.style.border="none";J.style.margin="0";J.style.padding="0";J.style.display="none";J.tabIndex=-1;}V=J.cloneNode(false);X=W.parentNode;var U=X||document.body;this._addToParent(U,V);this.iframe=V;}this.showIframe();this.syncIframe();this.stackIframe();if(!this._hasIframeEventListeners){this.showEvent.subscribe(this.showIframe);this.hideEvent.subscribe(this.hideIframe);this.changeContentEvent.subscribe(this.syncIframe);this._hasIframeEventListeners=true;}}function P(){T.call(this);this.beforeShowEvent.unsubscribe(P);this._iframeDeferred=false;}if(O){if(this.cfg.getProperty("visible")){T.call(this);}else{if(!this._iframeDeferred){this.beforeShowEvent.subscribe(P);this._iframeDeferred=true;}}}else{this.hideIframe();if(this._hasIframeEventListeners){this.showEvent.unsubscribe(this.showIframe);this.hideEvent.unsubscribe(this.hideIframe);this.changeContentEvent.unsubscribe(this.syncIframe);this._hasIframeEventListeners=false;}}},_primeXYFromDOM:function(){if(YAHOO.lang.isUndefined(this.cfg.getProperty("xy"))){this.syncPosition();this.cfg.refireEvent("xy");this.beforeShowEvent.unsubscribe(this._primeXYFromDOM);}},configConstrainToViewport:function(P,O,Q){var R=O[0];if(R){if(!D.alreadySubscribed(this.beforeMoveEvent,this.enforceConstraints,this)){this.beforeMoveEvent.subscribe(this.enforceConstraints,this,true);}if(!D.alreadySubscribed(this.beforeShowEvent,this._primeXYFromDOM)){this.beforeShowEvent.subscribe(this._primeXYFromDOM);}}else{this.beforeShowEvent.unsubscribe(this._primeXYFromDOM);this.beforeMoveEvent.unsubscribe(this.enforceConstraints,this);}},configContext:function(T,S,P){var W=S[0],Q,O,U,R,V=this.CONTEXT_TRIGGERS;if(W){Q=W[0];O=W[1];U=W[2];R=W[3];if(V&&V.length>0){R=(R||[]).concat(V);}if(Q){if(typeof Q=="string"){this.cfg.setProperty("context",[document.getElementById(Q),O,U,R],true);}if(O&&U){this.align(O,U);}if(this._contextTriggers){this._processTriggers(this._contextTriggers,E,this._alignOnTrigger);}if(R){this._processTriggers(R,H,this._alignOnTrigger);this._contextTriggers=R;}}}},_alignOnTrigger:function(P,O){this.align();},_findTriggerCE:function(O){var P=null;if(O instanceof M){P=O;}else{if(B._TRIGGER_MAP[O]){P=B._TRIGGER_MAP[O];}}return P;},_processTriggers:function(S,U,R){var Q,T;for(var P=0,O=S.length;P<O;++P){Q=S[P];T=this._findTriggerCE(Q);if(T){T[U](R,this,true);}else{this[U](Q,R);}}},align:function(P,O){var U=this.cfg.getProperty("context"),T=this,S,R,V;function Q(W,X){switch(P){case B.TOP_LEFT:T.moveTo(X,W);break;case B.TOP_RIGHT:T.moveTo((X-R.offsetWidth),W);break;case B.BOTTOM_LEFT:T.moveTo(X,(W-R.offsetHeight));break;case B.BOTTOM_RIGHT:T.moveTo((X-R.offsetWidth),(W-R.offsetHeight));break;}}if(U){S=U[0];R=this.element;T=this;if(!P){P=U[1];}if(!O){O=U[2];}if(R&&S){V=F.getRegion(S);switch(O){case B.TOP_LEFT:Q(V.top,V.left);break;case B.TOP_RIGHT:Q(V.top,V.right);break;case B.BOTTOM_LEFT:Q(V.bottom,V.left);break;case B.BOTTOM_RIGHT:Q(V.bottom,V.right);break;}}}},enforceConstraints:function(P,O,Q){var S=O[0];var R=this.getConstrainedXY(S[0],S[1]);this.cfg.setProperty("x",R[0],true);this.cfg.setProperty("y",R[1],true);this.cfg.setProperty("xy",R,true);},getConstrainedX:function(V){var S=this,O=S.element,e=O.offsetWidth,c=B.VIEWPORT_OFFSET,h=F.getViewportWidth(),d=F.getDocumentScrollLeft(),Y=(e+c<h),b=this.cfg.getProperty("context"),Q,X,j,T=false,f,W,g=d+c,P=d+h-e-c,i=V,U={"tltr":true,"blbr":true,"brbl":true,"trtl":true};var Z=function(){var k;if((S.cfg.getProperty("x")-d)>X){k=(X-e);}else{k=(X+j);}S.cfg.setProperty("x",(k+d),true);return k;};var R=function(){if((S.cfg.getProperty("x")-d)>X){return(W-c);}else{return(f-c);}};var a=function(){var k=R(),l;if(e>k){if(T){Z();}else{Z();T=true;l=a();}}return l;};if(V<g||V>P){if(Y){if(this.cfg.getProperty("preventcontextoverlap")&&b&&U[(b[1]+b[2])]){Q=b[0];X=F.getX(Q)-d;j=Q.offsetWidth;f=X;W=(h-(X+j));a();i=this.cfg.getProperty("x");}else{if(V<g){i=g;}else{if(V>P){i=P;}}}}else{i=c+d;}}return i;},getConstrainedY:function(Z){var W=this,P=W.element,i=P.offsetHeight,h=B.VIEWPORT_OFFSET,d=F.getViewportHeight(),g=F.getDocumentScrollTop(),e=(i+h<d),f=this.cfg.getProperty("context"),U,a,b,X=false,V,Q,c=g+h,S=g+d-i-h,O=Z,Y={"trbr":true,"tlbl":true,"bltl":true,"brtr":true};var T=function(){var k;if((W.cfg.getProperty("y")-g)>a){k=(a-i);}else{k=(a+b);}W.cfg.setProperty("y",(k+g),true);return k;};var R=function(){if((W.cfg.getProperty("y")-g)>a){return(Q-h);}else{return(V-h);}};var j=function(){var l=R(),k;if(i>l){if(X){T();}else{T();X=true;k=j();}}return k;};if(Z<c||Z>S){if(e){if(this.cfg.getProperty("preventcontextoverlap")&&f&&Y[(f[1]+f[2])]){U=f[0];b=U.offsetHeight;a=(F.getY(U)-g);V=a;Q=(d-(a+b));j();O=W.cfg.getProperty("y");}else{if(Z<c){O=c;}else{if(Z>S){O=S;}}}}else{O=h+g;}}return O;},getConstrainedXY:function(O,P){return[this.getConstrainedX(O),this.getConstrainedY(P)];},center:function(){var R=B.VIEWPORT_OFFSET,S=this.element.offsetWidth,Q=this.element.offsetHeight,P=F.getViewportWidth(),T=F.getViewportHeight(),O,U;if(S<P){O=(P/2)-(S/2)+F.getDocumentScrollLeft();}else{O=R+F.getDocumentScrollLeft();}if(Q<T){U=(T/2)-(Q/2)+F.getDocumentScrollTop();}else{U=R+F.getDocumentScrollTop();}this.cfg.setProperty("xy",[parseInt(O,10),parseInt(U,10)]);this.cfg.refireEvent("iframe");if(K.webkit){this.forceContainerRedraw();}},syncPosition:function(){var O=F.getXY(this.element);this.cfg.setProperty("x",O[0],true);this.cfg.setProperty("y",O[1],true);this.cfg.setProperty("xy",O,true);},onDomResize:function(Q,P){var O=this;B.superclass.onDomResize.call(this,Q,P);setTimeout(function(){O.syncPosition();O.cfg.refireEvent("iframe");O.cfg.refireEvent("context");},0);},_getComputedHeight:(function(){if(document.defaultView&&document.defaultView.getComputedStyle){return function(P){var O=null;if(P.ownerDocument&&P.ownerDocument.defaultView){var Q=P.ownerDocument.defaultView.getComputedStyle(P,"");if(Q){O=parseInt(Q.height,10);}}return(I.isNumber(O))?O:null;};}else{return function(P){var O=null;
if(P.style.pixelHeight){O=P.style.pixelHeight;}return(I.isNumber(O))?O:null;};}})(),_validateAutoFillHeight:function(O){return(!O)||(I.isString(O)&&B.STD_MOD_RE.test(O));},_autoFillOnHeightChange:function(R,P,Q){var O=this.cfg.getProperty("height");if((O&&O!=="auto")||(O===0)){this.fillHeight(Q);}},_getPreciseHeight:function(P){var O=P.offsetHeight;if(P.getBoundingClientRect){var Q=P.getBoundingClientRect();O=Q.bottom-Q.top;}return O;},fillHeight:function(R){if(R){var P=this.innerElement||this.element,O=[this.header,this.body,this.footer],V,W=0,X=0,T=0,Q=false;for(var U=0,S=O.length;U<S;U++){V=O[U];if(V){if(R!==V){X+=this._getPreciseHeight(V);}else{Q=true;}}}if(Q){if(K.ie||K.opera){F.setStyle(R,"height",0+"px");}W=this._getComputedHeight(P);if(W===null){F.addClass(P,"yui-override-padding");W=P.clientHeight;F.removeClass(P,"yui-override-padding");}T=Math.max(W-X,0);F.setStyle(R,"height",T+"px");if(R.offsetHeight!=T){T=Math.max(T-(R.offsetHeight-T),0);}F.setStyle(R,"height",T+"px");}}},bringToTop:function(){var S=[],R=this.element;function V(Z,Y){var b=F.getStyle(Z,"zIndex"),a=F.getStyle(Y,"zIndex"),X=(!b||isNaN(b))?0:parseInt(b,10),W=(!a||isNaN(a))?0:parseInt(a,10);if(X>W){return -1;}else{if(X<W){return 1;}else{return 0;}}}function Q(Y){var X=F.hasClass(Y,B.CSS_OVERLAY),W=YAHOO.widget.Panel;if(X&&!F.isAncestor(R,Y)){if(W&&F.hasClass(Y,W.CSS_PANEL)){S[S.length]=Y.parentNode;}else{S[S.length]=Y;}}}F.getElementsBy(Q,"DIV",document.body);S.sort(V);var O=S[0],U;if(O){U=F.getStyle(O,"zIndex");if(!isNaN(U)){var T=false;if(O!=R){T=true;}else{if(S.length>1){var P=F.getStyle(S[1],"zIndex");if(!isNaN(P)&&(U==P)){T=true;}}}if(T){this.cfg.setProperty("zindex",(parseInt(U,10)+2));}}}},destroy:function(){if(this.iframe){this.iframe.parentNode.removeChild(this.iframe);}this.iframe=null;B.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent,this);B.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent,this);G.textResizeEvent.unsubscribe(this._autoFillOnHeightChange);B.superclass.destroy.call(this);},forceContainerRedraw:function(){var O=this;F.addClass(O.element,"yui-force-redraw");setTimeout(function(){F.removeClass(O.element,"yui-force-redraw");},0);},toString:function(){return"Overlay "+this.id;}});}());(function(){YAHOO.widget.OverlayManager=function(G){this.init(G);};var D=YAHOO.widget.Overlay,C=YAHOO.util.Event,E=YAHOO.util.Dom,B=YAHOO.util.Config,F=YAHOO.util.CustomEvent,A=YAHOO.widget.OverlayManager;A.CSS_FOCUSED="focused";A.prototype={constructor:A,overlays:null,initDefaultConfig:function(){this.cfg.addProperty("overlays",{suppressEvent:true});this.cfg.addProperty("focusevent",{value:"mousedown"});},init:function(I){this.cfg=new B(this);this.initDefaultConfig();if(I){this.cfg.applyConfig(I,true);}this.cfg.fireQueue();var H=null;this.getActive=function(){return H;};this.focus=function(J){var K=this.find(J);if(K){K.focus();}};this.remove=function(K){var M=this.find(K),J;if(M){if(H==M){H=null;}var L=(M.element===null&&M.cfg===null)?true:false;if(!L){J=E.getStyle(M.element,"zIndex");M.cfg.setProperty("zIndex",-1000,true);}this.overlays.sort(this.compareZIndexDesc);this.overlays=this.overlays.slice(0,(this.overlays.length-1));M.hideEvent.unsubscribe(M.blur);M.destroyEvent.unsubscribe(this._onOverlayDestroy,M);M.focusEvent.unsubscribe(this._onOverlayFocusHandler,M);M.blurEvent.unsubscribe(this._onOverlayBlurHandler,M);if(!L){C.removeListener(M.element,this.cfg.getProperty("focusevent"),this._onOverlayElementFocus);M.cfg.setProperty("zIndex",J,true);M.cfg.setProperty("manager",null);}if(M.focusEvent._managed){M.focusEvent=null;}if(M.blurEvent._managed){M.blurEvent=null;}if(M.focus._managed){M.focus=null;}if(M.blur._managed){M.blur=null;}}};this.blurAll=function(){var K=this.overlays.length,J;if(K>0){J=K-1;do{this.overlays[J].blur();}while(J--);}};this._manageBlur=function(J){var K=false;if(H==J){E.removeClass(H.element,A.CSS_FOCUSED);H=null;K=true;}return K;};this._manageFocus=function(J){var K=false;if(H!=J){if(H){H.blur();}H=J;this.bringToTop(H);E.addClass(H.element,A.CSS_FOCUSED);K=true;}return K;};var G=this.cfg.getProperty("overlays");if(!this.overlays){this.overlays=[];}if(G){this.register(G);this.overlays.sort(this.compareZIndexDesc);}},_onOverlayElementFocus:function(I){var G=C.getTarget(I),H=this.close;if(H&&(G==H||E.isAncestor(H,G))){this.blur();}else{this.focus();}},_onOverlayDestroy:function(H,G,I){this.remove(I);},_onOverlayFocusHandler:function(H,G,I){this._manageFocus(I);},_onOverlayBlurHandler:function(H,G,I){this._manageBlur(I);},_bindFocus:function(G){var H=this;if(!G.focusEvent){G.focusEvent=G.createEvent("focus");G.focusEvent.signature=F.LIST;G.focusEvent._managed=true;}else{G.focusEvent.subscribe(H._onOverlayFocusHandler,G,H);}if(!G.focus){C.on(G.element,H.cfg.getProperty("focusevent"),H._onOverlayElementFocus,null,G);G.focus=function(){if(H._manageFocus(this)){if(this.cfg.getProperty("visible")&&this.focusFirst){this.focusFirst();}this.focusEvent.fire();}};G.focus._managed=true;}},_bindBlur:function(G){var H=this;if(!G.blurEvent){G.blurEvent=G.createEvent("blur");G.blurEvent.signature=F.LIST;G.focusEvent._managed=true;}else{G.blurEvent.subscribe(H._onOverlayBlurHandler,G,H);}if(!G.blur){G.blur=function(){if(H._manageBlur(this)){this.blurEvent.fire();}};G.blur._managed=true;}G.hideEvent.subscribe(G.blur);},_bindDestroy:function(G){var H=this;G.destroyEvent.subscribe(H._onOverlayDestroy,G,H);},_syncZIndex:function(G){var H=E.getStyle(G.element,"zIndex");if(!isNaN(H)){G.cfg.setProperty("zIndex",parseInt(H,10));}else{G.cfg.setProperty("zIndex",0);}},register:function(G){var J=false,H,I;if(G instanceof D){G.cfg.addProperty("manager",{value:this});this._bindFocus(G);this._bindBlur(G);this._bindDestroy(G);this._syncZIndex(G);this.overlays.push(G);this.bringToTop(G);J=true;}else{if(G instanceof Array){for(H=0,I=G.length;H<I;H++){J=this.register(G[H])||J;}}}return J;},bringToTop:function(M){var I=this.find(M),L,G,J;if(I){J=this.overlays;J.sort(this.compareZIndexDesc);G=J[0];if(G){L=E.getStyle(G.element,"zIndex");
if(!isNaN(L)){var K=false;if(G!==I){K=true;}else{if(J.length>1){var H=E.getStyle(J[1].element,"zIndex");if(!isNaN(H)&&(L==H)){K=true;}}}if(K){I.cfg.setProperty("zindex",(parseInt(L,10)+2));}}J.sort(this.compareZIndexDesc);}}},find:function(G){var K=G instanceof D,I=this.overlays,M=I.length,J=null,L,H;if(K||typeof G=="string"){for(H=M-1;H>=0;H--){L=I[H];if((K&&(L===G))||(L.id==G)){J=L;break;}}}return J;},compareZIndexDesc:function(J,I){var H=(J.cfg)?J.cfg.getProperty("zIndex"):null,G=(I.cfg)?I.cfg.getProperty("zIndex"):null;if(H===null&&G===null){return 0;}else{if(H===null){return 1;}else{if(G===null){return -1;}else{if(H>G){return -1;}else{if(H<G){return 1;}else{return 0;}}}}}},showAll:function(){var H=this.overlays,I=H.length,G;for(G=I-1;G>=0;G--){H[G].show();}},hideAll:function(){var H=this.overlays,I=H.length,G;for(G=I-1;G>=0;G--){H[G].hide();}},toString:function(){return"OverlayManager";}};}());(function(){YAHOO.widget.ContainerEffect=function(E,H,G,D,F){if(!F){F=YAHOO.util.Anim;}this.overlay=E;this.attrIn=H;this.attrOut=G;this.targetElement=D||E.element;this.animClass=F;};var B=YAHOO.util.Dom,C=YAHOO.util.CustomEvent,A=YAHOO.widget.ContainerEffect;A.FADE=function(D,F){var G=YAHOO.util.Easing,I={attributes:{opacity:{from:0,to:1}},duration:F,method:G.easeIn},E={attributes:{opacity:{to:0}},duration:F,method:G.easeOut},H=new A(D,I,E,D.element);H.handleUnderlayStart=function(){var K=this.overlay.underlay;if(K&&YAHOO.env.ua.ie){var J=(K.filters&&K.filters.length>0);if(J){B.addClass(D.element,"yui-effect-fade");}}};H.handleUnderlayComplete=function(){var J=this.overlay.underlay;if(J&&YAHOO.env.ua.ie){B.removeClass(D.element,"yui-effect-fade");}};H.handleStartAnimateIn=function(K,J,L){B.addClass(L.overlay.element,"hide-select");if(!L.overlay.underlay){L.overlay.cfg.refireEvent("underlay");}L.handleUnderlayStart();L.overlay._setDomVisibility(true);B.setStyle(L.overlay.element,"opacity",0);};H.handleCompleteAnimateIn=function(K,J,L){B.removeClass(L.overlay.element,"hide-select");if(L.overlay.element.style.filter){L.overlay.element.style.filter=null;}L.handleUnderlayComplete();L.overlay.cfg.refireEvent("iframe");L.animateInCompleteEvent.fire();};H.handleStartAnimateOut=function(K,J,L){B.addClass(L.overlay.element,"hide-select");L.handleUnderlayStart();};H.handleCompleteAnimateOut=function(K,J,L){B.removeClass(L.overlay.element,"hide-select");if(L.overlay.element.style.filter){L.overlay.element.style.filter=null;}L.overlay._setDomVisibility(false);B.setStyle(L.overlay.element,"opacity",1);L.handleUnderlayComplete();L.overlay.cfg.refireEvent("iframe");L.animateOutCompleteEvent.fire();};H.init();return H;};A.SLIDE=function(F,D){var I=YAHOO.util.Easing,L=F.cfg.getProperty("x")||B.getX(F.element),K=F.cfg.getProperty("y")||B.getY(F.element),M=B.getClientWidth(),H=F.element.offsetWidth,J={attributes:{points:{to:[L,K]}},duration:D,method:I.easeIn},E={attributes:{points:{to:[(M+25),K]}},duration:D,method:I.easeOut},G=new A(F,J,E,F.element,YAHOO.util.Motion);G.handleStartAnimateIn=function(O,N,P){P.overlay.element.style.left=((-25)-H)+"px";P.overlay.element.style.top=K+"px";};G.handleTweenAnimateIn=function(Q,P,R){var S=B.getXY(R.overlay.element),O=S[0],N=S[1];if(B.getStyle(R.overlay.element,"visibility")=="hidden"&&O<L){R.overlay._setDomVisibility(true);}R.overlay.cfg.setProperty("xy",[O,N],true);R.overlay.cfg.refireEvent("iframe");};G.handleCompleteAnimateIn=function(O,N,P){P.overlay.cfg.setProperty("xy",[L,K],true);P.startX=L;P.startY=K;P.overlay.cfg.refireEvent("iframe");P.animateInCompleteEvent.fire();};G.handleStartAnimateOut=function(O,N,R){var P=B.getViewportWidth(),S=B.getXY(R.overlay.element),Q=S[1];R.animOut.attributes.points.to=[(P+25),Q];};G.handleTweenAnimateOut=function(P,O,Q){var S=B.getXY(Q.overlay.element),N=S[0],R=S[1];Q.overlay.cfg.setProperty("xy",[N,R],true);Q.overlay.cfg.refireEvent("iframe");};G.handleCompleteAnimateOut=function(O,N,P){P.overlay._setDomVisibility(false);P.overlay.cfg.setProperty("xy",[L,K]);P.animateOutCompleteEvent.fire();};G.init();return G;};A.prototype={init:function(){this.beforeAnimateInEvent=this.createEvent("beforeAnimateIn");this.beforeAnimateInEvent.signature=C.LIST;this.beforeAnimateOutEvent=this.createEvent("beforeAnimateOut");this.beforeAnimateOutEvent.signature=C.LIST;this.animateInCompleteEvent=this.createEvent("animateInComplete");this.animateInCompleteEvent.signature=C.LIST;this.animateOutCompleteEvent=this.createEvent("animateOutComplete");this.animateOutCompleteEvent.signature=C.LIST;this.animIn=new this.animClass(this.targetElement,this.attrIn.attributes,this.attrIn.duration,this.attrIn.method);this.animIn.onStart.subscribe(this.handleStartAnimateIn,this);this.animIn.onTween.subscribe(this.handleTweenAnimateIn,this);this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn,this);this.animOut=new this.animClass(this.targetElement,this.attrOut.attributes,this.attrOut.duration,this.attrOut.method);this.animOut.onStart.subscribe(this.handleStartAnimateOut,this);this.animOut.onTween.subscribe(this.handleTweenAnimateOut,this);this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut,this);},animateIn:function(){this.beforeAnimateInEvent.fire();this.animIn.animate();},animateOut:function(){this.beforeAnimateOutEvent.fire();this.animOut.animate();},handleStartAnimateIn:function(E,D,F){},handleTweenAnimateIn:function(E,D,F){},handleCompleteAnimateIn:function(E,D,F){},handleStartAnimateOut:function(E,D,F){},handleTweenAnimateOut:function(E,D,F){},handleCompleteAnimateOut:function(E,D,F){},toString:function(){var D="ContainerEffect";if(this.overlay){D+=" ["+this.overlay.toString()+"]";}return D;}};YAHOO.lang.augmentProto(A,YAHOO.util.EventProvider);})();YAHOO.register("containercore",YAHOO.widget.Module,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var S="DIV",O="hd",K="bd",N="ft",X="LI",A="disabled",D="mouseover",F="mouseout",U="mousedown",G="mouseup",R=YAHOO.env.ua.ie?"focusin":"focus",V="click",B="keydown",M="keyup",I="keypress",L="clicktohide",T="position",P="dynamic",Y="showdelay",J="selected",E="visible",W="UL",Q="MenuManager",C=YAHOO.util.Dom,Z=YAHOO.util.Event,H=YAHOO.lang;YAHOO.widget.MenuManager=function(){var a=false,c={},r={},d={},n={"click":"clickEvent","mousedown":"mouseDownEvent","mouseup":"mouseUpEvent","mouseover":"mouseOverEvent","mouseout":"mouseOutEvent","keydown":"keyDownEvent","keyup":"keyUpEvent","keypress":"keyPressEvent","focus":"focusEvent","focusin":"focusEvent","blur":"blurEvent","focusout":"blurEvent"},m=null,k=null;function o(u){var s,t;if(u&&u.tagName){switch(u.tagName.toUpperCase()){case S:s=u.parentNode;if((C.hasClass(u,O)||C.hasClass(u,K)||C.hasClass(u,N))&&s&&s.tagName&&s.tagName.toUpperCase()==S){t=s;}else{t=u;}break;case X:t=u;break;default:s=u.parentNode;if(s){t=o(s);}break;}}return t;}function q(w){var s=Z.getTarget(w),t=o(s),y,u,v,AA,z;if(t){u=t.tagName.toUpperCase();if(u==X){v=t.id;if(v&&d[v]){AA=d[v];z=AA.parent;}}else{if(u==S){if(t.id){z=c[t.id];}}}}if(z){y=n[w.type];if(AA&&!AA.cfg.getProperty(A)){AA[y].fire(w);}z[y].fire(w,AA);}else{if(w.type==U){for(var x in r){if(H.hasOwnProperty(r,x)){z=r[x];if(z.cfg.getProperty(L)&&!(z instanceof YAHOO.widget.MenuBar)&&z.cfg.getProperty(T)==P){z.hide();}else{if(z.cfg.getProperty(Y)>0){z._cancelShowDelay();}if(z.activeItem){z.activeItem.blur();z.activeItem.cfg.setProperty(J,false);z.activeItem=null;}}}}}else{if(w.type==R){m=s;}}}}function f(t,s,u){if(c[u.id]){this.removeMenu(u);}}function j(t,s){var u=s[1];if(u){k=u;}}function i(t,s){k=null;}function b(t,s,v){if(v&&v.focus){try{v.focus();}catch(u){}}this.hideEvent.unsubscribe(b,v);}function l(t,s){if(this===this.getRoot()&&this.cfg.getProperty(T)===P){this.hideEvent.subscribe(b,m);this.focus();}}function g(u,t){var s=t[0],v=this.id;if(s){r[v]=this;}else{if(r[v]){delete r[v];}}}function h(t,s){p(this);}function p(t){var s=t.id;if(s&&d[s]){if(k==t){k=null;}delete d[s];t.destroyEvent.unsubscribe(h);}}function e(t,s){var v=s[0],u;if(v instanceof YAHOO.widget.MenuItem){u=v.id;if(!d[u]){d[u]=v;v.destroyEvent.subscribe(h);}}}return{addMenu:function(t){var s;if(t instanceof YAHOO.widget.Menu&&t.id&&!c[t.id]){c[t.id]=t;if(!a){s=document;Z.on(s,D,q,this,true);Z.on(s,F,q,this,true);Z.on(s,U,q,this,true);Z.on(s,G,q,this,true);Z.on(s,V,q,this,true);Z.on(s,B,q,this,true);Z.on(s,M,q,this,true);Z.on(s,I,q,this,true);Z.onFocus(s,q,this,true);Z.onBlur(s,q,this,true);a=true;}t.cfg.subscribeToConfigEvent(E,g);t.destroyEvent.subscribe(f,t,this);t.itemAddedEvent.subscribe(e);t.focusEvent.subscribe(j);t.blurEvent.subscribe(i);t.showEvent.subscribe(l);}},removeMenu:function(v){var t,s,u;if(v){t=v.id;if((t in c)&&(c[t]==v)){s=v.getItems();if(s&&s.length>0){u=s.length-1;do{p(s[u]);}while(u--);}delete c[t];if((t in r)&&(r[t]==v)){delete r[t];}if(v.cfg){v.cfg.unsubscribeFromConfigEvent(E,g);}v.destroyEvent.unsubscribe(f,v);v.itemAddedEvent.unsubscribe(e);v.focusEvent.unsubscribe(j);v.blurEvent.unsubscribe(i);}}},hideVisible:function(){var s;for(var t in r){if(H.hasOwnProperty(r,t)){s=r[t];if(!(s instanceof YAHOO.widget.MenuBar)&&s.cfg.getProperty(T)==P){s.hide();}}}},getVisible:function(){return r;},getMenus:function(){return c;},getMenu:function(t){var s;if(t in c){s=c[t];}return s;},getMenuItem:function(t){var s;if(t in d){s=d[t];}return s;},getMenuItemGroup:function(w){var t=C.get(w),s,y,x,u,v;if(t&&t.tagName&&t.tagName.toUpperCase()==W){y=t.firstChild;if(y){s=[];do{u=y.id;if(u){x=this.getMenuItem(u);if(x){s[s.length]=x;}}}while((y=y.nextSibling));if(s.length>0){v=s;}}}return v;},getFocusedMenuItem:function(){return k;},getFocusedMenu:function(){var s;if(k){s=k.parent.getRoot();}return s;},toString:function(){return Q;}};}();})();(function(){var AN=YAHOO.lang,Ao="Menu",H="DIV",K="div",Ak="id",AI="SELECT",f="xy",R="y",Av="UL",L="ul",AK="first-of-type",l="LI",i="OPTGROUP",Ax="OPTION",Af="disabled",AY="none",z="selected",Ar="groupindex",j="index",O="submenu",As="visible",AX="hidedelay",Ab="position",AE="dynamic",C="static",Al=AE+","+C,Y="windows",Q="url",M="#",V="target",AU="maxheight",T="topscrollbar",y="bottomscrollbar",e="_",P=T+e+Af,E=y+e+Af,c="mousemove",At="showdelay",d="submenuhidedelay",AG="iframe",x="constraintoviewport",A2="preventcontextoverlap",AP="submenualignment",a="autosubmenudisplay",AD="clicktohide",h="container",k="scrollincrement",Ah="minscrollheight",A0="classname",Ae="shadow",Ap="keepopen",Ay="hd",D="hastitle",q="context",v="",Ai="mousedown",Ac="keydown",Am="height",U="width",AR="px",Aw="effect",AF="monitorresize",AW="display",AV="block",J="visibility",AA="absolute",AT="zindex",m="yui-menu-body-scrolled",AL="&#32;",Az=" ",Ag="mouseover",G="mouseout",AS="itemAdded",o="itemRemoved",AM="hidden",t="yui-menu-shadow",AH=t+"-visible",n=t+Az+AH;YAHOO.widget.Menu=function(A4,A3){if(A3){this.parent=A3.parent;this.lazyLoad=A3.lazyLoad||A3.lazyload;this.itemData=A3.itemData||A3.itemdata;}YAHOO.widget.Menu.superclass.constructor.call(this,A4,A3);};function B(A4){var A3=false;if(AN.isString(A4)){A3=(Al.indexOf((A4.toLowerCase()))!=-1);}return A3;}var g=YAHOO.util.Dom,AB=YAHOO.util.Event,Au=YAHOO.widget.Module,AC=YAHOO.widget.Overlay,s=YAHOO.widget.Menu,A1=YAHOO.widget.MenuManager,F=YAHOO.util.CustomEvent,Aq=YAHOO.env.ua,An,Aa=[["mouseOverEvent",Ag],["mouseOutEvent",G],["mouseDownEvent",Ai],["mouseUpEvent","mouseup"],["clickEvent","click"],["keyPressEvent","keypress"],["keyDownEvent",Ac],["keyUpEvent","keyup"],["focusEvent","focus"],["blurEvent","blur"],["itemAddedEvent",AS],["itemRemovedEvent",o]],AZ={key:As,value:false,validator:AN.isBoolean},AQ={key:x,value:true,validator:AN.isBoolean,supercedes:[AG,"x",R,f]},AJ={key:A2,value:true,validator:AN.isBoolean,supercedes:[x]},S={key:Ab,value:AE,validator:B,supercedes:[As,AG]},A={key:AP,value:["tl","tr"]},u={key:a,value:true,validator:AN.isBoolean,suppressEvent:true},Z={key:At,value:250,validator:AN.isNumber,suppressEvent:true},r={key:AX,value:0,validator:AN.isNumber,suppressEvent:true},w={key:d,value:250,validator:AN.isNumber,suppressEvent:true},p={key:AD,value:true,validator:AN.isBoolean,suppressEvent:true},AO={key:h,suppressEvent:true},Ad={key:k,value:1,validator:AN.isNumber,supercedes:[AU],suppressEvent:true},N={key:Ah,value:90,validator:AN.isNumber,supercedes:[AU],suppressEvent:true},X={key:AU,value:0,validator:AN.isNumber,supercedes:[AG],suppressEvent:true},W={key:A0,value:null,validator:AN.isString,suppressEvent:true},b={key:Af,value:false,validator:AN.isBoolean,suppressEvent:true},I={key:Ae,value:true,validator:AN.isBoolean,suppressEvent:true,supercedes:[As]},Aj={key:Ap,value:false,validator:AN.isBoolean};
YAHOO.lang.extend(s,AC,{CSS_CLASS_NAME:"yuimenu",ITEM_TYPE:null,GROUP_TITLE_TAG_NAME:"h6",OFF_SCREEN_POSITION:"-999em",_useHideDelay:false,_bHandledMouseOverEvent:false,_bHandledMouseOutEvent:false,_aGroupTitleElements:null,_aItemGroups:null,_aListElements:null,_nCurrentMouseX:0,_bStopMouseEventHandlers:false,_sClassName:null,lazyLoad:false,itemData:null,activeItem:null,parent:null,srcElement:null,init:function(A5,A4){this._aItemGroups=[];this._aListElements=[];this._aGroupTitleElements=[];if(!this.ITEM_TYPE){this.ITEM_TYPE=YAHOO.widget.MenuItem;}var A3;if(AN.isString(A5)){A3=g.get(A5);}else{if(A5.tagName){A3=A5;}}if(A3&&A3.tagName){switch(A3.tagName.toUpperCase()){case H:this.srcElement=A3;if(!A3.id){A3.setAttribute(Ak,g.generateId());}s.superclass.init.call(this,A3);this.beforeInitEvent.fire(s);break;case AI:this.srcElement=A3;s.superclass.init.call(this,g.generateId());this.beforeInitEvent.fire(s);break;}}else{s.superclass.init.call(this,A5);this.beforeInitEvent.fire(s);}if(this.element){g.addClass(this.element,this.CSS_CLASS_NAME);this.initEvent.subscribe(this._onInit);this.beforeRenderEvent.subscribe(this._onBeforeRender);this.renderEvent.subscribe(this._onRender);this.beforeShowEvent.subscribe(this._onBeforeShow);this.hideEvent.subscribe(this._onHide);this.showEvent.subscribe(this._onShow);this.beforeHideEvent.subscribe(this._onBeforeHide);this.mouseOverEvent.subscribe(this._onMouseOver);this.mouseOutEvent.subscribe(this._onMouseOut);this.clickEvent.subscribe(this._onClick);this.keyDownEvent.subscribe(this._onKeyDown);this.keyPressEvent.subscribe(this._onKeyPress);this.blurEvent.subscribe(this._onBlur);if((Aq.gecko&&Aq.gecko<1.9)||Aq.webkit){this.cfg.subscribeToConfigEvent(R,this._onYChange);}if(A4){this.cfg.applyConfig(A4,true);}A1.addMenu(this);this.initEvent.fire(s);}},_initSubTree:function(){var A4=this.srcElement,A3,A6,A9,BA,A8,A7,A5;if(A4){A3=(A4.tagName&&A4.tagName.toUpperCase());if(A3==H){BA=this.body.firstChild;if(BA){A6=0;A9=this.GROUP_TITLE_TAG_NAME.toUpperCase();do{if(BA&&BA.tagName){switch(BA.tagName.toUpperCase()){case A9:this._aGroupTitleElements[A6]=BA;break;case Av:this._aListElements[A6]=BA;this._aItemGroups[A6]=[];A6++;break;}}}while((BA=BA.nextSibling));if(this._aListElements[0]){g.addClass(this._aListElements[0],AK);}}}BA=null;if(A3){switch(A3){case H:A8=this._aListElements;A7=A8.length;if(A7>0){A5=A7-1;do{BA=A8[A5].firstChild;if(BA){do{if(BA&&BA.tagName&&BA.tagName.toUpperCase()==l){this.addItem(new this.ITEM_TYPE(BA,{parent:this}),A5);}}while((BA=BA.nextSibling));}}while(A5--);}break;case AI:BA=A4.firstChild;do{if(BA&&BA.tagName){switch(BA.tagName.toUpperCase()){case i:case Ax:this.addItem(new this.ITEM_TYPE(BA,{parent:this}));break;}}}while((BA=BA.nextSibling));break;}}}},_getFirstEnabledItem:function(){var A3=this.getItems(),A7=A3.length,A6,A5;for(var A4=0;A4<A7;A4++){A6=A3[A4];if(A6&&!A6.cfg.getProperty(Af)&&A6.element.style.display!=AY){A5=A6;break;}}return A5;},_addItemToGroup:function(A8,A9,BD){var BB,BE,A6,BC,A7,A4,A5,BA;function A3(BF,BG){return(BF[BG]||A3(BF,(BG+1)));}if(A9 instanceof this.ITEM_TYPE){BB=A9;BB.parent=this;}else{if(AN.isString(A9)){BB=new this.ITEM_TYPE(A9,{parent:this});}else{if(AN.isObject(A9)){A9.parent=this;BB=new this.ITEM_TYPE(A9.text,A9);}}}if(BB){if(BB.cfg.getProperty(z)){this.activeItem=BB;}BE=AN.isNumber(A8)?A8:0;A6=this._getItemGroup(BE);if(!A6){A6=this._createItemGroup(BE);}if(AN.isNumber(BD)){A7=(BD>=A6.length);if(A6[BD]){A6.splice(BD,0,BB);}else{A6[BD]=BB;}BC=A6[BD];if(BC){if(A7&&(!BC.element.parentNode||BC.element.parentNode.nodeType==11)){this._aListElements[BE].appendChild(BC.element);}else{A4=A3(A6,(BD+1));if(A4&&(!BC.element.parentNode||BC.element.parentNode.nodeType==11)){this._aListElements[BE].insertBefore(BC.element,A4.element);}}BC.parent=this;this._subscribeToItemEvents(BC);this._configureSubmenu(BC);this._updateItemProperties(BE);this.itemAddedEvent.fire(BC);this.changeContentEvent.fire();BA=BC;}}else{A5=A6.length;A6[A5]=BB;BC=A6[A5];if(BC){if(!g.isAncestor(this._aListElements[BE],BC.element)){this._aListElements[BE].appendChild(BC.element);}BC.element.setAttribute(Ar,BE);BC.element.setAttribute(j,A5);BC.parent=this;BC.index=A5;BC.groupIndex=BE;this._subscribeToItemEvents(BC);this._configureSubmenu(BC);if(A5===0){g.addClass(BC.element,AK);}this.itemAddedEvent.fire(BC);this.changeContentEvent.fire();BA=BC;}}}return BA;},_removeItemFromGroupByIndex:function(A6,A4){var A5=AN.isNumber(A6)?A6:0,A7=this._getItemGroup(A5),A9,A8,A3;if(A7){A9=A7.splice(A4,1);A8=A9[0];if(A8){this._updateItemProperties(A5);if(A7.length===0){A3=this._aListElements[A5];if(this.body&&A3){this.body.removeChild(A3);}this._aItemGroups.splice(A5,1);this._aListElements.splice(A5,1);A3=this._aListElements[0];if(A3){g.addClass(A3,AK);}}this.itemRemovedEvent.fire(A8);this.changeContentEvent.fire();}}return A8;},_removeItemFromGroupByValue:function(A6,A3){var A8=this._getItemGroup(A6),A9,A7,A5,A4;if(A8){A9=A8.length;A7=-1;if(A9>0){A4=A9-1;do{if(A8[A4]==A3){A7=A4;break;}}while(A4--);if(A7>-1){A5=this._removeItemFromGroupByIndex(A6,A7);}}}return A5;},_updateItemProperties:function(A4){var A5=this._getItemGroup(A4),A8=A5.length,A7,A6,A3;if(A8>0){A3=A8-1;do{A7=A5[A3];if(A7){A6=A7.element;A7.index=A3;A7.groupIndex=A4;A6.setAttribute(Ar,A4);A6.setAttribute(j,A3);g.removeClass(A6,AK);}}while(A3--);if(A6){g.addClass(A6,AK);}}},_createItemGroup:function(A5){var A3,A4;if(!this._aItemGroups[A5]){this._aItemGroups[A5]=[];A3=document.createElement(L);this._aListElements[A5]=A3;A4=this._aItemGroups[A5];}return A4;},_getItemGroup:function(A5){var A3=AN.isNumber(A5)?A5:0,A6=this._aItemGroups,A4;if(A3 in A6){A4=A6[A3];}return A4;},_configureSubmenu:function(A3){var A4=A3.cfg.getProperty(O);if(A4){this.cfg.configChangedEvent.subscribe(this._onParentMenuConfigChange,A4,true);this.renderEvent.subscribe(this._onParentMenuRender,A4,true);}},_subscribeToItemEvents:function(A3){A3.destroyEvent.subscribe(this._onMenuItemDestroy,A3,this);A3.cfg.configChangedEvent.subscribe(this._onMenuItemConfigChange,A3,this);
},_onVisibleChange:function(A5,A4){var A3=A4[0];if(A3){g.addClass(this.element,As);}else{g.removeClass(this.element,As);}},_cancelHideDelay:function(){var A3=this.getRoot()._hideDelayTimer;if(A3){A3.cancel();}},_execHideDelay:function(){this._cancelHideDelay();var A3=this.getRoot();A3._hideDelayTimer=AN.later(A3.cfg.getProperty(AX),this,function(){if(A3.activeItem){if(A3.hasFocus()){A3.activeItem.focus();}A3.clearActiveItem();}if(A3==this&&!(this instanceof YAHOO.widget.MenuBar)&&this.cfg.getProperty(Ab)==AE){this.hide();}});},_cancelShowDelay:function(){var A3=this.getRoot()._showDelayTimer;if(A3){A3.cancel();}},_execSubmenuHideDelay:function(A5,A4,A3){A5._submenuHideDelayTimer=AN.later(50,this,function(){if(this._nCurrentMouseX>(A4+10)){A5._submenuHideDelayTimer=AN.later(A3,A5,function(){this.hide();});}else{A5.hide();}});},_disableScrollHeader:function(){if(!this._bHeaderDisabled){g.addClass(this.header,P);this._bHeaderDisabled=true;}},_disableScrollFooter:function(){if(!this._bFooterDisabled){g.addClass(this.footer,E);this._bFooterDisabled=true;}},_enableScrollHeader:function(){if(this._bHeaderDisabled){g.removeClass(this.header,P);this._bHeaderDisabled=false;}},_enableScrollFooter:function(){if(this._bFooterDisabled){g.removeClass(this.footer,E);this._bFooterDisabled=false;}},_onMouseOver:function(BF,A8){var BG=A8[0],BC=A8[1],A3=AB.getTarget(BG),A7=this.getRoot(),BE=this._submenuHideDelayTimer,A4,A6,BB,A5,BA,A9;var BD=function(){if(this.parent.cfg.getProperty(z)){this.show();}};if(!this._bStopMouseEventHandlers){if(!this._bHandledMouseOverEvent&&(A3==this.element||g.isAncestor(this.element,A3))){if(this._useHideDelay){this._cancelHideDelay();}this._nCurrentMouseX=0;AB.on(this.element,c,this._onMouseMove,this,true);if(!(BC&&g.isAncestor(BC.element,AB.getRelatedTarget(BG)))){this.clearActiveItem();}if(this.parent&&BE){BE.cancel();this.parent.cfg.setProperty(z,true);A4=this.parent.parent;A4._bHandledMouseOutEvent=true;A4._bHandledMouseOverEvent=false;}this._bHandledMouseOverEvent=true;this._bHandledMouseOutEvent=false;}if(BC&&!BC.handledMouseOverEvent&&!BC.cfg.getProperty(Af)&&(A3==BC.element||g.isAncestor(BC.element,A3))){A6=this.cfg.getProperty(At);BB=(A6>0);if(BB){this._cancelShowDelay();}A5=this.activeItem;if(A5){A5.cfg.setProperty(z,false);}BA=BC.cfg;BA.setProperty(z,true);if(this.hasFocus()||A7._hasFocus){BC.focus();A7._hasFocus=false;}if(this.cfg.getProperty(a)){A9=BA.getProperty(O);if(A9){if(BB){A7._showDelayTimer=AN.later(A7.cfg.getProperty(At),A9,BD);}else{A9.show();}}}BC.handledMouseOverEvent=true;BC.handledMouseOutEvent=false;}}},_onMouseOut:function(BB,A5){var BC=A5[0],A9=A5[1],A6=AB.getRelatedTarget(BC),BA=false,A8,A7,A3,A4;if(!this._bStopMouseEventHandlers){if(A9&&!A9.cfg.getProperty(Af)){A8=A9.cfg;A7=A8.getProperty(O);if(A7&&(A6==A7.element||g.isAncestor(A7.element,A6))){BA=true;}if(!A9.handledMouseOutEvent&&((A6!=A9.element&&!g.isAncestor(A9.element,A6))||BA)){if(!BA){A9.cfg.setProperty(z,false);if(A7){A3=this.cfg.getProperty(d);A4=this.cfg.getProperty(At);if(!(this instanceof YAHOO.widget.MenuBar)&&A3>0&&A4>=A3){this._execSubmenuHideDelay(A7,AB.getPageX(BC),A3);}else{A7.hide();}}}A9.handledMouseOutEvent=true;A9.handledMouseOverEvent=false;}}if(!this._bHandledMouseOutEvent&&((A6!=this.element&&!g.isAncestor(this.element,A6))||BA)){if(this._useHideDelay){this._execHideDelay();}AB.removeListener(this.element,c,this._onMouseMove);this._nCurrentMouseX=AB.getPageX(BC);this._bHandledMouseOutEvent=true;this._bHandledMouseOverEvent=false;}}},_onMouseMove:function(A4,A3){if(!this._bStopMouseEventHandlers){this._nCurrentMouseX=AB.getPageX(A4);}},_onClick:function(BE,A5){var BF=A5[0],A9=A5[1],BB=false,A7,BC,A4,A3,A8,BA,BD;var A6=function(){if(!((Aq.gecko&&this.platform==Y)&&BF.button>0)){A4=this.getRoot();if(A4 instanceof YAHOO.widget.MenuBar||A4.cfg.getProperty(Ab)==C){A4.clearActiveItem();}else{A4.hide();}}};if(A9){if(A9.cfg.getProperty(Af)){AB.preventDefault(BF);A6.call(this);}else{A7=A9.cfg.getProperty(O);A8=A9.cfg.getProperty(Q);if(A8){BA=A8.indexOf(M);BD=A8.length;if(BA!=-1){A8=A8.substr(BA,BD);BD=A8.length;if(BD>1){A3=A8.substr(1,BD);BC=YAHOO.widget.MenuManager.getMenu(A3);if(BC){BB=(this.getRoot()===BC.getRoot());}}else{if(BD===1){BB=true;}}}}if(BB&&!A9.cfg.getProperty(V)){AB.preventDefault(BF);if(Aq.webkit){A9.focus();}else{A9.focusEvent.fire();}}if(!A7&&!this.cfg.getProperty(Ap)){A6.call(this);}}}},_onKeyDown:function(BH,BB){var BE=BB[0],BD=BB[1],BA,BF,A4,A8,BI,A3,BK,A7,BG,A6,BC,BJ,A9;if(this._useHideDelay){this._cancelHideDelay();}function A5(){this._bStopMouseEventHandlers=true;AN.later(10,this,function(){this._bStopMouseEventHandlers=false;});}if(BD&&!BD.cfg.getProperty(Af)){BF=BD.cfg;A4=this.parent;switch(BE.keyCode){case 38:case 40:BI=(BE.keyCode==38)?BD.getPreviousEnabledSibling():BD.getNextEnabledSibling();if(BI){this.clearActiveItem();BI.cfg.setProperty(z,true);BI.focus();if(this.cfg.getProperty(AU)>0){A3=this.body;BK=A3.scrollTop;A7=A3.offsetHeight;BG=this.getItems();A6=BG.length-1;BC=BI.element.offsetTop;if(BE.keyCode==40){if(BC>=(A7+BK)){A3.scrollTop=BC-A7;}else{if(BC<=BK){A3.scrollTop=0;}}if(BI==BG[A6]){A3.scrollTop=BI.element.offsetTop;}}else{if(BC<=BK){A3.scrollTop=BC-BI.element.offsetHeight;}else{if(BC>=(BK+A7)){A3.scrollTop=BC;}}if(BI==BG[0]){A3.scrollTop=0;}}BK=A3.scrollTop;BJ=A3.scrollHeight-A3.offsetHeight;if(BK===0){this._disableScrollHeader();this._enableScrollFooter();}else{if(BK==BJ){this._enableScrollHeader();this._disableScrollFooter();}else{this._enableScrollHeader();this._enableScrollFooter();}}}}AB.preventDefault(BE);A5();break;case 39:BA=BF.getProperty(O);if(BA){if(!BF.getProperty(z)){BF.setProperty(z,true);}BA.show();BA.setInitialFocus();BA.setInitialSelection();}else{A8=this.getRoot();if(A8 instanceof YAHOO.widget.MenuBar){BI=A8.activeItem.getNextEnabledSibling();if(BI){A8.clearActiveItem();BI.cfg.setProperty(z,true);BA=BI.cfg.getProperty(O);if(BA){BA.show();BA.setInitialFocus();}else{BI.focus();}}}}AB.preventDefault(BE);A5();break;case 37:if(A4){A9=A4.parent;
if(A9 instanceof YAHOO.widget.MenuBar){BI=A9.activeItem.getPreviousEnabledSibling();if(BI){A9.clearActiveItem();BI.cfg.setProperty(z,true);BA=BI.cfg.getProperty(O);if(BA){BA.show();BA.setInitialFocus();}else{BI.focus();}}}else{this.hide();A4.focus();}}AB.preventDefault(BE);A5();break;}}if(BE.keyCode==27){if(this.cfg.getProperty(Ab)==AE){this.hide();if(this.parent){this.parent.focus();}}else{if(this.activeItem){BA=this.activeItem.cfg.getProperty(O);if(BA&&BA.cfg.getProperty(As)){BA.hide();this.activeItem.focus();}else{this.activeItem.blur();this.activeItem.cfg.setProperty(z,false);}}}AB.preventDefault(BE);}},_onKeyPress:function(A5,A4){var A3=A4[0];if(A3.keyCode==40||A3.keyCode==38){AB.preventDefault(A3);}},_onBlur:function(A4,A3){if(this._hasFocus){this._hasFocus=false;}},_onYChange:function(A4,A3){var A6=this.parent,A8,A5,A7;if(A6){A8=A6.parent.body.scrollTop;if(A8>0){A7=(this.cfg.getProperty(R)-A8);g.setY(this.element,A7);A5=this.iframe;if(A5){g.setY(A5,A7);}this.cfg.setProperty(R,A7,true);}}},_onScrollTargetMouseOver:function(A9,BC){var BB=this._bodyScrollTimer;if(BB){BB.cancel();}this._cancelHideDelay();var A5=AB.getTarget(A9),A7=this.body,A6=this.cfg.getProperty(k),A3,A4;function BA(){var BD=A7.scrollTop;if(BD<A3){A7.scrollTop=(BD+A6);this._enableScrollHeader();}else{A7.scrollTop=A3;this._bodyScrollTimer.cancel();this._disableScrollFooter();}}function A8(){var BD=A7.scrollTop;if(BD>0){A7.scrollTop=(BD-A6);this._enableScrollFooter();}else{A7.scrollTop=0;this._bodyScrollTimer.cancel();this._disableScrollHeader();}}if(g.hasClass(A5,Ay)){A4=A8;}else{A3=A7.scrollHeight-A7.offsetHeight;A4=BA;}this._bodyScrollTimer=AN.later(10,this,A4,null,true);},_onScrollTargetMouseOut:function(A5,A3){var A4=this._bodyScrollTimer;if(A4){A4.cancel();}this._cancelHideDelay();},_onInit:function(A4,A3){this.cfg.subscribeToConfigEvent(As,this._onVisibleChange);var A5=!this.parent,A6=this.lazyLoad;if(((A5&&!A6)||(A5&&(this.cfg.getProperty(As)||this.cfg.getProperty(Ab)==C))||(!A5&&!A6))&&this.getItemGroups().length===0){if(this.srcElement){this._initSubTree();}if(this.itemData){this.addItems(this.itemData);}}else{if(A6){this.cfg.fireQueue();}}},_onBeforeRender:function(A6,A5){var A7=this.element,BA=this._aListElements.length,A4=true,A9=0,A3,A8;if(BA>0){do{A3=this._aListElements[A9];if(A3){if(A4){g.addClass(A3,AK);A4=false;}if(!g.isAncestor(A7,A3)){this.appendToBody(A3);}A8=this._aGroupTitleElements[A9];if(A8){if(!g.isAncestor(A7,A8)){A3.parentNode.insertBefore(A8,A3);}g.addClass(A3,D);}}A9++;}while(A9<BA);}},_onRender:function(A4,A3){if(this.cfg.getProperty(Ab)==AE){if(!this.cfg.getProperty(As)){this.positionOffScreen();}}},_onBeforeShow:function(A5,A4){var A7,BA,A6,A8=this.cfg.getProperty(h);if(this.lazyLoad&&this.getItemGroups().length===0){if(this.srcElement){this._initSubTree();}if(this.itemData){if(this.parent&&this.parent.parent&&this.parent.parent.srcElement&&this.parent.parent.srcElement.tagName.toUpperCase()==AI){A7=this.itemData.length;for(BA=0;BA<A7;BA++){if(this.itemData[BA].tagName){this.addItem((new this.ITEM_TYPE(this.itemData[BA])));}}}else{this.addItems(this.itemData);}}A6=this.srcElement;if(A6){if(A6.tagName.toUpperCase()==AI){if(g.inDocument(A6)){this.render(A6.parentNode);}else{this.render(A8);}}else{this.render();}}else{if(this.parent){this.render(this.parent.element);}else{this.render(A8);}}}var A9=this.parent,A3;if(!A9&&this.cfg.getProperty(Ab)==AE){this.cfg.refireEvent(f);}if(A9){A3=A9.parent.cfg.getProperty(AP);this.cfg.setProperty(q,[A9.element,A3[0],A3[1]]);this.align();}},getConstrainedY:function(BF){var BQ=this,BM=BQ.cfg.getProperty(q),BT=BQ.cfg.getProperty(AU),BP,BE={"trbr":true,"tlbl":true,"bltl":true,"brtr":true},A8=(BM&&BE[BM[1]+BM[2]]),BA=BQ.element,BU=BA.offsetHeight,BO=AC.VIEWPORT_OFFSET,BJ=g.getViewportHeight(),BN=g.getDocumentScrollTop(),BK=(BQ.cfg.getProperty(Ah)+BO<BJ),BS,BB,BH,BI,BD=false,BC,A5,BG=BN+BO,A7=BN+BJ-BU-BO,A3=BF;var A9=function(){var BV;if((BQ.cfg.getProperty(R)-BN)>BH){BV=(BH-BU);}else{BV=(BH+BI);}BQ.cfg.setProperty(R,(BV+BN),true);return BV;};var A6=function(){if((BQ.cfg.getProperty(R)-BN)>BH){return(A5-BO);}else{return(BC-BO);}};var BL=function(){var BV;if((BQ.cfg.getProperty(R)-BN)>BH){BV=(BH+BI);}else{BV=(BH-BA.offsetHeight);}BQ.cfg.setProperty(R,(BV+BN),true);};var A4=function(){BQ._setScrollHeight(this.cfg.getProperty(AU));BQ.hideEvent.unsubscribe(A4);};var BR=function(){var BY=A6(),BV=(BQ.getItems().length>0),BX,BW;if(BU>BY){BX=BV?BQ.cfg.getProperty(Ah):BU;if((BY>BX)&&BV){BP=BY;}else{BP=BT;}BQ._setScrollHeight(BP);BQ.hideEvent.subscribe(A4);BL();if(BY<BX){if(BD){A9();}else{A9();BD=true;BW=BR();}}}else{if(BP&&(BP!==BT)){BQ._setScrollHeight(BT);BQ.hideEvent.subscribe(A4);BL();}}return BW;};if(BF<BG||BF>A7){if(BK){if(BQ.cfg.getProperty(A2)&&A8){BB=BM[0];BI=BB.offsetHeight;BH=(g.getY(BB)-BN);BC=BH;A5=(BJ-(BH+BI));BR();A3=BQ.cfg.getProperty(R);}else{if(!(BQ instanceof YAHOO.widget.MenuBar)&&BU>=BJ){BS=(BJ-(BO*2));if(BS>BQ.cfg.getProperty(Ah)){BQ._setScrollHeight(BS);BQ.hideEvent.subscribe(A4);BL();A3=BQ.cfg.getProperty(R);}}else{if(BF<BG){A3=BG;}else{if(BF>A7){A3=A7;}}}}}else{A3=BO+BN;}}return A3;},_onHide:function(A4,A3){if(this.cfg.getProperty(Ab)===AE){this.positionOffScreen();}},_onShow:function(BB,A9){var A3=this.parent,A5,A6,A8,A4;function A7(BD){var BC;if(BD.type==Ai||(BD.type==Ac&&BD.keyCode==27)){BC=AB.getTarget(BD);if(BC!=A5.element||!g.isAncestor(A5.element,BC)){A5.cfg.setProperty(a,false);AB.removeListener(document,Ai,A7);AB.removeListener(document,Ac,A7);}}}function BA(BD,BC,BE){this.cfg.setProperty(U,v);this.hideEvent.unsubscribe(BA,BE);}if(A3){A5=A3.parent;if(!A5.cfg.getProperty(a)&&(A5 instanceof YAHOO.widget.MenuBar||A5.cfg.getProperty(Ab)==C)){A5.cfg.setProperty(a,true);AB.on(document,Ai,A7);AB.on(document,Ac,A7);}if((this.cfg.getProperty("x")<A5.cfg.getProperty("x"))&&(Aq.gecko&&Aq.gecko<1.9)&&!this.cfg.getProperty(U)){A6=this.element;A8=A6.offsetWidth;A6.style.width=A8+AR;A4=(A8-(A6.offsetWidth-A8))+AR;this.cfg.setProperty(U,A4);this.hideEvent.subscribe(BA,A4);
}}},_onBeforeHide:function(A5,A4){var A3=this.activeItem,A7=this.getRoot(),A8,A6;if(A3){A8=A3.cfg;A8.setProperty(z,false);A6=A8.getProperty(O);if(A6){A6.hide();}}if(Aq.ie&&this.cfg.getProperty(Ab)===AE&&this.parent){A7._hasFocus=this.hasFocus();}if(A7==this){A7.blur();}},_onParentMenuConfigChange:function(A4,A3,A7){var A5=A3[0][0],A6=A3[0][1];switch(A5){case AG:case x:case AX:case At:case d:case AD:case Aw:case A0:case k:case AU:case Ah:case AF:case Ae:case A2:A7.cfg.setProperty(A5,A6);break;case AP:if(!(this.parent.parent instanceof YAHOO.widget.MenuBar)){A7.cfg.setProperty(A5,A6);}break;}},_onParentMenuRender:function(A4,A3,A9){var A6=A9.parent.parent,A5=A6.cfg,A7={constraintoviewport:A5.getProperty(x),xy:[0,0],clicktohide:A5.getProperty(AD),effect:A5.getProperty(Aw),showdelay:A5.getProperty(At),hidedelay:A5.getProperty(AX),submenuhidedelay:A5.getProperty(d),classname:A5.getProperty(A0),scrollincrement:A5.getProperty(k),maxheight:A5.getProperty(AU),minscrollheight:A5.getProperty(Ah),iframe:A5.getProperty(AG),shadow:A5.getProperty(Ae),preventcontextoverlap:A5.getProperty(A2),monitorresize:A5.getProperty(AF)},A8;if(!(A6 instanceof YAHOO.widget.MenuBar)){A7[AP]=A5.getProperty(AP);}A9.cfg.applyConfig(A7);if(!this.lazyLoad){A8=this.parent.element;if(this.element.parentNode==A8){this.render();}else{this.render(A8);}}},_onMenuItemDestroy:function(A5,A4,A3){this._removeItemFromGroupByValue(A3.groupIndex,A3);},_onMenuItemConfigChange:function(A5,A4,A3){var A7=A4[0][0],A8=A4[0][1],A6;switch(A7){case z:if(A8===true){this.activeItem=A3;}break;case O:A6=A4[0][1];if(A6){this._configureSubmenu(A3);}break;}},configVisible:function(A5,A4,A6){var A3,A7;if(this.cfg.getProperty(Ab)==AE){s.superclass.configVisible.call(this,A5,A4,A6);}else{A3=A4[0];A7=g.getStyle(this.element,AW);g.setStyle(this.element,J,As);if(A3){if(A7!=AV){this.beforeShowEvent.fire();g.setStyle(this.element,AW,AV);this.showEvent.fire();}}else{if(A7==AV){this.beforeHideEvent.fire();g.setStyle(this.element,AW,AY);this.hideEvent.fire();}}}},configPosition:function(A5,A4,A8){var A7=this.element,A6=A4[0]==C?C:AA,A9=this.cfg,A3;g.setStyle(A7,Ab,A6);if(A6==C){g.setStyle(A7,AW,AV);A9.setProperty(As,true);}else{g.setStyle(A7,J,AM);}if(A6==AA){A3=A9.getProperty(AT);if(!A3||A3===0){A9.setProperty(AT,1);}}},configIframe:function(A4,A3,A5){if(this.cfg.getProperty(Ab)==AE){s.superclass.configIframe.call(this,A4,A3,A5);}},configHideDelay:function(A4,A3,A5){var A6=A3[0];this._useHideDelay=(A6>0);},configContainer:function(A4,A3,A6){var A5=A3[0];if(AN.isString(A5)){this.cfg.setProperty(h,g.get(A5),true);}},_clearSetWidthFlag:function(){this._widthSetForScroll=false;this.cfg.unsubscribeFromConfigEvent(U,this._clearSetWidthFlag);},_setScrollHeight:function(BE){var BA=BE,A9=false,BF=false,A6,A7,BD,A4,BC,BG,A3,BB,A8,A5;if(this.getItems().length>0){A6=this.element;A7=this.body;BD=this.header;A4=this.footer;BC=this._onScrollTargetMouseOver;BG=this._onScrollTargetMouseOut;A3=this.cfg.getProperty(Ah);if(BA>0&&BA<A3){BA=A3;}g.setStyle(A7,Am,v);g.removeClass(A7,m);A7.scrollTop=0;BF=((Aq.gecko&&Aq.gecko<1.9)||Aq.ie);if(BA>0&&BF&&!this.cfg.getProperty(U)){A8=A6.offsetWidth;A6.style.width=A8+AR;A5=(A8-(A6.offsetWidth-A8))+AR;this.cfg.unsubscribeFromConfigEvent(U,this._clearSetWidthFlag);this.cfg.setProperty(U,A5);this._widthSetForScroll=true;this.cfg.subscribeToConfigEvent(U,this._clearSetWidthFlag);}if(BA>0&&(!BD&&!A4)){this.setHeader(AL);this.setFooter(AL);BD=this.header;A4=this.footer;g.addClass(BD,T);g.addClass(A4,y);A6.insertBefore(BD,A7);A6.appendChild(A4);}BB=BA;if(BD&&A4){BB=(BB-(BD.offsetHeight+A4.offsetHeight));}if((BB>0)&&(A7.offsetHeight>BA)){g.addClass(A7,m);g.setStyle(A7,Am,(BB+AR));if(!this._hasScrollEventHandlers){AB.on(BD,Ag,BC,this,true);AB.on(BD,G,BG,this,true);AB.on(A4,Ag,BC,this,true);AB.on(A4,G,BG,this,true);this._hasScrollEventHandlers=true;}this._disableScrollHeader();this._enableScrollFooter();A9=true;}else{if(BD&&A4){if(this._widthSetForScroll){this._widthSetForScroll=false;this.cfg.unsubscribeFromConfigEvent(U,this._clearSetWidthFlag);this.cfg.setProperty(U,v);}this._enableScrollHeader();this._enableScrollFooter();if(this._hasScrollEventHandlers){AB.removeListener(BD,Ag,BC);AB.removeListener(BD,G,BG);AB.removeListener(A4,Ag,BC);AB.removeListener(A4,G,BG);this._hasScrollEventHandlers=false;}A6.removeChild(BD);A6.removeChild(A4);this.header=null;this.footer=null;A9=true;}}if(A9){this.cfg.refireEvent(AG);this.cfg.refireEvent(Ae);}}},_setMaxHeight:function(A4,A3,A5){this._setScrollHeight(A5);this.renderEvent.unsubscribe(this._setMaxHeight);},configMaxHeight:function(A4,A3,A5){var A6=A3[0];if(this.lazyLoad&&!this.body&&A6>0){this.renderEvent.subscribe(this._setMaxHeight,A6,this);}else{this._setScrollHeight(A6);}},configClassName:function(A5,A4,A6){var A3=A4[0];if(this._sClassName){g.removeClass(this.element,this._sClassName);}g.addClass(this.element,A3);this._sClassName=A3;},_onItemAdded:function(A4,A3){var A5=A3[0];if(A5){A5.cfg.setProperty(Af,true);}},configDisabled:function(A5,A4,A8){var A7=A4[0],A3=this.getItems(),A9,A6;if(AN.isArray(A3)){A9=A3.length;if(A9>0){A6=A9-1;do{A3[A6].cfg.setProperty(Af,A7);}while(A6--);}if(A7){this.clearActiveItem(true);g.addClass(this.element,Af);this.itemAddedEvent.subscribe(this._onItemAdded);}else{g.removeClass(this.element,Af);this.itemAddedEvent.unsubscribe(this._onItemAdded);}}},configShadow:function(BB,A5,BA){var A9=function(){var BE=this.element,BD=this._shadow;if(BD&&BE){if(BD.style.width&&BD.style.height){BD.style.width=v;BD.style.height=v;}BD.style.width=(BE.offsetWidth+6)+AR;BD.style.height=(BE.offsetHeight+1)+AR;}};var BC=function(){this.element.appendChild(this._shadow);};var A7=function(){g.addClass(this._shadow,AH);};var A8=function(){g.removeClass(this._shadow,AH);};var A4=function(){var BE=this._shadow,BD;if(!BE){BD=this.element;if(!An){An=document.createElement(K);An.className=n;}BE=An.cloneNode(false);BD.appendChild(BE);this._shadow=BE;this.beforeShowEvent.subscribe(A7);this.beforeHideEvent.subscribe(A8);
if(Aq.ie){AN.later(0,this,function(){A9.call(this);this.syncIframe();});this.cfg.subscribeToConfigEvent(U,A9);this.cfg.subscribeToConfigEvent(Am,A9);this.cfg.subscribeToConfigEvent(AU,A9);this.changeContentEvent.subscribe(A9);Au.textResizeEvent.subscribe(A9,this,true);this.destroyEvent.subscribe(function(){Au.textResizeEvent.unsubscribe(A9,this);});}this.cfg.subscribeToConfigEvent(AU,BC);}};var A6=function(){if(this._shadow){BC.call(this);if(Aq.ie){A9.call(this);}}else{A4.call(this);}this.beforeShowEvent.unsubscribe(A6);};var A3=A5[0];if(A3&&this.cfg.getProperty(Ab)==AE){if(this.cfg.getProperty(As)){if(this._shadow){BC.call(this);if(Aq.ie){A9.call(this);}}else{A4.call(this);}}else{this.beforeShowEvent.subscribe(A6);}}},initEvents:function(){s.superclass.initEvents.call(this);var A4=Aa.length-1,A5,A3;do{A5=Aa[A4];A3=this.createEvent(A5[1]);A3.signature=F.LIST;this[A5[0]]=A3;}while(A4--);},positionOffScreen:function(){var A4=this.iframe,A5=this.element,A3=this.OFF_SCREEN_POSITION;A5.style.top=v;A5.style.left=v;if(A4){A4.style.top=A3;A4.style.left=A3;}},getRoot:function(){var A5=this.parent,A4,A3;if(A5){A4=A5.parent;A3=A4?A4.getRoot():this;}else{A3=this;}return A3;},toString:function(){var A4=Ao,A3=this.id;if(A3){A4+=(Az+A3);}return A4;},setItemGroupTitle:function(A8,A7){var A6,A5,A4,A3;if(AN.isString(A8)&&A8.length>0){A6=AN.isNumber(A7)?A7:0;A5=this._aGroupTitleElements[A6];if(A5){A5.innerHTML=A8;}else{A5=document.createElement(this.GROUP_TITLE_TAG_NAME);A5.innerHTML=A8;this._aGroupTitleElements[A6]=A5;}A4=this._aGroupTitleElements.length-1;do{if(this._aGroupTitleElements[A4]){g.removeClass(this._aGroupTitleElements[A4],AK);A3=A4;}}while(A4--);if(A3!==null){g.addClass(this._aGroupTitleElements[A3],AK);}this.changeContentEvent.fire();}},addItem:function(A3,A4){return this._addItemToGroup(A4,A3);},addItems:function(A7,A6){var A9,A3,A8,A4,A5;if(AN.isArray(A7)){A9=A7.length;A3=[];for(A4=0;A4<A9;A4++){A8=A7[A4];if(A8){if(AN.isArray(A8)){A3[A3.length]=this.addItems(A8,A4);}else{A3[A3.length]=this._addItemToGroup(A6,A8);}}}if(A3.length){A5=A3;}}return A5;},insertItem:function(A3,A4,A5){return this._addItemToGroup(A5,A3,A4);},removeItem:function(A3,A5){var A6,A4;if(!AN.isUndefined(A3)){if(A3 instanceof YAHOO.widget.MenuItem){A6=this._removeItemFromGroupByValue(A5,A3);}else{if(AN.isNumber(A3)){A6=this._removeItemFromGroupByIndex(A5,A3);}}if(A6){A6.destroy();A4=A6;}}return A4;},getItems:function(){var A6=this._aItemGroups,A4,A5,A3=[];if(AN.isArray(A6)){A4=A6.length;A5=((A4==1)?A6[0]:(Array.prototype.concat.apply(A3,A6)));}return A5;},getItemGroups:function(){return this._aItemGroups;},getItem:function(A4,A5){var A6,A3;if(AN.isNumber(A4)){A6=this._getItemGroup(A5);if(A6){A3=A6[A4];}}return A3;},getSubmenus:function(){var A4=this.getItems(),A8=A4.length,A3,A5,A7,A6;if(A8>0){A3=[];for(A6=0;A6<A8;A6++){A7=A4[A6];if(A7){A5=A7.cfg.getProperty(O);if(A5){A3[A3.length]=A5;}}}}return A3;},clearContent:function(){var A7=this.getItems(),A4=A7.length,A5=this.element,A6=this.body,BB=this.header,A3=this.footer,BA,A9,A8;if(A4>0){A8=A4-1;do{BA=A7[A8];if(BA){A9=BA.cfg.getProperty(O);if(A9){this.cfg.configChangedEvent.unsubscribe(this._onParentMenuConfigChange,A9);this.renderEvent.unsubscribe(this._onParentMenuRender,A9);}this.removeItem(BA,BA.groupIndex);}}while(A8--);}if(BB){AB.purgeElement(BB);A5.removeChild(BB);}if(A3){AB.purgeElement(A3);A5.removeChild(A3);}if(A6){AB.purgeElement(A6);A6.innerHTML=v;}this.activeItem=null;this._aItemGroups=[];this._aListElements=[];this._aGroupTitleElements=[];this.cfg.setProperty(U,null);},destroy:function(){this.clearContent();this._aItemGroups=null;this._aListElements=null;this._aGroupTitleElements=null;s.superclass.destroy.call(this);},setInitialFocus:function(){var A3=this._getFirstEnabledItem();if(A3){A3.focus();}},setInitialSelection:function(){var A3=this._getFirstEnabledItem();if(A3){A3.cfg.setProperty(z,true);}},clearActiveItem:function(A5){if(this.cfg.getProperty(At)>0){this._cancelShowDelay();}var A3=this.activeItem,A6,A4;if(A3){A6=A3.cfg;if(A5){A3.blur();this.getRoot()._hasFocus=true;}A6.setProperty(z,false);A4=A6.getProperty(O);if(A4){A4.hide();}this.activeItem=null;}},focus:function(){if(!this.hasFocus()){this.setInitialFocus();}},blur:function(){var A3;if(this.hasFocus()){A3=A1.getFocusedMenuItem();if(A3){A3.blur();}}},hasFocus:function(){return(A1.getFocusedMenu()==this.getRoot());},subscribe:function(){function A6(BB,BA,BD){var BE=BA[0],BC=BE.cfg.getProperty(O);if(BC){BC.subscribe.apply(BC,BD);}}function A9(BB,BA,BD){var BC=this.cfg.getProperty(O);if(BC){BC.subscribe.apply(BC,BD);}}s.superclass.subscribe.apply(this,arguments);s.superclass.subscribe.call(this,AS,A6,arguments);var A3=this.getItems(),A8,A7,A4,A5;if(A3){A8=A3.length;if(A8>0){A5=A8-1;do{A7=A3[A5];A4=A7.cfg.getProperty(O);if(A4){A4.subscribe.apply(A4,arguments);}else{A7.cfg.subscribeToConfigEvent(O,A9,arguments);}}while(A5--);}}},initDefaultConfig:function(){s.superclass.initDefaultConfig.call(this);var A3=this.cfg;A3.addProperty(AZ.key,{handler:this.configVisible,value:AZ.value,validator:AZ.validator});A3.addProperty(AQ.key,{handler:this.configConstrainToViewport,value:AQ.value,validator:AQ.validator,supercedes:AQ.supercedes});A3.addProperty(AJ.key,{value:AJ.value,validator:AJ.validator,supercedes:AJ.supercedes});A3.addProperty(S.key,{handler:this.configPosition,value:S.value,validator:S.validator,supercedes:S.supercedes});A3.addProperty(A.key,{value:A.value,suppressEvent:A.suppressEvent});A3.addProperty(u.key,{value:u.value,validator:u.validator,suppressEvent:u.suppressEvent});A3.addProperty(Z.key,{value:Z.value,validator:Z.validator,suppressEvent:Z.suppressEvent});A3.addProperty(r.key,{handler:this.configHideDelay,value:r.value,validator:r.validator,suppressEvent:r.suppressEvent});A3.addProperty(w.key,{value:w.value,validator:w.validator,suppressEvent:w.suppressEvent});A3.addProperty(p.key,{value:p.value,validator:p.validator,suppressEvent:p.suppressEvent});A3.addProperty(AO.key,{handler:this.configContainer,value:document.body,suppressEvent:AO.suppressEvent});
A3.addProperty(Ad.key,{value:Ad.value,validator:Ad.validator,supercedes:Ad.supercedes,suppressEvent:Ad.suppressEvent});A3.addProperty(N.key,{value:N.value,validator:N.validator,supercedes:N.supercedes,suppressEvent:N.suppressEvent});A3.addProperty(X.key,{handler:this.configMaxHeight,value:X.value,validator:X.validator,suppressEvent:X.suppressEvent,supercedes:X.supercedes});A3.addProperty(W.key,{handler:this.configClassName,value:W.value,validator:W.validator,supercedes:W.supercedes});A3.addProperty(b.key,{handler:this.configDisabled,value:b.value,validator:b.validator,suppressEvent:b.suppressEvent});A3.addProperty(I.key,{handler:this.configShadow,value:I.value,validator:I.validator});A3.addProperty(Aj.key,{value:Aj.value,validator:Aj.validator});}});})();(function(){YAHOO.widget.MenuItem=function(AS,AR){if(AS){if(AR){this.parent=AR.parent;this.value=AR.value;this.id=AR.id;}this.init(AS,AR);}};var x=YAHOO.util.Dom,j=YAHOO.widget.Module,AB=YAHOO.widget.Menu,c=YAHOO.widget.MenuItem,AK=YAHOO.util.CustomEvent,k=YAHOO.env.ua,AQ=YAHOO.lang,AL="text",O="#",Q="-",L="helptext",n="url",AH="target",A="emphasis",N="strongemphasis",b="checked",w="submenu",H="disabled",B="selected",P="hassubmenu",U="checked-disabled",AI="hassubmenu-disabled",AD="hassubmenu-selected",T="checked-selected",q="onclick",J="classname",AJ="",i="OPTION",v="OPTGROUP",K="LI",AE="href",r="SELECT",X="DIV",AN='<em class="helptext">',a="<em>",I="</em>",W="<strong>",y="</strong>",Y="preventcontextoverlap",h="obj",AG="scope",t="none",V="visible",E=" ",m="MenuItem",AA="click",D="show",M="hide",S="li",AF='<a href="#"></a>',p=[["mouseOverEvent","mouseover"],["mouseOutEvent","mouseout"],["mouseDownEvent","mousedown"],["mouseUpEvent","mouseup"],["clickEvent",AA],["keyPressEvent","keypress"],["keyDownEvent","keydown"],["keyUpEvent","keyup"],["focusEvent","focus"],["blurEvent","blur"],["destroyEvent","destroy"]],o={key:AL,value:AJ,validator:AQ.isString,suppressEvent:true},s={key:L,supercedes:[AL],suppressEvent:true},G={key:n,value:O,suppressEvent:true},AO={key:AH,suppressEvent:true},AP={key:A,value:false,validator:AQ.isBoolean,suppressEvent:true,supercedes:[AL]},d={key:N,value:false,validator:AQ.isBoolean,suppressEvent:true,supercedes:[AL]},l={key:b,value:false,validator:AQ.isBoolean,suppressEvent:true,supercedes:[H,B]},F={key:w,suppressEvent:true,supercedes:[H,B]},AM={key:H,value:false,validator:AQ.isBoolean,suppressEvent:true,supercedes:[AL,B]},f={key:B,value:false,validator:AQ.isBoolean,suppressEvent:true},u={key:q,suppressEvent:true},AC={key:J,value:null,validator:AQ.isString,suppressEvent:true},z={key:"keylistener",value:null,suppressEvent:true},C=null,e={};var Z=function(AU,AT){var AR=e[AU];if(!AR){e[AU]={};AR=e[AU];}var AS=AR[AT];if(!AS){AS=AU+Q+AT;AR[AT]=AS;}return AS;};var g=function(AR){x.addClass(this.element,Z(this.CSS_CLASS_NAME,AR));x.addClass(this._oAnchor,Z(this.CSS_LABEL_CLASS_NAME,AR));};var R=function(AR){x.removeClass(this.element,Z(this.CSS_CLASS_NAME,AR));x.removeClass(this._oAnchor,Z(this.CSS_LABEL_CLASS_NAME,AR));};c.prototype={CSS_CLASS_NAME:"yuimenuitem",CSS_LABEL_CLASS_NAME:"yuimenuitemlabel",SUBMENU_TYPE:null,_oAnchor:null,_oHelpTextEM:null,_oSubmenu:null,_oOnclickAttributeValue:null,_sClassName:null,constructor:c,index:null,groupIndex:null,parent:null,element:null,srcElement:null,value:null,browser:j.prototype.browser,id:null,init:function(AR,Ab){if(!this.SUBMENU_TYPE){this.SUBMENU_TYPE=AB;}this.cfg=new YAHOO.util.Config(this);this.initDefaultConfig();var AX=this.cfg,AY=O,AT,Aa,AZ,AS,AV,AU,AW;if(AQ.isString(AR)){this._createRootNodeStructure();AX.queueProperty(AL,AR);}else{if(AR&&AR.tagName){switch(AR.tagName.toUpperCase()){case i:this._createRootNodeStructure();AX.queueProperty(AL,AR.text);AX.queueProperty(H,AR.disabled);this.value=AR.value;this.srcElement=AR;break;case v:this._createRootNodeStructure();AX.queueProperty(AL,AR.label);AX.queueProperty(H,AR.disabled);this.srcElement=AR;this._initSubTree();break;case K:AZ=x.getFirstChild(AR);if(AZ){AY=AZ.getAttribute(AE,2);AS=AZ.getAttribute(AH);AV=AZ.innerHTML;}this.srcElement=AR;this.element=AR;this._oAnchor=AZ;AX.setProperty(AL,AV,true);AX.setProperty(n,AY,true);AX.setProperty(AH,AS,true);this._initSubTree();break;}}}if(this.element){AU=(this.srcElement||this.element).id;if(!AU){AU=this.id||x.generateId();this.element.id=AU;}this.id=AU;x.addClass(this.element,this.CSS_CLASS_NAME);x.addClass(this._oAnchor,this.CSS_LABEL_CLASS_NAME);AW=p.length-1;do{Aa=p[AW];AT=this.createEvent(Aa[1]);AT.signature=AK.LIST;this[Aa[0]]=AT;}while(AW--);if(Ab){AX.applyConfig(Ab);}AX.fireQueue();}},_createRootNodeStructure:function(){var AR,AS;if(!C){C=document.createElement(S);C.innerHTML=AF;}AR=C.cloneNode(true);AR.className=this.CSS_CLASS_NAME;AS=AR.firstChild;AS.className=this.CSS_LABEL_CLASS_NAME;this.element=AR;this._oAnchor=AS;},_initSubTree:function(){var AX=this.srcElement,AT=this.cfg,AV,AU,AS,AR,AW;if(AX.childNodes.length>0){if(this.parent.lazyLoad&&this.parent.srcElement&&this.parent.srcElement.tagName.toUpperCase()==r){AT.setProperty(w,{id:x.generateId(),itemdata:AX.childNodes});}else{AV=AX.firstChild;AU=[];do{if(AV&&AV.tagName){switch(AV.tagName.toUpperCase()){case X:AT.setProperty(w,AV);break;case i:AU[AU.length]=AV;break;}}}while((AV=AV.nextSibling));AS=AU.length;if(AS>0){AR=new this.SUBMENU_TYPE(x.generateId());AT.setProperty(w,AR);for(AW=0;AW<AS;AW++){AR.addItem((new AR.ITEM_TYPE(AU[AW])));}}}}},configText:function(Aa,AT,AV){var AS=AT[0],AU=this.cfg,AY=this._oAnchor,AR=AU.getProperty(L),AZ=AJ,AW=AJ,AX=AJ;if(AS){if(AR){AZ=AN+AR+I;}if(AU.getProperty(A)){AW=a;AX=I;}if(AU.getProperty(N)){AW=W;AX=y;}AY.innerHTML=(AW+AS+AX+AZ);}},configHelpText:function(AT,AS,AR){this.cfg.refireEvent(AL);},configURL:function(AT,AS,AR){var AV=AS[0];if(!AV){AV=O;}var AU=this._oAnchor;if(k.opera){AU.removeAttribute(AE);}AU.setAttribute(AE,AV);},configTarget:function(AU,AT,AS){var AR=AT[0],AV=this._oAnchor;if(AR&&AR.length>0){AV.setAttribute(AH,AR);}else{AV.removeAttribute(AH);}},configEmphasis:function(AT,AS,AR){var AV=AS[0],AU=this.cfg;
if(AV&&AU.getProperty(N)){AU.setProperty(N,false);}AU.refireEvent(AL);},configStrongEmphasis:function(AU,AT,AS){var AR=AT[0],AV=this.cfg;if(AR&&AV.getProperty(A)){AV.setProperty(A,false);}AV.refireEvent(AL);},configChecked:function(AT,AS,AR){var AV=AS[0],AU=this.cfg;if(AV){g.call(this,b);}else{R.call(this,b);}AU.refireEvent(AL);if(AU.getProperty(H)){AU.refireEvent(H);}if(AU.getProperty(B)){AU.refireEvent(B);}},configDisabled:function(AT,AS,AR){var AV=AS[0],AW=this.cfg,AU=AW.getProperty(w),AX=AW.getProperty(b);if(AV){if(AW.getProperty(B)){AW.setProperty(B,false);}g.call(this,H);if(AU){g.call(this,AI);}if(AX){g.call(this,U);}}else{R.call(this,H);if(AU){R.call(this,AI);}if(AX){R.call(this,U);}}},configSelected:function(AT,AS,AR){var AX=this.cfg,AW=this._oAnchor,AV=AS[0],AY=AX.getProperty(b),AU=AX.getProperty(w);if(k.opera){AW.blur();}if(AV&&!AX.getProperty(H)){g.call(this,B);if(AU){g.call(this,AD);}if(AY){g.call(this,T);}}else{R.call(this,B);if(AU){R.call(this,AD);}if(AY){R.call(this,T);}}if(this.hasFocus()&&k.opera){AW.focus();}},_onSubmenuBeforeHide:function(AU,AT){var AV=this.parent,AR;function AS(){AV._oAnchor.blur();AR.beforeHideEvent.unsubscribe(AS);}if(AV.hasFocus()){AR=AV.parent;AR.beforeHideEvent.subscribe(AS);}},configSubmenu:function(AY,AT,AW){var AV=AT[0],AU=this.cfg,AS=this.parent&&this.parent.lazyLoad,AX,AZ,AR;if(AV){if(AV instanceof AB){AX=AV;AX.parent=this;AX.lazyLoad=AS;}else{if(AQ.isObject(AV)&&AV.id&&!AV.nodeType){AZ=AV.id;AR=AV;AR.lazyload=AS;AR.parent=this;AX=new this.SUBMENU_TYPE(AZ,AR);AU.setProperty(w,AX,true);}else{AX=new this.SUBMENU_TYPE(AV,{lazyload:AS,parent:this});AU.setProperty(w,AX,true);}}if(AX){AX.cfg.setProperty(Y,true);g.call(this,P);if(AU.getProperty(n)===O){AU.setProperty(n,(O+AX.id));}this._oSubmenu=AX;if(k.opera){AX.beforeHideEvent.subscribe(this._onSubmenuBeforeHide);}}}else{R.call(this,P);if(this._oSubmenu){this._oSubmenu.destroy();}}if(AU.getProperty(H)){AU.refireEvent(H);}if(AU.getProperty(B)){AU.refireEvent(B);}},configOnClick:function(AT,AS,AR){var AU=AS[0];if(this._oOnclickAttributeValue&&(this._oOnclickAttributeValue!=AU)){this.clickEvent.unsubscribe(this._oOnclickAttributeValue.fn,this._oOnclickAttributeValue.obj);this._oOnclickAttributeValue=null;}if(!this._oOnclickAttributeValue&&AQ.isObject(AU)&&AQ.isFunction(AU.fn)){this.clickEvent.subscribe(AU.fn,((h in AU)?AU.obj:this),((AG in AU)?AU.scope:null));this._oOnclickAttributeValue=AU;}},configClassName:function(AU,AT,AS){var AR=AT[0];if(this._sClassName){x.removeClass(this.element,this._sClassName);}x.addClass(this.element,AR);this._sClassName=AR;},_dispatchClickEvent:function(){var AT=this,AS,AR;if(!AT.cfg.getProperty(H)){AS=x.getFirstChild(AT.element);if(k.ie){AS.fireEvent(q);}else{if((k.gecko&&k.gecko>=1.9)||k.opera||k.webkit){AR=document.createEvent("HTMLEvents");AR.initEvent(AA,true,true);}else{AR=document.createEvent("MouseEvents");AR.initMouseEvent(AA,true,true,window,0,0,0,0,0,false,false,false,false,0,null);}AS.dispatchEvent(AR);}}},_createKeyListener:function(AU,AT,AW){var AV=this,AS=AV.parent;var AR=new YAHOO.util.KeyListener(AS.element.ownerDocument,AW,{fn:AV._dispatchClickEvent,scope:AV,correctScope:true});if(AS.cfg.getProperty(V)){AR.enable();}AS.subscribe(D,AR.enable,null,AR);AS.subscribe(M,AR.disable,null,AR);AV._keyListener=AR;AS.unsubscribe(D,AV._createKeyListener,AW);},configKeyListener:function(AT,AS){var AV=AS[0],AU=this,AR=AU.parent;if(AU._keyData){AR.unsubscribe(D,AU._createKeyListener,AU._keyData);AU._keyData=null;}if(AU._keyListener){AR.unsubscribe(D,AU._keyListener.enable);AR.unsubscribe(M,AU._keyListener.disable);AU._keyListener.disable();AU._keyListener=null;}if(AV){AU._keyData=AV;AR.subscribe(D,AU._createKeyListener,AV,AU);}},initDefaultConfig:function(){var AR=this.cfg;AR.addProperty(o.key,{handler:this.configText,value:o.value,validator:o.validator,suppressEvent:o.suppressEvent});AR.addProperty(s.key,{handler:this.configHelpText,supercedes:s.supercedes,suppressEvent:s.suppressEvent});AR.addProperty(G.key,{handler:this.configURL,value:G.value,suppressEvent:G.suppressEvent});AR.addProperty(AO.key,{handler:this.configTarget,suppressEvent:AO.suppressEvent});AR.addProperty(AP.key,{handler:this.configEmphasis,value:AP.value,validator:AP.validator,suppressEvent:AP.suppressEvent,supercedes:AP.supercedes});AR.addProperty(d.key,{handler:this.configStrongEmphasis,value:d.value,validator:d.validator,suppressEvent:d.suppressEvent,supercedes:d.supercedes});AR.addProperty(l.key,{handler:this.configChecked,value:l.value,validator:l.validator,suppressEvent:l.suppressEvent,supercedes:l.supercedes});AR.addProperty(AM.key,{handler:this.configDisabled,value:AM.value,validator:AM.validator,suppressEvent:AM.suppressEvent});AR.addProperty(f.key,{handler:this.configSelected,value:f.value,validator:f.validator,suppressEvent:f.suppressEvent});AR.addProperty(F.key,{handler:this.configSubmenu,supercedes:F.supercedes,suppressEvent:F.suppressEvent});AR.addProperty(u.key,{handler:this.configOnClick,suppressEvent:u.suppressEvent});AR.addProperty(AC.key,{handler:this.configClassName,value:AC.value,validator:AC.validator,suppressEvent:AC.suppressEvent});AR.addProperty(z.key,{handler:this.configKeyListener,value:z.value,suppressEvent:z.suppressEvent});},getNextEnabledSibling:function(){var AU,AX,AR,AW,AV,AS;function AT(AY,AZ){return AY[AZ]||AT(AY,(AZ+1));}if(this.parent instanceof AB){AU=this.groupIndex;AX=this.parent.getItemGroups();if(this.index<(AX[AU].length-1)){AR=AT(AX[AU],(this.index+1));}else{if(AU<(AX.length-1)){AW=AU+1;}else{AW=0;}AV=AT(AX,AW);AR=AT(AV,0);}AS=(AR.cfg.getProperty(H)||AR.element.style.display==t)?AR.getNextEnabledSibling():AR;}return AS;},getPreviousEnabledSibling:function(){var AW,AY,AS,AR,AV,AU;function AX(AZ,Aa){return AZ[Aa]||AX(AZ,(Aa-1));}function AT(AZ,Aa){return AZ[Aa]?Aa:AT(AZ,(Aa+1));}if(this.parent instanceof AB){AW=this.groupIndex;AY=this.parent.getItemGroups();if(this.index>AT(AY[AW],0)){AS=AX(AY[AW],(this.index-1));}else{if(AW>AT(AY,0)){AR=AW-1;}else{AR=AY.length-1;
}AV=AX(AY,AR);AS=AX(AV,(AV.length-1));}AU=(AS.cfg.getProperty(H)||AS.element.style.display==t)?AS.getPreviousEnabledSibling():AS;}return AU;},focus:function(){var AU=this.parent,AT=this._oAnchor,AR=AU.activeItem;function AS(){try{if(!(k.ie&&!document.hasFocus())){if(AR){AR.blurEvent.fire();}AT.focus();this.focusEvent.fire();}}catch(AV){}}if(!this.cfg.getProperty(H)&&AU&&AU.cfg.getProperty(V)&&this.element.style.display!=t){AQ.later(0,this,AS);}},blur:function(){var AR=this.parent;if(!this.cfg.getProperty(H)&&AR&&AR.cfg.getProperty(V)){AQ.later(0,this,function(){try{this._oAnchor.blur();this.blurEvent.fire();}catch(AS){}},0);}},hasFocus:function(){return(YAHOO.widget.MenuManager.getFocusedMenuItem()==this);},destroy:function(){var AT=this.element,AS,AR,AV,AU;if(AT){AS=this.cfg.getProperty(w);if(AS){AS.destroy();}AR=AT.parentNode;if(AR){AR.removeChild(AT);this.destroyEvent.fire();}AU=p.length-1;do{AV=p[AU];this[AV[0]].unsubscribeAll();}while(AU--);this.cfg.configChangedEvent.unsubscribeAll();}},toString:function(){var AS=m,AR=this.id;if(AR){AS+=(E+AR);}return AS;}};AQ.augmentProto(c,YAHOO.util.EventProvider);})();(function(){var B="xy",C="mousedown",F="ContextMenu",J=" ";YAHOO.widget.ContextMenu=function(L,K){YAHOO.widget.ContextMenu.superclass.constructor.call(this,L,K);};var I=YAHOO.util.Event,E=YAHOO.env.ua,G=YAHOO.widget.ContextMenu,A={"TRIGGER_CONTEXT_MENU":"triggerContextMenu","CONTEXT_MENU":(E.opera?C:"contextmenu"),"CLICK":"click"},H={key:"trigger",suppressEvent:true};function D(L,K,M){this.cfg.setProperty(B,M);this.beforeShowEvent.unsubscribe(D,M);}YAHOO.lang.extend(G,YAHOO.widget.Menu,{_oTrigger:null,_bCancelled:false,contextEventTarget:null,triggerContextMenuEvent:null,init:function(L,K){G.superclass.init.call(this,L);this.beforeInitEvent.fire(G);if(K){this.cfg.applyConfig(K,true);}this.initEvent.fire(G);},initEvents:function(){G.superclass.initEvents.call(this);this.triggerContextMenuEvent=this.createEvent(A.TRIGGER_CONTEXT_MENU);this.triggerContextMenuEvent.signature=YAHOO.util.CustomEvent.LIST;},cancel:function(){this._bCancelled=true;},_removeEventHandlers:function(){var K=this._oTrigger;if(K){I.removeListener(K,A.CONTEXT_MENU,this._onTriggerContextMenu);if(E.opera){I.removeListener(K,A.CLICK,this._onTriggerClick);}}},_onTriggerClick:function(L,K){if(L.ctrlKey){I.stopEvent(L);}},_onTriggerContextMenu:function(M,K){var L;if(!(M.type==C&&!M.ctrlKey)){this.contextEventTarget=I.getTarget(M);this.triggerContextMenuEvent.fire(M);if(!this._bCancelled){I.stopEvent(M);YAHOO.widget.MenuManager.hideVisible();L=I.getXY(M);if(!YAHOO.util.Dom.inDocument(this.element)){this.beforeShowEvent.subscribe(D,L);}else{this.cfg.setProperty(B,L);}this.show();}this._bCancelled=false;}},toString:function(){var L=F,K=this.id;if(K){L+=(J+K);}return L;},initDefaultConfig:function(){G.superclass.initDefaultConfig.call(this);this.cfg.addProperty(H.key,{handler:this.configTrigger,suppressEvent:H.suppressEvent});},destroy:function(){this._removeEventHandlers();G.superclass.destroy.call(this);},configTrigger:function(L,K,N){var M=K[0];if(M){if(this._oTrigger){this._removeEventHandlers();}this._oTrigger=M;I.on(M,A.CONTEXT_MENU,this._onTriggerContextMenu,this,true);if(E.opera){I.on(M,A.CLICK,this._onTriggerClick,this,true);}}else{this._removeEventHandlers();}}});}());YAHOO.widget.ContextMenuItem=YAHOO.widget.MenuItem;(function(){var D=YAHOO.lang,N="static",M="dynamic,"+N,A="disabled",F="selected",B="autosubmenudisplay",G="submenu",C="visible",Q=" ",H="submenutoggleregion",P="MenuBar";YAHOO.widget.MenuBar=function(T,S){YAHOO.widget.MenuBar.superclass.constructor.call(this,T,S);};function O(T){var S=false;if(D.isString(T)){S=(M.indexOf((T.toLowerCase()))!=-1);}return S;}var R=YAHOO.util.Event,L=YAHOO.widget.MenuBar,K={key:"position",value:N,validator:O,supercedes:[C]},E={key:"submenualignment",value:["tl","bl"]},J={key:B,value:false,validator:D.isBoolean,suppressEvent:true},I={key:H,value:false,validator:D.isBoolean};D.extend(L,YAHOO.widget.Menu,{init:function(T,S){if(!this.ITEM_TYPE){this.ITEM_TYPE=YAHOO.widget.MenuBarItem;}L.superclass.init.call(this,T);this.beforeInitEvent.fire(L);if(S){this.cfg.applyConfig(S,true);}this.initEvent.fire(L);},CSS_CLASS_NAME:"yuimenubar",SUBMENU_TOGGLE_REGION_WIDTH:20,_onKeyDown:function(U,T,Y){var S=T[0],Z=T[1],W,X,V;if(Z&&!Z.cfg.getProperty(A)){X=Z.cfg;switch(S.keyCode){case 37:case 39:if(Z==this.activeItem&&!X.getProperty(F)){X.setProperty(F,true);}else{V=(S.keyCode==37)?Z.getPreviousEnabledSibling():Z.getNextEnabledSibling();if(V){this.clearActiveItem();V.cfg.setProperty(F,true);W=V.cfg.getProperty(G);if(W){W.show();W.setInitialFocus();}else{V.focus();}}}R.preventDefault(S);break;case 40:if(this.activeItem!=Z){this.clearActiveItem();X.setProperty(F,true);Z.focus();}W=X.getProperty(G);if(W){if(W.cfg.getProperty(C)){W.setInitialSelection();W.setInitialFocus();}else{W.show();W.setInitialFocus();}}R.preventDefault(S);break;}}if(S.keyCode==27&&this.activeItem){W=this.activeItem.cfg.getProperty(G);if(W&&W.cfg.getProperty(C)){W.hide();this.activeItem.focus();}else{this.activeItem.cfg.setProperty(F,false);this.activeItem.blur();}R.preventDefault(S);}},_onClick:function(e,Y,b){L.superclass._onClick.call(this,e,Y,b);var d=Y[1],T=true,S,f,U,W,Z,a,c,V;var X=function(){if(a.cfg.getProperty(C)){a.hide();}else{a.show();}};if(d&&!d.cfg.getProperty(A)){f=Y[0];U=R.getTarget(f);W=this.activeItem;Z=this.cfg;if(W&&W!=d){this.clearActiveItem();}d.cfg.setProperty(F,true);a=d.cfg.getProperty(G);if(a){S=d.element;c=YAHOO.util.Dom.getX(S);V=c+(S.offsetWidth-this.SUBMENU_TOGGLE_REGION_WIDTH);if(Z.getProperty(H)){if(R.getPageX(f)>V){X();R.preventDefault(f);T=false;}}else{X();}}}return T;},configSubmenuToggle:function(U,T){var S=T[0];if(S){this.cfg.setProperty(B,false);}},toString:function(){var T=P,S=this.id;if(S){T+=(Q+S);}return T;},initDefaultConfig:function(){L.superclass.initDefaultConfig.call(this);var S=this.cfg;S.addProperty(K.key,{handler:this.configPosition,value:K.value,validator:K.validator,supercedes:K.supercedes});
S.addProperty(E.key,{value:E.value,suppressEvent:E.suppressEvent});S.addProperty(J.key,{value:J.value,validator:J.validator,suppressEvent:J.suppressEvent});S.addProperty(I.key,{value:I.value,validator:I.validator,handler:this.configSubmenuToggle});}});}());YAHOO.widget.MenuBarItem=function(B,A){YAHOO.widget.MenuBarItem.superclass.constructor.call(this,B,A);};YAHOO.lang.extend(YAHOO.widget.MenuBarItem,YAHOO.widget.MenuItem,{init:function(B,A){if(!this.SUBMENU_TYPE){this.SUBMENU_TYPE=YAHOO.widget.Menu;}YAHOO.widget.MenuBarItem.superclass.init.call(this,B);var C=this.cfg;if(A){C.applyConfig(A,true);}C.fireQueue();},CSS_CLASS_NAME:"yuimenubaritem",CSS_LABEL_CLASS_NAME:"yuimenubaritemlabel",toString:function(){var A="MenuBarItem";if(this.cfg&&this.cfg.getProperty("text")){A+=(": "+this.cfg.getProperty("text"));}return A;}});YAHOO.register("menu",YAHOO.widget.Menu,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
YAHOO.widget.LogMsg=function(A){this.msg=this.time=this.category=this.source=this.sourceDetail=null;if(A&&(A.constructor==Object)){for(var B in A){if(A.hasOwnProperty(B)){this[B]=A[B];}}}};YAHOO.widget.LogWriter=function(A){if(!A){YAHOO.log("Could not instantiate LogWriter due to invalid source.","error","LogWriter");return;}this._source=A;};YAHOO.widget.LogWriter.prototype.toString=function(){return"LogWriter "+this._sSource;};YAHOO.widget.LogWriter.prototype.log=function(A,B){YAHOO.widget.Logger.log(A,B,this._source);};YAHOO.widget.LogWriter.prototype.getSource=function(){return this._source;};YAHOO.widget.LogWriter.prototype.setSource=function(A){if(!A){YAHOO.log("Could not set source due to invalid source.","error",this.toString());return;}else{this._source=A;}};YAHOO.widget.LogWriter.prototype._source=null;YAHOO.widget.LogReader=function(B,A){this._sName=YAHOO.widget.LogReader._index;YAHOO.widget.LogReader._index++;this._buffer=[];this._filterCheckboxes={};this._lastTime=YAHOO.widget.Logger.getStartTime();if(A&&(A.constructor==Object)){for(var C in A){if(A.hasOwnProperty(C)){this[C]=A[C];}}}this._initContainerEl(B);if(!this._elContainer){YAHOO.log("Could not instantiate LogReader due to an invalid container element "+B,"error",this.toString());return;}this._initHeaderEl();this._initConsoleEl();this._initFooterEl();this._initDragDrop();this._initCategories();this._initSources();YAHOO.widget.Logger.newLogEvent.subscribe(this._onNewLog,this);YAHOO.widget.Logger.logResetEvent.subscribe(this._onReset,this);YAHOO.widget.Logger.categoryCreateEvent.subscribe(this._onCategoryCreate,this);YAHOO.widget.Logger.sourceCreateEvent.subscribe(this._onSourceCreate,this);this._filterLogs();YAHOO.log("LogReader initialized",null,this.toString());};YAHOO.lang.augmentObject(YAHOO.widget.LogReader,{_index:0,ENTRY_TEMPLATE:(function(){var A=document.createElement("pre");YAHOO.util.Dom.addClass(A,"yui-log-entry");return A;})(),VERBOSE_TEMPLATE:"<p><span class='{category}'>{label}</span> {totalTime}ms (+{elapsedTime}) {localTime}:</p><p>{sourceAndDetail}</p><p>{message}</p>",BASIC_TEMPLATE:"<p><span class='{category}'>{label}</span> {totalTime}ms (+{elapsedTime}) {localTime}: {sourceAndDetail}: {message}</p>"});YAHOO.widget.LogReader.prototype={logReaderEnabled:true,width:null,height:null,top:null,left:null,right:null,bottom:null,fontSize:null,footerEnabled:true,verboseOutput:true,entryFormat:null,newestOnTop:true,outputBuffer:100,thresholdMax:500,thresholdMin:100,isCollapsed:false,isPaused:false,draggable:true,toString:function(){return"LogReader instance"+this._sName;},pause:function(){this.isPaused=true;this._timeout=null;this.logReaderEnabled=false;if(this._btnPause){this._btnPause.value="Resume";}},resume:function(){this.isPaused=false;this.logReaderEnabled=true;this._printBuffer();if(this._btnPause){this._btnPause.value="Pause";}},hide:function(){this._elContainer.style.display="none";},show:function(){this._elContainer.style.display="block";},collapse:function(){this._elConsole.style.display="none";if(this._elFt){this._elFt.style.display="none";}this._btnCollapse.value="Expand";this.isCollapsed=true;},expand:function(){this._elConsole.style.display="block";if(this._elFt){this._elFt.style.display="block";}this._btnCollapse.value="Collapse";this.isCollapsed=false;},getCheckbox:function(A){return this._filterCheckboxes[A];},getCategories:function(){return this._categoryFilters;},showCategory:function(B){var D=this._categoryFilters;if(D.indexOf){if(D.indexOf(B)>-1){return;}}else{for(var A=0;A<D.length;A++){if(D[A]===B){return;}}}this._categoryFilters.push(B);this._filterLogs();var C=this.getCheckbox(B);if(C){C.checked=true;}},hideCategory:function(B){var D=this._categoryFilters;for(var A=0;A<D.length;A++){if(B==D[A]){D.splice(A,1);break;}}this._filterLogs();var C=this.getCheckbox(B);if(C){C.checked=false;}},getSources:function(){return this._sourceFilters;},showSource:function(A){var D=this._sourceFilters;if(D.indexOf){if(D.indexOf(A)>-1){return;}}else{for(var B=0;B<D.length;B++){if(A==D[B]){return;}}}D.push(A);this._filterLogs();var C=this.getCheckbox(A);if(C){C.checked=true;}},hideSource:function(A){var D=this._sourceFilters;for(var B=0;B<D.length;B++){if(A==D[B]){D.splice(B,1);break;}}this._filterLogs();var C=this.getCheckbox(A);if(C){C.checked=false;}},clearConsole:function(){this._timeout=null;this._buffer=[];this._consoleMsgCount=0;var A=this._elConsole;A.innerHTML="";},setTitle:function(A){this._title.innerHTML=this.html2Text(A);},getLastTime:function(){return this._lastTime;},formatMsg:function(C){var B=YAHOO.widget.LogReader,A=this.entryFormat||(this.verboseOutput?B.VERBOSE_TEMPLATE:B.BASIC_TEMPLATE),D={category:C.category,label:C.category.substring(0,4).toUpperCase(),sourceAndDetail:C.sourceDetail?C.source+" "+C.sourceDetail:C.source,message:this.html2Text(C.msg||C.message||"")};if(C.time&&C.time.getTime){D.localTime=C.time.toLocaleTimeString?C.time.toLocaleTimeString():C.time.toString();D.elapsedTime=C.time.getTime()-this.getLastTime();D.totalTime=C.time.getTime()-YAHOO.widget.Logger.getStartTime();}var E=B.ENTRY_TEMPLATE.cloneNode(true);if(this.verboseOutput){E.className+=" yui-log-verbose";}E.innerHTML=A.replace(/\{(\w+)\}/g,function(F,G){return(G in D)?D[G]:"";});return E;},html2Text:function(A){if(A){A+="";return A.replace(/&/g,"&#38;").replace(/</g,"&#60;").replace(/>/g,"&#62;");}return"";},_sName:null,_buffer:null,_consoleMsgCount:0,_lastTime:null,_timeout:null,_filterCheckboxes:null,_categoryFilters:null,_sourceFilters:null,_elContainer:null,_elHd:null,_elCollapse:null,_btnCollapse:null,_title:null,_elConsole:null,_elFt:null,_elBtns:null,_elCategoryFilters:null,_elSourceFilters:null,_btnPause:null,_btnClear:null,_initContainerEl:function(B){B=YAHOO.util.Dom.get(B);if(B&&B.tagName&&(B.tagName.toLowerCase()=="div")){this._elContainer=B;YAHOO.util.Dom.addClass(this._elContainer,"yui-log");}else{this._elContainer=document.body.appendChild(document.createElement("div"));YAHOO.util.Dom.addClass(this._elContainer,"yui-log");
YAHOO.util.Dom.addClass(this._elContainer,"yui-log-container");var A=this._elContainer.style;if(this.width){A.width=this.width;}if(this.right){A.right=this.right;}if(this.top){A.top=this.top;}if(this.left){A.left=this.left;A.right="auto";}if(this.bottom){A.bottom=this.bottom;A.top="auto";}if(this.fontSize){A.fontSize=this.fontSize;}if(navigator.userAgent.toLowerCase().indexOf("opera")!=-1){document.body.style+="";}}},_initHeaderEl:function(){var A=this;if(this._elHd){YAHOO.util.Event.purgeElement(this._elHd,true);this._elHd.innerHTML="";}this._elHd=this._elContainer.appendChild(document.createElement("div"));this._elHd.id="yui-log-hd"+this._sName;this._elHd.className="yui-log-hd";this._elCollapse=this._elHd.appendChild(document.createElement("div"));this._elCollapse.className="yui-log-btns";this._btnCollapse=document.createElement("input");this._btnCollapse.type="button";this._btnCollapse.className="yui-log-button";this._btnCollapse.value="Collapse";this._btnCollapse=this._elCollapse.appendChild(this._btnCollapse);YAHOO.util.Event.addListener(A._btnCollapse,"click",A._onClickCollapseBtn,A);this._title=this._elHd.appendChild(document.createElement("h4"));this._title.innerHTML="Logger Console";},_initConsoleEl:function(){if(this._elConsole){YAHOO.util.Event.purgeElement(this._elConsole,true);this._elConsole.innerHTML="";}this._elConsole=this._elContainer.appendChild(document.createElement("div"));this._elConsole.className="yui-log-bd";if(this.height){this._elConsole.style.height=this.height;}},_initFooterEl:function(){var A=this;if(this.footerEnabled){if(this._elFt){YAHOO.util.Event.purgeElement(this._elFt,true);this._elFt.innerHTML="";}this._elFt=this._elContainer.appendChild(document.createElement("div"));this._elFt.className="yui-log-ft";this._elBtns=this._elFt.appendChild(document.createElement("div"));this._elBtns.className="yui-log-btns";this._btnPause=document.createElement("input");this._btnPause.type="button";this._btnPause.className="yui-log-button";this._btnPause.value="Pause";this._btnPause=this._elBtns.appendChild(this._btnPause);YAHOO.util.Event.addListener(A._btnPause,"click",A._onClickPauseBtn,A);this._btnClear=document.createElement("input");this._btnClear.type="button";this._btnClear.className="yui-log-button";this._btnClear.value="Clear";this._btnClear=this._elBtns.appendChild(this._btnClear);YAHOO.util.Event.addListener(A._btnClear,"click",A._onClickClearBtn,A);this._elCategoryFilters=this._elFt.appendChild(document.createElement("div"));this._elCategoryFilters.className="yui-log-categoryfilters";this._elSourceFilters=this._elFt.appendChild(document.createElement("div"));this._elSourceFilters.className="yui-log-sourcefilters";}},_initDragDrop:function(){if(YAHOO.util.DD&&this.draggable&&this._elHd){var A=new YAHOO.util.DD(this._elContainer);A.setHandleElId(this._elHd.id);this._elHd.style.cursor="move";}},_initCategories:function(){this._categoryFilters=[];var C=YAHOO.widget.Logger.categories;for(var A=0;A<C.length;A++){var B=C[A];this._categoryFilters.push(B);if(this._elCategoryFilters){this._createCategoryCheckbox(B);}}},_initSources:function(){this._sourceFilters=[];var C=YAHOO.widget.Logger.sources;for(var B=0;B<C.length;B++){var A=C[B];this._sourceFilters.push(A);if(this._elSourceFilters){this._createSourceCheckbox(A);}}},_createCategoryCheckbox:function(B){var A=this;if(this._elFt){var E=this._elCategoryFilters;var D=E.appendChild(document.createElement("span"));D.className="yui-log-filtergrp";var C=document.createElement("input");C.id="yui-log-filter-"+B+this._sName;C.className="yui-log-filter-"+B;C.type="checkbox";C.category=B;C=D.appendChild(C);C.checked=true;YAHOO.util.Event.addListener(C,"click",A._onCheckCategory,A);var F=D.appendChild(document.createElement("label"));F.htmlFor=C.id;F.className=B;F.innerHTML=B;this._filterCheckboxes[B]=C;}},_createSourceCheckbox:function(A){var D=this;if(this._elFt){var F=this._elSourceFilters;var E=F.appendChild(document.createElement("span"));E.className="yui-log-filtergrp";var C=document.createElement("input");C.id="yui-log-filter"+A+this._sName;C.className="yui-log-filter"+A;C.type="checkbox";C.source=A;C=E.appendChild(C);C.checked=true;YAHOO.util.Event.addListener(C,"click",D._onCheckSource,D);var B=E.appendChild(document.createElement("label"));B.htmlFor=C.id;B.className=A;B.innerHTML=A;this._filterCheckboxes[A]=C;}},_filterLogs:function(){if(this._elConsole!==null){this.clearConsole();this._printToConsole(YAHOO.widget.Logger.getStack());}},_printBuffer:function(){this._timeout=null;if(this._elConsole!==null){var B=this.thresholdMax;B=(B&&!isNaN(B))?B:500;if(this._consoleMsgCount<B){var A=[];for(var C=0;C<this._buffer.length;C++){A[C]=this._buffer[C];}this._buffer=[];this._printToConsole(A);}else{this._filterLogs();}if(!this.newestOnTop){this._elConsole.scrollTop=this._elConsole.scrollHeight;}}},_printToConsole:function(I){var B=I.length,M=document.createDocumentFragment(),P=[],Q=this.thresholdMin,C=this._sourceFilters.length,N=this._categoryFilters.length,K,H,G,F,L;if(isNaN(Q)||(Q>this.thresholdMax)){Q=0;}K=(B>Q)?(B-Q):0;for(H=K;H<B;H++){var E=false;var J=false;var O=I[H];var A=O.source;var D=O.category;for(G=0;G<C;G++){if(A==this._sourceFilters[G]){J=true;break;}}if(J){for(G=0;G<N;G++){if(D==this._categoryFilters[G]){E=true;break;}}}if(E){F=this.formatMsg(O);if(typeof F==="string"){P[P.length]=F;}else{M.insertBefore(F,this.newestOnTop?M.firstChild||null:null);}this._consoleMsgCount++;this._lastTime=O.time.getTime();}}if(P.length){P.splice(0,0,this._elConsole.innerHTML);this._elConsole.innerHTML=this.newestOnTop?P.reverse().join(""):P.join("");}else{if(M.firstChild){this._elConsole.insertBefore(M,this.newestOnTop?this._elConsole.firstChild||null:null);}}},_onCategoryCreate:function(D,C,A){var B=C[0];A._categoryFilters.push(B);if(A._elFt){A._createCategoryCheckbox(B);}},_onSourceCreate:function(D,C,A){var B=C[0];A._sourceFilters.push(B);if(A._elFt){A._createSourceCheckbox(B);}},_onCheckCategory:function(A,B){var C=this.category;
if(!this.checked){B.hideCategory(C);}else{B.showCategory(C);}},_onCheckSource:function(A,B){var C=this.source;if(!this.checked){B.hideSource(C);}else{B.showSource(C);}},_onClickCollapseBtn:function(A,B){if(!B.isCollapsed){B.collapse();}else{B.expand();}},_onClickPauseBtn:function(A,B){if(!B.isPaused){B.pause();}else{B.resume();}},_onClickClearBtn:function(A,B){B.clearConsole();},_onNewLog:function(D,C,A){var B=C[0];A._buffer.push(B);if(A.logReaderEnabled===true&&A._timeout===null){A._timeout=setTimeout(function(){A._printBuffer();},A.outputBuffer);}},_onReset:function(C,B,A){A._filterLogs();}};if(!YAHOO.widget.Logger){YAHOO.widget.Logger={loggerEnabled:true,_browserConsoleEnabled:false,categories:["info","warn","error","time","window"],sources:["global"],_stack:[],maxStackEntries:2500,_startTime:new Date().getTime(),_lastTime:null,_windowErrorsHandled:false,_origOnWindowError:null};YAHOO.widget.Logger.log=function(B,F,G){if(this.loggerEnabled){if(!F){F="info";}else{F=F.toLocaleLowerCase();if(this._isNewCategory(F)){this._createNewCategory(F);}}var C="global";var A=null;if(G){var D=G.indexOf(" ");if(D>0){C=G.substring(0,D);A=G.substring(D,G.length);}else{C=G;}if(this._isNewSource(C)){this._createNewSource(C);}}var H=new Date();var J=new YAHOO.widget.LogMsg({msg:B,time:H,category:F,source:C,sourceDetail:A});var I=this._stack;var E=this.maxStackEntries;if(E&&!isNaN(E)&&(I.length>=E)){I.shift();}I.push(J);this.newLogEvent.fire(J);if(this._browserConsoleEnabled){this._printToBrowserConsole(J);}return true;}else{return false;}};YAHOO.widget.Logger.reset=function(){this._stack=[];this._startTime=new Date().getTime();this.loggerEnabled=true;this.log("Logger reset");this.logResetEvent.fire();};YAHOO.widget.Logger.getStack=function(){return this._stack;};YAHOO.widget.Logger.getStartTime=function(){return this._startTime;};YAHOO.widget.Logger.disableBrowserConsole=function(){YAHOO.log("Logger output to the function console.log() has been disabled.");this._browserConsoleEnabled=false;};YAHOO.widget.Logger.enableBrowserConsole=function(){this._browserConsoleEnabled=true;YAHOO.log("Logger output to the function console.log() has been enabled.");};YAHOO.widget.Logger.handleWindowErrors=function(){if(!YAHOO.widget.Logger._windowErrorsHandled){if(window.error){YAHOO.widget.Logger._origOnWindowError=window.onerror;}window.onerror=YAHOO.widget.Logger._onWindowError;YAHOO.widget.Logger._windowErrorsHandled=true;YAHOO.log("Logger handling of window.onerror has been enabled.");}else{YAHOO.log("Logger handling of window.onerror had already been enabled.");}};YAHOO.widget.Logger.unhandleWindowErrors=function(){if(YAHOO.widget.Logger._windowErrorsHandled){if(YAHOO.widget.Logger._origOnWindowError){window.onerror=YAHOO.widget.Logger._origOnWindowError;YAHOO.widget.Logger._origOnWindowError=null;}else{window.onerror=null;}YAHOO.widget.Logger._windowErrorsHandled=false;YAHOO.log("Logger handling of window.onerror has been disabled.");}else{YAHOO.log("Logger handling of window.onerror had already been disabled.");}};YAHOO.widget.Logger.categoryCreateEvent=new YAHOO.util.CustomEvent("categoryCreate",this,true);YAHOO.widget.Logger.sourceCreateEvent=new YAHOO.util.CustomEvent("sourceCreate",this,true);YAHOO.widget.Logger.newLogEvent=new YAHOO.util.CustomEvent("newLog",this,true);YAHOO.widget.Logger.logResetEvent=new YAHOO.util.CustomEvent("logReset",this,true);YAHOO.widget.Logger._createNewCategory=function(A){this.categories.push(A);this.categoryCreateEvent.fire(A);};YAHOO.widget.Logger._isNewCategory=function(B){for(var A=0;A<this.categories.length;A++){if(B==this.categories[A]){return false;}}return true;};YAHOO.widget.Logger._createNewSource=function(A){this.sources.push(A);this.sourceCreateEvent.fire(A);};YAHOO.widget.Logger._isNewSource=function(A){if(A){for(var B=0;B<this.sources.length;B++){if(A==this.sources[B]){return false;}}return true;}};YAHOO.widget.Logger._printToBrowserConsole=function(C){if(window.console&&console.log){var E=C.category;var D=C.category.substring(0,4).toUpperCase();var G=C.time;var F;if(G.toLocaleTimeString){F=G.toLocaleTimeString();}else{F=G.toString();}var H=G.getTime();var B=(YAHOO.widget.Logger._lastTime)?(H-YAHOO.widget.Logger._lastTime):0;YAHOO.widget.Logger._lastTime=H;var A=F+" ("+B+"ms): "+C.source+": ";if(YAHOO.env.ua.webkit){A+=C.msg;}console.log(A,C.msg);}};YAHOO.widget.Logger._onWindowError=function(A,C,B){try{YAHOO.widget.Logger.log(A+" ("+C+", line "+B+")","window");if(YAHOO.widget.Logger._origOnWindowError){YAHOO.widget.Logger._origOnWindowError();}}catch(D){return false;}};YAHOO.widget.Logger.log("Logger initialized");}YAHOO.register("logger",YAHOO.widget.Logger,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(!YAHOO.util.DragDropMgr){YAHOO.util.DragDropMgr=function(){var A=YAHOO.util.Event,B=YAHOO.util.Dom;return{useShim:false,_shimActive:false,_shimState:false,_debugShim:false,_createShim:function(){var C=document.createElement("div");C.id="yui-ddm-shim";if(document.body.firstChild){document.body.insertBefore(C,document.body.firstChild);}else{document.body.appendChild(C);}C.style.display="none";C.style.backgroundColor="red";C.style.position="absolute";C.style.zIndex="99999";B.setStyle(C,"opacity","0");this._shim=C;A.on(C,"mouseup",this.handleMouseUp,this,true);A.on(C,"mousemove",this.handleMouseMove,this,true);A.on(window,"scroll",this._sizeShim,this,true);},_sizeShim:function(){if(this._shimActive){var C=this._shim;C.style.height=B.getDocumentHeight()+"px";C.style.width=B.getDocumentWidth()+"px";C.style.top="0";C.style.left="0";}},_activateShim:function(){if(this.useShim){if(!this._shim){this._createShim();}this._shimActive=true;var C=this._shim,D="0";if(this._debugShim){D=".5";}B.setStyle(C,"opacity",D);this._sizeShim();C.style.display="block";}},_deactivateShim:function(){this._shim.style.display="none";this._shimActive=false;},_shim:null,ids:{},handleIds:{},dragCurrent:null,dragOvers:{},deltaX:0,deltaY:0,preventDefault:true,stopPropagation:true,initialized:false,locked:false,interactionInfo:null,init:function(){this.initialized=true;},POINT:0,INTERSECT:1,STRICT_INTERSECT:2,mode:0,_execOnAll:function(E,D){for(var F in this.ids){for(var C in this.ids[F]){var G=this.ids[F][C];if(!this.isTypeOfDD(G)){continue;}G[E].apply(G,D);}}},_onLoad:function(){this.init();A.on(document,"mouseup",this.handleMouseUp,this,true);A.on(document,"mousemove",this.handleMouseMove,this,true);A.on(window,"unload",this._onUnload,this,true);A.on(window,"resize",this._onResize,this,true);},_onResize:function(C){this._execOnAll("resetConstraints",[]);},lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isLocked:function(){return this.locked;},locationCache:{},useCache:true,clickPixelThresh:3,clickTimeThresh:1000,dragThreshMet:false,clickTimeout:null,startX:0,startY:0,fromTimeout:false,regDragDrop:function(D,C){if(!this.initialized){this.init();}if(!this.ids[C]){this.ids[C]={};}this.ids[C][D.id]=D;},removeDDFromGroup:function(E,C){if(!this.ids[C]){this.ids[C]={};}var D=this.ids[C];if(D&&D[E.id]){delete D[E.id];}},_remove:function(E){for(var D in E.groups){if(D){var C=this.ids[D];if(C&&C[E.id]){delete C[E.id];}}}delete this.handleIds[E.id];},regHandle:function(D,C){if(!this.handleIds[D]){this.handleIds[D]={};}this.handleIds[D][C]=C;},isDragDrop:function(C){return(this.getDDById(C))?true:false;},getRelated:function(H,D){var G=[];for(var F in H.groups){for(var E in this.ids[F]){var C=this.ids[F][E];if(!this.isTypeOfDD(C)){continue;}if(!D||C.isTarget){G[G.length]=C;}}}return G;},isLegalTarget:function(G,F){var D=this.getRelated(G,true);for(var E=0,C=D.length;E<C;++E){if(D[E].id==F.id){return true;}}return false;},isTypeOfDD:function(C){return(C&&C.__ygDragDrop);},isHandle:function(D,C){return(this.handleIds[D]&&this.handleIds[D][C]);},getDDById:function(D){for(var C in this.ids){if(this.ids[C][D]){return this.ids[C][D];}}return null;},handleMouseDown:function(E,D){this.currentTarget=YAHOO.util.Event.getTarget(E);this.dragCurrent=D;var C=D.getEl();this.startX=YAHOO.util.Event.getPageX(E);this.startY=YAHOO.util.Event.getPageY(E);this.deltaX=this.startX-C.offsetLeft;this.deltaY=this.startY-C.offsetTop;this.dragThreshMet=false;this.clickTimeout=setTimeout(function(){var F=YAHOO.util.DDM;F.startDrag(F.startX,F.startY);F.fromTimeout=true;},this.clickTimeThresh);},startDrag:function(C,E){if(this.dragCurrent&&this.dragCurrent.useShim){this._shimState=this.useShim;this.useShim=true;}this._activateShim();clearTimeout(this.clickTimeout);var D=this.dragCurrent;if(D&&D.events.b4StartDrag){D.b4StartDrag(C,E);D.fireEvent("b4StartDragEvent",{x:C,y:E});}if(D&&D.events.startDrag){D.startDrag(C,E);D.fireEvent("startDragEvent",{x:C,y:E});}this.dragThreshMet=true;},handleMouseUp:function(C){if(this.dragCurrent){clearTimeout(this.clickTimeout);if(this.dragThreshMet){if(this.fromTimeout){this.fromTimeout=false;this.handleMouseMove(C);}this.fromTimeout=false;this.fireEvents(C,true);}else{}this.stopDrag(C);this.stopEvent(C);}},stopEvent:function(C){if(this.stopPropagation){YAHOO.util.Event.stopPropagation(C);}if(this.preventDefault){YAHOO.util.Event.preventDefault(C);}},stopDrag:function(E,D){var C=this.dragCurrent;if(C&&!D){if(this.dragThreshMet){if(C.events.b4EndDrag){C.b4EndDrag(E);C.fireEvent("b4EndDragEvent",{e:E});}if(C.events.endDrag){C.endDrag(E);C.fireEvent("endDragEvent",{e:E});}}if(C.events.mouseUp){C.onMouseUp(E);C.fireEvent("mouseUpEvent",{e:E});}}if(this._shimActive){this._deactivateShim();if(this.dragCurrent&&this.dragCurrent.useShim){this.useShim=this._shimState;this._shimState=false;}}this.dragCurrent=null;this.dragOvers={};},handleMouseMove:function(F){var C=this.dragCurrent;if(C){if(YAHOO.util.Event.isIE&&!F.button){this.stopEvent(F);return this.handleMouseUp(F);}else{if(F.clientX<0||F.clientY<0){}}if(!this.dragThreshMet){var E=Math.abs(this.startX-YAHOO.util.Event.getPageX(F));var D=Math.abs(this.startY-YAHOO.util.Event.getPageY(F));if(E>this.clickPixelThresh||D>this.clickPixelThresh){this.startDrag(this.startX,this.startY);}}if(this.dragThreshMet){if(C&&C.events.b4Drag){C.b4Drag(F);C.fireEvent("b4DragEvent",{e:F});}if(C&&C.events.drag){C.onDrag(F);C.fireEvent("dragEvent",{e:F});}if(C){this.fireEvents(F,false);}}this.stopEvent(F);}},fireEvents:function(V,L){var a=this.dragCurrent;if(!a||a.isLocked()||a.dragOnly){return;}var N=YAHOO.util.Event.getPageX(V),M=YAHOO.util.Event.getPageY(V),P=new YAHOO.util.Point(N,M),K=a.getTargetCoord(P.x,P.y),F=a.getDragEl(),E=["out","over","drop","enter"],U=new YAHOO.util.Region(K.y,K.x+F.offsetWidth,K.y+F.offsetHeight,K.x),I=[],D={},Q=[],c={outEvts:[],overEvts:[],dropEvts:[],enterEvts:[]};for(var S in this.dragOvers){var d=this.dragOvers[S];if(!this.isTypeOfDD(d)){continue;
}if(!this.isOverTarget(P,d,this.mode,U)){c.outEvts.push(d);}I[S]=true;delete this.dragOvers[S];}for(var R in a.groups){if("string"!=typeof R){continue;}for(S in this.ids[R]){var G=this.ids[R][S];if(!this.isTypeOfDD(G)){continue;}if(G.isTarget&&!G.isLocked()&&G!=a){if(this.isOverTarget(P,G,this.mode,U)){D[R]=true;if(L){c.dropEvts.push(G);}else{if(!I[G.id]){c.enterEvts.push(G);}else{c.overEvts.push(G);}this.dragOvers[G.id]=G;}}}}}this.interactionInfo={out:c.outEvts,enter:c.enterEvts,over:c.overEvts,drop:c.dropEvts,point:P,draggedRegion:U,sourceRegion:this.locationCache[a.id],validDrop:L};for(var C in D){Q.push(C);}if(L&&!c.dropEvts.length){this.interactionInfo.validDrop=false;if(a.events.invalidDrop){a.onInvalidDrop(V);a.fireEvent("invalidDropEvent",{e:V});}}for(S=0;S<E.length;S++){var Y=null;if(c[E[S]+"Evts"]){Y=c[E[S]+"Evts"];}if(Y&&Y.length){var H=E[S].charAt(0).toUpperCase()+E[S].substr(1),X="onDrag"+H,J="b4Drag"+H,O="drag"+H+"Event",W="drag"+H;if(this.mode){if(a.events[J]){a[J](V,Y,Q);a.fireEvent(J+"Event",{event:V,info:Y,group:Q});}if(a.events[W]){a[X](V,Y,Q);a.fireEvent(O,{event:V,info:Y,group:Q});}}else{for(var Z=0,T=Y.length;Z<T;++Z){if(a.events[J]){a[J](V,Y[Z].id,Q[0]);a.fireEvent(J+"Event",{event:V,info:Y[Z].id,group:Q[0]});}if(a.events[W]){a[X](V,Y[Z].id,Q[0]);a.fireEvent(O,{event:V,info:Y[Z].id,group:Q[0]});}}}}}},getBestMatch:function(E){var G=null;var D=E.length;if(D==1){G=E[0];}else{for(var F=0;F<D;++F){var C=E[F];if(this.mode==this.INTERSECT&&C.cursorIsOver){G=C;break;}else{if(!G||!G.overlap||(C.overlap&&G.overlap.getArea()<C.overlap.getArea())){G=C;}}}}return G;},refreshCache:function(D){var F=D||this.ids;for(var C in F){if("string"!=typeof C){continue;}for(var E in this.ids[C]){var G=this.ids[C][E];if(this.isTypeOfDD(G)){var H=this.getLocation(G);if(H){this.locationCache[G.id]=H;}else{delete this.locationCache[G.id];}}}}},verifyEl:function(D){try{if(D){var C=D.offsetParent;if(C){return true;}}}catch(E){}return false;},getLocation:function(H){if(!this.isTypeOfDD(H)){return null;}var F=H.getEl(),K,E,D,M,L,N,C,J,G;try{K=YAHOO.util.Dom.getXY(F);}catch(I){}if(!K){return null;}E=K[0];D=E+F.offsetWidth;M=K[1];L=M+F.offsetHeight;N=M-H.padding[0];C=D+H.padding[1];J=L+H.padding[2];G=E-H.padding[3];return new YAHOO.util.Region(N,C,J,G);},isOverTarget:function(K,C,E,F){var G=this.locationCache[C.id];if(!G||!this.useCache){G=this.getLocation(C);this.locationCache[C.id]=G;}if(!G){return false;}C.cursorIsOver=G.contains(K);var J=this.dragCurrent;if(!J||(!E&&!J.constrainX&&!J.constrainY)){return C.cursorIsOver;}C.overlap=null;if(!F){var H=J.getTargetCoord(K.x,K.y);var D=J.getDragEl();F=new YAHOO.util.Region(H.y,H.x+D.offsetWidth,H.y+D.offsetHeight,H.x);}var I=F.intersect(G);if(I){C.overlap=I;return(E)?true:C.cursorIsOver;}else{return false;}},_onUnload:function(D,C){this.unregAll();},unregAll:function(){if(this.dragCurrent){this.stopDrag();this.dragCurrent=null;}this._execOnAll("unreg",[]);this.ids={};},elementCache:{},getElWrapper:function(D){var C=this.elementCache[D];if(!C||!C.el){C=this.elementCache[D]=new this.ElementWrapper(YAHOO.util.Dom.get(D));}return C;},getElement:function(C){return YAHOO.util.Dom.get(C);},getCss:function(D){var C=YAHOO.util.Dom.get(D);return(C)?C.style:null;},ElementWrapper:function(C){this.el=C||null;this.id=this.el&&C.id;this.css=this.el&&C.style;},getPosX:function(C){return YAHOO.util.Dom.getX(C);},getPosY:function(C){return YAHOO.util.Dom.getY(C);},swapNode:function(E,C){if(E.swapNode){E.swapNode(C);}else{var F=C.parentNode;var D=C.nextSibling;if(D==E){F.insertBefore(E,C);}else{if(C==E.nextSibling){F.insertBefore(C,E);}else{E.parentNode.replaceChild(C,E);F.insertBefore(E,D);}}}},getScroll:function(){var E,C,F=document.documentElement,D=document.body;if(F&&(F.scrollTop||F.scrollLeft)){E=F.scrollTop;C=F.scrollLeft;}else{if(D){E=D.scrollTop;C=D.scrollLeft;}else{}}return{top:E,left:C};},getStyle:function(D,C){return YAHOO.util.Dom.getStyle(D,C);},getScrollTop:function(){return this.getScroll().top;},getScrollLeft:function(){return this.getScroll().left;},moveToEl:function(C,E){var D=YAHOO.util.Dom.getXY(E);YAHOO.util.Dom.setXY(C,D);},getClientHeight:function(){return YAHOO.util.Dom.getViewportHeight();},getClientWidth:function(){return YAHOO.util.Dom.getViewportWidth();},numericSort:function(D,C){return(D-C);},_timeoutCount:0,_addListeners:function(){var C=YAHOO.util.DDM;if(YAHOO.util.Event&&document){C._onLoad();}else{if(C._timeoutCount>2000){}else{setTimeout(C._addListeners,10);if(document&&document.body){C._timeoutCount+=1;}}}},handleWasClicked:function(C,E){if(this.isHandle(E,C.id)){return true;}else{var D=C.parentNode;while(D){if(this.isHandle(E,D.id)){return true;}else{D=D.parentNode;}}}return false;}};}();YAHOO.util.DDM=YAHOO.util.DragDropMgr;YAHOO.util.DDM._addListeners();}(function(){var A=YAHOO.util.Event;var B=YAHOO.util.Dom;YAHOO.util.DragDrop=function(E,C,D){if(E){this.init(E,C,D);}};YAHOO.util.DragDrop.prototype={events:null,on:function(){this.subscribe.apply(this,arguments);},id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isTarget:true,padding:null,dragOnly:false,useShim:false,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,deltaX:0,deltaY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,hasOuterHandles:false,cursorIsOver:false,overlap:null,b4StartDrag:function(C,D){},startDrag:function(C,D){},b4Drag:function(C){},onDrag:function(C){},onDragEnter:function(C,D){},b4DragOver:function(C){},onDragOver:function(C,D){},b4DragOut:function(C){},onDragOut:function(C,D){},b4DragDrop:function(C){},onDragDrop:function(C,D){},onInvalidDrop:function(C){},b4EndDrag:function(C){},endDrag:function(C){},b4MouseDown:function(C){},onMouseDown:function(C){},onMouseUp:function(C){},onAvailable:function(){},getEl:function(){if(!this._domRef){this._domRef=B.get(this.id);
}return this._domRef;},getDragEl:function(){return B.get(this.dragElId);},init:function(F,C,D){this.initTarget(F,C,D);A.on(this._domRef||this.id,"mousedown",this.handleMouseDown,this,true);for(var E in this.events){this.createEvent(E+"Event");}},initTarget:function(E,C,D){this.config=D||{};this.events={};this.DDM=YAHOO.util.DDM;this.groups={};if(typeof E!=="string"){this._domRef=E;E=B.generateId(E);}this.id=E;this.addToGroup((C)?C:"default");this.handleElId=E;A.onAvailable(E,this.handleOnAvailable,this,true);this.setDragElId(E);this.invalidHandleTypes={A:"A"};this.invalidHandleIds={};this.invalidHandleClasses=[];this.applyConfig();},applyConfig:function(){this.events={mouseDown:true,b4MouseDown:true,mouseUp:true,b4StartDrag:true,startDrag:true,b4EndDrag:true,endDrag:true,drag:true,b4Drag:true,invalidDrop:true,b4DragOut:true,dragOut:true,dragEnter:true,b4DragOver:true,dragOver:true,b4DragDrop:true,dragDrop:true};if(this.config.events){for(var C in this.config.events){if(this.config.events[C]===false){this.events[C]=false;}}}this.padding=this.config.padding||[0,0,0,0];this.isTarget=(this.config.isTarget!==false);this.maintainOffset=(this.config.maintainOffset);this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);this.dragOnly=((this.config.dragOnly===true)?true:false);this.useShim=((this.config.useShim===true)?true:false);},handleOnAvailable:function(){this.available=true;this.resetConstraints();this.onAvailable();},setPadding:function(E,C,F,D){if(!C&&0!==C){this.padding=[E,E,E,E];}else{if(!F&&0!==F){this.padding=[E,C,E,C];}else{this.padding=[E,C,F,D];}}},setInitPosition:function(F,E){var G=this.getEl();if(!this.DDM.verifyEl(G)){if(G&&G.style&&(G.style.display=="none")){}else{}return;}var D=F||0;var C=E||0;var H=B.getXY(G);this.initPageX=H[0]-D;this.initPageY=H[1]-C;this.lastPageX=H[0];this.lastPageY=H[1];this.setStartPosition(H);},setStartPosition:function(D){var C=D||B.getXY(this.getEl());this.deltaSetXY=null;this.startPageX=C[0];this.startPageY=C[1];},addToGroup:function(C){this.groups[C]=true;this.DDM.regDragDrop(this,C);},removeFromGroup:function(C){if(this.groups[C]){delete this.groups[C];}this.DDM.removeDDFromGroup(this,C);},setDragElId:function(C){this.dragElId=C;},setHandleElId:function(C){if(typeof C!=="string"){C=B.generateId(C);}this.handleElId=C;this.DDM.regHandle(this.id,C);},setOuterHandleElId:function(C){if(typeof C!=="string"){C=B.generateId(C);}A.on(C,"mousedown",this.handleMouseDown,this,true);this.setHandleElId(C);this.hasOuterHandles=true;},unreg:function(){A.removeListener(this.id,"mousedown",this.handleMouseDown);this._domRef=null;this.DDM._remove(this);},isLocked:function(){return(this.DDM.isLocked()||this.locked);},handleMouseDown:function(J,I){var D=J.which||J.button;if(this.primaryButtonOnly&&D>1){return;}if(this.isLocked()){return;}var C=this.b4MouseDown(J),F=true;if(this.events.b4MouseDown){F=this.fireEvent("b4MouseDownEvent",J);}var E=this.onMouseDown(J),H=true;if(this.events.mouseDown){H=this.fireEvent("mouseDownEvent",J);}if((C===false)||(E===false)||(F===false)||(H===false)){return;}this.DDM.refreshCache(this.groups);var G=new YAHOO.util.Point(A.getPageX(J),A.getPageY(J));if(!this.hasOuterHandles&&!this.DDM.isOverTarget(G,this)){}else{if(this.clickValidator(J)){this.setStartPosition();this.DDM.handleMouseDown(J,this);this.DDM.stopEvent(J);}else{}}},clickValidator:function(D){var C=YAHOO.util.Event.getTarget(D);return(this.isValidHandleChild(C)&&(this.id==this.handleElId||this.DDM.handleWasClicked(C,this.id)));},getTargetCoord:function(E,D){var C=E-this.deltaX;var F=D-this.deltaY;if(this.constrainX){if(C<this.minX){C=this.minX;}if(C>this.maxX){C=this.maxX;}}if(this.constrainY){if(F<this.minY){F=this.minY;}if(F>this.maxY){F=this.maxY;}}C=this.getTick(C,this.xTicks);F=this.getTick(F,this.yTicks);return{x:C,y:F};},addInvalidHandleType:function(C){var D=C.toUpperCase();this.invalidHandleTypes[D]=D;},addInvalidHandleId:function(C){if(typeof C!=="string"){C=B.generateId(C);}this.invalidHandleIds[C]=C;},addInvalidHandleClass:function(C){this.invalidHandleClasses.push(C);},removeInvalidHandleType:function(C){var D=C.toUpperCase();delete this.invalidHandleTypes[D];},removeInvalidHandleId:function(C){if(typeof C!=="string"){C=B.generateId(C);}delete this.invalidHandleIds[C];},removeInvalidHandleClass:function(D){for(var E=0,C=this.invalidHandleClasses.length;E<C;++E){if(this.invalidHandleClasses[E]==D){delete this.invalidHandleClasses[E];}}},isValidHandleChild:function(F){var E=true;var H;try{H=F.nodeName.toUpperCase();}catch(G){H=F.nodeName;}E=E&&!this.invalidHandleTypes[H];E=E&&!this.invalidHandleIds[F.id];for(var D=0,C=this.invalidHandleClasses.length;E&&D<C;++D){E=!B.hasClass(F,this.invalidHandleClasses[D]);}return E;},setXTicks:function(F,C){this.xTicks=[];this.xTickSize=C;var E={};for(var D=this.initPageX;D>=this.minX;D=D-C){if(!E[D]){this.xTicks[this.xTicks.length]=D;E[D]=true;}}for(D=this.initPageX;D<=this.maxX;D=D+C){if(!E[D]){this.xTicks[this.xTicks.length]=D;E[D]=true;}}this.xTicks.sort(this.DDM.numericSort);},setYTicks:function(F,C){this.yTicks=[];this.yTickSize=C;var E={};for(var D=this.initPageY;D>=this.minY;D=D-C){if(!E[D]){this.yTicks[this.yTicks.length]=D;E[D]=true;}}for(D=this.initPageY;D<=this.maxY;D=D+C){if(!E[D]){this.yTicks[this.yTicks.length]=D;E[D]=true;}}this.yTicks.sort(this.DDM.numericSort);},setXConstraint:function(E,D,C){this.leftConstraint=parseInt(E,10);this.rightConstraint=parseInt(D,10);this.minX=this.initPageX-this.leftConstraint;this.maxX=this.initPageX+this.rightConstraint;if(C){this.setXTicks(this.initPageX,C);}this.constrainX=true;},clearConstraints:function(){this.constrainX=false;this.constrainY=false;this.clearTicks();},clearTicks:function(){this.xTicks=null;this.yTicks=null;this.xTickSize=0;this.yTickSize=0;},setYConstraint:function(C,E,D){this.topConstraint=parseInt(C,10);this.bottomConstraint=parseInt(E,10);this.minY=this.initPageY-this.topConstraint;this.maxY=this.initPageY+this.bottomConstraint;if(D){this.setYTicks(this.initPageY,D);
}this.constrainY=true;},resetConstraints:function(){if(this.initPageX||this.initPageX===0){var D=(this.maintainOffset)?this.lastPageX-this.initPageX:0;var C=(this.maintainOffset)?this.lastPageY-this.initPageY:0;this.setInitPosition(D,C);}else{this.setInitPosition();}if(this.constrainX){this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize);}if(this.constrainY){this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize);}},getTick:function(I,F){if(!F){return I;}else{if(F[0]>=I){return F[0];}else{for(var D=0,C=F.length;D<C;++D){var E=D+1;if(F[E]&&F[E]>=I){var H=I-F[D];var G=F[E]-I;return(G>H)?F[D]:F[E];}}return F[F.length-1];}}},toString:function(){return("DragDrop "+this.id);}};YAHOO.augment(YAHOO.util.DragDrop,YAHOO.util.EventProvider);})();YAHOO.util.DD=function(C,A,B){if(C){this.init(C,A,B);}};YAHOO.extend(YAHOO.util.DD,YAHOO.util.DragDrop,{scroll:true,autoOffset:function(C,B){var A=C-this.startPageX;var D=B-this.startPageY;this.setDelta(A,D);},setDelta:function(B,A){this.deltaX=B;this.deltaY=A;},setDragElPos:function(C,B){var A=this.getDragEl();this.alignElWithMouse(A,C,B);},alignElWithMouse:function(C,G,F){var E=this.getTargetCoord(G,F);if(!this.deltaSetXY){var H=[E.x,E.y];YAHOO.util.Dom.setXY(C,H);var D=parseInt(YAHOO.util.Dom.getStyle(C,"left"),10);var B=parseInt(YAHOO.util.Dom.getStyle(C,"top"),10);this.deltaSetXY=[D-E.x,B-E.y];}else{YAHOO.util.Dom.setStyle(C,"left",(E.x+this.deltaSetXY[0])+"px");YAHOO.util.Dom.setStyle(C,"top",(E.y+this.deltaSetXY[1])+"px");}this.cachePosition(E.x,E.y);var A=this;setTimeout(function(){A.autoScroll.call(A,E.x,E.y,C.offsetHeight,C.offsetWidth);},0);},cachePosition:function(B,A){if(B){this.lastPageX=B;this.lastPageY=A;}else{var C=YAHOO.util.Dom.getXY(this.getEl());this.lastPageX=C[0];this.lastPageY=C[1];}},autoScroll:function(J,I,E,K){if(this.scroll){var L=this.DDM.getClientHeight();var B=this.DDM.getClientWidth();var N=this.DDM.getScrollTop();var D=this.DDM.getScrollLeft();var H=E+I;var M=K+J;var G=(L+N-I-this.deltaY);var F=(B+D-J-this.deltaX);var C=40;var A=(document.all)?80:30;if(H>L&&G<C){window.scrollTo(D,N+A);}if(I<N&&N>0&&I-N<C){window.scrollTo(D,N-A);}if(M>B&&F<C){window.scrollTo(D+A,N);}if(J<D&&D>0&&J-D<C){window.scrollTo(D-A,N);}}},applyConfig:function(){YAHOO.util.DD.superclass.applyConfig.call(this);this.scroll=(this.config.scroll!==false);},b4MouseDown:function(A){this.setStartPosition();this.autoOffset(YAHOO.util.Event.getPageX(A),YAHOO.util.Event.getPageY(A));},b4Drag:function(A){this.setDragElPos(YAHOO.util.Event.getPageX(A),YAHOO.util.Event.getPageY(A));},toString:function(){return("DD "+this.id);}});YAHOO.util.DDProxy=function(C,A,B){if(C){this.init(C,A,B);this.initFrame();}};YAHOO.util.DDProxy.dragElId="ygddfdiv";YAHOO.extend(YAHOO.util.DDProxy,YAHOO.util.DD,{resizeFrame:true,centerFrame:false,createFrame:function(){var B=this,A=document.body;if(!A||!A.firstChild){setTimeout(function(){B.createFrame();},50);return;}var F=this.getDragEl(),E=YAHOO.util.Dom;if(!F){F=document.createElement("div");F.id=this.dragElId;var D=F.style;D.position="absolute";D.visibility="hidden";D.cursor="move";D.border="2px solid #aaa";D.zIndex=999;D.height="25px";D.width="25px";var C=document.createElement("div");E.setStyle(C,"height","100%");E.setStyle(C,"width","100%");E.setStyle(C,"background-color","#ccc");E.setStyle(C,"opacity","0");F.appendChild(C);A.insertBefore(F,A.firstChild);}},initFrame:function(){this.createFrame();},applyConfig:function(){YAHOO.util.DDProxy.superclass.applyConfig.call(this);this.resizeFrame=(this.config.resizeFrame!==false);this.centerFrame=(this.config.centerFrame);this.setDragElId(this.config.dragElId||YAHOO.util.DDProxy.dragElId);},showFrame:function(E,D){var C=this.getEl();var A=this.getDragEl();var B=A.style;this._resizeProxy();if(this.centerFrame){this.setDelta(Math.round(parseInt(B.width,10)/2),Math.round(parseInt(B.height,10)/2));}this.setDragElPos(E,D);YAHOO.util.Dom.setStyle(A,"visibility","visible");},_resizeProxy:function(){if(this.resizeFrame){var H=YAHOO.util.Dom;var B=this.getEl();var C=this.getDragEl();var G=parseInt(H.getStyle(C,"borderTopWidth"),10);var I=parseInt(H.getStyle(C,"borderRightWidth"),10);var F=parseInt(H.getStyle(C,"borderBottomWidth"),10);var D=parseInt(H.getStyle(C,"borderLeftWidth"),10);if(isNaN(G)){G=0;}if(isNaN(I)){I=0;}if(isNaN(F)){F=0;}if(isNaN(D)){D=0;}var E=Math.max(0,B.offsetWidth-I-D);var A=Math.max(0,B.offsetHeight-G-F);H.setStyle(C,"width",E+"px");H.setStyle(C,"height",A+"px");}},b4MouseDown:function(B){this.setStartPosition();var A=YAHOO.util.Event.getPageX(B);var C=YAHOO.util.Event.getPageY(B);this.autoOffset(A,C);},b4StartDrag:function(A,B){this.showFrame(A,B);},b4EndDrag:function(A){YAHOO.util.Dom.setStyle(this.getDragEl(),"visibility","hidden");},endDrag:function(D){var C=YAHOO.util.Dom;var B=this.getEl();var A=this.getDragEl();C.setStyle(A,"visibility","");C.setStyle(B,"visibility","hidden");YAHOO.util.DDM.moveToEl(B,A);C.setStyle(A,"visibility","hidden");C.setStyle(B,"visibility","");},toString:function(){return("DDProxy "+this.id);}});YAHOO.util.DDTarget=function(C,A,B){if(C){this.initTarget(C,A,B);}};YAHOO.extend(YAHOO.util.DDTarget,YAHOO.util.DragDrop,{toString:function(){return("DDTarget "+this.id);}});YAHOO.register("dragdrop",YAHOO.util.DragDropMgr,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var B=YAHOO.util.Dom.getXY,A=YAHOO.util.Event,D=Array.prototype.slice;function C(G,E,F,H){C.ANIM_AVAIL=(!YAHOO.lang.isUndefined(YAHOO.util.Anim));if(G){this.init(G,E,true);this.initSlider(H);this.initThumb(F);}}YAHOO.lang.augmentObject(C,{getHorizSlider:function(F,G,I,H,E){return new C(F,F,new YAHOO.widget.SliderThumb(G,F,I,H,0,0,E),"horiz");},getVertSlider:function(G,H,E,I,F){return new C(G,G,new YAHOO.widget.SliderThumb(H,G,0,0,E,I,F),"vert");},getSliderRegion:function(G,H,J,I,E,K,F){return new C(G,G,new YAHOO.widget.SliderThumb(H,G,J,I,E,K,F),"region");},SOURCE_UI_EVENT:1,SOURCE_SET_VALUE:2,SOURCE_KEY_EVENT:3,ANIM_AVAIL:false},true);YAHOO.extend(C,YAHOO.util.DragDrop,{_mouseDown:false,dragOnly:true,initSlider:function(E){this.type=E;this.createEvent("change",this);this.createEvent("slideStart",this);this.createEvent("slideEnd",this);this.isTarget=false;this.animate=C.ANIM_AVAIL;this.backgroundEnabled=true;this.tickPause=40;this.enableKeys=true;this.keyIncrement=20;this.moveComplete=true;this.animationDuration=0.2;this.SOURCE_UI_EVENT=1;this.SOURCE_SET_VALUE=2;this.valueChangeSource=0;this._silent=false;this.lastOffset=[0,0];},initThumb:function(F){var E=this;this.thumb=F;F.cacheBetweenDrags=true;if(F._isHoriz&&F.xTicks&&F.xTicks.length){this.tickPause=Math.round(360/F.xTicks.length);}else{if(F.yTicks&&F.yTicks.length){this.tickPause=Math.round(360/F.yTicks.length);}}F.onAvailable=function(){return E.setStartSliderState();};F.onMouseDown=function(){E._mouseDown=true;return E.focus();};F.startDrag=function(){E._slideStart();};F.onDrag=function(){E.fireEvents(true);};F.onMouseUp=function(){E.thumbMouseUp();};},onAvailable:function(){this._bindKeyEvents();},_bindKeyEvents:function(){A.on(this.id,"keydown",this.handleKeyDown,this,true);A.on(this.id,"keypress",this.handleKeyPress,this,true);},handleKeyPress:function(F){if(this.enableKeys){var E=A.getCharCode(F);switch(E){case 37:case 38:case 39:case 40:case 36:case 35:A.preventDefault(F);break;default:}}},handleKeyDown:function(J){if(this.enableKeys){var G=A.getCharCode(J),F=this.thumb,H=this.getXValue(),E=this.getYValue(),I=true;switch(G){case 37:H-=this.keyIncrement;break;case 38:E-=this.keyIncrement;break;case 39:H+=this.keyIncrement;break;case 40:E+=this.keyIncrement;break;case 36:H=F.leftConstraint;E=F.topConstraint;break;case 35:H=F.rightConstraint;E=F.bottomConstraint;break;default:I=false;}if(I){if(F._isRegion){this._setRegionValue(C.SOURCE_KEY_EVENT,H,E,true);}else{this._setValue(C.SOURCE_KEY_EVENT,(F._isHoriz?H:E),true);}A.stopEvent(J);}}},setStartSliderState:function(){this.setThumbCenterPoint();this.baselinePos=B(this.getEl());this.thumb.startOffset=this.thumb.getOffsetFromParent(this.baselinePos);if(this.thumb._isRegion){if(this.deferredSetRegionValue){this._setRegionValue.apply(this,this.deferredSetRegionValue);this.deferredSetRegionValue=null;}else{this.setRegionValue(0,0,true,true,true);}}else{if(this.deferredSetValue){this._setValue.apply(this,this.deferredSetValue);this.deferredSetValue=null;}else{this.setValue(0,true,true,true);}}},setThumbCenterPoint:function(){var E=this.thumb.getEl();if(E){this.thumbCenterPoint={x:parseInt(E.offsetWidth/2,10),y:parseInt(E.offsetHeight/2,10)};}},lock:function(){this.thumb.lock();this.locked=true;},unlock:function(){this.thumb.unlock();this.locked=false;},thumbMouseUp:function(){this._mouseDown=false;if(!this.isLocked()&&!this.moveComplete){this.endMove();}},onMouseUp:function(){this._mouseDown=false;if(this.backgroundEnabled&&!this.isLocked()&&!this.moveComplete){this.endMove();}},getThumb:function(){return this.thumb;},focus:function(){this.valueChangeSource=C.SOURCE_UI_EVENT;var E=this.getEl();if(E.focus){try{E.focus();}catch(F){}}this.verifyOffset();return !this.isLocked();},onChange:function(E,F){},onSlideStart:function(){},onSlideEnd:function(){},getValue:function(){return this.thumb.getValue();},getXValue:function(){return this.thumb.getXValue();},getYValue:function(){return this.thumb.getYValue();},setValue:function(){var E=D.call(arguments);E.unshift(C.SOURCE_SET_VALUE);return this._setValue.apply(this,E);},_setValue:function(I,L,G,H,E){var F=this.thumb,K,J;if(!F.available){this.deferredSetValue=arguments;return false;}if(this.isLocked()&&!H){return false;}if(isNaN(L)){return false;}if(F._isRegion){return false;}this._silent=E;this.valueChangeSource=I||C.SOURCE_SET_VALUE;F.lastOffset=[L,L];this.verifyOffset(true);this._slideStart();if(F._isHoriz){K=F.initPageX+L+this.thumbCenterPoint.x;this.moveThumb(K,F.initPageY,G);}else{J=F.initPageY+L+this.thumbCenterPoint.y;this.moveThumb(F.initPageX,J,G);}return true;},setRegionValue:function(){var E=D.call(arguments);E.unshift(C.SOURCE_SET_VALUE);return this._setRegionValue.apply(this,E);},_setRegionValue:function(F,J,H,I,G,K){var L=this.thumb,E,M;if(!L.available){this.deferredSetRegionValue=arguments;return false;}if(this.isLocked()&&!G){return false;}if(isNaN(J)){return false;}if(!L._isRegion){return false;}this._silent=K;this.valueChangeSource=F||C.SOURCE_SET_VALUE;L.lastOffset=[J,H];this.verifyOffset(true);this._slideStart();E=L.initPageX+J+this.thumbCenterPoint.x;M=L.initPageY+H+this.thumbCenterPoint.y;this.moveThumb(E,M,I);return true;},verifyOffset:function(F){var G=B(this.getEl()),E=this.thumb;if(!this.thumbCenterPoint||!this.thumbCenterPoint.x){this.setThumbCenterPoint();}if(G){if(G[0]!=this.baselinePos[0]||G[1]!=this.baselinePos[1]){this.setInitPosition();this.baselinePos=G;E.initPageX=this.initPageX+E.startOffset[0];E.initPageY=this.initPageY+E.startOffset[1];E.deltaSetXY=null;this.resetThumbConstraints();return false;}}return true;},moveThumb:function(K,J,I,G){var L=this.thumb,M=this,F,E,H;if(!L.available){return;}L.setDelta(this.thumbCenterPoint.x,this.thumbCenterPoint.y);E=L.getTargetCoord(K,J);F=[Math.round(E.x),Math.round(E.y)];if(this.animate&&L._graduated&&!I){this.lock();this.curCoord=B(this.thumb.getEl());this.curCoord=[Math.round(this.curCoord[0]),Math.round(this.curCoord[1])];setTimeout(function(){M.moveOneTick(F);
},this.tickPause);}else{if(this.animate&&C.ANIM_AVAIL&&!I){this.lock();H=new YAHOO.util.Motion(L.id,{points:{to:F}},this.animationDuration,YAHOO.util.Easing.easeOut);H.onComplete.subscribe(function(){M.unlock();if(!M._mouseDown){M.endMove();}});H.animate();}else{L.setDragElPos(K,J);if(!G&&!this._mouseDown){this.endMove();}}}},_slideStart:function(){if(!this._sliding){if(!this._silent){this.onSlideStart();this.fireEvent("slideStart");}this._sliding=true;}},_slideEnd:function(){if(this._sliding&&this.moveComplete){var E=this._silent;this._sliding=false;this._silent=false;this.moveComplete=false;if(!E){this.onSlideEnd();this.fireEvent("slideEnd");}}},moveOneTick:function(F){var H=this.thumb,G=this,I=null,E,J;if(H._isRegion){I=this._getNextX(this.curCoord,F);E=(I!==null)?I[0]:this.curCoord[0];I=this._getNextY(this.curCoord,F);J=(I!==null)?I[1]:this.curCoord[1];I=E!==this.curCoord[0]||J!==this.curCoord[1]?[E,J]:null;}else{if(H._isHoriz){I=this._getNextX(this.curCoord,F);}else{I=this._getNextY(this.curCoord,F);}}if(I){this.curCoord=I;this.thumb.alignElWithMouse(H.getEl(),I[0]+this.thumbCenterPoint.x,I[1]+this.thumbCenterPoint.y);if(!(I[0]==F[0]&&I[1]==F[1])){setTimeout(function(){G.moveOneTick(F);},this.tickPause);}else{this.unlock();if(!this._mouseDown){this.endMove();}}}else{this.unlock();if(!this._mouseDown){this.endMove();}}},_getNextX:function(E,F){var H=this.thumb,J,G=[],I=null;if(E[0]>F[0]){J=H.tickSize-this.thumbCenterPoint.x;G=H.getTargetCoord(E[0]-J,E[1]);I=[G.x,G.y];}else{if(E[0]<F[0]){J=H.tickSize+this.thumbCenterPoint.x;G=H.getTargetCoord(E[0]+J,E[1]);I=[G.x,G.y];}else{}}return I;},_getNextY:function(E,F){var H=this.thumb,J,G=[],I=null;if(E[1]>F[1]){J=H.tickSize-this.thumbCenterPoint.y;G=H.getTargetCoord(E[0],E[1]-J);I=[G.x,G.y];}else{if(E[1]<F[1]){J=H.tickSize+this.thumbCenterPoint.y;G=H.getTargetCoord(E[0],E[1]+J);I=[G.x,G.y];}else{}}return I;},b4MouseDown:function(E){if(!this.backgroundEnabled){return false;}this.thumb.autoOffset();this.resetThumbConstraints();},onMouseDown:function(F){if(!this.backgroundEnabled||this.isLocked()){return false;}this._mouseDown=true;var E=A.getPageX(F),G=A.getPageY(F);this.focus();this._slideStart();this.moveThumb(E,G);},onDrag:function(F){if(this.backgroundEnabled&&!this.isLocked()){var E=A.getPageX(F),G=A.getPageY(F);this.moveThumb(E,G,true,true);this.fireEvents();}},endMove:function(){this.unlock();this.fireEvents();this.moveComplete=true;this._slideEnd();},resetThumbConstraints:function(){var E=this.thumb;E.setXConstraint(E.leftConstraint,E.rightConstraint,E.xTickSize);E.setYConstraint(E.topConstraint,E.bottomConstraint,E.xTickSize);},fireEvents:function(G){var F=this.thumb,I,H,E;if(!G){F.cachePosition();}if(!this.isLocked()){if(F._isRegion){I=F.getXValue();H=F.getYValue();if(I!=this.previousX||H!=this.previousY){if(!this._silent){this.onChange(I,H);this.fireEvent("change",{x:I,y:H});}}this.previousX=I;this.previousY=H;}else{E=F.getValue();if(E!=this.previousVal){if(!this._silent){this.onChange(E);this.fireEvent("change",E);}}this.previousVal=E;}}},toString:function(){return("Slider ("+this.type+") "+this.id);}});YAHOO.lang.augmentProto(C,YAHOO.util.EventProvider);YAHOO.widget.Slider=C;})();YAHOO.widget.SliderThumb=function(G,B,E,D,A,F,C){if(G){YAHOO.widget.SliderThumb.superclass.constructor.call(this,G,B);this.parentElId=B;}this.isTarget=false;this.tickSize=C;this.maintainOffset=true;this.initSlider(E,D,A,F,C);this.scroll=false;};YAHOO.extend(YAHOO.widget.SliderThumb,YAHOO.util.DD,{startOffset:null,dragOnly:true,_isHoriz:false,_prevVal:0,_graduated:false,getOffsetFromParent0:function(C){var A=YAHOO.util.Dom.getXY(this.getEl()),B=C||YAHOO.util.Dom.getXY(this.parentElId);return[(A[0]-B[0]),(A[1]-B[1])];},getOffsetFromParent:function(H){var A=this.getEl(),E,I,F,B,K,D,C,J,G;if(!this.deltaOffset){I=YAHOO.util.Dom.getXY(A);F=H||YAHOO.util.Dom.getXY(this.parentElId);E=[(I[0]-F[0]),(I[1]-F[1])];B=parseInt(YAHOO.util.Dom.getStyle(A,"left"),10);K=parseInt(YAHOO.util.Dom.getStyle(A,"top"),10);D=B-E[0];C=K-E[1];if(isNaN(D)||isNaN(C)){}else{this.deltaOffset=[D,C];}}else{J=parseInt(YAHOO.util.Dom.getStyle(A,"left"),10);G=parseInt(YAHOO.util.Dom.getStyle(A,"top"),10);E=[J+this.deltaOffset[0],G+this.deltaOffset[1]];}return E;},initSlider:function(D,C,A,E,B){this.initLeft=D;this.initRight=C;this.initUp=A;this.initDown=E;this.setXConstraint(D,C,B);this.setYConstraint(A,E,B);if(B&&B>1){this._graduated=true;}this._isHoriz=(D||C);this._isVert=(A||E);this._isRegion=(this._isHoriz&&this._isVert);},clearTicks:function(){YAHOO.widget.SliderThumb.superclass.clearTicks.call(this);this.tickSize=0;this._graduated=false;},getValue:function(){return(this._isHoriz)?this.getXValue():this.getYValue();},getXValue:function(){if(!this.available){return 0;}var A=this.getOffsetFromParent();if(YAHOO.lang.isNumber(A[0])){this.lastOffset=A;return(A[0]-this.startOffset[0]);}else{return(this.lastOffset[0]-this.startOffset[0]);}},getYValue:function(){if(!this.available){return 0;}var A=this.getOffsetFromParent();if(YAHOO.lang.isNumber(A[1])){this.lastOffset=A;return(A[1]-this.startOffset[1]);}else{return(this.lastOffset[1]-this.startOffset[1]);}},toString:function(){return"SliderThumb "+this.id;},onChange:function(A,B){}});(function(){var A=YAHOO.util.Event,B=YAHOO.widget;function C(I,F,H,D){var G=this,J={min:false,max:false},E,K;this.minSlider=I;this.maxSlider=F;this.activeSlider=I;this.isHoriz=I.thumb._isHoriz;E=this.minSlider.thumb.onMouseDown;K=this.maxSlider.thumb.onMouseDown;this.minSlider.thumb.onMouseDown=function(){G.activeSlider=G.minSlider;E.apply(this,arguments);};this.maxSlider.thumb.onMouseDown=function(){G.activeSlider=G.maxSlider;K.apply(this,arguments);};this.minSlider.thumb.onAvailable=function(){I.setStartSliderState();J.min=true;if(J.max){G.fireEvent("ready",G);}};this.maxSlider.thumb.onAvailable=function(){F.setStartSliderState();J.max=true;if(J.min){G.fireEvent("ready",G);}};I.onMouseDown=F.onMouseDown=function(L){return this.backgroundEnabled&&G._handleMouseDown(L);
};I.onDrag=F.onDrag=function(L){G._handleDrag(L);};I.onMouseUp=F.onMouseUp=function(L){G._handleMouseUp(L);};I._bindKeyEvents=function(){G._bindKeyEvents(this);};F._bindKeyEvents=function(){};I.subscribe("change",this._handleMinChange,I,this);I.subscribe("slideStart",this._handleSlideStart,I,this);I.subscribe("slideEnd",this._handleSlideEnd,I,this);F.subscribe("change",this._handleMaxChange,F,this);F.subscribe("slideStart",this._handleSlideStart,F,this);F.subscribe("slideEnd",this._handleSlideEnd,F,this);this.createEvent("ready",this);this.createEvent("change",this);this.createEvent("slideStart",this);this.createEvent("slideEnd",this);D=YAHOO.lang.isArray(D)?D:[0,H];D[0]=Math.min(Math.max(parseInt(D[0],10)|0,0),H);D[1]=Math.max(Math.min(parseInt(D[1],10)|0,H),0);if(D[0]>D[1]){D.splice(0,2,D[1],D[0]);}this.minVal=D[0];this.maxVal=D[1];this.minSlider.setValue(this.minVal,true,true,true);this.maxSlider.setValue(this.maxVal,true,true,true);}C.prototype={minVal:-1,maxVal:-1,minRange:0,_handleSlideStart:function(E,D){this.fireEvent("slideStart",D);},_handleSlideEnd:function(E,D){this.fireEvent("slideEnd",D);},_handleDrag:function(D){B.Slider.prototype.onDrag.call(this.activeSlider,D);},_handleMinChange:function(){this.activeSlider=this.minSlider;this.updateValue();},_handleMaxChange:function(){this.activeSlider=this.maxSlider;this.updateValue();},_bindKeyEvents:function(D){A.on(D.id,"keydown",this._handleKeyDown,this,true);A.on(D.id,"keypress",this._handleKeyPress,this,true);},_handleKeyDown:function(D){this.activeSlider.handleKeyDown.apply(this.activeSlider,arguments);},_handleKeyPress:function(D){this.activeSlider.handleKeyPress.apply(this.activeSlider,arguments);},setValues:function(H,K,I,E,J){var F=this.minSlider,M=this.maxSlider,D=F.thumb,L=M.thumb,N=this,G={min:false,max:false};if(D._isHoriz){D.setXConstraint(D.leftConstraint,L.rightConstraint,D.tickSize);L.setXConstraint(D.leftConstraint,L.rightConstraint,L.tickSize);}else{D.setYConstraint(D.topConstraint,L.bottomConstraint,D.tickSize);L.setYConstraint(D.topConstraint,L.bottomConstraint,L.tickSize);}this._oneTimeCallback(F,"slideEnd",function(){G.min=true;if(G.max){N.updateValue(J);setTimeout(function(){N._cleanEvent(F,"slideEnd");N._cleanEvent(M,"slideEnd");},0);}});this._oneTimeCallback(M,"slideEnd",function(){G.max=true;if(G.min){N.updateValue(J);setTimeout(function(){N._cleanEvent(F,"slideEnd");N._cleanEvent(M,"slideEnd");},0);}});F.setValue(H,I,E,false);M.setValue(K,I,E,false);},setMinValue:function(F,H,I,E){var G=this.minSlider,D=this;this.activeSlider=G;D=this;this._oneTimeCallback(G,"slideEnd",function(){D.updateValue(E);setTimeout(function(){D._cleanEvent(G,"slideEnd");},0);});G.setValue(F,H,I);},setMaxValue:function(D,H,I,F){var G=this.maxSlider,E=this;this.activeSlider=G;this._oneTimeCallback(G,"slideEnd",function(){E.updateValue(F);setTimeout(function(){E._cleanEvent(G,"slideEnd");},0);});G.setValue(D,H,I);},updateValue:function(J){var E=this.minSlider.getValue(),K=this.maxSlider.getValue(),F=false,D,M,H,I,L,G;if(E!=this.minVal||K!=this.maxVal){F=true;D=this.minSlider.thumb;M=this.maxSlider.thumb;H=this.isHoriz?"x":"y";G=this.minSlider.thumbCenterPoint[H]+this.maxSlider.thumbCenterPoint[H];I=Math.max(K-G-this.minRange,0);L=Math.min(-E-G-this.minRange,0);if(this.isHoriz){I=Math.min(I,M.rightConstraint);D.setXConstraint(D.leftConstraint,I,D.tickSize);M.setXConstraint(L,M.rightConstraint,M.tickSize);}else{I=Math.min(I,M.bottomConstraint);D.setYConstraint(D.leftConstraint,I,D.tickSize);M.setYConstraint(L,M.bottomConstraint,M.tickSize);}}this.minVal=E;this.maxVal=K;if(F&&!J){this.fireEvent("change",this);}},selectActiveSlider:function(H){var E=this.minSlider,D=this.maxSlider,J=E.isLocked()||!E.backgroundEnabled,G=D.isLocked()||!E.backgroundEnabled,F=YAHOO.util.Event,I;if(J||G){this.activeSlider=J?D:E;}else{if(this.isHoriz){I=F.getPageX(H)-E.thumb.initPageX-E.thumbCenterPoint.x;}else{I=F.getPageY(H)-E.thumb.initPageY-E.thumbCenterPoint.y;}this.activeSlider=I*2>D.getValue()+E.getValue()?D:E;}},_handleMouseDown:function(D){if(!D._handled){D._handled=true;this.selectActiveSlider(D);return B.Slider.prototype.onMouseDown.call(this.activeSlider,D);}else{return false;}},_handleMouseUp:function(D){B.Slider.prototype.onMouseUp.apply(this.activeSlider,arguments);},_oneTimeCallback:function(F,D,E){F.subscribe(D,function(){F.unsubscribe(D,arguments.callee);E.apply({},[].slice.apply(arguments));});},_cleanEvent:function(K,E){var J,I,D,G,H,F;if(K.__yui_events&&K.events[E]){for(I=K.__yui_events.length;I>=0;--I){if(K.__yui_events[I].type===E){J=K.__yui_events[I];break;}}if(J){H=J.subscribers;F=[];G=0;for(I=0,D=H.length;I<D;++I){if(H[I]){F[G++]=H[I];}}J.subscribers=F;}}}};YAHOO.lang.augmentProto(C,YAHOO.util.EventProvider);B.Slider.getHorizDualSlider=function(H,J,K,G,F,D){var I=new B.SliderThumb(J,H,0,G,0,0,F),E=new B.SliderThumb(K,H,0,G,0,0,F);return new C(new B.Slider(H,H,I,"horiz"),new B.Slider(H,H,E,"horiz"),G,D);};B.Slider.getVertDualSlider=function(H,J,K,G,F,D){var I=new B.SliderThumb(J,H,0,0,0,G,F),E=new B.SliderThumb(K,H,0,0,0,G,F);return new B.DualSlider(new B.Slider(H,H,I,"vert"),new B.Slider(H,H,E,"vert"),G,D);};YAHOO.widget.DualSlider=C;})();YAHOO.register("slider",YAHOO.widget.Slider,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var B=YAHOO.util;var A=function(D,C,E,F){if(!D){}this.init(D,C,E,F);};A.NAME="Anim";A.prototype={toString:function(){var C=this.getEl()||{};var D=C.id||C.tagName;return(this.constructor.NAME+": "+D);},patterns:{noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i},doMethod:function(C,E,D){return this.method(this.currentFrame,E,D-E,this.totalFrames);},setAttribute:function(C,F,E){var D=this.getEl();if(this.patterns.noNegatives.test(C)){F=(F>0)?F:0;}if("style" in D){B.Dom.setStyle(D,C,F+E);}else{if(C in D){D[C]=F;}}},getAttribute:function(C){var E=this.getEl();var G=B.Dom.getStyle(E,C);if(G!=="auto"&&!this.patterns.offsetUnit.test(G)){return parseFloat(G);}var D=this.patterns.offsetAttribute.exec(C)||[];var H=!!(D[3]);var F=!!(D[2]);if("style" in E){if(F||(B.Dom.getStyle(E,"position")=="absolute"&&H)){G=E["offset"+D[0].charAt(0).toUpperCase()+D[0].substr(1)];}else{G=0;}}else{if(C in E){G=E[C];}}return G;},getDefaultUnit:function(C){if(this.patterns.defaultUnit.test(C)){return"px";}return"";},setRuntimeAttribute:function(D){var I;var E;var F=this.attributes;this.runtimeAttributes[D]={};var H=function(J){return(typeof J!=="undefined");};if(!H(F[D]["to"])&&!H(F[D]["by"])){return false;}I=(H(F[D]["from"]))?F[D]["from"]:this.getAttribute(D);if(H(F[D]["to"])){E=F[D]["to"];}else{if(H(F[D]["by"])){if(I.constructor==Array){E=[];for(var G=0,C=I.length;G<C;++G){E[G]=I[G]+F[D]["by"][G]*1;}}else{E=I+F[D]["by"]*1;}}}this.runtimeAttributes[D].start=I;this.runtimeAttributes[D].end=E;this.runtimeAttributes[D].unit=(H(F[D].unit))?F[D]["unit"]:this.getDefaultUnit(D);return true;},init:function(E,J,I,C){var D=false;var F=null;var H=0;E=B.Dom.get(E);this.attributes=J||{};this.duration=!YAHOO.lang.isUndefined(I)?I:1;this.method=C||B.Easing.easeNone;this.useSeconds=true;this.currentFrame=0;this.totalFrames=B.AnimMgr.fps;this.setEl=function(M){E=B.Dom.get(M);};this.getEl=function(){return E;};this.isAnimated=function(){return D;};this.getStartTime=function(){return F;};this.runtimeAttributes={};this.animate=function(){if(this.isAnimated()){return false;}this.currentFrame=0;this.totalFrames=(this.useSeconds)?Math.ceil(B.AnimMgr.fps*this.duration):this.duration;if(this.duration===0&&this.useSeconds){this.totalFrames=1;}B.AnimMgr.registerElement(this);return true;};this.stop=function(M){if(!this.isAnimated()){return false;}if(M){this.currentFrame=this.totalFrames;this._onTween.fire();}B.AnimMgr.stop(this);};var L=function(){this.onStart.fire();this.runtimeAttributes={};for(var M in this.attributes){this.setRuntimeAttribute(M);}D=true;H=0;F=new Date();};var K=function(){var O={duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame};O.toString=function(){return("duration: "+O.duration+", currentFrame: "+O.currentFrame);};this.onTween.fire(O);var N=this.runtimeAttributes;for(var M in N){this.setAttribute(M,this.doMethod(M,N[M].start,N[M].end),N[M].unit);}H+=1;};var G=function(){var M=(new Date()-F)/1000;var N={duration:M,frames:H,fps:H/M};N.toString=function(){return("duration: "+N.duration+", frames: "+N.frames+", fps: "+N.fps);};D=false;H=0;this.onComplete.fire(N);};this._onStart=new B.CustomEvent("_start",this,true);this.onStart=new B.CustomEvent("start",this);this.onTween=new B.CustomEvent("tween",this);this._onTween=new B.CustomEvent("_tween",this,true);this.onComplete=new B.CustomEvent("complete",this);this._onComplete=new B.CustomEvent("_complete",this,true);this._onStart.subscribe(L);this._onTween.subscribe(K);this._onComplete.subscribe(G);}};B.Anim=A;})();YAHOO.util.AnimMgr=new function(){var C=null;var B=[];var A=0;this.fps=1000;this.delay=1;this.registerElement=function(F){B[B.length]=F;A+=1;F._onStart.fire();this.start();};this.unRegister=function(G,F){F=F||E(G);if(!G.isAnimated()||F==-1){return false;}G._onComplete.fire();B.splice(F,1);A-=1;if(A<=0){this.stop();}return true;};this.start=function(){if(C===null){C=setInterval(this.run,this.delay);}};this.stop=function(H){if(!H){clearInterval(C);for(var G=0,F=B.length;G<F;++G){this.unRegister(B[0],0);}B=[];C=null;A=0;}else{this.unRegister(H);}};this.run=function(){for(var H=0,F=B.length;H<F;++H){var G=B[H];if(!G||!G.isAnimated()){continue;}if(G.currentFrame<G.totalFrames||G.totalFrames===null){G.currentFrame+=1;if(G.useSeconds){D(G);}G._onTween.fire();}else{YAHOO.util.AnimMgr.stop(G,H);}}};var E=function(H){for(var G=0,F=B.length;G<F;++G){if(B[G]==H){return G;}}return -1;};var D=function(G){var J=G.totalFrames;var I=G.currentFrame;var H=(G.currentFrame*G.duration*1000/G.totalFrames);var F=(new Date()-G.getStartTime());var K=0;if(F<G.duration*1000){K=Math.round((F/H-1)*G.currentFrame);}else{K=J-(I+1);}if(K>0&&isFinite(K)){if(G.currentFrame+K>=J){K=J-(I+1);}G.currentFrame+=K;}};};YAHOO.util.Bezier=new function(){this.getPosition=function(E,D){var F=E.length;var C=[];for(var B=0;B<F;++B){C[B]=[E[B][0],E[B][1]];}for(var A=1;A<F;++A){for(B=0;B<F-A;++B){C[B][0]=(1-D)*C[B][0]+D*C[parseInt(B+1,10)][0];C[B][1]=(1-D)*C[B][1]+D*C[parseInt(B+1,10)][1];}}return[C[0][0],C[0][1]];};};(function(){var A=function(F,E,G,H){A.superclass.constructor.call(this,F,E,G,H);};A.NAME="ColorAnim";A.DEFAULT_BGCOLOR="#fff";var C=YAHOO.util;YAHOO.extend(A,C.Anim);var D=A.superclass;var B=A.prototype;B.patterns.color=/color$/i;B.patterns.rgb=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;B.patterns.hex=/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;B.patterns.hex3=/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;B.patterns.transparent=/^transparent|rgba\(0, 0, 0, 0\)$/;B.parseColor=function(E){if(E.length==3){return E;}var F=this.patterns.hex.exec(E);if(F&&F.length==4){return[parseInt(F[1],16),parseInt(F[2],16),parseInt(F[3],16)];}F=this.patterns.rgb.exec(E);if(F&&F.length==4){return[parseInt(F[1],10),parseInt(F[2],10),parseInt(F[3],10)];}F=this.patterns.hex3.exec(E);if(F&&F.length==4){return[parseInt(F[1]+F[1],16),parseInt(F[2]+F[2],16),parseInt(F[3]+F[3],16)];
}return null;};B.getAttribute=function(E){var G=this.getEl();if(this.patterns.color.test(E)){var I=YAHOO.util.Dom.getStyle(G,E);var H=this;if(this.patterns.transparent.test(I)){var F=YAHOO.util.Dom.getAncestorBy(G,function(J){return !H.patterns.transparent.test(I);});if(F){I=C.Dom.getStyle(F,E);}else{I=A.DEFAULT_BGCOLOR;}}}else{I=D.getAttribute.call(this,E);}return I;};B.doMethod=function(F,J,G){var I;if(this.patterns.color.test(F)){I=[];for(var H=0,E=J.length;H<E;++H){I[H]=D.doMethod.call(this,F,J[H],G[H]);}I="rgb("+Math.floor(I[0])+","+Math.floor(I[1])+","+Math.floor(I[2])+")";}else{I=D.doMethod.call(this,F,J,G);}return I;};B.setRuntimeAttribute=function(F){D.setRuntimeAttribute.call(this,F);if(this.patterns.color.test(F)){var H=this.attributes;var J=this.parseColor(this.runtimeAttributes[F].start);var G=this.parseColor(this.runtimeAttributes[F].end);if(typeof H[F]["to"]==="undefined"&&typeof H[F]["by"]!=="undefined"){G=this.parseColor(H[F].by);for(var I=0,E=J.length;I<E;++I){G[I]=J[I]+G[I];}}this.runtimeAttributes[F].start=J;this.runtimeAttributes[F].end=G;}};C.ColorAnim=A;})();
/*
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
YAHOO.util.Easing={easeNone:function(B,A,D,C){return D*B/C+A;},easeIn:function(B,A,D,C){return D*(B/=C)*B+A;},easeOut:function(B,A,D,C){return -D*(B/=C)*(B-2)+A;},easeBoth:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B+A;}return -D/2*((--B)*(B-2)-1)+A;},easeInStrong:function(B,A,D,C){return D*(B/=C)*B*B*B+A;},easeOutStrong:function(B,A,D,C){return -D*((B=B/C-1)*B*B*B-1)+A;},easeBothStrong:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B*B*B+A;}return -D/2*((B-=2)*B*B*B-2)+A;},elasticIn:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return -(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;},elasticOut:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return B*Math.pow(2,-10*C)*Math.sin((C*F-D)*(2*Math.PI)/E)+G+A;},elasticBoth:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F/2)==2){return A+G;}if(!E){E=F*(0.3*1.5);}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}if(C<1){return -0.5*(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;}return B*Math.pow(2,-10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E)*0.5+G+A;},backIn:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*(B/=D)*B*((C+1)*B-C)+A;},backOut:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*((B=B/D-1)*B*((C+1)*B+C)+1)+A;},backBoth:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}if((B/=D/2)<1){return E/2*(B*B*(((C*=(1.525))+1)*B-C))+A;}return E/2*((B-=2)*B*(((C*=(1.525))+1)*B+C)+2)+A;},bounceIn:function(B,A,D,C){return D-YAHOO.util.Easing.bounceOut(C-B,0,D,C)+A;},bounceOut:function(B,A,D,C){if((B/=C)<(1/2.75)){return D*(7.5625*B*B)+A;}else{if(B<(2/2.75)){return D*(7.5625*(B-=(1.5/2.75))*B+0.75)+A;}else{if(B<(2.5/2.75)){return D*(7.5625*(B-=(2.25/2.75))*B+0.9375)+A;}}}return D*(7.5625*(B-=(2.625/2.75))*B+0.984375)+A;},bounceBoth:function(B,A,D,C){if(B<C/2){return YAHOO.util.Easing.bounceIn(B*2,0,D,C)*0.5+A;}return YAHOO.util.Easing.bounceOut(B*2-C,0,D,C)*0.5+D*0.5+A;}};(function(){var A=function(H,G,I,J){if(H){A.superclass.constructor.call(this,H,G,I,J);}};A.NAME="Motion";var E=YAHOO.util;YAHOO.extend(A,E.ColorAnim);var F=A.superclass;var C=A.prototype;C.patterns.points=/^points$/i;C.setAttribute=function(G,I,H){if(this.patterns.points.test(G)){H=H||"px";F.setAttribute.call(this,"left",I[0],H);F.setAttribute.call(this,"top",I[1],H);}else{F.setAttribute.call(this,G,I,H);}};C.getAttribute=function(G){if(this.patterns.points.test(G)){var H=[F.getAttribute.call(this,"left"),F.getAttribute.call(this,"top")];}else{H=F.getAttribute.call(this,G);}return H;};C.doMethod=function(G,K,H){var J=null;if(this.patterns.points.test(G)){var I=this.method(this.currentFrame,0,100,this.totalFrames)/100;J=E.Bezier.getPosition(this.runtimeAttributes[G],I);}else{J=F.doMethod.call(this,G,K,H);}return J;};C.setRuntimeAttribute=function(P){if(this.patterns.points.test(P)){var H=this.getEl();var J=this.attributes;var G;var L=J["points"]["control"]||[];var I;var M,O;if(L.length>0&&!(L[0] instanceof Array)){L=[L];}else{var K=[];for(M=0,O=L.length;M<O;++M){K[M]=L[M];}L=K;}if(E.Dom.getStyle(H,"position")=="static"){E.Dom.setStyle(H,"position","relative");}if(D(J["points"]["from"])){E.Dom.setXY(H,J["points"]["from"]);
}else{E.Dom.setXY(H,E.Dom.getXY(H));}G=this.getAttribute("points");if(D(J["points"]["to"])){I=B.call(this,J["points"]["to"],G);var N=E.Dom.getXY(this.getEl());for(M=0,O=L.length;M<O;++M){L[M]=B.call(this,L[M],G);}}else{if(D(J["points"]["by"])){I=[G[0]+J["points"]["by"][0],G[1]+J["points"]["by"][1]];for(M=0,O=L.length;M<O;++M){L[M]=[G[0]+L[M][0],G[1]+L[M][1]];}}}this.runtimeAttributes[P]=[G];if(L.length>0){this.runtimeAttributes[P]=this.runtimeAttributes[P].concat(L);}this.runtimeAttributes[P][this.runtimeAttributes[P].length]=I;}else{F.setRuntimeAttribute.call(this,P);}};var B=function(G,I){var H=E.Dom.getXY(this.getEl());G=[G[0]-H[0]+I[0],G[1]-H[1]+I[1]];return G;};var D=function(G){return(typeof G!=="undefined");};E.Motion=A;})();(function(){var D=function(F,E,G,H){if(F){D.superclass.constructor.call(this,F,E,G,H);}};D.NAME="Scroll";var B=YAHOO.util;YAHOO.extend(D,B.ColorAnim);var C=D.superclass;var A=D.prototype;A.doMethod=function(E,H,F){var G=null;if(E=="scroll"){G=[this.method(this.currentFrame,H[0],F[0]-H[0],this.totalFrames),this.method(this.currentFrame,H[1],F[1]-H[1],this.totalFrames)];}else{G=C.doMethod.call(this,E,H,F);}return G;};A.getAttribute=function(E){var G=null;var F=this.getEl();if(E=="scroll"){G=[F.scrollLeft,F.scrollTop];}else{G=C.getAttribute.call(this,E);}return G;};A.setAttribute=function(E,H,G){var F=this.getEl();if(E=="scroll"){F.scrollLeft=H[0];F.scrollTop=H[1];}else{C.setAttribute.call(this,E,H,G);}};B.Scroll=D;})();YAHOO.register("animation",YAHOO.util.Anim,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){YAHOO.util.Config=function(D){if(D){this.init(D);}};var B=YAHOO.lang,C=YAHOO.util.CustomEvent,A=YAHOO.util.Config;A.CONFIG_CHANGED_EVENT="configChanged";A.BOOLEAN_TYPE="boolean";A.prototype={owner:null,queueInProgress:false,config:null,initialConfig:null,eventQueue:null,configChangedEvent:null,init:function(D){this.owner=D;this.configChangedEvent=this.createEvent(A.CONFIG_CHANGED_EVENT);this.configChangedEvent.signature=C.LIST;this.queueInProgress=false;this.config={};this.initialConfig={};this.eventQueue=[];},checkBoolean:function(D){return(typeof D==A.BOOLEAN_TYPE);},checkNumber:function(D){return(!isNaN(D));},fireEvent:function(D,F){var E=this.config[D];if(E&&E.event){E.event.fire(F);}},addProperty:function(E,D){E=E.toLowerCase();this.config[E]=D;D.event=this.createEvent(E,{scope:this.owner});D.event.signature=C.LIST;D.key=E;if(D.handler){D.event.subscribe(D.handler,this.owner);}this.setProperty(E,D.value,true);if(!D.suppressEvent){this.queueProperty(E,D.value);}},getConfig:function(){var D={},F=this.config,G,E;for(G in F){if(B.hasOwnProperty(F,G)){E=F[G];if(E&&E.event){D[G]=E.value;}}}return D;},getProperty:function(D){var E=this.config[D.toLowerCase()];if(E&&E.event){return E.value;}else{return undefined;}},resetProperty:function(D){D=D.toLowerCase();var E=this.config[D];if(E&&E.event){if(this.initialConfig[D]&&!B.isUndefined(this.initialConfig[D])){this.setProperty(D,this.initialConfig[D]);return true;}}else{return false;}},setProperty:function(E,G,D){var F;E=E.toLowerCase();if(this.queueInProgress&&!D){this.queueProperty(E,G);return true;}else{F=this.config[E];if(F&&F.event){if(F.validator&&!F.validator(G)){return false;}else{F.value=G;if(!D){this.fireEvent(E,G);this.configChangedEvent.fire([E,G]);}return true;}}else{return false;}}},queueProperty:function(S,P){S=S.toLowerCase();var R=this.config[S],K=false,J,G,H,I,O,Q,F,M,N,D,L,T,E;if(R&&R.event){if(!B.isUndefined(P)&&R.validator&&!R.validator(P)){return false;}else{if(!B.isUndefined(P)){R.value=P;}else{P=R.value;}K=false;J=this.eventQueue.length;for(L=0;L<J;L++){G=this.eventQueue[L];if(G){H=G[0];I=G[1];if(H==S){this.eventQueue[L]=null;this.eventQueue.push([S,(!B.isUndefined(P)?P:I)]);K=true;break;}}}if(!K&&!B.isUndefined(P)){this.eventQueue.push([S,P]);}}if(R.supercedes){O=R.supercedes.length;for(T=0;T<O;T++){Q=R.supercedes[T];F=this.eventQueue.length;for(E=0;E<F;E++){M=this.eventQueue[E];if(M){N=M[0];D=M[1];if(N==Q.toLowerCase()){this.eventQueue.push([N,D]);this.eventQueue[E]=null;break;}}}}}return true;}else{return false;}},refireEvent:function(D){D=D.toLowerCase();var E=this.config[D];if(E&&E.event&&!B.isUndefined(E.value)){if(this.queueInProgress){this.queueProperty(D);}else{this.fireEvent(D,E.value);}}},applyConfig:function(D,G){var F,E;if(G){E={};for(F in D){if(B.hasOwnProperty(D,F)){E[F.toLowerCase()]=D[F];}}this.initialConfig=E;}for(F in D){if(B.hasOwnProperty(D,F)){this.queueProperty(F,D[F]);}}},refresh:function(){var D;for(D in this.config){if(B.hasOwnProperty(this.config,D)){this.refireEvent(D);}}},fireQueue:function(){var E,H,D,G,F;this.queueInProgress=true;for(E=0;E<this.eventQueue.length;E++){H=this.eventQueue[E];if(H){D=H[0];G=H[1];F=this.config[D];F.value=G;this.eventQueue[E]=null;this.fireEvent(D,G);}}this.queueInProgress=false;this.eventQueue=[];},subscribeToConfigEvent:function(E,F,H,D){var G=this.config[E.toLowerCase()];if(G&&G.event){if(!A.alreadySubscribed(G.event,F,H)){G.event.subscribe(F,H,D);}return true;}else{return false;}},unsubscribeFromConfigEvent:function(D,E,G){var F=this.config[D.toLowerCase()];if(F&&F.event){return F.event.unsubscribe(E,G);}else{return false;}},toString:function(){var D="Config";if(this.owner){D+=" ["+this.owner.toString()+"]";}return D;},outputEventQueue:function(){var D="",G,E,F=this.eventQueue.length;for(E=0;E<F;E++){G=this.eventQueue[E];if(G){D+=G[0]+"="+G[1]+", ";}}return D;},destroy:function(){var E=this.config,D,F;for(D in E){if(B.hasOwnProperty(E,D)){F=E[D];F.event.unsubscribeAll();F.event=null;}}this.configChangedEvent.unsubscribeAll();this.configChangedEvent=null;this.owner=null;this.config=null;this.initialConfig=null;this.eventQueue=null;}};A.alreadySubscribed=function(E,H,I){var F=E.subscribers.length,D,G;if(F>0){G=F-1;do{D=E.subscribers[G];if(D&&D.obj==I&&D.fn==H){return true;}}while(G--);}return false;};YAHOO.lang.augmentProto(A,YAHOO.util.EventProvider);}());(function(){YAHOO.widget.Module=function(R,Q){if(R){this.init(R,Q);}else{}};var F=YAHOO.util.Dom,D=YAHOO.util.Config,N=YAHOO.util.Event,M=YAHOO.util.CustomEvent,G=YAHOO.widget.Module,I=YAHOO.env.ua,H,P,O,E,A={"BEFORE_INIT":"beforeInit","INIT":"init","APPEND":"append","BEFORE_RENDER":"beforeRender","RENDER":"render","CHANGE_HEADER":"changeHeader","CHANGE_BODY":"changeBody","CHANGE_FOOTER":"changeFooter","CHANGE_CONTENT":"changeContent","DESTORY":"destroy","BEFORE_SHOW":"beforeShow","SHOW":"show","BEFORE_HIDE":"beforeHide","HIDE":"hide"},J={"VISIBLE":{key:"visible",value:true,validator:YAHOO.lang.isBoolean},"EFFECT":{key:"effect",suppressEvent:true,supercedes:["visible"]},"MONITOR_RESIZE":{key:"monitorresize",value:true},"APPEND_TO_DOCUMENT_BODY":{key:"appendtodocumentbody",value:false}};G.IMG_ROOT=null;G.IMG_ROOT_SSL=null;G.CSS_MODULE="yui-module";G.CSS_HEADER="hd";G.CSS_BODY="bd";G.CSS_FOOTER="ft";G.RESIZE_MONITOR_SECURE_URL="javascript:false;";G.RESIZE_MONITOR_BUFFER=1;G.textResizeEvent=new M("textResize");G.forceDocumentRedraw=function(){var Q=document.documentElement;if(Q){Q.className+=" ";Q.className=YAHOO.lang.trim(Q.className);}};function L(){if(!H){H=document.createElement("div");H.innerHTML=('<div class="'+G.CSS_HEADER+'"></div>'+'<div class="'+G.CSS_BODY+'"></div><div class="'+G.CSS_FOOTER+'"></div>');P=H.firstChild;O=P.nextSibling;E=O.nextSibling;}return H;}function K(){if(!P){L();}return(P.cloneNode(false));}function B(){if(!O){L();}return(O.cloneNode(false));}function C(){if(!E){L();}return(E.cloneNode(false));}G.prototype={constructor:G,element:null,header:null,body:null,footer:null,id:null,imageRoot:G.IMG_ROOT,initEvents:function(){var Q=M.LIST;
this.beforeInitEvent=this.createEvent(A.BEFORE_INIT);this.beforeInitEvent.signature=Q;this.initEvent=this.createEvent(A.INIT);this.initEvent.signature=Q;this.appendEvent=this.createEvent(A.APPEND);this.appendEvent.signature=Q;this.beforeRenderEvent=this.createEvent(A.BEFORE_RENDER);this.beforeRenderEvent.signature=Q;this.renderEvent=this.createEvent(A.RENDER);this.renderEvent.signature=Q;this.changeHeaderEvent=this.createEvent(A.CHANGE_HEADER);this.changeHeaderEvent.signature=Q;this.changeBodyEvent=this.createEvent(A.CHANGE_BODY);this.changeBodyEvent.signature=Q;this.changeFooterEvent=this.createEvent(A.CHANGE_FOOTER);this.changeFooterEvent.signature=Q;this.changeContentEvent=this.createEvent(A.CHANGE_CONTENT);this.changeContentEvent.signature=Q;this.destroyEvent=this.createEvent(A.DESTORY);this.destroyEvent.signature=Q;this.beforeShowEvent=this.createEvent(A.BEFORE_SHOW);this.beforeShowEvent.signature=Q;this.showEvent=this.createEvent(A.SHOW);this.showEvent.signature=Q;this.beforeHideEvent=this.createEvent(A.BEFORE_HIDE);this.beforeHideEvent.signature=Q;this.hideEvent=this.createEvent(A.HIDE);this.hideEvent.signature=Q;},platform:function(){var Q=navigator.userAgent.toLowerCase();if(Q.indexOf("windows")!=-1||Q.indexOf("win32")!=-1){return"windows";}else{if(Q.indexOf("macintosh")!=-1){return"mac";}else{return false;}}}(),browser:function(){var Q=navigator.userAgent.toLowerCase();if(Q.indexOf("opera")!=-1){return"opera";}else{if(Q.indexOf("msie 7")!=-1){return"ie7";}else{if(Q.indexOf("msie")!=-1){return"ie";}else{if(Q.indexOf("safari")!=-1){return"safari";}else{if(Q.indexOf("gecko")!=-1){return"gecko";}else{return false;}}}}}}(),isSecure:function(){if(window.location.href.toLowerCase().indexOf("https")===0){return true;}else{return false;}}(),initDefaultConfig:function(){this.cfg.addProperty(J.VISIBLE.key,{handler:this.configVisible,value:J.VISIBLE.value,validator:J.VISIBLE.validator});this.cfg.addProperty(J.EFFECT.key,{suppressEvent:J.EFFECT.suppressEvent,supercedes:J.EFFECT.supercedes});this.cfg.addProperty(J.MONITOR_RESIZE.key,{handler:this.configMonitorResize,value:J.MONITOR_RESIZE.value});this.cfg.addProperty(J.APPEND_TO_DOCUMENT_BODY.key,{value:J.APPEND_TO_DOCUMENT_BODY.value});},init:function(V,U){var S,W;this.initEvents();this.beforeInitEvent.fire(G);this.cfg=new D(this);if(this.isSecure){this.imageRoot=G.IMG_ROOT_SSL;}if(typeof V=="string"){S=V;V=document.getElementById(V);if(!V){V=(L()).cloneNode(false);V.id=S;}}this.id=F.generateId(V);this.element=V;W=this.element.firstChild;if(W){var R=false,Q=false,T=false;do{if(1==W.nodeType){if(!R&&F.hasClass(W,G.CSS_HEADER)){this.header=W;R=true;}else{if(!Q&&F.hasClass(W,G.CSS_BODY)){this.body=W;Q=true;}else{if(!T&&F.hasClass(W,G.CSS_FOOTER)){this.footer=W;T=true;}}}}}while((W=W.nextSibling));}this.initDefaultConfig();F.addClass(this.element,G.CSS_MODULE);if(U){this.cfg.applyConfig(U,true);}if(!D.alreadySubscribed(this.renderEvent,this.cfg.fireQueue,this.cfg)){this.renderEvent.subscribe(this.cfg.fireQueue,this.cfg,true);}this.initEvent.fire(G);},initResizeMonitor:function(){var R=(I.gecko&&this.platform=="windows");if(R){var Q=this;setTimeout(function(){Q._initResizeMonitor();},0);}else{this._initResizeMonitor();}},_initResizeMonitor:function(){var Q,S,U;function W(){G.textResizeEvent.fire();}if(!I.opera){S=F.get("_yuiResizeMonitor");var V=this._supportsCWResize();if(!S){S=document.createElement("iframe");if(this.isSecure&&G.RESIZE_MONITOR_SECURE_URL&&I.ie){S.src=G.RESIZE_MONITOR_SECURE_URL;}if(!V){U=["<html><head><script ",'type="text/javascript">',"window.onresize=function(){window.parent.","YAHOO.widget.Module.textResizeEvent.","fire();};<","/script></head>","<body></body></html>"].join("");S.src="data:text/html;charset=utf-8,"+encodeURIComponent(U);}S.id="_yuiResizeMonitor";S.title="Text Resize Monitor";S.style.position="absolute";S.style.visibility="hidden";var R=document.body,T=R.firstChild;if(T){R.insertBefore(S,T);}else{R.appendChild(S);}S.style.width="2em";S.style.height="2em";S.style.top=(-1*(S.offsetHeight+G.RESIZE_MONITOR_BUFFER))+"px";S.style.left="0";S.style.borderWidth="0";S.style.visibility="visible";if(I.webkit){Q=S.contentWindow.document;Q.open();Q.close();}}if(S&&S.contentWindow){G.textResizeEvent.subscribe(this.onDomResize,this,true);if(!G.textResizeInitialized){if(V){if(!N.on(S.contentWindow,"resize",W)){N.on(S,"resize",W);}}G.textResizeInitialized=true;}this.resizeMonitor=S;}}},_supportsCWResize:function(){var Q=true;if(I.gecko&&I.gecko<=1.8){Q=false;}return Q;},onDomResize:function(S,R){var Q=-1*(this.resizeMonitor.offsetHeight+G.RESIZE_MONITOR_BUFFER);this.resizeMonitor.style.top=Q+"px";this.resizeMonitor.style.left="0";},setHeader:function(R){var Q=this.header||(this.header=K());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeHeaderEvent.fire(R);this.changeContentEvent.fire();},appendToHeader:function(R){var Q=this.header||(this.header=K());Q.appendChild(R);this.changeHeaderEvent.fire(R);this.changeContentEvent.fire();},setBody:function(R){var Q=this.body||(this.body=B());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeBodyEvent.fire(R);this.changeContentEvent.fire();},appendToBody:function(R){var Q=this.body||(this.body=B());Q.appendChild(R);this.changeBodyEvent.fire(R);this.changeContentEvent.fire();},setFooter:function(R){var Q=this.footer||(this.footer=C());if(R.nodeName){Q.innerHTML="";Q.appendChild(R);}else{Q.innerHTML=R;}this.changeFooterEvent.fire(R);this.changeContentEvent.fire();},appendToFooter:function(R){var Q=this.footer||(this.footer=C());Q.appendChild(R);this.changeFooterEvent.fire(R);this.changeContentEvent.fire();},render:function(S,Q){var T=this,U;function R(V){if(typeof V=="string"){V=document.getElementById(V);}if(V){T._addToParent(V,T.element);T.appendEvent.fire();}}this.beforeRenderEvent.fire();if(!Q){Q=this.element;}if(S){R(S);}else{if(!F.inDocument(this.element)){return false;}}if(this.header&&!F.inDocument(this.header)){U=Q.firstChild;
if(U){Q.insertBefore(this.header,U);}else{Q.appendChild(this.header);}}if(this.body&&!F.inDocument(this.body)){if(this.footer&&F.isAncestor(this.moduleElement,this.footer)){Q.insertBefore(this.body,this.footer);}else{Q.appendChild(this.body);}}if(this.footer&&!F.inDocument(this.footer)){Q.appendChild(this.footer);}this.renderEvent.fire();return true;},destroy:function(){var Q;if(this.element){N.purgeElement(this.element,true);Q=this.element.parentNode;}if(Q){Q.removeChild(this.element);}this.element=null;this.header=null;this.body=null;this.footer=null;G.textResizeEvent.unsubscribe(this.onDomResize,this);this.cfg.destroy();this.cfg=null;this.destroyEvent.fire();},show:function(){this.cfg.setProperty("visible",true);},hide:function(){this.cfg.setProperty("visible",false);},configVisible:function(R,Q,S){var T=Q[0];if(T){this.beforeShowEvent.fire();F.setStyle(this.element,"display","block");this.showEvent.fire();}else{this.beforeHideEvent.fire();F.setStyle(this.element,"display","none");this.hideEvent.fire();}},configMonitorResize:function(S,R,T){var Q=R[0];if(Q){this.initResizeMonitor();}else{G.textResizeEvent.unsubscribe(this.onDomResize,this,true);this.resizeMonitor=null;}},_addToParent:function(Q,R){if(!this.cfg.getProperty("appendtodocumentbody")&&Q===document.body&&Q.firstChild){Q.insertBefore(R,Q.firstChild);}else{Q.appendChild(R);}},toString:function(){return"Module "+this.id;}};YAHOO.lang.augmentProto(G,YAHOO.util.EventProvider);}());(function(){YAHOO.widget.Overlay=function(P,O){YAHOO.widget.Overlay.superclass.constructor.call(this,P,O);};var I=YAHOO.lang,M=YAHOO.util.CustomEvent,G=YAHOO.widget.Module,N=YAHOO.util.Event,F=YAHOO.util.Dom,D=YAHOO.util.Config,K=YAHOO.env.ua,B=YAHOO.widget.Overlay,H="subscribe",E="unsubscribe",C="contained",J,A={"BEFORE_MOVE":"beforeMove","MOVE":"move"},L={"X":{key:"x",validator:I.isNumber,suppressEvent:true,supercedes:["iframe"]},"Y":{key:"y",validator:I.isNumber,suppressEvent:true,supercedes:["iframe"]},"XY":{key:"xy",suppressEvent:true,supercedes:["iframe"]},"CONTEXT":{key:"context",suppressEvent:true,supercedes:["iframe"]},"FIXED_CENTER":{key:"fixedcenter",value:false,supercedes:["iframe","visible"]},"WIDTH":{key:"width",suppressEvent:true,supercedes:["context","fixedcenter","iframe"]},"HEIGHT":{key:"height",suppressEvent:true,supercedes:["context","fixedcenter","iframe"]},"AUTO_FILL_HEIGHT":{key:"autofillheight",supercedes:["height"],value:"body"},"ZINDEX":{key:"zindex",value:null},"CONSTRAIN_TO_VIEWPORT":{key:"constraintoviewport",value:false,validator:I.isBoolean,supercedes:["iframe","x","y","xy"]},"IFRAME":{key:"iframe",value:(K.ie==6?true:false),validator:I.isBoolean,supercedes:["zindex"]},"PREVENT_CONTEXT_OVERLAP":{key:"preventcontextoverlap",value:false,validator:I.isBoolean,supercedes:["constraintoviewport"]}};B.IFRAME_SRC="javascript:false;";B.IFRAME_OFFSET=3;B.VIEWPORT_OFFSET=10;B.TOP_LEFT="tl";B.TOP_RIGHT="tr";B.BOTTOM_LEFT="bl";B.BOTTOM_RIGHT="br";B.CSS_OVERLAY="yui-overlay";B.STD_MOD_RE=/^\s*?(body|footer|header)\s*?$/i;B.windowScrollEvent=new M("windowScroll");B.windowResizeEvent=new M("windowResize");B.windowScrollHandler=function(P){var O=N.getTarget(P);if(!O||O===window||O===window.document){if(K.ie){if(!window.scrollEnd){window.scrollEnd=-1;}clearTimeout(window.scrollEnd);window.scrollEnd=setTimeout(function(){B.windowScrollEvent.fire();},1);}else{B.windowScrollEvent.fire();}}};B.windowResizeHandler=function(O){if(K.ie){if(!window.resizeEnd){window.resizeEnd=-1;}clearTimeout(window.resizeEnd);window.resizeEnd=setTimeout(function(){B.windowResizeEvent.fire();},100);}else{B.windowResizeEvent.fire();}};B._initialized=null;if(B._initialized===null){N.on(window,"scroll",B.windowScrollHandler);N.on(window,"resize",B.windowResizeHandler);B._initialized=true;}B._TRIGGER_MAP={"windowScroll":B.windowScrollEvent,"windowResize":B.windowResizeEvent,"textResize":G.textResizeEvent};YAHOO.extend(B,G,{CONTEXT_TRIGGERS:[],init:function(P,O){B.superclass.init.call(this,P);this.beforeInitEvent.fire(B);F.addClass(this.element,B.CSS_OVERLAY);if(O){this.cfg.applyConfig(O,true);}if(this.platform=="mac"&&K.gecko){if(!D.alreadySubscribed(this.showEvent,this.showMacGeckoScrollbars,this)){this.showEvent.subscribe(this.showMacGeckoScrollbars,this,true);}if(!D.alreadySubscribed(this.hideEvent,this.hideMacGeckoScrollbars,this)){this.hideEvent.subscribe(this.hideMacGeckoScrollbars,this,true);}}this.initEvent.fire(B);},initEvents:function(){B.superclass.initEvents.call(this);var O=M.LIST;this.beforeMoveEvent=this.createEvent(A.BEFORE_MOVE);this.beforeMoveEvent.signature=O;this.moveEvent=this.createEvent(A.MOVE);this.moveEvent.signature=O;},initDefaultConfig:function(){B.superclass.initDefaultConfig.call(this);var O=this.cfg;O.addProperty(L.X.key,{handler:this.configX,validator:L.X.validator,suppressEvent:L.X.suppressEvent,supercedes:L.X.supercedes});O.addProperty(L.Y.key,{handler:this.configY,validator:L.Y.validator,suppressEvent:L.Y.suppressEvent,supercedes:L.Y.supercedes});O.addProperty(L.XY.key,{handler:this.configXY,suppressEvent:L.XY.suppressEvent,supercedes:L.XY.supercedes});O.addProperty(L.CONTEXT.key,{handler:this.configContext,suppressEvent:L.CONTEXT.suppressEvent,supercedes:L.CONTEXT.supercedes});O.addProperty(L.FIXED_CENTER.key,{handler:this.configFixedCenter,value:L.FIXED_CENTER.value,validator:L.FIXED_CENTER.validator,supercedes:L.FIXED_CENTER.supercedes});O.addProperty(L.WIDTH.key,{handler:this.configWidth,suppressEvent:L.WIDTH.suppressEvent,supercedes:L.WIDTH.supercedes});O.addProperty(L.HEIGHT.key,{handler:this.configHeight,suppressEvent:L.HEIGHT.suppressEvent,supercedes:L.HEIGHT.supercedes});O.addProperty(L.AUTO_FILL_HEIGHT.key,{handler:this.configAutoFillHeight,value:L.AUTO_FILL_HEIGHT.value,validator:this._validateAutoFill,supercedes:L.AUTO_FILL_HEIGHT.supercedes});O.addProperty(L.ZINDEX.key,{handler:this.configzIndex,value:L.ZINDEX.value});O.addProperty(L.CONSTRAIN_TO_VIEWPORT.key,{handler:this.configConstrainToViewport,value:L.CONSTRAIN_TO_VIEWPORT.value,validator:L.CONSTRAIN_TO_VIEWPORT.validator,supercedes:L.CONSTRAIN_TO_VIEWPORT.supercedes});
O.addProperty(L.IFRAME.key,{handler:this.configIframe,value:L.IFRAME.value,validator:L.IFRAME.validator,supercedes:L.IFRAME.supercedes});O.addProperty(L.PREVENT_CONTEXT_OVERLAP.key,{value:L.PREVENT_CONTEXT_OVERLAP.value,validator:L.PREVENT_CONTEXT_OVERLAP.validator,supercedes:L.PREVENT_CONTEXT_OVERLAP.supercedes});},moveTo:function(O,P){this.cfg.setProperty("xy",[O,P]);},hideMacGeckoScrollbars:function(){F.replaceClass(this.element,"show-scrollbars","hide-scrollbars");},showMacGeckoScrollbars:function(){F.replaceClass(this.element,"hide-scrollbars","show-scrollbars");},_setDomVisibility:function(O){F.setStyle(this.element,"visibility",(O)?"visible":"hidden");if(O){F.removeClass(this.element,"yui-overlay-hidden");}else{F.addClass(this.element,"yui-overlay-hidden");}},configVisible:function(R,O,X){var Q=O[0],S=F.getStyle(this.element,"visibility"),Y=this.cfg.getProperty("effect"),V=[],U=(this.platform=="mac"&&K.gecko),g=D.alreadySubscribed,W,P,f,c,b,a,d,Z,T;if(S=="inherit"){f=this.element.parentNode;while(f.nodeType!=9&&f.nodeType!=11){S=F.getStyle(f,"visibility");if(S!="inherit"){break;}f=f.parentNode;}if(S=="inherit"){S="visible";}}if(Y){if(Y instanceof Array){Z=Y.length;for(c=0;c<Z;c++){W=Y[c];V[V.length]=W.effect(this,W.duration);}}else{V[V.length]=Y.effect(this,Y.duration);}}if(Q){if(U){this.showMacGeckoScrollbars();}if(Y){if(Q){if(S!="visible"||S===""){this.beforeShowEvent.fire();T=V.length;for(b=0;b<T;b++){P=V[b];if(b===0&&!g(P.animateInCompleteEvent,this.showEvent.fire,this.showEvent)){P.animateInCompleteEvent.subscribe(this.showEvent.fire,this.showEvent,true);}P.animateIn();}}}}else{if(S!="visible"||S===""){this.beforeShowEvent.fire();this._setDomVisibility(true);this.cfg.refireEvent("iframe");this.showEvent.fire();}else{this._setDomVisibility(true);}}}else{if(U){this.hideMacGeckoScrollbars();}if(Y){if(S=="visible"){this.beforeHideEvent.fire();T=V.length;for(a=0;a<T;a++){d=V[a];if(a===0&&!g(d.animateOutCompleteEvent,this.hideEvent.fire,this.hideEvent)){d.animateOutCompleteEvent.subscribe(this.hideEvent.fire,this.hideEvent,true);}d.animateOut();}}else{if(S===""){this._setDomVisibility(false);}}}else{if(S=="visible"||S===""){this.beforeHideEvent.fire();this._setDomVisibility(false);this.hideEvent.fire();}else{this._setDomVisibility(false);}}}},doCenterOnDOMEvent:function(){var O=this.cfg,P=O.getProperty("fixedcenter");if(O.getProperty("visible")){if(P&&(P!==C||this.fitsInViewport())){this.center();}}},fitsInViewport:function(){var S=B.VIEWPORT_OFFSET,Q=this.element,T=Q.offsetWidth,R=Q.offsetHeight,O=F.getViewportWidth(),P=F.getViewportHeight();return((T+S<O)&&(R+S<P));},configFixedCenter:function(S,Q,T){var U=Q[0],P=D.alreadySubscribed,R=B.windowResizeEvent,O=B.windowScrollEvent;if(U){this.center();if(!P(this.beforeShowEvent,this.center)){this.beforeShowEvent.subscribe(this.center);}if(!P(R,this.doCenterOnDOMEvent,this)){R.subscribe(this.doCenterOnDOMEvent,this,true);}if(!P(O,this.doCenterOnDOMEvent,this)){O.subscribe(this.doCenterOnDOMEvent,this,true);}}else{this.beforeShowEvent.unsubscribe(this.center);R.unsubscribe(this.doCenterOnDOMEvent,this);O.unsubscribe(this.doCenterOnDOMEvent,this);}},configHeight:function(R,P,S){var O=P[0],Q=this.element;F.setStyle(Q,"height",O);this.cfg.refireEvent("iframe");},configAutoFillHeight:function(T,S,P){var V=S[0],Q=this.cfg,U="autofillheight",W="height",R=Q.getProperty(U),O=this._autoFillOnHeightChange;Q.unsubscribeFromConfigEvent(W,O);G.textResizeEvent.unsubscribe(O);this.changeContentEvent.unsubscribe(O);if(R&&V!==R&&this[R]){F.setStyle(this[R],W,"");}if(V){V=I.trim(V.toLowerCase());Q.subscribeToConfigEvent(W,O,this[V],this);G.textResizeEvent.subscribe(O,this[V],this);this.changeContentEvent.subscribe(O,this[V],this);Q.setProperty(U,V,true);}},configWidth:function(R,O,S){var Q=O[0],P=this.element;F.setStyle(P,"width",Q);this.cfg.refireEvent("iframe");},configzIndex:function(Q,O,R){var S=O[0],P=this.element;if(!S){S=F.getStyle(P,"zIndex");if(!S||isNaN(S)){S=0;}}if(this.iframe||this.cfg.getProperty("iframe")===true){if(S<=0){S=1;}}F.setStyle(P,"zIndex",S);this.cfg.setProperty("zIndex",S,true);if(this.iframe){this.stackIframe();}},configXY:function(Q,P,R){var T=P[0],O=T[0],S=T[1];this.cfg.setProperty("x",O);this.cfg.setProperty("y",S);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},configX:function(Q,P,R){var O=P[0],S=this.cfg.getProperty("y");this.cfg.setProperty("x",O,true);this.cfg.setProperty("y",S,true);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");F.setX(this.element,O,true);this.cfg.setProperty("xy",[O,S],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},configY:function(Q,P,R){var O=this.cfg.getProperty("x"),S=P[0];this.cfg.setProperty("x",O,true);this.cfg.setProperty("y",S,true);this.beforeMoveEvent.fire([O,S]);O=this.cfg.getProperty("x");S=this.cfg.getProperty("y");F.setY(this.element,S,true);this.cfg.setProperty("xy",[O,S],true);this.cfg.refireEvent("iframe");this.moveEvent.fire([O,S]);},showIframe:function(){var P=this.iframe,O;if(P){O=this.element.parentNode;if(O!=P.parentNode){this._addToParent(O,P);}P.style.display="block";}},hideIframe:function(){if(this.iframe){this.iframe.style.display="none";}},syncIframe:function(){var O=this.iframe,Q=this.element,S=B.IFRAME_OFFSET,P=(S*2),R;if(O){O.style.width=(Q.offsetWidth+P+"px");O.style.height=(Q.offsetHeight+P+"px");R=this.cfg.getProperty("xy");if(!I.isArray(R)||(isNaN(R[0])||isNaN(R[1]))){this.syncPosition();R=this.cfg.getProperty("xy");}F.setXY(O,[(R[0]-S),(R[1]-S)]);}},stackIframe:function(){if(this.iframe){var O=F.getStyle(this.element,"zIndex");if(!YAHOO.lang.isUndefined(O)&&!isNaN(O)){F.setStyle(this.iframe,"zIndex",(O-1));}}},configIframe:function(R,Q,S){var O=Q[0];function T(){var V=this.iframe,W=this.element,X;if(!V){if(!J){J=document.createElement("iframe");if(this.isSecure){J.src=B.IFRAME_SRC;}if(K.ie){J.style.filter="alpha(opacity=0)";
J.frameBorder=0;}else{J.style.opacity="0";}J.style.position="absolute";J.style.border="none";J.style.margin="0";J.style.padding="0";J.style.display="none";J.tabIndex=-1;}V=J.cloneNode(false);X=W.parentNode;var U=X||document.body;this._addToParent(U,V);this.iframe=V;}this.showIframe();this.syncIframe();this.stackIframe();if(!this._hasIframeEventListeners){this.showEvent.subscribe(this.showIframe);this.hideEvent.subscribe(this.hideIframe);this.changeContentEvent.subscribe(this.syncIframe);this._hasIframeEventListeners=true;}}function P(){T.call(this);this.beforeShowEvent.unsubscribe(P);this._iframeDeferred=false;}if(O){if(this.cfg.getProperty("visible")){T.call(this);}else{if(!this._iframeDeferred){this.beforeShowEvent.subscribe(P);this._iframeDeferred=true;}}}else{this.hideIframe();if(this._hasIframeEventListeners){this.showEvent.unsubscribe(this.showIframe);this.hideEvent.unsubscribe(this.hideIframe);this.changeContentEvent.unsubscribe(this.syncIframe);this._hasIframeEventListeners=false;}}},_primeXYFromDOM:function(){if(YAHOO.lang.isUndefined(this.cfg.getProperty("xy"))){this.syncPosition();this.cfg.refireEvent("xy");this.beforeShowEvent.unsubscribe(this._primeXYFromDOM);}},configConstrainToViewport:function(P,O,Q){var R=O[0];if(R){if(!D.alreadySubscribed(this.beforeMoveEvent,this.enforceConstraints,this)){this.beforeMoveEvent.subscribe(this.enforceConstraints,this,true);}if(!D.alreadySubscribed(this.beforeShowEvent,this._primeXYFromDOM)){this.beforeShowEvent.subscribe(this._primeXYFromDOM);}}else{this.beforeShowEvent.unsubscribe(this._primeXYFromDOM);this.beforeMoveEvent.unsubscribe(this.enforceConstraints,this);}},configContext:function(T,S,P){var W=S[0],Q,O,U,R,V=this.CONTEXT_TRIGGERS;if(W){Q=W[0];O=W[1];U=W[2];R=W[3];if(V&&V.length>0){R=(R||[]).concat(V);}if(Q){if(typeof Q=="string"){this.cfg.setProperty("context",[document.getElementById(Q),O,U,R],true);}if(O&&U){this.align(O,U);}if(this._contextTriggers){this._processTriggers(this._contextTriggers,E,this._alignOnTrigger);}if(R){this._processTriggers(R,H,this._alignOnTrigger);this._contextTriggers=R;}}}},_alignOnTrigger:function(P,O){this.align();},_findTriggerCE:function(O){var P=null;if(O instanceof M){P=O;}else{if(B._TRIGGER_MAP[O]){P=B._TRIGGER_MAP[O];}}return P;},_processTriggers:function(S,U,R){var Q,T;for(var P=0,O=S.length;P<O;++P){Q=S[P];T=this._findTriggerCE(Q);if(T){T[U](R,this,true);}else{this[U](Q,R);}}},align:function(P,O){var U=this.cfg.getProperty("context"),T=this,S,R,V;function Q(W,X){switch(P){case B.TOP_LEFT:T.moveTo(X,W);break;case B.TOP_RIGHT:T.moveTo((X-R.offsetWidth),W);break;case B.BOTTOM_LEFT:T.moveTo(X,(W-R.offsetHeight));break;case B.BOTTOM_RIGHT:T.moveTo((X-R.offsetWidth),(W-R.offsetHeight));break;}}if(U){S=U[0];R=this.element;T=this;if(!P){P=U[1];}if(!O){O=U[2];}if(R&&S){V=F.getRegion(S);switch(O){case B.TOP_LEFT:Q(V.top,V.left);break;case B.TOP_RIGHT:Q(V.top,V.right);break;case B.BOTTOM_LEFT:Q(V.bottom,V.left);break;case B.BOTTOM_RIGHT:Q(V.bottom,V.right);break;}}}},enforceConstraints:function(P,O,Q){var S=O[0];var R=this.getConstrainedXY(S[0],S[1]);this.cfg.setProperty("x",R[0],true);this.cfg.setProperty("y",R[1],true);this.cfg.setProperty("xy",R,true);},getConstrainedX:function(V){var S=this,O=S.element,e=O.offsetWidth,c=B.VIEWPORT_OFFSET,h=F.getViewportWidth(),d=F.getDocumentScrollLeft(),Y=(e+c<h),b=this.cfg.getProperty("context"),Q,X,j,T=false,f,W,g=d+c,P=d+h-e-c,i=V,U={"tltr":true,"blbr":true,"brbl":true,"trtl":true};var Z=function(){var k;if((S.cfg.getProperty("x")-d)>X){k=(X-e);}else{k=(X+j);}S.cfg.setProperty("x",(k+d),true);return k;};var R=function(){if((S.cfg.getProperty("x")-d)>X){return(W-c);}else{return(f-c);}};var a=function(){var k=R(),l;if(e>k){if(T){Z();}else{Z();T=true;l=a();}}return l;};if(V<g||V>P){if(Y){if(this.cfg.getProperty("preventcontextoverlap")&&b&&U[(b[1]+b[2])]){Q=b[0];X=F.getX(Q)-d;j=Q.offsetWidth;f=X;W=(h-(X+j));a();i=this.cfg.getProperty("x");}else{if(V<g){i=g;}else{if(V>P){i=P;}}}}else{i=c+d;}}return i;},getConstrainedY:function(Z){var W=this,P=W.element,i=P.offsetHeight,h=B.VIEWPORT_OFFSET,d=F.getViewportHeight(),g=F.getDocumentScrollTop(),e=(i+h<d),f=this.cfg.getProperty("context"),U,a,b,X=false,V,Q,c=g+h,S=g+d-i-h,O=Z,Y={"trbr":true,"tlbl":true,"bltl":true,"brtr":true};var T=function(){var k;if((W.cfg.getProperty("y")-g)>a){k=(a-i);}else{k=(a+b);}W.cfg.setProperty("y",(k+g),true);return k;};var R=function(){if((W.cfg.getProperty("y")-g)>a){return(Q-h);}else{return(V-h);}};var j=function(){var l=R(),k;if(i>l){if(X){T();}else{T();X=true;k=j();}}return k;};if(Z<c||Z>S){if(e){if(this.cfg.getProperty("preventcontextoverlap")&&f&&Y[(f[1]+f[2])]){U=f[0];b=U.offsetHeight;a=(F.getY(U)-g);V=a;Q=(d-(a+b));j();O=W.cfg.getProperty("y");}else{if(Z<c){O=c;}else{if(Z>S){O=S;}}}}else{O=h+g;}}return O;},getConstrainedXY:function(O,P){return[this.getConstrainedX(O),this.getConstrainedY(P)];},center:function(){var R=B.VIEWPORT_OFFSET,S=this.element.offsetWidth,Q=this.element.offsetHeight,P=F.getViewportWidth(),T=F.getViewportHeight(),O,U;if(S<P){O=(P/2)-(S/2)+F.getDocumentScrollLeft();}else{O=R+F.getDocumentScrollLeft();}if(Q<T){U=(T/2)-(Q/2)+F.getDocumentScrollTop();}else{U=R+F.getDocumentScrollTop();}this.cfg.setProperty("xy",[parseInt(O,10),parseInt(U,10)]);this.cfg.refireEvent("iframe");if(K.webkit){this.forceContainerRedraw();}},syncPosition:function(){var O=F.getXY(this.element);this.cfg.setProperty("x",O[0],true);this.cfg.setProperty("y",O[1],true);this.cfg.setProperty("xy",O,true);},onDomResize:function(Q,P){var O=this;B.superclass.onDomResize.call(this,Q,P);setTimeout(function(){O.syncPosition();O.cfg.refireEvent("iframe");O.cfg.refireEvent("context");},0);},_getComputedHeight:(function(){if(document.defaultView&&document.defaultView.getComputedStyle){return function(P){var O=null;if(P.ownerDocument&&P.ownerDocument.defaultView){var Q=P.ownerDocument.defaultView.getComputedStyle(P,"");if(Q){O=parseInt(Q.height,10);}}return(I.isNumber(O))?O:null;};}else{return function(P){var O=null;
if(P.style.pixelHeight){O=P.style.pixelHeight;}return(I.isNumber(O))?O:null;};}})(),_validateAutoFillHeight:function(O){return(!O)||(I.isString(O)&&B.STD_MOD_RE.test(O));},_autoFillOnHeightChange:function(R,P,Q){var O=this.cfg.getProperty("height");if((O&&O!=="auto")||(O===0)){this.fillHeight(Q);}},_getPreciseHeight:function(P){var O=P.offsetHeight;if(P.getBoundingClientRect){var Q=P.getBoundingClientRect();O=Q.bottom-Q.top;}return O;},fillHeight:function(R){if(R){var P=this.innerElement||this.element,O=[this.header,this.body,this.footer],V,W=0,X=0,T=0,Q=false;for(var U=0,S=O.length;U<S;U++){V=O[U];if(V){if(R!==V){X+=this._getPreciseHeight(V);}else{Q=true;}}}if(Q){if(K.ie||K.opera){F.setStyle(R,"height",0+"px");}W=this._getComputedHeight(P);if(W===null){F.addClass(P,"yui-override-padding");W=P.clientHeight;F.removeClass(P,"yui-override-padding");}T=Math.max(W-X,0);F.setStyle(R,"height",T+"px");if(R.offsetHeight!=T){T=Math.max(T-(R.offsetHeight-T),0);}F.setStyle(R,"height",T+"px");}}},bringToTop:function(){var S=[],R=this.element;function V(Z,Y){var b=F.getStyle(Z,"zIndex"),a=F.getStyle(Y,"zIndex"),X=(!b||isNaN(b))?0:parseInt(b,10),W=(!a||isNaN(a))?0:parseInt(a,10);if(X>W){return -1;}else{if(X<W){return 1;}else{return 0;}}}function Q(Y){var X=F.hasClass(Y,B.CSS_OVERLAY),W=YAHOO.widget.Panel;if(X&&!F.isAncestor(R,Y)){if(W&&F.hasClass(Y,W.CSS_PANEL)){S[S.length]=Y.parentNode;}else{S[S.length]=Y;}}}F.getElementsBy(Q,"DIV",document.body);S.sort(V);var O=S[0],U;if(O){U=F.getStyle(O,"zIndex");if(!isNaN(U)){var T=false;if(O!=R){T=true;}else{if(S.length>1){var P=F.getStyle(S[1],"zIndex");if(!isNaN(P)&&(U==P)){T=true;}}}if(T){this.cfg.setProperty("zindex",(parseInt(U,10)+2));}}}},destroy:function(){if(this.iframe){this.iframe.parentNode.removeChild(this.iframe);}this.iframe=null;B.windowResizeEvent.unsubscribe(this.doCenterOnDOMEvent,this);B.windowScrollEvent.unsubscribe(this.doCenterOnDOMEvent,this);G.textResizeEvent.unsubscribe(this._autoFillOnHeightChange);B.superclass.destroy.call(this);},forceContainerRedraw:function(){var O=this;F.addClass(O.element,"yui-force-redraw");setTimeout(function(){F.removeClass(O.element,"yui-force-redraw");},0);},toString:function(){return"Overlay "+this.id;}});}());(function(){YAHOO.widget.OverlayManager=function(G){this.init(G);};var D=YAHOO.widget.Overlay,C=YAHOO.util.Event,E=YAHOO.util.Dom,B=YAHOO.util.Config,F=YAHOO.util.CustomEvent,A=YAHOO.widget.OverlayManager;A.CSS_FOCUSED="focused";A.prototype={constructor:A,overlays:null,initDefaultConfig:function(){this.cfg.addProperty("overlays",{suppressEvent:true});this.cfg.addProperty("focusevent",{value:"mousedown"});},init:function(I){this.cfg=new B(this);this.initDefaultConfig();if(I){this.cfg.applyConfig(I,true);}this.cfg.fireQueue();var H=null;this.getActive=function(){return H;};this.focus=function(J){var K=this.find(J);if(K){K.focus();}};this.remove=function(K){var M=this.find(K),J;if(M){if(H==M){H=null;}var L=(M.element===null&&M.cfg===null)?true:false;if(!L){J=E.getStyle(M.element,"zIndex");M.cfg.setProperty("zIndex",-1000,true);}this.overlays.sort(this.compareZIndexDesc);this.overlays=this.overlays.slice(0,(this.overlays.length-1));M.hideEvent.unsubscribe(M.blur);M.destroyEvent.unsubscribe(this._onOverlayDestroy,M);M.focusEvent.unsubscribe(this._onOverlayFocusHandler,M);M.blurEvent.unsubscribe(this._onOverlayBlurHandler,M);if(!L){C.removeListener(M.element,this.cfg.getProperty("focusevent"),this._onOverlayElementFocus);M.cfg.setProperty("zIndex",J,true);M.cfg.setProperty("manager",null);}if(M.focusEvent._managed){M.focusEvent=null;}if(M.blurEvent._managed){M.blurEvent=null;}if(M.focus._managed){M.focus=null;}if(M.blur._managed){M.blur=null;}}};this.blurAll=function(){var K=this.overlays.length,J;if(K>0){J=K-1;do{this.overlays[J].blur();}while(J--);}};this._manageBlur=function(J){var K=false;if(H==J){E.removeClass(H.element,A.CSS_FOCUSED);H=null;K=true;}return K;};this._manageFocus=function(J){var K=false;if(H!=J){if(H){H.blur();}H=J;this.bringToTop(H);E.addClass(H.element,A.CSS_FOCUSED);K=true;}return K;};var G=this.cfg.getProperty("overlays");if(!this.overlays){this.overlays=[];}if(G){this.register(G);this.overlays.sort(this.compareZIndexDesc);}},_onOverlayElementFocus:function(I){var G=C.getTarget(I),H=this.close;if(H&&(G==H||E.isAncestor(H,G))){this.blur();}else{this.focus();}},_onOverlayDestroy:function(H,G,I){this.remove(I);},_onOverlayFocusHandler:function(H,G,I){this._manageFocus(I);},_onOverlayBlurHandler:function(H,G,I){this._manageBlur(I);},_bindFocus:function(G){var H=this;if(!G.focusEvent){G.focusEvent=G.createEvent("focus");G.focusEvent.signature=F.LIST;G.focusEvent._managed=true;}else{G.focusEvent.subscribe(H._onOverlayFocusHandler,G,H);}if(!G.focus){C.on(G.element,H.cfg.getProperty("focusevent"),H._onOverlayElementFocus,null,G);G.focus=function(){if(H._manageFocus(this)){if(this.cfg.getProperty("visible")&&this.focusFirst){this.focusFirst();}this.focusEvent.fire();}};G.focus._managed=true;}},_bindBlur:function(G){var H=this;if(!G.blurEvent){G.blurEvent=G.createEvent("blur");G.blurEvent.signature=F.LIST;G.focusEvent._managed=true;}else{G.blurEvent.subscribe(H._onOverlayBlurHandler,G,H);}if(!G.blur){G.blur=function(){if(H._manageBlur(this)){this.blurEvent.fire();}};G.blur._managed=true;}G.hideEvent.subscribe(G.blur);},_bindDestroy:function(G){var H=this;G.destroyEvent.subscribe(H._onOverlayDestroy,G,H);},_syncZIndex:function(G){var H=E.getStyle(G.element,"zIndex");if(!isNaN(H)){G.cfg.setProperty("zIndex",parseInt(H,10));}else{G.cfg.setProperty("zIndex",0);}},register:function(G){var J=false,H,I;if(G instanceof D){G.cfg.addProperty("manager",{value:this});this._bindFocus(G);this._bindBlur(G);this._bindDestroy(G);this._syncZIndex(G);this.overlays.push(G);this.bringToTop(G);J=true;}else{if(G instanceof Array){for(H=0,I=G.length;H<I;H++){J=this.register(G[H])||J;}}}return J;},bringToTop:function(M){var I=this.find(M),L,G,J;if(I){J=this.overlays;J.sort(this.compareZIndexDesc);G=J[0];if(G){L=E.getStyle(G.element,"zIndex");
if(!isNaN(L)){var K=false;if(G!==I){K=true;}else{if(J.length>1){var H=E.getStyle(J[1].element,"zIndex");if(!isNaN(H)&&(L==H)){K=true;}}}if(K){I.cfg.setProperty("zindex",(parseInt(L,10)+2));}}J.sort(this.compareZIndexDesc);}}},find:function(G){var K=G instanceof D,I=this.overlays,M=I.length,J=null,L,H;if(K||typeof G=="string"){for(H=M-1;H>=0;H--){L=I[H];if((K&&(L===G))||(L.id==G)){J=L;break;}}}return J;},compareZIndexDesc:function(J,I){var H=(J.cfg)?J.cfg.getProperty("zIndex"):null,G=(I.cfg)?I.cfg.getProperty("zIndex"):null;if(H===null&&G===null){return 0;}else{if(H===null){return 1;}else{if(G===null){return -1;}else{if(H>G){return -1;}else{if(H<G){return 1;}else{return 0;}}}}}},showAll:function(){var H=this.overlays,I=H.length,G;for(G=I-1;G>=0;G--){H[G].show();}},hideAll:function(){var H=this.overlays,I=H.length,G;for(G=I-1;G>=0;G--){H[G].hide();}},toString:function(){return"OverlayManager";}};}());(function(){YAHOO.widget.Tooltip=function(P,O){YAHOO.widget.Tooltip.superclass.constructor.call(this,P,O);};var E=YAHOO.lang,N=YAHOO.util.Event,M=YAHOO.util.CustomEvent,C=YAHOO.util.Dom,J=YAHOO.widget.Tooltip,H=YAHOO.env.ua,G=(H.ie&&(H.ie<=6||document.compatMode=="BackCompat")),F,I={"PREVENT_OVERLAP":{key:"preventoverlap",value:true,validator:E.isBoolean,supercedes:["x","y","xy"]},"SHOW_DELAY":{key:"showdelay",value:200,validator:E.isNumber},"AUTO_DISMISS_DELAY":{key:"autodismissdelay",value:5000,validator:E.isNumber},"HIDE_DELAY":{key:"hidedelay",value:250,validator:E.isNumber},"TEXT":{key:"text",suppressEvent:true},"CONTAINER":{key:"container"},"DISABLED":{key:"disabled",value:false,suppressEvent:true}},A={"CONTEXT_MOUSE_OVER":"contextMouseOver","CONTEXT_MOUSE_OUT":"contextMouseOut","CONTEXT_TRIGGER":"contextTrigger"};J.CSS_TOOLTIP="yui-tt";function K(Q,O){var P=this.cfg,R=P.getProperty("width");if(R==O){P.setProperty("width",Q);}}function D(P,O){if("_originalWidth" in this){K.call(this,this._originalWidth,this._forcedWidth);}var Q=document.body,U=this.cfg,T=U.getProperty("width"),R,S;if((!T||T=="auto")&&(U.getProperty("container")!=Q||U.getProperty("x")>=C.getViewportWidth()||U.getProperty("y")>=C.getViewportHeight())){S=this.element.cloneNode(true);S.style.visibility="hidden";S.style.top="0px";S.style.left="0px";Q.appendChild(S);R=(S.offsetWidth+"px");Q.removeChild(S);S=null;U.setProperty("width",R);U.refireEvent("xy");this._originalWidth=T||"";this._forcedWidth=R;}}function B(P,O,Q){this.render(Q);}function L(){N.onDOMReady(B,this.cfg.getProperty("container"),this);}YAHOO.extend(J,YAHOO.widget.Overlay,{init:function(P,O){J.superclass.init.call(this,P);this.beforeInitEvent.fire(J);C.addClass(this.element,J.CSS_TOOLTIP);if(O){this.cfg.applyConfig(O,true);}this.cfg.queueProperty("visible",false);this.cfg.queueProperty("constraintoviewport",true);this.setBody("");this.subscribe("changeContent",D);this.subscribe("init",L);this.subscribe("render",this.onRender);this.initEvent.fire(J);},initEvents:function(){J.superclass.initEvents.call(this);var O=M.LIST;this.contextMouseOverEvent=this.createEvent(A.CONTEXT_MOUSE_OVER);this.contextMouseOverEvent.signature=O;this.contextMouseOutEvent=this.createEvent(A.CONTEXT_MOUSE_OUT);this.contextMouseOutEvent.signature=O;this.contextTriggerEvent=this.createEvent(A.CONTEXT_TRIGGER);this.contextTriggerEvent.signature=O;},initDefaultConfig:function(){J.superclass.initDefaultConfig.call(this);this.cfg.addProperty(I.PREVENT_OVERLAP.key,{value:I.PREVENT_OVERLAP.value,validator:I.PREVENT_OVERLAP.validator,supercedes:I.PREVENT_OVERLAP.supercedes});this.cfg.addProperty(I.SHOW_DELAY.key,{handler:this.configShowDelay,value:200,validator:I.SHOW_DELAY.validator});this.cfg.addProperty(I.AUTO_DISMISS_DELAY.key,{handler:this.configAutoDismissDelay,value:I.AUTO_DISMISS_DELAY.value,validator:I.AUTO_DISMISS_DELAY.validator});this.cfg.addProperty(I.HIDE_DELAY.key,{handler:this.configHideDelay,value:I.HIDE_DELAY.value,validator:I.HIDE_DELAY.validator});this.cfg.addProperty(I.TEXT.key,{handler:this.configText,suppressEvent:I.TEXT.suppressEvent});this.cfg.addProperty(I.CONTAINER.key,{handler:this.configContainer,value:document.body});this.cfg.addProperty(I.DISABLED.key,{handler:this.configContainer,value:I.DISABLED.value,supressEvent:I.DISABLED.suppressEvent});},configText:function(P,O,Q){var R=O[0];if(R){this.setBody(R);}},configContainer:function(Q,P,R){var O=P[0];if(typeof O=="string"){this.cfg.setProperty("container",document.getElementById(O),true);}},_removeEventListeners:function(){var R=this._context,O,Q,P;if(R){O=R.length;if(O>0){P=O-1;do{Q=R[P];N.removeListener(Q,"mouseover",this.onContextMouseOver);N.removeListener(Q,"mousemove",this.onContextMouseMove);N.removeListener(Q,"mouseout",this.onContextMouseOut);}while(P--);}}},configContext:function(T,P,U){var S=P[0],V,O,R,Q;if(S){if(!(S instanceof Array)){if(typeof S=="string"){this.cfg.setProperty("context",[document.getElementById(S)],true);}else{this.cfg.setProperty("context",[S],true);}S=this.cfg.getProperty("context");}this._removeEventListeners();this._context=S;V=this._context;if(V){O=V.length;if(O>0){Q=O-1;do{R=V[Q];N.on(R,"mouseover",this.onContextMouseOver,this);N.on(R,"mousemove",this.onContextMouseMove,this);N.on(R,"mouseout",this.onContextMouseOut,this);}while(Q--);}}}},onContextMouseMove:function(P,O){O.pageX=N.getPageX(P);O.pageY=N.getPageY(P);},onContextMouseOver:function(Q,P){var O=this;if(O.title){P._tempTitle=O.title;O.title="";}if(P.fireEvent("contextMouseOver",O,Q)!==false&&!P.cfg.getProperty("disabled")){if(P.hideProcId){clearTimeout(P.hideProcId);P.hideProcId=null;}N.on(O,"mousemove",P.onContextMouseMove,P);P.showProcId=P.doShow(Q,O);}},onContextMouseOut:function(Q,P){var O=this;if(P._tempTitle){O.title=P._tempTitle;P._tempTitle=null;}if(P.showProcId){clearTimeout(P.showProcId);P.showProcId=null;}if(P.hideProcId){clearTimeout(P.hideProcId);P.hideProcId=null;}P.fireEvent("contextMouseOut",O,Q);P.hideProcId=setTimeout(function(){P.hide();},P.cfg.getProperty("hidedelay"));},doShow:function(Q,O){var R=25,P=this;
if(H.opera&&O.tagName&&O.tagName.toUpperCase()=="A"){R+=12;}return setTimeout(function(){var S=P.cfg.getProperty("text");if(P._tempTitle&&(S===""||YAHOO.lang.isUndefined(S)||YAHOO.lang.isNull(S))){P.setBody(P._tempTitle);}else{P.cfg.refireEvent("text");}P.moveTo(P.pageX,P.pageY+R);if(P.cfg.getProperty("preventoverlap")){P.preventOverlap(P.pageX,P.pageY);}N.removeListener(O,"mousemove",P.onContextMouseMove);P.contextTriggerEvent.fire(O);P.show();P.hideProcId=P.doHide();},this.cfg.getProperty("showdelay"));},doHide:function(){var O=this;return setTimeout(function(){O.hide();},this.cfg.getProperty("autodismissdelay"));},preventOverlap:function(S,R){var O=this.element.offsetHeight,Q=new YAHOO.util.Point(S,R),P=C.getRegion(this.element);P.top-=5;P.left-=5;P.right+=5;P.bottom+=5;if(P.contains(Q)){this.cfg.setProperty("y",(R-O-5));}},onRender:function(S,R){function T(){var W=this.element,V=this.underlay;if(V){V.style.width=(W.offsetWidth+6)+"px";V.style.height=(W.offsetHeight+1)+"px";}}function P(){C.addClass(this.underlay,"yui-tt-shadow-visible");if(H.ie){this.forceUnderlayRedraw();}}function O(){C.removeClass(this.underlay,"yui-tt-shadow-visible");}function U(){var X=this.underlay,W,V,Z,Y;if(!X){W=this.element;V=YAHOO.widget.Module;Z=H.ie;Y=this;if(!F){F=document.createElement("div");F.className="yui-tt-shadow";}X=F.cloneNode(false);W.appendChild(X);this.underlay=X;this._shadow=this.underlay;P.call(this);this.subscribe("beforeShow",P);this.subscribe("hide",O);if(G){window.setTimeout(function(){T.call(Y);},0);this.cfg.subscribeToConfigEvent("width",T);this.cfg.subscribeToConfigEvent("height",T);this.subscribe("changeContent",T);V.textResizeEvent.subscribe(T,this,true);this.subscribe("destroy",function(){V.textResizeEvent.unsubscribe(T,this);});}}}function Q(){U.call(this);this.unsubscribe("beforeShow",Q);}if(this.cfg.getProperty("visible")){U.call(this);}else{this.subscribe("beforeShow",Q);}},forceUnderlayRedraw:function(){var O=this;C.addClass(O.underlay,"yui-force-redraw");setTimeout(function(){C.removeClass(O.underlay,"yui-force-redraw");},0);},destroy:function(){this._removeEventListeners();J.superclass.destroy.call(this);},toString:function(){return"Tooltip "+this.id;}});}());(function(){YAHOO.widget.Panel=function(V,U){YAHOO.widget.Panel.superclass.constructor.call(this,V,U);};var S=null;var E=YAHOO.lang,F=YAHOO.util,A=F.Dom,T=F.Event,M=F.CustomEvent,K=YAHOO.util.KeyListener,I=F.Config,H=YAHOO.widget.Overlay,O=YAHOO.widget.Panel,L=YAHOO.env.ua,P=(L.ie&&(L.ie<=6||document.compatMode=="BackCompat")),G,Q,C,D={"SHOW_MASK":"showMask","HIDE_MASK":"hideMask","DRAG":"drag"},N={"CLOSE":{key:"close",value:true,validator:E.isBoolean,supercedes:["visible"]},"DRAGGABLE":{key:"draggable",value:(F.DD?true:false),validator:E.isBoolean,supercedes:["visible"]},"DRAG_ONLY":{key:"dragonly",value:false,validator:E.isBoolean,supercedes:["draggable"]},"UNDERLAY":{key:"underlay",value:"shadow",supercedes:["visible"]},"MODAL":{key:"modal",value:false,validator:E.isBoolean,supercedes:["visible","zindex"]},"KEY_LISTENERS":{key:"keylisteners",suppressEvent:true,supercedes:["visible"]},"STRINGS":{key:"strings",supercedes:["close"],validator:E.isObject,value:{close:"Close"}}};O.CSS_PANEL="yui-panel";O.CSS_PANEL_CONTAINER="yui-panel-container";O.FOCUSABLE=["a","button","select","textarea","input","iframe"];function J(V,U){if(!this.header&&this.cfg.getProperty("draggable")){this.setHeader("&#160;");}}function R(V,U,W){var Z=W[0],X=W[1],Y=this.cfg,a=Y.getProperty("width");if(a==X){Y.setProperty("width",Z);}this.unsubscribe("hide",R,W);}function B(V,U){var Y,X,W;if(P){Y=this.cfg;X=Y.getProperty("width");if(!X||X=="auto"){W=(this.element.offsetWidth+"px");Y.setProperty("width",W);this.subscribe("hide",R,[(X||""),W]);}}}YAHOO.extend(O,H,{init:function(V,U){O.superclass.init.call(this,V);this.beforeInitEvent.fire(O);A.addClass(this.element,O.CSS_PANEL);this.buildWrapper();if(U){this.cfg.applyConfig(U,true);}this.subscribe("showMask",this._addFocusHandlers);this.subscribe("hideMask",this._removeFocusHandlers);this.subscribe("beforeRender",J);this.subscribe("render",function(){this.setFirstLastFocusable();this.subscribe("changeContent",this.setFirstLastFocusable);});this.subscribe("show",this.focusFirst);this.initEvent.fire(O);},_onElementFocus:function(Z){if(S===this){var Y=T.getTarget(Z),X=document.documentElement,V=(Y!==X&&Y!==window);if(V&&Y!==this.element&&Y!==this.mask&&!A.isAncestor(this.element,Y)){try{if(this.firstElement){this.firstElement.focus();}else{if(this._modalFocus){this._modalFocus.focus();}else{this.innerElement.focus();}}}catch(W){try{if(V&&Y!==document.body){Y.blur();}}catch(U){}}}}},_addFocusHandlers:function(V,U){if(!this.firstElement){if(L.webkit||L.opera){if(!this._modalFocus){this._createHiddenFocusElement();}}else{this.innerElement.tabIndex=0;}}this.setTabLoop(this.firstElement,this.lastElement);T.onFocus(document.documentElement,this._onElementFocus,this,true);S=this;},_createHiddenFocusElement:function(){var U=document.createElement("button");U.style.height="1px";U.style.width="1px";U.style.position="absolute";U.style.left="-10000em";U.style.opacity=0;U.tabIndex=-1;this.innerElement.appendChild(U);this._modalFocus=U;},_removeFocusHandlers:function(V,U){T.removeFocusListener(document.documentElement,this._onElementFocus,this);if(S==this){S=null;}},focusFirst:function(W,U,Y){var V=this.firstElement;if(U&&U[1]){T.stopEvent(U[1]);}if(V){try{V.focus();}catch(X){}}},focusLast:function(W,U,Y){var V=this.lastElement;if(U&&U[1]){T.stopEvent(U[1]);}if(V){try{V.focus();}catch(X){}}},setTabLoop:function(X,Z){var V=this.preventBackTab,W=this.preventTabOut,U=this.showEvent,Y=this.hideEvent;if(V){V.disable();U.unsubscribe(V.enable,V);Y.unsubscribe(V.disable,V);V=this.preventBackTab=null;}if(W){W.disable();U.unsubscribe(W.enable,W);Y.unsubscribe(W.disable,W);W=this.preventTabOut=null;}if(X){this.preventBackTab=new K(X,{shift:true,keys:9},{fn:this.focusLast,scope:this,correctScope:true});V=this.preventBackTab;U.subscribe(V.enable,V,true);
Y.subscribe(V.disable,V,true);}if(Z){this.preventTabOut=new K(Z,{shift:false,keys:9},{fn:this.focusFirst,scope:this,correctScope:true});W=this.preventTabOut;U.subscribe(W.enable,W,true);Y.subscribe(W.disable,W,true);}},getFocusableElements:function(U){U=U||this.innerElement;var X={};for(var W=0;W<O.FOCUSABLE.length;W++){X[O.FOCUSABLE[W]]=true;}function V(Y){if(Y.focus&&Y.type!=="hidden"&&!Y.disabled&&X[Y.tagName.toLowerCase()]){return true;}return false;}return A.getElementsBy(V,null,U);},setFirstLastFocusable:function(){this.firstElement=null;this.lastElement=null;var U=this.getFocusableElements();this.focusableElements=U;if(U.length>0){this.firstElement=U[0];this.lastElement=U[U.length-1];}if(this.cfg.getProperty("modal")){this.setTabLoop(this.firstElement,this.lastElement);}},initEvents:function(){O.superclass.initEvents.call(this);var U=M.LIST;this.showMaskEvent=this.createEvent(D.SHOW_MASK);this.showMaskEvent.signature=U;this.hideMaskEvent=this.createEvent(D.HIDE_MASK);this.hideMaskEvent.signature=U;this.dragEvent=this.createEvent(D.DRAG);this.dragEvent.signature=U;},initDefaultConfig:function(){O.superclass.initDefaultConfig.call(this);this.cfg.addProperty(N.CLOSE.key,{handler:this.configClose,value:N.CLOSE.value,validator:N.CLOSE.validator,supercedes:N.CLOSE.supercedes});this.cfg.addProperty(N.DRAGGABLE.key,{handler:this.configDraggable,value:(F.DD)?true:false,validator:N.DRAGGABLE.validator,supercedes:N.DRAGGABLE.supercedes});this.cfg.addProperty(N.DRAG_ONLY.key,{value:N.DRAG_ONLY.value,validator:N.DRAG_ONLY.validator,supercedes:N.DRAG_ONLY.supercedes});this.cfg.addProperty(N.UNDERLAY.key,{handler:this.configUnderlay,value:N.UNDERLAY.value,supercedes:N.UNDERLAY.supercedes});this.cfg.addProperty(N.MODAL.key,{handler:this.configModal,value:N.MODAL.value,validator:N.MODAL.validator,supercedes:N.MODAL.supercedes});this.cfg.addProperty(N.KEY_LISTENERS.key,{handler:this.configKeyListeners,suppressEvent:N.KEY_LISTENERS.suppressEvent,supercedes:N.KEY_LISTENERS.supercedes});this.cfg.addProperty(N.STRINGS.key,{value:N.STRINGS.value,handler:this.configStrings,validator:N.STRINGS.validator,supercedes:N.STRINGS.supercedes});},configClose:function(X,V,Y){var Z=V[0],W=this.close,U=this.cfg.getProperty("strings");if(Z){if(!W){if(!C){C=document.createElement("a");C.className="container-close";C.href="#";}W=C.cloneNode(true);this.innerElement.appendChild(W);W.innerHTML=(U&&U.close)?U.close:"&#160;";T.on(W,"click",this._doClose,this,true);this.close=W;}else{W.style.display="block";}}else{if(W){W.style.display="none";}}},_doClose:function(U){T.preventDefault(U);this.hide();},configDraggable:function(V,U,W){var X=U[0];if(X){if(!F.DD){this.cfg.setProperty("draggable",false);return;}if(this.header){A.setStyle(this.header,"cursor","move");this.registerDragDrop();}this.subscribe("beforeShow",B);}else{if(this.dd){this.dd.unreg();}if(this.header){A.setStyle(this.header,"cursor","auto");}this.unsubscribe("beforeShow",B);}},configUnderlay:function(d,c,Z){var b=(this.platform=="mac"&&L.gecko),e=c[0].toLowerCase(),V=this.underlay,W=this.element;function X(){var f=false;if(!V){if(!Q){Q=document.createElement("div");Q.className="underlay";}V=Q.cloneNode(false);this.element.appendChild(V);this.underlay=V;if(P){this.sizeUnderlay();this.cfg.subscribeToConfigEvent("width",this.sizeUnderlay);this.cfg.subscribeToConfigEvent("height",this.sizeUnderlay);this.changeContentEvent.subscribe(this.sizeUnderlay);YAHOO.widget.Module.textResizeEvent.subscribe(this.sizeUnderlay,this,true);}if(L.webkit&&L.webkit<420){this.changeContentEvent.subscribe(this.forceUnderlayRedraw);}f=true;}}function a(){var f=X.call(this);if(!f&&P){this.sizeUnderlay();}this._underlayDeferred=false;this.beforeShowEvent.unsubscribe(a);}function Y(){if(this._underlayDeferred){this.beforeShowEvent.unsubscribe(a);this._underlayDeferred=false;}if(V){this.cfg.unsubscribeFromConfigEvent("width",this.sizeUnderlay);this.cfg.unsubscribeFromConfigEvent("height",this.sizeUnderlay);this.changeContentEvent.unsubscribe(this.sizeUnderlay);this.changeContentEvent.unsubscribe(this.forceUnderlayRedraw);YAHOO.widget.Module.textResizeEvent.unsubscribe(this.sizeUnderlay,this,true);this.element.removeChild(V);this.underlay=null;}}switch(e){case"shadow":A.removeClass(W,"matte");A.addClass(W,"shadow");break;case"matte":if(!b){Y.call(this);}A.removeClass(W,"shadow");A.addClass(W,"matte");break;default:if(!b){Y.call(this);}A.removeClass(W,"shadow");A.removeClass(W,"matte");break;}if((e=="shadow")||(b&&!V)){if(this.cfg.getProperty("visible")){var U=X.call(this);if(!U&&P){this.sizeUnderlay();}}else{if(!this._underlayDeferred){this.beforeShowEvent.subscribe(a);this._underlayDeferred=true;}}}},configModal:function(V,U,X){var W=U[0];if(W){if(!this._hasModalityEventListeners){this.subscribe("beforeShow",this.buildMask);this.subscribe("beforeShow",this.bringToTop);this.subscribe("beforeShow",this.showMask);this.subscribe("hide",this.hideMask);H.windowResizeEvent.subscribe(this.sizeMask,this,true);this._hasModalityEventListeners=true;}}else{if(this._hasModalityEventListeners){if(this.cfg.getProperty("visible")){this.hideMask();this.removeMask();}this.unsubscribe("beforeShow",this.buildMask);this.unsubscribe("beforeShow",this.bringToTop);this.unsubscribe("beforeShow",this.showMask);this.unsubscribe("hide",this.hideMask);H.windowResizeEvent.unsubscribe(this.sizeMask,this);this._hasModalityEventListeners=false;}}},removeMask:function(){var V=this.mask,U;if(V){this.hideMask();U=V.parentNode;if(U){U.removeChild(V);}this.mask=null;}},configKeyListeners:function(X,U,a){var W=U[0],Z,Y,V;if(W){if(W instanceof Array){Y=W.length;for(V=0;V<Y;V++){Z=W[V];if(!I.alreadySubscribed(this.showEvent,Z.enable,Z)){this.showEvent.subscribe(Z.enable,Z,true);}if(!I.alreadySubscribed(this.hideEvent,Z.disable,Z)){this.hideEvent.subscribe(Z.disable,Z,true);this.destroyEvent.subscribe(Z.disable,Z,true);}}}else{if(!I.alreadySubscribed(this.showEvent,W.enable,W)){this.showEvent.subscribe(W.enable,W,true);}if(!I.alreadySubscribed(this.hideEvent,W.disable,W)){this.hideEvent.subscribe(W.disable,W,true);
this.destroyEvent.subscribe(W.disable,W,true);}}}},configStrings:function(V,U,W){var X=E.merge(N.STRINGS.value,U[0]);this.cfg.setProperty(N.STRINGS.key,X,true);},configHeight:function(X,V,Y){var U=V[0],W=this.innerElement;A.setStyle(W,"height",U);this.cfg.refireEvent("iframe");},_autoFillOnHeightChange:function(X,V,W){O.superclass._autoFillOnHeightChange.apply(this,arguments);if(P){var U=this;setTimeout(function(){U.sizeUnderlay();},0);}},configWidth:function(X,U,Y){var W=U[0],V=this.innerElement;A.setStyle(V,"width",W);this.cfg.refireEvent("iframe");},configzIndex:function(V,U,X){O.superclass.configzIndex.call(this,V,U,X);if(this.mask||this.cfg.getProperty("modal")===true){var W=A.getStyle(this.element,"zIndex");if(!W||isNaN(W)){W=0;}if(W===0){this.cfg.setProperty("zIndex",1);}else{this.stackMask();}}},buildWrapper:function(){var W=this.element.parentNode,U=this.element,V=document.createElement("div");V.className=O.CSS_PANEL_CONTAINER;V.id=U.id+"_c";if(W){W.insertBefore(V,U);}V.appendChild(U);this.element=V;this.innerElement=U;A.setStyle(this.innerElement,"visibility","inherit");},sizeUnderlay:function(){var V=this.underlay,U;if(V){U=this.element;V.style.width=U.offsetWidth+"px";V.style.height=U.offsetHeight+"px";}},registerDragDrop:function(){var V=this;if(this.header){if(!F.DD){return;}var U=(this.cfg.getProperty("dragonly")===true);this.dd=new F.DD(this.element.id,this.id,{dragOnly:U});if(!this.header.id){this.header.id=this.id+"_h";}this.dd.startDrag=function(){var X,Z,W,c,b,a;if(YAHOO.env.ua.ie==6){A.addClass(V.element,"drag");}if(V.cfg.getProperty("constraintoviewport")){var Y=H.VIEWPORT_OFFSET;X=V.element.offsetHeight;Z=V.element.offsetWidth;W=A.getViewportWidth();c=A.getViewportHeight();b=A.getDocumentScrollLeft();a=A.getDocumentScrollTop();if(X+Y<c){this.minY=a+Y;this.maxY=a+c-X-Y;}else{this.minY=a+Y;this.maxY=a+Y;}if(Z+Y<W){this.minX=b+Y;this.maxX=b+W-Z-Y;}else{this.minX=b+Y;this.maxX=b+Y;}this.constrainX=true;this.constrainY=true;}else{this.constrainX=false;this.constrainY=false;}V.dragEvent.fire("startDrag",arguments);};this.dd.onDrag=function(){V.syncPosition();V.cfg.refireEvent("iframe");if(this.platform=="mac"&&YAHOO.env.ua.gecko){this.showMacGeckoScrollbars();}V.dragEvent.fire("onDrag",arguments);};this.dd.endDrag=function(){if(YAHOO.env.ua.ie==6){A.removeClass(V.element,"drag");}V.dragEvent.fire("endDrag",arguments);V.moveEvent.fire(V.cfg.getProperty("xy"));};this.dd.setHandleElId(this.header.id);this.dd.addInvalidHandleType("INPUT");this.dd.addInvalidHandleType("SELECT");this.dd.addInvalidHandleType("TEXTAREA");}},buildMask:function(){var U=this.mask;if(!U){if(!G){G=document.createElement("div");G.className="mask";G.innerHTML="&#160;";}U=G.cloneNode(true);U.id=this.id+"_mask";document.body.insertBefore(U,document.body.firstChild);this.mask=U;if(YAHOO.env.ua.gecko&&this.platform=="mac"){A.addClass(this.mask,"block-scrollbars");}this.stackMask();}},hideMask:function(){if(this.cfg.getProperty("modal")&&this.mask){this.mask.style.display="none";A.removeClass(document.body,"masked");this.hideMaskEvent.fire();}},showMask:function(){if(this.cfg.getProperty("modal")&&this.mask){A.addClass(document.body,"masked");this.sizeMask();this.mask.style.display="block";this.showMaskEvent.fire();}},sizeMask:function(){if(this.mask){var V=this.mask,W=A.getViewportWidth(),U=A.getViewportHeight();if(V.offsetHeight>U){V.style.height=U+"px";}if(V.offsetWidth>W){V.style.width=W+"px";}V.style.height=A.getDocumentHeight()+"px";V.style.width=A.getDocumentWidth()+"px";}},stackMask:function(){if(this.mask){var U=A.getStyle(this.element,"zIndex");if(!YAHOO.lang.isUndefined(U)&&!isNaN(U)){A.setStyle(this.mask,"zIndex",U-1);}}},render:function(U){return O.superclass.render.call(this,U,this.innerElement);},destroy:function(){H.windowResizeEvent.unsubscribe(this.sizeMask,this);this.removeMask();if(this.close){T.purgeElement(this.close);}O.superclass.destroy.call(this);},forceUnderlayRedraw:function(){var U=this.underlay;A.addClass(U,"yui-force-redraw");setTimeout(function(){A.removeClass(U,"yui-force-redraw");},0);},toString:function(){return"Panel "+this.id;}});}());(function(){YAHOO.widget.Dialog=function(J,I){YAHOO.widget.Dialog.superclass.constructor.call(this,J,I);};var B=YAHOO.util.Event,G=YAHOO.util.CustomEvent,E=YAHOO.util.Dom,A=YAHOO.widget.Dialog,F=YAHOO.lang,H={"BEFORE_SUBMIT":"beforeSubmit","SUBMIT":"submit","MANUAL_SUBMIT":"manualSubmit","ASYNC_SUBMIT":"asyncSubmit","FORM_SUBMIT":"formSubmit","CANCEL":"cancel"},C={"POST_METHOD":{key:"postmethod",value:"async"},"POST_DATA":{key:"postdata",value:null},"BUTTONS":{key:"buttons",value:"none",supercedes:["visible"]},"HIDEAFTERSUBMIT":{key:"hideaftersubmit",value:true}};A.CSS_DIALOG="yui-dialog";function D(){var L=this._aButtons,J,K,I;if(F.isArray(L)){J=L.length;if(J>0){I=J-1;do{K=L[I];if(YAHOO.widget.Button&&K instanceof YAHOO.widget.Button){K.destroy();}else{if(K.tagName.toUpperCase()=="BUTTON"){B.purgeElement(K);B.purgeElement(K,false);}}}while(I--);}}}YAHOO.extend(A,YAHOO.widget.Panel,{form:null,initDefaultConfig:function(){A.superclass.initDefaultConfig.call(this);this.callback={success:null,failure:null,argument:null};this.cfg.addProperty(C.POST_METHOD.key,{handler:this.configPostMethod,value:C.POST_METHOD.value,validator:function(I){if(I!="form"&&I!="async"&&I!="none"&&I!="manual"){return false;}else{return true;}}});this.cfg.addProperty(C.POST_DATA.key,{value:C.POST_DATA.value});this.cfg.addProperty(C.HIDEAFTERSUBMIT.key,{value:C.HIDEAFTERSUBMIT.value});this.cfg.addProperty(C.BUTTONS.key,{handler:this.configButtons,value:C.BUTTONS.value,supercedes:C.BUTTONS.supercedes});},initEvents:function(){A.superclass.initEvents.call(this);var I=G.LIST;this.beforeSubmitEvent=this.createEvent(H.BEFORE_SUBMIT);this.beforeSubmitEvent.signature=I;this.submitEvent=this.createEvent(H.SUBMIT);this.submitEvent.signature=I;this.manualSubmitEvent=this.createEvent(H.MANUAL_SUBMIT);this.manualSubmitEvent.signature=I;this.asyncSubmitEvent=this.createEvent(H.ASYNC_SUBMIT);
this.asyncSubmitEvent.signature=I;this.formSubmitEvent=this.createEvent(H.FORM_SUBMIT);this.formSubmitEvent.signature=I;this.cancelEvent=this.createEvent(H.CANCEL);this.cancelEvent.signature=I;},init:function(J,I){A.superclass.init.call(this,J);this.beforeInitEvent.fire(A);E.addClass(this.element,A.CSS_DIALOG);this.cfg.setProperty("visible",false);if(I){this.cfg.applyConfig(I,true);}this.showEvent.subscribe(this.focusFirst,this,true);this.beforeHideEvent.subscribe(this.blurButtons,this,true);this.subscribe("changeBody",this.registerForm);this.initEvent.fire(A);},doSubmit:function(){var P=YAHOO.util.Connect,Q=this.form,K=false,N=false,R,M,L,I;switch(this.cfg.getProperty("postmethod")){case"async":R=Q.elements;M=R.length;if(M>0){L=M-1;do{if(R[L].type=="file"){K=true;break;}}while(L--);}if(K&&YAHOO.env.ua.ie&&this.isSecure){N=true;}I=this._getFormAttributes(Q);P.setForm(Q,K,N);var J=this.cfg.getProperty("postdata");var O=P.asyncRequest(I.method,I.action,this.callback,J);this.asyncSubmitEvent.fire(O);break;case"form":Q.submit();this.formSubmitEvent.fire();break;case"none":case"manual":this.manualSubmitEvent.fire();break;}},_getFormAttributes:function(K){var I={method:null,action:null};if(K){if(K.getAttributeNode){var J=K.getAttributeNode("action");var L=K.getAttributeNode("method");if(J){I.action=J.value;}if(L){I.method=L.value;}}else{I.action=K.getAttribute("action");I.method=K.getAttribute("method");}}I.method=(F.isString(I.method)?I.method:"POST").toUpperCase();I.action=F.isString(I.action)?I.action:"";return I;},registerForm:function(){var I=this.element.getElementsByTagName("form")[0];if(this.form){if(this.form==I&&E.isAncestor(this.element,this.form)){return;}else{B.purgeElement(this.form);this.form=null;}}if(!I){I=document.createElement("form");I.name="frm_"+this.id;this.body.appendChild(I);}if(I){this.form=I;B.on(I,"submit",this._submitHandler,this,true);}},_submitHandler:function(I){B.stopEvent(I);this.submit();this.form.blur();},setTabLoop:function(I,J){I=I||this.firstButton;J=this.lastButton||J;A.superclass.setTabLoop.call(this,I,J);},setFirstLastFocusable:function(){A.superclass.setFirstLastFocusable.call(this);var J,I,K,L=this.focusableElements;this.firstFormElement=null;this.lastFormElement=null;if(this.form&&L&&L.length>0){I=L.length;for(J=0;J<I;++J){K=L[J];if(this.form===K.form){this.firstFormElement=K;break;}}for(J=I-1;J>=0;--J){K=L[J];if(this.form===K.form){this.lastFormElement=K;break;}}}},configClose:function(J,I,K){A.superclass.configClose.apply(this,arguments);},_doClose:function(I){B.preventDefault(I);this.cancel();},configButtons:function(S,R,M){var N=YAHOO.widget.Button,U=R[0],K=this.innerElement,T,P,J,Q,O,I,L;D.call(this);this._aButtons=null;if(F.isArray(U)){O=document.createElement("span");O.className="button-group";Q=U.length;this._aButtons=[];this.defaultHtmlButton=null;for(L=0;L<Q;L++){T=U[L];if(N){J=new N({label:T.text});J.appendTo(O);P=J.get("element");if(T.isDefault){J.addClass("default");this.defaultHtmlButton=P;}if(F.isFunction(T.handler)){J.set("onclick",{fn:T.handler,obj:this,scope:this});}else{if(F.isObject(T.handler)&&F.isFunction(T.handler.fn)){J.set("onclick",{fn:T.handler.fn,obj:((!F.isUndefined(T.handler.obj))?T.handler.obj:this),scope:(T.handler.scope||this)});}}this._aButtons[this._aButtons.length]=J;}else{P=document.createElement("button");P.setAttribute("type","button");if(T.isDefault){P.className="default";this.defaultHtmlButton=P;}P.innerHTML=T.text;if(F.isFunction(T.handler)){B.on(P,"click",T.handler,this,true);}else{if(F.isObject(T.handler)&&F.isFunction(T.handler.fn)){B.on(P,"click",T.handler.fn,((!F.isUndefined(T.handler.obj))?T.handler.obj:this),(T.handler.scope||this));}}O.appendChild(P);this._aButtons[this._aButtons.length]=P;}T.htmlButton=P;if(L===0){this.firstButton=P;}if(L==(Q-1)){this.lastButton=P;}}this.setFooter(O);I=this.footer;if(E.inDocument(this.element)&&!E.isAncestor(K,I)){K.appendChild(I);}this.buttonSpan=O;}else{O=this.buttonSpan;I=this.footer;if(O&&I){I.removeChild(O);this.buttonSpan=null;this.firstButton=null;this.lastButton=null;this.defaultHtmlButton=null;}}this.changeContentEvent.fire();},getButtons:function(){return this._aButtons||null;},focusFirst:function(K,I,M){var J=this.firstFormElement;if(I&&I[1]){B.stopEvent(I[1]);}if(J){try{J.focus();}catch(L){}}else{if(this.defaultHtmlButton){this.focusDefaultButton();}else{this.focusFirstButton();}}},focusLast:function(K,I,M){var N=this.cfg.getProperty("buttons"),J=this.lastFormElement;if(I&&I[1]){B.stopEvent(I[1]);}if(N&&F.isArray(N)){this.focusLastButton();}else{if(J){try{J.focus();}catch(L){}}}},_getButton:function(J){var I=YAHOO.widget.Button;if(I&&J&&J.nodeName&&J.id){J=I.getButton(J.id)||J;}return J;},focusDefaultButton:function(){var I=this._getButton(this.defaultHtmlButton);if(I){try{I.focus();}catch(J){}}},blurButtons:function(){var N=this.cfg.getProperty("buttons"),K,M,J,I;if(N&&F.isArray(N)){K=N.length;if(K>0){I=(K-1);do{M=N[I];if(M){J=this._getButton(M.htmlButton);if(J){try{J.blur();}catch(L){}}}}while(I--);}}},focusFirstButton:function(){var L=this.cfg.getProperty("buttons"),K,I;if(L&&F.isArray(L)){K=L[0];if(K){I=this._getButton(K.htmlButton);if(I){try{I.focus();}catch(J){}}}}},focusLastButton:function(){var M=this.cfg.getProperty("buttons"),J,L,I;if(M&&F.isArray(M)){J=M.length;if(J>0){L=M[(J-1)];if(L){I=this._getButton(L.htmlButton);if(I){try{I.focus();}catch(K){}}}}}},configPostMethod:function(J,I,K){this.registerForm();},validate:function(){return true;},submit:function(){if(this.validate()){this.beforeSubmitEvent.fire();this.doSubmit();this.submitEvent.fire();if(this.cfg.getProperty("hideaftersubmit")){this.hide();}return true;}else{return false;}},cancel:function(){this.cancelEvent.fire();this.hide();},getData:function(){var Y=this.form,K,R,U,M,S,P,O,J,V,L,W,Z,I,N,a,X,T;function Q(c){var b=c.tagName.toUpperCase();return((b=="INPUT"||b=="TEXTAREA"||b=="SELECT")&&c.name==M);}if(Y){K=Y.elements;R=K.length;U={};for(X=0;X<R;X++){M=K[X].name;S=E.getElementsBy(Q,"*",Y);
P=S.length;if(P>0){if(P==1){S=S[0];O=S.type;J=S.tagName.toUpperCase();switch(J){case"INPUT":if(O=="checkbox"){U[M]=S.checked;}else{if(O!="radio"){U[M]=S.value;}}break;case"TEXTAREA":U[M]=S.value;break;case"SELECT":V=S.options;L=V.length;W=[];for(T=0;T<L;T++){Z=V[T];if(Z.selected){I=Z.value;if(!I||I===""){I=Z.text;}W[W.length]=I;}}U[M]=W;break;}}else{O=S[0].type;switch(O){case"radio":for(T=0;T<P;T++){N=S[T];if(N.checked){U[M]=N.value;break;}}break;case"checkbox":W=[];for(T=0;T<P;T++){a=S[T];if(a.checked){W[W.length]=a.value;}}U[M]=W;break;}}}}}return U;},destroy:function(){D.call(this);this._aButtons=null;var I=this.element.getElementsByTagName("form"),J;if(I.length>0){J=I[0];if(J){B.purgeElement(J);if(J.parentNode){J.parentNode.removeChild(J);}this.form=null;}}A.superclass.destroy.call(this);},toString:function(){return"Dialog "+this.id;}});}());(function(){YAHOO.widget.SimpleDialog=function(E,D){YAHOO.widget.SimpleDialog.superclass.constructor.call(this,E,D);};var C=YAHOO.util.Dom,B=YAHOO.widget.SimpleDialog,A={"ICON":{key:"icon",value:"none",suppressEvent:true},"TEXT":{key:"text",value:"",suppressEvent:true,supercedes:["icon"]}};B.ICON_BLOCK="blckicon";B.ICON_ALARM="alrticon";B.ICON_HELP="hlpicon";B.ICON_INFO="infoicon";B.ICON_WARN="warnicon";B.ICON_TIP="tipicon";B.ICON_CSS_CLASSNAME="yui-icon";B.CSS_SIMPLEDIALOG="yui-simple-dialog";YAHOO.extend(B,YAHOO.widget.Dialog,{initDefaultConfig:function(){B.superclass.initDefaultConfig.call(this);this.cfg.addProperty(A.ICON.key,{handler:this.configIcon,value:A.ICON.value,suppressEvent:A.ICON.suppressEvent});this.cfg.addProperty(A.TEXT.key,{handler:this.configText,value:A.TEXT.value,suppressEvent:A.TEXT.suppressEvent,supercedes:A.TEXT.supercedes});},init:function(E,D){B.superclass.init.call(this,E);this.beforeInitEvent.fire(B);C.addClass(this.element,B.CSS_SIMPLEDIALOG);this.cfg.queueProperty("postmethod","manual");if(D){this.cfg.applyConfig(D,true);}this.beforeRenderEvent.subscribe(function(){if(!this.body){this.setBody("");}},this,true);this.initEvent.fire(B);},registerForm:function(){B.superclass.registerForm.call(this);this.form.innerHTML+='<input type="hidden" name="'+this.id+'" value=""/>';},configIcon:function(F,E,J){var K=E[0],D=this.body,I=B.ICON_CSS_CLASSNAME,H,G;if(K&&K!="none"){H=C.getElementsByClassName(I,"*",D);if(H){G=H.parentNode;if(G){G.removeChild(H);H=null;}}if(K.indexOf(".")==-1){H=document.createElement("span");H.className=(I+" "+K);H.innerHTML="&#160;";}else{H=document.createElement("img");H.src=(this.imageRoot+K);H.className=I;}if(H){D.insertBefore(H,D.firstChild);}}},configText:function(E,D,F){var G=D[0];if(G){this.setBody(G);this.cfg.refireEvent("icon");}},toString:function(){return"SimpleDialog "+this.id;}});}());(function(){YAHOO.widget.ContainerEffect=function(E,H,G,D,F){if(!F){F=YAHOO.util.Anim;}this.overlay=E;this.attrIn=H;this.attrOut=G;this.targetElement=D||E.element;this.animClass=F;};var B=YAHOO.util.Dom,C=YAHOO.util.CustomEvent,A=YAHOO.widget.ContainerEffect;A.FADE=function(D,F){var G=YAHOO.util.Easing,I={attributes:{opacity:{from:0,to:1}},duration:F,method:G.easeIn},E={attributes:{opacity:{to:0}},duration:F,method:G.easeOut},H=new A(D,I,E,D.element);H.handleUnderlayStart=function(){var K=this.overlay.underlay;if(K&&YAHOO.env.ua.ie){var J=(K.filters&&K.filters.length>0);if(J){B.addClass(D.element,"yui-effect-fade");}}};H.handleUnderlayComplete=function(){var J=this.overlay.underlay;if(J&&YAHOO.env.ua.ie){B.removeClass(D.element,"yui-effect-fade");}};H.handleStartAnimateIn=function(K,J,L){B.addClass(L.overlay.element,"hide-select");if(!L.overlay.underlay){L.overlay.cfg.refireEvent("underlay");}L.handleUnderlayStart();L.overlay._setDomVisibility(true);B.setStyle(L.overlay.element,"opacity",0);};H.handleCompleteAnimateIn=function(K,J,L){B.removeClass(L.overlay.element,"hide-select");if(L.overlay.element.style.filter){L.overlay.element.style.filter=null;}L.handleUnderlayComplete();L.overlay.cfg.refireEvent("iframe");L.animateInCompleteEvent.fire();};H.handleStartAnimateOut=function(K,J,L){B.addClass(L.overlay.element,"hide-select");L.handleUnderlayStart();};H.handleCompleteAnimateOut=function(K,J,L){B.removeClass(L.overlay.element,"hide-select");if(L.overlay.element.style.filter){L.overlay.element.style.filter=null;}L.overlay._setDomVisibility(false);B.setStyle(L.overlay.element,"opacity",1);L.handleUnderlayComplete();L.overlay.cfg.refireEvent("iframe");L.animateOutCompleteEvent.fire();};H.init();return H;};A.SLIDE=function(F,D){var I=YAHOO.util.Easing,L=F.cfg.getProperty("x")||B.getX(F.element),K=F.cfg.getProperty("y")||B.getY(F.element),M=B.getClientWidth(),H=F.element.offsetWidth,J={attributes:{points:{to:[L,K]}},duration:D,method:I.easeIn},E={attributes:{points:{to:[(M+25),K]}},duration:D,method:I.easeOut},G=new A(F,J,E,F.element,YAHOO.util.Motion);G.handleStartAnimateIn=function(O,N,P){P.overlay.element.style.left=((-25)-H)+"px";P.overlay.element.style.top=K+"px";};G.handleTweenAnimateIn=function(Q,P,R){var S=B.getXY(R.overlay.element),O=S[0],N=S[1];if(B.getStyle(R.overlay.element,"visibility")=="hidden"&&O<L){R.overlay._setDomVisibility(true);}R.overlay.cfg.setProperty("xy",[O,N],true);R.overlay.cfg.refireEvent("iframe");};G.handleCompleteAnimateIn=function(O,N,P){P.overlay.cfg.setProperty("xy",[L,K],true);P.startX=L;P.startY=K;P.overlay.cfg.refireEvent("iframe");P.animateInCompleteEvent.fire();};G.handleStartAnimateOut=function(O,N,R){var P=B.getViewportWidth(),S=B.getXY(R.overlay.element),Q=S[1];R.animOut.attributes.points.to=[(P+25),Q];};G.handleTweenAnimateOut=function(P,O,Q){var S=B.getXY(Q.overlay.element),N=S[0],R=S[1];Q.overlay.cfg.setProperty("xy",[N,R],true);Q.overlay.cfg.refireEvent("iframe");};G.handleCompleteAnimateOut=function(O,N,P){P.overlay._setDomVisibility(false);P.overlay.cfg.setProperty("xy",[L,K]);P.animateOutCompleteEvent.fire();};G.init();return G;};A.prototype={init:function(){this.beforeAnimateInEvent=this.createEvent("beforeAnimateIn");this.beforeAnimateInEvent.signature=C.LIST;this.beforeAnimateOutEvent=this.createEvent("beforeAnimateOut");
this.beforeAnimateOutEvent.signature=C.LIST;this.animateInCompleteEvent=this.createEvent("animateInComplete");this.animateInCompleteEvent.signature=C.LIST;this.animateOutCompleteEvent=this.createEvent("animateOutComplete");this.animateOutCompleteEvent.signature=C.LIST;this.animIn=new this.animClass(this.targetElement,this.attrIn.attributes,this.attrIn.duration,this.attrIn.method);this.animIn.onStart.subscribe(this.handleStartAnimateIn,this);this.animIn.onTween.subscribe(this.handleTweenAnimateIn,this);this.animIn.onComplete.subscribe(this.handleCompleteAnimateIn,this);this.animOut=new this.animClass(this.targetElement,this.attrOut.attributes,this.attrOut.duration,this.attrOut.method);this.animOut.onStart.subscribe(this.handleStartAnimateOut,this);this.animOut.onTween.subscribe(this.handleTweenAnimateOut,this);this.animOut.onComplete.subscribe(this.handleCompleteAnimateOut,this);},animateIn:function(){this.beforeAnimateInEvent.fire();this.animIn.animate();},animateOut:function(){this.beforeAnimateOutEvent.fire();this.animOut.animate();},handleStartAnimateIn:function(E,D,F){},handleTweenAnimateIn:function(E,D,F){},handleCompleteAnimateIn:function(E,D,F){},handleStartAnimateOut:function(E,D,F){},handleTweenAnimateOut:function(E,D,F){},handleCompleteAnimateOut:function(E,D,F){},toString:function(){var D="ContainerEffect";if(this.overlay){D+=" ["+this.overlay.toString()+"]";}return D;}};YAHOO.lang.augmentProto(A,YAHOO.util.EventProvider);})();YAHOO.register("container",YAHOO.widget.Module,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
YAHOO.util.Attribute=function(B,A){if(A){this.owner=A;this.configure(B,true);}};YAHOO.util.Attribute.prototype={name:undefined,value:null,owner:null,readOnly:false,writeOnce:false,_initialConfig:null,_written:false,method:null,setter:null,getter:null,validator:null,getValue:function(){var A=this.value;if(this.getter){A=this.getter.call(this.owner,this.name);}return A;},setValue:function(F,B){var E,A=this.owner,C=this.name;var D={type:C,prevValue:this.getValue(),newValue:F};if(this.readOnly||(this.writeOnce&&this._written)){return false;}if(this.validator&&!this.validator.call(A,F)){return false;}if(!B){E=A.fireBeforeChangeEvent(D);if(E===false){return false;}}if(this.setter){F=this.setter.call(A,F,this.name);if(F===undefined){}}if(this.method){this.method.call(A,F,this.name);}this.value=F;this._written=true;D.type=C;if(!B){this.owner.fireChangeEvent(D);}return true;},configure:function(B,C){B=B||{};if(C){this._written=false;}this._initialConfig=this._initialConfig||{};for(var A in B){if(B.hasOwnProperty(A)){this[A]=B[A];if(C){this._initialConfig[A]=B[A];}}}},resetValue:function(){return this.setValue(this._initialConfig.value);},resetConfig:function(){this.configure(this._initialConfig,true);},refresh:function(A){this.setValue(this.value,A);}};(function(){var A=YAHOO.util.Lang;YAHOO.util.AttributeProvider=function(){};YAHOO.util.AttributeProvider.prototype={_configs:null,get:function(C){this._configs=this._configs||{};var B=this._configs[C];if(!B||!this._configs.hasOwnProperty(C)){return null;}return B.getValue();},set:function(D,E,B){this._configs=this._configs||{};var C=this._configs[D];if(!C){return false;}return C.setValue(E,B);},getAttributeKeys:function(){this._configs=this._configs;var C=[],B;for(B in this._configs){if(A.hasOwnProperty(this._configs,B)&&!A.isUndefined(this._configs[B])){C[C.length]=B;}}return C;},setAttributes:function(D,B){for(var C in D){if(A.hasOwnProperty(D,C)){this.set(C,D[C],B);}}},resetValue:function(C,B){this._configs=this._configs||{};if(this._configs[C]){this.set(C,this._configs[C]._initialConfig.value,B);return true;}return false;},refresh:function(E,C){this._configs=this._configs||{};var F=this._configs;E=((A.isString(E))?[E]:E)||this.getAttributeKeys();for(var D=0,B=E.length;D<B;++D){if(F.hasOwnProperty(E[D])){this._configs[E[D]].refresh(C);}}},register:function(B,C){this.setAttributeConfig(B,C);},getAttributeConfig:function(C){this._configs=this._configs||{};var B=this._configs[C]||{};var D={};for(C in B){if(A.hasOwnProperty(B,C)){D[C]=B[C];}}return D;},setAttributeConfig:function(B,C,D){this._configs=this._configs||{};C=C||{};if(!this._configs[B]){C.name=B;this._configs[B]=this.createAttribute(C);}else{this._configs[B].configure(C,D);}},configureAttribute:function(B,C,D){this.setAttributeConfig(B,C,D);},resetAttributeConfig:function(B){this._configs=this._configs||{};this._configs[B].resetConfig();},subscribe:function(B,C){this._events=this._events||{};if(!(B in this._events)){this._events[B]=this.createEvent(B);}YAHOO.util.EventProvider.prototype.subscribe.apply(this,arguments);},on:function(){this.subscribe.apply(this,arguments);},addListener:function(){this.subscribe.apply(this,arguments);},fireBeforeChangeEvent:function(C){var B="before";B+=C.type.charAt(0).toUpperCase()+C.type.substr(1)+"Change";C.type=B;return this.fireEvent(C.type,C);},fireChangeEvent:function(B){B.type+="Change";return this.fireEvent(B.type,B);},createAttribute:function(B){return new YAHOO.util.Attribute(B,this);}};YAHOO.augment(YAHOO.util.AttributeProvider,YAHOO.util.EventProvider);})();(function(){var B=YAHOO.util.Dom,C=YAHOO.util.AttributeProvider;var A=function(D,E){this.init.apply(this,arguments);};A.DOM_EVENTS={"click":true,"dblclick":true,"keydown":true,"keypress":true,"keyup":true,"mousedown":true,"mousemove":true,"mouseout":true,"mouseover":true,"mouseup":true,"focus":true,"blur":true,"submit":true,"change":true};A.prototype={DOM_EVENTS:null,DEFAULT_HTML_SETTER:function(F,D){var E=this.get("element");if(E){E[D]=F;}},DEFAULT_HTML_GETTER:function(D){var E=this.get("element"),F;if(E){F=E[D];}return F;},appendChild:function(D){D=D.get?D.get("element"):D;return this.get("element").appendChild(D);},getElementsByTagName:function(D){return this.get("element").getElementsByTagName(D);},hasChildNodes:function(){return this.get("element").hasChildNodes();},insertBefore:function(D,E){D=D.get?D.get("element"):D;E=(E&&E.get)?E.get("element"):E;return this.get("element").insertBefore(D,E);},removeChild:function(D){D=D.get?D.get("element"):D;return this.get("element").removeChild(D);},replaceChild:function(D,E){D=D.get?D.get("element"):D;E=E.get?E.get("element"):E;return this.get("element").replaceChild(D,E);},initAttributes:function(D){},addListener:function(H,G,I,F){var E=this.get("element")||this.get("id");F=F||this;var D=this;if(!this._events[H]){if(E&&this.DOM_EVENTS[H]){YAHOO.util.Event.addListener(E,H,function(J){if(J.srcElement&&!J.target){J.target=J.srcElement;}D.fireEvent(H,J);},I,F);}this.createEvent(H,this);}return YAHOO.util.EventProvider.prototype.subscribe.apply(this,arguments);},on:function(){return this.addListener.apply(this,arguments);},subscribe:function(){return this.addListener.apply(this,arguments);},removeListener:function(E,D){return this.unsubscribe.apply(this,arguments);},addClass:function(D){B.addClass(this.get("element"),D);},getElementsByClassName:function(E,D){return B.getElementsByClassName(E,D,this.get("element"));},hasClass:function(D){return B.hasClass(this.get("element"),D);},removeClass:function(D){return B.removeClass(this.get("element"),D);},replaceClass:function(E,D){return B.replaceClass(this.get("element"),E,D);},setStyle:function(E,D){return B.setStyle(this.get("element"),E,D);},getStyle:function(D){return B.getStyle(this.get("element"),D);},fireQueue:function(){var E=this._queue;for(var F=0,D=E.length;F<D;++F){this[E[F][0]].apply(this,E[F][1]);}},appendTo:function(E,F){E=(E.get)?E.get("element"):B.get(E);this.fireEvent("beforeAppendTo",{type:"beforeAppendTo",target:E});
F=(F&&F.get)?F.get("element"):B.get(F);var D=this.get("element");if(!D){return false;}if(!E){return false;}if(D.parent!=E){if(F){E.insertBefore(D,F);}else{E.appendChild(D);}}this.fireEvent("appendTo",{type:"appendTo",target:E});return D;},get:function(D){var F=this._configs||{},E=F.element;if(E&&!F[D]&&!YAHOO.lang.isUndefined(E.value[D])){this._setHTMLAttrConfig(D);}return C.prototype.get.call(this,D);},setAttributes:function(J,G){var E={},H=this._configOrder;for(var I=0,D=H.length;I<D;++I){if(J[H[I]]!==undefined){E[H[I]]=true;this.set(H[I],J[H[I]],G);}}for(var F in J){if(J.hasOwnProperty(F)&&!E[F]){this.set(F,J[F],G);}}},set:function(E,G,D){var F=this.get("element");if(!F){this._queue[this._queue.length]=["set",arguments];if(this._configs[E]){this._configs[E].value=G;}return;}if(!this._configs[E]&&!YAHOO.lang.isUndefined(F[E])){this._setHTMLAttrConfig(E);}return C.prototype.set.apply(this,arguments);},setAttributeConfig:function(D,E,F){this._configOrder.push(D);C.prototype.setAttributeConfig.apply(this,arguments);},createEvent:function(E,D){this._events[E]=true;return C.prototype.createEvent.apply(this,arguments);},init:function(E,D){this._initElement(E,D);},destroy:function(){var D=this.get("element");YAHOO.util.Event.purgeElement(D,true);this.unsubscribeAll();if(D&&D.parentNode){D.parentNode.removeChild(D);}this._queue=[];this._events={};this._configs={};this._configOrder=[];},_initElement:function(F,E){this._queue=this._queue||[];this._events=this._events||{};this._configs=this._configs||{};this._configOrder=[];E=E||{};E.element=E.element||F||null;var H=false;var D=A.DOM_EVENTS;this.DOM_EVENTS=this.DOM_EVENTS||{};for(var G in D){if(D.hasOwnProperty(G)){this.DOM_EVENTS[G]=D[G];}}if(typeof E.element==="string"){this._setHTMLAttrConfig("id",{value:E.element});}if(B.get(E.element)){H=true;this._initHTMLElement(E);this._initContent(E);}YAHOO.util.Event.onAvailable(E.element,function(){if(!H){this._initHTMLElement(E);}this.fireEvent("available",{type:"available",target:B.get(E.element)});},this,true);YAHOO.util.Event.onContentReady(E.element,function(){if(!H){this._initContent(E);}this.fireEvent("contentReady",{type:"contentReady",target:B.get(E.element)});},this,true);},_initHTMLElement:function(D){this.setAttributeConfig("element",{value:B.get(D.element),readOnly:true});},_initContent:function(D){this.initAttributes(D);this.setAttributes(D,true);this.fireQueue();},_setHTMLAttrConfig:function(D,F){var E=this.get("element");F=F||{};F.name=D;F.setter=F.setter||this.DEFAULT_HTML_SETTER;F.getter=F.getter||this.DEFAULT_HTML_GETTER;F.value=F.value||E[D];this._configs[D]=new YAHOO.util.Attribute(F,this);}};YAHOO.augment(A,C);YAHOO.util.Element=A;})();YAHOO.register("element",YAHOO.util.Element,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function(){var B=YAHOO.util,C=B.Dom,H=B.Event,F=window.document,J="active",D="activeIndex",E="activeTab",A="contentEl",G="element",I=function(L,K){K=K||{};if(arguments.length==1&&!YAHOO.lang.isString(L)&&!L.nodeName){K=L;L=K.element||null;}if(!L&&!K.element){L=this._createTabViewElement(K);}I.superclass.constructor.call(this,L,K);};YAHOO.extend(I,B.Element,{CLASSNAME:"yui-navset",TAB_PARENT_CLASSNAME:"yui-nav",CONTENT_PARENT_CLASSNAME:"yui-content",_tabParent:null,_contentParent:null,addTab:function(P,L){var N=this.get("tabs"),Q=this.getTab(L),R=this._tabParent,K=this._contentParent,M=P.get(G),O=P.get(A);if(!N){this._queue[this._queue.length]=["addTab",arguments];return false;}L=(L===undefined)?N.length:L;if(Q){R.insertBefore(M,Q.get(G));}else{R.appendChild(M);}if(O&&!C.isAncestor(K,O)){K.appendChild(O);}if(!P.get(J)){P.set("contentVisible",false,true);}else{this.set(E,P,true);}this._initTabEvents(P);N.splice(L,0,P);},_initTabEvents:function(K){K.addListener(K.get("activationEvent"),K._onActivate,this,K);K.addListener("activationEventChange",function(L){if(L.prevValue!=L.newValue){K.removeListener(L.prevValue,K._onActivate);K.addListener(L.newValue,K._onActivate,this,K);}});},DOMEventHandler:function(P){var Q=H.getTarget(P),S=this._tabParent,R=this.get("tabs"),M,L,K;if(C.isAncestor(S,Q)){for(var N=0,O=R.length;N<O;N++){L=R[N].get(G);K=R[N].get(A);if(Q==L||C.isAncestor(L,Q)){M=R[N];break;}}if(M){M.fireEvent(P.type,P);}}},getTab:function(K){return this.get("tabs")[K];},getTabIndex:function(O){var L=null,N=this.get("tabs");for(var M=0,K=N.length;M<K;++M){if(O==N[M]){L=M;break;}}return L;},removeTab:function(M){var L=this.get("tabs").length,K=this.getTabIndex(M);if(M===this.get(E)){if(L>1){if(K+1===L){this.set(D,K-1);}else{this.set(D,K+1);}}else{this.set(E,null);}}this._tabParent.removeChild(M.get(G));this._contentParent.removeChild(M.get(A));this._configs.tabs.value.splice(K,1);M.fireEvent("remove",{type:"remove",tabview:this});},toString:function(){var K=this.get("id")||this.get("tagName");return"TabView "+K;},contentTransition:function(L,K){if(L){L.set("contentVisible",true);}if(K){K.set("contentVisible",false);}},initAttributes:function(K){I.superclass.initAttributes.call(this,K);if(!K.orientation){K.orientation="top";}var M=this.get(G);if(!C.hasClass(M,this.CLASSNAME)){C.addClass(M,this.CLASSNAME);}this.setAttributeConfig("tabs",{value:[],readOnly:true});this._tabParent=this.getElementsByClassName(this.TAB_PARENT_CLASSNAME,"ul")[0]||this._createTabParent();this._contentParent=this.getElementsByClassName(this.CONTENT_PARENT_CLASSNAME,"div")[0]||this._createContentParent();this.setAttributeConfig("orientation",{value:K.orientation,method:function(N){var O=this.get("orientation");this.addClass("yui-navset-"+N);if(O!=N){this.removeClass("yui-navset-"+O);}if(N==="bottom"){this.appendChild(this._tabParent);}}});this.setAttributeConfig(D,{value:K.activeIndex,method:function(N){},validator:function(O){var N=true;if(O&&this.getTab(O).get("disabled")){N=false;}return N;}});this.setAttributeConfig(E,{value:K.activeTab,method:function(O){var N=this.get(E);if(O){O.set(J,true);}if(N&&N!==O){N.set(J,false);}if(N&&O!==N){this.contentTransition(O,N);}else{if(O){O.set("contentVisible",true);}}},validator:function(O){var N=true;if(O&&O.get("disabled")){N=false;}return N;}});this.on("activeTabChange",this._onActiveTabChange);this.on("activeIndexChange",this._onActiveIndexChange);if(this._tabParent){this._initTabs();}this.DOM_EVENTS.submit=false;this.DOM_EVENTS.focus=false;this.DOM_EVENTS.blur=false;for(var L in this.DOM_EVENTS){if(YAHOO.lang.hasOwnProperty(this.DOM_EVENTS,L)){this.addListener.call(this,L,this.DOMEventHandler);}}},deselectTab:function(K){if(this.getTab(K)===this.get("activeTab")){this.set("activeTab",null);}},selectTab:function(K){this.set("activeTab",this.getTab(K));},_onActiveTabChange:function(M){var K=this.get(D),L=this.getTabIndex(M.newValue);if(K!==L){if(!(this.set(D,L))){this.set(E,M.prevValue);}}},_onActiveIndexChange:function(K){if(K.newValue!==this.getTabIndex(this.get(E))){if(!(this.set(E,this.getTab(K.newValue)))){this.set(D,K.prevValue);}}},_initTabs:function(){var P=C.getChildren(this._tabParent),N=C.getChildren(this._contentParent),M=this.get(D),Q,L,R;for(var O=0,K=P.length;O<K;++O){L={};if(N[O]){L.contentEl=N[O];}Q=new YAHOO.widget.Tab(P[O],L);this.addTab(Q);if(Q.hasClass(Q.ACTIVE_CLASSNAME)){R=Q;}}if(M){this.set(E,this.getTab(M));}else{this._configs.activeTab.value=R;this._configs.activeIndex.value=this.getTabIndex(R);}},_createTabViewElement:function(K){var L=F.createElement("div");if(this.CLASSNAME){L.className=this.CLASSNAME;}return L;},_createTabParent:function(K){var L=F.createElement("ul");if(this.TAB_PARENT_CLASSNAME){L.className=this.TAB_PARENT_CLASSNAME;}this.get(G).appendChild(L);return L;},_createContentParent:function(K){var L=F.createElement("div");if(this.CONTENT_PARENT_CLASSNAME){L.className=this.CONTENT_PARENT_CLASSNAME;}this.get(G).appendChild(L);return L;}});YAHOO.widget.TabView=I;})();(function(){var D=YAHOO.util,I=D.Dom,L=YAHOO.lang,M="activeTab",J="label",G="labelEl",Q="content",C="contentEl",O="element",P="cacheData",B="dataSrc",H="dataLoaded",A="dataTimeout",N="loadMethod",F="postData",K="disabled",E=function(S,R){R=R||{};if(arguments.length==1&&!L.isString(S)&&!S.nodeName){R=S;S=R.element;}if(!S&&!R.element){S=this._createTabElement(R);}this.loadHandler={success:function(T){this.set(Q,T.responseText);},failure:function(T){}};E.superclass.constructor.call(this,S,R);this.DOM_EVENTS={};};YAHOO.extend(E,YAHOO.util.Element,{LABEL_TAGNAME:"em",ACTIVE_CLASSNAME:"selected",HIDDEN_CLASSNAME:"yui-hidden",ACTIVE_TITLE:"active",DISABLED_CLASSNAME:K,LOADING_CLASSNAME:"loading",dataConnection:null,loadHandler:null,_loading:false,toString:function(){var R=this.get(O),S=R.id||R.tagName;return"Tab "+S;},initAttributes:function(R){R=R||{};E.superclass.initAttributes.call(this,R);this.setAttributeConfig("activationEvent",{value:R.activationEvent||"click"});this.setAttributeConfig(G,{value:R[G]||this._getLabelEl(),method:function(S){S=I.get(S);
var T=this.get(G);if(T){if(T==S){return false;}T.parentNode.replaceChild(S,T);this.set(J,S.innerHTML);}}});this.setAttributeConfig(J,{value:R.label||this._getLabel(),method:function(T){var S=this.get(G);if(!S){this.set(G,this._createLabelEl());}S.innerHTML=T;}});this.setAttributeConfig(C,{value:R[C]||document.createElement("div"),method:function(S){S=I.get(S);var T=this.get(C);if(T){if(T===S){return false;}if(!this.get("selected")){I.addClass(S,"yui-hidden");}T.parentNode.replaceChild(S,T);this.set(Q,S.innerHTML);}}});this.setAttributeConfig(Q,{value:R[Q],method:function(S){this.get(C).innerHTML=S;}});this.setAttributeConfig(B,{value:R.dataSrc});this.setAttributeConfig(P,{value:R.cacheData||false,validator:L.isBoolean});this.setAttributeConfig(N,{value:R.loadMethod||"GET",validator:L.isString});this.setAttributeConfig(H,{value:false,validator:L.isBoolean,writeOnce:true});this.setAttributeConfig(A,{value:R.dataTimeout||null,validator:L.isNumber});this.setAttributeConfig(F,{value:R.postData||null});this.setAttributeConfig("active",{value:R.active||this.hasClass(this.ACTIVE_CLASSNAME),method:function(S){if(S===true){this.addClass(this.ACTIVE_CLASSNAME);this.set("title",this.ACTIVE_TITLE);}else{this.removeClass(this.ACTIVE_CLASSNAME);this.set("title","");}},validator:function(S){return L.isBoolean(S)&&!this.get(K);}});this.setAttributeConfig(K,{value:R.disabled||this.hasClass(this.DISABLED_CLASSNAME),method:function(S){if(S===true){I.addClass(this.get(O),this.DISABLED_CLASSNAME);}else{I.removeClass(this.get(O),this.DISABLED_CLASSNAME);}},validator:L.isBoolean});this.setAttributeConfig("href",{value:R.href||this.getElementsByTagName("a")[0].getAttribute("href",2)||"#",method:function(S){this.getElementsByTagName("a")[0].href=S;},validator:L.isString});this.setAttributeConfig("contentVisible",{value:R.contentVisible,method:function(S){if(S){I.removeClass(this.get(C),this.HIDDEN_CLASSNAME);if(this.get(B)){if(!this._loading&&!(this.get(H)&&this.get(P))){this._dataConnect();}}}else{I.addClass(this.get(C),this.HIDDEN_CLASSNAME);}},validator:L.isBoolean});},_dataConnect:function(){if(!D.Connect){return false;}I.addClass(this.get(C).parentNode,this.LOADING_CLASSNAME);this._loading=true;this.dataConnection=D.Connect.asyncRequest(this.get(N),this.get(B),{success:function(R){this.loadHandler.success.call(this,R);this.set(H,true);this.dataConnection=null;I.removeClass(this.get(C).parentNode,this.LOADING_CLASSNAME);this._loading=false;},failure:function(R){this.loadHandler.failure.call(this,R);this.dataConnection=null;I.removeClass(this.get(C).parentNode,this.LOADING_CLASSNAME);this._loading=false;},scope:this,timeout:this.get(A)},this.get(F));},_createTabElement:function(R){var V=document.createElement("li"),S=document.createElement("a"),U=R.label||null,T=R.labelEl||null;S.href=R.href||"#";V.appendChild(S);if(T){if(!U){U=this._getLabel();}}else{T=this._createLabelEl();}S.appendChild(T);return V;},_getLabelEl:function(){return this.getElementsByTagName(this.LABEL_TAGNAME)[0];},_createLabelEl:function(){var R=document.createElement(this.LABEL_TAGNAME);return R;},_getLabel:function(){var R=this.get(G);if(!R){return undefined;}return R.innerHTML;},_onActivate:function(U,T){var S=this,R=false;D.Event.preventDefault(U);if(S===T.get(M)){R=true;}T.set(M,S,R);}});YAHOO.widget.Tab=E;})();YAHOO.register("tabview",YAHOO.widget.TabView,{version:"2.7.0",build:"1799"});
/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
if(typeof YAHOO=="undefined"||!YAHOO){var YAHOO={};}YAHOO.namespace=function(){var A=arguments,E=null,C,B,D;for(C=0;C<A.length;C=C+1){D=(""+A[C]).split(".");E=YAHOO;for(B=(D[0]=="YAHOO")?1:0;B<D.length;B=B+1){E[D[B]]=E[D[B]]||{};E=E[D[B]];}}return E;};YAHOO.log=function(D,A,C){var B=YAHOO.widget.Logger;if(B&&B.log){return B.log(D,A,C);}else{return false;}};YAHOO.register=function(A,E,D){var I=YAHOO.env.modules,B,H,G,F,C;if(!I[A]){I[A]={versions:[],builds:[]};}B=I[A];H=D.version;G=D.build;F=YAHOO.env.listeners;B.name=A;B.version=H;B.build=G;B.versions.push(H);B.builds.push(G);B.mainClass=E;for(C=0;C<F.length;C=C+1){F[C](B);}if(E){E.VERSION=H;E.BUILD=G;}else{YAHOO.log("mainClass is undefined for module "+A,"warn");}};YAHOO.env=YAHOO.env||{modules:[],listeners:[]};YAHOO.env.getVersion=function(A){return YAHOO.env.modules[A]||null;};YAHOO.env.ua=function(){var C={ie:0,opera:0,gecko:0,webkit:0,mobile:null,air:0,caja:0},B=navigator.userAgent,A;if((/KHTML/).test(B)){C.webkit=1;}A=B.match(/AppleWebKit\/([^\s]*)/);if(A&&A[1]){C.webkit=parseFloat(A[1]);if(/ Mobile\//.test(B)){C.mobile="Apple";}else{A=B.match(/NokiaN[^\/]*/);if(A){C.mobile=A[0];}}A=B.match(/AdobeAIR\/([^\s]*)/);if(A){C.air=A[0];}}if(!C.webkit){A=B.match(/Opera[\s\/]([^\s]*)/);if(A&&A[1]){C.opera=parseFloat(A[1]);A=B.match(/Opera Mini[^;]*/);if(A){C.mobile=A[0];}}else{A=B.match(/MSIE\s([^;]*)/);if(A&&A[1]){C.ie=parseFloat(A[1]);}else{A=B.match(/Gecko\/([^\s]*)/);if(A){C.gecko=1;A=B.match(/rv:([^\s\)]*)/);if(A&&A[1]){C.gecko=parseFloat(A[1]);}}}}}A=B.match(/Caja\/([^\s]*)/);if(A&&A[1]){C.caja=parseFloat(A[1]);}return C;}();(function(){YAHOO.namespace("util","widget","example");if("undefined"!==typeof YAHOO_config){var B=YAHOO_config.listener,A=YAHOO.env.listeners,D=true,C;if(B){for(C=0;C<A.length;C=C+1){if(A[C]==B){D=false;break;}}if(D){A.push(B);}}}})();YAHOO.lang=YAHOO.lang||{};(function(){var B=YAHOO.lang,F="[object Array]",C="[object Function]",A=Object.prototype,E=["toString","valueOf"],D={isArray:function(G){return A.toString.apply(G)===F;},isBoolean:function(G){return typeof G==="boolean";},isFunction:function(G){return A.toString.apply(G)===C;},isNull:function(G){return G===null;},isNumber:function(G){return typeof G==="number"&&isFinite(G);},isObject:function(G){return(G&&(typeof G==="object"||B.isFunction(G)))||false;},isString:function(G){return typeof G==="string";},isUndefined:function(G){return typeof G==="undefined";},_IEEnumFix:(YAHOO.env.ua.ie)?function(I,H){var G,K,J;for(G=0;G<E.length;G=G+1){K=E[G];J=H[K];if(B.isFunction(J)&&J!=A[K]){I[K]=J;}}}:function(){},extend:function(J,K,I){if(!K||!J){throw new Error("extend failed, please check that "+"all dependencies are included.");}var H=function(){},G;H.prototype=K.prototype;J.prototype=new H();J.prototype.constructor=J;J.superclass=K.prototype;if(K.prototype.constructor==A.constructor){K.prototype.constructor=K;}if(I){for(G in I){if(B.hasOwnProperty(I,G)){J.prototype[G]=I[G];}}B._IEEnumFix(J.prototype,I);}},augmentObject:function(K,J){if(!J||!K){throw new Error("Absorb failed, verify dependencies.");}var G=arguments,I,L,H=G[2];if(H&&H!==true){for(I=2;I<G.length;I=I+1){K[G[I]]=J[G[I]];}}else{for(L in J){if(H||!(L in K)){K[L]=J[L];}}B._IEEnumFix(K,J);}},augmentProto:function(J,I){if(!I||!J){throw new Error("Augment failed, verify dependencies.");}var G=[J.prototype,I.prototype],H;for(H=2;H<arguments.length;H=H+1){G.push(arguments[H]);}B.augmentObject.apply(this,G);},dump:function(G,L){var I,K,N=[],O="{...}",H="f(){...}",M=", ",J=" => ";if(!B.isObject(G)){return G+"";}else{if(G instanceof Date||("nodeType" in G&&"tagName" in G)){return G;}else{if(B.isFunction(G)){return H;}}}L=(B.isNumber(L))?L:3;if(B.isArray(G)){N.push("[");for(I=0,K=G.length;I<K;I=I+1){if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}if(N.length>1){N.pop();}N.push("]");}else{N.push("{");for(I in G){if(B.hasOwnProperty(G,I)){N.push(I+J);if(B.isObject(G[I])){N.push((L>0)?B.dump(G[I],L-1):O);}else{N.push(G[I]);}N.push(M);}}if(N.length>1){N.pop();}N.push("}");}return N.join("");},substitute:function(V,H,O){var L,K,J,R,S,U,Q=[],I,M="dump",P=" ",G="{",T="}",N;for(;;){L=V.lastIndexOf(G);if(L<0){break;}K=V.indexOf(T,L);if(L+1>=K){break;}I=V.substring(L+1,K);R=I;U=null;J=R.indexOf(P);if(J>-1){U=R.substring(J+1);R=R.substring(0,J);}S=H[R];if(O){S=O(R,S,U);}if(B.isObject(S)){if(B.isArray(S)){S=B.dump(S,parseInt(U,10));}else{U=U||"";N=U.indexOf(M);if(N>-1){U=U.substring(4);}if(S.toString===A.toString||N>-1){S=B.dump(S,parseInt(U,10));}else{S=S.toString();}}}else{if(!B.isString(S)&&!B.isNumber(S)){S="~-"+Q.length+"-~";Q[Q.length]=I;}}V=V.substring(0,L)+S+V.substring(K+1);}for(L=Q.length-1;L>=0;L=L-1){V=V.replace(new RegExp("~-"+L+"-~"),"{"+Q[L]+"}","g");}return V;},trim:function(G){try{return G.replace(/^\s+|\s+$/g,"");}catch(H){return G;}},merge:function(){var J={},H=arguments,G=H.length,I;for(I=0;I<G;I=I+1){B.augmentObject(J,H[I],true);}return J;},later:function(N,H,O,J,K){N=N||0;H=H||{};var I=O,M=J,L,G;if(B.isString(O)){I=H[O];}if(!I){throw new TypeError("method undefined");}if(!B.isArray(M)){M=[J];}L=function(){I.apply(H,M);};G=(K)?setInterval(L,N):setTimeout(L,N);return{interval:K,cancel:function(){if(this.interval){clearInterval(G);}else{clearTimeout(G);}}};},isValue:function(G){return(B.isObject(G)||B.isString(G)||B.isNumber(G)||B.isBoolean(G));}};B.hasOwnProperty=(A.hasOwnProperty)?function(G,H){return G&&G.hasOwnProperty(H);}:function(G,H){return !B.isUndefined(G[H])&&G.constructor.prototype[H]!==G[H];};D.augmentObject(B,D,true);YAHOO.util.Lang=B;B.augment=B.augmentProto;YAHOO.augment=B.augmentProto;YAHOO.extend=B.extend;})();YAHOO.register("yahoo",YAHOO,{version:"2.7.0",build:"1799"});YAHOO.util.Get=function(){var M={},L=0,R=0,E=false,N=YAHOO.env.ua,S=YAHOO.lang;var J=function(W,T,X){var U=X||window,Y=U.document,Z=Y.createElement(W);for(var V in T){if(T[V]&&YAHOO.lang.hasOwnProperty(T,V)){Z.setAttribute(V,T[V]);}}return Z;};var I=function(T,U,W){var V=W||"utf-8";return J("link",{"id":"yui__dyn_"+(R++),"type":"text/css","charset":V,"rel":"stylesheet","href":T},U);
};var P=function(T,U,W){var V=W||"utf-8";return J("script",{"id":"yui__dyn_"+(R++),"type":"text/javascript","charset":V,"src":T},U);};var A=function(T,U){return{tId:T.tId,win:T.win,data:T.data,nodes:T.nodes,msg:U,purge:function(){D(this.tId);}};};var B=function(T,W){var U=M[W],V=(S.isString(T))?U.win.document.getElementById(T):T;if(!V){Q(W,"target node not found: "+T);}return V;};var Q=function(W,V){var T=M[W];if(T.onFailure){var U=T.scope||T.win;T.onFailure.call(U,A(T,V));}};var C=function(W){var T=M[W];T.finished=true;if(T.aborted){var V="transaction "+W+" was aborted";Q(W,V);return;}if(T.onSuccess){var U=T.scope||T.win;T.onSuccess.call(U,A(T));}};var O=function(V){var T=M[V];if(T.onTimeout){var U=T.scope||T;T.onTimeout.call(U,A(T));}};var G=function(V,Z){var U=M[V];if(U.timer){U.timer.cancel();}if(U.aborted){var X="transaction "+V+" was aborted";Q(V,X);return;}if(Z){U.url.shift();if(U.varName){U.varName.shift();}}else{U.url=(S.isString(U.url))?[U.url]:U.url;if(U.varName){U.varName=(S.isString(U.varName))?[U.varName]:U.varName;}}var c=U.win,b=c.document,a=b.getElementsByTagName("head")[0],W;if(U.url.length===0){if(U.type==="script"&&N.webkit&&N.webkit<420&&!U.finalpass&&!U.varName){var Y=P(null,U.win,U.charset);Y.innerHTML='YAHOO.util.Get._finalize("'+V+'");';U.nodes.push(Y);a.appendChild(Y);}else{C(V);}return;}var T=U.url[0];if(!T){U.url.shift();return G(V);}if(U.timeout){U.timer=S.later(U.timeout,U,O,V);}if(U.type==="script"){W=P(T,c,U.charset);}else{W=I(T,c,U.charset);}F(U.type,W,V,T,c,U.url.length);U.nodes.push(W);if(U.insertBefore){var e=B(U.insertBefore,V);if(e){e.parentNode.insertBefore(W,e);}}else{a.appendChild(W);}if((N.webkit||N.gecko)&&U.type==="css"){G(V,T);}};var K=function(){if(E){return;}E=true;for(var T in M){var U=M[T];if(U.autopurge&&U.finished){D(U.tId);delete M[T];}}E=false;};var D=function(a){var X=M[a];if(X){var Z=X.nodes,T=Z.length,Y=X.win.document,W=Y.getElementsByTagName("head")[0];if(X.insertBefore){var V=B(X.insertBefore,a);if(V){W=V.parentNode;}}for(var U=0;U<T;U=U+1){W.removeChild(Z[U]);}X.nodes=[];}};var H=function(U,T,V){var X="q"+(L++);V=V||{};if(L%YAHOO.util.Get.PURGE_THRESH===0){K();}M[X]=S.merge(V,{tId:X,type:U,url:T,finished:false,aborted:false,nodes:[]});var W=M[X];W.win=W.win||window;W.scope=W.scope||W.win;W.autopurge=("autopurge" in W)?W.autopurge:(U==="script")?true:false;S.later(0,W,G,X);return{tId:X};};var F=function(c,X,W,U,Y,Z,b){var a=b||G;if(N.ie){X.onreadystatechange=function(){var d=this.readyState;if("loaded"===d||"complete"===d){X.onreadystatechange=null;a(W,U);}};}else{if(N.webkit){if(c==="script"){if(N.webkit>=420){X.addEventListener("load",function(){a(W,U);});}else{var T=M[W];if(T.varName){var V=YAHOO.util.Get.POLL_FREQ;T.maxattempts=YAHOO.util.Get.TIMEOUT/V;T.attempts=0;T._cache=T.varName[0].split(".");T.timer=S.later(V,T,function(j){var f=this._cache,e=f.length,d=this.win,g;for(g=0;g<e;g=g+1){d=d[f[g]];if(!d){this.attempts++;if(this.attempts++>this.maxattempts){var h="Over retry limit, giving up";T.timer.cancel();Q(W,h);}else{}return;}}T.timer.cancel();a(W,U);},null,true);}else{S.later(YAHOO.util.Get.POLL_FREQ,null,a,[W,U]);}}}}else{X.onload=function(){a(W,U);};}}};return{POLL_FREQ:10,PURGE_THRESH:20,TIMEOUT:2000,_finalize:function(T){S.later(0,null,C,T);},abort:function(U){var V=(S.isString(U))?U:U.tId;var T=M[V];if(T){T.aborted=true;}},script:function(T,U){return H("script",T,U);},css:function(T,U){return H("css",T,U);}};}();YAHOO.register("get",YAHOO.util.Get,{version:"2.7.0",build:"1799"});(function(){var Y=YAHOO,util=Y.util,lang=Y.lang,env=Y.env,PROV="_provides",SUPER="_supersedes",REQ="expanded",AFTER="_after";var YUI={dupsAllowed:{"yahoo":true,"get":true},info:{"root":"2.7.0/build/","base":"http://yui.yahooapis.com/2.7.0/build/","comboBase":"http://yui.yahooapis.com/combo?","skin":{"defaultSkin":"sam","base":"assets/skins/","path":"skin.css","after":["reset","fonts","grids","base"],"rollup":3},dupsAllowed:["yahoo","get"],"moduleInfo":{"animation":{"type":"js","path":"animation/animation-min.js","requires":["dom","event"]},"autocomplete":{"type":"js","path":"autocomplete/autocomplete-min.js","requires":["dom","event","datasource"],"optional":["connection","animation"],"skinnable":true},"base":{"type":"css","path":"base/base-min.css","after":["reset","fonts","grids"]},"button":{"type":"js","path":"button/button-min.js","requires":["element"],"optional":["menu"],"skinnable":true},"calendar":{"type":"js","path":"calendar/calendar-min.js","requires":["event","dom"],"skinnable":true},"carousel":{"type":"js","path":"carousel/carousel-min.js","requires":["element"],"optional":["animation"],"skinnable":true},"charts":{"type":"js","path":"charts/charts-min.js","requires":["element","json","datasource"]},"colorpicker":{"type":"js","path":"colorpicker/colorpicker-min.js","requires":["slider","element"],"optional":["animation"],"skinnable":true},"connection":{"type":"js","path":"connection/connection-min.js","requires":["event"]},"container":{"type":"js","path":"container/container-min.js","requires":["dom","event"],"optional":["dragdrop","animation","connection"],"supersedes":["containercore"],"skinnable":true},"containercore":{"type":"js","path":"container/container_core-min.js","requires":["dom","event"],"pkg":"container"},"cookie":{"type":"js","path":"cookie/cookie-min.js","requires":["yahoo"]},"datasource":{"type":"js","path":"datasource/datasource-min.js","requires":["event"],"optional":["connection"]},"datatable":{"type":"js","path":"datatable/datatable-min.js","requires":["element","datasource"],"optional":["calendar","dragdrop","paginator"],"skinnable":true},"dom":{"type":"js","path":"dom/dom-min.js","requires":["yahoo"]},"dragdrop":{"type":"js","path":"dragdrop/dragdrop-min.js","requires":["dom","event"]},"editor":{"type":"js","path":"editor/editor-min.js","requires":["menu","element","button"],"optional":["animation","dragdrop"],"supersedes":["simpleeditor"],"skinnable":true},"element":{"type":"js","path":"element/element-min.js","requires":["dom","event"]},"event":{"type":"js","path":"event/event-min.js","requires":["yahoo"]},"fonts":{"type":"css","path":"fonts/fonts-min.css"},"get":{"type":"js","path":"get/get-min.js","requires":["yahoo"]},"grids":{"type":"css","path":"grids/grids-min.css","requires":["fonts"],"optional":["reset"]},"history":{"type":"js","path":"history/history-min.js","requires":["event"]},"imagecropper":{"type":"js","path":"imagecropper/imagecropper-min.js","requires":["dom","event","dragdrop","element","resize"],"skinnable":true},"imageloader":{"type":"js","path":"imageloader/imageloader-min.js","requires":["event","dom"]},"json":{"type":"js","path":"json/json-min.js","requires":["yahoo"]},"layout":{"type":"js","path":"layout/layout-min.js","requires":["dom","event","element"],"optional":["animation","dragdrop","resize","selector"],"skinnable":true},"logger":{"type":"js","path":"logger/logger-min.js","requires":["event","dom"],"optional":["dragdrop"],"skinnable":true},"menu":{"type":"js","path":"menu/menu-min.js","requires":["containercore"],"skinnable":true},"paginator":{"type":"js","path":"paginator/paginator-min.js","requires":["element"],"skinnable":true},"profiler":{"type":"js","path":"profiler/profiler-min.js","requires":["yahoo"]},"profilerviewer":{"type":"js","path":"profilerviewer/profilerviewer-min.js","requires":["profiler","yuiloader","element"],"skinnable":true},"reset":{"type":"css","path":"reset/reset-min.css"},"reset-fonts-grids":{"type":"css","path":"reset-fonts-grids/reset-fonts-grids.css","supersedes":["reset","fonts","grids","reset-fonts"],"rollup":4},"reset-fonts":{"type":"css","path":"reset-fonts/reset-fonts.css","supersedes":["reset","fonts"],"rollup":2},"resize":{"type":"js","path":"resize/resize-min.js","requires":["dom","event","dragdrop","element"],"optional":["animation"],"skinnable":true},"selector":{"type":"js","path":"selector/selector-min.js","requires":["yahoo","dom"]},"simpleeditor":{"type":"js","path":"editor/simpleeditor-min.js","requires":["element"],"optional":["containercore","menu","button","animation","dragdrop"],"skinnable":true,"pkg":"editor"},"slider":{"type":"js","path":"slider/slider-min.js","requires":["dragdrop"],"optional":["animation"],"skinnable":true},"stylesheet":{"type":"js","path":"stylesheet/stylesheet-min.js","requires":["yahoo"]},"tabview":{"type":"js","path":"tabview/tabview-min.js","requires":["element"],"optional":["connection"],"skinnable":true},"treeview":{"type":"js","path":"treeview/treeview-min.js","requires":["event","dom"],"optional":["json"],"skinnable":true},"uploader":{"type":"js","path":"uploader/uploader.js","requires":["element"]},"utilities":{"type":"js","path":"utilities/utilities.js","supersedes":["yahoo","event","dragdrop","animation","dom","connection","element","yahoo-dom-event","get","yuiloader","yuiloader-dom-event"],"rollup":8},"yahoo":{"type":"js","path":"yahoo/yahoo-min.js"},"yahoo-dom-event":{"type":"js","path":"yahoo-dom-event/yahoo-dom-event.js","supersedes":["yahoo","event","dom"],"rollup":3},"yuiloader":{"type":"js","path":"yuiloader/yuiloader-min.js","supersedes":["yahoo","get"]},"yuiloader-dom-event":{"type":"js","path":"yuiloader-dom-event/yuiloader-dom-event.js","supersedes":["yahoo","dom","event","get","yuiloader","yahoo-dom-event"],"rollup":5},"yuitest":{"type":"js","path":"yuitest/yuitest-min.js","requires":["logger"],"skinnable":true}}},ObjectUtil:{appendArray:function(o,a){if(a){for(var i=0;
i<a.length;i=i+1){o[a[i]]=true;}}},keys:function(o,ordered){var a=[],i;for(i in o){if(lang.hasOwnProperty(o,i)){a.push(i);}}return a;}},ArrayUtil:{appendArray:function(a1,a2){Array.prototype.push.apply(a1,a2);},indexOf:function(a,val){for(var i=0;i<a.length;i=i+1){if(a[i]===val){return i;}}return -1;},toObject:function(a){var o={};for(var i=0;i<a.length;i=i+1){o[a[i]]=true;}return o;},uniq:function(a){return YUI.ObjectUtil.keys(YUI.ArrayUtil.toObject(a));}}};YAHOO.util.YUILoader=function(o){this._internalCallback=null;this._useYahooListener=false;this.onSuccess=null;this.onFailure=Y.log;this.onProgress=null;this.onTimeout=null;this.scope=this;this.data=null;this.insertBefore=null;this.charset=null;this.varName=null;this.base=YUI.info.base;this.comboBase=YUI.info.comboBase;this.combine=false;this.root=YUI.info.root;this.timeout=0;this.ignore=null;this.force=null;this.allowRollup=true;this.filter=null;this.required={};this.moduleInfo=lang.merge(YUI.info.moduleInfo);this.rollups=null;this.loadOptional=false;this.sorted=[];this.loaded={};this.dirty=true;this.inserted={};var self=this;env.listeners.push(function(m){if(self._useYahooListener){self.loadNext(m.name);}});this.skin=lang.merge(YUI.info.skin);this._config(o);};Y.util.YUILoader.prototype={FILTERS:{RAW:{"searchExp":"-min\\.js","replaceStr":".js"},DEBUG:{"searchExp":"-min\\.js","replaceStr":"-debug.js"}},SKIN_PREFIX:"skin-",_config:function(o){if(o){for(var i in o){if(lang.hasOwnProperty(o,i)){if(i=="require"){this.require(o[i]);}else{this[i]=o[i];}}}}var f=this.filter;if(lang.isString(f)){f=f.toUpperCase();if(f==="DEBUG"){this.require("logger");}if(!Y.widget.LogWriter){Y.widget.LogWriter=function(){return Y;};}this.filter=this.FILTERS[f];}},addModule:function(o){if(!o||!o.name||!o.type||(!o.path&&!o.fullpath)){return false;}o.ext=("ext" in o)?o.ext:true;o.requires=o.requires||[];this.moduleInfo[o.name]=o;this.dirty=true;return true;},require:function(what){var a=(typeof what==="string")?arguments:what;this.dirty=true;YUI.ObjectUtil.appendArray(this.required,a);},_addSkin:function(skin,mod){var name=this.formatSkin(skin),info=this.moduleInfo,sinf=this.skin,ext=info[mod]&&info[mod].ext;if(!info[name]){this.addModule({"name":name,"type":"css","path":sinf.base+skin+"/"+sinf.path,"after":sinf.after,"rollup":sinf.rollup,"ext":ext});}if(mod){name=this.formatSkin(skin,mod);if(!info[name]){var mdef=info[mod],pkg=mdef.pkg||mod;this.addModule({"name":name,"type":"css","after":sinf.after,"path":pkg+"/"+sinf.base+skin+"/"+mod+".css","ext":ext});}}return name;},getRequires:function(mod){if(!mod){return[];}if(!this.dirty&&mod.expanded){return mod.expanded;}mod.requires=mod.requires||[];var i,d=[],r=mod.requires,o=mod.optional,info=this.moduleInfo,m;for(i=0;i<r.length;i=i+1){d.push(r[i]);m=info[r[i]];YUI.ArrayUtil.appendArray(d,this.getRequires(m));}if(o&&this.loadOptional){for(i=0;i<o.length;i=i+1){d.push(o[i]);YUI.ArrayUtil.appendArray(d,this.getRequires(info[o[i]]));}}mod.expanded=YUI.ArrayUtil.uniq(d);return mod.expanded;},getProvides:function(name,notMe){var addMe=!(notMe),ckey=(addMe)?PROV:SUPER,m=this.moduleInfo[name],o={};if(!m){return o;}if(m[ckey]){return m[ckey];}var s=m.supersedes,done={},me=this;var add=function(mm){if(!done[mm]){done[mm]=true;lang.augmentObject(o,me.getProvides(mm));}};if(s){for(var i=0;i<s.length;i=i+1){add(s[i]);}}m[SUPER]=o;m[PROV]=lang.merge(o);m[PROV][name]=true;return m[ckey];},calculate:function(o){if(o||this.dirty){this._config(o);this._setup();this._explode();if(this.allowRollup){this._rollup();}this._reduce();this._sort();this.dirty=false;}},_setup:function(){var info=this.moduleInfo,name,i,j;for(name in info){if(lang.hasOwnProperty(info,name)){var m=info[name];if(m&&m.skinnable){var o=this.skin.overrides,smod;if(o&&o[name]){for(i=0;i<o[name].length;i=i+1){smod=this._addSkin(o[name][i],name);}}else{smod=this._addSkin(this.skin.defaultSkin,name);}m.requires.push(smod);}}}var l=lang.merge(this.inserted);if(!this._sandbox){l=lang.merge(l,env.modules);}if(this.ignore){YUI.ObjectUtil.appendArray(l,this.ignore);}if(this.force){for(i=0;i<this.force.length;i=i+1){if(this.force[i] in l){delete l[this.force[i]];}}}for(j in l){if(lang.hasOwnProperty(l,j)){lang.augmentObject(l,this.getProvides(j));}}this.loaded=l;},_explode:function(){var r=this.required,i,mod;for(i in r){if(lang.hasOwnProperty(r,i)){mod=this.moduleInfo[i];if(mod){var req=this.getRequires(mod);if(req){YUI.ObjectUtil.appendArray(r,req);}}}}},_skin:function(){},formatSkin:function(skin,mod){var s=this.SKIN_PREFIX+skin;if(mod){s=s+"-"+mod;}return s;},parseSkin:function(mod){if(mod.indexOf(this.SKIN_PREFIX)===0){var a=mod.split("-");return{skin:a[1],module:a[2]};}return null;},_rollup:function(){var i,j,m,s,rollups={},r=this.required,roll,info=this.moduleInfo;if(this.dirty||!this.rollups){for(i in info){if(lang.hasOwnProperty(info,i)){m=info[i];if(m&&m.rollup){rollups[i]=m;}}}this.rollups=rollups;}for(;;){var rolled=false;for(i in rollups){if(!r[i]&&!this.loaded[i]){m=info[i];s=m.supersedes;roll=false;if(!m.rollup){continue;}var skin=(m.ext)?false:this.parseSkin(i),c=0;if(skin){for(j in r){if(lang.hasOwnProperty(r,j)){if(i!==j&&this.parseSkin(j)){c++;roll=(c>=m.rollup);if(roll){break;}}}}}else{for(j=0;j<s.length;j=j+1){if(this.loaded[s[j]]&&(!YUI.dupsAllowed[s[j]])){roll=false;break;}else{if(r[s[j]]){c++;roll=(c>=m.rollup);if(roll){break;}}}}}if(roll){r[i]=true;rolled=true;this.getRequires(m);}}}if(!rolled){break;}}},_reduce:function(){var i,j,s,m,r=this.required;for(i in r){if(i in this.loaded){delete r[i];}else{var skinDef=this.parseSkin(i);if(skinDef){if(!skinDef.module){var skin_pre=this.SKIN_PREFIX+skinDef.skin;for(j in r){if(lang.hasOwnProperty(r,j)){m=this.moduleInfo[j];var ext=m&&m.ext;if(!ext&&j!==i&&j.indexOf(skin_pre)>-1){delete r[j];}}}}}else{m=this.moduleInfo[i];s=m&&m.supersedes;if(s){for(j=0;j<s.length;j=j+1){if(s[j] in r){delete r[s[j]];}}}}}}},_onFailure:function(msg){YAHOO.log("Failure","info","loader");var f=this.onFailure;if(f){f.call(this.scope,{msg:"failure: "+msg,data:this.data,success:false});
}},_onTimeout:function(){YAHOO.log("Timeout","info","loader");var f=this.onTimeout;if(f){f.call(this.scope,{msg:"timeout",data:this.data,success:false});}},_sort:function(){var s=[],info=this.moduleInfo,loaded=this.loaded,checkOptional=!this.loadOptional,me=this;var requires=function(aa,bb){var mm=info[aa];if(loaded[bb]||!mm){return false;}var ii,rr=mm.expanded,after=mm.after,other=info[bb],optional=mm.optional;if(rr&&YUI.ArrayUtil.indexOf(rr,bb)>-1){return true;}if(after&&YUI.ArrayUtil.indexOf(after,bb)>-1){return true;}if(checkOptional&&optional&&YUI.ArrayUtil.indexOf(optional,bb)>-1){return true;}var ss=info[bb]&&info[bb].supersedes;if(ss){for(ii=0;ii<ss.length;ii=ii+1){if(requires(aa,ss[ii])){return true;}}}if(mm.ext&&mm.type=="css"&&!other.ext&&other.type=="css"){return true;}return false;};for(var i in this.required){if(lang.hasOwnProperty(this.required,i)){s.push(i);}}var p=0;for(;;){var l=s.length,a,b,j,k,moved=false;for(j=p;j<l;j=j+1){a=s[j];for(k=j+1;k<l;k=k+1){if(requires(a,s[k])){b=s.splice(k,1);s.splice(j,0,b[0]);moved=true;break;}}if(moved){break;}else{p=p+1;}}if(!moved){break;}}this.sorted=s;},toString:function(){var o={type:"YUILoader",base:this.base,filter:this.filter,required:this.required,loaded:this.loaded,inserted:this.inserted};lang.dump(o,1);},_combine:function(){this._combining=[];var self=this,s=this.sorted,len=s.length,js=this.comboBase,css=this.comboBase,target,startLen=js.length,i,m,type=this.loadType;YAHOO.log("type "+type);for(i=0;i<len;i=i+1){m=this.moduleInfo[s[i]];if(m&&!m.ext&&(!type||type===m.type)){target=this.root+m.path;target+="&";if(m.type=="js"){js+=target;}else{css+=target;}this._combining.push(s[i]);}}if(this._combining.length){YAHOO.log("Attempting to combine: "+this._combining,"info","loader");var callback=function(o){var c=this._combining,len=c.length,i,m;for(i=0;i<len;i=i+1){this.inserted[c[i]]=true;}this.loadNext(o.data);},loadScript=function(){if(js.length>startLen){YAHOO.util.Get.script(self._filter(js),{data:self._loading,onSuccess:callback,onFailure:self._onFailure,onTimeout:self._onTimeout,insertBefore:self.insertBefore,charset:self.charset,timeout:self.timeout,scope:self});}};if(css.length>startLen){YAHOO.util.Get.css(this._filter(css),{data:this._loading,onSuccess:loadScript,onFailure:this._onFailure,onTimeout:this._onTimeout,insertBefore:this.insertBefore,charset:this.charset,timeout:this.timeout,scope:self});}else{loadScript();}return;}else{this.loadNext(this._loading);}},insert:function(o,type){this.calculate(o);this._loading=true;this.loadType=type;if(this.combine){return this._combine();}if(!type){var self=this;this._internalCallback=function(){self._internalCallback=null;self.insert(null,"js");};this.insert(null,"css");return;}this.loadNext();},sandbox:function(o,type){this._config(o);if(!this.onSuccess){throw new Error("You must supply an onSuccess handler for your sandbox");}this._sandbox=true;var self=this;if(!type||type!=="js"){this._internalCallback=function(){self._internalCallback=null;self.sandbox(null,"js");};this.insert(null,"css");return;}if(!util.Connect){var ld=new YAHOO.util.YUILoader();ld.insert({base:this.base,filter:this.filter,require:"connection",insertBefore:this.insertBefore,charset:this.charset,onSuccess:function(){this.sandbox(null,"js");},scope:this},"js");return;}this._scriptText=[];this._loadCount=0;this._stopCount=this.sorted.length;this._xhr=[];this.calculate();var s=this.sorted,l=s.length,i,m,url;for(i=0;i<l;i=i+1){m=this.moduleInfo[s[i]];if(!m){this._onFailure("undefined module "+m);for(var j=0;j<this._xhr.length;j=j+1){this._xhr[j].abort();}return;}if(m.type!=="js"){this._loadCount++;continue;}url=m.fullpath;url=(url)?this._filter(url):this._url(m.path);var xhrData={success:function(o){var idx=o.argument[0],name=o.argument[2];this._scriptText[idx]=o.responseText;if(this.onProgress){this.onProgress.call(this.scope,{name:name,scriptText:o.responseText,xhrResponse:o,data:this.data});}this._loadCount++;if(this._loadCount>=this._stopCount){var v=this.varName||"YAHOO";var t="(function() {\n";var b="\nreturn "+v+";\n})();";var ref=eval(t+this._scriptText.join("\n")+b);this._pushEvents(ref);if(ref){this.onSuccess.call(this.scope,{reference:ref,data:this.data});}else{this._onFailure.call(this.varName+" reference failure");}}},failure:function(o){this.onFailure.call(this.scope,{msg:"XHR failure",xhrResponse:o,data:this.data});},scope:this,argument:[i,url,s[i]]};this._xhr.push(util.Connect.asyncRequest("GET",url,xhrData));}},loadNext:function(mname){if(!this._loading){return;}if(mname){if(mname!==this._loading){return;}this.inserted[mname]=true;if(this.onProgress){this.onProgress.call(this.scope,{name:mname,data:this.data});}}var s=this.sorted,len=s.length,i,m;for(i=0;i<len;i=i+1){if(s[i] in this.inserted){continue;}if(s[i]===this._loading){return;}m=this.moduleInfo[s[i]];if(!m){this.onFailure.call(this.scope,{msg:"undefined module "+m,data:this.data});return;}if(!this.loadType||this.loadType===m.type){this._loading=s[i];var fn=(m.type==="css")?util.Get.css:util.Get.script,url=m.fullpath,self=this,c=function(o){self.loadNext(o.data);};url=(url)?this._filter(url):this._url(m.path);if(env.ua.webkit&&env.ua.webkit<420&&m.type==="js"&&!m.varName){c=null;this._useYahooListener=true;}fn(url,{data:s[i],onSuccess:c,onFailure:this._onFailure,onTimeout:this._onTimeout,insertBefore:this.insertBefore,charset:this.charset,timeout:this.timeout,varName:m.varName,scope:self});return;}}this._loading=null;if(this._internalCallback){var f=this._internalCallback;this._internalCallback=null;f.call(this);}else{if(this.onSuccess){this._pushEvents();this.onSuccess.call(this.scope,{data:this.data});}}},_pushEvents:function(ref){var r=ref||YAHOO;if(r.util&&r.util.Event){r.util.Event._load();}},_filter:function(str){var f=this.filter;return(f)?str.replace(new RegExp(f.searchExp,"g"),f.replaceStr):str;},_url:function(path){return this._filter((this.base||"")+path);}};})();YAHOO.register("yuiloader",YAHOO.util.YUILoader,{version:"2.7.0",build:"1799"});
(function(){YAHOO.env._id_counter=YAHOO.env._id_counter||0;var E=YAHOO.util,L=YAHOO.lang,m=YAHOO.env.ua,A=YAHOO.lang.trim,d={},h={},N=/^t(?:able|d|h)$/i,X=/color$/i,K=window.document,W=K.documentElement,e="ownerDocument",n="defaultView",v="documentElement",t="compatMode",b="offsetLeft",P="offsetTop",u="offsetParent",Z="parentNode",l="nodeType",C="tagName",O="scrollLeft",i="scrollTop",Q="getBoundingClientRect",w="getComputedStyle",a="currentStyle",M="CSS1Compat",c="BackCompat",g="class",F="className",J="",B=" ",s="(?:^|\\s)",k="(?= |$)",U="g",p="position",f="fixed",V="relative",j="left",o="top",r="medium",q="borderLeftWidth",R="borderTopWidth",D=m.opera,I=m.webkit,H=m.gecko,T=m.ie;E.Dom={CUSTOM_ATTRIBUTES:(!W.hasAttribute)?{"for":"htmlFor","class":F}:{"htmlFor":"for","className":g},get:function(y){var AA,Y,z,x,G;if(y){if(y[l]||y.item){return y;}if(typeof y==="string"){AA=y;y=K.getElementById(y);if(y&&y.id===AA){return y;}else{if(y&&K.all){y=null;Y=K.all[AA];for(x=0,G=Y.length;x<G;++x){if(Y[x].id===AA){return Y[x];}}}}return y;}if(y.DOM_EVENTS){y=y.get("element");}if("length" in y){z=[];for(x=0,G=y.length;x<G;++x){z[z.length]=E.Dom.get(y[x]);}return z;}return y;}return null;},getComputedStyle:function(G,Y){if(window[w]){return G[e][n][w](G,null)[Y];}else{if(G[a]){return E.Dom.IE_ComputedStyle.get(G,Y);}}},getStyle:function(G,Y){return E.Dom.batch(G,E.Dom._getStyle,Y);},_getStyle:function(){if(window[w]){return function(G,y){y=(y==="float")?y="cssFloat":E.Dom._toCamel(y);var x=G.style[y],Y;if(!x){Y=G[e][n][w](G,null);if(Y){x=Y[y];}}return x;};}else{if(W[a]){return function(G,y){var x;switch(y){case"opacity":x=100;try{x=G.filters["DXImageTransform.Microsoft.Alpha"].opacity;}catch(z){try{x=G.filters("alpha").opacity;}catch(Y){}}return x/100;case"float":y="styleFloat";default:y=E.Dom._toCamel(y);x=G[a]?G[a][y]:null;return(G.style[y]||x);}};}}}(),setStyle:function(G,Y,x){E.Dom.batch(G,E.Dom._setStyle,{prop:Y,val:x});},_setStyle:function(){if(T){return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){switch(x){case"opacity":if(L.isString(Y.style.filter)){Y.style.filter="alpha(opacity="+y*100+")";if(!Y[a]||!Y[a].hasLayout){Y.style.zoom=1;}}break;case"float":x="styleFloat";default:Y.style[x]=y;}}else{}};}else{return function(Y,G){var x=E.Dom._toCamel(G.prop),y=G.val;if(Y){if(x=="float"){x="cssFloat";}Y.style[x]=y;}else{}};}}(),getXY:function(G){return E.Dom.batch(G,E.Dom._getXY);},_canPosition:function(G){return(E.Dom._getStyle(G,"display")!=="none"&&E.Dom._inDoc(G));},_getXY:function(){if(K[v][Q]){return function(y){var z,Y,AA,AF,AE,AD,AC,G,x,AB=Math.floor,AG=false;if(E.Dom._canPosition(y)){AA=y[Q]();AF=y[e];z=E.Dom.getDocumentScrollLeft(AF);Y=E.Dom.getDocumentScrollTop(AF);AG=[AB(AA[j]),AB(AA[o])];if(T&&m.ie<8){AE=2;AD=2;AC=AF[t];G=S(AF[v],q);x=S(AF[v],R);if(m.ie===6){if(AC!==c){AE=0;AD=0;}}if((AC==c)){if(G!==r){AE=parseInt(G,10);}if(x!==r){AD=parseInt(x,10);}}AG[0]-=AE;AG[1]-=AD;}if((Y||z)){AG[0]+=z;AG[1]+=Y;}AG[0]=AB(AG[0]);AG[1]=AB(AG[1]);}else{}return AG;};}else{return function(y){var x,Y,AA,AB,AC,z=false,G=y;if(E.Dom._canPosition(y)){z=[y[b],y[P]];x=E.Dom.getDocumentScrollLeft(y[e]);Y=E.Dom.getDocumentScrollTop(y[e]);AC=((H||m.webkit>519)?true:false);while((G=G[u])){z[0]+=G[b];z[1]+=G[P];if(AC){z=E.Dom._calcBorders(G,z);}}if(E.Dom._getStyle(y,p)!==f){G=y;while((G=G[Z])&&G[C]){AA=G[i];AB=G[O];if(H&&(E.Dom._getStyle(G,"overflow")!=="visible")){z=E.Dom._calcBorders(G,z);}if(AA||AB){z[0]-=AB;z[1]-=AA;}}z[0]+=x;z[1]+=Y;}else{if(D){z[0]-=x;z[1]-=Y;}else{if(I||H){z[0]+=x;z[1]+=Y;}}}z[0]=Math.floor(z[0]);z[1]=Math.floor(z[1]);}else{}return z;};}}(),getX:function(G){var Y=function(x){return E.Dom.getXY(x)[0];};return E.Dom.batch(G,Y,E.Dom,true);},getY:function(G){var Y=function(x){return E.Dom.getXY(x)[1];};return E.Dom.batch(G,Y,E.Dom,true);},setXY:function(G,x,Y){E.Dom.batch(G,E.Dom._setXY,{pos:x,noRetry:Y});},_setXY:function(G,z){var AA=E.Dom._getStyle(G,p),y=E.Dom.setStyle,AD=z.pos,Y=z.noRetry,AB=[parseInt(E.Dom.getComputedStyle(G,j),10),parseInt(E.Dom.getComputedStyle(G,o),10)],AC,x;if(AA=="static"){AA=V;y(G,p,AA);}AC=E.Dom._getXY(G);if(!AD||AC===false){return false;}if(isNaN(AB[0])){AB[0]=(AA==V)?0:G[b];}if(isNaN(AB[1])){AB[1]=(AA==V)?0:G[P];}if(AD[0]!==null){y(G,j,AD[0]-AC[0]+AB[0]+"px");}if(AD[1]!==null){y(G,o,AD[1]-AC[1]+AB[1]+"px");}if(!Y){x=E.Dom._getXY(G);if((AD[0]!==null&&x[0]!=AD[0])||(AD[1]!==null&&x[1]!=AD[1])){E.Dom._setXY(G,{pos:AD,noRetry:true});}}},setX:function(Y,G){E.Dom.setXY(Y,[G,null]);},setY:function(G,Y){E.Dom.setXY(G,[null,Y]);},getRegion:function(G){var Y=function(x){var y=false;if(E.Dom._canPosition(x)){y=E.Region.getRegion(x);}else{}return y;};return E.Dom.batch(G,Y,E.Dom,true);},getClientWidth:function(){return E.Dom.getViewportWidth();},getClientHeight:function(){return E.Dom.getViewportHeight();},getElementsByClassName:function(AB,AF,AC,AE,x,AD){AB=L.trim(AB);AF=AF||"*";AC=(AC)?E.Dom.get(AC):null||K;if(!AC){return[];}var Y=[],G=AC.getElementsByTagName(AF),z=E.Dom.hasClass;for(var y=0,AA=G.length;y<AA;++y){if(z(G[y],AB)){Y[Y.length]=G[y];}}if(AE){E.Dom.batch(Y,AE,x,AD);}return Y;},hasClass:function(Y,G){return E.Dom.batch(Y,E.Dom._hasClass,G);},_hasClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(Y.exec){G=Y.test(y);}else{G=Y&&(B+y+B).indexOf(B+Y+B)>-1;}}else{}return G;},addClass:function(Y,G){return E.Dom.batch(Y,E.Dom._addClass,G);},_addClass:function(x,Y){var G=false,y;if(x&&Y){y=E.Dom.getAttribute(x,F)||J;if(!E.Dom._hasClass(x,Y)){E.Dom.setAttribute(x,F,A(y+B+Y));G=true;}}else{}return G;},removeClass:function(Y,G){return E.Dom.batch(Y,E.Dom._removeClass,G);},_removeClass:function(y,x){var Y=false,AA,z,G;if(y&&x){AA=E.Dom.getAttribute(y,F)||J;E.Dom.setAttribute(y,F,AA.replace(E.Dom._getClassRegex(x),J));z=E.Dom.getAttribute(y,F);if(AA!==z){E.Dom.setAttribute(y,F,A(z));Y=true;if(E.Dom.getAttribute(y,F)===""){G=(y.hasAttribute&&y.hasAttribute(g))?g:F;y.removeAttribute(G);}}}else{}return Y;},replaceClass:function(x,Y,G){return E.Dom.batch(x,E.Dom._replaceClass,{from:Y,to:G});
},_replaceClass:function(y,x){var Y,AB,AA,G=false,z;if(y&&x){AB=x.from;AA=x.to;if(!AA){G=false;}else{if(!AB){G=E.Dom._addClass(y,x.to);}else{if(AB!==AA){z=E.Dom.getAttribute(y,F)||J;Y=(B+z.replace(E.Dom._getClassRegex(AB),B+AA)).split(E.Dom._getClassRegex(AA));Y.splice(1,0,B+AA);E.Dom.setAttribute(y,F,A(Y.join(J)));G=true;}}}}else{}return G;},generateId:function(G,x){x=x||"yui-gen";var Y=function(y){if(y&&y.id){return y.id;}var z=x+YAHOO.env._id_counter++;if(y){if(y[e].getElementById(z)){return E.Dom.generateId(y,z+x);}y.id=z;}return z;};return E.Dom.batch(G,Y,E.Dom,true)||Y.apply(E.Dom,arguments);},isAncestor:function(Y,x){Y=E.Dom.get(Y);x=E.Dom.get(x);var G=false;if((Y&&x)&&(Y[l]&&x[l])){if(Y.contains&&Y!==x){G=Y.contains(x);}else{if(Y.compareDocumentPosition){G=!!(Y.compareDocumentPosition(x)&16);}}}else{}return G;},inDocument:function(G,Y){return E.Dom._inDoc(E.Dom.get(G),Y);},_inDoc:function(Y,x){var G=false;if(Y&&Y[C]){x=x||Y[e];G=E.Dom.isAncestor(x[v],Y);}else{}return G;},getElementsBy:function(Y,AF,AB,AD,y,AC,AE){AF=AF||"*";AB=(AB)?E.Dom.get(AB):null||K;if(!AB){return[];}var x=[],G=AB.getElementsByTagName(AF);for(var z=0,AA=G.length;z<AA;++z){if(Y(G[z])){if(AE){x=G[z];break;}else{x[x.length]=G[z];}}}if(AD){E.Dom.batch(x,AD,y,AC);}return x;},getElementBy:function(x,G,Y){return E.Dom.getElementsBy(x,G,Y,null,null,null,true);},batch:function(x,AB,AA,z){var y=[],Y=(z)?AA:window;x=(x&&(x[C]||x.item))?x:E.Dom.get(x);if(x&&AB){if(x[C]||x.length===undefined){return AB.call(Y,x,AA);}for(var G=0;G<x.length;++G){y[y.length]=AB.call(Y,x[G],AA);}}else{return false;}return y;},getDocumentHeight:function(){var Y=(K[t]!=M||I)?K.body.scrollHeight:W.scrollHeight,G=Math.max(Y,E.Dom.getViewportHeight());return G;},getDocumentWidth:function(){var Y=(K[t]!=M||I)?K.body.scrollWidth:W.scrollWidth,G=Math.max(Y,E.Dom.getViewportWidth());return G;},getViewportHeight:function(){var G=self.innerHeight,Y=K[t];if((Y||T)&&!D){G=(Y==M)?W.clientHeight:K.body.clientHeight;}return G;},getViewportWidth:function(){var G=self.innerWidth,Y=K[t];if(Y||T){G=(Y==M)?W.clientWidth:K.body.clientWidth;}return G;},getAncestorBy:function(G,Y){while((G=G[Z])){if(E.Dom._testElement(G,Y)){return G;}}return null;},getAncestorByClassName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return E.Dom.hasClass(y,G);};return E.Dom.getAncestorBy(Y,x);},getAncestorByTagName:function(Y,G){Y=E.Dom.get(Y);if(!Y){return null;}var x=function(y){return y[C]&&y[C].toUpperCase()==G.toUpperCase();};return E.Dom.getAncestorBy(Y,x);},getPreviousSiblingBy:function(G,Y){while(G){G=G.previousSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getPreviousSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getPreviousSiblingBy(G);},getNextSiblingBy:function(G,Y){while(G){G=G.nextSibling;if(E.Dom._testElement(G,Y)){return G;}}return null;},getNextSibling:function(G){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getNextSiblingBy(G);},getFirstChildBy:function(G,x){var Y=(E.Dom._testElement(G.firstChild,x))?G.firstChild:null;return Y||E.Dom.getNextSiblingBy(G.firstChild,x);},getFirstChild:function(G,Y){G=E.Dom.get(G);if(!G){return null;}return E.Dom.getFirstChildBy(G);},getLastChildBy:function(G,x){if(!G){return null;}var Y=(E.Dom._testElement(G.lastChild,x))?G.lastChild:null;return Y||E.Dom.getPreviousSiblingBy(G.lastChild,x);},getLastChild:function(G){G=E.Dom.get(G);return E.Dom.getLastChildBy(G);},getChildrenBy:function(Y,y){var x=E.Dom.getFirstChildBy(Y,y),G=x?[x]:[];E.Dom.getNextSiblingBy(x,function(z){if(!y||y(z)){G[G.length]=z;}return false;});return G;},getChildren:function(G){G=E.Dom.get(G);if(!G){}return E.Dom.getChildrenBy(G);},getDocumentScrollLeft:function(G){G=G||K;return Math.max(G[v].scrollLeft,G.body.scrollLeft);},getDocumentScrollTop:function(G){G=G||K;return Math.max(G[v].scrollTop,G.body.scrollTop);},insertBefore:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}return G[Z].insertBefore(Y,G);},insertAfter:function(Y,G){Y=E.Dom.get(Y);G=E.Dom.get(G);if(!Y||!G||!G[Z]){return null;}if(G.nextSibling){return G[Z].insertBefore(Y,G.nextSibling);}else{return G[Z].appendChild(Y);}},getClientRegion:function(){var x=E.Dom.getDocumentScrollTop(),Y=E.Dom.getDocumentScrollLeft(),y=E.Dom.getViewportWidth()+Y,G=E.Dom.getViewportHeight()+x;return new E.Region(x,y,G,Y);},setAttribute:function(Y,G,x){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;Y.setAttribute(G,x);},getAttribute:function(Y,G){G=E.Dom.CUSTOM_ATTRIBUTES[G]||G;return Y.getAttribute(G);},_toCamel:function(Y){var x=d;function G(y,z){return z.toUpperCase();}return x[Y]||(x[Y]=Y.indexOf("-")===-1?Y:Y.replace(/-([a-z])/gi,G));},_getClassRegex:function(Y){var G;if(Y!==undefined){if(Y.exec){G=Y;}else{G=h[Y];if(!G){Y=Y.replace(E.Dom._patterns.CLASS_RE_TOKENS,"\\$1");G=h[Y]=new RegExp(s+Y+k,U);}}}return G;},_patterns:{ROOT_TAG:/^body|html$/i,CLASS_RE_TOKENS:/([\.\(\)\^\$\*\+\?\|\[\]\{\}])/g},_testElement:function(G,Y){return G&&G[l]==1&&(!Y||Y(G));},_calcBorders:function(x,y){var Y=parseInt(E.Dom[w](x,R),10)||0,G=parseInt(E.Dom[w](x,q),10)||0;if(H){if(N.test(x[C])){Y=0;G=0;}}y[0]+=G;y[1]+=Y;return y;}};var S=E.Dom[w];if(m.opera){E.Dom[w]=function(Y,G){var x=S(Y,G);if(X.test(G)){x=E.Dom.Color.toRGB(x);}return x;};}if(m.webkit){E.Dom[w]=function(Y,G){var x=S(Y,G);if(x==="rgba(0, 0, 0, 0)"){x="transparent";}return x;};}})();YAHOO.util.Region=function(C,D,A,B){this.top=C;this.y=C;this[1]=C;this.right=D;this.bottom=A;this.left=B;this.x=B;this[0]=B;this.width=this.right-this.left;this.height=this.bottom-this.top;};YAHOO.util.Region.prototype.contains=function(A){return(A.left>=this.left&&A.right<=this.right&&A.top>=this.top&&A.bottom<=this.bottom);};YAHOO.util.Region.prototype.getArea=function(){return((this.bottom-this.top)*(this.right-this.left));};YAHOO.util.Region.prototype.intersect=function(E){var C=Math.max(this.top,E.top),D=Math.min(this.right,E.right),A=Math.min(this.bottom,E.bottom),B=Math.max(this.left,E.left);if(A>=C&&D>=B){return new YAHOO.util.Region(C,D,A,B);
}else{return null;}};YAHOO.util.Region.prototype.union=function(E){var C=Math.min(this.top,E.top),D=Math.max(this.right,E.right),A=Math.max(this.bottom,E.bottom),B=Math.min(this.left,E.left);return new YAHOO.util.Region(C,D,A,B);};YAHOO.util.Region.prototype.toString=function(){return("Region {"+"top: "+this.top+", right: "+this.right+", bottom: "+this.bottom+", left: "+this.left+", height: "+this.height+", width: "+this.width+"}");};YAHOO.util.Region.getRegion=function(D){var F=YAHOO.util.Dom.getXY(D),C=F[1],E=F[0]+D.offsetWidth,A=F[1]+D.offsetHeight,B=F[0];return new YAHOO.util.Region(C,E,A,B);};YAHOO.util.Point=function(A,B){if(YAHOO.lang.isArray(A)){B=A[1];A=A[0];}YAHOO.util.Point.superclass.constructor.call(this,B,A,B,A);};YAHOO.extend(YAHOO.util.Point,YAHOO.util.Region);(function(){var B=YAHOO.util,A="clientTop",F="clientLeft",J="parentNode",K="right",W="hasLayout",I="px",U="opacity",L="auto",D="borderLeftWidth",G="borderTopWidth",P="borderRightWidth",V="borderBottomWidth",S="visible",Q="transparent",N="height",E="width",H="style",T="currentStyle",R=/^width|height$/,O=/^(\d[.\d]*)+(em|ex|px|gd|rem|vw|vh|vm|ch|mm|cm|in|pt|pc|deg|rad|ms|s|hz|khz|%){1}?/i,M={get:function(X,Z){var Y="",a=X[T][Z];if(Z===U){Y=B.Dom.getStyle(X,U);}else{if(!a||(a.indexOf&&a.indexOf(I)>-1)){Y=a;}else{if(B.Dom.IE_COMPUTED[Z]){Y=B.Dom.IE_COMPUTED[Z](X,Z);}else{if(O.test(a)){Y=B.Dom.IE.ComputedStyle.getPixel(X,Z);}else{Y=a;}}}}return Y;},getOffset:function(Z,e){var b=Z[T][e],X=e.charAt(0).toUpperCase()+e.substr(1),c="offset"+X,Y="pixel"+X,a="",d;if(b==L){d=Z[c];if(d===undefined){a=0;}a=d;if(R.test(e)){Z[H][e]=d;if(Z[c]>d){a=d-(Z[c]-d);}Z[H][e]=L;}}else{if(!Z[H][Y]&&!Z[H][e]){Z[H][e]=b;}a=Z[H][Y];}return a+I;},getBorderWidth:function(X,Z){var Y=null;if(!X[T][W]){X[H].zoom=1;}switch(Z){case G:Y=X[A];break;case V:Y=X.offsetHeight-X.clientHeight-X[A];break;case D:Y=X[F];break;case P:Y=X.offsetWidth-X.clientWidth-X[F];break;}return Y+I;},getPixel:function(Y,X){var a=null,b=Y[T][K],Z=Y[T][X];Y[H][K]=Z;a=Y[H].pixelRight;Y[H][K]=b;return a+I;},getMargin:function(Y,X){var Z;if(Y[T][X]==L){Z=0+I;}else{Z=B.Dom.IE.ComputedStyle.getPixel(Y,X);}return Z;},getVisibility:function(Y,X){var Z;while((Z=Y[T])&&Z[X]=="inherit"){Y=Y[J];}return(Z)?Z[X]:S;},getColor:function(Y,X){return B.Dom.Color.toRGB(Y[T][X])||Q;},getBorderColor:function(Y,X){var Z=Y[T],a=Z[X]||Z.color;return B.Dom.Color.toRGB(B.Dom.Color.toHex(a));}},C={};C.top=C.right=C.bottom=C.left=C[E]=C[N]=M.getOffset;C.color=M.getColor;C[G]=C[P]=C[V]=C[D]=M.getBorderWidth;C.marginTop=C.marginRight=C.marginBottom=C.marginLeft=M.getMargin;C.visibility=M.getVisibility;C.borderColor=C.borderTopColor=C.borderRightColor=C.borderBottomColor=C.borderLeftColor=M.getBorderColor;B.Dom.IE_COMPUTED=C;B.Dom.IE_ComputedStyle=M;})();(function(){var C="toString",A=parseInt,B=RegExp,D=YAHOO.util;D.Dom.Color={KEYWORDS:{black:"000",silver:"c0c0c0",gray:"808080",white:"fff",maroon:"800000",red:"f00",purple:"800080",fuchsia:"f0f",green:"008000",lime:"0f0",olive:"808000",yellow:"ff0",navy:"000080",blue:"00f",teal:"008080",aqua:"0ff"},re_RGB:/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i,re_hex:/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i,re_hex3:/([0-9A-F])/gi,toRGB:function(E){if(!D.Dom.Color.re_RGB.test(E)){E=D.Dom.Color.toHex(E);}if(D.Dom.Color.re_hex.exec(E)){E="rgb("+[A(B.$1,16),A(B.$2,16),A(B.$3,16)].join(", ")+")";}return E;},toHex:function(H){H=D.Dom.Color.KEYWORDS[H]||H;if(D.Dom.Color.re_RGB.exec(H)){var G=(B.$1.length===1)?"0"+B.$1:Number(B.$1),F=(B.$2.length===1)?"0"+B.$2:Number(B.$2),E=(B.$3.length===1)?"0"+B.$3:Number(B.$3);H=[G[C](16),F[C](16),E[C](16)].join("");}if(H.length<6){H=H.replace(D.Dom.Color.re_hex3,"$1$1");}if(H!=="transparent"&&H.indexOf("#")<0){H="#"+H;}return H.toLowerCase();}};}());YAHOO.register("dom",YAHOO.util.Dom,{version:"2.7.0",build:"1799"});YAHOO.util.CustomEvent=function(D,C,B,A){this.type=D;this.scope=C||window;this.silent=B;this.signature=A||YAHOO.util.CustomEvent.LIST;this.subscribers=[];if(!this.silent){}var E="_YUICEOnSubscribe";if(D!==E){this.subscribeEvent=new YAHOO.util.CustomEvent(E,this,true);}this.lastError=null;};YAHOO.util.CustomEvent.LIST=0;YAHOO.util.CustomEvent.FLAT=1;YAHOO.util.CustomEvent.prototype={subscribe:function(A,B,C){if(!A){throw new Error("Invalid callback for subscriber to '"+this.type+"'");}if(this.subscribeEvent){this.subscribeEvent.fire(A,B,C);}this.subscribers.push(new YAHOO.util.Subscriber(A,B,C));},unsubscribe:function(D,F){if(!D){return this.unsubscribeAll();}var E=false;for(var B=0,A=this.subscribers.length;B<A;++B){var C=this.subscribers[B];if(C&&C.contains(D,F)){this._delete(B);E=true;}}return E;},fire:function(){this.lastError=null;var K=[],E=this.subscribers.length;if(!E&&this.silent){return true;}var I=[].slice.call(arguments,0),G=true,D,J=false;if(!this.silent){}var C=this.subscribers.slice(),A=YAHOO.util.Event.throwErrors;for(D=0;D<E;++D){var M=C[D];if(!M){J=true;}else{if(!this.silent){}var L=M.getScope(this.scope);if(this.signature==YAHOO.util.CustomEvent.FLAT){var B=null;if(I.length>0){B=I[0];}try{G=M.fn.call(L,B,M.obj);}catch(F){this.lastError=F;if(A){throw F;}}}else{try{G=M.fn.call(L,this.type,I,M.obj);}catch(H){this.lastError=H;if(A){throw H;}}}if(false===G){if(!this.silent){}break;}}}return(G!==false);},unsubscribeAll:function(){var A=this.subscribers.length,B;for(B=A-1;B>-1;B--){this._delete(B);}this.subscribers=[];return A;},_delete:function(A){var B=this.subscribers[A];if(B){delete B.fn;delete B.obj;}this.subscribers.splice(A,1);},toString:function(){return"CustomEvent: "+"'"+this.type+"', "+"context: "+this.scope;}};YAHOO.util.Subscriber=function(A,B,C){this.fn=A;this.obj=YAHOO.lang.isUndefined(B)?null:B;this.overrideContext=C;};YAHOO.util.Subscriber.prototype.getScope=function(A){if(this.overrideContext){if(this.overrideContext===true){return this.obj;}else{return this.overrideContext;}}return A;};YAHOO.util.Subscriber.prototype.contains=function(A,B){if(B){return(this.fn==A&&this.obj==B);}else{return(this.fn==A);}};YAHOO.util.Subscriber.prototype.toString=function(){return"Subscriber { obj: "+this.obj+", overrideContext: "+(this.overrideContext||"no")+" }";};if(!YAHOO.util.Event){YAHOO.util.Event=function(){var H=false;var I=[];var J=[];var G=[];var E=[];var C=0;var F=[];var B=[];var A=0;var D={63232:38,63233:40,63234:37,63235:39,63276:33,63277:34,25:9};var K=YAHOO.env.ua.ie?"focusin":"focus";var L=YAHOO.env.ua.ie?"focusout":"blur";return{POLL_RETRYS:2000,POLL_INTERVAL:20,EL:0,TYPE:1,FN:2,WFN:3,UNLOAD_OBJ:3,ADJ_SCOPE:4,OBJ:5,OVERRIDE:6,lastError:null,isSafari:YAHOO.env.ua.webkit,webkit:YAHOO.env.ua.webkit,isIE:YAHOO.env.ua.ie,_interval:null,_dri:null,DOMReady:false,throwErrors:false,startInterval:function(){if(!this._interval){var M=this;var N=function(){M._tryPreloadAttach();};this._interval=setInterval(N,this.POLL_INTERVAL);}},onAvailable:function(S,O,Q,R,P){var M=(YAHOO.lang.isString(S))?[S]:S;for(var N=0;N<M.length;N=N+1){F.push({id:M[N],fn:O,obj:Q,overrideContext:R,checkReady:P});}C=this.POLL_RETRYS;this.startInterval();},onContentReady:function(P,M,N,O){this.onAvailable(P,M,N,O,true);},onDOMReady:function(M,N,O){if(this.DOMReady){setTimeout(function(){var P=window;if(O){if(O===true){P=N;}else{P=O;}}M.call(P,"DOMReady",[],N);},0);}else{this.DOMReadyEvent.subscribe(M,N,O);}},_addListener:function(O,M,Y,S,W,b){if(!Y||!Y.call){return false;}if(this._isValidCollection(O)){var Z=true;for(var T=0,V=O.length;T<V;++T){Z=this.on(O[T],M,Y,S,W)&&Z;}return Z;}else{if(YAHOO.lang.isString(O)){var R=this.getEl(O);if(R){O=R;}else{this.onAvailable(O,function(){YAHOO.util.Event.on(O,M,Y,S,W);});return true;}}}if(!O){return false;}if("unload"==M&&S!==this){J[J.length]=[O,M,Y,S,W];return true;}var N=O;if(W){if(W===true){N=S;}else{N=W;}}var P=function(c){return Y.call(N,YAHOO.util.Event.getEvent(c,O),S);};var a=[O,M,Y,P,N,S,W];var U=I.length;I[U]=a;if(this.useLegacyEvent(O,M)){var Q=this.getLegacyIndex(O,M);if(Q==-1||O!=G[Q][0]){Q=G.length;B[O.id+M]=Q;G[Q]=[O,M,O["on"+M]];E[Q]=[];O["on"+M]=function(c){YAHOO.util.Event.fireLegacyEvent(YAHOO.util.Event.getEvent(c),Q);};}E[Q].push(a);}else{try{this._simpleAdd(O,M,P,b);}catch(X){this.lastError=X;this.removeListener(O,M,Y);return false;}}return true;},addListener:function(N,Q,M,O,P){return this._addListener(N,Q,M,O,P,false);},addFocusListener:function(N,M,O,P){return this._addListener(N,K,M,O,P,true);},removeFocusListener:function(N,M){return this.removeListener(N,K,M);},addBlurListener:function(N,M,O,P){return this._addListener(N,L,M,O,P,true);},removeBlurListener:function(N,M){return this.removeListener(N,L,M);},fireLegacyEvent:function(R,P){var T=true,M,V,U,N,S;V=E[P].slice();for(var O=0,Q=V.length;O<Q;++O){U=V[O];if(U&&U[this.WFN]){N=U[this.ADJ_SCOPE];S=U[this.WFN].call(N,R);T=(T&&S);}}M=G[P];if(M&&M[2]){M[2](R);}return T;},getLegacyIndex:function(N,O){var M=this.generateId(N)+O;if(typeof B[M]=="undefined"){return -1;}else{return B[M];}},useLegacyEvent:function(M,N){return(this.webkit&&this.webkit<419&&("click"==N||"dblclick"==N));},removeListener:function(N,M,V){var Q,T,X;if(typeof N=="string"){N=this.getEl(N);}else{if(this._isValidCollection(N)){var W=true;for(Q=N.length-1;Q>-1;Q--){W=(this.removeListener(N[Q],M,V)&&W);}return W;}}if(!V||!V.call){return this.purgeElement(N,false,M);}if("unload"==M){for(Q=J.length-1;Q>-1;Q--){X=J[Q];if(X&&X[0]==N&&X[1]==M&&X[2]==V){J.splice(Q,1);return true;}}return false;}var R=null;var S=arguments[3];if("undefined"===typeof S){S=this._getCacheIndex(N,M,V);}if(S>=0){R=I[S];}if(!N||!R){return false;}if(this.useLegacyEvent(N,M)){var P=this.getLegacyIndex(N,M);var O=E[P];if(O){for(Q=0,T=O.length;Q<T;++Q){X=O[Q];if(X&&X[this.EL]==N&&X[this.TYPE]==M&&X[this.FN]==V){O.splice(Q,1);break;}}}}else{try{this._simpleRemove(N,M,R[this.WFN],false);}catch(U){this.lastError=U;return false;}}delete I[S][this.WFN];delete I[S][this.FN];
I.splice(S,1);return true;},getTarget:function(O,N){var M=O.target||O.srcElement;return this.resolveTextNode(M);},resolveTextNode:function(N){try{if(N&&3==N.nodeType){return N.parentNode;}}catch(M){}return N;},getPageX:function(N){var M=N.pageX;if(!M&&0!==M){M=N.clientX||0;if(this.isIE){M+=this._getScrollLeft();}}return M;},getPageY:function(M){var N=M.pageY;if(!N&&0!==N){N=M.clientY||0;if(this.isIE){N+=this._getScrollTop();}}return N;},getXY:function(M){return[this.getPageX(M),this.getPageY(M)];},getRelatedTarget:function(N){var M=N.relatedTarget;if(!M){if(N.type=="mouseout"){M=N.toElement;}else{if(N.type=="mouseover"){M=N.fromElement;}}}return this.resolveTextNode(M);},getTime:function(O){if(!O.time){var N=new Date().getTime();try{O.time=N;}catch(M){this.lastError=M;return N;}}return O.time;},stopEvent:function(M){this.stopPropagation(M);this.preventDefault(M);},stopPropagation:function(M){if(M.stopPropagation){M.stopPropagation();}else{M.cancelBubble=true;}},preventDefault:function(M){if(M.preventDefault){M.preventDefault();}else{M.returnValue=false;}},getEvent:function(O,M){var N=O||window.event;if(!N){var P=this.getEvent.caller;while(P){N=P.arguments[0];if(N&&Event==N.constructor){break;}P=P.caller;}}return N;},getCharCode:function(N){var M=N.keyCode||N.charCode||0;if(YAHOO.env.ua.webkit&&(M in D)){M=D[M];}return M;},_getCacheIndex:function(Q,R,P){for(var O=0,N=I.length;O<N;O=O+1){var M=I[O];if(M&&M[this.FN]==P&&M[this.EL]==Q&&M[this.TYPE]==R){return O;}}return -1;},generateId:function(M){var N=M.id;if(!N){N="yuievtautoid-"+A;++A;M.id=N;}return N;},_isValidCollection:function(N){try{return(N&&typeof N!=="string"&&N.length&&!N.tagName&&!N.alert&&typeof N[0]!=="undefined");}catch(M){return false;}},elCache:{},getEl:function(M){return(typeof M==="string")?document.getElementById(M):M;},clearCache:function(){},DOMReadyEvent:new YAHOO.util.CustomEvent("DOMReady",this),_load:function(N){if(!H){H=true;var M=YAHOO.util.Event;M._ready();M._tryPreloadAttach();}},_ready:function(N){var M=YAHOO.util.Event;if(!M.DOMReady){M.DOMReady=true;M.DOMReadyEvent.fire();M._simpleRemove(document,"DOMContentLoaded",M._ready);}},_tryPreloadAttach:function(){if(F.length===0){C=0;if(this._interval){clearInterval(this._interval);this._interval=null;}return;}if(this.locked){return;}if(this.isIE){if(!this.DOMReady){this.startInterval();return;}}this.locked=true;var S=!H;if(!S){S=(C>0&&F.length>0);}var R=[];var T=function(V,W){var U=V;if(W.overrideContext){if(W.overrideContext===true){U=W.obj;}else{U=W.overrideContext;}}W.fn.call(U,W.obj);};var N,M,Q,P,O=[];for(N=0,M=F.length;N<M;N=N+1){Q=F[N];if(Q){P=this.getEl(Q.id);if(P){if(Q.checkReady){if(H||P.nextSibling||!S){O.push(Q);F[N]=null;}}else{T(P,Q);F[N]=null;}}else{R.push(Q);}}}for(N=0,M=O.length;N<M;N=N+1){Q=O[N];T(this.getEl(Q.id),Q);}C--;if(S){for(N=F.length-1;N>-1;N--){Q=F[N];if(!Q||!Q.id){F.splice(N,1);}}this.startInterval();}else{if(this._interval){clearInterval(this._interval);this._interval=null;}}this.locked=false;},purgeElement:function(Q,R,T){var O=(YAHOO.lang.isString(Q))?this.getEl(Q):Q;var S=this.getListeners(O,T),P,M;if(S){for(P=S.length-1;P>-1;P--){var N=S[P];this.removeListener(O,N.type,N.fn);}}if(R&&O&&O.childNodes){for(P=0,M=O.childNodes.length;P<M;++P){this.purgeElement(O.childNodes[P],R,T);}}},getListeners:function(O,M){var R=[],N;if(!M){N=[I,J];}else{if(M==="unload"){N=[J];}else{N=[I];}}var T=(YAHOO.lang.isString(O))?this.getEl(O):O;for(var Q=0;Q<N.length;Q=Q+1){var V=N[Q];if(V){for(var S=0,U=V.length;S<U;++S){var P=V[S];if(P&&P[this.EL]===T&&(!M||M===P[this.TYPE])){R.push({type:P[this.TYPE],fn:P[this.FN],obj:P[this.OBJ],adjust:P[this.OVERRIDE],scope:P[this.ADJ_SCOPE],index:S});}}}}return(R.length)?R:null;},_unload:function(T){var N=YAHOO.util.Event,Q,P,O,S,R,U=J.slice(),M;for(Q=0,S=J.length;Q<S;++Q){O=U[Q];if(O){M=window;if(O[N.ADJ_SCOPE]){if(O[N.ADJ_SCOPE]===true){M=O[N.UNLOAD_OBJ];}else{M=O[N.ADJ_SCOPE];}}O[N.FN].call(M,N.getEvent(T,O[N.EL]),O[N.UNLOAD_OBJ]);U[Q]=null;}}O=null;M=null;J=null;if(I){for(P=I.length-1;P>-1;P--){O=I[P];if(O){N.removeListener(O[N.EL],O[N.TYPE],O[N.FN],P);}}O=null;}G=null;N._simpleRemove(window,"unload",N._unload);},_getScrollLeft:function(){return this._getScroll()[1];},_getScrollTop:function(){return this._getScroll()[0];},_getScroll:function(){var M=document.documentElement,N=document.body;if(M&&(M.scrollTop||M.scrollLeft)){return[M.scrollTop,M.scrollLeft];}else{if(N){return[N.scrollTop,N.scrollLeft];}else{return[0,0];}}},regCE:function(){},_simpleAdd:function(){if(window.addEventListener){return function(O,P,N,M){O.addEventListener(P,N,(M));};}else{if(window.attachEvent){return function(O,P,N,M){O.attachEvent("on"+P,N);};}else{return function(){};}}}(),_simpleRemove:function(){if(window.removeEventListener){return function(O,P,N,M){O.removeEventListener(P,N,(M));};}else{if(window.detachEvent){return function(N,O,M){N.detachEvent("on"+O,M);};}else{return function(){};}}}()};}();(function(){var EU=YAHOO.util.Event;EU.on=EU.addListener;EU.onFocus=EU.addFocusListener;EU.onBlur=EU.addBlurListener;
/* DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */
if(EU.isIE){YAHOO.util.Event.onDOMReady(YAHOO.util.Event._tryPreloadAttach,YAHOO.util.Event,true);var n=document.createElement("p");EU._dri=setInterval(function(){try{n.doScroll("left");clearInterval(EU._dri);EU._dri=null;EU._ready();n=null;}catch(ex){}},EU.POLL_INTERVAL);}else{if(EU.webkit&&EU.webkit<525){EU._dri=setInterval(function(){var rs=document.readyState;if("loaded"==rs||"complete"==rs){clearInterval(EU._dri);EU._dri=null;EU._ready();}},EU.POLL_INTERVAL);}else{EU._simpleAdd(document,"DOMContentLoaded",EU._ready);}}EU._simpleAdd(window,"load",EU._load);EU._simpleAdd(window,"unload",EU._unload);EU._tryPreloadAttach();})();}YAHOO.util.EventProvider=function(){};YAHOO.util.EventProvider.prototype={__yui_events:null,__yui_subscribers:null,subscribe:function(A,C,F,E){this.__yui_events=this.__yui_events||{};var D=this.__yui_events[A];if(D){D.subscribe(C,F,E);
}else{this.__yui_subscribers=this.__yui_subscribers||{};var B=this.__yui_subscribers;if(!B[A]){B[A]=[];}B[A].push({fn:C,obj:F,overrideContext:E});}},unsubscribe:function(C,E,G){this.__yui_events=this.__yui_events||{};var A=this.__yui_events;if(C){var F=A[C];if(F){return F.unsubscribe(E,G);}}else{var B=true;for(var D in A){if(YAHOO.lang.hasOwnProperty(A,D)){B=B&&A[D].unsubscribe(E,G);}}return B;}return false;},unsubscribeAll:function(A){return this.unsubscribe(A);},createEvent:function(G,D){this.__yui_events=this.__yui_events||{};var A=D||{};var I=this.__yui_events;if(I[G]){}else{var H=A.scope||this;var E=(A.silent);var B=new YAHOO.util.CustomEvent(G,H,E,YAHOO.util.CustomEvent.FLAT);I[G]=B;if(A.onSubscribeCallback){B.subscribeEvent.subscribe(A.onSubscribeCallback);}this.__yui_subscribers=this.__yui_subscribers||{};var F=this.__yui_subscribers[G];if(F){for(var C=0;C<F.length;++C){B.subscribe(F[C].fn,F[C].obj,F[C].overrideContext);}}}return I[G];},fireEvent:function(E,D,A,C){this.__yui_events=this.__yui_events||{};var G=this.__yui_events[E];if(!G){return null;}var B=[];for(var F=1;F<arguments.length;++F){B.push(arguments[F]);}return G.fire.apply(G,B);},hasEvent:function(A){if(this.__yui_events){if(this.__yui_events[A]){return true;}}return false;}};(function(){var A=YAHOO.util.Event,C=YAHOO.lang;YAHOO.util.KeyListener=function(D,I,E,F){if(!D){}else{if(!I){}else{if(!E){}}}if(!F){F=YAHOO.util.KeyListener.KEYDOWN;}var G=new YAHOO.util.CustomEvent("keyPressed");this.enabledEvent=new YAHOO.util.CustomEvent("enabled");this.disabledEvent=new YAHOO.util.CustomEvent("disabled");if(C.isString(D)){D=document.getElementById(D);}if(C.isFunction(E)){G.subscribe(E);}else{G.subscribe(E.fn,E.scope,E.correctScope);}function H(O,N){if(!I.shift){I.shift=false;}if(!I.alt){I.alt=false;}if(!I.ctrl){I.ctrl=false;}if(O.shiftKey==I.shift&&O.altKey==I.alt&&O.ctrlKey==I.ctrl){var J,M=I.keys,L;if(YAHOO.lang.isArray(M)){for(var K=0;K<M.length;K++){J=M[K];L=A.getCharCode(O);if(J==L){G.fire(L,O);break;}}}else{L=A.getCharCode(O);if(M==L){G.fire(L,O);}}}}this.enable=function(){if(!this.enabled){A.on(D,F,H);this.enabledEvent.fire(I);}this.enabled=true;};this.disable=function(){if(this.enabled){A.removeListener(D,F,H);this.disabledEvent.fire(I);}this.enabled=false;};this.toString=function(){return"KeyListener ["+I.keys+"] "+D.tagName+(D.id?"["+D.id+"]":"");};};var B=YAHOO.util.KeyListener;B.KEYDOWN="keydown";B.KEYUP="keyup";B.KEY={ALT:18,BACK_SPACE:8,CAPS_LOCK:20,CONTROL:17,DELETE:46,DOWN:40,END:35,ENTER:13,ESCAPE:27,HOME:36,LEFT:37,META:224,NUM_LOCK:144,PAGE_DOWN:34,PAGE_UP:33,PAUSE:19,PRINTSCREEN:44,RIGHT:39,SCROLL_LOCK:145,SHIFT:16,SPACE:32,TAB:9,UP:38};})();YAHOO.register("event",YAHOO.util.Event,{version:"2.7.0",build:"1799"});YAHOO.util.Connect={_msxml_progid:["Microsoft.XMLHTTP","MSXML2.XMLHTTP.3.0","MSXML2.XMLHTTP"],_http_headers:{},_has_http_headers:false,_use_default_post_header:true,_default_post_header:"application/x-www-form-urlencoded; charset=UTF-8",_default_form_header:"application/x-www-form-urlencoded",_use_default_xhr_header:true,_default_xhr_header:"XMLHttpRequest",_has_default_headers:true,_default_headers:{},_isFormSubmit:false,_isFileUpload:false,_formNode:null,_sFormData:null,_poll:{},_timeOut:{},_polling_interval:50,_transaction_id:0,_submitElementValue:null,_hasSubmitListener:(function(){if(YAHOO.util.Event){YAHOO.util.Event.addListener(document,"click",function(C){var B=YAHOO.util.Event.getTarget(C),A=B.nodeName.toLowerCase();if((A==="input"||A==="button")&&(B.type&&B.type.toLowerCase()=="submit")){YAHOO.util.Connect._submitElementValue=encodeURIComponent(B.name)+"="+encodeURIComponent(B.value);}});return true;}return false;})(),startEvent:new YAHOO.util.CustomEvent("start"),completeEvent:new YAHOO.util.CustomEvent("complete"),successEvent:new YAHOO.util.CustomEvent("success"),failureEvent:new YAHOO.util.CustomEvent("failure"),uploadEvent:new YAHOO.util.CustomEvent("upload"),abortEvent:new YAHOO.util.CustomEvent("abort"),_customEvents:{onStart:["startEvent","start"],onComplete:["completeEvent","complete"],onSuccess:["successEvent","success"],onFailure:["failureEvent","failure"],onUpload:["uploadEvent","upload"],onAbort:["abortEvent","abort"]},setProgId:function(A){this._msxml_progid.unshift(A);},setDefaultPostHeader:function(A){if(typeof A=="string"){this._default_post_header=A;}else{if(typeof A=="boolean"){this._use_default_post_header=A;}}},setDefaultXhrHeader:function(A){if(typeof A=="string"){this._default_xhr_header=A;}else{this._use_default_xhr_header=A;}},setPollingInterval:function(A){if(typeof A=="number"&&isFinite(A)){this._polling_interval=A;}},createXhrObject:function(F){var E,A;try{A=new XMLHttpRequest();E={conn:A,tId:F};}catch(D){for(var B=0;B<this._msxml_progid.length;++B){try{A=new ActiveXObject(this._msxml_progid[B]);E={conn:A,tId:F};break;}catch(C){}}}finally{return E;}},getConnectionObject:function(A){var C;var D=this._transaction_id;try{if(!A){C=this.createXhrObject(D);}else{C={};C.tId=D;C.isUpload=true;}if(C){this._transaction_id++;}}catch(B){}finally{return C;}},asyncRequest:function(F,C,E,A){var D=(this._isFileUpload)?this.getConnectionObject(true):this.getConnectionObject();var B=(E&&E.argument)?E.argument:null;if(!D){return null;}else{if(E&&E.customevents){this.initCustomEvents(D,E);}if(this._isFormSubmit){if(this._isFileUpload){this.uploadFile(D,E,C,A);return D;}if(F.toUpperCase()=="GET"){if(this._sFormData.length!==0){C+=((C.indexOf("?")==-1)?"?":"&")+this._sFormData;}}else{if(F.toUpperCase()=="POST"){A=A?this._sFormData+"&"+A:this._sFormData;}}}if(F.toUpperCase()=="GET"&&(E&&E.cache===false)){C+=((C.indexOf("?")==-1)?"?":"&")+"rnd="+new Date().valueOf().toString();}D.conn.open(F,C,true);if(this._use_default_xhr_header){if(!this._default_headers["X-Requested-With"]){this.initHeader("X-Requested-With",this._default_xhr_header,true);}}if((F.toUpperCase()==="POST"&&this._use_default_post_header)&&this._isFormSubmit===false){this.initHeader("Content-Type",this._default_post_header);}if(this._has_default_headers||this._has_http_headers){this.setHeader(D);}this.handleReadyState(D,E);D.conn.send(A||"");if(this._isFormSubmit===true){this.resetFormState();}this.startEvent.fire(D,B);if(D.startEvent){D.startEvent.fire(D,B);}return D;}},initCustomEvents:function(A,C){var B;for(B in C.customevents){if(this._customEvents[B][0]){A[this._customEvents[B][0]]=new YAHOO.util.CustomEvent(this._customEvents[B][1],(C.scope)?C.scope:null);A[this._customEvents[B][0]].subscribe(C.customevents[B]);}}},handleReadyState:function(C,D){var B=this;var A=(D&&D.argument)?D.argument:null;if(D&&D.timeout){this._timeOut[C.tId]=window.setTimeout(function(){B.abort(C,D,true);},D.timeout);}this._poll[C.tId]=window.setInterval(function(){if(C.conn&&C.conn.readyState===4){window.clearInterval(B._poll[C.tId]);delete B._poll[C.tId];if(D&&D.timeout){window.clearTimeout(B._timeOut[C.tId]);delete B._timeOut[C.tId];}B.completeEvent.fire(C,A);if(C.completeEvent){C.completeEvent.fire(C,A);}B.handleTransactionResponse(C,D);}},this._polling_interval);},handleTransactionResponse:function(F,G,A){var D,C;var B=(G&&G.argument)?G.argument:null;try{if(F.conn.status!==undefined&&F.conn.status!==0){D=F.conn.status;}else{D=13030;}}catch(E){D=13030;}if(D>=200&&D<300||D===1223){C=this.createResponseObject(F,B);if(G&&G.success){if(!G.scope){G.success(C);}else{G.success.apply(G.scope,[C]);}}this.successEvent.fire(C);if(F.successEvent){F.successEvent.fire(C);}}else{switch(D){case 12002:case 12029:case 12030:case 12031:case 12152:case 13030:C=this.createExceptionObject(F.tId,B,(A?A:false));if(G&&G.failure){if(!G.scope){G.failure(C);}else{G.failure.apply(G.scope,[C]);}}break;default:C=this.createResponseObject(F,B);if(G&&G.failure){if(!G.scope){G.failure(C);}else{G.failure.apply(G.scope,[C]);}}}this.failureEvent.fire(C);if(F.failureEvent){F.failureEvent.fire(C);}}this.releaseObject(F);C=null;},createResponseObject:function(A,G){var D={};var I={};try{var C=A.conn.getAllResponseHeaders();var F=C.split("\n");for(var E=0;E<F.length;E++){var B=F[E].indexOf(":");if(B!=-1){I[F[E].substring(0,B)]=F[E].substring(B+2);}}}catch(H){}D.tId=A.tId;D.status=(A.conn.status==1223)?204:A.conn.status;D.statusText=(A.conn.status==1223)?"No Content":A.conn.statusText;D.getResponseHeader=I;D.getAllResponseHeaders=C;D.responseText=A.conn.responseText;D.responseXML=A.conn.responseXML;if(G){D.argument=G;}return D;},createExceptionObject:function(H,D,A){var F=0;var G="communication failure";var C=-1;var B="transaction aborted";var E={};E.tId=H;if(A){E.status=C;E.statusText=B;}else{E.status=F;E.statusText=G;}if(D){E.argument=D;}return E;},initHeader:function(A,D,C){var B=(C)?this._default_headers:this._http_headers;B[A]=D;if(C){this._has_default_headers=true;
}else{this._has_http_headers=true;}},setHeader:function(A){var B;if(this._has_default_headers){for(B in this._default_headers){if(YAHOO.lang.hasOwnProperty(this._default_headers,B)){A.conn.setRequestHeader(B,this._default_headers[B]);}}}if(this._has_http_headers){for(B in this._http_headers){if(YAHOO.lang.hasOwnProperty(this._http_headers,B)){A.conn.setRequestHeader(B,this._http_headers[B]);}}delete this._http_headers;this._http_headers={};this._has_http_headers=false;}},resetDefaultHeaders:function(){delete this._default_headers;this._default_headers={};this._has_default_headers=false;},setForm:function(M,H,C){var L,B,K,I,P,J=false,F=[],O=0,E,G,D,N,A;this.resetFormState();if(typeof M=="string"){L=(document.getElementById(M)||document.forms[M]);}else{if(typeof M=="object"){L=M;}else{return;}}if(H){this.createFrame(C?C:null);this._isFormSubmit=true;this._isFileUpload=true;this._formNode=L;return;}for(E=0,G=L.elements.length;E<G;++E){B=L.elements[E];P=B.disabled;K=B.name;if(!P&&K){K=encodeURIComponent(K)+"=";I=encodeURIComponent(B.value);switch(B.type){case"select-one":if(B.selectedIndex>-1){A=B.options[B.selectedIndex];F[O++]=K+encodeURIComponent((A.attributes.value&&A.attributes.value.specified)?A.value:A.text);}break;case"select-multiple":if(B.selectedIndex>-1){for(D=B.selectedIndex,N=B.options.length;D<N;++D){A=B.options[D];if(A.selected){F[O++]=K+encodeURIComponent((A.attributes.value&&A.attributes.value.specified)?A.value:A.text);}}}break;case"radio":case"checkbox":if(B.checked){F[O++]=K+I;}break;case"file":case undefined:case"reset":case"button":break;case"submit":if(J===false){if(this._hasSubmitListener&&this._submitElementValue){F[O++]=this._submitElementValue;}J=true;}break;default:F[O++]=K+I;}}}this._isFormSubmit=true;this._sFormData=F.join("&");this.initHeader("Content-Type",this._default_form_header);return this._sFormData;},resetFormState:function(){this._isFormSubmit=false;this._isFileUpload=false;this._formNode=null;this._sFormData="";},createFrame:function(A){var B="yuiIO"+this._transaction_id;var C;if(YAHOO.env.ua.ie){C=document.createElement('<iframe id="'+B+'" name="'+B+'" />');if(typeof A=="boolean"){C.src="javascript:false";}}else{C=document.createElement("iframe");C.id=B;C.name=B;}C.style.position="absolute";C.style.top="-1000px";C.style.left="-1000px";document.body.appendChild(C);},appendPostData:function(A){var D=[],B=A.split("&"),C,E;for(C=0;C<B.length;C++){E=B[C].indexOf("=");if(E!=-1){D[C]=document.createElement("input");D[C].type="hidden";D[C].name=decodeURIComponent(B[C].substring(0,E));D[C].value=decodeURIComponent(B[C].substring(E+1));this._formNode.appendChild(D[C]);}}return D;},uploadFile:function(D,N,E,C){var I="yuiIO"+D.tId,J="multipart/form-data",L=document.getElementById(I),O=this,K=(N&&N.argument)?N.argument:null,M,H,B,G;var A={action:this._formNode.getAttribute("action"),method:this._formNode.getAttribute("method"),target:this._formNode.getAttribute("target")};this._formNode.setAttribute("action",E);this._formNode.setAttribute("method","POST");this._formNode.setAttribute("target",I);if(YAHOO.env.ua.ie){this._formNode.setAttribute("encoding",J);}else{this._formNode.setAttribute("enctype",J);}if(C){M=this.appendPostData(C);}this._formNode.submit();this.startEvent.fire(D,K);if(D.startEvent){D.startEvent.fire(D,K);}if(N&&N.timeout){this._timeOut[D.tId]=window.setTimeout(function(){O.abort(D,N,true);},N.timeout);}if(M&&M.length>0){for(H=0;H<M.length;H++){this._formNode.removeChild(M[H]);}}for(B in A){if(YAHOO.lang.hasOwnProperty(A,B)){if(A[B]){this._formNode.setAttribute(B,A[B]);}else{this._formNode.removeAttribute(B);}}}this.resetFormState();var F=function(){if(N&&N.timeout){window.clearTimeout(O._timeOut[D.tId]);delete O._timeOut[D.tId];}O.completeEvent.fire(D,K);if(D.completeEvent){D.completeEvent.fire(D,K);}G={tId:D.tId,argument:N.argument};try{G.responseText=L.contentWindow.document.body?L.contentWindow.document.body.innerHTML:L.contentWindow.document.documentElement.textContent;G.responseXML=L.contentWindow.document.XMLDocument?L.contentWindow.document.XMLDocument:L.contentWindow.document;}catch(P){}if(N&&N.upload){if(!N.scope){N.upload(G);}else{N.upload.apply(N.scope,[G]);}}O.uploadEvent.fire(G);if(D.uploadEvent){D.uploadEvent.fire(G);}YAHOO.util.Event.removeListener(L,"load",F);setTimeout(function(){document.body.removeChild(L);O.releaseObject(D);},100);};YAHOO.util.Event.addListener(L,"load",F);},abort:function(E,G,A){var D;var B=(G&&G.argument)?G.argument:null;if(E&&E.conn){if(this.isCallInProgress(E)){E.conn.abort();window.clearInterval(this._poll[E.tId]);delete this._poll[E.tId];if(A){window.clearTimeout(this._timeOut[E.tId]);delete this._timeOut[E.tId];}D=true;}}else{if(E&&E.isUpload===true){var C="yuiIO"+E.tId;var F=document.getElementById(C);if(F){YAHOO.util.Event.removeListener(F,"load");document.body.removeChild(F);if(A){window.clearTimeout(this._timeOut[E.tId]);delete this._timeOut[E.tId];}D=true;}}else{D=false;}}if(D===true){this.abortEvent.fire(E,B);if(E.abortEvent){E.abortEvent.fire(E,B);}this.handleTransactionResponse(E,G,true);}return D;},isCallInProgress:function(B){if(B&&B.conn){return B.conn.readyState!==4&&B.conn.readyState!==0;}else{if(B&&B.isUpload===true){var A="yuiIO"+B.tId;return document.getElementById(A)?true:false;}else{return false;}}},releaseObject:function(A){if(A&&A.conn){A.conn=null;A=null;}}};YAHOO.register("connection",YAHOO.util.Connect,{version:"2.7.0",build:"1799"});(function(){var B=YAHOO.util;var A=function(D,C,E,F){if(!D){}this.init(D,C,E,F);};A.NAME="Anim";A.prototype={toString:function(){var C=this.getEl()||{};var D=C.id||C.tagName;return(this.constructor.NAME+": "+D);},patterns:{noNegatives:/width|height|opacity|padding/i,offsetAttribute:/^((width|height)|(top|left))$/,defaultUnit:/width|height|top$|bottom$|left$|right$/i,offsetUnit:/\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i},doMethod:function(C,E,D){return this.method(this.currentFrame,E,D-E,this.totalFrames);},setAttribute:function(C,F,E){var D=this.getEl();if(this.patterns.noNegatives.test(C)){F=(F>0)?F:0;}if("style" in D){B.Dom.setStyle(D,C,F+E);}else{if(C in D){D[C]=F;}}},getAttribute:function(C){var E=this.getEl();var G=B.Dom.getStyle(E,C);if(G!=="auto"&&!this.patterns.offsetUnit.test(G)){return parseFloat(G);}var D=this.patterns.offsetAttribute.exec(C)||[];var H=!!(D[3]);var F=!!(D[2]);if("style" in E){if(F||(B.Dom.getStyle(E,"position")=="absolute"&&H)){G=E["offset"+D[0].charAt(0).toUpperCase()+D[0].substr(1)];}else{G=0;}}else{if(C in E){G=E[C];}}return G;},getDefaultUnit:function(C){if(this.patterns.defaultUnit.test(C)){return"px";}return"";},setRuntimeAttribute:function(D){var I;var E;var F=this.attributes;this.runtimeAttributes[D]={};var H=function(J){return(typeof J!=="undefined");};if(!H(F[D]["to"])&&!H(F[D]["by"])){return false;}I=(H(F[D]["from"]))?F[D]["from"]:this.getAttribute(D);if(H(F[D]["to"])){E=F[D]["to"];}else{if(H(F[D]["by"])){if(I.constructor==Array){E=[];for(var G=0,C=I.length;G<C;++G){E[G]=I[G]+F[D]["by"][G]*1;}}else{E=I+F[D]["by"]*1;}}}this.runtimeAttributes[D].start=I;this.runtimeAttributes[D].end=E;this.runtimeAttributes[D].unit=(H(F[D].unit))?F[D]["unit"]:this.getDefaultUnit(D);return true;},init:function(E,J,I,C){var D=false;var F=null;var H=0;E=B.Dom.get(E);this.attributes=J||{};this.duration=!YAHOO.lang.isUndefined(I)?I:1;this.method=C||B.Easing.easeNone;this.useSeconds=true;this.currentFrame=0;this.totalFrames=B.AnimMgr.fps;this.setEl=function(M){E=B.Dom.get(M);};this.getEl=function(){return E;};this.isAnimated=function(){return D;};this.getStartTime=function(){return F;};this.runtimeAttributes={};this.animate=function(){if(this.isAnimated()){return false;}this.currentFrame=0;this.totalFrames=(this.useSeconds)?Math.ceil(B.AnimMgr.fps*this.duration):this.duration;if(this.duration===0&&this.useSeconds){this.totalFrames=1;}B.AnimMgr.registerElement(this);return true;};this.stop=function(M){if(!this.isAnimated()){return false;}if(M){this.currentFrame=this.totalFrames;this._onTween.fire();}B.AnimMgr.stop(this);};var L=function(){this.onStart.fire();this.runtimeAttributes={};for(var M in this.attributes){this.setRuntimeAttribute(M);}D=true;H=0;F=new Date();};var K=function(){var O={duration:new Date()-this.getStartTime(),currentFrame:this.currentFrame};O.toString=function(){return("duration: "+O.duration+", currentFrame: "+O.currentFrame);};this.onTween.fire(O);var N=this.runtimeAttributes;for(var M in N){this.setAttribute(M,this.doMethod(M,N[M].start,N[M].end),N[M].unit);}H+=1;};var G=function(){var M=(new Date()-F)/1000;var N={duration:M,frames:H,fps:H/M};N.toString=function(){return("duration: "+N.duration+", frames: "+N.frames+", fps: "+N.fps);};D=false;H=0;this.onComplete.fire(N);};this._onStart=new B.CustomEvent("_start",this,true);this.onStart=new B.CustomEvent("start",this);this.onTween=new B.CustomEvent("tween",this);this._onTween=new B.CustomEvent("_tween",this,true);this.onComplete=new B.CustomEvent("complete",this);this._onComplete=new B.CustomEvent("_complete",this,true);this._onStart.subscribe(L);this._onTween.subscribe(K);this._onComplete.subscribe(G);}};B.Anim=A;})();YAHOO.util.AnimMgr=new function(){var C=null;var B=[];var A=0;this.fps=1000;this.delay=1;this.registerElement=function(F){B[B.length]=F;A+=1;F._onStart.fire();this.start();};this.unRegister=function(G,F){F=F||E(G);if(!G.isAnimated()||F==-1){return false;}G._onComplete.fire();B.splice(F,1);A-=1;if(A<=0){this.stop();}return true;};this.start=function(){if(C===null){C=setInterval(this.run,this.delay);}};this.stop=function(H){if(!H){clearInterval(C);for(var G=0,F=B.length;G<F;++G){this.unRegister(B[0],0);}B=[];C=null;A=0;}else{this.unRegister(H);}};this.run=function(){for(var H=0,F=B.length;H<F;++H){var G=B[H];if(!G||!G.isAnimated()){continue;}if(G.currentFrame<G.totalFrames||G.totalFrames===null){G.currentFrame+=1;if(G.useSeconds){D(G);}G._onTween.fire();}else{YAHOO.util.AnimMgr.stop(G,H);}}};var E=function(H){for(var G=0,F=B.length;G<F;++G){if(B[G]==H){return G;}}return -1;};var D=function(G){var J=G.totalFrames;var I=G.currentFrame;var H=(G.currentFrame*G.duration*1000/G.totalFrames);var F=(new Date()-G.getStartTime());var K=0;if(F<G.duration*1000){K=Math.round((F/H-1)*G.currentFrame);}else{K=J-(I+1);}if(K>0&&isFinite(K)){if(G.currentFrame+K>=J){K=J-(I+1);}G.currentFrame+=K;}};};YAHOO.util.Bezier=new function(){this.getPosition=function(E,D){var F=E.length;var C=[];for(var B=0;B<F;++B){C[B]=[E[B][0],E[B][1]];}for(var A=1;A<F;++A){for(B=0;B<F-A;++B){C[B][0]=(1-D)*C[B][0]+D*C[parseInt(B+1,10)][0];C[B][1]=(1-D)*C[B][1]+D*C[parseInt(B+1,10)][1];}}return[C[0][0],C[0][1]];};};(function(){var A=function(F,E,G,H){A.superclass.constructor.call(this,F,E,G,H);};A.NAME="ColorAnim";A.DEFAULT_BGCOLOR="#fff";var C=YAHOO.util;YAHOO.extend(A,C.Anim);var D=A.superclass;var B=A.prototype;B.patterns.color=/color$/i;B.patterns.rgb=/^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;B.patterns.hex=/^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;B.patterns.hex3=/^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;B.patterns.transparent=/^transparent|rgba\(0, 0, 0, 0\)$/;B.parseColor=function(E){if(E.length==3){return E;}var F=this.patterns.hex.exec(E);if(F&&F.length==4){return[parseInt(F[1],16),parseInt(F[2],16),parseInt(F[3],16)];}F=this.patterns.rgb.exec(E);if(F&&F.length==4){return[parseInt(F[1],10),parseInt(F[2],10),parseInt(F[3],10)];}F=this.patterns.hex3.exec(E);if(F&&F.length==4){return[parseInt(F[1]+F[1],16),parseInt(F[2]+F[2],16),parseInt(F[3]+F[3],16)];
}return null;};B.getAttribute=function(E){var G=this.getEl();if(this.patterns.color.test(E)){var I=YAHOO.util.Dom.getStyle(G,E);var H=this;if(this.patterns.transparent.test(I)){var F=YAHOO.util.Dom.getAncestorBy(G,function(J){return !H.patterns.transparent.test(I);});if(F){I=C.Dom.getStyle(F,E);}else{I=A.DEFAULT_BGCOLOR;}}}else{I=D.getAttribute.call(this,E);}return I;};B.doMethod=function(F,J,G){var I;if(this.patterns.color.test(F)){I=[];for(var H=0,E=J.length;H<E;++H){I[H]=D.doMethod.call(this,F,J[H],G[H]);}I="rgb("+Math.floor(I[0])+","+Math.floor(I[1])+","+Math.floor(I[2])+")";}else{I=D.doMethod.call(this,F,J,G);}return I;};B.setRuntimeAttribute=function(F){D.setRuntimeAttribute.call(this,F);if(this.patterns.color.test(F)){var H=this.attributes;var J=this.parseColor(this.runtimeAttributes[F].start);var G=this.parseColor(this.runtimeAttributes[F].end);if(typeof H[F]["to"]==="undefined"&&typeof H[F]["by"]!=="undefined"){G=this.parseColor(H[F].by);for(var I=0,E=J.length;I<E;++I){G[I]=J[I]+G[I];}}this.runtimeAttributes[F].start=J;this.runtimeAttributes[F].end=G;}};C.ColorAnim=A;})();
/*
TERMS OF USE - EASING EQUATIONS
Open source under the BSD License.
Copyright 2001 Robert Penner All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

 * Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
 * Neither the name of the author nor the names of contributors may be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/
YAHOO.util.Easing={easeNone:function(B,A,D,C){return D*B/C+A;},easeIn:function(B,A,D,C){return D*(B/=C)*B+A;},easeOut:function(B,A,D,C){return -D*(B/=C)*(B-2)+A;},easeBoth:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B+A;}return -D/2*((--B)*(B-2)-1)+A;},easeInStrong:function(B,A,D,C){return D*(B/=C)*B*B*B+A;},easeOutStrong:function(B,A,D,C){return -D*((B=B/C-1)*B*B*B-1)+A;},easeBothStrong:function(B,A,D,C){if((B/=C/2)<1){return D/2*B*B*B*B+A;}return -D/2*((B-=2)*B*B*B-2)+A;},elasticIn:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return -(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;},elasticOut:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F)==1){return A+G;}if(!E){E=F*0.3;}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}return B*Math.pow(2,-10*C)*Math.sin((C*F-D)*(2*Math.PI)/E)+G+A;},elasticBoth:function(C,A,G,F,B,E){if(C==0){return A;}if((C/=F/2)==2){return A+G;}if(!E){E=F*(0.3*1.5);}if(!B||B<Math.abs(G)){B=G;var D=E/4;}else{var D=E/(2*Math.PI)*Math.asin(G/B);}if(C<1){return -0.5*(B*Math.pow(2,10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E))+A;}return B*Math.pow(2,-10*(C-=1))*Math.sin((C*F-D)*(2*Math.PI)/E)*0.5+G+A;},backIn:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*(B/=D)*B*((C+1)*B-C)+A;},backOut:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}return E*((B=B/D-1)*B*((C+1)*B+C)+1)+A;},backBoth:function(B,A,E,D,C){if(typeof C=="undefined"){C=1.70158;}if((B/=D/2)<1){return E/2*(B*B*(((C*=(1.525))+1)*B-C))+A;}return E/2*((B-=2)*B*(((C*=(1.525))+1)*B+C)+2)+A;},bounceIn:function(B,A,D,C){return D-YAHOO.util.Easing.bounceOut(C-B,0,D,C)+A;},bounceOut:function(B,A,D,C){if((B/=C)<(1/2.75)){return D*(7.5625*B*B)+A;}else{if(B<(2/2.75)){return D*(7.5625*(B-=(1.5/2.75))*B+0.75)+A;}else{if(B<(2.5/2.75)){return D*(7.5625*(B-=(2.25/2.75))*B+0.9375)+A;}}}return D*(7.5625*(B-=(2.625/2.75))*B+0.984375)+A;},bounceBoth:function(B,A,D,C){if(B<C/2){return YAHOO.util.Easing.bounceIn(B*2,0,D,C)*0.5+A;}return YAHOO.util.Easing.bounceOut(B*2-C,0,D,C)*0.5+D*0.5+A;}};(function(){var A=function(H,G,I,J){if(H){A.superclass.constructor.call(this,H,G,I,J);}};A.NAME="Motion";var E=YAHOO.util;YAHOO.extend(A,E.ColorAnim);var F=A.superclass;var C=A.prototype;C.patterns.points=/^points$/i;C.setAttribute=function(G,I,H){if(this.patterns.points.test(G)){H=H||"px";F.setAttribute.call(this,"left",I[0],H);F.setAttribute.call(this,"top",I[1],H);}else{F.setAttribute.call(this,G,I,H);}};C.getAttribute=function(G){if(this.patterns.points.test(G)){var H=[F.getAttribute.call(this,"left"),F.getAttribute.call(this,"top")];}else{H=F.getAttribute.call(this,G);}return H;};C.doMethod=function(G,K,H){var J=null;if(this.patterns.points.test(G)){var I=this.method(this.currentFrame,0,100,this.totalFrames)/100;J=E.Bezier.getPosition(this.runtimeAttributes[G],I);}else{J=F.doMethod.call(this,G,K,H);}return J;};C.setRuntimeAttribute=function(P){if(this.patterns.points.test(P)){var H=this.getEl();var J=this.attributes;var G;var L=J["points"]["control"]||[];var I;var M,O;if(L.length>0&&!(L[0] instanceof Array)){L=[L];}else{var K=[];for(M=0,O=L.length;M<O;++M){K[M]=L[M];}L=K;}if(E.Dom.getStyle(H,"position")=="static"){E.Dom.setStyle(H,"position","relative");}if(D(J["points"]["from"])){E.Dom.setXY(H,J["points"]["from"]);
}else{E.Dom.setXY(H,E.Dom.getXY(H));}G=this.getAttribute("points");if(D(J["points"]["to"])){I=B.call(this,J["points"]["to"],G);var N=E.Dom.getXY(this.getEl());for(M=0,O=L.length;M<O;++M){L[M]=B.call(this,L[M],G);}}else{if(D(J["points"]["by"])){I=[G[0]+J["points"]["by"][0],G[1]+J["points"]["by"][1]];for(M=0,O=L.length;M<O;++M){L[M]=[G[0]+L[M][0],G[1]+L[M][1]];}}}this.runtimeAttributes[P]=[G];if(L.length>0){this.runtimeAttributes[P]=this.runtimeAttributes[P].concat(L);}this.runtimeAttributes[P][this.runtimeAttributes[P].length]=I;}else{F.setRuntimeAttribute.call(this,P);}};var B=function(G,I){var H=E.Dom.getXY(this.getEl());G=[G[0]-H[0]+I[0],G[1]-H[1]+I[1]];return G;};var D=function(G){return(typeof G!=="undefined");};E.Motion=A;})();(function(){var D=function(F,E,G,H){if(F){D.superclass.constructor.call(this,F,E,G,H);}};D.NAME="Scroll";var B=YAHOO.util;YAHOO.extend(D,B.ColorAnim);var C=D.superclass;var A=D.prototype;A.doMethod=function(E,H,F){var G=null;if(E=="scroll"){G=[this.method(this.currentFrame,H[0],F[0]-H[0],this.totalFrames),this.method(this.currentFrame,H[1],F[1]-H[1],this.totalFrames)];}else{G=C.doMethod.call(this,E,H,F);}return G;};A.getAttribute=function(E){var G=null;var F=this.getEl();if(E=="scroll"){G=[F.scrollLeft,F.scrollTop];}else{G=C.getAttribute.call(this,E);}return G;};A.setAttribute=function(E,H,G){var F=this.getEl();if(E=="scroll"){F.scrollLeft=H[0];F.scrollTop=H[1];}else{C.setAttribute.call(this,E,H,G);}};B.Scroll=D;})();YAHOO.register("animation",YAHOO.util.Anim,{version:"2.7.0",build:"1799"});if(!YAHOO.util.DragDropMgr){YAHOO.util.DragDropMgr=function(){var A=YAHOO.util.Event,B=YAHOO.util.Dom;return{useShim:false,_shimActive:false,_shimState:false,_debugShim:false,_createShim:function(){var C=document.createElement("div");C.id="yui-ddm-shim";if(document.body.firstChild){document.body.insertBefore(C,document.body.firstChild);}else{document.body.appendChild(C);}C.style.display="none";C.style.backgroundColor="red";C.style.position="absolute";C.style.zIndex="99999";B.setStyle(C,"opacity","0");this._shim=C;A.on(C,"mouseup",this.handleMouseUp,this,true);A.on(C,"mousemove",this.handleMouseMove,this,true);A.on(window,"scroll",this._sizeShim,this,true);},_sizeShim:function(){if(this._shimActive){var C=this._shim;C.style.height=B.getDocumentHeight()+"px";C.style.width=B.getDocumentWidth()+"px";C.style.top="0";C.style.left="0";}},_activateShim:function(){if(this.useShim){if(!this._shim){this._createShim();}this._shimActive=true;var C=this._shim,D="0";if(this._debugShim){D=".5";}B.setStyle(C,"opacity",D);this._sizeShim();C.style.display="block";}},_deactivateShim:function(){this._shim.style.display="none";this._shimActive=false;},_shim:null,ids:{},handleIds:{},dragCurrent:null,dragOvers:{},deltaX:0,deltaY:0,preventDefault:true,stopPropagation:true,initialized:false,locked:false,interactionInfo:null,init:function(){this.initialized=true;},POINT:0,INTERSECT:1,STRICT_INTERSECT:2,mode:0,_execOnAll:function(E,D){for(var F in this.ids){for(var C in this.ids[F]){var G=this.ids[F][C];if(!this.isTypeOfDD(G)){continue;}G[E].apply(G,D);}}},_onLoad:function(){this.init();A.on(document,"mouseup",this.handleMouseUp,this,true);A.on(document,"mousemove",this.handleMouseMove,this,true);A.on(window,"unload",this._onUnload,this,true);A.on(window,"resize",this._onResize,this,true);},_onResize:function(C){this._execOnAll("resetConstraints",[]);},lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isLocked:function(){return this.locked;},locationCache:{},useCache:true,clickPixelThresh:3,clickTimeThresh:1000,dragThreshMet:false,clickTimeout:null,startX:0,startY:0,fromTimeout:false,regDragDrop:function(D,C){if(!this.initialized){this.init();}if(!this.ids[C]){this.ids[C]={};}this.ids[C][D.id]=D;},removeDDFromGroup:function(E,C){if(!this.ids[C]){this.ids[C]={};}var D=this.ids[C];if(D&&D[E.id]){delete D[E.id];}},_remove:function(E){for(var D in E.groups){if(D){var C=this.ids[D];if(C&&C[E.id]){delete C[E.id];}}}delete this.handleIds[E.id];},regHandle:function(D,C){if(!this.handleIds[D]){this.handleIds[D]={};}this.handleIds[D][C]=C;},isDragDrop:function(C){return(this.getDDById(C))?true:false;},getRelated:function(H,D){var G=[];for(var F in H.groups){for(var E in this.ids[F]){var C=this.ids[F][E];if(!this.isTypeOfDD(C)){continue;}if(!D||C.isTarget){G[G.length]=C;}}}return G;},isLegalTarget:function(G,F){var D=this.getRelated(G,true);for(var E=0,C=D.length;E<C;++E){if(D[E].id==F.id){return true;}}return false;},isTypeOfDD:function(C){return(C&&C.__ygDragDrop);},isHandle:function(D,C){return(this.handleIds[D]&&this.handleIds[D][C]);},getDDById:function(D){for(var C in this.ids){if(this.ids[C][D]){return this.ids[C][D];}}return null;},handleMouseDown:function(E,D){this.currentTarget=YAHOO.util.Event.getTarget(E);this.dragCurrent=D;var C=D.getEl();this.startX=YAHOO.util.Event.getPageX(E);this.startY=YAHOO.util.Event.getPageY(E);this.deltaX=this.startX-C.offsetLeft;this.deltaY=this.startY-C.offsetTop;this.dragThreshMet=false;this.clickTimeout=setTimeout(function(){var F=YAHOO.util.DDM;F.startDrag(F.startX,F.startY);F.fromTimeout=true;},this.clickTimeThresh);},startDrag:function(C,E){if(this.dragCurrent&&this.dragCurrent.useShim){this._shimState=this.useShim;this.useShim=true;}this._activateShim();clearTimeout(this.clickTimeout);var D=this.dragCurrent;if(D&&D.events.b4StartDrag){D.b4StartDrag(C,E);D.fireEvent("b4StartDragEvent",{x:C,y:E});}if(D&&D.events.startDrag){D.startDrag(C,E);D.fireEvent("startDragEvent",{x:C,y:E});}this.dragThreshMet=true;},handleMouseUp:function(C){if(this.dragCurrent){clearTimeout(this.clickTimeout);if(this.dragThreshMet){if(this.fromTimeout){this.fromTimeout=false;this.handleMouseMove(C);}this.fromTimeout=false;this.fireEvents(C,true);}else{}this.stopDrag(C);this.stopEvent(C);}},stopEvent:function(C){if(this.stopPropagation){YAHOO.util.Event.stopPropagation(C);}if(this.preventDefault){YAHOO.util.Event.preventDefault(C);}},stopDrag:function(E,D){var C=this.dragCurrent;if(C&&!D){if(this.dragThreshMet){if(C.events.b4EndDrag){C.b4EndDrag(E);C.fireEvent("b4EndDragEvent",{e:E});}if(C.events.endDrag){C.endDrag(E);C.fireEvent("endDragEvent",{e:E});}}if(C.events.mouseUp){C.onMouseUp(E);C.fireEvent("mouseUpEvent",{e:E});}}if(this._shimActive){this._deactivateShim();if(this.dragCurrent&&this.dragCurrent.useShim){this.useShim=this._shimState;this._shimState=false;}}this.dragCurrent=null;this.dragOvers={};},handleMouseMove:function(F){var C=this.dragCurrent;if(C){if(YAHOO.util.Event.isIE&&!F.button){this.stopEvent(F);return this.handleMouseUp(F);}else{if(F.clientX<0||F.clientY<0){}}if(!this.dragThreshMet){var E=Math.abs(this.startX-YAHOO.util.Event.getPageX(F));var D=Math.abs(this.startY-YAHOO.util.Event.getPageY(F));if(E>this.clickPixelThresh||D>this.clickPixelThresh){this.startDrag(this.startX,this.startY);}}if(this.dragThreshMet){if(C&&C.events.b4Drag){C.b4Drag(F);C.fireEvent("b4DragEvent",{e:F});}if(C&&C.events.drag){C.onDrag(F);C.fireEvent("dragEvent",{e:F});}if(C){this.fireEvents(F,false);}}this.stopEvent(F);}},fireEvents:function(V,L){var a=this.dragCurrent;if(!a||a.isLocked()||a.dragOnly){return;}var N=YAHOO.util.Event.getPageX(V),M=YAHOO.util.Event.getPageY(V),P=new YAHOO.util.Point(N,M),K=a.getTargetCoord(P.x,P.y),F=a.getDragEl(),E=["out","over","drop","enter"],U=new YAHOO.util.Region(K.y,K.x+F.offsetWidth,K.y+F.offsetHeight,K.x),I=[],D={},Q=[],c={outEvts:[],overEvts:[],dropEvts:[],enterEvts:[]};for(var S in this.dragOvers){var d=this.dragOvers[S];if(!this.isTypeOfDD(d)){continue;
}if(!this.isOverTarget(P,d,this.mode,U)){c.outEvts.push(d);}I[S]=true;delete this.dragOvers[S];}for(var R in a.groups){if("string"!=typeof R){continue;}for(S in this.ids[R]){var G=this.ids[R][S];if(!this.isTypeOfDD(G)){continue;}if(G.isTarget&&!G.isLocked()&&G!=a){if(this.isOverTarget(P,G,this.mode,U)){D[R]=true;if(L){c.dropEvts.push(G);}else{if(!I[G.id]){c.enterEvts.push(G);}else{c.overEvts.push(G);}this.dragOvers[G.id]=G;}}}}}this.interactionInfo={out:c.outEvts,enter:c.enterEvts,over:c.overEvts,drop:c.dropEvts,point:P,draggedRegion:U,sourceRegion:this.locationCache[a.id],validDrop:L};for(var C in D){Q.push(C);}if(L&&!c.dropEvts.length){this.interactionInfo.validDrop=false;if(a.events.invalidDrop){a.onInvalidDrop(V);a.fireEvent("invalidDropEvent",{e:V});}}for(S=0;S<E.length;S++){var Y=null;if(c[E[S]+"Evts"]){Y=c[E[S]+"Evts"];}if(Y&&Y.length){var H=E[S].charAt(0).toUpperCase()+E[S].substr(1),X="onDrag"+H,J="b4Drag"+H,O="drag"+H+"Event",W="drag"+H;if(this.mode){if(a.events[J]){a[J](V,Y,Q);a.fireEvent(J+"Event",{event:V,info:Y,group:Q});}if(a.events[W]){a[X](V,Y,Q);a.fireEvent(O,{event:V,info:Y,group:Q});}}else{for(var Z=0,T=Y.length;Z<T;++Z){if(a.events[J]){a[J](V,Y[Z].id,Q[0]);a.fireEvent(J+"Event",{event:V,info:Y[Z].id,group:Q[0]});}if(a.events[W]){a[X](V,Y[Z].id,Q[0]);a.fireEvent(O,{event:V,info:Y[Z].id,group:Q[0]});}}}}}},getBestMatch:function(E){var G=null;var D=E.length;if(D==1){G=E[0];}else{for(var F=0;F<D;++F){var C=E[F];if(this.mode==this.INTERSECT&&C.cursorIsOver){G=C;break;}else{if(!G||!G.overlap||(C.overlap&&G.overlap.getArea()<C.overlap.getArea())){G=C;}}}}return G;},refreshCache:function(D){var F=D||this.ids;for(var C in F){if("string"!=typeof C){continue;}for(var E in this.ids[C]){var G=this.ids[C][E];if(this.isTypeOfDD(G)){var H=this.getLocation(G);if(H){this.locationCache[G.id]=H;}else{delete this.locationCache[G.id];}}}}},verifyEl:function(D){try{if(D){var C=D.offsetParent;if(C){return true;}}}catch(E){}return false;},getLocation:function(H){if(!this.isTypeOfDD(H)){return null;}var F=H.getEl(),K,E,D,M,L,N,C,J,G;try{K=YAHOO.util.Dom.getXY(F);}catch(I){}if(!K){return null;}E=K[0];D=E+F.offsetWidth;M=K[1];L=M+F.offsetHeight;N=M-H.padding[0];C=D+H.padding[1];J=L+H.padding[2];G=E-H.padding[3];return new YAHOO.util.Region(N,C,J,G);},isOverTarget:function(K,C,E,F){var G=this.locationCache[C.id];if(!G||!this.useCache){G=this.getLocation(C);this.locationCache[C.id]=G;}if(!G){return false;}C.cursorIsOver=G.contains(K);var J=this.dragCurrent;if(!J||(!E&&!J.constrainX&&!J.constrainY)){return C.cursorIsOver;}C.overlap=null;if(!F){var H=J.getTargetCoord(K.x,K.y);var D=J.getDragEl();F=new YAHOO.util.Region(H.y,H.x+D.offsetWidth,H.y+D.offsetHeight,H.x);}var I=F.intersect(G);if(I){C.overlap=I;return(E)?true:C.cursorIsOver;}else{return false;}},_onUnload:function(D,C){this.unregAll();},unregAll:function(){if(this.dragCurrent){this.stopDrag();this.dragCurrent=null;}this._execOnAll("unreg",[]);this.ids={};},elementCache:{},getElWrapper:function(D){var C=this.elementCache[D];if(!C||!C.el){C=this.elementCache[D]=new this.ElementWrapper(YAHOO.util.Dom.get(D));}return C;},getElement:function(C){return YAHOO.util.Dom.get(C);},getCss:function(D){var C=YAHOO.util.Dom.get(D);return(C)?C.style:null;},ElementWrapper:function(C){this.el=C||null;this.id=this.el&&C.id;this.css=this.el&&C.style;},getPosX:function(C){return YAHOO.util.Dom.getX(C);},getPosY:function(C){return YAHOO.util.Dom.getY(C);},swapNode:function(E,C){if(E.swapNode){E.swapNode(C);}else{var F=C.parentNode;var D=C.nextSibling;if(D==E){F.insertBefore(E,C);}else{if(C==E.nextSibling){F.insertBefore(C,E);}else{E.parentNode.replaceChild(C,E);F.insertBefore(E,D);}}}},getScroll:function(){var E,C,F=document.documentElement,D=document.body;if(F&&(F.scrollTop||F.scrollLeft)){E=F.scrollTop;C=F.scrollLeft;}else{if(D){E=D.scrollTop;C=D.scrollLeft;}else{}}return{top:E,left:C};},getStyle:function(D,C){return YAHOO.util.Dom.getStyle(D,C);},getScrollTop:function(){return this.getScroll().top;},getScrollLeft:function(){return this.getScroll().left;},moveToEl:function(C,E){var D=YAHOO.util.Dom.getXY(E);YAHOO.util.Dom.setXY(C,D);},getClientHeight:function(){return YAHOO.util.Dom.getViewportHeight();},getClientWidth:function(){return YAHOO.util.Dom.getViewportWidth();},numericSort:function(D,C){return(D-C);},_timeoutCount:0,_addListeners:function(){var C=YAHOO.util.DDM;if(YAHOO.util.Event&&document){C._onLoad();}else{if(C._timeoutCount>2000){}else{setTimeout(C._addListeners,10);if(document&&document.body){C._timeoutCount+=1;}}}},handleWasClicked:function(C,E){if(this.isHandle(E,C.id)){return true;}else{var D=C.parentNode;while(D){if(this.isHandle(E,D.id)){return true;}else{D=D.parentNode;}}}return false;}};}();YAHOO.util.DDM=YAHOO.util.DragDropMgr;YAHOO.util.DDM._addListeners();}(function(){var A=YAHOO.util.Event;var B=YAHOO.util.Dom;YAHOO.util.DragDrop=function(E,C,D){if(E){this.init(E,C,D);}};YAHOO.util.DragDrop.prototype={events:null,on:function(){this.subscribe.apply(this,arguments);},id:null,config:null,dragElId:null,handleElId:null,invalidHandleTypes:null,invalidHandleIds:null,invalidHandleClasses:null,startPageX:0,startPageY:0,groups:null,locked:false,lock:function(){this.locked=true;},unlock:function(){this.locked=false;},isTarget:true,padding:null,dragOnly:false,useShim:false,_domRef:null,__ygDragDrop:true,constrainX:false,constrainY:false,minX:0,maxX:0,minY:0,maxY:0,deltaX:0,deltaY:0,maintainOffset:false,xTicks:null,yTicks:null,primaryButtonOnly:true,available:false,hasOuterHandles:false,cursorIsOver:false,overlap:null,b4StartDrag:function(C,D){},startDrag:function(C,D){},b4Drag:function(C){},onDrag:function(C){},onDragEnter:function(C,D){},b4DragOver:function(C){},onDragOver:function(C,D){},b4DragOut:function(C){},onDragOut:function(C,D){},b4DragDrop:function(C){},onDragDrop:function(C,D){},onInvalidDrop:function(C){},b4EndDrag:function(C){},endDrag:function(C){},b4MouseDown:function(C){},onMouseDown:function(C){},onMouseUp:function(C){},onAvailable:function(){},getEl:function(){if(!this._domRef){this._domRef=B.get(this.id);
}return this._domRef;},getDragEl:function(){return B.get(this.dragElId);},init:function(F,C,D){this.initTarget(F,C,D);A.on(this._domRef||this.id,"mousedown",this.handleMouseDown,this,true);for(var E in this.events){this.createEvent(E+"Event");}},initTarget:function(E,C,D){this.config=D||{};this.events={};this.DDM=YAHOO.util.DDM;this.groups={};if(typeof E!=="string"){this._domRef=E;E=B.generateId(E);}this.id=E;this.addToGroup((C)?C:"default");this.handleElId=E;A.onAvailable(E,this.handleOnAvailable,this,true);this.setDragElId(E);this.invalidHandleTypes={A:"A"};this.invalidHandleIds={};this.invalidHandleClasses=[];this.applyConfig();},applyConfig:function(){this.events={mouseDown:true,b4MouseDown:true,mouseUp:true,b4StartDrag:true,startDrag:true,b4EndDrag:true,endDrag:true,drag:true,b4Drag:true,invalidDrop:true,b4DragOut:true,dragOut:true,dragEnter:true,b4DragOver:true,dragOver:true,b4DragDrop:true,dragDrop:true};if(this.config.events){for(var C in this.config.events){if(this.config.events[C]===false){this.events[C]=false;}}}this.padding=this.config.padding||[0,0,0,0];this.isTarget=(this.config.isTarget!==false);this.maintainOffset=(this.config.maintainOffset);this.primaryButtonOnly=(this.config.primaryButtonOnly!==false);this.dragOnly=((this.config.dragOnly===true)?true:false);this.useShim=((this.config.useShim===true)?true:false);},handleOnAvailable:function(){this.available=true;this.resetConstraints();this.onAvailable();},setPadding:function(E,C,F,D){if(!C&&0!==C){this.padding=[E,E,E,E];}else{if(!F&&0!==F){this.padding=[E,C,E,C];}else{this.padding=[E,C,F,D];}}},setInitPosition:function(F,E){var G=this.getEl();if(!this.DDM.verifyEl(G)){if(G&&G.style&&(G.style.display=="none")){}else{}return;}var D=F||0;var C=E||0;var H=B.getXY(G);this.initPageX=H[0]-D;this.initPageY=H[1]-C;this.lastPageX=H[0];this.lastPageY=H[1];this.setStartPosition(H);},setStartPosition:function(D){var C=D||B.getXY(this.getEl());this.deltaSetXY=null;this.startPageX=C[0];this.startPageY=C[1];},addToGroup:function(C){this.groups[C]=true;this.DDM.regDragDrop(this,C);},removeFromGroup:function(C){if(this.groups[C]){delete this.groups[C];}this.DDM.removeDDFromGroup(this,C);},setDragElId:function(C){this.dragElId=C;},setHandleElId:function(C){if(typeof C!=="string"){C=B.generateId(C);}this.handleElId=C;this.DDM.regHandle(this.id,C);},setOuterHandleElId:function(C){if(typeof C!=="string"){C=B.generateId(C);}A.on(C,"mousedown",this.handleMouseDown,this,true);this.setHandleElId(C);this.hasOuterHandles=true;},unreg:function(){A.removeListener(this.id,"mousedown",this.handleMouseDown);this._domRef=null;this.DDM._remove(this);},isLocked:function(){return(this.DDM.isLocked()||this.locked);},handleMouseDown:function(J,I){var D=J.which||J.button;if(this.primaryButtonOnly&&D>1){return;}if(this.isLocked()){return;}var C=this.b4MouseDown(J),F=true;if(this.events.b4MouseDown){F=this.fireEvent("b4MouseDownEvent",J);}var E=this.onMouseDown(J),H=true;if(this.events.mouseDown){H=this.fireEvent("mouseDownEvent",J);}if((C===false)||(E===false)||(F===false)||(H===false)){return;}this.DDM.refreshCache(this.groups);var G=new YAHOO.util.Point(A.getPageX(J),A.getPageY(J));if(!this.hasOuterHandles&&!this.DDM.isOverTarget(G,this)){}else{if(this.clickValidator(J)){this.setStartPosition();this.DDM.handleMouseDown(J,this);this.DDM.stopEvent(J);}else{}}},clickValidator:function(D){var C=YAHOO.util.Event.getTarget(D);return(this.isValidHandleChild(C)&&(this.id==this.handleElId||this.DDM.handleWasClicked(C,this.id)));},getTargetCoord:function(E,D){var C=E-this.deltaX;var F=D-this.deltaY;if(this.constrainX){if(C<this.minX){C=this.minX;}if(C>this.maxX){C=this.maxX;}}if(this.constrainY){if(F<this.minY){F=this.minY;}if(F>this.maxY){F=this.maxY;}}C=this.getTick(C,this.xTicks);F=this.getTick(F,this.yTicks);return{x:C,y:F};},addInvalidHandleType:function(C){var D=C.toUpperCase();this.invalidHandleTypes[D]=D;},addInvalidHandleId:function(C){if(typeof C!=="string"){C=B.generateId(C);}this.invalidHandleIds[C]=C;},addInvalidHandleClass:function(C){this.invalidHandleClasses.push(C);},removeInvalidHandleType:function(C){var D=C.toUpperCase();delete this.invalidHandleTypes[D];},removeInvalidHandleId:function(C){if(typeof C!=="string"){C=B.generateId(C);}delete this.invalidHandleIds[C];},removeInvalidHandleClass:function(D){for(var E=0,C=this.invalidHandleClasses.length;E<C;++E){if(this.invalidHandleClasses[E]==D){delete this.invalidHandleClasses[E];}}},isValidHandleChild:function(F){var E=true;var H;try{H=F.nodeName.toUpperCase();}catch(G){H=F.nodeName;}E=E&&!this.invalidHandleTypes[H];E=E&&!this.invalidHandleIds[F.id];for(var D=0,C=this.invalidHandleClasses.length;E&&D<C;++D){E=!B.hasClass(F,this.invalidHandleClasses[D]);}return E;},setXTicks:function(F,C){this.xTicks=[];this.xTickSize=C;var E={};for(var D=this.initPageX;D>=this.minX;D=D-C){if(!E[D]){this.xTicks[this.xTicks.length]=D;E[D]=true;}}for(D=this.initPageX;D<=this.maxX;D=D+C){if(!E[D]){this.xTicks[this.xTicks.length]=D;E[D]=true;}}this.xTicks.sort(this.DDM.numericSort);},setYTicks:function(F,C){this.yTicks=[];this.yTickSize=C;var E={};for(var D=this.initPageY;D>=this.minY;D=D-C){if(!E[D]){this.yTicks[this.yTicks.length]=D;E[D]=true;}}for(D=this.initPageY;D<=this.maxY;D=D+C){if(!E[D]){this.yTicks[this.yTicks.length]=D;E[D]=true;}}this.yTicks.sort(this.DDM.numericSort);},setXConstraint:function(E,D,C){this.leftConstraint=parseInt(E,10);this.rightConstraint=parseInt(D,10);this.minX=this.initPageX-this.leftConstraint;this.maxX=this.initPageX+this.rightConstraint;if(C){this.setXTicks(this.initPageX,C);}this.constrainX=true;},clearConstraints:function(){this.constrainX=false;this.constrainY=false;this.clearTicks();},clearTicks:function(){this.xTicks=null;this.yTicks=null;this.xTickSize=0;this.yTickSize=0;},setYConstraint:function(C,E,D){this.topConstraint=parseInt(C,10);this.bottomConstraint=parseInt(E,10);this.minY=this.initPageY-this.topConstraint;this.maxY=this.initPageY+this.bottomConstraint;if(D){this.setYTicks(this.initPageY,D);
}this.constrainY=true;},resetConstraints:function(){if(this.initPageX||this.initPageX===0){var D=(this.maintainOffset)?this.lastPageX-this.initPageX:0;var C=(this.maintainOffset)?this.lastPageY-this.initPageY:0;this.setInitPosition(D,C);}else{this.setInitPosition();}if(this.constrainX){this.setXConstraint(this.leftConstraint,this.rightConstraint,this.xTickSize);}if(this.constrainY){this.setYConstraint(this.topConstraint,this.bottomConstraint,this.yTickSize);}},getTick:function(I,F){if(!F){return I;}else{if(F[0]>=I){return F[0];}else{for(var D=0,C=F.length;D<C;++D){var E=D+1;if(F[E]&&F[E]>=I){var H=I-F[D];var G=F[E]-I;return(G>H)?F[D]:F[E];}}return F[F.length-1];}}},toString:function(){return("DragDrop "+this.id);}};YAHOO.augment(YAHOO.util.DragDrop,YAHOO.util.EventProvider);})();YAHOO.util.DD=function(C,A,B){if(C){this.init(C,A,B);}};YAHOO.extend(YAHOO.util.DD,YAHOO.util.DragDrop,{scroll:true,autoOffset:function(C,B){var A=C-this.startPageX;var D=B-this.startPageY;this.setDelta(A,D);},setDelta:function(B,A){this.deltaX=B;this.deltaY=A;},setDragElPos:function(C,B){var A=this.getDragEl();this.alignElWithMouse(A,C,B);},alignElWithMouse:function(C,G,F){var E=this.getTargetCoord(G,F);if(!this.deltaSetXY){var H=[E.x,E.y];YAHOO.util.Dom.setXY(C,H);var D=parseInt(YAHOO.util.Dom.getStyle(C,"left"),10);var B=parseInt(YAHOO.util.Dom.getStyle(C,"top"),10);this.deltaSetXY=[D-E.x,B-E.y];}else{YAHOO.util.Dom.setStyle(C,"left",(E.x+this.deltaSetXY[0])+"px");YAHOO.util.Dom.setStyle(C,"top",(E.y+this.deltaSetXY[1])+"px");}this.cachePosition(E.x,E.y);var A=this;setTimeout(function(){A.autoScroll.call(A,E.x,E.y,C.offsetHeight,C.offsetWidth);},0);},cachePosition:function(B,A){if(B){this.lastPageX=B;this.lastPageY=A;}else{var C=YAHOO.util.Dom.getXY(this.getEl());this.lastPageX=C[0];this.lastPageY=C[1];}},autoScroll:function(J,I,E,K){if(this.scroll){var L=this.DDM.getClientHeight();var B=this.DDM.getClientWidth();var N=this.DDM.getScrollTop();var D=this.DDM.getScrollLeft();var H=E+I;var M=K+J;var G=(L+N-I-this.deltaY);var F=(B+D-J-this.deltaX);var C=40;var A=(document.all)?80:30;if(H>L&&G<C){window.scrollTo(D,N+A);}if(I<N&&N>0&&I-N<C){window.scrollTo(D,N-A);}if(M>B&&F<C){window.scrollTo(D+A,N);}if(J<D&&D>0&&J-D<C){window.scrollTo(D-A,N);}}},applyConfig:function(){YAHOO.util.DD.superclass.applyConfig.call(this);this.scroll=(this.config.scroll!==false);},b4MouseDown:function(A){this.setStartPosition();this.autoOffset(YAHOO.util.Event.getPageX(A),YAHOO.util.Event.getPageY(A));},b4Drag:function(A){this.setDragElPos(YAHOO.util.Event.getPageX(A),YAHOO.util.Event.getPageY(A));},toString:function(){return("DD "+this.id);}});YAHOO.util.DDProxy=function(C,A,B){if(C){this.init(C,A,B);this.initFrame();}};YAHOO.util.DDProxy.dragElId="ygddfdiv";YAHOO.extend(YAHOO.util.DDProxy,YAHOO.util.DD,{resizeFrame:true,centerFrame:false,createFrame:function(){var B=this,A=document.body;if(!A||!A.firstChild){setTimeout(function(){B.createFrame();},50);return;}var F=this.getDragEl(),E=YAHOO.util.Dom;if(!F){F=document.createElement("div");F.id=this.dragElId;var D=F.style;D.position="absolute";D.visibility="hidden";D.cursor="move";D.border="2px solid #aaa";D.zIndex=999;D.height="25px";D.width="25px";var C=document.createElement("div");E.setStyle(C,"height","100%");E.setStyle(C,"width","100%");E.setStyle(C,"background-color","#ccc");E.setStyle(C,"opacity","0");F.appendChild(C);A.insertBefore(F,A.firstChild);}},initFrame:function(){this.createFrame();},applyConfig:function(){YAHOO.util.DDProxy.superclass.applyConfig.call(this);this.resizeFrame=(this.config.resizeFrame!==false);this.centerFrame=(this.config.centerFrame);this.setDragElId(this.config.dragElId||YAHOO.util.DDProxy.dragElId);},showFrame:function(E,D){var C=this.getEl();var A=this.getDragEl();var B=A.style;this._resizeProxy();if(this.centerFrame){this.setDelta(Math.round(parseInt(B.width,10)/2),Math.round(parseInt(B.height,10)/2));}this.setDragElPos(E,D);YAHOO.util.Dom.setStyle(A,"visibility","visible");},_resizeProxy:function(){if(this.resizeFrame){var H=YAHOO.util.Dom;var B=this.getEl();var C=this.getDragEl();var G=parseInt(H.getStyle(C,"borderTopWidth"),10);var I=parseInt(H.getStyle(C,"borderRightWidth"),10);var F=parseInt(H.getStyle(C,"borderBottomWidth"),10);var D=parseInt(H.getStyle(C,"borderLeftWidth"),10);if(isNaN(G)){G=0;}if(isNaN(I)){I=0;}if(isNaN(F)){F=0;}if(isNaN(D)){D=0;}var E=Math.max(0,B.offsetWidth-I-D);var A=Math.max(0,B.offsetHeight-G-F);H.setStyle(C,"width",E+"px");H.setStyle(C,"height",A+"px");}},b4MouseDown:function(B){this.setStartPosition();var A=YAHOO.util.Event.getPageX(B);var C=YAHOO.util.Event.getPageY(B);this.autoOffset(A,C);},b4StartDrag:function(A,B){this.showFrame(A,B);},b4EndDrag:function(A){YAHOO.util.Dom.setStyle(this.getDragEl(),"visibility","hidden");},endDrag:function(D){var C=YAHOO.util.Dom;var B=this.getEl();var A=this.getDragEl();C.setStyle(A,"visibility","");C.setStyle(B,"visibility","hidden");YAHOO.util.DDM.moveToEl(B,A);C.setStyle(A,"visibility","hidden");C.setStyle(B,"visibility","");},toString:function(){return("DDProxy "+this.id);}});YAHOO.util.DDTarget=function(C,A,B){if(C){this.initTarget(C,A,B);}};YAHOO.extend(YAHOO.util.DDTarget,YAHOO.util.DragDrop,{toString:function(){return("DDTarget "+this.id);}});YAHOO.register("dragdrop",YAHOO.util.DragDropMgr,{version:"2.7.0",build:"1799"});YAHOO.util.Attribute=function(B,A){if(A){this.owner=A;this.configure(B,true);}};YAHOO.util.Attribute.prototype={name:undefined,value:null,owner:null,readOnly:false,writeOnce:false,_initialConfig:null,_written:false,method:null,setter:null,getter:null,validator:null,getValue:function(){var A=this.value;if(this.getter){A=this.getter.call(this.owner,this.name);}return A;},setValue:function(F,B){var E,A=this.owner,C=this.name;var D={type:C,prevValue:this.getValue(),newValue:F};if(this.readOnly||(this.writeOnce&&this._written)){return false;}if(this.validator&&!this.validator.call(A,F)){return false;}if(!B){E=A.fireBeforeChangeEvent(D);if(E===false){return false;}}if(this.setter){F=this.setter.call(A,F,this.name);if(F===undefined){}}if(this.method){this.method.call(A,F,this.name);}this.value=F;this._written=true;D.type=C;if(!B){this.owner.fireChangeEvent(D);}return true;},configure:function(B,C){B=B||{};if(C){this._written=false;}this._initialConfig=this._initialConfig||{};for(var A in B){if(B.hasOwnProperty(A)){this[A]=B[A];if(C){this._initialConfig[A]=B[A];}}}},resetValue:function(){return this.setValue(this._initialConfig.value);},resetConfig:function(){this.configure(this._initialConfig,true);},refresh:function(A){this.setValue(this.value,A);}};(function(){var A=YAHOO.util.Lang;YAHOO.util.AttributeProvider=function(){};YAHOO.util.AttributeProvider.prototype={_configs:null,get:function(C){this._configs=this._configs||{};var B=this._configs[C];if(!B||!this._configs.hasOwnProperty(C)){return null;}return B.getValue();},set:function(D,E,B){this._configs=this._configs||{};var C=this._configs[D];if(!C){return false;}return C.setValue(E,B);},getAttributeKeys:function(){this._configs=this._configs;var C=[],B;for(B in this._configs){if(A.hasOwnProperty(this._configs,B)&&!A.isUndefined(this._configs[B])){C[C.length]=B;}}return C;},setAttributes:function(D,B){for(var C in D){if(A.hasOwnProperty(D,C)){this.set(C,D[C],B);}}},resetValue:function(C,B){this._configs=this._configs||{};if(this._configs[C]){this.set(C,this._configs[C]._initialConfig.value,B);return true;}return false;},refresh:function(E,C){this._configs=this._configs||{};var F=this._configs;E=((A.isString(E))?[E]:E)||this.getAttributeKeys();for(var D=0,B=E.length;D<B;++D){if(F.hasOwnProperty(E[D])){this._configs[E[D]].refresh(C);}}},register:function(B,C){this.setAttributeConfig(B,C);},getAttributeConfig:function(C){this._configs=this._configs||{};var B=this._configs[C]||{};var D={};for(C in B){if(A.hasOwnProperty(B,C)){D[C]=B[C];}}return D;},setAttributeConfig:function(B,C,D){this._configs=this._configs||{};C=C||{};if(!this._configs[B]){C.name=B;this._configs[B]=this.createAttribute(C);}else{this._configs[B].configure(C,D);}},configureAttribute:function(B,C,D){this.setAttributeConfig(B,C,D);},resetAttributeConfig:function(B){this._configs=this._configs||{};this._configs[B].resetConfig();},subscribe:function(B,C){this._events=this._events||{};if(!(B in this._events)){this._events[B]=this.createEvent(B);}YAHOO.util.EventProvider.prototype.subscribe.apply(this,arguments);},on:function(){this.subscribe.apply(this,arguments);},addListener:function(){this.subscribe.apply(this,arguments);},fireBeforeChangeEvent:function(C){var B="before";B+=C.type.charAt(0).toUpperCase()+C.type.substr(1)+"Change";C.type=B;return this.fireEvent(C.type,C);},fireChangeEvent:function(B){B.type+="Change";return this.fireEvent(B.type,B);},createAttribute:function(B){return new YAHOO.util.Attribute(B,this);}};YAHOO.augment(YAHOO.util.AttributeProvider,YAHOO.util.EventProvider);})();(function(){var B=YAHOO.util.Dom,C=YAHOO.util.AttributeProvider;var A=function(D,E){this.init.apply(this,arguments);};A.DOM_EVENTS={"click":true,"dblclick":true,"keydown":true,"keypress":true,"keyup":true,"mousedown":true,"mousemove":true,"mouseout":true,"mouseover":true,"mouseup":true,"focus":true,"blur":true,"submit":true,"change":true};A.prototype={DOM_EVENTS:null,DEFAULT_HTML_SETTER:function(F,D){var E=this.get("element");if(E){E[D]=F;}},DEFAULT_HTML_GETTER:function(D){var E=this.get("element"),F;if(E){F=E[D];}return F;},appendChild:function(D){D=D.get?D.get("element"):D;return this.get("element").appendChild(D);},getElementsByTagName:function(D){return this.get("element").getElementsByTagName(D);},hasChildNodes:function(){return this.get("element").hasChildNodes();},insertBefore:function(D,E){D=D.get?D.get("element"):D;E=(E&&E.get)?E.get("element"):E;return this.get("element").insertBefore(D,E);},removeChild:function(D){D=D.get?D.get("element"):D;return this.get("element").removeChild(D);},replaceChild:function(D,E){D=D.get?D.get("element"):D;E=E.get?E.get("element"):E;return this.get("element").replaceChild(D,E);},initAttributes:function(D){},addListener:function(H,G,I,F){var E=this.get("element")||this.get("id");F=F||this;var D=this;if(!this._events[H]){if(E&&this.DOM_EVENTS[H]){YAHOO.util.Event.addListener(E,H,function(J){if(J.srcElement&&!J.target){J.target=J.srcElement;}D.fireEvent(H,J);},I,F);}this.createEvent(H,this);}return YAHOO.util.EventProvider.prototype.subscribe.apply(this,arguments);},on:function(){return this.addListener.apply(this,arguments);},subscribe:function(){return this.addListener.apply(this,arguments);},removeListener:function(E,D){return this.unsubscribe.apply(this,arguments);},addClass:function(D){B.addClass(this.get("element"),D);},getElementsByClassName:function(E,D){return B.getElementsByClassName(E,D,this.get("element"));},hasClass:function(D){return B.hasClass(this.get("element"),D);},removeClass:function(D){return B.removeClass(this.get("element"),D);},replaceClass:function(E,D){return B.replaceClass(this.get("element"),E,D);},setStyle:function(E,D){return B.setStyle(this.get("element"),E,D);},getStyle:function(D){return B.getStyle(this.get("element"),D);},fireQueue:function(){var E=this._queue;for(var F=0,D=E.length;F<D;++F){this[E[F][0]].apply(this,E[F][1]);}},appendTo:function(E,F){E=(E.get)?E.get("element"):B.get(E);this.fireEvent("beforeAppendTo",{type:"beforeAppendTo",target:E});
F=(F&&F.get)?F.get("element"):B.get(F);var D=this.get("element");if(!D){return false;}if(!E){return false;}if(D.parent!=E){if(F){E.insertBefore(D,F);}else{E.appendChild(D);}}this.fireEvent("appendTo",{type:"appendTo",target:E});return D;},get:function(D){var F=this._configs||{},E=F.element;if(E&&!F[D]&&!YAHOO.lang.isUndefined(E.value[D])){this._setHTMLAttrConfig(D);}return C.prototype.get.call(this,D);},setAttributes:function(J,G){var E={},H=this._configOrder;for(var I=0,D=H.length;I<D;++I){if(J[H[I]]!==undefined){E[H[I]]=true;this.set(H[I],J[H[I]],G);}}for(var F in J){if(J.hasOwnProperty(F)&&!E[F]){this.set(F,J[F],G);}}},set:function(E,G,D){var F=this.get("element");if(!F){this._queue[this._queue.length]=["set",arguments];if(this._configs[E]){this._configs[E].value=G;}return;}if(!this._configs[E]&&!YAHOO.lang.isUndefined(F[E])){this._setHTMLAttrConfig(E);}return C.prototype.set.apply(this,arguments);},setAttributeConfig:function(D,E,F){this._configOrder.push(D);C.prototype.setAttributeConfig.apply(this,arguments);},createEvent:function(E,D){this._events[E]=true;return C.prototype.createEvent.apply(this,arguments);},init:function(E,D){this._initElement(E,D);},destroy:function(){var D=this.get("element");YAHOO.util.Event.purgeElement(D,true);this.unsubscribeAll();if(D&&D.parentNode){D.parentNode.removeChild(D);}this._queue=[];this._events={};this._configs={};this._configOrder=[];},_initElement:function(F,E){this._queue=this._queue||[];this._events=this._events||{};this._configs=this._configs||{};this._configOrder=[];E=E||{};E.element=E.element||F||null;var H=false;var D=A.DOM_EVENTS;this.DOM_EVENTS=this.DOM_EVENTS||{};for(var G in D){if(D.hasOwnProperty(G)){this.DOM_EVENTS[G]=D[G];}}if(typeof E.element==="string"){this._setHTMLAttrConfig("id",{value:E.element});}if(B.get(E.element)){H=true;this._initHTMLElement(E);this._initContent(E);}YAHOO.util.Event.onAvailable(E.element,function(){if(!H){this._initHTMLElement(E);}this.fireEvent("available",{type:"available",target:B.get(E.element)});},this,true);YAHOO.util.Event.onContentReady(E.element,function(){if(!H){this._initContent(E);}this.fireEvent("contentReady",{type:"contentReady",target:B.get(E.element)});},this,true);},_initHTMLElement:function(D){this.setAttributeConfig("element",{value:B.get(D.element),readOnly:true});},_initContent:function(D){this.initAttributes(D);this.setAttributes(D,true);this.fireQueue();},_setHTMLAttrConfig:function(D,F){var E=this.get("element");F=F||{};F.name=D;F.setter=F.setter||this.DEFAULT_HTML_SETTER;F.getter=F.getter||this.DEFAULT_HTML_GETTER;F.value=F.value||E[D];this._configs[D]=new YAHOO.util.Attribute(F,this);}};YAHOO.augment(A,C);YAHOO.util.Element=A;})();YAHOO.register("element",YAHOO.util.Element,{version:"2.7.0",build:"1799"});YAHOO.register("utilities", YAHOO, {version: "2.7.0", build: "1799"});

/*
Copyright (c) 2009, Yahoo! Inc. All rights reserved.
Code licensed under the BSD License:
http://developer.yahoo.net/yui/license.txt
version: 2.7.0
*/
(function () {
    var Dom = YAHOO.util.Dom,
        Event = YAHOO.util.Event,
        Lang = YAHOO.lang,
        Widget = YAHOO.widget;
        
    

/**
 * The treeview widget is a generic tree building tool.
 * @module treeview
 * @title TreeView Widget
 * @requires yahoo, event
 * @optional animation, json
 * @namespace YAHOO.widget
 */

/**
 * Contains the tree view state data and the root node.
 *
 * @class TreeView
 * @uses YAHOO.util.EventProvider
 * @constructor
 * @param {string|HTMLElement} id The id of the element, or the element itself that the tree will be inserted into.  Existing markup in this element, if valid, will be used to build the tree
 * @param {Array|object|string}  oConfig (optional)  An array containing the definition of the tree.  (see buildTreeFromObject)
 * 
 */
YAHOO.widget.TreeView = function(id, oConfig) {
    if (id) { this.init(id); }
    if (oConfig) {
        if (!Lang.isArray(oConfig)) {
            oConfig = [oConfig];
        }
        this.buildTreeFromObject(oConfig);
    } else if (Lang.trim(this._el.innerHTML)) {
        this.buildTreeFromMarkup(id);
    }
};

var TV = Widget.TreeView;

TV.prototype = {

    /**
     * The id of tree container element
     * @property id
     * @type String
     */
    id: null,

    /**
     * The host element for this tree
     * @property _el
     * @private
     * @type HTMLelement
     */
    _el: null,

     /**
     * Flat collection of all nodes in this tree.  This is a sparse
     * array, so the length property can't be relied upon for a
     * node count for the tree.
     * @property _nodes
     * @type Node[]
     * @private
     */
    _nodes: null,

    /**
     * We lock the tree control while waiting for the dynamic loader to return
     * @property locked
     * @type boolean
     */
    locked: false,

    /**
     * The animation to use for expanding children, if any
     * @property _expandAnim
     * @type string
     * @private
     */
    _expandAnim: null,

    /**
     * The animation to use for collapsing children, if any
     * @property _collapseAnim
     * @type string
     * @private
     */
    _collapseAnim: null,

    /**
     * The current number of animations that are executing
     * @property _animCount
     * @type int
     * @private
     */
    _animCount: 0,

    /**
     * The maximum number of animations to run at one time.
     * @property maxAnim
     * @type int
     */
    maxAnim: 2,

    /**
     * Whether there is any subscriber to dblClickEvent
     * @property _hasDblClickSubscriber
     * @type boolean
     * @private
     */
    _hasDblClickSubscriber: false,
    
    /**
     * Stores the timer used to check for double clicks
     * @property _dblClickTimer
     * @type window.timer object
     * @private
     */
    _dblClickTimer: null,

  /**
     * A reference to the Node currently having the focus or null if none.
     * @property currentFocus
     * @type YAHOO.widget.Node
     */
    currentFocus: null,
    
    /**
    * If true, only one Node can be highlighted at a time
    * @property singleNodeHighlight
    * @type boolean
    * @default false
    */
    
    singleNodeHighlight: false,
    
    /**
    * A reference to the Node that is currently highlighted.
    * It is only meaningful if singleNodeHighlight is enabled
    * @property _currentlyHighlighted
    * @type YAHOO.widget.Node
    * @default null
    * @private
    */
    
    _currentlyHighlighted: null,

    /**
     * Sets up the animation for expanding children
     * @method setExpandAnim
     * @param {string} type the type of animation (acceptable values defined 
     * in YAHOO.widget.TVAnim)
     */
    setExpandAnim: function(type) {
        this._expandAnim = (Widget.TVAnim.isValid(type)) ? type : null;
    },

    /**
     * Sets up the animation for collapsing children
     * @method setCollapseAnim
     * @param {string} the type of animation (acceptable values defined in 
     * YAHOO.widget.TVAnim)
     */
    setCollapseAnim: function(type) {
        this._collapseAnim = (Widget.TVAnim.isValid(type)) ? type : null;
    },

    /**
     * Perform the expand animation if configured, or just show the
     * element if not configured or too many animations are in progress
     * @method animateExpand
     * @param el {HTMLElement} the element to animate
     * @param node {YAHOO.util.Node} the node that was expanded
     * @return {boolean} true if animation could be invoked, false otherwise
     */
    animateExpand: function(el, node) {

        if (this._expandAnim && this._animCount < this.maxAnim) {
            // this.locked = true;
            var tree = this;
            var a = Widget.TVAnim.getAnim(this._expandAnim, el, 
                            function() { tree.expandComplete(node); });
            if (a) { 
                ++this._animCount;
                this.fireEvent("animStart", {
                        "node": node, 
                        "type": "expand"
                    });
                a.animate();
            }

            return true;
        }

        return false;
    },

    /**
     * Perform the collapse animation if configured, or just show the
     * element if not configured or too many animations are in progress
     * @method animateCollapse
     * @param el {HTMLElement} the element to animate
     * @param node {YAHOO.util.Node} the node that was expanded
     * @return {boolean} true if animation could be invoked, false otherwise
     */
    animateCollapse: function(el, node) {

        if (this._collapseAnim && this._animCount < this.maxAnim) {
            // this.locked = true;
            var tree = this;
            var a = Widget.TVAnim.getAnim(this._collapseAnim, el, 
                            function() { tree.collapseComplete(node); });
            if (a) { 
                ++this._animCount;
                this.fireEvent("animStart", {
                        "node": node, 
                        "type": "collapse"
                    });
                a.animate();
            }

            return true;
        }

        return false;
    },

    /**
     * Function executed when the expand animation completes
     * @method expandComplete
     */
    expandComplete: function(node) {
        --this._animCount;
        this.fireEvent("animComplete", {
                "node": node, 
                "type": "expand"
            });
        // this.locked = false;
    },

    /**
     * Function executed when the collapse animation completes
     * @method collapseComplete
     */
    collapseComplete: function(node) {
        --this._animCount;
        this.fireEvent("animComplete", {
                "node": node, 
                "type": "collapse"
            });
        // this.locked = false;
    },

    /**
     * Initializes the tree
     * @method init
     * @parm {string|HTMLElement} id the id of the element that will hold the tree
     * @private
     */
    init: function(id) {
        this._el = Dom.get(id);
        this.id = Dom.generateId(this._el,"yui-tv-auto-id-");

    /**
         * When animation is enabled, this event fires when the animation
         * starts
         * @event animStart
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is expanding/collapsing
         * @parm {String} type the type of animation ("expand" or "collapse")
         */
        this.createEvent("animStart", this);

        /**
         * When animation is enabled, this event fires when the animation
         * completes
         * @event animComplete
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is expanding/collapsing
         * @parm {String} type the type of animation ("expand" or "collapse")
         */
        this.createEvent("animComplete", this);

        /**
         * Fires when a node is going to be collapsed.  Return false to stop
         * the collapse.
         * @event collapse
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is collapsing
         */
        this.createEvent("collapse", this);

        /**
         * Fires after a node is successfully collapsed.  This event will not fire
         * if the "collapse" event was cancelled.
         * @event collapseComplete
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that was collapsed
         */
        this.createEvent("collapseComplete", this);

        /**
         * Fires when a node is going to be expanded.  Return false to stop
         * the collapse.
         * @event expand
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that is expanding
         */
        this.createEvent("expand", this);

        /**
         * Fires after a node is successfully expanded.  This event will not fire
         * if the "expand" event was cancelled.
         * @event expandComplete
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that was expanded
         */
        this.createEvent("expandComplete", this);

    /**
         * Fires when the Enter key is pressed on a node that has the focus
         * @event enterKeyPressed
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node that has the focus
         */
        this.createEvent("enterKeyPressed", this);
        
    /**
         * Fires when the label in a TextNode or MenuNode or content in an HTMLNode receives a Click.
    * The listener may return false to cancel toggling and focusing on the node.
         * @event clickEvent
         * @type CustomEvent
         * @param oArgs.event  {HTMLEvent} The event object
         * @param oArgs.node {YAHOO.widget.Node} node the node that was clicked
         */
        this.createEvent("clickEvent", this);
        
    /**
         * Fires when the focus receives the focus, when it changes from a Node 
    * to another Node or when it is completely lost (blurred)
         * @event focusChanged
         * @type CustomEvent
         * @param oArgs.oldNode  {YAHOO.widget.Node} Node that had the focus or null if none
         * @param oArgs.newNode {YAHOO.widget.Node} Node that receives the focus or null if none
         */
        
        this.createEvent('focusChanged',this);

    /**
         * Fires when the label in a TextNode or MenuNode or content in an HTMLNode receives a double Click
         * @event dblClickEvent
         * @type CustomEvent
         * @param oArgs.event  {HTMLEvent} The event object
         * @param oArgs.node {YAHOO.widget.Node} node the node that was clicked
         */
        var self = this;
        this.createEvent("dblClickEvent", {
            scope:this,
            onSubscribeCallback: function() {
                self._hasDblClickSubscriber = true;
            }
        });
        
    /**
         * Custom event that is fired when the text node label is clicked. 
         *  The node clicked is  provided as an argument
         *
         * @event labelClick
         * @type CustomEvent
         * @param {YAHOO.widget.Node} node the node clicked
    * @deprecated use clickEvent or dblClickEvent
         */
        this.createEvent("labelClick", this);
        
    /**
     * Custom event fired when the highlight of a node changes.
     * The node that triggered the change is provided as an argument:
     * The status of the highlight can be checked in 
     * <a href="YAHOO.widget.Node.html#property_highlightState">nodeRef.highlightState</a>.
     * Depending on <a href="YAHOO.widget.Node.html#property_propagateHighlight">nodeRef.propagateHighlight</a>, other nodes might have changed
     * @event highlightEvent
     * @type CustomEvent
        * @param node{YAHOO.widget.Node} the node that started the change in highlighting state
    */
        this.createEvent("highlightEvent",this);
     


        this._nodes = [];

        // store a global reference
        TV.trees[this.id] = this;

        // Set up the root node
        this.root = new Widget.RootNode(this);

        var LW = Widget.LogWriter;


        
        // YAHOO.util.Event.onContentReady(this.id, this.handleAvailable, this, true);
        // YAHOO.util.Event.on(this.id, "click", this.handleClick, this, true);
    },

    //handleAvailable: function() {
        //var Event = YAHOO.util.Event;
        //Event.on(this.id, 
    //},
 /**
     * Builds the TreeView from an object.  
     * This is the method called by the constructor to build the tree when it has a second argument.
     *  A tree can be described by an array of objects, each object corresponding to a node.
     *  Node descriptions may contain values for any property of a node plus the following extra properties: <ul>
     * <li>type:  can be one of the following:<ul>
     *  <li> A shortname for a node type (<code>'text','menu','html'</code>) </li>
     * <li>The name of a Node class under YAHOO.widget (<code>'TextNode', 'MenuNode', 'DateNode'</code>, etc) </li>
     * <li>a reference to an actual class: <code>YAHOO.widget.DateNode</code></li></ul></li>
     * <li>children: an array containing further node definitions</li></ul>
     * @method buildTreeFromObject
     * @param  oConfig {Array}  array containing a full description of the tree
     * 
     */
    buildTreeFromObject: function (oConfig) {
        var build = function (parent, oConfig) {
            var i, item, node, children, type, NodeType, ThisType;
            for (i = 0; i < oConfig.length; i++) {
                item = oConfig[i];
                if (Lang.isString(item)) {
                    node = new Widget.TextNode(item, parent);
                } else if (Lang.isObject(item)) {
                    children = item.children;
                    delete item.children;
                    type = item.type || 'text';
                    delete item.type;
                    switch (Lang.isString(type) && type.toLowerCase()) {
                        case 'text':
                            node = new Widget.TextNode(item, parent);
                            break;
                        case 'menu':
                            node = new Widget.MenuNode(item, parent);
                            break;
                        case 'html':
                            node = new Widget.HTMLNode(item, parent);
                            break;
                        default:
                            if (Lang.isString(type)) {
                                NodeType = Widget[type];
                            } else {
                                NodeType = type;
                            }
                            if (Lang.isObject(NodeType)) {
                                for (ThisType = NodeType; ThisType && ThisType !== Widget.Node; ThisType = ThisType.superclass.constructor) {}
                                if (ThisType) {
                                    node = new NodeType(item, parent);
                                } else {
                                }
                            } else {
                            }
                    }
                    if (children) {
                        build(node,children);
                    }
                } else {
                }
            }
        };
                            
                    
        build(this.root,oConfig);
    },
/**
     * Builds the TreeView from existing markup.   Markup should consist of &lt;UL&gt; or &lt;OL&gt; elements containing &lt;LI&gt; elements.  
     * Each &lt;LI&gt; can have one element used as label and a second optional element which is to be a &lt;UL&gt; or &lt;OL&gt;
     * containing nested nodes.
     * Depending on what the first element of the &lt;LI&gt; element is, the following Nodes will be created: <ul>
     *           <li>plain text:  a regular TextNode</li>
     *           <li>anchor &lt;A&gt;: a TextNode with its <code>href</code> and <code>target</code> taken from the anchor</li>
     *           <li>anything else: an HTMLNode</li></ul>
     * Only the first  outermost (un-)ordered list in the markup and its children will be parsed.
     * Nodes will be collapsed unless  an  &lt;LI&gt;  tag has a className called 'expanded'.
     * All other className attributes will be copied over to the Node className property.
     * If the &lt;LI&gt; element contains an attribute called <code>yuiConfig</code>, its contents should be a JSON-encoded object
     * as the one used in method <a href="#method_buildTreeFromObject">buildTreeFromObject</a>.
     * @method buildTreeFromMarkup
     * @param  id{string|HTMLElement} The id of the element that contains the markup or a reference to it.
     */
    buildTreeFromMarkup: function (id) {
        var build = function (markup) {
            var el, child, branch = [], config = {}, label, yuiConfig;
            // Dom's getFirstChild and getNextSibling skip over text elements
            for (el = Dom.getFirstChild(markup); el; el = Dom.getNextSibling(el)) {
                switch (el.tagName.toUpperCase()) {
                    case 'LI':
                        label = '';
                        config = {
                            expanded: Dom.hasClass(el,'expanded'),
                            title: el.title || el.alt || null,
                            className: Lang.trim(el.className.replace(/\bexpanded\b/,'')) || null
                        };
                        // I cannot skip over text elements here because I want them for labels
                        child = el.firstChild;
                        if (child.nodeType == 3) {
                            // nodes with only whitespace, tabs and new lines don't count, they are probably just formatting.
                            label = Lang.trim(child.nodeValue.replace(/[\n\t\r]*/g,''));
                            if (label) {
                                config.type = 'text';
                                config.label = label;
                            } else {
                                child = Dom.getNextSibling(child);
                            }
                        }
                        if (!label) {
                            if (child.tagName.toUpperCase() == 'A') {
                                config.type = 'text';
                                config.label = child.innerHTML;
                                config.href = child.href;
                                config.target = child.target;
                                config.title = child.title || child.alt || config.title;
                            } else {
                                config.type = 'html';
                                var d = document.createElement('div');
                                d.appendChild(child.cloneNode(true));
                                config.html = d.innerHTML;
                                config.hasIcon = true;
                            }
                        }
                        // see if after the label it has a further list which will become children of this node.
                        child = Dom.getNextSibling(child);
                        switch (child && child.tagName.toUpperCase()) {
                            case 'UL':
                            case 'OL':
                                config.children = build(child);
                                break;
                        }
                        // if there are further elements or text, it will be ignored.
                        
                        if (YAHOO.lang.JSON) {
                            yuiConfig = el.getAttribute('yuiConfig');
                            if (yuiConfig) {
                                yuiConfig = YAHOO.lang.JSON.parse(yuiConfig);
                                config = YAHOO.lang.merge(config,yuiConfig);
                            }
                        }
                        
                        branch.push(config);
                        break;
                    case 'UL':
                    case 'OL':
                        config = {
                            type: 'text',
                            label: '',
                            children: build(child)
                        };
                        branch.push(config);
                        break;
                }
            }
            return branch;
        };

        var markup = Dom.getChildrenBy(Dom.get(id),function (el) { 
            var tag = el.tagName.toUpperCase();
            return  tag == 'UL' || tag == 'OL';
        });
        if (markup.length) {
            this.buildTreeFromObject(build(markup[0]));
        } else {
        }
    },
  /**
     * Returns the TD element where the event has occurred
     * @method _getEventTargetTdEl
     * @private
     */
    _getEventTargetTdEl: function (ev) {
        var target = Event.getTarget(ev); 
        // go up looking for a TD with a className with a ygtv prefix
        while (target && !(target.tagName.toUpperCase() == 'TD' && Dom.hasClass(target.parentNode,'ygtvrow'))) { 
            target = Dom.getAncestorByTagName(target,'td'); 
        }
        if (Lang.isNull(target)) { return null; }
        // If it is a spacer cell, do nothing
        if (/\bygtv(blank)?depthcell/.test(target.className)) { return null;}
        // If it has an id, search for the node number and see if it belongs to a node in this tree.
        if (target.id) {
            var m = target.id.match(/\bygtv([^\d]*)(.*)/);
            if (m && m[2] && this._nodes[m[2]]) {
                return target;
            }
        }
        return null;
    },
  /**
     * Event listener for click events
     * @method _onClickEvent
     * @private
     */
    _onClickEvent: function (ev) {
        var self = this,
            td = this._getEventTargetTdEl(ev),
            node,
            target,
            toggle = function () {
                node.toggle();
                node.focus();
                try {
                    Event.preventDefault(ev);
                } catch (e) {
                    // @TODO
                    // For some reason IE8 is providing an event object with
                    // most of the fields missing, but only when clicking on
                    // the node's label, and only when working with inline
                    // editing.  This generates a "Member not found" error
                    // in that browser.  Determine if this is a browser
                    // bug, or a problem with this code.  Already checked to
                    // see if the problem has to do with access the event
                    // in the outer scope, and that isn't the problem.
                    // Maybe the markup for inline editing is broken.
                }
            };

        if (!td) {
            return; 
        }

        node = this.getNodeByElement(td);
        if (!node) { 
            return; 
        }
        
        // exception to handle deprecated event labelClick
        // @TODO take another look at this deprecation.  It is common for people to
        // only be interested in the label click, so why make them have to test
        // the node type to figure out whether the click was on the label?
        target = Event.getTarget(ev);
        if (Dom.hasClass(target, node.labelStyle) || Dom.getAncestorByClassName(target,node.labelStyle)) {
            this.fireEvent('labelClick',node);
        }
        
        //  If it is a toggle cell, toggle
        if (/\bygtv[tl][mp]h?h?/.test(td.className)) {
            toggle();
        } else {
            if (this._dblClickTimer) {
                window.clearTimeout(this._dblClickTimer);
                this._dblClickTimer = null;
            } else {
                if (this._hasDblClickSubscriber) {
                    this._dblClickTimer = window.setTimeout(function () {
                        self._dblClickTimer = null;
                        if (self.fireEvent('clickEvent', {event:ev,node:node}) !== false) { 
                            toggle();
                        }
                    }, 200);
                } else {
                    if (self.fireEvent('clickEvent', {event:ev,node:node}) !== false) { 
                        //toggle();
                    }
                }
            }
        }
    },

  /**
     * Event listener for double-click events
     * @method _onDblClickEvent
     * @private
     */
    _onDblClickEvent: function (ev) {
        if (!this._hasDblClickSubscriber) { return; }
        var td = this._getEventTargetTdEl(ev);
        if (!td) {return;}

        if (!(/\bygtv[tl][mp]h?h?/.test(td.className))) {
            this.fireEvent('dblClickEvent', {event:ev, node:this.getNodeByElement(td)}); 
            if (this._dblClickTimer) {
                window.clearTimeout(this._dblClickTimer);
                this._dblClickTimer = null;
            }
        }
    },
  /**
     * Event listener for mouse over events
     * @method _onMouseOverEvent
     * @private
     */
    _onMouseOverEvent:function (ev) {
        var target;
        if ((target = this._getEventTargetTdEl(ev)) && (target = this.getNodeByElement(target)) && (target = target.getToggleEl())) {
            target.className = target.className.replace(/\bygtv([lt])([mp])\b/gi,'ygtv$1$2h');
        }
    },
  /**
     * Event listener for mouse out events
     * @method _onMouseOutEvent
     * @private
     */
    _onMouseOutEvent: function (ev) {
        var target;
        if ((target = this._getEventTargetTdEl(ev)) && (target = this.getNodeByElement(target)) && (target = target.getToggleEl())) {
            target.className = target.className.replace(/\bygtv([lt])([mp])h\b/gi,'ygtv$1$2');
        }
    },
  /**
     * Event listener for key down events
     * @method _onKeyDownEvent
     * @private
     */
    _onKeyDownEvent: function (ev) {
        var target = Event.getTarget(ev),
            node = this.getNodeByElement(target),
            newNode = node,
            KEY = YAHOO.util.KeyListener.KEY;

        switch(ev.keyCode) {
            case KEY.UP:
                do {
                    if (newNode.previousSibling) {
                        newNode = newNode.previousSibling;
                    } else {
                        newNode = newNode.parent;
                    }
                } while (newNode && !newNode._canHaveFocus());
                if (newNode) { newNode.focus(); }
                Event.preventDefault(ev);
                break;
            case KEY.DOWN:
                do {
                    if (newNode.nextSibling) {
                        newNode = newNode.nextSibling;
                    } else {
                        newNode.expand();
                        newNode = (newNode.children.length || null) && newNode.children[0];
                    }
                } while (newNode && !newNode._canHaveFocus);
                if (newNode) { newNode.focus();}
                Event.preventDefault(ev);
                break;
            case KEY.LEFT:
                do {
                    if (newNode.parent) {
                        newNode = newNode.parent;
                    } else {
                        newNode = newNode.previousSibling;
                    }
                } while (newNode && !newNode._canHaveFocus());
                if (newNode) { newNode.focus();}
                Event.preventDefault(ev);
                break;
            case KEY.RIGHT:
                do {
                    newNode.expand();
                    if (newNode.children.length) {
                        newNode = newNode.children[0];
                    } else {
                        newNode = newNode.nextSibling;
                    }
                } while (newNode && !newNode._canHaveFocus());
                if (newNode) { newNode.focus();}
                Event.preventDefault(ev);
                break;
            case KEY.ENTER:
                if (node.href) {
                    if (node.target) {
                        window.open(node.href,node.target);
                    } else {
                        window.location(node.href);
                    }
                } else {
                    node.toggle();
                }
                this.fireEvent('enterKeyPressed',node);
                Event.preventDefault(ev);
                break;
            case KEY.HOME:
                newNode = this.getRoot();
                if (newNode.children.length) {newNode = newNode.children[0];}
                if (newNode._canHaveFocus()) { newNode.focus(); }
                Event.preventDefault(ev);
                break;
            case KEY.END:
                newNode = newNode.parent.children;
                newNode = newNode[newNode.length -1];
                if (newNode._canHaveFocus()) { newNode.focus(); }
                Event.preventDefault(ev);
                break;
            // case KEY.PAGE_UP:
                // break;
            // case KEY.PAGE_DOWN:
                // break;
            case 107:  // plus key
                if (ev.shiftKey) {
                    node.parent.expandAll();
                } else {
                    node.expand();
                }
                break;
            case 109: // minus key
                if (ev.shiftKey) {
                    node.parent.collapseAll();
                } else {
                    node.collapse();
                }
                break;
            default:
                break;
        }
    },
    /**
     * Renders the tree boilerplate and visible nodes
     * @method render
     */
    render: function() {
        var html = this.root.getHtml(),
            el = this.getEl();
        el.innerHTML = html;
        if (!this._hasEvents) {
            Event.on(el, 'click', this._onClickEvent, this, true);
            Event.on(el, 'dblclick', this._onDblClickEvent, this, true);
            Event.on(el, 'mouseover', this._onMouseOverEvent, this, true);
            Event.on(el, 'mouseout', this._onMouseOutEvent, this, true);
            Event.on(el, 'keydown', this._onKeyDownEvent, this, true);
        }
        this._hasEvents = true;
    },
    
  /**
     * Returns the tree's host element
     * @method getEl
     * @return {HTMLElement} the host element
     */
    getEl: function() {
        if (! this._el) {
            this._el = Dom.get(this.id);
        }
        return this._el;
    },

    /**
     * Nodes register themselves with the tree instance when they are created.
     * @method regNode
     * @param node {Node} the node to register
     * @private
     */
    regNode: function(node) {
        this._nodes[node.index] = node;
    },

    /**
     * Returns the root node of this tree
     * @method getRoot
     * @return {Node} the root node
     */
    getRoot: function() {
        return this.root;
    },

    /**
     * Configures this tree to dynamically load all child data
     * @method setDynamicLoad
     * @param {function} fnDataLoader the function that will be called to get the data
     * @param iconMode {int} configures the icon that is displayed when a dynamic
     * load node is expanded the first time without children.  By default, the 
     * "collapse" icon will be used.  If set to 1, the leaf node icon will be
     * displayed.
     */
    setDynamicLoad: function(fnDataLoader, iconMode) { 
        this.root.setDynamicLoad(fnDataLoader, iconMode);
    },

    /**
     * Expands all child nodes.  Note: this conflicts with the "multiExpand"
     * node property.  If expand all is called in a tree with nodes that
     * do not allow multiple siblings to be displayed, only the last sibling
     * will be expanded.
     * @method expandAll
     */
    expandAll: function() { 
        if (!this.locked) {
            this.root.expandAll(); 
        }
    },

    /**
     * Collapses all expanded child nodes in the entire tree.
     * @method collapseAll
     */
    collapseAll: function() { 
        if (!this.locked) {
            this.root.collapseAll(); 
        }
    },

    /**
     * Returns a node in the tree that has the specified index (this index
     * is created internally, so this function probably will only be used
     * in html generated for a given node.)
     * @method getNodeByIndex
     * @param {int} nodeIndex the index of the node wanted
     * @return {Node} the node with index=nodeIndex, null if no match
     */
    getNodeByIndex: function(nodeIndex) {
        var n = this._nodes[nodeIndex];
        return (n) ? n : null;
    },

    /**
     * Returns a node that has a matching property and value in the data
     * object that was passed into its constructor.
     * @method getNodeByProperty
     * @param {object} property the property to search (usually a string)
     * @param {object} value the value we want to find (usuall an int or string)
     * @return {Node} the matching node, null if no match
     */
    getNodeByProperty: function(property, value) {
        for (var i in this._nodes) {
            if (this._nodes.hasOwnProperty(i)) {
                var n = this._nodes[i];
                if ((property in n && n[property] == value) || (n.data && value == n.data[property])) {
                    return n;
                }
            }
        }

        return null;
    },

    /**
     * Returns a collection of nodes that have a matching property 
     * and value in the data object that was passed into its constructor.  
     * @method getNodesByProperty
     * @param {object} property the property to search (usually a string)
     * @param {object} value the value we want to find (usuall an int or string)
     * @return {Array} the matching collection of nodes, null if no match
     */
    getNodesByProperty: function(property, value) {
        var values = [];
        for (var i in this._nodes) {
            if (this._nodes.hasOwnProperty(i)) {
                var n = this._nodes[i];
                if ((property in n && n[property] == value) || (n.data && value == n.data[property])) {
                    values.push(n);
                }
            }
        }

        return (values.length) ? values : null;
    },

    /**
     * Returns the treeview node reference for an anscestor element
     * of the node, or null if it is not contained within any node
     * in this tree.
     * @method getNodeByElement
     * @param {HTMLElement} the element to test
     * @return {YAHOO.widget.Node} a node reference or null
     */
    getNodeByElement: function(el) {

        var p=el, m, re=/ygtv([^\d]*)(.*)/;

        do {

            if (p && p.id) {
                m = p.id.match(re);
                if (m && m[2]) {
                    return this.getNodeByIndex(m[2]);
                }
            }

            p = p.parentNode;

            if (!p || !p.tagName) {
                break;
            }

        } 
        while (p.id !== this.id && p.tagName.toLowerCase() !== "body");

        return null;
    },

    /**
     * Removes the node and its children, and optionally refreshes the 
     * branch of the tree that was affected.
     * @method removeNode
     * @param {Node} The node to remove
     * @param {boolean} autoRefresh automatically refreshes branch if true
     * @return {boolean} False is there was a problem, true otherwise.
     */
    removeNode: function(node, autoRefresh) { 

        // Don't delete the root node
        if (node.isRoot()) {
            return false;
        }

        // Get the branch that we may need to refresh
        var p = node.parent;
        if (p.parent) {
            p = p.parent;
        }

        // Delete the node and its children
        this._deleteNode(node);

        // Refresh the parent of the parent
        if (autoRefresh && p && p.childrenRendered) {
            p.refresh();
        }

        return true;
    },

    /**
     * wait until the animation is complete before deleting 
     * to avoid javascript errors
     * @method _removeChildren_animComplete
     * @param o the custom event payload
     * @private
     */
    _removeChildren_animComplete: function(o) {
        this.unsubscribe(this._removeChildren_animComplete);
        this.removeChildren(o.node);
    },

    /**
     * Deletes this nodes child collection, recursively.  Also collapses
     * the node, and resets the dynamic load flag.  The primary use for
     * this method is to purge a node and allow it to fetch its data
     * dynamically again.
     * @method removeChildren
     * @param {Node} node the node to purge
     */
    removeChildren: function(node) { 

        if (node.expanded) {
            // wait until the animation is complete before deleting to
            // avoid javascript errors
            if (this._collapseAnim) {
                this.subscribe("animComplete", 
                        this._removeChildren_animComplete, this, true);
                Widget.Node.prototype.collapse.call(node);
                return;
            }

            node.collapse();
        }

        while (node.children.length) {
            this._deleteNode(node.children[0]);
        }

        if (node.isRoot()) {
            Widget.Node.prototype.expand.call(node);
        }

        node.childrenRendered = false;
        node.dynamicLoadComplete = false;

        node.updateIcon();
    },

    /**
     * Deletes the node and recurses children
     * @method _deleteNode
     * @private
     */
    _deleteNode: function(node) { 
        // Remove all the child nodes first
        this.removeChildren(node);

        // Remove the node from the tree
        this.popNode(node);
    },

    /**
     * Removes the node from the tree, preserving the child collection 
     * to make it possible to insert the branch into another part of the 
     * tree, or another tree.
     * @method popNode
     * @param {Node} the node to remove
     */
    popNode: function(node) { 
        var p = node.parent;

        // Update the parent's collection of children
        var a = [];

        for (var i=0, len=p.children.length;i<len;++i) {
            if (p.children[i] != node) {
                a[a.length] = p.children[i];
            }
        }

        p.children = a;

        // reset the childrenRendered flag for the parent
        p.childrenRendered = false;

         // Update the sibling relationship
        if (node.previousSibling) {
            node.previousSibling.nextSibling = node.nextSibling;
        }

        if (node.nextSibling) {
            node.nextSibling.previousSibling = node.previousSibling;
        }

        node.parent = null;
        node.previousSibling = null;
        node.nextSibling = null;
        node.tree = null;

        // Update the tree's node collection 
        delete this._nodes[node.index];
    },

    /**
    * Nulls out the entire TreeView instance and related objects, removes attached
    * event listeners, and clears out DOM elements inside the container. After
    * calling this method, the instance reference should be expliclitly nulled by
    * implementer, as in myDataTable = null. Use with caution!
    *
    * @method destroy
    */
    destroy : function() {
        // Since the label editor can be separated from the main TreeView control
        // the destroy method for it might not be there.
        if (this._destroyEditor) { this._destroyEditor(); }
        var el = this.getEl();
        Event.removeListener(el,'click');
        Event.removeListener(el,'dblclick');
        Event.removeListener(el,'mouseover');
        Event.removeListener(el,'mouseout');
        Event.removeListener(el,'keydown');
        for (var i = 0 ; i < this._nodes.length; i++) {
            var node = this._nodes[i];
            if (node && node.destroy) {node.destroy(); }
        }
        el.innerHTML = '';
        this._hasEvents = false;
    },
        
            


    /**
     * TreeView instance toString
     * @method toString
     * @return {string} string representation of the tree
     */
    toString: function() {
        return "TreeView " + this.id;
    },

    /**
     * Count of nodes in tree
     * @method getNodeCount
     * @return {int} number of nodes in the tree
     */
    getNodeCount: function() {
        return this.getRoot().getNodeCount();
    },

    /**
     * Returns an object which could be used to rebuild the tree.
     * It can be passed to the tree constructor to reproduce the same tree.
     * It will return false if any node loads dynamically, regardless of whether it is loaded or not.
     * @method getTreeDefinition
     * @return {Object | false}  definition of the tree or false if any node is defined as dynamic
     */
    getTreeDefinition: function() {
        return this.getRoot().getNodeDefinition();
    },

    /**
     * Abstract method that is executed when a node is expanded
     * @method onExpand
     * @param node {Node} the node that was expanded
     * @deprecated use treeobj.subscribe("expand") instead
     */
    onExpand: function(node) { },

    /**
     * Abstract method that is executed when a node is collapsed.
     * @method onCollapse
     * @param node {Node} the node that was collapsed.
     * @deprecated use treeobj.subscribe("collapse") instead
     */
    onCollapse: function(node) { },
    
    /**
    * Sets the value of a property for all loaded nodes in the tree.
    * @method setNodesProperty
    * @param name {string} Name of the property to be set
    * @param value {any} value to be set
    * @param refresh {boolean} if present and true, it does a refresh
    */
    setNodesProperty: function(name, value, refresh) {
        this.root.setNodesProperty(name,value);
        if (refresh) {
            this.root.refresh();
        }
    },
    /**
    * Event listener to toggle node highlight.
    * Can be assigned as listener to clickEvent, dblClickEvent and enterKeyPressed.
    * It returns false to prevent the default action.
    * @method onEventToggleHighlight
    * @param oArgs {any} it takes the arguments of any of the events mentioned above
    * @return {false} Always cancels the default action for the event
    */
    onEventToggleHighlight: function (oArgs) {
        var node;
        if ('node' in oArgs && oArgs.node instanceof Widget.Node) {
            node = oArgs.node;
        } else if (oArgs instanceof Widget.Node) {
            node = oArgs;
        } else {
            return false;
        }
        node.toggleHighlight();
        return false;
    }
        

};

/* Backwards compatibility aliases */
var PROT = TV.prototype;
 /**
     * Renders the tree boilerplate and visible nodes.
     *  Alias for render
     * @method draw
     * @deprecated Use render instead
     */
PROT.draw = PROT.render;

/* end backwards compatibility aliases */

YAHOO.augment(TV, YAHOO.util.EventProvider);

/**
 * Running count of all nodes created in all trees.  This is 
 * used to provide unique identifies for all nodes.  Deleting
 * nodes does not change the nodeCount.
 * @property YAHOO.widget.TreeView.nodeCount
 * @type int
 * @static
 */
TV.nodeCount = 0;

/**
 * Global cache of tree instances
 * @property YAHOO.widget.TreeView.trees
 * @type Array
 * @static
 * @private
 */
TV.trees = [];

/**
 * Global method for getting a tree by its id.  Used in the generated
 * tree html.
 * @method YAHOO.widget.TreeView.getTree
 * @param treeId {String} the id of the tree instance
 * @return {TreeView} the tree instance requested, null if not found.
 * @static
 */
TV.getTree = function(treeId) {
    var t = TV.trees[treeId];
    return (t) ? t : null;
};


/**
 * Global method for getting a node by its id.  Used in the generated
 * tree html.
 * @method YAHOO.widget.TreeView.getNode
 * @param treeId {String} the id of the tree instance
 * @param nodeIndex {String} the index of the node to return
 * @return {Node} the node instance requested, null if not found
 * @static
 */
TV.getNode = function(treeId, nodeIndex) {
    var t = TV.getTree(treeId);
    return (t) ? t.getNodeByIndex(nodeIndex) : null;
};


/**
     * Class name assigned to elements that have the focus
     *
     * @property TreeView.FOCUS_CLASS_NAME
     * @type String
     * @static
     * @final
     * @default "ygtvfocus"

    */ 
TV.FOCUS_CLASS_NAME = 'ygtvfocus';

/**
 * Attempts to preload the images defined in the styles used to draw the tree by
 * rendering off-screen elements that use the styles.
 * @method YAHOO.widget.TreeView.preload
 * @param {string} prefix the prefix to use to generate the names of the
 * images to preload, default is ygtv
 * @static
 */
TV.preload = function(e, prefix) {
    prefix = prefix || "ygtv";


    var styles = ["tn","tm","tmh","tp","tph","ln","lm","lmh","lp","lph","loading"];
    // var styles = ["tp"];

    var sb = [];
    
    // save the first one for the outer container
    for (var i=1; i < styles.length; i=i+1) { 
        sb[sb.length] = '<span class="' + prefix + styles[i] + '">&#160;</span>';
    }

    var f = document.createElement("div");
    var s = f.style;
    s.className = prefix + styles[0];
    s.position = "absolute";
    s.height = "1px";
    s.width = "1px";
    s.top = "-1000px";
    s.left = "-1000px";
    f.innerHTML = sb.join("");

    document.body.appendChild(f);

    Event.removeListener(window, "load", TV.preload);

};

Event.addListener(window,"load", TV.preload);
})();
(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang,
        Event = YAHOO.util.Event;
/**
 * The base class for all tree nodes.  The node's presentation and behavior in
 * response to mouse events is handled in Node subclasses.
 * @namespace YAHOO.widget
 * @class Node
 * @uses YAHOO.util.EventProvider
 * @param oData {object} a string or object containing the data that will
 * be used to render this node, and any custom attributes that should be
 * stored with the node (which is available in noderef.data).
 * All values in oData will be used to set equally named properties in the node
 * as long as the node does have such properties, they are not undefined, private or functions,
 * the rest of the values will be stored in noderef.data
 * @param oParent {Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state (deprecated, use oData.expanded)
 * @constructor
 */
YAHOO.widget.Node = function(oData, oParent, expanded) {
    if (oData) { this.init(oData, oParent, expanded); }
};

YAHOO.widget.Node.prototype = {

    /**
     * The index for this instance obtained from global counter in YAHOO.widget.TreeView.
     * @property index
     * @type int
     */
    index: 0,

    /**
     * This node's child node collection.
     * @property children
     * @type Node[] 
     */
    children: null,

    /**
     * Tree instance this node is part of
     * @property tree
     * @type TreeView
     */
    tree: null,

    /**
     * The data linked to this node.  This can be any object or primitive
     * value, and the data can be used in getNodeHtml().
     * @property data
     * @type object
     */
    data: null,

    /**
     * Parent node
     * @property parent
     * @type Node
     */
    parent: null,

    /**
     * The depth of this node.  We start at -1 for the root node.
     * @property depth
     * @type int
     */
    depth: -1,

    /**
     * The node's expanded/collapsed state
     * @property expanded
     * @type boolean
     */
    expanded: false,

    /**
     * Can multiple children be expanded at once?
     * @property multiExpand
     * @type boolean
     */
    multiExpand: true,

    /**
     * Should we render children for a collapsed node?  It is possible that the
     * implementer will want to render the hidden data...  @todo verify that we 
     * need this, and implement it if we do.
     * @property renderHidden
     * @type boolean
     */
    renderHidden: false,

    /**
     * This flag is set to true when the html is generated for this node's
     * children, and set to false when new children are added.
     * @property childrenRendered
     * @type boolean
     */
    childrenRendered: false,

    /**
     * Dynamically loaded nodes only fetch the data the first time they are
     * expanded.  This flag is set to true once the data has been fetched.
     * @property dynamicLoadComplete
     * @type boolean
     */
    dynamicLoadComplete: false,

    /**
     * This node's previous sibling
     * @property previousSibling
     * @type Node
     */
    previousSibling: null,

    /**
     * This node's next sibling
     * @property nextSibling
     * @type Node
     */
    nextSibling: null,

    /**
     * We can set the node up to call an external method to get the child
     * data dynamically.
     * @property _dynLoad
     * @type boolean
     * @private
     */
    _dynLoad: false,

    /**
     * Function to execute when we need to get this node's child data.
     * @property dataLoader
     * @type function
     */
    dataLoader: null,

    /**
     * This is true for dynamically loading nodes while waiting for the
     * callback to return.
     * @property isLoading
     * @type boolean
     */
    isLoading: false,

    /**
     * The toggle/branch icon will not show if this is set to false.  This
     * could be useful if the implementer wants to have the child contain
     * extra info about the parent, rather than an actual node.
     * @property hasIcon
     * @type boolean
     */
    hasIcon: true,

    /**
     * Used to configure what happens when a dynamic load node is expanded
     * and we discover that it does not have children.  By default, it is
     * treated as if it still could have children (plus/minus icon).  Set
     * iconMode to have it display like a leaf node instead.
     * @property iconMode
     * @type int
     */
    iconMode: 0,

    /**
     * Specifies whether or not the content area of the node should be allowed
     * to wrap.
     * @property nowrap
     * @type boolean
     * @default false
     */
    nowrap: false,

 /**
     * If true, the node will alway be rendered as a leaf node.  This can be
     * used to override the presentation when dynamically loading the entire
     * tree.  Setting this to true also disables the dynamic load call for the
     * node.
     * @property isLeaf
     * @type boolean
     * @default false
     */
    isLeaf: false,

/**
     * The CSS class for the html content container.  Defaults to ygtvhtml, but 
     * can be overridden to provide a custom presentation for a specific node.
     * @property contentStyle
     * @type string
     */
    contentStyle: "",


    /**
     * The generated id that will contain the data passed in by the implementer.
     * @property contentElId
     * @type string
     */
    contentElId: null,
    
/** 
 * Enables node highlighting.  If true, the node can be highlighted and/or propagate highlighting
 * @property enableHighlight
 * @type boolean
 * @default true
 */
    enableHighlight: false,
    
/** 
 * Stores the highlight state.  Can be any of:
 * <ul>
 * <li>0 - not highlighted</li>
 * <li>1 - highlighted</li>
 * <li>2 - some children highlighted</li>
 * </ul>
 * @property highlightState
 * @type integer
 * @default 0
 */
 
 highlightState: 0,
 
 /**
 * Tells whether highlighting will be propagated up to the parents of the clicked node
 * @property propagateHighlightUp
 * @type boolean
 * @default false
 */
 
 propagateHighlightUp: false,
 
 /**
 * Tells whether highlighting will be propagated down to the children of the clicked node
 * @property propagateHighlightDown
 * @type boolean
 * @default false
 */
 
 propagateHighlightDown: false,
 
 /**
  * User-defined className to be added to the Node
  * @property className
  * @type string
  * @default null
  */
 
 className: null,
 
 /**
     * The node type
     * @property _type
     * @private
     * @type string
     * @default "Node"
*/
    _type: "Node",

    /*
    spacerPath: "http://us.i1.yimg.com/us.yimg.com/i/space.gif",
    expandedText: "Expanded",
    collapsedText: "Collapsed",
    loadingText: "Loading",
    */

    /**
     * Initializes this node, gets some of the properties from the parent
     * @method init
     * @param oData {object} a string or object containing the data that will
     * be used to render this node
     * @param oParent {Node} this node's parent node
     * @param expanded {boolean} the initial expanded/collapsed state
     */
    init: function(oData, oParent, expanded) {

        this.data = {};
        this.children   = [];
        this.index      = YAHOO.widget.TreeView.nodeCount;
        ++YAHOO.widget.TreeView.nodeCount;
        this.contentElId = "ygtvcontentel" + this.index;
        
        if (Lang.isObject(oData)) {
            for (var property in oData) {
                if (oData.hasOwnProperty(property)) {
                    if (property.charAt(0) != '_'  && !Lang.isUndefined(this[property]) && !Lang.isFunction(this[property]) ) {
                        this[property] = oData[property];
                    } else {
                        this.data[property] = oData[property];
                    }
                }
            }
        }
        if (!Lang.isUndefined(expanded) ) { this.expanded  = expanded;  }
        

        /**
         * The parentChange event is fired when a parent element is applied
         * to the node.  This is useful if you need to apply tree-level
         * properties to a tree that need to happen if a node is moved from
         * one tree to another.
         *
         * @event parentChange
         * @type CustomEvent
         */
        this.createEvent("parentChange", this);

        // oParent should never be null except when we create the root node.
        if (oParent) {
            oParent.appendChild(this);
        }
    },

    /**
     * Certain properties for the node cannot be set until the parent
     * is known. This is called after the node is inserted into a tree.
     * the parent is also applied to this node's children in order to
     * make it possible to move a branch from one tree to another.
     * @method applyParent
     * @param {Node} parentNode this node's parent node
     * @return {boolean} true if the application was successful
     */
    applyParent: function(parentNode) {
        if (!parentNode) {
            return false;
        }

        this.tree   = parentNode.tree;
        this.parent = parentNode;
        this.depth  = parentNode.depth + 1;

        // @todo why was this put here.  This causes new nodes added at the
        // root level to lose the menu behavior.
        // if (! this.multiExpand) {
            // this.multiExpand = parentNode.multiExpand;
        // }

        this.tree.regNode(this);
        parentNode.childrenRendered = false;

        // cascade update existing children
        for (var i=0, len=this.children.length;i<len;++i) {
            this.children[i].applyParent(this);
        }

        this.fireEvent("parentChange");

        return true;
    },

    /**
     * Appends a node to the child collection.
     * @method appendChild
     * @param childNode {Node} the new node
     * @return {Node} the child node
     * @private
     */
    appendChild: function(childNode) {
        if (this.hasChildren()) {
            var sib = this.children[this.children.length - 1];
            sib.nextSibling = childNode;
            childNode.previousSibling = sib;
        }
        this.children[this.children.length] = childNode;
        childNode.applyParent(this);

        // part of the IE display issue workaround. If child nodes
        // are added after the initial render, and the node was
        // instantiated with expanded = true, we need to show the
        // children div now that the node has a child.
        if (this.childrenRendered && this.expanded) {
            this.getChildrenEl().style.display = "";
        }

        return childNode;
    },

    /**
     * Appends this node to the supplied node's child collection
     * @method appendTo
     * @param parentNode {Node} the node to append to.
     * @return {Node} The appended node
     */
    appendTo: function(parentNode) {
        return parentNode.appendChild(this);
    },

    /**
    * Inserts this node before this supplied node
    * @method insertBefore
    * @param node {Node} the node to insert this node before
    * @return {Node} the inserted node
    */
    insertBefore: function(node) {
        var p = node.parent;
        if (p) {

            if (this.tree) {
                this.tree.popNode(this);
            }

            var refIndex = node.isChildOf(p);
            p.children.splice(refIndex, 0, this);
            if (node.previousSibling) {
                node.previousSibling.nextSibling = this;
            }
            this.previousSibling = node.previousSibling;
            this.nextSibling = node;
            node.previousSibling = this;

            this.applyParent(p);
        }

        return this;
    },
 
    /**
    * Inserts this node after the supplied node
    * @method insertAfter
    * @param node {Node} the node to insert after
    * @return {Node} the inserted node
    */
    insertAfter: function(node) {
        var p = node.parent;
        if (p) {

            if (this.tree) {
                this.tree.popNode(this);
            }

            var refIndex = node.isChildOf(p);

            if (!node.nextSibling) {
                this.nextSibling = null;
                return this.appendTo(p);
            }

            p.children.splice(refIndex + 1, 0, this);

            node.nextSibling.previousSibling = this;
            this.previousSibling = node;
            this.nextSibling = node.nextSibling;
            node.nextSibling = this;

            this.applyParent(p);
        }

        return this;
    },

    /**
    * Returns true if the Node is a child of supplied Node
    * @method isChildOf
    * @param parentNode {Node} the Node to check
    * @return {boolean} The node index if this Node is a child of 
    *                   supplied Node, else -1.
    * @private
    */
    isChildOf: function(parentNode) {
        if (parentNode && parentNode.children) {
            for (var i=0, len=parentNode.children.length; i<len ; ++i) {
                if (parentNode.children[i] === this) {
                    return i;
                }
            }
        }

        return -1;
    },

    /**
     * Returns a node array of this node's siblings, null if none.
     * @method getSiblings
     * @return Node[]
     */
    getSiblings: function() {
        var sib =  this.parent.children.slice(0);
        for (var i=0;i < sib.length && sib[i] != this;i++) {}
        sib.splice(i,1);
        if (sib.length) { return sib; }
        return null;
    },

    /**
     * Shows this node's children
     * @method showChildren
     */
    showChildren: function() {
        if (!this.tree.animateExpand(this.getChildrenEl(), this)) {
            if (this.hasChildren()) {
                this.getChildrenEl().style.display = "";
            }
        }
    },

    /**
     * Hides this node's children
     * @method hideChildren
     */
    hideChildren: function() {

        if (!this.tree.animateCollapse(this.getChildrenEl(), this)) {
            this.getChildrenEl().style.display = "none";
        }
    },

    /**
     * Returns the id for this node's container div
     * @method getElId
     * @return {string} the element id
     */
    getElId: function() {
        return "ygtv" + this.index;
    },

    /**
     * Returns the id for this node's children div
     * @method getChildrenElId
     * @return {string} the element id for this node's children div
     */
    getChildrenElId: function() {
        return "ygtvc" + this.index;
    },

    /**
     * Returns the id for this node's toggle element
     * @method getToggleElId
     * @return {string} the toggel element id
     */
    getToggleElId: function() {
        return "ygtvt" + this.index;
    },


    /*
     * Returns the id for this node's spacer image.  The spacer is positioned
     * over the toggle and provides feedback for screen readers.
     * @method getSpacerId
     * @return {string} the id for the spacer image
     */
    /*
    getSpacerId: function() {
        return "ygtvspacer" + this.index;
    }, 
    */

    /**
     * Returns this node's container html element
     * @method getEl
     * @return {HTMLElement} the container html element
     */
    getEl: function() {
        return Dom.get(this.getElId());
    },

    /**
     * Returns the div that was generated for this node's children
     * @method getChildrenEl
     * @return {HTMLElement} this node's children div
     */
    getChildrenEl: function() {
        return Dom.get(this.getChildrenElId());
    },

    /**
     * Returns the element that is being used for this node's toggle.
     * @method getToggleEl
     * @return {HTMLElement} this node's toggle html element
     */
    getToggleEl: function() {
        return Dom.get(this.getToggleElId());
    },
    /**
    * Returns the outer html element for this node's content
    * @method getContentEl
    * @return {HTMLElement} the element
    */
    getContentEl: function() { 
        return Dom.get(this.contentElId);
    },


    /*
     * Returns the element that is being used for this node's spacer.
     * @method getSpacer
     * @return {HTMLElement} this node's spacer html element
     */
    /*
    getSpacer: function() {
        return document.getElementById( this.getSpacerId() ) || {};
    },
    */

    /*
    getStateText: function() {
        if (this.isLoading) {
            return this.loadingText;
        } else if (this.hasChildren(true)) {
            if (this.expanded) {
                return this.expandedText;
            } else {
                return this.collapsedText;
            }
        } else {
            return "";
        }
    },
    */

  /**
     * Hides this nodes children (creating them if necessary), changes the toggle style.
     * @method collapse
     */
    collapse: function() {
        // Only collapse if currently expanded
        if (!this.expanded) { return; }

        // fire the collapse event handler
        var ret = this.tree.onCollapse(this);

        if (false === ret) {
            return;
        }

        ret = this.tree.fireEvent("collapse", this);

        if (false === ret) {
            return;
        }


        if (!this.getEl()) {
            this.expanded = false;
        } else {
            // hide the child div
            this.hideChildren();
            this.expanded = false;

            this.updateIcon();
        }

        // this.getSpacer().title = this.getStateText();

        ret = this.tree.fireEvent("collapseComplete", this);

    },

    /**
     * Shows this nodes children (creating them if necessary), changes the
     * toggle style, and collapses its siblings if multiExpand is not set.
     * @method expand
     */
    expand: function(lazySource) {
        // Only expand if currently collapsed.
        if (this.expanded && !lazySource) { 
            return; 
        }

        var ret = true;

        // When returning from the lazy load handler, expand is called again
        // in order to render the new children.  The "expand" event already
        // fired before fething the new data, so we need to skip it now.
        if (!lazySource) {
            // fire the expand event handler
            ret = this.tree.onExpand(this);

            if (false === ret) {
                return;
            }
            
            ret = this.tree.fireEvent("expand", this);
        }

        if (false === ret) {
            return;
        }

        if (!this.getEl()) {
            this.expanded = true;
            return;
        }

        if (!this.childrenRendered) {
            this.getChildrenEl().innerHTML = this.renderChildren();
        } else {
        }

        this.expanded = true;

        this.updateIcon();

        // this.getSpacer().title = this.getStateText();

        // We do an extra check for children here because the lazy
        // load feature can expose nodes that have no children.

        // if (!this.hasChildren()) {
        if (this.isLoading) {
            this.expanded = false;
            return;
        }

        if (! this.multiExpand) {
            var sibs = this.getSiblings();
            for (var i=0; sibs && i<sibs.length; ++i) {
                if (sibs[i] != this && sibs[i].expanded) { 
                    sibs[i].collapse(); 
                }
            }
        }

        this.showChildren();

        ret = this.tree.fireEvent("expandComplete", this);
    },

    updateIcon: function() {
        if (this.hasIcon) {
            var el = this.getToggleEl();
            if (el) {
                el.className = el.className.replace(/\bygtv(([tl][pmn]h?)|(loading))\b/gi,this.getStyle());
            }
        }
    },

    /**
     * Returns the css style name for the toggle
     * @method getStyle
     * @return {string} the css class for this node's toggle
     */
    getStyle: function() {
        if (this.isLoading) {
            return "ygtvloading";
        } else {
            // location top or bottom, middle nodes also get the top style
            var loc = (this.nextSibling) ? "t" : "l";

            // type p=plus(expand), m=minus(collapase), n=none(no children)
            var type = "n";
            if (this.hasChildren(true) || (this.isDynamic() && !this.getIconMode())) {
            // if (this.hasChildren(true)) {
                type = (this.expanded) ? "m" : "p";
            }

            return "ygtv" + loc + type;
        }
    },

    /**
     * Returns the hover style for the icon
     * @return {string} the css class hover state
     * @method getHoverStyle
     */
    getHoverStyle: function() { 
        var s = this.getStyle();
        if (this.hasChildren(true) && !this.isLoading) { 
            s += "h"; 
        }
        return s;
    },

    /**
     * Recursively expands all of this node's children.
     * @method expandAll
     */
    expandAll: function() { 
        var l = this.children.length;
        for (var i=0;i<l;++i) {
            var c = this.children[i];
            if (c.isDynamic()) {
                break;
            } else if (! c.multiExpand) {
                break;
            } else {
                c.expand();
                c.expandAll();
            }
        }
    },

    /**
     * Recursively collapses all of this node's children.
     * @method collapseAll
     */
    collapseAll: function() { 
        for (var i=0;i<this.children.length;++i) {
            this.children[i].collapse();
            this.children[i].collapseAll();
        }
    },

    /**
     * Configures this node for dynamically obtaining the child data
     * when the node is first expanded.  Calling it without the callback
     * will turn off dynamic load for the node.
     * @method setDynamicLoad
     * @param fmDataLoader {function} the function that will be used to get the data.
     * @param iconMode {int} configures the icon that is displayed when a dynamic
     * load node is expanded the first time without children.  By default, the 
     * "collapse" icon will be used.  If set to 1, the leaf node icon will be
     * displayed.
     */
    setDynamicLoad: function(fnDataLoader, iconMode) { 
        if (fnDataLoader) {
            this.dataLoader = fnDataLoader;
            this._dynLoad = true;
        } else {
            this.dataLoader = null;
            this._dynLoad = false;
        }

        if (iconMode) {
            this.iconMode = iconMode;
        }
    },

    /**
     * Evaluates if this node is the root node of the tree
     * @method isRoot
     * @return {boolean} true if this is the root node
     */
    isRoot: function() { 
        return (this == this.tree.root);
    },

    /**
     * Evaluates if this node's children should be loaded dynamically.  Looks for
     * the property both in this instance and the root node.  If the tree is
     * defined to load all children dynamically, the data callback function is
     * defined in the root node
     * @method isDynamic
     * @return {boolean} true if this node's children are to be loaded dynamically
     */
    isDynamic: function() { 
        if (this.isLeaf) {
            return false;
        } else {
            return (!this.isRoot() && (this._dynLoad || this.tree.root._dynLoad));
            // return lazy;
        }
    },

    /**
     * Returns the current icon mode.  This refers to the way childless dynamic
     * load nodes appear (this comes into play only after the initial dynamic
     * load request produced no children).
     * @method getIconMode
     * @return {int} 0 for collapse style, 1 for leaf node style
     */
    getIconMode: function() {
        return (this.iconMode || this.tree.root.iconMode);
    },

    /**
     * Checks if this node has children.  If this node is lazy-loading and the
     * children have not been rendered, we do not know whether or not there
     * are actual children.  In most cases, we need to assume that there are
     * children (for instance, the toggle needs to show the expandable 
     * presentation state).  In other times we want to know if there are rendered
     * children.  For the latter, "checkForLazyLoad" should be false.
     * @method hasChildren
     * @param checkForLazyLoad {boolean} should we check for unloaded children?
     * @return {boolean} true if this has children or if it might and we are
     * checking for this condition.
     */
    hasChildren: function(checkForLazyLoad) { 
        if (this.isLeaf) {
            return false;
        } else {
            return ( this.children.length > 0 || 
(checkForLazyLoad && this.isDynamic() && !this.dynamicLoadComplete) );
        }
    },

    /**
     * Expands if node is collapsed, collapses otherwise.
     * @method toggle
     */
    toggle: function() {
        if (!this.tree.locked && ( this.hasChildren(true) || this.isDynamic()) ) {
            if (this.expanded) { this.collapse(); } else { this.expand(); }
        }
    },

    /**
     * Returns the markup for this node and its children.
     * @method getHtml
     * @return {string} the markup for this node and its expanded children.
     */
    getHtml: function() {

        this.childrenRendered = false;

        return ['<div class="ygtvitem" id="' , this.getElId() , '">' ,this.getNodeHtml() , this.getChildrenHtml() ,'</div>'].join("");
    },

    /**
     * Called when first rendering the tree.  We always build the div that will
     * contain this nodes children, but we don't render the children themselves
     * unless this node is expanded.
     * @method getChildrenHtml
     * @return {string} the children container div html and any expanded children
     * @private
     */
    getChildrenHtml: function() {


        var sb = [];
        sb[sb.length] = '<div class="ygtvchildren" id="' + this.getChildrenElId() + '"';

        // This is a workaround for an IE rendering issue, the child div has layout
        // in IE, creating extra space if a leaf node is created with the expanded
        // property set to true.
        if (!this.expanded || !this.hasChildren()) {
            sb[sb.length] = ' style="display:none;"';
        }
        sb[sb.length] = '>';


        // Don't render the actual child node HTML unless this node is expanded.
        if ( (this.hasChildren(true) && this.expanded) ||
                (this.renderHidden && !this.isDynamic()) ) {
            sb[sb.length] = this.renderChildren();
        }

        sb[sb.length] = '</div>';

        return sb.join("");
    },

    /**
     * Generates the markup for the child nodes.  This is not done until the node
     * is expanded.
     * @method renderChildren
     * @return {string} the html for this node's children
     * @private
     */
    renderChildren: function() {


        var node = this;

        if (this.isDynamic() && !this.dynamicLoadComplete) {
            this.isLoading = true;
            this.tree.locked = true;

            if (this.dataLoader) {

                setTimeout( 
                    function() {
                        node.dataLoader(node, 
                            function() { 
                                node.loadComplete(); 
                            });
                    }, 10);
                
            } else if (this.tree.root.dataLoader) {

                setTimeout( 
                    function() {
                        node.tree.root.dataLoader(node, 
                            function() { 
                                node.loadComplete(); 
                            });
                    }, 10);

            } else {
                return "Error: data loader not found or not specified.";
            }

            return "";

        } else {
            return this.completeRender();
        }
    },

    /**
     * Called when we know we have all the child data.
     * @method completeRender
     * @return {string} children html
     */
    completeRender: function() {
        var sb = [];

        for (var i=0; i < this.children.length; ++i) {
            // this.children[i].childrenRendered = false;
            sb[sb.length] = this.children[i].getHtml();
        }
        
        this.childrenRendered = true;

        return sb.join("");
    },

    /**
     * Load complete is the callback function we pass to the data provider
     * in dynamic load situations.
     * @method loadComplete
     */
    loadComplete: function() {
        this.getChildrenEl().innerHTML = this.completeRender();
        this.dynamicLoadComplete = true;
        this.isLoading = false;
        this.expand(true);
        this.tree.locked = false;
    },

    /**
     * Returns this node's ancestor at the specified depth.
     * @method getAncestor
     * @param {int} depth the depth of the ancestor.
     * @return {Node} the ancestor
     */
    getAncestor: function(depth) {
        if (depth >= this.depth || depth < 0)  {
            return null;
        }

        var p = this.parent;
        
        while (p.depth > depth) {
            p = p.parent;
        }

        return p;
    },

    /**
     * Returns the css class for the spacer at the specified depth for
     * this node.  If this node's ancestor at the specified depth
     * has a next sibling the presentation is different than if it
     * does not have a next sibling
     * @method getDepthStyle
     * @param {int} depth the depth of the ancestor.
     * @return {string} the css class for the spacer
     */
    getDepthStyle: function(depth) {
        return (this.getAncestor(depth).nextSibling) ? 
            "ygtvdepthcell" : "ygtvblankdepthcell";
    },

    /**
     * Get the markup for the node.  This may be overrided so that we can
     * support different types of nodes.
     * @method getNodeHtml
     * @return {string} The HTML that will render this node.
     */
    getNodeHtml: function() { 
        var sb = [];

        sb[sb.length] = '<table id="ygtvtableel' + this.index + '"border="0" cellpadding="0" cellspacing="0" class="ygtvtable ygtvdepth' + this.depth;
        if (this.enableHighlight) {
            //sb[sb.length] = ' ygtv-highlight' + this.highlightState;
        }
        if (this.className) {
            sb[sb.length] = ' ' + this.className;
        }           
        sb[sb.length] = '"><tr class="ygtvrow">';
        
        for (var i=0;i<this.depth;++i) {
            sb[sb.length] = '<td class="ygtvcell ' + this.getDepthStyle(i) + '"><div class="ygtvspacer"></div></td>';
        }

        if (this.hasIcon) {
            sb[sb.length] = '<td id="' + this.getToggleElId();
            sb[sb.length] = '" class="ygtvcell ';
            sb[sb.length] = this.getStyle() ;
            sb[sb.length] = '"><a href="#" class="ygtvspacer">&nbsp;</a></td>';
        }

        sb[sb.length] = '<td id="' + this.contentElId; 
        sb[sb.length] = '" class="ygtvcell ';
        sb[sb.length] = this.contentStyle  + ' ygtvcontent" ';
        sb[sb.length] = (this.nowrap) ? ' nowrap="nowrap" ' : '';
        sb[sb.length] = ' >';
        sb[sb.length] = this.getContentHtml();
        sb[sb.length] = '</td></tr></table>';

        return sb.join("");

    },
    /**
     * Get the markup for the contents of the node.  This is designed to be overrided so that we can
     * support different types of nodes.
     * @method getContentHtml
     * @return {string} The HTML that will render the content of this node.
     */
    getContentHtml: function () {
        return "";
    },

    /**
     * Regenerates the html for this node and its children.  To be used when the
     * node is expanded and new children have been added.
     * @method refresh
     */
    refresh: function() {
        // this.loadComplete();
        this.getChildrenEl().innerHTML = this.completeRender();

        if (this.hasIcon) {
            var el = this.getToggleEl();
            if (el) {
                el.className = el.className.replace(/\bygtv[lt][nmp]h*\b/gi,this.getStyle());
            }
        }
    },

    /**
     * Node toString
     * @method toString
     * @return {string} string representation of the node
     */
    toString: function() {
        return this._type + " (" + this.index + ")";
    },
    /**
    * array of items that had the focus set on them
    * so that they can be cleaned when focus is lost
    * @property _focusHighlightedItems
    * @type Array of DOM elements
    * @private
    */
    _focusHighlightedItems: [],
    /**
    * DOM element that actually got the browser focus
    * @property _focusedItem
    * @type DOM element
    * @private
    */
    _focusedItem: null,
    
    /**
    * Returns true if there are any elements in the node that can 
    * accept the real actual browser focus
    * @method _canHaveFocus
    * @return {boolean} success
    * @private
    */
    _canHaveFocus: function() {
        return this.getEl().getElementsByTagName('a').length > 0;
    },
    /**
    * Removes the focus of previously selected Node
    * @method _removeFocus
    * @private
    */
    _removeFocus:function () {
        if (this._focusedItem) {
            Event.removeListener(this._focusedItem,'blur');
            this._focusedItem = null;
        }
        var el;
        while ((el = this._focusHighlightedItems.shift())) {  // yes, it is meant as an assignment, really
            Dom.removeClass(el,YAHOO.widget.TreeView.FOCUS_CLASS_NAME );
        }
    },
    /**
    * Sets the focus on the node element.
    * It will only be able to set the focus on nodes that have anchor elements in it.  
    * Toggle or branch icons have anchors and can be focused on.  
    * If will fail in nodes that have no anchor
    * @method focus
    * @return {boolean} success
    */
    focus: function () {
        var focused = false, self = this;

        if (this.tree.currentFocus) {
            this.tree.currentFocus._removeFocus();
        }
    
        var  expandParent = function (node) {
            if (node.parent) {
                expandParent(node.parent);
                node.parent.expand();
            } 
        };
        expandParent(this);

        Dom.getElementsBy  ( 
            function (el) {
                return /ygtv(([tl][pmn]h?)|(content))/.test(el.className);
            } ,
            'td' , 
            self.getEl().firstChild , 
            function (el) {
                Dom.addClass(el, YAHOO.widget.TreeView.FOCUS_CLASS_NAME );
                if (!focused) { 
                    var aEl = el.getElementsByTagName('a');
                    if (aEl.length) {
                        aEl = aEl[0];
                        aEl.focus();
                        self._focusedItem = aEl;
                        Event.on(aEl,'blur',function () {
                            //console.log('f1');
                            self.tree.fireEvent('focusChanged',{oldNode:self.tree.currentFocus,newNode:null});
                            self.tree.currentFocus = null;
                            self._removeFocus();
                        });
                        focused = true;
                    }
                }
                self._focusHighlightedItems.push(el);
            }
        );
        if (focused) { 
                            //console.log('f2');
            this.tree.fireEvent('focusChanged',{oldNode:this.tree.currentFocus,newNode:this});
            this.tree.currentFocus = this;
        } else {
                            //console.log('f3');
            this.tree.fireEvent('focusChanged',{oldNode:self.tree.currentFocus,newNode:null});
            this.tree.currentFocus = null;
            this._removeFocus(); 
        }
        return focused;
    },

  /**
     * Count of nodes in a branch
     * @method getNodeCount
     * @return {int} number of nodes in the branch
     */
    getNodeCount: function() {
        for (var i = 0, count = 0;i< this.children.length;i++) {
            count += this.children[i].getNodeCount();
        }
        return count + 1;
    },
    
      /**
     * Returns an object which could be used to build a tree out of this node and its children.
     * It can be passed to the tree constructor to reproduce this node as a tree.
     * It will return false if the node or any children loads dynamically, regardless of whether it is loaded or not.
     * @method getNodeDefinition
     * @return {Object | false}  definition of the tree or false if the node or any children is defined as dynamic
     */
    getNodeDefinition: function() {
    
        if (this.isDynamic()) { return false; }
        
        var def, defs = Lang.merge(this.data), children = []; 
        
        

        if (this.expanded) {defs.expanded = this.expanded; }
        if (!this.multiExpand) { defs.multiExpand = this.multiExpand; }
        if (!this.renderHidden) { defs.renderHidden = this.renderHidden; }
        if (!this.hasIcon) { defs.hasIcon = this.hasIcon; }
        if (this.nowrap) { defs.nowrap = this.nowrap; }
        if (this.className) { defs.className = this.className; }
        if (this.editable) { defs.editable = this.editable; }
        if (this.enableHighlight) { defs.enableHighlight = this.enableHighlight; }
        if (this.highlightState) { defs.highlightState = this.highlightState; }
        if (this.propagateHighlightUp) { defs.propagateHighlightUp = this.propagateHighlightUp; }
        if (this.propagateHighlightDown) { defs.propagateHighlightDown = this.propagateHighlightDown; }
        defs.type = this._type;
        
        
        
        for (var i = 0; i < this.children.length;i++) {
            def = this.children[i].getNodeDefinition();
            if (def === false) { return false;}
            children.push(def);
        }
        if (children.length) { defs.children = children; }
        return defs;
    },


    /**
     * Generates the link that will invoke this node's toggle method
     * @method getToggleLink
     * @return {string} the javascript url for toggling this node
     */
    getToggleLink: function() {
        return 'return false;';
    },
    
    /**
    * Sets the value of property for this node and all loaded descendants.  
    * Only public and defined properties can be set, not methods.  
    * Values for unknown properties will be assigned to the refNode.data object
    * @method setNodesProperty
    * @param name {string} Name of the property to be set
    * @param value {any} value to be set
    * @param refresh {boolean} if present and true, it does a refresh
    */
    setNodesProperty: function(name, value, refresh) {
        if (name.charAt(0) != '_'  && !Lang.isUndefined(this[name]) && !Lang.isFunction(this[name]) ) {
            this[name] = value;
        } else {
            this.data[name] = value;
        }
        for (var i = 0; i < this.children.length;i++) {
            this.children[i].setNodesProperty(name,value);
        }
        if (refresh) {
            this.refresh();
        }
    },
    /**
    * Toggles the highlighted state of a Node
    * @method toggleHighlight
    */
    toggleHighlight: function() {
        if (this.enableHighlight) {
            // unhighlights only if fully highligthed.  For not or partially highlighted it will highlight
            if (this.highlightState == 1) {
                this.unhighlight();
            } else {
                this.highlight();
            }
        }
    },
    
    /**
    * Turns highlighting on node.  
    * @method highlight
    * @param _silent {boolean} optional, don't fire the highlightEvent
    */
    highlight: function(_silent) {
        return;
        if (this.enableHighlight) {
            if (this.tree.singleNodeHighlight) {
                if (this.tree._currentlyHighlighted) {
                    this.tree._currentlyHighlighted.unhighlight();
                }
                this.tree._currentlyHighlighted = this;
            }
            this.highlightState = 1;
            this._setHighlightClassName();
            if (this.propagateHighlightDown) {
                for (var i = 0;i < this.children.length;i++) {
                    this.children[i].highlight(true);
                }
            }
            if (this.propagateHighlightUp) {
                if (this.parent) {
                    this.parent._childrenHighlighted();
                }
            }
            if (!_silent) {
                this.tree.fireEvent('highlightEvent',this);
            }
        }
    },
    /**
    * Turns highlighting off a node.  
    * @method unhighlight
    * @param _silent {boolean} optional, don't fire the highlightEvent
    */
    unhighlight: function(_silent) {
        if (this.enableHighlight) {
            this.highlightState = 0;
            this._setHighlightClassName();
            if (this.propagateHighlightDown) {
                for (var i = 0;i < this.children.length;i++) {
                    this.children[i].unhighlight(true);
                }
            }
            if (this.propagateHighlightUp) {
                if (this.parent) {
                    this.parent._childrenHighlighted();
                }
            }
            if (!_silent) {
                this.tree.fireEvent('highlightEvent',this);
            }
        }
    },
    /** 
    * Checks whether all or part of the children of a node are highlighted and
    * sets the node highlight to full, none or partial highlight.
    * If set to propagate it will further call the parent
    * @method _childrenHighlighted
    * @private
    */
    _childrenHighlighted: function() {
        var yes = false, no = false;
        if (this.enableHighlight) {
            for (var i = 0;i < this.children.length;i++) {
                switch(this.children[i].highlightState) {
                    case 0:
                        no = true;
                        break;
                    case 1:
                        yes = true;
                        break;
                    case 2:
                        yes = no = true;
                        break;
                }
            }
            if (yes && no) {
                this.highlightState = 2;
            } else if (yes) {
                this.highlightState = 1;
            } else {
                this.highlightState = 0;
            }
            this._setHighlightClassName();
            if (this.propagateHighlightUp) {
                if (this.parent) {
                    this.parent._childrenHighlighted();
                }
            }
        }
    },
    
    /**
    * Changes the classNames on the toggle and content containers to reflect the current highlighting
    * @method _setHighlightClassName
    * @private
    */
    _setHighlightClassName: function() {
        var el = Dom.get('ygtvtableel' + this.index);
        if (el) {
            el.className = el.className.replace(/\bygtv-highlight\d\b/gi,'ygtv-highlight' + this.highlightState);
        }
    }
    
};

YAHOO.augment(YAHOO.widget.Node, YAHOO.util.EventProvider);
})();
/**
 * A custom YAHOO.widget.Node that handles the unique nature of 
 * the virtual, presentationless root node.
 * @namespace YAHOO.widget
 * @class RootNode
 * @extends YAHOO.widget.Node
 * @param oTree {YAHOO.widget.TreeView} The tree instance this node belongs to
 * @constructor
 */
YAHOO.widget.RootNode = function(oTree) {
    // Initialize the node with null params.  The root node is a
    // special case where the node has no presentation.  So we have
    // to alter the standard properties a bit.
    this.init(null, null, true);
    
    /*
     * For the root node, we get the tree reference from as a param
     * to the constructor instead of from the parent element.
     */
    this.tree = oTree;
};

YAHOO.extend(YAHOO.widget.RootNode, YAHOO.widget.Node, {
    
   /**
     * The node type
     * @property _type
      * @type string
     * @private
     * @default "RootNode"
     */
    _type: "RootNode",
    
    // overrides YAHOO.widget.Node
    getNodeHtml: function() { 
        return ""; 
    },

    toString: function() { 
        return this._type;
    },

    loadComplete: function() { 
        this.tree.draw();
    },
    
   /**
     * Count of nodes in tree.  
    * It overrides Nodes.getNodeCount because the root node should not be counted.
     * @method getNodeCount
     * @return {int} number of nodes in the tree
     */
    getNodeCount: function() {
        for (var i = 0, count = 0;i< this.children.length;i++) {
            count += this.children[i].getNodeCount();
        }
        return count;
    },

  /**
     * Returns an object which could be used to build a tree out of this node and its children.
     * It can be passed to the tree constructor to reproduce this node as a tree.
     * Since the RootNode is automatically created by treeView, 
     * its own definition is excluded from the returned node definition
     * which only contains its children.
     * @method getNodeDefinition
     * @return {Object | false}  definition of the tree or false if any child node is defined as dynamic
     */
    getNodeDefinition: function() {
        
        for (var def, defs = [], i = 0; i < this.children.length;i++) {
            def = this.children[i].getNodeDefinition();
            if (def === false) { return false;}
            defs.push(def);
        }
        return defs;
    },

    collapse: function() {},
    expand: function() {},
    getSiblings: function() { return null; },
    focus: function () {}

});
(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang,
        Event = YAHOO.util.Event;
/**
 * The default node presentation.  The first parameter should be
 * either a string that will be used as the node's label, or an object
 * that has at least a string property called label.  By default,  clicking the
 * label will toggle the expanded/collapsed state of the node.  By
 * setting the href property of the instance, this behavior can be
 * changed so that the label will go to the specified href.
 * @namespace YAHOO.widget
 * @class TextNode
 * @extends YAHOO.widget.Node
 * @constructor
 * @param oData {object} a string or object containing the data that will
 * be used to render this node.
 * Providing a string is the same as providing an object with a single property named label.
 * All values in the oData will be used to set equally named properties in the node
 * as long as the node does have such properties, they are not undefined, private or functions.
 * All attributes are made available in noderef.data, which
 * can be used to store custom attributes.  TreeView.getNode(s)ByProperty
 * can be used to retrieve a node by one of the attributes.
 * @param oParent {YAHOO.widget.Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state (deprecated; use oData.expanded) 
 */
YAHOO.widget.TextNode = function(oData, oParent, expanded) {

    if (oData) { 
        if (Lang.isString(oData)) {
            oData = { label: oData };
        }
        this.init(oData, oParent, expanded);
        this.setUpLabel(oData);
    }

};

YAHOO.extend(YAHOO.widget.TextNode, YAHOO.widget.Node, {
    
    /**
     * The CSS class for the label href.  Defaults to ygtvlabel, but can be
     * overridden to provide a custom presentation for a specific node.
     * @property labelStyle
     * @type string
     */
    labelStyle: "ygtvlabel",

    /**
     * The derived element id of the label for this node
     * @property labelElId
     * @type string
     */
    labelElId: null,

    /**
     * The text for the label.  It is assumed that the oData parameter will
     * either be a string that will be used as the label, or an object that
     * has a property called "label" that we will use.
     * @property label
     * @type string
     */
    label: null,

    /**
     * The text for the title (tooltip) for the label element
     * @property title
     * @type string
     */
    title: null,
    
    /**
     * The href for the node's label.  If one is not specified, the href will
     * be set so that it toggles the node.
     * @property href
     * @type string
     */
    href: null,

    /**
     * The label href target, defaults to current window
     * @property target
     * @type string
     */
    target: "_self",
    
    /**
     * The node type
     * @property _type
     * @private
     * @type string
     * @default "TextNode"
     */
    _type: "TextNode",


    /**
     * Sets up the node label
     * @method setUpLabel
     * @param oData string containing the label, or an object with a label property
     */
    setUpLabel: function(oData) { 
        
        if (Lang.isString(oData)) {
            oData = { 
                label: oData 
            };
        } else {
            if (oData.style) {
                this.labelStyle = oData.style;
            }
        }

        this.label = oData.label;

        this.labelElId = "ygtvlabelel" + this.index;
        
    },

    /**
     * Returns the label element
     * @for YAHOO.widget.TextNode
     * @method getLabelEl
     * @return {object} the element
     */
    getLabelEl: function() { 
        return Dom.get(this.labelElId);
    },

    // overrides YAHOO.widget.Node
    getContentHtml: function() { 
        var sb = [];
        sb[sb.length] = this.href?'<a':'<span';
        sb[sb.length] = ' id="' + this.labelElId + '"';
        sb[sb.length] = ' class="' + this.labelStyle  + '"';
        if (this.href) {
            sb[sb.length] = ' href="' + this.href + '"';
            sb[sb.length] = ' target="' + this.target + '"';
        } 
        if (this.title) {
            sb[sb.length] = ' title="' + this.title + '"';
        }
        sb[sb.length] = ' >';
        sb[sb.length] = this.label;
        sb[sb.length] = this.href?'</a>':'</span>';
        return sb.join("");
    },



  /**
     * Returns an object which could be used to build a tree out of this node and its children.
     * It can be passed to the tree constructor to reproduce this node as a tree.
     * It will return false if the node or any descendant loads dynamically, regardless of whether it is loaded or not.
     * @method getNodeDefinition
     * @return {Object | false}  definition of the tree or false if this node or any descendant is defined as dynamic
     */
    getNodeDefinition: function() {
        var def = YAHOO.widget.TextNode.superclass.getNodeDefinition.call(this);
        if (def === false) { return false; }

        // Node specific properties
        def.label = this.label;
        if (this.labelStyle != 'ygtvlabel') { def.style = this.labelStyle; }
        if (this.title) { def.title = this.title; }
        if (this.href) { def.href = this.href; }
        if (this.target != '_self') { def.target = this.target; }       

        return def;
    
    },

    toString: function() { 
        return YAHOO.widget.TextNode.superclass.toString.call(this) + ": " + this.label;
    },

    // deprecated
    onLabelClick: function() {
        return false;
    },
    refresh: function() {
        YAHOO.widget.TextNode.superclass.refresh.call(this);
        var label = this.getLabelEl();
        label.innerHTML = this.label;
        if (label.tagName.toUpperCase() == 'A') {
            label.href = this.href;
            label.target = this.target;
        }
    }
        
    

    
});
})();
/**
 * A menu-specific implementation that differs from TextNode in that only 
 * one sibling can be expanded at a time.
 * @namespace YAHOO.widget
 * @class MenuNode
 * @extends YAHOO.widget.TextNode
 * @param oData {object} a string or object containing the data that will
 * be used to render this node.
 * Providing a string is the same as providing an object with a single property named label.
 * All values in the oData will be used to set equally named properties in the node
 * as long as the node does have such properties, they are not undefined, private or functions.
 * All attributes are made available in noderef.data, which
 * can be used to store custom attributes.  TreeView.getNode(s)ByProperty
 * can be used to retrieve a node by one of the attributes.
 * @param oParent {YAHOO.widget.Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state (deprecated; use oData.expanded) 
 * @constructor
 */
YAHOO.widget.MenuNode = function(oData, oParent, expanded) {
    YAHOO.widget.MenuNode.superclass.constructor.call(this,oData,oParent,expanded);

   /*
     * Menus usually allow only one branch to be open at a time.
     */
    this.multiExpand = false;

};

YAHOO.extend(YAHOO.widget.MenuNode, YAHOO.widget.TextNode, {

    /**
     * The node type
     * @property _type
     * @private
    * @default "MenuNode"
     */
    _type: "MenuNode"

});
(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang,
        Event = YAHOO.util.Event;

/**
 * This implementation takes either a string or object for the
 * oData argument.  If is it a string, it will use it for the display
 * of this node (and it can contain any html code).  If the parameter
 * is an object,it looks for a parameter called "html" that will be
 * used for this node's display.
 * @namespace YAHOO.widget
 * @class HTMLNode
 * @extends YAHOO.widget.Node
 * @constructor
 * @param oData {object} a string or object containing the data that will
 * be used to render this node.  
 * Providing a string is the same as providing an object with a single property named html.
 * All values in the oData will be used to set equally named properties in the node
 * as long as the node does have such properties, they are not undefined, private or functions.
 * All other attributes are made available in noderef.data, which
 * can be used to store custom attributes.  TreeView.getNode(s)ByProperty
 * can be used to retrieve a node by one of the attributes.
 * @param oParent {YAHOO.widget.Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state (deprecated; use oData.expanded) 
 * @param hasIcon {boolean} specifies whether or not leaf nodes should
 * be rendered with or without a horizontal line line and/or toggle icon. If the icon
 * is not displayed, the content fills the space it would have occupied.
 * This option operates independently of the leaf node presentation logic
 * for dynamic nodes.
 * (deprecated; use oData.hasIcon) 
 */
YAHOO.widget.HTMLNode = function(oData, oParent, expanded, hasIcon) {
    if (oData) { 
        this.init(oData, oParent, expanded);
        this.initContent(oData, hasIcon);
    }
};

YAHOO.extend(YAHOO.widget.HTMLNode, YAHOO.widget.Node, {

    /**
     * The CSS class for the html content container.  Defaults to ygtvhtml, but 
     * can be overridden to provide a custom presentation for a specific node.
     * @property contentStyle
     * @type string
     */
    contentStyle: "ygtvhtml",


    /**
     * The HTML content to use for this node's display
     * @property html
     * @type string
     */
    html: null,
    
/**
     * The node type
     * @property _type
     * @private
     * @type string
     * @default "HTMLNode"
     */
    _type: "HTMLNode",

    /**
     * Sets up the node label
     * @property initContent
     * @param oData {object} An html string or object containing an html property
     * @param hasIcon {boolean} determines if the node will be rendered with an
     * icon or not
     */
    initContent: function(oData, hasIcon) { 
        this.setHtml(oData);
        this.contentElId = "ygtvcontentel" + this.index;
        if (!Lang.isUndefined(hasIcon)) { this.hasIcon  = hasIcon; }
        
    },

    /**
     * Synchronizes the node.data, node.html, and the node's content
     * @property setHtml
     * @param o {object} An html string or object containing an html property
     */
    setHtml: function(o) {

        this.html = (typeof o === "string") ? o : o.html;

        var el = this.getContentEl();
        if (el) {
            el.innerHTML = this.html;
        }

    },

    // overrides YAHOO.widget.Node
    getContentHtml: function() { 
        return this.html;
    },
    
      /**
     * Returns an object which could be used to build a tree out of this node and its children.
     * It can be passed to the tree constructor to reproduce this node as a tree.
     * It will return false if any node loads dynamically, regardless of whether it is loaded or not.
     * @method getNodeDefinition
     * @return {Object | false}  definition of the tree or false if any node is defined as dynamic
     */
    getNodeDefinition: function() {
        var def = YAHOO.widget.HTMLNode.superclass.getNodeDefinition.call(this);
        if (def === false) { return false; }
        def.html = this.html;
        return def;
    
    }
});
})();
(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang,
        Event = YAHOO.util.Event,
        Calendar = YAHOO.widget.Calendar;
        
/**
 * A Date-specific implementation that differs from TextNode in that it uses 
 * YAHOO.widget.Calendar as an in-line editor, if available
 * If Calendar is not available, it behaves as a plain TextNode.
 * @namespace YAHOO.widget
 * @class DateNode
 * @extends YAHOO.widget.TextNode
 * @param oData {object} a string or object containing the data that will
 * be used to render this node.
 * Providing a string is the same as providing an object with a single property named label.
 * All values in the oData will be used to set equally named properties in the node
 * as long as the node does have such properties, they are not undefined, private nor functions.
 * All attributes are made available in noderef.data, which
 * can be used to store custom attributes.  TreeView.getNode(s)ByProperty
 * can be used to retrieve a node by one of the attributes.
 * @param oParent {YAHOO.widget.Node} this node's parent node
 * @param expanded {boolean} the initial expanded/collapsed state (deprecated; use oData.expanded) 
 * @constructor
 */
YAHOO.widget.DateNode = function(oData, oParent, expanded) {
    YAHOO.widget.DateNode.superclass.constructor.call(this,oData, oParent, expanded);
};

YAHOO.extend(YAHOO.widget.DateNode, YAHOO.widget.TextNode, {

    /**
     * The node type
     * @property _type
     * @type string
     * @private
     * @default  "DateNode"
     */
    _type: "DateNode",
    
    /**
    * Configuration object for the Calendar editor, if used.
    * See <a href="http://developer.yahoo.com/yui/calendar/#internationalization">http://developer.yahoo.com/yui/calendar/#internationalization</a>
    * @property calendarConfig
    */
    calendarConfig: null,
    
    
    
    /** 
     *  If YAHOO.widget.Calendar is available, it will pop up a Calendar to enter a new date.  Otherwise, it falls back to a plain &lt;input&gt;  textbox
     * @method fillEditorContainer
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return void
     */
    fillEditorContainer: function (editorData) {
    
        var cal, container = editorData.inputContainer;
        
        if (Lang.isUndefined(Calendar)) {
            Dom.replaceClass(editorData.editorPanel,'ygtv-edit-DateNode','ygtv-edit-TextNode');
            YAHOO.widget.DateNode.superclass.fillEditorContainer.call(this, editorData);
            return;
        }
            
        if (editorData.nodeType != this._type) {
            editorData.nodeType = this._type;
            editorData.saveOnEnter = false;
            
            editorData.node.destroyEditorContents(editorData);

            editorData.inputObject = cal = new Calendar(container.appendChild(document.createElement('div')));
            if (this.calendarConfig) { 
                cal.cfg.applyConfig(this.calendarConfig,true); 
                cal.cfg.fireQueue();
            }
            cal.selectEvent.subscribe(function () {
                this.tree._closeEditor(true);
            },this,true);
        } else {
            cal = editorData.inputObject;
        }

        cal.cfg.setProperty("selected",this.label, false); 

        var delim = cal.cfg.getProperty('DATE_FIELD_DELIMITER');
        var pageDate = this.label.split(delim);
        cal.cfg.setProperty('pagedate',pageDate[cal.cfg.getProperty('MDY_MONTH_POSITION') -1] + delim + pageDate[cal.cfg.getProperty('MDY_YEAR_POSITION') -1]);
        cal.cfg.fireQueue();

        cal.render();
        cal.oDomContainer.focus();
    },
    /**
    * Saves the date entered in the editor into the DateNode label property and displays it.
    * Overrides Node.saveEditorValue
    * @method saveEditorValue
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     */
    saveEditorValue: function (editorData) {
        var node = editorData.node, 
            validator = node.tree.validator,
            value;
        if (Lang.isUndefined(Calendar)) {
            value = editorData.inputElement.value;
        } else {
            var cal = editorData.inputObject,
                date = cal.getSelectedDates()[0],
                dd = [];
                
            dd[cal.cfg.getProperty('MDY_DAY_POSITION') -1] = date.getDate();
            dd[cal.cfg.getProperty('MDY_MONTH_POSITION') -1] = date.getMonth() + 1;
            dd[cal.cfg.getProperty('MDY_YEAR_POSITION') -1] = date.getFullYear();
            value = dd.join(cal.cfg.getProperty('DATE_FIELD_DELIMITER'));
        }
        if (Lang.isFunction(validator)) {
            value = validator(value,node.label,node);
            if (Lang.isUndefined(value)) { return false; }
        }

        node.label = value;
        node.getLabelEl().innerHTML = value;
    },
  /**
     * Returns an object which could be used to build a tree out of this node and its children.
     * It can be passed to the tree constructor to reproduce this node as a tree.
     * It will return false if the node or any descendant loads dynamically, regardless of whether it is loaded or not.
     * @method getNodeDefinition
     * @return {Object | false}  definition of the node or false if this node or any descendant is defined as dynamic
     */ 
    getNodeDefinition: function() {
        var def = YAHOO.widget.DateNode.superclass.getNodeDefinition.call(this);
        if (def === false) { return false; }
        if (this.calendarConfig) { def.calendarConfig = this.calendarConfig; }
        return def;
    }


});
})();
(function () {
    var Dom = YAHOO.util.Dom,
        Lang = YAHOO.lang, 
        Event = YAHOO.util.Event,
        TV = YAHOO.widget.TreeView,
        TVproto = TV.prototype;

    /**
     * An object to store information used for in-line editing
     * for all Nodes of all TreeViews. It contains:
     * <ul>
    * <li>active {boolean}, whether there is an active cell editor </li>
    * <li>whoHasIt {YAHOO.widget.TreeView} TreeView instance that is currently using the editor</li>
    * <li>nodeType {string} value of static Node._type property, allows reuse of input element if node is of the same type.</li>
    * <li>editorPanel {HTMLelement (&lt;div&gt;)} element holding the in-line editor</li>
    * <li>inputContainer {HTMLelement (&lt;div&gt;)} element which will hold the type-specific input element(s) to be filled by the fillEditorContainer method</li>
    * <li>buttonsContainer {HTMLelement (&lt;div&gt;)} element which holds the &lt;button&gt; elements for Ok/Cancel.  If you don't want any of the buttons, hide it via CSS styles, don't destroy it</li>
    * <li>node {YAHOO.widget.Node} reference to the Node being edited</li>
    * <li>saveOnEnter {boolean}, whether the Enter key should be accepted as a Save command (Esc. is always taken as Cancel), disable for multi-line input elements </li>
    * </ul>
    *  Editors are free to use this object to store additional data.
     * @property editorData
     * @static
     * @for YAHOO.widget.TreeView
     */
    TV.editorData = {
        active:false,
        whoHasIt:null, // which TreeView has it
        nodeType:null,
        editorPanel:null,
        inputContainer:null,
        buttonsContainer:null,
        node:null, // which Node is being edited
        saveOnEnter:true
        // Each node type is free to add its own properties to this as it sees fit.
    };
    
    /**
    * Validator function for edited data, called from the TreeView instance scope, 
    * receives the arguments (newValue, oldValue, nodeInstance) 
    * and returns either the validated (or type-converted) value or undefined. 
    * An undefined return will prevent the editor from closing
    * @property validator
    * @default null
     * @for YAHOO.widget.TreeView
     */
    TVproto.validator = null;
    
    /**
    * Entry point of the editing plug-in.  
    * TreeView will call this method if it exists when a node label is clicked
    * @method _nodeEditing
    * @param node {YAHOO.widget.Node} the node to be edited
    * @return {Boolean} true to indicate that the node is editable and prevent any further bubbling of the click.
     * @for YAHOO.widget.TreeView
     * @private
    */
    
    
    TVproto._nodeEditing = function (node) {
        if (node.fillEditorContainer && node.editable) {
            var ed, topLeft, buttons, button, editorData = TV.editorData;
            editorData.active = true;
            editorData.whoHasIt = this;
            if (!editorData.nodeType) {
                editorData.editorPanel = ed = document.body.appendChild(document.createElement('div'));
                Dom.addClass(ed,'ygtv-label-editor');

                buttons = editorData.buttonsContainer = ed.appendChild(document.createElement('div'));
                Dom.addClass(buttons,'ygtv-button-container');
                button = buttons.appendChild(document.createElement('button'));
                Dom.addClass(button,'ygtvok');
                button.innerHTML = ' ';
                button = buttons.appendChild(document.createElement('button'));
                Dom.addClass(button,'ygtvcancel');
                button.innerHTML = ' ';
                Event.on(buttons, 'click', function (ev) {
                    var target = Event.getTarget(ev);
                    var node = TV.editorData.node;
                    if (Dom.hasClass(target,'ygtvok')) {
                        Event.stopEvent(ev);
                        this._closeEditor(true);
                    }
                    if (Dom.hasClass(target,'ygtvcancel')) {
                        Event.stopEvent(ev);
                        this._closeEditor(false);
                    }
                }, this, true);

                editorData.inputContainer = ed.appendChild(document.createElement('div'));
                Dom.addClass(editorData.inputContainer,'ygtv-input');
                
                Event.on(ed,'keydown',function (ev) {
                    var editorData = TV.editorData,
                        KEY = YAHOO.util.KeyListener.KEY;
                    switch (ev.keyCode) {
                        case KEY.ENTER:
                            Event.stopEvent(ev);
                            if (editorData.saveOnEnter) { 
                                this._closeEditor(true);
                            }
                            break;
                        case KEY.ESCAPE:
                            Event.stopEvent(ev);
                            this._closeEditor(false);
                            break;
                    }
                },this,true);


                
            } else {
                ed = editorData.editorPanel;
            }
            editorData.node = node;
            if (editorData.nodeType) {
                Dom.removeClass(ed,'ygtv-edit-' + editorData.nodeType);
            }
            Dom.addClass(ed,' ygtv-edit-' + node._type);
            topLeft = Dom.getXY(node.getContentEl());
            Dom.setStyle(ed,'left',topLeft[0] + 'px');
            Dom.setStyle(ed,'top',topLeft[1] + 'px');
            Dom.setStyle(ed,'display','block');
            ed.focus();
            node.fillEditorContainer(editorData);

            return true;  // If inline editor available, don't do anything else.
        }
    };
    
    /**
    * Method to be associated with an event (clickEvent, dblClickEvent or enterKeyPressed) to pop up the contents editor
    *  It calls the corresponding node editNode method.
    * @method onEventEditNode
    * @param oArgs {object} Object passed as arguments to TreeView event listeners
     * @for YAHOO.widget.TreeView
    */

    TVproto.onEventEditNode = function (oArgs) {
        if (oArgs instanceof YAHOO.widget.Node) {
            oArgs.editNode();
        } else if (oArgs.node instanceof YAHOO.widget.Node) {
            oArgs.node.editNode();
        }
    };
    
    /**
    * Method to be called when the inline editing is finished and the editor is to be closed
    * @method _closeEditor
    * @param save {Boolean} true if the edited value is to be saved, false if discarded
    * @private
     * @for YAHOO.widget.TreeView
    */
    
    TVproto._closeEditor = function (save) {
        var ed = TV.editorData, 
            node = ed.node,
            close = true;
        if (save) { 
            close = ed.node.saveEditorValue(ed) !== false; 
        }
        if (close) {
            Dom.setStyle(ed.editorPanel,'display','none');  
            ed.active = false;
            node.focus();
        }
    };
    
    /**
    *  Entry point for TreeView's destroy method to destroy whatever the editing plug-in has created
    * @method _destroyEditor
    * @private
     * @for YAHOO.widget.TreeView
    */
    TVproto._destroyEditor = function() {
        var ed = TV.editorData;
        if (ed && ed.nodeType && (!ed.active || ed.whoHasIt === this)) {
            Event.removeListener(ed.editorPanel,'keydown');
            Event.removeListener(ed.buttonContainer,'click');
            ed.node.destroyEditorContents(ed);
            document.body.removeChild(ed.editorPanel);
            ed.nodeType = ed.editorPanel = ed.inputContainer = ed.buttonsContainer = ed.whoHasIt = ed.node = null;
            ed.active = false;
        }
    };
    
    var Nproto = YAHOO.widget.Node.prototype;
    
    /**
    * Signals if the label is editable.  (Ignored on TextNodes with href set.)
    * @property editable
    * @type boolean
         * @for YAHOO.widget.Node
    */
    Nproto.editable = false;
    
    /**
    * pops up the contents editor, if there is one and the node is declared editable
    * @method editNode
     * @for YAHOO.widget.Node
    */
    
    Nproto.editNode = function () {
        this.tree._nodeEditing(this);
    };
    
    


    /** Placeholder for a function that should provide the inline node label editor.
     *   Leaving it set to null will indicate that this node type is not editable.
     * It should be overridden by nodes that provide inline editing.
     *  The Node-specific editing element (input box, textarea or whatever) should be inserted into editorData.inputContainer.
     * @method fillEditorContainer
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return void
     * @for YAHOO.widget.Node
     */
    Nproto.fillEditorContainer = null;

    
    /**
    * Node-specific destroy function to empty the contents of the inline editor panel
    * This function is the worst case alternative that will purge all possible events and remove the editor contents
    * Method Event.purgeElement is somewhat costly so if it can be replaced by specifc Event.removeListeners, it is better to do so.
    * @method destroyEditorContents
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @for YAHOO.widget.Node
     */
    Nproto.destroyEditorContents = function (editorData) {
        // In the worst case, if the input editor (such as the Calendar) has no destroy method
        // we can only try to remove all possible events on it.
        Event.purgeElement(editorData.inputContainer,true);
        editorData.inputContainer.innerHTML = '';
    };

    /**
    * Saves the value entered into the editor.
    * Should be overridden by each node type
    * @method saveEditorValue
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return a return of exactly false will prevent the editor from closing
     * @for YAHOO.widget.Node
     */
    Nproto.saveEditorValue = function (editorData) {
    };
    
    var TNproto = YAHOO.widget.TextNode.prototype;
    


    /** 
     *  Places an &lt;input&gt;  textbox in the input container and loads the label text into it
     * @method fillEditorContainer
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @return void
     * @for YAHOO.widget.TextNode
     */
    TNproto.fillEditorContainer = function (editorData) {
    
        var input;
        // If last node edited is not of the same type as this one, delete it and fill it with our editor
        if (editorData.nodeType != this._type) {
            editorData.nodeType = this._type;
            editorData.saveOnEnter = true;
            editorData.node.destroyEditorContents(editorData);

            editorData.inputElement = input = editorData.inputContainer.appendChild(document.createElement('input'));
            
        } else {
            // if the last node edited was of the same time, reuse the input element.
            input = editorData.inputElement;
        }

        input.value = this.label;
        input.focus();
        input.select();
    };
    
    /**
    * Saves the value entered in the editor into the TextNode label property and displays it
    * Overrides Node.saveEditorValue
    * @method saveEditorValue
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @for YAHOO.widget.TextNode
     */
    TNproto.saveEditorValue = function (editorData) {
        var node = editorData.node, 
            value = editorData.inputElement.value,
            validator = node.tree.validator;
        
        if (Lang.isFunction(validator)) {
            value = validator(value,node.label,node);
            if (Lang.isUndefined(value)) { return false; }
        }
        node.label = value;
        node.getLabelEl().innerHTML = value;
    };

    /**
    * Destroys the contents of the inline editor panel
    * Overrides Node.destroyEditorContent
    * Since we didn't set any event listeners on this inline editor, it is more efficient to avoid the generic method in Node
    * @method destroyEditorContents
     * @param editorData {YAHOO.widget.TreeView.editorData}  a shortcut to the static object holding editing information
     * @for YAHOO.widget.TextNode
     */
    TNproto.destroyEditorContents = function (editorData) {
        editorData.inputContainer.innerHTML = '';
    };
})();
YAHOO.register("treeview", YAHOO.widget.TreeView, {version: "2.7.0", build: "1799"});

/* 
This file contains the default configuration options.  
Default options can be edited in this file or changed after the Balloon object is 
initiliazed as follows:

  var balloon = new Balloon;
  balloon.fontColor   = 'black';
  balloon.fontFamily  = 'Arial, sans-serif';
  balloon.fontSize    = '12pt';

*/

// Adds all the instance variables to the balloon object.
// Edit the values as required for your implementation.
BalloonConfig = function(balloon) {

  // ID of element to which balloon should be added
  // default = none (document.body is used)
  // This option may be required for mediawiki or other
  // implementations with complex stylesheets
  balloon.parentID = null;

  // properties of fonts contained in basic balloons (default black)
  balloon.fontColor   = 'black';
  balloon.fontFamily  = 'Arial, sans-serif';
  balloon.fontSize    = '12pt';

  // minimum allowed balloon width (px)
  balloon.minWidth = 150;

  // maximum allowed balloon width (px)
  balloon.maxWidth = 600;

  // Delay before balloon is displayed (msec)
  balloon.delayTime = 500;

  // If fade-in/out is allowed
  balloon.allowFade = false;

  // time interval for fade-in (msec)
  balloon.fadeIn    = 300;

  // time interval for fade-out (msec)
  balloon.fadeOut   = 300;  

  // Vertical Distance from cursor location (px)
  balloon.vOffset  = 0;

  // text-padding within the balloon (px)
  balloon.padding  = 10;

  // How long to display mousover balloons (msec)
  // false = 'always on'
  balloon.displayTime = 10000;

  // width of shadow (space aroung whole balloon; px)
  // Balloon can be zero if there is no shadow and the
  // edges of the balloon are also the edges of the image
  balloon.shadow   = 20;

  // images of balloon body.  If the browser is IE < 7, png alpha
  // channels will not work.  An optional alternative image can be 
  // provided.  It should have the same dimensions as the default png image
  balloon.images        = i3GEO.configura.locaplic+'/pacotes/balloon-tooltips/htdocs/images/';
  balloon.balloonImage  = 'balloon.png';    // with alpha channels
  balloon.ieImage       = 'balloon_ie.png'; // indexed color, transparent background

  // whether the balloon should have a stem
  balloon.stem          = true;

  // The height (px) of the stem and the extent to which the 
  // stem image should overlaps the balloon image.
  balloon.stemHeight  = 32;  
  balloon.stemOverlap = 3;
  
  // A stem for each of the four orientations
  balloon.upLeftStem    = 'up_left.png';
  balloon.downLeftStem  = 'down_left.png';
  balloon.upRightStem   = 'up_right.png';
  balloon.downRightStem = 'down_right.png';

  // A close button for sticky balloons
  // specify the width of your button image
  // if you do not use the default image provided
  balloon.closeButton   = 'close.png';
  balloon.closeButtonWidth = 16;


  
  /* 
    This section allows support for AJAX, iframes and JavaScript in balloons
    If you have concerns about XSS vulnerabilities, set some or all of these
    values to false;
  */

  /// URL for default AJAX request handler
  balloon.helpUrl            = false;

  // Should AJAX be allowed at all?
  balloon.allowAJAX          = true;

  // Allow iframe elements in balloons?
  balloon.allowIframes       = true;

  // Allow javascript event handlers in balloons?
  balloon.allowEventHandlers = false;

  // Allow <script> elements in balloons?
  balloon.allowScripts       = false;

  // Escape all HTML characters -- this will be very
  // unnattractive unless your AJAX request returns plain
  // text.  short of disallowing AJAX entirely, This is the safe 
  // way to go if you must have AJAX in an environment where 
  // outside users can send text to the browser/balloon
  balloon.escapeHTML         = false;
}

// simple Box alternative
BoxConfig = function(box) {
  box.isBox = true;

  // ID of element to which box should be added
  // default = none (document.body is used)
  // This option may be required for mediawiki or other
  // implementations with complex stylesheets
  box.parentID = null;

  // properties of fonts contained in basic boxes (default black)
  box.fontColor   = 'black';
  box.fontFamily  = 'Arial, sans-serif';
  box.fontSize    = '12pt';

  // border and bgcolor for plain box
  box.bgColor     = 'whitesmoke';
  box.borderStyle = '1px solid black'; 

  // minimum allowed box width (px)
  box.minWidth = 150;

  // maximum allowed box width (px)
  box.maxWidth = 600;

  // Delay before box is displayed (msec)
  box.delayTime = 500;

  // If fade-in/out is allowed
  box.allowFade = false;

  // time interval for fade-in (msec)
  box.fadeIn    = 300;

  // time interval for fade-out (msec)
  box.fadeOut   = 300;  

  // Vertical Distance from cursor location (px)
  box.vOffset  = 5;

  // text-padding within the box (px)
  box.padding  = 10;

  // How long to display mousover boxes (msec)
  // false = 'always on'
  box.displayTime = 10000;

  // no shadows for plain box
  box.shadow   = 0;

  // no stem for boxes
  box.stem        = false;

  // A close button for sticky boxes
  // specify the width of your button image
  // if you do not use the default image provided
  box.images        =  '/images/balloons';
  box.closeButton   = 'close.png';
  box.closeButtonWidth = 16;

  /* 
    This section allows support for AJAX, iframes and JavaScript in boxes
    If you have concerns about XSS vulnerabilities, set some or all of these
    values to false;
  */

  /// URL for default AJAX request handler
  box.helpUrl            = false;

  // Should AJAX be allowed at all?
  box.allowAJAX          = true;

  // Allow iframe elements in boxes?
  box.allowIframes       = true;

  // Allow javascript event handlers in boxes?
  box.allowEventHandlers = false;

  // Allow <script> elements in boxes?
  box.allowScripts       = false;

  // Escape all HTML characters -- this will be very
  // unnattractive unless your AJAX request returns plain
  // text.  short of disallowing AJAX entirely, This is the safe 
  // way to go if you must have AJAX in an environment where 
  // outside users can send text to the browser/box
  box.escapeHTML         = false;
}


/*
 balloon.js -- a DHTML library for balloon tooltips

 $Id: balloon.js,v 1.41 2008/09/23 16:33:17 sheldon_mckay Exp $

 See http://www.gmod.org/wiki/index.php/Popup_Balloons
 for documentation.

 Copyright (c) 2007,2008 Sheldon McKay, Cold Spring Harbor Laboratory

 This balloon tooltip package and associated files not otherwise copyrighted are 
 distributed under the MIT-style license:
 
 http://opensource.org/licenses/mit-license.php

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 THE SOFTWARE.

*/

// These global variables are necessary to avoid losing scope when
//setting the balloon timeout and for inter-object communication
var currentBalloonClass;
var balloonIsVisible;
var balloonIsSticky;
var balloonInvisibleSelects;
var balloonIsSuppressed;
var tooltipIsSuppressed;


//////////////////////////////////////////////////////////////////////////
// This is constructor that is called to initialize the Balloon object  //
//////////////////////////////////////////////////////////////////////////
var Balloon = function () {

  // Get default configuration from balloon.config.js
  BalloonConfig(this);

  // Track the cursor every time the mouse moves
  document.onmousemove = this.setActiveCoordinates;

  // scrolling aborts unsticky balloons
  document.onscroll    = Balloon.prototype.hideTooltip;

  // make balloons go away if the page is unloading or waiting
  // to unload.
  window.onbeforeunload = function(){
    Balloon.prototype.hideTooltip(1);
    balloonIsSuppressed = true;
  };

  // for IE, the balloons can;t start until the page is finished loading
  // set a flag that will get toggled when loading is finished
  if (this.isIE()) {
    this.suppress = true;
  }

  return this;
}

//////////////////////////////////////////////////////////////////////////
// This is the function that is called on mouseover.  It has a built-in //
// delay time to avoid balloons popping up on rapid mouseover events    //
//////////////////////////////////////////////////////////////////////////
Balloon.prototype.showTooltip = function(evt,caption,sticky,width) {
  // Awful IE bug, page load aborts if the balloon is fired
  // before the page is fully loaded.
  if (this.isIE() && document.readyState.match(/complete/i)) {
    this.suppress = false;
  }

  // All balloons have been suppressed, go no further
  if (this.suppress || balloonIsSuppressed) {
    return false;
  }

  // Non-sticky balloons suppressed
  if (tooltipIsSuppressed && !sticky) {
    return false;
  }

  // Sorry Konqueror, no fade-in for you!
  if (this.isKonqueror()) this.allowFade = false;

  // Check for mouseover (vs. mousedown or click)
  var mouseOver = true;
  try{
  var mouseOver = evt.type.match('mouseover','i');
  }catch(e){}  

  // if the firing event is a click, fade-in and a non-sticky balloon make no sense
  if (!mouseOver) {
    sticky = true;
    this.fadeOK = false;
  }
  else {
    this.fadeOK = this.allowFade;
  }

  // Don't fire on mouseover if a non-sticky balloon is visible
  if (balloonIsVisible && !balloonIsSticky && mouseOver) return false;

  // Don't start a non-sticky balloon if a sticky one is visible
  if (balloonIsVisible && balloonIsSticky && !sticky) return false;

  // Ignore repeated firing of mouseover->mouseout events on 
  // the same element (Safari)
  try{
  	var el = this.getEventTarget(evt);
  }catch(e){var el = evt;}
  if (sticky && mouseOver && this.isSameElement(el,this.currentElement)) return false;
  this.firingElement = el;

  // A new sticky balloon can erase an old one
  if (sticky) this.hideTooltip(1);

  // attach a mouseout event handler to the target element
  var closeBalloon = function() { 
 	var override = balloonIsSticky && !balloonIsVisible;
    Balloon.prototype.hideTooltip(override);
    i3GEO.janela.excluiTips();
  }
  if (!mouseOver) el.onmouseup  = function() {return false};
  el.onmouseout = closeBalloon;

  balloonIsSticky = sticky;

  // force balloon width and/or height if requested
  this.width  = width;

  this.hideTooltip();

  // request the contents synchronously (ie wait for result)
  this.currentHelpText = this.getAndCheckContents(caption);

  // no contents? abort.
  if (!this.currentHelpText) {
    return false;
  }

  // Put the balloon contents and images into a visible (but offscreen)
  // element so they will be preloaded and have a layout to 
  // calculate the balloon dimensions
  if (!this.container) {
    this.container = document.createElement('div');
    document.body.appendChild(this.container);
    this.setStyle(this.container,'position','absolute');
    this.setStyle(this.container,'top',-8888);
    this.setStyle(this.container,'display','inline');
    this.setStyle(this.container,'z-index',2);
    this.setStyle(this.container,'color',this.fontColor);
    this.setStyle(this.container,'font-family',this.fontFamily);
    this.setStyle(this.container,'font-size',this.fontSize);
  }
  else {
    this.setStyle(this.container,'display','inline');
  }

  this.container.innerHTML = unescape(this.currentHelpText);

  // make sure balloon image path is complete
  if (this.images) {
    // main background image
    this.balloonImage  = this.balloonImage  ? this.images +'/'+ this.balloonImage  : false;
    this.ieImage       = this.ieImage       ? this.images +'/'+ this.ieImage       : false;

    // optional stems
    this.upLeftStem    = this.upLeftStem    ? this.images +'/'+ this.upLeftStem    : false;
    this.upRightStem   = this.upRightStem   ? this.images +'/'+ this.upRightStem   : false;
    this.downLeftStem  = this.downLeftStem  ? this.images +'/'+ this.downLeftStem  : false;
    this.downRightStem = this.downRightStem ? this.images +'/'+ this.downRightStem : false;

    this.closeButton   = this.closeButton   ? this.images +'/'+ this.closeButton   : false;

    this.images        = false;
  }

  // if this is IE < 7 use an alternative image (if provided)
  if (this.isOldIE() && this.ieImage) {
    this.balloonImage = this.ieImage;
  }

  // preload balloon images 
  if (!this.preloadedImages) {
    var images = new Array(this.balloonImage, this.closeButton);
    if (this.ieImage) {
      images.push(this.ieImage);
    }
    if (this.stem) {
      images.push(this.upLeftStem,this.upRightStem,this.downLeftStem,this.downRightStem);
    }
    var len = images.length;
    for (var i=0;i<len;i++) {
      if ( images[i] ) {
        this.preload(images[i]);
      }
    }
    this.preloadedImages = true;
  }

  currentBalloonClass = this;

  // Capture coordinates for mousedown or click
  if (!mouseOver) this.setActiveCoordinates(evt);
this.setActiveCoordinates(evt);
  // Remember which event started this
  this.currentEvent = evt;
  this.doShowTooltip(); //

  // Make delay time short for onmousedown
  //var delay = mouseOver ? this.delayTime : 1;
  //this.timeoutTooltip = window.setTimeout(this.doShowTooltip,1);
}


// Preload the balloon background images
Balloon.prototype.preload = function(src) {
  var i = new Image;
  i.src = src;

  // append to the DOM tree so the images have a layout,
  // then remove.
  this.setStyle(i,'position','absolute');
  this.setStyle(i,'top',-8000);
  document.body.appendChild(i);
  document.body.removeChild(i);
}


/////////////////////////////////////////////////////////////////////
// Tooltip rendering function
/////////////////////////////////////////////////////////////////////
Balloon.prototype.doShowTooltip = function() {
  var self = currentBalloonClass;

  // Stop firing if a balloon is already being displayed
  if (balloonIsVisible) return false;  

  if (!self.parent) {
    if (self.parentID) {
      self.parent = document.getElementById(self.parentID);
    }
    else {
      self.parent = document.body;
    }
    self.xOffset = self.getLoc(self.parent, 'x1');
    self.yOffset = self.getLoc(self.parent, 'y1');
  }

  // a short delay time might cause some intereference
  // with fade-out
  window.clearTimeout(self.timeoutFade);
  self.setStyle('balloon','display','none');

  // make sure user-configured numbers are not strings
  self.parseIntAll();

  // create the balloon object
  var balloon = self.makeBalloon();

  // window dimensions
  var pageWidth   = YAHOO.util.Dom.getViewportWidth();
  var pageCen     = Math.round(pageWidth/2);
  var pageHeight  = YAHOO.util.Dom.getViewportHeight();
  var pageLeft    = YAHOO.util.Dom.getDocumentScrollLeft();
  var pageTop     = YAHOO.util.Dom.getDocumentScrollTop();
  var pageMid     = pageTop + Math.round(pageHeight/2);
  self.pageBottom = pageTop + pageHeight;
  self.pageTop    = pageTop;

  // do we have a cursor position?
  if (!(self.activeTop && self.activeRight)) {
    self.setActiveCoordinates();
  }
  // balloon orientation
  var vOrient = self.activeTop > pageMid ? 'up' : 'down';
  var hOrient = self.activeRight > pageCen ? 'left' : 'right';
  
  // get the preloaded balloon contents
  var helpText = self.container.innerHTML;

  self.contents.innerHTML = helpText;
  // how and where to draw the balloon
  self.setBalloonStyle(vOrient,hOrient,pageWidth,pageLeft);

  // close control for balloon or box
  if (balloonIsSticky) {
    self.addCloseButton();
  }

  balloonIsVisible = true;

  // in IE < 7, hide <select> elements
  self.showHide();

  self.fade(0,95,self.fadeIn);
}

Balloon.prototype.addCloseButton = function () {
  var self         = currentBalloonClass;
  var margin       = Math.round(self.padding/2);
  var closeWidth   = self.closeButtonWidth || 16;
  var balloonTop   = self.getLoc('balloon','y1') + margin + self.shadow;
  var BalloonLeft  = self.getLoc('topRight','x2') - self.closeButtonWidth - self.shadow - margin;
  var closeButton  = document.getElementById('closeButton');

  if (!closeButton) {
    closeButton = new Image;
    closeButton.setAttribute('id','closeButton');
    closeButton.setAttribute('src',self.closeButton);
    closeButton.onclick = function() {
      Balloon.prototype.hideTooltip(1);
      if($i("marcaIdentifica"))
	  {document.body.removeChild($i("marcaIdentifica"));}
    };
    self.setStyle(closeButton,'position','absolute');
    document.body.appendChild(closeButton);
  }

  self.setStyle(closeButton,'top',balloonTop);
  self.setStyle(closeButton,'left',BalloonLeft);
  self.setStyle(closeButton,'display','inline');
  self.setStyle(closeButton,'cursor','pointer');
  self.setStyle(closeButton,'z-index',999999999);
}

// use a fresh object every time to make sure style 
// is not polluted
Balloon.prototype.makeBalloon = function() {
  var self = currentBalloonClass;

  var balloon = document.getElementById('balloon');
  if (balloon) self.parent.removeChild(balloon);

  balloon = document.createElement('div');
  balloon.setAttribute('id','balloon');
  self.parent.appendChild(balloon);
  self.activeBalloon = balloon;

  self.parts = new Array(balloon);
  var parts = new Array('contents','topRight','bottomRight','bottomLeft');
  for (var i=0;i<parts.length;i++) {
    var child = document.createElement('div');
    child.setAttribute('id',parts[i]);
    balloon.appendChild(child);
    if (parts[i] == 'contents') self.contents = child;
    self.parts.push(child);
  }

  self.setStyle('contents','z-index',2);
  self.setStyle('contents','color',self.fontColor);
  self.setStyle('contents','font-family',self.fontFamily);
  self.setStyle('contents','font-size',self.fontSize);

  if (balloonIsSticky) {
    self.setStyle('contents','margin-right',10); 
  }
  else if (self.displayTime)  {
      self.timeoutAutoClose = window.setTimeout(this.hideTooltip,self.displayTime);
  }
  return balloon;
}


Balloon.prototype.setBalloonStyle = function(vOrient,hOrient,pageWidth,pageLeft) {
  var self = currentBalloonClass;
  var balloon = self.activeBalloon;

  if (typeof(self.shadow) != 'number') self.shadow = 0;
  if (!self.stem) self.stemHeight = 0;

  var fullPadding   = self.padding + self.shadow;
  var insidePadding = self.padding;

  self.setStyle(balloon,'background','url('+self.balloonImage+') top left no-repeat');
  self.setStyle(balloon,'position','absolute');
  self.setStyle(balloon,'padding-top',fullPadding);
  self.setStyle(balloon,'padding-left',fullPadding);
  self.setStyle(balloon,'top',-9999);
  self.setStyle(balloon,'z-index',1000000);
  

  self.setStyle('bottomRight','background','url('+self.balloonImage+') bottom right no-repeat');
  self.setStyle('bottomRight','position','absolute');
  self.setStyle('bottomRight','right',0-fullPadding);
  self.setStyle('bottomRight','bottom',0-fullPadding);
  self.setStyle('bottomRight','height',fullPadding);
  self.setStyle('bottomRight','width',fullPadding);
  self.setStyle('bottomRight','z-index',-1);

  self.setStyle('topRight','background','url('+self.balloonImage+') top right no-repeat');
  self.setStyle('topRight','position','absolute');
  self.setStyle('topRight','right',0-fullPadding);
  self.setStyle('topRight','top',0);
  self.setStyle('topRight','width',fullPadding);

  self.setStyle('bottomLeft','background','url('+self.balloonImage+') bottom left no-repeat');
  self.setStyle('bottomLeft','position','absolute');
  self.setStyle('bottomLeft','left',0);
  self.setStyle('bottomLeft','bottom',0-fullPadding);
  self.setStyle('bottomLeft','height',fullPadding);
  self.setStyle('bottomLeft','z-index',-1);

  if (this.stem) {
    var stem = document.createElement('img');
    self.setStyle(stem,'position','absolute');
    balloon.appendChild(stem);    

    if (vOrient == 'up' && hOrient == 'left') {  
      stem.src = self.upLeftStem;
      var height = self.stemHeight + insidePadding - self.stemOverlap;
      self.setStyle(stem,'bottom',0-height);
      self.setStyle(stem,'right',0);             
    }
    else if (vOrient == 'down' && hOrient == 'left') {
      stem.src = self.downLeftStem;
      var height = self.stemHeight - (self.shadow + self.stemOverlap);
      self.setStyle(stem,'top',0-height);
      self.setStyle(stem,'right',0);
    }
    else if (vOrient == 'up' && hOrient == 'right') {
      stem.src = self.upRightStem;
      var height = self.stemHeight + insidePadding - self.stemOverlap;
      self.setStyle(stem,'bottom',0-height);
      self.setStyle(stem,'left',self.shadow);
    }
    else if (vOrient == 'down' && hOrient == 'right') {
      stem.src = self.downRightStem;
      var height = self.stemHeight - (self.shadow + self.stemOverlap);
      self.setStyle(stem,'top',0-height);
      self.setStyle(stem,'left',self.shadow);
    }

  }
//
  // flip left or right, as required
  if (hOrient == 'left') {
    var activeRight = pageWidth - self.activeLeft;
    self.setStyle(balloon,'right',activeRight);// - self.xOffset);
  }
  else {
    self.setStyle(balloon,'left',self.activeRight - self.xOffset);
  }

  if (!self.width) {
    var width = self.getLoc('contents','width');
    if (self.isIE()) width += 50;
    if (width > self.maxWidth) width = self.maxWidth + 50;
    if (width < self.minWidth) width = self.minWidth;
    self.setStyle(balloon,'width',width);
  }
  else {
    self.setStyle(balloon,'width',self.width);
  }
//
  // Make sure the balloon is not offscreen
  var balloonPad   = self.padding + self.shadow;
  var balloonLeft  = self.getLoc(balloon,'x1');
  var balloonRight = self.getLoc(balloon,'x2');
  if (hOrient == 'left')  balloonLeft  += balloonPad;
  if (hOrient == 'right') balloonRight += balloonPad;
  var pageRight    = pageLeft + pageWidth;

  if (hOrient == 'right' && balloonRight > (pageRight-30)) {
    self.setStyle(balloon,'width',(pageRight - balloonLeft) - 50);
  }
  else if (hOrient == 'left' && balloonLeft < (pageLeft+30)) {
    self.setStyle(balloon,'width',(balloonRight - pageLeft) - 50);
  }

  // Set the width/height for the right and bottom outlines
  var lineWidth  = self.getLoc(balloon,'width');
  var lineHeight = self.getLoc(balloon,'height');

  self.setStyle('topRight','height',lineHeight);
  self.setStyle('bottomLeft','width',lineWidth);

//

  // IE7 quirk -- look for unwanted overlap cause by an off by 1px error
  var vOverlap = self.isOverlap('topRight','bottomRight');
  var hOverlap = self.isOverlap('bottomLeft','bottomRight');
  if (vOverlap) self.setStyle('topRight','height',lineHeight-vOverlap[1]);
  if (hOverlap) self.setStyle('bottomLeft','width',lineWidth-hOverlap[0]);
  if (vOrient == 'up') {
    var activeTop = self.activeTop - self.vOffset - self.stemHeight - lineHeight;
    self.setStyle(balloon,'top',activeTop - self.yOffset);
    self.setStyle(balloon,'display','inline');
  }
  else {
    var activeTop = self.activeTop + self.vOffset + self.stemHeight;
    self.setStyle(balloon,'top',activeTop - self.yOffset);
  }
  self.setOpacity(1);
}

// Fade method adapted from an example on 
// http://brainerror.net/scripts/javascript/blendtrans/
Balloon.prototype.fade = function(opacStart, opacEnd, millisec) {
  var self = currentBalloonClass || new Balloon;

  //speed for each frame
  var speed = Math.round(millisec / 100);
  var timer = 0;
  if(opacStart > opacEnd) {
    if (self.fadeOK) {
      for(o = opacStart; o >= opacEnd; o--) {
        self.timeoutFade = setTimeout('Balloon.prototype.setOpacity('+o+')',(timer*speed));
        timer++;
      }
      setTimeout("Balloon.prototype.setStyle('balloon','display','none')",millisec);
    }
    else {
      self.setStyle('balloon','display','none')
    }
  }
  else if(opacStart < opacEnd && self.fadeOK) {
    for(o = opacStart; o <= opacEnd; o++) {
      self.timeoutFade = setTimeout('Balloon.prototype.setOpacity('+o+')',(timer*speed));
      timer++;
    }
  }
}

Balloon.prototype.setOpacity = function(opc) {
  var self = currentBalloonClass;
  if (!self || !self.fadeOK) return false;

  var o = parseFloat((opc||0)/100);
  
  /////////////////////////////////////////////////////////////
  // Very irritating IE deficiency: it can't handle changing //
  // opacity of child elements.  Just fade balloon contents  //
  // for IE and the whole balloon for less obtuse browsers.  //
  var el = self.isIE() ? 'contents' : 'balloon';             //
  /////////////////////////////////////////////////////////////

  var b  = document.getElementById(el);
  if (!b) return false;

  // CSS standards-compliant browsers!
  self.setStyle(b,'opacity',o);
  // old IE
  self.setStyle(b,'filter','alpha(opacity= '+opc+')');
  // old Mozilla/NN
  self.setStyle(b,'MozOpacity',o);
  // old Safari
  self.setStyle(b,'KhtmlOpacity',o);

}

Balloon.prototype.hideTooltip = function(override) {
  // some browsers pass the event object == we don't want it
  if (override && typeof override == 'object') override = false;
  if (balloonIsSticky && !override) return false;
  
  var self = currentBalloonClass;

  if (self) {
    window.clearTimeout(self.timeoutTooltip);
    window.clearTimeout(self.timeoutAutoClose);
  }

  if (balloonIsSticky && self) self.currentElement = null;

  balloonIsVisible = false;
  //botao de fechar ativo
  balloonIsSticky  = true;

  var closeButton = document.getElementById('closeButton');
  if (closeButton) {
    YAHOO.util.Dom.setStyle(closeButton,'display','none');
  }

  if (!self) {
    var hideBalloon  = document.getElementById('balloon');
    if (hideBalloon) Balloon.prototype.setStyle(hideBalloon,'display','none');
  }
  else if (self.activeBalloon) {
    if (!override && self.fadeOK && !self.isIE()) self.fade(95,0,self.fadeOut);
    else self.setStyle(self.activeBalloon,'display','none');
  }
  Balloon.prototype.showHide(1);
}

// this function is meant to be called externally to clear
// any open balloons
hideAllTooltips = function() {
  var self = currentBalloonClass;
  if (!self) return;
  window.clearTimeout(self.timeoutTooltip);
  if (self.activeBalloon) self.setStyle(self.activeBalloon,'display','none');
  balloonIsVisible    = false;
  balloonIsSticky     = false;
  currentBalloonClass = null;
}


// Track the active mouseover coordinates
Balloon.prototype.setActiveCoordinates = function(event) {

  var self = currentBalloonClass;
  if (!self) return false;
  var b = self.activeBalloon;
//
//modificado por edmar
//
  try{
  	if(typeof(event.id) == "string")
  	{
  		var pos = i3GEO.util.pegaPosicaoObjeto(event);
    	self.activeTop    = pos[1] - 10;
    	self.activeLeft   = pos[0] - 10;
    	self.activeRight  = self.activeLeft + 20;
    	self.activeBottom = self.activeTop  + 20;
    	return true; 	
  	}
  }catch(e){}
  var evt = event || window.event || self.currentEvent;
  if (!evt) {
    return false;
  }
  var XY = self.eventXY(evt);
  self.activeTop    = XY[1] - 10;
  self.activeLeft   = XY[0] - 10;
  self.activeRight  = self.activeLeft + 20;
  self.activeBottom = self.activeTop  + 20;

  return true;
}

////
// event XY and getEventTarget Functions based on examples by Peter-Paul
// Koch http://www.quirksmode.org/js/events_properties.html
Balloon.prototype.eventXY = function(event) {
  var XY = new Array(2);
  var e = event || window.event;

  if (e.pageX || e.pageY) {
    XY[0] = e.pageX;
    XY[1] = e.pageY;
  }
  else if ( e.clientX || e.clientY ) {
    XY[0] = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    XY[1] = e.clientY + document.body.scrollTop  + document.documentElement.scrollTop;
  }
  //XY[0] = XY[0] + 10;
  return XY;
}

Balloon.prototype.getEventTarget = function(event) {
  var targ;
  var e = event || window.event;
  if (e.target) targ = e.target;
  else if (e.srcElement) targ = e.srcElement;
  if (targ.nodeType == 3) targ = targ.parentNode; // Safari
  return targ;
}
////


Balloon.prototype.setStyle = function(el,att,val) {
  if (!el) return false;
  if (val && att.match(/left|top|bottom|right|width|height|padding|margin/)) val += 'px'; 
  if (typeof(el) != 'object') el = document.getElementById(el);

  // z-index does not work as expected
  if (att == 'z-index') {
    if (el.style) {
      el.style.zIndex = parseInt(val);
    }
  }
  else {
    YAHOO.util.Dom.setStyle(el,att,val);
  }
}

// Uses YAHOO's region class for element coordinates
Balloon.prototype.getLoc = function(el,request) {
  var region = YAHOO.util.Dom.getRegion(el);

  switch(request) {
    case ('y1') : return parseInt(region.top);
    case ('y2') : return parseInt(region.bottom);
    case ('x1') : return parseInt(region.left);
    case ('x2') : return parseInt(region.right);
    case ('width')  : return (parseInt(region.right)  - parseInt(region.left));
    case ('height') : return (parseInt(region.bottom) - parseInt(region.top));
    case ('region') : return region; 
 }
}

// We don't know if numbers are overridden with strings
// so play it safe
Balloon.prototype.parseIntAll = function() {
  this.padding     = parseInt(this.padding);
  this.shadow      = parseInt(this.shadow);
  this.stemHeight  = parseInt(this.stemHeight);
  this.stemOverlap = parseInt(this.stemOverlap);
  this.vOffset     = parseInt(this.vOffset);
  this.delayTime   = parseInt(this.delayTime);
  this.width       = parseInt(this.width);
  this.maxWidth    = parseInt(this.maxWidth);
  this.minWidth    = parseInt(this.minWidth);
  this.fadeIn      = parseInt(this.fadeIn);
  this.fadeOut     = parseInt(this.fadeOut);  
}


// show/hide select elements in older IE
// plus user-defined elements
Balloon.prototype.showHide = function(visible) {
  var self = currentBalloonClass || new Balloon;

  // IE z-index bug fix (courtesy of Lincoln Stein)
  if (self.isOldIE()) {
    if (!visible) {
      var balloonSelects = document.getElementById('contents').getElementsByTagName('select');
      var myHash = new Object();
      for (var i=0; i<balloonSelects.length; i++) {
        var id = balloonSelects[i].id || balloonSelects[i].name;
        myHash[id] = 1;
      }
      balloonInvisibleSelects = new Array();
      var allSelects = document.getElementsByTagName('select');
      for (var i=0; i<allSelects.length; i++) {
        var id = allSelects[i].id || allSelects[i].name;
        if (self.isOverlap(allSelects[i],self.activeBalloon) && !myHash[id]) {
          balloonInvisibleSelects.push(allSelects[i]);
          self.setStyle(allSelects[i],'visibility','hidden');
        }
      }
    }
    else if (balloonInvisibleSelects) {
      for (var i=0; i < balloonInvisibleSelects.length; i++) {
        var id = balloonInvisibleSelects[i].id || balloonInvisibleSelects[i].name;
        self.setStyle(balloonInvisibleSelects[i],'visibility','visible');
     }
     balloonInvisibleSelects = null;
    }
  }

  // show/hide any user-specified elements that overlap the balloon
  if (self.hide) {
    var display = visible ? 'inline' : 'none';
    for (var n=0;n<self.hide.length;n++) {
      if (self.isOverlap(self.activeBalloon,self.hide[n])) {
        self.setStyle(self.hide[n],'display',display);
      }
    }
  }
}

// Try to find overlap
Balloon.prototype.isOverlap = function(el1,el2) {
  if (!el1 || !el2) return false;
  var R1 = this.getLoc(el1,'region');
  var R2 = this.getLoc(el2,'region');
  if (!R1 || !R2) return false;
  var intersect = R1.intersect(R2);
  if (intersect) {
    // extent of overlap;
    intersect = new Array((intersect.right - intersect.left),(intersect.bottom - intersect.top));
  }
  return intersect;
}

// Coordinate-based test for the same element
Balloon.prototype.isSameElement = function(el1,el2) {
  if (!el1 || !el2) return false;
  var R1 = this.getLoc(el1,'region');
  var R2 = this.getLoc(el2,'region');
  var same = R1.contains(R2) && R2.contains(R1);
  return same ? true : false;
}


///////////////////////////////////////////////////////
// Security -- get the balloon contents while checking 
// for disallowed elements.
//////////////////////////////////////////////////////
Balloon.prototype.getAndCheckContents = function(caption) {
  var originalCaption = caption;
  var notAllowed = 'are not allowed in popup balloons in this web site.Please contact the site administrator for assistance.';
  var notSupported = 'AJAX is not supported for popup balloons in this web site. Please contact the site administrator for assistance.';
  
  // no Help Url without AJAX
  if (this.helpUrl && !this.allowAJAX) {
    //alert('Sorry, you have specified help URL '+this.helpUrl+' but '+notSupported);
    //return null;
  }

  // look for a url in the balloon contents
  if (caption.match(/^url:/)) {
    this.activeUrl = caption.replace(/^url:/,'');
    caption = '';
  }
  // or if the text is a bare hyperlink
  else if (caption.match(/^(https?:|\/|ftp:)\S+$/i)) {
    this.activeUrl = caption;
    caption = '';
  }

  // Make sure AJAX is allowed
  if (this.activeUrl && !this.allowAJAX) {
    //alert('Sorry, you asked for '+originalCaption+' but '+notSupported);
    //return null;
  }  

  // check if the contents are to be retrieved from an element
  if (caption.match(/^load:/)) {
    var load = caption.split(':');
    if (!document.getElementById(load[1])) alert ('problem locating element '+load[1]);
    caption = document.getElementById(load[1]).innerHTML;
    this.loadedFromElement = true;
  }

  // check if iframes are allowed
  if (caption.match(/\<\s*iframe/i) && !this.allowIframes) {
    //alert('Sorry: iframe elements '+notAllowed);
    //return null;
  }

  // check if event handlers are allowed
  if (caption.match(/\bon(load|mouse|click|unload|before)[^=]*=/i) && !this.allowEventHandlers) {
    //alert('Sorry: JavaScript event handlers '+notAllowed);
    //return null;
  }

  // check for script elements
  if (caption.match(/\<\s*script/i) && !this.allowScripts) {
    //alert('Sorry: <script> elements '+notAllowed);
    //return null;
  }

  // request the contents
  this.currentHelpText = this.getContents(caption);
  this.loadedFromElement = false;
  
  return this.currentHelpText;;
}


///////////////////////////////////////////////////////
// AJAX widget to fill the balloons
// requires prototype.js
///////////////////////////////////////////////////////
Balloon.prototype.getContents = function(section) {

  // just pass it back if no AJAX handler is required.
  if (!this.helpUrl && !this.activeUrl) return section;

  // or if the contents are already loaded from another element
  if (this.loadedFromElement) return section;

  // inline URL takes precedence
  var url = this.activeUrl || this.helpUrl;
  url    += this.activeUrl ? '' : '?section='+section;

  // activeUrl is meant to be single-use only
  this.activeUrl = null;

  var ajax;
  if (window.XMLHttpRequest) {
    ajax = new XMLHttpRequest();
  } else {
    ajax = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (ajax) {
    ajax.open("GET", url, false);
    ajax.onreadystatechange=function() {
      //alert(ajax.readyState);
    };
    try {
      ajax.send(null);
    }
    catch (e) {
    // alert(e);
    }
    var txt = this.escapeHTML ? escape(ajax.responseText) : ajax.responseText;
    return  txt || section;
  }
  else {
    return section;
  }
}


// test for internet explorer
Balloon.prototype.isIE = function() {
  return document.all && !window.opera;
}

// test for internet explorer (but not IE7)
Balloon.prototype.isOldIE = function() {
  if (navigator.appVersion.indexOf("MSIE") == -1) return false;
  var temp=navigator.appVersion.split("MSIE");
  return parseFloat(temp[1]) < 7;
}

// test for Konqueror
Balloon.prototype.isKonqueror = function() {
  return navigator.userAgent.indexOf( 'Konqueror' ) != -1;
}

i3GEO={parametros:{mapexten:"",mapscale:"",mapres:"",pixelsize:"",mapfile:"",cgi:"",extentTotal:"",mapimagem:"",geoip:"",listavisual:"",utilizacgi:"",versaoms:"",versaomscompleta:"",mensagens:"",w:"",h:"",locsistemas:"",locidentifica:"",r:"",locmapas:"",celularef:"",kmlurl:""},finaliza:"",temaAtivo:"",cria:function(){if(window.location.href.split("?")[1]){i3GEO.configura.sid=window.location.href.split("?")[1];g_sid=i3GEO.configura.sid;if(i3GEO.configura.sid.split("#")[0]){i3GEO.configura.sid=i3GEO.configura.sid.split("#")[0]}}else{i3GEO.configura.sid=""}g_panM="nao";try{i3GEO.configura.locaplic=g_locaplic}catch(e){g_locaplic=i3GEO.configura.locaplic};try{i3GEO.configura.diminuixM=g_diminuixM}catch(e){}try{i3GEO.configura.diminuixN=g_diminuixN}catch(e){}try{i3GEO.configura.diminuiyM=g_diminuiyM}catch(e){}try{i3GEO.configura.diminuiyN=g_diminuiyN}catch(e){}var diminuix=(navm)?i3GEO.configura.diminuixM:i3GEO.configura.diminuixN;var diminuiy=(navm)?i3GEO.configura.diminuiyM:i3GEO.configura.diminuiyN;var menos=0;if($i("contemFerramentas")){var menos=menos+parseInt($i("contemFerramentas").style.width)}if($i("ferramentas")){var menos=menos+parseInt($i("ferramentas").style.width)}var novow=parseInt(screen.availWidth)-diminuix;var novoh=parseInt(screen.availHeight)-diminuiy;if(window.top==window.self){window.resizeTo(screen.availWidth,screen.availHeight);window.moveTo(0,0)}try{if(novow<800){var novow=800;var novoh=600}}catch(e){var e=""}document.body.style.width=novow-diminuix;document.body.style.height=novoh;var w=novow-menos-diminuix;var h=novoh-diminuiy;var temp=$i("corpoMapa");if(temp){if(temp.style){if(temp.style.width){var w=parseInt(temp.style.width);var h=parseInt(temp.style.width)}if(temp.style.height){var h=parseInt(temp.style.height)}}}if($i("contemImg")){$i("contemImg").style.height=h+"px";$i("contemImg").style.width=w+"px"}i3GEO.interface.cria(w,h);i3GEO.parametros={mapexten:"",mapscale:"",mapres:"",pixelsize:"",mapfile:"",cgi:"",extentTotal:"",mapimagem:"",geoip:"",listavisual:"",utilizacgi:"",versaoms:"",versaomscompleta:"",mensagens:"",w:w,h:h,locsistemas:"",locidentifica:"",r:"",locmapas:"",extentref:"",kmlurl:""};if(w<550){var i=$i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml);if(i){i.style.display="none"}}},inicia:function(){if(typeof("i3GEOmantemCompatibilidade")=='function')i3GEOmantemCompatibilidade();var montaMapa=function(retorno){if(retorno==""){alert("Ocorreu um erro no mapa - montaMapa");retorno={data:{erro:"erro"}}}if(retorno.data.erro){i3GEO.janela.fechaAguarde("montaMapa");document.body.style.backgroundColor="white";document.body.innerHTML="<br>Para abrir o i3Geo utilize o link:<br><a href="+i3GEO.configura.locaplic+"/ms_criamapa.php >"+i3GEO.configura.locaplic+"/ms_criamapa.php</a>";return("linkquebrado")}else{if(retorno.data.variaveis){var tempo="";var titulo="";eval(retorno.data.variaveis);try{if(titulo!=""){top.document.title=titulo}}catch(e){var e=""}i3GEO.ajuda.mostraJanela("Tempo de desenho em segundos: "+tempo,"");i3GEO.parametros.mapexten=mapexten;i3GEO.parametros.mapscale=parseInt(mapscale);i3GEO.parametros.mapres=mapres;i3GEO.parametros.pixelsize=g_celula;i3GEO.parametros.mapfile=mapfile;i3GEO.parametros.cgi=cgi;i3GEO.parametros.extentTotal=mapexten;i3GEO.parametros.mapimagem=mapimagem;i3GEO.parametros.geoip=geoip;i3GEO.parametros.listavisual=listavisual;i3GEO.parametros.utilizacgi=utilizacgi;i3GEO.parametros.versaoms=versaoms;i3GEO.parametros.mensagens=mensagens;i3GEO.parametros.locsistemas=locsistemas;i3GEO.parametros.locidentifica=locidentifica;i3GEO.parametros.r=r;i3GEO.parametros.locmapas=locmapas;i3GEO.parametros.extentref=extentref;i3GEO.parametros.versaoms=versaoms;i3GEO.parametros.versaomscompleta=versaomscompleta;i3GEO.parametros.kmlurl=kmlurl;i3GEO.gadgets.quadros.inicia(10);i3GEO.gadgets.quadros.grava("extensao",mapexten);i3GEO.arvoreDeCamadas.cria("",retorno.data.temas,i3GEO.configura.sid,i3GEO.configura.locaplic);i3GEO.util.arvore("<b>"+$trad("p13")+"</b>","listaPropriedades",i3GEO.configura.listaDePropriedadesDoMapa);i3GEO.gadgets.mostraBuscaRapida();i3GEO.guias.cria();if($i("arvoreAdicionaTema"))i3GEO.arvoreDeTemas.cria(i3GEO.configura.sid,i3GEO.configura.locaplic,"arvoreAdicionaTema");if($i("mst")){$i("mst").style.display="block"}i3GEO.atualiza(retorno);var temp=0;if($i("contemFerramentas")){temp=temp+parseInt($i("contemFerramentas").style.width)}if($i("ferramentas")){temp=temp+parseInt($i("ferramentas").style.width)}if($i("mst")){$i("mst").style.width=i3GEO.parametros.w+temp+"px"}if(i3GEO.configura.entorno=="sim"){i3GEO.configura.entorno=="nao";i3GEO.navega.entorno.ativaDesativa()}i3GEO.navega.autoRedesenho.ativa();if($i("i3geo_escalanum")){$i("i3geo_escalanum").value=i3GEO.parametros.mapscale}if((i3GEO.parametros.geoip=="nao")&&($i("ondeestou"))){$i("ondeestou").style.display="none"}i3GEO.interface.inicia()}else{alert("Erro. Impossivel criar o mapa "+retorno.data);return}if(document.getElementById("ajuda")){i3GEO.ajuda.DIVAJUDA="ajuda"}var abreJM="sim";if(i3GEO.util.pegaCookie("g_janelaMen")){var abreJM=i3GEO.util.pegaCookie("g_janelaMen");if(abreJM=="sim")i3GEO.configura.iniciaJanelaMensagens=true;else i3GEO.configura.iniciaJanelaMensagens=false}if(i3GEO.configura.iniciaJanelaMensagens==true){i3GEO.ajuda.abreJanela()}i3GEO.janela.fechaAguarde("montaMapa");if(i3GEO.configura.liberaGuias=="sim"){i3GEO.guias.libera()}}if($i("mst")){$i("mst").style.visibility="visible"}};if(!$i("i3geo")){document.body.id="i3geo"}$i("i3geo").className="yui-skin-sam";if($i("mst"))$i("mst").style.visibility="hidden";if(i3GEO.configura.sid==""){var mashup=function(retorno){i3GEO.configura.sid=retorno.data;i3GEO.inicia()};i3GEO.php.criamapa(mashup,i3GEO.configura.mashuppar)}else{i3GEO.janela.abreAguarde("montaMapa",$trad("o5"));i3GEO.php.inicia(montaMapa,i3GEO.configura.embedLegenda,i3GEO.parametros.w,i3GEO.parametros.h)}if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.janela.fechaAguarde()")<0){i3GEO.eventos.NAVEGAMAPA.push("i3GEO.janela.fechaAguarde()")}eval(i3GEO.finaliza)},atualiza:function(retorno){var corpoMapa=function(){i3GEO.janela.abreAguarde("ajaxiniciaParametros",$trad("o1")+" atualizando");i3GEO.php.corpo(i3GEO.atualiza,i3GEO.configura.tipoimagem)};if(arguments.length==0){corpoMapa.call();return}if(retorno==""){corpoMapa.call();return}if(!retorno.data){corpoMapa.call();return}try{if(retorno.data=="erro"){alert("Erro no mapa. Sera feita uma tentativa de recuperacao.");i3GEO.mapa.recupera.inicia();return}else if(retorno.data=="ok"||retorno.data==""){corpoMapa.call();return}}catch(e){}var erro=function(){var legimagem="";var c=confirm("Ocorreu um erro, quer tentar novamente?");if(c){corpoMapa.call()}else{i3GEO.janela.fechaAguarde()}return};try{eval(retorno.data.variaveis)}catch(e){erro.call();return}if(arguments.length==0||retorno==""||retorno.data.variaveis==undefined){erro.call();return}else{if(arguments.length==0){return}i3GEO.mapa.verifica(retorno);var tempo="";if(i3GEO.desenho.richdraw){i3GEO.desenho.richdraw.clearWorkspace()}mapscale="";mapexten="";eval(retorno.data.variaveis);try{i3GEO.arvoreDeCamadas.atualiza(retorno.data.temas);if(i3GEO.parametros.mapscale!=mapscale)i3GEO.arvoreDeCamadas.atualizaFarol(mapscale);i3GEO.parametros.mapexten=mapexten;i3GEO.parametros.mapscale=mapscale;i3GEO.parametros.mapres=mapres;i3GEO.parametros.pixelsize=g_celula;i3GEO.parametros.mapimagem=mapimagem}catch(e){}i3GEO.interface.redesenha();g_operacao="";i3GEO.parametros.mapexten=mapexten;if($i("mensagemt")){$i("mensagemt").value=i3GEO.parametros.mapexten}i3GEO.arvoreDeCamadas.CAMADAS=retorno.data.temas;i3GEO.eventos.navegaMapa();if(i3GEO.configura.entorno=="sim"){i3GEO.navega.entorno.geraURL();i3GEO.navega.entorno.ajustaPosicao()}i3GEO.ajuda.mostraJanela("Tempo de redesenho em segundos: "+tempo,"")}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}navm=false;navn=false;var app=navigator.appName.substring(0,1);if(app=='N')navn=true;else navm=true;g_operacao="";g_tipoacao="zoomli";g_postpx="px";g_tipotop="top";g_tipoleft="left";if(navm){g_postpx="";g_tipotop="pixelTop";g_tipoleft="pixelLeft"}$i=function(id){return document.getElementById(id)};Array.prototype.remove=function(s){try{var i=this.indexOf(s);if(i!=-1)this.splice(i,1)}catch(e){}};i3GEO.util={PINS:new Array(),BOXES:new Array(),escapeURL:function(sUrl){var sUrl=escape(sUrl);var re=new RegExp("%3F","g");var sUrl=sUrl.replace(re,'?');var re=new RegExp("%3D","g");var sUrl=sUrl.replace(re,'=');var re=new RegExp("%26","g");var sUrl=sUrl.replace(re,'&');return sUrl},insereCookie:function(nome,valor){document.cookie=nome+"="+valor+";path=/"},pegaCookie:function(nome){var cookies=document.cookie;var i=cookies.indexOf(nome);if(i==-1){return null}var fim=cookies.indexOf(";",i);if(fim==-1){var fim=cookies.length}return(unescape(cookies.substring(i,fim))).split("=")[1]},listaChaves:function(obj){var keys=[];for(var key in obj){keys.push(key)}return keys},criaBotaoAplicar:function(nomeFuncao,titulo,classe,obj){try{clearTimeout(tempoBotaoAplicar)}catch(e){};tempoBotaoAplicar=eval("setTimeout('"+nomeFuncao+"\(\)',(i3GEO.configura.tempoAplicar))");autoRedesenho("reinicia");if(arguments.length==1){var titulo="Aplicar"}if(arguments.length==1||arguments.length==2){var classe="i3geoBotaoAplicar"}if(!document.getElementById("i3geo_aplicar")){var novoel=document.createElement("input");novoel.id='i3geo_aplicar';novoel.type='button';novoel.value=titulo;novoel.style.cursor="pointer";novoel.style.fontSize="10px";novoel.style.zIndex=15000;novoel.style.position="absolute";novoel.style.display="none";novoel.onmouseover=function(){this.style.display="block"};novoel.onmouseout=function(){this.style.display="none"};novoel.className=classe;document.body.appendChild(novoel)}else{var novoel=document.getElementById("i3geo_aplicar")}novoel.onclick=function(){clearTimeout(i3GEO.parametros.tempo);i3GEO.parametros.tempo="";this.style.display='none';eval(nomeFuncao+"\(\)")};if(arguments.length==4){novoel.style.display="block";var xy=YAHOO.util.Dom.getXY(obj);YAHOO.util.Dom.setXY(novoel,xy)}return(novoel)},arvore:function(titulo,onde,obj){if(!$i(onde)){return}var currentIconMode;try{arvore=new YAHOO.widget.TreeView(onde);root=arvore.getRoot();var tempNode=new YAHOO.widget.TextNode('',root,false);tempNode.isLeaf=false;tempNode.enableHighlight=false}catch(e){}var titulo="<table><tr><td><b>"+titulo+"</b></td><td></td></tr></table>";var d={html:titulo};var tempNode=new YAHOO.widget.HTMLNode(d,root,true,true);tempNode.enableHighlight=false;var c=obj.propriedades.length;for(var i=0,j=c;i<j;i++){var linha=obj.propriedades[i];var conteudo="<a href='#' onclick='"+linha.url+"'>"+$trad(linha.text)+"</a>";var d={html:conteudo};var temaNode=new YAHOO.widget.HTMLNode(d,tempNode,false,true);temaNode.enableHighlight=false}arvore.collapseAll();arvore.draw()},removeAcentos:function(palavra){var re=/ã|á|à|â/gi;palavra=palavra.replace(re,"a");var re=/é/gi;palavra=palavra.replace(re,"e");var re=/í/gi;palavra=palavra.replace(re,"i");var re=/ó|õ/gi;palavra=palavra.replace(re,"o");var re=/ç/gi;palavra=palavra.replace(re,"c");var re=/ú/gi;palavra=palavra.replace(re,"u");return(palavra)},protocolo:function(){var u=window.location.href;var u=u.split(":");return(u[0])},pegaPosicaoObjeto:function(obj){if(obj){if(!obj.style){return[0,0]}if(obj.style.position=="absolute"){return[(parseInt(obj.style.left)),(parseInt(obj.style.top))]}else{var curleft=curtop=0;if(obj){if(obj.offsetParent){do{curleft+=obj.offsetLeft-obj.scrollLeft;curtop+=obj.offsetTop-obj.scrollTop}while(obj=obj.offsetParent)}}return[curleft+document.body.scrollLeft,curtop+document.body.scrollTop]}}else{return[0,0]}},pegaElementoPai:function(e){var targ;if(!e){var e=window.event}if(e.target){targ=e.target}else if(e.srcElement){targ=e.srcElement}if(targ.nodeType==3){targ=targ.parentNode}var tname;tparent=targ.parentNode;return(tparent)},mudaCursor:function(cursores,tipo,idobjeto,locaplic){var o=document.getElementById(idobjeto);var c=eval("cursores."+tipo+".ie");if(c=="default"||c=="pointer"||c=="crosshair"||c=="help"||c=="move"||c=="text")o.style.cursor=c;else{if(o){if(navm){o.style.cursor="URL(\""+locaplic+eval("cursores."+tipo+".ie")+"\"),auto"}else{o.style.cursor="URL(\""+locaplic+eval("cursores."+tipo+".ff")+"\"),auto"}}}},criaBox:function(id){if(arguments.length==0){var id="boxg"}if(!$i(id)){var novoel=document.createElement("div");novoel.id=id;novoel.style.zIndex=1;novoel.innerHTML='<font face="Arial" size=0></font>';document.body.appendChild(novoel);novoel.onmouseover=function(){novoel.style.display='none'};novoel.onmouseout=function(){novoel.style.display='block'};i3GEO.util.BOXES.push(id)}else $i(id).style.display="block"},escondeBox:function(){var l=i3GEO.util.BOXES.length;for(i=0;i<l;i++){if($i(i3GEO.util.BOXES[i])){$i(i3GEO.util.BOXES[i]).style.display="none"}}},criaPin:function(id,imagem,w,h){if(arguments.length<1||id==""){var id="boxpin"}if(arguments.length<2||imagem==""){var imagem=i3GEO.configura.locaplic+'/imagens/marker.png'}if(arguments.length<3||w==""){var w="21px"}if(arguments.length<4||h==""){var h="25px"}if(!$i(id)){var novoel=document.createElement("img");novoel.id=id;novoel.style.zIndex=10000;novoel.style.position="absolute";novoel.style.width=w;novoel.style.height=h;novoel.src=imagem;if(id=="boxpin"){novoel.onmouseover=function(){$i("boxpin").style.display="none"}}document.body.appendChild(novoel);i3GEO.util.PINS.push(id)}},posicionaImagemNoMapa:function(id){var i=$i(id);var mx=parseInt(i.style.width)/2;var my=parseInt(i.style.height)/2;i.style.position="absolute";i.style.top=objposicaocursor.telay-my;i.style.left=objposicaocursor.telax-mx},escondePin:function(){var l=i3GEO.util.PINS.length;for(i=0;i<l;i++){if($i(i3GEO.util.PINS[i])){$i(i3GEO.util.PINS[i]).style.display="none"}}},$im:function(g){return i3GEO.configura.locaplic+"/imagens/visual/"+i3GEO.configura.visual+"/"+g},$inputText:function(idPai,larguraIdPai,idInput,titulo,digitos,valor){if(idPai!=""){if(larguraIdPai!=""){$i(idPai).style.width=larguraIdPai+"px"}$i(idPai).style.padding="3";$i(idPai).style.textAlign="center";$i(idPai).onmouseover=function(){this.className="digitarMouseover"};$i(idPai).onmouseout=function(){this.className=""}}var i="<input onmouseover='javascript:this.className=\"digitarOver\";' onmouseout='javascript:this.className=\"digitar\";' onclick='javascript:this.className=\"digitarMouseclick\";' id="+idInput+" title='"+titulo+"' type=text size="+digitos+" class=digitar value='"+valor+"' />";return i},$top:function(id,valor){if(document.getElementById(id).style){if(document.getElementById(id).style.pixelTop){document.getElementById(id).style.pixelTop=valor}else{document.getElementById(id).style.top=valor+"px"}}},$left:function(id,valor){if(document.getElementById(id).style){if(document.getElementById(id).style.pixelLeft){document.getElementById(id).style.pixelLeft=valor}else{document.getElementById(id).style.left=valor+"px"}}},insereMarca:{CONTAINER:new Array(),cria:function(xi,yi,funcaoOnclick,container){try{if(i3GEO.util.insereMarca.CONTAINER.toString().search(container)<0)i3GEO.util.insereMarca.CONTAINER.push(container);if(!$i(container)){var novoel=document.createElement("div");novoel.id=container;var i=novoel.style;i.position="absolute";i.top=parseInt($i(i3GEO.interface.IDCORPO).style.top);i.left=parseInt($i(i3GEO.interface.IDCORPO).style.left);document.body.appendChild(novoel)}var container=$i(container);var novoel=document.createElement("div");var i=novoel.style;i.position="absolute";i.zIndex=2000;i.top=(yi-4)+"px";i.left=(xi-4)+"px";i.width="4px";i.height="4px";var novoimg=document.createElement("img");if(funcaoOnclick!=""){novoimg.onclick=funcaoOnclick}else{novoimg.onclick=function(){i3GEO.util.insereMarca.limpa()}}novoimg.src=i3GEO.configura.locaplic+"/imagens/dot1.gif";with(novoimg.style){width="6px";height="6px";zIndex=2000}novoel.appendChild(novoimg);container.appendChild(novoel);if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.util.insereMarca.limpa()")<0){i3GEO.eventos.NAVEGAMAPA.push("i3GEO.util.insereMarca.limpa()")}}catch(e){alert("Ocorreu um erro. inseremarca"+e)}},limpa:function(){try{var n=i3GEO.util.insereMarca.CONTAINER.length;for(i=0;i<n;i++){if($i(i3GEO.util.insereMarca.CONTAINER[i]))$i(i3GEO.util.insereMarca.CONTAINER[i]).innerHTML=""}i3GEO.util.insereMarca.CONTAINER=new Array();i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.util.insereMarca.limpa()")}catch(e){}}},adicionaSHP:function(path){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));var temp=path.split(".");if((temp[1]=="SHP")||(temp[1]=="shp")){i3GEO.php.adicionaTemaSHP(i3GEO.atualiza,path)}else{i3GEO.php.adicionaTemaIMG(i3GEO.atualiza,path)}},abreCor:function(janela,elemento){i3GEO.janela.cria("400","240",i3GEO.configura.locaplic+"/ferramentas/colorpicker/index.htm?doc="+janela+"&elemento="+elemento,"","","Cor","i3geo_janelaCor",true)},ajaxhttp:function(){try{var objhttp1=new XMLHttpRequest()}catch(ee){try{var objhttp1=new ActiveXObject("Msxml2.XMLHTTP")}catch(e){try{var objhttp1=new ActiveXObject("Microsoft.XMLHTTP")}catch(E){var objhttp1=false}}}return(objhttp1)},ajaxexecASXml:function(programa,funcao){if(programa.search("http")==0){var h=window.location.host;if(programa.search(h)<0){alert("OOps! Nao e possivel chamar um XML de outro host.\nContacte o administrador do sistema.\nConfigure corretamente o ms_configura.php");return}}var ohttp=i3GEO.util.ajaxhttp();ohttp.open("GET",programa,true);var retorno="";ohttp.onreadystatechange=function(){if(ohttp.readyState==4){var retorno=ohttp.responseText;if(retorno!=undefined){if(document.implementation.createDocument){var parser=new DOMParser();var dom=parser.parseFromString(retorno,"text/xml")}else{var dom=new ActiveXObject("Microsoft.XMLDOM");dom.async="false";dom.load(programa)}}else{var dom="erro"}if(funcao!="volta"){eval(funcao+'(dom)')}else{return dom}}};ohttp.send(null)},aparece:function(id,tempo,intervalo){var n=parseInt(tempo/intervalo);var tempo=n*intervalo;var intervalo=(intervalo*100)/tempo;var obj=$i(id);var opacidade=0;if(navm){obj.style.filter='alpha(opacity=0)'}else{obj.style.opacity=0}obj.style.display="block";var fadei=function(){opacidade+=intervalo;if(navm){obj.style.filter='alpha(opacity='+opacidade+')'}else{obj.style.opacity=opacidade/100}if(opacidade<100)var tempoFade=setTimeout(fadei,tempo);else{clearTimeout(tempoFadei);if(navm){obj.style.filter='alpha(opacity=100)'}else{obj.style.opacity=1}}};var tempoFadei=setTimeout(fadei,tempo)},desaparece:function(id,tempo,intervalo,removeobj){var n=parseInt(tempo/intervalo);var tempo=n*intervalo;var intervalo=(intervalo*100)/tempo;var obj=$i(id);var opacidade=100;if(navm){obj.style.filter='alpha(opacity=100)'}else{obj.style.opacity=1}obj.style.display="block";var fade=function(){opacidade-=intervalo;if(navm){obj.style.filter='alpha(opacity='+opacidade+')'}else{obj.style.opacity=opacidade/100}if(opacidade>0){var tempoFade=setTimeout(fade,tempo)}else{clearTimeout(tempoFade);obj.style.display="none";if(navm){obj.style.filter='alpha(opacity=100)'}else{obj.style.opacity=1}if(removeobj){var p=obj.parentNode;if(p)p.removeChild(obj)}}};var tempoFade=setTimeout(fade,tempo)},wkt2ext:function(wkt,tipo){var tipo=tipo.toLowerCase();ext=false;if(tipo=="polygon"){try{var re=new RegExp("POLYGON","g");var wkt=wkt.replace(re,"");var wkt=wkt.split("(")[2].split(")")[0];var wkt=wkt.split(",");var x=new Array();var y=new Array();for(w=0;w<wkt.length;w++){var temp=wkt[w].split(" ");x.push(temp[0]);y.push(temp[1])}x.sort(i3GEO.util.sortNumber);var xMin=x[0];var xMax=x[(x.length)-1];y.sort(i3GEO.util.sortNumber);var yMin=y[0];var yMax=y[(y.length)-1];return xMin+" "+yMin+" "+xMax+" "+yMax}catch(e){}}return ext},sortNumber:function(a,b){return a-b}};$im=function(g){return i3GEO.util.$im(g)};$inputText=function(idPai,larguraIdPai,idInput,titulo,digitos,valor){return i3GEO.util.$inputText(idPai,larguraIdPai,idInput,titulo,digitos,valor)};$top=function(id,valor){i3GEO.util.$top(id,valor)};$left=function(id,valor){i3GEO.util.$left(id,valor)};
g_traducao={"p1":[{pt:"O I3Geo &eacute; software livre! Para download clique <a href='http://mapas.mma.gov.br/download' target=blank >aqui</a>. <b><a href='http://"+window.location.host+"/i3geo/mobile/qrcode.htm' target=blank >Qrcode mobile</a></b>",en:"I3geo is a open source software! <a href='http://mapas.mma.gov.br/download' target=blank >Click</a> to download.",es:"I3Geo es software libre. <a href='http://mapas.mma.gov.br/download' target=blank > Download</a>",it:"I3geo è un software libero! <a href='http://mapas.mma.gov.br/download' target=blank >clicca qui </a> per il download."}],"p2":[{pt:"Tipo de imagem",en:"Image type",es:"Tipo de imagen",it:"Tipo di immagine"}],"p3":[{pt:"Legenda",en:"Legend",es:"Subt&iacute;tulo",it:"Legenda"}],"p4":[{pt:"Escala",en:"Scale",es:"Escala",it:"Scala"}],"p5":[{pt:"Tamanho",en:"Size",es:"Tama&ntilde;o",it:"Dimensione"}],"p6":[{pt:"Ativa/desativa entorno",en:"Enable/Disable surrounding",es:"Activar/desactivar entorno",it:"Attiva / Disattiva campo"}],"p7":[{pt:"Ativa/desativa logo",en:"Enable/Disable logo",es:"Activar/desactivar logomarca",it:"Attiva / disattiva logo"}],"p8":[{pt:"Cor da selecao",en:"Selection color",es:"Color de la selecci&oacute;n",it:"Colore della selezione"}],"p9":[{pt:"Cor do fundo",en:"Background color",es:"Color del fondo",it:"Colore dello sfondo"}],"p10":[{pt:"Grade de coordenadas",en:"Graticule",es:"Grado de coordenadas",it:"Reticolo"}],"p11":[{pt:"Template",en:"Template",es:"Template",it:"Template"}],"p12":[{pt:"Temporizador",en:"Timer",es:"Temporizador",it:"Temporizzazione"}],"p13":[{pt:"Propriedades",en:"Properties",es:"Propiedades",it:"Proprietà"}],"p14":[{pt:"Aplicar",en:"Apply",es:"Aplicar",it:"Applica"}],"s1":[{pt:"Ajuda?",en:"Help",es:"Ayuda",it:"Aiuto?"}],"s2":[{pt:"An&aacute;lise",en:"Analysis",es:"An&aacute;lisis",it:"Analisi"}],"s3":[{pt:"Janelas",en:"Windows",es:"Ventanas",it:"Finestra"}],"s4":[{pt:"Arquivo",en:"Files",es:"Archivo",it:"Archivio"}],"s5":[{pt:"Propriedades",en:"Properties",es:"Propiedades",it:"Proprietà"}],"u1":[{pt:"Sobre o I3Geo",en:"About",es:"Sobre I3Geo",it:"Informazioni WebGis"}],"u2":[{pt:"Sistema",en:"System",es:"Sistema",it:"Sistema"}],"u3":[{pt:"WikiBook",en:"WikiBook",es:"WikiBook",it:"WikiBook"}],"u4":[{pt:"Tutoriais",en:"Tutorials",es:"Tutoriales",it:"Guida"}],"u5":[{pt:"Blog",en:"Blog",es:"Blog",it:"Blog"}],"u5a":[{pt:"Portal do software p&uacute;blico",en:"Portal do software p&uacute;blico",es:"Portal do software p&uacute;blico",it:"Portale del software pubblico"}],"u6":[{pt:"Geometrias",en:"Geometries",es:"Geometr&iacute;as",it:"Geometrie"}],"u7":[{pt:"Grade de poligonos",en:"Polygon grid",es:"Grado de pol&iacute;gonos",it:"Reticolo poligonale"}],"u8":[{pt:"Grade de pontos",en:"Grid of Points",es:"Grado de puntos",it:"Reticolo puntuale"}],"u9":[{pt:"Grade de hex&aacute;gonos",en:"Grid of Hexagons",es:"Grado de hex&aacute;gonos",it:"Reticolo Esagonale"}],"u10":[{pt:"Entorno(Buffer)",en:"Buffer",es:"Entorno (Buffer)",it:"Buffer"}],"u11":[{pt:"Centr&oacute;ide",en:"Centroid",es:"Centro geométrico",it:"Baricentro"}],"u11a":[{pt:"Dist&acirc;ncia entre pontos",en:"Point distance",es:"Distancia de puntos",it:"Distanza tra i punti"}],"u12":[{pt:"N pontos em poligono",en:"N point in polygon",es:"N puntos en pol&iacute;gono",it:"N punti nel Poligono"}],"u13":[{pt:"Ponto em poligono/raster",en:"Point in polygon/raster",es:"Punto en pol&iacute;gono/matriz",it:"Punto nel Poligono / raster"}],"u14":[{pt:"Distribui&ccedil;&atilde;o de pontos",en:"Point distribution",es:"Distribuci&oacute;n de puntos",it:"Distribuzione di punti"}],"u15":[{pt:"Barras de ferramentas",en:"Toolbars",es:"Barras de herramientas",it:"Barre Strumenti"}],"u16":[{pt:"Janela de mensagens",en:"Message window",es:"Ventana de mensajes",it:"Finestra messaggi"}],"u17":[{pt:"Salvar mapa",en:"Save map",es:"Guardar mapa",it:"Salva mappa"}],"u18":[{pt:"Carregar mapa",en:"Load map",es:"Cargar mapa",it:"Apri mappa"}],"u19":[{pt:"Pegar imagens",en:"Get pictures",es:"Tomar im&aacute;genes",it:"Apri immagine"}],"u20":[{pt:"Converter em WMS",en:"Convert to WMS",es:"Convertir en WMS",it:"Converti in WMS"}],"u20a":[{pt:"Converter em KML",en:"Convert to KML",es:"Convertir en KML",it:"Converti in KML"}],"u21":[{pt:"Gerador de links",en:"Link generator",es:"Generador de enlaces",it:"Genera collegamento"}],"u22":[{pt:"Grade",en:"Graticule",es:"Grado",it:"Reticolo"}],"u23":[{pt:"Ponto",en:"Point",es:"Punto",it:"Punto"}],"u24":[{pt:"Pol&iacute;gono",en:"Polygon",es:"Poligonos",it:"Poligono"}],"u25":[{pt:"Dissolve",en:"Dissolv",es:"Dissolve",it:"Dissolvi"}],"u26":[{pt:"Agrupa",en:"Group",es:"Agrupa",it:"Aggrega"}],"u27":[{pt:"Outros",en:"Others",es:"Otros",it:"Altri"}],"t1":[{pt:"Camadas",en:"Layers",es:"Capas",it:"Strati"}],"t2":[{pt:"arraste o tema aqui para excluir",en:"Drag the layer here to remove",es:"Arrastre el tema aqui para excluirlo",it:"Trascina qui per rimuovere"}],"t3":[{pt:"Clique para ligar ou desligar esse tema, mostrando-o ou n&atilde;o no mapa. Ap&oacute;s alterar o estado do tema, aguarde alguns instantes para o mapa ser redesenhado, ou clique no bot&atilde;o aplicar que ser&aacute; mostrado.",en:"Turn the layer on/off on the map. Wait a few moments to get the map redesigned or press the button to apply it.",es:"Haga clic para conectar o desconectar este tema, mostr&aacute;ndolo o no en el mapa. Despu&eacute;s de alterar el estado del tema, espere algunos instantes para que el mapa sea redise&ntilde;ado, o haga clic en el bot&oacute;n aplicar que se mostrar&aacute;.",it:"Fare clic per attivare o disattivare questo tema. Dopo aver modificato lo stato del tema, La mappa aggiornata sarà visualizzata dopo qualche istante. Per visualizzare subito cliccare su Applica"}],"t4":[{pt:"limpa sele&ccedil;&atilde;o",en:"Clear selection",es:"Limpia la selecci&oacute;n",it:"Pulizia della selezione"}],"t4a":[{pt:"zoom para a sele&ccedil;&atilde;o",en:"Zoom to selection",es:"Zoom a la selecci&oacute;n",it:"Zoom della selezione"}],"t5":[{pt:"Limpa sele&ccedil;&atilde;o existente nesse tema",en:"Clear selection",es:"Limpia la selecci&oacute;n existente en este tema",it:"Pulizia della selezione esistente in questo strato"}],"t6":[{pt:"Clique para fazer o download desse tema no formato shapefile",en:"Click to download in shapefile format",es:"Haga clic para hacer el download",it:"Clicca per il download di questo tema nel formato Shapefile"}],"t7":[{pt:"clique e arraste",en:"dragging",es:"Haga clic y arrastre",it:"Clicca e trascina"}],"t7a":[{pt:"Clique e arraste para mudar a ordem. Arraste e solte na lixeira para remover. Aguarde para ver a legenda.",en:"dragging or wait",es:"Haga clic y arrastre",it:"Clicca e trascina"}],"t8":[{pt:"arraste para mudar a ordem",en:"drag to change the draw order",es:"Arrastre para cambiar la orden",it:"Trascina per modificare l'ordine"}],"t9":[{pt:"A escala do tema &eacute; compat&iacute;vel com a escala do mapa",en:"The scale of the layer is compatible with the scale of the map",es:"La escala del tema es compatible con la escala del mapa",it:"La scala del tema è compatibile con la scala della mappa"}],"t10":[{pt:"A escala do tema &eacute incompat&iacute;vel com a escala do mapa",en:"The scale of the layer is incompatible with the scale of the map",es:"La escala del tema es incompatible con la escala del mapa",it:"La scala del tema è incompatibile con la scala della mappa"}],"t11":[{pt:"A escala do tema n&atilde;o &eacute conhecida",en:"The scale of the layer is not known",es:"La escala del tema no es conocida",it:"La scala del tema non è conosciuta"}],"t12":[{pt:"excluir",en:"delete",es:"Excluir",it:"Eliminare"}],"t12a":[{pt:"Clique para excluir esse tema do mapa.",en:"Delete layer of the map.",es:"Haga clic para excluir este tema del mapa",it:"Clicca per rimuovere questo strato della mappa"}],"t13":[{pt:"sobe",en:"up",es:"Sube",it:"Mettere sopra "}],"t14":[{pt:"Clique para subir esse tema na ordem de desenho",en:"Drag the layer up",es:"Haga clic para subir ese tema en la orden de dise&ntilde;o",it:"Clicca per sollevare questo tema nell’ordine di progettazione"}],"t15":[{pt:"desce",en:"down",es:"Baja",it:"scendere"}],"t16":[{pt:"Clique para descer esse tema na ordem de desenho",en:"Drag the layer down",es:"Haga clic para bajar este tema en la orden de dise&ntilde;o",it:"Clicca per scendere questo tema nell’ordine di progettazione."}],"t17":[{pt:"zoom para o tema",en:"zoom to a layer",es:"Zoom para el tema",it:"Zoom al tema"}],"t18":[{pt:"Clique para ajustar o mapa de forma a mostrar todo o tema",en:"Click to adjust the map in order to show the whole layer",es:"Haga clic para ajustar el mapa de forma para que muestre todo el tema",it:"Clicca per regolare la mappa per visualizzare tutto lo strato"}],"t18a":[{pt:"Op&ccedil;&otilde;es",en:"Options",es:"Opciones",it:"Opzioni"}],"t18b":[{pt:"Legenda",en:"Legend",es:"Subtitulo",it:"Legenda"}],"t19":[{pt:"Altera a transparência do tema, possibilitando que as camadas inferiores possam ser vistas.",en:"Change the layer transparency.",es:"Altera la transparencia del tema, haciendo posible que las capas inferiores puedan verse",it:"Modifica la trasparenza del tema, consentendo che gli strati più bassi siano visti"}],"t20":[{pt:"Opacidade:",en:"Opacity",es:"Opacidad",it:"Opacità"}],"t21a":[{pt:"Muda o nome atual do tema. Utilize para melhorar a legenda do mapa.",en:"Change layer name.",es:"Cambia el nombre actual del tema. Utilice para mejorar el subtitulo del mapa.",it:"Cambia il nome del tema corrente. Utilizzare per migliorare la legenda della mappa."}],"t21":[{pt:"Novo nome:",en:"New name",es:"Nuevo nombre",it:"Nuovo nome"}],"t22":[{pt:"Localize elementos no tema com base em seus atributos descritivos.",en:"Find elements on the layer based on their descriptive attributes.",es:"Ubique elementos en el tema con base en sus atributos descriptivos",it:"Trova gli elementi nel tema secondo i suoi attributi descrittivi."}],"t23":[{pt:"Procurar...",en:"Search...",es:"Buscar...",it:"Cerca..."}],"t24":[{pt:"Crie uma nova camada no mapa para apresentar textos descritivos sobre esse tema, tendo como base a tabela de atributos.",en:"Create a new layer to display descriptive texts on the subject, based on table of attributes.",es:"Crear una nueva capa en el mapa para presentar textos descriptivos sobre este tema, teniendo como base la tabla de atributos",it:"Creare un nuovo strato sulla mappa per visualizzare testi descrittivi sul tema, secondo la tabella di attributi."}],"t25":[{pt:"Texto...",en:"Label...",es:"Texto...",it:"Testo..."}],"t26":[{pt:"Defina as etiquetas que ser&atilde;o mostradas quando o mouse &eacute; estacionado sobre um elemento desse tema.",en:"Set the tooltips that will be shown when the mouse is over the element of that layer.",es:"Defina las etiquetas que se mostrar&aacute;n cuando el rat&oacute;n se estaciona sobre un elemento de este tema",it:"Definire le etichette da visualizzare quando il mouse si ferma su un elemento di questo tema."}],"t27":[{pt:"Etiquetas...",en:"Tooltip...",es:"Etiquetas...",it:"Descrizioni..."}],"t28":[{pt:"Insira um filtro nesse tema para mostrar apenas determinadas informa&ccedil;&otilde;es, com base na tabela de atributos.",en:"Filter based on the table of attributes.",es:"Inserte un filtro en este tema para mostrar solo determinadas informaciones, con base en la tabla de atributos",it:"Inserisci un filtro in questo tema per mostrare solo determinate informazioni, con base nella tabella di attributi"}],"t29":[{pt:"Filtro...",en:"Filter...",es:"Filtro...",it:"Filtro..."}],"t30":[{pt:"Veja a tabela de atributos relacionada a esse tema.",en:"See the table of attributes related to that layer.",es:"Vea la tabla de atributos relacionada con este tema",it:"Vedi la tabella degli attributi di questo tema."}],"t31":[{pt:"Tabela...",en:"Table...",es:"Tabla...",it:"Tabella..."}],"t32":[{pt:"Abre o editor de legenda, permitindo a alteração da forma de representação desse tema.",en:"Opens the editor of legend, allowing the modification of the form of representation of this theme.",es:"Abre el editor de subtítulo, permitiendo la alteraci&oacute;n de la forma de representaci&oacute;n de este tema",it:"Aprire l'editor di legenda, che consente la modifica della forma di rappresentazione di questo tema "}],"t33":[{pt:"Editar legenda...",en:"Legend edit...",es:"Editar subtítulo...",it:"Modifica la legenda"}],"t34":[{pt:"Mostra os dados desse tema em uma janela que acompanha o mouse.",en:"The data shows that layer in a window that tracks the mouse.",es:"Muestra los datos de este tema en una ventana que acompa&ntilde;a el rat&oacute;n",it:"Mostra i dati di questo tema in una finestra che accompagna il mouse."}],"t35":[{pt:"Mostra em janela...",en:"Show in window",es:"Muestra en la ventana...",it:"Mostra nella finestra..."}],"t36":[{pt:"tema vis&iacute;vel apenas em determinadas escalas",en:"the layer is visible in specific scales",es:"capa visible en ciertas escalas",it:"Tema visibile solo a determinate scale"}],"t37":[{pt:"Gráfico",en:"Graphic",es:"Gr&aacute;fico",it:"Grafico"}],"t38":[{pt:"Exporta a legenda para o padrão SLD.",en:"Exporta a legenda para o padrão SLD.",es:"Exporta a legenda para o padrão SLD.",it:"Exporta a legenda para o padrão SLD."}],"t39":[{pt:"SLD...",en:"SLD...",es:"SLD...",it:"SLD..."}],"a1":[{pt:"procurar tema:",en:"search layer:",es:"Buscar datos:",it:"Ricerca il tema:"}],"a2":[{pt:"Upload de shape file",en:"Upload shape file",es:"Upload de shape file",it:"Upload del shape file"}],"a2b":[{pt:"Upload de arquivo dbf ou CSV",en:"Upload dbf or CSV file",es:"Upload de archivo dbf o CSV",it:"Upload del file dbf o CSV"}],"a3":[{pt:"Download de dados",en:"Data download",es:"Download de datos",it:"Download dei dati"}],"a4":[{pt:"Conectar com servidor WMS",en:"WMS server connection",es:"Conectar con el servidor WMS",it:"Connetti con il server WMS"}],"a4b":[{pt:"Conectar com servidor WMS-T",en:"WMS-T server connection",es:"Conectar con el servidor WMS-T",it:"Connetti con il server WMS-T"}],"a5":[{pt:"Conectar com GeoRss",en:"GeoRss connection",es:"Conectar con GeoRss",it:"Connetti con il GeoRss"}],"a5a":[{pt:"Nuvem de tags",en:"Tags cloud",es:"Tags",it:"Tag"}],"a6":[{pt:"Acesso aos arquivos do servidor",en:"Access files in server directory",es:"Acceso a los archivos del servidor",it:"Accesso agli archivi del server"}],"a7":[{pt:"Temas",en:"Layers",es:"Temas",it:"Temi"}],"a8":[{pt:"Clique no box ao lado do tema para ligar ou desligar, mostrando-o ou não no mapa. Após alterar o estado do tema, aguarde alguns instantes para o mapa ser redesenhado, ou clique no botão aplicar que será mostrado.",en:"Click to connect or disconnect layer, showing it or not on the map. After changing the layer status, wait a few moments to be redesigned the map, or click in the button apply that will be shown.",es:"Haga clic para conectar o desconectar este tema, mostr&aacute;ndolo o no en el mapa. Despu&eacute;s de alterar el estado del tema, espere algunos instantes para que el mapa sea redise&ntilde;ado, o haga clic en el bot&oacute;n aplicar que aparecer&aacute;",it:"Clicca sulla casella accanto al tema per attivare o disattivare, mostrandolo o meno sulla mappa. Dopo aver modificato lo stato del tema, attendere qualche istante per vedere ridisegnata la mappa, oppure fare clic sul pulsante Applica, che verrà visualizzato."}],"a9":[{pt:"fonte",en:"font",es:"Fuente",it:"Fonte"}],"a10":[{pt:"c&oacute;digo:",en:"code",es:"C&oacute;digo",it:"Codice"}],"a11":[{pt:"Sistemas",en:"Systems",es:"Sistemas",it:"Sistemi"}],"a12":[{pt:"Abrir sistema",en:"Open system",es:"Abrir sistema",it:"Aprire il sistema"}],"g1":[{pt:"Temas",en:"Layer",es:"Temas",it:"Temi"}],"g2":[{pt:"Adiciona",en:"Add",es:"Agrega",it:"Aggiunge"}],"g3":[{pt:"Legenda",en:"Legend",es:"Subtítulo",it:"Legenda"}],"g4":[{pt:"Mapas",en:"Maps",es:"Mapas",it:"Mappa"}],"g4a":[{pt:"Mapa",en:"Map",es:"Mapa",it:"Mappe"}],"o1":[{pt:"Aguarde...",en:"Wait...",es:"Espere...",it:"Attendere..."}],"o2":[{pt:"Busca r&aacute;pida...",en:"Quick search...",es:"B&uacute;squeda r&aacute;pida...",it:"Ricerca rapida ..."}],"o3":[{pt:"Lendo imagem...",en:"Loading images...",es:"Leyendo imagen...",it:"Lettura di immagini..."}],"o4":[{pt:"Aguarde...abrindo lente",en:"Wait...Opening lens...",es:"Espere...abriendo lente",it:"Attendere...apertura della lente"}],"o5":[{pt:"Aguarde...iniciando",en:"Wait...initializing",es:"Espere...iniciando",it:"Attendere...partenza"}],"o6":[{pt:"din&acirc;mico",en:"dynamic",es:"Din&aacute;mico",it:"Dinamico"}],"d1":[{pt:"Digite as coordenadas de um ponto (X=longitude e Y=latitude) para localiz&acute;-lo no mapa. O centro do mapa ser&acute; deslocado para o ponto digitado.",en:"Enter the coordinates of a point (X=longitude and Y=latitude) to localize it on the map. The center of the map is move to the point entered.",es:"Digite las coordenadas de un punto (X=longitud e Y=latitud) para ubicarlas en el mapa. El centro del mapa se desplazar&aacute; para el punto digitado.",it:"Inserisci le coordinate di un punto (X=longitudine e Y=latitudine) per individuarlo sulla mappa. Il centro della mappa viene spostato al punto digitato"}],"d2":[{pt:"Altera a escala do mapa ajustando-a para mostrar a mesma abrang&circ;ncia geogr&aacute;fica da inicializa&ccedil;&atilde;o.",en:"Change the scale of the map adjusting it to show the same initial geographical cover.",es:"Modifica la escala del mapa ajust&aacute;ndola para mostrar la misma &aacute;rea geogr&aacute;fica inicial",it:"Modificare la scala della mappa adeguandola per mostrare la stessa copertura geografica sin dall'inizializzazione"}],"d3":[{pt:"Amplia o mapa - coloca o ponto clicado no centro da tela ou amplia a regi&atilde;o indicada por um ret&acirc;ngulo.Ap&oacute;s ativada, clique e arraste o mouse sobre o mapa na &aacute;rea de zoom desejada.",en:"Extends the map - place the clicked point in the center of the screen or extends the region indicated by a rectangular.After enabled, click and drag the mouse over the map in the area of zoom desired.",es:"Ampl&iacute;a el mapa - coloca el punto donde se hizo clic en el centro de la pantalla o ampl&iacute;a la regi&oacute;n indicada por un rect&aacute;ngulo. Despu&eacute;s de activarla, haga clic y arrastre el rat&oacute;n sobre el mapa en el &aacute;rea de zoom deseada",it:"Ampliare la mappa - pone il punto cliccato nel centro dello schermo o ingrandisce la regione indicata con un rettangolo. Dopo aver attivata, cliccare e trascinare il mouse sopra la mappa nell’area di zoom desiderata."}],"d4":[{pt:"Desloca a regi&atilde;o vis&iacute;vel no mapa. Ap&oacute;s ativada, clique e arraste o mouse sobre o mapa para deslocar a regi&atilde;o vis&iacute;vel.",en:"Shifts the region visible on the map. Once activated, click and drag the mouse over the map to move the visible region.",es:"Desloca la regi&oacute;n visible en el mapa",it:"Sposta la regione visibile sulla mappa. Dopo averla attivata, cliccare e trascinare il mouse sulla mappa per spostare la regione visibile "}],"d5":[{pt:"Amplia o mapa tendo como refer&ecirc;ncia o centro atual.",en:"Magnify the map with the reference the current center.",es:"Ampl&iacute;a el mapa teniendo como referencia el centro actual",it:"Estendi la mappa tenendo come riferimento il centro corrente."}],"d6":[{pt:"Reduz o mapa tendo como refer&ecircncia o centro atual.",en:"Reduces the map as having reference the current center.",es:"Reduce el mapa teniendo como referencia el centro actual",it:"Riduci la mappa tenendo come referimento il centro corrente"}],"d7":[{pt:"Mostra informa&ccedil;&otilde;es sobre um ponto no mapa. Ap&oacute;s ativada, pare o mouse por alguns instantes no ponto desejado ou clique sobre o mesmo.",en:"Displays information about a point on the map. Once activated, stop the mouse for a few moments at the desired point or click on it.",es:"Muestra informaci&oacute;n sobre un punto en el mapa. Despu&eacute;s de activarla, pare el rat&oacute;n por algunos instantes en el punto deseado o haga clic sobre el mismo.",it:"Mostra gli informazioni su un punto sulla mappa. Dopo averla attivata, fermare il mouse per qualche istante nel punto desiderato o fare clic su di esso."}],"d8":[{pt:"Mostra a extens&atilde;o geogr&aacute;fica atual em coordenadas geogr&aacute;ficas",en:"It shows the extent of current geographic coordinates",es:"Muestra la extensi&oacute;n geográfica actual en coordenadas geogr&aacute;ficas",it:"Mostra la estensione geografica corrente in coordinate geografiche"}],"d9":[{pt:"Abre/fecha o mapa de refer&ecirc;ncia",en:"Open/close the reference map ",es:"Abre/cierra el mapa de referencia",it:"Apertura/chiusura della mappa di riferimento"}],"d10":[{pt:"Digite o novo valor de escala e clique no bot&atilde;o aplicar para alterar a escala do mapa",en:"Enter the new value of scale and click the button Apply to change the scale of the map",es:"Digite el nuevo valor de escala y haga clic en el bot&oacute;n aplicar para modificar la escala del mapa",it:"Immettere il nuovo valore di scala e clicca sul pulsante Applica per cambiare la scala della mappa"}],"d11":[{pt:"Busca dados na Wikipedia na abrang&ecirc;ncia atual do mapa. Fa&ccedil;a um zoom no mapa antes de abrir essa op&ccedil;&atilde;o. Regi&ocirc;es muito extensas podem tornar a busca muito demorada",en:"Search data on Wikipedia in the current scope of the map. Make a zoom on the map before opening this option. Regions very extensive can make a very long search ",es:"Busca datos en Wikipedia en el alcance actual del mapa. Haga zoom en el mapa antes de abrir esta opci&oacute;n. Regiones muy extensas pueden ocasionar una b&uacute;squeda muy lenta",it:"Ricerca dati su Wikipedia nell'ambito corrente della mappa. Fare uno zoom sulla mappa prima dell’apertura di questa opzione. Regioni molto ampie potrebbero causare una ricerca troppo lenta."}],"d12":[{pt:"Imprime o mapa",en:"Print the map",es:"Imprime el mapa",it:"Stampa la mappa"}],"d13":[{pt:"Localiza o IP do usu&aacute;rio no mapa",en:"Locates the user's IP on the map",es:"Ubica el IP del usuario en el mapa",it:"Trova IP dell'utente nella mappa"}],"d14":[{pt:"Gera arquivo para 3d",en:"Generates file for 3d",es:"Genera archivo para 3d",it:"Genera file per 3d"}],"d15":[{pt:"Abre o Google Maps, mostrando uma imagem de sat&eacute;lite da regi&atilde;o vista no mapa principal",en:"Open Google Maps, showing a satellite image of the region's main views on the map",es:"Abre Google Maps, mostrando una imagen de sat&eacute;lite de la regi&oacute;n en el mapa principal",it:"Apri Google Maps, mostrando un'immagine satellitare della regione vista sulla mappa principale."}],"d16":[{pt:"Pesquisa documentos na base de dados Scielo (dados preliminares)",en:"Search documents in the database Scielo (preliminary data)",es:"Busca documentos en la base de datos Scielo (datos preliminares)",it:"Ricerca dei documenti nella base di dati Scielo (dati preliminari)"}],"d17":[{pt:"Projeto Confluence. Pontos de intersec&ccedil;&atilde;o de coordenadas observadas em campo",en:"Confluence Project. Points of intersection of coordinates observed in field",es:"Proyecto Confluence. Puntos de intersecci&oacute;n de coordenadas observadas en campo",it:"Progetto di confluenza. Punti di intersezione delle coordinate osservate in campo"}],"d18":[{pt:"Abre lente de amplia&ccedil;&atilde;o",en:"Opens lens to expansion",es:"Abre lente de ampliaci&oacute;n",it:"Apri lente di ingrandimento"}],"d19":[{pt:"Coloca as guias em uma janela m&oacute;vel",en:"Open the tabs in a window mobile",es:"Coloca las gu&iacute;as en una ventana m&oacute;vil",it:"Aprire le schede in una finestra mobile."}],"d20":[{pt:"Redesenha o mapa com as configura&ccedil;&ocirc;es iniciais.",en:"Reload the map with the initial configurations.",es:"Redise&ntilde;a el mapa con las configuraciones iniciales",it:"Ricarica la mappa con la configurazione iniziale."}],"d21":[{pt:"Mede a dist&acirc;ncia entre dois ou mais pontos clicados no mapa (menor dist&acirc;ncia). O c&aacute;lculo de dist&acirc;ncia &eacute; aproximado e sua precis&atilde;o depende da escala do mapa.",en:"It measures the distance between two or more clicked points on the map (less distance). The calculation of distance is approximate and their accuracy depends on the scale of the map.",es:"Mide la distancia entre dos o m&aacute;s puntos marcados en el mapa (menor distancia). El c&aacute;lculo de distancia es aproximado y su precisi&oacute;n depende de la escala del mapa",it:"Misura la distanza tra due o più punti cliccati sulla mappa (minore distanza). Il calcolo della distanza è approssimativo e la sua precisione dipende dalla scala della mappa."}],"d21a":[{pt:"Mede a &aacute;rea de um pol&iacute;gono desenhado na tela. O c&aacute;lculo de &aacute;ria &eacute; aproximado e sua precis&atilde;o depende da escala do mapa.",en:"It measures the area on the map. The calculation of area is approximate and their accuracy depends on the scale of the map.",es:"Mede a &aacute;rea de um pol&iacute;gono desenhado na tela. O c&aacute;lculo de &aacute;ria &eacute; aproximado e sua precis&atilde;o depende da escala do mapa.",it:"Misura l'area di un poligono tracciato sullo schermo. Il calcolo della superficie è approssimativo e la sua precisione dipende dalla scala della mappa."}],"d22":[{pt:"Insere pontos no mapa em coordenadas geogr&aacute;ficas. Ospontos inclu&iacute;dos podem ser transformados em linhas ou pol&iacute;gonos. Os pontos s&atilde;o armazenados em um tema tempor&aacute;rio, podendo-se fazer o download do arquivo shapefile.",en:"Insert points on the map in geographical coordinates. Items included can be converted into lines or polygons. Items are stored in a temporary layer, can be to download shapefile.",es:"Inserte puntos en el mapa en coordenadas geogr&aacute;ficas. Los puntos incluidos pueden transformarse en l&iacute;neas o pol&iacute;gonos. Los puntos se almacenan en un tema temporal, pudiendo hacerse el download del archivo shapefile.",it:"Inserire punti sulla mappa in coordinate geografiche. I punti inseriti possono essere trasformati in linee o poligoni. I punti vengono memorizzati in un tema temporaneo, con la possibilità di effettuare il download del file Shapefile."}],"d23":[{pt:"Insere um gr&aacute;fico no ponto clicado conforme os atributos existentes no tema escolhido. O tema deve possuir itens com valores num&eacute;ricos na tabela de atributos.",en:"Insert a graphic in the clicked point as the exist attributes in the chosen layer. The layer must have items with numerical values in the table of attributes.",es:"Inserte un gr&aacute;fico en el punto marcado seg&uacute;n los atributos existentes en el tema elejido. El tema debe tener puntos con valores num&eacute;ricos en la tabla de atributos",it:"Inserire un grafico nel punto cliccato con gli attributi che esistono nel tema scelto. Il tema deve avere gli oggetti con valori numerici contenute nella tabella di attributi."}],"d24":[{pt:"Abre as ferramentas para sele&ccedil;&atilde;o de elementos de um tema. Os elementos selecionados podem ser utilizados em outras opera&ccedil;&ocirc;es, como buffer e sele&ccedil;&atilde;o por tema.",en:"Opens the tools to select elements of a layer. The elements selected can be used in other buffer or selection operation by layer  .",es:"Abre las herramientas para selecci&oacute;n de elementos de un tema. Los elementos seleccionados pueden utilizarse en otras ",it:"Aprire gli strumenti per selezionare gli elementi di un tema. Gli elementi selezionati possono essere utilizzati in altre operazioni, come ad esempio buffer e selezione per tema."}],"d25":[{pt:"Insere texto no mapa clicando em um ponto. Utilize essa op&ccedil;&atilde;o para adicionar informa&ccedil;&ocirc;es ao mapa.",en:"Insert text on the map by clicking on a point. Use this option to add information on the map.",es:"Inserte texto en el mapa haciendo clic en un punto. Utilice esta opci&oacute;n para agregar informaci&oacute;n al mapa",it:"Inserisci il testo sulla mappa cliccando su un punto. Utilizzare questa opzione per aggiungere informazioni alla mappa."}],"d26":[{pt:"Escolha o visual para os botões e outras caracter&iacute;sticas visuais do mapa",en:"Choose look for the buttons and other map's visual characteristics",es:"Elija la vista para los botones y otras caracter&iacute;sticas visuales del mapa",it:"Scegli il visuale (??)  per i pulsanti e le altre caratteristiche visive della mappa."}],"d27":[{pt:"Interface",en:"Interface",es:"Interface",it:"Interface"}]};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.idioma={MOSTRASELETOR:true,IDSELETOR:"",SELETORES:new Array("pt","en","es","it"),DICIONARIO:g_traducao,define:function(codigo){i3GEO.idioma.ATUAL=codigo;i3GEO.util.insereCookie("i3geolingua",codigo)},retornaAtual:function(){return(i3GEO.idioma.ATUAL)},defineDicionario:function(obj){i3GEO.idioma.DICIONARIO=obj},alteraDicionario:function(id,novo){i3GEO.idioma.DICIONARIO[id][0][i3GEO.idioma.ATUAL]=novo},traduzir:function(id){if(i3GEO.idioma.DICIONARIO[id]){var t=i3GEO.idioma.DICIONARIO[id][0];return t[i3GEO.idioma.ATUAL]}else return},adicionaDicionario:function(novodic){for(k in novodic){i3GEO.idioma.DICIONARIO[k]=novodic[k]}},mostraDicionario:function(){var w=window.open();for(k in i3GEO.idioma.DICIONARIO){w.document.write(k+" = "+i3GEO.idioma.traduzir(k)+"<br>")}},trocaIdioma:function(codigo){i3GEO.util.insereCookie("i3geolingua",codigo);window.location.reload(true)},listaIdiomas:function(){for(k in i3GEO.idioma.DICIONARIO){return(i3GEO.util.listaChaves(i3GEO.idioma.DICIONARIO[k][0]))}},mostraSeletor:function(){if(!i3GEO.idioma.MOSTRASELETOR){return}var ins="";var n=i3GEO.idioma.SELETORES.length;if(i3GEO.parametros.w<550){var w="width:12px;"}else{var w=""}for(i=0;i<n;i++){ins+='<img  style="'+w+'padding:0 0px;top:-7px;padding-right:0px;border: 1px solid white;" src="'+i3GEO.util.$im("branco.gif")+'" onclick="i3GEO.idioma.trocaIdioma(\''+i3GEO.idioma.SELETORES[i]+'\')" ';if(i3GEO.idioma.SELETORES[i]=="en")ins+='alt="Ingles" id="uk" />';if(i3GEO.idioma.SELETORES[i]=="pt")ins+='alt="Portugues" id="brasil" />';if(i3GEO.idioma.SELETORES[i]=="es")ins+='alt="Espanhol" id="espanhol" />';if(i3GEO.idioma.SELETORES[i]=="it")ins+='alt="Italiano" id="italiano" />'}if(i3GEO.idioma.IDSELETOR!=""&&$i(i3GEO.idioma.IDSELETOR)){$i(i3GEO.idioma.IDSELETOR).innerHTML=ins}else{var pos=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));if(!$i("i3geoseletoridiomas")){var novoel=document.createElement("div");novoel.innerHTML=ins;novoel.id="i3geoseletoridiomas";document.body.appendChild(novoel)}else{var novoel=$i("i3geoseletoridiomas")}novoel.style.position="absolute";novoel.style.top=pos[1]-17+"px";novoel.style.left=pos[0]+"px";novoel.style.zIndex=5000}}};var $trad=function(id){return(i3GEO.idioma.traduzir(id))};try{var c=i3GEO.util.pegaCookie("i3geolingua");if(c){i3GEO.idioma.define(c);g_linguagem=c}else{if(typeof(g_linguagem)!="undefined"){i3GEO.idioma.define(g_linguagem)}else{g_linguagem="pt";i3GEO.idioma.define("pt")}}if(typeof('g_traducao')!="undefined"){i3GEO.idioma.defineDicionario(g_traducao)}}catch(e){alert("Problemas com idiomas "+e)};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}cpJSON=new cpaint();cpJSON.set_response_type("JSON");i3GEO.php={verifica:function(){if(i3GEO.configura.locaplic==undefined){alert("variavel i3GEO.configura.locaplic não esta definida")}if(i3GEO.configura.sid==undefined){alert("variavel i3GEO.configura.locaplic não esta definida")}},insereSHPgrafico:function(funcao,tema,x,y,itens,shadow_height,width,inclinacao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHPgrafico&tipo=pizza&tema="+tema+"&x="+x+"&y="+y+"&itens="+itens+"&shadow_height="+shadow_height+"&width="+width+"&inclinacao="+inclinacao+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"insereSHPgrafico",funcao)},insereSHP:function(funcao,tema,item,valoritem,xy){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=insereSHP&item="+item+"&valor="+valoritem+"&tema="+tema+"&xy="+xy+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"insereSHPgrafico",funcao)},pegaMensagens:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMensagens&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"pegaMensagem",funcao)},areaPixel:function(funcao,g_celula){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=areaPixel&celsize="+g_celula+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"areaPixel",funcao)},excluitema:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=excluitema&temas="+tema+"&g_sid="+i3GEO.arvoreDeCamadas.SID;cpJSON.call(p,"excluitema",funcao)},reordenatemas:function(funcao,lista){i3GEO.php.verifica();var p=i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=reordenatemas&lista="+lista+"&g_sid="+i3GEO.arvoreDeCamadas.SID;cpJSON.call(p,"reordenatemas",funcao)},criaLegendaHTML:function(funcao,tema,template){i3GEO.php.verifica();var c="sim";if(arguments.length==1){var tema="";var template="legenda2.htm"}if(arguments.length==2){var template="legenda2.htm"}var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&tema="+tema+"&templateLegenda="+template+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"criaLegendaHTML",funcao)},inverteStatusClasse:function(funcao,tema,classe){i3GEO.php.verifica();var p=i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=inverteStatusClasse&g_sid="+i3GEO.arvoreDeCamadas.SID+"&tema="+tema+"&classe="+classe;cpJSON.call(p,"inverteStatusClasse",funcao)},ligatemas:function(funcao,desligar,ligar){i3GEO.php.verifica();var p=i3GEO.arvoreDeCamadas.LOCAPLIC+"/classesphp/mapa_controle.php?funcao=ligatemas&desligar="+desligar+"&ligar="+ligar+"&g_sid="+i3GEO.arvoreDeCamadas.SID;cpJSON.call(p,"ligaDesligaTemas",funcao)},pegalistademenus:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistademenus&g_sid="+i3GEO.configura.sid+"&map_file=";cpJSON.call(p,"pegalistademenus",funcao)},pegalistadegrupos:function(funcao,id_menu,listasgrupos){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadegrupos&map_file=&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&listasistemas=nao&listasgrupos="+listasgrupos;cpJSON.call(p,"pegalistadegrupos",funcao)},pegalistadeSubgrupos:function(funcao,id_menu,id_grupo){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadeSubgrupos&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&map_file=";cpJSON.call(p,"pegalistadeSubgrupos",funcao)},pegalistadetemas:function(funcao,id_menu,id_grupo,id_subgrupo){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegalistadetemas&g_sid="+i3GEO.configura.sid+"&idmenu="+id_menu+"&grupo="+id_grupo+"&subgrupo="+id_subgrupo+"&map_file=";cpJSON.call(p,"pegalistadetemas",funcao)},pegaSistemas:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaSistemas&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"pegaSistemas",funcao)},listadrives:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaDrives&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"listaDrives",funcao)},listaarquivos:function(funcao,caminho){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=listaArquivos&diretorio="+caminho;cpJSON.call(p,"listaArquivos",funcao)},geo2utm:function(funcao,x,y){i3GEO.php.verifica();if($i("aguardeGifAberto")){return}var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=geo2utm&x="+x+"&y="+y+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"geo2utm",funcao)},desativacgi:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=desativacgi&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"desativacgi",funcao)},pegaMapas:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMapas&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"pegaSistemas",funcao)},mudatamanho:function(funcao,altura,largura){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudatamanho&altura="+altura+"&largura="+largura+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"pegaSistemas",funcao)},ativalogo:function(funcao,altura,largura){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=ativalogo&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"ativalogo",funcao)},insereAnnotation:function(funcao,pin,xy,texto,position,partials,offsetx,offsety,minfeaturesize,mindistance,force,shadowcolor,shadowsizex,shadowsizey,outlinecolor,cor,sombray,sombrax,sombra,fundo,angulo,tamanho,fonte){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inserefeature&pin="+pin+"&tipo=ANNOTATION&xy="+xy+"&texto="+texto+"&position="+position+"&partials="+partials+"&offsetx="+offsetx+"&offsety="+offsety+"&minfeaturesize="+minfeaturesize+"&mindistance="+mindistance+"&force="+force+"&shadowcolor="+shadowcolor+"&shadowsizex="+shadowsizex+"&shadowsizey="+shadowsizey+"&outlinecolor="+outlinecolor+"&cor="+cor+"&sombray="+sombray+"&sombrax="+sombrax+"&sombra="+sombra+"&fundo="+fundo+"&angulo="+angulo+"&tamanho="+tamanho+"&fonte="+fonte+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"inserefeature",funcao)},identificaunico:function(funcao,xy,tema,item){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=identificaunico&xy="+xy+"&resolucao=5&tema="+tema+"&item="+item+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"identificaunico",funcao)},recuperamapa:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=recuperamapa&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"recuperamapa",funcao)},criaLegendaImagem:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaImagem&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"criaLegendaImagem",funcao)},referenciadinamica:function(funcao,zoom,tipo){i3GEO.php.verifica();if(arguments.length==2){var tipo="dinamico"}var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referenciadinamica&g_sid="+i3GEO.configura.sid+"&zoom="+zoom+"&tipo="+tipo;cpJSON.call(p,"retornaReferenciaDinamica",funcao)},referencia:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=referencia&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"retornaReferencia",funcao)},pan:function(funcao,escala,tipo,x,y){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pan&escala="+escala+"&tipo="+tipo+"&x="+x+"&y="+y+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"pan",funcao)},aproxima:function(funcao,nivel){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=aproxima&nivel="+nivel+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"aproxima",funcao)},afasta:function(funcao,nivel){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=afasta&nivel="+nivel+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"afasta",funcao)},zoomponto:function(funcao,x,y){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomponto&pin=pin&xy="+x+" "+y+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"zoomponto",funcao)},localizaIP:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=localizaIP&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"localizaIP",funcao)},mudaext:function(funcao,tipoimagem,ext,locaplic,sid){if(arguments.length==3){i3GEO.php.verifica();var locaplic=i3GEO.configura.locaplic;var sid=i3GEO.configura.sid}if(ext=='undefined'){alert("extensao nao definida");return}var retorno=function(retorno){if(i3GEO.interface.ATUAL=="googlemaps"){i3GEO.interface.googlemaps.zoom2extent(ext);i3GEO.janela.fechaAguarde()}if(i3GEO.interface.ATUAL=="openlayers"){i3GEO.interface.openlayers.zoom2ext(ext);i3GEO.janela.fechaAguarde()}if(i3GEO.interface.ATUAL=="padrao"){funcao.call()}};var p=locaplic+"/classesphp/mapa_controle.php?funcao=mudaext&tipoimagem="+tipoimagem+"&ext="+ext+"&g_sid="+sid;cpJSON.call(p,"mudaext",retorno)},mudaescala:function(funcao,escala){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudaescala&escala="+escala+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"mudaescala",funcao)},aplicaResolucao:function(funcao,resolucao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=crialente&resolucao="+resolucao+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"crialente",funcao)},geradestaque:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=geradestaque&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"geradestaque",funcao)},selecaopt:function(funcao,tema,xy,tipo,tolerancia){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaopt&tema="+tema+"&tipo="+tipo+"&xy="+xy+"&tolerancia="+tolerancia+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"selecaoPT",funcao)},selecaobox:function(funcao,tema,tipo,box){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=selecaobox&ext="+box+"&g_sid="+i3GEO.configura.sid+"&tipo="+tipo+"&tema="+tema;cpJSON.call(p,"selecaobox",funcao)},sobetema:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=sobetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"sobetema",funcao)},descetema:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?&funcao=descetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"descetema",funcao)},fontetema:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=fontetema&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"fontetema",funcao)},zoomtema:function(funcao,tema){i3GEO.php.verifica();var retorno=function(retorno){if(i3GEO.interface.ATUAL=="googlemaps"){eval(retorno.data.variaveis);i3GEO.interface.googlemaps.zoom2extent(mapexten);i3GEO.janela.fechaAguarde()}if(i3GEO.interface.ATUAL=="openlayers"){eval(retorno.data.variaveis);i3GEO.interface.openlayers.zoom2ext(mapexten);i3GEO.janela.fechaAguarde()}if(i3GEO.interface.ATUAL=="padrao"){funcao.call()}};var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomtema&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"zoomtema",retorno)},zoomsel:function(funcao,tema){i3GEO.php.verifica();var retorno=function(retorno){if(i3GEO.interface.ATUAL=="googlemaps"){eval(retorno.data.variaveis);i3GEO.interface.googlemaps.zoom2extent(mapexten);i3GEO.janela.fechaAguarde()}if(i3GEO.interface.ATUAL=="openlayers"){eval(retorno.data.variaveis);i3GEO.interface.openlayers.zoom2ext(mapexten);i3GEO.janela.fechaAguarde()}if(i3GEO.interface.ATUAL=="padrao"){funcao.call()}};var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=zoomsel&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"zoomsel",retorno)},limpasel:function(funcao,tema){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=limpasel&tema="+tema+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"limpasel",funcao)},mudatransp:function(funcao,tema,valor){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudatransp&tema="+tema+"&valor="+valor+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"mudatransp",funcao)},mudanome:function(funcao,tema,valor){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=mudanome&tema="+tema+"&valor="+valor+"&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"mudanome",funcao)},adicionaTemaWMS:function(funcao,servico,tema,nome,proj,formato,versao,nomecamada,tiporep,suportasld,formatosinfo,locaplic,sid){if(arguments.length==11){i3GEO.php.verifica();var locaplic=i3GEO.configura.locaplic;var sid=i3GEO.configura.sid}var p=locaplic+"/classesphp/mapa_controle.php?g_sid="+sid+"&funcao=adicionatemawms&servico="+servico+"&tema="+tema+"&nome="+nome+"&proj="+proj+"&formato="+formato+"&versao="+versao+"&nomecamada="+nomecamada+"&tiporep="+tiporep+"&suportasld="+suportasld+"&formatosinfo="+formatosinfo;cpJSON.call(p,"adicionatemawms",funcao)},adicionaTemaSHP:function(funcao,path){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaSHP&arq="+path;cpJSON.call(p,"adicionaTemaSHP",funcao)},adicionaTemaIMG:function(funcao,path){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=adicionaTemaIMG&arq="+path;cpJSON.call(p,"adicionaTemaIMG",funcao)},identifica:function(funcao,x,y,resolucao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=identifica&opcao=tip&xy="+x+","+y+"&resolucao=5&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"identifica",funcao)},reiniciaMapa:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=reiniciaMapa&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"reiniciaMapa",funcao)},procurartemas:function(funcao,procurar,locaplic){if(arguments.length==2){var locaplic=i3GEO.configura.locaplic}var p=locaplic+"/classesphp/mapa_controle.php?funcao=procurartemas&map_file=&procurar="+procurar;cpJSON.call(p,"procurartemas",funcao)},adtema:function(funcao,temas,locaplic,sid){if(arguments.length==2){i3GEO.php.verifica();var locaplic=i3GEO.configura.locaplic;var sid=i3GEO.configura.sid}var p=locaplic+"/classesphp/mapa_controle.php?funcao=adtema&temas="+temas+"&g_sid="+sid;cpJSON.call(p,"adtema",funcao)},escalagrafica:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=escalagrafica&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"escalagrafica",funcao)},flamingo:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=montaFlamingo&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"montaFlamingo",funcao)},openlayers:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=openlayers&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"openlayers",funcao)},corpo:function(funcao,tipoimagem){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=corpo&tipoimagem="+tipoimagem+"&g_sid="+i3GEO.configura.sid+"&interface="+i3GEO.interface.ATUAL;cpJSON.call(p,"corpo",funcao)},criamapa:function(funcao,parametros){var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=criaMapa&"+parametros;cpJSON.call(p,"criaMapa",funcao)},inicia:function(funcao,embedLegenda,w,h){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=inicia&embedLegenda="+embedLegenda+"&w="+w+"&h="+h+"&g_sid="+i3GEO.configura.sid+"&interface="+i3GEO.interface.ATUAL;cpJSON.call(p,"iniciaMapa",funcao)},chaveGoogle:function(funcao){i3GEO.php.verifica();var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=chavegoogle&g_sid="+i3GEO.configura.sid;cpJSON.call(p,"chavegoogle",funcao)},listaRSSwsARRAY:function(funcao,tipo){var p=i3GEO.configura.locaplic+"/classesphp/wscliente.php?funcao=listaRSSwsARRAY&rss="+new Array("|")+"&tipo="+tipo;cpJSON.call(p,"listaRSSwsARRAY",funcao)},listaLayersWMS:function(funcao,servico,nivel,id_ws,nomelayer){var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=listaLayersWMS&servico="+servico+"&nivel="+nivel+"&id_ws="+id_ws+"&nomelayer="+nomelayer;cpJSON.call(p,"listaLayersWMS",funcao)},buscaRapida:function(funcao,locaplic,servico,palavra){var p=locaplic+"/classesphp/mapa_controle.php?map_file=&funcao=buscaRapida&palavra="+palavra+"&servico="+servico;cpJSON.call(p,"buscaRapida",funcao)}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.configura={oMenuData:{menu:[{nome:$trad("s1"),id:"ajudaMenu"},{nome:$trad("s2"),id:"analise"},{nome:$trad("s3"),id:"janelas"},{nome:$trad("s4"),id:"arquivos"},{nome:$trad("d27"),id:"interface"}],submenus:{"ajudaMenu":[{text:$trad("u1"),url:"http://www.softwarepublico.gov.br/spb/ver-comunidade?community_id=1444332",target:"_blank"},{text:$trad("u2"),url:"javascript:i3GEO.ajuda.abreDoc()"},{text:$trad("u3"),url:"http://pt.wikibooks.org/wiki/I3geo",target:"_blank"},{text:$trad("u4"),url:"http://mapas.mma.gov.br/wikibooki3geo",target:"_blank"},{text:$trad("u5a"),url:"http://www.softwarepublico.gov.br",target:"_blank"},{text:"i3Geo Blog",url:"http://sistemas.mma.gov.br/blogs/index.php?blog=6",target:"_blank"},{text:"Lista de funções",url:"http://mapas.mma.gov.br/i3geo/ajuda_usuario.php",target:"_blank"}],"analise":[{text:'<span style=color:gray;text-decoration:underline; ><b>'+$trad("u22")+'</b></span>',url:"#"},{text:$trad("u7"),url:"javascript:i3GEO.analise.dialogo.gradePol()"},{text:$trad("u8"),url:"javascript:i3GEO.analise.dialogo.gradePontos()"},{text:$trad("u9"),url:"javascript:i3GEO.analise.dialogo.gradeHex()"},{text:'<span style=color:gray;text-decoration:underline; ><b>'+$trad("u23")+'</b></span>',url:"#"},{text:$trad("u11a"),url:"javascript:i3GEO.analise.dialogo.distanciaptpt()"},{text:$trad("u12"),url:"javascript:i3GEO.analise.dialogo.nptPol()"},{text:$trad("u13"),url:"javascript:i3GEO.analise.dialogo.pontoempoligono()"},{text:$trad("u14"),url:"javascript:i3GEO.analise.dialogo.pontosdistri()"},{text:'<span style=color:gray;text-decoration:underline; ><b>'+$trad("u24")+'</b></span>',url:"#"},{text:$trad("u11"),url:"javascript:i3GEO.analise.dialogo.centroide()"},{text:$trad("u25"),url:"javascript:i3GEO.analise.dialogo.dissolve()"},{text:'<span style=color:gray;text-decoration:underline; ><b>'+$trad("u27")+'</b></span>',url:"#"},{text:$trad("u6"),url:"javascript:i3GEO.analise.dialogo.analisaGeometrias()"},{text:$trad("u10"),url:"javascript:i3GEO.analise.dialogo.buffer()"},{text:$trad("u26"),url:"javascript:i3GEO.analise.dialogo.agrupaElementos()"}],"janelas":[{text:$trad("u15"),url:"javascript:initJanelaZoom('1');initJanelaZoom('2')"},{text:$trad("u16"),url:"javascript:i3GEO.ajuda.abreJanela()"}],"arquivos":[{text:$trad("u17"),url:"javascript:i3GEO.mapa.dialogo.salvaMapa()"},{text:$trad("u18"),url:"javascript:i3GEO.mapa.dialogo.carregaMapa()"},{text:$trad("u19"),url:"javascript:i3GEO.gadgets.quadros.listaImagens()"},{text:$trad("u20"),url:"javascript:i3GEO.mapa.dialogo.convertews()"},{text:$trad("u20a"),url:"javascript:i3GEO.mapa.dialogo.convertekml()"},{text:$trad("u21"),url:"../geradordelinks.htm"}],"interface":[{text:"Normal",url:"javascript:window.location = i3GEO.configura.locaplic+'/aplicmap/geral.htm?'+i3GEO.configura.sid"},{text:"Google Maps",url:"javascript:window.location = i3GEO.configura.locaplic+'/aplicmap/googlemaps.phtml?'+i3GEO.configura.sid"},{text:"Google Earth",url:"javascript:window.location = i3GEO.configura.locaplic+'/aplicmap/googleearth.phtml?'+i3GEO.configura.sid"}]}},tipoimagem:"nenhum",tipotip:"balao",funcaoTip:"i3GEO.mapa.dialogo.verificaTipDefault()",funcaoIdentifica:"i3GEO.mapa.dialogo.cliqueIdentificaDefault()",diminuixM:13,diminuixN:11,diminuiyM:106,diminuiyN:103,map3d:"",embedLegenda:"nao",templateLegenda:"",mashuppar:"",sid:"",locaplic:"",mapaRefDisplay:"block",visual:"default",cursores:{"identifica":{ff:"pointer",ie:"pointer"},"pan":{ff:"/imagens/cursores/pan.png",ie:"/imagens/cursores/pan.cur"},"area":{ff:"/imagens/cursores/area.png",ie:"crosshair"},"distancia":{ff:"/imagens/cursores/distancia.png",ie:"crosshair"},"zoom":{ff:"/imagens/cursores/zoom.png",ie:"/imagens/cursores/zoom.cur"},"contexto":{ff:"/imagens/cursores/contexto.png",ie:"/imagens/cursores/contexto.cur"},"identifica_contexto":{ff:"pointer",ie:"pointer"},"pan_contexto":{ff:"/imagens/cursores/pan_contexto.png",ie:"/imagens/cursores/pan_contexto.cur"},"zoom_contexto":{ff:"/imagens/cursores/zoom_contexto.png",ie:"/imagens/cursores/zoom_contexto.cur"}},listaDePropriedadesDoMapa:{"propriedades":[{text:"p2",url:"javascript:i3GEO.mapa.dialogo.tipoimagem()"},{text:"p3",url:"javascript:i3GEO.mapa.dialogo.opcoesLegenda()"},{text:"p4",url:"javascript:i3GEO.mapa.dialogo.opcoesEscala()"},{text:"p5",url:"javascript:i3GEO.mapa.dialogo.tamanho()"},{text:"p6",url:"javascript:i3GEO.navega.entorno.ativaDesativa()"},{text:"p7",url:"javascript:i3GEO.mapa.ativaLogo()"},{text:"p8",url:"javascript:i3GEO.mapa.dialogo.queryMap()"},{text:"p9",url:"javascript:i3GEO.mapa.dialogo.corFundo()"},{text:"p10",url:"javascript:i3GEO.mapa.dialogo.gradeCoord()"},{text:"p11",url:"javascript:i3GEO.mapa.dialogo.template()"},{text:"p12",url:"javascript:i3GEO.mapa.dialogo.autoredesenha()"}]},tempoAplicar:4000,tempoMouseParado:3500,iniciaJanelaMensagens:true,mostraRosaDosVentos:"nao",liberaGuias:"nao",entorno:"nao",funcoesBotoes:{"botoes":[{iddiv:"historicozoom",tipo:"",dica:$trad("d1"),constroiconteudo:'i3GEO.gadgets.mostraHistoricoZoom()'},{iddiv:"zoomtot",tipo:"",dica:$trad("d2"),funcaoonclick:function(){if(i3GEO.interface.ATUAL=="openlayers"){i3GEO.interface.openlayers.zoom2ext(i3GEO.parametros.extentTotal);return}i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.configura.tipoimagem,i3GEO.parametros.extentTotal);marcadorZoom=""}},{iddiv:"zoomli",tipo:"dinamico",dica:$trad("d3"),funcaoonclick:function(){var temp="zoom";if(i3GEO.interface.ATIVAMENUCONTEXTO)var temp="zoom_contexto";i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,"img",i3GEO.configura.locaplic);g_operacao='navega';g_tipoacao='zoomli';i3GEO.barraDeBotoes.ativaIcone("zoomli");marcadorZoom="";if(i3GEO.interface.ATUAL=="openlayers"){OLpanel.activateControl(OLzoom);return}if(!$i("i3geoboxZoom"))i3GEO.navega.zoomBox.criaBox();if(i3GEO.eventos.MOUSEDOWN.toString().search("i3GEO.navega.zoomBox.inicia()")<0){i3GEO.eventos.MOUSEDOWN.push("i3GEO.navega.zoomBox.inicia()")}if(i3GEO.eventos.MOUSEUP.toString().search("i3GEO.navega.zoomBox.termina()")<0){i3GEO.eventos.MOUSEUP.push("i3GEO.navega.zoomBox.termina()")}}},{iddiv:"pan",tipo:"dinamico",dica:$trad("d4"),funcaoonclick:function(){g_tipoacao='pan';g_operacao='navega';i3GEO.barraDeBotoes.ativaIcone("pan");if($i(i3GEO.interface.IDMAPA)){$i(i3GEO.interface.IDMAPA).title="";var temp="pan";if(i3GEO.interface.ATIVAMENUCONTEXTO)var temp="pan_contexto";i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,i3GEO.interface.IDMAPA,i3GEO.configura.locaplic)}marcadorZoom="";if(i3GEO.interface.ATUAL=="openlayers"){OLpanel.activateControl(OLpan);return}panMapaInicia=function(exy){if($i("img")&&(g_tipoacao=="pan")){try{if(navm){var k=event.button}else{var k=exy.button}if(k==2){return}}catch(h){}g_panM="sim";if($i("corpoMapa")){leftinicial=parseInt($i(i3GEO.interface.IDCORPO).style.left);topinicial=parseInt($i(i3GEO.interface.IDCORPO).style.top)}clicinicialx=objposicaocursor.imgx;clicinicialy=objposicaocursor.imgy;ddinicialx=objposicaocursor.ddx;ddinicialy=objposicaocursor.ddy;boxrefObj=$i("boxref");if(boxrefObj){proporcaoBox=i3GEO.parametros.w/parseInt(boxrefObj.style.width);boxrefObjLeft=parseInt(boxrefObj.style.left);boxrefObjTop=parseInt(boxrefObj.style.top)}}};panMapaDesloca=function(){if($i(i3GEO.interface.IDMAPA)&&(g_panM=="sim")){var nx=objposicaocursor.telax-leftinicial-clicinicialx;var ny=objposicaocursor.telay-topinicial-clicinicialy;if(i3GEO.configura.entorno=="nao"){var l=0;if(parseInt($i("i3geo").style.left)){var l=parseInt($i("i3geo").style.left)}$i(i3GEO.interface.IDMAPA).style.left=nx-l;var t=0;if(parseInt($i("i3geo").style.top)){var t=parseInt($i("i3geo").style.top)}$i(i3GEO.interface.IDMAPA).style.top=ny-t;if(boxrefObj){boxrefObj.style.left=boxrefObjLeft-(nx/proporcaoBox);boxrefObj.style.top=boxrefObjTop-(ny/proporcaoBox)}}else{$left("img",i3GEO.parametros.w*-1+nx);$left("imgS",i3GEO.parametros.w*-1+nx);$left("imgL",i3GEO.parametros.w+nx);$left("imgO",i3GEO.parametros.w*-3+nx);$left("imgN",i3GEO.parametros.w*-1+nx);$top("img",i3GEO.parametros.h*-1+ny);$top("imgS",i3GEO.parametros.h*-1+ny);$top("imgL",i3GEO.parametros.h*-1+ny);$top("imgN",i3GEO.parametros.h*-1+ny);$top("imgO",i3GEO.parametros.h*-1+ny)}}};panMapaTermina=function(){if(g_tipoacao=="pan"){marcadorZoom="";g_panM="nao";var res=i3GEO.navega.xy2xy(i3GEO.configura.locaplic,i3GEO.configura.sid,ddinicialx,ddinicialy,objposicaocursor.ddx,objposicaocursor.ddy,i3GEO.parametros.mapexten,i3GEO.configura.tipoimagem);if(res==false){i3GEO.navega.zoompontoIMG(i3GEO.configura.locaplic,i3GEO.configura.sid,objposicaocursor.imgx,objposicaocursor.imgy)}}};if(i3GEO.eventos.MOUSEDOWN.toString().search("panMapaInicia()")<0){i3GEO.eventos.MOUSEDOWN.push("panMapaInicia()")}if(i3GEO.eventos.MOUSEMOVE.toString().search("panMapaDesloca()")<0){i3GEO.eventos.MOUSEMOVE.push("panMapaDesloca()")}if(i3GEO.eventos.MOUSEUP.toString().search("panMapaTermina()")<0){i3GEO.eventos.MOUSEUP.push("panMapaTermina()")}}},{iddiv:"zoomiauto",tipo:"",dica:$trad("d5"),funcaoonclick:function(){i3GEO.navega.zoomin(i3GEO.configura.locaplic,i3GEO.configura.sid);marcadorZoom=""}},{iddiv:"zoomoauto",tipo:"",dica:$trad("d6"),funcaoonclick:function(){i3GEO.navega.zoomout(i3GEO.configura.locaplic,i3GEO.configura.sid);marcadorZoom=""}},{iddiv:"identifica",tipo:"dinamico",dica:$trad("d7"),funcaoonclick:function(){if($i("img")){$i("img").title="";var temp="identifica";if(i3GEO.interface.ATIVAMENUCONTEXTO)var temp="identifica_contexto";i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,"img",i3GEO.configura.locaplic)}i3GEO.barraDeBotoes.ativaIcone("identifica");g_tipoacao='identifica';g_operacao='identifica';cliqueIdentifica=function(){if(g_operacao=="identifica"){eval(i3GEO.configura.funcaoIdentifica)}};verificaTip=function(){if(g_operacao!="identifica"){return}if($i("marcaIdentifica")){return}if(g_operacao=="identifica"){eval(i3GEO.configura.funcaoTip)}};if(i3GEO.eventos.MOUSECLIQUE.toString().search("cliqueIdentifica()")<0){i3GEO.eventos.MOUSECLIQUE.push("cliqueIdentifica()")}if(i3GEO.eventos.MOUSEPARADO.toString().search("verificaTip()")<0){i3GEO.eventos.MOUSEPARADO.push("verificaTip()")}}},{iddiv:"exten",tipo:"",dica:$trad("d8"),funcaoonclick:function(){i3GEO.janela.cria("450px","340px",i3GEO.configura.locaplic+"/ferramentas/mostraexten/index.htm","","","Extensão geográfica <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=7&idajuda=55' >&nbsp;&nbsp;&nbsp;</a>")}},{iddiv:"referencia",tipo:"",dica:$trad("d9"),funcaoonclick:function(){i3GEO.maparef.inicia()}},{iddiv:"wiki",tipo:"",dica:$trad("d11"),funcaoonclick:function(){wikiAtivo=false;g_operacao="navega";i3GEO.janela.cria("450px","190px",i3GEO.configura.locaplic+"/ferramentas/wiki/index.htm","","","Wiki <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=8&idajuda=73' >&nbsp;&nbsp;&nbsp;</a>");atualizawiki=function(){if(!$i("wdocai")){i3GEO.eventos.NAVEGAMAPA.remove("atualizawiki()");return}var docel=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument;if(docel.getElementById("resultadowiki")){$i("wdocai").src=i3GEO.configura.locaplic+"/ferramentas/wiki/index.htm"}else{wikiAtivo=false;i3GEO.eventos.NAVEGAMAPA.remove("atualizawiki()");if(i3GEO.interface.ATUAL=="googlemaps"){GEvent.removeListener(wikiDragend);GEvent.removeListener(wikiZoomend)}}};if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizawiki()")<0){i3GEO.eventos.NAVEGAMAPA.push("atualizawiki()");if(i3GEO.interface.ATUAL=="googlemaps"){wikiDragend=GEvent.addListener(i3GeoMap,"dragend",function(){atualizawiki()});wikiZoomend=GEvent.addListener(i3GeoMap,"zoomend",function(){atualizawiki()})}if(i3GEO.interface.ATUAL=="openlayers"){i3geoOL.events.register("moveend",i3geoOL,function(e){atualizawiki()})}}}},{iddiv:"buscafotos",tipo:"",dica:"Fotos",funcaoonclick:function(){g_operacao="navega";i3GEO.janela.cria("550px","400px",i3GEO.configura.locaplic+"/ferramentas/buscafotos/index.htm","","","Fotos <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=8&idajuda=74' >&nbsp;&nbsp;&nbsp;</a>");i3GEO.util.criaPin()}},{iddiv:"imprimir",tipo:"",dica:$trad("d12"),funcaoonclick:function(){i3GEO.janela.cria("320px","180px",i3GEO.configura.locaplic+"/ferramentas/imprimir/index.htm","","","Imprimir <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=49' >&nbsp;&nbsp;&nbsp;</a>")}},{iddiv:"ondeestou",tipo:"",dica:$trad("d13"),funcaoonclick:function(){i3GEO.navega.zoomIP(i3GEO.configura.locaplic,i3GEO.configura.sid)}},{iddiv:"v3d",tipo:"",dica:$trad("d14"),funcaoonclick:function(){i3GEO.janela.cria("400px","200px",i3GEO.configura.locaplic+"/ferramentas/3d/index.htm","","","3d <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=7&idajuda=69' >&nbsp;&nbsp;&nbsp;</a>")}},{iddiv:"google",tipo:"",dica:$trad("d15"),funcaoonclick:function(){i3GEO.util.criaBox();g_operacao="navega";if(navn){i3GEO.janela.cria((i3GEO.parametros.w/2)+40+"px",(i3GEO.parametros.h/2)+50+"px",i3GEO.configura.locaplic+"/ferramentas/googlemaps/index.php","","","Google maps <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=7&idajuda=68' >&nbsp;&nbsp;&nbsp;</a>")}else{i3GEO.janela.cria("500px","380px",i3GEO.configura.locaplic+"/ferramentas/googlemaps/index.php","","","Google maps <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=7&idajuda=68' >&nbsp;&nbsp;&nbsp;</a>")}atualizagoogle=function(){try{if(navn){if($i("wdocai")){var doc=$i("wdocai").contentDocument}}else{if(document.frames("wdocai")){var doc=document.frames("wdocai").document}}if(window.parent.frames["wdocai"].panTogoogle){window.parent.frames["wdocai"].panTogoogle()}else{i3GEO.eventos.NAVEGAMAPA.remove("atualizagoogle()")}}catch(e){i3GEO.eventos.NAVEGAMAPA.remove("atualizagoogle()")}};if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizagoogle()")<0){i3GEO.eventos.NAVEGAMAPA.push("atualizagoogle()")}if(i3GEO.interface.ATUAL=="openlayers"){i3geoOL.events.register("moveend",i3geoOL,function(e){try{window.parent.frames["wdocai"].panTogoogle()}catch(x){}})}}},{iddiv:"scielo",tipo:"",dica:$trad("d16"),funcaoonclick:function(){scieloAtivo=false;g_operacao="navega";i3GEO.janela.cria("450px","190px",i3GEO.configura.locaplic+"/ferramentas/scielo/index.htm","","","Scielo");atualizascielo=function(){try{var docel=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument;if(docel.getElementById("resultadoscielo")){$i("wdocai").src=i3GEO.configura.locaplic+"/ferramentas/scielo/index.htm"}else{i3GEO.eventos.NAVEGAMAPA.remove("atualizascielo()");if(i3GEO.interface.ATUAL=="googlemaps"){GEvent.removeListener(scieloDragend);GEvent.removeListener(scieloZoomend)}}}catch(e){scieloAtivo=false;i3GEO.eventos.NAVEGAMAPA.remove("atualizascielo()")}};if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizascielo()")<0){i3GEO.eventos.NAVEGAMAPA.push("atualizascielo()");if(i3GEO.interface.ATUAL=="googlemaps"){scieloDragend=GEvent.addListener(i3GeoMap,"dragend",function(){atualizascielo()});scieloZoomend=GEvent.addListener(i3GeoMap,"zoomend",function(){atualizascielo()})}if(i3GEO.interface.ATUAL=="openlayers"){i3geoOL.events.register("moveend",i3geoOL,function(e){atualizascielo()})}}}},{iddiv:"confluence",tipo:"",dica:$trad("d17"),funcaoonclick:function(){g_operacao="navega";i3GEO.janela.cria("250px","190px",i3GEO.configura.locaplic+"/ferramentas/confluence/index.htm","","","Confluence <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=8&idajuda=75' >&nbsp;&nbsp;&nbsp;</a>");i3GEO.util.criaBox();atualizaconfluence=function(){if(!$i("wdocai")){i3GEO.eventos.NAVEGAMAPA.remove("atualizaconfluence()");return}var docel=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument;if(docel.getElementById("resultadoconfluence")){$i("wdocai").src=i3GEO.configura.locaplic+"/ferramentas/confluence/index.htm"}else{i3GEO.eventos.NAVEGAMAPA.remove("atualizaconfluence()");if(i3GEO.interface.ATUAL=="googlemaps"){GEvent.removeListener(confluenceDragend);GEvent.removeListener(confluenceZoomend)}}};if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizaconfluence()")<0){i3GEO.eventos.NAVEGAMAPA.push("atualizaconfluence()");if(i3GEO.interface.ATUAL=="googlemaps"){confluenceDragend=GEvent.addListener(i3GeoMap,"dragend",function(){atualizaconfluence()});confluenceZoomend=GEvent.addListener(i3GeoMap,"zoomend",function(){atualizaconfluence()})}if(i3GEO.interface.ATUAL=="openlayers"){i3geoOL.events.register("moveend",i3geoOL,function(e){atualizaconfluence()})}}}},{iddiv:"lentei",tipo:"",dica:$trad("d18"),funcaoonclick:function(){if(i3GEO.navega.lente.ESTAATIVA=="nao"){i3GEO.navega.lente.inicia()}else i3GEO.navega.lente.desativa()}},{iddiv:"encolheFerramentas",tipo:"",dica:$trad("d19"),funcaoonclick:function(){i3GEO.guias.libera()}},{iddiv:"reinicia",tipo:"",dica:$trad("d20"),funcaoonclick:function(){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.reiniciaMapa(i3GEO.atualiza)}},{iddiv:"mede",tipo:"dinamico",dica:$trad("d21"),funcaoonclick:function(){i3GEO.barraDeBotoes.ativaIcone("mede");if($i("img")){$i("img").title="";i3GEO.util.mudaCursor(i3GEO.configura.cursores,"distancia","img",i3GEO.configura.locaplic)}g_tipoacao="";i3GEO.analise.medeDistancia.inicia()}},{iddiv:"area",tipo:"dinamico",dica:$trad("d21a"),funcaoonclick:function(){i3GEO.barraDeBotoes.ativaIcone("area");if($i("img")){$i("img").title="";i3GEO.util.mudaCursor(i3GEO.configura.cursores,"area","img",i3GEO.configura.locaplic)}g_tipoacao="";i3GEO.analise.medeArea.inicia()}},{iddiv:"inserexy",tipo:"dinamico",dica:$trad("d22"),funcaoonclick:function(){i3GEO.barraDeBotoes.ativaIcone("inserexy");g_tipoacao="";i3GEO.mapa.dialogo.cliquePonto();if($i("img")){$i("img").title="clique para inserir um ponto";$i("img").style.cursor="crosshair"}}},{iddiv:"inseregrafico",tipo:"dinamico",dica:$trad("d23"),funcaoonclick:function(){i3GEO.barraDeBotoes.ativaIcone("inseregrafico");g_tipoacao="";i3GEO.mapa.dialogo.cliqueGrafico();if($i("img")){$i("img").title="clique para incluir o gráfico";$i("img").style.cursor="pointer"}}},{iddiv:"selecao",tipo:"dinamico",dica:$trad("d24"),funcaoonclick:function(){i3GEO.barraDeBotoes.ativaIcone("selecao");i3GEO.selecao.janelaOpcoes();if($i("img")){$i("img").title="";$i("img").style.cursor="pointer"}}},{iddiv:"textofid",tipo:"dinamico",dica:$trad("d25"),funcaoonclick:function(){i3GEO.barraDeBotoes.ativaIcone("textofid");g_tipoacao="";i3GEO.mapa.dialogo.cliqueTexto();if($i("img")){$i("img").title="clique para inserir o texto";$i("img").style.cursor="pointer"}}},{iddiv:"rota",tipo:"",dica:"Rota",funcaoonclick:function(){if(i3GEO.interface.ATUAL!="googlemaps"){alert("Operacao disponivel apenas na interface Google Maps");return}counterClick=1;var parametrosRota=function(overlay,latlng){if(counterClick==1){counterClick++;alert("Clique o ponto de destino da rota");pontoRota1=latlng;return}if(counterClick==2){pontoRota2=latlng;counterClick=0;GEvent.removeListener(rotaEvento);var janela=i3GEO.janela.cria("300px","300px","","center","","Rota");janela[2].style.overflow="auto";janela[2].style.height="300px";directions=new GDirections(i3GeoMap,janela[2]);var temp=function(){$i("wdoca_corpo").innerHTML="Não foi possível criar a rota"};GEvent.addListener(directions,"error",temp);directions.load("from: "+pontoRota1.lat()+","+pontoRota1.lng()+" to: "+pontoRota2.lat()+","+pontoRota2.lng())}};rotaEvento=GEvent.addListener(i3GeoMap,"click",parametrosRota);alert("Clique o ponto de origem da rota")}}]}};
function i3GEOmantemCompatibilidade(){try{i3GEO.configura.oMenuData=oMenuData}catch(e){}try{i3GEO.configura.tipoimagem=g_tipoimagem}catch(e){}try{i3GEO.configura.tipotip=g_tipotip}catch(e){}try{i3GEO.configura.funcaoTip=g_funcaoTip}catch(e){}try{i3GEO.configura.map3d=g_3dmap}catch(e){}try{i3GEO.configura.embedLegenda=g_embedLegenda}catch(e){}try{i3GEO.configura.templateLegenda=g_templateLegenda}catch(e){}try{if(objmapa.finaliza!="")i3GEO.finaliza=objmapa.finaliza}catch(e){};g_arvoreClick="";g_arvoreClicks="";if($i("longlat")){atualizalonglat=function(){$i("longlat").innerHTML=objposicaocursor.dmsx+"   "+objposicaocursor.dmsy};YAHOO.util.Event.addListener($i("img"),"mousemove",atualizalonglat)}try{if(g_opcoesTemas=="nao"){i3GEO.arvoreDeCamadas.OPCOESTEMAS=false}}catch(e){};try{i3GEO.maparef.fatorZoomDinamico=g_zoomRefDinamico}catch(e){};try{i3GEO.configura.mashuppar=g_mashuppar}catch(e){};try{if(!$i("arvoreAdicionaTema")){i3GEO.arvoreDeTemas.IDHTML=objmapa.guiaMenu+"obj"}else{i3GEO.arvoreDeTemas.IDHTML="arvoreAdicionaTema"}}catch(e){};try{if(g_uploaddbf=="nao"){i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploaddbf=false}}catch(e){};try{if(g_uploadlocal=="nao"){i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploadlocal=false}}catch(e){};try{if(g_downloadbase=="nao"){i3GEO.arvoreDeTemas.OPCOESADICIONAIS.downloadbase=false}}catch(e){};try{if(g_conectarwms=="nao"){i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectarwms=false}}catch(e){};try{if(g_conectargeorss=="nao"){i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectargeorss=false}}catch(e){};try{if(g_nuvemTags=="nao"){i3GEO.arvoreDeTemas.OPCOESADICIONAIS.nuvemTags=false}}catch(e){};try{if(g_kml=="nao"){i3GEO.arvoreDeTemas.OPCOESADICIONAIS.kml=false}}catch(e){};try{if(g_qrcode=="nao"){i3GEO.arvoreDeTemas.OPCOESADICIONAIS.qrcode=false}}catch(e){};try{if(g_tipoacao!=""){i3GEO.barraDeBotoes.BOTAOPADRAO=g_tipoacao}}catch(e){}try{if(g_listaPropriedades){i3GEO.configura.listaDePropriedadesDoMapa=g_listaPropriedades}}catch(e){};try{if(g_tempo_aplicar){i3GEO.configura.tempoAplicar=g_tempo_aplicar}}catch(e){};try{if(g_janelaMen=="nao"){i3GEO.configura.iniciaJanelaMensagens=false}}catch(e){};try{if(g_locaplic){i3GEO.configura.locaplic=g_locaplic}}catch(e){};try{if(g_tempotip){i3GEO.configura.tempoMouseParado=g_tempotip}}catch(e){};try{if(g_mostraRosa){i3GEO.configura.mostraRosaDosVentos=g_mostraRosa}}catch(e){};try{if(g_visual){i3GEO.configura.visual=g_visual}}catch(e){};try{if(g_mapaRefDisplay){i3GEO.configura.mapaRefDisplay=g_mapaRefDisplay}}catch(e){};try{if(g_docaguias){i3GEO.configura.liberaGUias=g_docaguias}}catch(e){};if(window.location.href.split("?")[1]){g_sid=window.location.href.split("?")[1];if(g_sid.split("#")[0]){g_sid=g_sid.split("#")[0]}}else{g_sid=""}i3GEO.configura.sid=g_sid;try{i3GEO.guias.ATUAL=g_guiaativa}catch(e){}try{i3GEO.navega.autoRedesenho.INTERVALO=g_autoRedesenho}catch(e){}try{i3GEO.eventos.NAVEGAMAPA=g_funcoesNavegaMapaDefault}catch(e){}try{i3GEO.eventos.MOUSEMOVE=g_funcoesMousemoveMapaDefault}catch(e){}try{i3GEO.eventos.MOUSECLIQUE=g_funcoesClickMapaDefault}catch(e){}try{i3GEO.configura.entorno=g_entorno}catch(e){}try{i3GEO.navega.lente.POSICAOX=g_posicaoLenteX=0}catch(e){}try{i3GEO.navega.lente.POSICAOY=g_posicaoLenteY}catch(e){}try{i3GEO.navega.destacaTema.TAMANHO=destacaTamanho}catch(e){}if(!$i("tip")){var novoel=document.createElement("div");novoel.id="tip";novoel.style.position="absolute";novoel.style.zIndex=5000;if(navm){novoel.style.filter="alpha(opacity=90)"}document.body.appendChild(novoel)}try{objmapa.atualizaListaTemas=function(temas){alert("atualizaListaTemas foi depreciado. Utilize i3GEO.arvoreDeCamadas")}}catch(e){}}if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}cpObj=new cpaint();cpObj.set_async("true");cpObj.set_response_type("JSON");function Mapa(e,m){i3GEO.cria();this.inicializa=function(){i3GEO.finaliza=this.finaliza;i3GEO.inicia()}}objaguarde={abre:function(){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"))},fecha:function(){i3GEO.janela.fechaAguarde("i3GEO.atualiza")}};function iCookie(nome,valor){i3GEO.util.insereCookie(nome,valor)}function pCookie(nome){i3GEO.util.pegaCookie(nome)}function trocalingua(l){i3GEO.idioma.trocaIdioma(l);alert("trocalingua foi depreciado utilize i3GEO.idioma")}function initJanelaMen(){i3GEO.ajuda.abreJanela();alert("initJanelaMen foi depreciado utilize i3GEO.ajuda")}function pegalistademenus(retorno){alert("Funcao pegalistademenus foi depreciado. Utilize i3GEO.arvoreDeTemas")}function wdocaf(wlargura,waltura,wsrc,nx,ny,texto){var janela=i3GEO.janela.cria(wlargura,waltura,wsrc,nx,ny,texto)}function redimwdocaf(w,h){i3GEO.janela.alteraTamanho(w,h);alert("redimwdocaf foi depreciado utilize i3GEO.janela")}function wdocaf2(wlargura,waltura,wsrc,nx,ny,texto){var id=YAHOO.util.Dom.generateId();i3GEO.janela.cria(wlargura,waltura,wsrc,nx,ny,texto,id,true)}function wdocafechaf(odoca){alert("wdocafechaf foi depreciado")}function mostradicasf(objeto,dica,hlpt){i3GEO.ajuda.mostraJanela(dica);alert("mostradicasf foi depreciado utilize i3GEO.ajuda")}function mudaboxnf(tipo,obj,nomeFuncao){alert("mudaboxnf foi depreciado")}function procurartemas(texto){alert("procurartemas foi depreciado")}function expandeTema(itemID){var tema=itemID.split("legenda");if(tema.length==2){g_arvoreClick=itemID;tema=tema[1];var p=g_locaplic+"/classesphp/mapa_controle.php?funcao=criaLegendaHTML&template=legenda2.htm&tema="+tema+"&g_sid="+g_sid;cpObj.call(p,"criaLegenda",expandeLegendaVer)}alert("expandeTema foi depreciado")}function pegavalSistemas(sis){alert("Funcao pegavalSistemas foi depreciada - veja i3GEO.arvoreDeTemas")}function processevent1(exy1){}function removeAcentos(palavra){return(i3GEO.util.removeAcentos(palavra));alert("removeAcentos foi depreciado utilize i3GEO.util")}function ativaMensagemBanner(){alert("ativaMensagemBanner fooi depreciado utilize i3GEO.ajuda")}function mensagemBanner(){}function mensagemf(m){alert("mensagemf foi depreciado");try{if(!$i("mensagem")){var novoel=document.createElement("div");novoel.id='mensagem';novoel.innerHTML='<table width="50" style="border: 1px solid #000000;"> <tr> <td onclick="mensagemf()" style="text-align:left;cursor:pointer" class="tdclara"> <img src="'+g_locaplic+'/imagens/excluir.png" /> </td> <td style="text-align:left" class="tdclara"> <input style="text-align:left" class="textocb" type="text" id="mensagemt" size="70" value="" /> </td></tr> </table>';if($i("i3geo")){$i("i3geo").appendChild(novoel)}else{document.body.appendChild(novoel)}}if(m==null){$i("mensagem").style.visibility="hidden"}else{$i("mensagemt").value=m;$i("mensagem").style.visibility="visible"}var pos=pegaPosicaoObjeto($i("img"));pos[1]=pos[1]+parseInt($i("img").style.height)-22;eval('document.getElementById("mensagem").style.'+g_tipoleft+' = pos[0] + g_postpx');eval('document.getElementById("mensagem").style.'+g_tipotop+' = pos[1] + g_postpx')}catch(e){alert("Impossivel criar mensagem."+e)}}function aguarde(){alert("aguarde foi depreciado utilize i3GEO.janela");this.abre=function(aguardeId,texto){i3GEO.janela.abreAguarde(aguardeId,texto)};this.fecha=function(aguardeId){i3GEO.janela.fechaAguarde(aguardeId)}}function zoomiauto(){alert("zoomiauto foi depreciado utilize i3GEO.navega");i3GEO.navega.zoomin(g_locaplic,g_sid)}function zoomoauto(){alert("zoomoauto foi depreciado utilize i3GEO.navega");i3GEO.navega.zoomout(g_locaplic,g_sid)}function convdmsddf(cd,cm,cs){alert("convdmsddf foi depreciado utilize i3GEO.calculo");return(i3GEO.calculo.dsm2dd(cd,cm,cs))}function zoomPonto(){alert("utilize i3GEO.navega.zoomponto")}function zoomIP(){alert("zoomIP foi depreciado. Utilize i3GEO.navega.zoomIP")}function zoomtot(){alert("zoomtot foi depreciado. Utilize i3GEO.navega.zoomExt")}function panFixo(direcao,w,h,escala){alert("panFixo foi depreciado. Utilize i3GEO.navega.panFixo")}function protocolo(){alert("protocolo foi depreciado utilize i3GEO.util");return(i3GEO.util.protocolo())}function borra(){}function pegaPosicaoObjeto(obj){alert("pegaPosicaoObjeto foi depreciado utilize i3GEO.util");return(i3GEO.util.pegaPosicaoObjeto(obj))}function i3geo_pegaElementoPai(e){alert("i3geo_pegaElementoPai foi depreciado utilize i3GEO.util");return(i3GEO.util.pegaElementoPai(e))}function convddtela(vx,vy,docmapa){alert("convddtela foi depreciado utilize i3GEO.calculo");return(i3GEO.calculo.dd2tela(vx,vy,docmapa,i3GEO.parametros.extent,i3GEO.parametros.pixelsize))}function convdmsf(x,y){alert("convdmsf foi depreciado utilize i3GEO.calculo");return(i3GEO.calculo.dd2dms(x,y))}function calcddf(xfign,yfign,g_celula,imgext){alert("calcddf foi depreciado utilize i3GEO.calculo");return(i3GEO.calculo.tela2dd(xfign,yfign,g_celula,imgext))}function movecursor(){if($i("obj")){if($i("openlayers")||$i("flamingo")){$i("obj").style.display="none"}else{var obje=$i("obj").style;if($i("img")){eval("obje."+g_tipotop+"= objposicaocursor.telay + 9 + g_postpx");eval("obje."+g_tipoleft+"= objposicaocursor.telax + 9 + g_postpx")}else{eval("obje."+g_tipotop+"= objposicaocursor.telay - 15 + g_postpx");eval("obje."+g_tipoleft+"= objposicaocursor.telax + 15 + g_postpx")}}}if($i("box1")){var bx=$i("box1");if(bx.style.visibility!="visible"){bx.style.left=objposicaocursor.telax+g_postpx;bx.style.top=objposicaocursor.telay+g_postpx}}}function pegaCoordenadaUTM(){alert("pegaCoordenadaUTM foi depreciado utilize i3GEO.gadgets");i3GEO.gadgets.mostraCoordenadasUTM(g_locaplic,"mostraUTM")}function ativaLocalizarxy(iddiv){alert("ativaLocalizarxy foi depreciado utilize i3GEO.gadgets");i3GEO.gadgets.mostraCoordenadasGEO(iddiv)}function ativaEscalaNumerica(iddiv){alert("ativaEscalaNumerica foi depreciado utilize i3GEO.gadgets");i3GEO.gadgets.mostraEscalaNumerica(iddiv)}function ativaBuscaRapida(iddiv){alert("ativaBuscaRapida foi depreciado utilize i3GEO.gadgets");i3GEO.gadgets.mostraBuscaRapida(iddiv)}function buscaRapida(){i3geo_buscarapida()}function criaboxg(){i3GEO.util.criaBox();i3GEO.util.criaPin();alert("criaboxg foi depreciado utilize i3GEO.util")}function initJanelaZoom(qual){i3GEO.barraDeBotoes.reativa(qual-1)}function sobeferramentas(){}function desceferramentas(){}function mostraRosaDosVentos(){alert("mostraRosaDosVentos foi depreciado utilize i3GEO.navega");i3GEO.navega.mostraRosaDosVentos()}function mudaVisual(visual){alert("visual foi depreciado utilize i3GEO.visual");i3GEO.gadgets.visual.troca(visual)}function visual(iddiv){alert("visual foi depreciado utilize i3GEO.visual");i3GEO.gadgets.visual.inicia(iddiv)}function arvoreclick(itemID){if(itemID.search("tema")==0){if($i(itemID).checked==true){$i(itemID).checked=false}else{$i(itemID).checked=true}}}function pegaTema(celula){var nos=celula.parentNode.childNodes;var tempi=nos.length;for(var no=0;no<tempi;no++){if(nos[no].type=="checkbox"){return nos[no].value}}}function gerafilmef(qs){}function gravaQuadro(variavel,valor){i3GEO.gadgets.quadros.grava(variavel,valor)}function avancaQuadro(){i3GEO.gadgets.quadros.avanca()}function zoomAnterior(){}function zoomProximo(){}function opcoesQuadros(){}function filmef(o){}function rebobinaf(){}function filmezf(o){}function quadrofilme(){}function filmeanimaf(){}function filmeanimarodaf(janima){}function pegaimagens(){}function calculaArea(pontos,pixel){return(i3GEO.calculo.area(pontos,pixel))}function calculadistancia(lga,lta,lgb,ltb){return(i3GEO.calculo.distancia(lga,lta,lgb,ltb))}function initJanelaRef(){i3GEO.maparef.inicia()}function ajaxReferencia(retorno){i3GEO.maparef.processaImagem(retorno)}function clicouRef(){}function movimentoRef(obj){}function mostraTip(retorno){if(!$i("tip")){var novoel=document.createElement("div");novoel.id="tip";novoel.style.position="absolute";novoel.style.zIndex=5000;if(navm){novoel.style.filter="alpha(opacity=90)"}document.body.appendChild(novoel)}var i=$i("i3geo_rosa");if(i)i.style.display="none";var mostra=false;var retorno=retorno.data;if((retorno!="erro")&&(retorno!=undefined)){if($i("img")){$i("img").title=""}if(retorno!=""){var res="<div id='cabecatip' style='text-align:left;background-color:rgb(240,240,240)'><span style='color:navy;cursor:pointer;text-align:left' onclick='javascript:objmapaparado=\"cancela\"'>parar&nbsp;&nbsp;</span>";res+="<span style='color:navy;cursor:pointer;text-align:left' onclick='javascript:i3GEO.janela.TIPS.push($i(\"tip\"));$i(\"tip\").id=\"\";$i(\"cabecatip\").innerHTML =\"\";$i(\"cabecatip\").id =\"\"' >fixar</span></div>";var temas=retorno.split("!");var tema=temas.length-1;if(tema>=0){do{var titulo=temas[tema].split("@");if(g_tipotip=="completo"){res+="<span style='text-align:left;font-size:9pt'><b>"+titulo[0]+"</b></span><br>"}var ocorrencias=titulo[1].split("*");var ocorrencia=ocorrencias.length-1;if(ocorrencia>=0){do{if(ocorrencias[ocorrencia]!=""){var pares=ocorrencias[ocorrencia].split("##");var paresi=pares.length;for(var par=0;par<paresi;par++){var valores=pares[par].split("#");if(g_tipotip=="completo"){res=res+"<span class='tiptexto' style='text-align:left;font-size:9pt'>"+valores[0]+" <i>"+valores[1]+"</i></span><br>";var mostra=true}else{res=res+"<span class='tiptexto' style='text-align:left;font-size:9pt'><i>"+valores[1]+"</i></span><br>";var mostra=true}}}}while(ocorrencia--)}}while(tema--)}if(!mostra){$i("tip").style.display="none";return}if($i("janelaMen")){$i("janelaMenTexto").innerHTML=res}else{var i=$i("tip");i.innerHTML="<table style='text-align:left'><tr><td style='text-align:left'>"+res+"</td></tr></table>";ist=i.style;ist.top=objposicaocursor.telay-10;ist.left=objposicaocursor.telax-20;ist.display="block"}}}}function trataErro(){i3GEO.janela.fechaAguarde()}function mostraguiaf(guia){i3GEO.guias.mostra(guia)}function ativaGuias(){for(var g=0;g<12;g++){if($i("guia"+g))var gpai=$i("guia"+g).parentNode}if(gpai){gpai.id="guiasYUI";gpai.className="yui-navset";var ins='<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';try{if($i(objmapa.guiaTemas)){$i(objmapa.guiaTemas).innerHTML=$trad("g1")}if($i(objmapa.guiaMenu)){$i(objmapa.guiaMenu).innerHTML=$trad("g2")}if($i(objmapa.guiaLegenda)){$i(objmapa.guiaLegenda).innerHTML=$trad("g3")}if($i(objmapa.guiaListaMapas)){$i(objmapa.guiaListaMapas).innerHTML=$trad("g4")}}catch(e){};for(var g=0;g<12;g++){if($i("guia"+g)){var tituloguia=$i("guia"+g).innerHTML;var re=new RegExp("&nbsp;","g");var tituloguia=tituloguia.replace(re,'');ins+='<li><a href="#"><em><div id="guia'+g+'" >'+tituloguia+'</div></em></a></li>'}}ins+="</ul>";gpai.innerHTML=ins;for(var g=0;g<12;g++){if($i("guia"+g)){eval('$i("guia'+g+'").onclick = function(){g_guiaativa = "guia'+g+'";mostraguiaf('+g+');}');$i("guia"+g).onmouseover=function(){var bcg=this.parentNode.parentNode.style;var cor=bcg.background.split(" ")[0];if(cor!="white")bcg.background="#bfdaff"};$i("guia"+g).onmouseout=function(){var bcg=this.parentNode.parentNode.style;var cor=bcg.background.split(" ")[0];if(cor!="white")bcg.background="transparent"};if($i("guia"+g+"obj")){$i("guia"+g+"obj").style.overflow="auto";$i("guia"+g+"obj").style.height=i3GEO.parametros.h}}}}if($i(objmapa.guiaTemas)){$i(objmapa.guiaTemas).onclick=function(){g_guiaativa=objmapa.guiaTemas;mostraguiaf(1)}}if($i(objmapa.guiaMenu)){$i(objmapa.guiaMenu).onclick=function(){g_guiaativa=objmapa.guiaMenu;mostraguiaf(2);if(!$i("arvoreAdicionaTema")){var ondeArvore=objmapa.guiaMenu+"obj"}else{var ondeArvore="arvoreAdicionaTema"}if(document.getElementById("outrasOpcoesAdiciona")){i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde="outrasOpcoesAdiciona";i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore=false}i3GEO.arvoreDeTemas.cria(i3GEO.configura.sid,i3GEO.configura.locaplic,ondeArvore)}}if($i(objmapa.guiaLegenda)){$i(objmapa.guiaLegenda).onclick=function(){g_guiaativa=objmapa.guiaLegenda;mostraguiaf(4);objmapa.atualizaLegendaHTML()}}if($i(objmapa.guiaListaMapas)){$i(objmapa.guiaListaMapas).onclick=function(){g_guiaativa=objmapa.guiaListaMapas;mostraguiaf(5);if($i("banners")){$i("banners").innerHTML==$trad("o1");var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=pegaMapas&g_sid="+i3GEO.configura.sid;cpObj.call(p,"pegaMapas",pegaMapas)}else{alert("id banners nao encontrado")}}}}function docaguias(){i3GEO.guias.libera()}function autoRedesenho(opcao){}function movePan(){alert("movePan foi depreciado")}function selecao(){}function cliqueSelecao(){}function zoomboxf(tipo){}function i3geo_comboGruposMenu(funcaoOnchange,idDestino,idCombo,largura,altura){}function i3geo_comboSubGruposMenu(funcaoOnchange,idDestino,idCombo,idGrupo,largura,altura){}function i3geo_comboTemasMenu(funcaoOnchange,idDestino,idCombo,idGrupo,idSubGrupo,largura,altura){}function remapaf(){i3GEO.atualiza("")}function limpacontainerf(){}function inseremarcaf(xi,yi,funcaoOnclick,container){i3GEO.utl.insereMarca.cria(xi,yi,funcaoOnclick,container)}function moveSelecaoPoli(){}function cliqueSelecaoPoli(){}function capturaposicao(e){alert("capturaposicao foi depreciado utilize i3GEO.eventos")}function ativaEntorno(){}function geraURLentorno(){}function ajustaEntorno(){}function lenteDeAumento(){alert("lenteDeAumento foi depreciado utilize i3GEO.navega.lente.ativaDesativa()")}function ajaxabrelente(retorno){}function movelentef(){}function destacaTema(tema){alert("destacaTema foi depreciado utilize i3GEO.navega")}function ajaxdestaca(){alert("ajaxdestaca foi depreciado, utilize i3GEO.navega")}function ativaClicks(docMapa){}function incluir(path){i3GEO.util.adicionaSHP(path)}function pontosdist(){this.xpt=new Array();this.ypt=new Array();this.dist=new Array();this.xtela=new Array();this.ytela=new Array();this.ximg=new Array();this.yimg=new Array();this.linhas=new Array()}function mudaiconf(i){i3GEO.barraDeBotoes.ativaIcone(i)}function calcposf(){i3GEO.mapa.ajustaPosicao()}function recuperamapa(){}function criaContainerRichdraw(){alert("criaContainerRichdraw foi depreciado utilize i3GEO.desenho")}function desenhoRichdraw(tipo,objeto,n){}function ajaxhttp(){try{var objhttp1=new XMLHttpRequest()}catch(ee){try{var objhttp1=new ActiveXObject("Msxml2.XMLHTTP")}catch(e){try{var objhttp1=new ActiveXObject("Microsoft.XMLHTTP")}catch(E){var objhttp1=false}}}return(objhttp1)}function ajaxexecAS(programa,funcao){var ohttp=ajaxhttp();ohttp.open("POST",programa,true);var retorno="";ohttp.onreadystatechange=function(){if(ohttp.readyState==4){retorno=ohttp.responseText;var reg=/Warning/gi;if(retorno.search(reg)!=-1){alert("OOps! Ocorreu um erro\n"+retorno);return}var reg=/erro/gi;if(retorno.search(reg)!=-1){alert("OOps! Ocorreu um erro\n"+retorno);return}if(funcao!="volta"){eval(funcao+'("'+retorno+'")')}}};ohttp.send(null)}function ajaxexec(programa,funcao){var objhttp=ajaxhttp();objhttp.open('GET',programa,false);objhttp.send(null);if(objhttp.status==200){if(funcao!="volta"){eval(funcao+'("'+objhttp.responseText+'")')}else{return objhttp.responseText}}}function ajaxLegendaHTML(retorno){}function ajaxLegendaImagem(retorno){}function mede(){}function cliqueMede(){}function moveMede(){}function area(){}function cliqueArea(){}function moveArea(){}function textofid(){}function inserexy(){}function cliqueInseretoponimo(){}function cliqueInserexy(){}function inseregrafico(){}function cliqueInseregrafico(){}function ativaHistoricoZoom(iddiv){}function ajaxhttp(){return i3GEO.util.ajaxhttp()}function ajaxCorpoMapa(retorno){i3GEO.mapa.corpo.veirifca(retorno)}function ajaxredesenha(retorno){i3GEO.atualiza(retorno)}function ajaxIniciaParametros(retorno){i3GEO.atualiza(retorno)}function montaMenuSuspenso(iddiv){i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.idhtml=iddiv;i3GEO.gadgets.mostraMenuSuspenso()}
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.calculo={dms2dd:function(cd,cm,cs){try{var sinal='positivo';if(cd<0){cd=cd*-1;sinal='negativo'}spm=cs/3600;mpg=cm/60;var dd=(cd*1)+(mpg*1)+(spm*1);if(sinal=='negativo'){dd=dd*-1}return(dd)}catch(e){return(0)}},dd2tela:function(vx,vy,docmapa,ext,cellsize){try{if(i3GEO.interface.ATUAL=="googlemaps"){var pos=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));var latlng=new GLatLng(vy,vx);var xyn=i3GeoMap.fromLatLngToContainerPixel(latlng);var xy=new Array();return[(xyn.x)+pos[0],(xyn.y)+pos[1]]}if(i3GEO.interface.ATUAL=="openlayers"){var pos=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));var xy=i3geoOL.getViewPortPxFromLonLat(new OpenLayers.LonLat(vx,vy));return[(xy.x)+pos[0],(xy.y)+pos[1]]}if(arguments.length==3){var ext=i3GEO.parametros.mapexten;var cellsize=i3GEO.parametros.pixelsize}if(arguments.length==4){var cellsize=i3GEO.parametros.pixelsize}if(!docmapa){var docmapa=window.document}var dc=docmapa;var pos=i3GEO.util.pegaPosicaoObjeto(dc);var imgext=ext;var imgext=imgext.split(" ");vx=(vx*1)-(imgext[0]*1);vy=(vy*-1)+(imgext[3]*1);c=cellsize*1;return[(vx/c)+pos[0],(vy/c)+pos[1]]}catch(e){return(new Array())}},dd2dms:function(x,y){var m=0;var s=0;var dx=parseInt(x);if(dx>0){var restod=x-dx}if(dx<0){restod=(x*-1)-(dx*-1)}dx=dx;if(restod!=0){var mm=restod*60;var m=parseInt(restod*60);var restos=mm-m;var mx=m;if(restos!=0){var s=restos*60;var s=(s+"_").substring(0,5);var sx=s}else{s="00.00"}}else{var mx="00";var sx="00.00"}if(m.length==2){m="0"+m+""}if(s*1<10){s="0"+s}var xv=dx+" "+mx+" "+sx;var m=0;var s=0;var dy=parseInt(y);if(dy>0){var restod=y-dy}if(dy<0){var restod=(y*-1)-(dy*-1)}dy=dy;if(restod!=0){var mm=restod*60;var m=parseInt(restod*60);var restos=mm-m;var my=m;if(restos!=0){var s=restos*60;s=(s+"_").substring(0,5);var sy=s}else{var s="00.00"}}else{var my="00";var sy="00.00"}if(m.length==2){m="0"+m}if(s*1<10){s="0"+s}var yv=dy+" "+my+" "+sy;var res=new Array();res[0]=xv;res[1]=yv;return res},tela2dd:function(xfign,yfign,g_celula,imgext){try{if(navm){xfign=xfign-2.2;yfign=yfign-2.7}else{xfign=xfign-0.12;yfign=yfign-1.05}var nx=g_celula*xfign;var ny=g_celula*yfign;var amext=imgext.split(" ");var longdd=(amext[0]*1)+nx;var latdd=(amext[3]*1)-ny;var res=new Array();res[0]=longdd;res[1]=latdd;return(res)}catch(e){return(0)}},area:function(pontos,pixel){try{if(pontos.xpt.length>2){var $array_length=pontos.xpt.length;pontos.xtela.push(pontos.xtela[0]);pontos.ytela.push(pontos.ytela[0]);pontos.xtela.push(pontos.xtela[0]);pontos.ytela.push(pontos.ytela[1]);var $polygon_area=0;for(var $i=0;$i<=$array_length;$i++){$polygon_area+=((pontos.xtela[$i]*pontos.ytela[$i+1])-(pontos.ytela[$i]*pontos.xtela[$i+1]))}$polygon_area=Math.abs($polygon_area)/2}else{$polygon_area="Sao necessarios pelo menos tres pontos para o calculo"}return $polygon_area*pixel}catch(e){return(0)}},distancia:function(lon1,lat1,lon2,lat2){var R=6371;var dLat=((lat2-lat1))*Math.PI/180;var dLon=((lon2-lon1))*Math.PI/180;var a=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)*Math.sin(dLon/2);var c=2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));var d=R*c;return d},direcao:function(lon1,lat1,lon2,lat2){lat1=lat1*(Math.PI/180);lat2=lat2*(Math.PI/180);var dLon=(lon2-lon1)*(Math.PI/180);var y=Math.sin(dLon)*Math.cos(lat2);var x=Math.cos(lat1)*Math.sin(lat2)-Math.sin(lat1)*Math.cos(lat2)*Math.cos(dLon);var r=Math.atan2(y,x);var r=r*180/Math.PI;var r=r+360;return r%360},destinoDD:function(lon,lat,d,direcao){var R=6371;var lat1=lat*(Math.PI/180);var lon1=lon*(Math.PI/180);var brng=direcao*(Math.PI/180);var lat2=Math.asin(Math.sin(lat1)*Math.cos(d/R)+Math.cos(lat1)*Math.sin(d/R)*Math.cos(brng));var lon2=lon1+Math.atan2(Math.sin(brng)*Math.sin(d/R)*Math.cos(lat1),Math.cos(d/R)-Math.sin(lat1)*Math.sin(lat2));lon2=(lon2+Math.PI)%(2*Math.PI)-Math.PI;if(isNaN(lat2)||isNaN(lon2))return null;return new Array((lon2*180/Math.PI),(lat2*180/Math.PI))},rect2ext:function(idrect,mapext,pixel){eval('pix = parseInt(document.getElementById("'+idrect+'").style.'+g_tipoleft+")");eval('piy = parseInt(document.getElementById("'+idrect+'").style.'+g_tipotop+")");if($i(idrect)){var bx=$i(idrect);var bxs=bx.style}else{alert("Box nao encontrado");return}var pos=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));var xfig0=parseInt(bxs.width)-pos[0];var yfig0=parseInt(bxs.height)-pos[1];var xfig=pix+(parseInt(bxs.width))-pos[0];var yfig=piy+(parseInt(bxs.height))-pos[1];var amext=mapext.split(" ");var dx=((amext[0]*-1)-(amext[2]*-1))/-1;var dy=((amext[1]*1)-(amext[3]*1))/-1;if(dy<0)dy=dy*-1;var nx=pixel*xfig;var ny=pixel*yfig;var x1=(amext[0]*1)+nx;var y1=(amext[3]*1)-ny;var xfig=pix-pos[0];var yfig=piy-pos[1];if(dy<0)dy=dy*-1;var nx=pixel*xfig;var ny=pixel*yfig;var x2=(amext[0]*1)+nx;var y2=(amext[3]*1)-ny;var v=x2+" "+y2+" "+x1+" "+y1;var res=new Array(v,x1,y1,x2,y2);return(res)},ext2rect:function(idrect,mapext,boxext,pixel,documento){var rectbox=boxext.split(" ");var rectmap=mapext.split(" ");var xyMin=i3GEO.calculo.dd2tela(rectbox[0],rectbox[1],documento,boxext,pixel);var xyMax=i3GEO.calculo.dd2tela(rectbox[2],rectbox[3],documento,boxext,pixel);var w=xyMax[0]-xyMin[0];var h=xyMin[1]-xyMax[1];var tl=i3GEO.calculo.dd2tela(rectbox[0],rectbox[3],documento,mapext,pixel);var pos=i3GEO.util.pegaPosicaoObjeto(documento);var t=tl[1]-pos[1];var l=tl[0]-pos[0];var d="block";if($i(idrect)){var box=$i(idrect);box.style.width=w;box.style.height=h;box.style.top=t+"px";box.style.left=l+"px";box.style.display=d}return new Array(w,h,xyMax[1],xyMin[0])}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.desenho={richdraw:"",criaContainerRichdraw:function(){pontosdistobj={xpt:new Array(),ypt:new Array(),dist:new Array(),xtela:new Array(),ytela:new Array(),ximg:new Array(),yimg:new Array(),linhas:new Array()};try{var divgeo=i3GEO.desenho.criaDivContainer();divgeo.innerHTML="";var renderer;try{renderer=new VMLRenderer();i3GEO.desenho.richdraw=new RichDrawEditor(divgeo,renderer)}catch(e){renderer=new SVGRenderer();i3GEO.desenho.richdraw=new RichDrawEditor(divgeo,renderer)}i3GEO.desenho.richdraw.editCommand('fillcolor','red');i3GEO.desenho.richdraw.editCommand('linecolor','gray');i3GEO.desenho.richdraw.editCommand('linewidth','1px');i3GEO.desenho.richdraw.editCommand('mode','line');divgeo.style.display="block";i3GEO.eventos.ativa(divgeo)}catch(e){alert("Erro ao tentar criar container richdraw")}},criaDivContainer:function(){if(!$i("divGeometriasTemp")){var pos=[0,0];var pos=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));var novoel=document.createElement("div");novoel.id="divGeometriasTemp";var ne=novoel.style;ne.cursor="crosshair";ne.zIndex=0;ne.position="absolute";ne.width=i3GEO.parametros.w;ne.height=i3GEO.parametros.h;ne.border="1px solid black";ne.display="none";ne.top=pos[1];ne.left=pos[0];document.body.appendChild(novoel)}return($i("divGeometriasTemp"))},aplica:function(tipo,objeto,n,texto){if(i3GEO.desenho.richdraw&&$i(i3GEO.interface.IDCORPO)){var pos=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));if((tipo=="resizeLinha")||(tipo=="resizePoligono")&&navn){try{i3GEO.desenho.richdraw.renderer.resize(objeto,0,0,objposicaocursor.imgx,objposicaocursor.imgy)}catch(e){window.status=n+" erro ao movimentar a linha "}}if((tipo=="resizeLinha")&&navm){try{var r=$i(i3GEO.desenho.richdraw.container.id);var elemento=r.lastChild;if(elemento.innerHTML!=""){var elementos=r.childNodes;var elemento=elementos[elementos.length-2]}r.removeChild(elemento);var dy=objposicaocursor.imgy;var dx=objposicaocursor.imgx-(i3GEO.parametros.w/2);i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,(pontosdistobj.ximg[n-1])-(i3GEO.parametros.w/2)-1,pontosdistobj.yimg[n-1]-3,dx,dy-3)}catch(e){window.status=n+" erro ao movimentar a linha "}}if((tipo=="resizePoligono")&&navm){try{var r=$i(i3GEO.desenho.richdraw.container.id);r.removeChild(r.lastChild);r.removeChild(r.lastChild);var dy=objposicaocursor.imgy;var dx=objposicaocursor.imgx-(i3GEO.parametros.w/2);i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,(pontosdistobj.ximg[n-1])-(i3GEO.parametros.w/2)-1,pontosdistobj.yimg[n-1]-3,dx,dy-3);i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,(pontosdistobj.ximg[0])-(i3GEO.parametros.w/2)-1,pontosdistobj.yimg[0]-3,dx,dy-3)}catch(e){window.status=n+" erro ao movimentar a linha "}}if(tipo=="insereCirculo"){var dx=Math.pow(((pontosdistobj.xtela[n])*1)-((pontosdistobj.xtela[n-1])*1),2);var dy=Math.pow(((pontosdistobj.ytela[n])*1)-((pontosdistobj.ytela[n-1])*1),2);var w=Math.sqrt(dx+dy);if(navn){try{i3GEO.desenho.richdraw.renderer.create('circ','','rgb(250,250,250)',i3GEO.desenho.richdraw.lineWidth,pontosdistobj.ximg[n-1],pontosdistobj.yimg[n-1],w,w)}catch(e){}}else{try{i3GEO.desenho.richdraw.renderer.create('circ','','rgb(250,250,250)',i3GEO.desenho.richdraw.lineWidth,pontosdistobj.ximg[n-1]-w,pontosdistobj.yimg[n-1]-w,w*2,w*2)}catch(e){}}}if(tipo=="insereTexto"){try{i3GEO.desenho.richdraw.renderer.create('text','','rgb(250,250,250)',i3GEO.desenho.richdraw.lineWidth,pontosdistobj.ximg[n-1],pontosdistobj.yimg[n-1],"","",texto)}catch(e){}}}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.interface={BARRABOTOESTOP:12,BARRABOTOESLEFT:3,ATUAL:"padrao",IDCORPO:"corpoMapa",ATIVAMENUCONTEXTO:false,IDMAPA:"",redesenha:function(){eval("i3GEO.interface."+i3GEO.interface.ATUAL+".redesenha()")},cria:function(w,h){eval("i3GEO.interface."+i3GEO.interface.ATUAL+".cria("+w+","+h+")")},inicia:function(w,h){eval("i3GEO.interface."+i3GEO.interface.ATUAL+".inicia()")},ativaBotoes:function(){eval("i3GEO.interface."+i3GEO.interface.ATUAL+".ativaBotoes()")},padrao:{redesenha:function(){$i("img").onload=function(){var imagem=$i("img");imagem.onload="";i3GEO.gadgets.quadros.grava("imagem",i3GEO.parametros.mapimagem);i3GEO.gadgets.quadros.grava("extensao",i3GEO.parametros.mapexten);var temp=function(retorno){eval(retorno.data);i3GEO.gadgets.quadros.grava("legenda",legimagem)};i3GEO.mapa.legendaIMAGEM.obtem(temp);if($i("imgtemp")){i3GEO.util.desaparece("imgtemp",50,5,true)}i3GEO.util.aparece("img",50,5);i3GEO.janela.fechaAguarde("ajaxCorpoMapa")};if(!$i("imgtemp")){var ndiv=document.createElement("div");ndiv.id="imgtemp";ndiv.style.position="absolute";ndiv.style.border="1px solid blue";document.getElementById("corpoMapa").appendChild(ndiv)}if(g_tipoacao=="pan"&&i3GEO.barraDeBotoes.BOTAOCLICADO=="pan"){$i("imgtemp").style.left=parseInt($i("img").style.left);$i("imgtemp").style.top=parseInt($i("img").style.top);$i("imgtemp").style.width=i3GEO.parametros.w;$i("imgtemp").style.height=i3GEO.parametros.h}$i("imgtemp").style.backgroundImage='url("'+$i("img").src+'")';$i("imgtemp").style.display="block";var i=$i("img");i.style.display="none";i.style.left=0;i.style.top=0;i.src=i3GEO.parametros.mapimagem},cria:function(){var ins="<table>";ins+="<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgN' /></td><td class=verdeclaro ></td></tr>";ins+="<tr><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgL' /></td><td class=verdeclaro ><input style='position:relative;top:0px;left:0px'' type=image src='' id='img' /></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgO' /></td></tr>";ins+="<tr><td class=verdeclaro ></td><td class=verdeclaro ><input style='display:none;position:relative' type=image src='' id='imgS' /></td><td class=verdeclaro ></td></tr>";ins+="</table>";$i(i3GEO.interface.IDCORPO).innerHTML=ins;i3GEO.interface.IDMAPA="img"},ativaMenuContexto:function(){var temp=$i("contexto_"+i3GEO.interface.IDMAPA);if(temp){temp.parentNode.removeChild(temp)}function executar(a,b,c){eval(c)};var oFieldContextMenuItemData=[{text:"&nbsp;<span class='container-close'></span>"},{text:"<img class='rosamais' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-4px;'> Aproxima</span>",onclick:{fn:executar,obj:"i3GEO.navega.zoomin(i3GEO.configura.locaplic,i3GEO.configura.sid);"}},{text:"<img class='rosamenos' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-4px;'> Afasta</span>",onclick:{fn:executar,obj:"i3GEO.navega.zoomout(i3GEO.configura.locaplic,i3GEO.configura.sid);"}},{text:"<img class='rosanorte' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Norte</span>",onclick:{fn:executar,obj:"i3GEO.navega.panFixo('','','norte','','','');"}},{text:"<img class='rosasul' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Sul</span>",onclick:{fn:executar,obj:"i3GEO.navega.panFixo('','','sul','','','');"}},{text:"<img class='rosaleste' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Leste</span>",onclick:{fn:executar,obj:"i3GEO.navega.panFixo('','','leste','','','');"}},{text:"<img class='rosaoeste' style='height:18px;' src='"+$im("branco.gif")+"'><span style='position:relative;top:-7px;'> Oeste</span>",onclick:{fn:executar,obj:"i3GEO.navega.panFixo('','','oeste','','','');"}},{text:"Captura",onclick:{fn:executar,obj:"i3GEO.gadgets.quadros.listaImagens();"}}];var oFieldContextMenu=new YAHOO.widget.ContextMenu("contexto_"+i3GEO.interface.IDMAPA,{trigger:i3GEO.interface.IDMAPA,itemdata:oFieldContextMenuItemData,lazyload:true});var onFieldMenuRender=function(){eval("var id = 'contexto_"+i3GEO.interface.IDMAPA+"'");$i(id).style.zIndex=50000};oFieldContextMenu.subscribe("render",onFieldMenuRender)},inicia:function(){if($i("contemImg")){var elemento="contemImg"}else{var elemento="img"}i3GEO.mapa.ajustaPosicao(elemento);var i=$i("img");i.style.width=i3GEO.parametros.w+"px";i.style.height=i3GEO.parametros.h+"px";var estilo=$i(i3GEO.interface.IDCORPO).style;estilo.width=i3GEO.parametros.w+"px";estilo.height=i3GEO.parametros.h+"px";estilo.clip='rect('+0+" "+(i3GEO.parametros.w)+" "+(i3GEO.parametros.h)+" "+0+')';objmapaparado="nao";i3GEO.gadgets.mostraMenuSuspenso();i3GEO.eventos.ativa(i);i3GEO.gadgets.mostraCoordenadasGEO();i3GEO.gadgets.mostraCoordenadasUTM();i3GEO.gadgets.mostraEscalaNumerica();i3GEO.gadgets.mostraEscalaGrafica();i3GEO.gadgets.visual.inicia();i3GEO.ajuda.ativaLetreiro(i3GEO.parametros.mensagens);i3GEO.interface.padrao.ativaBotoes();i3GEO.idioma.mostraSeletor();if(i3GEO.configura.mapaRefDisplay!="none"){if(i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay")){i3GEO.configura.mapaRefDisplay=i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay")}if(i3GEO.configura.mapaRefDisplay=="block"){i3GEO.maparef.inicia()}}},ativaBotoes:function(){var imagemxy=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));if($i("barraDeBotoes1")){var x1=imagemxy[0]+i3GEO.interface.BARRABOTOESLEFT;var y1=imagemxy[1]+i3GEO.interface.BARRABOTOESTOP}if($i("barraDeBotoes2")){var x2=imagemxy[0]+i3GEO.interface.BARRABOTOESLEFT;var y2=imagemxy[1]+i3GEO.interface.BARRABOTOESTOP}if($i("barraDeBotoes1")&&$i("barraDeBotoes2")){var x1=imagemxy[0]+i3GEO.interface.BARRABOTOESLEFT+40}if($i("barraDeBotoes1"))i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes1","i3geo_barra1",true,x1,y1);if($i("barraDeBotoes2"))i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);i3GEO.barraDeBotoes.ativaBotoes();if(document.getElementById("botao3d")){if(i3GEO.configura.map3d==""){document.getElementById("botao3d").style.display="none"}}if(i3GEO.interface.ATIVAMENUCONTEXTO)i3GEO.interface.padrao.ativaMenuContexto();if(i3GEO.configura.visual!="default")i3GEO.gadgets.visual.troca(i3GEO.configura.visual)}},flamingo:{redesenha:function(){var w=parseInt($i("flamingo").style.width);if(w==i3GEO.parametros.w){$i("flamingo").style.height=parseInt($i("flamingo").style.height)+1}else{$i("flamingo").style.height=parseInt($i("flamingo").style.height)-1}i3GEO.janela.fechaAguarde()},cria:function(w,h){var i=$i(i3GEO.interface.IDCORPO);if(i){var f=$i("flamingo");if(!f){var ins='<div id=flamingo style="width:0px;height:0px;text-align:left;background-image:url(/"'+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg/")"></div>';i.innerHTML=ins}var f=$i("flamingo");f.style.width=w;f.style.height=h;i3GEO.interface.IDMAPA="flamingo"}},inicia:function(){var monta=function(retorno){$i("flamingo").style.height=i3GEO.parametros.h+45;childPopups=new Array();childPopupNr=0;var so=new SWFObject(i3GEO.configura.locaplic+"/pacotes/flamingo/flamingo/flamingo.swf?config="+retorno.data,"flamingoi","100%","100%","8","#eaeaea");so.addParam("wmode","transparent");so.write("flamingo")};i3GEO.php.flamingo(monta);i3GEO.eventos.ativa($i("flamingo"));i3GEO.maparef.atualiza();if(i3GEO.configura.mapaRefDisplay!="none"){if(i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay")){i3GEO.configura.mapaRefDisplay=i3GEO.util.pegaCookie("i3GEO.configura.mapaRefDisplay")}if(i3GEO.configura.mapaRefDisplay=="block"){i3GEO.maparef.inicia()}}},ativaBotoes:function(){}},openlayers:{redesenha:function(){if($i("openlayers_OpenLayers_Container")){var no=$i("openlayers_OpenLayers_Container");var divs1=no.getElementsByTagName("div");var n1=divs1.length;for(a=0;a<n1;a++){var divs2=divs1[a].getElementsByTagName("div");var n2=divs2.length;for(b=0;b<n2;b++){var imgs=divs2[b].getElementsByTagName("img");var nimg=imgs.length;for(c=0;c<nimg;c++){imgs[c].src+="&x"}}}}i3GEO.janela.fechaAguarde()},cria:function(w,h){var i=$i(i3GEO.interface.IDCORPO);if(i){var f=$i("openlayers");if(!f){var ins='<div id=openlayers style="width:0px;height:0px;text-align:left;background-image:url('+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg)"></div>';i.innerHTML=ins}var f=$i("openlayers");f.style.width=w;f.style.height=h}i3GEO.interface.IDMAPA="openlayers"},inicia:function(){var montaMapa=function(){var url=window.location.protocol+"//"+window.location.host+i3GEO.parametros.cgi+"?";url+="map="+i3GEO.parametros.mapfile+"&mode=map&SRS=epsg:4326&";i3geoOL=new OpenLayers.Map('openlayers',{controls:[]});i3geoOLlayer=new OpenLayers.Layer.MapServer("Temas I3Geo",url,{layers:'estadosl'},{'buffer':1},{isBaseLayer:true,opacity:1});i3geoOLlayer.setVisibility(true);i3geoOL.addLayer(i3geoOLlayer);i3geoOL.events.register("moveend",i3geoOL,function(e){i3GEO.interface.openlayers.recalcPar();g_operacao="";g_tipoacao=""});i3geoOL.events.register("mousemove",i3geoOL,function(e){if(navm){var p=new OpenLayers.Pixel(e.x,e.y)}else{var p=e.xy}var lonlat=i3geoOL.getLonLatFromPixel(p);var d=i3GEO.calculo.dd2dms(lonlat.lon,lonlat.lat);try{objposicaocursor.ddx=lonlat.lon;objposicaocursor.ddy=lonlat.lat;objposicaocursor.telax=p.x;objposicaocursor.telay=p.y;objposicaocursor.dmsx=d[0];objposicaocursor.dmsy=d[1];var dc=$i("i3geo");if($i("openlayers_OpenLayers_Container")){var dc=$i("openlayers_OpenLayers_Container")}while(dc.offsetParent){dc=dc.offsetParent;objposicaocursor.telax=objposicaocursor.telax+dc.offsetLeft;objposicaocursor.telay=objposicaocursor.telay+dc.offsetTop}}catch(e){}});var pz=new OpenLayers.Control.PanZoomBar({numZoomLevels:5});i3geoOL.addControl(pz);pz.div.style.zIndex=5000;i3geoOL.addControl(new OpenLayers.Control.LayerSwitcher());i3GEO.interface.openlayers.zoom2ext(i3GEO.parametros.mapexten);i3geoOL.addControl(new OpenLayers.Control.ScaleLine());i3geoOL.addControl(new OpenLayers.Control.OverviewMap());i3geoOL.addControl(new OpenLayers.Control.KeyboardDefaults());i3GEO.eventos.ativa($i("openlayers"));var pos=i3GEO.util.pegaPosicaoObjeto($i("openlayers"));if($i("aguarde")){$top("aguarde",pos[1]);$left("aguarde",pos[0])}OLpan=new OpenLayers.Control.Navigation();OLzoom=new OpenLayers.Control.ZoomBox();OLpanel=new OpenLayers.Control.Panel();OLpanel.addControls([OLpan,OLzoom]);i3geoOL.addControl(OLpanel);i3GEO.interface.openlayers.ativaBotoes()};i3GEO.php.openlayers(montaMapa);i3GEO.gadgets.mostraMenuSuspenso();i3GEO.ajuda.ativaLetreiro(i3GEO.parametros.mensagens);i3GEO.idioma.mostraSeletor();i3GEO.gadgets.mostraCoordenadasGEO();i3GEO.gadgets.mostraCoordenadasUTM();i3GEO.gadgets.mostraEscalaNumerica()},ativaBotoes:function(){var imagemxy=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));if($i("barraDeBotoes2")){var x2=imagemxy[0]+i3GEO.interface.BARRABOTOESLEFT;var y2=imagemxy[1]+i3GEO.interface.BARRABOTOESTOP}if($i("barraDeBotoes2"))i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);i3GEO.barraDeBotoes.ativaBotoes()},recalcPar:function(){g_operacao="";g_tipoacao="";var bounds=i3geoOL.getExtent().toBBOX().split(",");i3GEO.parametros.mapexten=bounds[0]+" "+bounds[1]+" "+bounds[2]+" "+bounds[3];i3GEO.parametros.mapscale=i3geoOL.getScale();atualizaEscalaNumerica(parseInt(i3GEO.parametros.mapscale))},zoom2ext:function(ext){var m=ext.split(" ");var b=new OpenLayers.Bounds(m[0],m[1],m[2],m[3]);i3geoOL.zoomToExtent(b)}},googlemaps:{OPACIDADE:0.8,TIPOMAPA:"G_PHYSICAL_MAP",ZOOMSCALE:[591657550,295828775,147914387,73957193,36978596,18489298,9244649,4622324,2311162,1155581,577790,288895,144447,72223,36111,18055,9027,4513,2256,1128],redesenha:function(){try{if(i3GeoMap!=""){posfixo=posfixo+"&";i3GeoMap.removeOverlay(i3GEOTileO);var i3GEOTile=new GTileLayer(null,0,18,{tileUrlTemplate:i3GEO.interface.googlemaps.criaTile()+posfixo,isPng:true,opacity:i3GEO.interface.googlemaps.OPACIDADE});i3GEOTileO=new GTileLayerOverlay(i3GEOTile);i3GeoMap.addOverlay(i3GEOTileO)}var n=i3GEO.mapa.GEOXML.length;for(i=0;i<n;i++){i3GEO.mapa.criaNoArvoreGoogle(i3GEO.mapa.GEOXML[i],i3GEO.mapa.GEOXML[i])}}catch(e){alert(e)}},cria:function(w,h){posfixo="&";var i=$i(i3GEO.interface.IDCORPO);if(i){var f=$i("googlemapsdiv");if(!f){var ins='<div id=googlemapsdiv style="width:0px;height:0px;text-align:left;background-image:url('+i3GEO.configura.locaplic+'/imagens/i3geo1bw.jpg)"></div>';i.innerHTML=ins}var f=$i("googlemapsdiv");f.style.width=w;f.style.height=h}i3GeoMap="";i3GEO.interface.IDMAPA="googlemapsdiv"},inicia:function(){var pol=i3GEO.parametros.mapexten;var ret=pol.split(" ");var pt1=(((ret[0]*-1)-(ret[2]*-1))/2)+ret[0]*1;var pt2=(((ret[1]-ret[3])/2)*-1)+ret[1]*1;i3GeoMap=new GMap2($i(i3GEO.interface.IDMAPA));i3GeoMap.addMapType(G_PHYSICAL_MAP);i3GeoMap.setMapType(eval(i3GEO.interface.googlemaps.TIPOMAPA));i3GeoMap.addControl(new GLargeMapControl());i3GeoMap.addControl(new GMapTypeControl());var bottomLeft=new GControlPosition(G_ANCHOR_BOTTOM_LEFT,new GSize(0,40));i3GeoMap.addControl(new GScaleControl(),bottomLeft);var bottomRight=new GControlPosition(G_ANCHOR_BOTTOM_RIGHT);i3GeoMap.addControl(new GOverviewMapControl(),bottomRight);var sw=new GLatLng(ret[1],ret[0]);var ne=new GLatLng(ret[3],ret[2]);var z=i3GeoMap.getBoundsZoomLevel(new GLatLngBounds(sw,ne));i3GeoMap.setCenter(new GLatLng(pt2,pt1),z);var i3GEOTile=new GTileLayer(null,0,18,{tileUrlTemplate:i3GEO.interface.googlemaps.criaTile(),isPng:true,opacity:i3GEO.interface.googlemaps.OPACIDADE});i3GEOTileO=new GTileLayerOverlay(i3GEOTile);i3GeoMap.addOverlay(i3GEOTileO);var myMapType=new GMapType([i3GEOTile],new GMercatorProjection(18),'i3Geo');i3GeoMap.addMapType(myMapType);GEvent.addListener(i3GeoMap,"dragstart",function(){g_operacao="";g_tipoacao=""});GEvent.addListener(i3GeoMap,"dragend",function(){i3GEO.interface.googlemaps.recalcPar()});GEvent.addListener(i3GeoMap,"zoomend",function(){i3GEO.interface.googlemaps.recalcPar();g_operacao="";g_tipoacao=""});i3GEO.interface.googlemaps.ativaBotoes();i3GEO.eventos.ativa($i(i3GEO.interface.IDMAPA));i3GEO.gadgets.mostraCoordenadasGEO();i3GEO.gadgets.mostraMenuSuspenso();i3GEO.gadgets.mostraInserirKml();var pos=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDMAPA));GEvent.addListener(i3GeoMap,"mousemove",function(ponto){var teladms=i3GEO.calculo.dd2dms(ponto.lng(),ponto.lat());var tela=i3GeoMap.fromLatLngToContainerPixel(ponto);objposicaocursor={ddx:ponto.lng(),ddy:ponto.lat(),dmsx:teladms[0],dmsy:teladms[1],imgx:tela.x,imgy:tela.y,telax:tela.x+pos[0],telay:tela.y+pos[1]}});g_operacao="";g_tipoacao="";if(i3GEO.parametros.kmlurl!=""){i3GEO.mapa.insereKml(true,i3GEO.parametros.kmlurl)}i3GEO.parametros.mapscale=i3GEO.interface.googlemaps.calcescala()},bbox:function(){var bd=i3GeoMap.getBounds();var so=bd.getSouthWest();var ne=bd.getNorthEast();var bbox=so.lng()+" "+so.lat()+" "+ne.lng()+" "+ne.lat();return(bbox)},criaWMS:function(){var cgi=i3GEO.configura.locaplic+"/classesphp/parse_cgi.php?g_sid="+i3GEO.configura.sid;var parametros="&map_size="+parseInt($i(i3GEO.interface.IDMAPA).style.width);parametros+=","+parseInt($i(i3GEO.interface.IDMAPA).style.height);parametros+="&mapext="+i3GEO.interface.googlemaps.bbox();parametros+="&map_imagecolor=-1 -1 -1&map_transparent=on";return(cgi+parametros)},criaTile:function(){var cgi=i3GEO.util.protocolo()+"://"+window.location.host+i3GEO.parametros.cgi+"?";var parametros="map="+i3GEO.parametros.mapfile;parametros+='&mode=tile';parametros+='&tilemode=gmap';parametros+='&tile={X}+{Y}+{Z}';return(cgi+parametros)},ativaBotoes:function(){var imagemxy=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));if($i("barraDeBotoes2")){var x2=imagemxy[0]+i3GEO.interface.BARRABOTOESLEFT+70;var y2=imagemxy[1]+i3GEO.interface.BARRABOTOESTOP}if($i("barraDeBotoes2"))i3GEO.barraDeBotoes.inicializaBarra("barraDeBotoes2","i3geo_barra2",false,x2,y2);i3GEO.barraDeBotoes.ativaBotoes()},mudaOpacidade:function(valor){i3GEO.interface.googlemaps.OPACIDADE=valor/200;i3GEO.interface.googlemaps.redesenha()},recalcPar:function(){g_operacao="";g_tipoacao="";var bounds=i3GeoMap.getBounds();var sw=bounds.getSouthWest();var ne=bounds.getNorthEast();i3GEO.parametros.mapexten=sw.lng()+" "+sw.lat()+" "+ne.lng()+" "+ne.lat();i3GEO.parametros.mapscale=i3GEO.interface.googlemaps.calcescala()},calcescala:function(){var zoom=i3GeoMap.getZoom();return(i3GEO.interface.googlemaps.ZOOMSCALE[zoom])},escala2nzoom:function(escala){var n=i3GEO.interface.googlemaps.ZOOMSCALE.length;for(var i=0;i<n;i++){if(i3GEO.interface.googlemaps.ZOOMSCALE[i]<escala){return(i)}}},zoom2extent:function(mapexten){var pol=mapexten;var ret=pol.split(" ");var pt1=(((ret[0]*-1)-(ret[2]*-1))/2)+ret[0]*1;var pt2=(((ret[1]-ret[3])/2)*-1)+ret[1]*1;var sw=new GLatLng(ret[1],ret[0]);var ne=new GLatLng(ret[3],ret[2]);var z=i3GeoMap.getBoundsZoomLevel(new GLatLngBounds(sw,ne));i3GeoMap.setCenter(new GLatLng(pt2,pt1),z)},adicionaKml:function(pan,url,titulo,ativo){var ngeoxml="geoXml_"+i3GEO.mapa.GEOXML.length;if(arguments.length==1){var i=$i("i3geo_urlkml");if(i){var url=i.value}else{var url=""}var titulo=ngeoxml;var ativo=true}if(arguments.length==2){var titulo=ngeoxml;var ativo=true}if(arguments.length==2){var ativo=true}if(url==""){return}i3GEO.mapa.GEOXML.push(ngeoxml);var zoom=function(){if(pan){eval("var ll = "+ngeoxml+".getDefaultCenter()");eval(ngeoxml+".gotoDefaultViewport(i3GeoMap)")}};eval(ngeoxml+" = new GGeoXml(url,zoom)");if(ativo==true){eval("i3GeoMap.addOverlay("+ngeoxml+")")}i3GEO.interface.googlemaps.adicionaNoArvoreGoogle(url,titulo,ativo,ngeoxml)},adicionaNoArvoreGoogle:function(url,nomeOverlay,ativo,id){if(arguments.length==2){var ativo=true;var id=nomeOverlay}if(arguments.length==2){var id=nomeOverlay}var root=i3GEO.arvoreDeCamadas.ARVORE.getRoot();var node=i3GEO.arvoreDeCamadas.ARVORE.getNodeByProperty("idkml","raiz");if(!node){var titulo="<table><tr><td><b>Google Maps</b></td></tr></table>";var d={html:titulo,idkml:"raiz"};var node=new YAHOO.widget.HTMLNode(d,root,true,true);node.enableHighlight=false}html="<input onclick='i3GEO.interface.googlemaps.ativaDesativaCamadaKml(this)' class=inputsb style='cursor:pointer;' type='checkbox' value='"+id+"'";if(ativo==true){html+=" checked "}html+="/>";html+="&nbsp;<span style='cursor:move'>"+nomeOverlay+"</span>";var d={html:html};var nodekml=new YAHOO.widget.HTMLNode(d,node,true,true);nodekml.enableHighlight=false;nodekml.isleaf=true;i3GEO.arvoreDeCamadas.ARVORE.draw();i3GEO.arvoreDeCamadas.ARVORE.collapseAll();node.expand()},ativaDesativaCamadaKml:function(obj){if(!obj.checked){eval("i3GeoMap.removeOverlay("+obj.value+")")}else eval("i3GeoMap.addOverlay("+obj.value+")")}},googleearth:{redesenha:function(){try{linki3geo.setHref(linki3geo.getHref()+"&")}catch(e){}},cria:function(w,h){var i=$i(i3GEO.interface.IDCORPO);if(i){var i3GeoMap3d=document.createElement("div");i3GeoMap3d.style.width=w;i3GeoMap3d.style.height=h+45;i.style.height=h+45;i3GeoMap3d.id="i3GeoMap3d";i.appendChild(i3GeoMap3d)}i3GEO.interface.IDMAPA="i3GeoMap3d";google.load("earth","1");var i3GeoMap=null},inicia:function(){google.earth.createInstance("i3GeoMap3d",i3GEO.interface.googleearth.iniciaGE,i3GEO.interface.googleearth.falha)},iniciaGE:function(object){i3GeoMap=object;i3GeoMap.getWindow().setVisibility(true);kmlUrl=i3GEO.configura.locaplic+"/pacotes/kmlmapserver/kmlservice.php?map="+i3GEO.parametros.mapfile+"&typename=estadosl&request=kml&mode=map&";linki3geo=i3GeoMap.createLink('');linki3geo.setHref(kmlUrl);nl=i3GeoMap.createNetworkLink('');nl.setLink(linki3geo);nl.setFlyToView(true);i3GeoMap.getFeatures().appendChild(nl);var options=i3GeoMap.getOptions();options.setMouseNavigationEnabled(true);options.setStatusBarVisibility(true);options.setOverviewMapVisibility(true);options.setScaleLegendVisibility(true);i3GeoMap.getNavigationControl().setVisibility(i3GeoMap.VISIBILITY_SHOW)},falha:function(){alert("Falhou. Vc precisa do plugin instalado")},ativaBotoes:function(){}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.mapa={GEOXML:new Array(),ajustaPosicao:function(elemento){if(arguments.length==0){return}try{imagemxi=0;imagemyi=0;imagemxref=0;imagemyref=0;var dc=$i(elemento);while((dc.offsetParent)&&(dc.offsetParent.id!="i3geo")){dc=dc.offsetParent;imagemxi=imagemxi+dc.offsetLeft;imagemyi=imagemyi+dc.offsetTop}var c=$i(i3GEO.interface.IDCORPO);if(c){c.style.position="absolute";$left(i3GEO.interface.IDCORPO,imagemxi);$top(i3GEO.interface.IDCORPO,imagemyi)}}catch(e){alert("Ocorreu um erro. i3GEO.mapa.ajustaPosicao"+e)}},ativaLogo:function(){i3GEO.php.ativalogo(i3GEO.atualiza)},verifica:function(retorno){try{i3GEO.janela.abreAguarde("ajaxCorpoMapa",$trad("o3"));if(retorno.data){var retorno=retorno.data}if(retorno.variaveis){var retorno=retorno.variaveis}if((retorno=="erro")||(retorno==undefined)){i3GEO.mapa.ajustaPosicao();i3GEO.janela.fechaAguarde();i3GEO.mapa.recupera.inicia()}i3GEO.mapa.recupera.TENTATIVA=0}catch(e){if(i3GEO.interface.ATUAL=="openlayers"){i3GEO.janela.fechaAguarde();return}if(i3GEO.mapa.recupera.TENTATIVA==0){alert("Erro no mapa. Sera feita uma tentativa de recuperacao.");i3GEO.mapa.recupera.inicia()}else{alert("Recuperacao impossivel. Sera feita uma tentativa de reiniciar o mapa.");if(i3GEO.mapa.recupera.TENTATIVA==1){i3GEO.mapa.recupera.TENTATIVA=2;i3GEO.php.reiniciaMapa(i3GEO.atualiza)}}}},insereToponimo:function(){if(g_tipoacao=="textofid"){var doc=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument;texto=doc.getElementById("texto").value;var f=doc.getElementById("fonte").value;var t=doc.getElementById("tamanho").value;var a=doc.getElementById("angulo").value;var cf=doc.getElementById("fundoc").value;if(cf==""){cf="off"}var cs=doc.getElementById("sombra").value;if(cs==""){cs="off"}var xs=doc.getElementById("sombrax").value;var ys=doc.getElementById("sombray").value;var c=doc.getElementById("frente").value;var m=doc.getElementById("mascara").value;if(m==""){m="off"}var fcs=doc.getElementById("frentes").value;if(fcs==""){fcs="off"}var fxs=doc.getElementById("frentex").value;var fys=doc.getElementById("frentey").value;var forca=doc.getElementById("force").value;var md=doc.getElementById("mindistance").value;var mf=doc.getElementById("minfeaturesize").value;var ox=doc.getElementById("offsetx").value;var oy=doc.getElementById("offsety").value;var pl=doc.getElementById("partials").value;var pos=doc.getElementById("position").value;var digi=function(retorno){if(texto==""){i3GEO.janela.fechaAguarde("i3GEO.atualiza");texto=retorno.data}if(texto!=" "){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.insereAnnotation(i3GEO.atualiza,g_nomepin+"topo",objposicaocursor.ddx+" "+objposicaocursor.ddy,texto,pos,pl,ox,oy,mf,md,forca,fcs,fxs,fys,m,c,ys,xs,cs,cf,a,t,f)}};if(doc.getElementById("tipoInsere").value=="digitando"){digi.call()}else{texto="";if((doc.getElementById("temasLigados"))&&(doc.getElementById("itemsel"))){var tema=doc.getElementById("temasLigados").value;var item=doc.getElementById("itemsel").value;i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.identificaunico(digi,objposicaocursor.ddx+","+objposicaocursor.ddy,tema,item)}}}else{i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.mapa.insereToponimo()")}},inserePonto:function(){if(g_tipoacao=="inserexy"){var doc=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument;if(doc.getElementById("resultado")){var ins=doc.getElementById("resultado").innerHTML;ins=ins+"<div style='font-size:12px' >"+objposicaocursor.ddx+" "+objposicaocursor.ddy+"</div><br>";doc.getElementById("resultado").innerHTML=ins}var item="";var valoritem="";if((doc.getElementById("valorItem"))&&(doc.getElementById("itemtema"))){var item=doc.getElementById("itemtema").value;var valoritem=doc.getElementById("valorItem").value}if(g_nomepin==""){alert("Nenhum tema definido para editar")}else{i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.insereSHP(i3GEO.atualiza,g_nomepin,item,valoritem,objposicaocursor.ddx+" "+objposicaocursor.ddy)}}},insereGrafico:function(){if(g_tipoacao=="inseregrafico"){var doc=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument;var tema=doc.getElementById("temasLigados").value;var width=doc.getElementById("w").value;var inclinacao=doc.getElementById("inclinacao").value;var shadow_height=doc.getElementById("sombra").value;if(tema==""){alert("Nenhum tema definido para pegar os dados")}else{var listadeitens=new Array();var g=doc.getElementById("listai");var iguias=g.getElementsByTagName("input");var i=iguias.length-1;if(i>=0){do{if(iguias[i].checked==true){var it=iguias[i].id;var c=doc.getElementById("cor"+it).value;listadeitens.push(it+","+c)}}while(i--)}var itens=listadeitens.join("*");if(itens==""){alert("Nenhum item foi escolhido")}else{i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.insereSHPgrafico(i3GEO.atualiza,tema,objposicaocursor.ddx,objposicaocursor.ddy,itens,shadow_height,width,inclinacao)}}}},recupera:{TENTATIVA:0,inicia:function(){i3GEO.mapa.ajustaPosicao();i3GEO.janela.fechaAguarde();if(i3GEO.mapa.recupera.TENTATIVA==0){i3GEO.mapa.recupera.TENTATIVA++;i3GEO.mapa.recupera.restaura()}},restaura:function(){i3GEO.php.recuperamapa(i3GEO.atualiza)}},legendaHTML:{incluiBotaoLibera:true,ID:"",cria:function(id){if(arguments.length==0){var id=""}i3GEO.mapa.legendaHTML.ID=id;if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.mapa.legendaHTML.atualiza()")<0){i3GEO.eventos.NAVEGAMAPA.push("i3GEO.mapa.legendaHTML.atualiza()")}i3GEO.mapa.legendaHTML.atualiza()},atualiza:function(){var temp=function(retorno){if(i3GEO.mapa.legendaHTML.ID!=""&&$i(i3GEO.mapa.legendaHTML.ID)){if((retorno.data!="erro")&&(retorno.data!=undefined)){var s=i3GEO.configura.locaplic+"/imagens/solta.gif";var ins="";if(i3GEO.mapa.legendaHTML.incluiBotaoLibera==true){ins+="<img onclick='i3GEO.mapa.legendaHTML.libera()' id=soltaLeg src="+s+" title='clique para liberar'/><br>"}ins+="<div id='corpoLegi' >"+retorno.data.legenda+"</div>";$i(i3GEO.mapa.legendaHTML.ID).innerHTML=ins}}if($i("wlegenda")){$i("wlegenda").innerHTML=retorno.data.legenda;var elementos=$i("wlegenda").getElementsByTagName("input");for(i=0;i<elementos.length;i++){elementos[i].style.display="none"}}};i3GEO.mapa.legendaHTML.obtem(temp)},obtem:function(funcao){i3GEO.php.criaLegendaHTML(funcao,"",i3GEO.configura.templateLegenda)},ativaDesativaTema:function(inputbox){var temp=function(){i3GEO.php.corpo(i3GEO.atualiza,i3GEO.configura.tipoimagem);i3GEO.arvoreDeCamadas.atualiza("");i3GEO.janela.fechaAguarde("redesenha")};i3GEO.janela.abreAguarde("redesenha",$trad("o1"));if(!inputbox.checked)i3GEO.php.ligatemas(temp,inputbox.value,"");else i3GEO.php.ligatemas(temp,"",inputbox.value)},libera:function(){var temp=function(retorno){if(!$i("moveLegi")){var novoel=document.createElement("div");novoel.id="moveLegi";novoel.style.display="block";var temp='<div class="hd">Legenda</div>';temp+='<div id="wlegenda" style="text-align:left;background-color:white" ></div>';novoel.innerHTML=temp;document.body.appendChild(novoel);YAHOO.namespace("moveLegi.xp");YAHOO.moveLegi.xp.panel=new YAHOO.widget.Panel("moveLegi",{width:"300px",fixedcenter:true,constraintoviewport:false,underlay:"none",close:true,visible:true,draggable:true,modal:false});YAHOO.moveLegi.xp.panel.render()}$i("wlegenda").innerHTML=retorno.data.legenda;var temp=$i("wlegenda").getElementsByTagName("input");var n=temp.length;for(i=0;i<n;i++){temp[i].style.display="none"}YAHOO.moveLegi.xp.panel.show()};i3GEO.mapa.legendaHTML.obtem(temp)}},legendaIMAGEM:{obtem:function(funcao){i3GEO.php.criaLegendaImagem(funcao)}},dialogo:{autoredesenha:function(){i3GEO.janela.cria("300px","110px",i3GEO.configura.locaplic+"/ferramentas/opcoes_autoredesenha/index.htm","","","Temporizador <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=9' >&nbsp;&nbsp;&nbsp;</a>")},salvaMapa:function(){if(i3GEO.parametros==""){alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return}i3GEO.janela.cria("300px","180px",i3GEO.configura.locaplic+"/ferramentas/salvamapa/index.htm","","","Salva mapa <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=2&idajuda=10' >&nbsp;&nbsp;&nbsp;</a>")},carregaMapa:function(){i3GEO.janela.cria("300px","150px",i3GEO.configura.locaplic+"/ferramentas/carregamapa/index.htm?urlatual="+window.location,"","","Carrega mapa <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=2&idajuda=11' >&nbsp;&nbsp;&nbsp;</a>")},convertews:function(){if(i3GEO.parametros.mapfile==""){alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return}i3GEO.janela.cria("440px","280px",i3GEO.configura.locaplic+"/ferramentas/convertews/index.htm","","","WMS <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=2&idajuda=12' >&nbsp;&nbsp;&nbsp;</a>")},convertekml:function(){if(i3GEO.parametros.mapfile==""){alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return}i3GEO.janela.cria("440px","280px",i3GEO.configura.locaplic+"/ferramentas/convertemapakml/index.htm","","","Kml <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=2&idajuda=13' >&nbsp;&nbsp;&nbsp;</a>")},queryMap:function(){i3GEO.janela.cria("210px","80px",i3GEO.configura.locaplic+"/ferramentas/opcoes_querymap/index.htm","","","Cor da seleção <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=5' >&nbsp;&nbsp;&nbsp;</a>")},template:function(){i3GEO.janela.cria("300px","400px",i3GEO.configura.locaplic+"/ferramentas/template/index.htm","","","Template <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=8' >&nbsp;&nbsp;&nbsp;</a>")},tamanho:function(){i3GEO.janela.cria("150px","170px",i3GEO.configura.locaplic+"/ferramentas/opcoes_tamanho/index.htm","","","Tamanho <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=4' >&nbsp;&nbsp;&nbsp;</a>")},tipoimagem:function(){i3GEO.janela.cria("300px","260px",i3GEO.configura.locaplic+"/ferramentas/tipoimagem/index.htm","","","Tipo de imagem <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=1' >&nbsp;&nbsp;&nbsp;</a>")},corFundo:function(){i3GEO.janela.cria("210px","80px",i3GEO.configura.locaplic+"/ferramentas/opcoes_fundo/index.htm","","","Cor do fundo <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=6' >&nbsp;&nbsp;&nbsp;</a>")},opcoesEscala:function(){i3GEO.janela.cria("250px","300px",i3GEO.configura.locaplic+"/ferramentas/opcoes_escala/index.htm","center","center","Escala <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=3' >&nbsp;&nbsp;&nbsp;</a>")},opcoesLegenda:function(){i3GEO.janela.cria("320px","350px",i3GEO.configura.locaplic+"/ferramentas/opcoes_legenda/index.htm","","","Legenda <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=2' >&nbsp;&nbsp;&nbsp;</a>")},gradeCoord:function(){i3GEO.janela.cria("350px","330px",i3GEO.configura.locaplic+"/ferramentas/gradecoord/index.htm","","","Grade de coordenadas <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=1&idajuda=7' >&nbsp;&nbsp;&nbsp;</a>")},cliqueTexto:function(){if(g_tipoacao!="textofid"){var temp=Math.random()+"b";temp=temp.split(".");g_nomepin="pin"+temp[1];g_tipoacao="textofid";var janela=i3GEO.janela.cria("360px","250px",i3GEO.configura.locaplic+"/ferramentas/inseretxt/index.htm","","","Texto");if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.mapa.insereToponimo()")<0){i3GEO.eventos.MOUSECLIQUE.push("i3GEO.mapa.insereToponimo()")}var temp=function(){i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.mapa.insereToponimo()");i3GEO.barraDeBotoes.ativaBotoes()};YAHOO.util.Event.addListener(janela[0].close,"click",temp)}},cliquePonto:function(){if(g_tipoacao!="inserexy"){g_tipoacao="inserexy";var temp=Math.random()+"a";temp=temp.split(".");g_nomepin="pin"+temp[1];var janela=i3GEO.janela.cria("500px","300px",i3GEO.configura.locaplic+'/ferramentas/inserexy2/index.htm',"","","Insere");if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.mapa.inserePonto()")<0){i3GEO.eventos.MOUSECLIQUE.push("i3GEO.mapa.inserePonto()")}var temp=function(){i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.mapa.inserePonto()");i3GEO.barraDeBotoes.ativaBotoes()};YAHOO.util.Event.addListener(janela[0].close,"click",temp)}},cliqueGrafico:function(){if(g_tipoacao!="inseregrafico"){g_tipoacao="inseregrafico";var temp=Math.random()+"a";temp=temp.split(".");g_nomepin="pin"+temp[1];var janela=i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+'/ferramentas/inseregrafico/index.htm',"","","Insere");if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.mapa.insereGrafico()")<0){i3GEO.eventos.MOUSECLIQUE.push("i3GEO.mapa.insereGrafico()")}var temp=function(){i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.mapa.insereGrafico()");i3GEO.barraDeBotoes.ativaBotoes()};YAHOO.util.Event.addListener(janela[0].close,"click",temp)}},cliqueIdentificaDefault:function(){if(g_tipoacao=="identifica"){i3GEO.eventos.MOUSEPARADO.remove("verificaTip()");var janela=i3GEO.janela.cria("450px","250px",i3GEO.configura.locaplic+'/ferramentas/identifica/index.htm?&x='+objposicaocursor.ddx+'&y='+objposicaocursor.ddy+'&escala='+i3GEO.parametros.mapscale,"","","Identifica <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=8&idajuda=70' >&nbsp;&nbsp;&nbsp;</a>");if(i3GEO.interface.ATUAL!="googlemaps"){var temp=function(){i3GEO.eventos.MOUSECLIQUE.remove("cliqueIdentifica()");i3GEO.barraDeBotoes.ativaBotoes()};YAHOO.util.Event.addListener(janela[0].close,"click",temp)}}},verificaTipDefault:function(){var ntemas=i3GEO.arvoreDeCamadas.CAMADAS.length;var etiquetas=false;for(var j=0;j<ntemas;j++){if(i3GEO.arvoreDeCamadas.CAMADAS[j].etiquetas!=""){var etiquetas=true}}if(etiquetas==false){return}if($i("img")){$i("img").style.cursor="wait"}var retorna=function(retorno){var i=$i("i3geo_rosa");if(i){i.style.display="none"}var mostra=false;try{var retorno=retorno.data;if($i("img")){$i("img").title=""}if(retorno!=""){var res="";var temas=retorno.split("!");var tema=temas.length-1;if(tema>=0){do{var titulo=temas[tema].split("@");if(i3GEO.configura.tipotip=="completo"||i3GEO.configura.tipotip=="balao"){res+="<span style='text-align:left;font-size:9pt'><b>"+titulo[0]+"</b></span><br>"}var ocorrencias=titulo[1].split("*");var ocorrencia=ocorrencias.length-1;if(ocorrencia>=0){do{if(ocorrencias[ocorrencia]!=""){var pares=ocorrencias[ocorrencia].split("##");var paresi=pares.length;for(var par=0;par<paresi;par++){var valores=pares[par].split("#");if(i3GEO.configura.tipotip=="completo"||i3GEO.configura.tipotip=="balao"){res=res+"<span class='tiptexto' style='text-align:left;font-size:9pt'>"+valores[0]+" <i>"+valores[1]+"</i></span><br>";var mostra=true}else{res=res+"<span class='tiptexto' style='text-align:left;font-size:9pt'><i>"+valores[1]+"</i></span><br>";var mostra=true}}}}while(ocorrencia--)}}while(tema--)}if(!mostra){$i("tip").style.display="none";return}else{if(i3GEO.configura.tipotip!="balao"){var n=i3GEO.janela.tip();$i(n).style.textAlign="left";$i(n).innerHTML+=res}else{i3GEO.util.criaPin('marcaIdentifica',i3GEO.configura.locaplic+"/imagens/grabber.gif","12px","12px");i3GEO.util.posicionaImagemNoMapa("marcaIdentifica");balloon=new Balloon;balloon.delayTime=0;var res="<div style=text-align:left >"+res+"</div>";balloon.showTooltip($i("marcaIdentifica"),res);$i('marcaIdentifica').onclick=$i("closeButton").onclick}}}if($i("img")){var temp="zoom";if(i3GEO.interface.ATIVAMENUCONTEXTO)var temp="identifica_contexto";i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,"img",i3GEO.configura.locaplic)}}catch(e){if($i("img")){var temp="identifica";if(i3GEO.interface.ATIVAMENUCONTEXTO)var temp="identifica_contexto";i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,"img",i3GEO.configura.locaplic)}}};i3GEO.php.identifica(retorna,objposicaocursor.ddx,objposicaocursor.ddy,"5")}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.tema={exclui:function(tema){g_operacao="excluitema";var p=document.getElementById("idx"+tema).parentNode.parentNode.parentNode;do{p.removeChild(p.childNodes[0])}while(p.childNodes.length>0);p.parentNode.removeChild(p);i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.excluitema(i3GEO.atualiza,tema);i3GEO.temaAtivo=""},fonte:function(tema){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));var temp=function(retorno){i3GEO.janela.fechaAguarde();if(retorno.data!="erro"){window.open(retorno.data)}else{alert("Não existe fonte registrada para esse tema")}};i3GEO.php.fontetema(temp,tema)},sobe:function(tema){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.sobetema(i3GEO.atualiza,tema)},desce:function(tema){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.descetema(i3GEO.atualiza,tema)},zoom:function(tema){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.zoomtema(i3GEO.atualiza,tema)},zoomsel:function(tema){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.zoomsel(i3GEO.atualiza,tema)},limpasel:function(tema){g_operacao="limpasel";i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.limpasel(i3GEO.atualiza,tema)},mudatransp:function(idtema){g_operacao="transparencia";if($i("tr"+idtema)){var valor=$i("tr"+idtema).value}else{alert("Ocorreu um erro")}if(valor!=""){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.mudatransp(i3GEO.atualiza,idtema,valor)}else{alert("Valor não definido.")}},mudanome:function(idtema){g_operacao="mudanome";if($i("nn"+idtema)){var valor=$i("nn"+idtema).value}else{alert("Ocorreu um erro")}if(valor!=""){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.mudanome(i3GEO.atualiza,idtema,valor)}else{alert("Nome não definido")}},mostralegendajanela:function(idtema,nome,tipoOperacao){if(tipoOperacao=="ativatimer"){mostralegendajanelaTimer=setTimeout("i3GEO.tema.mostralegendajanela('"+idtema+"','"+nome+"','abrejanela')",4000)}if(tipoOperacao=="abrejanela"){try{clearTimeout(mostralegendajanelaTimer)}catch(e){};var retorna=function(retorno){$i("janelaLegenda"+idtema+"_corpo").innerHTML=retorno.data.legenda};if(!$i("janelaLegenda"+idtema)){var janela=i3GEO.janela.cria("250px","","","","",nome,"janelaLegenda"+idtema,false);janela[2].style.textAlign="left";janela[2].style.background="white";janela[2].innerHTML=$trad("o1")}i3GEO.php.criaLegendaHTML(retorna,idtema,"legenda3.htm")}if(tipoOperacao=="desativatimer"){clearTimeout(mostralegendajanelaTimer)}},dialogo:{abreKml:function(tema){if(tema=="mapfile"){if(i3GEO.parametros.mapfile==""){alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return}return(i3GEO.janela.cria("450px","250px",i3GEO.configura.locaplic+'/ferramentas/convertekml/index.htm?tema='+i3GEO.parametros.mapfile,"","","Kml"))}else{return(i3GEO.janela.cria("450px","250px",i3GEO.configura.locaplic+'/ferramentas/convertekml/index.htm?tema='+tema,"","","Kml"))}},graficotema:function(idtema){return(i3GEO.janela.cria("350px","340px",i3GEO.configura.locaplic+"/ferramentas/graficotema/index.htm?tema="+idtema,"","","Gr&aacute;fico <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=40' >&nbsp;&nbsp;&nbsp;</a>"))},toponimia:function(idtema){i3GEO.janela.cria("350px","340px",i3GEO.configura.locaplic+"/ferramentas/toponimia/index.htm?tema="+idtema,"","","Topon&iacute;mia <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=36' >&nbsp;&nbsp;&nbsp;</a>")},filtro:function(idtema){i3GEO.janela.cria("480px","250px",i3GEO.configura.locaplic+"/ferramentas/filtro/index.htm?tema="+idtema,"","","Filtro <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=38' >&nbsp;&nbsp;&nbsp;</a>")},procuraratrib:function(idtema){i3GEO.janela.cria("280px","320px",i3GEO.configura.locaplic+"/ferramentas/busca/index.htm?tema="+idtema,"","","Procurar <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=35' >&nbsp;&nbsp;&nbsp;</a>","janela_busca")},tabela:function(idtema){i3GEO.janela.cria("500px","400px",i3GEO.configura.locaplic+"/ferramentas/tabela/index.htm?tema="+idtema,"","","Tabela <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=39' >&nbsp;&nbsp;&nbsp;</a>")},etiquetas:function(idtema){i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/etiqueta/index.htm?tema="+idtema,"","","Etiquetas <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=37' >&nbsp;&nbsp;&nbsp;</a>")},editaLegenda:function(idtema){i3GEO.janela.cria("490px","340px",i3GEO.configura.locaplic+"/ferramentas/legenda/index.htm?tema="+idtema,"","","Legenda <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=41' >&nbsp;&nbsp;&nbsp;</a>")},download:function(idtema){i3GEO.janela.cria("300px","150px",i3GEO.configura.locaplic+"/ferramentas/download/index.htm?tema="+idtema,"","","Download")},sld:function(idtema){i3GEO.janela.cria("500px","350px",i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?funcao=tema2sld&tema="+idtema+"&g_sid="+i3GEO.configura.sid,"","","SLD <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=41' >&nbsp;&nbsp;&nbsp;</a>")}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.analise={dialogo:{gradePontos:function(){i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/gradepontos/index.htm","","","Grade de pontos <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=15' >&nbsp;&nbsp;&nbsp;</a>")},gradePol:function(){i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/gradepol/index.htm","","","Grade de pol&iacute;gonos <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=14' >&nbsp;&nbsp;&nbsp;</a>")},gradeHex:function(){i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/gradehex/index.htm","","","Grade de hex&aacute;gonos <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=16' >&nbsp;&nbsp;&nbsp;</a>")},analisaGeometrias:function(){g_tipoacao="selecao";i3GEO.temaAtivo="";i3GEO.janela.cria("500px","400px",i3GEO.configura.locaplic+'/ferramentas/analisageometrias/index.htm',"","","An&aacute;lise de geometrias <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=23' >&nbsp;&nbsp;&nbsp;</a>")},pontosdistri:function(){if(i3GEO.parametros.r=="nao"){alert("Opção não disponível")}else{i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+"/ferramentas/pontosdistri/index.htm","","","Distribui&ccedil;&atilde;o de pontos <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=20' >&nbsp;&nbsp;&nbsp;</a>")}},pontoempoligono:function(){i3GEO.janela.cria("400px","250px",i3GEO.configura.locaplic+"/ferramentas/pontoempoligono/index.htm","","","Ponto em pol&iacute;gono <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=18' >&nbsp;&nbsp;&nbsp;</a>")},nptPol:function(){i3GEO.janela.cria("400px","200px",i3GEO.configura.locaplic+"/ferramentas/nptpol/index.htm","","","Pontos por pol&iacute;gono <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=19' >&nbsp;&nbsp;&nbsp;</a>")},buffer:function(){i3GEO.janela.cria("400px","180px",i3GEO.configura.locaplic+"/ferramentas/buffer/index.htm","","","Entorno <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=24' >&nbsp;&nbsp;&nbsp;</a>")},distanciaptpt:function(){i3GEO.janela.cria("400px","220px",i3GEO.configura.locaplic+"/ferramentas/distanciaptpt/index.htm","","","Dist&acirc;ncia <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=17' >&nbsp;&nbsp;&nbsp;</a>")},centroide:function(){i3GEO.janela.cria("400px","180px",i3GEO.configura.locaplic+"/ferramentas/centroide/index.htm","","","Centróide <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=21' >&nbsp;&nbsp;&nbsp;</a>")},dissolve:function(){i3GEO.janela.cria("400px","230px",i3GEO.configura.locaplic+"/ferramentas/dissolve/index.htm","","","Dissolve <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=22' >&nbsp;&nbsp;&nbsp;</a>")},agrupaElementos:function(){i3GEO.janela.cria("400px","230px",i3GEO.configura.locaplic+"/ferramentas/agrupaelementos/index.htm","","","Agrupa <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=3&idajuda=25' >&nbsp;&nbsp;&nbsp;</a>")}},medeDistancia:{inicia:function(){pontosdistobj=new Array();i3GEO.analise.medeDistancia.criaJanela();if(g_tipoacao!="mede"){if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.analise.medeDistancia.clique()")<0){i3GEO.eventos.MOUSECLIQUE.push("i3GEO.analise.medeDistancia.clique()")}if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.analise.medeDistancia.movimento()")<0){i3GEO.eventos.MOUSEMOVE.push("i3GEO.analise.medeDistancia.movimento()")}$i("mostradistancia").style.display="block";i3GEO.desenho.criaContainerRichdraw();i3GEO.desenho.richdraw.lineColor="black";i3GEO.desenho.richdraw.lineWidth="1px";g_tipoacao="mede"}else{i3GEO.desenho.richdraw.fecha();if($i("mostradistancia")){$i("mostradistancia").style.display="none"}if($i("pontosins")){$i("pontosins").style.display="none"}}},criaJanela:function(){if(!$i("mostradistancia")){var novoel=document.createElement("div");novoel.id="mostradistancia";var ins='<div class="hd" >&nbsp;  <a class=ajuda_usuario target=_blank href="'+i3GEO.configura.locaplic+'/ajuda_usuario.php?idcategoria=6&idajuda=50" >&nbsp;&nbsp;&nbsp;</a></div>';ins+='<div class="bd" style="text-align:left;padding:3px;" >';ins+='<div style="text-align:left;padding:3px;" id="mostradistancia_calculo" ></div>';ins+='<div style="text-align:left;font-size:10px" >';ins+="<span style='color:navy;cursor:pointer;text-align:left;' >";ins+="<table><tr><td><input style='cursor:pointer' type='checkbox' id='pararraios' checked /></td><td>Raios</td><td>&nbsp;</td>";ins+="<td><input style='cursor:pointer' type='checkbox' id='parartextos' checked /></td><td>Textos<td></tr></table></span>";ins+='</div>';ins+='</div>';novoel.innerHTML=ins;novoel.style.borderColor="gray";document.body.appendChild(novoel)}else{if($i("mostradistancia_calculo")){$i("mostradistancia_calculo").innerHTML=""}}YAHOO.namespace("janelaDocamede.xp");YAHOO.janelaDocamede.xp.panel=new YAHOO.widget.Panel("mostradistancia",{width:300,fixedcenter:false,constraintoviewport:true,underlay:"none",close:true,visible:true,draggable:true,modal:false});YAHOO.janelaDocamede.xp.panel.render();var imagemxy=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));YAHOO.janelaDocamede.xp.panel.moveTo(imagemxy[0]+150,imagemxy[1]);YAHOO.util.Event.addListener(YAHOO.janelaDocamede.xp.panel.close,"click",i3GEO.analise.medeDistancia.fechaJanela)},fechaJanela:function(){i3GEO.desenho.richdraw.fecha();if($i("pontosins")){document.body.removeChild($i("pontosins"))}YAHOO.util.Event.removeListener(YAHOO.janelaDocamede.xp.panel.close,"click");i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.analise.medeDistancia.clique()");i3GEO.eventos.MOUSEMOVE.remove("i3GEO.analise.medeDistancia.movimento()");i3GEO.barraDeBotoes.ativaBotoes()},clique:function(){if(g_tipoacao=="mede"){var n=pontosdistobj.xpt.length;pontosdistobj.xpt[n]=objposicaocursor.ddx;pontosdistobj.ypt[n]=objposicaocursor.ddy;pontosdistobj.xtela[n]=objposicaocursor.telax;pontosdistobj.ytela[n]=objposicaocursor.telay;pontosdistobj.ximg[n]=objposicaocursor.imgx;pontosdistobj.yimg[n]=objposicaocursor.imgy;pontosdistobj.dist[n]=0;try{if(navn){pontosdistobj.linhas[n]=i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,(pontosdistobj.ximg[n]-1),(pontosdistobj.yimg[n]-1),(pontosdistobj.ximg[n]-1),(pontosdistobj.yimg[n]-1))}else{pontosdistobj.linhas[n]=i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n])}}catch(e){window.status=n+" erro ao desenhar a linha base "+e.message}if(n>0){var d=parseInt(i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy));pontosdistobj.dist[n]=d+pontosdistobj.dist[n-1];if($i("pararraios")&&$i("pararraios").checked==true){i3GEO.desenho.aplica("insereCirculo","",n);if(navm){pontosdistobj.linhas[n]=i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,(pontosdistobj.ximg[n-1])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n-1],(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n])}}if($i("parartextos")&&$i("parartextos").checked==true){i3GEO.desenho.aplica("insereTexto","",n,d+" km")}}i3GEO.util.insereMarca.cria(objposicaocursor.imgx,objposicaocursor.imgy,i3GEO.analise.medeDistancia.fechaJanela,"divGeometriasTemp")}},movimento:function(){if(g_tipoacao=="mede"){if($i("mostradistancia"))$i("mostradistancia").style.display="block";var n=pontosdistobj.xpt.length;if(n>0){var d=i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);var r=i3GEO.calculo.direcao(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);var r=i3GEO.calculo.dd2dms(r,r);var r=r[0];if(i3GEO.parametros.mapscale>500000){var d=parseInt(d)}else{d=d+"";d=d.split(".");var decimal=d[1].substr(0,3);d=d[0]+"."+decimal;d=d*1}var da=d+pontosdistobj.dist[n-1];if($i("mostradistancia_calculo")){$i("mostradistancia_calculo").innerHTML=" Dist acum.= "+da+" atual= "+d+" km <br> Direção (DMS)= "+r}i3GEO.desenho.aplica("resizeLinha",pontosdistobj.linhas[n-1],n)}}}},medeArea:{inicia:function(){i3GEO.analise.medeArea.criaJanela();if(g_tipoacao!="area"){$i("mostraarea_calculo").innerHTML="";if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.analise.medeArea.clique()")<0){i3GEO.eventos.MOUSECLIQUE.push("i3GEO.analise.medeArea.clique()")}if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.analise.medeArea.movimento()")<0){i3GEO.eventos.MOUSEMOVE.push("i3GEO.analise.medeArea.movimento()")}YAHOO.util.Event.addListener(YAHOO.janelaDocaarea.xp.panel.close,"click",i3GEO.analise.medeArea.fechaJanela);var temp=function(retorno){i3GEO.janela.fechaAguarde("i3GEO.atualiza");g_areapixel=retorno.data;if(g_areapixel<0){alert("Nao e possivel calcular a area. Entre em contato com o administrador do sistema.")}else{alert("Clique no mapa para desenhar o poligono. Clique duas vezes para concluir");i3GEO.barraDeBotoes.ativaIcone("area");g_tipoacao="area";i3GEO.desenho.criaContainerRichdraw();i3GEO.desenho.richdraw.lineColor="green";i3GEO.desenho.richdraw.lineWidth="2px"}};if(i3GEO.interface.ATUAL=="padrao"){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.areaPixel(temp,i3GEO.parametros.pixelsize)}else{alert("Operacao nao disponivel")}}else{i3GEO.desenho.richdraw.fecha()}},criaJanela:function(){if(!$i("mostraarea")){var novoel=document.createElement("div");novoel.id="mostraarea";var ins="<div class='hd' >&Aacute;rea aproximada <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=6&idajuda=51' >&nbsp;&nbsp;&nbsp;</a></div>";ins+='<div class="bd" style="text-align:left;padding:3px;" >';ins+='<div style="text-align:left;padding:3px;font-size:10px" id="mostraarea_calculo" ></div>';ins+='</div>';novoel.innerHTML=ins;novoel.style.borderColor="gray";document.body.appendChild(novoel)}YAHOO.namespace("janelaDocaarea.xp");YAHOO.janelaDocaarea.xp.panel=new YAHOO.widget.Panel("mostraarea",{width:220,fixedcenter:false,constraintoviewport:true,underlay:"none",close:true,visible:true,draggable:true,modal:false});YAHOO.janelaDocaarea.xp.panel.render();var imagemxy=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));YAHOO.janelaDocaarea.xp.panel.moveTo(imagemxy[0]+150,imagemxy[1])},fechaJanela:function(){i3GEO.desenho.richdraw.fecha();if($i("pontosArea")){document.body.removeChild($i("pontosArea"))}i3GEO.eventos.MOUSECLIQUE.remove("cliqueArea()");i3GEO.eventos.MOUSEMOVE.remove("moveArea()");i3GEO.barraDeBotoes.ativaBotoes()},clique:function(){if(g_tipoacao=="area"){var n=pontosdistobj.xpt.length;pontosdistobj.xpt[n]=objposicaocursor.ddx;pontosdistobj.ypt[n]=objposicaocursor.ddy;pontosdistobj.xtela[n]=objposicaocursor.telax;pontosdistobj.ytela[n]=objposicaocursor.telay;pontosdistobj.ximg[n]=objposicaocursor.imgx;pontosdistobj.yimg[n]=objposicaocursor.imgy;pontosdistobj.dist[n]=0;if(n==0){try{if(navn){pontosdistobj.linhastemp=i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[0]-1,pontosdistobj.yimg[0]-1)}else{pontosdistobj.linhastemp=i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[0])-(i3GEO.parametros.w/2),pontosdistobj.yimg[0])}}catch(e){}}try{if(navn){pontosdistobj.linhas[n]=i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1,pontosdistobj.ximg[n]-1,pontosdistobj.yimg[n]-1)}else{pontosdistobj.linhas[n]=i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n])}}catch(e){}var m=i3GEO.calculo.area(pontosdistobj,g_areapixel);if($i("mostraarea_calculo")){$i("mostraarea_calculo").innerHTML="<br>m2</b>= "+m+"<br><b>km2</b>= "+m/1000000+"<br><b>ha</b>= "+m/10000}if(n>3){}i3GEO.util.insereMarca.cria(objposicaocursor.imgx,objposicaocursor.imgy,i3GEO.analise.medeArea.fechaJanela,"pontosArea")}},movimento:function(){if(g_tipoacao=="area"){var n=pontosdistobj.xpt.length;if(n>0){var d=i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy);if(i3GEO.parametros.mapscale>500000){var d=parseInt(d)}else{d=d+"";d=d.split(".");var decimal=d[1].substr(0,3);d=d[0]+"."+decimal;d=d*1}var da=d+pontosdistobj.dist[n-1];if(navn){i3GEO.desenho.aplica("resizePoligono",pontosdistobj.linhastemp,0)}i3GEO.desenho.aplica("resizeLinha",pontosdistobj.linhas[n-1],n)}}}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.maparef={fatorZoomDinamico:-3,SELETORTIPO:true,PERMITEFECHAR:true,PERMITEDESLOCAR:true,TRANSICAOSUAVE:false,OPACIDADE:35,TOP:4,RIGHT:0,inicia:function(){if(!$i("i3geo_winRef")){var novoel=document.createElement("div");novoel.id="i3geo_winRef";novoel.style.display="none";novoel.style.borderColor="gray";var ins="";if(i3GEO.maparef.PERMITEDESLOCAR){ins+='<div class="hd" style="text-align:left;z-index:20;">';ins+='<span id=maparefmaismenosZoom > ';var temp="javascript:if(i3GEO.maparef.fatorZoomDinamico == -1){i3GEO.maparef.fatorZoomDinamico = 1};i3GEO.maparef.fatorZoomDinamico = i3GEO.maparef.fatorZoomDinamico + 1 ;$i(\"refDinamico\").checked = true;i3GEO.maparef.atualiza();";ins+="<img class=mais onclick='"+temp+"' src="+i3GEO.util.$im("branco.gif")+" />";var temp="javascript:if(i3GEO.maparef.fatorZoomDinamico == 1){i3GEO.maparef.fatorZoomDinamico = -1};i3GEO.maparef.fatorZoomDinamico = i3GEO.maparef.fatorZoomDinamico - 1 ;$i(\"refDinamico\").checked = true;i3GEO.maparef.atualiza();";ins+="<img class=menos onclick='"+temp+"' src="+i3GEO.util.$im("branco.gif")+" /></span>&nbsp;";if(i3GEO.maparef.SELETORTIPO){ins+="<select id='refDinamico' onchange='javascript:i3GEO.maparef.atualiza()'>";ins+="<option value='fixo' select >fixo</option>";ins+="<option value='mapa' >mapa</option>";ins+="<option value='dinamico' >dinâmico</option>";ins+="</select>"}ins+="</div>"}ins+='<div class="bd" style="text-align:left;padding:3px;border-bottom-width:1px;" id="mapaReferencia" onmouseover="this.onmousemove=function(exy){i3GEO.eventos.posicaoMouseMapa(exy)}"  >';ins+='<img style="cursor:pointer;" id=imagemReferencia src="" onclick="javascript:i3GEO.maparef.click()">';ins+='</div>';novoel.innerHTML=ins;document.body.appendChild(novoel);if(i3GEO.maparef.TRANSICAOSUAVE){var novoel=$i("imagemReferencia");if(navm){novoel.style.filter='alpha(opacity='+i3GEO.maparef.OPACIDADE+')'}else{novoel.style.opacity=i3GEO.maparef.OPACIDADE/100}novoel.onmouseover=function(){if(navm){novoel.style.filter='alpha(opacity=100)'}else{novoel.style.opacity=1}};novoel.onmouseout=function(){if(navm){novoel.style.filter='alpha(opacity='+i3GEO.maparef.OPACIDADE+')'}else{novoel.style.opacity=i3GEO.maparef.OPACIDADE/100}}}}if($i("i3geo_winRef").style.display!="block"){$i("i3geo_winRef").style.display="block";YAHOO.namespace("janelaRef.xp");var temp="none";if(i3GEO.maparef.PERMITEDESLOCAR)var temp="shadow";YAHOO.janelaRef.xp.panel=new YAHOO.widget.Panel("i3geo_winRef",{height:"200px",width:"156px",fixedcenter:false,constraintoviewport:true,underlay:temp,close:i3GEO.maparef.PERMITEFECHAR,visible:true,draggable:i3GEO.maparef.PERMITEDESLOCAR,modal:false});YAHOO.janelaRef.xp.panel.render();var r=$i("i3geo_winRef_c");if(r){r.style.clip="rect(0px, 160px, 179px, 0px)";r.style.position="absolute"}var pos=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));var moveX=pos[0]+i3GEO.parametros.w+153-i3GEO.maparef.RIGHT-300;var moveY=pos[1]+i3GEO.maparef.TOP;YAHOO.janelaRef.xp.panel.moveTo(moveX,moveY);var escondeRef=function(){YAHOO.util.Event.removeListener(YAHOO.janelaRef.xp.panel.close,"click");YAHOO.janelaRef.xp.panel.destroy();i3GEO.util.insereCookie("i3GEO.configura.mapaRefDisplay","none")};YAHOO.util.Event.addListener(YAHOO.janelaRef.xp.panel.close,"click",escondeRef);i3GEO.util.insereCookie("i3GEO.configura.mapaRefDisplay","block");if(typeof(atualizaLocalizarxy)=="function"){if(i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml)YAHOO.util.Event.addListener($i("imagemReferencia"),"mousemove",atualizaLocalizarxy)}}if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.maparef.atualiza()")<0){i3GEO.eventos.NAVEGAMAPA.push("i3GEO.maparef.atualiza()")}this.atualiza();$i("i3geo_winRef_h").className="hd2"},atualiza:function(){var dinamico=false;if($i("refDinamico")){var tiporef=$i("refDinamico").value}else{var tiporef="fixo"}if($i("mapaReferencia")){var temp=$i("maparefmaismenosZoom");if(tiporef=="dinamico"){i3GEO.php.referenciadinamica(i3GEO.maparef.processaImagem,i3GEO.maparef.fatorZoomDinamico,tiporef);if(temp){temp.style.display="inline"}}if(tiporef=="fixo"){if(($i("imagemReferencia").src=="")||(i3GEO.parametros.cgi!="sim")){i3GEO.php.referencia(i3GEO.maparef.processaImagem);if(temp){temp.style.display="none"}}else{var re=new RegExp("&mode=map","g");$i("imagemReferencia").src=$i(i3GEO.interface.IDMAPA).src.replace(re,'&mode=reference');i3GEO.gadgets.quadros.grava("referencia",$i("imagemReferencia").src)}}if(tiporef=="mapa"){i3GEO.php.referenciadinamica(i3GEO.maparef.processaImagem,i3GEO.maparef.fatorZoomDinamico,tiporef);if(temp){temp.style.display="inline"}}}else{if($i("imagemReferencia"))i3GEO.gadgets.quadros.grava("referencia",$i("imagemReferencia").src);i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.maparef.atualiza()")}},processaImagem:function(retorno){i3GEO.janela.fechaAguarde("ajaxreferencia1");if((retorno.data!="erro")&&(retorno.data!=undefined)){eval(retorno.data);i3GEO.parametros.celularef=g_celularef;i3GEO.parametros.extentref=extentref;if($i("imagemReferencia")){var m=new Image();m.src=refimagem;$i("imagemReferencia").src=m.src}i3GEO.gadgets.quadros.grava("referencia",refimagem);var tiporef="fixo";if($i("refDinamico")){var tiporef=$i("refDinamico").value}var box=$i("boxref");if(tiporef!="fixo"){if(box){box.style.display="none"}return}if(!box){var novoel=document.createElement("div");novoel.id="boxref";novoel.style.zIndex=10;novoel.style.position='absolute';novoel.style.cursor="move";novoel.style.backgroundColor="RGB(120,220,220)";if(navm){novoel.style.filter='alpha(opacity=40)'}else{novoel.style.opacity=.4}$i("mapaReferencia").appendChild(novoel);var boxrefdd=new YAHOO.util.DD("boxref");novoel.onmouseup=function(){var rect=$i("boxref");var telaminx=parseInt(rect.style.left);var telamaxy=parseInt(rect.style.top);var telamaxx=telaminx+parseInt(rect.style.width);var telaminy=telamaxy+parseInt(rect.style.height);var m=i3GEO.calculo.tela2dd(telaminx,telaminy,i3GEO.parametros.celularef,i3GEO.parametros.extentref);var x=i3GEO.calculo.tela2dd(telamaxx,telamaxy,i3GEO.parametros.celularef,i3GEO.parametros.extentref);var ext=m[0]+" "+m[1]+" "+x[0]+" "+x[1];i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",ext)};var box=$i("boxref")}i3GEO.calculo.ext2rect("boxref",extentref,i3GEO.parametros.mapexten,g_celularef,$i("mapaReferencia"));if(parseInt(box.style.width)>120)box.style.display="none";else{box.style.display="block";box.style.top=parseInt(box.style.top)+2;box.style.left=parseInt(box.style.left)+2}}},click:function(){try{i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.pan(i3GEO.atualiza,i3GEO.parametros.mapscale,"ref",objposicaocursor.refx,objposicaocursor.refy)}catch(e){var e="";i3GEO.janela.fechaAguarde("i3GEO.atualiza")}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.ajuda={ATIVAJANELA:true,DIVAJUDA:"i3geo_ajuda",DIVLETREIRO:"i3geo_letreiro",MENSAGEMPADRAO:"",TRANSICAOSUAVE:true,OPACIDADE:20,abreDoc:function(){window.open(i3GEO.configura.locaplic+"/documentacao/index.html")},abreJanela:function(){try{if(i3GEO.ajuda.ATIVAJANELA==false){return}if(!$i("janelaMenTexto")){var nx="";var ny="";if($i(i3GEO.interface.IDCORPO)){var pos=YAHOO.util.Dom.getXY($i(i3GEO.interface.IDCORPO));var nx=pos[0]-267;var ny=i3GEO.parametros.h-70}var texto='<div id="janelaMenTexto" style="text-align:left;font-size:10px;color:rgb(80,80,80)">'+i3GEO.ajuda.MENSAGEMPADRAO+'</div>';var janela=i3GEO.janela.cria("262","auto","",nx,ny,"&nbsp;","i3geo_janelaMensagens",false);janela[2].innerHTML=texto;YAHOO.util.Event.addListener(janela[0].close,"click",i3GEO.ajuda.fechaJanela);i3GEO.ajuda.ativaCookie()}}catch(e){}},ativaCookie:function(){i3GEO.util.insereCookie("g_janelaMen","sim")},ativaLetreiro:function(mensagem){if($i(i3GEO.ajuda.DIVLETREIRO)){if(arguments.length==0){var mensagem=i3GEO.parametros.mensagens}if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.ajuda.ativaLetreiro()")<0){i3GEO.eventos.NAVEGAMAPA.push("i3GEO.ajuda.ativaLetreiro()")}try{clearTimeout(i3GEO.ajuda.tempoLetreiro)}catch(e){i3GEO.ajuda.tempoLetreiro=""}var l=$i(i3GEO.ajuda.DIVLETREIRO);if(l.style.display=="none"){return}l.style.cursor="pointer";if(mensagem==""){l.value="";return}if(l.size==1){l.size=i3GEO.parametros.w/8}BMessage=mensagem+" ---Clique para parar--- ";l.onclick=function(){l.style.display="none"};if(BMessage!=" ---Clique para parar--- "){BQuantas=0;BSize=l.size;BPos=BSize;BSpeed=1;BSpaces="";i3GEO.ajuda.mostraLetreiro()}i3GEO.ajuda.mostraLetreiro(mensagem)}},desativaCookie:function(){i3GEO.util.insereCookie("g_janelaMen","nao")},fechaJanela:function(){i3GEO.ajuda.desativaCookie();if($i("i3geo_janelaMensagens_c"))document.body.removeChild($i("i3geo_janelaMensagens_c"))},mostraJanela:function(texto){if($i(i3GEO.ajuda.DIVAJUDA)){if(texto==""){$i(i3GEO.ajuda.DIVAJUDA).innerHTML="-"}else{$i(i3GEO.ajuda.DIVAJUDA).innerHTML=texto}}else{if($i("janelaMenTexto")&&i3GEO.ajuda.TRANSICAOSUAVE){if(texto!=""){if(navm){$i("i3geo_janelaMensagens").style.filter='alpha(opacity=100)'}else{$i("i3geo_janelaMensagens").style.opacity=1}}else{if(navm){$i("i3geo_janelaMensagens").style.filter='alpha(opacity='+i3GEO.ajuda.OPACIDADE+')'}else{$i("i3geo_janelaMensagens").style.opacity=i3GEO.ajuda.OPACIDADE/100}}}if($i("janelaMenTexto"))$i("janelaMenTexto").innerHTML=texto}},mostraLetreiro:function(){for(count=0;count<BPos;count++){BSpaces+=" "}if(BPos<1){$i(i3GEO.ajuda.DIVLETREIRO).value=BMessage.substring(Math.abs(BPos),BMessage.length);if(BPos+BMessage.length<1){BPos=BSize;BQuantas=BQuantas+1}}else{$i(i3GEO.ajuda.DIVLETREIRO).value=BSpaces+BMessage}BPos-=BSpeed;if(BQuantas<2)i3GEO.ajuda.tempoLetreiro=setTimeout('i3GEO.ajuda.mostraLetreiro();',140)}};try{if(i3GEO.ajuda.MENSAGEMPADRAO==""){try{if(g_mensagempadrao!=""){i3GEO.ajuda.MENSAGEMPADRAO=g_mensagempadrao}else i3GEO.ajuda.MENSAGEMPADRAO=$trad("p1")}catch(e){i3GEO.ajuda.MENSAGEMPADRAO=$trad("p1")}}}catch(e){}if(document.getElementById("bannerMensagem")){i3GEO.ajuda.DIVLETREIRO="bannerMensagem"}
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.janela={ANTESCRIA:new Array("i3GEO.janela.prepara()"),ANTESFECHA:new Array(),TIPS:new Array(),prepara:function(){i3GEO.util.escondePin();i3GEO.util.escondeBox()},cria:function(wlargura,waltura,wsrc,nx,ny,texto,id,modal,classe){if(i3GEO.janela.ANTESCRIA){for(i=0;i<i3GEO.janela.ANTESCRIA.length;i++){eval(i3GEO.janela.ANTESCRIA[i])}}if(arguments.length<7||id==""){var id="wdoca";var modal=false;var classe="hd"}if(arguments.length==7){var modal=false;var classe="hd"}if(arguments.length==8){var classe="hd"}var wlargura_=parseInt(wlargura)+0+"px";YAHOO.namespace("janelaDoca.xp");if($i(id)){YAHOO.janelaDoca.xp.panel.destroy()}var ins='<div id="'+id+'_cabecalho" class="hd">';ins+="<span><img id='"+id+"_imagemCabecalho' style='visibility:hidden;' src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' /></span>";ins+=texto;ins+='</div><div id="'+id+'_corpo" class="bd" style="padding:5px">';if(wsrc!="")ins+='<iframe name="'+id+'i" id="'+id+'i" valign="top" style="border:0px white solid"></iframe>';ins+='</div>';var novoel=document.createElement("div");novoel.id=id;novoel.style.display="block";novoel.innerHTML=ins;if($i("i3geo")){$i("i3geo").appendChild(novoel)}else{document.body.appendChild(novoel)}var wdocaiframe=$i(id+"i");if(wdocaiframe){with(wdocaiframe.style){width=parseInt(wlargura)-12;height=waltura};wdocaiframe.style.display="block";wdocaiframe.src=wsrc}var fix=false;if(nx==""||nx=="center"){var fix=true}if(waltura=="auto")YAHOO.janelaDoca.xp.panel=new YAHOO.widget.Panel(id,{zIndex:5000,modal:modal,width:wlargura_,underlay:"none",fixedcenter:fix,constraintoviewport:false,visible:true,iframe:false});else YAHOO.janelaDoca.xp.panel=new YAHOO.widget.ResizePanel(id,{zIndex:5000,modal:modal,width:wlargura_,fixedcenter:fix,constraintoviewport:false,visible:true,iframe:false});if(nx!=""&&nx!="center"){var pos=new Array(nx,ny);YAHOO.janelaDoca.xp.panel.moveTo(pos[0],pos[1]+50)}YAHOO.janelaDoca.xp.panel.render();$i(id+'_cabecalho').className=classe;YAHOO.util.Event.addListener(YAHOO.janelaDoca.xp.panel.close,"click",i3GEO.janela.fecha,id);return(new Array(YAHOO.janelaDoca.xp.panel,$i(id+"_cabecalho"),$i(id+"_corpo")))},fecha:function(id){i3GEO.util.escondePin();i3GEO.util.escondeBox();if($i("divGeometriasTemp")){i3GEO.desenho.richdraw.fecha()}if($i("flamingoi")){$i("flamingoi").style.display="block"}if(i3GEO.janela.ANTESFECHA){for(i=0;i<i3GEO.janela.ANTESFECHA.length;i++){eval(i3GEO.janela.ANTESFECHA[i])}}if($i(id+"_c"))$i("i3geo").removeChild($i(id+"_c"))},alteraTamanho:function(w,h,id){if(arguments.length==3){var i=$i(id)}else{var i=$i("wdoca")}if(i){i.style.width=w;i.style.height=h}},abreAguarde:function(id,texto){document.body.style.cursor="wait";if($i(id+"_mask")){document.body.removeChild($i(id+"_mask"))}if($i(id+"_c")){document.body.removeChild($i(id+"_c"))}YAHOO.namespace("aguarde."+id);var pos=[0,0];if($i("corpoMapa")){var pos=YAHOO.util.Dom.getXY($i("corpoMapa"))}else if($i("contemImg")){var pos=YAHOO.util.Dom.getXY($i("contemImg"))}eval('YAHOO.aguarde.'+id+' = new YAHOO.widget.Panel("'+id+'",{width:"240px",fixedcenter:false,underlay:"none",close:true,draggable:false,modal:true})');eval('YAHOO.aguarde.'+id+'.setBody(texto)');eval('YAHOO.aguarde.'+id+'.body.style.padding="5px"');eval('YAHOO.aguarde.'+id+'.setHeader("<span><img id=aguardeGifAberto src=\'"+i3GEO.configura.locaplic+"/imagens/aguarde.gif\' /></span>")');eval('YAHOO.aguarde.'+id+'.render(document.body)');if($i("flamingo")){eval('YAHOO.aguarde.'+id+'.moveTo(0,0)')}else{eval('YAHOO.aguarde.'+id+'.moveTo('+pos[0]+','+pos[1]+')')}eval('YAHOO.aguarde.'+id+'.show()');if($i(id+"_mask")){$i(id+"_mask").style.zIndex=5000}if($i(id+"_c")){$i(id+"_c").style.zIndex=6000}},tip:function(cabecalho){if(arguments.length==0){var cabecalho="fixar"}var Nid=YAHOO.util.Dom.generateId();var i=$i("i3geo_rosa");if(i)i.style.display="none";if($i(i3GEO.interface.IDCORPO)){$i("img").title=""}var novoel=document.createElement("div");novoel.id=Nid;novoel.style.position="absolute";novoel.style.zIndex=5000;novoel.style.textAlign="left";novoel.style.background="white";if(navm){novoel.style.filter="alpha(opacity=90)"}else{novoel.style.opacity=".9"}document.body.appendChild(novoel);i3GEO.janela.TIPS.push($i(Nid));var res="<div id='"+Nid+"cabecatip' style='text-align:left;background-color:rgb(240,240,240)'>";res+="<span style='color:navy;cursor:pointer;text-align:left' onclick='javascript:$i(\""+Nid+"cabecatip\").innerHTML =\"\";' >"+cabecalho+"</span></div>";novoel.innerHTML="<table style='text-align:left'><tr><td style='text-align:left'>"+res+"</td></tr></table>";ist=novoel.style;ist.top=objposicaocursor.telay-9;ist.left=objposicaocursor.telax-5;ist.display="block";if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.janela.excluiTips('todos')")<0){i3GEO.eventos.NAVEGAMAPA.push("i3GEO.janela.excluiTips('todos')")}if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.janela.excluiTips('naofixos')")<0){i3GEO.eventos.MOUSEMOVE.push("i3GEO.janela.excluiTips('naofixos')")}return(Nid)},excluiTips:function(tipo){if(arguments.length==0){var tipo="todos"}if(i3GEO.janela.TIPS.length>0){var ot=i3GEO.janela.TIPS.length-1;if(ot>=0){do{if(tipo=='todos'){if(i3GEO.janela.TIPS[ot]){var i=$i(i3GEO.janela.TIPS[ot].id);document.body.removeChild(i)}}if(tipo=='naofixos'){if($i(i3GEO.janela.TIPS[ot])){if($i(i3GEO.janela.TIPS[ot].id+"cabecatip").innerHTML!=""){document.body.removeChild($i(i3GEO.janela.TIPS[ot].id))}}}}while(ot--)if(tipo=="todos"){i3GEO.janela.TIPS=new Array()}}}},slider:function(funcao,inicial){var janela=i3GEO.janela.cria(230,200,"","","","Opacidade","opacidadeG");var novoel=document.createElement("div");novoel.id="slider-bg";novoel.tabindex="-1";novoel.innerHTML='<div style="cursor:default;position:absolute;top:4px" id="slider-thumb"><img src="'+i3GEO.configura.locaplic+'/imagens/thumb-n.gif"></div>';janela[2].appendChild(novoel);var Event=YAHOO.util.Event;var Dom=YAHOO.util.Dom;var lang=YAHOO.lang;var slider;var bg="slider-bg";var thumb="slider-thumb";var valuearea="slider-value";var textfield="slider-converted-value";novoel.style.position="relative";novoel.style.background='url('+i3GEO.configura.locaplic+'/imagens/bg-fader.gif) 5px 0 no-repeat';novoel.style.height="28px";novoel.style.width="228px";var topConstraint=0;var bottomConstraint=200;var scaleFactor=1;var keyIncrement=20;var tickSize=20;Event.onDOMReady(function(){slider=YAHOO.widget.Slider.getHorizSlider(bg,thumb,topConstraint,bottomConstraint,20);slider.setValue(parseInt(inicial));slider.getRealValue=function(){return Math.round(this.getValue()*scaleFactor)};slider.subscribe("slideEnd",function(offsetFromStart){var actualValue=slider.getRealValue();eval(funcao+"("+actualValue+")")})});Event.on("putval","click",function(e){slider.setValue(100,false)})},fechaAguarde:function(id){document.body.style.cursor="default";if(arguments.length>0){try{eval('YAHOO.aguarde.'+id+'.destroy()')}catch(e){}}else{try{i3GEO.janela.fechaAguarde("ajaxdestaca");i3GEO.janela.fechaAguarde("ajaxabrelente");i3GEO.janela.fechaAguarde("ajaxiniciaParametros");i3GEO.janela.fechaAguarde("i3GEO.atualiza");i3GEO.janela.fechaAguarde("ajaxCorpoMapaEntorno");i3GEO.janela.fechaAguarde("ajaxCorpoMapa");i3GEO.janela.fechaAguarde("ajaxLegenda");i3GEO.janela.fechaAguarde("ajaxReferencia");i3GEO.janela.fechaAguarde("ajaxEscalaGrafica");i3GEO.janela.fechaAguarde("montaMapa");i3GEO.janela.fechaAguarde("aguardedoc");i3GEO.janela.fechaAguarde("ajaxCorpoMapa1")}catch(e){}}}};try{YAHOO.widget.ResizePanel=function(el,userConfig){if(arguments.length>0){YAHOO.widget.ResizePanel.superclass.constructor.call(this,el,userConfig)}};YAHOO.widget.ResizePanel.CSS_PANEL_RESIZE="yui-resizepanel";YAHOO.widget.ResizePanel.CSS_RESIZE_HANDLE="resizehandle";YAHOO.extend(YAHOO.widget.ResizePanel,YAHOO.widget.Panel,{init:function(el,userConfig){YAHOO.widget.ResizePanel.superclass.init.call(this,el);this.beforeInitEvent.fire(YAHOO.widget.ResizePanel);var Dom=YAHOO.util.Dom,Event=YAHOO.util.Event,oInnerElement=this.innerElement,oResizeHandle=document.createElement("DIV"),sResizeHandleId=this.id+"_resizehandle";oResizeHandle.id=sResizeHandleId;oResizeHandle.className=YAHOO.widget.ResizePanel.CSS_RESIZE_HANDLE;Dom.addClass(oInnerElement,YAHOO.widget.ResizePanel.CSS_PANEL_RESIZE);this.resizeHandle=oResizeHandle;function initResizeFunctionality(){var me=this,oHeader=this.header,oBody=this.body,oFooter=this.footer,nStartWidth,nStartHeight,aStartPos,nBodyBorderTopWidth,nBodyBorderBottomWidth,nBodyTopPadding,nBodyBottomPadding,nBodyOffset;oInnerElement.appendChild(oResizeHandle);this.ddResize=new YAHOO.util.DragDrop(sResizeHandleId,this.id);this.ddResize.setHandleElId(sResizeHandleId);this.ddResize.onMouseDown=function(e){nStartWidth=oInnerElement.offsetWidth;nStartHeight=oInnerElement.offsetHeight;if(YAHOO.env.ua.ie&&document.compatMode=="BackCompat"){nBodyOffset=0}else{nBodyBorderTopWidth=parseInt(Dom.getStyle(oBody,"borderTopWidth"),10);nBodyBorderBottomWidth=parseInt(Dom.getStyle(oBody,"borderBottomWidth"),10);nBodyTopPadding=parseInt(Dom.getStyle(oBody,"paddingTop"),10);nBodyBottomPadding=parseInt(Dom.getStyle(oBody,"paddingBottom"),10);nBodyOffset=nBodyBorderTopWidth+nBodyBorderBottomWidth+nBodyTopPadding+nBodyBottomPadding}me.cfg.setProperty("width",nStartWidth+"px");aStartPos=[Event.getPageX(e),Event.getPageY(e)]};this.ddResize.onDrag=function(e){var aNewPos=[Event.getPageX(e),Event.getPageY(e)],nOffsetX=aNewPos[0]-aStartPos[0],nOffsetY=aNewPos[1]-aStartPos[1],nNewWidth=Math.max(nStartWidth+nOffsetX,10),nNewHeight=Math.max(nStartHeight+nOffsetY,10),nBodyHeight=(nNewHeight-(oFooter.offsetHeight+oHeader.offsetHeight+nBodyOffset));me.cfg.setProperty("width",nNewWidth+"px");if(nBodyHeight<0){nBodyHeight=0}oBody.style.height=nBodyHeight+"px";if($i("wdocai")){$i("wdocai").style.height=nBodyHeight}}};function onBeforeShow(){initResizeFunctionality.call(this);this.unsubscribe("beforeShow",onBeforeShow)};function onBeforeRender(){if(!this.footer){this.setFooter("")}if(this.cfg.getProperty("visible")){initResizeFunctionality.call(this)}else{this.subscribe("beforeShow",onBeforeShow)}this.unsubscribe("beforeRender",onBeforeRender)};this.subscribe("beforeRender",onBeforeRender);if(userConfig){this.cfg.applyConfig(userConfig,true)}this.initEvent.fire(YAHOO.widget.ResizePanel)},toString:function(){return"ResizePanel "+this.id}})}catch(e){};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.guias={CONFIGURA:{"temas":{titulo:$trad("g4a"),id:"guia1",idconteudo:"guia1obj",click:""},"adiciona":{titulo:"+"+$trad("g1"),id:"guia2",idconteudo:"guia2obj",click:function(){i3GEO.guias.mostra("adiciona");if(!$i("arvoreAdicionaTema")){var ondeArvore="guia2obj";if(typeof(objmapa)!='undefined'){if(typeof(objmapa.guiaMenu)!='undefined')var ondeArvore=objmapa.guiaMenu+"obj"}}else{var ondeArvore="arvoreAdicionaTema"}if(document.getElementById("outrasOpcoesAdiciona")){i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde="outrasOpcoesAdiciona";i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore=false}i3GEO.arvoreDeTemas.cria(i3GEO.configura.sid,i3GEO.configura.locaplic,ondeArvore)}},"legenda":{titulo:$trad("g3"),id:"guia4",idconteudo:"guia4obj",click:function(){i3GEO.guias.mostra("legenda");i3GEO.mapa.legendaHTML.cria("guia4obj")}},"mapas":{titulo:"Links",id:"guia5",idconteudo:"guia5obj",click:function(){var pegaMapas=function(retorno){var ins="<br><div id='banners' style='overflow:auto;text-align:left'>";var mapa=retorno.data.mapas;var ig1lt=mapa.length;var ig1=0;if(ig1lt>0){do{var nome=mapa[ig1].NOME;if(mapa[ig1].PUBLICADO){if(mapa[ig1].PUBLICADO=="NAO"||mapa[ig1].PUBLICADO=="nao"){var nome="<s>"+nome+"</s>"}}var lkd=mapa[ig1].LINK;var link=i3GEO.configura.locaplic+"/ms_criamapa.php?temasa="+mapa[ig1].TEMAS+"&layers="+mapa[ig1].LIGADOS;if(mapa[ig1].EXTENSAO!=""){link+="&mapext="+mapa[ig1].EXTENSAO}if(mapa[ig1].OUTROS!=""){link+="&"+mapa[ig1].OUTROS}if(lkd!=""){var link=lkd}ins+="<div><a href='"+link+"'><img src='"+mapa[ig1].IMAGEM+"'></a></div><br>";ins+="<div><p style=text-align:center >"+nome+"</p></div><br>";ig1++}while(ig1<ig1lt)}$i(i3GEO.guias.CONFIGURA.mapas.idconteudo).innerHTML=ins+"</div>"};$i(i3GEO.guias.CONFIGURA.mapas.idconteudo).innerHTML="Aguarde...";i3GEO.guias.mostra("mapas");i3GEO.php.pegaMapas(pegaMapas)}}},ATUAL:"temas",IDGUIAS:"guiasYUI",cria:function(onde){var guias=i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);var nguias=guias.length;for(var g=0;g<12;g++){var tituloguia="";if($i("guia"+g)){var tituloguia=$i("guia"+g).innerHTML;var re=new RegExp("&nbsp;","g");var tituloguia=tituloguia.replace(re,'');for(ng=0;ng<nguias;ng++){if(i3GEO.guias.CONFIGURA[guias[ng]].id=="guia"+g){var tituloguia=""}}if(tituloguia!=""){eval("i3GEO.guias.CONFIGURA.guia"+g+"=new Array()");eval("i3GEO.guias.CONFIGURA.guia"+g+".titulo = '"+tituloguia+"'");eval("i3GEO.guias.CONFIGURA.guia"+g+".id = 'guia"+g+"'");eval("i3GEO.guias.CONFIGURA.guia"+g+".idconteudo = 'guia"+g+"obj'");if($i('guia'+g).onclick){eval("i3GEO.guias.CONFIGURA.guia"+g+".click = "+$i("guia"+g).onclick)}}}}var guias=i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);var nguias=guias.length;if(arguments.length==0){for(ng=0;ng<nguias;ng++){var i=$i(i3GEO.guias.CONFIGURA[guias[ng]].id);if(i){var onde=i.parentNode}}}else{var onde=$i(onde)}if(!onde){return}onde.id=i3GEO.guias.IDGUIAS;onde.className="yui-navset";var ins='<ul class="yui-nav" style="border-width:0pt 0pt 0px;border-color:rgb(240,240,240);border-bottom-color:white;">';for(ng=0;ng<nguias;ng++){if($i(i3GEO.guias.CONFIGURA[guias[ng]].idconteudo))ins+='<li><a href="#"><em><div id="'+i3GEO.guias.CONFIGURA[guias[ng]].id+'" >'+i3GEO.guias.CONFIGURA[guias[ng]].titulo+'</div></em></a></li>'}ins+="</ul>";onde.innerHTML=ins;for(g=0;g<nguias;g++){var guia=i3GEO.guias.CONFIGURA[guias[g]];var id=guia.id;if($i(id)){if(guia.click==""||guia.click==undefined)eval('$i("'+id+'").onclick = function(){i3GEO.guias.mostra("'+guias[g]+'");}');else $i(id).onclick=guia.click;$i(id).onmouseover=function(){var bcg=this.parentNode.parentNode.style;var cor=bcg.background.split(" ")[0];if(cor!="white")bcg.background="#bfdaff"};$i(id).onmouseout=function(){var bcg=this.parentNode.parentNode.style;var cor=bcg.background.split(" ")[0];if(cor!="white")bcg.background="transparent"};if($i(guia.idconteudo)){$i(guia.idconteudo).style.overflow="auto";$i(guia.idconteudo).style.height=i3GEO.parametros.h}}}i3GEO.guias.mostra(i3GEO.guias.ATUAL);i3GEO.guias.ativa(i3GEO.guias.ATUAL)},ajustaAltura:function(){var guias=i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);var nguias=guias.length;for(g=0;g<nguias;g++){var guia=i3GEO.guias.CONFIGURA[guias[g]];if($i(guia.idconteudo)){$i(guia.idconteudo).style.overflow="auto";$i(guia.idconteudo).style.height=i3GEO.parametros.h}}},mostra:function(guia){var guias=i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);var nguias=guias.length;for(g=0;g<nguias;g++){$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.display="none";if($i(i3GEO.guias.CONFIGURA[guias[g]].id))$i(i3GEO.guias.CONFIGURA[guias[g]].id).parentNode.parentNode.style.background="transparent"}if(i3GEO.guias.CONFIGURA.toString().search(guia)<0){for(g=0;g<nguias;g++){if(i3GEO.guias.CONFIGURA[guias[g]].id==guia){var guia=guias[g]}}}if($i(i3GEO.guias.CONFIGURA[guia].idconteudo)){$i(i3GEO.guias.CONFIGURA[guia].idconteudo).style.display="block";$i(i3GEO.guias.CONFIGURA[guia].id).parentNode.parentNode.style.background="white";i3GEO.guias.ATUAL=guia}},ativa:function(guia){try{if(i3GEO.guias.CONFIGURA[i3GEO.guias.ATUAL].click!=""){i3GEO.guias.CONFIGURA[i3GEO.guias.ATUAL].click.call()}}catch(e){}},libera:function(){if(!$i("conteudojanelaguias")){$i(i3GEO.interface.IDCORPO).style.left="0px";if($i(i3GEO.guias.IDGUIAS)){$i(i3GEO.guias.IDGUIAS).style.display="none"}var i=$i("contemFerramentas");if(i)i.style.display="none";var w=parseInt($i("contemFerramentas").style.width);var i=$i("visual");if(i){i.style.width="0px";i.innerHTML=""}var pos="px";var a=i3GEO.parametros.h;var l=i3GEO.parametros.w+w;i3GEO.parametros.h=a;i3GEO.parametros.w=l;if(navm){pos=""}var i=$i("img");if(i){i.style.width=l+pos;i.style.height=a+pos}var i=$i("corpoMapa");if(i){i.style.width=l+pos;i.style.height=a+pos;i.style.clip='rect('+0+" "+(l*1+2)+" "+(a*1+2)+" "+0+')'}var i=$i("mst");if(i){i.style.width=l+1+pos}var i=$i("contemImg");if(i){i.style.height=a+pos;i.style.width=l+pos}if(i3GEO.configura.entorno=="sim"){var letras=["L","O"];for(var l=0;l<2;l++){if($i("img"+letras[l])){$i("img"+letras[l]).style.width=i3GEO.parametros.w+pos;$i("img"+letras[l]).style.height=i3GEO.parametros.h+pos;$i("corpoMapa"+letras[l]).style.width=i3GEO.parametros.w+pos;$i("corpoMapa"+letras[l]).style.height=i3GEO.parametros.h+pos+pos;$i("corpoMapa"+letras[l]).style.clip='rect(0 0 0 0)'}}var letras=["N","S"];for(var l=0;l<2;l++){if($i("img"+letras[l])){$i("img"+letras[l]).style.width=i3GEO.parametros.w*2+pos;$i("img"+letras[l]).style.height=i3GEO.parametros.h*2+pos;$i("corpoMapa"+letras[l]).style.width=i3GEO.parametros.w*3+pos;$i("corpoMapa"+letras[l]).style.height=i3GEO.parametros.h+pos;$i("corpoMapa"+letras[l]).style.clip='rect(0 0 0 0)'}}}i3GEO.mapa.ajustaPosicao();var temp=function(retorno){var novoel=document.createElement("div");novoel.id="janelaguias";novoel.style.display="block";var temp='<div class="hd">Guias</div>';temp+='<div class="bd" id="conteudojanelaguias"></div>';novoel.innerHTML=temp;if($i("i3geo")){$i("i3geo").appendChild(novoel)}else{document.body.appendChild(novoel)}YAHOO.namespace("janelaguias.xp");YAHOO.janelaguias.xp.panel=new YAHOO.widget.Panel("janelaguias",{width:"270px",fixedcenter:true,constraintoviewport:false,underlay:"none",close:true,visible:true,draggable:true,modal:false});YAHOO.janelaguias.xp.panel.render();var i=$i(i3GEO.guias.IDGUIAS);$i("janelaguias").appendChild(i);i.style.borderLeft="1px solid black";i.style.borderRight="1px solid black";var guias=i3GEO.util.listaChaves(i3GEO.guias.CONFIGURA);var nguias=guias.length;for(g=0;g<nguias;g++){if($i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo)){$i("janelaguias").appendChild($i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo));$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.background="white";$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.border="1px solid black";$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.borderTop="0px solid black";$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.width="270px";$i(i3GEO.guias.CONFIGURA[guias[g]].idconteudo).style.left="-1px"}}i3GEO.atualiza("");i.style.display="block";i.style.left="-1px";i.style.width="270px"};i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.mudatamanho(temp,a,l)}else{YAHOO.janelaguias.xp.panel.render();YAHOO.janelaguias.xp.panel.show()}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.arvoreDeCamadas={EXPANDIDA:false,LEGENDAEXPANDIDA:false,OPCOESICONES:true,OPCOESTEMAS:true,OPCOESLEGENDA:true,AGUARDALEGENDA:true,CAMADAS:"",ARVORE:null,IDHTML:null,SID:null,LOCAPLIC:null,ATIVATEMA:"",cria:function(onde,temas,g_sid,g_locaplic,funcaoTema){if(arguments.length==5){i3GEO.arvoreDeCamadas.ATIVATEMA=funcaoTema}this.SID=g_sid;this.LOCAPLIC=g_locaplic;if(onde!="")this.IDHTML=onde;if(this.IDHTML==""){return}this.atualiza(temas)},atualiza:function(temas){if(this.comparaTemas(temas,this.CAMADAS)){return}if(!document.getElementById(i3GEO.arvoreDeCamadas.IDHTML)){return}document.getElementById(i3GEO.arvoreDeCamadas.IDHTML).innerHTML="";this.CAMADAS=temas;var currentIconMode;YAHOO.example.treeExample=new function(){function changeIconMode(){var newVal=parseInt(this.value);if(newVal!=currentIconMode){currentIconMode=newVal}buildTree()}function buildTree(){i3GEO.arvoreDeCamadas.ARVORE=new YAHOO.widget.TreeView(i3GEO.arvoreDeCamadas.IDHTML);var root=i3GEO.arvoreDeCamadas.ARVORE.getRoot();var tempNode=new YAHOO.widget.TextNode('',root,false);tempNode.isLeaf=false;tempNode.enableHighlight=false}buildTree()}();var root=i3GEO.arvoreDeCamadas.ARVORE.getRoot();var titulo="<table><tr><td><b>"+$trad("a7")+"</b></td><td><img id='i3geo_lixeira' title='"+$trad("t2")+"'  src='"+i3GEO.util.$im("branco.gif")+"' /></td></tr></table>";var d={html:titulo};var tempNode=new YAHOO.widget.HTMLNode(d,root,true,true);tempNode.enableHighlight=false;var c=temas.length;for(var i=0,j=c;i<j;i++){var ltema=temas[i];var d={html:i3GEO.arvoreDeCamadas.montaTextoTema(ltema),id:temas[i].name,tipo:"tema"};var temaNode=new YAHOO.widget.HTMLNode(d,tempNode,i3GEO.arvoreDeCamadas.EXPANDIDA,true);temaNode.setDynamicLoad(i3GEO.arvoreDeCamadas.montaOpcoes,currentIconMode);temaNode.expanded=false;temaNode.enableHighlight=false}document.getElementById(i3GEO.arvoreDeCamadas.IDHTML).style.textAlign="left";i3GEO.arvoreDeCamadas.ARVORE.draw();this.ativaDragDrop();if(i3GEO.interface.ATUAL=="googlemaps"){i3GEO.arvoreDeCamadas.adicionaListaKml()}},adicionaListaKml:function(){var monta=function(retorno){var raiz=retorno.data.canais;var nraiz=raiz.length;for(i=0;i<nraiz;i++){i3GEO.interface.googlemaps.adicionaKml(false,raiz[i].link,raiz[i].title,false)}node.loadComplete()};i3GEO.php.listaRSSwsARRAY(monta,"KML")},ativaDragDrop:function(){var Dom=YAHOO.util.Dom;var Event=YAHOO.util.Event;var DDM=YAHOO.util.DragDropMgr;YAHOO.example.DDList="";YAHOO.example.DDApp={init:function(){if($i("i3geo_lixeira")){new YAHOO.util.DDTarget("i3geo_lixeira")}var lista=i3GEO.arvoreDeCamadas.CAMADAS;var i=lista.length-1;if(i>=0){do{var ltema=lista[i];if($i("arrastar_"+ltema.name)){new YAHOO.example.DDList("arrastar_"+ltema.name)}}while(i--)}}};YAHOO.example.DDList=function(id,sGroup,config){YAHOO.example.DDList.superclass.constructor.call(this,id,sGroup,config);this.logger=this.logger||YAHOO;var el=this.getDragEl();Dom.setStyle(el,"opacity",0.67);this.goingUp=false;this.lastY=0};YAHOO.extend(YAHOO.example.DDList,YAHOO.util.DDProxy,{startDrag:function(x,y){this.logger.log(this.id+" startDrag");var dragEl=this.getDragEl();var clickEl=this.getEl();Dom.setStyle(clickEl,"visibility","hidden");dragEl.innerHTML=clickEl.innerHTML;Dom.setStyle(dragEl,"color",Dom.getStyle(clickEl,"color"));Dom.setStyle(dragEl,"backgroundColor",Dom.getStyle(clickEl,"backgroundColor"));Dom.setStyle(dragEl,"border","4px solid gray");Dom.setStyle(dragEl,"z-index","5000")},endDrag:function(e){var srcEl=this.getEl();var proxy=this.getDragEl();Dom.setStyle(proxy,"visibility","");var a=new YAHOO.util.Motion(proxy,{points:{to:Dom.getXY(srcEl)}},0.2,YAHOO.util.Easing.easeOut);var proxyid=proxy.id;var thisid=this.id;a.onComplete.subscribe(function(){Dom.setStyle(proxyid,"visibility","hidden");Dom.setStyle(thisid,"visibility","")});a.animate();if($i("i3geo_lixeira")){$i("i3geo_lixeira").style.border="0px solid blue"}},onDragDrop:function(e,id){if(DDM.interactionInfo.drop.length===1){var pt=DDM.interactionInfo.point;var region=DDM.interactionInfo.sourceRegion;if(!region.intersect(pt)){DDM.refreshCache();if(DDM.getDDById(id).id=="i3geo_lixeira"){i3GEO.janela.abreAguarde("ajaxCorpoMapa",$trad("o1"));var tema=(this.getEl()).id.split("arrastar_")[1];i3GEO.php.excluitema(i3GEO.atualiza,tema);i3GEO.temaAtivo=""}else{i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));var destEl=Dom.get(id);var noid=id.split("arrastar_")[1];destEl.appendChild(this.getEl());var els=i3GEO.arvoreDeCamadas.listaLigadosDesligados();var lista=els[2].join(",");i3GEO.php.reordenatemas(i3GEO.atualiza,lista)}}}},onDrag:function(e){var y=Event.getPageY(e);if(y<this.lastY){this.goingUp=true}else if(y>this.lastY){this.goingUp=false}this.lastY=y},onDragOver:function(e,id){var srcEl=this.getEl();var destEl=Dom.get(id);if($i("i3geo_lixeira")&&id=="i3geo_lixeira"){$i("i3geo_lixeira").style.border="1px solid red"}else{destEl.style.textDecoration="underline"}},onDragOut:function(e,id){$i(id).style.textDecoration="none"}});Event.onDOMReady(YAHOO.example.DDApp.init,YAHOO.example.DDApp,true)},montaOpcoes:function(node){var idtema=node.data.id;var ltema=i3GEO.arvoreDeCamadas.pegaTema(idtema);if(i3GEO.arvoreDeCamadas.OPCOESICONES==true){var farol="maisamarelo.png";if(ltema.escala*1<i3GEO.parametros.mapscale*1){var farol="maisverde.png";var mfarol=$trad("t9")}if(ltema.escala*1>i3GEO.parametros.mapscale*1){var farol="maisvermelho.png";var mfarol=$trad("t10")}if(ltema.escala==0){var farol="maisamarelo.png";var mfarol=$trad("t11")}tnome="&nbsp;<img id='farol"+ltema.name+"' src='"+i3GEO.util.$im(farol)+"' title='"+mfarol+"' \>";tnome+="&nbsp;<img  id='idx"+ltema.name+"' class='x' src='"+i3GEO.util.$im("branco.gif")+"' title='"+$trad("t12")+"' onclick='i3GEO.tema.exclui(\""+ltema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t12a")+"','exclui')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";tnome+="&nbsp;<img class='sobe' src='"+i3GEO.util.$im("branco.gif")+"' title='"+$trad("t13")+"' onclick='i3GEO.tema.sobe(\""+ltema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t14")+"','sobe')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";tnome+="&nbsp;<img class='desce' src='"+i3GEO.util.$im("branco.gif")+"' title='"+$trad("t15")+"' onclick='i3GEO.tema.desce(\""+ltema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t16")+"','desce')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";tnome+="&nbsp;<img class='fonte' src='"+i3GEO.util.$im("branco.gif")+"' title='"+$trad("a9")+"' onclick='i3GEO.tema.fonte(\""+ltema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("a9")+"','fonte')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";if((ltema.zoomtema=="sim")&&(i3GEO.interface.ATUAL!="flamingo")){tnome+="&nbsp;<img class='extent' src='"+i3GEO.util.$im("branco.gif")+"' title='"+$trad("t17")+"' onclick='i3GEO.tema.zoom(\""+ltema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t18")+"','')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>"}var d={html:tnome};var iconesNode=new YAHOO.widget.HTMLNode(d,node,false,true);iconesNode.enableHighlight=false;iconesNode.isLeaf=true}if(i3GEO.arvoreDeCamadas.OPCOESTEMAS==true){var conteudo=$trad("t18a");var d={html:conteudo,idopcoes:ltema.name};var opcoesNode=new YAHOO.widget.HTMLNode(d,node,false,true);opcoesNode.enableHighlight=false;opcoesNode.setDynamicLoad(i3GEO.arvoreDeCamadas.mostraOpcoes,1)}if(i3GEO.arvoreDeCamadas.OPCOESLEGENDA==true){var conteudo=$trad("p3");var d={html:conteudo,idlegenda:ltema.name};var opcoesNode=new YAHOO.widget.HTMLNode(d,node,i3GEO.arvoreDeCamadas.LEGENDAEXPANDIDA,true);opcoesNode.setDynamicLoad(i3GEO.arvoreDeCamadas.mostraLegenda,1);opcoesNode.enableHighlight=false}node.loadComplete()},mostraOpcoes:function(node){var idtema=node.data.idopcoes;var ltema=i3GEO.arvoreDeCamadas.pegaTema(idtema);var tnome="<span onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t19")+"','')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" >"+$trad("t20")+"</span> <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=42' >&nbsp;&nbsp;&nbsp;</a>"+$inputText("","","tr"+ltema.name,"","3",ltema.transparency)+"<img  class='tic' style='position:relative;top:3px;' onclick='i3GEO.tema.mudatransp(\""+ltema.name+"\")' src='"+i3GEO.util.$im("branco.gif")+"' />";var d={html:tnome};var n=new YAHOO.widget.HTMLNode(d,node,false,true);n.enableHighlight=false;n.isLeaf=true;var tnome="<span onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t21a")+"','')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" />"+$trad("t21")+" </span> <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=43' >&nbsp;&nbsp;&nbsp;</a>"+$inputText("","","nn"+ltema.name,"","10","")+"<img  class='tic' style='position:relative;top:3px;' onclick='i3GEO.tema.mudanome(\""+ltema.name+"\")' src='"+i3GEO.util.$im("branco.gif")+"' />";var d={html:tnome};var n=new YAHOO.widget.HTMLNode(d,node,false,true);n.enableHighlight=false;n.isLeaf=true;if((ltema.type<3)&&(ltema.connectiontype!=7)){if(i3GEO.interface.ATUAL!="flamingo"){i3GEO.arvoreDeCamadas.adicionaOpcaoTema($trad("t22"),$trad("t23"),'i3GEO.tema.dialogo.procuraratrib(\"'+ltema.name+'\")',node)}i3GEO.arvoreDeCamadas.adicionaOpcaoTema($trad("t24"),$trad("t25"),'i3GEO.tema.dialogo.toponimia(\"'+ltema.name+'\")',node);if(i3GEO.interface.ATUAL=="padrao"){i3GEO.arvoreDeCamadas.adicionaOpcaoTema($trad("t26"),$trad("t27"),'i3GEO.tema.dialogo.etiquetas(\"'+ltema.name+'\")',node)}i3GEO.arvoreDeCamadas.adicionaOpcaoTema($trad("t28"),$trad("t29"),'i3GEO.tema.dialogo.filtro(\"'+ltema.name+'\")',node);i3GEO.arvoreDeCamadas.adicionaOpcaoTema($trad("t30"),$trad("t31"),'i3GEO.tema.dialogo.tabela(\"'+ltema.name+'\")',node);if(i3GEO.parametros.versaoms>4){i3GEO.arvoreDeCamadas.adicionaOpcaoTema($trad("t37"),$trad("t37"),'i3GEO.tema.dialogo.graficotema(\"'+ltema.name+'\")',node)}}if(ltema.type<4){i3GEO.arvoreDeCamadas.adicionaOpcaoTema($trad("t32"),$trad("t33"),'i3GEO.tema.dialogo.editaLegenda(\"'+ltema.name+'\")',node)}if(i3GEO.interface.ATUAL=="padrao"){i3GEO.arvoreDeCamadas.adicionaOpcaoTema($trad("t34"),$trad("t35"),'i3GEO.navega.destacaTema.inicia(\"'+ltema.name+'\")',node)}i3GEO.arvoreDeCamadas.adicionaOpcaoTema($trad("t38"),$trad("t39"),'i3GEO.tema.dialogo.sld(\"'+ltema.name+'\")',node);node.loadComplete()},adicionaOpcaoTema:function(dica,titulo,onclick,node){var tnome="<a href='#' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+dica+"','');\" onclick="+onclick+">"+titulo+" </a>";var d={html:tnome};var n=new YAHOO.widget.HTMLNode(d,node,false,true);n.enableHighlight=false;n.isLeaf=true},mostraLegenda:function(node){var idtema=node.data.idlegenda;var ltema=i3GEO.arvoreDeCamadas.pegaTema(idtema);var retorna=function(retorno){if(retorno.data.legenda){var original=retorno;var retorno=retorno.data.legenda;if(retorno[0]){if((navn)&&(!retorno[0].imagem)){var tabela=retorno}else{var i=retorno[0].imagem;var re=new RegExp("tiff","g");var i=i.replace(re,'png');var tabela="<img src='"+i+"' />"}retorno=""}else{var linhas=retorno.split("#");if(linhas.length>1){var linhas=retorno.split("|");var tabela="<table >";var linha=linhas.length-1;if(linha>=0){do{var colunas=linhas[linha].split("#");var id=colunas[0]+"-"+colunas[1];var re=new RegExp("'","g");var exp=colunas[3].replace(re,'"');tabela+="<tr style='border-top:1px solid rgb(240,240,240);'><td><img src='"+colunas[4]+"' </td><td style='text-align:left'>"+colunas[2]+"</td></tr>"}while(linha--)}tabela+="</table><br>"}else{tabela=retorno}}}else{var tabela="<img src='"+retorno.data[0].imagem+"' />"}var incluir="<div style='text-align:left' id='"+idtema+"verdiv"+"'>"+tabela+"</div>";var d={html:incluir};var nodeLeg=new YAHOO.widget.HTMLNode(d,node,false,false);nodeLeg.enableHighlight=false;node.loadComplete();var elementos=document.getElementById(idtema+"verdiv").getElementsByTagName("input");var nelementos=elementos.length;var inputs=new Array();var i=0;if(nelementos>0){do{if(elementos[i].type=="checkbox"){inputs.push(elementos[i])}i++}while(i<nelementos)}if(original.data.desativar){var desativar=original.data.desativar;var nindices=desativar.length;var i=0;if(nindices>0){do{inputs[desativar[i]].checked=false;i++}while(i<nindices)}}};if(i3GEO.configura.templateLegenda!="")i3GEO.php.criaLegendaHTML(retorna,idtema,i3GEO.configura.templateLegenda);else i3GEO.php.criaLegendaHTML(retorna,idtema)},atualizaLegenda:function(idtema){if(document.getElementById(idtema+"verdiv")){var node=i3GEO.arvoreDeCamadas.ARVORE.getNodeByProperty("idlegenda",idtema);if(node){i3GEO.arvoreDeCamadas.ARVORE.removeChildren(node);this.mostraLegenda(node);if($i("janelaLegenda"+idtema+"_corpo")){i3GEO.tema.mostralegendajanela(idtema,"","abrejanela")}}}},inverteStatusClasse:function(leg){var temp=function(){i3GEO.atualiza("")};i3GEO.php.inverteStatusClasse(temp,leg.name,leg.value)},montaTextoTema:function(tema){var ck="";if(tema.status==2){var ck=' CHECKED '}var html="";html+="<p id='arrastar_"+tema.name+"' style='text-align:left;font-size:11px;' ><input class=inputsb style='cursor:pointer;' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t3")+"','ligadesliga')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" type='checkbox' name=\"layer\" value='"+tema.name+"' "+ck;if(i3GEO.arvoreDeCamadas.ATIVATEMA!="")html+="onclick=\""+i3GEO.arvoreDeCamadas.ATIVATEMA+"\"";else html+="onclick='i3GEO.util.criaBotaoAplicar(\"i3GEO.arvoreDeCamadas.aplicaTemas\",\""+$trad("p14")+"\",\"i3geoBotaoAplicarCamadas\",this)'";html+=" />";if(tema.contextoescala=="sim"){html+="&nbsp;<img src="+i3GEO.util.$im("contextoescala.png")+" title='"+$trad("t36")+"' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t36")+"','')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>"}if(tema.sel=="sim"){html+="&nbsp;<img src="+i3GEO.util.$im("estasel.png")+" title='"+$trad("t4")+"' onclick='i3GEO.tema.limpasel(\""+tema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t5")+"','limpasel')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>";html+="&nbsp;<img src="+i3GEO.util.$im("zoomsel.gif")+" title='"+$trad("t4a")+"' onclick='i3GEO.tema.zoomsel(\""+tema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t5")+"','zoomsel')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>"}if((tema.download=="sim")||(tema.download=="SIM")){html+="&nbsp;<img src="+i3GEO.util.$im("down1.gif")+" title='download' onclick='i3GEO.tema.dialogo.download(\""+tema.name+"\")' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t6")+"','download')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" \>"}if(i3GEO.arvoreDeCamadas.AGUARDALEGENDA)html+="&nbsp;<span style='cursor:move' onclick=\"i3GEO.tema.mostralegendajanela('"+tema.name+"','"+tema.tema+"','abrejanela');\" onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t7a")+"','');i3GEO.tema.mostralegendajanela('"+tema.name+"','"+tema.tema+"','ativatimer');\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('');i3GEO.tema.mostralegendajanela('"+tema.name+"','','desativatimer');\" >"+tema.tema+"</span>";else html+="&nbsp;<span style='cursor:move' onmouseover=\"javascript:i3GEO.ajuda.mostraJanela('"+$trad("t7")+"','')\" onmouseout=\"javascript:i3GEO.ajuda.mostraJanela('')\" >"+tema.tema+"</span>";html+="</p>";return(html)},atualizaFarol:function(mapscale){var farol="maisamarelo.png";var l=i3GEO.arvoreDeCamadas.CAMADAS.length-1;if(l>=0){do{var ltema=i3GEO.arvoreDeCamadas.CAMADAS[l];var escala=ltema.escala;if(escala*1<mapscale*1){var farol="maisverde.png"}if(escala*1>mapscale*1){var farol="maisvermelho.png"}if(escala*1==0){var farol="maisamarelo.png"}if($i("farol"+ltema.name)){$i("farol"+ltema.name).src=g_locaplic+"/imagens/"+farol}}while(l--)}},aplicaTemas:function(){var t=i3GEO.arvoreDeCamadas.listaLigadosDesligados();var temp=function(){i3GEO.atualiza();i3GEO.janela.fechaAguarde("redesenha")};clearTimeout(tempoBotaoAplicar);tempoBotaoAplicar="";i3GEO.janela.abreAguarde("redesenha",$trad("o1"));i3GEO.php.ligatemas(temp,t[1].toString(),t[0].toString())},listaLigadosDesligados:function(){var nos=i3GEO.arvoreDeCamadas.ARVORE.getNodesByProperty("tipo","tema");var ligados=new Array();var desligados=new Array();var todos=new Array();var n=nos.length;var i=0;do{try{var no=nos[i].getEl();var cs=no.getElementsByTagName("input");var csn=cs.length;for(j=0;j<csn;j++){var c=cs[j];if(c.name=="layer"){if(c.checked==true){ligados.push(c.value)}else{desligados.push(c.value)}todos.push(c.value)}}i++}catch(e){i++}}while(i<n)var lista=new Array(ligados,desligados,todos);return(lista)},comparaTemas:function(novo,atual){try{var novon=novo.length;if(novon!=atual.length){return(false)}for(i=0;i<novon;i++){if(novo[i].name!=atual[i].name){return(false)}if(novo[i].tema!=atual[i].tema){return(false)}if(novo[i].sel!=atual[i].sel){return(false)}}return(true)}catch(e){return true}},pegaTema:function pegatema(idtema){var c=i3GEO.arvoreDeCamadas.CAMADAS.length;for(i=0;i<c;i++){if(i3GEO.arvoreDeCamadas.CAMADAS[i].name==idtema){var ltema=i3GEO.arvoreDeCamadas.CAMADAS[i];return(ltema)}}}};i3GEO.arvoreDeCamadas.IDHTML="listaTemas";
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.navega={FATORZOOM:2,zoomin:function(locaplic,sid){if(arguments.length>0){i3GEO.configura.locaplic=locaplic;i3GEO.configura.sid=sid}i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.aproxima(i3GEO.atualiza,i3GEO.navega.FATORZOOM)},zoomout:function(locaplic,sid){if(arguments.length>0){i3GEO.configura.locaplic=locaplic;i3GEO.configura.sid=sid}i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.afasta(i3GEO.atualiza,i3GEO.navega.FATORZOOM)},zoomponto:function(locaplic,sid,x,y){if(locaplic!=""){i3GEO.configura.locaplic=locaplic}if(sid!=""){i3GEO.configura.sid=sid}i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.zoomponto(i3GEO.atualiza,x,y)},zoompontoIMG:function(locaplic,sid,x,y){if(locaplic!=""){i3GEO.configura.locaplic=locaplic}if(sid!=""){i3GEO.configura.sid=sid}i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.pan(i3GEO.atualiza,"","",x,y)},xy2xy:function(locaplic,sid,xi,yi,xf,yf,ext,tipoimagem){if(locaplic!=""){i3GEO.configura.locaplic=locaplic}if(sid!=""){i3GEO.configura.sid=sid}var disty=(yi*-1)+yf;var distx=(xi*-1)+xf;var ex=ext.split(" ");var novoxi=(ex[0]*1)-distx;var novoxf=(ex[2]*1)-distx;var novoyi=(ex[1]*1)-disty;var novoyf=(ex[3]*1)-disty;if((distx==0)&&(disty==0)){return false}else{var nex=novoxi+" "+novoyi+" "+novoxf+" "+novoyf;i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,tipoimagem,nex);return true}},localizaIP:function(locaplic,sid,funcao){if(locaplic!=""){i3GEO.configura.locaplic=locaplic}if(sid!=""){i3GEO.configura.sid=sid}i3GEO.php.localizaIP(funcao)},zoomIP:function(locaplic,sid){try{if(arguments.length>0){i3GEO.configura.locaplic=locaplic;i3GEO.configura.sid=sid}var mostraIP=function(retorno){if(retorno.data.latitude!=null){i3GEO.navega.zoomponto(locaplic,sid,retorno.data.longitude,retorno.data.latitude)}else{alert("Nao foi possivel identificar a localizacao.")}};i3GEO.navega.localizaIP(locaplic,sid,mostraIP)}catch(e){var e=""}},zoomExt:function(locaplic,sid,tipoimagem,ext){if(locaplic!=""){i3GEO.configura.locaplic=locaplic}if(sid!=""){i3GEO.configura.sid=sid}if(tipoimagem==""){var tipoimagem="nenhum"}i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.mudaext(i3GEO.atualiza,tipoimagem,ext)},aplicaEscala:function(locaplic,sid,escala){if(i3GEO.interface.ATUAL=="padrao"){if(locaplic!=""){i3GEO.configura.locaplic=locaplic}if(sid!=""){i3GEO.configura.sid=sid}i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.mudaescala(i3GEO.atualiza,escala)}if(i3GEO.interface.ATUAL=="googlemaps"){var nzoom=i3GEO.interface.googlemaps.escala2nzoom(escala);i3GeoMap.setZoom(nzoom)}if(i3GEO.interface.ATUAL=="openlayers"){i3geoOL.zoomToScale(escala,true)}},panFixo:function(locaplic,sid,direcao,w,h,escala){if(locaplic!=""){i3GEO.configura.locaplic=locaplic}if(sid!=""){i3GEO.configura.sid=sid}if(w==""){var w=i3GEO.parametros.w}if(h==""){var h=i3GEO.parametros.h}if(escala==""){var escala=i3GEO.parametros.mapscale}if(direcao=="norte"){var y=h/6;var x=w/2}if(direcao=="sul"){var y=h-(h/6);var x=w/2}if(direcao=="leste"){var x=w-(w/6);var y=h/2}if(direcao=="oeste"){var x=w/6;var y=h/2}if(direcao=="nordeste"){var y=h/6;var x=w-(w/6)}if(direcao=="sudeste"){var y=h-(h/6);var x=w-(w/6)}if(direcao=="noroeste"){var y=h/6;var x=w/6}if(direcao=="sudoeste"){var y=h-(h/6);var x=w/6}i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.pan(i3GEO.atualiza,escala,"",x,y)},mostraRosaDosVentos:function(){try{if(i3GEO.configura.mostraRosaDosVentos=="nao"){return}if(g_tipoacao=="area"){return}}catch(e){};if(objposicaocursor.imgx<10||objposicaocursor.imgy<10||objposicaocursor.imgy>(i3GEO.parametros.h-10)){return}if(!$i("i3geo_rosa")){var novoel=document.createElement("div");novoel.id="i3geo_rosa";novoel.style.position="absolute";novoel.style.zIndex=5000;if(navn){novoel.style.opacity=".7"}else{novoel.style.filter="alpha(opacity=70)"}document.body.appendChild(novoel)}var setas="<table id='rosaV' >";setas+="<tr onclick=\"javascript:i3GEO.configura.mostraRosaDosVentos='nao'\"><td></td><td></td><td style=cursor:pointer >x</td></tr><tr>";setas+="<td><img class='rosanoroeste' title='noroeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','noroeste','"+i3GEO.parametros.w+"','"+i3GEO.parametros.h+"','"+i3GEO.parametros.mapscale+"')\" /></td>";setas+="<td><img class='rosanorte' title='norte' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','norte','"+i3GEO.parametros.w+"','"+i3GEO.parametros.h+"','"+i3GEO.parametros.mapscale+"')\" /></td>";setas+="<td><img class='rosanordeste' title='nordeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','nordeste','"+i3GEO.parametros.w+"','"+i3GEO.parametros.h+"','"+i3GEO.parametros.mapscale+"')\" /></td></tr>";setas+="<tr><td><img class='rosaoeste' title='oeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','oeste','"+i3GEO.parametros.w+"','"+i3GEO.parametros.h+"','"+i3GEO.parametros.mapscale+"')\" /></td>";setas+="<td><table><tr>";setas+="<td><img class='rosamais' title='aproxima' onclick=\"i3GEO.navega.zoomin('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"')\" src='"+$im("branco.gif")+"' </td>";setas+="<td><img class='rosamenos' title='afasta' onclick=\"i3GEO.navega.zoomout('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"')\" src='"+$im("branco.gif")+"' </td>";setas+="</tr></table></td>";setas+="<td><img class='rosaleste' title='leste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','leste','"+i3GEO.parametros.w+"','"+i3GEO.parametros.h+"','"+i3GEO.parametros.mapscale+"')\" /></td></tr>";setas+="<tr><td><img class='rosasudoeste' title='sudoeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','sudoeste','"+i3GEO.parametros.w+"','"+i3GEO.parametros.h+"','"+i3GEO.parametros.mapscale+"')\" /></td>";setas+="<td><img class='rosasul' title='sul' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','sul','"+i3GEO.parametros.w+"','"+i3GEO.parametros.h+"','"+i3GEO.parametros.mapscale+"')\" /></td>";setas+="<td><img class='rosasudeste' title='sudeste' src='"+$im("branco.gif")+"' onclick=\"i3GEO.navega.panFixo('"+i3GEO.configura.locaplic+"','"+i3GEO.configura.sid+"','sudeste','"+i3GEO.parametros.w+"','"+i3GEO.parametros.h+"','"+i3GEO.parametros.mapscale+"')\" /></td></tr></table>";var i=$i("i3geo_rosa");i.innerHTML=setas;i.style.top=objposicaocursor.telay-27;i.style.left=objposicaocursor.telax-27;i.style.display="block";var escondeRosa=function(){var i=$i("i3geo_rosa");i.style.display="none";YAHOO.util.Event.removeListener(escondeRosa)};if($i("img"))YAHOO.util.Event.addListener($i("img"),"mousemove",escondeRosa);i3GEO.ajuda.mostraJanela('Clique nas pontas da rosa para navegar no mapa. Clique em x para parar de mostrar essa opção.')},autoRedesenho:{INTERVALO:0,ID:"tempoRedesenho",ativa:function(id){if(arguments.length==0){var id="tempoRedesenho"}i3GEO.navega.autoRedesenho.ID=id;if(($i(id))&&i3GEO.navega.autoRedesenho.INTERVALO>0){$i(id).style.display="block"}if(i3GEO.navega.autoRedesenho.INTERVALO>0){i3GEO.navega.tempoRedesenho=setTimeout('i3GEO.navega.autoRedesenho.redesenha()',i3GEO.navega.autoRedesenho.INTERVALO)}if(($i(id))&&(i3GEO.navega.autoRedesenho.INTERVALO>0)){$i(id).innerHTML=i3GEO.navega.autoRedesenho.INTERVALO/1000;i3GEO.navega.contaTempoRedesenho=setTimeout('i3GEO.navega.autoRedesenho.contagem()',1000)}},desativa:function(){i3GEO.navega.autoRedesenho.INTERVALO=0;clearTimeout(i3GEO.navega.tempoRedesenho);clearTimeout(i3GEO.navega.contaTempoRedesenho);i3GEO.navega.tempoRedesenho="";i3GEO.navega.contaTempoRedesenho="";if($i(i3GEO.navega.autoRedesenho.ID)){$i(i3GEO.navega.autoRedesenho.ID).style.display="none"}},redesenha:function(){clearTimeout(i3GEO.navega.tempoRedesenho);clearTimeout(i3GEO.navega.contaTempoRedesenho);i3GEO.atualiza("");i3GEO.navega.autoRedesenho.ativa(i3GEO.navega.autoRedesenho.ID)},contagem:function(){if($i(i3GEO.navega.autoRedesenho.ID)){$i(i3GEO.navega.autoRedesenho.ID).innerHTML=parseInt($i(i3GEO.navega.autoRedesenho.ID).innerHTML)-1}i3GEO.navega.contaTempoRedesenho=setTimeout('i3GEO.navega.autoRedesenho.contagem()',1000)}},zoomBox:{inicia:function(){if(g_tipoacao!='zoomli'){return}if(!$i("i3geoboxZoom"))i3GEO.navega.zoomBox.criaBox();var i=$i("i3geoboxZoom").style;i.width=0;i.height=0;i.visibility="visible";i.display="block";i.left=objposicaocursor.telax+g_postpx;i.top=objposicaocursor.telay+g_postpx;boxxini=objposicaocursor.telax;boxyini=objposicaocursor.telay;tamanhox=0;tamanhoy=0;if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.navega.zoomBox.desloca()")<0){i3GEO.eventos.MOUSEMOVE.push("i3GEO.navega.zoomBox.desloca()")}if(i3GEO.eventos.MOUSEUP.toString().search("i3GEO.navega.zoomBox.termina()")<0){i3GEO.eventos.MOUSEUP.push("i3GEO.navega.zoomBox.termina()")}},criaBox:function(){if(!$i("i3geoboxZoom")){var novoel=document.createElement("div");novoel.style.width="0px";novoel.style.height="0px";novoel.id="i3geoboxZoom";novoel.style.display="none";novoel.style.fontSize="0px";if(navn){novoel.style.opacity=.25}novoel.style.backgroundColor="gray";novoel.style.position="absolute";novoel.style.border="2px solid #ff0000";if(navm){novoel.style.filter="alpha(opacity=25)"}novoel.onmousemove=function(){var b=$i("i3geoboxZoom").style;var wb=parseInt(b.width);var hb=parseInt(b.height);if(navm){if(wb>2){b.width=wb-2}if(hb>2){b.height=hb-2}}else{b.width=wb-2+"px";b.height=hb-2+"px"}};novoel.onmouseup=function(){i3GEO.navega.zoomBox.termina()};document.body.appendChild(novoel);if(i3GEO.interface.ATUAL=="padrao"){$i("img").title="";i3GEO.util.mudaCursor(i3GEO.configura.cursores,"zoom","i3geoboxZoom",i3GEO.configura.locaplic);var temp="zoom";if(i3GEO.interface.ATIVAMENUCONTEXTO)var temp="zoom_contexto";i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,"img",i3GEO.configura.locaplic)}}},desloca:function(){if(g_tipoacao!='zoomli'){return}var bxs=$i("i3geoboxZoom").style;if(bxs.display!="block"){return}ppx=objposicaocursor.telax;py=objposicaocursor.telay;if(navm){if((ppx>boxxini)&&((ppx-boxxini-2)>0)){bxs.width=ppx-boxxini-2}if((py>boxyini)&&((py-boxyini-2)>0)){bxs.height=py-boxyini-2}if(ppx<boxxini){bxs.left=ppx;bxs.width=boxxini-ppx+2}if(py<boxyini){bxs.top=py;bxs.height=boxyini-py+2}}else{if(ppx>boxxini){bxs.width=ppx-boxxini+"px"}if(py>boxyini){bxs.height=py-boxyini+"px"}if(ppx<boxxini){bxs.left=ppx+"px";bxs.width=boxxini-ppx+"px"}if(py<boxyini){bxs.top=py+"px";bxs.height=boxyini-py+"px"}}},termina:function(){if(g_tipoacao!='zoomli'){i3GEO.eventos.MOUSEDOWN.remove("i3GEO.navega.zoomBox.inicia()");i3GEO.eventos.MOUSEUP.remove("i3GEO.navega.zoomBox.termina()");return}try{var valor=i3GEO.calculo.rect2ext("i3geoboxZoom",i3GEO.parametros.mapexten,i3GEO.parametros.pixelsize);var v=valor[0];var x1=valor[1];var y1=valor[2];var x2=valor[3];var y2=valor[4];var limpa=function(){var bxs=$i("i3geoboxZoom").style;bxs.display="none";bxs.visibility="hidden";bxs.width=0;bxs.height=0};if((x1==x2)||(y1==y2)){limpa.call();return}i3GEO.parametros.mapexten=v;limpa.call();i3GEO.eventos.MOUSEMOVE.remove("i3GEO.navega.zoomBox.desloca()");i3GEO.eventos.MOUSEUP.remove("i3GEO.navega.zoomBox.termina()");i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,i3GEO.configura.tipoimagem,v)}catch(e){limpa.call();return}}},entorno:{ativaDesativa:function(){if(i3GEO.parametros.mapfile==""){alert("Essa opcao nao pode ser ativada. Consulte o administrador do sistema. Mapfile nao esta exposto.");return}if(i3GEO.configura.entorno=="sim"){var letras=["L","O","N","S"];for(var l=0;l<4;l++){if($i("img"+letras[l])){$i("img"+letras[l]).style.display="none";$i("img"+letras[l]).src=""}}$left("img",0);$top("img",0);i3GEO.configura.entorno="nao";alert("Entorno desativado");$i("img").style.visibility="visible";$i("img").style.display="block"}else{i3GEO.navega.entorno.geraURL();var letras=["L","O","N","S"];for(var l=0;l<4;l++){if($i("img"+letras[l])){$i("img"+letras[l]).style.width=i3GEO.parametros.w;$i("img"+letras[l]).style.height=i3GEO.parametros.h;$i("img"+letras[l]).style.display="block"}}i3GEO.configura.entorno="sim";i3GEO.navega.entorno.ajustaPosicao();alert("Entorno ativado. o desenho do mapa pode demorar mais.")}},geraURL:function(){var nny=(i3GEO.parametros.h/2)*-1;var nnx=i3GEO.parametros.w/2;var sy=i3GEO.parametros.h+(i3GEO.parametros.h/2);var sx=i3GEO.parametros.w/2;var lx=i3GEO.parametros.w+(i3GEO.parametros.w/2);var ly=i3GEO.parametros.h/2;var ox=(parseInt(i3GEO.parametros.w/2))*-1;var oy=i3GEO.parametros.h/2;var u=window.location.protocol+"\/\/"+window.location.host+i3GEO.parametros.cgi+"?map="+i3GEO.parametros.mapfile;u+="&mode=map&imgext="+i3GEO.parametros.mapexten+"&mapsize="+nnx+" "+oy;var sul=u+"&imgxy="+sx/2+" "+sy/2;var norte=u+"&imgxy="+nnx/2+" "+nny/2;var leste=u+"&imgxy="+lx/2+" "+ly/2;var oeste=u+"&imgxy="+ox/2+" "+oy/2;$i("imgS").src=sul;$i("imgN").src=norte;$i("imgL").src=leste;$i("imgO").src=oeste},ajustaPosicao:function(){$left("img",i3GEO.parametros.w*-1);$left("imgS",i3GEO.parametros.w*-1);$left("imgL",i3GEO.parametros.w);$left("imgO",i3GEO.parametros.w*-3);$left("imgN",i3GEO.parametros.w*-1);$top("img",i3GEO.parametros.h*-1);$top("imgS",i3GEO.parametros.h*-1);$top("imgL",i3GEO.parametros.h*-1);$top("imgN",i3GEO.parametros.h*-1);$top("imgO",i3GEO.parametros.h*-1)}},lente:{POSICAOX:0,POSICAOY:0,ESTAATIVA:"nao",inicia:function(){if(!$i("lente")){var novoel=document.createElement("div");novoel.id='lente';novoel.style.clip='rect(0px,0px,0px,0px)';var novoimg=document.createElement("img");novoimg.src="";novoimg.id='lenteimg';novoel.appendChild(novoimg);document.body.appendChild(novoel);var novoel=document.createElement("div");novoel.id='boxlente';document.body.appendChild(novoel)}with($i('boxlente').style){borderWidth='1'+g_postpx;borderColor="red";display="block"}$i("lente").style.display="block";i3GEO.navega.lente.ESTAATIVA="sim";i3GEO.navega.lente.atualiza();if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.navega.lente.atualiza()")<0){i3GEO.eventos.NAVEGAMAPA.push("i3GEO.navega.lente.atualiza()")}if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.navega.lente.movimenta()")<0){i3GEO.eventos.MOUSEMOVE.push("i3GEO.navega.lente.movimenta()")}},atualiza:function(){var temp=function(retorno){try{var retorno=retorno.data;if(retorno=="erro"){alert("A lente nao pode ser criada");return}var volta=retorno.split(",");var nimg=volta[2];var olente=$i('lente');var oboxlente=$i('boxlente');var olenteimg=$i('lenteimg');olenteimg.src=nimg;olenteimg.style.width=volta[0]*1.5;olenteimg.style.height=volta[1]*1.5;olente.style.zIndex=1000;olenteimg.style.zIndex=1000;oboxlente.style.zIndex=1000;var pos=i3GEO.util.pegaPosicaoObjeto($i("corpoMapa"));eval("olente.style."+g_tipoleft+" = pos[0] + i3GEO.navega.lente.POSICAOX + g_postpx");eval("olente.style."+g_tipotop+" = pos[1] + i3GEO.navega.lente.POSICAOY + g_postpx");eval("oboxlente.style."+g_tipoleft+" = pos[0] + i3GEO.navega.lente.POSICAOX + g_postpx");eval("oboxlente.style."+g_tipotop+" = pos[1] + i3GEO.navega.lente.POSICAOY + g_postpx");oboxlente.style.display='block';oboxlente.style.visibility='visible';olente.style.display='block';olente.style.visibility='visible';i3GEO.janela.fechaAguarde("ajaxabrelente")}catch(e){i3GEO.janela.fechaAguarde()}};if(i3GEO.navega.lente.ESTAATIVA=="sim"){i3GEO.janela.abreAguarde("ajaxabrelente",$trad("o1"));i3GEO.php.aplicaResolucao(temp,1.5)}else{i3GEO.navega.lente.desativa()}},desativa:function(){$i("lente").style.display="none";$i("boxlente").style.display="none";$i('boxlente').style.borderWidth=0;i3GEO.navega.lente.ESTAATIVA="nao";i3GEO.eventos.MOUSEMOVE.remove("i3GEO.navega.lente.movimenta()");i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.navega.lente.atualiza()")},movimenta:function(){try{if(i3GEO.navega.lente.ESTAATIVA="sim"){if($i("lente").style.visibility=="visible")var pos=i3GEO.util.pegaPosicaoObjeto($i("img"));var esq=(objposicaocursor.telax-pos[0])*2.25;var topo=(objposicaocursor.telay-pos[1])*2.25;var clipt="rect("+(topo-40)+" "+(esq+40)+" "+(topo+40)+" "+(esq-40)+")";var i=$i("lente").style;i.clip=clipt;eval("i."+g_tipotop+"= (pos[1] - (topo - 40)) + g_postpx");eval("i."+g_tipoleft+"= (pos[0] - (esq - 40)) + g_postpx")}}catch(e){}}},destacaTema:{TAMANHO:75,ESTAATIVO:"nao",TEMA:"",inicia:function(tema){if(!$i("img_d")){var novoel=document.createElement("div");novoel.id="div_d";novoel.style.zIndex=5000;document.body.appendChild(novoel);$i("div_d").innerHTML="<input style='position:relative;top:0px;left:0px'' type=image src='' id='img_d' />";$i("div_d").style.left=parseInt($i("corpoMapa").style.left);$i("div_d").style.top=parseInt($i("corpoMapa").style.top);$i("img_d").style.left=0;$i("img_d").style.top=0;$i("img_d").style.width=i3GEO.parametros.w;$i("img_d").style.height=i3GEO.parametros.h;$i("div_d").style.clip='rect(0 75 75 0)';var novoeli=document.createElement("div");novoeli.id="div_di";novoel.appendChild(novoeli);$i("div_di").innerHTML="<p style='position:absolute;top:0px;left:0px'>+-</p>"}i3GEO.navega.destacaTema.TEMA=tema;i3GEO.navega.destacaTema.ESTAATIVO="sim";i3GEO.navega.destacaTema.atualiza();var janela=i3GEO.janela.cria(150,0,"","center","center","Parar destaque&nbsp;&nbsp;","ativadesativaDestaque");YAHOO.util.Event.addListener(janela[0].close,"click",i3GEO.navega.destacaTema.desativa);if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.navega.destacaTema.atualiza()")<0){i3GEO.eventos.NAVEGAMAPA.push("i3GEO.navega.destacaTema.atualiza()")}if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.navega.destacaTema.movimenta()")<0){i3GEO.eventos.MOUSEMOVE.push("i3GEO.navega.destacaTema.movimenta()")}},atualiza:function(){if(i3GEO.navega.destacaTema.ESTAATIVO=="nao"){return}var temp=function(retorno){var retorno=retorno.data;var m=new Image();m.src=retorno;$i("div_d").innerHTML="";$i("div_d").style.display="block";var novoel=document.createElement("input");novoel.id="img_d";novoel.style.position="relative";novoel.style.top="0px";novoel.style.left="0px";novoel.type="image";novoel.src=m.src;novoel.style.display="block";$i("div_d").appendChild(novoel);i3GEO.janela.fechaAguarde("ajaxdestaca")};i3GEO.janela.abreAguarde("ajaxdestaca","Aguarde...gerando imagem");i3GEO.php.geradestaque(temp,i3GEO.navega.destacaTema.TEMA)},desativa:function(){i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.navega.destacaTema.atualiza()");i3GEO.eventos.MOUSEMOVE.push("i3GEO.navega.destacaTema.movimenta()");i3GEO.navega.destacaTema.ESTAATIVO="nao";document.body.removeChild($i("div_d"))},movimenta:function(){if(i3GEO.navega.destacaTema.ESTAATIVO=="sim")$i("div_d").style.clip='rect('+(objposicaocursor.imgy-i3GEO.navega.destacaTema.TAMANHO)+" "+(objposicaocursor.imgx-10)+" "+(objposicaocursor.imgy-10)+" "+(objposicaocursor.imgx-i3GEO.navega.destacaTema.TAMANHO)+')'}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.selecao={porxy:function(tema,tipo,tolerancia){var retorna=function(retorno){i3GEO.atualiza(retorno)};i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.selecaopt(retorna,tema,objposicaocursor.ddx+" "+objposicaocursor.ddy,tipo,tolerancia)},porbox:function(tema,tipo,box){var retorna=function(retorno){i3GEO.atualiza(retorno)};i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.php.selecaobox(retorna,tema,tipo,box)},janelaOpcoes:function(){g_tipoacao="selecao";i3GEO.temaAtivo="";var janela=i3GEO.janela.cria("430px","320px",i3GEO.configura.locaplic+'/ferramentas/selecao/index.htm',"","","Sele&ccedil;&atilde;o  <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=5&idajuda=48a' >&nbsp;&nbsp;&nbsp;</a>");if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.selecao.clique()")<0){i3GEO.eventos.MOUSECLIQUE.push("i3GEO.selecao.clique()")}if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.selecao.atualizaGrafico()")<0){i3GEO.eventos.NAVEGAMAPA.push("i3GEO.selecao.atualizaGrafico()")}var temp=function(){i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.selecao.clique()");i3GEO.eventos.NAVEGAMAPA.remove("i3GEO.selecao.atualizaGrafico()");try{i3GEO.desenho.richdraw.fecha()}catch(e){}if($i("pontosins")){document.body.removeChild($i("pontosins"))}i3GEO.barraDeBotoes.ativaBotoes()};YAHOO.util.Event.addListener(janela[0].close,"click",temp)},atualizaGrafico:function(){if(g_tipoacao=="selecao"){var doc=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument;if(doc.getElementById("guia5obj")){if(doc.getElementById("guia5obj").style.display=="block"){if(window.parent.frames["wdocai"].atualizaGrafico){window.parent.frames["wdocai"].atualizaGrafico()}}}}},clique:function(){if(g_tipoacao=="selecao"){var doc=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument;var tipo="adiciona";if(doc.getElementById("tipoOperacao")){var tipo=doc.getElementById("tipoOperacao").value}if(i3GEO.temaAtivo==""){alert("Nenhum tema ativo");return}var tolerancia=doc.getElementById("toleranciapt").value;if((tipo!="limpa")&&(tipo!="inverte")){i3GEO.selecao.porxy(i3GEO.temaAtivo,tipo,tolerancia)}}},box:{inicia:function(){if(g_tipoacao!='selecaobox'){return}i3GEO.selecao.box.criaBox();adicionaxyBox=i3GEO.util.pegaPosicaoObjeto($i(i3GEO.interface.IDCORPO));var i=$i("i3geoboxSel").style;i.width=0;i.height=0;i.visibility="visible";i.display="block";i.left=objposicaocursor.imgx+adicionaxyBox[0]+g_postpx;i.top=objposicaocursor.imgy+adicionaxyBox[1]+g_postpx;boxxini=objposicaocursor.imgx+adicionaxyBox[0];boxyini=objposicaocursor.imgy+adicionaxyBox[1];tamanhox=0;tamanhoy=0;if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.selecao.box.desloca()")<0){i3GEO.eventos.MOUSEMOVE.push("i3GEO.selecao.box.desloca()")}if(i3GEO.eventos.MOUSEUP.toString().search("i3GEO.selecao.box.termina()")<0){i3GEO.eventos.MOUSEUP.push("i3GEO.selecao.box.termina()")}},criaBox:function(){try{i3GEO.desenho.richdraw.fecha()}catch(e){}i3GEO.desenho.criaContainerRichdraw();i3GEO.desenho.richdraw.lineColor="red";i3GEO.desenho.richdraw.lineWidth="2px";if(!$i("i3geoboxSel")){var novoel=document.createElement("div");novoel.style.width="0px";novoel.style.height="0px";novoel.id="i3geoboxSel";novoel.style.display="none";novoel.style.fontSize="0px";if(navn){novoel.style.opacity=.25}novoel.style.backgroundColor="yellow";novoel.style.position="absolute";novoel.style.border="2px solid #ff0000";if(navm){novoel.style.filter="alpha(opacity=25)"}novoel.onmousemove=function(){var b=$i("i3geoboxSel").style;var wb=parseInt(b.width);var hb=parseInt(b.height);if(navm){if(wb>2){b.width=wb-2}if(hb>2){b.height=hb-2}}else{b.width=wb-2+"px";b.height=hb-2+"px"}};novoel.onmouseup=function(){i3GEO.selecao.box.termina()};document.body.appendChild(novoel)}i3GEO.util.mudaCursor(i3GEO.configura.cursores,"zoom","i3geoboxSel",i3GEO.configura.locaplic);if($i("img")){$i("img").title="";var temp="zoom";if(i3GEO.interface.ATIVAMENUCONTEXTO)var temp="zoom_contexto";i3GEO.util.mudaCursor(i3GEO.configura.cursores,temp,"img",i3GEO.configura.locaplic)}},desloca:function(){if(g_tipoacao!='selecaobox'){return}var bxs=$i("i3geoboxSel").style;if(bxs.display!="block"){return}ppx=objposicaocursor.imgx+adicionaxyBox[0];py=objposicaocursor.imgy+adicionaxyBox[1];if(navm){if((ppx>boxxini)&&((ppx-boxxini-2)>0)){bxs.width=ppx-boxxini-2}if((py>boxyini)&&((py-boxyini-2)>0)){bxs.height=py-boxyini-2}if(ppx<boxxini){bxs.left=ppx;bxs.width=boxxini-ppx+2}if(py<boxyini){bxs.top=py;bxs.height=boxyini-py+2}}else{if(ppx>boxxini){bxs.width=ppx-boxxini+"px"}if(py>boxyini){bxs.height=py-boxyini+"px"}if(ppx<boxxini){bxs.left=ppx+"px";bxs.width=boxxini-ppx+"px"}if(py<boxyini){bxs.top=py+"px";bxs.height=boxyini-py+"px"}}},termina:function(){if(g_tipoacao!='selecaobox'){return}try{var valor=i3GEO.calculo.rect2ext("i3geoboxSel",i3GEO.parametros.mapexten,i3GEO.parametros.pixelsize);var v=valor[0];var x1=valor[1];var y1=valor[2];var x2=valor[3];var y2=valor[4];var limpa=function(){var bxs=$i("i3geoboxSel").style;bxs.display="none";bxs.visibility="hidden";bxs.width=0;bxs.height=0};if((x1==x2)||(y1==y2)){limpa.call();return}i3GEO.parametros.mapexten=v;limpa.call();i3GEO.eventos.MOUSEMOVE.remove("i3GEO.selecao.box.desloca()");i3GEO.eventos.MOUSEUP.remove("i3GEO.selecao.box.termina()");var doc=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument;var tipo="adiciona";if(doc.getElementById("tipoOperacao")){var tipo=doc.getElementById("tipoOperacao").value}if((tipo!="limpa")&&(tipo!="inverte")){i3GEO.selecao.porbox(i3GEO.temaAtivo,tipo,v)}}catch(e){limpa.call();return}}},poligono:{inicia:function(){try{i3GEO.desenho.richdraw.fecha()}catch(e){}i3GEO.util.insereMarca.limpa();g_tipoacao="selecaopoli";alert("Clique no mapa para desenhar o polígono.");i3GEO.desenho.criaContainerRichdraw();i3GEO.desenho.richdraw.lineColor="red";i3GEO.desenho.richdraw.lineWidth="2px";i3GEO.eventos.MOUSECLIQUE.remove("i3GEO.selecao.clique()");if(i3GEO.eventos.MOUSEMOVE.toString().search("i3GEO.selecao.poligono.move()")<0){i3GEO.eventos.MOUSEMOVE.push("i3GEO.selecao.poligono.move()")}if(i3GEO.eventos.MOUSECLIQUE.toString().search("i3GEO.selecao.poligono.clique()")<0){i3GEO.eventos.MOUSECLIQUE.push("i3GEO.selecao.poligono.clique()")}},move:function(){if(g_tipoacao=="selecaopoli"){var n=pontosdistobj.xpt.length;if(n>0){i3GEO.desenho.aplica("resizePoligono",pontosdistobj.linhas[n-1],n)}}},clique:function(){if(g_tipoacao!="selecaopoli"){return}var n=pontosdistobj.xpt.length;pontosdistobj.xpt[n]=objposicaocursor.ddx;pontosdistobj.ypt[n]=objposicaocursor.ddy;pontosdistobj.xtela[n]=objposicaocursor.telax;pontosdistobj.ytela[n]=objposicaocursor.telay;pontosdistobj.ximg[n]=objposicaocursor.imgx;pontosdistobj.yimg[n]=objposicaocursor.imgy;pontosdistobj.dist[n]=0;try{if(navn){pontosdistobj.linhas[n]=i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,(pontosdistobj.ximg[n]-1),(pontosdistobj.yimg[n]-1),(pontosdistobj.ximg[n]-1),(pontosdistobj.yimg[n]-1))}else{pontosdistobj.linhas[n]=i3GEO.desenho.richdraw.renderer.create(i3GEO.desenho.richdraw.mode,i3GEO.desenho.richdraw.fillColor,i3GEO.desenho.richdraw.lineColor,i3GEO.desenho.richdraw.lineWidth,(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n],(pontosdistobj.ximg[n])-(i3GEO.parametros.w/2),pontosdistobj.yimg[n])}}catch(e){window.status=n+" erro ao desenhar a linha base "+e.message}if(n>0){var d=parseInt(i3GEO.calculo.distancia(pontosdistobj.xpt[n-1],pontosdistobj.ypt[n-1],objposicaocursor.ddx,objposicaocursor.ddy));pontosdistobj.dist[n]=d+pontosdistobj.dist[n-1]}i3GEO.util.insereMarca.cria(objposicaocursor.imgx,objposicaocursor.imgy,i3GEO.selecao.poligono.termina,"divGeometriasTemp")},termina:function(){var doc=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument;var pontos=pontosdistobj;i3GEO.desenho.richdraw.fecha();var n=pontos.xpt.length;i3GEO.temaAtivo=doc.getElementById("comboTemas").value;var xs=pontos.xpt.toString(",");var ys=pontos.ypt.toString(",");var retorna=function(){i3GEO.janela.fechaAguarde("i3GEO.atualiza",$trad("o1"));i3GEO.atualiza("")};i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));var p=i3GEO.configura.locaplic+"/classesphp/mapa_controle.php?g_sid="+i3GEO.configura.sid+"&funcao=selecaoPoli";var cp=new cpaint();cp.set_transfer_mode('POST');cp.set_response_type("JSON");cp.call(p,"selecaoPoli",retorna,xs,ys,doc.getElementById("comboTemas").value,doc.getElementById("tipoOperacao").value)}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}objposicaocursor={ddx:"",ddy:"",dmsx:"",dmsy:"",telax:"",telay:"",imgx:"",imgy:"",refx:"",refy:""};i3GEO.eventos={NAVEGAMAPA:new Array("atualizaEscalaNumerica()"),MOUSEPARADO:new Array("i3GEO.navega.mostraRosaDosVentos()"),MOUSEMOVE:new Array(),MOUSEDOWN:new Array(),MOUSEUP:new Array(),MOUSECLIQUE:new Array("i3GEO.eventos.cliqueCapturaPt()"),TIMERPARADO:"",mouseParado:function(){try{clearTimeout(i3GEO.eventos.TIMERPARADO)}catch(e){i3GEO.eventos.TIMERPARADO=""}try{if(objposicaocursor.imgy==""){objposicaocursor.imgy=1;objposicaocursor.imgx=1}if(i3GEO.eventos.MOUSEPARADO.length>0&&objposicaocursor.imgy>0&&objposicaocursor.imgx>0){var f=i3GEO.eventos.MOUSEPARADO.length-1;if(f>=0){do{if(objposicaocursor.imgx>0){eval(i3GEO.eventos.MOUSEPARADO[f])}}while(f--)}}}catch(e){}},navegaMapa:function(){if(i3GEO.eventos.NAVEGAMAPA.length>0){var f=i3GEO.eventos.NAVEGAMAPA.length-1;if(f>=0){do{var temp=i3GEO.eventos.NAVEGAMAPA[f].replace("()","");if(eval('typeof '+temp)=='function'){eval(i3GEO.eventos.NAVEGAMAPA[f])}}while(f--)}}},mousemoveMapa:function(){if(i3GEO.eventos.MOUSEMOVE.length>0){var f=i3GEO.eventos.MOUSEMOVE.length-1;if(f>=0){do{var temp=i3GEO.eventos.MOUSEMOVE[f].replace("()","");if(eval('typeof '+temp)=='function'){eval(i3GEO.eventos.MOUSEMOVE[f])}}while(f--)}}},mousedownMapa:function(){if(i3GEO.eventos.MOUSEDOWN.length>0){var f=i3GEO.eventos.MOUSEDOWN.length-1;if(f>=0){do{var temp=i3GEO.eventos.MOUSEDOWN[f].replace("()","");if(eval('typeof '+temp)=='function'){eval(i3GEO.eventos.MOUSEDOWN[f])}}while(f--)}}},mouseupMapa:function(){if(i3GEO.eventos.MOUSEUP.length>0){var f=i3GEO.eventos.MOUSEUP.length-1;if(f>=0){do{var temp=i3GEO.eventos.MOUSEUP[f].replace("()","");if(eval('typeof '+temp)=='function'){eval(i3GEO.eventos.MOUSEUP[f])}}while(f--)}}},mousecliqueMapa:function(exy){if(i3GEO.eventos.MOUSECLIQUE.length>0){var f=i3GEO.eventos.MOUSECLIQUE.length-1;if(f>=0){do{eval(i3GEO.eventos.MOUSECLIQUE[f])}while(f--)}}},posicaoMouseMapa:function(e){var container="";try{var container=e.target.parentNode.id}catch(erro){}if(container!="divGeometriasTemp"){if((i3GEO.interface.ATUAL=="googlemaps")||(i3GEO.interface.ATUAL=="openlayers")){return}}if(!e)var e=window.event;if(e.target){var targ=e.target}else if(e.srcElement)var targ=e.srcElement;if(targ.id==""&&$i(i3GEO.interface.IDMAPA)){var targ=$i(i3GEO.interface.IDMAPA)}try{if(g_panM!='undefined'&&g_panM=="sim"){var pos=i3GEO.util.pegaPosicaoObjeto(targ.parentNode)}else{var pos=i3GEO.util.pegaPosicaoObjeto(targ)}if((i3GEO.configura.entorno=="sim")&&(g_panM=="sim")){pos[0]=pos[0]-i3GEO.parametros.w;pos[1]=pos[1]-i3GEO.parametros.h}}catch(m){var pos=i3GEO.util.pegaPosicaoObjeto(targ)}var mousex=0;var mousey=0;if(e.pageX||e.pageY){var mousex=e.pageX;var mousey=e.pageY}else if(e.clientX||e.clientY){var mousex=e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft;var mousey=e.clientY+document.body.scrollTop+document.documentElement.scrollTop}var xfig=mousex-pos[0];var yfig=mousey-pos[1];var xreffig=xfig;var yreffig=yfig;var xtela=mousex;var ytela=mousey;var c=i3GEO.parametros.pixelsize;var ex=i3GEO.parametros.mapexten;try{if(targ.id=="imagemReferencia"){var c=i3GEO.parametros.celularef;var ex=i3GEO.parametros.extentref;var r=$i("i3geo_rosa");if(r)r.style.display="none"}}catch(e){i3GEO.parametros.celularef=0}var teladd=i3GEO.calculo.tela2dd(xfig,yfig,c,ex);var teladms=i3GEO.calculo.dd2dms(teladd[0],teladd[1]);objposicaocursor={ddx:teladd[0],ddy:teladd[1],dmsx:teladms[0],dmsy:teladms[1],telax:xtela,telay:ytela,imgx:xfig,imgy:yfig,refx:xreffig,refy:yreffig}},ativa:function(docMapa){docMapa.onmouseover=function(){this.onmousemove=function(exy){i3GEO.eventos.posicaoMouseMapa(exy);try{try{clearTimeout(i3GEO.eventos.TIMERPARADO)}catch(e){var a=e}i3GEO.eventos.TIMERPARADO=setTimeout('i3GEO.eventos.mouseParado()',i3GEO.configura.tempoMouseParado)}catch(e){var e=""}try{i3GEO.eventos.mousemoveMapa()}catch(e){var e=""}}};docMapa.onmouseout=function(){try{objmapaparado="parar"}catch(e){var e=""}};docMapa.onmousedown=function(exy){try{i3GEO.eventos.posicaoMouseMapa(exy);if(navm){var k=event.button}else{var k=exy.button}if(k!=2)i3GEO.eventos.mousedownMapa()}catch(e){var e=""}};docMapa.onclick=function(exy){try{if(navm){var k=event.button}else{var k=exy.button}if(k!=2)i3GEO.eventos.mousecliqueMapa()}catch(e){var e=""}};docMapa.onmouseup=function(exy){try{if(navm){var k=event.button}else{var k=exy.button}if(k!=2)i3GEO.eventos.mouseupMapa()}catch(e){var e=""}}},cliqueCapturaPt:function(){if(g_tipoacao!="capturaponto"){return}else{if($i("wdocai")){var doc=(navm)?document.frames("wdocai").document:$i("wdocai").contentDocument}try{var x=objposicaocursor.dmsx.split(" ");var y=objposicaocursor.dmsy.split(" ");if(doc.getElementById("ixg")){doc.getElementById("ixg").value=x[0]}if(doc.getElementById("ixm")){doc.getElementById("ixm").value=x[1]}if(doc.getElementById("ixs")){doc.getElementById("ixs").value=x[2]}if(doc.getElementById("iyg")){doc.getElementById("iyg").value=y[0]}if(doc.getElementById("iym")){doc.getElementById("iym").value=y[1]}if(doc.getElementById("iys")){doc.getElementById("iys").value=y[2]}}catch(m){}}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.arvoreDeTemas={OPCOESADICIONAIS:{idonde:"",incluiArvore:true,uploaddbf:true,uploadlocal:true,downloadbase:true,conectarwms:true,conectarwmst:true,conectargeorss:true,nuvemTags:true,navegacaoDir:false,incluibusca:true,kml:true,qrcode:true,mini:true,estrelas:true,refresh:true},FATORESTRELA:"1",INCLUISISTEMAS:true,INCLUIWMS:true,FILTRADOWNLOAD:false,FILTRAOGC:false,ATIVATEMA:"",IDSMENUS:new Array(),RETORNAGUIA:"",IDHTML:null,LOCAPLIC:null,SID:null,ARVORE:null,DRIVES:null,SISTEMAS:null,MENUS:null,GRUPOS:null,SUBGRUPOS:null,TEMAS:null,listaWMS:function(){var monta=function(retorno){var node=i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("idwms","raiz");var raiz=retorno.data.canais;var nraiz=raiz.length;var cor="rgb(51, 102, 102)";for(i=0;i<nraiz;i++){var html="<span style='color:"+cor+"' title='"+raiz[i].description+"'> "+raiz[i].title;if(raiz[i].nacessos>0){var quali=(raiz[i].nacessosok*100)/(raiz[i].nacessos*1);html+=" ("+quali+"%)</span>"}else html+=" (% de acessos não definido)</span>";html+="<hr>";var d={html:html,id_ws:raiz[i].id_ws,url:raiz[i].link,nivel:0};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.listaLayersWMS,1);tempNode.enableHighlight=false;if(cor=="rgb(51, 102, 102)"){var cor="rgb(47, 70, 50)"}else{var cor="rgb(51, 102, 102)"}}node.loadComplete()};i3GEO.php.listaRSSwsARRAY(monta,"WMS")},listaLayersWMS:function(node){var monta=function(retorno){try{var n=retorno.data.length}catch(m){node.loadComplete();return}var cor="rgb(51, 102, 102)";for(i=0;i<n;i++){var cabeca=retorno.data[i].nome+" - "+retorno.data[i].titulo;if(cabeca!="undefined - undefined"){var html="<span style='color:"+cor+"' >"+cabeca;var d={html:html,url:node.data.url,nivel:(node.data.nivel*1+1),id_ws:"",layer:retorno.data[i].nome};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.enableHighlight=false;if(!retorno.data[i].estilos)tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.listaLayersWMS,1);if(retorno.data[i].estilos){var ns=retorno.data[i].estilos.length;for(j=0;j<ns;j++){var html=i3GEO.arvoreDeTemas.montaTextoTemaWMS(node.data.url,retorno.data[i].nome,retorno.data[i].estilos[j].nome,retorno.data[i].estilos[j].titulo,retorno.data[i].srs.toString(),retorno.data[i].formatsinfo.toString(),retorno.data[i].version.toString(),retorno.data[i].formats.toString(),cor);var d={html:html};var tempNodeS=new YAHOO.widget.HTMLNode(d,tempNode,false,true);tempNode.isleaf=true;tempNodeS.enableHighlight=false}}if(cor=="rgb(51, 102, 102)"){var cor="rgb(47, 70, 50)"}else{var cor="rgb(51, 102, 102)"}}}node.loadComplete()};i3GEO.php.listaLayersWMS(monta,node.data.url,(node.data.nivel*1+1),node.data.id_ws,node.data.layer)},montaTextoTemaWMS:function(servico,layer,estilo,titulo,proj,formatoinfo,versao,formatoimg,cor){var html="<td style='vertical-align:top;padding-top:5px;'><span ><input style='cursor:pointer;border:solid 0 white;' ";var temp=function(){i3GEO.janela.fechaAguarde("ajaxredesenha");i3GEO.atualiza()};var adiciona="javascript:i3GEO.janela.abreAguarde(\"ajaxredesenha\",\""+$trad("o1")+"\");this.checked=false;i3GEO.php.adicionaTemaWMS("+temp+",";adiciona+="\""+servico+"\",";adiciona+="\""+layer+"\",";adiciona+="\""+estilo+"\",";adiciona+="\""+proj+"\",";adiciona+="\""+formatoimg+"\",";adiciona+="\""+versao+"\",";adiciona+="\""+titulo+"\",";adiciona+="\"\",";adiciona+="\"nao\",";adiciona+="\""+formatoinfo+"\")";html+="onclick='"+adiciona+"' ";html+=" type='radio'  /></td><td style='padding-top:4px;vertical-align:top;text-align:left;padding-left:3px;color:"+cor+";' >";html+=layer+" - "+titulo;html+="</td></span>";return(html)},listaMenus:function(g_sid,g_locaplic,funcao){var retorno=function(retorno){if(i3GEO.arvoreDeTemas.IDSMENUS.length==0)i3GEO.arvoreDeTemas.MENUS=retorno.data;else{i3GEO.arvoreDeTemas.MENUS=new Array();var c=retorno.data.length;var m=i3GEO.arvoreDeTemas.IDSMENUS.length;for(var i=0,j=c;i<j;i++){for(var k=0,jj=m;k<jj;k++){if(retorno.data[i].idmenu==i3GEO.arvoreDeTemas.IDSMENUS[k])i3GEO.arvoreDeTemas.MENUS.push(retorno.data[i])}}}if(funcao!="")eval(funcao+"(retorno)")};i3GEO.php.pegalistademenus(retorno)},listaGrupos:function(g_sid,g_locaplic,id_menu,funcao){var retorno=function(retorno){i3GEO.arvoreDeTemas.GRUPOS=retorno.data;if(funcao!="")funcao.call()};var listasgrupos="nao";if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD||i3GEO.arvoreDeTemas.FILTRAOGC)var listasgrupos="sim";i3GEO.php.pegalistadegrupos(retorno,id_menu,listasgrupos)},listaSubGrupos:function(g_sid,g_locaplic,id_menu,id_grupo,funcao){var retorno=function(retorno){i3GEO.arvoreDeTemas.SUBGRUPOS=retorno.data;if(funcao!="")funcao.call()};i3GEO.php.pegalistadeSubgrupos(retorno,id_menu,id_grupo)},listaTemas:function(g_sid,g_locaplic,id_menu,id_grupo,id_subgrupo,funcao){var retorno=function(retorno){i3GEO.arvoreDeTemas.TEMAS=retorno.data;if(funcao!="")funcao.call()};i3GEO.php.pegalistadetemas(retorno,id_menu,id_grupo,id_subgrupo)},listaSistemas:function(g_sid,g_locaplic,funcao){var retorno=function(retorno){i3GEO.arvoreDeTemas.SISTEMAS=retorno.data;if(funcao!="")funcao.call()};i3GEO.php.pegaSistemas(retorno)},listaDrives:function(g_sid,g_locaplic,funcao){var retorno=function(retorno){i3GEO.arvoreDeTemas.DRIVES=retorno.data[0];if(funcao!="")funcao.call()};i3GEO.php.listadrives(retorno)},cria:function(g_sid,g_locaplic,idhtml,funcaoTema,objOpcoes){if(this.ARVORE){return}if(idhtml!=""){i3GEO.arvoreDeTemas.IDHTML=idhtml}var nargs=arguments.length;if(nargs==4||nargs==5){i3GEO.arvoreDeTemas.ATIVATEMA=funcaoTema}if(nargs==5){i3GEO.arvoreDeTemas.OPCOESADICIONAIS=objOpcoes}i3GEO.arvoreDeTemas.LOCAPLIC=g_locaplic;i3GEO.arvoreDeTemas.SID=g_sid;if(i3GEO.arvoreDeTemas.IDHTML==""){return}this.listaMenus(g_sid,g_locaplic,"i3GEO.arvoreDeTemas.montaArvore")},atualiza:function(){this.ARVORE=null;this.cria(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,i3GEO.arvoreDeTemas.IDHTML)},montaArvore:function(){var currentIconMode;YAHOO.example.treeExample=new function(){function changeIconMode(){var newVal=parseInt(this.value);if(newVal!=currentIconMode){currentIconMode=newVal}buildTree()}function buildTree(){i3GEO.arvoreDeTemas.ARVORE=new YAHOO.widget.TreeView(i3GEO.arvoreDeTemas.IDHTML);var root=i3GEO.arvoreDeTemas.ARVORE.getRoot();var tempNode=new YAHOO.widget.TextNode('',root,false);tempNode.isLeaf=false;tempNode.enableHighlight=false}buildTree()}();var root=i3GEO.arvoreDeTemas.ARVORE.getRoot();if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluibusca==true){var insp="<br><br><table><tr>";insp+="<td><span style='font-size:12px'>&nbsp;"+$trad("a1")+" <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=31' >&nbsp;&nbsp;&nbsp;</a></span></td>";insp+="<td><input class='digitar' type='text' id='i3geo_buscatema' size='15' value=''  /></td>";insp+="<td><img  class='tic' ";if(navm){insp+="style='top:0px;'"}else insp+="style='top:4px;'";insp+=" title='"+$trad("a1")+"' src='"+i3GEO.util.$im("branco.gif")+"' onclick='i3GEO.arvoreDeTemas.buscaTema(document.getElementById(\"i3geo_buscatema\").value)' style='cursor:pointer;top:2px;position:relative;' /></td>";insp+="</tr></table>&nbsp;";var d={html:insp};var tempNode=new YAHOO.widget.HTMLNode(d,root,false,false);tempNode.enableHighlight=false}var outrasOpcoes=i3GEO.arvoreDeTemas.outrasOpcoesHTML();if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde!=""){document.getElementById(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.idonde).innerHTML=outrasOpcoes}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.incluiArvore==true){var d={html:outrasOpcoes+"&nbsp;<br>"};var tempNode=new YAHOO.widget.HTMLNode(d,root,false,true);tempNode.enableHighlight=false;tempNode.isLeaf=true;if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir==true){var retorno=function(){var conteudo="&nbsp;"+$trad("a6")+" <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=32' >&nbsp;&nbsp;&nbsp;</a>";var d={html:conteudo};var tempNode=new YAHOO.widget.HTMLNode(d,root,false,true);tempNode.enableHighlight=false;var drives=i3GEO.arvoreDeTemas.DRIVES;var iglt=drives.length;var ig=0;do{var d={html:drives[ig].nome,caminho:drives[ig].caminho};var drive=new YAHOO.widget.HTMLNode(d,tempNode,false,true);drive.enableHighlight=false;drive.setDynamicLoad(i3GEO.arvoreDeTemas.montaDir,1);ig++}while(ig<iglt)};i3GEO.arvoreDeTemas.listaDrives(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,retorno)}}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.navegacaoDir==true){var conteudo="<a href='../admin' target=blank >Sistema de administração</a>";var d={html:conteudo,idmenu:""};var tempNode=new YAHOO.widget.HTMLNode(d,root,false,true);tempNode.enableHighlight=false;var conteudo="<a href='../admin/html/arvore.html' target=blank >Editor de menus</a>";var d={html:conteudo,idmenu:""};var tempNode=new YAHOO.widget.HTMLNode(d,root,false,true);tempNode.enableHighlight=false}if(i3GEO.arvoreDeTemas.INCLUIWMS==true){var conteudo="<b>&nbsp;OGC-WMS</b>"+" <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=33' >&nbsp;&nbsp;&nbsp;</a>";var d={html:conteudo,idwms:"raiz"};var tempNode=new YAHOO.widget.HTMLNode(d,root,false,true);tempNode.enableHighlight=false;tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.listaWMS,1)}var dados=i3GEO.arvoreDeTemas.MENUS;var c=dados.length;for(var i=0,j=c;i<j;i++){var desc=dados[i].desc;if(!dados[i].nomemenu)dados[i].nomemenu=dados[i].idmenu;if(dados[i].publicado!="NAO")var conteudo="<b>&nbsp;<span title='"+desc+"'>"+dados[i].nomemenu+"</span>";else var conteudo="<b>&nbsp;<span title='nao publicado' style=color:red; >"+dados[i].nomemenu+"</span>";var d={html:conteudo,idmenu:dados[i].idmenu};var tempNode=new YAHOO.widget.HTMLNode(d,root,false,true);tempNode.enableHighlight=false;tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaGrupos,currentIconMode);if(dados[i].status=="aberto"){tempNode.expand()}}if(i3GEO.arvoreDeTemas.INCLUISISTEMAS){var retorno=function(){try{var sis=i3GEO.arvoreDeTemas.SISTEMAS;var iglt=sis.length;var conteudo="<b>Sistemas</b>"+" <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=34' >&nbsp;&nbsp;&nbsp;</a>";var d={html:conteudo};var tempNode=new YAHOO.widget.HTMLNode(d,root,false,true);tempNode.enableHighlight=false}catch(e){i3GEO.arvoreDeTemas.ARVORE.draw();return}var ig=0;do{var nomeSis=sis[ig].NOME;if(sis[ig].PUBLICADO){if(sis[ig].PUBLICADO=="NAO"||sis[ig].PUBLICADO=="nao"){var nomeSis="<s>"+sis[ig].NOME+"</s>"}}var d={html:nomeSis};var sisNode=new YAHOO.widget.HTMLNode(d,tempNode,false,true);sisNode.enableHighlight=false;var funcoes=sis[ig].FUNCOES;var tempf=funcoes.length;for(var ig2=0;ig2<tempf;ig2++){var executar=funcoes[ig2].ABRIR;var w=funcoes[ig2].W;var h=funcoes[ig2].H;var abre="i3GEO.janela.cria('"+w+"px','"+h+"px','"+executar+"','','','Sistemas')";var nomeFunc="<a href='#' onclick=\""+abre+"\">"+funcoes[ig2].NOME+"</a>";var d={html:nomeFunc};var funcNode=new YAHOO.widget.HTMLNode(d,sisNode,false,true);funcNode.enableHighlight=false;funcNode.isLeaf=true}ig++}while(ig<iglt)i3GEO.arvoreDeTemas.ARVORE.draw()};i3GEO.arvoreDeTemas.listaSistemas(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,retorno)}document.getElementById(i3GEO.arvoreDeTemas.IDHTML).style.textAlign="left";if(!i3GEO.arvoreDeTemas.INCLUISISTEMAS)i3GEO.arvoreDeTemas.ARVORE.draw()},montaGrupos:function(node){var temp=function(){var grupos=i3GEO.arvoreDeTemas.GRUPOS.grupos;var c=grupos.length-3;var raiz=grupos[c].temasraiz;var nraiz=raiz.length;for(i=0;i<nraiz;i++){var mostra=true;if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD&&raiz[i].download=="nao"){var mostra=false}if(i3GEO.arvoreDeTemas.FILTRAOGC&&raiz[i].ogc=="nao"){var mostra=false}if(mostra){var html=i3GEO.arvoreDeTemas.montaTextoTema("gray",raiz[i]);var d={html:html};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.enableHighlight=false;tempNode.isLeaf=true}}for(i=0;i<c;i++){var mostra=true;if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD&&grupos[i].download=="nao"){var mostra=false}if(i3GEO.arvoreDeTemas.FILTRAOGC&&grupos[i].ogc=="nao"){var mostra=false}if(mostra){if(grupos[i].publicado){if(grupos[i].publicado=="NAO"){grupos[i].nome="<span title='nao publicado' style=color:red; >"+grupos[i].nome+"</span>"}}var d={html:grupos[i].nome,idmenu:node.data.idmenu,idgrupo:i};if(grupos[i].id_n1)var d={html:grupos[i].nome,idmenu:node.data.idmenu,idgrupo:grupos[i].id_n1};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.enableHighlight=false;tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaSubGrupos,1);tempNode.isLeaf=false}}node.loadComplete()};i3GEO.arvoreDeTemas.listaGrupos(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,node.data.idmenu,temp)},montaSubGrupos:function(node){var temp=function(){var subgrupos=i3GEO.arvoreDeTemas.SUBGRUPOS.subgrupo;var c=subgrupos.length;var raiz=i3GEO.arvoreDeTemas.SUBGRUPOS.temasgrupo;var nraiz=raiz.length;for(i=0;i<nraiz;i++){var mostra=true;if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD&&raiz[i].download=="nao"){var mostra=false}if(i3GEO.arvoreDeTemas.FILTRAOGC&&raiz[i].ogc=="nao"){var mostra=false}if(mostra){var html=i3GEO.arvoreDeTemas.montaTextoTema("gray",raiz[i]);var d={html:html};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.enableHighlight=false;tempNode.isLeaf=true}}for(i=0;i<c;i++){var mostra=true;if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD&&subgrupos[i].download=="nao"){var mostra=false}if(i3GEO.arvoreDeTemas.FILTRAOGC&&subgrupos[i].ogc=="nao"){var mostra=false}if(mostra){if(subgrupos[i].publicado){if(subgrupos[i].publicado=="NAO"){subgrupos[i].nome="<span title='nao publicado' style=color:red; >"+subgrupos[i].nome+"</span>"}}var d={html:subgrupos[i].nome,idmenu:node.data.idmenu,idgrupo:node.data.idgrupo,idsubgrupo:i};if(subgrupos[i].id_n2)var d={html:subgrupos[i].nome,idmenu:node.data.idmenu,idgrupo:node.data.idgrupo,idsubgrupo:subgrupos[i].id_n2};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaTemas,1);tempNode.isLeaf=false;tempNode.enableHighlight=false}}node.loadComplete()};i3GEO.arvoreDeTemas.listaSubGrupos(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,node.data.idmenu,node.data.idgrupo,temp)},montaTemas:function(node){var temp=function(){var temas=i3GEO.arvoreDeTemas.TEMAS.temas;var c=temas.length;var cor="rgb(51, 102, 102)";for(i=0;i<c;i++){var mostra=true;if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD&&temas[i].download=="nao"){var mostra=false}if(i3GEO.arvoreDeTemas.FILTRAOGC&&temas[i].ogc=="nao"){var mostra=false}if(mostra){if(temas[i].publicado){if(temas[i].publicado=="NAO"){temas[i].nome="<span title='nao publicado' style=color:red; >"+temas[i].nome+"</span>"}}htmli=i3GEO.arvoreDeTemas.montaTextoTema(cor,temas[i]);var d={nacessos:temas[i].nacessos,html:htmli,idtema:temas[i].tid,fonte:temas[i].link,ogc:temas[i].ogc};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.propTemas,1);tempNode.isLeaf=false;tempNode.enableHighlight=false;if(cor=="rgb(51, 102, 102)"){var cor="rgb(47, 70, 50)"}else{var cor="rgb(51, 102, 102)"}}}node.loadComplete()};i3GEO.arvoreDeTemas.listaTemas(i3GEO.arvoreDeTemas.SID,i3GEO.arvoreDeTemas.LOCAPLIC,node.data.idmenu,node.data.idgrupo,node.data.idsubgrupo,temp)},montaDir:function(node){var montaLista=function(retorno){var dirs=retorno.data.diretorios;for(ig=0;ig<dirs.length;ig++){var conteudo=dirs[ig];var d={html:conteudo,caminho:node.data.caminho+"/"+conteudo};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.setDynamicLoad(i3GEO.arvoreDeTemas.montaDir,1);tempNode.enableHighlight=false}var arquivos=retorno.data.arquivos;for(ig=0;ig<arquivos.length;ig++){var conteudo=arquivos[ig];if(conteudo.search(".tif")>1||conteudo.search(".TIF")>1||conteudo.search(".shp")>1||conteudo.search(".SHP")>1){var conteudo="<a href='#' title='"+$trad("g2")+"' onclick='i3GEO.util.adicionaSHP(\""+node.data.caminho+"/"+conteudo+"\")' >"+conteudo+"</a>";var d={html:conteudo,caminho:node.data.caminho+"/"+conteudo};var nodeSHP=new YAHOO.widget.HTMLNode(d,node,false,true);nodeSHP.enableHighlight=false;nodeSHP.isLeaf=true}}node.loadComplete()};i3GEO.php.listaarquivos(montaLista,node.data.caminho)},montaTextoTema:function(cor,tema){var html="<td style='vertical-align:top;padding-top:5px;'><span ><input style='cursor:pointer;border:solid 0 white;' ";if(i3GEO.arvoreDeTemas.ATIVATEMA!="")html+="onclick=\""+i3GEO.arvoreDeTemas.ATIVATEMA+"\"";else html+="onclick='i3GEO.util.criaBotaoAplicar(\"i3GEO.arvoreDeTemas.adicionaTemas\",\""+$trad("p14")+"\",\"i3geoBotaoAplicar\",this)'";html+=" type='checkbox' value='"+tema.tid+"' /></td><td style='padding-top:4px;vertical-align:top;text-align:left;color:"+cor+";padding-left:3px;' >";html+=tema.nome;html+="</td></span>";return(html)},propTemas:function(node){var g_locaplic=i3GEO.arvoreDeTemas.LOCAPLIC;if(node.data.fonte!=""&&node.data.fonte!=" "){var html="<a title='' href='"+node.data.fonte+"' target='_blank' >Fonte</a>";var d={html:html};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.enableHighlight=false;tempNode.isLeaf=true}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.mini==true){var lkmini=g_locaplic+"/testamapfile.php?map="+node.data.idtema+".map&tipo=mini";var lkmini1=g_locaplic+"/testamapfile.php?map="+node.data.idtema+".map&tipo=grande";var html="<a title='' onmouseover='i3GEO.ajuda.mostraJanela(\"<img src="+lkmini+" />\")' href='"+lkmini1+"' target='blank' >Miniatura</a>";var d={html:html};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.enableHighlight=false;tempNode.isLeaf=true}if(node.data.ogc!="nao"){if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.kml==true){var html="<a href='#' title='' onclick='i3GEO.tema.dialogo.abreKml(\""+node.data.idtema+"\")' >Kml</a>";var d={html:html};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.enableHighlight=false;tempNode.isLeaf=true}var ogc=g_locaplic+"/ogc.php?tema="+node.data.idtema+"&service=wms&request=getcapabilities";var html="<a title='' href='"+ogc+"' target='blank' >WMS - OGC</a>";var d={html:html};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.enableHighlight=false;tempNode.isLeaf=true}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.qrcode==true){var lkgrcode=g_locaplic+"/pacotes/qrcode/php/qr_html.php?d="+g_locaplic+"/mobile/index.php?temasa="+node.data.idtema;var lkgrcode1=g_locaplic+"/pacotes/qrcode/php/qr_img.php?d="+g_locaplic+"/mobile/index.php?temasa="+node.data.idtema;var html="<a title='' onmouseover='i3GEO.ajuda.mostraJanela(\"<img src="+lkgrcode1+" />\")' href='"+lkgrcode+"' target='blank' >Qrcode</a>";var d={html:html};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.enableHighlight=false;tempNode.isLeaf=true}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.estrelas==true){var n=parseInt(node.data.nacessos/(i3GEO.arvoreDeTemas.FATORESTRELA*1));if(n>=5){var n=5}if(n>0)var html="<img src='"+i3GEO.util.$im("e"+n+".png")+"'/>";else var html="<img src='"+i3GEO.util.$im("e0.png")+"'/>";var d={html:html};var tempNode=new YAHOO.widget.HTMLNode(d,node,false,true);tempNode.enableHighlight=false;tempNode.isLeaf=true}node.loadComplete()},outrasOpcoesHTML:function(){var ins="";var t=0;if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.refresh==true){ins+="<td><img class='refresh' onclick='i3GEO.arvoreDeTemas.atualiza()' src='"+i3GEO.util.$im("branco.gif")+"' style='cursor:pointer;text-align:left' title='Refresh'/><td>";t+=20}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploaddbf==true){ins+="<td><img class='uploaddbf' onclick='i3GEO.arvoreDeTemas.dialogo.uploaddbf()' src='"+i3GEO.util.$im("branco.gif")+"' style='cursor:pointer;text-align:left' title='"+$trad("a2b")+"'/><td>";t+=20}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.uploadlocal==true){ins+="<td><img class='upload' onclick='i3GEO.arvoreDeTemas.dialogo.upload()' src='"+i3GEO.util.$im("branco.gif")+"' style='cursor:pointer;text-align:left' title='"+$trad("a2")+"'/><td>";t+=20}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.downloadbase==true){ins+="<td><img onclick='i3GEO.arvoreDeTemas.dialogo.downloadbase()' class='download' src='"+i3GEO.util.$im("branco.gif")+"' style='cursor:pointer;text-align:left'  title='"+$trad("a3")+"'/><td>";t+=20}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectarwms==true){ins+="<td><img class='conectarwms' onclick='i3GEO.arvoreDeTemas.dialogo.conectarwms()' src='"+i3GEO.util.$im("branco.gif")+"' style='cursor:pointer;text-align:left'  title='"+$trad("a4")+"'/><td>";t+=20}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectarwmst==true){ins+="<td><img class='conectarwmst' onclick='i3GEO.arvoreDeTemas.dialogo.conectarwmst()' src='"+i3GEO.util.$im("branco.gif")+"' style='cursor:pointer;text-align:left'  title='"+$trad("a4b")+"'/><td>";t+=20}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.conectargeorss==true){ins+="<td><img class='conectargeorss' onclick='i3GEO.arvoreDeTemas.dialogo.conectargeorss()' src='"+i3GEO.util.$im("branco.gif")+"' style='cursor:pointer;text-align:left'  title='"+$trad("a5")+"'/><td>";t+=20}if(i3GEO.arvoreDeTemas.OPCOESADICIONAIS.nuvemTags==true){ins+="<td><img class='nuvemtags' onclick='i3GEO.arvoreDeTemas.dialogo.nuvemTags()' src='"+i3GEO.util.$im("branco.gif")+"' style='cursor:pointer;text-align:left'  title='"+$trad("a5a")+"'/><td>";t+=20}var ins="<table width='"+t+"px' ><tr>"+ins+"</tr></table>";return(ins)},desativaCheckbox:function(){var o=document.getElementById(i3GEO.arvoreDeTemas.ARVORE.id);var inputs=o.getElementsByTagName("input");var n=inputs.length;var i=0;do{inputs[i].checked=false;i++}while(i<n)},listaTemasAtivos:function(){var o=document.getElementById(i3GEO.arvoreDeTemas.ARVORE.id);var inputs=o.getElementsByTagName("input");var n=inputs.length;var i=0;var lista=new Array();do{if(inputs[i].checked==true){lista.push(inputs[i].value)}i++}while(i<n)return(lista)},buscaTema:function(palavra){var procurar=i3GEO.util.removeAcentos(palavra);var resultadoProcurar=function(retorno){if(!retorno.data){alert("Ocorreu um erro")}else{var retorno=retorno.data;var conta=0;if((retorno!="erro")&&(retorno!=undefined)){var ig=retorno.length-1;if(ig>=0){do{var ngSgrupo=retorno[ig].subgrupos;var tempn=ngSgrupo.length;for(var sg=0;sg<tempn;sg++){var nomeSgrupo=ngSgrupo[sg].subgrupo;var ngTema=ngSgrupo[sg].temas;var tempng=ngTema.length;for(var st=0;st<tempng;st++){var mostra=true;if(i3GEO.arvoreDeTemas.FILTRADOWNLOAD&&ngTema[st].download=="nao"){var mostra=false}if(i3GEO.arvoreDeTemas.FILTRAOGC&&ngTema[st].ogc=="nao"){var mostra=false}if(mostra){var d=i3GEO.arvoreDeTemas.montaTextoTema("gray",ngTema[st]);var lk="";if(ngTema[st].link!=" "){var lk="<a href='"+ngTema[st].link+"' target='blank'>&nbsp;fonte</a>"}d+="<td style='text-allign:left'> ("+nomeSgrupo+") "+lk+"</td>";var tempNode=new YAHOO.widget.HTMLNode(d,nodePalavra,false,true);tempNode.isLeaf=true;tempNode.enableHighlight=false}conta++}}}while(ig--)}else{var d="<span style='color:red'>Nada encontrado<br><br></span>";var tempNode=new YAHOO.widget.HTMLNode(d,nodePalavra,false,true);tempNode.isLeaf=true;tempNode.enableHighlight=false}}}nodePalavra.loadComplete()};var busca=function(){i3GEO.php.procurartemas(resultadoProcurar,procurar)};i3GEO.arvoreDeTemas.ARVORE.collapseAll();var root=i3GEO.arvoreDeTemas.ARVORE.getRoot();if(!i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id","temasEncontrados")){var d={html:"Temas encontrados",id:"temasEncontrados"};var tempNode=new YAHOO.widget.HTMLNode(d,root,false,true);tempNode.enableHighlight=false}else{var tempNode=i3GEO.arvoreDeTemas.ARVORE.getNodeByProperty("id","temasEncontrados")}var d={html:palavra};nodePalavra=new YAHOO.widget.HTMLNode(d,tempNode,false,true);nodePalavra.enableHighlight=false;i3GEO.arvoreDeTemas.ARVORE.draw();tempNode.expand();nodePalavra.setDynamicLoad(busca,1);nodePalavra.expand()},adicionaTemas:function(){clearTimeout(tempoBotaoAplicar);tempoBotaoAplicar="";i3GEO.temaAtivo="";var tsl=i3GEO.arvoreDeTemas.listaTemasAtivos();i3GEO.arvoreDeTemas.desativaCheckbox();if(tsl.length>0){i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));var temp=function(retorno){i3GEO.janela.fechaAguarde("i3GEO.atualiza");if(retorno.data.erro){alert(retorno.data.erro);return}i3GEO.atualiza();if(i3GEO.arvoreDeTemas.RETORNAGUIA!=""){if(i3GEO.arvoreDeTemas.RETORNAGUIA!=i3GEO.guias.ATUAL){i3GEO.guias.mostra(i3GEO.arvoreDeTemas.RETORNAGUIA)}}};i3GEO.php.adtema(temp,tsl.toString())}},comboMenus:function(locaplic,funcaoOnchange,idDestino,idCombo,largura,altura){i3GEO.configura.locaplic=locaplic;var combo=function(retorno){ob=retorno.data;var ins="<select id='"+idCombo+"' SIZE="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"(this.value)' ><option value='' >Escolha um menu:</option>";for(ig=0;ig<ob.length;ig++){if(ob[ig].publicado!="nao"&&ob[ig].publicado!="NAO"){if(ob[ig].nomemenu)ins+="<option value="+ob[ig].idmenu+" >"+ob[ig].nomemenu+"</option>"}}$i(idDestino).innerHTML=ins+"</select>"};i3GEO.php.pegalistademenus(combo)},comboGruposMenu:function(locaplic,funcaoOnchange,idDestino,idCombo,largura,altura,id_menu){i3GEO.configura.locaplic=locaplic;var combo=function(retorno){obGrupos=retorno.data;var ins="<select id='"+idCombo+"' SIZE="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"(this.value)' ><option value='' >Escolha um grupo:</option>";for(ig=0;ig<obGrupos.grupos.length;ig++){if(obGrupos.grupos[ig].nome)ins+="<option value="+ig+" >"+obGrupos.grupos[ig].nome+"</option>"}$i(idDestino).innerHTML=ins+"</select>"};i3GEO.php.pegalistadegrupos(combo,id_menu,"nao")},comboSubGruposMenu:function(locaplic,funcaoOnchange,idDestino,idCombo,idGrupo,largura,altura){if(idGrupo!=""){var combo=function(retorno){var ins="<select id='"+idCombo+"' size="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"("+idGrupo+",this.value)' ><option value='' >Escolha um sub-grupo:</option>";if(retorno.data.subgrupo){var sg=retorno.data.subgrupo;for(ig=0;ig<sg.length;ig++){ins+="<option value="+ig+" >"+sg[ig].nome+"</option>"}}$i(idDestino).innerHTML=ins+"</select>"};i3GEO.php.pegalistadeSubgrupos(combo,"",idGrupo)}},comboTemasMenu:function(locaplic,funcaoOnchange,idDestino,idCombo,idGrupo,idSubGrupo,largura,altura,id_menu){var combo=function(retorno){var ins="<select id='"+idCombo+"' size="+altura+" style=width:"+largura+"px onchange='"+funcaoOnchange+"("+idGrupo+","+idSubGrupo+",this.value)' ><option value='' >Escolha um tema:</option>";if(retorno.data.temas[i]){var sg=retorno.data.temas;for(ig=0;ig<sg.length;ig++){ins+="<option value="+sg[ig].tid+" >"+sg[ig].nome+"</option>"}}$i(idDestino).innerHTML=ins+"</select>"};i3GEO.php.pegalistadetemas(combo,id_menu,idGrupo,idSubGrupo)},dialogo:{nuvemTags:function(){i3GEO.janela.cria("350px","350px",i3GEO.configura.locaplic+"/ferramentas/nuvemtags/index.htm","","","Nuvem de tags <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=30' >&nbsp;&nbsp;&nbsp;</a>")},navegacaoDir:function(){i3GEO.janela.cria("550px","350px",i3GEO.configura.locaplic+"/ferramentas/navegacaodir/index.htm","","","Diret&oacute;rios")},conectarwms:function(){i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+"/ferramentas/conectarwms/index.htm","","","Conexão WMS <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=28' >&nbsp;&nbsp;&nbsp;</a>")},conectarwmst:function(){var l=400;var a=350;if(i3GEO.parametros.w){var l=i3GEO.parametros.w+150}if(i3GEO.parametros.h){var a=i3GEO.parametros.h+200}i3GEO.janela.cria(l/2+"px",a/2+"px",i3GEO.configura.locaplic+"/ferramentas/wmstime/index.htm","","","Conexão WMS-T <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=76' >&nbsp;&nbsp;&nbsp;</a>")},conectarwfs:function(){i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+"/ferramentas/conectarwfs/index.htm","","","WFS")},conectargeorss:function(){i3GEO.janela.cria("400px","300px",i3GEO.configura.locaplic+"/ferramentas/conectargeorss/index.htm","","","Conexão GeoRSS <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=29' >&nbsp;&nbsp;&nbsp;</a>")},upload:function(){i3GEO.janela.cria("300px","230px",i3GEO.configura.locaplic+"/ferramentas/upload/index.htm","","","Upload de shapefile <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=27' >&nbsp;&nbsp;&nbsp;</a>")},uploaddbf:function(){i3GEO.janela.cria("300px","280px",i3GEO.configura.locaplic+"/ferramentas/uploaddbf/index.htm","","","Upload DBF <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=4&idajuda=26' >&nbsp;&nbsp;&nbsp;</a>")},downloadbase:function(){window.open(i3GEO.configura.locaplic+"/datadownload.htm")}}};
if(typeof(i3GEO)=='undefined'){i3GEO=new Array()}i3GEO.barraDeBotoes={AUTOALTURA:false,TRANSICAOSUAVE:true,OPACIDADE:65,PERMITEFECHAR:true,PERMITEDESLOCAR:true,ATIVAMENUCONTEXTO:false,LISTABOTOES:i3GEO.configura.funcoesBotoes.botoes,BOTAOPADRAO:"pan",BARRAS:new Array(),BOTAOCLICADO:"",ativaIcone:function(icone){i3GEO.barraDeBotoes.BOTAOCLICADO=icone;var ko=i3GEO.barraDeBotoes.LISTABOTOES.length-1;if(ko>=0){do{var temp=$i(i3GEO.barraDeBotoes.LISTABOTOES[ko].iddiv);if(i3GEO.barraDeBotoes.LISTABOTOES[ko].tipo=="dinamico"&&temp){var ist=temp.style;ist.borderWidth="1px";ist.borderColor='white';ist.borderLeftColor='rgb(50,50,50)';ist.borderBottomColor='rgb(50,50,50)'}}while(ko--)}if($i(icone)){with($i(icone).style){borderColor='white';borderWidth="1px"}}},ativaBotoes:function(padrao){if(arguments.length==0){var padrao=i3GEO.barraDeBotoes.BOTAOPADRAO}i3GEO.barraDeBotoes.BOTAOCLICADO=padrao;var l=i3GEO.barraDeBotoes.LISTABOTOES;var b=l.length-1;if(b>=0){do{if($i(l[b].iddiv)){if(l[b].conteudo){eval('$i(l[b].iddiv).innerHTML = "'+l[b].conteudo+'"')}if(l[b].dica){eval('$i("'+l[b].iddiv+'").onmouseover = function(){i3GEO.ajuda.mostraJanela("'+l[b].dica+'","");}');eval('$i("'+l[b].iddiv+'").onmouseout = function(){i3GEO.ajuda.mostraJanela("");};')}if(l[b].funcaoonclick){$i(l[b].iddiv).onclick=l[b].funcaoonclick;if(l[b].iddiv==padrao){l[b].funcaoonclick()}}if(l[b].constroiconteudo){eval(l[b].constroiconteudo)}}}while(b--)}},ativaBarraDeZoom:function(){$i("vertMaisZoom").onmouseover=function(){i3GEO.ajuda.mostraJanela('Amplia o mapa mantendo o centro atual.')};$i("vertMaisZoom").onclick=function(){$i("vertHandleDivZoom").onmousedown.call();g_fatordezoom=0;$i("vertHandleDivZoom").onmousemove.call();g_fatordezoom=-1;$i("vertHandleDivZoom").onmousemove.call();i3GEO.barraDeBotoes.BOTAOCLICADO='zoomin';i3GEO.navega.zoomin();g_fatordezoom=0};$i("vertMenosZoom").onmouseover=function(){i3GEO.ajuda.mostraJanela('Reduz o mapa mantendo o centro atual.')};$i("vertMenosZoom").onclick=function(){$i("vertHandleDivZoom").onmousedown.call();g_fatordezoom=0;$i("vertHandleDivZoom").onmousemove.call();g_fatordezoom=1;$i("vertHandleDivZoom").onmousemove.call();i3GEO.barraDeBotoes.BOTAOCLICADO='zoomout';i3GEO.navega.zoomout();g_fatordezoom=0}},inicializaBarra:function(idconteudo,idconteudonovo,barraZoom,x,y){var wj="36px";var recuo="0px";var novoel=document.createElement("div");novoel.id=idconteudonovo;novoel.style.display="block";novoel.style.border="1px solid gray";novoel.style.background="white";if(i3GEO.barraDeBotoes.TRANSICAOSUAVE){if(navm){novoel.style.filter='alpha(opacity='+i3GEO.barraDeBotoes.OPACIDADE+')'}else{novoel.style.opacity=i3GEO.barraDeBotoes.OPACIDADE/100}}else{if(navm){novoel.style.filter='alpha(opacity=90)'}else{novoel.style.opacity=.85}}var temp="";if(barraZoom==true){if(navn){temp+='<div style="text-align:center;position:relative;left:9px" >'}var estilo="top:4px;";if(navm){var estilo="top:4px;left:-2px;"}temp+='<div id="vertMaisZoom" style="'+estilo+'"></div><div id="vertBGDiv" name="vertBGDiv" tabindex="0" x2:role="role:slider" state:valuenow="0" state:valuemin="0" state:valuemax="200" title="Zoom" >';temp+='<div id="vertHandleDivZoom" ><img alt="" class="slider" src="'+i3GEO.util.$im("branco.gif")+'" /></div></div>';if(navm)temp+='<div id=vertMenosZoom style="left:-1px;" ></div>';else temp+='<div id=vertMenosZoom ></div>';if(navn){temp+='</div>'}}temp+='<div id="'+idconteudonovo+'_" style="left:'+recuo+';top:-6px;"  ></div>';novoel.innerHTML=temp;novoel.onmouseover=function(){if($i("i3geo_rosa")){$i("i3geo_rosa").style.display="none"}if(i3GEO.barraDeBotoes.OPACIDADE){if(navm){novoel.style.filter='alpha(opacity=90)'}else{novoel.style.opacity=.85}}};novoel.onmouseout=function(){if(i3GEO.barraDeBotoes.TRANSICAOSUAVE){if(navm){novoel.style.filter='alpha(opacity='+i3GEO.barraDeBotoes.OPACIDADE+')'}else{novoel.style.opacity=i3GEO.barraDeBotoes.OPACIDADE/100}}};document.body.appendChild(novoel);if(i3GEO.barraDeBotoes.ATIVAMENUCONTEXTO)i3GEO.util.mudaCursor(i3GEO.configura.cursores,"contexto",idconteudonovo,i3GEO.configura.locaplic);if($i(idconteudo)){$i(idconteudonovo+"_").innerHTML=$i(idconteudo).innerHTML;$i(idconteudo).innerHTML="";if(i3GEO.barraDeBotoes.AUTOALTURA){var elementos=$i(idconteudonovo+"_").getElementsByTagName("img");if(elementos[0].id=="sobeferramentas"){try{var elementos=$i(idconteudonovo+"_").getElementsByTagName("div");var alturadisponivel=i3GEO.parametros.h-4;var numerobotoes=parseInt(alturadisponivel/30);var nelementos=elementos.length;var i=0;do{elementos[i].style.display="none";var i=i+1}while(i<nelementos)var i=0;do{elementos[i].style.display="inline";var i=i+1}while(i<numerobotoes)}catch(e){}if(i<=numerobotoes){if($i("sobeferramentas")){$i("sobeferramentas").style.display="none"}if($i("desceferramentas")){$i("desceferramentas").style.display="none"}}}}}YAHOO.namespace("janelaBotoes.xp");if(i3GEO.barraDeBotoes.AUTOALTURA==false||barraZoom==true)YAHOO.janelaBotoes.xp.panel=new YAHOO.widget.Panel(idconteudonovo,{width:wj,fixedcenter:false,constraintoviewport:false,underlay:"none",close:i3GEO.barraDeBotoes.PERMITEFECHAR,visible:true,draggable:i3GEO.barraDeBotoes.PERMITEDESLOCAR,modal:false});else YAHOO.janelaBotoes.xp.panel=new YAHOO.widget.Panel(idconteudonovo,{height:i3GEO.parametros.h-4,width:wj,fixedcenter:false,constraintoviewport:false,underlay:"none",close:i3GEO.barraDeBotoes.PERMITEFECHAR,visible:true,draggable:i3GEO.barraDeBotoes.PERMITEDESLOCAR,modal:false});if((barraZoom==true)&&$i("img")){i3GEO.barraDeBotoes.ativaBarraDeZoom();verticalSlider=YAHOO.widget.Slider.getVertSlider("vertBGDiv","vertHandleDivZoom",0,70);verticalSlider.onChange=function(offsetFromStart){g_fatordezoom=(offsetFromStart-35)/5};verticalSlider.setValue(35,true);if($i("vertBGDiv")){$i("vertBGDiv").onmouseup=function(){i3GEO.navega.aplicaEscala(i3GEO.configura.locaplic,i3GEO.configura.sid,i3geo_ns);g_fatordezoom=0;verticalSlider.setValue(35,true)}}if($i("vertHandleDivZoom")){$i("vertHandleDivZoom").onmousedown=function(){i3GEO.barraDeBotoes.BOTAOCLICADO='slidezoom';if(!$i("imgtemp")){iclone=document.createElement('IMG');iclone.style.position="absolute";iclone.id="imgtemp";iclone.style.border="1px solid blue";$i("img").parentNode.appendChild(iclone)}var iclone=$i("imgtemp");var corpo=$i("img");if(!corpo){return}iclone.src=corpo.src;iclone.style.width=i3GEO.parametros.w;iclone.style.heigth=i3GEO.parametros.h;iclone.style.top=corpo.style.top;iclone.style.left=corpo.style.left;$i("img").style.display="none";iclone.style.display="block"}}if($i("vertHandleDivZoom")){$i("vertHandleDivZoom").onmousemove=function(){var iclone=$i("imgtemp");var corpo=$i("img");if(!corpo){return}var nw=i3GEO.parametros.w;var nh=i3GEO.parametros.h;var nt=0;var nl=0;i3geo_ns=parseInt(i3GEO.parametros.mapscale);if((g_fatordezoom>0)&&(g_fatordezoom<7)){g_fatordezoom=g_fatordezoom+1;var velhoh=parseInt(iclone.style.height);var velhow=parseInt(iclone.style.width);var nh=i3GEO.parametros.h/g_fatordezoom;var nw=i3GEO.parametros.w/g_fatordezoom;var t=parseInt(iclone.style.top);var l=parseInt(iclone.style.left);var nt=t+((velhoh-nh)*.5);var nl=l+((velhow-nw)*.5);var fatorEscala=nh/i3GEO.parametros.h;i3geo_ns=parseInt(i3GEO.parametros.mapscale/fatorEscala)}if((g_fatordezoom<0)&&(g_fatordezoom>-7)){g_fatordezoom=g_fatordezoom-1;var velhoh=parseInt(iclone.style.height);var velhow=parseInt(iclone.style.width);var nh=i3GEO.parametros.h*g_fatordezoom*-1;var nw=i3GEO.parametros.w*g_fatordezoom*-1;var t=parseInt(iclone.style.top);var l=parseInt(iclone.style.left);var nt=t-((nh-velhoh)*.5);var nl=l-((nw-velhow)*.5);var fatorEscala=nh/i3GEO.parametros.h;i3geo_ns=parseInt(i3GEO.parametros.mapscale/fatorEscala)}if(iclone){iclone.style.width=nw;iclone.style.height=nh;if(iclone.style.pixelTop){iclone.style.pixelTop=nt}else{iclone.style.top=nt+"px"}if(iclone.style.pixelLeft){iclone.style.pixelLeft=nl}else{iclone.style.left=nl+"px"}}if($i("i3geo_escalanum")){$i("i3geo_escalanum").value=i3geo_ns}}}}YAHOO.janelaBotoes.xp.panel.render();if(i3GEO.barraDeBotoes.AUTOALTURA==true){var y=y-i3GEO.interface.BARRABOTOESTOP+2;var x=x-3}YAHOO.janelaBotoes.xp.panel.moveTo(x,y);if($i("sobeferramentas")){$i("sobeferramentas").onclick=function(){var elementos=$i(idconteudonovo+"_").getElementsByTagName("div");var nelementos=elementos.length;if(elementos[0].style.display=="inline"&&elementos[0].id==""){return}if(elementos[1].style.display=="inline"&&elementos[1].id==""){return}if(nelementos>0){var mostra=elementos[0];var i=0;do{if(elementos[i].style){if(elementos[i].style.display=="inline"&&elementos[i].id==""){break}if(elementos[i].style.display=="none"&&elementos[i].id==""){var mostra=elementos[i]}}var i=i+1}while(i<nelementos)mostra.style.display="inline";var i=nelementos-1;var mostra=elementos[i];do{if(elementos[i].style){if(elementos[i].style.display=="inline"){var mostra=elementos[i];break}}var i=i-1}while(i>=0)mostra.style.display="none"}}}if($i("desceferramentas")){$i("desceferramentas").onclick=function(){var tipo="inline";if($i(idconteudonovo+"_")){var elementos=$i(idconteudonovo+"_").getElementsByTagName("div");if(elementos[elementos.length-1].style.display==tipo){return}var nelementos=elementos.length;if(nelementos>0){var i=0;do{var e=elementos[i];if(e.style){if((e.style.display=="block")||(e.style.display=="inline")||(e.style.display=="")){if(e.id==""){e.style.display="none";break}}}var i=i+1}while(i<nelementos)var i=nelementos-1;var mostra=elementos[i];do{var e=elementos[i];if(e.style){if(e.style.display==tipo){break}if(e.style.display=="none"){var mostra=e}}var i=i-1}while(i>=0)mostra.style.display=tipo}}}}i3GEO.barraDeBotoes.BARRAS.push(YAHOO.janelaBotoes.xp.panel);YAHOO.janelaBotoes.xp.panel.show();if(i3GEO.barraDeBotoes.ATIVAMENUCONTEXTO){i3GEO.barraDeBotoes.ativaMenuContexto(idconteudonovo)}if($i(idconteudonovo+"_h"))$i(idconteudonovo+"_h").className="hd2"},ativaMenuContexto:function(idbarra){function executar(a,b,c){eval(c)};var oFieldContextMenuItemData=[{text:"&nbsp;<span class='container-close'></span>"},{text:"Fechar barra",onclick:{fn:executar,obj:"i3GEO.barraDeBotoes.fecha('"+idbarra+"')"}},{text:"Barra normal",onclick:{fn:executar,obj:"i3GEO.barraDeBotoes.AUTOALTURA=false;i3GEO.barraDeBotoes.PERMITEFECHAR=true;i3GEO.barraDeBotoes.PERMITEDESLOCAR=true;i3GEO.barraDeBotoes.recria('"+idbarra+"')"}},{text:"Barra fixa",onclick:{fn:executar,obj:"i3GEO.barraDeBotoes.AUTOALTURA=true;i3GEO.barraDeBotoes.PERMITEFECHAR=false;i3GEO.barraDeBotoes.PERMITEDESLOCAR=false;i3GEO.barraDeBotoes.recria('"+idbarra+"')"}},{text:"Remove transição",onclick:{fn:executar,obj:"i3GEO.barraDeBotoes.TRANSICAOSUAVE=false;"}},{text:"Ativa transição",onclick:{fn:executar,obj:"i3GEO.barraDeBotoes.TRANSICAOSUAVE=true;"}}];var oFieldContextMenu=new YAHOO.widget.ContextMenu("contexto_"+idbarra,{trigger:idbarra,itemdata:oFieldContextMenuItemData,lazyload:true});var onFieldMenuRender=function(){eval("var id = 'contexto_"+idbarra+"'");$i(id).style.zIndex=50000};oFieldContextMenu.subscribe("render",onFieldMenuRender)},reativa:function(indice){if(arguments.length==1)i3GEO.barraDeBotoes.BARRAS[indice].show();else{var n=i3GEO.barraDeBotoes.BARRAS.length;for(i=0;i<n;i++){i3GEO.barraDeBotoes.BARRAS[i].show()}}},recria:function(id){var n=i3GEO.barraDeBotoes.BARRAS.length;for(i=0;i<n;i++){if(i3GEO.barraDeBotoes.BARRAS[i].id==id){var temp=$i("contexto_"+id);if(temp){temp.parentNode.removeChild(temp)}var novoel=document.createElement("div");novoel.id="barraTemporaria"+i;novoel.innerHTML=$i(i3GEO.barraDeBotoes.BARRAS[i].id+"_").innerHTML;document.body.appendChild(novoel);var barraZoom=false;var temp=$i("vertMaisZoom");if(temp){if(navm)var temp=temp.parentNode;else var temp=temp.parentNode.parentNode;if(temp.id==id){var barraZoom=true}}var x=parseInt($i(i3GEO.barraDeBotoes.BARRAS[i].id+"_c").style.left);var y=parseInt($i(i3GEO.interface.IDCORPO).style.top)+10;i3GEO.barraDeBotoes.BARRAS[i].destroy();i3GEO.barraDeBotoes.inicializaBarra(novoel.id,i3GEO.barraDeBotoes.BARRAS[i].id+"x",barraZoom,x,y)}}i3GEO.barraDeBotoes.ativaBotoes()},fecha:function(id){var n=i3GEO.barraDeBotoes.BARRAS.length;for(i=0;i<n;i++){if(i3GEO.barraDeBotoes.BARRAS[i].id==id){$i(id+"_c").style.visibility="hidden"}}}};
/*----------------------------------------------------------------------------
 RICHDRAW 1.0
 Vector Graphics Drawing Script
 -----------------------------------------------------------------------------
 Created by Mark Finkle (mark.finkle@gmail.com)
 Implementation of simple vector graphic drawing control using SVG or VML.
 -----------------------------------------------------------------------------
 Copyright (c) 2006 Mark Finkle

 This program is  free software;  you can redistribute  it and/or  modify it
 under the terms of the MIT License.

 Permission  is hereby granted,  free of charge, to  any person  obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the  Software without restriction,  including without limitation
 the  rights to use, copy, modify,  merge, publish, distribute,  sublicense,
 and/or  sell copies  of the  Software, and to  permit persons to  whom  the
 Software is  furnished  to do  so, subject  to  the  following  conditions:
 The above copyright notice and this  permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS",  WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED,  INCLUDING BUT NOT LIMITED TO  THE WARRANTIES  OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR  COPYRIGHT  HOLDERS BE  LIABLE FOR  ANY CLAIM,  DAMAGES OR OTHER
 LIABILITY, WHETHER  IN AN  ACTION OF CONTRACT, TORT OR  OTHERWISE,  ARISING
 FROM,  OUT OF OR  IN  CONNECTION  WITH  THE  SOFTWARE OR THE  USE OR  OTHER
 DEALINGS IN THE SOFTWARE.
 -----------------------------------------------------------------------------
 Dependencies: (SVG or VML rendering implementations)
 History:
 2006-04-05 | Created
 --------------------------------------------------------------------------*/


function RichDrawEditor(elem, renderer) {
  this.container = elem;
	this.gridX = 10;
	this.gridY = 10;
  this.mouseDownX = 0;
  this.mouseDownY = 0;
  this.mode = '';
  this.fillColor = '';
  this.lineColor = '';
  this.lineWidth = '';
  this.selected = null;
  this.selectedBounds = { x:0, y:0, width:0, height: 0 };

	this.onselect = function() {};
	this.onunselect = function() {};

  this.renderer = renderer;
  this.renderer.init(this.container);
  this.fecha = function()
  {
  	pontosdistobj = new pontosdist();
  	elem.innerHTML = "";
  	elem.style.display="none";
  	if(g_tipoacao == "mede")
  	{mudaiconf("pan");}
  	if(document.getElementById("mostradistancia"))
  	{document.getElementById("mostradistancia").style.display="none";}
  }

/*
  //this.onMouseDownListener = this.onMouseDown.bindAsEventListener(this);
  this.onClickListener = this.onClick.bindAsEventListener(this);
  this.onMouseUpListener = this.onMouseUp.bindAsEventListener(this);
  this.onDragListener = this.onDrag.bindAsEventListener(this);
  this.onResizeListener = this.onResize.bindAsEventListener(this);
  this.onDrawListener = this.onDraw.bindAsEventListener(this);

  this.onHitListener = this.onHit.bindAsEventListener(this);

  this.onSelectStartListener = this.onSelectStart.bindAsEventListener(this);

  //Event.observe(this.container, "mousedown", this.onMouseDownListener);
  Event.observe(this.container, "mouseclick", this.onClickListener);
  Event.observe(this.container, "mouseup", this.onMouseUpListener);
  Event.observe(this.container, "selectstart", this.onSelectStartListener);  
*/
}


RichDrawEditor.prototype.clearWorkspace = function() {
	this.container.innerHTML = '';
};


RichDrawEditor.prototype.deleteSelection = function() {
  if (this.selected) {
    this.renderer.remove(this.container.ownerDocument.getElementById('tracker'));
    this.renderer.remove(this.selected);
    this.selected = null;
  }
};


RichDrawEditor.prototype.select = function(elem) {
  if (elem == this.selected)
    return;

  this.selected = elem;
  this.renderer.showTracker(this.selected);
  this.onselect(this);
};


RichDrawEditor.prototype.unselect = function() {
  if (this.selected) {
    this.renderer.remove(this.container.ownerDocument.getElementById('tracker'));
    this.selected = null;
    this.onunselect(this);
  }
};


RichDrawEditor.prototype.getSelectedElement = function() {
  return this.selected;
};


RichDrawEditor.prototype.setGrid = function(horizontal, vertical) {
  this.gridX = horizontal;
  this.gridY = vertical;
};


RichDrawEditor.prototype.editCommand = function(cmd, value)
{
  if (cmd == 'mode') {
    this.mode = value;
  }
  else if (this.selected == null) {
    if (cmd == 'fillcolor') {
      this.fillColor = value;
    }
    else if (cmd == 'linecolor') {
      this.lineColor = value;
    }
    else if (cmd == 'linewidth') {
      this.lineWidth = parseInt(value) + 'px';
    }
  }
  else {
    this.renderer.editCommand(this.selected, cmd, value);
  }
};


RichDrawEditor.prototype.queryCommand = function(cmd)
{
  if (cmd == 'mode') {
    return this.mode;
  }
  else if (this.selected == null) {
    if (cmd == 'fillcolor') {
      return this.fillColor;
    }
    else if (cmd == 'linecolor') {
      return this.lineColor;
    }
    else if (cmd == 'linewidth') {
      return this.lineWidth;
    }
  }
  else {
    return this.renderer.queryCommand(this.selected, cmd);
  }
};


RichDrawEditor.prototype.onSelectStart = function(event) {
  return false;
};

RichDrawEditor.prototype.onClick = function(event) {
  var offset = Position.cumulativeOffset(this.container);
  var snappedX = Math.round((Event.pointerX(event) - offset[0]) / this.gridX) * this.gridX;
  var snappedY = Math.round((Event.pointerY(event) - offset[1]) / this.gridY) * this.gridY;
  if (this.mode != 'select') {
    this.unselect();
    this.mouseDownX = snappedX;
    this.mouseDownY = snappedY;
    this.selected = this.renderer.create(this.mode, this.fillColor, this.lineColor, this.lineWidth, this.mouseDownX, this.mouseDownY, 1, 1);
    this.selected.id = 'shape:' + createUUID();
    Event.observe(this.selected, "mousemove", this.onHitListener);  
    Event.observe(this.container, "mousemove", this.onDrawListener);  
  
  }
  else {
    if (this.mouseDownX != snappedX || this.mouseDownY != snappedY)
      this.unselect();
  }
  
  return false;
};


RichDrawEditor.prototype.onMouseDown = function(event) {
  var offset = Position.cumulativeOffset(this.container);
  var snappedX = Math.round((Event.pointerX(event) - offset[0]) / this.gridX) * this.gridX;
  var snappedY = Math.round((Event.pointerY(event) - offset[1]) / this.gridY) * this.gridY;
  if (this.mode != 'select') {
    this.unselect();
    this.mouseDownX = snappedX;
    this.mouseDownY = snappedY;
    this.selected = this.renderer.create(this.mode, this.fillColor, this.lineColor, this.lineWidth, this.mouseDownX, this.mouseDownY, 1, 1);
    this.selected.id = 'shape:' + createUUID();
    Event.observe(this.selected, "mousedown", this.onHitListener);  
    Event.observe(this.container, "mousemove", this.onDrawListener);  
  }
  else {
    if (this.mouseDownX != snappedX || this.mouseDownY != snappedY)
      this.unselect();
  }
  
  return false;
};


RichDrawEditor.prototype.onMouseUp = function(event) {
  Event.stopObserving(this.container, "mouseup", this.onDrawListener);  
  Event.stopObserving(this.container, "mouseup", this.onDragListener);  

  if (this.mode != 'select') {
    this.selected = null;
  }
};


RichDrawEditor.prototype.onDrag = function(event) {
  var offset = Position.cumulativeOffset(this.container);
  var snappedX = Math.round((Event.pointerX(event) - offset[0]) / this.gridX) * this.gridX;
  var snappedY = Math.round((Event.pointerY(event) - offset[1]) / this.gridY) * this.gridY;

  var deltaX = snappedX - this.mouseDownX;
  var deltaY = snappedY - this.mouseDownY;
  this.renderer.move(this.selected, this.selectedBounds.x + deltaX, this.selectedBounds.y + deltaY);
  // Update selection tracker
  this.renderer.showTracker(this.selected);
//  hide_tracker();
};


RichDrawEditor.prototype.onResize = function(event) {
  var offset = Position.cumulativeOffset(this.container);
  var snappedX = Math.round((Event.pointerX(event) - offset[0]) / this.gridX) * this.gridX;
  var snappedY = Math.round((Event.pointerY(event) - offset[1]) / this.gridY) * this.gridY;

  var deltaX = snappedX - this.mouseDownX;
  var deltaY = snappedY - this.mouseDownY;

  this.renderer.track(handle, deltaX, deltaY);

  // Update selection tracker
  show_tracker();
//  hide_tracker();
};

//
//o elemento está sendo desenhado
//
RichDrawEditor.prototype.onDraw = function(event) {
  if (this.selected == null)
    return;

  var offset = Position.cumulativeOffset(this.container);
  var snappedX = Math.round((Event.pointerX(event) - offset[0]) / this.gridX) * this.gridX;
  var snappedY = Math.round((Event.pointerY(event) - offset[1]) / this.gridY) * this.gridY;
  this.renderer.resize(this.selected, this.mouseDownX, this.mouseDownY, snappedX, snappedY);
};


RichDrawEditor.prototype.onHit = function(event) {
  if (this.mode == 'select') {
    this.select(Event.element(event));
    this.selectedBounds = this.renderer.bounds(this.selected);
    
    var offset = Position.cumulativeOffset(this.container);
    this.mouseDownX = Math.round((Event.pointerX(event) - offset[0]) / this.gridX) * this.gridX;
    this.mouseDownY = Math.round((Event.pointerY(event) - offset[1]) / this.gridY) * this.gridY;

    Event.observe(this.container, "mousemove", this.onDragListener);  
  }
};


function createUUID()
{
  return [4, 2, 2, 2, 6].map(function(length) {
    var uuidpart = "";
    for (var i=0; i<length; i++) {
      var uuidchar = parseInt((Math.random() * 256)).toString(16);
      if (uuidchar.length == 1)
        uuidchar = "0" + uuidchar;
      uuidpart += uuidchar;
    }
    return uuidpart;
  }).join('-');
}

//----------------------------------------------------------------------------
// AbstractRenderer
//
// Abstract base class defining the drawing API. Can not be used directly.
//----------------------------------------------------------------------------

function AbstractRenderer() {

};

AbstractRenderer.prototype.init = function(elem) {};
AbstractRenderer.prototype.bounds = function(shape) { return { x:0, y:0, width:0, height: 0 }; };
AbstractRenderer.prototype.create = function(shape, fillColor, lineColor, lineWidth, left, top, width, height, texto) {};
AbstractRenderer.prototype.remove = function(shape) {};
AbstractRenderer.prototype.move = function(shape, left, top) {};
AbstractRenderer.prototype.track = function(shape) {};
AbstractRenderer.prototype.resize = function(shape, fromX, fromY, toX, toY) {};
AbstractRenderer.prototype.editCommand = function(shape, cmd, value) {};
AbstractRenderer.prototype.queryCommand = function(shape, cmd) {};
AbstractRenderer.prototype.showTracker = function(shape) {};
AbstractRenderer.prototype.getMarkup = function() { return null; };

/*----------------------------------------------------------------------------
 SVGRENDERER 1.0
 SVG Renderer For RichDraw
 -----------------------------------------------------------------------------
 Created by Mark Finkle (mark.finkle@gmail.com)
 Implementation of SVG based renderer.
 -----------------------------------------------------------------------------
 Copyright (c) 2006 Mark Finkle

 This program is  free software;  you can redistribute  it and/or  modify it
 under the terms of the MIT License.

 Permission  is hereby granted,  free of charge, to  any person  obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the  Software without restriction,  including without limitation
 the  rights to use, copy, modify,  merge, publish, distribute,  sublicense,
 and/or  sell copies  of the  Software, and to  permit persons to  whom  the
 Software is  furnished  to do  so, subject  to  the  following  conditions:
 The above copyright notice and this  permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS",  WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED,  INCLUDING BUT NOT LIMITED TO  THE WARRANTIES  OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR  COPYRIGHT  HOLDERS BE  LIABLE FOR  ANY CLAIM,  DAMAGES OR OTHER
 LIABILITY, WHETHER  IN AN  ACTION OF CONTRACT, TORT OR  OTHERWISE,  ARISING
 FROM,  OUT OF OR  IN  CONNECTION  WITH  THE  SOFTWARE OR THE  USE OR  OTHER
 DEALINGS IN THE SOFTWARE.
 -----------------------------------------------------------------------------
 Dependencies:
 History:
 2006-04-05 | Created
 --------------------------------------------------------------------------*/


function SVGRenderer() {
	this.base = AbstractRenderer;
	this.svgRoot = null;
}


SVGRenderer.prototype = new AbstractRenderer;


SVGRenderer.prototype.init = function(elem) {
  this.container = elem;

  this.container.style.MozUserSelect = 'none';
    
  var svgNamespace = 'http://www.w3.org/2000/svg';
  this.svgRoot = this.container.ownerDocument.createElementNS(svgNamespace, "svg");
  this.container.appendChild(this.svgRoot);
};


SVGRenderer.prototype.bounds = function(shape) {
  var rect = new Object();
  var box = shape.getBBox();
  rect['x'] = box.x;
  rect['y'] = box.y;
  rect['width'] =  box.width;
  rect['height'] = box.height;
  return rect;
};


SVGRenderer.prototype.create = function(shape, fillColor, lineColor, lineWidth, left, top, width, height, texto) {
  var svgNamespace = 'http://www.w3.org/2000/svg';
  var svg;

  if (shape == 'rect') {
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'rect');
    svg.setAttributeNS(null, 'x', left + 'px');
    svg.setAttributeNS(null, 'y', top + 'px');
    svg.setAttributeNS(null, 'width', width + 'px');
    svg.setAttributeNS(null, 'height', height + 'px');
  }
  else if (shape == 'ellipse') {
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'ellipse');
    svg.setAttributeNS(null, 'cx', (left + width / 2) + 'px');
    svg.setAttributeNS(null, 'cy', (top + height / 2) + 'px');
    svg.setAttributeNS(null, 'rx', (width / 2) + 'px');
    svg.setAttributeNS(null, 'ry', (height / 2) + 'px');
  }
  else if (shape == 'circ') {
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'ellipse');
    svg.setAttributeNS(null, 'cx', left + 'px');
    svg.setAttributeNS(null, 'cy', top + 'px');
    svg.setAttributeNS(null, 'rx', width + 'px');
    svg.setAttributeNS(null, 'ry', width + 'px');
  }
  else if (shape == 'roundrect') {
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'rect');
    svg.setAttributeNS(null, 'x', left + 'px');
    svg.setAttributeNS(null, 'y', top + 'px');
    svg.setAttributeNS(null, 'rx', '20px');
    svg.setAttributeNS(null, 'ry', '20px');
    svg.setAttributeNS(null, 'width', width + 'px');
    svg.setAttributeNS(null, 'height', height + 'px');
  }
  else if (shape == 'line') {
    svg = this.container.ownerDocument.createElementNS(svgNamespace, 'line');
    svg.setAttributeNS(null, 'x1', left + 'px');
    svg.setAttributeNS(null, 'y1', top + 'px');
    svg.setAttributeNS(null, 'x2', width + 'px');
    svg.setAttributeNS(null, 'y2', height + 'px');
  }
  else if (shape == 'text') {
	svg = this.container.ownerDocument.createElementNS(svgNamespace,'text');
	var n = this.container.ownerDocument.createTextNode(texto);
	svg.appendChild(n);
	svg.setAttributeNS(null, 'x', left + 'px');
	svg.setAttributeNS(null, 'y', top + 'px');
	svg.setAttributeNS(null, 'font-size', '12px');
  }

  svg.style.position = 'absolute';

  if (fillColor.length == 0)
    fillColor = 'none';
  svg.setAttributeNS(null, 'fill', fillColor);

  if (lineColor.length == 0)
    lineColor = 'none';
  svg.setAttributeNS(null, 'stroke', lineColor);
  
  svg.setAttributeNS(null, 'stroke-width', lineWidth);
      
  this.svgRoot.appendChild(svg);
  
  return svg;
};


SVGRenderer.prototype.remove = function(shape) {
  shape.parentNode.removeChild(shape);
};


SVGRenderer.prototype.move = function(shape, left, top) {
  if (shape.tagName == 'line') {
    var deltaX = shape.getBBox().width;
    var deltaY = shape.getBBox().height;
    shape.setAttributeNS(null, 'x1', left);
    shape.setAttributeNS(null, 'y1', top);
    shape.setAttributeNS(null, 'x2', left + deltaX);
    shape.setAttributeNS(null, 'y2', top + deltaY);
  }
  else if (shape.tagName == 'ellipse') {
    shape.setAttributeNS(null, 'cx', left + (shape.getBBox().width / 2));
    shape.setAttributeNS(null, 'cy', top + (shape.getBBox().height / 2));
  }
  else {
    shape.setAttributeNS(null, 'x', left);
    shape.setAttributeNS(null, 'y', top);
  }
};


SVGRenderer.prototype.track = function(shape) {
  // TODO
};


SVGRenderer.prototype.resize = function(shape, fromX, fromY, toX, toY) {
  var deltaX = toX - fromX;
  var deltaY = toY - fromY;

  if (shape.tagName == 'line') {
    shape.setAttributeNS(null, 'x2', toX);
    shape.setAttributeNS(null, 'y2', toY);
  }
  else if (shape.tagName == 'ellipse') {
    if (deltaX < 0) {
      shape.setAttributeNS(null, 'cx', (fromX + deltaX / 2) + 'px');
      shape.setAttributeNS(null, 'rx', (-deltaX / 2) + 'px');
    }
    else {
      shape.setAttributeNS(null, 'cx', (fromX + deltaX / 2) + 'px');
      shape.setAttributeNS(null, 'rx', (deltaX / 2) + 'px');
    }
  
    if (deltaY < 0) {
      shape.setAttributeNS(null, 'cy', (fromY + deltaY / 2) + 'px');
      shape.setAttributeNS(null, 'ry', (-deltaY / 2) + 'px');
    }
    else {
      shape.setAttributeNS(null, 'cy', (fromY + deltaY / 2) + 'px');
      shape.setAttributeNS(null, 'ry', (deltaY / 2) + 'px');
    }
  }
  else { 
    if (deltaX < 0) {
      shape.setAttributeNS(null, 'x', toX + 'px');
      shape.setAttributeNS(null, 'width', -deltaX + 'px');
    }
    else {
      shape.setAttributeNS(null, 'width', deltaX + 'px');
    }
  
    if (deltaY < 0) {
      shape.setAttributeNS(null, 'y', toY + 'px');
      shape.setAttributeNS(null, 'height', -deltaY + 'px');
    }
    else {
      shape.setAttributeNS(null, 'height', deltaY + 'px');
    }
  }
};


SVGRenderer.prototype.editCommand = function(shape, cmd, value)
{
  if (shape != null) {
    if (cmd == 'fillcolor') {
      if (value != '')
        shape.setAttributeNS(null, 'fill', value);
      else
        shape.setAttributeNS(null, 'fill', 'none');
    }
    else if (cmd == 'linecolor') {
      if (value != '')
        shape.setAttributeNS(null, 'stroke', value);
      else
        shape.setAttributeNS(null, 'stroke', 'none');
    }
    else if (cmd == 'linewidth') {
      shape.setAttributeNS(null, 'stroke-width', parseInt(value) + 'px');
    }
  }
};


SVGRenderer.prototype.queryCommand = function(shape, cmd)
{
  var result = '';
  
  if (shape != null) {
    if (cmd == 'fillcolor') {
      result = shape.getAttributeNS(null, 'fill');
      if (result == 'none')
        result = '';
    }
    else if (cmd == 'linecolor') {
      result = shape.getAttributeNS(null, 'stroke');
      if (result == 'none')
        result = '';
    }
    else if (cmd == 'linewidth') {
      result = shape.getAttributeNS(null, 'stroke');
      if (result == 'none')
        result = '';
      else
        result = shape.getAttributeNS(null, 'stroke-width');
    }
  }
  
  return result;
};


SVGRenderer.prototype.showTracker = function(shape) {
  var box = shape.getBBox();

  var tracker = document.getElementById('tracker');
  if (tracker) {
    this.remove(tracker);
  }

  var svgNamespace = 'http://www.w3.org/2000/svg';

  tracker = document.createElementNS(svgNamespace, 'rect');
  tracker.setAttributeNS(null, 'id', 'tracker');
  tracker.setAttributeNS(null, 'x', box.x - 10);
  tracker.setAttributeNS(null, 'y', box.y - 10);
  tracker.setAttributeNS(null, 'width', box.width + 20);
  tracker.setAttributeNS(null, 'height', box.height + 20);
  tracker.setAttributeNS(null, 'fill', 'none');
  tracker.setAttributeNS(null, 'stroke', 'blue');
  tracker.setAttributeNS(null, 'stroke-width', '1');
  this.svgRoot.appendChild(tracker);
};


SVGRenderer.prototype.getMarkup = function() {
  return this.container.innerHTML;
};

/*----------------------------------------------------------------------------
 VMLRENDERER 1.0
 VML Renderer For RichDraw
 -----------------------------------------------------------------------------
 Created by Mark Finkle (mark.finkle@gmail.com)
 Implementation of VML based renderer.
 -----------------------------------------------------------------------------
 Copyright (c) 2006 Mark Finkle

 This program is  free software;  you can redistribute  it and/or  modify it
 under the terms of the MIT License.

 Permission  is hereby granted,  free of charge, to  any person  obtaining a
 copy of this software and associated documentation files (the "Software"),
 to deal in the  Software without restriction,  including without limitation
 the  rights to use, copy, modify,  merge, publish, distribute,  sublicense,
 and/or  sell copies  of the  Software, and to  permit persons to  whom  the
 Software is  furnished  to do  so, subject  to  the  following  conditions:
 The above copyright notice and this  permission notice shall be included in
 all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS",  WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED,  INCLUDING BUT NOT LIMITED TO  THE WARRANTIES  OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR  COPYRIGHT  HOLDERS BE  LIABLE FOR  ANY CLAIM,  DAMAGES OR OTHER
 LIABILITY, WHETHER  IN AN  ACTION OF CONTRACT, TORT OR  OTHERWISE,  ARISING
 FROM,  OUT OF OR  IN  CONNECTION  WITH  THE  SOFTWARE OR THE  USE OR  OTHER
 DEALINGS IN THE SOFTWARE.
 -----------------------------------------------------------------------------
 Dependencies:
 History:
 2006-04-05 | Created
 --------------------------------------------------------------------------*/


function VMLRenderer() {
	this.base = AbstractRenderer;
}


VMLRenderer.prototype = new AbstractRenderer;


VMLRenderer.prototype.init = function(elem) {
  this.container = elem;
  
  this.container.style.overflow = 'hidden';
  
	// Add VML includes and namespace
  elem.ownerDocument.namespaces.add("v", "urn:schemas-microsoft-com:vml");

	var style = elem.ownerDocument.createStyleSheet();
	style.addRule('v\\:*', "behavior: url(#default#VML);");
};


VMLRenderer.prototype.bounds = function(shape) {
  var rect = new Object();
  rect['x'] = shape.offsetLeft;
  rect['y'] = shape.offsetTop;
  rect['width'] =  shape.offsetWidth;
  rect['height'] = shape.offsetHeight;
  return rect;
};


VMLRenderer.prototype.create = function(shape, fillColor, lineColor, lineWidth, left, top, width, height, texto) {
  var vml;
  if (shape == 'rect') {
    vml = this.container.ownerDocument.createElement('v:rect');
  }
  else if (shape == 'roundrect') {
    vml = this.container.ownerDocument.createElement('v:roundrect');
  }
  else if (shape == 'ellipse') {
    vml = this.container.ownerDocument.createElement('v:oval');
  }
  else if (shape == 'circ') {
	vml = this.container.ownerDocument.createElement('v:oval');
  }
  else if (shape == 'line') {
    vml = this.container.ownerDocument.createElement('v:line');
  }
  else if (shape == 'text') {
    vml = this.container.ownerDocument.createElement('v:textbox');
    vml.innerHTML = texto;
  }

  if (shape != 'line') {  
    vml.style.position = 'absolute';
    vml.style.left = left;
    vml.style.top = top;
    vml.style.width = width;
    vml.style.height = height;

    if (fillColor != '') {
      vml.setAttribute('filled', 'true');
      vml.setAttribute('fillcolor', fillColor);
    }
    else {
      vml.setAttribute('filled', 'false');
    }
  }
  else {
    vml.style.position = 'absolute';
    vml.setAttribute('from', left + 'px,' + top + 'px');
    vml.setAttribute('to', width + 'px,' + height + 'px');
  }

  if (lineColor != '') {
    vml.setAttribute('stroked', 'true');
    vml.setAttribute('strokecolor', lineColor);
    vml.setAttribute('strokeweight', lineWidth);
  }
  else {
    vml.setAttribute('stroked', 'false');
  }

  this.container.appendChild(vml);
  return vml;
};


VMLRenderer.prototype.remove = function(shape) {
  shape.removeNode(true);
};


VMLRenderer.prototype.move = function(shape, left, top) {
  if (shape.tagName == 'line') {
    shape.style.marginLeft = left;
    shape.style.marginTop = top;
  }
  else {
    shape.style.left = left;
    shape.style.top = top;
  }
};


VMLRenderer.prototype.track = function(shape) {
  // TODO
};


VMLRenderer.prototype.resize = function(shape, fromX, fromY, toX, toY) {
  shape.setAttribute('to', toX + 'px,' + toY + 'px');
  /*
  var deltaX = toX - fromX;
  var deltaY = toY - fromY;
  if (shape.tagName == 'line') {
	shape.setAttribute('to', toX + 'px,' + toY + 'px');
  }
  else {
    if (deltaX < 0) {
      shape.style.left = toX + 'px';
      shape.style.width = -deltaX + 'px';
    }
    else {
      shape.style.width = deltaX + 'px';
    } 
    if (deltaY < 0) {
      shape.style.top = toY + 'px';
      shape.style.height = -deltaY + 'px';
    }
    else {
      shape.style.height = deltaY + 'px';
    }
  }
  */
};

VMLRenderer.prototype.editCommand = function(shape, cmd, value)
{
  if (shape != null) {
    if (cmd == 'fillcolor') {
      if (value != '') {
        shape.filled = 'true';
        shape.fillcolor = value;
      }
      else {
        shape.filled = 'false';
        shape.fillcolor = '';
      }
    }
    else if (cmd == 'linecolor') {
      if (value != '') {
        shape.stroked = 'true';
        shape.strokecolor = value;
      }
      else {
        shape.stroked = 'false';
        shape.strokecolor = '';
      }
    }
    else if (cmd == 'linewidth') {
      shape.strokeweight = parseInt(value) + 'px';
    }
  }
};


VMLRenderer.prototype.queryCommand = function(shape, cmd)
{
  if (shape != null) {
    if (cmd == 'fillcolor') {
      if (shape.filled == 'false')
        return '';
      else
        return shape.fillcolor;
    }
    else if (cmd == 'linecolor') {
      if (shape.stroked == 'false')
        return '';
      else
        return shape.strokecolor;
    }
    else if (cmd == 'linewidth') {
      if (shape.stroked == 'false') {
        return '';
      }
      else {
        // VML always transforms the pixels to points, so we have to convert them back
        return (parseFloat(shape.strokeweight) * (screen.logicalXDPI / 72)) + 'px';
      }
    }
  }
};


VMLRenderer.prototype.showTracker = function(shape) {
  var box = this.bounds(shape);

  var tracker = document.getElementById('tracker');
  if (tracker) {
    this.remove(tracker);
  }

  tracker = this.container.ownerDocument.createElement('v:rect');
  tracker.id = 'tracker';
  tracker.style.position = 'absolute';
  tracker.style.left = box.x - 10;
  tracker.style.top = box.y - 10;
  tracker.style.width = box.width + 20;
  tracker.style.height = box.height + 20;
  tracker.setAttribute('filled', 'false');
  tracker.setAttribute('stroked', 'true');
  tracker.setAttribute('strokecolor', 'blue');
  tracker.setAttribute('strokeweight', '1px');
  this.container.appendChild(tracker);
};


VMLRenderer.prototype.getMarkup = function() {
  return this.container.innerHTML;
};


/*
Title: Gadgets (objetos marginais do mapa)

Arquivo: i3geo/classesjs/classe_gadgets.js

Licenca:

GPL2

I3Geo Interface Integrada de Ferramentas de Geoprocessamento para Internet

Direitos Autorais Reservados (c) 2006 Ministério do Meio Ambiente Brasil
Desenvolvedor: Edmar Moretti edmar.moretti@mma.gov.br

Este programa é software livre; você pode redistribuí-lo
e/ou modificá-lo sob os termos da Licença Pública Geral
GNU conforme publicada pela Free Software Foundation;
tanto a versão 2 da Licença.
Este programa é distribuído na expectativa de que seja útil,
porém, SEM NENHUMA GARANTIA; nem mesmo a garantia implícita
de COMERCIABILIDADE OU ADEQUAÇÃO A UMA FINALIDADE ESPECÍFICA.
Consulte a Licença Pública Geral do GNU para mais detalhes.
Você deve ter recebido uma cópia da Licença Pública Geral do
GNU junto com este programa; se não, escreva para a
Free Software Foundation, Inc., no endereço
59 Temple Street, Suite 330, Boston, MA 02111-1307 USA.
*/
if(typeof(i3GEO) == 'undefined'){
	i3GEO = new Array();
}
/*
Classe: i3GEO.gadgets

Inclui elementos especiais no mapa

Os elementos são opcionais e adicionam funcionalidades ao mapa.

Outras funcionalidades são definidas em botões. Veja <classe_configura.js>
*/
i3GEO.gadgets = {
	/*
	Propriedade: PARAMETROS
	
	Parametros de inicialização dos gadgets.
	
	Essa variável define os parâmetros individuais de cada gadget e o ID do elemento HTML onde
	o gadget será incluído.
	
	Você pode acessar os parâmetros da seguinte forma:
	
	i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda = 400
	
	Default:
	
	i3GEO.gadgets.PARAMETROS = {

		"mostraCoordenadasUTM":

		{idhtml:"mostraUTM"},

		"mostraCoordenadasGEO":

		{idhtml:"localizarxy"},
		
		"mostraInserirKml":
		
		{idhtml:"inserirKml"},

		"mostraEscalaNumerica":

		{idhtml:"escala"},

		"mostraEscalaGrafica":

		{idhtml:"escalaGrafica"},

		"mostraBuscaRapida":

		{idhtml:"buscaRapida"},

		"mostraVisual":

		{idhtml:"visual"},

		"mostraQuadros":

		{idhtml:"lugarquadros"},

		"mostraHistoricoZoom":

		{idhtml:"historicozoom"},

		"mostraMenuSuspenso":

		{idhtml:"menus",deslocaEsquerda:0}
	}	
	
	Tipo:
	{JSON}
	*/	
	PARAMETROS: {
		"mostraCoordenadasUTM":
		{idhtml:"localizarxy"},
		"mostraCoordenadasGEO":
		{idhtml:"localizarxy"},
		"mostraInserirKml":
		{idhtml:"inserirKml"},
		"mostraEscalaNumerica":
		{idhtml:"escala"},
		"mostraEscalaGrafica":
		{idhtml:"escalaGrafica"},
		"mostraBuscaRapida":
		{idhtml:"buscaRapida"},
		"mostraVisual":
		{idhtml:"visual"},
		"mostraQuadros":
		{idhtml:"lugarquadros"},
		"mostraHistoricoZoom":
		{idhtml:"historicozoom"},
		"mostraMenuSuspenso":
		{idhtml:"menus",deslocaEsquerda:0}
	},
	/*
	Function: mostraCoordenadasUTM
	
	Obtém as coordenadas UTM da posição do mouse sobre o mapa.
	
	As coordenadas são obtidas por meio de uma chamada AJAX.
	
	Para o funcionamento correto é necessário incluir essa função no evento que identifica quando o mouse
	está estacionado sobre o mapa. Por default isso já é feito pelo i3Geo.
	
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS (mostraCoordenadasUTM) ou altere a variável i3GEO.eventos.MOUSEPARADO
	
	Se i3GEO.gadgets.mostraCoordenadasUTM.idhtml for igual a i3GEO.gadgets.mostraCoordenadasGEO.idhtml
	
	os valores mostrados serão intercalados entre GEO e UTM
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS

	Return:
	
	{JSON} - objeto com x e y
	*/
	mostraCoordenadasUTM: function(id){
		if(arguments.length == 0 || id == "")
		{var id = i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml;}
		else
		{i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml = id;}
		var temp = $i(id);
		if (!temp){return;}
		atualizaCoordenadasUTM = function()
		{
			//if($i(i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml).style.display == "block"){return;}
			if(objposicaocursor.imgx < 10 || objposicaocursor.imgy < 10)
			{return;}
			if($i("wdoca")){return;}
			var tempUtm = function(retorno){
				//alert(retorno)
				var funcao = "";
				funcao += "$i(i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml).style.display='none';";
				funcao += "if(i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml == i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml)";
				funcao += "{$i(i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml).style.display='block';i3GEO.gadgets.mostraCoordenadasGEO();}";
				setTimeout(funcao,3400);
				var temp = $i(i3GEO.gadgets.PARAMETROS.mostraCoordenadasUTM.idhtml);
				if(retorno.data){
					temp.style.display="block";
					temp.innerHTML = "<div>UTM: x="+retorno.data.x+" y="+retorno.data.y+" zn="+retorno.data.zona+" "+retorno.data.datum+"</div>";
					//return (retorno.data);
				}
			};
			i3GEO.php.geo2utm(tempUtm,objposicaocursor.ddx,objposicaocursor.ddy);
		};
		if(i3GEO.eventos.MOUSEPARADO.toString().search("atualizaCoordenadasUTM()") < 0)
		{i3GEO.eventos.MOUSEPARADO.push("atualizaCoordenadasUTM()");}		
	},
	/*
	Function: mostraCoordenadasGEO
	
	Obtém as coordenadas Geográficas da posição do mouse sobre o mapa.
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS (localizarxy)
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/	
	mostraCoordenadasGEO: function(id){
		try{
			//
			//ativa o evento que preenche os campos de coordenadas
			//
			if(arguments.length == 0)
			{var id = i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml;}
			else
			{i3GEO.gadgets.PARAMETROS.mostraCoordenadasGEO.idhtml = id;}
			if($i(id)){
				if(!$i("xm")){
					var ins = "<table style='text-align:center'><tr>";
					ins += "<td>X:&nbsp;</td>";
					ins += "<td>"+$inputText(id,"315","xg","grau","3","-00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","xm","minuto","3","00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","xs","segundo","5","00.00")+"&nbsp;</td>";
					ins += "<td>Y:"+$inputText("","","yg","grau","3","-00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","ym","minuto","3","00")+"&nbsp;</td>";
					ins += "<td>"+$inputText("","","ys","segundo","5","00.00")+"</td>";
					var temp = 'var xxx = i3GEO.calculo.dms2dd($i("xg").value,$i("xm").value,$i("xs").value);';
					temp +=	'var yyy = i3GEO.calculo.dms2dd($i("yg").value,$i("ym").value,$i("ys").value);';
					temp +=	'i3GEO.navega.zoomponto(i3GEO.configura.locaplic,i3GEO.configura.sid,xxx,yyy);';		
					ins += "<td><img  class='tic' title='zoom' onclick='"+temp+"' src='"+i3GEO.util.$im("branco.gif")+"' id=procurarxy /></td>";
					ins += "</tr></table>";
					$i(id).innerHTML = ins;
					$i3geo_temp_xg = $i("xg");
					$i3geo_temp_xm = $i("xm");
					$i3geo_temp_xs = $i("xs");
					$i3geo_temp_yg = $i("yg");
					$i3geo_temp_ym = $i("ym");
					$i3geo_temp_ys = $i("ys");
					atualizaLocalizarxy = function(){
						try{
							var x = objposicaocursor.dmsx.split(" ");
							var y = objposicaocursor.dmsy.split(" ");
							$i3geo_temp_xg.value = x[0];
							$i3geo_temp_xm.value = x[1];
							$i3geo_temp_xs.value = x[2];
							$i3geo_temp_yg.value = y[0];
							$i3geo_temp_ym.value = y[1];
							$i3geo_temp_ys.value = y[2];
						}
						catch(m){};
					};
					if($i(i3GEO.interface.IDMAPA))
					{YAHOO.util.Event.addListener($i(i3GEO.interface.IDMAPA),"mousemove", atualizaLocalizarxy);}
				}
			}
		}
		catch(e){alert("mostraCoordenadasGeo: "+e.description);}
	},
	/*
	Function: mostraInserirKml
	
	Mostra no mapa a a opção para inserir kml.
	
	Essa opção só funciona com a API do Google carregada
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml
	*/		
	mostraInserirKml: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraInserirKml.idhtml;}
		if($i(id)){
			if(!$i("i3geo_urlkml")){
				var i = $inputText(id,"280","i3geo_urlkml","kml url","40","");
				var ins = "<table><tr><td>Kml: "+i;
				var temp = 'i3GEO.interface.googlemaps.adicionaKml(true);';
				ins += "</td><td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' onclick='"+temp+"' /></td></tr></table>";
				$i(id).innerHTML = ins;
			}
		}
	},
	/*
	Function: mostraEscalaNumerica
	
	Mostra no mapa a escala numérica.
	
	A escala numérica pode ser alterada pelo usuário digitando-se a nova escala.
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/		
	mostraEscalaNumerica: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraEscalaNumerica.idhtml;}
		if($i(id)){
			atualizaEscalaNumerica = function(escala){
				var e = $i("i3geo_escalanum");  
				if(!e){
					i3GEO.eventos.NAVEGAMAPA.remove("atualizaEscalaNumerica()");
					return;
				}
				if(arguments.length == 1)
				e.value = escala;
				else
				e.value = parseInt(i3GEO.parametros.mapscale);
			};
			if(!$i("i3geo_escalanum")){
				var i = $inputText(id,"155","i3geo_escalanum",$trad("d10"),"19",parseInt(i3GEO.parametros.mapscale));
				var ins = "<table><tr><td>1:"+i;
				var temp = 'var nova = document.getElementById("i3geo_escalanum").value;';
				temp += 'i3GEO.navega.aplicaEscala(i3GEO.configura.locaplic,i3GEO.configura.sid,nova);';
				ins += "</td><td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' onclick='"+temp+"' /></td></tr></table>";
				$i(id).innerHTML = ins;
			}
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizaEscalaNumerica()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("atualizaEscalaNumerica()");}		
		}
	},
	/*
	Function: mostraEscalaGrafica
	
	Mostra no mapa a escala grafica como um elemento fora do mapa.
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS(escala)
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/		
	mostraEscalaGrafica: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraEscalaGrafica.idhtml;}
		if($i(id)){
			atualizaEscalaGrafica = function(){
				var e = $i("imagemEscalaGrafica");  
				if(!e){
					i3GEO.eventos.NAVEGAMAPA.remove("atualizaEscalaGrafica()");
					return;
				}
				var temp = function(retorno){
				
					eval(retorno.data);
					i3GEO.gadgets.quadros.grava("escala",scaimagem);
					$i("imagemEscalaGrafica").src = scaimagem;
				};
				i3GEO.php.escalagrafica(temp);
			};
			if(!$i("imagemEscalaGrafica")){
				
				var ins = "<img class='menuarrow' src=\""+g_localimg+"/branco.gif\" title='op&ccedil;&otilde;es' onclick='i3GEO.mapa.dialogo.opcoesEscala()' style='cursor:pointer'/><img id=imagemEscalaGrafica src='' />"
				$i(id).innerHTML = ins;
			}
			atualizaEscalaGrafica();
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("atualizaEscalaGrafica()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("atualizaEscalaGrafica()");}		
		}
	},
	/*
	Function: mostraBuscaRapida
	
	Mostra a opção de busca rápida de lugares por palavra digitada.
		
	Se você não quer essa função no mapa, elimine o elemento HTML existente no mapa que contenha o 
	id definido em i3GEO.gadgets.PARAMETROS (buscaRapida)
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/	
	mostraBuscaRapida: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraBuscaRapida.idhtml;}
		if($i(id)){
			i3geo_buscaRapida = function(){
				if ($i("valorBuscaRapida").value == "")
				{alert ("Digite uma palavra para busca!");return;}
				wdocaf("300px","280px",i3GEO.configura.locaplic+"/ferramentas/buscarapida/index.htm","","","Busca rapida");
			}
			var i = $inputText(id,"200","valorBuscaRapida","digite o texto para busca","30",$trad("o2"));
			var ins = "<table><tr><td><a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=8&idajuda=71' >&nbsp;&nbsp;&nbsp;</a></td><td>"+i;
			ins += "</td><td><img src='"+i3GEO.util.$im("branco.gif")+"' class='tic' onclick='i3geo_buscaRapida()' /></td></tr></table>";
			var temp = $i(id);
			if(temp){
				temp.innerHTML = ins;
			}
		}	
	},
	/*
	Function: mostraHistoricoZoom
	
	Mostra na barra de zoom os ícones que controlam a visualização do histórico da navegação sobre o mapa
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraHistoricoZoom: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraHistoricoZoom.idhtml;}
		if($i(id)){
			marcadorZoom = "";
			var ins = "<table style='text-align:center;position:relative;left:";
			if(navm){ins += "0px;'>";}
			else
			{ins += "6px;'>";}
			ins += "<tr><td><img  id='i3geo_zoomanterior' class='zoomAnterior' title='anterior' src='"+i3GEO.util.$im("branco.gif")+"'  /></td>";
			ins += "<td>&nbsp;</td>";
			ins += "<td><img  id='i3geo_zoomproximo' class='zoomProximo' title='proximo' src='"+i3GEO.util.$im("branco.gif")+"'  /></td>";
			ins += "</tr></table>";
			$i(id).innerHTML = ins;
			$i("i3geo_zoomanterior").onclick = function(){
				if(marcadorZoom == ""){marcadorZoom = i3GEO.gadgets.quadros.quadroatual;}
				if(i3GEO.gadgets.quadros.quadroatual > 0){
					marcadorZoom = marcadorZoom - 1;
					if(marcadorZoom >= 0)
					i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[marcadorZoom].extensao);
					else
					marcadorZoom = 0;
				}
			};
			$i("i3geo_zoomproximo").onclick = function(){
				if(marcadorZoom == ""){marcadorZoom = i3GEO.gadgets.quadros.quadroatual;}
				if(i3GEO.gadgets.quadros.quadroatual < i3GEO.gadgets.quadros.quadrosfilme.length){
					marcadorZoom = marcadorZoom + 1
					if(marcadorZoom < i3GEO.gadgets.quadros.quadrosfilme.length)
					i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[marcadorZoom].extensao);
				}
				else
				marcadorZoom = i3GEO.gadgets.quadros.quadrosfilme.length;
			};
		}
	},
	/*
	Classe: i3GEO.gadgets.visual
	
	Gera os ícones e controla as opções de modificação do visual do mapa.
	
	O visual consiste na definição dos ícones utilizados no mapa. O visual pode
	ser modificado na inicialização ou então escolhido pelo usuário.
	
	Os visuais disponíveis são definidos no servidor e consistem em diretórios localizados
	em i3geo/imagens/visual. A lista de visuais disponíveis é obtida na inicialização do i3geo.
	
	Os ícones para mudança do visual são incluídos no elemento HTML definido em
	i3geo.gadgets.PARAMETROS.visual
	*/
	visual: {
		/*
		Function: inicia
		
		Constrói os ícones de escolha do visual.
		
		Parametro:
		
		id {String} - id do elemento que receberá os ícones (opcional)
		*/
		inicia: function(id){
			if(arguments.length == 0)
			{var id = i3GEO.gadgets.PARAMETROS.mostraVisual.idhtml;}
			if($i(id)){
				if (i3GEO.parametros.listavisual != ""){
					var l = i3GEO.parametros.listavisual.split(",");
					var visuais = "";
					var li = l.length-1;
					if(li >= 0){
						do{visuais += "<img title='"+l[li]+"' style=cursor:pointer onclick='i3GEO.gadgets.visual.troca(\""+l[li]+"\")' src='"+i3GEO.configura.locaplic+"/imagens/visual/"+l[li]+".png' />&nbsp;";}
						while(li--)
					}
					$i(id).innerHTML = visuais;
					$i(id).onmouseover = function(){i3GEO.ajuda.mostraJanela($trad("d26"));};
					$i(id).onmouseout = function(){i3GEO.ajuda.mostraJanela("");};
				}		
			}
		},
		/*
		Function: troca
		
		Troca o visual atual. A lista de visuais disponíveis é obtida em i3GEO.parametros.listavisual
		
		Parametro:
		
		visual {String} - nome do visual que será utilizado.
		*/
		troca: function(visual){
			var monta = function(retorno){
				try{
					i3GEO.janela.fechaAguarde("i3GEO.atualiza");
					//
					//pega todas as imagens da interface
					//
					var imgstemp = retorno.data.arquivos;
					var imgs = new Array();
					var i = imgstemp.length-1;
					if(i >= 0){
						do{
							var temp = imgstemp[i].split(".");
							if ((temp[1] == "png") || (temp[1] == "gif") || (temp[1] == "jpg"))
							{imgs.push(imgstemp[i]);}
						}
						while(i--)
					}
					var elementos = document.getElementsByTagName("img");
					var elt = elementos.length;
					var caminho = i3GEO.configura.locaplic+"/imagens/visual/"+visual+"/";
					//faz a troca em imagens
					var j = imgs.length-1;
					if(j >= 0){
						do{
							for (var i=0;i < elt; i++){
								if ((elementos[i].src.search("branco") > -1) && ((elementos[i].className != "") || (elementos[i].id != "")))
								{elementos[i].src = caminho+"branco.gif";}
								if (elementos[i].src.search("visual") > -1)
								{elementos[i].style.backgroundImage = "url('"+caminho+imgs[j]+"')";}
							}
						}
						while(j--)
					}	
					//faz a troca em ids
					var j = imgs.length-1;
					if(j >= 0){
						do{
							var busca = imgs[j].split(".");
							if ($i(busca[0]))
							{$i(busca[0]).src = caminho+imgs[j];}
						}
						while(j--)
					}
					//faz a troca em bg
					var elementos = new Array("barraSuperior","barraInferior","vertMaisZoom","vertMenosZoom","foldermapa","foldermapa1","tic");
					var i = elementos.length-1;
					if(i >= 0){
						do{
							if ($i(elementos[i])){
								var nimagem = $i(elementos[i]).style.backgroundImage.replace(i3GEO.configura.visual,visual);
								$i(elementos[i]).style.backgroundImage = nimagem;
								//$i(elementos[i]).style.backgroundImage = "url('"+caminho+"sprite.png')";
							}
						}
						while(i--)
					}
					i3GEO.configura.visual = visual;
				}
				catch(e){alert("Ocorreu um erro. mudaVisual"+e);i3GEO.janela.fechaAguarde("i3GEO.atualiza");}
			};
			//
			//pega a lista de imagens no diretório do i3geo correspondente ao visual selecionado
			//
			i3GEO.janela.abreAguarde("i3GEO.atualiza",$trad("o1"));
			i3GEO.php.listaarquivos(monta,"imagens/visual/"+visual);
		}
	},
	/*
	Classe: i3GEO.gadgets.quadros
	
	Cria e controla o funcionamento dos quadros de animação.
	
	Os quadros são mostrados no mapa como uma sequência de quadros de um filme.
	As imagens que são produzidas no mapa são armazenadas em cada quadro, permitindo sua recuperação.
	
	Os quadros armazenam também a extensão geográfica de cada imagem, permitindo sua recuperação.
	*/
	quadros: {
		/*
		Variavel: quadrosfilme
		
		Armazena cada quadro individualmente com as suas propriedades
		
		Tipo:
		{Array}
		*/
		quadrosfilme: new Array(),
		/*
		Variavel: quadroatual
		
		Valor do índice do quadro atual
		
		Tipo:
		{Integer}
		*/
		quadroatual: 0,
		/*
		Function: inicia
		
		Gera os quadros e inicializa os objetos para armazenar as imagens
		
		Parametros:
		
		qs {Integer} - número de quadros
		
		lugarquadros {String} - id do elemento HTML que receberá os quadros (opcional)
		*/
		inicia: function(qs,lugarquadros){
			if(arguments.length == 1)
			{var lugarquadros = i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml;}
			var q = "<table class=tablefilme ><tr><td><div class='menuarrow'  title='op&ccedil;&otilde;es' onclick='i3GEO.gadgets.quadros.opcoes(this)' style='cursor:pointer'></div></td>";
			for (var i = 0; i < qs; i++){
				q += "<td><img class='quadro' src=\""+i3GEO.configura.locaplic+"/imagens/branco.gif\" id='quadro"+i+"' ";
				q += "onmouseover='i3GEO.gadgets.quadros.trocaMapa(this.id);i3GEO.ajuda.mostraJanela(\"Clique para aplicar a extensão geográfica do quadro ao mapa\")' ";
				//q += "onmouseout="+ saida; //\"javascript:i3GEO.ajuda.mostraJanela('')\" ";
				q += "onclick='i3GEO.gadgets.quadros.zoom(this.id)' /></td>";
				i3GEO.gadgets.quadros.quadrosfilme[i] = new Array();
			}
			q += "</tr></table>";
			if($i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml)){
				document.getElementById(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml).innerHTML = q;
				$i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml).onmouseout = function(){
					$i("img").style.display = "block";
					if($i("imgClone")){
						var temp = $i("imgClone");
						var p = temp.parentNode;
						p.removeChild(temp);
						i3GEO.ajuda.mostraJanela('');
					}
				};
			}
			i3GEO.gadgets.quadros.quadroatual = 0;
			if(i3GEO.eventos.NAVEGAMAPA.toString().search("i3GEO.gadgets.quadros.avanca()") < 0)
			{i3GEO.eventos.NAVEGAMAPA.push("i3GEO.gadgets.quadros.avanca()");}
		},
		/*
		Function: grava

		Armazena um determinado valor em uma determinada característica de um objeto quadro.

		Parametros:

		variavel {String} - parâmetro do objeto quadro.

		valor - {String} valor que será aplicado.
		*/
		grava: function(variavel,valor){
			eval("i3GEO.gadgets.quadros.quadrosfilme["+i3GEO.gadgets.quadros.quadroatual+"]."+variavel+" = '"+valor+"'");
			if($i(i3GEO.gadgets.PARAMETROS.mostraQuadros.idhtml))
			{$i("quadro"+i3GEO.gadgets.quadros.quadroatual).className = "quadro1";}
		},
		/*
		Function: avanca

		Avança um quadro na lista de quadros, mudando a imagem utilizada na sua representação.
		*/		
		avanca: function(){
			try{
				var nquadros = i3GEO.gadgets.quadros.quadrosfilme.length;
				if ((nquadros - 1) == (i3GEO.gadgets.quadros.quadroatual))
				{i3GEO.gadgets.quadros.inicia(nquadros);}
				else{i3GEO.gadgets.quadros.quadroatual++;}
			}
			catch(e){var e = "";}		
		},
		/*
		Function: zoom
		
		Aplica o zoom no mapa para a extensão geográfica armazenada em um quadro
		
		Parametro:
		
		quadro {String} - id do quadro que será utilizado
		*/
		zoom: function(quadro){
			var indice = quadro.replace("quadro","");
			i3GEO.navega.zoomExt(i3GEO.configura.locaplic,i3GEO.configura.sid,"",i3GEO.gadgets.quadros.quadrosfilme[indice].extensao)
		},
		/*
		Function: trocaMapa
		
		Troca a imagem do mapa atual pela que estiver armazenada em quadro
		
		A imagem mostrada no mapa é um clone do mapa atual, preservando o mapa.
		
		Parametro:
		
		quadro {String} - id do quadro que terá a imagem recuperada
		*/
		trocaMapa: function(quadro){
			var indice = quadro.replace("quadro","");
			var i = $i("img");
			var c = $i("imgClone");
			if(i){
				if(!c){
					var iclone=document.createElement('IMG');
					iclone.style.position = "relative";
					iclone.id = "imgClone";
					iclone.style.border="1px solid blue";
					i.parentNode.appendChild(iclone);
					iclone.src = i.src;
					iclone.style.width = i3GEO.parametros.w;
					iclone.style.heigth = i3GEO.parametros.h;
					iclone.style.top = i.style.top;
					iclone.style.left = i.style.left;
					var c = $i("imgClone");		
				}
				try{
					if(!i3GEO.gadgets.quadros.quadrosfilme[indice].imagem){return;}
					c.src = i3GEO.gadgets.quadros.quadrosfilme[indice].imagem;
					c.style.display = "block";
					i.style.display = "none";
				}
				catch(e){var e = "";}
			}
		},
		/*
		Function: opcoes
		
		Abre a janela de opções que controla as características do quado e permite disparar a animação.
		
		Parametro:
		
		obj {Object} - objeto clicado
		*/
		opcoes: function(obj){
			if (i3GEO.parametros.utilizacgi == "sim"){
				i3GEO.parametros.utilizacgi = "nao";
				var volta = function(){
					alert("Armazenamento de imagens ativado. As proximas imagens ficarao disponiveis");
				};
				i3GEO.php.desativacgi(volta);
			}
			else
			{i3GEO.janela.cria("150px","150px",i3GEO.configura.locaplic+"/ferramentas/opcoes_quadros/index.htm","center","","Quadros <a class=ajuda_usuario target=_blank href='"+i3GEO.configura.locaplic+"/ajuda_usuario.php?idcategoria=6&idajuda=54' >&nbsp;&nbsp;&nbsp;</a>");}
		},
		/*
		Function: anima
		
		Mostra as imagens armazenadas nos quadros em uma sequência animada
		
		Parametros:
		
		Qanima {Integer} - quadro atual na sequência de animação
		
		t {Numeric} - tempo em milisegundos entre cada quadro
		*/
		anima: function(Qanima,t){
			if(arguments.length == 0){
				Qanima = 0;
				var doc = (navm) ? document.frames("wdocai").document : $i("wdocai").contentDocument;
				var t = doc.getElementById("tempoanima").value;
			}
			if(Qanima > i3GEO.gadgets.quadros.quadrosfilme.length){
				clearTimeout(tAnima);
				$i("imgClone").style.display = "none";	
				$i("img").style.display="block";
				return;
			}
			//$i("img").src = preLoad[janima].src;
			//$i("f"+janima).className = "quadro1";
			i3GEO.gadgets.quadros.trocaMapa("quadro"+Qanima);
			Qanima++;
			tAnima = setTimeout('i3GEO.gadgets.quadros.anima('+Qanima+','+t+')',t);
		},
		/*
		Function: listaImagens
		
		Lista as imagens armazenadas em uma nova página no navegador
		*/
		listaImagens: function(){
			if (i3GEO.parametros.utilizacgi == "sim"){
				i3GEO.parametros.utilizacgi = "nao";
				var volta = function()
				{alert("Armazenamento de imagens ativado. As proximas imagens ficarao disponiveis");};
				i3GEO.php.desativacgi(volta);
			}
			else{
				var wi = window.open("");//"",null,"width=550,height=650,resizable=yes,scrollbars=yes");
				//pega os dados do objeto quadrosfilme e escreve na nova janela
				var mensagem = "<br><b>N&atilde;o existem imagens guardadas.";
				wi.document.write("<html><body><p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Click com o bot&atilde;o da direita do mouse sobre a imagem para fazer o download<br>");	
				var i = i3GEO.gadgets.quadros.quadrosfilme.length-1;
				if(i >= 0){
					do{
						if (i3GEO.gadgets.quadros.quadrosfilme[i].imagem){
							wi.document.write("<p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Imagem: "+i+"<br>");
							wi.document.write("<p style='font-size: 12px; font-family: verdana, arial, helvetica, sans-serif;'>Abrangência: "+i3GEO.gadgets.quadros.quadrosfilme[i].extensao+"<br>");
							wi.document.write("<img src='"+i3GEO.gadgets.quadros.quadrosfilme[i].imagem+"' />");
							wi.document.write("<img src='"+i3GEO.gadgets.quadros.quadrosfilme[i].referencia+"' />");
							wi.document.write("<img src='"+i3GEO.gadgets.quadros.quadrosfilme[i].legenda+"' />");
						}
						i--
					}
					while(i>=0)
				}
				wi.document.write("<br>Fim</body></html>");
			}
		}
	},
	/*
	Function: mostraMenuSuspenso
	
	Mostra o menu suspenso com opções extras de análise, ajuda, etc
	
	O objeto YAHOO.widget.MenuBar resultante pode ser obtido na variável i3GEOoMenuBar

	O conteúdo do menu é baseado na variável i3GEO.configura.oMenuData
	
	Parametro:
	
	id {String} - id do elemento HTML que receberá o resultado. Esse id por default é obtido de
	i3GEO.gadgets.PARAMETROS
	*/
	mostraMenuSuspenso: function(id){
		if(arguments.length == 0)
		{var id = i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.idhtml;}
		else
		{i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.idhtml = id;}
		var objid = $i(id);
		if(objid){
			objid.className="yuimenubar";
			if($i("contemMenu")){
				$i("contemMenu").className="yui-navset";
			}
			//default dos cabeçalhos se a variável i3GEO.configura.oMenuData.menu não existir
			if(!i3GEO.configura.oMenuData.menu){
				var ins = "";
				ins += '<div class="bd" style="display:block;align:right;border: 0px solid white;z-index:6000;line-height:1.4" >';
				ins += '<ul class="first-of-type" style="display:block;border:0px solid white;top:10px;">';
 				var sobe = "";
 				if(navn){var sobe = "line-height:0px;";}
				ins += '<li class="yuimenubaritem" style="padding-bottom:5px" ><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuajuda" >&nbsp;&nbsp;'+$trad("s1")+'</a></li>';
				ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuanalise" >&nbsp;&nbsp;'+$trad("s2")+'</a></li>';
 				ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menujanelas" >&nbsp;&nbsp;'+$trad("s3")+'</a></li>';
 				ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuarquivos" >&nbsp;&nbsp;'+$trad("s4")+'</a></li>';
 				ins += '<li class="yuimenubaritem" style="padding-bottom:5px"><a style="border: 0px solid white;" href="#" class="yuimenubaritemlabel" id="menuinterface" >&nbsp;&nbsp;'+$trad("d27")+'</a></li>';
 				ins += '</ul>'; 
 				ins += '</div>';
 				objid.innerHTML=ins;
 			}
 			else{
 				var ins = "";
 				var alinhamento = "";
 				if(i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda){
 					var alinhamento = "left:"+i3GEO.gadgets.PARAMETROS.mostraMenuSuspenso.deslocaEsquerda*-1+"px;";
 				}
				ins += '<div class="bd" style="top:0px;'+alinhamento+'display:block;align:right;border: 0px solid white;z-index:6000;line-height:1.4" >';
				ins += '<ul class="first-of-type" style="display:block;border:0px solid white;top:10px;">';
 				var n = i3GEO.configura.oMenuData.menu.length;
 				for(i = 0;i < n;i++){
 					if(i3GEO.parametros.w < 550){
 						i3GEO.configura.oMenuData.menu[i].id = "";
 						var estilo = "padding-bottom:3px;top:0px;border: 0px solid white;";
 					}
 					else
 					var estilo = "padding-bottom:3px;top:0px;border: 0px solid white;";
 					var t = "";
 					if(i3GEO.configura.oMenuData.menu[i].target)
 					{var t = "target="+i3GEO.configura.oMenuData.menu[i].target;}
 					ins += '<li class="yuimenubaritem" style="padding-top:2px;"><a style="'+estilo+'" href="#" class="yuimenubaritemlabel" '+t+'id="menu'+i3GEO.configura.oMenuData.menu[i].id+'" >&nbsp;'+i3GEO.configura.oMenuData.menu[i].nome+'</a></li>'; 				
 				}
 				ins += '</ul>'; 
 				ins += '</div>';
 				objid.innerHTML=ins;
 			}
			var onMenuBarBeforeRender = function (p_sType, p_sArgs){
				if(i3GEO.parametros.w >= 500)
				{var conta = 0;}
				else
				{var conta = 0;}
				for(var nomeMenu in i3GEO.configura.oMenuData.submenus){
					if(i3GEO.configura.oMenuData.submenus[nomeMenu] != "")
					i3GEOoMenuBar.getItem(conta).cfg.setProperty('submenu',{id:nomeMenu,itemdata: i3GEO.configura.oMenuData.submenus[nomeMenu]});
					var conta=conta+1;
				}
			}
 			i3GEOoMenuBar=new YAHOO.widget.MenuBar(id,{autosubmenudisplay: true, showdelay: 100, hidedelay: 500, lazyload: false});
 			i3GEOoMenuBar.beforeRenderEvent.subscribe(onMenuBarBeforeRender);
 			i3GEOoMenuBar.render();
			//
			//corrige problemas de estilo
			//
			var temp = objid.style;
			temp.backgroundPosition = "0px -1px";
			if(navn)
			temp.border = "0px solid white";
			else
			temp.border = "1px dotted white";
		}
	}
};
//YAHOO.log("carregou classe gadgets", "Classes i3geo");
