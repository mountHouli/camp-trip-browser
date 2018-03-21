// This file is not processed by babel, therefore user module.exports
// !! fix <script src="/whatever" /> relative path to handle both http and https (if it doesn't already--I dont know)
module.exports = (reactRootContent) => {
  const html =
`<head>
</head>
<body>
  <div id="react_root">${reactRootContent}</div>
  <script src="/clientIndex.bundle.js"></script>
</body>`
  return html
}
