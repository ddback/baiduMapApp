(function (){

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
            'unsigned': 'images/map-red-icon.png',
            'selected': 'images/map-green-icon.png'
        };

    function _getOrderInfoHtml(order){
        if (!order)
            return;

        var infoHtml = "" 
            + "<div><ul>"  
            + "<li>编号：" + order.order_id + "</li>"           
            + "<li>金额：" + order.amount + "</li>"           
            + "<li>客户地址:" + order.address + "</li>"           
            + "<li>客户电话:" + order.telephone + "</li>"           
            + "<li>客户要求:" + order.remark + "</li>"           
            + "<li>客户备注:" + order.calling_remark + "</li>"           

            + "<li>餐厅地址:" + order.restaurant + "</li>"           
            + "</ul></div>";

        return infoHtml;
    }
    
    
    function _getDivideFormHtml(){

        var memberList = App.memberList,
            formHtml = "<p>将选中的订单分给:</p>"
                    + "<select id='divideMemberList'>{$}</select>"
                    + "<button onclick='DivideOrder.submit();'>确定</button>"
                    + "<button onclick='DivideOrder.cancel();'>取消</button>"
            options = '';

        for (var i = 0, l = memberList.length; i < l; i ++){
            var name = memberList[i].truename,
                id = memberList[i].courier_id;

            options += '<option value="' + id  + '">' + name + '</option>';
        }

        formHtml = formHtml.replace('{$}', options);
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

        getStartRectPoint: function (){
            return _startPoint;                 
        },

        setStartRectPoint: function (point){
            this.clearRectPoints();
            _startPoint = point;
        },

        setEndRectPoint: function (point){
            _endPoint = point;             
            _rectPoints[0] = {'x': _startPoint.x, 'y': _startPoint.y};
            _rectPoints[1] = {'x': _endPoint.x, 'y': _startPoint.y};
            _rectPoints[2] = {'x': _endPoint.x, 'y': _endPoint.y};
            _rectPoints[3] = {'x': _startPoint.x, 'y': _endPoint.y};
        },

        getRectPoints: function (){
            return _rectPoints;
        },

        submit: function (){
            var ordersHash = this.ordersHash;

            for (var orderId in ordersHash){
                var status = ordersHash[orderId]['status'];

                if (status){
                    var marker = ordersHash[orderId]['marker'];

                    App.map.removeOverlay(marker);
                }
            }

            this.divideFormInfoWin.close();
            App.map.removeOverlay(DivideOrder._rect);
        },

        cancel: function (){
            var ordersHash = this.ordersHash;

            for (var orderId in ordersHash){
                var status = ordersHash[orderId]['status'];

                if (status){
                    var marker = ordersHash[orderId]['marker'],
                        order = ordersHash[orderId]['data'],
                        point = new BMap.Point(order.lng2, order.lat2);

                    App.map.removeOverlay(marker);

                    marker = App.helper.addMarker({
                        point: point,
                        infoHtml: _getOrderInfoHtml(order),
                        icon: {
                            url: _orderImageUrl['unsigned'],
                            width: _orderImageSize.width,
                            height: _orderImageSize.height
                        }
                   });
               }
            }

            this.divideFormInfoWin.close();
            App.map.removeOverlay(DivideOrder._rect);
        },

        setOrders: function (orders){
            this.orders = orders;
            this.ordersHash = {};
            
            for (var i = 0, l = orders.length; i < l; i ++){
                var order = orders[i];

                //initialize hash struct
                this.ordersHash[order.order_id] = {}; 
                this.ordersHash[order.order_id]['data'] = order;
                this.ordersHash[order.order_id]['status'] = 0;
            }

        },

        getOrders: function (){
            return this.orders;
        },

        drawOrdersMarker: function (){
            var orders = this.getOrders(),
                viewPath = [];

            for (var i = 0, l = orders.length; i < l; i ++){
                var order = orders[i],
                    lng = order.lng2, //get custiomPosition
                    lat = order.lat2,
                    sign = order.sign;

                var point = new BMap.Point(lng, lat);

                viewPath.push(point);
                var marker = App.helper.addMarker({
                        point: new BMap.Point(lng, lat),
                        infoHtml: _getOrderInfoHtml(order),
                        icon: {
                            url: _orderImageUrl[sign ? 'signed' : 'unsigned'],
                            width: _orderImageSize.width,
                            height: _orderImageSize.height
                        }
                });

                this.ordersHash[order.order_id]['marker'] = marker;
            }

            App.map.setViewport(viewPath);
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

            this.divideFormInfoWin = new BMap.InfoWindow(divideFormHtml);
            App.map.openInfoWindow(this.divideFormInfoWin, point);
        },

        setOrdersInBounds: function (){
            var bounds = this.getBounds(),
                ordersHash = this.ordersHash;

            for (var orderId in ordersHash){
                if (!ordersHash.hasOwnProperty(orderId))
                    return;

                var order = ordersHash[orderId]['data'],
                    point = new BMap.Point(order.lng2, order.lat2),
                    marker = ordersHash[orderId]['marker'],
                    status = ordersHash[orderId]['status'];

                if (bounds.containsPoint(point)){
                    App.map.removeOverlay(marker);

                    ordersHash[orderId]['marker'] = App.helper.addMarker({
                        point: point,
                        infoHtml: _getOrderInfoHtml(order),
                        icon: {
                            url: _orderImageUrl['selected'],
                            width: _orderImageSize.width,
                            height: _orderImageSize.height
                        }
                   });

                   ordersHash[orderId]['status'] = 1;
                }
            }
        }

    }

    window.DivideOrder = DivideOrder;

})();
