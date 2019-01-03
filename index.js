//TODO:
//Have a way to model layers to make sure that user input is handled properly.
//Actually design the game.

console.log("hello");

//stack[0] is the stack for pos0, stack[1] is the stack for pos1
let stack = [[], []];
class Layer {
  constructor(pos, init) {
    this.elem = document.createElement("CANVAS");
    this.elem.style.display = "none";
    document.body.appendChild(this.elem);
    this.elem.setAttribute('width', pos == 0 ? 1024 : 720);
    this.elem.setAttribute('height', pos == 0 ? 768 : 480);
    this.elem.setAttribute('class', 'pos' + pos);

    init(this.elem);

    this.pos = pos;
    this.stackIndex =  stack[pos].push(this) - 1;
    this.active = false;
  }
  show() {
    this.elem.style.display = "block";
    this.active = true;
  }
  hide() {
    this.elem.style.display = "none";
    this.active = false;
  }
  edit(editfn) {
    editfn(this.elem);
  }
}

const pos0base = new Layer(0, (elem) => {
  let ctx = elem.getContext("2d");
  ctx.beginPath();
  ctx.arc(95, 50, 40, 0, 2 * Math.PI);
  ctx.stroke();
});

pos0base.show();

const pos1base = new Layer(1, (elem) => {
  let ctx = elem.getContext("2d");
  ctx.beginPath();
  ctx.arc(95, 50, 40, 0, 2 * Math.PI);
  ctx.stroke();
});

pos1base.show();

const pos0above = new Layer(0, (elem) => {
  let ctx = elem.getContext("2d");
  ctx.beginPath();
  ctx.arc(105, 50, 40, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
});

pos0above.show();

const pos1above = new Layer(1, (elem) => {
  let ctx = elem.getContext("2d");
  ctx.beginPath();
  ctx.arc(105, 50, 40, 0, 2 * Math.PI);
  ctx.fillStyle = "red";
  ctx.fill();
});

pos1above.show();
