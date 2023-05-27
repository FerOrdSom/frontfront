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
    render(canvas){
        var ctx = canvas.getContext("2d");
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
            objects[i].render(this.canvas);
        }
    }
    refreshScreen(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}
window.addEventListener("load", ()=>{    
    var resources = [new Ball(400, 300, 10)];
    var renderer = new Renderer();
    function loop() {
        renderer.refreshScreen();//clear screen       
        step(resources);//step in simulation        
        renderer.render(resources); //render results of step
        setTimeout(loop,16);//request next step in 1000ms    
    }
    loop();
});

function step(objetos){    
    objetos[0].setX(objetos[0].getX() + 2);
    objetos[0].setY(objetos[0].getY() + 1);
}

