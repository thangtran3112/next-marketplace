#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { EcsAlbStack } from "../lib/ecs-alb-stack";
import { VpcStack } from "../lib/vpc-stack";
const envAws = { account: "058264215087", region: "us-west-2" };

const app = new cdk.App();
const vpcStack = new VpcStack(app, "NextMarketVpc", {
  env: envAws,
});

new EcsAlbStack(app, "NextMarketEcs", {
  vpc: vpcStack.vpc,
  env: envAws,
});
