(function($NS){
	describe("utils", function(){
		
		describe("#createNS", function(){
			it("should create namespace", function(){
				$NS.createNS('my.name.space');
				expect(my.name.space).toBeDefined();
			});
		});
		
		describe("#mixin", function(){
			it("should mixin one object into another", function(){
				var ob1 = {
					name: "John"
				};
				
				var ob2 = {
					surname: "Doe"
				};
				
				$NS.mixin(ob2, ob1);
				
				expect(ob2.name).toBe("John");
				expect(ob2.surname).toBe("Doe");
			});
			
			it("should mixin multiple objects into the target object", function(){
				var ob = {};
				
				$NS.mixin(ob, [{name: "John"}, {surname: "Doe"}]);
				
				expect(ob.name).toBe("John");
				expect(ob.surname).toBe("Doe");
			});
			
			it("should overwrite target object property with mixed in", function(){
				var ob = {name: "Alex"};
				$NS.mixin(ob,{name: "John"});
				
				expect(ob.name).toBe("John");
			});
		});
		
		describe("#extend", function(){
			it("should extend target constructor using prototype inheritance", function(){
				function classA(){};
				classA.prototype.setName = function(n){
					this.name = n;
				}
				
				function classB(){};
				
				$NS.extend(classB, classA);
				
				expect(classB.prototype.setName).toBe(classA.prototype.setName);
				expect(classB.prototype._parent).toBe(classA.prototype);
			});
		});
		
		describe("isDefined", function(){
			it("should return true if object is not a null or undefined", function(){
				expect($NS.isDefined(0)).toBeTruthy();
				expect($NS.isDefined("")).toBeTruthy();
				expect($NS.isDefined({})).toBeTruthy();
			});
			
			it("should return false if object is null or undefined", function(){
				expect($NS.isDefined(null)).toBeFalsy();
				expect($NS.isDefined(undefined)).toBeFalsy();
			});
		});
		
	});
}(py.utils));
