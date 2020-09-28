const htmlmin = require("html-minifier");
const moment = require('moment');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');

moment.locale('en');

module.exports = function (eleventyConfig) {

  // images
  eleventyConfig.addPassthroughCopy('static');
  eleventyConfig.addPassthroughCopy('projects');
  eleventyConfig.addPlugin(lazyImagesPlugin);

  // css
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./_tmp/style.css");

  eleventyConfig.addPassthroughCopy({ "./_tmp/style.css": "./style.css" });

  eleventyConfig.addPassthroughCopy({"./favicon.ico": "./favicon.ico"});

  eleventyConfig.addPassthroughCopy({
    "./node_modules/alpinejs/dist/alpine.js": "./js/alpine.js",
  });

  eleventyConfig.addShortcode("version", function () {
    return String(Date.now());
  });

  eleventyConfig.addTransform("htmlmin", function (content, outputPath) {
    if (
      process.env.ELEVENTY_PRODUCTION &&
      outputPath &&
      outputPath.endsWith(".html")
    ) {
      let minified = htmlmin.minify(content, {
        useShortDoctype: true,
        removeComments: true,
        collapseWhitespace: true,
      });
      return minified;
    }

    return content;
  });
};