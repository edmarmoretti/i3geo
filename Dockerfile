FROM i3geo/software-base:latest
RUN mkdir /var/www/i3geo && \
    chgrp -R 0 /var/log/apache2 && \
    chmod -R g+rwX /var/log/apache2 && \
    chgrp -R 0 /var/lock/apache2 && \
    chmod -R g+rwX /var/lock/apache2 && \
    chgrp -R 0 /var/run/apache2 && \
    chmod -R g+rwX /var/run/apache2 && \
    touch /var/www/index.php && \
    chmod -R 555 /var/www && \
    ln -sf /proc/self/fd/1 /var/log/apache2/error.log
COPY . /var/www/i3geo
CMD ["apachectl", "-D", "FOREGROUND"]
EXPOSE 8080
USER 1001
