import { StepOptions } from 'shepherd.js';

export const steps: StepOptions[] = [
  {
    id: 'selectVideo',
    text: 'Select the video file. Every participant should load the exact same one from their system',
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
    id: 'chatbox',
    text: "Your friends' joining will be shown here. Ask them to load the same video file",
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
    text: 'Once ready, anyone can start playing and it would sync across all participants',
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
