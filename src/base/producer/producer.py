# import pika, json
# from django.conf import settings

# params = pika.URLParameters(settings.AMQP_SERVER_URL)

# connection = pika.BlockingConnection(params)

# channel = connection.channel()
# # channel.queue_declare(queue="main")


# def publish(method, body):
#     print("here")
#     properties = pika.BasicProperties(method)
#     channel.basic_publish(
#         exchange="", routing_key="main", body=json.dumps(body), properties=properties
#     )
#     connection.close()

import pika, json
from django.conf import settings


class RabbitMQ:
    def __init__(self, amqp_url):
        self.connection = pika.BlockingConnection(pika.URLParameters(amqp_url))
        self.channel = self.connection.channel()
        self.channel.queue_declare(queue="main")

    def publish(self, method, body, routing_key="main"):
        properties = pika.BasicProperties(method)
        self.channel.basic_publish(
            exchange="",
            routing_key=routing_key,
            body=json.dumps(body),
            properties=properties,
        )
        self.close_connection()

    def close_connection(self):
        self.connection.close()


# Usage
amqp_url = settings.AMQP_SERVER_URL
rabbitmq = RabbitMQ(amqp_url)
