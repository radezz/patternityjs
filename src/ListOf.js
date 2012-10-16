(function($NS){
	
	$NS.Class('ListOf', { Extends: $NS.List,
		
		construct: function(of){
			if(typeof(of) === 'function'){
				this.__of = of;
				this._parent.construct.call(this);
			}else{
				throw "argument should be a constructor";
			}
			
		},
		
		add: function(element){
			if((element instanceof this.__of) || (element.constructor && element.constructor === this.__of)){
				this._parent.add.call(this, element);
			}else{ 
				throw "not allowed type";
			}
		},
		
		execute: function(functionName){
			var args = Array.prototype.slice.call(arguments,1),
				iterator = this.iterator(),
				results = [];
			iterator.each(function(elem){
				results.push(elem[functionName].apply(elem, args));
			});
			return results;
		},
		
		setAll: function(property, value){
			var iterator = this.iterator();
			iterator.each(function(elem){
				elem[property] = value;
			});
		}
	}, $NS);
	
	
}(patternity));
