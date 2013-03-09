/**
 * User: aloo
 * Date: 13-3-10
 * Time: 上午2:07
 * expound the principle of inherit mechanism
 */

/*
* simple inherit
* */
function Animal(){
    console.log('Call the constuctor.');
}

var cat = new Animal(); // create a instance

/*
* inherit
* add peroperty to the constructor
* */
function myClass(name){
    this.name = name;
}

var cat = new myClass("Kate"); // create a instance
console.info(cat.name);

