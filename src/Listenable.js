(function($NS){
	var utils = $NS.patternUtils,
        isFunction = utils.isFunction,
        isObject = utils.isObject;
	
	/**
	 * 
	 */
	$NS.Class('Listenable', {
		construct: function(){
			this.__registry = {};
		},
		
		addListener: function(eventName, callback){
			var self = this,
				registry = self.__registry;
			
			if(callback && (isFunction(callback) || isObject(callback))){
				if(!registry[eventName]){
					registry[eventName] = [];	
				}
				registry[eventName].push(callback);
			}else{
				throw "listener has to be a function or an object";
			}
		},
		
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
		
		removeListeners: function(eventName){
			var registry = this.__registry;
			if(registry[eventName]){
				delete registry[eventName];
			}
		},
		
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
						listener.apply(this, args);
					}else if(isFunction(listener[eventName])){
						listener[eventName].apply(listener, args);
					}
				}
			}
			
		}
	}, $NS);
	
}(patternity));