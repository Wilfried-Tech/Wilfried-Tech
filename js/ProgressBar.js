function JAN(attr) {
  if (/^[a-z][a-z-]+[a-z]$/.test(attr)) {
    var arr = attr.split('-').map((val, i) => {
      if (!i) return val;
      return val[0].toUpperCase() + val.substr(1, val.length - 1);
    })
    return arr.join('');
  }
  return attr
}

class ProgressElement extends HTMLElement {

  constructor() {
    super()

    this._root = this.attachShadow({ mode: 'open' });
    this.__initAttributes();
    this.__initShape();

  }
  static get __DefaultAttr() {
    return {
      radius: 50,
      stroke: 10,
      linecap: 'round',
      'value-color': 'black',
      'bar-color': 'gray',
      min: 0,
      max: 100,
      value: undefined,
      shape: 'line',
      width: 100,
      height: 20,
      border: 0,
      'border-color': 'black',
    }
  }
  get __DefaultAttr() {
    return ProgressElement.__DefaultAttr;
  }
  static get observedAttributes() {
    return Object.keys(this.__DefaultAttr);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    this.__getAttributes();
    this.__initShape();
  }

  __initAttributes() {
    Object.keys(this.__DefaultAttr).forEach(key => {
      this[JAN(key)] = this.__DefaultAttr[key];
    })
    this.__getAttributes();
  }
  __getAttributes() {
    this.getAttributeNames().forEach(attr => {
      if (Object.keys(this.__DefaultAttr).indexOf(attr) != -1) {
        this[JAN(attr)] = this.getAttribute(attr);
      }
    })
  }
  __indeterminate() {
    if (this.shape == "line") {
      var val = this._root.querySelector('.value');
      val.style.width = (15 * this.width / this.max) + 'px';
      val.style.animation = "undefined 1s infinite alternate"
      this._root.innerHTML += `
      <style>
        @keyframes undefined {
          from {
            margin: 0 0 0 0;
          }
          to {
            margin: 0 0 0 ${ this.width - parseInt(val.style.width)}px;
          }
        }
      </style>
      `;
    }
    if (this.shape == "circle") {
      var val = this._root.querySelector('.value');
      val.style = "stroke-dashoffset:" + (parseInt(val.style.strokeDashoffset) - 15);
      val.style.animation = "undefined 1s infinite alternate"
      this._root.innerHTML += `
      <style>
        @keyframes undefined {
          from {
            transform: rotate(-90deg);
          }
          to {
            transform: rotate(270deg);
          }
        }
      </style>
      `;
    }
  }
  __initShape() {
    if (this.shape == "line") {
      this._root.innerHTML = `
      <div class="progress">
        <div class="value"></div>
      </div>
      <style>
        .progress,.value{
          width: ${this.width}px;
          height: ${this.height}px;
          border-radius: ${(this.linecap=='round')? this.height:'0'}px;
          background: ${this.barColor};
          overflow: hidden;
        }
        .progress{
          border: ${this.border}px solid ${this.borderColor};
        }
        .value{
          background: ${this.valueColor};
          width: ${(this.value*this.width)/this.max}px;
        }
        
          
      </style>
      `;
      if (this.value == undefined) {
        this.__indeterminate();
      }
    }
    if (this.shape == "circle") {
      const trueRadius = ((this.radius * 2) - (this.stroke * 2)) / 2;
      const perimeter = trueRadius * 2 * Math.PI;

      this._root.innerHTML = `<div class="progress">
        <svg height="${this.radius * 2}" width="${this.radius * 2}">
        <circle stroke="${this.barColor}" stroke-width="${this.stroke}" stroke-linecap="${(this.border==0)? 'square': 'round'}" fill="transparent" r="${trueRadius}" cx="${this.radius}" cy="${this.radius}"></circle>
        <circle class="value" stroke="${this.valueColor}" stroke-dasharray="${perimeter} ${perimeter}" style="stroke-dashoffset: ${perimeter - (((this.value)? this.value:0) / this.max * perimeter)}" stroke-width="${this.stroke}" stroke-linecap="${(this.linecap==0)? 'square': 'round'}" fill="transparent" r="${trueRadius}" cx="${this.radius}" cy="${this.radius}"></circle>
          </svg>
         <div class="content">${this.innerHTML}</div>
         </div>
        <style>
.progress > *{
      position: absolute;
      top: 50%;
      left: 50%;
      margin: 0;
      padding: 0;
      box-sizing: border-box;
      -webkit-transform: translate(-50%,-50%);
      -moz-transform: translate(-50%,-50%);
      -ms-transform: translate(-50%,-50%);
      -o-transform: translate(-50%,-50%);
      transform: translate(-50%,-50%);
    }

    .value{
      transform: rotate(-90deg);
      transform-origin: 50% 50%;
    }


.content {
  border-radius: 50%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 0;
  overflow: hidden;
  padding: 0px;
  text-overflow: ellipsis;
}

.content>* {
  width: 99%;
}

.content>img {
  width: 100%;
  object-fit: contain;
}
          .progress {
            width: ${this.radius * 2}px;
            height: ${this.radius * 2}px;
            position: relative;
          }
          
          .content {
            width: ${(trueRadius - (this.stroke / 2)) * 2}px;
            height: ${(trueRadius - (this.stroke / 2)) * 2}px;
          }
        </style>`;
      if (this.value == undefined) {
        this.__indeterminate();
      }
    }
  }
}


window.customElements.define('progress-ring', ProgressElement);