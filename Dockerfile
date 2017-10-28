FROM i3geo/software-base:latest
RUN mkdir /var/www/i3geo && \
    cd /var/www && \
    ln -s /tmp/ms_tmp ms_tmp && \
    chgrp -R 0 /var/log/apache2 && \
    chmod -R g+rwX /var/log/apache2 && \
    chgrp -R 0 /var/lock/apache2 && \
    chmod -R g+rwX /var/lock/apache2 && \
    chgrp -R 0 /var/run/apache2 && \
    chmod -R g+rwX /var/run/apache2 && \
    chmod -R 555 /var/www && \
    # ln -sf /proc/self/fd/1 /var/log/apache2/access.log && \
    ln -sf /proc/self/fd/1 /var/log/apache2/error.log
COPY . /var/www/i3geo
COPY ./docker/000-default.conf /etc/apache2/sites-available/
COPY ./docker/php.ini /etc/php/5.6/apache2/
COPY ./docker/ports.conf /etc/apache2/
CMD ["apachectl", "-D", "FOREGROUND"]
EXPOSE 8080
USER 1001