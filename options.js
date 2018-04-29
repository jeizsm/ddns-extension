function saveOptions(e) {
  service = document.querySelector("#select").value
  activated = document.querySelector("#activated").checked;
  if (activated) {
    hash = {};
    hash[service] = {
      login: document.querySelector("#login").value,
      password: document.querySelector("#password").value,
      hostname: document.querySelector("#hostname").value,
      activated: document.querySelector("#activated").checked,
    };
    chrome.storage.local.set(hash);
  } else {
    chrome.storage.local.remove(service);
  }
  chrome.runtime.reload();
  e.preventDefault();
}

function restoreOptions() {
  service = document.querySelector("#select").value;
  hash = {};
  hash[service] = {login: "", hostname: "", password: "", activated: false};
  var gettingItem = chrome.storage.local.get(hash, (res) => {
    settings = res[service];
    document.querySelector("#login").value = settings.login;
    document.querySelector("#hostname").value = settings.hostname;
    document.querySelector("#password").value = settings.password;
    document.querySelector("#activated").checked = settings.activated;
  });
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#select").addEventListener("change", restoreOptions)
