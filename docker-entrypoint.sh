#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  REACT_APP_API_URL: "$REACT_APP_API_URL",
  FILE_CHUNK_SIZE: "$FILE_CHUNK_SIZE",
  STRIPE_PUBLIC_KEY: "$STRIPE_PUBLIC_KEY"
};
EOF

exec "$@"
