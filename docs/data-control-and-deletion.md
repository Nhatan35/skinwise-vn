# Data Control and Deletion

## 1. Purpose

SkinWise VN lets authenticated users control and delete their SkinWise VN app-level data.

This is app data deletion. It is not Google account deletion, OAuth provider deletion, or identity-provider account removal.

## 2. What Delete App Data Removes

The current `DELETE /api/account/app-data` implementation removes only current-user app data from existing SkinWise VN collections:

* Skin profile records.
* Saved product records.
* Routine records.
* Routine log records.
* Routine analysis records.
* Skin journal records.

It also preserves the app user profile record and resets `onboardingCompleted` to `false` when that profile exists and onboarding was previously completed.

## 3. What Delete App Data Does Not Remove

The delete app data workflow does not remove:

* The user's Google account.
* OAuth provider data.
* OAuth provider configuration.
* Auth.js account, session, or verification-token collections.
* Global product catalogue data.
* Global ingredient library data.
* Shared catalogue data.
* Another user's data.
* Production configuration.
* Release, audit, or evidence documentation.

## 4. Authentication and Ownership Boundary

The user must be authenticated before app data can be deleted.

The API resolves the current user on the server and uses the server-resolved authenticated user id as the deletion authority. The client does not control which user's data is deleted.

Malicious client-provided `userId` values in a body or query string must be ignored. Repository deletion filters must remain scoped to the current authenticated user.

## 5. Post-Deletion Expected State

After deletion:

* Dashboard, profile, routine, journal, and insights areas should show empty or onboarding states where applicable.
* Settings should remain accessible.
* The user can continue using the app.
* The user can recreate app data through existing app flows where supported.
* Shared product and ingredient catalogue data should remain available.

## 6. Safety Boundary

Do not expose:

* Secrets.
* Tokens.
* Database URI.
* OAuth credentials.
* Private user data in logs or documentation.
* Raw production database documents.
* Raw stack traces to users.

API responses for deletion should remain safe, wrapped in the existing account API response convention, and should not include raw database documents, auth internals, session data, cookies, tokens, passwords, or sensitive operational details.

## 7. Known Limitations

Full browser/manual deletion smoke verification is not recorded in this document unless it is explicitly performed.

Deletion applies only to SkinWise VN app-level data controlled by the app. Google/OAuth account deletion must be handled outside SkinWise VN through the relevant identity provider.

Production deletion smoke verification is not claimed unless the deployed app is directly checked with appropriate non-sensitive access.
