#!/bin/sh

# Check if REDIS_USERNAME and REDIS_USER_PASSWORD are set
if [ -z "${REDIS_USERNAME}" ] || [ -z "${REDIS_PASSWORD}" ]; then
    echo "Error: REDIS_USERNAME and REDIS_PASSWORD must be set."
    exit 1
fi

# Create the users.acl file dynamically
cat <<EOF > /data/users.acl
user default on +@all ~* >${REDIS_PASSWORD}
user ${REDIS_USERNAME} on +@all ~* >${REDIS_PASSWORD}
EOF

exec redis-server --requirepass "${REDIS_PASSWORD}" --masterauth "${REDIS_PASSWORD}" --aclfile /data/users.acl --appendonly yes