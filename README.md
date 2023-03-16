# Errand Runner

This is a react-based errand running RPG with code written entirely by GPT-4 (via the ChatGPT interface). 

See it live here: [https://errandrunner.dev/](https://errandrunner.dev/)
## Creation

The original prompt I supplied the model is available in prompt.txt. It took a lot of back and forth to get the game where it is now.

The graphic for the character was created with DALL·E 2.

## Features

GPT-4 was able to include some interesting features, including: 
- edge & impassable object detection
- map generation
- map swapping (capable of a large map while only displaying a smaller portion)
- a quest system (delivering items)

## Limitations

Two things I was unable to get GPT-4 to do:

1) Maps sliding into view upon map change.  When the character touches the edge of a map now, the new map instantly appears.  This is a little jarring.  I would've preferred for the map to slide into view so the user has a clearer understanding of what to do.  After lots of coaxing, I eventually gave up on GPT-4 being able to do this.
2) AI driving. I wanted the character to be driven by a character AI.  I tried many methods to coax GPT-4 to write some pathfinding and goal selection code.  GPT-4 did try every time, but, seemed to get very confused.  Ultimately I gave up.


## Running
This game will run like any other create-react-app

```
npm i
npm run start
```