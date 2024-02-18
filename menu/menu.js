const hover = true; // switch - css hover/js events on menu
if (!hover) {
  const menu = document.getElementById('menu');
  menu.classList.remove('is-hover');
  const subEls = document.querySelectorAll('#menu > ul > li > ul');
  subEls.forEach((item) => {
    if (!hover) {
      item.parentNode.addEventListener('mouseenter', function () {
        item.parentNode.classList.toggle('active');
      });

      item.parentNode.addEventListener('mouseleave', function () {
        item.parentNode.classList.toggle('active');
      });
    }
  });
}
