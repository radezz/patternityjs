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
