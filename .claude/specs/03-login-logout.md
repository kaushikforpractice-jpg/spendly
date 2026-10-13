# Spec: Login and Logout

## Overview
Lets a registered user sign in and out. `/login` currently renders a form but only accepts GET, so submitting it returns 405, and `/logout` is a placeholder string. This step checks the submitted email and password against the `users` table, remembers the user in a Flask session, and lets them sign out again. It also makes the navbar show different links to signed-in and signed-out visitors. Registration (Step 2) created the users; later steps (profile, expenses) need to know who is signed in.

## Depends on
- Step 1: Database setup (`users` table, `get_db()`).
- Step 2: Registration (`create_user`, `get_user_by_email`, `app.secret_key`, flashed messages on `/login`).

## Routes
- `GET /login` — show the sign-in form; if already signed in, redirect to `/` — public
- `POST /login` — check credentials, start the session, redirect to `/` — public
- `POST /logout` — clear the session, flash "You have been signed out.", redirect to `/login` — logged-in (a signed-out POST just redirects to `/login`)

Notes:
- `/logout` changes from the placeholder GET route to POST only, so a link or an image on another site cannot sign a user out. The navbar uses a small form with a button.
- `GET /register` also redirects to `/` when already signed in. `POST /register` is unchanged.
- No `next` redirect parameter, so there is no open-redirect risk. Successful login always goes to `/`.
- `/profile`, `/expenses/...` are still placeholders and are not protected in this step.

## Database changes
No schema changes. The existing `users` table and `get_user_by_email(email)` are used for login. One new read helper, `get_user_by_id(user_id)`, is added to `database/db.py` so each request can confirm the session's user still exists.

## Templates
- Create: none
- Modify:
  - `templates/login.html`
    - Form `action` uses `{{ url_for('login') }}` instead of the hardcoded `/login`.
    - Re-fill `email` after a failed attempt (never the password).
    - Keep the flashed-message block (it will also show the sign-out message) and the existing `{% if error %}` block.
  - `templates/base.html`
    - Signed out: keep "Sign in" and "Get started".
    - Signed in: show the user's name and a "Sign out" button inside a `<form method="POST" action="{{ url_for('logout') }}">`.

## Files to change
- `database/db.py` — add `get_user_by_id(user_id)` (returns the row or `None`).
- `app.py` — import `session`, `check_password_hash`; make `login` accept GET and POST; make `logout` POST-only and clear the session; redirect signed-in users away from `/login` and `/register` GET; add a `context_processor` that exposes the current user's name to templates; set `SESSION_COOKIE_SAMESITE = "Lax"`.
- `templates/login.html`
- `templates/base.html`
- `static/css/style.css` — style the signed-in navbar items (user name, sign-out button styled like a nav link), using CSS variables.

## Files to create
None.

## New dependencies
No new dependencies.

## Rules for implementation
- No SQLAlchemy or ORMs
- Parameterised queries only (reuse `get_user_by_email`; no SQL in the route)
- Passwords hashed with werkzeug; verify with `check_password_hash`, never compare plain text
- Use CSS variables — never hardcode hex values
- All templates extend base.html
- Look the user up by `email.strip().lower()`, matching how registration stores it
- Wrong email and wrong password must give the same message ("Invalid email or password.") with HTTP 401, so the form does not reveal which emails exist
- Empty email or password re-renders the form with an error and HTTP 400
- On success store only `session["user_id"]` (and the name for display); call `session.clear()` first so no old session data carries over
- Never put the password or its hash in the session, in flashed messages, or in logs
- Use `redirect(url_for(...))` and POST/redirect/GET; do not accept a `next` parameter
- Keep the secret key from the `SECRET_KEY` environment variable, as in Step 2
- If the user id in a session no longer exists in the database, treat the visitor as signed out (clear the session)

## Definition of done
- [ ] `python app.py` starts without errors; `/login` renders and submitting the form no longer returns 405
- [ ] Signing in as the seed user `demo@spendly.com` / `demo123` redirects to `/` and the navbar shows the name and a "Sign out" button instead of "Sign in" / "Get started"
- [ ] A user created through `/register` can sign in with the password they chose
- [ ] Email is case-insensitive at login (`Demo@Spendly.com` works)
- [ ] A wrong password and an unknown email both show the same "Invalid email or password." message and no session is created
- [ ] Empty email or password shows an error; the email stays filled in after any error and the password never does
- [ ] Clicking "Sign out" returns to `/login` with the "You have been signed out." message, and the navbar shows "Sign in" again
- [ ] After sign-out, visiting `/login` shows the form (not a redirect), and the browser back button does not give access to anything new
- [ ] While signed in, visiting `/login` or `/register` redirects to `/`
- [ ] Opening `/logout` directly in the address bar (GET) returns 405 and does not sign the user out
- [ ] Deleting the user's row from `users` while signed in makes the next page load behave as signed out
- [ ] The password and hash never appear in the page source or the session cookie contents
- [ ] The login form action in the page source comes from `url_for`, and no hex colours were added to `style.css`
