const IMGURL = "http://tn-skr4.smilevideo.jp/smile?i=";
const MYLISTURL = "http://www.nicovideo.jp/mylist/";

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
    if (mylistId != null && mylistId != '' && mylistId.length == 8) {
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
    var unreadObjects = JSON.parse(localStorage.getItem(mylistId));
    if (unreadObjects != null) {
      for (var j = 0; j < unreadObjects.length; j++) {
        var unreadObj = unreadObjects[j];
        var itemObj = $('<div/>');
        itemObj.addClass('item');
        var imgObj = $('<img/>');
        $(imgObj).attr('src', IMGURL + unreadObj.videoId);
        var titleObj = $('<p/>');
        var linkObj = $('<a/>');
        $(linkObj).attr('href', unreadObj.link).text(unreadObj.title);
        $(linkObj).addClass('link');
        $(titleObj).html(linkObj);
        $(itemObj).append(imgObj).append(titleObj);
        $('#result').prepend(itemObj);
      }
    }
  }
}
