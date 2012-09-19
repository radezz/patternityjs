(function($NS){
	
	
	function objectToIterable(obj){
		var key,
			iterable = [];
			
		for(key in obj){
			if(obj.hasOwnProperty(key)){
				iterable.push(obj[key]);
			}
		}
		
		return iterable;
	}
	
	
	$NS.Iterator = $NS.Class({
		Implements: $NS.IIterable,
		construct: function(iterableObject){
			
			if(iterableObject instanceof Array){
				this.__iterable = iterableObject;
			}else if(iterableObject && typeof(iterableObject) === 'object'){
				this.__iterable = objectToIterable(iterableObject);
			}else if(iterableObject && typeof(iterableObject) === 'string'){
				this.__iterable = iterableObject.split('');
			}else{
				throw 'non iterable';
			}
			
			this.__currentItem = null;
			this.__index = null;
			this.first();
		},
		
		first: function(){
			this.__index = 0;
			return this.currentItem();
		},
		
		next: function(){
			if(!this.isDone()){
				this.__index++;
				return this.currentItem();
			}
		},
		
		currentItem: function(){
			return this.__iterable[this.__index];
		},
		
		isDone: function(){
			return this.__index === this.__iterable.length;
		},
		
		each: function(fn){
			var i,l;
			if(typeof(fn) === 'function'){
				for(i=0, l=this.__iterable.length; i<l; i++){
					this.__index = i;
					fn(this.__iterable[i],i);
				}
			}
		}
		
	})
	
}(patternity));
