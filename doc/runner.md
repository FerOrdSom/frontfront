# Runner

The main class of the game. Takes an initial state and modifies it in a *game loop*. The *game loop* refers to the overall flow of the game program. This one only has to do two basic things, draw the state (render), and simulate the next state (simulate).

This class also controls when to start, stop or reset the game.


## Proposed solution(javascript pseudo code):

```js
class Runner{       
    constructor(state){
        this.state
        this.timer = null;// variable for controlling the runner
        
    }
    loop = ()=>{
        renderNewScreen();      
        calculateNewState();      
        renderState();
        this.timer = setTimeout(this.loop, frameTimeMs);
    }    
    stop = ()=>{
        clearTimeout(this.timer);
        this.timer = null;
    }
    start = ()=>{
        this.loop();
    }
    reset = ()=>{
        this.state = someNewState;
        renderNewScreen();
        renderState(); 
    }
}

```
A while loop for the gameloop, is out of the question. JavaScript runs on a single thread, so it will make the browser unable to perform other tasks once it is being executed. So let's try this one.

