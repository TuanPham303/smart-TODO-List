$(() => {

function renderItems(items){
  $("#read-items").empty();
  for(item of items) {
    const liWrap = $("<li>").addClass("list-group-item");
    const labelWrap = $("<label>").addClass("custom-control custom-checkbox readItem");
    const inputWrap = $("<input type='checkbox'>").addClass("custom-control-input");
    const spanWrap = $("<span>").addClass("custom-control-indicator");

    labelWrap.text(item.content).appendTo(liWrap);
    inputWrap.appendTo(labelWrap);
    spanWrap.appendTo(labelWrap);
    liWrap.appendTo($("#read-items"));
    liWrap.append($("<button class='delete'>").text('Delete'));
    // labelWrap.append($("<button class='move'>").text('Move'));
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
  $("#read-items").on('click', '.delete', function(event){
    $.ajax({
      method: "POST",
      url: "/api/items/delete",
      data: {itemToDelete: $(event.target).parent().text().slice(0, -6)},
      success: function(result){
         $.ajax({
          method: "GET",
          url: "/api/items",
          success: function(data){
            // renderItems(data);
            $(event.target).parentsUntil("#read-items").remove();
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
  });
//////////////////////MOVE ITEMS//////////////////////////////


});
