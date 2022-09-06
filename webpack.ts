/*
 * Copyright 2022 Marek Kobida
 */

import common from '@warden-sk/helpers/webpack/common';
import webpack from 'webpack';

const compiler = webpack(
  common({
    htmlTemplate: () => '<div id="client"></div>',
    name: 'Playground',
    publicPath: 'http://127.0.0.1',
  })
);

compiler.watch({}, (_, __) => console.log(_, __?.toString({ colors: true })));
