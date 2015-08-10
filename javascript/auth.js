/**
 * Copyright (c) 2012 KandaSoftware. All rights reserved.  Use of this
 * source code is governed by a MIT license that can be found in the
 * LICENSE file.
 */

jQuery(function ($) {
  Eventnote = {};
  Eventnote.Auth = {
    logout_time_param    : 'edam_expires',
    note_store_url_param : 'edam_noteStoreUrl',
    shard_param          : 'edam_shard',
    api_url_prefix       : 'edam_webApiUrlPrefix'
  };

  // Keeping consumer key and secret from original project
  Eventnote.Auth.oauth = ChromeExOAuth.initBackgroundPage({
    'request_url'     : 'https://www.evernote.com/oauth',
    'authorize_url'   : 'https://www.evernote.com/OAuth.action',
    'access_url'      : 'https://www.evernote.com/oauth',
    'consumer_key'    : 'bit_jammer-9517',
    'consumer_secret' : '802513e24e7928b4',
    'scope'           : '',
    'app_name'        : 'Evernote - Already there Chrome Extension',
    'callback_page'   : 'views/chrome_ex_oauth.html'
  });

  Eventnote.Data   = {};


  Eventnote.Auth.authenticate = function (callback) {
    try {
      Eventnote.Auth.oauth.authorize(function() {
        var authenticated = Eventnote.Auth.oauth.hasToken();
        localStorage.setItem("authenticated", authenticated);
        localStorage.setItem("logout_time",
          Eventnote.Auth.oauth.getParameter(Eventnote.Auth.logout_time_param));
        if (callback !== undefined) {
          callback();
        }
      });
    } catch(e) {
    //  Eventnote.Logger.error(e);
      if (callback !== undefined) {
        callback();
      }
    }
  };

  Eventnote.Auth.get_auth_token = function () {
    return Eventnote.Auth.oauth.getToken();
  };

  Eventnote.Auth.logout = function () {
    Eventnote.Auth.oauth.clearTokens();
  }
});
