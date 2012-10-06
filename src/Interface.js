(function($NS, $UTIL){
    
    var KeyProperties = {},
		Class = $NS.Class,
		implementsErr;
		typeofObject = 'object',
		typeofFunction = 'function',
		utils = $NS.patternUtils;
    
    function bind(objectInstance, interfaceDefinition){
        var key;
            
        for(key in interfaceDefinition){
            if(interfaceDefinition.hasOwnProperty(key)){
                if(typeof(objectInstance[key]) === 'function'){
                    this[key] = (function(k){
                        return function(){ 
                        	return objectInstance[k].apply(objectInstance, arguments);
                        };    
                    }(key));
                }else{
                	implementsErr = key + '() implementation is missing';
                	throw implementsErr;
                }
            }
        }
    }
    
    function Interface(nsOrDefinition, definition){
        var input = Class.prototype.validateInput(nsOrDefinition, definition),
            construct;
        
        definition = input.definition;
        
        construct = function(objectInstance){
            if(objectInstance && typeof(objectInstance) === typeofObject){
                bind.call(this, objectInstance, definition);
            }else{
            	throw 'object for interface binding should be defined';
            }
        };
        
        construct.bind = function(objectInstance){
            return new construct(objectInstance);
        };
        
		if(input.ns){
			utils.createNS(input.ns, construct);
		}
		
        utils.mixin(construct.prototype, definition);
        
        return construct;
    };
    
    Interface.prototype = {
        bind: bind
    };
    
    $NS.Interface = Interface;
    
}(patternity, patternityUtils));