const IMGURL = "http://tn-skr4.smilevideo.jp/smile?i=";
const MYLISTURL = "http://www.nicovideo.jp/mylist/";

$(function() {
  // function that shows all mylist
  show();
  $('#deleteSelected').click(function(){
    var checked = $(':checkbox:checked');
    var res = confirm('本当に ' + checked.length + ' 項目削除しますか？');
    if (res == true) {
      var mylist = JSON.parse(localStorage.getItem('mylist'));
      for (var i = 0; i < checked.length; i++) {
        var id = checked[i].id.substr(-8);
        localStorage.removeItem(id);
        for (var j = 0; j < mylist.length; j++) {
          if (mylist[j] == id) {
            mylist.splice(j, 1);
            j -= 1;
          }
        }
      }
      localStorage.setItem('mylist', JSON.stringify(mylist));

      $('.item').remove();
      show();
    }
  });
});

function show() {
  var mylist = JSON.parse(localStorage.getItem('mylist'));
  for (var i = 0; i < mylist.length; i++) {
    var mylistId = mylist[i];

    var url = MYLISTURL + mylistId + "?rss=2.0";
    $.get(url, function(data) {
      var channel = $(data).find('channel');
      drawObj(channel[0]);
    }, 'xml');
  }
}

function drawObj(channel) {
  var link = $(channel).find('link')[0].textContent;
  var mylistId = link.substr(-8);
  var title = $(channel).find('title')[0].textContent;
  var creator = $(channel).find('creator')[0].textContent;
  var description = $(channel).find('description')[0].textContent;

  var channelObj = $('<div/>').addClass('item');

  var titleObj = $('<div/>').addClass('checkbox');
  var label = $('<label/>');
  var input = $('<input type="checkbox">').attr('id', 'mylist' + mylistId);
  label.append(input).append($('<span/>').text(title));
  titleObj.append(label);

  var creatorObj = $('<div/>').addClass('help-text');
  var linkObj = $('<a/>').attr('href', link).attr('target', '_blank').text('ニコニコ動画内のページ');
  creatorObj.append($('<span/>').text('実況者: ' + creator));
  creatorObj.append('&nbsp;&nbsp;').append(linkObj);
  var descriptionObj = $('<div/>').addClass('help-text');
  descriptionObj.append($('<span/>').text(description));

  $(channelObj).append(titleObj).append(creatorObj).append(descriptionObj);
  $('#watchlist-section').append(channelObj);
}
