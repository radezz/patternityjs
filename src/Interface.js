(function($NS, $GLOBAL){
    
    var Class = $NS.Class,
		implementsErr,
		typeofObject = 'object',
		typeofFunction = 'function',
		utils = $NS.utils,
		isObject = utils.isObject,
		isString = utils.isString,
		isFunction = utils.isFunction;

    /**
     * Function creates a function which wraps the real object
     * function and calls it with provided arguments
     * @function
     * @private
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
     * @function
     * @name py.Interface#bind
     * @param {Object} objectInstance - target object into which we bind the interface
     * @param {Object} interfaceDefinition - definition, which functions should be bound
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
     * to the target object which implements the interface functionality.
     * @class 
     * @name py.Interface
     * @example
     * //create interface definition
     * py.Interface('ISaveable',{
     *     save:function(){},
     *     load:function(){}
     * },'pckg');
     * 
     * //create class
     * py.Class('Model', { Implements: pckg.ISaveable,
     *     save: function(){
     *          //implement save code (if interface function odes not
     *          //exists Class definer will throw an error
     *     },
     *     load: function(){
     *          //implement load code
     *     },
     *     parse: function(){},
     *     set: function(){}
     * },'pckg')
     * 
     * var MyModel = new pckg.Model();
     * //bnd interface to the Class's instance
     * var IMyModel = new pckg.ISaveable(MyModel);
     * 
     * //You will notice here that IMyModel contains only
     * //save() and load() functions will same functions on instantiated object
     * 
     * 
     * @constructor
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
    
}(py, this));