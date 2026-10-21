# Community Library: book reservations (web)

Next.js frontend for the Community Library reservation service.

All API calls run in the browser (client component in `app/reservations.js`).
The API base URL comes from `NEXT_PUBLIC_API_URL`, with no trailing slash, for example
`https://abc123.execute-api.ap-south-1.amazonaws.com`.

```bash
npm install
NEXT_PUBLIC_API_URL=https://your-api.example.com npm run dev
```

`NEXT_PUBLIC_*` values are baked in at build time, so set the variable before building.
