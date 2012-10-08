(function($NS){
	
	function createNS(namespace, apply){
		var ns = namespace.split('.'),
			nsPart = ns.shift(),
			targetObject = this; //this needs to refer to global
		
		while(nsPart){
			if(!targetObject[nsPart]){
				targetObject[nsPart] = {};
			}
			
			if(ns.length === 0 && apply){
				targetObject[nsPart] = apply;
			}
			
			targetObject = targetObject[nsPart];	
			nsPart = ns.shift();
		}
		
		return targetObject;
	}	
	
	function extend(construct, parent){
        var Extends = function(){};
        Extends.prototype = parent.prototype;
        construct.prototype = new Extends();
        construct.prototype._parent = parent.prototype;
    }
    
    function mixin(target, source){
        var key,
            i,
            l;
        if(target && source){
        	if(source instanceof Array){
	            for(i=0, l=source.length; i<l; i++){
	                mixin(target, source[i]);
	            }
	        }else{
	            for(key in source){
	                if(source.hasOwnProperty(key)){
	                    target[key] = source[key];
	                }
	            }
	        }
	        
	        return target;
        }    
    }
	
	$NS.patternUtils = {
		createNS: function(ns, apply){
			createNS(ns, apply);
		},
		extend: extend,
		mixin: mixin
	};

}(patternity));
