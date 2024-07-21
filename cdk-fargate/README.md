# Deploying the NextJS app on ECS Fargate with CDK

## CDK Setup

- [Specify AWS account and region](./bin/cdk.ts)
- Must install Docker Desktop to run CDK

```bash
cd cdk
npm install
cdk bootstrap
cdk deploy --all --require-approval=never
```

- This CDK does not include updating environment variables yet. We must include all variables that are required by NextJS (.env file)
