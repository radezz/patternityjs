(function(){
    var scripts = document.getElementsByTagName('script'),
        i = scripts.length,
        script,
        nsString,
        nsPart,
        targetObject = this,
        py;

    while(i--){
        script = scripts[i];
        if(script.src.indexOf('patternity' !== -1)){
            nsString = script.getAttribute('data-namespace') || 'py';
            if(nsString && nsString !== 'this'){
                nsString = nsString.split('.');
                while(nsPart = nsString.shift()){
                    if(!targetObject[nsPart]){
                        targetObject[nsPart] = {};
                    }
                    targetObject = targetObject[nsPart];
                }

            }

            break;
        }
    }
    py = targetObject;

    /**
     * Global function returns patternity root object namespace
     * @name pyGetRoot
     * @function
     * @returns {String} patternity namespace
     */
    this.pyGetRoot = function(){
        return py;
    }
/**
 * This namespace defines utility functions used within library clasees
 * @namespace
 * @name py.utils
 */
(function($NS, $Global){

    //create checkers
    var toString = Object.prototype.toString,
        //every checkFor key is converted to a is... function
        //lowercase will use typeof other will use toString as comparison
        checkFor = [
         /**
          * Function check if object is a function
          * @function
          * @name py.utils#isFunction
          * @param {Object} object
          */
        'function',
        /**
          * Function check if object is undefined
          * @function
          * @name py.utils#isUndefined
          * @param {Object} object
          */
        'undefined',
        /**
          * Function check if object is a atring
          * @function
          * @name py.utils#isString
          * @param {Object} object
          */
        'string',
        /**
          * Function check if object is an array
          * @function
          * @name py.utils#isArray
          * @param {Object} object
          */
        'boolean',
        /**
          * Function check if object is a number
          * @function
          * @name py.utils#isNumber
          * @param {Object} object
          */
        'number',
        /**
          * Function check if object is RegExp
          * @function
          * @name py.utils#isRegExp
          * @param {Object} object
          */
        'Array',
        /**
          * Function check if object is object (user defined object, function will return
          * false for arrays, regexp etc).
          * @function
          * @name py.utils#isObject
          * @param {Object} object
          */
        'Object',
        /**
          * Function check if object is math
          * @function
          * @name py.utils#isMath
          * @param {Object} object
          */
        'Math',
        /**
          * Function check if object is date
          * @function
          * @name py.utils#isDate
          * @param {Object} object
          */
        'Date',
        /**
          * Function check if object is boolean value
          * @function
          * @name py.utils#isBoolean
          * @param {Object} object
          */
        'RegExp',
        /**
          * Function check if object is JSON
          * @function
          * @name py.utils#isJSON
          * @param {Object} object
          */
        'JSON',
        /**
          * Function check if object is arguments
          * @function
          * @name py.utils#isArguments
          * @param {Object} object
          */
        'Arguments'
    ],
    i = checkFor.length,
    typeofCheck,
    check = {},
    key;

    //create s list of type checkers
    function createChecker(objectType, typeofCheck){
        var typeString = ["[object ", objectType, "]"].join("");
        if(typeofCheck){
            return function (arg) {
              return typeof(arg) === objectType;
            };
        } else {
            return function(arg){
                return toString.call(arg) === typeString;
            };
        }
    }
    //generate checkers
    while(i--){
        key = checkFor[i];
        check["is" + key.charAt(0).toUpperCase() + key.substr(1,key.length)] = createChecker(key, key.charCodeAt(0) > 90);
    }
    //use native isArray if available
    check.isArray = Array.isArray || check.isArray;
    /**
     * Function check if object is null
     * @function
     * @name py.utils#isNull
     * @param {Object} object
     */
    check.isNull = function (arg) {
       return arg === null;
    };
    /**
     * Function returns true if object is not null and not 'undefined'
     * @function
     * @name py.utils#isDefined
     * @param {Object} object
     */
    check.isDefined = function (arg) {
       return !(check.isNull(arg) || check.isUndefined(arg));
    };


    //create utils
    (function(){

        var isArray = check.isArray,
            isObject = check.isObject,
            isUndefined = check.isUndefined;
        /**
         * Function extracts object type returned by object.toString.
         * It can be used for more strict object typing
         * @function
         * @name py.utils#getType
         * @returns {String}
         */
        function getType(object){
            var stringified = toString.call(object);
            return stringified.substring(8,stringified.length-1);
        }

        /**
         * Function creates namespace (if does not exists) and
         * applies and object to the namespace (if provided).
         * @function
         * @name py.utils#createNS
         *
         * @param {String} namespace
         * @param {Object} [optional] object to apply in this namespace
         *
         * @example
         * var myObj = {};
         * py.utils.createNS('my.name.space.myObj',myObj);
         *
         * my.name.space.myObj === myObj //will be true
         *
         */
        function createNS(namespace, apply){
            var ns = namespace.split('.'),
                nsPart = ns.shift(),
                targetObject = $Global; //this needs to refer to global

            while(nsPart){
                if(!targetObject[nsPart]){
                    targetObject[nsPart] = {};
                }

                if(ns.length === 0 && apply){
                    targetObject[nsPart] = apply;
                }

                targetObject = targetObject[nsPart];
                nsPart = ns.shift();
            }

            return targetObject;
        }

        /**
         * Function implements base for prototype inheritance,
         * it extends constructor with parent prototype.
         *
         * @function
         * @name py.utils#extend
         *
         * @param {Function} construct
         * @param {Function} parent
         */
        function extend(construct, parent){
            var Extends = function(){};
            Extends.prototype = parent.prototype;
            construct.prototype = new Extends();
            return construct;
        }

        /**
         * Function implements Object.create or uses native implementation
         * if available.
         *
         * @function
         * @name py.utils#createObject
         *
         * @param {Object} proto
         */
        function createObject ( proto ) {
           function F(){}
           F.prototype = proto;
           return new F();
        }

        /**
         * Function mixins methods and properties from source  object(s)
         * to target object, but does not modify the prototype
         *
         * @function
         * @name py.utils#mixin
         *
         * @param {Object} target
         * @param {Object | Array} source it can be also array of objects
         */
        function mixin(target, source){
            var key,
                i,
                l;
            if(target && source){
                if(isArray(source)){
                    for(i=0, l=source.length; i<l; i++){
                        mixin(target, source[i]);
                    }
                }else{
                    for(key in source){
                        if(source.hasOwnProperty(key)){
                            target[key] = source[key];
                        }
                    }
                }

                return target;
            }
        }

        /**
         * Function checks if target object implements provided
         * interface (object functions and properties)
         *
         * @function
         * @name py.utils#isImplementing
         *
         * @param {Object} target
         * @param {Object} implement
         */
        function isImplementing(target, implement){
            var targetProperty,
                key,
                i,
                l;

            if (isArray(implement)) {
                for ( i = 0, l = implement.length; i < l; i++) {
                    if (!isImplementing(target, implement[i])) {
                        return false;
                    }
                }

                return true;

            } else if (isObject(implement)) {
                for (key in implement) {
                    if(implement.hasOwnProperty(key)){
                        targetProperty = target[key];
                        if (isUndefined(targetProperty) || getType(targetProperty) !== getType(implement[key])) {
                            return false;
                        }
                    }
                }

                return true;
            }
        }

        /**
         * Function applies pair arguments to target function. It is
         * possible to overload 'key-value' type function to consume
         * objects as single parameter
         *
         * @function
         * @name py.utils#pairCall
         *
         * @param {Object} fn
         * @param {Object} pairArgs
         * @param {Object} context [optional]
         *
         * @returns {Boolean} which states if pairCall is applied
         *
         * @example
         *
         * function set(prop, value){
         *     if(arguments.length === 1 && !pairCall(set, arguments[0])){
         *         target[prop] = value;
         *     }
         * }
         *
         * //instead of calling
         * set('prop', 10);
         * //you can call
         * set({
         *     prop: 10,
         *     prop2: 20,
         *     prop3: 30
         * })
         *
         */
        function pairCall(fn, pairArgs, context){
            var key;

            if(check.isFunction(fn) && check.isObject(pairArgs)){
                for(key in pairArgs){
                    if(pairArgs.hasOwnProperty(key)){
                        fn.call(context, key, pairArgs[key]);
                    }
                }
                return true;
            }

            return false;
        }

        /**
         * Utility function which implemnts ecs5 Array.forEach
         * needs to be called in the array scope
         * @function
         * @name py.utils#forEach
         *
         * @example
         * py.utils.forEach.call([1,2,3], function(item, index, array){
         *     //...
         * });
         *
         * @param {Object} fn
         */
        function forEach(fn) {
            var self = this,
                i,
                l;

            if(!check.isArray(this)){
                throw new TypeError("Need an Array as scope");
            }

            if(!check.isFunction(fn)) {
                throw new TypeError("Need function");
            }

            for(i=0, l=self.length; i<l; i++) {
                fn(self[i], i, self);
            }
        }


        $NS.utils = mixin(check ,{
            createNS: createNS,
            extend: extend,
            createObject: Object.create || createObject,
            forEach: Array.prototype.forEach || forEach,
            mixin: mixin,
            pairCall: pairCall,
            isImplementing: isImplementing,
            getType: getType
        });

        $NS.NS = createNS;

    }());
}(py, this));

(function($NS, $GLOBAL){
    var KeyProperties = {
        'Extends': 1,
        'Implements' : 1,
        'Mixin': 1,
        'Static': 1,
        'initialize': 1,
        'className': 1
    },
    typeofObject = 'object',
    utils = $NS.utils,
    createObject = utils.createObject,
    isObject = utils.isObject,
    isString = utils.isString,
    isArray = utils.isArray,
    isFunction = utils.isFunction;


    /**
     * Function mixins the definition into the
     * constructor prototype. It will not mix in the 'Extend', 'Implements', 'Mixin', 'Static'
     * properties as they are the 'key' properties used to define the class
     *
     * @function
     * @name py.Class#mixinProto
     *
     * @param {Function} proto
     * @param {Object} definition
     */
    function mixinProto(proto, definition){
        var key,
            defProperty;

        if(isArray(definition)){
            utils.forEach.call(definition, function(def){
                mixinProto(proto, def);
            });
        } else {
            for (key in definition) {
                if (definition.hasOwnProperty(key)) {
                    defProperty = definition[key];
                    if(!KeyProperties[key]){
                         proto[key] = defProperty;
                    }
                }
            }

        }
    }

    /**
     * Class's helper function. It creates namespace/package and applies object into
     * created namespace
     *
     * @function
     * @name py.Class#applyToPackage
     *
     * @param {String} pckg
     * @param {Object} source
     * @param {String} name - optional name if source is not a class constructor
     */
    function applyToPackage(pckg, source, name){
        name = name || source.className;
        if(isString(pckg)){
            utils.createNS([pckg, '.', name].join(''), source);
        }else if(isObject(pckg)){
            pckg[name] = source;
        }else{
            $GLOBAL[name] = source;
        }
    }

    /**
     * Function validates input for and returns an object
     * contanint a namespace and definition, which is used when creating
     * class.
     *
     * @function
     * @name py.Class#validateInput
     *
     * @param {String} name
     * @param {Object} definition
     * @param {Object | String} package or namespace
     *
     */
    function validateInput(name, definition, pckg){
        if(!isString(name)){
            throw new TypeError('a class name is required');
        }

        if(!isObject(definition)){
            throw new TypeError(name + ': class definition must be an object');
        }

        if(pckg && !isString(pckg) && (typeof(pckg) !== typeofObject)){
            throw new TypeError(name + ': package must be an object or string');
        }
    }

    /**
     * Function validates if constructor's prototype implements
     * provided Interface. Is used within class to check if created
     * Class contains implementation of an previously created Interface
     *
     * @function
     * @name py.Class#isImplementing
     *
     * @param {Object} construct
     * @param {Object | Function} implement
     */
    function isImplementing(construct, implement, nsOrDefinition){
        var checkFor = (isFunction(implement))? implement.prototype : implement,
            implementsErr;

        if(!utils.isImplementing(construct.prototype, checkFor)){
            implementsErr = nsOrDefinition + " implementation for interface is missing";
            throw new Error(implementsErr);
        }
    }

    /**
     * Class's private helper function. It is used to copy all non primitive
     * properties which should be cleared on when class is created, to prevent
     * prototype static references
     *
     * @private
     *
     * @param {Object} src
     * @param {Array} forReinit
     */
    function getForReinit(src, forReinit){
        var key;
        for(key in src){
            if(src.hasOwnProperty(key) && src[key] && typeof(src[key]) === 'object'){
                forReinit.push({
                   key: key,
                   value: src[key]
                });
            }
        }

    }

    /**
     * Class's private helper function which is called with the Class
     * scope. It is used to reinit no primitive objects
     * to its basic state. i.e clear arrays, change objects to empty objects etc
     *
     * @private
     *
     * @param {Array} forReinit
     */
    function reinitObjects(forReinit){
        var i = forReinit.length,
            self = this,
            prop;

         while(i--) {
            prop = forReinit[i];
            self[prop.key] = createObject(prop.value);
         }
    }

    /**
     * @class Base Class creator function. It will create instantiable constructor
     * of user defined class object.
     *
     * @name py.Class
     *
     * @example
     * py.Class('MyParentClass', {
     *    initialize: function(){
     *         //parent constructor
     *    },
     *    prop: 'value',
     *    func: function(){
     *
     *    }
     *    //...
     *    //define methods and properties here
     * }, 'my.package'); //package will be created if not defined
     *
     *
     * py.Class('MyClass', { Extends: my.package.MyParentClass
     *    initialize: function(){
     *      //use this._parent to access parent functions, and apply to do 'super' calls
     *      this._parent.initialize.apply(this, arguments);
     *
     *      //place constructor code here
     *    }
     * }, 'my.package')
     *
     * var myInstance = new my.package.MyClass();
     *
     * @constructor
     *
     * @param {String} name name for the created class
     * @param {Object} definition definition formed as object
     * @param {Object | String} pckg optional package a namespace in which the class constructor should be placed
     *
     * @returns {Function} - constructor which can create an defined object
     */
    function Class(name, definition, pckg){
        var Construct,
            forReinit = [],
            Extends,
            Mixin,
            Static,
            Implements;

        validateInput(name, definition, pckg);

        Extends = definition.Extends;
        Mixin = definition.Mixin;
        Static = definition.Static;
        Implements = definition.Implements;

        //gather memeber variables for reinit
        if(isFunction(Extends)){
            getForReinit(Extends.prototype, forReinit);
        }

        getForReinit(definition, forReinit);

        if(isFunction(Mixin)){
            getForReinit(Mixin.prototype, forReinit);
        } else if(isObject(Mixin)){
            getForReinit(Mixin.prototype, forReinit);
        }

        //create optimized constructor
        if (forReinit.length) {
            if(isFunction(definition.initialize)){
                Construct = function(){
                    if(forReinit.length){
                        reinitObjects.call(this, forReinit);
                    }
                    definition.initialize.apply(this, arguments);
                };
            } else {
                Construct = function(){
                    if(forReinit.length){
                        reinitObjects.call(this, forReinit);
                    }
                };
            }
        } else {
            Construct = definition.initialize || function(){};
        }

        Construct.nsName = isString(pckg) ? pckg + '.' + name : name;

        //prototype inheritance
        if(isFunction(Extends)){
            Construct.prototype = createObject(Extends.prototype);
        }
        //move definition to prototype
        mixinProto(Construct.prototype, definition);

        //mix-in Mixin object or Class
        if(Mixin){
            if(isFunction(Mixin)){
                mixinProto(Construct.prototype, Mixin.prototype);
            }else{
                mixinProto(Construct.prototype, Mixin);
            }
        }

        //validate interface implementation
        if(Implements){
            isImplementing(Construct, Implements);
        }

        //mix-in static declaration to constructor
        if(Static){
            utils.mixin(Construct, Static);
        }

        applyToPackage(pckg, Construct, name);

        return Construct;
    }

    Class.prototype = {
        isImplementing: isImplementing,
        validateInput: validateInput,
        mixinProto: mixinProto,
        applyToPackage: applyToPackage
    };

    $NS.Class = Class;

}(py, this));
(function($NS){
    var utils = $NS.utils,
        Class = $NS.Class;

    /**
     * Function initializes the singleton
     * and returns object which can fetch the
     * singleton instance.
     * @private
     * @param {Function} Construct
     */
    function Singleton(Construct){
        var instance = new Construct();

        this.getInstance = function(){
            return instance;
        };
    }

    /**
     * @class Singleton definition is used to create objects which should be
     * initialized only once and exists during entire application flow.
     *
     * @name py.Singleton
     *
     * @example
     * py.Singleton('loader', {
     *     construct: function(){
     *         //some initialization code here
     *     },
     *     load: function(){
     *         //some loding implementation
     *     }
     * },'app');
     *
     * var loaderInstance = app.loader.getInstance();
     * loaderInstance.load();
     *
     * @constructor
     * @param {String} name
     * @param {IDefinition} definition
     * @param {String | Object} pckg
     */
    function SingletonCreator(name, definition, pckg){
        var singleton;
        Class.prototype.validateInput(name, definition, pckg);
        singleton = new Singleton($NS.Class(name, definition, {}));
        Class.prototype.applyToPackage(pckg, singleton, name);
        return singleton;
    }

    SingletonCreator.prototype = {
        Singleton: Singleton
    };

    $NS.Singleton = SingletonCreator;

}(py));

(function($NS, $GLOBAL){
    var Class = $NS.Class,
        UNDEF,
        implementsErr,
        defineProperty = Object.defineProperty || function(){},
        typeofObject = 'object',
        typeofFunction = 'function',
        utils = $NS.utils,
        isObject = utils.isObject,
        isString = utils.isString,
        isFunction = utils.isFunction;

    /**
     * Function creates a function which wraps the real object
     * function and calls it with provided arguments
     * @function
     * @private
     * @param {Object} objectInstance
     * @param {String} key
     */
    function interfaceCallerFactory(objectInstance, key){
        return function(){
            return objectInstance[key].apply(objectInstance, arguments);
        };
    }

    /**
     * Function binds the current interface functions to call
     * the target object class function which implement the interface
     *
     * @function
     * @name py.Interface#bind
     * @param {Object} objectInstance - target object into which we bind the interface
     * @param {Object} interfaceDefinition - definition, which functions should be bound
     */
    function bind(objectInstance, interfaceDefinition){
        var self = this;
        Object.keys(interfaceDefinition).forEach(function(key){
            if(isFunction(objectInstance[key])){
                self[key] = interfaceCallerFactory(objectInstance, key);
            } else if(typeof(objectInstance[key]) !== "undefined"){
                defineProperty(self, key, {
                    set: function (value) {
                        objectInstance[key] = value;
                    },
                    get: function () {
                        return objectInstance[key];
                    },
                    enumerable: true,
                    writeable: true
                });
            } else {
                implementsErr = 'cannot bind ' + key + '() implementation is missing';
                throw implementsErr;
            }
        });
    }

    /**
     * @class  Base Interface object creator. It will create a constructor
     * for user defined interface, which can be initialized and bounded
     * to the target object which implements the interface functionality.
     *
     * @name py.Interface
     * @example
     * //create interface definition
     * py.Interface('ISaveable',{
     *     save:function(){},
     *     load:function(){}
     * },'pckg');
     *
     * //create class
     * py.Class('Model', { Implements: pckg.ISaveable,
     *     save: function(){
     *          //implement save code (if interface function odes not
     *          //exists Class definer will throw an error
     *     },
     *     load: function(){
     *          //implement load code
     *     },
     *     parse: function(){},
     *     set: function(){}
     * },'pckg')
     *
     * var MyModel = new pckg.Model();
     * //bnd interface to the Class's instance
     * var IMyModel = new pckg.ISaveable(MyModel);
     *
     * //You will notice here that IMyModel contains only
     * //save() and load() functions will same functions on instantiated object
     *
     *
     * @constructor
     *
     * @param {Object} name
     * @param {Object} definition
     * @param {Object | String} pckg
     *
     * @returns {Function} constructor for the defined interface
     */
    function Interface(name, definition, pckg){

        function Construct(objectInstance){
            if(objectInstance && isObject(objectInstance)){
                bind.call(this, objectInstance, definition);
            }else{
                throw 'an object for interface binding should be defined';
            }
        }

        Construct.nsName = isString(pckg) ? pckg + '.' + name : name;

        Class.prototype.validateInput(name, definition, pckg);

        Construct.bind = function(objectInstance){
            return new Construct(objectInstance);
        };

        Construct.isImplementedBy = function (by) {
            return utils.isImplementing(by,Construct);
        };

        Class.prototype.mixinProto(Construct.prototype, definition);
        Class.prototype.applyToPackage(pckg, Construct, name);

        return Construct;
    }

    Interface.prototype = {
        bind: bind
    };

    $NS.Interface = Interface;

}(py, this));
(function($NS){

    var slice = Array.prototype.slice,
        utils = $NS.utils,
        isFunction = utils.isFunction,
        isObject = utils.isObject;

    /**
     * @class Observable class should be used as Mixin when creating objects
     * with properties we would like to observe when they are changed.
     * @name py.Observable
     * @constructor
     */
    $NS.Class('Observable', {

        __observers: {},

        /**
         * Function triggers all observers assigned to single property.
         * @function
         * @name py.Observable#triggerObserers
         * @param {String} property for which we would like to trigger observers
         */
        triggerObservers: function(property){
            var self = this,
                observers = self.__observers[property],
                i=0,
                l;

            if(observers){
                for(i=0, l=observers.length; i<l; i++){
                    observers[i].apply(self, arguments);
                }
            }

        },

        /**
         * Function returns value of chosen property
         *
         * @function
         * @name py.Observable#get
         *
         * @param {String} property name
         * @returns {Object} value of the property
         */
        get: function(property){
            return this[property];
        },

    /**
     * Function sets property to provided value and
     * triggers all observers assigned to observe this property.
     *
     * @function
     * @name py.Observable#set
     *
     * @example
     * var observableInstance = new py.Observable();
     * observableInstance.observe('price', function(propertyName, newValue, oldValue){
     *    //do some action
     * })
     *
     * observableInstance.set('price', 10);
     *
     * //For this function you can pass map of key value pairs to be set
     * observableInstance.set({
     *    'price': 10,
     *    'size' : 20,
     *    'name' : 'box'
     * });
     *
     * @param {String} propertyName
     * @param {Object} value
     */
        set: function(property, value){
            var self = this,
                oldValue;

            if(!utils.pairCall(self.set, arguments[0], self) && !isFunction(self[property])){
                oldValue = self[property];
                self[property] = value;
                self.triggerObservers(property, value, oldValue);
            }

        },

        /**
         * Function works similar to 'set' but it is used to call
         * object functions and trigger observers assigned to called function.
         * Any additional parameter passed to this function will be used to
         * call chosen object's method.
         *
         * @example
         * py.Class('Point', { Mixin: py.Observable
         *     construct: function(x,y){
         *        this.x = x;
         *        this.y = y;
         *     },
         *     move: function(x,y){
         *        this.set('x', this.x + x);
         *        this.set('y', this.y + y);
         *     }
         * },'geometry')
         *
         * var point = new geometry.Point(10,10);
         *
         * point.observe('move',function(functionName, result, args){
         *     //handle move observer
         * });
         *
         * point.callFunction('move', 3, 5);
         *
         * @function
         * @name py.Observable#callFunction
         *
         * @param {String} functionName
         */
        callFunction: function(functionName){
            var self = this,
                args = slice.call(arguments, 1),
                result;

            if(isFunction(self[functionName])){
                result = self[functionName].apply(self, args);
                self.triggerObservers(functionName, result, args);
                return result;
            }
        },

        /**
         * Function adds observer to object's property or function.
         * Observer function is called when property is changed or
         * observed function is being called (when using 'set' or 'callFunction'
         * methods). Observer function is called with arguments as described in example.
         *
         * @example
         *
         * function propertyObserver(propertyName, newValue, oldValue){}
         *
         * function functionObserver(functionName, result, arg1, arg2, arg3){}
         *
         * @function
         * @name py.Observable#observe
         *
         * @param {String} propertyName or functionName
         * @param {Function} observer function
         */
        observe: function(property, observer){
            var self = this,
                observers = self.__observers;

            if(!utils.pairCall(self.observe, arguments[0], self)){
                if(!observers[property]){
                    observers[property] = [];
                }

                if(isFunction(observer)){
                    observers[property].push(observer);
                }
            }


        },

        /**
         * Function removes previously added observer.
         *
         * @function
         * @name py.Observable#removeObserver
         *
         * @param {String} propertyName or functionName
         * @param {Function} observer previously added observer reference
         */
        removeObserver: function(property, observer){
            var observers = this.__observers[property] || [],
                i;

            i = observers.length;
            while(i--){
                if(observers[i] === observer){
                    observers.splice(i,1);
                    return;
                }
            }

        },

        /**
         * Function removes all observers from chosen property or function.
         *
         * @function
         * @name py.Observable#removeObservers
         *
         * @param {String} propertyName or functionName
         */
        removeObservers: function(property){
            var observers = this.__observers;
            if(observers[property]){
                delete observers[property];
            }
        }
    }, $NS);


}(py));

(function($NS){
    /**
     * @class IIterator interface definition.
     * @name py.IIterator
     */
    $NS.Interface('IIterator', {
        /**
         * Function should reset iterator to first item
         * and return this item
         *
         * @function
         * @name py.IIterator#first
         */
        first: function(){},
        /**
         * Function should move iterator to next
         * object and return that object
         *
         * @function
         * @name py.IIterator#next
         */
        next: function(){},
        /**
         * Function should return current item which
         * iterator is pointing to
         *
         * @function
         * @name py.IIterator#currentItem
         */
        currentItem: function(){},
        /**
         * Function should return boolean value which indicates
         * if the interation came to an end
         *
         * @function
         * @name py.IIterator#isDone
         */
        isDone: function(){},
        /**
         * Function should execute provided handler
         * on every element of the iterable object
         *
         * @function
         * @name py.IIterator#each
         * @param {Object} fn
         */
        each: function(fn){}
    }, $NS);

}(py));

(function($NS){
    var utils = $NS.utils;

    /**
     * Function transforms an object into
     * iterable array
     *
     * @function
     * @private
     * @param {Object} obj
     *
     * @returns {Array}
     */
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

    /**
     * @class Creates an instance of Iterator object which can be used
     * to iterate over the objects, arrays, and strings.
     *
     * @name py.Iterator
     * @implements py.IIterator
     * @constructor
     * @param {Array | String | Object} iterableObject
     */
    $NS.Class('Iterator', { Implements: $NS.IIterator,

        initialize: function(iterableObject){

            if(iterableObject instanceof Array){
                this.__iterable = iterableObject;
            }else if(iterableObject && utils.isObject(iterableObject)){
                this.__iterable = objectToIterable(iterableObject);
            }else if(iterableObject && utils.isString(iterableObject)){
                this.__iterable = iterableObject.split('');
            }else{
                throw 'non iterable';
            }

            this.__currentItem = null;
            this.__index = null;
            this.first();
        },

        /**
         * Function returns first element on iterable object
         * and reset the iterator pointer to the first element
         * @function
         * @name py.Iterator#first
         * @returns {Object} first item on the iterable list
         */
        first: function(){
            this.__index = 0;
            return this.currentItem();
        },

        /**
         * Function moves iterator pointer to point the next element
         * and returns that element. It will return undefined value
         * if iteration has ended
         * @function
         * @name py.Iterator#next
         * @returns {Object} next item on iterable list
         */
        next: function(){
            var self = this;
            if(!self.isDone()){
                self.__index++;
                return self.currentItem();
            }
        },

        /**
         * Function returns current item iterator
         * pointer is poiniting to
         * @function
         * @name py.Iterator#currentItem
         * @returns {Object} current item on iterable list
         */
        currentItem: function(){
            return this.__iterable[this.__index];
        },

        /**
         * Function returns true if the iteration has
         * reached the limit
         * @function
         * @name py.Iterator#isDone
         * @returns {Boolean}
         */
        isDone: function(){
            return this.__index === this.__iterable.length;
        },

        /**
         * Function will execute provided function handler
         * on every element in the iterable object
         * @function
         * @name py.Iterator#each
         * @param {Object} fn fuction which will be executed on each element
         * @returns {Array} array of results
         */
        each: function(fn){
            var self = this,
                iterable = self.__iterable,
                results = [],
                i,
                l = iterable.length;

            if(utils.isFunction(fn)){
                for(i=0; i<l; i++){
                    self.__index = i;
                    results.push(fn(iterable[i], i, iterable));
                }
            }

            return results;
        }

    }, $NS);

}(py));

(function($NS){

    /**
     * @class Simple list implementation.
     * @name py.List
     *
     * @constructor
     */
    $NS.Class('List', {

        __elements: [],

        /**
         * Funcion adds element to the list
         * @function
         * @name py.List#add
         * @param {Object} element
         */
        add: function(element){
            this.__elements.push(element);
        },

        /**
         * Function returns element at specified
         * position from the list
         * @function
         * @name py.List#getAt
         * @param {Number} index
         * @returns {Object} element at chosen position
         */
        getAt: function(index){
            return this.__elements[index];
        },

        /**
         * Function returns last index
         * of provided element
         * @function
         * @name py.List#indexOf
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
         * @function
         * @name py.List#getLength
         * @returns {Number} list length
         */
        getLength: function(){
            return this.__elements.length;
        },

        /**
         * Function checks if list contains provided element
         * returns either true if yes or false if no
         *
         * @function
         * @name py.List#hasElement
         * @param {Object} element
         *
         * @returns {Boolean}
         */
        hasElement: function(element){
            return -1 !== this.indexOf(element);
        },

        /**
         * Function removes element at specified index
         *
         * @function
         * @name py.List#removeAt
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
         *
         * @function
         * @name py.List#remove
         * @param {Object} element
         */
        remove: function(element){
            var idx = this.indexOf(element);
            while(idx !== -1){
                this.removeAt(idx);
                idx = this.indexOf(element);
            }
        },

        /**
         * Function returns an full list element array
         * @function
         * @name py.List#getElements
         *
         * @returns {Array} returns list elements array
         */
        getElements: function(){
            return this.__elements;
        },

        /**
         * Function creates and returns IIterbale interface
         * which can be used to iterate over the list
         * object
         *
         * @function
         * @name py.List#iterator
         *
         * @returns {IIterable}
         */
        iterator: function(){
            return $NS.IIterator.bind(new $NS.Iterator(this.__elements));
        },

        /**
         * Function reduces the list to contain
         * unique values only
         *
         * @function
         * @name py.List#unique
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
    }, $NS);

}(py));

(function($NS){

    /**
     * @class  ListOf creates a List of provided type, and
     * prevents object of different type or instance from being added
     *
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
            var self = this;
            if((element instanceof self.__of) || (element.constructor && element.constructor === self.__of)){
                $NS.List.prototype.add.call(self, element);
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

(function($NS){
    var utils = $NS.utils,
        isFunction = utils.isFunction,
        isObject = utils.isObject;

    /**
     * @class Listenable is used to emulate custom events and listeners
     * @class
     * @name py.Listenable
     * @constructor
     */
    $NS.Class('Listenable', {

        __registry: {},

        /**
         * Function adds a listener callback to the Listenable object,
         * to listen to the target custom event. This class should be used as
         * a Mixin when creating object which can trigger custom events.
         *
         * @function
         * @name py.Listenable#addListener
         *
         * @example
         *
         * py.Class('MyClass',{ Mixin: py.Listenable,
         *    execute: function(){
         *        this.dispatchEvent('onExecuteCall');
         *    }
         * },'pckg');
         *
         * var myInstance = new pckg.MyClass();
         * myInstance.addListener('onExecuteCall', function(){
         *    //handle custom event
         * });
         * //...
         * myInstance.execute();
         *
         * @param {String} eventName
         * @param {Function} callback
         */
        addListener: function(eventName, callback){
            var self = this,
                registry = self.__registry;

            if(!utils.pairCall(self.addListener, arguments[0], self)){
                if(callback && (isFunction(callback) || isObject(callback))){
                    if(!registry[eventName]){
                        registry[eventName] = [];
                    }
                    registry[eventName].push(callback);
                }else{
                    throw "listener has to be a function or an object";
                }
            }
        },

        /**
         * Function is alias for @see py.Listenable#addListener
         * @function
         * @name py.Listenable#on
         */
        on: function(){
            this.addListener.apply(this, arguments);
        },

        /**
         * Function adds event listener which is fired just once
         * @function
         * @name py.Listenable#once
         *
         * @param {String} eventName
         * @param {Function} callback
         */
        once: function(eventName, callback) {
            var self = this;
            function listener () {
                if(isFunction(callback)){
                    callback.apply(self, arguments);
                } else if (isFunction(callback[eventName])) {
                    callback[eventName].apply(self, arguments);
                }

                self.removeListener(eventName, listener);
            }
            self.addListener(eventName, listener);
            return listener;
        },

        /**
         * Function is alias for @see py.Listenable#removeListener
         * @function
         * @name py.Listenable#cancel
         */
        cancel: function(){
            this.removeListener.apply(this, arguments);
        },

        /**
         * Function is alias for @see py.Listenable#removeListeners
         * @function
         * @name py.Listenable#cancelAll
         */
        cancelAll: function(){
            this.removeListeners.apply(this, arguments);
        },

        /**
         * Function removes listening callback from target event
         *
         * @function
         * @name py.Listenable#removeListener
         *
         * @param {String} eventName
         * @param {Function} callback
         */
        removeListener: function(eventName, callback){
            var self = this,
                registry = self.__registry[eventName],
                i;

            if(registry){
                i = registry.length;
                while(i--){
                    if(registry[i] === callback){
                        registry.splice(i,1);
                        return;
                    }
                }
            }
        },

        /**
         * Function removes all listening callbacks
         * from target event
         * @function
         * @name py.Listenable#removeListeners
         * @param {String} eventName
         */
        removeListeners: function(eventName){
            var registry = this.__registry;
            if(registry[eventName]){
                delete registry[eventName];
            }
        },

        /**
         * Function notifies all listeners listening to
         * the provided event. All parameters besides the
         * eventName are applied to every callback
         *
         * @function
         * @name py.Listenable#dispatchEvent
         * @param {String} eventName
         */
        dispatchEvent: function(eventName){
            var self = this,
                args = Array.prototype.slice.call(arguments, 1),
                registry = self.__registry[eventName],
                listener,
                i,
                l;

            if(registry){
                for(i=0, l=registry.length; i<l; i++){
                    listener = registry[i];
                    if(isFunction(listener)){
                        listener.apply(self, args);
                    }else if(isFunction(listener[eventName])){
                        listener[eventName].apply(listener, args);
                    }
                }
            }

        }
    }, $NS);

}(py));
(function($NS){

    /**
     * Scheduler helper function, executes
     * registered tasks
     * @private
     * @param {Object} tasks
     */
    function execute(tasks){
        var self = this,
            now = (new Date()).getTime(),
            task,
            i,
            l;

            for(i=0, l=tasks.length; i<l; i++){
                task = tasks[i];
                task.action.call(task.ctx || this, now);
            }
    }

    /**
     * Scheduler objcet is used to schedule multiple tasks to run
     * periodically with preset interval.
     *
     * @class Constructor takes interval as argument
     * @name py.Scheduler
     *
     * @constructor
     * @param {Number} interval in milliseconds
     */
    $NS.Class('Scheduler', {

        initialize: function(interval){
            var self = this;
            if(typeof(interval) === 'number' && interval > 0){
                self.__interval = interval;
                self.__tasks = [];
                self.__isRunning = false;
                self.__handle = null;
            }else{
                throw "interval required";
            }
        },

        /**
         * Function adds task to be scheduled using previously
         * set interval.
         *
         * @function
         * @name py.Scheduler#addTask
         * @param {Function} fn function which will be scheduled
         * @param {Object} [optional] context which should be applied to task
         */
        addTask: function(fn, context){
            if(typeof(fn) === 'function'){
                this.__tasks.push({
                    action: fn,
                    ctx: context
                });
            }else{
                throw "taks must be a function";
            }
        },

        /**
         * Function changes interval for the current scheduler instance
         *
         * @function
         * @name py.Scheduler#interval
         * @param {Number} interval in milliseconds
         */
        interval: function(interval){
            this.__interval = interval;
        },

        /**
         * Function removes previously added tasks from scheduler.
         *
         * @function
         * @name py.Scheduler#removeTask
         * @param {Function} fn
         */
        removeTask: function(fn){
            var self = this,
                tasks = self.__tasks,
                i = tasks.length;
            while(i--){
                if(tasks[i].action === fn){
                    tasks.splice(i,1);
                    return;
                }
            }
        },

        /**
         * Function stops the scheduler and clears all registered tasks.
         *
         * @function
         * @name py.Scheduler#reset
         */
        reset: function(){
            this.stop();
            this.__tasks = [];
        },

        /**
         * Function starts scheduler.
         *
         * @function
         * @name py.Scheduler#run
         * @param {Function} fn (optional) if provided will be added to current tasks list
         */
        run: function(fn){
            var self = this;

            if(fn){
                self.addTask(fn);
            }

            self.__isRunning = true;
            self.__handle = setInterval(function(){
                if(self.__isRunning){
                    execute(self.__tasks);
                }
            },self.__interval);
        },

        /**
         * Function stops the scheduler
         *
         * @function
         * @name py.Scheduler#stop
         *
         */
        stop: function(){
            this.__isRunning = false;
            clearInterval(this.__handle);
        },

        /**
         * Function indicates if the scheduler is currently
         * running.
         *
         * @function
         * @name py.Scheduler#isRunning
         *
         * @returns {Boolean} is running
         */
        isRunning: function(){
            return this.__isRunning;
        }

    }, $NS);

}(py));

(function($NS){

    /**
     * Helper function creates new key for
     * listener in registry
     * @private
     */
    function createKey(){
        return '' + this.__length++;
    }

    /**
     * Helper function which calls registered function
     * @private
     * @param {Object} registered
     */
    function callRegistered(registered){
        registered.handler.apply(registered.ctx || this, registered.args);
        registered.clearAspect();
    }

    /**
     * @class Sync is used synchronise callbacks as well as to notify when
     * all registered callback were called.
     *
     * @name py.Sync
     *
     * @params {Object} settings object which may contain following attributes:
     * <ul>
     *     <li><code>synchronize</code> - boolean value if set to true all registered handlers will be called synchronously</li>
     *     <li><code>onAllReady</code> - function which will be called after all handlers were executed</li>
     * </ul>
     *
     * @example
     *
     * var handlers = {
     *     onJsonLoad: function(xhr){},
     *     onTemplateLoad: function(template){}
     * };
     *
     * var sync = new py.Sync({
     *     onAllReady: function(){
     *         //json is loaded and template too
     *     }
     * });
     *
     * sync.addHandler(handlers, 'onJsonLoad');
     * sync.addHandler(handlers, 'onTemplateLoad');
     *
     */
    $NS.Class('Sync', {

        initialize: function(settings){
            var self = this;

            settings = settings || {};
            self.__registry = {};
            self.__length = 0;
            self.__synchronize = settings.synchronize || false;

            if(typeof(settings.onAllReady) === 'function'){
                self.onAllReady = settings.onAllReady;
            }
        },

        /**
         * Function indicates if all handlers are ready
         * @function
         * @name py.Sync#isAllReady
         *
         * @returns {Boolean}
         */
        isAllReady: function(){
            var registry = this.__registry,
                key;

            for(key in registry){
                if(registry.hasOwnProperty(key) && !registry[key].isReady){
                    return false;
                }
            }
            return true;
        },

        /**
         * Function clears the current handlers registry.
         * Registry should be cleared before adding new set of handlers,
         * to synchronize.
         *
         * @function
         * @name py.Sync#clear
         */
        clear: function(){
            this.__registry = {};
            this.__length = 0;
        },

        /**
         * Function adds handler which should be synchronized
         * to the registry.
         * @function
         * @name py.Sync#addHandler
         *
         * @param {Object} source an object which contains handler (i.e XMLHttpRequest instance)
         * @param {String} handlerName
         * @param {Object} context (optional) to which handler should be applied
         */
        addHandler: function(source, handlerName, context){
            var self = this,
                handler = source[handlerName],
                key,
                registered;

            context = context || source;

            if(typeof(handler) === 'function'){
                key = createKey.call(self);

                source[handlerName] = function(){
                    var registryKey,
                        inSync = self.__synchronize,
                        registry = self.__registry;

                    registered = registry[key];
                    if(registered){

                        registered.isReady = true;
                        registered.args = arguments;

                        if(!inSync){
                            callRegistered(registered);
                            delete registry[key];
                        }

                        if(self.isAllReady()){
                            if(inSync){
                                for(registryKey in registry){
                                    if(registry.hasOwnProperty(registryKey)){
                                        callRegistered(registry[registryKey]);
                                        delete registry[registryKey];
                                    }
                                }
                            }

                            if(self.onAllReady){
                                self.onAllReady();
                            }
                        }

                    } else {
                        handler.apply(context || this, arguments);
                        source[handlerName] = handler;
                    }

                };

                self.__registry[key] = {
                    handler: handler,
                    clearAspect: function(){
                        source[handlerName] = handler;
                    },
                    ctx: context || source,
                    isReady: false
                };
            }
        },
        /**
         * User defined function which will be called whan all handlers
         * were executed
         *
         * @function
         * @name py.Sync#onAllReady
         */
        onAllReady: function(){}
    }, $NS);

}(py));

}());
