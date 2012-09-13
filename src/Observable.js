(function($NS){
	
	
	function triggerObservers(property){
		var self = this,
			observers = self.__observers[property],
			args =  arguments.slice(1),
			i=0,
			l=observers.length;
			
		for(i=0; i<l; i++){
			observers[i].apply(self, args);
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
			if(typeof(self[property]) !== 'function'){
				oldValue = self[property];
				self[property] = value;
				triggerObservers.call(self, property, value, oldValue);
			}
		},
		
		callFunction: function(functionName, args){
			var self = this,
				args = arguments.slice(1),
				result;
			
			if(typeof(self[functionName]) === 'function'){
				result = self[functionName].apply(self, args);
				triggerObservers.call(self, functionName, result, args);
				return result;
			}
		},
		
		observe: function(property, observer){
			var self = this;
			if(!self.__observers[property]){
				self.__observers[property] = [];
			}
			
			if(typeof(observer) === 'function'){
				self.__observers[property].push(observer);	
			}
		},
		
		removeObserver: function(property, observer){
			var self = this,
				observers = self.__observers[property],
				l = observers.length,
				i;
				
			if(!observer){
				delete self.__observers[property];
			}else{
				for(i=0; i<l; i++){
					if(observers[i] === observer){
						observers.splice(i,1);
					}
				}
			}
		}
		
	});
	
	
}(patternity));
