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
			var self = this,
				i = self.__elements.length;
			
			while(i--){
				if(self.__elements[i] === element){
					return i;
				}
			}
			
			return -1;
		},
		
		isContaining: function(element){
			var idx = this.getIndexOf(element);
			return idx !== -1;
		},
		
		removeAt: function(index){
			this.__elements.splice(index,1);
		},
		
		remove: function(element){
			var self = this,
				i = self.__elements.length;
			
			while(i--){
				if(self.__elements[i] === element){
					self.__elements.splice(i,1);
					return;
				}
			}
		},
		
		getElements: function(){
			return this.__elements;
		},
		
		iterator: function(){
			return $NS.IIterable.bind(new $NS.Iterator(this.__elements));
		}
	});
	
}(patternity));
