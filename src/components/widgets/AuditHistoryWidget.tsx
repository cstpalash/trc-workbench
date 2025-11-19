'use client';

import React, { useState, useMemo } from 'react';
import { useAuditHistoryStore } from '@/stores/auditHistoryStore';
import { useUserStore } from '@/stores/userStore';
import { 
  AuditRecord, 
  EventType, 
  AuditStatus, 
  AuditRiskLevel,
  FindingSeverity,
  FindingStatus,
  DocumentType
} from '@/types';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowLeftIcon,
  CalendarDaysIcon,
  UserIcon,
  ShieldCheckIcon,
  DocumentArrowDownIcon,
  LinkIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

interface AuditHistoryWidgetProps {
  config?: {
    defaultView?: 'list' | 'detail';
    showFilters?: boolean;
    itemsPerPage?: number;
  };
}

export function AuditHistoryWidget({ config = {} }: AuditHistoryWidgetProps) {
  const {
    audits,
    selectedAudit,
    filters,
    setFilters,
    selectAudit,
    getFilteredAudits,
    getRelatedAudits
  } = useAuditHistoryStore();
  
  const { users } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(config.showFilters ?? true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = config.itemsPerPage ?? 10;

  const filteredAudits = useMemo(() => {
    const baseFiltered = getFilteredAudits();
    
    if (!searchTerm) return baseFiltered;
    
    return baseFiltered.filter(audit =>
      audit.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      audit.entity.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [getFilteredAudits, searchTerm]);

  const paginatedAudits = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAudits.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAudits, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAudits.length / itemsPerPage);

  const getUserById = (userId: string) => {
    return users.find(user => user.id === userId);
  };

  const getRiskColor = (riskLevel: AuditRiskLevel) => {
    switch (riskLevel) {
      case AuditRiskLevel.LOW: return 'text-green-600 bg-green-50';
      case AuditRiskLevel.MEDIUM: return 'text-yellow-600 bg-yellow-50';
      case AuditRiskLevel.HIGH: return 'text-red-600 bg-red-50';
      case AuditRiskLevel.CRITICAL: return 'text-red-700 bg-red-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: AuditStatus) => {
    switch (status) {
      case AuditStatus.COMPLETED: return 'text-green-700 bg-green-100';
      case AuditStatus.IN_PROGRESS: return 'text-blue-700 bg-blue-100';
      case AuditStatus.PLANNED: return 'text-gray-700 bg-gray-100';
      case AuditStatus.CANCELLED: return 'text-red-700 bg-red-100';
      case AuditStatus.DRAFT: return 'text-yellow-700 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeColor = (type: EventType) => {
    switch (type) {
      case EventType.INTERNAL_AUDIT: return 'text-blue-700 bg-blue-100';
      case EventType.REGULATORY_AUDIT: return 'text-purple-700 bg-purple-100';
      case EventType.RECERTIFICATION: return 'text-green-700 bg-green-100';
      case EventType.CORE_ISSUE: return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const relatedAudits = selectedAudit ? getRelatedAudits(selectedAudit.id) : [];

  if (selectedAudit) {
    return <AuditDetailView 
      audit={selectedAudit} 
      relatedAudits={relatedAudits}
      onBack={() => selectAudit(null)}
      getUserById={getUserById}
    />;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Audit History</h2>
            <p className="text-sm text-gray-500">
              {filteredAudits.length} audit{filteredAudits.length !== 1 ? 's' : ''} from the last 3 years
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors",
              showFilters ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
            )}
          >
            <FunnelIcon className="w-4 h-4" />
            Filters
          </button>
        </div>

        {/* Search */}
        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search audits..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
            />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <select
              value={filters.type || ''}
              onChange={(e) => setFilters({ type: e.target.value as EventType || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white"
            >
              <option value="">All Types</option>
              <option value={EventType.INTERNAL_AUDIT}>Internal Audit</option>
              <option value={EventType.REGULATORY_AUDIT}>Regulatory Audit</option>
              <option value={EventType.RECERTIFICATION}>Recertification</option>
              <option value={EventType.CORE_ISSUE}>CORE Issue</option>
            </select>

            <select
              value={filters.status || ''}
              onChange={(e) => setFilters({ status: e.target.value as AuditStatus || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white"
            >
              <option value="">All Statuses</option>
              <option value={AuditStatus.COMPLETED}>Completed</option>
              <option value={AuditStatus.IN_PROGRESS}>In Progress</option>
              <option value={AuditStatus.PLANNED}>Planned</option>
              <option value={AuditStatus.CANCELLED}>Cancelled</option>
            </select>

            <select
              value={filters.riskLevel || ''}
              onChange={(e) => setFilters({ riskLevel: e.target.value as AuditRiskLevel || undefined })}
              className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-sm text-gray-900 bg-white"
            >
              <option value="">All Risk Levels</option>
              <option value={AuditRiskLevel.LOW}>Low Risk</option>
              <option value={AuditRiskLevel.MEDIUM}>Medium Risk</option>
              <option value={AuditRiskLevel.HIGH}>High Risk</option>
              <option value={AuditRiskLevel.CRITICAL}>Critical Risk</option>
            </select>

            <button
              onClick={() => setFilters({})}
              className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md border border-gray-300"
            >
              Clear All
            </button>
          </div>
        )}
      </div>

      {/* Audit List */}
      <div className="flex-1 overflow-y-auto">
        <div className="divide-y divide-gray-200">
          {paginatedAudits.map((audit) => (
            <div
              key={audit.id}
              onClick={() => selectAudit(audit.id)}
              className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-gray-900">{audit.title}</h3>
                    <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getTypeColor(audit.type))}>
                      {audit.type.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3">{audit.description}</p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>{audit.auditDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <UserIcon className="w-4 h-4" />
                      <span>{getUserById(audit.auditor)?.name || 'Unknown'}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ShieldCheckIcon className="w-4 h-4" />
                      <span>{audit.entity.name}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col items-end space-y-2">
                  <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getStatusColor(audit.status))}>
                    {audit.status.replace('_', ' ')}
                  </span>
                  <span className={cn("px-2 py-1 text-xs font-medium rounded-full", getRiskColor(audit.riskLevel))}>
                    {audit.riskLevel} risk
                  </span>
                  {audit.score !== undefined && (
                    <div className="text-sm font-medium text-gray-900">
                      Score: {audit.score}%
                    </div>
                  )}
                </div>
              </div>
              
              {audit.findings.length > 0 && (
                <div className="mt-3 flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1 text-red-600">
                    <ExclamationTriangleIcon className="w-4 h-4" />
                    <span>{audit.findings.filter(f => f.status === FindingStatus.OPEN).length} open findings</span>
                  </div>
                  <div className="flex items-center space-x-1 text-green-600">
                    <CheckCircleIcon className="w-4 h-4" />
                    <span>{audit.findings.filter(f => f.status === FindingStatus.RESOLVED).length} resolved</span>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredAudits.length === 0 && (
          <div className="text-center py-12">
            <DocumentTextIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">No audits found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white px-4 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAudits.length)} of{' '}
                {filteredAudits.length} results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-700">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function AuditDetailView({ 
  audit, 
  relatedAudits, 
  onBack, 
  getUserById 
}: { 
  audit: AuditRecord;
  relatedAudits: AuditRecord[];
  onBack: () => void;
  getUserById: (id: string) => any;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'findings' | 'questions' | 'documents'>('overview');

  const openFindings = audit.findings.filter(f => f.status === FindingStatus.OPEN);
  const resolvedFindings = audit.findings.filter(f => f.status === FindingStatus.RESOLVED);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="flex-shrink-0 border-b border-gray-200 bg-white px-6 py-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{audit.title}</h2>
            <p className="text-sm text-gray-500">{audit.entity.name}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4">
          <nav className="flex space-x-8">
            {[
              { key: 'overview', label: 'Overview', icon: DocumentTextIcon },
              { key: 'findings', label: `Findings (${audit.findings.length})`, icon: ExclamationTriangleIcon },
              { key: 'questions', label: `Questions (${audit.questions.length})`, icon: ClockIcon },
              { key: 'documents', label: `Documents (${audit.documents.length})`, icon: DocumentArrowDownIcon }
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  "flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                  activeTab === tab.key
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                )}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Audit Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Status</div>
                <div className="text-lg font-semibold text-gray-900">{audit.status.replace('_', ' ')}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Risk Level</div>
                <div className="text-lg font-semibold text-gray-900">{audit.riskLevel}</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-500 mb-1">Score</div>
                <div className="text-lg font-semibold text-gray-900">{audit.score || 'N/A'}%</div>
              </div>
            </div>

            {/* Description */}
            {audit.description && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Description</h3>
                <p className="text-gray-600">{audit.description}</p>
              </div>
            )}

            {/* Related Audits */}
            {relatedAudits.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Related Audits</h3>
                <div className="space-y-2">
                  {relatedAudits.map(related => (
                    <div key={related.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <LinkIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-900">{related.title}</span>
                      <span className="text-xs text-gray-500">{related.auditDate.toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'findings' && (
          <div className="space-y-6">
            {openFindings.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-red-700 mb-3">Open Findings</h3>
                <div className="space-y-4">
                  {openFindings.map(finding => (
                    <div key={finding.id} className="border border-red-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{finding.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span>Severity: {finding.severity}</span>
                        <span>Due: {finding.dueDate?.toLocaleDateString()}</span>
                        <span>Assignee: {getUserById(finding.assignee || '')?.name || 'Unassigned'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {resolvedFindings.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-green-700 mb-3">Resolved Findings</h3>
                <div className="space-y-4">
                  {resolvedFindings.map(finding => (
                    <div key={finding.id} className="border border-green-200 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900">{finding.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{finding.description}</p>
                      {finding.remediation && (
                        <p className="text-sm text-green-700 mt-2">
                          <strong>Remediation:</strong> {finding.remediation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {audit.findings.length === 0 && (
              <div className="text-center py-8">
                <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No findings</h3>
                <p className="text-gray-500">This audit had no findings to report.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-4">
            {audit.questions.map(question => (
              <div key={question.id} className="border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900">{question.question}</h4>
                <div className="text-sm text-gray-500 mt-1">Category: {question.category}</div>
                {question.answer && (
                  <p className="text-sm text-gray-700 mt-3">
                    <strong>Answer:</strong> {question.answer}
                  </p>
                )}
                {question.score !== undefined && (
                  <div className="text-sm font-medium text-blue-600 mt-2">
                    Score: {question.score}%
                  </div>
                )}
              </div>
            ))}

            {audit.questions.length === 0 && (
              <div className="text-center py-8">
                <ClockIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No questions</h3>
                <p className="text-gray-500">No audit questions were recorded.</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div className="space-y-4">
            {audit.documents.map(document => (
              <div key={document.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <DocumentArrowDownIcon className="w-8 h-8 text-gray-400" />
                  <div>
                    <h4 className="font-medium text-gray-900">{document.name}</h4>
                    <div className="text-sm text-gray-500">
                      {document.type} • {Math.round((document.size || 0) / 1024)} KB
                    </div>
                    {document.description && (
                      <p className="text-sm text-gray-600 mt-1">{document.description}</p>
                    )}
                  </div>
                </div>
                <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  Download
                </button>
              </div>
            ))}

            {audit.documents.length === 0 && (
              <div className="text-center py-8">
                <DocumentArrowDownIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600">No documents</h3>
                <p className="text-gray-500">No documents were attached to this audit.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}