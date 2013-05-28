(function($NS){
	
	/**
	 * Scheduler helper function, executes
	 * registered tasks
	 * @private
     * @param {Object} tasks
	 */
	function execute(tasks){
		var self = this,
		    now = (new Date()).getTime(),
			task,
			i,
			l;
			
			for(i=0, l=tasks.length; i<l; i++){
				task = tasks[i];
				task.action.call(task.ctx || this, now);
			}
	}
	
	/**
	 * Scheduler objcet is used to schedule multiple tasks to run
	 * periodically with preset interval.
	 * @class
	 * @name py.Scheduler
	 * 
	 * @constructor
	 * @param {Number} interval in milliseconds
	 */
	$NS.Class('Scheduler', {
	    
		initialize: function(interval){
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
		
		/**
		 * Function adds task to be scheduled using previously 
		 * set interval.
		 * 
		 * @function
		 * @name py.Scheduler#addTask
         * @param {Function} fn function which will be scheduled
         * @param {Object} [optional] context which should be applied to task 
		 */
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
		
		/**
		 * Function changes interval for the current scheduler instance
		 * 
		 * @function
		 * @name py.Scheduler#interval
         * @param {Number} interval in milliseconds
		 */
		interval: function(interval){
		    this.__interval = interval;
		},
		
		/**
		 * Function removes previously added tasks from scheduler.
         * 
         * @function
         * @name py.Scheduler#removeTask
         * @param {Function} fn
		 */
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
		
		/**
		 * Function stops the scheduler and clears all registered tasks.
		 * 
		 * @function
		 * @name py.Scheduler#reset
		 */
		reset: function(){
			this.stop();
			this.__tasks = [];
		},
		
		/**
		 * Function starts scheduler.
		 * 
		 * @function
		 * @name py.Scheduler#run
         * @param {[Function]} fn (optional) if provided will be added to current tasks list
		 */
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
		
		/**
		 * Function stops the scheduler
		 * 
		 * @function
		 * @name py.Scheduler#stop
		 * 
		 */
		stop: function(){
			this.__isRunning = false;
			clearInterval(this.__handle);
		},
		
		/**
		 * Function indicates if the scheduler is currently
		 * running.
		 * 
		 * @function
		 * @name py.Scheduler#isRunning
		 * 
		 * @returns {Boolean} is running
		 */
		isRunning: function(){
			return this.__isRunning;
		}
		
	}, $NS);
	
}(py));
