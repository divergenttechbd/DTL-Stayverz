from decimal import Decimal

SUPERHOST_TIERS = {
    'SILVER': {
        'name': 'Silver Host',
        'review_score_min': Decimal('4.5'),
        'hosted_days_min': 20,
        # 'response_time_max_hours': 24,
        'cancellation_rate_max_percent': Decimal('2.99'),
        'order': 1,
        'next_tier': 'GOLD',
    },
    'GOLD': {
        'name': 'Gold Host',
        'review_score_min': Decimal('4.71'),
        'hosted_days_min': 30,
        # 'response_time_max_hours': 12,
        'cancellation_rate_max_percent': Decimal('1.99'),
        'order': 2,
        'next_tier': 'PLATINUM',
    },
    'PLATINUM': {
        'name': 'Platinum Host',
        'review_score_min': Decimal('4.81'),
        'hosted_days_min': 60,
        # 'response_time_max_hours': 3,
        'cancellation_rate_max_percent': Decimal('0.99'),
        'order': 3,
        'next_tier': None,
    },
}

SUPERHOST_EVALUATION_PERIOD_DAYS = 90
