(function($NS){
	
	/**
	 * @class List
	 * List implementation which can be extended
	 * 
	 * @constructor
	 */
	$NS.List = $NS.Class({
		construct: function(){
			this.__elements = [];
		},
		
        /**
         * Funcion adds element to the list
         * @param {Object} element
         */
		add: function(element){
			this.__elements.push(element);
		},
		
        /**
         * Function returns element at specified
         * position from the list
         * 
         * @param {Number} index
         */
		getAt: function(index){
			return this.__elements[index];
		},
		
        /**
         * Function returns last index 
         * of provided element
         * 
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
         * 
         * @returns {Number}
         */
		getLength: function(){
			return this.__elements.length;
		},

        /**
         * Function checks if list contains provided element
         * returns either true if yes or false if no
         * @param {Object} element
         * 
         * @returns {Boolean}
         */
		hasElement: function(element){
			return -1 !== this.indexOf(element);
		},

        /**
         * Function removes element at specified index
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
         * @param {Object} element
         */		
		remove: function(element){
			var idx = this.indexOf(element);
			this.removeAt(idx);
		},
		
		/**
		 * Function returns an full list element array
		 * @returns {Array} 
		 */
		getElements: function(){
			return this.__elements;
		},
		
		/**
		 * Function creates and returns IIterbale interface
		 * which can be used to iterate over the list
		 * object
		 * 
		 * @returns {Object} IIterable
		 */
		iterator: function(){
			return $NS.IIterable.bind(new $NS.Iterator(this.__elements));
		},
		
		/**
		 * Function reduces the list to contain 
		 * unique values only
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
	});
	
}(patternity));
