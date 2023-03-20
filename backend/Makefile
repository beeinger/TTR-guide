#? Local development
dev:
	@cargo lambda watch
invoke-data-collector:
	@cargo lambda invoke data-collector --data-ascii "{}"
	
#? Deploying to AWS
deploy:
	@sls deploy
d-invoke-data-collector: 
	@sls invoke -f data_collector -d "{}"
d-logs-data-collector:
	@sls logs -f data_collector

#? Running tests
test:
	@cargo test