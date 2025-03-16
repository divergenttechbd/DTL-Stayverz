from rest_framework import serializers
from accounts.serializers import UserSerializer
from base.serializers import DynamicFieldsModelSerializer
from payments.models import HostPayMethod, OnlinePayment, HostPayment, HostPaymentItem


class OnlinePaymentSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = OnlinePayment
        fields = "__all__"


class HostPayMethodSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = HostPayMethod
        fields = "__all__"

    def validate(self, data):
        if self.instance:
            data.pop("m_type", None)
            data["bank_name"] = (
                data.get("bank_name")
                if data.get("bank_name")
                else self.instance.bank_name
            )
            data["branch_name"] = (
                data.get("branch_name")
                if data.get("branch_name")
                else self.instance.branch_name
            )
            data["routing_number"] = (
                data.get("routing_number")
                if data.get("routing_number")
                else self.instance.routing_number
            )
        else:
            m_type = data["m_type"]
            if m_type == "bank":
                if (
                    not data.get("bank_name")
                    or not data.get("branch_name")
                    or not data.get("routing_number")
                ):
                    raise serializers.ValidationError("Invalid data")

        return data


class HostPaymentSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = HostPayment
        fields = "__all__"

    def get_host(self, obj):
        return UserSerializer(
            obj.host,
            fields=["id", "full_name", "image", "phone_number"],
        ).data

    def get_pay_method(self, obj):
        return HostPayMethodSerializer(
            obj.pay_method,
            fields=[
                "id",
                "m_type",
                "branch_name",
                "bank_name",
                "account_name",
                "account_no",
            ],
        ).data


class HostPaymentItemSerializer(DynamicFieldsModelSerializer):
    class Meta:
        model = HostPaymentItem
        fields = "__all__"
