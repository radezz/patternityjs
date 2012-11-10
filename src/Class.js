(function($NS, $GLOBAL){
    
    var KeyProperties = {
        'Extends': 1,
        'Implements' : 1,
        'Mixin': 1,
        'Static': 1
    },
    typeofObject = 'object',
    utils = $NS.utils,
    isObject = utils.isObject,
    isString = utils.isString,
    isFunction = utils.isFunction,
    isArray = utils.isArray;
    
    /**
     * Function creates create this._parent 
     * access wrapper function. It is Class's private method 
     * to create access to inherited Class
     * 
     * @function
     * @private
     * 
     * @param {Function} fn
     * @param {Object} parent
     */
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
	 * @function
	 * @name py.Class#mixinProto
	 * 
	 * @param {Function} proto
	 * @param {Object} definition
	 * @param {Object} forReinit
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
     * Class's helper function. It creates namespace/package and applies object into 
     * created namespace
     * 
     * @function
     * @name py.Class#applyToPackage
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
	 * @function
	 * @name py.Class#validateInput
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
     * @function
     * @name py.Class#isImplementing
     * 
     * @param {Object} construct
     * @param {Object | Function} implement
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
     * Class's private helper function. It is used to copy all non primitive
     * properties which should be cleared on when class is created, to prevent 
     * prototype static references
     * 
     * @private
     * 
     * @param {Object} src 
     * @param {Object} forReinit
     */
    function getForReinit(src, forReinit){
        var key;
        for(key in src){
            if(key !== '_parent' && src[key] && typeof(src[key]) === typeofObject){   
                forReinit[key] = src[key];
            }
        }
            
    }
    
    /**
     * Class's private helper function which is called with the Class
     * scope. It is used to reinit no primitive objects 
     * to its basic state. i.e clear arrays, change objects to empty objects etc
     * 
     * @private
     * 
     * @param {Object} forReinit
     */
    function reinitObjects(forReinit){
        var key,
            prop;
        for(key in forReinit){
            if(forReinit.hasOwnProperty(key)){
                this[key] = forReinit[key].constructor();
            }
        }
    }

    /**
     * Base Class creator function. It will create instantiable constructor
     * of user defined class object.
     * @class
     * @name py.Class
     * 
     * @example
     * py.Class('MyParentClass', {
     *    construct: function(){
     *         //parent constructor 
     *    },
     *    prop: 'value',
     *    func: function(){
     *     
     *    } 
     *    //...
     *    //define methods and properties here
     * }, 'my.package'); //package will be created if not defined
     * 
     * 
     * py.Class('MyClass', { Extends: my.package.MyParentClass
     *    construct: function(){
     *      //use this._parent to access parent functions, and apply to do 'super' calls
     *      this._parent.construct.apply(this, arguments);
     * 
     *      //place constructor code here 
     *    } 
     * }, 'my.package')
     * 
     * var myInstance = new my.package.MyClass();
     * 
     * @constructor
     * 
     * @param {String} name name for the created class
     * @param {Object} definition definition formed as object
     * @param {Object | String} pckg optional package a namespace in which the class constructor should be placed
     * 
     * @returns {Function} - constructor which can create an defined object
     */
    function Class(name, definition, pckg){  
        var forReinit = {};
        
        function Construct(){
            reinitObjects.call(this, forReinit);
            
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