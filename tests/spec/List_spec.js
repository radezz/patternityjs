(function($NS){
	describe("List", function(){
		
		var listInstance;
		
		describe("#construct", function(){
			it("should create a List instance", function(){
				listInstance = new $NS.List();
				expect(listInstance).toBeDefined();
				expect(listInstance.__elements instanceof Array).toBeTruthy();
			});
		});
		
		describe("#add",function(){
			it("should add element to the list",function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				expect(listInstance.__elements.length).toBe(1);
				expect(listInstance.__elements[0]).toBe('hello');
			});
		});
		
		describe("#getAt", function(){
			it("should return alement at provided position", function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				listInstance.add('bye');
				
				var elem = listInstance.getAt(1);
				expect(elem).toBe('bye');
			});
		});
		
		describe("#indexOf", function(){
			it("should get index of an element on the list", function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				listInstance.add('bye');
				listInstance.add('aloha');
				
				var idx = listInstance.indexOf("hello");
				expect(idx).toBe(0);
				
			});
			
			it("should return -1 if element is not on the list", function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				listInstance.add('bye');
				listInstance.add('aloha');
				
				var idx = listInstance.indexOf("morning");
				expect(idx).toBe(-1);
			});
		});
		
		describe("#hasElement", function(){
			it("should return true if element is on the list", function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				listInstance.add('bye');
				listInstance.add('aloha');
				
				expect(listInstance.hasElement('bye')).toBeTruthy();
			});
			
			it("should return false if element is not on the list", function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				listInstance.add('bye');
				
				expect(listInstance.hasElement('mogning')).toBeFalsy();
			})
		});
		
		describe("#unique", function(){
			it("should narrow the List to unique elements only", function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				listInstance.add('bye');
				listInstance.add('bye');
				listInstance.add('hello');
				listInstance.add('aaaa');
				
				listInstance.unique();
				expect(listInstance.__elements.length).toBe(3);
				expect(listInstance.__elements[0]).toBe('aaaa');
				expect(listInstance.__elements[1]).toBe('hello');
				expect(listInstance.__elements[2]).toBe('bye');
			});
		});
		
		describe("#removeAt", function(){
			it("should remove alement at provided index", function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				listInstance.add('bye');
				listInstance.add('aloha');
				
				listInstance.removeAt(1);
				
				expect(listInstance.__elements.length).toBe(2);
				expect(listInstance.__elements[1]).not.toBe('bye');
			});
		});
		
		describe("#getElements", function(){
			it("should return the array of elements on the list", function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				listInstance.add('bye');
				
				var elems = listInstance.getElements();
				expect(elems instanceof Array).toBeTruthy();
				expect(elems[0]).toBe('hello');
				expect(elems[1]).toBe('bye');
			});
		});
		
		describe("#iterator", function(){
			it("should return an IIterator object for iterating the list", function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				listInstance.add('bye');
				
				var iter = listInstance.iterator();
				expect(iter).toBeDefined();
				expect(iter instanceof $NS.IIterator).toBeTruthy();
			});
			
			it("should return iterator which refers to current list elements", function(){
				listInstance = new $NS.List();
				listInstance.add('hello');
				listInstance.add('bye');
				
				var iter = listInstance.iterator();
				expect(iter.currentItem()).toBe('hello');
				iter.next();
				expect(iter.currentItem()).toBe('bye');
			});
		});
		
	});
}(py));
