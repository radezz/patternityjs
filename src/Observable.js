(function($NS){
	
	var slice = Array.prototype.slice,
	    utils = $NS.patternUtils,
		isFunction = utils.isFunction,
		isObject = utils.isObject;
	
	/**
	 * @class Observable
	 * 
	 * @constructor
	 */
	$NS.Class('Observable', {
		
		__observers: {},
		
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
		
		get: function(property){
			return this[property];
		},
		
		set: function(property, value){
			var self = this,
				oldValue;
				
			if(!utils.pairCall(self.set, arguments[0], self) && !isFunction(self[property])){
			    oldValue = self[property];
                self[property] = value;
                self.triggerObservers(property, value, oldValue);
			}
			
		},
		
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
		
		removeObservers: function(property){
			var observers = this.__observers;
			if(observers[property]){
				delete observers[property];
			}    
	    }
	}, $NS);
	
	
}(patternity));
