$(() => {
  $(".categories").on("click", ".custom-control-input", function (t) {
    // const item = $(t.target).siblings(".custom-control-description");
    // const content = $(item).text();
    const content = $(t.target).parent().text();
    let status = !this.checked;

    // $(item).toggleClass("strike");

    console.log(status);
    console.log(content);
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
