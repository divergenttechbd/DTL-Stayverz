from configurations.data import CANCELLATION_POLICY_DATA
from configurations.models import CancellationPolicy


def run():
    data_without_id = [
        {k: v for k, v in item.items() if k != "id"}
        for item in CANCELLATION_POLICY_DATA
    ]
    CancellationPolicy.objects.bulk_create(
        [CancellationPolicy(**item) for item in data_without_id]
    )
    return
