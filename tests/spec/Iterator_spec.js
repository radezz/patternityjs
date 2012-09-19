(function($NS){
	describe("Iterator", function(){
		
		var iterableArray = [4, 6, 7, 1, 10, 12],
			iterableObject = {
				'prop1': 'hello',
				'prop2': 'bye',
				'someOther': 'whazzup',
				'keyProp': 'otherValue'
			},
			iterableString = 'abcdefg';
		
		describe("#construct", function(){
			
			it("should create an iterator over the iterable array", function(){
				var arrayIterator = new $NS.Iterator(iterableArray);
				
				expect(arrayIterator).toBeDefined();
				expect(arrayIterator.first()).toBe(4);
			});
			
			it("should create an iterator over the iterable object", function(){
				var obIterator = new $NS.Iterator(iterableObject);
				expect(obIterator).toBeDefined();
				expect(obIterator.first()).toBe('hello');
			});
			
			it("should create an iterator over the iterable string", function(){
				var obIterator = new $NS.Iterator(iterableString);
				expect(obIterator).toBeDefined();
				expect(obIterator.first()).toBe('a');
			});
			
			it("should throw an error when creating iterator over the non iterable", function(){
				function creatorNull(){
					var iterator = new $NS.Iterator(null);
				}
				
				function creatorNumber(){
					var iterator = new $NS.Iterator(2);
				}
				
				function creatorFunction(){
					var iterator = new $NS.Iterator(function(){});
				}
				
				function creatorBool(){
					var iterator = new $NS.Iterator(true);
				}
				
				expect(creatorNull).toThrow();
				expect(creatorNumber).toThrow();
				expect(creatorFunction).toThrow();
				expect(creatorBool).toThrow();
			});
			
		});
		
		describe('#next', function(){
			it("should move iterator to point to next element when iterating array", function(){
				var iterator = new $NS.Iterator(iterableArray);
				
				iterator.next();
				iterator.next();
				iterator.next();
				
				expect(iterator.currentItem()).toBe(1);
			});
			
			it("should move iterator to point to next element when iterating object", function(){
				var iterator = new $NS.Iterator(iterableObject);
				
				iterator.next();
				iterator.next();
				iterator.next();
				
				expect(iterator.currentItem()).toBe("otherValue");
			});
			
			it("should move iterator to point to next element when iterating string", function(){
				var iterator = new $NS.Iterator(iterableString);
				
				iterator.next();
				iterator.next();
				iterator.next();
				
				expect(iterator.currentItem()).toBe("d");
			});
		});
		
		describe('#first', function(){
			it("should reset the iterator to point first element", function(){
				var iterator = new $NS.Iterator(iterableArray);
				
				iterator.next();
				iterator.next();
				iterator.next();
				iterator.first();
				
				expect(iterator.currentItem()).toBe(4);
			});
		});
		
		describe('#curretnItem', function(){
			it("should return current item iterator is pointing to", function(){
				var iterator = new $NS.Iterator(iterableArray);
		
				expect(iterator.currentItem()).toBe(4);
				
				iterator.next();
				iterator.next();
				iterator.next();
				
				expect(iterator.currentItem()).toBe(1);
			});
		});
		
		describe("#isDone", function(){
			it("should return true if the iterator finished iterating", function(){
				var iterator = new $NS.Iterator(iterableArray);
				
				iterator.next();
				iterator.next();
				
				expect(iterator.isDone()).toBeFalsy();
				
				iterator.next();
				iterator.next();
				iterator.next();
				iterator.next();
				iterator.next();
				
				expect(iterator.isDone()).toBeTruthy();
				expect(iterator.currentItem()).not.toBeDefined();
			});
		});
		
		describe("#each", function(){
			it("should call user defined function over all iterable elements", function(){
				var numOfCall = 0;
				var iterator = new $NS.Iterator(iterableArray);
				
				iterator.each(function(element, idx){
					numOfCall++;
					expect(iterator.__iterable[idx]).toBe(element);
				});
				
				expect(numOfCall).toEqual(iterator.__iterable.length);
			});
		});
		
	})
}(patternity));
