# from .models import Referral, ReferralCode, ReferralStatus, ReferralType
# from base.type_choices import UserTypeOption #<-- ADJUST this import path to your project
#
# def create_referral_record(new_user, referral_code_str: str):
#     """
#     Checks for a valid referral code and creates a Referral event record.
#     This should be called immediately after a new user is successfully created.
#
#     Args:
#         new_user: The newly created User object.
#         referral_code_str: The referral code string from the sign-up form.
#     """
#     if not referral_code_str:
#         return
#
#     try:
#         # A user can only be referred once.
#         if hasattr(new_user, 'referral_received') and new_user.referral_received is not None:
#             return
#
#         # Find the referral code instance in the database (case-insensitive).
#         code_instance = ReferralCode.objects.select_related('referrer').get(code__iexact=referral_code_str.strip())
#         referrer = code_instance.referrer
#
#         # Rule: Users cannot refer themselves.
#         if new_user.pk == referrer.pk:
#             return
#
#         # Rule: The new user's type must match the code's intended type.
#         if (code_instance.referral_type == ReferralType.HOST_TO_HOST and new_user.u_type != UserTypeOption.HOST) or \
#            (code_instance.referral_type == ReferralType.GUEST_TO_GUEST and new_user.u_type != UserTypeOption.GUEST):
#             print(f"Referral code type mismatch for code '{referral_code_str}' and user '{new_user.username}'")
#             return
#
#         # All checks passed. Create the successful referral event.
#         Referral.objects.create(
#             referral_code_instance=code_instance,
#             referrer=referrer,
#             referred_user=new_user,
#             referral_type=code_instance.referral_type,
#             status=ReferralStatus.SIGNED_UP
#         )
#         print(f"Successfully created referral record for '{new_user.username}' by '{referrer.username}'")
#
#     except ReferralCode.DoesNotExist:
#         # The provided code was invalid. Silently ignore it.
#         pass
#     except Exception as e:
#         # It's good practice to log any other unexpected errors.
#         print(f"An error occurred during referral processing: {e}")
