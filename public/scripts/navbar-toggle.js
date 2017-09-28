$(() => {
  $('.navbar-toggle').on('click', () => {
    // $(this).removeClass('collapsed');
    // $('#navbar').addClass('show');
    $('#navbar').slideToggle(300);
  });
});
