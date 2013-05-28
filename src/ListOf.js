(function($NS){
	
	/**
	 * ListOf creates a List of provided type, and 
     * prevents object of different from being added
     * 
	 * @class 
	 * @name py.ListOf
	 * @extends py.List
	 * 
	 * @param {Function} constructor of chosen type
	 * 
	 * @example
	 * var list = new ListOf(Number);
	 * list.add({}); //will throw exception
	 * 
	 * @constructor
	 */
	$NS.Class('ListOf', { Extends: $NS.List,
		
		initialize: function(of){
			if(typeof(of) === 'function'){
				this.__of = of;
			}else{
				throw "argument should be a constructor";
			}
		},
		
		/**
		 * Function adds element to the list.
		 * @function
		 * @name py.ListOf#add
         * @param {Object} element
		 */
		add: function(element){
			if((element instanceof this.__of) || (element.constructor && element.constructor === this.__of)){
				$NS.List.prototype.add.call(this, element);
			}else{ 
				throw "not allowed type";
			}
		},
		
		/**
		 * Function executes provided method on every 
		 * object on the list. Additional arguments are passed into the
		 * executing method.
		 * 
		 * @function
         * @name py.ListOf#execute
		 * 
		 * @example
		 * py.Class('Point',{
		 *     construct: function(x,y){
		 *        this.x = x;
		 *        this.y = y;
		 *     },
		 *     move: function(byX, byY){
		 *        this.x += byX;
		 *        this.y += byY;
		 *     }
		 * }, 'geomery');
		 * 
		 * var points = py.ListOf(geometry.Point);
		 * pointList.add(new geometry.Point(10,10));
		 * pointList.add(new geometry.Point(5,5));
		 * pointList.add(new geometry.Point(7,9));
		 * 
		 * points.execute('move', 4, 5);
		 * 
		 * 
         * @param {String} functionName
         * @param {Arguments} arguments
		 */
		execute: function(functionName){
			var args = Array.prototype.slice.call(arguments,1),
				iterator = this.iterator(),
				results = [];
			iterator.each(function(elem){
				results.push(elem[functionName].apply(elem, args));
			});
			return results;
		},
		
		/**
		 * Function sets a property of all objects on the list 
		 * with provided value
		 * 
		 * @function
		 * @name py.ListOf#setAll
		 * 
		 * @example
		 * py.Class('Point',{
         *     construct: function(x,y){
         *        this.x = x;
         *        this.y = y;
         *     },
         *     move: function(byX, byY){
         *        this.x += byX;
         *        this.y += byY;
         *     }
         * }, 'geomery');
         * 
         * var points = py.ListOf(geometry.Point);
         * pointList.add(new geometry.Point(10,10));
         * pointList.add(new geometry.Point(5,5));
         * pointList.add(new geometry.Point(7,9));
         * 
         * points.setAll('x', 10);
		 * 
		 * 
         * @param {String} property
         * @param {Object} value
		 */
		setAll: function(property, value){
			var iterator = this.iterator();
			iterator.each(function(elem){
				elem[property] = value;
			});
		}
	}, $NS);
	
	
}(py));
