(function($NS){
    /**
     * IIterable interface definition.
     * @class
     * @name py.IIterable
     */	
	$NS.Interface('IIterable', {
	    /**
	     * Function should reset iterator to first item 
	     * and return this item
	     * 
	     * @function
	     * @name py.IIterable#first
	     */
		first: function(){},
		/**
		 * Function should move iterator to next
		 * object and return that object
		 * 
		 * @function
         * @name py.IIterable#next
		 */
		next: function(){},
		/**
		 * Function should return current item which
		 * iterator is pointing to
		 * 
		 * @function
         * @name py.IIterable#currentItem
		 */
		currentItem: function(){},
		/**
		 * Function should return boolean value which indicates 
		 * if the interation came to an end
		 * 
		 * @function
         * @name py.IIterable#isDone
		 */
		isDone: function(){},
		/**
		 * Function should execute provided handler 
		 * on every element of the iterable object
		 * 
		 * @function
         * @name py.IIterable#each
         * @param {Object} fn
		 */
		each: function(fn){}
	}, $NS);
	
}(py));
