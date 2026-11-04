# SMI 2027 website

Website for the Statistical Methods in Imaging (SMI) 2027 conference. It is built with [Eleventy](https://www.11ty.dev/) and is designed for GitHub Pages.

## Update the content

Most updates only need a change to one file in `src/_data/`. You can edit these files on the GitHub website.

| To change | Edit |
|---|---|
| Conference dates, contact email, announcements, draft mode | `site.yml` |
| Deadlines and other key dates | `dates.yml` |
| Call descriptions, status and form links | `calls.yml` |
| Venue, directions and hotels | `travel.yml` |
| Committee members | `committee.yml` |
| Past meetings | `pastMeetings.yml` |

Write dates in quotes as `"2027-03-15"`, or use `TBA` if the date isn't confirmed.

To open a call, set `status: open` and add its `form_url` in `calls.yml`.

**Before the public launch:** set `draft: false` in `site.yml`. This removes the draft notice and lets search engines index the site. Do this only after the ASA Statistics in Imaging Section has confirmed the host.

## Run the site locally

You need Node.js 22 or later.

```bash
npm ci
```

```bash
npm run dev
```

Then open http://localhost:8080.

## Check the site

```bash
npm run smoke
```

This validates the data, builds the site, and checks internal links, anchors and image alt text. Invalid data or a broken link stops the build.

Before each release, also check the external links:

```bash
npm run check:external
```

## Deployment

Each push to `main` runs `.github/workflows/deploy.yml`, which runs the smoke check and then deploys to GitHub Pages. In the repository's Pages settings, set the source to **GitHub Actions**.

If the build fails, the previously deployed site stays online.
