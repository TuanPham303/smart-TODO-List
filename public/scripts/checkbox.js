$(function () {
  $(".categories").on("click", ".custom-control-input", function (t) {
    const item = $(t.target).siblings(".custom-control-description");
    const itemId = $(item).attr('data-item-id');
    let checked = !this.checked;
    let status = checked.toString();

    if (!checked) {
      $(item).addClass("strike");
    } else {
      $(item).removeClass("strike");
    }

    $.ajax({
      url: "api/items/update",
      method: "POST",
      data: {
        itemId: itemId,
        status: status
      },
      success: function (data) {
        return;
      }
    });
  });
});
