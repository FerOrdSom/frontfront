class Ball{
    constructor(x, y, vx, vy,  radius){
        this.position = {"x" : x, "y" : y};
        this.velocity = {"x" : vx, "y" : vy};
        this.radius = radius;
        this.type = "ball";
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
    // at the moment, walls are only horizontal or vertical inifinite lines.
    constructor (type = "vertical", position = 0){
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
        this.simulation = new Simulation(this.objects, this.renderer);
        this.timer = null;
    }
    loop = ()=>{//try loop that manages real time and simulation time
        this.renderer.refreshScreen();       
        this.simulation.step(this.objects, this.renderer);      
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
    constructor(objects, renderer){
        this.objects = objects;        
        this.renderer = renderer;
        this.width = this.renderer.canvas.width;        
        this.height = this.renderer.canvas.height;
    }
    // gravity = (object)=>{
    //     let gravityAcceleration = 1; //per sim step ud/step^2
    //     object.setVelocityY(object.getVelocityY() + gravityAcceleration);
    // }
    step = ()=>{
        this.objects.forEach(object => {
            if(object.type === "ball"){                
                // this.gravity(object);
                let newPosition = object.getPosition();                
                if(this.collisionNextStep(object, this.width, this.height)){
                    newPosition = this.resolveCollision(object, this.width, this.height);            
                    object.setPosition(newPosition);  
                }else{
                    newPosition = this.calculateNewPosition(object.getPosition(), object.getVelocity());
                    object.setPosition(newPosition);
                }
            }
        });
    }    
    calculateNewPosition(pos, velocity){
        let newX = pos.x + velocity.x;
        let newY = pos.y + velocity.y;
        return {"x" : newX, "y" : newY};        
    }    
    collisionNextStep(object, width, height){  //think of a more general solution. (try collision between objects)   
        let position = object.getPosition();
        let velocity = object.getVelocity();
        let radius = object.getRadius();
        if(position.x - radius + velocity.x <= 0 || position.y - radius + velocity.y <= 0 ||
            position.x + radius + velocity.x>= width || position.y + radius + velocity.y >= height){
            console.log("new Collision in next step!!!");    
            return true;
        }else{
            return false;
        }    
    }    
    resolveCollision(object, width, height){    //think of a more general solution. (try collision between objects)        
        let radius = object.getRadius();
        let position = object.getPosition();    
        let velocity = object.getVelocity();
        let virtualNextPosition = this.calculateNewPosition(position, velocity); 
        let newPosition = virtualNextPosition;    
        let top = 0; //try collision between objects
        let left = 0; //try collision between objects
        if(virtualNextPosition.x + radius >= width){
            if(virtualNextPosition.x + radius == width){
                object.setVelocityX(-velocity.x);
            }else{
                newPosition.x = position.x + (2 * (width - radius - position.x) - velocity.x);                
                object.setVelocityX(-velocity.x);
            }
        }        
        if(virtualNextPosition.y + radius >= height){
            if(virtualNextPosition.y + radius == height){
                object.setVelocityY(-velocity.y);
            }else{
                newPosition.y = position.y + (2 * (height - radius - position.y) - velocity.y);
                object.setVelocityY(-velocity.y);
            }
        }        
        if(virtualNextPosition.x - radius <= left){
            if(virtualNextPosition.x - radius == left){
                object.setVelocityX(-velocity.x);
            }else{
                newPosition.x = position.x + (2 * (left + radius - position.x) - velocity.x);
                object.setVelocityX(-velocity.x);
            }            
        }                         
        if(virtualNextPosition.y - radius <= top){
            if(virtualNextPosition.y - radius == top){
                object.setVelocityY(-velocity.y);
            }else{
                newPosition.y = position.y + (2 * (top + radius - position.y) - velocity.y);
                object.setVelocityY(-velocity.y);
            }            
        }    
        return newPosition;
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
    var objects = [new Ball(200, 200, 6, 3, 5), new Wall("horizontal", 0), new Wall("horizontal", 400),
                    new Wall("vertical", 0), new Wall("vertical", 400)];       
    var runner = new Runner(objects);           
});
