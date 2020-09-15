const htmlmin = require("html-minifier");
const moment = require('moment');
const lazyImagesPlugin = require('eleventy-plugin-lazyimages');
const markdownItClass = require('@toycode/markdown-it-class');

moment.locale('en');

module.exports = function (eleventyConfig) {
  // markdown-it
  let markdownIt = require("markdown-it");
  var markdownItAttrs = require('markdown-it-attrs');
  let options = {
    html: true,
    breaks: true,
    linkify: true
  };
  const mapping = {
    h1: ['text-4xl', 'text-greener', 'font-black', 'leading-loose'],
    h2: ['text-3xl', 'text-darker', 'font-bold', 'leading-relaxed'],
    h3: ['text-2xl', 'text-black', 'font-bold', 'leading-10'],
    h4: ['text-xl', 'text-black', 'font-bold', 'leading-9'],
    h5: ['text-lg', 'text-black', 'font-bold'],
    a: ['text-middle', 'hover:underline'],
    p: ['text-lg', 'font-light', 'tracking-wide'],
  };
  const md = markdownIt(options).use(markdownItAttrs).use(markdownItClass, mapping);
  eleventyConfig.setLibrary('md', md);

  // add filters
  eleventyConfig.addFilter('dateIso', date => {
    return moment(date).toISOString();
  });
  eleventyConfig.addFilter('dateReadable', date => {
    return moment(date).utc().format('LL'); // E.g. May 31, 2019
  });

  // images
  eleventyConfig.addPassthroughCopy('static');
  eleventyConfig.addPassthroughCopy('projects');
  eleventyConfig.addPlugin(lazyImagesPlugin);

  // css
  eleventyConfig.setUseGitIgnore(false);

  eleventyConfig.addWatchTarget("./_tmp/style.css");

  eleventyConfig.addPassthroughCopy({ "./_tmp/style.css": "./style.css" });

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