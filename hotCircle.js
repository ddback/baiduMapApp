(function (){

    var _baseURL = "/hotCircle/",
        _points = [];

    var HotCircle = {
        init: function (){
            District.getDistrict('all', function (results){
                if (results){
                    for (var i = 0, l = results.length; i < l; i ++){
                        var name = results[i].district.name;
                        $("<option value='" + name +"'>" + name + "</option>").appendTo($('#circle_district'));
                    }
                }
                
            });

            this.bindEvent();             
        },

        getCircle: function (name, callback){
            var name = name || 'all';
            $.get(_baseURL + name, function (result){
                if(callback) 
                    callback(result);
            });
        },

        setCircle: function (data, callback){
            $.post(_baseURL, data, function (result){
                if (callback)
                    callback(result);
            });
        },

        setRecrodingFlag: function (flag){
            this.recrodingFlag = flag;                
        },

        getRecordingFlag: function (){
            return this.recrodingFlag;                
        },

        clearPoints: function (){
            _points = [];
            this.setRecrodingFlag(0);
            $("#circle_add_point").removeClass('recroding');
        },

        addPoints: function (point){
            _points.push(point);     
            $("#circle_points").val(JSON.stringify(this.getPoints()));
        },

        getPoints: function (){
            return _points;         
        },
        
        bindEvent: function (){
            $("#circle_add_point").click(function (){
                $(this).toggleClass('recroding');

                HotCircle.setRecrodingFlag($(this).hasClass('reroding') ? 0 : 1);
            });                

            $("#circle_add").click(function (){
                var name = $("#circle_name").val(),
                    district = $("#circle_district").val(),
                    points = $("#circle_points").val();

                if (!name || !district || !points){
                   alert('invalid post params');
		   return;
                }

                var data = {
                    name: name,
                    district: district,
                    points: points,
                    strokeStyle: '' 
                }

                HotCircle.setCircle(data, function (results){
                    if (results.status)
                        alert("insert success");
                    else
                        alert("insert fail")

                });

            });
        }
    }

    window.HotCircle = HotCircle;

})();
