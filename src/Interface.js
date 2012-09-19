(function($NS, $UTIL){
    
    var KeyProperties = {},
		ClassObject = $NS.Class,
		implementsErr;
		typeofObject = 'object',
		typeofFunction = 'function';
    
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
    
    function InterfaceObject(nsOrDefinition, definition){
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
        
		if(ns){
			ClassObject.prototype.createNS(ns, construct);
		}
		
        ClassObject.prototype.mixinProto(construct, definition);
        
        return construct;
    };
    
    InterfaceObject.prototype = {
        bind: bind
    };
    
    $NS.Interface = InterfaceObject;
    
}(patternity, patternityUtils));