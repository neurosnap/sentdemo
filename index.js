'use strict';

import React from 'react';
import ReactDOM from 'react-dom';

var placeholder = `Hey there!  How's it going?

My initials are E.R.B. which is alright.
Here's the U.S. at the beginning of the sentence and now I'll end the sentence with U.S.  This is great,
I'll just call Sen. Bernie Sanders to help me get out of here.

Or maybe Rep. Lindsey Graham would be better...`;

var maxChars = 500;

window.addEventListener('DOMContentLoaded', function() {
  ReactDOM.render(
    <SentDemo text={placeholder} />,
    document.getElementById('demo')
  );
});

class SentDemo extends React.Component {
  state = {
    sentences: [],
    start: true,
    loading: false
  };

  static defaultProps = {
    maxChars,
    charsLeft: maxChars
  };

  constructor(props) {
    super(props);

    this.textInput = debounce(this.textInput);
    if (this.props.text) this.processText(this.props.text);
  };

  textInput = (e) => {
    this.processText(e.target.value);
  };

  clearInput = (e) => {
    if (!this.state.start) return;

    e.target.value = '';
    this.setState({ start: false, sentences: [], charsLeft: maxChars });
  };

  processText(text) {
    if (!text.trim()) {
      this.setState({ charsLeft: maxChars, sentences: [] });
    }

    if (!this.state.start) this.setState({ loading: true });

    post('/sentences/', 'text=' + text)
      .then(data => {
        let charsLeft = text.length;
        let newLines = text.match(/(\r\n|\n|\r)/g);
        if (newLines != null) charsLeft += newLines.length;

        charsLeft = this.props.maxChars - charsLeft;

        this.setState({
          charsLeft,
          sentences: data.sentences,
          loading: false
        });
      })
      .catch(err => { console.log(err); });
  };

  render() {
    let sentences = [];
    for (let i = 0; i < this.state.sentences.length; i++) {
      let sentence = this.state.sentences[i];
      if (!sentence.trim()) continue;
      sentences.push(<Sentence key={i} text={sentence} />);
    }

    let charsLeftClasses = 'chars-left';
    if (this.state.charsLeft < 50) charsLeftClasses += ' red';

    let loading = '';
    if (this.state.loading) {
      loading = <img src="/static/zelda.gif" className="loading" />
    }

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
          {loading}
          {sentences}
        </div>
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

function debounce(func, delay=1000) {
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

