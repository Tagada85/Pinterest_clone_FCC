var $grid = $('.grid').masonry({
  // options
  itemSelector: '.grid-item',
  columnWidth: 300,
  gutter: 10,
});

$grid.imagesLoaded().progress( function() {
  $grid.masonry('layout');
});