export type InquiryStatus = "Nueva" | "En curso" | "Respondida";

export interface Inquiry {
  id: string;
  createdAt: string; // ISO
  name: string;
  contact: string;
  propertySlug: string;
  message: string;
  status: InquiryStatus;
  assignedTo: string | null;
}
