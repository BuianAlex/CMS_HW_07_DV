"use strict";
let navLink = document.getElementById('navbar2').querySelectorAll('a');
navLink.forEach(function (element, index) {
  element.addEventListener('click', function () {
    let nav = document.getElementById('navbar2');
    if (nav.classList.contains('show')) {
      $(".collapse").collapse('hide');
    }
  });
});