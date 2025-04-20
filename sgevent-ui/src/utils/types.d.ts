interface SgehEvent {
	eventId: string;
	eventTitle: string;
	eventDesc: string;
	eventCreateDt: Date;
	eventStartDt: Date;
	eventEndDt: Date;
	eventPlace: string;
	eventCapacity: number;
	eventOwnerId: string;
	eventStatus: string;
	eventCover: string;
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
	userId: string;
	userName: string;
	emailAddress: string;
	activeStatus: number;
	roleId: number;
	createDt: string;
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
	userId: string;
	userName: string;
	emailAddress: string;
	activeStatus: number;
	roleId: number;
	createDt: string;
}

interface EventUserRequest {
	userId?: string;
	userName: string;
	password: string;
	emailAddress: string;
	activeStatus: number;
	roleId: number;
	createDt?: string;
}

interface EventUserResponse {
	userId: string;
	userName: string;
	emailAddress: string;
	activeStatus: number;
	roleId: number;
	createDt: string;
}

interface SgehEventDetails extends SgehEvent {
	userList: SgehEventRegistration[];
}

type SgehEventReviewReq = Omit<SgehEventReview, "reviewId">;
