import { injectReducer } from '@capital/shared/redux/configureStore/helper';

import actor from './reducers/actor';

injectReducer('actor', actor);
