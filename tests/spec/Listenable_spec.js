(function($NS){
	
	describe("Listenable", function(){
		var listenInstance;
		
		describe("#construct",function(){
			it("should create Listenable instance", function(){
				listenInstance = new $NS.Listenable();
				
				expect(listenInstance).toBeDefined();
				expect(typeof(listenInstance.__registry)).toBe('object');
			})			
		});
		
		describe("#addListener", function(){
			
			beforeEach(function(){
				listenInstance = new $NS.Listenable();
			});
			
			it("should add an event listener for specified event", function(){
				function myListener(){};
				
				listenInstance.addListener('myEvent', myListener);
				
				expect(listenInstance.__registry['myEvent'][0]).toBe(myListener);
			});
			
			it("should add multiple events listeners", function(){
			    function ml1(){};
			    function ml2(){};
			    function ml3(){};
			    
			    listenInstance.addListener({
			        'ev1': ml1,
			        'ev2': ml2,
			        'ev3': ml3,
			    });
			    
			    expect(listenInstance.__registry['ev1'][0]).toBe(ml1);
			    expect(listenInstance.__registry['ev2'][0]).toBe(ml2);
			    expect(listenInstance.__registry['ev3'][0]).toBe(ml3);
			    
			});
			
			it("should throw an error when listener is not and object or function", function(){
				function adderNumber(){
					listenInstance.addListener('myEvent', 4);
				}
				function adderString(){
					listenInstance.addListener('myEvent', 'fail');
				}
				function adderBoolean(){
					listenInstance.addListener('myEvent', false);
				}
				function adderNull(){
					listenInstance.addListener('myEvent', null);
				}
				function adderFunction(){
					listenInstance.addListener('myEvent', function(){});
				}
				
				expect(adderNumber).toThrow();
				expect(adderString).toThrow();
				expect(adderBoolean).toThrow();
				expect(adderNull).toThrow();
				expect(adderFunction).not.toThrow();
			});
			
			
		});
		
		describe("#removeListener", function(){
			it("should remove added listener from the registry", function(){
				listenInstance = new $NS.Listenable();
				function myListener(){};
				listenInstance.addListener('myEvent', myListener);
				listenInstance.removeListener('myEvent', myListener);
				expect(listenInstance.__registry['myEvent'].length).toBe(0);
			});
		});
		
		describe("#removeListeners", function(){
			it("should remove all listeners for provided event", function(){
				listenInstance = new $NS.Listenable();
				function myListener(){};
				function mySecondListener(){};
				
				listenInstance.addListener('myEvent', myListener);
				listenInstance.addListener('myEvent', mySecondListener);
				
				expect(listenInstance.__registry['myEvent'].length).toBe(2);
				
				listenInstance.removeListeners('myEvent');
				expect(listenInstance.__registry['myEvent']).not.toBeDefined();
			});
		});
		
		describe("#dispatchEvent", function(){
			it("should fire all listeners attached to the event with provided arguments",function(){
				var fired = 0,
					argVal = 'hello',
				
				listenInstance = new $NS.Listenable();
				function myListener(arg){
					fired++;
					expect(arg).toBe(argVal);
				}
				function mySecondListener(arg){
					fired++;
					expect(arg).toBe(argVal);
				}
				var listener = {
					'onEvent': function(arg){
						fired++;
						expect(arg).toBe(argVal);
					}
				};
				function differentListener(){
					fired++;
				}				
				
				listenInstance.addListener('onEvent',myListener);
				listenInstance.addListener('onEvent',mySecondListener);
				listenInstance.addListener('onEvent',listener);
				listenInstance.addListener('onDifferentEvent',differentListener);
				
				listenInstance.dispatchEvent('onEvent',argVal);
				
			});
		});
		
	});
	
}(patternity));
