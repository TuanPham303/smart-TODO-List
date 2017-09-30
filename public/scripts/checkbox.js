$(() => {
  $(".categories").on("click", ".custom-control-input", function (t) {
    const content = $(t.target).parent().text();
    let checked = !this.checked;
    let status = checked.toString();

    const item = $(t.target).siblings(".custom-control-description");
    if (!checked) {
      $(item).addClass("strike");
    } else {
      $(item).removeClass("strike");
    }

    $.ajax({
      url: "api/items/update",
      method: "POST",
      data: {
        content: content,
        status: status
      },
      success: function (data) {
        return;
      }
    });
  });
});
