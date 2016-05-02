function init() {
  console.debug("loaded");
  var heading = document.getElementById("hw-heading");
  var colours = [heading.style.color, "#00F"];
  var index = 0;
  setInterval(function() {
    index = (index === 0) ? 1 : 0;
    heading.style.color = colours[index]},
  500);
}

window.onload = init;