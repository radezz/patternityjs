(function($NS){
    /**
     * IIterable interface definition.
     * @interface
     */	
	$NS.IIterable = $NS.Interface({
	    /**
	     * Function should reset iterator to first item 
	     * and return this item
	     */
		first: function(){},
		/**
		 * Function should move iterator to next
		 * object and return that object
		 */
		next: function(){},
		/**
		 * Function should return current item which
		 * iterator is pointing to
		 */
		currentItem: function(){},
		/**
		 * Function should return boolean value which indicates 
		 * if the interation came to an end
		 */
		isDone: function(){},
		/**
		 * Function should execute provided handler 
		 * on every element of the iterable object
         * @param {Object} fn
		 */
		each: function(fn){}
	});
	
}(patternity));
