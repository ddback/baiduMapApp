(function (){

    var _baseURL = "/district/";

    District = {
        init: function (){
            this.bindEvent();             
        },

        getDistrict: function (name, callback){
            var name = name || 'all';
            $.get(_baseURL + name, function (result){
                if(callback) 
                    callback(result);
            });
        },

        setDistrict: function (data, callback){
            $.post(_baseURL + 'new', data, function (result){
                if (callback)
                    callback(result);
            });
        },

        bindEvent: function (){
            $("#district_add").click(function (){
                var name = $("#district_name").val(),
                    area = $("#district_area").val();

                if (!name || !area){
                   alert('invalid post params');
                   return;
                }

                var data = {
                    name: name,
                    area: area
                }

                District.setDistrict(data, function (results){
                    if (results)
                        alert("insert success");
                    else if (results)
                        alert("insert fail")

                });

            });
        }
    }

    District.init();

})();
