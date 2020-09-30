var contextMenuItem  ={
    "id":"spendMoney",
    "title":"SpendMoney",
    "contexts":["selection"]
};
 
chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener(function(data){
    console.log(data)
    if(data.menuItemId =="spendMoney" &&  data.selectionText){
        chrome.storage.sync.set({'total':data.selectionText});
    }
})

