(function($NS, $UTIL){
    
    var KeyProperties = {
        'Extends': 1,
        'Implements' : 1,
        'Mixin': 1
    },
    typeofObject = "object",
    typeofFunction = "function";
    
	function createNS(namespace, apply){
		var namespace = namespace.split('.'),
			nsPart = namespace.shift(),
			targetObject = this; //this needs to refer to global
		
		while(nsPart){
			if(!targetObject[nsPart]){
				targetObject[nsPart] = {};
			}
			
			if(namespace.length === 0 && apply){
				targetObject[nsPart] = apply;
			}
			
			targetObject = targetObject[nsPart];	
			nsPart = namespace.shift();
		}
		
		return targetObject;
	}
	
    function mixinProto(construct, definition){
        var key;
        for(key in definition){
            if(definition.hasOwnProperty(key) && !KeyProperties[key]){
                construct.prototype[key] = definition[key];    
            }
        }
    }
    
    function mixin(target, source){
        var key,
            i,
            l;
            
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
    
    function extend(construct, parent){
        var Extends = function(){};
        Extends.prototype = parent.prototype;
        construct.prototype = new Extends();
        construct.prototype._parent = parent.prototype;
    }
    
    function isImplementing(construct, implement, nsOrDefinition){
        var key,
            implementsProto,
            implType = typeof(implement),
            implementsErr,
            checkFor,
            i = 0,
            l;
            
        if(implement instanceof Array){
            for(i=0, l=implement.length; i<l; i++){
                if(!isImplementing(construct, implement[i])){
                    return false
                }
            }
        }else{
            if(implType === typeofFunction || implType === typeofObject){
                checkFor = (implType === typeofFunction) ? implement.prototype : implement;
                for(key in checkFor){
                    if(checkFor.hasOwnProperty(key)){
                        if(typeof(checkFor[key]) === typeofFunction && !construct.prototype[key]){
                            implementsErr = "Implementation for " + key + "() is missing: " + ((nsOrDefinition) ? nsOrDefinition : "");
                            throw new Error(implementsErr);
                        }
                    }
                }    
            }
        }
        
        return true;  
    }
        
    function ClassObject(nsOrDefinition, definition){  
        
        var ns,
            construct;
        
        if(typeof(nsOrDefinition) === 'string'){
            ns = nsOrDefinition;
            if(!definition || typeof(definition) !== typeofObject){
                throw 'object definition required when namespace provided';
            }
        }else if(!nsOrDefinition || typeof(nsOrDefinition) !== typeofObject){
            throw 'parameter needs to be an object or namespace string';
        }else{
            definition = nsOrDefinition;
        }
        
        construct = function(){
            if(typeof(definition.construct) === typeofFunction){
                definition.construct.apply(this, arguments);
            }
        };
        
        if(typeof(definition.Extends) === typeofFunction){
            extend(construct, definition.Extends);
        }
        
        mixinProto(construct, definition);
        
        if(definition.Mixin){
            mixin(construct.prototype, definition.Mixin);
        }
        
        if(definition.Implements){
            isImplementing(construct, definition.Implements, nsOrDefinition);
        }
		
		if(ns){
			createNS(ns, construct);
		}
		
        return construct;
    };
    
    ClassObject.prototype = {
		createNS: function(namespace, apply){
			createNS(namespace, apply);
		},
        mixinProto: mixinProto,
        mixin: mixin,
        extend: extend,
        isImplementing: isImplementing
    };
    
    $NS.Class = ClassObject;
    
}(patternity, patternityUtils));