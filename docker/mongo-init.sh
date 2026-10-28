
#!/bin/bash
set -e

echo "Waiting for MongoDB..."

until mongosh --host mongo:27017 --quiet \
  --eval "db.adminCommand('ping').ok" >/dev/null 2>&1; do
  sleep 2
done

echo "Initializing Replica Set if needed..."

mongosh --host mongo:27017 --quiet --eval '
try {
  rs.status();
  print("Replica Set already initialized");
} catch (error) {
  if (error.codeName !== "NotYetInitialized") throw error;
  rs.initiate({
    _id: "rs0",
    members: [
      { _id: 0, host: "mongo:27017" }
    ]
  });
}
'

echo "Waiting for MongoDB primary..."

until mongosh --host mongo:27017 --quiet \
  --eval "db.hello().isWritablePrimary" | grep -q true; do
  sleep 2
done

echo "Replica Set is ready."
