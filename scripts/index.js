var EofficeController = {
    Init: function () {
        let self = this;
        this.Register();

        chrome.tabs.query({active: true,lastFocusedWindow: true}, function(tabs) {
            var tab = tabs[0];
            if(tab.url.includes("TaskReportNewForm")){
                window.location.href="/popup.html";
            }
        });
        chrome.webNavigation.onCompleted.addListener(function(url) {
            window.location.href="/popup.html";
        })

        chrome.browserAction.onClicked.addListener(function(tab) {
            //chrome.tabs.create({'url': chrome.extension.getURL('index.html'), 'selected': true});
        });
        // chrome.tabs.create({'url': chrome.extension.getURL('index.html')}, function(tab) {
        //    console.log(new Date());
        // });
      
    },
    Data: {
    },
    Register: function () {
        $("#btn-rediact").click(function(){
            $(this).html(`<i class="fa fa-spin fa-cog"></i> Đang chuyển hướng...`);
            $(this).attr("disabled","disabled")
           chrome.tabs.update({url:  "https://eoffice.becamex.com.vn/congviec/SitePages/TaskReportNewForm.aspx"});
        })
    },
}

EofficeController.Init();