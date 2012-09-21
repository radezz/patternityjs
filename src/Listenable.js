(function($NS){
	
	$NS.Listenable = $NS.Class({
		construct: function(){
			this.__registry = {};
		},
		
		addListener: function(eventName, callback){
			var self = this,
				callbackType = typeof(callback);
			
			if(callback && (callbackType === 'function' || callbackType === 'object')){
				if(!self.__registry[eventName]){
					self.__registry[eventName] = [];	
				}
				self.__registry[eventName].push(callback);
			}else{
				throw "no or wrong callback type defined";
			}
		},
		
		removeListener: function(eventName, callback){
			var self = this,
				registry = self.__registry[eventName],
				i;
				
			if(registry){
				i = registry.length;
				while(i--){
					if(registry[i] == callback){
						registry.splice(i,1);
						return;
					}
				}	
			}
		},
		
		removeListeners: function(eventName){
			var self = this;
			if(self.__registry[eventName]){
				delete self.__registry[eventName];
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
					if(typeof(listener) === 'function'){
						listener.apply(this, args);
					}else if(typeof(listener[eventName]) === 'function'){
						listener[eventName].apply(listener, args);
					}
				}
			}
			
		}
	});
	
}(patternity));