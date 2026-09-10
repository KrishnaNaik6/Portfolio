import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import React, { useState } from 'react';
import TypingText from '@/components/ui/TypingText';

describe('TypingText Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('types out text accurately character by character without skipping or duplicating letters', () => {
    const text = 'Hey there!! Welcome to my Portfolio';
    const onComplete = vi.fn();

    render(<TypingText speed={40} onComplete={onComplete}>{text}</TypingText>);

    const textSpan = screen.getByTestId('typing-text');

    // Initially empty
    expect(textSpan.textContent).toBe('');

    // Advance 40ms -> first letter "H"
    act(() => {
      vi.advanceTimersByTime(40);
    });
    expect(textSpan.textContent).toBe('H');

    // Advance to halfway (11 characters)
    act(() => {
      vi.advanceTimersByTime(40 * 10);
    });
    expect(textSpan.textContent).toBe(text.slice(0, 11));

    // Advance to end
    act(() => {
      vi.advanceTimersByTime(40 * text.length);
    });

    expect(textSpan.textContent).toBe(text);
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('handles parent re-renders and callback reference changes without restarting or duplicating letters', () => {
    const text = 'Hey there!! Welcome to my Portfolio';

    const ParentWrapper = () => {
      const [, setCount] = useState(0);
      return (
        <div>
          <button data-testid="rerender-btn" onClick={() => setCount((c) => c + 1)}>
            Re-render
          </button>
          <TypingText speed={50} onComplete={() => {}}>
            {text}
          </TypingText>
        </div>
      );
    };

    render(<ParentWrapper />);

    const textSpan = screen.getByTestId('typing-text');

    // Advance 3 characters -> "Hey"
    act(() => {
      vi.advanceTimersByTime(150);
    });
    expect(textSpan.textContent).toBe('Hey');

    // Trigger rapid parent re-renders while typing
    const btn = screen.getByTestId('rerender-btn');
    act(() => {
      btn.click();
      btn.click();
      btn.click();
    });

    // Advance another 200ms -> 4 more characters -> "Hey the"
    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(textSpan.textContent).toBe('Hey the');

    // Finish animation
    act(() => {
      vi.advanceTimersByTime(50 * text.length);
    });
    expect(textSpan.textContent).toBe(text);
  });
});
