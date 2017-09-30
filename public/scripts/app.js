
$(() => {
  function renderItems(items) {
    $("#read-items").empty();
    $("#watch-items").empty();
    $("#buy-items").empty();
    $("#eat-items").empty();
    for (item of items) {
      console.log(item);
      const liWrap = $("<li>").addClass("list-group-item");
      const labelWrap = $("<label>").addClass(
        "custom-control custom-checkbox readItem"
      );
      const inputWrap = $("<input type='checkbox'>").addClass(
        "custom-control-input"
      );
      if (item.status === false) {
        inputWrap.prop("checked", true);
      }

      const spanWrap = $("<span>").addClass("custom-control-indicator");

      labelWrap.text(item.content).appendTo(liWrap);
      liWrap.append($('<i class="fa fa-trash" aria-hidden="true"></i>'));
      liWrap.append($('<i class="fa fa-arrows-alt" aria-hidden="true"></i>'));
      inputWrap.appendTo(labelWrap);
      spanWrap.appendTo(labelWrap);
      liWrap.appendTo($(`#${item.category}-items`));
    }

////////////////Get request to database and render items////////////////
function getAllItems(){
  $.ajax({
    method: "GET",
    url: "/api/items",
    success: function(data){
      renderItems(data);
    }
  });
}
getAllItems();

///////////////////////////SUBMIT NEW ITEM //////////////////////

$('#itemSubmit').on('click', function() {
  if ($('#itemInput').val() !== '') {
    $.post('/api/items/add', {input: $('#itemInput').val()}, function(response){
      const categories = JSON.parse(response);
      if (Array.isArray(categories)) {
          $('#multiMatch').css('display', 'inline');
          if (!categories[0]) {
            $(".selectCategory").css('display', 'inline');
          } else {
            categories.forEach(function(category){
              $(`#${category}Button`).css('display', 'inline');
            });
          }
      } else {
        $('#itemInput').val('');
        getAllItems();
      }
    });
  }


  ////////////////Get request to database and render items////////////////

$(".selectCategory").on('click', function(event){
  $('.selectCategory').css('display', 'none');
  $('#multiMatch').css('display', 'none');
  $.post('/api/items/add/direct', {input: $('#itemInput').val(), category: event.target.value}, function(){
    $('#itemInput').val('');
    getAllItems();
  });
});


  ////////////////////////////DELETE item//////////////////////////////
  function deleteItem(event) {
    $.ajax({
      method: "POST",
      url: "/api/items/delete",
      data: {
        itemToDelete: $(event.target)
          .parent()
          .find("label")
          .text()
      },
      success: function(result) {
        $.ajax({
          method: "GET",
          url: "/api/items",
          success: function(data) {
            // renderItems(data);
            $(event.target)
              .parentsUntil(".list-group")
              .remove();
          },
          error: function(error) {
            console.log("error there in the internal ajax " + error);
          }
        }); //internal ajax call ends here.
      }, //outside ajax call success bracket
      error: function(error) {
        console.log("it didnt work. Some issue", error);
      }
    });
  }

  $(".categories").on("click", ".fa-trash", function(event) {
    deleteItem(event);
  });

  //////////////////////MOVE ITEMS//////////////////////////////
  let itemToMove;
  let itemWrapToDelete;
  $(".categories").on("click", ".fa-arrows-alt", function(event) {
    itemToMove = $(event.target)
      .parent()
      .find("label")
      .text();
    $("#moveToggle").toggle();
    itemWrapToDelete = $(event.target).parentsUntil(".list-group");
  });

  $(".moveItem").on("click", function(event) {
    $("#moveToggle").toggle();
    itemWrapToDelete.remove();
    const moveToCategory = event.target.value;
    $.ajax({
      method: "PUT",
      url: "api/items/move",
      data: {
        itemToMove: itemToMove,
        moveToCategory: moveToCategory
      },
      success: function(data) {
        $.ajax({
          method: "GET",
          url: "api/items",
          success: function(data) {
            renderItems(data);
          }
        });
      }
    });
  });
});
