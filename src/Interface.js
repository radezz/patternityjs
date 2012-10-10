(function($NS, $UTIL){
    
    var Class = $NS.Class,
		implementsErr,
		typeofObject = 'object',
		typeofFunction = 'function',
		utils = $NS.patternUtils;

    /**
     * Function creates a function which wraps the real object
     * function and calls it with provided arguments
     * 
     * @param {Object} objectInstance
     * @param {String} key
     */
    function interfaceCallerFactory(objectInstance, key){
		return function(){
			return objectInstance[key].apply(objectInstance, arguments);
		};
    }
    
    /**
     * Function binds the current interface functions to call
     * the target object class function which implement the interface
     * 
     * @param {Object} objectInstance - target object into which we bind the interface
     * @param {Object} interfaceDefinition - definition, which funcions should be bound
     */
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
    
    /**
     * Base Interface object creator. It will create a constructor
     * for user defined interface, which can be initialized and bounded 
     * to the target object which implements the interface functionality
     * 
     * @param {Object} nsOrDefinition
     * @param {Object} definition
     * 
     * @returns {Function} constructor for the defined interface
     */
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