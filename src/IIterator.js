(function($NS){
    /**
     * @class IIterator interface definition.
     * @name py.IIterator
     */	
	$NS.Interface('IIterator', {
	    /**
	     * Function should reset iterator to first item 
	     * and return this item
	     * 
	     * @function
	     * @name py.IIterator#first
	     */
		first: function(){},
		/**
		 * Function should move iterator to next
		 * object and return that object
		 * 
		 * @function
         * @name py.IIterator#next
		 */
		next: function(){},
		/**
		 * Function should return current item which
		 * iterator is pointing to
		 * 
		 * @function
         * @name py.IIterator#currentItem
		 */
		currentItem: function(){},
		/**
		 * Function should return boolean value which indicates 
		 * if the interation came to an end
		 * 
		 * @function
         * @name py.IIterator#isDone
		 */
		isDone: function(){},
		/**
		 * Function should execute provided handler 
		 * on every element of the iterable object
		 * 
		 * @function
         * @name py.IIterator#each
         * @param {Object} fn
		 */
		each: function(fn){}
	}, $NS);
	
}(py));
