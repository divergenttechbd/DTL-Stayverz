from django.urls import path
from . import views


# from .views import AdminListReferralParticipantsAPIView

app_name = "referrals"

urlpatterns = [
    # --- General Referral Endpoints (for both Hosts and Guests) ---
    path('my-link/', views.MyReferralLinkAPIView.as_view(), name='my_referral_link'),
    path('my-referrals/', views.MyReferralsListAPIView.as_view(), name='my_referrals_list'),
    path('my-rewards-history/', views.MyRewardHistoryListAPIView.as_view(), name='my_reward_history'),
    path('my-coupons/', views.MyCouponsListAPIView.as_view(), name='my_coupons_list'),

    # --- Host Specific Referral Endpoints ---
    path('host/balance/', views.MyHostRewardCreditBalanceAPIView.as_view(), name='my_host_reward_balance'),
    path('host/claim-coupon/', views.ClaimHostCommissionCouponAPIView.as_view(), name='claim_host_commission_coupon'),

    # --- Guest Specific Referral Endpoints ---
    path('guest/points-balance/', views.MyGuestPointsBalanceAPIView.as_view(), name='my_guest_points_balance'),
    path('guest/claim-coupon/', views.ClaimGuestPointsCouponAPIView.as_view(), name='claim_guest_points_coupon'),



path('admin/referral-reports/referrers/', views.AdminReferrerReportListView.as_view(), name='admin-referrer-report-list'),
    path('admin/referral-reports/referrers/<int:pk>/', views.AdminReferrerDetailReportView.as_view(), name='admin-referrer-detail-report'),
]
