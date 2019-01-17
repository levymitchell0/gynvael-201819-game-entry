//TODO:
//Actually design the game.

console.log('hello');

//stack[0] is the stack for pos0, stack[1] is the stack for pos1
let stack = [[], []];
class Layer {
  //Current fields:
  //  elem: the canvas element associated with this layer
  //  pos: 0 or 1, where the canvas is located
  //  shown: boolean
  //  stackIndex: where on the stack this Layer is, -1 if not on the stack.
  //  hitAreas: the set of regions listening for mouse clicks. It is structured
  //    as an array of arrays, with the top level being all hit areas, the next
  //    level being each rectangle and a handler, and the next level being each
  //    (x,y) corner of the rectangle. In other words [[x,y], [x,y], fn]
  constructor(pos, init) {
    //Sets up the canvas element.
    this.elem = document.createElement('CANVAS');
    this.elem.style.display = 'none';
    document.body.appendChild(this.elem);
    this.elem.setAttribute('width', pos == 0 ? 1024 : 720);
    this.elem.setAttribute('height', pos == 0 ? 768 : 480);
    this.elem.setAttribute('class', 'pos' + pos);

    //Sets fields to initial values.
    this.pos = pos;
    this.shown = false;
    this.stackIndex = -1;
    this.hitAreas = [];

    //Does whatever is specified in init().
    init(this.elem, this);
  }

  static copy(toCopy) {
    return new Layer(toCopy.pos, (newElem, newLayer) => {
      let ctx = newElem.getContext('2d');
      ctx.drawImage(toCopy.elem, 0, 0);
      newLayer.hitAreas = toCopy.hitAreas;
    });
  }

  //Direction is a boolean that specifies if the element has been shifted right
  //or left; false means left, true means right.
  updateStackPosition(direction) {
    if (direction) {
      this.stackIndex++;
    } else {
      this.stackIndex--;
    }
  }

  addToStack(optionalPosition) {
    if (this.stackIndex != -1) {
      throw `Tried to add a Layer onto the stack, but it's already there.`;
    }
    if (typeof optionalPosition !== 'undefined') {
      if (optionalPosition > stack.length) {
        throw `Tried to add an element at stack[${optionalPosition}], but ${optionalPosition} is greater than the current stack length`;
      }
      stack[this.pos].splice(optionalPosition, 0, this);
      this.stackIndex = optionalPosition

      //This shifts the stackIndex of all the entries after where this element
      //was added, to keep everything consistent.
      for (let i = this.stackIndex + 1; i < stack.length; i++) {
        stack[i].updateStackPosition(true);
      }
    } else {
      //Array push() returns the new array length, so the index of the element
      //added is at that new length - 1.
      this.stackIndex = stack[this.pos].push(this) - 1;
    }

    //Setup display of the element
    this.elem.style.display = 'block';
    this.shown = true;
    this.elem.style.zIndex = this.stackIndex;
  }

  removeFromStack() {
    if (this.stackIndex == -1) {
      return;
    }

    stack[this.pos].splice(this.stackIndex, 1);

    //Stops display of the element
    this.elem.style.display = 'none';
    this.shown = false;
    this.elem.style.zIndex = this.stackIndex;

    //Shifts the stackIndex of all the elements after this one, to reflect
    //their new spot after this instance is removed.
    for (let i = this.stackIndex + 1; i < stack.length; i++) {
      stack[i].updateStackPosition(false);
    }

    this.stackIndex = -1;
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
    if (!this.shown) {
      return false;
    }
    for (let i = 0; i < this.hitAreas.length; i++) {
      let currentCheck = this.hitAreas[i];
      if (x >= currentCheck[0][0] && x <= currentCheck[1][0]) {
        if (y >= currentCheck[0][1] && y <= currentCheck[1][1]) {
          currentCheck[2]();
          return true;
        }
      }
    }
    return false;
  }
}

/* Just a bunch of test cases.
const pos0base = new Layer(0, (elem) => {
  let ctx = elem.getContext('2d');
  ctx.fillRect(20, 20, 150, 100);
});

pos0base.addHitArea([20, 20], [170, 120], () => {
  pos0base.edit((elem) => {
    let ctx = elem.getContext('2d');
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(20, 20, 150, 100);
  });
  console.log('bottom hit');
});

pos0base.addToStack();

const pos0above = new Layer(0, (elem) => {
  let ctx = elem.getContext('2d');
  ctx.fillStyle = '#0000FF';
  ctx.fillRect(50, 50, 150, 100);
});

pos0above.addHitArea([50, 50], [200, 150], () => {
  pos0above.edit((elem) => {
    let ctx = elem.getContext('2d');
    ctx.fillStyle = '#FF0000';
    ctx.fillRect(50, 50, 150, 100);
  });
  console.log('top hit');
});

pos0above.addToStack();

document.getElementById('d0').addEventListener('click', (event) => {
  for (let i = stack[0].length - 1; i >= 0; i--) {
    if(stack[0][i].checkHit(event.offsetX, event.offsetY)) {
      break;
    }
  }
});
const pos0base = new Layer(0, (elem) => {
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
