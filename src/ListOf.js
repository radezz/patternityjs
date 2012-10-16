(function($NS){
	
	/**
	 * @class ListOf
	 * ListOf creates a List of provided type, and 
	 * prevents object of different type to be added
	 * 
	 * @param {Function} constructor 
	 * 
	 * @example
	 * var list = new ListOf(Number);
	 * 
	 * @constructor
	 */
	$NS.Class('ListOf', { Extends: $NS.List,
		
		construct: function(of){
			if(typeof(of) === 'function'){
				this.__of = of;
			}else{
				throw "argument should be a constructor";
			}
		},
		
		/**
		 * Function adds element to the list.
         * @param {Object} element
		 */
		add: function(element){
			if((element instanceof this.__of) || (element.constructor && element.constructor === this.__of)){
				this._parent.add.call(this, element);
			}else{ 
				throw "not allowed type";
			}
		},
		
		/**
		 * Function executes provided method on every 
		 * object on the list. Additional arguments are passed into the
		 * executing method.
		 * 
         * @param {String} functionName
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
	
	
}(patternity));
