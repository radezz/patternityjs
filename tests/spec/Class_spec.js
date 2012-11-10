(function($NS){
	
	describe("Class", function(){
		
		var pckg = {};
		
		it("should create a constructable object", function(){
			var klass = $NS.Class('klass', {
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
		
		it("should throw an error when firs argument is not a string (class name)", function(){
			
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
		
		it("should throw an error when there is wrong object definition", function(){
			function creator(){
				var klass = $NS.Class("klass",function(){});
			}
			function creator2(){
				var klass = $NS.Class("klass",2);
			}
			function creator3(){
				var klass = $NS.Class("klass",null);
			}
			expect(creator).toThrow();
			expect(creator2).toThrow();
			expect(creator3).toThrow();
		});
		
		it("should create a constructable object within provided namespace", function(){
			$NS.Class("klass", {
				construct: function(){
					this.prop = "hello";
				}
			}, "my.name.space");
			
			expect(my.name.space.klass).toBeDefined();
			var instance = new my.name.space.klass();
			expect(instance).toBeDefined();
			expect(instance.prop).toBe("hello");
		});
		
		it("should extend the parent class", function(){
			$NS.Class('theParent',{
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
			
			$NS.Class('theChild' ,{
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
		
		it("should throw an error when interface implementation is missing", function(){
			function creator(){
				var interf = {
					getAge: function(){},
					getName: function(){}
				}
				
				$NS.Class('klass',{
					Implements: interf,
					constructs: function(){
						//the constructor
					},
					getAge: function(){
						//but getName missing
					}
				})
				
				var instance = new klass();
			}
			
			expect(creator).toThrow();
		});
		
		it("should throw an error when one of multiple implemented interface's function is missing",function(){
			function creator(){
				var interfOne = {
					getAge: function(){},
				},
				interfTwo = {
					getName: function(){}
				};
				
				$NS.Class('klass',{
					Implements: [interfOne, interfTwo],
					constructs: function(){
						//the constructor
					},
					getAge: function(){
						//but getName missing
					}
				})
				
				var instance = new klass();
			}
			
			expect(creator).toThrow();
		});
		
		it("should not throw an error if interface functions are implemented within class", function(){
			function creator(){
				var interfOne = {
					getAge: function(){},
				},
				interfTwo = {
					getName: function(){}
				};
				
				$NS.Class('klass',{
					Implements: [interfOne, interfTwo],
					constructs: function(){
						//the constructor
					},
					getAge: function(){
						
					},
					getName: function(){
						
					}
				})
				
				var instance = new klass();
			}
			
			expect(creator).not.toThrow();
		});
		
		it("should mix-in the object properties and functions into the class",function(){
			
			var toBeMixed = {
				num: 1,
				func: function(){
					return this.name;
				}
			};

			$NS.Class('klass',{
				Mixin: toBeMixed,
				construct: function(){
					//hello world
				},
				name: 'Tom'
			})
			
			var instance = new klass();
			
			expect(typeof(instance.func)).toBe('function');
			expect(instance.func()).toBe('Tom');
			expect(instance.num).toBe(1)
			
		});
		
		it("should mix-in multiple mixin objects with favor for last mixed in", function(){
			
			var toBeMixed = {
				num: 1,
				func: function(){
					return this.name;
				}
			};
			
			var toBeMixedTwo = {
				num: 1,
				func: function(){
					return this.num;
				},
				func2: function(){
					return this.name;
				}
			};

			$NS.Class('klass', {
				Mixin: [toBeMixed, toBeMixedTwo],
				construct: function(){
					//hello world
				},
				name: 'Tom'
			})
			
			var instance = new klass();
			
			expect(typeof(instance.func)).toBe('function');
			expect(typeof(instance.func2)).toBe('function');
			expect(instance.func()).toBe(1);
			expect(instance.num).toBe(1)
		});
		
	});
	
}(py));
