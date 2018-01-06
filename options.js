function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    duration: document.querySelector("#duration").value
  });
}

function restoreOptions() {
  function setCurrentChoice(result) {
    document.querySelector("#duration").value = result.color || 3;
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("duration");
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);