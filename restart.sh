#!/bin/sh

sudo systemctl restart mongod
sudo systemctl restart nginx
sudo systemctl restart uwsgi
sudo systemctl enable uwsgi
