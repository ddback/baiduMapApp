(function (){

    /*
     *  divideOrder Data
     *  需要订单数据和送单人员数据，订单数据用以确定订单的位置，送单人员数据用于分单后进行订单指定
     *  
     *  example:
     *  order data struct
     *  var OrderData = [
     *      {
     *          id: '3324edwrjkl32j4',//订单编号,
     *          lng: 120.213123, //订单经纬度
     *          lat: 90.324234,
     *          startTime: '下单时间', //time,
     *          finishTime: '完成时间', //time,
     *          address: '地址', //string
     *          content: '内容', //string
     *          customer: '联系人', //string
     *          member: '经手人', //string  送单完成人, 需与member表关联
     *          telephone: '电话', //string (may be include '-'),
     *          sign: 1, //表示是否已经处理，0 未处理 1 已处理未完成 2 已完成,
     *          other: ''//预留字段
     *      }
     *  ]
     *  
     *  var MemberData = [
     *      {
     *          id: '32jlwjrlewjr', //人员编号,
     *          name: '名称', //string
     *          image: '人员图像', //string(image url)
     *          telephone: '电话', //string
     *          gender: '姓别', //string
     *          other: ''//预留字段 
     *      }
     *  ]
     *
     * */

    var _rectPoints = [],
        _startPoint = {'x': 0, 'y': 0},
        _endPoint = {'x': 0, 'y': 0},
        _dividingFlag = false,
        _bounds;

    var _orderImageSize = {
            'width': 32,
            'height': 32
        },

        _orderImageUrl = {
            'signed': 'images/map-blue-icon.png',
            'unsigned': 'images/map-green-icon.png',
            'selected': 'images/map-red-icon.png'
        };

    function _getOrderInfoHtml(order){
        if (!order)
            return;

        var infoHtml = "" + 
            + "<div><ul>"  
            + "<li>编号：" + order.id + "</li>"           
            + "<li>订单人:" + order.customer + "</li>"           
            + "<li>地址:" + order.address + "</li>"           
            + "<li>电话:" + order.telephone + "</li>"           
            + "<li>订单内容:" + order.content + "</li>"           
            + "<li>是否完成:" + (order.sign ? '已完成': '未完成') + '</li>'           
            + "</ul></div>";

        return infoHtml;
    }
    
    
    function _getDivideFormHtml(){
        var formHtml = "" + 
            + "将选中的订单分给:"
            + "<form action='' method='POST'>"
            + "<select></select>"
            + "<input type='submit' value='Submit'/>"
            + "</form>";

        return formHtml;
    }

    var DivideOrder = {

        setDividingFlag: function (flag){
            _dividingFlag = flag;
        },

        getDividingFlag: function (){
            return _dividingFlag;
        },

        clearRectPoints: function (){
            _rectPoints = [];                
        },

        setStartRectPoint: function (point){
            this.clearRectPoints();
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
        },

        setOrders: function (orders){
            this.orders = orders;
            this.ordersHash = {};
            
            for (var i = 0, l = orders.length; i < l; i ++){
                var order = orders[i];

                //initialize hash struct
                this.ordersHash[order.id] = {}; 
                this.ordersHash[order.id]['data'] = order;
            }

        },

        getOrders: function (){
            return this.orders;
        },

        drawOrdersMarker: function (){
            var orders = this.getOrders;

            for (var i = 0, l = orders.length; i < l; i ++){
                var order = orders[i],
                    lng = order.lng,
                    lat = order.lat,
                    sign = order.sign,
                    marker = App.helper.addMarker({
                        point: new BMap.point(lng, lat),
                        infoHtml: _getOrderInfoHtml(order),
                        icon: {
                            url: _orderImageUrl[sign ? 'signed' : 'unsigned'],
                            width: _orderImageSize.width,
                            height: _orderImageSize.height
                        }
                    });

                 this.ordersHash[order.id]['marker'] = marker;
            }
        },

        setBounds: function (bounds){
            _bounds = bounds;
        },

        getBounds: function (){
            return _bounds;
        },

        showDivideForm: function (x, y){
            var divideFormHtml = _getDivideFormHtml(),
                point = new BMap.Point(x, y);

            this.divideFormInfoWin = new InfoWindow(divideFormHtml);
            App.map.openInfoWindow(this.divideFormInfoWin, point);
        },

        setOrdersInBounds: function (){
            var bounds = this.getBounds(),
                ordersHash = this.ordersHash;

            for (var orderId in ordersHash){
                if (!ordersHash.hasOwnProperty(orderId))
                    return;

                var order = ordersHash[orderId]['data'],
                    point = new BMap.point(order.lng, order.lat),
                    sign = order.sign,
                    marker = ordersHash[order]['marker'],
                    iconImageUrl =  _orderImageUrl[sign ? 'signed' : 'unsigned'];

                if (bounds.containsPoint(point))
                    iconImageUrl = _orderImageUrl['selected'];
                    
                marker.getIcon.setImageUrl(iconImageUrl);
            }
        }

    }

    window.DivideOrder = DivideOrder;

})();
