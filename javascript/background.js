// CHROME TABS EVENTS
// -----------------------------------------------------------------------------
function onUpdated(workmode, changeInfo, tab) {
  if (workmode && workmode !== undefined) {
    //&& workmode === 'all'
    if (changeInfo !== undefined && changeInfo.status === "complete") {
      if (tab.url.indexOf("chrome_ex_oauth.html") < 0 && tab.url.indexOf("evernote.com")<0 && tab.url.indexOf("chrome://extensions/")<0){
        verify(tab.url,tab);
      }
    }
  } else {
  //  chrome.browserAction.setBadgeText({text: ''});
  }
}

function onActivated(workmode, activeInfo) {
  //
  if (workmode && workmode !== undefined ) {
    chrome.tabs.query({active: true}, function(tab){
      if (tab !== undefined ) {
        // do this to get the correct tab (the user may have detached tabs)
        for (var i = tab.length - 1; i >= 0; i--) {
          if (tab[i].id === activeInfo.tabId) {
            if (tab[i].url.indexOf("chrome_ex_oauth.html") < 0 && tab[i].url.indexOf("evernote.com")<0 && tab[i].url.indexOf("chrome://extensions/")<0){
            //  window.alert('EB B' + tab[i].url );
                verify(tab[i].url, tab[i]);
            }


          }
        }
      }
    });
  } else {
//    chrome.browserAction.setBadgeText({text: ''});
  }
}

function onClicked(workmode, tab) {
  // if clicked, load Evernote status, or reload it from remote
  // server without resorting to the cache.
  if (workmode && workmode !== undefined) {
    if (tab.status && tab.status !== undefined) {
      if (tab.status === "complete") {
        verify(tab.url, tab);
      }
    }
  }

}





function showicon(tab, notes){

  var tabId = tab.id;

  	var title = "bla"
  	chrome.pageAction.setTitle({tabId: tabId, title: title});

  	chrome.pageAction.setIcon({
  		tabId: tabId,
      path:"../images/Evernote-off.png"
  	});

  	var popup = 'popup.html#' + encodeURIComponent(JSON.stringify(notes))
  	chrome.pageAction.setPopup({tabId: tabId, popup: popup})

  	chrome.pageAction.show(tabId);


}

var url_cache = {};

// URL VERIFICATION
// -----------------------------------------------------------------------------
function verify(url, tab) {

//
  use_cached=false;

  if (Eventnote.Auth.get_auth_token() === undefined) {
  //  chrome.browserAction.setIcon({path:"../images/Evernote-off.png"});
    Eventnote.Auth.authenticate();
    return;
  } else {
  //  chrome.browserAction.setIcon({path:"../images/Evernote-on.png"});
  }

  if (url !== '') {
    if ((use_cached) && typeof(url_cache[url]) !== 'undefined') {
    //  chrome.browserAction.setBadgeText(url_cache[url]);
      return;
     }
    // Eventnote.Logger.info('[EVERDU] Verify url:' + url);
    var notesTransport = new Thrift.Transport(
        Eventnote.Auth.oauth.getParameter(Eventnote.Auth.note_store_url_param));
    var notesProtocol = new Thrift.Protocol(notesTransport);
    var noteStore = new NoteStoreClient(notesProtocol, notesProtocol);


    var filter = new NoteFilter();
    filter.words = "sourceURL:" + url.replace(/\/$/, '') + "*";
    try {
      var results = noteStore.findNotes(Eventnote.Auth.get_auth_token(), filter, 0, 100);
      var notes = results.notes;
      var totalNotes = 0;
      for (var i in notes) {
        totalNotes++;
      }

      if (totalNotes === 0) {

      //  chrome.browserAction.setBadgeText({text: 'no'});
      } else {
        //  window.alert('EB B' + totalNotes);
        showicon(tab,notes)
        //chrome.browserAction.setBadgeText({text: 'yes:' + totalNotes});

      }
    } catch(e) {
      if (e.errorCode === 9 ){
        Eventnote.Auth.logout();
      //  chrome.browserAction.setIcon({path:"../images/Evernote-off.png"});
        if (e.parameter === "password" ) {
          window.alert("[EVERDU] Please authenticate with evernote again");
        }
        else {

          window.alert("[EVERDU] " + e.errorCode + ":" + e.parameter
              + ". Everdu not working. Please report the error.");
        }
      }
      else {

        console.log('something is not working:');
        console.log(e);
      }
    }

  //  url_cache[url] = badgeText;
  //  chrome.browserAction.setBadgeText(badgeText);

  }
}





$(function() {
  //listen for current tab to be changed
  chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    chrome.storage.sync.get('everduworkmode', function (items) {
      onUpdated(items.everduworkmode, changeInfo, tab);
    });
  });

  //listen for new tab to be activated (when clicked but not refreshed)
  chrome.tabs.onActivated.addListener(function(activeInfo) {
    chrome.storage.sync.get('everduworkmode', function (items) {
      onActivated(items.everduworkmode, activeInfo);
    });
  });

  // when clicked, perform a url verify
/*  chrome.browserAction.onClicked.addListener(function(tab){
    chrome.storage.sync.get('everduworkmode', function (items){
      onClicked(items.everduworkmode, tab);
    });
  });
*/
  // work mode, by default, is to check urls on-demand (can be changed on the popup.html)
  chrome.storage.sync.set({ 'everduworkmode': 'ondemand' });

  // se the default icon (gray = not connected)
  //chrome.browserAction.setIcon({path:"../images/Evernote-off.png"});
  //chrome.browserAction.setBadgeText({text: "X"});

  // login to evernote using oatuh
  Eventnote.Auth.authenticate( function() {
    // change the icon and remove badge text
    //chrome.browserAction.setIcon({path:"../images/Evernote-on.png"});
    //chrome.browserAction.setBadgeText({text: ''});
  });
});
