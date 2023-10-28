import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'

import { createRoot } from 'react-dom'

const queryClient = new QueryClient();


createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
);

