This program reserves the interface `/api/data` for getting data in JSON format.

Example: https://status.lyc8503.net/api/data

Example Response:
```json
{
  "up": 6,    // There're currently 6 up monitors...
  "down": 1,  // ...and 1 down monitors
  "updatedAt": 1719764731, // Last updated timestamp
  "monitors": {
    "www": {               // Key is `id` in config
      "up": true,          // Current status (boolean)
      "latency": 65,       // Latency at last monitor
      "location": "SIN",   // Datacenter used at last monitor
      "message": "OK"      // Description of current status (Error message in case of DOWN)
    },
    "homelab": {
      "up": false,
      "latency": 1896,
      "location": "SJC",
      "message": "HTTP response doesn't contain the configured keyword"
    },
    //......
  }
}
```