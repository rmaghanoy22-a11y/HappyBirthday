/**
 * Name Generator page – save name and go to birthday card page
 */
(function () {
  'use strict';

  var FORM_KEY = 'birthdayPersonName';
  var form = document.getElementById('name-form');
  var input = document.getElementById('birthday-name-input');

  if (form && input) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = input.value.trim();
      if (name === '') {
        name = 'Tanay';
      }
      try {
        localStorage.setItem(FORM_KEY, name);
      } catch (err) {
        console.warn('localStorage not available', err);
      }
      window.location.href = 'birthday.html';
    });
  }
})();
