var switchingTabs = false;
var newTabIndex = -1;

installPlugin();

function installPlugin() {
  browser.tabs.query({currentWindow: true, active: true})
  .then((tabs) => {
    browser.pageAction.show(tabs[0].id);
  });
}

function switchTab() {
  console.log("Starting Tab Rotation");

  browser.tabs.query({currentWindow: true, active: true})
  .then((tabs) => {
    let currentTabId = tabs[0].id;
    browser.pageAction.show(currentTabId);
    console.log(`Current Tab Id: ${currentTabId}`);
    return currentTabId;
  }).then((currentTabId) => {
    return browser.tabs.get(currentTabId);
  }).then((tab) => {
    console.log(`Current tab Index: ${tab.index}`);
    return tab.index + 1;
  }).then((nextTabIndex) => {
    newTabIndex = nextTabIndex;
    return browser.tabs.query({currentWindow: true})
  }).then((tabs) => {
    let index = -1;
    if (newTabIndex >= tabs.length) {
      newTabIndex = 0;
    }
    console.log(`New tab Index: ${newTabIndex}`);
    console.log(`New tab ID: ${tabs[newTabIndex].id}`);
    return tabs[newTabIndex].id;
  }).then((newTabId) => {
    console.log('Switching Tab');
    return browser.tabs.update(newTabId, {
      active: true
    })
  }).then((tab) => {
    console.log(`Switched to ${tab.id}`)
    return browser.windows.get(tab.windowId);
  }).then((window) => {
    console.log(`Window ID is ${window.id}`);
    if (switchingTabs) {
      return browser.windows.update(window.id, {
        state: 'fullscreen'
      })
    } else {
      return browser.windows.update(window.id, {
        state: 'maximized'
      })
    }
  }).then((windowInfo) => {
    setTimeout(function() {
      if (switchingTabs) {
        switchTab();
      } else {
        console.log("Stopping Tab Rotation");
        return;
      }
    }, 5000);
  });
}

browser.pageAction.onClicked.addListener(() => {
  console.log("enable/disable add on")
  switchingTabs = !switchingTabs;
  console.log(switchingTabs);
  if (switchingTabs) {
    switchTab();
  }
});