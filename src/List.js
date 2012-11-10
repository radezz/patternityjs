(function($NS){
	
	/**
	 * List implementation.
	 * @class List
	 * @name py.List 
	 * 
	 * @constructor
	 */
	$NS.Class('List', {
		
		__elements: [],
		
        /**
         * Funcion adds element to the list
         * @function
         * @name py.List#add
         * @param {Object} element
         */
		add: function(element){
			this.__elements.push(element);
		},
		
        /**
         * Function returns element at specified
         * position from the list
         * @function
         * @name py.List#getAt
         * @param {Number} index
         * @returns {Object} element at chosen position
         */
		getAt: function(index){
			return this.__elements[index];
		},
		
        /**
         * Function returns last index 
         * of provided element
         * @function
         * @name py.List#indexOf
         * @param {Object} element
         * 
         * @returns {Number} - index
         */
		indexOf: function(element){
			var elements = this.__elements,
				i = elements.length;
			
			while(i--){
				if(elements[i] === element){
					return i;
				}
			}
			
			return -1;
		},
        
        /**
         * Function returns the length of 
         * the list
         * @function
         * @name py.List#getLength
         * @returns {Number} list length
         */
		getLength: function(){
			return this.__elements.length;
		},

        /**
         * Function checks if list contains provided element
         * returns either true if yes or false if no
         * 
         * @function
         * @name py.List#hasElement
         * @param {Object} element
         * 
         * @returns {Boolean}
         */
		hasElement: function(element){
			return -1 !== this.indexOf(element);
		},

        /**
         * Function removes element at specified index
         * 
         * @function
         * @name py.List#removeAt
         * @param {Number} index
         */
		removeAt: function(index){
            if(index > -1){
                this.__elements.splice(index,1);
		    }
		},

        /**
         * Function removes provided element from the list 
         * if list contains that element
         * 
         * @function
         * @name py.List#remove
         * @param {Object} element
         */		
		remove: function(element){
			var idx = this.indexOf(element);
			while(idx !== -1){
			    this.removeAt(idx);
			    idx = this.indexOf(element);
			}
		},
		
		/**
		 * Function returns an full list element array
		 * @function
		 * @name py.List#getElements
		 * 
		 * @returns {Array} returns list elements array
		 */
		getElements: function(){
			return this.__elements;
		},
		
		/**
		 * Function creates and returns IIterbale interface
		 * which can be used to iterate over the list
		 * object
		 * 
		 * @function
		 * @name py.List#iterator
		 * 
		 * @returns {IIterable}
		 */
		iterator: function(){
			return $NS.IIterable.bind(new $NS.Iterator(this.__elements));
		},
		
		/**
		 * Function reduces the list to contain 
		 * unique values only
		 * 
		 * @function
		 * @name py.List#unique
		 */
		unique: function(){
			var elements = this.__elements,
				i = elements.length,
				uniqueCheck = {},
				uniqueElements = [],
				element;
			
			while(i--){
				element = elements[i];
				if(!uniqueCheck[element]){
					uniqueElements.push(element);
					uniqueCheck[element] = 1;
				}
			}
			
			this.__elements = uniqueElements;
		}
	}, $NS);
	
}(py));
