(function($NS){
	
	describe("ListOf",function(){
		
		var listInstance;
		
		describe("#construct", function(){
			it("should create an ListOf Instance", function(){
				listInstance = new $NS.ListOf(Number);
				
				expect(listInstance).toBeDefined();
				expect(listInstance.__of).toBe(Number);
			});
			
			it("should throw exception if no type is provided", function(){
				function creator(){
					listInstance = new $NS.ListOf();
				}
				
				expect(creator).toThrow();
			});
			
			it("should throw exception when type is not a constructor/function", function(){
				function creator(){
					listInstance = new $NS.ListOf(4);
				}
				
				expect(creator).toThrow();
			});
		});
		
		describe("#add", function(){
			
			it("should throw an exception if they type is invalid", function(){
				listInstance = new $NS.ListOf(Number);
				
				function adderOne(){
					listInstance.add('hello');
				}
				
				expect(adderOne).toThrow();
				
				$NS.Class('Person', {
					initialize: function(){
						this.name = 'John Doe';
					}
				})
				
				listInstance = new $NS.ListOf(Person);
				
				function adderTwo(){
					listInstance.add(4);
				}
				
				expect(adderTwo).toThrow();
			});
			
			it("should add element to the list if the type is correct", function(){
				listInstance = new $NS.ListOf(String);
				
				function adderOne(){
					listInstance.add('hello');
					expect(listInstance.getAt(0)).toBe('hello');
				}
				
				expect(adderOne).not.toThrow();
				
				$NS.Class('Person', {
					initialize: function(){
						this.name = 'John Doe';
					}
				})
				
				listInstance = new $NS.ListOf(Person);
				
				function adderTwo(){
					listInstance.add(new Person());
					expect(listInstance.getAt(0) instanceof Person).toBeTruthy();
				}
				
				expect(adderTwo).not.toThrow();
			});
			
		});
		
		describe("#execute",function(){
			it("should execute function on all elements", function(){
				$NS.Class('Person', {
					initialize: function(){},
					getValue: function(value){
						return value;
					}
				});
				
				listInstance = new $NS.ListOf(Person);
				listInstance.add(new Person());
				listInstance.add(new Person());
				listInstance.add(new Person());
				
				var results = listInstance.execute('getValue','hello');
				expect(results.length).toBe(3);
				expect(results[0]).toBe("hello");
				expect(results[1]).toBe("hello");
				expect(results[2]).toBe("hello");
			});
		});
		
		describe("#setAll", function(){
			it("should set a property value to all objects on the list", function(){
				var name = "John Doe";
				$NS.Class('Person', {
					initialize: function(){},
					getValue: function(value){
						return value;
					}
				});
				
				listInstance = new $NS.ListOf(Person);
				listInstance.add(new Person());
				listInstance.add(new Person());
				listInstance.add(new Person());
				
				listInstance.setAll("name", name);
				expect(listInstance.getAt(0).name).toBe(name);
				expect(listInstance.getAt(1).name).toBe(name);
				expect(listInstance.getAt(2).name).toBe(name);
			})
		});
		
	});
	
}(py))
