const MYLISTURL = "https://www.nicovideo.jp/mylist/";
var newUnreadCount = 0;

$(function() {
  initialize();
});

function initialize() {
  // localStorage 'mylist' has a list of mylist ID (7 or 8 digits)
  var mylist = JSON.parse(localStorage.getItem('mylist'));
  if (mylist == null) {
    mylist = [];
    localStorage.setItem('mylist', JSON.stringify(mylist));
  }
  checkUpdate();
}

var mylistRssCallback = function(mylistId) {
  return function(data, textStatus) {
    var items = $(data).find('item');
    for (var i = 0; i < items.length; i++) {
      addUnread(items[i], mylistId);
    }
  }
};

function checkUpdate() {
  newUnreadCount = 0;
  chrome.browserAction.setBadgeText({ text: "" });
  var mylist = JSON.parse(localStorage.getItem('mylist'));
  // localStorage #{mylistId} has JSON Object of unread contents
  // {link: '', title: '', videoId: '', thumbnail: ''}
  for (var i = 0; i < mylist.length; i++) {
    var mylistId = mylist[i];
    // initialize item (will be "reset" with every check)
    localStorage.setItem(mylistId, "[]");
    var url = MYLISTURL + mylistId + "?rss=2.0";
    $.get(url, mylistRssCallback(mylistId), 'xml');
  }

  // check every 5mins
  setTimeout(checkUpdate, 1000*60*5);
}

function addUnread(item, mylistId) {
  var link = $(item).find('link').text();
  var title = $(item).find('title').text();
  var videoId = link.match(/\d*$/)[0];
  // item's description has a thumbnail info in p.nico-thumbnail
  var desc = $(item).find('description').text(); // raw text HTML of description
  var descSpan = $('<span/>').append($.parseHTML(desc));
  var thumbnail = $(descSpan).find('p.nico-thumbnail').find('img').attr('src');
  chrome.history.getVisits({url: link}, function(results) {
    if (results.length == 0) {
      var items = JSON.parse(localStorage.getItem(mylistId));
      var item = {'link': link, 'title': title, 'videoId': videoId, 'thumbnail': thumbnail};
      items.push(item);
      localStorage.setItem(mylistId, JSON.stringify(items));
      newUnreadCount += 1;
      chrome.browserAction.setBadgeText({text: newUnreadCount.toString()});
    }
  });
}
