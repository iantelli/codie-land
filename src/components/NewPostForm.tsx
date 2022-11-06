import { FormEventHandler, useState } from "react";

import CodeEditor from "./CodeEditor";
import Button from "./Button";
import LanguageDropdown from "./LanguageDropdown";

export default function NewPostForm({
  defaultLanguage = "markdown",
  defaultCode = "",
  onSubmit,
  onChange,
  className = "",
}: {
  defaultLanguage?: string;
  defaultCode?: string;
  onSubmit: (code: string, language: string) => void;
  onChange?: (value: string | undefined) => void;
  className?: string;
}) {
  const [code, setCode] = useState(defaultCode);
  const [language, setLanguage] = useState(defaultLanguage);

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    onSubmit?.(code, language);
  };

  const handleChange = (value: string | undefined) => {
    setCode(value || "");
    onChange?.(value);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={"mt-8 space-y-6 " + className}
      action="#"
      method="POST"
    >
      <input type="hidden" name="remember" value="true" />
      <div className="-space-y-px rounded-md shadow-sm">
        <div>
          <LanguageDropdown
            // buttonClassName="rounded-none rounded-t-xl"
            // optionsClassName="rounded-none rounded-b-xl"
            optionsClassName="mt-1"
            language={language}
            onChange={setLanguage}
          />
          <CodeEditor
            // className="rounded-none rounded-b-xl"
            className="mt-5"
            value={code}
            onChange={handleChange}
            language={language}
            id="code"
            name="code"
          />

          <Button>Push!</Button>
        </div>
      </div>
    </form>
  );
}
