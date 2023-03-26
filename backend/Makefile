#? Local development
dev:
	@cargo lambda watch
invoke-data-collector:
	@cargo lambda invoke data-collector --data-ascii "{}"
	
#? Deploying to AWS
deploy:
	@sls deploy --stage dev
d-invoke-data-collector: 
	@sls invoke -f data_collector -d "{}" --stage dev
d-logs-data-collector:
	@sls logs -f data_collector --stage dev
	
d-invoke-process-all: 
	@sls invoke -f process_all_job_posts -d "{}" --stage dev

d-invoke-migrate: 
	@sls invoke -f migrate_db -d "{}" --stage dev

#? Running tests
test:
	@cargo test

lint:
	@cargo clippy --all-targets -- -D clippy::all