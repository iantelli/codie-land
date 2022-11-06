import Editor from "@monaco-editor/react";
import React from "react";
import { twMerge } from "tailwind-merge";

export default function CodeEditor({
  value,
  onChange,
  language,
  className = "",
}: {
  value: string;
  onChange: (value: string | undefined) => void;
  language?: string;
  className?: string;
  id?: string;
  name?: string;
}) {
  return (
    <>
      <div className={twMerge("h-96 overflow-hidden rounded-xl", className)}>
        <Editor
          language={language}
          value={value}
          onChange={onChange}
          theme="vs-dark"
          // theme="hc-black"
          options={{
            autoDetectHighContrast: false,
            // readOnly: true,
            contextmenu: false,
            // cursorStyle: "line",
            // cursorWidth: 1,
            fontSize: 18,
            showUnused: true,
            // letterSpacing: 1,
            scrollbar: {
              vertical: "hidden",
              verticalHasArrows: false,
              verticalScrollbarSize: 0,
              verticalSliderSize: 0,
            },
            fontWeight: "thin",
            glyphMargin: false,
            guides: {
              highlightActiveIndentation: false,
              indentation: false,
            },
            lightbulb: {
              enabled: false,
            },
            // lineDecorationsWidth: 10,
            // lineHeight:22,
            lineNumbers: "off",
            lineNumbersMinChars: 3,
            overviewRulerBorder: false,
            padding: {
              top: 10,
              bottom: 10,
            },
            // find: {
            //   seedSearchStringFromSelection: true,
            // },
            // ideCursorInOverviewRuler: true,
            scrollBeyondLastLine: false,
            minimap: {
              enabled: false,
            },
          }}
          wrapperProps={
            {
              // className: "rounded-3xl",
            }
          }
        />
      </div>
    </>
  );
}
