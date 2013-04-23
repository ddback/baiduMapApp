(function (){

    var _baseURL = "/district/";

    /*
    * 
    * district data:
    *  [{
    *    id: 1,
    *    name: '小店区'
    *  }, 
    *  {
    *    id: 2,
    *    name: '尖草坪区'
    *  }]
    *
    * */

    var DistrictData = [{id: 1, name: '小店区'}, 
                        {id: 2, name: '尖草坪区'},
                        {id: 3, name: '杏花岭区'},
                        {id: 4, name: '万柏林区'},
                        {id: 5, name: '迎泽区'},
                        {id: 6, name: '晋源区'},
                        {id: 7, name: '清徐县'},
                        {id: 8, name: '阳曲县'},
                        {id: 9, name: '娄烦县'},
                        {id: 10, name: '古交县'}];

    var _districtNameStyle = {
        'width': 'auto',
        'height': '20px',
        'line-height': '20px',
        'background': '#ccc',
        'border-radius': '3px',
        'border': '1px solid blue'
    };


    function _setBoundary(districtName, callback){       
         var bdary = new BMap.Boundary();

         bdary.get(districtName, function(rs){   
             var count = rs.boundaries.length;

             for(var i = 0; i < count; i++){
                 var ply = new BMap.Polygon(rs.boundaries[i], {fillColor: '#d3e4f3', strokeWeight: 2, strokeColor: "#2A55FF"}),
                     label = new BMap.Label(districtName);
                
                 label.setStyle(_districtNameStyle);
                 label.setPosition(ply.getBounds().getCenter());
                 App.map.addOverlay(ply);
                 App.map.addOverlay(label);
                 ply.addEventListener('click', (function (polygon){
                    return function (){
                        alert('you click me!');
                        if (callback)
                            callback.call(ply);

                        polygon.setFillColor('#FFAAFF');
                        App.map.setViewport(polygon.getPath());
                    }
                 })(ply));

                 ply.addEventListener('mouseover', function (){
                    ply.setFillColor('#FFAAFF');
                 });

                 ply.addEventListener('mouseout', function (){
                    ply.setFillColor('#d3e4f3');
                 });
             }                
         });   
     }

    var District = {
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

        drawBoundary: function (data){
            if (!data)
                data = DistrictData;
            
            for (var i = 0, l = data.length; i < l; i ++){
                var district = data[i];

                _setBoundary(district.name, function (){
                    //TODO
                });
            }

            //调整视角
            var cityBoundary = new BMap.Boundary();
            cityBoundary.get(App.city, function (rs){
                 var ply = new BMap.Polygon(rs.boundaries[0]);

                 App.map.setViewport(ply.getPath());
            
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
    window.District = District;

})();
