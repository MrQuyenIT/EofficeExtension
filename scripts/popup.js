var EofficeController = {
    Init: function () {
        let self = this;
        this.Register();

        chrome.storage.sync.get('data',function(obj){
            if(obj.data!=null && obj.data.length>0){
                self.Data.listDate = obj.data;
                self.Methods.loadContentTable();
            }
        });

        //Lắng nghe sự kiện bên trang chính gửi qua
        chrome.runtime.onMessage.addListener(function(request,sender,sendResponse) {
            if(request.todo =="success"){
                alertify.notify("Chấm công thành công!", 'success', 1,function(){
                    window.close();
                });
            }
        })

        //set position
        alertify.set('notifier','position', 'top-center');
    },
    Data: {
        listDate: []
    },
    Register: function () {
        let self = this;
        $("#datetimepicker").datetimepicker({
            format: 'DD/MM/YYYY',
            locale: 'vi',
            defaultDate: new Date(),
        });

        let index = 0;
        $("#table-main ").on('click','.add-date', function(){
            let model={
                id: index++,
                date: $("#datetimepicker").val(),
                description: $(".description").val(),
                hour:$(".hour").val()
            }

            if(model.description==""){
                alertify.notify("Nhập lý do nghỉ đê bạn ơi :)", 'error', 2);
                return;
            }

            if(self.Data.listDate.find(x=>x.date == model.date)){
                alertify.notify("Dữ liệu đã tồn tại!", 'error', 2);
                return;
            }

            self.Data.listDate.push(model);

            // var notification ={
            //     type:'basic',
            //     iconUrl:'assest/logo/48.png',
            //     title:'Cảnh báo ! ',
            //     message:'Dữ liệu ngày nghỉ đã tồn tại'
            // };
            // chrome.notifications.create('Warning',notification);

            chrome.storage.sync.set({'data':self.Data.listDate});
            self.Methods.loadContentTable();
            alertify.notify("Thêm ngày nghỉ thành công!", 'success', 2);
        })
        
        $("#table-main ").on('click','.delete', function(){
            let id= $(this).data("id");
            self.Data.listDate = self.Data.listDate.filter(x=>x.id!=id);
            chrome.storage.sync.set({'data':self.Data.listDate});
            self.Methods.loadContentTable();
            alertify.notify("Xóa ngày nghỉ thành công!", 'success', 2);
        })

        $("#btn-submit").click(function(){
            chrome.tabs.query({active:true,currentWindow:true},function(tabs){
                chrome.tabs.sendMessage(tabs[0].id,{todo:"chamcong",data:{content:$("#content").val() ,arrLeave:self.Data.listDate}});
            })
        })

        $("#btn-rediact").click(function(){
            // chrome.tabs.query({active:true,currentWindow:true},function(tabs){
            //     chrome.tabs.sendMessage(tabs[0].id,{todo:"chuyenhuong",data:""});
            // })
           chrome.tabs.update({url:  "https://eoffice.becamex.com.vn/congviec/SitePages/TaskReportNewForm.aspx"});
        })
    
        $("#btn-delete-all").click(function(){
            self.Data.listDate = [];
            chrome.storage.sync.set({'data':self.Data.listDate});
            self.Methods.loadContentTable();
            alertify.notify("Xóa tất cả thành công!", 'success', 2);
        })
    },
    Methods:{
        loadContentTable:function (){
            let self = this;
            let templateAll="";
            if(EofficeController.Data.listDate.length>0){
                EofficeController.Data.listDate.forEach(function(item){
                  let  template =` <tr><td><div class="input-group date mb-3" ><input type="text" value="{0}" class="form-control" disabled></div>
                                    </td>
                                    <td>
                                        <input type="text" value="{1}" class="form-control" disabled/>
                                    </td>
                                    <td>
                                        <input type="text" value="{2}" class="form-control" disabled/>
                                    </td>
                                    <td>
                                        <button type="button" class="btn btn-sm btn-danger delete"  data-id="{3}"><i class="fa fa-trash"></i></button>
                                    </td>
                                    </tr>`;
          
                template=template.replace("{0}",item.date);
                template=template.replace("{1}",item.hour);
                template=template.replace("{2}",item.description);
                template=template.replace("{3}",item.id);
                templateAll +=template;
                })
            }
            else{
                templateAll =`<tr>
                                <td colspan="4">
                                    <div class="alert alert-sm alert-info alert-custom" role="alert">Làm việc siêng năng :)  Không nghỉ ngày nào!</div>
                                </td>
                            </tr>`;
            }
            $("#table-content").html(templateAll);
          }
    }
}

EofficeController.Init();