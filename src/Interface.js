(function($NS, $GLOBAL){
    
    var Class = $NS.Class,
		implementsErr,
		typeofObject = 'object',
		typeofFunction = 'function',
		utils = $NS.patternUtils,
		isObject = utils.isObject,
		isString = utils.isString,
		isFunction = utils.isFunction;

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
                if(isFunction(objectInstance[key])){
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
     * @param {Object} name
     * @param {Object} definition
     * @param {Object | String} pckg
     * 
     * @returns {Function} constructor for the defined interface
     */
    function Interface(name, definition, pckg){
    
        function Construct(objectInstance){
            if(objectInstance && isObject(objectInstance)){
                bind.call(this, objectInstance, definition);
            }else{
                throw 'an object for interface binding should be defined';
            }
        }
        
        Construct.className = name;
        
        Class.prototype.validateInput(name, definition, pckg);
        
        Construct.bind = function(objectInstance){
            return new Construct(objectInstance);
        };
        
        Class.prototype.mixinProto(Construct.prototype, definition);
		Class.prototype.applyToPackage(pckg, Construct);
		
        return Construct;
    }
    
    Interface.prototype = {
        bind: bind
    };
    
    $NS.Interface = Interface;
    
}(patternity, this));