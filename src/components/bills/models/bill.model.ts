import mongoose, { Model, Schema, Document } from "mongoose";

export interface BillDetails {
  // Common fields for all bill types
  amount?: number;
  paymentMethod?: string;
  billDate?: string;
  dueDate?: string;
  description?: string;
  status?: "paid" | "pending" | "overdue" | "cancelled";
  centerId?: string;
  
  // Student bill specific fields
  studentName?: string;
  registrationNo?: string;
  course?: string;
  
  // Center bill specific fields
  centerName?: string;
  centerCode?: string;
  centerType?: string;
  billType?: string;
  
  // Other bill specific fields
  recipientName?: string;
  recipientType?: string;
  recipientId?: string;
  category?: string;
  
  // Additional dynamic fields (for future extensibility)
  additionalData?: Record<string, any>;
}

export interface CreateBillRequest {
  amount?: number;
  paymentMethod?: string;
  billDate?: string;
  dueDate?: string;
  description?: string;
  status?: "paid" | "pending" | "overdue" | "cancelled";
  centerId?: string;
  
  // Student bill fields
  studentName?: string;
  registrationNo?: string;
  course?: string;
  
  // Center bill fields
  centerName?: string;
  centerCode?: string;
  centerType?: string;
  billType?: string;
  
  // Other bill fields
  recipientName?: string;
  recipientType?: string;
  recipientId?: string;
  category?: string;
  
  // Additional dynamic fields
  additionalData?: Record<string, any>;
}

export interface BillModel {
  id?: string;
  billDetails?: BillDetails;
  billType?: "student" | "center" | "other";
  billNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export interface BillListResponse {
  bills: BillModel[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface BillSearchFilters {
  billType?: "student" | "center" | "other";
  status?: "paid" | "pending" | "overdue" | "cancelled";
  centerId?: string;
  studentName?: string;
  centerName?: string;
  recipientName?: string;
  dateFrom?: string;
  dateTo?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

interface IBill extends Document {
  billDetails?: BillDetails;
  billType?: "student" | "center" | "other";
  billNumber?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

// Bill details schema with flexible structure
const billDetailsSchema = new Schema<BillDetails>(
  {
    // Common fields
    amount: { type: Number, required: false },
    paymentMethod: { type: String, required: false },
    billDate: { type: String, required: false },
    dueDate: { type: String, required: false },
    description: { type: String, required: false },
    status: { 
      type: String, 
      required: false,
      enum: ["paid", "pending", "overdue", "cancelled"],
      default: "pending"
    },
    centerId: { type: String, required: false },
    
    // Student bill fields
    studentName: { type: String, required: false },
    registrationNo: { type: String, required: false },
    course: { type: String, required: false },
    
    // Center bill fields
    centerName: { type: String, required: false },
    centerCode: { type: String, required: false },
    centerType: { type: String, required: false },
    billType: { type: String, required: false },
    
    // Other bill fields
    recipientName: { type: String, required: false },
    recipientType: { type: String, required: false },
    recipientId: { type: String, required: false },
    category: { type: String, required: false },
    
    // Additional dynamic fields
    additionalData: { type: Schema.Types.Mixed, required: false }
  },
  { _id: false }
);

// Main bill schema
const billSchema = new Schema<IBill>(
  {
    billDetails: { type: billDetailsSchema, required: false },
    billType: {
      type: String,
      required: false,
      enum: ["student", "center", "other"]
    },
    billNumber: { 
      type: String, 
      required: false, 
      unique: true 
    },
    createdBy: { type: String, required: false },
    updatedBy: { type: String, required: false }
  },
  {
    timestamps: true,
  }
);

// Generate unique bill number
billSchema.pre('save', async function(next) {
  if (this.isNew && !this.billNumber) {
    const count = await BillModel.countDocuments();
    const billTypePrefix = (this.billType || 'OTH').toUpperCase().substring(0, 3);
    const year = new Date().getFullYear();
    const month = String(new Date().getMonth() + 1).padStart(2, '0');
    const sequence = String(count + 1).padStart(6, '0');
    
    this.billNumber = `${billTypePrefix}-${year}${month}-${sequence}`;
  }
  next();
});

const BillModel: Model<IBill> = mongoose.model<IBill>(
  "bills",
  billSchema,
  "bills"
);

export { BillModel, IBill };
