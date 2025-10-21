export interface CenterDetails {
  centerName: string;
  centerCode?: string;
  centerType: string;
  yearOfEstablishment: number;
  fullAddress: string;
  city: string;
  state: string;
  pinCode: string;
  officialEmailId: string;
  primaryContactNo: string;
  alternateContactNo?: string;
  website?: string;
}

export interface AuthorizedPersonDetails {
  name: string;
  designation: string;
  contactNo: string;
  emailId: string;
  aadhaarIdProofNo: string;
  photographUrl?: string;
}

export interface InfrastructureDetails {
  numberOfClassrooms: number;
  numberOfComputers: number;
  internetFacility: boolean;
  seatingCapacity: number;
  infrastructurePhotosUrls?: string[];
}

export interface BankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  branchName: string;
  cancelledChequeUrl?: string;
}

export interface DocumentUploads {
  registrationGstCertificateUrl?: string;
  panCardUrl?: string;
  addressProofUrl?: string;
  directorIdProofUrl?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
  confirmPassword: string;
}

export interface CenterDeclaration {
  declaration: boolean;
  signatureUrl?: string;
}

export interface CenterModel {
  id?: string;
  centerDetails: CenterDetails;
  authorizedPersonDetails: AuthorizedPersonDetails;
  infrastructureDetails: InfrastructureDetails;
  bankDetails: BankDetails;
  documentUploads: DocumentUploads;
  loginCredentials: LoginCredentials;
  declaration: CenterDeclaration;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface CreateCenterRequest {
  centerDetails: CenterDetails;
  authorizedPersonDetails: AuthorizedPersonDetails;
  infrastructureDetails: InfrastructureDetails;
  bankDetails: BankDetails;
  documentUploads: DocumentUploads;
  loginCredentials: LoginCredentials;
  declaration: CenterDeclaration;
}

export interface UpdateCenterRequest {
  centerDetails?: Partial<CenterDetails>;
  authorizedPersonDetails?: Partial<AuthorizedPersonDetails>;
  infrastructureDetails?: Partial<InfrastructureDetails>;
  bankDetails?: Partial<BankDetails>;
  documentUploads?: Partial<DocumentUploads>;
  declaration?: Partial<CenterDeclaration>;
}

export interface CenterListResponse {
  centers: CenterModel[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface CenterSearchFilters {
  centerName?: string;
  centerType?: string;
  city?: string;
  state?: string;
  status?: 'pending' | 'approved' | 'rejected';
  page?: number;
  limit?: number;
}
