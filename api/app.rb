module App
  class Root < Grape::API
    format :json
    default_format :json

    rescue_from Grape::Exceptions::ValidationErrors do |e|
      error_response(message: e.message, status: 400)
    end

    helpers do
      def logger
        Root.logger
      end
    end

    unless ENV["CODECKS_AWS_IS_WORKER"].to_s=="true"
      rescue_from :all do |e|
        if ENV['RACK_ENV']=='development'
          puts "#{e.class.name.black.on_red}: #{e.message.red}"
          userland = e.backtrace.reject {|line| line[/\/\.rvm\//]}
          puts userland
          puts "omitted #{e.backtrace.size - userland.size} lines in backtrace".gray
        else
          Root.logger.error "#{e.class.name}: #{e.message}"
          Root.logger.error e.backtrace
        end
        Rack::Response.new([{error: "Server error."}.to_json], 500, {"Content-type" => "application/json"}).finish
      end
    end

    mount App::Api
  end
end
