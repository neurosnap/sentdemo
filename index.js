'use strict';

import Rx from 'rx';
import Cycle from '@cycle/core';
import { makeDOMDriver, div, textarea } from '@cycle/dom';
import { makeHTTPDriver } from '@cycle/http';

const placeholder = `I am a sentence!  How's it going?

The english language has loads of periods that have nothing to do with sentence punctuation.

Besides abbreviations like M.D. and initials containing periods, they can also end a sentence.

Sentence tokenization is difficult when an abbreviation ends with a sentence,
which is very common in news articles in the U.S.  There are custom initials like E.R.B. which
also happens to be the initials for my name.`;

const maxChars = 500;

function main({ DOM, HTTP }) {
  const trackLength$ = DOM.select('#input').events('input')
    .map(e => e.target.value)
    .startWith(placeholder)
    .map(text => {
      let charLen = text.length;
      let newLines = text.match(/(\r\n|\n|\r)/g);
      if (newLines != null) charLen += newLines.length;

      return maxChars - charLen;
    });

  const getSentences$ = DOM.select('#input').events('input')
    .debounce(1000)
    .map(e => e.target.value)
    .startWith(placeholder)
    .map(text => {
      return {
        method: 'POST',
        url: '/sentences/',
        query: { text }
      };
    });

  const input$ = HTTP.mergeAll()
    .map(res => {
      const positions = res.body.sentences;
      const text = res.request.query.text;

      let sentences = [];
      let lastPos = 0;
      for (let i = 0; i < positions.length; i++) {
        let sentPos = positions[i];
        let sentence = text.slice(lastPos, sentPos);
        lastPos = sentPos;
        sentence = sentence.trim();

        if (!sentence) continue;

        sentences.push(div('.sentence .border', sentence));
      }

      return { text, sentences };
    });

  const action$ = Rx.Observable
    .combineLatest(trackLength$, input$, (s1, s2) => {
      let remainClasses = '.chars-left';
      if (s1 < 50) remainClasses += ' .red';

      return {
        ...s2,
        remaining: s1,
        remainClasses
      };
    });

  const vtree$ = action$.map(data =>
    div('.row', [
      div('.col-left', [
        textarea('#input', { maxLength: maxChars }, data.text),
        div(data.remainClasses, `${data.remaining} characters remaining`)
      ]),
      div('.col-right', data.sentences)
    ])
  );

  return {
    DOM: vtree$,
    HTTP: getSentences$
  };
}

const drivers = {
  DOM: makeDOMDriver('#demo'),
  HTTP: makeHTTPDriver()
};

Cycle.run(main, drivers);

