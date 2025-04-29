# @workspace/api-client

This package contains shared utilities and functions for the monorepo.

## Installation

This package is part of the monorepo and does not need to be installed separately.

## Usage

### API Client

```typescript
import { apiClient } from '@workspace/@workspace/api-client';

async function fetchData() {
  const data = await apiClient('/api/example');
  console.log(data);
}