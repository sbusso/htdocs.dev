---
created: 2023-12-15T12:46
updated: 2023-12-18T00:23
published: true
---

DISCLAIMER: not the recommended way, AMPQ is much more scalable.

### Step 1: Install Filebeat on Rocky Linux

```sh
curl -L -O https://artifacts.elastic.co/downloads/beats/filebeat/filebeat-8.11.3-x86_64.rpm
sudo rpm -vi filebeat-8.11.3-x86_64.rpm
```

### Step 2: Configure Filebeat

1. **Create a Log File from Command Output**:
    - Filebeat cannot directly read from a command output. You need to redirect the output of your command to a log file.
    - Use a command like `nohup tailer --tail  > /var/log/kumomta.log &` to keep it running in the background and writing to a log file.
2. **Edit Filebeat Configuration**:

Edit the Filebeat configuration file located at `/etc/filebeat/filebeat.yml`:
```bash
sudo nano /etc/filebeat/filebeat.yml
```

Configure it to tail the log file you're writing to. For example:
```bash
filebeat.inputs:
- type: log
  enabled: true
  paths:
    - /var/log/kumomta.log
```
