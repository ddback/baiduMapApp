(function (){

    var _searchType = 'start', 
        //_searchContent = {
        //    'start': '起点',
        //    'end': '终点',
        //    'waypoint': '途经点'
        //},
        _markerStyle = {
            'border': 0,
            'font-size': '12px',
            'background': '#2a55ff',
            'border-radius': '3px',
            'width': '30px',
            'height': '30px',
            "line-height": "30px",
            'color': '#fff',
            "text-align": 'center'
        };

    /*[{x: 123.321321, y: 9421.3213, title: 'ewrwer', address: 'cewrwerwe'}]*/
    var _routePoints = [];

    /*
    function _getInfoHtml (title, address){
        var infoHtml = "<div style='font-size:12px'><h4>" + title + "</h4>" + 
                       "<p>" + address + "</p>" + 
                       "<p><a href='javascript:RouteNav.setResultMarker();' style='cursor:pointer'>将此选为" + _searchContent[_searchType] + "?</a></p>" +
                       "</div>";

        return  infoHtml;
    }
    */

    var RouteNav = {

        init: function (){
            //this.bindEvent();    
        },

        clearRoutePoints: function (){
            _routePoints = [];
        },

        setRoutePoints: function (points){
            _routePoints = points;
        },

        getRoutePoints: function (){
            return _routePoints;             
        },

        drawRoutePoint: function (){
            App.map.clearOverlays();

            var routePoints = this.getRoutePoints();

            for (var i = 0, l = routePoints.length; i < l; i ++){
                var start = new BMap.Point(routePoints[i].lng1, routePoints[i].lat1),
                    end = new BMap.Point(routePoints[i].lng2, routePoints[i].lat2);

                [start, end].forEach(function (point, index){
                    index += i * 2;
                    App.helper.addMarker({
                        point: point,
                        label: {
                            content: index === 0 
                                     ? "起点" : index === (2 * l - 1)
                                     ? "终点" : index,
                            style: _markerStyle,
                            offsetX: -30,
                            offsetY: -30
                        }
                    });
                });
            }
        },

        drawRoute: function (){
            App.map.clearOverlays();      

            var routePoints = this.getRoutePoints(),
                viewPath = [],
                routePlans = [],
                searchCount = 2 * routePoints.length - 1,
                planNum = 0;

            var completeCallback = function (walking){
                routePlans.push(walking.getResults().getPlan(0));

                if (++ planNum === searchCount){
                    App.map.setViewport(viewPath);

                    for (var i = 0, l = routePlans.length; i < l; i ++){
                        var plan = routePlans[i],
                            routeNum = plan.getNumRoutes();
                        
                        for (var j = 0; j < routeNum; j ++){
                            var route = plan.getRoute(j),
                                path = route.getPath(),
                                polyline = new BMap.Polyline(path);
                            
                            App.map.addOverlay(polyline);
                        }
                    }
                }
            }
                
            for (var i = 0, l = routePoints.length;  i < l; i ++){
                var start = new BMap.Point(routePoints[i].lng1, routePoints[i].lat1),
                    end = new BMap.Point(routePoints[i].lng2, routePoints[i].lat2);

                this.createSearch(start, end, completeCallback);

                if (routePoints[i + 1]){
                    var nextPointStart = new BMap.Point(routePoints[i + 1].lng1, routePoints[i + 1].lat1);

                    this.createSearch(end, nextPointStart, completeCallback);
                }

                viewPath.push(start);
                viewPath.push(end);
            }

        },

        createSearch: function (start, end, completeCallback){
            var walking = new BMap.WalkingRoute(App.map);

            walking.search(start, end);

            if (typeof completeCallback === "function")
                walking.setSearchCompleteCallback(function (){
                    completeCallback(walking);
                });
        }

        /*
        search: function(keyWords){
            if (!keyWords)
                return;

            var localSearch = new BMap.LocalSearch(App.city, {
                onSearchComplete: function (results){
                    if (localSearch.getStatus() === BMAP_STATUS_SUCCESS){
                        var points = []; 

                        App.map.clearOverlays();

                        for (var i = 0, l = results.getCurrentNumPois(); i < l; i ++){
                            var point = results.getPoi(i).point,
                                title = results.getPoi(i).title,
                                address = results.getPoi(i).address;

                            points.push(point);
                            App.helper.addMarker({
                                point: point,
                                infoHtml: _getInfoHtml(title, address),
                                label: {
                                    content: i + 1, 
                                    style: _markerStyle,
                                    offsetX: -15,
                                    offsetY: -15
                                },
                                callback: (function (p, t, a){
                                    return function (){
                                        RouteNav.setSelectedMarker({
                                            point: p,
                                            title: t,
                                            address: a
                                        });      
                                    }
                                })(point, title, address)
                            });
                        }

                        App.map.setViewport(points);
                    }else {
                        alert("Not found!")
                    }
                                  
                }

                //renderOptions: {map: App.map}
            });

            localSearch.search(keyWords);
        }, 

        bindEvent: function (){
            $.each(['search_route_start', 'search_route_end'], function (index, id){
                $('#' + id).bind('click', (function (id){
                    return function (){
                        var types = id.split('_'),
                            inputId = types.slice(1).join('_'); 

                        _searchType = types[2];
                        RouteNav.search($('#' + inputId).val());
                    }
                })(id));
            
            });
                   
        }
        */
    }

    window.RouteNav = RouteNav;

})();
