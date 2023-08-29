# tsgal

Quick and dirty image gallery using Photoswipe, yall, sharp, and ejs.

## usage

```shell
npm init -y
npm install
npx webpack
node make-template.js --imageDir /path/to/images > images.html
```

## web server

Nginx example:

```
server {
    listen 0.0.0.0:443 ssl;
    include /etc/nginx/ssl.conf;
    http2 on;

    root /var/www/tsgal;
    location / { 
        try_files $uri $uri/ =404;
    }   
}
```

## notes

* Image [lazy loading](https://web.dev/browser-level-image-lazy-loading/) is baked into browsers by default these days:

    `<img loading="lazy" />`
