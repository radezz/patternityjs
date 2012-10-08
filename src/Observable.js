(function($NS){
	
	var slice = Array.prototype.slice,
		typeofFunction = 'function';
	
	function triggerObservers(property){
		var self = this,
			observers = self.__observers[property],
			i=0,
			l;
		
		if(observers){
		    for(i=0, l=observers.length; i<l; i++){
                observers[i].apply(self, arguments);
            }
		}
		
	}
	
	$NS.Observable = $NS.Class({
		
		construct: function(){
			this.__observers = {};
		},
		
		get: function(property){
			return this[property];
		},
		
		set: function(property, value){
			var self = this,
				oldValue;
			if(typeof(self[property]) !== typeofFunction){
				oldValue = self[property];
				self[property] = value;
				triggerObservers.call(self, property, value, oldValue);
			}
		},
		
		callFunction: function(functionName){
			var self = this,
				args = slice.call(arguments, 1),
				result;
			
			if(typeof(self[functionName]) === typeofFunction){
				result = self[functionName].apply(self, args);
				triggerObservers.call(self, functionName, result, args);
				return result;
			}
		},
		
		observe: function(property, observer){
			var observers = this.__observers;
			if(!observers[property]){
				observers[property] = [];
			}
			
			if(typeof(observer) === typeofFunction){
				observers[property].push(observer);	
			}
		},
		
		removeObserver: function(property, observer){
			var observers = this.__observers[property],
				l,
				i;
				
			if(observers){
				for(i=0, l=observers.length; i<l; i++){
					if(observers[i] === observer){
						observers.splice(i,1);
						return;
					}
				}
			}
		},
		
		removeObservers: function(property){
			var observers = this.__observers;
			if(observers[property]){
				delete observers[property];
			}    
	    }
	});
	
	
}(patternity));
