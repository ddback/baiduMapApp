(function (){

    var _searchType = 'start', 
        _searchContent = {
            'start': '起点',
            'end': '终点',
            'waypoint': '途经点'
        },
        _markerStyle = {
            'border': 0,
            'font-size': '12px',
            'background': '#2a55ff',
            'border-radius': '3px',
            'width': '20px',
            'height': '20px',
            "line-height": "20px",
            'color': '#fff',
            "text-align": 'center'
        },
        _selectedMarker = null,
        _selectedTitle = null;

    /*[{x: 123.321321, y: 9421.3213, title: 'ewrwer', address: 'cewrwerwe'}]*/
    var _routePoints = [];

    function _getInfoHtml (title, address){
        var infoHtml = "<div style='font-size:12px'><h4>" + title + "</h4>" + 
                       "<p>" + address + "</p>" + 
                       "<p><a href='javascript:RouteNav.setResultMarker();' style='cursor:pointer'>将此选为" + _searchContent[_searchType] + "?</a></p>" +
                       "</div>";

        return  infoHtml;
    }

    var RouteNav = {

        init: function (){
            this.bindEvent();    
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
                var point = routePoints[i];

                App.helper.addMarker({
                    point: new BMap.Point(point.x, point.y),
                    label: {
                        content: i === 0 ? _searchContent['start'] : point.title,
                        style: _markerStyle,
                        offsetX: -15,
                        offsetY: -15
                    }
                });
            }
        },

        drawRoute: function (){
            App.map.clearOverlays();      

            var routePoints = this.getRoutePoints(),
                viewPath = [],
                routePlans = [],
                planNum = 0;
                
            for (var i = 0, l = routePoints.length; i < l; i ++){
                var start = new BMap.Point(routePoints[i].lng1, routePoints[i].lat1),
                    end = new BMap.Point(routePoints[i].lng2, routePoints[i].lat2);

                viewPath.push(start);
                viewPath.push(end);

                var walking = new BMap.WalkingRoute(App.map);

                walking.search(start, end);
                walking.setSearchCompleteCallback((function (walking){
                    return function (){
                        routePlans.push(walking.getResults().getPlan(0));

                        if (++ planNum === routePoints.length){
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
                })(walking));
            }

        },

        setSelectedMarker: function (marker){
            _selectedMarker = marker;               
        },

        getSelectedMarker: function (){
            return _selectedMarker;
        },

        setResultMarker: function (){
            var currentMarker = this.getSelectedMarker(); 

            $('#route' + '_' + _searchType).val(currentMarker.title);
            this.addRoutePoint({
                'x': currentMarker.point.lng,
                'y': currentMarker.point.lat,
                'title': currentMarker.title,
                'address': currentMarker.address
            });
            
            this.drawRoutePoint();
            this.drawRoute();
        },

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
    }

    window.RouteNav = RouteNav;

})();
