(function($NS){
	
	function execute(){
		var self = this,
			i,
			l;
		
		if(self.__isRunning){
			for(i=0, l= self.__tasks.length; i<l; i++){
				self.__tasks[i]();
			}
		}
	}
	
	$NS.Timer = $NS.Class({
		construct: function(interval){
			var self = this;
			if(typeof(interval) === 'number' && interval > 0){
				self.__interval = interval;	
				self.__tasks = [];
				self.__isRunning = false;
				self.__handle = null;
			}else{
				throw "interval required"
			}
		},
		
		addTask: function(fn){
			if(typeof(fn) === 'function'){
				this.__tasks.push(fn);	
			}else{
				throw "taks must be a function";
			}
		},
		
		reset: function(){
			this.stop();
			this.__tasks = [];
		},
		
		run: function(fn){
			var self = this;
			
			if(fn){
				self.addTask(fn);	
			}
			
			self.__isRunning = true;
			self.__handle = setInterval(function(){
				execute.call(self);
			},self.__interval);
		},
		
		stop: function(){
			this.__isRunning = false;
			clearInterval(this.__handle);
		},
		
		isRunning: function(){
			return this.__isRunning;
		}
		
	});
	
}(patternity));
