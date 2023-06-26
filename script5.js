class Ball{
    constructor(x, y, vx, vy,  radius){
        this.position = {"x" : x, "y" : y};
        this.velocity = {"x" : vx, "y" : vy};
        this.radius = radius;
        this.type = "ball";
    }
    isColliding(object){
        let rightPoint = this.position.x + this.radius; 
        let leftPoint = this.position.x - this.radius;
        let bottomPoint = this.position.y + this.radius;
        let upPoint = this.position.y - this.radius;
        let collision = false;
        //TO DO: Make this thing prittier        
        if (object.type == "vertical" && this.velocity.x > 0 && rightPoint >= object.getPosition() && leftPoint < object.getPosition()) {
            collision = true; //from left side of vertical wall            
        }
        if (object.type == "vertical" && this.velocity.x < 0 && leftPoint <= object.getPosition() && rightPoint > object.getPosition()) {
            collision = true; //from right side of vertical wall            
        }
        if (object.type == "horizontal" && this.velocity.y > 0 && bottomPoint >= object.getPosition() && upPoint < object.getPosition()) {
            collision = true; //from upper side of horizontal wall            
        }
        if (object.type == "horizontal" && this.velocity.y < 0 && upPoint <= object.getPosition() && bottomPoint > object.getPosition()) {
            collision = true; //from bottom side of horizontal wall            
        }
        //let's try Ball*Ball       
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
    isColliding(object){
        let collision = false;
        if(object.type === "ball"){
            let rightPoint = object.position.x + object.radius; 
            let leftPoint = object.position.x - object.radius;
            let bottomPoint = object.position.y + object.radius;
            let upPoint = object.position.y - object.radius;
            //TO DO: make this thing prittier
            if (this.type == "vertical" && object.velocity.x > 0 && rightPoint >= this.getPosition() && leftPoint < this.getPosition()) {
                collision = true; //from left side of vertical wall            
            }
            if (this.type == "vertical" && object.velocity.x < 0 && leftPoint <= this.getPosition() && rightPoint > this.getPosition()) {
                collision = true; //from right side of vertical wall            
            }
            if (this.type == "horizontal" && object.velocity.y > 0 && bottomPoint >= this.getPosition() && upPoint < this.getPosition()) {
                collision = true; //from upper side of horizontal wall            
            }
            if (this.type == "horizontal" && object.velocity.y < 0 && upPoint <= this.getPosition() && bottomPoint > this.getPosition()) {
                collision = true; //from bottom side of horizontal wall            
            }
        }
        return collision;
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
                let y = object.getPosition();                
                this.ctx.lineWidth = 4;
                this.ctx.strokeStyle = "rgb(200, 200, 200)";                
                this.ctx.beginPath();
                this.ctx.moveTo(0, y);
                this.ctx.lineTo(this.canvas.width, y);
                this.ctx.stroke();
            }
            if(object.type == "vertical"){
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
class Runner{       
    constructor(objects){        
        this.objects = objects;        
        this.renderer = new Renderer();
        this.simulation = new Simulation();        
        this.timer = null;
    }
    loop = ()=>{//try loop that manages real time and simulation time
        this.renderer.refreshScreen();       
        this.simulation.step(this.objects);      
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
    reset = ()=>{
        this.objects = [new Wall("horizontal", 400), new Ball(200, 200, -9, 9, 5),  new Wall("vertical", 400),
        new Wall("horizontal", 0), new Wall("vertical", 0)];
        this.renderer.refreshScreen();
        this.renderer.render(this.objects); 
    }
}
class Simulation{    
    constructor(){}
    // v.5 NOT IMPORTANT NOW !!bug: when about to stop on the ground, it ends up clipping because of the constantly increasing velocity
    // gravity = (object)=>{ 
    //     let gravityAcceleration = 1; //length ud/step^2
    //     object.setVelocityY(object.getVelocityY() + gravityAcceleration);
    // }
    step = (objects) =>{
        let listOfCollisions = this.checkForCollisions(objects);
        if (listOfCollisions.length > 0){
            this.resolveCollisions(listOfCollisions);
        }
        this.calculateWorldPositions(objects);
    }
    resolveCollisions(collisions){
        collisions.forEach(collisionPair => {
            this.collisionResolution(collisionPair[0], collisionPair[1]);
        })
    }
    collisionResolution(firstObject, secondObject){
        if(firstObject.type === "ball"){
            if(secondObject.type === "horizontal"){
                firstObject.velocity.y = -firstObject.velocity.y;
            }
            if(secondObject.type === "vertical"){
                firstObject.velocity.x = -firstObject.velocity.x;
            }
        }
        if(secondObject.type === "ball"){
            if(firstObject.type === "horizontal"){
                secondObject.velocity.y = -secondObject.velocity.y;
            }
            if(firstObject.type === "vertical"){
                secondObject.velocity.x = -secondObject.velocity.x;
            }
        }
    }
    checkForCollisions(objects){
        let listOfCollisions = [];
        for(let i = 0; i < objects.length; i++){
            for(let j = i + 1; j < objects.length; j++){
                if(objects[i].isColliding(objects[j])){                    
                    listOfCollisions.push([objects[i], objects[j]]);
                }
            }
        }
        return listOfCollisions; 
    }
    calculateWorldPositions(objects){
        objects.forEach(object =>{            
            if(object.type === "ball"){ // this check exists because walls don't have any velocity
                let newPosition = this.calculateNewPosition(object.position, object.velocity);//so this fails
                object.setPosition(newPosition);
            }
        });
    }
    calculateNewPosition(pos, velocity){
        let newX = pos.x + velocity.x;
        let newY = pos.y + velocity.y;
        return {"x" : newX, "y" : newY};        
    }
}

//Initialization
window.addEventListener("load", ()=>{ 
    let clicks = 0;
    let button = document.getElementById("start-stop-btn");
    let resetBtn = document.getElementById("reset-btn");
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
    resetBtn.addEventListener("click", ()=>{
        runner.reset();  
    })
    var objects = [new Wall("horizontal", 400), new Ball(200, 200, -9, 9, 5),  new Wall("vertical", 400),
                    new Wall("horizontal", 0), new Wall("vertical", 0)];    
    var runner = new Runner(objects);
});
