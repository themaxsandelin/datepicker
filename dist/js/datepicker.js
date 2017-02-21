'use strict';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Datepicker = function Datepicker(options) {
  _classCallCheck(this, Datepicker);

  moment.locale(options.locale ? options.locale : 'en');

  document.addEventListener('DOMContentLoaded', function () {
    if (options.target) {} else if (options.targets) {} else {
      console.log('Missing target(s) for datepicker.');
    }
  });
};