# Network Setup Guide

## Problem
When you run `php artisan serve --port=9000` on your PC, it works fine. But when your friend runs it on their PC and tries to login, they get a server error.

## Root Cause
By default, `php artisan serve` binds to `127.0.0.1` (localhost), which means it's only accessible from the same machine. When someone tries to access it from a different machine on the network, they can't reach it.

## Solution

### Step 1: Run Laravel Server on Network Interface

Instead of:
```bash
php artisan serve --port=9000
```

Use:
```bash
php artisan serve --host=0.0.0.0 --port=9000
```

The `--host=0.0.0.0` flag makes the server accessible from any network interface, allowing other devices on the same network to connect.

### Step 2: Find Your IP Address

**On Windows:**
```bash
ipconfig
```
Look for "IPv4 Address" under your active network adapter (usually something like `192.168.1.100` or `10.0.0.5`)

**On Mac/Linux:**
```bash
ifconfig
# or
ip addr
```
Look for your local IP address (usually starts with `192.168.` or `10.`)

### Step 3: Update Frontend Configuration

1. Open `frontend/scripts/config.js`
2. Change the `API_BASE_URL` to use the server's IP address:

```javascript
// Replace [SERVER_IP] with the actual IP address from Step 2
const API_BASE_URL = "http://192.168.1.100:9000/api";
```

**Example:**
- If your friend's IP is `192.168.1.150`, use: `"http://192.168.1.150:9000/api"`
- If your IP is `10.0.0.5`, use: `"http://10.0.0.5:9000/api"`

### Step 4: Share Configuration

**Option A: Each person uses their own IP**
- Each person updates `config.js` with their own IP address
- Each person runs: `php artisan serve --host=0.0.0.0 --port=9000`

**Option B: One central server**
- One person runs the backend server with `--host=0.0.0.0`
- Everyone updates `config.js` to use that person's IP address
- Everyone uses the same backend server

## Security Note

⚠️ **Warning:** Running `--host=0.0.0.0` makes your server accessible to anyone on your local network. Only use this in trusted network environments (like your home/office network). Never use this on public Wi-Fi networks.

For production, use a proper web server (Apache/Nginx) with proper security configurations.

## Troubleshooting

### Can't connect from another machine?

1. **Check firewall:** Make sure Windows Firewall (or your OS firewall) allows connections on port 9000
2. **Check network:** Make sure both devices are on the same network (same Wi-Fi/router)
3. **Check IP:** Verify the IP address is correct using `ipconfig`/`ifconfig`
4. **Test connection:** Try accessing `http://[SERVER_IP]:9000` directly in a browser from the other machine

### Still having issues?

- Make sure Laravel CORS is configured to allow requests from your frontend origin
- Check Laravel logs: `storage/logs/laravel.log`
- Check browser console for CORS errors

## Quick Reference

**Backend (on server machine):**
```bash
php artisan serve --host=0.0.0.0 --port=9000
```

**Frontend config.js:**
```javascript
const API_BASE_URL = "http://[SERVER_IP]:9000/api";
```

**Find IP:**
- Windows: `ipconfig`
- Mac/Linux: `ifconfig` or `ip addr`

