$(() => {
  $.ajax({
    method: "GET",
    url: "/api/users"
  }).done((users) => {
    for(user of users) {
      $("<div>").text(user.email).appendTo($("body"));
    }
  });;
});

// $(() => {
//   $.ajax({
//     method: "POST",
//     url: ""
//   }).done()
// }
