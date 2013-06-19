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
			});
		});
		
		describe("createObject", function () {
		  
		  it("should create object with a given prototype", function () {
		      var ob = $NS.createObject({
		          prop: 'val'
		      });
		      
		      expect(ob).toBeDefined();
		      expect(ob.prop).toBe('val');
		      
		  });
		  
		  it("should create object where modifying prototype is not possible", function() {
		      var proto = {
		          prop1: 'val1'
		      };
		  
		      var ob = $NS.createObject(proto);
		      
		      expect(ob).toBeDefined();
		      ob.prop2 = 'val2';
		      expect(proto.prop2).not.toBeDefined();
		  });
		  
		  it("should create object using array as prototype and not allow proto modification", function () {
		      var proto = [];
		      
		      var ob =  $NS.createObject(proto);
		      expect(ob instanceof Array).toBeTruthy();
		      ob.push(1);
		      expect(proto.length).toBe(0);
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
