class OrderController < ActionController::Base
    def all
        @orders = Order.all

        respond_to do |format|
            format.json {render :json => @orders}
        end
    end

    def delete
        @order = District.find(params[:name])

        if @order.destory
            render to :json => {:error => 'Ok', :status => 1}
        end

    end

    def create
        @order = District.new(:name => params[:name], :area => params[:area])
        
        respond_to do |format|
            if @order.save
                format.json {render :json => @order,
                            :status => :created}
            else
                format.json {render :json => @order.errors, :status => :unprocessable_entity}
            end
        end
    end

end
