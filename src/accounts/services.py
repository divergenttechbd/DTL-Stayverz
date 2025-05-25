# achievements/services.py (create a new app 'achievements' or put in 'accounts/services.py')

from django.utils import timezone
from datetime import timedelta, date
from decimal import Decimal, ROUND_HALF_UP
from django.db.models import Sum, Count, Avg, Case, When, IntegerField, Q

 # Your User model
from bookings.models import Booking  # Your Booking model
from base.type_choices import BookingStatusOption  # Your choices
from myproject import settings

from django.contrib.auth import get_user_model

User = get_user_model()


def get_current_quarter_start_and_end_dates():
    """
    Determines the start date of the current calendar quarter and today as the end date for ongoing progress.
    Returns (quarter_start_date, today_date)
    """
    today = timezone.now().date()
    current_month = today.month
    current_year = today.year

    if 1 <= current_month <= 3:
        quarter_start_date = date(current_year, 1, 1)
    elif 4 <= current_month <= 6:
        quarter_start_date = date(current_year, 4, 1)
    elif 7 <= current_month <= 9:
        quarter_start_date = date(current_year, 7, 1)
    else:
        quarter_start_date = date(current_year, 10, 1)

    return quarter_start_date, today


def get_previous_completed_quarter_start_end_dates():
    today = timezone.now().date()
    current_month = today.month
    current_year = today.year

    if 1 <= current_month <= 3:
        quarter_end_date = date(current_year - 1, 12, 31)
        quarter_start_date = date(current_year - 1, 10, 1)
    elif 4 <= current_month <= 6:
        quarter_end_date = date(current_year, 3, 31)
        quarter_start_date = date(current_year, 1, 1)
    elif 7 <= current_month <= 9:
        quarter_end_date = date(current_year, 6, 30)
        quarter_start_date = date(current_year, 4, 1)
    else:
        quarter_end_date = date(current_year, 9, 30)
        quarter_start_date = date(current_year, 7, 1)
    return quarter_start_date, quarter_end_date

def get_evaluation_period_start_date():
    return timezone.now().date() - timedelta(days=settings.SUPERHOST_EVALUATION_PERIOD_DAYS)


def calculate_host_review_score(host: User, period_start_date: date, period_end_date: date) -> Decimal:

    from bookings.models import ListingBookingReview

    reviews = ListingBookingReview.objects.filter(
        review_for=host,
        booking__check_out__gte=period_start_date,
        booking__check_out__lte=period_end_date,
        booking__status__in=[BookingStatusOption.CONFIRMED]
    ).select_related('booking')

    if not reviews.exists():
        return Decimal('0.00')

    avg_score = reviews.aggregate(avg_rating=Avg('rating'))['avg_rating']
    return Decimal(str(avg_score or '0.00')).quantize(Decimal('0.01'))


def calculate_hosted_days(host: User, period_start_date: date, period_end_date: date) -> int:

    from bookings.models import Booking # Moved import for clarity

    relevant_bookings = Booking.objects.filter(
        host=host,
        status__in=[BookingStatusOption.CONFIRMED],
        check_out__gte=period_start_date,
        check_out__lte=period_end_date
    )
    total_hosted_nights = relevant_bookings.aggregate(total_nights=Sum('night_count'))['total_nights']
    return total_hosted_nights or 0


def calculate_cancellation_rate(host: User, period_start_date: date, period_end_date: date) -> Decimal:
    """
    Calculates cancellation rate for bookings *created* within the period (up to today for ongoing quarter).
    (Host-initiated cancellations / Total bookings created)
    """
    from bookings.models import Booking  # Moved import for clarity

    total_bookings_query = Booking.objects.filter(
        host=host,
        created_at__date__gte=period_start_date,
        created_at__date__lte=period_end_date
    )
    total_bookings_count = total_bookings_query.count()

    if total_bookings_count == 0:
        return Decimal('0.00')


    host_cancellations_count = Booking.objects.filter(
        host=host,
        status=BookingStatusOption.CANCELLED,
        created_at__date__gte=period_start_date,
        created_at__date__lte=period_end_date
    ).count()

    cancellation_rate = (Decimal(host_cancellations_count) / Decimal(total_bookings_count)) * 100
    return cancellation_rate.quantize(Decimal('0.01'))


def get_superhost_progress(host: User):
    """
    Calculates all metrics for a host for the current quarter (up to today)
    and determines their progress towards Superhost tiers.
    """
    # Use current quarter (start of quarter to today) for progress tracking
    period_start, period_end = get_current_quarter_start_and_end_dates()

    current_metrics = {
        'review_score': calculate_host_review_score(host, period_start, period_end),
        'hosted_days': calculate_hosted_days(host, period_start, period_end),
        'cancellation_rate': calculate_cancellation_rate(host, period_start, period_end),
        # 'response_time': # Skipped
    }

    tiers_progress = []
    achieved_tier_key = None  # Stores the key of the highest tier achieved ('SILVER', 'GOLD', etc.)

    # Iterate through tiers defined in settings, sorted by their 'order'
    for tier_key, tier_criteria in sorted(settings.SUPERHOST_TIERS.items(), key=lambda item: item[1]['order']):

        # Check if each criterion for the current tier is met
        is_met_review_score = current_metrics['review_score'] >= tier_criteria['review_score_min']
        is_met_hosted_days = current_metrics['hosted_days'] >= tier_criteria['hosted_days_min']
        is_met_cancellation_rate = current_metrics['cancellation_rate'] <= tier_criteria[
            'cancellation_rate_max_percent']
        # is_met_response_time = True # Assume met if skipping this criterion

        all_criteria_met_for_this_tier = is_met_review_score and \
                                         is_met_hosted_days and \
                                         is_met_cancellation_rate  # and is_met_response_time

        tiers_progress.append({
            'tier_key': tier_key,
            'name': tier_criteria['name'],
            'criteria': tier_criteria,  # Send full criteria for UI to display requirements
            'achieved': all_criteria_met_for_this_tier,
            'progress_details': {
                'review_score': {
                    'current': current_metrics['review_score'],
                    'required': tier_criteria['review_score_min'],
                    'met': is_met_review_score
                },
                'hosted_days': {
                    'current': current_metrics['hosted_days'],
                    'required': tier_criteria['hosted_days_min'],
                    'met': is_met_hosted_days
                },
                'cancellation_rate': {
                    'current': current_metrics['cancellation_rate'],
                    'required': tier_criteria['cancellation_rate_max_percent'],
                    'met': is_met_cancellation_rate,
                    'comparison': 'lower_is_better'  # UI hint
                },
                # Add response time details here when implemented
            }
        })

        if all_criteria_met_for_this_tier:
            achieved_tier_key = tier_key  # Update if this tier is met (will get the highest due to sorted iteration)

    return {
        'current_metrics': current_metrics,  # The host's actual metrics for the quarter
        'tiers_progress': tiers_progress,  # Progress against each defined tier
        'achieved_tier': achieved_tier_key,  # The highest tier fully achieved based on current metrics
        'evaluation_period_start': period_start,
        'evaluation_period_end': period_end,  # This is 'today' for ongoing quarter
        'evaluation_period_name': f"Current Quarter (Ongoing: {period_start.strftime('%b %d')} - {period_end.strftime('%b %d, %Y')})"
    }
