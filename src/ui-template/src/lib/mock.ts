import { Item, User } from "@/lib/types";

export const MOCK_ITEMS: Item[] = [
  {
    id: "1",
    title: "Design system setup",
    description: "Establish base tokens, colour palette, and typography scale for the product.",
    status: "ACTIVE",
    createdAt: "2025-03-10T09:00:00Z",
    updatedAt: "2025-04-01T14:22:00Z",
  },
  {
    id: "2",
    title: "User onboarding flow",
    description: "Build the multi-step onboarding wizard shown to new signups on first login.",
    status: "ACTIVE",
    createdAt: "2025-03-15T11:30:00Z",
    updatedAt: "2025-04-10T08:45:00Z",
  },
  {
    id: "3",
    title: "API rate limiting",
    description: "Implement per-user request throttling on all write endpoints.",
    status: "ACTIVE",
    createdAt: "2025-03-20T16:00:00Z",
    updatedAt: "2025-04-12T10:00:00Z",
  },
  {
    id: "4",
    title: "Email notification service",
    description: "Integrate transactional email for account events using a third-party provider.",
    status: "ARCHIVED",
    createdAt: "2025-02-01T08:00:00Z",
    updatedAt: "2025-02-28T17:00:00Z",
  },
  {
    id: "5",
    title: "Analytics dashboard",
    description: "Charts and summary cards for daily active users, retention, and revenue metrics.",
    status: "ACTIVE",
    createdAt: "2025-04-01T10:00:00Z",
    updatedAt: "2025-04-18T09:30:00Z",
  },
  {
    id: "6",
    title: "Dark mode support",
    description: "Add system-preference detection and manual toggle persisted to localStorage.",
    status: "ARCHIVED",
    createdAt: "2025-01-15T09:00:00Z",
    updatedAt: "2025-02-10T15:00:00Z",
  },
  {
    id: "7",
    title: "Mobile responsive layout",
    description: "Audit all pages for breakpoint issues and fix navigation on small screens.",
    status: "ACTIVE",
    createdAt: "2025-04-05T13:00:00Z",
    updatedAt: "2025-04-20T11:00:00Z",
  },
];

export const MOCK_USERS: User[] = [
  { id: "u1", name: "Amara Osei", email: "amara@example.com" },
  { id: "u2", name: "Ben Hartley", email: "ben@example.com" },
  { id: "u3", name: "Chisom Eze", email: "chisom@example.com" },
  { id: "u4", name: "Dana Müller", email: "dana@example.com" },
  { id: "u5", name: "Elan Ruiz", email: "elan@example.com" },
];
