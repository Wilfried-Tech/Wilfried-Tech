function File(path) {
  var _this = this;

  if (typeof path !== 'string') {
    throw `the string name is permit instead of ${typeof path}`;
  }
  if (/^[\w\W.]+\.[\w]+$/.test(path)) {
    path = ((/^\.{0,2}\//.test(path)) ? '' : './') + path;
  } else {
    throw 'the file name is not correct';
  }
  this.path = path;

  /(.+)\.(.+)$/.test(path.split('/')[path.split('/').length - 1]);

  this.name = RegExp.$1;
  this.mime = 'text/' + RegExp.$2;
  this.extension = RegExp.$2;
  this.content = '';

  var xhr = new XMLHttpRequest();
  xhr.open('GET', path);
  xhr.send(null);
  xhr.addEventListener('load', (e) => {
    if (xhr.status == 200 || xhr.readyState == XMLHttpRequest.DONE) {
      _this.content = xhr.responseText;
      _this.onload(xhr.responseText);
    } else {
      _this.onerror(xhr.status);
    }
  })
  xhr.onerror = function(e) {
    _this.onerror(e);
  }
}

File.prototype.onload = function(e) {};
File.prototype.onerror = function(e) {};

/*
    
*/

function createElement(Elt, attr,data,children) {
  var elt = document.createElement(Elt);
  if (attr) {
    for (var prop in attr) {
      if (prop != 'text') {
        elt.setAttribute(prop, attr[prop]);
      }
    }
    if (attr.text) {
      elt.innerHTML = attr.text;
    }
  }
  if (data) {
    for(var prop in data){
      elt[prop] = data[prop];
    }
  }
  if(children){
    children.forEach(child =>{
      elt.appendChild(child);
    });
  }
  return elt;
}

function $(arg) {
  return document.querySelector(arg);
}

function randInt(min=0,max=Infinity) {
  return Math.floor(Math.random()*(max-min))+min;
}