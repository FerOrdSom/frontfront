class Ball{
    constructor(x, y, radius){
        this.positionX = x;
        this.positionY = y;
        this.radius = radius;
    }
    getX(){
        return this.positionX;
    }
    getY(){
        return this.positionY;        
    }
    getRadius(){
        return this.radius;
    }
    setX(x){
        this.positionX = x;
    }
    setY(y){
        this.positionY = y;
    }
    setRaius(radius){
        this.radius = radius;
    }
    render(ctx){        
        ctx.fillStyle = "rgb(0, 100, 0)";
        ctx.fillRect(this.positionX, this.positionY, this.radius, this.radius);
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
        this.renderer.refreshScreen();//clear screen       
        this.step(this.resources);//step in simulation        
        this.renderer.render(this.resources); //render results of step
        this.timer = setTimeout(this.loop,16);
    }
    step(objects){    
        objects[0].setX(objects[0].getX() + 2);
        objects[0].setY(objects[0].getY() + 1);
        objects[1].setX(objects[1].getX() + 3);
        objects[1].setY(objects[1].getY() + 2);
    }
    stop(){
        clearTimeout(this.timer);
        this.timer = null;
    }
    start(){
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
    var resources = [new Ball(400, 300, 10),new Ball(200, 200, 10)];
    var renderer = new Renderer();    
    var runner = new Runner(renderer, resources);
    // runner.start();
    

       
});

