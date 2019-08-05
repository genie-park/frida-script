
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

var class_method_list = [CLASS_METHOD_LIST]

function handleClass(className, methodName){
  var classInstance = Java.use(className);
  classInstance[methodName].overloads.forEach( 
    function(m) {      
      m.implementation = function() {
        emit( className + " " + methodName)                            
        return m.apply(this, arguments);
      }
  })
}

Java.perform( 
    function(){
        var i 
        for ( i = 0 ; i < class_method_list.length ; i ++){
          var item = class_method_list[i]
          var className = item.split(' ')[0];
          var methodName = item.split(' ')[1];
          handleClass(className, methodName)   
        }
        emit('Java Perform Ended')  
    }
);