(function($NS){
	
	describe("Interface",function(){
		
		it("should create and interface object according to the definition", function(){
			
			var ISaveable = $NS.Interface({
				save: function(){},
				cache: function(){}
			});
			
			expect(ISaveable).toBeDefined();
			expect(typeof(ISaveable)).toBe('function');
			expect(typeof(ISaveable.bind)).toBe('function');
			expect(ISaveable.prototype.save).toBeDefined();
			expect(ISaveable.prototype.cache).toBeDefined();
			
		});
		
		it("should throw an error when no arguments are specified", function(){
			function creator(){
				var IKlass = $NS.Interface();
			}
			
			expect(creator).toThrow();
		});
		
		it("should throw an error when firs argument is not a string or object", function(){
			
			function creator(){
				var IKlass = $NS.Interface(function(){});
			}
			function creator2(){
				var IKlass = $NS.Interface(2);
			}
			function creator3(){
				var IKlass = $NS.Interface(null);
			}
			expect(creator).toThrow();
			expect(creator2).toThrow();
			expect(creator3).toThrow();
		});
		
		it("should throw an error when namespace provided as string but wrong object definition", function(){
			function creator(){
				var IKlass = $NS.Interface("ns",function(){});
			}
			function creator2(){
				var IKlass = $NS.Interface("ns",2);
			}
			function creator3(){
				var IKlass = $NS.Interface("ns",null);
			}
			expect(creator).toThrow();
			expect(creator2).toThrow();
			expect(creator3).toThrow();
		});
		
		it("should create an Interface object within provided namespace", function(){
			$NS.Interface("my.name.space.ISaveable", {
				save: function(){},
				cache: function(){}
			});
			
			expect(my.name.space.ISaveable).toBeDefined();
			expect(typeof(my.name.space.ISaveable)).toBe('function');
			expect(typeof(my.name.space.ISaveable.bind)).toBe('function');
		});
		
		it("should bind the interface to the object", function(){
			var ISaveable = $NS.Interface({
				save: function(){},
				cache: function(){}
			});
			
			var DataObject = $NS.Class({
				construct: function(data){
					this._data = data;
				},
				save: function(){
					return 'object saved';
				},
				cache: function(){
					return 'object cached';
				}
			});
			
			function binder(){
				var instance = new DataObject('precious'),
					iSave = new ISaveable(instance);
					
					expect(iSave).toBeDefined();
					expect(iSave._data).not.toBeDefined();
					expect(iSave.save()).toBe('object saved');
					expect(iSave.cache()).toBe('object cached');
			}
			
			function binderTwo(){
				var instance = new DataObject('precious'),
					iSave = ISaveable.bind(instance);
					
					expect(iSave).toBeDefined();
					expect(iSave._data).not.toBeDefined();
					expect(iSave.save()).toBe('object saved');
					expect(iSave.cache()).toBe('object cached');
			}
			
			
			expect(binder).not.toThrow();
			expect(binderTwo).not.toThrow();
		});
		
		it("should throw an error when bind target does not implement the functionality", function(){
			var ISaveable = $NS.Interface({
				save: function(){},
				cache: function(){}
			});
			
			var DataObject = $NS.Class({
				construct: function(data){
					this._data = data;
				}
			});
			
			function binder(){
				var instance = new DataObject('precious'),
					iSave = new ISaveable(instance);
			}
			
			expect(binder).toThrow();
		});
		
		it("should throw an error when bind target is not an existing object", function(){
			var ISaveable = $NS.Interface({
				save: function(){},
				cache: function(){}
			});
			
			function binder(){
				var iSave = new ISaveable(null);
			}
			
			expect(binder).toThrow();
		})
	});
	
}(patternity));
