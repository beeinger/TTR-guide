#? Local development
dev:
	@cargo lambda watch
#? Invoking local lambdas
invoke:
	@echo "\nExample: make invoke data-collector --data-ascii \"{}\"\n"
	@cargo lambda invoke
invoke-data-collector:
	@cargo lambda invoke data-collector --data-ascii "{}"
#? Deploying to AWS
deploy:
	@sls deploy
#? Invoking deployed lambdas
d-invoke:
	@echo "\nExample: make d-invoke data-collector -d \"{}\"\n"
	@sls invoke
d-invoke-data-collector: 
	@sls invoke -f data_collector -d "{}"

#? Running tests
test:
	@cargo test