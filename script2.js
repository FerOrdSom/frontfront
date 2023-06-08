class Ball{
    constructor(x, y, vx, vy,  radius){
        this.position = [x, y];
        this.velocity = [vx, vy];
        this.radius = radius;
        this.shape = "ball";
    }
    getX(){
        return this.position[0];
    }
    getY(){
        return this.position[1];
    }    
    getPosition(){
        return this.position;
    }
    getRadius(){
        return this.radius;
    }
    getVelocityX(){
        return this.velocity[0];
    }
    getVelocityY(){
        return this.velocity[1];
    }
    getVelocity(){
        return this.velocity;
    }
    setX(x){
        this.position[0] = x;
    }
    setY(y){
        this.position[1] = y;
    }
    setPosition(position){
        this.position = position;
    }
    setVelocityX(vx){
        this.velocity[0] = vx;
    }
    setVelocityY(vy){
        this.velocity[1] = vy;
    }
    setVelocity(velocity){
        this.velocity = velocity;
    }
    setRadius(radius){
        this.radius = radius;
    }    
}
class Renderer{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");        
    }
    render(objects){        
        objects.forEach(object => {
            if(object.shape == "ball"){
                this.ctx.fillStyle = "rgb(0, 200, 0)";
                // this.ctx.fillRect(object.getX(), object.getY(), object.getRadius(), object.getRadius());
                this.ctx.beginPath();
                this.ctx.arc(object.getX(), object.getY(), object.getRadius(), 0, 2 * Math.PI);
                this.ctx.fill();
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
    gravity = (object)=>{
        let gravityAcceleration = 1; //per sim step ud/step^2
        object.setVelocityY(object.getVelocityY() + gravityAcceleration);
    }
    step = ()=>{
        this.objects.forEach(object => {
            // this.gravity(object);
            let newPosition = object.getPosition();
            if(this.collisionNextStep(object, this.width, this.height)){
                newPosition = this.resolveCollision(object, this.width, this.height);            
                object.setPosition(newPosition);  
            }else{
                newPosition = this.calculateNewPosition(object.getPosition(), object.getVelocity());
                object.setPosition(newPosition);
            }
            
        });
    }    
    calculateNewPosition(pos, velocity){
        return [pos[0] + velocity[0], pos[1] + velocity[1]];        
    }    
    collisionNextStep(object, width, height){  //think of a more general solution. (try collision between objects)   
        let position = object.getPosition();
        let velocity = object.getVelocity();
        let radius = object.getRadius();
        if(position[0] - radius + velocity[0] <= 0 || position[1] - radius + velocity[1] <= 0 ||
            position[0] + radius + velocity[0]>= width || position[1] + radius + velocity[1] >= height){
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
        if(virtualNextPosition[0] + radius >= width){
            if(virtualNextPosition[0] + radius == width){
                object.setVelocityX(-velocity[0]);
            }else{
                newPosition[0] = position[0] + (2 * (width - radius - position[0]) - velocity[0]);                
                object.setVelocityX(-velocity[0]);
            }
        }        
        if(virtualNextPosition[1] + radius >= height){
            if(virtualNextPosition[1] + radius == height){
                object.setVelocityY(-velocity[1]);
            }else{
                newPosition[1] = position[1] + (2 * (height - radius - position[1]) - velocity[1]);
                object.setVelocityY(-velocity[1]);
            }
        }        
        if(virtualNextPosition[0] - radius <= left){
            if(virtualNextPosition[0] - radius == left){
                object.setVelocityX(-velocity[0]);
            }else{
                newPosition[0] = position[0] + (2 * (left + radius - position[0]) - velocity[0]);
                object.setVelocityX(-velocity[0]);
            }            
        }                         
        if(virtualNextPosition[1] - radius <= top){
            if(virtualNextPosition[1] - radius == top){
                object.setVelocityY(-velocity[1]);
            }else{
                newPosition[1] = position[1] + (2 * (top + radius - position[1]) - velocity[1]);
                object.setVelocityY(-velocity[1]);
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
    var objects = [new Ball(200, 200, 56, 32, 5)];    
    var runner = new Runner(objects);           
});
