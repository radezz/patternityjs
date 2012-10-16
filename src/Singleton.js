(function($NS){
	var utils = $NS.patternUtils,
		Class = $NS.Class;
	
	function Singleton(Construct){
		var instance = new Construct();
		
		this.getInstance = function(){
			return instance;
		};
	}
	
	function SingletonCreator(name, definition, pckg){
		var singleton;
		Class.prototype.validateInput(name, definition, pckg);
		singleton = new Singleton($NS.Class(name, definition, {}));
		Class.prototype.applyToPackage(pckg, singleton, name);
		return singleton;
	}
	
	SingletonCreator.prototype = {
		Singleton: Singleton
	};
	
	$NS.Singleton = SingletonCreator;
	
}(patternity));
