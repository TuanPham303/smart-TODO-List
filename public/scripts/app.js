$(() => {
  $.ajax({
    method: 'GET',
    url: '/api/items'
  }).done(items => {
    for (item of items) {
      const liWrap = $('<li>').addClass('list-group-item');
      const labelWrap = $('<label>').addClass(
        'custom-control custom-checkbox readItem'
      );
      const inputWrap = $("<input type='checkbox'>").addClass(
        'custom-control-input'
      );
      const spanWrap = $('<span>').addClass('custom-control-indicator');

      labelWrap.text(item.content).appendTo(liWrap);
      inputWrap.appendTo(labelWrap);
      spanWrap.appendTo(labelWrap);
      liWrap.appendTo($('.read-items'));
    }
  });
});
