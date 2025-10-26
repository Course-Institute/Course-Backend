import mongoose, { Model, Schema, Document } from "mongoose";

export interface CenterDetails {
  centerName: string;
  centerCode?: string;
  centerType: string;
  yearOfEstablishment: number;
  address: string;
  city: string;
  state: string;
  pinCode: string;
  officialEmail: string;
  primaryContactNo: string;
  alternateContactNo?: string;
  website?: string;
}

export interface AuthorizedPersonDetails {
  authName: string;
  designation: string;
  contactNo: string;
  email: string;
  idProofNo: string;
  photo?: string;
}

export interface InfrastructureDetails {
  numClassrooms: number;
  numComputers: number;
  internetFacility: boolean;
  seatingCapacity: number;
  infraPhotos?: string[];
}

export interface BankDetails {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
  ifsc: string;
  branchName: string;
  cancelledCheque?: string;
}

export interface DocumentUploads {
  gstCertificate?: string;
  panCard?: string;
  addressProof?: string;
  directorIdProof?: string;
}

export interface CenterDeclaration {
  declaration: boolean;
  signatureUrl?: string;
}

export interface loginCredentials {
  username: string;
  password: string;
}

export interface CenterModel {
  id?: string;
  centerDetails: CenterDetails;
  authorizedPersonDetails: AuthorizedPersonDetails;
  infrastructureDetails: InfrastructureDetails;
  bankDetails: BankDetails;
  documentUploads: DocumentUploads;
  declaration: CenterDeclaration;
  loginCredentials?: loginCredentials;
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
  loginCredentials: loginCredentials;
}

export interface UpdateCenterRequest {
  centerDetails?: Partial<CenterDetails>;
  authorizedPersonDetails?: Partial<AuthorizedPersonDetails>;
  infrastructureDetails?: Partial<InfrastructureDetails>;
  bankDetails?: Partial<BankDetails>;
  documentUploads?: Partial<DocumentUploads>;
  declaration?: Partial<CenterDeclaration>;
  loginCredentials?: Partial<loginCredentials>;
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
  loginCredentials: loginCredentials;
  status?: "pending" | "approved" | "rejected";
  createdAt?: Date;
  updatedAt?: Date;
}

// Sub-schemas
const centerDetailsSchema = new Schema<CenterDetails>(
  {
    centerName: { type: String, required: true },
    centerCode: { type: String, required: false },
    centerType: { type: String, required: true },
    yearOfEstablishment: { type: Number, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    pinCode: { type: String, required: true },
    officialEmail: { type: String, required: true },
    primaryContactNo: { type: String, required: true },
    alternateContactNo: { type: String, required: false },
    website: { type: String, required: false },
  },
  { _id: false }
);

const authorizedPersonDetailsSchema = new Schema<AuthorizedPersonDetails>(
  {
    authName: { type: String, required: true },
    designation: { type: String, required: true },
    contactNo: { type: String, required: true },
    email: { type: String, required: true },
    idProofNo: { type: String, required: true },
    photo: { type: String, required: false },
  },
  { _id: false }
);

const infrastructureDetailsSchema = new Schema<InfrastructureDetails>(
  {
    numClassrooms: { type: Number, required: true },
    numComputers: { type: Number, required: true },
    internetFacility: { type: Boolean, required: true },
    seatingCapacity: { type: Number, required: true },
    infraPhotos: { type: [String], required: false },
  },
  { _id: false }
);

const bankDetailsSchema = new Schema<BankDetails>(
  {
    bankName: { type: String, required: true },
    accountHolder: { type: String, required: true },
    accountNumber: { type: String, required: true },
    ifsc: { type: String, required: true },
    branchName: { type: String, required: true },
    cancelledCheque: { type: String, required: false },
  },
  { _id: false }
);

const documentUploadsSchema = new Schema<DocumentUploads>(
  {
    gstCertificate: { type: String, required: false },
    panCard: { type: String, required: false },
    addressProof: { type: String, required: false },
    directorIdProof: { type: String, required: false },
  },
  { _id: false }
);

const loginCredentialsSchema = new Schema<loginCredentials>(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
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
    loginCredentials: { type: loginCredentialsSchema, required: true },
    status: {
      type: String,
      required: false,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    createdAt: { type: Date, required: false },
    updatedAt: { type: Date, required: false },
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
