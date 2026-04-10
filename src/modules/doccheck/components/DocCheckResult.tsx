'use client';

import React from 'react';
import { Card } from '@/components/CardComponent';
import { DOCUMENT_TYPES, SERVICE_TIERS } from '@/shared/theme/colors';
import { formatCurrency } from '@/shared/utils/helpers';

interface DocCheckResultProps {
  missingDocuments: string[];
  recommendedTier: string;
  totalCost: number;
  estimatedDays: number;
}

export const DocCheckResult: React.FC<DocCheckResultProps> = ({
  missingDocuments,
  recommendedTier,
  totalCost,
  estimatedDays,
}) => {
  const tier = SERVICE_TIERS[recommendedTier as keyof typeof SERVICE_TIERS];

  return (
    <div className="space-y-6 max-w-4xl">
      <Card variant="elevated" padding="lg">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">
          Your Assessment Results
        </h2>

        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Documents Missing</p>
            <p className="text-3xl font-bold text-info">{missingDocuments.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Estimated Cost</p>
            <p className="text-3xl font-bold text-success">{formatCurrency(totalCost)}</p>
          </div>
          <div className="bg-orange-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Turnaround Time</p>
            <p className="text-3xl font-bold text-warning">{estimatedDays} days</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-text-dark mb-3">Missing Documents</h3>
          <ul className="space-y-2">
            {missingDocuments.map((docType) => {
              const doc = DOCUMENT_TYPES[docType as keyof typeof DOCUMENT_TYPES];
              return (
                <li key={docType} className="flex items-start p-3 bg-gray-50 rounded">
                  <span className="text-error mr-3">✕</span>
                  <div>
                    <p className="font-medium text-text-dark">{doc?.name}</p>
                    <p className="text-sm text-gray-600">
                      Issuer: {doc?.issuer} • Cost: {formatCurrency(doc?.cost || 0)}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </Card>

      <Card variant="outlined" padding="lg">
        <h3 className="text-lg font-bold text-primary mb-3">Recommended Service Tier</h3>
        {tier && (
          <div>
            <h4 className="text-xl font-bold text-text-dark mb-2">{tier.name}</h4>
            <p className="text-gray-600 mb-3">{tier.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Documents Included</p>
                <p className="text-lg font-bold text-primary">{tier.includedDocuments}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Turnaround</p>
                <p className="text-lg font-bold text-primary">{tier.turnaroundDays} days</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
