const subEls = document.body.querySelectorAll('#menu > ul > li > ul');
subEls.forEach((item) => {
  item.className = 'submenu';

  const arrow = document.createElement('span');
  arrow.className = 'arrow';
  arrow.innerHTML = 'up or down arrow';

  const marker = document.createElement('span');
  marker.className = 'marker';
  marker.innerHTML = 'parent marker';
  marker.style.left = item.parentNode.offsetLeft + 'px';

  item.parentNode.className = 'has-submenu';
  item.parentNode.insertBefore(arrow, item);
  item.parentNode.insertBefore(marker, item);

  item.parentNode.addEventListener('mouseenter', function () {
    item.parentNode.classList.toggle('active');
  });

  item.parentNode.addEventListener('mouseleave', function () {
    item.parentNode.classList.toggle('active');
  });
});
