$(function () {
  $(".login-toggle").on("click", function () {
    $("#loginbar").slideToggle(300);
    $("#registerbar").css('display', 'none');
    $("#errorWrap").text('');
  });

  $(".register-toggle").on("click", function () {
    $("#registerbar").slideToggle(300);
    $("#loginbar").css('display', 'none');
    $("#errorWrap").text('');
  });

  $(".profile-toggle").on("click", function () {
    $("#profilebar").slideToggle(300);
  });
});
