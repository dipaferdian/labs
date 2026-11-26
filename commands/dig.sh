# syntax
dig [@server] [name] [type] [options]

# Query a specific DNS server on a custom port
dig -b 127.0.0.2 -p 15353 @127.0.0.1 www.lab.test

# dns zone transfer using axfr query
dig axfr z.hackycorp.com @z.hackycorp.com

# dns zone transfer using int 
dig axfr int @z.hackycorp.com

# get version of bind using CH TXT query
dig @z.hackycorp.com version.bind CH TXT

## Find zone
# 1. Start with the hostname
dig hackycorp.com

# 2. Find the SOA record to identify the DNS zone
dig hackycorp.com SOA

# 3. Find the authoritative nameservers for the zone
dig hackycorp.com NS

# 4. Resolve the IP address of an authoritative nameserver
# Replace <nameserver> with a nameserver returned by the previous NS query
dig <nameserver> A

# 5. Query the authoritative nameserver directly for the SOA record
dig @<nameserver> hackycorp.com SOA

# 6. Verify that the server returns an authoritative answer
dig @<nameserver> hackycorp.com A

# Check for the "aa" flag in the response

# 7. Attempt a DNS zone transfer if you are authorized to test the zone
dig @<nameserver> hackycorp.com AXFR