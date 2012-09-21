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
			if(typeof(interval) === 'number' && interval > 0){
				this.__interval = interval;	
				this.__tasks = [];
				this.__isRunning = false;
				this.__handle = null;
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
			
			this.__isRunning = true;
			this.__handle = setInterval(function(){
				execute.call(self);
			},this.__interval);
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
