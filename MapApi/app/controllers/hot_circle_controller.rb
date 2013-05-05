class HotCircleController < ActionController::Base
    def all
        @hot_circles = HotCircle.all

        render :json => @hot_circles

        #respond_to do |format|
            #format.json {render :json => @hot_circles}
        #end
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
            render :json => {:error => 'Ok', :status => 1}
        end

    end

    def create
        @district = District.find(params[:district])
        #@hot_circle = HotCircle.new(:name => params[:name], :district => params[:district], :points => params[:points], :strokeStyle => params[:strokeStyle])
        
        @hot_circle = @district.hotCircles.create(:name => params[:name], :points => params[:points], :storkeStyle => params[:strokeStyle])

        #@hot_circle = HotCircle.new(params[:hot_circle])

        #respond_to do |format|
        if @hot_circle.save
            #format.json {render :json => @hot_circle,
                        #:status => :created}
            render :json => {:status => 'Ok'}
        else
            #format.json {render :json => @hot_circle.errors, :status => :unprocessable_entity}
        end
        #end
    end
end
