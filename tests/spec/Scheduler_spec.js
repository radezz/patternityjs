(function($NS){
	
	describe("Scheduler", function(){
		
		var scheduler;
		
		describe("#construct", function(){
			it("should create a Scheduler instance", function(){
				scheduler = new $NS.Scheduler(10);
				
				expect(scheduler).toBeDefined();
				expect(scheduler.__tasks.length).toBe(0);
				expect(scheduler.__isRunning).toBeFalsy();
				expect(scheduler.__interval).toBe(10);
				expect(scheduler.__handle).toBe(null);
			});
			
			it("should throw an error when interval is not provided", function(){
				function creator(){
					scheduler = new $NS.Scheduler();	
				}
				expect(creator).toThrow();
			});
			
			it("should throw an error if interval is not a number", function(){
				function creator(){
					scheduler = new $NS.Scheduler('100');	
				}
				expect(creator).toThrow();
			});
			
			it("should throw an error if interval is zero or less", function(){
				function creator(){
					scheduler = new $NS.Scheduler(-1);	
				}
				expect(creator).toThrow();
			});
		});
		
		describe("#addTask", function(){
			it("should add a task to Scheduler for future execution", function(){
				scheduler = new $NS.Scheduler(100);
				function task(){};
				scheduler.addTask(task);
				expect(scheduler.__tasks[0].action).toBe(task);
			});
			
			it("should add task to Scheduler along with provided context of execution", function(){
				scheduler = new $NS.Scheduler(100);
				var ctx = {};
				function task(){};
				scheduler.addTask(task, ctx);
				expect(scheduler.__tasks[0].action).toBe(task);
				expect(scheduler.__tasks[0].ctx).toBe(ctx);
			});
			
			it("should throw an exception when adding not a function", function(){
				scheduler = new $NS.Scheduler(100);
				function adderNumber(){
					time.addTask(1);
				}
				function adderString(){
					time.addTask('1');
				}
				function adderObject(){
					time.addTask({});
				}
				function adderBoolean(){
					time.addTask(true);
				}
				
				expect(adderNumber).toThrow();
				expect(adderString).toThrow();
				expect(adderObject).toThrow();
				expect(adderBoolean).toThrow();
			});
		});
		
		describe("reset", function(){
			it("should reset all tasks added and stop the running scheduler", function(){
				scheduler = new $NS.Scheduler(100);
				scheduler.addTask(function(){});
				scheduler.addTask(function(){});
				scheduler.reset();
				expect(scheduler.__tasks.length).toBe(0);
			});
		});
		
		describe("#run", function(){
			it("should run the scheduler and execute all tasks in proper contexts", function(){
				var t1 = 0,
					t2 = 0;
				
				var ctx = {};
				
				scheduler = new $NS.Scheduler(100);	
				scheduler.addTask(function(){
					t1++;
					expect(this).toBe(window);
				});
				scheduler.addTask(function(){
					t2++;
					expect(this).toBe(ctx);
				}, ctx);
				
				runs(function(){
					scheduler.run();	
				});
				
				waits(150);
				
				runs(function(){
					scheduler.stop();
					expect(t1).toBe(1);
					expect(t2).toBe(1);	
				});
				
			});
			
			it("should run scheduler and add function if specified as argument", function(){
				var t1 = 0;
				scheduler = new $NS.Scheduler(100);
				
				runs(function(){
					scheduler.run(function(){
						t1++;
					});
				})
				
				waits(100);
				
				runs(function(){
					scheduler.stop();
					expect(t1).toBe(1);
				});
			})
		});
		
		describe("#stop",function(){
			it("should stop running scheduler and prevent tasks execution", function(){
				scheduler = new $NS.Scheduler(100);
				var t1 = 0,
					t2 = 0;
					
				scheduler.addTask(function(){
					t1++;
				});
				scheduler.addTask(function(){
					t2++;
				});
				
				runs(function(){
					scheduler.run();
					scheduler.stop();	
				});
				
				waits(150);
				
				runs(function(){
					expect(t1).toBe(0);
					expect(t2).toBe(0);	
				});
			});
		});
		
		describe("#isRunning", function(){
			it("should return true if the scheduler is running", function(){
				scheduler = new $NS.Scheduler(100);
				scheduler.run(function(){});
				expect(scheduler.isRunning()).toBeTruthy();
				scheduler.stop();
			});
		});
		
	});
	
}(patternity));
