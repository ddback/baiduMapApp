(function (){

    var _baseURL = "/district/",
        _districtPolygons = [];

    /*
    * 
    * district data:
    *  [{
    *    id: 1,
    *    name: '小店区',
    *    hotspot: [{
    *       id: '324jfkjewlkjk',
    *       x: 1232142,
    *       y: 232132
    *    }, 
    *    {
    *       id: 'e222323fkj',
    *       x: 2343432,
    *       y: 232132
    *    }]
    *  }, 
    *  {
    *    id: 2,
    *    name: '尖草坪区',
    *    hotspot: [{
    *       id: '324jfkjewlkjk',
    *       x: 1232142,
    *       y: 232132
    *    }]
    *  }]
    *
    * */


    function _getBoundary(districtName, callback){       
         var bdary = new BMap.Boundary();

         bdary.get(districtName, function(rs){   
             var count = rs.boundaries.length;

             for(var i = 0; i < count; i++){
                 var ply = new BMap.Polygon(rs.boundaries[i], {strokeWeight: 2, strokeColor: "#ff0000"});
                 App.map.setViewport(ply.getPath());           
             }                
         });   
     }

    var District = {
        init: function (){
            this.bindEvent();             
        },

        addDistrictPolygon: function (polygon){
            _distrctPolygons.push(polygon)
        },

        getDistrictPolygons: function (){
            return _districtPolygons;
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

        drawBoundary: function (){
        
        
        
        },

        get: function (data){
            if (!data)
                return;
            
            for (var i = 0, l = data; i < l; i ++){
                var distict = data[i];
                
            
            }
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
    window.District = District;

})();
