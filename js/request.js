if (typeof (i3GEO) === 'undefined') {
    var i3GEO = {};
}
i3GEO.request =
{
	/*
	 i3GEO.request.get({
        	 snackbar: true,
        	 snackbarmsg: false,
        	 btn: false,
        	 par: {},
        	 prog: "",
        	 fn: false
	 });
	 */
	get: function({snackbar = true, snackbarmsg = false, btn = false, par = {}, prog = "", fn = false} = {}){
	    if (typeof (console) !== 'undefined')
		console.log('%c ---> i3GEO.request.get() ' + prog, 'background: #222; color: #bada55');

	    i3GEO.janela.abreAguarde();
	    if(btn){
		btn = $(btn);
		btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    }
	    if(i3GEO.janela._formModal){
		i3GEO.janela._formModal.block();
	    }
	    par.g_sid = i3GEO.configura.sid;
	    $.get(
		    i3GEO.configura.locaplic + prog,
		    par
	    )
	    .done(
		    function(data, status){
			if(i3GEO.janela._formModal){
			    i3GEO.janela._formModal.unblock();
			}
			i3GEO.janela.fechaAguarde();
			if(btn){
			    btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			}
			if(snackbar){
			    if(snackbarmsg == false){
				snackbarmsg = $trad('feito');
			    }
			    i3GEO.janela.snackBar({content: snackbarmsg});
			}
			if(fn){
			    fn(data);
			}
		    }
	    )
	    .fail(
		    function(data){
			if(i3GEO.janela._formModal){
			    i3GEO.janela._formModal.unblock();
			}
			i3GEO.janela.fechaAguarde();
			if(btn){
			    btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			}
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	},
	post: function({snackbar = true, snackbarmsg = false, btn = false, par = {}, prog = "", fn = false} = {}){
	    if (typeof (console) !== 'undefined')
		console.log('---> i3GEO.request.post() ' + prog, 'background: #222; color: #bada55');

	    i3GEO.janela.abreAguarde();
	    if(btn){
		btn = $(btn);
		btn.prop("disabled",true).find("span .glyphicon").removeClass("hidden");
	    }
	    i3GEO.janela._formModal.block();
	    par.g_sid = i3GEO.configura.sid;
	    $.post(
		    i3GEO.configura.locaplic + prog,
		    par
	    )
	    .done(
		    function(data, status){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			if(btn){
			    btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			}
			if(snackbar){
			    if(snackbarmsg == false){
				snackbarmsg = $trad('feito');
			    }
			    i3GEO.janela.snackBar({content: snackbarmsg});
			}
			if(fn){
			    fn(data);
			}
		    }
	    )
	    .fail(
		    function(data){
			i3GEO.janela._formModal.unblock();
			i3GEO.janela.fechaAguarde();
			if(btn){
			    btn.prop("disabled",false).find("span .glyphicon").addClass("hidden");
			}
			i3GEO.janela.snackBar({content: data.statusText, style:'red'});
		    }
	    );
	}
};