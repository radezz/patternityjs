/**
 * This namespace defines utility functions used within library clasees
 * @namespace
 * @name py.utils
 */
(function($NS, $Global){
	
	var toString = Object.prototype.toString,
	    //every checkFor key is converted to a is... function
		checkFor = {
		 /**
		  * Function check if object is a function
		  * @function
		  * @name py.utils#isFunction
		  * @param {Object} object
		  */
		'Function': 1,
		/**
          * Function check if object is undefined
          * @function
          * @name py.utils#isUndefined
          * @param {Object} object
          */
		'Undefined': 1,
		/**
          * Function check if object is null
          * @function
          * @name py.utils#isNull
          * @param {Object} object
          */
		'Null': 1,
		/**
          * Function check if object is a atring
          * @function
          * @name py.utils#isString
          * @param {Object} object
          */
		'String': 1,
		/**
          * Function check if object is an array
          * @function
          * @name py.utils#isArray
          * @param {Object} object
          */
		'Array': 1,
		/**
          * Function check if object is object (user defined object, function will return
          * false for arrays, regexp etc).
          * @function
          * @name py.utils#isObject
          * @param {Object} object
          */
		'Object': 1,
		/**
          * Function check if object is math
          * @function
          * @name py.utils#isMath
          * @param {Object} object
          */
		'Math': 1,
		/**
          * Function check if object is date
          * @function
          * @name py.utils#isDate
          * @param {Object} object
          */
		'Date': 1,
		/**
          * Function check if object is boolean value
          * @function
          * @name py.utils#isBoolean
          * @param {Object} object
          */
		'Boolean': 1,
		/**
          * Function check if object is a number
          * @function
          * @name py.utils#isNumber
          * @param {Object} object
          */
		'Number': 1,
		/**
          * Function check if object is RegExp
          * @function
          * @name py.utils#isRegExp
          * @param {Object} object
          */
		'RegExp': 1,
		/**
          * Function check if object is JSON
          * @function
          * @name py.utils#isJSON
          * @param {Object} object
          */
		'JSON': 1,
		/**
          * Function check if object is arguments
          * @function
          * @name py.utils#isArguments
          * @param {Object} object
          */
		'Arguments': 1
	},
	check = {}, 
	key;
	
	//create s list of type checkers
	function createChecker(objectType){
		var typeString = ["[object ", objectType, "]"].join("");
		return function(object){
			return toString.call(object) === typeString;
		};
	}

	for(key in checkFor){
		if(checkFor.hasOwnProperty(key)){
			check["is" + key] = createChecker(key);
		}
	}
	
	//create utils 
	(function(){
		
		var isArray = check.isArray,
			isObject = check.isObject,
			isUndefined = check.isUndefined;
		/**
		 * Function extracts object type returned by object.toString.
		 * It can be used for more strict object typing
		 * @function
		 * @name py.utils#getType
		 * @returns {String}
		 */
		function getType(object){
			var stringified = toString.call(object);
			return stringified.substring(8,stringified.length-1);
		}
		
		/**
		 * Function creates namespace (if does not exists) and 
		 * applies and object to the namespace (if provided).
		 * @function
		 * @name py.utils#createNS
		 * 
		 * @param {String} namespace 
		 * @param {Object} [optional] object to apply in this namespace
		 * 
		 * @example
		 * var myObj = {};
		 * py.utils.createNS('my.name.space.myObj',myObj);
		 * 
		 * my.name.space.myObj === myObj //will be true
		 * 
		 */
		function createNS(namespace, apply){
			var ns = namespace.split('.'),
				nsPart = ns.shift(),
				targetObject = $Global; //this needs to refer to global
			
			while(nsPart){
				if(!targetObject[nsPart]){
					targetObject[nsPart] = {};
				}
				
				if(ns.length === 0 && apply){
					targetObject[nsPart] = apply;
				}
				
				targetObject = targetObject[nsPart];	
				nsPart = ns.shift();
			}
			
			return targetObject;
		}	
		
		/**
		 * Function implements base for prototype inheritance,
		 * it extends constructor with parent prototype.
		 * 
		 * @function
		 * @name py.utils#extend
		 * 
         * @param {Function} construct
         * @param {Function} parent
		 */
		function extend(construct, parent){
	        var Extends = function(){};
	        Extends.prototype = parent.prototype;
	        construct.prototype = new Extends();
	        return construct;
	    }
	    
	    /**
	     * Function implements Object.create or uses native implementation
	     * if available. 
	     * 
	     * @function
	     * @name py.utils#createObject
	     * 
	     * @param {Object} proto 
	     */
	    function createObject ( proto ) {
	       function F(){}
	       F.prototype = proto;
	       return new F();
	    }
	    
	    /**
	     * Function mixins methods and properties from source  object(s)
	     * to target object, but does not modify the prototype
	     * 
	     * @function
	     * @name py.utils#mixin
	     * 
         * @param {Object} target
         * @param {Object | Array} source it can be also array of objects
	     */
	    function mixin(target, source){
	        var key,
	            i,
	            l;
	        if(target && source){
				if(isArray(source)){
		            for(i=0, l=source.length; i<l; i++){
		                mixin(target, source[i]);
		            }
		        }else{
		            for(key in source){
		                if(source.hasOwnProperty(key)){
		                    target[key] = source[key];
		                }
		            }
		        }
		        
		        return target;
	        }    
	    }
	    
	    /**
	     * Function checks if target object implements provided 
	     * interface (object functions and properties)
	     * 
	     * @function
	     * @name py.utils#isImplementing
	     * 
         * @param {Object} target
         * @param {Object} implement
	     */
	    function isImplementing(target, implement){
			var targetProperty, 
				key, 
				i, 
				l;
			
			if (isArray(implement)) {
				for ( i = 0, l = implement.length; i < l; i++) {
					if (!isImplementing(target, implement[i])) {
						return false;
					}
				}
				
				return true;
			
			} else if (isObject(implement)) {
				for (key in implement) {
					if(implement.hasOwnProperty(key)){
						targetProperty = target[key];
						if (isUndefined(targetProperty) || getType(targetProperty) !== getType(implement[key])) {
							return false;
						}
					}
				}

				return true;
			}
	    }
	    
	    /**
	     * Function applies pair arguments to target function. It is 
	     * possible to overload 'key-value' type function to consume 
	     * objects as single parameter
	     * 
	     * @function
	     * @name py.utils#pairCall
	     * 
         * @param {Object} fn
         * @param {Object} pairArgs
         * @param {Object} context [optional]
         * 
         * @returns {Boolean} which states if pairCall is applied
         * 
         * @example
         * 
         * function set(prop, value){
         *     if(arguments.length === 1 && !pairCall(set, arguments[0])){
         *         target[prop] = value;
         *     }
         * }
         * 
         * //instead of calling 
         * set('prop', 10);
         * //you can call
         * set({
         *     prop: 10,
         *     prop2: 20,
         *     prop3: 30
         * })
         * 
	     */
	    function pairCall(fn, pairArgs, context){
	        var key;
	            
	        if(check.isFunction(fn) && check.isObject(pairArgs)){
	            for(key in pairArgs){
	                if(pairArgs.hasOwnProperty(key)){
	                    fn.call(context, key, pairArgs[key]);
	                }
	            }
	            return true;
	        }
	        
	        return false;
	    }
	    
	    /**
	     * Function returns true if object is not null and not 'undefined'
	     * @function
	     * @name py.utils#isDefined
         * @param {Object} object
	     */
	    function isDefined(object){
			return !check.isNull(object) && !check.isUndefined(object);
	    }
		
		$NS.utils = mixin(check ,{
			createNS: createNS,
			extend: extend,
			createObject: Object.create || createObject,
			mixin: mixin,
			pairCall: pairCall,
			isImplementing: isImplementing,
			isDefined: isDefined,
			getType: getType
		});
		
		$NS.NS = createNS;
		
	}());	
}(py, this));
