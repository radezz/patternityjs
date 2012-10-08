(function($NS, $UTIL){
    
    var Class = $NS.Class,
		implementsErr,
		typeofObject = 'object',
		typeofFunction = 'function',
		utils = $NS.patternUtils;
    
    function interfaceCallerFactory(objectInstance, key){
		return function(){
			return objectInstance[key].apply(objectInstance, arguments);
		};
    }
    
    function bind(objectInstance, interfaceDefinition){
        var key;
            
        for(key in interfaceDefinition){
            if(interfaceDefinition.hasOwnProperty(key)){
                if(typeof(objectInstance[key]) === typeofFunction){
                    this[key] = interfaceCallerFactory(objectInstance, key);
                }else{
					implementsErr = 'cannot bind ' + key + '() implementation is missing';
					throw implementsErr;
                }
            }
        }
    }
    
    function Interface(nsOrDefinition, definition){
        var input = Class.prototype.validateInput(nsOrDefinition, definition),
            Construct;
        
        definition = input.definition;
        
        Construct = function(objectInstance){
            if(objectInstance && typeof(objectInstance) === typeofObject){
                bind.call(this, objectInstance, definition);
			}else{
				throw 'an object for interface binding should be defined';
			}
        };
        
        Construct.bind = function(objectInstance){
            return new Construct(objectInstance);
        };
        
		if(input.ns){
			utils.createNS(input.ns, Construct);
		}
		
        Class.prototype.mixinProto(Construct, definition);
        
        return Construct;
    }
    
    Interface.prototype = {
        bind: bind
    };
    
    $NS.Interface = Interface;
    
}(patternity));