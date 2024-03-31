import { ProductPackage } from "../database/models/listing";

const packageDefaultValues: ProductPackage[] = [
  {
    name: "basic",
    paymentType: "per-listing",
    capabilities: ["ads", "enquiries"],
    extras: ["video-listing"],
    active: false
  },
  {
    name: "standard",
    paymentType: "per-term",
    capabilities: [
      "ads",
      "enquiries",
      "referencing",
      "shortlisting-applicants",
      "viewings",
      "rent-collection",
      "deposit-handling",
      "reports",
      "tenancy-renewals",
      "leasing-documents"
    ],
    extras: [],
    active: false
  },
  {
    name: "premium",
    paymentType: "percentage",
    capabilities: [
      "ads",
      "enquiries",
      "referencing",
      "shortlisting-applicants",
      "viewings",
      "rent-collection",
      "deposit-handling",
      "reports",
      "tenancy-renewals",
      "leasing-documents",
      "property-maintenance",
      "tenant-communication",
      "routine-checks",
      "expense-tracking",
      "inventory-builder",
      "certificate-reminder",
      "compliance-checklist"
    ],
    extras: [],
    active: false
  }
];

export default packageDefaultValues;
