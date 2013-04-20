(function (){

     var App = {};

     App.map = new BMap.Map('container');

     App.map.centerAndZoom("太原", 15);
     App.map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
     App.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}));  //右上角，仅包含平移和缩放按钮
     //App.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT, type: BMAP_NAVIGATION_CONTROL_PAN}));  //左下角，仅包含平移按钮
     //App.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM}));  //右下角，仅包含缩放按钮
     App.map.enableScrollWheelZoom(); //启用滚轮放大缩小, 默认禁用
     //App.map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用   


     App.map.addEventListener('click', function (e){
         mapClick(e);
     });

     App.map.addEventListener('mousemove', function (e){
         mapMouseMove(e);
     });

     App.map.addEventListener('dblclick', function (e){
         mapdbClick(e);
     });


     function mapClick (e){
         var x = e.point.lng,
             y = e.point.lat,
             isRecroding = HotCircle.getRecrodingFlag();

         if (isRecroding){
            var circlePoints = HotCircle.getPoints();

            if (circlePoints.length){
                HotCircle.addPoints({'x': x, 'y': y});
                HotCircle.polyline.setPath(instancePointsArr(HotCircle.getPoints()));
                //App.map.addOverlay(HotCircle.polyline);
            }else {
                HotCircle.addPoints({'x': x, 'y': y});
                HotCircle.polyline = getPolyline(HotCircle.getPoints());
                App.map.addOverlay(HotCircle.polyline);
            }
         }
     }

     function mapMouseMove (e){
         var x = e.point.lng,
             y = e.point.lat,
             isRecroding = HotCircle.getRecrodingFlag();

         if (isRecroding && HotCircle.polyline){
             var tempPoints = HotCircle.getPoints().concat([{'x': x, 'y': y}]);
             HotCircle.polyline.setPath(instancePointsArr(tempPoints));
         }
     }

     function mapdbClick (e){
         var x = e.point.lng,
             y = e.point.lat,
             isRecroding = HotCircle.getRecrodingFlag();

         if (isRecroding){
             HotCircle.addPoints({'x': x, 'y': y});
             HotCircle.getPoints().push({x: x, y: y});
             var polygon = getPolygon(HotCircle.getPoints());
             App.map.removeOverlay(HotCircle.polyline);
             HotCircle.polyline = null;
             HotCircle.clearPoints();
             App.map.addOverlay(polygon);
         }
     
     }

     function instancePointsArr(points){
         var instancePoints = [];

         for (var i = 0, l = points.length; i < l; i ++){
            instancePoints.push(new BMap.Point(points[i].x, points[i].y));
         }

         return instancePoints;
     }

     function getPolyline (points){
         return new BMap.Polyline(instancePointsArr(points), {strokeColor: "red", strokeWeight: 6, strokeOpacity: 0.5});
     }

     function getPolygon (points){
         return new BMap.Polygon(instancePointsArr(points), {strokeColor: "red", strokeWeight: 6, strokeOpacity: 0.5});
     }

     window.App = App;
})();
