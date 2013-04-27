(function (){


    var PathReplay = {

        getReplayPath: function (){
            return this.replayPath;
        },

        setReplayPath: function (path){
            this.replayPath = path;
        },

        replay: function (){
            var path = this.getReplayPath();
        }
    
    }   

    window.PathReplay = PathReplay;

})();
