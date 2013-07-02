(function (){

    var _districtNameStyle = {
        'width': 'auto',
        'height': '20px',
        'line-height': '20px',
        'background': '#ccc',
        'border-radius': '3px',
        'border': '1px solid blue'
    };


    function _setBoundary(district, callback){       
         var bdary = new BMap.Boundary(),
             districtName = district.region_name,
             districtId = district.region_id;
             orderNum = district.orderNum || 0;

         bdary.get(districtName, function(rs){   
             var count = rs.boundaries.length;

             for (var i = 0; i < count; i++){
                 var ply = new BMap.Polygon(rs.boundaries[i], {fillColor: '#d3e4f3', strokeWeight: 2, strokeColor: "#2A55FF"}),
                     labelContent = districtName + '(' + orderNum + ')',
                     label = new BMap.Label(labelContent);
                
                 label.setStyle(_districtNameStyle);
                 label.setPosition(ply.getBounds().getCenter());
                 App.map.addOverlay(ply);
                 App.map.addOverlay(label);
                 ply.addEventListener('click', (function (polygon){
                    return function (){
                        if (callback)
                            callback.call(ply, districtId);

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

        getDistrictData: function (){
            return this.districtData;
        },

        setDistrictData: function (data){
            this.districtData = data;
        },

        select: function (region_id){
            //正式上线后，需要使用id作为参数请求订单数据
            //App.helper.getDataList('GetOrderData&region_id1=' + region_id, function (orderList){
            App.helper.getDataList('GetOrderData', function (orderList){
                if (!orderList)
                    return;

                DivideOrder.removeAllMarkers();
                DivideOrder.setOrders(orderList);
                DivideOrder.drawOrdersMarker();
            });
        },

        updateDistrictList: function (){
            var districtData = this.getDistrictData(),
                len = districtData.length,
                listHtml = '<table><tr style="background: #557FFF;">'
                    + '<td width=80>序号</td>'
                    + '<td width=120>名称</td>'
                    + '<td width=80>订单数</td>'
                    + '</tr>';

            for (var i = 0; i < len; i ++){
                var data = districtData[i];

                listHtml += '<tr onclick="District.select(\'' + data.region_id + '\');">'
                    + '<td>' + data.region_id + '</td>'
                    + '<td>' + data.region_name + '</td>'
                    + '<td>' + (data.orderNum || 0) + '</td>'
                    + '</tr>'
            }

            listHtml += '</table>'

            document.getElementById('districtList').innerHTML = listHtml;
        },

        drawBoundary: function (data){
            if (!data)
                data = this.getDistrictData();
            
            for (var i = 0, l = data.length; i < l; i ++){
                var district = data[i];

                _setBoundary(district, function (id){
                    App.map.clearOverlays();
                    App.toogleDivideOrder();
                    DivideOrder.setDividingFlag(true);
                    DivideOrder.enterDivide(id);
                    document.getElementById('districtList').style.display = "none";
                });
            }

            //调整视角
            App.map.centerAndZoom(App.city, 11);
            this.updateDistrictList();
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

    window.District = District;

})();
