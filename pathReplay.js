(function (){

    var PathReplay = {

        getReplayPath: function (){
            return this.replayPath;
        },

        setReplayPath: function (path){
            this.replayPath = path;
        },

        draw: function (routePaths, T){
            this.playing = true;

            var path = this.getReplayPath();
            App.map.removeOverlay(this.polyline);
            this.polyline = new BMap.Polyline(routePaths, {
                "strokeStyle": "dashed"
            });

            App.map.addOverlay(this.polyline);
            App.map.setViewport(routePaths);

            App.map.removeOverlay(this.memMard);
            this.memMard = App.helper.addMarker({
                    point: routePaths[0],
                    icon: {
                        url: path.avatar ? path.avatar : defaultMemberUrl,
                        width: 30,
                        height: 30
                    }
            });

            var i = 0,
                self = this;

            var replayT = setInterval(function (){
                var point = routePaths[i];

                if (++ i < routePaths.length && self.playing)
                    self.memMard.setPosition(point);
                else 
                    clearInterval(replayT);
            
            }, T || 350);

        },

        replay: function (T){
            this.playing = false;
            App.map.clearOverlays();

            var path = this.getReplayPath(),
                points = path.position,
                len = points.length,
                routePlans = [],
                routePaths = [],
                miles = 0, minute = 0,
                planNum = 0;

            if (!len)
                return;

            for (var i = 0; i < len; i ++){
                var point = new BMap.Point(points[i].lng, points[i].lat),
                    walking = new BMap.WalkingRoute(App.map);

                if (i < len - 1){
                    var nextPoint = new BMap.Point(points[i + 1].lng, points[i + 1].lat);

                    walking.search(point, nextPoint);
                    walking.setSearchCompleteCallback((function (walking, index){
                        return function (){
                            routePlans[index] = walking.getResults().getPlan(0);

                            if (++ planNum === len - 1){
                                for (var j = 0; j < planNum; j ++){
                                    var route = routePlans[j].getRoute(0),
                                        path = route.getPath();

                                    routePaths = routePaths.concat(path);    
                                    miles += routePlans[j].getDistance(false);
                                    minute += routePlans[j].getDuration(false);
                                }


                                PathReplay.draw(routePaths, T);
                                document.getElementById('miles').innerText = miles;
                                document.getElementById('minute').innerText = (minute / 60).toFixed(0);
                            }
                        
                        }
                    })(walking, i));
                
                }
            }
        }
    }   

    window.PathReplay = PathReplay;

})();
