let apiUrl = (code) => `https://ifsc.razorpay.com/${code}`;
let category = 'articles';

let loader = getEle('loader');
let content = getEle('content');
let categoryHeader = getEle('category');
let newsData;

//Initiate bootstrap tooltips
$(document).ready(function () {
  $('body').tooltip({ selector: '[data-toggle=tooltip]' });
});

// Pagination Code Starts
let start = 0;
let recordsPerPage = 6;

async function getData(param, recs = start) {
  categoryHeader.innerText = param.toUpperCase();
  loader.innerHTML = `<div class="d-flex justify-content-center">
    <div class="spinner-border text-light" role="status">
      <span class="sr-only">Loading...</span>
    </div>
    </div>`;
  category = param;
  let req = await fetch(`https://test.spaceflightnewsapi.net/api/v2/${param}?_start=${recs}&_limit=6`);
  let res = await req.json();
  newsData = res;
  buildPaginationUI();
  buildUI(res);
  checkButtons();
  loader.innerHTML = '';
}

getData('articles', start);

function loadNextPage() {
  start = start + recordsPerPage;
  getData(category, start);
  checkButtons();
}

function loadPrevPage() {
  start = start - recordsPerPage;
  getData(category, start);
  checkButtons();
}

function checkButtons() {
  let prevButton = document.getElementById('prev');
  if (start === 0) {
    prevButton.className += ' disabled';
    setAttribute(prevButton, 'style', 'cursor: not-allowed;');
  } else {
    prevButton.classList.remove('disabled');
  }
}

// Build Pagination DOM
function buildPaginationUI() {
  let mainDiv = document.getElementById('pagination');
  mainDiv.innerHTML = '';

  let paginationDiv = createElement('div');
  setAttribute(paginationDiv, 'class', 'd-flex justify-content-center');
  appendChild(mainDiv, paginationDiv);

  let navBar = createElement('nav');
  setAttribute(navBar, 'aria-label', 'Pagination Data');
  appendChild(paginationDiv, navBar);

  let ul = createElement('ul');
  setAttribute(ul, 'class', 'pagination');
  appendChild(navBar, ul);

  //Create previous button and add it to the container
  let prevButton = createElement('li');
  setAttribute(prevButton, 'class', 'page-item');
  setAttribute(prevButton, 'id', 'prev');
  appendChild(ul, prevButton);

  let prevHyperLink = createElement('a');
  setAttribute(prevHyperLink, 'class', 'page-link');
  setAttribute(prevHyperLink, 'style', 'cursor: pointer;');
  setAttribute(prevHyperLink, 'onclick', `loadPrevPage()`);

  prevHyperLink.innerText = 'Previous';
  appendChild(prevButton, prevHyperLink);
  appendChild(ul, prevButton);

  //Create next button and add it to the container
  let nextButton = createElement('li');
  setAttribute(nextButton, 'class', 'page-item');
  setAttribute(nextButton, 'id', 'next');
  appendChild(ul, nextButton);

  let nextHyperLink = createElement('a');
  setAttribute(nextHyperLink, 'class', 'page-link');
  setAttribute(nextHyperLink, 'style', 'cursor: pointer;');
  setAttribute(nextHyperLink, 'onclick', `loadNextPage()`);
  nextHyperLink.innerText = 'Next';
  appendChild(nextButton, nextHyperLink);
  appendChild(ul, nextButton);
}
//Pagination Code Ends

function buildFilter() {
  let filterInput = getEle('inputSource');
  //Filter Data by input search
  let filteredData = newsData.filter((ele) => ele.newsSite.toLowerCase().includes(filterInput.value.toLowerCase()));
  buildUI(filteredData);
}

//Build Data Content
function buildUI(data) {
  content.innerHTML = '';
  if (data.length === 0) {
    let noRes = createElement('h1');
    setAttribute(noRes, 'class', 'text-white align-middle');
    noRes.innerText = 'No Results Found !!!';
    appendChild(content, noRes);
  }
  for (let i = 0; i < data.length; i++) {
    // create card
    let card = createElement('div');
    setAttribute(card, 'class', 'card m-3 col-md-6 col-lg-5 col-xl-3 col-sm-6 col-xs-12');
    appendChild(content, card);

    let cardBody = createElement('div');
    setAttribute(cardBody, 'class', 'card-body text-center');
    appendChild(card, cardBody);

    let title = createElement('h6');
    setAttribute(title, 'class', 'card-title text-dark');
    title.innerText = data[i].title;
    appendChild(cardBody, title);

    if (data[i].imageUrl !== null) {
      // append image to card
      let img = createElement('img');
      img.src = data[i].imageUrl;
      setAttribute(img, 'class', 'card-img-top img-fluid card-img-custom');
      appendChild(cardBody, img);
    }

    let tagLine = createElement('div');
    setAttribute(tagLine, 'class', 'text-truncate');
    setAttribute(tagLine, 'data-toggle', 'tooltip');
    setAttribute(tagLine, 'data-placement', 'top');
    setAttribute(tagLine, 'title', data[i].summary);
    appendChild(cardBody, tagLine);

    let tagText = createElement('i');
    tagText.innerText = data[i].summary;
    appendChild(tagLine, tagText);

    let source = createElement('div');
    appendChild(cardBody, source);

    let sourceLabel = createElement('b');
    sourceLabel.innerText = 'Source: ';
    appendChild(source, sourceLabel);

    let sourceLink = createElement('a');
    setAttribute(sourceLink, 'href', data[i].url);
    setAttribute(sourceLink, 'target', '_blank');
    appendChild(source, sourceLink);

    let sourceData = createElement('span');
    sourceData.innerText = data[i].newsSite;
    appendChild(sourceLink, sourceData);

    let lastUpdatedDiv = createElement('div');
    appendChild(cardBody, lastUpdatedDiv);

    let lastUpdatedLabel = createElement('b');
    lastUpdatedLabel.innerText = 'Last Updated : ';
    appendChild(lastUpdatedDiv, lastUpdatedLabel);

    let lastUpdated = createElement('span');
    setAttribute(lastUpdated, 'class', 'badge badge-info');
    lastUpdated.innerText = new Date(data[i].updatedAt).toDateString();
    appendChild(lastUpdatedDiv, lastUpdated);
  }
}
