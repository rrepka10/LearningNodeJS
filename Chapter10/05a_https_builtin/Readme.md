# Running this sample:

To generate the two certificate files, run the following three Linux commands:

    openssl genrsa -out privkey.pem 2048
    openssl req -new -key privkey.pem -out certreq.csr
    openssl x509 -req -days 3650 -in certreq.csr -signkey privkey.pem -out newcert.pem

Which will produce:   newcert.pem  privkey.pem