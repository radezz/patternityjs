(function($NS){
    
    describe("Observable", function() {
        var observableInstance;
        
        beforeEach(function(){
        	observableInstance = new $NS.Observable();
        });
        
        it("should create an Observable instance", function() {
            observableInstance = new $NS.Observable();
           
            expect(observableInstance).toBeDefined();
            expect(observableInstance.__observers).toBeDefined();
        });
        
        it("should set the property", function(){
            observableInstance.set("property", "theValue");
            expect(observableInstance.property).toEqual("theValue"); 
        });
        
        it("should get the property value", function(){
        	var value = "the value";
        	observableInstance.set("property", value);
        	expect(observableInstance.get("property")).toEqual(value);
        });
        
        it("should add the observer for property", function(){
           function observer(){};
           observableInstance.observe("property", observer);
           expect(observableInstance.__observers["property"][0]).toEqual(observer);
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

}(patternity));


