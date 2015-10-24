RACK_ENV = (ENV['RACK_ENV'] || 'development').to_sym

require 'bundler'
Bundler.require(:default, RACK_ENV)

require_all Dir.glob("api/{lib,controllers,models}/**/*.rb").reject { |f| /(_test|test_\w+).rb/ =~ f }
require_all "api/app.rb"


use Rack::Cors do
  allow do
    origins '*'
    resource '*', headers: :any, methods: [:get, :post, :delete], max_age: 365 * 24 * 3600
  end
end

use Rack::Deflater
use ActiveRecord::ConnectionAdapters::ConnectionManagement

run App::Root
