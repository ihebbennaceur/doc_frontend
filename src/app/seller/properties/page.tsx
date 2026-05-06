'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useAuthReady } from '@/shared/hooks/useAuthReady';
import { useFetch } from '@/shared/hooks/useFetch';
import { buildApiUrl } from '@/lib/api-url';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ProtectedRoute } from '@/components/ProtectedRoute';

interface Property {
  id: number;
  title: string;
  address: string;
  city: string;
  price: number;
  status: string;
  document_submissions_count: number;
  completed_documents_count: number;
  total_required_documents: number;
  bedrooms?: number;
  bathrooms?: number;
  area_sqm?: number;
  created_at: string;
}

export default function PropertiesPage() {
  const { isReady } = useAuthReady();
  const { fetchWithAuth } = useFetch();

  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: '',
    postal_code: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    area_sqm: '',
    description: '',
  });
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!isReady) return;

      try {
        const res = await fetchWithAuth(buildApiUrl('/properties/'), {
          method: 'GET',
        });

        if (res.ok) {
          const data = await res.json();
          setProperties(data.results || data);
        }
      } catch (err) {
        console.error('Failed to fetch properties:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isReady) {
      fetchProperties();
    }
  }, [isReady, fetchWithAuth]);

  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const payload = {
        title: formData.title,
        address: formData.address,
        city: formData.city,
        postal_code: formData.postal_code,
        price: formData.price ? parseFloat(formData.price) : null,
        bedrooms: formData.bedrooms ? parseInt(formData.bedrooms) : null,
        bathrooms: formData.bathrooms ? parseInt(formData.bathrooms) : null,
        area_sqm: formData.area_sqm ? parseFloat(formData.area_sqm) : null,
        description: formData.description,
      };

      const res = await fetchWithAuth(buildApiUrl('/properties/'), {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const newProperty = await res.json();
        setProperties([newProperty, ...properties]);
        setShowForm(false);
        setFormData({
          title: '',
          address: '',
          city: '',
          postal_code: '',
          price: '',
          bedrooms: '',
          bathrooms: '',
          area_sqm: '',
          description: '',
        });
        alert('Property created successfully!');
      } else {
        const error = await res.json();
        alert(`Failed to create property: ${JSON.stringify(error)}`);
      }
    } catch (err) {
      console.error('Error creating property:', err);
      alert('Failed to create property');
    } finally {
      setCreating(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'active':
        return BRAND_COLORS.success;
      case 'sold':
        return '#9C27B0'; // Purple
      case 'pending':
        return BRAND_COLORS.warning;
      default:
        return BRAND_COLORS.lightGray;
    }
  };

  const getCompletionPercentage = (property: Property) => {
    if (property.total_required_documents === 0) return 0;
    return Math.round((property.completed_documents_count / property.total_required_documents) * 100);
  };

  return (
    <ProtectedRoute requiredRole="seller">
      <div style={{ minHeight: '100vh', backgroundColor: BRAND_COLORS.background }}>
        {/* Header */}
        <div style={{
          backgroundColor: BRAND_COLORS.primary,
          color: 'white',
          padding: SPACING.lg,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <h1 style={{ margin: 0, fontSize: FONT_SIZES.xl }}>My Properties</h1>
          <LanguageSwitcher />
        </div>

        {/* Main Content */}
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: SPACING.lg }}>
          {/* Create Property Button */}
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: BRAND_COLORS.primary,
              color: 'white',
              border: 'none',
              padding: `${SPACING.md} ${SPACING.lg}`,
              borderRadius: BORDER_RADIUS.md,
              fontSize: FONT_SIZES.md,
              cursor: 'pointer',
              marginBottom: SPACING.lg,
            }}
          >
            {showForm ? 'Cancel' : '+ Add New Property'}
          </button>

          {/* Create Property Form */}
          {showForm && (
            <form
              onSubmit={handleCreateProperty}
              style={{
                backgroundColor: 'white',
                padding: SPACING.lg,
                borderRadius: BORDER_RADIUS.lg,
                marginBottom: SPACING.lg,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.md }}>
                <input
                  type="text"
                  placeholder="Property Title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  style={{
                    padding: SPACING.md,
                    border: `1px solid ${BRAND_COLORS.lightGray}`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: FONT_SIZES.md,
                  }}
                />
                <input
                  type="text"
                  placeholder="Address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  style={{
                    padding: SPACING.md,
                    border: `1px solid ${BRAND_COLORS.lightGray}`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: FONT_SIZES.md,
                  }}
                />
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  required
                  style={{
                    padding: SPACING.md,
                    border: `1px solid ${BRAND_COLORS.lightGray}`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: FONT_SIZES.md,
                  }}
                />
                <input
                  type="text"
                  placeholder="Postal Code"
                  value={formData.postal_code}
                  onChange={(e) => setFormData({ ...formData, postal_code: e.target.value })}
                  style={{
                    padding: SPACING.md,
                    border: `1px solid ${BRAND_COLORS.lightGray}`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: FONT_SIZES.md,
                  }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  step="0.01"
                  style={{
                    padding: SPACING.md,
                    border: `1px solid ${BRAND_COLORS.lightGray}`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: FONT_SIZES.md,
                  }}
                />
                <input
                  type="number"
                  placeholder="Area (sqm)"
                  value={formData.area_sqm}
                  onChange={(e) => setFormData({ ...formData, area_sqm: e.target.value })}
                  step="0.01"
                  style={{
                    padding: SPACING.md,
                    border: `1px solid ${BRAND_COLORS.lightGray}`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: FONT_SIZES.md,
                  }}
                />
                <input
                  type="number"
                  placeholder="Bedrooms"
                  value={formData.bedrooms}
                  onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                  style={{
                    padding: SPACING.md,
                    border: `1px solid ${BRAND_COLORS.lightGray}`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: FONT_SIZES.md,
                  }}
                />
                <input
                  type="number"
                  placeholder="Bathrooms"
                  value={formData.bathrooms}
                  onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                  style={{
                    padding: SPACING.md,
                    border: `1px solid ${BRAND_COLORS.lightGray}`,
                    borderRadius: BORDER_RADIUS.sm,
                    fontSize: FONT_SIZES.md,
                  }}
                />
              </div>
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{
                  width: '100%',
                  marginTop: SPACING.md,
                  padding: SPACING.md,
                  border: `1px solid ${BRAND_COLORS.lightGray}`,
                  borderRadius: BORDER_RADIUS.sm,
                  fontSize: FONT_SIZES.md,
                  minHeight: '100px',
                  fontFamily: 'inherit',
                }}
              />
              <button
                type="submit"
                disabled={creating}
                style={{
                  marginTop: SPACING.md,
                  backgroundColor: BRAND_COLORS.success,
                  color: 'white',
                  border: 'none',
                  padding: `${SPACING.md} ${SPACING.lg}`,
                  borderRadius: BORDER_RADIUS.md,
                  fontSize: FONT_SIZES.md,
                  cursor: creating ? 'not-allowed' : 'pointer',
                  opacity: creating ? 0.7 : 1,
                }}
              >
                {creating ? 'Creating...' : 'Create Property'}
              </button>
            </form>
          )}

          {/* Properties Grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: SPACING.xl }}>
              <p>Loading properties...</p>
            </div>
          ) : properties.length === 0 ? (
            <div style={{ textAlign: 'center', padding: SPACING.xl }}>
              <p style={{ fontSize: FONT_SIZES.lg, color: BRAND_COLORS.textSecondary }}>
                No properties yet. Create your first property to get started!
              </p>
            </div>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: SPACING.lg,
            }}>
              {properties.map((property) => (
                <Link
                  key={property.id}
                  href={`/seller/properties/${property.id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div
                    style={{
                      backgroundColor: 'white',
                      borderRadius: BORDER_RADIUS.lg,
                      padding: SPACING.lg,
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      height: '100%',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                      (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                  >
                    {/* Status Badge */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: SPACING.md }}>
                      <h3 style={{ margin: 0, fontSize: FONT_SIZES.lg, color: BRAND_COLORS.primary }}>
                        {property.title}
                      </h3>
                      <span
                        style={{
                          backgroundColor: getStatusBadgeColor(property.status),
                          color: 'white',
                          padding: `4px 8px`,
                          borderRadius: BORDER_RADIUS.sm,
                          fontSize: FONT_SIZES.sm,
                          textTransform: 'capitalize',
                        }}
                      >
                        {property.status}
                      </span>
                    </div>

                    {/* Property Details */}
                    <p style={{ margin: `0 0 ${SPACING.sm} 0`, color: BRAND_COLORS.textSecondary }}>
                      📍 {property.address}, {property.city}
                    </p>

                    {property.price && (
                      <p style={{ margin: `0 0 ${SPACING.sm} 0`, fontSize: FONT_SIZES.md, fontWeight: 'bold', color: BRAND_COLORS.primary }}>
                        ${property.price.toLocaleString()}
                      </p>
                    )}

                    {/* Property Specs */}
                    <div style={{ display: 'flex', gap: SPACING.md, fontSize: FONT_SIZES.sm, color: BRAND_COLORS.textSecondary, marginBottom: SPACING.md }}>
                      {property.bedrooms && <span>🛏️ {property.bedrooms} Beds</span>}
                      {property.bathrooms && <span>🚿 {property.bathrooms} Baths</span>}
                      {property.area_sqm && <span>📐 {property.area_sqm} sqm</span>}
                    </div>

                    {/* Document Progress */}
                    <div style={{ marginTop: SPACING.md }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: SPACING.sm }}>
                        <span style={{ fontSize: FONT_SIZES.sm, color: BRAND_COLORS.textSecondary }}>
                          Documents
                        </span>
                        <span style={{ fontSize: FONT_SIZES.sm, fontWeight: 'bold', color: BRAND_COLORS.primary }}>
                          {getCompletionPercentage(property)}%
                        </span>
                      </div>
                      <div style={{
                        height: '8px',
                        backgroundColor: BRAND_COLORS.lightGray,
                        borderRadius: BORDER_RADIUS.sm,
                        overflow: 'hidden',
                      }}>
                        <div
                          style={{
                            height: '100%',
                            backgroundColor: BRAND_COLORS.success,
                            width: `${getCompletionPercentage(property)}%`,
                            transition: 'width 0.3s',
                          }}
                        />
                      </div>
                      <p style={{ margin: `${SPACING.sm} 0 0 0`, fontSize: FONT_SIZES.sm, color: BRAND_COLORS.textSecondary }}>
                        {property.completed_documents_count} of {property.total_required_documents} documents
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
