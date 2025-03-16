CANCELLATION_POLICY_DATA = [
    {
        "id": 1,
        "policy_name": "Non-refundable",
        "description": "You will not receive a refund if you cancel your reservation",
        "refund_percentage": 0,
        "cancellation_deadline": 0,
    },
    {
        "id": 2,
        "policy_name": "Flexible",
        "description": "Full refund 1 day prior to arrival",
        "refund_percentage": 100,
        "cancellation_deadline": 1,
    },
    {
        "id": 3,
        "policy_name": "Moderate",
        "description": "Full refund 5 days prior to arrival",
        "refund_percentage": 100,
        "cancellation_deadline": 5,
    },
]


def default_cancellation_policy():
    return CANCELLATION_POLICY_DATA[0]
