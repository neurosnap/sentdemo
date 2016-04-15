'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

var placeholder = `I am a sentence!  How's it going?

The english language has loads of periods that have nothing to do with sentence punctuation.

Besides abbreviations like M.D. and initials containing periods, they can also end a sentence.

Sentence tokenization is difficult when an abbreviation ends with a sentence,
which is very common in news articles in the U.S.  There are custom initials like E.R.B. which
also happens to be the initals for my name.`;

var maxChars = 500;

window.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <SentDemo text={placeholder} />,
    document.getElementById('demo')
  );
});

const Sentence = ({ text }) => (<div className="sentence border">{text}</div>);

class SentDemo extends React.Component {
  constructor(props) {
    super(props);

    this.textInput = debounce(this.textInput);
    if (this.props.text) this.processText(this.props.text);
  };

  state = {
    positions: [],
    text: '',
    start: true
  };

  static defaultProps = {
    maxChars,
    charsLeft: maxChars
  };

  textInput = (e) => {
    this.processText(e.target.value);
  };

  clearInput = (e) => {
    if (!this.state.start) return;

    e.target.value = '';
    this.setState({ start: false, positions: [], text: '', charsLeft: maxChars });
  };

  processText(text) {
    if (!text.trim()) {
      this.setState({ charsLeft: maxChars, positions: [], text: '' });
    }

    post('/sentences/', 'text=' + encodeURIComponent(text))
      .then(data => {
        let charsLeft = text.length;
        let newLines = text.match(/(\r\n|\n|\r)/g);
        if (newLines != null) charsLeft += newLines.length;

        charsLeft = this.props.maxChars - charsLeft;

        this.setState({
          charsLeft,
          text,
          positions: data.sentences
        });
      })
      .catch(err => { console.log(err); });
  };

  sentences(positions) {
    let sents = [];
    let lastPos = 0;
    for (let i = 0; i < positions.length; i++) {
      let sentPos = positions[i];
      let sentence = this.state.text.slice(lastPos, sentPos);
      lastPos = sentPos;
      sentence = sentence.trim();

      if (!sentence) continue;

      sents.push(<Sentence key={i} text={sentence} />);
    }

    return sents;
  }

  render() {
    let charsLeftClasses = 'chars-left';
    if (this.state.charsLeft < 50) charsLeftClasses += ' red';

    return (
      <div className="row">
        <div className="col-left">
          <textarea id="input"
            maxLength={this.props.maxChars}
            onClick={this.clearInput}
            onChange={this.textInput}
            defaultValue={this.props.text}></textarea>
          <div className={charsLeftClasses}>{this.state.charsLeft} characters remaining</div>
        </div>
        <div className="col-right">
          {this.sentences(this.state.positions)}
        </div>
      </div>
    );
  };
}

function debounce(func, delay=1000) {
  var timer;
  return function(e) {
    e.persist();
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => { func.call(this, e); }, delay);
  };
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

