(function($NS){
	
	function execute(tasks){
		var self = this,
			task,
			i,
			l;
			
			for(i=0, l=tasks.length; i<l; i++){
				task = tasks[i];
				task.action.call(task.ctx || this);
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
				throw "interval required";
			}
		},
		
		addTask: function(fn, context){
			if(typeof(fn) === 'function'){
				this.__tasks.push({
					action: fn,
					ctx: context
				});	
			}else{
				throw "taks must be a function";
			}
		},
		
		removeTask: function(fn){
			var self = this,
				tasks = self.__tasks,
				i = tasks.length;
			while(i--){
				if(tasks[i].action === fn){
					tasks.splice(i,1);
					return;
				}
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
				if(self.__isRunning){
					execute(self.__tasks);
				}
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
