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
const [editor, setShowEditor] = React.useState(true);
const saveSnippet = async () => {
  if (!codeState) {
    return;
  }
  saveCode([codeState,...saved]);
  await savedCode.set(filename, codeState);
  showSaved();
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
  setFilename(f);
  setCodeState(code);
}
const deleteCode = async (f) => {
  const code = await savedCode.delete(f);
  showSaved();
}
const scope = { useState: React.useState, useEffect: React.useEffect, useRef: React.useRef };
const snippet = `
function Component() {
  const [cheer, setCheer] = useState(null);
  useEffect(() => {
    console.log('welcome to escode');
  });
  return (
   <>
     <div style={{margin: 10}} >
       <h1 onClick={() => setCheer('🎉 🎉 🎉 ')}>escode</h1>
       <h2>{cheer}</h2>
       <li>buildless react live editor</li>
       <li>indexeddb storage</li>
       <li>offline pwa caching</li>
     </div>
   </>
  )
}
render(<Component />);
`;
return html`
  <div>
    <${LiveProvider} noInline={true} code=${codeState || snippet} scope=${scope}>
      <${LivePreview} />
      ${editor && html`<${LiveEditor} value=${codeState || snippet} onValueChange="${e => setCodeState(e)}" />`}
      <${LiveError} />
      <button onClick="${() => saveSnippet()}">Save</button>
      <input onChange="${e => setFilename(e.target.value)}" value=${filename}></input>
      <div>
        <button onClick="${() => showSaved()}">My Files</button>
	<ul>
	  ${folder.map(filename => html`<li><a onClick="${() => loadCode(filename)}" href="javascript:;">${filename}</a> (<a onClick="${() => deleteCode(filename)}" href="javascript:;">remove</a>)</li>`)}
	</ul>
      </div>
      <div>
        <button onClick="${() => setShowEditor(!editor)}">${editor ? html`Hide` : html`Show`} Editor</button>
      </div>
    </${LiveProvider}>
  </div>
`
}
