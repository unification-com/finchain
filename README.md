# Finchain Demo

Docker and Docker Compose are required to run the Finchain demo.

Run the demo using:

```bash
make
```

## Docker network issues

By default, the demo uses the `172.25.1.0/24` subnet. If this subnet overlaps with your own, run:

```bash
ifconfig
```

and look for a line for your connection similar to:

```bash
inet addr:192.168.1.2  Bcast:192.168.1.255  Mask:255.255.255.0
```

Look for the `network` (first 3 parts of the IP address) 
value of `inet addr`. This is your current subnet. In the example above, this is `192.168.1`.

Then set the SUBNET_IP variable to any other subnet. For example, run: 

```bash
SUBNET_IP=192.168.1 make
```

to run the demo on the `192.168.1.0/24` subnet

## WRKChain: Finchain Info

Network ID: 2339117895  

Block Explorer: http://localhost:8081

JSON RPC: http://localhost:8547

WRKChain Block Validation UI: http://localhost:4040


## Local UND Mainchain devnet

Network ID: 50010  

Block Explorer: http://localhost:8080

JSON RPC: http://localhost:8101
