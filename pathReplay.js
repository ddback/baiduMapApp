(function (){

    var PathReplay = {

        getReplayPath: function (){
            return this.replayPath;
        },

        setReplayPath: function (path){
            this.replayPath = path;
        },

        replay: function (){
            var path = this.getReplayPath(),
                points = path.position,
                len = points.length;

            if (!len)
                return;

            var routePaths = [];
            for (var i = 0; i < len; i ++){
                var point = new BMap.Point(points[i].lng, points[i].lat);

                routePaths.push(point);
            }

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
                replayT;

            var self = this;
            var _replay = function (){
                clearTimeout(replayT);
                var point = routePaths[i];

                self.memMard.setPosition(point);
                replayT = setTimeout(function (){
                    if (++ i < len)
                        _replay();
                }, 350);
            }

            _replay();
        }
    
    }   

    window.PathReplay = PathReplay;

})();
