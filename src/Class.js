(function($NS){
    
    var KeyProperties = {
        'Extends': 1,
        'Implements' : 1,
        'Mixin': 1
    },
    utils = $NS.patternUtils,
    isObject = utils.isObject,
    isString = utils.isString,
    isFunction = utils.isFunction,
    isArray = utils.isArray;
    
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
		if(isString(nsOrDefinition)){
			ns = nsOrDefinition;
			if(!definition || !isObject(definition)){
				throw new TypeError('an object definition is required when namespace provided');
			}
		}else if(!nsOrDefinition || !isObject(nsOrDefinition)){
		    throw new TypeError('parameter needs to be an object or namespace string');
		}else{
		    definition = nsOrDefinition;
		}
		
		return {
			ns: ns,
			definition: definition
		};
    }
    
     
    function isImplementing(construct, implement, nsOrDefinition){
        var checkFor = (isFunction(implement))? implement.prototype : implement;
        if(!utils.isImplementing(construct.prototype, checkFor)){
        	implementsErr = nsOrDefinition + " implementation for interface is missing";
        	throw new Error(implementsErr);
        }
    }
        
    function Class(nsOrDefinition, definition){  
        
        var input = validateInput(nsOrDefinition, definition),
            construct;
        
        definition = input.definition;
        
        construct = function(){
            if(isFunction(definition.construct)){
                definition.construct.apply(this, arguments);
            }
        };
        
        if(isFunction(definition.Extends)){
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