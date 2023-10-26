import { MongoAbility, MongoQuery, createMongoAbility } from '@casl/ability';
import { AbilityTuple } from './ability.types';

export const initialAbilityValue: MongoAbility<
  AbilityTuple,
  MongoQuery
>['rules'] = [{ action: 'all', subject: 'public' }];

const abilities = createMongoAbility<AbilityTuple>(initialAbilityValue);

export type AppAbility = typeof abilities;

const persistedAbilities = localStorage.getItem('userAbilities');
if (persistedAbilities) {
  abilities.update(JSON.parse(persistedAbilities));
}

// eslint-disable-next-line @typescript-eslint/no-redeclare
export default abilities;
