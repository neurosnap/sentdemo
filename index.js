'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

window.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <SentDemo />,
    document.getElementById('demo')
  );
});

class SentDemo extends React.Component {
  state = {
    sentences: ["I'm a sentence."]
  };

  constructor(props) {
    super(props);
    this.textInput = debounce(this.textInput);
  };

  textInput = (e) => {
    post('/sentences/', 'text=' + e.target.value)
      .then(data => { this.setState({ sentences: data.sentences }); })
      .catch(err => { console.log(err); });
  };

  render() {
    let sentences = [];
    for (let i = 0; i < this.state.sentences.length; i++) {
      let sentence = this.state.sentences[i];
      sentences.push(<Sentence key={i} text={sentence} />);
    }

    return (
      <div>
        <textarea id="input" onChange={this.textInput}></textarea>
        {sentences}
      </div>
    );
  };
}

class Sentence extends React.Component {
  constructor(props) { super(props); };
  render() {
    return (<div className="sentence">{this.props.text}</div>);
  };
}

function debounce(func, delay=500) {
  var timer;
  return function(e) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(func.bind(this, e), delay);
  }
}

function post(url, data) {
  return new Promise(function(resolve, reject) {
    console.log(`Grabbing: ${url}`);
    var ajax = new XMLHttpRequest();
    ajax.onreadystatechange = function() {
      if (ajax.readyState != XMLHttpRequest.DONE) return;
      if (ajax.status != 200) {
        reject(ajax);
        return;
      }
      resolve(JSON.parse(ajax.responseText));
    };

    ajax.open('POST', url, true);
    ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    ajax.send(data);
  });
}

