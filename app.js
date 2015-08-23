var phantom = require('phantom');
phantom.create(function(ph) {
  return ph.createPage(function(page) {
    return page.open("http://www.mysmartprice.com/books/msp_book_single.php?q=9788129135889", function(status) {
      console.log("opened google? ", status);
      return page.evaluate((function() {
        return document.querySelector('#bestprice');
      }), function(result) {
        console.log(result);
        console.log('Page title is ' + result);
        return ph.exit();
      });
    });
  });
});