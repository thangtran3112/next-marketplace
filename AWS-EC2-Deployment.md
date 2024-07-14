# Deployment with AWS CodePipeline, CodeBuild, Elastic Beanstalk and EC2

## Elastic Beanstalk and EC2 with IAM Roles

- ElasticBeanstalk no longer allow to create EC2 instance profile. We need to create it manually. [See article](https://stackoverflow.com/questions/30790666/error-with-not-existing-instance-profile-while-trying-to-get-a-django-project-ru/766)
- `EC2InstanceProfileRoleForBeanstalk`. These AWS-managed policies would be sufficient:

```
AWSElasticBeanstalkServiceRolePolicy
AWSElasticBeanstalkWebTier
AWSElasticBeanstalkMulticontainerDocker
AWSElasticBeanstalkWorkerTier
```

- `ElasticBeanstalkRole`, can be created automatically by Beanstalk, and must have these 2 AWS-managed policies:

```
AWSElasticBeanstalkEnhancedHealth
AWSElasticBeanstalkManagedUpdatesCustomerRolePolicy
```

## Other Elastic Beanstalk options

- Choose default VPC, security group and deployment availablity zones
- Disabled Automatic Managed Update, and Enhanced Monitoring

## Create a Procfile into the source code

- Create a Procfile to instruct Elastic Beanstalk on how to start the application. See [Procfile](./Procfile)
- If the folder is zip, we must not zip the parent folder. [See Instructions](https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/applications-sourcebundle.html)

## Better Option is to use AWS CodePipeline/CodeBuild to interac with Elastic Beanstalk

- [Tutorials](https://www.honeybadger.io/blog/node-elastic-beanstalk/)
- See similar `Procfile` and `buildspec.yml` at [chatter-backend](https://github.com/thangtran3112/chatter-backend)
