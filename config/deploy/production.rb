# server-based syntax
# ======================
# Defines a single server with a list of roles and multiple properties.
# You can define all roles on a single server, or split them:

# server "example.com", user: "deploy", roles: %w{app db web}, my_property: :my_value
# server "example.com", user: "deploy", roles: %w{app web}, other_property: :other_value
# server "db.example.com", user: "deploy", roles: %w{db}

server "3.209.22.204", user: "deploy", roles: %w{web app post_install}

set :application, "istory_api_production"
set :deploy_to, "/home/deploy/istory_api/production"

# Configuration
# =============
# You can set any configuration variable like in config/deploy.rb
# These variables are then only loaded and set in this stage.
# For available Capistrano configuration variables see the documentation page.
# http://capistranorb.com/documentation/getting-started/configuration/
# Feel free to add new variables to customise your setup.

namespace :post_install do
  desc "Run server"
  task :run_server do
    on roles(:app) do
      within current_path do
        execute :pm2, "startOrRestart --only API #{current_path}/ecosystem.config.js"
      end
    end
  end
end

namespace :deploy do
  after :published, "post_install:run_server"
end

set :branch, "master"
