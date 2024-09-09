import { StepOptions } from 'shepherd.js';

export const steps: StepOptions[] = [
  {
    id: 'selectVideo',
    text: 'Select a video file',
    attachTo: {
      element: '.selectVideo',
      on: 'bottom-end',
    },
  },
  {
    id: 'copyLink',
    text: 'Copy the link to invite friends',
    attachTo: {
      element: '.copyLink',
      on: 'bottom-end',
    },
  },
  {
    id: 'chatbox',
    text: 'Your friends joining will be shown here. Ask them to load the same file',
    attachTo: {
      element: '.chatbox',
      on: 'left-start',
    },
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Next',
        action: function () {
          return this.next();
        },
      },
    ],
  },
  {
    id: 'final',
    text: 'Start playing when everyone is ready',
    buttons: [
      {
        classes: 'shepherd-button-primary',
        text: 'Done',
        action: function () {
          this.trigger('tourComplete');
          return this.next();
        },
      },
    ],
  },
];
