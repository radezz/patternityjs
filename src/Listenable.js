(function($NS){
	var utils = $NS.utils,
        isFunction = utils.isFunction,
        isObject = utils.isObject;
	
	/**
	 * Listenable is used to emulate custom events and listeners
	 * @class Listenable
	 * @name py.Listenable
	 * @constructor
	 */
	$NS.Class('Listenable', {
		
	    __registry: {},
		
		/**
		 * Function adds a listener callback to the Listenable object,
		 * to listen to the target custom event. This class should be used as 
		 * a Mixin when creating object which can trigger custom events.
		 * 
		 * @function
		 * @name py.Listenable#addListener
		 * 
		 * @example
		 * 
		 * py.Class('MyClass',{ Mixin: py.Listenable, 
		 *    execute: function(){
		 *        this.dispatchEvent('onExecuteCall');
		 *    }
		 * },'pckg');
		 * 
		 * var myInstance = new pckg.MyClass();
		 * myInstance.addListener('onExecuteCall, function(){
		 *    //handle custom event 
		 * });
		 * //...
		 * myInstance.execute();
		 * 
         * @param {String} eventName
         * @param {Function} callback
		 */
		addListener: function(eventName, callback){
			var self = this,
				registry = self.__registry;
			
			if(!utils.pairCall(self.addListener, arguments[0], self)){
			    if(callback && (isFunction(callback) || isObject(callback))){
                    if(!registry[eventName]){
                        registry[eventName] = [];   
                    }
                    registry[eventName].push(callback);
                }else{
                    throw "listener has to be a function or an object";
                }
			}
		},
		
		on: function(){
		    this.addListener.apply(this, arguments);    
		},
		
		cancel: function(){
		    this.removeListener.apply(this, arguments);
		},
		
		cancelAll: function(){
		    this.removeListeners.apply(this, arguments);    
		},
		
		/**
		 * Function removes listening callback from target event
		 * 
		 * @function
		 * @name py.Listenable#removeListener
		 * 
         * @param {String} eventName
         * @param {Function} callback
		 */
		removeListener: function(eventName, callback){
			var self = this,
				registry = self.__registry[eventName],
				i;
				
			if(registry){
				i = registry.length;
				while(i--){
					if(registry[i] === callback){
						registry.splice(i,1);
						return;
					}
				}	
			}
		},
		
		/**
		 * Function removes all listening callbacks
		 * from target event
		 * @function
		 * @name py.Listenable#removeListeners
         * @param {String} eventName
		 */
		removeListeners: function(eventName){
			var registry = this.__registry;
			if(registry[eventName]){
				delete registry[eventName];
			}
		},
		
		/**
		 * Function notifies all listeners listening to 
		 * the provided event. All parameters besides the 
		 * eventName are applied to every callback 
		 * 
		 * @function
		 * @name py.Listenable#dispatchEvent
         * @param {String} eventName
		 */
		dispatchEvent: function(eventName){
			var self = this,
				args = Array.prototype.slice.call(arguments, 1),
				registry = self.__registry[eventName],
				listener,
				i,
				l;
			
			if(registry){
				for(i=0, l=registry.length; i<l; i++){
					listener = registry[i];
					if(isFunction(listener)){
						listener.apply(self, args);
					}else if(isFunction(listener[eventName])){
						listener[eventName].apply(listener, args);
					}
				}
			}
			
		}
	}, $NS);
	
}(py));