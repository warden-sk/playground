/*
 * Copyright 2022 Marek Kobida
 */

import common from '@warden-sk/helpers/webpack/common';
import webpack from 'webpack';

const compiler = webpack(
  common({
    htmlTemplate: () => '<div id="client"></div>',
    name: 'Playground',
  })
);

compiler.watch({}, (_, __) => console.log(_, __?.toString({ colors: true })));
