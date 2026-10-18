#!/usr/bin/env python3
"""
validate_datasource.py
Validates JSON syntax, schema rules, required fields, and integrity
across all files in the datasource/ directory.
"""

import os
import sys
import json
import re

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
DATASOURCE_DIR = os.path.join(ROOT_DIR, "datasource")

REQUIRED_FILES = [
    "site-config.json",
    "profile.json",
    "social-links.json",
    "skills.json",
    "experience.json",
    "projects.json",
    "certifications.json",
    "education.json",
    "achievements.json",
    "navigation.json",
    "blogs.json"
]

def load_json(filename):
    filepath = os.path.join(DATASOURCE_DIR, filename)
    if not os.path.exists(filepath):
        raise FileNotFoundError(f"Missing required file: {filename}")
    with open(filepath, "r", encoding="utf-8") as f:
        return json.load(f)

def validate():
    errors = []
    warnings = []
    print(f"[*] Validating portfolio datasource in: {DATASOURCE_DIR}\n")

    # 1. Check all required files exist and parse as JSON
    loaded_data = {}
    for filename in REQUIRED_FILES:
        try:
            data = load_json(filename)
            loaded_data[filename] = data
            print(f"  [OK] Syntax check passed: {filename}")
        except FileNotFoundError as e:
            errors.append(str(e))
            print(f"  [ERR] {e}")
        except json.JSONDecodeError as e:
            err_msg = f"{filename}: Invalid JSON on line {e.lineno}, col {e.colno}: {e.msg}"
            errors.append(err_msg)
            print(f"  [ERR] {err_msg}")

    if errors:
        print("\n[!] Halting validation due to JSON parse errors.")
        return False

    # 2. Validate site-config.json
    cfg = loaded_data.get("site-config.json", {})
    for req_field in ["siteTitle", "siteDescription", "author", "canonicalUrl", "theme", "resume", "footer"]:
        if req_field not in cfg:
            errors.append(f"site-config.json: Missing required field '{req_field}'")
    if "resume" in cfg and "path" not in cfg["resume"]:
        errors.append("site-config.json: 'resume' object missing 'path'")

    # 3. Validate profile.json
    prof = loaded_data.get("profile.json", {})
    for req_field in ["name", "headline", "currentRole", "avatar", "email", "hero", "about"]:
        if req_field not in prof:
            errors.append(f"profile.json: Missing required field '{req_field}'")
    if "about" in prof and not isinstance(prof["about"].get("paragraphs"), list):
        errors.append("profile.json: 'about.paragraphs' must be a list of strings")
    if "coreDisciplines" in prof and not isinstance(prof["coreDisciplines"], list):
        errors.append("profile.json: 'coreDisciplines' must be a list")

    # 4. Validate social-links.json
    socials = loaded_data.get("social-links.json", [])
    if not isinstance(socials, list) or len(socials) == 0:
        errors.append("social-links.json: Expected non-empty list of social links")
    else:
        social_ids = set()
        for idx, s in enumerate(socials):
            sid = s.get("id")
            if not sid:
                errors.append(f"social-links.json[{idx}]: Missing 'id'")
            elif sid in social_ids:
                errors.append(f"social-links.json[{idx}]: Duplicate id '{sid}'")
            social_ids.add(sid)
            if not s.get("url", "").startswith(("http://", "https://", "mailto:")):
                errors.append(f"social-links.json[{idx}]: Invalid or missing url '{s.get('url')}'")

    # 5. Validate skills.json
    skills = loaded_data.get("skills.json", {})
    categories = skills.get("categories", [])
    if not isinstance(categories, list) or len(categories) == 0:
        errors.append("skills.json: 'categories' must be a non-empty list")
    else:
        skill_cat_ids = set()
        for idx, cat in enumerate(categories):
            cid = cat.get("id")
            if not cid:
                errors.append(f"skills.json categories[{idx}]: Missing 'id'")
            elif cid in skill_cat_ids:
                errors.append(f"skills.json categories[{idx}]: Duplicate id '{cid}'")
            skill_cat_ids.add(cid)
            if not cat.get("title"):
                errors.append(f"skills.json categories[{idx}]: Missing 'title'")

    # 6. Validate experience.json
    exp = loaded_data.get("experience.json", {})
    history = exp.get("history", [])
    if not isinstance(history, list) or len(history) == 0:
        errors.append("experience.json: 'history' must be a non-empty list")
    else:
        for idx, job in enumerate(history):
            if not job.get("company"):
                errors.append(f"experience.json history[{idx}]: Missing 'company'")
            if not job.get("jobTitle"):
                errors.append(f"experience.json history[{idx}]: Missing 'jobTitle'")
            if not isinstance(job.get("bullets"), list) or len(job["bullets"]) == 0:
                errors.append(f"experience.json history[{idx}]: Expected non-empty list of 'bullets'")

    # 7. Validate projects.json
    proj_data = loaded_data.get("projects.json", {})
    projects = proj_data.get("projects", [])
    if not isinstance(projects, list) or len(projects) == 0:
        errors.append("projects.json: 'projects' must be a non-empty list")
    else:
        project_ids = set()
        for idx, p in enumerate(projects):
            pid = p.get("id")
            if not pid:
                errors.append(f"projects.json projects[{idx}]: Missing 'id'")
            elif pid in project_ids:
                errors.append(f"projects.json projects[{idx}]: Duplicate project id '{pid}'")
            project_ids.add(pid)
            if not p.get("title"):
                errors.append(f"projects.json projects[{idx}]: Missing 'title'")
            if not p.get("detailUrl"):
                errors.append(f"projects.json projects[{idx}]: Missing 'detailUrl'")
            if not p.get("thumbnail"):
                warnings.append(f"projects.json projects[{idx}]: Missing 'thumbnail'")

    # 8. Validate certifications.json
    certs_data = loaded_data.get("certifications.json", {})
    certs = certs_data.get("certifications", [])
    if not isinstance(certs, list) or len(certs) == 0:
        errors.append("certifications.json: 'certifications' must be a non-empty list")
    else:
        cert_ids = set()
        for idx, c in enumerate(certs):
            cid = c.get("id")
            if not cid:
                errors.append(f"certifications.json certifications[{idx}]: Missing 'id'")
            elif cid in cert_ids:
                errors.append(f"certifications.json certifications[{idx}]: Duplicate cert id '{cid}'")
            cert_ids.add(cid)
            if not c.get("name"):
                errors.append(f"certifications.json certifications[{idx}]: Missing 'name'")

    # 9. Validate education.json
    edu_data = loaded_data.get("education.json", {})
    degrees = edu_data.get("degrees", [])
    if not isinstance(degrees, list) or len(degrees) == 0:
        errors.append("education.json: 'degrees' must be a non-empty list")
    else:
        for idx, d in enumerate(degrees):
            if not d.get("degree") or not d.get("institution"):
                errors.append(f"education.json degrees[{idx}]: Missing 'degree' or 'institution'")

    # 10. Validate achievements.json
    ach_data = loaded_data.get("achievements.json", {})
    metrics = ach_data.get("metrics", [])
    if not isinstance(metrics, list) or len(metrics) == 0:
        errors.append("achievements.json: 'metrics' must be a non-empty list")
    else:
        for idx, m in enumerate(metrics):
            if not m.get("value") or not m.get("label"):
                errors.append(f"achievements.json metrics[{idx}]: Missing 'value' or 'label'")

    # 11. Validate navigation.json
    nav_data = loaded_data.get("navigation.json", [])
    if not isinstance(nav_data, list) or len(nav_data) == 0:
        errors.append("navigation.json: Expected list of navigation items")

    # Report results
    print("\n" + "=" * 50)
    if warnings:
        print(f"[*] {len(warnings)} warning(s):")
        for w in warnings:
            print(f"  [WARN] {w}")

    if errors:
        print(f"[!] Validation failed with {len(errors)} error(s):")
        for err in errors:
            print(f"  [FAIL] {err}")
        print("=" * 50)
        return False

    print(f"[+] All {len(REQUIRED_FILES)} datasource files passed schema & integrity validation!")
    print("=" * 50)
    return True

if __name__ == "__main__":
    success = validate()
    sys.exit(0 if success else 1)
