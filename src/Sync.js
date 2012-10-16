(function($NS){
	
	
	function createKey(){
		return '' + this.__length++;
	}
	
	function callRegistered(registered){
		registered.handler.apply(registered.ctx || this, registered.args);
		registered.clearAspect();
	}
	
	
	$NS.Class('Sync', {
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
			var registry = this.__registry,
				key;
			
			for(key in registry){
				if(registry.hasOwnProperty(key) && !registry[key].isReady){
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
					var registryKey,
						inSync = self.__synchronize,
						registry = self.__registry;
					
					registered = registry[key];
					if(registered){
						
						registered.isReady = true;
						registered.args = arguments;
						
						if(!inSync){
							callRegistered(registered);
							delete registry[key];
						}
						
						if(self.isAllReady()){
							if(inSync){
								for(registryKey in registry){
									if(registry.hasOwnProperty(registryKey)){
										callRegistered(registry[registryKey]);
										delete registry[registryKey];
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
	}, $NS);
	
}(patternity));
