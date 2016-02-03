'use strict';

import Rx from 'rx';
import Cycle from '@cycle/core';
import CycleDOM from '@cycle/dom';

function main() {

}

const drivers = {
  DOM: CycleDOM.makeDOMDriver('#demo')
};

Cycle.run(main, drivers);
