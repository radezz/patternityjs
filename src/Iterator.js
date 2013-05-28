(function($NS){
    var utils = $NS.utils;
    
    /**
     * Function transforms an object into 
     * iterable array
     * 
     * @function
     * @private
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
     * @class
     * @name py.Iterator
     * @implements py.IIterable
     * @constructor
     * @param {Array | String | Object} iterableObject
     */
	$NS.Class('Iterator', { Implements: $NS.IIterable,
		
		initialize: function(iterableObject){
			
			if(iterableObject instanceof Array){
				this.__iterable = iterableObject;
			}else if(iterableObject && utils.isObject(iterableObject)){
				this.__iterable = objectToIterable(iterableObject);
			}else if(iterableObject && utils.isString(iterableObject)){
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
		 * @function
		 * @name py.Iterator#first
		 * @returns {Object} first item on the iterable list
		 */
		first: function(){
			this.__index = 0;
			return this.currentItem();
		},
		
		/**
		 * Function moves iterator pointer to point the next element
		 * and returns that element. It will return undefined value
		 * if iteration has ended
		 * @function
		 * @name py.Iterator#next
		 * @returns {Object} next item on iterable list
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
		 * @function
		 * @name py.Iterator#currentItem
		 * @returns {Object} current item on iterable list
		 */
		currentItem: function(){
			return this.__iterable[this.__index];
		},
		
		/**
		 * Function returns true if the iteration has 
		 * reached the limit
		 * @function
		 * @name py.Iterator#isDone
		 * @returns {Boolean} 
		 */
		isDone: function(){
			return this.__index === this.__iterable.length;
		},

        /**
         * Function will execute provided function handler
         * on every element in the iterable object
         * @function
         * @name py.Iterator#each
         * @param {Object} fn fuction which will be executed on each element
         * @returns {Array} array of results 
         */
		each: function(fn){
			var self = this,
				iterable = self.__iterable,
				results = [],
				i,
				l = iterable.length;
			if(utils.isFunction(fn)){
				for(i=0; i<l; i++){
					self.__index = i;
					results.push(fn(iterable[i], i, iterable));
				}
			}
			
			return results;
		}
		
	}, $NS);
	
}(py));
