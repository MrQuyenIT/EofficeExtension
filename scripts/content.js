chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
    if(request.todo =="chamcong"){
        let data = request.data.arrLeave;
        let content = request.data.content;
        $("tbody[role='rowgroup'] > tr").each(function(){
            if(!$(this).hasClass('dayOfWeek_1')
            &&!$(this).hasClass('dayOfWeek_7') ){
                let currentDay =$(this).find(".widTaskDate").text();
                let item = data.find(x=>x.date.toString()==currentDay);
                if(!item){
                    $(this).find("textarea[class='Description']").html(content);
                    $(this).find(".widTimeline .k-input").val(8.0);
                }
                else{
                    $(this).find("textarea[class='Description']").html(item.description);
                    $(this).find(".widTimeline .k-input").val(item.hour);
                }
            }
            
        })
        chrome.runtime.sendMessage({todo: "success",data:"Chấm công thành công!"});
    }
})