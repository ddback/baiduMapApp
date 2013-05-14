(function (){

     var App = {};

     App.city = "太原";
     App.URL = "http://www.shihuangshu.com/api/index.php?app=transport&act=";
     App.curPart = {
        name: 'district', //default
        member: '' //submit member;
     };

     //set map attribute
     App.container = document.getElementById('container');
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

             if (options.icon){
                 var icon = new BMap.Icon(options.icon.url, new BMap.Size(options.icon.width, options.icon.height));

                 marker.setIcon(icon);
             }
             
             if (options.label){
                 var label = new BMap.Label(options.label.content),
                     offsetSize = new BMap.Size(options.label.offsetX, options.label.offsetY);

                 label.setOffset(offsetSize);
                 label.setStyle(options.label.style);
                 marker.setLabel(label);
             }

             marker.addEventListener('click', function (){
                if (options.callback)
                    options.callback();
             });

             marker.addEventListener('mouseover', function (){
                if (infoWin)
                    marker.openInfoWindow(infoWin);
             });

             marker.addEventListener('mouseout', function (){
                if (infoWin)
                    marker.closeInfoWindow(infoWin);
             });

             App.map.addOverlay(marker);

             return marker;
         },

         getDataList: function (action, callback){
             //$.ajax({
             //   type: 'GET',
             //   url: App.URL + action,
             //   success: function (results){
             //       if (!results)
             //           return;

             //       results = JSON.parse(results);

             //       if (callback)
             //         callback(results);
             //   }
             //});

             var results = Data[action];

             if (!results)
                 return;

             if (callback)
                 callback(results);
         }
     }

     function instancePointsArr (points){
         var instancePoints = [];

         for (var i = 0, l = points.length; i < l; i ++){
            instancePoints.push(new BMap.Point(points[i].x, points[i].y));
         }

         return instancePoints;
     }


     function _mapMouseDown (e){
         var x = e.point.lng,
             y = e.point.lat,
             isRecording = HotCircle.getRecordingFlag(),
             isDividing = DivideOrder.getDividingFlag();

         if (isRecording){
             var circlePoints = HotCircle.getPoints();

             if (circlePoints.length){
                HotCircle.addPoints({'x': x, 'y': y});
                HotCircle.polyline.setPath(instancePointsArr(HotCircle.getPoints()));
                //App.map.addOverlay(HotCircle.polyline);
             }else {
                HotCircle.addPoints({'x': x, 'y': y});
                HotCircle.polyline = _getPolyline(HotCircle.getPoints());
                App.map.addOverlay(HotCircle.polyline);
             }

         }else if (isDividing && e.button === 2){
             App.map.isDrawingRect = true;
             //App.map.disableDragging();
             App.map.removeOverlay(DivideOrder._rect || null);
             DivideOrder.setStartRectPoint({'x': x, 'y': y});
         }
     }

     function _mapMouseMove (e){
         var x = e.point.lng,
             y = e.point.lat,
             isRecording = HotCircle.getRecordingFlag(),
             isDividing = DivideOrder.getDividingFlag();

         if (isRecording && HotCircle.polyline){
             var tempPoints = HotCircle.getPoints().concat([{'x': x, 'y': y}]);
             HotCircle.polyline.setPath(instancePointsArr(tempPoints));
         }else if (isDividing && App.map.isDrawingRect && e.button === 2){
             DivideOrder.setEndRectPoint({'x': x, 'y': y});

             if (!DivideOrder.rect){
                 DivideOrder.rect = _getPolygon(DivideOrder.getRectPoints());
                 App.map.addOverlay(DivideOrder.rect);
             }

             if (DivideOrder.rect){
                 var tempPoints = DivideOrder.getRectPoints();
                 DivideOrder.rect.setPath(instancePointsArr(tempPoints));
             }
         }
     }

     function _mapMouseUp (e){
         var x = e.point.lng,
             y = e.point.lat,
             isDividing = DivideOrder.getDividingFlag();

         if (isDividing && App.map.isDrawingRect && e.button === 2){
             DivideOrder.setEndRectPoint({'x': x, 'y': y});

             DivideOrder._rect = _getPolygon(DivideOrder.getRectPoints());
             App.map.removeOverlay(DivideOrder.rect);
             DivideOrder.rect = null;
             DivideOrder.setBounds(DivideOrder._rect.getBounds());
             DivideOrder.showDivideForm(x, y);
             DivideOrder.setOrdersInBounds();
             //DivideOrder.setDividingFlag(false);
             App.map.addOverlay(DivideOrder._rect);
             //App.map.enableDragging();
             App.map.isDrawingRect = false;
         }
     }

     function _mapdbClick (e){
         var x = e.point.lng,
             y = e.point.lat,
             isRecording = HotCircle.getRecordingFlag();

         if (isRecording){
             HotCircle.addPoints({'x': x, 'y': y});
             HotCircle.getPoints().push({x: x, y: y});
             var polygon = _getPolygon(HotCircle.getPoints());
             App.map.removeOverlay(HotCircle.polyline);
             HotCircle.polyline = null;
             HotCircle.clearPoints();
             App.map.addOverlay(polygon);
         }
     }

     function _getPolyline (points){
         return new BMap.Polyline(instancePointsArr(points), {strokeColor: "red", strokeWeight: 3, strokeOpacity: 0.5});
     }

     function _hideAllFeaturePanel (){
         $('.featurePanel').hide();
     }

     function _getPolygon (points){
         return new BMap.Polygon(instancePointsArr(points), {strokeColor: "red", strokeWeight: 3, strokeOpacity: 0.5});
     }

     

     function _fillMemberList(){

         App.helper.getDataList('GetCourierData', function (results){
              if (!results)
                 return;

              for (var i = 0, l = results.length; i < l; i ++){
                  var name = results[i].truename,
                      id = results[i].courier_id;

                  $("<option value='" + id + "'>" + name + "</option>").appendTo("#memberList");
              }
         });
     }

     function _getMapPoint(e){
         var pageX = e.pageX,
             pageY = e.pageY,
             rect = App.container.getBoundingClientRect(),
             left = rect.left,
             top = rect.top;
         
         var pixel = new BMap.Pixel(pageX - left, pageY - top),
             point = App.map.pixelToPoint(pixel);

         return point;
     }

     App.bindEvent = function (){
         App.container.addEventListener('mousedown', function (e){
             var point = _getMapPoint(e);

             _mapMouseDown({point: point, button: e.button});
         }, false);

         App.container.addEventListener('mousemove', function (e){
             var point = _getMapPoint(e);

             _mapMouseMove({point: point, button: e.button});
         }, false);

         App.container.addEventListener('mouseup', function (e){
             var point = _getMapPoint(e);
             
             _mapMouseUp({point: point, button: e.button});

         }, false);

         App.map.addEventListener('dblclick', function (e){
             //_mapdbClick(e);
         });

         //tool menu event
         //$("#tool_add_circle").click(function (){
         //    _hideAllFeaturePanel();

         //    $("#hotCircle").show();
         //});

         //$("#tool_get_circle").click(function (){
         //    //getBoundary();    
         //});
         
         App.trigger = {
             routeNav: function (){
                App.helper.getDataList('GetNavigation', function (navData){
                    RouteNav.setRoutePoints(navData.points_pair);
                    RouteNav.drawRoute();
                });
            },

            track: function (){
                App.helper.getDataList('CourierTrace', function (traceData){
                    PathReplay.setReplayPath(traceData);
                    PathReplay.replay();
                });            
            }
         }

         $("#toolMenu li").each(function (index, item){
         
             $(item).click(function (){
                App.map.clearOverlays();
                _hideAllFeaturePanel();

                $(this).parent().find('li').removeClass('cur');   
                $(this).addClass('cur');

                var name = $(this).attr('id').split('_')[1];

                App.curPart.name = name;

                DivideOrder.setDividingFlag(name === 'order' ? true : false);

             });
         });

         $("#tool_district").click(function (){
             App.helper.getDataList('GetDistrictData', function (districtData){
                 District.setDistrictData(districtData);
                 District.drawBoundary();
             });
         });

         $("#tool_routeNav").click(function (){

             var tracePanel = $("#selectMember");
             tracePanel.toggle();
         });

         $("#tool_order").click(function (){
             App.helper.getDataList('GetOrderData', function (orderList){
                  DivideOrder.setOrders(orderList);

                  App.helper.getDataList('GetCourierData', function (results){
                     DivideOrder.setMemberList(results);
                     DivideOrder.drawOrdersMarker();
                     DivideOrder.drawMemberMarker();
                  });
             });

             $('#ordersInfo').show();
         });

         $("#tool_track").click(function (){
             var tracePanel = $("#selectMember");
             tracePanel.toggle();
         });
         
         $(".hideHandler").each(function (index, item){
             $(item).click((function(o){
                 return function (){
                    $(o).parent().hide();
                 }
             })(item));
         });

         $("#memberList").change(function (){
             var value = $(this).val();

             App.curPart.member = value;
         })

         $("#memberSure").click(function (){
             var curPartName = App.curPart.name; 
            
             if (App.trigger[curPartName])
                 App.trigger[curPartName]();

         });

         $("#ordersInfoOper").click(function (){
            var val = parseInt($(this).attr('value')),
                infoPanel = $('#ordersInfo'),
                w = infoPanel.width();

            var self = this;
            $('#ordersInfo').animate({left: val ? -w : 0}, function (){
                $(self).html(val ? '展开' : '收起').attr('value', val ? '0' : '1');
            
            });
         
         });
     }

     App.initialize = function (){
         App.bindEvent();
         //HotCircle.init();
         District.init();
         RouteNav.init();
         _fillMemberList();
     }

     App.initialize();
     window.App = App;
})();
