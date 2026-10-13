# Spec: Registration

## Overview
Lets a new visitor create a Spendly account. The `/register` page already renders a form, but it only handles GET and the form posts to nowhere. This step accepts the POST, validates the input, stores the user with a hashed password in the `users` table created in Step 1, and sends the user on to the login page. It is the first step that writes real user data and is the foundation for login (Step 3).

## Depends on
- Step 1: Database setup (`users` table, `get_db()`, `init_db()`).

## Routes
- `GET /register` — show the registration form — public (exists; redirect-free, no change in behaviour)
- `POST /register` — validate input, create the user, redirect to `/login` — public

(Same endpoint function `register`, now accepting `methods=["GET", "POST"]`.)

## Database changes
No schema changes (the two new helper functions in `database/db.py` are listed under "Files to change"). The existing `users` table (`id`, `name`, `email UNIQUE`, `password_hash`, `created_at`) in `database/db.py` is sufficient. Duplicate emails are rejected by the existing `UNIQUE` constraint plus an explicit pre-check.

## Templates
- Create: none
- Modify:
  - `templates/register.html`
    - Form `action` uses `{{ url_for('register') }}` instead of the hardcoded `/register`.
    - Re-fill `name` and `email` inputs with the submitted values after a validation error (never re-fill password).
    - Keep the existing `{% if error %}` block for showing errors.
  - `templates/login.html`
    - Show a success message when the user arrives after registering (e.g. "Account created. Please sign in.") using a flashed message.

## Files to change
- `database/db.py` — add `get_user_by_email(email)` (returns the row or `None`) and `create_user(name, email, password_hash)` (inserts, returns the new id, raises `sqlite3.IntegrityError` on a duplicate email). All user SQL lives here.
- `app.py` — make `register` accept GET and POST, add validation, call the two `db.py` helpers (no SQL in the route), set `app.secret_key` from an env var (needed for `flash`), import `request`, `redirect`, `url_for`, `flash`.
- `templates/register.html`
- `templates/login.html`
- `static/css/style.css` — styles for the success message (reuse the existing `.auth-error` look with a success variant, using CSS variables).

## Files to create
None.

## New dependencies
No new dependencies.

## Rules for implementation
- No SQLAlchemy or ORMs
- Parameterised queries only (`?` placeholders, never string formatting)
- Passwords hashed with werkzeug (`generate_password_hash`)
- Use CSS variables — never hardcode hex values
- All templates extend `base.html`
- Keep database access in `database/db.py`: the route calls `get_user_by_email` and `create_user`, and the helpers use `get_db()` and always close the connection (try/finally, as the existing helpers do)
- Read the secret key from an environment variable (`SECRET_KEY`) with a clearly dev-only fallback; do not commit a real secret
- Validation (server-side, in this order), each failure re-renders `register.html` with an `error` message and HTTP 400:
  - name, email and password are all present after `.strip()` (password is not stripped)
  - email contains an `@` and is at most 254 characters
  - password is at least 8 characters
  - email is not already registered (compare lower-cased, store lower-cased)
- Never reveal or echo the password in responses or logs
- On success: insert the user, `flash` a success message, `redirect(url_for('login'))` (POST/redirect/GET)
- Do not log the user in yet — sessions belong to Step 3

## Definition of done
- [ ] `python app.py` starts without errors and `GET /register` renders the form
- [ ] Submitting valid name, email and an 8+ character password creates a row in `users` and redirects to `/login`
- [ ] The stored `password_hash` is a werkzeug hash, not the plain password (check with `sqlite3 expense_tracker.db "select email, password_hash from users"`)
- [ ] `/login` shows the "Account created" message after registering, and not on a later reload
- [ ] Registering with an already used email (including different letter case, e.g. `Demo@Spendly.com`) shows an error and creates no new row
- [ ] A password shorter than 8 characters shows an error and creates no row
- [ ] Empty or whitespace-only name or email shows an error and creates no row
- [ ] After an error, name and email are still filled in; password is empty
- [ ] An email like `x' OR '1'='1` does not break the page or the database
- [ ] The form action in the page source comes from `url_for`, and no hex colours were added to `style.css`
