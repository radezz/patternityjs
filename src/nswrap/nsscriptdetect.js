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
			nsString = script.getAttribute('data-namespace') || 'py';
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
	
	/**
	 * Global function returns patternity root object namespace
	 * @name pyGetRoot
	 * @function
	 * @returns {String} patternity namespace
	 */
    this.pyGetRoot = function(){
        return patternity;
    }