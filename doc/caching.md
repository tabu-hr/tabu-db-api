# Caching Strategy

The application uses Redis for caching frequently accessed data. This document outlines the caching implementation and configuration.

## Cache Configuration

- **Default Expiration**: 1 hour (3600 seconds)
- **Custom Durations**:
  - Tables list: 1 hour
  - User data: 30 minutes
  - Submission data: 30 minutes
  - Salary data: 30 minutes

## Cache Keys

Cache keys are prefixed with 'tabu:' and include the endpoint path:
- Tables: `tabu:tables:/api/tables`
- User data: `tabu:user:/api/user`
- etc.

## Monitoring

Cache statistics are available through the `/api/system/cache-stats` endpoint, providing:
- Memory usage
- Connection statistics
- Cache hits/misses

## Cache Invalidation

The cache is automatically invalidated when:
- The expiration time is reached
- The application manually clears specific cache entries

## Docker Integration

Redis runs in a separate container and persists data using Docker volumes.