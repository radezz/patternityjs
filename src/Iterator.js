(function($NS){

    /**
     * Function transforms an object into 
     * iterable array
     * 
     * @param {Object} obj
     * 
     * @returns {Array}
     */
	function objectToIterable(obj){
		var key,
			iterable = [];
			
		for(key in obj){
			if(obj.hasOwnProperty(key)){
				iterable.push(obj[key]);
			}
		}
		
		return iterable;
	}
	
    /**
     * Iterator. 
     * Creates an instance of Iterator object which can be used 
     * to iterate over the objects, arrays, and strings.
     * 
     * @class
     * @constructor
     */
	$NS.Iterator = $NS.Class({
		Implements: $NS.IIterable,
		construct: function(iterableObject){
			
			if(iterableObject instanceof Array){
				this.__iterable = iterableObject;
			}else if(iterableObject && typeof(iterableObject) === 'object'){
				this.__iterable = objectToIterable(iterableObject);
			}else if(iterableObject && typeof(iterableObject) === 'string'){
				this.__iterable = iterableObject.split('');
			}else{
				throw 'non iterable';
			}
			
			this.__currentItem = null;
			this.__index = null;
			this.first();
		},
		
		/**
		 * Function returns first element on iterable object
		 * and reset the iterator pointer to the first element
		 * 
		 * @returns {Object}
		 */
		first: function(){
			this.__index = 0;
			return this.currentItem();
		},
		
		/**
		 * Function moves iterator pointer to point the next element
		 * and returns that element. It will return undefined value
		 * if iteration has ended
		 * 
		 * @returns {Object}
		 */
		next: function(){
			var self = this;
			if(!self.isDone()){
				self.__index++;
				return self.currentItem();
			}
		},
		
		/**
		 * Function returns current item iterator
		 * pointer is poiniting to
		 * 
		 * @returns {Object}
		 */
		currentItem: function(){
			return this.__iterable[this.__index];
		},
		
		/**
		 * Function returns true if the iteration has 
		 * reached the limit
		 * 
		 * @returns {Boolean}
		 */
		isDone: function(){
			return this.__index === this.__iterable.length;
		},

        /**
         * Function will execute provided function handler
         * on every element in the iterable object
         * 
         * @param {Object} fn
         */
		each: function(fn){
			var self = this,
				iterable = self.__iterable,
				i,
				l = iterable.length;
			if(typeof(fn) === 'function'){
				for(i=0; i<l; i++){
					self.__index = i;
					fn(iterable[i], i, iterable);
				}
			}
		}
		
	});
	
}(patternity));
