(function($NS){
	
	/**
	 * Helper function creates new key for 
	 * listener in registry
	 * @private
	 */
	function createKey(){
		return '' + this.__length++;
	}
	
	/**
	 * Helper function which calls registered function
	 * @private
     * @param {Object} registered
	 */
	function callRegistered(registered){
		registered.handler.apply(registered.ctx || this, registered.args);
		registered.clearAspect();
	}
	
	/**
	 * Sync is used synchronise callbacks as well as to notify when
	 * all registered callback were called.
	 * @class
	 * @name py.Sync
	 * 
	 * @params {Object} settings object which may contain following attributes:
	 * <ul>
	 *     <li><code>synchronize</code> - boolean value if set to true all registered handlers will be called synchronously</li>
	 *     <li><code>onAllReady</code> - function which will be called after all handlers were executed</li>
	 * </ul> 
	 * 
	 * @example
	 * 
	 * var handlers = {
	 *     onJsonLoad: function(xhr){},
	 *     onTemplateLoad: function(template){}
	 * };
	 * 
	 * var sync = new py.Sync({
	 *     onAllReady: function(){
	 *         //json is loaded and template too
	 *     }
	 * });
	 * 
	 * sync.addHandler(handlers, 'onJsonLoad');
	 * sync.addHandler(handlers, 'onTemplateLoad');
	 * 
	 */
	$NS.Class('Sync', {
		initialize: function(settings){
			var self = this;
			
			settings = settings || {};
			self.__registry = {};
			self.__length = 0;
			self.__synchronize = settings.synchronize || false; 
			
			if(typeof(settings.onAllReady) === 'function'){
				self.onAllReady = settings.onAllReady;
			}
		},
		
		/**
		 * Function indicates if all handlers are ready
		 * @function
		 * @name py.Sync#isAllReady
		 * 
		 * @returns {Boolean}
		 */
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
		
		/**
		 * Function clears the current handlers registry.
		 * Registry should be cleared before adding new set of handlers,
		 * to synchronize.
		 * 
		 * @function
		 * @name py.Sync#clear
		 */
		clear: function(){
			this.__registry = {};
			this.__length = 0;
		},
		
		/**
		 * Function adds handler which should be synchronized
		 * to the registry.
		 * @function
		 * @name py.Sync#addHandler
		 * 
		 * @param {Object} source an object which contains handler (i.e XMLHttpRequest instance)
		 * @param {String} handlerName
		 * @param {[Object]} context (optional) to which handler should be applied 
		 */
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
					ctx: context || source,
					isReady: false
				};
			 }
		},
		/**
		 * User defined function which will be called whan all handlers 
		 * were executed
		 * 
		 * @function
		 * @name py.Sync#onAllReady
		 */
		onAllReady: function(){}
	}, $NS);
	
}(py));
