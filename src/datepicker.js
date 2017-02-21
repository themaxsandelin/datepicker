class Datepicker {
  
  constructor (options) {
    moment.locale((options.locale) ? options.locale:'en');
    
    document.addEventListener('DOMContentLoaded', () => {
      if (options.target) {
        
      } else if (options.targets) {
        
      } else {
        console.log('Missing target(s) for datepicker.');
      }
    });
  }
  
}