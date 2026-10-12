import { required } from '@feral-auth/ts-simple-dsl';

/**
 * Parameter declarations shared across the page and component objects, so
 * every one asks the same question with the same word.
 */

/** The name a spec gives something, to refer to it in a later step. */
export const alias = () => required();

/** What a step should do, e.g. `expect: succeeds | is rejected`. A typo fails at parse time. */
export const outcome = (...values) => required().allowedValues(...values);
