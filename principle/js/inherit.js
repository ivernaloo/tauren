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


/*
* inherit
* add method to constructor
* */
function Animal(name){
    this.name = name;
    this.jump = function(){
        alert (this.name + " is jumping...");
    };

    this.eat = function(){
        alert (this.name + " is eatting...");
    };
}

var cat = new Animal("Kate");

console.info(cat.name);
cat.jump();
cat.eat();


/*
* inherit
* add property and method to the constructor's prototype
* */
function Animal(name){
    this.name = name;
}

Animal.prototype = {

    type : 'cat',

    jump : function(){
        alert (this.name + " is jumping...");
    },

    eat : function(){
        alert (this.name + " is eatting...");
    }

}

var cat = new Animal("Kate");

alert(cat.name);
alert(cat.type);
cat.jump();
cat.eat();




/*
* inherit class
* a class inherit from a class
* */
function Dog(){};
Dog.prototype = new Animal("Henry");

var dog = new Dog();
dog.jump();
dog.eat();


/*
* inerit class
* implement the feature of Polymorphism
* */
function Dog(){};//创建dog子类
Dog.prototype = new Animal("Henry");
//重写dog的方法
Dog.prototype.jump = function(){
    console.info("Hi, this is " + this.name + ", I'm jumping...")
};
Dog.prototype.eat = function(){
    console.info("Henry is eatting a bone now.");
};

function Pig(){};//创建pig子类
Pig.prototype = new Animal("Coco");
//重写pig的方法
Pig.prototype.jump = function(){
    console.info("I'm sorry. " + this.name + " can not jump.");
};
Pig.prototype.eat = function(){
    console.info("Hi, I'm " + this.name + ", I'm eatting something delicious.");
}

var dog = new Dog();
dog.jump();
dog.eat();

var pig = new Pig();

pig.jump();
pig.eat();