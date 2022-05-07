import React, { useState, useEffect } from "react";
import { Button, Card, Form, Templates, Wrapper } from "./styles";
import qs from "qs";

export default function Home() {
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [boxes, setBoxes] = useState([]);
  const [generatedMeme, setGeneratedMeme] = useState(null);

  useEffect(() => {
    (async () => {
      const response = await fetch("https://api.imgflip.com/get_memes");
      const {
        data: { memes },
      } = await response.json();
      setTemplates(memes);
    })();
  }, []);

  const handleInputChange = (index) => (e) => {
    const newValues = boxes;
    newValues[index] = e.target.value;
    setBoxes(newValues);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const params = qs.stringify({
      template_id: selectedTemplate.id,
      username: "GabrielDisonDeLimareis",
      password: "6q6deMqbYK@gpVs",
      boxes: boxes.map((text) => ({ text })),
    });

    const resp = await fetch(`https://api.imgflip.com/caption_image?${params}`);
    const {
      data: { url },
    } = await resp.json();

    setGeneratedMeme(url);
  };

  const handleSelectTemplate = (template) => {
    setSelectedTemplate(template);
    setBoxes([]);
  };

  const handleReset = () => {
    setSelectedTemplate(null);
    setBoxes([]);
    setGeneratedMeme(null);
  };

  return (
    <Wrapper>
      <h1>MEMEMAKER</h1>
      <Card>
        {generatedMeme && (
          <>
            <img src={generatedMeme} alt="generatedMeme" />
            <Button type="button" onClick={handleReset}>
              Criar outro meme
            </Button>
          </>
        )}
        {!generatedMeme && (
          <>
            <h2>Selecione o template</h2>
            <Templates>
              {templates.map((template) => (
                <button
                  key={template.id}
                  type="button"
                  onClick={() => handleSelectTemplate(template)}
                  className={
                    template.id === selectedTemplate?.id ? "selected" : ""
                  }
                >
                  <img src={template.url} alt={template.name} />
                </button>
              ))}
            </Templates>
            {selectedTemplate && (
              <>
                <h2>Textos</h2>
                <Form onSubmit={handleSubmit}>
                  {new Array(selectedTemplate.box_count)
                    .fill("")
                    .map((_, index) => (
                      <input
                        placeholder={`Text #${index + 1}`}
                        key={String(Math.random())}
                        onChange={handleInputChange(index)}
                      />
                    ))}
                  <Button type="submit">MakeMyMeme!</Button>
                </Form>
              </>
            )}
          </>
        )}
      </Card>
    </Wrapper>
  );
}
