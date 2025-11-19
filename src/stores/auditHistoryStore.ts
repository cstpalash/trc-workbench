import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuditRecord, AuditStatus, AuditRiskLevel, EventType, EntityType, FindingSeverity, FindingStatus, DocumentType } from '@/types';

interface AuditHistoryState {
  audits: AuditRecord[];
  selectedAudit: AuditRecord | null;
  filters: {
    type?: EventType;
    status?: AuditStatus;
    riskLevel?: AuditRiskLevel;
    dateRange?: { start: Date; end: Date };
    entity?: string;
  };
  
  // Actions
  setFilters: (filters: Partial<AuditHistoryState['filters']>) => void;
  selectAudit: (auditId: string | null) => void;
  getAuditById: (id: string) => AuditRecord | undefined;
  getRelatedAudits: (auditId: string) => AuditRecord[];
  getFilteredAudits: () => AuditRecord[];
}

// Mock audit data for the last 3 years
const currentDate = new Date();
const threeYearsAgo = new Date(currentDate.getFullYear() - 3, 0, 1);

const mockAudits: AuditRecord[] = [
  {
    id: 'audit-1',
    title: 'Q4 2024 - Cloud Infrastructure Security Audit',
    type: EventType.INTERNAL_AUDIT,
    description: 'Comprehensive security assessment of AWS cloud infrastructure and IAM policies.',
    auditDate: new Date('2024-10-15'),
    completedDate: new Date('2024-11-20'),
    status: AuditStatus.COMPLETED,
    entity: {
      type: EntityType.PLATFORM,
      id: 'platform-aws',
      name: 'AWS Platform',
      tag: 'cloud'
    },
    auditor: 'user-3',
    score: 87,
    riskLevel: AuditRiskLevel.MEDIUM,
    findings: [
      {
        id: 'finding-1',
        title: 'Overprivileged IAM Roles',
        description: 'Several IAM roles have broader permissions than required for their function.',
        severity: FindingSeverity.MEDIUM,
        status: FindingStatus.RESOLVED,
        remediation: 'Applied principle of least privilege to 12 IAM roles.',
        dueDate: new Date('2024-12-01'),
        assignee: 'user-4',
        createdAt: new Date('2024-10-20')
      },
      {
        id: 'finding-2',
        title: 'Missing MFA on Service Accounts',
        description: 'Three service accounts lack multi-factor authentication.',
        severity: FindingSeverity.HIGH,
        status: FindingStatus.RESOLVED,
        remediation: 'Implemented MFA for all service accounts.',
        dueDate: new Date('2024-11-15'),
        assignee: 'user-5',
        createdAt: new Date('2024-10-18')
      }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Are all IAM roles following the principle of least privilege?',
        category: 'Access Management',
        answer: 'Partially - found 12 overprivileged roles that were remediated.',
        evidence: ['iam-roles-report.xlsx', 'policy-analysis.pdf'],
        score: 75,
        required: true
      },
      {
        id: 'q2',
        question: 'Is MFA enabled for all privileged accounts?',
        category: 'Authentication',
        answer: 'Yes, all privileged accounts now have MFA enabled.',
        evidence: ['mfa-compliance-report.pdf'],
        score: 100,
        required: true
      }
    ],
    documents: [
      {
        id: 'doc-1',
        name: 'Cloud Infrastructure Audit Report',
        type: DocumentType.REPORT,
        url: '/audits/cloud-infra-2024-q4.pdf',
        size: 2048576,
        uploadedBy: 'user-3',
        uploadedAt: new Date('2024-11-20'),
        description: 'Complete audit findings and recommendations'
      },
      {
        id: 'doc-2',
        name: 'IAM Roles Analysis',
        type: DocumentType.EVIDENCE,
        url: '/audits/iam-analysis-2024.xlsx',
        size: 512000,
        uploadedBy: 'user-4',
        uploadedAt: new Date('2024-10-22'),
        description: 'Detailed analysis of all IAM roles and permissions'
      }
    ],
    relatedAudits: ['audit-5', 'audit-8'],
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-11-20')
  },
  {
    id: 'audit-2',
    title: 'PCI-DSS Compliance Review - Payment Gateway',
    type: EventType.REGULATORY_AUDIT,
    description: 'Annual PCI-DSS compliance audit for payment processing systems.',
    auditDate: new Date('2024-09-10'),
    completedDate: new Date('2024-10-05'),
    status: AuditStatus.COMPLETED,
    entity: {
      type: EntityType.APPLICATION,
      id: 'app-payment',
      name: 'Payment Gateway',
      tag: 'financial'
    },
    auditor: 'user-6',
    score: 92,
    riskLevel: AuditRiskLevel.LOW,
    findings: [
      {
        id: 'finding-3',
        title: 'Incomplete Logging Configuration',
        description: 'Some payment transaction logs missing required fields.',
        severity: FindingSeverity.LOW,
        status: FindingStatus.RESOLVED,
        remediation: 'Updated logging configuration to capture all required fields.',
        dueDate: new Date('2024-09-30'),
        assignee: 'user-7',
        createdAt: new Date('2024-09-12')
      }
    ],
    questions: [
      {
        id: 'q3',
        question: 'Is cardholder data encrypted at rest and in transit?',
        category: 'Data Protection',
        answer: 'Yes, using AES-256 encryption for data at rest and TLS 1.3 for data in transit.',
        evidence: ['encryption-config.pdf', 'tls-certificate.pem'],
        score: 100,
        required: true
      }
    ],
    documents: [
      {
        id: 'doc-3',
        name: 'PCI-DSS Compliance Report',
        type: DocumentType.REPORT,
        url: '/audits/pci-dss-2024.pdf',
        size: 1536000,
        uploadedBy: 'user-6',
        uploadedAt: new Date('2024-10-05'),
        description: 'PCI-DSS compliance assessment results'
      }
    ],
    relatedAudits: ['audit-6'],
    createdAt: new Date('2024-08-15'),
    updatedAt: new Date('2024-10-05')
  },
  {
    id: 'audit-3',
    title: 'API Security Assessment - Customer Portal',
    type: EventType.INTERNAL_AUDIT,
    description: 'Security review of customer-facing API endpoints and authentication mechanisms.',
    auditDate: new Date('2024-06-01'),
    completedDate: new Date('2024-07-15'),
    status: AuditStatus.COMPLETED,
    entity: {
      type: EntityType.PRODUCT,
      id: 'product-portal',
      name: 'Customer Portal API',
      tag: 'api'
    },
    auditor: 'user-3',
    score: 78,
    riskLevel: AuditRiskLevel.MEDIUM,
    findings: [
      {
        id: 'finding-4',
        title: 'Rate Limiting Not Implemented',
        description: 'API endpoints lack proper rate limiting controls.',
        severity: FindingSeverity.HIGH,
        status: FindingStatus.IN_PROGRESS,
        dueDate: new Date('2025-01-15'),
        assignee: 'user-8',
        createdAt: new Date('2024-06-05')
      }
    ],
    questions: [],
    documents: [],
    relatedAudits: ['audit-7'],
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-07-15')
  },
  {
    id: 'audit-4',
    title: 'CORE-2024-015: Data Backup Procedures Review',
    type: EventType.CORE_ISSUE,
    description: 'Review of data backup and recovery procedures following incident CORE-2024-015.',
    auditDate: new Date('2024-03-20'),
    completedDate: new Date('2024-04-10'),
    status: AuditStatus.COMPLETED,
    entity: {
      type: EntityType.PLATFORM,
      id: 'platform-storage',
      name: 'Storage Platform',
      tag: 'storage'
    },
    auditor: 'user-9',
    score: 65,
    riskLevel: AuditRiskLevel.HIGH,
    findings: [
      {
        id: 'finding-5',
        title: 'Backup Testing Not Performed',
        description: 'Backup recovery testing not performed in last 12 months.',
        severity: FindingSeverity.HIGH,
        status: FindingStatus.RESOLVED,
        remediation: 'Implemented quarterly backup testing schedule.',
        dueDate: new Date('2024-05-01'),
        assignee: 'user-10',
        createdAt: new Date('2024-03-25')
      }
    ],
    questions: [],
    documents: [],
    relatedAudits: [],
    createdAt: new Date('2024-03-01'),
    updatedAt: new Date('2024-04-10')
  },
  {
    id: 'audit-5',
    title: 'Q2 2023 - AWS Infrastructure Audit',
    type: EventType.INTERNAL_AUDIT,
    description: 'Previous year AWS infrastructure security assessment.',
    auditDate: new Date('2023-04-15'),
    completedDate: new Date('2023-06-01'),
    status: AuditStatus.COMPLETED,
    entity: {
      type: EntityType.PLATFORM,
      id: 'platform-aws',
      name: 'AWS Platform',
      tag: 'cloud'
    },
    auditor: 'user-3',
    score: 82,
    riskLevel: AuditRiskLevel.MEDIUM,
    findings: [],
    questions: [],
    documents: [],
    relatedAudits: ['audit-1'],
    createdAt: new Date('2023-03-01'),
    updatedAt: new Date('2023-06-01')
  }
];

