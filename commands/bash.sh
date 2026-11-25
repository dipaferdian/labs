# generate subdomains
for i in `seq 0 155`; do
    printf "0x%02x.a.hackycorp.com\n" "$i"
done > /home/alo-dipaferdian/works/personal/labs/hosts/subdomain.txt

# check last 10 subdomain result
tail subdomain.txt 

# change run folder location recon.sh
alias recon.sh="path/recon.sh"

# run curl by specific subdomain
for i in `cat /home/alo-dipaferdian/works/personal/labs/hosts/subdomain.txt`; do
    curl $i/logo.png -o $i.png
done

# run curl by  changing host header with resolve and display response headers and body
ip="51.158.147.132"
host="admin.hackycorp.com"

curl -k -i \
    --resolve "www.hackycorp.com:443:$ip" \
    -H "Host: $host" \
    https://www.hackycorp.com/

# loop curl request to balancer.hackycorp.com
for i in $(seq 1 10); do
    curl -i -X GET balancer.hackycorp.com
    echo "----------------------------"
done