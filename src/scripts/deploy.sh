cd /home/ghouse-dev/backend-drf
git pull origin dev
source .venv/bin/activate
# pip install -r requirements.txt
export $(xargs < .env)
python ./src/manage.py migrate
sudo systemctl restart ghouse-dev.service
sudo systemctl restart daphne.service
sudo systemctl restart celery.service
sudo systemctl restart nginx