"use client";

import { AdminNotificationsProvider } from "@/_providers/admin-notifications";

export default function AdminClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminNotificationsProvider>{children}</AdminNotificationsProvider>;
}








