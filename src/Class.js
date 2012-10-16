(function($NS, $GLOBAL){
    
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

    function applyToPackage(pckg, Construct, name){
        name = name || Construct.className;
        if(isString(pckg)){
            utils.createNS([pckg, '.', name].join(''), Construct);
        }else if(isObject(pckg)){
            pckg[name] = Construct;
        }else{
            $GLOBAL[name] = Construct;
        }
    }

	/**
	 * Function validates input for and returns an object
	 * contanint a namespace and definition, which is used when creating
	 * class.
	 * 
	 * @param {String} name
	 * @param {Object} definition
	 * @param {Object | String} package or namespace 
	 * 
	 */
	function validateInput(name, definition, pckg){
		if(!isString(name)){
			throw new TypeError('a class name is required');
		}
		
		if(!isObject(definition)){
		    throw new TypeError(name + ': class definition must be an object');
		}
		
		if(pckg && !isString(pckg) && !isObject(pckg)){
            throw new TypeError(name + ': package must be an object or string');
		}
    }
    
    /**
     * Function validates if constructor's prototype implements
     * provided Interface. Is used within class to check if created
     * Class contains implementation of an previously created Interface
     * 
     * @param {Object} construct
     * @param {Object | Function}
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
     * @param {String} name
     * @param {Object} definition
     * @param {Object | String}
     * 
     * @returns {Function} - constructor which can create an defined object
     */
    function Class(name, definition, pckg){  
        
        function Construct(){
            if(isFunction(definition.construct)){
                definition.construct.apply(this, arguments);
            }
        }
        
        validateInput(name, definition, pckg);
        
        Construct.className = name;
        
        if(isFunction(definition.Extends)){
            utils.extend(Construct, definition.Extends);
        }
        
        mixinProto(Construct, definition);
        
        if(definition.Mixin){
            utils.mixin(Construct.prototype, definition.Mixin);
        }
        
        if(definition.Implements){
            isImplementing(Construct, definition.Implements);
        }
        
        if(definition.Static){
            utils.mixin(Construct, definition.Static);
        }
		
		applyToPackage(pckg, Construct);
		
        return Construct;
    }
    
    Class.prototype = {
        isImplementing: isImplementing,
        validateInput: validateInput,
        mixinProto: mixinProto,
        applyToPackage: applyToPackage
    };
    
    $NS.Class = Class;
    
}(patternity, this));