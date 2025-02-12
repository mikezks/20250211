// eslint-disable-next-line @softarc/sheriff/dependency-rule, @softarc/sheriff/encapsulation
import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

const domainApiTag = ({ from, to }) => {
  const getDomainTagDetails = (tag: string) => {
    const [, domainName] = tag.split(':');
    const [source,, target] = domainName.split('-');
    return { source, target };
  }

  const checkNotUndefined = (from: string, to: string) => !!(from && to && from === to);

  return checkNotUndefined(
    getDomainTagDetails(from).source,
    getDomainTagDetails(to).target
  ) || checkNotUndefined(
    getDomainTagDetails(from).source,
    getDomainTagDetails(to).source
  );
}

/**
  * Minimal configuration for Sheriff
  * Assigns the 'noTag' tag to all modules and
  * allows all modules to depend on each other.
  */

export const config: SheriffConfig = {
  enableBarrelLess: true,
  showWarningOnBarrelCollision: false,
  modules: {
    apps: {
      '<domain>': ['domain:<domain>', 'type:app']
    },
    libs: {
      domain: {
        '<domain>': {
          'src': ['domain:<domain>', 'type:public'],
          'src/lib/api-<target>': ['domain:<domain>-api-<target>', 'type:api'],
          'src/lib/<type>-<a>-<b>': ['domain:<domain>', 'type:<type>'],
          'src/lib/<type>-<a>': ['domain:<domain>', 'type:<type>'],
        }
      },
      shared: {
        '<shared-name>': {
          'src': ['domain:shared', 'type:public'],
          'src/lib/<type>-<a>-<b>': ['domain:shared', 'type:<type>'],
          'src/lib/<type>-<a>': ['domain:shared', 'type:<type>'],
        }
      },
    }
  }, // apply tags to your modules
  depRules: {
    // root is a virtual module, which contains all files not being part
    // of any module, e.g. application shell, main.ts, etc.
    // 'root': 'noTag',
    // 'noTag': ['noTag', 'root'],
    'domain:*': [sameTag, domainApiTag, 'domain:shared'],
    'domain:shell': ['domain:*'],
    'type:*': ['type:public'],
    'type:public': ['type:api', 'type:route', 'type:feature', 'type:ui', 'type:logic', 'type:util'],
    'type:route': ['type:feature', 'type:logic'],
    'type:api': ['type:ui', 'type:logic', 'type:util'],
    'type:feature': ['type:api', 'type:ui', 'type:logic', 'type:util'],
    'type:ui': ['type:logic', 'type:util'],
    'type:logic': ['type:util']
    // add your dependency rules here
  },
};
