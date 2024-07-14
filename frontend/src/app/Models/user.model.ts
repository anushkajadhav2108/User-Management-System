// src/app/models/user.model.ts
export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resettoken: string;
  newPassword: string;
}
