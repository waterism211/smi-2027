// Validates src/_data. All problems are reported together, then the build stops.
import { readFileSync } from "node:fs";
import { load as loadYaml } from "js-yaml";

const read = (name) => loadYaml(readFileSync(`src/_data/${name}.yml`, "utf8"));
const errors = [];
const fail = (where, message) => errors.push(`${where}: ${message}`);

const isIsoDate = (value) =>
  typeof value === "string" &&
  /^\d{4}-\d{2}-\d{2}$/.test(value) &&
  !Number.isNaN(new Date(`${value}T00:00:00Z`).getTime()) &&
  new Date(`${value}T00:00:00Z`).toISOString().startsWith(value);
const isHttpsUrl = (value) => typeof value === "string" && value.startsWith("https://");
const isText = (value) => typeof value === "string" && value.trim() !== "";

function requireText(where, record, fields) {
  for (const field of fields) {
    if (!isText(record[field])) fail(where, `missing "${field}"`);
  }
}

function requireLink(where, url) {
  if (!isHttpsUrl(url) && !(typeof url === "string" && /^#[\w-]+$/.test(url))) {
    fail(where, `"${url}" must be an https:// link or a #section link`);
  }
}

function requireOptionalHttps(where, record, field) {
  if (record[field] != null && !isHttpsUrl(record[field])) {
    fail(where, `"${field}" must start with https://`);
  }
}

// site.yml
const site = read("site");
if (typeof site.draft !== "boolean") fail("site.yml", '"draft" must be true or false');
requireText("site.yml", site, ["title", "short_name", "subtitle", "location", "organizer_note"]);
const { start, end } = site.conference_dates ?? {};
if (!isIsoDate(start) || !isIsoDate(end)) {
  fail("site.yml", "conference_dates must be quoted YYYY-MM-DD dates");
} else if (end < start) {
  fail("site.yml", "conference_dates end is before start");
}
requireText("site.yml contact", site.contact, ["name", "email", "location"]);
if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(site.contact.email)) {
  fail("site.yml contact", `invalid email "${site.contact.email}"`);
}
requireText("site.yml venue", site.venue, ["name", "address"]);
if (!isHttpsUrl(site.venue.url)) fail("site.yml venue", '"url" must start with https://');
if (!isHttpsUrl(site.venue.map_url)) fail("site.yml venue", '"map_url" must start with https://');
site.nav.forEach((item, index) => {
  requireText(`site.yml nav[${index}]`, item, ["label"]);
  requireLink(`site.yml nav[${index}]`, item.url);
});
site.buttons.forEach((button, index) => {
  const where = `site.yml buttons[${index}]`;
  requireText(where, button, ["label"]);
  requireLink(where, button.url);
  if (!["primary", "secondary"].includes(button.style)) fail(where, `invalid style "${button.style}"`);
});
site.resources.forEach((item, index) => {
  const where = `site.yml resources[${index}]`;
  requireText(where, item, ["icon", "label"]);
  if (!isHttpsUrl(item.url)) fail(where, '"url" must start with https://');
});
site.credits.forEach((item, index) => {
  const where = `site.yml credits[${index}]`;
  requireText(where, item, ["text", "note"]);
  if (!isHttpsUrl(item.url)) fail(where, '"url" must start with https://');
});

// dates.yml
const dates = read("dates");
const milestoneIds = new Set();
dates.forEach((milestone, index) => {
  const where = `dates.yml[${index}]`;
  requireText(where, milestone, ["id", "label", "date"]);
  requireOptionalHttps(where, milestone, "url");
  if (milestoneIds.has(milestone.id)) fail(where, `duplicate id "${milestone.id}"`);
  milestoneIds.add(milestone.id);
});

// schedule.yml
const DAY_KEY = /^day[1-9]$/;
const dayCount = errors.length ? 0 :
  Math.round((new Date(`${end}T00:00:00Z`) - new Date(`${start}T00:00:00Z`)) / 86400000) + 1;
read("schedule").slots.forEach((slot, index) => {
  const where = `schedule.yml slots[${index}]`;
  requireText(where, slot, ["time"]);
  const days = Object.keys(slot).filter((key) => key !== "time");
  if (!days.length) fail(where, "needs at least one of day1, day2, day3");
  for (const key of days) {
    if (!DAY_KEY.test(key)) fail(where, `unknown field "${key}"`);
    else if (dayCount && Number(key.slice(3)) > dayCount) fail(where, `"${key}" is outside the conference dates`);
    if (!Array.isArray(slot[key]) || !slot[key].length || !slot[key].every(isText)) {
      fail(where, `"${key}" must be a list of text items`);
    }
  }
});

// calls.yml
const calls = read("calls");
const callIds = new Set();
calls.forEach((call, index) => {
  const where = `calls.yml[${index}]`;
  requireText(where, call, ["id", "title", "subtitle", "panel_title", "form_label", "deadline_label"]);
  if (callIds.has(call.id)) fail(where, `duplicate id "${call.id}"`);
  callIds.add(call.id);
  if (!call.paragraphs?.length || !call.paragraphs.every(isText)) fail(where, '"paragraphs" must be a list of text');
  call.panel_items.forEach((item) => requireText(where, item, ["icon", "text"]));
  requireOptionalHttps(where, call, "form_url");
  if (!milestoneIds.has(call.deadline)) fail(where, `deadline "${call.deadline}" is not an id in dates.yml`);
});

// committee.yml
const committee = read("committee");
for (const group of ["keynotes", "organizing", "advisory"]) {
  committee[group].forEach((person, index) => {
    const where = `committee.yml ${group}[${index}]`;
    requireText(where, person, ["name", "title"]);
    requireOptionalHttps(where, person, "url");
    if (person.photo != null && !isHttpsUrl(person.photo) && !String(person.photo).startsWith("/assets/img/")) {
      fail(where, '"photo" must be an https:// link or a /assets/img/ path');
    }
  });
}

// sponsors.yml
read("sponsors").forEach((sponsor, index) => {
  requireText(`sponsors.yml[${index}]`, sponsor, ["name"]);
  requireOptionalHttps(`sponsors.yml[${index}]`, sponsor, "url");
});

// travel.yml
const travel = read("travel");
for (const group of ["transportation", "hotels"]) {
  travel[group].forEach((link, index) => {
    const where = `travel.yml ${group}[${index}]`;
    requireText(where, link, ["label"]);
    if (!isHttpsUrl(link.url)) fail(where, '"url" must start with https://');
  });
}

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} problem(s):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log("Data validation passed.");
