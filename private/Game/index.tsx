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
  const currentWord: string[] = ['L', 'A', 'S', 'K', 'A'];

  const [input, updateInput] = React.useState<string[]>([]);
  const [words, updateWords] = React.useState<string[][]>([]);

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
    if (words.length === 6) {
      alert(currentWord);

      updateInput([]);
      updateWords([]);

      return;
    }

    if (input.length === 5) {
      updateInput([]);
      updateWords([...words, input]);
    }
  }

  function isMarked(key: number | string, pos?: number): string {
    if (typeof key === 'number') {
      return '';
    }

    const pismenaKtoreSiVypisal = words.flatMap(word => word);
    const pismenaKtoreSiUhadol = currentWord.filter(key => pismenaKtoreSiVypisal.includes(key));

    if (pos !== undefined) {
      return currentWord[pos] === key ? 'rgb(0, 128, 0)' : pismenaKtoreSiUhadol.includes(key) ? 'rgb(128, 128, 0)' : '';
    }

    return pismenaKtoreSiUhadol.includes(key)
      ? 'rgb(0, 128, 0)'
      : pismenaKtoreSiVypisal.includes(key)
      ? 'hsl(0, 0%, 25%)'
      : '';
  }

  const rows = [
    ['Q', 'W', 'E', 'R', 'T', 'Z', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    [13, 'Y', 'X', 'C', 'V', 'B', 'N', 'M', 8],
  ] as const;

  return (
    <div className="game" pY="4">
      <div alignItems="center" className="input" display="flex" justifyContent="center" mY="4">
        <div mX="1">písmeno {input.length}/5</div>
        {input.map(key => (
          <div className="input__key" mX="1" p="2">
            {key}
          </div>
        ))}
      </div>
      <div mY="4">
        {words.length ? (
          words.map((word, i) => (
            <div alignItems="center" className="input" display="flex" justifyContent="center" mY="2">
              <div mX="1">{i + 1}.</div>
              {word.map((key, j) => (
                <div className="input__key" mX="1" p="2" style={{ backgroundColor: isMarked(key, j) }}>
                  {key}
                </div>
              ))}
            </div>
          ))
        ) : (
          <div textAlign="center">Žiadne slová.</div>
        )}
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
    </div>
  );
}

export default Keyboard;
