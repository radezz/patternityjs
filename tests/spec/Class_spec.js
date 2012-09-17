(function($NS){
	
	describe("Class", function(){
		
		it("should create a constructable object", function(){
			var klass = $NS.Class({
				construct: function(){
					this.prop = "hello";
				}
			});
			
			var instance = new klass();
			
			expect(klass).toBeDefined();
			expect(typeof(klass)).toBe("function");
			expect(instance).toBeDefined();
			expect(instance.prop).toBe("hello");
			expect(instance instanceof klass).toBeTruthy();
		});
		
		it("should throw an error when no arguments are specified", function(){
			function creator(){
				var klass = $NS.Class();
			}
			
			expect(creator).toThrow();
		});
		
		it("should throw an error when firs argument is not a string or object", function(){
			
			function creator(){
				var klass = $NS.Class(function(){});
			}
			function creator2(){
				var klass = $NS.Class(2);
			}
			function creator3(){
				var klass = $NS.Class(null);
			}
			expect(creator).toThrow();
			expect(creator2).toThrow();
			expect(creator3).toThrow();
		});
		
		it("should throw an error when namespace provided as string but wrong object definition", function(){
			function creator(){
				var klass = $NS.Class("ns",function(){});
			}
			function creator2(){
				var klass = $NS.Class("ns",2);
			}
			function creator3(){
				var klass = $NS.Class("ns",null);
			}
			expect(creator).toThrow();
			expect(creator2).toThrow();
			expect(creator3).toThrow();
		});
		
		it("should create a constructable object within provided namespace", function(){
			$NS.Class("my.name.space.klass", {
				construct: function(){
					this.prop = "hello";
				}
			});
			
			expect(my.name.space.klass).toBeDefined();
			var instance = new my.name.space.klass();
			expect(instance).toBeDefined();
			expect(instance.prop).toBe("hello");
		});
		
		it("should extend the parent class", function(){
			var theParent = $NS.Class({
				construct: function(name){
					this.name = name;
					this.age = 40;
				},
				
				getName: function(){
					return this.name;
				},
				
				getAge: function(){
					return this.age;
				}
			});
			
			var theChild = $NS.Class({
				Extends: theParent,
				
				construct: function(name, surname){
					this._parent.construct.call(this, name);
					this.surname = surname;
				},
				
				getSurname: function(){
					return this.surname;
				},
				
				getAge: function(){
					return 20;
				}
			});
			
			var childInstance = new theChild('Jan', 'Kowalski');
			
			expect(childInstance.name).toBe("Jan");
			expect(childInstance.surname).toBe("Kowalski");
			expect(childInstance.getName()).toBe("Jan");
			expect(childInstance.getSurname()).toBe("Kowalski");
			expect(childInstance.getAge()).toBe(20);
			
		});
	});
	
}(patternity));
