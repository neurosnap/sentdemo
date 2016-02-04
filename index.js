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
also happens to be the initals for my name.`;

const maxChars = 500;

function main(sources) {
  //const trackLength$ = sources.DOM.select('#input').events('input')
  //  .map(e => e.target.value.length);

  const getSentences$ = sources.DOM.select('#input').events('input')
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

  const input$ = sources.HTTP
    .mergeAll()
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

  const vtree$ = input$.map(data =>
    div('.row', [
      div('.col-left', [
        textarea('#input', data.text),
        div('', ` characters remaining`)
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

