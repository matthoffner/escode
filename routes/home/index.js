import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from '/web_modules/react-live.js'

export default () => {
const [codeState, setCodeState] = React.useState("");
const [saved, saveCode] = React.useState([]);
const saveSnippet = () => {
  if (!codeState) {
    return;
  }
  saveCode([codeState,...saved]);
}
const snippet = `
function Component() {
  return (
   <>
     <div style={{margin: 10}} >
       <h1>escode</h1>
       <li>buildless  react live editor</li>
       <li>uses es modules and persists to indexedb</li>
       <li>offline pwa caching</li>
     </div>
   </>
  )
}
render(<Component />);
`;
return html`
  <div>
    <${LiveProvider} noInline={true} code=${codeState || snippet}>
      <${LivePreview} />
      <${LiveEditor} value=${codeState || snippet} onValueChange="${e => setCodeState(e)}" />
      <${LiveError} />
      <button onClick="${() => saveSnippet()}">Save</button>
      <div>
        ${saved}
      </div>
    </${LiveProvider}>
  </div>
`
}
