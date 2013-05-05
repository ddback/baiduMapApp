class District < ActiveRecord::Base
    validates :name, :uniqueness => true

    has_many :hotCircles
end
