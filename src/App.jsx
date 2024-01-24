import "./App.css";
import { useState } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  DefaultDraftBlockRenderMap,
  SelectionState,
  convertToRaw,
  convertFromRaw,
} from "draft-js";
import "draft-js/dist/Draft.css";
import Immutable from "immutable";

function App() {
  const savedContent = localStorage.getItem("editorContent");
  const initialEditorState = savedContent
    ? EditorState.createWithContent(convertFromRaw(JSON.parse(savedContent)))
    : EditorState.createEmpty();

  const [editorState, setEditorState] = useState(initialEditorState);

  const blockRenderMap = Immutable.Map({
    "header-one": {
      element: "h1",
    },
  });

  const styleMap = {
    RED: {
      color: "red",
    },
    BOLD: {
      fontWeight: "bold",
    },
    UNDERLINE: {
      textDecoration: "underline",
    },
  };

  const extendedBlockRenderMap =
    DefaultDraftBlockRenderMap.merge(blockRenderMap);

  const handleEditorChange = (editorState) => {
    const selection = editorState.getSelection();
    const contentState = editorState.getCurrentContent();
    const blockKey = selection.getStartKey();
    const block = contentState.getBlockForKey(blockKey);
    const length = block.getLength();
    const text = block.getText();
    if (text.match(/^# /)) {
      const newSelection = new SelectionState({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: blockKey,
        focusOffset: length,
      });
      const newEditorState = EditorState.forceSelection(
        editorState,
        newSelection
      );
      setEditorState(RichUtils.toggleBlockType(newEditorState, "header-one"));
    } else if (text.match(/^\*\*\* /)) {
      const newSelection = new SelectionState({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: blockKey,
        focusOffset: length,
      });
      const newEditorState = EditorState.forceSelection(
        editorState,
        newSelection
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "UNDERLINE"));
    } else if (text.match(/^\*\* /)) {
      const newSelection = new SelectionState({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: blockKey,
        focusOffset: length,
      });
      const newEditorState = EditorState.forceSelection(
        editorState,
        newSelection
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "RED"));
    } else if (text.match(/^\* /)) {
      const newSelection = new SelectionState({
        anchorKey: blockKey,
        anchorOffset: 0,
        focusKey: blockKey,
        focusOffset: length,
      });
      const newEditorState = EditorState.forceSelection(
        editorState,
        newSelection
      );
      setEditorState(RichUtils.toggleInlineStyle(newEditorState, "BOLD"));
    } else {
      setEditorState(editorState);
    }
  };

  const handleSave = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    const stringifiedContent = JSON.stringify(rawContentState);
    localStorage.setItem("editorContent", stringifiedContent);
  };

  return (
    <>
      <nav className="header">
        <span className="text">React Sorcerer</span>
        <button className="save" onClick={handleSave}>
          Save
        </button>
      </nav>
      <div className="editor-container">
        <Editor
          customStyleMap={styleMap}
          blockRenderMap={extendedBlockRenderMap}
          editorState={editorState}
          onChange={handleEditorChange}
          placeholder="Type here!!!"
        />
      </div>
    </>
  );
}

export default App;
