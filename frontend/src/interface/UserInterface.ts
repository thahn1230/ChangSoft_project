export interface UserInfo {
    id: string;
    name: string;
    job_position: string|null;
    company: string;
    email_address: string;
    phone_number: string|null;
    user_type: string;
  }

export interface loginResponse{
  token: string;
  status: boolean;
}

export interface JoinInputValue {
  id: string;
  password: string;
  name: string;
  job_position: string | null;
  company: string;
  email_address: string;
  phone_number: string | null;
  user_type: string;
}