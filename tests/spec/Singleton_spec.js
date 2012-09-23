(function($NS){
	
	describe("Singleton",function(){
		
		it("should create a singleton object accordind to provided definition", function(){
			var single = $NS.Singleton({
				construct: function(){
					this.name = 'singleton'
				},
				getName: function(){
					return this.name;
				}
			});
			
			expect(single).toBeDefined();
			expect(typeof(single.getInstance)).toBe('function');
			expect(single.getInstance().getName()).toBe('singleton');
		});
		
		it("should create a singleton within provided namespace", function(){
			$NS.Singleton('my.single.ton', {
				construct: function(){
					this.name = 'singleton'
				},
				getName: function(){
					return this.name;
				}
			});
			
			expect(my.single.ton).toBeDefined();
			expect(typeof(my.single.ton.getInstance)).toBe('function');
			expect(my.single.ton.getInstance().getName()).toBe('singleton');
		})
		
	});
	
}(patternity));
