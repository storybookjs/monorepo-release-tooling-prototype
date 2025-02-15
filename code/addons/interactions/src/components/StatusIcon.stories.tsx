import { CallStates } from '@junk-temporary-prototypes/instrumenter';
import { StatusIcon } from './StatusIcon';

export default {
  title: 'Addons/Interactions/StatusIcon',
  component: StatusIcon,
};

export const Pending = {
  args: { status: CallStates.WAITING },
};

export const Active = {
  args: { status: CallStates.ACTIVE },
};

export const Error = {
  args: { status: CallStates.ERROR },
};

export const Done = {
  args: { status: CallStates.DONE },
};
