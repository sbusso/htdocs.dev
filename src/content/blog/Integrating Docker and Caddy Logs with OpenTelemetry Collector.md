---
title: "Integrating Docker and Caddy Logs with OpenTelemetry Collector: A Comprehensive Guide"
author:
  - Stephane Busso
description: The integration of Docker and Caddy logs into an OpenTelemetry Collector requires a systematic approach that leverages containerization best practices, structured logging configurations, and OpenTelemetry’s flexible data collection capabilities
published: true
tags:
  - caddy
  - opentelemetry
updated: 2025-02-23T15:16
created: 2025-02-23T15:12
cover: 
---
The integration of Docker and Caddy logs into an OpenTelemetry Collector requires a systematic approach that leverages containerization best practices, structured logging configurations, and OpenTelemetry’s flexible data collection capabilities. This guide provides a detailed methodology for extracting, processing, and exporting logs from Docker containers and Caddy servers to an OpenTelemetry Collector, ensuring observability across distributed systems.

## Key Findings Summary

To achieve seamless log integration:

1. **Docker Logs**: Configure Docker’s JSON logging driver to write logs to `/var/lib/docker/containers`, then use OpenTelemetry’s `filelog` receiver to collect and parse these logs[6](https://lantern.splunk.com/Data_Descriptors/Docker/Getting_Docker_log_data_into_Splunk_Cloud_Platform_with_OpenTelemetry)[10](https://quickwit.io/docs/0.6.5/log-management/send-logs/send-docker-logs).
    
2. **Caddy Logs**: Enable Caddy’s HTTP request logging in the `Caddyfile`, format logs as JSON for machine readability, and route logs to a shared Docker volume accessible by the Collector[7](https://betterstack.com/community/guides/logging/caddy-logging/)[8](https://caddyserver.com/docs/caddyfile/directives/tracing).
    
3. **OpenTelemetry Collector**: Deploy the Collector as a Docker service with volume mounts for log directories, using pipelines to process Docker/Caddy logs and export them via OTLP/gRPC[4](https://last9.io/blog/opentelemetry-collector-with-docker/)[10](https://quickwit.io/docs/0.6.5/log-management/send-logs/send-docker-logs).
    
4. **Trace Correlation**: Implement Caddy’s `tracing` directive to inject OpenTelemetry-compatible trace IDs into logs, enabling cross-service correlation in observability platforms[8](https://caddyserver.com/docs/caddyfile/directives/tracing)[14](https://caddy.community/t/tracing-directive/23638).
    

## Docker Log Management for OpenTelemetry

## Docker Log Configuration

Docker containers emit logs to `stdout` and `stderr` by default, stored as JSON files in `/var/lib/docker/containers/<container-id>/<container-id>-json.log`. To optimize for OpenTelemetry:

1. **JSON Log Driver**: Ensure Docker uses the `json-file` driver with metadata enrichment:
    
    text
    
    `# docker-compose.yml   services:   caddy:    logging:      driver: json-file      options:        tag: "{{.Name}}|{{.ImageName}}|{{.ID}}"`
    
    This adds container name, image, and ID to each log entry, facilitating later parsing[6](https://lantern.splunk.com/Data_Descriptors/Docker/Getting_Docker_log_data_into_Splunk_Cloud_Platform_with_OpenTelemetry)[10](https://quickwit.io/docs/0.6.5/log-management/send-logs/send-docker-logs).
    
2. **Log Retention**: Limit log file size to prevent disk exhaustion:
    
    text
    
    `options:   max-size: "10m"  max-file: "3"`
    

## OpenTelemetry Collector Configuration

Deploy the Collector as a Docker service with access to Docker logs:

1. **Volume Mount**: Share the host’s Docker logs directory with the Collector:
    
    text
    
    `services:   otel-collector:    volumes:      - /var/lib/docker/containers:/var/lib/docker/containers:ro`
    
2. **Filelog Receiver**: Configure the Collector to tail Docker logs:
    
    text
    
    `receivers:   filelog:    include: [/var/lib/docker/containers/*/*-json.log]    operators:      - type: json_parser        timestamp:          parse_from: attributes.time          layout: '%Y-%m-%dT%H:%M:%S.%LZ'      - type: move        from: attributes.log        to: body`
    
    This extracts the log message body and parses timestamps[10](https://quickwit.io/docs/0.6.5/log-management/send-logs/send-docker-logs)[6](https://lantern.splunk.com/Data_Descriptors/Docker/Getting_Docker_log_data_into_Splunk_Cloud_Platform_with_OpenTelemetry).
    

## Caddy Server Log Integration

## Enabling Structured Logging

Caddy’s default logs omit HTTP requests. Enable access logging in the `Caddyfile`:

text

`example.com {     log {        output file /var/log/caddy/access.log        format json    } }`

This writes JSON-formatted access logs to `/var/log/caddy/access.log`, including fields like `request duration` and `response status`[7](https://betterstack.com/community/guides/logging/caddy-logging/).

## Enriching Logs with Tracing Context

Activate Caddy’s OpenTelemetry integration to inject trace IDs:

text

`tracing {     span http_request } log {     format json {        time_format "iso8601"        trace_id {http.vars.trace_id}        span_id {http.vars.span_id}    } }`

This appends OpenTelemetry `trace_id` and `span_id` to logs, enabling correlation with distributed traces[8](https://caddyserver.com/docs/caddyfile/directives/tracing)[14](https://caddy.community/t/tracing-directive/23638).

## Docker Volume for Log Sharing

Mount a persistent volume for Caddy logs:

text

`services:   caddy:    volumes:      - caddy-logs:/var/log/caddy   otel-collector:    volumes:      - caddy-logs:/var/log/caddy:ro volumes:   caddy-logs:`

This allows the Collector to read Caddy logs without direct host access[1](https://www.reddit.com/r/selfhosted/comments/sp8v0e/redirect_logs_from_caddyserver_to_crowdsec_in/)[10](https://quickwit.io/docs/0.6.5/log-management/send-logs/send-docker-logs).

## OpenTelemetry Collector Deployment

## Pipeline Configuration

Define a log processing pipeline in `otel-collector-config.yaml`:

text

`receivers:   filelog:    include:      - /var/lib/docker/containers/*/*-json.log      - /var/log/caddy/access.log    operators:      # Docker log parsing      - type: json_parser        id: docker_parser        timestamp:          parse_from: attributes.time          layout: '%Y-%m-%dT%H:%M:%S.%LZ'      - type: remove        field: attributes.time       # Caddy log parsing      - type: json_parser        id: caddy_parser        parse_from: body processors:   batch:    timeout: 5s exporters:   otlp:    endpoint: "otel-backend:4317"    tls:      insecure: true service:   pipelines:    logs:      receivers: [filelog]      processors: [batch]      exporters: [otlp]`

## Docker Compose Deployment

Orchestrate services with Docker Compose:

text

`version: '3' services:   caddy:    image: caddy:latest    volumes:      - ./Caddyfile:/etc/caddy/Caddyfile      - caddy-logs:/var/log/caddy    ports:      - "80:80"   otel-collector:    image: otel/opentelemetry-collector-contrib:latest    command: ["--config=/etc/otel/config.yaml"]    volumes:      - ./otel-collector-config.yaml:/etc/otel/config.yaml      - /var/lib/docker/containers:/var/lib/docker/containers:ro      - caddy-logs:/var/log/caddy:ro volumes:   caddy-logs:`

## Advanced Considerations

## Log Sampling and Filtering

Reduce noise by sampling logs in the Collector:

text

`processors:   probabilistic_sampler:    sampling_percentage: 20`

Apply to non-critical logs to decrease volume[4](https://last9.io/blog/opentelemetry-collector-with-docker/).

## Multi-Line Log Parsing

For non-JSON logs, use `multiline` operators:

text

`operators:   - type: multiline    line_start_pattern: '^\d{4}-\d{2}-\d{2}'`

This aggregates stack traces into single log entries[2](https://coralogix.com/docs/opentelemetry/configuration-options/opentelemetry-using-docker/)[5](https://opentelemetry.io/blog/2024/otel-collector-container-log-parser/).

## Security Hardening

1. **Role-Based Access**: Restrict Collector service permissions in Docker:
    
    text
    
    `otel-collector:   user: "1000:1000"  read_only: true`
    
2. **TLS Encryption**: Secure OTLP exports with certificates:
    
    text
    
    `exporters:   otlp:    tls:      cert_file: /etc/otel/certs/client.crt      key_file: /etc/otel/certs/client.key`
    

## Conclusion

Integrating Docker and Caddy logs with OpenTelemetry involves:

1. Configuring Docker and Caddy to emit structured logs with metadata.
    
2. Deploying the OpenTelemetry Collector with tailored filelog receivers.
    
3. Correlating logs with traces via Caddy’s OpenTelemetry integration.
    

For production systems, augment this base with log sampling, alerting pipelines, and secured OTLP exports. The provided configurations offer a foundation for full-stack observability, adaptable to Prometheus, Jaeger, or commercial backends.

### Citations:

1. [https://www.reddit.com/r/selfhosted/comments/sp8v0e/redirect_logs_from_caddyserver_to_crowdsec_in/](https://www.reddit.com/r/selfhosted/comments/sp8v0e/redirect_logs_from_caddyserver_to_crowdsec_in/)
2. [https://coralogix.com/docs/opentelemetry/configuration-options/opentelemetry-using-docker/](https://coralogix.com/docs/opentelemetry/configuration-options/opentelemetry-using-docker/)
3. [https://grafana.com/docs/grafana-cloud/monitor-infrastructure/kubernetes-monitoring/configuration/helm-chart-config/otel-collector/](https://grafana.com/docs/grafana-cloud/monitor-infrastructure/kubernetes-monitoring/configuration/helm-chart-config/otel-collector/)
4. [https://last9.io/blog/opentelemetry-collector-with-docker/](https://last9.io/blog/opentelemetry-collector-with-docker/)
5. [https://opentelemetry.io/blog/2024/otel-collector-container-log-parser/](https://opentelemetry.io/blog/2024/otel-collector-container-log-parser/)
6. [https://lantern.splunk.com/Data_Descriptors/Docker/Getting_Docker_log_data_into_Splunk_Cloud_Platform_with_OpenTelemetry](https://lantern.splunk.com/Data_Descriptors/Docker/Getting_Docker_log_data_into_Splunk_Cloud_Platform_with_OpenTelemetry)
7. [https://betterstack.com/community/guides/logging/caddy-logging/](https://betterstack.com/community/guides/logging/caddy-logging/)
8. [https://caddyserver.com/docs/caddyfile/directives/tracing](https://caddyserver.com/docs/caddyfile/directives/tracing)
9. [https://docs.docker.com/engine/cli/otel/](https://docs.docker.com/engine/cli/otel/)
10. [https://quickwit.io/docs/0.6.5/log-management/send-logs/send-docker-logs](https://quickwit.io/docs/0.6.5/log-management/send-logs/send-docker-logs)
11. [https://betterstack.com/community/guides/logging/docker-logs/](https://betterstack.com/community/guides/logging/docker-logs/)
12. [https://docs.docker.com/build/debug/opentelemetry/](https://docs.docker.com/build/debug/opentelemetry/)
13. [https://github.com/open-telemetry/opentelemetry-demo/blob/main/docker-compose.yml](https://github.com/open-telemetry/opentelemetry-demo/blob/main/docker-compose.yml)
14. [https://caddy.community/t/tracing-directive/23638](https://caddy.community/t/tracing-directive/23638)
15. [https://opentelemetry.io/docs/specs/otel/logs/](https://opentelemetry.io/docs/specs/otel/logs/)
16. [https://www.youtube.com/watch?v=xNrFG_XvmNM](https://www.youtube.com/watch?v=xNrFG_XvmNM)
17. [https://coralogix.com/docs/opentelemetry/getting-started/](https://coralogix.com/docs/opentelemetry/getting-started/)
18. [https://dev.to/tingwei628/how-to-build-a-logging-pipeline-with-opentelemetry-grafana-loki-and-grafana-in-docker-compose-4kk](https://dev.to/tingwei628/how-to-build-a-logging-pipeline-with-opentelemetry-grafana-loki-and-grafana-in-docker-compose-4kk)
19. [https://betterstack.com/community/guides/logging/php-logging-opentelemetry/](https://betterstack.com/community/guides/logging/php-logging-opentelemetry/)
20. [https://caddy.community/t/log-configuration-in-docker-docker-log-behavior/13106](https://caddy.community/t/log-configuration-in-docker-docker-log-behavior/13106)
21. [https://caddy.community/t/how-to-log-outgoing-requests/8072](https://caddy.community/t/how-to-log-outgoing-requests/8072)
22. [https://github.com/caddyserver/caddy/issues/4804](https://github.com/caddyserver/caddy/issues/4804)
23. [https://opentelemetry.io/docs/collector/quick-start/](https://opentelemetry.io/docs/collector/quick-start/)
24. [https://github.com/open-telemetry/opentelemetry-collector/issues/3460](https://github.com/open-telemetry/opentelemetry-collector/issues/3460)
25. [https://github.com/docker/cli/issues/5061](https://github.com/docker/cli/issues/5061)
26. [https://stackoverflow.com/questions/78661726/how-to-log-traces-in-opentelemetry-collector-to-stdout](https://stackoverflow.com/questions/78661726/how-to-log-traces-in-opentelemetry-collector-to-stdout)
27. [https://techroads.org/building-a-caddy-container-stack-for-easy-https-with-docker-and-ghost/](https://techroads.org/building-a-caddy-container-stack-for-easy-https-with-docker-and-ghost/)
28. [https://www.reddit.com/r/OpenTelemetry/comments/1f9jf02/best_approach_for_logs_management/](https://www.reddit.com/r/OpenTelemetry/comments/1f9jf02/best_approach_for_logs_management/)
29. [https://docs.docker.com/engine/logging/configure/](https://docs.docker.com/engine/logging/configure/)
30. [https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/](https://betterstack.com/community/guides/logging/how-to-start-logging-with-docker/)
31. [https://github.com/open-telemetry/opentelemetry-collector-contrib/issues/8982](https://github.com/open-telemetry/opentelemetry-collector-contrib/issues/8982)
