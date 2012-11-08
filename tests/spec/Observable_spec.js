(function($NS){
    
    describe("Observable", function() {
        var observableInstance;
        
        beforeEach(function(){
        	observableInstance = new $NS.Observable();
        });
        
        describe("#construct", function(){
        	it("should create an Observable instance", function() {
	            observableInstance = new $NS.Observable();
	           
	            expect(observableInstance).toBeDefined();
	            expect(observableInstance.__observers).toBeDefined();
	        });
        });
        
        describe("#set",function(){
        	it("should set the property", function(){
	            observableInstance.set("property", "theValue");
	            expect(observableInstance.property).toEqual("theValue"); 
	        });
	        
	        it("should call the added observers when property is changed", function(){
            
	            var startVal = "hello",
	                newVal = "bye",
	                prop = "greet",
	                calls = 0;
	            
	            observableInstance.set(prop, startVal);
	            observableInstance.observe(prop, function (propName, val, oldVal){
	                calls++;
	                expect(oldVal).toEqual(startVal);
	                expect(val).toEqual(newVal);
	                expect(propName).toEqual(prop);
	            })
	            observableInstance.set(prop,newVal);
	            expect(calls).toEqual(1);
	        });
	        
	        it("should set multiple properties and trigger their observers", function(){
	            var calls = 0;
	            observableInstance.observe("name", function(){
	                calls++;
	            });
	            
	            observableInstance.observe("surname", function(){
                    calls++;
                });
	            
	            observableInstance.set({
	                "name": 'John',
	                "surname": 'Doe'
	            });
	            
	            expect(calls).toEqual(2);
	            expect(observableInstance.name).toBe('John');
	            expect(observableInstance.surname).toBe('Doe');
	            
	        });
        });
        
        
        describe("#get", function(){
        	it("should get the property value", function(){
	        	var value = "the value";
	        	observableInstance.set("property", value);
	        	expect(observableInstance.get("property")).toEqual(value);
	        });
        });
        
        describe("#observe",function(){
        	it("should add the observer for property", function(){
	           function observer(){};
	           observableInstance.observe("property", observer);
	           expect(observableInstance.__observers["property"][0]).toEqual(observer);
	        });
	        
	        it("should add observers to multiple properties", function(){
	            function ob1(){};
	            function ob2(){};
	            function ob3(){};
	            observableInstance.observe({
	                'prop1': ob1,
	                'prop2': ob2,
	                'prop3': ob3
	            });
	            
	            expect(observableInstance.__observers["prop1"][0]).toEqual(ob1);
	            expect(observableInstance.__observers["prop2"][0]).toEqual(ob2);
	            expect(observableInstance.__observers["prop3"][0]).toEqual(ob3);
	        });
        });
        
      
        describe("#removeObserver", function(){
        	it("should remove the observer for the property", function(){
	            var calls = 0;
	            function observer(){
	                calls++;
	            }
	            
	            observableInstance.observe("prop", observer);
	            observableInstance.removeObserver("prop", observer);
	            observableInstance.set("prop", "the value of prop");
	            
	            expect(calls).toEqual(0);
	            expect(observableInstance.__observers["prop"].length).toEqual(0);
	            
	        });
        });
        
        describe("#removeObservers", function(){
        	it("should remove all the observers for the property", function(){
	            var calls = 0;
	            
	            observableInstance.observe("prop", function(){
	                calls++;
	            });
	            observableInstance.observe("prop", function(){
	                calls++;
	            });
	            observableInstance.observe("prop", function(){
	                calls++;
	            });
	            
	            observableInstance.removeObservers("prop");
	            observableInstance.set("prop","the value");
	            expect(calls).toEqual(0);
	            expect(observableInstance.__observers["prop"]).not.toBeDefined();
	        });
        });
        
        describe("#callFunction", function(){
        	it("should call the object's function", function(){
	        	var calls = 0;
	        	observableInstance.theFunc = function(arg){
	        		calls++;
	        		expect(arg).toEqual("hello");
	        	};
	        	
	        	observableInstance.callFunction("theFunc","hello")
	        	expect(calls).toEqual(1);	
	        });
	        
	        it("should call the function observer", function(){
	        	var calls = 0;
	        	observableInstance.theFunc = function(arg){
	        		return "bye";
	        	};
	        	
	        	observableInstance.observe("theFunc", function(funcName, retVal, args){
	        		calls++;
	        		expect(funcName).toEqual("theFunc");
	        		expect(retVal).toEqual("bye");
	        		expect(args[0]).toEqual("hello");
	        	});
	        	observableInstance.callFunction("theFunc","hello");
	        	
	        	expect(calls).toEqual(1);
	        });
        });
        
        
        
        
      
    });

}(patternity));


