import { collectData } from './4zida/helpers';

function main() {
  collectData(10000, 20000).then((final) => console.log(JSON.stringify(final)));
}

main();
