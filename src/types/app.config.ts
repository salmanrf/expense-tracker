export interface AppConfig {
  TWILIO_ACCOUNT_SID: string;
  TWILIO_AUTH_TOKEN: string;
  TWILIO_APP_WA_ID: string;
  POSTGRES_URI: string;
}

export type ErrorDetails = {
  loc: string;
  message: string;
}[];
