// !! fix script src relative path to handle both http and https (if it doesn't already--I dont know)
module.exports = (reactRootContent) => {
  const html =
`<head>
</head>
<body>
  <div id="react_root">${reactRootContent}</div>
  <script src="/browserBundle.js"></script>
</body>`
  return html
}
