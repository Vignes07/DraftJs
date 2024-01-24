import React from "react";
import { Editor } from "draft-js";
import "../App.css";

function Draft({ editorState, handleChange }) {
  return (
    <div className="editor-container">
      <Editor
        editorState={editorState}
        onChange={handleChange}
        placeholder="Type here!!!"
      />
    </div>
  );
}

export default Draft;
