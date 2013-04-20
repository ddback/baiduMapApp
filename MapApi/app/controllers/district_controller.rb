class DistrictController < ActionController::Base
    def all
        @districts = District.all

        respond_to do |format|
            format.json {render :json => @districts}
        end
    end

    def delete
        @district = District.find(params[:name])

        if @district.destory
            render to :json => {:error => 'Ok', :status => 1}
        end

    end

    def create
        @district = District.new(:name => params[:name], :area => params[:area])
        
        respond_to do |format|
            if @district.save
                format.json {render :json => @district,
                            :status => :created}
            else
                format.json {render :json => @district.errors, :status => :unprocessable_entity}
            end
        end
    end

end
