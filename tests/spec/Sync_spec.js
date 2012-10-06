(function($NS){
	
	describe("Sync", function(){
		var sync;
		
		describe("#construct", function(){
			it("should create Sync instance", function(){
				sync = new $NS.Sync();
				expect(sync).toBeDefined();
				expect(sync.__registry).toBeDefined();
				expect(sync.__synchornized).toBeFalsy();
			});
			
			it("should set parameters and on ready callback if specified", function(){
				function onAll(){};
				
				sync = new $NS.Sync({
					synchronize: true,
					onAllReady: onAll
				});
				
				expect(sync).toBeDefined();
				expect(sync.__synchronize).toBeTruthy();
				expect(sync.onAllReady).toBe(onAll);
			});
		});
		
		describe('#clear', function(){
			it("should clear internal aspect registry", function(){
				var ns = {
					fn : function (){}
				};
				
				sync = new $NS.Sync();
				sync.addHandler(ns, 'fn');
				expect(sync.__registry['0']).toBeDefined();
				sync.clear();
				expect(sync.__registry['0']).not.toBeDefined();
			});
		})
		
		describe("#isAllReady",function(){
			it("should return true if all apsects are ready or fired", function(){
				var ns = {
					fn : function (){}
				};
				sync = new $NS.Sync();
				sync.addHandler(ns, 'fn');
				sync.__registry['0'].isReady = true;
				expect(sync.isAllReady()).toBeTruthy();
				sync.clear();
				expect(sync.isAllReady()).toBeTruthy();
			});
			
			it("should return false if there are still waiting aspects", function(){
				var ns = {
					fn : function (){}
				}
				sync = new $NS.Sync();
				sync.addHandler(ns, 'fn');
				expect(sync.isAllReady()).toBeFalsy();
			})
		});
		
		describe("#addHandler", function(){
			it("should register handler into aspect registry", function(){
				var ns = {
					fn : function (){}
				};
				sync = new $NS.Sync();
				
				sync.addHandler(ns, 'fn');
				expect(sync.__registry['0']).toBeDefined();
				expect(sync.__registry['0'].handler).not.toBe(ns.fn);
			});
		});
		
		describe('#onAllReady', function(){
			it("should be called when all aspects were fired", function(){
				var calls = 0;
				var ns = {
					fn : function (){}
				};
				sync = new $NS.Sync();
				sync.addHandler(ns, 'fn');
				sync.onAllReady = function(){
					calls++;
				};
				
				ns.fn();
				expect(calls).toBe(1);
			});
			
			it("should not be called when all aspects were not fired", function(){
				var calls = 0;
				var ns = {
					fn : function (){},
					gn: function(){}
				};
				sync = new $NS.Sync();
				sync.addHandler(ns, 'fn');
				sync.addHandler(ns, 'gn');
				sync.onAllReady = function(){
					calls++;
				};
				
				ns.fn();
				expect(calls).not.toBe(1);
			});
		});
		
		describe("#registered handlers", function(){
			it("should called directly if synchronise is set to false", function(){
				var calls = 0;
				var ns = {
					fn : function (num){calls+=num},
					gn: function(num){calls+=num}
				};
				
				sync = new $NS.Sync();
				sync.addHandler(ns, 'fn');
				sync.addHandler(ns, 'gn');
				
				ns.fn(2);
				expect(calls).toBe(2);
				ns.gn(3);
				expect(calls).toBe(5);
				
			});
			
			it("should be called at once when synchornized is set to true", function(){
				var calls = 0;
				var ns = {
					fn : function (num){calls+=num},
					gn: function(num){calls+=num}
				};
				
				sync = new $NS.Sync({
					synchronize: true
				});
				sync.addHandler(ns, 'fn');
				sync.addHandler(ns, 'gn');
				
				ns.fn(2);
				expect(calls).toBe(0);
				ns.gn(3);
				expect(calls).toBe(5);
				
			});
			
			it("should be called with owning namespace or object context", function(){
				var ns = {
					fn : function (num){
						expect(this).toBe(ns);
					},
					gn: function(num){
						expect(this).toBe(ns);
					}
				};
				
				sync = new $NS.Sync({
					synchronize: true
				});
				sync.addHandler(ns, 'fn');
				sync.addHandler(ns, 'gn');
				
				ns.fn();
				ns.gn();
			});
			
			it("should be called with specified context if provided", function(){
				var ctx = {};
				
				var ns = {
					fn : function (num){
						expect(this).toBe(ctx);
					},
					gn: function(num){
						expect(this).toBe(ctx);
					}
				};
				
				sync = new $NS.Sync({
					synchronize: true
				});
				sync.addHandler(ns, 'fn', ctx);
				sync.addHandler(ns, 'gn', ctx);
				
				ns.fn();
				ns.gn();
			});
		});
	});
	
}(patternity))
