(function($NS){
    
    var KeyProperties = {
        'Extends': 1,
        'Implements' : 1,
        'Mixin': 1,
        'Static': 1
    },
    utils = $NS.patternUtils,
    isObject = utils.isObject,
    isString = utils.isString,
    isFunction = utils.isFunction,
    isArray = utils.isArray;
    
	/**
	 * Function mixins the definition into the 
	 * constructor prototype. It will not mix in the 'Extend', 'Implements', 'Mixin', 'Static'
	 * properties as they are the 'key' properties used to define the class
	 * 
	 * @param {Function} construct
	 * @param {Object} definition
	 */
	function mixinProto(construct, definition){
        var key;
        for(key in definition){
            if(definition.hasOwnProperty(key) && !KeyProperties[key]){
                construct.prototype[key] = definition[key];    
            }
        }
    }

	/**
	 * Function validates input for and returns an object
	 * contanint a namespace and definition, which is used when creating
	 * class.
	 * 
	 * @param {Object | String} nsOrDefinition
	 * @param {Object} definition
	 * 
	 * @return {Object} - object containing namespace and definition
	 */
	function validateInput(nsOrDefinition, definition){
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
    
    /**
     * Function validates if constructor's prototype implements
     * provided Interface. Is used within class to check if created
     * Class contains implementation of an previously created Interface
     * 
     * @param {Object} construct
     * @param {Object | Function} implement
     * @param {Object} nsOrDefinition
     */
    function isImplementing(construct, implement, nsOrDefinition){
        var checkFor = (isFunction(implement))? implement.prototype : implement,
			implementsErr;
        
        if(!utils.isImplementing(construct.prototype, checkFor)){
			implementsErr = nsOrDefinition + " implementation for interface is missing";
			throw new Error(implementsErr);
        }
    }


    /**
     * Base Class creator function. It will create instantiable constructor
     * of user defined class object.
     * 
     * @param {Object | String} nsOrDefinition
     * @param {Object} definition
     * 
     * @returns {Function} - constructor which can create an defined object
     */
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
        
        if(definition.Static){
            utils.mixin(construct, definition.Static);
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