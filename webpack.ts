/*
 * Copyright 2022 Marek Kobida
 */

import common from '@warden-sk/helpers/webpack/common';
import compileReact from '@warden-sk/helpers/webpack/compileReact';
import webpack from 'webpack';

const compiler = webpack(
  common({
    htmlTemplate: compileReact,
    name: 'Playground',
  })
);

compiler.watch({}, (_, __) => console.log(_, __?.toString({ colors: true })));
