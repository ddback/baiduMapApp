class HotCircleController < ActionController::Base
    def all
        @hot_circles = HotCircle.all

        respond_to do |format|
            format.json {render :json => @hot_circles}
        end
    end

    def get
        begin
            @hot_circle = HotCircle.find(params[:name])
        rescue ActiveRecord::RecordNotFound => e
            @hot_circle = nil
        end

        if @hot_circle
            respond_to do |format|
                format.json {render :json => @hot_circle}
            end
        else 
            render :json => {:error => 'failed found', :status => 1}
        end
    end

    def delete
        @hot_circle = HotCircle.find(params[:name])

        if @hot_circle.destory
            render to :json => {:error => 'Ok', :status => 1}
        end

    end

    def create
        @hot_circle = HotCircle.new(:name => params[:name], :district => params[:district], :points => params[:points], :strokeStyle => params[:strokeStyle])
        
        respond_to do |format|
            if @hot_circle.save
                format.json {render :json => @hot_circle,
                            :status => :created}
            else
                format.json {render :json => @hot_circle.errors, :status => :unprocessable_entity}
            end
        end
    end
end
