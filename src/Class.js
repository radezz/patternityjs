(function($NS, $GLOBAL){
    
    var KeyProperties = {
        'Extends': 1,
        'Implements' : 1,
        'Mixin': 1,
        'Static': 1
    },
    typeofObject = 'object',
    utils = $NS.patternUtils,
    isObject = utils.isObject,
    isString = utils.isString,
    isFunction = utils.isFunction,
    isArray = utils.isArray;
    
    function createParenAccessFunction(fn, parent){
        var result;
        
        return function(){
            this._parent = parent.prototype;
            result = fn.apply(this, arguments);
            delete this._parent;
            return result;
        };
    }
    
	/**
	 * Function mixins the definition into the 
	 * constructor prototype. It will not mix in the 'Extend', 'Implements', 'Mixin', 'Static'
	 * properties as they are the 'key' properties used to define the class
	 * 
	 * @param {Function} proto
	 * @param {Object} definition
	 */
	function mixinProto(proto, definition, forReinit){
        var key,
            defProperty,
            i,
            l;
        if(isArray(definition)){
            for(i=0, l=definition.length; i<l; i++){
                mixinProto(proto, definition[i], forReinit);
            }
        } else {
            for(key in definition){
                if(definition.hasOwnProperty(key) && !KeyProperties[key]){
                    defProperty = definition[key];
                    if(isFunction(defProperty) && definition.Extends){
                        proto[key] = createParenAccessFunction(defProperty, definition.Extends);
                    }else{
                        proto[key] = defProperty;
                        if(typeof(defProperty) === typeofObject){
                            forReinit[key] = defProperty;
                        }
                    }
                    
                    
                }
            }
        } 
    }
    
    /**
     * Function creates namespace and applies object into 
     * created namespace
     * 
     * @param {String} pckg
     * @param {Object} source
     * @param {String} name - optional name if source is not a class constructor
     */
    function applyToPackage(pckg, source, name){
        name = name || source.className;
        if(isString(pckg)){
            utils.createNS([pckg, '.', name].join(''), source);
        }else if(isObject(pckg)){
            pckg[name] = source;
        }else{
            $GLOBAL[name] = source;
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
		
		if(pckg && !isString(pckg) && (typeof(pckg) !== typeofObject)){
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
    
    function getForReinit(src, forReinit){
        var key;
        for(key in src){
            if(key !== '_parent' && src[key] && typeof(src[key]) === typeofObject){   
                forReinit[key] = src[key];
            }
        }
            
    }

    function reinitObjects(src){
        var key,
            prop;
        for(key in src){
            if(src.hasOwnProperty(key)){
                this[key] = src[key].constructor();
            }
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
        var forReinit = {};
        
        function Construct(){
            if(forReinit){
                reinitObjects.call(this, forReinit);
            }
            if(isFunction(definition.construct)){
                definition.construct.apply(this, arguments);
            }
        }
        
        validateInput(name, definition, pckg);
        
        Construct.className = name;
        
        if(isFunction(definition.Extends)){
            utils.extend(Construct, definition.Extends);
            getForReinit(Construct.prototype, forReinit);
        }
        
        mixinProto(Construct.prototype, definition, forReinit);
        
        if(definition.Mixin){
            mixinProto(Construct.prototype, definition.Mixin, forReinit);
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