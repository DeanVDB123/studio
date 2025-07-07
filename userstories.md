# HonouredLives User Stories

This document captures the user stories identified from the development process, reflecting the intended functionality and user-facing features of the HonouredLives application.

---

## Memorial Management & Viewing

- **As a user**, when I delete a memorial, the action should be handled securely, and my dashboard should automatically refresh to reflect the change.
- **As an app administrator**, I want memorials that I own to be publicly visible indefinitely, regardless of their assigned plan or expiry date, so that administrative or showcase content is always accessible.
- **As a user on the dashboard**, when I open the QR code popover for a memorial, I want to be able to click the QR code itself to open the memorial page in a new tab, making it more interactive.
- **As a user on the dashboard**, since the QR code is now clickable, the redundant "View" icon/button on the memorial card should be removed to simplify the interface.
- **As a user**, when I click any link or QR code to open a memorial page, it should open in a single, reusable browser tab for that specific memorial, preventing multiple tabs of the same page from being created.

## User Authentication & Navigation

- **As any user (logged in or not)**, I should always see the public homepage when I first visit the site, so that I can see the marketing and informational content before deciding to go to my dashboard.
- **As an administrator or a paid user**, I want my status badge ('ADMIN', 'PAID') to be visible in the header, but the 'FREE' badge should be hidden for free users to de-emphasize the default status.

## Plans & Subscriptions

- **As a user upgrading a memorial's plan**, I should only see the paid plan options ('ESSENCE', 'LEGACY', 'ETERNAL') and not the free 'SPIRIT' plan, to avoid confusion and streamline the upgrade process.
- **As a user**, when I click the "Upgrade Now" button for a specific memorial, the subsequent pricing table dialog should correctly identify it as an upgrade flow and hide the 'SPIRIT' plan.
- **As a user on the main dashboard**, I want to upgrade memorials individually via their cards, so the general "Upgrade Now" button on the dashboard should be removed to avoid ambiguity.
- **As a system administrator**, when I upgrade a memorial's plan to a paid tier ('ESSENCE', 'LEGACY', 'ETERNAL'), the system should automatically check the owner's status and upgrade it from 'FREE' to 'PAID' if they don't already have a paid status.
- **As a system administrator**, when a user's last active paid memorial plan is changed or removed (e.g., set to 'SPIRIT'), the system should automatically check their other memorials and, if no other active paid plans exist, downgrade their user status from 'PAID' to 'FREE'.

## Admin Dashboard & Analytics

- **As an administrator viewing the 'All Memorials' table**, I want the plan badges to be visually distinct and thematic, using icons (Leaf, Sprout, Tree, Heart) that correspond to the 'SPIRIT', 'ESSENCE', 'LEGACY', and 'ETERNAL' plans for better readability.
- **As a user on the 'Visits' page**, I want to click an eye icon on a memorial's row to view its visit heatmap in a pop-up dialog, rather than having it expand inline, for a cleaner interface.
- **As a user**, I want the visit heatmap dialog to have a styled header using the application's primary color, making it visually consistent with other dialogs and more readable.
