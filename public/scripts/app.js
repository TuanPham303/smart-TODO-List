$(() => {

function renderItems(items){
  $("#read-items").empty();
  for(item of items) {
    const liWrap = $("<li>").addClass("list-group-item");
    const labelWrap = $("<label>").addClass("custom-control custom-checkbox readItem");
    const inputWrap = $("<input type='checkbox'>").addClass("custom-control-input");
    const spanWrap = $("<span>").addClass("custom-control-indicator");

    labelWrap.text(item.content).appendTo(liWrap);
    liWrap.append($('<i class="fa fa-trash" aria-hidden="true"></i>'));
    liWrap.append($('<i class="fa fa-arrows-alt" aria-hidden="true"></i>'));
    inputWrap.appendTo(labelWrap);
    spanWrap.appendTo(labelWrap);
    liWrap.appendTo($("#read-items"));

  }
}

////////////////Get request to database and render items////////////////
$.ajax({
  method: "GET",
  url: "/api/items"
}).done((data) => {
  renderItems(data);
});

////////////////////////////DELETE item//////////////////////////////
function deleteItem(event){
  $.ajax({
    method: "POST",
    url: "/api/items/delete",
    data: {itemToDelete: $(event.target).parent().find('label').text()},
    success: function(result){
       $.ajax({
        method: "GET",
        url: "/api/items",
        success: function(data){
          renderItems(data);
          // $(event.target).parentsUntil("#read-items").remove();
        },
        error: function(error){
          console.log("error there in the internal ajax "+error);
        }
      }); //internal ajax call ends here.
    }, //outside ajax call success bracket
    error: function(error){
      console.log("it didnt work. Some issue",error);
    }
  });
}
  $("#read-items").on('click', '.fa-trash', function(event){
    deleteItem(event);
  });
//////////////////////MOVE ITEMS//////////////////////////////
  $("#read-items").on('click', '.fa-arrows-alt', function(event){
    const itemToMove = $(event.target).parent().find('label').text();

    $("#moveToggle").toggle();
    deleteItem(event);

    $(".moveItem").on('click', function(event){
      $("#moveToggle").toggle();
      const moveToCategory = event.target.value;

      const liWrap = $("<li>").addClass("list-group-item");
      const labelWrap = $("<label>").addClass("custom-control custom-checkbox readItem");
      const inputWrap = $("<input type='checkbox'>").addClass("custom-control-input");
      const spanWrap = $("<span>").addClass("custom-control-indicator");

      labelWrap.text(itemToMove).appendTo(liWrap);
      liWrap.append($('<i class="fa fa-trash" aria-hidden="true"></i>'));
      liWrap.append($('<i class="fa fa-arrows-alt" aria-hidden="true"></i>'));
      inputWrap.appendTo(labelWrap);
      spanWrap.appendTo(labelWrap);
      liWrap.appendTo($(`#${moveToCategory}-items`));
    });
  });





});
