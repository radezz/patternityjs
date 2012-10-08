(function($NS){
	
	$NS.List = $NS.Class({
		construct: function(){
			this.__elements = [];
		},
		
		add: function(element){
			this.__elements.push(element);
		},
		
		getAt: function(index){
			return this.__elements[index];
		},
		
		getIndexOf: function(element){
			var elements = this.__elements,
				i = elements.length;
			
			while(i--){
				if(elements[i] === element){
					return i;
				}
			}
			
			return -1;
		},
		
		getLength: function(){
			return this.__elements.length;
		},
		
		hasElement: function(element){
			return -1 !== this.getIndexOf(element);
		},
		
		removeAt: function(index){
			this.__elements.splice(index,1);
		},
		
		remove: function(element){
			var elements = this.__elements,
				i = elements.length;
			
			while(i--){
				if(elements[i] === element){
					elements.splice(i,1);
					return;
				}
			}
		},
		
		getElements: function(){
			return this.__elements;
		},
		
		iterator: function(){
			return $NS.IIterable.bind(new $NS.Iterator(this.__elements));
		},
		
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
