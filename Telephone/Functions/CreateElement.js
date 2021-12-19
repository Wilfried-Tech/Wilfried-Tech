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
