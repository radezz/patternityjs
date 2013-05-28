(function($NS){
	
	describe("Singleton",function(){
		
		it("should create a singleton object according to provided definition", function(){
			$NS.Singleton('single',{
				initialize: function(){
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
			$NS.Singleton('ton', {
				initialize: function(){
					this.name = 'singleton'
				},
				getName: function(){
					return this.name;
				}
			}, 'my.single');
			
			expect(my.single.ton).toBeDefined();
			expect(typeof(my.single.ton.getInstance)).toBe('function');
			expect(my.single.ton.getInstance().getName()).toBe('singleton');
		})
		
	});
	
}(py));
