$(() => {
  $('.read-header').on('click', () => {
    $('.read-block').slideToggle();
  });

  $('.watch-header').on('click', () => {
    $('.watch-block').slideToggle();
  });

  $('.buy-header').on('click', () => {
    $('.buy-block').slideToggle();
  });

  $('.eat-header').on('click', () => {
    $('.eat-block').slideToggle();
  });
});
