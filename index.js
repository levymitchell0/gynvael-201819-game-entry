//TODO:
//Have a way to model layers to make sure that user input is handled properly.
//Actually design the game.

console.log('hello');

//stack[0] is the stack for pos0, stack[1] is the stack for pos1
let stack = [[], []];
class Layer {
  constructor(pos, init) {
    this.elem = document.createElement('CANVAS');
    this.elem.style.display = 'none';
    document.body.appendChild(this.elem);
    this.elem.setAttribute('width', pos == 0 ? 1024 : 720);
    this.elem.setAttribute('height', pos == 0 ? 768 : 480);
    this.elem.setAttribute('class', 'pos' + pos);

    init(this.elem);

    this.pos = pos;
    this.stackIndex =  stack[pos].push(this) - 1;
    this.active = false;

    //this.hitAreas is the set of regions listening for mouse clicks.
    //It is structured as an array of arrays, with the top level being all
    //hit areas, the next level being each rectangle and a handler, and the next
    //level being each (x,y) corner of the rectangle.
    //In other words [[x,y],[x,y],fn]
    this.hitAreas = [];
  }
  show() {
    this.elem.style.display = 'block';
    this.active = true;
  }
  hide() {
    this.elem.style.display = 'none';
    this.active = false;
  }
  edit(editfn) {
    editfn(this.elem);
  }
  //corner1 and corner2 should be in the form [x, y] relative to the canvas. The
  //last argument should be a callback, executed when somewhere inside the
  //rectangle is clicked. corner1 should always be the top left, corner2 should
  //always be the bottom right.
  addHitArea(corner1, corner2, fn) {
    this.hitAreas.push([corner1, corner2, fn]);
  }
  checkHit(x, y) {
    if (!this.active) {
      return false;
    }
    let hit = false;
    for (let i = 0; i < this.hitAreas.length; i++) {
      let currentCheck = this.hitAreas[i];
      if (x >= currentCheck[0][0] && x <= currentCheck[1][0]) {
        if (y >= currentCheck[0][1] && y <= currentCheck[1][1]) {
          currentCheck[2]();
          hit = true;
          break;
        }
      }
    }
    return hit;
  }
}

const pos0base = new Layer(0, (elem) => {
  let ctx = elem.getContext('2d');
  ctx.fillRect(20, 20, 150, 100);
});

pos0base.addHitArea([20, 20], [150, 100], () => {
  pos0base.edit((elem) => {
    let ctx = elem.getContext('2d');
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(20, 20, 150, 100);
  });
  console.log('bottom hit');
});

pos0base.show();

const pos0above = new Layer(0, (elem) => {
  let ctx = elem.getContext('2d');
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(50, 50, 150, 100);
});

pos0above.addHitArea([20, 20], [150, 100], () => {
  pos0above.edit((elem) => {
    let ctx = elem.getContext('2d');
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(50, 50, 150, 100);
  });
  console.log('top hit');
});

pos0above.show();

document.getElementById('d0').addEventListener('click', (event) => {
  console.log(`div clicked at x:${event.offsetX}, y: ${event.offsetY}.`);
});
/*const pos0base = new Layer(0, (elem) => {
  let ctx = elem.getContext('2d');
  ctx.beginPath();
  ctx.arc(95, 50, 40, 0, 2 * Math.PI);
  ctx.stroke();
});

pos0base.show();

const pos1base = new Layer(1, (elem) => {
  let ctx = elem.getContext('2d');
  ctx.beginPath();
  ctx.arc(95, 50, 40, 0, 2 * Math.PI);
  ctx.stroke();
});

pos1base.show();

const pos0above = new Layer(0, (elem) => {
  let ctx = elem.getContext('2d');
  ctx.beginPath();
  ctx.arc(105, 50, 40, 0, 2 * Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();
});

pos0above.show();

const pos1above = new Layer(1, (elem) => {
  let ctx = elem.getContext('2d');
  ctx.beginPath();
  ctx.arc(105, 50, 40, 0, 2 * Math.PI);
  ctx.fillStyle = 'red';
  ctx.fill();
});

pos1above.show();
*/
