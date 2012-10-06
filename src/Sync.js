(function($NS){
	
	
	function createKey(){
		var key = this.__length + '';
		this.__length++;
		return key;
	}
	
	function callRegistered(registered){
		registered.handler.apply(registered.ctx || this, registered.args);
		registered.clearAspect();
	}
	
	
	$NS.Sync = $NS.Class({
		construct: function(settings){
			var self = this;
			
			settings = settings || {};
			self.__registry = {};
			self.__length = 0;
			self.__synchronize = settings.synchronize || false; 
			
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
					var registryKey;
					
					registered = self.__registry[key];
					if(registered){
						
						registered.isReady = true;
						registered.args = arguments;
						
						if(!self.__synchronize){
							callRegistered(registered);
							delete self.__registry[key];
						}
						
						if(self.isAllReady()){
							if(self.__synchronize){
								for(registryKey in self.__registry){
									if(self.__registry.hasOwnProperty(registryKey)){
										callRegistered(self.__registry[registryKey]);
										delete self.__registry[registryKey];
									}
								}
							}
							
							if(self.onAllReady){
								self.onAllReady();
							}
						}
					
					} else {
						handler.apply(context || this, arguments);
						source[handlerName] = handler;
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
