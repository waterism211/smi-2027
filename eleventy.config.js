import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { load as loadYaml } from "js-yaml";

const MONTH_DAY = { month: "long", day: "numeric", timeZone: "UTC" };
const FULL_DATE = { ...MONTH_DAY, year: "numeric" };

const toDate = (iso) => new Date(`${iso}T00:00:00Z`);
const format = (iso, options) => toDate(iso).toLocaleDateString("en-US", options);

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
  eleventyConfig.addDataExtension("yml", (contents) => loadYaml(contents));
  eleventyConfig.addPassthroughCopy({ "src/assets": "assets" });
  eleventyConfig.setNunjucksEnvironmentOptions({
    autoescape: true,
    throwOnUndefined: true,
  });

  eleventyConfig.addFilter("displayDate", (value) =>
    value === "TBA" ? "TBA" : format(value, FULL_DATE),
  );

  eleventyConfig.addFilter("dateRange", ({ start, end }) => {
    if (start === "TBA") return "Dates to be announced";
    if (start === end) return format(start, FULL_DATE);
    const year = start.slice(0, 4);
    if (year !== end.slice(0, 4)) {
      return `${format(start, FULL_DATE)} – ${format(end, FULL_DATE)}`;
    }
    const sameMonth = start.slice(0, 7) === end.slice(0, 7);
    const endText = sameMonth ? toDate(end).getUTCDate() : format(end, MONTH_DAY);
    return `${format(start, MONTH_DAY)}–${endText}, ${year}`;
  });

  eleventyConfig.addFilter("milestoneDate", (milestones, id) => {
    const match = milestones.find((milestone) => milestone.id === id);
    if (!match) throw new Error(`Unknown milestone id: ${id}`);
    return match.date;
  });
}

export const config = {
  dir: { input: "src", output: "_site", includes: "_includes", data: "_data" },
  templateFormats: ["njk", "md"],
  htmlTemplateEngine: "njk",
  markdownTemplateEngine: "njk",
  pathPrefix: process.env.PATH_PREFIX || "/",
};
