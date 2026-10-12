# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Spendly is a small Flask expense-tracker app, built as a step-by-step teaching project. It is only partly implemented: the landing, login, register, privacy and terms routes render templates, and the other routes are placeholder strings (`/logout`, `/profile`, `/expenses/add`, `/expenses/<id>/edit`, `/expenses/<id>/delete`) labelled with the step that should implement them.

## Commands

```bash
pip install -r requirements.txt   # Flask, Werkzeug, pytest, pytest-flask
python app.py                     # dev server, debug on, http://localhost:5001 (host 0.0.0.0)
pytest                            # run tests (no tests exist yet)
pytest path/to/test_file.py::test_name   # run a single test
```

A git-ignored `venv/` exists in the repo root; the dev container also installs requirements on creation.

## Architecture

- `app.py`: single Flask app with all routes defined inline (no blueprints). Routes mostly just `render_template`. The dev server uses port 5001, which is also the port the devcontainer forwards.
- `database/db.py`: currently only a comment stub. The intended design is `get_db()` (SQLite connection with `row_factory` and foreign keys enabled), `init_db()` (`CREATE TABLE IF NOT EXISTS`) and `seed_db()` (sample data). Nothing calls it yet and `app.py` has no DB wiring.
- `templates/`: every page extends `base.html`, which holds the navbar, the footer (with Privacy and Terms links) and the `title`, `head` and `content` blocks. Use `url_for('<endpoint>')` for links. Endpoint names are the route function names, e.g. `landing`, `login`, `register`.
- `static/css/style.css` and `static/js/main.js`: all styling and JS live in these two files. The landing page's "See how it works" video opens in a closable modal.

## Notes

- `environment-notes.md` documents the Windows, Docker Desktop and WSL2 dev-container setup. Its author is new to Docker and wants plain-language explanations and a check before project or Docker setting changes.
- Keep secrets out of the repo (use env vars or a git-ignored `.env`).
