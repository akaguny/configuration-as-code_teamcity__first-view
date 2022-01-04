module.exports = ({ marp }) =>
  marp.use(({ marpit }) => {
    const { highlighter } = marpit

    // Override Marp Core's highlighter to wrap each lines by ordered list items
    marpit.highlighter = (...args) => {
      const original = highlighter(...args)
      const listItems = original
        .split(/\n(?!$)/) // Don't split at the trailing newline
        .map(line => `<li>${line}</li>`)

      return `<ol>${listItems.join('')}</ol>`
    }
  })
