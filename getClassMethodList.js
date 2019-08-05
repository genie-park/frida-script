var timer = null;
var pending = [];

function emit(event) {
  pending.push(event);
  if (timer === null)
      timer = setTimeout(flush, 50);
}

function flush() {
  if (timer !== null) {
      clearTimeout(timer);
      timer = null;
  }
  if (pending.length === 0)
      return;
  var items = pending;
  pending = [];
  send(items)
}

Java.perform( 
  function(){ 
    var class_list = Java.enumerateLoadedClassesSync();
    var i , j;
    for ( i = 0 ; i < class_list.length ; i ++ ){
        if(class_list[i].indexOf('reddit')>=0) {
            var className = class_list[i]
            var classInstance = Java.use(className);
            var method_list = classInstance.class.getDeclaredMethods();
            for (j = 0 ; j < method_list.length ; j ++ ) {
                var m = method_list[j];                    
                var methodName = m.toGenericString();
                while (methodName.includes("<")) { methodName = methodName.replace(/<.*?>/g, ""); }
                if (methodName.indexOf(" throws ") !== -1) { methodName = methodName.substring(0, methodName.indexOf(" throws ")); }         
                methodName = methodName.slice(methodName.lastIndexOf(" "));
                methodName = methodName.replace(' ' + className + '.', "");            
                methodName = methodName.split("(")[0];                    
                emit(className + ' ' + methodName )
            }
        }
    }
    emit('Java Perform Endded')
  }
);