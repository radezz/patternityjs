(function($NS, $Global){
	
	var toString = Object.prototype.toString,
		checkFor = {
		'Function': 1,
		'Undefined': 1,
		'Null': 1,
		'String': 1,
		'Array': 1,
		'Object': 1,
		'Math': 1,
		'Date': 1,
		'Boolean': 1,
		'Number': 1,
		'RegExp': 1,
		'JSON': 1,
		'Arguments': 1
	},
	check = {}, 
	key;
	
	//create s list of type checkers
	function createChecker(objectType){
		var typeString = ["[object ", objectType, "]"].join("");
		return function(object){
			return toString.call(object) === typeString;
		};
	}

	for(key in checkFor){
		if(checkFor.hasOwnProperty(key)){
			check["is" + key] = createChecker(key);
		}
	}
	
	//create utils 
	(function(){
		
		var isArray = check.isArray,
			isObject = check.isObject,
			isUndefined = check.isUndefined;
		
		function getType(object){
			var stringified = toString.call(object);
			return stringified.substring(8,stringified.length-1);
		}
		
		function createNS(namespace, apply){
			var ns = namespace.split('.'),
				nsPart = ns.shift(),
				targetObject = $Global; //this needs to refer to global
			
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
				if(isArray(source)){
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
	    
	    function isImplementing(target, implement){
			var targetProperty, 
				key, 
				i, 
				l;
			
			if (isArray(implement)) {
				for ( i = 0, l = implement.length; i < l; i++) {
					if (!isImplementing(target, implement[i])) {
						return false;
					}
				}
				
				return true;
			
			} else if (isObject(implement)) {
				for (key in implement) {
					if(implement.hasOwnProperty(key)){
						targetProperty = target[key];
						if (isUndefined(targetProperty) || getType(targetProperty) !== getType(implement[key])) {
							return false;
						}
					}
				}

				return true;
			}
	    }
	    
	    function pairCall(fn, pairArgs, context){
	        var key;
	            
	        if(check.isFunction(fn) && check.isObject(pairArgs)){
	            for(key in pairArgs){
	                if(pairArgs.hasOwnProperty(key)){
	                    fn.call(context, key, pairArgs[key]);
	                }
	            }
	            return true;
	        }
	        
	        return false;
	    }
	    
	    
	    function isDefined(object){
			return object !== null && object !== undefined;
	    }
		
		$NS.patternUtils = mixin(check ,{
			createNS: createNS,
			extend: extend,
			mixin: mixin,
			pairCall: pairCall,
			isImplementing: isImplementing,
			isDefined: isDefined,
			getType: getType
		});
		
	}());	
}(patternity, this));
