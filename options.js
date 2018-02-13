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
        // checked[i].id => mylist<mylistId>
        var id = checked[i].id.slice(6);
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
  $('#readSelected').click(function(){
    var checked = $(':checkbox:checked');
    var res = confirm('選択したマイリスト内の動画を全て既読にしてもよいですか？');
    if (res == true) {
      for (var i = 0; i < checked.length; i++) {
        // checked[i].id => mylist<mylistId>
        var mylistId = checked[i].id.slice(6);
        var items = JSON.parse(localStorage.getItem(mylistId));
        for (var j = 0; j < items.length; j++) {
          var item = items[j];
          chrome.history.addUrl({url: item.link}, null);
        }
        localStorage.setItem(mylistId, "[]");
      }
    }
  });
});

var successFn = function(data) {
  var channel = $(data).find('channel');
  drawObj(channel[0]);
}
var errorFn = function(mylistId, url, data) {
  drawErr(data.status, mylistId, url);
}

function show() {
  var mylist = JSON.parse(localStorage.getItem('mylist'));
  for (var i = 0; i < mylist.length; i++) {
    var mylistId = mylist[i];

    var url = MYLISTURL + mylistId + "?rss=2.0";
    $.get(url, successFn, 'xml').fail(errorFn.bind(this, mylistId, url));
  }
}

function drawObj(channel) {
  var link = $(channel).find('link')[0].textContent;
  var mylistId = link.match(/\d*$/)[0];
  var title = $(channel).find('title')[0].textContent;
  var creator = $(channel).find('dc\\:creator')[0].textContent;
  var description = $(channel).find('description')[0].textContent;

  var channelObj = $('<div/>').addClass('item');

  var titleObj = $('<div/>').addClass('checkbox');
  var label = $('<label/>');
  var input = $('<input type="checkbox">').attr('id', 'mylist' + mylistId);
  label.append(input).append($('<span/>').text(title));
  titleObj.append(label);

  var creatorObj = $('<div/>').addClass('help-text');
  var linkObj = $('<a/>').attr('href', link).attr('target', '_blank').text('ニコニコ動画内のページ');
  creatorObj.append($('<span/>').text('作成者: ' + creator));
  creatorObj.append('&nbsp;&nbsp;').append(linkObj);
  var descriptionObj = $('<div/>').addClass('help-text');
  descriptionObj.append($('<span/>').text(description));

  $(channelObj).append(titleObj).append(creatorObj).append(descriptionObj);
  $('#watchlist-section').append(channelObj);
}

function drawErr(statusCode, mylistId, url) {
  var description = '不明なエラーによりマイリストの情報が取得できませんでした。';
  switch (statusCode) {
    case 403:
      description = 'このマイリストは非公開に設定されています。';
      break;
    case 404:
      description = 'マイリストが見つかりません。すでに削除されたか存在しない可能性があります。';
      break;
  }

  var title = '不明なマイリスト (' + mylistId + ')';

  var channelObj = $('<div/>').addClass('item');

  var titleObj = $('<div/>').addClass('checkbox');
  var label = $('<label/>');
  var input = $('<input type="checkbox">').attr('id', 'mylist' + mylistId);
  label.append(input).append($('<span/>').text(title));
  titleObj.append(label);

  var creatorObj = $('<div/>').addClass('help-text');
  var linkObj = $('<a/>').attr('href', url).attr('target', '_blank').text('ニコニコ動画内のページ');
  creatorObj.append($('<span/>').text('作成者: 不明'));
  creatorObj.append('&nbsp;&nbsp;').append(linkObj);
  var descriptionObj = $('<div/>').addClass('help-text');
  descriptionObj.append($('<span/>').text(description));

  $(channelObj).append(titleObj).append(creatorObj).append(descriptionObj);
  $('#watchlist-section').append(channelObj);
}
