dig -b 127.0.0.2 -p 15353 @127.0.0.1 www.lab.test

# dns zone transfer using axfr query
dig axfr z.hackycorp.com @z.hackycorp.com

# dns zone transfer using int 
dig axfr int @z.hackycorp.com

# get version of bind using CH TXT query
dig @z.hackycorp.com version.bind CH TXT