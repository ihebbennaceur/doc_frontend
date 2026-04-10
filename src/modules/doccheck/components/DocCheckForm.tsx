'use client';

import React, { useState } from 'react';
import { Button } from '@/components/Button';
import { Input } from '@/components/InputComponent';
import { Card } from '@/components/CardComponent';
import { apiClient } from '@/shared/utils/api';
import { validateEmail } from '@/shared/utils/helpers';

export const DocCheckForm: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    propertyType: 'apartment',
    propertyLocation: '',
    isMortgaged: false,
    isInherited: false,
  });

  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.email || !validateEmail(formData.email)) {
      newErrors.email = 'Valid email required';
    }
    if (!formData.propertyLocation) {
      newErrors.propertyLocation = 'Property location required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);
    try {
      const response = await apiClient.startAssessment(formData);
      setSessionId(response.data.data.session_id);
      setErrors({});
    } catch (error: any) {
      setErrors({ submit: error.response?.data?.message || 'Assessment failed' });
    } finally {
      setLoading(false);
    }
  };

  if (sessionId) {
    return (
      <Card variant="elevated" padding="lg">
        <h2 className="text-2xl font-heading font-bold text-primary mb-4">
          Assessment Started
        </h2>
        <p className="text-text-dark mb-4">
          Session ID: <code className="bg-gray-200 px-2 py-1">{sessionId}</code>
        </p>
        <p className="text-gray-600">
          Your assessment has been created. You can now view your results.
        </p>
      </Card>
    );
  }

  return (
    <Card variant="elevated" padding="lg" className="max-w-2xl">
      <h1 className="text-3xl font-heading font-bold text-primary mb-6">
        Free Document Assessment
      </h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          error={errors.email}
          required
        />

        <div>
          <label className="block text-sm font-medium text-text-dark mb-2">
            Property Type
          </label>
          <select
            name="propertyType"
            value={formData.propertyType}
            onChange={handleChange}
            className="w-full px-4 py-2 border-2 border-gray-200 rounded-md focus:border-primary"
          >
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="quinta">Quinta</option>
          </select>
        </div>

        <Input
          label="Property Location (District)"
          name="propertyLocation"
          value={formData.propertyLocation}
          onChange={handleChange}
          placeholder="e.g., Lisbon"
          error={errors.propertyLocation}
          required
        />

        <div className="space-y-3">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isMortgaged"
              checked={formData.isMortgaged}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="ml-3 text-text-dark">Property is mortgaged</span>
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isInherited"
              checked={formData.isInherited}
              onChange={handleChange}
              className="w-4 h-4 text-primary rounded"
            />
            <span className="ml-3 text-text-dark">Property was inherited</span>
          </label>
        </div>

        {errors.submit && <p className="text-error text-sm">{errors.submit}</p>}

        <Button type="submit" variant="primary" size="lg" isLoading={loading} className="w-full">
          Start Assessment
        </Button>
      </form>
    </Card>
  );
};
