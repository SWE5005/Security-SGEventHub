interface SgehEvent {
  id: string;
  title: string;
  description: string;
  startDatetime: string;
  endDatetime: string;
  location: string;
  capacity: number;
  status: string;
  cover: string;
}

interface SgehEventReview {
  reviewId: string;
  eventId: string;
  userId: string;
  rating: number;
  comment: string;
}

interface SgehEventRegistration {
  registerId: string;
  userId: string;
  eventId: string;
  registerDt: Date;
  registerStatus: string;
}

interface SgehUser {
  userId?: string;
  userName: string;
  mobileNumber: string;
  emailAddress: string;
  activeStatus: string;
  roles: string;
  createDt?: string;
}

interface SgehUserDetail extends SgehUser {
  roleName: string;
  permission: string;
}

interface LoginRequest {
  emailAddress: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  access_token_expiry: number;
  token_type: string;
  user_name: string;
  email_address: string;
  user_role: 'END_USER' | 'EVENT_MANAGER' | 'SUPER_ADMIN';
}

interface EventUserRequest {
  userName: string;
  password: string;
  emailAddress: string;
}

interface SignupRequest {
  userName: string;
  userEmail: string;
  userMobileNo: string;
  userPassword: string;
  userRole: 'END_USER' | 'EVENT_MANAGER' | 'SUPER_ADMIN';
}

interface EventUserResponse {
  userId: string;
  userName: string;
  emailAddress: string;
  activeStatus: number;
  roleId: number;
  createDt: string;
}

interface RegisterRequest {
  type: string;
  eventId: string;
}

interface SgehEventDetails extends SgehEvent {
  userList: SgehEventRegistration[];
}

type SgehEventReviewReq = Omit<SgehEventReview, 'reviewId'>;
