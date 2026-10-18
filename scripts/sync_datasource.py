#!/usr/bin/env python3
"""
sync_datasource.py
Ensures index.html contains all data-* hydration targets and keeps static fallback
HTML synchronized with datasource/ files.
"""

import os
import sys
import json
import re

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
INDEX_PATH = os.path.join(ROOT_DIR, "index.html")
DATASOURCE_DIR = os.path.join(ROOT_DIR, "datasource")

def load_json(name):
    with open(os.path.join(DATASOURCE_DIR, name), "r", encoding="utf-8") as f:
        return json.load(f)

def sync():
    if not os.path.exists(INDEX_PATH):
        print(f"[ERR] {INDEX_PATH} not found")
        return False

    with open(INDEX_PATH, "r", encoding="utf-8") as f:
        html = f.read()

    site_cfg = load_json("site-config.json")
    profile = load_json("profile.json")
    projects = load_json("projects.json")

    # Ensure datasource.js is included before script.js
    if '<script src="./assets/js/datasource.js"></script>' not in html:
        html = html.replace(
            '<script src="./assets/js/script.js"></script>',
            '<script src="./assets/js/datasource.js"></script>\n  <script src="./assets/js/script.js"></script>'
        )

    # Ensure key data hooks exist
    hooks = [
        ('class="avatar-box">\n          <img src="./assets/images/my-avatar.png"', 'class="avatar-box">\n          <img src="./assets/images/my-avatar.png" data-profile-avatar'),
        ('<h1 class="name" title="Santhoshkumar R">', '<h1 class="name" title="Santhoshkumar R" data-profile-name>'),
        ('<p class="title">Machine Learning Engineer | Computer Vision | Cloud MLOps & Security</p>', '<p class="title" data-profile-title>Machine Learning Engineer | Computer Vision | Cloud MLOps & Security</p>'),
        ('<div class="sidebar-cred-badge" title="AWS Certified Security – Specialty Verified">', '<div class="sidebar-cred-badge" title="AWS Certified Security – Specialty Verified" data-profile-cred-badge>'),
        ('<ul class="contacts-list">', '<ul class="contacts-list" data-profile-contacts>'),
        ('<ul class="social-list">', '<ul class="social-list" data-profile-socials>'),
        ('<div class="hero-badge-wrap">', '<div class="hero-badge-wrap" data-hero-badges>'),
        ('<h3 class="hero-title">', '<h3 class="hero-title" data-hero-title>'),
        ('<p class="hero-subtitle">', '<p class="hero-subtitle" data-hero-subtitle>'),
        ('<div class="hero-metrics-grid">', '<div class="hero-metrics-grid" data-hero-metrics>'),
        ('<ul class="filter-list">', '<ul class="filter-list" data-project-filters>'),
        ('<div class="project-list" id="projects-container">', '<div class="project-list" id="projects-container" data-projects-container>'),
        ('<div class="skills-category-grid">', '<div class="skills-category-grid" data-skills-grid>'),
        ('<div class="cert-grid">', '<div class="cert-grid" data-certifications-grid>'),
        ('<ul class="blog-posts-list">', '<ul class="blog-posts-list" data-blog-list>'),
        ('<div class="contact-cards-grid">', '<div class="contact-cards-grid" data-contact-cards>')
    ]

    for target, replacement in hooks:
        if target in html and replacement not in html:
            html = html.replace(target, replacement)

    with open(INDEX_PATH, "w", encoding="utf-8") as f:
        f.write(html)

    print("[+] index.html verified and synchronized with datasource hooks.")
    return True

if __name__ == "__main__":
    success = sync()
    sys.exit(0 if success else 1)
