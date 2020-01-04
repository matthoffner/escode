import { React, ReactDOM } from 'https://unpkg.com/es-react@16.8.30/index.js';
import htm from 'https://unpkg.com/htm@2.1.1/dist/htm.mjs'

window.React = React
window.html = htm.bind(React.createElement)

const Route = {
  '/': React.lazy(() => import('./routes/home/index.js')),
  '*': React.lazy(() => import('./routes/notfound/index.js')),
}

ReactDOM.render(
  html`
    <${React.Suspense} fallback=${html`<div>loading...</div>`}>
      <${Route[location.pathname] || Route['*']} />
    </>
  `,
  document.body
)
