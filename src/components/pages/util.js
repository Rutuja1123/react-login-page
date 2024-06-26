// import React from 'react';

function getCookie() {
  console.log("test");
  // var cname =   "token";
  var decodedCookie = document.cookie;
  var ca = decodedCookie.split(";");
  console.log(ca);

  var lwa_login_info = ca.at(2);
  console.log(lwa_login_info.split("=").at(1));
  return lwa_login_info.split("=").at(1);
}

function setCookie(name, value, exp_days) {
  var d = new Date();
  d.setTime(d.getTime() + exp_days * 24 * 60 * 60 * 1000);
  var expires = "expires=" + d.toGMTString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

function getCookieByName(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }

export { getCookie, setCookie, getCookieByName };
