class CreateHotCircles < ActiveRecord::Migration
  def change
    create_table :hot_circles do |t|
      t.string :name
      t.string :points
      t.string :storkeStyle
      t.references :district, index: true

      t.timestamps
    end
  end
end
