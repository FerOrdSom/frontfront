window.addEventListener("load", ()=>{
    let mainContainer = document.getElementById("main-container");
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "rgb(0, 100, 0)";
    ctx.fillRect(400, 300, 10, 10);
    console.log(`canvas width: ${canvas.width} canvas height: ${canvas.height}`)    
});
//Most basic game loop
var count = 0 //state of game
const loop = ()=>{     
    print();//step in simulation
    setTimeout(loop,1000);//request next step in 1000ms
}
var print = ()=>{
    count++;
    console.log(`count: ${count}`);    
}
loop();
