(function($NS){
    
    var KeyProperties = {
        'Extends': 1,
        'Implements' : 1,
        'Mixin': 1
    },
    typeofObject = "object",
    typeofFunction = "function",
    utils = $NS.patternUtils;
    
    function mixinProto(construct, definition){
        var key;
        for(key in definition){
            if(definition.hasOwnProperty(key) && !KeyProperties[key]){
                construct.prototype[key] = definition[key];    
            }
        }
    }

    
	function validateInput(nsOrDefinition, definition, origin){
		var ns;
		if(typeof(nsOrDefinition) === 'string'){
			ns = nsOrDefinition;
		if(!definition || typeof(definition) !== typeofObject){
			throw 'an object definition is required when namespace provided';
		}
		}else if(!nsOrDefinition || typeof(nsOrDefinition) !== typeofObject){
		    throw 'parameter needs to be an object or namespace string';
		}else{
		    definition = nsOrDefinition;
		}
		
		return {
			ns: ns,
			definition: definition
		};
    }
    
     
    function isImplementing(construct, implement, nsOrDefinition){
        var key,
            implType = typeof(implement),
            implementsErr,
            checkFor,
            i = 0,
            l;
            
        if(implement instanceof Array){
            for(i=0, l=implement.length; i<l; i++){
                if(!isImplementing(construct, implement[i])){
                    return false;
                }
            }
        }else{
            if(implType === typeofFunction || implType === typeofObject){
                checkFor = (implType === typeofFunction) ? implement.prototype : implement;
                for(key in checkFor){
                    if(checkFor.hasOwnProperty(key)){
                        if(typeof(checkFor[key]) === typeofFunction && !construct.prototype[key]){
                            implementsErr = "implementation for " + key + "() is missing " + ((nsOrDefinition) ? nsOrDefinition : "");
                            throw new Error(implementsErr);
                        }
                    }
                }    
            }
        }
        
        return true;  
    }
        
    function Class(nsOrDefinition, definition){  
        
        var input = validateInput(nsOrDefinition, definition),
            construct;
        
        definition = input.definition;
        
        construct = function(){
            if(typeof(definition.construct) === typeofFunction){
                definition.construct.apply(this, arguments);
            }
        };
        
        if(typeof(definition.Extends) === typeofFunction){
            utils.extend(construct, definition.Extends);
        }
        
        mixinProto(construct, definition);
        
        if(definition.Mixin){
            utils.mixin(construct.prototype, definition.Mixin);
        }
        
        if(definition.Implements){
            isImplementing(construct, definition.Implements, nsOrDefinition);
        }
		
		if(input.ns){
			utils.createNS(input.ns, construct);
		}
		
        return construct;
    }
    
    Class.prototype = {
        isImplementing: isImplementing,
        validateInput: validateInput,
        mixinProto: mixinProto
    };
    
    $NS.Class = Class;
    
}(patternity));