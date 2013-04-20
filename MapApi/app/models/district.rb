class District < ActiveRecord::Base
    validates :name, :uniqueness => true
end
