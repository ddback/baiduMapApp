(function (){

     var App = {};

     App.city = "太原";
     App.map = new BMap.Map('container');
     App.map.centerAndZoom(App.city, 15);
     App.map.addControl(new BMap.NavigationControl());  //添加默认缩放平移控件
     App.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_TOP_RIGHT, type: BMAP_NAVIGATION_CONTROL_SMALL}));  //右上角，仅包含平移和缩放按钮
     //App.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_LEFT, type: BMAP_NAVIGATION_CONTROL_PAN}));  //左下角，仅包含平移按钮
     //App.map.addControl(new BMap.NavigationControl({anchor: BMAP_ANCHOR_BOTTOM_RIGHT, type: BMAP_NAVIGATION_CONTROL_ZOOM}));  //右下角，仅包含缩放按钮
     App.map.enableScrollWheelZoom(); //启用滚轮放大缩小, 默认禁用
     //App.map.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用   
     
     App.helper = {
         addMarker: function (options){
             if (!options.point)
                 return;

             var marker = new BMap.Marker(options.point),
                 infoWin;

             if (options.infoHtml)
                infoWin = new BMap.InfoWindow(options.infoHtml)
             
             if (options.label){
                var label = new BMap.Label(options.label.content),
                    offsetSize = new BMap.Size(options.label.offsetX, options.label.offsetY);

                label.setOffset(offsetSize);
                label.setStyle(options.label.style);
                marker.setLabel(label);
             }

             marker.addEventListener('click', function (){
                if (infoWin)
                    marker.openInfoWindow(infoWin);

                if (options.callback)
                    options.callback();
             });

             App.map.addOverlay(marker);

         }
     }

     function instancePointsArr (points){
         var instancePoints = [];

         for (var i = 0, l = points.length; i < l; i ++){
            instancePoints.push(new BMap.Point(points[i].x, points[i].y));
         }

         return instancePoints;
     }


     function mapClick (e){
         var x = e.point.lng,
             y = e.point.lat,
             isRecording = HotCircle.getRecordingFlag();

         if (isRecording){
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
         }else if (isDividing){
                DivideOrder.setStartRectPoint({'x': x, 'y': y});
                DivideOrder.rect = getPolygon(DivideOrder.getRectPoints());
                App.map.addOverlay(DivideOrder.rect);
         }
     }

     function mapMouseMove (e){
         var x = e.point.lng,
             y = e.point.lat,
             isRecording = HotCircle.getRecordingFlag(),
             isDividing = false;

         if (isRecording && HotCircle.polyline){
             var tempPoints = HotCircle.getPoints().concat([{'x': x, 'y': y}]);
             HotCircle.polyline.setPath(instancePointsArr(tempPoints));
         }else if (isDividing && DivideOrder.rect){
             DivideOrder.setEndRectPoint({'x': x, 'y': y});

             var tempPoints = DivideOrder.getRectPoints();
             DivideOrder.rect.setPath(instancePointsArr(tempPoints));
         }
     }

     function mapMouseUp (e){
         if (isDividing){
            console.log(23);
         }
     }

     function mapdbClick (e){
         var x = e.point.lng,
             y = e.point.lat,
             isRecording = HotCircle.getRecordingFlag();

         if (isRecording){
             HotCircle.addPoints({'x': x, 'y': y});
             HotCircle.getPoints().push({x: x, y: y});
             var polygon = getPolygon(HotCircle.getPoints());
             App.map.removeOverlay(HotCircle.polyline);
             HotCircle.polyline = null;
             HotCircle.clearPoints();
             App.map.addOverlay(polygon);
         }else if (isDividing){
             DivideOrder.setEndRectPoint({'x': x, 'y': y});

             var rect = getPolygon(DivideOrder.getRectPoints());
             App.map.removeOverlay(DivideOrder.rect);
             DivideOrder.rect = null;
             App.map.addOverlay(rect);
         }
     }

     function getPolyline (points){
         return new BMap.Polyline(instancePointsArr(points), {strokeColor: "red", strokeWeight: 3, strokeOpacity: 0.5});
     }

     function hideAllFeaturePanel (){
        $('.featurePanel').hide();
     }

     function getPolygon (points){
         return new BMap.Polygon(instancePointsArr(points), {strokeColor: "red", strokeWeight: 3, strokeOpacity: 0.5});
     }

     App.bindEvent = function (){
         App.map.addEventListener('click', function (e){
             mapClick(e);
         });

         App.map.addEventListener('mousemove', function (e){
             mapMouseMove(e);
         });

         App.map.addEventListener('mouseup', function (e){
             mapMouseUp(e);
         });

         App.map.addEventListener('dblclick', function (e){
             mapdbClick(e);
         });

         //tool menu event
         $("#tool_add_circle").click(function (){
             hideAllFeaturePanel();
             $("#hotCircle").show();
         });

         $("#tool_get_circle").click(function (){
             //getBoundary();    
         });

         $("#tool_get_district").click(function (){
             //hideAllFeaturePanel();
             //$("#district").show();
             District.drawBoundary();
         });

         $("#tool_route_nav").click(function (){
             hideAllFeaturePanel();
             $("#routeNavigation").show();
         });

         
         $(".hideHandler").each(function (index, item){
             $(item).click((function(o){
                 return function (){
                    $(o).parent().hide();
                 }
             })(item));
         });
     }

     App.bindEvent();
     window.App = App;
})();
