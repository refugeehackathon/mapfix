module App
  class Api < Grape::API

    get '/test' do
      Tag.all
    end

  end
end