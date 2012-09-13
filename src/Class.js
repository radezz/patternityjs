(function($NS, $UTIL){
    
    var KeyProperties = {
        'Extends': 1,
        'Implements' : 1,
        'Mixin': 1,
        'construct': 1
    };
    
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
        construct.prototype._parent = Extends.prototype;
    }
    
    function isImplementing(construct, implement){
        var key,
            implementsProto,
            implType = typeof(implement),
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
            if(implType === 'function' || implType === 'object'){
                checkFor = (implType === 'function') ? implement.prototype : implement;
                for(key in checkFor){
                    if(checkFor.hasOwnProperty(key)){
                        if(typeof(checkFor[key]) === 'function' && !construct.prototype[key]){
                            console.error('Implementation for "' + key + '" is missing at ', construct.prototype);
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
            if(!definition){
                throw 'object definition required when namespace provided';
            }
        
        }else if(typeof(nsOrDefinition) !== 'object'){
            throw 'parameter needs to be an object or namespace string';
        }else{
            definition = nsOrDefinition;
        }
        
        construct = function(){
            if(typeof(this.construct) === 'function'){
                this.construct.apply(this, arguments);
            }
        };
        
        if(typeof(definition.Extends) === 'function'){
            extend(construct, definition.Extends);
        }
        
        mixinProto(construct, definition);
        
        if(definition.Mixin){
            mixin(construct.prototype, definition.Mixin);
        }
        
        if(definition.Implements){
            isImplementing(construct, definition.Implements);
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