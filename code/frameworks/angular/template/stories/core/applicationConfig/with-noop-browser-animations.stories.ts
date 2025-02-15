import { Meta, StoryObj } from '@junk-temporary-prototypes/angular';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { within, userEvent } from '@storybook/testing-library';
import { expect } from '@storybook/jest';
import { importProvidersFrom } from '@angular/core';
import { OpenCloseComponent } from '../moduleMetadata/angular-src/open-close-component/open-close.component';

const meta: Meta = {
  component: OpenCloseComponent,
};

export default meta;

type Story = StoryObj<typeof OpenCloseComponent>;

export const WithNoopBrowserAnimations: Story = {
  render: () => ({
    template: `<app-open-close></app-open-close>`,
    applicationConfig: {
      providers: [importProvidersFrom(NoopAnimationsModule)],
    },
    moduleMetadata: {
      declarations: [OpenCloseComponent],
    },
  }),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const opened = canvas.getByText('The box is now Open!');
    expect(opened).toBeDefined();
    const submitButton = canvas.getByRole('button');
    await userEvent.click(submitButton);
    const closed = canvas.getByText('The box is now Closed!');
    expect(closed).toBeDefined();
  },
};
