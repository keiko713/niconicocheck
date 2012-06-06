const MYLISTURL = "http://www.nicovideo.jp/mylist/";
var newUnreadCount = 0;

$(function() {
  initialize();
});

function initialize() {
  var mylist = JSON.parse(localStorage.getItem('mylist'));
  if (mylist == null) {
    mylist = [];
    localStorage.setItem('mylist', JSON.stringify(mylist));
  }
  checkUpdate();
}

function checkUpdate() {
  newUnreadCount = 0;
  chrome.browserAction.setBadgeText({ text: "" });
  var mylist = JSON.parse(localStorage.getItem('mylist'));
  for (var i = 0; i < mylist.length; i++) {
    var mylistId = mylist[i];
    // initialize item
    localStorage.setItem(mylistId, "[]");
    var url = MYLISTURL + mylistId + "?rss=2.0";
    $.get(url, function(data) {
      var items = $(data).find('item');
      for (var i = 0; i < items.length; i++) {
        addUnread(items[i], mylistId);
      }
    }, 'xml');
  }

  // check every 5mins
  setTimeout(checkUpdate, 1000*60*5);
}

function addUnread(item, mylistId) {
  var link = $(item).find('link').text();
  var title = $(item).find('title').text();
  var videoId = link.substr(-8);
  chrome.history.getVisits({url: link}, function(results) {
    if (results.length == 0) {
      var items = JSON.parse(localStorage.getItem(mylistId));
      var item = {'link': link, 'title': title, 'videoId': videoId};
      items.push(item);
      localStorage.setItem(mylistId, JSON.stringify(items));
      newUnreadCount += 1;
      chrome.browserAction.setBadgeText({text: newUnreadCount.toString()});
    }
  });
}
