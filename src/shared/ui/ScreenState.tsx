import type { ReactNode } from 'react';

import { ErrorState, LoadingState, EmptyState } from './StatusStates';

export type ScreenStatus =
  | { kind: 'loading'; label?: string }
  | { kind: 'empty'; title: string; copy: string }
  | { kind: 'error'; copy?: string; onRetry: () => void; title?: string }
  | { kind: 'success' };

interface ScreenStateProps {
  children: ReactNode;
  state: ScreenStatus;
}

/**
 * Shared async state boundary for every View.
 * Success is the only state that renders feature-specific UI.
 */
export function ScreenState({ children, state }: ScreenStateProps) {
  switch (state.kind) {
    case 'loading':
      return <LoadingState label={state.label} />;
    case 'empty':
      return <EmptyState copy={state.copy} title={state.title} />;
    case 'error':
      return <ErrorState copy={state.copy} onRetry={state.onRetry} title={state.title} />;
    case 'success':
      return <>{children}</>;
  }
}
