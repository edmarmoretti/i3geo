/*
======================================================================
ddcolorposter.js: By Dynamic Drive (http://www.dynamicdrive.com)
Communicates between Yahoo Color Picker and form fields on your page
Created: Feb 20th, 06'
======================================================================
*/

function executeonload(functionref){
	if (window.addEventListener)
		window.addEventListener("load", functionref, false)
	else if (window.attachEvent)
		window.attachEvent("onload", functionref)
	else if (document.getElementById)
		window.onload=functionref
}

var ddcolorposter={
initialize:function(r,g,b, hexvalue){
	this.rvalue=r //store red value
	this.gvalue=g //store green value
	this.bvalue=b //store blue value
	this.hexvalue=hexvalue //store combined hex value
	if (typeof this.targetobj!="undefined"){
		this.targetobj.value=this.hexvalue //set field to selected hex color value
		if (typeof this.divobj!="undefined") //set adjacent div to selected hex color value
			this.divobj.style.backgroundColor="#"+this.hexvalue
	}
},
echocolor:function(inputobj, divID){
	this.targetobj=inputobj
	this.divobj=document.getElementById(divID)
	this.targetobj.onblur=function(){
	if (inputobj.value.search(/^[a-zA-Z0-9]{6}$/)!=-1) //if field contains valid hex value
		document.getElementById(divID).style.backgroundColor="#"+inputobj.value
	}
},
fillcolorbox:function(inputID, divID){
	var inputobj=document.getElementById(inputID)
	if (inputobj.value.search(/^[a-zA-Z0-9]{6}$/)!=-1) //if field contains valid hex value
		document.getElementById(divID).style.backgroundColor="#"+inputobj.value
}
}