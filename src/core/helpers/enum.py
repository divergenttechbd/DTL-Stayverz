from enum import Enum


class UserStatusOption(str, Enum):
    ACTIVE = "active"
    INACTIVE = "inactive"
    PENDING = "pending"


class UserTypeOption(str, Enum):
    GUEST = "guest"
    HOST = "host"
    SYSTEM = "system"


class UserRoleOption(str, Enum):
    ADMIN = "admin"
    SUPER_ADMIN = "super_admin"


class IdentityVerificationStatusOption(str, Enum):
    PENDING = "pending"
    VERIFIED = "verified"
    NOT_VERIFIED = "not_verified"
    REJECTED = "rejected"


class IdentityVerificationMethodOption(str, Enum):
    PASSPORT = "passport"
    NID = "nid"
    DRIVING_LICENSE = "driving_license"


class MessageTypeEnum(str, Enum):
    SYSTEM = "system"
    NORMAL = "normal"


class ChatRoomStatus(str, Enum):
    INQUIRY = "inquiry"
    CANCELLED = "cancelled"
    CONFIRMED = "confirmed"
    CLOSED = "closed"
    OPEN = "open"


class RoomStatusEnum(str, Enum):
    OPEN = "open"
    CLOSED = "closed"
