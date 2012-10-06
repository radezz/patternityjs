(function($NS){
	
	
	function createKey(){
		key = this.__length + '';
		this.__length++;
		return key;
	}
	
	function callRegistered(registered){
		registered.handler.apply(registered.ctx || this, registered.args);
		registered.clearAspect();
		delete registered;
	}
	
	
	$NS.Sync = $NS.Class({
		construct: function(settings){
			var self = this;
			
			settings = settings || {};
			self.__registry = {};
			self.__length = 0;
			self.__synchronized = settings.synchronized || false; 
			
			if(typeof(settings.onAllReady) === 'function'){
				self.onAllReady = settings.onAllReady;
			}
		},
		
		isAllReady: function(){
			var self = this,
				key;
			for(key in self.__registry){
				if(self.__registry.hasOwnProperty(key) && !self.__registry[key].isReady){
					return false; 
				}
			}
			return true;
		},
		
		clear: function(){
			this.__registry = {};
			this.__length = 0;
		},
		
		addHandler: function(source, handlerName, context){
			var self = this,
				handler = source[handlerName],
				key,
				registered;
			
			context = context || source;
			
			if(typeof(handler) === 'function'){
			 	key = createKey.call(self);
		
				source[handlerName] = function(){	
					registered = self.__registry[key];
					if(registered){
						
						registered.isReady = true;
						registered.args = arguments;
						
						if(!self.__synchronized){
							callRegistered(registered);
						}
						
						if(self.isAllReady()){
							if(self.__synchronized){
								for(key in self.__registry){
									if(self.__registry.hasOwnProperty(key)){
										callRegistered(self.__registry[key]);
									}
								}
							}
							
							if(self.onAllReady){
								self.onAllReady();
							}
						}
					
					} else {
						userDefined.apply(context || this, arguments);
						handler = userDefined;
					}
					
				};
				
				self.__registry[key] = {
					handler: handler,
					clearAspect: function(){
						source[handlerName] = handler;
					},
					ctx: context,
					isReady: false
				};
			 }
		},
		
		onAllReady: function(){}
	});
	
}(patternity));
