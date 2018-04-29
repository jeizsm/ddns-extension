const SECOND = 1000;
const MINUTE = 60;

function handleRequest(request) {
  console.log(request);
  return {cancel: request.proxyInfo != null};
}

const urls = [
  "https://dynupdate.no-ip.com/nic/update*",
  "https://*.dynv6.com/api/update*",
  "*://*.dyn.dns.he.net/nic/update*"
]

chrome.webRequest.onBeforeRequest.addListener(handleRequest, {urls: urls, types: ["xmlhttprequest"], tabId: -1, windowId: -1}, ["blocking"]);

chrome.storage.local.get(['noip.com', 'dynv6.com', 'dns.he.net'], (res) => {
  Object.keys(res).map((objectKey) => {
    let value = res[objectKey];
    let send_update = () => {
      if (objectKey == "dynv6.com") {
        dynv6Update(value);
      } else if (objectKey == "noip.com") {
        noipUpdate(value);
      } else if (objectKey == "dns.he.net") {
        dnsheUpdate(value);
      }
    }
    send_update();
    setInterval(send_update, SECOND * MINUTE * 10);
  });
});

function dynv6Update(value) {
  if (value.password && value.hostname) {
    fetch(`https://ipv6.dynv6.com/api/update?hostname=${value.hostname}&ipv6=auto&token=${value.password}`, { method: "POST" })
    .then((response) => {
      response.text().then((text) => console.log(`ipv6.dynv6.com update: ${text}`))
    }, (error) => {
      console.error(error);
    });
    fetch(`https://ipv4.dynv6.com/api/update?hostname=${value.hostname}&ipv4=auto&&token=${value.password}`, { method: "POST" })
    .then((response) => {
      response.text().then((text) => console.log(`ipv4.dynv6.com update: ${text}`))
    }, (error) => {
      console.error(error);
    });
  }
}

function noipUpdate(value) {
  const headers = new Headers({"Authorization": 'Basic ' + btoa(value.login + ":" + value.password)});
  fetch(`https://dynupdate.no-ip.com/nic/update?hostname=${value.hostname}`, { method: "POST", headers: headers })
  .then((response) => {
    response.text().then((text) => console.log(`dynupdate.no-ip.com update: ${text}`))
  }, (error) => {
    console.error(error);
  })
}
function dnsheUpdate(value) {
  const headers = new Headers({"Authorization": 'Basic ' + btoa(value.hostname + ":" + value.password)});
  fetch(`http://ipv6.dyn.dns.he.net/nic/update?hostname=${value.hostname}`, { method: "POST", headers: headers })
  .then((response) => {
    response.text().then((text) => console.log(`ipv6.dyn.dns.he.net update: ${text}`))
  }, (error) => {
    console.error(error);
  })
  fetch(`http://ipv4.dyn.dns.he.net/nic/update?hostname=${value.hostname}`, { method: "POST", headers: headers })
  .then((response) => {
    response.text().then((text) => console.log(`ipv4.dyn.dns.he.net update: ${text}`))
  }, (error) => {
    console.error(error);
  })
}
