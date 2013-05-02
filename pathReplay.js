(function (){

    /*
     * path Data
     * 需要提供路径点的集合，包括送单人员的姓名
     *
     * exmaple
     * var PathData = {
     *    member: '人员姓名',
     *    image: 'url', //若此字段没有，则显示默认图像
     *    points: [
     *      {lng: 120.321321, lat: 90.32432, finishTime: time},
     *      {lng: 121.321321, lat: 91.32432, finishTime: time},
     *      {lng: 122.321321, lat: 92.32432, finishTime: time},
     *      {lng: 123.321321, lat: 93.32432, finishTime: time}
     *    ]
     * }
     * */


    var PathReplay = {

        getReplayPath: function (){
            return this.replayPath;
        },

        setReplayPath: function (path){
            this.replayPath = path;
        },

        replay: function (){
            var path = this.getReplayPath(),
                points = path.points,
                len = points.length;

            if (!len)
                return;

            var memMard = App.helper.addMark({
                    point: new BMap.point(points[0].lng, points[0].lat),
                    icon: {
                        url: path.image ? path.image : defaultMemberUrl,
                        width: 30,
                        height: 30
                    }
            });

            var i = 0,
                replayT;

            var _replay = function (){
                clearTimeout(replayT);
                var point = new BMap.point(points[i].lng, points[i].lat);
                memMard.setPosition(point);
                replayT = setTimeout(function (){
                    if (++ i < len)
                        replayFun();
                }, 300);
            }

            _replay();
        }
    
    }   

    window.PathReplay = PathReplay;

})();
