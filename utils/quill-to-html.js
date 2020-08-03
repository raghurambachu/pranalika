const QuillToHtmlConverter = require("quill-delta-to-html")
  .QuillDeltaToHtmlConverter;

exports.quillToHtmlParser = async function (content) {
  let contentDelta = JSON.parse(content);
  let cfg = {};
  const converter = new QuillToHtmlConverter(contentDelta.ops, cfg);
  const contentHtml = converter.convert();
  return contentHtml;
};
