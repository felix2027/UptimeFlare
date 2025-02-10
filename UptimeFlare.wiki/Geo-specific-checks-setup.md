While Cloudflare doesn't officially support specifying the region in which the worker will run, there are some workarounds (refer to [this](https://community.cloudflare.com/t/how-to-run-workers-on-specific-datacenter-colos/385851) and [this](https://community.cloudflare.com/t/how-to-force-region-in-cloudflare-workers/557016)) that can be used to accomplish this.

### How it works

Typically, adding a `proxied` record at Cloudflare ensures that our origin's IP address remains hidden from the public. Instead, the record resolves to an **Anycast IP Address**. This type of IP address is unique as it is shared across multiple Cloudflare Edge datacenters. When a user connects to an **Anycast IP**, they are automatically routed to the nearest datacenter, resulting in reduced latency. However, the use of **Anycast IP** in our worker restricts us from selecting the location for our uptime tests.

Luckily, the Cloudflare network still hosts some geo-specific IPs. These are standard IPs located at a specific datacenter. Although these IPs are not utilized for CDN and are inaccessible directly from the public Internet, we can manually set them as the destination. Workers, being "inside" the Cloudflare network, can access these IPs without any issues.

In our scenario, a cron-triggered worker operates at a random Edge datacenter selected by Cloudflare. However, if we route subrequests to itself via a standard geo-specific IP, we can execute the monitoring job at a datacenter of our preference.


### Setup

1. To implement this approach, you must have an active domain (also known as a zone) on Cloudflare. Please note that this domain is NOT associated with [your status page's domain](https://github.com/lyc8503/UptimeFlare/wiki/Use-your-own-domain-for-status-page-with-CNAME). If you don't possess a domain on Cloudflare, you can register a free domain (for instance, [eu.org](https://nic.eu.org/)). This domain is solely for internal use and won't be visible to others.

   For instance, I am using `lyc8503.eu.org`.

2. The next step is to identify a geo-specific IP address. These IPs fall within the `AS13335` and `8.0.0.0/8` range. I have already downloaded the `Free IP to Country + IP to ASN` database from [ipinfo.io](https://ipinfo.io/) and used `grep '^8\.[0-9]*\.[0-9]*\.0,.*AS13335' country_asn.csv` to filter out [this list](https://github.com/lyc8503/UptimeFlare/files/13610226/cloudflare_ip.txt), saving you the trouble.

   Download the list and select the IP range that suits your needs. For instance, I want to test my homelab from Japan as it's geographically closer to my location (Mainland China), so I search for "Japan" in the list and find 6 available IP ranges.

   ```
   8.34.71.0,8.34.71.255,JP,Japan,AS,Asia,AS13335,"Cloudflare, Inc.",cloudflare.com
   8.25.97.0,8.25.97.255,JP,Japan,AS,Asia,AS13335,"Cloudflare, Inc.",cloudflare.com
   8.34.201.0,8.34.201.255,JP,Japan,AS,Asia,AS13335,"Cloudflare, Inc.",cloudflare.com
   8.27.68.0,8.27.68.255,JP,Japan,AS,Asia,AS13335,"Cloudflare, Inc.",cloudflare.com
   8.37.43.0,8.37.43.255,JP,Japan,AS,Asia,AS13335,"Cloudflare, Inc.",cloudflare.com
   8.38.172.0,8.38.172.255,JP,Japan,AS,Asia,AS13335,"Cloudflare, Inc.",cloudflare.com
   ```

   As not all IPs in the range are accessible, we'll use `nmap` to identify the available IPs. Execute `sudo nmap -sP 8.34.71.0/24` to scan the first `/24` IP range using ICMP ping (these servers don't respond to TCP ping).

   ```
   root@server:~# nmap -sP 8.34.71.0/24
   Starting Nmap 7.80 ( https://nmap.org ) at 2023-12-08 14:28 CST
   Nmap scan report for 8.34.71.1
   Host is up (0.091s latency).
   Nmap done: 256 IP addresses (1 host up) scanned in 9.65 seconds
   ```
   
   We found only one operational IP `8.34.71.1` in `8.34.71.0/24`. However, the first IP (`8.x.x.1`) in a range typically doesn't handle worker requests, and we can't use this range for workers as there's no IP left. So we continue to try `8.25.97.0/24`, `8.34.201.0/24` sequentially... On the third attempt, there're 10 hosts up in `8.34.201.0/24` so we have found 9 available IPs excluding `8.34.201.1`. We just arbitrarily choose `8.34.201.12` in it.

   ```
   root@server:~# nmap -sP 8.34.201.0/24
   Starting Nmap 7.80 ( https://nmap.org ) at 2023-12-08 14:57 CST
   Nmap scan report for 8.34.201.1
   Host is up (0.12s latency).
   Nmap scan report for 8.34.201.3
   Host is up (0.10s latency).
   Nmap scan report for 8.34.201.5
   Host is up (0.12s latency).
   Nmap scan report for 8.34.201.6
   Host is up (0.11s latency).
   Nmap scan report for 8.34.201.7
   Host is up (0.10s latency).
   Nmap scan report for 8.34.201.8
   Host is up (0.10s latency).
   Nmap scan report for 8.34.201.9
   Host is up (0.10s latency).
   Nmap scan report for 8.34.201.10
   Host is up (0.10s latency).
   Nmap scan report for 8.34.201.11
   Host is up (0.12s latency).
   Nmap scan report for 8.34.201.12
   Host is up (0.11s latency).
   Nmap done: 256 IP addresses (10 hosts up) scanned in 6.22 seconds
   ```

3. The final step involves setting up a route for your worker. Begin by navigating to your zone (i.e., the domain you set up in Step 1) in the Cloudflare Dashboard and clicking on `Add route` under the `Workers Route` section.

   ![Workers Route](https://github.com/lyc8503/UptimeFlare/assets/36782264/a654e4f7-01f0-432c-bbfa-104f8e32370e)

   Choose a route prefix that's easy to remember. In this example, we're using `jp` (for Japan). Enter `jp.lyc8503.eu.org/*` for the route and select `uptimeflare_worker` for the worker, then click `Save`.

   ![Route Setup](https://github.com/lyc8503/UptimeFlare/assets/36782264/d2b8f91c-ad3a-4540-8d77-eadeb69baa38)

   Within the same zone, add a proxied DNS A record with `jp` as the name and the geo-specific IP you obtained in Step 2 (`8.34.201.12`) as the content.

   ![DNS Setup](https://github.com/lyc8503/UptimeFlare/assets/36782264/5d74a6de-34df-445a-875a-c4490f3256a1)

   That's it! If you visit the domain you just set up in your browser, you should see a `Remote worker is working...` response. **The URL `https://jp.lyc8503.eu.org/` is what you need to enter in the `checkLocationWorkerRoute` field of the config file.** The protocol (`http` or `https`) will depend on your zone settings. You can easily verify this by visiting the URL in your browser and noting which protocol your browser uses.

   **UPDATE**: If you encounter "Too many redirects" error after setting up, you may have to disable "Always Use HTTPS" option in your zone. Refer to [#7](https://github.com/lyc8503/UptimeFlare/issues/7).

