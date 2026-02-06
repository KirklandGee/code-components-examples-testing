# Output.ai Documentation Index

> Summary of what is known about the Output.ai documentation structure.
> Attempted source: https://docs.output.ai/llms.txt

---

## Access Status

The Output.ai documentation at `docs.output.ai` is **access-restricted**. The site requires an access code to view any content. The `/llms.txt` endpoint does not serve a standard llms.txt file -- it redirects to the access-restricted login page.

## What We Know

### Platform Identity
- **Product name**: Output Framework
- **Documentation URL**: https://docs.output.ai
- **Authentication**: Access code required (no public documentation available)

### Technical Stack
- Built on **Mintlify** documentation platform
- Uses **Next.js** (React-based) for rendering
- Supports light/dark theme modes
- Hosted on AWS infrastructure (S3 for assets)
- Sidebar-based navigation structure

### Documentation Structure
The Mintlify-based docs site likely follows a standard structure with:
- Sidebar navigation organized by topic
- API reference sections
- Getting started / quickstart guides
- Potentially an OpenAPI spec for API reference

However, none of this content is publicly accessible without an access code.

---

## Recommendations for the Team

1. **Obtain an access code** from the Output.ai team or client to access the full documentation.
2. Once access is available, re-fetch `https://docs.output.ai/llms.txt` and `https://docs.output.ai/llms-full.txt` -- Mintlify sites typically auto-generate these files with the full doc structure.
3. Look for an OpenAPI spec at common paths like `/api-reference/openapi.json` or linked from the docs navigation.
4. Check if there is a public GitHub repo or npm package for the Output Framework that contains its own documentation.

---

## llms.txt Standard (Context)

The `llms.txt` file is a standard (proposed by Jeremy Howard, co-founder of Answer.AI, September 2024) that provides AI-friendly documentation summaries. When available, it typically contains:

- **llms.txt**: Lightweight summary with one-sentence descriptions per page and URLs
- **llms-full.txt**: Complete documentation content in markdown, including resolved API specs and SDK examples

Mintlify (the platform Output.ai uses) supports auto-generation of both files. Once we have access credentials, these files should provide a structured, machine-readable index of all Output.ai documentation.
