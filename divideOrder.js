(function (){

    var _rectPoints = [],
        _startPoint = {'x': 0, 'y': 0},
        _endPoint = {'x': 0, 'y': 0};

    var DivideOrder = {

        clearRectPoints: function (){
            _rectPoints = [];                
        },

        setStartRectPoint: function (point){
            this.clearRectPoints = [];
            _startPoint = point;
        },

        setEndRectPoint: function (point){
            _rectPoints[0] = {'x': _startPoint.x, 'y': _startPoint.y};
            _rectPoints[1] = {'x': _endPoint.x, 'y': _startPoint.y};
            _rectPoints[2] = {'x': _endPoint.x, 'y': _endPoint.y};
            _rectPoints[3] = {'x': _startPoint.x, 'y': _endPoint.y};
            _endPoint = point;             
        },

        getRectPoints: function (){
            return _rectPoints;
        }
    }

    window.DivideOrder = DivideOrder;

})();
