$(() => {
  $(".login-toggle").on("click", () => {
    $("#loginbar").slideToggle(300);
  });

  $(".register-toggle").on("click", () => {
    $("#registerbar").slideToggle(300);
  });

  $(".profile-toggle").on("click", () => {
    $("#profilebar").slideToggle(300);
  });
});
