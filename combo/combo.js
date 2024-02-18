const dynamic = false; // switch - search as you type functionality
const combo = document.body.querySelector('#combo');
const form = combo.parentNode;
const wrapper = combo.parentNode.parentNode;
const output = wrapper.lastElementChild.lastElementChild;
const xhr = new XMLHttpRequest();
let started = false;

combo.addEventListener('input', searchInput);
form.addEventListener('submit', searchSubmit);
addListeners(xhr);

function searchInput(e) {
  const value = searchInit(e);
  if (dynamic) {
    let timeout;
    if (started) xhr.abort();
    if (timeout) clearTimeout(timeout);
    if (value && value.length > 1) {
      timeout = setTimeout(function () {
        searchXhr(value);
      }, 500);
    }
  }
}

function searchSubmit(e) {
  e.preventDefault();
  if (!dynamic && !started) {
    const value = searchInit(e);
    if (value) {
      searchXhr(value);
    }
  }
}

function searchInit(e) {
  const phrase = combo.value.trimStart();
  combo.value = phrase;
  if (phrase) wrapper.classList.add('action');
  else wrapper.classList.remove('action', 'show');
  return phrase;
}

function searchXhr(word) {
  xhr.open('GET', 'https://dummyjson.com/products/search?q=' + word + '&limit=5&delay=1000', true);
  xhr.send();
}

function addListeners(xhr) {
  xhr.addEventListener('loadstart', requestStart);
  xhr.addEventListener('load', requestProcess);
  xhr.addEventListener('loadend', requestEnd);
  xhr.addEventListener('error', requestError);
}

function requestStart(e) {
  started = true;
  wrapper.classList.add('loading');
  wrapper.classList.remove('show');
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
    wrapper.classList.add('show');
  }
}

function requestEnd(e) {
  started = false;
  wrapper.classList.remove('loading');
}

function requestError(e) {
  const line = document.createElement('div');
  line.className = 'result-line';
  const lineContent = document.createElement('span');
  lineContent.className = 'error';
  lineContent.textContent = 'The request encountered an error: ' + xhr.responseText;
  output.append(line);
}
