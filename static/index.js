"use strict";

const MAX_CHARS = 500;
const SECONDS = 1000;
const INITIAL_VALUE = `I am a sentence! How's it going?

The English language has loads of periods that have nothing to do with sentence punctuation.

Besides abbreviations like M.D. and initials containing periods, they can also end a sentence. Sentence tokenization is difficult when an abbreviation ends with a sentence, which is very common in news articles in the U.S.

There are custom initials like E.R.B. which also happens to be the initials for my name.`;

window.addEventListener("DOMContentLoaded", function () {
  render();
});

function getElement(selector) {
  const el = document.querySelector(selector);
  if (!el) {
    throw new Error(`could not find input element "${selector}"`);
  }
  return el;
}

function render() {
  const input = getElement("#input");
  const charsLeft = getElement("#chars-left");
  const results = getElement("#results");
  const onChange = (value) => {
    const delta = MAX_CHARS - value.length;
    charsLeft.innerHTML = `${delta} characters remaining`;
    if (delta < 50) {
      charsLeft.classList.add("red");
    } else {
      charsLeft.classList.remove("red");
    }
  };
  const processText = debounce((text) => {
    const cleanText = text.trim();
    if (!cleanText) return;

    post("/sentences", "text=" + encodeURIComponent(cleanText))
      .then((data) => {
        let charsLeft = text.length;
        const newLines = text.match(/(\r\n|\n|\r)/g);
        if (newLines != null) charsLeft += newLines.length;

        results.innerHTML = "";
        data.sentences.forEach((sentence) => {
          const node = document.createElement("div");
          node.classList.add("sentence", "border");
          const content = document.createTextNode(sentence);
          node.appendChild(content);
          results.appendChild(node);
        });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const startValue = INITIAL_VALUE;
  input.value = startValue;
  onChange(startValue);
  processText(startValue);

  input.setAttribute("maxlength", MAX_CHARS);
  input.addEventListener("input", (e) => {
    const value = e.target.value;
    onChange(value);
    processText(value);
  });
}

function debounce(func, delay = 0.7 * SECONDS) {
  var timer;
  return function (e) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.call(this, e);
    }, delay);
  };
}

function post(url, data) {
  return new Promise(function (resolve, reject) {
    console.log(`Grabbing: ${url}`);
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function () {
      if (ajax.readyState != XMLHttpRequest.DONE) return;
      if (ajax.status != 200) {
        reject(ajax);
        return;
      }
      resolve(JSON.parse(ajax.responseText));
    };

    ajax.open("POST", url, true);
    ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    ajax.send(data);
  });
}
