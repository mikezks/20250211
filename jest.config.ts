// eslint-disable-next-line @softarc/sheriff/dependency-rule, @softarc/sheriff/encapsulation
import { getJestProjectsAsync } from '@nx/jest';

export default async () => ({
  projects: await getJestProjectsAsync(),
});
