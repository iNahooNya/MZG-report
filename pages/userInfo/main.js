/**
 * Created by nic on 2015/6/10.
 */
define(["avalon",'mmRouter', "text!/template/userInfo.html","SysConfig",'SysUtil'], function(avalon,router, userInfo,SysConfig,SysUtil) {
    avalon.templateCache.userInfo = userInfo;

    avalon.vmodels.root.menus.push({
            title: "用户信息",
            url: "#!/userInfo/"
        });

    avalon.filters.f$gender = function(str){
        if(str == '1'){
            return '男';
        }else if(str == '0'){
            return '女';
        }else{
            return '未知';
        }
    };
    avalon.filters.f$null = function(str){
        if(str == null||str == '0.1.1'||str==''){
            return '无';
        }
        else{
            return str;
        }
    };
    avalon.filters.f$role = function(str){
        if(str == '120'){
            return '超级管理员';
        }else if(str == '110'){
            return '普通管理员';
        }else{
            return '普通用户';
        }
    };
    avalon.filters.f$banned = function(str){
        if(str == '2'){
            return '永久封号';
        }else if(str == '1'){
            return '封号七天';
        }else{
            return '正常';
        }
    };


    //exports.userList= model = avalon.define({
    var model = avalon.define({
        $id: "userInfo",

        storeId:'',
        phonenum:'',
        sector:'',
        role:'',
        storeInfo:'',
        userInfo:{},
        getInfo: function () {
            var formData = {};
            if(model.storeId.length>0)
                formData['storeId'] = model.storeId;
            else formData['phonenum'] = model.phonenum;
            formData['full'] = true;
            $.jsonp({
                url: SysConfig.ApiUrl+"V1.0.0/Store/info",
                callbackParameter: "callback",
                data: formData,
                success: function (data) {
                    var data = JSON.parse(data);
                    SysUtil.ApiCallback(data);
                    if (data.code != 0)
                    {return alert(data.msg);}

                    var userInfo = data.data.storeInfo,str="";

                    model.userInfo = userInfo.userInfo;
                    //model.userInfo = $.extend({},userInfo,userInfo.userInfo);
                    model.userInfo.company_name = userInfo.userInfo.company.name;
                    model.userInfo.company_address = userInfo.userInfo.company.address;

                    console.dir(model.userInfo);

                    model.sector = userInfo.sector;
                    model.phonenum = userInfo.userInfo.phonenum;
                    model.role = userInfo.userInfo.role;
                    for(var i in userInfo)
                    {
                        if(typeof userInfo[i]=='object')
                        {
                            for(var j in userInfo[i])
                                str+=j+': '+userInfo[i][j]+'<br/>';
                        }
                        else
                            str+=i+': '+userInfo[i]+'<br/>';
                    }
                    model.storeInfo = str;
                }
            });
        },
        ChangeSector:function()
        {
            var formData = {};
            formData['userId'] = model.storeId;
            formData['sector'] = model.sector;
            $.jsonp({
                url: SysConfig.ApiUrl+"V1.0.0/Admin/userInfo?_method=POST",
                callbackParameter:"callback",
                data:formData,
                success:function(data){
                    var data = JSON.parse(data);
                    SysUtil.ApiCallback(data);
                    if(data.code!=0)
                        return alert(data.msg);
                    else return alert('修改成功');
                }
            });
        },
        ChangeRole:function()
        {
            var formData = {};
            formData['userId'] = model.storeId;
            formData['role'] = model.role;
            $.jsonp({
                url: SysConfig.ApiUrl+"V1.0.0/Admin/userInfo?_method=POST",
                callbackParameter:"callback",
                data:formData,
                success:function(data){
                    var data = JSON.parse(data);
                    SysUtil.ApiCallback(data);
                    if(data.code!=0)
                        return alert(data.msg);
                    else return alert('修改成功');
                }
            });
        }

    });

    avalon.router.get("/userInfo/", function(){
        avalon.vmodels.root.bodyPage = "userInfo";
    });

    avalon.router.get("/userInfo/:id", function(){
        avalon.vmodels.root.bodyPage = "userInfo";
        model.storeId = this.params.id+"";
        model.getInfo();
    });

});
