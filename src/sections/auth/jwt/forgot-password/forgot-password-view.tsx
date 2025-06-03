import { useState } from 'react';
import EmailForm from './email-form';
import OtpForm, { ForgotPasswordFormData } from './otp-form';
import PasswordForm from './password-form';

// ----------------------------------------------------------------------

export default function ForgotPasswordView() {
  const [currentForm, setCurrentForm] = useState<'email' | 'otp' | 'password'>('email');
  const [formData, setFormData] = useState<ForgotPasswordFormData>({ email: '', otp: '' });
  // eslint-disable-next-line no-nested-ternary
  return currentForm === 'email' ? (
    <EmailForm setCurrentForm={setCurrentForm} setFormData={setFormData} />
  ) : currentForm === 'otp' ? (
    <OtpForm setCurrentForm={setCurrentForm} setFormData={setFormData} formData={formData} />
  ) : (
    <PasswordForm formData={formData} />
  );
}
