# Dev diary

## 2023-05-27: Starting point decisions
- In order to understand the basics, and for learning purposes this will be a web app.
So any browser shouls be able to run the game, wich is convenient.
- Canvas will be the rendering method.
- Firefox will be the browser used in development.

- Basic files created.
- Simple gameloop running.

## 2023-05-28: Structuring the project
- Moving ball rendering.
- [Runner](https://github.com/FerOrdSom/frontfront/tree/main/doc/runner.md) class added.
- Start and stop button functionality added.
- Ball class added.
- Render class added.
- Simulation class added (as an idea).

## 2023-05-29: First draft working
- Ball is rebounding OK.
- Time to try and refactor.
- Detected some problems in the design:
    - Collisions.
    - Better organization of running functions.
    - Strange parameters of functions, renderer is passed as a parameter in functions that calculate things. Try to classify by meaning.

## 2023-05-31: Refactoring classes
- Everything is a class that handles an abstract part of the problem:
    - Ball class.(an object in simulation)
    - Render class.(draws things)
    - Runner class.(controls the gameloop)
    - Simulation class.(the 'physics' part)
- Making things more clearly defined.
- Simulation dependencies on canvas properties.
- Too complicated simulation methods.
- Ball is now round.

## 2023-06-06: Refactoring classes
- Wall class added to break dependencies on canvas properties.

## 2023-06-07: Refactoring
- Object classes no longer renders itself, now Render class does it all.
- Simulation methods getting more simple. Objective: one method - one task.
- Object classes have a 'type' property, that helps in rendering and in collision calculation. this solution adds simplicity and allows generalization of problems.

## 2023-06-08: Minor refactoring
- Rewriting for readability purposes.

## 2023-06-14: Adressing collision problems.
- Setting new objectives:
    - Redo collision system for better undertanding.

## 2023-06-20: Collisions continued.
- Added new 'reset' functionality and button.
- Collision process have to be redone and reevaluated, but this current version will be the new starting point:
    - Even more simple methods involved.
    - Refactor. Each object class now has a method to check if an instance of itself is colliding.
    - check for collitions(between all objects) -> all detected pair of collitions go to a list.
    - resolve collitions from that list.

## 2023-06-26: Documentation work
- Project rearrangement for discipline and future analysis on development process.

## 2023-06-27: Redesigning wall objects rendering and game screen
- For proper visualization on the canvas.
- Adding a score to the screen.
- Some minor content adjustments and CSS changes.




