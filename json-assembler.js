(function($){
/**
 * recurssive method to follow the hierarchy based on the attribute's name
 * @param name - name of the inner object attribute
 * @param value - value of the inner object attribute field
 * @param currentJson - json to receive the values
 * @returns {currentJson}
 */
function returnFilledJson(name, value, currentJson){
	var nivel = name.substr(0, name.indexOf("."));
	var nextNivel = name.substr(name.indexOf(".")+1);
	if(currentJson == undefined){
		currentJson = {};
	}
	if(nivel.length > 0){
		currentJson[nivel] = returnFilledJson(nextNivel, value);
	}else{
		currentJson[nextNivel] = value;
	}
	return currentJson;
	
}
	/**
 * @param atributos: list with the fileds or elements to create a json
 * @param fieldOnly: true - to a list containing only the fields, input, select or text area; false - to a list with a table's trs as:
 *<tr>
 *	<td>label:</td>
 *	<td><input type="text" name="fieldName"/>
 *</tr>
 * @return JSON: Json fully assembled with inner json objects
 * Para o dwr converter corretamente os campos o atritubo "name" na jsp devem estar 
 * com o mesmo nome da classe java e para atributos que são representados por objetos
 * devem estar separados por '.', exemplo name="planoSaude.cdDomino"
 * o atributo planoSaude do tipo DominioFaixa da classe que receberá o jSON tem um atributo cdDominio que será populado
 * outro exemplo name="campanhaFuncionario.bloqueio.cdDominio" a classe deve conter um atributo campanhaFuncionario 
 * que este deverá conter um atributo bloqueio e este um atributo cdDominio.
 */
$.assembleJSON = function (atributos, fieldOnly){
	var JSON = {};
	for(var j = 0, length = atributos.length; j < length; j++){
		var att = atributos[j];
		if(!fieldOnly){
			att = $(att).children().last().children();
		}
		var obj = $(att).each(function(){
			if(this.tagName.toLowerCase() == "select" ||
			   this.tagName.toLowerCase() == "input" ||
			   this.tagName.toLowerCase() == "textarea"){
				switch($(this).attr("type").toLowerCase()){
				case "radio":
				case "checkbox":
				{
					if($(this).attr("checked")){
						var name = $(this).attr("name");
						var value = $(this).val();
						JSON[name] = value;
					}
				}break;
				case "hidden":
				{
					var name = $(this).attr("name");
					if(name.indexOf(".") > -1){
						JSON[name.substr(0,name.indexOf("."))] = returnFilledJson(name.substr(name.indexOf(".")+1), $(this).val(), JSON[name.substr(0,name.indexOf("."))]);
					}else{
						var value = $(this).val();
						JSON[name] = value;
					}
				}
				break;
				case "button":
				case "submit": break;
				default:
				{
					var name = $(this).attr("name");
					if(name.indexOf(".") > -1 && $(this).filter(":visible").length > 0){
						JSON[name.substr(0,name.indexOf("."))] = returnFilledJson(name.substr(name.indexOf(".")+1), $(this).val(), JSON[name.substr(0,name.indexOf("."))]);
					}else if($(this).filter(":visible").length > 0){
						var value = $(this).val();
						JSON[name] = value;
					}
				}
				}
			}
		});
	}
	return JSON;
}
})(jQuery);