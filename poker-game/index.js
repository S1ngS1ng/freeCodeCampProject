import { $, $all } from './util/query.js';
import { startButtonHandler } from './util/handler.js';
let session = null;

$('#start').onclick = startButtonHandler;

