(function(){
	var scripts = document.getElementsByTagName('script'),
		i = scripts.length,
		script,
		nsString,
		nsPart,
		targetObject = this,
		patternity;
		
	while(i--){
		script = scripts[i];
		if(script.src.indexOf('patternity' !== -1)){
			nsString = script.getAttribute('data-namespace');
			if(nsString && nsString !== 'this'){
				nsString = nsString.split('.');
				while(nsPart = nsString.shift()){
					if(!targetObject[nsPart]){
						targetObject[nsPart] = {};
					}
					targetObject = targetObject[nsPart];
				}
				
			}
			
			break;
		}
	}
	patternity = targetObject;