from rest_framework.permissions import BasePermission

from base.type_choices import UserStatusOption, UserTypeOption


class IsSuperUser(BasePermission):
    def has_permission(self, request, view) -> bool:
        return request.user.is_superuser


class IsStaff(BasePermission):
    def has_permission(self, request, view):
        return bool(
            request.user and request.user.is_authenticated and request.user.is_staff
        )


class IsHostUser(BasePermission):
    def has_permission(self, request, view):
        return (
            not request.user.is_staff
            and request.user.u_type == UserTypeOption.HOST
            and request.user.status == UserStatusOption.ACTIVE
            and request.user.is_active == True
        )


class IsGuestUser(BasePermission):
    def has_permission(self, request, view):
        return (
            not request.user.is_staff
            and request.user.u_type == UserTypeOption.GUEST
            and request.user.status == UserStatusOption.ACTIVE
            and request.user.is_active == True
        )


class HostUserHasObjectAccess(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.host_id == request.user.id


class GuestUserHasObjectAccess(BasePermission):
    def has_object_permission(self, request, view, obj):
        return obj.guest_id == request.user.id


# class HostUserHasObjectAccess(BasePermission):
#     def has_object_permission(self, request, view, listing_obj):
#         return listing_obj.owner_id == request.user.id


class HasRequiredPermissionForMethod(BasePermission):
    get_permission_required = None
    put_permission_required = None
    post_permission_required = None
    patch_permission_required = None
    delete_permission_required = None

    def has_permission(self, request, view):
        permission_required_name = f"{request.method.lower()}_permission_required"
        if not request.user.is_authenticated and not (
            request.user.is_superuser or request.user.is_staff
        ):
            return False
        if not hasattr(view, permission_required_name):
            view_name = view.__class__.__name__
            self.message = f"IMPLEMENTATION ERROR: Please add the {permission_required_name} variable in the API view class: {view_name}."
            return False

        permission_required = getattr(view, permission_required_name)
        if isinstance(permission_required, str):
            perms = [permission_required]
        else:
            perms = permission_required
        if not any(request.user.has_perm(perm) for perm in perms):
            self.message = f"Access denied. You need the/any_of {permission_required} permission to access this service with {request.method}."
            return False
        # if not request.user.has_perm(permission_required):
        #     self.message = f'Access denied. You need the {permission_required} permission to access this service with {request.method}.'
        #     return False
        return True
