'use client';

import React from 'react';
import { useNotification } from '@/shared/context/NotificationContext';
import { BRAND_COLORS, SPACING, BORDER_RADIUS, FONT_SIZES } from '@/shared/theme/colors';
import { useLanguage } from '@/shared/context/LanguageContext';

export const NotificationsCenter: React.FC = () => {
  const { notifications, unreadCount, markAsRead, removeNotification, markAllAsRead } = useNotification();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = React.useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'document_verified':
        return '✅';
      case 'document_rejected':
        return '❌';
      case 'document_status_changed':
      default:
        return '📋';
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          fontSize: FONT_SIZES.xl,
          cursor: 'pointer',
          padding: SPACING.md,
        }}
      >
        🔔
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '0',
              right: '0',
              backgroundColor: '#D32F2F',
              color: 'white',
              borderRadius: '50%',
              width: '24px',
              height: '24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: FONT_SIZES.xs,
              fontWeight: 600,
            }}
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            right: '0',
            width: '380px',
            backgroundColor: 'white',
            borderRadius: BORDER_RADIUS.md,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
            zIndex: 1000,
            marginTop: SPACING.md,
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: SPACING.lg,
              borderBottom: `1px solid ${BRAND_COLORS.lightGray}`,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <h3
              style={{
                margin: 0,
                fontSize: FONT_SIZES.base,
                fontWeight: 700,
                color: BRAND_COLORS.textDark,
              }}
            >
              {t('notification.title')}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                style={{
                  background: 'none',
                  border: 'none',
                  color: BRAND_COLORS.primary,
                  fontSize: FONT_SIZES.xs,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('notification.markAsRead')}
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div
            style={{
              maxHeight: '400px',
              overflowY: 'auto',
            }}
          >
            {notifications.length === 0 ? (
              <div
                style={{
                  padding: SPACING.xl,
                  textAlign: 'center',
                  color: BRAND_COLORS.mediumGray,
                }}
              >
                <p style={{ fontSize: FONT_SIZES.sm, margin: 0 }}>
                  {t('notification.noNotifications')}
                </p>
              </div>
            ) : (
              notifications.map((notif) => {
                return (
                  <div
                    key={notif.id}
                    onClick={() => markAsRead(notif.id)}
                    style={{
                      padding: SPACING.lg,
                      borderBottom: `1px solid ${BRAND_COLORS.lightGray}`,
                      backgroundColor: notif.isRead ? 'white' : '#F5F5F5',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        gap: SPACING.md,
                        alignItems: 'flex-start',
                      }}
                    >
                      <span style={{ fontSize: FONT_SIZES.lg }}>
                        {getNotificationIcon(notif.type)}
                      </span>
                      <div style={{ flex: 1 }}>
                        <p
                          style={{
                            margin: 0,
                            fontSize: FONT_SIZES.sm,
                            fontWeight: 600,
                            color: BRAND_COLORS.textDark,
                          }}
                        >
                          {notif.title}
                        </p>
                        <p
                          style={{
                            margin: `${SPACING.xs} 0 0`,
                            fontSize: FONT_SIZES.xs,
                            color: BRAND_COLORS.mediumGray,
                          }}
                        >
                          {notif.message}
                        </p>
                        <p
                          style={{
                            margin: `${SPACING.xs} 0 0`,
                            fontSize: FONT_SIZES.xs,
                            color: BRAND_COLORS.lightGray,
                          }}
                        >
                          {new Date(notif.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeNotification(notif.id);
                        }}
                        style={{
                          background: 'none',
                          border: 'none',
                          fontSize: FONT_SIZES.base,
                          cursor: 'pointer',
                          color: BRAND_COLORS.lightGray,
                        }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationsCenter;
