if (typeof (i3GEO) === 'undefined') {
	var i3GEO = {};
}
i3GEO.pluginI3geo = {
	inicia : function(tipo, parametros) {
		i3GEO.pluginI3geo[tipo](parametros);
	},
	heatmap : function(parametros) {
		alert(parametros.coluna);
	}
}