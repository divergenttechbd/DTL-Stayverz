import { ModalType } from '~/app/profile/profileType'

export const modalHeaders = {
  [ModalType.SCHOOL]: {
    header: 'Where I went to school?',
    subHeader: 'Whether its home school, high school, or trade school, name the school that made you who you are.'
  },
  [ModalType.WORK]: {
    header: 'Where I went to work?',
    subHeader: 'Tell us what your profession is. If you don’t have a traditional job, tell us your life’s calling. Example: Nurse, parent to four kids, or retired surfer.'
  },
  [ModalType.BIO]: {
    header: 'About you',
    subHeader: 'Tell us a little bit about yourself, so your future hosts or guests can get to know you'
  },
  [ModalType.EMAIL]: {
    header: 'Email',
    subHeader: 'Tell us your email to verify'
  },
  [ModalType.LANGUAGE]: {
    header: 'Languages you speak',
    subHeader: ''
  }
}
