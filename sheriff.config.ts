import { sameTag, SheriffConfig } from '@softarc/sheriff-core';

/**
  * Minimal configuration for Sheriff
  * Assigns the 'noTag' tag to all modules and
  * allows all modules to depend on each other.
  */

export const config: SheriffConfig = {
  modules: {
    apps: {
      '<domain>': ['domain:<domain>', 'type:app']
    },
    libs: {
      shared: {
        '<name>': {
          '<type>-*': ['domain:shared', 'type:<type>']
        }
      },
      '<domain>': {
        '<type>-*': ['domain:<domain>', 'type:<type>']
      },
    }
  }, // apply tags to your modules
  enableBarrelLess: true,
  depRules: {
    // root is a virtual module, which contains all files not being part
    // of any module, e.g. application shell, main.ts, etc.
    'root': 'noTag',
    'noTag': 'noTag',
    'domain:*': [sameTag, 'domain:shared'],
    'type:feature': ['type:ui', 'type:logic', 'type:util'],
    'type:ui': ['type:logic', 'type:util'],
    'type:logic': ['type:util']
    // add your dependency rules here
  },
};
