let started = false;
const combo = document.body.querySelector('#combo');
const output = document.body.querySelector('#results');
const xhr = new XMLHttpRequest();

combo.addEventListener('input', searchInit);
combo.addEventListener('blur', resetSearch);
addListeners(xhr);

function searchInit(e) {
  e.target.value = e.target.value.trim();
  const phrase = e.target.value;

  if (phrase) this.parentNode.classList.add('action');
  else this.parentNode.classList.remove('action');

  if (started) xhr.abort();
  if (phrase && phrase.length > 1) {
    xhr.open('GET', 'https://dummyjson.com/products/search?q=' + phrase + '&limit=5&delay=1000', true);
    xhr.send();
  } else {
    if (combo.parentNode.classList.contains('show')) combo.parentNode.classList.remove('show');
  }
}

function resetSearch(e) {
  e.target.value = '';
  if (started) xhr.abort();
  if (combo.parentNode.classList.contains('show')) combo.parentNode.classList.remove('show');
  if (combo.parentNode.classList.contains('action')) combo.parentNode.classList.remove('action');
}

function addListeners(xhr) {
  xhr.addEventListener('loadstart', requestStart);
  xhr.addEventListener('load', requestProcess);
  xhr.addEventListener('loadend', requestEnd);
  xhr.addEventListener('error', requestError);
}

function requestStart(e) {
  started = true;
  combo.parentNode.classList.add('loading');
  combo.parentNode.classList.remove('show');
}

function requestProcess(e) {
  if (xhr.readyState === 4) {
    output.textContent = '';
    if (xhr.status === 200) {
      const response = JSON.parse(xhr.responseText);

      if (response.total) {
        response.products.forEach((item) => {
          const line = document.createElement('div');
          line.className = 'result-line';
          const lineProductName = document.createElement('span');
          lineProductName.className = 'product-name';
          lineProductName.textContent = item.title;
          line.append(lineProductName);
          const lineProductPrice = document.createElement('span');
          lineProductPrice.className = 'product-name';
          lineProductPrice.textContent = '$' + item.price;
          line.append(lineProductPrice);
          output.append(line);
        });
      } else {
        const line = document.createElement('div');
        line.className = 'result-line';
        const lineContent = document.createElement('span');
        lineContent.textContent = 'Sorry, no results this time';
        line.append(lineContent);
        output.append(line);
      }
    } else {
      const line = document.createElement('div');
      line.className = 'result-line';
      const lineContent = document.createElement('span');
      lineContent.className = 'error';
      lineContent.textContent = 'Some errors occured: ' + xhr.responseText;
      line.append(lineContent);
      output.append(line);
    }
  }
}

function requestEnd(e) {
  started = false;
  combo.parentNode.classList.remove('loading');
  combo.parentNode.classList.add('show');
}

function requestError(e) {
  const line = document.createElement('div');
  line.className = 'result-line';
  const lineContent = document.createElement('span');
  lineContent.className = 'error';
  lineContent.textContent = 'The request encountered an error: ' + xhr.responseText;
  output.append(line);
}
