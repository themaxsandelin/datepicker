'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Datepicker = function () {
  function Datepicker(options) {
    var _this2 = this;

    _classCallCheck(this, Datepicker);

    moment.locale('sv');

    this.hidden = true;
    this.enableClicks = false;
    this.lastTarget = null;
    this.startTarget = options.startTarget;
    this.endTarget = options.endTarget;
    this.activeMoment = moment().format('YYYY-MM-DD');
    this.selected = {
      start: '',
      end: '',
      weeks: {}
    };

    function triggerClick(e) {
      var _this = this;

      var target = e.target;
      if (e.target.nodeName !== 'INPUT') {
        var input = target.querySelector('input');
        if (!input) throw new Error('Could not fine the input fields in the trigger.');

        target = input;
      }
      if (!this.hidden && this.lastTarget === target) return;

      if (!this.hidden && this.lastTarget !== target) {
        e.stopPropagation();
        this.lastTarget = target;
        this.enableClicks = false;
        this.datepicker.style.display = 'none';
        this.datepicker.classList.remove('show');

        setDatepickerPosition.bind(this)(function () {
          _this.datepicker.style.display = 'block';
          setTimeout(function () {
            _this.enableClicks = true;
            _this.datepicker.classList.add('show');
          }, 20);
        });

        return console.log('Gonna show this here, bitch!');
      }

      this.lastTarget = target;
      function setDatepickerPosition(callback) {
        var position = target.getBoundingClientRect();
        var top = window.scrollY + (position.top + target.offsetHeight);
        var left = position.left;
        var right = void 0;
        var center = false;

        // Check if picker goes out of bounds
        var bodyWidth = document.body.offsetWidth;
        var pickerWidth = 290;
        var padding = 80;
        var breakpoint = bodyWidth - (pickerWidth + padding);
        if (left > breakpoint) {
          var difference = bodyWidth - target.offsetWidth;
          if (bodyWidth < 400 && difference > bodyWidth - pickerWidth) {
            center = true;
          } else {
            right = bodyWidth - (left + target.offsetWidth);
          }
        }

        this.datepicker.style.top = top + 'px';
        if (center) {
          this.datepicker.style.right = 'auto';
          this.datepicker.style.left = '50%';
          this.datepicker.style.marginLeft = '-145px';
        } else {
          if (right) {
            this.datepicker.style.right = right + 'px';
            this.datepicker.style.left = 'auto';
            this.datepicker.style.marginLeft = '0px';
          } else {
            this.datepicker.style.left = left + 'px';
            this.datepicker.style.right = 'auto';
            this.datepicker.style.marginLeft = '0px';
          }
        }

        if (callback) callback();
      }

      setDatepickerPosition.bind(this)(function () {
        _this.show();
      });
    }

    document.addEventListener('DOMContentLoaded', function () {
      _this2.startTarget = document.querySelector(_this2.startTarget);
      _this2.endTarget = document.querySelector(_this2.endTarget);

      _this2.build(function () {
        _this2.render();
      });

      var triggers = document.querySelectorAll('.datepickertrigger');

      var _loop = function _loop(i) {
        triggers[i].addEventListener('click', triggerClick.bind(_this2));

        var trigger = triggers[i];
        var input = triggers[i].nodeName === 'INPUT' ? triggers[i] : triggers[i].querySelector('input');
        input.addEventListener('focus', function (e) {
          e.target.blur();
          trigger.click();
        });
      };

      for (var i = 0; i < triggers.length; i++) {
        _loop(i);
      }
    });
  }

  _createClass(Datepicker, [{
    key: 'build',
    value: function build(callback) {

      function switchMonth(e) {
        var item = e.target;

        if (item.classList.contains('next')) {
          this.activeMoment = moment(this.activeMoment).add(1, 'month').format('YYYY-MM-DD');
        } else {
          this.activeMoment = moment(this.activeMoment).subtract(1, 'month').format('YYYY-MM-DD');
        }

        this.render();
      }

      function buildHeader() {
        var header = document.createElement('div');
        header.classList.add('header');

        // Build the title
        var title = document.createElement('h4');

        // Build the controls
        var controls = document.createElement('div');
        controls.classList.add('controls');

        var prev = document.createElement('div');
        prev.classList.add('switch');
        prev.classList.add('prev');
        prev.addEventListener('click', switchMonth.bind(this));

        var next = document.createElement('div');
        next.classList.add('switch');
        next.classList.add('next');
        next.addEventListener('click', switchMonth.bind(this));

        controls.appendChild(prev);
        controls.appendChild(next);

        header.appendChild(title);
        header.appendChild(controls);

        return header;
      }

      function buildDates() {
        var dates = document.createElement('div');
        dates.classList.add('dates');

        // Build weekdays
        var weekdays = document.createElement('ul');
        weekdays.classList.add('row');
        weekdays.classList.add('weekdays');
        var dayInitials = ['M', 'T', 'O', 'T', 'F', 'L', 'S'];
        for (var d = 0; d < 7; d++) {
          var day = document.createElement('li');
          day.innerText = dayInitials[d];
          weekdays.appendChild(day);
        }

        // Build weeks
        var weeks = document.createElement('div');
        weeks.classList.add('weeks');
        for (var w = 0; w < 5; w++) {
          var week = document.createElement('ul');
          week.classList.add('row');
          weeks.appendChild(week);
        }

        dates.appendChild(weekdays);
        dates.appendChild(weeks);

        return dates;
      }

      // Build main element
      var main = document.createElement('div');
      main.classList.add('datepicker');
      main.appendChild(buildHeader.bind(this)());
      main.appendChild(buildDates.bind(this)());

      document.body.appendChild(main);
      this.datepicker = main;

      if (callback) callback();
    }
  }, {
    key: 'render',
    value: function render() {

      function selectDate(e) {
        var item = e.target;

        var spec = this.selected.end !== '' || this.selected.start === '' ? 'start' : 'end';
        var dates = this.datepicker.querySelectorAll('.weeks .row li');
        var date = item.getAttribute('data-date');

        if (spec === 'start') {
          this.selected = {
            start: '',
            end: '',
            weeks: {}
          };
          for (var d = 0; d < dates.length; d++) {
            dates[d].classList.remove('selected');
          }
          this.clearOldWeekBars();
        } else {
          if (this.selected.start === date) return;
          if (moment(this.selected.start).isAfter(moment(date))) {
            var clickedDate = date;
            this.datepicker.querySelector('.weeks .row li[data-date="' + date + '"]').classList.add('selected');

            date = this.selected.start;
            this.selected.start = clickedDate;
          }
        }

        this.datepicker.querySelector('.weeks .row li[data-date="' + date + '"]').classList.add('selected');
        this.selected[spec] = date;

        if (spec === 'end') {
          var start = moment(this.selected.start).startOf('week');
          var end = moment(this.selected.end).startOf('week');
          var week = parseInt(moment(this.selected.start).format('w'));
          var sameWeek = start.isSame(end, 'week');
          var _weeks = 1 + (!sameWeek ? Math.ceil(end.diff(start, 'day') / 7) : 0);

          for (var w = 0; w < _weeks; w++) {
            var days = void 0;
            if (sameWeek) {
              days = moment(this.selected.end).diff(moment(this.selected.start), 'day') + 1;
            } else {
              if (!w) {
                days = moment(this.selected.start).endOf('week').diff(moment(this.selected.start), 'day') + 1;
              } else if (w === _weeks - 1) {
                days = moment(this.selected.end).diff(moment(this.selected.end).startOf('week'), 'day') + 1;
              } else {
                days = 7;
              }
            }
            this.selected.weeks[week + w] = days;
          }

          this.startTarget.value = this.selected.start;
          this.endTarget.value = this.selected.end;

          this.renderWeekBars();
          this.hide();
        }
      }

      // Render title
      var title = moment(this.activeMoment).format('MMMM') + ' ' + moment(this.activeMoment).format('YYYY');
      this.datepicker.querySelector('.header h4').innerText = title;

      var firstDate = moment(this.activeMoment).startOf('month').startOf('week').format('YYYY-MM-DD');
      var firstWeek = parseInt(moment(firstDate).format('w'));
      var month = moment(this.activeMoment).format('MM');

      // Render weeks.
      var activeDay = moment(firstDate);
      var weeks = this.datepicker.querySelectorAll('.weeks .row');
      for (var w = 0; w < 5; w++) {
        var week = weeks[w];
        week.setAttribute('data-week-number', firstWeek + w);
        week.innerHTML = '';

        for (var d = 0; d < 7; d++) {
          var thisMonth = activeDay.format('MM') === month;
          var day = document.createElement('li');
          day.innerText = activeDay.format('D');
          day.setAttribute('data-date', activeDay.format('YYYY-MM-DD'));
          day.addEventListener('click', selectDate.bind(this));

          if (!thisMonth) {
            day.classList.add('other');
          }

          var format = activeDay.format('YYYY-MM-DD');
          if (format === this.selected.start || format === this.selected.end) {
            day.classList.add('selected');
          }

          week.appendChild(day);
          activeDay.add(1, 'days');
        }
      }

      this.clearOldWeekBars();

      if (this.selected.start && this.selected.end) this.renderWeekBars();
    }
  }, {
    key: 'clearOldWeekBars',
    value: function clearOldWeekBars() {
      var bars = this.datepicker.querySelectorAll('.weeks ul.row .bar');
      if (bars.length) {
        for (var b = 0; b < bars.length; b++) {
          bars[b].parentNode.removeChild(bars[b]);
        }
      }
    }
  }, {
    key: 'renderWeekBars',
    value: function renderWeekBars() {
      var offset = void 0;
      var start = moment(this.selected.start).startOf('week');
      var end = moment(this.selected.end).startOf('week');
      if (start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {
        offset = moment(this.selected.start).diff(start, 'day');
      }

      var weekWidth = 20;
      var margin = (this.datepicker.querySelector('.weeks').offsetWidth - weekWidth * 7) / 6;
      var weeks = Object.keys(this.selected.weeks);
      for (var w = 0; w < weeks.length; w++) {
        var week = weeks[w];
        var row = this.datepicker.querySelector('.weeks ul.row[data-week-number="' + week + '"]');
        if (row) {
          var styleKey = !w ? 'right' : 'left';
          var width = 20 * this.selected.weeks[week] + margin * (this.selected.weeks[week] - 1) + 'px';
          var bar = document.createElement('div');
          bar.classList.add('bar');
          if (offset !== undefined && !w) {
            bar.style.left = weekWidth * offset + margin * offset + 'px';
          } else {
            bar.style[styleKey] = '0';
          }
          bar.style.width = width;

          row.appendChild(bar);
        }
      }
    }
  }, {
    key: 'handlePickerClick',
    value: function handlePickerClick(e) {
      if (!this.enableClicks) return;

      e.stopPropagation();
    }
  }, {
    key: 'handleDocumentClick',
    value: function handleDocumentClick() {
      if (!this.enableClicks) return;

      this.update('hide');
    }
  }, {
    key: 'update',
    value: function update(action) {
      var pickerHandler = this.handlePickerClick.bind(this);
      var documentHandler = this.handleDocumentClick.bind(this);

      this.datepicker.addEventListener('click', pickerHandler);
      document.body.addEventListener('click', documentHandler);

      function hide() {
        this.hidden = true;
        this.enableClicks = false;
        var transitionHandler = hidePicker.bind(this);

        function hidePicker() {
          this.datepicker.style.display = 'none';
          this.datepicker.removeEventListener('transitionend', transitionHandler);
        }

        this.datepicker.classList.remove('show');
        this.datepicker.addEventListener('transitionend', transitionHandler);
      }

      function show() {
        var _this3 = this;

        this.hidden = false;
        this.datepicker.style.display = 'block';
        var transitionHandler = showPicker.bind(this);

        function showPicker() {
          this.enableClicks = true;
          this.datepicker.removeEventListener('transitionend', transitionHandler);
        }

        setTimeout(function () {
          _this3.datepicker.classList.add('show');
          _this3.datepicker.addEventListener('transitionend', transitionHandler);
        }, 20);
      }

      if (action === 'show') {
        show.bind(this)();
      } else if (action === 'hide') {
        hide.bind(this)();
      }
    }
  }, {
    key: 'hide',
    value: function hide() {
      this.update('hide');
    }
  }, {
    key: 'show',
    value: function show() {
      this.update('show');
    }
  }]);

  return Datepicker;
}();

var picker = new Datepicker({
  startTarget: '#arrival',
  endTarget: '#departure'
});