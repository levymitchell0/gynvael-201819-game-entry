//TODO:
//Have a way to model layers to make sure that user input is handled properly.
//Actually design the game.

console.log("hello");

//Stack[0] is the stack for pos0, stack[1] is the stack for pos1
let stack = [[], []];
class Layer {
  constructor(pos, init) {
    this.elem = init();
    this.stackIndex = null;
    this.shown = false;
    this.pos = pos;
  }
  show() {
    this.elem.style.display = "block";
    this.stackIndex = stack[this.pos].push(this) - 1;
    this.shown = true;
  }
  hide() {
    this.elem.style.display = "none";
    stack[this.pos].splice(stack[this.pos].indexOf(this), 1);
  }
}

const pos0base = new Layer(0, () => {
  let canvas = document.createElement("CANVAS");
  document.body.appendChild(canvas);
  canvas.setAttribute('width', 1024);
  canvas.setAttribute('height', 768);
  canvas.setAttribute('class', 'pos0');
  return canvas;
});

pos0base.show();
console.log(stack[0][0].elem);

function sleep(milliseconds) {
  var start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds){
      break;
    }
  }
}

sleep(5000);

pos0base.hide();
console.log(stack[0][0].elem);
