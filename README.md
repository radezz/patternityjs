patternityjs
============

A small library to provide Class creators and basic design patters for javascript. The idea is to provide nice, 
readable and maintainable way to create Classes in javascript and provide most usable patterns and data structures.

Usage
-----
Load the libe file using the script tag and all of the functionality will be available in <em>py</em> namespace: 

```sh
<script src="dist/patternity.min.js"></script>
<script>
  py.Class('MyClass', {
    initialize: function() {
      alert('i am initialied')
    }
  }, 'myproject.classes');
  
  var instance = new myproject.classes.MyClass();
</script>
```

You can use <em>data-namespace</em> attribute to install library in you own project namespace, 
in case it conflicts with one you might already use. 

```sh
<script src="dist/patternity.min.js" data-namespace="myproject"></script>
<script>
  myproject.Class('MyClass', {
    initialize: function() {
      alert('i am initialied')
    }
  }, 'myproject.classes');
  
  var instance = new myproject.classes.MyClass();
</script>
```

List of currently supported objects and patterns
------------------------------------------------

* Class - nice way to create classes
* Interface - validate classes interface and create real interfaces without exposing objects
* Singleton - singleton :)
* Iterator - itarate through iterable objects or classes which implement IIterator
* List - a simple list implementation
* ListOf - list implementation for chosen object / class type bulk methods execution
* Listenable - extends class with custom events and possibility to add listeners
* Observable - extends class with observable properties 
* Scheduler - a timer implementation with task management
* Sync - an object to sync asynchronous actions

For more information about usage clone and check the docs. 


