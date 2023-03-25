#? Local development
dev:
	@cargo lambda watch
invoke-data-collector:
	@cargo lambda invoke data-collector --data-ascii "{}"
	
#? Deploying to AWS
deploy:
	@sls deploy --stage dev
d-invoke-data-collector: 
	@sls invoke -f data_collector -d "{}" --stage prod
d-logs-data-collector:
	@sls logs -f data_collector --stage dev

#? Running tests
test:
	@cargo test