var currentTabIndex = 0;
var switchingTabs = false;

getCurrentTabIndex();

browser.pageAction.onClicked.addListener(() => {
  console.log("enable/disable add on")
  switchingTabs = !switchingTabs;
  console.log(switchingTabs);
  if (switchingTabs) {
    switchTab();
  }
});

function switchTab() {
  console.log("switching tab");
  getCurrentTabIndex();
  browser.tabs.query({currentWindow: true})
  .then((tabs) => {
    if (currentTabIndex == tabs[0].id) {
      currentTabIndex = tabs[1].id;
    } else {
      currentTabIndex = tabs[0].id;
    }
    browser.tabs.update(currentTabIndex, {
      active: true
    })
    setTimeout(function() {
      if (switchingTabs) {
        switchTab();
      } else {
        console.log("exiting function");
        return;
      }
    }, 2000);
  });
}

function getCurrentTabIndex() {
  browser.tabs.query({currentWindow: true, active: true})
  .then((tabs) => {
    browser.pageAction.show(tabs[0].id)
    currentTabIndex = tabs[0].id;
    console.log(`current Tab Index ${currentTabIndex}`)
  })
}
