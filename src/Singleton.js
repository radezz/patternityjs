(function($NS){
	
	function Singleton(construct){
		var instance = new construct();
		
		this.getInstance = function(){
			return instance;
		}
	}
	
	function SingletonCreator(nsOrDefinition, definition){
		var ns,
			definition,
			singleton;
			
		if(typeof(nsOrDefinition) === 'string'){
            ns = nsOrDefinition;
            if(!definition || typeof(definition) !== typeofObject){
                throw 'object definition required when namespace provided';
            }
        }else if(!nsOrDefinition || typeof(nsOrDefinition) !== typeofObject){
            throw 'parameter needs to be an object or namespace string';
        }else{
            definition = nsOrDefinition;
        }
		
		singleton = new Singleton($NS.Class(definition));
		
		if(ns){
			$NS.Class.prototype.createNS(ns, singleton);
		}
		
		return singleton;
	};
	
	SingletonCreator.prototype = {
		Singleton: Singleton
	};
	
	$NS.Singleton = SingletonCreator;
	
}(patternity));
