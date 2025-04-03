#!/bin/sh

cat <<EOF > /usr/share/nginx/html/env.js
window.__ENV__ = {
  REACT_APP_API_URL: "$REACT_APP_API_URL"
};
EOF

exec "$@"