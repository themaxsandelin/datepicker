class Datepicker {

  constructor (options) {
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

    function triggerClick (e) {
      let target = e.target;
      if (e.target.nodeName !== 'INPUT') {
        const input = target.querySelector('input');
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

        setDatepickerPosition.bind(this)(() => {
          this.datepicker.style.display = 'block';
          setTimeout(() => {
            this.enableClicks = true;
            this.datepicker.classList.add('show');
          }, 20);
        });

        return console.log('Gonna show this here, bitch!');
      }

      this.lastTarget = target;
      function setDatepickerPosition (callback) {
        const position = target.getBoundingClientRect();
        const top = (window.scrollY + (position.top + target.offsetHeight));
        const left = position.left;
        let right;
        let center = false;

        // Check if picker goes out of bounds
        const bodyWidth = document.body.offsetWidth;
        const pickerWidth = 290;
        const padding = 80;
        const breakpoint = bodyWidth - (pickerWidth + padding);
        if (left > breakpoint) {
          const difference = bodyWidth - target.offsetWidth;
          if (bodyWidth < 400 && difference > (bodyWidth - pickerWidth)) {
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

      setDatepickerPosition.bind(this)(() => {
        this.show();
      });
    }

    document.addEventListener('DOMContentLoaded', () => {
      this.startTarget = document.querySelector(this.startTarget);
      this.endTarget = document.querySelector(this.endTarget);

      this.build(() => {
        this.render();
      });

      const triggers = document.querySelectorAll('.datepickertrigger');
      for (let i = 0; i < triggers.length; i++) {
        triggers[i].addEventListener('click', triggerClick.bind(this));

        const trigger = triggers[i];
        let input = (triggers[i].nodeName === 'INPUT') ? triggers[i]:triggers[i].querySelector('input');
        input.addEventListener('focus', (e) => {
          e.target.blur();
          trigger.click();
        });
      }
    });
  }

  build (callback) {

    function switchMonth (e) {
      const item = e.target;

      if (item.classList.contains('next')) {
        this.activeMoment = moment(this.activeMoment).add(1, 'month').format('YYYY-MM-DD');
      } else {
        this.activeMoment = moment(this.activeMoment).subtract(1, 'month').format('YYYY-MM-DD');
      }

      this.render();
    }

    function buildHeader () {
      const header = document.createElement('div');
      header.classList.add('header');

      // Build the title
      const title = document.createElement('h4');

      // Build the controls
      const controls = document.createElement('div');
      controls.classList.add('controls');

      const prev = document.createElement('div');
      prev.classList.add('switch');
      prev.classList.add('prev');
      prev.addEventListener('click', switchMonth.bind(this));

      const next = document.createElement('div');
      next.classList.add('switch');
      next.classList.add('next');
      next.addEventListener('click', switchMonth.bind(this));

      controls.appendChild(prev);
      controls.appendChild(next);

      header.appendChild(title);
      header.appendChild(controls);

      return header;
    }

    function buildDates () {
      const dates = document.createElement('div');
      dates.classList.add('dates');

      // Build weekdays
      const weekdays = document.createElement('ul');
      weekdays.classList.add('row');
      weekdays.classList.add('weekdays');
      const dayInitials = [ 'M', 'T', 'O', 'T', 'F', 'L', 'S' ];
      for (let d = 0; d < 7; d++) {
        const day = document.createElement('li');
        day.innerText = dayInitials[d];
        weekdays.appendChild(day);
      }

      // Build weeks
      const weeks = document.createElement('div');
      weeks.classList.add('weeks');
      for (let w = 0; w < 5; w++) {
        const week = document.createElement('ul');
        week.classList.add('row');
        weeks.appendChild(week);
      }

      dates.appendChild(weekdays);
      dates.appendChild(weeks);

      return dates;
    }

    // Build main element
    const main = document.createElement('div');
    main.classList.add('datepicker');
    main.appendChild(buildHeader.bind(this)());
    main.appendChild(buildDates.bind(this)());

    document.body.appendChild(main);
    this.datepicker = main;

    if (callback) callback();
  }

  render () {

    function selectDate (e) {
      const item = e.target;

      const spec = (this.selected.end !== '' || this.selected.start === '') ? 'start':'end';
      const dates = this.datepicker.querySelectorAll('.weeks .row li');
      let date = item.getAttribute('data-date');

      if (spec === 'start') {
        this.selected = {
          start: '',
          end: '',
          weeks: {}
        }
        for (let d = 0; d < dates.length; d++) {
          dates[d].classList.remove('selected');
        }
        this.clearOldWeekBars();
      } else {
        if (this.selected.start === date) return;
        if (moment(this.selected.start).isAfter(moment(date))) {
          const clickedDate = date;
          this.datepicker.querySelector('.weeks .row li[data-date="'+date+'"]').classList.add('selected');

          date = this.selected.start;
          this.selected.start = clickedDate;
        }
      }

      this.datepicker.querySelector('.weeks .row li[data-date="'+date+'"]').classList.add('selected');
      this.selected[spec] = date;

      if (spec === 'end') {
        const start = moment(this.selected.start).startOf('week');
        const end = moment(this.selected.end).startOf('week');
        const week = parseInt(moment(this.selected.start).format('w'));
        const sameWeek = start.isSame(end, 'week');
        const weeks = 1 + (!sameWeek ? Math.ceil(end.diff(start, 'day') / 7):0);

        for (let w = 0; w < weeks; w++) {
          let days;
          if (sameWeek) {
            days = moment(this.selected.end).diff(moment(this.selected.start), 'day') + 1;
          } else {
            if (!w) {
              days = moment(this.selected.start).endOf('week').diff(moment(this.selected.start), 'day') + 1;
            } else if (w === (weeks - 1)) {
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
    const title = moment(this.activeMoment).format('MMMM') + ' ' + moment(this.activeMoment).format('YYYY');
    this.datepicker.querySelector('.header h4').innerText = title;

    const firstDate = moment(this.activeMoment).startOf('month').startOf('week').format('YYYY-MM-DD');
    const firstWeek = parseInt(moment(firstDate).format('w'));
    const month = moment(this.activeMoment).format('MM');

    // Render weeks.
    let activeDay = moment(firstDate);
    const weeks = this.datepicker.querySelectorAll('.weeks .row');
    for (let w = 0; w < 5; w++) {
      const week = weeks[w];
      week.setAttribute('data-week-number', firstWeek + w);
      week.innerHTML = '';

      for (let d = 0; d < 7; d++) {
        const thisMonth = (activeDay.format('MM') === month);
        const day = document.createElement('li');
        day.innerText = activeDay.format('D');
        day.setAttribute('data-date', activeDay.format('YYYY-MM-DD'));
        day.addEventListener('click', selectDate.bind(this));

        if (!thisMonth) {
          day.classList.add('other');
        }

        const format = activeDay.format('YYYY-MM-DD');
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

  clearOldWeekBars () {
    const bars = this.datepicker.querySelectorAll('.weeks ul.row .bar');
    if (bars.length) {
      for (let b = 0; b < bars.length; b++) {
        bars[b].parentNode.removeChild(bars[b]);
      }
    }
  }

  renderWeekBars () {
    let offset;
    const start = moment(this.selected.start).startOf('week');
    const end = moment(this.selected.end).startOf('week');
    if (start.format('YYYY-MM-DD') === end.format('YYYY-MM-DD')) {
      offset = moment(this.selected.start).diff(start, 'day');
    }

    const weekWidth = 20;
    const margin = (this.datepicker.querySelector('.weeks').offsetWidth - (weekWidth * 7)) / 6;
    const weeks = Object.keys(this.selected.weeks);
    for (let w = 0; w < weeks.length; w++) {
      const week = weeks[w];
      const row = this.datepicker.querySelector('.weeks ul.row[data-week-number="'+week+'"]');
      if (row) {
        const styleKey = (!w) ? 'right':'left';
        const width = (20 * this.selected.weeks[week]) + (margin * (this.selected.weeks[week] - 1)) + 'px';
        const bar = document.createElement('div');
        bar.classList.add('bar');
        if (offset !== undefined && !w) {
          bar.style.left = ((weekWidth * offset) + (margin * offset)) + 'px'
        } else {
          bar.style[styleKey] = '0';
        }
        bar.style.width = width;

        row.appendChild(bar);
      }
    }
  }

  handlePickerClick (e) {
    if (!this.enableClicks) return;

    e.stopPropagation();
  }

  handleDocumentClick () {
    if (!this.enableClicks) return;

    this.update('hide');
  }

  update (action) {
    const pickerHandler = this.handlePickerClick.bind(this);
    const documentHandler = this.handleDocumentClick.bind(this);

    this.datepicker.addEventListener('click', pickerHandler);
    document.body.addEventListener('click', documentHandler);

    function hide () {
      this.hidden = true;
      this.enableClicks = false;
      const transitionHandler = hidePicker.bind(this);

      function hidePicker () {
        this.datepicker.style.display = 'none';
        this.datepicker.removeEventListener('transitionend', transitionHandler);
      }

      this.datepicker.classList.remove('show');
      this.datepicker.addEventListener('transitionend', transitionHandler)
    }

    function show () {
      this.hidden = false;
      this.datepicker.style.display = 'block';
      const transitionHandler = showPicker.bind(this);

      function showPicker () {
        this.enableClicks = true;
        this.datepicker.removeEventListener('transitionend', transitionHandler);
      }

      setTimeout(() => {
        this.datepicker.classList.add('show');
        this.datepicker.addEventListener('transitionend', transitionHandler);
      }, 20);
    }

    if (action === 'show') {
      show.bind(this)();
    } else if (action === 'hide') {
      hide.bind(this)();
    }

  }

  hide () {
    this.update('hide');
  }

  show () {
    this.update('show');
  }

}

const picker = new Datepicker({
  startTarget: '#arrival',
  endTarget: '#departure'
});
