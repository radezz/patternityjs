(function($NS, $GLOBAL){
    var KeyProperties = {
        'Extends': 1,
        'Implements' : 1,
        'Mixin': 1,
        'Static': 1,
        'className': 1
    },
    typeofObject = 'object',
    utils = $NS.utils,
    isObject = utils.isObject,
    isString = utils.isString,
    isFunction = utils.isFunction;
    
    
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
            defProperty;
        
        if(Array.isArray(definition)){
			definition.forEach(function(def){
				mixinProto(proto, def, forReinit);
			});
        } else {
			Object.keys(definition).forEach(function(key){
				defProperty = definition[key];
				if(!KeyProperties[key]){
					 proto[key] = defProperty;
					 if(forReinit && typeof(defProperty) === typeofObject){
						forReinit.push({
							key: key,
							value: defProperty
						});
					 }
				}
			});
            
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
     * @param {Array} forReinit
     */
    function getForReinit(src, forReinit){
        var key;
        for(key in src){
            if(src[key] && typeof(src[key]) === typeofObject){   
                forReinit.push({
                   key: key,
                   value: src[key] 
                });
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
     * @param {Array} forReinit
     */
    function reinitObjects(forReinit){
        var i = forReinit.length,
            self = this,
            key,
            prop;
         
         while(i--) {
            prop = forReinit[i];
            key = prop.key;
            if(self[key] && typeof(self[key]) === typeofObject){
                self[key] = prop.value.constructor();
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
     *    initialize: function(){
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
     *    initialize: function(){
     *      //use this._parent to access parent functions, and apply to do 'super' calls
     *      this._parent.initialize.apply(this, arguments);
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
        var Construct,
            forReinit = [],
            Extends,
            Mixin,
            Static,
            Implements;
        
        validateInput(name, definition, pckg);
        
        Extends = definition.Extends;
        Mixin = definition.Mixin;
        Static = definition.Static;
        Implements = definition.Implements;
        
        if(isFunction(definition.initialize)){
            Construct = function(){
                if(forReinit.length){
                    reinitObjects.call(this, forReinit);    
                }
                definition.initialize.apply(this, arguments);
            };  
        }else{
            Construct = function(){
                if(forReinit.length){
                    reinitObjects.call(this, forReinit);    
                }
            };
            definition.initialize = Construct;
        }
        
        Construct.className = name;
        
        if(isFunction(Extends)){
            Construct.prototype = Object.create(Extends.prototype);
            getForReinit(Construct.prototype, forReinit);
        }
        
        mixinProto(Construct.prototype, definition, forReinit);
        
        if(Mixin){
            if(isFunction(Mixin)){
                mixinProto(Construct.prototype, Mixin.prototype, forReinit);    
            }else{
                mixinProto(Construct.prototype, Mixin, forReinit);    
            }
        }
        
        if(Implements){
            isImplementing(Construct, Implements);
        }
        
        if(Static){
            utils.mixin(Construct, Static);
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
    
}(py, this));