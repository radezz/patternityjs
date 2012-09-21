(function($NS){
	
	describe("Timer", function(){
		
		var timer;
		
		describe("#construct", function(){
			it("should create a Timer instance", function(){
				timer = new $NS.Timer(10);
				
				expect(timer).toBeDefined();
				expect(timer.__tasks.length).toBe(0);
				expect(timer.__isRunning).toBeFalsy();
				expect(timer.__interval).toBe(10);
				expect(timer.__handle).toBe(null);
			});
			
			it("should throw an error when interval is not provided", function(){
				function creator(){
					timer = new $NS.Timer();	
				}
				expect(creator).toThrow();
			});
			
			it("should throw an error if interval is not a number", function(){
				function creator(){
					timer = new $NS.Timer('100');	
				}
				expect(creator).toThrow();
			});
			
			it("should throw an error if interval is zero or less", function(){
				function creator(){
					timer = new $NS.Timer(-1);	
				}
				expect(creator).toThrow();
			});
		});
		
		describe("#addTask", function(){
			it("should add a task to Timer for future execution", function(){
				timer = new $NS.Timer(100);
				function task(){};
				timer.addTask(task);
				expect(timer.__tasks[0]).toBe(task);
			});
			
			it("should throw an exception when adding not a function", function(){
				timer = new $NS.Timer(100);
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
			it("should reset all tasks added and stop the running timer", function(){
				timer = new $NS.Timer(100);
				timer.addTask(function(){});
				timer.addTask(function(){});
				timer.reset();
				expect(timer.__tasks.length).toBe(0);
			});
		});
		
		describe("#run", function(){
			it("should run the timer and execute all tasks", function(){
				var t1 = 0,
					t2 = 0;
				
				timer = new $NS.Timer(100);	
				timer.addTask(function(){
					t1++;
				});
				timer.addTask(function(){
					t2++;
				});
				
				runs(function(){
					timer.run();	
				});
				
				waits(150);
				
				runs(function(){
					timer.stop();
					expect(t1).toBe(1);
					expect(t2).toBe(1);	
				});
				
			});
			
			it("should run timer and add function if specified as argument", function(){
				var t1 = 0;
				timer = new $NS.Timer(100);
				
				runs(function(){
					timer.run(function(){
						t1++;
					});
				})
				
				waits(100);
				
				runs(function(){
					timer.stop();
					expect(t1).toBe(1);
				});
			})
		});
		
		describe("#stop",function(){
			it("should stop running timer and prevent tasks execution", function(){
				timer = new $NS.Timer(100);
				var t1 = 0,
					t2 = 0;
					
				timer.addTask(function(){
					t1++;
				});
				timer.addTask(function(){
					t2++;
				});
				
				runs(function(){
					timer.run();
					timer.stop();	
				});
				
				waits(150);
				
				runs(function(){
					expect(t1).toBe(0);
					expect(t2).toBe(0);	
				});
			});
		});
		
		describe("#isRunning", function(){
			it("should return true if the timer is running", function(){
				timer = new $NS.Timer(100);
				timer.run(function(){});
				expect(timer.isRunning()).toBeTruthy();
				timer.stop();
			});
		});
		
	});
	
}(patternity));
