(function(nsString){
	var nsPart,
		targetObject = this,
		patternity;
	if(nsString && typeof(nsString) === 'string'){
		nsString = nsString.split('.');
		while(nsPart = nsString.shift()){
			if(!targetObject[nsPart]){
				targetObject[nsPart] = {};
			}
			targetObject = targetObject[nsPart];
		}
	}
	patternity = targetObject;