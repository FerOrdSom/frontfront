class Ball{
    constructor(x, y, vx, vy,  radius){
        this.position = [x, y];
        this.velocity = [vx, vy];
        this.radius = radius;
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
    render(ctx){        
        ctx.fillStyle = "rgb(0, 100, 0)";
        ctx.fillRect(this.getX(), this.getY(), this.getRadius(), this.getRadius());
    }
}
class Renderer{
    constructor(){
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");        
    }
    render(objects){
        for (let i = 0; i < objects.length; i++){
            objects[i].render(this.ctx);
        }
    }
    refreshScreen(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
class Runner{        
    constructor(renderer, resources){
        this.renderer = renderer;        
        this.resources = resources;        
        this.timer = null;
    }
    loop = ()=>{                
        this.renderer.refreshScreen();       
        step(this.resources, this.renderer);        
        this.renderer.render(this.resources);
        this.timer = setTimeout(this.loop,16);
    }
    
    stop = ()=>{
        clearTimeout(this.timer);
        this.timer = null;
    }
    start = ()=>{
        this.loop();
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
    })   
    var resources = [new Ball(300, 300, 6, 4, 10),new Ball(300, 200, -7, 5, 10),new Ball(100, 300, -8, -9, 10),new Ball(200, 250, 9, -3, 10)];
    var renderer = new Renderer();    
    var runner = new Runner(renderer, resources);           
});

function step(objects, renderer){
    for (let i in objects){
        let newPosition = objects[i].getPosition();
        if(collisionNextStep(objects[i], renderer)){
            newPosition = resolveCollision(objects[i], renderer);            
            objects[i].setPosition(newPosition);  
        }else{
            newPosition = calculateNewPosition(objects[i].getPosition(), objects[i].getVelocity());
            objects[i].setPosition(newPosition);
        }        
    }
}

function calculateNewPosition(pos, velocity){
    return [(pos[0] + velocity[0]), (pos[1] + velocity[1])];
    
}

function collisionNextStep(object, renderer){    
    let position = object.getPosition();
    let velocity = object.getVelocity();
    let radius = object.getRadius();
    let width = renderer.canvas.width;
    let height = renderer.canvas.height;

    if(position[0] + velocity[0] <= 0 || position[1] + velocity[1] <= 0 ||
        position[0] + radius + velocity[0]>= width || position[1] + radius + velocity[1] >= height){
        console.log("new Collision in next step!!!");    
        return true;
    }else{
        return false;
    }    
}

function resolveCollision(object, renderer){    
    let radius = object.getRadius();
    let position = object.getPosition();    
    let velocity = object.getVelocity();
    let virtualNextPosition = calculateNewPosition(position, velocity);    
    let newPosition = virtualNextPosition;    
    let top = 0;
    let left = 0;
    let bottom = renderer.canvas.height;
    let right = renderer.canvas.width;
    
    if(virtualNextPosition[0] + radius >= right){        
        console.log("in condition 1");
        if(virtualNextPosition[0] + radius == right){        
            console.log("in condition 1.2");                        
            newPosition[0] = virtualNextPosition[0];                
            object.setVelocityX(-velocity[0]);
        }else{
            newPosition[0] = position[0] - (2 * (right - radius - position[0]) - velocity[0]);                
            object.setVelocityX(-velocity[0]);
        }
    }
    
    if(virtualNextPosition[1] + radius > bottom){
        console.log("in condition 2");
        if(virtualNextPosition[1] + radius == bottom){
            console.log("in condition 2.1");        
            newPosition[1] = virtualNextPosition[1];
            object.setVelocityY(-velocity[1]);
        }else{
            newPosition[1] = position[1] + (2 * (bottom - radius - position[1]) - velocity[1]);
            object.setVelocityY(-velocity[1]);
        }
    }
    
    if(virtualNextPosition[0] <= left){
        console.log("in condition 3");
        newPosition[0] = -virtualNextPosition[0];
        object.setVelocityX(-velocity[0]);
    }
    
    if(virtualNextPosition[1] <= top){
        console.log("in condition 4");
        newPosition[1] = -virtualNextPosition[1];
        object.setVelocityY(-velocity[1]);
    }    
    return newPosition;
}