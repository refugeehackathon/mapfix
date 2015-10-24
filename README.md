# mapping-tool
to create in 5 min's a refugee city map

# Setup Backend

## DB

- intall psql 9.4
- `echo "CREATE ROLE mapping_tool superuser login;CREATE DATABASE mapping_tool_dev OWNER=mapping_tool;" | psql`


### Migrate locally

- edit the latest file in db/migrations/*.sql
- `rake migrate`

### Migrate to prod

- make sure it works locally
- `rake migrate_prod`


## API Server


### Install

- install ruby >= 2.2
- `bundle install`

### Run locally

- `rackup`
- access `localhost:9292`

### Deploy

`git push heroku [FEATUREBRANCHNAME]:master`