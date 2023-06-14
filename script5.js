class Ball{
    constructor(x, y, vx, vy,  radius){
        this.position = {"x" : x, "y" : y};
        this.velocity = {"x" : vx, "y" : vy};
        this.radius = radius;
        this.type = "ball";
    }
    // v.5 this method should be simpler, only checks if the object is colliding with another
    // v.5 all the collision cases of this particular object should be described here Ball*Ball Ball*Wall Ball*Object...
    isColliding(objects){//v.5 <- So this now recieves only one object and returns true/false
        let rightPoint = this.position.x + this.radius; 
        let leftPoint = this.position.x - this.radius;
        let bottomPoint = this.position.y + this.radius;
        let upPoint = this.position.y - this.radius;
        let collision = {"occurs" : false, "objects" : []};//v.5 objects now are handled by Simulation.detectCollisions()        
        objects.forEach(object =>{//v.5 not neccessary now, only a pair is compared
            if(object !== this){ //can't collide with itself
                if(object.type == "vertical" && this.velocity.x > 0 && rightPoint >= object.getPosition() && leftPoint < object.getPosition()){                    
                    collision.occurs = true; //from left side of vertical wall
                    collision.objects.push(object);                    
                }
                if(object.type == "vertical" && this.velocity.x < 0 && leftPoint <= object.getPosition() && rightPoint > object.getPosition()){                    
                    collision.occurs = true; //from right side of vertical wall
                    collision.objects.push(object);                    
                }
                if(object.type == "horizontal" && this.velocity.y > 0 && bottomPoint >= object.getPosition() && upPoint < object.getPosition()){                    
                    collision.occurs = true; //from upper side of horizontal wall
                    collision.objects.push(object);                    
                }
                if(object.type == "horizontal" && this.velocity.y < 0 && upPoint <= object.getPosition() && bottomPoint > object.getPosition()){                    
                    collision.occurs = true; //from bottom side of horizontal wall
                    collision.objects.push(object);                    
                }
                //v.5 add ball detection too
            }        
        })        
        return collision;
    }
    getX(){
        return this.position.x;
    }
    getY(){
        return this.position.y;
    }    
    getPosition(){
        return this.position;
    }
    getRadius(){
        return this.radius;
    }
    getVelocityX(){
        return this.velocity.x;
    }
    getVelocityY(){
        return this.velocity.y;
    }
    getVelocity(){
        return this.velocity;
    }
    setX(x){
        this.position.x = x;
    }
    setY(y){
        this.position.y = y;
    }
    setPosition(position){
        this.position = position;
    }
    setVelocityX(vx){
        this.velocity.x = vx;
    }
    setVelocityY(vy){
        this.velocity.y = vy;
    }
    setVelocity(velocity){
        this.velocity = velocity;
    }
    setRadius(radius){
        this.radius = radius;
    }    
}
class Wall{
    // at the moment, walls are only horizontal or vertical inifinite lines for the simulation system.
    constructor (type, position){
        this.position = position;        
        this.type = type;
    }
    getPosition(){
        return this.position;
    }
    getType(){
        return this.type;
    }
    setPosition(position){
        this.position = position;
    }
    setType(type){
        this.type = type;
    }
    // v.5 walls collide too... Wall*Ball = Ball*Wall when we want to detect a collision
    isColliding(object){
        //v.5 *Ball
        //v.5 *Wall
    }
}
class Renderer{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");        
    }
    render(objects){        
        objects.forEach(object => {            
            if(object.type == "ball"){
                this.ctx.lineWidth = 1;
                this.ctx.fillStyle = "rgb(0, 200, 0)";                
                this.ctx.beginPath();                
                this.ctx.arc(object.getX(), object.getY(), object.getRadius(), 0, 2 * Math.PI);
                this.ctx.fill();
            }
            if(object.type == "horizontal"){
                //draw horizontal line
                let y = object.getPosition();                
                this.ctx.lineWidth = 4;
                this.ctx.strokeStyle = "rgb(200, 200, 200)";                
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
            if(object.type == "vertical"){
                //draw vertical line
                let x = object.getPosition();
                this.ctx.lineWidth = 4;
                this.ctx.strokeStyle = "rgb(200, 200, 200)";                
                this.ctx.beginPath();
                this.ctx.moveTo(x, 0);
                this.ctx.lineTo(x, this.canvas.height);
                this.ctx.stroke();
            }                        
        });
    }
    refreshScreen(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
class Runner{ // v.5 litte side-quest: add a reset functionality       
    constructor(objects){
        this.objects = objects;                      
        this.renderer = new Renderer();
        this.simulation = new Simulation(this.objects);
        this.timer = null;
    }
    loop = ()=>{//try loop that manages real time and simulation time
        this.renderer.refreshScreen();       
        this.simulation.step();      
        this.renderer.render(this.objects);
        this.timer = setTimeout(this.loop,16);//this time (ms) is hardcoded
    }    
    stop = ()=>{
        clearTimeout(this.timer);
        this.timer = null;
    }
    start = ()=>{
        this.loop();
    }
    // v.5 my little side-quest
    reset = ()=>{
        // set initial condition
    }
}
class Simulation{    
    constructor(objects){
        this.objects = objects;
    }
    // v.5 NOT IMPORTANT NOW !!bug: when about to stop on the ground, it ends up clipping because of the constantly increasing velocity
    // gravity = (object)=>{ 
    //     let gravityAcceleration = 1; //length ud/step^2
    //     object.setVelocityY(object.getVelocityY() + gravityAcceleration);
    // }
    step = () =>{
        // v.4:
        // this.objects.forEach(object => {            
        //     if(object.type === "ball"){
                              
        //         let collision = object.isColliding(this.objects);               
        //         if(collision.occurs){
        //             collision.objects.forEach(wall => {
        //                 this.collisionResolution(object, wall);
        //             })
        //         }               
        //         // this.gravity(object); // v.5 not now
                
        //         let newPosition = this.calculateNewPosition(object.getPosition(), object.getVelocity());                
        //         object.setPosition(newPosition);
                
                
        //     }
        // });

        // v.5 proposed new Simulation.step() form:
        // create listOfCollisions decide wich data structure works best for this particular case. this variable makes sense in the scope
        // of Simulation.step() and only there.
        // checkForCollisions(); || listOfCollisions = checkForCollisions(); //adds to de list (reference should be passed or this creates the list)
        // if(listOfCollisions != NULL)
        // resolveCollisions(listOfCollisions); //reads the list (reference should be passed)
        // calculateWorldPositions(); // v.5 calculatePosition applied to every object
    }    
    calculateNewPosition(pos, velocity){
        let newX = pos.x + velocity.x;
        let newY = pos.y + velocity.y;
        return {"x" : newX, "y" : newY};        
    }
    // v.5 this method modifies the state of the objects in a collision pair
    collisionResolution(object1, object2){
        // v.5 here I'll write what happens when: Ball*Ball, Ball*Wall, and in the future Object*Ball, Object*Wall
        // v.5 After that I'll simplify if some of them are not necessary or if I should make it simple  
        // v.4:
        // if(object2.type == "horizontal"){
        //     object1.velocity.y = -object1.velocity.y;
        // }
        // if(object2.type == "vertical"){
        //     object1.velocity.x = -object1.velocity.x;
        // }
    }
    // v.5 Generates a collection of collisions in this particular step that sould be resolved
    checkForCollisions(){ // <- the empty list is given to modify or maybe this method is used to initialize it.

        for(let i = 0; i < this.objects.length; i++){
            for(let j = i + 1; j < this.objects.length; j++){
                if(this.objects[i].isColliding()){
                    //v.5 add object[i] and object[j] to the list to resolve their collision
                }
            }
        }
        // return the list? 

    }
    // v.5 takes the collection of collision pairs in one step and calculates the result of each collision case
    resolveCollisions(collisions){//<- recieved list of collision pairs 
        // !!pseudo code:
        // collisions.forEach(collisionPair =>{
        //    collisionResolution(collisionPair.firstObject, collisionPair.secondObject);
        //})
    }

    // v.5 new method added for readability purposes
    calculateWorldPositions(){
        // !!pseudo code:        
        // objects.forEach(object =>{
        //    let position = object.position;
        //    let newPosition = calculateNewPosition(object.position , object.velocity);
        //    object.setPosition(newPosition);
        //})
    }
}
window.addEventListener("load", ()=>{ 
    let clicks = 0;
    let button = document.getElementById("start-stop-btn");
    button.addEventListener("click", ()=>{
        if(clicks % 2 == 0){
            button.innerHTML = "STOP";
            runner.start();
            clicks++;
        }else{
            button.innerHTML = "START";
            runner.stop();
            clicks++;
        }
    });
    var objects = [new Ball(200, 200, -9, 9, 5), new Wall("horizontal", 400), new Wall("vertical", 400),
                    new Wall("horizontal", 0), new Wall("vertical", 0)];
    var runner = new Runner(objects);           
});
