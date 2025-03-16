cd /home/ghouse/backend-drf
git pull origin main
source .venv/bin/activate
# pip install -r requirements.txt
export $(xargs < .env)
python ./src/manage.py migrate
sudo systemctl restart ghouse.service
sudo systemctl restart daphne.service
sudo systemctl restart celery.service
sudo systemctl restart nginx
