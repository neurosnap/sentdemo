'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

window.addEventListener('DOMContentLoaded', function() {
  renderDemo();

  let ta = document.getElementById('input');
  ta.addEventListener('input', debounce(function() {
    renderDemo(this.value);
  }));
});

class SentDemo extends React.Component {
  constructor(props) { super(props); };
  render() {
    return (
      <div>
        <textarea id="input"></textarea>
        <Sentence />
      </div>
    );
  };
}

class Sentence extends React.Component {
  constructor(props) { super(props); }
  render() {
    return (<div>A sentence!</div>);
  }
}

function renderDemo(text='') {
  ReactDOM.render(
    <SentDemo text={ text } />,
    document.getElementById('demo')
  );
}

function debounce(func, delay=500) {
  var timer;
  return function() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func.bind(this), delay);
  }
}

function get(url) {
  return new Promise(function(resolve, reject) {
    console.log(`Grabbing: ${url}`);
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState != XMLHttpRequest.DONE) return;
      if (ajax.status != 200) {
        reject(ajax);
        return;
      }
      resolve(ajax);
    };

    ajax.open('GET', url, true);
    ajax.send();
  });
}

