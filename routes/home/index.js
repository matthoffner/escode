import {
  LiveProvider,
  LiveEditor,
  LiveError,
  LivePreview
} from '/web_modules/react-live.js'

import { StorageArea } from '/web_modules/kv-storage-polyfill.js';

const savedCode = new StorageArea("saved-code");

export default () => {
const [codeState, setCodeState] = React.useState("");
const [saved, saveCode] = React.useState([]);
const [filename, setFilename] = React.useState('filename.js');
const [folder, setFolder] = React.useState([]);
const saveSnippet = async () => {
  if (!codeState) {
    return;
  }
  saveCode([codeState,...saved]);
  await savedCode.set(filename, codeState);
  console.log(savedCode);
}
const showSaved = async () => {
  const files = await savedCode.keys();
  let filenames = [];
  for await (const key of files) {
    filenames.push(key);
  }
  setFolder(filenames);
}
const loadCode = async (f) => {
  const code = await savedCode.get(f);
  setCodeState(code);
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
      <input onChange="{e => setFilename(e.target.value)}";
     }} value=${filename}></input>
      <button onClick="${() => showSaved()}">Show</button>
      <div>
        ${folder.map(filename => html`<li><a onClick="${() => loadCode(filename)}">${filename}</a></li>`)}
      </div>
    </${LiveProvider}>
  </div>
`
}