export const useAuditHistoryStore = create<AuditHistoryState>()(
  persist(
    (set, get) => ({
      audits: mockAudits,
      selectedAudit: null,
      filters: {},

      setFilters: (newFilters) => {
        set(state => ({
          filters: { ...state.filters, ...newFilters }
        }));
      },

      selectAudit: (auditId) => {
        const audit = auditId ? get().getAuditById(auditId) : null;
        set({ selectedAudit: audit });
      },

      getAuditById: (id) => {
        return get().audits.find(audit => audit.id === id);
      },

      getRelatedAudits: (auditId) => {
        const audit = get().getAuditById(auditId);
        if (!audit) return [];
        
        return audit.relatedAudits
          .map(id => get().getAuditById(id))
          .filter(Boolean) as AuditRecord[];
      },

      getFilteredAudits: () => {
        const { audits, filters } = get();
        
        return audits.filter(audit => {
          if (filters.type && audit.type !== filters.type) return false;
          if (filters.status && audit.status !== filters.status) return false;
          if (filters.riskLevel && audit.riskLevel !== filters.riskLevel) return false;
          if (filters.entity && audit.entity.id !== filters.entity) return false;
          if (filters.dateRange) {
            const auditDate = audit.auditDate;
            if (auditDate < filters.dateRange.start || auditDate > filters.dateRange.end) {
              return false;
            }
          }
          return true;
        });
      }
    }),
    {
      name: 'trc-audit-history-storage',
      partialize: (state) => ({
        filters: state.filters
      }),
      skipHydration: false,
      onRehydrateStorage: () => (state) => {
        // Convert string dates back to Date objects after hydration
        if (state?.filters?.dateRange) {
          state.filters.dateRange = {
            start: new Date(state.filters.dateRange.start),
            end: new Date(state.filters.dateRange.end)
          };
        }
      }
    }
  )
);