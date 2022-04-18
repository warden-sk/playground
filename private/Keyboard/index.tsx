/*
 * Copyright 2022 Marek Kobida
 */

import './index.css';

import React from 'react';

interface P {
  backgroundColor?: string;
  k: number | string;
  on: (key: number | string) => unknown;
}

function KeyboardKey({ backgroundColor, className, k, on, onClick, ...attributes }: JSX.IntrinsicElements['div'] & P) {
  return (
    <div
      {...attributes}
      className={[className, 'keyboard__key']}
      onClick={event => {
        on(k);

        onClick?.(event);
      }}
      p="4"
      style={{ backgroundColor }}
    >
      {k === 8 ? 'ODSTRÁNIŤ PÍSMENO' : k === 13 ? 'PRIDAŤ SLOVO' : k}
    </div>
  );
}

function Keyboard() {
  const currentWord: string[] = ['K', 'O', 'K', 'O', 'T'];

  const [input, updateInput] = React.useState<string[]>([]);
  const [words, updatedWords] = React.useState<string[][]>([]);

  function addInput(key: number | string) {
    if (typeof key === 'number') {
      if (key === 8) {
        updateInput(input.filter(($, i) => i < input.length - 1));
      }

      if (key === 13) {
        addWord();
      }

      return;
    }

    if (typeof key === 'string' && input.length === 5) {
      return;
    }

    updateInput([...input, key]);
  }

  function addWord() {
    if (input.length === 5) {
      updatedWords([input, ...words]);
      updateInput([]);
    }
  }

  function isMarked(key: number | string): string {
    if (typeof key === 'number') {
      return '';
    }

    const pismenaKtoreSiVypisal = words.flatMap(word => word);
    const pismenaKtoreSiUhadol = currentWord.filter(key => pismenaKtoreSiVypisal.includes(key));

    return pismenaKtoreSiUhadol.includes(key) ? 'rgb(0, 128, 0)' : '';
  }

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    [13, 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 8],
  ] as const;

  return (
    <>
      <div alignItems="center" className="input" display="flex" justifyContent="center" mY="4">
        {input.length !== 0 && <div mX="1">písmeno {input.length}/5</div>}
        {input.map(key => (
          <div className="input__key" mX="1" p="2">
            {key}
          </div>
        ))}
      </div>
      <div mY="4">
        {words.map((word, i) => (
          <div alignItems="center" className="input" display="flex" justifyContent="center" mY="2">
            <div mX="1">{i + 1}.</div>
            {word.map(key => (
              <div className="input__key" mX="1" p="2" style={{ backgroundColor: isMarked(key) }}>
                {key}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="keyboard">
        {rows.map(keys => (
          <div display="flex" justifyContent="center">
            {keys.map(key => (
              <div p="1">
                <KeyboardKey backgroundColor={isMarked(key)} k={key} on={addInput} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

export default Keyboard;
