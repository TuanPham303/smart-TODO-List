$(function () {
  $(".login-toggle").on("click", function () {
    $("#loginbar").slideToggle(300);
  });

  $(".register-toggle").on("click", function () {
    $("#registerbar").slideToggle(300);
  });

  $(".profile-toggle").on("click", function () {
    $("#profilebar").slideToggle(300);
  });
});
