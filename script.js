
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
    constructor(objects){
        this.canvas = document.getElementById("canvas");
        this.ctx = canvas.getContext("2d");
        this.objects = objects;
    }

    render(){
        for (let i = 0; i < this.objects.length; i++){
            this.objects[i].render(this.canvas);
        }
    }
    refreshScreen(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

}



window.addEventListener("load", ()=>{

    var resources = inicialize();
    console.log(resources);    
    function loop() {
        resources.renderer.refreshScreen();
        print();
        console.log(resources.renderer);
        step(resources.renderer.objects);//step in simulation
        console.log(resources.renderer.objects[0].getX());
        console.log(resources.renderer.objects[0].getY());
        console.log(resources.renderer.objects);
        resources.renderer.render(); //render results of step
        setTimeout(loop,16);//request next step in 1000ms    
    }
    function print(){
        resources.count++;
        console.log(`count: ${resources.count}`);    
    }
    
    // console.log(resources);
    // console.log(resources.ball);
    loop();
});
//Most basic game loop
function step(objetos){
    console.log(objetos);
    objetos[0].setX(objetos[0].getX() + 2);
    objetos[0].setY(objetos[0].getY() + 1);
}
// Creates resources
function inicialize(){
    var count = 0 //state of game
    var objects = [new Ball(400, 300, 10)]; //state
    var renderer = new Renderer(objects); //state
    var status = {"count": count, "renderer": renderer};
    return status;
}
