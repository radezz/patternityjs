(function($NS, $UTIL){
    
    var KeyProperties = {};
    
    function bind(objectInstance, interfaceDefinition){
        var key;
            
        for(key in interfaceDefinition){
            if(interfaceDefinition.hasOwnProperty(key)){
                if(typeof(objectInstance[key]) === 'function'){
                    this[key] = function(){
                        objectInstance[key].apply(objectInstance, arguments);    
                    };
                }
            }
        }
    }
    
    function mixinProto(construct, definition){
        var key;
        for(key in definition){
            if(definition.hasOwnProperty(key) && !KeyProperties[key]){
                construct.prototype[key] = definition[key];    
            }
        }
    }
    
    function InterfaceObject(nsOrDefinition, definition){
        var ns,
            construct;
        
        if(typeof(nsOrDefinition) === 'string'){
            ns = nsOrDefinition;
            if(!definition){
                throw 'object definition required when namespace provided';
            }
            
        }else if(typeof(nsOrDefinition) !== 'object'){
            throw 'parameter needs to be an object or namespace string';
        }else{
            definition = nsOrDefinition;
        }
        
        construct = function(objectInstance){
            if(objectInstance){
                bind.apply(this, objectInstance, definition);
            }
        };
        
        construct.bind = function(objectInstance){
            return new construct(objectInstance);
        };
        
        mixinProto(construct, definition);
        
        return construct;
    };
    
    InterfaceObject.prototype = {
        bind: bind
    };
    
    $NS.Interface = InterfaceObject;
    
}(patternity, patternityUtils));