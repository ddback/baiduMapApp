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

        addRoutePoint: function (point){
            var routePoints = this.getRoutePoints(),
                len = routePoints.length;

            if (len < 2){
                _routePoints.push(point);
            }else {
                _routePoints.splice(len - 2, 0, point);
            }

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
            
            console.log(this.getRoutePoints());

            this.drawRoutePoint();
        },

        search: function(keyWords){
            if (!keyWords)
                return;

            var localSearch = new BMap.LocalSearch(App.map, {
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
                                callback: function (){
                                    RouteNav.setSelectedMarker({
                                        point: point,
                                        title: title,
                                        address: address
                                    });      
                                }
                            });
                        }

                        App.map.setViewport(points);
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
                        console.log(_searchType);
                        RouteNav.search($('#' + inputId).val());
                    }
                })(id));
            
            });
                   
        }
    }

    RouteNav.init();

    window.RouteNav = RouteNav;

})();
