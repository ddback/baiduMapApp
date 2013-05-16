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
    
    
    function _getDivideFormHtml (memberList){

        var formHtml = "<p>将选中的订单分给:</p>"
                    + "<select id='divideMemberList'>{$}</select>"
                    + "<button onclick='DivideOrder.submit();'>确定</button>"
                    + "<button onclick='DivideOrder.cancel();'>取消</button>"
            options = '';

        for (var i = 0, l = memberList.length; i < l; i ++){
            var name = memberList[i].truename,
                id = memberList[i].id;

            options += '<option value="' + id  + '">' + name + '</option>';
        }

        formHtml = formHtml.replace('{$}', options);
        return formHtml;
    }

    function _getMemHtml (mem){
        var memHtml = "<div><ul>"
            + "<li>姓名：" + mem.truename + "</li>"
            + "<li>手机：" + mem.telephone + "</li>"
            + "<li>是否空闲：" + (mem.is_available == 1 ? "空闲" : "忙") + "</li>"
            + "<li>今日送餐数：" + mem.transport_num + "</li></ul>";
    
        return memHtml;
    }

    function _getOrderTableHtml (order, status, member, index){
        var bgColor = index % 2 ? "#A6C2DE;" : "#fff;",
            fColor = status === 1 ? "#ff0000;" : "#000",
            statContent, statOper;

            if (status === 2){
                statContent = "已分";
                statOper = "<button onclick=\"DivideOrder.redivide('" + order.order_id + "');\">重分</button>";
            }else if (status === 1){
                statContent = "已选择";
                statOper = "<button onclick=\"DivideOrder.cancelSelect('" + order.order_id + "');\">取消选择</button>";
                
            }else {
                statContent = "未分";
                statOper = "<button onclick=\"DivideOrder.joinSelect('" + order.order_id + "');\">选择</button>";
            }

        var orderHtml = "<tr style='background-color:" + bgColor + "color:" + fColor + "'>"
            //+ "<td>" + order.order_id + "</td>"
            + "<td>" + order.address + "</td>"
            + "<td>" + order.restaurant + "</td>"
            + "<td>" + statContent + "</td>"
            + "<td>" + (member || '') + "</td>"
            + "<td>" + statOper + "</td>";
        
        return orderHtml;
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

        redivide: function (orderId){
            var orders = this.orders;

            for (var i = 0, l = orders.length; i < l; i ++){
                var order = orders[i];

                if (order.order_id === orderId){
                    this.ordersHash[order.order_id] = {}; 
                    this.ordersHash[order.order_id]['data'] = order;
                    this.ordersHash[order.order_id]['status'] = 0;
                    break;
                }
            }
            
            this.drawOrdersMarker();
        },

        submit: function (){
            var ordersHash = this.ordersHash,
                memberSelect = document.getElementById('divideMemberList'),
                selectedOption = memberSelect.options[memberSelect.selectedIndex],
                selectedValue = selectedOption.value,
                selectedName = selectedOption.innerText;

            for (var orderId in ordersHash){
                var status = ordersHash[orderId]['status'];

                if (status === 1){
                    ordersHash[orderId]['status'] = 2;
                    ordersHash[orderId]['member'] = selectedName;
                    
                    var marker = ordersHash[orderId]['marker'];

                    App.map.removeOverlay(marker);
                }
            }

            this.updateOrdersList();
            //this.divideFormInfoWin.close();
            App.map.removeOverlay(DivideOrder._rect);
        },

        cancel: function (){
            var ordersHash = this.ordersHash;

            for (var orderId in ordersHash){
                var status = ordersHash[orderId]['status'];

                if (status === 1){
                    var marker = ordersHash[orderId]['marker'],
                        order = ordersHash[orderId]['data'],
                        point = new BMap.Point(order.lng2, order.lat2);

                    App.map.removeOverlay(marker);

                    ordersHash[orderId]['status'] = 0;
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

            //this.divideFormInfoWin.close();
            this.updateOrdersList();
            App.map.removeOverlay(DivideOrder._rect);
        },

        cancelSelect: function (orderId){

            if (!this.ordersHash[orderId]){
                throw 'No order existed';
                return;
            }

            this.ordersHash[orderId]['status'] = 0;

            var marker = this.ordersHash[orderId]['marker'],
                data = this.ordersHash[orderId]['data'],
                point = new BMap.Point(data.lng2, data.lat2);

            App.map.removeOverlay(marker);

            marker = App.helper.addMarker({
                 point: point,
                 infoHtml: _getOrderInfoHtml(data),
                 icon: {
                     url: _orderImageUrl['unsigned'],
                     width: _orderImageSize.width,
                     height: _orderImageSize.height
                 }
            });

            this.updateOrdersList();
            App.map.removeOverlay(DivideOrder._rect);
        },

        joinSelect: function (orderId){
            if (!this.ordersHash[orderId]){
                throw 'No order existed';
                return;
            }

            this.ordersHash[orderId]['status'] = 1;

            var marker = this.ordersHash[orderId]['marker'],
                data = this.ordersHash[orderId]['data'],
                point = new BMap.Point(data.lng2, data.lat2);

            App.map.removeOverlay(marker);

            this.ordersHash[orderId]['marker'] = App.helper.addMarker({
                 point: point,
                 infoHtml: _getOrderInfoHtml(data),
                 icon: {
                     url: _orderImageUrl['selected'],
                     width: _orderImageSize.width,
                     height: _orderImageSize.height
                 }
            });

            this.updateOrdersList();
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

        setMemberList: function (list){
            this.memberList = list;
        },

        drawMemberMarker: function (){
            var memberList = this.memberList;

            for (var i = 0, l = memberList.length; i < l; i ++){
                var mem = memberList[i];

                var memMarker = App.helper.addMarker({
                    point: new BMap.Point(mem.lng, mem.lat),
                    infoHtml: _getMemHtml(mem),
                    icon: {
                        url: mem.avatar,   
                        width: 30,
                        height: 30
                    }
                }); 
            }
                          
        },

        drawOrdersMarker: function (){
            var ordersHash = this.ordersHash,
                viewPath = [];

            for (var orderId in ordersHash){
                var order = ordersHash[orderId]['data'],
                    marker = ordersHash[orderId]['marker'],
                    status = ordersHash[orderId]['status'],
                    lng = order.lng2, //get custiomPosition
                    lat = order.lat2,
                    sign = order.sign;

                if (status === 2)
                    continue;

                if (marker)
                    App.map.removeOverlay(marker);

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

                ordersHash[orderId]['marker'] = marker;
            }

            this.updateOrdersList();
            App.map.setViewport(viewPath);
        },

        updateOrdersList: function (){
            var ordersHash = this.ordersHash,
                tableHtml = '<table><tr height=28><td width=100>客户地址</td><td width=100>餐厅地址</td><td>状态</td><td>送单员</td><td>操作</td></tr>',
                index = 0,
                selectedOrdersNum = 0;

            for (orderId in ordersHash){
                var order = ordersHash[orderId]['data'],
                    status = ordersHash[orderId]['status'],
                    member = ordersHash[orderId]['member'];

                if (status === 1)
                    ++ selectedOrdersNum;
            
                tableHtml += _getOrderTableHtml(order, status, member, ++ index);
            }

            tableHtml += "</table>";

            document.getElementById('ordersInfoTable').innerHTML = tableHtml;
            document.getElementById('selectedOrdersNum').innerText = selectedOrdersNum;
        },

        removeAllMarkers: function (){
            var ordersHash = this.ordersHash;                

            for (orderId in ordersHash){
                var marker = ordersHash[orderId]['marker'];
            
                if (marker)
                    App.map.removeOverlay(marker);
            }
                          
        },

        setBounds: function (bounds){
            _bounds = bounds;
        },

        getBounds: function (){
            return _bounds;
        },

        showDivideForm: function (x, y){
            var memberList = this.memberList,
                divideFormHtml = _getDivideFormHtml(memberList),
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

                if (bounds.containsPoint(point) && !status){
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

                   //0, 未分， 1，选中， 2，已分
                   ordersHash[orderId]['status'] = 1;
                }
            }

            this.updateOrdersList();
        }
    }

    window.DivideOrder = DivideOrder;

})();
