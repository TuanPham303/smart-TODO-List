$(() => {
  $(".categories").on("click", ".custom-control-input", function(t) {
    let item = $(t.target)
      .parent()
      .text();
    let status = !this.checked;
    console.log(status);
    $.ajax({
      url: "api/items/update",
      method: "POST",
      data: {
        item: item,
        status: status
      },
      success: function(data) {
        return;
      }
    });
  });
});
