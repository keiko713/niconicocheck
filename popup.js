const MYLISTURL = "https://www.nicovideo.jp/mylist/";

$(function() {
  $('#id_mylist').focus();
  check();
  $('.item').click(function() {
    console.log('clicked');
    console.log(this);
    chrome.tabs.create({url: $(this).find('a').attr('href')});
    window.close();
  });
  $('#addbutton').click(function() {
    var mylistId = $('#id_mylist').val();
    if (mylistId != null && mylistId != '' && mylistId.match(/^[0-9]{7,8}$/)) {
      var mylist = JSON.parse(localStorage.getItem('mylist'));
      mylist.push(mylistId);
      localStorage.setItem('mylist', JSON.stringify(mylist));
      $('#id_mylist').val('added!');
    } else {
      $('#id_mylist').val('error!');
    }
  });
});

function check() {
  var mylist = JSON.parse(localStorage.getItem('mylist'));
  for (var i = 0; i < mylist.length; i++) {
    var mylistId = mylist[i];
    // localStorage #{mylistId} has JSON Object of unread contents
    // {link: '', title: '', videoId: '', thumbnail: ''}
    var unreadObjects = JSON.parse(localStorage.getItem(mylistId));
    if (unreadObjects != null) {
      var mylistDiv = $('<div/>');
      mylistDiv.addClass('unreadMylist');
      for (var j = 0; j < unreadObjects.length; j++) {
        var unreadObj = unreadObjects[j];
        var itemObj = $('<div/>');
        itemObj.addClass('item');
        var imgObj = $('<img/>');
        $(imgObj).attr('src', unreadObj.thumbnail);
        var titleObj = $('<p/>');
        titleObj.addClass('itemTitle');
        var linkObj = $('<a/>');
        $(linkObj).attr('href', unreadObj.link).text(unreadObj.title);
        $(linkObj).addClass('link');
        $(titleObj).html(linkObj);
        $(itemObj).append(imgObj).append(titleObj);
        $(mylistDiv).prepend(itemObj);
        // Only show first 10 objects
        if (j === 9) {
          let moreUnreadItemObj = $('<div/>');
          $(moreUnreadItemObj).addClass('item');
          let moreUnreadTitleObj = $('<p/>');
          let unreadMoreCount = unreadObjects.length - j - 1;
          $(moreUnreadTitleObj).html('このマイリストはあと' + unreadMoreCount +'件の未読があります。');
          $(moreUnreadItemObj).append(moreUnreadTitleObj);
          $(mylistDiv).prepend(moreUnreadItemObj);
          break;
        }
      }
      if ($(mylistDiv).html() != '') {
        $(mylistDiv).append($('<div/>').addClass('item'));
        $('#result').prepend(mylistDiv);
      }
    }
  }
}
