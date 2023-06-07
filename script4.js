class Ball{
    constructor(x, y, vx, vy,  radius){
        this.position = {"x" : x, "y" : y};
        this.velocity = {"x" : vx, "y" : vy};
        this.radius = radius;
        this.type = "ball";
    }
    isColliding(objects){
        let rightPoint = this.position.x + this.radius; 
        let leftPoint = this.position.x - this.radius;
        let bottomPoint = this.position.y + this.radius;
        let upPoint = this.position.y - this.radius;
        let result = {"collision" : false, "objects" : []};        
        objects.forEach(object =>{
            if(object !== this){
                if(object.type == "vertical" && this.velocity.x > 0 && rightPoint >= object.getPosition() && leftPoint < object.getPosition()){                    
                    result.collision = true; //from left side of vertical wall
                    result.objects.push(object);                    
                }
                if(object.type == "vertical" && this.velocity.x < 0 && leftPoint <= object.getPosition() && rightPoint > object.getPosition()){                    
                    result.collision = true; //from right side of vertical wall
                    result.objects.push(object);                    
                }
                if(object.type == "horizontal" && this.velocity.y > 0 && bottomPoint >= object.getPosition() && upPoint < object.getPosition()){                    
                    result.collision = true; //from upper side of horizontal wall
                    result.objects.push(object);                    
                }
                if(object.type == "horizontal" && this.velocity.y < 0 && upPoint <= object.getPosition() && bottomPoint > object.getPosition()){                    
                    result.collision = true; //from bottom side of horizontal wall
                    result.objects.push(object);                    
                }
            }        
        })        
        return result;
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
class Runner{        
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
}
class Simulation{    
    constructor(objects){
        this.objects = objects;
    }
    // gravity = (object)=>{
    //     let gravityAcceleration = 1; //per sim step ud/step^2
    //     object.setVelocityY(object.getVelocityY() + gravityAcceleration);
    // }
    step = () =>{
        this.objects.forEach(object => {            
            if(object.type === "ball"){                
                let collision = object.isColliding(this.objects);                
                if(collision.collision){
                    collision.objects.forEach(wall => {
                        this.collisionResolution(object, wall);
                    })
                }               
                // this.gravity(object);
                let newPosition = object.getPosition();
                newPosition = this.calculateNewPosition(object.getPosition(), object.getVelocity());
                object.setPosition(newPosition);
            }
        });
    }    
    calculateNewPosition(pos, velocity){
        let newX = pos.x + velocity.x;
        let newY = pos.y + velocity.y;
        return {"x" : newX, "y" : newY};        
    }
    collisionResolution(object1, object2){
        if(object2.type == "horizontal"){
            object1.velocity.y = -object1.velocity.y;
        }
        if(object2.type == "vertical"){
            object1.velocity.x = -object1.velocity.x;
        }
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
    var objects = [new Ball(200, 200, 7, 5, 5), new Wall("horizontal", 400), new Wall("vertical", 400),
                    new Wall("horizontal", 0), new Wall("vertical", 0)];      
    var runner = new Runner(objects);           
});
