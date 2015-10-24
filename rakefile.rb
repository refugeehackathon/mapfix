task :fetch_remote, [:force] do |t, args|
  dump_file = "/tmp/mapping-tool--#{Time.now.strftime "%F"}.sql"
  if !File.exist?(dump_file) || args[:force]
    File.delete *Dir["/tmp/mapping-tool--*.sql"]
    puts "dumping live data to: #{dump_file}"
    # system "pg_dump -v -Fc -h #{ENV["CODECKS_AWS_RDS_HOST"]} -p #{ENV["CODECKS_AWS_RDS_PORT"]} -U #{ENV["CODECKS_AWS_RDS_USER"]} -w #{ENV["CODECKS_AWS_RDS_DB"]} > #{dump_file}"
  end

  system "dropdb --if-exists -e mapping_tool_dev"
  system "createdb -O mapping_tool -e mapping_tool_dev"
  # system "pg_restore -e -d mapping_tool_dev --role mapping_tool < #{dump_file}"
end

def migrate(cmd)
  last_index, last_file = Dir[File.join(File.dirname(__FILE__), "db/migrations/*.sql")].map{|file_name| [file_name.match(/(\d+).sql/)[1].to_i, file_name]}.sort.last
  system "(echo \"BEGIN;\"; cat #{last_file}; echo \"\nCOMMIT;\") | #{cmd}"
  last_index
end

task :migrate, [:force] => :fetch_remote do |t, args|
  migrate "psql mapping_tool_dev"
end

task :migrate_prod do
  a,b = rand(0..50), rand(0..50)
  puts "So whats #{a} + #{b}?"
  if STDIN.gets.to_i == a + b
    puts "well done! migrating now..."
    # last_index = migrate "psql -h #{ENV["CODECKS_AWS_RDS_HOST"]} -p #{ENV["CODECKS_AWS_RDS_PORT"]} -U #{ENV["CODECKS_AWS_RDS_USER"]} -w #{ENV["CODECKS_AWS_RDS_DB"]}"
    f = File.new File.join(File.dirname(__FILE__),"db/migrations/#{last_index+1}.sql"), "w"
    puts "migrated #{last_index} and created #{f}"
    File.delete *Dir["/tmp/mapping-tool--*.sql"]
    Rake::Task["current_schema"].invoke
  else
    puts "Nope! #{a+b}"
  end
end

task :current_schema do
  FileUtils.rm Dir[File.join(File.dirname(__FILE__), "db/schemas/*.txt")]
  `echo '\\\\a\\\\t\\\\dt' | psql mapping_tool_dev`.scan(/(\w+)\|table\|/).map(&:first).each do |table_name|
    File.open(File.join(File.dirname(__FILE__), "db/schemas/#{table_name}_schema.txt"),"w") {|f| f.write(`echo '\\\\d #{table_name}' | psql mapping_tool_dev`)}
  end
end