import { Tree, Rule } from '@angular-devkit/schematics';
import { angularJsVersion } from './lib-versions';
import { serializeJson } from './fileutils';
import { Schema } from '../app/schema';

export function addUpgradeToPackageJson(): Rule {
  return (host: Tree) => {
    if (!host.exists('package.json')) return host;

    const sourceText = host.read('package.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);
    if (!json['dependencies']) {
      json['dependencies'] = {};
    }

    if (!json['dependencies']['@angular/upgrade']) {
      json['dependencies']['@angular/upgrade'] = json['dependencies']['@angular/core'];
    }
    if (!json['dependencies']['angular']) {
      json['dependencies']['angular'] = angularJsVersion;
    }

    host.overwrite('package.json', serializeJson(json));
    return host;
  };
}

export function offsetFromRoot(options: Schema): string {
  let offset = '../../../';
  if (options.directory) {
    const parts = options.directory.split('/').length;
    for (let i = 0; i < parts; ++i) {
      offset += '../';
    }
  }
  return offset;
}
