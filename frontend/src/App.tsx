import "./App.css";
import * as React from "react";

const API_URL = import.meta.env.VITE_API_URL;
const SHORT_BASE_URL = import.meta.env.VITE_SHORT_BASE_URL;

function App() {
  const [resultUrl, setResultUrl] = React.useState<string>("");
  const [copied, setCopied] = React.useState<boolean>(false);

  const handleSubmit = async (
    evt: React.FormEvent<HTMLFormElement> & {
      target: { querySelector: ParentNode["querySelector"] };
    }
  ) => {
    evt.preventDefault();
    const urlInput =
      evt.target.querySelector<HTMLInputElement>("input[name='url']")!;
    setCopied(false);
    setResultUrl("");

    const res = await fetch(`${API_URL}/u`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        target: urlInput.value,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.message || "Unknown Error");
    }

    const data = await res.json();
    setResultUrl(`${SHORT_BASE_URL}/u/${data.id}`);
    urlInput.value = "";
  };

  const handleClick = (evt: React.MouseEvent<HTMLButtonElement>) => {
    evt.preventDefault();
    try {
      const copyText = document.createElement("input");
      copyText.type = "text";
      copyText.value = resultUrl;
      copyText.select();
      copyText.setSelectionRange(0, 99999);
      navigator.clipboard.writeText(resultUrl);
      setCopied(true);
    } catch (error) {
      alert(error);
    }
  };

  return (
    <>
      <h1 className="app-title">URL Shortener</h1>
      <form onSubmit={handleSubmit} className="form">
        <input required type="url" name="url" />
        <button>GENERATE</button>
      </form>
      {resultUrl.length > 0 ? (
        <div className="generated-url">
          <span>{resultUrl}</span>
          {copied ? (
            <span>Copied to clipboard!</span>
          ) : (
            <button onClick={handleClick}>Copy</button>
          )}
        </div>
      ) : null}
    </>
  );
}

export default App;
