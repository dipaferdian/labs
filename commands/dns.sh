# run DNS Resolver
sudo apt install unbound -y

# check unbound service status
sudo systemctl status unbound

# restart unbound service
sudo systemctl restart unbound

# run Authoritative DNS Server
sudo apt install bind9 bind9-utils dnsutils -y

# run Root Trust Anchor Unbound
sudo apt install unbound-anchor

# check unbound-anchor command version
command -v unbound-anchor

# Update Root Trust Anchor
sudo -u unbound unbound-anchor -a /var/lib/unbound/root.key

# check root.key file
sudo cat /var/lib/unbound/root.key

# restart bind9 service
sudo systemctl restart bind9

# create configuration zone file
sudo nano /etc/bind/named.conf.local

# create zone file
sudo nano /etc/bind/db.lab.test

# validate zone file
sudo named-checkconf
sudo named-checkzone lab.test /etc/bind/db.lab.test

# create configuration for unbound resolver
sudo nano /etc/unbound/unbound.conf.d/local-resolver.conf