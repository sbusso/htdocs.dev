---
title: Open Source Reverse Proxies Compatible with OpenTelemetry for Logs and Metrics
author:
  - Stephane Busso
description: The integration of reverse proxies with OpenTelemetry (OTel) has become a critical requirement for modern observability pipelines. This report evaluates four open-source reverse proxies—NGINX, HAProxy, Caddy, and Envoy—and their compatibility with OpenTelemetry for collecting logs, metrics, and traces. Each solution is analyzed for configuration workflows, data export capabilities, and architectural considerations.
published: true
tags:
  - opentelemetry
  - otlp
  - nginx
  - caddy
  - envoy
  - haproxy
updated: 2025-02-23T09:47
created: 2025-02-23T09:30
cover: 
---
The integration of reverse proxies with OpenTelemetry (OTel) has become a critical requirement for modern observability pipelines. This report evaluates four open-source reverse proxies—**NGINX**, **HAProxy**, **Caddy**, and **Envoy**—and their compatibility with OpenTelemetry for collecting logs, metrics, and traces. Each solution is analyzed for configuration workflows, data export capabilities, and architectural considerations.

## NGINX: Enhanced Tracing via the ngx_otel_module

## Architecture and Use Cases

NGINX, a high-performance web server and reverse proxy, supports distributed tracing through the **ngx_otel_module**. This module enables W3C trace context propagation and exports telemetry data via the OpenTelemetry Protocol (OTLP/gRPC). The setup is ideal for environments where NGINX acts as a reverse proxy for microservices, providing end-to-end visibility into request flows[1](https://signoz.io/blog/opentelemetry-nginx/)[6](https://www.alibabacloud.com/help/doc-detail/2859213.html)[9](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/opentelemetry/).

## Configuration Steps

1. **Module Installation**:  
    Install the `nginx-plus-module-otel` package for supported Linux distributions (e.g., CentOS, Ubuntu). Dynamic loading is enabled via the `nginx.conf` file:
    
    text
    
    `load_module modules/ngx_otel_module.so;`
    
2. **Directive Setup**:  
    Enable tracing in `http`, `server`, or `location` contexts:
    
    text
    
    `http {     otel_exporter {        endpoint otel-collector:4317;    }    server {        location / {            otel_trace on;            otel_trace_context propagate;            proxy_pass http://backend;        }    } }`
    
    - `otel_trace` enables tracing for specific routes.
        
    - `otel_trace_context` handles trace propagation (extract, inject, or ignore headers)[9](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/opentelemetry/).
        
3. **Span Customization**:  
    Attributes like `otel_span_name` and `otel_span_attr` add contextual metadata:
    
    text
    
    `otel_span_name "nginx_proxy"; otel_span_attr "http.method" "$request_method";`
    

## Metrics and Logs

- **Traces**: Full support for distributed tracing with parent-child span relationships.
    
- **Metrics**: Requires integration with Prometheus or OTel Collector’s NGINX receiver (not covered by the native module).
    
- **Logs**: Standard NGINX access/error logs, which can be ingested into OTel via filelog receivers[6](https://www.alibabacloud.com/help/doc-detail/2859213.html)[13](https://help.sumologic.com/docs/integrations/web-servers/opentelemetry/haproxy-opentelemetry/).
    

## HAProxy: Metrics and Logs via OTel Collector

## Integration Workflow

HAProxy, a performant TCP/HTTP load balancer, relies on the OpenTelemetry Collector’s **HAProxy receiver** for metrics and **filelog receiver** for logs[2](https://signoz.io/blog/opentelemetry-haproxy-metrics-and-logs-monitoring/)[13](https://help.sumologic.com/docs/integrations/web-servers/opentelemetry/haproxy-opentelemetry/).

1. **Metrics Collection**:
    
    - Expose HAProxy’s built-in statistics endpoint (e.g., `http://haproxy:8000/haproxy?stats`).
        
    - Configure the OTel Collector’s `haproxyreceiver` to scrape metrics:
        
        text
        
        `receivers:   haproxy:    endpoint: "http://haproxy:8000/haproxy?stats" exporters:   otlp:    endpoint: "otel-backend:4317"`
        
        Key metrics include `haproxy_connections_rate` (Gauge) and `haproxy_requests_denied` (Sum)[2](https://signoz.io/blog/opentelemetry-haproxy-metrics-and-logs-monitoring/)[13](https://help.sumologic.com/docs/integrations/web-servers/opentelemetry/haproxy-opentelemetry/).
        
2. **Log Collection**:
    
    - HAProxy writes logs to `/var/log/haproxy.log`.
        
    - Use the Collector’s `filelog` receiver:
        
        text
        
        `receivers:   filelog:    include: [/var/log/haproxy.log]`
        

## Limitations

- **Tracing**: No native support for distributed tracing. Requires manual instrumentation or sidecar proxies.
    
- **Authentication**: HAProxy’s stats endpoint lacks OAuth/MTLS support, necessitating network-level security[2](https://signoz.io/blog/opentelemetry-haproxy-metrics-and-logs-monitoring/)[7](https://discourse.haproxy.org/t/installation-steps-ha-proxy-as-reverse-proxy/2169).
    

## Caddy: Native OpenTelemetry Tracing Directives

## Built-in OTel Integration

Caddy’s **tracing directive** enables automatic trace propagation and export via OTLP/gRPC. It supports W3C tracecontext and baggage headers, making it suitable for API gateways and edge proxies[14](https://caddyserver.com/docs/caddyfile/directives/tracing)[5](https://www.reddit.com/r/selfhosted/comments/1coa0qr/looking_to_reverse_proxy_services_within_a_local/)[16](https://forum.opnsense.org/index.php?topic=38714.0).

## Configuration Example

text

`example.com {     tracing {        span_name "caddy_proxy"    }    reverse_proxy localhost:8080 }`

- **Environment Variables**: Configure exporters using OTel standards (e.g., `OTEL_EXPORTER_OTLP_ENDPOINT`)[14](https://caddyserver.com/docs/caddyfile/directives/tracing).
    
- **Logs**: Access logs include `traceID` and `spanID` fields, correlatable with OTel backends.
    

## Layer 4 Proxying

For non-HTTP protocols (e.g., MQTT), Caddy’s **Layer 4 proxy** routes raw TCP/UDP traffic while still exporting spans[3](https://www.reddit.com/r/opnsense/comments/1fw6891/mqtt_reverse_proxy_with_caddy_gui_of_opnsense/)[14](https://caddyserver.com/docs/caddyfile/directives/tracing):

text

`tcp://mqtt.example.com {     tracing {        span_name "mqtt_proxy"    }    reverse_proxy 10.0.0.5:1883 }`

## Limitations

- **Metrics**: No native metric export; requires third-party plugins or sidecar collectors.
    
- **Advanced Tracing**: Custom spans (e.g., database calls) need manual instrumentation[11](https://caddy.community/t/add-opentelemetry-tracing-support/13663)[14](https://caddyserver.com/docs/caddyfile/directives/tracing).
    

## Envoy: Cloud-Native Observability with OTel

## Tracing Configuration

Envoy, a cloud-native proxy, supports OpenTelemetry through its **http_connection_manager** filter. The setup is ideal for service meshes and Kubernetes ingress[4](https://opentelemetry.io/docs/demo/services/frontend-proxy/).

## YAML Snippet

text

`static_resources:   listeners:    - filters:        - name: envoy.filters.network.http_connection_manager          typed_config:            "@type": type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager            tracing:              provider:                name: envoy.tracers.opentelemetry                typed_config:                  "@type": type.googleapis.com/envoy.config.trace.v3.OpenTelemetryConfig                  grpc_service:                    envoy_grpc:                      cluster_name: otel-collector`

- **Exporter**: OTLP/gRPC to a Collector cluster.
    
- **Propagation**: B3 and W3C headers are supported.
    

## Metrics and Logs

- **Metrics**: Envoy emits built-in metrics (e.g., `http.downstream_rq_total`) scrapable via Prometheus or OTel[4](https://opentelemetry.io/docs/demo/services/frontend-proxy/)[12](https://traefik.io/traefik/).
    
- **Logs**: Access logs are configurable in JSON format, ingestible via filelog receivers.
    

## Comparative Analysis

|Proxy|Tracing Support|Metrics Collection|Log Collection|Use Cases|
|---|---|---|---|---|
|**NGINX**|Native (ngx_otel_module)|Via Prometheus/OTel|Filelog Receiver|Legacy apps, high-traffic proxies|
|**HAProxy**|Limited (Stats API)|OTel Collector Receiver|Filelog Receiver|TCP load balancing, minimal setup|
|**Caddy**|Native (Directive)|Third-party plugins|Built-in Access Logs|Edge routing, TLS automation|
|**Envoy**|Native (OTel Tracer)|Built-in Metrics|JSON Access Logs|Service meshes, Kubernetes ingress|

## Conclusion and Recommendations

1. **NGINX** is optimal for teams requiring deep request-level tracing in heterogeneous environments.
    
2. **HAProxy** suits high-throughput TCP workloads where metrics are prioritized over traces.
    
3. **Caddy** simplifies TLS and Layer 4 proxying with zero-config OTel tracing.
    
4. **Envoy** excels in cloud-native ecosystems with native integration into service meshes.
    

For full observability, combine proxies with the OpenTelemetry Collector to unify logs, metrics, and traces. Future work should explore Traefik’s OTel compatibility and eBPF-based tracing for kernel-level insights.

### Citations:

1. [https://signoz.io/blog/opentelemetry-nginx/](https://signoz.io/blog/opentelemetry-nginx/)
2. [https://signoz.io/blog/opentelemetry-haproxy-metrics-and-logs-monitoring/](https://signoz.io/blog/opentelemetry-haproxy-metrics-and-logs-monitoring/)
3. [https://www.reddit.com/r/opnsense/comments/1fw6891/mqtt_reverse_proxy_with_caddy_gui_of_opnsense/](https://www.reddit.com/r/opnsense/comments/1fw6891/mqtt_reverse_proxy_with_caddy_gui_of_opnsense/)
4. [https://opentelemetry.io/docs/demo/services/frontend-proxy/](https://opentelemetry.io/docs/demo/services/frontend-proxy/)
5. [https://www.reddit.com/r/selfhosted/comments/1coa0qr/looking_to_reverse_proxy_services_within_a_local/](https://www.reddit.com/r/selfhosted/comments/1coa0qr/looking_to_reverse_proxy_services_within_a_local/)
6. [https://www.alibabacloud.com/help/doc-detail/2859213.html](https://www.alibabacloud.com/help/doc-detail/2859213.html)
7. [https://discourse.haproxy.org/t/installation-steps-ha-proxy-as-reverse-proxy/2169](https://discourse.haproxy.org/t/installation-steps-ha-proxy-as-reverse-proxy/2169)
8. [https://caddy.community/t/tracing-configuration-for-insecure-grpc-opentelemetry-backend-like-jaeger-all-in-one/16764](https://caddy.community/t/tracing-configuration-for-insecure-grpc-opentelemetry-backend-like-jaeger-all-in-one/16764)
9. [https://docs.nginx.com/nginx/admin-guide/dynamic-modules/opentelemetry/](https://docs.nginx.com/nginx/admin-guide/dynamic-modules/opentelemetry/)
10. [https://www.haproxy.com/blog/fundamentals-high-availability-and-the-role-of-a-reverse-proxy](https://www.haproxy.com/blog/fundamentals-high-availability-and-the-role-of-a-reverse-proxy)
11. [https://caddy.community/t/add-opentelemetry-tracing-support/13663](https://caddy.community/t/add-opentelemetry-tracing-support/13663)
12. [https://traefik.io/traefik/](https://traefik.io/traefik/)
13. [https://help.sumologic.com/docs/integrations/web-servers/opentelemetry/haproxy-opentelemetry/](https://help.sumologic.com/docs/integrations/web-servers/opentelemetry/haproxy-opentelemetry/)
14. [https://caddyserver.com/docs/caddyfile/directives/tracing](https://caddyserver.com/docs/caddyfile/directives/tracing)
15. [https://opentelemetry.io/docs/languages/js/exporters/](https://opentelemetry.io/docs/languages/js/exporters/)
16. [https://forum.opnsense.org/index.php?topic=38714.0](https://forum.opnsense.org/index.php?topic=38714.0)
17. [https://opentelemetry.io/blog/2022/instrument-nginx/](https://opentelemetry.io/blog/2022/instrument-nginx/)
18. [https://www.f5.com/company/blog/nginx/nginx-tutorial-opentelemetry-tracing-understand-microservices](https://www.f5.com/company/blog/nginx/nginx-tutorial-opentelemetry-tracing-understand-microservices)
19. [https://help.sumologic.com/docs/integrations/web-servers/opentelemetry/nginx-opentelemetry/](https://help.sumologic.com/docs/integrations/web-servers/opentelemetry/nginx-opentelemetry/)
20. [https://microsoft.github.io/reverse-proxy/articles/distributed-tracing.html](https://microsoft.github.io/reverse-proxy/articles/distributed-tracing.html)
21. [https://github.com/haproxy/haproxy/issues/1640](https://github.com/haproxy/haproxy/issues/1640)
22. [https://www.loadbalancer.org/blog/haproxy-reverse-proxy-the-what-when-and-how/](https://www.loadbalancer.org/blog/haproxy-reverse-proxy-the-what-when-and-how/)
23. [https://www.honeycomb.io/blog/demo-app-opentelemetry-instrumentation-honeycomb](https://www.honeycomb.io/blog/demo-app-opentelemetry-instrumentation-honeycomb)
24. [https://opentelemetry.io/ecosystem/registry/](https://opentelemetry.io/ecosystem/registry/)
25. [https://github.com/open-telemetry/opentelemetry-collector-contrib/issues/24921](https://github.com/open-telemetry/opentelemetry-collector-contrib/issues/24921)
26. [https://coralogix.com/blog/ship-opentelemetry-data-to-coralogix-via-reverse-proxy-caddy-2/](https://coralogix.com/blog/ship-opentelemetry-data-to-coralogix-via-reverse-proxy-caddy-2/)
27. [https://www.linkedin.com/posts/sonika-singh-a990a314b_ship-opentelemetry-data-to-coralogix-via-activity-7084045353502543873-Mcg1](https://www.linkedin.com/posts/sonika-singh-a990a314b_ship-opentelemetry-data-to-coralogix-via-activity-7084045353502543873-Mcg1)
28. [https://caddyserver.com/docs/modules/http.handlers.tracing](https://caddyserver.com/docs/modules/http.handlers.tracing)
29. [https://github.com/caddyserver/caddy/issues/6483/linked_closing_reference](https://github.com/caddyserver/caddy/issues/6483/linked_closing_reference)
