<?php
define ( "ONDEI3GEO", "../../.." );
include ("exec.php");

include "../../head.php";
?>
	<div class="container-fluid migalha" >
		<div class="row">
			<div class="btn-group btn-breadcrumb">
				<a class="btn btn-default" href="../../../init/index.php"><span>i3Geo</span></a>
				<a class="btn btn-default" href="../../index.php"><span>Admin</span></a>
				<a class="btn btn-default" style="pointer-events: none"><span>Upload</span></a>
				<a class="btn btn-default" style="pointer-events: none"><span>s&iacute;mbolo</span></a>
			</div>
		</div>
	</div>

<div class="container-fluid">
	<div class="row">
	<iframe src="../../../admin/html/subirsimbolo.html" style="width:100%; height:5000px;border:none; scrolling:no; frameborder:0;  marginheight:0; marginwidth:0;" ></iframe>
</div>
</div>
<script>
	$(document).ready(function(){
		//vem de admin/index.js
		iniciaMenuPrincipal();
		$('ul.dropdown-menu [data-toggle=dropdown]').on('click', function(event) {
			event.preventDefault();
			event.stopPropagation();
			$(this).parent().siblings().removeClass('open');
			$(this).parent().toggleClass('open');
		});
		$.material.init();
	});
</script>
</body>
</html>
