import { Stack, StackProps, Duration } from "aws-cdk-lib";
import { Construct } from "constructs";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as ecs from "aws-cdk-lib/aws-ecs";
import * as iam from "aws-cdk-lib/aws-iam";
import * as ecs_patterns from "aws-cdk-lib/aws-ecs-patterns";
import * as elasticloadbalancingv2 from "aws-cdk-lib/aws-elasticloadbalancingv2";

export interface EcsBackendStackProps extends StackProps {
  vpc: ec2.Vpc;
}

const relativeAppPath = "../";

export class EcsAlbStack extends Stack {
  public readonly apiService: ecs_patterns.ApplicationLoadBalancedFargateService;
  public readonly apiServiceUrl: string;

  constructor(scope: Construct, id: string, props: EcsBackendStackProps) {
    super(scope, id, props);

    const cluster = new ecs.Cluster(this, `${id}-cluster`, {
      clusterName: `${id}-workshop-cluster`,
      vpc: props.vpc,
    });

    // Task Role
    const taskRole = new iam.Role(this, `${id}-task-role`, {
      assumedBy: new iam.ServicePrincipal("ecs-tasks.amazonaws.com"),
    });

    // Service
    this.apiService = new ecs_patterns.ApplicationLoadBalancedFargateService(
      this,
      `${id}-service`,
      {
        cluster: cluster,
        serviceName: `${id}-next-market-service`,
        maxHealthyPercent: 100,
        minHealthyPercent: 50,
        // Loadbalancer
        loadBalancerName: `${id}next-market-alb`,
        protocol: elasticloadbalancingv2.ApplicationProtocol.HTTP,
        publicLoadBalancer: true,
        assignPublicIp: false,
        listenerPort: 80,
        // Task Definition
        desiredCount: 1,
        cpu: 512,
        memoryLimitMiB: 1024,
        taskImageOptions: {
          image: ecs.ContainerImage.fromAsset(relativeAppPath),
          taskRole: taskRole,
          containerPort: 3000, // default Flask port 5000, Express 3000
        },
      }
    );

    //Target group/Health check
    this.apiService.targetGroup.setAttribute(
      "deregistration_delay.timeout_seconds",
      "5"
    );
    this.apiService.targetGroup.configureHealthCheck({
      path: "/healthcheck",
      healthyThresholdCount: 2,
      unhealthyThresholdCount: 2,
      interval: Duration.seconds(6),
    });
  }
}
