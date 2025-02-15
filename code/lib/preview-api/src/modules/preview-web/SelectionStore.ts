import type { ViewMode, Args, StoryId } from '@junk-temporary-prototypes/types';
import type { StorySpecifier } from '../store/StoryIndexStore';

export interface SelectionSpecifier {
  storySpecifier: StorySpecifier;
  viewMode: ViewMode;
  args?: Args;
  globals?: Args;
}

export interface Selection {
  storyId: StoryId;
  viewMode: ViewMode;
}

export interface SelectionStore {
  selectionSpecifier: SelectionSpecifier | null;

  selection?: Selection;

  setSelection(selection: Selection): void;

  setQueryParams(queryParams: qs.ParsedQs): void;
}
