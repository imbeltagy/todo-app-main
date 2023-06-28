// Switch Theme
document.getElementById("switch-theme").onclick = function () {
  [this.src, this.dataset.altSrc] = [this.dataset.altSrc, this.src];
  document.body.classList.toggle("light");
};
