(function(nsString){
    var nsPart,
        targetObject = this,
        py;
    if(nsString && typeof(nsString) === 'string'){
        nsString = nsString.split('.');
        while(nsPart = nsString.shift()){
            if(!targetObject[nsPart]){
                targetObject[nsPart] = {};
            }
            targetObject = targetObject[nsPart];
        }
    }
    py = targetObject;