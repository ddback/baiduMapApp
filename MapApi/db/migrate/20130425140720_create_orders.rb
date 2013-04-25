class CreateOrders < ActiveRecord::Migration
  def change
      create_table :orders do |t|
          t.string :name
          t.string :telephone
          t.float :lng
          t.float :lat
          t.string :address
          t.string :content
          t.string :customer
          t.integer :importance

          t.timestamps
      end
  end
end
