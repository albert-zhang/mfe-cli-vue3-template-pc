FROM registryaws.mxj360.com/base/nginx-node:v2
COPY docker/bootstrap /etc/
COPY .env /etc/bootstrap/
COPY .env.production /etc/bootstrap/
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html
