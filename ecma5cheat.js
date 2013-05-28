/**
 * Object descriptor
**/
 
var a = {
  prop1 : 14
}
 
var descriptorObj1 = Object.getOwnPropertyDescriptor(a, 'prop1');
 
// Property defined in 'regular' way has descriptor that looks like that
descriptorObj1 is {
  value        : 14,        // object's value
  get          : undefined, // getter function, it's undefined by default
  set          : undefined, // setter function, it's undefined by default
  writable     : true       // can value be changed, true by default
  enumerable   : true       // will it be visible in for..in loop, true by default 
  configurable : true       // can you change the descriptor, true
}
 
 
/** 
 * Define single property descriptor 
**/
 
Object.defineProperty(a, 'prop2', { // equivalent of a.prop2 = 'abc'
  value        : 'abc',
  writable     : true,
  enumerable   : true,
  configurable : true
});
 
Object.defineProperty(a, 'prop3', {}) 
 
var descriptorObj3 = Object.getOwnPropertyDescriptor(a, 'prop3');
 
// Property defined with defineProperty() has different defaults
descriptorObj3 is {
  value        : undefined,  
  get          : undefined,
  set          : undefined,
  writable     : false 
  enumerable   : false 
  configurable : false 
}
 
 
var obj = { prop1 : 'aaa' }
Object.defineProperty(obj, '_prop2', {
  get : function() { return this.prop1 },   // it's get and/or set XOR writable
  set : function(val) { this.prop1 = val }, // without set value can't be changed
  enumerable   : false,
  configurable : false 
})
 
var obj = {}; // better example from David :)
(function(){
  var __test = 42;
  Object.defineProperty(obj, "test", {
    get: function(){ return __test; },
    set: function(x){ __test=x; }
  });
})();
 
/**
 * Define multiple property descriptors
**/
 
Object.defineProperties(a, {
  prop5 : descriptorObj,
  prop6 : descriptorObj,
  prop7 : descriptorObj
})
 
/**
 * Create object with given prototype
**/
 
Object.create(proto [, propertiesObject ]);
 
var obj, oObj;
obj = Object.create(Object.prototype) // equivalent of obj = {}
obj = Object.create(Constructor.prototype) // equivalent of obj = new Contructor() 
 
obj = Object.create(oObj, { prop1 : descriptorObj }) // defaults are the same as in Object.defineProperty()
obj.prop1 // descriptorObj.value
 
//to specify an ES3 property
obj = Object.create({}, { 
  p: { 
    value        : 42, 
    writable     : true, 
    enumerable   : true, 
    configurable : true 
  } 
});
 
/**
 * Get all enumerable properties
**/
 
Object.keys(obj) // enumerable only, doesn't go into the prototype chain
 
var arr = ["a", "b", "c"]; 
Object.keys(arr); // ["0", "1", "2"]
 
var obj = { 0 : "a", 1 : "b", 2 : "c"};
Object.keys(obj); // ["0", "1", "2"]
 
var obj = Object.create({}, { prop1 : { value : 42 } });
obj.prop2 = 24;
Object.keys(obj); // ['prop2']
 
/** 
 * Get all properties, enumerable or not
**/
 
Object.getOwnPropertyNames(obj); // enumerable and not, only on the obj, not deeper
 
var arr = ['a', 'b', 'c'];
Object.getOwnPropertyNames(arr); // ["0", "1", "2", "length"]
 
var obj = { 0 : "a", 1 : "b", 2 : "c"};
Object.getOwnPropertyNames(obj) // ["0", "1", "2"]
 
var obj1 = Object.create(obj, { prop1 : { value : 42 } });
obj1.prop2 = 24;
 
Object.getOwnPropertyNames(obj1)  // ['prop2', 'prop1']
Object.keys(obj1) // ['prop2']
for(var i in obj1) {console.log(i)} // 'prop2', '0', '1', '2'
 
/**
 * Get prototype of specified object
**/
 
Object.getPrototypeOf(obj)
 
Object.getPrototypeOf({}) // Object
Object.getPrototypeOf('123') // TypeError
 
/**
 * Prevent any extension of the object
**/
 
Object.preventExtensions(obj); 
 
// prevent adding new properties
// existing properties can be modified
// existing properties can be deleted
// prototypes can be modified
 
var obj = { 0 : "a", 1 : "b", 2 : "c"};
var obj1 = Object.create(obj, { prop1 : { value : 42 } });
 
Object.preventExtensions(obj1);
 
obj1.prop2 = 2 // undefined or TypeError in strict mode
obj1.prop2     // undefined
 
obj.prop2 = 2 // ok
obj1.prop2    // 2
 
/** 
 * Check if object can be extended
**/
 
Object.isExtensible(obj); // true if preventExtensions(), seal() or freeze() was used, 
                          // false otherwise
 
/** 
 * Prevent any extensions, deletions and property changes
**/
 
Object.seal(obj) 
 
// prevent adding new properties
// existing properties descriptors can't be modified
// existing properties values can be modified
// existing properties can't be deleted
// prototypes can be modified
 
var obj = { prop1 : 'aaa' }
Object.seal(obj)
 
obj.prop2 = 'bbb' // TypeError
obj.prop1 = 'bbb' // ok, property value changed
delete obj.prop1  // TypeError
Object.defineProperty(obj, { prop1 : { get : function() { retun 'ccc' } } }) // TypeError
 
/**
 * Check if object is sealed 
**/
 
Object.isSealed(obj); // true if can't be extended and 
                      // properties aren't deletable or configurable, 
                      // false otherwise
 
/**
 * Prevent any changes to the object
**/
 
Object.freeze(obj); 
 
// object is immutable
// prevent adding new properties
// existing properties descriptors can't be modified
// existing properties values can't be modified
// existing properties can't be deleted
// prototypes can be modified
 
var obj = { prop1 : 'aaa' }
Object.defineProperty(obj, 'prop2', {
  get : function() { return this.prop1 },
  set : function(val) { this.prop1 = val } 
})
Object.freeze(obj)
 
obj.prop3 = 'bbb' // TypeError
obj.prop2 = 'bbb' // undefined - obj1.prop1 is still 'aaa'
obj.prop1 = 'bbb' // TypeError
delete obj.prop2  // TypeError
Object.defineProperty(obj, 'prop1', { get : function() { return 'ccc' } } ) // TypeError
 
/**
 * Check if object is immutable
**/
 
Object.isFrozen(obj); // true if obj properties can't be deleted, added nor changed 
                      // (both descriptor properties and property value)
                      // false otherwise