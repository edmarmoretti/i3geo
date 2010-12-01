<?php
session_name("openid");
session_start();
require_once('config.php');
?>
<html>
<div id="fb-root"></div>
<script src="http://connect.facebook.net/en_US/all.js"></script>
<body onload="inicia()">
<script>
	function inicia(){
		FB.init({appId: '<?php echo FACEBOOK_APP_ID;?>', status: true, cookie: true, xfbml: true});

		FB.login(function(response) {
		  if (response.session) {
			FB.api('/me',
			  function(response) {
				window.location.href = "callback.php?openid_identifier="+response.link+"&openidnome="+response.name;
			  }
			);
		  } else {
			window.location.href = "clearsessions.php";
		  }
		});
	}
</script>
</body>
</html>