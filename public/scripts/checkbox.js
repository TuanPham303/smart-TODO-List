$(function () {
  $(".categories").on("click", ".custom-control-input", function (t) {
    var item = $(t.target).siblings(".custom-control-description");
    var itemId = $(item).attr('data-item-id');
    var checked = !this.checked;
    var status = checked.toString();

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
