# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20130425140720) do

  create_table "districts", force: true do |t|
    t.string   "name"
    t.float    "area"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "hot_circles", force: true do |t|
    t.string   "name"
    t.string   "points"
    t.string   "storkeStyle"
    t.integer  "district_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  add_index "hot_circles", ["district_id"], name: "index_hot_circles_on_district_id"

  create_table "orders", force: true do |t|
    t.string   "name"
    t.string   "telephone"
    t.float    "lng"
    t.float    "lat"
    t.string   "address"
    t.string   "content"
    t.string   "customer"
    t.integer  "importance"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
