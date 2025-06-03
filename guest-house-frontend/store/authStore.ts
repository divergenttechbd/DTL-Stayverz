import Cookie from 'js-cookie'
import { create } from 'zustand'
import {
  STORAGE_KEY_ACCESS_TOKEN,
  STORAGE_KEY_REFRESH_TOKEN,
  STORAGE_KEY_USER_TYPE,
} from '~/constants/localstorage'
import { getProfileDetails, userLogout } from '~/queries/client/profile'

interface UserData {
  id: string;
  username: string;
  date_joined: string;
  phone_number: string;
  u_type: String;
  full_name: string;
  userFirstLetter: string;
  identity_verification_method: string;
  identity_verification_images: {
    front_image: string;
    back_image: string;
  };
  identity_verification_reject_reason: string;
  identity_verification_status: string;
  image: string;
  email: string;
  is_email_verified: boolean;
  unread_message_count: number;
}

export interface AuthStore {
  userData: UserData | undefined;
  isFetchingUserData: boolean;
  isAuthenticated: boolean;
  wishlists?: number[];
  authFlow:
    | undefined
    | 'SIGN_UP'
    | 'CHANGE_PASSWORD'
    | 'LOG_IN'
    | 'HOST_LOG_IN'
    | 'GUEST_LOG_IN'
    | 'RESET_PASS_OTP'
    | 'FORGET_PASSWORD_FORM'
    | 'CONFIRMATION'
    | 'CONFIRM_PASSWORD_FORM'
    | 'SIGN_UP_OTP';
  logOut: () => void;
  setIsAuthenticated: (status: boolean) => void;
  getUserData: () => Promise<UserData | void>;
  authFlowSuccessRedirect: undefined | string;
  resetAuthFlowState: () => void;
}

export const useAuthStore = create<AuthStore>((set, get) => {
  return {
    userData: undefined,
    isFetchingUserData: false,
    isAuthenticated: !!Cookie.get(STORAGE_KEY_ACCESS_TOKEN),
    wishlists: [],
    authFlow: undefined,
    logOut: async () => {
      try {
        await userLogout()
      } finally {
        set({ userData: undefined, isAuthenticated: false })
      }
      Cookie.remove(STORAGE_KEY_ACCESS_TOKEN)
      Cookie.remove(STORAGE_KEY_REFRESH_TOKEN)
      Cookie.remove(STORAGE_KEY_USER_TYPE)
      set({ userData: undefined, isAuthenticated: false })
    },
    setIsAuthenticated: (status: boolean) => {
      set({ isAuthenticated: status })
    },
    getUserData: async () => {
      if (!get().isAuthenticated) return
      set({ isFetchingUserData: true })
      try {
        const res = await getProfileDetails()
        set({
          userData: {
            ...res.data,
            userFirstLetter: res.data?.full_name?.split('')[0],
          },
        })
        set({ wishlists: res.data?.wishlist_listings })
        return res.data as UserData
      } finally {
        set({ isFetchingUserData: false })
      }
    },
    authFlowSuccessRedirect: undefined,
    resetAuthFlowState: () => {
      set({ authFlow: undefined, authFlowSuccessRedirect: undefined })
    },
  }
})

export const updateUnreadMessageCount = (newCount: number): void => {
  useAuthStore.setState((state) => ({
    userData: state.userData
      ? { ...state.userData, unread_message_count: newCount }
      : undefined,
  }))
}

export const useAuthActionsLogout = () => useAuthStore((state) => state.logOut)
export const useHasUserData = () => useAuthStore((state) => !!state.userData)
export const useUserId = () => useAuthStore((state) => state.userData?.id)
