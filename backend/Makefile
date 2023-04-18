#? Local development
dev:
	@cargo lambda watch
invoke-data-collector:
	@cargo lambda invoke data-collector --data-ascii "{}"
	
#? Deploying to AWS
deploy:
	@sls deploy --stage dev
#? When deploying first time, acquire the certificate, then paste the sertificate ARN to the serverless.yml customDomain.certificateArn
get-certifiate:
	@sls deploy -c serverless-custom-domain.yml
#? after get-certifiate, run this command to deploy the domain
create-domain:
	@sls create_domain --stage dev
d-invoke-data-collector: 
	@sls invoke -f data_collector -d "{}" --stage dev
d-logs-data-collector:
	@sls logs -f data_collector --stage dev
	
d-invoke-process-all: 
	@sls invoke -f process_all_job_posts -d "{}" --stage dev

d-invoke-migrate: 
	@sls invoke -f migrate_db -d "{}" --stage dev

d-logs-statistics:
	@sls logs -f statistics --stage dev

#? Running tests
test:
	@cargo test

lint:
	@cargo clippy --all-targets -- -D clippy::all