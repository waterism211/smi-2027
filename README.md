# SMI 2027 website

Website for the Statistical Methods in Imaging (SMI) 2027 conference. It is built with [Eleventy](https://www.11ty.dev/) and is designed for GitHub Pages.

## Update the content

The page follows the layout of the SMI 2026 site. Most updates only need a change to one file in `src/_data/`. You can edit these files on the GitHub website.

| To change | Edit |
|---|---|
| Conference dates, contact, venue, header buttons, draft mode | `site.yml` |
| Important Dates table | `dates.yml` |
| Schedule (All Days and Day 1-3 tabs) | `schedule.yml` |
| Calls for papers, posters and short courses | `calls.yml` |
| Keynote speakers and committees | `committee.yml` |
| Institutional support | `sponsors.yml` |
| Transportation and hotels | `travel.yml` |

Write dates in `dates.yml` as display text, such as `TBA` or `March 15, 2027`. Write `conference_dates` in `site.yml` in quotes as `"2027-06-02"`.

When a form opens, add its link as `form_url` in `calls.yml` and replace the matching button `url` in `site.yml`.

**Before the public launch:** set `draft: false` in `site.yml`. This removes the draft notice and lets search engines index the site. Do this only after the ASA Statistics in Imaging Section has confirmed the host.

## Images

| File | Source | License |
|---|---|---|
| `dc-cherry-blossoms-jefferson.webp`, `dc-cherry-blossoms-monument.webp` | Provided by the organizers | Source and license to be confirmed |
| `keynotes/*.jpg`, `committee/*.jpg` | Each person's official profile page, cropped to 240 px | Confirm with each person before the public launch |
| `umd-sph-logo.png` | UMD School of Public Health Communications (sph-comm@umd.edu), November 2026 | Official SPH logo; follow the [UMD logo usage rules](https://brand.umd.edu/visual-identity/logos/usage). Only the transparent margin was trimmed and the file resized. |

Before the public launch, confirm the source and license of the header photos. Do not recolor, stretch or add effects to the logo, and keep it on its white panel rather than directly on the photo. The header shows the two photos in turn; `src/assets/css/site.css` sets this under `.header-bg`.

To add a photo, save a copy of about 240 px in `src/assets/img/keynotes/` (speakers) or `src/assets/img/committee/` (committee members), and set `photo` in `committee.yml` to that path, starting with `/assets/img/`. For example, on a Mac:

```bash
sips -s format jpeg -s formatOptions 80 -Z 240 photo.jpg --out src/assets/img/keynotes/name.jpg
```

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

This validates the data, builds the site, and checks internal links, anchors and image alt text. Invalid data or a broken link stops the build. The external check lists any sites that block scripts, so you can open those links in a browser.

Before each release, also check the external links:

```bash
npm run check:external
```

## Deployment

Each push to `main` runs `.github/workflows/deploy.yml`, which runs the smoke check and then deploys to GitHub Pages. In the repository's Pages settings, set the source to **GitHub Actions**.

If the build fails, the previously deployed site stays online.
