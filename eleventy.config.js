import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { load as loadYaml } from "js-yaml";

const toDate = (iso) => new Date(`${iso}T00:00:00Z`);
const format = (iso, options) =>
  toDate(iso).toLocaleDateString("en-US", { timeZone: "UTC", ...options });
const MONTH_DAY_YEAR = { month: "long", day: "numeric", year: "numeric" };

function eachDay({ start, end }) {
  const days = [];
  for (let date = toDate(start); date <= toDate(end); date.setUTCDate(date.getUTCDate() + 1)) {
    days.push(date.toISOString().slice(0, 10));
  }
  return days;
}

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addDataExtension("yml", (contents) => loadYaml(contents));
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.setNunjucksEnvironmentOptions({
    autoescape: true,
    throwOnUndefined: true,
  });

  // Same style as the SMI 2026 site: "June 2-4, 2027".
  eleventyConfig.addFilter("dateRange", ({ start, end }) => {
    if (start === end) return format(start, MONTH_DAY_YEAR);
    if (start.slice(0, 7) !== end.slice(0, 7)) {
      return `${format(start, MONTH_DAY_YEAR)} - ${format(end, MONTH_DAY_YEAR)}`;
    }
    return `${format(start, { month: "long", day: "numeric" })}-${toDate(end).getUTCDate()}, ${start.slice(0, 4)}`;
  });

  eleventyConfig.addFilter("weekdays", (dates) => {
    const names = eachDay(dates).map((day) => format(day, { weekday: "long" }));
    return names.join(", ");
  });

  eleventyConfig.addFilter("conferenceDays", (dates) =>
    eachDay(dates).map((day, index) => ({
      id: `day${index + 1}`,
      label: `Day ${index + 1} (${format(day, MONTH_DAY_YEAR)})`,
    })),
  );

  eleventyConfig.addFilter("milestoneDate", (milestones, id) => {
    const match = milestones.find((milestone) => milestone.id === id);
    if (!match) throw new Error(`Unknown milestone id: ${id}`);
    return match.date;
  });
}

export const config = {
  dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
  templateFormats: ["njk"],
  htmlTemplateEngine: "njk",
  pathPrefix: process.env.PATH_PREFIX || "/",
};
