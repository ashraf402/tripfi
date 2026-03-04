export interface LegalContact {
  email: string;
  emailPostLaunch: string;
  company: string;
}

export interface LegalSubsection {
  heading: string;
  content: string;
  list?: string[];
}

export interface LegalSection {
  id: string;
  heading: string;
  content?: string;
  list?: string[];
  footer?: string;
  subsections?: LegalSubsection[];
}

export interface LegalDocument {
  id: string;
  title: string;
  lastUpdated: string;
  effectiveDate: string;
  contact: LegalContact;
  sections: LegalSection[];
}
