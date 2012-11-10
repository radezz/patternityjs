(function($NS){
	
	var slice = Array.prototype.slice,
	    utils = $NS.utils,
		isFunction = utils.isFunction,
		isObject = utils.isObject;
	
	/**
	 * Observable class should be used as Mixin when creating objects
	 * with properties we would like to observe when they are changed.
	 * @class 
	 * @name py.Observable
	 * @constructor
	 */
	$NS.Class('Observable', {
		
		__observers: {},
		
		/**
		 * Function triggers all observers assigned to single property.
		 * @function
		 * @name py.Observable#triggerObserers
         * @param {String} property for which we would like to trigger observers
		 */
		triggerObservers: function(property){
            var self = this,
                observers = self.__observers[property],
                i=0,
                l;
            
            if(observers){
                for(i=0, l=observers.length; i<l; i++){
                    observers[i].apply(self, arguments);
                }
            }
        
        },
		
		/**
		 * Function returns value of chosen property
		 * 
		 * @function
         * @name py.Observable#get
		 * 
         * @param {String} property name
         * @returns {Object} value of the property
		 */
		get: function(property){
			return this[property];
		},
		
		/**
		 * Function sets property to provided value and 
		 * triggers all observers assigned to observe this property.
		 * 
		 * @function
         * @name py.Observable#set
		 * 
		 * @example
		 * var observableInstance = new py.Observable();
		 * observableInstance.observe('price', function(propertyName, newValue, oldValue){
		 *    //do some action 
		 * })
		 * 
		 * observableInstance.set('price', 10);
		 * 
		 * //For this function you can pass map of key value pairs to be set
		 * observableInstance.set({
		 *    'price': 10,
		 *    'size' : 20,
		 *    'name' : 'box' 
		 * });
		 * 
         * @param {String} propertyName
         * @param {Object} value
		 */
		set: function(property, value){
			var self = this,
				oldValue;
				
			if(!utils.pairCall(self.set, arguments[0], self) && !isFunction(self[property])){
			    oldValue = self[property];
                self[property] = value;
                self.triggerObservers(property, value, oldValue);
			}
			
		},
		
		/**
		 * Function works similar to 'set' but it is used to call
		 * object functions and trigger observers assigned to called function.
		 * Any additional parameter passed to this function will be used to 
		 * call chosen object's method.
		 * 
		 * @example
		 * py.Class('Point', { Mixin: py.Observable
		 *     construct: function(x,y){
		 *        this.x = x;
		 *        this.y = y;
		 *     },
		 *     move: function(x,y){
		 *        this.set('x', this.x + x);
		 *        this.set('y', this.y + y);
		 *     }
		 * },'geometry')
		 * 
		 * var point = new geometry.Point(10,10);
		 * 
		 * point.observe('move',function(functionName, result, args){
		 *     //handle move observer
		 * });
		 * 
		 * point.callFunction('move', 3, 5);
		 * 
		 * @function
		 * @name py.Observable#callFunction
		 * 
         * @param {String} functionName
		 */
		callFunction: function(functionName){
			var self = this,
				args = slice.call(arguments, 1),
				result;
			
			if(isFunction(self[functionName])){
				result = self[functionName].apply(self, args);
				self.triggerObservers(functionName, result, args);
				return result;
			}
		},
		
		/**
		 * Function adds observer to object's property or function.
		 * Observer function is called when property is changed or 
		 * observed function is being called (when using 'set' or 'callFunction'
		 * methods). Observer function is called with arguments as described in example.
		 * 
		 * @example
		 * 
		 * function propertyObserver(propertyName, newValue, oldValue){}
		 * 
		 * function functionObserver(functionName, result, arg1, arg2, arg3){}
		 * 
		 * @function
		 * @name py.Observable#observe
		 * 
         * @param {String} propertyName or functionName
         * @param {Function} observer function
		 */
		observe: function(property, observer){
			var self = this,
			    observers = self.__observers;
			
			if(!utils.pairCall(self.observe, arguments[0], self)){
			    if(!observers[property]){
                    observers[property] = [];
                }
                
                if(isFunction(observer)){
                    observers[property].push(observer); 
                }
			}    
			
			
		},
		
		/**
		 * Function removes previously added observer.
		 * 
		 * @function
		 * @name py.Observable#removeObserver
		 * 
         * @param {String} propertyName or functionName
         * @param {Function} observer previously added observer reference
		 */
		removeObserver: function(property, observer){
			var observers = this.__observers[property] || [],
			    i;
				
            i = observers.length;
            while(i--){
                if(observers[i] === observer){
                    observers.splice(i,1);
                    return;
                }
            }
			
		},
		
		/**
         * Function removes all observers from chosen property or function.
         * 
         * @function
         * @name py.Observable#removeObservers
         * 
         * @param {String} propertyName or functionName
         */
		removeObservers: function(property){
			var observers = this.__observers;
			if(observers[property]){
				delete observers[property];
			}    
	    }
	}, $NS);
	
	
}(py));
