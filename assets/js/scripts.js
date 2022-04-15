$(document).ready(function() {
  
// Setting iframe height
$('.myIframe').css('height', $(window).height()+'px');

// Adding syntax highlight to code
  hljs.highlightAll();
  hljs.initLineNumbersOnLoad();

  $('code').each(function (i, block) {
    hljs.highlightBlock(block);
  });

});