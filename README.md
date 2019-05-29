# Finchain Demo

Docker and Docker Compose are required to run the Finchain demo.

Copy `docker.env` to `.env`:

```bash
cp docker.env .env
```

Edit the Subnet as required. Default is `172.25.1`. if you're having issues 
with Docker networking and the default subnet, run:

```bash
ifconfig
```

and look for a line for your connection similar to:

```bash
inet addr:192.168.1.2  Bcast:172.25.0.255  Mask:255.255.255.0
```

Edit the `.env` file, setting it to the `network` (first 3 parts of the IP address) 
value of `inet addr`. In the example above, this is `192.168.1`

Run the demo using:

```bash
make
```

## WRKChain: Finchain Info

Network ID: 2339117895  

Block Explorer: http://localhost:8081

JSON RPC: http://localhost:8547

WRKChain Block Validation UI: http://localhost:4040


## Local UND Mainchain devnet

Network ID: 50010  

Block Explorer: http://localhost:8080

JSON RPC: http://localhost:8101
