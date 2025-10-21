import mongoose, { Model, Schema, Document } from "mongoose";

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
  declaration: CenterDeclaration;
  status?: "pending" | "approved" | "rejected";
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
  status?: "pending" | "approved" | "rejected";
  page?: number;
  limit?: number;
}

interface ICenter extends Document {
  centerDetails: CenterDetails;
  authorizedPersonDetails: AuthorizedPersonDetails;
  infrastructureDetails: InfrastructureDetails;
  bankDetails: BankDetails;
  documentUploads: DocumentUploads;
  declaration: CenterDeclaration;
  status?: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

// Sub-schemas
const centerDetailsSchema = new Schema<CenterDetails>(
  {
    centerName: { type: String, required: true },
    centerCode: { type: String, required: false },
    centerType: { type: String, required: true },
    yearOfEstablishment: { type: Number, required: true },
    fullAddress: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    officialEmailId: { type: String, required: true },
    primaryContactNo: { type: String, required: true },
    alternateContactNo: { type: String, required: false },
    website: { type: String, required: false },
  },
  { _id: false }
);

const authorizedPersonDetailsSchema = new Schema<AuthorizedPersonDetails>(
  {
    name: { type: String, required: true },
    designation: { type: String, required: true },
    contactNo: { type: String, required: true },
    emailId: { type: String, required: true },
    aadhaarIdProofNo: { type: String, required: true },
    photographUrl: { type: String, required: false },
  },
  { _id: false }
);

const infrastructureDetailsSchema = new Schema<InfrastructureDetails>(
  {
    numberOfClassrooms: { type: Number, required: true },
    numberOfComputers: { type: Number, required: true },
    internetFacility: { type: Boolean, required: true },
    seatingCapacity: { type: Number, required: true },
    infrastructurePhotosUrls: { type: [String], required: false },
  },
  { _id: false }
);

const bankDetailsSchema = new Schema<BankDetails>(
  {
    bankName: { type: String, required: true },
    accountHolderName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifscCode: { type: String, required: true },
    branchName: { type: String, required: true },
    cancelledChequeUrl: { type: String, required: false },
  },
  { _id: false }
);

const documentUploadsSchema = new Schema<DocumentUploads>(
  {
    registrationGstCertificateUrl: { type: String, required: false },
    panCardUrl: { type: String, required: false },
    addressProofUrl: { type: String, required: false },
    directorIdProofUrl: { type: String, required: false },
  },
  { _id: false }
);

const centerDeclarationSchema = new Schema<CenterDeclaration>(
  {
    declaration: { type: Boolean, required: true },
    signatureUrl: { type: String, required: false },
  },
  { _id: false }
);

// Main schema
const centerSchema = new Schema<ICenter>(
  {
    centerDetails: { type: centerDetailsSchema, required: true },
    authorizedPersonDetails: {
      type: authorizedPersonDetailsSchema,
      required: true,
    },
    infrastructureDetails: {
      type: infrastructureDetailsSchema,
      required: true,
    },
    bankDetails: { type: bankDetailsSchema, required: true },
    documentUploads: { type: documentUploadsSchema, required: true },
    declaration: { type: centerDeclarationSchema, required: true },
    status: {
      type: String,
      required: false,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
    createdBy: { type: String, required: false },
    updatedBy: { type: String, required: false },
  },
  {
    timestamps: true,
  }
);

const CenterModel: Model<ICenter> = mongoose.model<ICenter>(
  "centers",
  centerSchema,
  "centers"
);

export { CenterModel, ICenter };
