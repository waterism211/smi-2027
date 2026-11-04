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
const isDateOrTba = (value) => value === "TBA" || isIsoDate(value);
const isHttpsUrl = (value) => typeof value === "string" && value.startsWith("https://");
const isText = (value) => typeof value === "string" && value.trim() !== "";

function requireText(where, record, fields) {
  for (const field of fields) {
    if (!isText(record[field])) fail(where, `missing "${field}"`);
  }
}

function requireOptionalUrl(where, record, field) {
  if (record[field] != null && !isHttpsUrl(record[field])) {
    fail(where, `"${field}" must start with https://`);
  }
}

function requireUniqueIds(where, records) {
  const seen = new Set();
  for (const { id } of records) {
    if (seen.has(id)) fail(where, `duplicate id "${id}"`);
    seen.add(id);
  }
}

// site.yml
const site = read("site");
if (typeof site.draft !== "boolean") fail("site.yml", '"draft" must be true or false');
requireText("site.yml", site, ["name", "short_name", "organizer", "host", "location", "description"]);
requireOptionalUrl("site.yml", site, "organizer_url");
const { start, end } = site.conference_dates ?? {};
if (!isDateOrTba(start) || !isDateOrTba(end)) {
  fail("site.yml", 'conference_dates must be "TBA" or quoted YYYY-MM-DD dates');
} else if ((start === "TBA") !== (end === "TBA")) {
  fail("site.yml", "conference_dates start and end must both be TBA or both be dates");
} else if (start !== "TBA" && end < start) {
  fail("site.yml", "conference_dates end is before start");
}
if (site.contact_email != null && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(site.contact_email)) {
  fail("site.yml", `invalid contact_email "${site.contact_email}"`);
}
site.announcements.forEach((item, index) => {
  const where = `site.yml announcements[${index}]`;
  if (!isIsoDate(item.date)) fail(where, '"date" must be a quoted YYYY-MM-DD date');
  requireText(where, item, ["text"]);
  requireOptionalUrl(where, item, "url");
});

// dates.yml
const dates = read("dates");
requireUniqueIds("dates.yml", dates);
dates.forEach((milestone, index) => {
  const where = `dates.yml[${index}]`;
  requireText(where, milestone, ["id", "label"]);
  if (!isDateOrTba(milestone.date)) fail(where, '"date" must be "TBA" or a quoted YYYY-MM-DD date');
});
const milestoneIds = new Set(dates.map(({ id }) => id));

// calls.yml
const calls = read("calls");
requireUniqueIds("calls.yml", calls);
calls.forEach((call) => {
  const where = `calls.yml "${call.id}"`;
  requireText(where, call, ["id", "title", "summary", "description"]);
  if (!["not_open", "open", "closed"].includes(call.status)) fail(where, `invalid status "${call.status}"`);
  if (call.status === "open" && !isHttpsUrl(call.form_url)) fail(where, "an open call needs an https form_url");
  requireOptionalUrl(where, call, "form_url");
  if (!milestoneIds.has(call.deadline)) fail(where, `deadline "${call.deadline}" is not an id in dates.yml`);
});

// travel.yml
const travel = read("travel");
requireOptionalUrl("travel.yml venue", travel.venue, "map_url");
if (travel.venue.name && !isText(travel.venue.address)) fail("travel.yml venue", 'a named venue needs "address"');
if (!isHttpsUrl(travel.directions_url)) fail("travel.yml", '"directions_url" must start with https://');
travel.transit.forEach((item, index) => requireText(`travel.yml transit[${index}]`, item, ["title", "text"]));
travel.airports.forEach((item, index) => requireText(`travel.yml airports[${index}]`, item, ["code", "name", "route"]));
travel.hotels.forEach((item, index) => {
  const where = `travel.yml hotels[${index}]`;
  requireText(where, item, ["name"]);
  if (!isHttpsUrl(item.url)) fail(where, '"url" must start with https://');
});

// committee.yml
read("committee").forEach((group, groupIndex) => {
  requireText(`committee.yml[${groupIndex}]`, group, ["name"]);
  group.members.forEach((person, personIndex) => {
    const where = `committee.yml "${group.name}" members[${personIndex}]`;
    requireText(where, person, ["name", "affiliation"]);
    requireOptionalUrl(where, person, "url");
  });
});

// pastMeetings.yml
read("pastMeetings").forEach((meeting, index) => {
  const where = `pastMeetings.yml[${index}]`;
  if (!Number.isInteger(meeting.year)) fail(where, '"year" must be a number');
  requireText(where, meeting, ["host", "location"]);
  requireOptionalUrl(where, meeting, "url");
});

if (errors.length) {
  console.error(`Data validation failed with ${errors.length} problem(s):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log("Data validation passed.");
