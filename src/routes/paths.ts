// utils

// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '',
};

// ----------------------------------------------------------------------

export const paths = {
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
      forgotPassword: `${ROOTS.AUTH}/jwt/forgot-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    chat: `${ROOTS.DASHBOARD}/chat`,
    permission: `${ROOTS.DASHBOARD}/permission`,
    notification: `${ROOTS.DASHBOARD}/notifications`,
    general: {
      app: `${ROOTS.DASHBOARD}/app`,
    },
    user: {
      root: `${ROOTS.DASHBOARD}/user`,
      new: `${ROOTS.DASHBOARD}/user/new`,
      list: `${ROOTS.DASHBOARD}/user/list`,
      cards: `${ROOTS.DASHBOARD}/user/cards`,
      profile: `${ROOTS.DASHBOARD}/user/profile`,
      account: `${ROOTS.DASHBOARD}/user/account`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
    },
    booking: {
      root: `${ROOTS.DASHBOARD}/booking`,
      list: `${ROOTS.DASHBOARD}/booking/list`,
      details: (id: string) => `${ROOTS.DASHBOARD}/booking/${id}/details`,
    },
    blog: {
      root: `${ROOTS.DASHBOARD}/blog`,
      details: (id: string) => `${ROOTS.DASHBOARD}/blog/${id}/details`,
      new: `${ROOTS.DASHBOARD}/blog/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/blog/${id}/edit`,
    },
    coupon: {
      root: `${ROOTS.DASHBOARD}/coupon`,
      details: (id: string) => `${ROOTS.DASHBOARD}/coupon/${id}/details`,
      new: `${ROOTS.DASHBOARD}/blog/new`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/blog/${id}/edit`,
    },

    transactions: {
      root: `${ROOTS.DASHBOARD}/transactions`,
      details: (id: string) => `${ROOTS.DASHBOARD}/transactions/${id}`,
    },
    payouts: {
      root: `${ROOTS.DASHBOARD}/payouts`,
    },
    reviews: {
      root: `${ROOTS.DASHBOARD}/reviews`,
    },
    listing: {
      root: `${ROOTS.DASHBOARD}/listing`,
      new: `${ROOTS.DASHBOARD}/listing/new`,
      details: (id: string) => `${ROOTS.DASHBOARD}/listing/${id}`,
      edit: (id: string) => `${ROOTS.DASHBOARD}/listing/${id}/edit`,
    },
    salesReport: {
      root: `${ROOTS.DASHBOARD}/sales-report`,
      details: (id: string) => `${ROOTS.DASHBOARD}/sales-report/${id}/details`,
    },
    settings: {
      root: `${ROOTS.DASHBOARD}/settings`,
      user: {
        root: `${ROOTS.DASHBOARD}/settings/user`,
        new: `${ROOTS.DASHBOARD}/settings/user/create`,
        list: `${ROOTS.DASHBOARD}/settings/user/list`,
        edit: (id: string) => `${ROOTS.DASHBOARD}/user/${id}/edit`,
      },
      host_service_charge: {
        root: `${ROOTS.DASHBOARD}/settings/host-service-charge`,
      },
      guest_service_charge: {
        root: `${ROOTS.DASHBOARD}/settings/guest-service-charge`,
      },
    },
  },
};
