(function($NS){
	var utils = $NS.patternUtils,
		Class = $NS.Class;
	
	function Singleton(construct){
		var instance = new construct();
		
		this.getInstance = function(){
			return instance;
		}
	}
	
	function SingletonCreator(nsOrDefinition, definition){
		var input = Class.prototype.validateInput(nsOrDefinition, definition),
			singleton;
			
		singleton = new Singleton($NS.Class(input.definition));
		
		if(input.ns){
			utils.createNS(input.ns, singleton);
		}
		
		return singleton;
	};
	
	SingletonCreator.prototype = {
		Singleton: Singleton
	};
	
	$NS.Singleton = SingletonCreator;
	
}(patternity));
